import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173"; // Make sure to update this for production
  try {
    // Create a new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      // status: "Order Placed",
    });

    // Save the order to the database
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create line items for Stripe checkout
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100*80, // Convert price to piasters (for Stripe)
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 7 *100*80, // Delivery charge in piasters (7 EGP)
      },
      quantity: 1,
    });

    // Create Stripe session for payment
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Send the session URL to the frontend
    res.json({ success: true, session_url:session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// Verifying the payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      // Mark the order as paid
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Order paid successfully" });
    } else {
      // Delete the order if payment failed
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order canceled" });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.status(500).json({ success: false, message: "Error verifying order" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
      const orders = await orderModel.find({ userId: req.body.userId });
      res.json({ success: true, data: orders })
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })

  }

}

export { placeOrder, verifyOrder, userOrders }