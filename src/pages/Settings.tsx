import { useState, useEffect } from "react";
import { UserRound, Bell, Palette, Save } from "lucide-react";

interface SettingsData {
  name: string;
  email: string;
  currency: string;
  notifications: boolean;
  darkMode: boolean;
}

const defaultSettings: SettingsData = {
  name: "Najma",
  email: "najma@example.com",
  currency: "IDR",
  notifications: true,
  darkMode: false,
};

function getSavedSettings(): SettingsData {
  try {
    const saved = localStorage.getItem("moneymate-settings");

    if (saved) {
      return {
        ...defaultSettings,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Gagal membaca pengaturan:", error);
  }

  return defaultSettings;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(
    getSavedSettings
  );

  const [message, setMessage] = useState("");

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );
  }, [settings.darkMode]);

  // Update settings
  function updateSetting<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage("");
  }

  // Save settings
  function saveSettings() {
    try {
      localStorage.setItem(
        "moneymate-settings",
        JSON.stringify(settings)
      );

      window.dispatchEvent(new Event("settingsUpdated"));

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      setMessage("Failed to save settings!");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#26354A] dark:text-[#26354A]">
        Settings
      </h2>

      <p className="mb-8 mt-2 text-[#64748B] dark:text-[#64748B]">
        Manage your account and application preferences.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings();
        }}
        className="max-w-3xl space-y-6"
      >
        {/* PROFILE INFORMATION */}
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <UserRound className="shrink-0 text-[#527D79]" />
            <h3 className="font-bold text-[#26354A] dark:text-white">
              Profile Information
            </h3>
          </div>

          <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
            Full Name
          </label>

          <input
            value={settings.name}
            onChange={(e) =>
              updateSetting("name", e.target.value)
            }
            className="mb-5 w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 outline-none focus:border-[#527D79] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
            Email Address
          </label>

          <input
            type="email"
            value={settings.email}
            onChange={(e) =>
              updateSetting("email", e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 outline-none focus:border-[#527D79] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </section>

        {/* PREFERENCES */}
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Palette className="shrink-0 text-[#527D79]" />
            <h3 className="font-bold text-[#26354A] dark:text-white">
              Preferences
            </h3>
          </div>

          <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
            Currency
          </label>

          <select
            value={settings.currency}
            onChange={(e) =>
              updateSetting("currency", e.target.value)
            }
            className="mb-6 w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 outline-none focus:border-[#527D79] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="IDR">
              Indonesian Rupiah (IDR)
            </option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>

          <div className="flex items-center justify-between gap-4 border-t border-gray-200 py-4 dark:border-gray-700">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#26354A] dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable dark appearance preference.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) =>
                updateSetting("darkMode", e.target.checked)
              }
              className="h-5 w-5 shrink-0 cursor-pointer accent-[#527D79]"
            />
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="shrink-0 text-[#527D79]" />
            <h3 className="font-bold text-[#26354A] dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="flex w-full items-center justify-between gap-4 border-t border-gray-200 pt-5 dark:border-gray-700">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#26354A] dark:text-white">
                Transaction Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Receive updates about your transactions.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                updateSetting("notifications", e.target.checked)
              }
              className="h-5 w-5 shrink-0 cursor-pointer accent-[#527D79]"
            />
          </div>
        </section>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-[#26354A] px-6 py-3 font-semibold text-white transition hover:bg-[#354A65]"
        >
          <Save size={18} />
          Save Changes
        </button>

        {message && (
          <p
            className={`text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
