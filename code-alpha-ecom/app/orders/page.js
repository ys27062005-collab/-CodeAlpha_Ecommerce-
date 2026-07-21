"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function OrdersPage() {
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
      fetchOrders();
    }
  }, [status, session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || data);
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
              <div className="text-lg text-gray-600">Loading orders...</div>
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
            <h1 className="page-title">Order History</h1>
            <p className="page-subtitle mt-2">
              View all your past orders and track their status.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="content-card p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">No orders found</p>
              <button
                onClick={() => router.push("/products")}
                className="btn-primary"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="content-card p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">
                        {order._id}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                        item(s) • Delivered to {order.address}, {order.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-blue-600">
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
    </>
  );
}
