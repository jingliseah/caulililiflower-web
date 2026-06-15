import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/api";

export default function UserList() {
  const [users, setUsers] = useState([]);

  /* =========================================================
      FETCH USERS
  ========================================================= */

  useEffect(() => {
    getUsers().then((data) => {
      console.log("DATA:", data);

      setUsers(data);
    });
  }, []);

  /* =========================================================
      DELETE USER
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================================================
      UI
  ========================================================= */

  return (
    <div className="w-full">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div
        className="
          flex flex-col lg:flex-row
          lg:items-center lg:justify-between
          gap-5
          mb-8
        "
      >
        <div>
          <p className="text-caption tertiary uppercase mb-3">
            User Management
          </p>

          <h1 className="dashboard-title">
            Users
          </h1>

          <p className="dashboard-subtitle mt-3 max-w-2xl">
            View and manage all registered users within
            the platform.
          </p>
        </div>

        <Link
          to="/users/create"
          className="
            w-full sm:w-auto
            button-primary
            flex items-center justify-center
          "
        >
          Create User
        </Link>
      </div>

      {/* =========================================================
          MOBILE CARDS
      ========================================================= */}

      <div className="grid gap-4 lg:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="card p-5"
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-caption tertiary mb-2">
                  User ID
                </p>

                <h2 className="text-header-4 primary">
                  #{user.id}
                </h2>
              </div>

              <div
                className="
                  bg-background-secondary
                  border border-divider-primary
                  rounded-full
                  px-3 py-1
                "
              >
                <p className="text-body-3 secondary">
                  {user.role || "customer"}
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-4 mt-6">
              <div>
                <p className="text-caption tertiary mb-1">
                  Username
                </p>

                <p className="text-label-1 primary break-all">
                  {user.username}
                </p>
              </div>

              <div>
                <p className="text-caption tertiary mb-1">
                  Email
                </p>

                <p className="text-body-2 secondary break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-caption tertiary mb-1">
                  Contact
                </p>

                <p className="text-body-2 secondary">
                  {user.contact_number || "-"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">
              <Link
                to={`/users/${user.id}/edit`}
                className="
                  flex-1
                  button-primary
                  flex items-center justify-center
                "
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(user.id)}
                className="
                  flex-1
                  button-secondary
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          DESKTOP TABLE
      ========================================================= */}

      <div className="hidden lg:block">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* =========================================================
                  TABLE HEAD
              ========================================================= */}

              <thead
                className="
                  bg-background-secondary
                  border-b border-divider-primary
                "
              >
                <tr>
                  <th className="px-6 py-5 text-left text-label-2 tertiary">
                    ID
                  </th>

                  <th className="px-6 py-5 text-left text-label-2 tertiary">
                    Username
                  </th>

                  <th className="px-6 py-5 text-left text-label-2 tertiary">
                    Email
                  </th>

                  <th className="px-6 py-5 text-left text-label-2 tertiary">
                    Contact
                  </th>

                  <th className="px-6 py-5 text-left text-label-2 tertiary">
                    Role
                  </th>

                  <th className="px-6 py-5 text-right text-label-2 tertiary">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* =========================================================
                  TABLE BODY
              ========================================================= */}

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="
                      border-b border-divider-primary
                      hover:bg-background-secondary
                      transition
                    "
                  >
                    {/* ID */}
                    <td className="px-6 py-5 text-body-2 secondary">
                      #{user.id}
                    </td>

                    {/* USERNAME */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-label-1 primary">
                          {user.username}
                        </p>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5 text-body-2 secondary">
                      {user.email}
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5 text-body-2 secondary">
                      {user.contact_number || "-"}
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-5">
                      <div
                        className="
                          inline-flex
                          items-center
                          rounded-full
                          bg-background-secondary
                          border border-divider-primary
                          px-3 py-1
                        "
                      >
                        <span className="text-body-3 secondary capitalize">
                          {user.role || "customer"}
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="
                            button-primary
                          "
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(user.id)
                          }
                          className="
                            button-secondary
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}