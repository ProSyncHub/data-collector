import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processBestSellerSnapshot } from "@/modules/scraper/best-sellers.processor";

function isAuthorized(
  request: NextRequest
) {
  const expected =
    process.env.BRIGHTDATA_WEBHOOK_SECRET;

  if (!expected) {
    throw new Error(
      "BRIGHTDATA_WEBHOOK_SECRET is not configured"
    );
  }

  const authorization =
    request.headers.get(
      "authorization"
    );

  return (
    authorization ===
    `Bearer ${expected}`
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload =
      await request.json();

    console.log(
      "========== BRIGHT DATA WEBHOOK =========="
    );

    console.log(
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    console.log(
      "=========================================="
    );

    /*
     * Bright Data's webhook payload format
     * should be mapped here.
     *
     * We need snapshot_id and the resulting
     * product records.
     */

    const snapshotId =
      payload.snapshot_id;

    const products =
      Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

    if (!snapshotId) {
      return NextResponse.json(
        {
          error:
            "snapshot_id missing",
        },
        { status: 400 }
      );
    }

    await processBestSellerSnapshot(
      snapshotId,
      products
    );

    return NextResponse.json({
      received: true,
      snapshotId,
      itemCount:
        products.length,
    });
  } catch (error) {
    console.error(
      "Bright Data webhook failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}