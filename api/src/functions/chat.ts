import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getKnowledgeBase, getClusterProfiles } from "../data/loader.js";
import { ChatMessage, ChatResponse, KnowledgeBaseEntry } from "../shared/types.js";

function findBestMatch(message: string, examples: KnowledgeBaseEntry[]): KnowledgeBaseEntry | null {
  const messageLower = message.toLowerCase();
  const words = messageLower.split(/\s+/).filter((w) => w.length > 3);

  let bestMatch: KnowledgeBaseEntry | null = null;
  let bestScore = 0;

  for (const example of examples) {
    const queryLower = example.query.toLowerCase();
    let score = 0;

    // Check word overlap
    for (const word of words) {
      if (queryLower.includes(word)) {
        score += 1;
      }
    }

    // Check intent keywords
    const intentKeywords: Record<string, string[]> = {
      credit_assessment: ["kredit", "kur", "layak", "pinjaman"],
      portfolio_risk: ["default", "risiko", "npl", "portofolio"],
      risk_mapping: ["risiko", "area", "tinggi", "high risk"],
      portfolio_analysis: ["portofolio", "score band", "distribusi"],
      risk_factors: ["faktor", "kemampuan", "bayar", "pengaruh"],
      priority_identification: ["prioritas", "infrastruktur", "intervensi", "butuh"],
      budget_planning: ["anggaran", "budget", "digitalisasi", "biaya"],
      policy_impact: ["dampak", "kur", "ekspansi", "kebijakan"],
      cluster_prioritization: ["cluster", "prioritas", "pemberdayaan"],
      vulnerability_mapping: ["kerentanan", "distribusi", "vulnerable"],
      sector_opportunity: ["peluang", "investasi", "sektor", "makanan"],
      roi_analysis: ["roi", "return", "investasi", "tertinggi"],
      market_sizing: ["pasar", "potensi", "suburban", "market"],
      fintech_opportunity: ["fintech", "lending", "area", "digital"],
      risk_assessment: ["risiko", "investasi", "rural", "area"],
    };

    const keywords = intentKeywords[example.intent] || [];
    for (const keyword of keywords) {
      if (messageLower.includes(keyword)) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = example;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

function getSystemPrompt(persona: string): string {
  switch (persona?.toLowerCase()) {
    case "bank":
      return "You are GeoUMKM AI assistant for banking professionals. Focus on credit risk assessment, portfolio analysis, KUR lending, and default risk. Use data from the knowledge base to provide specific metrics.";
    case "government":
      return "You are GeoUMKM AI assistant for government officials. Focus on priority areas, infrastructure needs, policy impact simulation, and UMKM empowerment programs.";
    case "investor":
      return "You are GeoUMKM AI assistant for investors. Focus on market opportunities, ROI analysis, sector growth, and location-based investment scoring.";
    default:
      return "You are GeoUMKM AI assistant. Help with location intelligence, credit risk, clustering analysis, and policy simulation for UMKM in West Java.";
  }
}

function buildKnowledgeContext(persona: string): string {
  const kb = getKnowledgeBase();
  const clusters = getClusterProfiles();

  // Build cluster summary
  const clusterSummary = clusters
    .slice(0, 5)
    .map((c) => `${c.cluster_name}: ${c.n_umkm} UMKM, score ${c.skor_potensi.toFixed(1)}`)
    .join("; ");

  // Get relevant persona examples (limit to 2 for context size)
  let examples: KnowledgeBaseEntry[];
  switch (persona?.toLowerCase()) {
    case "bank":
      examples = kb.bank_examples.slice(0, 2);
      break;
    case "government":
      examples = kb.government_examples.slice(0, 2);
      break;
    case "investor":
      examples = kb.investor_examples.slice(0, 2);
      break;
    default:
      examples = kb.bank_examples.slice(0, 1).concat(kb.government_examples.slice(0, 1));
  }

  const exampleContext = examples
    .map((e) => `Q: ${e.query}\nA: ${e.expected_response}`)
    .join("\n\n");

  // Limit total context to ~1000 chars
  const context = `\n\nKnowledge Base Context:\nClusters: ${clusterSummary}\n\nExample Q&A:\n${exampleContext}`;
  return context.slice(0, 1000);
}

async function callAzureOpenAI(
  message: string,
  persona: string,
  context: InvocationContext
): Promise<string | null> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;

  if (!endpoint || !apiKey) {
    return null;
  }

  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`;

  const systemPrompt = getSystemPrompt(persona) + buildKnowledgeContext(persona);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      context.warn(`Azure OpenAI returned status ${response.status}`);
      return null;
    }

    const json = await response.json() as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      context.warn("Azure OpenAI returned empty content");
      return null;
    }

    return content;
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      context.warn("Azure OpenAI request timed out (15s)");
    } else {
      context.warn("Azure OpenAI request failed:", error);
    }
    return null;
  }
}

async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = (await request.json()) as ChatMessage;
    const { message, persona } = body;

    if (!message) {
      return {
        status: 400,
        jsonBody: { success: false, error: "Message is required" },
      };
    }

    // Try Azure OpenAI if configured
    const aiResponse = await callAzureOpenAI(message, persona, context);
    if (aiResponse) {
      const response: ChatResponse = {
        response: aiResponse,
        intent: "ai_generated",
        sources: ["Azure OpenAI"],
      };
      return {
        status: 200,
        jsonBody: {
          success: true,
          data: response,
        },
      };
    }

    // Fallback to keyword matching
    const kb = getKnowledgeBase();

    // Select examples based on persona
    let examples: KnowledgeBaseEntry[];
    switch (persona?.toLowerCase()) {
      case "bank":
        examples = kb.bank_examples;
        break;
      case "government":
        examples = kb.government_examples;
        break;
      case "investor":
        examples = kb.investor_examples;
        break;
      default:
        // Search all personas
        examples = [
          ...kb.bank_examples,
          ...kb.government_examples,
          ...kb.investor_examples,
        ];
    }

    const match = findBestMatch(message, examples);

    let response: ChatResponse;
    if (match) {
      response = {
        response: match.expected_response,
        intent: match.intent,
        sources: match.retrieved_docs,
      };
    } else {
      response = {
        response:
          "Terima kasih atas pertanyaan Anda. Berdasarkan data yang tersedia dalam sistem GeoUMKM Intelligence, " +
          "saya dapat membantu dengan analisis lokasi UMKM, penilaian risiko kredit, profil cluster, " +
          "dan simulasi kebijakan. Silakan ajukan pertanyaan yang lebih spesifik tentang topik-topik tersebut.",
        intent: "general",
        sources: [],
      };
    }

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: response,
      },
    };
  } catch (error) {
    context.error("Error in chat handler:", error);
    return {
      status: 500,
      jsonBody: { success: false, error: "Internal server error" },
    };
  }
}

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "chat",
  handler,
});
