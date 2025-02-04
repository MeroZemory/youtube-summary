# YouTubeGist - 유튜브 동영상 분석기

유튜브 동영상의 내용을 자동으로 요약하고 분석하는 웹 애플리케이션입니다.

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

이제 http://localhost:3000 에서 애플리케이션에 접속할 수 있습니다.

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
