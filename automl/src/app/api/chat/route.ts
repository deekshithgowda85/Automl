import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface MessageHistory {
  type: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionHistory }: { message: string; sessionHistory: MessageHistory[] } = await request.json();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured. Please add GOOGLE_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Test API key validity with a simple request first
    const model = genAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
    
    // Build conversation history for context, ensuring it starts with user message
    let conversationHistory = sessionHistory
      .filter(msg => msg.content.trim() !== '') // Remove empty messages
      .slice(-6) // Only keep last 6 messages for context
      .map((msg: MessageHistory) => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Ensure conversation starts with user message (required by Gemini API)
    if (conversationHistory.length > 0 && conversationHistory[0].role !== 'user') {
      conversationHistory = conversationHistory.slice(1); // Remove first non-user message
    }

    // System prompt for AutoML assistant
    const systemPrompt = `You are an expert AutoML assistant specialized in machine learning. Your role is to:
    1. Help users with machine learning concepts, algorithms, and workflows
    2. Provide guidance on ML best practices and methodologies
    3. Explain data preprocessing, model selection, and evaluation techniques
    4. Suggest appropriate algorithms and techniques for different problems
    5. Help with data analysis and interpretation
    6. Provide clear explanations and practical examples
    7. Assist with model optimization and hyperparameter tuning
    
    Always provide practical, actionable advice with clear explanations. Focus on helping users understand ML concepts and make informed decisions about their projects.`;

    // If no conversation history, start fresh
    if (conversationHistory.length === 0) {
      const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return NextResponse.json({
        response: text,
        timestamp: new Date().toISOString()
      });
    }

    // Use chat with history
    const chat = model.startChat({
      history: conversationHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to get response from AI assistant';
    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('API key')) {
        errorMessage = 'Invalid or missing Google API key. Please check your configuration.';
      } else if (error.message.includes('quota') || error.message.includes('QUOTA')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('fetch failed') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('models/') || error.message.includes('model')) {
        errorMessage = 'Model not available. Trying with alternative model configuration.';
      } else {
        errorMessage = `API Error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}