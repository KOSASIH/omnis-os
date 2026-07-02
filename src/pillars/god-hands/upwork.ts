/**
 * OMNIS — God Hands · Upwork Hire Adapter (Phase 2)
 *
 * REAL contract against Upwork's public GraphQL API. Unlike drones/robots,
 * a hiring API genuinely exists — so this is a real adapter that becomes live
 * the moment an UPWORK_API_TOKEN is present. Without a token it returns a
 * `failed` result rather than pretending to hire anyone.
 *
 * Flow: plan needs a human task -> post job -> shortlist -> send offer.
 */

import type { ExecutionAdapter, ExecutionRequest, ExecutionResult } from './dispatcher';

const UPWORK_GQL = 'https://api.upwork.com/graphql';

export interface HirePayload {
  title: string;
  description: string;
  budgetUsd: number;
  skills: string[];
}

async function postJob(token: string, p: HirePayload): Promise<string> {
  const query = `mutation Create($input: JobPostingInput!) {
    createJobPosting(input: $input) { id status }
  }`;
  const res = await fetch(UPWORK_GQL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { input: { title: p.title, description: p.description, budget: p.budgetUsd, skills: p.skills } },
    }),
  });
  if (!res.ok) throw new Error(`Upwork API ${res.status}`);
  const json = (await res.json()) as { data?: { createJobPosting?: { id: string } } };
  const id = json.data?.createJobPosting?.id;
  if (!id) throw new Error('Upwork returned no job id');
  return id;
}

export const upworkAdapter: ExecutionAdapter = {
  name: 'upwork',
  concept: false,
  async run(req: ExecutionRequest): Promise<ExecutionResult> {
    const token = process.env.UPWORK_API_TOKEN;
    const now = new Date().toISOString();
    if (!token) {
      return { adapter: 'upwork', status: 'failed', concept: false, detail: 'UPWORK_API_TOKEN not set', dispatchedAt: now };
    }
    try {
      const jobId = await postJob(token, req.payload as unknown as HirePayload);
      return { adapter: 'upwork', status: 'succeeded', concept: false, detail: `Job posted ${jobId}`, dispatchedAt: now, externalRef: jobId };
    } catch (e) {
      return { adapter: 'upwork', status: 'failed', concept: false, detail: (e as Error).message, dispatchedAt: now };
    }
  },
};
