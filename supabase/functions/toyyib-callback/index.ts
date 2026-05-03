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
      // Payment successful → mark as Paid (false)
      const { error } = await supabase
        .from("booking")
        .update({ status: false })
        .eq("id", bookingId);
      if (error) console.error("DB update error (paid):", error.message);

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
      // Payment failed → mark as Cancelled (true)
      const { error } = await supabase
        .from("booking")
        .update({ status: true })
        .eq("id", bookingId);
      if (error) console.error("DB update error (cancelled):", error.message);
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
