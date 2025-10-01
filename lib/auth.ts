import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";

/**
 * 만료된 액세스 토큰을 리프레시 토큰으로 갱신하는 함수
 * @param token - 현재 JWT 토큰
 * @returns 갱신된 토큰 또는 에러 정보가 포함된 토큰
 */
async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

/**
 * NextAuth 설정
 *
 * 이 설정은 Google OAuth를 사용하여 사용자 인증을 처리합니다.
 * Google Drive API에 접근하기 위해 필요한 스코프를 포함합니다.
 */
export const authOptions = {
  // NextAuth 시크릿 키 (환경 변수에서 가져오거나 기본값 사용)
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",

  // 세션 설정
  session: {
    strategy: "jwt" as const,
    maxAge: 90 * 24 * 60 * 60, // 90일
  },

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
          prompt: "consent", // 권한 재승인 강제 (refresh token을 확실히 받기 위해)
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
     * 토큰 만료 시 자동으로 갱신합니다.
     */
    async jwt({ token, account }: { token: any; account: any }) {
      // 초기 로그인 시 토큰 정보 저장
      if (account) {
        console.log("초기 로그인 - 토큰 정보:", {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          expiresIn: account.expires_in
        });
        
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_in || 3600) * 1000;
        
        if (!account.refresh_token) {
          console.warn("경고: Refresh token이 없습니다. 다시 로그인이 필요할 수 있습니다.");
        }
        
        return token;
      }

      // 토큰이 아직 유효한 경우 기존 토큰 반환
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Refresh token이 없으면 재로그인 필요
      if (!token.refreshToken) {
        console.error("Refresh token이 없어 토큰 갱신 불가. 재로그인 필요.");
        return { ...token, error: "RefreshTokenMissing" };
      }

      // 토큰 만료 시 리프레시 토큰으로 갱신
      console.log("토큰 갱신 시도 중...");
      return refreshAccessToken(token);
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
