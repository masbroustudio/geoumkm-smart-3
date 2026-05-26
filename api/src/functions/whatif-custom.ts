import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getUmkmData } from "../data/loader.js";
import { WhatIfCustomRequest, WhatIfCustomResponse } from "../shared/types.js";

async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = (await request.json()) as WhatIfCustomRequest;

    const { target_kabupaten } = body;

    // Clamp deltas to expected ranges
    const infrastructure_delta = Math.max(-30, Math.min(30, body.infrastructure_delta));
    const internet_delta = Math.max(-30, Math.min(30, body.internet_delta));
    const bank_distance_delta = Math.max(-50, Math.min(50, body.bank_distance_delta));

    if (!target_kabupaten) {
      return {
        status: 400,
        jsonBody: { success: false, error: "target_kabupaten is required" },
      };
    }

    const allUmkm = getUmkmData();
    const filtered = allUmkm.filter(
      (u) => u.kabupaten_kota === target_kabupaten
    );

    if (filtered.length === 0) {
      return {
        status: 200,
        jsonBody: {
          success: true,
          data: {
            affected_count: 0,
            avg_score_before: 0,
            avg_score_after: 0,
            avg_improvement: 0,
            umkm_crossing_70_threshold: 0,
            pct_improved: 0,
            max_improvement: 0,
          } as WhatIfCustomResponse,
        },
      };
    }

    let totalBefore = 0;
    let totalAfter = 0;
    let crossingThreshold = 0;
    let improvedCount = 0;
    let maxImprovement = 0;

    for (const umkm of filtered) {
      const scoreBefore = umkm.skor_potensi;
      const rawNew = scoreBefore +
        (infrastructure_delta * 0.66) +
        (internet_delta * 0.33) +
        (bank_distance_delta * 0.01);
      const scoreAfter = Math.max(0, Math.min(100, rawNew));
      const improvement = scoreAfter - scoreBefore;

      totalBefore += scoreBefore;
      totalAfter += scoreAfter;

      if (improvement > 0) {
        improvedCount++;
      }
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
      }
      if (scoreBefore < 70 && scoreAfter >= 70) {
        crossingThreshold++;
      }
    }

    const affected_count = filtered.length;
    const avg_score_before = totalBefore / affected_count;
    const avg_score_after = totalAfter / affected_count;
    const avg_improvement = avg_score_after - avg_score_before;
    const pct_improved = (improvedCount / affected_count) * 100;

    const result: WhatIfCustomResponse = {
      affected_count,
      avg_score_before,
      avg_score_after,
      avg_improvement,
      umkm_crossing_70_threshold: crossingThreshold,
      pct_improved,
      max_improvement: maxImprovement,
    };

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: result,
      },
    };
  } catch (error) {
    context.error("Error in whatif-custom handler:", error);
    return {
      status: 500,
      jsonBody: { success: false, error: "Internal server error" },
    };
  }
}

app.http("whatif-custom", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "whatif-custom",
  handler,
});
