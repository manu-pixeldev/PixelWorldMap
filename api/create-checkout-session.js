import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { quantity = 1, metadata = {} } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      line_items: [
        { price: "price_1SNWg6Qjq3QsaWFaUeEgZRhJ", quantity: Math.max(1, Number(quantity) || 1) } // 1€ test
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      metadata: {
        countryCode: metadata.countryCode || "",
        countryName: metadata.countryName || "",
        displayName: metadata.displayName || "",
        logoUrl: metadata.logoUrl || "",
        link: metadata.link || "",
        tiles: metadata.tiles ? JSON.stringify(metadata.tiles) : "[]", // <<< IMPORTANT
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
