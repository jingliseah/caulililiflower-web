import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../../components/ProductCard";
import { MAKES, CATEGORIES } from "../../data/products";

/* Dynamic banner config — bg uses inline style (runtime CSS variable value) */
const getBanner = (activeMake, activeCat) => {
  const make = MAKES.find((m) => m.id === activeMake);
  const cat  = CATEGORIES.find((c) => c.id === activeCat);
  if (make)
    return {
      bg:        make.bannerBg,
      lightText: make.lightText,
      eyebrow:   "How it's made",
      title:     make.label,
      blurb:     `${make.lead} · handcrafted in Kuala Lumpur.`,
    };
  if (cat)
    return {
      bg:        cat.bannerBg,
      lightText: cat.lightText,
      eyebrow:   "Collection",
      title:     cat.name,
      blurb:     "A little world full of character.",
    };
  return {
    bg:        "var(--cream)",
    lightText: false,
    eyebrow:   "The whole shop",
    title:     "Shop all pieces",
    blurb:     "Every Caulililiflower piece is handcrafted — little worlds full of character.",
  };
};

function Chip({ selected, onClick, dot, children }) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${selected ? "filter-chip-active" : ""}`}
    >
      {dot && (
        <span
          className={`w-2.5 h-2.5 rounded-full ${dot} flex-shrink-0`}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

function SortBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`font-body text-sm cursor-pointer bg-transparent border-none px-0 py-1 border-b-2 transition-colors ${active ? "font-semibold text-terracotta border-terracotta" : "font-medium text-muted border-transparent"}`}
    >
      {children}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl hairline overflow-hidden animate-pulse">
      <div className="aspect-square bg-paper-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-2/5 bg-paper-200 rounded" />
        <div className="h-4 w-3/4 bg-paper-200 rounded" />
        <div className="h-3.5 w-1/3 bg-paper-200 rounded" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const activeMake = searchParams.get("make") || "all";
  const activeCat = searchParams.get("cat") || "all";

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val === "all") p.delete(key);
    else p.set(key, val);
    setSearchParams(p);
  };

  const sorted = [...products].sort((a, b) =>
    sort === "price-asc"
      ? Number(a.price) - Number(b.price)
      : sort === "price-desc"
        ? Number(b.price) - Number(a.price)
        : b.id - a.id,
  );

  const filtered = sorted.filter(
    (p) =>
      (activeCat === "all" || p.category === activeCat) &&
      p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const banner = getBanner(activeMake, activeCat);

  return (
    <div className="bg-page">
      {/* ── Banner (dynamic bg via inline style — runtime value) ── */}
      <div className="hairline-b" style={{ background: banner.bg }}>
        <div className="page-container py-8 md:py-12 lg:py-14">
          <span
            className={`eyebrow mb-2 ${banner.lightText ? "text-cream opacity-70" : "text-walnut opacity-60"}`}
          >
            {banner.eyebrow}
          </span>
          <h1
            className={`font-display text-[32px] md:text-[48px] lg:text-[56px] font-normal leading-[1] mt-2.5 mb-2 ${banner.lightText ? "text-cream" : "text-walnut"}`}
          >
            {banner.title}
          </h1>
          <p
            className={`font-body text-base md:text-lg leading-snug max-w-[54ch] m-0 ${banner.lightText ? "text-cream opacity-88" : "text-walnut opacity-80"}`}
          >
            {banner.blurb}
          </p>
        </div>
      </div>

      {/* ── Filters + Grid ── */}
      <div className="page-container py-6 md:py-8 pb-16 md:pb-20">
        {/* Filter rows — horizontal scroll on mobile */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
            <Chip
              selected={activeMake === "all"}
              onClick={() => setFilter("make", "all")}
            >
              Everything
            </Chip>
            {MAKES.map((m) => (
              <Chip
                key={m.id}
                selected={activeMake === m.id}
                dot={m.bg}
                onClick={() => setFilter("make", m.id)}
              >
                {m.label}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
            <Chip
              selected={activeCat === "all"}
              onClick={() => setFilter("cat", "all")}
            >
              All
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                selected={activeCat === c.id}
                dot={c.bg}
                onClick={() => setFilter("cat", c.id)}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-auto sm:flex-[0_1_320px]">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-[14px]"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces…"
              className="w-full py-2.5 pl-10 pr-4 font-body text-sm text-ink bg-card hairline rounded-full outline-none focus:border-cauli-sky focus:[box-shadow:var(--shadow-focus)]"
            />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="font-body text-xs text-muted">Sort:</span>
            <SortBtn
              active={sort === "newest"}
              onClick={() => setSort("newest")}
            >
              Newest
            </SortBtn>
            <SortBtn
              active={sort === "price-asc"}
              onClick={() => setSort("price-asc")}
            >
              Price ↑
            </SortBtn>
            <SortBtn
              active={sort === "price-desc"}
              onClick={() => setSort("price-desc")}
            >
              Price ↓
            </SortBtn>
          </div>
          <p className="font-body text-xs text-muted flex-shrink-0 sm:ml-auto">
            {loading
              ? "Loading…"
              : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="text-[56px] text-paper-300 mb-4"
              aria-hidden="true"
            />
            <p className="font-display text-2xl text-walnut m-0 mb-2">
              Nothing here yet.
            </p>
            <p className="font-body text-sm text-muted">
              Try a different filter or check back soon for new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
