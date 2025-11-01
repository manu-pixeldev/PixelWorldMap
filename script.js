const stripe = Stripe("pk_test_51SLsj4Qjq3QsaWFaU9THUMnBjYA7yCCeqgb0Ft5it8cNMbUtdoFaNzAGE2pNjOPQ1w02qDxWTU7N7TtDeMBnkHN200sC6IG6Zg");

// paiement
document.getElementById("checkoutButton").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST", // 🔥 ici on force la méthode POST
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // ✅ redirection vers Stripe
    } else {
      console.error("Stripe session error:", data.error);
      alert("Erreur: " + data.error);
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Erreur réseau: " + err.message);
  }
});
