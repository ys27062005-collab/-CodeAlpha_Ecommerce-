"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        const currentProduct = products.find((p) => p._id === params.id);
        setProduct(currentProduct);

        if (currentProduct) {
          const related = products
            .filter(
              (p) => p.category === currentProduct.category && p._id !== currentProduct._id
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProducts();
    }
  }, [params.id]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      triggerToast("Sorry, this product is out of stock");
      return;
    }
    addToCart(product, quantity);
    triggerToast(`${product.title} (x${quantity}) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stock === 0) {
      triggerToast("Sorry, this product is out of stock");
      return;
    }
    addToCart(product, quantity);
    router.push("/cart");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-lg text-gray-600">Product not found</div>
        </div>
      </>
    );
  }

  const stockStatus = product.stock === 0 ? "out" : product.stock <= 10 ? "low" : "in";

  return (
    <>
      <Navbar />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 glass-panel px-6 py-4 rounded-xl shadow-premium border border-[var(--glass-border)] flex items-center space-x-3 animate-slide-in">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping" />
          <span className="text-sm font-bold text-[var(--text-primary)]">{toastMessage}</span>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="page-shell section-stack">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 mb-20">
            <div className="content-card p-6 sm:p-8">
              <div className="relative w-full h-80 sm:h-96">
                <Image
                  src={product.image || "https://picsum.photos/seed/picsum/800/600"}
                  alt={product.title || "Product image"}
                  fill
                  unoptimized
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="content-card p-6 sm:p-8 flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {product.category}
                </span>
              </div>

              <h1 className="page-title text-3xl sm:text-4xl mb-4">{product.title}</h1>
              <div className="mb-6">
                <p className="text-3xl sm:text-4xl font-bold text-blue-600">₹{product.price}</p>
                <p className="text-sm text-gray-600 mt-2">✓ Price includes all taxes</p>
              </div>

              {/* Stock Availability */}
              <div className="mb-6">
                {stockStatus === "out" && (
                  <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
                {stockStatus === "low" && (
                  <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Low Stock — Only {product.stock} left
                  </span>
                )}
                {stockStatus === "in" && (
                  <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>

              <div className="mb-6 flex items-center space-x-2">
                <div className="flex text-yellow-400">{'★'.repeat(4)}<span className="text-gray-300">★</span></div>
                <span className="text-gray-600">(128 reviews)</span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center border rounded-lg w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock || 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={stockStatus === "out"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {stockStatus === "out" ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={stockStatus === "out"}
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors duration-200 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/product/${item._id}`)}
                  >
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={item.image || "https://picsum.photos/seed/picsum/400/300"}
                        alt={item.title || "Product thumbnail"}
                        fill
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{item.title}</h3>
                      <p className="text-2xl font-bold text-blue-600">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
