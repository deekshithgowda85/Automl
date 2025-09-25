'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Zap, Database, Brain, Play, BarChart3, FileText, Settings, Target } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

interface DatasetParams {
  id: string | null;
  title: string;
  taskType: string;
  targetColumn: string;
}

function MagicPathContent() {
  const searchParams = useSearchParams();
  const [dataset, setDataset] = useState<DatasetParams | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Get dataset parameters from URL
    const datasetParams = {
      id: searchParams.get('dataset'),
      title: searchParams.get('title') || 'Dataset',
      taskType: searchParams.get('taskType') || 'regression',
      targetColumn: searchParams.get('targetColumn') || 'target'
    };
    
    setDataset(datasetParams);
  }, [searchParams]);

  const steps = [
    { 
      title: 'Data Loading', 
      description: 'Loading and validating your dataset',
      icon: Database,
      color: 'blue',
      details: ['CSV file validation', 'Schema detection', 'Data type inference']
    },
    { 
      title: 'Exploratory Analysis', 
      description: 'Analyzing data patterns and distributions',
      icon: BarChart3,
      color: 'green',
      details: ['Statistical summary', 'Missing value analysis', 'Distribution plots']
    },
    { 
      title: 'Feature Engineering', 
      description: 'Preparing features for machine learning',
      icon: Settings,
      color: 'purple',
      details: ['Feature scaling', 'Encoding categorical variables', 'Feature selection']
    },
    { 
      title: 'Model Training', 
      description: 'Training multiple machine learning models',
      icon: Brain,
      color: 'orange',
      details: ['Algorithm selection', 'Cross-validation', 'Hyperparameter tuning']
    },
    { 
      title: 'Model Evaluation', 
      description: 'Evaluating model performance',
      icon: Target,
      color: 'red',
      details: ['Performance metrics', 'Model comparison', 'Feature importance']
    },
    { 
      title: 'Results & Insights', 
      description: 'Generating final insights and recommendations',
      icon: FileText,
      color: 'indigo',
      details: ['Model insights', 'Prediction analysis', 'Report generation']
    }
  ];

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    }
    
    setIsAnalyzing(false);
  };

  if (!dataset) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border rounded-xl shadow-sm p-8">
              <h1 className="text-3xl font-bold mb-4">Dataset Not Found</h1>
              <p className="text-muted-foreground mb-6">Please select a dataset to analyze.</p>
              <Link href="/datasets" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Browse Datasets
              </Link>
            </div>
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
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Magic Path Analysis</h1>
                <p className="text-muted-foreground">AI-powered automated machine learning workflow</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-primary">Dataset</h3>
              <p className="text-foreground">{dataset.title}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-primary">Task Type</h3>
              <p className="text-foreground capitalize">{dataset.taskType}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-primary">Target Column</h3>
              <p className="text-foreground">{dataset.targetColumn}</p>
            </div>
          </div>

          {!isAnalyzing && currentStep === 0 && (
            <div className="text-center">
              <button
                onClick={startAnalysis}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 text-lg font-semibold shadow-lg"
              >
                <Play className="w-6 h-6" />
                Start Automated Analysis
              </button>
            </div>
          )}
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Analysis in Progress</h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                      isActive ? 'border-primary bg-primary/5' : 
                      isCompleted ? 'border-green-500 bg-green-500/5' : 
                      'border-border bg-card'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground' : 
                      isCompleted ? 'bg-green-500 text-white' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                      {isActive && (
                        <div className="mt-2">
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {step.details.map((detail, idx) => (
                              <li key={idx}>• {detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {isActive && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground">Processing...</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {!isAnalyzing && currentStep === steps.length - 1 && (
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Analysis Complete!</h2>
              </div>
              <p className="text-muted-foreground">Your automated machine learning analysis is ready</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Best Model
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium">Random Forest {dataset.taskType === 'classification' ? 'Classifier' : 'Regressor'}</p>
                <p className="text-green-500 dark:text-green-500 text-sm">
                  {dataset.taskType === 'classification' ? 'Accuracy: 94.2%' : 'R² Score: 0.87'}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Insights
                </h3>
                <ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
                  <li>• Top features identified automatically</li>
                  <li>• {dataset.taskType === 'classification' ? 'Class imbalance handled' : 'Feature correlations detected'}</li>
                  <li>• Model performance optimized</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <FileText className="w-4 h-4" />
                Download Report
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                <Database className="w-4 h-4" />
                Export Model
              </button>
              
              <Link href="/datasets" className="flex items-center gap-2 px-6 py-3 border border-border bg-background hover:bg-accent rounded-lg transition-colors">
                Analyze Another Dataset
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MagicPathPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8"><div className="max-w-4xl mx-auto px-4 text-center"><div className="bg-white rounded-lg shadow-lg p-8">Loading...</div></div></div>}>
      <MagicPathContent />
    </Suspense>
  );
}