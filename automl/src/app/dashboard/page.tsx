'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Settings, User, Bot, Trash2, MessageSquare, Database, Brain, BarChart3, ArrowLeft, Menu, X } from 'lucide-react';
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
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
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

I'm powered by Gemini AI to help you with machine learning concepts and workflows. I can assist you with:

## 🔥 **What I Can Do:**
• **ML Guidance**: Help you understand machine learning concepts and algorithms
• **Algorithm Selection**: Recommend the best ML approaches for your problems
• **Data Analysis**: Guide you through data preprocessing and feature engineering
• **Model Evaluation**: Explain metrics and validation techniques
• **Best Practices**: Share ML workflows and optimization strategies

## 💡 **Ask Me About:**
• "What's the best algorithm for classification?"
• "How do I handle missing data in my dataset?"
• "Explain cross-validation and why it's important"
• "Help me choose between Random Forest and SVM"
• "What preprocessing steps should I apply?"

## 🚀 **Pro Tips:**
• I can explain complex ML concepts in simple terms
• Ask for specific guidance on your ML project
• Request algorithm comparisons and recommendations
• Get help with data preprocessing strategies

**Ready to explore machine learning?** Ask me anything about ML concepts, algorithms, or your specific project needs!`,
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

  const testAPI = async () => {
    try {
      const response = await fetch('/api/test');
      const result = await response.json();
      
      if (result.status === 'success') {
        setApiStatus('working');
        console.log('✅ API test successful:', result.testResponse);
      } else {
        setApiStatus('error');
        console.error('❌ API test failed:', result.message);
      }
    } catch (error) {
      setApiStatus('error');
      console.error('❌ API test error:', error);
    }
  };

  useEffect(() => {
    // Test API on component mount
    testAPI();
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
          message: currentInput,
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

    } catch (error) {
      console.error('Error handling message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `I apologize, but I'm having trouble connecting to the AI service right now. Please check your API configuration and try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="w-px h-6 bg-border"></div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Brain size={24} className="text-foreground" />
            AutoML Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Settings size={20} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0 md:w-80'} bg-muted/20 border-r border-border flex flex-col transition-all duration-300 overflow-hidden`}>
          {/* Sidebar Header */}
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
            <Link href="/datasets" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Database size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Datasets</span>
            </Link>
            <Link href="/mlmodels" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Brain size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Models</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <BarChart3 size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Analytics</span>
            </Link>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full text-left">
              <Settings size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Settings</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {currentSession?.title || 'AutoML Assistant'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your AI-powered machine learning companion
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  apiStatus === 'working' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : apiStatus === 'error' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    apiStatus === 'working' 
                      ? 'bg-green-500' 
                      : apiStatus === 'error' 
                      ? 'bg-red-500' 
                      : 'bg-gray-400'
                  }`}></div>
                  {apiStatus === 'working' ? 'Gemini AI Connected' : apiStatus === 'error' ? 'API Error' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {currentSession?.messages.map((message) => (
              <div key={message.id} className="flex gap-4 animate-fadeIn">
                <div className="flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                    message.type === 'user' 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted text-foreground border border-border'
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
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className={`text-foreground whitespace-pre-wrap leading-relaxed ${
                      message.type === 'assistant' 
                        ? 'bg-muted/30 rounded-xl p-4 border border-border/50' 
                        : 'pl-2'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 animate-fadeIn">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center border border-border shadow-sm">
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

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      // Auto-resize textarea
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about machine learning..."
                    className="w-full bg-background border-2 border-border rounded-2xl px-4 py-3 pr-12 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-0 focus:border-foreground/60 transition-all duration-200 shadow-sm hover:shadow-md"
                    rows={1}
                    style={{
                      minHeight: '52px',
                      maxHeight: '120px'
                    }}
                  />
                  {inputValue.trim() && (
                    <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {inputValue.trim().length} chars
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-shrink-0 p-3 rounded-2xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift + Enter for new line</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted rounded text-xs">
                    ⚡ Powered by Gemini AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;