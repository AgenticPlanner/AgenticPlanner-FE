import axios from 'axios';

// 기본 인스턴스 생성
const apiClient = axios.create({
    // 환경변수가 없으면 로컬 백엔드 바라봄
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// 토큰 자동 부착 인터셉터 (로컬로 테스트 할 때만 localStorage 사용. 실제 배포에서는 HttpOnly 쿠키로 변경 예정)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 토큰/에러 관리를 위한 Response 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 에러가 401(권한 없음)이고, 아직 재시도를 안 한 요청일 때만 실행
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지용

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('리프레시 토큰이 없습니다.');
                }

                // 백엔드 주소로 새 토큰 요청
                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/api/v1/auth/token/refresh/`,
                    { refresh: refreshToken } // SimpleJWT가 요구하는 파라미터 이름
                );

                // 새 토큰을 로컬 스토리지에 저장
                const { access, refresh } = response.data;
                localStorage.setItem('accessToken', access);

                // (백엔드 설정에 따라 refresh 토큰도 새로 줄 경우 업데이트)
                if (refresh) {
                    localStorage.setItem('refreshToken', refresh);
                }

                // 방금 실패했던 원래 요청의 헤더를 새 토큰으로 갈아끼움
                originalRequest.headers.Authorization = `Bearer ${access}`;

                // 원본 요청 다시 실행
                return apiClient(originalRequest);

            } catch (refreshError) {
                // 리프레시 토큰마저 만료되었거 없는 경우 -> 로그아웃 처리
                console.error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // 필요하다면 여기서 로그인 페이지로 강제 이동
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;