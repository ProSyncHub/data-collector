import { NextRequest, NextResponse } from "next/server";
import { downloadBrightData, waitForBrightData } from "@/modules/scraper/scraper.client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } =
      new URL(request.url);

    const snapshotId =
      searchParams.get("snapshotId");

    if (!snapshotId) {
      return NextResponse.json(
        {
          error: "snapshotId is required",
        },
        { status: 400 }
      );
    }

    await waitForBrightData(snapshotId);

    const data = await downloadBrightData(snapshotId);

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Best sellers scraping failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to scrape best sellers",
      },
      { status: 500 }
    );
  }
}