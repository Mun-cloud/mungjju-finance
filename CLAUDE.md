# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

부부를 위한 가계부 웹 애플리케이션으로, '똑똑가계부' 모바일 앱의 Google Drive SQLite 백업과 동기화하여 지출을 추적하고 분석합니다.

**핵심 작동 방식:**
1. 각자 '똑똑가계부' 모바일 앱으로 개인 지출 기록
2. 앱이 Google Drive에 SQLite로 자동 백업
3. 웹앱에서 Google OAuth로 Drive 권한 획득
4. SQLite 백업 파일을 다운로드하여 PostgreSQL에 가공 저장
5. 합쳐진 지출 데이터를 분석하고 시각화 제공

## 명령어

```bash
# 개발
bun dev          # Turbopack으로 개발 서버 시작
bun install      # 의존성 설치

# 프로덕션
bun build        # 프로덕션 빌드
bun start        # 프로덕션 서버 시작

# 코드 품질
bun lint         # ESLint 실행
```

## 아키텍처

### 데이터베이스 계층
- **PostgreSQL**: Prisma ORM 사용하는 메인 데이터베이스 (schema.prisma:16-27)
- **SQLite 처리**: Google Drive의 임시 SQLite 파일을 처리 후 정리 (lib/database.ts:114-140)
- **단일 모델**: `Spending` 모델 - id, amount, category, subCategory, date, where, memo, userEmail, role

### 인증 및 권한
- **NextAuth.js v4**: Google Drive 읽기 권한 포함 Google OAuth (lib/auth.ts:10-66)
- **역할 기반 접근**: 이메일 기반으로 "husband" 또는 "wife" 역할 할당 (lib/constants.ts:4-7)
- **세션 관리**: Google Drive API 호출용 액세스/리프레시 토큰을 JWT에 저장

### Google Drive 연동
- **OAuth2 클라이언트**: 인증된 Google 클라이언트 생성 (lib/google-drive.ts:10-25)
- **파일 발견**: 지정된 Drive 폴더에서 최신 `clevmoney_` 파일 검색 (lib/google-drive.ts:67-90)
- **데이터 동기화**: 서버 액션으로 SQLite 다운로드, 레코드 처리, 사용자 데이터 교체 (app/actions.ts:25-108)

### 상태 관리
- **Zustand**: 지출 데이터와 필터용 두 개의 스토어 (store/)
- **서버 액션**: 동기화 및 데이터 페칭을 위한 직접 데이터베이스 작업 (app/actions.ts)

### UI 구조
- **App Router**: Next.js 15 app 디렉토리 구조
- **하단 네비게이션**: 4개 메인 섹션 (대시보드, 지출기록, 차트, 예산)
- **반응형 디자인**: Tailwind CSS 4로 모바일 우선

### 주요 컴포넌트
- **대시보드** (app/page.tsx): 요약 카드, 카테고리 분석, 최근 지출
- **지출기록** (app/transactions/): 월별/카테고리별 필터링과 상세 목록
- **차트** (app/charts/): Recharts로 다양한 차트 타입 (파이, 라인, 바, 히스토그램)
- **예산** (app/budget/): 카테고리별 예산 vs 실제 지출 비교

### 데이터 흐름
1. **동기화 트리거**: 사용자가 동기화 버튼 클릭 → `syncMyGoogleDriveAndSaveToDB()` 호출
2. **인증**: 세션 및 사용자 권한 검증
3. **Drive 접근**: OAuth 클라이언트 생성, 최신 DB 파일 찾기, 다운로드
4. **처리**: SQLite 레코드를 시간대 처리와 함께 Prisma 형식으로 변환
5. **저장**: PostgreSQL의 기존 사용자 데이터 교체
6. **정리**: 임시 파일 제거

### 카테고리 관리
- **정규화**: 카테고리에서 이모지 접두사 제거 (lib/database.ts:12-28)
- **매핑**: 일관된 분석을 위한 표준화된 카테고리 이름

## 환경 변수

`.env.local`에 필수:
- `NEXTAUTH_SECRET`: 세션 암호화 키
- `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`: OAuth 자격증명
- `GOOGLE_DRIVE_FOLDER_NAME`: DB 파일용 대상 폴더명
- `HUSBAND_EMAIL`/`WIFE_EMAIL`: 승인된 사용자 이메일
- `DATABASE_URL`: PostgreSQL 연결 문자열

## 개발 참고사항

- **TypeScript**: strict 모드 비활성화, `@/` 접두사로 절대 임포트 사용
- **Bun**: 주요 패키지 매니저 및 런타임
- **Turbopack**: 빠른 빌드를 위한 개발 번들러
- **SVG 처리**: SVG를 React 컴포넌트로 사용하는 커스텀 webpack/turbo 설정
- **시간대 처리**: dayjs 사용하여 KST 데이터를 UTC로 변환하여 저장
- **에러 처리**: 정리 기능이 포함된 동기화 프로세스의 포괄적 에러 처리
- **보안**: 임시 파일 정리, 역할 기반 데이터 접근

## 테스트

현재 테스트 프레임워크가 설정되어 있지 않습니다. 테스트 추가 시 README에서 테스트 접근 방식을 확인하세요.