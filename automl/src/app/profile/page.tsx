'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Calendar, Database, FileText, TrendingUp, Star, Clock, Target, Brain, BarChart3, Users, Settings, Edit, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

// Utility function to format numbers consistently for hydration
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

interface Dataset {
  id: string;
  name: string;
  size: string;
  rows: number;
  columns: number;
  uploadDate: string;
  type: string;
  status: string;
  usedIn: number;
  description: string;
  quality: string;
  lastUsed?: string;
}

interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  accuracy: number;
  dataset: string;
  createdAt: string;
  lastTrained: string;
  model: string;
  features: number;
  samples: number;
  description: string;
  favorite: boolean;
  notes: string;
}

interface ProfileData {
  user: {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    avatar?: string;
    joinDate: string;
  };
  stats: {
    totalProjects: number;
    totalDatasets: number;
    deployedModels: number;
    avgAccuracy: number;
  };
  datasets: Dataset[];
  projects: Project[];
}

const ProfilePage = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const fetchProfileData = useCallback(async () => {
    try {
      console.log('Fetching profile data...');
      const response = await fetch('/api/user/profile');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfileData(data);
        setNewName(data.user.name);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        
        // Provide fallback data if API fails
        if (clerkUser) {
          const fallbackData: ProfileData = {
            user: {
              id: 'temp',
              clerkId: clerkUser.id,
              name: clerkUser.firstName && clerkUser.lastName 
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || 'AutoML User',
              email: clerkUser.emailAddresses?.[0]?.emailAddress || 'user@example.com',
              avatar: clerkUser.imageUrl,
              joinDate: 'Recently',
            },
            stats: {
              totalProjects: 0,
              totalDatasets: 0,
              deployedModels: 0,
              avgAccuracy: 0,
            },
            datasets: [],
            projects: [],
          };
          setProfileData(fallbackData);
          setNewName(fallbackData.user.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      
      // Provide fallback data on network error
      if (clerkUser) {
        const fallbackData: ProfileData = {
          user: {
            id: 'temp',
            clerkId: clerkUser.id,
            name: clerkUser.firstName && clerkUser.lastName 
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : clerkUser.firstName || 'AutoML User',
            email: clerkUser.emailAddresses?.[0]?.emailAddress || 'user@example.com',
            avatar: clerkUser.imageUrl,
            joinDate: 'Recently',
          },
          stats: {
            totalProjects: 0,
            totalDatasets: 0,
            deployedModels: 0,
            avgAccuracy: 0,
          },
          datasets: [],
          projects: [],
        };
        setProfileData(fallbackData);
        setNewName(fallbackData.user.name);
      }
    } finally {
      setLoading(false);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchProfileData();
    }
  }, [isLoaded, clerkUser, fetchProfileData]);

  const updateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        setProfileData(prev => prev ? {
          ...prev,
          user: { ...prev.user, name: newName }
        } : null);
        setEditingName(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'deployed': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'completed': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'training': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'ready': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load profile data</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'projects', label: 'Projects', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8 bg-background border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-accent/20"></div>
        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-border overflow-hidden shadow-professional">
                {clerkUser?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={clerkUser.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {profileData.user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                <span>✓</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-foreground">
              <div className="flex items-center gap-3 mb-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-1 text-foreground"
                      onKeyPress={(e) => e.key === 'Enter' && updateProfile()}
                    />
                    <button
                      onClick={updateProfile}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="bg-muted text-muted-foreground hover:bg-muted/80 p-1 rounded"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{profileData.user.name}</h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit size={16} />
                    </button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{profileData.user.email}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Joined {profileData.user.joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>ML Enthusiast</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle removed from here */}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { label: 'Projects', value: profileData.stats.totalProjects, icon: Brain, color: 'text-blue-500' },
              { label: 'Datasets', value: profileData.stats.totalDatasets, icon: Database, color: 'text-green-500' },
              { label: 'Deployed', value: profileData.stats.deployedModels, icon: TrendingUp, color: 'text-purple-500' },
              { label: 'Avg Accuracy', value: `${profileData.stats.avgAccuracy}%`, icon: Target, color: 'text-orange-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-card border border-border backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`${stat.color} w-5 h-5`} />
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-8 lg:px-16 py-8">
        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-muted/50 rounded-lg p-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {profileData.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Brain className="text-primary" size={16} />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">Updated {project.lastTrained}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Overview */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                  <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
                  <div className="space-y-3">
                    {profileData.projects.filter(p => p.accuracy > 0).slice(0, 4).map((project) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{project.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                              style={{ width: `${project.accuracy}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{project.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                  <h3 className="text-lg font-semibold mb-4">Dataset Usage</h3>
                  <div className="space-y-3">
                    {profileData.datasets.slice(0, 4).map((dataset) => (
                      <div key={dataset.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{dataset.name}</p>
                          <p className="text-xs text-muted-foreground">{dataset.size}</p>
                        </div>
                        <span className="text-sm font-medium text-primary">{dataset.usedIn} models</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'datasets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Datasets</h2>
                <div className="text-sm text-muted-foreground">
                  {profileData.datasets.length} dataset{profileData.datasets.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="grid gap-6">
                {profileData.datasets.map((dataset) => (
                  <motion.div
                    key={dataset.id}
                    className="bg-card rounded-lg border border-border p-6 shadow-professional hover:shadow-lg transition-shadow"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-primary" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{dataset.name}</h3>
                          <p className="text-sm text-muted-foreground">{dataset.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dataset.status)}`}>
                        {dataset.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="font-medium">{dataset.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rows</p>
                        <p className="font-medium">{formatNumber(dataset.rows)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Columns</p>
                        <p className="font-medium">{dataset.columns}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Used in</p>
                        <p className="font-medium">{dataset.usedIn} model{dataset.usedIn !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Uploaded {dataset.uploadDate}</span>
                      {dataset.lastUsed && <span>Last used {dataset.lastUsed}</span>}
                    </div>
                  </motion.div>
                ))}

                {profileData.datasets.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium mb-2">No datasets yet</h3>
                    <p className="text-muted-foreground">Upload your first dataset to get started with ML modeling.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your ML Projects</h2>
                <div className="text-sm text-muted-foreground">
                  {profileData.projects.length} project{profileData.projects.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="grid gap-6">
                {profileData.projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-card rounded-lg border border-border p-6 shadow-professional hover:shadow-lg transition-shadow"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Brain className="text-primary" size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            {project.favorite && <Star className="text-yellow-500" size={16} />}
                          </div>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium">{project.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Algorithm</p>
                        <p className="font-medium">{project.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{project.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dataset</p>
                        <p className="font-medium">{project.dataset}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span>Created {project.createdAt}</span>
                        {project.lastTrained !== project.createdAt && (
                          <span> • Updated {project.lastTrained}</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.features} features • {formatNumber(project.samples)} samples
                      </div>
                    </div>

                    {project.notes && (
                      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground italic">&ldquo;{project.notes}&rdquo;</p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {profileData.projects.length === 0 && (
                  <div className="text-center py-12">
                    <Brain className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground">Create your first ML model to see it here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              
              <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <div className="flex items-center gap-2">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <button
                        onClick={updateProfile}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      value={profileData.user.email}
                      disabled
                      className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email is managed by your authentication provider</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 shadow-professional">
                <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profileData.stats.totalProjects}</p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profileData.stats.totalDatasets}</p>
                    <p className="text-sm text-muted-foreground">Total Datasets</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profileData.stats.deployedModels}</p>
                    <p className="text-sm text-muted-foreground">Deployed Models</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profileData.stats.avgAccuracy}%</p>
                    <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Footer */}
      <AutoMLFooter />
    </div>
  );
};

export default ProfilePage;