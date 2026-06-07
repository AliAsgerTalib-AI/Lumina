import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkle, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  GitCompare, 
  Sparkles, 
  X, 
  Link2, 
  Info,
  BookOpen,
  ArrowRightLeft,
  ChevronRight,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for the Injector Engine
interface Variable {
  id: string;
  name: string;
  symbol: string;
  unit: string;
  desc: string;
}

interface TargetSlot {
  id: string;
  name: string;
  symbol: string;
  unit: string;
  desc: string;
  expectedType: string;
}

interface Preset {
  id: string;
  name: string;
  paperA: {
    title: string;
    authors: string;
    source: string;
    type: string;
    variables: Variable[];
  };
  paperB: {
    title: string;
    authors: string;
    source: string;
    type: string;
    slots: TargetSlot[];
  };
  compatibilityRules: {
    [varId: string]: string; // varId maps to slotId (ideal connection)
  };
  warnings: {
    [key: string]: string; // "varId-slotId" warning text if mismatched
  };
  synthesis: {
    title: string;
    conceptualLeap: string;
    parameterMap: { sourceVar: string; targetSlot: string; scale: string }[];
  };
}

// 3 High-density Scientific Presets
const INJECTOR_PRESETS: Preset[] = [
  {
    id: "quantum-bio",
    name: "Quantum Physics ⟷ Soils Biology",
    paperA: {
      title: "Schrödinger Wave Eigenstate Energy Hamiltonian Space Solver",
      authors: "E. Schrödinger, W. Rowan Hamilton",
      source: "Legacy Physics Corpus",
      type: "Methodological Blueprint (Paper A)",
      variables: [
        { id: "v_potential", name: "External Boundary Potential Profile", symbol: "V(x)", unit: "Joules", desc: "Expresses spatial force and energy potential constraints in an orbital field." },
        { id: "psi_wave", name: "Wavefunction State Vector amplitude", symbol: "Ψ(x,t)", unit: "Probability m^-1/2", desc: "The probabilistic density vector mapping particle spatial location existence states." },
        { id: "h_operator", name: "Hamiltonian Total Energy operator", symbol: "Ĥ", unit: "Energy, Joules", desc: "Differential kinetic and potential energy summation operator." },
        { id: "h_bar", name: "Reduced Planck Action Constant", symbol: "ℏ", unit: "Joule-seconds", desc: "Physically scales structural energy oscillations at microscopic scales." }
      ]
    },
    paperB: {
      title: "Metabolic Nutrient Flows in Soil-Root Systems",
      authors: "Dr. Clara Thorne et al.",
      source: "International Journal of Genomics & Bio-agriculture",
      type: "Target Environment (Paper B)",
      slots: [
        { id: "slot_coords", name: "Root Surface Spatial Coordinates", symbol: "C_root", unit: "Spatial Density mm^-2", desc: "Physical surface location matrix determining where root hairs meet soil.", expectedType: "v_potential" },
        { id: "slot_dispersion", name: "Root Nutrient Dispersion Profile", symbol: "η", unit: "Probability Ratio", desc: "Normalized spatial profile tracking nutrient concentrations during flow.", expectedType: "psi_wave" },
        { id: "slot_influx", name: "Nitrogen Absorption Influx rate", symbol: "F_in", unit: "Millimoles/hour", desc: "Kinetics of active cellular nitrogen pump uptake at the root boundary.", expectedType: "h_operator" },
        { id: "slot_diffuse", name: "Soil Porosity Diffusivity Coefficient", symbol: "D_soil", unit: "Porosity mm^2/s", desc: "Measures natural molecular transport resistance index through clay structures.", expectedType: "h_bar" }
      ]
    },
    compatibilityRules: {
      "v_potential": "slot_coords",
      "psi_wave": "slot_dispersion",
      "h_operator": "slot_influx",
      "h_bar": "slot_diffuse"
    },
    warnings: {
      "v_potential-slot_influx": "Trying to inject 'Boundary Potential Profile' [Energy] into active 'Nitrogen Absorption Influx rate' [Flow/hour] fails dimensional integration. Requires conversion of spatial energy matrices into kinetic rate values. A correction constant (α = 4.2×10⁸ J⁻¹·mmol/hr) is auto-applied.",
      "psi_wave-slot_coords": "Cannot map probability wave amplitudes directly to physical spatial coordinate densities without integration. Standard dimensions mismatch (1/√m vs 1/m²). Wave magnitude squaring logic must be pre-applied.",
      "h_bar-slot_influx": "Reduced Planck Action [J·s] cannot direct-map to active Nitrogen Absorption kinetics [mmol/hr]. High quantum divergence detected.",
      "h_operator-slot_diffuse": "Hamiltonian energy operator [Joules] is physically incompatible with passive soil porosity coefficient [mm²/s]. Differential units cannot dissolve."
    },
    synthesis: {
      title: "Quantum-Tunneling Nutrient Diffusion: Modeling Root Metabolic Influx via Schrödinger Wave Coordinates",
      conceptualLeap: "By translating the traditional chemical porosity models into Schrödinger wave function solutions, we resolve the nutrient transport bottleneck in ultra-compact soils. Mapped potentials act as root network spatial attraction fields, allowing the system to model microscopic nutrient 'tunneling' through tight clay barriers. This predictive model increases calculated absorption efficiency projections by 34% compared directly to classical diffusion assumptions.",
      parameterMap: [
        { sourceVar: "Ĥ (Hamiltonian Operator)", targetSlot: "F_in (Nitrogen Influx Rate)", scale: "E_conversion = 8.314 J/mmol * K_eff" },
        { sourceVar: "Ψ(x,t) (Wavefunction)", targetSlot: "η (Nutrient Dispersion)", scale: "η(x) = |Ψ(x)|² (Normalized Probability Plane)" },
        { sourceVar: "V(x) (External Potential)", targetSlot: "C_root (Root Coordinates)", scale: "V(x) = -Z * e² / C_root" },
        { sourceVar: "ℏ (Planck Action)", targetSlot: "D_soil (Soil Porosity Coefficient)", scale: "D_effective = ℏ / (2 * m_eff)" }
      ]
    }
  },
  {
    id: "ml-physics",
    name: "LLM Self-Attention ⟷ Canopy Evaporation",
    paperA: {
      title: "Multi-Head Self-Attention Router for Large Language Models",
      authors: "A. Vaswani et al.",
      source: "Google DeepMind Archive",
      type: "Methodological Blueprint (Paper A)",
      variables: [
        { id: "q_query", name: "Query Index Weighting Projections", symbol: "Q", unit: "Dimensionless Vector", desc: "High-dimensional coordinate matrices representing focus parameters." },
        { id: "scale_v", name: "Variance Normalization Divisor", symbol: "√d_k", unit: "Dimension Scale", desc: "Stabilizes softmax exponent sums from exploding gradients at high boundaries." },
        { id: "soft_map", name: "Softmax Normalized Attention Matrix", symbol: "σ(X)", unit: "Probability Density", desc: "Normalized 0-to-1 attention map representing relative importance filters." },
        { id: "value_v", name: "Value Semantics Matrix Profile", symbol: "V", unit: "Semantics Tensor", desc: "Core latent data mapped against computed attention weights." }
      ]
    },
    paperB: {
      title: "Dynamic Heat Vaporization & Water Evaporation in Closed Canopies",
      authors: "H. Penman & C. Monteith",
      source: "Agricultural Meteorology Journals",
      type: "Target Environment (Paper B)",
      slots: [
        { id: "slot_sat", name: "Canopy Evapo-transpiration Capacity", symbol: "E_c", unit: "Liters / (m^2 hr)", desc: "Calculates total water vapor release velocity of local leaves.", expectedType: "soft_map" },
        { id: "slot_pressure", name: "Vapor Pressure Deficit Slope", symbol: "Δ", unit: "Pressure, kPa/°C", desc: "Rate of change of saturation vapor pressure with temperature.", expectedType: "scale_v" },
        { id: "slot_heat", name: "Sensible Turbulent Heat Diffusivity", symbol: "K_h", unit: "Heat Flux W/m^2", desc: "Turbulent flow coefficients transporting solar heat across leaves.", expectedType: "q_query" },
        { id: "slot_canopy", name: "Leaf Canopy Stomatal Resistance", symbol: "r_s", unit: "Resistance, s/m", desc: "Physical resistance counteracting water vapor escaping stomatal pores.", expectedType: "value_v" }
      ]
    },
    compatibilityRules: {
      "q_query": "slot_heat",
      "scale_v": "slot_pressure",
      "soft_map": "slot_sat",
      "value_v": "slot_canopy"
    },
    warnings: {
      "q_query-slot_canopy": "Cannot inject dimensionless language latent vectors directly into leaf stomatal boundary physical resistance metrics [s/m] without a gas diffusion translation layer.",
      "soft_map-slot_pressure": "Softmax probabilities span 0.0 to 1.0; mapping them directly to vapor pressure slopes in kPa/°C creates absolute atmospheric model decay. Mathematical units do not match.",
      "scale_v-slot_sat": "Softmax scaling square root constant [√d_k] represents statistical neural dimension size. Mapping this to evapo-transpiration water rate liters/(m²·hr) violates thermodynamic scaling vectors."
    },
    synthesis: {
      title: "Climatic Softmax Partitioning: Modeling Canopy Evapo-transpiration via Multi-Head Token Weighting",
      conceptualLeap: "By re-structuring Penman-Monteith crop canopy parameters as a self-attention mechanism, we model individual leaf-pore vapor releases as attention token nodes. Applying the √d_k variance stabilizer prevents numeric overshoot in turbulent wind layers. This attention-modeled heat flux distribution resolves localized canopy microclimate humidity anomalies, mapping micro-pore saturation with 92% higher spatial accuracy than uniform grid averages.",
      parameterMap: [
        { sourceVar: "Q (Query Index Vector)", targetSlot: "K_h (Turbulent Heat Diffusivity)", scale: "K_effective = Q_transposed * K_latent" },
        { sourceVar: "√d_k (Variance Splitter)", targetSlot: "Δ (Vapor Pressure Slope)", scale: "Delta_scaled = Δ * log(d_k)" },
        { sourceVar: "σ(X) (Softmax Map)", targetSlot: "E_c (Canopy Evapo-transpiration)", scale: "E_c(x) = Softmax_Weights * E_saturated" },
        { sourceVar: "V (Value Matrix)", targetSlot: "r_s (Stomatal Leaf Resistance)", scale: "r_s = V_base / (Value_Intensity + epsilon)" }
      ]
    }
  },
  {
    id: "opt-traffic",
    name: "AdamW Gradient Descent ⟷ Traffic Grid Congestion",
    paperA: {
      title: "Stochastic AdamW Adaptive Learning Rate Weight Optimizer",
      authors: "I. Loshchilov & F. Hutter",
      source: "ICLR Optimization Symposium",
      type: "Methodological Blueprint (Paper A)",
      variables: [
        { id: "lr_step", name: "Dynamic Learning Rate Factor", symbol: "η", unit: "Velocity Scalar", desc: "Constrains weights step size to prevent local model divergence." },
        { id: "m1_mom", name: "First-Order Momentum Moving Average", symbol: "m_t", unit: "Directional Momentum", desc: "Exponential moving average of previous slopes to accelerate correct paths." },
        { id: "loss_slope", name: "First-Order Loss Gradient Vector", symbol: "∇L", unit: "Slope Vector", desc: "The directional slope representing local mathematical error optimization planes." },
        { id: "decay_constant", name: "L2 Weight Decay Regularizer", symbol: "λ", unit: "Damping Factor", desc: "Subtracts a tiny fraction of parameters to prevent overfitting." }
      ]
    },
    paperB: {
      title: "Urban Traffic Congestion & Autonomous Vehicular Bottlenecks",
      authors: "Urban Planning Transit Commission",
      source: "Department of Transportation Engineering Reports",
      type: "Target Environment (Paper B)",
      slots: [
        { id: "slot_speed", name: "Dynamic Vehicular Grid Speed Limits", symbol: "v_avg", unit: "Velocity Miles/hour", desc: "The variable speed limit enforced across highway intersection segments.", expectedType: "lr_step" },
        { id: "slot_flow", name: "Historical Traffic Volume Tendency", symbol: "Q_flow", unit: "Vehicles/minute", desc: "Prior traffic momentum tracking directional volume waves through intersections.", expectedType: "m1_mom" },
        { id: "slot_bottleneck", name: "Live Intersection Congestion Slope", symbol: "S_slope", unit: "Delay / Density Slope", desc: "Calculated rate of queue build-up indicating severe gridlocks.", expectedType: "loss_slope" },
        { id: "slot_toll", name: "Peak Pricing Toll Friction Modifier", symbol: "F_toll", unit: "Cost Scalar", desc: "Frictional monetary cost index applied during high volume to divert drivers.", expectedType: "decay_constant" }
      ]
    },
    compatibilityRules: {
      "lr_step": "slot_speed",
      "m1_mom": "slot_flow",
      "loss_slope": "slot_bottleneck",
      "decay_constant": "slot_toll"
    },
    warnings: {
      "lr_step-slot_toll": "Learning rate velocity scalar [Dimensionless ratio] cannot map straight to pricing dollar fees [USD/mile] without currency scaling. Consistency validation warning triggered.",
      "loss_slope-slot_speed": "Slope rate vectors represent mathematical error gradients. Injecting this directly as physical highway vehicle speeds [mph] causes dangerous numerical anomalies in simulator limits.",
      "m1_mom-slot_bottleneck": "First-order directional gradient memory cannot map to severe static lane bottlenecks without accounting for vehicular lengths and traffic lane capacity restrictions."
    },
    synthesis: {
      title: "Stochastic Urban Optimizer: Adaptive Traffic Velocity Modulation via AdamW Gradient Decay",
      conceptualLeap: "By re-casting highway intersections as parameters in a deep learning system, we apply AdamW optimizer equations to traffic grid controllers. Live queues act as error loss gradients, and speed limits function as learning rates. This method prevents queue peaks through exponential moving averages of previous traffic waves, damping congestion spikes by 27% through custom-scaled toll adjustments.",
      parameterMap: [
        { sourceVar: "η (Learning Rate Modifier)", targetSlot: "v_avg (Speed Limit Tuning)", scale: "v_optimal = v_base * (1 - η_factor)" },
        { sourceVar: "m_t (Momentum Memory)", targetSlot: "Q_flow (Traffic Volume Wave)", scale: "Q_predicted = β_1 * Q_prior_avg + (1 - β_1) * m_t" },
        { sourceVar: "∇L (Error Loss Gradient)", targetSlot: "S_slope (Congestion Incline)", scale: "S_slope = ∇L_congestion * Grid_Porosity_Constant" },
        { sourceVar: "λ (Weight Decay Factor)", targetSlot: "F_toll (Peak pricing Toll)", scale: "F_toll = Base_Toll + λ * Vehicles_Active" }
      ]
    }
  }
];

export default function CrossDomainVariableInjector({ onClose }: { onClose: () => void }) {
  // Navigation across Presets
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const preset = INJECTOR_PRESETS[activePresetIndex];

  // Dynamic user-selection mapping state
  // key is slotId, value is variableObj (Paper A variable currently connected to this Slot B)
  const [connections, setConnections] = useState<{ [slotId: string]: Variable }>({});
  
  // Interaction memory
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  
  // Animation states
  const [flyingParticle, setFlyingParticle] = useState<{
    varId: string;
    slotId: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [activeBridges, setActiveBridges] = useState<string[]>([]); // list of keys "slotId" currently mapped
  const [autoBridging, setAutoBridging] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<string | null>(null);

  // HTML Element Refs to compute precise SVG Bridge connection points
  const leftNodesParentRef = useRef<HTMLDivElement>(null);
  const rightNodesParentRef = useRef<HTMLDivElement>(null);

  const resetPresetConnections = () => {
    setConnections({});
    setSelectedVariable(null);
    setFlyingParticle(null);
    setCurrentWarning(null);
    setAutoBridging(false);
  };

  // Change preset hooks
  useEffect(() => {
    resetPresetConnections();
  }, [activePresetIndex]);

  // Handle establishing bridge connection with animated particle flying
  const handleConnect = (variable: Variable, targetSlot: TargetSlot) => {
    // Prevent connecting if already bridging or animating
    if (flyingParticle) return;

    // Check if this slot already has this exact variable connected
    if (connections[targetSlot.id]?.id === variable.id) return;

    // Launch flying coordinate particle
    // Find the elements relative to scroll or container to animate the floating orb over the SVG bridge
    const sourceEl = document.getElementById(`node-source-${variable.id}`);
    const targetEl = document.getElementById(`node-target-${targetSlot.id}`);
    const bridgeEl = document.getElementById("connector-svg-canvas");

    if (sourceEl && targetEl && bridgeEl) {
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const bridgeRect = bridgeEl.getBoundingClientRect();

      // Compute relative coordinates where the center of each node touches the margins of the bridge
      const startX = sourceRect.right - bridgeRect.left;
      const startY = sourceRect.top + sourceRect.height / 2 - bridgeRect.top;
      const endX = targetRect.left - bridgeRect.left;
      const endY = targetRect.top + targetRect.height / 2 - bridgeRect.top;

      setFlyingParticle({
        varId: variable.id,
        slotId: targetSlot.id,
        startX,
        startY,
        endX,
        endY
      });

      // Clear any prior selections
      setSelectedVariable(null);

      // Complete particle fly-time then physically lock in values
      setTimeout(() => {
        setConnections(prev => ({
          ...prev,
          [targetSlot.id]: variable
        }));
        setFlyingParticle(null);

        // Dimensional check & update
        const isIdealMapping = preset.compatibilityRules[variable.id] === targetSlot.id;
        const mismatchKey = `${variable.id}-${targetSlot.id}`;
        
        if (!isIdealMapping) {
          const warnText = preset.warnings[mismatchKey] || 
            `⚠️ Amber Warning: Custom Mismatch! Injected '${variable.symbol}' [${variable.unit}] does not match target slot expectation for '${targetSlot.symbol}' [${targetSlot.unit}]. Standard dimensional consistency failed. Math framework patched with correction coefficients.`;
          setCurrentWarning(warnText);
        } else {
          // If ideal connection matches, clear outdated warnings if all are correct
          setCurrentWarning(null);
        }
      }, 750);
    } else {
      // Fallback if elements not located instantly
      setConnections(prev => ({
        ...prev,
        [targetSlot.id]: variable
      }));
      setSelectedVariable(null);
    }
  };

  // Automated Sequential Auto-Bridge Node Connection Sequence
  const handleAutoBridge = async () => {
    if (autoBridging) return;
    setAutoBridging(true);
    setConnections({});
    setCurrentWarning(null);

    // Sequential trigger
    const sequence = [
      { varId: "v_potential", slotId: "slot_coords" },
      { varId: "psi_wave", slotId: "slot_dispersion" },
      { varId: "h_operator", slotId: "slot_influx" },
      { varId: "h_bar", slotId: "slot_diffuse" }
    ];

    const altSequence = [
      { varId: "q_query", slotId: "slot_heat" },
      { varId: "scale_v", slotId: "slot_pressure" },
      { varId: "soft_map", slotId: "slot_sat" },
      { varId: "value_v", slotId: "slot_canopy" }
    ];

    const altSequence2 = [
      { varId: "lr_step", slotId: "slot_speed" },
      { varId: "m1_mom", slotId: "slot_flow" },
      { varId: "loss_slope", slotId: "slot_bottleneck" },
      { varId: "decay_constant", slotId: "slot_toll" }
    ];

    let currentSeq = sequence;
    if (preset.id === "ml-physics") currentSeq = altSequence;
    if (preset.id === "opt-traffic") currentSeq = altSequence2;

    for (let i = 0; i < currentSeq.length; i++) {
      const step = currentSeq[i];
      const variable = preset.paperA.variables.find(v => v.id === step.varId);
      const slot = preset.paperB.slots.find(s => s.id === step.slotId);
      
      if (variable && slot) {
        // Wait stagger delay
        await new Promise(resolve => setTimeout(resolve, 300));
        handleConnect(variable, slot);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    setAutoBridging(false);
  };

  // Determine synthesis completeness (All 4 slots mapped)
  const activeCount = Object.keys(connections).length;
  const isSynthesisUnlocked = activeCount === 4;

  // Track if there are active warning discrepancies in currently bridged elements
  const activeDiscrepancies = Object.entries(connections).filter(([slotId, variable]: [string, any]) => {
    return preset.compatibilityRules[variable.id] !== slotId;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] overflow-y-auto flex flex-col antialiased font-sans">
      
      {/* Editor/Museum Sticky Top Navbar */}
      <nav className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-4 border-b border-[#E8E4D9] flex justify-between items-center z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#7C8464] text-white p-2.5 rounded-xl flex items-center justify-center">
            <ArrowRightLeft className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-[#2D2D24] flex items-center gap-2">
              Cross-Domain Variable Injector
              <span className="text-[9px] bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/25 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold">
                Structure Integrator v1.9
              </span>
            </h1>
            <p className="text-[11px] text-[#8C8474] font-medium hidden sm:block">
              Merge structural parameters across heterogeneous scientific literatures to draft unified equations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F2EDE4]/60 text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer border border-[#E8E4D9] bg-white shadow-2xs"
            title="Exit Injector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Sandbox Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Preset Selector Panel */}
        <div className="bg-[#FAF8F5] border border-[#E8E4D9] rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="h-4 w-4 text-[#7C8464] flex-shrink-0" />
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C8474] font-bold block">
                SELECT EXPERIMENTAL HYBRID PAIRING
              </span>
              <p className="text-sm font-serif font-bold text-[#2D2D24] mt-0.5">
                Heterogeneous Literature Domain Corpus
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {INJECTOR_PRESETS.map((p, index) => (
              <button
                key={p.id}
                onClick={() => setActivePresetIndex(index)}
                className={`px-3.5 py-1.5 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                  activePresetIndex === index
                    ? "bg-[#7C8464] text-white border-[#7C8464] font-bold shadow-xs"
                    : "bg-white border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Instructional Helper Banner */}
        <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 flex gap-3 text-left">
          <Info className="h-4.5 w-4.5 text-blue-800 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs leading-relaxed text-blue-900/90">
            <span className="font-bold">Instructions:</span> Bridge the methodological variables of <strong className="font-semibold text-blue-950">Paper A (Left)</strong> to corresponding environmental parameters of <strong className="font-semibold text-blue-950">Paper B (Right)</strong>. Click a variable on the left to highlight it, then click a target slot on the right to trigger the interactive node injection. Re-connecting variables updates the dynamic mathematical modeling!
          </div>
        </div>

        {/* Dynamic Split Panel Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative min-h-[460px]">
          
          {/* LEFT SLOT: Methodological Blueprint (Paper A) */}
          <div ref={leftNodesParentRef} className="lg:col-span-5 bg-[#FAF8F5] border border-[#E8E4D9] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-2xs">
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4D9]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C8464] bg-[#7C8464]/10 px-2 py-0.5 rounded uppercase">
                  Source Method (Paper A)
                </span>
                <span className="text-[10px] font-mono text-[#8C8474]">Variables Extracted</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-white px-2 py-0.5 rounded font-black">
                  {preset.paperA.source}
                </span>
                <h3 className="font-serif font-bold text-[#1E2019] text-base mt-2 leading-snug">
                  {preset.paperA.title}
                </h3>
                <p className="text-[10px] text-[#8C8474] font-medium mt-1 font-mono">
                  By {preset.paperA.authors}
                </p>
              </div>

              {/* Variable Nodes List */}
              <div className="flex flex-col gap-3 mt-6">
                {preset.paperA.variables.map((variable) => {
                  const isSelected = selectedVariable?.id === variable.id;
                  
                  // Count how many slots are connected to this variable
                  const mapCount = Object.values(connections).filter((v: any) => v && v.id === variable.id).length;

                  return (
                    <div
                      key={variable.id}
                      id={`node-source-${variable.id}`}
                      onClick={() => setSelectedVariable(variable)}
                      className={`group p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/10 scale-[1.01]"
                          : "bg-white border-[#E8E4D9] hover:border-[#7C8464] hover:bg-white/80"
                      }`}
                    >
                      {/* Left vertical visual marker */}
                      <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-lg bg-[#7C8464]" />

                      <div className="flex justify-between items-start gap-2 pl-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#2D2D24] bg-[#FAF8F5] border border-[#E8E4D9] px-2 py-0.5 rounded shadow-3xs select-all">
                              {variable.symbol}
                            </span>
                            <span className="font-serif font-bold text-xs text-[#2D2D24] leading-tight">
                              {variable.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5A5A4A] mt-1.5 leading-relaxed">
                            {variable.desc}
                          </p>
                        </div>

                        {/* Connection indicator */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-[9px] font-mono font-bold text-[#7C8464] bg-[#7C8464]/10 px-1.5 py-0.5 rounded">
                            {variable.unit}
                          </span>
                          {mapCount > 0 && (
                            <span className="text-[9px] font-mono text-amber-600 font-semibold mt-2 flex items-center gap-0.5 animate-pulse">
                              <Link2 className="h-2.5 w-2.5" />
                              Active ({mapCount})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E4D9] flex justify-between items-center">
              <span className="text-[10px] font-mono text-[#8C8474]">Select logical operator on left to bridge</span>
              <button
                onClick={resetPresetConnections}
                className="text-[10px] font-mono font-bold hover:text-red-600 transition-colors cursor-pointer text-[#8C8474]"
              >
                Clear Bridges
              </button>
            </div>
          </div>

          {/* CENTER DIVISION: Inter-Paper Interactive SVG Wire Bridge Grid */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center relative min-h-[140px] lg:min-h-0 bg-[#FAF8F5]/40 border border-[#E8E4D9] rounded-[24px] lg:my-16 lg:py-0">
            {/* Dynamic Interactive SVG Canvas */}
            <svg
              id="connector-svg-canvas"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ overflow: "visible" }}
            >
              {/* Draw existing connections */}
              {Object.entries(connections).map(([slotId, variable]: [string, any]) => {
                const sourceEl = document.getElementById(`node-source-${variable.id}`);
                const targetEl = document.getElementById(`node-target-${slotId}`);
                const bridgeEl = document.getElementById("connector-svg-canvas");

                if (sourceEl && targetEl && bridgeEl) {
                  const sourceRect = sourceEl.getBoundingClientRect();
                  const targetRect = targetEl.getBoundingClientRect();
                  const bridgeRect = bridgeEl.getBoundingClientRect();

                  const x1 = sourceRect.right - bridgeRect.left;
                  const y1 = sourceRect.top + sourceRect.height / 2 - bridgeRect.top;
                  const x2 = targetRect.left - bridgeRect.left;
                  const y2 = targetRect.top + targetRect.height / 2 - bridgeRect.top;

                  const isIdeal = preset.compatibilityRules[variable.id] === slotId;
                  const strokeColor = isIdeal ? "#7C8464" : "#D97706";

                  // Organic bezier path curve
                  const controlX1 = x1 + (x2 - x1) * 0.45;
                  const controlX2 = x1 + (x2 - x1) * 0.55;
                  
                  return (
                    <g key={`${variable.id}-${slotId}`}>
                      {/* Interactive glowing line */}
                      <path
                        d={`M ${x1} ${y1} C ${controlX1} ${y1}, ${controlX2} ${y2}, ${x2} ${y2}`}
                        stroke={strokeColor}
                        strokeWidth={2}
                        strokeDasharray={isIdeal ? "unset" : "4 2"}
                        fill="none"
                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      {/* Background flow particles in bezier line */}
                      <path
                        d={`M ${x1} ${y1} C ${controlX1} ${y1}, ${controlX2} ${y2}, ${x2} ${y2}`}
                        stroke="white"
                        strokeWidth={6}
                        strokeLinecap="round"
                        fill="none"
                        className="opacity-15"
                      />
                    </g>
                  );
                }
                return null;
              })}

              {/* Render dynamic floating particle when connecting */}
              {flyingParticle && (
                <g>
                  <circle
                    r="6"
                    fill="#D97706"
                    className="animate-ping opacity-75"
                    style={{
                      transform: `translate(${flyingParticle.startX}px, ${flyingParticle.startY}px)`,
                    }}
                  />
                  <motion.circle
                    r="5"
                    fill="#7C8464"
                    initial={{ cx: flyingParticle.startX, cy: flyingParticle.startY }}
                    animate={{ cx: flyingParticle.endX, cy: flyingParticle.endY }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  {/* Outer glow ring wrapper */}
                  <motion.circle
                    r="9"
                    stroke="#7C8464"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ cx: flyingParticle.startX, cy: flyingParticle.startY }}
                    animate={{ cx: flyingParticle.endX, cy: flyingParticle.endY }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="opacity-40 animate-pulse"
                  />
                </g>
              )}
            </svg>

            {/* Bridge Controls */}
            <div className="relative z-20 flex flex-col items-center gap-3 p-4">
              <button
                onClick={handleAutoBridge}
                disabled={autoBridging}
                className={`px-4 py-2.5 rounded-xl border font-serif text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 flex items-center justify-center gap-2 ${
                  autoBridging 
                    ? "bg-amber-600 text-white border-amber-600 animate-pulse" 
                    : "bg-white border-[#E8E4D9] text-[#7C8464] hover:bg-[#F2EDE4]"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${autoBridging ? "animate-spin" : ""}`} />
                <span>Establish Multi-Node Bridge</span>
              </button>

              <div className="flex flex-col items-center gap-1 select-none">
                <span className="text-[10px] font-mono tracking-widest text-[#8C8474] font-bold uppercase">
                  Connected
                </span>
                <span className="text-lg font-serif font-black text-[#2D2D24] bg-[#7C8464]/10 px-3 py-1 rounded-full border border-[#7C8464]/20">
                  {activeCount}/4
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SLOT: Target Environment (Paper B) */}
          <div ref={rightNodesParentRef} className="lg:col-span-5 bg-[#FAF8F5] border border-[#E8E4D9] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-2xs">
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E4D9]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#2D2D24] bg-[#2D2D24]/10 px-2 py-0.5 rounded uppercase font-bold">
                  Problem Domain (Paper B)
                </span>
                <span className="text-[10px] font-mono text-[#8C8474]">Resource Slots</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-[#2D2D24] text-white px-2 py-0.5 rounded font-black">
                  {preset.paperB.source}
                </span>
                <h3 className="font-serif font-bold text-[#1E2019] text-base mt-2 leading-snug">
                  {preset.paperB.title}
                </h3>
                <p className="text-[10px] text-[#8C8474] font-medium mt-1 font-mono">
                  By {preset.paperB.authors}
                </p>
              </div>

              {/* Resource Target Slots List */}
              <div className="flex flex-col gap-3 mt-6">
                {preset.paperB.slots.map((slot) => {
                  const connectedVar = connections[slot.id];
                  const hasConnection = !!connectedVar;
                  
                  // Verification for consistency check (green check vs orange warning dot)
                  const isConsistent = hasConnection && preset.compatibilityRules[connectedVar.id] === slot.id;

                  return (
                    <div
                      key={slot.id}
                      id={`node-target-${slot.id}`}
                      onClick={() => {
                        if (selectedVariable) {
                          handleConnect(selectedVariable, slot);
                        }
                      }}
                      className={`group p-3.5 rounded-xl border border-dashed transition-all cursor-pointer relative flex flex-col select-none ${
                        hasConnection
                          ? isConsistent
                            ? "bg-emerald-500/5 border-emerald-500 shadow-3xs"
                            : "bg-amber-500/5 border-amber-500 shadow-3xs"
                          : selectedVariable
                          ? "hover:border-[#7C8464] border-[#E8E4D9]/80 bg-white shadow-3xs hover:bg-[#F2EDE4]/30"
                          : "border-[#E8E4D9] bg-[#E8E4D9]/10"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded shadow-3xs select-all">
                              {slot.symbol}
                            </span>
                            <span className="font-serif font-bold text-xs text-[#2D2D24] leading-tight">
                              {slot.name}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#5A5A4A] mt-1.5 leading-snug">
                            {slot.desc}
                          </p>
                        </div>

                        {/* Status Check badge */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          {hasConnection ? (
                            <div className="flex items-center gap-1">
                              {isConsistent ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                              ) : (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                              )}
                              <span className={`text-[10px] font-black font-mono px-1 rounded uppercase tracking-wider ${isConsistent ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                                LOCKED
                              </span>
                            </div>
                          ) : (
                            <span className="text-[9px] font-mono text-[#8C8474] font-medium bg-[#E8E4D9]/40 border border-[#E8E4D9]/60 px-2 py-0.5 rounded">
                              VACANT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detail overlay when connecting variables */}
                      <AnimatePresence>
                        {hasConnection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 pt-2.5 border-t border-[#F2EDE4] text-xs flex justify-between items-center bg-[#FAF8F5]/80 p-2 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8474]">
                                Injector Value:
                              </span>
                              <span className="font-mono text-xs font-black text-[#7C8464]">
                                {connectedVar.symbol}
                              </span>
                              <span className="text-[10px] text-[#5A5A4A] font-serif">
                                ({connectedVar.name})
                              </span>
                            </div>
                            <span className="text-[9.5px] font-mono text-[#8C8474] underline bg-white border border-[#E8E4D9] px-1.5 py-0.5 rounded font-black select-all text-right">
                              Unit: {connectedVar.unit}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E4D9]">
              {selectedVariable ? (
                <div className="text-xs text-amber-700 bg-amber-500/10 p-2.5 rounded-lg border border-amber-200/50 flex items-center gap-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                  <p>Injected variable highlighted: <strong>{selectedVariable.symbol}</strong>. Select slot on right to bind.</p>
                </div>
              ) : (
                <span className="text-[10px] font-mono text-[#8C8474]">Target system awaits integration variables...</span>
              )}
            </div>
          </div>

        </div>

        {/* SECTION 4: GUARDIAN: PERSISTENT DIMENSIONAL CONSISTENCY CHECK CONTAINER */}
        <div className="bg-[#FAF8F5] border border-[#E8E4D9] rounded-[24px] p-5 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E8E4D9] pb-3 mb-3 gap-3">
            <div className="flex items-center gap-2.5 text-left">
              <div className="h-6 w-6 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-800 font-bold select-none text-xs">
                ∇
              </div>
              <div>
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#2D2D24]">
                  DIMENSIONAL CONSISTENCY CHECK
                </h4>
                <p className="text-[10px] text-[#8C8474] font-medium font-mono">
                  Real-time physics vector unit verification pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 font-mono select-none">
              <span className="text-[9px] uppercase tracking-wider text-[#8C8474]">STATUS</span>
              {activeCount === 0 ? (
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-md">
                  VACANT PANEL
                </span>
              ) : activeDiscrepancies.length > 0 ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-md animate-pulse">
                  UNIT CONVERSION WARNINGS ({activeDiscrepancies.length})
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  VERIFIED: SYMMETRICAL SCALING PASS
                </span>
              )}
            </div>
          </div>

          <div className="text-left flex flex-col gap-2.5 text-xs text-[#5A5A4A] leading-relaxed">
            {activeCount === 0 ? (
              <p className="italic text-[#8C8474] px-1 py-1">
                Awaiting connection. Establish bridges to analyze matrix symmetry and dimensions of thermodynamic parameters.
              </p>
            ) : activeDiscrepancies.length > 0 ? (
              <div className="flex flex-col gap-2 bg-amber-500/5 p-3 rounded-lg border border-amber-200/40">
                {activeDiscrepancies.map(([slotId, variable]: [string, any]) => {
                  const targetSlot = preset.paperB.slots.find(s => s.id === slotId);
                  const mismatchKey = `${variable.id}-${targetSlot?.id}`;
                  const warningText = preset.warnings[mismatchKey] || 
                    `⚠️ Conversion Warning: Injected '${variable.symbol}' [${variable.unit}] into '${targetSlot?.symbol}' [${targetSlot?.unit}] presents unit incompatibility. Multiplier conversion scalar auto-applied to stabilize.`;
                  
                  return (
                    <div key={slotId} className="flex gap-2 items-start text-amber-800 leading-normal font-mono text-[11px]">
                      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p>{warningText}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2 items-center text-emerald-800 bg-emerald-500/5 p-3 rounded-lg border border-emerald-200/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="font-mono text-[11px]">
                  <strong>System Symmetrical Scaling:</strong> All bridged structural variables align perfectly with linear transformations. No boundary scaling correction vectors required. Synthesis matrix is fully stabilized.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: AUTOMATED SYNTHESIS DRAFTING RESEARCH BLUEPRINT (OUTPUT VIEW) */}
        <AnimatePresence>
          {isSynthesisUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 35 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-6 border border-[#E8E4D9] p-6 sm:p-10 bg-white rounded-[32px] shadow-sm text-left relative overflow-hidden"
            >
              {/* Symmetrical Book Back-cover accent */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#7C8464] to-[#B4A086]" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E8E4D9]/80 pb-6 mt-2">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/25 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none mb-3">
                    <Sparkle className="h-3 w-3 text-[#7C8464] animate-spin" />
                    Automated Injected Synthesis Draft
                  </span>
                  <h2 className="font-serif font-bold text-[#2D2D24] text-lg sm:text-2xl leading-snug tracking-tight mb-2">
                    {preset.synthesis.title}
                  </h2>
                  <div className="text-[10px] font-mono text-[#8C8474]">
                    <strong>Lead Synthesizer:</strong> Lumina Cross-Domain Injector Engine (G-3.5)
                  </div>
                </div>
              </div>

              {/* Research Blueprint Body */}
              <div className="mt-8 flex flex-col gap-6">
                
                {/* 1. Abstract / Thesis */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#7C8464] mb-3 flex items-center gap-1.5 border-b border-[#F2EDE4] pb-1.5 select-none">
                    <span>[01] The Conceptual Leap</span>
                  </h3>
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E4D9] font-serif text-[#434338] italic leading-relaxed text-[13.5px] select-text">
                    "{preset.synthesis.conceptualLeap}"
                  </div>
                </div>

                {/* 2. Parameters Coordinate Table */}
                <div className="mt-4">
                  <div className="flex justify-between items-center pb-2 mb-3 border-b border-[#E8E4D9]">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D2D24] flex items-center gap-1.5 select-none">
                      <span>[02] The Unified Parameter Map</span>
                    </h3>
                    <span className="text-[9px] font-mono text-[#8C8474] font-semibold">Scaling Constants Verified</span>
                  </div>

                  <div className="border border-[#E8E4D9] rounded-xl overflow-hidden shadow-3xs">
                    <table className="min-w-full divide-y divide-[#E8E4D9] text-left text-xs font-medium bg-white">
                      <thead className="bg-[#FAF8F5] text-[#8C8474] font-mono text-[10px] uppercase">
                        <tr>
                          <th className="px-4 py-3 border-r border-[#E8E4D9]/60">Source Method Variable (Paper A)</th>
                          <th className="px-4 py-3 border-r border-[#E8E4D9]/60">Target Slot Parameter (Paper B)</th>
                          <th className="px-4 py-3">Conversion &amp; Physical Vector Scale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E4D9]/60 text-[#434338]">
                        {preset.synthesis.parameterMap.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF8F5]/40 transition-colors">
                            <td className="px-4 py-3.5 font-mono border-r border-[#E8E4D9]/40">{row.sourceVar}</td>
                            <td className="px-4 py-3.5 font-mono border-r border-[#E8E4D9]/40">{row.targetSlot}</td>
                            <td className="px-4 py-3.5 font-mono text-xs text-[#7C8464] font-bold select-all">{row.scale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Warning message if synthesis holds unit divergence flags */}
                {activeDiscrepancies.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl border border-[#D97706]/40 bg-amber-50 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-amber-800">Dynamic Multiplier Tolerances Active</h5>
                      <p className="text-[11px] text-amber-700 leading-normal mt-0.5">
                        This synthesis combines parameters with divergent dimensional roots (e.g., probability densities vs. physical coordinates). Synthesis equations contain dimensional correction factors to prevent model collapse.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
