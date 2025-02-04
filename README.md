# YouTubeGist - 유튜브 동영상 분석기

유튜브 동영상의 내용을 자동으로 요약하고 분석하는 웹 애플리케이션입니다.

👉 [시작하기](#시작하기)

## 주요 기능

### 동영상 분석
- 유튜브 URL 입력으로 간편한 분석 시작
- 실시간 진행 상황 확인
- 긴 영상도 자동으로 분할 처리

### 내용 요약
- 동영상 전체 내용의 핵심 요약 제공
- 주요 내용을 한국어로 정리
- GPT-4를 활용한 고품질 요약

### 타임스탬프
- 주요 내용별 타임스탬프 자동 생성
- 시간대별 핵심 내용 정리
- 원하는 부분으로 빠른 이동 가능

### 사용자 편의 기능
- 다크/라이트 모드 지원
- 모바일 환경 최적화
- 자동 스크롤로 진행 상황 실시간 확인
- 직관적인 인터페이스

## 시작하기

### 환경 설정

1. 프로젝트 클론 및 의존성 설치:
```bash
git clone [repository-url]
cd youtube-summary
npm install
```

2. 환경 변수 설정:
- `.env.development.local` 파일을 생성하고 `.env.development` 파일을 참고하여 필요한 값들을 설정합니다.
- 실제 값들은 각각의 서비스에서 발급받아 설정해야 합니다.

### Google API 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성합니다.
2. OAuth 동의 화면을 설정하고 필요한 API를 활성화합니다.
3. OAuth 2.0 클라이언트 ID를 생성하고 환경 변수에 설정합니다.

> ⚠️ 자세한 개발 환경 설정 방법은 [개발 가이드](docs/development.md)를 참고해주세요.

### 개발 서버 실행

```bash
npm run dev
```

기본적으로 http://localhost:3000 에서 애플리케이션에 접속할 수 있습니다.

> ℹ️ 포트 3000이 이미 사용 중인 경우:
> - 자동으로 다른 포트(예: 3001, 3002 등)에서 실행됩니다.
> - 실제 실행된 포트는 콘솔에서 확인할 수 있습니다.
> - 이 경우 [Google OAuth 설정 가이드](docs/google-oauth-setup.md)를 참고하여 Google Cloud Console에서 **승인된 자바스크립트 원본**과 **승인된 리디렉션 URI**를 새로운 포트로 업데이트해야 합니다.

## 사용 방법

1. 분석하고 싶은 유튜브 영상의 URL을 입력합니다.
2. '분석하기' 버튼을 클릭합니다.
3. 실시간으로 진행되는 분석 과정을 확인합니다.
4. 완료 후 요약된 내용과 타임스탬프를 확인합니다.

## 기술 스택

- Frontend: Next.js, React, TypeScript
- Authentication: NextAuth.js, Google OAuth
- AI/ML: OpenAI GPT-4, Whisper API
- API: YouTube Data API v3
- Styling: CSS Modules

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
