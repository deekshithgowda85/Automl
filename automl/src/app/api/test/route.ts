import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Google API key not configured',
          hasKey: false 
        },
        { status: 500 }
      );
    }

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, respond with "API test successful"');
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      status: 'success',
      message: 'API connection successful',
      hasKey: true,
      testResponse: text
    });
    
  } catch (error) {
    console.error('API test failed:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        hasKey: !!process.env.GOOGLE_API_KEY
      },
      { status: 500 }
    );
  }
}