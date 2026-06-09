import React, { useState, useEffect } from "react";
import AboutUs from "./components/AboutUs";
import SympheryIcon from "./components/SympheryIcon";

import JargonGlossary from "./components/JargonGlossary";
import { SynthesisDossier } from "./components/SynthesisDossier";
import { SimplifiedPaper, JargonCheatSheetItem, ExplanationLevel, LivePaper, Source } from "./types";
import { 
  Sparkle, 
  LayoutGrid,
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  ArrowRightLeft,
  Dna,
  Lightbulb, 
  Compass, 
  HelpCircle, 
  Layers, 
  AlertCircle, 
  HeartHandshake, 
  Flame, 
  Globe, 
  Cpu, 
  ChevronRight,
  RefreshCw,
  Search,
  BookMarked,
  Share2,
  Link2,
  Download,
  Clock,
  Bookmark,
  Trash2,
  X,
  Network,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  ExternalLink,
  Sparkles,
  GitMerge,
  Plus,
  FlaskConical,
  Atom,
  ShieldAlert,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

async function safeParseJson(response: Response, fallbackValue: any = null) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const rawText = await response.text();
    console.warn("Received non-JSON content-type: " + contentType, rawText.substring(0, 300));
    throw new Error("Invalid API Response: Server did not return JSON. Please verify service integration keys or try another query.");
  }
  try {
    const text = await response.text();
    return JSON.parse(text);
  } catch (err: any) {
    console.error("JSON parsing failed, reading text:", err);
    throw new Error("Invalid JSON structure returned by server.");
  }
}



export default function App() {
  // Input states
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [fullText, setFullText] = useState("");
  const [parsedPages, setParsedPages] = useState<any[]>([]);
  const [crawlMetadata, setCrawlMetadata] = useState<{ authors?: string; publish_date?: string; source_name?: string; original_url?: string; } | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>("High School");
  const [viewMode, setViewMode] = useState<"concept" | "detail">("concept");

  // Reading List State (using localStorage persistence)
  const [readingList, setReadingList] = useState<LivePaper[]>(() => {
    try {
      const stored = localStorage.getItem("lumina_reading_list");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [showReadingList, setShowReadingList] = useState(false);

  const [showAboutUs, setShowAboutUs] = useState(false);

  // Sync readingList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lumina_reading_list", JSON.stringify(readingList));
    } catch (e) {
      console.error("Failed to save reading list to localStorage:", e);
    }
  }, [readingList]);

  const handleToggleReadLater = (paper: LivePaper) => {
    const exists = readingList.some(item => item.original_url === paper.original_url);
    if (exists) {
      setReadingList(prev => prev.filter(item => item.original_url !== paper.original_url));
    } else {
      setReadingList(prev => [...prev, paper]);
    }
  };

  const isBookmarked = (paper: LivePaper) => {
    return readingList.some(item => item.original_url === paper.original_url);
  };

  

  // Live curated papers states
  const [livePapers, setLivePapers] = useState<LivePaper[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [justImported, setJustImported] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  
  // URL fetching states
  const [urlInput, setUrlInput] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Result and process states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifiedPaper | null>(null);
  
  // Search query for the Jargon Cheat Sheet
  const [jargonQuery, setJargonQuery] = useState("");

  // --- RESEARCH FINDING ENHANCEMENT STATES (IDEAS 1, 2, 3) ---
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const [scoutQuery, setScoutQuery] = useState("");
  const [scouting, setScouting] = useState(false);
  const [scoutResults, setScoutResults] = useState<LivePaper[]>([]);
  const [scoutError, setScoutError] = useState<string | null>(null);

  const [compilingDossier, setCompilingDossier] = useState(false);

  // Pulsing term state for connecting inline highlights to glossary cards
  const [pulsingTerm, setPulsingTerm] = useState<string | null>(null);

  const handleJargonInteraction = (term: string) => {
    setPulsingTerm(term);
    // Automatically clear the pulsing state after 1.5 seconds
    const timer = setTimeout(() => {
      setPulsingTerm((current) => (current === term ? null : current));
    }, 1500);
    return () => clearTimeout(timer);
  };

  const handleJargonInteractionAndScroll = (term: string) => {
    handleJargonInteraction(term);
    const termId = term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const element = document.getElementById(`jargon-card-${termId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Citation Graph & Horizon Map State
  const [showHorizonMap, setShowHorizonMap] = useState(false);
  const [showReviewChallenge, setShowReviewChallenge] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [selectedCitationNode, setSelectedCitationNode] = useState<any | null>(null);

  // Thesis Validation Matrix State
  const [hoveredMatrixCard, setHoveredMatrixCard] = useState<string | null>(null);
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(true);
  const [splitScreenPaper, setSplitScreenPaper] = useState<any | null>(null);
  const [highDensity, setHighDensity] = useState(false);

  const handleLoadNodeAsMain = async (node: any) => {
    setShowHorizonMap(false);
    setSelectedCitationNode(null);
    const paperToLoad: LivePaper = {
      title: node.title,
      authors: node.authors,
      abstract: node.abstract || "This study explores foundational sequence processing limits and context aggregation parameters.",
      source_name: node.type === "upstream" ? "UPSTREAM REF" : "DOWNSTREAM APP",
      original_url: "https://arxiv.org/abs/" + node.id,
      publish_date: `${node.year}-01-01`
    };
    await handleSelectLivePaper(paperToLoad);
  };

  // Loading phase message state (simplified for academic integrity)
  const loadingMessages = ["Processing..."];

  // Helper to group live papers by topic and sort each group's papers by publish_date (newest first)
  const getGroupedAndSortedPapers = () => {
    const groups: { [key: string]: LivePaper[] } = {};
    
    // Apply filters first
    const filteredPapers = livePapers.filter(paper => {
      // Topic Filter
      const paperTopic = paper.topic?.trim() || "General Science";
      if (selectedTopic !== "All" && paperTopic !== selectedTopic) {
        return false;
      }

      // Keyword Search
      if (liveSearchQuery.trim()) {
        const query = liveSearchQuery.toLowerCase();
        const titleMatch = paper.title?.toLowerCase().includes(query);
        const abstractMatch = paper.abstract?.toLowerCase().includes(query);
        const authorMatch = paper.authors?.toLowerCase().includes(query);
        const sourceMatch = paper.source_name?.toLowerCase().includes(query);
        return titleMatch || abstractMatch || authorMatch || sourceMatch;
      }

      return true;
    });

    filteredPapers.forEach(paper => {
      const topic = paper.topic?.trim() || "General Science";
      if (!groups[topic]) {
        groups[topic] = [];
      }
      groups[topic].push(paper);
    });

    // Sort each group's papers by publish date descending (newest first)
    Object.keys(groups).forEach(topic => {
      groups[topic].sort((a, b) => {
        const dateA = new Date(a.publish_date || 0).getTime();
        const dateB = new Date(b.publish_date || 0).getTime();
        return dateB - dateA;
      });
    });

    // Return as array of objects sorted by topic name alphabetically
    return Object.keys(groups).map(topic => ({
      topic,
      papers: groups[topic]
    })).sort((a, b) => a.topic.localeCompare(b.topic));
  };

  // Helper to estimate the reading time for simplified papers in minutes
  const calculateReadingTime = () => {
    if (!result) return 0;
    const bigIdea = viewMode === "concept"
      ? (result.the_big_idea_concept || result.the_big_idea || "")
      : (result.the_big_idea_detail || result.the_big_idea || "");
    const findings = (viewMode === "concept"
      ? (result.key_findings_concept || result.key_findings || [])
      : (result.key_findings_detail || result.key_findings || [])).join(" ");
    const impact = viewMode === "concept"
      ? (result.real_world_impact_concept || result.real_world_impact || "")
      : (result.real_world_impact_detail || result.real_world_impact || "");
    const text = `${result.simplified_title} ${result.one_sentence_hook} ${bigIdea} ${findings} ${impact}`;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // Average academic/reading speed ~200 WPM
  };


  // Fetch live papers and sources on initial application load
  useEffect(() => {
    const fetchLivePapers = async () => {
      setLoadingLive(true);
      setLiveError(null);
      try {
        const response = await fetch("/api/latest-papers");
        if (!response.ok) {
          throw new Error(`Server status ${response.status}`);
        }
        const data = await safeParseJson(response);
        if (data.papers && Array.isArray(data.papers)) {
          setLivePapers(data.papers);
        }
      } catch (err) {
        console.error("Failed to load live papers from sources:", err);
        setLiveError("Dynamic research servers are compiling; meanwhile feel free to paste a URL!");
      } finally {
        setLoadingLive(false);
      }
    };

    const fetchSourcesList = async () => {
      try {
        const response = await fetch("/api/sources");
        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }
        const data = await safeParseJson(response);
        if (data.sources && Array.isArray(data.sources)) {
          setSources(data.sources);
        }
      } catch (err) {
        console.error("Failed to load sources list:", err);
      }
    };

    fetchLivePapers();
    fetchSourcesList();
  }, []);

  const handleScoutGrounding = async () => {
    if (!scoutQuery.trim()) return;
    setScouting(true);
    setScoutError(null);
    setScoutResults([]);
    try {
      const resp = await fetch("/api/research-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: scoutQuery, level: explanationLevel })
      });
      if (!resp.ok) {
        throw new Error(`Scouting server error (status ${resp.status})`);
      }
      const data = await resp.json();
      if (data.papers && Array.isArray(data.papers)) {
        setScoutResults(data.papers);
      } else {
        setScoutResults([]);
        setScoutError("No verified research papers were returned for this topic.");
      }
    } catch (err: any) {
      console.error("Scout grounding error:", err);
      setScoutError(err.message || "Failed to search the academic scout network.");
    } finally {
      setScouting(false);
    }
  };

  // Global keyboard shortcut to toggle High-Density Workspace mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
      ) {
        return;
      }
      
      if (e.key === "d" || e.key === "D") {
        setHighDensity((prev) => !prev);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runSimplification = async (
    currentTitle: string, 
    currentAbstract: string, 
    currentFullText: string, 
    level: ExplanationLevel,
    metadata?: { authors?: string; publish_date?: string; year?: number; original_url?: string }
  ) => {
    if (!currentTitle.trim() || !currentAbstract.trim()) {
      setError("Please provide at least a Title and Abstract to simplify.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentTitle.trim(),
          abstract: currentAbstract.trim(),
          fullText: currentFullText.trim() || undefined,
          explanationLevel: level,
          authors: metadata?.authors,
          publish_date: metadata?.publish_date,
          original_url: metadata?.original_url,
          year: metadata?.year,
          pages: parsedPages && parsedPages.length > 0 ? parsedPages : undefined,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to process the research paper.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await safeParseJson(response);
            errorMsg = errData.error || errorMsg;
          } else {
            const textHtml = await response.text();
            console.warn("Express server returned raw response under status " + response.status, textHtml);
          }
        } catch (e) {
          console.error("Failed to parse error response JSON", e);
        }
        throw new Error(errorMsg);
      }

      const data = await safeParseJson(response);

      // Ensure client-side metadata overrides or complements if backend fields are missing
      const finalData = {
        ...data,
        authors: data.authors || metadata?.authors || "Active Workspace Specimen",
        publish_date: data.publish_date || metadata?.publish_date || "2026-06-07",
        year: data.year || metadata?.year || (metadata?.publish_date ? parseInt(metadata.publish_date.split("-")[0]) : 2026),
        original_url: data.original_url || metadata?.original_url || "",
        original_title: data.original_title || currentTitle,
      };

      setResult(finalData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLivePaper = async (paper: LivePaper) => {
    setTitle(paper.title);
    setAbstract(paper.abstract);
    setFullText("");
    setSelectedSampleId(null);
    setJustImported(paper.title);
    setError(null);
    setFetchError(null);
    setCrawlMetadata({
      authors: paper.authors,
      publish_date: paper.publish_date,
      source_name: paper.source_name,
      original_url: paper.original_url,
    });
    
    // Clear toast message after 4 seconds
    setTimeout(() => {
      setJustImported(null);
    }, 4000);

    // Auto-simplify right away
    await runSimplification(paper.title, paper.abstract, "", explanationLevel, {
      authors: paper.authors,
      publish_date: paper.publish_date,
      original_url: paper.original_url,
    });
  };

  const handleGoHome = () => {
    setResult(null);
    setError(null);
    setTitle("");
    setAbstract("");
    setFullText("");
    setUrlInput("");
    setFetchError(null);
    setSelectedSampleId(null);
    setCrawlMetadata(null);
  };

  const handleSaveToStudyLog = () => {
    if (!result) return;
    
    const studyLogData = {
      downloaded_at: new Date().toISOString(),
      explanation_level: result.explanation_level || explanationLevel,
      original_paper: {
        title: title || result.simplified_title,
        abstract: abstract || ""
      },
      simplified_paper: {
        simplified_title: result.simplified_title,
        one_sentence_hook: result.one_sentence_hook,
        the_big_idea: viewMode === "concept" 
          ? (result.the_big_idea_concept || result.the_big_idea) 
          : (result.the_big_idea_detail || result.the_big_idea),
        key_discoveries: viewMode === "concept"
          ? (result.key_findings_concept || result.key_findings)
          : (result.key_findings_detail || result.key_findings),
        real_world_impact: viewMode === "concept"
          ? (result.real_world_impact_concept || result.real_world_impact)
          : (result.real_world_impact_detail || result.real_world_impact),
        jargon_cheat_sheet: result.jargon_cheat_sheet
      }
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(studyLogData, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    
    const cleanTitle = result.simplified_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .substring(0, 50);
    downloadAnchor.setAttribute("download", `lumina_study_log_${cleanTitle}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClear = () => {
    setTitle("");
    setAbstract("");
    setFullText("");
    setSelectedSampleId(null);
    setResult(null);
    setError(null);
    setFetchError(null);
  };

  // Fetch and parse an actual web URL to retrieve title, abstract and full text
  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setFetchError("Please enter or select a valid scientific article URL first.");
      return;
    }
    if (!urlInput.trim().startsWith("http")) {
      setFetchError("A valid academic web address starting with 'http://' or 'https://' is required.");
      return;
    }

    setFetchingUrl(true);
    setFetchError(null);
    setError(null);
    setSelectedSampleId(null);

    try {
      const response = await fetch("/api/fetch-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to download and parse paper content.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await safeParseJson(response);
            errorMsg = errData.error || errorMsg;
          } else {
            const textHtml = await response.text();
            console.warn("Express server returned raw response under status " + response.status, textHtml);
          }
        } catch (e) {
          console.error("Failed to parse error response JSON", e);
        }
        throw new Error(errorMsg);
      }

      const data = await safeParseJson(response);

      setTitle(data.title || "");
      setAbstract(data.abstract || "");
      setFullText(data.fullText || "");
      setParsedPages(data.pages || []);
      setCrawlMetadata({
        authors: data.authors,
        publish_date: data.publish_date,
        source_name: data.source_name,
        original_url: urlInput.trim(),
      });
      setUrlInput(""); // Clear field upon successful auto-fill
    } catch (err: any) {
      console.error("URL Fetch error:", err);
      setFetchError(err.message || "An unexpected error occurred while parsing the article.");
    } finally {
      setFetchingUrl(false);
    }
  };

  // Submit and fetch parsed simplified results from our backend
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSimplification(title, abstract, fullText, explanationLevel, crawlMetadata || undefined);
  };

  // Utility to dynamically highlight jargon terms inside texts for maximum interactive benefit
  const renderTextWithJargonHighlights = (text: string, cheatSheet: JargonCheatSheetItem[]) => {
    if (!text) return "";
    if (!cheatSheet || cheatSheet.length === 0) return text;

    // Sort terms longest to shortest to prevent sub-string matching errors (e.g. replacing 'cell' instead of 'cellular membrane')
    const sortedTerms = [...cheatSheet].sort((a, b) => b.term.length - a.term.length);
    const escapedTerms = sortedTerms.map(x => x.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    
    // Create word boundary regex matching any term
    const regex = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const matchingItem = cheatSheet.find(
        (item) => item.term.toLowerCase() === part.toLowerCase()
      );

      if (matchingItem) {
        return (
          <span
            key={idx}
            className="relative group inline-block bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#2D2D24] border-b-2 border-[#7C8464] font-semibold px-1.5 py-0.5 rounded transition-all duration-200 cursor-help"
            id={`jargon-highlight-${idx}`}
            onMouseEnter={() => handleJargonInteraction(matchingItem.term)}
            onClick={() => handleJargonInteractionAndScroll(matchingItem.term)}
          >
            {part}
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 bg-[#2D2D24] text-[#F9F7F2] text-xs p-3 rounded-xl shadow-2xl z-50 normal-case font-normal leading-relaxed pointer-events-none border border-[#434338]">
              <span className="block font-serif font-bold text-[#EAE6D6] mb-1">
                {matchingItem.term}
              </span>
              {matchingItem.simple_definition}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D2D24]"></span>
            </span>
          </span>
        );
      }
      return part;
    });
  };



  // Filter jargon items
  const filteredJargon = result?.jargon_cheat_sheet?.filter(item => 
    item.term.toLowerCase().includes(jargonQuery.toLowerCase()) ||
    item.simple_definition.toLowerCase().includes(jargonQuery.toLowerCase())
  );

  const renderBackButtonAndHorizonMapTrigger = () => {
    if (!result) return null;
    return (
      <div className="flex items-center justify-between py-1 gap-2">
        <button
          onClick={() => {
            setResult(null);
            setTitle("");
            setAbstract("");
            setFullText("");
          }}
          className="group flex items-center gap-2 text-xs font-bold text-[#7C8464] hover:text-[#6A7153] transition-colors bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer whitespace-nowrap"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowHorizonMap(true)}
            className="group flex items-center gap-2 text-xs font-bold text-[#2D2D24] hover:text-white hover:bg-[#7C8464] transition-all bg-white border border-[#E8E4D9] px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer hover:border-[#7C8464] whitespace-nowrap"
            id="horizon-map-top-trigger"
          >
            <Network className="h-4 w-4 text-[#7C8464] group-hover:text-white transition-colors animate-pulse" />
            <span>Explore Horizon Map</span>
          </button>

          <button
            onClick={() => setShowReviewChallenge(true)}
            className="group flex items-center gap-2 text-xs font-bold text-white bg-[#BC5234] hover:bg-[#9B4127] transition-all px-4.5 py-2.5 rounded-full shadow-md cursor-pointer whitespace-nowrap"
            id="reviewer-arena-top-trigger"
          >
            <ShieldAlert className="h-4 w-4 text-white animate-bounce" />
            <span>Reviewer #3 Arena</span>
          </button>
        </div>
      </div>
    );
  };

  const renderAdaptiveViewControl = () => {
    if (!result) return null;
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F2EDE4]/60 p-4 rounded-[24px] border border-[#D6D0C2] gap-3">
        <div className="flex flex-col px-1">
          <div className="flex items-center gap-1.5 text-xs text-[#2D2D24] font-bold uppercase tracking-wider">
            <Sparkle className="h-4 w-4 text-[#7C8464] animate-pulse" />
            Adaptive View Control
          </div>
          <span className="text-[10px] text-[#8C8474] font-mono leading-tight mt-0.5">
            Instantly adjust the verbosity and mechanical depth of the generated breakdown!
          </span>
        </div>
        <div className="bg-white/90 p-1 rounded-xl flex gap-1 w-full sm:w-auto shadow-sm border border-[#E8E4D9]">
          <button
            type="button"
            onClick={() => setViewMode("concept")}
            className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "concept"
                ? "bg-[#7C8464] text-white shadow font-semibold"
                : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
            }`}
          >
            💡 Concept Focused
          </button>
          <button
            type="button"
            onClick={() => setViewMode("detail")}
            className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "detail"
                ? "bg-[#7C8464] text-white shadow font-semibold"
                : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
            }`}
          >
            🔬 Deep Detail
          </button>
        </div>
      </div>
    );
  };

  const renderCatchySimplifiedTitle = () => {
    if (!result) return null;
    return (
      <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-[#F9F7F2] rounded-full -z-10 opacity-60"></div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-[#8C8474] bg-[#F2EDE4] border border-[#E8E4D9] px-3 py-1 rounded-lg whitespace-nowrap">
            {viewMode === "concept" ? "Concept Focused • Catchy Title" : "Detailed Analysis • Catchy Title"}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D24] tracking-tight leading-tight mt-1">
          {result.simplified_title}
        </h2>
      </div>
    );
  };

  const renderExcitingHookSection = () => {
    if (!result) return null;
    return (
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 translate-x-3 -translate-y-3">
          <Flame className="h-24 w-24 text-[#7C8464]/5" />
        </div>
        <div className="bg-[#F2EDE4] text-[#7C8464] p-3 h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C8464] font-mono">The Hook: Why it is cool!</span>
          <p className="text-lg text-[#5A5A4A] italic font-medium leading-relaxed mt-1.5 font-serif">
            "{result.one_sentence_hook}"
          </p>
        </div>
      </motion.div>
    );
  };


  const renderBigIdeaDescription = () => {
    if (!result) return null;
    return (
      <div 
        id="claim-big-idea"
        className={`rounded-[32px] p-7 shadow-sm border transition-all duration-500 flex flex-col justify-between min-h-[365px] ${
          hoveredMatrixCard === "claim-big-idea"
            ? "bg-[#7C8464]/10 border-[#7C8464] scale-[1.01] shadow-[0_4px_24px_rgba(124,132,100,0.15)] ring-2 ring-[#7C8464]/10"
            : "bg-white border-[#E8E4D9]"
        }`}
      >
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C8464] mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7C8464]"></div> The Big Idea
          </h3>
          
          <div className="text-[#5A5A4A] leading-relaxed text-[15px] space-y-4">
            {renderTextWithJargonHighlights(
              viewMode === "concept"
                ? (result.the_big_idea_concept || result.the_big_idea || "")
                : (result.the_big_idea_detail || result.the_big_idea || ""),
              result.jargon_cheat_sheet
            )}
          </div>
        </div>

        <div className="mt-6 text-[11px] text-[#8C8474] bg-[#F9F7F2] p-3 rounded-xl border border-[#E8E4D9] flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#7C8464] flex-shrink-0" />
          <span>
            {result.explanation_level === "Middle School" && <>Hover over highlighted words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige</span> for ultra-simple everyday comparisons!</>}
            {result.explanation_level === "High School" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for science class analogies!</>}
            {result.explanation_level === "Undergrad" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for mechanistic definitions!</>}
            {result.explanation_level === "Graduate" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for functional parameters!</>}
            {result.explanation_level === "PhD" && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for postdoctoral or peer metrics!</>}
            {!result.explanation_level && <>Hover over words in <span className="text-[#2D2D24] font-semibold underline decoration-[#7C8464] decoration-2">beige highlights</span> for science class analogies!</>}
          </span>
        </div>
      </div>
    );
  };

  const renderKeyFindings = () => {
    if (!result) return null;
    return (
      <div className="bg-[#7C8464] rounded-[32px] p-7 text-white shadow-lg flex flex-col justify-between min-h-[365px]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-5 flex items-center gap-2">
            <Layers className="h-4 w-4" /> Key Discoveries
          </h3>
          
          <ul className="space-y-5">
            {(viewMode === "concept"
              ? (result.key_findings_concept || result.key_findings || [])
              : (result.key_findings_detail || result.key_findings || [])).map((finding, idx) => (
              <li 
                key={idx} 
                id={`claim-discovery-${idx}`}
                className={`flex gap-3 items-start p-3 rounded-2xl transition-all duration-500 ${
                  hoveredMatrixCard === `claim-discovery-${idx}`
                    ? "bg-white/10 text-white font-medium scale-[1.02] shadow-sm ml-1 pr-1 border-l-4 border-white"
                    : "opacity-100"
                }`}
              >
                <span className="w-5 h-5 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-sm leading-snug text-white/95 text-justify">
                  {renderTextWithJargonHighlights(finding, result.jargon_cheat_sheet)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-white/60 font-mono text-center">
          {result.explanation_level ? `Verified ${result.explanation_level} Level Insights` : "Verified High-School Core Mechanics"}
        </div>
      </div>
    );
  };

  const renderGroundedEvidence = () => {
    if (!result || !result.findings || result.findings.length === 0) return null;
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex flex-col gap-4 overflow-hidden">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C8464] flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-[#7C8464]" /> Verifiable Academic Grounding Matrix
        </h3>
        
        <div>
          <h4 className="text-xl font-serif font-bold text-[#2D2D24] mb-1">
            Grounded RAG Proofs
          </h4>
          <p className="text-xs text-[#8C8474] font-mono leading-relaxed mb-3">
            Every simplified key statement below is directly linked to raw PDF context pages with character-accurate verbatim quoting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono border-t border-b border-[#F2EDE4] py-2 mb-2">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span><strong>Emerald Style:</strong> Verbatim Verified Page Lookups</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span><strong>Amber Style:</strong> Fuzzy / Synthesized Theoretical Layouts</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {result.findings.map((f, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E8E4D9] flex flex-col gap-2.5 hover:border-[#7C8464]/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-[#7C8464] bg-[#7C8464]/10 border border-[#7C8464]/20 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    Claimed: Page {f.source_page}
                  </span>
                  
                  {/* Real-time automated academic integrity validation badges */}
                  {f.is_verified !== undefined && (
                    f.is_verified ? (
                      f.verification_method === "exact" ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 select-none">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 animate-pulse" /> Verbatim Verified {f.matched_page !== f.source_page ? `(On Page ${f.matched_page})` : ""}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 select-none">
                          <CheckCircle2 className="h-3 w-3 text-amber-600" /> Fuzzy Match Verified ({f.verification_ratio}%)
                        </span>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 select-none animate-pulse">
                        <AlertTriangle className="h-3 w-3 text-red-500" /> Untracked Quote
                      </span>
                    )
                  )}
                </div>
                
                <span className="text-[9px] text-[#8C8474] font-mono uppercase tracking-wider leading-none">
                  Citation ID: [P-{f.source_page}-{idx+1}]
                </span>
              </div>
              
              <p className="text-[13px] font-bold text-[#2D2D24] leading-snug">
                {f.finding_statement}
              </p>
              
              <div className="text-[11px] text-[#5A5A4A] bg-white border border-[#E8E4D9]/60 rounded-xl p-3 italic relative font-mono leading-relaxed">
                <span className="text-[#8C8474]/40 font-serif font-bold text-lg select-none leading-none absolute top-1 left-2">“</span>
                <div className="pl-4 pr-1 text-[11px] text-[#5A5A4A]">
                  {f.verbatim_quote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBigIdeaGrid = () => {
    if (!result) return null;
    return (
      <div className={highDensity ? "flex flex-col gap-3" : "grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"}>
         {renderBigIdeaDescription()}
         {renderKeyFindings()}
      </div>
    );
  };

  const renderRealWorldImpact = () => {
    if (!result) return null;
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex flex-col gap-4 overflow-hidden">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#B4A086] flex items-center gap-2">
          <Globe className="h-4 w-4" /> Why It Matters to Future Generations
        </h3>

        <div>
          <h4 className="text-xl font-serif font-bold text-[#2D2D24] mb-2">
            Real-World Impact
          </h4>
          <p className="text-[15px] text-[#5A5A4A] leading-relaxed mb-4">
            {renderTextWithJargonHighlights(
              viewMode === "concept"
                ? (result.real_world_impact_concept || result.real_world_impact || "")
                : (result.real_world_impact_detail || result.real_world_impact || ""),
              result.jargon_cheat_sheet
            )}
          </p>
        </div>

        <div className="mt-auto p-4 bg-[#F9F7F2] rounded-2xl flex items-center gap-4 border border-[#E8E4D9]">
          <div className="w-12 h-12 bg-[#D6D0C2] rounded-xl flex items-center justify-center text-2xl">🌍</div>
          <p className="text-xs font-medium text-[#8C8474] leading-tight">
            This discovery empowers your generation to innovate tomorrow's technology, health, and conservation fields starting today!
          </p>
        </div>
      </div>
    );
  };


  const renderJargonGlossary = () => {
    if (!result) return null;
    return (
      <JargonGlossary
        jargonCheatSheet={result.jargon_cheat_sheet}
        highDensity={highDensity}
        pulsingTerm={pulsingTerm}
      />
    );
  };



  const renderActionsActionBar = () => {
    if (!result) return null;
    return (
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border border-[#E8E4D9] rounded-[24px] bg-white gap-3">
        <div className="flex gap-3">
          <button 
            onClick={handleSaveToStudyLog}
            className="px-5 py-2.5 bg-[#7C8464] hover:bg-[#6A7153] text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
          >
            <BookMarked className="h-3.5 w-3.5" />
            Save to Study Log
          </button>
          <button 
            onClick={() => alert("Link copied to clipboard! Share with your biology class study group.")}
            className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E8E4D9] rounded-full text-xs font-bold text-[#5A5A4A] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share with Class
          </button>
        </div>
        <div className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-widest">
          {result.explanation_level === "Middle School" && "Curriculum Standard: Middle School STEM Level"}
          {result.explanation_level === "High School" && "Curriculum Standard: Grade 11 STEM Alignment"}
          {result.explanation_level === "Undergrad" && "Academic Level: College Undergraduate Standard"}
          {result.explanation_level === "Graduate" && "Analytical Level: Graduate Research Standard"}
          {result.explanation_level === "PhD" && "Scientific Rigor: post-doctoral / faculty Level"}
          {!result.explanation_level && "Curriculum Standard: Grade 11 STEM Alignment"}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col antialiased">
      {/* Top Banner - Quanta Magazine Style Navigation */}
      <nav className="px-6 py-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center bg-white border-b border-natural-border gap-4">
        <div className="flex items-center gap-3">
          <div 
            onClick={handleGoHome}
            className="flex flex-col cursor-pointer group select-none active:scale-98 transition-transform"
          >
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-2xl font-serif font-bold tracking-tight text-[#141312] group-hover:text-natural-primary transition-colors leading-none">
                Lumina
              </h1>
             
            </div>
            <span className="text-[9px] font-sans text-[#8C8474] mt-1 tracking-wide font-medium">
              Interactive Academic Research Simplifier
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 justify-center sm:justify-end">
          {/* Lumina Fusion Toggle Button */}
          <button

            className={`text-xs px-4 py-2 rounded-lg border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              false

                ? "bg-natural-primary text-white border-natural-primary"
                : "bg-white border-natural-border text-natural-text hover:bg-natural-highlight hover:text-natural-primary"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-natural-primary" />
            <span>Fusion Lab</span>
          </button>

          {/* Reading List Toggle Button */}
          <button
            onClick={() => setShowReadingList(!showReadingList)}
            className={`relative text-xs px-4 py-2 rounded-lg border font-bold flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
              showReadingList
                ? "bg-natural-primary text-white border-natural-primary"
                : "bg-white border-natural-border text-natural-text hover:bg-natural-highlight"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5 text-natural-primary" />
            <span>My Reading List</span>
            {readingList.length > 0 && (
              <span className={`inline-flex items-center justify-center text-[10px] h-5 min-w-[20px] px-1.5 rounded-full font-mono font-bold ${
                showReadingList ? "bg-white text-natural-primary" : "bg-natural-primary text-white"
              }`}>
                {readingList.length}
              </span>
            )}
          </button>

          {/* About Us Button */}
          <button
            onClick={() => setShowAboutUs(true)}
            className="text-xs px-4 py-2 rounded-lg border font-bold flex items-center gap-2 bg-white border-natural-border text-natural-text hover:bg-natural-highlight hover:text-natural-primary transition-all cursor-pointer select-none active:scale-95"
          >
            <Compass className="h-3.5 w-3.5 text-natural-primary" />
            <span>About Us</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={explanationLevel}
                onChange={(e) => {
                  const newLevel = e.target.value as ExplanationLevel;
                  setExplanationLevel(newLevel);
                  if (title && abstract) {
                    runSimplification(title, abstract, fullText, newLevel, crawlMetadata || undefined);
                  }
                }}
                className="text-xs px-3 py-2 bg-natural-highlight hover:bg-natural-border border border-natural-border rounded-lg focus:border-natural-primary focus:ring-1 focus:ring-natural-primary focus:outline-none transition-all cursor-pointer appearance-none text-natural-title font-bold pr-8"
              >
                <option value="Middle School">Middle School Standard</option>
                <option value="High School">High School Teacher</option>
                <option value="Undergrad">Undergrad Professor</option>
                <option value="Graduate">Graduate Advisor</option>
                <option value="PhD">Postdoc Research Peer</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-natural-primary">
                <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="main-editor-container">
        <section className="w-full flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!loading && !error && !result && (
                <div className="flex flex-col gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5"
                  >
                    {/* Box 1: Cohort Standard */}
                    <div className="bg-white border border-natural-border rounded-xl p-5 shadow-2xs flex flex-col justify-between h-full hover:border-[#7C8464]/30 transition-all group">
                      <div className="flex flex-col gap-3">
                       
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#7C8464]">
                            Cohort Standard
                          </span>
                          <h4 className="text-sm font-serif font-black text-natural-title mt-1">
                            {explanationLevel} Level
                          </h4>
                          <p className="text-[#8C8474] text-[11px] mt-2 leading-relaxed">
                            Science insights styled according to your target comprehension depth and classroom requirements.
                          </p>
                        </div>
                      </div>
                     
                    </div>

                    {/* Box 2: Interactive Science Desk */}
                    <div className="bg-white border border-natural-border rounded-xl p-5 shadow-2xs flex flex-col justify-between h-full hover:border-[#7C8464]/30 transition-all group">
                      <div className="flex flex-col gap-3">
                        
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#8C8474]">
                            Workspace Desk
                          </span>
                          <h4 className="text-sm font-serif font-black text-natural-title mt-1">
                            {explanationLevel === "Middle School" && "Middle School Science Desk"}
                            {explanationLevel === "High School" && "High School Science Desk"}
                            {explanationLevel === "Undergrad" && "Collegiate Science Seminar"}
                            {explanationLevel === "Graduate" && "Graduate Research Portfolio"}
                            {explanationLevel === "PhD" && "PhD Review & Assessment Board"}
                          </h4>
                          <p className="text-[#8C8474] text-[11px] mt-2 leading-relaxed">
                            Translating intricate collegiate publications into clear, interactive editorial narratives with contextual jargon sheets.
                          </p>
                        </div>
                      </div>
                      
                    </div>

                    {/* Box 3: Pedagogical Focus & Standard */}
                    <div className="bg-white border border-natural-border rounded-xl p-5 shadow-2xs flex flex-col justify-between h-full hover:border-[#7C8464]/30 transition-all group">
                      <div className="flex flex-col gap-3">
                      
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#8C8474]">
                            Objective Goal
                          </span>
                          <h4 className="text-sm font-serif font-black text-natural-title mt-1">
                            Curriculum Alignment
                          </h4>
                          <p className="text-[#5A5A4A] text-[11px] mt-2 leading-relaxed italic bg-[#F9F7F2]/60 p-2.5 rounded-lg border border-[#E8E4D9]/50">
                            {explanationLevel === "Middle School" && "🔬 Explaining biology via visual metaphors and memorable models."}
                            {explanationLevel === "High School" && "📚 Intricate concepts deconstructed into analogy-driven cellular schemas."}
                            {explanationLevel === "Undergrad" && "🎓 College-level academic mechanics, bridging pathways and experiments."}
                            {explanationLevel === "Graduate" && "🔬 Scrutinizing methodologies, errors, and experimental candor."}
                            {explanationLevel === "PhD" && "🧠 Deconstructing kinetic metrics, statistics, and validity limits."}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  </motion.div>
 
                  {/* Curated Platform Live Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-natural-border rounded-xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-lg font-serif font-black text-natural-title tracking-tight">
                          Latest Publications & Articles
                        </h4>
                      </div>

                      {/* Sync button */}
                      <button
                        onClick={async () => {
                          setLoadingLive(true);
                          setLiveError(null);
                          try {
                            const response = await fetch("/api/latest-papers");
                            if (!response.ok) {
                              throw new Error(`Server status ${response.status}`);
                            }
                            const data = await safeParseJson(response);
                            if (data.papers) setLivePapers(data.papers);
                          } catch (err) {
                            setLiveError("Failed to sync sources. Try again!");
                          } finally {
                            setLoadingLive(false);
                          }
                        }}
                        disabled={loadingLive}
                        className="text-xs bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#5A5A4A] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 cursor-pointer select-none transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${loadingLive ? 'animate-spin' : ''}`} />
                        {loadingLive ? "Crawl Syncing..." : "Sync Feeds"}
                      </button>
                    </div>

                    {/* Control Dashboard: Real-time Filters & AI Scout */}
                    <div className="flex flex-col gap-4 bg-[#F9F7F2]/60 p-4 sm:p-5 rounded-2xl border border-natural-border">
                      {/* Search & Badges Box (Idea #1) */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row gap-3 items-center">
                          <div className="relative w-full flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8474]" />
                            <input
                              type="text"
                              placeholder="Search current desk publications (Title, author, keywords...)"
                              value={liveSearchQuery}
                              onChange={(e) => setLiveSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E4D9] rounded-xl text-xs placeholder-[#8C8474] focus:outline-hidden focus:border-[#7C8464] font-medium"
                            />
                            {liveSearchQuery && (
                              <button
                                onClick={() => setLiveSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-[#F2EDE4] hover:bg-[#E8E4D9] px-2 py-0.5 rounded font-mono text-[#5A5A4A]"
                              >
                                CLEAR
                              </button>
                            )}
                          </div>

                          {/* Quick Stats block */}
                          <div className="text-[10px] font-mono bg-white border border-[#E8E4D9] px-3.5 py-2 rounded-xl text-[#5A5A4A] flex items-center gap-1.5 w-full md:w-auto shrink-0 justify-center">
                            <Sliders className="h-3 w-3 text-[#7C8464]" />
                            <span>
                              Loaded: <strong className="font-bold">{livePapers.length}</strong> | Filtered: <strong className="font-bold">{getGroupedAndSortedPapers().reduce((acc, curr) => acc + curr.papers.length, 0)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Interactive Topic Pill Badges */}
                        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#E8E4D9]/40">
                          {["All", ...Array.from(new Set(livePapers.map(p => p.topic?.trim() || "General Science")))].filter(Boolean).map((topic, tIdx) => (
                            <button
                              key={tIdx}
                              onClick={() => setSelectedTopic(topic)}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold select-none flex items-center gap-1 transition-all cursor-pointer ${
                                selectedTopic === topic
                                  ? "bg-[#7C8464] text-white border-[#7C8464] shadow-xs"
                                  : "bg-white text-[#5A5A4A] border-[#E8E4D9]/80 hover:bg-[#F2EDE4]"
                              }`}
                            >
                              <span>{topic}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AI Search Grounding Scout Panel (Idea #2) */}
                      <div className="mt-2 pt-4 border-t border-dashed border-[#E8E4D9]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#7C8464]/15 px-2.5 py-1 rounded-lg text-[#7C8464]">
                              <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <h5 className="font-serif font-bold text-xs text-[#2D2D24] leading-tight">AI Science Scout</h5>
                              <span className="text-[9px] font-sans text-[#8C8474]">Connect to Google Search Grounding to mine real-time external papers & preprints</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            placeholder="e.g., room temperature superconductor breakthroughs arXiv or space plasma thrusters nature"
                            value={scoutQuery}
                            onChange={(e) => setScoutQuery(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                await handleScoutGrounding();
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-white border border-[#E8E4D9] rounded-xl text-xs placeholder-[#8C8474] focus:outline-hidden focus:border-[#7C8464] font-medium"
                          />
                          <button
                            onClick={handleScoutGrounding}
                            disabled={scouting || !scoutQuery.trim()}
                            className="px-4 py-2 bg-[#2D2D24] hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 select-none cursor-pointer text-nowrap"
                          >
                            <Search className="h-3 w-3" />
                            <span>{scouting ? "Scouting..." : "Scout Journals"}</span>
                          </button>
                        </div>

                        {/* Scout Output Results */}
                        <AnimatePresence>
                          {(scouting || scoutError || scoutResults.length > 0) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-3"
                            >
                              <div className="bg-[#F2EDE4]/55 border border-[#E8E4D9] p-4 rounded-xl flex flex-col gap-3.5">
                                {scouting && (
                                  <div className="py-4 text-center flex flex-col items-center justify-center gap-2">
                                    <RefreshCw className="h-5 w-5 text-[#7C8464] animate-spin" />
                                    <span className="text-[10px] font-mono tracking-wide text-[#5A5A4A] animate-pulse">
                                      MINING WORLDWIDE SCHOLAR PLACES AND EXTRACTING WEB GROUNDED PREPRINTS...
                                    </span>
                                  </div>
                                )}

                                {scoutError && !scouting && (
                                  <div className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                                    ⚠️ {scoutError}
                                  </div>
                                )}

                                {scoutResults.length > 0 && !scouting && (
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E4D9]">
                                      <span className="text-[10px] font-mono font-bold text-[#7C8464] uppercase font-bold">Scouted Publications Discovered</span>
                                      <button 
                                        onClick={() => setScoutResults([])} 
                                        className="text-[9px] font-mono text-[#8C8474] hover:text-[#2D2D24] uppercase font-bold"
                                      >
                                        Dismiss
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      {scoutResults.map((sp, spIdx) => (
                                        <div key={spIdx} className="bg-white border border-[#E8E4D9] p-3 rounded-xl flex flex-col justify-between hover:border-[#7C8464]/50 transition-all text-left">
                                          <div>
                                            <div className="flex justify-between items-start gap-1 mb-1.5">
                                              <span className="text-[8px] font-mono uppercase bg-[#7C8464]/10 text-[#7C8464] px-1.5 py-0.5 rounded font-black">
                                                {sp.source_name || "ArXiv"}
                                              </span>
                                              <span className="text-[8px] font-mono text-[#8C8474]">
                                                {sp.publish_date}
                                              </span>
                                            </div>

                                            <h6 className="font-serif font-black text-xs text-[#2D2D24] line-clamp-2 leading-snug">
                                              {sp.title}
                                            </h6>
                                            <p className="text-[9px] text-[#8C8474] font-mono truncate mt-0.5 mb-1.5">
                                              {sp.authors}
                                            </p>
                                            <p className="text-[10px] text-[#5A5A4A] leading-relaxed line-clamp-3 italic">
                                              "{sp.abstract}"
                                            </p>
                                          </div>

                                          <div className="flex items-center justify-between border-t border-[#F1EDE4] pt-2 mt-2.5">
                                            <a 
                                              href={sp.original_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[9px] text-[#7C8464] font-semibold hover:underline flex items-center gap-0.5"
                                            >
                                              <span>Source Link</span>
                                            </a>

                                            <button
                                              onClick={() => {
                                                const exists = livePapers.some(p => p.original_url === sp.original_url);
                                                if (!exists) {
                                                  setLivePapers(prev => [sp, ...prev]);
                                                }
                                                alert(`"${sp.title}" is added to the session desk! Focus filters now to access.`);
                                              }}
                                              className="bg-[#7C8464] hover:bg-[#6A7153] text-[9px] text-white font-bold px-2.5 py-1 rounded-lg select-none cursor-pointer"
                                            >
                                              + Add
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Loader states for latest papers */}
                    {loadingLive && (
                      <div className="flex flex-col gap-3 py-6 items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-[#7C8464] animate-spin" />
                        <p className="text-xs text-[#8C8474] font-mono animate-pulse mt-2">
                          CRAWLING LIVE RESEARCH PORTALS...
                        </p>
                      </div>
                    )}

                    {liveError && !loadingLive && (
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-center text-xs text-amber-800 leading-relaxed">
                        ⚠️ {liveError}
                      </div>
                    )}

                    {!loadingLive && !liveError && livePapers.length === 0 && (
                      <div className="p-8 text-center text-xs text-[#8C8474] bg-[#F9F7F2]/40 rounded-2xl border border-dashed border-[#E8E4D9]">
                        Waiting to sync papers from live scientific sources. Click "Sync Feeds" above or refresh the app!
                      </div>
                    )}

                    {/* Papers items grouped by topic, sorted by publish date descending */}
                    {!loadingLive && livePapers.length > 0 && (
                      <div className="flex flex-col gap-8">
                        {getGroupedAndSortedPapers().map((group, groupIdx) => (
                          <div key={groupIdx} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-[#E8E4D9]">
                              <span className="w-1.5 h-3.5 bg-[#7C8464] rounded-full" />
                              <h5 className="font-serif font-bold text-[#2D2D24] text-xs sm:text-sm tracking-wide">
                                {group.topic}
                              </h5>
                              <span className="text-[9px] font-mono bg-[#F2EDE4] text-[#5A5A4A] px-2 py-0.5 rounded-full font-bold">
                                {group.papers.length} {group.papers.length === 1 ? 'article' : 'articles'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              {group.papers.map((paper, idx) => {
                                let formattedDate = "";
                                if (paper.publish_date) {
                                  try {
                                    const d = new Date(paper.publish_date);
                                    if (!isNaN(d.getTime())) {
                                      formattedDate = d.toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      });
                                    }
                                  } catch (e) {}
                                }

                                return (
                                  <div 
                                    key={idx}
                                    className="p-6 rounded-2xl border border-[#E8E4D9]/80 bg-[#F9F7F2]/20 hover:bg-[#F2EDE4]/30 hover:border-[#7C8464]/60 transition-all flex flex-col justify-between items-stretch gap-4 text-left"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono uppercase tracking-wider bg-[#2D2D24] text-white px-2 py-0.5 rounded font-bold">
                                          {paper.source_name}
                                        </span>
                                        {formattedDate && (
                                          <span className="text-[10px] font-mono bg-[#7C8464]/30 text-[#1F2317] px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                                            📅 {formattedDate}
                                          </span>
                                        )}
                                        <span className="text-[10px] font-mono text-[#2D2D24] font-bold line-clamp-1">
                                          by {paper.authors}
                                        </span>
                                      </div>
                                      <h6 className="font-serif font-bold text-[#1E2019] text-base sm:text-[17px] leading-snug mt-2 mb-2" style={{ marginBottom: "8px" }}>
                                        {paper.title}
                                      </h6>
                                      <p className="text-xs text-[#4F543B] leading-relaxed line-clamp-3">
                                        {paper.abstract}
                                      </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-[#E8E4D9]/40 w-full flex-row flex-wrap sm:flex-nowrap">
                                      <button
                                        onClick={() => handleToggleReadLater(paper)}
                                        className={`text-center text-[10px] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-bold whitespace-nowrap shadow-xs ${
                                          isBookmarked(paper)
                                            ? "bg-[#7C8464]/15 border border-[#7C8464]/40 text-[#4D543B] hover:bg-[#7C8464]/25"
                                            : "bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4]"
                                        }`}
                                      >
                                        <Bookmark className={`h-3 w-3 ${isBookmarked(paper) ? "fill-[#7C8464] text-[#7C8464]" : ""}`} />
                                        {isBookmarked(paper) ? "Saved" : "Read Later"}
                                      </button>
                                      
                                      <a
                                        href={paper.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-center text-[10px] bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-bold whitespace-nowrap shadow-xs"
                                      >
                                        <Globe className="h-3 w-3" />
                                        Original Site
                                      </a>
                                      
                                      <button
                                        onClick={() => handleSelectLivePaper(paper)}
                                        className="text-center text-[11px] bg-[#7C8464] hover:bg-[#6A7153] text-white px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                                      >
                                        🔬 Load Into Lab
                                      </button>

                                      <button
                                        onClick={() => {
                                        }}
                                        className="text-center text-[11px] bg-[#E8E4D9]/60 hover:bg-[#E8E4D9] text-[#2D2D24] px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                                      >
                                        🧬 Select for Fusion
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Custom Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-natural-border rounded-xl p-8 sm:p-12 shadow-xs relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                    {/* Elegant Minimalist Academic Pulse Loader */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-natural-border"></div>
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-natural-primary border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ rotation: { duration: 1.2, repeat: Infinity, ease: "linear" } }}
                      ></motion.div>
                      <Compass className="h-6 w-6 text-natural-primary" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-natural-highlight text-natural-primary border border-natural-border px-3 py-1 rounded">
                        Lumina Scientific Synthesis
                      </span>
                      <h3 className="text-xl font-serif font-bold text-natural-title mt-3">
                        Analyzing and Translating Cohort Materials...
                      </h3>
                      <p className="text-xs text-natural-text mt-1">
                        Active Level: <span className="font-bold">{explanationLevel} Context Standard</span>
                      </p>
                    </div>

                    {/* Progress feedback block */}
                    <div className="w-full max-w-sm bg-natural-highlight h-1.5 rounded-full overflow-hidden border border-natural-border">
                      <motion.div 
                        className="bg-natural-primary h-full rounded-full"
                        animate={{ width: ["15%", "45%", "75%", "92%", "92%"] }}
                        transition={{ duration: 7, ease: "easeInOut" }}
                      />
                    </div>

                    <p className="text-natural-text italic text-sm max-w-sm mt-3 font-serif">
                      &ldquo;{loadingMessages[0]}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error state message */}
              {!loading && error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#F2EDE4] border border-[#D6D0C2] text-[#434338] rounded-[32px] p-6 shadow-sm flex items-start gap-4"
                >
                  <AlertCircle className="h-6 w-6 text-[#7C8464] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-[#2D2D24] text-lg">
                      Deconstruction Error
                    </h4>
                    <p className="text-sm mt-1.5 leading-relaxed text-[#5A5A4A]">
                      {error}
                    </p>
                    <div className="flex gap-2.5 mt-4">
                      <button
                        onClick={handleSubmit}
                        className="bg-[#7C8464] hover:bg-[#6A7153] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Retry Translation
                      </button>
                      <button
                        onClick={() => {
                          setResult(null);
                          setError(null);
                          setTitle("");
                          setAbstract("");
                        }}
                        className="bg-white border border-[#E8E4D9] text-[#5A5A4A] hover:bg-[#F2EDE4] text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Back to Feed
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Final Successful Result */}
              {!loading && !error && result && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className={`grid grid-cols-1 gap-8 w-full ${splitScreenPaper ? "lg:grid-cols-12 items-start" : ""}`}>
                    {/* Left Column: Workspace Core Analysis */}
                    {highDensity ? (
                      <div className={`w-full ${splitScreenPaper ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-3.5`}>
                        <div className={splitScreenPaper ? "grid grid-cols-1 md:grid-cols-2 gap-3.5" : "grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full items-start"}>
                          {/* Left Column: Metadata & Navigation */}
                          <div className={splitScreenPaper ? "flex flex-col gap-3" : "lg:col-span-3 flex flex-col gap-3"}>
                            {renderBackButtonAndHorizonMapTrigger()}
                            {renderAdaptiveViewControl()}
                            {renderCatchySimplifiedTitle()}
                            {renderExcitingHookSection()}
                            {renderActionsActionBar()}
                          </div>

                          {/* Middle Column: The Core Text & Deep Details */}
                          <div className={splitScreenPaper ? "flex flex-col gap-3" : "lg:col-span-5 flex flex-col gap-3"}>

                            {renderBigIdeaGrid()}
                            {renderRealWorldImpact()}
                            {renderGroundedEvidence()}
                          </div>

                          {/* Right Column: Jargon & Discovered Exploits */}
                          <div className={splitScreenPaper ? "col-span-1 md:col-span-2 flex flex-col gap-3" : "lg:col-span-4 flex flex-col gap-3"}>

                            {renderJargonGlossary()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex flex-col gap-6 w-full ${splitScreenPaper ? "lg:col-span-7" : ""}`}>
                  
                   {/* Back to Feed button & Horizon Map Trigger */}
                   {renderBackButtonAndHorizonMapTrigger()}

                
                  
                  {/* Adaptive View Toggle Control */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F2EDE4]/60 p-4 rounded-[24px] border border-[#D6D0C2] gap-3">
                    <div className="flex flex-col px-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#2D2D24] font-bold uppercase tracking-wider">
                        <Sparkle className="h-4 w-4 text-[#7C8464] animate-pulse" />
                        Adaptive View Control
                      </div>
                      <span className="text-[10px] text-[#8C8474] font-mono leading-tight mt-0.5">
                        Instantly adjust the verbosity and mechanical depth of the generated breakdown!
                      </span>
                    </div>
                    <div className="bg-white/90 p-1 rounded-xl flex gap-1 w-full sm:w-auto shadow-sm border border-[#E8E4D9]">
                      <button
                        type="button"
                        onClick={() => setViewMode("concept")}
                        className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          viewMode === "concept"
                            ? "bg-[#7C8464] text-white shadow font-semibold"
                            : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
                        }`}
                      >
                        💡 Concept Focused
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("detail")}
                        className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          viewMode === "detail"
                            ? "bg-[#7C8464] text-white shadow font-semibold"
                            : "text-[#5A5A4A] hover:bg-[#F2EDE4]/60 font-medium"
                        }`}
                      >
                        🔬 Deep Detail
                      </button>
                    </div>
                  </div>

                  {/* Catchy Simplified Title */}
                  <div className="bg-white border border-[#E8E4D9] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-[#F9F7F2] rounded-full -z-10 opacity-60"></div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase text-[#8C8474] bg-[#F2EDE4] border border-[#E8E4D9] px-3 py-1 rounded-lg whitespace-nowrap">
                        {viewMode === "concept" ? "Concept Focused • Catchy Title" : "Detailed Analysis • Catchy Title"}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D24] tracking-tight leading-tight mt-1">
                      {result.simplified_title}
                    </h2>
                  </div>

                  {/* Exciting Hook Section */}
                  <motion.div
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex gap-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 translate-x-3 -translate-y-3">
                      <Flame className="h-24 w-24 text-[#7C8464]/5" />
                    </div>
                    
                    <div className="bg-[#F2EDE4] text-[#7C8464] p-3 h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C8464] font-mono">The Hook: Why it is cool!</span>
                      <p className="text-lg text-[#5A5A4A] italic font-medium leading-relaxed mt-1.5 font-serif">
                        "{result.one_sentence_hook}"
                      </p>
                    </div>
                  </motion.div>



                  {/* Big Idea Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Big Idea Description */}
                    {renderBigIdeaDescription()}

                    {/* Key Findings in Beautiful Forest Green Column (Matches Design HTML) */}
                    <div className="bg-[#7C8464] rounded-[32px] p-7 text-white shadow-lg flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-5 flex items-center gap-2">
                          <Layers className="h-4 w-4" /> Key Discoveries
                        </h3>
                        
                        <ul className="space-y-5">
                          {(viewMode === "concept"
                            ? (result.key_findings_concept || result.key_findings || [])
                            : (result.key_findings_detail || result.key_findings || [])).map((finding, idx) => (
                            <li 
                              key={idx} 
                              id={`claim-discovery-${idx}`}
                              className={`flex gap-3 items-start p-3 rounded-2xl transition-all duration-500 ${
                                hoveredMatrixCard === `claim-discovery-${idx}`
                                  ? "bg-white/10 text-white font-medium scale-[1.02] shadow-sm ml-1 pr-1 border-l-4 border-white"
                                  : "opacity-100"
                              }`}
                            >
                              <span className="w-5 h-5 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="text-sm leading-snug text-white/95 text-justify">
                                {renderTextWithJargonHighlights(finding, result.jargon_cheat_sheet)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-white/60 font-mono text-center">
                        {result.explanation_level ? `Verified ${result.explanation_level} Level Insights` : "Verified High-School Core Mechanics"}
                      </div>
                    </div>

                  </div>

                  {/* Real-world Impact to Teenagers */}
                  <div className="bg-white rounded-[32px] p-7 shadow-sm border border-[#E8E4D9] flex flex-col gap-4 overflow-hidden">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#B4A086] flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Why It Matters to Future Generations
                    </h3>

                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#2D2D24] mb-2">
                        Real-World Impact
                      </h4>
                      <p className="text-[15px] text-[#5A5A4A] leading-relaxed mb-4">
                        {renderTextWithJargonHighlights(
                          viewMode === "concept"
                            ? (result.real_world_impact_concept || result.real_world_impact || "")
                            : (result.real_world_impact_detail || result.real_world_impact || ""),
                          result.jargon_cheat_sheet
                        )}
                      </p>
                    </div>

                    <div className="mt-auto p-4 bg-[#F9F7F2] rounded-2xl flex items-center gap-4 border border-[#E8E4D9]">
                      <div className="w-12 h-12 bg-[#D6D0C2] rounded-xl flex items-center justify-center text-2xl">🌍</div>
                      <p className="text-xs font-medium text-[#8C8474] leading-tight">
                        This discovery empowers your generation to innovate tomorrow's technology, health, and conservation fields starting today!
                      </p>
                    </div>
                  </div>

                  {renderGroundedEvidence()}

                  {/* Thesis Validation & Dialectics Matrix */}

                  {false && (
                    <div className="bg-white rounded-[32px] p-7 border border-[#E8E4D9] shadow-sm flex flex-col gap-5">
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
                        className="p-1 px-3 bg-[#F9F7F2] hover:bg-[#F2EDE4] border border-[#E8E4D9] rounded-xl text-xs font-bold text-[#5A5A4A] transition-all cursor-pointer flex items-center gap-1.5"
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
                                               </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  )}

                  {/* Jargon Glossary Cheat Sheet */}
                  <div className="bg-[#EAE6D6] rounded-[32px] p-7 border border-[#D6D0C2] flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#5A5A4A] flex justify-between items-center w-full">
                          <span>Jargon Cheat Sheet</span>
                        </h3>
                        <p className="text-[11px] text-[#8C8474] mt-1 font-mono">
                          {result.jargon_cheat_sheet.length} terms deconstructed into simple, memorable analogies
                        </p>
                      </div>

                      {/* Search box for jargon glossary */}
                      <div className="relative flex-shrink-0 w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search jargon terms..."
                          value={jargonQuery}
                          onChange={(e) => setJargonQuery(e.target.value)}
                          className="w-full text-xs p-2.5 pl-8 bg-white/60 border border-[#D6D0C2] rounded-xl focus:border-[#7C8464] focus:outline-none placeholder:text-[#8C8474]/70"
                        />
                        <Search className="h-3.5 w-3.5 text-[#8C8474]/80 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  ? "jargon-card-pulse border-[#7C8464] shadow-md" 
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

                  {/* Actions log action bar */}
                  <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border border-[#E8E4D9] rounded-[24px] bg-white gap-3">
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSaveToStudyLog}
                        className="px-5 py-2.5 bg-[#7C8464] hover:bg-[#6A7153] text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <BookMarked className="h-3.5 w-3.5" />
                        Save to Study Log
                      </button>
                      <button 
                        onClick={() => alert("Link copied to clipboard!.")}
                        className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E8E4D9] rounded-full text-xs font-bold text-[#5A5A4A] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share with Class
                      </button>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-widest">
                      {result.explanation_level === "Middle School" && "Curriculum Standard: Middle School STEM Level"}
                      {result.explanation_level === "High School" && "Curriculum Standard: Grade 11 STEM Alignment"}
                      {result.explanation_level === "Undergrad" && "Academic Level: College Undergraduate Standard"}
                      {result.explanation_level === "Graduate" && "Analytical Level: Graduate Research Standard"}
                      {result.explanation_level === "PhD" && "Scientific Rigor: post-doctoral / faculty Level"}
                      {!result.explanation_level && "Curriculum Standard: Grade 11 STEM Alignment"}
                    </div>
                  </div>

                      </div>
                    )}

                {/* Right Column: Split-Screen Comparison Drawer inside active workspace */}
                {splitScreenPaper && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="lg:col-span-5 w-full bg-white border border-[#E8E4D9] rounded-[32px] p-6 shadow-md flex flex-col gap-5 lg:sticky lg:top-6 self-start max-h-[88vh] overflow-y-auto"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE4]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7C8464] animate-pulse" />
                        <h3 className="font-serif font-bold text-[#2D2D24] text-base leading-tight">
                          Comparative Split-Screen
                        </h3>
                      </div>
                      <button
                        onClick={() => setSplitScreenPaper(null)}
                        className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Connection Type Indicator Header */}
                    <div className="p-4 rounded-2xl flex flex-col gap-1.5 border" style={{
                      backgroundColor: splitScreenPaper.id.startsWith("sup")
                        ? "rgba(124,132,100,0.06)"
                        : splitScreenPaper.id.startsWith("con")
                        ? "rgba(180,160,134,0.08)"
                        : "rgba(140,132,116,0.06)",
                      borderColor: splitScreenPaper.id.startsWith("sup")
                        ? "rgba(124,132,100,0.2)"
                        : splitScreenPaper.id.startsWith("con")
                        ? "rgba(180,160,134,0.2)"
                        : "rgba(140,132,116,0.2)"
                    }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C8464]">
                          Dialectic Mode
                        </span>
                        <span className="text-[9px] font-mono text-[#8C8474]">
                          Score: {splitScreenPaper.citations} citations
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {splitScreenPaper.id.startsWith("sup") ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-[#7C8464]" />
                        ) : splitScreenPaper.id.startsWith("con") ? (
                          <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
                        ) : (
                          <GitCompare className="h-4.5 w-4.5 text-slate-600" />
                        )}
                        <h4 className="font-serif font-bold text-sm text-[#2D2D24]">
                          {splitScreenPaper.id.startsWith("sup")
                            ? "Supporting Evidence & Verification"
                            : splitScreenPaper.id.startsWith("con")
                            ? "Active Contradiction/Critique Found"
                            : "Methodological Benchmark Variant"}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5A5A4A] leading-relaxed italic mt-1">
                        "{splitScreenPaper.convergence}"
                      </p>
                    </div>

                    {/* Papers Side-by-Side Metadata Cards */}
                    <div className="flex flex-col gap-3.5">
                      {/* Main Paper Card */}
                      <div className="p-4 bg-[#F9F7F2]/60 rounded-xl border border-[#E8E4D9]">
                        <span className="text-[9px] font-mono font-bold text-[#8C8474] uppercase tracking-wide">
                          [Primary Active Paper]
                        </span>
                        <h5 className="font-serif font-bold text-[#2D2D24] text-xs leading-snug mt-1">
                          {result.simplified_title}
                        </h5>
                        <p className="text-[11px] text-[#5A5A4A] leading-relaxed mt-1.5 font-mono line-clamp-3 italic">
                          "{result.one_sentence_hook}"
                        </p>
                      </div>

                      {/* Comparative Paper Card */}
                      <div className="p-4 bg-white rounded-xl border border-[#7C8464]/30 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#7C8464]/5 rounded-full -z-10" />
                        <div className="flex justify-between items-center text-[9px] font-mono text-[#8C8474] uppercase tracking-wide">
                          <span>[Comparative Study]</span>
                          <span className="text-[#7C8464] font-bold">{splitScreenPaper.journal}</span>
                        </div>
                        <h5 className="font-serif font-bold text-[#2D2D24] text-xs leading-snug mt-1">
                          {splitScreenPaper.claim}
                        </h5>
                        <p className="text-[10px] text-[#8C8474] font-mono mt-1">
                          By {splitScreenPaper.authors}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Abstract Comparison context */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-[#F2EDE4]">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#8C8474]">
                        Comparative Abstract Snapshot:
                      </span>
                      <p className="text-xs text-[#5A5A4A] leading-relaxed bg-[#F9F7F2] p-4 rounded-xl border border-[#E8E4D9]/40 text-justify">
                        {splitScreenPaper.abstract}
                      </p>
                    </div>

                    {/* Dialectics Context explanation */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 leading-relaxed italic">
                      💡 <strong>Dialectics Summary:</strong> {splitScreenPaper.summary} Highlighted sections in Lumina's main pane indicate original claims analyzed under peer assessment.
                    </div>

                    {/* Split comparative Actions */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-[#F2EDE4] mt-auto">
                      <button
                        onClick={async () => {
                          const paperToLoad: LivePaper = {
                            title: splitScreenPaper.claim,
                            authors: splitScreenPaper.authors,
                            abstract: splitScreenPaper.abstract,
                            source_name: splitScreenPaper.journal,
                            original_url: splitScreenPaper.originalUrl,
                          };
                          setSplitScreenPaper(null);
                          await handleSelectLivePaper(paperToLoad);
                        }}
                        className="w-full bg-[#7C8464] hover:bg-[#6A7153] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Load comparative paper as Main Article</span>
                      </button>
                      
                      <a
                        href={splitScreenPaper.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white hover:bg-[#F2EDE4] text-[#5A5A4A] border border-[#E8E4D9] py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#8C8474]" />
                        <span>View Original Source Archive</span>
                      </a>
                    </div>
                  </motion.div>
                )}

              </div> {/* End Grid Row container */}

                </motion.div>
              )}
              
            </AnimatePresence>

          </section>

        
      </main>


      {/* Reading List Slide-over Drawer Panel */}
      <AnimatePresence>
        {showReadingList && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="reading-list-drawer">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReadingList(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-md"
              >
                <div className="h-full flex flex-col bg-[#F9F7F2] shadow-2xl border-l border-[#E8E4D9] overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-6 bg-white border-b border-[#E8E4D9] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-[#7C8464]/10 p-2 rounded-xl text-[#7C8464]">
                        <BookMarked className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-[#2D2D24] text-lg leading-none">Your Reading List</h2>
                        <span className="text-[10px] font-mono font-bold text-[#8C8474] uppercase tracking-wider mt-1 block">
                          {readingList.length} {readingList.length === 1 ? "article" : "articles"} queued
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowReadingList(false)}
                      className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* List Body */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-4">
                    {readingList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="bg-[#E8E4D9]/40 p-5 rounded-full text-[#8C8474]">
                          <Bookmark className="h-8 w-8" />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-serif font-bold text-[#2D2D24] text-sm">Your queue is empty</p>
                          <p className="text-xs text-[#5A5A4A] mt-1.5 leading-relaxed">
                            Browse the scientific portal updates on the homepage and click <strong className="text-[#7C8464]">"Read Later"</strong> to curate your ultimate active syllabus list.
                          </p>
                        </div>
                      </div>
                    ) : (
                      readingList.map((paper, idx) => {
                        let paperDate = "";
                        if (paper.publish_date) {
                          try {
                            const d = new Date(paper.publish_date);
                            if (!isNaN(d.getTime())) {
                              paperDate = d.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              });
                            }
                          } catch (_) {}
                        }

                        return (
                          <div 
                            key={idx}
                            className="bg-white border border-[#E8E4D9] rounded-2xl p-4.5 flex flex-col gap-3 shadow-xs hover:border-[#7C8464]/50 transition-all text-left"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] font-mono uppercase tracking-wider bg-[#5A5A4A] text-white px-1.5 py-0.5 rounded font-bold">
                                  {paper.source_name}
                                </span>
                                {paperDate && (
                                  <span className="text-[9px] font-mono text-[#7C8464] bg-[#7C8464]/10 px-1.5 py-0.5 rounded font-medium">
                                    📅 {paperDate}
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] leading-snug line-clamp-2">
                                {paper.title}
                              </h3>
                              
                              <p className="text-[10px] font-mono text-[#8C8474] mt-1 line-clamp-1">
                                {paper.authors}
                              </p>
                            </div>

                            <div className="flex gap-2 items-center justify-between border-t border-[#F2EDE4] pt-2.5 mt-1">
                              <button
                                onClick={() => {
                                  setReadingList(prev => prev.filter(item => item.original_url !== paper.original_url));
                                }}
                                className="p-1 px-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Remove</span>
                              </button>

                              <div className="flex gap-1.5">
                                <a
                                  href={paper.original_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] bg-[#F2EDE4] hover:bg-[#E8E4D9] text-[#5A5A4A] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1"
                                >
                                  <Globe className="h-2.5 w-2.5" />
                                  <span>Site</span>
                                </a>
                                
                                <button
                                  onClick={async () => {
                                    setShowReadingList(false);
                                    await handleSelectLivePaper(paper);
                                  }}
                                  className="text-[10px] bg-[#7C8464] hover:bg-[#6A7153] text-white px-2.5 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <span>🔬 Lab</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Drawer Footer */}
                  {readingList.length > 0 && (
                    <div className="p-4 bg-white border-t border-[#E8E4D9] flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setShowReadingList(false);
                          setCompilingDossier(true);
                        }}
                        className="w-full text-center text-xs bg-amber-950 hover:bg-amber-900 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 select-none"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Compile Study Dossier</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to clear your entire Reading List?")) {
                            setReadingList([]);
                          }
                        }}
                        className="w-full text-center text-[10px] text-[#8C8474] hover:text-red-600 font-bold py-1.5 transition-colors cursor-pointer hover:bg-red-50/20 rounded-lg"
                      >
                        Clear All Items
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>


      {/* Lumina Custom Science Compiler / Dossier Sheet Overlay */}
      <SynthesisDossier
        compilingDossier={compilingDossier}
        setCompilingDossier={setCompilingDossier}
        readingList={readingList}
        setReadingList={setReadingList}
      />

      {/* Lumina Custom Markdown to JSX Renderer */}
      {false && (() => {
        const dossierLevel = "High School";
        const dossierResult = "";
        const generatingDossier = false;
        const handleCompileDossier = (...args: any[]) => {};
        const readingList: any[] = [];
        const setReadingList = (...args: any[]) => {};
        const setCompilingDossier = (...args: any[]) => {};
        const compilingDossier = false;
        const setDossierResult = (...args: any[]) => {};
        const setDossierError = (...args: any[]) => {};
        const setDossierLevel = (...args: any[]) => {};
        const setDossierCopied = (...args: any[]) => {};
        const dossierCopied = false;
        const dossierError = null as any;

        const renderMarkdownToJSX = (markdownText: string) => {
          if (!markdownText) return null;
          const lines = markdownText.split("\n");
          return lines.map((line, idx) => {
            const text = line.trim();
            if (!text) return <div key={idx} className="h-2" />;
            
            // Bold mapping inside text helper
            const parseInlineFormatting = (rawLine: string) => {
              const boldRegex = /\*\*(.*?)\*\//g; // Corrected slightly or replaced to custom fallback
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
                <h4 key={idx} className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24] mt-4 mb-2 border-b border-[#E8E4D9]/50 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]" />
                  <span>{parseInlineFormatting(text.replace("###", "").trim())}</span>
                </h4>
              );
            }
            if (text.startsWith("##")) {
              return (
                <h3 key={idx} className="font-serif font-black text-xs sm:text-sm text-amber-950 uppercase tracking-widest mt-6 mb-3 flex items-center gap-2 border-l-2 border-amber-950 pl-2 py-0.5">
                  <span>{parseInlineFormatting(text.replace("##", "").trim())}</span>
                </h3>
              );
            }
            if (text.startsWith("#")) {
              return (
                <h2 key={idx} className="font-serif font-black text-sm sm:text-base text-gray-900 border-l-4 border-amber-950 pl-3 py-1 my-6 bg-amber-50/45 rounded-r-lg">
                  <span>{parseInlineFormatting(text.replace("#", "").trim())}</span>
                </h2>
              );
            }
            
            // Bullet points
            if (text.startsWith("-") || text.startsWith("*")) {
              const content = text.replace(/^[-*]\s*/, "");
              return (
                <div key={idx} className="flex gap-2 items-start pl-4 my-1.5 text-xs text-[#5A5A4A] leading-relaxed">
                  <span className="text-[#7C8464] select-none mt-1">•</span>
                  <p className="flex-1">{parseInlineFormatting(content)}</p>
                </div>
              );
            }

            // Numbered lists
            if (/^\d+\s*\.\s/.test(text)) {
              const content = text.replace(/^\d+\s*\.\s*/, "");
              const numMatch = text.match(/^(\d+)\s*\.\s*/);
              const num = numMatch ? numMatch[1] : "1";
              return (
                <div key={idx} className="flex gap-2 items-start pl-4 my-1.5 text-xs text-[#5A5A4A] leading-relaxed">
                  <span className="text-amber-950 font-mono font-bold text-[10px] select-none mt-0.5">{num}.</span>
                  <p className="flex-1">{parseInlineFormatting(content)}</p>
                </div>
              );
            }
            
            // Default paragraphs
            return (
              <p key={idx} className="text-xs text-[#5A5A4A] leading-relaxed my-2">
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
                    <div>
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
                    <div className="bg-white border border-natural-border rounded-2xl p-5 shadow-xs flex flex-col gap-4">
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
                    <div className="bg-white border border-natural-border rounded-2xl p-5 shadow-xs flex flex-col gap-3 flex-1 min-h-[250px] lg:min-h-0 text-left">
                      <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-2">
                        <div>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2D2D24]">Curated Papers Bundle</h3>
                          <p className="text-[10px] text-[#8C8474]">Articles currently selected for compilation</p>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-950/10 text-amber-950 px-2 py-0.5 rounded-full font-bold font-bold">
                          {readingList.length} Selected
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[300px] lg:max-h-[450px]">
                        {readingList.map((paper, rpIdx) => (
                          <div key={rpIdx} className="bg-[#F9F7F2]/50 border border-[#E8E4D9] p-3 rounded-xl flex justify-between items-start gap-3 text-left">
                            <div className="flex-1 text-left">
                              <span className="text-[8px] font-mono uppercase bg-amber-950/20 text-amber-950 px-1 py-0.5 rounded font-black font-black">
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
                  <div className="lg:col-span-7 flex flex-col min-h-[400px] lg:min-h-0 bg-white border border-natural-border rounded-2xl shadow-xs overflow-hidden">
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
                        <div className="prose max-w-none text-left leading-relaxed">
                          {renderMarkdownToJSX(dossierResult)}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-16 text-center gap-4">
                          <div className="bg-[#E8E4D9]/30 p-5 rounded-full text-[#8C8474]">
                            <BookMarked className="h-8 w-8" />
                          </div>
                          <div className="max-w-xs">
                            <p className="font-serif font-bold text-sm text-[#2D2D24]">Waiting for synthesis engine</p>
                            <p className="text-xs text-[#5A5A4A] mt-2 leading-relaxed">
                              Your custom study workspace lists <strong className="text-amber-950 font-bold">{readingList.length} articles</strong> queued. Click the <strong className="text-[#7C8464] font-bold">"Generate Custom Study Dossier"</strong> button on the left to invoke the synthesis engine and build an exportable study briefing companion!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-3 border-t border-[#E8E4D9] bg-slate-50 text-[9px] font-mono text-[#8C8474] font-medium uppercase tracking-wider select-none flex justify-between items-center">
                      <span>Aggregation Pipeline Standard</span>
                      <span>{dossierLevel} Integration Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        );
      })()}

      <AnimatePresence>
        {showAboutUs && (
          <AboutUs onClose={() => setShowAboutUs(false)} />
        )}
      </AnimatePresence>



      {/* Symmetrical Minimalist Footer */}
      <footer className="py-6 mt-16 border-t border-[#E8E4D9] bg-white text-xs text-[#8C8474]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono select-none">
            <span className="font-bold text-[#5A5A4A]">Lumina</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
            <span>• All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAboutUs(true)}
              className="text-[#7C8464] hover:text-[#6A7153] hover:underline font-bold transition-all cursor-pointer font-serif text-[12px] flex items-center gap-1 bg-transparent border-none p-0"
            >
              • Learn More & About Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
