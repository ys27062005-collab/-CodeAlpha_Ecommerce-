"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";

export default function ProductsPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(250);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter products logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "all" || 
        product.category?.toLowerCase() === categoryFilter.toLowerCase();
      
      const matchesPrice = product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      return 0; // default order
    });

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

      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-primary)]">
        <div className="page-shell section-stack">
          
          {/* Header */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h1 className="page-title uppercase">
              Our Collection
            </h1>
            <p className="page-subtitle mt-3">
              Browse through our premium, curated, society-delivered items.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 glass-panel p-5 sm:p-6 rounded-[24px] h-fit sticky top-28 category-section">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                    Search
                  </h3>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to filter..."
                    className="premium-input text-[14px]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                    Category
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`text-left px-3.5 py-2 rounded-lg text-[13px] font-bold uppercase transition-all duration-150 ${
                          categoryFilter === cat
                            ? "bg-[var(--primary)] text-[var(--bg-secondary)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                      Price Range
                    </h3>
                    <span className="text-[13px] font-bold text-[var(--accent)]">
                      Max ₹{maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-[var(--text-tertiary)] mt-1.5">
                    <span>₹0</span>
                    <span>₹500</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)]">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setMaxPrice(250);
                      setSortBy("default");
                    }}
                    className="premium-btn premium-btn-secondary w-full py-2.5 text-[12px] uppercase tracking-wider font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Product Display Block */}
            <main className="lg:col-span-3">
              
              {/* Filter / Sort Control Bar */}
              <div className="glass-panel p-4 sm:p-5 mb-8 rounded-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[13px] font-bold text-[var(--text-secondary)]">
                  Showing {filteredProducts.length} results
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Sorting dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[var(--bg-secondary)] text-[13px] font-bold text-[var(--text-primary)] px-3 py-2 border border-[var(--border-color)] rounded-lg outline-none cursor-pointer focus:border-[var(--accent)] min-h-[40px]"
                  >
                    <option value="default">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="title-asc">Alphabetical (A-Z)</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[var(--border-color)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]"}`}
                      aria-label="Grid View"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-[var(--border-color)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]"}`}
                      aria-label="List View"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products List/Grid */}
              {loading ? (
                /* Skeleton loaders */
                <div className={viewMode === "grid" ? "responsive-grid" : "space-y-4"}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className={`shopify-card ${viewMode === "grid" ? "h-[390px]" : "h-36 flex flex-row"} skeleton`} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                /* No items found */
                <div className="glass-panel p-16 text-center rounded-[20px]">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Matching Products</h3>
                  <p className="text-[14px] text-[var(--text-secondary)] mb-4">Try adjusting your filters or search keywords.</p>
                </div>
              ) : viewMode === "grid" ? (
                /* Grid view rendering */
                <div className="responsive-grid">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="shopify-card group flex flex-col justify-between"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      <div className="relative w-full h-56 bg-[var(--bg-tertiary)] overflow-hidden cursor-pointer">
                        <Image
                          src={product.image || "https://picsum.photos/seed/picsum/400/300"}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="badge-premium bg-black/60 backdrop-blur-md text-white text-[9px]">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                          <span className="text-lg font-black text-[var(--text-primary)]">
                            ₹{product.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              triggerToast(`${product.title} added to cart!`);
                            }}
                            className="premium-btn premium-btn-primary py-2 px-4 text-[12px] h-[36px]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List view rendering */
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="shopify-card group flex flex-row items-center p-4 cursor-pointer gap-5"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      <div className="relative w-28 h-28 bg-[var(--bg-tertiary)] overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          src={product.image || "https://picsum.photos/seed/picsum/400/300"}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="112px"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="badge-premium bg-[var(--border-color)] text-[var(--text-secondary)] text-[8px] py-0.5 px-2">
                              {product.category}
                            </span>
                          </div>
                          <h3 className="text-[17px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-[13px] text-[var(--text-secondary)] line-clamp-1 max-w-xl">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                          <span className="text-lg font-black text-[var(--text-primary)]">
                            ₹{product.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              triggerToast(`${product.title} added to cart!`);
                            }}
                            className="premium-btn premium-btn-primary py-2 px-4 text-[12px] h-[36px]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

          </div>
        </div>
      </div>
    </>
  );
}
