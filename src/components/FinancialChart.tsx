import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: {
    week: string;
    income: number;
    expense: number;
  }[];
}

export default function FinancialChart({ data }: Props) {
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="h-72 w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.2} />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />

            <Tooltip
              formatter={(value) => formatMoney(Number(value))}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#527D79"
              strokeWidth={3}
              dot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#D9A88F"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          No transaction data yet.
        </div>
      )}
    </div>
  );
}
