import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (role) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "seller") return "bg-blue-100 text-blue-700";
    return "bg-surface-tertiary secondary";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Admin</p>
        <h1 className="dashboard-title">User Management</h1>
        <p className="dashboard-subtitle mt-3">
          View and manage all platform users.
        </p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="input-primary"
        />
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left px-6 py-4 text-caption tertiary">
                  User
                </th>
                <th className="text-left px-6 py-4 text-caption tertiary">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-caption tertiary">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-caption tertiary">
                  Contact
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border-primary last:border-0 hover:bg-surface-secondary transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center text-label-2 primary shrink-0">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-label-2 primary">{u.username}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-body-3 secondary">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-button-2 capitalize ${roleColor(u.role)}`}
                    >
                      {u.role || "customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-body-3 secondary">
                      {u.contact_number || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-body-3 text-danger hover:opacity-70 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-header-4 primary mb-2">No users found</p>
              <p className="secondary">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
