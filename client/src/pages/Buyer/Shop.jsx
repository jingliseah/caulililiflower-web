import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../../components/ProductCard";

// Maps each collection to the Square category names it contains (case-insensitive match).
const COLLECTIONS = [
  {
    id:         "cauliger-friends",
    name:       "Cauliger & Friends",
    bannerBg:   "var(--cat-terracotta)",
    lightText:  true,
    categories: ["Cauliger Series", "Coco & Lili Series", "Coco", "Lili"],
  },
  {
    id:         "flower-garden",
    name:       "Flower & Garden",
    bannerBg:   "var(--cat-moss)",
    lightText:  true,
    categories: ["Flower Series", "Whimsy Garden", "Plants"],
  },
  {
    id:         "people-pets",
    name:       "People & Pets",
    bannerBg:   "var(--cat-sky)",
    lightText:  true,
    categories: ["Character Series", "Pet Series", "Boy", "Girl", "Hijab Girl", "Dog", "Cat"],
  },
  {
    id:         "ugly-but-wangi",
    name:       "Ugly but Wangi",
    bannerBg:   "var(--cat-pistachio)",
    lightText:  false,
    categories: ["Ugly but Wangi", "Ugly But Wangi Series", "Ugly but Wangi Series"],
  },
  {
    id:         "prints-gifts",
    name:       "Prints & Gifts",
    bannerBg:   "var(--cat-golden)",
    lightText:  false,
    categories: [
      "Postcard", "Christmas Postcard", "Cauliger Postcard",
      "Mini Keychain / Brooch", "Mini Keychain/Brooch",
      "Sushi Series", "Breakfast Series", "Transport Series", "Transport",
    ],
  },
];

function getBanner(activeCollection, activeCatName) {
  if (activeCatName) {
    return {
      bg:        activeCollection?.bannerBg || "var(--cream)",
      lightText: activeCollection?.lightText ?? false,
      eyebrow:   activeCollection?.name || "Collection",
      title:     activeCatName,
      blurb:     "A little world full of character.",
    };
  }
  if (activeCollection) {
    return {
      bg:        activeCollection.bannerBg,
      lightText: activeCollection.lightText,
      eyebrow:   "Collection",
      title:     activeCollection.name,
      blurb:     "A little world full of character.",
    };
  }
  return {
    bg:        "var(--cream)",
    lightText: false,
    eyebrow:   "The whole shop",
    title:     "Shop all pieces",
    blurb:     "Every Caulililiflower piece is handcrafted — little worlds full of character.",
  };
}

function Chip({ selected, onClick, dotColor, children }) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${selected ? "filter-chip-active" : ""}`}
    >
      {selected && dotColor && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dotColor }}
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
  const [products,         setProducts]         = useState([]);
  const [squareCategories, setSquareCategories] = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [searchParams,     setSearchParams]     = useSearchParams();
  const [search,           setSearch]           = useState("");
  const [sort,             setSort]             = useState("name-asc");

  const activeType  = searchParams.get("type") || "all";
  const activeColId = searchParams.get("col")  || "all";
  const activeCatId = searchParams.get("cat")  || "all";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setSquareCategories(Array.isArray(cats) ? cats : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeCollection = useMemo(
    () => COLLECTIONS.find((c) => c.id === activeColId) || null,
    [activeColId]
  );

  const activeCatName = useMemo(
    () => activeCatId === "all" ? null : (squareCategories.find((c) => c.id === activeCatId)?.name || null),
    [activeCatId, squareCategories]
  );

  // Subcategory chips: only Square categories that belong to the active collection
  const subcategoryChips = useMemo(() => {
    if (!activeCollection) return [];
    return squareCategories.filter((c) =>
      activeCollection.categories.some((name) => name.toLowerCase() === c.name.toLowerCase())
    );
  }, [activeCollection, squareCategories]);

  // Set of category IDs belonging to the active collection (for broad collection filtering)
  const collectionCatIds = useMemo(() => {
    if (!activeCollection) return null;
    return new Set(
      squareCategories
        .filter((c) =>
          activeCollection.categories.some((name) => name.toLowerCase() === c.name.toLowerCase())
        )
        .map((c) => c.id)
    );
  }, [activeCollection, squareCategories]);

  const sorted = [...products].sort((a, b) =>
    sort === "price-asc"  ? a.price - b.price :
    sort === "price-desc" ? b.price - a.price :
    sort === "newest"     ? (b.id < a.id ? 1 : -1) :
    (a.name || "").localeCompare(b.name || "")
  );

  const filtered = sorted.filter((p) => {
    const matchesType   = activeType === "all" || p.product_type === activeType;
    const matchesCat    =
      activeCatId !== "all"  ? p.category_id === activeCatId :
      collectionCatIds       ? collectionCatIds.has(p.category_id) :
      true;
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  const banner = getBanner(activeCollection, activeCatName);

  return (
    <div className="bg-page">
      {/* ── Banner ── */}
      <div className="hairline-b" style={{ background: banner.bg }}>
        <div className="page-container py-8 md:py-12 lg:py-14">
          <span className={`eyebrow mb-2 ${banner.lightText ? "text-cream opacity-70" : "text-walnut opacity-60"}`}>
            {banner.eyebrow}
          </span>
          <h1 className={`font-display text-[32px] md:text-[48px] lg:text-[56px] font-normal leading-[1] mt-2.5 mb-2 ${banner.lightText ? "text-cream" : "text-walnut"}`}>
            {banner.title}
          </h1>
          <p className={`font-body text-base md:text-lg leading-snug max-w-[54ch] m-0 ${banner.lightText ? "text-cream opacity-88" : "text-walnut opacity-80"}`}>
            {banner.blurb}
          </p>
        </div>
      </div>

      {/* ── Filters + Grid ── */}
      <div className="page-container py-6 md:py-8 pb-16 md:pb-20">
        {/* Row 1: Collection chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
          <Chip
            selected={activeColId === "all"}
            onClick={() => {
              const p = new URLSearchParams(searchParams);
              p.delete("col");
              p.delete("cat");
              setSearchParams(p);
            }}
          >
            All
          </Chip>
          {COLLECTIONS.map((col) => (
            <Chip
              key={col.id}
              selected={activeColId === col.id}
              dotColor={col.bannerBg}
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.set("col", col.id);
                p.delete("cat");
                setSearchParams(p);
              }}
            >
              {col.name}
            </Chip>
          ))}
        </div>

        {/* Row 2: Subcategory chips — only shown when a collection is active */}
        {activeCollection && subcategoryChips.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2 pl-2 border-l-2 border-terracotta/30">
            <Chip
              selected={activeCatId === "all"}
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.delete("cat");
                setSearchParams(p);
              }}
            >
              All
            </Chip>
            {subcategoryChips.map((c) => (
              <Chip
                key={c.id}
                selected={activeCatId === c.id}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set("cat", c.id);
                  setSearchParams(p);
                }}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        )}

        {/* Search + Sort + Type filter toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 mt-4">
          <div className="relative w-full sm:w-auto sm:flex-[0_1_280px]">
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
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <select
              value={activeType}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                if (e.target.value === "all") p.delete("type"); else p.set("type", e.target.value);
                setSearchParams(p);
              }}
              className="font-body text-sm text-ink bg-card hairline rounded-lg px-3 py-2 outline-none focus:border-cauli-sky appearance-none cursor-pointer"
            >
              <option value="all">All types</option>
              <option value="Keychain">Keychain</option>
              <option value="Brooch">Brooch</option>
              <option value="Keychain + Brooch">Keychain + Brooch</option>
              <option value="Postcard">Postcard</option>
            </select>
            <span className="font-body text-xs text-muted">Sort:</span>
            <SortBtn active={sort === "name-asc"}   onClick={() => setSort("name-asc")}>A–Z</SortBtn>
            <SortBtn active={sort === "newest"}     onClick={() => setSort("newest")}>Newest</SortBtn>
            <SortBtn active={sort === "price-asc"}  onClick={() => setSort("price-asc")}>Price ↑</SortBtn>
            <SortBtn active={sort === "price-desc"} onClick={() => setSort("price-desc")}>Price ↓</SortBtn>
          </div>
          <p className="font-body text-xs text-muted flex-shrink-0 sm:ml-auto">
            {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <FontAwesomeIcon icon={faBoxOpen} className="text-[56px] text-paper-300 mb-4" aria-hidden="true" />
            <p className="font-display text-2xl text-walnut m-0 mb-2">Nothing here yet.</p>
            <p className="font-body text-sm text-muted">
              Try a different filter or check back soon for new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
