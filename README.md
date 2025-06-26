# Mungjju Finance - 부부를 위한 개인/공동 가계부 앱

Google Drive와 연동하여 SQLite 데이터베이스 파일을 동기화하고, 부부의 소비 기록을 함께 관리하는 현대적인 Next.js 웹 애플리케이션입니다. (똑똑가계부 앱. 구글 드라이브 백업 데이터 전용 프로그램.)

## ✨ 주요 기능

### 🔐 인증 및 동기화
- **Google OAuth 인증**: 안전한 Google 계정 로그인
- **Google Drive 자동 동기화**: 지정된 폴더에서 최신 DB 파일 자동 검색 및 다운로드
- **실시간 데이터 업데이트**: 언제든지 최신 소비 데이터로 동기화

### 📊 대시보드
- **월별 통계 카드**: 나/부부의 이번 달 총 지출액, 카테고리별 지출 현황
- **카테고리별 지출 분석**: 개인별/부부 합산 카테고리별 지출 시각화
- **빠른 동기화**: 헤더에서 원클릭으로 데이터 동기화

### 📝 지출 기록 관리
- **월별 필터링**: 특정 월의 지출 기록만 조회
- **카테고리별 분류**: 자동으로 카테고리별로 정리된 소비 내역
- **상세 정보 표시**: 날짜, 시간, 장소, 메모, 카드 정보 등

### 📈 차트 분석
- **카테고리별 도넛 차트**: 지출 분포 시각화
- **월별 라인 차트**: 시간에 따른 지출 추이
- **카테고리별 월별 바 차트**: 카테고리/월별 상세 분석
- **지출 금액대별 히스토그램**: 금액대별 소비 패턴 분석

### 💸 예산 관리
- **카테고리별 예산 설정**: 월별 예산과 실제 지출 비교
- **잔여 예산, 초과 지출 표시**
- **최근 12개월 월별 예산/지출 내역 확인**

### 📱 모바일 친화적 UI
- **하단 네비게이션**: 대시보드, 지출기록, 차트, 예산 페이지 간 쉬운 이동
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **현대적 UI**: Tailwind CSS 기반의 깔끔한 디자인

## 🏗️ 프로젝트 구조

```
mungjju-finance/
├── app/                          # Next.js App Router
│   ├── api/auth/[...nextauth]/   # NextAuth API 라우트
│   │   └── route.ts
│   ├── budget/                   # 예산 관리 페이지
│   │   └── page.tsx
│   ├── charts/                   # 차트 분석 페이지
│   │   └── page.tsx
│   ├── transactions/             # 지출 기록 페이지
│   │   ├── _components/          # 트랜잭션 관련 컴포넌트
│   │   │   └── ...
│   │   └── page.tsx
│   ├── actions.ts                # 서버 액션 (Google Drive 동기화)
│   ├── globals.css               # 글로벌 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 대시보드 페이지
│   └── provider.tsx              # NextAuth Provider
├── components/                   # 공통 React 컴포넌트
│   ├── BottomNavigation.tsx      # 하단 네비게이션
│   ├── DataInitializer.tsx       # 데이터 초기화
│   ├── Header.tsx                # 헤더
│   ├── Layout.tsx                # 공통 레이아웃
│   ├── Login.tsx                 # 로그인 버튼
│   ├── LoginSection.tsx          # 로그인 안내 섹션
│   ├── SpendingList.tsx          # 소비 기록 목록
│   ├── SyncButton.tsx            # 동기화 버튼
│   └── UserInfo.tsx              # 사용자 정보
├── assets/
│   └── icons/                    # SVG 아이콘 모음
│       └── ...
├── lib/                          # 유틸리티 라이브러리
│   ├── auth.ts                   # 인증 유틸리티
│   ├── calculator.ts             # 계산 유틸리티
│   ├── database.ts               # DB 관련 유틸리티
│   └── google-drive.ts           # Google Drive API 유틸리티
├── store/                        # zustand 상태 관리
│   ├── spendingFiltersStore.ts   # 필터 상태
│   └── spendingStore.ts          # 소비 데이터 상태
├── types/                        # TypeScript 타입 정의
│   ├── global.ts
│   ├── list.ts
│   ├── next-auth.d.ts
│   └── svg.d.ts
├── public/                       # 정적 파일 (favicon, 이미지 등)
│   └── ...
├── package.json
└── README.md
```

## 🛠️ 기술 스택

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **NextAuth.js v4** (Google OAuth)
- **SQLite** (better-sqlite3)
- **Google Drive API**
- **Recharts** (차트)
- **zustand** (상태 관리)
- **ESLint, Turbopack, npm/bun**

## 📋 환경 설정

1. 프로젝트 루트에 `.env.local` 파일을 생성하고 아래 환경변수를 설정하세요:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
# (선택) 부부 공동 가계부용
PARTNER_EMAIL=partner-email@example.com
PARTNER_GOOGLE_DRIVE_FOLDER_ID=partner-google-drive-folder-id
```

2. Google Cloud Console에서 새 프로젝트 생성 → Google Drive API 활성화 → OAuth 2.0 클라이언트 ID 생성 → 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가

3. Google Drive에 DB 파일 저장 폴더 생성 후 폴더 ID를 환경변수에 입력

## 🚀 실행 방법

```bash
npm install # 또는 bun install
npm run dev # 또는 bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📊 데이터베이스 스키마

- **spendinglist**: 지출 기록 테이블
- **catelist**: 카테고리 테이블

(상세 스키마는 기존 README 참고)

## 🔧 주요 모듈/페이지 설명

- **app/actions.ts**: Google Drive 동기화 서버 액션
- **lib/google-drive.ts**: Google Drive API 유틸리티
- **lib/database.ts**: SQLite DB 유틸리티
- **app/charts/page.tsx**: 다양한 차트 분석 페이지
- **app/budget/page.tsx**: 예산 관리 및 월별 예산/지출 비교
- **app/transactions/page.tsx**: 월별/카테고리별 지출 기록 필터링 및 목록
- **components/BottomNavigation.tsx**: 대시보드/지출기록/차트/예산 네비게이션

## 📱 사용자 인터페이스

- **대시보드**: 월별 통계, 카테고리별 분석, 최근 지출, 동기화 버튼
- **지출기록**: 월별/카테고리별 필터, 상세 내역
- **차트**: 도넛/라인/바/히스토그램 등 다양한 시각화
- **예산**: 카테고리별 예산/지출/잔여 예산 비교
- **하단 네비게이션**: 대시보드, 지출기록, 차트, 예산
- **반응형/모바일 우선 UI**

## 🔒 보안
- Google OAuth 2.0 인증
- NextAuth.js 세션 관리
- 환경변수로 민감 정보 관리
- 임시 파일 자동 정리

## 🚧 향후 개발 계획
- [ ] 데이터 내보내기
- [ ] 예산 알림/푸시
- [ ] 다크 모드

## 🤝 기여하기
1. 저장소 포크
2. 브랜치 생성 (`git checkout -b feature/your-feature`)
3. 커밋 (`git commit -m 'Add feature'`)
4. 푸시 및 PR 생성

## 📝 라이선스
MIT
