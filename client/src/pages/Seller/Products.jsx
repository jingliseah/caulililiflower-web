import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../../components/Seller/ProductCard";

const AVAILABILITY = [
  { value: "all",       label: "All items" },
  { value: "in_stock",  label: "In stock" },
  { value: "out",       label: "Out of stock" },
];

const SORT_OPTIONS = [
  { value: "name_asc",   label: "Name A → Z" },
  { value: "name_desc",  label: "Name Z → A" },
  { value: "price_asc",  label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "stock_asc",  label: "Stock: low to high" },
  { value: "stock_desc", label: "Stock: high to low" },
];

function SelectFilter({ value, onChange, options, icon }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 pl-3 pr-8 bg-surface-primary border border-border-primary rounded-lg text-body-2 primary cursor-pointer focus:outline-none focus:border-border-focus text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-xs"
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-secondary" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-surface-secondary rounded" />
        <div className="h-4 w-2/3 bg-surface-secondary rounded" />
        <div className="h-3 w-1/4 bg-surface-secondary rounded" />
      </div>
    </div>
  );
}

export default function SellerProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const [search,       setSearch]       = useState("");
  const [availability, setAvailability] = useState("all");
  const [categoryId,   setCategoryId]   = useState("all");
  const [sort,         setSort]         = useState("name_asc");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.variations?.some((v) => v.sku?.toLowerCase().includes(q))
      );
    }

    // Availability
    if (availability === "in_stock")  list = list.filter((p) => p.in_stock);
    if (availability === "out")       list = list.filter((p) => !p.in_stock);

    // Category
    if (categoryId !== "all") list = list.filter((p) => p.category_id === categoryId);

    // Sort
    list.sort((a, b) => {
      const totalStock = (p) => p.variations.reduce((s, v) => s + v.quantity, 0);
      if (sort === "name_asc")   return a.name.localeCompare(b.name);
      if (sort === "name_desc")  return b.name.localeCompare(a.name);
      if (sort === "price_asc")  return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "stock_asc")  return totalStock(a) - totalStock(b);
      if (sort === "stock_desc") return totalStock(b) - totalStock(a);
      return 0;
    });

    return list;
  }, [products, search, availability, categoryId, sort]);

  const inStock    = products.filter((p) => p.in_stock).length;
  const outOfStock = products.filter((p) => !p.in_stock).length;

  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const hasFilters = search || availability !== "all" || categoryId !== "all";
  const clearFilters = () => { setSearch(""); setAvailability("all"); setCategoryId("all"); };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
        <div>
          <p className="text-caption tertiary mb-3">Seller Dashboard</p>
          <h1 className="dashboard-title">Item Library</h1>
          <p className="dashboard-subtitle mt-3">
            Products are managed in Square. Changes made there reflect here automatically.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/seller/products/create" className="button-primary flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} />
            Add Item
          </Link>
          <a
            href="https://squareup.com/dashboard/items/library"
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary"
          >
            Square ↗
          </a>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-caption tertiary mb-2">Total items</p>
          <p className="text-header-4 primary">{loading ? "—" : products.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-caption tertiary mb-2">In stock</p>
          <p className="text-header-4 primary text-green-600">{loading ? "—" : inStock}</p>
        </div>
        <div className="card p-5">
          <p className="text-caption tertiary mb-2">Out of stock</p>
          <p className="text-header-4 primary text-red-500">{loading ? "—" : outOfStock}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-sm"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category or SKU…"
            className="w-full h-10 pl-10 pr-4 bg-surface-primary border border-border-primary rounded-lg text-sm text-body-2 primary focus:outline-none focus:border-border-focus"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <SelectFilter
            value={availability}
            onChange={setAvailability}
            options={AVAILABILITY}
          />
          <SelectFilter
            value={categoryId}
            onChange={setCategoryId}
            options={categoryOptions}
          />
          <SelectFilter
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-body-3 secondary">
          {loading ? "Loading…" : `${filtered.length} of ${products.length} items`}
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-body-3 brand-primary hover:opacity-70 transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDeleted={(id) => setProducts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <p className="text-header-4 primary mb-2">No items match your filters</p>
          <p className="secondary mb-5">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="button-secondary">Clear filters</button>
        </div>
      )}
    </div>
  );
}
