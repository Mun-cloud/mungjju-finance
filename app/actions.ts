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

export async function syncMyGoogleDriveAndSaveToDB() {
  const session = await getCurrentSession();
  if (!session?.user?.email) {
    throw new Error("로그인 필요");
  }

  const userEmail = session.user.email;
  const role =
    USER_ROLE_MAP[userEmail as keyof typeof USER_ROLE_MAP] ?? "unknown";

  // 1. 구글 드라이브에서 최신 db 파일 조회
  const oAuth2Client = createOAuth2Client(
    session.accessToken,
    session.refreshToken
  );
  const drive = createDriveClient(oAuth2Client);
  const file = await findLatestDbFile(drive);
  const fileData = await downloadFile(drive, file.id);

  // 2. 임시 파일로 저장 후 파싱
  const tempDbPath = createTempDbPath();
  saveArrayBufferToFile(fileData, tempDbPath);
  const spendingList: Spending[] = getSpendingRecords(tempDbPath).map(
    (item) => ({
      id: item._id,
      amount: item.s_price,
      category: item.category_name,
      subCategory: item.subcategory_name,
      where: item.s_where,
      date: new Date(item.s_date + " " + item.s_time),
      createdAt: new Date(),
      memo: item.s_memo,
      userEmail,
      role,
    })
  );
  cleanupTempFile(tempDbPath);

  // 3. 기존 spending 삭제 후 새로 저장
  await prisma.spending.deleteMany({ where: { userEmail } });
  await prisma.spending.createMany({ data: spendingList });

  return { success: true };
}

export async function fetchSpendingList() {
  return await prisma.spending.findMany();
}
