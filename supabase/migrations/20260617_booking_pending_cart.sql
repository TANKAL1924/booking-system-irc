-- Add columns to support deferred booking creation (only after payment)
-- pending_cart: stores cart JSON temporarily until payment is confirmed
-- promo_code: stores promo code so the callback can mark it used on success

ALTER TABLE booking
  ADD COLUMN IF NOT EXISTS pending_cart JSONB,
  ADD COLUMN IF NOT EXISTS promo_code   TEXT;
