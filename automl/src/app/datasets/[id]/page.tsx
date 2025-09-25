'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Eye, Star, Users, Database, BarChart3, TrendingUp, FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

interface Dataset {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  taskType: 'classification' | 'regression' | 'time-series';
  tags: string[];
  size: string;
  downloads: string;
  rating: number;
  rows: number;
  columns: number;
  author?: string;
  lastUpdated?: string;
  license?: string;
  sampleData?: Record<string, unknown>[];
}

const sampleDatasets: Record<string, Dataset> = {
  '1': {
    id: '1',
    title: 'Titanic Survival Prediction',
    description: 'Classic beginner dataset for binary classification. Predict passenger survival based on demographics and ticket information including age, sex, passenger class, fare, and embarkation port.',
    domain: 'ml-basics',
    difficulty: 'beginner',
    taskType: 'classification',
    tags: ['classification', 'beginner', 'historic', 'binary'],
    size: '60KB',
    downloads: '15k+',
    rating: 4.8,
    rows: 891,
    columns: 12,
    author: 'Kaggle',
    lastUpdated: '2024-09-15',
    license: 'CC BY 4.0',
    sampleData: [
      { PassengerId: 1, Survived: 0, Pclass: 3, Name: 'Braund, Mr. Owen Harris', Sex: 'male', Age: 22, SibSp: 1, Parch: 0, Ticket: 'A/5 21171', Fare: 7.25, Cabin: null, Embarked: 'S' },
      { PassengerId: 2, Survived: 1, Pclass: 1, Name: 'Cumings, Mrs. John Bradley', Sex: 'female', Age: 38, SibSp: 1, Parch: 0, Ticket: 'PC 17599', Fare: 71.2833, Cabin: 'C85', Embarked: 'C' },
      { PassengerId: 3, Survived: 1, Pclass: 3, Name: 'Heikkinen, Miss. Laina', Sex: 'female', Age: 26, SibSp: 0, Parch: 0, Ticket: 'STON/O2. 3101282', Fare: 7.925, Cabin: null, Embarked: 'S' }
    ]
  },
  '2': {
    id: '2',
    title: 'House Prices Advanced',
    description: 'Predict house prices using 79 explanatory variables describing various aspects of residential homes. Great for feature engineering practice and learning advanced regression techniques.',
    domain: 'real-estate',
    difficulty: 'intermediate',
    taskType: 'regression',
    tags: ['regression', 'real-estate', 'feature-engineering', 'advanced'],
    size: '460KB',
    downloads: '12k+',
    rating: 4.7,
    rows: 1460,
    columns: 81,
    author: 'Ames Housing Dataset',
    lastUpdated: '2024-08-20',
    license: 'MIT',
    sampleData: [
      { Id: 1, MSSubClass: 60, MSZoning: 'RL', LotFrontage: 65, LotArea: 8450, Street: 'Pave', SalePrice: 208500 },
      { Id: 2, MSSubClass: 20, MSZoning: 'RL', LotFrontage: 80, LotArea: 9600, Street: 'Pave', SalePrice: 181500 },
      { Id: 3, MSSubClass: 60, MSZoning: 'RL', LotFrontage: 68, LotArea: 11250, Street: 'Pave', SalePrice: 223500 }
    ]
  },
  '3': {
    id: '3',
    title: 'Customer Churn Analysis',
    description: 'Telecom customer churn prediction dataset. Identify customers likely to cancel their subscription based on their usage patterns, billing history, and demographics.',
    domain: 'business',
    difficulty: 'intermediate',
    taskType: 'classification',
    tags: ['classification', 'business', 'customer-analytics', 'churn'],
    size: '960KB',
    downloads: '8.7k+',
    rating: 4.6,
    rows: 7043,
    columns: 21,
    author: 'Telco Analytics Team',
    lastUpdated: '2024-07-10',
    license: 'CC BY 4.0',
    sampleData: [
      { customerID: '7590-VHVEG', gender: 'Female', SeniorCitizen: 0, Partner: 'Yes', Dependents: 'No', tenure: 1, MonthlyCharges: 29.85, TotalCharges: 29.85, Churn: 'No' },
      { customerID: '5575-GNVDE', gender: 'Male', SeniorCitizen: 0, Partner: 'No', Dependents: 'No', tenure: 34, MonthlyCharges: 56.95, TotalCharges: 1889.5, Churn: 'No' },
      { customerID: '3668-QPYBK', gender: 'Male', SeniorCitizen: 0, Partner: 'No', Dependents: 'No', tenure: 2, MonthlyCharges: 53.85, TotalCharges: 108.15, Churn: 'Yes' }
    ]
  },
  '4': {
    id: '4',
    title: 'Credit Card Fraud Detection',
    description: 'Highly imbalanced dataset for fraud detection. Contains transactions made by credit cards with fraudulent and non-fraudulent labels. Advanced techniques required for handling class imbalance.',
    domain: 'finance',
    difficulty: 'advanced',
    taskType: 'classification',
    tags: ['fraud-detection', 'imbalanced', 'finance', 'security'],
    size: '150MB',
    downloads: '5.4k+',
    rating: 4.9,
    rows: 284807,
    columns: 31,
    author: 'ULB Machine Learning Group',
    lastUpdated: '2024-06-15',
    license: 'ODC-By',
    sampleData: [
      { Time: 0, V1: -1.3598, V2: -0.0728, V3: 2.5363, V4: 1.3782, Amount: 149.62, Class: 0 },
      { Time: 0, V1: 1.1918, V2: 0.2662, V3: 0.1665, V4: 0.4481, Amount: 2.69, Class: 0 },
      { Time: 1, V1: -1.3583, V2: -1.3402, V3: 1.7735, V4: 0.3798, Amount: 378.66, Class: 0 }
    ]
  },
  '5': {
    id: '5',
    title: 'Wine Quality Assessment',
    description: 'Predict wine quality based on physicochemical properties like acidity, sugar content, pH, and alcohol percentage. Multi-class classification problem with quality ratings from 3 to 9.',
    domain: 'lifestyle',
    difficulty: 'beginner',
    taskType: 'classification',
    tags: ['classification', 'multiclass', 'chemistry', 'food'],
    size: '340KB',
    downloads: '3.2k+',
    rating: 4.5,
    rows: 4898,
    columns: 12,
    author: 'UCI ML Repository',
    lastUpdated: '2024-05-20',
    license: 'CC BY 4.0',
    sampleData: [
      { fixed_acidity: 7.4, volatile_acidity: 0.7, citric_acid: 0, residual_sugar: 1.9, chlorides: 0.076, free_sulfur_dioxide: 11, total_sulfur_dioxide: 34, density: 0.9978, pH: 3.51, sulphates: 0.56, alcohol: 9.4, quality: 5 },
      { fixed_acidity: 7.8, volatile_acidity: 0.88, citric_acid: 0, residual_sugar: 2.6, chlorides: 0.098, free_sulfur_dioxide: 25, total_sulfur_dioxide: 67, density: 0.9968, pH: 3.2, sulphates: 0.68, alcohol: 9.8, quality: 5 }
    ]
  },
  '6': {
    id: '6',
    title: 'Stock Market Prediction',
    description: 'Time series analysis of stock market data with historical prices, volume, and technical indicators. Predict future stock prices using advanced time series forecasting techniques.',
    domain: 'finance',
    difficulty: 'advanced',
    taskType: 'time-series',
    tags: ['time-series', 'finance', 'forecasting', 'stocks'],
    size: '2.5MB',
    downloads: '2.1k+',
    rating: 4.4,
    rows: 12420,
    columns: 15,
    author: 'Financial Data Analytics',
    lastUpdated: '2024-09-01',
    license: 'MIT',
    sampleData: [
      { Date: '2023-01-03', Open: 150.25, High: 152.88, Low: 149.12, Close: 151.75, Volume: 28450000, RSI: 55.2, MACD: 0.85 },
      { Date: '2023-01-04', Open: 151.80, High: 153.42, Low: 150.88, Close: 152.90, Volume: 31200000, RSI: 58.1, MACD: 1.12 }
    ]
  }
};

export default function DatasetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'analysis'>('overview');

  useEffect(() => {
    // In a real app, you'd fetch from API
    // For now, use sample data
    const foundDataset = sampleDatasets[id];
    if (foundDataset) {
      setDataset(foundDataset);
    } else {
      // Create a generic dataset if not found
      setDataset({
        id: id,
        title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Dataset for ${id.replace(/-/g, ' ')} analysis and machine learning tasks.`,
        domain: 'general',
        difficulty: 'intermediate',
        taskType: 'classification',
        tags: [id.replace(/-/g, ' ')],
        size: '10KB',
        downloads: '5k+',
        rating: 4.0,
        rows: 1000,
        columns: 5,
        author: 'Data Science Team',
        lastUpdated: '2024-09-01',
        license: 'MIT',
        sampleData: []
      });
    }
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/datasets/${id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!dataset) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Loading dataset...</p>
          </div>
        </div>
        <AutoMLFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-16">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/datasets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Datasets
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize">
                  {dataset.domain}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  dataset.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  dataset.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {dataset.difficulty}
                </span>
                <span className="text-sm text-muted-foreground capitalize">
                  {dataset.taskType}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{dataset.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{dataset.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-foreground font-medium">{dataset.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{dataset.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-4 h-4" />
                  <span>{dataset.rows.toLocaleString()} rows</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{dataset.columns} columns</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3 lg:w-auto">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? 'Downloading...' : 'Download Dataset'}
              </button>
              
              <Link
                href={`/magic-path?dataset=${dataset.id}`}
                className="flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
              >
                <TrendingUp className="w-5 h-5" />
                Start Analysis
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'data', label: 'Data Preview', icon: Eye },
              { id: 'analysis', label: 'Quick Stats', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'overview' | 'data' | 'analysis')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Dataset Information</h3>
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                      <dd className="text-foreground">{dataset.author || 'Unknown'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                      <dd className="text-foreground">{dataset.lastUpdated || 'Unknown'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">File Size</dt>
                      <dd className="text-foreground">{dataset.size}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">License</dt>
                      <dd className="text-foreground">{dataset.license || 'Not specified'}</dd>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-secondary/50 px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rows:</span>
                    <span className="font-medium">{dataset.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Columns:</span>
                    <span className="font-medium">{dataset.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Task Type:</span>
                    <span className="font-medium capitalize">{dataset.taskType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium capitalize">{dataset.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Data Preview</h3>
            {dataset.sampleData && dataset.sampleData.length > 0 ? (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {Object.keys(dataset.sampleData[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-sm font-medium text-foreground">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dataset.sampleData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          {Object.values(row).map((value: unknown, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 text-sm text-muted-foreground">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-muted/30 text-sm text-muted-foreground">
                  Showing first 10 rows of {dataset.rows.toLocaleString()} total rows
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No preview data available. Download the dataset to view the full data.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Statistics</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Dataset Size</h4>
                </div>
                <p className="text-2xl font-bold">{dataset.rows.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">rows × {dataset.columns} columns</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold">Community Rating</h4>
                </div>
                <p className="text-2xl font-bold">{dataset.rating}</p>
                <p className="text-sm text-muted-foreground">out of 5.0</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold">Downloads</h4>
                </div>
                <p className="text-2xl font-bold">{dataset.downloads}</p>
                <p className="text-sm text-muted-foreground">total downloads</p>
              </div>
            </div>

            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Recommended Use Cases</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Perfect for {dataset.difficulty} level machine learning projects</li>
                <li>• Ideal for practicing {dataset.taskType} algorithms</li>
                <li>• Great for exploring {dataset.domain} domain problems</li>
                {dataset.taskType === 'regression' && <li>• Practice prediction and forecasting techniques</li>}
                {dataset.taskType === 'classification' && <li>• Learn pattern recognition and categorization</li>}
                {dataset.difficulty === 'beginner' && <li>• Excellent starting point for ML beginners</li>}
              </ul>
            </div>

            {/* Magic Path Section */}
            <div className="mt-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Magic Path Analysis</h4>
                  <p className="text-sm text-muted-foreground">AI-powered automated machine learning workflow</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Automated EDA</p>
                    <p className="text-xs text-muted-foreground">Exploratory Data Analysis</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Feature Engineering</p>
                    <p className="text-xs text-muted-foreground">Smart preprocessing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Model Training</p>
                    <p className="text-xs text-muted-foreground">Multiple algorithms</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Results & Insights</p>
                    <p className="text-xs text-muted-foreground">Performance metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={`/magic-path?dataset=${dataset.id}&title=${encodeURIComponent(dataset.title)}&taskType=${dataset.taskType}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <TrendingUp className="w-5 h-5" />
                  Start Magic Path Analysis
                </Link>
                
                <button 
                  className="px-4 py-3 border border-border bg-background hover:bg-accent rounded-lg transition-colors"
                  title="Learn more about Magic Path"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">💡 Tip:</span> Magic Path will automatically analyze your dataset, 
                  engineer features, train multiple models, and provide insights—perfect for {dataset.difficulty} level projects!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <AutoMLFooter />
    </div>
  );
}