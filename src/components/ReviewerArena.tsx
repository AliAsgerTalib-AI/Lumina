import React, { useState, useEffect } from "react";
import {
  X,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Award,
  RefreshCw,
  TrendingDown,
  Gauge,
  Flame,
  Award as PrizeIcon,
  BookOpen,
  Send,
  Lock,
  ChevronRight,
  ClipboardCheck,
  User,
  Activity,
  FileCheck2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FlawItem {
  id: string;
  name: string;
  issue: string;
  parameterName: string;
  parameterUnit: string;
  minVal: number;
  maxVal: number;
  defaultVal: number;
  breakingMin: number;
  breakingRule: "above" | "below" | "outside";
  stabilityTerm: string;
  impactMessageStable: string;
  impactMessageDegraded: string;
}

interface ReviewerArenaProps {
  paperTitle: string;
  onClose: () => void;
}

// Domain categorizer
const getDomainFromTitle = (title: string): string => {
  const cleanTitle = title || "Current Study";
  if (
    cleanTitle.toLowerCase().includes("biolog") ||
    cleanTitle.toLowerCase().includes("genet") ||
    cleanTitle.toLowerCase().includes("protein") ||
    cleanTitle.toLowerCase().includes("nutrient") ||
    cleanTitle.toLowerCase().includes("crop") ||
    cleanTitle.toLowerCase().includes("cell")
  ) {
    return "Bioinformatics & Genetics";
  } else if (
    cleanTitle.toLowerCase().includes("climate") ||
    cleanTitle.toLowerCase().includes("carbon") ||
    cleanTitle.toLowerCase().includes("ecolog") ||
    cleanTitle.toLowerCase().includes("soil")
  ) {
    return "Environmental Sciences";
  } else if (
    cleanTitle.toLowerCase().includes("quantum") ||
    cleanTitle.toLowerCase().includes("physic") ||
    cleanTitle.toLowerCase().includes("optics")
  ) {
    return "Quantum Mechanics & Physics";
  }
  return "AI and ML Foundations";
};

// Complete flaw database tailored strictly to paper categories
const FLAWS_BY_DOMAIN: Record<string, FlawItem[]> = {
  "AI and ML Foundations": [
    {
      id: "ai-flaw-1",
      name: "Asynchronous Staleness Bound (τ)",
      issue: "Reviewer #3 argues that local gradient parallel steps diverge when asynchronous update staleness (τ) exceeds the mathematical bounds of asynchronous SGD optimization.",
      parameterName: "Gradient Synchronization Staleness (τ)",
      parameterUnit: "steps",
      minVal: 0,
      maxVal: 32,
      defaultVal: 2,
      breakingMin: 12,
      breakingRule: "above",
      stabilityTerm: "Parallel Gradient Convergence Rate",
      impactMessageStable: "Asynchronous gradient update delay is within normal bounds. Bounded gradient delay guarantees sublinear convergence.",
      impactMessageDegraded: "💥 Convergence limit violated! Staleness τ exceeded the analytical stability threshold, rendering past gradients orthogonal to the active loss surface."
    },
    {
      id: "ai-flaw-2",
      name: "Hessian Spectral Learning Step Bound (η)",
      issue: "Reviewer #3 alleges that the stochastic gradient descent optimizer triggers catastrophic gradient expansion because the learning rate η violates the reciprocal spectral radius of the loss Hessian.",
      parameterName: "Optimizer Learning Rate (η)",
      parameterUnit: "",
      minVal: 0.001,
      maxVal: 0.500,
      defaultVal: 0.010,
      breakingMin: 0.180,
      breakingRule: "above",
      stabilityTerm: "Hessian Curvature Eigenvalue Stability",
      impactMessageStable: "Stable optimization step. Learning rate resides safely beneath the spectral boundary (η < 2 / λ_max).",
      impactMessageDegraded: "⚠️ Numerical step divergence! Learning rate exceeded the reciprocal spectral radius, inducing perpetual loss oscillations across narrow Hessian valleys."
    },
    {
      id: "ai-flaw-3",
      name: "Perturbation robust Radius (ε)",
      issue: "Reviewer #3 asserts that the multi-modal classification boundary lacks robust margins and is highly vulnerable to ε-bounded adversarial perturbations under PGD attacks.",
      parameterName: "Projected Gradient Noise Radius (ε)",
      parameterUnit: "%",
      minVal: 0,
      maxVal: 50,
      defaultVal: 2,
      breakingMin: 15,
      breakingRule: "above",
      stabilityTerm: "Adversarial Robustness Metric",
      impactMessageStable: "Input robustness bounds maintain high classification confidence. Boundary margins absorb ambient parameter perturbations.",
      impactMessageDegraded: "❌ Classification boundary collapse! Perturbation magnitude ε exceeded the dataset's robust separation margin, creating intersecting decision subspaces."
    }
  ],
  "Bioinformatics & Genetics": [
    {
      id: "bio-flaw-1",
      name: "Helical Folding Duplex Stability (ΔG)",
      issue: "Reviewer #3 challenges the primary gene-synthesis mapping model, claiming polypeptide folding thermodynamic parameters violate Gibbs free energy thresholds (ΔG = ΔH - TΔS) at high temperatures.",
      parameterName: "Assay Incubation Temp",
      parameterUnit: "°C",
      minVal: 25,
      maxVal: 55,
      defaultVal: 37,
      breakingMin: 34,
      breakingRule: "outside",
      stabilityTerm: "Gibbs Free Energy Conformational Index",
      impactMessageStable: "Stable helical folding parameters (ΔG < 0). Biopolymer hydrogen bonds and structural loops remain active.",
      impactMessageDegraded: "💥 Molecular denaturation! Thermodynamic temperature shift flipped ΔG to positive values, melting amide alignment structures."
    },
    {
      id: "bio-flaw-2",
      name: "Read Repeat Shannon Entropy (H)",
      issue: "Reviewer #3 argues that long-read genomic sequence alignments decay and output high false-positive rates when processing repetitive chromosomal structures.",
      parameterName: "Sequence Read Repeat Density",
      parameterUnit: "bits",
      minVal: 0.1,
      maxVal: 4.5,
      defaultVal: 1.2,
      breakingMin: 2.8,
      breakingRule: "above",
      stabilityTerm: "Alignment Heuristics Specificity Ratio",
      impactMessageStable: "High sequence alignment specificity. Unique k-mer seeds match correctly within structural chromosomes.",
      impactMessageDegraded: "⚠️ Seed alignment saturation! Complex repetition entropy created massive duplicate hits, exceeding maximum alignment stack bounds."
    },
    {
      id: "bio-flaw-3",
      name: "Population Stratification Index (λ_GC)",
      issue: "Reviewer #3 argues that the association findings are a statistical artifact of cryptic genetic ancestry, inflating the genomic control factor (λ_GC) past critical limits.",
      parameterName: "Genomic Control Factor (λ_GC)",
      parameterUnit: "",
      minVal: 1.0,
      maxVal: 2.5,
      defaultVal: 1.05,
      breakingMin: 1.25,
      breakingRule: "above",
      stabilityTerm: "False Positive Association Control Rate",
      impactMessageStable: "Accurate association mapping. Statistical adjustments safely mitigate population stratification artifacts.",
      impactMessageDegraded: "❌ Confounding stratification bias! Genomic inflation factor λ_GC indicates significant false-positive markers, invaliding the primary association claim."
    }
  ],
  "Environmental Sciences": [
    {
      id: "env-flaw-1",
      name: "Soil Carbon Degradation Rate (Q_10)",
      issue: "Reviewer #3 argues that climate feedback projections underestimate the Q_10 temperature coefficient, leading to unrepresentative carbon respiration estimates.",
      parameterName: "Respiration Temperature Coefficient (Q_10)",
      parameterUnit: "",
      minVal: 1.5,
      maxVal: 4.5,
      defaultVal: 2.1,
      breakingMin: 3.2,
      breakingRule: "above",
      stabilityTerm: "Active Carbon Retention Ratio",
      impactMessageStable: "Predictive carbon sequestration balances are stable. Thermal feedback maintains physiological bounds.",
      impactMessageDegraded: "💥 Tipping point exceeded! High Q_10 coefficient outputs rapid microbial decay, converting the carbon sink into an active methane source."
    },
    {
      id: "env-flaw-2",
      name: "Darcy Hydraulic Fluid Transport (K_sat)",
      issue: "Reviewer #3 claims that water-transport simulations violate Darcy equations under saturated hydraulic conductivity (K_sat) limits, causing severe moisture runoff anomalies.",
      parameterName: "Soil Saturated Conductivity (K_sat)",
      parameterUnit: "cm/h",
      minVal: 0.1,
      maxVal: 10.0,
      defaultVal: 1.2,
      breakingMin: 4.5,
      breakingRule: "above",
      stabilityTerm: "Soil Hydraulic Balance Retention",
      impactMessageStable: "Hydrologic equilibrium maintained. Fluid percolation matches agricultural infiltration curves.",
      impactMessageDegraded: "⚠️ Surface desiccation & flash runoff! Extreme saturated fluid flow bypassed local soil capillary storage margins."
    },
    {
      id: "env-flaw-3",
      name: "Analyzer Instrumentation Noise (SNR)",
      issue: "Reviewer #3 argues that infrared gas analyzer uncertainties and low Eddy Covariance signal-to-noise ratios compromise carbon capture conclusions.",
      parameterName: "Gas Analyzer Signal-to-Noise Ratio",
      parameterUnit: "dB",
      minVal: 5,
      maxVal: 70,
      defaultVal: 45,
      breakingMin: 20,
      breakingRule: "below",
      stabilityTerm: "Instrumental Measurement Confidence Level",
      impactMessageStable: "Negligible measurement error. High SNR levels isolate carbon capture fluctuations correctly from ambient wind noise.",
      impactMessageDegraded: "❌ Instrumental noise takeover! Low SNR degraded gas density measurements, rendering carbon influx patterns statistically indistinguishable."
    }
  ],
  "Quantum Mechanics & Physics": [
    {
      id: "phy-flaw-1",
      name: "Geomagnetic Attenuation Protection (S)",
      issue: "Reviewer #3 asserts that nested Mu-metal shielding attenuation ratios (S) fail to isolate superconducting registers from external laboratory fluctuations.",
      parameterName: "Shielding Attenuation Ratio (S)",
      parameterUnit: "dB",
      minVal: 20,
      maxVal: 110,
      defaultVal: 80,
      breakingMin: 45,
      breakingRule: "below",
      stabilityTerm: "Geomagnetic Drift Insensivity",
      impactMessageStable: "External electromagnetic noise isolated. Magnetic vector trajectories remain safe.",
      impactMessageDegraded: "💥 Qubit coherence collapse! Low shielding attenuation allowed external magnetic field drift to decouple superconducting trajectories."
    },
    {
      id: "phy-flaw-2",
      name: "Phonon Scattering Thermal Drift",
      issue: "Reviewer #3 argues that cryostat temperature spikes trigger phononic energy transfer, causing thermal acoustic phase relaxation.",
      parameterName: "Liquid Helium Cryostat Temp",
      parameterUnit: "mK",
      minVal: 5,
      maxVal: 120,
      defaultVal: 15,
      breakingMin: 65,
      breakingRule: "above",
      stabilityTerm: "Superposition Phase Insensitivity Index",
      impactMessageStable: "Cryogenic stabilization prevents thermal excitation of acoustic lattice modes.",
      impactMessageDegraded: "⚠️ Phonon-induced decoherence! Temperature rise triggered phase relaxation rates scaling with T^5, collapsing quantum states."
    },
    {
      id: "phy-flaw-3",
      name: "Phase Decoherence Boundary (T_2)",
      issue: "Reviewer #3 claims the reported quantum gates violate strict decoherence limits (T_2 phase lifetime), making the algorithmic runtimes invalid.",
      parameterName: "Transmon Qubit Coherence Life (T_2)",
      parameterUnit: "μs",
      minVal: 1,
      maxVal: 180,
      defaultVal: 115,
      breakingMin: 40,
      breakingRule: "below",
      stabilityTerm: "Gate Operations Fidelity Margin",
      impactMessageStable: "Coherence life matches gate execution sequence. Algorithmic steps complete fully inside the T_2 window.",
      impactMessageDegraded: "❌ Gate fidelity collapse! Phase lifetime T_2 dropped underneath the cumulative gate delay sum, introducing phase errors."
    }
  ]
};

export default function ReviewerArena({ paperTitle, onClose }: ReviewerArenaProps) {
  const domain = getDomainFromTitle(paperTitle);
  const flaws = FLAWS_BY_DOMAIN[domain] || FLAWS_BY_DOMAIN["AI and ML Foundations"];

  // Game States
  const [activeFlawIndex, setActiveFlawIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(flaws[0].defaultVal);
  const [documentedFlaws, setDocumentedFlaws] = useState<Record<string, boolean>>({});
  const [recordedThresholds, setRecordedThresholds] = useState<Record<string, number>>({});
  const [researcherName, setResearcherName] = useState("");
  const [reviewVerdict, setReviewVerdict] = useState<"pending" | "submitted">("pending");
  const [copiedText, setCopiedText] = useState(false);

  const activeFlaw = flaws[activeFlawIndex];

  // Helper check if current value is degraded/breaking point
  const isCurrentlyDegraded = (flaw: FlawItem, value: number) => {
    if (flaw.breakingRule === "above") {
      return value >= flaw.breakingMin;
    } else if (flaw.breakingRule === "below") {
      return value <= flaw.breakingMin;
    } else if (flaw.breakingRule === "outside") {
      // outside 34 to 41 for bioinformatics, outside 25 to 75 for environmental
      const lowerBound = flaw.breakingMin; // 34 or 25
      const upperBound = flaw.id === "bio-flaw-1" ? 41 : 75;
      return value < lowerBound || value > upperBound;
    }
    return false;
  };

  // Live status logic for metric
  const getLiveStabilityMetric = (flaw: FlawItem, value: number) => {
    const degraded = isCurrentlyDegraded(flaw, value);
    if (degraded) {
      if (flaw.breakingRule === "above") {
        const excess = (value - flaw.breakingMin) / (flaw.maxVal - flaw.breakingMin);
        return Math.max(12, Math.round(45 - excess * 30));
      } else if (flaw.breakingRule === "below") {
        const deficit = (flaw.breakingMin - value) / (flaw.breakingMin - flaw.minVal);
        return Math.max(12, Math.round(45 - deficit * 35));
      } else {
        return Math.floor(15 + Math.random() * 10);
      }
    } else {
      // Stable
      if (flaw.breakingRule === "above") {
        const gap = (flaw.breakingMin - value) / (flaw.breakingMin - flaw.minVal);
        return Math.min(100, Math.round(80 + gap * 20));
      } else if (flaw.breakingRule === "below") {
        const gap = (value - flaw.breakingMin) / (flaw.maxVal - flaw.breakingMin);
        return Math.min(100, Math.round(80 + gap * 20));
      } else {
        // Bio homeostatic 34-41 (base 37)
        if (flaw.id === "bio-flaw-1") {
          const dev = Math.abs(value - 37); // dev from optimal 37
          return Math.max(82, 100 - dev * 5);
        } else {
          // Env 25-75 (base 45)
          const dev = Math.abs(value - 45); // dev from optimal 45
          return Math.max(80, 100 - dev * 0.8);
        }
      }
    }
  };

  // Reset slider when index shifts
  useEffect(() => {
    setSliderValue(activeFlaw.defaultVal);
  }, [activeFlawIndex, activeFlaw]);

  const handleDocumentFlaw = () => {
    setDocumentedFlaws((prev) => ({ ...prev, [activeFlaw.id]: true }));
    setRecordedThresholds((prev) => ({ ...prev, [activeFlaw.id]: sliderValue }));
  };

  const currentStability = getLiveStabilityMetric(activeFlaw, sliderValue);
  const currentDegraded = isCurrentlyDegraded(activeFlaw, sliderValue);

  const completedCount = Object.keys(documentedFlaws).length;
  const isAllFlawsDone = completedCount === flaws.length;

  const handleRegisterVerdict = () => {
    if (!researcherName.trim()) {
      alert("Please enter your name to register standard peer credentials on the certificate.");
      return;
    }
    setReviewVerdict("submitted");
  };

  const handleCopyToClipboard = () => {
    const certText = `LUMINA SCIENCE PORTAL - LICENSED RESEARCH REFEREE CERTIFICATE
Name: ${researcherName}
Rating Rank: Senior Academic Review Referee (Expert Post-Doctorate Class)
Paper Challenged: "${paperTitle}"
Disciplinary Domain: ${domain}
Documented Flaws Defeated:
1. ${flaws[0].name} (Breaching point logged: ${recordedThresholds[flaws[0].id]}${flaws[0].parameterUnit})
2. ${flaws[1].name} (Breaching point logged: ${recordedThresholds[flaws[1].id]}${flaws[1].parameterUnit})
3. ${flaws[2].name} (Breaching point logged: ${recordedThresholds[flaws[2].id]}${flaws[2].parameterUnit})
Status Assessment: REVIEWER #3 CHALLENGE ACCREDITED SUCCESSFUL.`;

    navigator.clipboard.writeText(certText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="reviewer-arena-panel">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
      />

      {/* Main Drawer Shell */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="relative w-full max-w-2xl bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-natural-border overflow-hidden z-10"
      >
        {/* Arena Header banner */}
        <div className="p-4 sm:p-6 bg-white border-b border-natural-border flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-amber-500/5 rotate-12 transform translate-x-12 pointer-events-none" />
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="bg-amber-950 text-[#F9F7F2] p-2 sm:p-2.5 rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-amber-800 uppercase block">
                Methodological Boundary Audit
              </span>
              <h2 className="font-serif font-black text-natural-title text-lg sm:text-2xl tracking-tight mt-0.5">
                Reviewer #3 Stress Test
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-natural-highlight text-natural-text hover:text-natural-title transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </button>
        </div>

        {reviewVerdict === "submitted" ? (
          /* CERTIFICATE OF ACCREDITATION SUCCESS */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-4 sm:gap-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
              className="w-full max-w-lg bg-white border-4 sm:border-8 border-double border-amber-900/30 p-5 sm:p-8 rounded-2xl relative shadow-xl text-center self-center"
            >
              {/* Classical Academic Stylistic Accents */}
              <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-amber-900/10 pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 bottom-5 border border-amber-900/5 pointer-events-none" />
              
              <div className="flex flex-col items-center relative z-10">
                <div className="bg-amber-900/10 p-2.5 sm:p-3.5 rounded-full mb-2 border border-amber-900/20">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-amber-900" />
                </div>
                
                <span className="font-mono text-[8px] sm:text-[9px] font-bold text-amber-800 tracking-[0.25em] uppercase">
                  Lumina Research validation Council
                </span>
                
                <h1 className="font-serif font-black text-xl sm:text-3xl text-amber-950 tracking-tight mt-1 leading-none">
                  Methodology Validation Report
                </h1>
                
                <div className="h-px w-16 sm:w-24 bg-amber-950/20 my-3 sm:my-4" />
                
                <p className="font-mono text-[8px] sm:text-[10px] text-natural-text uppercase tracking-wide">
                  This peer-review audit verifies the robustness bounds compiled by:
                </p>
                
                <h2 className="text-lg sm:text-2xl font-serif font-black text-natural-title underline decoration-amber-600 decoration-wavy decoration-1 underline-offset-4 sm:underline-offset-6 my-1.5 sm:my-2 capitalize">
                  {researcherName}
                </h2>
                
                <p className="text-[11px] sm:text-xs text-natural-text max-w-sm mt-2 leading-relaxed">
                  having successfully modeled, simulated, and stress-tested parameters under standard external configurations for:
                </p>
                <p className="text-[11px] sm:text-xs text-amber-950 italic font-serif font-bold mt-1 max-w-md line-clamp-2">
                  &ldquo;{paperTitle}&rdquo;
                </p>

                <div className="my-4 p-2.5 sm:p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl text-left w-full text-[10px] sm:text-[11px] text-natural-text font-mono leading-relaxed flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex justify-between border-b border-amber-500/10 pb-1 mb-1 text-[11px]">
                    <span className="font-bold text-amber-900 font-sans sm:font-mono">VALIDATED BOUNDARY LIMITS</span>
                    <span className="text-amber-800">INTEGRITY AUDIT</span>
                  </div>
                  {flaws.map((flaw) => (
                    <div key={flaw.id} className="flex justify-between items-start gap-1.5">
                      <span className="text-natural-title truncate max-w-[180px] sm:max-w-[280px]">✔ {flaw.name}</span>
                      <span className="text-amber-900 font-bold whitespace-nowrap">
                        Exceeded at {recordedThresholds[flaw.id]?.toFixed(flaw.id === "ai-flaw-2" ? 3 : 1)}{flaw.parameterUnit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[8px] sm:text-[9px] text-[#8C8474] text-left pt-2.5 border-t border-natural-border">
                  <div>
                    <span>AUDIT RECORD: <strong>LUM-{Math.floor(100000 + Math.random() * 900000)}</strong></span>
                    <br />
                    <span>VERIFICATION LEVEL: <strong>STANDARD DISCIPLINARY PEER</strong></span>
                  </div>
                  <div className="text-right">
                    <span>DATE: <strong>{new Date().toISOString().split("T")[0]}</strong></span>
                    <br />
                    <span>BOARD: <strong>REVIEWER #3 CORE REBUTTAL</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md mt-1">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 bg-amber-950 hover:bg-amber-900 text-[#F9F7F2] py-3 px-4 rounded-xl text-xs font-bold transition-all shadow cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 border border-amber-950"
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>{copiedText ? "Copied Report Summary!" : "Copy Audit Report"}</span>
              </button>
              <button
                onClick={() => {
                  setReviewVerdict("pending");
                  setDocumentedFlaws({});
                  setRecordedThresholds({});
                  setActiveFlawIndex(0);
                }}
                className="flex-1 bg-white hover:bg-natural-highlight border border-natural-border text-natural-text py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Test Next Article</span>
              </button>
            </div>
          </div>
        ) : (
          /* INTERACTIVE GAME SCREEN */
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-5">
            {/* Context Notice Card */}
            <div className="bg-white border border-natural-border rounded-xl p-3.5 sm:p-4.5 shadow-xs flex items-start gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-600" />
              <div className="text-xl">📊</div>
              <div>
                <h4 className="font-serif font-bold text-natural-title text-xs sm:text-sm leading-snug">
                  Validate Primary Study Boundaries
                </h4>
                <p className="text-[11px] sm:text-xs text-natural-text leading-relaxed mt-0.5">
                  Reviewer #3 claims this study's core mathematical or material claims lack robust margin testing. Adjust the parameter sliders below to find the specific thresholds where statistical models or systems collapse.
                </p>
                <p className="text-[9px] sm:text-[10px] text-amber-800 font-mono mt-1 font-bold">
                  Target: &ldquo;{paperTitle}&rdquo; • Domain: {domain}
                </p>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 bg-white border border-natural-border p-3 rounded-xl shadow-xs">
              <div className="text-center border-r border-natural-border/50">
                <span className="text-[8px] sm:text-[9px] font-mono text-[#8C8474] uppercase block">Assessed Variables</span>
                <span className="text-xs sm:text-sm font-bold font-serif text-natural-title mt-0.5 inline-block">3 Parameters</span>
              </div>
              <div className="text-center border-r border-[#E8E4D9]">
                <span className="text-[8px] sm:text-[9px] font-mono text-[#8C8474] uppercase block">Limits Logged</span>
                <span className="text-xs sm:text-sm font-bold font-serif text-natural-title mt-0.5 inline-block text-amber-700">
                  {completedCount} / 3 Complete
                </span>
              </div>
              <div className="text-center">
                <span className="text-[8px] sm:text-[9px] font-mono text-[#8C8474] uppercase block">Validation state</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-natural-title tracking-tight mt-0.5 inline-flex items-center gap-1">
                  {isAllFlawsDone ? (
                    <span className="text-emerald-700 font-serif font-black flex items-center gap-1 text-[10px] sm:text-xs">
                      ✓ COMPLETE
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] text-[#8C8474] truncate">Pending Logs</span>
                  )}
                </span>
              </div>
            </div>

            {/* Flaw Tabs */}
            <div className="flex gap-2 w-full overflow-x-auto pb-1.5 scrollbar-thin">
              {flaws.map((flaw, idx) => {
                const isSelected = activeFlawIndex === idx;
                const isChecked = documentedFlaws[flaw.id];
                return (
                  <button
                    key={flaw.id}
                    onClick={() => setActiveFlawIndex(idx)}
                    className={`flex-1 min-w-[125px] sm:min-w-[140px] text-left p-3 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                      isSelected
                        ? "bg-amber-950 text-[#F9F7F2] border-amber-950 shadow-md"
                        : isChecked
                        ? "bg-emerald-500/10 text-emerald-950 border-emerald-500/30 hover:bg-emerald-500/15"
                        : "bg-white border-natural-border text-natural-text hover:bg-natural-highlight"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1.5">
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold ${isSelected ? "text-amber-400" : "text-[#8C8474]"}`}>
                        FLAW 0{idx + 1}
                      </span>
                      {isChecked && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold font-serif mt-1 truncate pr-0.5">
                      {flaw.name}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Flaw workspace block */}
            <div className="bg-white border border-natural-border rounded-xl p-4 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5 relative">
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-[#B4A086] bg-amber-500/10 text-amber-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded">
                  ANALYTICAL BOUND WORKSPACE
                </span>
                {documentedFlaws[activeFlaw.id] && (
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-800 px-2 py-0.5 sm:py-1 rounded ml-auto flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> LOGGED
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif font-black text-natural-title text-base sm:text-lg leading-tight">
                  {activeFlaw.name}
                </h3>
                <p className="text-xs text-natural-text/90 italic bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 leading-relaxed mt-2.5 relative">
                  <span className="absolute -left-1.5 -top-1.5 text-lg font-serif opacity-30 select-none">“</span>
                  <strong>Reviewer #3 Critique:</strong> {activeFlaw.issue}
                  <span className="absolute -right-1.5 -bottom-1.5 text-lg font-serif opacity-30 select-none">”</span>
                </p>
              </div>

              {/* Stress testing control widget */}
              <div className="bg-[#FAF8F5] border border-natural-border p-4 sm:p-5 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-natural-primary font-bold">
                    ADJUST BOUNDARY VARIABLE
                  </span>
                  <span className="text-xs font-mono text-[#8C8474]">
                    Stable boundary:{" "}
                    <strong>
                      {activeFlaw.breakingRule === "above" && `< ${activeFlaw.breakingMin}`}
                      {activeFlaw.breakingRule === "below" && `> ${activeFlaw.breakingMin}`}
                      {activeFlaw.breakingRule === "outside" &&
                        (activeFlaw.id === "bio-flaw-1" ? "34°C - 41°C" : "25% - 75%")}
                    </strong>{" "}
                     {activeFlaw.parameterUnit}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-serif">
                    <span className="text-sm font-bold text-natural-title">
                      {activeFlaw.parameterName}
                    </span>
                    <span className="text-lg font-black text-amber-950 font-mono">
                      {sliderValue.toFixed(activeFlaw.id === "ai-flaw-2" ? 3 : 1)}
                      <span className="text-xs font-bold text-[#8C8474] ml-0.5 font-sans">
                        {activeFlaw.parameterUnit}
                      </span>
                    </span>
                  </div>

                  {/* HTML input Range slider */}
                  <input
                    type="range"
                    min={activeFlaw.minVal}
                    max={activeFlaw.maxVal}
                    step={activeFlaw.id === "ai-flaw-2" ? 0.005 : activeFlaw.id === "bio-flaw-3" ? 0.1 : 1}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    className="w-full accent-amber-950 cursor-ew-resize h-1.5 bg-[#E8E4D9] rounded-lg appearance-none mt-2"
                  />
                  
                  <div className="flex justify-between font-mono text-[9px] text-[#8C8474] mt-1 px-1">
                    <span>{activeFlaw.minVal}{activeFlaw.parameterUnit} (Minimum)</span>
                    <span>{activeFlaw.maxVal}{activeFlaw.parameterUnit} (Nominal Capacity)</span>
                  </div>
                </div>

                {/* Simulated Realtime Live Feedback system */}
                <div className="border shadow-2xs border-natural-border rounded-xl p-4 bg-white flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-[#8C8474] flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-amber-800" />
                      Analytical Metric: {activeFlaw.stabilityTerm}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      currentDegraded 
                        ? "bg-rose-100 text-rose-800" 
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {currentDegraded ? "Non-Linear Model Collapse Boundary" : "Stable Operation Zone"}
                    </span>
                  </div>

                  {/* Simulated interactive meter bar */}
                  <div className="relative h-4 w-full bg-[#FAF8F5] rounded-md overflow-hidden border border-[#E8E4D9]">
                    <motion.div 
                      className={`h-full transition-all duration-300 ${
                        currentDegraded ? "bg-gradient-to-r from-rose-500 to-rose-600" : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      }`}
                      style={{ width: `${currentStability}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-mono font-bold text-natural-title drop-shadow-sm select-none">
                      <span>STABILITY RANGE</span>
                      <span>{currentStability}%</span>
                    </div>
                  </div>

                  {/* Impact text explanation */}
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed transition-all duration-300 border ${
                    currentDegraded
                      ? "bg-rose-50 text-rose-950 border-rose-200/50"
                      : "bg-emerald-50 text-emerald-950 border-emerald-200/50"
                  }`}>
                    {currentDegraded ? activeFlaw.impactMessageDegraded : activeFlaw.impactMessageStable}
                  </div>
                </div>

                {/* Start documentation action */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleDocumentFlaw}
                    disabled={!currentDegraded}
                    className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentDegraded
                        ? "bg-amber-950 hover:bg-amber-900 text-[#F9F7F2] shadow-sm cursor-pointer active:scale-95"
                        : "bg-[#EAE6D6] text-natural-text border border-[#D6D0C2] cursor-not-allowed opacity-60"
                    }`}
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>
                      {documentedFlaws[activeFlaw.id] 
                        ? "Update Logged Threshold" 
                        : "Log Crucial Integrity Bound"}
                    </span>
                  </button>
                </div>
                {!currentDegraded && (
                  <p className="text-[10px] text-[#8C8474] font-mono text-center italic">
                    Adjust the variable slider to observe non-linear stability collapse threshold values.
                  </p>
                )}
              </div>
            </div>

            {/* Registered certificate lock module */}
            <div className="bg-white border border-natural-border rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div>
                <h4 className="font-serif font-bold text-natural-title text-sm flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-700" />
                  Generate Methodological Integrity Summary
                </h4>
                <p className="text-xs text-natural-text leading-relaxed mt-0.5">
                  Test and capture all three structural parameters under high load bounds to output a peer validation summary.
                </p>
              </div>

              {isAllFlawsDone ? (
                <div className="flex flex-col gap-3.5 border-t border-natural-border pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-natural-primary uppercase">
                      ENTER YOUR NAME FOR THE VALIDATION SUMMARY
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Dr. Jordan Sterling, M.Sc."
                        value={researcherName}
                        onChange={(e) => setResearcherName(e.target.value)}
                        className="w-full text-xs p-3 pl-9 border border-natural-border bg-white rounded-xl focus:border-amber-900 focus:outline-none text-natural-title font-bold placeholder:text-[#8C8474]/50"
                      />
                      <User className="h-4 w-4 text-natural-primary absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    onClick={handleRegisterVerdict}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all shadow cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                    <span>COMPILE SYSTEM AUDIT REPORT</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 bg-natural-highlight rounded-xl border border-natural-border opacity-75">
                  <Lock className="h-4 w-4 text-[#8C8474]" />
                  <span className="text-xs text-[#8C8474] font-mono font-medium">
                    Identify the boundary threshold values for all 3 criteria to compile the final methodology report. (Currently {completedCount} / 3 logged).
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
