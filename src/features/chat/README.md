# Chat Feature Documentation

## 개요

EssayBridge의 실시간 채팅 기능은 학생, 첨삭 전문가, 컨설턴트 간의 원활한 소통을 지원합니다.

## 주요 기능

### 1. 기본 채팅 기능
- ✅ 실시간 메시지 전송/수신
- ✅ 텍스트, 이미지, 파일 첨부 지원
- ✅ 메시지 수정/삭제
- ✅ 답장(Reply) 기능
- ✅ 이모지 리액션

### 2. 고급 UX 기능
- ✅ 드래그 앤 드롭 파일 업로드
- ✅ 키보드 단축키 (Ctrl+K 검색, Alt+↑↓ 채팅방 이동, ESC 취소)
- ✅ 읽음 상태 시각화
- ✅ 타이핑 인디케이터
- ✅ 날짜 구분선
- ✅ 스크롤 하단 버튼

### 3. 멀티미디어
- ✅ 이미지 라이트박스 (확대/축소/회전/다운로드)
- ✅ URL 링크 프리뷰
- ✅ 파일 미리보기

### 4. 알림
- ✅ 사운드 알림
- ✅ 브라우저 푸시 알림
- ✅ Header에 실시간 unread count

### 5. 보안
- ✅ 파일 업로드 검증 (타입, 크기)
- ✅ XSS 방지 (입력 sanitization)
- ✅ URL 안전성 검사
- ✅ 최대 파일 크기: 10MB
- ✅ 허용 파일 타입: image/*, pdf, doc, hwp, txt

## 아키텍처

```
src/features/chat/
├── api/
│   ├── chat.service.ts      # API 통신 레이어
│   └── chat.mock.ts          # Mock 데이터 (개발용)
├── components/
│   ├── ChatBubble.tsx        # 메시지 버블
│   ├── ChatInput.tsx         # 입력창
│   ├── ChatHeader.tsx        # 채팅방 헤더
│   ├── ChatRoomItem.tsx      # 채팅방 목록 아이템
│   ├── NewChatModal.tsx      # 새 채팅 모달
│   ├── ImageLightbox.tsx     # 이미지 뷰어
│   ├── LinkPreview.tsx       # URL 링크 프리뷰
│   ├── ChatErrorBoundary.tsx # 에러 바운더리
│   └── index.ts              # Export
├── hooks/
│   ├── useChatContext.tsx    # 채팅 상태 관리
│   ├── useGlobalChat.tsx     # 전역 채팅 상태
│   ├── useChatNotifications.tsx  # 알림 관리
│   └── useKeyboardShortcuts.tsx  # 키보드 단축키
├── pages/
│   └── ChatPage.tsx          # 메인 페이지
├── types/
│   └── index.ts              # TypeScript 타입 정의
├── utils/
│   ├── index.ts              # 유틸리티 함수
│   └── index.test.ts         # 유틸리티 테스트
└── index.ts                  # Feature Export
```

## 상태 관리

### Context API 사용
- `ChatProvider`: 채팅 상태 관리
- `GlobalChatProvider`: 전역 unread count 관리

### 주요 상태
```typescript
{
  rooms: ChatRoom[];              // 채팅방 목록
  selectedRoom: ChatRoom | null;  // 선택된 채팅방
  messages: ChatMessage[];        // 메시지 목록
  typingUsers: TypingEvent[];     // 타이핑 중인 사용자
  uiState: ChatUIState;           // UI 상태
}
```

## 테스트

### 테스트 커버리지
- ✅ 유틸리티 함수: 30개 테스트
- ⏳ 컴포넌트 테스트: 계획 중
- ⏳ E2E 테스트: 계획 중

### 테스트 실행
```bash
# 전체 테스트 실행
npm test

# 단일 실행
npm run test:run

# 커버리지 확인
npm run test:coverage
```

## 성능 최적화

### 적용된 최적화
1. **React.memo**: 불필요한 리렌더링 방지
   - ChatBubble, ChatRoomItem, LinkPreview, TypingIndicator

2. **Code Splitting**: 필요 시 로딩
   - Feature-based 구조로 번들 분리

3. **이미지 최적화**: 지연 로딩 계획

### 성능 메트릭
- JS Bundle: 636 KB (gzip: 152 KB)
- CSS Bundle: 79 KB (gzip: 11.6 KB)
- 빌드 시간: ~4초

## 보안 고려사항

### 구현된 보안 조치
1. **입력 검증**
   - 파일 타입 화이트리스트
   - 파일 크기 제한 (10MB)
   - 메시지 길이 제한 (5000자)

2. **XSS 방지**
   - HTML 특수문자 이스케이프
   - URL 안전성 검사
   - javascript:, data: 프로토콜 차단

3. **에러 처리**
   - ChatErrorBoundary로 에러 격리
   - 사용자 친화적 에러 메시지

## API 통합 가이드

### Mock에서 실제 API로 전환

1. `chat.service.ts`의 API 엔드포인트 활성화
2. WebSocket 연결 설정
3. Mock 데이터 제거

```typescript
// Before (Mock)
import { mockMessages } from './chat.mock';

// After (Real API)
const response = await chatService.getMessages(roomId);
```

## 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl/Cmd + K` | 검색 열기/닫기 |
| `Alt + ↑` | 이전 채팅방 |
| `Alt + ↓` | 다음 채팅방 |
| `ESC` | 현재 작업 취소 |
| `Enter` | 메시지 전송 |
| `Shift + Enter` | 줄바꿈 |

## 브라우저 지원

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 향후 개선 사항

### 계획된 기능
- [ ] 음성/영상 통화
- [ ] 메시지 검색 개선
- [ ] 파일 미리보기 확장
- [ ] 그룹 채팅
- [ ] 채팅 내보내기

### 성능 개선
- [ ] 가상 스크롤링 (react-window)
- [ ] 이미지 지연 로딩
- [ ] Service Worker 캐싱

### 접근성
- [ ] 스크린 리더 지원
- [ ] 키보드 네비게이션 개선
- [ ] ARIA 레이블 추가

## 트러블슈팅

### 자주 발생하는 문제

#### 1. 알림이 작동하지 않음
- 브라우저 알림 권한 확인
- HTTPS 환경인지 확인 (localhost 제외)

#### 2. 파일 업로드 실패
- 파일 크기 확인 (최대 10MB)
- 허용된 파일 타입인지 확인

#### 3. 메시지가 전송되지 않음
- 네트워크 연결 확인
- 브라우저 콘솔 에러 확인

## 기여 가이드

### 코드 스타일
- TypeScript strict 모드
- ESLint 규칙 준수
- Prettier 포맷팅

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
test: 테스트 추가/수정
docs: 문서 업데이트
```

## 라이선스

MIT License
