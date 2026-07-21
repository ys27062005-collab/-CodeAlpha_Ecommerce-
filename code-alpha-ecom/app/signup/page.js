"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create account");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but login failed — redirect to login
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Unable to create account — try again.");
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
            <h1 className="page-title">Create Account</h1>
            <p className="page-subtitle">Create your account to save orders and checkout faster.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}

              <div>
                <label className="field-label">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="premium-input"
                />
              </div>

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
                  placeholder="Create a password"
                  className="premium-input"
                />
              </div>

              <div>
                <label className="field-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="premium-input"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-4 text-center">
              Already have an account? <Link href="/login" className="text-blue-600">Sign in</Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-600 continue-shopping">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
