-- Stripe was never connected in production (placeholder keys, checkout returned 503),
-- so these columns only ever held their empty-string default. Payments are gone from
-- the site entirely; drop the last trace of them.
ALTER TABLE "Order" DROP COLUMN IF EXISTS "stripeSessionId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "stripePaymentIntentId";
