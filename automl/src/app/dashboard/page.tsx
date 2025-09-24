'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Settings, User, Bot, Trash2, MessageSquare, Database, Brain, BarChart3, Download, CheckCircle, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: MessageComponent[];
}

interface MessageComponent {
  type: 'dataset-card' | 'model-training' | 'results-chart' | 'code-block';
  data: {
    name?: string;
    rows?: number;
    columns?: number;
    size?: string;
    progress?: number;
    stage?: string;
    metrics?: {
      accuracy?: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
    };
    code?: string;
    accuracy?: number;
    trainingSamples?: number;
    features?: number;
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

// Component Renderers
const DatasetCard = ({ data }: { data: MessageComponent['data'] }) => (
  <div className="bg-muted/20 border border-border rounded-lg p-4 my-4 max-w-md">
    <div className="flex items-center gap-3 mb-3">
      <Database size={20} className="text-foreground" />
      <h3 className="font-semibold text-foreground">{data.name}</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Rows:</span>
        <span className="ml-2 text-foreground font-medium">{data.rows?.toLocaleString()}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Columns:</span>
        <span className="ml-2 text-foreground font-medium">{data.columns}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Size:</span>
        <span className="ml-2 text-foreground font-medium">{data.size}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Source:</span>
        <span className="ml-2 text-foreground font-medium">Kaggle</span>
      </div>
    </div>
  </div>
);

const ModelTrainingProgress = ({ data }: { data: MessageComponent['data'] }) => {
  const getStageIcon = (stage?: string) => {
    switch (stage) {
      case 'fetching': return <Download className="animate-spin" size={16} />;
      case 'preprocessing': return <Settings className="animate-spin" size={16} />;
      case 'training': return <Brain className="animate-pulse" size={16} />;
      case 'evaluating': return <BarChart3 className="animate-bounce" size={16} />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="bg-muted/20 border border-border rounded-lg p-4 my-4">
      <div className="flex items-center gap-3 mb-4">
        {getStageIcon(data.stage)}
        <h3 className="font-semibold text-foreground capitalize">{data.stage} Model...</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{data.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-foreground h-2 rounded-full transition-all duration-500 ease-out" 
            style={{width: `${data.progress}%`}}
          ></div>
        </div>
      </div>

      {data.metrics && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-background rounded p-2">
            <span className="text-muted-foreground block">Accuracy</span>
            <span className="text-foreground font-bold text-lg">{data.metrics.accuracy}%</span>
          </div>
          <div className="bg-background rounded p-2">
            <span className="text-muted-foreground block">F1 Score</span>
            <span className="text-foreground font-bold text-lg">{data.metrics.f1Score}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultsChart = ({ data }: { data: MessageComponent['data'] }) => (
  <div className="bg-muted/20 border border-border rounded-lg p-4 my-4">
    <div className="flex items-center gap-3 mb-4">
      <BarChart3 size={20} className="text-foreground" />
      <h3 className="font-semibold text-foreground">Model Performance</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-background rounded-lg p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Classification Metrics</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Accuracy:</span>
            <span className="text-sm font-semibold text-foreground">82.1%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Precision:</span>
            <span className="text-sm font-semibold text-foreground">79.3%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Recall:</span>
            <span className="text-sm font-semibold text-foreground">76.8%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">F1 Score:</span>
            <span className="text-sm font-semibold text-foreground">0.781</span>
          </div>
        </div>
      </div>
      
      <div className="bg-background rounded-lg p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Feature Importance</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Sex</span>
            <div className="flex-1 bg-muted rounded h-2">
              <div className="bg-foreground rounded h-2" style={{width: '85%'}}></div>
            </div>
            <span className="text-xs text-foreground">0.85</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Age</span>
            <div className="flex-1 bg-muted rounded h-2">
              <div className="bg-foreground rounded h-2" style={{width: '72%'}}></div>
            </div>
            <span className="text-xs text-foreground">0.72</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Fare</span>
            <div className="flex-1 bg-muted rounded h-2">
              <div className="bg-foreground rounded h-2" style={{width: '64%'}}></div>
            </div>
            <span className="text-xs text-foreground">0.64</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-background rounded-lg p-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Model Summary</h4>
      <p className="text-sm text-foreground">
        Random Forest Classifier trained on {data.trainingSamples || '712'} samples with {data.features || '8'} features. 
        The model shows strong performance with {data.accuracy || '82.1'}% accuracy on the test set.
      </p>
    </div>
  </div>
);

function DashboardPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome to AutoML',
      lastUpdated: new Date(),
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: `Welcome to your AutoML Assistant! 🤖

I can help you build machine learning models automatically. Just tell me what you want to do!

**Example commands:**
• "Create a ML model based on Titanic survival data"
• "Build a customer churn prediction model"
• "Train a model to predict house prices"
• "Analyze iris flower classification"

I'll automatically:
✅ Fetch datasets from Kaggle
✅ Preprocess the data
✅ Train multiple models
✅ Show performance metrics
✅ Generate deployment code

What would you like to build today?`,
          timestamp: new Date(Date.now() - 300000)
        }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  // AutoML Detection Logic
  const detectMLTask = (input: string): { 
    isMLTask: boolean; 
    dataset?: string; 
    task?: string; 
    target?: string; 
  } => {
    const lowerInput = input.toLowerCase();
    
    // Dataset detection patterns
    const datasetPatterns = [
      { pattern: /titanic/i, dataset: 'titanic', task: 'classification', target: 'survival' },
      { pattern: /iris/i, dataset: 'iris', task: 'classification', target: 'species' },
      { pattern: /house.{0,10}price/i, dataset: 'house-prices', task: 'regression', target: 'price' },
      { pattern: /customer.{0,10}churn/i, dataset: 'customer-churn', task: 'classification', target: 'churn' },
      { pattern: /sales.{0,10}forecast/i, dataset: 'sales-forecasting', task: 'time-series', target: 'sales' }
    ];

    // Check for ML model keywords
    const mlKeywords = ['model', 'predict', 'train', 'classification', 'regression', 'machine learning', 'ml'];
    const hasMLKeywords = mlKeywords.some(keyword => lowerInput.includes(keyword));

    if (!hasMLKeywords) return { isMLTask: false };

    // Find matching dataset
    for (const { pattern, dataset, task, target } of datasetPatterns) {
      if (pattern.test(lowerInput)) {
        return { isMLTask: true, dataset, task, target };
      }
    }

    return { isMLTask: true, dataset: 'custom', task: 'classification', target: 'target' };
  };

  // Simulate AutoML Pipeline
  const runAutoMLPipeline = async (
    sessionId: string, 
    dataset: string, 
    task: string
  ) => {
    const stages = [
      { stage: 'fetching', duration: 2000, message: `Fetching ${dataset} dataset from Kaggle...` },
      { stage: 'preprocessing', duration: 3000, message: 'Preprocessing data, handling missing values...' },
      { stage: 'training', duration: 4000, message: 'Training multiple models (Random Forest, XGBoost, Neural Network)...' },
      { stage: 'evaluating', duration: 2000, message: 'Evaluating model performance...' },
      { stage: 'completed', duration: 1000, message: 'Model training completed!' }
    ];

    const datasetInfo = {
      titanic: { name: 'Titanic Survival Dataset', rows: 891, columns: 12, size: '59.8 KB' },
      iris: { name: 'Iris Flower Dataset', rows: 150, columns: 5, size: '4.8 KB' },
      'house-prices': { name: 'House Prices Dataset', rows: 1460, columns: 81, size: '451.2 KB' },
      'customer-churn': { name: 'Customer Churn Dataset', rows: 7043, columns: 21, size: '977 KB' }
    }[dataset] || { name: 'Custom Dataset', rows: 1000, columns: 10, size: '128 KB' };

    // Add dataset card
    const datasetMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Great! I found the ${datasetInfo.name} on Kaggle. Here are the details:`,
      timestamp: new Date(),
      components: [
        {
          type: 'dataset-card',
          data: datasetInfo
        }
      ]
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, datasetMessage],
          lastUpdated: new Date()
        };
      }
      return session;
    }));

    // Run through training stages
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const progress = Math.round(((i + 1) / stages.length) * 100);

      await new Promise(resolve => setTimeout(resolve, stage.duration));

      const progressMessage: Message = {
        id: (Date.now() + i).toString(),
        type: 'assistant',
        content: stage.message,
        timestamp: new Date(),
        components: [
          {
            type: 'model-training',
            data: {
              stage: stage.stage,
              progress,
              ...(stage.stage === 'completed' ? {
                metrics: {
                  accuracy: task === 'classification' ? 82.1 : undefined,
                  f1Score: task === 'classification' ? 0.781 : undefined
                }
              } : {})
            }
          }
        ]
      };

      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, progressMessage],
            lastUpdated: new Date()
          };
        }
        return session;
      }));
    }

    // Add final results
    const resultsMessage: Message = {
      id: (Date.now() + 100).toString(),
      type: 'assistant',
      content: `🎉 Model training completed successfully! Here are your results:`,
      timestamp: new Date(),
      components: [
        {
          type: 'results-chart',
          data: {
            accuracy: 82.1,
            trainingSamples: datasetInfo.rows * 0.8,
            features: datasetInfo.columns - 1
          }
        }
      ]
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, resultsMessage],
          lastUpdated: new Date()
        };
      }
      return session;
    }));

    // Add deployment code
    const codeMessage: Message = {
      id: (Date.now() + 200).toString(),
      type: 'assistant',
      content: `Your model is ready for deployment! Here's the generated API code:

\`\`\`python
# Generated AutoML Model API
import joblib
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)
model = joblib.load('${dataset}_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0].max()
    
    return jsonify({
        'prediction': int(prediction),
        'confidence': float(probability),
        'model_accuracy': 0.821
    })

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

**Next Steps:**
1. 📊 Download the trained model
2. 🚀 Deploy to production
3. 📈 Monitor model performance
4. 🔄 Set up automated retraining

Would you like to train another model or deploy this one?`,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, codeMessage],
          lastUpdated: new Date()
        };
      }
      return session;
    }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // Update session with user message
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = [...session.messages, userMessage];
        return {
          ...session,
          messages: updatedMessages,
          lastUpdated: new Date(),
          title: session.messages.length === 0 ? inputValue.trim().substring(0, 50) + '...' : session.title
        };
      }
      return session;
    }));

    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Detect if this is an ML task
    const mlTask = detectMLTask(currentInput);

    if (mlTask.isMLTask && mlTask.dataset) {
      // Start AutoML pipeline
      setIsLoading(false);
      await runAutoMLPipeline(currentSessionId, mlTask.dataset, mlTask.task!);
    } else {
      // Regular chat response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `I understand you want to work on: "${currentInput}"\n\nI'm your AutoML assistant! I can help you build machine learning models automatically. Try asking me something like:\n\n• "Create a ML model based on Titanic survival data"\n• "Build a customer churn prediction model"\n• "Train a model to predict house prices"\n\nI'll handle everything from data fetching to model deployment! What would you like to build?`,
          timestamp: new Date()
        };

        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, assistantMessage],
              lastUpdated: new Date()
            };
          }
          return session;
        }));

        setIsLoading(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Component renderer function
  const renderComponent = (component: MessageComponent) => {
    switch (component.type) {
      case 'dataset-card':
        return <DatasetCard key={Math.random()} data={component.data} />;
      case 'model-training':
        return <ModelTrainingProgress key={Math.random()} data={component.data} />;
      case 'results-chart':
        return <ResultsChart key={Math.random()} data={component.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-80 bg-muted/20 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <button
            onClick={createNewSession}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium"
          >
            <Plus size={18} />
            New Conversation
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground">
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Recent Conversations</span>
          </div>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto px-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`group flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id 
                  ? 'bg-foreground/10 border border-border' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {session.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.lastUpdated.toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
              >
                <Trash2 size={14} className="text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Database size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Datasets</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Brain size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Models</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <BarChart3 size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Settings size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Settings</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-foreground">
            {currentSession?.title || 'AutoML Assistant'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your AI-powered machine learning companion
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {currentSession?.messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-foreground'
                }`}>
                  {message.type === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {message.type === 'user' ? 'You' : 'AutoML Assistant'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
                
                {/* Render message components */}
                {message.components?.map((component, index) => (
                  <div key={index}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center">
                  <Bot size={16} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground">AutoML Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about AutoML, data science, or machine learning..."
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
                rows={1}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;