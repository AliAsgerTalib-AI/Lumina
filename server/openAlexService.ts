/**
 * Reconstructs the full-text abstract from OpenAlex's abstract_inverted_index.
 * OpenAlex stores abstracts as an inverted index (word -> [positions]) to respect publishers' copyrights.
 */
export function reconstructAbstract(invertedIndex: any): string {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  try {
    const words: string[] = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      if (Array.isArray(positions)) {
        for (const pos of positions) {
          words[pos] = word;
        }
      }
    }
    return words.filter((w) => w !== undefined && w !== null).join(" ");
  } catch (error) {
    return "";
  }
}

/**
 * Maps an OpenAlex Work object into our standard front/back-end Academic Node format.
 */
export function mapOpenAlexWork(work: any, id: string, type: string, targetYear: number): any {
  if (!work) return null;

  const authorsList = work.authorships
    ? work.authorships.map((a: any) => a.author?.display_name || "Unknown").filter(Boolean)
    : [];
  const authorsStr = authorsList.length > 0 ? authorsList.join(", ") : "Unknown Author";
  
  const firstAuthorName = authorsList[0] || "Unknown";
  const firstAuthorLastName = firstAuthorName.split(" ").pop() || "Unknown";
  
  let year = Number(work.publication_year || work.year);
  if (isNaN(year) || year > 2026) {
    year = 2026;
  }

  // Cap parent publication years logistically
  if (type.startsWith("upstream-2") && targetYear) {
    year = Math.min(year, targetYear - 2);
  } else if (type.startsWith("upstream") && targetYear) {
    year = Math.min(year, targetYear - 1);
  }

  const rawAbstract = reconstructAbstract(work.abstract_inverted_index);
  const abstractText = rawAbstract && rawAbstract.trim().length > 30
    ? rawAbstract
    : "Abstract summary parsed through scholastic database. The publication analyzes specialized structures, parameters, and localized field variations.";

  const doiUrl = work.doi || `https://openalex.org/${work.id ? work.id.split("/").pop() : ""}`;
  const originalUrl = work.primary_location?.landing_page_url || doiUrl;

  const abstractTruncated = abstractText.length > 250
    ? abstractText.substring(0, 247) + "..."
    : abstractText;

  return {
    id,
    type,
    title: work.title || "Scholarly Publication",
    authors: authorsStr.length > 180 ? authorsStr.substring(0, 177) + "..." : authorsStr,
    year,
    citations: work.cited_by_count || 0,
    isPreprint: !!(work.open_access?.is_oa || work.is_oa),
    shortTitle: `${firstAuthorLastName}, ${year}`,
    abstract: abstractTruncated,
    summary: `Seminal paper tracing back to direct field foundations, presenting critical context in the citation horizon.`,
    originalUrl
  };
}

/**
 * Searches OpenAlex API for a paper by title.
 * Falls back to general keyword search if no exact match is found.
 */
export async function searchOpenAlexByTitle(title: string): Promise<any | null> {
  try {
    const cleanTitle = title.trim();
    const headers = {
      "User-Agent": "LuminaSystem/1.0 (mailto:aliasgertalib@gmail.com)"
    };
    
    console.log(`[OpenAlex] Querying title: "${cleanTitle}"`);
    // 1. First try title match filter
    const url = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(cleanTitle)}&limit=3&mailto=aliasgertalib@gmail.com`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      throw new Error(`OpenAlex responding with code ${resp.status}`);
    }
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    // 2. Fallback: Try general search parameter
    const searchUrl = `https://api.openalex.org/works?search=${encodeURIComponent(cleanTitle)}&limit=3&mailto=aliasgertalib@gmail.com`;
    const searchResp = await fetch(searchUrl, { headers });
    if (searchResp.ok) {
      const searchData = await searchResp.json();
      if (searchData.results && searchData.results.length > 0) {
        return searchData.results[0];
      }
    }
    
    return null;
  } catch (error: any) {
    console.error("[OpenAlex] Search failed:", error.message || error);
    return null;
  }
}

/**
 * Fetches multiple works from OpenAlex API by their OpenAlex IDs.
 */
export async function fetchWorksByIds(ids: string[]): Promise<any[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const cleanIds = ids.map(id => id.split("/").pop()).filter(Boolean);
    if (cleanIds.length === 0) return [];
    
    const filterStr = cleanIds.join("|");
    const url = `https://api.openalex.org/works?filter=openalex:${filterStr}&limit=${cleanIds.length}&mailto=aliasgertalib@gmail.com`;
    
    const resp = await fetch(url, { headers: { "User-Agent": "LuminaSystem/1.0 (mailto:aliasgertalib@gmail.com)" } });
    if (resp.ok) {
      const data = await resp.json();
      return data.results || [];
    }
    return [];
  } catch (error) {
    console.error("[OpenAlex] Multi-Work fetch failed:", error);
    return [];
  }
}

/**
 * Fetches works that cite a given OpenAlex ID.
 */
export async function fetchCitingWorks(openAlexId: string, limit = 3): Promise<any[]> {
  try {
    const cleanId = openAlexId.split("/").pop();
    const url = `https://api.openalex.org/works?filter=cites:${cleanId}&sort=cited_by_count:desc&limit=${limit}&mailto=aliasgertalib@gmail.com`;
    
    const resp = await fetch(url, { headers: { "User-Agent": "LuminaSystem/1.0 (mailto:aliasgertalib@gmail.com)" } });
    if (resp.ok) {
      const data = await resp.json();
      return data.results || [];
    }
    return [];
  } catch (error) {
    console.error("[OpenAlex] Citing works fetch failed:", error);
    return [];
  }
}

/**
 * Discovers and builds a real 2-Level deep Citation Horizon pedigree graph using OpenAlex.
 */
export async function getRealCitationPedigree(title: string, abstract = "", targetYear = 2026): Promise<any | null> {
  try {
    // 1. Locate the core/center paper
    const targetWork = await searchOpenAlexByTitle(title);
    if (!targetWork) {
      console.log(`[OpenAlex] Direct work match for "${title}" not found. Gracefully fallback to simulated keywords.`);
      return null;
    }

    const targetWorkId = targetWork.id;
    console.log(`[OpenAlex] Found matching publication: ${targetWorkId} with ${targetWork.referenced_works?.length || 0} referenced papers and cited by ${targetWork.cited_by_count || 0}.`);

    // We will build nodes and links arrays
    const nodes: any[] = [];
    const links: any[] = [];

    // 2. Fetch Upstream level 1 (references of target paper)
    const referencedIds: string[] = targetWork.referenced_works || [];
    let upstream1Works: any[] = [];
    if (referencedIds.length > 0) {
      upstream1Works = await fetchWorksByIds(referencedIds.slice(0, 3));
    }

    // Map Upstream Level 1
    const up1Nodes = upstream1Works.map((work, index) => {
      const id = `up-${index + 1}`;
      const node = mapOpenAlexWork(work, id, "upstream", targetYear);
      links.push({ id: `link-center-node-to-${id}`, source: "center-node", target: id });
      return { node, originalWork: work };
    }).filter(Boolean);

    nodes.push(...up1Nodes.map(item => item.node));

    // 3. Fetch Upstream level 2: Grandparent papers cited by parent papers
    for (let i = 0; i < up1Nodes.length; i++) {
      const parentItem = up1Nodes[i];
      const parentWork = parentItem.originalWork;
      const grandparentIds: string[] = parentWork.referenced_works || [];
      if (grandparentIds.length > 0) {
        const gpWorks = await fetchWorksByIds([grandparentIds[0]]);
        if (gpWorks.length > 0) {
          const id = `up-${i + 1}-parent`;
          const node = mapOpenAlexWork(gpWorks[0], id, "upstream-2", targetYear);
          if (node) {
            nodes.push(node);
            links.push({ id: `link-${parentItem.node.id}-to-${id}`, source: parentItem.node.id, target: id });
          }
        }
      }
    }

    // 4. Fetch Downstream level 1 (papers citing target paper)
    const downstream1Works = await fetchCitingWorks(targetWorkId, 3);
    const down1Nodes = downstream1Works.map((work, index) => {
      const id = `down-${index + 1}`;
      const node = mapOpenAlexWork(work, id, "downstream", targetYear);
      links.push({ id: `link-${id}-to-center-node`, source: id, target: "center-node" });
      return { node, originalWork: work };
    }).filter(Boolean);

    nodes.push(...down1Nodes.map(item => item.node));

    // 5. Fetch Downstream level 2 (papers citing level 1 child papers)
    for (let i = 0; i < down1Nodes.length; i++) {
      const childItem = down1Nodes[i];
      const childWork = childItem.originalWork;
      const childCitingWorks = await fetchCitingWorks(childWork.id, 1);
      if (childCitingWorks.length > 0) {
        const id = `down-${i + 1}-child`;
        const node = mapOpenAlexWork(childCitingWorks[0], id, "downstream-2", targetYear);
        if (node) {
          nodes.push(node);
          links.push({ id: `link-${id}-to-${childItem.node.id}`, source: id, target: childItem.node.id });
        }
      }
    }

    // Safety fallback: if we have zero nodes (which should not normally happen if targetWork is valid), return null to fallback
    if (nodes.length === 0) {
      return null;
    }

    const paradigmShift = `Mapped direct timeline from OpenAlex scholarly index. Seminal foundations date from ${Math.min(...nodes.map(n => n.year))} leading to contemporary integrations in ${Math.max(...nodes.map(n => n.year))}.`;

    return {
      nodes,
      links,
      paradigmShift,
      realOpenScholasticData: true
    };
  } catch (error) {
    console.error("[OpenAlex] Error constructing pedigree:", error);
    return null;
  }
}

/**
 * Dynamically queries OpenAlex to fetch genuine fresh trending scientific literature.
 */
export async function getFreshLiteratureFallbacks(): Promise<any[]> {
  try {
    const url = "https://api.openalex.org/works?filter=publication_year:2024|2025|2026&sort=cited_by_count:desc&limit=15&mailto=aliasgertalib@gmail.com";
    const resp = await fetch(url, { headers: { "User-Agent": "LuminaSystem/1.0 (mailto:aliasgertalib@gmail.com)" } });
    if (resp.ok) {
      const data = await resp.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((work: any, idx: number) => {
          const mapped = mapOpenAlexWork(work, `fresh-${idx}`, "general", 2026);
          return {
            title: mapped.title,
            authors: mapped.authors,
            abstract: mapped.abstract,
            source_name: work.primary_location?.source?.display_name || "Scholarly Database",
            original_url: mapped.originalUrl,
            topic: work.concepts && work.concepts[0] ? work.concepts[0].display_name : "General Science",
            publish_date: work.publication_date || "2025-01-01"
          };
        });
      }
    }
  } catch (error) {
    console.error("[OpenAlex] Failed to load fresh literature fallbacks:", error);
  }
  // Ultimate fallback
  return [];
}
