
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: "Income" | "Expense";
  date: string;
  note?: string;
}

interface Props {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const emptyForm = {
  title: "",
  category: "Food & Beverage",
  amount: "",
  type: "Expense" as "Income" | "Expense",
  date: new Date().toISOString().slice(0, 10),
};

export default function Transactions({
  transactions,
  setTransactions,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const money = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // FILTER TRANSAKSI
  const filtered = transactions.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  // SIMPAN TRANSAKSI
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data: Transaction = {
      id: editingId ?? Date.now(),
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      type: form.type,
      date: form.date,
    };

    if (editingId !== null) {
      setTransactions((old) =>
        old.map((item) =>
          item.id === editingId ? data : item
        )
      );
    } else {
      setTransactions((old) => [data, ...old]);
    }

    closeForm();
  }

  // TUTUP FORM
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  // EDIT TRANSAKSI
  function editTransaction(item: Transaction) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      category: item.category,
      amount: String(item.amount),
      type: item.type,
      date: item.date,
    });

    setShowForm(true);
  }

  // HAPUS TRANSAKSI
  function deleteTransaction(id: number) {
    if (window.confirm("Delete this transaction?")) {
      setTransactions((old) =>
        old.filter((item) => item.id !== id)
      );
    }
  }

  // INPUT STYLE
  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-white p-3 text-[#26354A] outline-none transition focus:border-[#527D79] dark:border-gray-700 dark:bg-[#252F3F] dark:text-gray-100 dark:placeholder:text-gray-400";

  return (
    <div className="w-full min-w-0 text-[#26354A] dark:text-gray-100">

      {/* HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#26354A] dark:text-gray-100">
            Transactions
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your income and expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#527D79] px-5 py-3 font-semibold text-white transition hover:bg-[#416763]"
        >
          <Plus size={19} />
          Add Transaction
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1E293B]">

          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#26354A] dark:text-gray-100">
              {editingId !== null
                ? "Edit Transaction"
                : "New Transaction"}
            </h3>

            <button
              type="button"
              onClick={closeForm}
              aria-label="Close form"
              className="text-gray-500 transition hover:text-red-500 dark:text-gray-400"
            >
              <X />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              required
              placeholder="Transaction name"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className={inputStyle}
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "Income" | "Expense",
                })
              }
              className={inputStyle}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className={inputStyle}
            >
              <option>Food & Beverage</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Shopping</option>
              <option>Salary</option>
              <option>Education</option>
              <option>Others</option>
            </select>

            <input
              required
              min="1"
              type="number"
              placeholder="Amount (Rp)"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className={inputStyle}
            />

            <input
              required
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className={inputStyle}
            />

            <button
              type="submit"
              className="rounded-xl bg-[#26354A] px-5 py-3 font-semibold text-white transition hover:bg-[#354A65] dark:bg-[#527D79] dark:hover:bg-[#416763]"
            >
              Save Transaction
            </button>
          </form>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transaction..."
          className={`${inputStyle} min-w-0 flex-1`}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#26354A] outline-none dark:border-gray-700 dark:bg-[#252F3F] dark:text-gray-100"
        >
          <option value="All">All Transactions</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-[#1E293B]">

        <table className="w-full min-w-[650px] text-left">

          <thead className="bg-[#E7ECE8] text-sm text-[#26354A] dark:bg-[#303C4F] dark:text-gray-100">
            <tr>
              <th className="p-4">Transaction</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 text-sm text-[#26354A] transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-[#263449]"
              >
                <td className="p-4 font-semibold">
                  {item.title}
                </td>

                <td className="p-4 text-gray-600 dark:text-gray-300">
                  {item.category}
                </td>

                <td className="p-4 text-gray-600 dark:text-gray-300">
                  {item.date}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    item.type === "Income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {item.type === "Income" ? "+" : "-"}
                  {money(item.amount)}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => editTransaction(item)}
                      aria-label="Edit"
                      className="transition hover:scale-110"
                    >
                      <Pencil
                        size={17}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(item.id)}
                      aria-label="Delete"
                      className="transition hover:scale-110"
                    >
                      <Trash2
                        size={17}
                        className="text-red-500 dark:text-red-400"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-400 dark:text-gray-500"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
