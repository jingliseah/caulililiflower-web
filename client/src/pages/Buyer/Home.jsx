import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../../components/ProductCard";
import { CATEGORIES, MAKES, PROCESS_STEPS } from "../../data/products";
import MainLogo from "../../assets/main_logo.jpg";

/* ── Page ─────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setFeatured(Array.isArray(d) ? d.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-page">
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="page-container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-cream hairline rounded-xl lg:rounded-3xl overflow-hidden">
          {/* Illustration — top on mobile, right on desktop */}
          <div className="order-first lg:order-last bg-terracotta flex items-center justify-center p-8 lg:p-12 min-h-50 lg:min-h-0">
            <img
              src={MainLogo}
              alt="Cauliger's logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Copy — bottom on mobile, left on desktop */}
          <div className="order-last lg:order-first p-7 sm:p-10 lg:p-16 flex flex-col justify-center">
            <span className="eyebrow text-terracotta mb-4">
              Bespoke illustration → embroidery
            </span>
            <h1 className="font-display text-[34px] sm:text-[42px] lg:text-[56px] font-normal text-walnut leading-[1.04] tracking-tight mb-5">
              Your memory, redrawn in{" "}
              <em className="text-terracotta not-italic">Cauliger's</em> world —
              stitched to last
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed text-ink max-w-[44ch] mb-8">
              Each piece begins with your photograph, redrawn by hand, then
              brought to life through needle and thread.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <button
                onClick={() => navigate("/custom-order")}
                className="button-primary"
              >
                Start a custom portrait
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="button-secondary"
              >
                Browse the shop
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WAYFINDER ═══════════════════════════════════ */}
      <section className="page-container pb-12 lg:pb-16">
        <div className="text-center mb-8">
          <span className="eyebrow text-muted mb-2">Find your way</span>
          <h2 className="font-display text-[28px] md:text-[36px] font-normal text-walnut mt-2">
            How would you like it made?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MAKES.map((m) => (
            <button
              key={m.id}
              onClick={() => navigate(`/shop?make=${m.id}`)}
              className="make-card p-6 lg:p-7 text-left gap-2.5"
            >
              <span
                className={`w-3.5 h-3.5 rounded-full ${m.bg} flex-shrink-0`}
                aria-hidden="true"
              />
              <span className="font-display text-2xl font-normal text-walnut leading-tight">
                {m.label}
              </span>
              <span className="font-body text-sm leading-normal text-muted flex-1">
                {m.desc}
              </span>
              <span className="inline-flex items-center gap-1.5 font-body text-[13px] font-semibold text-terracotta mt-1">
                {m.lead}
                <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ══ COLLECTIONS ════════════════════════════════ */}
      <section className="page-container pb-12 lg:pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow text-moss mb-2">Collections</span>
            <h2 className="font-display text-[26px] md:text-[36px] font-normal text-walnut mt-2">
              Shop by little world
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="bg-transparent border-none cursor-pointer font-body text-sm font-semibold text-terracotta hover:text-terracotta-deep transition-colors"
          >
            View all →
          </button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 md:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?cat=${cat.id}`)}
              className={`cat-card flex-shrink-0 w-40 p-4 pb-3.5 ${cat.bg}`}
            >
              <span
                className={`font-display text-[17px] font-normal ${cat.text} leading-snug`}
              >
                {cat.name}
              </span>
              <span
                className={`font-body text-xs leading-snug ${cat.text} opacity-85 mt-1.5`}
              >
                {cat.blurb}
              </span>
            </button>
          ))}
        </div>

        {/* Tablet / Desktop: 3+2 grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?cat=${cat.id}`)}
              className={`cat-card p-7 pb-6 min-h-[140px] ${cat.bg}`}
            >
              <span
                className={`font-display text-xl font-normal ${cat.text} leading-snug`}
              >
                {cat.name}
              </span>
              <span
                className={`font-body text-sm leading-normal ${cat.text} opacity-88 mt-1.5`}
              >
                {cat.blurb}
              </span>
            </button>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-2 gap-3 mt-3">
          {CATEGORIES.slice(3).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?cat=${cat.id}`)}
              className={`cat-card p-6 pb-5 ${cat.bg}`}
            >
              <span className={`font-display text-xl font-normal ${cat.text}`}>
                {cat.name}
              </span>
              <span
                className={`font-body text-sm leading-normal ${cat.text} opacity-88 mt-1.5`}
              >
                {cat.blurb}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══════════════════════════ */}
      {featured.length > 0 && (
        <section className="page-container pb-12 lg:pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="eyebrow text-cauli-sky mb-2">From the shop</span>
              <h2 className="font-display text-[26px] md:text-[36px] font-normal text-walnut mt-2">
                New arrivals
              </h2>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="bg-transparent border-none cursor-pointer font-body text-sm font-semibold text-terracotta"
            >
              Shop all →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ══ PROCESS ════════════════════════════════════ */}
      <section className="page-container pb-16 lg:pb-20">
        <div className="text-center mb-8">
          <span className="eyebrow text-muted mb-2">
            From sketchbook to hoop
          </span>
          <h2 className="font-display text-[26px] md:text-[34px] font-normal text-walnut mt-2">
            How a piece is made
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 md:mb-14">
          {PROCESS_STEPS.map((s) => (
            <div
              key={s.n}
              className="step-card p-6 lg:p-7 flex flex-row sm:flex-col gap-4 sm:gap-0 items-start"
            >
              <span className="font-display text-[28px] sm:text-[40px] font-normal text-terracotta leading-none flex-shrink-0 sm:mb-3">
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-xl sm:text-[22px] font-normal text-walnut m-0 mb-2">
                  {s.t}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted m-0">
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="bg-cream hairline rounded-xl lg:rounded-3xl py-10 px-6 sm:py-16 sm:px-10 lg:py-20 lg:px-10 text-center">
          <h2 className="font-display text-[28px] sm:text-[40px] lg:text-[52px] font-normal text-walnut m-0 mx-auto mb-4 max-w-[20ch] leading-[1.08]">
            Every piece is made once, for one person.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed text-ink m-0 mx-auto mb-8 max-w-[56ch]">
            We don't mass produce. Each portrait is redrawn from your memory and
            stitched by hand.
          </p>
          <button
            onClick={() => navigate("/custom-order")}
            className="button-primary"
          >
            Commission your piece
            <FontAwesomeIcon icon={faArrowRight} className="ml-1" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
