import Login from "./Login";

/**
 * 로그인이 필요한 경우 표시되는 섹션 컴포넌트
 *
 * 사용자가 로그인하지 않은 상태에서 표시되며,
 * Google Drive와 동기화하기 위해 로그인이 필요함을 안내합니다.
 */
export default function LoginSection() {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Google Drive 동기화
        </h2>
        <p className="text-gray-600 mb-6">
          소비 기록을 Google Drive에서 가져오려면 Google 계정으로
          로그인해주세요.
        </p>
        <Login />
        <p className="text-sm text-gray-500 mt-4">
          로그인 후 Google Drive의 지정된 폴더에서 최신 DB 파일을 자동으로 찾아
          동기화합니다.
        </p>
      </div>
    </div>
  );
}
