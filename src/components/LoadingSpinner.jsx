export default function LoadingSpinner() {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading stock data...</p>
      </div>
    )
  }
  