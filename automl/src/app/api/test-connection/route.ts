import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Testing API connection...');
    
    // Test environment variables
    const kaggleUsername = process.env.KAGGLE_USERNAME;
    const kaggleKey = process.env.KAGGLE_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;
    
    console.log('📋 Environment check:');
    console.log(`- KAGGLE_USERNAME: ${kaggleUsername ? '✅ Set' : '❌ Missing'}`);
    console.log(`- KAGGLE_KEY: ${kaggleKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`- GOOGLE_API_KEY: ${googleApiKey ? '✅ Set' : '❌ Missing'}`);
    
    // Test a simple Kaggle API call
    let kaggleStatus = 'Not tested';
    if (kaggleUsername && kaggleKey) {
      try {
        const auth = Buffer.from(`${kaggleUsername}:${kaggleKey}`).toString('base64');
        
        console.log('🔗 Testing Kaggle API connection...');
        const response = await fetch('https://www.kaggle.com/api/v1/datasets/list?page=1&pageSize=1', {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          kaggleStatus = '✅ Connected successfully';
          console.log('✅ Kaggle API connection successful');
        } else {
          kaggleStatus = `❌ Connection failed: ${response.status} ${response.statusText}`;
          console.log(`❌ Kaggle API connection failed: ${response.status}`);
        }
      } catch (error) {
        kaggleStatus = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.log(`❌ Kaggle API error: ${error}`);
      }
    } else {
      kaggleStatus = '❌ Credentials missing';
    }
    
    return NextResponse.json({
      success: true,
      message: 'API connection test completed',
      timestamp: new Date().toISOString(),
      environment: {
        kaggleUsername: kaggleUsername ? 'Set' : 'Missing',
        kaggleKey: kaggleKey ? 'Set' : 'Missing', 
        googleApiKey: googleApiKey ? 'Set' : 'Missing'
      },
      kaggleStatus,
      nodeEnv: process.env.NODE_ENV || 'unknown'
    });
    
  } catch (error) {
    console.error('❌ Connection test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json();
    
    if (testType === 'kaggle-search') {
      const kaggleUsername = process.env.KAGGLE_USERNAME;
      const kaggleKey = process.env.KAGGLE_KEY;
      
      if (!kaggleUsername || !kaggleKey) {
        return NextResponse.json({
          success: false,
          error: 'Kaggle credentials not configured'
        }, { status: 401 });
      }
      
      const auth = Buffer.from(`${kaggleUsername}:${kaggleKey}`).toString('base64');
      
      const response = await fetch('https://www.kaggle.com/api/v1/datasets/list?search=titanic&page=1&pageSize=3', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `Kaggle API error: ${response.status} ${response.statusText}`
        }, { status: response.status });
      }
      
      const data = await response.json();
      
      return NextResponse.json({
        success: true,
        message: 'Kaggle search test completed',
        results: data.slice(0, 3), // First 3 results
        totalFound: data.length
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown test type'
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}