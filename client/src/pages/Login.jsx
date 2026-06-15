import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

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

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);

        return;
      }

      console.log("LOGIN SUCCESS:", data);

      // global auth state
      login(data.user);

      // redirect
      if (data.user.role === "seller") {
        navigate("/seller");
      } else {
        navigate(`/users/${data.user.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
      UI
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-background-secondary
        flex items-center justify-center
        px-4 py-10
      "
    >
      <div className="w-full max-w-md">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="text-center mb-8">
          <p className="text-caption tertiary uppercase mb-3">Welcome Back</p>

          <h1 className="dashboard-title">Login</h1>

          <p className="dashboard-subtitle mt-3">
            Sign in to manage your profile, products and orders.
          </p>
        </div>

        {/* =========================================================
            LOGIN CARD
        ========================================================= */}

        <div className="card p-5 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your username"
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
                PASSWORD
            ========================================================= */}

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-label-1 primary">Password</label>

                <button
                  type="button"
                  className="
                    text-body-3
                    brand-primary
                    hover:opacity-70
                    transition
                  "
                >
                  Forgot password?
                </button>
              </div>

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

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  button-primary
                  disabled:opacity-50
                "
              >
                {loading ? "Signing In..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/users/create")}
                className="
                  w-full
                  button-secondary
                "
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <div className="text-center mt-6">
          <p className="text-body-3 secondary">
            New to the platform?{" "}
            <button
              type="button"
              onClick={() => navigate("/users/create")}
              className="
                brand-primary
                hover:opacity-70
                transition
              "
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
