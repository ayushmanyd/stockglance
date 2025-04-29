import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function StockTable({ stocks, onSelectStock, selectedStock }) {
  const [sortConfig, setSortConfig] = useState({
    key: "symbol",
    direction: "ascending",
  });

  const sortedStocks = [...stocks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse overflow-x-auto">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <th
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              onClick={() => requestSort("symbol")}
            >
              <div className="flex items-center">
                Symbol
                {getSortIcon("symbol")}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              onClick={() => requestSort("companyName")}
            >
              <div className="flex items-center">
                Company
                {getSortIcon("companyName")}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              onClick={() => requestSort("price")}
            >
              <div className="flex items-center">
                Price
                {getSortIcon("price")}
              </div>
            </th>
            <th
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              onClick={() => requestSort("change")}
            >
              <div className="flex items-center">
                Change %{getSortIcon("change")}
              </div>
            </th>
            <th className="hidden px-4 py-3 md:table-cell">Industry</th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                No stocks found.
              </td>
            </tr>
          ) : (
            sortedStocks.map((stock) => (
              <tr
                key={stock.symbol}
                className={`cursor-pointer border-b transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                  selectedStock && selectedStock.symbol === stock.symbol
                    ? "bg-gray-100 dark:bg-gray-700/30"
                    : ""
                }`}
                onClick={() => onSelectStock(stock)}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {stock.symbol}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-gray-700 dark:text-gray-300">
                  {stock.companyName}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  ${stock.price.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-3 ${
                    stock.change >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </td>
                <td className="hidden px-4 py-3 text-gray-700 dark:text-gray-300 md:table-cell">
                  {stock.industry}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
