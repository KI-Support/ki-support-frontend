import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const startCheckout = async () => {
    const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, price_id: "price_xxx" }) // Replace with your Stripe Price ID
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
  };

  const sendChat = async () => {
    const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, message })
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>KI Support</h1>
      <input placeholder="Deine E-Mail" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <button onClick={startCheckout}>Abo starten</button><br /><br />
      <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="Frage stellen..." /><br />
      <button onClick={sendChat}>Senden</button>
      <p><b>Antwort:</b> {reply}</p>
    </div>
  );
}
