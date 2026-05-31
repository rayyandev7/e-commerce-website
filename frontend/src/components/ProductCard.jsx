import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const placeholder =
  "https://placehold.co/400x300/eef2ff/6366f1?text=No+Image";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const outOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-media">
        <img
          src={product.imageUrl || placeholder}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = placeholder;
          }}
        />
        {outOfStock && <span className="badge badge-out">Out of stock</span>}
        {product.category && (
          <span className="badge badge-category">{product.category}</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={outOfStock}
          >
            {outOfStock ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
