import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
