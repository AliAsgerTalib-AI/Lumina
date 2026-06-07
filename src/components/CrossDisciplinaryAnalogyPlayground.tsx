import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRightLeft,
  Shuffle,
  Sliders,
  HelpCircle,
  CheckCircle2,
  GitCompare,
  TrendingUp,
  Award,
  ArrowRight,
  Workflow,
  BookOpen,
  Settings2,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Mapping {
  sourceConcept: string;
  targetConcept: string;
  mappingExplanation: string;
  formulaicEquilibrium: string;
}

interface AnalogyResponse {
  analogyTitle: string;
  coreMetaphor: string;
  domainAMappings: Mapping[];
  domainBMappings: Mapping[];
  unifiedFormula: string;
  unifiedFormulaDesc: string;
  coherenceRating: number;
}

const PRESET_CROSS_PAIRINGS = [
  {
    id: "mycelium-internet",
    name: "Mycellial Networks ⟷ IP Routing Protocols",
    domainA: "Mycelial Fungal Networks (nutrient distribution, resource-sharing, mycorrhizal optimization)",
    domainB: "TCP/IP Network Routing Protocols (OSPF, localized congestion management, packet delivery routing)",
    desc: "Examines how forest floor fungal hyphae allocate phosphorus and carbon without central signaling, mapping directly to localized router load balancing."
  },
  {
    id: "bernoulli-deeplearning",
    name: "Bernoulli Hydrodynamics ⟷ Neural Gradient Flow",
    domainA: "Fluid Dynamics & Bernoulli's Pressure Equations (viscosity, laminar flow, constriction pressure drops)",
    domainB: "Deep Neural Network Gradient Propagation (loss valleys, vanishing gradients, learning rate momentum, Adam optimization)",
    desc: "Translates pressure drop principles of constriction pipes into mathematical techniques for stabilizing exploding gradients during deep backpropagation."
  },
  {
    id: "thermo-git",
    name: "Thermodynamic Entropy ⟷ Version control systems",
    domainA: "Thermodynamics and Statistical Entropy (closed states, molecular decay, second law of thermodynamics, thermal heat release)",
    domainB: "Software Version Control & Git Repositories (uncommitted changes, branching chaos, merge debt, codebase refactoring refactors)",
    desc: "Models uncommitted git directory diffs as energetic thermal states, showing how refactoring act as a cooling cryo-stabilization."
  },
  {
    id: "cellular-serverless",
    name: "Cellular Mitosis ⟷ Serverless Pod Autoscaling",
    domainA: "Eukaryotic Cell Division & Mitotic Spindle Cleavage (chromosome replication, metabolic triggers, checkpoint inhibition)",
    domainB: "Kubernetes Pod Autoscaling & Cloud Serverless Execution (CPU metrics gating, replicate pod spinup, request-routing gatekeepers)",
    desc: "Leverages natural biological checkpoint constraints to optimize serverless node initialization times and prevent container death-spirals."
  }
];

export default function CrossDisciplinaryAnalogyPlayground({ onClose }: { onClose: () => void }) {
  // Domain Inputs
  const [domainA, setDomainA] = useState("Mycelial Fungal Networks");
  const [domainB, setDomainB] = useState("TCP/IP Internet Network Routing");
  const [abstractionLevel, setAbstractionLevel] = useState(50);
  const [explanationLevel, setExplanationLevel] = useState<"expert" | "standard" | "witty">("expert");

  // State Management
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analogyData, setAnalogyData] = useState<AnalogyResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"aToB" | "bToA">("aToB");

  // List of exciting loading stages to give a highly polished scientific computation feel
  const loadingStages = [
    "Interrogating semantic embeddings from both corpuses...",
    "Probing topological coordinate overlap and vector dimensions...",
    "Solving reciprocal boundary condition multipliers...",
    "Formulating unified governing ASCII state equations...",
    "Submitting draft to peer review commission referees...",
    "Unifying state variables..."
  ];

  const handleSelectPreset = (preset: typeof PRESET_CROSS_PAIRINGS[number]) => {
    setDomainA(preset.domainA);
    setDomainB(preset.domainB);
  };

  const handleSwapDomains = () => {
    const temp = domainA;
    setDomainA(domainB);
    setDomainB(temp);
  };

  const handleRandomize = () => {
    const randomPreset = PRESET_CROSS_PAIRINGS[Math.floor(Math.random() * PRESET_CROSS_PAIRINGS.length)];
    handleSelectPreset(randomPreset);
  };

  const handleSynthesizeAnalogy = async () => {
    if (!domainA.trim() || !domainB.trim()) {
      setError("Please supply descriptive terms for both Domain A and Domain B.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalogyData(null);
    setLoadingStep(0);

    // Stagger loading progress messages
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/analogy-synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainA,
          domainB,
          abstractionLevel,
          explanationLevel
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAnalogyData(data);
      } else {
        throw new Error(data.error || "Synthesis parsed incorrectly.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish cross-disciplinary bridge. System telemetry failure.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF9F4] overflow-y-auto flex flex-col antialiased font-sans">
      
      {/* Blueprint Header Navigation */}
      <nav className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-4 border-b border-[#E8E4D9] flex justify-between items-center z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#B4A086] text-white p-2.5 rounded-xl flex items-center justify-center shadow-xs">
            <GitCompare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-[#2D2D24] flex items-center gap-2">
              Cross-Disciplinary Analogy Playground
              <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                Interactive Beta
              </span>
            </h1>
            <p className="text-[11px] text-[#8C8474] font-medium hidden sm:block">
              Bridge conceptual voids by calculating bidirectional translations between arbitrary systems
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-[#F2EDE4]/60 text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer border border-[#E8E4D9] bg-white shadow-3xs"
          title="Exit Playground"
        >
          <X className="h-5 w-5" />
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">

        {/* Introduction Panel */}
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-[24px] p-5 text-left flex gap-4">
          <div className="p-3 bg-amber-100/60 text-amber-900 rounded-2xl flex-shrink-0 h-11 w-11 flex items-center justify-center select-none">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-850">COGNITIVE BLUEPRINT ENGINE</span>
            <h3 className="font-serif font-black text-sm text-[#2D2D24] mt-0.5">The Unified Structural Alignment Paradigm</h3>
            <p className="text-xs text-[#5C5340] leading-relaxed mt-1.5 max-w-4xl">
              Complex systems theory dictates that patterns recur across physical and virtual mediums alike. By feeding two discrete domains of science or programming into the translator, you can compile symmetrical mathematical analogies to observe reciprocal mechanisms, discovering non-obvious strategies you can apply across both fields.
            </p>
          </div>
        </div>

        {/* Input Configuration & Presets Slat */}
        <div className="bg-white blueprint-graph-paper border border-[#E8E2D2] rounded-[24px] p-5 sm:p-6 shadow-3xs relative overflow-hidden text-left space-y-6">
          <div className="absolute top-2 right-2 text-[#8C8474]/20 font-mono text-[9px] select-none pointer-events-none">[NODE_SEC_01]</div>

          {/* Quick Presets row */}
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8068] select-none">
              <Workflow className="h-3.5 w-3.5 text-amber-800" />
              <span>Select High-Density Preset Combinations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_CROSS_PAIRINGS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="bg-[#FAF8F5]/80 hover:bg-amber-50/65 border border-[#E8E2D2] hover:border-amber-300 p-3 rounded-xl transition-all cursor-pointer text-left focus:outline-hidden text-ring"
                >
                  <p className="text-xs font-serif font-bold text-[#2D2D24] line-clamp-1">{preset.name}</p>
                  <p className="text-[10px] text-[#8C8474] mt-1 line-clamp-2 leading-relaxed font-sans">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8E2D2]/60 pt-5">
            {/* Split custom domains forms */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
              
              {/* Domain A */}
              <div className="lg:col-span-5 space-y-2">
                <label className="text-[10px] font-mono font-bold block uppercase text-[#2D2D24] tracking-wider select-none">
                  🔬 Domain / System A (Biological / Physical / Computational Source)
                </label>
                <textarea
                  value={domainA}
                  onChange={(e) => setDomainA(e.target.value)}
                  placeholder="Specify starting system e.g. 'Photosynthetic Chloroplast Energy Storage'"
                  rows={2}
                  maxLength={300}
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#E8E2D2] rounded-xl px-3.5 py-3 text-[#2D2D24] focus:outline-hidden focus:ring-1 focus:ring-[#7C8464] placeholder-[#8C8474]/60 resize-none leading-relaxed"
                />
              </div>

              {/* Swap Button container */}
              <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
                <button
                  onClick={handleSwapDomains}
                  className="p-3 bg-[#FAF8F5] border border-[#E8E2D2] rounded-full hover:bg-amber-100/50 hover:border-amber-300 transition-all cursor-pointer text-[#8C8068] shadow-3xs active:scale-95"
                  title="Swap Input Domains"
                >
                  <ArrowRightLeft className="h-4.5 w-4.5 rotate-90 lg:rotate-0" />
                </button>
              </div>

              {/* Domain B */}
              <div className="lg:col-span-11 xl:lg:col-span-5 lg:col-span-5 space-y-2">
                <label className="text-[10px] font-mono font-bold block uppercase text-[#2D2D24] tracking-wider select-none">
                  💻 Domain / System B (Target Software Layout / Algorithmic Paradigm)
                </label>
                <textarea
                  value={domainB}
                  onChange={(e) => setDomainB(e.target.value)}
                  placeholder="Specify target system e.g. 'React Concurrent Render Scheduler Loop'"
                  rows={2}
                  maxLength={300}
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#E8E2D2] rounded-xl px-3.5 py-3 text-[#2D2D24] focus:outline-hidden focus:ring-1 focus:ring-[#7C8464] placeholder-[#8C8474]/60 resize-none leading-relaxed"
                />
              </div>

            </div>
          </div>

          {/* Abstraction Slider and Parameter Tuning Area */}
          <div className="border-t border-[#E8E2D2]/60 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Abstraction Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[#2D2D24] tracking-wider select-none">
                <span className="flex items-center gap-1.5 text-[#8C8068]">
                  <Sliders className="h-3.5 w-3.5" />
                  Abstraction Level Tuning
                </span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Val: {abstractionLevel}%
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#8C8474] uppercase select-none">Literal</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={abstractionLevel}
                  onChange={(e) => setAbstractionLevel(parseInt(e.target.value))}
                  className="flex-1 accent-amber-800 bg-[#E8E4D9] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-mono text-amber-800 uppercase font-black select-none">Speculative</span>
              </div>
              <p className="text-[10px] text-[#8C8474] font-medium leading-relaxed italic">
                {abstractionLevel < 30
                  ? "Rigid mathematical isomorphism prioritizing strict thermodynamic laws and direct physical limits."
                  : abstractionLevel < 70
                  ? "Standard Santa Fe systemics. Maps conceptual networks while establishing functional conversion formulas."
                  : "Highly speculative, visionary quantum leap. Links disparate concepts through high-abstraction philosophical laws."}
              </p>
            </div>

            {/* Explanation Level and Action Row */}
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold block uppercase text-[#2D2D24] tracking-wider select-none">
                  📝 Translation Narrative Voice Style
                </span>
                <div className="flex gap-2">
                  {(["expert", "standard", "witty"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setExplanationLevel(style)}
                      className={`flex-1 py-1.5 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                        explanationLevel === style
                          ? "bg-amber-900 border-amber-900 text-white font-bold"
                          : "bg-[#FAF8F5] border-[#E8E2D2] text-[#5A5A4A] hover:bg-neutral-50"
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesis trigger panel */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="px-3.5 py-3 border border-[#E8E2D2] rounded-xl text-[#8C8068] hover:bg-amber-100/50 hover:border-amber-300 hover:text-amber-900 transition-all cursor-pointer shadow-3xs active:scale-95"
                  title="Randomize System Pairing"
                >
                  <Shuffle className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleSynthesizeAnalogy}
                  disabled={loading}
                  className="flex-1 bg-[#2D281F] hover:bg-[#433D31] text-[#F9F7F2] text-xs font-mono py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer select-none active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                      <span>Aligning Systems...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                      <span>Synthesize Bidirectional Symmetry</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Loading / Processing feedback state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/80 border border-[#E8E2D2] p-6 lg:p-8 rounded-[24px] text-center flex flex-col items-center justify-center space-y-4 shadow-3xs select-none">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-2 border-amber-800 border-t-transparent animate-spin" />
                  <Sparkles className="h-5 w-5 text-amber-600 absolute top-2.5 left-2.5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-serif font-bold text-[#2D2D24]">Transmitting Analogy Matrices</p>
                  <p className="text-xs font-mono text-amber-800 animate-pulse">{loadingStages[loadingStep]}</p>
                </div>
                <div className="h-1 bg-neutral-100 rounded-full w-full max-w-[280px] overflow-hidden border">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-900 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(loadingStep + 1) * 16.6}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-left text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Dynamic Analysis Synthesized Output */}
        <AnimatePresence>
          {analogyData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Primary Metaphor Panel */}
              <div className="bg-white border border-[#E8E4D9] p-6 sm:p-8 rounded-[32px] md:rounded-[40px] shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-900 to-[#7C8464]" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#E8E4D9]/80 pb-5 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none mb-3">
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      Unified Cross-Domain Thesis
                    </span>
                    <h2 className="font-serif font-black text-[#2D2214] text-xl sm:text-3xl leading-snug tracking-tight">
                      {analogyData.analogyTitle}
                    </h2>
                  </div>

                  {/* Coherence Gauge */}
                  <div className="bg-[#FAF8F5] border border-[#E8E2D2] p-3 rounded-2xl flex items-center gap-3 select-none">
                    <Award className="h-5 w-5 text-amber-850 animate-pulse" />
                    <div>
                      <span className="text-[8.5px] font-mono text-[#8C8474] uppercase block">Assent Ratio</span>
                      <span className="text-sm font-mono font-black text-amber-900">{analogyData.coherenceRating}% Alignment Coherence</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8068] border-b border-[#F2EDE4] pb-1.5 select-none">
                    [01] The Grand Symmetrical Metaphor
                  </h4>
                  <p className="font-serif italic leading-relaxed text-[#434338] text-sm sm:text-base bg-amber-50/20 p-5 rounded-2xl border border-amber-100/30">
                    "{analogyData.coreMetaphor}"
                  </p>
                </div>
              </div>

              {/* Symmetrical Bidirectional Translation Lanes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* LEFT LANE: Concept A maps to analogue B */}
                <div className="bg-white border border-[#E8E2D2] rounded-[28px] p-6 text-left flex flex-col justify-between shadow-3xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-[#7C8464]/3 pointer-events-none rounded-bl-full" />
                  
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D2] mb-5 select-none animate-pulse">
                      <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C8464] bg-[#7C8464]/10 px-2.5 py-0.5 rounded uppercase">
                        Vector A ⟶ Vector B
                      </span>
                      <span className="text-[10px] font-mono text-[#8C8474]">Forward Mapping Logic</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[9px] font-mono uppercase bg-neutral-800 text-white px-2 py-0.5 rounded">STRUCTURE ORIGIN</span>
                      <h4 className="font-serif font-black text-[#2D2D24] text-md mt-1 mb-2">Analyzing System A Elements</h4>
                    </div>

                    <div className="space-y-4">
                      {analogyData.domainAMappings.map((mapping, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] p-4.5 rounded-xl border border-[#E8E2D2]/60 select-text hover:shadow-3xs transition-all">
                          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <span className="font-serif font-black text-xs text-[#2D2D24]">{mapping.sourceConcept}</span>
                            <div className="flex items-center gap-1.5 text-amber-800 font-mono text-[10px] uppercase font-bold">
                              <ArrowRight className="h-3 w-3" />
                              <span>{mapping.targetConcept}</span>
                            </div>
                          </div>
                          
                          <p className="text-[11.5px] text-[#5A5A4A] leading-relaxed mb-3">
                            {mapping.mappingExplanation}
                          </p>

                          {mapping.formulaicEquilibrium && (
                            <div className="bg-white border border-[#E8E2D2] px-3.5 py-2.5 rounded-lg text-center font-mono text-[10.5px] text-amber-900 border-dashed flex justify-between items-center">
                              <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-black">Conversion Laws</span>
                              <span className="font-bold select-all">{mapping.formulaicEquilibrium}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT LANE: Reciprocal mapping back: B maps to A */}
                <div className="bg-white border border-[#E8E2D2] rounded-[28px] p-6 text-left flex flex-col justify-between shadow-3xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-amber-600/3 pointer-events-none rounded-bl-full" />
                  
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D2] mb-5 select-none animate-pulse">
                      <span className="text-[10px] font-mono tracking-wider font-bold text-amber-900 bg-amber-150 text-amber-950 px-2.5 py-0.5 rounded uppercase">
                        Vector B ⟶ Vector A
                      </span>
                      <span className="text-[10px] font-mono text-[#8C8474]">Inverse Reciprocal Insights</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[9px] font-mono uppercase bg-neutral-800 text-white px-2 py-0.5 rounded">STRUCTURE DESTINATION</span>
                      <h4 className="font-serif font-black text-[#2D2D24] text-md mt-1 mb-2">Analyzing System B Mappings</h4>
                    </div>

                    <div className="space-y-4">
                      {analogyData.domainBMappings.map((mapping, idx) => (
                        <div key={idx} className="bg-[#FAF8F5] p-4.5 rounded-xl border border-[#E8E2D2]/60 select-text hover:shadow-3xs transition-all">
                          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <span className="font-serif font-black text-xs text-[#2D2D24]">{mapping.sourceConcept}</span>
                            <div className="flex items-center gap-1.5 text-[#7C8464] font-mono text-[10px] uppercase font-bold">
                              <ArrowRight className="h-3 w-3" />
                              <span>{mapping.targetConcept}</span>
                            </div>
                          </div>
                          
                          <p className="text-[11.5px] text-[#5A5A4A] leading-relaxed mb-3">
                            {mapping.mappingExplanation}
                          </p>

                          {mapping.formulaicEquilibrium && (
                            <div className="bg-white border border-[#E8E2D2] px-3.5 py-2.5 rounded-lg text-center font-mono text-[10.5px] text-[#7C8464] border-dashed flex justify-between items-center">
                              <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-black">Inverse Constant</span>
                              <span className="font-bold select-all">{mapping.formulaicEquilibrium}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Unified Sovereign Systemic Formula */}
              <div className="bg-[#2D281F] text-[#F9F7F2] p-6 sm:p-8 rounded-[32px] text-left relative overflow-hidden blueprint-graph-paper">
                {/* Tech target design corner */}
                <div className="absolute top-3 left-3 text-amber-500/15 font-mono text-[9px] select-none pointer-events-none">+ U_STATE_EQ.SYS</div>

                <div className="flex items-center gap-2 mb-3">
                  <Workflow className="h-4.5 w-4.5 text-amber-400 animate-pulse animate-duration-1500" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-amber-400">Governing Symmetrical Equilibrium Law</span>
                </div>

                <div className="flex flex-col md:flex-row gap-5 items-center justify-between border-b border-[#FAF9F6]/15 pb-5">
                  <div className="font-mono text-base md:text-xl font-bold text-white bg-black/45 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner w-full md:w-auto text-center select-all">
                    {analogyData.unifiedFormula}
                  </div>
                  
                  <div className="flex-1 leading-relaxed text-[#C8C2B3] text-xs">
                    {analogyData.unifiedFormulaDesc}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] font-mono text-[#8C8474] gap-2 select-none">
                  <span>* Solved via Multi-Modal Reciprocals under abstraction level {abstractionLevel}%</span>
                  <span className="bg-white/10 text-white px-2.5 py-1 rounded border border-white/5 uppercase font-bold">
                    Ref: Santa Fe Multi-Isomorphism Solver
                  </span>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
