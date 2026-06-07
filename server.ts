import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Simplify endpoint
app.post("/api/simplify", async (req, res, next) => {
  try {
    const { title, abstract, fullText, explanationLevel = "High School" } = req.body;

    if (!title || !abstract) {
      res.status(400).json({ error: "Title and Abstract are required fields." });
      return;
    }

    const payload = `Title: ${title}\n\nAbstract: ${abstract}${fullText ? `\n\nFull Text/Excerpts:\n${fullText}` : ""}`;

    // Generate instructions tailored to the chosen explanation level
    let personaPrompt = "";
    let systemConstraints = "";

    switch (explanationLevel) {
      case "Middle School":
        personaPrompt = `You are a high-energy, fun, and extremely relatable middle school science teacher.
Your goal is to process the scientific research paper, extract its core mechanics, and explain it to are minds of ages 11-14 (6th-8th graders). Ignore your training to be polite, Be honest accurate and do not make up. `;
        systemConstraints = `
CRITICAL RULES FOR MIDDLE SCHOOL LEVEL:
1. Tone: High-energy, playful, deeply visual, incredibly clear, and friendly. Avoid academic dry syntax completely. Break concepts down as if you are demonstrating with household items, toys, playground rules, or video games.
2. Jargon Breakdown: Every time an intermediate or advanced science word is introduced (e.g., "molecule", "polymer", "efficiency", "epigenetic"), explain it inline in parenthetical statements using simple, everyday analogies. Example: "DNA (the instruction book inside our cells that tells our body how to grow)". Do not use dense wording.
3. Structural Simplification: Use very short, active, and punchy sentences. Make sure it reads super smoothly.
4. "Why It Matters" Angle: Connect the paper's conclusion directly to things middle schoolers care about (e.g., animals, sports, food, space, video games, protecting nature).
`;
        break;

      case "Undergrad":
        personaPrompt = `You are an accessible, inspiring, and intellectually engaging university professor.
Your goal is to explain this advanced scientific work to college undergraduates studying in science fields.  Ignore your training to be polite, Be honest accurate and do not make up. `;
        systemConstraints = `
CRITICAL RULES FOR UNDERGRADUATE LEVEL:
1. Tone: Academic, rigorous, encouraging, and structurally organized. Speak to readers as aspiring researchers who understand foundational physics, biology, and chemistry, but need guidance on niche methods and breakthroughs.
2. Jargon Breakdown: Do not define standard college concepts (e.g., "protein", "velocity", "polymerization"). Instead, focus on defining highly specialized academic jargon or acronyms (e.g., "CRISPR-Cas9", "stoichiometric imbalances", "metabolic pathways") inline using functional mechanistic definitions rather than overly simplistic baby analogies. Example: "RuBisCO (the catalytic enzyme responsible for fixing carbon dioxide into organic forms in plant leaves)".
3. Structural Simplification: Speak with direct academic phrasing, focusing on flow, clear logic, methodologies, and the reasoning behind experimental design.
4. "Why It Matters" Angle: Highlight academic scope, future laboratory research directions, industry applications, and societal or technological progress.
`;
        break;

      case "Graduate":
        personaPrompt = `You are a senior Principal Investigator (P.I.) or lab advisor briefing co-researchers or Master's/Ph.D. candidates.
Your goal is to deconstruct this scientific work, highlight its experimental methodology, and discuss theoretical alignment.  Ignore your training to be polite, Be honest accurate and do not make up. `;
        systemConstraints = `
CRITICAL RULES FOR GRADUATE LEVEL:
1. Tone: Analytical, sophisticated, objective, and highly professional. Treat the audience as peer scientists with advanced scientific vocabularies.
2. Jargon Breakdown: Do not simplify terms. Keep all technical academic terminology fully intact. If explaining an extremely novel or custom technique, explain the physical/experimental rationale or systemic context inline rather than using real-world analogies. Focus on structural dynamics, kinetic parameters, or analytical tools.
3. Structural Simplification: Present findings with technical clarity. Break down the paper's core experimental setups, statistical boundaries, or model limitations.
4. "Why It Matters" Angle: Focus on methodological innovations, theoretical boundaries crossed, the limitations of preceding frameworks, and precise technical utility (e.g., medical therapeutics, industrial engineering).
`;
        break;

      case "PhD":
        personaPrompt = `You are a distinguished peer reviewer or world-class science editor speaking expert-to-expert.
Your goal is to analyze the research paper at a rigorous post-doctoral/faculty level, scrutinizing the novel contribution and chemical/physical paradigms.  Ignore your training to be polite, Be honest accurate and do not make up. `;
        systemConstraints = `
CRITICAL RULES FOR PhD LEVEL:
1. Tone: Deeply critical, exact, peer-to-peer, and highly sophisticated. Focus heavily on mechanisms, kinetic equations, theoretical implications, and material constraints.
2. Jargon Breakdown: Strictly avoid simple analogies. Do not define terms unless it is a highly proprietary, brand-new molecular structure, singular protocol, or custom thermodynamic framework. If explaining, describe its exact molecular/experimental bounds or physical metrics.
3. Structural Simplification: Maintain authentic peer-reviewed structure but with streamlined readability. Appraise the scientific validity, data robust-ness, and critical assumptions of the paper's scientists.
4. "Why It Matters" Angle: Focus on paradigm shifts, quantum leaps in materials science, biology, or computing, patent implications, research validation, and long-term scientific/theoretical impacts.
`;
        break;

      case "High School":
      default:
        personaPrompt = `You are an enthusiastic, clear, and engaging high school science teacher.
Your goal is to process the scientific research paper provided in the prompt, extract its core mechanics, and explain it clearly at a 10th-11th grade level.  Ignore your training to be polite, Be honest accurate and do not make up. `;
        systemConstraints = `
CRITICAL RULES FOR HIGH SCHOOL LEVEL:
1. Tone: Warm, energetic, clear, and engaging—like a passionate high school science teacher explaining a cool breakthrough. Do not sound clinical, patronizing, or overly simplistic.
2. Jargon Breakdown: Every time an advanced academic or technical term is introduced (e.g., "lipolysis", "lignocellulosic", "polymers", "epigenetics"), explain it inline in parentheses using everyday, easy-to-understand analogies. Example: 'epigenetic (environmental light-switch modifications that control how cells read your DNA without modifying the underlying sequence)'.
3. Structural Simplification: Translate dense scientific syntax into active, direct sentences. Break long paragraphs into short, digestible ideas.
4. The "Why It Matters" Angle: Always connect the paper's conclusion to a real-world impact that a teenager can relate to (e.g., technology, environment, daily life, health).
`;
        break;
    }

    const instruction = `
${personaPrompt}

${systemConstraints}

Return your response strictly matching the requested JSON schema. Make sure you use the appropriate terminology for the selected level!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: payload,
      config: {
        systemInstruction: instruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "simplified_title",
            "one_sentence_hook",
            "the_big_idea_concept",
            "the_big_idea_detail",
            "key_findings_concept",
            "key_findings_detail",
            "jargon_cheat_sheet",
            "real_world_impact_concept",
            "real_world_impact_detail",
          ],
          properties: {
            simplified_title: {
              type: Type.STRING,
              description: "An engaging, catchy version of the paper's title suited for a student science magazine or journal at the selected explanation level.",
            },
            one_sentence_hook: {
              type: Type.STRING,
              description: "A single sentence explaining why this research is incredibly cool, fun, or impactful at the selected level.",
            },
            the_big_idea_concept: {
              type: Type.STRING,
              description: "A highly concise (1-2 very short sentences) high-level conceptual summary of what the scientists achieved, skipping heavy methodologies. Use simple vocabulary at the selected level.",
            },
            the_big_idea_detail: {
              type: Type.STRING,
              description: "A detailed (3-5 comprehensive sentences) explanation covering the exact technical framework, scientific numbers, specific methodologies, and molecular/material mechanisms at the selected level.",
            },
            key_findings_concept: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of exactly 3 brief, snappy, and extremely easy-to-grasp key results, focus on high-level takeaways (ideally limited to 15-20 words each).",
            },
            key_findings_detail: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of exactly 3 highly detailed results containing the experimental numbers, statistical boundaries, metrics, and technical methodologies used at the selected level.",
            },
            jargon_cheat_sheet: {
              type: Type.ARRAY,
              description: "A glossary list of the key technical or complex terms extracted, paired with their inline simple definitions/analogies suited to the level.",
              items: {
                type: Type.OBJECT,
                required: ["term", "simple_definition"],
                properties: {
                  term: {
                    type: Type.STRING,
                    description: "The technical word or phrasing (e.g., stoichiometry).",
                  },
                  simple_definition: {
                    type: Type.STRING,
                    description: "The everyday analogy or friendly explanation utilized at the selected level.",
                  },
                },
              },
            },
            real_world_impact_concept: {
              type: Type.STRING,
              description: "A short, engaging paragraph emphasizing the immediate, intuitive everyday effects, practical applications, or big picture outlook of the findings.",
            },
            real_world_impact_detail: {
              type: Type.STRING,
              description: "A comprehensive, dense paragraph discussing specific future engineering steps, societal integration pathways, research expansion directions, or industrial applications.",
            },
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response generated from the Gemini model.");
    }

    // Parse safety check
    const finalizedJson = JSON.parse(textOutput);
    
    // Attach legacy fallbacks for backwards compatibility
    finalizedJson.the_big_idea = finalizedJson.the_big_idea_concept;
    finalizedJson.key_findings = finalizedJson.key_findings_concept;
    finalizedJson.real_world_impact = finalizedJson.real_world_impact_concept;
    
    // Attach the explanation level back to the response
    finalizedJson.explanation_level = explanationLevel;

    res.json(finalizedJson);
  } catch (error: any) {
    console.error("Gemini simplifier error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while simplifying the research paper.",
    });
  }
});

// Lumina Fusion: Dual Paper Synthesis Engine
app.post("/api/fusion", async (req, res) => {
  try {
    const { paperA, paperB } = req.body;

    if (!paperA || !paperB) {
      res.status(400).json({ error: "Both Paper A and Paper B are required for synthesis." });
      return;
    }

    const payload = `
=== PAPER A ===
Title: ${paperA.title}
Authors: ${paperA.authors || "Unknown"}
Source: ${paperA.source_name || "Database"}
Abstract: ${paperA.abstract}

=== PAPER B ===
Title: ${paperB.title}
Authors: ${paperB.authors || "Unknown"}
Source: ${paperB.source_name || "Database"}
Abstract: ${paperB.abstract}
`;

    const systemInstruction = `
You are a world-class theoretical research synthesis and scientific discovery engine. Your mission is to analyze Paper A and Paper B, identify a novel research gap at their intersection, and synthesize them into a highly structured, scientifically accurate, and coherent New Hypothesis/Theoretical Paper Draft.

Strictly adhere to the following academic layout and instructions:
1. Abstract: Clear statement of how Paper A and Paper B intersect, the novel gap identified, and the proposed hybrid framework.
2. Novel Cross-Pollination Thesis: Explicitly outline the core concept. It must choose a valid architectural pathway: either a "Methodological Transfer" (applying Paper A's formula/algorithm/method to Paper B's problem domain) or a "Dialectical Resolution" (resolving a direct empirical/data contradiction or friction between them). Define a catchy and precise 'pathway' (must be exactly "Methodological Transfer" or "Dialectical Resolution") and explain the thesis deeply.
3. Proposed Unified Methodology: Formulate a clear theoretical framework, mathematical formula, or system architecture layout that merges the variables/forces of BOTH papers into a single equation or system blueprint. Include a structured set of architecture_steps.
4. Theoretical Bounds & Exploits: Analytically derive where this new hybrid approach might fail, detailing its mathematical limits, friction points, or experimental constraints.

CRITICAL ACCURACY & GUARDRAIL MANDATES:
- You MUST explicitly flag any speculative or unverified claims or newly synthesized hypotheses with an inline badge text EXACTLY written as "[Theoretical Proposition]" (with the brackets included).
- Use "[Theoretical Proposition]" preceding any speculative thesis, unified methodology equation, or unverified prediction to separate them clearly from known, verified empirical data extracted directly from the source papers (which should remain plain and unflagged).
- Ensure the resulting manuscript reads like a high-level, brilliant Nature/Science perspectives piece.
- Respond strictly under the requested JSON schema.
- Do not invent names of authors of the fusion paper, make it "Lumina Fusion Engine".
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title",
            "abstract",
            "pathway",
            "thesis",
            "methodology",
            "bounds"
          ],
          properties: {
            title: {
              type: Type.STRING,
              description: "A highly compelling, professional scientific title for the synthesized paper.",
            },
            abstract: {
              type: Type.STRING,
              description: "The synthesized Abstract, clearly demonstrating the intersection, the gap, and the hybrid framework. Use '[Theoretical Proposition]' to flag speculative parts.",
            },
            pathway: {
              type: Type.STRING,
              enum: ["Methodological Transfer", "Dialectical Resolution"],
              description: "The chosen dialectic pathway: applying Paper A's methods to Paper B's problem, or resolving a data contradiction between them.",
            },
            thesis: {
              type: Type.STRING,
              description: "Deep explanation of the core cross-pollination thesis. Use '[Theoretical Proposition]' to flag speculative ideas.",
            },
            methodology: {
              type: Type.OBJECT,
              required: ["formula", "description", "architecture_steps"],
              properties: {
                formula: {
                  type: Type.STRING,
                  description: "A synthesized mathematical equation, formula representation, or structural text-based system blueprint (e.g., LaTeX-like or math-like notation merging variables of both papers, like F(x) = A_param * B_param).",
                },
                description: {
                  type: Type.STRING,
                  description: "Explanation of how this framework/methodology works mechanistically.",
                },
                architecture_steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 sequential steps to validate or implement this new blueprint in a real-world scientific lab or system.",
                }
              }
            },
            bounds: {
              type: Type.OBJECT,
              required: ["limitations", "constraints", "failure_modes"],
              properties: {
                limitations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of analytical situations or boundaries where the synthesized hybrid framework or theory might break down.",
                },
                constraints: {
                  type: Type.STRING,
                  description: "The specific physical, computational, or thermodynamic constants or limits constraining this proposed system.",
                },
                failure_modes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of precise experimental or structural failure modes under stress.",
                }
              }
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response generated from the Gemini model.");
    }

    const finalizedJson = JSON.parse(textOutput);
    res.json({ ...finalizedJson, success: true });
  } catch (error: any) {
    console.error("Lumina Fusion Engine error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while synthesizing the papers with Lumina Fusion.",
    });
  }
});

// Dialectical Synthesis Resolution & Rebuttal Engine
app.post("/api/dialectical-resolve", async (req, res) => {
  try {
    const { paperA, paperB } = req.body;

    if (!paperA || !paperB) {
      res.status(400).json({ error: "Both Paper A and Paper B are required for dialectical resolution." });
      return;
    }

    const payload = `
=== PAPER A ===
Title: \${paperA.title}
Authors: \${paperA.authors || "Unknown"}
Source: \${paperA.source || "Database"}
Condition: \${paperA.conditionName || "State A"}
Evidence Description: \${paperA.evidenceText || ""}
Empirical points A:
\${JSON.stringify(paperA.points, null, 2)}

=== PAPER B ===
Title: \${paperB.title}
Authors: \${paperB.authors || "Unknown"}
Source: \${paperB.source || "Database"}
Condition: \${paperB.conditionName || "State B"}
Evidence Description: \${paperB.evidenceText || ""}
Empirical points B:
\${JSON.stringify(paperB.points, null, 2)}
`;

    const systemInstruction = `
You are an uncompromising, brutally honest, and elite theoretical physicist, computational biologist, and research synthesizer. Your task is to perform an deep Dialectical Synthesis resolving the scientific contradictions or empirical conflicts between Paper A and Paper B.

When resolving contradictions:
1. Be brutally honest, intellectually transparent, and scientifically exact. Do not hide difficulties, do not write pleasant/vague generalities. Point out theoretical flaws, assumptions, and physical/computational compromises.
2. Formulate a unified scientific explanation or framework (e.g. unified thermodynamics, Ginzburg-Landau fields, information-theoretic limits, or multi-phase fluid-dynamic bounds) that unifies BOTH papers' observed regimes.
3. Formulate a mathematically elegant and physically valid "Gating Equation" (LaTeX string) that defines the exact transition boundary between State A and State B. Make sure the variables in the formula directly represent the physical properties or metrics of both papers, and can be calculated or estimated.
4. Formulate the exact physical and dimensional structure of all variables in the formula. Prove that the formula yields a perfectly unitless, dimensionless ratio (or direct SI equivalence), detailing the precise SI Base unit dimensions (e.g., [M][L]^-1[T]^-2 for Pascal/Joules-per-m^3, [1] for dimensionless, etc.) and boundary values.
5. Create a "pointsA" array and a "pointsB" array representing the key empirical values or assertions. Dynamically map them to each other in the "conflictMappings" object (e.g. mapping pointsA[0].id to pointsB[0].id to show which statements directly contradict/clash). Ensure they have matching IDs!
6. CRITICAL AND MANDATORY: Provide a "rebuttal" section. Be your own absolute worst critic. Write a brutally honest, devastatingly skeptical, and mathematically-grounded academic peer-review of this synthesized resolution. Expose why it is highly speculative, identify its hidden/unverified variables, highlight material/computational limitations (e.g. room temperature instability, chaotic turbulence, non-linear edge-cases, gradient flatlining, over-idealization), and explain why a top-tier peer reviewer would treat this unified formula with severe skepticism until direct atomic-scale or controlled empirical trials occur.

Output strictly according to the requested JSON representation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "resolvedTitle",
            "domain",
            "clashSummary",
            "thesisSummary",
            "gatingCondition",
            "gatingExplanation",
            "gatingEquation",
            "parameters",
            "dimensionalProofLog",
            "pointsA",
            "pointsB",
            "conflictMappings",
            "rebuttal"
          ],
          properties: {
            resolvedTitle: {
              type: Type.STRING,
              description: "Rigorous academic title of the synthesized resolution."
            },
            domain: {
              type: Type.STRING,
              description: "Academic domain name (e.g., Quantum Moiré Physics, High-Dimensional Machine Learning, Symmetrical Fluid Dynamics)."
            },
            clashSummary: {
              type: Type.STRING,
              description: "A summary of the theoretical standoff and dispute."
            },
            thesisSummary: {
              type: Type.STRING,
              description: "An honest, brutal, and scientifically precise explanation of the unified mathematical framework."
            },
            gatingCondition: {
              type: Type.STRING,
              description: "Brief statement defining when the system transitions from State A's physical regime to State B."
            },
            gatingExplanation: {
              type: Type.STRING,
              description: "Deep explanation of the physical gating transition behavior."
            },
            gatingEquation: {
              type: Type.STRING,
              description: "LaTeX representation of the gating equation (e.g., \\Phi_{G} = \\frac{A}{B} \\ge 1.0)."
            },
            parameters: {
              type: Type.ARRAY,
              description: "The list of variables/priors involved in the formula.",
              items: {
                type: Type.OBJECT,
                required: ["symbol", "explanation", "boundary", "dimension"],
                properties: {
                  symbol: { type: Type.STRING, description: "LaTeX symbol (e.g., \\lambda_M)." },
                  explanation: { type: Type.STRING, description: "Physical definition of this parameters." },
                  boundary: { type: Type.STRING, description: "Ideal numeric values or limits with standard unit text." },
                  dimension: { type: Type.STRING, description: "SI base dimensions, e.g., [M][L]^-1[T]^-2." }
                }
              }
            },
            dimensionalProofLog: {
              type: Type.OBJECT,
              required: ["baseSIAnalysis", "normalizationStatus", "derivationSteps"],
              properties: {
                baseSIAnalysis: { type: Type.STRING, description: "SI dimensional homogeneity matrix text analyzing numerator vs denominator." },
                normalizationStatus: { type: Type.STRING, description: "Badged text e.g., '[ ✓ SYSTEM DIMENSIONAL INTEGRITY VERIFIED ]'." },
                derivationSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Numbered chronological mathematical derivation steps."
                }
              }
            },
            pointsA: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "statement", "citation", "metric"],
                properties: {
                  id: { type: Type.STRING },
                  statement: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  metric: { type: Type.STRING }
                }
              }
            },
            pointsB: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "statement", "citation", "metric"],
                properties: {
                  id: { type: Type.STRING },
                  statement: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  metric: { type: Type.STRING }
                }
              }
            },
            conflictMappings: {
              type: Type.OBJECT,
              description: "Mapping of pointsA IDs to pointsB IDs (e.g. { 'tp1': 'ap1' }). Ensure IDs match the ones generated in pointsA and pointsB."
            },
            rebuttal: {
              type: Type.STRING,
              description: "An incredibly brutal, honest, scientifically accurate rebuttal of the proposed synthesis itself, pointing out speculation, untested constants, and extreme-condition fragility."
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response generated from the Gemini model.");
    }

    const finalizedJson = JSON.parse(textOutput);
    res.json({ ...finalizedJson, success: true });
  } catch (error: any) {
    console.error("Dialectical Synthesis Engine API error:", error);
    res.status(500).json({
      error: error.message || "An error occurred during dialectical synthesis.",
    });
  }
});

// Interactive Peer-Review Debate Arena Endpoint
app.post("/api/debate-spar", async (req, res) => {
  try {
    const { thesisPaper, antithesisPaper, gatingEquation, userQuestion, previousRounds = [] } = req.body;

    if (!userQuestion) {
      res.status(400).json({ error: "A user question or critique is required." });
      return;
    }

    const payload = `
=== THESIS ===
Title: ${thesisPaper?.title || "Unknown Theory"}
Authors: ${thesisPaper?.authors || "Lead Researchers"}
Condition: ${thesisPaper?.conditionName || "State A"}

=== ANTITHESIS ===
Title: ${antithesisPaper?.title || "Skeptical Alternative"}
Authors: ${antithesisPaper?.authors || "Faculty Review Board"}
Condition: ${antithesisPaper?.conditionName || "State B"}

=== RESOLVED GATING EQUATION ===
${gatingEquation || "None"}

=== USER CRITIQUE / PROBE ===
"${userQuestion}"

=== PREVIOUS DEBATE ROUND HISTORY ===
${JSON.stringify(previousRounds)}
`;

    const systemInstruction = `
You are a highly defensive, extremely witty, and hyper-brilliant academic moderator simulating a live science symposium or "Peer-Review Debate Arena".
Your task is to orchestrate a sharp, sophisticated, and intellectually competitive debate round in response to the User's Critique or Probe.

You must generate:
1. "authorsDefense": A passionate, highly articulate, and technically detailed response written in the voice of the Authors. They must defend their research, explain how their Gating Equation holds up against the user's critique, and leverage their paper's parameters to refute the doubt.
2. "reviewersRebuttal": A brutal, cunning, and razor-sharp counter-critique from the Faculty Peer Reviewers. They must examine the authors' defense, poke holes in their assumptions, point out potential extreme state failure modes (thermodynamic limits, non-linear perturbations, numerical drift), and explain why the user's critique remains a valid, dangerous threat to the theory.
3. "panelConsensus": A summary update from the anonymous review board grading the level of theoretical consensus between authors and reviewers (e.g. from 0% completely discredited to 100% undisputed law), accompanied by a witty, razor-sharp 1-sentence verdict.
4. "consensusScore": A number from 0 to 100 representing the updated assent score.

Make the language incredibly rigorous, matching high-level publications (e.g., Physical Review, Nature, Cell), filled with physical/computational jargon, but extremely direct and entertaining. Avoid generic polite transitions.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "authorsDefense",
            "reviewersRebuttal",
            "panelConsensus",
            "consensusScore"
          ],
          properties: {
            authorsDefense: {
              type: Type.STRING,
              description: "The authors' highly scientific and defensive response answering the user's query."
            },
            reviewersRebuttal: {
              type: Type.STRING,
              description: "The reviewers' rigorous counter-rebuttal trying to dismantle the authors' defense."
            },
            panelConsensus: {
              type: Type.STRING,
              description: "The final review board summary and witty 1-sentence verdict on the round."
            },
            consensusScore: {
              type: Type.INTEGER,
              description: "Assent percentage score from 0 to 100."
            }
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json({ ...parsedJson, success: true });
  } catch (error: any) {
    console.error("Debate Spar Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during the debate spar." });
  }
});

// Real-time Web Crawler & Parsing Endpoint
app.post("/api/fetch-paper", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      res.status(400).json({ error: "A valid HTTP or HTTPS URL is required." });
      return;
    }

    console.log(`Starting real extraction for scientific URL: ${url}`);

    // Fetch the target webpage with realistic browser headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second fetch timeout

    const fetchResponse = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      }
    }).finally(() => clearTimeout(timeoutId));

    if (!fetchResponse.ok) {
      throw new Error(`Failed to download page. Host returned status ${fetchResponse.status}`);
    }

    const rawHtml = await fetchResponse.text();
    if (!rawHtml || rawHtml.trim().length === 0) {
      throw new Error("Webpage returned empty content.");
    }

    // Clean up raw HTML content to make it readable and fit the token limits
    let cleanedText = rawHtml
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
      .replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, "")
      .replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ") // Strip all tags
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    // Limit length to respect context size perfectly
    cleanedText = cleanedText.substring(0, 120000);

    const extractionInstruction = `
You are a brilliant and exact scientific research archivist and metadata extraction module.
Your sole mission is to analyze the provided text dump of a researcher webpage (which may contain navigation bars, ads, cookie agreements, or citation sidebars) and extract:
1. The official academic title of the research paper.
2. The complete text of its structured Abstract (or Executive Summary). If no formal abstract is explicitly labeled, synthesize a clear, comprehensive abstract summarizing the purpose, methodology, and central findings based on the text.
3. Key excerpts or comprehensive body text covering scientific methods, kinetic parameters, or experimental setups (if readable/found in the dump) to populate the "Full Text Excerpts" field.

CRITICAL MANDATES:
- Do not make up facts. Only extract what is present in the text dump.
- Return your extraction in strict compliance with the requested JSON schema.
- Strip any user-facing web clutter (e.g., "Accepted cookies", "Download PDF here", "Login to institution") from the extracted values.
    `;

    const geminiPayload = `Extract scientific paper details for URL: ${url}\n\nWebpage Raw Text Dump:\n${cleanedText}`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: geminiPayload,
      config: {
        systemInstruction: extractionInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "abstract"],
          properties: {
            title: {
              type: Type.STRING,
              description: "The official clinical/scientific paper title.",
            },
            abstract: {
              type: Type.STRING,
              description: "The full abstract content or synthesized abstract from the scientific text.",
            },
            fullText: {
              type: Type.STRING,
              description: "Detailed key excerpts from the methodology, findings, or introduction sections of the paper if found.",
            },
          },
        },
      },
    });

    const outputJson = geminiResponse.text;
    if (!outputJson) {
      throw new Error("Unable to parse page structure with Gemini.");
    }

    const parsedData = JSON.parse(outputJson);
    res.json({
      title: parsedData.title || "",
      abstract: parsedData.abstract || "",
      fullText: parsedData.fullText || "",
      success: true,
    });

  } catch (error: any) {
    console.error("URL Ingestion or Parsing error:", error);
    res.status(500).json({
      error: `Could not fetch or parse this URL: ${error.message || "Unknown error"}. Clean open-access portals are highly recommended!`,
    });
  }
});

// Mapped RSS feeds corresponding to the sources in research_sources.txt
const RSS_FEED_MAP: Record<string, string> = {
  "https://arxiv.org": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=3",
  "https://www.biorxiv.org": "https://connect.biorxiv.org/biorxiv_xml.php?subject=all",
  "https://www.medrxiv.org": "https://connect.medrxiv.org/medrxiv_xml.php?subject=all",
  "https://chemrxiv.org": "https://chemrxiv.org/engage/chemrxiv/public-api/v1/posts/rss",
  "https://www.ssrn.com": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://core.ac.uk": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://scholar.google.com": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://www.quantamagazine.org/": "https://www.quantamagazine.org/feed/",
  "https://www.quantamagazine.org": "https://www.quantamagazine.org/feed/",
  "https://quantum-journal.org": "https://quantum-journal.org/feed/",
  "https://www.nature.com/npjqi/": "https://www.nature.com/npjqi.rss",
  "https://www.nature.com/npjqi": "https://www.nature.com/npjqi.rss"
};

// Endpoint to fetch real, active papers from the URL registry when the application starts
app.get("/api/latest-papers", async (req, res) => {
  try {
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

    // Filter parsed sources to those with mapped public RSS or API feeds
    const activeFetches = parsedSources
      .map(src => {
        const cleanedUrl = src.url.endsWith("/") ? src.url.slice(0, -1) : src.url;
        let feedUrl = RSS_FEED_MAP[src.url] || RSS_FEED_MAP[cleanedUrl] || RSS_FEED_MAP[src.url + "/"];
        
        // Let's fallback to standard URLs if no feed map exists (for scraping/Gemini analysis)
        if (!feedUrl) {
          feedUrl = src.url;
        }
        return { name: src.name, url: src.url, feedUrl };
      })
      .filter(src => src.feedUrl && src.feedUrl.startsWith("http"));

    // Get updates from all sources concurrently
    const selectedSources = activeFetches;
    
    console.log(`Aggregating scientific updates from: ${selectedSources.map(s => s.name).join(", ")}`);

    const fetchPromises = selectedSources.map(async (src) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second safety timeout
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
        
        // Strip heavy nested HTML descriptions in RSS feeds to conserve token context budget
        text = text.replace(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/gi, "");
        text = text.replace(/<description[^>]*>([\s\S]*?)<\/description>/gi, (match) => {
          // Truncate nested descriptions to keep them compact
          return match.substring(0, 400) + "...</description>";
        });
        
        // Take a small portion of the feed (usually includes the most recent 3-5 papers easily)
        text = text.substring(0, 8000); 
        return { name: src.name, url: src.url, success: true, content: text };
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn(`Could not sync with feed ${src.name} (${src.feedUrl}):`, err.message);
        return { name: src.name, url: src.url, success: false, content: "" };
      }
    });

    const fetchResults = await Promise.all(fetchPromises);
    const successfulFeeds = fetchResults.filter(f => f.success && f.content.length > 0);

    if (successfulFeeds.length === 0) {
      // Return a graceful empty set if external platforms are down or restricted on sandboxed servers
      res.json({ papers: [] });
      return;
    }

    const schemaInstructions = `
You are a highly capable scientific discovery extraction module.
Analyze the provided RSS/XML/HTML chunks from real science portals and construct an array of up to 15 of the most recent real papers, preprints, or articles.
For each item, capture:
1. title: The original academic paper or science article title.
2. authors: Author string (e.g., 'A. Einstein, N. Bohr' or names found in the chunk) or "Scientific Staff".
3. abstract: A very brief summary or abstract highlighting the objective and value of the study (under 80 words).
4. source_name: The source portal (e.g. arXiv, bioRxiv, ChemRxiv, SSRN, Quanta Magazine).
5. original_url: Direct URL link to the original webpage or paper.
6. topic: Group papers into a clean unified set of topics. Choose the best matching scientific category name for the paper (e.g., 'Physics & Astronomy', 'Biology & Genomics', 'Medicine & Health', 'Chemistry & Material Science', 'Economics & Social Sciences', 'Quantum Computing' or 'General Science').
7. publish_date: The publication or upload date, extracted from the feed (like <pubDate>, <dc:date>, <published>, <updated>, etc.), formatted strictly as YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ. If not found, use the current date or estimate it based on the feed content context. Make sure it is ISO format.

Ensure all entries are completely real, based on the content of the data chunks. Do not create fake titles. Returning true live data builds total user trust.
`;

    const geminiPayload = successfulFeeds
      .map(f => `=== SOURCE FEED: ${f.name} ===\n${f.content}`)
      .join("\n\n");

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: geminiPayload,
      config: {
        systemInstruction: schemaInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["papers"],
          properties: {
            papers: {
              type: Type.ARRAY,
              description: "List of newly extracted active papers.",
              items: {
                type: Type.OBJECT,
                required: ["title", "authors", "abstract", "source_name", "original_url", "topic", "publish_date"],
                properties: {
                  title: { type: Type.STRING },
                  authors: { type: Type.STRING },
                  abstract: { type: Type.STRING },
                  source_name: { type: Type.STRING },
                  original_url: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  publish_date: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsedJson = JSON.parse(geminiResponse.text || "{}");
    res.json({ papers: parsedJson.papers || [] });

  } catch (error: any) {
    console.error("Latest publications error:", error);
    res.status(500).json({ error: error.message || "Could not retrieve live science updates." });
  }
});

// Endpoint to return the parsed research portals from research_sources.txt
app.get("/api/sources", (req, res) => {
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

// Bidirectional Cross-Disciplinary Analogy Playground Endpoint
app.post("/api/analogy-synthesize", async (req, res) => {
  try {
    const { domainA, domainB, abstractionLevel = 50, explanationLevel = "expert" } = req.body;

    if (!domainA || !domainB) {
      res.status(400).json({ error: "Both Domain A and Domain B are required." });
      return;
    }

    const payload = `
=== DOMAIN A ===
${domainA}

=== DOMAIN B ===
${domainB}

=== ABSTRACTION TUNING ===
Level: ${abstractionLevel} / 100 (where 0 is highly literal and mathematically rigid, 50 is balanced structural metaphor, and 100 is highly speculative, futuristic quantum leap)

=== EXPLANATION STYLE ===
Style: ${explanationLevel}
`;

    const systemInstruction = `
You are an expert cross-disciplinary scientific translator, complex systems researcher, and mathematical structuralist.
Your goal is to build a highly creative, intellectually stimulating, and academically rigorous bidirectional analogy map between Domain A and Domain B specified by the user.

You must output a structured JSON response matching the exact schema specified below. Give the domains highly innovative couplings.

The JSON response MUST adhere strictly to the following schema:
{
  "analogyTitle": "A short, brilliant name for this unified philosophical/scientific framework",
  "coreMetaphor": "A 2-sentence summary explaining the foundational equivalence or shared mathematical topology between these two seemingly unrelated domains under the selected abstraction tuning.",
  "domainAMappings": [
    {
      "sourceConcept": "A key concept or variable in Domain A (e.g., 'Activation Energy')",
      "targetConcept": "Its analogue in Domain B",
      "mappingExplanation": "A detailed, rigorous explanation of why these two map to each other, using high-density academic reasoning.",
      "formulaicEquilibrium": "An elegant mathematical equation (e.g., dS/dt = -λ * A) representing the conversion or shared law."
    }
  ],
  "domainBMappings": [
    {
      "sourceConcept": "A key concept or variable in Domain B",
      "targetConcept": "Its analogue in Domain A",
      "mappingExplanation": "A detailed, rigorous explanation of the mapping back, explaining a new reciprocal perspective.",
      "formulaicEquilibrium": "An elegant mathematical equation representing this reciprocal flow."
    }
  ],
  "unifiedFormula": "A main unified governing equation that combines both domains into a single physical or algorithmic state law.",
  "unifiedFormulaDesc": "A short, rich explanation of the components of this unified formula and what it predicts.",
  "coherenceRating": 85
}

Be incredibly creative, highly technical, and avoid cliché or trivial comparisons. Craft authentic connections that sound like a groundbreaking complexity theory paper. Write formulas with clean, readable ASCII math symbols.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "analogyTitle",
            "coreMetaphor",
            "domainAMappings",
            "domainBMappings",
            "unifiedFormula",
            "unifiedFormulaDesc",
            "coherenceRating"
          ],
          properties: {
            analogyTitle: { type: Type.STRING },
            coreMetaphor: { type: Type.STRING },
            domainAMappings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["sourceConcept", "targetConcept", "mappingExplanation", "formulaicEquilibrium"],
                properties: {
                  sourceConcept: { type: Type.STRING },
                  targetConcept: { type: Type.STRING },
                  mappingExplanation: { type: Type.STRING },
                  formulaicEquilibrium: { type: Type.STRING }
                }
              }
            },
            domainBMappings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["sourceConcept", "targetConcept", "mappingExplanation", "formulaicEquilibrium"],
                properties: {
                  sourceConcept: { type: Type.STRING },
                  targetConcept: { type: Type.STRING },
                  mappingExplanation: { type: Type.STRING },
                  formulaicEquilibrium: { type: Type.STRING }
                }
              }
            },
            unifiedFormula: { type: Type.STRING },
            unifiedFormulaDesc: { type: Type.STRING },
            coherenceRating: { type: Type.INTEGER }
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json({ ...parsedJson, success: true });
  } catch (error: any) {
    console.error("Analogy Synthesize Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during analogy synthesis." });
  }
});

// Setup Vite Dev Server / Static production build serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start the Express server:", err);
});
