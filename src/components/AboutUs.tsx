import React from "react";
import { 
  X, 
  ArrowLeft, 
  Mail, 
  ShieldAlert, 
  Compass, 
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import SympheryIcon from "./SympheryIcon";

interface AboutUsProps {
  onClose: () => void;
}

export default function AboutUs({ onClose }: AboutUsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#F9F7F2] overflow-y-auto flex flex-col antialiased font-sans text-[#434338]"
    >
      {/* Symmetrical Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E8E4D9] px-6 py-4 sm:px-10 flex justify-between items-center shadow-3xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="btn-secondary !p-2 -ml-2"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <SympheryIcon className="h-6 w-6" />
            <h1 className="text-lg font-science font-black tracking-tight text-[#2D2D24] uppercase">
              About Lumina
            </h1>
            <span className="badge-natural">
              Corporate Dossier & Mission
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="btn-secondary !p-2 bg-white shadow-3xs"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 sm:py-16 flex flex-col gap-10 text-left">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-4 mb-2">
          <SympheryIcon className="h-16 w-16" />
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D2D24] leading-tight">
            Transducing Complexity into Elegant Insight
          </h2>
          <p className="text-sm font-medium text-[#8C8474] max-w-lg leading-relaxed">
            Lumina is an experimental, cross-disciplinary scientific engine designed to bridge the vocabularies of academic fields and engineering practices.
          </p>
        </div>

        {/* Core Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mission & Vision Card */}
          <div className="card-natural flex flex-col gap-4 !p-6 sm:!p-8 !shadow-3xs">
            <div className="w-10 h-10 rounded-xl bg-[#7C8464]/10 text-[#7C8464] flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-extrabold text-lg text-[#2D2D24]">
              Our Mission
            </h3>
            <p className="text-xs text-[#5A5A4A] leading-relaxed">
              We believe that breakthroughs happen at the boundary layers between disciplines. Lumina is built to dissolve terms-of-art barriers, mapping complex biochemical, physical, and thermodynamic concepts into unified, universally understandable computational formulations.
            </p>
          </div>
 
          {/* Technical Adaptation Card */}
          <div className="card-natural flex flex-col gap-4 !p-6 sm:!p-8 !shadow-3xs">
            <div className="w-10 h-10 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-extrabold text-lg text-[#2D2D24]">
              Intellectual Scaffold
            </h3>
            <p className="text-xs text-[#5A5A4A] leading-relaxed">
              By combining AI-driver structural abstractions, rigorous literature gap analysis, and interactive peer review scenarios, we create clean visual frameworks. Software developers and researchers can now discover objective, non-obvious conceptual parallels and structural comparisons between natural systems and computational architectures.
            </p>
          </div>

        </div>

        {/* Comprehensive Legal Disclaimer Section */}
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-[32px] p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-amber-200 pb-3">
            <ShieldAlert className="h-5 w-5 text-amber-800 flex-shrink-0 animate-pulse" />
            <h3 className="font-serif font-extrabold text-[#2D2D24] text-base">
              Comprehensive Legal Disclaimer
            </h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-[#5C5340] leading-relaxed mt-1">
            <p>
              This platform is an AI-powered educational resource designed to simplify and unify academic research papers. The synthesized explanations, dimensional scaling derivations, functional analogies, and jargon breakdowns are generated automatically using sophisticated language models and should be utilized strictly for general informational and educational purposes.
            </p>
            <p>
              Any equations, coefficient matrices, or physical boundary states produced by our engines do not constitute professional, clinical, legal, or definitive scientific authority, design advice, or engineering certification. We make no guarantees of peer assent, mathematical completeness, or material accuracy. Users are encouraged to corroborate all theoretical deductions directly with original publisher publications.
            </p>
          </div>
        </div>

        {/* Contact, Team & Support Section */}
        <div className="card-natural !p-6 sm:!p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 !shadow-3xs">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif font-extrabold text-[#2D2D24] text-md">
              Support & Academic Inquiry
            </h3>
            <p className="text-xs text-[#8C8474] leading-relaxed">
              Have feedback, support tickets, or want to collaborate with Lumina ? Reach out to us below.
            </p>
          </div>
 
          <div className="flex flex-col gap-1.5 sm:text-right flex-shrink-0">
            <a 
              href="mailto:aliasgertalib@gmail.com" 
              className="btn-primary !px-5"
            >
              <Mail className="h-4 w-4" />
              <span>aliasgertalib@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Symmetrical Footer within the Dedicated About Page */}
        <div className="border-t border-[#E8E4D9] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <span className="text-[11px] text-[#8C8474] font-mono">
            © {new Date().getFullYear()} Lumina Research Labs. All rights reserved. .
          </span>
         
        </div>

      </main>
    </motion.div>
  );
}
