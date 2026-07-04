import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeSingleton) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.includes("REPLACE_ME")) {
      throw new Error(
        "Stripe secret key not configured. Set STRIPE_SECRET_KEY in .env (test key sk_test_...)."
      );
    }
    stripeSingleton = new Stripe(key);
  }
  return stripeSingleton;
}

export function stripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && !key.includes("REPLACE_ME"));
}
