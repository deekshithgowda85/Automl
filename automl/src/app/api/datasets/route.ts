import { NextResponse } from 'next/server';
import { datasetsCatalog } from '@/lib/mock-datasets';

export async function GET() {
  try {
    return NextResponse.json(datasetsCatalog);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    );
  }
}/*
import { NextRequest, NextResponse } from 'next/server';
import { datasetService } from '@/app/services/datasetService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    const datasets = await datasetService.searchDatasets(query);
    return NextResponse.json(datasets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    );
  }
}*/