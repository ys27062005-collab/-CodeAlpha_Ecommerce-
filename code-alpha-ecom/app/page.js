"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", data);
        triggerToast("Search failed: " + (data.error || "Unknown error"));
        setLoading(false);
        return;
      }
      
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Search error:", err);
      triggerToast("Search error: " + err.message);
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Filter products locally for categories
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ["all", "sneakers", "t-shirts", "hoodies"];

  return (
    <>
      <Navbar />

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 glass-panel px-6 py-4 rounded-xl shadow-premium border border-[var(--glass-border)] flex items-center space-x-3 animate-slide-in">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping" />
          <span className="text-sm font-bold text-[var(--text-primary)]">{toastMessage}</span>
        </div>
      )}

      <div className="min-h-screen pb-20">
        
        {/* Nike-Style Cinema Hero Section */}
        <section className="page-shell hero-shell">
          <div className="hero-section relative h-[380px] sm:h-[520px] md:h-[600px] flex items-center justify-start overflow-hidden bg-black group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=80" 
                alt="Nike Premium Running Sneakers Red"
                fill
                priority
                unoptimized
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[6000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            </div>

            {/* Content Overlays */}
            <div className="relative z-20 max-w-2xl px-6 sm:px-12 md:px-16 text-white flex flex-col space-y-6 animate-fade-up">
              <span className="badge-premium bg-[var(--accent)] text-white tracking-widest text-[10px] w-fit">
                New Season Launch
              </span>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
                SOCIETYHUB <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
                  MARKETPLACE
                </span>
              </h1>
              <p className="text-[14px] sm:text-[16px] text-gray-300 font-medium max-w-md leading-relaxed">
                Experience high-performance styling and hyperlocal community convenience. Delivered straight to your society lobby.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/products" className="premium-btn premium-btn-accent text-[14px]">
                  Explore Shop
                </Link>
                <a href="#featured" className="premium-btn premium-btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-[14px]">
                  Featured Items
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Amazon-Style Advanced Search & Category Filter Section */}
        <section id="featured" className="page-shell section-stack animate-fade-in">
          <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search premium products..."
                className="premium-input pr-28 text-[15px] font-semibold"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1.5 premium-btn premium-btn-primary py-2 px-5 text-[12px] h-[38px]"
              >
                AI Search
              </button>
            </form>

            {/* Dynamic Category Badges */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`premium-btn py-2 px-5 text-[13px] uppercase font-bold tracking-wider ${
                    selectedCategory === cat
                      ? "premium-btn-primary"
                      : "premium-btn-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Display Grid */}
        <section className="page-shell section-stack">
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="responsive-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="shopify-card h-[400px] flex flex-col">
                  <div className="w-full h-56 skeleton" />
                  <div className="p-5 flex-1 flex flex-col space-y-3 justify-between">
                    <div className="space-y-2">
                      <div className="w-16 h-4 skeleton rounded" />
                      <div className="w-full h-6 skeleton rounded" />
                      <div className="w-2/3 h-4 skeleton rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="w-20 h-7 skeleton rounded" />
                      <div className="w-28 h-9 skeleton rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* No Products Found */
            <div className="glass-panel p-16 text-center rounded-[20px]">
              <svg className="w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Products Found</h3>
              <p className="text-[14px] text-[var(--text-secondary)] mb-6">We couldn't find anything matching your filters or query.</p>
              <button onClick={() => { setSelectedCategory("all"); setQuery(""); fetchProducts(); }} className="premium-btn premium-btn-primary">
                Reset Filters
              </button>
            </div>
          ) : (
            /* Product List Grid */
            <div className="responsive-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="shopify-card group flex flex-col justify-between"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  {/* Image Block */}
                  <div className="relative w-full h-56 bg-[var(--bg-tertiary)] overflow-hidden cursor-pointer">
                    <Image
                      src={product.image || "https://picsum.photos/seed/picsum/400/300"}
                      alt={product.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge-premium bg-black/60 backdrop-blur-md text-white text-[9px]">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Info Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-1.5 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-light)]">
                      <span className="text-xl font-black text-[var(--text-primary)]">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          triggerToast(`${product.title} added to cart!`);
                        }}
                        className="premium-btn premium-btn-primary py-2 px-4.5 text-[12px] h-[36px]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  );
}
