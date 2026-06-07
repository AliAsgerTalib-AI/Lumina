import React, { useState, useEffect } from "react";
import { 
  Dna, 
  Sparkles, 
  Check, 
  X, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  RefreshCw, 
  Info,
  Layers,
  Activity,
  History,
  Lightbulb,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Interfaces for Mutation Matrix
interface VariableOrigin {
  symbol: string;
  name: string;
  dimension: string;
  source: string;
  role: string;
}

interface MutationPreset {
  id: string;
  name: string;
  difficulty: "Stable" | "Collapsed" | "Verified";
  paperA: {
    title: string;
    authors: string;
    source: string;
    formula: string;
    rawFormulaText: string;
    explanation: string;
    variables: VariableOrigin[];
  };
  paperB: {
    title: string;
    authors: string;
    source: string;
    formula: string;
    rawFormulaText: string;
    explanation: string;
    variables: VariableOrigin[];
  };
  mutatedEquation: {
    formula: string;
    description: string;
    symbolMap: string;
  };
  dimensionalValidation: {
    leftUnit: string;
    rightUnit: string;
    proofSteps: string[];
    isCompatible: boolean;
    errorReason?: string;
    diagnosticLog?: string[];
  };
  variableLedger: {
    symbol: string;
    origin: string;
    dimension: string;
    functionalRole: string;
  }[];
}

const MUTATION_PRESETS: MutationPreset[] = [
  {
    id: "stable-viscosity-vapor",
    name: "Viscous Fluid Drag ⟷ Canopy Gas Diffusion",
    difficulty: "Stable",
    paperA: {
      title: "Stress Distribution in Boundary Layer Laminar Flow",
      authors: "Sir George Stokes, Dr. G. Reynolds",
      source: "Journal of Mathematical Fluid Mechanics",
      formula: "τ = μ · (du / dy)",
      rawFormulaText: "[Shear Stress] = [Dynamic Viscosity] · [Velocity Gradient]",
      explanation: "Models the energy friction per unit area of a dynamic fluid parallel layers sliding past each other.",
      variables: [
        { symbol: "τ", name: "Boundary Shear Stress Coefficient", dimension: "M L⁻¹ T⁻²", source: "Paper A", role: "Measures force per leaf surface boundary area dimensions." },
        { symbol: "μ", name: "Dynamic Atmospheric Viscosity Index", dimension: "M L⁻¹ T⁻¹", source: "Paper A", role: "Determines physical fluid internal resistance to shear decay forces." },
        { symbol: "u", name: "Mean Lateral Boundary Wind Velocity", dimension: "L T⁻¹", source: "Paper A", role: "The target vector speed profile across laminar lines." },
        { symbol: "y", name: "Stomata Boundary Layer Elevation", dimension: "L", source: "Paper A", role: "Physical spatial elevation perpendicular to shear vector." }
      ]
    },
    paperB: {
      title: "Crop Heat Vaporization and Stomatal Water Flux Dynamics",
      authors: "Dr. Clara Thorne et al.",
      source: "International Journal of Bio-Meteorology",
      formula: "H_flux = -(ρ · C_p · D_v) · (dT / dx)",
      rawFormulaText: "[Heat Flux Rate] = -[Density · Heat Capacity · Diffusivity] · [Temperature Gradient]",
      explanation: "Models dynamic vapor flow and solar energy exchange between leaf stomata and planetary wind layers.",
      variables: [
        { symbol: "H_flux", name: "Sensible Turbulent Heat Flux", dimension: "M T⁻³", source: "Paper B", role: "Determines power per area thermal radiation released off leaf boundaries." },
        { symbol: "ρ", name: "Atmospheric Boundary Fluid Density", dimension: "M L⁻³", source: "Paper B", role: "Gas particle mass concentration parameter per unit volume." },
        { symbol: "C_p", name: "Specific Isobaric Gas Heat Capacity", dimension: "L² T⁻² Θ⁻¹", source: "Paper B", role: "Thermal energy ratio coefficient required to alter air temperature." },
        { symbol: "D_v", name: "Physical Molecular Diffusivity Constant", dimension: "L² T⁻¹", source: "Paper B", role: "Spontaneous coefficient scaling transport velocity through pore gaps." },
        { symbol: "T", name: "Localized Canopy Leaf Temperature", dimension: "Θ", source: "Paper B", role: "Absolute Kelvin heat states of active crop segments." },
        { symbol: "x", name: "Stomatal Vapor Travel Travel Distance", dimension: "L", source: "Paper B", role: "Displacement path length of escaping vapor plume." }
      ]
    },
    mutatedEquation: {
      formula: "Φ_{mutated} = τ · \\left( \\frac{ρ · C_p · D_v}{μ} \\right) · \\frac{dT}{dx}",
      description: "Generates the 'Viscous Gas Thermal Drag Equation' coupling mechanical boundary shear tension to thermal kinetic transport.",
      symbolMap: "Φ_{mutated} = Thermal dissipation momentum rate of boundary gas layer"
    },
    dimensionalValidation: {
      leftUnit: "[M T⁻⁴] (Heat Flux Acceleration Rate)",
      rightUnit: "[M T⁻⁴] (Dimensional Product of τ · (ρ·C_p·D_v / μ) · (dT/dx))",
      isCompatible: true,
      proofSteps: [
        "1. Evaluate physical dimensions of Shear Stress [τ] = M L⁻¹ T⁻².",
        "2. Evaluate Atmospheric Viscosity Index [μ] = M L⁻¹ T⁻¹.",
        "3. Compute physical mapping of combined ratio [ρ · C_p · D_v / μ] = (M L⁻³) · (L² T⁻² Θ⁻¹) · (L² T⁻¹) / (M L⁻¹ T⁻¹) = [L² T⁻² Θ⁻¹].",
        "4. Multiply intermediate ratio by Shear Stress [τ] = [M L⁻¹ T⁻²] · [L² T⁻² Θ⁻¹] = [M L T⁻⁴ Θ⁻¹].",
        "5. Evaluate Gradient [dT / dx] = [Θ / L].",
        "6. Compute final dimensional multiplication to yield target: [M L T⁻⁴ Θ⁻¹] · [Θ L⁻¹] = [M T⁻⁴]. Both boundaries match smoothly."
      ],
      diagnosticLog: [
        "[SYSTEM LVM-COMPILER] Initiating algebraic parsing of hybrid equation candidate.",
        "[SYSTEM LVM-COMPILER] Extracting Left-Hand-Side objective target matrix units.",
        "[SYSTEM LVM-COMPILER] Mapping dimensions: Mass (M), Length (L), Time (T), Temperature (Θ).",
        "[SYSTEM LVM-COMPILER] Computing boundary tension limits. Symmetry test: PASSED."
      ]
    },
    variableLedger: [
      { symbol: "Φ", origin: "Lumina Synthesis Compiler Block", dimension: "M T⁻⁴", functionalRole: "Dynamic acceleration index of kinetic boundary layer heat dissipation" },
      { symbol: "τ", origin: "Paper A (Shear Stress)", dimension: "M L⁻¹ T⁻²", functionalRole: "Mechanical shear stress applied from ambient crop wind boundary layers" },
      { symbol: "ρ", origin: "Paper B (Air Density)", dimension: "M L⁻³", functionalRole: "Mass density calibration parameter of escaping water vapor medium" },
      { symbol: "C_p", origin: "Paper B (Specific Heat Capacity)", dimension: "L² T⁻² Θ⁻¹", functionalRole: "Thermal retention scaling multiplier under changing dynamic drag" },
      { symbol: "D_v", origin: "Paper B (Molecular Diffusivity)", dimension: "L² T⁻¹", functionalRole: "Spontaneous passive particle penetration index through stomata" },
      { symbol: "μ", origin: "Paper A (Dynamic Viscosity)", dimension: "M L⁻¹ T⁻¹", functionalRole: "Intrinsic momentum resistance of turbulent leaf air layers" },
      { symbol: "T", origin: "Paper B (Temperature Bounds)", dimension: "Θ", functionalRole: "Absolute temperature differential motivating the vapor escape kinetic path" },
      { symbol: "x", origin: "Paper B (Displacement Distance)", dimension: "L", functionalRole: "Boundary layer height resisting immediate thermal equilibrium" }
    ]
  },
  {
    id: "unstable-quantum-market",
    name: "Relativistic Quantum Momentum ⟷ Option Pricing Volatility",
    difficulty: "Collapsed",
    paperA: {
      title: "Relativistic Wave Mechanics and Energy Dispersions",
      authors: "P. Dirac, L. de Broglie",
      source: "Foundations of Quantum Mathematics",
      formula: "E^2 = (p · c)^2 + (m_0 · c^2)^2",
      rawFormulaText: "[Total Energy]² = ([Momentum] · [Speed of Light])² + ([Rest Mass] · [Speed]²)²",
      explanation: "Calculates the total physical energy of high-energy subatomic elements using relativistic space-time constraints.",
      variables: [
        { symbol: "E", name: "Total State Particle Energy", dimension: "M L² T⁻²", source: "Paper A", role: "Total thermodynamic/physical work representation in Joules." },
        { symbol: "p", name: "Relativistic Particle Momentum", dimension: "M L T⁻¹", source: "Paper A", role: "Mass velocity vector product tracking particle displacement." },
        { symbol: "c", name: "Speed of Light in Vacuum Space", dimension: "L T⁻¹", source: "Paper A", role: "Constant speed limit parameter of energy propagation." },
        { symbol: "m_0", name: "Invariant Inherent Rest Mass", dimension: "M", source: "Paper A", role: "Intrinsic matter resistance representing static potential density." }
      ]
    },
    paperB: {
      title: "Black-Scholes Heat Diffusion Analogy for Derivative Options",
      authors: "F. Black, M. Scholes, R. C. Merton",
      source: "Journal of Political Economy & Mathematical Finance",
      formula: "∂V/∂t + 0.5·σ^2·S^2·∂^2V/∂S^2 + r·S·∂V/∂S - r·V = 0",
      rawFormulaText: "[Price Change Rate] + 0.5·[Volatility]²·[Price]²·[Second Derivative] + ... = 0",
      explanation: "Models derivative value decay using stochastic Brownian drift models to simulate market fluctuations.",
      variables: [
        { symbol: "V", name: "Stochastic Derivative Option Value", dimension: "[Currency]", source: "Paper B", role: "Calculated monetary trading premium in active broker ledgers." },
        { symbol: "S", name: "Underlying Stock Asset Price Value", dimension: "[Currency]", source: "Paper B", role: "Current baseline asset value subject to market brownian walk." },
        { symbol: "σ", name: "Historical Asset Return Volatility", dimension: "T^{-1/2}", source: "Paper B", role: "Standard deviation rate parameters tracking trading variance." },
        { symbol: "r", name: "Risk-Free Continuous Interest rate", dimension: "T⁻¹", source: "Paper B", role: "Exponential yield rate tracking sovereign currency accumulation." },
        { symbol: "t", name: "Active Contract Time to Expiration", dimension: "T", source: "Paper B", role: "Countdown duration leading to options settlement." }
      ]
    },
    mutatedEquation: {
      formula: "f_{mutated}(S, p) = p · c + r · S",
      description: "Attempts absolute synthesis by combining quantum momentum energy directly with continuous financial risk pricing.",
      symbolMap: "f_{mutated} = Illogical hybrid market-matter momentum coefficient"
    },
    dimensionalValidation: {
      leftUnit: "[M L² T⁻²] (Energy Vector Joule scale)",
      rightUnit: "[Currency · T⁻¹] (Option continuous profit velocity stream)",
      proofSteps: [
        "1. Identify physical dimensions of Momentum term [p · c] = Energy = [M L² T⁻²].",
        "2. Identify finance dimension of rate yield [r · S] = yield risk * option = [Currency · T⁻¹].",
        "3. Assert equivalence relation request: [M L² T⁻²] ≟ [Currency · T⁻¹].",
        "4. [CRITICAL MISMATCH] Physics Joules cannot merge directly with Currency Units. Compile aborted due to dimensional misalignment."
      ],
      isCompatible: false,
      errorReason: "Orthogonal Units Discrepancy: Attempted to add physical kinetic energy [p · c = M L² T⁻²] directly to a financial risk velocity rate [r · S = Currency · T⁻¹] without an intermediate coordinate price-to-action transduction constant. Dimensional consistency checks must guarantee physical properties are identical before algebraic summation.",
      diagnosticLog: [
        "[SYSTEM LVM-COMPILER] Initializing mathematical mutation compiler parsing...",
        "[SYSTEM LVM-COMPILER] Parsing Term B_1: p · c ⟹ Momentum · Velocity = [M L T⁻¹] · [L T⁻¹] = [M L² T⁻²] (Energy / Joules).",
        "[SYSTEM LVM-COMPILER] Parsing Term B_2: r · S ⟹ Yield Rate · Price = [T⁻¹] · [Currency] = [Currency · T⁻¹].",
        "[⚠️ FAILURE] Attempted integration: [M L² T⁻²] + [Currency · T⁻¹]. Isomorphic collision detector tripped.",
        "[❌ ERROR] Symmetrical boundary violated. Halting compiler state to preserve logical sanity!"
      ]
    },
    variableLedger: [
      { symbol: "p", origin: "Paper A (Quantum Momentum)", dimension: "M L T⁻¹", functionalRole: "Physical subatomic displacement trajectory momentum" },
      { symbol: "c", origin: "Paper A (Speed of Light)", dimension: "L T⁻¹", functionalRole: "Universal physical scaling velocity parameter" },
      { symbol: "r", origin: "Paper B (Interest Rate)", dimension: "T⁻¹", functionalRole: "Monetary risk free compound multiplier over elapsed epochs" },
      { symbol: "S", origin: "Paper B (Asset Stock Value)", dimension: "[Currency]", functionalRole: "Financial valuation metric representing market broker price ledger" }
    ]
  },
  {
    id: "verified-information-entropy",
    name: "Shannon Information Entropy ⟷ Clausius State Entropy",
    difficulty: "Verified",
    paperA: {
      title: "A Mathematical Theory of Communication",
      authors: "C. E. Shannon",
      source: "Bell System Technical Journal",
      formula: "H_info = - ∑ (p_i · log_2(p_i))",
      rawFormulaText: "[Information Entropy] = - ∑ ([Probability] · log₂ [Probability])",
      explanation: "Measures statistical uncertainty, dispersion of messages, and logical code information density within noise-filled paths.",
      variables: [
        { symbol: "H_info", name: "Communication Information Entropy", dimension: "Dimensionless", source: "Paper A", role: "Uncertainty rating measured in discrete Shannon bits (1)." },
        { symbol: "p_i", name: "Individual Message Occurrence Probability", dimension: "Dimensionless", source: "Paper A", role: "Relative frequency probability tracking token distributions (1)." }
      ]
    },
    paperB: {
      title: "Microscopic Microstate Assemblies and Static Entropy Limits",
      authors: "L. Boltzmann, J. Willard Gibbs",
      source: "Imperial Academy of Sciences Vienna",
      formula: "S_thermo = k_B · ln(Ω)",
      rawFormulaText: "[Thermodynamic Entropy] = [Boltzmann Constant] · ln([Microstate Multiplicity])",
      explanation: "Models heat state dispersion, measuring microstate availability to define thermo-frictional loss in locked environments.",
      variables: [
        { symbol: "S_thermo", name: "Macroscopic Physical Thermodynamic Entropy", dimension: "M L² T⁻² Θ⁻¹", source: "Paper B", role: "Clausius physical entropy scaling Kelvin temperature changes." },
        { symbol: "k_B", name: "Universal Boltzmann Thermodynamic Constant", dimension: "M L² T⁻² Θ⁻¹", source: "Paper B", role: "Fundamental entropy scaling coefficient relating microstates to Joules/K." },
        { symbol: "Ω", name: "Microstate Multiplicity Spatial Multiplicity", dimension: "Dimensionless", source: "Paper B", role: "Mathematical integer tallying valid microscopic cell configurations (1)." }
      ]
    },
    mutatedEquation: {
      formula: "S_{mechanic} = - k_B · \\left( \\sum p_i · log_2(p_i) \\right) · ln(Ω)",
      description: "Assembles 'Information-Mechanic Gas Entropy System' directly proving that thermodynamic complexity scale is mathematically scaled by digital data probability fields.",
      symbolMap: "S_{mechanic} = Transductive thermodynamic-informational entropy index"
    },
    dimensionalValidation: {
      leftUnit: "[M L² T⁻² Θ⁻¹] (Physical thermal entropy Joules per Kelvin)",
      rightUnit: "[M L² T⁻² Θ⁻¹] (Dimensional product scaling with Boltzmann parameters)",
      isCompatible: true,
      proofSteps: [
        "1. Identify left side target entropy [S_thermo] ⟹ [M L² T⁻² Θ⁻¹].",
        "2. Parse Information Entropy Term [-∑ (p_i · log_2(p_i))] ⟹ Dimensionless [1] (Bits).",
        "3. Parse Multiplicity Logarithmic scale [ln(Ω)] ⟹ Dimensionless [1].",
        "4. Compound right-side variables: [k_B] · [H_info] · [ln(Ω)] ⟹ [M L² T⁻² Θ⁻¹] · [1] · [1] = [M L² T⁻² Θ⁻¹].",
        "5. Assert absolute equivalence. Both margins settle onto thermodynamic equilibrium parameters perfectly."
      ],
      diagnosticLog: [
        "[SYSTEM LVM-COMPILER] Initializing molecular state statistical compiler pipeline.",
        "[SYSTEM LVM-COMPILER] Checking Shannon probability bit bounds constraint.",
        "[SYSTEM LVM-COMPILER] Validating dimensional metrics mismatch score: 0.00.",
        "[SYSTEM LVM-COMPILER] Physical unit validation returns absolute symmetric success."
      ]
    },
    variableLedger: [
      { symbol: "S_{mechanic}", origin: "Lumina Synthesis Compiler Block", dimension: "M L² T⁻² Θ⁻¹", functionalRole: "Physical-informational microstate entropy of combined channel networks" },
      { symbol: "k_B", origin: "Paper B (Boltzmann Constant)", dimension: "M L² T⁻² Θ⁻¹", functionalRole: "Scaling linkage bridging quantum information distributions with absolute Celsius energy" },
      { symbol: "p_i", origin: "Paper A (Shannon Probability)", dimension: "Dimensionless", functionalRole: "Individual discrete state occurrence chance in noisy medium channels" },
      { symbol: "Ω", origin: "Paper B (State Multiplicity)", dimension: "Dimensionless", functionalRole: "Total options spatial arrangement multiplier index of particle cells" }
    ]
  }
];

export default function GenerativeMathCompiler({ onClose }: { onClose: () => void }) {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const preset = MUTATION_PRESETS[activePresetIdx];

  const [compileState, setCompileState] = useState<"idle" | "compiling" | "completed">("idle");
  const [animationStep, setAnimationStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"equation" | "validation" | "ledger">("equation");

  // Dynamic visual variables that decouple & slide during click mutation trigger
  const [symbolsPaperA, setSymbolsPaperA] = useState<string[]>([]);
  const [symbolsPaperB, setSymbolsPaperB] = useState<string[]>([]);
  const [mutatedOutputElements, setMutatedOutputElements] = useState<string[]>([]);

  // Prepare simple character splitting for animated drift on MUTATE compilation
  useEffect(() => {
    // Split formula formulas for animations
    setSymbolsPaperA(preset.paperA.formula.split("").filter(c => c.trim().length > 0));
    setSymbolsPaperB(preset.paperB.formula.split("").filter(c => c.trim().length > 0));
    setCompileState("idle");
    setAnimationStep(0);
    setActiveTab("equation");
  }, [activePresetIdx]);

  const handleMutate = async () => {
    if (compileState === "compiling") return;
    setCompileState("compiling");
    setAnimationStep(1); // Start decoupling

    // Sequence progress timings simulating modular restructuring
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimationStep(2); // sliding and combining components in center

    await new Promise(resolve => setTimeout(resolve, 1200));
    setAnimationStep(3); // settling into actual formulas

    await new Promise(resolve => setTimeout(resolve, 500));
    setCompileState("completed");
    setAnimationStep(4);
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case "Stable": return "bg-emerald-500/15 text-emerald-800 border-emerald-500/25";
      case "Verified": return "bg-blue-500/15 text-blue-800 border-blue-500/25";
      case "Collapsed": return "bg-rose-500/15 text-rose-800 border-rose-500/25";
      default: return "bg-[#7C8464]/10 text-[#7C8464] border-[#7C8464]/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] overflow-y-auto flex flex-col antialiased font-sans">
      
      {/* Editorial Sticky Header Navbar */}
      <nav className="sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8E4D9] flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <div className="bg-[#2D2D24] text-white p-2.5 rounded-xl flex items-center justify-center">
            <Dna className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-serif font-black text-[#2D2D24] flex items-center gap-2">
              Generative Math Compiler
              <span className="text-[9px] bg-[#2D2D24]/10 text-[#2D2D24] border border-[#2D2D24]/20 px-2.5 py-0.5 rounded-full font-mono uppercase font-black">
                Equation Mutator v3.0
              </span>
            </h1>
            <p className="text-[11px] text-[#8C8474] font-medium hidden sm:block">
              Cross-breed, decouple, and compile objective function variables of heterogeneous scientific papers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8C8474] hover:text-[#2D2D24] border border-[#E8E4D9] bg-white transition-all cursor-pointer shadow-3xs hover:bg-[#F2EDE4]/50"
            title="Exit Compiler Workspace"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Compiler Sandbox Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Preset Selector Banner */}
        <div className="bg-white blueprint-graph-paper border border-[#E8E4D9] rounded-[24px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs relative overflow-hidden">
          <div className="flex items-center gap-3 text-left">
            <Cpu className="h-4.5 w-4.5 text-[#7C8464] flex-shrink-0" />
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C8474] font-bold block">
                SELECT LOGICAL CROSS-BREED PAIRING
              </span>
              <p className="text-sm font-serif font-bold text-[#2D2D24] mt-0.5">
                Load Disparate Academic State Theories
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {MUTATION_PRESETS.map((p, index) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePresetIdx(index);
                }}
                className={`px-3.5 py-1.8 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                  activePresetIdx === index
                    ? "bg-[#2D2D24] text-[#F9F7F2] border-[#2D2D24] font-semibold shadow-xs"
                    : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Instructional Helper Banner */}
        <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-left">
          <Info className="h-4.5 w-4.5 text-amber-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-900/90">
            <span className="font-bold">Mathematical Mutation constraints:</span> Selected papers present independent formulas. Click <strong className="font-semibold text-amber-950">[ MUTATE NOTATION EVOLUTION ]</strong> to trigger variable decoupling, floating recombination animations, and dimensional compliance validation. Stable mutations succeed with solid charcoal typography, while dimension conflicts generate rigorous warnings and halt compiled state output.
          </div>
        </div>

        {/* The Mutation Matrix Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative min-h-[480px]">
          
          {/* LEFT SLAT: Paper A Objective Function */}
          <div className="lg:col-span-5 bg-white blueprint-graph-paper border border-[#E8E4D9] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-3xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#7C8464]/3 opacity-20 pointer-events-none rounded-bl-full" />
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4D9]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C8464] bg-[#7C8464]/10 px-2.5 py-0.5 rounded uppercase">
                  Equation Source A
                </span>
                <span className="text-[10px] font-mono text-[#8C8474]">L-Space Model</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-[#F9F7F2] px-2 py-0.5 rounded font-black">
                  {preset.paperA.source}
                </span>
                <h3 className="font-serif font-black text-[#1E2019] text-base mt-2 leading-snug">
                  {preset.paperA.title}
                </h3>
                <p className="text-[10px] text-[#8C8474] font-medium mt-1 font-mono">
                  By {preset.paperA.authors}
                </p>
              </div>

              {/* Monospace Large Notation Box */}
              <div className="bg-[#F2EDE4]/40 border border-[#E8E4D9] p-6 rounded-2xl mt-5 flex flex-col items-center justify-center min-h-[110px] relative">
                <span className="text-[8px] font-mono text-[#8C8474] absolute top-2 left-2 uppercase font-bold tracking-widest">
                  Original Formula A
                </span>
                <div className="text-xl sm:text-2xl font-mono font-black text-[#2D2D24] tracking-normal select-all flex flex-wrap gap-1 items-center justify-center">
                  {symbolsPaperA.map((char, i) => (
                    <motion.span
                      key={`alpha-${i}`}
                      animate={
                        animationStep === 1
                          ? { y: [0, -10, 0], opacity: [1, 0.4, 0.5] }
                          : animationStep === 2
                          ? { x: 120, y: 150, opacity: 0.1, scale: 0.8 }
                          : { x: 0, y: 0, opacity: 1, scale: 1 }
                      }
                      transition={{ duration: 0.8, delay: i * 0.02, ease: "easeInOut" }}
                      className="inline-block selection:bg-transparent"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-[#8C8474] mt-3 uppercase text-center border-t border-[#E8E4D9]/80 pt-1.5 w-full">
                  {preset.paperA.rawFormulaText}
                </div>
              </div>

              {/* Explanatory notes */}
              <p className="mt-4 text-xs text-[#5A5A4A] leading-relaxed">
                {preset.paperA.explanation}
              </p>
            </div>

            {/* Variable Extraction Details */}
            <div className="mt-6 pt-5 border-t border-[#E8E4D9] flex flex-col gap-2.5">
              <span className="text-[10px] font-mono text-[#8C8474] uppercase font-bold tracking-wider">
                Extracted Variables Dimensional Identity:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {preset.paperA.variables.slice(0, 4).map((v) => (
                  <div key={v.symbol} className="bg-white px-2.5 py-1.5 rounded-lg border border-[#E8E4D9] flex justify-between items-center text-xs">
                    <span className="font-mono font-black text-[#2D2D24] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E4D9]">{v.symbol}</span>
                    <span className="font-mono text-[10px] text-[#8C8474] font-bold">{v.dimension}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTRE DIVISION: Interaction Mutator Zone */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center relative min-h-[160px] lg:min-h-0 bg-[#FAF8F5]/80 border border-[#E8E4D9] rounded-[24px] px-4 py-6">
            
            {/* Background floating lines elements visual flair */}
            <div className="absolute inset-0 bg-[radial-gradient(#7C8464_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

            <div className="relative z-20 flex flex-col items-center gap-4 text-center">
              
              <AnimatePresence mode="wait">
                {compileState === "idle" && (
                  <motion.div
                    key="idle-indicator"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="h-9 w-9 rounded-full bg-neutral-200/60 border border-neutral-300 flex items-center justify-center text-neutral-600 animate-pulse">
                      <Layers className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-[#8C8474] uppercase font-bold">
                      Pending Hybrid Build
                    </span>
                  </motion.div>
                )}

                {compileState === "compiling" && (
                  <motion.div
                    key="compiling-indicator"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="relative h-10 w-10 flex items-center justify-center">
                      <div className="animate-spin absolute inset-0 rounded-full border-2 border-dashed border-[#7C8464]" />
                      <Activity className="h-4 w-4 text-[#7C8464] animate-ping" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-amber-700 uppercase font-black animate-pulse">
                      MUTATING GENETICS [{animationStep === 1 ? "DECOUPLING" : "REASSEMBLING"}]
                    </span>
                  </motion.div>
                )}

                {compileState === "completed" && (
                  <motion.div
                    key="completed-indicator"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    {preset.dimensionalValidation.isCompatible ? (
                      <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                        <Check className="h-4.5 w-4.5" />
                      </div>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800 animate-bounce">
                        <X className="h-4.5 w-4.5" />
                      </div>
                    )}
                    <span className={`text-[9px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded ${
                      preset.dimensionalValidation.isCompatible 
                        ? "text-emerald-800 bg-emerald-50" 
                        : "text-rose-800 bg-rose-50"
                    }`}>
                      {preset.dimensionalValidation.isCompatible ? "MUTATION SECURE" : "INTEGRITY COLLAPSED"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MUTATE ACTION BUTTON */}
              <button
                onClick={handleMutate}
                disabled={compileState === "compiling"}
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-black shadow-xs tracking-wider transition-all cursor-pointer active:scale-97 select-none ${
                  compileState === "compiling"
                    ? "bg-[#E8E4D9] text-[#8C8474] border border-[#E8E4D9] cursor-not-allowed"
                    : "bg-[#2D2D24] text-white hover:bg-black border border-[#2D2D24]"
                }`}
              >
                [ MUTATE NOTATION EVOLUTION ]
              </button>

              <button
                onClick={() => {
                  setCompileState("idle");
                  setAnimationStep(0);
                }}
                className="text-[10px] font-mono text-[#8C8474] hover:text-[#2D2D24] underline cursor-pointer"
              >
                Reset Engine State
              </button>
            </div>
          </div>

          {/* RIGHT SLAT: Paper B Objective Function */}
          <div className="lg:col-span-5 bg-white blueprint-graph-paper border border-[#E8E4D9] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-3xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#7C8464]/3 opacity-20 pointer-events-none rounded-bl-full" />
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4D9]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#2D2D24] bg-[#2D2D24]/10 px-2.5 py-0.5 rounded uppercase font-bold">
                  Equation Source B
                </span>
                <span className="text-[10px] font-mono text-[#8C8474]">L-Space Model</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-[#F9F7F2] px-2 py-0.5 rounded font-black">
                  {preset.paperB.source}
                </span>
                <h3 className="font-serif font-black text-[#1E2019] text-base mt-2 leading-snug">
                  {preset.paperB.title}
                </h3>
                <p className="text-[10px] text-[#8C8474] font-medium mt-1 font-mono">
                  By {preset.paperB.authors}
                </p>
              </div>

              {/* Monospace Large Notation Box */}
              <div className="bg-[#F2EDE4]/40 border border-[#E8E4D9] p-6 rounded-2xl mt-5 flex flex-col items-center justify-center min-h-[110px] relative">
                <span className="text-[8px] font-mono text-[#8C8474] absolute top-2 left-2 uppercase font-bold tracking-widest">
                  Original Formula B
                </span>
                <div className="text-sm sm:text-[15px] font-mono font-black text-[#2D2D24] tracking-tight text-center select-all flex flex-wrap gap-1 items-center justify-center max-w-full overflow-hidden">
                  {symbolsPaperB.map((char, i) => (
                    <motion.span
                      key={`beta-${i}`}
                      animate={
                        animationStep === 1
                          ? { y: [0, 10, 0], opacity: [1, 0.4, 0.5] }
                          : animationStep === 2
                          ? { x: -120, y: 150, opacity: 0.1, scale: 0.8 }
                          : { x: 0, y: 0, opacity: 1, scale: 1 }
                      }
                      transition={{ duration: 0.8, delay: i * 0.01, ease: "easeInOut" }}
                      className="inline-block selection:bg-transparent"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-[#8C8474] mt-3 uppercase text-center border-t border-[#E8E4D9]/80 pt-1.5 w-full">
                  {preset.paperB.rawFormulaText}
                </div>
              </div>

              {/* Explanatory notes */}
              <p className="mt-4 text-xs text-[#5A5A4A] leading-relaxed">
                {preset.paperB.explanation}
              </p>
            </div>

            {/* Variable Extraction Details */}
            <div className="mt-6 pt-5 border-t border-[#E8E4D9] flex flex-col gap-2.5">
              <span className="text-[10px] font-mono text-[#8C8474] uppercase font-bold tracking-wider">
                Extracted Variables Dimensional Identity:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {preset.paperB.variables.slice(0, 4).map((v) => (
                  <div key={v.symbol} className="bg-white px-2.5 py-1.5 rounded-lg border border-[#E8E4D9] flex justify-between items-center text-xs">
                    <span className="font-mono font-black text-[#2D2D24] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E4D9]">{v.symbol}</span>
                    <span className="font-mono text-[10px] text-[#8C8474] font-bold">{v.dimension}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COMPILER OUTPUT WORKBENCH CARD (REVEALS UPON EVOLUTION) */}
        <AnimatePresence>
          {compileState === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`mt-4 border p-6 sm:p-10 bg-white rounded-[32px] shadow-xs text-left relative overflow-hidden transition-all duration-300 ${
                preset.dimensionalValidation.isCompatible
                  ? "border-[#E8E4D9]"
                  : "border-rose-400 ring-2 ring-rose-300/10 shadow-[0_4px_32px_rgba(225,29,72,0.08)] bg-rose-50/5"
              }`}
            >
              {/* Dynamic boundary warning outline for full-strength logic failures */}
              <div className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-r ${
                preset.dimensionalValidation.isCompatible
                  ? "from-[#2D2D24] to-[#7C8464]"
                  : "from-rose-500 via-amber-400 to-rose-600"
              }`} />

              {/* Symmetrical Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E8E4D9]/80 pb-6 mt-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none ${
                      preset.dimensionalValidation.isCompatible 
                        ? "bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20" 
                        : "bg-rose-500/15 text-rose-800 border border-rose-500/25 animate-pulse"
                    }`}>
                      <Sparkles className="h-3 w-3 animate-spin" />
                      {preset.dimensionalValidation.isCompatible ? "AUTOMATED HYBRID COMPILE SECURE" : "[ ❌ DIMENSIONAL INTEGRITY COLLAPSED ]"}
                    </span>
                  </div>
                  
                  <h2 className="font-serif font-black text-[#2D2D24] text-lg sm:text-2xl leading-none tracking-tight">
                    {preset.mutatedEquation.description}
                  </h2>
                </div>

                <div className="flex sm:flex-col gap-2 flex-shrink-0 text-left items-end">
                  <span className="text-[10px] font-mono text-[#8C8474]">COMPILE METADATA:</span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getDifficultyStyles(preset.difficulty)}`}>
                    Isomorphic Profile: {preset.difficulty}
                  </span>
                </div>
              </div>

              {/* TABBED COMPILER REPORT WORKBENCH NAVIGATION */}
              <div className="mt-8 flex gap-3 border-b border-[#FAF8F5] pb-3">
                <button
                  onClick={() => setActiveTab("equation")}
                  className={`px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer rounded-lg border flex items-center gap-1.5 ${
                    activeTab === "equation"
                      ? "bg-[#2D2D24] text-white border-[#2D2D24]"
                      : "bg-[#FAF8F5] text-[#5A5A4A] border-[#E8E4D9] hover:bg-[#F2EDE4]"
                  }`}
                >
                  <Layers className="h-4.5 w-4.5" />
                  <span>The Mutated Equation</span>
                </button>

                <button
                  onClick={() => setActiveTab("validation")}
                  className={`px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer rounded-lg border flex items-center gap-1.5 ${
                    activeTab === "validation"
                      ? "bg-[#2D2D24] text-white border-[#2D2D24]"
                      : "bg-[#FAF8F5] text-[#5A5A4A] border-[#E8E4D9] hover:bg-[#F2EDE4]"
                  }`}
                >
                  <Activity className="h-4.5 w-4.5" />
                  <span>Dimensional Validation Matrice</span>
                </button>

                <button
                  onClick={() => setActiveTab("ledger")}
                  className={`px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer rounded-lg border flex items-center gap-1.5 ${
                    activeTab === "ledger"
                      ? "bg-[#2D2D24] text-white border-[#2D2D24]"
                      : "bg-[#FAF8F5] text-[#5A5A4A] border-[#E8E4D9] hover:bg-[#F2EDE4]"
                  }`}
                >
                  <BookOpen className="h-4.5 w-4.5" />
                  <span>Variable Inheritance Ledger</span>
                </button>
              </div>

              {/* TAB CONTENT VIEWER */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: THE MUTATED EQUATION SHOWCASE */}
                  {activeTab === "equation" && (
                    <motion.div
                      key="equation-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 text-left"
                    >
                      {/* MUTATED EQUATION BOX */}
                      <div className={`p-8 rounded-3xl border flex flex-col items-center justify-center relative min-h-[140px] text-center ${
                        preset.dimensionalValidation.isCompatible
                          ? "bg-[#FAF8F5] border-[#E8E4D9]"
                          : "bg-rose-500/5 border-rose-300 animate-pulse"
                      }`}>
                        <div className="absolute top-2.5 left-3 text-[9px] font-mono tracking-wider font-bold text-[#8C8474] flex items-center gap-1.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${preset.dimensionalValidation.isCompatible ? "bg-emerald-500" : "bg-rose-500"}`} />
                          COMPILED SYMMETRICAL HEURISTIC EXPORT
                        </div>

                        {/* RENDER LARGER HIGHLIGHTED RAW EQUATION */}
                        <div className={`text-2xl sm:text-3xl font-mono font-black italic tracking-wide select-all px-4 py-2 rounded-2xl ${
                          preset.dimensionalValidation.isCompatible
                            ? "text-[#2D2D24]"
                            : "text-rose-800"
                        }`}>
                          {preset.mutatedEquation.formula}
                        </div>

                        <div className="text-[11px] font-sans text-[#5A5A4A] font-semibold mt-4">
                          ↳ Scope Definition: <strong>{preset.mutatedEquation.symbolMap}</strong>
                        </div>
                      </div>

                      {/* TECHNICAL DIAGNOSTIC LOG (CRIMSON/AMBER IF ILLEGAL SUMMATION) */}
                      {!preset.dimensionalValidation.isCompatible && (
                        <div className="bg-rose-950/10 border-2 border-rose-400 text-rose-950 rounded-2xl p-5 shadow-inner">
                          <div className="flex gap-2.5 items-start">
                            <AlertTriangle className="h-5 w-5 text-rose-700 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-mono text-xs font-black uppercase tracking-wider text-rose-900">
                                COMPILER ISOMORPHIC CRASH DETECTED
                              </h4>
                              <p className="font-mono text-xs leading-relaxed text-rose-950/95 mt-2">
                                <strong>Logic Violation Diagnostic:</strong> {preset.dimensionalValidation.errorReason}
                              </p>
                            </div>
                          </div>

                          {/* Technical console dump detailing violation */}
                          <div className="mt-4 pt-3.5 border-t border-rose-300/40 font-mono text-[11px] text-rose-900/90 space-y-1 bg-black/5 p-3.5 rounded-lg select-text text-left">
                            {preset.dimensionalValidation.diagnosticLog?.map((log, index) => (
                              <div key={index}>{log}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preset.dimensionalValidation.isCompatible && (
                        <div className="bg-emerald-500/5 text-emerald-950 border border-emerald-500/20 rounded-2xl p-4 flex gap-3 text-left">
                          <Lightbulb className="h-4.5 w-4.5 text-emerald-700 flex-shrink-0 mt-0.5 animate-bounce" />
                          <div className="text-xs leading-relaxed">
                            <strong>Stable Physical Union:</strong> The dimensional values match perfectly under linear scaling checks. This mutated formula behaves as an accelerated velocity distribution, opening pathways for modeling leaf drag forces with thermodynamic microclimate dynamics.
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* TAB 2: DIMENSIONAL VALIDATION MATRIX PROOF */}
                  {activeTab === "validation" && (
                    <motion.div
                      key="validation-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="bg-[#FAF8F5] border border-[#E8E4D9] rounded-2xl p-5 text-left">
                        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E4D9] mb-4 flex-wrap gap-2">
                          <div>
                            <h3 className="font-serif font-black text-[#2D2D24] text-sm">
                              Dimensional Consistency Verification Matrix
                            </h3>
                            <p className="text-[10px] font-mono text-[#8C8474]">
                              Mathematical proof tracing boundary values through isomorph units
                            </p>
                          </div>
                          
                          <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                            preset.dimensionalValidation.isCompatible 
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                              : "bg-rose-100 text-rose-800 border-rose-200"
                          }`}>
                            {preset.dimensionalValidation.isCompatible ? "PASS: Symmetrical" : "FAIL: Misfit"}
                          </span>
                        </div>

                        {/* Units table */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-3.5 rounded-xl border border-[#E8E4D9]">
                            <span className="text-[9px] font-mono font-bold text-[#8C8474] uppercase block">
                              Left-Hand Side Target Unit Plane
                            </span>
                            <span className="text-sm font-mono font-black text-[#2D2D24] block mt-1">
                              {preset.dimensionalValidation.leftUnit}
                            </span>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-[#E8E4D9]">
                            <span className="text-[9px] font-mono font-bold text-[#8C8474] uppercase block">
                              Right-Hand Side Combined Unit Plane
                            </span>
                            <span className="text-sm font-mono font-black text-[#2D2D24] block mt-1">
                              {preset.dimensionalValidation.rightUnit}
                            </span>
                          </div>
                        </div>

                        {/* Algebraic sequence proof steps */}
                        <div className="mt-6">
                          <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8C8474] mb-3">
                            RECURSIVE PROOF SEQUENCE:
                          </h4>
                          <div className="flex flex-col gap-2 font-mono text-[11px] text-[#5A5A4A] bg-white border border-[#E8E4D9] p-4 rounded-xl">
                            {preset.dimensionalValidation.proofSteps.map((step, idx) => (
                              <div key={idx} className="flex gap-2 items-start py-1 border-b border-[#FAF8F5] last:border-0">
                                <span className="text-[#7C8464] font-black">[{idx + 1}]</span>
                                <p className="leading-relaxed text-justify">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: VARIABLE INHERITANCE LEDGER */}
                  {activeTab === "ledger" && (
                    <motion.div
                      key="ledger-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="overflow-x-auto"
                    >
                      <table className="w-full text-left font-mono border-collapse border border-[#E8E4D9] bg-white rounded-2xl overflow-hidden shadow-3xs text-xs">
                        <thead>
                          <tr className="bg-[#FAF8F5] border-b border-[#E8E4D9] text-[#2D2D24] select-none">
                            <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Symbol</th>
                            <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Origination Domain Details</th>
                            <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Dimension Space</th>
                            <th className="p-4 font-bold text-[10px] uppercase tracking-wider">Functional Role in Hybrid Heuristic</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preset.variableLedger.map((row) => (
                            <tr key={row.symbol} className="border-b border-[#E8E4D9] hover:bg-[#FAF8F5]/50 transition-colors">
                              <td className="p-4 font-sans font-black text-sm text-[#2D2D24] flex items-center gap-1.5">
                                <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E4D9] select-all">
                                  {row.symbol}
                                </span>
                              </td>
                              <td className="p-4 text-[#2D2D24] font-bold">
                                {row.origin}
                              </td>
                              <td className="p-4 text-emerald-800 font-bold select-all">
                                {row.dimension}
                              </td>
                              <td className="p-4 text-[#5A5A4A] leading-relaxed max-w-sm selection:bg-neutral-100 font-sans">
                                {row.functionalRole}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Compiler Mini Footer */}
      <footer className="py-4 mt-6 border-t border-[#E8E4D9] text-[11px] text-[#8C8474] font-mono">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 flex justify-between items-center">
          <span>Lumina Automated Mutation Labs • © 2026</span>
          <span className="text-emerald-700 hidden sm:inline">● Solver Active</span>
        </div>
      </footer>

    </div>
  );
}
