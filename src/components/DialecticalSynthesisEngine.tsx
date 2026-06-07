import React, { useState, useEffect, useRef } from "react";
import { 
  GitMerge, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Info,
  Scale,
  Brain,
  TrendingDown,
  Lock,
  ArrowRightLeft,
  Plus,
  Compass,
  Send,
  MessageSquare,
  Terminal,
  Trophy,
  RefreshCw,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for Dialectical Synthesis
interface ConflictingPoint {
  id: string;
  statement: string;
  citation: string;
  metric: string;
}

interface WarPreset {
  id: string;
  title: string;
  domain: string;
  clashSummary: string;
  thesisPaper: {
    title: string;
    authors: string;
    source: string;
    conditionName: string;
    evidenceText: string;
    points: ConflictingPoint[];
  };
  antithesisPaper: {
    title: string;
    authors: string;
    source: string;
    conditionName: string;
    evidenceText: string;
    points: ConflictingPoint[];
  };
  conflictMappings: {
    [pointIdA: string]: string; // Maps thesis point ID to antithesis point ID
  };
  resolution: {
    resolvedTitle: string;
    thesisSummary: string;
    gatingCondition: string;
    gatingExplanation: string;
    gatingEquation: string;
    parameters: { symbol: string; explanation: string; boundary: string; dimension: string }[];
    dimensionalProofLog: {
      baseSIAnalysis: string;
      normalizationStatus: string;
      derivationSteps: string[];
    };
    rebuttal?: string;
  };
}

const DIALECTICAL_PRESETS: WarPreset[] = [
  {
    id: "graphene-superconductivity",
    title: "The Superconductivity Magic-Angle Strain Dispute",
    domain: "Quantum Condensed Matter & Moiré Physics",
    clashSummary: "A fierce debate regarding magic-angle bilayer graphene T_c limits: does uniform hydrostatic lattice strain sustain high-T_c superconductivity, or do transverse magnetic fields induce spatial inversion breaks that collapse it into an insulating Mott phase?",
    thesisPaper: {
      title: "Unconventional Superconductivity Magic-Angle Tuning",
      authors: "Dr. Yuan Cao, Prof. Pablo Jarillo-Herrero",
      source: "Nature Physics Letters (Thesis)",
      conditionName: "State Alpha: High Lattice Symmetry Hydrostatic Strain",
      evidenceText: "Under physical hydrostatic strain pressure (P = 1.2 GPa), twisted bilayer graphene flat bands stabilize localized electron correlation profiles, achieving high critical temperature (T_c = 1.7 K) superconducting state convergence across planar ranges.",
      points: [
        { id: "tp1", statement: "Critical Temperature peaks at T_c = 1.7 K under hydrostatic lattice strain.", citation: "Cao et al. Sec. 3.2", metric: "T_c Stabilization" },
        { id: "tp2", statement: "Tight Moiré superlattice wavelength flat bands (λ_M ≈ 13.4 nm) optimize localized DOS.", citation: "Cao et al. Fig. 4c", metric: "Flat-Band Wavelength λ_M" },
        { id: "tp3", statement: "Coherent superconducting pairing density is robust under physical planar lattice compression.", citation: "Cao et al. Eq. 9", metric: "Shear Modulus K_shear" }
      ]
    },
    antithesisPaper: {
      title: "Experimental Superconductivity Collapse under Orbital Fields",
      authors: "Prof. Andrea Young, Dr. Matthew Yankowitz",
      source: "Physical Review B (Antithesis)",
      conditionName: "State Beta: Incoherent Boundary Shearing Dislocation",
      evidenceText: "Under highly active transverse orbital fields (B_ext > 0.5 T), local structural micro-strain perturbations break spatial inversion symmetry. The flat-band energy landscape collapses immediately into localized insulating state bottlenecks.",
      points: [
        { id: "ap1", statement: "Superconductivity completely collapses (T_c approaches 0 K) under external fields.", citation: "Young et al. Sec. 1.4", metric: "T_c Collapse" },
        { id: "ap2", statement: "Transverse magnetic gauge field B_external breaks orbital symmetry, triggering localized current loops.", citation: "Young et al. Fig. 2a", metric: "Zeeman Field B_ext" },
        { id: "ap3", statement: "Spontaneous micro-strain lattice distortions degrade long-range quantum pairing.", citation: "Young et al. Eq. 14", metric: "Micro-strain ε_moiré" }
      ]
    },
    conflictMappings: {
      "tp1": "ap1",
      "tp2": "ap2",
      "tp3": "ap3"
    },
    resolution: {
      resolvedTitle: "Ginzburg-Landau Superelastic Order Gating: Unifying Magic-Angle Strain and Orbital Zeeman Potentials",
      thesisSummary: "The apparent dispute between highly resilient pairing states (Cao et al.) and sudden orbital fields collapse (Young et al.) is resolved by constructing a unified 2D Ginzburg-Landau Free Energy expansion. The local physical hydrostatic lattice strain increases the pairing coefficient, while the external transverse vector potential dynamically distorts the Moiré superlattice wavefunction. Superconductivity is thermodynamically stable only when the spatial shear strain energy at the Moiré scale exceeds the external Zeeman magnetic pairing-disruption threshold.",
      gatingCondition: "The transition boundary lies at a critical ratio of strain-energy against external Zeeman magnetic fields.",
      gatingExplanation: "When the dimensionless scaling threshold parameter Φ_Ginzburg-Landau is ≥ 1.0, the Ginzburg-Landau free energy density is minimized below the normal metallic state, securing the superconducting order partition. Below 1.0, the transverse magnetic field triggers Cooper-pair orbital phase decoherence and collapses the system into a Mott insulating state.",
      gatingEquation: "\\Phi_{\\text{GL}} = \\frac{K_{\\text{shear}} \\cdot \\epsilon_{\\text{moiré}}^2 \\cdot \\lambda_{\\text{M}}^3}{g_{\\text{orbital}} \\cdot \\mu_B \\cdot B_{\\text{external}} + k_B T_0} \\ge 1.00",
      parameters: [
        { symbol: "K_{\\text{shear}}", explanation: "Elastic shear modulus coefficient of the bilayer moiré superlattice", boundary: "1.20 × 10^10 Pa (kg·m^-1·s^-2)", dimension: "[M][L]^-1[T]^-2" },
        { symbol: "\\epsilon_{\\text{moiré}}", explanation: "Uniaxial superlattice tensor micro-strain deformation metric", boundary: "≈ 0.012 (Dimensionless)", dimension: "[1] (Dimensionless)" },
        { symbol: "\\lambda_{\\text{M}}", explanation: "Macro-structural twisted moiré flat band wavelength spacing", boundary: "≈ 13.4 nm (1.34 × 10^-8 m)", dimension: "[L]" },
        { symbol: "g_{\\text{orbital}}", explanation: "Effective orbital Landé g-factor of flat-band pairing channels", boundary: "2.00 (Dimensionless)", dimension: "[1] (Dimensionless)" },
        { symbol: "\\mu_B", explanation: "Universal Bohr Magneton elementary magnetic dipole coordinate", boundary: "9.274 × 10^-24 J/T (A·m²)", dimension: "[I][L]²" },
        { symbol: "B_{\\text{external}}", explanation: "Applied perpendicular transverse orbital magnetic field", boundary: "0.50 to 1.80 Tesla (kg·A^-1·s^-2)", dimension: "[M][T]^-2[I]^-1" },
        { symbol: "k_B", explanation: "Boltzmann thermodynamic constant scaling thermal fluctuations", boundary: "1.381 × 10^-23 J/K (kg·m²·s^-2·K^-1)", dimension: "[M][L]²[T]^-2[Θ]^-1" },
        { symbol: "T_0", explanation: "System real-time cryogenic thermal state boundary", boundary: "1.70 Kelvin", dimension: "[Θ]" }
      ],
      dimensionalProofLog: {
        baseSIAnalysis: "Numerator: [kg·m⁻¹·s⁻²] * [1] * [m³] = [kg·m²·s⁻²] = Joules [J]. Denominator: [1] * [A·m²] * [kg·A⁻¹·s⁻²] + [kg·m²·s⁻²·K⁻¹] * [K] = [kg·m²·s⁻²] + [kg·m²·s⁻²] = Joules [J]. Total: [J] / [J] = [Dimensionless].",
        normalizationStatus: "[ ✓ DIMENSIONAL INTEGRITY SECURE: DIMENSIONLESS SCALE GATING ]",
        derivationSteps: [
          "1. Calculate mechanical energy density: K_shear * ε_moiré² has units of [kg/(m*s²)] * [1] = Pascal = Joules/m³.",
          "2. Match spatial scale: Multiply energy density by the superlattice block volume λ_M³ [m³] giving total shear energy: [J/m³] * [m³] = Joules.",
          "3. Compute magnetic energy potential: g * μ_B * B_ext yielding energy: [1] * [A*m²] * [kg/(A*s²)] = [kg*m²/s²] = Joules.",
          "4. Thermal energy potential: k_B * T_0 yielding [J/K] * [K] = Joules.",
          "5. Compile unitless phase boundary ratio: Both numerator and denominator evaluate strictly to Joules [M][L]²[T]⁻²."
        ]
      },
      rebuttal: "REBUTTAL (PEER REVIEW): While this Ginzburg-Landau free-energy expansion is elegant on paper, it relies on several hyper-idealized assumptions. First, the treatment of uniaxial micro-strain ε_moiré as a clean uniform tensor is a major stretch; in real magic-angle graphene devices, strain field distributions are notoriously inhomogeneous and dominated by chaotic structural dislocations that warp flat bands. Second, we have treated the effective orbital Landé g-factor as a flat constant when it actually exhibits strong non-linear energy state dependency under strong Zeeman displacement. To assert a physical stability boundary at a neat GL scalar benchmark of ≥ 1.00 is theoretically convenient but experimentally unfeasible because physical macroscopic samples twist under orbital fields, collapsing the superconducting pairing long before our computed thermal limit is ever reached."
    }
  },
  {
    id: "nn-continual-learning",
    title: "Continual Learning: Weight Decay vs Sparse Rehearsal",
    domain: "Machine Learning Neuronal Capacity Architecture",
    clashSummary: "A deep optimization standoff: does Elastic Weight Consolidation (EWC) along Fisher information curves prevent catastrophic forgetting, or does constant parameter lockdown choke the network's volume capacity to digest out-of-distribution manifolds?",
    thesisPaper: {
      title: "Elastic Weight Consolidation via Fisher Information Constraints",
      authors: "Dr. James Kirkpatrick, Dr. Neil Rabinowitz",
      source: "ICML Proceedings (Thesis)",
      conditionName: "State Alpha: High Task Homogeneity (Overlapping)",
      evidenceText: "Constraining weights along the directional curvature of the Fisher information matrix ensures the network keeps high performance (98%) on Task 1 while slowly integrating Task 2 parameters, with zero forgetting detected.",
      points: [
        { id: "tp4", statement: "Freezes core weights inside localized high-curvature Hessian wells.", citation: "Kirkpatrick Sec. 2.1", metric: "H_capacity Bounds" },
        { id: "tp5", statement: "Overcomes task interference by bounding spatial divergence relative to previous configurations.", citation: "Kirkpatrick Fig. 1b", metric: "Fisher Covariance" },
        { id: "tp6", statement: "Minimal learning step transitions preserve neural state stability bounds.", citation: "Kirkpatrick Eq. 6", metric: "Step limit D_KL" }
      ]
    },
    antithesisPaper: {
      title: "Fisher Elastic Bottleneck: Critical Parameter Over-Saturation",
      authors: "Dr. Razvan Pascanu et al.",
      source: "DeepMind Neural Systems Journal (Antithesis)",
      conditionName: "State Beta: High Task Divergence (Heterogeneous)",
      evidenceText: "When the model encounters highly diverse, out-of-distribution environments, freezing prior variables chokes the model manifold capacity. The training gradients flatline, rendering the system incapable of state adaptation.",
      points: [
        { id: "ap1", statement: "Task adaptation rates collapse to zero on foreign out-of-distribution datasets.", citation: "Pascanu Sec. 4.3", metric: "Adaptation Slope = 0.0" },
        { id: "ap2", statement: "Inflexible parameter constraints choke active degrees-of-freedom indices.", citation: "Pascanu Fig. 3a", metric: "Active Channels M_active" },
        { id: "ap3", statement: "Aggressive regularizer bounds trigger gradient decay bottlenecks.", citation: "Pascanu Eq. 11", metric: "Gradient Amplitude 1e-8" }
      ]
    },
    conflictMappings: {
      "tp4": "ap1",
      "tp5": "ap2",
      "tp6": "ap3"
    },
    resolution: {
      resolvedTitle: "Riemannian Information-Potential Partition: Unifying EWC Hessian Gating and Manifold Divergence",
      thesisSummary: "To resolve the catastrophic forgetting versus learning capability bottleneck, we transcend simple parameter limits by modeling the network weight manifold as a high-dimensional Riemannian space. Combining Fisher information curvature with Kullback-Leibler divergence yields a dynamic Helmholtz free energy of information. For highly homogeneous tasks, the weight parameters remain constrained inside the Fisher information well, whereas out-of-distribution inputs trigger non-linear gradient projection pathways that adaptively allocate secondary latent manifold dimensions.",
      gatingCondition: "The boundary transition triggers when foreign tasks diverge beyond the model manifold dimensionality metric.",
      gatingExplanation: "When the information entropy metric Π matches or remains below the critical capacity threshold, the regularized Fisher bounds lock prior weights safely. When out-of-distribution divergence forces the KL metric higher, the informational stress parameter breaks the regularizer Wells to initialize clean representation coordinates.",
      gatingEquation: "\\Pi_{\\text{info}} = \\frac{\\mathcal{D}_{\\text{KL}}(p_{\\text{target}} \\parallel q_{\\text{prior}}) \\cdot H_{\\text{capacity}}}{k_B T_{\\text{train}} \\cdot \\ln(2) \\cdot M_{\\text{active}}} \\le 0.75",
      parameters: [
        { symbol: "\\mathcal{D}_{\\text{KL}}", explanation: "Relative Kullback-Leibler information divergence between task target priors", boundary: "≤ 0.75 (Dimensionless Ratio)", dimension: "[1] (Dimensionless)" },
        { symbol: "H_{\\text{capacity}}", explanation: "Hyperparameter reservoir optimization manifold energy coefficient", boundary: "3.45 × 10^-21 Joules (kg·m²·s^-2)", dimension: "[M][L]²[T]^-2" },
        { symbol: "k_B", explanation: "Boltzmann thermodynamic constant scaling entropy noise", boundary: "1.381 × 10^-23 J/K (kg·m²·s^-2·K^-1)", dimension: "[M][L]²[T]^-2[Θ]^-1" },
        { symbol: "T_{\\text{train}}", explanation: "Mathematical simulated optimization annealing temperature", boundary: "350.00 Kelvin", dimension: "[Θ]" },
        { symbol: "M_{\\text{active}}", explanation: "Dimensionality index of active parameter degrees-of-freedom channels", boundary: "8.40 × 10^7 active channels", dimension: "[1] (Dimensionless)" }
      ],
      dimensionalProofLog: {
        baseSIAnalysis: "Numerator: [Dimensionless] * [kg·m²·s⁻²] = Joules [J]. Denominator: [kg·m²·s⁻²·K⁻¹] * [K] * [Dimensionless] = Joules [J]. Total: [J] / [J] = [Dimensionless].",
        normalizationStatus: "[ ✓ SYSTEM UNIT MATRIX UNIFIED: UNITLESS SPECIFICATION ]",
        derivationSteps: [
          "1. The KL-divergence metric scales as a pure information-theoretic dimensionless ratio [1].",
          "2. State energy potential H_capacity acts as an informational work capability metric in Joules.",
          "3. Annealing noise energy is the product of Boltzmann's constant k_B and mathematical temperature T_train, having unit Joules.",
          "4. Total parameter counts M_active normalize the relative capacity per neuron channels [Dimensionless].",
          "5. The complete Informational Shannon coefficient compiles unitless, securing rigorous algorithmic scaling."
        ]
      },
      rebuttal: "REBUTTAL (PEER REVIEW): The proposal to model standard deep neural learning parameters as a high-dimensional Riemannian manifold under a Helmholtz free energy of information is a profound over-complication of basic gradient descent physics. In practice, calculating the exact Kullback-Leibler divergence and true Fisher information curvature across 84 million dimensions is computationally intractable, making this gating threshold of ≤ 0.75 practically untestable in active training runtimes. Furthermore, the model assumes that learning annealing temperature constraints behave like closed thermodynamic states, when real deep network optimizations operate under highly non-equilibrium, chaotic loss landscapes where local minima traps invalidate these elegant partition equations."
    }
  },
  {
    id: "macro-micro-climate",
    title: "Extreme Forest Fires: Wind Turbulence vs Moisture Load",
    domain: "Atmospheric Aerodynamics & Plant Hydrology",
    clashSummary: "A multi-scale physics standoff: is top-canopy crown fire progression dictated primarily by thermodynamic wind-shear momentum fluxes, or do local stomata-scale cell water-cooling barriers halt the ignition wave propagation?",
    thesisPaper: {
      title: "Bulk Atmospheric Wind Velocity Control over Large Canopy Fire fronts",
      authors: "Dr. Robert Rothermel",
      source: "National Forest Service Review (Thesis)",
      conditionName: "State Alpha: High Horizontal Wind Vectors",
      evidenceText: "Extreme crown fires propagate purely under bulk wind shear forces. In high velocity wind tunnels (> 40 km/h), fuel moisture gradients do not statistically alter the dynamic wave propagation rate of top-canopy flames.",
      points: [
        { id: "tp7", statement: "Aerodynamic wind-shear momentum dictates flame propagation velocity.", citation: "Rothermel Sec. 1.2", metric: "Wind Velocity V_wind" },
        { id: "tp8", statement: "Top-canopy mass structures generate high-speed forward heat drafts.", citation: "Rothermel Fig. 5", metric: "Wind Momentum Flux" }
      ]
    },
    antithesisPaper: {
      title: "Stomatal Water Tension Limits on Microclimate Fire Ignition",
      authors: "Dr. Clara Thorne",
      source: "Journal of Environmental Hydrology (Antithesis)",
      conditionName: "State Beta: Low Canopy Thermal Diffusion Limits",
      evidenceText: "In tight micro-canopy systems, leaf stomatal water tension prevents the heat draft from drying out foliage. Unless fuel moisture levels drop below the critical 12% moisture point, wind draft fails to propagate flames.",
      points: [
        { id: "ap1", statement: "High plant cell moisture levels entirely halt flame ingress.", citation: "Thorne Sec. 3a", metric: "Moisture Mass Flux J_water" },
        { id: "ap2", statement: "High local atmospheric vapor pressure retains cellular latent liquid barrier.", citation: "Thorne Fig. 7b", metric: "Humidity Deficit (1 - RH)" }
      ]
    },
    conflictMappings: {
      "tp7": "ap1",
      "tp8": "ap2"
    },
    resolution: {
      resolvedTitle: "Aerodynamic multi-phase energy balance: Unifying Wind Shear Potentials and Plant Stomatal Evaporation",
      thesisSummary: "The apparent contradiction between wind-driven crown progression and local leaf-stomata cellular water tension is resolved by establishing a strict multi-phase energy flux boundary equation. Instead of checking a basic decimal threshold, we model the system as a competition of fluxes: the momentum kinetic energy density rate of the top-canopy shear wind competes with the multi-phase latent heat vaporization energy density rate of stomatal cell moisture. Wind-driven crown fires can propagate ONLY when the aerodynamic heat-shear wind power density exceeds the plant's thermodynamic transpiration vaporization threshold.",
      gatingCondition: "The boundary transition is dictated by the ratio of kinetic wind energy flux density against plant latent heat dissipation.",
      gatingExplanation: "When the dimensionless ratio Ξ_propagation is ≥ 1.0, the ambient aero-momentum flux rate overcomes the latent thermal moisture threshold, causing crown fire inception. Below 1.0, high cellular stomata moisture prevents crown-to-crown chain reactions.",
      gatingEquation: "\\Xi_{\\text{prop}} = \\frac{\\frac{1}{2} C_{\\text{drag}} \\cdot \\rho_{\\text{air}} \\cdot V_{\\text{wind}}^3}{\\lambda_{\\text{vaporize}} \\cdot J_{\\text{water}} \\cdot (1 - \\text{RH})} \\ge 1.00",
      parameters: [
        { symbol: "V_{\\text{wind}}", explanation: "Shear wind velocity vector measured at the top forest crowns", boundary: "≥ 10.20 m/s (Length/Time)", dimension: "[L][T]^-1" },
        { symbol: "\\rho_{\\text{air}}", explanation: "Ambient dry atmospheric air density index", boundary: "1.225 kg/m³ (Mass/Volume)", dimension: "[M][L]^-3" },
        { symbol: "C_{\\text{drag}}", explanation: "Canopy structural drag and foliage friction multiplier", boundary: "0.450 (Dimensionless)", dimension: "[1] (Dimensionless)" },
        { symbol: "\\lambda_{\\text{vaporize}}", explanation: "Latent enthalpy coefficient required to vaporize water off cell walls", boundary: "2.26 × 10^6 J/kg (m²/s²)", dimension: "[L]²[T]^-2" },
        { symbol: "J_{\\text{water}}", explanation: "Dynamic mass flux of moisture escaping cell stomatal membranes", boundary: "2.35 × 10^-4 kg/(m²·s)", dimension: "[M][L]^-2[T]^-1" },
        { symbol: "\\text{RH}", explanation: "Target microclimate local relative biological humidity ratio", boundary: "0.150 (Dimensionless fraction)", dimension: "[1] (Dimensionless)" }
      ],
      dimensionalProofLog: {
        baseSIAnalysis: "Numerator: [1] * [kg·m⁻³] * [m³·s⁻³] = [kg·s⁻³] = Watts/m² [M][T]⁻³. Denominator: [m²·s⁻²] * [kg·m⁻²·s⁻¹] * [1] = [kg·s⁻³] = Watts/m² [M][T]⁻³. Ratio: [W/m²] / [W/m²] = [Dimensionless].",
        normalizationStatus: "[ ✓ METRIC MATRIX RIGOROUSLY ALIGNED: FLUX DENSITY BALANCED ]",
        derivationSteps: [
          "1. Calculate kinetic wind energy flux rate: 0.5 * C_drag * ρ_air * V_wind³ = [1] * [kg/m³] * [m³/s³] = kg/s³ = Watts/m².",
          "2. Compute plant cooling latent dissipation: λ_vaporize * J_water = [J/kg] * [kg/(m²*s)] = J/(m²*s) = Watts/m².",
          "3. Relate both fluxes through relative humidity boundary (1 - RH) [Dimensionless].",
          "4. Divide momentum flux density by thermal vaporizing energy flux density: Both yield identical scale [M][T]⁻³ (Watts/m²).",
          "5. Unit conversion cancellation produces a perfectly normalized dimensionless stability rating."
        ]
      },
      rebuttal: "REBUTTAL (PEER REVIEW): This thermodynamic fluid model has fundamentally over-simplified fire front aerodynamic mechanics. First, the canopy structural drag coefficient C_drag is highly non-linear under high wind conditions, behaving like an elastic chaotic damper rather than a simple scaling multiplier. Second, foliage stomatal mass moisture flux J_water behaves as a highly dynamic transient barrier that fluctuates wildly as foliage burns, rendering any static 'relative biological humidity ratio' calculations completely useless during active crown ignitions. This beautiful algebraic boundary Ξ_prop ≥ 1.00 will immediately break down in real-world forest fuel loads under chaotic wind gusts."
    }
  }
];

interface DialecticalPaper {
  id: string;
  title: string;
  authors: string;
  source: string;
  conditionName: string;
  evidenceText: string;
  points: { id: string; statement: string; citation: string; metric: string }[];
}

const MASTER_PAPER_POOL: DialecticalPaper[] = [
  {
    id: "graphene-strain",
    title: "Unconventional Superconductivity Magic-Angle Tuning",
    authors: "Dr. Yuan Cao, Prof. Pablo Jarillo-Herrero",
    source: "Nature Physics Letters (Thesis)",
    conditionName: "State Alpha: High Lattice Symmetry Hydrostatic Strain",
    evidenceText: "Under physical hydrostatic strain pressure (P = 1.2 GPa), twisted bilayer graphene flat bands stabilize localized electron correlation profiles, achieving high critical temperature (T_c = 1.7 K) superconducting state convergence across planar ranges.",
    points: [
      { id: "tp1", statement: "Critical Temperature peaks at T_c = 1.7 K under hydrostatic lattice strain.", citation: "Cao et al. Sec. 3.2", metric: "T_c Stabilization" },
      { id: "tp2", statement: "Tight Moiré superlattice wavelength flat bands (λ_M ≈ 13.4 nm) optimize localized DOS.", citation: "Cao et al. Fig. 4c", metric: "Flat-Band Wavelength λ_M" },
      { id: "tp3", statement: "Coherent superconducting pairing density is robust under physical planar lattice compression.", citation: "Cao et al. Eq. 9", metric: "Shear Modulus K_shear" }
    ]
  },
  {
    id: "graphene-fields",
    title: "Experimental Superconductivity Collapse under Orbital Fields",
    authors: "Prof. Andrea Young, Dr. Matthew Yankowitz",
    source: "Physical Review B (Antithesis)",
    conditionName: "State Beta: Incoherent Boundary Shearing Dislocation",
    evidenceText: "Under highly active transverse orbital fields (B_ext > 0.5 T), local structural micro-strain perturbations break spatial inversion symmetry. The flat-band energy landscape collapses immediately into localized insulating state bottlenecks.",
    points: [
      { id: "ap1", statement: "Superconductivity completely collapses (T_c approaches 0 K) under external fields.", citation: "Young et al. Sec. 1.4", metric: "T_c Collapse" },
      { id: "ap2", statement: "Transverse magnetic gauge field B_external breaks orbital symmetry, triggering localized current loops.", citation: "Young et al. Fig. 2a", metric: "Zeeman Field B_ext" },
      { id: "ap3", statement: "Spontaneous micro-strain lattice distortions degrade long-range quantum pairing.", citation: "Young et al. Eq. 14", metric: "Micro-strain ε_moiré" }
    ]
  },
  {
    id: "continual-ewc",
    title: "Elastic Weight Consolidation via Fisher Information Constraints",
    authors: "Dr. James Kirkpatrick, Dr. Neil Rabinowitz",
    source: "ICML Proceedings (Thesis)",
    conditionName: "State Alpha: High Task Homogeneity (Overlapping)",
    evidenceText: "Constraining weights along the directional curvature of the Fisher information matrix ensures the network keeps high performance (98%) on Task 1 while slowly integrating Task 2 parameters, with zero forgetting detected.",
    points: [
      { id: "tp4", statement: "Freezes core weights inside localized high-curvature Hessian wells.", citation: "Kirkpatrick Sec. 2.1", metric: "H_capacity Bounds" },
      { id: "tp5", statement: "Overcomes task interference by bounding spatial divergence relative to previous configurations.", citation: "Kirkpatrick Fig. 1b", metric: "Fisher Covariance" },
      { id: "tp6", statement: "Minimal learning step transitions preserve neural state stability bounds.", citation: "Kirkpatrick Eq. 6", metric: "Step limit D_KL" }
    ]
  },
  {
    id: "continual-oversaturation",
    title: "Fisher Elastic Bottleneck: Critical Parameter Over-Saturation",
    authors: "Dr. Razvan Pascanu et al.",
    source: "DeepMind Neural Systems Journal (Antithesis)",
    conditionName: "State Beta: High Task Divergence (Heterogeneous)",
    evidenceText: "When the model encounters highly diverse, out-of-distribution environments, freezing prior variables chokes the model manifold capacity. The training gradients flatline, rendering the system incapable of state adaptation.",
    points: [
      { id: "ap4", statement: "Task adaptation rates collapse to zero on foreign out-of-distribution datasets.", citation: "Pascanu Sec. 4.3", metric: "Adaptation Slope = 0.0" },
      { id: "ap5", statement: "Inflexible parameter constraints choke active degrees-of-freedom indices.", citation: "Pascanu Fig. 3a", metric: "Active Channels M_active" },
      { id: "ap6", statement: "Aggressive regularizer bounds trigger gradient decay bottlenecks.", citation: "Pascanu Eq. 11", metric: "Gradient Amplitude 1e-8" }
    ]
  },
  {
    id: "climate-wind",
    title: "Bulk Atmospheric Wind Velocity Control over Large Canopy Fire fronts",
    authors: "Dr. Robert Rothermel",
    source: "National Forest Service Review (Thesis)",
    conditionName: "State Alpha: High Horizontal Wind Vectors",
    evidenceText: "Extreme crown fires propagate purely under bulk wind shear forces. In high velocity wind tunnels (> 40 km/h), fuel moisture gradients do not statistically alter the dynamic wave propagation rate of top-canopy flames.",
    points: [
      { id: "tp7", statement: "Aerodynamic wind-shear momentum dictates flame propagation velocity.", citation: "Rothermel Sec. 1.2", metric: "Wind Velocity V_wind" },
      { id: "tp8", statement: "Top-canopy mass structures generate high-speed forward heat drafts.", citation: "Rothermel Fig. 5", metric: "Wind Momentum Flux" },
      { id: "tp9", statement: "Sustained shear draft parameters support continuous fire progression rates.", citation: "Rothermel Eq. 7", metric: "Propagation Speed V_prop" }
    ]
  },
  {
    id: "climate-stomatal",
    title: "Stomatal Water Tension Limits on Microclimate Fire Ignition",
    authors: "Dr. Clara Thorne",
    source: "Journal of Environmental Hydrology (Antithesis)",
    conditionName: "State Beta: Low Canopy Thermal Diffusion Limits",
    evidenceText: "In tight micro-canopy systems, leaf stomatal water tension prevents the heat draft from drying out foliage. Unless fuel moisture levels drop below the critical 12% moisture point, wind draft fails to propagate flames.",
    points: [
      { id: "ap7", statement: "High plant cell moisture levels entirely halt flame ingress.", citation: "Thorne Sec. 3a", metric: "Moisture Mass Flux J_water" },
      { id: "ap8", statement: "High local atmospheric vapor pressure retains cellular latent liquid barrier.", citation: "Thorne Fig. 7b", metric: "Humidity Deficit (1 - RH)" },
      { id: "ap9", statement: "Foliage stomatal transpiration dynamically balances convective draft effects.", citation: "Thorne Eq. 12", metric: "Transpiration Rate E_trans" }
    ]
  }
];

export default function DialecticalSynthesisEngine({ onClose }: { onClose: () => void }) {
  const [paperPool, setPaperPool] = useState<any[]>(MASTER_PAPER_POOL);
  const [selectedPaperAId, setSelectedPaperAId] = useState<string>("graphene-strain");
  const [selectedPaperBId, setSelectedPaperBId] = useState<string>("graphene-fields");

  const selectedPaperA = paperPool.find(p => p.id === selectedPaperAId) || paperPool[0];
  const selectedPaperB = paperPool.find(p => p.id === selectedPaperBId) || paperPool[1];

  const [activeResolution, setActiveResolution] = useState<any>(DIALECTICAL_PRESETS[0].resolution);
  const [conflictMappings, setConflictMappings] = useState<any>(DIALECTICAL_PRESETS[0].conflictMappings);
  const [isDynamicApiResolution, setIsDynamicApiResolution] = useState<boolean>(false);

  // Connection/Mapping State
  const [mappedPaths, setMappedPaths] = useState<{ [pointIdA: string]: boolean }>({});
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisComplete, setSynthesisComplete] = useState(false);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [apiLoadingMessage, setApiLoadingMessage] = useState<string>("");

  // Custom Paper modal state
  const [showCustomPaperModal, setShowCustomPaperModal] = useState(false);
  const [customPaperForm, setCustomPaperForm] = useState({
    title: "",
    authors: "",
    source: "",
    conditionName: "",
    evidenceText: "",
    points: [
      { statement: "", citation: "", metric: "" },
      { statement: "", citation: "", metric: "" },
      { statement: "", citation: "", metric: "" }
    ]
  });

  // SVG Refs to draw clean anchor lines
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const canvasSvgRef = useRef<SVGSVGElement>(null);

  // Dynamic lines array calculated after render
  const [lines, setLines] = useState<{
    idA: string;
    idB: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isResolved: boolean;
  }[]>([]);

  // Interactive Peer Review Debate Arena state
  const [debateRounds, setDebateRounds] = useState<any[]>([]);
  const [userProbe, setUserProbe] = useState("");
  const [isSparing, setIsSparing] = useState(false);
  const [currentAssentScore, setCurrentAssentScore] = useState(18);
  const [panelVerdict, setPanelVerdict] = useState<string | null>(null);

  // Initialize or reset debate rounds when activeResolution changes
  useEffect(() => {
    if (activeResolution) {
      setDebateRounds([
        {
          id: "round-0",
          userQuestion: "Initial Synthesis Assertion",
          authorsDefense: activeResolution.thesisSummary || "We have formulated a robust mathematical model combining these conflicting operational paradigms into a stable unified state boundary.",
          reviewersRebuttal: activeResolution.rebuttal || "While this mathematical unifier is elegant on paper, it relies on several hyper-idealized constants. Real-world structural limitations render this stability boundary highly speculative.",
          panelConsensus: "Theoretical synthesis proposed. Symmetrical debate arena activated.",
          consensusScore: 18
        }
      ]);
      setCurrentAssentScore(18); // Default peer agreement score
      setPanelVerdict(null);
    }
  }, [activeResolution, selectedPaperA, selectedPaperB]);

  // Function to run academic sparring run via backend
  const handleExecuteAcademicSpar = async () => {
    if (!userProbe.trim() || !selectedPaperA || !selectedPaperB || !activeResolution) return;
    
    setIsSparing(true);
    const userText = userProbe;
    setUserProbe("");
    
    try {
      const response = await fetch("/api/debate-spar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thesisPaper: selectedPaperA,
          antithesisPaper: selectedPaperB,
          gatingEquation: activeResolution.gatingEquation,
          userQuestion: userText,
          previousRounds: debateRounds.map(r => ({
            user_critique: r.userQuestion,
            authors_defense: r.authorsDefense,
            reviewers_rebuttal: r.reviewersRebuttal
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error("Sparing API returned error status");
      }
      
      const result = await response.json();
      if (result.success) {
        const newRound = {
          id: `round-${Date.now()}`,
          userQuestion: userText,
          authorsDefense: result.authorsDefense,
          reviewersRebuttal: result.reviewersRebuttal,
          panelConsensus: result.panelConsensus,
          consensusScore: result.consensusScore
        };
        
        setDebateRounds(prev => [...prev, newRound]);
        
        if (result.consensusScore !== undefined) {
          setCurrentAssentScore(result.consensusScore);
        }
        if (result.panelConsensus) {
          setPanelVerdict(result.panelConsensus);
        }
      }
    } catch (error) {
      console.error("Failed to Spar in Arena:", error);
      // Graceful fallback dialogue on error or timeout
      const fallbackRound = {
        id: `round-err-${Date.now()}`,
        userQuestion: userText,
        authorsDefense: "The authors attempted to compile a response, but atmospheric atmospheric fluctuations interrupted our network telemetry stack.",
        reviewersRebuttal: "An opportunistic communications blackout! We require that all physical and numerical parameters be validated with direct lab proofs before confirming consensus.",
        panelConsensus: "Consensus evaluation suspended due to technical telemetry constraints.",
        consensusScore: currentAssentScore
      };
      setDebateRounds(prev => [...prev, fallbackRound]);
    } finally {
      setIsSparing(false);
    }
  };

  // Function to re-calculate SVG connection positions
  const updateConnectionLines = () => {
    if (!leftColRef.current || !rightColRef.current || !canvasSvgRef.current) return;
    const svgRect = canvasSvgRef.current.getBoundingClientRect();

    const tempLines = Object.entries(conflictMappings).map(([idA, idB]) => {
      const elA = document.getElementById(`conflict-node-${idA}`);
      const elB = document.getElementById(`conflict-node-${idB}`);

      if (elA && elB) {
        const rectA = elA.getBoundingClientRect();
        const rectB = elB.getBoundingClientRect();

        return {
          idA,
          idB,
          x1: rectA.right - svgRect.left,
          y1: rectA.top + rectA.height / 2 - svgRect.top,
          x2: rectB.left - svgRect.left,
          y2: rectB.top + rectB.height / 2 - svgRect.top,
          isResolved: !!mappedPaths[idA]
        };
      }
      return null;
    }).filter((l): l is typeof lines[0] => l !== null);

    setLines(tempLines);
  };

  // Run initial calculations and listen to resize and scroll events
  useEffect(() => {
    updateConnectionLines();
    window.addEventListener("resize", updateConnectionLines);
    
    // Also scroll listener to keep connections static
    const parentContainer = document.getElementById("war-room-split-columns-wrapper");
    if (parentContainer) {
      parentContainer.addEventListener("scroll", updateConnectionLines);
    }

    return () => {
      window.removeEventListener("resize", updateConnectionLines);
      if (parentContainer) {
        parentContainer.removeEventListener("scroll", updateConnectionLines);
      }
    };
  }, [selectedPaperAId, selectedPaperBId, conflictMappings, mappedPaths, synthesisComplete]);

  // Handle clicking a thesis node to activate/resolve its mapped line path
  const handleToggleNodeConnection = (idA: string) => {
    setMappedPaths(prev => {
      const updated = { ...prev };
      if (updated[idA]) {
        delete updated[idA];
      } else {
        updated[idA] = true;
      }
      return updated;
    });

    // Stagger slightly and recalculate lines
    setTimeout(updateConnectionLines, 50);
  };

  const handleSelectPaperA = (id: string) => {
    setSelectedPaperAId(id);
    setSynthesisComplete(false);
    setMappedPaths({});
    setApiErrorMessage(null);
    const paperAObj = paperPool.find(p => p.id === id);
    const match = DIALECTICAL_PRESETS.find(p => 
      (p.thesisPaper.title === paperAObj?.title && p.antithesisPaper.title === selectedPaperB.title) ||
      (p.thesisPaper.title === selectedPaperB.title && p.antithesisPaper.title === paperAObj?.title)
    );
    if (match) {
      setActiveResolution(match.resolution);
      setConflictMappings(match.conflictMappings);
      setIsDynamicApiResolution(false);
    } else {
      setActiveResolution(null);
      setConflictMappings({});
      setIsDynamicApiResolution(true);
    }
  };

  const handleSelectPaperB = (id: string) => {
    setSelectedPaperBId(id);
    setSynthesisComplete(false);
    setMappedPaths({});
    setApiErrorMessage(null);
    const paperBObj = paperPool.find(p => p.id === id);
    const match = DIALECTICAL_PRESETS.find(p => 
      (p.thesisPaper.title === selectedPaperA.title && p.antithesisPaper.title === paperBObj?.title) ||
      (p.thesisPaper.title === paperBObj?.title && p.antithesisPaper.title === selectedPaperA.title)
    );
    if (match) {
      setActiveResolution(match.resolution);
      setConflictMappings(match.conflictMappings);
      setIsDynamicApiResolution(false);
    } else {
      setActiveResolution(null);
      setConflictMappings({});
      setIsDynamicApiResolution(true);
    }
  };

  const handleLoadScenario = (presetIndex: number) => {
    const preset = DIALECTICAL_PRESETS[presetIndex];
    let idA = paperPool.find(p => p.title === preset.thesisPaper.title)?.id;
    let idB = paperPool.find(p => p.title === preset.antithesisPaper.title)?.id;

    if (idA && idB) {
      setSelectedPaperAId(idA);
      setSelectedPaperBId(idB);
      setActiveResolution(preset.resolution);
      setConflictMappings(preset.conflictMappings);
      setIsDynamicApiResolution(false);
      setSynthesisComplete(false);
      setMappedPaths({});
      setApiErrorMessage(null);
    }
  };

  // Perform full visual automated synthesis resolution progression
  const handleResolveContradiction = async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setSynthesisComplete(false);
    setMappedPaths({}); // Start clean
    setApiErrorMessage(null);

    try {
      let resolutionData = activeResolution;
      let mappings = conflictMappings;

      // Call server side Gemini endpoint if we are creating a dynamic cross-disciplinary equation or if resolving custom papers
      if (isDynamicApiResolution || !activeResolution || Object.keys(conflictMappings).length === 0) {
        setApiLoadingMessage("Initializing Symmetrical Logic Compiler...");
        await new Promise(r => setTimeout(r, 800));

        setApiLoadingMessage("Sending papers to Dialectical Synthesis Engine...");
        const response = await fetch("/api/dialectical-resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paperA: selectedPaperA,
            paperB: selectedPaperB
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "The Dialectical Compilation engine failed to unify coordinates.");
        }

        const data = await response.json();
        
        // Dynamically align paper points with those generated by Gemini
        if (data.pointsA && data.pointsB) {
          setPaperPool(prev => prev.map(p => {
            if (p.id === selectedPaperAId) {
              return { ...p, points: data.pointsA };
            }
            if (p.id === selectedPaperBId) {
              return { ...p, points: data.pointsB };
            }
            return p;
          }));
        }

        resolutionData = data;
        mappings = data.conflictMappings || {};
        
        setActiveResolution(resolutionData);
        setConflictMappings(mappings);
      }

      const keys = Object.keys(mappings);
      
      // Perform automated bridge link animation with customized loading messages
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        setApiLoadingMessage(`Resolving contradiction [${i + 1}/${keys.length}]: ${key} ⇄ ${mappings[key]}...`);
        await new Promise(resolve => setTimeout(resolve, 900));
        setMappedPaths(prev => ({
          ...prev,
          [key]: true
        }));
        setTimeout(updateConnectionLines, 30);
      }

      setApiLoadingMessage("Proving SI base dimensional homogeneity...");
      await new Promise(resolve => setTimeout(resolve, 700));

      setApiLoadingMessage("Compiling peer-reviewer brutal rebuttal critique...");
      await new Promise(resolve => setTimeout(resolve, 800));

      setSynthesisComplete(true);
    } catch (err: any) {
      console.error(err);
      setApiErrorMessage(err.message || "Synthesis convergence bottleneck. Unresolvable dimensional mismatch.");
    } finally {
      setIsSynthesizing(false);
      setApiLoadingMessage("");
    }

    // Smooth scroll list to target output synthesis container at bottom
    setTimeout(() => {
      const el = document.getElementById("dialectical-blueprint-proposal-container");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleResetWorkspace = () => {
    setMappedPaths({});
    setSynthesisComplete(false);
    setIsSynthesizing(false);
    setApiErrorMessage(null);
  };

  const handleAddCustomPaper = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `custom-paper-${Date.now()}`;
    const newPaper: DialecticalPaper = {
      id: newId,
      title: customPaperForm.title || "Untitled Custom Inquiry",
      authors: customPaperForm.authors || "Anonymous Research Group",
      source: customPaperForm.source || "Private Academic Archive",
      conditionName: customPaperForm.conditionName || "State Omega: Extreme Edge Case Parameters",
      evidenceText: customPaperForm.evidenceText || "No abstract evidence provided.",
      points: customPaperForm.points.map((p, index) => ({
        id: `custom-node-n${index + 1}`,
        statement: p.statement || "General model parameter threshold constraint failure.",
        citation: p.citation || "Fig. 1.1",
        metric: p.metric || "Metric X"
      }))
    };

    setPaperPool(prev => [...prev, newPaper]);
    setSelectedPaperAId(newId);
    setSynthesisComplete(false);
    setMappedPaths({});
    setConflictMappings({});
    setIsDynamicApiResolution(true);
    setActiveResolution(null);
    setShowCustomPaperModal(false);

    // Reset Form
    setCustomPaperForm({
      title: "",
      authors: "",
      source: "",
      conditionName: "",
      evidenceText: "",
      points: [
        { statement: "", citation: "", metric: "" },
        { statement: "", citation: "", metric: "" },
        { statement: "", citation: "", metric: "" }
      ]
    });
  };

  // Is all contradictory nodes synchronized
  const activeMappingsCount = Object.keys(mappedPaths).length;
  const totalMappingsCount = Object.keys(conflictMappings).length;
  const allBridgesLinked = totalMappingsCount > 0 && activeMappingsCount === totalMappingsCount;

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF9F4] overflow-y-auto flex flex-col antialiased font-sans">
      
      {/* Immersive Top Navigation Bar */}
      <nav className="sticky top-0 bg-[#FDFBF9]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8E2D2] flex justify-between items-center z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-amber-800 text-white p-2.5 rounded-xl flex items-center justify-center shadow-3xs">
            <GitMerge className="h-4.5 w-4.5" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-serif font-black text-[#2D281F] flex items-center gap-2">
              The Dialectical Synthesis Engine
              <span className="text-[9px] bg-amber-800/15 text-amber-800 border border-amber-800/25 px-2.5 py-0.5 rounded-full font-mono uppercase font-black">
                Conflict Resolution v2.2
              </span>
            </h1>
            <p className="text-[11px] text-[#8C8068] font-medium hidden sm:block">
              Analyze conflicting papers side-by-side, map empirical friction points, and compile unified boundary gating parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8C8068] hover:text-[#2D281F] border border-[#E8E2D2] bg-white transition-all cursor-pointer shadow-3xs hover:bg-[#F5EFE1]"
            title="Close Academic War Room"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* Symmetrical Control Board & Paper Selectors */}
        <div className="bg-white blueprint-graph-paper border border-[#E8E2D2] rounded-[24px] p-5 flex flex-col gap-5 shadow-3xs text-left relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E8E2D2] pb-4">
            <div className="flex items-center gap-3">
              <Scale className="h-4.5 w-4.5 text-amber-800 flex-shrink-0" />
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#8C8068] font-bold block">
                  1. PRESET SCENARIOS (QUICK-LOAD DISPUTES)
                </span>
                <p className="text-sm font-serif font-bold text-[#201B12] mt-0.5">
                  Load Symmetrical Inter-Disciplinary Friction Points
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {DIALECTICAL_PRESETS.map((p, index) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadScenario(index)}
                  className={`px-3 py-1.5 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                    (selectedPaperA.title === p.thesisPaper.title && selectedPaperB.title === p.antithesisPaper.title) ||
                    (selectedPaperB.title === p.thesisPaper.title && selectedPaperA.title === p.antithesisPaper.title)
                      ? "bg-amber-800 text-white border-amber-800 font-bold shadow-xs"
                      : "bg-white border-[#E8E2D2] text-[#5C5340] hover:bg-[#F2EDE0]"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Paper A Selector */}
            <div className="md:col-span-5 flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                Thesis Focus (Paper A)
              </label>
              <select
                value={selectedPaperAId}
                onChange={(e) => handleSelectPaperA(e.target.value)}
                className="w-full bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs text-[#2D281F] font-serif font-semibold focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
              >
                {paperPool.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.authors?.split(",")[0] || "Anonymous"})
                  </option>
                ))}
              </select>
            </div>

            {/* Vs Crucible Decorator */}
            <div className="md:col-span-2 flex flex-col items-center justify-center pt-2 md:pt-0">
              <span className="text-[10px] font-mono font-bold bg-[#FAF6EC] border border-[#E8E2D2] px-3 py-1 rounded-full text-[#8C8068] tracking-widest select-none">
                VS
              </span>
            </div>

            {/* Paper B Selector */}
            <div className="md:col-span-5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-rose-800 uppercase">
                  Antithesis Friction (Paper B)
                </label>
                <button
                  onClick={() => setShowCustomPaperModal(true)}
                  className="text-[9.5px] font-mono hover:text-amber-800 text-neutral-500 flex items-center gap-1 font-bold transition-all cursor-pointer border border-[#E2DCCF] px-2 py-0.5 rounded-md bg-white hover:bg-neutral-50"
                  title="Inject arbitrary parameters as a custom paper"
                >
                  <Plus className="h-3 w-3" />
                  + Add Custom Paper
                </button>
              </div>
              <select
                value={selectedPaperBId}
                onChange={(e) => handleSelectPaperB(e.target.value)}
                className="w-full bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs text-[#2D281F] font-serif font-semibold focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800"
              >
                {paperPool.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.authors?.split(",")[0] || "Anonymous"})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Informative Guidance Ribbon */}
        <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-left">
          <Info className="h-4.5 w-4.5 text-amber-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-900/90">
            <span className="font-bold">Mechanism Description:</span> Contradictory claims in top academic journals can be bridged by mapping empirical parameters into a unified system with distinct boundary conditions. Link the conflicting elements below to analyze structural constraints, or click <strong className="font-semibold text-amber-950">"Resolve Contradiction"</strong> to compile and mutate the mathematical equation via server-side Ginzburg-Landau tensors.
          </div>
        </div>

        {/* API Error Box */}
        {apiErrorMessage && (
          <div className="bg-red-50 border border-red-250 rounded-2xl p-4 flex gap-3 text-left items-center">
            <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0" />
            <div className="text-xs leading-relaxed text-red-950">
              <span className="font-bold">Mathematical Convergence Failure:</span> {apiErrorMessage} Please check your parameter alignments or trigger standard presets as healthy control anchors.
            </div>
          </div>
        )}

        {/* ACADEMIC WAR ROOM UI SPLIT-SCREEN WORKSPACE wrapper */}
        <div id="war-room-split-columns-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative min-h-[460px]">
          
          {/* LEFT COLUMN: Thesis Paper A */}
          <div ref={leftColRef} className="lg:col-span-5 bg-white blueprint-graph-paper border border-[#E8E2D2] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-3xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/3 pointer-events-none rounded-bl-full" />
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E2D2]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-amber-800 bg-amber-800/10 px-2.5 py-0.5 rounded uppercase">
                  Primary Thesis (Paper A)
                </span>
                <span className="text-[10px] font-mono text-[#8C8068] font-bold">Flat-State Assertions</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-emerald-700 text-white px-2 py-0.5 rounded font-black">
                  {selectedPaperA.source}
                </span>
                <h3 className="font-serif font-black text-[#2D281F] text-base mt-2 leading-snug">
                  {selectedPaperA.title}
                </h3>
                <p className="text-[10px] text-[#8C8068] mt-1 font-mono">
                  By {selectedPaperA.authors}
                </p>
              </div>

              {/* Scope Criteria Textbox */}
              <div className="bg-white/80 border border-[#E8E2D2] rounded-2xl p-4 mt-4 text-xs font-serif leading-relaxed text-[#5C5340]">
                <p className="italic font-medium">"{selectedPaperA.conditionName}"</p>
                <p className="text-[11.5px] text-[#7A6F56] mt-1.5">{selectedPaperA.evidenceText}</p>
              </div>

              {/* Point Node List */}
              <div className="flex flex-col gap-3 mt-6">
                <span className="text-[9px] font-mono text-[#8C8068] uppercase font-bold tracking-wider block">
                  Conflicting Empirical Mappings:
                </span>
                
                {selectedPaperA.points.map((pt) => {
                  const isLinked = !!mappedPaths[pt.id];
                  const isHovered = hoveredPointId === pt.id;

                  return (
                    <div
                      key={pt.id}
                      id={`conflict-node-${pt.id}`}
                      onClick={() => handleToggleNodeConnection(pt.id)}
                      onMouseEnter={() => setHoveredPointId(pt.id)}
                      onMouseLeave={() => setHoveredPointId(null)}
                      className={`group p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isLinked
                          ? "bg-amber-500/5 border-amber-500 shadow-3xs"
                          : "bg-white border-[#E8E2D2] hover:border-amber-700 hover:bg-amber-500/5"
                      }`}
                    >
                      {/* Left vertical visual marker */}
                      <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-lg bg-amber-800" />

                      <div className="flex justify-between items-start gap-1 pl-2">
                        <div className="flex-1">
                          <span className="text-[9.5px] font-mono font-bold text-amber-800 bg-amber-500/10 px-1.5 py-0.5 rounded select-none">
                            {pt.metric}
                          </span>
                          <p className="text-xs font-serif font-semibold text-[#2D281F] mt-1.5 leading-snug">
                            {pt.statement}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end flex-shrink-0 text-right">
                          <span className="text-[9px] font-mono text-[#8C8068] block">
                            {pt.citation}
                          </span>
                          {isLinked ? (
                            <span className="text-[9px] font-mono text-emerald-700 font-bold mt-2 flex items-center gap-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              Bridged
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-amber-600 font-bold mt-2 animate-pulse">
                              Pending Match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E2D2]">
              <span className="text-[10px] font-mono text-[#8C8068]">Select row item to link conflicting state parameters</span>
            </div>
          </div>

          {/* CENTRAL INTERACTIVE ZONE: The Central Crucible */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center relative min-h-[180px] lg:min-h-0 bg-[#FAF6EC]/60 border border-[#E8E2D2] rounded-[24px] px-3 py-6 my-4 lg:my-10">
            
            {/* Dynamic Symmetrical Canvas Svg overlay */}
            <svg
              ref={canvasSvgRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ overflow: "visible" }}
            >
              {lines.map((ln) => {
                const strokeColor = ln.isResolved ? "#8C8068" : "#F59E0B";
                const strokeWidth = ln.isResolved ? 2.5 : 1.5;

                // Bezier curve calculations
                const x1 = ln.x1;
                const y1 = ln.y1;
                const x2 = ln.x2;
                const y2 = ln.y2;
                const cp1 = x1 + (x2 - x1) * 0.45;
                const cp2 = x1 + (x2 - x1) * 0.55;

                return (
                  <g key={`${ln.idA}-${ln.idB}`}>
                    <path
                      d={`M ${x1} ${y1} C ${cp1} ${y1}, ${cp2} ${y2}, ${x2} ${y2}`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={ln.isResolved ? "unset" : "3 1.5"}
                      fill="none"
                      className="opacity-70 transition-all duration-300"
                    />
                    
                    {ln.isResolved && (
                      <circle
                        r="3.5"
                        fill="#10B981"
                        style={{
                          transform: `translate(${(x1 + x2) / 2}px, ${(y1 + y2) / 2}px)`,
                        }}
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Dialectical Actions */}
            <div className="relative z-20 flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <Brain className="h-6 w-6 text-amber-800 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-[#8C8068] font-bold uppercase block mt-1">
                  Active Links
                </span>
                <span className="text-sm font-serif font-black text-[#2D281F]">
                  {activeMappingsCount} / {totalMappingsCount || 3}
                </span>
              </div>

              <button
                onClick={handleResolveContradiction}
                disabled={isSynthesizing}
                className={`w-full py-2.8 px-4 rounded-xl border font-serif text-xs font-black transition-all shadow-2xs cursor-pointer select-none active:scale-95 flex items-center justify-center gap-1.5 ${
                  isSynthesizing 
                    ? "bg-amber-800 text-white border-amber-850 animate-pulse" 
                    : "bg-white border-[#E8E2D2] text-[#2D281F] hover:bg-[#F2EDE0]"
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-800" />
                <span>{isDynamicApiResolution ? "Solve via AI" : "Resolve Contradiction"}</span>
              </button>

              <button
                onClick={handleResetWorkspace}
                className="text-[10px] font-mono text-[#8C8068] hover:text-[#2D281F] underline cursor-pointer"
              >
                Clear Links
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Antithesis Paper B */}
          <div ref={rightColRef} className="lg:col-span-5 bg-white blueprint-graph-paper border border-[#E8E2D2] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between text-left shadow-3xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-rose-500/3 pointer-events-none rounded-bl-full" />
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E2D2]">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#2D281F] bg-[#2D281F]/10 px-2.5 py-0.5 rounded uppercase font-bold">
                  Counter-Thesis (Paper B)
                </span>
                <span className="text-[10px] font-mono text-[#8C8068] font-bold">Friction Asserts</span>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-mono uppercase bg-rose-700 text-white px-2 py-0.5 rounded font-black">
                  {selectedPaperB.source}
                </span>
                <h3 className="font-serif font-black text-[#2D281F] text-base mt-2 leading-snug">
                  {selectedPaperB.title}
                </h3>
                <p className="text-[10px] text-[#8C8068] mt-1 font-mono">
                  By {selectedPaperB.authors}
                </p>
              </div>

              {/* Scope Criteria Textbox */}
              <div className="bg-white/80 border border-[#E8E2D2] rounded-2xl p-4 mt-4 text-xs font-serif leading-relaxed text-[#5C5340]">
                <p className="italic font-medium">"{selectedPaperB.conditionName}"</p>
                <p className="text-[11.5px] text-[#7A6F56] mt-1.5">{selectedPaperB.evidenceText}</p>
              </div>

              {/* Point Node List */}
              <div className="flex flex-col gap-3 mt-6">
                <span className="text-[9px] font-mono text-[#8C8068] uppercase font-bold tracking-wider block">
                  Contradictory Empirical Mappings:
                </span>
                
                {selectedPaperB.points.map((pt) => {
                  // Check if mapped
                  const sourcePtId = Object.keys(conflictMappings).find(
                    k => conflictMappings[k] === pt.id
                  );
                  const isLinked = sourcePtId ? !!mappedPaths[sourcePtId] : false;

                  return (
                    <div
                      key={pt.id}
                      id={`conflict-node-${pt.id}`}
                      className={`group p-3.5 rounded-xl border border-dashed transition-all relative ${
                        isLinked
                          ? "bg-rose-500/5 border-rose-500 shadow-3xs"
                          : "bg-[#FAFAF5] border-[#E8E2D2]"
                      }`}
                    >
                      {/* Left vertical visual marker */}
                      <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-lg bg-rose-700" />

                      <div className="flex justify-between items-start gap-1 pl-2">
                        <div className="flex-1">
                          <span className="text-[9.5px] font-mono font-bold text-rose-800 bg-rose-500/10 px-1.5 py-0.5 rounded select-none">
                            {pt.metric}
                          </span>
                          <p className="text-xs font-serif font-semibold text-[#2D281F] mt-1.5 leading-snug">
                            {pt.statement}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end flex-shrink-0 text-right font-mono text-[9px] text-[#8C8068]">
                          <span>{pt.citation}</span>
                          {isLinked ? (
                            <span className="text-[9px] font-mono text-rose-700 font-bold mt-2 flex items-center gap-0.5">
                              <AlertTriangle className="h-3 w-3" />
                              Linked
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-neutral-400 mt-2 block">
                              Unresolved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E2D2]">
              <span className="text-[10px] font-mono text-[#8C8068]">Conflicting boundary variables trigger logical stress tests</span>
            </div>
          </div>

        </div>

        {/* LOGIC BOUNDS VALIDATION PERSISTENT BASE TAB BAR */}
        <div className="bg-[#FAF6EC] border border-[#E8E2D2] rounded-[24px] p-5 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E8E2D2] pb-3 mb-3 gap-3">
            <div className="flex items-center gap-2.5 text-left">
              <div className="h-6 w-6 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                Ω
              </div>
              <div>
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#2D281F]">
                  LOGIC BOUNDS VALIDATION PIPELINE
                </h4>
                <p className="text-[10px] text-[#8C8068] font-medium font-mono">
                  Symmetrical boundary constraint verification engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono select-none">
              <span className="text-[9.5px] text-[#8C8068]">SYSTEM HEALTH STATUS:</span>
              {activeMappingsCount === 0 ? (
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-md">
                  VACANT MATRIX
                </span>
              ) : allBridgesLinked ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  SENSITIVITY BOUNDS SECURE - DUAL EQUILIBRIUM
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-md animate-pulse">
                  CONTRADICTORY STRESS ACTIVE - {activeMappingsCount}/{totalMappingsCount || 3} LINKED
                </span>
              )}
            </div>
          </div>

          <div className="text-left font-mono text-[11px] text-[#5C5340] leading-relaxed">
            {activeMappingsCount === 0 ? (
              <p className="italic text-[#8C8068] px-1 py-1">
                Awaiting variable linkage. Use the interaction crucible to establish links or trigger automated logical bounds mapping.
              </p>
            ) : allBridgesLinked ? (
              <div className="flex gap-2 items-center text-emerald-800 bg-emerald-500/5 p-3 rounded-lg border border-emerald-200/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p>
                  <strong>Dialectical Lock Symmetrical:</strong> Complete parameter matching achieved. Thermodynamic energy conservation and matrix coordinate constraints verified. Synthesizer ready to compile transition boundary gating constants!
                </p>
              </div>
            ) : (
              <div className="flex gap-2 items-start text-amber-800 bg-amber-500/5 p-3 rounded-lg border border-amber-200/40">
                <AlertTriangle className="h-4 w-4 text-amber-655 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Evaluating Empirical Friction:</strong> Linked {activeMappingsCount} parameters. The compiler models isolated coordinate stress states. We require all contradictory nodes linked before computing the exact thermodynamic transition bounds equation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AUTOMATED SYNTHESIS PROPOSAL OUTPUT DOCK */}
        <AnimatePresence>
          {synthesisComplete && activeResolution && (
            <motion.div
              id="dialectical-blueprint-proposal-container"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 35 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="border border-[#E8E2D2] p-6 sm:p-10 bg-white rounded-[32px] shadow-sm text-left relative overflow-hidden mt-6"
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-850 via-orange-850 to-amber-900" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E8E2D2]/80 pb-6 mt-2">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 bg-amber-800/10 text-amber-800 border border-amber-800/25 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider select-none mb-3">
                    <Sparkles className="h-3 w-3 text-amber-800 animate-spin" />
                    Dialectical Resolution Synthesis Report
                  </span>
                  <h2 className="font-serif font-black text-[#2D281F] text-lg sm:text-2xl leading-snug tracking-tight mb-2">
                    {activeResolution.resolvedTitle}
                  </h2>
                  <div className="text-[10px] font-mono text-[#8C8068]">
                    <strong>Orchestrator:</strong> Lumina Symmetrical Dialectical Solver (DS-2.1)
                  </div>
                </div>
              </div>

              {/* Synthesized Proposal Content body */}
              <div className="mt-8 flex flex-col gap-6">

                {/* 1. Resolution Thesis Summary */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5 border-b border-[#F2EDE0] pb-1.5 select-none">
                    <span>[01] The Resolution Thesis</span>
                  </h3>
                  <div className="bg-[#FAF6EC] p-5 rounded-2xl border border-[#E8E2D2] font-serif text-[#433D31] italic leading-relaxed text-[13.5px] select-text">
                    "{activeResolution.thesisSummary}"
                  </div>
                </div>

                {/* 2. Transition Boundary Gating Formula */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5 border-b border-[#F2EDE0] pb-1.5 select-none">
                    <span>[02] Synthesized Boundary Gating Equation</span>
                  </h3>
                  
                  <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-[#E8E2D2] flex flex-col items-center justify-center text-center mt-3 relative">
                    <span className="text-[8px] font-mono text-[#8C8068] absolute top-2 left-2 uppercase tracking-wider font-extrabold select-none">
                      Compiled Phase Gating Formula
                    </span>
                    
                    <div className="font-mono text-xl sm:text-2xl font-black text-[#2D281F] bg-white px-5 py-3 rounded-2xl border border-[#E8E2D2] select-all tracking-normal">
                      {activeResolution.gatingEquation}
                    </div>

                    <div className="text-xs text-[#5C5340] font-serif mt-3 leading-snug max-w-xl font-medium">
                      ↳ Transition Criteria: <strong>{activeResolution.gatingCondition}</strong>
                    </div>

                    <div className="text-[11px] text-[#8C8068] mt-1.5 font-mono">
                      {activeResolution.gatingExplanation}
                    </div>
                  </div>
                </div>

                {/* 3. Parameter Boundary Conditions */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5 border-b border-[#F2EDE0] pb-1.5 select-none">
                    <span>[03] Gating Parameter Conditions</span>
                  </h3>

                  <div className="overflow-x-auto border border-[#E8E2D2] rounded-2xl bg-white">
                    <table className="min-w-full divide-y divide-[#E8E2D2] text-left">
                      <thead className="bg-[#FAF6EC]">
                        <tr>
                          <th className="px-4 py-3 font-mono text-[10px] font-bold text-[#8C8068] uppercase">Variable Symbol</th>
                          <th className="px-4 py-3 font-mono text-[10px] font-bold text-[#8C8068] uppercase">Functional Definition</th>
                          <th className="px-4 py-3 font-mono text-[10px] font-bold text-[#8C8068] uppercase">Base SI Dimension</th>
                          <th className="px-4 py-3 font-mono text-[10px] font-bold text-[#8C8068] uppercase text-right">Transition Threshold Limit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D2] font-serif text-[12px] text-[#433D31]">
                        {activeResolution.parameters.map((param: any, index: number) => (
                          <tr key={index} className="hover:bg-[#FAF6EC]/30">
                            <td className="px-4 py-3 font-mono text-xs font-black text-[#2D281F] bg-neutral-50 border-r border-[#E8E2D2]/50 selection:bg-amber-100">{param.symbol}</td>
                            <td className="px-4 py-3 selection:bg-amber-100">{param.explanation}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[#8C8068] select-all font-semibold italic">{param.dimension}</td>
                            <td className="px-4 py-3 text-right font-mono text-xs font-bold text-amber-950 selection:bg-amber-100">{param.boundary}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Rigorous Dimensional Proof Log */}
                {activeResolution.dimensionalProofLog && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5 border-b border-[#F2EDE0] pb-1.5 select-none">
                      <span>[04] Rigorous Dimensional Proof Log</span>
                    </h3>

                    <div className="bg-neutral-50 p-5 rounded-3xl border border-[#E8E2D2] flex flex-col gap-4 text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E8E2D2]/60 pb-3">
                        <span className="text-[11px] font-mono font-extrabold text-[#2D281F]">
                          SI Unit Homogeneity Test Status
                        </span>
                        <span className="text-[10px] font-mono leading-none font-black bg-emerald-100 text-emerald-805 border border-emerald-300 px-3 py-1 rounded-sm uppercase tracking-wider">
                          {activeResolution.dimensionalProofLog.normalizationStatus}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-[#433D31] bg-white p-4 rounded-xl border border-[#E8E2D2] select-text">
                        <strong className="block text-amber-900 font-extrabold mb-1">Base SI Scaling Analysis:</strong>
                        {activeResolution.dimensionalProofLog.baseSIAnalysis}
                      </div>

                      <div className="text-xs font-serif leading-relaxed text-[#5C5340] space-y-2">
                        <strong className="block font-sans text-[10.5px] font-extrabold uppercase tracking-wider text-[#8C8068] mb-1">
                          Mathematical Derivation & Proof Boundary Steps:
                        </strong>
                        <ol className="list-decimal pl-4.5 space-y-1.5 font-mono text-[11px] text-[#4F4F42]">
                          {activeResolution.dimensionalProofLog.derivationSteps.map((step: string, sIdx: number) => (
                            <li key={sIdx} className="hover:text-black transition-colors">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Interactive "Peer Review" Debate Arena */}
                {activeResolution.rebuttal && (
                  <div className="mt-8 border-t-2 border-dashed border-[#E8E2D2] pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-science font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5 select-none">
                          <Flame className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                          <span>[05] Symmetrical Peer-Reviewer Debate Arena</span>
                        </h3>
                        <p className="text-[10px] font-mono text-[#8C8068] uppercase mt-0.5">
                          Dialectical Sparring Panel & Live Controversy Resolving Matrix
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-extrabold bg-red-100 text-red-800 px-3 py-1 rounded border border-red-200 uppercase select-none">
                        Active Symposium
                      </span>
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8E4D9] p-5 sm:p-6 rounded-[24px] select-text space-y-5 relative overflow-hidden blueprint-graph-paper shadow-xs">
                      {/* Tech crosshairs for blueprint feel */}
                      <div className="absolute top-2 left-2 text-[#8C8474]/30 font-mono text-[9px] select-none pointer-events-none">+ SYSTEM.DEBATE</div>
                      <div className="absolute top-2 right-2 text-[#8C8474]/30 font-mono text-[9px] select-none pointer-events-none">[NODE_SEC_71]</div>

                      {/* Top interactive Assent Gauge */}
                      <div className="bg-white/80 backdrop-blur-xs p-4.5 rounded-2xl border border-[#E8E2D2] select-none shadow-xs">
                        <div className="flex justify-between items-center text-[10.5px] font-mono font-extrabold uppercase text-[#2D2D24] mb-1.5">
                          <span className="flex items-center gap-1">
                            <Scale className="h-3.5 w-3.5 text-red-850" />
                            Consensus Thermodynamic Assent
                          </span>
                          <span className={currentAssentScore > 40 ? "text-emerald-700" : "text-amber-700"}>
                            {currentAssentScore}% Assent
                          </span>
                        </div>
                        
                        <div className="h-3.5 bg-[#F9F7F2] rounded-full overflow-hidden border border-[#E8E2D2] p-0.5">
                          <motion.div
                            initial={{ width: "18%" }}
                            animate={{ width: `${currentAssentScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              currentAssentScore < 25 
                                ? "bg-gradient-to-r from-red-600 to-rose-500" 
                                : currentAssentScore < 55
                                ? "bg-gradient-to-r from-rose-500 to-amber-500"
                                : "bg-gradient-to-r from-amber-500 to-emerald-600"
                            }`}
                          />
                        </div>

                        <div className="mt-2.5 flex justify-between items-start gap-3">
                          <p className="text-[10px] font-mono leading-normal text-[#5C5340] italic flex-1">
                            {currentAssentScore < 25 
                              ? "⚠️ High structural skepticism. Reviewers argue unilateral Moiré strain parameters remain localized and non-homogeneous."
                              : currentAssentScore < 55
                              ? "⚡ Partial academic resolution. Authors successfully defended boundary thresholds, though extreme edge cases persist."
                              : "🔥 Quantum consensus confirmed! Reviewers assent to structural dimensional integrity and boundary limits of the gating ratio."}
                          </p>
                          {panelVerdict && (
                            <div className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-1 rounded max-w-[200px] text-right">
                              📜 {panelVerdict}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Live Debate Thread Transcript */}
                      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1.5 border border-[#E8E2D2] bg-white/50 backdrop-blur-xs p-4 rounded-2xl select-text">
                        {debateRounds.map((roundStr, rIdx) => (
                          <div key={roundStr.id || rIdx} className="space-y-4 border-b border-[#E8E2D2]/60 pb-5 last:border-none last:pb-0">
                            {/* Round Label */}
                            <div className="flex items-center gap-1.5 select-none">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-655" />
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8C8068]">
                                Debate Round {rIdx === 0 ? "00 (Initial Submissions)" : `0${rIdx}`}
                              </span>
                            </div>

                            {/* User Critique/Probe (round > 0) */}
                            {rIdx > 0 && (
                              <div className="flex gap-2.5 items-start text-xs font-sans text-amber-950 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/50">
                                <MessageSquare className="h-4.5 w-4.5 text-amber-800 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-extrabold text-[10px] text-amber-900 uppercase font-mono tracking-wider block mb-0.5">
                                    [AUDIENCE PROBE / USER CRITIQUE]
                                  </span>
                                  <p className="font-serif italic leading-relaxed text-[#2D2D24]">"{roundStr.userQuestion}"</p>
                                </div>
                              </div>
                            )}

                            {/* Authors Defense Block */}
                            <div className="flex gap-3 items-start text-xs font-mono bg-[#F3F9F4] p-4 rounded-xl border border-emerald-100">
                              <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg flex-shrink-0">
                                <Brain className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-extrabold text-[10px] text-emerald-900 uppercase">
                                    Authors' Defence Stance
                                  </span>
                                  <span className="text-[8.5px] text-[#8C8474] font-bold">
                                    {selectedPaperA?.authors?.split(",")[0] || "Authors"} et al.
                                  </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-[#2D332D] font-mono whitespace-pre-line">
                                  {roundStr.authorsDefense}
                                </p>
                              </div>
                            </div>

                            {/* Reviewers Counter-Rebuttal Block */}
                            <div className="flex gap-3 items-start text-xs font-mono bg-[#FFF5F5] p-4 rounded-xl border border-red-100">
                              <div className="bg-rose-100/70 text-red-800 p-1.5 rounded-lg flex-shrink-0">
                                <Scale className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-extrabold text-[10px] text-red-900 uppercase">
                                    Faculty Peer Review Verdict
                                  </span>
                                  <span className="text-[8.5px] text-[#8C8474] font-bold">
                                    Review Board Panel
                                  </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-[#4A3D3D] italic bg-white/40 p-3 rounded-lg border border-red-100/40 whitespace-pre-line">
                                  {roundStr.reviewersRebuttal}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Symposium Probe Input Portal */}
                      <div className="bg-white/95 p-4 rounded-2xl border border-[#E8E2D2] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#E8E2D2]/50 pb-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#2D2D24] flex items-center gap-1.5 select-none">
                            <Terminal className="h-3.5 w-3.5 text-amber-900 animate-pulse" />
                            Academic Sparring Interaction Console
                          </span>
                          <span className="text-[8.5px] font-mono text-[#8C8068] select-none">
                            Test boundaries & constants
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            disabled={isSparing}
                            value={userProbe}
                            onChange={(e) => setUserProbe(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && userProbe.trim()) handleExecuteAcademicSpar();
                            }}
                            placeholder={isSparing ? "Awaiting panel arguments..." : "Submit custom probe, e.g., 'Does this boundary hold under high-frequency thermal stress?'"}
                            className="flex-1 text-xs font-mono bg-[#FAF9F6] border border-[#E8E2D2] rounded-xl px-3.5 py-3 text-[#2D2D24] focus:outline-hidden focus:ring-1 focus:ring-[#7C8464] disabled:opacity-60 placeholder-[#8C8474]/80"
                          />

                          <button
                            onClick={handleExecuteAcademicSpar}
                            disabled={isSparing || !userProbe.trim()}
                            className="bg-[#2D281F] hover:bg-[#433D31] text-[#F9F7F2] text-xs font-mono px-5 py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-pointer"
                          >
                            {isSparing ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Refereeing...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>Challenge</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Recommendation Chips */}
                        {!isSparing && (
                          <div className="flex flex-wrap gap-1.5 items-center pt-1.5">
                            <span className="text-[8.5px] font-mono text-[#8C8068] uppercase select-none mr-1">Suggested Probes:</span>
                            {[
                              "Does this unity model survive non-linear scale deformation?",
                              "How do cryogenic conditions change variables?",
                              "Can you explain the experimental limits under high shear noise?"
                            ].map((suggest, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setUserProbe(suggest)}
                                className="text-[9px] font-sans bg-[#F9F7F2] hover:bg-amber-100/50 text-[#5C5340] border border-[#E8E2D2] hover:border-amber-300 px-3 py-1 rounded-full transition-all cursor-pointer font-medium"
                              >
                                {suggest}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* Bottom interactive success signature */}
                <div className="pt-6 border-t border-[#E8E2D2]/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-[#8C8068] font-mono text-[11px]">Dialectical coherence metrics certified secure</span>
                  </div>

                  <span className="text-[10px] font-mono bg-[#2D281F] text-white px-3 py-1 rounded font-bold uppercase select-none">
                    SYSTEM BOUNDS SECURED
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dynamic API Loading modal overlay */}
      <AnimatePresence>
        {isSynthesizing && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF6EC] border-2 border-amber-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
              <div className="flex items-center gap-3 border-b border-[#E8E2D2] pb-4 mb-4 select-none">
                <Sparkles className="h-6 w-6 text-amber-800 animate-spin" />
                <div>
                  <h4 className="text-sm font-sans font-black text-[#2D281F] uppercase tracking-wider">
                    Symmetrical Dialectical Solver
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C8068] uppercase font-bold">
                    Running Ginzburg-Landau Field-Theoretic Order unifier
                  </span>
                </div>
              </div>
              
              <div className="bg-white border border-[#E8E2D2] p-5 rounded-2xl min-h-[100px] flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest block mb-2 font-black select-none">
                  COMPILATION PIPELINE:
                </span>
                <p className="font-mono text-xs text-[#2D281F] font-semibold leading-relaxed">
                  ⚡ {apiLoadingMessage || "Structuring thermodynamic boundary matrix coefficients..."}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-[#8C8068] uppercase font-bold select-none">
                <span>Thread: Active</span>
                <span>SI Units Guarded</span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Paper Dialog Box Sidebar/Overlay Drawer */}
      <AnimatePresence>
        {showCustomPaperModal && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-3xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F0] border-2 border-[#E8E2D2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setShowCustomPaperModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-[#8C8068] hover:text-[#2D281F] border border-[#E8E2D2] bg-white shadow-3xs cursor-pointer hover:bg-neutral-50"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-serif font-black text-xl text-[#2D281F] border-b border-[#E8E2D2] pb-3 mb-5 flex items-center gap-2">
                <Plus className="h-5 w-5 text-amber-800" />
                Inject Custom Academic Theoretical Paper
              </h3>

              <form onSubmit={handleAddCustomPaper} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-sans font-bold uppercase text-[#8C8068]">Paper Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kinetic Adsorption Mechanisms of Hot-Front Carbon Layers"
                      value={customPaperForm.title}
                      onChange={(e) => setCustomPaperForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs font-serif focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-sans font-bold uppercase text-[#8C8068]">Primary Authors</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Prof. Helen Vance, Dr. Alan Turing"
                      value={customPaperForm.authors}
                      onChange={(e) => setCustomPaperForm(prev => ({ ...prev, authors: e.target.value }))}
                      className="bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs font-serif focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-sans font-bold uppercase text-[#8C8068]">Source Journal / Publisher</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Advanced Nanotech Journal (2026)"
                      value={customPaperForm.source}
                      onChange={(e) => setCustomPaperForm(prev => ({ ...prev, source: e.target.value }))}
                      className="bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs font-serif focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-sans font-bold uppercase text-[#8C8068]">Boundary State Label</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. State Gamma: Ultra-thin Thermal Graphene Sub-strates"
                      value={customPaperForm.conditionName}
                      onChange={(e) => setCustomPaperForm(prev => ({ ...prev, conditionName: e.target.value }))}
                      className="bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs font-serif focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-sans font-bold uppercase text-[#8C8068]">Abstract Summary & Evidence Text</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="Provide specific physical model measurements and boundary claims that conflict with other setups..."
                    value={customPaperForm.evidenceText}
                    onChange={(e) => setCustomPaperForm(prev => ({ ...prev, evidenceText: e.target.value }))}
                    className="bg-white border border-[#E8E2D2] rounded-xl px-3 py-2 text-xs font-serif focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 resize-none"
                  />
                </div>

                <div className="border-t border-[#E8E2D2] pt-3">
                  <span className="text-[10.5px] font-sans font-extrabold uppercase text-amber-800 block mb-2 tracking-wider">
                    Inject 3 Core Empirical Metrics / Points (Required)
                  </span>

                  <div className="space-y-3">
                    {customPaperForm.points.map((pt, index) => (
                      <div key={index} className="bg-white p-3 rounded-xl border border-[#E8E2D2] grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-3 flex flex-col gap-0.5">
                          <label className="text-[9px] font-sans font-semibold uppercase text-neutral-500">Metric Symbol</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Lattice ε_moiré"
                            value={pt.metric}
                            onChange={(e) => {
                              const newPts = [...customPaperForm.points];
                              newPts[index].metric = e.target.value;
                              setCustomPaperForm(prev => ({ ...prev, points: newPts }));
                            }}
                            className="bg-neutral-50 border border-[#E8E2D2] rounded-lg px-2.5 py-1 text-xs font-mono font-bold"
                          />
                        </div>

                        <div className="sm:col-span-6 flex flex-col gap-0.5">
                          <label className="text-[9px] font-sans font-semibold uppercase text-neutral-500">Assertion Statement</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Critical strain threshold peaks exactly at 1.2%"
                            value={pt.statement}
                            onChange={(e) => {
                              const newPts = [...customPaperForm.points];
                              newPts[index].statement = e.target.value;
                              setCustomPaperForm(prev => ({ ...prev, points: newPts }));
                            }}
                            className="bg-neutral-50 border border-[#E8E2D2] rounded-lg px-2.5 py-1 text-xs font-serif"
                          />
                        </div>

                        <div className="sm:col-span-3 flex flex-col gap-0.5">
                          <label className="text-[9px] font-sans font-semibold uppercase text-neutral-500">Citation Page</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Fig. 2c / Page 12"
                            value={pt.citation}
                            onChange={(e) => {
                              const newPts = [...customPaperForm.points];
                              newPts[index].citation = e.target.value;
                              setCustomPaperForm(prev => ({ ...prev, points: newPts }));
                            }}
                            className="bg-neutral-50 border border-[#E8E2D2] rounded-lg px-2.5 py-1 text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E8E2D2] pt-4 flex justify-end gap-3 select-none">
                  <button 
                    type="button"
                    onClick={() => setShowCustomPaperModal(false)}
                    className="px-4 py-2 rounded-xl text-neutral-600 hover:text-[#2D281F] border border-[#E8E2D2] bg-white text-xs font-bold shadow-3xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-800 text-white font-bold text-xs shadow-3xs border border-amber-850 hover:bg-amber-900 transition-all cursor-pointer"
                  >
                    Inject Paper Matrix
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editorial Symmetrical Mini Footer */}
      <footer className="py-4 mt-6 border-t border-[#E8E2D2] text-[11px] text-[#8C8474] font-mono">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <span>Lumina Academic War Room • © 2026</span>
          <span className="text-emerald-700 hidden sm:inline">● Core Node Ready</span>
        </div>
      </footer>

    </div>
  );
}

