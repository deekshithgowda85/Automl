'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, Star, CheckCircle, 
  Lightbulb, ChevronRight,
  Download, Heart, Copy, Share2, Tag
} from 'lucide-react';
import Navbar from '../../components/layout/navbar';
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

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id as string;
  const [model, setModel] = useState<MLModelTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/ml-templates/${modelId}`);
        if (response.ok) {
          const data = await response.json();
          setModel(data);
        } else {
          console.error('Failed to fetch model');
        }
      } catch (error) {
        console.error('Error fetching model:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModel();
  }, [modelId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Model Not Found</h1>
          <Link href="/mlmodels" className="text-primary hover:underline">
            ← Back to Models
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[model.iconName as keyof typeof iconMap];

  const handleTrainModel = () => {
    router.push('/dashboard');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(model.codeExample);
  };

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
            <Link 
              href="/mlmodels" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Models
            </Link>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{model.name}</h1>
                  {model.isPopular && (
                    <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs px-2 py-1 rounded-full border border-yellow-500/20">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>by {model.author}</span>
                  <span>•</span>
                  <span>Updated {model.lastUpdated}</span>
                  <span>•</span>
                  <span>{model.license}</span>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-4xl">
                  {model.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted/60 text-muted-foreground text-xs px-2 py-1 rounded hover:bg-muted transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{model.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{model.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">{model.accuracy}% accuracy</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    model.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20' :
                    model.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20' :
                    'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20'
                  }`}>
                    {model.difficulty}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTrainModel}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Train Model
                </button>
                <button className="border border-border hover:bg-muted/50 px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="border border-border hover:bg-muted/50 px-4 py-2 rounded-lg transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Quick Start Code */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-border rounded-xl p-6 mb-8 bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quick Start</h2>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Copy code
                </button>
              </div>
              <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{model.codeExample}</code>
              </pre>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border border-border rounded-xl p-6 mb-8 bg-card"
            >
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <ol className="space-y-3">
                {model.howItWorks.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border border-border rounded-xl p-6 mb-8 bg-card"
            >
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {model.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{advantage}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Best Use Cases */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border border-border rounded-xl p-6 bg-card"
            >
              <h2 className="text-xl font-semibold mb-4">Best Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {model.bestFor.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">{useCase}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Model Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border border-border rounded-xl p-6 bg-card"
              >
                <h3 className="font-semibold mb-4">Model Card</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium text-foreground">{model.category}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      model.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-500' :
                      model.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' :
                      'bg-red-500/10 text-red-600 dark:text-red-500'
                    }`}>
                      {model.difficulty}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">License:</span>
                    <div className="font-medium text-foreground">{model.license}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <div className="font-medium text-foreground">{model.accuracy}%</div>
                  </div>
                </div>
              </motion.div>

              {/* Parameters */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border border-border rounded-xl p-6 bg-card"
              >
                <h3 className="font-semibold mb-4">Key Parameters</h3>
                <div className="space-y-3 text-sm">
                  {Object.entries(model.parameters).map(([param, value], index) => (
                    <div key={index}>
                      <div className="font-medium text-foreground">{param}</div>
                      <div className="text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Learn More */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="border border-border rounded-xl p-6 bg-card"
              >
                <h3 className="font-semibold mb-4">Learn More</h3>
                <div className="space-y-2">
                  <Link 
                    href="/dashboard"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors group text-sm"
                  >
                    <span>Interactive Tutorial</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link 
                    href="/datasets"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors group text-sm"
                  >
                    <span>Sample Datasets</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AutoMLFooter />
    </div>
  );
}