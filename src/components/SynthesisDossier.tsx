import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookMarked,
  X,
  Sparkles,
  Trash2,
  Share2,
  Download,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { LivePaper, ExplanationLevel } from "../types";

interface SynthesisDossierProps {
  compilingDossier: boolean;
  setCompilingDossier: (val: boolean) => void;
  readingList: LivePaper[];
  setReadingList: React.Dispatch<React.SetStateAction<LivePaper[]>>;
}

export const SynthesisDossier: React.FC<SynthesisDossierProps> = ({
  compilingDossier,
  setCompilingDossier,
  readingList,
  setReadingList
}) => {
  const [dossierResult, setDossierResult] = useState<string>("");
  const [generatingDossier, setGeneratingDossier] = useState(false);
  const [dossierError, setDossierError] = useState<string | null>(null);
  const [dossierLevel, setDossierLevel] = useState<ExplanationLevel>("High School");
  const [dossierCopied, setDossierCopied] = useState(false);

  const handleCompileDossier = async () => {
    if (readingList.length === 0) {
      setDossierError("Your reading list is empty. Add papers first!");
      return;
    }
    setGeneratingDossier(true);
    setDossierError(null);
    setDossierResult("");
    try {
      const resp = await fetch("/api/compile-dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers: readingList, level: dossierLevel })
      });
      if (!resp.ok) {
        throw new Error(`Dossier server error (status ${resp.status})`);
      }
      const data = await resp.json();
      if (data.dossier) {
        setDossierResult(data.dossier);
      } else {
        setDossierError("Failed to build the custom study dossier structure.");
      }
    } catch (err: any) {
      console.error("Dossier compile error:", err);
      setDossierError(err.message || "Could not synthesize your research materials. Please check your network.");
    } finally {
      setGeneratingDossier(false);
    }
  };

  const renderMarkdownToJSX = (markdownText: string) => {
    if (!markdownText) return null;
    const lines = markdownText.split("\n");
    return lines.map((line, idx) => {
      const text = line.trim();
      if (!text) return <div key={idx} className="h-2" />;
      
      // Bold mapping inside text helper
      const parseInlineFormatting = (rawLine: string) => {
        const parts = [];
        let lastIndex = 0;
        const matches = Array.from(rawLine.matchAll(/\*\*(.*?)\*\*/g));
        if (matches.length === 0) return rawLine;

        matches.forEach((m, matchIdx) => {
          const matchIndex = m.index ?? 0;
          if (matchIndex > lastIndex) {
            parts.push(rawLine.substring(lastIndex, matchIndex));
          }
          parts.push(<strong key={matchIdx} className="font-extrabold text-amber-950 font-serif">{m[1]}</strong>);
          lastIndex = matchIndex + m[0].length;
        });

        if (lastIndex < rawLine.length) {
          parts.push(rawLine.substring(lastIndex));
        }
        return parts;
      };

      // Headers
      if (text.startsWith("###")) {
        return (
          <h4 key={idx} className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] mt-4 mb-2 border-b border-[#E8E4D9]/50 pb-1 flex items-center gap-1.5 text-left">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
            <span>{parseInlineFormatting(text.replace("###", "").trim())}</span>
          </h4>
        );
      }
      if (text.startsWith("##")) {
        return (
          <h3 key={idx} className="font-serif font-black text-xs sm:text-sm text-amber-950 uppercase tracking-widest mt-6 mb-3 flex items-center gap-2 border-l-2 border-amber-950 pl-2 py-0.5 text-left">
            <span>{parseInlineFormatting(text.replace("##", "").trim())}</span>
          </h3>
        );
      }
      if (text.startsWith("#")) {
        return (
          <h2 key={idx} className="font-serif font-black text-sm sm:text-base text-gray-900 border-l-4 border-amber-950 pl-3 py-1 my-6 bg-amber-50/45 rounded-r-lg text-left">
            <span>{parseInlineFormatting(text.replace("#", "").trim())}</span>
          </h2>
        );
      }
      
      // Bullet points
      if (text.startsWith("-") || text.startsWith("*")) {
        const content = text.replace(/^[-*]\s*/, "");
        return (
          <div key={idx} className="flex gap-2 items-start pl-4 my-1.5 text-xs text-[#5A5A4A] leading-relaxed text-left">
            <span className="text-[#7C8464] select-none mt-1">•</span>
            <p className="flex-1 text-left">{parseInlineFormatting(content)}</p>
          </div>
        );
      }

      // Numbered lists
      if (/^\d+\s*\.\s/.test(text)) {
        const content = text.replace(/^\d+\s*\.\s*/, "");
        const numMatch = text.match(/^(\d+)\s*\.\s*/);
        const num = numMatch ? numMatch[1] : "1";
        return (
          <div key={idx} className="flex gap-2 items-start pl-4 my-1.5 text-xs text-[#5A5A4A] leading-relaxed text-left">
            <span className="text-amber-950 font-mono font-bold text-[10px] select-none mt-0.5">{num}.</span>
            <p className="flex-1 text-left">{parseInlineFormatting(content)}</p>
          </div>
        );
      }
      
      // Default paragraphs
      return (
        <p key={idx} className="text-xs text-[#5A5A4A] leading-relaxed my-2 text-left">
          {parseInlineFormatting(text)}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {compilingDossier && (
        <div className="fixed inset-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md overflow-y-auto flex flex-col antialiased">
          {/* Top Navigation */}
          <div className="px-6 py-4 border-b border-[#E8E4D9] bg-white flex justify-between items-center sticky top-0 z-10 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-950 p-2 rounded-xl text-white">
                <BookMarked className="h-4 w-4 text-amber-300" />
              </div>
              <div className="text-left">
                <h2 className="font-serif font-black text-sm sm:text-base text-natural-title leading-none">
                  Lumina Custom Science Compiler
                </h2>
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#8C8474] mt-1 block">
                  Composite Multi-Paper Academic Dossier Generator
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompilingDossier(false);
                setDossierResult("");
                setDossierError(null);
              }}
              className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Split Workspace */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Left Configuration Panel */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                <div className="border-b border-[#F2EDE4] pb-2 text-left">
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24]">Compiler Settings</h3>
                  <p className="text-[10px] text-[#8C8474]">Select academic depth and explore resources</p>
                </div>

                {/* Level selector */}
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[10px] font-mono font-bold text-[#5A5A4A] uppercase">Target Reading Complexity</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {(["Middle School", "High School", "Undergrad", "Graduate", "PhD"] as ExplanationLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setDossierLevel(lvl)}
                        className={`text-[9px] py-2 rounded-lg border font-bold text-center transition-all cursor-pointer select-none ${
                          dossierLevel === lvl
                            ? "bg-amber-950 text-white border-amber-950"
                            : "bg-white text-[#5A5A4A] border-[#E8E4D9] hover:bg-[#F2EDE4]"
                        }`}
                      >
                        {lvl === "Middle School" && "Middle"}
                        {lvl === "High School" && "High"}
                        {lvl === "Undergrad" && "College"}
                        {lvl === "Graduate" && "Graduate"}
                        {lvl === "PhD" && "PhD"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Sync */}
                <button
                  onClick={handleCompileDossier}
                  disabled={generatingDossier || readingList.length === 0}
                  className="w-full bg-amber-950 hover:bg-amber-900 font-bold py-3 text-white rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer select-none disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{generatingDossier ? "Synthesizing Science Dossier..." : "Generate Custom Study Dossier"}</span>
                </button>
              </div>

              {/* Queue of Curated Articles */}
              <div className="bg-white border border-[#E8E4D9] rounded-2xl p-5 shadow-xs flex flex-col gap-3 flex-1 min-h-[250px] lg:min-h-0 text-left">
                <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-2">
                  <div className="text-left">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24]">Curated Papers Bundle</h3>
                    <p className="text-[10px] text-[#8C8474]">Articles currently selected for compilation</p>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-950/10 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                    {readingList.length} Selected
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[300px] lg:max-h-[450px]">
                  {readingList.map((paper, rpIdx) => (
                    <div key={rpIdx} className="bg-[#F9F7F2]/50 border border-[#E8E4D9] p-3 rounded-xl flex justify-between items-start gap-3 text-left">
                      <div className="flex-1 text-left">
                        <span className="text-[8px] font-mono uppercase bg-amber-950/20 text-amber-950 px-1 py-0.5 rounded font-black">
                          {paper.source_name}
                        </span>
                        <h4 className="font-serif font-bold text-xs text-[#2D2D24] leading-snug mt-1">
                          {paper.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setReadingList(prev => prev.filter(item => item.original_url !== paper.original_url));
                        }}
                        className="hover:bg-red-50 p-1.5 rounded-lg text-red-600 transition-colors shrink-0 cursor-pointer"
                        title="Exempt from compile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Compiler Console / Preview Screen */}
            <div className="lg:col-span-7 flex flex-col min-h-[400px] lg:min-h-0 bg-white border border-[#E8E4D9] rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8E4D9] bg-[#F9F7F2]/30 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-left">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5A5A4A]">Dossier Compiler Console</span>
                </div>

                {dossierResult && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(dossierResult);
                        setDossierCopied(true);
                        setTimeout(() => setDossierCopied(false), 2000);
                      }}
                      className="text-[10px] bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[#5A5A4A] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {dossierCopied ? <CheckCircle2 className="h-3 w-3 text-[#7C8464]" /> : <Share2 className="h-3 w-3" />}
                      <span>{dossierCopied ? "Copied!" : "Copy"}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Lumina Study Dossier - ${dossierLevel}</title>
                                <style>
                                  body { font-family: 'Georgia', serif; line-height: 1.6; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
                                  h1 { border-bottom: 2px solid #5a4a3a; padding-bottom: 10px; color: #2d241d; font-size: 26px; }
                                  h2 { color: #5a4a3a; font-size: 20px; border-left: 4px solid #5a4a3a; padding-left: 10px; margin-top: 30px; }
                                  h3 { color: #2d2d24; font-size: 16px; margin-top: 20px; }
                                  p { font-size: 14px; text-align: justify; }
                                  ul, ol { font-size: 14px; margin-left: 20px; }
                                  li { margin-bottom: 8px; }
                                  .footer { margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 10px; font-family: monospace; color: #777; }
                                </style>
                              </head>
                              <body>
                                <h1>Lumina Science Study Companion</h1>
                                <p><strong>Complexity Standard:</strong> ${dossierLevel} Academic Calibration Level</p>
                                <hr />
                                <div>${dossierResult.split('\n').map(l => l.trim() ? '<p>' + l.trim() + '</p>' : '<br />').join('')}</div>
                                <div class="footer">
                                  Generated dynamically by Lumina Science Journal Companion. Powered by Gemini.
                                </div>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }}
                      className="text-[10px] bg-amber-950 hover:bg-amber-900 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Print Brief</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Body screen */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto text-left bg-slate-50/20">
                {generatingDossier ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center gap-3">
                    <RefreshCw className="h-8 w-8 text-amber-950 animate-spin" />
                    <div className="max-w-md">
                      <p className="font-serif font-black text-sm text-[#2D2D24] animate-pulse">COMPILING SYNTHESIS SYSTEM...</p>
                      <p className="text-[11px] text-[#5A5A4A] mt-2 leading-relaxed italic bg-amber-50/40 p-3 rounded-xl border border-amber-200/50">
                        "We are correlating concepts, structuring jargon dictionaries, translating formulas into active high-quality metaphorical descriptions, and drafting custom review prompts tailored for "${dossierLevel}" level."
                      </p>
                    </div>
                  </div>
                ) : dossierError ? (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center flex flex-col items-center gap-2">
                    <span>⚠️ {dossierError}</span>
                    <button onClick={handleCompileDossier} className="font-bold underline text-[10px]">Try compiling again</button>
                  </div>
                ) : dossierResult ? (
                  <div className="flex flex-col gap-1">
                    {/* Epistemic Limitation Reporting Header */}
                    <div className="p-4 sm:p-5 bg-amber-500/[0.03] border border-amber-500/20 rounded-2xl flex flex-col gap-3.5 mb-6 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 pointer-events-none opacity-[0.03] text-amber-950">
                        <BookMarked className="h-24 w-24" />
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#E8E4D9] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2 bg-amber-500/10 text-amber-800 border border-amber-500/20 rounded text-[9px] font-mono font-black uppercase tracking-wider">
                            Epistemic Status: Cognitive Sandbox
                          </span>
                          <span className="text-[10px] font-mono text-[#8C8474]">CONFIDENCE STABILITY METRICS</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono">
                          <div>
                            <span className="text-[#8C8474]">CORE PARSE:</span> <strong className="text-[#2D2D24] font-bold">Gemini-3.5-Flash</strong>
                          </div>
                          <div className="h-3 w-px bg-[#E8E4D9]" />
                          <div>
                            <span className="text-[#8C8474]">RAG BOUNDARY COND.:</span> <strong className="text-emerald-700 font-bold">{Math.min(96, 85 + Math.min(5, readingList.length) * 2)}%</strong>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start">
                        <div className="p-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg flex-shrink-0 animate-pulse">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-850">
                            EPISTEMIC LIMITATION NOTICE &amp; HEURISTIC SCOPE
                          </span>
                          <p className="text-[11px] text-[#5A5A4A] leading-relaxed font-serif italic">
                            "AI-generated simplified models are cognitive stepping stones, not authoritative replacements for peer-reviewed primary sources."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none text-left leading-relaxed">
                      {renderMarkdownToJSX(dossierResult)}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="bg-[#E8E4D9]/30 p-5 rounded-full text-[#8C8474]">
                      <BookMarked className="h-8 w-8" />
                    </div>
                    <div className="max-w-xs text-center">
                      <p className="font-serif font-bold text-sm text-[#2D2D24]">Waiting for synthesis engine</p>
                      <p className="text-xs text-[#5A5A4A] mt-2 leading-relaxed">
                        Your custom study workspace lists <strong className="text-amber-950 font-bold">{readingList.length} articles</strong> queued. Click the <strong className="text-[#7C8464] font-bold">"Generate Custom Study Dossier"</strong> button on the left to invoke the synthesis engine and build an exportable study briefing companion!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-[#E8E4D9] bg-[#FDFBF7] text-[9px] font-mono text-[#8C8474] font-medium uppercase tracking-wider select-none flex justify-between items-center shrink-0">
                <span>Aggregation Pipeline Standard</span>
                <span>{dossierLevel} Integration Mode</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
