import Database from "better-sqlite3";
import { writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { SpendingList } from "@/types/list";

/**
 * 데이터베이스의 모든 테이블 스키마를 확인하는 함수
 * @param dbPath - 데이터베이스 파일 경로
 */
export function inspectDatabaseSchema(dbPath: string) {
  const db = new Database(dbPath);

  try {
    // 모든 테이블 목록 조회
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all();
    console.log("=== 데이터베이스 테이블 목록 ===");
    console.log(tables);

    // 각 테이블의 스키마 확인
    for (const table of tables) {
      const tableName = (table as any).name;
      const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
      console.log(`\n=== ${tableName} 테이블 스키마 ===`);
      console.log(JSON.stringify(schema, null, 2));

      // 각 테이블의 샘플 데이터 확인 (최대 5개)
      try {
        const sampleData = db
          .prepare(`SELECT * FROM ${tableName} LIMIT 5`)
          .all();
        console.log(`\n=== ${tableName} 샘플 데이터 ===`);
        console.log(JSON.stringify(sampleData, null, 2));
      } catch (e) {
        console.log(`\n=== ${tableName} 테이블 읽기 오류 ===`);
        console.log(e);
      }
    }
  } finally {
    db.close();
  }
}

/**
 * SQLite 데이터베이스에서 소비 기록을 조회하는 함수
 * @param dbPath - 데이터베이스 파일 경로
 * @returns 소비 기록 배열
 */
export function getSpendingRecords(dbPath: string): SpendingList[] {
  const db = new Database(dbPath);

  try {
    // 먼저 데이터베이스 스키마 확인
    inspectDatabaseSchema(dbPath);

    // 카테고리 테이블 스키마 확인 (디버깅용)
    const catelistSchema = db.prepare("PRAGMA table_info(catelist)").all();
    console.log("Catelist schema:", JSON.stringify(catelistSchema, null, 2));

    // 소비 기록 조회 쿼리
    const spendingList = db
      .prepare(
        `
        SELECT 
          s._id,
          s.s_date,
          s.s_time,
          s.s_where,
          s.s_memo,
          s.s_card,
          CAST(s.s_cate AS INTEGER) as s_cate,
          CAST(s.s_subcate AS INTEGER) as s_subcate,
          CAST(s.s_price AS INTEGER) as s_price,
          s.s_cardmonth,
          s.s_ipter,
          s.s_oraw,
          c1.c_name as category_name,
          c2.c_name as subcategory_name
        FROM spendinglist s
        LEFT JOIN catelist c1 ON CAST(s.s_cate AS INTEGER) = c1._id
        LEFT JOIN catelist c2 ON CAST(s.s_subcate AS INTEGER) = c2._id
        ORDER BY s.s_date DESC, s.s_time DESC
      `
      )
      .all() as SpendingList[];

    return spendingList;
  } finally {
    db.close();
  }
}

/**
 * 임시 파일 경로를 생성하는 함수
 * @returns 임시 파일 경로
 */
export function createTempDbPath(): string {
  return join(tmpdir(), `temp-${Date.now()}.db`);
}

/**
 * ArrayBuffer를 임시 파일로 저장하는 함수
 * @param data - 저장할 데이터
 * @param filePath - 저장할 파일 경로
 */
export function saveArrayBufferToFile(
  data: ArrayBuffer,
  filePath: string
): void {
  writeFileSync(filePath, Buffer.from(data));
}

/**
 * 임시 파일을 정리하는 함수
 * @param filePath - 정리할 파일 경로
 */
export function cleanupTempFile(filePath: string): void {
  try {
    writeFileSync(filePath, ""); // 파일 내용을 비움
  } catch (e) {
    console.error("Error cleaning up temp file:", e);
  }
}
