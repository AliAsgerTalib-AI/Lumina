import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as d3 from "d3";
import { 
  Network, X, Sparkles, BookOpen, Search, PlusCircle, RotateCcw, 
  GitCommit, ArrowRight, Activity, HelpCircle, Eye, Info, Check, AlertCircle, RefreshCw
} from "lucide-react";

// Types matching server response
interface CitationNode extends d3.SimulationNodeDatum {
  id: string;
  type: "upstream" | "upstream-2" | "downstream" | "downstream-2" | "center" | "grafted";
  title: string;
  authors: string;
  year: number;
  citations: number;
  isPreprint: boolean;
  shortTitle: string;
  abstract: string;
  summary: string;
}

interface CitationLink extends d3.SimulationLinkDatum<CitationNode> {
  source: string | CitationNode;
  target: string | CitationNode;
  id: string;
}

interface CitationHorizonGraphProps {
  activePaper: {
    simplified_title: string;
    original_title: string;
    explanation_level?: string;
    summary?: string;
    key_insights?: any[];
    authors?: string;
    year?: number;
    publish_date?: string;
    original_url?: string;
  } | null;
  onClose: () => void;
  onLoadAsMainArticle: (paper: any) => Promise<void>;
  explanationLevel: string;
}

export default function CitationHorizonGraph({ 
  activePaper, 
  onClose, 
  onLoadAsMainArticle,
  explanationLevel 
}: CitationHorizonGraphProps) {
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Interactive network states
  const [nodes, setNodes] = useState<CitationNode[]>([]);
  const [links, setLinks] = useState<CitationLink[]>([]);
  const [paradigmShiftText, setParadigmShiftText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorOnLoad, setErrorOnLoad] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<CitationNode | null>(null);
  
  // History of traversing for paradigm tracking
  const [traversalPath, setTraversalPath] = useState<CitationNode[]>([]);
  
  // D3 controls
  const [physicsOn, setPhysicsOn] = useState<boolean>(true);
  const [collisionStrength, setCollisionStrength] = useState<number>(35);
  
  // Searching & Grafting custom papers
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchingGraft, setSearchingGraft] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [graftAnchorNode, setGraftAnchorNode] = useState<CitationNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CitationNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dynamic D3 Simulation instance ref
  const simulationRef = useRef<d3.Simulation<CitationNode, CitationLink> | null>(null);

  // Initial load
  useEffect(() => {
    if (activePaper) {
      const paperYear = activePaper.year || (activePaper.publish_date ? parseInt(activePaper.publish_date.split("-")[0]) : 2026);
      const initialCenter: CitationNode = {
        id: "center-node",
        type: "center",
        title: activePaper.simplified_title || activePaper.original_title || "Current Study",
        authors: activePaper.authors || "Active Workspace Specimen",
        year: paperYear,
        citations: 154,
        isPreprint: false,
        shortTitle: activePaper.simplified_title ? activePaper.simplified_title.split(" ").slice(0, 2).join(" ") + "..." : "Current Study",
        abstract: activePaper.summary || "No academic abstract loaded.",
        summary: "The active paper loaded in the primary workspace. Click explore to traverse surrounding citations.",
      };
      
      setTraversalPath([initialCenter]);
      setFocusedNode(initialCenter);
      fetchCitationNetwork(initialCenter.title, initialCenter.abstract, {
        authors: initialCenter.authors,
        year: initialCenter.year,
        citations: initialCenter.citations,
        shortTitle: initialCenter.shortTitle
      });
    }
  }, [activePaper]);

  // Helper to fetch citations surrounding a target title
  const fetchCitationNetwork = async (
    title: string, 
    abstractText: string,
    metadata?: { authors?: string; year?: number; citations?: number; shortTitle?: string }
  ) => {
    setLoading(true);
    setErrorOnLoad(null);
    try {
      const response = await fetch("/api/citation-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          abstract: abstractText,
          level: explanationLevel,
          year: metadata?.year
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to trace citation lineage.`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid server response: Expected academic data, but received an unexpected webpage response. Please check your config keys.");
      }

      const data = await response.json();
      
      // Generate standard safe hash suffix to prevent ID collision and node sticky coordinates in D3 across pivots
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = (hash << 5) - hash + title.charCodeAt(i);
        hash |= 0;
      }
      const uniqueSuffix = Math.abs(hash).toString(36).substring(0, 5);

      // Form structural nodes (inject current center paper + upstream + downstream)
      const centerNode: CitationNode = {
        id: "center-node",
        type: "center",
        title: title,
        authors: metadata?.authors || activePaper?.authors || "Explored Central Anchor",
        year: metadata?.year !== undefined ? metadata.year : (activePaper?.year || (activePaper?.publish_date ? parseInt(activePaper.publish_date.split("-")[0]) : 2026)),
        citations: metadata?.citations !== undefined ? metadata.citations : 184,
        isPreprint: false,
        shortTitle: metadata?.shortTitle || (title.split(" ").slice(0, 2).join(" ") + "..."),
        abstract: abstractText || "Dynamic research anchor deconstructed inside current path.",
        summary: "Currently focused research paradigm hub connecting surrounding ancestors and offshoots."
      };

      // Ensure proper type tags are preserved and assign unique IDs to prevent coordinate sticking
      const incomingNodes = (data.nodes || []).map((node: any) => {
        let nodeType: "upstream" | "upstream-2" | "downstream" | "downstream-2" = "downstream";
        if (node.type === "upstream" || node.type === "upstream-2" || node.type === "downstream" || node.type === "downstream-2") {
          nodeType = node.type;
        } else if (node.type && node.type.includes("upstream")) {
          nodeType = "upstream";
        }
        return {
          ...node,
          id: node.id ? `${node.id}-${uniqueSuffix}` : `node-${Math.random().toString(36).substr(2, 5)}`,
          type: nodeType
        };
      });

      const newNodesList: CitationNode[] = [centerNode, ...incomingNodes];

      // Form structural connections and directional links
      let newLinksList: CitationLink[] = [];
      if (data.links && data.links.length > 0) {
        newLinksList = data.links.map((link: any) => {
          let src = link.source;
          let tgt = link.target;
          if (src === "center" || src === "center-node" || src === "current-study" || src === "root") {
            src = "center-node";
          } else if (typeof src === "string") {
            src = `${src}-${uniqueSuffix}`;
          }
          if (tgt === "center" || tgt === "center-node" || tgt === "current-study" || tgt === "root") {
            tgt = "center-node";
          } else if (typeof tgt === "string") {
            tgt = `${tgt}-${uniqueSuffix}`;
          }
          return {
            id: link.id ? `${link.id}-${uniqueSuffix}` : `link-${src}-to-${tgt}`,
            source: src,
            target: tgt
          };
        });
      } else {
        // Safe backward-compatible fallback mapping
        incomingNodes.forEach((node: CitationNode) => {
          if (node.type === "upstream" || node.type === "upstream-2") {
            newLinksList.push({
              id: `link-center-node-to-${node.id}`,
              source: "center-node",
              target: node.id
            });
          } else {
            newLinksList.push({
              id: `link-${node.id}-to-center-node`,
              source: node.id,
              target: "center-node"
            });
          }
        });
      }

      // Ensure all nodes have at least one link to preserve visible connectivity
      const allLinkedNodeIds = new Set<string>();
      newLinksList.forEach(l => {
        allLinkedNodeIds.add(typeof l.source === "string" ? l.source : (l.source as any).id);
        allLinkedNodeIds.add(typeof l.target === "string" ? l.target : (l.target as any).id);
      });

      incomingNodes.forEach((node: CitationNode) => {
        if (!allLinkedNodeIds.has(node.id)) {
          if (node.type === "upstream-2") {
            const sibling = incomingNodes.find(n => n.type === "upstream" && node.id.includes(n.id.replace(`-${uniqueSuffix}`, "")));
            const targetId = sibling ? sibling.id : "center-node";
            newLinksList.push({
              id: `auto-link-${targetId}-to-${node.id}`,
              source: targetId,
              target: node.id
            });
          } else if (node.type === "downstream-2") {
            const sibling = incomingNodes.find(n => n.type === "downstream" && node.id.includes(n.id.replace(`-${uniqueSuffix}`, "")));
            const sourceId = sibling ? sibling.id : "center-node";
            newLinksList.push({
              id: `auto-link-${node.id}-to-${sourceId}`,
              source: node.id,
              target: sourceId
            });
          } else if (node.type === "upstream") {
            newLinksList.push({
              id: `auto-link-center-node-to-${node.id}`,
              source: "center-node",
              target: node.id
            });
          } else {
            newLinksList.push({
              id: `auto-link-${node.id}-to-center-node`,
              source: node.id,
              target: "center-node"
            });
          }
        }
      });

      setNodes(newNodesList);
      setLinks(newLinksList);
      setParadigmShiftText(data.paradigmShift || "Dynamic evolution of high-fidelity theoretical methodologies.");
      
      // Default focused inspection to the central node
      setFocusedNode(centerNode);

    } catch (err: any) {
      console.error(err);
      setErrorOnLoad(err.message || "Failed to contact citation database. Using fallback values.");
    } finally {
      setLoading(false);
    }
  };

  // Re-run D3 Force Simulation whenever nodes or links change
  useEffect(() => {
    if (nodes.length === 0 || !svgRef.current) return;

    const width = containerRef.current?.clientWidth || 600;
    const height = 400;

    // Standard D3 Selections
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Rebuild from scratch beautifully

    // Create a zoom layer container
    const gContainer = svg.append("g").attr("class", "zoom-container");

    // Add CSS definitions for arrow markers
    const defs = svg.append("defs");
    
    // Solid line arrow marker (Upstream reference -> Center)
    defs.append("marker")
      .attr("id", "arrow-solid")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Offset to sit right outside of node circle
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#7C8464");

    // Dashed line arrow marker (Center -> Downstream application)
    defs.append("marker")
      .attr("id", "arrow-dashed")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#A39E93");

    // Dynamic Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        gContainer.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Deep copy/clone nodes and links to prevent D3 from mutating React state or corrupting re-renders
    const clonedNodesList: CitationNode[] = nodes.map((n, idx) => {
      const nodeCopy = { ...n };
      // Position center node in the exact middle of the canvas
      if (nodeCopy.type === "center") {
        nodeCopy.x = width / 2;
        nodeCopy.y = height / 2;
        nodeCopy.fx = width / 2;
        nodeCopy.fy = height / 2;
      } else if (nodeCopy.type === "upstream-2") {
        // Place ancestral roots furthest to the left
        nodeCopy.x = width * 0.05 + (idx * 15);
        nodeCopy.y = height * 0.15 + (idx * 60);
        nodeCopy.fx = null;
        nodeCopy.fy = null;
      } else if (nodeCopy.type === "upstream") {
        // Place foundational parents in the mid-left area
        nodeCopy.x = width * 0.28 + (idx * 15);
        nodeCopy.y = height * 0.25 + (idx * 65);
        nodeCopy.fx = null;
        nodeCopy.fy = null;
      } else if (nodeCopy.type === "downstream-2") {
        // Place extended trajectories furthest on the right
        nodeCopy.x = width * 0.95 - (idx * 15);
        nodeCopy.y = height * 0.15 + (idx * 60);
        nodeCopy.fx = null;
        nodeCopy.fy = null;
      } else {
        // Place near-range derivations on the mid-right area
        nodeCopy.x = width * 0.72 - (idx * 15);
        nodeCopy.y = height * 0.25 + (idx * 65);
        nodeCopy.fx = null;
        nodeCopy.fy = null;
      }
      return nodeCopy;
    });

    const clonedLinksList: CitationLink[] = links.map(l => ({
      ...l,
      source: typeof l.source === "object" ? (l.source as CitationNode).id : l.source,
      target: typeof l.target === "object" ? (l.target as CitationNode).id : l.target
    }));

    // Create D3 Force Simulation with clean horizontal timeline axes mapping
    const simulation = d3.forceSimulation<CitationNode>(clonedNodesList)
      .force("link", d3.forceLink<CitationNode, CitationLink>(clonedLinksList)
        .id(d => d.id)
        .distance(110)
      )
      .force("charge", d3.forceManyBody().strength(-280))
      // Strictly maintain chronological horizon (left to right)
      .force("x", d3.forceX<CitationNode>()
        .x(d => {
          if (d.type === "upstream-2") return width * 0.08;
          if (d.type === "upstream") return width * 0.28;
          if (d.type === "downstream") return width * 0.72;
          if (d.type === "downstream-2") return width * 0.92;
          if (d.type === "grafted") return width * 0.5;
          return width / 2;
        })
        .strength(1.4)
      )
      // Balance height alignment gently
      .force("y", d3.forceY<CitationNode>()
        .y((d, idx) => {
          if (d.type === "center") return height / 2;
          // Space out nodes vertically to prevent visual clumping
          return height * 0.15 + ((idx % 4) * 90);
        })
        .strength(0.8)
      )
      .force("collision", d3.forceCollide<CitationNode>().radius(d => d.type === "center" ? 48 : 34).strength(1));

    simulationRef.current = simulation;

    // Draw Links
    const linkElements = gContainer.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(clonedLinksList)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        const tgtId = typeof d.target === "object" ? d.target.id : d.target;
        const srcId = typeof d.source === "object" ? d.source.id : d.source;
        return tgtId === "center-node" || srcId === "center-node" ? "#7C8464" : "#D6D0C2";
      })
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d: any) => {
        const srcNode = typeof d.source === "object" ? d.source : null;
        const tgtNode = typeof d.target === "object" ? d.target : null;
        const isGrafted = srcNode?.type === "grafted" || tgtNode?.type === "grafted";
        const isSecondary = srcNode?.type === "downstream-2" || tgtNode?.type === "upstream-2";
        return (isGrafted || isSecondary) ? "4,4" : undefined;
      })
      .attr("marker-end", (d: any) => {
        const tgtNode = typeof d.target === "object" ? d.target : null;
        const tgtId = typeof d.target === "object" ? d.target.id : String(d.target);
        const isUpstream = (tgtNode?.type === "upstream" || tgtNode?.type === "upstream-2" || tgtId.includes("-up") || tgtId.includes("up-"));
        return isUpstream ? "url(#arrow-solid)" : "url(#arrow-dashed)";
      })
      .attr("opacity", 0.75)
      .attr("class", "transition-all duration-300");

    // Draw Nodes G Container
    const nodeElements = gContainer.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, CitationNode>("g")
      .data(clonedNodesList)
      .enter()
      .append("g")
      .attr("class", "cursor-pointer select-none")
      .call(d3.drag<SVGGElement, CitationNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Render node aesthetics (circles)
    nodeElements.append("circle")
      .attr("r", (d: any) => {
        if (d.type === "center") return 22;
        if (d.type === "grafted") return 14;
        if (d.type === "upstream-2" || d.type === "downstream-2") return 11;
        return 15;
      })
      .attr("fill", (d: any) => {
        if (d.type === "center") return "#7C8464"; // Sage center
        if (d.type === "upstream-2") return "#D6D0C2"; // Slightly darker tone for grandparents
        if (d.type === "upstream") return "#EFECE3"; // Soft cream references
        if (d.type === "downstream") return "#FFFFFF"; // Clean white application
        if (d.type === "downstream-2") return "#F2EDE4"; // Off-white highlight grandchildren
        return "#FCFA96"; // Grafted highlight yellow
      })
      .attr("stroke", (d: any) => {
        if (d.type === "center") return "#494F3B";
        if (d.type === "upstream-2") return "#8C8474";
        if (d.type === "upstream") return "#9A907C";
        if (d.type === "downstream") return "#7C8464";
        if (d.type === "downstream-2") return "#9FA685";
        return "#CCB05C";
      })
      .attr("stroke-width", (d: any) => d.type === "center" ? 4.5 : 2.5)
      .attr("class", "transition-all duration-200")
      .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.06))");

    // Pulse animation aura around active center node
    nodeElements.filter((d: any) => d.type === "center")
      .insert("circle", "circle")
      .attr("r", 32)
      .attr("fill", "none")
      .attr("stroke", "#7C8464")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.4)
      .attr("class", "animate-pulse");

    // Colored inner cores
    nodeElements.append("circle")
      .attr("r", (d: any) => d.type === "center" ? 6 : 4)
      .attr("fill", (d: any) => {
        if (d.type === "center") return "#FFFFFF";
        if (d.type === "upstream" || d.type === "upstream-2") return "#9A907C";
        return "#7C8464";
      })
      .attr("opacity", 0.9);

    // Node labels (short names or years)
    nodeElements.append("text")
      .attr("dx", 0)
      .attr("dy", (d: any) => d.type === "center" ? 38 : 32)
      .attr("text-anchor", "middle")
      .text((d: any) => d.shortTitle || d.title.split(" ")[0])
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .attr("font-size", "10px")
      .attr("font-weight", (d: any) => d.type === "center" ? "bold" : "500")
      .attr("fill", "#2D2D24")
      .attr("class", "transition-colors duration-200 pointer-events-none")
      .attr("filter", "drop-shadow(0px 1px 1px white)");

    // Mouse hover events to show full paper info
    nodeElements
      .on("mouseover", (event, d: any) => {
        setHoveredNode(d);
        setTooltipPos({ x: event.clientX, y: event.clientY });
      })
      .on("mousemove", (event) => {
        let x = event.clientX + 12;
        let y = event.clientY + 12;
        const screenWidth = window.innerWidth;
        if (x > screenWidth - 280) {
          x = event.clientX - 290;
        }
        setTooltipPos({ x, y });
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      });

    // Single click handler to inspect Node
    nodeElements.on("click", (event, d: any) => {
      event.stopPropagation();
      // Match back to the original React state nodes to keep focus clean
      const original = nodes.find(o => o.id === d.id);
      setFocusedNode(original || d);
    });

    // Double click to pivot citation (explore citations of clicked node)
    nodeElements.on("dblclick", (event, d: any) => {
      event.stopPropagation();
      const original = nodes.find(o => o.id === d.id);
      handlePivotCitation(original || d);
    });

    // Action handlers for D3 Force simulation updates
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x || 0)
        .attr("y1", (d: any) => d.source.y || 0)
        .attr("x2", (d: any) => d.target.x || 0)
        .attr("y2", (d: any) => d.target.y || 0);

      nodeElements
        .attr("transform", (d: any) => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Clean physics configuration
    if (!physicsOn) {
      simulation.stop();
    }

    // Drag helper methods
    function dragstarted(event: any, d: CitationNode) {
      if (!event.active && physicsOn) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: CitationNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: CitationNode) {
      if (!event.active && physicsOn) simulation.alphaTarget(0);
      if (d.type === "center") {
        d.fx = width / 2;
        d.fy = height / 2;
      } else {
        d.fx = null;
        d.fy = null;
      }
    }

    return () => {
      simulation.stop();
    };

  }, [nodes, links, physicsOn, collisionStrength]);

  // Pivot / Traverse the citation net dynamically
  const handlePivotCitation = async (node: CitationNode) => {
    if (node.type === "center") return;
    
    // Add current node to traversal path to document history
    setTraversalPath(prev => {
      if (prev.some(p => p.title === node.title)) {
        return prev; // don't repeat duplicates
      }
      return [...prev, node];
    });

    // Query server for the citations surrounding this new node!
    await fetchCitationNetwork(node.title, node.abstract, {
      authors: node.authors,
      year: node.year,
      citations: node.citations,
      shortTitle: node.shortTitle
    });
  };

  // Reset entire trace layout
  const handleResetTrace = () => {
    if (activePaper) {
      const paperYear = activePaper.year || (activePaper.publish_date ? parseInt(activePaper.publish_date.split("-")[0]) : 2026);
      const initialCenter: CitationNode = {
        id: "center-node",
        type: "center",
        title: activePaper.simplified_title || activePaper.original_title || "Current Study",
        authors: activePaper.authors || "Active Workspace Specimen",
        year: paperYear,
        citations: 154,
        isPreprint: false,
        shortTitle: activePaper.simplified_title ? activePaper.simplified_title.split(" ").slice(0, 2).join(" ") + "..." : "Current Study",
        abstract: activePaper.summary || "No academic abstract loaded.",
        summary: "The active paper loaded in the primary workspace. Click explore to traverse surrounding citations.",
      };
      setTraversalPath([initialCenter]);
      setFocusedNode(initialCenter);
      fetchCitationNetwork(initialCenter.title, initialCenter.abstract, {
        authors: initialCenter.authors,
        year: initialCenter.year,
        citations: initialCenter.citations,
        shortTitle: initialCenter.shortTitle
      });
    }
  };

  // Search papers to Graft
  const handleSearchGraftPapers = async () => {
    if (!searchQuery.trim()) return;
    setSearchingGraft(true);
    setSearchError(null);
    setSearchResults([]);
    try {
      const resp = await fetch("/api/research-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, level: explanationLevel })
      });
      if (!resp.ok) {
        throw new Error(`Scouting error (status ${resp.status})`);
      }
      const data = await resp.json();
      if (data.papers && data.papers.length > 0) {
        setSearchResults(data.papers.slice(0, 3)); // Only take top 3
      } else {
        setSearchError("No academic papers found matching the keyword.");
      }
    } catch (err: any) {
      setSearchError(err.message || "Failed to search the academic scout.");
    } finally {
      setSearchingGraft(false);
    }
  };

  // Append a paper manually to the D3 graph
  const handleGraftPaperToNode = (scoutPaper: any) => {
    const graftId = `graft-${Math.random().toString(36).substr(2, 6)}`;
    const anchor = graftAnchorNode || nodes.find(n => n.type === "center") || nodes[0];
    
    const newGraftNode: CitationNode = {
      id: graftId,
      type: "grafted",
      title: scoutPaper.title,
      authors: scoutPaper.authors || "Unspecified Author",
      year: scoutPaper.year || (scoutPaper.publish_date ? parseInt(scoutPaper.publish_date.split("-")[0]) || 2026 : 2026),
      citations: Math.floor(Math.random() * 20) + 1,
      isPreprint: true,
      shortTitle: (scoutPaper.authors ? scoutPaper.authors.split(",")[0] : "Scout") + ", Graft",
      abstract: scoutPaper.abstract || "Manually drafted offshoot.",
      summary: "Grafted by user as a secondary parallel research node."
    };

    const refersAnchor = newGraftNode.year >= anchor.year;
    const newLink: CitationLink = {
      id: refersAnchor ? `link-${graftId}-to-${anchor.id}` : `link-${anchor.id}-to-${graftId}`,
      source: refersAnchor ? graftId : anchor.id,
      target: refersAnchor ? anchor.id : graftId
    };

    setNodes(prev => [...prev, newGraftNode]);
    setLinks(prev => [...prev, newLink]);
    setFocusedNode(newGraftNode);
    
    // Clear finder
    setSearchResults([]);
    setSearchQuery("");
    setGraftAnchorNode(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md overflow-y-auto flex flex-col antialiased">
      {/* Top Header Section */}
      <div className="px-6 py-4.5 border-b border-[#E8E4D9] bg-white flex justify-between items-center sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#7C8464] p-2.5 rounded-xl text-white shadow-sm">
            <Network className="h-5 w-5 text-[#EFECE3]" />
          </div>
          <div>
            <h2 className="font-serif font-black text-sm sm:text-base text-[#2D2D24] leading-tight flex items-center gap-1.5">
              <span>Interactive Citation Horizon &amp; Paradigm Map</span>
              <span className="text-[10px] font-mono font-bold bg-[#7C8464]/10 text-[#7C8464] px-2 py-0.5 rounded-full select-none">
                D3 Network Engine
              </span>
            </h2>
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-[#8C8474] mt-0.5 block">
              Traced lineage: Parent Ancestors ⇆ Focus Study ⇆ Offshoot Applications
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#8C8474] hover:text-[#2D2D24] transition-all cursor-pointer border border-[#E8E4D9] shadow-xs active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Grid Splits */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Side: Interactive Map & Controls (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div 
            ref={containerRef}
            className="flex-1 min-h-[420px] lg:min-h-[500px] border border-[#E8E4D9] bg-white rounded-3xl overflow-hidden relative shadow-xs flex flex-col"
          >
            {/* Visual Header of Canvas */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
              {/* Force Controls Panel (Active/Clickable inside absolute) */}
              <div className="bg-[#F9F7F2]/90 backdrop-blur-md border border-[#E8E4D9] px-3.5 py-2 rounded-2xl flex items-center gap-4 text-[10px] shadow-sm pointer-events-auto">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-[#7C8464]" />
                  <span className="font-mono font-bold text-[#5A5A4A] uppercase">Physics Engine:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPhysicsOn(prev => !prev)}
                    className={`px-2 py-1 rounded-md font-mono font-bold text-[9px] transition-all cursor-pointer ${
                      physicsOn ? "bg-[#7C8464] text-white" : "bg-white hover:bg-[#F2EDE4] text-[#8C8474]"
                    }`}
                  >
                    {physicsOn ? "● RUNNING" : "○ PAUSED"}
                  </button>
                  <button
                    onClick={handleResetTrace}
                    title="Reset coordinates and root view"
                    className="p-1 rounded-md bg-white hover:bg-[#F2EDE4] border border-[#E8E4D9] text-[#5A5A4A] cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Key Legends */}
              <div className="bg-[#2D2D24] text-[#EFECE3] px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold flex items-center gap-3.5 shadow-md">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A907C]" />
                  <span>ANCESTORS (UPSTREAM)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white border border-[#7C8464]" />
                  <span>OFFSHOOTS (DOWNSTREAM)</span>
                </div>
              </div>
            </div>

            {/* D3 Simulation Canvas */}
            <div className="flex-1 relative flex items-center justify-center bg-[#F9F7F2]/25">
              {loading ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/75 backdrop-blur-xs gap-3">
                  <RefreshCw className="h-8 w-8 text-[#7C8464] animate-spin" />
                  <div className="text-center">
                    <p className="font-serif font-black text-xs text-[#2D2D24] animate-pulse uppercase tracking-wider">
                      Tracing Lineage Structures...
                    </p>
                    <p className="text-[10px] text-[#8C8474] font-mono mt-0.5">
                      Identifying foundational ancestors and cutting-edge offspring via Gemini
                    </p>
                  </div>
                </div>
              ) : errorOnLoad ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FFFdfc] p-6 text-center gap-3">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <p className="font-serif font-bold text-[#2D2D24] text-xs uppercase tracking-wider">{errorOnLoad}</p>
                  <button 
                    onClick={handleResetTrace} 
                    className="bg-[#7C8464] hover:bg-[#6A7153] text-[10px] font-bold text-white px-3 py-1.5 rounded-lg shadow cursor-pointer transition-all"
                  >
                    Try Rebuilding Root Lineage
                  </button>
                </div>
              ) : null}

              {/* Dynamic SVG canvas element */}
              <svg 
                ref={svgRef} 
                className="w-full h-full min-h-[380px] lg:min-h-[440px]"
              />

              {/* Instruction overlays inside Canvas */}
              <div className="absolute bottom-3 left-3 right-3 text-[9px] text-[#8C8474] font-mono flex justify-between pointer-events-none select-none">
                <span>🖱️ Drag nodes to organize • Pinch / Scroll canvas to Zoom</span>
                <span>💡 Double-click any node to Pivot & Explore its citation tree</span>
              </div>
            </div>

            {/* Graft Manual Dynamic Paper Linker bar at bottom */}
            <div className="border-t border-[#E8E4D9] bg-white p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#5A5A4A]">
                  <PlusCircle className="h-3.5 w-3.5 text-[#7C8464]" />
                  <span>Manual Ggraft Node Tool:</span>
                  {graftAnchorNode && (
                    <span className="text-[#7C8464] bg-[#7C8464]/10 px-2 py-0.5 rounded ml-2">
                       Aanchoring to: <strong>{graftAnchorNode.shortTitle}</strong>
                    </span>
                  )}
                </div>
                {!graftAnchorNode && (
                  <span className="text-[9px] text-[#8C8474] font-mono italic">
                    Select a node to attach a manually searched preprint paper offshoot
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchGraftPapers()}
                    placeholder="Search scientific topics or specific papers and graft to network..."
                    className="w-full bg-[#F9F7F2] text-xs border border-[#E8E4D9] rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#7C8464] transition-all"
                  />
                  <Search className="h-4 w-4 text-[#8C8474] absolute left-3 top-3.5" />
                </div>
                <button
                  onClick={handleSearchGraftPapers}
                  disabled={searchingGraft || !searchQuery.trim()}
                  className="bg-[#7C8464] hover:bg-[#6A7153] text-white disabled:opacity-50 text-[11px] font-bold px-4 rounded-xl cursor-pointer select-none transition-all flex items-center gap-1 shadow-sm shrink-0"
                >
                  {searchingGraft ? "Searching..." : "Fetch Candidates"}
                </button>
              </div>

              {/* Graft results */}
              {searchResults.length > 0 && (
                <div className="bg-[#F9F7F2]/55 border border-[#E8E4D9] rounded-xl p-3 flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                  <p className="text-[10px] font-mono text-[#8C8474] font-bold">SELECT CANDIDATE TO GRAFT TO MODEL:</p>
                  {searchResults.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-left bg-white border border-[#E8E4D9]/80 p-2.5 rounded-lg gap-2 text-xs">
                      <div className="flex-1">
                        <h4 className="font-serif font-black text-[#2D2D24] text-[11px] leading-tight">{p.title}</h4>
                        <span className="text-[9px] font-mono text-[#8C8474] block mt-0.5">By {p.authors || "Unknown"} • {p.publish_date || p.year || "2026"}</span>
                      </div>
                      <button
                        onClick={() => handleGraftPaperToNode(p)}
                        className="bg-[#7C8464]/15 hover:bg-[#7C8464] text-[#494F3B] hover:text-white rounded-lg p-1.5 transition-all text-[10px] font-bold cursor-pointer shrink-0"
                      >
                        + Graft Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {searchError && (
                <span className="text-[9.5px] text-red-600 font-mono">⚠️ {searchError}</span>
              )}
            </div>

          </div>

          {/* Paradigm Shift Insights Board */}
          <div className="bg-white border border-[#E8E4D9] rounded-2xl p-5 text-left flex flex-col gap-2">
            <h3 className="font-serif font-black text-[#2D2D24] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Calibrated Paradigm Transmutation</span>
            </h3>
            <p className="text-[12px] text-[#5A5A4A] leading-relaxed italic bg-[#F9F7F2]/40 border border-[#E8E4D9]/40 p-3.5 rounded-xl">
              &ldquo;{paradigmShiftText}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Side: Timeline & Node Metadata Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Timeline Pathway Navigation Indicator */}
          <div className="bg-white border border-[#E8E4D9] rounded-2xl p-5 text-left shadow-xs">
            <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-2">
              <div>
                <h3 className="font-serif font-black text-[#2D2D24] text-xs uppercase tracking-wider">
                  Traversed Research Path
                </h3>
                <span className="text-[9px] text-[#8C8474] font-mono tracking-wider">
                  Breadcrumbs of your academic trace
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#7C8464]/10 text-[#7C8464] font-black px-2 py-0.5 rounded-full">
                {traversalPath.length} Decades Hopped
              </span>
            </div>

            {/* Horizontally scrolling list of papers they focused on */}
            <div className="flex flex-col gap-2.5 mt-3 max-h-[145px] overflow-y-auto pr-1">
              {traversalPath.map((item, index) => (
                <div key={item.id || index} className="flex gap-2.5 items-stretch text-left">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-[#7C8464] text-[10px] text-white flex items-center justify-center font-mono font-bold shadow-xs">
                      {index + 1}
                    </div>
                    {index < traversalPath.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#D6D0C2] my-1" />
                    )}
                  </div>
                  <div className="flex-1 bg-[#F9F7F2]/60 hover:bg-[#F9F7F2] border border-[#E8E4D9] p-2.5 rounded-xl transition-all flex items-start justify-between gap-1.5 self-center">
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xs text-[#2D2D24] leading-tight truncate">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono text-[#8C8474] block mt-0.5">
                        {item.authors} ({item.year})
                      </span>
                    </div>
                    {index > 0 && (
                      <button
                        onClick={() => {
                          setTraversalPath(prev => prev.filter(p => p.id !== item.id));
                        }}
                        className="text-[9px] text-[#8C8474] hover:text-red-600 font-bold bg-[#FFFFFF] hover:bg-red-50 px-1.5 py-0.5 rounded border border-[#E8E4D9] transition-all cursor-pointer"
                        title="Remove segment"
                      >
                        Exempt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Node Detail Inspector */}
          {focusedNode && (
            <div className="bg-white border border-[#E8E4D9] rounded-3xl p-5 text-left shadow-xs flex-1 flex flex-col gap-4 min-h-[355px]">
              
              {/* Header inside the inspector */}
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-[#F2EDE4] shrink-0">
                <div className="flex-1 min-w-0">
                  <span className={`text-[8.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                    focusedNode.type === "center" 
                      ? "bg-[#7C8464] text-white" 
                      : focusedNode.type === "upstream"
                      ? "bg-[#9A907C]/25 text-[#494F3B]"
                      : focusedNode.type === "upstream-2"
                      ? "bg-[#8C8474]/20 text-[#5A5A4A]"
                      : focusedNode.type === "grafted"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : focusedNode.type === "downstream-2"
                      ? "bg-[#7C8464]/5 text-[#6A7153] border border-[#7C8464]/10"
                      : "bg-[#7C8464]/10 text-[#7C8464]"
                  }`}>
                    {focusedNode.type === "center" 
                      ? "Active Hub Specimen" 
                      : focusedNode.type === "upstream" 
                      ? "Foundational Referer" 
                      : focusedNode.type === "upstream-2"
                      ? "Deep Ancestral Source"
                      : focusedNode.type === "grafted" 
                      ? "Grafted Offshoot" 
                      : focusedNode.type === "downstream-2"
                      ? "Extended Trajectory"
                      : "Derived Application"
                    }
                  </span>
                  <h3 className="font-serif font-black text-sm text-[#2D2D24] leading-snug mt-1.5 line-clamp-3">
                    {focusedNode.title}
                  </h3>
                  <p className="text-[10px] text-[#8C8474] font-mono mt-1">
                    By {focusedNode.authors} ({focusedNode.year})
                  </p>
                </div>
                <div className="bg-[#F9F7F2] p-2.5 rounded-2xl border border-[#E8E4D9]/60 shrink-0 text-center">
                  <span className="text-[9px] font-mono text-[#8C8474] block leading-none uppercase">Citations</span>
                  <strong className="text-sm font-sans font-black text-[#2D2D24] mt-0.5 block leading-none">
                    {focusedNode.citations}
                  </strong>
                </div>
              </div>

              {/* Dynamic Abstract deconstruction */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                <div className="bg-[#F9F7F2] p-3.5 rounded-xl border border-[#E8E4D9]/40 border-l-3 border-l-[#7C8464]">
                  <span className="text-[8.5px] font-mono font-bold text-[#8C8474] uppercase block mb-1">
                    Significance in Literature Sequence:
                  </span>
                  <p className="text-xs text-[#5A5A4A] leading-relaxed italic">
                    &ldquo;{focusedNode.summary}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[9px] font-mono font-bold text-[#8C8474] uppercase">
                    Abstract Excerpts &amp; Frameworks:
                  </span>
                  <p className="text-xs text-[#5A5A4A] leading-relaxed text-justify">
                    {focusedNode.abstract}
                  </p>
                </div>

                {focusedNode.type !== "center" && (
                  <div className="bg-[#7C8464]/5 border border-[#7C8464]/10 rounded-xl p-3 text-[11px] text-[#5A5A4A] flex gap-2 items-start mt-2">
                    <Info className="h-4 w-4 text-[#7C8464] shrink-0 mt-0.5" />
                    <span>
                      Double click this node in the canvas above to pivot and trace the ancestors/applications of <strong>{focusedNode.shortTitle}</strong> specifically.
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons to pivot or import */}
              <div className="flex flex-col gap-2 pt-3 border-t border-[#F2EDE4] shrink-0">
                {focusedNode.type !== "center" && (
                  <button
                    onClick={() => handlePivotCitation(focusedNode)}
                    className="w-full bg-[#EFECE3] hover:bg-[#E2DDD3] text-[#2D2D24] py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all border border-[#9A907C]/40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <GitCommit className="h-3.5 w-3.5 text-[#7C8464]" />
                    <span>Explore Citation Tree under this Paper</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const paperCandidate = {
                      title: focusedNode.title,
                      authors: focusedNode.authors,
                      abstract: focusedNode.abstract,
                      source_name: focusedNode.isPreprint ? "PREPRINT" : "PEER-REVIEW",
                      original_url: focusedNode.type === "grafted" ? "https://arxiv.org/abs/grafted" : "https://arxiv.org/abs/" + focusedNode.id,
                      publish_date: `${focusedNode.year}-01-01`
                    };
                    onLoadAsMainArticle(paperCandidate);
                  }}
                  className="w-full bg-[#7C8464] hover:bg-[#6A7153] text-[#EFECE3] hover:text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 select-none"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Load into Main Workspace Study</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Footer metadata alignment */}
      <div className="bg-white border-t border-[#E8E4D9] px-6 py-3.5 text-center text-[10px] tracking-wider uppercase font-mono text-[#8C8474]">
        Lumina Academic Linage &amp; Citation Horizon Trace Engine • Powered by Gemini + D3 Force layout
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredNode && (
        <div 
          className="fixed pointer-events-none z-50 bg-[#F9F7F2]/95 backdrop-blur-md border border-[#9A907C]/40 px-3.5 py-2.5 rounded-xl shadow-lg max-w-xs text-left transition-all duration-75 ease-out select-none"
          style={{ 
            left: `${tooltipPos.x}px`, 
            top: `${tooltipPos.y}px`,
            transform: 'translateY(-100%) translateY(-8px)'
          }}
        >
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-wider uppercase text-[#8C8474]">
            <span className={`w-1.5 h-1.5 rounded-full ${
              hoveredNode.type === "center" ? "bg-[#7C8464]" : "bg-[#9A907C]"
            }`} />
            <span>
              {hoveredNode.type === "center" 
                ? "Active Hub Specimen" 
                : hoveredNode.type === "upstream" 
                ? "Foundational Referer" 
                : hoveredNode.type === "upstream-2"
                ? "Deep Ancestral Source" 
                : hoveredNode.type === "downstream-2"
                ? "Extended Trajectory"
                : hoveredNode.type === "grafted"
                ? "Grafted Offshoot"
                : "Derived Application"
              }
            </span>
          </div>
          <h4 className="font-serif font-black text-xs text-[#2D2D24] leading-tight mt-1 line-clamp-3">
            {hoveredNode.title}
          </h4>
          <p className="font-mono text-[10px] text-[#5A5A4A] mt-1 line-clamp-2">
            By: {hoveredNode.authors}
          </p>
          <div className="flex gap-2.5 items-center mt-1.5 text-[9px] font-mono font-bold text-[#8C8474]">
            <span>Year: {hoveredNode.year}</span>
            <span>•</span>
            <span className="text-[#7C8464]">Citations: {hoveredNode.citations}</span>
          </div>
        </div>
      )}
    </div>
  );
}
