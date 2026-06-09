import { Router } from "express";
import path from "path";
import fs from "fs";
import * as geminiService from "./geminiService";
import { parseXmlFeed } from "./feedParser";

const RSS_FEED_MAP: Record<string, string> = {
  "https://arxiv.org": "https://export.arxiv.org/rss/physics",
  "https://www.biorxiv.org": "https://connect.biorxiv.org/biorxiv_xml.php?subject=biol",
  "https://www.medrxiv.org": "https://connect.medrxiv.org/medrxiv_xml.php?subject=med",
  "https://www.quantamagazine.org/": "https://www.quantamagazine.org/feed/",
  "https://www.quantamagazine.org": "https://www.quantamagazine.org/feed/",
  "https://quantum-journal.org": "https://quantum-journal.org/feed/",
  "https://www.nature.com/npjqi/": "https://www.nature.com/npjqi/current_issue.rss",
};
const REAL_LITERATURE_FALLBACKS: any[] = [
  {
    title: "On the Electrodynamics of Moving Bodies",
    authors: "Albert Einstein",
    abstract: "A seminal paper establishing the foundation of special relativity.",
    source_name: "Annalen der Physik",
    original_url: "https://doi.org/10.1002/andp.19053221004",
    topic: "Physics",
    publish_date: "1905-09-26"
  },
  {
    title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid",
    authors: "J. D. Watson and F. H. C. Crick",
    abstract: "The discovery of the double helix structure of DNA.",
    source_name: "Nature",
    original_url: "https://doi.org/10.1038/171737a0",
    topic: "Biology",
    publish_date: "1953-04-25"
  }
];
import { getFreshLiteratureFallbacks } from "./openAlexService";
import { parseAcademicPDF, simplifyWithGrounding } from "./grounding";

const cleanHtmlLayout = preprocessScientificHtml;

export const routesRouter = Router();

// Robust memory cache for /latest-papers (15 minutes TTL) to bypass rate limitations gracefully
let latestPapersCache: {
  papers: any[];
  timestamp: number;
} | null = null;
const CACHE_DURATION_MS = 15 * 60 * 1000;

// Simplify endpoint
routesRouter.post("/simplify", async (req, res) => {
  const { title, abstract, fullText, explanationLevel = "High School", authors, year, publish_date, pages } = req.body;
  try {
    if (!title || !abstract) {
      res.status(400).json({ error: "Title and Abstract are required fields." });
      return;
    }

    let result;
    if (pages && Array.isArray(pages) && pages.length > 0) {
      result = await simplifyWithGrounding(title, pages, explanationLevel);
    } else {
      result = await geminiService.simplifyPaper({
        title,
        abstract,
        fullText,
        explanationLevel,
        authors,
        year,
        publish_date,
      });
    }
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Simplifying scientific paper failed:", error);
    res.status(502).json({
      error: "Scientific paper simplification failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Dual Paper Synthesis Engine
routesRouter.post("/fusion", async (req, res) => {
  const { paperA, paperB } = req.body;
  try {
    if (!paperA || !paperB) {
      res.status(400).json({ error: "Both Paper A and Paper B are required for synthesis." });
      return;
    }

    const result = await geminiService.fusePapers(paperA, paperB);
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Dual paper synthesis failed:", error);
    res.status(502).json({
      error: "Dual paper synthesis failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Dialectical Synthesis Resolution & Rebuttal Engine
routesRouter.post("/dialectical-resolve", async (req, res) => {
  const { paperA, paperB } = req.body;
  try {
    if (!paperA || !paperB) {
      res.status(400).json({ error: "Both Paper A and Paper B are required for dialectical resolution." });
      return;
    }

    const result = await geminiService.resolveDialectical(paperA, paperB);
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Dialectical resolution failed:", error);
    res.status(502).json({
      error: "Dialectical resolution failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Interactive Peer-Review Debate Arena Endpoint
routesRouter.post("/debate-spar", async (req, res) => {
  const { thesisPaper, antithesisPaper, gatingEquation, userQuestion, previousRounds = [] } = req.body;
  try {
    if (!userQuestion) {
      res.status(400).json({ error: "A user question or critique is required." });
      return;
    }

    const result = await geminiService.debateSpar({
      thesisPaper,
      antithesisPaper,
      gatingEquation,
      userQuestion,
      previousRounds,
    });
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Debate moderation failed:", error);
    res.status(502).json({
      error: "Debate round generation failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Dynamic Thesis Validation Matrix Endpoint
routesRouter.post("/thesis-matrix", async (req, res) => {
  const { title, abstract, year, mode } = req.body;
  try {
    if (!title || !abstract) {
      res.status(400).json({ error: "Title and Abstract are required for mapping." });
      return;
    }

    let result = null;
    if (mode === "real") {
      result = await geminiService.generateRealThesisMatrix({ title, abstract, year });
      if (result) {
        // Tag result mode for the frontend to acknowledge
        (result as any).mode = "real";
      }
    }

    if (!result) {
      result = await geminiService.generateDynamicThesisMatrix({ title, abstract, year });
      if (result) {
        (result as any).mode = "simulated";
      }
    }

    if (!result) {
      res.status(500).json({ error: "Failed to generate thesis matrix." });
      return;
    }
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Thesis matrix generation failed:", error);
    res.status(502).json({
      error: "Matrix generation failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Real-time Web Crawler & Parsing Endpoint with Secure Network Fetch Safety
routesRouter.post("/fetch-paper", async (req, res) => {
  const { url } = req.body;
  try {
    if (!url || !url.startsWith("http")) {
      res.status(400).json({ error: "Invalid academic URL provided." });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const fetchResponse = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "LuminaAcademicBot/1.0" }
    }).finally(() => clearTimeout(timeoutId));

    if (!fetchResponse.ok) {
      throw new Error(`Host returned status ${fetchResponse.status}`);
    }

    const contentType = fetchResponse.headers.get("content-type") || "";
    
    if (contentType.includes("application/pdf") || url.endsWith(".pdf")) {
      const arrayBuffer = await fetchResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Parse multi-column spatial binary
      const { fullText, pages } = await parseAcademicPDF(buffer);
      
      // Pass to grounded LLM analysis metadata extractor
      const result = await geminiService.extractPaperWithPages({ fullText, pages });
      res.json(result);
    } else {
      // Standard HTML web scraper fallback
      const htmlText = await fetchResponse.text();
      const cleanText = cleanHtmlLayout(htmlText);
      const result = await geminiService.extractPaperMetadata({ url, cleanedText: cleanText });
      res.json(result);
    }
  } catch (error: any) {
    console.error("[Lumina System] Fatal ingestion crash:", error);
    res.status(502).json({
       error: "Scientific document ingestion or parser failed.",
       details: error.message
    });
  }
});

// Endpoint to fetch real, active papers from the registry XML sources
routesRouter.get("/latest-papers", async (req, res) => {
  try {
    // 1. Check memory cache first to avoid Gemini 429 quota restrictions
    const forceRefresh = req.query.refresh === "true";
    if (!forceRefresh && latestPapersCache && (Date.now() - latestPapersCache.timestamp < CACHE_DURATION_MS)) {
      console.log("[Lumina System] Serving latest-papers from active memory cache.");
      res.json({ papers: latestPapersCache.papers });
      return;
    }

    const filePath = path.join(process.cwd(), "research_sources.txt");
    if (!fs.existsSync(filePath)) {
      res.json({ papers: [] });
      return;
    }
    
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.split("\n").map(l => l.trim()).filter(Boolean);
    const parsedSources: { name: string; url: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("http")) {
        const url = lines[i];
        let name = "Scientific Portal";
        if (i > 0 && !lines[i - 1].startsWith("http")) {
          name = lines[i - 1];
        }
        parsedSources.push({ name, url });
      }
    }

    if (parsedSources.length === 0) {
      res.json({ papers: [] });
      return;
    }

    const activeFetches = parsedSources
      .map(src => {
        const cleanedUrl = src.url.endsWith("/") ? src.url.slice(0, -1) : src.url;
        let feedUrl = RSS_FEED_MAP[src.url] || RSS_FEED_MAP[cleanedUrl] || RSS_FEED_MAP[src.url + "/"];
        // If no feedUrl found, set it to null to skip this source.
        if (!feedUrl) {
          feedUrl = "";
        }
        return { name: src.name, url: src.url, feedUrl };
      })
      .filter(src => src.feedUrl && src.feedUrl.startsWith("http"));

    const fetchPromises = activeFetches.map(async (src) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const fetchRes = await fetch(src.feedUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,application/rss+xml,*/*;q=0.8"
          }
        });
        clearTimeout(timeoutId);
        if (!fetchRes.ok) throw new Error(`HTTP ${fetchRes.status}`);
        let text = await fetchRes.text();
        
        text = text.replace(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/gi, "");
        text = text.replace(/<description[^>]*>([\s\S]*?)<\/description>/gi, (match) => {
          return match.substring(0, 400) + "...</description>";
        });
        text = text.substring(0, 8000); 
        return { name: src.name, url: src.url, success: true, content: text };
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.log(`[Lumina System] Feed ${src.name} is currently offline or timed out.`);
        return { name: src.name, url: src.url, success: false, content: "" };
      }
    });

    const fetchResults = await Promise.all(fetchPromises);
    const successfulFeeds = fetchResults.filter(f => f.success && f.content.length > 0);

    if (successfulFeeds.length === 0) {
      console.log("No feeds successfully fetched. Returning high-fidelity real literature fallbacks from OpenAlex.");
      let shuffledFallbacks = [];
      try {
        shuffledFallbacks = await getFreshLiteratureFallbacks();
        if (!shuffledFallbacks || shuffledFallbacks.length === 0) {
          shuffledFallbacks = [...REAL_LITERATURE_FALLBACKS];
        }
      } catch (err) {
        shuffledFallbacks = [...REAL_LITERATURE_FALLBACKS];
      }
      for (let i = shuffledFallbacks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledFallbacks[i];
        shuffledFallbacks[i] = shuffledFallbacks[j];
        shuffledFallbacks[j] = temp;
      }
      res.json({ papers: shuffledFallbacks });
      return;
    }

    const geminiPayload = successfulFeeds
      .map(f => `=== SOURCE FEED: ${f.name} ===\n${f.content}`)
      .join("\n\n");

    let papersResult: any[] = [];
    try {
      papersResult = await geminiService.extractFeedPapers(geminiPayload);
    } catch (geminaErr: any) {
      console.log("[Lumina System] Activating high-fidelity local RSS feed parsing.");
      const parsedFeedsList: any[] = [];
      try {
        for (const feed of successfulFeeds) {
          const parsed = parseXmlFeed(feed.content, feed.name, feed.url);
          parsedFeedsList.push(...parsed);
        }
      } catch (err) {
        console.error("Local RSS parser failed:", err);
      }

      if (parsedFeedsList.length > 0) {
        console.log(`Local RSS parser extracted ${parsedFeedsList.length} real papers!`);
        papersResult = parsedFeedsList.slice(0, 15);
      } else {
        console.log("No papers found via local RSS parsing. Using dynamic OpenAlex fallback list.");
        let rawFallbacks = [];
        try {
          rawFallbacks = await getFreshLiteratureFallbacks();
        } catch (err) {
          rawFallbacks = [...REAL_LITERATURE_FALLBACKS];
        }
        for (let i = rawFallbacks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = rawFallbacks[i];
          rawFallbacks[i] = rawFallbacks[j];
          rawFallbacks[j] = temp;
        }
        papersResult = rawFallbacks;
      }
    }

    // Cache the result for subsequent calls as long as we got back some papers
    if (papersResult && papersResult.length > 0) {
      latestPapersCache = {
        papers: papersResult,
        timestamp: Date.now()
      };
    }

    res.json({ papers: papersResult });
  } catch (error: any) {
    console.error("Latest publications error:", error);
    res.status(500).json({ error: error.message || "Could not retrieve live science updates." });
  }
});

// Endpoint to return the parsed research portals
routesRouter.get("/sources", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "research_sources.txt");
    if (!fs.existsSync(filePath)) {
      res.json({ sources: [] });
      return;
    }
    
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.split("\n").map(l => l.trim()).filter(Boolean);
    const parsedSources: { name: string; url: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("http")) {
        const url = lines[i];
        let name = "Scientific Portal";
        if (i > 0 && !lines[i - 1].startsWith("http")) {
          name = lines[i - 1];
        }
        parsedSources.push({ name, url });
      }
    }
    res.json({ sources: parsedSources });
  } catch (error: any) {
    console.error("Sources error:", error);
    res.status(500).json({ error: error.message || "Could not retrieve sources." });
  }
});

// AI Search Grounding Scout
routesRouter.post("/research-scout", async (req, res) => {
  try {
    const { query, level = "Graduate" } = req.body;
    if (!query || !query.trim()) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    console.log(`AI Scout searching for: "${query}" at ${level} level`);
    const papers = await geminiService.scoutResearch(query, level);
    res.json({ papers });
  } catch (error: any) {
    console.error("AI Scout search error:", error);
    res.status(502).json({
      error: "Academic query search and grounding failed due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Study Dossier Compiler
routesRouter.post("/compile-dossier", async (req, res) => {
  const { papers, level = "Graduate" } = req.body;
  try {
    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      res.status(400).json({ error: "At least one paper is required to compile a dossier." });
      return;
    }

    const result = await geminiService.compileDossier(papers, level);
    res.json(result);
  } catch (error: any) {
    console.error("[Lumina System] Compiling educational dossier failed:", error);
    res.status(502).json({
      error: "Failed to compile reading list dossier due to an upstream model error.",
      details: error.message || error,
    });
  }
});

// Citation Horizon Tracing endpoint removed due to academic integrity concerns.
routesRouter.post("/citation-network", async (req, res) => {
  res.status(404).json({ error: "Endpoint decommissioned." });
});

/**
 * Preprocesses ingested HTML/XML documents to preserve mathematical notations and structural layouts.
 */
export function preprocessScientificHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  let processed = rawHtml;

  // 1. Remove non-content blocks (scripts, styles, svg, head, iframe, nav, header, footer elements)
  processed = processed.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, " ");
  processed = processed.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, " ");
  processed = processed.replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, " ");
  processed = processed.replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, " ");
  processed = processed.replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, " ");
  processed = processed.replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, " ");
  processed = processed.replace(/<header[^>]*>([\s\S]*?)<\/header>/gi, " ");

  // 2. Preserve mathematical superscripts and subscripts as LaTeX-like notation
  processed = processed.replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, "^{$1}");
  processed = processed.replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, "_{$1}");

  // 3. Preserve basic table structures before stripping all other tags
  // Convert <tr> to newline boundaries, and <td> / <th> to pipeline spacers
  processed = processed.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, "\n[Row]: $1\n");
  processed = processed.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, " | $1 ");
  processed = processed.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, " | $1 ");

  // 4. Preserve paragraph and section structure
  processed = processed.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
  processed = processed.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n\n# $1\n\n");

  // 5. Strip all other HTML tags safely
  processed = processed.replace(/<[^>]+>/g, " ");

  // 6. Resolve HTML entities to readable unicode equivalent
  processed = processed
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&micro;/g, "μ")
    .replace(/&pi;/g, "π")
    .replace(/&theta;/g, "θ")
    .replace(/&lambda;/g, "λ")
    .replace(/&alpha;/g, "α")
    .replace(/&beta;/g, "β")
    .replace(/&gamma;/g, "γ")
    .replace(/&sigma;/g, "σ")
    .replace(/&omega;/g, "ω")
    .replace(/&deg;/g, "°")
    .replace(/&plusmn;/g, "±");

  // 7. Strip out potential repetitive page header metadata loops
  processed = processed.replace(/(Download\s+PDF\s*,\s*){2,}/gi, "Download PDF ");

  // 8. Condense multiple spaces and lines
  processed = processed.replace(/[ \t]+/g, " ");
  processed = processed.replace(/\n\s*\n\s*\n+/g, "\n\n");
  
  return processed.trim();
}

