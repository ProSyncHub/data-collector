import axios from "axios";

const apiKey = process.env.BRIGHT_DATA_API_KEY;

export async function scrapeData() {
    const data = JSON.stringify({
	input: [{"url":"https://www.amazon.in/gp/bestsellers/kitchen/ref=zg_bs_kitchen_sm","sort_by":"Best Sellers","zipcode":""}],
	limit_per_input: 20,
});
try {
    
    const response = await axios
    .post("https://api.brightdata.com/datasets/v3/scrape?dataset_id=gd_l7q7dkf244hwjntr0&notify=false&include_errors=true&type=discover_new&discover_by=category_url",
		data,
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
        }
    )
    
    return response.data;
} catch (error: any) {
    console.error(
      error.response?.data || error.message
    );

    throw error;
}}

export async function scrapeData2() {
  
  const url =
    "https://api.brightdata.com/datasets/v3/scrape" +
    "?dataset_id=gd_l7q7dkf244hwjntr0" +
    "&type=discover_new" +
    "&discover_by=best_sellers_url" +
    "&notify=false" +
    "&include_errors=true";

  const data = [
    {
      url: "https://www.amazon.in/gp/bestsellers/kitchen"
    }
  ];

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
}

export async function scrapeDataProduct() {
  const response = await axios.post(
    "https://api.brightdata.com/datasets/v3/scrape" +
      "?dataset_id=gd_l7q7dkf244hwjntr0" +
      "&format=json",
    [
      {
        url: "https://www.amazon.in/dp/B083C6XMKQ",
      },
    ],
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(
    JSON.stringify(response.data, null, 2)
  );

  return response.data;
}



export async function scrapeBestSellers() {
  const url =
    "https://api.brightdata.com/datasets/v3/trigger";

  const params = {
    dataset_id: "gd_l7q7dkf244hwjntr0",
    include_errors: "true",
    type: "discover_new",
    discover_by: "best_sellers_url",
  };

  const data = [
    {
      category_url:
        "https://www.amazon.in/gp/bestsellers/kitchen",
    },
  ];

  try {
    const response = await axios.post(url, data, {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      JSON.stringify(response.data, null, 2)
    );

    return response.data;
  } catch (error: any) {
    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
}