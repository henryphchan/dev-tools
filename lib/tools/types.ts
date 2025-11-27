export type ToolId = string;

export interface ToolInfo {
  id: ToolId;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  accent: string;
  keywords: string[];
}
