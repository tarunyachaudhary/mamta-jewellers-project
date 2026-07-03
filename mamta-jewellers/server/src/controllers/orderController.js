import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @route POST /api/orders  (customer places an order from their cart)
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
      resolvedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: resolvedItems,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/my  (customer order history)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders  (admin - all orders)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/orders/:id/status  (admin updates order status)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};
