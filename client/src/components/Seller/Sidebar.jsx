import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  // Sidebar navigation styles
  const navItemClass = ({ isActive }) =>
    `
      sidebar-item
      ${
        isActive
          ? "bg-dashboard-sidebar-active primary-on-dark"
          : "primary hover:bg-dashboard-sidebar-hover"
      }
    `;

  return (
    <aside
      className="
        w-70
        h-screen
        bg-dashboard-sidebar
        border-r border-border-primary
        flex flex-col
        justify-between
        px-6 py-8
        shrink-0
        sticky top-0
      "
    >
      {/* =====================================================
          TOP SECTION
      ====================================================== */}

      <div>
        {/* Brand */}
        <div className="mb-10">
          <p className="text-caption tertiary mb-3">Seller Workspace</p>

          <h1 className="dashboard-title">Caulililflower</h1>

          <p className="dashboard-subtitle mt-3">
            Manage your products, inventory and orders.
          </p>
        </div>

        {/* Seller Profile */}
        <div className="card p-5 mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="
                w-14 h-14
                rounded-full
                bg-surface-secondary
                border border-border-primary
                flex items-center justify-center
                shrink-0
              "
            >
              <span className="text-header-4 primary">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User info */}
            <div className="min-w-0">
              <p className="text-label-1 primary truncate">{user?.username}</p>

              <p className="text-body-3 secondary capitalize mt-1">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavLink to="/seller/products" className={navItemClass}>
            Products
          </NavLink>

          <NavLink to="/seller/products/create" className={navItemClass}>
            Add Product
          </NavLink>

          <NavLink to="/seller/orders" className={navItemClass}>
            Orders
          </NavLink>

          <div className="pt-4 mt-4 border-t border-border-primary">
            <NavLink to="/" className={navItemClass}>
              Back to Site
            </NavLink>
          </div>
        </nav>
      </div>

      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}

      {/* <div className="space-y-4 pt-8">
        Revenue card
        <div
          className="
            rounded-[24px]
            bg-surface-secondary
            border border-border-primary
            p-5
          "
        >
          <p className="text-caption tertiary mb-2">
            Monthly Revenue
          </p>

          <h2 className="text-header-3 primary">
            RM 4,280
          </h2>

          <p className="text-body-3 secondary mt-2">
            +18% from last month
          </p>
        </div>

        Support card
        <div className="card p-5">
          <p className="text-label-2 primary mb-3">
            Need help?
          </p>

          <p className="text-body-3 secondary leading-relaxed">
            Reach out if you need assistance managing
            products or orders.
          </p>

          <button
            className="
              button-primary
              w-full
              mt-5
            "
          >
            Contact Support
          </button>
        </div>
      </div> */}
    </aside>
  );
}
