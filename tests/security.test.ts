import { describe, expect, it } from "vitest";
import { signPayload, verifyWebhookSignature } from "@/lib/security";

describe("webhook signature", () => {
  it("accepts valid signatures and rejects invalid ones", () => {
    const payload = JSON.stringify({ id: "pay_1", status: "approved" });
    const signature = signPayload(payload, "secret");

    expect(verifyWebhookSignature(payload, signature, "secret")).toBe(true);
    expect(verifyWebhookSignature(payload, "bad", "secret")).toBe(false);
  });
});
