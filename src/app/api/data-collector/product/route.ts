import { brightDataScrape } from "@/modules/scraper/scraper.client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const asin = searchParams.get("asin");

    if (!asin) {
      return Response.json(
        { error: "ASIN is required" },
        { status: 400 }
      );
    }

    const datasetId =
      process.env.BRIGHTDATA_DATASET_ID;

    if (!datasetId) {
      return Response.json(
        {
          error:
            "BRIGHTDATA_DATASET_ID is not configured",
        },
        { status: 500 }
      );
    }

    const result = await brightDataScrape(
      datasetId,
      [
        {
          "url": `https://www.amazon.in/dp/${asin}`,
        },
      ]
    );

    return Response.json(result);
  } catch (error: any) {
    console.error(
      error.response?.data || error.message
    );

    return Response.json(
      {
        error:
          error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

