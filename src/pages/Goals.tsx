
import { useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "New Laptop",
      target: 10000000,
      saved: 3500000,
      deadline: "2027-03-01",
    },
    {
      id: 2,
      name: "Holiday Fund",
      target: 5000000,
      saved: 2000000,
      deadline: "2027-06-01",
    },
  ]);

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const [amounts, setAmounts] = useState<Record<number, string>>({});

  // FORMAT RUPIAH
  const money = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // TAMBAH GOAL
  function addGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setGoals((old) => [
      ...old,
      {
        id: Date.now(),
        name,
        target: Number(target),
        saved: 0,
        deadline,
      },
    ]);

    setName("");
    setTarget("");
    setDeadline("");
  }

  // TAMBAH TABUNGAN
  function addSaving(id: number) {
    const amount = Number(amounts[id]);

    if (!amount || amount <= 0) return;

    setGoals((old) =>
      old.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              saved: Math.min(
                goal.saved + amount,
                goal.target
              ),
            }
          : goal
      )
    );

    setAmounts((old) => ({
      ...old,
      [id]: "",
    }));
  }

  // INPUT STYLE
  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-white p-3 text-[#26354A] outline-none transition focus:border-[#527D79] dark:border-gray-700 dark:bg-[#252F3F] dark:text-gray-100 dark:placeholder:text-gray-400";

  return (
    <div className="w-full min-w-0 text-[#26354A] dark:text-gray-100">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#26354A] dark:text-gray-100">
          Savings Goals
        </h2>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Set your financial goals and track your progress.
        </p>
      </div>

      {/* ADD GOAL FORM */}
      <form
        onSubmit={addGoal}
        className="mb-8 grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1E293B] md:grid-cols-4"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Goal name"
          className={inputStyle}
        />

        <input
          required
          min="1"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target amount"
          className={inputStyle}
        />

        <input
          required
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputStyle}
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#527D79] p-3 font-semibold text-white transition hover:bg-[#416763]"
        >
          <Plus size={18} />
          Add Goal
        </button>
      </form>

      {/* GOALS CARDS */}
      <div className="grid gap-5 md:grid-cols-2">

        {goals.map((goal) => {
          const percent = Math.min(
            (goal.saved / goal.target) * 100,
            100
          );

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-[#1E293B]"
            >

              {/* GOAL HEADER */}
              <div className="mb-5 flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="shrink-0 rounded-xl bg-[#E7ECE8] p-3 text-[#527D79] dark:bg-[#303C4F] dark:text-[#8BBAB3]">
                    <Target size={23} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words font-bold text-[#26354A] dark:text-gray-100">
                      {goal.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {goal.deadline}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setGoals((old) =>
                      old.filter((item) => item.id !== goal.id)
                    )
                  }
                  aria-label="Delete goal"
                  className="shrink-0 transition hover:scale-110"
                >
                  <Trash2
                    size={18}
                    className="text-red-500 dark:text-red-400"
                  />
                </button>

              </div>

              {/* PROGRESS */}
              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="text-gray-500 dark:text-gray-400">
                  Progress
                </span>

                <span className="font-bold text-[#527D79] dark:text-[#8BBAB3]">
                  {percent.toFixed(0)}%
                </span>

              </div>

              {/* PROGRESS BAR */}
              <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-[#527D79] transition-all duration-500 dark:bg-[#75A9A1]"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>

              {/* SAVINGS AMOUNT */}
              <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-[#26354A] dark:text-gray-100">
                  {money(goal.saved)}
                </span>
                {" / "}
                {money(goal.target)}
              </p>

              {/* ADD SAVINGS */}
              <div className="flex gap-2">

                <input
                  type="number"
                  min="1"
                  placeholder="Add savings (Rp)"
                  value={amounts[goal.id] ?? ""}
                  onChange={(e) =>
                    setAmounts((old) => ({
                      ...old,
                      [goal.id]: e.target.value,
                    }))
                  }
                  className={`${inputStyle} min-w-0 flex-1 text-sm`}
                />

                <button
                  type="button"
                  onClick={() => addSaving(goal.id)}
                  disabled={
                    goal.saved >= goal.target ||
                    !amounts[goal.id] ||
                    Number(amounts[goal.id]) <= 0
                  }
                  className="rounded-xl bg-[#26354A] px-4 text-sm font-semibold text-white transition hover:bg-[#354A65] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#527D79] dark:hover:bg-[#416763]"
                >
                  Save
                </button>

              </div>

              {/* GOAL COMPLETED */}
              {goal.saved >= goal.target && (
                <p className="mt-4 text-sm font-semibold text-green-700 dark:text-green-400">
                  Goal completed!
                </p>
              )}

            </div>
          );
        })}

      </div>

      {/* EMPTY STATE */}
      {goals.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-[#1E293B]">
          <Target
            size={36}
            className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
          />

          <p className="font-semibold text-[#26354A] dark:text-gray-100">
            No Savings Goals Yet
          </p>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create your first financial goal to start saving.
          </p>
        </div>
      )}

    </div>
  );
}
