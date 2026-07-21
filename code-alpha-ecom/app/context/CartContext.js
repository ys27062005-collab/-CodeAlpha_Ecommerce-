"use client"
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const PROMOS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT50: { type: "flat", value: 50, label: "₹50 off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
};

function calculateDiscount(code, subtotal) {
  if (!code) return 0;
  const promo = PROMOS[code.toUpperCase()];
  if (!promo) return 0;
  if (promo.type === "percent") {
    return Math.round((subtotal * promo.value) / 100);
  }
  return promo.type === "flat" ? promo.value : 0;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart and promo data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    const savedPromo = localStorage.getItem("cartPromo");
    if (savedPromo) {
      try {
        const parsed = JSON.parse(savedPromo);
        if (parsed?.promoCode) {
          setPromoCode(parsed.promoCode);
          setDiscountAmount(parsed.discountAmount || 0);
        }
      } catch (error) {
        console.error("Error loading promo data:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Keep promo discount current when the cart changes
  useEffect(() => {
    if (!promoCode) return;
    setDiscountAmount(calculateDiscount(promoCode, getCartTotal()));
  }, [cart, promoCode]);

  // Save promo state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "cartPromo",
      JSON.stringify({ promoCode, discountAmount })
    );
  }, [promoCode, discountAmount]);

  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code) => {
    const upperCode = (code || "").trim().toUpperCase();
    const discount = calculateDiscount(upperCode, getCartTotal());
    if (!upperCode || (!discount && upperCode !== "FREESHIP")) {
      return { success: false, message: "Invalid promo code" };
    }
    setPromoCode(upperCode);
    setDiscountAmount(discount);
    return { success: true, code: upperCode, discount };
  };

  const clearPromoCode = () => {
    setPromoCode("");
    setDiscountAmount(0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        clearPromoCode,
        promoCode,
        discountAmount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
