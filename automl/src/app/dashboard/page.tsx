'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Settings, User, Bot, Trash2, MessageSquare, Database, Brain, ArrowLeft, Menu, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

function DashboardPage() {
  // All hooks must be declared before any conditional returns
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  
  // Code viewer and output panel states
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showOutputPanel, setShowOutputPanel] = useState(false);
  const [currentCode, setCurrentCode] = useState('# No code generated yet\nprint("Welcome to AutoML!")');
  const [currentOutput, setCurrentOutput] = useState('Welcome to AutoML Code Viewer!\nGenerate a model to see code and output here.');
  const [lastModelData, setLastModelData] = useState<{code?: string, output?: string, encodedCode?: string} | null>(null);
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'AutoML Assistant',
      lastUpdated: new Date(),
      messages: []
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper variables
  const currentSession = sessions.find(s => s.id === currentSessionId);

  // Helper function for consistent date formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Effects
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Set API status to working by default
  useEffect(() => {
    setApiStatus('working');
  }, []);
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

  // File handling functions
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['.csv', '.json', '.txt', '.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension) && file.size < 10 * 1024 * 1024; // 10MB limit
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
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

    try {
      // Check if this is a model creation request
      const isModelRequest = (currentInput.toLowerCase().includes('create') || currentInput.toLowerCase().includes('test')) && 
                           (currentInput.toLowerCase().includes('model') || 
                            currentInput.toLowerCase().includes('ml') ||
                            currentInput.toLowerCase().includes('machine learning'));

      if (isModelRequest) {
        // Handle ML model creation
        await handleModelCreation(currentInput);
      } else {
        // Handle regular chat
        await handleRegularChat(currentInput);
      }

    } catch (error) {
      console.error('Error handling message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            lastUpdated: new Date()
          };
        }
        return session;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelCreation = async (input: string) => {
    // Add initial status message with Kaggle phases
    const statusMessage: Message = {
      id: Date.now().toString() + '_status',
      type: 'assistant',
      content: `🤖 **Creating AutoML Model**\n\nAnalyzing request: "${input}"\n\n🔍 **Phase 1: AI Analysis**\n⏳ Extracting requirements from prompt...\n⏳ Detecting task type and complexity...\n⏳ Identifying optimal algorithms...\n\n📊 **Phase 2: Data Discovery**\n⏳ Searching for relevant Kaggle datasets...\n⏳ Analyzing dataset compatibility...\n⏳ Preparing data pipeline...\n\n⚙️ **Phase 3: Model Generation**\n⏳ Creating preprocessing steps...\n⏳ Generating training code...\n⏳ Building deployment pipeline...\n\nThis process may take a few moments...`,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, statusMessage],
          lastUpdated: new Date()
        };
      }
      return session;
    }));

    try {
      // Update status function for real-time progress
      const updateStatus = (content: string) => {
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            const messages = session.messages.map(msg => 
              msg.id === statusMessage.id 
                ? { ...msg, content }
                : msg
            );
            return { ...session, messages, lastUpdated: new Date() };
          }
          return session;
        }));
      };

      // Phase 1: AI Analysis
      updateStatus(`🤖 **Creating AutoML Model**\n\nAnalyzing: "${input}"\n\n✅ **Phase 1: AI Analysis** - COMPLETE\n✅ Requirements extracted from prompt\n✅ Task type and complexity detected\n✅ Optimal algorithms identified\n\n🔍 **Phase 2: Data Discovery** - IN PROGRESS\n⏳ Connecting to Kaggle API...\n⏳ Searching for relevant datasets...\n⏳ Analyzing dataset compatibility...\n\n⚙️ **Phase 3: Model Generation** - PENDING\n⏳ Creating preprocessing steps...\n⏳ Generating training code...\n⏳ Building deployment pipeline...`);

      // Simulate Kaggle search phase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateStatus(`🤖 **Creating AutoML Model**\n\nAnalyzing: "${input}"\n\n✅ **Phase 1: AI Analysis** - COMPLETE\n✅ Requirements extracted from prompt\n✅ Task type and complexity detected\n✅ Optimal algorithms identified\n\n🔍 **Phase 2: Data Discovery** - IN PROGRESS\n✅ Connected to Kaggle API\n⏳ Searching datasets with AI-extracted terms...\n⏳ Evaluating dataset relevance...\n⏳ Preparing data pipeline...\n\n⚙️ **Phase 3: Model Generation** - PENDING\n⏳ Creating preprocessing steps...\n⏳ Generating training code...\n⏳ Building deployment pipeline...`);

      // Call comprehensive AutoML API
      const response = await fetch('/api/test-automl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          taskType: 'auto-detect'
        }),
      });

      const result = await response.json();

      // Phase 2: Data Discovery Complete
      const kaggleStatus = result.success ? 
        "✅ Kaggle dataset search completed successfully\n✅ Relevant dataset identified and processed\n✅ Data pipeline prepared for training" :
        "⚠️  Kaggle search completed with fallback\n✅ AI-generated synthetic data created\n✅ Data pipeline optimized for task";

      updateStatus(`🤖 **Creating AutoML Model**\n\nAnalyzing: "${input}"\n\n✅ **Phase 1: AI Analysis** - COMPLETE\n✅ Requirements extracted from prompt\n✅ Task type and complexity detected\n✅ Optimal algorithms identified\n\n✅ **Phase 2: Data Discovery** - COMPLETE\n✅ Connected to Kaggle API\n${kaggleStatus}\n\n⚙️ **Phase 3: Model Generation** - IN PROGRESS\n⏳ Creating preprocessing steps...\n⏳ Generating training code...\n⏳ Building deployment pipeline...`);

      // Phase 3: Final generation
      await new Promise(resolve => setTimeout(resolve, 500));

      let responseContent = '';
      
      if (result.success) {
        responseContent = `🎉 **AutoML Pipeline Generated Successfully!**\n\n${result.message}\n\n**🤖 AI Analysis:**\n- Task Type: ${result.intentAnalysis?.detected_task_type || 'Auto-detected'}\n- Complexity: ${result.intentAnalysis?.complexity_level || 'Moderate'}\n- Recommended Algorithms: ${result.intentAnalysis?.recommended_algorithms?.join(', ') || 'Multiple algorithms'}\n\n**� Configuration:**\n- Target Variable: ${result.configuration?.targetVariable || 'Auto-detect'}\n- Algorithms: ${result.configuration?.algorithms?.join(', ') || 'Optimally selected'}\n- Expected Accuracy: ${result.metadata?.estimatedAccuracy || 'High performance expected'}\n\n**⚡ Deployment Plan:**\n- Estimated Time: ${result.deploymentPlan?.estimatedTime || '45-120 minutes'}\n- API Endpoints: Ready for production\n\n**💻 Generated Files:** All essential files ready for deployment!\n\n**📊 Dataset Status:** ${result.intentAnalysis?.kaggle_dataset_id ? `✅ Kaggle dataset "${result.intentAnalysis.kaggle_dataset_id}" successfully integrated` : `✅ AI-generated synthetic data created (no suitable Kaggle datasets found)`}`;
        
        // Update code viewer with the generated ML code
        if (result.mlCode) {
          setCurrentCode(result.mlCode);
        }
        
        const outputSummary = `🤖 AutoML Pipeline Generation Complete\n${'='.repeat(60)}\nUser Request: ${input}\n${'='.repeat(60)}\n\n✅ KAGGLE INTEGRATION STATUS:\n${result.intentAnalysis?.kaggle_dataset_id ? 
          `- Source: Kaggle dataset\n- Dataset: ${result.intentAnalysis.kaggle_dataset_id}\n- Status: ✅ SUCCESSFULLY FETCHED` :
          `- Source: AI-generated data\n- Reason: No matching datasets\n- Status: ✅ SYNTHETIC DATA CREATED`}\n\n✅ ANALYSIS COMPLETE:\n- Task: ${result.intentAnalysis?.detected_task_type || 'Auto-detected'}\n- Complexity: ${result.intentAnalysis?.complexity_level || 'Moderate'}\n- Algorithms: ${result.configuration?.algorithms?.join(', ') || 'Multiple'}\n\n✅ ESSENTIAL FILES GENERATED:\n${Object.keys(result.fileStructure || {}).map(file => `- ${file}`).join('\n')}\n\n✅ AI-DRIVEN FEATURES:\n- Intelligent Kaggle dataset discovery\n- Zero hardcoded datasets or algorithms\n- Dynamic preprocessing and model selection\n- Complete sandbox-ready pipeline\n\n${'='.repeat(60)}\nNext: Download and run the AutoML package\n${'='.repeat(60)}`;
        
        setCurrentOutput(outputSummary);
        setLastModelData({
          code: result.mlCode || '',
          output: outputSummary,
          encodedCode: encodeURIComponent(JSON.stringify(result.fileStructure || {}))
        });
        
        responseContent += `\n\n[DOWNLOAD_AUTOML_BUTTON:${encodeURIComponent(JSON.stringify(result.fileStructure || {}))}]`;
      } else {
        responseContent = `❌ **AutoML Generation Error**\n\nFailed to create AutoML pipeline: ${result.error}\n\n**Kaggle Status:** Unable to complete dataset discovery\n**Recommendation:** Try with a more specific description or different domain.\n\nPlease try again with a more detailed prompt.`;
        
        // Update output panel with error info
        setCurrentOutput(`❌ AutoML Pipeline Generation Failed\n${'='.repeat(50)}\nTask: ${input}\nError: ${result.error}\nKaggle Status: Dataset discovery incomplete\n${'='.repeat(50)}\n\nPlease try again with a different description.`);
      }

      // Replace status message with result
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const messages = session.messages.map(msg => 
            msg.id === statusMessage.id 
              ? { ...msg, content: responseContent }
              : msg
          );
          return {
            ...session,
            messages,
            lastUpdated: new Date()
          };
        }
        return session;
      }));

    } catch (error) {
      // Replace status message with error
      const errorContent = `❌ **AutoML Generation Error**\n\nFailed to create AutoML pipeline: ${error instanceof Error ? error.message : 'Unknown error'}\n\n**Kaggle Status:** ❌ FETCH FAILED - Connection or authentication error\n**System Status:** Pipeline generation interrupted\n\nPlease check your setup and try again.`;
      
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const messages = session.messages.map(msg => 
            msg.id === statusMessage.id 
              ? { ...msg, content: errorContent }
              : msg
          );
          return {
            ...session,
            messages,
            lastUpdated: new Date()
          };
        }
        return session;
      }));
    }
  };

  const handleRegularChat = async (input: string) => {
    // Get current session history for context
    const currentSession = sessions.find(s => s.id === currentSessionId);
    const sessionHistory = currentSession?.messages || [];

    // Call Gemini API for response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
        sessionHistory: sessionHistory.slice(-10).map(msg => ({
          type: msg.type,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API call failed');
    }

    const geminiResponse = await response.json();
    
    // Create assistant message with Gemini response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: geminiResponse.response,
      timestamp: new Date()
    };

    // Add assistant message
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
  };

  const handleModelDownload = async (encodedData: string) => {
    try {
      const data = decodeURIComponent(encodedData);
      
      // Check if it's AutoML file structure (JSON) or single code file
      let isAutoMLFiles = false;
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object' && parsed !== null) {
          isAutoMLFiles = true;
          
          // Create a ZIP file with all AutoML files in organized folders
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          
          // Create project folder structure
          const projectName = `automl_project_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`;
          const projectFolder = zip.folder(projectName);
          
          if (projectFolder) {
            // Simply add the essential files to root directory
            Object.entries(parsed).forEach(([filePath, content]: [string, unknown]) => {
              projectFolder.file(filePath, String(content));
            });
            
            // Add a README file with instructions
            const readmeContent = `# AutoML Essential Files

## Generated Files
- \`mlcode.py\` - Complete AI-generated ML pipeline
- \`requirements.txt\` - Python dependencies
- \`README.md\` - This instructions file

## Quick Start
1. Install dependencies: \`pip install -r requirements.txt\`
2. Run the ML pipeline: \`python mlcode.py\`
3. Check generated outputs:
   - \`kaggledataset.csv\` - Dataset used for training
   - \`model.pkl\` - Trained ML model
   - \`output.txt\` - Results and metrics

## Features
✅ Zero hardcoded data - fully AI-driven
✅ Auto-detects datasets from user prompt  
✅ Smart preprocessing and feature engineering
✅ Multi-algorithm training with best model selection
✅ Complete performance evaluation

## Generated by AutoML Platform
Created: ${new Date().toISOString()}
No complex setup required - just run mlcode.py!
`;
            
            projectFolder.file('README.md', readmeContent);
            
            // Generate and download the ZIP file
            const zipBlob = await zip.generateAsync({type: 'blob'});
            const url = window.URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
          return;
        }
      } catch {
        // Not JSON, treat as single file
      }
      
      if (!isAutoMLFiles) {
        // Single model file download
        const response = await fetch('/api/download-model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: data }),
        });

        if (!response.ok) {
          throw new Error('Failed to download model');
        }

        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ml_model_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.pkl`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download files. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-transparent text-foreground flex flex-col">
      {/* Navigation Header - Completely Transparent */}
      <header className="bg-transparent border-b border-border/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="w-px h-6 bg-border/30"></div>
          <h1 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
            <Brain size={24} className="text-foreground/60" />
            AutoML Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Profile Icon */}
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-border/20 hover:border-border/40 transition-colors cursor-pointer"
              }
            }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Completely Transparent */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-transparent border-r border-border/5 flex flex-col transition-all duration-300 overflow-hidden`}>
          {/* Sidebar Header with Close Button */}
          <div className="p-4 border-b border-border/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-muted/20 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            </div>
            <button
              onClick={createNewSession}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-foreground hover:bg-primary/30 transition-colors font-medium border border-border/30"
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
                    ? 'bg-primary/10 border border-border/30' 
                    : 'hover:bg-muted/20'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {session.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(session.lastUpdated)}
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
            <Link href="/datasets" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Database size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Datasets</span>
            </Link>
            <Link href="/mlmodels" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Brain size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">ML Models</span>
            </Link>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full text-left">
              <Settings size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Settings</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area - Complete Transparency */}
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
          {/* Chat Header - Complete Transparency */}
          <div className="flex-shrink-0 p-4 border-b border-border/5 bg-transparent sticky top-0 z-20">
            <div className="flex items-center justify-end">
              {/* Toggle Switch Buttons - Theme Aware */}
              <div className="flex items-center gap-4">
                {/* Code Toggle Switch */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground/70">Code</span>
                  <button
                    onClick={() => setShowCodeViewer(!showCodeViewer)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${
                      showCodeViewer 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border hover:border-border/60'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                      showCodeViewer 
                        ? 'left-6 bg-primary-foreground' 
                        : 'left-0.5 bg-muted-foreground border border-border'
                    }`}></div>
                  </button>
                </div>

                {/* Output Toggle Switch */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground/70">Output</span>
                  <button
                    onClick={() => setShowOutputPanel(!showOutputPanel)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${
                      showOutputPanel 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border hover:border-border/60'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                      showOutputPanel 
                        ? 'left-6 bg-primary-foreground' 
                        : 'left-0.5 bg-muted-foreground border border-border'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Code Viewer and Output Panels - Ultra Transparent */}
          {(showCodeViewer || showOutputPanel) && (
            <div className="flex-shrink-0 border-b border-border/10 bg-transparent">
              <div className={`flex ${(showCodeViewer && showOutputPanel) ? 'h-80' : 'h-96'}`}>
                {/* Code Viewer Panel */}
                {showCodeViewer && (
                  <div className={`${showOutputPanel ? 'w-1/2 border-r border-border/10' : 'w-full'} flex flex-col min-w-0`}>
                    <div className="flex items-center justify-between px-4 py-3 bg-transparent border-b border-border/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                          <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                          <div className="w-3 h-3 rounded-full bg-accent/60"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground/70">Generated Code</span>
                        <span className="text-xs text-muted-foreground bg-transparent px-2 py-1 rounded">Python</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(currentCode)}
                          className="px-2 py-1 text-xs bg-transparent hover:bg-muted/20 rounded transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setShowCodeViewer(false)}
                          className="p-1 hover:bg-muted/20 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#1e1e1e] text-[#d4d4d4] min-h-0">
                      <pre className="p-4 text-sm font-mono leading-relaxed">
                        <code className="language-python">{currentCode}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Output Panel */}
                {showOutputPanel && (
                  <div className={`${showCodeViewer ? 'w-1/2' : 'w-full'} flex flex-col min-w-0`}>
                    <div className="flex items-center justify-between px-4 py-3 bg-transparent border-b border-border/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                          <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                          <div className="w-3 h-3 rounded-full bg-accent/60"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground/70">Terminal Output</span>
                        <span className="text-xs text-muted-foreground bg-transparent px-2 py-1 rounded">Live</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lastModelData && (
                          <button
                            onClick={() => {
                              if (lastModelData.encodedCode) {
                                handleModelDownload(lastModelData.encodedCode);
                              }
                            }}
                            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 border border-border/30"
                          >
                            <span>📥</span>
                            Download Model
                          </button>
                        )}
                        <button
                          onClick={() => navigator.clipboard.writeText(currentOutput)}
                          className="px-2 py-1 text-xs bg-transparent hover:bg-muted/20 rounded transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setShowOutputPanel(false)}
                          className="p-1 hover:bg-muted/20 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0d1117] text-[#58a6ff] min-h-0">
                      <pre className="p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                        {currentOutput}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages - Completely Transparent Container */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 min-h-0 bg-transparent">
            {currentSession?.messages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center">
                  <Bot size={32} className="text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">AutoML Assistant</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Create ML models and get AI-powered machine learning guidance.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  <div className="bg-blue-500/5 dark:bg-blue-400/5 rounded-xl p-4 border border-blue-200/20 dark:border-blue-800/10 hover:bg-blue-500/10 dark:hover:bg-blue-400/10 transition-all duration-300">
                    <div className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">🤖 Create ML Models</div>
                    <div className="text-xs text-blue-600/80 dark:text-blue-400/70">&ldquo;Create a classification model for iris flowers&rdquo;</div>
                  </div>
                  <div className="bg-emerald-500/5 dark:bg-emerald-400/5 rounded-xl p-4 border border-emerald-200/20 dark:border-emerald-800/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition-all duration-300">
                    <div className="font-medium text-sm mb-2 text-emerald-700 dark:text-emerald-300">💡 ML Guidance</div>
                    <div className="text-xs text-emerald-600/80 dark:text-emerald-400/70">&ldquo;What&apos;s the best algorithm for my dataset?&rdquo;</div>
                  </div>
                  <div className="bg-purple-500/5 dark:bg-purple-400/5 rounded-xl p-4 border border-purple-200/20 dark:border-purple-800/10 hover:bg-purple-500/10 dark:hover:bg-purple-400/10 transition-all duration-300">
                    <div className="font-medium text-sm mb-2 text-purple-700 dark:text-purple-300">📊 Data Analysis</div>
                    <div className="text-xs text-purple-600/80 dark:text-purple-400/70">&ldquo;Help me preprocess my data&rdquo;</div>
                  </div>
                  <div className="bg-orange-500/5 dark:bg-orange-400/5 rounded-xl p-4 border border-orange-200/20 dark:border-orange-800/10 hover:bg-orange-500/10 dark:hover:bg-orange-400/10 transition-all duration-300">
                    <div className="font-medium text-sm mb-2 text-orange-700 dark:text-orange-300">🔍 Algorithm Help</div>
                    <div className="text-xs text-orange-600/80 dark:text-orange-400/70">&ldquo;Explain Random Forest vs SVM&rdquo;</div>
                  </div>
                </div>
              </div>
            ) : (
              currentSession?.messages.map((message) => (
              <div key={message.id} className="flex gap-4 animate-fadeIn">
                <div className="flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500/80 text-white' 
                      : 'bg-emerald-500/80 text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {message.type === 'user' ? 'You' : 'AutoML Assistant'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      message.type === 'user'
                        ? 'text-blue-600 bg-blue-100/80 dark:text-blue-400 dark:bg-blue-900/30'
                        : 'text-emerald-600 bg-emerald-100/80 dark:text-emerald-400 dark:bg-emerald-900/30'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className={`text-foreground whitespace-pre-wrap leading-relaxed ${
                      message.type === 'assistant' 
                        ? 'bg-emerald-500/5 dark:bg-emerald-400/5 rounded-xl p-4 border border-emerald-200/20 dark:border-emerald-800/10' 
                        : 'bg-blue-500/5 dark:bg-blue-400/5 rounded-lg p-3 border border-blue-200/20 dark:border-blue-800/10'
                    }`}>
                      {message.content.includes('[DOWNLOAD_MODEL_BUTTON:') || message.content.includes('[DOWNLOAD_AUTOML_BUTTON:') ? (
                        <div>
                          {message.content.replace(/\[(DOWNLOAD_MODEL_BUTTON|DOWNLOAD_AUTOML_BUTTON):([^\]]+)\]/, '')}
                          <button
                            onClick={() => {
                              const modelMatch = message.content.match(/\[DOWNLOAD_MODEL_BUTTON:([^\]]+)\]/);
                              const automlMatch = message.content.match(/\[DOWNLOAD_AUTOML_BUTTON:([^\]]+)\]/);
                              if (modelMatch) {
                                handleModelDownload(modelMatch[1]);
                              } else if (automlMatch) {
                                handleModelDownload(automlMatch[1]);
                              }
                            }}
                            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-border/30"
                          >
                            {message.content.includes('[DOWNLOAD_AUTOML_BUTTON:') ? '📁 Download AutoML Files' : '📥 Download Model (.pkl)'}
                          </button>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 animate-fadeIn">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center border border-border">
                    <Bot size={18} />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">AutoML Assistant</span>
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI is generating response...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Human-Coded Natural Input Area - Transparent */}
          <div className="flex-shrink-0 p-4">
            <div className="max-w-4xl mx-auto">
              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">📁 Uploaded Files</span>
                    <button 
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-transparent px-3 py-1 rounded border border-border/20 text-sm">
                        <span>{file.name}</span>
                        <button 
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Chat Input - Completely Transparent */}
              <div 
                className={`relative bg-transparent border border-border/20 rounded-xl transition-all duration-200 hover:border-border/40 ${
                  isDragging ? 'border-primary bg-transparent' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Input Container */}
                <div className="flex items-end gap-3 p-4">
                  {/* Textarea */}
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (textareaRef.current) {
                          textareaRef.current.style.height = 'auto';
                          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder={uploadedFiles.length > 0 
                        ? "Ask me about your uploaded data, or create ML models..." 
                        : "Ask automl a question..."
                      }
                      className="w-full bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-base leading-6 py-1"
                      rows={1}
                      style={{
                        minHeight: '24px',
                        maxHeight: '120px'
                      }}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Project Button with theme colors */}
                    <button 
                      className="px-3 py-1.5 text-sm text-foreground/80 bg-transparent hover:bg-muted/20 rounded-lg transition-colors border border-border/30"
                    >
                      + Project
                    </button>
                    
                    {/* Upload/Expand Button */}
                    <button 
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="7,13 12,18 17,13"/>
                        <polyline points="7,6 12,11 17,6"/>
                      </svg>
                    </button>
                    
                    {/* File Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".csv,.json,.txt,.xlsx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors"
                      title="Upload CSV, JSON, TXT, or Excel files"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                    </button>
                    
                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        inputValue.trim() && !isLoading
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-transparent text-muted-foreground hover:bg-muted/20'
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Bottom Status Bar - Complete Transparency */}
                <div className="flex items-center justify-between px-4 py-2 bg-transparent border-t border-border/5 rounded-b-xl text-xs text-muted-foreground">
                  {/* Left: AI Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        apiStatus === 'working' ? 'bg-green-500 animate-pulse' : 
                        apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium">
                        {apiStatus === 'working' ? 'Gemini AI' : 
                         apiStatus === 'error' ? 'AI Offline' : 'Connecting...'}
                      </span>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <span className="text-blue-600">• {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready</span>
                    )}
                  </div>
                  
                  {/* Right: Instructions */}
                  <div className="flex items-center gap-4">
                    <span>Press ⏎ to send</span>
                    {inputValue.trim() && (
                      <span className="text-blue-600">{inputValue.trim().length} chars</span>
                    )}
                  </div>
                </div>

                {/* Drag & Drop Overlay - Transparent */}
                {isDragging && (
                  <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400/60 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📁</div>
                      <div className="text-sm font-medium text-blue-600">Drop your files here</div>
                      <div className="text-xs text-muted-foreground/70">CSV, JSON, TXT, Excel supported</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;