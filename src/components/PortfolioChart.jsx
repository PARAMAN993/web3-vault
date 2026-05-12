import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useMemo } from "react";
import { useGetPortfolioHistory } from "../hooks/useGetPortfolioHistory";

export default function PortfolioChart({ uid }) {
  const history = useGetPortfolioHistory(uid);

  const data = useMemo(() => {
    return history.map((item) => ({
      time: item.time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.value,
    }));
  }, [history]);

  if (!history.length) {
    return (
      <div style={{ padding: "20px", color: "#888" }}>
        No portfolio history yet...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              `$${Number(value).toLocaleString()}`
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00ffcc"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}