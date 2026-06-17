// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const TOYYIB_SECRET_KEY = Deno.env.get("TOYYIB_SECRET_KEY") ?? "";

// Supabase provides these automatically in Edge Functions
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Toyyib sends callback as application/x-www-form-urlencoded
    const body = await req.text();
    const params = new URLSearchParams(body);

    const refno = params.get("refno") ?? "";
    const status = params.get("status") ?? "";
    const order_id = params.get("order_id") ?? "";
    const receivedHash = params.get("hash") ?? "";

    // Validate hash: MD5(userSecretKey + status + order_id + refno + "ok")
    const expectedHash = createHash("md5")
      .update(TOYYIB_SECRET_KEY + status + order_id + refno + "ok")
      .digest("hex");

    if (receivedHash !== expectedHash) {
      console.error("Hash mismatch — possible spoofed request");
      return new Response("Forbidden", { status: 403 });
    }

    const bookingId = parseInt(order_id, 10);
    if (!bookingId || isNaN(bookingId)) {
      return new Response("Invalid order_id", { status: 400 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (status === "1") {
      // Payment successful — fetch pending cart data stored at booking creation
      const { data: booking, error: fetchErr } = await supabase
        .from("booking")
        .select("pending_cart, promo_code")
        .eq("id", bookingId)
        .single();

      if (fetchErr) console.error("Failed to fetch booking:", fetchErr.message);

      if (!booking?.pending_cart || !Array.isArray(booking.pending_cart) || booking.pending_cart.length === 0) {
        console.error(`Booking ${bookingId}: pending_cart is missing or empty — cannot insert booking items.`);
        return new Response("OK", { status: 200 });
      }

      // Insert booking_item rows now that payment is confirmed
      const items = (booking.pending_cart as Array<{
        facilityId: number;
        facilityName: string;
        date: string;
        slot: { start: string; end: string; price: number; hour: number };
        addOns: Array<{ addOn: { name: string; price: number }; hours: number }>;
        itemAmount: number;
      }>).map((item) => ({
        booking_id: bookingId,
        facility_id: item.facilityId,
        facility_name: item.facilityName,
        date: item.date,
        time_start: item.slot.start,
        time_end: item.slot.end,
        slot_price: item.slot.price,
        add_ons: item.addOns.map((a) => ({
          name: a.addOn.name,
          price_per_hour: a.addOn.price,
          hours: a.hours,
          subtotal: a.addOn.price * a.hours,
        })),
        item_amount: item.itemAmount,
      }));

      const { error: itemsErr } = await supabase.from("booking_item").insert(items);
      if (itemsErr) {
        // Do NOT update status or clear pending_cart — leave booking as pending so it can be retried
        console.error(`Booking ${bookingId}: booking_item insert failed — status left as pending. Error:`, itemsErr.message);
        return new Response("OK", { status: 200 });
      }

      // Mark promo code as used if one was applied
      if (booking?.promo_code) {
        const { error: promoErr } = await supabase
          .from("promo")
          .update({ used: false })
          .eq("promo_code", booking.promo_code);
        if (promoErr) console.error("Failed to mark promo used:", promoErr.message);
      }

      // Mark booking as Paid and clear the pending cart (only reached if items inserted successfully)
      const { error: updateErr } = await supabase
        .from("booking")
        .update({ status: false, pending_cart: null, promo_code: null })
        .eq("id", bookingId);
      if (updateErr) console.error("DB update error (paid):", updateErr.message);

      // Fire receipt email
      try {
        const receiptRes = await fetch(`${SUPABASE_URL}/functions/v1/send-booking-receipt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ bookingId }),
        });
        if (!receiptRes.ok) console.error("Receipt failed:", await receiptRes.text());
      } catch (e) {
        console.error("Receipt email error:", e);
      }
    } else if (status === "3") {
      // Payment failed → insert booking_item rows so admin can see what was attempted,
      // but leave status as null (not paid) and clear pending_cart
      const { data: failedBooking, error: fetchErr } = await supabase
        .from("booking")
        .select("pending_cart")
        .eq("id", bookingId)
        .single();

      if (fetchErr) console.error("Failed to fetch booking (failed payment):", fetchErr.message);

      if (failedBooking?.pending_cart && Array.isArray(failedBooking.pending_cart) && failedBooking.pending_cart.length > 0) {
        const items = (failedBooking.pending_cart as Array<{
          facilityId: number;
          facilityName: string;
          date: string;
          slot: { start: string; end: string; price: number; hour: number };
          addOns: Array<{ addOn: { name: string; price: number }; hours: number }>;
          itemAmount: number;
        }>).map((item) => ({
          booking_id: bookingId,
          facility_id: item.facilityId,
          facility_name: item.facilityName,
          date: item.date,
          time_start: item.slot.start,
          time_end: item.slot.end,
          slot_price: item.slot.price,
          add_ons: item.addOns.map((a) => ({
            name: a.addOn.name,
            price_per_hour: a.addOn.price,
            hours: a.hours,
            subtotal: a.addOn.price * a.hours,
          })),
          item_amount: item.itemAmount,
        }));

        const { error: itemsErr } = await supabase.from("booking_item").insert(items);
        if (itemsErr) console.error("Failed to insert booking items (failed payment):", itemsErr.message);
      }

      // Clear pending_cart but keep status as null (unpaid)
      const { error: updateErr } = await supabase
        .from("booking")
        .update({ pending_cart: null, promo_code: null })
        .eq("id", bookingId);
      if (updateErr) console.error("DB update error (failed payment):", updateErr.message);
    }
    // status === "2" is pending — no action needed

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/toyyib-callback' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
