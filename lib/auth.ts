import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";

/**
 * NextAuth 설정
 *
 * 이 설정은 Google OAuth를 사용하여 사용자 인증을 처리합니다.
 * Google Drive API에 접근하기 위해 필요한 스코프를 포함합니다.
 */
export const authOptions = {
  // NextAuth 시크릿 키 (환경 변수에서 가져오거나 기본값 사용)
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",

  // 인증 제공자 설정
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Google Drive 읽기 권한과 사용자 이메일 정보 요청
          scope: [
            "https://www.googleapis.com/auth/drive.readonly", // Google Drive 읽기 권한
            "https://www.googleapis.com/auth/userinfo.email", // 사용자 이메일 정보
          ].join(" "),
          access_type: "offline", // 리프레시 토큰 요청
        },
      },
    }),
  ],

  // 콜백 함수들
  callbacks: {
    /**
     * JWT 토큰 생성/업데이트 콜백
     *
     * 사용자가 로그인할 때 액세스 토큰과 리프레시 토큰을 JWT에 저장합니다.
     * 이 토큰들은 Google Drive API 호출에 사용됩니다.
     */
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || token.refreshToken;
      }
      return token;
    },

    /**
     * 세션 생성 콜백
     *
     * JWT에서 액세스 토큰과 리프레시 토큰을 세션에 포함시킵니다.
     * 이 정보는 클라이언트에서 서버 액션을 호출할 때 사용됩니다.
     */
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken || session.refreshToken;
      // 이메일에 따라 role 부여
      if (session.user?.email === "mun05170@gmail.com") {
        session.user.role = "husband";
      } else if (session.user?.email === "mvs1479@gmail.com") {
        session.user.role = "wife";
      }
      return session;
    },
  },
};

/**
 * 서버 사이드에서 현재 세션을 가져오는 함수
 * @returns 현재 사용자 세션 또는 null
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * 세션에서 액세스 토큰을 검증하는 함수
 * @param session - 사용자 세션
 * @throws 세션이 없거나 액세스 토큰이 없는 경우 에러
 */
export function validateSession(session: any) {
  if (!session) {
    throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
  }

  if (!session.accessToken) {
    throw new Error("액세스 토큰이 없습니다. 다시 로그인해주세요.");
  }
}
