import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/model/order";
import Product from "@/model/product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper: validate required fields
const REQUIRED_FIELDS = [
  "customerName",
  "email",
  "phone",
  "address",
  "society",
  "city",
  "pincode",
];

function validateOrderBody(body) {
  const missing = REQUIRED_FIELDS.filter(
    (f) => body[f] === undefined || body[f] === null || String(body[f]).trim() === ""
  );
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return "Order must contain at least one item";
  }
  for (const item of body.items) {
    if (!item.productId) return "Each item must have a productId";
    if (!item.quantity || item.quantity < 1) return `Invalid quantity for item ${item.productId}`;
  }
  if (typeof body.total !== "number" || body.total < 0) {
    return "Invalid total amount";
  }
  return null;
}

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (session?.user?.id) {
      body.userId = session.user.id;
    }

    // Validate required fields
    const validationError = validateOrderBody(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    // Check stock availability for every item before creating the order
    const stockErrors = [];
    for (const item of body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        stockErrors.push(`Product ${item.productId} not found`);
      } else if (product.stock < item.quantity) {
        stockErrors.push(
          `"${product.title}" has only ${product.stock} in stock, requested ${item.quantity}`
        );
      }
    }
    if (stockErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Stock unavailable", errors: stockErrors },
        { status: 400 }
      );
    }

    // Create the order
    const order = await Order.create({
      userId: body.userId || null,
      customerName: body.customerName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      society: body.society.trim(),
      city: body.city.trim(),
      pincode: body.pincode.trim(),
      items: body.items,
      subtotal: body.subtotal,
      tax: body.tax,
      shipping: body.shipping,
      discountAmount: body.discountAmount || 0,
      promoCode: body.promoCode || "",
      total: body.total,
      status: "Pending",
    });

    // Decrement stock for ordered products (all stock checks passed above)
    for (const item of body.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const query = {};
    if (session.user.role === "admin") {
      if (userId) query.userId = userId;
    } else {
      query.userId = session.user.id;
    }
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      { orders, total, page, totalPages: Math.ceil(total / limit) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order fetch failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PATCH — update order status (e.g. Pending → Processing → Shipped → Delivered)
const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

export async function PATCH(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { orderId, status } = body;
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Prevent backward status transitions
    const currentIndex = VALID_STATUSES.indexOf(order.status);
    const newIndex = VALID_STATUSES.indexOf(status);
    if (newIndex < currentIndex) {
      return NextResponse.json(
        { success: false, message: `Cannot move status backward from "${order.status}" to "${status}"` },
        { status: 400 }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Order status update failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
