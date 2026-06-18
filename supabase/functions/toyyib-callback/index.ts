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

    // order_id is the 32-char hex billRef (UUID without hyphens) we set as billExternalReferenceNo
    const billRef = order_id;

    // Validate hash: MD5(userSecretKey + status + order_id + refno + "ok")
    const expectedHash = createHash("md5")
      .update(TOYYIB_SECRET_KEY + status + order_id + refno + "ok")
      .digest("hex");

    if (receivedHash !== expectedHash) {
      console.error("Hash mismatch — possible spoofed request");
      return new Response("Forbidden", { status: 403 });
    }

    if (!billRef || billRef.length < 10) {
      return new Response("Invalid order_id", { status: 400 });
    }

    // Reconstruct UUID from 32-char hex
    const sessionId = billRef.length === 32
      ? `${billRef.slice(0,8)}-${billRef.slice(8,12)}-${billRef.slice(12,16)}-${billRef.slice(16,20)}-${billRef.slice(20)}`
      : billRef;

    // Use service role to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (status === "1") {
      // Payment successful — read session data
      const { data: session, error: sessionErr } = await supabase
        .from("booking_session")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (sessionErr || !session) {
        console.error(`Session ${sessionId} not found:`, sessionErr?.message);
        return new Response("OK", { status: 200 });
      }

      // Idempotency: if booking_id is already set, this callback already ran
      if (session.booking_id) {
        console.log(`Session ${sessionId} already processed as booking #${session.booking_id}`);
        return new Response("OK", { status: 200 });
      }

      // Insert booking row (status=false = Paid)
      const { data: bookingRow, error: bookingErr } = await supabase
        .from("booking")
        .insert({
          customer_name: session.customer_name,
          phone: session.phone,
          email: session.email,
          payment_type: session.payment_type,
          total_amount: session.total_amount,
          discount_price: session.discount_price,
          status: false,
        })
        .select("id")
        .single();

      if (bookingErr || !bookingRow) {
        console.error(`Failed to insert booking for session ${sessionId}:`, bookingErr?.message);
        return new Response("OK", { status: 200 });
      }

      const bookingId: number = bookingRow.id;

      // Store the new booking id on the session so the client-side receipt
      // fallback can resolve the real booking id from the session UUID.
      await supabase
        .from("booking_session")
        .update({ booking_id: bookingId })
        .eq("id", sessionId);

      // Insert booking_item rows from cart
      const cartItems = session.cart as Array<{
        facilityId: number;
        facilityName: string;
        date: string;
        slot: { start: string; end: string; price: number; hour: number };
        addOns: Array<{ addOn: { name: string; price: number }; hours: number }>;
        itemAmount: number;
      }>;

      const items = cartItems.map((item) => ({
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
        console.error(`Booking #${bookingId}: booking_item insert failed:`, itemsErr.message);
        // booking row was created but items failed — log for manual recovery
        return new Response("OK", { status: 200 });
      }

      // Mark promo code as used if one was applied
      if (session.promo_code) {
        const { error: promoErr } = await supabase
          .from("promo")
          .update({ used: false })
          .eq("promo_code", session.promo_code);
        if (promoErr) console.error("Failed to mark promo used:", promoErr.message);
      }

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
      // Payment failed — delete the session (no booking row was ever created)
      const { error: deleteErr } = await supabase
        .from("booking_session")
        .delete()
        .eq("id", sessionId);
      if (deleteErr) console.error("Failed to delete failed session:", deleteErr.message);
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
