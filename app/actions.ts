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
import { OAuth2Client } from "google-auth-library";
import { SpendingList } from "@/types/list";

/**
 * 남편, 아내 두 계정의 Google Drive에서 각각 최신 clevmoney_*** 파일을 조회하여 소비 기록을 반환하는 서버 액션
 * 환경변수에 저장된 두 계정의 토큰을 사용합니다.
 * @returns { success: boolean, husbandSpendingList, wifeSpendingList, error? }
 */
export async function syncBothGoogleDrives(): Promise<{
  success: boolean;
  husbandSpendingList?: SpendingList[];
  wifeSpendingList?: SpendingList[];
  error?: string;
}> {
  try {
    // 남편 계정
    const husbandOAuth2Client = createOAuth2Client(
      process.env.HUSBAND_ACCESS_TOKEN!,
      process.env.HUSBAND_REFRESH_TOKEN
    );

    const husbandTempDbPath = await getLatestDbFile(husbandOAuth2Client);

    // 아내 계정
    const wifeOAuth2Client = createOAuth2Client(
      process.env.WIFE_ACCESS_TOKEN!,
      process.env.WIFE_REFRESH_TOKEN
    );
    const wifeTempDbPath = await getLatestDbFile(wifeOAuth2Client);

    // 소비 기록 조회
    const husbandSpendingList = getSpendingRecords(husbandTempDbPath).map(
      (value) => ({ ...value, role: "husband" })
    );
    const wifeSpendingList = getSpendingRecords(wifeTempDbPath).map(
      (value) => ({ ...value, role: "wife" })
    );

    // 임시 파일 정리
    cleanupTempFile(husbandTempDbPath);
    cleanupTempFile(wifeTempDbPath);

    return {
      success: true,
      husbandSpendingList,
      wifeSpendingList,
    };
  } catch (error) {
    console.error("Google Drive 동기화 중 오류 발생:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

async function getLatestDbFile(client: OAuth2Client) {
  const drive = createDriveClient(client);
  const fileId = await findLatestDbFile(drive);
  const fileData = await downloadFile(drive, fileId.id);

  const tempDbPath = createTempDbPath();
  saveArrayBufferToFile(fileData, tempDbPath);

  return tempDbPath;
}
