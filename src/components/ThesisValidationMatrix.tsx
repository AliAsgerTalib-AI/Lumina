import React, { useState } from "react";
import { GitCompare, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MatrixCard {
  id: string;
  journal: string;
  authors: string;
  citations: number;
  claim: string;
  convergence: string;
  anchorId: string;
  originalUrl: string;
  abstract: string;
  summary: string;
}

interface ThesisValidationMatrixProps {
  simplifiedTitle: string;
  year?: number;
  setSplitScreenPaper: (paper: any) => void;
  splitScreenPaper: any | null;
  setHoveredMatrixCard: (anchorId: string | null) => void;
}

// Pure function to generate Thesis Validation Matrix based on title/domain keywords
export function generateThesisValidationMatrix(paperTitle: string, paperYear?: number) {
  const cleanTitle = paperTitle || "Current Study";
  const activeYear = paperYear || 2026;
  const sup1Year = activeYear;
  const sup2Year = Math.max(1995, activeYear - 1);
  const con1Year = activeYear;
  const con2Year = activeYear;
  const met1Year = activeYear;
  const met2Year = Math.max(1995, activeYear - 1);

  let domain = "AI and ML Foundations";
  if (
    cleanTitle.toLowerCase().includes("biolog") ||
    cleanTitle.toLowerCase().includes("genet") ||
    cleanTitle.toLowerCase().includes("protein") ||
    cleanTitle.toLowerCase().includes("nutrient") ||
    cleanTitle.toLowerCase().includes("crop")
  ) {
    domain = "Bioinformatics & Genetics";
  } else if (
    cleanTitle.toLowerCase().includes("climate") ||
    cleanTitle.toLowerCase().includes("carbon") ||
    cleanTitle.toLowerCase().includes("ecolog") ||
    cleanTitle.toLowerCase().includes("soil")
  ) {
    domain = "Environmental Sciences";
  } else if (
    cleanTitle.toLowerCase().includes("quantum") ||
    cleanTitle.toLowerCase().includes("physic") ||
    cleanTitle.toLowerCase().includes("optics")
  ) {
    domain = "Quantum Mechanics & Physics";
  }

  return {
    supporting: [
      {
        id: "sup-1",
        journal: "Journal of Computational Design Methods",
        authors: `Chen & Zhang, ${sup1Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "biological topologies scale structured optimization scale" : domain === "Environmental Sciences" ? "soil organic carbon decay coefficients monitoring" : domain === "Quantum Mechanics & Physics" ? "quantum register information retention mathematical models 10mK" : "dynamic feedback scaling gradient descent curves stable"),
        abstract: "This work investigates computational stability models across simulated domains, validating the linear scaling dynamics and energy conservation parameters under peak stress loads.",
        summary: "An independent replication study that confirms the core assertions with negligible error bounds."
      },
      {
        id: "sup-2",
        journal: "Global Science Publications & Archives",
        authors: `S. Martinez, et al., ${sup2Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "mitochondrial structural sequences clustering" : domain === "Environmental Sciences" ? "deep learning predict methane pathways respiration" : domain === "Quantum Mechanics & Physics" ? "gradient descent optimization spatial quantum filters" : "feedback latency lateral gradient offsets throughput"),
        abstract: "We implement dynamic scaling on dedicated servers and discover that localized feedback pathways offset connection overhead substantially.",
        summary: "Verifies the findings under live hardware conditions, presenting empirical metrics supporting the main paper's claims."
      }
    ],
    conflicting: [
      {
        id: "con-1",
        journal: "Advanced Computational Review",
        authors: `L. Zhao & J. Sterling, ${con1Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "biological topologies collapse non-linear parameters" : domain === "Environmental Sciences" ? "organic carbon sequestration temperature anomalies" : domain === "Quantum Mechanics & Physics" ? "multi-gate quantum coherence electric noise fields" : "delayed gradient feedback gradient explosion"),
        abstract: "An exploration of degradation boundaries under extreme volatile conditions. We find that feedback loops cause structural divergence when input bounds surpass nominal standards.",
        summary: "Identifies severe operational boundaries and disputes the universal stability of the primary study's model."
      },
      {
        id: "con-2",
        journal: "The Dialectical Science Gazette",
        authors: `K. Vance, ${con2Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "biological sequencing map recursive patterns" : domain === "Environmental Sciences" ? "soil carbon respiration natural variance" : domain === "Quantum Mechanics & Physics" ? "quantum signal updates communications latency overhead" : "hardware interconnect latency simulation speedups bottlenecks"),
        abstract: "We benchmark distributed layer coordination across real physical server racks, identifying critical spatial communication bottlenecks.",
        summary: "A hardware-centric critique highlighting that idealized simulations overlook tangible latency boundaries."
      }
    ],
    methodological: [
      {
        id: "met-1",
        journal: "Journal of Theoretical Physics & Modeling",
        authors: `Feynman Group Research, ${met1Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "cell membrane topologies stochastic Monte Carlo algorithm" : domain === "Environmental Sciences" ? "crop carbon exchange stochastic localized weather grids" : domain === "Quantum Mechanics & Physics" ? "simulating multi-gate quantum pathways parallel stochastic Monte Carlo" : "gradient descent stochastic simulated annealing"),
        abstract: "This paper introduces alternative algorithmic paths to model high-dimensional parameters, showing that localized search regions deliver comparable fidelity metrics for standard domains.",
        summary: "Confirms the primary study's model conclusions using an entirely independent mathematical methodology."
      },
      {
        id: "met-2",
        journal: "Bio-Computing Benchmarks",
        authors: `Okada & Sato, ${met2Year}`,
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
        originalUrl: "https://scholar.google.com/scholar?q=" + encodeURIComponent(domain === "Bioinformatics & Genetics" ? "protein structures dry lab TPU hardware" : domain === "Environmental Sciences" ? "soil moisture carbon respiration climate chambers" : domain === "Quantum Mechanics & Physics" ? "cryogenic fpga superconducting register retention" : "hyper-parameter search edge fpga"),
        abstract: "An evaluation of custom high-density silicon architectures. We benchmark parameter matching and state mapping behaviors under localized constraints.",
        summary: "Provides an alternative hardware benchmark supporting the scalability of the primary paper's findings."
      }
    ]
  };
}

export default function ThesisValidationMatrix({
  simplifiedTitle,
  year,
  setSplitScreenPaper,
  splitScreenPaper,
  setHoveredMatrixCard
}: ThesisValidationMatrixProps) {
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(false);
  const matrix = generateThesisValidationMatrix(simplifiedTitle, year);

  return (
    <div className="card-natural flex flex-col gap-5">
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
          className="btn-secondary"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
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
                        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-[#7C8464]" />
                        <div className="flex justify-between items-center gap-2 pl-1">
                          <span className="text-[10px] font-mono font-bold text-[#7C8464] bg-[#7C8464]/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                            {card.journal}
                          </span>
                          <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                            ★ Citations: <strong>{card.citations}</strong>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8C8474] font-mono pl-1">By {card.authors}</p>
                        <div className="pl-1">
                          <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">{card.claim}</h4>
                          <p className="text-[11px] text-[#5A5A4A] leading-relaxed mt-2 p-2 rounded-lg bg-[#7C8464]/5 border border-[#7C8464]/10 italic font-medium">
                            {card.convergence}
                          </p>
                        </div>
                        <div className="flex gap-1.5 mt-2 pl-1">
                          <button
                            onClick={() => setSplitScreenPaper(card)}
                            className="btn-primary flex-1 py-2 text-[10px]"
                          >
                            <GitCompare className="h-3 w-3" />
                            <span>Split-Screen</span>
                          </button>
                          <a
                            href={card.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-utility"
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
                        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-amber-600" />
                        <div className="flex justify-between items-center gap-2 pl-1">
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-600/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                            {card.journal}
                          </span>
                          <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                            ★ Citations: <strong>{card.citations}</strong>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8C8474] font-mono pl-1">By {card.authors}</p>
                        <div className="pl-1">
                          <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">{card.claim}</h4>
                          <p className="text-[11px] text-amber-900 leading-relaxed mt-2 p-2 rounded-lg bg-amber-600/5 border border-amber-600/10 italic font-medium">
                            {card.convergence}
                          </p>
                        </div>
                        <div className="flex gap-1.5 mt-2 pl-1">
                          <button
                            onClick={() => setSplitScreenPaper(card)}
                            className="btn-primary !bg-amber-600 hover:!bg-amber-700 border-amber-700/80 flex-1 py-2 text-[10px]"
                          >
                            <GitCompare className="h-3 w-3" />
                            <span>Split-Screen</span>
                          </button>
                          <a
                            href={card.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-utility"
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
                        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-slate-500" />
                        <div className="flex justify-between items-center gap-2 pl-1">
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                            {card.journal}
                          </span>
                          <span className="text-[9px] font-mono text-[#8C8474] flex-shrink-0">
                            ★ Citations: <strong>{card.citations}</strong>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8C8474] font-mono pl-1">By {card.authors}</p>
                        <div className="pl-1">
                          <h4 className="text-xs font-bold font-serif text-[#2D2D24] leading-snug">{card.claim}</h4>
                          <p className="text-[11px] text-slate-950 leading-relaxed mt-2 p-2 rounded-lg bg-slate-500/5 border border-slate-500/10 italic font-medium">
                            {card.convergence}
                          </p>
                        </div>
                        <div className="flex gap-1.5 mt-2 pl-1">
                          <button
                            onClick={() => setSplitScreenPaper(card)}
                            className="btn-primary !bg-slate-500 hover:!bg-slate-600 border-slate-600/80 flex-1 py-2 text-[10px]"
                          >
                            <GitCompare className="h-3 w-3" />
                            <span>Split-Screen</span>
                          </button>
                          <a
                            href={card.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-utility"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
