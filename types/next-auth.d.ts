declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role?: "husband" | "wife"; // 부부 역할 구분
      partnerId?: string; // 파트너의 사용자 ID
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role?: "husband" | "wife";
      partnerId?: string;
    };
  }
}
