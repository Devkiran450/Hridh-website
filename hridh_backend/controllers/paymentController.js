const razorpay = require("../services/razorpayService");
const crypto = require("crypto");
const Order = require("../models/Order");


exports.createRazorpayOrder = async (req, res) => {

  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order"
    });

  }

};



exports.verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;


    // VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");


    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });

    }


    // CHECK DUPLICATE PAYMENT
    const existingOrder = await Order.findOne({
      paymentId: razorpay_payment_id
    });

    if (existingOrder) {

      return res.json({
        success: true,
        message: "Order already processed"
      });

    }


    // CHECK PRODUCT ALREADY SOLD
    const productId = orderData.items[0];

    const alreadySold = await Order.findOne({
      items: productId
    });

    if (alreadySold) {

      return res.status(400).json({
        success: false,
        message: "Product already sold"
      });

    }


    // SAVE ORDER
    const newOrder = new Order({
      ...orderData,
      paymentId: razorpay_payment_id
    });

    await newOrder.save();


    res.json({
      success: true,
      message: "Payment verified and order saved"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};