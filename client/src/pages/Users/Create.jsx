import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewUser() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      navigate("/login");

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
      <div className="w-full max-w-xl">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="text-center mb-8">
          <p className="text-caption tertiary uppercase mb-3">
            Create Account
          </p>

          <h1 className="dashboard-title">
            Join Caulililflower
          </h1>

          <p className="dashboard-subtitle mt-3">
            Create your account to start browsing products
            and managing your orders.
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
                placeholder="jingli"
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
                EMAIL
            ========================================================= */}

            <div>
              <label className="text-label-1 primary block mb-3">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@example.com"
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
                CONTACT
            ========================================================= */}

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

            {/* =========================================================
                PASSWORD
            ========================================================= */}

            <div>
              <label className="text-label-1 primary block mb-3">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
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
                ACTIONS
            ========================================================= */}

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  button-primary
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

              <Link
                to="/login"
                className="
                  w-full
                  button-secondary
                  flex items-center justify-center
                "
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}