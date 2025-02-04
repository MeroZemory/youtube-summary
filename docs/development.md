# 개발 환경 설정 가이드

이 문서는 YouTubeGist 프로젝트의 기본적인 개발 환경 설정 가이드를 제공합니다.

## 목차

- [개발 환경 설정 가이드](#개발-환경-설정-가이드)
  - [목차](#목차)
  - [시작하기](#시작하기)
  - [환경 변수 설정](#환경-변수-설정)
  - [개발 서버 실행](#개발-서버-실행)
  - [추가 설정 가이드](#추가-설정-가이드)

## 시작하기

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

## 환경 변수 설정

1. 환경 변수 파일 생성:
   ```bash
   cp .env.development .env.development.local
   ```

2. 필요한 API 키 및 설정 추가:
   - Google OAuth 설정 ([설정 방법](./google-oauth-setup.md))
   - OpenAI API 키 설정
   - 기타 필요한 환경 변수 설정

## 개발 서버 실행

1. 개발 서버 시작:
   ```bash
   npm run dev
   ```

2. 브라우저에서 확인:
   - http://localhost:3000 접속
   - 변경 사항 자동 반영 (HMR)

## 추가 설정 가이드

- [Google OAuth 설정 가이드](./google-oauth-setup.md)
- [문제 해결 가이드](./troubleshooting.md) 