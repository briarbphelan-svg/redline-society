-- Referral program: track who referred an order and whether its bonus was granted.
-- Additive columns with defaults — safe on existing rows, no data loss.
ALTER TABLE "Order" ADD COLUMN "referredByCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "referralBonusGranted" BOOLEAN NOT NULL DEFAULT false;
