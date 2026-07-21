"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  society: "",
  city: "Mumbai",
  pincode: "",
};

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, updateQuantity, clearCart, getCartTotal, promoCode, discountAmount } = useCart();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill form from session if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = getCartTotal();
  const discount = discountAmount;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = promoCode === "FREESHIP" || subtotal > 500 ? 0 : 50;
  const tax = Math.round(discountedSubtotal * 0.1);
  const total = discountedSubtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.society || !formData.pincode) {
      setMessage("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          customerName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          society: formData.society,
          city: formData.city,
          pincode: formData.pincode,
          items: cart.map((item) => ({
            productId: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
          })),
          subtotal,
          discountAmount: discount,
          promoCode,
          tax,
          shipping,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      clearCart();
      setFormData(initialFormData);
      setMessage(`Order placed successfully! Order ID: ${data.order?._id || "created"}`);
    } catch (error) {
      setMessage(error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-primary)] py-12">
        <div className="page-shell checkout-page">
          <div className="mb-8">
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle mt-2">
              Have a promo code? Enter it at payment to apply discounts instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="content-card p-6 mb-8 order-summary">
                <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

                {cart.length === 0 ? (
                  <p className="text-black text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4 items-list">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="cart-item flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-black">{item.title}</p>
                            <p className="text-black">₹{item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-black">
                          <div className="flex items-center border rounded text-black">
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, item.quantity - 1)
                              }
                              className="px-2 py-1 text-black"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-black">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item._id, item.quantity + 1)
                              }
                              className="px-2 py-1 text-black"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold w-20 text-right">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="content-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Flat No., Building Name, Street Address"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">
                        Society Name *
                      </label>
                      <input
                        type="text"
                        name="society"
                        value={formData.society}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Shanti Heights Society"
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="content-card p-6 sticky top-4 price-details">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Details</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-black font-semibold">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-black font-semibold">
                    <span>Tax (10%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-black font-semibold">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">✓ Free shipping applied</p>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">₹{total}</span>
                  </div>
                </div>

                {message && (
                  <div
                    className={`mb-4 rounded-xl border p-4 text-sm font-medium shadow-sm ${
                      message.includes("success") || message.includes("Thank you")
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {message.includes("success") || message.includes("Thank you") ? "🎉" : "⚠️"}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {message.includes("success") || message.includes("Thank you")
                            ? "Thank you for your order!"
                            : "Order could not be placed"}
                        </p>
                        <p className="mt-1">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isSubmitting}
                  className=" cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Placing Order..." : cart.length === 0 ? "Cart is Empty" : "Place Order"}
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="cursor-pointer w-full mt-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors duration-200 continue-shopping"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Safe & Secure:</strong> Your payment is protected. We use industry-standard encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
