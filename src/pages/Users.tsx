
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// ==============================
// API CONFIGURATION
// ==============================

const API_BASE_URL = import.meta.env.VITE_API_URL;
const LIMIT = 5;

const OWNER_EMAIL = "nnznils27@quitesy.com";

// ==============================
// INTERFACES
// ==============================

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: string;
  status?: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

// ==============================
// MAIN COMPONENT
// ==============================

export default function Users() {
  // ==============================
  // STATES
  // ==============================

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [pagination, setPagination] = useState<Pagination>({
    page: 2,
    limit: LIMIT,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  });

  // ==============================
  // GET USERS FROM BACKEND
  // ==============================

  async function fetchUsers(page: number) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/users?page=${page}&limit=${LIMIT}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result: UsersResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result.data);
      setPagination(result.pagination);

    } catch (err) {
      console.error("Error fetching users:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to server"
      );

    } finally {
      setLoading(false);
    }
  }

  // Load users when page first opens
  useEffect(() => {
    fetchUsers(2);
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // SUMMARY DATA
  // ==============================

  const activeUsers = "-";

  const administrators = users.some(
    (user) =>
      user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
  ) ? 1 : 0;

  // ==============================
  // ADD USER FORM
  // ==============================

  function openAddForm() {
    setEditId(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "User",
      status: "Active",
    });

    setShowForm(true);
  }

  // ==============================
  // EDIT USER FORM
  // ==============================

  function openEditForm(user: User) {
    setEditId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "User",
      status: user.status || "Active",
    });

    setShowForm(true);
  }

  // ==============================
  // SUBMIT FORM
  // ==============================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);

      // EDIT USER
      if (editId !== null) {
        // Edit masih sementara di frontend.
        // Belum terhubung ke API PATCH.

        setUsers((prev) =>
          prev.map((user) =>
            user.id === editId
              ? {
                  ...user,
                  name: formData.name,
                  email: formData.email,
                }
              : user
          )
        );

        setShowForm(false);
        setSuccessMessage("Data user berhasil diperbarui!");
        return;
      }

      // ADD USER TO DATABASE
      const response = await fetch(
        `${API_BASE_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menambahkan user"
        );
      }

      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "User",
        status: "Active",
      });

      setSuccessMessage("User berhasil ditambahkan ke database!");

      // Refresh data dari backend
      await fetchUsers(1);

    } catch (err) {
      console.error("Submit user error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan user"
      );

    } finally {
      setSaving(false);
    }
  }

  // ==============================
  // DELETE USER
  // ==============================

  function deleteUser(id: string) {
    const selectedUser = users.find(
      (user) => user.id === id
    );

    if (selectedUser) {
      setDeleteTarget(selectedUser);
    }
  }

  function confirmDeleteUser() {
    if (!deleteTarget) return;

    // Delete masih sementara di frontend.
    // Belum terhubung ke API DELETE.

    setUsers((prev) =>
      prev.filter((user) => user.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    setSuccessMessage("User berhasil dihapus dari tampilan!");
  }

  // ==============================
  // PAGE NAVIGATION
  // ==============================

  function handlePageChange(page: number) {
    setSearch("");
    fetchUsers(page);
  }

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="mt-6 space-y-6">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#26354A] dark:text-white">
          Users
        </h1>

        <p className="mt-2 text-base text-[#64748B]">
          Manage and organize your application users.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL USERS */}
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#26354A] dark:text-white">
                {pagination.totalItems}
              </h2>
            </div>

            <div className="rounded-xl bg-[#E8EFED] p-3 text-[#557F7A]">
              <UsersIcon size={23} />
            </div>
          </div>
        </div>

        {/* ACTIVE USERS */}
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#26354A] dark:text-white">
                {activeUsers}
              </h2>
            </div>

            <div className="rounded-xl bg-[#E8EFED] p-3 text-[#557F7A]">
              <UserCheck size={23} />
            </div>
          </div>
        </div>

        {/* ADMINISTRATORS */}
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#26354A] dark:text-white">
                {administrators}
              </h2>
            </div>

            <div className="rounded-xl bg-[#E8EFED] p-3 text-[#557F7A]">
              <ShieldCheck size={23} />
            </div>
          </div>
        </div>

      </div>

      {/* USERS TABLE */}
      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-6">

        {/* TABLE HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#26354A] dark:text-white">
              All Users
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              List of registered application users.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#557F7A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#456B66]"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mt-6 max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F9F8F5] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">

            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 dark:border-gray-700">
                <th className="px-4 py-4 font-semibold">
                  User
                </th>

                <th className="px-4 py-4 font-semibold">
                  Role
                </th>

                <th className="px-4 py-4 font-semibold">
                  Status
                </th>

                <th className="px-4 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {/* LOADING */}
              {loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {/* USER DATA */}
              {!loading && !error && filteredUsers.map((user) => {
                const isOwner =
                  user.email.toLowerCase() ===
                  OWNER_EMAIL.toLowerCase();

                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 transition hover:bg-[#F9F8F5] dark:border-gray-800 dark:hover:bg-gray-800"
                  >

                    {/* USER INFO */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8EFED] font-bold text-[#557F7A]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-[#26354A] dark:text-white">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {user.email}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-4">
                      {isOwner ? (
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700">
                            OWNER
                          </span>

                          <span className="rounded-lg bg-[#E8EFED] px-3 py-1.5 text-xs font-semibold text-[#557F7A]">
                            ADMIN
                          </span>
                        </div>
                      ) : (
                        <span className="rounded-lg bg-[#F0F1ED] px-3 py-1.5 text-xs font-medium text-[#52645F] dark:bg-gray-700 dark:text-gray-200">
                          USER
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-[#E8EFED] text-[#557F7A]"
                            : user.status === "Inactive"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.status || "-"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => openEditForm(user)}
                          className="rounded-lg p-2 text-[#557F7A] transition hover:bg-[#E8EFED]"
                          title="Edit user"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-lg p-2 text-red-400 transition hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {/* EMPTY DATA */}
              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div className="text-sm text-gray-400">
            Showing {filteredUsers.length} of {pagination.totalItems} users
          </div>

          <div className="flex items-center gap-3">

            <button
              disabled={!pagination.hasPreviousPage || loading}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNextPage || loading}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Next
            </button>

          </div>
        </div>

      </div>

      {/* ADD / EDIT USER MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">

            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#26354A] dark:text-white">
                  {editId !== null ? "Edit User" : "Add New User"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Fill in the user information below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#26354A] dark:text-white">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#26354A] dark:text-white">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* PASSWORD */}
              {editId === null && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#26354A] dark:text-white">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Password must contain at least 8 characters.
                  </p>
                </div>
              )}

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#26354A] dark:text-white">
                  Role
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>

                <p className="mt-1 text-xs text-gray-400">
                  Role assignment is not connected to the backend yet.
                </p>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#26354A] dark:text-white">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#557F7A] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#557F7A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#456B66] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editId !== null
                    ? "Save Changes"
                    : "Add User"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172B29]/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm animate-[fadeIn_0.25s_ease-out] rounded-3xl bg-white p-7 text-center shadow-2xl dark:bg-gray-900">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EFED]">
              <CheckCircle2
                size={34}
                className="text-[#557F7A]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#26354A] dark:text-white">
              Successfully!
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {successMessage}
            </p>

            <button
              onClick={() => setSuccessMessage("")}
              className="mt-6 w-full rounded-xl bg-[#557F7A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#456B66] hover:shadow-lg"
            >
              Done
            </button>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172B29]/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm animate-[fadeIn_0.25s_ease-out] rounded-3xl bg-white p-7 text-center shadow-2xl dark:bg-gray-900">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
              <AlertTriangle
                size={32}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#26354A] dark:text-white">
              Delete User?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete
              <span className="font-semibold text-[#26354A] dark:text-white">
                {" "}{deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUser}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 hover:shadow-lg"
              >
                Delete User
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
