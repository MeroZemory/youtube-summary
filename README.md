# YouTubeGist - 유튜브 동영상 분석기

유튜브 동영상의 내용을 자동으로 요약하고 분석하는 웹 애플리케이션입니다.

> ⚠️ **주의사항**: 짧은 시간 내에 너무 많은 동영상 분석을 시도하면 YouTube에 의해 IP가 일시적으로 차단될 수 있습니다 (HTTP 500 에러). 이 경우 일정 시간이 지난 후에 다시 시도해주세요.

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
git clone https://github.com/MeroZemory/youtube-summary.git
cd youtube-summary
npm install
```

2. 환경 변수 설정:
- `.env.development.local` 파일을 생성하고 `.env.development` 파일을 참고하여 필요한 값들을 설정합니다.
- 필수 값:
  - `OPENAI_API_KEY`: OpenAI API 키
  - `NEXTAUTH_SECRET`: JWT 토큰 암호화 키 (개발 환경에서는 임의의 문자열 사용 가능)

> ℹ️ **NEXTAUTH_SECRET 설정**:
> - 개발 환경: 임의의 문자열을 사용해도 됩니다.
> - 배포 환경: 반드시 안전한 랜덤 값을 사용해야 합니다. (예: `openssl rand -base64 32` 명령어로 생성)
> - 이 값은 JWT 토큰 암호화와 쿠키 보안에 사용되므로, 프로덕션 환경에서는 필수입니다.

### Google API 설정 (선택 사항)

현재는 Google 로그인 기능만 구현되어 있으며, 이 기능이 필요한 경우에만 설정하시면 됩니다.

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
> - Google 로그인 기능을 사용하는 경우, Google Cloud Console에서 **승인된 자바스크립트 원본**과 **승인된 리디렉션 URI**를 새로운 포트로 업데이트해야 합니다.

## 사용 방법

1. 분석하고 싶은 유튜브 영상의 URL을 입력합니다.
2. '분석하기' 버튼을 클릭합니다.
3. 실시간으로 진행되는 분석 과정을 확인합니다.
4. 완료 후 요약된 내용과 타임스탬프를 확인합니다.

## 기술 스택

- Frontend: Next.js, React, TypeScript
- Authentication: NextAuth.js, Google OAuth (선택 사항)
- AI/ML: OpenAI GPT-4, Whisper API
- Styling: CSS Modules

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
