# 문제 해결 가이드

이 문서는 YouTubeGist 프로젝트 개발 중 발생할 수 있는 일반적인 문제들과 해결 방법을 설명합니다.

## Google OAuth 관련 문제

### 1. "올바르지 않은 출처" 오류

**증상**: URI는 경로를 포함하거나 '/'로 끝날 수 없습니다.

**해결 방법**:
1. Google Cloud Console 접근 경로:
   - APIs 및 서비스 → 사용자 인증 정보 → OAuth 2.0 Client ID
   - 해당하는 OAuth 클라이언트 ID 선택 (예: `YouTubeGist Web Client`)
   - "승인된 자바스크립트 원본" 섹션에서 URI 설정

2. URI 설정:
   - `http://localhost:3000`으로 정확히 설정 (끝에 슬래시 없이)
   - 경로(/path)가 포함되어 있다면 제거

### 2. "redirect_uri_mismatch" 오류

**증상**: 이 앱에서 잘못된 요청을 전송했으므로 로그인할 수 없습니다.

**해결 방법**:
- 승인된 리디렉션 URI가 정확히 일치하는지 확인
- `http://localhost:3000/api/auth/callback/google` 정확히 입력
- 대소문자 구분에 주의
- 끝에 추가 슬래시가 없는지 확인

### 3. "This browser or app may not be secure" 오류

**증상**: 
- "This browser or app may not be secure. Learn more"
- "Try using a different browser. If you're already using a supported browser, you can try again to sign in."

**원인**:
Google은 다음과 같은 브라우저에서의 로그인을 제한합니다:
1. JavaScript가 비활성화된 브라우저
2. 안전하지 않거나 지원되지 않는 확장 프로그램이 설치된 브라우저
3. 소프트웨어 자동화를 통해 제어되는 브라우저
4. 다른 애플리케이션에 임베드된 브라우저

**해결 방법**:

1. 지원되는 브라우저 사용:
   - Chrome (권장)
   - Firefox
   - Safari
   - Edge
   - Opera

2. JavaScript 활성화:
   - Chrome 설정 → 개인정보 및 보안 → 사이트 설정 → JavaScript
   - JavaScript 허용으로 설정

3. 브라우저 확장 프로그램 확인:
   - 모든 확장 프로그램 일시적으로 비활성화
   - 특히 자동화 도구나 보안 관련 확장 프로그램 확인

4. 문제 해결 순서:
   1. Chrome 최신 버전 사용
   2. 모든 확장 프로그램 비활성화
   3. JavaScript 설정 확인
   4. 일반 모드에서 시도 (시크릿 모드 사용 X)

⚠️ 주의: 
- 회사 컴퓨터를 사용하는 경우 보안 정책으로 인해 제한될 수 있습니다.
- 다른 애플리케이션에 임베드된 브라우저는 지원되지 않습니다.
- IDE의 디버거로 실행된 Chrome에서는 Google 로그인이 제한됩니다.
  - 디버거로 실행된 브라우저는 "소프트웨어 자동화를 통해 제어되는 브라우저"로 간주됨
  - 개발/테스트 시에는 별도의 일반 Chrome 창을 사용해야 함

### 4. 디버거 모드에서의 개발

**권장 개발 방법**:
1. 디버거로 실행된 Chrome: 
   - 개발 및 디버깅 작업
   - Google 로그인이 필요 없는 기능 테스트

2. 별도의 일반 Chrome:
   - Google 로그인 테스트
   - OAuth 인증 관련 기능 테스트

## 환경 변수 관련 문제

### 1. 환경 변수 로드 실패

**증상**: 환경 변수를 찾을 수 없습니다.

**해결 방법**:
- `.env.development.local` 파일이 존재하는지 확인
- 파일 이름이 정확한지 확인 (숨김 파일 표시 설정 확인)
- 환경 변수 이름이 정확한지 확인
- 개발 서버 재시작

### 2. OAuth 설정 문제

**증상**: OAuth 인증이 작동하지 않습니다.

**해결 방법**:
- OAuth 동의 화면에서 필수 범위가 모두 설정되어 있는지 확인:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- 테스트 사용자로 등록된 계정으로 로그인 시도
- 환경 변수가 올바르게 설정되어 있는지 확인

## 기타 문제 해결

### 1. 개발 서버 문제

**증상**: 개발 서버가 정상적으로 시작되지 않습니다.

**해결 방법**:
- 포트 3000이 사용 가능한지 확인
- node_modules 삭제 후 재설치
- 개발 서버 완전 재시작

### 2. 브라우저 관련 문제

**해결 방법**:
- 브라우저 캐시 삭제
- 쿠키 삭제
- 새 브라우저 창에서 시도
- Chrome 최신 버전 사용 