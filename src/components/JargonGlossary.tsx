import React, { useState } from "react";
import { Search } from "lucide-react";
import { JargonCheatSheetItem } from "../types";

interface JargonGlossaryProps {
  jargonCheatSheet: JargonCheatSheetItem[];
  highDensity: boolean;
  pulsingTerm: string | null;
}

export default function JargonGlossary({
  jargonCheatSheet,
  highDensity,
  pulsingTerm
}: JargonGlossaryProps) {
  const [jargonQuery, setJargonQuery] = useState("");

  const filteredJargon = jargonCheatSheet.filter(
    (item) =>
      item.term.toLowerCase().includes(jargonQuery.toLowerCase()) ||
      item.simple_definition.toLowerCase().includes(jargonQuery.toLowerCase())
  );

  return (
    <div className="card-jargon">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A4A] flex justify-between items-center w-full">
            <span>Jargon Cheat Sheet</span>
          </h3>
          <p className="text-[11px] text-[#8C8474] mt-1 font-mono">
            {jargonCheatSheet.length} terms deconstructed into simple analogies
          </p>
        </div>

        <div className="relative flex-shrink-0 w-full sm:w-64">
          <input
            type="text"
            placeholder="Search jargon terms..."
            value={jargonQuery}
            onChange={(e) => setJargonQuery(e.target.value)}
            className="input-natural pl-8"
          />
          <Search className="h-3.5 w-3.5 text-[#8C8474]/80 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className={highDensity ? "flex flex-col gap-2.5 w-full" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {filteredJargon && filteredJargon.length > 0 ? (
          filteredJargon.map((item, idx) => {
            const isPulsing = pulsingTerm?.toLowerCase() === item.term.toLowerCase();
            const termId = item.term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            
            return (
              <div 
                key={idx} 
                id={`jargon-card-${termId}`}
                className={`rounded-2xl p-4 flex flex-col gap-1.5 transition-all duration-300 ${
                  isPulsing 
                    ? "jargon-card-pulse border-[#7C8464] shadow-md bg-white/80" 
                    : "bg-white/40 border border-white/40 hover:bg-white/60"
                }`}
              >
                <span className="font-serif font-bold text-[#2D2D24] text-base flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPulsing ? "bg-[#7C8464] scale-125" : "bg-[#7C8464]"}`} />
                  {item.term}
                </span>
                <p className={`italic text-xs sm:text-sm leading-relaxed p-2.5 rounded-xl transition-all duration-300 ${isPulsing ? "text-[#2D2D24] bg-white/70" : "text-[#5A5A4A] bg-white/40"}`}>
                  "{item.simple_definition}"
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center text-[#8C8474] text-xs py-6">
            No matching jargon terms in this cheat sheet.
          </div>
        )}
      </div>
    </div>
  );
}
