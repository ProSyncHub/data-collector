import axios from "axios";

const BRIGHT_DATA_API_SCRAPE =
  "https://api.brightdata.com/datasets/v3/scrape";

export async function brightDataScrape(
  datasetId: string,
  body: unknown
) {
  const url = new URL(BRIGHT_DATA_API_SCRAPE);

  url.searchParams.set("dataset_id", datasetId);

  // for (const [key, value] of Object.entries(params)) {
  //   url.searchParams.set(key, value);
  // }

  console.log("========== BRIGHT DATA REQUEST ==========");
  console.log("URL:", url.toString());
  console.log("BODY:", JSON.stringify(body, null, 2));
  console.log("==========================================");

  try {
    const response = await axios.post(
      url.toString(),
      body,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.BRIGHTDATA_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("========== BRIGHT DATA RESPONSE ==========");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;

  } catch (error: any) {
    console.error("========== BRIGHT DATA ERROR ==========");

    console.error(
      JSON.stringify(
        error.response?.data ?? error.message,
        null,
        2
      )
    );

    throw error;
  }
}


// import axios from "axios";

// const BRIGHTDATA_API_URL = "https://api.brightdata.com";

// export async function triggerBrightData(
//   datasetId: string,
//   discoverBy: string,
//   body: unknown[]
// ) {
//   const url = new URL(
//     `${BRIGHTDATA_API_URL}/datasets/v3/trigger`
//   );

//   console.log("discoverBy:", discoverBy);

//   url.searchParams.set("dataset_id", datasetId);
//   url.searchParams.set("type", "discover_new");
//   if (discoverBy==="best_sellers_url") {
//     url.searchParams.set("discover_by", discoverBy);
//   }

//   console.log("========== BRIGHT DATA TRIGGER ==========");
//   console.log("URL:", url.toString());
//   console.log("BODY:", JSON.stringify(body, null, 2));
//   console.log("==========================================");

//   const response = await axios.post(
//     url.toString(),
//     body,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.BRIGHTDATA_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log(
//     "========== BRIGHT DATA TRIGGER RESPONSE =========="
//   );
//   console.log(JSON.stringify(response.data, null, 2));
//   console.log("===================================================");

//   return response.data;
// }

// export async function monitorBrightData(
//   snapshotId: string
// ) {
//   const url =
//     `${BRIGHTDATA_API_URL}/datasets/v3/progress/${snapshotId}`;

//   const response = await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${process.env.BRIGHTDATA_API_TOKEN}`,
//     },
//   });

//   return response.data;
// }

// export async function waitForBrightData(
//   snapshotId: string
// ) {
//     const POLL_INTERVAL = 3000;
//     const MAX_ATTEMPTS = 100;
//   for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
//     const progress = await monitorBrightData(snapshotId);

//     console.log(
//       `Bright Data snapshot ${snapshotId}:`,
//       progress.status
//     );

//     if (progress.status === "ready") {
//       return progress;
//     }

//     if (progress.status === "failed") {
//       throw new Error(
//         `Bright Data scraping failed for snapshot ${snapshotId}`
//       );
//     }

//     await new Promise((resolve) =>
//       setTimeout(resolve, POLL_INTERVAL)
//     );
//   }

//   throw new Error(
//     `Bright Data snapshot ${snapshotId} timed out`
//   );
// }

// export async function downloadBrightData(
//   snapshotId: string
// ) {
//   const url =
//     `${BRIGHTDATA_API_URL}/datasets/v3/snapshot/${snapshotId}`;

//   const response = await axios.get(url, {
//     params: {
//       format: "json",
//     },
//     headers: {
//       Authorization: `Bearer ${process.env.BRIGHTDATA_API_TOKEN}`,
//     },
//   });

//   return response.data;
// }

// export async function brightDataRun(
//   datasetId: string,
//   discoverBy: string,
//   body: unknown[]
// ) {
//   // Trigger
//   const triggerResponse =
//     await triggerBrightData(
//       datasetId,
//       discoverBy,
//       body
//     );

//   const snapshotId =
//     triggerResponse.snapshot_id;

//   if (!snapshotId) {
//     throw new Error(
//       "Bright Data did not return a snapshot ID"
//     );
//   }

//   // Monitor
//   await waitForBrightData(snapshotId);

//   // Download
//   return await downloadBrightData(snapshotId);
// }

const BRIGHTDATA_API_URL =
  process.env.BRIGHTDATA_API_URL ??
  "https://api.brightdata.com";

function getBrightDataToken() {
  const token = process.env.BRIGHTDATA_API_TOKEN;

  if (!token) {
    throw new Error(
      "BRIGHTDATA_API_TOKEN is not configured"
    );
  }

  return token;
}

function getDatasetId() {
  const datasetId =
    process.env.BRIGHTDATA_DATASET_ID;

  if (!datasetId) {
    throw new Error(
      "BRIGHTDATA_DATASET_ID is not configured"
    );
  }

  return datasetId;
}

export async function triggerBrightData(
  body: unknown[],
  params: Record<string, string> = {}
) {
  const url = new URL(
    `${BRIGHTDATA_API_URL}/datasets/v3/trigger`
  );

  url.searchParams.set(
    "dataset_id",
    getDatasetId()
  );

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  console.log(
    "========== BRIGHT DATA TRIGGER =========="
  );

  console.log(
    "URL:",
    url.toString()
  );

  console.log(
    "BODY:",
    JSON.stringify(body, null, 2)
  );

  console.log(
    "=========================================="
  );

  try {
    const response = await axios.post(
      url.toString(),
      body,
      {
        headers: {
          Authorization:
            `Bearer ${getBrightDataToken()}`,
          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "========== BRIGHT DATA TRIGGER RESPONSE =========="
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    console.log(
      "==================================================="
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "========== BRIGHT DATA TRIGGER ERROR =========="
    );

    console.error(
      JSON.stringify(
        error.response?.data ??
          error.message,
        null,
        2
      )
    );

    throw error;
  }
}