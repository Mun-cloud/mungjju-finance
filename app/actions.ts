"use server";

import {
  createOAuth2Client,
  createDriveClient,
  findLatestDbFile,
  downloadFile,
} from "@/lib/google-drive";
import {
  getSpendingRecords,
  createTempDbPath,
  saveArrayBufferToFile,
  cleanupTempFile,
} from "@/lib/database";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USER_ROLE_MAP } from "@/lib/constants";
import { Spending } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function syncMyGoogleDriveAndSaveToDB() {
  try {
    const session = await getCurrentSession();
    let fileData: ArrayBuffer;
    let spendingList: Spending[] = [];

    if (!session?.user?.email) {
      throw new Error("로그인 필요");
    }

    const userEmail = session.user.email;
    const role =
      USER_ROLE_MAP[userEmail as keyof typeof USER_ROLE_MAP] ?? "unknown";

    if (!USER_ROLE_MAP[userEmail as keyof typeof USER_ROLE_MAP]) {
      throw new Error("허용되지 않은 계정입니다");
    }

    // 1. 구글 드라이브에서 최신 db 파일 조회
    try {
      console.log("Google Drive 연동 시작:", {
        hasAccessToken: !!session.accessToken,
        hasRefreshToken: !!session.refreshToken,
        userEmail,
        role
      });

      // 환경변수 검증
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error("Google OAuth 환경변수가 설정되지 않았습니다.");
      }

      if (!process.env.GOOGLE_DRIVE_FOLDER_NAME) {
        throw new Error("GOOGLE_DRIVE_FOLDER_NAME 환경변수가 설정되지 않았습니다.");
      }

      const oAuth2Client = createOAuth2Client(
        session.accessToken,
        session.refreshToken
      );
      
      console.log("OAuth2Client 생성 완료");
      
      const drive = createDriveClient(oAuth2Client);
      console.log("Drive client 생성 완료");
      
      const file = await findLatestDbFile(drive);
      console.log("최신 DB 파일 찾기 완료:", file.id);
      
      fileData = await downloadFile(drive, file.id);
      console.log("파일 다운로드 완료, 크기:", fileData.byteLength);
    } catch (error) {
      console.error("구글 드라이브 연동 중 오류 발생:", error);

      // 토큰 관련 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('invalid_grant') ||
          errorMessage.includes('Token has been expired') ||
          errorMessage.includes('RefreshAccessTokenError') ||
          errorMessage.includes('RefreshTokenMissing') ||
          errorMessage.includes('Invalid Credentials')) {
        throw new Error("로그인이 만료되었거나 권한이 부족합니다. 로그아웃 후 다시 로그인해주세요.");
      }

      // 환경변수 관련 에러는 그대로 전달
      if (errorMessage.includes('환경변수')) {
        throw error;
      }

      throw new Error(`구글 드라이브 연동 실패: ${errorMessage}`);
    }

    // 2. 임시 파일로 저장 후 파싱
    let tempDbPath;
    try {
      tempDbPath = createTempDbPath();
      saveArrayBufferToFile(fileData, tempDbPath);
      spendingList = getSpendingRecords(tempDbPath).map((item) => {
        // KST로 저장된 값을 KST로 파싱 후 UTC로 변환
        const kstDate = dayjs.tz(
          item.s_date + " " + item.s_time,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Seoul"
        );

        const utcDate = kstDate.isValid() ? kstDate.utc() : null;

        return {
          id: `${item._id}-${kstDate.valueOf()}-${item.s_price}`,
          amount: item.s_price,
          category: item.category_name,
          subCategory: item.subcategory_name,
          where: item.s_where,
          date: utcDate ? utcDate.toDate() : null,
          createdAt: new Date(),
          memo: item.s_memo,
          userEmail,
          role,
        };
      });
    } catch (error) {
      console.error("데이터 파싱 중 오류 발생:", error);
      throw new Error("데이터 파싱 실패");
    } finally {
      if (tempDbPath) {
        cleanupTempFile(tempDbPath);
      }
    }

    // 3. 기존 spending 삭제 후 새로 저장
    try {
      await prisma.spending.deleteMany({ where: { userEmail } });
      await prisma.spending.createMany({ data: spendingList });
    } catch (error) {
      console.error("DB 저장 중 오류 발생:", error);
      throw new Error("DB 저장 실패");
    }

    return { success: true };
  } catch (error) {
    console.error("전체 동기화 프로세스 실패:", error);
    return { success: false, error };
  }
}

export async function fetchSpendingList() {
  return await prisma.spending.findMany({
    orderBy: {
      date: "desc",
    },
  });
}
