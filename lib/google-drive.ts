import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth2 클라이언트를 생성하는 함수
 * @param accessToken - 액세스 토큰
 * @param refreshToken - 리프레시 토큰
 * @returns OAuth2 클라이언트
 */
export function createOAuth2Client(
  accessToken: string,
  refreshToken?: string
): OAuth2Client {
  console.log("OAuth2Client 생성 중:", {
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken
  });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth 환경변수가 누락되었습니다.");
  }

  if (!accessToken) {
    throw new Error("액세스 토큰이 누락되었습니다.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Google Drive API 클라이언트를 생성하는 함수
 * @param oauth2Client - OAuth2 클라이언트
 * @returns Google Drive API 클라이언트
 */
export function createDriveClient(oauth2Client: OAuth2Client) {
  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
}

/**
 * 폴더명을 이용해 Google Drive 폴더 ID를 조회하는 함수
 * @param drive - Google Drive API 클라이언트
 * @param folderName - 폴더명
 * @returns 폴더 ID
 */
export async function getFolderIdByName(
  drive: any,
  folderName: string
): Promise<string> {
  try {
    console.log(`폴더 검색 시작: ${folderName}`);
    
    const { data } = await drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`,
      fields: "files(id, name)",
      pageSize: 1,
    });

    console.log("폴더 검색 결과:", data?.files);

    const folder = data?.files?.[0];
    if (!folder || !folder.id) {
      throw new Error(`${folderName} 폴더를 찾을 수 없습니다. 폴더명을 확인해주세요.`);
    }
    
    console.log(`폴더 ID 찾기 완료: ${folder.id}`);
    return folder.id;
  } catch (error) {
    console.error(`폴더 검색 실패 (${folderName}):`, error);
    throw error;
  }
}

/**
 * Google Drive에서 최신 DB 파일을 찾는 함수
 * @param drive - Google Drive API 클라이언트
 * @returns 최신 DB 파일 정보
 */
export async function findLatestDbFile(drive: any) {
  try {
    console.log("최신 DB 파일 검색 시작");
    
    const targetFolderId = await getFolderIdByName(
      drive,
      process.env.GOOGLE_DRIVE_FOLDER_NAME!
    );

    if (!targetFolderId) {
      throw new Error("GOOGLE_DRIVE_FOLDER_ID 환경 변수가 설정되지 않았습니다.");
    }

    console.log(`대상 폴더 ID: ${targetFolderId}`);

    const { data } = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name, modifiedTime)",
      orderBy: "modifiedTime desc",
      q: `'${targetFolderId}' in parents and name contains 'clevmoney_' and trashed = false`,
    });

    console.log("DB 파일 검색 결과:", data?.files);

    const latestFile = data?.files?.[0];
    if (!latestFile || !latestFile.id) {
      throw new Error("Google Drive에서 clevmoney_ 파일을 찾을 수 없습니다. 파일이 올바른 폴더에 있는지 확인해주세요.");
    }

    console.log(`최신 DB 파일 찾기 완료: ${latestFile.name} (${latestFile.id})`);
    return latestFile;
  } catch (error) {
    console.error("최신 DB 파일 검색 실패:", error);
    throw error;
  }
}

/**
 * Google Drive에서 파일을 다운로드하는 함수
 * @param drive - Google Drive API 클라이언트
 * @param fileId - 파일 ID
 * @returns 파일 데이터 (ArrayBuffer)
 */
export async function downloadFile(
  drive: any,
  fileId: string
): Promise<ArrayBuffer> {
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  return response.data as ArrayBuffer;
}
