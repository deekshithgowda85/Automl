import { 
  Brain, TrendingUp, Zap, Target, BarChart3, GitBranch 
} from 'lucide-react';

export interface MLModelTemplate {
  id: string;
  name: string;
  author: string;
  description: string;
  shortDesc: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  accuracy: number;
  downloads: string;
  likes: number;
  lastUpdated: string;
  license: string;
  tags: string[];
  iconName: string;
  isPopular: boolean;
  gradient: string;
  popularity: number;
  trainingTime: string;
  users: string;
  useCases: string[];
  features: string[];
  advantages: string[];
  howItWorks: string[];
  bestFor: string[];
  parameters: Record<string, string>;
  codeExample: string;
}

// This data has been moved to the database - all models are now fetched via API

// Icon mapping for component rendering
export const iconMap = {
  GitBranch,
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  Zap,
};