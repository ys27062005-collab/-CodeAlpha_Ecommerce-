"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, applyPromoCode, promoCode, discountAmount } = useCart();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = getCartTotal();
  const discount = discountAmount;
  const tax = Math.round((subtotal - discount) * 0.1);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + tax + shipping;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg-primary)] py-12">
        <div className="page-shell cart-page">
          <div className="mb-8">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle mt-2">Review your selections and proceed to a secure checkout.</p>
          </div>

              {cart.length === 0 ? (
                <div className="content-card p-12 text-center">
                  <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                  <Link
                    href="/"
                    className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors duration-200 continue-shopping"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="content-card p-6">
                  {/* Clear Cart Button */}
                  <div className="flex justify-between items-center mb-6 pb-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Items ({cart.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-6 items-list">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="cart-item flex items-start space-x-4 pb-6 border-b last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <Link
                            href={`/product/${item._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Category: {item.category}
                          </p>
                          <p className="text-xl font-bold text-blue-600 mt-2">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col items-end space-y-3 text-black">
                          {/* Quantity Control */}
                          <div className="flex items-center border rounded-lg text-black">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-black hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-semibold text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-black hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Total for this item */}
                          <p className="text-lg font-bold text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-semibold continue-shopping"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="content-card p-6 sticky top-4 order-summary">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  {/* Coupon */}
                  <div className="mb-6 pb-6 border-b">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const result = applyPromoCode(couponInput);
                          if (!result.success) {
                            alert(result.message);
                            return;
                          }
                          setCouponInput("");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Apply
                      </button>
                    </div>
                    {promoCode && (
                      <p className="text-green-600 text-sm mt-2">✓ Code applied: {promoCode}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Hint: Try "SAVE10"</p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-green-600">
                        ✓ Free shipping on orders above ₹500
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total}</span>
                    </div>
                  </div>

                  {/* Checkout + Continue Buttons */}
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/checkout"
                      className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
                    >
                      Proceed to Checkout
                    </Link>

                    <Link
                      href="/"
                      className="w-full block text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors duration-200 continue-shopping"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>🔒 Secure Checkout:</strong> Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
