const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

const stockSymbols = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "TSLA",
  "NVDA",
  "DIS",
  "NFLX",
  "PEP",
  "JPM",
];

export default async function fetchStockData() {
  try {
    const stockData = await Promise.all(
      stockSymbols.map(async (symbol) => {
        const [quoteRes, profileRes] = await Promise.all([
          fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
          fetch(
            `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
          ),
        ]);

        if (quoteRes.status === 429 || profileRes.status === 429) {
          throw { type: "RATE_LIMIT", message: "API rate limit exceeded" };
        }

        const quote = await quoteRes.json();
        const profile = await profileRes.json();

        return {
          symbol: symbol,
          companyName: profile.name,
          price: quote.c,
          change: quote.dp,
          industry: profile.finnhubIndustry,
          marketCap: profile.marketCapitalization * 1e6,
        };
      })
    );

    return stockData;
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    throw new Error("Unable to fetch stock data from Finnhub");
  }
}
