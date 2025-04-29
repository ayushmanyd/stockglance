import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import fetchStockData from "../api/fetchStockData";
import StockTable from "./StockTable";
import StockChart from "./StockChart";
import LoadingSpinner from "./LoadingSpinner";
import BookmarkedStocks from "./BookmarkedStocks";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [bookmarkedStocks, setBookmarkedStocks] = useState([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedStocks");
    if (savedBookmarks) {
      try {
        setBookmarkedStocks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarked stocks", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedStocks", JSON.stringify(bookmarkedStocks));
  }, [bookmarkedStocks]);

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        const data = await fetchStockData();
        setStocks(data);
        setFilteredStocks(data);
        setSelectedStock(data[0]);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setError("RATE_LIMIT");
        } else if (err.status === 429) {
          setError("RATE_LIMIT");
        } else {
          setError(err.message || "UNKNOWN");
        }
        setLoading(false);
      }
    };
    loadStockData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  const isBookmarked = (symbol) => {
    return bookmarkedStocks.some((stock) => stock.symbol === symbol);
  };

  const toggleBookmark = (stock) => {
    if (isBookmarked(stock.symbol)) {
      setBookmarkedStocks(
        bookmarkedStocks.filter((s) => s.symbol !== stock.symbol)
      );
    } else {
      setBookmarkedStocks([...bookmarkedStocks, stock]);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1f1f23] dark:text-white">
          StockGlance: Stock Market Dashboard
        </h1>
        <p className="mt-2 text-gray-400">
          Real-time stock prices and market trends
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-rose-100 p-4 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
          <p className="font-medium">Error loading stock data: {error}</p>
          <p className="mt-1 text-sm">
            429 Too Many Requests. Please try again later or check your
            connection.
          </p>
        </div>
      )}

      <div className="mb-6 flex items-center rounded-lg border bg-[#1f1f23] p-2 shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23] transition-all duration-200">
        <Search className="ml-2 h-5 w-5 text-gray-200" />
        <input
          type="text"
          placeholder="Search stocks by symbol or company name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full border-0 bg-transparent p-2 focus:outline-none dark:text-gray-300"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex h-[500px] items-center justify-center rounded-lg border bg-[#1f1f23] shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-lg border bg-[#1f1f23] shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23]">
              <StockTable
                stocks={filteredStocks}
                onSelectStock={handleSelectStock}
                selectedStock={selectedStock}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex h-[500px] items-center justify-center rounded-lg border bg-[#1f1f23] shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23]">
              <LoadingSpinner />
            </div>
          ) : selectedStock ? (
            <div className="rounded-lg border bg-[#1f1f23] p-4 shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23]">
              <div className="flex items-center justify-between">
                <h2 className="mb-4 text-xl font-semibold text-[#1f1f23] dark:text-white">
                  {selectedStock.symbol} - {selectedStock.companyName}
                </h2>
                <button
                  onClick={() => toggleBookmark(selectedStock)}
                  className={`flex items-center rounded-md px-3 py-1 text-sm font-medium transition-all duration-150 ${
                    isBookmarked(selectedStock.symbol)
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`mr-1 h-4 w-4 ${
                      isBookmarked(selectedStock.symbol)
                        ? "fill-amber-500 dark:fill-amber-300"
                        : "fill-none stroke-current"
                    }`}
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {isBookmarked(selectedStock.symbol)
                    ? "Bookmarked"
                    : "Bookmark"}
                </button>
              </div>
              <StockChart stock={selectedStock} />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                  <p className="text-sm text-sky-500 dark:text-sky-300">
                    Current Price
                  </p>
                  <p className="text-lg font-bold text-[#1f1f23] dark:text-white">
                    ${selectedStock.price.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                  <p className="text-sm text-sky-500 dark:text-sky-300">
                    Change
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      selectedStock.change >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.change.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                  <p className="text-sm text-sky-500 dark:text-sky-300">
                    Industry
                  </p>
                  <p className="text-lg font-bold text-[#1f1f23] dark:text-white">
                    {selectedStock.industry}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                  <p className="text-sm text-sky-500 dark:text-sky-300">
                    Market Cap
                  </p>
                  <p className="text-lg font-bold text-[#1f1f23] dark:text-white">
                    ${(selectedStock.marketCap / 1_000_000_000).toFixed(2)}B
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[500px] items-center justify-center rounded-lg border bg-[#1f1f23] shadow-sm dark:border-[#1f1f23] dark:bg-[#1f1f23]">
              <p className="text-[#1f1f23] dark:text-[#1f1f23]">
                Select a stock to view details
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-[#1f1f23] dark:text-white">
          Bookmarked Stocks
        </h2>
        <BookmarkedStocks
          bookmarkedStocks={bookmarkedStocks}
          onSelectStock={handleSelectStock}
          onRemoveBookmark={toggleBookmark}
        />
      </div>
    </div>
  );
}
