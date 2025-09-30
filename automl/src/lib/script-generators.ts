import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export interface MLScriptConfig {
  taskType: 'classification' | 'regression' | 'clustering';
  datasetId?: string;
  targetVariable?: string;
  algorithms: string[];
  userPrompt: string;
}

export async function generateMLCode(config: MLScriptConfig): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-pro',
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });

  const aiPrompt = `
Create a complete Python AutoML script that reads from a kaggledataset.csv file.

User Request: "${config.userPrompt}"
Task Type: ${config.taskType}
Target Variable: ${config.targetVariable || 'auto-detect'}
Algorithms: ${config.algorithms.join(', ') || 'auto-select'}

REQUIREMENTS:
1. Load data from 'kaggledataset.csv' file (fetched by Next.js API)
2. Dynamically analyze dataset structure and select appropriate algorithms
3. Intelligent preprocessing based on actual data properties
4. Generate exactly 3 files: mlcode.py, model.pkl, output.txt
5. Complete error handling and fallback mechanisms
6. If kaggledataset.csv not found, generate realistic sample data

The script should create an intelligent AutoML pipeline that works with the provided dataset.

Generate ONLY executable Python code with no markdown formatting.
`;

  try {
    const response = await model.generateContent(aiPrompt);
    let code = response.response.text();
    
    // Clean the response
    code = code
      .replace(/```python\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*python\s*\n/gm, '')
      .trim();

    return code;
  } catch (error) {
    console.error('Error generating ML code:', error);
    throw new Error('Failed to generate ML code');
  }
}

export function generateEDAScript(config: MLScriptConfig): string {
  return `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class AutoEDA:
    def __init__(self, user_prompt="${config.userPrompt}"):
        self.user_prompt = user_prompt
        self.data = None
        
    def load_data(self):
        """Load dataset from kaggledataset.csv file (fetched by Next.js API)"""
        try:
            print("🚀 Loading dataset from kaggledataset.csv...")
            
            # Check if kaggledataset.csv exists (fetched by Next.js)
            import os
            if os.path.exists('kaggledataset.csv'):
                print("✅ DATASET FOUND: Loading kaggledataset.csv...")
                df = pd.read_csv('kaggledataset.csv')
                print(f"📊 Dataset loaded successfully: {len(df)} rows, {len(df.columns)} columns")
                print(f"📋 Columns: {list(df.columns)}")
                return df
            else:
                print("⚠️  Dataset file not found - generating sample data...")
                return self.generate_ai_sample_data()
                
        except Exception as e:
            print(f"❌ ERROR loading dataset: {str(e)}")
            print("🔄 Fallback: Generating AI sample data...")
            return self.generate_ai_sample_data()
        
    def generate_ai_sample_data(self):
        """Generate intelligent sample data based on user prompt analysis"""
        print("🧪 Generating AI sample data...")
        
        np.random.seed(42)
        n_samples = 1000
        
        # Generate basic numeric features
        data = {
            'feature_1': np.random.randn(n_samples),
            'feature_2': np.random.randn(n_samples) * 2 + 1,
            'feature_3': np.random.exponential(2, n_samples),
            'feature_4': np.random.uniform(0, 100, n_samples)
        }
        
        # Generate target based on task type
        if '${config.taskType}' == 'classification':
            data['target'] = np.random.choice(['Class_A', 'Class_B', 'Class_C'], n_samples)
        elif '${config.taskType}' == 'regression':
            data['target'] = data['feature_1'] * 2 + data['feature_2'] * 0.5 + np.random.randn(n_samples) * 0.1
        else:  # clustering
            data['target'] = np.random.randint(0, 3, n_samples)
        
        df = pd.DataFrame(data)
        
        # Save for consistency
        df.to_csv('kaggledataset.csv', index=False)
        print(f"✅ Generated {len(df)} rows, {len(df.columns)} columns")
        
        return df
        
    def perform_eda(self):
        """Perform comprehensive EDA"""
        try:
            print("Starting Exploratory Data Analysis...")
            
            # Load data
            self.data = self.load_data()
            
            if self.data is None or len(self.data) == 0:
                print("❌ No data available for EDA")
                return
            
            print(f"\\n📊 Dataset Overview:")
            print(f"Rows: {len(self.data)}")
            print(f"Columns: {len(self.data.columns)}")
            print(f"\\nColumn Types:")
            print(self.data.dtypes)
            
            print(f"\\n📈 Statistical Summary:")
            print(self.data.describe())
            
            print(f"\\n❓ Missing Values:")
            missing = self.data.isnull().sum()
            print(missing[missing > 0])
            
            # Generate visualizations
            plt.figure(figsize=(15, 10))
            
            # Correlation heatmap for numeric columns
            numeric_cols = self.data.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 1:
                plt.subplot(2, 2, 1)
                correlation_matrix = self.data[numeric_cols].corr()
                sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
                plt.title('Feature Correlation Heatmap')
            
            # Distribution plots
            if len(numeric_cols) > 0:
                plt.subplot(2, 2, 2)
                self.data[numeric_cols[0]].hist(bins=30, alpha=0.7)
                plt.title(f'Distribution of {numeric_cols[0]}')
                plt.xlabel(numeric_cols[0])
                plt.ylabel('Frequency')
            
            # Box plots for outlier detection
            if len(numeric_cols) > 1:
                plt.subplot(2, 2, 3)
                self.data[numeric_cols[:4]].boxplot()
                plt.title('Outlier Detection')
                plt.xticks(rotation=45)
            
            # Target variable analysis if exists
            if 'target' in self.data.columns:
                plt.subplot(2, 2, 4)
                if self.data['target'].dtype == 'object' or self.data['target'].nunique() < 20:
                    self.data['target'].value_counts().plot(kind='bar')
                    plt.title('Target Variable Distribution')
                else:
                    self.data['target'].hist(bins=30, alpha=0.7)
                    plt.title('Target Variable Distribution')
                plt.xticks(rotation=45)
            
            plt.tight_layout()
            plt.savefig('eda_analysis.png', dpi=300, bbox_inches='tight')
            print("\\n✅ EDA visualizations saved as 'eda_analysis.png'")
            
            # Save EDA report
            with open('eda_report.txt', 'w') as f:
                f.write("EXPLORATORY DATA ANALYSIS REPORT\\n")
                f.write("="*50 + "\\n\\n")
                f.write(f"Dataset: {len(self.data)} rows × {len(self.data.columns)} columns\\n\\n")
                f.write("COLUMN INFORMATION:\\n")
                f.write(str(self.data.dtypes) + "\\n\\n")
                f.write("STATISTICAL SUMMARY:\\n")
                f.write(str(self.data.describe()) + "\\n\\n")
                f.write("MISSING VALUES:\\n")
                f.write(str(missing[missing > 0]) + "\\n\\n")
                if len(numeric_cols) > 1:
                    f.write("CORRELATIONS:\\n")
                    f.write(str(correlation_matrix) + "\\n\\n")
            
            print("✅ EDA report saved as 'eda_report.txt'")
            
        except Exception as e:
            print(f"❌ EDA Error: {str(e)}")
            
    def run_analysis(self):
        """Main method to run complete EDA"""
        print("🔍 Starting Comprehensive EDA Analysis...")
        print(f"📝 User Request: {self.user_prompt}")
        self.perform_eda()
        print("🎉 EDA Analysis Complete!")

# Run the analysis
if __name__ == "__main__":
    eda = AutoEDA()
    eda.run_analysis()
`.trim();
}

export function generateDataVisualizationScript(config: MLScriptConfig): string {
  return `
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import warnings
warnings.filterwarnings('ignore')

class DataVisualizer:
    def __init__(self, user_prompt="${config.userPrompt}"):
        self.user_prompt = user_prompt
        self.data = None
        
    def load_data(self):
        """Load dataset from kaggledataset.csv file (fetched by Next.js API)"""
        try:
            print("🚀 Loading dataset from kaggledataset.csv...")
            
            # Check if kaggledataset.csv exists (fetched by Next.js)
            import os
            if os.path.exists('kaggledataset.csv'):
                print("✅ DATASET FOUND: Loading kaggledataset.csv...")
                df = pd.read_csv('kaggledataset.csv')
                print(f"📊 Dataset loaded successfully: {len(df)} rows, {len(df.columns)} columns")
                return df
            else:
                print("⚠️  Dataset file not found - generating sample data...")
                return self.generate_sample_data()
                
        except Exception as e:
            print(f"❌ ERROR loading dataset: {str(e)}")
            return self.generate_sample_data()
    
    def generate_sample_data(self):
        """Generate sample data for visualization"""
        print("🧪 Generating sample data for visualization...")
        
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            'numerical_1': np.random.randn(n_samples),
            'numerical_2': np.random.randn(n_samples) * 2 + 5,
            'categorical_1': np.random.choice(['A', 'B', 'C', 'D'], n_samples),
            'categorical_2': np.random.choice(['X', 'Y', 'Z'], n_samples),
            'target': np.random.choice(['Class_1', 'Class_2', 'Class_3'], n_samples)
        }
        
        df = pd.DataFrame(data)
        df.to_csv('kaggledataset.csv', index=False)
        return df
        
    def create_comprehensive_visualizations(self):
        """Create comprehensive visualizations"""
        self.data = self.load_data()
        
        if self.data is None:
            print("❌ No data available for visualization")
            return
            
        print("📊 Creating comprehensive visualizations...")
        
        # Set up the plotting style
        plt.style.use('seaborn-v0_8')
        fig = plt.figure(figsize=(20, 15))
        
        # Get numeric and categorical columns
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        
        plot_count = 0
        
        # 1. Distribution plots for numeric variables
        if len(numeric_cols) > 0:
            for i, col in enumerate(numeric_cols[:4]):  # Max 4 numeric plots
                plot_count += 1
                plt.subplot(4, 4, plot_count)
                self.data[col].hist(bins=30, alpha=0.7, color=f'C{i}')
                plt.title(f'Distribution of {col}')
                plt.xlabel(col)
                plt.ylabel('Frequency')
        
        # 2. Box plots for outlier detection
        if len(numeric_cols) > 1:
            plot_count += 1
            plt.subplot(4, 4, plot_count)
            self.data[numeric_cols[:5]].boxplot()
            plt.title('Outlier Detection')
            plt.xticks(rotation=45)
        
        # 3. Correlation heatmap
        if len(numeric_cols) > 1:
            plot_count += 1
            plt.subplot(4, 4, plot_count)
            correlation_matrix = self.data[numeric_cols].corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
            plt.title('Feature Correlation Matrix')
        
        # 4. Categorical variable plots
        for i, col in enumerate(categorical_cols[:3]):  # Max 3 categorical plots
            plot_count += 1
            plt.subplot(4, 4, plot_count)
            value_counts = self.data[col].value_counts()
            value_counts.plot(kind='bar', color=f'C{i+3}')
            plt.title(f'Distribution of {col}')
            plt.xticks(rotation=45)
            plt.ylabel('Count')
        
        # 5. Pairwise relationships (if we have numeric columns)
        if len(numeric_cols) >= 2:
            plot_count += 1
            plt.subplot(4, 4, plot_count)
            plt.scatter(self.data[numeric_cols[0]], self.data[numeric_cols[1]], alpha=0.6)
            plt.xlabel(numeric_cols[0])
            plt.ylabel(numeric_cols[1])
            plt.title(f'{numeric_cols[0]} vs {numeric_cols[1]}')
        
        # 6. Target variable analysis (if exists)
        if 'target' in self.data.columns:
            plot_count += 1
            plt.subplot(4, 4, plot_count)
            if self.data['target'].dtype == 'object':
                self.data['target'].value_counts().plot(kind='pie', autopct='%1.1f%%')
                plt.title('Target Variable Distribution')
            else:
                self.data['target'].hist(bins=30, alpha=0.7, color='orange')
                plt.title('Target Variable Distribution')
                plt.xlabel('target')
                plt.ylabel('Frequency')
        
        plt.tight_layout()
        plt.savefig('comprehensive_visualizations.png', dpi=300, bbox_inches='tight')
        print("✅ Comprehensive visualizations saved as 'comprehensive_visualizations.png'")
        
        # Create individual detailed plots
        self.create_detailed_plots()
        
    def create_detailed_plots(self):
        """Create individual detailed plots"""
        print("📈 Creating detailed individual plots...")
        
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        
        # Detailed correlation analysis
        if len(numeric_cols) > 1:
            plt.figure(figsize=(12, 8))
            correlation_matrix = self.data[numeric_cols].corr()
            mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))
            sns.heatmap(correlation_matrix, mask=mask, annot=True, cmap='RdYlBu_r', center=0,
                       square=True, linewidths=0.5, cbar_kws={"shrink": 0.5})
            plt.title('Detailed Correlation Analysis', fontsize=16)
            plt.tight_layout()
            plt.savefig('detailed_correlation.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # Distribution comparison
        if len(numeric_cols) > 0:
            n_cols = min(4, len(numeric_cols))
            fig, axes = plt.subplots(2, 2, figsize=(15, 10))
            axes = axes.ravel()
            
            for i, col in enumerate(numeric_cols[:4]):
                axes[i].hist(self.data[col], bins=30, alpha=0.7, density=True, color=f'C{i}')
                axes[i].axvline(self.data[col].mean(), color='red', linestyle='--', label='Mean')
                axes[i].axvline(self.data[col].median(), color='green', linestyle='--', label='Median')
                axes[i].set_title(f'Distribution Analysis: {col}')
                axes[i].legend()
                axes[i].grid(True, alpha=0.3)
            
            plt.tight_layout()
            plt.savefig('distribution_analysis.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        print("✅ Detailed plots saved successfully")
        
    def generate_insights_report(self):
        """Generate insights report"""
        print("📝 Generating insights report...")
        
        insights = []
        
        # Basic statistics
        insights.append("DATASET INSIGHTS REPORT")
        insights.append("=" * 50)
        insights.append(f"Dataset Shape: {self.data.shape[0]} rows × {self.data.shape[1]} columns")
        insights.append(f"Memory Usage: {self.data.memory_usage(deep=True).sum() / 1024:.2f} KB")
        insights.append("")
        
        # Column analysis
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        
        insights.append(f"Numeric Columns ({len(numeric_cols)}): {', '.join(numeric_cols)}")
        insights.append(f"Categorical Columns ({len(categorical_cols)}): {', '.join(categorical_cols)}")
        insights.append("")
        
        # Missing values analysis
        missing_data = self.data.isnull().sum()
        if missing_data.sum() > 0:
            insights.append("MISSING VALUES:")
            for col, missing in missing_data[missing_data > 0].items():
                percentage = (missing / len(self.data)) * 100
                insights.append(f"  {col}: {missing} ({percentage:.1f}%)")
        else:
            insights.append("✅ No missing values detected")
        insights.append("")
        
        # Correlation insights
        if len(numeric_cols) > 1:
            corr_matrix = self.data[numeric_cols].corr()
            high_corr_pairs = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if abs(corr_val) > 0.7:
                        high_corr_pairs.append((corr_matrix.columns[i], corr_matrix.columns[j], corr_val))
            
            if high_corr_pairs:
                insights.append("HIGH CORRELATIONS (>0.7):")
                for col1, col2, corr in high_corr_pairs:
                    insights.append(f"  {col1} ↔ {col2}: {corr:.3f}")
            else:
                insights.append("No high correlations detected")
            insights.append("")
        
        # Save report
        with open('insights_report.txt', 'w') as f:
            f.write("\\n".join(insights))
        
        print("✅ Insights report saved as 'insights_report.txt'")
        
    def run_visualization(self):
        """Main method to run complete visualization"""
        print("🎨 Starting Comprehensive Data Visualization...")
        print(f"📝 User Request: {self.user_prompt}")
        
        self.create_comprehensive_visualizations()
        self.generate_insights_report()
        
        print("🎉 Data Visualization Complete!")

# Run the visualization
if __name__ == "__main__":
    visualizer = DataVisualizer()
    visualizer.run_visualization()
`.trim();
}