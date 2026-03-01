프로젝트 설정 및 실행 가이드

## 1. 저장소 클론
```bash
git clone <repository-url>
cd agentic-planner-fe
```

## 2. Node.js 및 pnpm 확인
- **Node.js** 16.x 이상 설치 확인:
```bash
node --version
```

- **pnpm** 설치 (미설치 시):
```bash
npm install -g pnpm
```

## 3. 의존성 설치
```bash
pnpm install
```

이 명령어는 pnpm-lock.yaml 파일을 기반으로 모든 필요한 패키지를 설치합니다.

## 4. 개발 서버 실행
```bash
pnpm run dev
```

개발 서버가 시작되며, 일반적으로 `http://localhost:5173` (또는 다른 포트)에서 접근 가능합니다.

## 주요 기술 스택
- **React** + **TypeScript**
- **Vite** (번들러)
- **Tailwind CSS** (스타일링)
- **pnpm** (패키지 매니저)

이제 브라우저에서 앱을 볼 수 있습니다! 🚀
