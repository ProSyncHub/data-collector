import { NextRequest, NextResponse } from "next/server";
import { brightDataRun } from "@/modules/scraper/scraper.client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } =
      new URL(request.url);

    const categoryUrl =
      searchParams.get("categoryUrl");

    if (!categoryUrl) {
      return NextResponse.json(
        {
          error: "categoryUrl is required",
        },
        { status: 400 }
      );
    }

    const data = await brightDataRun(
      process.env.BRIGHTDATA_DATASET_ID!,
      "best_sellers_url",
      [
        {
          category_url: categoryUrl,
        },
      ]
    );

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