-- Recovery: insert booking_item rows for booking #107 (Nurathiqah)
-- Data sourced from pending_cart column on the booking row.

INSERT INTO booking_item (booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
SELECT * FROM (VALUES
  (107, 15, 'Lower Field',  '2026-08-06'::date, '08:00'::time, '09:59'::time, 600, '[{"name":"P.A SYSTEM","price_per_hour":200,"hours":1,"subtotal":200}]'::jsonb, 800),
  (107, 15, 'Lower Field',  '2026-08-06'::date, '10:00'::time, '11:59'::time, 600, '[{"name":"P.A SYSTEM","price_per_hour":200,"hours":1,"subtotal":200}]'::jsonb, 800),
  (107, 17, 'TRACK 100M',   '2026-08-06'::date, '08:00'::time, '09:59'::time, 150, '[]'::jsonb, 150),
  (107, 17, 'TRACK 100M',   '2026-08-06'::date, '10:00'::time, '11:59'::time, 150, '[]'::jsonb, 150),
  (107, 17, 'TRACK 100M',   '2026-08-21'::date, '08:00'::time, '09:59'::time, 150, '[]'::jsonb, 150),
  (107, 17, 'TRACK 100M',   '2026-08-21'::date, '10:00'::time, '11:59'::time, 150, '[]'::jsonb, 150),
  (107, 15, 'Lower Field',  '2026-08-06'::date, '08:00'::time, '09:59'::time, 600, '[]'::jsonb, 600),
  (107, 15, 'Lower Field',  '2026-08-06'::date, '10:00'::time, '11:59'::time, 600, '[]'::jsonb, 600)
) AS v(booking_id, facility_id, facility_name, date, time_start, time_end, slot_price, add_ons, item_amount)
WHERE NOT EXISTS (SELECT 1 FROM booking_item WHERE booking_id = 107);
