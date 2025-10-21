# Action Guide Collector

액션가이드를 수집, 수정, 삭제하는 웹 애플리케이션입니다. Langfuse observation과 통합하여 프롬프트 비교 및 테스트가 가능합니다.

## 주요 기능

### 📊 대시보드
- 액션가이드 목록 조회
- 액션가이드 추가/수정/삭제
- 상태별 필터링 (초안, 활성, 보관)
- 검색 기능
- JSON 형식으로 데이터 관리

### 🧪 테스트
- Langfuse Observation ID로 프롬프트 불러오기
- 원본과 수정본 side-by-side 비교
- `<action_guide>` 태그 자동 파싱
- 수정된 프롬프트로 LLM 실행 (목업)
- Diff 뷰어 (텍스트/JSON)
- 테스트 완료된 액션가이드를 대시보드에 저장

### ⚙️ 설정
- 백엔드 API 엔드포인트 설정
- 로컬 데이터 내보내기/가져오기 (JSON)
- 백엔드 동기화 준비
- 버전 히스토리 조회

## 기술 스택

- **프론트엔드**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: TailwindCSS
- **상태 관리**: Zustand
- **아이콘**: React Icons
- **로컬 저장소**: LocalStorage
- **Diff**: diff 라이브러리

## 디렉토리 구조

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, Layout
│   ├── common/          # Button, Input, Modal, Card
│   ├── dashboard/       # ActionGuideCard, ActionGuideModal
│   └── test/            # PromptView, ActionGuideView, ResponseView, etc.
├── pages/               # Dashboard, Test, Settings
├── stores/              # Zustand 스토어
├── services/            # localStorage 서비스
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
└── App.tsx
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 사용법

### 1. 대시보드에서 액션가이드 추가

1. "새 액션가이드" 버튼 클릭
2. 이름, 버전, 설명 입력
3. JSON 데이터 작성
4. 저장

### 2. 테스트 페이지에서 프롬프트 비교

1. Langfuse Observation ID 입력 (현재는 목업 데이터 사용)
2. "불러오기" 클릭
3. 원본과 수정본이 나란히 표시됨
4. 수정본에서 프롬프트 편집
5. 파싱된 Action Guide 자동 업데이트
6. "LLM 실행" 클릭하여 수정된 프롬프트 테스트
7. Diff 뷰어로 변경사항 확인
8. "액션가이드로 저장" 클릭하여 대시보드에 추가

### 3. 설정에서 데이터 관리

- 로컬 데이터를 JSON으로 내보내기/가져오기
- 백엔드 API 설정 (추후 연동 예정)

## 데이터 형식

### Action Guide 예시

```json
{
  "name": "Login Flow",
  "version": "1.0.0",
  "description": "사용자 로그인 플로우",
  "status": "active",
  "data": {
    "steps": [
      {
        "id": "step1",
        "action": "navigate",
        "target": "https://example.com"
      },
      {
        "id": "step2",
        "action": "click",
        "selector": "#login-button"
      }
    ]
  }
}
```

## 백엔드 연동

현재는 로컬 스토리지를 사용하지만, 백엔드 연동을 위한 인터페이스가 준비되어 있습니다.

설정 페이지에서 백엔드 API 엔드포인트를 설정하면 추후 동기화가 가능합니다.

## 라이선스

MIT

## 개발자

Action Guide Collector v1.0.0
