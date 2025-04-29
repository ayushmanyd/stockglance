export default function BookmarkedStocks({
  bookmarkedStocks,
  onSelectStock,
  onRemoveBookmark,
}) {
  if (bookmarkedStocks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-[#1f1f23]">
        <p className="text-gray-500 dark:text-gray-400">
          No bookmarked stocks yet. Click the bookmark button to add stocks.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1f1f23] overflow-x-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto">
        {bookmarkedStocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex flex-col rounded-lg border border-gray-200 bg-[#1f1f23] p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-[#1f1f23]/50"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {stock.symbol}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBookmark(stock);
                }}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                title="Remove bookmark"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
              {stock.companyName}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${stock.price.toFixed(2)}
              </span>
              <span
                className={`rounded-md px-2 py-1 text-sm font-medium ${
                  stock.change >= 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </span>
            </div>
            <button
              onClick={() => onSelectStock(stock)}
              className="mt-3 rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
