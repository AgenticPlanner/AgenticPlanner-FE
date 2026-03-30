# Git 컨벤션

## 브랜치 네이밍

```
feat/feature-name        # 새 기능
UI/component-name        # 스타일·디자인 변경
fix/bug-description      # 버그 수정
refactor/what-changed    # 리팩토링
chore/task-description   # 설정, 의존성, 툴링
docs/what-changed        # 문서
```

## 브랜치 흐름

```
main ← develop ← feature branch
```
- feature 브랜치는 반드시 `develop`에서 분기
- PR 대상은 항상 `develop`
- `main`으로 직접 push 금지

## 커밋 메시지 형식

```
{브랜치명}

{type}: 한 줄 요약 (명령형, 72자 이내)

- 상세 내용 1
- 상세 내용 2
```

예시:
```
feat/chat-integration

feat: 챗봇 대화 세션 생성 및 메시지 전송 구현

- POST /api/chat/session 호출로 세션 ID 발급
- 메시지 전송 시 세션 ID 헤더 포함
```

## PR 템플릿

```markdown
## 구현 기능
* 구현한 기능을 bullet point로 요약

## 구현 상태 (선택)
* 스크린샷, 표, 또는 동작 설명
```

## 하지 마

- `main` 브랜치에 직접 commit·push 금지
- `develop`을 건너뛰고 `main`으로 직접 PR 금지
- 커밋 메시지에 `fix`, `feat` 등 type 없이 요약만 작성 금지
- 여러 기능을 하나의 커밋에 묶어서 커밋 금지 — 기능 단위로 분리
- 브랜치명에 한글 사용 금지
