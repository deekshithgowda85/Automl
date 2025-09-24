import { NextRequest, NextResponse } from 'next/server';

interface ModelRequest {
  description: string;
}

export async function POST(request: NextRequest) {
  let sandbox = null;
  
  try {
    const { description }: ModelRequest = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Model description is required' },
        { status: 400 }
      );
    }

    console.log('Creating ML model for:', description);

    // Import E2B
    const { Sandbox } = await import('e2b');
    
    // Create sandbox
    console.log('Creating E2B sandbox...');
    sandbox = await Sandbox.create('automl-python-build');
    console.log('✅ Sandbox created successfully');

    // Generate Python code for ML model based on description
    const pythonCode = generateMLCode(description);
    
    console.log('Generated Python code (first 200 chars):', pythonCode.substring(0, 200));

    // Write the Python script to the sandbox
    await sandbox.files.write('/workspace/ml_model.py', pythonCode);
    console.log('✅ Python script written to sandbox');

    // Execute the ML model creation script
    console.log('Executing ML model script...');
    const result = await sandbox.commands.run('cd /workspace && python3 ml_model.py');
    
    console.log('Python execution result:', {
      exitCode: result.exitCode,
      stdout: result.stdout ? result.stdout.substring(0, 1000) : 'No stdout',
      stderr: result.stderr ? result.stderr.substring(0, 500) : 'No stderr'
    });

    // Check if model was created successfully
    if (result.exitCode === 0) {
      // Check if model file exists
      const modelCheck = await sandbox.commands.run('ls -la /workspace/model.pkl');
      console.log('Model file check:', modelCheck.stdout);
      
      if (modelCheck.exitCode === 0) {
        // Clean up sandbox
        await sandbox.kill();
        sandbox = null;
        console.log('✅ Sandbox cleaned up');

        return NextResponse.json({
          success: true,
          message: 'ML model created successfully!',
          output: result.stdout,
          error: result.stderr || null,
          modelCreated: true,
          code: pythonCode,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Model file not found after execution');
      }
    } else {
      throw new Error(`Python script failed with exit code ${result.exitCode}: ${result.stderr}`);
    }

  } catch (error) {
    console.error('Error creating ML model:', error);
    
    // Clean up sandbox in case of error
    if (sandbox) {
      try {
        await sandbox.kill();
        console.log('✅ Sandbox cleaned up after error');
      } catch (cleanupError) {
        console.log('Warning: Failed to cleanup sandbox:', cleanupError);
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create ML model',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function generateMLCode(description: string): string {
  // Analyze the description to determine model type and generate appropriate code
  const lowerDesc = description.toLowerCase();
  
  // Determine model type
  let modelType = 'classification'; // default
  let sampleData = 'iris'; // default dataset
  let algorithm = 'RandomForestClassifier';
  
  if (lowerDesc.includes('regression') || lowerDesc.includes('predict') && (lowerDesc.includes('price') || lowerDesc.includes('value') || lowerDesc.includes('number'))) {
    modelType = 'regression';
    sampleData = 'boston';
    algorithm = 'RandomForestRegressor';
  } else if (lowerDesc.includes('clustering') || lowerDesc.includes('group') || lowerDesc.includes('segment')) {
    modelType = 'clustering';
    sampleData = 'iris';
    algorithm = 'KMeans';
  } else if (lowerDesc.includes('classification') || lowerDesc.includes('classify') || lowerDesc.includes('category')) {
    modelType = 'classification';
    sampleData = 'iris';
    algorithm = 'RandomForestClassifier';
  }

  // Determine dataset based on keywords
  if (lowerDesc.includes('house') || lowerDesc.includes('housing') || lowerDesc.includes('real estate')) {
    sampleData = 'boston';
    modelType = 'regression';
    algorithm = 'RandomForestRegressor';
  } else if (lowerDesc.includes('flower') || lowerDesc.includes('iris')) {
    sampleData = 'iris';
  } else if (lowerDesc.includes('wine')) {
    sampleData = 'wine';
  } else if (lowerDesc.includes('digit') || lowerDesc.includes('number')) {
    sampleData = 'digits';
  }

  return generatePythonCode(modelType, sampleData, algorithm, description);
}

function generatePythonCode(modelType: string, dataset: string, algorithm: string, description: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return `import pandas as pd
import numpy as np
import joblib
from sklearn.datasets import load_iris, load_wine, load_digits
from sklearn.datasets import make_regression, make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report, r2_score, silhouette_score
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

print("🤖 AutoML Model Creation")
print("=" * 50)
print(f"Task: ${description}")
print(f"Model Type: ${modelType}")
print(f"Algorithm: ${algorithm}")
print(f"Dataset: ${dataset}")
print("=" * 50)

# Load dataset
try:
${getDatasetCode(dataset)}
    print(f"✅ Dataset loaded: {X.shape[0]} samples, {X.shape[1]} features")
    
    # Display dataset info
    df = pd.DataFrame(X)
    print("\\n📊 Dataset Information:")
    print(f"- Shape: {X.shape}")
    print(f"- Features: {X.shape[1]}")
${modelType !== 'clustering' ? `    print(f"- Target classes: {len(np.unique(y)) if len(y.shape) == 1 else 'continuous'}")` : ''}
    
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    exit(1)

${getModelCode(modelType, algorithm)}

# Save the model
try:
    joblib.dump(model, '/workspace/model.pkl')
    print("\\n💾 Model saved as 'model.pkl'")
    
    # Save model info
    model_info = {
        'description': '${description}',
        'model_type': '${modelType}',
        'algorithm': '${algorithm}',
        'dataset': '${dataset}',
        'timestamp': '${timestamp}',
        'accuracy': accuracy if '${modelType}' != 'clustering' else None,
        'features': X.shape[1],
        'samples': X.shape[0]
    }
    
    import json
    with open('/workspace/model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    print("✅ Model info saved as 'model_info.json'")
    
    print("\\n🎉 Model creation completed successfully!")
    print(f"Final accuracy: {accuracy:.4f}" if '${modelType}' != 'clustering' else "Clustering completed!")
    
except Exception as e:
    print(f"❌ Error saving model: {e}")
    exit(1)
`;
}

function getDatasetCode(dataset: string): string {
  switch (dataset) {
    case 'boston':
      return `    # Generate Boston housing-like dataset (since boston dataset is deprecated)
    X, y = make_regression(n_samples=500, n_features=13, noise=0.1, random_state=42)
    feature_names = ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'B', 'LSTAT']`;
    case 'wine':
      return `    data = load_wine()
    X, y = data.data, data.target
    feature_names = data.feature_names`;
    case 'digits':
      return `    data = load_digits()
    X, y = data.data, data.target
    feature_names = [f'pixel_{i}' for i in range(X.shape[1])]`;
    default: // iris
      return `    data = load_iris()
    X, y = data.data, data.target
    feature_names = data.feature_names`;
  }
}

function getModelCode(modelType: string, algorithm: string): string {
  switch (modelType) {
    case 'regression':
      return `# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\\n🔄 Training ${algorithm}...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Calculate accuracy (R-squared for regression)
accuracy = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)

print(f"✅ Model trained successfully!")
print(f"📈 R² Score: {accuracy:.4f}")
print(f"📉 MSE: {mse:.4f}")

# Feature importance
importance = model.feature_importances_
print("\\n🔍 Top 5 Most Important Features:")
for i in np.argsort(importance)[-5:][::-1]:
    print(f"  {feature_names[i] if 'feature_names' in locals() else f'Feature_{i}'}: {importance[i]:.4f}")`;

    case 'clustering':
      return `# Scale features for clustering
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("\\n🔄 Training KMeans clustering...")
model = KMeans(n_clusters=3, random_state=42)
clusters = model.fit_predict(X_scaled)

# Calculate silhouette score
accuracy = silhouette_score(X_scaled, clusters)

print(f"✅ Clustering completed!")
print(f"📊 Silhouette Score: {accuracy:.4f}")
print(f"🎯 Number of clusters: {len(np.unique(clusters))}")

# Cluster distribution
unique, counts = np.unique(clusters, return_counts=True)
print("\\n📈 Cluster Distribution:")
for cluster, count in zip(unique, counts):
    print(f"  Cluster {cluster}: {count} samples")`;

    default: // classification
      return `# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\\n🔄 Training ${algorithm}...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)

print(f"✅ Model trained successfully!")
print(f"📈 Accuracy: {accuracy:.4f}")

# Feature importance
importance = model.feature_importances_
print("\\n🔍 Top 5 Most Important Features:")
for i in np.argsort(importance)[-5:][::-1]:
    print(f"  {feature_names[i] if 'feature_names' in locals() else f'Feature_{i}'}: {importance[i]:.4f}")

print("\\n📊 Classification Report:")
print(classification_report(y_test, y_pred))`;
  }
}