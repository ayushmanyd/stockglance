import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StockChart({ stock }) {
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const basePrice = stock.price - stock.price * (stock.change / 100);

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const randomFactor = Math.random() * 0.02 - 0.01;
      const trendFactor = (i / 30) * (stock.change / 100);
      const price = basePrice * (1 + randomFactor + trendFactor);

      data.push({
        date: date.toISOString().split("T")[0],
        price: Number.parseFloat(price.toFixed(2)),
      });
    }

    return data;
  }, [stock]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return (
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {formattedDate}
          </p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartColor = stock.change >= 0 ? "#16a34a" : "#e11d48";

  return (
    <div className="h-[250px] w-full overflow-x-auto">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            minTickGap={30}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
            width={60}
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={2}
            fill="url(#colorPrice)"
            activeDot={{
              r: 6,
              fill: chartColor,
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
