import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarLinkClass = ({ isActive }) =>
    `
      sidebar-item
      transition-all
      ${
        isActive
          ? "bg-dashboard-sidebar-active primary-on-dark"
          : "primary hover:bg-dashboard-sidebar-hover"
      }
    `;

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside
          className="
            hidden
            lg:flex
            w-72
            h-screen
            bg-dashboard-sidebar
            border-r border-divider-primary
            flex-col justify-between
            p-6
            shrink-0
            sticky top-0
          "
        >
          <div>
            {/* Brand */}
            <div className="mb-10">
              <p className="text-caption tertiary uppercase mb-3">
                Commerce Dashboard
              </p>
              <h1 className="dashboard-title">Caulililflower</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {!user ? (
                <>
                  <NavLink to="/shop" className={sidebarLinkClass}>
                    Shop
                  </NavLink>
                  <Link
                    to="/login"
                    className="button-primary flex items-center justify-center mt-4"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  {/* USER CARD */}
                  <Link
                    to={user.role === "seller" ? "/seller" : user.role === "admin" ? "/admin" : `/users/${user.id}`}
                    className="block transition hover:opacity-90"
                  >
                    <div className="card p-5 mb-5 cursor-pointer hover:shadow-card transition-all">
                      <p className="text-caption tertiary mb-2">Logged in as</p>
                      <h2 className="text-header-4 primary wrap-break-word">
                        {user.username}
                      </h2>
                      <p className="text-body-3 secondary mt-1 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </Link>

                  {/* ADMIN NAV */}
                  {user.role === "admin" && (
                    <div className="space-y-2 mb-5">
                      <NavLink to="/admin" end className={sidebarLinkClass}>
                        Overview
                      </NavLink>
                      <NavLink to="/admin/users" className={sidebarLinkClass}>
                        Users
                      </NavLink>
                      <NavLink to="/admin/orders" className={sidebarLinkClass}>
                        Orders
                      </NavLink>
                      <NavLink to="/admin/products" className={sidebarLinkClass}>
                        Products
                      </NavLink>
                    </div>
                  )}

                  {/* SELLER NAV */}
                  {user.role === "seller" && (
                    <div className="space-y-2 mb-5">
                      <NavLink to="/seller" end className={sidebarLinkClass}>
                        Overview
                      </NavLink>
                      <NavLink to="/seller/products" end className={sidebarLinkClass}>
                        Products
                      </NavLink>
                      <NavLink to="/seller/products/create" className={sidebarLinkClass}>
                        Add Product
                      </NavLink>
                      <NavLink to="/seller/orders" className={sidebarLinkClass}>
                        Orders
                      </NavLink>
                      <NavLink to="/seller/inventory" className={sidebarLinkClass}>
                        Inventory
                      </NavLink>
                    </div>
                  )}

                  {/* BUYER / CUSTOMER NAV */}
                  {(user.role === "customer" || !user.role) && (
                    <div className="space-y-2 mb-5">
                      <NavLink to="/shop" className={sidebarLinkClass}>
                        Shop
                      </NavLink>
                      <NavLink to="/cart" className={sidebarLinkClass}>
                        <span className="flex items-center justify-between w-full">
                          Cart
                          {totalItems > 0 && (
                            <span className="ml-auto bg-brand-primary text-white text-button-2 px-2 py-0.5 rounded-full">
                              {totalItems}
                            </span>
                          )}
                        </span>
                      </NavLink>
                      <NavLink
                        to={`/users/${user.id}`}
                        className={sidebarLinkClass}
                      >
                        My Profile
                      </NavLink>
                    </div>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* BOTTOM */}
          {user && (
            <div className="pt-5 border-t border-divider-primary">
              <button onClick={handleLogout} className="w-full button-secondary">
                Logout
              </button>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 overflow-auto">
          {/* MOBILE TOPBAR */}
          <header
            className="
              lg:hidden
              sticky top-0 z-50
              bg-background-default/90
              backdrop-blur-md
              border-b border-divider-primary
            "
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-caption tertiary uppercase">Dashboard</p>
                  <h1 className="text-header-4 primary">Caulililflower</h1>
                </div>
                <div className="flex items-center gap-2">
                  {!user ? (
                    <Link to="/login" className="button-primary">
                      Login
                    </Link>
                  ) : (
                    <>
                      {(user.role === "customer" || !user.role) && (
                        <Link to="/cart" className="relative button-secondary px-4">
                          Cart
                          {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-button-2 w-5 h-5 rounded-full flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="button-secondary">
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* MOBILE NAV */}
              {user && (
                <nav className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {user.role === "admin" && (
                    <>
                      <NavLink to="/admin" end className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Overview</NavLink>
                      <NavLink to="/admin/users" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Users</NavLink>
                      <NavLink to="/admin/orders" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Orders</NavLink>
                      <NavLink to="/admin/products" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Products</NavLink>
                    </>
                  )}
                  {user.role === "seller" && (
                    <>
                      <NavLink to="/seller" end className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Overview</NavLink>
                      <NavLink to="/seller/products" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Products</NavLink>
                      <NavLink to="/seller/orders" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Orders</NavLink>
                      <NavLink to="/seller/inventory" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Inventory</NavLink>
                    </>
                  )}
                  {(user.role === "customer" || !user.role) && (
                    <>
                      <NavLink to="/shop" className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Shop</NavLink>
                      <NavLink to={`/users/${user.id}`} className={({ isActive }) => `shrink-0 px-4 py-2 rounded-full text-body-3 ${isActive ? "bg-brand-primary text-white" : "bg-surface-secondary primary"}`}>Profile</NavLink>
                    </>
                  )}
                </nav>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
