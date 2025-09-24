'use client';
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, 
  FolderOpen, Database, BarChart3, Brain, Code, Zap, 
  TrendingUp, Target, Clock, CheckCircle, AlertCircle, 
  Play, Download, Eye, Trash2, Plus, Search, Filter,
  FileText, Users, Activity, Award, MoreHorizontal, Star,
  Shield, Settings, Bell, Lock, Key, Globe2, Github,
  Briefcase, Heart, Coffee, Sparkles, Layers
} from 'lucide-react';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    bio: 'ML Engineer working on predictive models and automation. I love turning messy data into useful insights. Currently focused on building tools that make machine learning more accessible.',
    joinDate: 'Sep 2023',
    website: 'sarahjml.dev',
    company: 'DataFlow Inc',
    role: 'ML Engineer',
    specialization: 'Predictive Analytics',
    github: 'sarahj-ml'
  });
  
  const [editData, setEditData] = useState(profileData);

  // More realistic project data with human touches
  const [projects] = useState([
    {
      id: 1,
      name: 'Customer Retention Model',
      type: 'Classification',
      status: 'completed',
      accuracy: 89.3,
      dataset: 'customer_data_q4.csv',
      createdAt: '2024-12-15',
      lastTrained: '2025-01-18',
      model: 'Random Forest',
      features: 12,
      samples: 15847,
      description: 'Helps identify customers likely to cancel subscription',
      favorite: true,
      notes: 'Works well but needs more recent data'
    },
    {
      id: 2,
      name: 'Sales Forecast v2',
      type: 'Regression',
      status: 'training',
      accuracy: 0,
      dataset: 'sales_jan2025.csv',
      createdAt: '2025-01-20',
      lastTrained: null,
      model: 'Linear Regression',
      features: 8,
      samples: 3421,
      description: 'Monthly sales prediction for Q1 planning',
      favorite: false,
      notes: 'Still training, ETA 2 hours'
    },
    {
      id: 3,
      name: 'Product Categorizer',
      type: 'Classification',
      status: 'deployed',
      accuracy: 91.7,
      dataset: 'product_catalog_v3.csv',
      createdAt: '2024-11-22',
      lastTrained: '2024-12-08',
      model: 'Gradient Boosting',
      features: 25,
      samples: 8932,
      description: 'Auto-categorizes new products from descriptions',
      favorite: true,
      notes: 'Running in production, works great!'
    },
    {
      id: 4,
      name: 'Price Optimization Test',
      type: 'Regression',
      status: 'failed',
      accuracy: 67.2,
      dataset: 'pricing_experiment.csv',
      createdAt: '2025-01-05',
      lastTrained: '2025-01-12',
      model: 'Decision Tree',
      features: 18,
      samples: 2156,
      description: 'Optimize pricing based on demand patterns',
      favorite: false,
      notes: 'Need more data, accuracy too low'
    },
    {
      id: 5,
      name: 'Email Campaign Scorer',
      type: 'Classification',
      status: 'completed',
      accuracy: 82.1,
      dataset: 'email_responses.csv',
      createdAt: '2024-10-30',
      lastTrained: '2024-11-15',
      model: 'Logistic Regression',
      features: 9,
      samples: 12043,
      description: 'Predicts email open rates and click-through',
      favorite: false,
      notes: 'Good baseline model'
    }
  ]);

  // More realistic dataset data
  const [datasets] = useState([
    {
      id: 1,
      name: 'customer_data_q4.csv',
      size: '1.2 MB',
      rows: 15847,
      columns: 12,
      uploadDate: '2024-12-14',
      type: 'Customer Data',
      status: 'ready',
      usedIn: 1,
      description: 'Customer behavior and subscription data',
      quality: 'good',
      lastUsed: '2025-01-18'
    },
    {
      id: 2,
      name: 'sales_jan2025.csv',
      size: '890 KB',
      rows: 3421,
      columns: 8,
      uploadDate: '2025-01-19',
      type: 'Sales Data',
      status: 'processing',
      usedIn: 1,
      description: 'Recent sales transactions and metrics',
      quality: 'checking',
      lastUsed: '2025-01-20'
    },
    {
      id: 3,
      name: 'product_catalog_v3.csv',
      size: '2.8 MB',
      rows: 8932,
      columns: 25,
      uploadDate: '2024-11-20',
      type: 'Product Data',
      status: 'ready',
      usedIn: 1,
      description: 'Product info with categories and descriptions',
      quality: 'excellent',
      lastUsed: '2024-12-08'
    },
    {
      id: 4,
      name: 'pricing_experiment.csv',
      size: '445 KB',
      rows: 2156,
      columns: 18,
      uploadDate: '2025-01-04',
      type: 'Pricing Data',
      status: 'ready',
      usedIn: 1,
      description: 'A/B test results for different price points',
      quality: 'fair',
      lastUsed: '2025-01-12'
    },
    {
      id: 5,
      name: 'email_responses.csv',
      size: '3.1 MB',
      rows: 12043,
      columns: 9,
      uploadDate: '2024-10-28',
      type: 'Email Data',
      status: 'ready',
      usedIn: 1,
      description: 'Email campaign performance data',
      quality: 'good',
      lastUsed: '2024-11-15'
    },
    {
      id: 6,
      name: 'user_feedback_raw.json',
      size: '756 KB',
      rows: 4521,
      columns: 6,
      uploadDate: '2025-01-22',
      type: 'Feedback Data',
      status: 'uploaded',
      usedIn: 0,
      description: 'Raw user feedback from support tickets',
      quality: 'needs cleaning',
      lastUsed: null
    }
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed': case 'deployed': case 'ready': 
        return { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle };
      case 'training': case 'processing': 
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock };
      case 'failed': 
        return { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };
      case 'uploaded': 
        return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock };
      default: 
        return { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Clock };
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'needs cleaning': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'checking': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dataset.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'My Projects', icon: FolderOpen },
    { id: 'datasets', label: 'Datasets', icon: Database }
  ];

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            {projects.length} projects • {projects.filter(p => p.status === 'deployed').length} deployed • {Math.round(projects.filter(p => p.accuracy > 0).reduce((acc, p) => acc + p.accuracy, 0) / projects.filter(p => p.accuracy > 0).length)}% avg accuracy
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-main text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 btn-theme shadow-professional">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by name, description, or model type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-professional glass-effect"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-professional glass-effect min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="training">Training</option>
          <option value="deployed">Deployed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Enhanced Projects List */}
      <div className="grid gap-6">
        {filteredProjects.map((project, index) => {
          const statusInfo = getStatusInfo(project.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div 
              key={project.id} 
              className="bg-card glass-effect border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-main rounded-xl flex items-center justify-center shadow-professional group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-gradient transition-all duration-300">{project.name}</h3>
                        {project.favorite && (
                          <div className="p-1 bg-gradient-warning rounded-lg">
                            <Star className="w-4 h-4 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300 ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">{project.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Model</span>
                      </div>
                      <span className="font-semibold text-foreground">{project.model}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                      </div>
                      <span className={`font-semibold ${project.accuracy > 85 ? 'text-green-600' : project.accuracy > 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {project.status === 'training' ? 'Training...' : `${project.accuracy}%`}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Samples</span>
                      </div>
                      <span className="font-semibold text-foreground">{project.samples.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Features</span>
                      </div>
                      <span className="font-semibold text-foreground">{project.features}</span>
                    </div>
                  </div>
                  
                  {project.notes && (
                    <div className="mt-4 p-3 bg-accent/50 rounded-xl border-l-4 border-primary">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Note</p>
                          <p className="text-sm text-muted-foreground">{project.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-6">
                  <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-300 group-hover:scale-110">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-300 group-hover:scale-110">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  {project.lastTrained && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last trained {new Date(project.lastTrained).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Play className="w-4 h-4" />
                  <span className="font-medium">View Details</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-main rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );

  const renderDatasetsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Datasets</h1>
          <p className="text-muted-foreground mt-2">
            {datasets.length} datasets • {(datasets.reduce((acc, d) => acc + parseFloat(d.size), 0)).toFixed(1)} MB total • {datasets.filter(d => d.status === 'ready').length} ready to use
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 btn-theme shadow-professional">
          <Plus className="w-5 h-5" />
          Upload Dataset
        </button>
      </div>

      {/* Enhanced Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search datasets by name, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-professional glass-effect"
        />
      </div>

      {/* Enhanced Datasets List */}
      <div className="grid gap-6">
        {filteredDatasets.map((dataset, index) => {
          const statusInfo = getStatusInfo(dataset.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div 
              key={dataset.id} 
              className="bg-card glass-effect border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center shadow-professional group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-gradient transition-all duration-300">{dataset.name}</h3>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300 ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
                        </span>
                        {dataset.quality && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityBadge(dataset.quality)}`}>
                            {dataset.quality}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{dataset.type}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{dataset.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Size</span>
                      </div>
                      <span className="font-semibold text-foreground">{dataset.size}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Rows</span>
                      </div>
                      <span className="font-semibold text-foreground">{dataset.rows.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Columns</span>
                      </div>
                      <span className="font-semibold text-foreground">{dataset.columns}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Used In</span>
                      </div>
                      <span className="font-semibold text-primary">{dataset.usedIn} project{dataset.usedIn !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Uploaded</span>
                      </div>
                      <span className="font-semibold text-foreground">{new Date(dataset.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-6">
                  <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-300 group-hover:scale-110">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-300 group-hover:scale-110">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-300 group-hover:scale-110">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Uploaded {new Date(dataset.uploadDate).toLocaleDateString()}
                  </div>
                  {dataset.lastUsed && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last used {new Date(dataset.lastUsed).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Analyze Data</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredDatasets.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No datasets found</h3>
          <p className="text-muted-foreground">Upload your first dataset or adjust your search criteria</p>
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden">
        <div className="bg-gradient-card glass-effect rounded-2xl p-8 border border-border shadow-professional">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-primary rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border border-primary rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-primary rotate-45"></div>
          </div>
          
          {/* Profile Header */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-main rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-professional">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl"></div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-card hover:bg-accent rounded-full flex items-center justify-center border-2 border-background shadow-lg group-hover:scale-110 transition-all duration-300">
                <Camera className="w-4 h-4 text-foreground" />
              </button>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gradient">{profileData.name}</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{profileData.role}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">{profileData.specialization} at {profileData.company}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {profileData.joinDate}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 btn-theme shadow-professional"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 btn-theme"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-xl border border-border hover:shadow-professional transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-main rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center p-4 bg-card rounded-xl border border-border hover:shadow-professional transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{datasets.length}</div>
              <div className="text-sm text-muted-foreground">Datasets</div>
            </div>
            <div className="text-center p-4 bg-card rounded-xl border border-border hover:shadow-professional transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'deployed').length}</div>
              <div className="text-sm text-muted-foreground">Deployed</div>
            </div>
            <div className="text-center p-4 bg-card rounded-xl border border-border hover:shadow-professional transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-warning rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(projects.filter(p => p.accuracy > 0).reduce((acc, p) => acc + p.accuracy, 0) / projects.filter(p => p.accuracy > 0).length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Personal & Work Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information Card */}
          <div className="bg-card glass-effect rounded-2xl p-6 border border-border shadow-professional animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-main rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.email}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.phone}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.location}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <FileText className="w-4 h-4" />
                  Professional Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl text-foreground leading-relaxed">{profileData.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-card glass-effect rounded-2xl p-6 border border-border shadow-professional animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Professional Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Briefcase className="w-4 h-4" />
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.company}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <User className="w-4 h-4" />
                  Role/Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.role}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Brain className="w-4 h-4" />
                  Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.specialization}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <div className="px-4 py-3 bg-muted rounded-xl text-foreground font-medium">{profileData.joinDate}</div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Links & Activities */}
        <div className="space-y-6">
          
          {/* Links & Social Card */}
          <div className="bg-card glass-effect rounded-2xl p-6 border border-border shadow-professional animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Links & Social</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Globe2 className="w-4 h-4" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl">
                    <a href={`https://${profileData.website}`} className="text-primary hover:text-accent-foreground font-medium transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                      {profileData.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-muted rounded-xl">
                    <a href={`https://github.com/${profileData.github}`} className="text-primary hover:text-accent-foreground font-medium transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                      @{profileData.github}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-card glass-effect rounded-2xl p-6 border border-border shadow-professional animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-warning rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Completed Customer Retention Model</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Uploaded new dataset</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Deployed Product Categorizer</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-card glass-effect rounded-2xl p-6 border border-border shadow-professional animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-main rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300 group">
                <div className="w-8 h-8 bg-gradient-main rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">First Deploy</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300 group">
                <div className="w-8 h-8 bg-gradient-accent rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">High Accuracy</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300 group">
                <div className="w-8 h-8 bg-gradient-success rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">Early Bird</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-300 group">
                <div className="w-8 h-8 bg-gradient-warning rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">Data Master</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return renderProjectsTab();
      case 'datasets':
        return renderDatasetsTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderProjectsTab();
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Enhanced Tab Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Profile Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile, projects, and datasets</p>
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-card glass-effect rounded-2xl border border-border shadow-professional mt-4 sm:mt-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 group ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-main rounded-xl opacity-90"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${activeTab === tab.id ? 'text-white' : ''} group-hover:scale-110`} />
                    <span className={`relative z-10 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content with Animation */}
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}