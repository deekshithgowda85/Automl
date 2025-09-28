'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

// Type definitions for Kaggle datasets
interface KaggleDataset {
  id: string;
  title: string;
  description: string;
  owner: string;
  downloads: string;
  rating: number;
  tags: string[];
  size: string;
  lastUpdated: string;
  isFeatured: boolean;
  fileCount: number;
  taskType: string;
  difficulty: string;
  domain: string;
}

interface KaggleResponse {
  datasets: KaggleDataset[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  error?: string;
}

const domains = [
  { value: 'all', label: 'All Domains', emoji: '🗃' },
  { value: 'ai-ml', label: 'AI & ML', emoji: '🧠' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'business', label: 'Business', emoji: '👥' },
  { value: 'real-estate', label: 'Real Estate', emoji: '🏠' },
  { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'general', label: 'General', emoji: '📊' }
];

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const taskTypes = [
  { value: 'all', label: 'All Tasks' },
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
  { value: 'time-series', label: 'Time Series' },
  { value: 'clustering', label: 'Clustering' }
];

export default function Datasets() {
  const [datasets, setDatasets] = useState<KaggleDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTaskType, setSelectedTaskType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch datasets from Kaggle API
  const fetchDatasets = async (searchTerm: string = '', pageNum: number = 1, reset: boolean = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        page: pageNum.toString(),
        pageSize: '20'
      });

      const response = await fetch(`/api/datasets/kaggle?${params}`);
      const data: KaggleResponse = await response.json();

      if (reset) {
        setDatasets(data.datasets);
      } else {
        setDatasets(prev => [...prev, ...data.datasets]);
      }
      
      setHasMore(data.hasMore);
      setError(data.error || null);
    } catch (err) {
      setError('Failed to fetch datasets from Kaggle');
      console.error('Error fetching datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Search handler with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchDatasets(searchQuery, 1, true);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Load more datasets
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDatasets(searchQuery, nextPage, false);
  };

  // Filter datasets based on selected filters
  const filteredDatasets = datasets.filter((dataset) => {
    const domainMatch = selectedDomain === 'all' || dataset.domain === selectedDomain;
    const difficultyMatch = selectedDifficulty === 'all' || dataset.difficulty === selectedDifficulty;
    const taskTypeMatch = selectedTaskType === 'all' || dataset.taskType === selectedTaskType;

    return domainMatch && difficultyMatch && taskTypeMatch;
  });

  const clearFilters = () => {
    setSelectedDomain('all');
    setSelectedDifficulty('all');
    setSelectedTaskType('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Kaggle Dataset Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore real-world datasets from Kaggle community. Perfect for practicing machine learning 
              and building your data science portfolio.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search Kaggle datasets..."
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
              {(selectedDifficulty !== 'all' || selectedTaskType !== 'all') && (
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
              {(selectedDifficulty !== 'all' || selectedTaskType !== 'all' || searchQuery !== '') && (
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    onClick={clearFilters}
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
              Showing {filteredDatasets.length} datasets from Kaggle
            </p>
          </div>

          {/* Loading state */}
          {loading && page === 1 && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading datasets from Kaggle...</p>
            </div>
          )}

          {/* Datasets Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.length > 0 ? (
              filteredDatasets.map((dataset, index) => (
                <div
                  key={`${dataset.id}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card glass-effect shadow-professional transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Featured badge */}
                  {dataset.isFeatured && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-main text-white text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  )}

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
                    <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-gradient transition-all duration-300 mb-2 line-clamp-2">
                      {dataset.title}
                    </h3>
                    
                    {/* Owner */}
                    <p className="text-sm text-muted-foreground mb-2">
                      by <span className="font-medium">{dataset.owner}</span>
                    </p>
                    
                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4 text-sm">
                      {dataset.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dataset.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {dataset.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{dataset.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-xl mb-4">
                      <div className="text-center">
                        <div className="font-bold text-foreground text-sm">{dataset.downloads}</div>
                        <div className="text-xs text-muted-foreground">Downloads</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-foreground text-sm">{dataset.rating.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-foreground text-sm">{dataset.size}</div>
                        <div className="text-xs text-muted-foreground">Size</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Link
                        href={`/datasets/${dataset.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-main text-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
                      >
                        View Details
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No datasets found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center rounded-xl bg-gradient-main text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg btn-theme"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>

          {/* Load More Button */}
          {hasMore && filteredDatasets.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-card text-foreground border border-border hover:bg-accent px-6 py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Loading more...
                  </>
                ) : (
                  <>
                    Load More Datasets
                    <span className="ml-2">↓</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-card glass-effect rounded-2xl border border-border shadow-professional">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Start Your ML Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Found an interesting dataset? Download it from Kaggle and upload it to our platform to start 
              building ML models with our automated pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-main text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
              >
                🚀 Upload Dataset
              </a>
              <a
                href="/profile"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-accent px-6 py-3 text-sm font-medium transition-all duration-300"
              >
                📚 View Models
              </a>
            </div>
          </div>
        </div>
      </main>
      <AutoMLFooter />
    </div>
  );
}