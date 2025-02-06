# 개발 환경 설정 가이드

이 문서는 YouTubeGist 프로젝트의 기본적인 개발 환경 설정 가이드를 제공합니다.

## 목차

- [개발 환경 설정 가이드](#개발-환경-설정-가이드)
  - [목차](#목차)
  - [필수 설정](#필수-설정)
    - [기본 환경 설정](#기본-환경-설정)
    - [환경 변수 설정](#환경-변수-설정)
  - [선택적 설정](#선택적-설정)
    - [Google OAuth 설정](#google-oauth-설정)
  - [개발 서버 실행](#개발-서버-실행)
  - [문제 해결](#문제-해결)

## 필수 설정

### 기본 환경 설정

1. Node.js 설치:
   - Node.js 18.0.0 이상 버전 설치
   - npm 9.0.0 이상 버전 확인

2. 프로젝트 클론:
   ```bash
   git clone [repository-url]
   cd youtube-summary
   ```

3. 의존성 설치:
   ```bash
   npm install
   ```

### 환경 변수 설정

1. 환경 변수 파일 생성:
   ```bash
   cp .env.development .env.development.local
   ```

2. 필수 환경 변수 설정:
   - `OPENAI_API_KEY`: OpenAI API 키
     - [OpenAI 웹사이트](https://platform.openai.com/api-keys)에서 발급
     - GPT-4 API 사용 권한 필요
   - `NEXTAUTH_SECRET`: JWT 토큰 암호화 키
     - 개발 환경: 임의의 문자열 사용 가능
     - 배포 환경: `openssl rand -base64 32` 명령어로 생성

## 선택적 설정

### Google OAuth 설정

> ℹ️ 이 설정은 Google 로그인 기능을 사용하려는 경우에만 필요합니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. OAuth 동의 화면 설정
3. OAuth 2.0 클라이언트 ID 생성
4. 환경 변수 설정:
   - `GOOGLE_CLIENT_ID`: OAuth 2.0 클라이언트 ID
   - `GOOGLE_CLIENT_SECRET`: OAuth 2.0 클라이언트 보안 비밀

## 개발 서버 실행

1. 개발 서버 시작:
   ```bash
   npm run dev
   ```

2. 브라우저에서 확인:
   - 기본 URL: http://localhost:3000
   - 자동 변경 감지 및 반영 (HMR)

## 문제 해결

- **포트 3000이 사용 중인 경우**:
  - 자동으로 다른 포트(3001, 3002 등)에서 실행됨
  - 터미널에서 실제 실행된 포트 확인 가능

- **Google 로그인 관련 문제**:
  - Google Cloud Console에서 승인된 리디렉션 URI가 올바르게 설정되었는지 확인
  - 개발 환경의 경우 `http://localhost:3000`이 승인된 JavaScript 원본에 포함되어 있는지 확인

- **API 키 관련 문제**:
  - 환경 변수가 올바르게 설정되었는지 확인
  - OpenAI API 키의 권한 범위 확인 