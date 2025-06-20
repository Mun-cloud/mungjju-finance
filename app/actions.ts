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
import { CoupleSyncResult, CoupleSpendingList } from "@/types/global";

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
    const latestFile = await findLatestDbFile(drive);

    // 4. 파일 다운로드
    const fileData = await downloadFile(drive, latestFile.id);

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
 * 부부 Google Drive 동기화 - 두 명의 Drive에서 각각 DB를 가져와서 합치는 서버 액션
 *
 * 이 함수는 다음과 같은 단계로 동작합니다:
 * 1. 현재 사용자와 파트너의 세션을 확인
 * 2. 각자의 Google Drive API 클라이언트를 생성
 * 3. 각자의 폴더에서 최신 DB 파일을 찾음
 * 4. 두 DB 파일을 다운로드하여 임시 파일로 저장
 * 5. 각각의 SQLite 데이터베이스에서 소비 기록을 조회
 * 6. 두 데이터를 합치고 지출자 정보를 추가
 * 7. 임시 파일들을 정리
 *
 * @returns 부부 동기화 결과 (성공/실패, 각자의 소비 기록 데이터 또는 에러 메시지)
 */
export async function syncCoupleWithGoogleDrive(): Promise<CoupleSyncResult> {
  try {
    // 1. 현재 사용자 세션 검증
    const currentSession = await getCurrentSession();
    validateSession(currentSession);

    // 2. 파트너 정보 확인 (실제로는 데이터베이스에서 가져와야 함)
    // 현재는 환경 변수로 설정된 파트너 정보를 사용
    const partnerEmail = process.env.PARTNER_EMAIL;
    const partnerFolderId = process.env.PARTNER_GOOGLE_DRIVE_FOLDER_ID;

    if (!partnerEmail || !partnerFolderId) {
      throw new Error("파트너 정보가 설정되지 않았습니다.");
    }

    // 3. 현재 사용자의 Google Drive에서 데이터 가져오기
    const currentOAuth2Client = createOAuth2Client(
      currentSession.accessToken,
      currentSession.refreshToken
    );
    const currentDrive = createDriveClient(currentOAuth2Client);

    const currentLatestFile = await findLatestDbFile(currentDrive);
    const currentFileData = await downloadFile(
      currentDrive,
      currentLatestFile.id
    );
    const currentTempDbPath = createTempDbPath();
    saveArrayBufferToFile(currentFileData, currentTempDbPath);

    let husbandRecords: CoupleSpendingList[] = [];
    let wifeRecords: CoupleSpendingList[] = [];

    // 현재 사용자가 남편인지 아내인지 판단 (실제로는 세션에서 가져와야 함)
    const currentUserRole = currentSession.user?.role || "husband";

    try {
      const currentSpendingList = getSpendingRecords(currentTempDbPath);

      if (currentUserRole === "husband") {
        husbandRecords = currentSpendingList.map((record) => ({
          ...record,
          spender: "husband" as const,
          isShared: false,
        }));
      } else {
        wifeRecords = currentSpendingList.map((record) => ({
          ...record,
          spender: "wife" as const,
          isShared: false,
        }));
      }
    } finally {
      cleanupTempFile(currentTempDbPath);
    }

    // 4. 파트너의 Google Drive에서 데이터 가져오기
    // 실제로는 파트너의 액세스 토큰이 필요하지만, 현재는 같은 폴더를 사용
    const partnerOAuth2Client = createOAuth2Client(
      currentSession.accessToken, // 실제로는 파트너의 토큰이 필요
      currentSession.refreshToken
    );
    const partnerDrive = createDriveClient(partnerOAuth2Client);

    // 파트너 폴더에서 파일 찾기 (실제로는 파트너의 폴더 ID 사용)
    const partnerLatestFile = await findLatestDbFile(
      partnerDrive,
      partnerFolderId
    );
    const partnerFileData = await downloadFile(
      partnerDrive,
      partnerLatestFile.id
    );
    const partnerTempDbPath = createTempDbPath();
    saveArrayBufferToFile(partnerFileData, partnerTempDbPath);

    try {
      const partnerSpendingList = getSpendingRecords(partnerTempDbPath);

      const partnerUserRole =
        currentUserRole === "husband" ? "wife" : "husband";

      if (partnerUserRole === "husband") {
        husbandRecords = partnerSpendingList.map((record) => ({
          ...record,
          spender: "husband" as const,
          isShared: false,
        }));
      } else {
        wifeRecords = partnerSpendingList.map((record) => ({
          ...record,
          spender: "wife" as const,
          isShared: false,
        }));
      }
    } finally {
      cleanupTempFile(partnerTempDbPath);
    }

    return {
      success: true,
      husbandRecords,
      wifeRecords,
    };
  } catch (error) {
    console.error("부부 Google Drive 동기화 중 오류 발생:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
