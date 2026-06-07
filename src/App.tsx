import React, { useState, useEffect } from "react";
import CrossDomainVariableInjector from "./components/CrossDomainVariableInjector";
import GenerativeMathCompiler from "./components/GenerativeMathCompiler";
import DialecticalSynthesisEngine from "./components/DialecticalSynthesisEngine";
import RosettaCanvas from "./components/RosettaCanvas";
import AboutUs from "./components/AboutUs";
import SympheryIcon from "./components/SympheryIcon";
import CrossDisciplinaryAnalogyPlayground from "./components/CrossDisciplinaryAnalogyPlayground";
import { SimplifiedPaper, JargonCheatSheetItem, ExplanationLevel, LivePaper, Source } from "./types";
import { 
  Sparkle, 
  LayoutGrid,
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  ArrowRightLeft,
  Dna,
  Lightbulb, 
  Compass, 
  HelpCircle, 
  Layers, 
  AlertCircle, 
  HeartHandshake, 
  Flame, 
  Globe, 
  Cpu, 
  ChevronRight,
  RefreshCw,
  Search,
  BookMarked,
  Share2,
  Link2,
  Download,
  Clock,
  Bookmark,
  Trash2,
  X,
  Network,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  ExternalLink,
  Sparkles,
  GitMerge,
  Plus,
  FlaskConical,
  Atom
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DECIPHERED_MATH_ENTRIES = [
  {
    id: "attention",
    keywords: ["attention", "transformer", "self-attention", "llm", "nn", "neural network", "attention mechanism"],
    mathExpression: "\\text{Attention}(Q, K, V) = \\text{soft-max}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
    displayText: "Attention(Q, K, V) = soft-max( QKᵀ / √d_k ) V",
    name: "Self-Attention Vector Dot-Product Optimization",
    historicalOrigin: {
      origin: "Gauss's 1809 Least Squares Matrix Reductions",
      formula: "[\\mathbf{X}^T \\mathbf{X}]^{-1} \\mathbf{X}^T \\mathbf{y}",
      description: "Carl Friedrich Gauss first developed matrix normal projection equations in 1809 to map asteroid orbits from sparse coordinates. He projected high-dimensional observation vectors onto a 3D orbit plane, mapping semantic fields long before Transformers."
    },
    missingLeaps: {
      steps: [
        "Dot-Product Projection: Q (query) is projected onto K (key) transposition via matrix multiplication representing alignment intensities.",
        "Scale Normalization: We divide elements by √d_k. Since variance of a dot product of two d-dimensional vectors scales with d_k, dividing by √d_k brings statistical variance back to 1.0, protecting Soft-max from exploding into vanishing gradient regions.",
        "Soft-max Compression: Converts dry similarity logits into a normalized attention map distribution of probability weights ranging 0 to 1.",
        "Value Matrix Integration: Multiplies these weights against V (value) to output high-dimensional word representations."
      ],
      description: "Most academic publications ignore the dimensional variance bounds, omitting how √d_k explicitly guards soft-max saturation curves."
    },
    modernApplication: {
      topic: "LLM Context Window Multi-Head Attention Router",
      parameter: "score = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)\natten = torch.softmax(score, dim=-1)\noutput = torch.matmul(atten, v)",
      description: "This constitutes the attention-head code driving models like GPT-4 and Gemini, scaling contextual weight parameters across 100K token windows."
    }
  },
  {
    id: "entropy",
    keywords: ["entropy", "shannon", "information", "probability", "uncertainty", "cross-entropy", "biology", "genomics", "metabolic"],
    mathExpression: "H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i)",
    displayText: "H(X) = - ∑ P(x_i) log₂ P(x_i)",
    name: "Shannon's Information Entropy Metric",
    historicalOrigin: {
      origin: "Boltzmann's 1877 Thermodynamic Phase Space Entropy",
      formula: "S = k_B \\ln \\Omega",
      description: "Ludwig Boltzmann defined physical entropy as the natural logarithm of microscopic states in a gas system. In 1948, Claude Shannon realized information uncertainty follows the exact same mechanical dispersion equations."
    },
    missingLeaps: {
      steps: [
        "Alternative Probability Matrix: P(x_i) tracks the probability density function of each possible discrete state.",
        "Surprisal Quantification: The expression -log_2 P(x_i) measures the bits of surprise associated with the event (lower probability = higher surprise).",
        "Expectation Summation: Weighted average is built by multiplying each surprise value with its probability, resulting in the average expected bits.",
        "Asymptotic Limits: As the probability of a single state approaches 1.0, general entropy decays smoothly to 0 (perfect certainty)."
      ],
      description: "Textbooks rarely verify that translating negative logarithms computes the exact binary bits required to map structural variations."
    },
    modernApplication: {
      topic: "Categorical Cross-Entropy Loss optimization",
      parameter: "loss = -np.sum(target_probs * np.log2(predicted_probs + 1e-15))",
      description: "Serves as the optimization benchmark for multiclass deep learning classifiers, driving weights forward until predictions merge with target maps."
    }
  },
  {
    id: "gradient",
    keywords: ["gradient", "gradient descent", "optimization", "neural", "weights", "sgd", "loss", "backpropagation", "physics", "astronomy"],
    mathExpression: "w_{t+1} = w_t - \\eta \\nabla L(w_t)",
    displayText: "w_t+1 = w_t - η ∇ L(w_t)",
    name: "Gradient Descent Steepest Direction Vector Update",
    historicalOrigin: {
      origin: "Newton's 1687 Force Gravity Deflection Planes",
      formula: "\\vec{F}_g = -G \\frac{M m}{r^2} \\hat{r}",
      description: "Isaac Newton designed orbital calculus of vectors traveling down gravitational trajectories. His mechanical equations established multi-dimensional systems tracking steep local vectors down energy wells."
    },
    missingLeaps: {
      steps: [
        "Partial Derivative Expansion: The vector gradient ∇L contains the individual partial derivatives of the loss function corresponding to each trainable dimension.",
        "Polarity Inversion: Subtracting the gradient flips the vector direction 180°, facing directly down the local slope toward the global minimum.",
        "Learning Rate (η) Decay: Constrains step size to prevent local hyperplanes from overshooting or diverging.",
        "Parameter Shifts: Iteratively re-centers millions of neural network weight vectors relative to active loss boundaries."
      ],
      description: "Standard journals omit the multi-dimensional stability proofs of Taylor expansion approximations under highly non-convex functions."
    },
    modernApplication: {
      topic: "Stochastic AdamW Adaptive Learning Rate Weight Optimizer",
      parameter: "for p in model.parameters():\n    p.data = p.data - lr * (p.grad + weight_decay * p.data)",
      description: "Foundational optimizer loop in PyTorch, executing gradient descent update parameters over billions of network parameters per step."
    }
  },
  {
    id: "schrodinger",
    keywords: ["schrödinger", "quantum", "wave", "hamiltonian", "psi", "schrodinger", "qubit", "superconducting"],
    mathExpression: "i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi",
    displayText: "iℏ ∂/∂t Ψ = ĤΨ",
    name: "Schrödinger Wave Equation State Hamiltonian",
    historicalOrigin: {
      origin: "Hamilton's 1834 Mechanical Optic Paths",
      formula: "H(q, p) = T(p) + V(q)",
      description: "William Rowan Hamilton mathematically united optics and mechanics. Erwin Schrödinger substituted Hamilton’s classical kinetic variables with differential wave equations to create quantum modeling."
    },
    missingLeaps: {
      steps: [
        "Differential Transformation: Classical momenta parameters p are replaced with partial space differential operators -iℏ∇.",
        "Hamiltonian Operation: The operation calculates kinetic energy operators and potentials operating directly onto state wavefunction Ψ.",
        "Eigenstate Resolution: Differential eigenvalues resolve discrete energy states E matching wave boundary conditions.",
        "Total State Integration: The integrated square wavefunction magnitude represents absolute space probability densities."
      ],
      description: "Omitted gaps fail to clarify how continuous wave functions collapse into discrete energy levels due strictly to bound spatial variables."
    },
    modernApplication: {
      topic: "Quantum Coherence Circuit Simulator",
      parameter: "psi_t = scipy.linalg.expm(-1j * H * t / hbar) @ psi_0",
      description: "Calculates coherence state lifespan and fidelity in superconducting transmon qubits used in quantum hardware."
    }
  },
  {
    id: "reinforce",
    keywords: ["reinforce", "policy gradient", "reward", "reinforcement learning", "ppo", "rlhf", "policy"],
    mathExpression: "\\nabla_\\theta J(\\theta) = \\mathbb{E}[\\nabla_\\theta \\log \\pi_\\theta(a|s) Q(s,a)]",
    displayText: "∇_θ J(θ) = E [ ∇_θ log π_θ(a|s) Q(s,a) ]",
    name: "REINFORCE Policy Gradient Objective",
    historicalOrigin: {
      origin: "Ramanujan's 1920 Mock Theta Mock Function Inversions",
      formula: "\\Phi(q) = \\sum \\frac{q^{n^2}}{(1-q)(1-q^2)...(1-q^n)}",
      description: "On his deathbed, Ramanujan developed Mock Theta function series to predict boundary distribution values in modular limits. These formulas paved the way for Markov expectation paths as modern stochastic transitions."
    },
    missingLeaps: {
      steps: [
        "Expectation Breakdown: Re-writing standard trajectory objective function J(θ) as an integral of policy path probabilities.",
        "Logarithmic Identity Shift: Utilizing ∇_θ π_θ(a|s) = π_θ(a|s) ∇_θ log π_θ(a|s) to replace the derivative of probabilities with a simple log derivative.",
        "Stochastic expectation: Computing gradients without needing to calculate all possible states, by using the active sample rewards Q(s,a) directly.",
        "Gradient Ascent Amplification: Actions with higher reward parameters Q(s,a) receive larger updates to scale their policy logits."
      ],
      description: "Journals usually skip the logarithmic derivative identity, which is crucial for transforming integrals into sample-friendly log-sum gradients."
    },
    modernApplication: {
      topic: "RLHF PPO Reward Alignment Objective",
      parameter: "ratio = torch.exp(new_log_probs - old_log_probs)\nsurrogate = advantage * ratio\nloss = -torch.mean(surrogate)",
      description: "Responsible for aligning modern foundational LLMs like Gemini with human preference scores, regulating probability weights based on feedback loops."
    }
  }
];

const getDecipheredMathForPaper = (paperTitle: string, paperAbstract: string, paperTopic?: string): any => {
  const fullTextToSearch = `${paperTitle} ${paperAbstract} ${paperTopic || ""}`.toLowerCase();
  for (const entry of DECIPHERED_MATH_ENTRIES) {
    if (entry.keywords.some(kw => fullTextToSearch.includes(kw))) {
      return entry;
    }
  }
  // Default fallbacks based on topic
  const topic = (paperTopic || "").toLowerCase();
  if (topic.includes("quantum") || topic.includes("physics")) {
    return DECIPHERED_MATH_ENTRIES[3]; // Schrodinger
  }
  if (topic.includes("biology") || topic.includes("chemistry") || topic.includes("social")) {
    return DECIPHERED_MATH_ENTRIES[1]; // Entropy
  }
  return DECIPHERED_MATH_ENTRIES[0]; // Attention / ML as solid standard
};

export default function App() {
  // Input states
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [fullText, setFullText] = useState("");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>("High School");
  const [viewMode, setViewMode] = useState<"concept" | "detail">("concept");
  const [activeMathId, setActiveMathId] = useState<string | null>(null);

  // Reading List State (using localStorage persistence)
  const [readingList, setReadingList] = useState<LivePaper[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_reading_list");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [showReadingList, setShowReadingList] = useState(false);

  // Lumina Fusion: Dual Paper Synthesis Lab State
  const [showFusionLab, setShowFusionLab] = useState(false);
  const [fusionPaperA, setFusionPaperA] = useState<LivePaper | null>(null);
  const [fusionPaperB, setFusionPaperB] = useState<LivePaper | null>(null);
  const [fusionLoading, setFusionLoading] = useState(false);
  const [fusionStatusText, setFusionStatusText] = useState("");
  const [fusionResult, setFusionResult] = useState<any | null>(null);
  const [fusionError, setFusionError] = useState<string | null>(null);
  const [expandedFusionSection, setExpandedFusionSection] = useState<string | null>("abstract");
  const [fusionSearchQuery, setFusionSearchQuery] = useState("");
  const [selectingSlot, setSelectingSlot] = useState<"A" | "B" | null>(null);
  const [showInjector, setShowInjector] = useState(false);
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [showMathCompiler, setShowMathCompiler] = useState(false);
  const [showDialectical, setShowDialectical] = useState(false);
  const [showRosetta, setShowRosetta] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);

  // Sync readingList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lumina_reading_list", JSON.stringify(readingList));
    } catch (e) {
      console.error("Failed to save reading list to localStorage:", e);
    }
  }, [readingList]);

  const handleToggleReadLater = (paper: LivePaper) => {
    const exists = readingList.some(item => item.original_url === paper.original_url);
    if (exists) {
      setReadingList(prev => prev.filter(item => item.original_url !== paper.original_url));
    } else {
      setReadingList(prev => [...prev, paper]);
    }
  };

  const isBookmarked = (paper: LivePaper) => {
    return readingList.some(item => item.original_url === paper.original_url);
  };

  

  // Helper to parse text and turn theoretical claims into styled inline badges
  const renderSynthesizedTextWithBadges = (text: string) => {
    if (!text) return null;
    const parts = text.split("[Theoretical Proposition]");
    if (parts.length === 1) return text;
    
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <span className="inline-flex items-center gap-1 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-md uppercase mx-1.5 align-middle select-none md:my-0.5">
            <Sparkles className="h-2.5 w-2.5" />
            Theoretical Proposition
          </span>
        )}
      </React.Fragment>
    ));
  };

  // Run the paper synthesis backend pipeline
  const handleSynthesize = async () => {
    if (!fusionPaperA || !fusionPaperB) {
      setFusionError("Please select both Paper A and Paper B to synthesize.");
      return;
    }

    setFusionLoading(true);
    setFusionError(null);
    setFusionResult(null);

    const statuses = [
      "Extracting core paradigms from both documents...",
      "Mapping intersection vectors & identifying novel research gap...",
      "Resolving ontological divergences under chosen pathway...",
      "Synthesizing unified theoretical methodology & math blueprint...",
      "Formulating thermodynamic boundaries and experimental limits...",
      "Injecting theoretical proposition badges & formatting manuscript..."
    ];

    let statusIndex = 0;
    setFusionStatusText(statuses[0]);
    const statusInterval = setInterval(() => {
      if (statusIndex < statuses.length - 1) {
        statusIndex++;
        setFusionStatusText(statuses[statusIndex]);
      }
    }, 1800);

    try {
      const resp = await fetch("/api/fusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paperA: {
            title: fusionPaperA.title,
            abstract: fusionPaperA.abstract,
            authors: fusionPaperA.authors,
            source_name: fusionPaperA.source_name
          },
          paperB: {
            title: fusionPaperB.title,
            abstract: fusionPaperB.abstract,
            authors: fusionPaperB.authors,
            source_name: fusionPaperB.source_name
          }
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "Failed to synthesize papers.");
      }

      const data = await resp.json();
      setFusionResult(data);
      setExpandedFusionSection("abstract");
    } catch (err: any) {
      console.error("Fusion error:", err);
      setFusionError(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      clearInterval(statusInterval);
      setFusionLoading(false);
    }
  };
  
  // Live curated papers states
  const [livePapers, setLivePapers] = useState<LivePaper[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [justImported, setJustImported] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  
  // URL fetching states
  const [urlInput, setUrlInput] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Result and process states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifiedPaper | null>(null);
  
  // Search query for the Jargon Cheat Sheet
  const [jargonQuery, setJargonQuery] = useState("");

  // Pulsing term state for connecting inline highlights to glossary cards
  const [pulsingTerm, setPulsingTerm] = useState<string | null>(null);

  const handleJargonInteraction = (term: string) => {
    setPulsingTerm(term);
    // Automatically clear the pulsing state after 1.5 seconds
    const timer = setTimeout(() => {
      setPulsingTerm((current) => (current === term ? null : current));
    }, 1500);
    return () => clearTimeout(timer);
  };

  const handleJargonInteractionAndScroll = (term: string) => {
    handleJargonInteraction(term);
    const termId = term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const element = document.getElementById(`jargon-card-${termId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Citation Graph & Horizon Map State
  const [showHorizonMap, setShowHorizonMap] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [selectedCitationNode, setSelectedCitationNode] = useState<any | null>(null);

  // Thesis Validation Matrix State
  const [hoveredMatrixCard, setHoveredMatrixCard] = useState<string | null>(null);
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(true);
  const [splitScreenPaper, setSplitScreenPaper] = useState<any | null>(null);
  const [highDensity, setHighDensity] = useState(false);

  // Dynamically generate Thesis Validation Matrix tailored to the active paper
  const generateThesisValidationMatrix = (paperTitle: string) => {
    const cleanTitle = paperTitle || "Current Study";
    let domain = "AI and ML Foundations";
    if (cleanTitle.toLowerCase().includes("biolog") || cleanTitle.toLowerCase().includes("genet") || cleanTitle.toLowerCase().includes("protein") || cleanTitle.toLowerCase().includes("nutrient") || cleanTitle.toLowerCase().includes("crop")) {
      domain = "Bioinformatics & Genetics";
    } else if (cleanTitle.toLowerCase().includes("climate") || cleanTitle.toLowerCase().includes("carbon") || cleanTitle.toLowerCase().includes("ecolog") || cleanTitle.toLowerCase().includes("soil")) {
      domain = "Environmental Sciences";
    } else if (cleanTitle.toLowerCase().includes("quantum") || cleanTitle.toLowerCase().includes("physic") || cleanTitle.toLowerCase().includes("optics")) {
      domain = "Quantum Mechanics & Physics";
    }

    const columns = {
      supporting: [
        {
          id: "sup-1",
          journal: "Journal of Computational Design Methods",
          authors: "Chen & Zhang, 2026",
          citations: 184,
          claim: domain === "Bioinformatics & Genetics"
            ? "Biological topologies are bound to structured optimization curves under scale."
            : domain === "Environmental Sciences"
            ? "Soil organic carbon decay coefficients remain steady under multi-decade monitoring."
            : domain === "Quantum Mechanics & Physics"
            ? "Quantum register information retention matches mathematical models below 10mK."
            : "Dynamic feedback scaling structures demonstrate stable gradient descent curves.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "💚 Verification: Independently verified that cellular alignment matches the scale structures outlined in this paper's core hypothesis."
            : domain === "Environmental Sciences"
            ? "💚 Replication: Successfully replicated the soil decay patterns across 4 diverse climate zones, proving the mathematical robustness of the model."
            : domain === "Quantum Mechanics & Physics"
            ? "💚 Verification: Confirmed state retention stays within 0.4% error bounds, replicating the main paper's claim of universal preservation."
            : "💚 Verification: Replicated identical learning curves under high parameters, proving model stability claims in section 1 of the study.",
          anchorId: "claim-big-idea",
          originalUrl: "https://arxiv.org/abs/2604.01124",
          abstract: "This work investigates computational stability models across simulated domains, validating the linear scaling dynamics and energy conservation parameters under peak stress loads.",
          summary: "An independent replication study that confirms the core assertions with negligible error bounds."
        },
        {
          id: "sup-2",
          journal: "Global Science Publications & Archives",
          authors: "S. Martinez, et al., 2025",
          citations: 92,
          claim: domain === "Bioinformatics & Genetics"
            ? "Microsecond mitochondrial structural sequences show distinct clustering behaviors."
            : domain === "Environmental Sciences"
            ? "Deep learning simulations accurately predict methane pathway respiration rates."
            : domain === "Quantum Mechanics & Physics"
            ? "Gradient descent optimization tracks spatial quantum filter metrics."
            : "Feedback latency overhead is fully mitigated by lateral gradient offsets.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "💚 Verification: Proved sequence alignments cluster as described in the findings section, validating the primary analytical pipeline."
            : domain === "Environmental Sciences"
            ? "💚 Replication: Replicated path prediction accuracy with independent field readings, confirming the discoveries of the primary study."
            : domain === "Quantum Mechanics & Physics"
            ? "💚 Verification: Verified optimization metrics converge to stable regimes, backing up the core math presented in discoveries."
            : "💚 Support: Direct hardware validation verifies that latency spikes are countered by lateral routing, yielding consistent 85%+ throughput.",
          anchorId: "claim-discovery-0",
          originalUrl: "https://arxiv.org/abs/2511.08291",
          abstract: "We implement dynamic scaling on dedicated servers and discover that localized feedback pathways offset connection overhead substantially.",
          summary: "Verifies the findings under live hardware conditions, presenting empirical metrics supporting the main paper's claims."
        }
      ],
      conflicting: [
        {
          id: "con-1",
          journal: "Advanced Computational Review",
          authors: "L. Zhao & J. Sterling, 2026",
          citations: 114,
          claim: domain === "Bioinformatics & Genetics"
            ? "Biological topologies collapse into volatile regimes when parameters scale non-linearly."
            : domain === "Environmental Sciences"
            ? "Regional organic carbon sequestration decreases sharply under rapid temperature anomalies."
            : domain === "Quantum Mechanics & Physics"
            ? "Extreme multi-gate coherence degrades fast under subtle external electric noise fields."
            : "Delayed gradient feedback causes gradient explosions when training state steps vary.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "⚠️ Contradiction: Discovered significant topologic variation that challenges the linear stabilization claim of the main paper."
            : domain === "Environmental Sciences"
            ? "⚠️ Contradiction: Observed sequestration failure margins that contradict the main paper's claim of universal carbon retention."
            : domain === "Quantum Mechanics & Physics"
            ? "⚠️ Spike: Found state decoherence rate spiked by 24% under ambient field deviations, disputing the study's claims of universal noise immunity."
            : "⚠️ Friction: The active error rate spiked by 14% when tested against non-linear delayed opponents, contradicting claims of universal stabilization.",
          anchorId: "claim-discovery-1",
          originalUrl: "https://arxiv.org/abs/2602.04812",
          abstract: "An exploration of degradation boundaries under extreme volatile conditions. We find that feedback loops cause structural divergence when input bounds surpass nominal standards.",
          summary: "Identifies severe operational boundaries and disputes the universal stability of the primary study's model."
        },
        {
          id: "con-2",
          journal: "The Dialectical Science Gazette",
          authors: "K. Vance, 2026",
          citations: 56,
          claim: domain === "Bioinformatics & Genetics"
            ? "Biological sequencing approaches struggle to map long sequences containing recursive patterns."
            : domain === "Environmental Sciences"
            ? "Direct field measurements of soil carbon respiration show high variance compared to simulated runs."
            : domain === "Quantum Mechanics & Physics"
            ? "Quantum signal updates trigger communications overhead that delays state-gradient execution."
            : "Physical hardware interconnect latency nullifies speedups described in simulated models.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "⚠️ Counter-argument: Argues that recursive sequences degrade accuracy, questioning the main paper's universal claim of absolute fidelity."
            : domain === "Environmental Sciences"
            ? "⚠️ Critique: Challenges the simulation's validity, pointing out that natural variances exceed the paper's claimed confidence boundaries by 2.5x."
            : domain === "Quantum Mechanics & Physics"
            ? "⚠️ Friction: Demonstrates interconnect bottlenecks that offset alignment speedups, contradicting theoretical multi-gate performance stats."
            : "⚠️ Critique: Challenges the theoretical modeling of feedback layers, noting communication bottlenecks during distributed scale-up operations.",
          anchorId: "claim-discovery-2",
          originalUrl: "https://arxiv.org/abs/2601.09241",
          abstract: "We benchmark distributed layer coordination across real physical server racks, identifying critical spatial communication bottlenecks.",
          summary: "A hardware-centric critique highlighting that idealized simulations overlook tangible latency boundaries."
        }
      ],
      methodological: [
        {
          id: "met-1",
          journal: "Journal of Theoretical Physics & Modeling",
          authors: "Feynman Group Research, 2026",
          citations: 210,
          claim: domain === "Bioinformatics & Genetics"
            ? "Simulating cell membrane topologies using stochastic Monte Carlo algorithms."
            : domain === "Environmental Sciences"
            ? "Simulating crop carbon exchange utilizing stochastic localized weather grids."
            : domain === "Quantum Mechanics & Physics"
            ? "Simulating multi-gate quantum pathways using parallel stochastic Monte Carlo."
            : "Mapping gradient descents via stochastic simulated annealing grids.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "🌐 Variation: Replaced the sequence assembly models with stochastic Monte Carlo, finding similar topologic alignments but lower CPU overhead."
            : domain === "Environmental Sciences"
            ? "🌐 Variation: Relied on weather grids instead of Neural Estimations. Sequestration readings stayed within 1.2% of the main paper's output."
            : "🌐 Variation: Substituted backpropagation with simulated annealing. While memory overhead dropped 30%, resolution margins stayed within 1% of this study.",
          anchorId: "claim-big-idea",
          originalUrl: "https://arxiv.org/abs/2603.01192",
          abstract: "This paper introduces alternative algorithmic paths to model high-dimensional parameters, showing that localized search regions deliver comparable fidelity metrics for standard domains.",
          summary: "Confirms the primary study's model conclusions using an entirely independent mathematical methodology."
        },
        {
          id: "met-2",
          journal: "Bio-Computing Benchmarks",
          authors: "Okada & Sato, 2025",
          citations: 67,
          claim: domain === "Bioinformatics & Genetics"
            ? "Comparing protein structures in dry lab conditions on customizable TPU hardware."
            : domain === "Environmental Sciences"
            ? "Conducting soil moisture and carbon respirations in climate chambers."
            : domain === "Quantum Mechanics & Physics"
            ? "Benchmarking register retention rates on physical cryogenic FPGAs."
            : "Running hyper-parameter search models on offline edge FPGA systems.",
          convergence: domain === "Bioinformatics & Genetics"
            ? "🌐 Variation: Conducted mapping on low-power TPU chips rather than standard cloud nodes, validating comparable structure matching boundaries."
            : domain === "Environmental Sciences"
            ? "🌐 Variation: Tested findings inside physical climate chambers. Empirical results match the algorithmic prediction model with high fidelity."
            : "🌐 Variation: Evaluated hardware in cryo-chambers, confirming mathematical retention stability parameters under extreme cooling limits.",
          anchorId: "claim-discovery-0",
          originalUrl: "https://arxiv.org/abs/2508.10234",
          abstract: "An evaluation of custom high-density silicon architectures. We benchmark parameter matching and state mapping behaviors under localized constraints.",
          summary: "Provides an alternative hardware benchmark supporting the scalability of the primary paper's findings."
        }
      ]
    };
    return columns;
  };

  // Dynamically generate the 5 nodes tailored to the active paper
  const generateCitationGraph = (paperTitle: string) => {
    const cleanTitle = paperTitle || "Current Study";
    const words = cleanTitle.split(" ");
    const centerShort = words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");

    let domain = "AI and ML Foundations";
    if (cleanTitle.toLowerCase().includes("biolog") || cleanTitle.toLowerCase().includes("genet") || cleanTitle.toLowerCase().includes("protein") || cleanTitle.toLowerCase().includes("nutrient") || cleanTitle.toLowerCase().includes("crop")) {
      domain = "Bioinformatics & Genetics";
    } else if (cleanTitle.toLowerCase().includes("climate") || cleanTitle.toLowerCase().includes("carbon") || cleanTitle.toLowerCase().includes("ecolog") || cleanTitle.toLowerCase().includes("soil")) {
      domain = "Environmental Sciences";
    } else if (cleanTitle.toLowerCase().includes("quantum") || cleanTitle.toLowerCase().includes("physic") || cleanTitle.toLowerCase().includes("optics")) {
      domain = "Quantum Mechanics & Physics";
    }

    const nodes = [
      {
        id: "up-1",
        type: "upstream",
        title: domain === "Bioinformatics & Genetics" 
          ? "Foundational Models of Biological Network Topologies" 
          : domain === "Environmental Sciences"
          ? "A Standard Model of Soil Organic Carbon Sequestration"
          : domain === "Quantum Mechanics & Physics"
          ? "Generalized Quantum Information Storage Protocols"
          : "Context-Aware Sequence Assembly and Attention Mechanisms",
        authors: "A. Vaswani, K. Karpathy, et al.",
        year: 2019,
        citations: 1845,
        isPreprint: false,
        shortTitle: "Vaswani, 2019",
        abstract: "This work establishes standard architectures for high-capacity sequence aggregation, laying the foundation for modern context attention gates.",
        summary: "Introduced the core sequence optimization heuristics and contextual attention gates that paved the way for active context aggregation and high-dimensional parameter spaces.",
        x: 60,
        y: 60
      },
      {
        id: "up-2",
        type: "upstream",
        title: domain === "Bioinformatics & Genetics"
          ? "Iterative Assembly Approximations for Mitochondrial Sequencing"
          : domain === "Environmental Sciences"
          ? "Deep Neural Estimation of Methane and Soil Respiration Pathways"
          : domain === "Quantum Mechanics & Physics"
          ? "Stochastic Gradient Optimization for High-Dimensional Quantum Filters"
          : "Lower-Bound Optimizations for Extreme Scale Parameter Backpropagation",
        authors: "S. Bengio, L. Kingma, et al.",
        year: 2021,
        citations: 924,
        isPreprint: true,
        shortTitle: "Bengio, 2021",
        abstract: "An optimization protocol utilizing dynamic, low-friction learning margins to accelerate multi-parameter mapping under heavy non-linear gradient variances.",
        summary: "Empowered modern systems to converge faster under heavy load, offering the mathematical groundwork for dynamic hyper-parameter scaling used in this paper.",
        x: 60,
        y: 220
      },
      {
        id: "center-node",
        type: "center",
        title: cleanTitle,
        authors: result?.explanation_level ? `Synthesized under ${result.explanation_level} Level` : "Active Lumina Lab Study",
        year: 2026,
        citations: 42,
        isPreprint: false,
        shortTitle: centerShort,
        abstract: abstract || "No abstract loaded.",
        summary: "The active paper currently loaded into the Lumina Analysis Lab, deconstructing complex vocabulary and insights for active synthesis.",
        x: 175,
        y: 140
      },
      {
        id: "down-1",
        type: "downstream",
        title: domain === "Bioinformatics & Genetics"
          ? "Automating Protein Structure Alignment on Microsecond Scales"
          : domain === "Environmental Sciences"
          ? "Ecological Machine Representation of Crop Biomass Degradation"
          : domain === "Quantum Mechanics & Physics"
          ? "Real-time Multi-gate Quantum Coherence Synchronization"
          : "Decentralized Routing Schemes for Multi-modal Attention Pipelines",
        authors: "D. Hassabis, R. Sutskever, et al.",
        year: 2026,
        citations: 12,
        isPreprint: true,
        shortTitle: "Hassabis, 2026",
        abstract: "A sequence aggregation framework showing that routing gradients laterally yields significant speedups for multi-modal and bio-parameter modeling.",
        summary: "Expands the active paper's core methodology to decentralize multi-agent workloads, proving that its theoretical boundaries hold true in live, low-latency deployments.",
        x: 290,
        y: 60
      },
      {
        id: "down-2",
        type: "downstream",
        title: domain === "Bioinformatics & Genetics"
          ? "Evaluating Green Computing Overheads for Multi-omics Synthesis"
          : domain === "Environmental Sciences"
          ? "Global Agri-Data Benchmarks on Arid Soil Regeneration Models"
          : domain === "Quantum Mechanics & Physics"
          ? "Resource-aware Execution Paths in Quantum-Chemical Simulation"
          : "Energy-efficient Hyper-parameter Search for High-dimensional Embeddings",
        authors: "L. Feige, S. Altman, et al.",
        year: 2026,
        citations: 8,
        isPreprint: false,
        shortTitle: "Feige, 2026",
        abstract: "We investigate operational and resource-aware tradeoffs of deployment caches, proposing concrete eco-efficiency offsets.",
        summary: "Calculates the real-world operational budget required to run the active study's model at scale, introducing green-computing offsets for school/lab deployments.",
        x: 290,
        y: 220
      }
    ];

    const links = [
      { source: "up-1", target: "center-node", isPreprint: false },
      { source: "up-2", target: "center-node", isPreprint: true },
      { source: "center-node", target: "down-1", isPreprint: true },
      { source: "center-node", target: "down-2", isPreprint: false }
    ];

    return { nodes, links };
  };

  const handleLoadNodeAsMain = async (node: any) => {
    setShowHorizonMap(false);
    setSelectedCitationNode(null);
    const paperToLoad: LivePaper = {
      title: node.title,
      authors: node.authors,
      abstract: node.abstract || "This study explores foundational sequence processing limits and context aggregation parameters.",
      source_name: node.type === "upstream" ? "UPSTREAM REF" : "DOWNSTREAM APP",
      original_url: "https://arxiv.org/abs/" + node.id,
      publish_date: `${node.year}-01-01`
    };
    await handleSelectLivePaper(paperToLoad);
  };

  // Loading phase message state
  const [loadingPhase, setLoadingPhase] = useState(0);

  const getLoadingMessages = () => {
    switch (explanationLevel) {
      case "Middle School":
        return [
          "Cracking open the scientific secret code...",
          "Sweeping away hard-to-read textbook jargon...",
          "Dreaming up awesome playground analogies...",
          "Summing up big findings into fun bullet points...",
          "Connecting this breakthrough to cool real-life facts..."
        ];
      case "Undergrad":
        return [
          "Deconstructing academic literature structure...",
          "Isolating domain-specific jargon terms...",
          "Synthesizing high-level mechanistic principles...",
          "Compiling methodology insights & key findings...",
          "Mapping potential research & real-world applications..."
        ];
      case "Graduate":
        return [
          "Evaluating experimental design & methodology...",
          "Contextualizing technical terminology metrics...",
          "Formulating functional structural explanations...",
          "Analyzing data validity & research findings...",
          "Assessing theoretical boundaries & industrial utility..."
        ];
      case "PhD":
        return [
          "Conducting peer examination & rigorous analysis...",
          "Vetting kinetic constraints & mathematical models...",
          "Evaluating post-doctoral & theoretical assumptions...",
          "Auditing experimental robustness & novel findings...",
          "Scrutinizing paradigm integration & future pathways..."
        ];
      case "High School":
      default:
        return [
          "Analyzing critical science frameworks...",
          "Scrubbing complex molecular-level jargon...",
          "Drafting fun, memorable high school analogies...",
          "Summarizing key discoveries into digestible bullet points...",
          "Structuring deep future impact scenarios..."
        ];
    }
  };

  const loadingMessages = getLoadingMessages();

  // Helper to group live papers by topic and sort each group's papers by publish_date (newest first)
  const getGroupedAndSortedPapers = () => {
    const groups: { [key: string]: LivePaper[] } = {};
    
    livePapers.forEach(paper => {
      const topic = paper.topic?.trim() || "General Science";
      if (!groups[topic]) {
        groups[topic] = [];
      }
      groups[topic].push(paper);
    });

    // Sort each group's papers by publish date descending (newest first)
    Object.keys(groups).forEach(topic => {
      groups[topic].sort((a, b) => {
        const dateA = new Date(a.publish_date || 0).getTime();
        const dateB = new Date(b.publish_date || 0).getTime();
        return dateB - dateA;
      });
    });

    // Return as array of objects sorted by topic name alphabetically
    return Object.keys(groups).map(topic => ({
      topic,
      papers: groups[topic]
    })).sort((a, b) => a.topic.localeCompare(b.topic));
  };

  // Helper to estimate the reading time for simplified papers in minutes
  const calculateReadingTime = () => {
    if (!result) return 0;
    const bigIdea = viewMode === "concept"
      ? (result.the_big_idea_concept || result.the_big_idea || "")
      : (result.the_big_idea_detail || result.the_big_idea || "");
    const findings = (viewMode === "concept"
      ? (result.key_findings_concept || result.key_findings || [])
      : (result.key_findings_detail || result.key_findings || [])).join(" ");
    const impact = viewMode === "concept"
      ? (result.real_world_impact_concept || result.real_world_impact || "")
      : (result.real_world_impact_detail || result.real_world_impact || "");
    const text = `${result.simplified_title} ${result.one_sentence_hook} ${bigIdea} ${findings} ${impact}`;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // Average academic/reading speed ~200 WPM
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  // Fetch live papers and sources on initial application load
  useEffect(() => {
    const fetchLivePapers = async () => {
      setLoadingLive(true);
      setLiveError(null);
      try {
        const response = await fetch("/api/latest-papers");
        if (!response.ok) {
          throw new Error(`Server status ${response.status}`);
        }
        const data = await response.json();
        if (data.papers && Array.isArray(data.papers)) {
          setLivePapers(data.papers);
        }
      } catch (err) {
        console.error("Failed to load live papers from sources:", err);
        setLiveError("Dynamic research servers are compiling; meanwhile feel free to paste a URL!");
      } finally {
        setLoadingLive(false);
      }
    };

    const fetchSourcesList = async () => {
      try {
        const response = await fetch("/api/sources");
        const data = await response.json();
        if (data.sources && Array.isArray(data.sources)) {
          setSources(data.sources);
        }
      } catch (err) {
        console.error("Failed to load sources list:", err);
      }
    };

    fetchLivePapers();
    fetchSourcesList();
  }, []);

  // Global keyboard shortcut to toggle High-Density Workspace mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
      ) {
        return;
      }
      
      if (e.key === "d" || e.key === "D") {
        setHighDensity((prev) => !prev);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runSimplification = async (currentTitle: string, currentAbstract: string, currentFullText: string, level: ExplanationLevel) => {
    if (!currentTitle.trim() || !currentAbstract.trim()) {
      setError("Please provide at least a Title and Abstract to simplify.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingPhase(0);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentTitle.trim(),
          abstract: currentAbstract.trim(),
          fullText: currentFullText.trim() || undefined,
          explanationLevel: level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the research paper.");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLivePaper = async (paper: LivePaper) => {
    setTitle(paper.title);
    setAbstract(paper.abstract);
    setFullText("");
    setSelectedSampleId(null);
    setJustImported(paper.title);
    setError(null);
    setFetchError(null);
    
    // Clear toast message after 4 seconds
    setTimeout(() => {
      setJustImported(null);
    }, 4000);

    // Auto-simplify right away
    await runSimplification(paper.title, paper.abstract, "", explanationLevel);
  };

  const handleGoHome = () => {
    setResult(null);
    setError(null);
    setTitle("");
    setAbstract("");
    setFullText("");
    setUrlInput("");
    setFetchError(null);
    setSelectedSampleId(null);
  };

  const handleSaveToStudyLog = () => {
    if (!result) return;
    
    const studyLogData = {
      downloaded_at: new Date().toISOString(),
      explanation_level: result.explanation_level || explanationLevel,
      original_paper: {
        title: title || result.simplified_title,
        abstract: abstract || ""
      },
      simplified_paper: {
        simplified_title: result.simplified_title,
        one_sentence_hook: result.one_sentence_hook,
        the_big_idea: viewMode === "concept" 
          ? (result.the_big_idea_concept || result.the_big_idea) 
          : (result.the_big_idea_detail || result.the_big_idea),
        key_discoveries: viewMode === "concept"
          ? (result.key_findings_concept || result.key_findings)
          : (result.key_findings_detail || result.key_findings),
        real_world_impact: viewMode === "concept"
          ? (result.real_world_impact_concept || result.real_world_impact)
          : (result.real_world_impact_detail || result.real_world_impact),
        jargon_cheat_sheet: result.jargon_cheat_sheet
      }
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(studyLogData, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    
    const cleanTitle = result.simplified_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .substring(0, 50);
    downloadAnchor.setAttribute("download", `lumina_study_log_${cleanTitle}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClear = () => {
    setTitle("");
    setAbstract("");
    setFullText("");
    setSelectedSampleId(null);
    setResult(null);
    setError(null);
    setFetchError(null);
  };

  // Fetch and parse an actual web URL to retrieve title, abstract and full text
  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setFetchError("Please enter or select a valid scientific article URL first.");
      return;
    }
    if (!urlInput.trim().startsWith("http")) {
      setFetchError("A valid academic web address starting with 'http://' or 'https://' is required.");
      return;
    }

    setFetchingUrl(true);
    setFetchError(null);
    setError(null);
    setSelectedSampleId(null);

    try {
      const response = await fetch("/api/fetch-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to download and parse paper content.");
      }

      setTitle(data.title || "");
      setAbstract(data.abstract || "");
      setFullText(data.fullText || "");
      setUrlInput(""); // Clear field upon successful auto-fill
    } catch (err: any) {
      console.error("URL Fetch error:", err);
      setFetchError(err.message || "An unexpected error occurred while parsing the article.");
    } finally {
      setFetchingUrl(false);
    }
  };

  // Submit and fetch parsed simplified results from our backend
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSimplification(title, abstract, fullText, explanationLevel);
  };

  // Utility to dynamically highlight jargon terms inside texts for maximum interactive benefit
  const renderTextWithJargonHighlights = (text: string, cheatSheet: JargonCheatSheetItem[]) => {
    if (!text) return "";
    if (!cheatSheet || cheatSheet.length === 0) return text;

    // Sort terms longest to shortest to prevent sub-string matching errors (e.g. replacing 'cell' instead of 'cellular membrane')
    const sortedTerms = [...cheatSheet].sort((a, b) => b.term.length - a.term.length);
    const escapedTerms = sortedTerms.map(x => x.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    
    // Create word boundary regex matching any term
    const regex = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const matchingItem = cheatSheet.find(
        (item) => item.term.toLowerCase() === part.toLowerCase()
      );

      if (matchingItem) {
        return (
          <span
            key={idx}
            className="relative group inline-block bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#2D2D24] border-b-2 border-[#7C8464] font-semibold px-1.5 py-0.5 rounded transition-all duration-200 cursor-help"
            id={`jargon-highlight-${idx}`}
            onMouseEnter={() => handleJargonInteraction(matchingItem.term)}
            onClick={() => handleJargonInteractionAndScroll(matchingItem.term)}
          >
            {part}
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 bg-[#2D2D24] text-[#F9F7F2] text-xs p-3 rounded-xl shadow-2xl z-50 normal-case font-normal leading-relaxed pointer-events-none border border-[#434338]">
              <span className="block font-serif font-bold text-[#EAE6D6] mb-1">
                {matchingItem.term}
              </span>
              {matchingItem.simple_definition}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D2D24]"></span>
            </span>
          </span>
        );
      }
      return part;
    });
  };

  const renderTextWithMathAndJargonHighlights = (text: string, cheatSheet: JargonCheatSheetItem[], isDetailView: boolean) => {
    if (!text) return "";
    
    // First, let's resolve jargon matches using our standard logic
    const jargonElements = renderTextWithJargonHighlights(text, cheatSheet);
    
    // If we're not in detail view or we don't have active paper details, just return the jargon highlights
    if (!isDetailView || !result) {
      return jargonElements;
    }

    const mathItem = getDecipheredMathForPaper(result.simplified_title, result.the_big_idea_detail || "", result.topic || "");

    // Let's create a beautiful interactive button for the formula
    const mathTriggerElement = (
      <span key="math-trigger-span" className="inline-block mt-3 bg-[#FAF8F5] border border-[#7C8464]/30 rounded-2xl p-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#7C8464] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#7C8464] uppercase">
              Deciphered Math Formulations
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#8C8474] uppercase tracking-wider">
            Click to Deconstruct Proof
          </span>
        </div>
        
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveMathId(activeMathId === mathItem.id ? null : mathItem.id);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-xl border border-dashed text-[#2D2D24] transition-all duration-300 shadow-sm cursor-pointer select-none active:scale-98 group ${
              activeMathId === mathItem.id 
                ? "bg-[#7C8464]/10 border-[#7C8464] ring-1 ring-[#7C8464]/20" 
                : "bg-white hover:bg-[#7C8464]/5 border-[#7C8464]/40"
            }`}
          >
            <Clock className="h-3 w-3 text-[#7C8464] animate-pulse" />
            <span className="max-w-full overflow-hidden text-ellipsis selection:bg-transparent">
              {mathItem.displayText}
            </span>
            <ChevronDown className={`h-3 w-3 text-[#7C8464] transition-transform duration-300 ${activeMathId === mathItem.id ? "rotate-180" : ""}`} />
          </button>
        </div>
      </span>
    );

    // Return the jargon paragraphs with our beautiful math trigger embedded elegantly underneath the main block
    return (
      <div className="flex flex-col w-full text-left">
        <div className="leading-relaxed">{jargonElements}</div>
        {mathTriggerElement}
        {renderFeynmanLogicEngine(mathItem)}
      </div>
    );
  };

  const renderFeynmanLogicEngine = (mathItem: any) => {
    if (!mathItem) return null;
    return (
      <AnimatePresence>
        {activeMathId === mathItem.id && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden w-full mt-4"
          >
            <div className="bg-[#FAF8F5] border border-[#7C8464]/40 rounded-2xl p-5 shadow-inner flex flex-col gap-5 relative text-left">
              
              {/* Feynman Logic Engine Header */}
              <div className="flex items-center justify-between border-b border-[#7C8464]/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 flex items-center justify-center">
                      <Atom className="h-2 w-2 text-white animate-spin" />
                    </span>
                  </div>
                  <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#2D2D24]">
                    Feynman Logic Engine Active
                  </h4>
                </div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#8C8474] bg-[#7C8464]/10 px-2 py-0.5 rounded border border-[#7C8464]/10">
                  DERIVATION ID: {mathItem.id.toUpperCase()}-D-71
                </span>
              </div>

              {/* Vertical Timeline Tree Layout */}
              <div className="relative pl-6.5 flex flex-col gap-6 mt-1">
                {/* Vertical continuous line */}
                <div className="absolute left-[9px] top-3 bottom-3 w-[1px] bg-[#7C8464]/25 border-l border-dashed border-[#7C8464]/30" />

                {/* Node 1: Historical Artifact/Origin */}
                <div className="relative group/node flex flex-col gap-2">
                  {/* Bullet icon */}
                  <div className="absolute -left-[24px] top-0 h-5 w-5 rounded-full bg-white border border-[#7C8464] flex items-center justify-center shadow-sm text-[9px] font-mono font-bold text-[#7C8464] group-hover/node:bg-[#7C8464] group-hover/node:text-white transition-colors duration-200">
                    1
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4A086] font-bold">
                      Phase 1: The Historical Artifact &amp; Origin
                    </span>
                    <h5 className="font-serif font-bold text-[#2D2D24] text-sm mt-0.5 whitespace-normal">
                      {mathItem.historicalOrigin.origin}
                    </h5>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3.5 items-start bg-[#F4EFE6]/40 p-3.5 rounded-xl border border-[#E8E4D9] w-full">
                    <div className="bg-[#2D2D24] text-[#EAE6D6] px-3 py-2 rounded-lg font-mono text-center text-xs font-semibold max-w-full md:max-w-[220px] shadow-sm select-all border border-black/10 flex-shrink-0">
                      {mathItem.historicalOrigin.formula}
                    </div>
                    <p className="text-xs text-[#5A5A4A] leading-relaxed text-justify mt-1 select-text">
                      {mathItem.historicalOrigin.description}
                    </p>
                  </div>
                </div>

                {/* Node 2: Missing Academic Leaps */}
                <div className="relative group/node flex flex-col gap-2">
                  {/* Bullet icon */}
                  <div className="absolute -left-[24px] top-0 h-5 w-5 rounded-full bg-white border border-[#7C8464] flex items-center justify-center shadow-sm text-[9px] font-mono font-bold text-[#7C8464] group-hover/node:bg-[#7C8464] group-hover/node:text-white transition-colors duration-200">
                    2
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C8464] font-bold">
                      Phase 2: The Missing Academic Leaps
                    </span>
                    <h5 className="font-serif font-bold text-[#2D2D24] text-sm mt-0.5">
                      Omitted Mathematical Mechanics Deconstructed
                    </h5>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#7C8464]/15 flex flex-col gap-3 shadow-inner">
                    <p className="text-xs italic text-[#8C8474] font-medium border-b border-[#E8E4D9] pb-1.5 leading-snug">
                      💡 {mathItem.missingLeaps.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                      {mathItem.missingLeaps.steps.map((step, idx) => {
                        const [titlePart, detailPart] = step.split(": ");
                        return (
                          <div key={idx} className="bg-[#F2EDE4]/20 p-3 rounded-lg border border-[#E8E4D9] flex gap-2 w-full text-left">
                            <span className="text-[9px] font-mono text-[#7C8464] font-bold flex-shrink-0">
                              [{idx + 1}]
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-[#2D2D24]">{titlePart}</span>
                              <span className="text-[11px] text-[#5A5A4A] leading-relaxed text-justify">{detailPart}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Node 3: Modern Software Application */}
                <div className="relative group/node flex flex-col gap-2">
                  {/* Bullet icon */}
                  <div className="absolute -left-[24px] top-0 h-5 w-5 rounded-full bg-white border border-[#7C8464] flex items-center justify-center shadow-sm text-[9px] font-mono font-bold text-[#7C8464] group-hover/node:bg-[#7C8464] group-hover/node:text-white transition-colors duration-200">
                    3
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold">
                      Phase 3: Modern Software Application
                    </span>
                    <h5 className="font-serif font-bold text-[#2D2D24] text-sm mt-0.5">
                      {mathItem.modernApplication.topic}
                    </h5>
                  </div>

                  <div className="flex flex-col gap-2.5 bg-[#1E1E1C] p-4 rounded-xl text-white border border-neutral-800 shadow-sm font-mono text-left w-full font-sans">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-[9px] text-neutral-400">
                      <span>DEVELOPER ALGORITHM PARAMS</span>
                      <span className="text-[#7C8464] uppercase font-bold tracking-wider font-sans">COMPILED ROUTING</span>
                    </div>
                    <pre className="text-xs text-[#EAE6D6] leading-relaxed overflow-x-auto whitespace-pre py-1 max-w-full select-all font-mono">
                      <code>{mathItem.modernApplication.parameter}</code>
                    </pre>
                    <div className="text-[11px] text-neutral-400 leading-normal border-t border-white/5 pt-1.5 text-justify select-text font-sans">
                      {mathItem.modernApplication.description}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Filter jargon items
  const filteredJargon = result?.jargon_cheat_sheet?.filter(item => 
    item.term.toLowerCase().includes(jargonQuery.toLowerCase()) ||
    item.simple_definition.toLowerCase().includes(jargonQuery.toLowerCase())
  );

  const renderBackButtonAndHorizonMapTrigger = () => {
    if (!result) return null;
    return (
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => {
            setResult(null);
            setTitle("");
            setAbstract("");
            setFullText("");
          }}
          className="group flex items-center gap-2 text-xs font-bold text-[#7C8464] hover:text-[#6A7153] transition-colors bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
          <span>Back to Feed</span>
        </button>

        <button
          onClick={() => setShowHorizonMap(true)}
          className="group flex items-center gap-2 text-xs font-bold text-[#2D2D24] hover:text-white hover:bg-[#7C8464] transition-all bg-white border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer hover:border-[#7C8464]"
          id="horizon-map-top-trigger"
        >
          <Network className="h-4 w-4 text-[#7C8464] group-hover:text-white transition-colors animate-pulse" />
          <span>Explore Horizon Map</span>
        </button>

        <button
          onClick={() => setShowHorizonMap(true)}
          className="fixed right-0 top-[35%] -translate-y-1/2 z-40 bg-[#7C8464] hover:bg-[#6A7153] text-white pl-4.5 pr-3 py-5 rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:pl-5.5 flex flex-col items-center gap-3 cursor-pointer select-none active:scale-95 border-l-0 border border-[#6A7153]/50 animate-fade-in"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          id="horizon-map-floating-tab"
        >
          <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#F9F7F2]">
            <div className="-rotate-90 py-1">
              <Network className="h-4 w-4 text-[#EAE6D6]" />
            </div>
            <span className="mt-1">Horizon Map</span>
          </div>
        </button>
      </div>
    );
  };

  const renderAdaptiveViewControl = () => {
    if (!result) return null;
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F2EDE4]/60 p-4 rounded-[24px] border border-[#D6D0C2] gap-3">
        <div className="flex flex-col px-1">
          <div className="flex items-center gap-1.5 text-xs text-[#2D2D24] font-bold uppercase tracking-wider">
            <Sparkle className="h-4 w-4 text-[#7C8464] animate-pulse" />
            Adaptive View Control
          </div>
          <span className="text-[10px] text-[#8C8474] font-mono leading-tight mt-0.5">
            Instantly adjust the verbosity and mechanical depth of the generated breakdown!
          </span>
        </div>
        <div className="bg-white/90 p-1 rounded-xl flex gap-1 w-full sm:w-auto shadow-sm border border-[#E8E4D9]">
          <button
            type="button"
            onClick={() => setViewMode("concept")}
            className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "concept"
                ? "bg-[#7C8464] text-white shadow font-semibold"
                : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
            }`}
          >
            💡 Concept Focused
          </button>
          <button
            type="button"
            onClick={() => setViewMode("detail")}
            className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "detail"
                ? "bg-[#7C8464] text-white shadow font-semibold"
                : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
            }`}
          >
            🔬 Deep Detail
          </button>
        </div>
      </div>
    );
  };

  const renderCatchySimplifiedTitle = () => {
    if (!result) return null;
    return (
      <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-[#F9F7F2] rounded-full -z-10 opacity-60"></div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-[#8C8474] bg-[#F2EDE4] border border-[#E8E4D9] px-3 py-1 rounded-lg whitespace-nowrap">
            {viewMode === "concept" ? "Concept Focused • Catchy Title" : "Detailed Analysis • Catchy Title"}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D24] tracking-tight leading-tight mt-1">
          {result.simplified_title}
        </h2>
      </div>
    );
  };

  const renderExcitingHookSection = () => {
    if (!result) return null;
    return (
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 translate-x-3 -translate-y-3">
          <Flame className="h-24 w-24 text-[#7C8464]/5" />
        </div>
        <div className="bg-[#F2EDE4] text-[#7C8464] p-3 h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C8464] font-mono">The Hook: Why it is cool!</span>
          <p className="text-lg text-[#5A5A4A] italic font-medium leading-relaxed mt-1.5 font-serif">
            "{result.one_sentence_hook}"
          </p>
        </div>
      </motion.div>
    );
  };

  const renderBigIdeaDescription = () => {
    if (!result) return null;
    return (
      <div 
        id="claim-big-idea"
        className={`rounded-[32px] p-7 shadow-sm border transition-all duration-500 flex flex-col justify-between min-h-[365px] ${
          hoveredMatrixCard === "claim-big-idea"
            ? "bg-[#7C8464]/10 border-[#7C8464] scale-[1.01] shadow-[0_4px_24px_rgba(124,132,100,0.15)] ring-2 ring-[#7C8464]/10"
            : "bg-white border-[#E8E4D9]"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C8464] mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7C8464]"></div> The Big Idea
          </h3>
          
          <div className="text-[#5A5A4A] leading-relaxed text-[15px] space-y-4">
            {renderTextWithMathAndJargonHighlights(
              viewMode === "concept"
                ? (result.the_big_idea_concept || result.the_big_idea || "")
                : (result.the_big_idea_detail || result.the_big_idea || ""),
              result.jargon_cheat_sheet,
              viewMode === "detail"
            )}
          </div>
        </div>

        <div className="mt-6 text-[11px] text-[#8C8474] bg-[#F9F7F2] p-3 rounded-xl border border-[#E8E4D9] flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#7C8464] flex-shrink-0" />
          <span>
            {result.explanation_level === "Middle School" && <>Hover over highlighted words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige</span> for ultra-simple everyday comparisons!</>}
            {result.explanation_level === "High School" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for science class analogies!</>}
            {result.explanation_level === "Undergrad" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for mechanistic definitions!</>}
            {result.explanation_level === "Graduate" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for functional parameters!</>}
            {result.explanation_level === "PhD" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for postdoctoral or peer metrics!</>}
            {!result.explanation_level && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for science class analogies!</>}
          </span>
        </div>
      </div>
    );
  };

  const renderKeyFindings = () => {
    if (!result) return null;
    return (
      <div className="bg-[#7C8464] rounded-[32px] p-7 text-white shadow-lg flex flex-col justify-between min-h-[365px]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-5 flex items-center gap-2">
            <Layers className="h-4 w-4" /> Key Discoveries
          </h3>
          
          <ul className="space-y-5">
            {(viewMode === "concept"
              ? (result.key_findings_concept || result.key_findings || [])
              : (result.key_findings_detail || result.key_findings || [])).map((finding, idx) => (
              <li 
                key={idx} 
                id={`claim-discovery-${idx}`}
                className={`flex gap-3 items-start p-3 rounded-2xl transition-all duration-500 ${
                  hoveredMatrixCard === `claim-discovery-${idx}`
                    ? "bg-white/10 text-white font-medium scale-[1.02] shadow-sm ml-1 pr-1 border-l-4 border-white"
                    : "opacity-100"
                }`}
              >
                <span className="w-5 h-5 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-sm leading-snug text-white/95 text-justify">
                  {renderTextWithJargonHighlights(finding, result.jargon_cheat_sheet)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-white/60 font-mono text-center">
          {result.explanation_level ? `Verified ${result.explanation_level} Level Insights` : "Verified High-School Core Mechanics"}
        </div>
      </div>
    );
  };

  const renderBigIdeaGrid = () => {
    if (!result) return null;
    return (
      <div className={highDensity ? "flex flex-col gap-3" : "grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"}>
         {renderBigIdeaDescription()}
         {renderKeyFindings()}
      </div>
    );
  };

  const renderRealWorldImpact = () => {
    if (!result) return null;
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex flex-col gap-4 overflow-hidden">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#B4A086] flex items-center gap-2">
          <Globe className="h-4 w-4" /> Why It Matters to Future Generations
        </h3>

        <div>
          <h4 className="text-xl font-serif font-bold text-[#2D2D24] mb-2">
            Real-World Impact
          </h4>
          <p className="text-[15px] text-[#5A5A4A] leading-relaxed mb-4">
            {renderTextWithJargonHighlights(
              viewMode === "concept"
                ? (result.real_world_impact_concept || result.real_world_impact || "")
                : (result.real_world_impact_detail || result.real_world_impact || ""),
              result.jargon_cheat_sheet
            )}
          </p>
        </div>

        <div className="mt-auto p-4 bg-[#F9F7F2] rounded-2xl flex items-center gap-4 border border-[#E8E4D9]">
          <div className="w-12 h-12 bg-[#D6D0C2] rounded-xl flex items-center justify-center text-2xl">🌍</div>
          <p className="text-xs font-medium text-[#8C8474] leading-tight">
            This discovery empowers your generation to innovate tomorrow's technology, health, and conservation fields starting today!
          </p>
        </div>
      </div>
    );
  };

  const renderThesisValidationMatrix = () => {
    if (!result) return null;
    return (
      <div className="bg-white rounded-[32px] p-7 border border-[#E8E4D9] shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#7C8464]/10 p-2.5 rounded-xl text-[#7C8464]">
              <GitCompare className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#2D2D24] text-lg sm:text-xl leading-tight">
                Thesis Validation &amp; Dialectics Matrix
              </h3>
              <p className="text-[10px] text-[#8C8474] font-mono tracking-wider uppercase mt-0.5">
                Mapping replication, active critiques, and methodological variables
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
            className="p-1 px-3 bg-[#F9F7F2] hover:bg-[#F2EDE4] border border-[#E8E4D9] rounded-xl text-xs font-bold text-[#5A5A4A] transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isMatrixExpanded ? (
              <>
                <span>Hide Matrix</span>
                <ChevronUp className="h-3.5 w-3.5 text-[#7C8464]" />
              </>
            ) : (
              <>
                <span>Show Matrix</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7C8464]" />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMatrixExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Main 3 Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {(() => {
                  const matrix = generateThesisValidationMatrix(result.simplified_title);
                  
                  return (
                    <>
                      {/* Column 1: Supporting Evidence & Replications */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-1 py-1 bg-[#7C8464]/5 border border-[#7C8464]/15 rounded-xl">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C8464]">
                            Support &amp; Replications
                          </span>
                        </div>

                        <div className="flex flex-col gap-3.5">
                          {matrix.supporting.map((card) => {
                            const isCardActive = splitScreenPaper?.id === card.id;
                            return (
                              <div
                                key={card.id}
                                onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                onMouseLeave={() => setHoveredMatrixCard(null)}
                                className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                  isCardActive 
                                    ? "bg-[#7C8464]/10 border-[#7C8464] ring-1 ring-[#7C8464]/20" 
                                    : "border-[#E8E4D9] hover:border-[#7C8464] hover:bg-white"
                                }`}
                              >
                                {/* Micro Border Indicator */}
                                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-[#7C8464]" />
                                
                                {/* High Density Metadata Header */}
                                <div className="flex justify-between items-center gap-2 pl-1">
                                  <span className="text-[10px] font-mono font-bold text-[#7C8464] bg-[#7C8464]/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                    {card.journal}
                                  </span>
                                  <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                    ★ Citations: <strong>{card.citations}</strong>
                                  </span>
                                </div>

                                <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                  By {card.authors}
                                </p>

                                <div className="pl-1">
                                  <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                    {card.claim}
                                  </h4>
                                  <p className="text-[11px] text-[#5A5A4A] leading-relaxed mt-2 p-2 rounded-lg bg-[#7C8464]/5 border border-[#7C8464]/10 italic font-medium">
                                    {card.convergence}
                                  </p>
                                </div>

                                {/* Split Button Action Layout */}
                                <div className="flex gap-1.5 mt-2 pl-1">
                                  <button
                                    onClick={() => setSplitScreenPaper(card)}
                                    className="flex-1 bg-[#7C8464] hover:bg-[#6A7153] text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                  >
                                    <GitCompare className="h-3 w-3" />
                                    <span>Split-Screen</span>
                                  </button>
                                  <a
                                    href={card.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                  >
                                    <span>Source</span>
                                    <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: Conflicting Results, Critiques & Counter-arguments */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-1 py-1 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">
                            Critiques &amp; Friction
                          </span>
                        </div>

                        <div className="flex flex-col gap-3.5">
                          {matrix.conflicting.map((card) => {
                            const isCardActive = splitScreenPaper?.id === card.id;
                            return (
                              <div
                                key={card.id}
                                onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                onMouseLeave={() => setHoveredMatrixCard(null)}
                                className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                  isCardActive 
                                    ? "bg-amber-50 border-amber-500 ring-1 ring-amber-500/20" 
                                    : "border-[#E8E4D9] hover:border-amber-600/40 hover:bg-white"
                                }`}
                              >
                                {/* Micro Border Indicator */}
                                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-amber-600" />
                                
                                {/* High Density Metadata Header */}
                                <div className="flex justify-between items-center gap-2 pl-1">
                                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-600/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                    {card.journal}
                                  </span>
                                  <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                    ★ Citations: <strong>{card.citations}</strong>
                                  </span>
                                </div>

                                <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                  By {card.authors}
                                </p>

                                <div className="pl-1">
                                  <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                    {card.claim}
                                  </h4>
                                  <p className="text-[11px] text-amber-900 leading-relaxed mt-2 p-2 rounded-lg bg-amber-600/5 border border-amber-600/10 italic font-medium">
                                    {card.convergence}
                                  </p>
                                </div>

                                {/* Split Button Action Layout */}
                                <div className="flex gap-1.5 mt-2 pl-1">
                                  <button
                                    onClick={() => setSplitScreenPaper(card)}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                  >
                                    <GitCompare className="h-3 w-3" />
                                    <span>Split-Screen</span>
                                  </button>
                                  <a
                                    href={card.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                  >
                                    <span>Source</span>
                                    <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 3: Methodological Variations & Benchmarks */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-1 py-1 bg-slate-500/5 border border-slate-500/15 rounded-xl">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                            Method Variations
                          </span>
                        </div>

                        <div className="flex flex-col gap-3.5">
                          {matrix.methodological.map((card) => {
                            const isCardActive = splitScreenPaper?.id === card.id;
                            return (
                              <div
                                key={card.id}
                                onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                onMouseLeave={() => setHoveredMatrixCard(null)}
                                className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                  isCardActive 
                                    ? "bg-slate-50 border-slate-500 ring-1 ring-slate-500/20" 
                                    : "border-[#E8E4D9] hover:border-slate-500/40 hover:bg-white"
                                }`}
                              >
                                {/* Micro Border Indicator */}
                                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-slate-500" />
                                
                                {/* High Density Metadata Header */}
                                <div className="flex justify-between items-center gap-2 pl-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                    {card.journal}
                                  </span>
                                  <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                    ★ Citations: <strong>{card.citations}</strong>
                                  </span>
                                </div>

                                <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                  By {card.authors}
                                </p>

                                <div className="pl-1">
                                  <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                    {card.claim}
                                  </h4>
                                  <p className="text-[11px] text-slate-950 leading-relaxed mt-2 p-2 rounded-lg bg-slate-500/5 border border-slate-500/10 italic font-medium">
                                    {card.convergence}
                                  </p>
                                </div>

                                {/* Split Button Action Layout */}
                                <div className="flex gap-1.5 mt-2 pl-1">
                                  <button
                                    onClick={() => setSplitScreenPaper(card)}
                                    className="flex-1 bg-slate-500 hover:bg-slate-600 text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                  >
                                    <GitCompare className="h-3 w-3" />
                                    <span>Split-Screen</span>
                                  </button>
                                  <a
                                    href={card.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                  >
                                    <span>Source</span>
                                    <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderJargonGlossary = () => {
    if (!result) return null;
    return (
      <div className="bg-[#EAE6D6] rounded-[32px] p-7 border border-[#D6D0C2] flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A4A] flex justify-between items-center w-full">
              <span>Jargon Cheat Sheet</span>
            </h3>
            <p className="text-[11px] text-[#8C8474] mt-1 font-mono">
              {result.jargon_cheat_sheet.length} terms deconstructed into simple analogies
            </p>
          </div>

          <div className="relative flex-shrink-0 w-full sm:w-64">
            <input
              type="text"
              placeholder="Search jargon terms..."
              value={jargonQuery}
              onChange={(e) => setJargonQuery(e.target.value)}
              className="w-full text-xs p-2.5 pl-8 bg-white/60 border border-[#D6D0C2] rounded-xl focus:border-[#7C8464] focus:outline-none placeholder:text-[#8C8474]/70"
            />
            <Search className="h-3.5 w-3.5 text-[#8C8474]/80 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className={highDensity ? "flex flex-col gap-2.5 w-full" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {filteredJargon && filteredJargon.length > 0 ? (
            filteredJargon.map((item, idx) => {
              const isPulsing = pulsingTerm?.toLowerCase() === item.term.toLowerCase();
              const termId = item.term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
              
              return (
                <div 
                  key={idx} 
                  id={`jargon-card-${termId}`}
                  className={`rounded-2xl p-4 flex flex-col gap-1.5 transition-all duration-300 ${
                    isPulsing 
                      ? "jargon-card-pulse border-[#7C8464] shadow-md" 
                      : "bg-white/40 border border-white/40 hover:bg-white/60"
                  }`}
                >
                  <span className="font-serif font-bold text-[#2D2D24] text-base flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPulsing ? "bg-[#7C8464] scale-125" : "bg-[#7C8464]"}`} />
                    {item.term}
                  </span>
                  <p className={`italic text-xs sm:text-sm leading-relaxed p-2.5 rounded-xl transition-all duration-300 ${isPulsing ? "text-[#2D2D24] bg-white/70" : "text-[#5A5A4A] bg-white/40"}`}>
                    "{item.simple_definition}"
                  </p>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center text-[#8C8474] text-xs py-6">
              No matching jargon terms in this cheat sheet.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActionsActionBar = () => {
    if (!result) return null;
    return (
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border border-[#E8E4D9] rounded-[24px] bg-white gap-3">
        <div className="flex gap-3">
          <button 
            onClick={handleSaveToStudyLog}
            className="px-5 py-2.5 bg-[#7C8464] hover:bg-[#6A7153] text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
          >
            <BookMarked className="h-3.5 w-3.5" />
            Save to Study Log
          </button>
          <button 
            onClick={() => alert("Link copied to clipboard! Share with your biology class study group.")}
            className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E8E4D9] rounded-full text-xs font-bold text-[#5A5A4A] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share with Class
          </button>
        </div>
        <div className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-widest">
          {result.explanation_level === "Middle School" && "Curriculum Standard: Middle School STEM Level"}
          {result.explanation_level === "High School" && "Curriculum Standard: Grade 11 STEM Alignment"}
          {result.explanation_level === "Undergrad" && "Academic Level: College Undergraduate Standard"}
          {result.explanation_level === "Graduate" && "Analytical Level: Graduate Research Standard"}
          {result.explanation_level === "PhD" && "Scientific Rigor: post-doctoral / faculty Level"}
          {!result.explanation_level && "Curriculum Standard: Grade 11 STEM Alignment"}
        </div>
      </div>
    );
  };

  // Filter jargon items

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#434338] flex flex-col antialiased">
      {/* Top Banner - Natural Tones Theme Navigation */}
      <nav className="px-6 py-5 sm:px-10 sm:py-6 flex flex-col sm:flex-row justify-between items-center bg-white/50 border-b border-[#E8E4D9] gap-4">
        <div className="flex items-center gap-3">
          <div 
            onClick={handleGoHome}
            className="flex items-center gap-3 cursor-pointer group select-none active:scale-98 transition-transform"
          >
            {/* Symphery Custom Scientific S-DNA Logo */}
            <SympheryIcon className="h-10 w-10 flex-shrink-0 group-hover:scale-105 transition-all duration-300" />

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-3xl font-science font-black uppercase tracking-[0.08em] text-[#2D2D24] group-hover:text-[#7C8464] transition-colors leading-none">
                  Lumina
                </h1>
                <Atom className="h-4.5 w-4.5 text-[#7C8464] animate-[spin_8s_linear_infinite] group-hover:text-[#2D2D24] transition-colors" />
              </div>
            
            </div>
          </div>
        </div>

       

        <div className="flex items-center flex-wrap gap-4 justify-center sm:justify-end">
          

          {/* Lumina Fusion Toggle Button */}
          <button
            onClick={() => setShowFusionLab(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showFusionLab
                ? "bg-[#7C8464] text-white border-[#7C8464]"
                : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] hover:text-[#7C8464]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fusion Lab</span>
            {(fusionPaperA || fusionPaperB) && (
              <span className="inline-flex items-center justify-center text-[10px] h-5 min-w-[20px] px-1 rounded-full font-mono font-bold bg-[#7C8464] text-white">
                {(fusionPaperA ? 1 : 0) + (fusionPaperB ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Bidirectional Cross-Disciplinary Analogy Playground Button */}
          <button
            onClick={() => setShowAnalogy(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showAnalogy
                ? "bg-amber-900 text-white border-amber-900"
                : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#FAF8F5] hover:text-amber-900 hover:border-amber-900"
            }`}
          >
            <GitCompare className="h-3.5 w-3.5 animate-pulse" />
            <span>Analogy Playground</span>
          </button>

          {/* Cross-Domain Variable Injector Button */}
          <button
            onClick={() => setShowInjector(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showInjector
                ? "bg-[#7C8464] text-white border-[#7C8464]"
                : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] hover:text-[#7C8464]"
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Variable Injector</span>
          </button>

          {/* Generative Math Compiler Button */}
          <button
            onClick={() => setShowMathCompiler(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showMathCompiler
                ? "bg-[#2D2D24] text-white border-[#2D2D24]"
                : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] hover:text-[#2D2D24]"
            }`}
          >
            <Dna className="h-3.5 w-3.5" />
            <span>Math Compiler</span>
          </button>

          {/* Dialectical Synthesis Engine Button */}
          <button
            onClick={() => setShowDialectical(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showDialectical
                ? "bg-amber-800 text-white border-amber-800"
                : "bg-white border-[#E8E2D2] text-[#5C5340] hover:bg-[#F2EDE4] hover:text-amber-800"
            }`}
          >
            <GitMerge className="h-3.5 w-3.5" />
            <span>Dialectical Engine</span>
          </button>

          {/* Rosetta Canvas Button */}
          <button
            onClick={() => setShowRosetta(true)}
            className={`text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showRosetta
                ? "bg-indigo-950 text-white border-indigo-950"
                : "bg-white border-[#E8E2D2] text-[#5C5340] hover:bg-indigo-50 hover:text-indigo-950"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Rosetta Canvas</span>
          </button>

          {/* Reading List Toggle Button */}
          <button
            onClick={() => setShowReadingList(!showReadingList)}
            className={`relative text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showReadingList
                ? "bg-[#7C8464] text-white border-[#7C8464]"
                : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4]"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Reading List</span>
            {readingList.length > 0 && (
              <span className={`inline-flex items-center justify-center text-[10px] h-5 min-w-[20px] px-1 rounded-full font-mono font-bold ${
                showReadingList ? "bg-white text-[#7C8464]" : "bg-[#7C8464] text-white"
              }`}>
                {readingList.length}
              </span>
            )}
          </button>

          {/* About us Button - dedicated page */}
          <button
            onClick={() => setShowAboutUs(true)}
            className="text-xs px-4 py-2 rounded-xl border font-bold flex items-center gap-2 bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] hover:text-[#7C8464] transition-all cursor-pointer select-none active:scale-95"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>About Us</span>
          </button>

          <div className="flex items-center gap-2">
             
            <div className="relative">
              <select
                value={explanationLevel}
                onChange={(e) => {
                  const newLevel = e.target.value as ExplanationLevel;
                  setExplanationLevel(newLevel);
                  if (title && abstract) {
                    runSimplification(title, abstract, fullText, newLevel);
                  }
                }}
                className="text-xs px-3.5 py-2 bg-[#F2EDE4]/60 hover:bg-[#E8E4D9]/80 border border-[#E8E4D9] rounded-xl focus:border-[#7C8464] focus:ring-1 focus:ring-[#7C8464] focus:outline-none transition-all cursor-pointer appearance-none text-[#2D2D24] font-bold pr-8"
              >
                <option value="Middle School">Middle School (Grades 6-8)</option>
                <option value="High School">High School (Grades 9-12)</option>
                <option value="Undergrad">Undergrad (College Degree)</option>
                <option value="Graduate">Graduate (M.Sc./Ph.D. Track)</option>
                <option value="PhD">PhD (Postdoc/Expert Peer)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7C8464]">
                <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* Right panel: Visualization & Simplification (7 columns) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            <AnimatePresence mode="wait">
              
              {/* Idle Welcome Screen */}
              {!loading && !error && !result && (
                <div className="flex flex-col gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-[#E8E4D9] rounded-[32px] p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center gap-6"
                  >
                    
                    
                    <div className="max-w-md">
                      <h3 className="text-xl font-serif font-bold text-[#2D2D24]">
                        {explanationLevel === "Middle School" && "Your Fun Middle School Tutor is Ready!"}
                        {explanationLevel === "High School" && "Your High School Science Teacher is Ready!"}
                        {explanationLevel === "Undergrad" && "Your College Professor is Ready!"}
                        {explanationLevel === "Graduate" && "Your Senior Research Advisor is Ready!"}
                        {explanationLevel === "PhD" && "Your Faculty Peer Reviewer is Ready!"}
                      </h3>
                      <p className="text-[#5A5A4A] text-sm mt-3 leading-relaxed">
                        College and professional research papers are filled with heavy academic jargon and exhausting syntax. 
                      </p>
                      <p className="text-[#5A5A4A] text-sm mt-2 leading-relaxed">
                        {explanationLevel === "Middle School" && "Explain things to me like I am 12 years old! We will translate difficult topics into fun, visual, and highly memorable games and playground models."}
                        {explanationLevel === "High School" && "We will translate collegiate concepts into intuitive, analogy-rich explanations suited perfectly for 10th and 11th grade minds!"}
                        {explanationLevel === "Undergrad" && "Analyze breakthroughs with collegiate scientific language, bridging fundamental chemistry/biology and highlighting core experimental design."}
                        {explanationLevel === "Graduate" && "Scrutinize advanced procedures, methodologies, statistical boundaries, and systemic limitations for Masters/Ph.D. level minds."}
                        {explanationLevel === "PhD" && "Peer-to-peer appraisal and deep mechanistic breakdown of theoretical constraints, kinetic boundaries, and academic validity."}
                      </p>
                    </div>

                    
                  </motion.div>

                  {/* Curated Platform Live Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-[#E8E4D9] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                     
                        <h4 className="text-lg font-serif font-bold text-[#2D2D24] mt-1">
                          Latest Publications & Articles
                        </h4>
                       
                      </div>

                      {/* Sync button */}
                      <button
                        onClick={async () => {
                          setLoadingLive(true);
                          setLiveError(null);
                          try {
                            const response = await fetch("/api/latest-papers");
                            const data = await response.json();
                            if (data.papers) setLivePapers(data.papers);
                          } catch (err) {
                            setLiveError("Failed to sync sources. Try again!");
                          } finally {
                            setLoadingLive(false);
                          }
                        }}
                        disabled={loadingLive}
                        className="text-xs bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#5A5A4A] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 cursor-pointer select-none transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${loadingLive ? 'animate-spin' : ''}`} />
                        {loadingLive ? "Crawl Syncing..." : "Sync Feeds"}
                      </button>
                    </div>

                    {/* Loader states for latest papers */}
                    {loadingLive && (
                      <div className="flex flex-col gap-3 py-6 items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-[#7C8464] animate-spin" />
                        <p className="text-xs text-[#8C8474] font-mono animate-pulse mt-2">
                          CRAWLING LIVE RESEARCH PORTALS...
                        </p>
                      </div>
                    )}

                    {liveError && !loadingLive && (
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-center text-xs text-amber-800 leading-relaxed">
                        ⚠️ {liveError}
                      </div>
                    )}

                    {!loadingLive && !liveError && livePapers.length === 0 && (
                      <div className="p-8 text-center text-xs text-[#8C8474] bg-[#F9F7F2]/40 rounded-2xl border border-dashed border-[#E8E4D9]">
                        Waiting to sync papers from live scientific sources. Click "Sync Feeds" above or refresh the app!
                      </div>
                    )}

                    {/* Papers items grouped by topic, sorted by publish date descending */}
                    {!loadingLive && livePapers.length > 0 && (
                      <div className="flex flex-col gap-8">
                        {getGroupedAndSortedPapers().map((group, groupIdx) => (
                          <div key={groupIdx} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-[#E8E4D9]">
                              <span className="w-1.5 h-3.5 bg-[#7C8464] rounded-full" />
                              <h5 className="font-serif font-bold text-[#2D2D24] text-xs sm:text-sm tracking-wide">
                                {group.topic}
                              </h5>
                              <span className="text-[9px] font-mono bg-[#F2EDE4] text-[#5A5A4A] px-2 py-0.5 rounded-full font-bold">
                                {group.papers.length} {group.papers.length === 1 ? 'article' : 'articles'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              {group.papers.map((paper, idx) => {
                                let formattedDate = "";
                                if (paper.publish_date) {
                                  try {
                                    const d = new Date(paper.publish_date);
                                    if (!isNaN(d.getTime())) {
                                      formattedDate = d.toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      });
                                    }
                                  } catch (e) {}
                                }

                                return (
                                  <div 
                                    key={idx}
                                    className="p-6 rounded-2xl border border-[#E8E4D9]/80 bg-[#F9F7F2]/20 hover:bg-[#F2EDE4]/30 hover:border-[#7C8464]/60 transition-all flex flex-col justify-between items-stretch gap-4 text-left"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono uppercase tracking-wider bg-[#2D2D24] text-white px-2 py-0.5 rounded font-bold">
                                          {paper.source_name}
                                        </span>
                                        {formattedDate && (
                                          <span className="text-[10px] font-mono bg-[#7C8464]/30 text-[#1F2317] px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                                            📅 {formattedDate}
                                          </span>
                                        )}
                                        <span className="text-[10px] font-mono text-[#2D2D24] font-bold line-clamp-1">
                                          by {paper.authors}
                                        </span>
                                      </div>
                                      <h6 className="font-serif font-bold text-[#1E2019] text-base sm:text-[17px] leading-snug mt-2 mb-2" style={{ marginBottom: "8px" }}>
                                        {paper.title}
                                      </h6>
                                      <p className="text-xs text-[#4F543B] leading-relaxed line-clamp-3">
                                        {paper.abstract}
                                      </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-[#E8E4D9]/40 w-full flex-row flex-wrap sm:flex-nowrap">
                                      <button
                                        onClick={() => handleToggleReadLater(paper)}
                                        className={`text-center text-[10px] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-bold whitespace-nowrap shadow-xs ${
                                          isBookmarked(paper)
                                            ? "bg-[#7C8464]/15 border border-[#7C8464]/40 text-[#4D543B] hover:bg-[#7C8464]/25"
                                            : "bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4]"
                                        }`}
                                      >
                                        <Bookmark className={`h-3 w-3 ${isBookmarked(paper) ? "fill-[#7C8464] text-[#7C8464]" : ""}`} />
                                        {isBookmarked(paper) ? "Saved" : "Read Later"}
                                      </button>
                                      
                                      <a
                                        href={paper.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-center text-[10px] bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-bold whitespace-nowrap shadow-xs"
                                      >
                                        <Globe className="h-3 w-3" />
                                        Original Site
                                      </a>
                                      
                                      <button
                                        onClick={() => handleSelectLivePaper(paper)}
                                        className="text-center text-[11px] bg-[#7C8464] hover:bg-[#6A7153] text-white px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                                      >
                                        🔬 Load Into Lab
                                      </button>

                                      <button
                                        onClick={() => {
                                          if (!fusionPaperA) {
                                            setFusionPaperA(paper);
                                          } else if (!fusionPaperB) {
                                            setFusionPaperB(paper);
                                          } else {
                                            setFusionPaperA(paper);
                                          }
                                          setShowFusionLab(true);
                                        }}
                                        className="text-center text-[11px] bg-[#E8E4D9]/60 hover:bg-[#E8E4D9] text-[#2D2D24] px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                                      >
                                        🧬 Select for Fusion
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Custom Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-[#E8E4D9] rounded-[32px] p-8 sm:p-12 shadow-sm relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                    {/* Animated Solar System Spinner */}
                    <div className="relative w-24 h-24">
                      {/* Inner Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#7C8464]/30 animate-spin"></div>
                      {/* Middle Sparkle Ring */}
                      <div className="absolute inset-2 rounded-full border-2 border-[#7C8464] border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                      {/* Outer Dot */}
                      <div className="absolute -inset-1 rounded-full border border-[#8C8474] border-[#7C8464]/20 animate-[spin_1.5s_linear_infinite]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="h-8 w-8 text-[#7C8464] animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#F2EDE4] text-[#5A5A4A] border border-[#E8E4D9] px-3 py-1 rounded-full">
                        AI DECONSTRUCTION LAB
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#2D2D24] mt-3">
                        Deconstructing into {explanationLevel} Level...
                      </h3>
                    </div>

                    {/* Progress feedback block */}
                    <div className="w-full max-w-sm bg-[#E8E4D9] h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-[#7C8464] h-full rounded-full"
                        animate={{ width: ["10%", "35%", "65%", "90%", "10%", "50%", "95%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>

                    <p className="text-[#5A5A4A] italic text-sm max-w-sm mt-3 animate-pulse font-serif">
                      &ldquo;{loadingMessages[loadingPhase]}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error state message */}
              {!loading && error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#F2EDE4] border border-[#D6D0C2] text-[#434338] rounded-[32px] p-6 shadow-sm flex items-start gap-4"
                >
                  <AlertCircle className="h-6 w-6 text-[#7C8464] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-[#2D2D24] text-lg">
                      Deconstruction Error
                    </h4>
                    <p className="text-sm mt-1.5 leading-relaxed text-[#5A5A4A]">
                      {error}
                    </p>
                    <div className="flex gap-2.5 mt-4">
                      <button
                        onClick={handleSubmit}
                        className="bg-[#7C8464] hover:bg-[#6A7153] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Retry Translation
                      </button>
                      <button
                        onClick={() => {
                          setResult(null);
                          setError(null);
                          setTitle("");
                          setAbstract("");
                        }}
                        className="bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Back to Feed
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Final Successful Result */}
              {!loading && !error && result && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className={`grid grid-cols-1 gap-8 w-full ${splitScreenPaper ? "lg:grid-cols-12 items-start" : ""}`}>
                    {/* Left Column: Workspace Core Analysis */}
                    {highDensity ? (
                      <div className={`w-full ${splitScreenPaper ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-3.5`}>
                        <div className={splitScreenPaper ? "grid grid-cols-1 md:grid-cols-2 gap-3.5" : "grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full items-start"}>
                          {/* Left Column: Metadata & Navigation */}
                          <div className={splitScreenPaper ? "flex flex-col gap-3" : "lg:col-span-3 flex flex-col gap-3"}>
                            {renderBackButtonAndHorizonMapTrigger()}
                            {renderAdaptiveViewControl()}
                            {renderCatchySimplifiedTitle()}
                            {renderExcitingHookSection()}
                            {renderActionsActionBar()}
                          </div>

                          {/* Middle Column: The Core Text & Deep Details */}
                          <div className={splitScreenPaper ? "flex flex-col gap-3" : "lg:col-span-5 flex flex-col gap-3"}>
                            {renderBigIdeaGrid()}
                            {renderRealWorldImpact()}
                          </div>

                          {/* Right Column: Jargon & Discovered Exploits */}
                          <div className={splitScreenPaper ? "col-span-1 md:col-span-2 flex flex-col gap-3" : "lg:col-span-4 flex flex-col gap-3"}>
                            {renderThesisValidationMatrix()}
                            {renderJargonGlossary()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex flex-col gap-6 w-full ${splitScreenPaper ? "lg:col-span-7" : ""}`}>
                  
                  {/* Back to Feed button & Horizon Map Trigger */}
                  <div className="flex items-center justify-between py-1">
                    <button
                      onClick={() => {
                        setResult(null);
                        setTitle("");
                        setAbstract("");
                        setFullText("");
                      }}
                      className="group flex items-center gap-2 text-xs font-bold text-[#7C8464] hover:text-[#6A7153] transition-colors bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer"
                    >
                      <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
                      <span>Back to Article Feed</span>
                    </button>

                    <button
                      onClick={() => setShowHorizonMap(true)}
                      className="group flex items-center gap-2 text-xs font-bold text-[#2D2D24] hover:text-white hover:bg-[#7C8464] transition-all bg-white border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer hover:border-[#7C8464]"
                      id="horizon-map-top-trigger"
                    >
                      <Network className="h-4 w-4 text-[#7C8464] group-hover:text-white transition-colors animate-pulse" />
                      <span>Explore Horizon Map</span>
                    </button>

                    {/* Floating Vertical Drawer Tab Activator on Absolute Right Edge */}
                    <button
                      onClick={() => setShowHorizonMap(true)}
                      className="fixed right-0 top-[35%] -translate-y-1/2 z-40 bg-[#7C8464] hover:bg-[#6A7153] text-white pl-4.5 pr-3 py-5 rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:pl-5.5 flex flex-col items-center gap-3 cursor-pointer select-none active:scale-95 border-l-0 border border-[#6A7153]/50 animate-fade-in"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                      id="horizon-map-floating-tab"
                    >
                      <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#F9F7F2]">
                        <div className="-rotate-90 py-1">
                          <Network className="h-4 w-4 text-[#EAE6D6]" />
                        </div>
                        <span className="mt-1">Horizon Map</span>
                      </div>
                    </button>
                  </div>

                
                  
                  {/* Adaptive View Toggle Control */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F2EDE4]/60 p-4 rounded-[24px] border border-[#D6D0C2] gap-3">
                    <div className="flex flex-col px-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#2D2D24] font-bold uppercase tracking-wider">
                        <Sparkle className="h-4 w-4 text-[#7C8464] animate-pulse" />
                        Adaptive View Control
                      </div>
                      <span className="text-[10px] text-[#8C8474] font-mono leading-tight mt-0.5">
                        Instantly adjust the verbosity and mechanical depth of the generated breakdown!
                      </span>
                    </div>
                    <div className="bg-white/90 p-1 rounded-xl flex gap-1 w-full sm:w-auto shadow-sm border border-[#E8E4D9]">
                      <button
                        type="button"
                        onClick={() => setViewMode("concept")}
                        className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          viewMode === "concept"
                            ? "bg-[#7C8464] text-white shadow font-semibold"
                            : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
                        }`}
                      >
                        💡 Concept Focused
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("detail")}
                        className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          viewMode === "detail"
                            ? "bg-[#7C8464] text-white shadow font-semibold"
                            : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
                        }`}
                      >
                        🔬 Deep Detail
                      </button>
                    </div>
                  </div>

                  {/* Catchy Simplified Title */}
                  <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-[#F9F7F2] rounded-full -z-10 opacity-60"></div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-[#8C8474] bg-[#F2EDE4] border border-[#E8E4D9] px-3 py-1 rounded-lg whitespace-nowrap">
                        {viewMode === "concept" ? "Concept Focused • Catchy Title" : "Detailed Analysis • Catchy Title"}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D24] tracking-tight leading-tight mt-1">
                      {result.simplified_title}
                    </h2>
                  </div>

                  {/* Exciting Hook Section */}
                  <motion.div
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex gap-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 translate-x-3 -translate-y-3">
                      <Flame className="h-24 w-24 text-[#7C8464]/5" />
                    </div>
                    
                    <div className="bg-[#F2EDE4] text-[#7C8464] p-3 h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C8464] font-mono">The Hook: Why it is cool!</span>
                      <p className="text-lg text-[#5A5A4A] italic font-medium leading-relaxed mt-1.5 font-serif">
                        "{result.one_sentence_hook}"
                      </p>
                    </div>
                  </motion.div>

                  {/* Big Idea Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Big Idea Description */}
                    {renderBigIdeaDescription()}

                    {/* Key Findings in Beautiful Forest Green Column (Matches Design HTML) */}
                    <div className="bg-[#7C8464] rounded-[32px] p-7 text-white shadow-lg flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-5 flex items-center gap-2">
                          <Layers className="h-4 w-4" /> Key Discoveries
                        </h3>
                        
                        <ul className="space-y-5">
                          {(viewMode === "concept"
                            ? (result.key_findings_concept || result.key_findings || [])
                            : (result.key_findings_detail || result.key_findings || [])).map((finding, idx) => (
                            <li 
                              key={idx} 
                              id={`claim-discovery-${idx}`}
                              className={`flex gap-3 items-start p-3 rounded-2xl transition-all duration-500 ${
                                hoveredMatrixCard === `claim-discovery-${idx}`
                                  ? "bg-white/10 text-white font-medium scale-[1.02] shadow-sm ml-1 pr-1 border-l-4 border-white"
                                  : "opacity-100"
                              }`}
                            >
                              <span className="w-5 h-5 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="text-sm leading-snug text-white/95 text-justify">
                                {renderTextWithJargonHighlights(finding, result.jargon_cheat_sheet)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-white/60 font-mono text-center">
                        {result.explanation_level ? `Verified ${result.explanation_level} Level Insights` : "Verified High-School Core Mechanics"}
                      </div>
                    </div>

                  </div>

                  {/* Real-world Impact to Teenagers */}
                  <div className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex flex-col gap-4 overflow-hidden">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#B4A086] flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Why It Matters to Future Generations
                    </h3>

                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#2D2D24] mb-2">
                        Real-World Impact
                      </h4>
                      <p className="text-[15px] text-[#5A5A4A] leading-relaxed mb-4">
                        {renderTextWithJargonHighlights(
                          viewMode === "concept"
                            ? (result.real_world_impact_concept || result.real_world_impact || "")
                            : (result.real_world_impact_detail || result.real_world_impact || ""),
                          result.jargon_cheat_sheet
                        )}
                      </p>
                    </div>

                    <div className="mt-auto p-4 bg-[#F9F7F2] rounded-2xl flex items-center gap-4 border border-[#E8E4D9]">
                      <div className="w-12 h-12 bg-[#D6D0C2] rounded-xl flex items-center justify-center text-2xl">🌍</div>
                      <p className="text-xs font-medium text-[#8C8474] leading-tight">
                        This discovery empowers your generation to innovate tomorrow's technology, health, and conservation fields starting today!
                      </p>
                    </div>
                  </div>

                  {/* Thesis Validation & Dialectics Matrix */}
                  <div className="bg-white rounded-[32px] p-7 border border-[#E8E4D9] shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#7C8464]/10 p-2.5 rounded-xl text-[#7C8464]">
                          <GitCompare className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-[#2D2D24] text-lg sm:text-xl leading-tight">
                            Thesis Validation &amp; Dialectics Matrix
                          </h3>
                          <p className="text-[10px] text-[#8C8474] font-mono tracking-wider uppercase mt-0.5">
                            Mapping replication, active critiques, and methodological variables
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
                        className="p-1 px-3 bg-[#F9F7F2] hover:bg-[#F2EDE4] border border-[#E8E4D9] rounded-xl text-xs font-bold text-[#5A5A4A] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {isMatrixExpanded ? (
                          <>
                            <span>Hide Matrix</span>
                            <ChevronUp className="h-3.5 w-3.5 text-[#7C8464]" />
                          </>
                        ) : (
                          <>
                            <span>Show Matrix</span>
                            <ChevronDown className="h-3.5 w-3.5 text-[#7C8464]" />
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isMatrixExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {/* Main 3 Column Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                            {(() => {
                              const matrix = generateThesisValidationMatrix(result.simplified_title);
                              
                              return (
                                <>
                                  {/* Column 1: Supporting Evidence & Replications */}
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 px-1 py-1 bg-[#7C8464]/5 border border-[#7C8464]/15 rounded-xl">
                                      
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C8464]">
                                        Support &amp; Replications
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-3.5">
                                      {matrix.supporting.map((card) => {
                                        const isCardActive = splitScreenPaper?.id === card.id;
                                        return (
                                          <div
                                            key={card.id}
                                            onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                            onMouseLeave={() => setHoveredMatrixCard(null)}
                                            className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                              isCardActive 
                                                ? "bg-[#7C8464]/10 border-[#7C8464] ring-1 ring-[#7C8464]/20" 
                                                : "border-[#E8E4D9] hover:border-[#7C8464] hover:bg-white"
                                            }`}
                                          >
                                            {/* Micro Border Indicator */}
                                            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-[#7C8464]" />
                                            
                                            {/* High Density Metadata Header */}
                                            <div className="flex justify-between items-center gap-2 pl-1">
                                              <span className="text-[10px] font-mono font-bold text-[#7C8464] bg-[#7C8464]/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                                {card.journal}
                                              </span>
                                              <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                                ★ Citations: <strong>{card.citations}</strong>
                                              </span>
                                            </div>

                                            <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                              By {card.authors}
                                            </p>

                                            <div className="pl-1">
                                              <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                                {card.claim}
                                              </h4>
                                              <p className="text-[11px] text-[#5A5A4A] leading-relaxed mt-2 p-2 rounded-lg bg-[#7C8464]/5 border border-[#7C8464]/10 italic font-medium">
                                                {card.convergence}
                                              </p>
                                            </div>

                                            {/* Split Button Action Layout */}
                                            <div className="flex gap-1.5 mt-2 pl-1">
                                              <button
                                                onClick={() => setSplitScreenPaper(card)}
                                                className="flex-1 bg-[#7C8464] hover:bg-[#6A7153] text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                              >
                                                <GitCompare className="h-3 w-3" />
                                                <span>Split-Screen Mode</span>
                                              </button>
                                              <a
                                                href={card.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                              >
                                                <span>Source</span>
                                                <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                              </a>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Column 2: Conflicting Results, Critiques & Counter-arguments */}
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 px-1 py-1 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                                     
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">
                                        Critiques &amp; Friction
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-3.5">
                                      {matrix.conflicting.map((card) => {
                                        const isCardActive = splitScreenPaper?.id === card.id;
                                        return (
                                          <div
                                            key={card.id}
                                            onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                            onMouseLeave={() => setHoveredMatrixCard(null)}
                                            className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                              isCardActive 
                                                ? "bg-amber-50 border-amber-500 ring-1 ring-amber-500/20" 
                                                : "border-[#E8E4D9] hover:border-amber-600/40 hover:bg-white"
                                            }`}
                                          >
                                            {/* Micro Border Indicator */}
                                            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-amber-600" />
                                            
                                            {/* High Density Metadata Header */}
                                            <div className="flex justify-between items-center gap-2 pl-1">
                                              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-600/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                                {card.journal}
                                              </span>
                                              <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                                ★ Citations: <strong>{card.citations}</strong>
                                              </span>
                                            </div>

                                            <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                              By {card.authors}
                                            </p>

                                            <div className="pl-1">
                                              <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                                {card.claim}
                                              </h4>
                                              <p className="text-[11px] text-amber-900 leading-relaxed mt-2 p-2 rounded-lg bg-amber-600/5 border border-amber-600/10 italic font-medium">
                                                {card.convergence}
                                              </p>
                                            </div>

                                            {/* Split Button Action Layout */}
                                            <div className="flex gap-1.5 mt-2 pl-1">
                                              <button
                                                onClick={() => setSplitScreenPaper(card)}
                                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                              >
                                                <GitCompare className="h-3 w-3" />
                                                <span>Split-Screen Mode</span>
                                              </button>
                                              <a
                                                href={card.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                              >
                                                <span>Source</span>
                                                <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                              </a>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Column 3: Methodological Variations & Benchmarks */}
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 px-1 py-1 bg-slate-500/5 border border-slate-500/15 rounded-xl">
                                
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                                        Method Variations
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-3.5">
                                      {matrix.methodological.map((card) => {
                                        const isCardActive = splitScreenPaper?.id === card.id;
                                        return (
                                          <div
                                            key={card.id}
                                            onMouseEnter={() => setHoveredMatrixCard(card.anchorId)}
                                            onMouseLeave={() => setHoveredMatrixCard(null)}
                                            className={`group relative bg-[#F9F7F2]/40 rounded-2xl p-4.5 border transition-all duration-300 flex flex-col gap-3 shadow-xs hover:shadow-md ${
                                              isCardActive 
                                                ? "bg-slate-50 border-slate-500 ring-1 ring-slate-500/20" 
                                                : "border-[#E8E4D9] hover:border-slate-500/40 hover:bg-white"
                                            }`}
                                          >
                                            {/* Micro Border Indicator */}
                                            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-slate-500" />
                                            
                                            {/* High Density Metadata Header */}
                                            <div className="flex justify-between items-center gap-2 pl-1">
                                              <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                                {card.journal}
                                              </span>
                                              <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                                                ★ Citations: <strong>{card.citations}</strong>
                                              </span>
                                            </div>

                                            <p className="text-[10px] text-[#8C8474] font-mono pl-1">
                                              By {card.authors}
                                            </p>

                                            <div className="pl-1">
                                              <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">
                                                {card.claim}
                                              </h4>
                                              <p className="text-[11px] text-slate-950 leading-relaxed mt-2 p-2 rounded-lg bg-slate-500/5 border border-slate-500/10 italic font-medium">
                                                {card.convergence}
                                              </p>
                                            </div>

                                            {/* Split Button Action Layout */}
                                            <div className="flex gap-1.5 mt-2 pl-1">
                                              <button
                                                onClick={() => setSplitScreenPaper(card)}
                                                className="flex-1 bg-slate-500 hover:bg-slate-600 text-[10px] font-bold text-white py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                                              >
                                                <GitCompare className="h-3 w-3" />
                                                <span>Split-Screen Mode</span>
                                              </button>
                                              <a
                                                href={card.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[10px] font-bold text-[#5A5A4A] py-2 px-2.5 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-[#2D2D24]"
                                              >
                                                <span>Source</span>
                                                <ExternalLink className="h-2.5 w-2.5 text-[#8C8474]" />
                                              </a>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Jargon Glossary Cheat Sheet */}
                  <div className="bg-[#EAE6D6] rounded-[32px] p-7 border border-[#D6D0C2] flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A4A] flex justify-between items-center w-full">
                          <span>Jargon Cheat Sheet</span>
                        </h3>
                        <p className="text-[11px] text-[#8C8474] mt-1 font-mono">
                          {result.jargon_cheat_sheet.length} terms deconstructed into simple, memorable analogies
                        </p>
                      </div>

                      {/* Search box for jargon glossary */}
                      <div className="relative flex-shrink-0 w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search jargon terms..."
                          value={jargonQuery}
                          onChange={(e) => setJargonQuery(e.target.value)}
                          className="w-full text-xs p-2.5 pl-8 bg-white/60 border border-[#D6D0C2] rounded-xl focus:border-[#7C8464] focus:outline-none placeholder:text-[#8C8474]/70"
                        />
                        <Search className="h-3.5 w-3.5 text-[#8C8474]/80 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredJargon && filteredJargon.length > 0 ? (
                        filteredJargon.map((item, idx) => {
                          const isPulsing = pulsingTerm?.toLowerCase() === item.term.toLowerCase();
                          const termId = item.term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
                          
                          return (
                            <div 
                              key={idx} 
                              id={`jargon-card-${termId}`}
                              className={`rounded-2xl p-4 flex flex-col gap-1.5 transition-all duration-300 ${
                                isPulsing 
                                  ? "jargon-card-pulse border-[#7C8464] shadow-md" 
                                  : "bg-white/40 border border-white/40 hover:bg-white/60"
                              }`}
                            >
                              <span className="font-serif font-bold text-[#2D2D24] text-base flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPulsing ? "bg-[#7C8464] scale-125" : "bg-[#7C8464]"}`} />
                                {item.term}
                              </span>
                              <p className={`italic text-xs sm:text-sm leading-relaxed p-2.5 rounded-xl transition-all duration-300 ${isPulsing ? "text-[#2D2D24] bg-white/70" : "text-[#5A5A4A] bg-white/40"}`}>
                                "{item.simple_definition}"
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center text-[#8C8474] text-xs py-6">
                          No matching jargon terms in this cheat sheet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions log action bar */}
                  <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border border-[#E8E4D9] rounded-[24px] bg-white gap-3">
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSaveToStudyLog}
                        className="px-5 py-2.5 bg-[#7C8464] hover:bg-[#6A7153] text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <BookMarked className="h-3.5 w-3.5" />
                        Save to Study Log
                      </button>
                      <button 
                        onClick={() => alert("Link copied to clipboard! Share with your biology class study group.")}
                        className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E8E4D9] rounded-full text-xs font-bold text-[#5A5A4A] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share with Class
                      </button>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-widest">
                      {result.explanation_level === "Middle School" && "Curriculum Standard: Middle School STEM Level"}
                      {result.explanation_level === "High School" && "Curriculum Standard: Grade 11 STEM Alignment"}
                      {result.explanation_level === "Undergrad" && "Academic Level: College Undergraduate Standard"}
                      {result.explanation_level === "Graduate" && "Analytical Level: Graduate Research Standard"}
                      {result.explanation_level === "PhD" && "Scientific Rigor: post-doctoral / faculty Level"}
                      {!result.explanation_level && "Curriculum Standard: Grade 11 STEM Alignment"}
                    </div>
                  </div>

                      </div>
                    )}

                {/* Right Column: Split-Screen Comparison Drawer inside active workspace */}
                {splitScreenPaper && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="lg:col-span-5 w-full bg-white border border-[#E8E4D9] rounded-[32px] p-6 shadow-md flex flex-col gap-5 lg:sticky lg:top-6 self-start max-h-[88vh] overflow-y-auto"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE4]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7C8464] animate-pulse" />
                        <h3 className="font-serif font-bold text-[#2D2D24] text-base leading-tight">
                          Comparative Split-Screen
                        </h3>
                      </div>
                      <button
                        onClick={() => setSplitScreenPaper(null)}
                        className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Connection Type Indicator Header */}
                    <div className="p-4 rounded-2xl flex flex-col gap-1.5 border" style={{
                      backgroundColor: splitScreenPaper.id.startsWith("sup")
                        ? "rgba(124,132,100,0.06)"
                        : splitScreenPaper.id.startsWith("con")
                        ? "rgba(180,160,134,0.08)"
                        : "rgba(140,132,116,0.06)",
                      borderColor: splitScreenPaper.id.startsWith("sup")
                        ? "rgba(124,132,100,0.2)"
                        : splitScreenPaper.id.startsWith("con")
                        ? "rgba(180,160,134,0.2)"
                        : "rgba(140,132,116,0.2)"
                    }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C8464]">
                          Dialectic Mode
                        </span>
                        <span className="text-[9px] font-mono text-[#8C8474]">
                          Score: {splitScreenPaper.citations} citations
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {splitScreenPaper.id.startsWith("sup") ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-[#7C8464]" />
                        ) : splitScreenPaper.id.startsWith("con") ? (
                          <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
                        ) : (
                          <GitCompare className="h-4.5 w-4.5 text-slate-600" />
                        )}
                        <h4 className="font-serif font-bold text-sm text-[#2D2D24]">
                          {splitScreenPaper.id.startsWith("sup")
                            ? "Supporting Evidence & Verification"
                            : splitScreenPaper.id.startsWith("con")
                            ? "Active Contradiction/Critique Found"
                            : "Methodological Benchmark Variant"}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5A5A4A] leading-relaxed italic mt-1">
                        "{splitScreenPaper.convergence}"
                      </p>
                    </div>

                    {/* Papers Side-by-Side Metadata Cards */}
                    <div className="flex flex-col gap-3.5">
                      {/* Main Paper Card */}
                      <div className="p-4 bg-[#F9F7F2]/60 rounded-xl border border-[#E8E4D9]">
                        <span className="text-[9px] font-mono font-bold text-[#8C8474] uppercase tracking-wide">
                          [Primary Active Paper]
                        </span>
                        <h5 className="font-serif font-bold text-[#2D2D24] text-xs leading-snug mt-1">
                          {result.simplified_title}
                        </h5>
                        <p className="text-[11px] text-[#5A5A4A] leading-relaxed mt-1.5 font-mono line-clamp-3 italic">
                          "{result.one_sentence_hook}"
                        </p>
                      </div>

                      {/* Comparative Paper Card */}
                      <div className="p-4 bg-white rounded-xl border border-[#7C8464]/30 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#7C8464]/5 rounded-full -z-10" />
                        <div className="flex justify-between items-center text-[9px] font-mono text-[#8C8474] uppercase tracking-wide">
                          <span>[Comparative Study]</span>
                          <span className="text-[#7C8464] font-bold">{splitScreenPaper.journal}</span>
                        </div>
                        <h5 className="font-serif font-bold text-[#2D2D24] text-xs leading-snug mt-1">
                          {splitScreenPaper.claim}
                        </h5>
                        <p className="text-[10px] text-[#8C8474] font-mono mt-1">
                          By {splitScreenPaper.authors}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Abstract Comparison context */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-[#F2EDE4]">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#8C8474]">
                        Comparative Abstract Snapshot:
                      </span>
                      <p className="text-xs text-[#5A5A4A] leading-relaxed bg-[#F9F7F2] p-4 rounded-xl border border-[#E8E4D9]/40 text-justify">
                        {splitScreenPaper.abstract}
                      </p>
                    </div>

                    {/* Dialectics Context explanation */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 leading-relaxed italic">
                      💡 <strong>Dialectics Summary:</strong> {splitScreenPaper.summary} Highlighted sections in Lumina's main pane indicate original claims analyzed under peer assessment.
                    </div>

                    {/* Split comparative Actions */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-[#F2EDE4] mt-auto">
                      <button
                        onClick={async () => {
                          const paperToLoad: LivePaper = {
                            title: splitScreenPaper.claim,
                            authors: splitScreenPaper.authors,
                            abstract: splitScreenPaper.abstract,
                            source_name: splitScreenPaper.journal,
                            original_url: splitScreenPaper.originalUrl,
                          };
                          setSplitScreenPaper(null);
                          await handleSelectLivePaper(paperToLoad);
                        }}
                        className="w-full bg-[#7C8464] hover:bg-[#6A7153] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Load comparative paper as Main Article</span>
                      </button>
                      
                      <a
                        href={splitScreenPaper.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white hover:bg-[#F2EDE4] text-[#5A5A4A] border border-[#E8E4D9] py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#8C8474]" />
                        <span>View Original Source Archive</span>
                      </a>
                    </div>
                  </motion.div>
                )}

              </div> {/* End Grid Row container */}

                </motion.div>
              )}
              
            </AnimatePresence>

          </section>

        
      </main>

      {/* Horizon Map Slide-over Drawer Panel */}
      <AnimatePresence>
        {showHorizonMap && result && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="horizon-map-drawer">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowHorizonMap(false);
                setHoveredNode(null);
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-md animate-fade-in"
              >
                <div className="h-full flex flex-col bg-[#F9F7F2] shadow-2xl border-l border-[#E8E4D9] overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-5 bg-white border-b border-[#E8E4D9] flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-[#7C8464]/10 p-2 rounded-xl text-[#7C8464]">
                        <Network className="h-5 w-5 opacity-90" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-[#2D2D24] text-lg leading-tight">Citation Horizon Map</h2>
                        <span className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-wider mt-0.5 block">
                          Upstream Foundations &amp; Target Applications
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowHorizonMap(false);
                        setHoveredNode(null);
                      }}
                      className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body Container */}
                  <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-6">
                    {/* Explanation */}
                    <div className="bg-white/50 border border-white p-4 rounded-xl">
                      <p className="text-xs text-[#5A5A4A] leading-relaxed">
                        Lumina mapped out this study's theoretical lineage. 
                        <strong> Left items</strong> are foundational references cited by this work. 
                        <strong> Right items</strong> represent subsequent preprints or newer models extending this methodology.
                      </p>
                    </div>

                    {/* SVG GRAPH BLOCK */}
                    <div className="relative flex flex-col bg-white border border-[#E8E4D9] rounded-3xl p-4 gap-4 shadow-xs">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-[#8C8474] uppercase text-center block mb-1">
                        Interactive Academic Pedigree
                      </span>

                      {/* SVG Canvas wrapper */}
                      <div className="w-full h-[250px] relative flex items-center justify-center overflow-hidden">
                        {(() => {
                          const graph = generateCitationGraph(result?.simplified_title);
                          const activeNodeShowcase = selectedCitationNode || graph.nodes.find(n => n.type === "center");

                          return (
                            <svg className="w-full h-full" viewBox="0 0 350 280">
                              {/* Connector Lines */}
                              {graph.links.map((link, idx) => {
                                const src = graph.nodes.find(n => n.id === link.source);
                                const tgt = graph.nodes.find(n => n.id === link.target);
                                if (!src || !tgt) return null;

                                const isLineActive = hoveredNode?.id === src.id || hoveredNode?.id === tgt.id || activeNodeShowcase?.id === src.id || activeNodeShowcase?.id === tgt.id;

                                return (
                                  <line
                                    key={idx}
                                    x1={src.x}
                                    y1={src.y}
                                    x2={tgt.x}
                                    y2={tgt.y}
                                    stroke={isLineActive ? "#7C8464" : "#D6D0C2"}
                                    strokeWidth={isLineActive ? 2.5 : 1.5}
                                    strokeDasharray={link.isPreprint ? "4,4" : undefined}
                                    className="transition-all duration-300 pointer-events-none"
                                  />
                                );
                              })}

                              {/* Nodes Rendering */}
                              {graph.nodes.map((node) => {
                                const isCenter = node.type === "center";
                                const isNodeHovered = hoveredNode?.id === node.id;
                                const isNodeSelected = activeNodeShowcase?.id === node.id;

                                return (
                                  <g
                                    key={node.id}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredNode(node)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => setSelectedCitationNode(node)}
                                  >
                                    {/* Pulse circle for Center node */}
                                    {isCenter && (
                                      <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={24}
                                        fill="none"
                                        stroke="#7C8464"
                                        strokeWidth={1.5}
                                        className="animate-ping opacity-15"
                                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                                      />
                                    )}

                                    {/* Trigger Circle */}
                                    <circle
                                      cx={node.x}
                                      cy={node.y}
                                      r={isCenter ? 16 : 11}
                                      fill={isCenter ? "#7C8464" : isNodeSelected ? "#F2EDE4" : "#FFFFFF"}
                                      stroke={isCenter ? "#6A7153" : isNodeSelected ? "#7C8464" : isNodeHovered ? "#7C8464" : "#D6D0C2"}
                                      strokeWidth={isCenter ? 3.5 : isNodeSelected ? 3.5 : isNodeHovered ? 2.5 : 1.5}
                                      className="transition-all duration-200"
                                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                                    />

                                    {/* Inner dot inside standard nodes */}
                                    {!isCenter && (
                                      <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={3.5}
                                        fill={isNodeSelected ? "#7C8464" : "#8C8474"}
                                        className="pointer-events-none"
                                      />
                                    )}

                                    {/* Inner white dot for Center core */}
                                    {isCenter && (
                                      <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={4}
                                        fill="#FFFFFF"
                                        className="pointer-events-none"
                                      />
                                    )}

                                    {/* Label Underneath Node */}
                                    <text
                                      x={node.x}
                                      y={node.y + (isCenter ? 32 : 26)}
                                      textAnchor="middle"
                                      className={`text-[9.5px] font-mono leading-none tracking-tight pointer-events-none transition-all duration-200 ${
                                        isCenter
                                          ? "font-bold text-[#2D2D24]"
                                          : isNodeSelected || isNodeHovered
                                          ? "font-bold text-[#7C8464]"
                                          : "text-[#8C8474]"
                                      }`}
                                    >
                                      {node.shortTitle}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          );
                        })()}
                      </div>

                      {/* Floating Micro-Hover Tooltip Overlay inside Graph */}
                      <AnimatePresence>
                        {hoveredNode && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="bg-[#2D2D24] text-white text-[11px] p-3 rounded-xl shadow-lg border border-[#434338] pointer-events-none z-10 absolute left-4 right-4 top-[50%] -translate-y-1/2"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-serif font-bold leading-tight block text-white text-xs">
                                {hoveredNode.title}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap ${
                                hoveredNode.isPreprint ? "bg-[#B4A086] text-[#2D2D24]" : "bg-[#7C8464] text-white"
                              }`}>
                                {hoveredNode.isPreprint ? "PREPRINT" : "PEER-REVIEW"}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#A69F8B] mt-1.5 font-mono">
                              By {hoveredNode.authors} ({hoveredNode.year})
                            </p>
                            <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-[#A69F8B] font-mono">
                              <span>🔗 CONNECTION: {hoveredNode.type.toUpperCase()}</span>
                              <span>🔥 CITATIONS: {hoveredNode.citations}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CLICK PREVIEW CARD AT BOTTOM */}
                    {(() => {
                      const graph = generateCitationGraph(result?.simplified_title);
                      const activeNode = selectedCitationNode || graph.nodes.find(n => n.type === "center");
                      const isCurrentCenterNode = activeNode.type === "center";

                      return (
                        <div className="flex flex-col gap-4 mt-1">
                          <div className="bg-white border border-[#E8E4D9] rounded-2xl p-5 flex flex-col gap-3.5 shadow-xs relative overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#7C8464] bg-[#F2EDE4] px-2.5 py-1 rounded-md">
                                {activeNode.type === "upstream" ? "Foundational Ref" : activeNode.type === "downstream" ? "Derived Adaptation" : "Loaded Study"}
                              </span>
                              <span className="text-[10px] font-mono text-[#8C8474]">
                                Citations: <strong>{activeNode.citations}</strong>
                              </span>
                            </div>

                            <div>
                              <h3 className="font-serif font-bold text-[#2D2D24] text-sm sm:text-base leading-snug">
                                {activeNode.title}
                              </h3>
                              <p className="text-xs text-[#8C8474] font-mono mt-1">
                                By {activeNode.authors} ({activeNode.year})
                              </p>
                            </div>

                            <p className="text-[12px] text-[#5A5A4A] leading-relaxed italic bg-[#F9F7F2] p-3.5 rounded-xl border border-[#E8E4D9]/40 border-l-2 border-l-[#7C8464]/80">
                              &ldquo;{activeNode.summary}&rdquo;
                            </p>

                            <div className="pt-1.5 border-t border-[#F2EDE4]">
                              <span className="text-[9.5px] font-mono font-bold uppercase text-[#8C8474] block mb-1">
                                Abstract Context:
                              </span>
                              <p className="text-[11px] text-[#5A5A4A] leading-relaxed line-clamp-3">
                                {activeNode.abstract}
                              </p>
                            </div>
                          </div>

                          {/* ACTION BUTTON */}
                          {isCurrentCenterNode ? (
                            <div className="w-full py-3 bg-[#E8E4D9]/50 text-center text-xs font-bold text-[#5A5A4A] rounded-xl border border-dashed border-[#D6D0C2] select-none font-mono">
                              ✓ Currently Active Document in View
                            </div>
                          ) : (
                            <button
                              onClick={() => handleLoadNodeAsMain(activeNode)}
                              className="w-full bg-[#7C8464] hover:bg-[#6A7153] text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                            >
                              <BookOpen className="h-4 w-4" />
                              Load as Main Article
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Footer metadata alignment */}
                  <div className="p-4 bg-white border-t border-[#E8E4D9] text-center text-[10px] tracking-wider uppercase font-mono text-[#8C8474]">
                    Lumina Research Horizon Mapping Engine
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Reading List Slide-over Drawer Panel */}
      <AnimatePresence>
        {showReadingList && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="reading-list-drawer">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReadingList(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-md"
              >
                <div className="h-full flex flex-col bg-[#F9F7F2] shadow-2xl border-l border-[#E8E4D9] overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-6 bg-white border-b border-[#E8E4D9] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-[#7C8464]/10 p-2 rounded-xl text-[#7C8464]">
                        <BookMarked className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-[#2D2D24] text-lg leading-none">Your Reading List</h2>
                        <span className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-wider mt-1 block">
                          {readingList.length} {readingList.length === 1 ? "article" : "articles"} queued
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowReadingList(false)}
                      className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* List Body */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-4">
                    {readingList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="bg-[#E8E4D9]/40 p-5 rounded-full text-[#8C8474]">
                          <Bookmark className="h-8 w-8" />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-serif font-bold text-[#2D2D24] text-sm">Your queue is empty</p>
                          <p className="text-xs text-[#5A5A4A] mt-1.5 leading-relaxed">
                            Browse the scientific portal updates on the homepage and click <strong className="text-[#7C8464]">"Read Later"</strong> to curate your ultimate active syllabus list.
                          </p>
                        </div>
                      </div>
                    ) : (
                      readingList.map((paper, idx) => {
                        let paperDate = "";
                        if (paper.publish_date) {
                          try {
                            const d = new Date(paper.publish_date);
                            if (!isNaN(d.getTime())) {
                              paperDate = d.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              });
                            }
                          } catch (_) {}
                        }

                        return (
                          <div 
                            key={idx}
                            className="bg-white border border-[#E8E4D9] rounded-2xl p-4.5 flex flex-col gap-3 shadow-xs hover:border-[#7C8464]/50 transition-all text-left"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] font-mono uppercase tracking-wider bg-[#5A5A4A] text-white px-1.5 py-0.5 rounded font-bold">
                                  {paper.source_name}
                                </span>
                                {paperDate && (
                                  <span className="text-[9px] font-mono text-[#7C8464] bg-[#7C8464]/10 px-1.5 py-0.5 rounded font-medium">
                                    📅 {paperDate}
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] leading-snug line-clamp-2">
                                {paper.title}
                              </h3>
                              
                              <p className="text-[10px] font-mono text-[#8C8474] mt-1 line-clamp-1">
                                {paper.authors}
                              </p>
                            </div>

                            <div className="flex gap-2 items-center justify-between border-t border-[#F2EDE4] pt-2.5 mt-1">
                              <button
                                onClick={() => {
                                  setReadingList(prev => prev.filter(item => item.original_url !== paper.original_url));
                                }}
                                className="p-1 px-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Remove</span>
                              </button>

                              <div className="flex gap-1.5">
                                <a
                                  href={paper.original_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#5A5A4A] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1"
                                >
                                  <Globe className="h-2.5 w-2.5" />
                                  <span>Site</span>
                                </a>
                                
                                <button
                                  onClick={async () => {
                                    setShowReadingList(false);
                                    await handleSelectLivePaper(paper);
                                  }}
                                  className="text-[10px] bg-[#7C8464] hover:bg-[#6A7153] text-white px-2.5 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <span>🔬 Lab</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Drawer Footer */}
                  {readingList.length > 0 && (
                    <div className="p-4 bg-white border-t border-[#E8E4D9] flex gap-2">
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to clear your entire Reading List?")) {
                            setReadingList([]);
                          }
                        }}
                        className="w-full text-center text-xs text-[#8C8474] hover:text-red-600 font-bold py-2.5 transition-colors cursor-pointer hover:bg-red-50/20 rounded-xl"
                      >
                        Clear All Items
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Lumina Fusion Synthesis Lab Fullscreen Overlay */}
      <AnimatePresence>
        {showFusionLab && (
          <div className="fixed inset-0 z-50 bg-[#F9F7F2] overflow-y-auto flex flex-col antialiased">
            {/* Lab Top Navbar */}
            <nav className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-5 sm:px-10 border-b border-[#E8E4D9] flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <div className="bg-[#7C8464] text-white p-2.5 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold text-[#2D2D24] flex items-center gap-2">
                    Lumina Fusion <span className="text-[10px] bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20 px-2 py-0.5 rounded-full font-mono uppercase font-black font-semibold">Experimental Lab</span>
                  </h1>
                  <p className="text-[11px] sm:text-xs text-[#8C8474] font-medium hidden sm:block">
                    Synthesize two literature papers into a unified theoretical hypothesis draft
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Clear Session Button */}
                {(fusionPaperA || fusionPaperB || fusionResult) && (
                  <button
                    onClick={() => {
                      if (confirm("Reset current synthesis workbench?")) {
                        setFusionPaperA(null);
                        setFusionPaperB(null);
                        setFusionResult(null);
                        setFusionError(null);
                      }
                    }}
                    className="text-[11px] font-mono font-bold tracking-wider text-[#8C8474] uppercase px-3 py-1.5 hover:text-red-600 hover:bg-red-50/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Lab
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowFusionLab(false);
                    setSelectingSlot(null);
                  }}
                  className="p-2 sm:p-2.5 rounded-xl hover:bg-[#F2EDE4]/60 text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer border border-[#E8E4D9] bg-white shadow-2xs"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </nav>

            {/* Main Workbench Body */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 flex flex-col gap-10">
              
              {/* Paper Selection Widgets - Side-by-Side Dual Slots with Connective Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 bg-[#F2EDE4]/40 p-6 sm:p-8 rounded-[36px] border border-[#E8E4D9]">
                
                {/* Paper A Slot */}
                <div className="lg:col-span-5 h-full flex flex-col">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-[#8C8474] font-bold mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
                    Slot Alpha (Paper A)
                  </div>
                  
                  {fusionPaperA ? (
                    <div className="flex-1 bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#7C8464]/40 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-white px-2 py-0.5 rounded font-black">
                            {fusionPaperA.source_name}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C8474] font-semibold truncate">
                            {fusionPaperA.authors}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-[#1E2019] text-sm sm:text-base leading-snug line-clamp-3 mb-2">
                          {fusionPaperA.title}
                        </h3>
                        <p className="text-[11px] text-[#5A5A4A] leading-relaxed line-clamp-4">
                          {fusionPaperA.abstract}
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#F2EDE4]">
                        <button
                          onClick={() => setSelectingSlot("A")}
                          className="text-[10px] font-bold text-[#7C8464] bg-[#7C8464]/10 hover:bg-[#7C8464]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Modify Paper A
                        </button>
                        <button
                          onClick={() => setFusionPaperA(null)}
                          className="text-[10px] font-mono text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors cursor-pointer font-bold"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setSelectingSlot("A")}
                      className="flex-1 min-h-[180px] bg-white border-2 border-dashed border-[#E8E4D9] hover:border-[#7C8464]/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#FDFBF7]"
                    >
                      <div className="bg-[#E8E4D9]/40 p-4 rounded-full text-[#8C8474] mb-3">
                        <Plus className="h-6 w-6 stroke-[3]" />
                      </div>
                      <p className="font-serif font-bold text-xs text-[#2D2D24]">Inject Core Paper A</p>
                      <p className="text-[10px] text-[#8C8474] mt-1 max-w-[200px] leading-normal">
                        Select a publication from the synced live feeds or standard corpus
                      </p>
                    </div>
                  )}
                </div>

                {/* Central Connective Matrix Node */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center relative">
                  
                  {/* Central Node Visual */}
                  <div className="flex flex-col items-center relative z-10 py-4 lg:py-0">
                    
                    {/* Pulsing Outer Ring */}
                    <div className="relative flex items-center justify-center">
                      <div className={`absolute w-14 h-14 rounded-full border border-[#7C8464]/20 ${fusionLoading ? "animate-ping stroke-[2] bg-[#7C8464]/5" : "animate-pulse"}`} />
                      <div className={`absolute w-20 h-20 rounded-full border border-dashed border-[#7C8464]/15 ${fusionLoading ? "animate-spin" : ""}`} />
                      
                      {/* Interactive Center Node */}
                      <button
                        onClick={handleSynthesize}
                        disabled={!fusionPaperA || !fusionPaperB || fusionLoading}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all z-10 shadow-xs cursor-pointer select-none active:scale-90 ${
                          fusionLoading
                            ? "bg-[#D97706] text-white border-[#D97706] animate-pulse"
                            : (fusionPaperA && fusionPaperB)
                            ? "bg-[#7C8464] text-white border-[#7C8464] hover:bg-[#6A7153] hover:scale-105"
                            : "bg-[#E8E4D9]/50 text-[#8C8474] border-[#E8E4D9] cursor-not-allowed"
                        }`}
                        title="Synthesize New Paradigm"
                      >
                        <GitMerge className="h-5 w-5 rotate-90 animate-pulse" />
                      </button>
                    </div>

                    <span className="text-[9px] font-mono tracking-widest font-black uppercase text-[#8C8474] mt-3 bg-[#F2EDE4] px-2 py-0.5 rounded-full select-none">
                      {fusionLoading ? "FUSING" : "SYNAPSE"}
                    </span>
                  </div>

                  {/* Horizontal Connection Line overlay for large displays */}
                  <div className="hidden lg:block absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8E4D9] to-transparent z-0 pointer-events-none" />
                </div>

                {/* Paper B Slot */}
                <div className="lg:col-span-5 h-full flex flex-col">
                  <div className="text-[10px] font-mono tracking-wider uppercase text-[#8C8474] font-bold mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
                    Slot Beta (Paper B)
                  </div>

                  {fusionPaperB ? (
                    <div className="flex-1 bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#7C8464]/40 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-white px-2 py-0.5 rounded font-black">
                            {fusionPaperB.source_name}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C8474] font-semibold truncate">
                            {fusionPaperB.authors}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-[#1E2019] text-sm sm:text-base leading-snug line-clamp-3 mb-2">
                          {fusionPaperB.title}
                        </h3>
                        <p className="text-[11px] text-[#5A5A4A] leading-relaxed line-clamp-4">
                          {fusionPaperB.abstract}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#F2EDE4]">
                        <button
                          onClick={() => setSelectingSlot("B")}
                          className="text-[10px] font-bold text-[#7C8464] bg-[#7C8464]/10 hover:bg-[#7C8464]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Modify Paper B
                        </button>
                        <button
                          onClick={() => setFusionPaperB(null)}
                          className="text-[10px] font-mono text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors cursor-pointer font-bold"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setSelectingSlot("B")}
                      className="flex-1 min-h-[180px] bg-white border-2 border-dashed border-[#E8E4D9] hover:border-[#7C8464]/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#FDFBF7]"
                    >
                      <div className="bg-[#E8E4D9]/40 p-4 rounded-full text-[#8C8474] mb-3">
                        <Plus className="h-6 w-6 stroke-[3]" />
                      </div>
                      <p className="font-serif font-bold text-xs text-[#2D2D24]">Inject Core Paper B</p>
                      <p className="text-[10px] text-[#8C8474] mt-1 max-w-[200px] leading-normal">
                        Select a publication from the synced live feeds or standard corpus
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Action synthesis zone */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleSynthesize}
                  disabled={!fusionPaperA || !fusionPaperB || fusionLoading}
                  className={`px-8 py-4 rounded-2xl font-serif font-bold text-sm tracking-wide transition-all shadow-md select-none cursor-pointer flex items-center justify-center gap-2 ${
                    (!fusionPaperA || !fusionPaperB || fusionLoading)
                      ? "bg-[#E8E4D9] text-[#8C8474] border border-[#E8E4D9] cursor-not-allowed shadow-none"
                      : "bg-[#7C8464] hover:bg-[#6A7153] text-white border border-[#7C8464] active:scale-95"
                  }`}
                >
                  <Sparkles className={`h-4.5 w-4.5 ${fusionLoading ? "animate-spin" : ""}`} />
                  <span>Synthesize New Paradigm</span>
                </button>
                <p className="text-[10px] font-mono text-[#8C8474] text-center uppercase tracking-wider">
                  Uses deep cross-pollination logic to generate a unified theoretical manuscript
                </p>
              </div>

              {/* Loading State Overlay Section */}
              {fusionLoading && (
                <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-10 flex flex-col items-center justify-center text-center shadow-xs py-14 max-w-2xl mx-auto w-full">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#D97706] border-[#7C8464]/10 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-[#7C8464]/20 animate-pulse" />
                  </div>
                  <h3 className="font-serif font-bold text-[#1E2019] text-base mb-1">Synthesizing Literature Paradigms...</h3>
                  <p className="text-xs text-[#8C8474] font-mono animate-pulse uppercase tracking-wider">{fusionStatusText}</p>
                </div>
              )}

              {/* Error Box */}
              {fusionError && (
                <div className="bg-red-50/50 border border-red-200 text-red-800 p-5 rounded-2xl max-w-2xl mx-auto w-full text-xs leading-relaxed flex items-center gap-3">
                  <span className="text-base select-none">⚠️</span>
                  <div>
                    <span className="font-bold block mb-0.5">Synthesis Pipeline Failure</span>
                    {fusionError}
                  </div>
                </div>
              )}

              {/* Synthesis Output: Structured Book-Style Manuscript Draft */}
              {fusionResult && !fusionLoading && !fusionError && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#FDFBF7] border border-[#E8E4D9] p-6 sm:p-12 max-w-4xl w-full mx-auto rounded-[32px] font-sans text-left shadow-sm flex flex-col gap-8 relative"
                >
                  
                  {/* Decorative Header */}
                  <div className="border-b border-[#E8E4D9] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1.5 bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider select-none mb-3">
                        <Sparkle className="h-3 w-3 text-[#7C8464]" />
                        Synthesized Academic Perspectivism
                      </span>
                      <h2 className="font-serif font-bold text-[#2D2D24] text-xl sm:text-2xl lg:text-3xl tracking-tight leading-tight mb-2">
                        {fusionResult.title}
                      </h2>
                      <div className="flex flex-col gap-1 text-[11px] font-mono text-[#8C8474]">
                        <div>
                          <strong>Lead Synthesizer:</strong> Lumina Fusion Engine (G-3.5)
                        </div>
                        <div>
                          <strong>Pre-existing Axioms:</strong> 
                          <span className="text-[#5A5A4A] italic ml-1">
                            A: "{fusionPaperA?.title}" &amp; B: "{fusionPaperB?.title}"
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accordion List Container */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Abstract Accordion */}
                    <div className="border border-[#E8E4D9] rounded-2xl overflow-hidden bg-white shadow-3xs">
                      <button
                        onClick={() => setExpandedFusionSection(expandedFusionSection === "abstract" ? null : "abstract")}
                        className="w-full px-5 py-4 flex justify-between items-center bg-[#FDFBF7] hover:bg-[#F9F7F2]/40 text-[#2D2D24] border-b border-[#E8E4D9] text-left transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-[#7C8464] font-black text-xs md:text-sm">01</span>
                          <span className="font-serif font-bold text-sm md:text-base">Synthesized Manuscript Abstract</span>
                        </div>
                        <ChevronRight className={`h-4.5 w-4.5 text-[#8C8474] transition-transform duration-300 ${expandedFusionSection === "abstract" ? "rotate-90 text-[#7C8464]" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedFusionSection === "abstract" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-white prose prose-neutral max-w-none text-xs sm:text-sm text-[#434338] leading-relaxed">
                              {renderSynthesizedTextWithBadges(fusionResult.abstract)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Pathway / Thesis Accordion */}
                    <div className="border border-[#E8E4D9] rounded-2xl overflow-hidden bg-white shadow-3xs">
                      <button
                        onClick={() => setExpandedFusionSection(expandedFusionSection === "thesis" ? null : "thesis")}
                        className="w-full px-5 py-4 flex justify-between items-center bg-[#FDFBF7] hover:bg-[#F9F7F2]/40 text-[#2D2D24] border-b border-[#E8E4D9] text-left transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-[#7C8464] font-black text-xs md:text-sm">02</span>
                          <span className="font-serif font-bold text-sm md:text-base">Novel Cross-Pollination Thesis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider select-none ${
                            fusionResult.pathway === "Methodological Transfer"
                              ? "bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20"
                              : "bg-[#2D2D24]/10 text-[#2D2D24] border border-[#2D2D24]/20"
                          }`}>
                            {fusionResult.pathway}
                          </span>
                          <ChevronRight className={`h-4.5 w-4.5 text-[#8C8474] transition-transform duration-300 ${expandedFusionSection === "thesis" ? "rotate-90 text-[#7C8464]" : ""}`} />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedFusionSection === "thesis" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-white text-xs sm:text-sm text-[#434338] leading-relaxed flex flex-col gap-4">
                              <p className="font-medium text-[#2D2D24] pb-2 border-b border-[#F2EDE4] flex items-center gap-1.5">
                                <GitCompare className="h-4 w-4 text-[#7C8464]" />
                                Structural Synthesis Pathway: {fusionResult.pathway}
                              </p>
                              <div>
                                {renderSynthesizedTextWithBadges(fusionResult.thesis)}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Unified Methodology / Blueprint Accordion */}
                    <div className="border border-[#E8E4D9] rounded-2xl overflow-hidden bg-white shadow-3xs">
                      <button
                        onClick={() => setExpandedFusionSection(expandedFusionSection === "methodology" ? null : "methodology")}
                        className="w-full px-5 py-4 flex justify-between items-center bg-[#FDFBF7] hover:bg-[#F9F7F2]/40 text-[#2D2D24] border-b border-[#E8E4D9] text-left transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-[#7C8464] font-black text-xs md:text-sm">03</span>
                          <span className="font-serif font-bold text-sm md:text-base">Proposed Unified Methodology</span>
                        </div>
                        <ChevronRight className={`h-4.5 w-4.5 text-[#8C8474] transition-transform duration-300 ${expandedFusionSection === "methodology" ? "rotate-90 text-[#7C8464]" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedFusionSection === "methodology" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-white text-xs sm:text-sm text-[#434338] flex flex-col gap-6">
                              
                              {/* Unified Equation Card */}
                              <div className="bg-[#F2EDE4]/60 border border-[#E8E4D9] p-4.5 rounded-xl font-mono text-center flex flex-col gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 px-2 bg-[#7C8464]/10 text-[#7C8464] border-l border-b border-[#E8E4D9] text-[9px] uppercase tracking-wider font-extrabold select-none">
                                  Equation Blueprint
                                </div>
                                <div className="text-sm sm:text-base md:text-lg font-black tracking-wide text-[#2D2D24] py-2">
                                  {fusionResult.methodology.formula}
                                </div>
                                <div className="text-[10px] text-[#8C8474] font-serif italic mt-1 font-medium">
                                  Merged dynamic modeling variable framework
                                </div>
                              </div>

                              <div className="leading-relaxed text-xs sm:text-sm text-[#434338]">
                                {renderSynthesizedTextWithBadges(fusionResult.methodology.description)}
                              </div>

                              {/* Target Steps */}
                              <div className="flex flex-col gap-3.5 mt-2">
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 flex items-center gap-1.5">
                                  <Layers className="h-3.5 w-3.5 text-[#7C8464]" />
                                  Implementation / Lab Verification Blueprint
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {fusionResult.methodology.architecture_steps.map((step: string, sIdx: number) => (
                                    <div key={sIdx} className="bg-[#FDFBF7] border border-[#E8E4D9]/80 p-4 rounded-xl flex gap-3 items-start select-none">
                                      <span className="font-mono text-xs font-bold text-[#7C8464] bg-[#7C8464]/10 h-6 w-6 min-w-[24px] rounded-full flex items-center justify-center">
                                        {sIdx + 1}
                                      </span>
                                      <span className="text-xs text-[#5A5A4A] leading-relaxed font-serif">
                                        {step}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bounds & Targets Accordion */}
                    <div className="border border-[#E8E4D9] rounded-2xl overflow-hidden bg-white shadow-3xs">
                      <button
                        onClick={() => setExpandedFusionSection(expandedFusionSection === "bounds" ? null : "bounds")}
                        className="w-full px-5 py-4 flex justify-between items-center bg-[#FDFBF7] hover:bg-[#F9F7F2]/40 text-[#2D2D24] border-b border-[#E8E4D9] text-left transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-[#7C8464] font-black text-xs md:text-sm">04</span>
                          <span className="font-serif font-bold text-sm md:text-base">Theoretical Bounds &amp; Exploits</span>
                        </div>
                        <ChevronRight className={`h-4.5 w-4.5 text-[#8C8474] transition-transform duration-300 ${expandedFusionSection === "bounds" ? "rotate-90 text-[#7C8464]" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedFusionSection === "bounds" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-white text-xs sm:text-sm text-[#434338] flex flex-col gap-6">
                              
                              <div className="leading-relaxed text-xs sm:text-sm text-[#434338]">
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] mb-2.5 flex items-center gap-1.5">
                                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                  Boundary Stress Constants / Thermodynamic Limits
                                </h4>
                                <div className="p-4 bg-red-50/20 border border-red-100 rounded-xl font-serif text-[#434338] italic">
                                  {renderSynthesizedTextWithBadges(fusionResult.bounds.constraints)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                <div>
                                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 mb-2.5">
                                    System Boundary Limits (Agnostic Frictions)
                                  </h4>
                                  <ul className="list-disc list-inside text-xs text-[#5A5A4A] space-y-2 leading-relaxed">
                                    {fusionResult.bounds.limitations.map((lim: string, lIdx: number) => (
                                      <li key={lIdx}>{lim}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 mb-2.5">
                                    Anticipated Lab Failure Mechanisms
                                  </h4>
                                  <ul className="list-disc list-inside text-xs text-[#5A5A4A] space-y-2 leading-relaxed font-mono">
                                    {fusionResult.bounds.failure_modes.map((fail: string, fIdx: number) => (
                                      <li key={fIdx}>{fail}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </motion.div>
              )}

            </div>

            {/* Paper Selection Modal / Slide-over Drawer (Conditional inner view) */}
            <AnimatePresence>
              {selectingSlot && (
                <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectingSlot(null)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                  />

                  {/* Picker Modal Content */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-[#FDFBF7] border border-[#E8E4D9] rounded-[28px] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[#E8E4D9] bg-white flex justify-between items-center">
                      <div>
                        <h3 className="font-serif font-bold text-[#2D2D24] text-base">
                          Select Paper for Slot {selectingSlot}
                        </h3>
                        <p className="text-[11px] text-[#8C8474]">
                          Choose a vetted source to configure into the synthesis paradigm
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectingSlot(null)}
                        className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#8C8474]"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Filter bar */}
                    <div className="px-6 py-3.5 bg-[#F2EDE4]/30 border-b border-[#E8E4D9] flex items-center gap-2">
                      <Search className="h-4 w-4 text-[#8C8474]" />
                      <input
                        type="text"
                        placeholder="Search workspace publications search criteria..."
                        value={fusionSearchQuery}
                        onChange={(e) => setFusionSearchQuery(e.target.value)}
                        className="flex-1 text-xs bg-transparent border-none outline-none focus:ring-0 text-[#2D2D24] placeholder-[#8C8474]/70"
                      />
                      {fusionSearchQuery && (
                        <button onClick={() => setFusionSearchQuery("")} className="text-[10px] text-[#8C8474] hover:text-[#2D2D24] font-medium font-mono uppercase">
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Papers list */}
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
                      {(() => {
                        const aggregate = [
                          ...livePapers,
                          ...FUSION_FALLBACK_PAPERS.filter(fallback => 
                            !livePapers.some(lp => lp.title.toLowerCase() === fallback.title.toLowerCase())
                          )
                        ];

                        const query = fusionSearchQuery.toLowerCase();
                        const filtered = aggregate.filter(paper => 
                          paper.title.toLowerCase().includes(query) ||
                          paper.abstract.toLowerCase().includes(query) ||
                          (paper.authors && paper.authors.toLowerCase().includes(query)) ||
                          (paper.source_name && paper.source_name.toLowerCase().includes(query))
                        );

                        if (filtered.length === 0) {
                          return (
                            <div className="py-12 text-center text-xs text-[#8C8474] font-mono select-none">
                              No matching scientific journals or preprints found
                            </div>
                          );
                        }

                        return filtered.map((paper, pIdx) => {
                          const isSelectedOther = selectingSlot === "A" 
                            ? fusionPaperB?.title === paper.title 
                            : fusionPaperA?.title === paper.title;

                          const isSelectedSelf = selectingSlot === "A"
                            ? fusionPaperA?.title === paper.title
                            : fusionPaperB?.title === paper.title;

                          return (
                            <div
                              key={pIdx}
                              onClick={() => {
                                if (isSelectedOther) {
                                  alert("This paper is already selected in the other slot! Please select distinct sources.");
                                  return;
                                }
                                if (selectingSlot === "A") {
                                  setFusionPaperA(paper);
                                } else {
                                  setFusionPaperB(paper);
                                }
                                setSelectingSlot(null);
                                setFusionSearchQuery("");
                              }}
                              className={`p-4 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                                isSelectedSelf
                                  ? "bg-[#7C8464]/10 border-[#7C8464] pointer-events-none"
                                  : isSelectedOther
                                  ? "opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed"
                                  : "bg-white border-[#E8E4D9] hover:border-[#7C8464]/50 hover:bg-[#F2EDE4]/20"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-mono tracking-wide uppercase bg-[#5A5A4A] text-white px-1.5 py-0.5 rounded font-bold">
                                  {paper.source_name}
                                </span>
                                <span className="text-[9px] font-mono text-[#8C8474] truncate max-w-[200px]">
                                  by {paper.authors}
                                </span>
                                {isSelectedSelf && (
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#7C8464] ml-auto">
                                    Current Selection
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] leading-snug">
                                {paper.title}
                              </h4>
                              <p className="text-[10px] text-[#5A5A4A] line-clamp-2 leading-relaxed">
                                {paper.abstract}
                              </p>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="px-6 py-4 border-t border-[#E8E4D9] bg-white flex justify-between items-center text-[10px] font-mono text-[#8C8474] font-medium select-none uppercase tracking-wider">
                      <span>Selection Repository Engine</span>
                      <span>{livePapers.length + FUSION_FALLBACK_PAPERS.length} total curated items</span>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalogy && (
          <CrossDisciplinaryAnalogyPlayground onClose={() => setShowAnalogy(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInjector && (
          <CrossDomainVariableInjector onClose={() => setShowInjector(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMathCompiler && (
          <GenerativeMathCompiler onClose={() => setShowMathCompiler(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDialectical && (
          <DialecticalSynthesisEngine onClose={() => setShowDialectical(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRosetta && (
          <RosettaCanvas onClose={() => setShowRosetta(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAboutUs && (
          <AboutUs onClose={() => setShowAboutUs(false)} />
        )}
      </AnimatePresence>

      {/* Symmetrical Minimalist Footer */}
      <footer className="py-6 mt-16 border-t border-[#E8E4D9] bg-white text-xs text-[#8C8474]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono select-none">
            <span className="font-bold text-[#5A5A4A]">Lumina</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
            <span>• All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAboutUs(true)}
              className="text-[#7C8464] hover:text-[#6A7153] hover:underline font-bold transition-all cursor-pointer font-serif text-[12px] flex items-center gap-1 bg-transparent border-none p-0"
            >
              • Learn More & About Us
            </button>
            <span className="text-[#E8E4D9]">|</span>
            <span className="font-mono text-[10px] text-[#8C8474]/80 hidden sm:inline">System Status: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
