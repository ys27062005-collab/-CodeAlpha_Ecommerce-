"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { data: session } = useSession();
  const { cart } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isDarkClass || prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        root.classList.add("light");
        setIsDark(false);
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
        setIsDark(true);
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Cart", href: "/cart" },
    { name: "Checkout", href: "/checkout" },
  ];

  const authNavLinks = session
    ? [
        { name: "Orders", href: "/orders" },
        ...(session.user?.role === "admin" ? [{ name: "Admin", href: "/admin/orders" }] : []),
        { name: "Profile", href: "/profile" },
      ]
    : [];

  return (
    <nav className="glass-panel floating-nav transition-all duration-300">
      <div className="page-shell px-0 flex justify-between items-center gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 min-w-0">
          <span className="text-base md:text-lg font-extrabold tracking-tight bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity truncate">
            SOCIETYHUB
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-2 py-1 rounded-full text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all duration-200 whitespace-nowrap"
            >
              {link.name === "Cart" ? (
                <span className="inline-flex items-center gap-2">
                  {link.name}
                  {cart.length > 0 && (
                    <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </span>
              ) : (
                link.name
              )}
            </Link>
          ))}
          {authNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-2 py-1 rounded-full text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all duration-200 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
          {session ? (
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded-full text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all duration-200 whitespace-nowrap"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-[var(--accent)] to-purple-500 hover:opacity-90 shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Login
            </Link>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Email Display */}
          {session?.user?.email ? (
            <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-1 text-sm font-semibold text-[var(--text-primary)] max-w-[170px] truncate">
              {session.user.email}
            </span>
          ) : null}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-full hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]"
          >
            {isDark ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.05a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-.707-8.485a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 9a1 1 0 000 2h1a1 1 0 100-2H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors flex flex-col space-y-1 justify-center items-center w-8 h-8"
          >
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 glass-panel rounded-[20px] p-6 flex flex-col space-y-3 lg:hidden animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[16px] font-bold text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <span>{link.name}</span>
                {link.name === "Cart" && cart.length > 0 && (
                  <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            ))}
            {authNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[16px] font-bold text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                <span>{link.name}</span>
              </Link>
            ))}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[16px] font-bold text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors duration-200 text-left"
              >
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-[16px] font-bold text-white bg-gradient-to-r from-[var(--accent)] to-purple-500 hover:opacity-90 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
