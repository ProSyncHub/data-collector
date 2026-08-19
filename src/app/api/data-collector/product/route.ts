// import { scrapeData, scrapeData2, scrapeDataProduct } from "@/modules/scraper/scraper.service";

// // export async function GET() {
// //   try {
// //     const result1 = await scrapeData();
// //     const result2 = await scrapeData2();
// //     const result3 = await scrapeDataProduct();
// //     return new Response(JSON.stringify({ result1, result2, result3 }), { status: 200 });
// //   } catch (error) {
// //     console.error(error);
// //     return new Response(JSON.stringify({ error: "Failed to scrape data" }), { status: 500 });
// //   }
// // }

// export async function GET() {
//   try {
//     const result = await scrapeDataProduct();

//     return Response.json({
//       result,
//     });
//   } catch (error: any) {
//     console.error(
//       error.response?.data || error.message
//     );

//     return Response.json(
//       {
//         error:
//           error.response?.data ||
//           error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


// import { scrapeProduct } from "@/modules/scraper/amazon.scraper";

import { brightDataRun } from "@/modules/scraper/scraper.client";

export async function GET(
  request: Request
) {
  const { searchParams } = new URL(request.url);

  const asin = searchParams.get("asin");

  if (!asin) {
    return Response.json(
      { error: "ASIN is required" },
      { status: 400 }
    );
  }

  const result = await brightDataRun(
  process.env.BRIGHTDATA_DATASET_ID!,
  "url",
  [
    {
      url: `https://www.amazon.in/dp/${asin}`,
    },
  ]
);

  return Response.json(result);
}