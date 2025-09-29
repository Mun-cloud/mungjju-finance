import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET: 월별 메모 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { error: "Year and month parameters are required" },
        { status: 400 }
      );
    }

    const memo = await prisma.monthlyMemo.findUnique({
      where: {
        userEmail_year_month: {
          userEmail: session.user.email,
          year: parseInt(year),
          month: parseInt(month),
        },
      },
    });

    return NextResponse.json({ memo: memo?.memo || "" });
  } catch (error) {
    console.error("Error fetching monthly memo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: 월별 메모 저장/수정
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { year, month, memo } = await request.json();

    if (!year || !month) {
      return NextResponse.json(
        { error: "Year and month are required" },
        { status: 400 }
      );
    }

    const result = await prisma.monthlyMemo.upsert({
      where: {
        userEmail_year_month: {
          userEmail: session.user.email,
          year: parseInt(year),
          month: parseInt(month),
        },
      },
      update: {
        memo: memo || null,
      },
      create: {
        userEmail: session.user.email,
        year: parseInt(year),
        month: parseInt(month),
        memo: memo || null,
      },
    });

    return NextResponse.json({ success: true, memo: result.memo });
  } catch (error) {
    console.error("Error saving monthly memo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}