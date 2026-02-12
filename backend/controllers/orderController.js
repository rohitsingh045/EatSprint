import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'

import Stripe from "stripe";

// Initialize Stripe with error handling
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
let stripe = null;
let stripeEnabled = false;

if (!stripeKey) {
  console.warn("⚠️  STRIPE_SECRET_KEY is missing - Online payments disabled");
} else {
  try {
    stripe = new Stripe(stripeKey);
    stripeEnabled = true;
    console.log("✅ Stripe initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Stripe:", error.message);
    stripeEnabled = false;
  }
}




// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    // Persist order in DB with provided paymentMethod (default: online)
    const paymentMethod = req.body.paymentMethod || 'online';

    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount / 100, // Convert back to rupees for storage
      address: req.body.address,
      paymentMethod,
      // For COD orders, keep payment false and update status accordingly
      status: paymentMethod === 'cod' ? 'COD - Pending' : undefined,
    });

    await newOrder.save();

    // If payment method is COD, do not create a Stripe session — return success
    if (paymentMethod === 'cod') {
      return res.json({ success: true, cod: true, message: 'Order placed (COD)', orderId: newOrder._id });
    }

    // Check if Stripe is enabled for online payments
    if (!stripeEnabled || !stripe) {
      await orderModel.findByIdAndDelete(newOrder._id);
      return res.status(503).json({ 
        success: false, 
        message: 'Online payment is temporarily unavailable. Please use Cash on Delivery.',
        stripeDisabled: true
      });
    }

    // Create line items for Stripe with correct amount in paise
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price, // Already in paise from frontend
      },
      quantity: item.quantity,
    }));

    // Free delivery - no delivery charges added

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order creation error:", error);
    console.error("Stripe error details:", error.type, error.code, error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating order",
      stripeError: error.type || "unknown"
    });
  }
};

 const verifyOrder =async (req,res) => {
   const {orderId,success} = req.body;
   try {
    if (success=="true") {
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"paid"})
    }else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"not paid"})
    }
   } catch (error) {
    console.log(error);
        res.json({ success: false, message: "Error" });
   }

 }

 // user orders for frontend
const userOrders = async (req, res) => {
  try {
    // Use req.userId instead of req.body.userId
    const orders = await orderModel.find({ userId: req.userId })
      .sort({ date: -1 }); // Sort by newest first
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching orders" 
    });
  }
};

// listing orders for admin panel
const listOrders = async (req,res) =>{
   try {
    const orders = await orderModel.find({});
    res.json ({success:true,data:orders})
   } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
     
   }
}

// api for updating order status
 const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

// api for user to cancel order (only before admin confirms)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if user owns this order
    if (order.userId !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    
    // Check if order can be cancelled (only before confirmation)
    const status = (order.status || '').toLowerCase();
    const canCancel = status.includes('food processing') || 
                      status.includes('pending') || 
                      status.includes('placed') ||
                      status === 'cod - pending';
    
    if (!canCancel) {
      return res.json({ 
        success: false, 
        message: "Order cannot be cancelled after confirmation" 
      });
    }
    
    // Update order status to cancelled
    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error cancelling order" });
  }
}


export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus,cancelOrder }


