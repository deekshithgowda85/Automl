'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Star, Download, Heart, 
  Filter, Search, Tag, ArrowUpDown
} from 'lucide-react';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';
import { iconMap } from '@/lib/ml-models-data';

interface MLModelTemplate {
  id: string;
  slug: string;
  name: string;
  author: string;
  description: string;
  shortDesc: string;
  category: string;
  difficulty: string;
  accuracy: number;
  downloads: string;
  likes: number;
  lastUpdated: string;
  tags: string[];
  iconName: string;
  isPopular: boolean;
  gradient: string;
  popularity: number;
}

const categoryMapping: Record<string, string> = {
  'Ensemble Learning': 'tabular-classification',
  'Gradient Boosting': 'tabular-classification', 
  'Deep Learning': 'computer-vision',
  'Classical ML': 'tabular-classification',
  'Statistical Learning': 'tabular-classification',
  'Unsupervised Learning': 'clustering'
};

const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };

export default function MLModelsPage() {
  const [models, setModels] = useState<MLModelTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ml-templates');
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        console.error('Failed to fetch models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort models
  const filteredModels = models
    .filter(model => {
      const matchesSearch = searchTerm === '' || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        categoryMapping[model.category] === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'downloads': 
          return parseInt(b.downloads.replace('K', '')) - parseInt(a.downloads.replace('K', ''));
        case 'likes': 
          return b.likes - a.likes;
        case 'accuracy': 
          return b.accuracy - a.accuracy;
        case 'difficulty':
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        default: 
          return b.popularity - a.popularity;
      }
    });

  const categories = [
    { id: 'all', label: 'All Models', count: models.length },
    { id: 'tabular-classification', label: 'Tabular Classification', count: models.filter(m => categoryMapping[m.category] === 'tabular-classification').length },
    { id: 'computer-vision', label: 'Computer Vision', count: models.filter(m => categoryMapping[m.category] === 'computer-vision').length },
    { id: 'clustering', label: 'Clustering', count: models.filter(m => categoryMapping[m.category] === 'clustering').length }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-foreground">Models</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Discover machine learning models for your next project
            </p>
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="downloads">Most Downloads</option>
                    <option value="likes">Most Liked</option>
                    <option value="updated">Recently Updated</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-32"
            >
              <div className="border border-border rounded-xl p-4 bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Categories</h3>
                </div>
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Models Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredModels.length} models
              </p>
            </div>

            <div className="space-y-4">
              {filteredModels.map((model, index) => {
                const IconComponent = iconMap[model.iconName as keyof typeof iconMap];
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/mlmodels/${model.slug}`}>
                      <div className="group border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200 bg-card hover:bg-card/80 cursor-pointer">
                        <div className="flex items-start gap-4">
                          
                          {/* Model Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          {/* Model Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {model.name}
                              </h3>
                              {model.isPopular && (
                                <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs px-2 py-0.5 rounded-full border border-yellow-500/20">
                                  Popular
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <span>by {model.author}</span>
                              <span>•</span>
                              <span>Updated {model.lastUpdated}</span>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                              {model.description}
                            </p>

                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-4">
                              <Tag className="h-3 w-3 text-muted-foreground" />
                              <div className="flex flex-wrap gap-1">
                                {model.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="bg-muted/50 text-muted-foreground text-xs px-2 py-0.5 rounded hover:bg-muted transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {model.tags.length > 3 && (
                                  <span className="text-muted-foreground text-xs px-2 py-0.5">
                                    +{model.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Download className="h-4 w-4" />
                                  <span>{model.downloads}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{model.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span>{model.accuracy}%</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  model.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20' :
                                  model.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20' :
                                  'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20'
                                }`}>
                                  {model.difficulty}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {filteredModels.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No models found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
      )}

      <AutoMLFooter />
    </div>
  );
}