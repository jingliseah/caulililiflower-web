import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Seller/Sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dashboard-surface">
      <div className="flex min-h-screen">
        {/* =========================================================
            DESKTOP SIDEBAR
        ========================================================= */}

        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}

        <main className="flex-1 min-w-0 overflow-auto">
          {/* =========================================================
              MOBILE HEADER
          ========================================================= */}

          <header
            className="
              lg:hidden
              sticky top-0 z-40
              bg-background-default/90
              backdrop-blur-md
              border-b border-divider-primary
            "
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Brand */}
                <div>
                  <p className="text-caption tertiary uppercase">
                    Seller Workspace
                  </p>

                  <h1 className="text-header-4 primary">Caulililflower</h1>
                </div>

                {/* Mobile Menu Placeholder */}
                <button
                  className="
                    button-secondary
                    !px-4
                  "
                >
                  Menu
                </button>
              </div>
            </div>
          </header>

          {/* =========================================================
              PAGE CONTENT
          ========================================================= */}

          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              p-4
              md:p-6
              lg:p-8
            "
          >
            {/* =========================================================
                PAGE WRAPPER
            ========================================================= */}

            <div
              className="
                min-h-[calc(100vh-2rem)]
                lg:min-h-screen
              "
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
