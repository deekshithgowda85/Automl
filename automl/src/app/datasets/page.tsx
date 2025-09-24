'use client'

import React, { useState } from 'react';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

// Utility function to format numbers consistently for hydration
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Type definitions
interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
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
  targetColumn?: string;
}

// Mock data for demonstration
const mockDatasets = [
  {
    id: '1',
    title: 'Titanic Survival Prediction',
    slug: 'titanic-survival',
    description: 'Classic beginner dataset for binary classification. Predict passenger survival based on demographics and ticket information.',
    shortDesc: 'Classic beginner dataset for binary classification prediction',
    domain: 'ml-basics',
    difficulty: 'beginner',
    taskType: 'classification',
    tags: ['classification', 'beginner', 'historic', 'binary'],
    rowsCount: 891,
    columnsCount: 12,
    sizeMb: 0.06,
    downloadCount: 15420,
    rating: 4.8,
    featured: true,
    targetColumn: 'Survived',
  },
  {
    id: '2',
    title: 'House Prices Advanced',
    slug: 'house-prices-advanced',
    description: 'Predict house prices using 79 explanatory variables. Great for feature engineering practice.',
    shortDesc: 'Advanced regression dataset for house price prediction',
    domain: 'real-estate',
    difficulty: 'intermediate',
    taskType: 'regression',
    tags: ['regression', 'real-estate', 'feature-engineering', 'advanced'],
    rowsCount: 1460,
    columnsCount: 81,
    sizeMb: 0.46,
    downloadCount: 12890,
    rating: 4.7,
    featured: true,
    targetColumn: 'SalePrice',
  },
  {
    id: '3',
    title: 'Customer Churn Analysis',
    slug: 'customer-churn-analysis',
    description: 'Telecom customer churn prediction. Identify customers likely to cancel their subscription.',
    shortDesc: 'Business analytics dataset for customer retention prediction',
    domain: 'business',
    difficulty: 'intermediate',
    taskType: 'classification',
    tags: ['classification', 'business', 'customer-analytics', 'churn'],
    rowsCount: 7043,
    columnsCount: 21,
    sizeMb: 0.96,
    downloadCount: 8750,
    rating: 4.6,
    featured: false,
    targetColumn: 'Churn',
  },
  {
    id: '4',
    title: 'Credit Card Fraud Detection',
    slug: 'credit-fraud-detection',
    description: 'Highly imbalanced dataset for fraud detection. Advanced techniques required.',
    shortDesc: 'Advanced fraud detection with imbalanced classes',
    domain: 'finance',
    difficulty: 'advanced',
    taskType: 'classification',
    tags: ['fraud-detection', 'imbalanced', 'finance', 'security'],
    rowsCount: 284807,
    columnsCount: 31,
    sizeMb: 150.83,
    downloadCount: 5420,
    rating: 4.9,
    featured: true,
    targetColumn: 'Class',
  },
  {
    id: '5',
    title: 'Wine Quality Assessment',
    slug: 'wine-quality-assessment',
    description: 'Predict wine quality based on physicochemical properties. Multi-class classification problem.',
    shortDesc: 'Multi-class classification for wine quality prediction',
    domain: 'lifestyle',
    difficulty: 'beginner',
    taskType: 'classification',
    tags: ['classification', 'multiclass', 'chemistry', 'food'],
    rowsCount: 4898,
    columnsCount: 12,
    sizeMb: 0.34,
    downloadCount: 3210,
    rating: 4.5,
    featured: false,
    targetColumn: 'quality',
  },
  {
    id: '6',
    title: 'Stock Market Prediction',
    slug: 'stock-market-prediction',
    description: 'Time series analysis of stock market data. Predict future stock prices.',
    shortDesc: 'Time series dataset for financial market prediction',
    domain: 'finance',
    difficulty: 'advanced',
    taskType: 'time-series',
    tags: ['time-series', 'finance', 'prediction', 'trading'],
    rowsCount: 25600,
    columnsCount: 15,
    sizeMb: 5.2,
    downloadCount: 7890,
    rating: 4.4,
    featured: false,
    targetColumn: 'Close',
  }
];

const domains = [
  { value: 'All', label: 'All Domains', emoji: '🗃' },
  { value: 'ml-basics', label: 'ML Basics', emoji: '🧠' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'business', label: 'Business', emoji: '👥' },
  { value: 'real-estate', label: 'Real Estate', emoji: '🏠' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '✨' }
];

const difficulties = [
  { value: 'All', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const taskTypes = [
  { value: 'All', label: 'All Tasks' },
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
  { value: 'time-series', label: 'Time Series' },
  { value: 'clustering', label: 'Clustering' }
];

export default function Datasets() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTaskType, setSelectedTaskType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter datasets based on selected filters
  const filteredDatasets = mockDatasets.filter((dataset) => {
    const domainMatch = selectedDomain === 'All' || dataset.domain === selectedDomain;
    const difficultyMatch = selectedDifficulty === 'All' || dataset.difficulty === selectedDifficulty;
    const taskTypeMatch = selectedTaskType === 'All' || dataset.taskType === selectedTaskType;
    const searchMatch = searchQuery === '' || 
      dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return domainMatch && difficultyMatch && taskTypeMatch && searchMatch;
  });

  const handlePreview = (dataset: Dataset) => {
    console.log('Preview dataset:', dataset.id);
  };

  const handleAnalyze = (dataset: Dataset) => {
    console.log('Analyze dataset:', dataset.id);
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Dataset Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated collection of high-quality datasets ready for your machine learning projects. 
              From beginner-friendly to advanced challenges.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search datasets, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-professional glass-effect"
              />
            </div>
          </div>

          {/* Domain Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {domains.map((domain) => (
              <button
                key={domain.value}
                onClick={() => setSelectedDomain(domain.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-professional ${
                  selectedDomain === domain.value
                    ? 'bg-gradient-main text-white shadow-lg scale-105'
                    : 'bg-card text-foreground hover:bg-accent border border-border'
                }`}
              >
                <span>{domain.emoji}</span>
                {domain.label}
                {domain.value !== 'All' && (
                  <span className="ml-1 text-xs opacity-70">
                    ({mockDatasets.filter((d) => d.domain === domain.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-card text-foreground hover:bg-accent border border-border rounded-xl text-sm font-medium transition-all duration-300 shadow-professional"
            >
              ⚙️ Filters
              {(selectedDifficulty !== 'All' || selectedTaskType !== 'All') && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-2 h-2"></span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="max-w-4xl mx-auto mb-8 p-6 bg-card glass-effect border border-border rounded-2xl shadow-professional animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Difficulty Level</label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => setSelectedDifficulty(diff.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedDifficulty === diff.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Task Type</label>
                  <div className="flex flex-wrap gap-2">
                    {taskTypes.map((task) => (
                      <button
                        key={task.value}
                        onClick={() => setSelectedTaskType(task.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedTaskType === task.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {task.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedDifficulty !== 'All' || selectedTaskType !== 'All') && (
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setSelectedDifficulty('All');
                      setSelectedTaskType('All');
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Showing {filteredDatasets.length} of {mockDatasets.length} datasets
            </p>
          </div>

          {/* Datasets Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.length > 0 ? (
              filteredDatasets.map((dataset, index) => (
                <div
                  key={dataset.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card glass-effect shadow-professional transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Dataset Header */}
                  <div className="p-6 pb-4">
                    {/* Domain and Task Type */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium capitalize border border-primary/20">
                        {dataset.domain.replace('-', ' ')}
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        📊 {dataset.taskType}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-gradient transition-all duration-300 mb-2">
                      {dataset.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {dataset.shortDesc || dataset.description}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-xl mb-4">
                      <div className="text-center">
                        <div className="font-bold text-foreground">{formatNumber(dataset.rowsCount)}</div>
                        <div className="text-xs text-muted-foreground">Rows</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-foreground">{dataset.columnsCount}</div>
                        <div className="text-xs text-muted-foreground">Columns</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-foreground">
                          {dataset.sizeMb < 1 ? `${(dataset.sizeMb * 1000).toFixed(0)}KB` : `${dataset.sizeMb.toFixed(1)}MB`}
                        </div>
                        <div className="text-xs text-muted-foreground">Size</div>
                      </div>
                    </div>

                    {/* Rating and Downloads */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-1 text-yellow-500">
                        ⭐
                        <span className="text-foreground font-medium">{dataset.rating}</span>
                        <span className="text-muted-foreground">rating</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        📥
                        <span>{formatNumber(dataset.downloadCount)} downloads</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.tags.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={`${dataset.id}-tag-${tagIndex}`}
                          className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                      {dataset.tags.length > 4 && (
                        <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          +{dataset.tags.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Featured and Difficulty Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.featured && (
                        <span className="inline-flex items-center rounded-full bg-gradient-warning px-2.5 py-1 text-xs font-medium text-white">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        dataset.difficulty === 'beginner' 
                          ? 'bg-gradient-success text-white'
                          : dataset.difficulty === 'intermediate'
                          ? 'bg-gradient-warning text-white'
                          : 'bg-gradient-accent text-white'
                      }`}>
                        {dataset.difficulty === 'beginner' && '🟢 Beginner'}
                        {dataset.difficulty === 'intermediate' && '🟡 Intermediate'}
                        {dataset.difficulty === 'advanced' && '🔴 Advanced'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <a
                        href={`/datasets/${dataset.slug}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-main text-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
                      >
                        View Details
                      </a>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(dataset)}
                          className="inline-flex items-center justify-center rounded-xl border border-border bg-card hover:bg-accent px-3 py-2.5 text-sm font-medium transition-all duration-300"
                          title="Quick Preview"
                        >
                          👁️
                        </button>
                        
                        <button
                          onClick={() => handleAnalyze(dataset)}
                          className="inline-flex items-center justify-center rounded-xl bg-gradient-accent text-white px-3 py-2.5 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl btn-theme"
                          title="Start Analysis"
                        >
                          ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No datasets found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms, or browse all datasets.
                </p>
                <button
                  onClick={() => {
                    setSelectedDomain('All');
                    setSelectedDifficulty('All');
                    setSelectedTaskType('All');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center rounded-xl bg-gradient-main text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg btn-theme"
                >
                  Show All Datasets
                </button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-card glass-effect rounded-2xl border border-border shadow-professional">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Ready to Build Something Amazing?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Pick a dataset that interests you and let our platform guide you through the entire machine learning workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-main text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
              >
                🚀 Start Building
              </a>
              <a
                href="/profile"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-accent px-6 py-3 text-sm font-medium transition-all duration-300"
              >
                📚 View Profile
              </a>
            </div>
          </div>
        </div>
      </main>
      <AutoMLFooter />
    </div>
  );
}