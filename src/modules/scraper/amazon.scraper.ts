// import { brightDataScrape } from "./scraper.client";

// const AMAZON_DATASET_ID = "gd_l7q7dkf244hwjntr0";

// export async function scrapeProduct(asin: string) {
//   return brightDataScrape(
//     AMAZON_DATASET_ID,

//     {
//       notify: "false",
//       format: "json",
//     },

//     [
//       {
//         url: `https://www.amazon.in/dp/${asin}`,
//       },
//     ]
//   );
// }

// export async function scrapeBestSellers(categoryUrl: string) {
//   return brightDataScrape(
//     AMAZON_DATASET_ID,
//     {
//       notify: "false",
//       type: "discover_new",
//       discover_by: "best_sellers_url",
//       include_errors: "true",
//     },
//     [
//       {
//         category_url: categoryUrl,
//       },
//     ]
//   );
// }