export interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  domain: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  taskType: string;
  tags: string[];
  rowsCount: number;
  columnsCount: number;
  sizeMb: number;
  downloadCount: number;
  rating: number;
  featured: boolean;
  targetColumn: string;
  kaggleId?: string; // For Kaggle integration
  lastUpdated: string;
  license: string;
  fileFormats: string[];
}

export interface DownloadResult {
  success: boolean;
  data?: unknown;
  error?: string;
  filePath?: string;
}

export interface AnalysisResult {
  insights: string[];
  summary: unknown;
  visualizations: string[];
}