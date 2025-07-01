import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth2 클라이언트를 생성하는 함수
 * @param accessToken - 액세스 토큰
 * @param refreshToken - 리프레시 토큰
 * @returns OAuth2 클라이언트
 */
export function createOAuth2Client(accessToken: string): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
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
  const { data } = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 1,
  });

  const folder = data?.files?.[0];
  if (!folder || !folder.id) {
    throw new Error(`${folderName} 폴더를 찾을 수 없습니다.`);
  }
  return folder.id;
}

/**
 * Google Drive에서 최신 DB 파일을 찾는 함수
 * @param drive - Google Drive API 클라이언트
 * @returns 최신 DB 파일 정보
 */
export async function findLatestDbFile(drive: any) {
  const targetFolderId = await getFolderIdByName(
    drive,
    process.env.GOOGLE_DRIVE_FOLDER_NAME!
  );

  if (!targetFolderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID 환경 변수가 설정되지 않았습니다.");
  }

  const { data } = await drive.files.list({
    pageSize: 1,
    fields: "files(id)",
    orderBy: "modifiedTime desc",
    q: `'${targetFolderId}' in parents and name contains 'clevmoney_' and trashed = false`,
  });

  const latestFile = data?.files?.[0];
  if (!latestFile || !latestFile.id) {
    throw new Error("Google Drive에서 clevmoney_ 파일을 찾을 수 없습니다.");
  }

  return latestFile;
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
