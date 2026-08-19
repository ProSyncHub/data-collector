// import { NextRequest, NextResponse } from "next/server";
// import { brightDataRun } from "@/modules/scraper/scraper.client";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } =
//       new URL(request.url);

//     const categoryUrl =
//       searchParams.get("categoryUrl");

//     if (!categoryUrl) {
//       return NextResponse.json(
//         {
//           error: "categoryUrl is required",
//         },
//         { status: 400 }
//       );
//     }

//     const data = await brightDataRun(
//       process.env.BRIGHTDATA_DATASET_ID!,
//       "best_sellers_url",
//       [
//         {
//           category_url: categoryUrl,
//         },
//       ]
//     );

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error(
//       "Best sellers scraping failed:",
//       error
//     );

//     return NextResponse.json(
//       {
//         error: "Failed to scrape best sellers",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerBrightData } from "@/modules/scraper/scraper.client";

export async function GET(
  request: NextRequest
) {
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

    const datasetId =
      process.env.BRIGHTDATA_DATASET_ID;

    if (!datasetId) {
      throw new Error(
        "BRIGHTDATA_DATASET_ID is not configured"
      );
    }

    // Create local job first
    const snapshot = await prisma.bestSellerSnapshot.create({
      data: {
        categoryUrl,
        datasetId,
        status: "TRIGGERED",
      },
    });

    try {
      const triggerResponse =
        await triggerBrightData(
          [
            {
              category_url:
                categoryUrl,
            },
          ],
          {
            type: "discover_new",
            discover_by:
              "best_sellers_url",
              endpoint: "https://data-collector-eta.vercel.app/api/webhooks/bright-data",
              auth_header: `Bearer ${process.env.BRIGHTDATA_WEBHOOK_SECRET}`,
          }
        );

      const snapshotId =
        triggerResponse.snapshot_id;

      if (!snapshotId) {
        throw new Error(
          "Bright Data did not return snapshot_id"
        );
      }

      await prisma.bestSellerSnapshot.update({
        where: {
          id: snapshot.id,
        },
        data: {
          snapshotId,
          status: "RUNNING",
        },
      });

      return NextResponse.json(
        {
          status: "accepted",
          snapshotId,
          categoryUrl,
        },
        { status: 202 }
      );
    } catch (error) {
      await prisma.bestSellerSnapshot.update({
        where: {
          id: snapshot.id,
        },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Unknown error",
        },
      });

      throw error;
    }
  } catch (error) {
    console.error(
      "Best sellers trigger failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to trigger best sellers scraping",
      },
      { status: 500 }
    );
  }
}