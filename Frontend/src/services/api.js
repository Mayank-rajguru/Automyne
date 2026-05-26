import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export async function fetchTickerData(
  ticker
) {
  try {
    const response =
      await axios.post(
        `${API_BASE}/run-pipeline`,
        {
          ticker,
        }
      );

    const result =
      response.data;

    const cleaned =
      (result.chart_data || [])
        .map((row) => ({
          ...row,

          Close: Number(
            row.Close
          ),

          avg_sentiment: Number(
            row.avg_sentiment
          ),

          num_posts: Number(
            row.num_posts
          ),
        }))
        .filter(
          (r) =>
            !Number.isNaN(
              r.Close
            ) &&
            !Number.isNaN(
              r.avg_sentiment
            )
        );

    return {
      success: true,

      data: cleaned,

      raw: result,
    };
  } catch (error) {
    console.error(
      "API Error:",
      error
    );

    return {
      success: false,

      data: [],

      error:
        error?.response?.data
          ?.detail ||
        "Failed to fetch data",
    };
  }
}