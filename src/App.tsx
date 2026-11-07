import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

import type { Transaction } from "./pages/Transactions";

// Nama tempat penyimpanan data
const STORAGE_KEY = "moneymate_transactions";

// Mengambil data yang pernah disimpan
function getSavedTransactions(): Transaction[] {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    return savedData ? JSON.parse(savedData) : [];
  } catch {
    return [];
  }
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [userName, setUserName] = useState("Najma");

useEffect(() => {
  function loadSettings() {
    const saved = localStorage.getItem("moneymate-settings");

    if (saved) {
      const parsed = JSON.parse(saved);

      setUserName(parsed.name || "Najma");

      document.documentElement.classList.toggle(
        "dark",
        Boolean(parsed.darkMode)
      );
    }
  }

  loadSettings();

  window.addEventListener("settingsUpdated", loadSettings);

  return () => {
    window.removeEventListener("settingsUpdated", loadSettings);
  };
}, []);

  // Menyimpan transaksi
  const [transactions, setTransactions] = useState<Transaction[]>(
    getSavedTransactions
  );

  // Menyimpan data setiap kali transaksi berubah
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard transactions={transactions} />;

      case "Transactions":
        return (
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
          />
        );

      case "Analytics":
        return <Analytics transactions={transactions} />;

      case "Goals":
        return <Goals />;

      case "Settings":
        return <Settings />;

      default:
        return <Dashboard transactions={transactions} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F1EC] md:flex-row">

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="min-w-0 flex-1 p-5 md:p-8">

        <Navbar userName={userName} />

        {renderPage()}

        <footer className="mt-10 border-t border-gray-200 py-5 text-center text-xs text-gray-400">
          © 2026 MoneyMate. Manage your money wisely.
        </footer>

      </main>
    </div>
  );
}

export default App;
