import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Plus,
  GitMerge,
  Sparkle,
  ChevronRight,
  GitCompare,
  Layers,
  AlertCircle,
  Search
} from "lucide-react";
import { LivePaper } from "../types";

interface FusionLabProps {
  showFusionLab: boolean;
  setShowFusionLab: (val: boolean) => void;
  fusionPaperA: LivePaper | null;
  setFusionPaperA: (paper: LivePaper | null) => void;
  fusionPaperB: LivePaper | null;
  setFusionPaperB: (paper: LivePaper | null) => void;
  livePapers: LivePaper[];
}

export const FusionLab: React.FC<FusionLabProps> = ({
  showFusionLab,
  setShowFusionLab,
  fusionPaperA,
  setFusionPaperA,
  fusionPaperB,
  setFusionPaperB,
  livePapers
}) => {
  const [fusionLoading, setFusionLoading] = useState(false);
  const [fusionStatusText, setFusionStatusText] = useState("");
  const [fusionResult, setFusionResult] = useState<any | null>(null);
  const [fusionError, setFusionError] = useState<string | null>(null);
  const [expandedFusionSection, setExpandedFusionSection] = useState<string | null>("abstract");
  const [fusionSearchQuery, setFusionSearchQuery] = useState("");
  const [selectingSlot, setSelectingSlot] = useState<"A" | "B" | null>(null);

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
      "Analyzing core parameters and findings of both papers...",
      "Aligning literature intersections & detecting systemic research gaps...",
      "Resolving conceptual and methodological friction points...",
      "Synthesizing integrated theoretical model & parameter mappings...",
      "Detailing boundary assumptions, constraints, and potential confounders...",
      "Assembled objective Literature Integration Proposal report."
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

  return (
    <AnimatePresence>
      {showFusionLab && (
        <div className="fixed inset-0 z-50 bg-[#F9F7F2] overflow-y-auto flex flex-col antialiased">
          {/* Lab Top Navbar */}
          <nav className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-5 sm:px-10 border-b border-[#E8E4D9] flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
              <div className="bg-[#7C8464] text-white p-2.5 rounded-xl">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-serif font-bold text-[#2D2D24] flex items-center gap-2">
                  Literature Integration Lab <span className="text-[10px] bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20 px-2 py-0.5 rounded-full font-mono uppercase font-black font-semibold">Gap Analysis</span>
                </h1>
                <p className="text-[11px] sm:text-xs text-[#8C8474] font-medium hidden sm:block">
                  Analyze literature intersections, detect fundamental research gaps, and build integrated frameworks
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
                <div className="text-[10px] font-mono tracking-wider uppercase text-[#8C8474] font-bold mb-2 flex items-center gap-1.5 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
                  Slot Alpha (Paper A)
                </div>
                
                {fusionPaperA ? (
                  <div className="flex-1 bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#7C8464]/40 transition-colors text-left">
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
                    {fusionLoading ? "INTEGRATING" : "INTEGRATION"}
                  </span>
                </div>

                {/* Horizontal Connection Line overlay for large displays */}
                <div className="hidden lg:block absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8E4D9] to-transparent z-0 pointer-events-none" />
              </div>

              {/* Paper B Slot */}
              <div className="lg:col-span-5 h-full flex flex-col">
                <div className="text-[10px] font-mono tracking-wider uppercase text-[#8C8474] font-bold mb-2 flex items-center gap-1.5 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
                  Slot Beta (Paper B)
                </div>

                {fusionPaperB ? (
                  <div className="flex-1 bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#7C8464]/40 transition-colors text-left">
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
                <Layers className={`h-4.5 w-4.5 ${fusionLoading ? "animate-spin" : ""}`} />
                <span>Perform Literature Integration &amp; Gap Analysis</span>
              </button>
              <p className="text-[10px] font-mono text-[#8C8474] text-center uppercase tracking-wider">
                Maps parameter intersections, reveals analytical gaps, and builds an integrated framework proposal
              </p>
            </div>

            {/* Loading State Overlay Section */}
            {fusionLoading && (
              <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-10 flex flex-col items-center justify-center text-center shadow-xs py-14 max-w-2xl mx-auto w-full">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#7C8464] border-[#7C8464]/10 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-[#7C8464]/20 animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-[#1E2019] text-base mb-1">Integrating Source Research...</h3>
                <p className="text-xs text-[#8C8474] font-mono animate-pulse uppercase tracking-wider">{fusionStatusText}</p>
              </div>
            )}

            {/* Error Box */}
            {fusionError && (
              <div className="bg-red-50/50 border border-red-200 text-red-800 p-5 rounded-2xl max-w-2xl mx-auto w-full text-xs leading-relaxed flex items-center gap-3 text-left">
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
                  <div className="flex-1 text-left">
                    <span className="inline-flex items-center gap-1.5 bg-[#7C8464]/10 text-[#7C8464] border border-[#7C8464]/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider select-none mb-3">
                      <GitMerge className="h-3 w-3 text-[#7C8464]" />
                      Integrated Literature Proposal &amp; Research Gap Analysis Report
                    </span>
                    <h2 className="font-serif font-bold text-[#2D2D24] text-xl sm:text-2xl lg:text-3xl tracking-tight leading-tight mb-2">
                      {fusionResult.title}
                    </h2>
                    <div className="flex flex-col gap-1 text-[11px] font-mono text-[#8C8474]">
                      <div>
                        <strong>Lead System:</strong> Symphery Integration Engine (G-3.5)
                      </div>
                      <div>
                        <strong>Source Material:</strong> 
                        <span className="text-[#5A5A4A] italic ml-1">
                          A: "{fusionPaperA?.title}" and B: "{fusionPaperB?.title}"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion List Container */}
                <div className="flex flex-col gap-4 text-left">
                  
                  {/* Abstract Accordion */}
                  <div className="border border-[#E8E4D9] rounded-2xl overflow-hidden bg-white shadow-3xs">
                    <button
                      onClick={() => setExpandedFusionSection(expandedFusionSection === "abstract" ? null : "abstract")}
                      className="w-full px-5 py-4 flex justify-between items-center bg-[#FDFBF7] hover:bg-[#F9F7F2]/40 text-[#2D2D24] border-b border-[#E8E4D9] text-left transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-serif text-[#7C8464] font-black text-xs md:text-sm">01</span>
                        <span className="font-serif font-bold text-sm md:text-base">Literature Analysis &amp; Core Synthesized Idea</span>
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
                        <span className="font-serif font-bold text-sm md:text-base">Detailed Integration Pathway &amp; Research Gap</span>
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
                            <p className="font-medium text-[#2D2D24] pb-2 border-b border-[#F2EDE4] flex items-center gap-1.5 text-left">
                              <GitCompare className="h-4 w-4 text-[#7C8464]" />
                              Identified Integration Vector: {fusionResult.pathway}
                            </p>
                            <div className="text-left">
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
                        <span className="font-serif font-bold text-sm md:text-base">Integrated Parameter Framework &amp; Model</span>
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
                            
                            {/* Parameter Mapping Card */}
                            <div className="bg-[#F2EDE4]/60 border border-[#E8E4D9] p-4.5 rounded-xl font-mono text-center flex flex-col gap-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-1 px-2 bg-[#7C8464]/10 text-[#7C8464] border-l border-b border-[#E8E4D9] text-[9px] uppercase tracking-wider font-extrabold select-none">
                                Theoretical Parameter Interface Mapping
                              </div>
                              <div className="text-xs sm:text-sm md:text-base font-black tracking-wide text-[#2D2D24] py-2">
                                {renderSynthesizedTextWithBadges(fusionResult.methodology.parameter_alignment || fusionResult.methodology.formula)}
                              </div>
                              <div className="text-[10px] text-[#8C8474] font-serif italic mt-1 font-medium text-center">
                                Sober operational mapping of intersecting dimensional variables
                              </div>
                            </div>

                            <div className="leading-relaxed text-xs sm:text-sm text-[#434338] text-left">
                              {renderSynthesizedTextWithBadges(fusionResult.methodology.description)}
                            </div>

                            {/* Target Steps */}
                            <div className="flex flex-col gap-3.5 mt-2">
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 flex items-center gap-1.5 text-left">
                                <Layers className="h-3.5 w-3.5 text-[#7C8464]" />
                                Empirical Steps to Test or Validate the Integrated Parameter Model
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {fusionResult.methodology.architecture_steps.map((step: string, sIdx: number) => (
                                  <div key={sIdx} className="bg-[#FDFBF7] border border-[#E8E4D9]/80 p-4 rounded-xl flex gap-3 items-start select-none text-left">
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
                        <span className="font-serif font-bold text-sm md:text-base">Confounders, Limitations, &amp; Parameter Constraints</span>
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
                            
                            <div className="leading-relaxed text-xs sm:text-sm text-[#434338] text-left">
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] mb-2.5 flex items-center gap-1.5 text-left">
                                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                Underlying Theoretical Bounds &amp; Scope Assumptions
                              </h4>
                              <div className="p-4 bg-red-50/20 border border-red-100 rounded-xl font-serif text-[#434338] italic text-left">
                                {renderSynthesizedTextWithBadges(fusionResult.bounds.constraints)}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-left">
                              <div>
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 mb-2.5 text-left">
                                  Critical Limitations of Integrated Model
                                </h4>
                                <ul className="list-disc list-inside text-xs text-[#5A5A4A] space-y-2 leading-relaxed text-left">
                                  {fusionResult.bounds.limitations.map((lim: string, lIdx: number) => (
                                    <li key={lIdx}>{lim}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D2D24] border-b border-[#F2EDE4] pb-1.5 mb-2.5 text-left">
                                  Potential Empirical Confounders &amp; Failures
                                </h4>
                                <ul className="list-disc list-inside text-xs text-[#5A5A4A] space-y-2 leading-relaxed font-mono text-left">
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
                  <div className="px-6 py-5 border-b border-[#E8E4D9] bg-white flex justify-between items-center text-left">
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
                      const aggregate = livePapers;

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
                            <div className="flex items-center justify-between gap-1.5 flex-wrap text-left">
                              <div className="flex gap-2">
                                <span className="text-[9px] font-mono tracking-wide uppercase bg-[#5A5A4A] text-white px-1.5 py-0.5 rounded font-bold">
                                  {paper.source_name}
                                </span>
                                <span className="text-[9px] font-mono text-[#8C8474] truncate max-w-[200px]">
                                  by {paper.authors}
                                </span>
                              </div>
                              {isSelectedSelf && (
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#7C8464] ml-auto">
                                  Current Selection
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] leading-snug text-left">
                              {paper.title}
                            </h4>
                            <p className="text-[10px] text-[#5A5A4A] line-clamp-2 leading-relaxed text-left">
                              {paper.abstract}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="px-6 py-4 border-t border-[#E8E4D9] bg-white flex justify-between items-center text-[10px] font-mono text-[#8C8474] font-medium select-none uppercase tracking-wider">
                    <span>Selection Repository Engine</span>
                    <span>{livePapers.length} total curated items</span>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};
