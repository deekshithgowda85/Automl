import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface ExecuteMLRequest {
  prompt: string;
  kaggleDatasetId?: string;
  targetVariable?: string;
  taskType?: 'classification' | 'regression' | 'clustering' | 'auto-detect';
  pipeline?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, kaggleDatasetId, targetVariable, taskType }: ExecuteMLRequest = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Generate execution plan based on prompt
    const model = genAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    const planningPrompt = `
You are an AutoML execution planner. Based on this user prompt, create a detailed execution plan:

User Prompt: "${prompt}"
Dataset: ${kaggleDatasetId || 'Not specified'}
Target Variable: ${targetVariable || 'Auto-detect'}
Task Type: ${taskType || 'Auto-detect'}

Generate a step-by-step execution plan that includes:

1. DATA PREPARATION:
   - Dataset analysis and validation
   - Data cleaning strategy
   - Feature preprocessing steps

2. MODEL DEVELOPMENT:
   - Algorithm selection rationale
   - Hyperparameter tuning approach
   - Validation strategy

3. EVALUATION:
   - Performance metrics
   - Model comparison criteria
   - Success criteria

4. DEPLOYMENT:
   - Model packaging
   - API creation
   - Testing strategy

Provide the response as a structured JSON with executable steps and estimated timing.
`;

    const planningResponse = await model.generateContent(planningPrompt);
    const executionPlan = planningResponse.response.text();

    // Step 2: Generate executable Python code
    const codePrompt = `
Based on this execution plan and user requirements, generate complete Python code for AutoML:

User Prompt: "${prompt}"
Execution Plan: ${executionPlan}

Generate complete Python scripts for:

1. DATA_LOADER.PY - Download and load data from Kaggle
2. PREPROCESSOR.PY - Clean and prepare data  
3. FEATURE_ENGINEER.PY - Create and select features
4. MODEL_TRAINER.PY - Train multiple models with hyperparameter tuning
5. EVALUATOR.PY - Evaluate and compare models
6. DEPLOYER.PY - Create prediction API
7. MAIN.PY - Orchestrate the entire pipeline

Each script should be production-ready with error handling, logging, and proper imports.
Make sure the code is complete and can be executed directly.

Return the response as JSON with each script as a separate key.
`;

    const codeResponse = await model.generateContent(codePrompt);
    const generatedCode = codeResponse.response.text();

    // Step 3: Create comprehensive execution summary
    const summaryPrompt = `
Create a comprehensive execution summary for this AutoML project:

User Request: "${prompt}"
Generated Plan: ${executionPlan}

Provide:
1. Project overview and objectives
2. Technical approach and methodology
3. Expected outcomes and deliverables
4. Potential challenges and mitigation strategies
5. Success metrics and evaluation criteria
6. Next steps and recommendations

Keep it professional and actionable.
`;

    const summaryResponse = await model.generateContent(summaryPrompt);
    const projectSummary = summaryResponse.response.text();

    // Mock execution results (replace with actual E2B execution)
    const mockResults = {
      dataProcessing: {
        status: 'completed',
        recordsProcessed: 10000,
        featuresCreated: 25,
        dataQualityScore: 0.92
      },
      modelTraining: {
        status: 'completed',
        modelsTrained: 5,
        bestModel: 'RandomForest',
        bestAccuracy: 0.87,
        crossValidationScore: 0.85
      },
      deployment: {
        status: 'ready',
        apiEndpoint: '/api/predict',
        modelFormat: 'joblib',
        responseTime: '45ms'
      }
    };

    return NextResponse.json({
      success: true,
      message: 'AutoML pipeline execution plan generated successfully',
      executionPlan,
      generatedCode,
      projectSummary,
      mockResults,
      metadata: {
        userPrompt: prompt,
        kaggleDatasetId,
        targetVariable,
        taskType,
        timestamp: new Date().toISOString(),
        estimatedDuration: '30-90 minutes',
        status: 'ready_for_execution'
      },
      nextSteps: [
        'Set up E2B sandbox environment',
        'Configure Kaggle API credentials',
        'Execute data preprocessing pipeline',
        'Train and evaluate ML models',
        'Deploy best performing model',
        'Test API endpoints'
      ]
    });

  } catch (error) {
    console.error('Error in execute-ml:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}