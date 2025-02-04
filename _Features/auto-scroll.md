# 자동 스크롤 기능

## 개요
진행 상황을 표시하는 영역에서 새로운 내용이 추가될 때마다 자동으로 스크롤이 아래로 이동하는 기능입니다. 사용자의 스크롤 인터랙션을 자연스럽게 처리하여 좋은 사용자 경험을 제공합니다.

## 주요 기능

### 1. 자동 스크롤 상태 관리
- `autoScrollEnabled`: 자동 스크롤의 활성화 상태를 관리하는 ref
- `lastTargetScrollPosition`: 마지막 스크롤 목표 위치를 저장하는 ref

### 2. 스크롤 이벤트 처리
- **스크롤 시작 (사용자가 스크롤을 잡을 때)**
  - `mousedown` 또는 `touchstart` 이벤트 발생 시
  - 자동 스크롤 즉시 비활성화
  
- **스크롤 종료 (사용자가 스크롤을 놓을 때)**
  - `mouseup` 또는 `touchend` 이벤트 발생 시
  - 현재 스크롤 위치를 확인하여 자동 스크롤 상태 결정
  - progress 컴포넌트 영역 내에 있으면 자동 스크롤 활성화

### 3. 자동 스크롤 동작
- progress 업데이트마다 실행
- 스크롤 위치 계산:
  ```javascript
  const targetScroll = window.scrollY + progressRect.bottom - windowHeight + 100;
  ```
  - `windowHeight`: 브라우저 창의 높이
  - `progressRect.bottom`: progress 컴포넌트의 하단 위치
  - `100`: 여유 공간 (px)

### 4. 자동 스크롤 활성화 조건
- progress 컴포넌트 영역 내에서 스크롤이 위치할 때
- 계산식:
  ```javascript
  currentScroll >= progressTop - 50 && currentScroll <= progressBottom
  ```
  - `progressTop`: progress 컴포넌트의 상단 위치
  - `progressBottom`: progress 컴포넌트의 하단 위치
  - `50`: 상단 여유 공간 (px)

### 5. 상태 표시
- 화면 우측 상단에 현재 자동 스크롤 상태 표시
- 활성화/비활성화 상태를 시각적으로 확인 가능

## 사용자 경험 (UX) 고려사항
1. **자연스러운 스크롤 제어**
   - 사용자가 스크롤을 잡는 순간 자동 스크롤 해제
   - 스크롤을 놓을 때 위치에 따라 자동으로 상태 결정

2. **직관적인 상태 표시**
   - 현재 자동 스크롤 상태를 항상 확인 가능
   - 상태 변경 시 즉시 반영

3. **여유 공간 확보**
   - 스크롤 시 컴포넌트 하단에 100px의 여유 공간
   - 상단 활성화 영역에 50px의 버퍼 존

## 초기화
새로운 요청 시:
```javascript
autoScrollEnabled.current = true;
lastTargetScrollPosition.current = null;
```
