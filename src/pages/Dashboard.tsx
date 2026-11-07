import { useState, useEffect } from "react";

import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import SummaryCard from "../components/SummaryCard";

import FinancialChart from "../components/FinancialChart";

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: "Income" | "Expense";
  date: string;
}

interface Props {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: Props) {

    const [userName, setUserName] = useState(() => {
  try {
    const saved = localStorage.getItem("moneymate-settings");

    return saved ? JSON.parse(saved).name || "Najma" : "Najma";
  } catch {
    return "Najma";
  }
});

useEffect(() => {
  function updateUserName() {
    const saved = localStorage.getItem("moneymate-settings");

    if (saved) {
      setUserName(JSON.parse(saved).name || "Najma");
    }
  }

  window.addEventListener("settingsUpdated", updateUserName);

  return () => {
    window.removeEventListener("settingsUpdated", updateUserName);
  };
}, []);

  // FORMAT RUPIAH
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  // TOTAL INCOME
  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + item.amount, 0);

  // TOTAL EXPENSE
  const expense = transactions
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + item.amount, 0);

  // TOTAL BALANCE
  const balance = income - expense;

  // MEMBUAT DATA GRAFIK DARI TRANSAKSI
  const weeklyData: Record<
    string,
    { week: string; income: number; expense: number; sort: string }
  > = {};

  transactions.forEach((item) => {
    const [year, month, day] = item.date.split("-").map(Number);

    const date = new Date(year, month - 1, day);
    const weekNumber = Math.ceil(day / 7);

    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = Math.min(weekNumber * 7, new Date(year, month, 0).getDate());

    const monthName = date.toLocaleDateString("id-ID", {
      month: "short",
    });

    const key = `${year}-${month}-${weekNumber}`;

    if (!weeklyData[key]) {
      weeklyData[key] = {
        week: `${startDay}-${endDay} ${monthName}`,
        income: 0,
        expense: 0,
        sort: key,
      };
    }

    if (item.type === "Income") {
      weeklyData[key].income += item.amount;
    } else {
      weeklyData[key].expense += item.amount;
    }
  });

  const chartData = Object.values(weeklyData).sort((a, b) =>
    a.sort.localeCompare(b.sort)
  );

  // KATEGORI PENGELUARAN OTOMATIS
  const categoryData = Array.from(
    new Set(
      transactions
        .filter((item) => item.type === "Expense")
        .map((item) => item.category)
    )
  ).map((category) => {
    const total = transactions
      .filter(
        (item) =>
          item.type === "Expense" &&
          item.category === category
      )
      .reduce((sum, item) => sum + item.amount, 0);

    return { category, total };
  }).sort((a, b) => b.total - a.total);

  const totalCategory = categoryData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  // TRANSAKSI TERBARU
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 5);

  return (
    <div className="w-full min-w-0">

      {/* GREETING */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[#26354A]">
          Good Morning, {userName}!
        </h2>

        <p className="mt-2 text-gray-500">
          Let's make your money work better today.
        </p>
      </section>

      {/* SUMMARY CARDS */}
      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <SummaryCard
          title="Total Balance"
          amount={formatMoney(balance)}
          icon={Wallet}
          color="bg-[#E7ECE8] text-[#527D79]"
        />

        <SummaryCard
          title="Total Income"
          amount={formatMoney(income)}
          icon={ArrowDownCircle}
          color="bg-green-100 text-green-700"
        />

        <SummaryCard
          title="Total Expenses"
          amount={formatMoney(expense)}
          icon={ArrowUpCircle}
          color="bg-orange-100 text-orange-700"
        />

      </section>

      {/* CHART AND CATEGORY */}
      <section className="grid min-w-0 gap-6 xl:grid-cols-2">

        
        {/* FINANCIAL OVERVIEW */}
        <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1E293B] sm:p-6">

        <h3 className="mb-6 text-lg font-bold text-[#26354A] dark:text-gray-100">
            Financial Overview
        </h3>

    <FinancialChart data={chartData} />

        </div>
        
        {/* SPENDING BY CATEGORY */}
        <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-6">

          <h3 className="mb-6 text-lg font-bold text-[#26354A]">
            Spending by Category
          </h3>

          {categoryData.length > 0 ? (
            <div className="space-y-6">

              {categoryData.map((item) => {
                const percent = totalCategory
                  ? (item.total / totalCategory) * 100
                  : 0;

                return (
                  <div key={item.category}>

                    <div className="mb-2 flex justify-between gap-2 text-sm">
                      <span>{item.category}</span>

                      <span className="font-semibold">
                        {percent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#527D79] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatMoney(item.total)}
                    </p>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              No expense data yet.
            </div>
          )}

        </div>

      </section>

      {/* RECENT TRANSACTIONS */}
      <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">

        <h3 className="mb-4 text-lg font-bold text-[#26354A]">
          Recent Transactions
        </h3>

        {recentTransactions.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 py-4 last:border-0"
          >

            <div className="min-w-0">
              <p className="break-words font-semibold">
                {item.title}
              </p>

              <p className="text-sm text-gray-500">
                {item.category} · {item.date}
              </p>
            </div>

            <span
              className={
                item.type === "Income"
                  ? "font-semibold text-green-600"
                  : "font-semibold text-orange-600"
              }
            >
              {item.type === "Income" ? "+" : "-"}
              {formatMoney(item.amount)}
            </span>

          </div>
        ))}

        {transactions.length === 0 && (
          <p className="py-5 text-center text-sm text-gray-400">
            No transactions yet.
          </p>
        )}

      </section>

    </div>
  );
}
