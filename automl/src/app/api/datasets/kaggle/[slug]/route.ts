import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log(`🔍 Fetching Kaggle dataset: ${slug}`);
    
    // Get Kaggle credentials from environment
    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;

    if (!username || !key) {
      console.error('❌ Kaggle credentials missing');
      return NextResponse.json({
        success: false,
        error: 'Kaggle API credentials not configured. Please set KAGGLE_USERNAME and KAGGLE_KEY environment variables.'
      }, { status: 401 });
    }

    // Create basic auth header
    const auth = Buffer.from(`${username}:${key}`).toString('base64');
    
    try {
      // First, get dataset metadata
      console.log(`📊 Getting metadata for dataset: ${slug}`);
      
      const metadataResponse = await fetch(
        `https://www.kaggle.com/api/v1/datasets/view/${slug}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!metadataResponse.ok) {
        throw new Error(`Failed to get dataset metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
      }

      const metadata = await metadataResponse.json();
      console.log(`✅ Dataset metadata retrieved: ${metadata.title}`);

      // Now try to download the dataset
      console.log(`⬇️ Downloading dataset files...`);
      
      const downloadResponse = await fetch(
        `https://www.kaggle.com/api/v1/datasets/download/${slug}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      if (!downloadResponse.ok) {
        throw new Error(`Failed to download dataset: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }

      // Get the zip file content
      const zipBuffer = await downloadResponse.arrayBuffer();
      console.log(`📦 Downloaded ${zipBuffer.byteLength} bytes`);

      // For now, we'll try to extract the first CSV file from the zip
      // In a production environment, you'd want to use a proper ZIP library
      // For simplicity, we'll return metadata and indicate download success
      
      const csvContent = await extractFirstCSVFromZip(zipBuffer);
      
      if (!csvContent) {
        throw new Error('No CSV files found in the dataset');
      }

      console.log(`✅ Successfully extracted CSV data`);

      return NextResponse.json({
        success: true,
        csvContent: csvContent,
        fileName: `${slug}.csv`,
        description: metadata.subtitle || metadata.title || `Kaggle dataset: ${slug}`,
        metadata: {
          title: metadata.title,
          subtitle: metadata.subtitle,
          description: metadata.description,
          totalBytes: metadata.totalBytes,
          lastUpdated: metadata.lastUpdated,
          downloadCount: metadata.downloadCount,
          voteCount: metadata.voteCount,
          usabilityRating: metadata.usabilityRating
        },
        datasetId: slug,
        source: 'kaggle-api'
      });

    } catch (apiError) {
      console.error(`❌ Kaggle API error:`, apiError);
      
      // Return detailed error information
      return NextResponse.json({
        success: false,
        error: `Kaggle API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
        details: {
          dataset: slug,
          timestamp: new Date().toISOString(),
          hasCredentials: !!(username && key),
          errorType: 'kaggle-api-error'
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ General error in Kaggle route:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Internal server error in Kaggle dataset fetching'
    }, { status: 500 });
  }
}

// Helper function to extract CSV from ZIP buffer
async function extractFirstCSVFromZip(zipBuffer: ArrayBuffer): Promise<string | null> {
  try {
    // For a complete implementation, you'd use a library like 'yauzl' or 'jszip'
    // For now, we'll implement a basic approach
    
    // This is a simplified implementation
    // In production, you should use a proper ZIP library
    
    // Look for CSV file signatures in the ZIP
    // This is a very basic approach - in production use a proper ZIP parser
    
    // For demonstration, let's assume we can extract text
    // You would need to implement proper ZIP extraction here
    
    // Return null for now - this needs proper ZIP extraction implementation
    console.log('⚠️ ZIP extraction needs proper implementation with ZIP library');
    console.log(`📦 ZIP buffer size: ${zipBuffer.byteLength} bytes`);
    
    // For testing purposes, return a placeholder indicating real Kaggle data would be here
    return null;
    
  } catch (error) {
    console.error('❌ Error extracting CSV from ZIP:', error);
    return null;
  }
}

// Alternative implementation using search if direct download fails
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    console.log(`🔍 Searching Kaggle datasets for: ${query}`);
    
    const username = process.env.KAGGLE_USERNAME;
    const key = process.env.KAGGLE_KEY;

    if (!username || !key) {
      return NextResponse.json({
        success: false,
        error: 'Kaggle API credentials not configured'
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
      throw new Error(`Kaggle search API error: ${response.status}`);
    }

    const searchResults = await response.json();
    
    return NextResponse.json({
      success: true,
      datasets: searchResults,
      query: query,
      source: 'kaggle-search-api'
    });

  } catch (error) {
    console.error('❌ Kaggle search error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
