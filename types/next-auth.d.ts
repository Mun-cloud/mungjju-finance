declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string; // string으로 확장
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    };
  }
}
