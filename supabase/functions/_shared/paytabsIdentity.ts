export type PaytabsIdentityResult =
  | { ok: true }
  | {
      ok: false;
      code: "missing_identity" | "transaction_mismatch" | "cart_mismatch";
      detail: string;
    };

export function verifyPaytabsTransactionIdentity(input: {
  callbackTranRef: unknown;
  verifiedTranRef: unknown;
  callbackCartId: unknown;
  verifiedCartId: unknown;
}): PaytabsIdentityResult {
  const callbackTranRef = typeof input.callbackTranRef === "string" ? input.callbackTranRef : "";
  const verifiedTranRef = typeof input.verifiedTranRef === "string" ? input.verifiedTranRef : "";
  const callbackCartId = typeof input.callbackCartId === "string" ? input.callbackCartId : "";
  const verifiedCartId = typeof input.verifiedCartId === "string" ? input.verifiedCartId : "";

  if (!callbackTranRef || !verifiedTranRef || !callbackCartId || !verifiedCartId) {
    return { ok: false, code: "missing_identity", detail: "PayTabs transaction identity is incomplete" };
  }
  if (callbackTranRef !== verifiedTranRef) {
    return { ok: false, code: "transaction_mismatch", detail: "Verified transaction reference does not match callback" };
  }
  if (callbackCartId !== verifiedCartId) {
    return { ok: false, code: "cart_mismatch", detail: "Verified cart does not match callback order" };
  }
  return { ok: true };
}
