import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.mLModelTemplate.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { popularity: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching ML model templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ML model templates' },
      { status: 500 }
    );
  }
}