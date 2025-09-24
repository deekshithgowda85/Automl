'use client';
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, 
  FolderOpen, Database, BarChart3, Brain, Code, Zap, 
  TrendingUp, Target, Clock, CheckCircle, AlertCircle, 
  Play, Download, Eye, Trash2, Plus, Search, Filter,
  FileText, Users, Activity, Award, MoreHorizontal, Star
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {projects.length} projects • {projects.filter(p => p.status === 'deployed').length} deployed
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="training">Training</option>
          <option value="deployed">Deployed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const statusInfo = getStatusInfo(project.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={project.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                    {project.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Type</span>
                      <span className="font-medium">{project.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Model</span>
                      <span className="font-medium">{project.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Accuracy</span>
                      <span className={`font-medium ${project.accuracy > 85 ? 'text-green-600' : project.accuracy > 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {project.status === 'training' ? 'Training...' : `${project.accuracy}%`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Samples</span>
                      <span className="font-medium">{project.samples.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {project.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                      <strong>Note:</strong> {project.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                {project.lastTrained && (
                  <span>Last trained {new Date(project.lastTrained).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDatasetsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Datasets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {datasets.length} datasets • {(datasets.reduce((acc, d) => acc + parseFloat(d.size), 0)).toFixed(1)} MB total
          </p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Upload Data
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Datasets List */}
      <div className="space-y-4">
        {filteredDatasets.map((dataset) => {
          const statusInfo = getStatusInfo(dataset.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={dataset.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{dataset.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {dataset.status}
                    </span>
                    {dataset.quality && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityBadge(dataset.quality)}`}>
                        {dataset.quality}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{dataset.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Type</span>
                      <span className="font-medium">{dataset.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Size</span>
                      <span className="font-medium">{dataset.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Rows</span>
                      <span className="font-medium">{dataset.rows.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Columns</span>
                      <span className="font-medium">{dataset.columns}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Used In</span>
                      <span className="font-medium text-blue-600">{dataset.usedIn} project{dataset.usedIn !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Uploaded {new Date(dataset.uploadDate).toLocaleDateString()}</span>
                {dataset.lastUsed && (
                  <span>Last used {new Date(dataset.lastUsed).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Settings</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold relative">
            {profileData.name.split(' ').map(n => n[0]).join('')}
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
              <Camera className="w-3 h-3 text-gray-600" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{profileData.role} at {profileData.company}</p>
            <p className="text-gray-500 text-sm mt-1">{profileData.specialization}</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white leading-relaxed">{profileData.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Work Info */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Work Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.role}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.specialization}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Member Since</label>
            <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{profileData.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Links & Social</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
            {isEditing ? (
              <input
                type="url"
                value={editData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <a href={`https://${profileData.website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {profileData.website}
                </a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <a href={`https://github.com/${profileData.github}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  @{profileData.github}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{datasets.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Datasets</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{projects.filter(p => p.status === 'deployed').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Deployed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(projects.filter(p => p.accuracy > 0).reduce((acc, p) => acc + p.accuracy, 0) / projects.filter(p => p.accuracy > 0).length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Simple Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 w-fit">
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}