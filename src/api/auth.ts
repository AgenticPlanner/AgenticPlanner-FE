import apiClient from './client';

export const loginUser = async (user_name: string, password: string) => {
    const response = await apiClient.post('/api/v1/auth/login/', {
        username: user_name,
        password,
    });

    const { access, refresh } = response.data;

    if (access) {
        localStorage.setItem('accessToken', access);
    }
    if (refresh) {
        localStorage.setItem('refreshToken', refresh);
    }

    return response.data;
};

export const registerUser = async (email: string, password: string, user_name: string) => {
    const response = await apiClient.post('/api/v1/users/register/', {
        email,
        password,
        username: user_name,
    });

    return response.data;
};