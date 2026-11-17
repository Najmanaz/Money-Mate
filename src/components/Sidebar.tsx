import { useState } from "react";

import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartColumn,
  Target,
  Settings,
  Wallet,
  Menu,
  X,
  Users,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transactions", icon: ArrowLeftRight },
  { name: "Analytics", icon: ChartColumn },
  { name: "Goals", icon: Target },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
];

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleNavigate(page: string) {
    onNavigate(page);
    setIsOpen(false);
  }

  const menuClass = (isActive: boolean) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
      isActive
        ? "bg-gray-200 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    }`;

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
        <div className="flex items-center gap-2">
          <Wallet size={25} className="text-[#26354A] dark:text-white" />
          <h1 className="text-xl font-bold text-[#26354A] dark:text-white">
            MoneyMate
          </h1>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#26354A] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white">
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={27} />
                <h1 className="text-2xl font-bold">MoneyMate</h1>
              </div>

              <button onClick={() => setIsOpen(false)}>
                <X size={23} />
              </button>
            </div>

            <nav className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.name)}
                    className={menuClass(isActive)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-10 text-sm text-gray-400">
              Track. Plan. Save.
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-6 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white md:flex">
        <div className="mb-12 flex items-center gap-2">
          <Wallet size={27} />
          <h1 className="text-2xl font-bold">MoneyMate</h1>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.name)}
                className={menuClass(isActive)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-10 text-sm text-gray-400">
          Track. Plan. Save.
        </div>
      </aside>
    </>
  );
}
