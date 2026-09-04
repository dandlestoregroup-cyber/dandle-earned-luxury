import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ORDER_ACCESS_COOKIE = "dandle_order_access";

export function hashOrderAccessToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function createOrderAccess(orderId: string) {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    hash: hashOrderAccessToken(token),
    cookie: `${ORDER_ACCESS_COOKIE}=${encodeURIComponent(`${orderId}.${token}`)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
  };
}

function parseCookie(header: string | null, name: string) {
  if (!header) return "";
  for (const part of header.split(";")) {
    const [rawName, ...valueParts] = part.trim().split("=");
    if (rawName === name) return decodeURIComponent(valueParts.join("="));
  }
  return "";
}

export function verifyOrderAccess(cookieHeader: string | null, orderId: string, expectedHash: string) {
  const raw = parseCookie(cookieHeader, ORDER_ACCESS_COOKIE);
  const separator = raw.indexOf(".");
  if (separator <= 0) return false;
  const cookieOrderId = raw.slice(0, separator);
  const token = raw.slice(separator + 1);
  if (cookieOrderId !== orderId || !token || !/^[a-f0-9]{64}$/i.test(expectedHash)) return false;
  const actualHash = hashOrderAccessToken(token);
  const left = Buffer.from(actualHash, "hex");
  const right = Buffer.from(expectedHash, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}
