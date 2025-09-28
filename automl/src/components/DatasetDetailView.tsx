import React from 'react';
import { ArrowLeft, Download, Eye, Star, Users, Database, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';

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

interface DatasetDetailViewProps {
  dataset: KaggleDataset;
}

export default function DatasetDetailView({ dataset }: DatasetDetailViewProps) {
  const handleDownload = () => {
    window.open(`https://www.kaggle.com/datasets/${dataset.id}`, '_blank');
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <div>
            <Link 
              href="/datasets" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Datasets
            </Link>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <Database className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{dataset.title}</h1>
                  {dataset.isFeatured && (
                    <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs px-2 py-1 rounded-full border border-yellow-500/20">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>by {dataset.owner}</span>
                  <span>•</span>
                  <span>Updated {new Date(dataset.lastUpdated).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{dataset.fileCount} files</span>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-4xl">
                  {dataset.description}
                </p>

                {/* Domain and Task Type */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium capitalize border border-primary/20">
                      {dataset.domain.replace('-', ' ')}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 px-3 py-1 text-sm font-medium capitalize border border-blue-500/20">
                      {dataset.taskType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      dataset.difficulty === 'beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20' :
                      dataset.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20'
                    }`}>
                      {dataset.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
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
                    <span className="text-sm text-muted-foreground">{dataset.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">{dataset.rating.toFixed(1)} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{dataset.size}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  View on Kaggle
                </button>
                <Link
                  href="/dashboard"
                  className="border border-border hover:bg-muted/50 px-6 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Build Model
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Dataset Information */}
            <div className="border border-border rounded-xl p-6 mb-8 bg-card">
              <h2 className="text-xl font-semibold mb-4">Dataset Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Owner</dt>
                  <dd className="text-foreground">{dataset.owner}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Last Updated</dt>
                  <dd className="text-foreground">{new Date(dataset.lastUpdated).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">File Size</dt>
                  <dd className="text-foreground">{dataset.size}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Files</dt>
                  <dd className="text-foreground">{dataset.fileCount} files</dd>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="border border-border rounded-xl p-6 mb-8 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Data Preview</h2>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download from Kaggle
                </button>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Preview not available. Visit Kaggle to explore the dataset structure and download the full data.
                </p>
                <button
                  onClick={handleDownload}
                  className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  View on Kaggle
                </button>
              </div>
            </div>

            {/* Recommended Use Cases */}
            <div className="border border-border rounded-xl p-6 mb-8 bg-card">
              <h2 className="text-xl font-semibold mb-4">Recommended Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Perfect for {dataset.difficulty} level projects</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Ideal for {dataset.taskType} algorithms</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Great for {dataset.domain.replace('-', ' ')} domain</span>
                </div>
                {dataset.taskType === 'regression' && (
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Practice prediction and forecasting</span>
                  </div>
                )}
                {dataset.taskType === 'classification' && (
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <Eye className="h-4 w-4 text-pink-500" />
                    <span className="text-sm text-muted-foreground">Learn pattern recognition</span>
                  </div>
                )}
              </div>
            </div>

            {/* AutoML Workflow */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">AutoML Workflow</h2>
              <p className="text-muted-foreground mb-6">
                Our platform will automatically process this dataset through our machine learning pipeline:
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Data Analysis:</strong> Automated exploration and quality assessment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Preprocessing:</strong> Smart feature engineering and data cleaning
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Model Training:</strong> Train multiple {dataset.taskType} algorithms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Evaluation:</strong> Performance metrics and model comparison
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-4">Quick Stats</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-bold text-foreground">{dataset.size}</div>
                      <div className="text-sm text-muted-foreground">Total size</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-bold text-foreground">{dataset.rating.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Community rating</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-bold text-foreground">{dataset.downloads}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Ready to Start?</h4>
                    <p className="text-sm text-muted-foreground">Build ML models automatically</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Start AutoML Pipeline
                  </Link>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 border border-border bg-background hover:bg-accent px-4 py-3 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Get Dataset
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">💡 Tip:</span> Perfect for {dataset.difficulty} level {dataset.taskType} projects!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}