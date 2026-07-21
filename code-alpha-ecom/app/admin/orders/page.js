"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

const STATUS_STYLES = {
  Pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-100   text-blue-700   border-blue-200",
  Shipped:    "bg-purple-100 text-purple-700 border-purple-200",
  Delivered:  "bg-green-100  text-green-700  border-green-200",
};

const NEXT_STATUS = {
  Pending:    "Processing",
  Processing: "Shipped",
  Shipped:    "Delivered",
};

export default function AdminOrdersPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [updating, setUpdating] = useState(null); // orderId being updated
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (authStatus === "authenticated" && session?.user?.role !== "admin") {
      router.push("/orders");
      return;
    }
  }, [authStatus, session, router]);

  const fetchOrders = useCallback(async (statusFilter) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "All") params.set("status", statusFilter);
      params.set("limit", "50");
      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (authStatus === "authenticated") {
      fetchOrders(filter);
    }
  }, [authStatus, filter, fetchOrders]);

  const advanceStatus = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return; // already Delivered

    setUpdating(order._id);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      // Update locally
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: nextStatus } : o))
      );
      setSuccessMsg(`Order ${order._id.slice(-6).toUpperCase()} → ${nextStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Stats
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  if (authStatus === "loading" || (loading && orders.length === 0)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-primary)]">
          <div className="page-shell flex justify-center items-center h-96">
            <p className="text-lg text-gray-500">Loading orders…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-primary)]">
        <div className="page-shell">

          {/* Header */}
          <div className="mb-8">
            <h1 className="page-title">Order Processing</h1>
            <p className="page-subtitle mt-2">
              Manage and advance order statuses from placement to delivery.
            </p>
          </div>

          {/* Status summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STATUSES.map((s) => (
              <div
                key={s}
                className={`content-card p-4 border-2 ${
                  filter === s ? "border-[var(--accent)]" : "border-transparent"
                } cursor-pointer`}
                onClick={() => setFilter(filter === s ? "All" : s)}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s}</p>
                <p className="text-3xl font-bold mt-1 text-gray-900">{counts[s] || 0}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  filter === s
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                }`}
              >
                {s}
                {s !== "All" && counts[s] ? (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-white/30 px-1 text-xs font-bold">
                    {counts[s]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
              {successMsg}
            </div>
          )}

          {/* Orders list */}
          {orders.length === 0 ? (
            <div className="content-card p-12 text-center">
              <p className="text-xl text-gray-500">
                {filter === "All" ? "No orders found" : `No "${filter}" orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const nextStatus = NEXT_STATUS[order.status];
                const isDelivered = order.status === "Delivered";
                const isUpdating = updating === order._id;

                return (
                  <div key={order._id} className="content-card p-6">

                    {/* Top row — ID, status badge, date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
                        <p className="font-mono text-sm font-bold text-gray-900">{order._id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${STATUS_STYLES[order.status]}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              order.status === "Pending" ? "bg-yellow-400" :
                              order.status === "Processing" ? "bg-blue-400" :
                              order.status === "Shipped" ? "bg-purple-400" : "bg-green-400"
                            }`}
                          />
                          {order.status}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Customer</p>
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-gray-500">{order.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Phone</p>
                        <p className="font-semibold text-gray-900">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Delivery Address</p>
                        <p className="text-gray-700">
                          {order.address}, {order.society}, {order.city} — {order.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="border-t border-gray-100 pt-4 mb-5">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Items</p>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 rounded-lg object-cover border"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{item.title}</p>
                                <p className="text-gray-500 text-xs">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer — totals + action button */}
                    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Subtotal: <strong className="text-gray-900">₹{order.subtotal}</strong></span>
                        {order.discountAmount > 0 && (
                          <span className="text-green-600">Discount: −₹{order.discountAmount}</span>
                        )}
                        <span>Tax: <strong className="text-gray-900">₹{order.tax}</strong></span>
                        <span>Shipping: <strong className="text-gray-900">₹{order.shipping}</strong></span>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{order.total}
                        </p>

                        {nextStatus && (
                          <button
                            onClick={() => advanceStatus(order)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                          >
                            {isUpdating ? (
                              "Updating…"
                            ) : (
                              <>
                                Move to{" "}
                                <span className="font-extrabold">{nextStatus}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </>
                            )}
                          </button>
                        )}

                        {isDelivered && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
