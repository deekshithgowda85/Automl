'use client'

import React, { useState } from 'react';
import Navbar from '../components/layout/navbar';

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

  const handlePreview = (dataset: { id: any; title?: string; slug?: string; description?: string; shortDesc?: string; domain?: string; difficulty?: string; taskType?: string; tags?: string[]; rowsCount?: number; columnsCount?: number; sizeMb?: number; downloadCount?: number; rating?: number; featured?: boolean; targetColumn?: string; }) => {
    console.log('Preview dataset:', dataset.id);
  };

  const handleAnalyze = (dataset: { id: any; title?: string; slug?: string; description?: string; shortDesc?: string; domain?: string; difficulty?: string; taskType?: string; tags?: string[]; rowsCount?: number; columnsCount?: number; sizeMb?: number; downloadCount?: number; rating?: number; featured?: boolean; targetColumn?: string; }) => {
    console.log('Analyze dataset:', dataset.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-16">
        <Navbar />
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
            Dataset Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated collection of high-quality datasets ready for your machine learning projects. 
            From beginner-friendly to advanced challenges.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search datasets, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Domain Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {domains.map((domain) => (
            <button
              key={domain.value}
              onClick={() => setSelectedDomain(domain.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedDomain === domain.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            ⚙️ Filters
            {(selectedDifficulty !== 'All' || selectedTaskType !== 'All') && (
              <span className="ml-1 bg-blue-600 text-white rounded-full w-2 h-2"></span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="max-w-4xl mx-auto mb-8 p-6 bg-white border border-gray-300 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedDifficulty === diff.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Task Type</label>
                <div className="flex flex-wrap gap-2">
                  {taskTypes.map((task) => (
                    <button
                      key={task.value}
                      onClick={() => setSelectedTaskType(task.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTaskType === task.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <div className="mt-4 pt-4 border-t border-gray-300">
                <button
                  onClick={() => {
                    setSelectedDifficulty('All');
                    setSelectedTaskType('All');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {filteredDatasets.length} of {mockDatasets.length} datasets
          </p>
        </div>

        {/* Datasets Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.length > 0 ? (
            filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className="group relative overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Dataset Header */}
                <div className="p-6 pb-4">
                  {/* Domain and Task Type */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 capitalize">
                      {dataset.domain.replace('-', ' ')}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      📊 {dataset.taskType}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {dataset.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {dataset.shortDesc || dataset.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{dataset.rowsCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Rows</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{dataset.columnsCount}</div>
                      <div className="text-xs text-gray-500">Columns</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">
                        {dataset.sizeMb < 1 ? `${(dataset.sizeMb * 1000).toFixed(0)}KB` : `${dataset.sizeMb.toFixed(1)}MB`}
                      </div>
                      <div className="text-xs text-gray-500">Size</div>
                    </div>
                  </div>

                  {/* Rating and Downloads */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      ⭐
                      <span className="text-gray-900 font-medium">{dataset.rating}</span>
                      <span className="text-gray-500">rating</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      📥
                      <span>{dataset.downloadCount.toLocaleString()} downloads</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={`${dataset.id}-tag-${index}`}
                        className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {dataset.tags.length > 4 && (
                      <span className="inline-flex items-center rounded-md bg-gray-200 px-2.5 py-1 text-xs font-medium">
                        +{dataset.tags.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Featured and Difficulty Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.featured && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                        ⭐ Featured
                      </span>
                    )}
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      dataset.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800'
                        : dataset.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
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
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
                    >
                      View Details
                    </a>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(dataset)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
                        title="Quick Preview"
                      >
                        
                      </button>
                      
                      <button
                        onClick={() => handleAnalyze(dataset)}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2.5 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
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
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No datasets found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms, or browse all datasets.
              </p>
              <button
                onClick={() => {
                  setSelectedDomain('All');
                  setSelectedDifficulty('All');
                  setSelectedTaskType('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Show All Datasets
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-2xl border border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Ready to Build Something Amazing?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Pick a dataset that interests you and let our platform guide you through the entire machine learning workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/magic-path"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
            >
             
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}