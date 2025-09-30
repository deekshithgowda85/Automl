import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    console.log(`🔍 Searching Kaggle datasets for: ${query}`);
    
    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;

    if (!username || !key) {
      return NextResponse.json({
        success: false,
        error: 'Kaggle API credentials not configured. Please set KAGGLE_USERNAME and KAGGLE_KEY environment variables.'
      }, { status: 401 });
    }

    const auth = Buffer.from(`${username}:${key}`).toString('base64');

    const response = await fetch(
      `https://www.kaggle.com/api/v1/datasets/list?search=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Kaggle search API error: ${response.status} ${response.statusText}`);
    }

    const searchResults = await response.json();
    
    console.log(`✅ Found ${searchResults.length} datasets`);
    
    return NextResponse.json({
      success: true,
      datasets: searchResults,
      query: query,
      source: 'kaggle-search-api',
      count: searchResults.length
    });

  } catch (error) {
    console.error('❌ Kaggle search error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to search Kaggle datasets'
    }, { status: 500 });
  }
}