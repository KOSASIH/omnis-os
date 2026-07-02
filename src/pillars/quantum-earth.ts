// Pillar 2 — Quantum Earth
// Runs Monte Carlo simulations over a Forge plan to estimate cost/time/ROI/risk.
// This is REAL math (no external API needed).

import { db } from "../core/db";

function gaussian(mean: number, stdev: number): number {
  // Box-Muller transform
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + stdev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export async function simulate(planId: string, baseCost: number, baseDays: number, iterations = 10000) {
  const costs: number[] = [];
  const times: number[] = [];
  const rois: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const cost = Math.max(0, gaussian(baseCost, baseCost * 0.2));
    const time = Math.max(1, gaussian(baseDays, baseDays * 0.25));
    const revenue = gaussian(baseCost * 1.8, baseCost * 0.5);
    costs.push(cost);
    times.push(time);
    rois.push((revenue - cost) / cost);
  }
  costs.sort((a, b) => a - b);
  times.sort((a, b) => a - b);

  const result = {
    plan_id: planId,
    iterations,
    cost_p50: percentile(costs, 50),
    cost_p90: percentile(costs, 90),
    time_p50: percentile(times, 50),
    time_p90: percentile(times, 90),
    roi_mean: rois.reduce((a, b) => a + b, 0) / rois.length,
    risk_score: costs.filter((c) => c > baseCost * 1.3).length / iterations,
  };
  await db.from("simulations").insert(result);
  return result;
}
