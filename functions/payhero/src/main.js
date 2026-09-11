const PAYHERO_URL = "https://backend.payhero.co.ke/api/v2/payments/initiate-stk-push";

const jsonBody = (req) => {
  if (req.bodyJson && typeof req.bodyJson === "object") return req.bodyJson;
  try {
    return JSON.parse(req.bodyText || req.body || "{}");
  } catch {
    return {};
  }
};

const cleanPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  return "";
};

export default async ({ req, res, log, error }) => {
  const path = req.path || req.url || "/";

  if (path.includes("/health")) {
    return res.json({ ok: true, provider: "payhero", configured: Boolean(process.env.PAYHERO_API_USERNAME && process.env.PAYHERO_API_PASSWORD && process.env.PAYHERO_CHANNEL_ID) });
  }

  if (path.includes("/payments/callback")) {
    const suppliedToken = req.query?.token || "";
    if (!process.env.PAYHERO_CALLBACK_TOKEN || suppliedToken !== process.env.PAYHERO_CALLBACK_TOKEN) {
      return res.json({ success: false, message: "Invalid callback token" }, 401);
    }
    const callback = jsonBody(req);
    log(`PayHero callback: ${JSON.stringify(callback)}`);
    // Callback data is logged for reconciliation. Connect PAYHERO_CALLBACK_FORWARD_URL
    // to forward it to a private ledger service when the payments table is provisioned.
    if (process.env.PAYHERO_CALLBACK_FORWARD_URL) {
      await fetch(process.env.PAYHERO_CALLBACK_FORWARD_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(callback),
      });
    }
    return res.json({ success: true, received: true });
  }

  if (!path.includes("/payments/initiate")) {
    return res.json({ success: false, message: "Route not found" }, 404);
  }

  const userId = req.headers?.["x-appwrite-user-id"];
  if (!userId) return res.json({ success: false, message: "Sign in before making a payment." }, 401);

  const username = process.env.PAYHERO_API_USERNAME;
  const password = process.env.PAYHERO_API_PASSWORD;
  const channelId = process.env.PAYHERO_CHANNEL_ID;
  if (!username || !password || !channelId) {
    return res.json({ success: false, message: "PayHero credentials have not been configured yet." }, 503);
  }

  const body = jsonBody(req);
  const amount = Math.round(Number(body.amount));
  const phone = cleanPhone(body.phoneNumber);
  const reference = String(body.reference || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
  if (!Number.isFinite(amount) || amount < 1 || !phone || !reference) {
    return res.json({ success: false, message: "A valid amount, Kenyan phone number and reference are required." }, 400);
  }

  const callbackBase = process.env.PAYHERO_CALLBACK_URL;
  const callbackToken = process.env.PAYHERO_CALLBACK_TOKEN;
  const callbackUrl = callbackBase && callbackToken
    ? `${callbackBase}${callbackBase.includes("?") ? "&" : "?"}token=${encodeURIComponent(callbackToken)}`
    : undefined;

  try {
    const response = await fetch(PAYHERO_URL, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount,
        phone_number: phone,
        channel_id: channelId,
        provider: "m-pesa",
        external_reference: reference,
        customer_name: String(body.customerName || "Baraka Homes tenant").slice(0, 100),
        ...(callbackUrl ? { callback_url: callbackUrl } : {}),
      }),
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    if (!response.ok) {
      error(`PayHero ${response.status}: ${text}`);
      return res.json({ success: false, message: data.message || "PayHero rejected the payment request.", reference }, response.status);
    }
    return res.json({
      success: true,
      status: data.status || "QUEUED",
      message: data.message || "M-Pesa prompt sent. Enter your PIN to complete payment.",
      checkoutRequestId: data.checkout_request_id || data.CheckoutRequestID,
      reference,
    });
  } catch (cause) {
    error(`PayHero request failed: ${cause instanceof Error ? cause.message : String(cause)}`);
    return res.json({ success: false, message: "Could not reach PayHero. Please try again.", reference }, 502);
  }
};

