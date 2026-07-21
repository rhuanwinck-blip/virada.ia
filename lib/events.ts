import { z } from "zod";

export const allowedEventNames = [
  "landing_viewed",
  "hero_cta_clicked",
  "how_it_works_clicked",
  "diagnostic_started",
  "question_viewed",
  "question_answered",
  "question_back_clicked",
  "diagnostic_abandoned",
  "contact_step_viewed",
  "contact_submitted",
  "result_viewed",
  "paywall_viewed",
  "checkout_clicked",
  "checkout_started",
  "payment_returned",
  "payment_approved",
  "report_opened",
  "pdf_downloaded",
  "daily_action_viewed",
  "daily_action_completed",
  "daily_action_skipped",
  "checkin_started",
  "checkin_completed",
  "pro_offer_viewed",
  "subscription_started",
  "subscription_cancelled"
] as const;

export type AnalyticsEventName = (typeof allowedEventNames)[number];

const allowedAnalyticsPropertyKeys = [
  "age_range",
  "main_pain",
  "score_band",
  "confidence_level",
  "question_key",
  "question_index",
  "source",
  "campaign",
  "device",
  "experiment_variant"
] as const;

export const analyticsSchema = z.object({
  event: z.enum(allowedEventNames),
  properties: z
    .object({
      age_range: z.string().optional(),
      main_pain: z.string().optional(),
      score_band: z.string().optional(),
      confidence_level: z.string().optional(),
      question_key: z.string().optional(),
      question_index: z.number().optional(),
      source: z.string().optional(),
      campaign: z.string().optional(),
      device: z.string().optional(),
      experiment_variant: z.string().optional()
    })
    .default({})
});

export const automationEvents = [
  "diagnostic.started",
  "diagnostic.abandoned",
  "diagnostic.completed",
  "lead.created",
  "result.viewed",
  "paywall.viewed",
  "checkout.started",
  "payment.approved",
  "payment.rejected",
  "report.generation.started",
  "report.ready",
  "report.failed",
  "plan.day.completed",
  "plan.day.skipped",
  "checkin.due",
  "checkin.completed",
  "subscription.started",
  "subscription.renewed",
  "subscription.failed",
  "subscription.cancelled"
] as const;

export function sanitizeAnalyticsProperties(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) =>
      (allowedAnalyticsPropertyKeys as readonly string[]).includes(key)
    )
  );
}
