import { describe, expect, it } from "vitest";
import {
  createMercadoPagoWebhookManifest,
  signPayload,
  verifyMercadoPagoWebhookSignature,
  verifyWebhookSignature
} from "@/lib/security";

describe("webhook signature", () => {
  it("accepts valid signatures and rejects invalid ones", () => {
    const payload = JSON.stringify({ id: "pay_1", status: "approved" });
    const signature = signPayload(payload, "secret");

    expect(verifyWebhookSignature(payload, signature, "secret")).toBe(true);
    expect(verifyWebhookSignature(payload, "bad", "secret")).toBe(false);
  });

  it("accepts Mercado Pago x-signature manifests", () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const manifest = createMercadoPagoWebhookManifest({
      dataId: "PAYABC123",
      requestId: "request-123",
      timestamp
    });
    const signature = `ts=${timestamp},v1=${signPayload(manifest, "secret")}`;

    expect(
      verifyMercadoPagoWebhookSignature({
        dataId: "PAYABC123",
        requestId: "request-123",
        secret: "secret",
        signature
      })
    ).toBe(true);
    expect(
      verifyMercadoPagoWebhookSignature({
        dataId: "PAYABC123",
        requestId: "request-123",
        secret: "secret",
        signature: `ts=${timestamp},v1=bad`
      })
    ).toBe(false);
  });
});
