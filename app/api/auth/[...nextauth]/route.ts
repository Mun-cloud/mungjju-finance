import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

// NextAuth 핸들러 생성 및 내보내기
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
