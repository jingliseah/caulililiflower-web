import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }
      login(data.user);
      if (data.user.role === "admin")       navigate("/admin");
      else if (data.user.role === "seller") navigate("/seller");
      else                                  navigate("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-[420px]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUser} className="text-cream text-2xl" />
          </div>
          <h1 className="font-display text-[32px] font-normal text-walnut m-0 mb-2">Welcome back</h1>
          <p className="font-body text-sm text-muted m-0">Sign in to manage your orders and account.</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {error && (
              <div className="bg-[#fde8df] border border-[#f5b9a5] rounded-xl px-4 py-3 font-body text-sm text-terracotta-deep">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="font-body text-sm font-semibold text-strong block mb-2">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                required
                className="input-primary"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-body text-sm font-semibold text-strong">Password</label>
                <button
                  type="button"
                  className="font-body text-xs text-terracotta bg-transparent border-none cursor-pointer p-0 hover:text-terracotta-deep transition-colors"
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
                required
                className="input-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="button-primary w-full disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/users/create")}
                className="button-secondary w-full"
              >
                Create account
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-xs text-muted mt-5">
          Just browsing?{" "}
          <button
            onClick={() => navigate("/home")}
            className="font-body text-xs text-terracotta font-semibold bg-transparent border-none cursor-pointer p-0 hover:text-terracotta-deep transition-colors"
          >
            Back to the shop
          </button>
        </p>
      </div>
    </div>
  );
}
