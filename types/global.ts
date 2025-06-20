import { SpendingList } from "./list";

declare global {
  interface Window {
    SQL: any;
    initSqlJs: () => Promise<any>;
  }
}

export {};

/**
 * 부부 관계 정보
 */
export interface CoupleInfo {
  id: string;
  husbandId: string;
  wifeId: string;
  husbandEmail: string;
  wifeEmail: string;
  husbandName: string;
  wifeName: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * 사용자 정보 (부부 가계부용)
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "husband" | "wife";
  partnerId?: string;
  googleDriveFolderId?: string; // 개인 Google Drive 폴더 ID
  createdAt: Date;
}

/**
 * 부부 동기화 결과
 */
export interface CoupleSyncResult {
  success: boolean;
  husbandRecords?: SpendingList[];
  wifeRecords?: SpendingList[];
  error?: string;
}

/**
 * 지출 기록 (부부용 확장)
 */
export interface CoupleSpendingList extends SpendingList {
  spender?: "husband" | "wife"; // 지출자 구분
  isShared?: boolean; // 공동 지출 여부
  sharedAmount?: number; // 공동 지출 금액
}
