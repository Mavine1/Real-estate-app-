import { ExecutionMethod, Functions } from "react-native-appwrite";

import { client, config } from "./appwrite";

const functions = new Functions(client);

export type PayHeroPaymentRequest = {
  amount: number;
  phoneNumber: string;
  reference: string;
  description: string;
};

export type PayHeroPaymentResponse = {
  success: boolean;
  status: string;
  message: string;
  checkoutRequestId?: string;
  reference: string;
};

export const normalizeKenyanPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  throw new Error("Enter a valid Kenyan Safaricom number, for example 0712 345 678.");
};

export async function initiatePayHeroPayment(
  request: PayHeroPaymentRequest
): Promise<PayHeroPaymentResponse> {
  if (!config.payHeroFunctionId) {
    throw new Error(
      "PayHero is ready for connection. Add EXPO_PUBLIC_APPWRITE_PAYHERO_FUNCTION_ID after deploying the included function."
    );
  }

  const execution = await functions.createExecution({
    functionId: config.payHeroFunctionId,
    body: JSON.stringify({
      ...request,
      phoneNumber: normalizeKenyanPhone(request.phoneNumber),
    }),
    async: false,
    xpath: "/payments/initiate",
    method: ExecutionMethod.POST,
    headers: { "content-type": "application/json" },
  });

  const raw = execution.responseBody || "{}";
  let result: PayHeroPaymentResponse;
  try {
    result = JSON.parse(raw) as PayHeroPaymentResponse;
  } catch {
    throw new Error("PayHero returned an unreadable response. Please try again.");
  }

  if (execution.responseStatusCode >= 400 || !result.success) {
    throw new Error(result.message || "The M-Pesa request could not be started.");
  }

  return result;
}
