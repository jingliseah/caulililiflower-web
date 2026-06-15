import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });

  /* =========================================================
      FETCH USER
  ========================================================= */

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const user = data.users[0];

        setForm({
          username: user.username || "",
          email: user.email || "",
          contact: user.contact_number || "",
          password: "",
        });
      });
  }, [id]);

  /* =========================================================
      INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================================================
      SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      navigate(`/users/${id}`);

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-background-secondary
        flex items-center justify-center
        px-4 py-10
      "
    >
      <div className="w-full max-w-2xl">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mb-8">
          <p className="text-caption tertiary uppercase mb-3">
            Account Settings
          </p>

          <h1 className="dashboard-title">
            Edit Profile
          </h1>

          <p className="dashboard-subtitle mt-3 max-w-xl">
            Update your account details and personal information.
          </p>
        </div>

        {/* =========================================================
            FORM CARD
        ========================================================= */}

        <div className="card p-5 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* =========================================================
                USERNAME
            ========================================================= */}

            <div>
              <label className="text-label-1 primary block mb-3">
                Username
              </label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="
                  w-full
                  bg-input-background
                  border border-input-border
                  rounded-lg
                  px-4 py-4
                  text-body-2
                  primary
                  placeholder:text-input-placeholder
                  focus:outline-none
                  focus:border-input-border-focus
                  transition
                "
                required
              />
            </div>

            {/* =========================================================
                EMAIL + CONTACT
            ========================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div>
                <label className="text-label-1 primary block mb-3">
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-input-background
                    border border-input-border
                    rounded-lg
                    px-4 py-4
                    text-body-2
                    primary
                    placeholder:text-input-placeholder
                    focus:outline-none
                    focus:border-input-border-focus
                    transition
                  "
                  required
                />
              </div>

              {/* CONTACT */}
              <div>
                <label className="text-label-1 primary block mb-3">
                  Contact Number
                </label>

                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="+60 12 345 6789"
                  className="
                    w-full
                    bg-input-background
                    border border-input-border
                    rounded-lg
                    px-4 py-4
                    text-body-2
                    primary
                    placeholder:text-input-placeholder
                    focus:outline-none
                    focus:border-input-border-focus
                    transition
                  "
                />
              </div>
            </div>

            {/* =========================================================
                PASSWORD
            ========================================================= */}

            <div>
              <label className="text-label-1 primary block mb-3">
                New Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={handleChange}
                className="
                  w-full
                  bg-input-background
                  border border-input-border
                  rounded-lg
                  px-4 py-4
                  text-body-2
                  primary
                  placeholder:text-input-placeholder
                  focus:outline-none
                  focus:border-input-border-focus
                  transition
                "
              />

              <p className="text-body-3 tertiary mt-3">
                Only enter a new password if you want to update it.
              </p>
            </div>

            {/* =========================================================
                ACTIONS
            ========================================================= */}

            <div
              className="
                flex flex-col-reverse sm:flex-row
                gap-3
                pt-2
              "
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                  w-full sm:w-auto
                  button-secondary
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full sm:w-auto
                  button-primary
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Updating Profile..."
                  : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}