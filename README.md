# 💰 Mungjju Finance - 개인 가계부 관리 앱

Google Drive와 연동하여 SQLite 데이터베이스 파일을 동기화하고, 개인 소비 기록을 관리하는 현대적인 Next.js 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🔐 인증 및 동기화
- **Google OAuth 인증**: 안전한 Google 계정 로그인
- **Google Drive 자동 동기화**: 지정된 폴더에서 최신 DB 파일 자동 검색 및 다운로드
- **실시간 데이터 업데이트**: 언제든지 최신 소비 데이터로 동기화

### 📊 대시보드
- **월별 통계 카드**: 총 지출액, 평균 지출액, 카테고리별 지출 현황
- **최근 지출 기록**: 최신 5건의 소비 내역을 깔끔하게 표시
- **빠른 동기화**: 헤더에서 원클릭으로 데이터 동기화

### 📈 차트 분석
- **카테고리별 도넛 차트**: 지출 분포를 시각적으로 분석
- **월별 라인 차트**: 시간에 따른 지출 추이 확인
- **카테고리별 월별 바 차트**: 카테고리와 시간대별 상세 분석
- **지출 분포 히스토그램**: 금액대별 지출 패턴 분석

### 📝 지출 기록 관리
- **월별 필터링**: 특정 월의 지출 기록만 조회
- **카테고리별 분류**: 자동으로 카테고리별로 정리된 소비 내역
- **상세 정보 표시**: 날짜, 시간, 장소, 메모, 카드 정보 등

### 📱 모바일 친화적 UI
- **하단 네비게이션**: 대시보드, 지출기록, 차트, 설정 페이지 간 쉬운 이동
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **현대적 UI**: Tailwind CSS로 구현된 깔끔하고 트렌디한 디자인

## 🏗️ 프로젝트 구조

```
mungjju-finance/
├── app/                          # Next.js App Router
│   ├── api/auth/[...nextauth]/   # NextAuth API 라우트
│   ├── charts/                   # 차트 분석 페이지
│   │   └── page.tsx             # 차트 페이지 컴포넌트
│   ├── transactions/             # 지출 기록 페이지
│   │   └── page.tsx             # 지출 기록 페이지 컴포넌트
│   ├── components/               # React 컴포넌트
│   │   ├── BottomNavigation.tsx # 하단 네비게이션
│   │   ├── Login.tsx            # 로그인 버튼
│   │   ├── LoginSection.tsx     # 로그인 안내 섹션
│   │   ├── SpendingList.tsx     # 소비 기록 목록
│   │   ├── SyncButton.tsx       # 동기화 버튼
│   │   └── UserInfo.tsx         # 사용자 정보
│   ├── actions.ts               # 서버 액션 (Google Drive 동기화)
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 메인 대시보드 페이지
│   └── provider.tsx             # NextAuth Provider
├── lib/                         # 유틸리티 라이브러리
│   ├── database.ts              # 데이터베이스 관련 유틸리티
│   └── google-drive.ts          # Google Drive API 유틸리티
├── types/                       # TypeScript 타입 정의
│   ├── global.ts                # 전역 타입
│   ├── list.ts                  # 소비 기록 타입
│   └── next-auth.d.ts           # NextAuth 타입 확장
└── public/                      # 정적 파일
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 15**: App Router 기반의 현대적인 React 프레임워크
- **React 19**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS 4**: 유틸리티 퍼스트 CSS 프레임워크

### Backend & Database
- **NextAuth.js v4**: Google OAuth 인증
- **SQLite**: 경량 데이터베이스 (better-sqlite3)
- **Google Drive API**: 클라우드 파일 동기화

### 차트 & 시각화
- **Recharts**: React 기반 차트 라이브러리
- **다양한 차트 타입**: 도넛, 라인, 바, 히스토그램

### 개발 도구
- **Turbopack**: 빠른 개발 서버
- **ESLint**: 코드 품질 관리
- **npm/bun**: 패키지 관리

## 📋 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Drive 설정 (개인용)
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# 부부 가계부 설정 (선택사항)
PARTNER_EMAIL=wife-email@example.com
PARTNER_GOOGLE_DRIVE_FOLDER_ID=wife-google-drive-folder-id
```

### 2. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. **Google Drive API** 활성화
3. **OAuth 2.0 클라이언트 ID** 생성
4. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가

### 3. Google Drive 폴더 설정

1. Google Drive에 DB 파일을 저장할 폴더 생성
2. 폴더 ID를 복사하여 `GOOGLE_DRIVE_FOLDER_ID` 환경 변수에 설정
3. 폴더에 대한 적절한 권한 설정

## 🚀 실행 방법

### 개발 서버 실행

```bash
# 의존성 설치
npm install
# 또는
bun install

# 개발 서버 실행 (Turbopack 사용)
npm run dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

### 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📊 데이터베이스 스키마

애플리케이션은 다음과 같은 SQLite 테이블 구조를 기대합니다:

### spendinglist 테이블 (지출 기록)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `_id` | INTEGER | 고유 식별자 (Primary Key) |
| `s_date` | TEXT | 날짜 (YYYY-MM-DD 형식) |
| `s_time` | TEXT | 시간 (HH:MM 형식) |
| `s_where` | TEXT | 지출 장소/내역 |
| `s_memo` | TEXT | 메모 |
| `s_card` | TEXT | 카드 정보 |
| `s_cate` | INTEGER | 카테고리 ID (catelist 참조) |
| `s_subcate` | INTEGER | 서브카테고리 ID |
| `s_price` | INTEGER | 지출 금액 |
| `s_cardmonth` | TEXT | 카드 월 |

### catelist 테이블 (카테고리)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `_id` | INTEGER | 카테고리 ID (Primary Key) |
| `c_name` | TEXT | 카테고리 이름 |

## 🔧 주요 모듈 설명

### 서버 액션 (`app/actions.ts`)
Google Drive와 동기화하는 핵심 로직을 담당합니다:
1. **세션 검증**: 사용자 인증 상태 확인
2. **Google Drive API 클라이언트 생성**: OAuth 토큰으로 API 접근
3. **최신 DB 파일 검색**: 지정된 폴더에서 가장 최근 파일 찾기
4. **파일 다운로드**: 임시 저장소에 DB 파일 다운로드
5. **데이터 조회**: SQLite에서 소비 기록 데이터 추출
6. **임시 파일 정리**: 다운로드된 파일 자동 삭제

### Google Drive 유틸리티 (`lib/google-drive.ts`)
Google Drive API와의 상호작용을 담당:
- OAuth 클라이언트 생성
- 폴더 내 파일 검색
- 파일 다운로드

### 데이터베이스 유틸리티 (`lib/database.ts`)
SQLite 데이터베이스 조작과 파일 관리:
- DB 파일 연결 및 쿼리 실행
- 임시 파일 관리
- 데이터 변환 및 정리

### 차트 컴포넌트 (`app/charts/page.tsx`)
Recharts를 활용한 다양한 차트 구현:
- **도넛 차트**: 카테고리별 지출 분포
- **라인 차트**: 월별 지출 추이
- **바 차트**: 카테고리별 월별 비교
- **히스토그램**: 금액대별 분포

## 📱 사용자 인터페이스

### 대시보드
- 월별 통계 카드 (총 지출, 평균 지출, 카테고리별 현황)
- 최근 지출 기록 (최신 5건)
- 동기화 버튼 (헤더 우측)

### 하단 네비게이션
- **🏠 대시보드**: 메인 통계 및 최근 기록
- **📝 지출기록**: 월별 필터링된 상세 기록
- **📊 차트**: 다양한 시각화 차트
- **⚙️ 설정**: 앱 설정 (향후 구현 예정)

### 반응형 디자인
- 모바일 우선 설계
- 태블릿 및 데스크톱 최적화
- 터치 친화적 인터페이스

## 🔒 보안 고려사항

- **OAuth 2.0**: 안전한 Google 계정 인증
- **세션 관리**: NextAuth.js를 통한 안전한 세션 처리
- **환경 변수**: 민감한 정보는 환경 변수로 관리
- **임시 파일**: 동기화 후 자동 정리

## 🚧 향후 개발 계획

- [ ] 설정 페이지 구현
- [ ] 데이터 내보내기 기능
- [ ] 예산 설정 및 알림
- [ ] 다크 모드 지원
- [ ] PWA 지원
- [ ] 오프라인 모드

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**Mungjju Finance** - 개인 재정 관리를 더욱 스마트하게! 💰✨
