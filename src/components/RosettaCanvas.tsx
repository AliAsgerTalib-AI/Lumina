import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Sparkles, 
  X, 
  ChevronRight, 
  Info, 
  Layers, 
  Activity, 
  Cpu, 
  Eye, 
  HelpCircle, 
  Binary, 
  RefreshCw, 
  ArrowRight,
  Minimize2,
  Maximize2,
  CheckCircle,
  Hash,
  Lightbulb,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Interfaces for Rosetta Analogy Mapping
interface VariablePair {
  sourceVar: string;
  sourceDesc: string;
  targetVar: string;
  targetDesc: string;
}

interface AnalogyItem {
  id: string;
  sourceTerm: string;
  sourceContext: string;
  targetConcept: string;
  justification: string;
  variables: VariablePair[];
}

interface RosettaPreset {
  id: string;
  sourceDiscipline: string;
  targetDiscipline: string;
  paperTitle: string;
  paperAuthors: string;
  paperSource: string;
  paperAbstract: string;
  bodyParagraphs: string[];
  analogies: AnalogyItem[];
}

const ROSETTA_PRESETS: RosettaPreset[] = [
  {
    id: "olfactory-science",
    sourceDiscipline: "Olfactory Formulation Science",
    targetDiscipline: "Distributed Systems & Computing Architecture",
    paperTitle: "Volatility Retardation and Evaporative Kinetics of Polycyclic Fixative Accords in Ambient Micro-Aerosols",
    paperAuthors: "Dr. Elena Rostova, Prof. Arthur Vance",
    paperSource: "Journal of Advanced Olfactory Biophysics (2025)",
    paperAbstract: "This paper investigates how heavy molecular compounds retard the evaporative dispersion of highly volatile scent notes in complex carrier liquids. By establishing a stabilized molecular network, we determine the optimal ratio of heavy fixatives to preserve volatile top notes under varying thermal stress.",
    bodyParagraphs: [
      "In composite fragrance synthesis, preserving highly interactive [term:top_note_volatiles|top-note volatiles] poses a critical optimization bottleneck. These low-molecular-weight esters evaporate rapidly under standard thermal atmospheric states.",
      "To delay rapid dissipation, formulators inject a dense [term:fixative_accord|polycyclic fixative accord]. This dense chemical scaffold binds light volatile molecules via weak non-covalent dispersion coordinates, significantly increasing the vaporization energy limit.",
      "However, introducing excess fixatives triggers [term:receptor_saturation|olfactory receptor saturation]. When the ratio of heavy compounds exceeds a critical limit θ, biological cilia sensory channels saturate, blocking any further scent processing capability."
    ],
    analogies: [
      {
        id: "top_note_volatiles",
        sourceTerm: "Top-Note Volatiles",
        sourceContext: "Low-molecular-weight molecular esters that evaporate immediately under ambient heat.",
        targetConcept: "L1 Cache Volatility & Ephemeral Session States",
        justification: "Both represent high-frequency, low-latency elements that hold crucial immediate state but are extremely temporary. Thermal volatilization metrics perfectly match cache eviction rates under continuous high write pressure.",
        variables: [
          { sourceVar: "v_sub_e", sourceDesc: "Vaporization velocity parameter of top-note ester", targetVar: "λ_sub_evict", targetDesc: "Cache eviction frequency threshold under heavy network IO" },
          { sourceVar: "H_sub_v", sourceDesc: "Latent enthalpy of molecular evaporation", targetVar: "d_sub_write", targetDesc: "Write cycle dispatch overhead of in-memory key stores" }
        ]
      },
      {
        id: "fixative_accord",
        sourceTerm: "Polycyclic Fixative Accord",
        sourceContext: "Heavy, slow-releasing chemical scaffolds that bind volatile elements via non-covalent dispersion forces.",
        targetConcept: "High-Density Persistence Layer / Redis Cache TTL Gating",
        justification: "Both serve as architectural constraints engineered to persist temporary variables for an extended lifecycle. High molecular weight in ambient liquids acts identically to TTL serialization weight in distributed key-value memories.",
        variables: [
          { sourceVar: "W_sub_f", sourceDesc: "Molecular weight weight of the polycyclic scaffold", targetVar: "TTL_sub_sec", targetDesc: "Time-To-Live serialization parameter of target data keys" },
          { sourceVar: "K_sub_bind", sourceDesc: "Affinity coupling constant of structural coordinates", targetVar: "C_sub_sync", targetDesc: "Disk synchronization interval frequency metric" }
        ]
      },
      {
        id: "receptor_saturation",
        sourceTerm: "Olfactory Receptor Saturation",
        sourceContext: "Chemical binding channels filled to maximum capacity, preventing any sensory transmission updates.",
        targetConcept: "Thread Pool Over-Saturation & Ingress Backpressure Trigger",
        justification: "Both systems experience performance flatlining when physical reception nodes are fully occupied by heavy, slow-to-dispatch inputs. Receptors recovering from esters match server threads returning to the active thread pool bounds.",
        variables: [
          { sourceVar: "N_sub_receptor", sourceDesc: "Total nasal cilia protein binding receptors", targetVar: "T_sub_max", targetDesc: "Maximum concurrent threads allocated in server request pool" },
          { sourceVar: "τ_sub_clear", sourceDesc: "Clearance latency to unbind saturated compounds", targetVar: "t_sub_dispatch", targetDesc: "Thread release latency after processing async payload" }
        ]
      }
    ]
  },
  {
    id: "marine-biology",
    sourceDiscipline: "Symbiotic Marine Biology",
    targetDiscipline: "Enterprise Distributed Event Architecture",
    paperTitle: "Metabolic Flux Constraints and Chemosynthetic Rates in Hydrothermal Tube-Worm Colonies",
    paperAuthors: "Dr. Kenji Takahashi, Dr. Sarah Gentry",
    paperSource: "Deep-Sea Microbial Ecology Reports (2024)",
    paperAbstract: "We model the metabolic energy transfer between deep-sea Riftia colonies and endosymbiotic sulfur-oxidizing bacteria. Symmetrical electron transfers across sulfur boundaries optimize the energy flux output under intense external pressures.",
    bodyParagraphs: [
      "In benthic abyss structures, hydrothermal vents emit pressurized [term:metabolic_sulfide_flux|metabolic hydrogen sulfide flux]. Tube-worms capture these toxic carriers through branchial plumes to sustain high-energy metabolic cycles.",
      "The worm processes this raw substrate via [term:chemosynthetic_oxidation|chemosynthetic oxidation catalysts], using intracellular hemoglobin networks to prevent local cellular bio-poisoning.",
      "This highly coupled system models [term:plume_trophosome_symbiosis|plume-to-trophosome feedback symbiosis]. Any disruption in raw sulfide flow triggers immediate cellular stress and feedback degradation down the biological chain."
    ],
    analogies: [
      {
        id: "metabolic_sulfide_flux",
        sourceTerm: "Metabolic Sulfide Flux",
        sourceContext: "High-concentration hydrogen sulfide delivery stream emerging from deep hydrothermal vents.",
        targetConcept: "Ingress Raw Event Stream / High-Throughput Apache Kafka Ingest",
        justification: "Both represent continuous, raw transactional flows entering the system boundary that must be buffered and processed immediately. Sulfide toxicity mimics data volume spikes capable of collapsing unbuffered consumer threads.",
        variables: [
          { sourceVar: "F_sub_H2S", sourceDesc: "Hydrogen sulfide delivery speed through branchial plume", targetVar: "R_sub_ingress", targetDesc: "Ingress event rate of TCP socket network streams" },
          { sourceVar: "C_sub_toxic", sourceDesc: "Benthic toxicity saturation threshold of thermal fluid", targetVar: "Q_sub_limit", targetDesc: "Kafka ingestion buffer queue physical constraints limit" }
        ]
      },
      {
        id: "chemosynthetic_oxidation",
        sourceTerm: "Chemosynthetic Oxidation",
        sourceContext: "Enzymatic reaction process that splits sulfide bonds to synthesize microbial carbohydrate ATP energy.",
        targetConcept: "Asynchronous Packet Decoders / JIT Schema Translators",
        justification: "Both components translate complex, raw unprocessed inputs into highly optimized, clean consumable energy/data arrays without bottlenecking. Oxidation velocity mirrors parsing throughput speeds under low CPU bounds.",
        variables: [
          { sourceVar: "v_sub_catalysis", sourceDesc: "Enzymatic conversion speed of sulfur compounds", targetVar: "P_sub_handler", targetDesc: "Data packet parsing throughput rate per thread" },
          { sourceVar: "E_sub_activation", sourceDesc: "Catalysis activation energy boundary threshold", targetVar: "O_sub_process", targetDesc: "CPU cycles spent decoding raw input packets" }
        ]
      },
      {
        id: "plume_trophosome_symbiosis",
        sourceTerm: "Plume-to-Trophosome Symbiosis",
        sourceContext: "The interdependent biological loop between the remote gaseous plume filter and internal bacterial refinery.",
        targetConcept: "Synchronous Feedforward Client-Server Nodes",
        justification: "Both systems link a highly exposed ingestion portal (the branchial plume / client gateway) directly to an internal, isolated processing engine (the trophosome / database node) with mutual synchronous feedback loops.",
        variables: [
          { sourceVar: "R_sub_exchange", sourceDesc: "Metabolic carbon-sulfur feedback transfer ratio", targetVar: "R_sub_sync", targetDesc: "Synchronous state replication ratio across mirror engines" },
          { sourceVar: "L_sub_distance", sourceDesc: "Plume-to-trophosome physical cellular distance", targetVar: "L_sub_network", targetDesc: "Node-to-node roundtrip network latency" }
        ]
      }
    ]
  },
  {
    id: "plasma-thermodynamics",
    sourceDiscipline: "Stellar Plasma Thermodynamics",
    targetDiscipline: "High-Frequency Quantitative Market Mechanics",
    paperTitle: "Magnetohydrodynamic Waves and Helical Energy Dispersion in Super-Saturated Solar Coronae",
    paperAuthors: "Prof. Hans-Dieter Miller et al.",
    paperSource: "Astrophysics and Solar System Physics (2026)",
    paperAbstract: "This paper models helical magnetic waves propagating through highly pressurized charged plasma layers. Under high-density constraints, kinetic energy transfers between waves show sudden, non-linear phase transitions that trigger explosive energy flare-ups.",
    bodyParagraphs: [
      "In high-energy solar boundary zones, convective movements generate [term:magnetohydrodynamic_waves|magnetohydrodynamic shear waves]. These waves store extensive kinetic magnetic potentials across unstable plasma fields.",
      "When magnetic tension exceeds critical limits, [term:helical_magnetic_reconnection|helical magnetic reconnection] triggers, collapsing current sheets and releasing energy as a massive electromagnetic pulse.",
      "These high-intensity flares induce [term:plasma_convective_damping|plasma convective damping bounds], forcing local ambient temperatures back to base equilibrium profiles via quick thermal dispersion."
    ],
    analogies: [
      {
        id: "magnetohydrodynamic_waves",
        sourceTerm: "Magnetohydrodynamic Waves",
        sourceContext: "Symmetrical kinetic waves flowing across high-density plasma sheets containing vast electrical power potentials.",
        targetConcept: "Liquidity Momentum Spreads & Limit Order Books",
        justification: "Both model continuous, highly pressurized potential wave states representing kinetic power (buy/sell forces) held in volatile mediums before sudden phase release. Plasma pressure matches pricing spreads.",
        variables: [
          { sourceVar: "B_sub_shear", sourceDesc: "Magnetic shear stress potential field rate", targetVar: "I_sub_depth", targetDesc: "Imbalance depth of order books at local spreads" },
          { sourceVar: "ρ_sub_plasma", sourceDesc: "Local plasma charge density rating index", targetVar: "V_sub_market", targetDesc: "Asset volatility index under market panic state" }
        ]
      },
      {
        id: "helical_magnetic_reconnection",
        sourceTerm: "Helical Magnetic Reconnection",
        sourceContext: "Sudden topological snapping and recombination of opposing magnetic fields, releasing stored energy as kinetic heat.",
        targetConcept: "Arbitrage Co-located Trading Executions & Liquidity Squeezes",
        justification: "Both describe a catastrophic structural collapse of opposing tension lines (opposing bid/ask gaps) resolving in a sudden explosion of transactions that clears the order book spreads immediately.",
        variables: [
          { sourceVar: "J_sub_current", sourceDesc: "Electric current sheet density density value", targetVar: "Vol_sub_trade", targetDesc: "Trading transaction execution volume per millisecond" },
          { sourceVar: "v_sub_reconnect", sourceDesc: "Speed of magnetic boundary collapse", targetVar: "t_sub_latency", targetDesc: "Arbitrage execution gateway dispatch latency" }
        ]
      },
      {
        id: "plasma_convective_damping",
        sourceTerm: "Plasma Convective Damping Bounds",
        sourceContext: "Autonomous negative-feedback cooling mechanism that dampens heat extremes to maintain stellar structures.",
        targetConcept: "Automated Volatility Shock Damping & Mean Reversions",
        justification: "Both function as protective equilibrium mechanisms designed to damp explosive movements, pulling aberrant energetic spikes back to stable, manageable market values.",
        variables: [
          { sourceVar: "D_sub_thermal", sourceDesc: "Thermal diffusion friction cooling scalar", targetVar: "K_sub_liquidity", targetDesc: "Market maker capital provisioning absorption score" },
          { sourceVar: "ΔT_sub_relax", sourceDesc: "Time delay to return to base plasma temperature", targetVar: "t_sub_revert", targetDesc: "Mean reversion timeframe parameter of dynamic prices" }
        ]
      }
    ]
  }
];

export default function RosettaCanvas({ onClose }: { onClose: () => void }) {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const preset = ROSETTA_PRESETS[activePresetIdx];

  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [lineCoordinates, setLineCoordinates] = useState<{ [termId: string]: { x1: number, y1: number, x2: number, y2: number } }>({});

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const svgCanvasRef = useRef<SVGSVGElement>(null);

  // Recalculate anchor line coordinate nodes on scroll, resize, or hover change
  const calculateCoordinates = () => {
    if (!leftPanelRef.current || !rightPanelRef.current || !svgCanvasRef.current) return;
    const svgRect = svgCanvasRef.current.getBoundingClientRect();

    const newCoords: typeof lineCoordinates = {};

    preset.analogies.forEach(analogy => {
      const sourceEl = document.getElementById(`rosetta-source-${analogy.id}`);
      const targetEl = document.getElementById(`rosetta-target-${analogy.id}`);

      if (sourceEl && targetEl) {
        const srcRect = sourceEl.getBoundingClientRect();
        const trgRect = targetEl.getBoundingClientRect();

        newCoords[analogy.id] = {
          x1: srcRect.right - svgRect.left,
          y1: srcRect.top + srcRect.height / 2 - svgRect.top,
          x2: trgRect.left - svgRect.left,
          y2: trgRect.top + trgRect.height / 2 - svgRect.top
        };
      }
    });

    setLineCoordinates(newCoords);
  };

  useEffect(() => {
    // Stagger layout calculation to allow DOM elements to fully render
    const timer = setTimeout(calculateCoordinates, 150);
    window.addEventListener("resize", calculateCoordinates);
    
    // Wire up panel scrolls
    const leftEl = leftPanelRef.current;
    const rightEl = rightPanelRef.current;
    
    if (leftEl) leftEl.addEventListener("scroll", calculateCoordinates);
    if (rightEl) rightEl.addEventListener("scroll", calculateCoordinates);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateCoordinates);
      if (leftEl) leftEl.removeEventListener("scroll", calculateCoordinates);
      if (rightEl) rightEl.removeEventListener("scroll", calculateCoordinates);
    };
  }, [activePresetIdx, hoveredTermId, selectedTermId]);

  // Parse narrative paragraph texts to inject interactive source terms
  const renderParagraphWithTerms = (text: string) => {
    const parts = text.split(/(\[term:[^\]]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[term:([^|]+)\|([^\]]+)\]/);
      if (match) {
        const termId = match[1];
        const termText = match[2];
        const isHovered = hoveredTermId === termId;
        const isSelected = selectedTermId === termId;

        return (
          <span
            key={index}
            id={`rosetta-source-${termId}`}
            onMouseEnter={() => {
              setHoveredTermId(termId);
              calculateCoordinates();
            }}
            onMouseLeave={() => setHoveredTermId(null)}
            onClick={() => setSelectedTermId(selectedTermId === termId ? null : termId)}
            className={`inline-block px-1.5 py-0.5 rounded cursor-help font-mono text-xs font-bold transition-all duration-200 border ${
              isHovered || isSelected 
                ? "bg-[#E6EFFC]/90 text-indigo-950 border-indigo-400 font-extrabold shadow-3xs scale-103" 
                : "bg-amber-100/40 text-amber-950 border-amber-200 hover:bg-amber-100 hover:text-black"
            }`}
          >
            {termText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F5] overflow-y-auto flex flex-col antialiased font-sans">
      
      {/* Immersive Editorial Header Bar */}
      <nav className="sticky top-0 bg-[#FDFCF9]/95 backdrop-blur-md px-6 py-4 border-b border-[#EAE6DB] flex justify-between items-center z-40 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950 text-white p-2.5 rounded-xl flex items-center justify-center shadow-3xs">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-serif font-black text-[#22221B] flex items-center gap-2">
              The Cross-Disciplinary Rosetta Canvas
              <span className="text-[9px] bg-indigo-950/15 text-indigo-950 border border-indigo-950/25 px-2.5 py-0.5 rounded-full font-mono uppercase font-black">
                Cognitive Rosetta v1.0
              </span>
            </h1>
            <p className="text-[11px] text-[#7C7461] font-medium hidden sm:block">
              De-jargonize heavy scientific research by translating foreign empirical literature instantly into clean software analogies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7C7461] hover:text-[#22221B] border border-[#EAE6DB] bg-white transition-all cursor-pointer shadow-3xs hover:bg-[#F2EDDF]"
            title="Close Rosetta Layer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Rosetta Control Board */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        
        {/* Preset Selector Banner */}
        <div className="bg-[#FAF6EA] border border-[#EAE6DB] rounded-[24px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs">
          <div className="flex items-center gap-3 text-left">
            <Activity className="h-4.5 w-4.5 text-indigo-950 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#7C7461] font-bold block">
                SELECT COGNITIVE TRANSLATION SCHEME
              </span>
              <p className="text-sm font-serif font-bold text-[#22221B] mt-0.5">
                Load Highly Specialised Domain Mappings
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ROSETTA_PRESETS.map((p, index) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePresetIdx(index);
                  setHoveredTermId(null);
                  setSelectedTermId(null);
                }}
                className={`px-3.5 py-1.8 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                  activePresetIdx === index
                    ? "bg-indigo-950 text-[#FAF9F5] border-indigo-950 font-bold shadow-xs"
                    : "bg-white border-[#EAE6DB] text-[#4F4F42] hover:bg-[#F2EDDF]"
                }`}
              >
                {p.sourceDiscipline} ⟶ CS
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Instructional Banner */}
        <div className="bg-indigo-50/70 border border-indigo-200/50 rounded-2xl p-4 flex gap-3 text-left">
          <Info className="h-4.5 w-4.5 text-indigo-900 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs leading-relaxed text-indigo-950/90">
            <span className="font-bold">Interactivity Rules:</span> The document below uses specialized terminology. Hover or tap on any <span className="bg-amber-100/60 font-semibold px-1 rounded text-amber-950">highlighted word</span> in the Left Panel to project a secure analogical vector line linking it to a corresponding Rosetta Blueprint Card in the Right Panel.
          </div>
        </div>

        {/* SPLIT PANEL DASHBOARD VIEWPORTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative h-[700px] items-stretch">
          
          {/* LEFT PANEL: The Source Text (Specialized discipline) */}
          <div 
            ref={leftPanelRef}
            className="lg:col-span-5 bg-white border border-[#EAE6DB] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between overflow-y-auto shadow-3xs relative select-text"
          >
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[#FAF9F4] mb-4.5">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                  {preset.sourceDiscipline}
                </span>
                <span className="text-[10px] font-mono text-[#7C7461]">Raw Source File</span>
              </div>

              {/* Title & Metadata */}
              <div className="mt-2 text-left">
                <span className="text-[8.5px] font-mono bg-neutral-900 text-neutral-100 px-2 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                  {preset.paperSource}
                </span>
                <h2 className="font-serif font-black text-[#151512] text-lg mt-3 leading-snug">
                  {preset.paperTitle}
                </h2>
                <div className="text-[10.5px] font-mono text-[#7C7461] mt-1.5 font-bold">
                  AUTHORS: {preset.paperAuthors}
                </div>
              </div>

              {/* Collapsible Abstract Preview Box */}
              <div className="bg-[#FAF9F5] border border-[#EAE6DB] rounded-2xl p-4 mt-5 text-left text-xs leading-relaxed text-[#4F4F42]">
                <span className="text-[8px] font-mono text-neutral-500 font-extrabold uppercase tracking-widest block mb-1">
                  OFFICIAL ABSTRACT DETAILED PREVIEW
                </span>
                <p className="font-serif italic text-[11.5px] text-[#5C5C4E]">
                  "{preset.paperAbstract}"
                </p>
              </div>

              {/* Main Body Paragraph Area featuring dynamic inline spans */}
              <div className="mt-8 space-y-6 text-left font-serif text-[13.5px] text-[#22221B] leading-relaxed">
                <span className="text-[9px] font-mono text-[#7C7461] font-bold block uppercase tracking-widest pb-1 border-b border-[#F2EDDF]/40">
                  ACTUATIVE LITERATURE EXCERPTS
                </span>
                {preset.bodyParagraphs.map((par, p_idx) => (
                  <p key={p_idx} className="indent-4 leading-relaxed tracking-wide text-justify">
                    {renderParagraphWithTerms(par)}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-[#FAF9F4] text-left text-[10px] font-mono text-[#7C7461]">
              Hover over colored nodes to observe logical structural mappings.
            </div>
          </div>

          {/* CENTER SPLIT SVG CHASM overlay */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center relative pointer-events-none select-none">
            <svg
              ref={svgCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
              style={{ overflow: "visible" }}
            >
              {preset.analogies.map((analogy) => {
                const coords = lineCoordinates[analogy.id];
                if (!coords) return null;

                const isHovered = hoveredTermId === analogy.id;
                const isSelected = selectedTermId === analogy.id;
                const isActive = isHovered || isSelected;

                const strokeColor = isActive ? "#1E1B4B" : "#D4D4D4";
                const strokeWidth = isActive ? 2.5 : 1;
                const dashArray = isActive ? "none" : "3 3";

                // Draw standard Bezier S-curve
                const { x1, y1, x2, y2 } = coords;
                const cp1 = x1 + (x2 - x1) * 0.45;
                const cp2 = x1 + (x2 - x1) * 0.55;

                return (
                  <g key={analogy.id}>
                    <path
                      d={`M ${x1} ${y1} C ${cp1} ${y1}, ${cp2} ${y2}, ${x2} ${y2}`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArray}
                      fill="none"
                      className="transition-all duration-300 opacity-80"
                    />
                    {isActive && (
                      <circle
                        cx={x1}
                        cy={y1}
                        r="3.5"
                        fill="#1E1B4B"
                        className="animate-pulse"
                      />
                    )}
                    {isActive && (
                      <circle
                        cx={x2}
                        cy={y2}
                        r="3.5"
                        fill="#1E1B4B"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Immersive core decorative vector elements to signify dynamic translation bridge */}
            <div className="flex flex-col items-center gap-1 opacity-20">
              <Binary className="h-6 w-6 text-[#7C7461]" />
              <span className="text-[8px] font-mono text-[#7C7461] uppercase tracking-widest">
                TRANSDUCTION LAYER
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: The Rosetta Translation Layer (Target Domain Analogy Cards) */}
          <div 
            ref={rightPanelRef}
            className="lg:col-span-5 bg-white border border-[#EAE6DB] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between overflow-y-auto shadow-3xs"
          >
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[#FAF9F4] mb-4.5">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded uppercase">
                  {preset.targetDiscipline}
                </span>
                <span className="text-[10px] font-mono text-indigo-900 font-extrabold">Rosetta Decoding</span>
              </div>

              <div className="mt-2 text-left mb-6">
                <span className="text-[8.5px] font-mono bg-indigo-950 text-indigo-100 px-2 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                  Target Domain Jargon Framework
                </span>
                <h2 className="font-serif font-black text-[#151512] text-lg mt-3 leading-snug">
                  Native Translation Blueprints
                </h2>
                <p className="text-[10.5px] font-mono text-[#7C7461] mt-1.5">
                  Translating specialized constraints into production software design guidelines
                </p>
              </div>

              {/* Dynamic Map cards */}
              <div className="space-y-4">
                {preset.analogies.map((analogy) => {
                  const isHovered = hoveredTermId === analogy.id;
                  const isSelected = selectedTermId === analogy.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <div
                      key={analogy.id}
                      id={`rosetta-target-${analogy.id}`}
                      onMouseEnter={() => setHoveredTermId(analogy.id)}
                      onMouseLeave={() => setHoveredTermId(null)}
                      onClick={() => setSelectedTermId(selectedTermId === analogy.id ? null : analogy.id)}
                      className={`p-4.5 rounded-2xl border text-left transition-all duration-300 relative ${
                        isActive
                          ? "bg-indigo-50/40 border-indigo-950 ring-2 ring-indigo-950/5 shadow-xs translate-x-1"
                          : "bg-[#FAFAF6]/80 border-[#EAE6DB]"
                      }`}
                    >
                      {/* Interactive focus anchor tab on active highlight */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl transition-all ${
                        isActive ? "bg-indigo-950" : "bg-transparent"
                      }`} />

                      <div className="pl-2">
                        <div className="flex justify-between items-center gap-1 mb-2.5 border-b border-[#F2EDDF]/40 pb-2">
                          <span className="text-[9.5px] font-mono text-amber-850 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {analogy.sourceTerm}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-indigo-950">
                            ↳ Native Translation
                          </span>
                        </div>

                        {/* Output target paradigm title */}
                        <h4 className="font-serif font-bold text-[#151512] text-sm group-hover:text-amber-950">
                          {analogy.targetConcept}
                        </h4>

                        {/* Structural Analogy Justification (the 2 sentences required) */}
                        <p className="text-xs text-[#5C5C4E] font-serif leading-relaxed mt-2 italic">
                          {analogy.justification}
                        </p>

                        {/* Variable Parameter Blueprint matching table */}
                        <div className="mt-4 pt-4 border-t border-[#F2EDDF]/40">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-extrabold block mb-2">
                             Structural Analogy Blueprint Variables Map
                          </span>

                          <div className="overflow-hidden border border-[#EAE6DB] rounded-lg bg-white">
                            <table className="min-w-full divide-y divide-[#EAE6DB] text-left text-[11px] font-sans">
                              <thead>
                                <tr className="bg-[#FAF9F5]">
                                  <th className="px-2.5 py-1.5 font-mono text-[9px] text-[#7C7461] uppercase border-r border-[#EAE6DB]">Science Variable</th>
                                  <th className="px-2.5 py-1.5 font-mono text-[9px] text-indigo-950 uppercase">Software Counterpart</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EAE6DB]">
                                {analogy.variables.map((v, v_idx) => (
                                  <tr key={v_idx} className="hover:bg-neutral-50/50">
                                    <td className="px-2.5 py-2 font-mono border-r border-[#EAE6DB]">
                                      <span className="text-amber-900 font-bold bg-amber-500/5 px-1 py-0.5 rounded mr-1">
                                        {v.sourceVar}
                                      </span>
                                      <span className="text-[10px] text-neutral-500 block sm:inline">({v.sourceDesc})</span>
                                    </td>
                                    <td className="px-2.5 py-2 font-mono text-indigo-950 font-semibold">
                                      <span className="bg-indigo-50/50 px-1 py-0.5 rounded mr-1">
                                        {v.targetVar}
                                      </span>
                                      <span className="text-[10px] text-neutral-500 block sm:inline font-normal">({v.targetDesc})</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-[#FAF9F4] text-left text-[10px] font-mono text-indigo-950 font-bold flex justify-between items-center">
              <span>ACTIVE SYSTEM DECODING SYSTEM</span>
              <span className="text-emerald-700 font-extrabold uppercase">● Dynamic Sync Online</span>
            </div>
          </div>

        </div>

        {/* PERSISTENT STRUCTURAL SUMMARY DRAWER SECTION */}
        <div className="bg-[#FAF6EA] border border-[#EAE6DB] rounded-[24px] p-5 shadow-inner text-left">
          <div className="flex items-center gap-1.5 border-b border-[#EAE6DB] pb-3 mb-3">
            <Lightbulb className="h-4.5 w-4.5 text-indigo-950" />
            <h4 className="font-sans text-[10.5px] font-extrabold uppercase tracking-widest text-[#22221B]">
              Lumina Cross-Disciplinary Transduction Mechanics
            </h4>
          </div>

          <p className="font-serif text-xs text-[#5C5C4E] leading-relaxed">
            By analyzing physical, chemical, or biological parameters as topological abstractions, the **Rosetta Engine** uncovers the deep homologous blueprints that link science with computer engineering. Volatility curves are modeled with exponential cache decay states; receptor channels act as asynchronous queues. This cross-mapping bridges different research vocabularies, enabling software architects to absorb chemical or thermodynamic papers in their own native terminology without loss of systemic precision.
          </p>
        </div>

      </div>

      {/* Rosetta Canvas Mini Footer */}
      <footer className="py-4 mt-6 border-t border-[#EAE6DB] text-[11px] text-[#8C8474] font-mono">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <span>Lumina Rosetta Engine • © 2026</span>
          <span className="text-emerald-700 hidden sm:inline">● Transduction Active</span>
        </div>
      </footer>

    </div>
  );
}
