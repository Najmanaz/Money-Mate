import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { Transaction } from "./Transactions";

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#527D79",
  "#D9A88F",
  "#7B8DA6",
  "#C8BFAF",
  "#A78BBA",
  "#E6B85C",
  "#8FAF9D",
];

const chartCardStyle =
  "[--chart-text:#64748b] [--chart-tooltip-bg:#ffffff] [--chart-tooltip-border:#e5e7eb] [--chart-grid:#e5e7eb] [--chart-axis:#d1d5db] dark:[--chart-text:#cbd5e1] dark:[--chart-tooltip-bg:#1e293b] dark:[--chart-tooltip-border:#475569] dark:[--chart-grid:#475569] dark:[--chart-axis:#64748b]";

export default function Analytics({ transactions }: Props) {
  const [selectedMonth, setSelectedMonth] = useState("all");

  // FORMAT RUPIAH
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // DAFTAR BULAN
  const monthOptions = Array.from(
    new Set(transactions.map((item) => item.date.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  // FILTER TRANSAKSI
  const filteredTransactions = transactions.filter((item) =>
    selectedMonth === "all"
      ? true
      : item.date.startsWith(selectedMonth)
  );

  // TOTAL PEMASUKAN
  const income = filteredTransactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  // TOTAL PENGELUARAN
  const expense = filteredTransactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  // TABUNGAN BERSIH
  const savings = income - expense;

  // FORMAT NAMA BULAN
  const getMonthName = (month: string) => {
    const [year, monthNumber] = month.split("-").map(Number);

    return new Date(year, monthNumber - 1, 1).toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  // DATA GRAFIK BULANAN
  const monthlyData = monthOptions
    .filter((month) =>
      selectedMonth === "all" || month === selectedMonth
    )
    .map((month) => {
      const monthTransactions = transactions.filter((item) =>
        item.date.startsWith(month)
      );

      return {
        month: getMonthName(month),
        income: monthTransactions
          .filter((item) => item.type === "Income")
          .reduce((sum, item) => sum + item.amount, 0),

        expense: monthTransactions
          .filter((item) => item.type === "Expense")
          .reduce((sum, item) => sum + item.amount, 0),
      };
    })
    .reverse();

  // KATEGORI PENGELUARAN
  const categories = Array.from(
    new Set(
      filteredTransactions
        .filter((item) => item.type === "Expense")
        .map((item) => item.category)
    )
  );

  const pieData = categories.map((category) => ({
    name: category,
    value: filteredTransactions
      .filter(
        (item) =>
          item.type === "Expense" &&
          item.category === category
      )
      .reduce((sum, item) => sum + item.amount, 0),
  }));

  // STYLE TOOLTIP
  const tooltipStyle = {
    backgroundColor: "var(--chart-tooltip-bg)",
    border: "1px solid var(--chart-tooltip-border)",
    borderRadius: "12px",
    color: "var(--chart-text)",
    padding: "10px 14px",
  };

  const chartTextStyle = {
    fill: "var(--chart-text)",
    fontSize: 11,
  };

  return (
    <div className="w-full min-w-0 text-[#26354A] dark:text-gray-100">

      {/* HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#26354A] dark:text-[#26354A]">
            Financial Analytics
          </h2>

          <p className="mt-2 text-[#64748B] dark:text-[#64748B]">
            Understand your financial performance.
          </p>
        </div>

        {/* FILTER BULAN */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#26354A] outline-none dark:border-gray-700 dark:bg-[#252F3F] dark:text-gray-100 sm:w-auto"
        >
          <option value="all">All Periods</option>

          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {getMonthName(month)}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Income
          </p>

          <h3 className="mt-3 break-words text-xl font-bold text-green-700 dark:text-green-400 sm:text-2xl">
            {formatMoney(income)}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Expenses
          </p>

          <h3 className="mt-3 break-words text-xl font-bold text-orange-600 dark:text-orange-400 sm:text-2xl">
            {formatMoney(expense)}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Net Savings
          </p>

          <h3 className="mt-3 break-words text-xl font-bold text-[#527D79] dark:text-[#8BBAB3] sm:text-2xl">
            {formatMoney(savings)}
          </h3>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">

        {/* INCOME VS EXPENSES */}
        <div
          className={`min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6 ${chartCardStyle}`}
        >
          <h3 className="mb-6 font-bold text-[#26354A] dark:text-gray-100">
            Income vs Expenses
          </h3>

          {monthlyData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                  />

                  <XAxis
                    dataKey="month"
                    tick={chartTextStyle}
                    interval={0}
                    axisLine={{ stroke: "var(--chart-axis)" }}
                    tickLine={{ stroke: "var(--chart-axis)" }}
                  />

                  <YAxis
                    width={65}
                    tick={chartTextStyle}
                    axisLine={{ stroke: "var(--chart-axis)" }}
                    tickLine={{ stroke: "var(--chart-axis)" }}
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}jt`
                        : value >= 1000
                        ? `${(value / 1000).toFixed(0)}rb`
                        : String(value)
                    }
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "var(--chart-text)" }}
                    itemStyle={{ color: "var(--chart-text)" }}
                    formatter={(value) => formatMoney(Number(value))}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "var(--chart-text)",
                      fontSize: "12px",
                    }}
                  />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#527D79"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#D9A88F"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              No transaction data available.
            </div>
          )}
        </div>

        {/* EXPENSE DISTRIBUTION */}
        <div
          className={`min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6 ${chartCardStyle}`}
        >
          <h3 className="mb-6 font-bold text-[#26354A] dark:text-gray-100">
            Expense Distribution
          </h3>

          {pieData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: "#94a3b8" }}
                  >
                    {pieData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "var(--chart-text)" }}
                    itemStyle={{ color: "var(--chart-text)" }}
                    formatter={(value) => formatMoney(Number(value))}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "var(--chart-text)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              No expense data available.
            </div>
          )}
        </div>

      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] sm:p-6">

        <h3 className="mb-5 font-bold text-[#26354A] dark:text-gray-100">
          Financial Summary
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Transactions
            </span>

            <span className="font-semibold text-[#26354A] dark:text-gray-200">
              {filteredTransactions.length}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Income Transactions
            </span>

            <span className="font-semibold text-green-700 dark:text-green-400">
              {filteredTransactions.filter(
                (item) => item.type === "Income"
              ).length}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Expense Transactions
            </span>

            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {filteredTransactions.filter(
                (item) => item.type === "Expense"
              ).length}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-[#26354A] dark:text-gray-100">
                Net Savings
              </span>

              <span
                className={`font-bold ${
                  savings >= 0
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatMoney(savings)}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
