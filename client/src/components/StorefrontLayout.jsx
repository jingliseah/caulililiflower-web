import { useState, useRef } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";
import { CartIcon, UserIcon, MenuIcon, CloseIcon } from "./Icons";
import { NAV_LINKS, FOOTER_COLS } from "../data/navigation";
import MainLogo from "../assets/main_logo.jpg";

export default function StorefrontLayout() {
  const { totalItems, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [shopDropOpen, setShopDropOpen] = useState(false);
  const shopRef = useRef(null);

  const isActive = (path) => location.pathname === path.split("?")[0];

  const handleShopMouseEnter = () => setShopDropOpen(true);
  const handleShopMouseLeave = () => setShopDropOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-page font-body">
      {/* ── ANNOUNCEMENT BAR (hidden on mobile) ── */}
      <div className="hidden sm:block bg-walnut text-cream text-center py-2 text-xs font-medium tracking-[0.06em]">
        Handmade in Kuala Lumpur · Free local pickup · Made-to-order portraits
        stitched with love
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 bg-card hairline-b">
        <div className="page-container flex items-center gap-3 py-2.5">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2.5 no-underline flex-shrink-0"
          >
            <span className="w-[38px] h-[38px] rounded-full bg-terracotta flex items-center justify-center flex-shrink-0">
              <img
                src={MainLogo}
                alt="Cauliger's logo"
                className="w-full h-full object-contain rounded-full"
              />
            </span>
            <span className="font-display text-[19px] md:text-[22px] text-walnut tracking-tight">
              caulililiflower
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex gap-5 ml-3">
            {NAV_LINKS.map((l) =>
              l.dropdown ? (
                <div
                  key={l.to}
                  ref={shopRef}
                  className="relative"
                  onMouseEnter={handleShopMouseEnter}
                  onMouseLeave={handleShopMouseLeave}
                >
                  <Link
                    to={l.to}
                    className={`nav-link flex items-center gap-1 ${isActive(l.to) ? "active" : ""}`}
                  >
                    {l.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-50" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  {shopDropOpen && (
                    <div className="absolute top-full left-0 pt-2 z-40">
                      <div className="bg-card hairline rounded-xl py-2 min-w-[180px] shadow-sm">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-muted px-4 pt-1 pb-2">
                          Browse by type
                        </p>
                        {l.dropdown.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block font-body text-sm text-ink no-underline px-4 py-2 hover:bg-paper-100 transition-colors"
                            onClick={() => setShopDropOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div className="hairline-t mx-4 mt-1 pt-2">
                          <Link
                            to={l.to}
                            className="block font-body text-sm font-semibold text-terracotta no-underline py-1"
                            onClick={() => setShopDropOpen(false)}
                          >
                            View all →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-link ${isActive(l.to) ? "active" : ""}`}
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Cart button */}
            <button
              onClick={openCart}
              className="icon-btn relative"
              aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-terracotta text-cream font-body text-[10px] font-bold leading-[17px] text-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User — desktop only */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to={`/users/${user.id}`}
                  className="icon-btn no-underline"
                >
                  <UserIcon />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/home");
                  }}
                  className="button-secondary !min-h-[36px] !py-0 !px-4 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center px-[18px] py-2 text-sm font-semibold font-body text-terracotta border border-terracotta rounded-full no-underline hover:bg-terracotta hover:text-cream transition-all duration-150"
              >
                Sign in
              </Link>
            )}

            {/* Hamburger — tablet/mobile */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="icon-btn lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        {menuOpen && (
          <div className="lg:hidden bg-card hairline-t">
            {NAV_LINKS.map((l) =>
              l.dropdown ? (
                <div key={l.to}>
                  <Link
                    to={l.to}
                    className="block font-body text-base font-medium text-ink no-underline px-5 py-3 hover:bg-paper-100 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                  <div className="bg-paper-50 border-t border-b border-border-primary/30 py-1">
                    {l.dropdown.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block font-body text-sm text-muted no-underline px-8 py-2 hover:bg-paper-100 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block font-body text-base font-medium text-ink no-underline px-5 py-3 hover:bg-paper-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              )
            )}

            <div className="mx-5 mt-2 pt-3 hairline-t">
              {user ? (
                <div className="flex flex-col gap-2 pb-4">
                  <Link
                    to={`/users/${user.id}`}
                    className="font-body text-sm text-ink no-underline py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    My account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/home");
                      setMenuOpen(false);
                    }}
                    className="text-left font-body text-sm text-muted bg-none border-none cursor-pointer p-0"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2.5 pb-4">
                  <Link
                    to="/login"
                    className="flex-1 text-center font-body text-sm font-semibold text-cream bg-terracotta px-4 py-2.5 rounded-full no-underline"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/users/create"
                    className="flex-1 text-center font-body text-sm font-medium text-walnut bg-transparent px-4 py-2.5 rounded-full no-underline hairline"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── CART DRAWER ── */}
      <CartDrawer />

      {/* ── FOOTER ── */}
      <footer className="bg-walnut text-cream mt-20">
        <div className="page-container pt-10 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-7 lg:gap-10">
          <div className="flex flex-col gap-2.5">
            <span className="font-display text-[22px] font-normal">
              caulililiflower
            </span>
            <p className="font-body text-sm leading-relaxed opacity-80 max-w-[32ch] m-0">
              Where little stories grow, and memories are gently stitched into
              forever.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2">
              <h4 className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-cream opacity-55 m-0 mb-1">
                {col.heading}
              </h4>
              {col.links.map((l) => (
                <span
                  key={l}
                  className="font-body text-sm leading-snug text-cream opacity-85 cursor-pointer hover:opacity-100 transition-opacity"
                >
                  {l}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 py-4 text-center font-body text-xs opacity-50">
          © 2026 Caulililiflower · Bespoke illustration-to-embroidery studio
        </div>
      </footer>
    </div>
  );
}
