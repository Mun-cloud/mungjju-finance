"use server";

import { getCurrentSession, validateSession } from "@/lib/auth";
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
 * Google Drive와 동기화하여 소비 기록을 가져오는 서버 액션
 *
 * 이 함수는 다음과 같은 단계로 동작합니다:
 * 1. 현재 사용자 세션을 확인하고 액세스 토큰을 검증
 * 2. Google Drive API 클라이언트를 생성
 * 3. 지정된 폴더에서 최신 DB 파일을 찾음
 * 4. DB 파일을 다운로드하여 임시 파일로 저장
 * 5. SQLite 데이터베이스에서 소비 기록을 조회
 * 6. 임시 파일을 정리
 *
 * @returns 동기화 결과 (성공/실패, 소비 기록 데이터 또는 에러 메시지)
 */
export async function syncWithGoogleDrive() {
  try {
    // 1. 세션 검증
    const session = await getCurrentSession();
    validateSession(session);

    // 2. Google Drive API 클라이언트 생성
    const oauth2Client = createOAuth2Client(
      session.accessToken,
      session.refreshToken
    );
    const drive = createDriveClient(oauth2Client);

    // 3. 최신 DB 파일 찾기
    const fileId = await findLatestDbFile(drive);

    // 4. 파일 다운로드
    const fileData = await downloadFile(drive, fileId.id);

    // 5. 임시 파일로 저장
    const tempDbPath = createTempDbPath();
    saveArrayBufferToFile(fileData, tempDbPath);

    try {
      // 6. 데이터베이스에서 소비 기록 조회
      const spendingList = getSpendingRecords(tempDbPath);

      return {
        success: true,
        spendingList,
      };
    } finally {
      // 7. 임시 파일 정리
      cleanupTempFile(tempDbPath);
    }
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
