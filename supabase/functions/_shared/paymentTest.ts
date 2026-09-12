// The public storefront cannot select a price or enable this operator-only path.
export const PAYMENT_TEST_AMOUNT = 50;
export const PAYMENT_TEST_REFERENCE = /^DN-PT50-[A-F0-9]{32}$/;

export function resolvePaymentTest(
  body: Record<string, unknown>,
  authorization: string | null,
  serviceRole: string | undefined,
) {
  if (body.payment_test !== true) return { requested: false } as const;
  if (!serviceRole || authorization !== `Bearer ${serviceRole}`) {
    return { requested: true, ok: false, status: 403, error: "Operator authorization required" } as const;
  }
  if (typeof body.test_reference !== "string" || !PAYMENT_TEST_REFERENCE.test(body.test_reference)) {
    return { requested: true, ok: false, status: 400, error: "Invalid test reference" } as const;
  }
  return { requested: true, ok: true, reference: body.test_reference, amount: PAYMENT_TEST_AMOUNT } as const;
}
