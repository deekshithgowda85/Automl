'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';
import DatasetDetailView from '@/components/DatasetDetailView';
// Define TypeScript interfaces matching Kaggle API
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

export default function DatasetCategory() {
  const params = useParams();
  const [datasets, setDatasets] = useState<KaggleDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [dataset, setDataset] = useState<KaggleDataset | null>(null);

  // Extract category from slug with memoization
  const slug = useMemo(() => 
    Array.isArray(params?.slug) ? params.slug : [], 
    [params?.slug]
  );
  const category = useMemo(() => slug[0] || 'all', [slug]);

  // Check if this looks like a dataset detail URL (2 segments that look like owner/dataset-name)
  const isDetailURL = useMemo(() => {
    return slug.length === 2 && slug[1].length > 10; // Assuming dataset names are longer
  }, [slug]);

  // Fetch individual dataset for detail view
  const fetchDataset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fullId = slug.join('/');
      const response = await fetch(`/api/datasets/kaggle?page=1&pageSize=100`);
      const data = await response.json();
      const found = data.datasets.find((d: KaggleDataset) => d.id === fullId);
      if (found) {
        setDataset(found);
      } else {
        setError('Dataset not found.');
      }
    } catch {
      setError('Failed to fetch dataset from Kaggle.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Category display names
  const getCategoryDisplayName = (cat: string) => {
    const categories: Record<string, string> = {
      'ai-ml': 'AI & Machine Learning',
      'computer-vision': 'Computer Vision',
      'nlp': 'Natural Language Processing',
      'finance': 'Finance',
      'healthcare': 'Healthcare',
      'real-estate': 'Real Estate',
      'business': 'Business & Marketing',
      'entertainment': 'Entertainment',
      'sports': 'Sports',
      'education': 'Education',
      'government': 'Government',
      'environment': 'Environment',
      'all': 'All Categories'
    };
    return categories[cat] || decodeURIComponent(cat).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check if this is a known category
  const isKnownCategory = (cat: string) => {
    const categories = ['ai-ml', 'computer-vision', 'nlp', 'finance', 'healthcare', 'real-estate', 'business', 'entertainment', 'sports', 'education', 'government', 'environment', 'all'];
    return categories.includes(cat);
  };

  // Fetch datasets from Kaggle API
  const fetchDatasets = useCallback(async (searchTerm: string = '', pageNum: number = 1, reset: boolean = true) => {
    if (!reset && !hasMore) return; // Don't fetch if no more data
    
    setLoading(true);
    try {
      // If no explicit search term and category isn't known, treat category as search term
      const actualSearchTerm = searchTerm || (isKnownCategory(category) ? (category === 'all' ? '' : category) : decodeURIComponent(category));
      
      const searchParams = new URLSearchParams({
        search: actualSearchTerm,
        page: pageNum.toString(),
        pageSize: '20'
      });

      console.log('Fetching datasets with search:', actualSearchTerm);
      const response = await fetch(`/api/datasets/kaggle?${searchParams}`);
      const data: KaggleResponse = await response.json();
      console.log('Received data:', data);

      if (reset) {
        setDatasets(data.datasets);
        setTotalCount(data.total);
      } else {
        setDatasets(prev => [...prev, ...data.datasets]);
      }
      
      setHasMore(data.hasMore);
      setError(data.error || null);
    } catch {
      setError('Failed to fetch datasets from Kaggle');
    } finally {
      setLoading(false);
    }
  }, [category, hasMore]);

  // Initial load - either fetch dataset details or category datasets
  useEffect(() => {
    setPage(1);
    if (isDetailURL) {
      fetchDataset();
    } else {
      fetchDatasets();
    }
  }, [category, isDetailURL, fetchDataset, fetchDatasets]);

  // Search handler with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchDatasets(searchQuery, 1, true);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchDatasets]);

  // Load more datasets
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDatasets(searchQuery, nextPage, false);
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <Navbar />
      
      {/* Check if this is a dataset detail view */}
      {isDetailURL ? (
        // If we have dataset data, show detail view
        dataset ? (
          <DatasetDetailView dataset={dataset} />
        ) : loading ? (
          <div className="pt-24 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="inline-block animate-spin h-8 w-8 text-primary mb-4" />
              <p className="text-muted-foreground">Loading dataset details...</p>
            </div>
          </div>
        ) : (
          <div className="pt-24 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Dataset Not Found</h1>
              <Link href="/datasets" className="text-primary hover:underline">
                ← Back to Datasets
              </Link>
            </div>
          </div>
        )
      ) : (
        // Show category/search view
        <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/datasets"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Datasets
            </Link>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              {isKnownCategory(category) ? getCategoryDisplayName(category) : `Search: ${getCategoryDisplayName(category)}`} Datasets
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isKnownCategory(category) 
                ? `Explore ${category === 'all' ? 'all available' : getCategoryDisplayName(category).toLowerCase()} datasets from Kaggle`
                : `Search results for "${decodeURIComponent(category)}" from Kaggle`
              }
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${getCategoryDisplayName(category).toLowerCase()} datasets...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-professional glass-effect"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              {loading && page === 1 ? (
                'Loading datasets...'
              ) : (
                `Showing ${datasets.length} of ${totalCount > 0 ? totalCount : datasets.length} datasets`
              )}
            </p>
          </div>

          {/* Loading state */}
          {loading && page === 1 && (
            <div className="text-center py-12">
              <Loader2 className="inline-block animate-spin h-8 w-8 text-primary mb-2" />
              <p className="text-muted-foreground">Loading datasets from Kaggle...</p>
            </div>
          )}

          {/* Datasets Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {datasets.length > 0 ? (
              datasets.map((dataset, index) => (
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

                  {/* Dataset Card Content */}
                  <div className="p-6">
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
                      {dataset.description || 'No description available'}
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
                    <div className="flex gap-3">
                      <Link
                        href={`/datasets/${dataset.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-accent px-4 py-2.5 text-sm font-medium transition-all duration-300"
                      >
                        View Details
                      </Link>
                      <a
                        href={`https://www.kaggle.com/datasets/${dataset.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-main text-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
                        title="View on Kaggle"
                      >
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No datasets found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or browse other categories.
                </p>
                <Link
                  href="/datasets"
                  className="inline-flex items-center rounded-xl bg-gradient-main text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg btn-theme"
                >
                  Browse All Datasets
                </Link>
              </div>
            ) : null}
          </div>

          {/* Load More Button */}
          {hasMore && datasets.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-card text-foreground border border-border hover:bg-accent px-6 py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="inline-block animate-spin h-4 w-4 mr-2" />
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
            <h2 className="text-2xl font-bold mb-4 text-gradient">Start Building with Real Data</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Found a dataset that interests you? View the details page or head to Kaggle to download it and start building 
              your machine learning models with our automated pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-main text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-lg btn-theme"
              >
                🚀 Start Building
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-accent px-6 py-3 text-sm font-medium transition-all duration-300"
              >
                📚 Browse All Categories
              </Link>
            </div>
          </div>
        </div>
        </main>
      )}
      
      <AutoMLFooter />
    </div>
  );
}