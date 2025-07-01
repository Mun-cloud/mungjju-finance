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

    // 1. 구글 드라이브에서 최신 db 파일 조회
    try {
      const oAuth2Client = createOAuth2Client(
        session.accessToken,
        session.refreshToken
      );
      const drive = createDriveClient(oAuth2Client);
      const file = await findLatestDbFile(drive);
      fileData = await downloadFile(drive, file.id);
    } catch (error) {
      console.error("구글 드라이브 연동 중 오류 발생:", error);
      throw new Error("구글 드라이브 연동 실패");
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

        console.log(kstDate.format("YYYY-MM-DD HH:mm:ss"));
        const utcDate = kstDate.isValid() ? kstDate.utc() : null;
        console.log(utcDate?.format("YYYY-MM-DD HH:mm:ss"));

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
  return await prisma.spending.findMany();
}
