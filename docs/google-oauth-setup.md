# Google OAuth 설정 가이드

이 문서는 YouTubeGist 프로젝트에서 Google OAuth를 설정하는 방법을 상세히 설명합니다.

## 목차

- [Google OAuth 설정 가이드](#google-oauth-설정-가이드)
  - [목차](#목차)
  - [1. Google Cloud Console 설정](#1-google-cloud-console-설정)
  - [2. OAuth 동의 화면 설정](#2-oauth-동의-화면-설정)
  - [3. 사용자 인증 정보 설정](#3-사용자-인증-정보-설정)
  - [4. 환경 변수 설정](#4-환경-변수-설정)

## 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 프로젝트를 선택합니다.
3. 좌측 메뉴에서 "API 및 서비스"로 이동합니다.

## 2. OAuth 동의 화면 설정

1. "OAuth 동의 화면" 메뉴로 이동합니다.
2. "게시 상태" 확인:
   - "테스트"로 설정되어 있는지 확인
   - 아니라면 "테스트"로 변경
3. 테스트 사용자 추가:
   - "테스트 사용자" 섹션으로 이동
   - [+ ADD USERS] 버튼 클릭
   - 개발에 사용할 Google 계정의 이메일 주소 추가
   - 저장
4. 승인된 도메인 확인:
   - "승인된 도메인" 섹션에서 `localhost` 확인
   - 없다면 추가 후 저장
5. OAuth 범위 설정:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

## 3. 사용자 인증 정보 설정

1. "사용자 인증 정보" 메뉴로 이동합니다.
2. OAuth 2.0 클라이언트 ID를 클릭합니다.
3. 다음 설정이 정확히 되어 있는지 확인:
   - 승인된 자바스크립트 원본:
     ```
     http://localhost:3000
     ```
     ⚠️ 주의: 끝에 슬래시(/)를 포함하지 않아야 합니다
   - 승인된 리디렉션 URI:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
     ⚠️ 주의: 전체 경로를 정확히 입력해야 합니다

## 4. 환경 변수 설정

1. `.env.development.local` 파일에 다음 값들을 설정합니다:
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

2. 브라우저 요구사항:
   - Chrome 브라우저 사용 권장
   - 일반 모드에서 접속 (시크릿 모드 사용 시 문제 발생 가능)
   - 팝업 차단 해제:
     - Chrome 설정 → 개인정보 및 보안 → 사이트 설정 → 팝업 및 리디렉션
     - `localhost:3000`을 허용 목록에 추가 