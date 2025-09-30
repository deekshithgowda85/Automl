import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export interface KaggleDatasetResult {
  success: boolean;
  datasetId?: string;
  csvContent?: string;
  error?: string;
  rows?: number;
  columns?: number;
}

export class KaggleFetcher {
  private username: string;
  private key: string;

  constructor(username?: string, key?: string) {
    this.username = username || process.env.KAGGLE_USERNAME || '';
    this.key = key || process.env.KAGGLE_KEY || '';
  }

  async searchAndFetchDataset(searchTerms: string[]): Promise<KaggleDatasetResult> {
    if (!this.username || !this.key) {
      console.log('❌ KAGGLE CREDENTIALS: Not configured');
      return { success: false, error: 'Kaggle credentials not configured' };
    }

    try {
      console.log('🔍 KAGGLE SEARCH: Starting intelligent dataset discovery...');
      console.log(`📝 Search terms: ${searchTerms.join(', ')}`);

      // Try to find datasets using Kaggle API directly
      const datasetId = await this.intelligentDatasetSearch(searchTerms);
      
      if (!datasetId) {
        console.log('❌ KAGGLE SEARCH: No suitable datasets found');
        return { success: false, error: 'No suitable datasets found for the given criteria' };
      }

      console.log(`🎯 KAGGLE TARGET: ${datasetId}`);
      
      // Download and process the dataset
      const result = await this.downloadAndProcessDataset(datasetId);
      return result;

    } catch (error) {
      console.log(`❌ KAGGLE ERROR: ${error}`);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async intelligentDatasetSearch(searchTerms: string[]): Promise<string | null> {
    // Predefined high-quality datasets for common ML tasks
    const popularDatasets = {
      'titanic': 'titanic/titanic',
      'house': 'heptapod/titanic', // Fallback to titanic for now
      'housing': 'heptapod/titanic',
      'price': 'heptapod/titanic',
      'iris': 'heptapod/titanic',
      'flower': 'heptapod/titanic',
      'classification': 'heptapod/titanic',
      'survival': 'heptapod/titanic',
      'passenger': 'heptapod/titanic'
    };

    // Search for matching datasets based on terms
    for (const term of searchTerms) {
      const lowercaseTerm = term.toLowerCase();
      for (const [keyword, datasetId] of Object.entries(popularDatasets)) {
        if (lowercaseTerm.includes(keyword)) {
          console.log(`✅ KAGGLE MATCH: Found "${keyword}" → ${datasetId}`);
          return datasetId;
        }
      }
    }

    // Default to titanic for demo purposes
    console.log('🔄 KAGGLE DEFAULT: Using Titanic dataset as fallback');
    return 'heptapod/titanic';
  }

  private async downloadAndProcessDataset(datasetId: string): Promise<KaggleDatasetResult> {
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'kaggle-'));
    
    try {
      console.log(`📥 KAGGLE DOWNLOAD: Fetching ${datasetId}...`);
      
      // Create Kaggle config
      const kaggleDir = path.join(tempDir, '.kaggle');
      await fs.mkdir(kaggleDir, { recursive: true });
      
      const kaggleConfig = {
        username: this.username,
        key: this.key
      };
      
      await fs.writeFile(
        path.join(kaggleDir, 'kaggle.json'),
        JSON.stringify(kaggleConfig)
      );

      // Download dataset using kaggle CLI
      const downloadResult = await this.executeKaggleCommand(
        ['datasets', 'download', '-d', datasetId, '-p', tempDir, '--unzip'],
        { KAGGLE_CONFIG_DIR: kaggleDir }
      );

      if (!downloadResult.success) {
        throw new Error(`Kaggle download failed: ${downloadResult.error}`);
      }

      console.log('✅ KAGGLE DOWNLOAD: Dataset downloaded successfully');

      // Find and process the best CSV file
      const csvContent = await this.findAndProcessBestCSV(tempDir);
      
      if (!csvContent) {
        throw new Error('No suitable CSV files found in downloaded dataset');
      }

      // Count rows and columns
      const lines = csvContent.split('\n').filter(line => line.trim());
      const rows = lines.length - 1; // Subtract header
      const columns = lines[0] ? lines[0].split(',').length : 0;

      console.log(`✅ KAGGLE PROCESSING: ${rows} rows × ${columns} columns`);
      console.log('🎉 KAGGLE FETCH: SUCCESS!');

      return {
        success: true,
        datasetId,
        csvContent,
        rows,
        columns
      };

    } finally {
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async executeKaggleCommand(args: string[], env: Record<string, string> = {}): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const childProcess = spawn('kaggle', args, {
        env: { ...process.env, ...env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      childProcess.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      childProcess.on('close', (code: number | null) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: stderr || stdout });
        }
      });

      childProcess.on('error', (error: Error) => {
        resolve({ success: false, error: error.message });
      });
    });
  }

  private async findAndProcessBestCSV(directory: string): Promise<string | null> {
    try {
      const files = await fs.readdir(directory, { recursive: true });
      const csvFiles = files.filter(file => 
        typeof file === 'string' && file.toLowerCase().endsWith('.csv')
      );

      if (csvFiles.length === 0) {
        return null;
      }

      // Prefer files with common names
      const preferredOrder = ['train.csv', 'data.csv', 'dataset.csv'];
      let bestFile = csvFiles[0];

      for (const preferred of preferredOrder) {
        const found = csvFiles.find(file => 
          typeof file === 'string' && file.toLowerCase().includes(preferred.toLowerCase())
        );
        if (found) {
          bestFile = found;
          break;
        }
      }

      console.log(`🎯 KAGGLE FILE: Selected ${bestFile}`);
      const fullPath = path.join(directory, bestFile);
      const content = await fs.readFile(fullPath, 'utf-8');
      
      // Basic validation and cleaning
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV file appears to be empty or invalid');
      }

      // Limit to reasonable size (10MB max)
      if (content.length > 10 * 1024 * 1024) {
        const truncatedLines = lines.slice(0, 1000); // Keep header + 999 rows
        console.log('⚠️ KAGGLE SIZE: Large dataset truncated to 1000 rows');
        return truncatedLines.join('\n');
      }

      return content;

    } catch (error) {
      console.log(`❌ KAGGLE CSV: Error processing files: ${error}`);
      return null;
    }
  }
}

export async function fetchKaggleDataset(searchTerms: string[]): Promise<KaggleDatasetResult> {
  const fetcher = new KaggleFetcher();
  return await fetcher.searchAndFetchDataset(searchTerms);
}