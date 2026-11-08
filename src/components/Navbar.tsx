import { Search, Bell, UserRound } from "lucide-react";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName = "Najma" }: NavbarProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">

      {/* SEARCH BAR */}
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <Search size={19} className="text-gray-400" />

        <input
          placeholder="Search anything..."
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-200"
        />
      </div>

      {/* RIGHT NAVBAR */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATION ICON */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26354A] transition hover:bg-[#354A65] dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Bell
            size={21}
            className="text-white"
          />
        </button>

        {/* USER PROFILE */}
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26354A] dark:bg-gray-700">
            <UserRound
              size={21}
              className="text-white"
            />
          </div>

        <span className="text-sm font-semibold text-[#26354A] dark:text-[#26354A]">
            {userName}
        </span>

        </div>
      </div>
    </header>
  );
}
