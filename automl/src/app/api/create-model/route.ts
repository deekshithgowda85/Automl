import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateContentWithFallback } from '@/lib/google-ai-utils';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface AutoMLRequest {
  prompt: string;
  kaggleDatasetId?: string;
  targetVariable?: string;
  taskType?: 'classification' | 'regression' | 'clustering' | 'auto-detect';
  modelPreferences?: {
    algorithms?: string[];
    performance_metric?: string;
    time_budget?: number;
    interpretability?: 'high' | 'medium' | 'low';
  };
}

interface MLPipeline {
  dataPreprocessing: {
    steps: string[];
    code: string;
  };
  featureEngineering: {
    techniques: string[];
    code: string;
  };
  modelSelection: {
    algorithms: Array<{
      name: string;
      rationale: string;
      hyperparameters: object;
    }>;
    evaluation_strategy: string;
  };
  training: {
    pipeline_code: string;
    validation_strategy: string;
  };
  deployment: {
    model_format: string;
    api_code: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, kaggleDatasetId, targetVariable, taskType, modelPreferences }: AutoMLRequest = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required for AI-driven model building' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    // Generate comprehensive ML pipeline
    const pipelinePrompt = `
You are an expert AutoML system. Based on the following user requirements, generate a complete machine learning pipeline:

User Prompt: "${prompt}"
Kaggle Dataset ID: ${kaggleDatasetId || 'Not specified'}
Target Variable: ${targetVariable || 'Auto-detect from data'}
Task Type: ${taskType || 'Auto-detect'}
Model Preferences: ${JSON.stringify(modelPreferences || {})}

Generate a comprehensive ML pipeline that includes:

1. DATA ANALYSIS & PREPROCESSING:
   - Data loading and exploration code
   - Missing value handling strategy
   - Outlier detection and handling
   - Feature scaling/normalization
   - Categorical encoding methods

2. FEATURE ENGINEERING:
   - Feature selection techniques
   - Feature creation/transformation
   - Dimensionality reduction if needed
   - Feature importance analysis

3. MODEL SELECTION:
   - Recommend 3-5 appropriate algorithms with rationale
   - Hyperparameter tuning strategy
   - Cross-validation approach
   - Ensemble methods consideration

4. TRAINING PIPELINE:
   - Complete Python code for model training
   - Evaluation metrics and validation
   - Model comparison framework
   - Performance optimization

5. MODEL DEPLOYMENT:
   - Model serialization (joblib/pickle)
   - Prediction API code
   - Input validation
   - Error handling

Provide executable Python code for each section. Make sure the code is production-ready and includes proper error handling.

Return the response as a structured JSON object with the following format:
{
  "task_analysis": {
    "detected_task_type": "classification|regression|clustering",
    "recommended_target": "column_name",
    "data_characteristics": "description"
  },
  "data_preprocessing": {
    "steps": ["step1", "step2", ...],
    "code": "python_code_here"
  },
  "feature_engineering": {
    "techniques": ["technique1", "technique2", ...],
    "code": "python_code_here"
  },
  "model_selection": {
    "algorithms": [
      {
        "name": "algorithm_name",
        "rationale": "why_this_algorithm",
        "hyperparameters": {}
      }
    ],
    "evaluation_strategy": "description"
  },
  "training": {
    "pipeline_code": "complete_training_code",
    "validation_strategy": "cross_validation_approach"
  },
  "deployment": {
    "model_format": "joblib|pickle",
    "api_code": "flask_or_fastapi_code"
  }
}
`;

    console.log('Generating ML pipeline with AI...');
    const aiResponse = await model.generateContent(pipelinePrompt);
    const pipelineText = aiResponse.response.text();

    // Try to extract JSON from the response
    let pipeline: MLPipeline;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = pipelineText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      pipeline = JSON.parse(cleanedResponse);
    } catch {
      // If JSON parsing fails, create a structured response from the text
      pipeline = {
        dataPreprocessing: {
          steps: ['Data loading', 'Missing value handling', 'Feature encoding'],
          code: extractCodeSection(pipelineText, 'preprocessing') || generateFallbackPreprocessingCode()
        },
        featureEngineering: {
          techniques: ['Feature scaling', 'Feature selection', 'Feature creation'],
          code: extractCodeSection(pipelineText, 'feature') || generateFallbackFeatureCode()
        },
        modelSelection: {
          algorithms: [
            { name: 'Random Forest', rationale: 'Robust and interpretable', hyperparameters: {} },
            { name: 'XGBoost', rationale: 'High performance gradient boosting', hyperparameters: {} },
            { name: 'Logistic Regression', rationale: 'Simple and fast baseline', hyperparameters: {} }
          ],
          evaluation_strategy: 'Cross-validation with multiple metrics'
        },
        training: {
          pipeline_code: extractCodeSection(pipelineText, 'training') || generateFallbackTrainingCode(),
          validation_strategy: '5-fold cross-validation'
        },
        deployment: {
          model_format: 'joblib',
          api_code: generateAPICode()
        }
      };
    }

    // Generate additional model insights
    const insightsPrompt = `
Based on this ML pipeline and user prompt: "${prompt}"
Provide practical insights and recommendations:

1. Expected performance metrics
2. Potential challenges and solutions
3. Data quality requirements
4. Deployment considerations
5. Monitoring recommendations

Keep it concise and actionable.
`;

    const insightsResponse = await model.generateContent(insightsPrompt);
    const insights = insightsResponse.response.text();

    // Create execution plan
    const executionPlan = generateExecutionPlan(pipeline, kaggleDatasetId);

    return NextResponse.json({
      success: true,
      message: 'AutoML pipeline generated successfully',
      pipeline,
      insights,
      executionPlan,
      metadata: {
        userPrompt: prompt,
        kaggleDatasetId,
        targetVariable,
        taskType,
        timestamp: new Date().toISOString(),
        generatedBy: 'AI-AutoML-System'
      }
    });

  } catch (error) {
    console.error('Error in create-model:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

function extractCodeSection(text: string, section: string): string | null {
  const patterns = {
    preprocessing: /(?:preprocessing|data.*processing|cleaning)(.*?)(?=\n\n|\n#|$)/i,
    feature: /(?:feature.*engineering|feature.*selection)(.*?)(?=\n\n|\n#|$)/i,
    training: /(?:training|model.*training|fit)(.*?)(?=\n\n|\n#|$)/i
  };

  const pattern = patterns[section as keyof typeof patterns];
  if (!pattern) return null;

  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function generateFallbackPreprocessingCode(): string {
  return `
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Load dataset
df = pd.read_csv('/workspace/datasets/data.csv')

# Handle missing values
numeric_columns = df.select_dtypes(include=[np.number]).columns
categorical_columns = df.select_dtypes(include=['object']).columns

# Impute numeric columns with median
num_imputer = SimpleImputer(strategy='median')
df[numeric_columns] = num_imputer.fit_transform(df[numeric_columns])

# Impute categorical columns with mode
cat_imputer = SimpleImputer(strategy='most_frequent')
df[categorical_columns] = cat_imputer.fit_transform(df[categorical_columns])

# Encode categorical variables
label_encoders = {}
for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

print("Data preprocessing completed")
print(f"Dataset shape: {df.shape}")
`;
}

function generateFallbackFeatureCode(): string {
  return `
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.preprocessing import StandardScaler

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Feature selection
selector = SelectKBest(score_func=f_classif, k=10)
X_selected = selector.fit_transform(X_scaled, y)

print(f"Selected {X_selected.shape[1]} features from {X_scaled.shape[1]} original features")
`;
}

function generateFallbackTrainingCode(): string {
  return `
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate model
y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")

# Cross-validation
cv_scores = cross_val_score(rf_model, X, y, cv=5)
print(f"Cross-validation scores: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

# Save model
joblib.dump(rf_model, '/workspace/models/trained_model.joblib')
print("Model saved successfully")
`;
}

function generateAPICode(): string {
  return `
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('/workspace/models/trained_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Make prediction
        prediction = model.predict(df)
        prediction_proba = None
        
        if hasattr(model, 'predict_proba'):
            prediction_proba = model.predict_proba(df).tolist()
        
        return jsonify({
            'prediction': prediction.tolist(),
            'prediction_probability': prediction_proba,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`;
}

function generateExecutionPlan(pipeline: MLPipeline, kaggleDatasetId?: string): object {
  const steps = [
    {
      step: 1,
      name: 'Data Acquisition',
      description: kaggleDatasetId 
        ? `Download dataset from Kaggle: ${kaggleDatasetId}`
        : 'Prepare your dataset and upload to the system',
      estimated_time: '2-5 minutes',
      dependencies: ['Kaggle API credentials']
    },
    {
      step: 2,
      name: 'Data Preprocessing',
      description: 'Clean and prepare data for machine learning',
      estimated_time: '5-15 minutes',
      dependencies: ['Raw dataset'],
      code_sections: pipeline.dataPreprocessing.steps
    },
    {
      step: 3,
      name: 'Feature Engineering',
      description: 'Create and select optimal features',
      estimated_time: '10-30 minutes',
      dependencies: ['Cleaned dataset'],
      techniques: pipeline.featureEngineering.techniques
    },
    {
      step: 4,
      name: 'Model Training',
      description: 'Train and validate multiple ML models',
      estimated_time: '15-60 minutes',
      dependencies: ['Engineered features'],
      algorithms: pipeline.modelSelection.algorithms.map(alg => alg.name)
    },
    {
      step: 5,
      name: 'Model Deployment',
      description: 'Deploy the best model as an API',
      estimated_time: '5-10 minutes',
      dependencies: ['Trained model'],
      output: 'REST API endpoint'
    }
  ];

  return {
    total_estimated_time: '37-120 minutes',
    steps,
    success_criteria: [
      'Model achieves acceptable performance metrics',
      'API responds correctly to test requests',
      'All data quality checks pass'
    ]
  };
}
