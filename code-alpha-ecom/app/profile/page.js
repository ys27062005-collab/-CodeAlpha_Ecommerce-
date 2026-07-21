"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { normalizeOrdersPayload } from "@/lib/orders";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.id) {
      fetchRecentOrders();
    }
  }, [status, session]);

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        const normalizedOrders = normalizeOrdersPayload(data);
        setOrders(normalizedOrders.slice(0, 5)); // Show only last 5 orders
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-primary)]">
          <div className="page-shell">
            <div className="flex justify-center items-center h-96">
              <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-primary)]">
        <div className="page-shell">
          <div className="mb-8">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle mt-2">
              Manage your account and view your recent orders.
            </p>
          </div>

          {/* User Info Card */}
          <div className="content-card p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session?.user?.name || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session?.user?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="content-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              {orders.length > 0 && (
                <Link href="/orders" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                  View All Orders →
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No orders yet</p>
                <button
                  onClick={() => router.push("/products")}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-gray-500">
                            #{order._id.slice(-8)}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                          item(s) •{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          ₹{order.total}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
