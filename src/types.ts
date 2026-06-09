export type ExplanationLevel = "Middle School" | "High School" | "Undergrad" | "Graduate" | "PhD";

export interface JargonCheatSheetItem {
  term: string;
  simple_definition: string;
  source_page?: number;
  context_sentence?: string;
}

export interface GroundedFinding {
  finding_statement: string;
  source_page: number;
  verbatim_quote: string;
}

export interface SimplifiedPaper {
  simplified_title: string;
  one_sentence_hook: string;
  the_big_idea_concept: string;
  the_big_idea_detail: string;
  key_findings_concept: string[];
  key_findings_detail: string[];
  jargon_cheat_sheet: JargonCheatSheetItem[];
  real_world_impact_concept: string;
  real_world_impact_detail: string;
  the_big_idea?: string; // Optional legacy backing field
  key_findings?: string[]; // Optional legacy backing field
  real_world_impact?: string; // Optional legacy backing field
  explanation_level?: ExplanationLevel; // Option to save the processed category level
  authors?: string;
  year?: number;
  publish_date?: string;
  original_url?: string;
  original_title?: string;
  findings?: GroundedFinding[];
  stress_test_variables?: any[];
}

export interface SamplePaper {
  id: string;
  title: string;
  abstract: string;
  fullText?: string;
  category: string;
}

export interface LivePaper {
  title: string;
  authors: string;
  abstract: string;
  source_name: string;
  original_url: string;
  topic?: string;
  publish_date?: string;
}

export interface Source {
  name: string;
  url: string;
}
