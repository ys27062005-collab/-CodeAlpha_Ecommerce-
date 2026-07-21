"use client"
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState(searchParams.get("admin") === "true");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(adminMode ? "/admin/orders" : "/orders");
        router.refresh();
      }
    } catch (err) {
      setError("Unable to sign in — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center py-12">
        <div className="page-shell w-full max-w-lg">
          <div className="content-card p-8">
            <h1 className="page-title">Sign in</h1>
            <p className="page-subtitle">Access your account to view orders and faster checkout.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}

              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="premium-input"
                />
              </div>

              <div>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="premium-input"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (adminMode ? "Signing in as admin..." : "Signing in...") : adminMode ? "Admin sign in" : "Sign in"}
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-3 text-center">
              <button
                type="button"
                onClick={() => setAdminMode((prev) => !prev)}
                className="inline-flex justify-center w-full rounded-full border border-[var(--border-color)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all"
              >
                {adminMode ? "Switch to User Login" : "Admin Login"}
              </button>
              <Link
                href="/admin/orders"
                className="inline-flex justify-center w-full rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
              >
                Admin Dashboard
              </Link>
              {adminMode && (
                <p className="text-sm text-yellow-700">
                  Use your admin account credentials to access admin order management.
                </p>
              )}
              <Link href="/" className="text-blue-600 continue-shopping">
                ← Continue Shopping
              </Link>
            </div>

            <div className="mt-6 text-sm text-center text-gray-600">
              Don't have an account? <Link href="/signup" className="text-blue-600">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
