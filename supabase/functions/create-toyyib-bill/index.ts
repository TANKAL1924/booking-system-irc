// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";

const TOYYIB_BASE_URL = Deno.env.get("TOYYIB_SANDBOX") === "true"
  ? "https://dev.toyyibpay.com"
  : "https://toyyibpay.com";
const TOYYIB_SECRET_KEY = Deno.env.get("TOYYIB_SECRET_KEY") ?? "";
const TOYYIB_CATEGORY_CODE = Deno.env.get("TOYYIB_CATEGORY_CODE") ?? "";
const APP_URL = Deno.env.get("APP_URL") ?? "";
const SUPABASE_FUNCTIONS_URL = Deno.env.get("FUNCTIONS_BASE_URL") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bookingId, customerName, customerEmail, customerPhone, amountCents, description } =
      await req.json();

    if (!bookingId || !customerName || !amountCents) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build form data for Toyyib createBill API
    const formData = new URLSearchParams();
    formData.append("userSecretKey", TOYYIB_SECRET_KEY);
    formData.append("categoryCode", TOYYIB_CATEGORY_CODE);
    formData.append("billName", `Booking_${bookingId}`);
    formData.append("billDescription", description ?? `Arena IRC Booking #${bookingId}`);
    formData.append("billPriceSetting", "1");       // fixed amount
    formData.append("billPayorInfo", "1");           // collect payer info
    formData.append("billAmount", String(amountCents)); // in cents e.g. 5000 = RM50
    formData.append("billReturnUrl", `${APP_URL}/payment-result`);
    formData.append("billCallbackUrl", `${SUPABASE_FUNCTIONS_URL}/toyyib-callback`);
    formData.append("billExternalReferenceNo", String(bookingId));
    formData.append("billTo", customerName);
    formData.append("billEmail", customerEmail ?? "");
    formData.append("billPhone", customerPhone ?? "");
    formData.append("billPaymentChannel", "2");     // 0=FPX, 1=CC, 2=Both
    formData.append("billChargeToCustomer", "1");   // charge fees to customer
    formData.append("billExpiryDays", "1");          // bill expires in 1 day

    const toyyibRes = await fetch(`${TOYYIB_BASE_URL}/index.php/api/createBill`, {
      method: "POST",
      body: formData,
    });

    const result = await toyyibRes.json();

    // Toyyib returns [{"BillCode":"xxxxxxxx"}] on success
    if (!Array.isArray(result) || !result[0]?.BillCode) {
      console.error("Toyyib error response:", result);
      return new Response(
        JSON.stringify({ error: "Failed to create Toyyib bill", detail: result }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const billCode = result[0].BillCode;
    const paymentUrl = `${TOYYIB_BASE_URL}/${billCode}`;

    return new Response(
      JSON.stringify({ billCode, paymentUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-toyyib-bill' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
