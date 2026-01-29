import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    
    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {}; // Default to an empty object if cartData is null or undefined

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    // Update the user's cart data
    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    
    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {}; // Default to an empty object if cartData is null or undefined

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    // Update the user's cart data
    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);
    
    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {}; // Default to an empty object if cartData is null or undefined

    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Clear user cart (after successful order)
const clearCart = async (req, res) => {
  await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
  res.json({ success: true, message: "Cart cleared" });
};

export { addToCart, removeFromCart, getCart, clearCart };
