// Pillar 4 — God Hands IRL
// Executes a plan in the real world by dispatching to n8n webhooks and other
// real channels. Physical actuators (drones, robot arms, BCI) are HONEST STUBS:
// no public API exists, so they are logged with is_stub=true and never faked.

import { db } from "../core/db";

type Channel = "n8n" | "email" | "social" | "phone" | "drone" | "robot_arm" | "bci";

const STUB_CHANNELS: Channel[] = ["drone", "robot_arm", "bci"];

export async function execute(planId: string, channel: Channel, payload: unknown, webhookUrl?: string) {
  const isStub = STUB_CHANNELS.includes(channel);

  const row = {
    plan_id: planId,
    channel,
    webhook_url: webhookUrl ?? null,
    payload,
    is_stub: isStub,
    status: isStub ? "queued" : "dispatched",
  };

  if (!isStub && webhookUrl) {
    // REAL dispatch — fire the n8n / integration webhook
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
  // For stub channels we DO NOT pretend success — UI shows 'concept / awaiting real API'.

  await db.from("executions").insert(row);
  return { ...row, note: isStub ? "CONCEPT: no real public API for this actuator yet" : "dispatched" };
}
