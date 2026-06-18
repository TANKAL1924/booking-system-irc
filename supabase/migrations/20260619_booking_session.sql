-- booking_session: temporary storage during the payment flow.
-- Both booking and booking_item rows are ONLY inserted AFTER payment is confirmed.
-- This replaces the pending_cart / promo_code columns that were previously stored
-- on the booking row itself.

CREATE TABLE IF NOT EXISTS booking_session (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name  TEXT        NOT NULL,
  phone          TEXT        NOT NULL DEFAULT '',
  email          TEXT        NOT NULL DEFAULT '',
  payment_type   BOOLEAN     NOT NULL DEFAULT false,
  total_amount   NUMERIC     NOT NULL DEFAULT 0,
  discount_price NUMERIC     NOT NULL DEFAULT 0,
  promo_code     TEXT,
  cart           JSONB       NOT NULL DEFAULT '[]'::jsonb,
  -- Filled in by toyyib-callback after a successful payment.
  -- Used by the client-side receipt fallback to resolve the real booking id.
  booking_id     INTEGER     REFERENCES booking(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: clean up stale sessions (payment never completed) older than 2 days.
-- Run manually or via pg_cron:
--   DELETE FROM booking_session WHERE booking_id IS NULL AND created_at < now() - interval '2 days';

-- Allow the client (anon key) to read a session by its UUID so the payment-result
-- page can poll for booking_id after a successful payment.
ALTER TABLE booking_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own session by uuid"
  ON booking_session
  FOR SELECT
  TO anon, authenticated
  USING (true);
