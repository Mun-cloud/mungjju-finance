"use server";

import { auth } from "@/auth";
import { google } from "googleapis";
import Database from "better-sqlite3";
import { writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { SpendingList } from "@/types/list";

export async function syncWithGoogleDrive() {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No access token found");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    const { data } = await drive.files.list({
      pageSize: 1,
      fields: "files(id)",
      orderBy: "modifiedTime desc",
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name contains '.db'`,
    });

    const latestFile = data?.files?.[0];
    if (!latestFile || !latestFile.id) {
      throw new Error("No DB file found");
    }

    // Download the file as ArrayBuffer
    const response = await drive.files.get(
      { fileId: latestFile.id, alt: "media" },
      { responseType: "arraybuffer" }
    );

    // Create a temporary file path
    const tempDbPath = join(tmpdir(), `temp-${Date.now()}.db`);

    // Write the DB file to temp directory
    writeFileSync(tempDbPath, Buffer.from(response.data as ArrayBuffer));

    // Open and read from the SQLite database
    const db = new Database(tempDbPath);

    // Check catelist table schema
    const catelistSchema = db.prepare("PRAGMA table_info(catelist)").all();
    console.log("Catelist schema:", JSON.stringify(catelistSchema, null, 2));

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
          c1.c_name as category_name,
          c2.c_name as subcategory_name
        FROM spendinglist s
        LEFT JOIN catelist c1 ON CAST(s.s_cate AS INTEGER) = c1._id
        LEFT JOIN catelist c2 ON CAST(s.s_subcate AS INTEGER) = c2._id
        ORDER BY s.s_date DESC
      `
      )
      .all() as SpendingList[];

    // Close the database connection
    db.close();

    // Clean up the temporary file
    try {
      writeFileSync(tempDbPath, ""); // Clear the file
    } catch (e) {
      console.error("Error cleaning up temp file:", e);
    }

    return {
      success: true,
      spendingList,
    };
  } catch (error) {
    console.error("Error processing DB file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
