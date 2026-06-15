import { useState } from "react";
import { Link } from "react-router-dom";
import Thumbnail from "../assets/thumbnail.png";

/**
 * ProductCard — reusable product tile linking to the product detail page.
 * Used by: Home (featured grid), Shop (product grid).
 */
export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/shop/${product.id}`} className="no-underline">
      <div
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="aspect-square bg-paper-100 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={Thumbnail}
              alt="Placeholder"
              className="w-1/2 h-1/2 object-contain opacity-50"
            />
          )}
        </div>
        <div className="p-3.5 pb-4">
          <p className="font-body text-[11px] font-medium text-muted m-0 mb-0.5 uppercase tracking-[0.07em]">
            {product.seller_name}
          </p>
          <h3 className="font-display text-lg font-normal text-walnut m-0 mb-2.5 leading-snug">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-body text-base font-bold text-walnut">
              RM {Number(product.price).toFixed(2)}
            </span>
            <span
              className={`font-body text-xs font-semibold text-terracotta transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
