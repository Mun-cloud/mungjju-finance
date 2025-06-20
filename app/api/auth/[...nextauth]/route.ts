import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

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
        token.refreshToken = account.refresh_token;
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
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

// NextAuth 핸들러 생성 및 내보내기
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
