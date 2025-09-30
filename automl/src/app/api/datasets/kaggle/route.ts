// src/app/api/datasets/kaggle/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = decodeURIComponent(searchParams.get('search') || '');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;

    if (!username || !key) {
      console.log('Missing Kaggle credentials, returning mock data');
      // Return mock data when Kaggle credentials are not available
      return NextResponse.json({
        datasets: getMockKaggleData(search, page, pageSize),
        total: 50,
        page,
        pageSize,
        hasMore: page * pageSize < 50
      });
    }

    const auth = Buffer.from(`${username}:${key}`).toString('base64');
    
    // Build Kaggle API URL with parameters
    const kaggleUrl = new URL('https://www.kaggle.com/api/v1/datasets/list');
    if (search) kaggleUrl.searchParams.set('search', search);
    kaggleUrl.searchParams.set('page', page.toString());
    kaggleUrl.searchParams.set('maxSize', pageSize.toString());
    kaggleUrl.searchParams.set('sortBy', 'hottest');

    const response = await fetch(kaggleUrl.toString(), {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kaggle API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Kaggle API response sample:', JSON.stringify(data.slice(0, 1), null, 2));
    
    // Transform Kaggle data to our format
    const transformedDatasets = data.map((dataset: Record<string, unknown>) => {
      // Handle complex tag objects from real Kaggle API
      let transformedTags: string[] = [];
      if (Array.isArray(dataset.tags)) {
        transformedTags = dataset.tags.map((tag: unknown) => {
          if (typeof tag === 'string') return tag;
          if (typeof tag === 'object' && tag !== null) {
            const tagObj = tag as Record<string, unknown>;
            return (tagObj.name as string) || (tagObj.nameNullable as string) || (tagObj.ref as string) || 'unknown';
          }
          return 'unknown';
        }).filter((tag: string) => tag && tag !== 'unknown').slice(0, 5); // Limit to 5 tags
      }

      const title = String(dataset.title || dataset.titleNullable || 'Untitled Dataset');
      const description = String(dataset.description || dataset.subtitle || dataset.subtitleNullable || 'No description available');
      const owner = String(dataset.ownerName || dataset.ownerNameNullable || dataset.creatorName || dataset.creatorNameNullable || 'Unknown');

      return {
        id: String(dataset.ref || `${dataset.ownerRef || dataset.creatorUrl || 'unknown'}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`),
        title,
        description,
        owner,
        downloads: formatDownloadCount(Number(dataset.downloadCount) || 0),
        rating: Number(dataset.usabilityRating || dataset.usabilityRatingNullable) || 0,
        tags: transformedTags,
        size: formatFileSize(Number(dataset.totalBytes || dataset.totalBytesNullable) || 0),
        lastUpdated: String(dataset.lastUpdated || new Date().toISOString()),
        isFeatured: Boolean(dataset.isFeatured),
        fileCount: Array.isArray(dataset.files) ? dataset.files.length : 0,
        // Infer task type and difficulty from tags and title
        taskType: inferTaskType(title, description, transformedTags),
        difficulty: inferDifficulty(title, description, transformedTags),
        domain: inferDomain(title, description, transformedTags)
      };
    });

    return NextResponse.json({
      datasets: transformedDatasets,
      total: transformedDatasets.length,
      page,
      pageSize,
      hasMore: transformedDatasets.length === pageSize
    });

  } catch (error) {
    console.error('Kaggle API error:', error);
    
    // Extract search params for fallback
    const searchParams = request.nextUrl.searchParams;
    const search = decodeURIComponent(searchParams.get('search') || '');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // Return mock data as fallback
    return NextResponse.json({
      datasets: getMockKaggleData(search, page, pageSize),
      total: 50,
      page,
      pageSize,
      hasMore: page * pageSize < 50,
      error: 'Using mock data - Kaggle API unavailable'
    });
  }
}

function formatDownloadCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k+`;
  return count.toString();
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function inferTaskType(title: string, description: string, tags: string[]): string {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  if (content.includes('classification') || content.includes('predict') || content.includes('fraud')) {
    return 'classification';
  }
  if (content.includes('regression') || content.includes('price') || content.includes('cost')) {
    return 'regression';
  }
  if (content.includes('time series') || content.includes('forecast')) {
    return 'time-series';
  }
  if (content.includes('clustering') || content.includes('segmentation')) {
    return 'clustering';
  }
  
  return 'classification'; // default
}

function inferDifficulty(title: string, description: string, tags: string[]): string {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  if (content.includes('advanced') || content.includes('complex') || content.includes('deep')) {
    return 'advanced';
  }
  if (content.includes('intermediate') || content.includes('medium')) {
    return 'intermediate';
  }
  
  return 'beginner'; // default
}

function inferDomain(title: string, description: string, tags: string[]): string {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  if (content.includes('finance') || content.includes('stock') || content.includes('crypto')) {
    return 'finance';
  }
  if (content.includes('health') || content.includes('medical') || content.includes('hospital')) {
    return 'healthcare';
  }
  if (content.includes('house') || content.includes('real estate') || content.includes('property')) {
    return 'real-estate';
  }
  if (content.includes('customer') || content.includes('business') || content.includes('marketing')) {
    return 'business';
  }
  if (content.includes('image') || content.includes('computer vision') || content.includes('nlp')) {
    return 'ai-ml';
  }
  
  return 'general'; // default
}

function getMockKaggleData(search: string, page: number, pageSize: number) {
  const mockData = [
    {
      id: 'titanic',
      title: 'Titanic - Machine Learning from Disaster',
      description: 'Use machine learning to create a model that predicts which passengers survived the Titanic shipwreck.',
      owner: 'competitions',
      downloads: '2.5M+',
      rating: 4.8,
      tags: ['classification', 'beginner', 'historic'],
      size: '60 KB',
      lastUpdated: '2023-01-01',
      isFeatured: true,
      fileCount: 3,
      taskType: 'classification',
      difficulty: 'beginner',
      domain: 'historic'
    },
    {
      id: 'house-prices-advanced-regression-techniques',
      title: 'House Prices - Advanced Regression Techniques',
      description: 'Predict sales prices and practice feature engineering, RFs, and gradient boosting.',
      owner: 'competitions',
      downloads: '1.8M+',
      rating: 4.7,
      tags: ['regression', 'real-estate', 'advanced'],
      size: '460 KB',
      lastUpdated: '2023-02-15',
      isFeatured: true,
      fileCount: 5,
      taskType: 'regression',
      difficulty: 'advanced',
      domain: 'real-estate'
    },
    {
      id: 'covid19-global-forecasting-week-1',
      title: 'COVID-19 Global Forecasting',
      description: 'Forecast COVID-19 spread with epidemiological data.',
      owner: 'competitions',
      downloads: '850k+',
      rating: 4.5,
      tags: ['time-series', 'forecasting', 'healthcare'],
      size: '2.1 MB',
      lastUpdated: '2023-03-20',
      isFeatured: false,
      fileCount: 4,
      taskType: 'time-series',
      difficulty: 'intermediate',
      domain: 'healthcare'
    },
    {
      id: 'digit-recognizer',
      title: 'Digit Recognizer',
      description: 'Learn computer vision fundamentals with the famous MNIST data.',
      owner: 'competitions',
      downloads: '1.2M+',
      rating: 4.6,
      tags: ['computer-vision', 'classification', 'mnist'],
      size: '11.5 MB',
      lastUpdated: '2023-01-10',
      isFeatured: true,
      fileCount: 3,
      taskType: 'classification',
      difficulty: 'intermediate',
      domain: 'ai-ml'
    },
    {
      id: 'netflix-shows',
      title: 'Netflix Movies and TV Shows',
      description: 'Netflix data for movies and TV shows released until 2021.',
      owner: 'shivamb',
      downloads: '450k+',
      rating: 4.3,
      tags: ['entertainment', 'data-visualization', 'eda'],
      size: '2.4 MB',
      lastUpdated: '2023-04-05',
      isFeatured: false,
      fileCount: 1,
      taskType: 'classification',
      difficulty: 'beginner',
      domain: 'entertainment'
    }
  ];

  // Filter by search if provided
  let filtered = mockData;
  if (search) {
    filtered = mockData.filter(dataset => 
      dataset.title.toLowerCase().includes(search.toLowerCase()) ||
      dataset.description.toLowerCase().includes(search.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Paginate
  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
}