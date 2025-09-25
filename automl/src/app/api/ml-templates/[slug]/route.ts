import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const template = await prisma.mLModelTemplate.findUnique({
      where: { slug }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'ML model template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching ML model template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ML model template' },
      { status: 500 }
    );
  }
}