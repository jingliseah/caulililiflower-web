import { Link } from "react-router-dom";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="card overflow-hidden">
      {/* Product image */}
      <div className="aspect-4/5 bg-surface-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          className="
                w-full
                h-full
                object-cover
            "
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-caption tertiary mb-2">{product.sku}</p>

        <h2 className="text-header-4 primary">{product.name}</h2>

        <p className="text-body-1 primary mt-3">RM {product.price}</p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link
            to={`/seller/products/${product.id}/edit`}
            className="
                button-secondary
                flex-1
            "
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete(product.id)}
            className="
                button-primary
                flex-1
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
