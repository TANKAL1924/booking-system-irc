// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "onboarding@resend.dev";

// ── Page & layout constants ──────────────────────────────────────────────────
const PW = 595.28; // A4 width (pt)
const PH = 841.89; // A4 height (pt)
const ML = 40;     // margin left
const MR = 40;     // margin right
const MT = 40;     // margin top
const MB = 50;     // margin bottom
const CW = PW - ML - MR; // content width = 515.28

// ── Colours ──────────────────────────────────────────────────────────────────
const BLACK     = rgb(0.05, 0.05, 0.05);
const RED       = rgb(0.78, 0.10, 0.10);
const GRAY      = rgb(0.50, 0.50, 0.50);
const LIGHTGRAY = rgb(0.92, 0.92, 0.92);
const WHITE     = rgb(1.00, 1.00, 1.00);
const GREEN     = rgb(0.10, 0.60, 0.20);
const BORDER    = rgb(0.80, 0.80, 0.80);
const ROWLINE   = rgb(0.88, 0.88, 0.88);

// ── Types ────────────────────────────────────────────────────────────────────
interface AddOn {
  name: string;
  price_per_hour: number;
  hours: number;
  subtotal: number;
}

interface BookingItem {
  facility_name: string;
  date: string;
  time_start: string;
  time_end: string;
  slot_price: number;
  add_ons: AddOn[];
  item_amount: number;
}

interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  email: string;
  payment_type: boolean; // true = full payment, false = deposit
  total_amount: number;
  status: boolean;       // false = paid, true = cancelled
  created_at: string;
  booking_item: BookingItem[];
}

// ── Utility helpers ──────────────────────────────────────────────────────────
const padRef = (id: number) =>
  `BR-${new Date().getFullYear()}-${String(id).padStart(5, "0")}`;

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-MY", { day: "2-digit", month: "2-digit", year: "numeric" });

const fmtDateTime = (s: string) => {
  const d = new Date(s);
  return (
    d.toLocaleDateString("en-MY", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: true })
  );
};

const calcHours = (start: string, end: string): number => {
  const [sh, sm] = start.slice(0, 5).split(":").map(Number);
  const [eh, em] = end.slice(0, 5).split(":").map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
};

const truncateText = (
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  maxW: number,
  size: number,
): string => {
  if (font.widthOfTextAtSize(text, size) <= maxW) return text;
  let t = text;
  while (font.widthOfTextAtSize(t + "…", size) > maxW && t.length > 0) t = t.slice(0, -1);
  return t + "…";
};

// ── PDF builder ──────────────────────────────────────────────────────────────
async function generatePDF(booking: Booking, tnc: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold    = await doc.embedFont(StandardFonts.HelveticaBold);

  // Fetch and embed logo from Supabase Storage (fail silently)
  let logoImg: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
  try {
    const logoRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/logo/ARENA_IRC_LOGO.png`);
    if (logoRes.ok) {
      logoImg = await doc.embedPng(await logoRes.arrayBuffer());
    }
  } catch { /* logo unavailable – render without it */ }

  // Mutable draw context — page and y cursor
  const ctx = { page: doc.addPage([PW, PH]), y: PH - MT };

  // ── Core draw helpers ──────────────────────────────────────────────────────

  /** Draw text at current cursor y */
  const t = (text: string, x: number, size: number, font = regular, color = BLACK) =>
    ctx.page.drawText(text, { x, y: ctx.y, font, size, color });

  /** Draw text at absolute y (for aligned two-column layouts) */
  const tAt = (text: string, x: number, y: number, size: number, font = regular, color = BLACK) =>
    ctx.page.drawText(text, { x, y, font, size, color });

  /** Draw horizontal rule at current y */
  const hRule = (x1 = ML, x2 = PW - MR, thickness = 0.5, color = BORDER) =>
    ctx.page.drawLine({ start: { x: x1, y: ctx.y }, end: { x: x2, y: ctx.y }, thickness, color });

  /** Draw filled rectangle */
  const fillRect = (
    x: number, y: number, w: number, h: number,
    fill = WHITE,
    borderColor?: ReturnType<typeof rgb>,
    borderWidth = 0.5,
  ) =>
    ctx.page.drawRectangle({
      x, y, width: w, height: h, color: fill,
      ...(borderColor ? { borderColor, borderWidth } : {}),
    });

  /** Move y cursor down */
  const down = (n: number) => { ctx.y -= n; };

  /** Add new page if remaining space < needed */
  const need = (n: number) => {
    if (ctx.y - n < MB) {
      ctx.page = doc.addPage([PW, PH]);
      ctx.y = PH - MT;
    }
  };

  // ── Table column layout ────────────────────────────────────────────────────
  // NO | DESCRIPTION | QTY | RATE (RM) | HOURS/UNIT | AMOUNT (RM)
  const C_NO    = { x: ML,                              w: 28 };
  const C_QTY   = { x: 0, w: 40 };  // calculated below
  const C_RATE  = { x: 0, w: 70 };
  const C_HOURS = { x: 0, w: 55 };
  const C_AMT   = { x: 0, w: 65 };
  const C_DESC  = { x: ML + C_NO.w, w: CW - C_NO.w - C_QTY.w - C_RATE.w - C_HOURS.w - C_AMT.w };
  C_QTY.x   = C_DESC.x + C_DESC.w;
  C_RATE.x  = C_QTY.x  + C_QTY.w;
  C_HOURS.x = C_RATE.x + C_RATE.w;
  C_AMT.x   = C_HOURS.x + C_HOURS.w;

  const COLS = [C_NO, C_DESC, C_QTY, C_RATE, C_HOURS, C_AMT];
  const HDR_H = 16;
  const ROW_H = 15;

  const drawTableHeader = (headers: string[]) => {
    need(HDR_H + 4);
    fillRect(ML, ctx.y - HDR_H + 4, CW, HDR_H, LIGHTGRAY);
    headers.forEach((h, i) => {
      const col = COLS[i];
      const isRight = i >= 2;
      let tx = col.x + 4;
      if (isRight) tx = col.x + col.w - bold.widthOfTextAtSize(h, 7.5) - 4;
      tAt(h, tx, ctx.y - HDR_H + 6, 7.5, bold, BLACK);
    });
    ctx.y -= HDR_H;
    hRule(ML, PW - MR, 0.5, BORDER);
  };

  const drawTableRow = (cells: string[]) => {
    need(ROW_H + 2);
    cells.forEach((cell, i) => {
      const col = COLS[i];
      const isRight = i >= 2;
      const maxW = col.w - 8;
      const display = isRight
        ? cell  // amounts: right-align, don't truncate
        : truncateText(cell, regular, maxW, 8);
      let tx = col.x + 4;
      if (isRight) tx = col.x + col.w - regular.widthOfTextAtSize(display, 8) - 4;
      tAt(display, tx, ctx.y - ROW_H + 4, 8, regular, BLACK);
    });
    ctx.y -= ROW_H;
    ctx.page.drawLine({ start: { x: ML, y: ctx.y }, end: { x: PW - MR, y: ctx.y }, thickness: 0.3, color: ROWLINE });
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION: HEADER
  // ════════════════════════════════════════════════════════════════════════════
  const hdrY = ctx.y;

  // Left — logo + title
  const LOGO_SIZE = 40;
  const titleX = logoImg ? ML + LOGO_SIZE + 10 : ML;
  if (logoImg) {
    ctx.page.drawImage(logoImg, { x: ML, y: hdrY - LOGO_SIZE, width: LOGO_SIZE, height: LOGO_SIZE });
  }
  tAt("BOOKING CONFIRMATION", titleX, hdrY, 18, bold, BLACK);
  ctx.page.drawLine({ start: { x: titleX, y: hdrY - 6 }, end: { x: titleX + 215, y: hdrY - 6 }, thickness: 1.5, color: RED });
  tAt("Arena IRC Negeri Sembilan", titleX, hdrY - 19, 9, regular, GRAY);

  // Right — reference
  const refNo = padRef(booking.id);
  const refX = PW - MR - 160;
  tAt("BOOKING REFERENCE", refX, hdrY, 7, regular, GRAY);
  tAt(refNo, refX, hdrY - 16, 15, bold, BLACK);
  tAt(`Booking Date: ${fmtDate(booking.created_at)}`, refX, hdrY - 29, 8, regular, GRAY);

  ctx.y = hdrY - 40;
  hRule();
  down(14);

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 + 2  — Booking Details & Customer Details (side by side)
  // ════════════════════════════════════════════════════════════════════════════
  need(80);
  const secY  = ctx.y;
  const halfX = ML + CW / 2;
  const LBL_W = 84;
  const ROW_S = 13;
  const isFullPayment = booking.payment_type === true;

  // Section 1: Booking Details (left)
  tAt("1. BOOKING DETAILS", ML, secY, 8.5, bold, BLACK);
  [
    { label: "Status",         value: "CONFIRMED",                                      color: GREEN },
    { label: "Payment Status", value: isFullPayment ? "FULL PAYMENT" : "DEPOSIT (50%)", color: GREEN },
    { label: "Payment Date",   value: fmtDateTime(new Date().toISOString()),             color: BLACK },
  ].forEach(({ label, value, color }, i) => {
    const ry = secY - 13 - i * ROW_S;
    tAt(label,  ML + 4,          ry, 8, regular, GRAY);
    tAt(":",    ML + LBL_W,      ry, 8, regular, GRAY);
    tAt(value,  ML + LBL_W + 8,  ry, 8, bold,    color);
  });

  // Section 2: Customer Details (right)
  tAt("2. CUSTOMER DETAILS", halfX + 8, secY, 8.5, bold, BLACK);
  [
    { label: "Name / Team Name", value: booking.customer_name ?? "-" },
    { label: "Email Address",    value: booking.email          ?? "-" },
    { label: "Phone Number",     value: booking.phone          ?? "-" },
  ].forEach(({ label, value }, i) => {
    const ry = secY - 13 - i * ROW_S;
    tAt(label,  halfX + 12,       ry, 8, regular, GRAY);
    tAt(":",    halfX + 12 + 90,  ry, 8, regular, GRAY);
    tAt(truncateText(value, regular, 120, 8), halfX + 12 + 98, ry, 8, bold, BLACK);
  });

  ctx.y = secY - 13 - 3 * ROW_S - 10;
  hRule();
  down(14);

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — Booking Summary (dynamic rows)
  // ════════════════════════════════════════════════════════════════════════════
  need(60);
  t("3. BOOKING SUMMARY", ML, 8.5, bold, BLACK);
  down(14);

  // Facilities table
  t("Facilities", ML, 8, regular, GRAY);
  down(12);
  drawTableHeader(["NO", "DESCRIPTION", "QTY", "RATE (RM)", "HOURS / UNIT", "AMOUNT (RM)"]);

  booking.booking_item.forEach((item, idx) => {
    const hours = calcHours(item.time_start, item.time_end);
    const ratePerHour = hours > 0 ? (item.slot_price / hours).toFixed(2) : item.slot_price.toFixed(2);
    const desc = `${item.facility_name} (${fmtDate(item.date)} ${item.time_start.slice(0, 5)}–${item.time_end.slice(0, 5)})`;
    drawTableRow([
      String(idx + 1),
      desc,
      String(hours),
      ratePerHour,
      "Hours",
      item.slot_price.toFixed(2),
    ]);
  });

  // Collect all add-ons from all items
  const allAddOns: { name: string; hours: number; rate: number; subtotal: number }[] = [];
  for (const item of booking.booking_item) {
    for (const ao of item.add_ons ?? []) {
      allAddOns.push({ name: ao.name, hours: ao.hours, rate: ao.price_per_hour, subtotal: ao.subtotal });
    }
  }

  if (allAddOns.length > 0) {
    down(10);
    need(40);
    t("Add-Ons", ML, 8, regular, GRAY);
    down(12);
    drawTableHeader(["NO", "DESCRIPTION", "QTY", "RATE (RM)", "HOURS / UNIT", "AMOUNT (RM)"]);
    allAddOns.forEach((ao, idx) => {
      drawTableRow([
        String(idx + 1),
        ao.name,
        String(ao.hours),
        ao.rate.toFixed(2),
        "Hours",
        ao.subtotal.toFixed(2),
      ]);
    });
  }

  down(16);
  need(20);
  hRule();
  down(14);

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — Payment Details
  // ════════════════════════════════════════════════════════════════════════════
  need(130);
  t("4. PAYMENT DETAILS", ML, 8.5, bold, BLACK);
  down(14);

  const PAY_W      = CW * 0.58;
  const payStartY  = ctx.y;

  // Calculate amounts
  const subtotal = booking.booking_item.reduce((sum, item) => {
    const addOnTotal = (item.add_ons ?? []).reduce((a, ao) => a + ao.subtotal, 0);
    return sum + item.slot_price + addOnTotal;
  }, 0);
  const isDeposit = !booking.payment_type;
  const amtPaid   = booking.total_amount;
  const balance   = subtotal - amtPaid;

  // Payment table header
  fillRect(ML, ctx.y - HDR_H + 4, PAY_W, HDR_H, LIGHTGRAY);
  tAt("Description", ML + 4, ctx.y - HDR_H + 6, 7.5, bold, BLACK);
  const amtHdrStr = "Amount (RM)";
  tAt(amtHdrStr, ML + PAY_W - bold.widthOfTextAtSize(amtHdrStr, 7.5) - 4, ctx.y - HDR_H + 6, 7.5, bold, BLACK);
  ctx.y -= HDR_H;

  const payRows = [
    { label: "Subtotal",         value: subtotal.toFixed(2),          isBold: false, color: BLACK },
    ...(isDeposit ? [
      { label: "Deposit (50%)",  value: amtPaid.toFixed(2),           isBold: false, color: BLACK },
      { label: "Balance",        value: balance.toFixed(2),           isBold: true,  color: balance > 0.005 ? RED : BLACK },
    ] : []),
    { label: "Amount Paid",      value: `RM ${amtPaid.toFixed(2)}`,   isBold: true,  color: GREEN },
    { label: "Payment Method",   value: "Online Banking (FPX)",       isBold: false, color: BLACK },
  ];

  payRows.forEach(({ label, value, isBold, color }) => {
    need(ROW_H + 2);
    ctx.page.drawLine({ start: { x: ML, y: ctx.y }, end: { x: ML + PAY_W, y: ctx.y }, thickness: 0.3, color: ROWLINE });
    const f = isBold ? bold : regular;
    tAt(label, ML + 4,                       ctx.y - ROW_H + 4, 8, f, color);
    tAt(value, ML + PAY_W - f.widthOfTextAtSize(value, 8) - 4, ctx.y - ROW_H + 4, 8, f, color);
    ctx.y -= ROW_H;
  });

  // Right: Total amount & status box
  const BOX_X = ML + PAY_W + 16;
  const BOX_W = CW - PAY_W - 16;

  const totLabel = "TOTAL AMOUNT";
  tAt(totLabel, BOX_X + (BOX_W - regular.widthOfTextAtSize(totLabel, 8)) / 2, payStartY - 12, 8, regular, GRAY);

  const totStr  = `RM${subtotal.toFixed(2)}`;
  const totSize = 16;
  tAt(totStr, BOX_X + (BOX_W - bold.widthOfTextAtSize(totStr, totSize)) / 2, payStartY - 30, totSize, bold, BLACK);

  ctx.page.drawLine({
    start: { x: BOX_X, y: payStartY - 36 },
    end:   { x: BOX_X + BOX_W, y: payStartY - 36 },
    thickness: 0.5, color: BORDER,
  });

  // Payment type badge
  const BADGE_H = 26;
  const BADGE_Y = payStartY - 36 - 10 - BADGE_H;
  const badgeStr = isDeposit ? "DEPOSIT (50%)" : "FULL PAYMENT";
  fillRect(BOX_X + 10, BADGE_Y, BOX_W - 20, BADGE_H, WHITE, GREEN, 2);
  const stW = bold.widthOfTextAtSize(badgeStr, 11);
  tAt(badgeStr, BOX_X + 10 + (BOX_W - 20 - stW) / 2, BADGE_Y + 8, 11, bold, GREEN);

  down(20);
  need(16);
  hRule();
  down(14);

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5 — Terms & Conditions + Need Help
  // ════════════════════════════════════════════════════════════════════════════
  need(60);
  t("5. TERMS & CONDITIONS", ML, 8.5, bold, BLACK);
  down(14);

  const TNC_MAX_X = ML + CW * 0.58;
  const TNC_MAX_W = TNC_MAX_X - ML - 20;
  const HELP_X    = TNC_MAX_X + 8;
  const HELP_W    = PW - MR - HELP_X;
  const helpTopY  = ctx.y;

  const tncList = tnc.length > 0 ? tnc : [
    "This booking is non-transferable and for the purpose stated above only.",
    "Please arrive 10 minutes before your booking time.",
    "Any damage or additional cleaning required will be charged accordingly.",
    "Remaining 50% balance must be paid at least 1 day before the booking date (Full payment bookings excluded).",
  ];

  for (const item of tncList) {
    need(24);
    tAt("•", ML + 4, ctx.y, 8, regular, BLACK);
    // Word-wrap within TNC column
    const words = item.split(" ");
    let line = "";
    let lineY = ctx.y;
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (regular.widthOfTextAtSize(test, 8) > TNC_MAX_W) {
        tAt(line, ML + 14, lineY, 8, regular, BLACK);
        lineY -= 11;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) tAt(line, ML + 14, lineY, 8, regular, BLACK);
    ctx.y = lineY - 13;
  }

  // Need Help box — vertically anchored to top of T&C
  const HELP_H = 64;
  const HELP_Y = helpTopY - HELP_H - 2;
  fillRect(HELP_X, HELP_Y, HELP_W, HELP_H, rgb(0.96, 0.96, 0.96), BORDER, 0.5);
  tAt("NEED HELP?",                    HELP_X + 8, HELP_Y + HELP_H - 14, 9,   bold,    BLACK);
  tAt("We're here to help",            HELP_X + 8, HELP_Y + HELP_H - 28, 7.5, regular, GRAY);
  tAt("Call us at +6012-985 1855 or",  HELP_X + 8, HELP_Y + HELP_H - 40, 7.5, regular, GRAY);
  tAt("email arenaircns@gmail.com",    HELP_X + 8, HELP_Y + HELP_H - 52, 7.5, regular, GRAY);

  return doc.save();
}

// ── CORS headers ────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { bookingId } = await req.json();
    if (!bookingId) return new Response(JSON.stringify({ error: "Missing bookingId" }), { status: 400 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: booking, error } = await supabase
      .from("booking")
      .select("*, booking_item(*)")
      .eq("id", bookingId)
      .single();

    if (error || !booking) return new Response("Booking not found", { status: 404 });
    if (!booking.email) return new Response("No email on booking", { status: 400 });

    const { data: base } = await supabase.from("base").select("tnc").eq("id", 1).single();
    const tnc: string[] = Array.isArray(base?.tnc) ? base.tnc : [];

    // Generate PDF
    const pdfBytes = await generatePDF(booking as Booking, tnc);

    // Convert to base64 safely (avoid spread on large Uint8Array)
    let binary = "";
    pdfBytes.forEach((b) => (binary += String.fromCharCode(b)));
    const pdfBase64 = btoa(binary);

    const refNo = padRef(booking.id);

    // Send via Resend (idempotency key prevents duplicates if triggered from both
    // server callback and the client-side fallback on mobile)
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": refNo,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.email],
        subject: `Booking Confirmation – ${refNo}`,
        html: `
          <p>Dear ${booking.customer_name},</p>
          <p>Thank you for your booking at <strong>Arena IRC Negeri Sembilan</strong>.</p>
          <p>Your booking reference is <strong>${refNo}</strong>. Please find your booking confirmation receipt attached as a PDF.</p>
          <p>For enquiries, contact us at <strong>+6012-985 1855</strong> or <strong>arenaircns@gmail.com</strong>.</p>
          <br/>
          <p>Arena IRC Negeri Sembilan</p>
        `,
        attachments: [{ filename: `${refNo}.pdf`, content: pdfBase64 }],
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return new Response("Email failed: " + errText, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, refNo }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Receipt error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
