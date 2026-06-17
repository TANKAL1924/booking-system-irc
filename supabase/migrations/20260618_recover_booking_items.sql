-- One-time recovery: insert booking_item rows for bookings #103-#106
-- whose pending_cart was never processed due to callback failure before the fix.

-- #103: Upper Field, 2026-06-27, 08:00–09:59
INSERT INTO booking_item (booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
SELECT 103, 14, 'Upper Field', '2026-06-27', '08:00', '09:59', 1, '[]'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM booking_item WHERE booking_id = 103);

-- #104: Upper Field, 2026-06-25, 08:00–09:59
INSERT INTO booking_item (booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
SELECT 104, 14, 'Upper Field', '2026-06-25', '08:00', '09:59', 400, '[]'::jsonb, 400
WHERE NOT EXISTS (SELECT 1 FROM booking_item WHERE booking_id = 104);

-- #105: Upper Field, 2026-06-20, 20:00–21:59
INSERT INTO booking_item (booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
SELECT 105, 14, 'Upper Field', '2026-06-20', '20:00', '21:59', 800, '[]'::jsonb, 800
WHERE NOT EXISTS (SELECT 1 FROM booking_item WHERE booking_id = 105);

-- #106: Upper Field, 2026-06-20, 20:00–21:59
INSERT INTO booking_item (booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
SELECT 106, 14, 'Upper Field', '2026-06-20', '20:00', '21:59', 800, '[]'::jsonb, 800
WHERE NOT EXISTS (SELECT 1 FROM booking_item WHERE booking_id = 106);

-- Mark all 4 as Paid and clear pending_cart
UPDATE booking
SET status = false, pending_cart = NULL, promo_code = NULL
WHERE id IN (103, 104, 105, 106)
  AND status IS NULL;
