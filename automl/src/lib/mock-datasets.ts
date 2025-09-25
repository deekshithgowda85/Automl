export interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  domain: string;
  difficulty: string;
  taskType: string;
  tags: string[];
  rowsCount: number;
  columnsCount: number;
  sizeMb: number;
  downloadCount: number;
  rating: number;
  featured: boolean;
  status: string;
  targetColumn: string;
  createdAt: string;
  lastUpdated: string;
}

export const datasetsCatalog: Dataset[] = [
  {
    id: '1',
    title: 'Medical Insurance Cost Prediction',
    slug: 'medical-insurance-cost',
    description: 'Predict medical insurance costs based on demographic and lifestyle factors. Perfect for regression analysis and understanding healthcare pricing.',
    shortDesc: 'Predict insurance costs using demographic data',
    domain: 'healthcare',
    difficulty: 'beginner',
    taskType: 'regression',
    tags: ['healthcare', 'insurance', 'medical', 'regression', 'cost-prediction'],
    rowsCount: 1338,
    columnsCount: 7,
    sizeMb: 0.08,
    downloadCount: 15001,
    rating: 4.5,
    featured: true,
    status: 'READY',
    targetColumn: 'charges',
    createdAt: '2024-01-15T00:00:00Z',
    lastUpdated: '2024-03-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Student Academic Performance Analysis',
    slug: 'student-academic-performance',
    description: 'Analyze student academic trends and performance based on various factors like study time, parental education, and extracurricular activities.',
    shortDesc: 'Educational dataset for student performance analysis',
    domain: 'education',
    difficulty: 'beginner',
    taskType: 'classification',
    tags: ['education', 'students', 'academic', 'performance', 'classification'],
    rowsCount: 1000,
    columnsCount: 10,
    sizeMb: 0.12,
    downloadCount: 8920,
    rating: 4.3,
    featured: false,
    status: 'READY',
    targetColumn: 'final_grade',
    createdAt: '2024-02-10T00:00:00Z',
    lastUpdated: '2024-03-18T00:00:00Z'
  },
  {
    id: '3',
    title: 'E-commerce Customer Behavior',
    slug: 'ecommerce-customer-behavior',
    description: 'Customer purchase behavior and preferences for e-commerce analysis. Includes browsing history, purchase patterns, and demographic data.',
    shortDesc: 'E-commerce customer behavior and purchase patterns',
    domain: 'business',
    difficulty: 'intermediate',
    taskType: 'classification',
    tags: ['ecommerce', 'business', 'customer-behavior', 'classification', 'marketing'],
    rowsCount: 5630,
    columnsCount: 15,
    sizeMb: 0.45,
    downloadCount: 12450,
    rating: 4.6,
    featured: true,
    status: 'READY',
    targetColumn: 'purchased',
    createdAt: '2024-01-20T00:00:00Z',
    lastUpdated: '2024-03-15T00:00:00Z'
  },
  {
    id: '4',
    title: 'Stock Market Price Prediction',
    slug: 'stock-market-prediction',
    description: 'Historical stock market data for time series analysis and price prediction. Includes multiple technical indicators and market metrics.',
    shortDesc: 'Time series dataset for stock price prediction',
    domain: 'finance',
    difficulty: 'advanced',
    taskType: 'time-series',
    tags: ['finance', 'stocks', 'time-series', 'prediction', 'trading'],
    rowsCount: 2520,
    columnsCount: 8,
    sizeMb: 0.25,
    downloadCount: 7560,
    rating: 4.4,
    featured: false,
    status: 'READY',
    targetColumn: 'close_price',
    createdAt: '2024-02-05T00:00:00Z',
    lastUpdated: '2024-03-12T00:00:00Z'
  },
  {
    id: '5',
    title: 'Real Estate Price Analysis',
    slug: 'real-estate-prices',
    description: 'Property prices and features for real estate market analysis. Includes location data, property characteristics, and market trends.',
    shortDesc: 'Real estate property prices and features',
    domain: 'real-estate',
    difficulty: 'intermediate',
    taskType: 'regression',
    tags: ['real-estate', 'property', 'prices', 'regression', 'housing'],
    rowsCount: 21613,
    columnsCount: 21,
    sizeMb: 1.8,
    downloadCount: 18320,
    rating: 4.7,
    featured: true,
    status: 'READY',
    targetColumn: 'price',
    createdAt: '2024-01-08T00:00:00Z',
    lastUpdated: '2024-03-10T00:00:00Z'
  }
];