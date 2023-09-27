const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");

const stripeRouter = express.Router();

stripeRouter.get("/getTransactions", async (req, res) => {
  try {
    const transactions = await stripe.charges.list({ limit: 1000 });

    res.status(200).json(transactions.data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Unable to fetch transactions" });
  }
});

stripeRouter.post("/createPayment", async (req, res) => {
  try {
    const { amount, currency, token } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency,
      source: token,
    });

    res.status(201).json({ message: "Payment successful", charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment failed" });
  }
});

stripeRouter.post("/refund", async (req, res) => {
  const { chargeId, amount } = req.body;

  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount * 100,
    });

    res.status(201).json({ message: "Refund successful", refund });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: "Unable to process refund" });
  }
});

stripeRouter.post("/createSubscription", async (req, res) => {
  const { customerId, planId } = req.body;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
    });

    res.status(201).json({ message: "Subscription created successfully", subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Unable to create subscription" });
  }
});

module.exports = stripeRouter;
