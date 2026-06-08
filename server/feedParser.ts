// XML RSS/Atom Feed parsing helper to back up Gemini extraction gracefully
export function parseXmlFeed(xmlText: string, sourceName: string, sourceUrl: string): any[] {
  const items: any[] = [];
  
  // Find all <item> elements for RSS 2.0 or <entry> elements for RSS 1.0 / Atom / arXiv
  const itemBlocks = xmlText.split(/<item|<entry/);
  
  // Skip the first block because it's the feed header, not an item/entry
  for (let i = 1; i < itemBlocks.length; i++) {
    const block = itemBlocks[i];
    
    // Extract Title
    let title = "";
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    // Clean up CDATA
    title = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
    // Strip HTML entities safely
    title = title
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    // Clean up arXiv versioning or space formatting
    title = title.replace(/\n/g, " ").replace(/\s+/g, " ");
    
    if (!title || title.toLowerCase().includes("rss feed") || title.toLowerCase().includes("errata")) {
      continue;
    }

    // Extract Link (look for <link href="url" /> or <link>href</link>)
    let link = "";
    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    if (linkMatch) {
      link = linkMatch[1].trim();
    } else {
      const linkHrefMatch = block.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (linkHrefMatch) {
        link = linkHrefMatch[1];
      } else {
        // Fallback to <id> for arXiv
        const idMatch = block.match(/<id[^>]*>([\s\S]*?)<\/id>/i);
        if (idMatch && idMatch[1].startsWith("http")) {
          link = idMatch[1].trim();
        }
      }
    }
    link = link.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();

    // Extract Description / Summary as Abstract
    let abstractText = "";
    const descMatch = block.match(/<(?:description|summary)[^>]*>([\s\S]*?)<\/(?:description|summary)>/i);
    if (descMatch) {
      abstractText = descMatch[1].trim();
    }
    abstractText = abstractText.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
    // Remove any HTML tags from abstract
    abstractText = abstractText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (abstractText.length > 300) {
      abstractText = abstractText.substring(0, 297) + "...";
    }
    if (!abstractText) {
      abstractText = "An open-access scientific publication exploring modern structural methods and experimental observations within the discipline.";
    }

    // Extract Authors (either <dc:creator>, list of <author><name>, or <author>)
    let authors = "";
    const creatorMatch = block.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i);
    if (creatorMatch) {
      authors = creatorMatch[1].trim();
    } else {
      // Find all names in <author><name>Name</name></author> or just <name>Name</name>
      const nameMatches = [...block.matchAll(/<name[^>]*>([\s\S]*?)<\/name>/gi)];
      if (nameMatches.length > 0) {
        authors = nameMatches.map(m => m[1].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).slice(0, 3).join(", ");
        if (nameMatches.length > 3) authors += " et al.";
      } else {
        const authorMatch = block.match(/<author[^>]*>([\s\S]*?)<\/author>/i);
        if (authorMatch) {
          authors = authorMatch[1].replace(/<[^>]+>/g, " ").trim();
        }
      }
    }
    authors = authors.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
    authors = authors.replace(/\s+/g, " ");
    if (!authors || authors.length < 2) {
      authors = "Scientific Staff";
    }

    // Extract Date
    let publishDate = new Date().toISOString().split("T")[0];
    const dateMatch = block.match(/<(?:pubDate|dc:date|published|updated)[^>]*>([\s\S]*?)<\/(?:pubDate|dc:date|published|updated)>/i);
    if (dateMatch) {
      const dStr = dateMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
      try {
        const parsedD = new Date(dStr);
        if (!isNaN(parsedD.getTime())) {
          publishDate = parsedD.toISOString().split("T")[0];
        }
      } catch (e) {}
    }

    // Deduce Topic based on keywords in title/abstract or sourceName
    let topic = "General Science";
    const combinedText = (title + " " + abstractText).toLowerCase();
    if (combinedText.includes("neuron") || combinedText.includes("brain") || combinedText.includes("clinical") || combinedText.includes("disease") || combinedText.includes("therapy")) {
      topic = "Medicine & Health";
    } else if (combinedText.includes("quantum") || combinedText.includes("astronomy") || combinedText.includes("physics") || combinedText.includes("cosmology") || combinedText.includes("laser")) {
      topic = "Physics & Astronomy";
    } else if (combinedText.includes("epigenetic") || combinedText.includes("plant") || combinedText.includes("dna") || combinedText.includes("genetech") || combinedText.includes("biology") || combinedText.includes("microbe") || combinedText.includes("cell")) {
      topic = "Biology & Genomics";
    } else if (combinedText.includes("carbon") || combinedText.includes("chemist") || combinedText.includes("organic") || combinedText.includes("molecular") || combinedText.includes("catalysis")) {
      topic = "Chemistry & Material Science";
    } else if (combinedText.includes("reinforcement learning") || combinedText.includes("neural network") || combinedText.includes("multi-agent") || combinedText.includes("model") || combinedText.includes("transformer") || combinedText.includes("compute")) {
      topic = "Quantum Computing";
    } else if (combinedText.includes("market") || combinedText.includes("economic") || combinedText.includes("policy") || combinedText.includes("society") || combinedText.includes("social")) {
      topic = "Economics & Social Sciences";
    }

    items.push({
      title,
      authors,
      abstract: abstractText,
      source_name: sourceName,
      original_url: link || sourceUrl,
      topic,
      publish_date: publishDate
    });
  }

  // Deduplicate by title
  const uniqueItems: any[] = [];
  const seenTitles = new Set();
  for (const item of items) {
    const key = item.title.toLowerCase().trim();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}
