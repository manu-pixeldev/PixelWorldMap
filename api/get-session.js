import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "customer_details"],
    });

    res.status(200).json({
      name: session.customer_details?.name,
      email: session.customer_details?.email,
      country: session.customer_details?.address?.country,
      items: session.line_items?.data.map(i => ({
        description: i.description,
        amount: i.amount_total / 100,
        currency: i.currency,
      })),
      metadata: session.metadata || {},
    });
  } catch (err) {
    console.error("❌ Error retrieving session:", err);
    res.status(500).json({ error: err.message });
  }
}
