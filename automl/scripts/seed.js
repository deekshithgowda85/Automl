import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // First, let's create a test user (you'll need to replace this with your actual Clerk user ID)
  // To get your Clerk user ID, sign in to your app and check the browser console or Clerk dashboard
  
  // Replace this with your actual Clerk user ID
  const testClerkUserId = 'user_339h0sEJhVmRoFOQlobAIulxp9t'; // Your actual Clerk ID
  const testUserEmail = 'deekshiharsha2185@gmail.com'; // Your email
  const testUserName = 'Deekshi Harsha'; // Your name

  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId: testClerkUserId }
    });

    if (!user) {
      console.log('👤 Creating test user...');
      user = await prisma.user.create({
        data: {
          clerkId: testClerkUserId,
          email: testUserEmail,
          name: testUserName,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        }
      });
      console.log('✅ User created:', user.name);
    } else {
      console.log('✅ User already exists:', user.name);
    }

    // Create 2 datasets
    console.log('📊 Creating datasets...');
    
    const dataset1 = await prisma.dataset.create({
      data: {
        name: 'Customer Segmentation Data',
        description: 'E-commerce customer behavior and purchase history for segmentation analysis',
        fileName: 'customer_segmentation.csv',
        filePath: '/uploads/datasets/customer_segmentation.csv',
        fileSize: 15728640, // ~15MB
        fileType: 'csv',
        columns: [
          'customer_id', 'age', 'gender', 'income', 'spending_score', 
          'purchase_frequency', 'avg_order_value', 'days_since_last_purchase',
          'preferred_category', 'loyalty_score'
        ],
        rowCount: 50000,
        userId: user.id
      }
    });

    const dataset2 = await prisma.dataset.create({
      data: {
        name: 'House Price Prediction',
        description: 'Real estate data with property features and market prices for prediction modeling',
        fileName: 'house_prices.csv',
        filePath: '/uploads/datasets/house_prices.csv',
        fileSize: 8456192, // ~8.5MB
        fileType: 'csv',
        columns: [
          'property_id', 'bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot',
          'floors', 'waterfront', 'view', 'condition', 'grade', 'sqft_above',
          'sqft_basement', 'yr_built', 'yr_renovated', 'zipcode', 'lat', 'long', 'price'
        ],
        rowCount: 21613,
        userId: user.id
      }
    });

    console.log('✅ Created datasets:', dataset1.name, 'and', dataset2.name);

    // Create 3 ML models
    console.log('🧠 Creating ML models...');

    const model1 = await prisma.mLModel.create({
      data: {
        name: 'Customer Segmentation Classifier',
        description: 'K-means clustering model to segment customers into distinct groups based on purchasing behavior and demographics',
        algorithm: 'K-Means Clustering',
        modelType: 'clustering',
        accuracy: 87.5,
        precision: 89.2,
        recall: 85.8,
        f1Score: 87.4,
        hyperParams: {
          n_clusters: 5,
          init: 'k-means++',
          max_iter: 300,
          random_state: 42,
          n_init: 10
        },
        pklFileName: 'customer_segmentation_kmeans.pkl',
        pklFilePath: '/uploads/models/customer_segmentation_kmeans.pkl',
        pklFileSize: 2048576, // ~2MB
        trainingTime: 45000, // 45 seconds
        isPublic: true,
        downloadCount: 12,
        userId: user.id,
        datasetId: dataset1.id
      }
    });

    const model2 = await prisma.mLModel.create({
      data: {
        name: 'House Price Predictor',
        description: 'Random Forest regression model to predict house prices based on property features and location data',
        algorithm: 'Random Forest Regressor',
        modelType: 'regression',
        accuracy: 94.3,
        precision: null, // Not applicable for regression
        recall: null, // Not applicable for regression
        f1Score: null, // Not applicable for regression
        hyperParams: {
          n_estimators: 100,
          max_depth: 10,
          min_samples_split: 2,
          min_samples_leaf: 1,
          random_state: 42,
          n_jobs: -1
        },
        pklFileName: 'house_price_random_forest.pkl',
        pklFilePath: '/uploads/models/house_price_random_forest.pkl',
        pklFileSize: 15728640, // ~15MB
        trainingTime: 120000, // 2 minutes
        isPublic: true,
        downloadCount: 28,
        userId: user.id,
        datasetId: dataset2.id
      }
    });

    const model3 = await prisma.mLModel.create({
      data: {
        name: 'Advanced Customer Classifier',
        description: 'XGBoost classification model to predict customer lifetime value and churn probability with high accuracy',
        algorithm: 'XGBoost Classifier',
        modelType: 'classification',
        accuracy: 96.1,
        precision: 95.8,
        recall: 96.4,
        f1Score: 96.1,
        hyperParams: {
          n_estimators: 200,
          max_depth: 6,
          learning_rate: 0.1,
          subsample: 0.8,
          colsample_bytree: 0.8,
          random_state: 42,
          eval_metric: 'logloss'
        },
        pklFileName: 'customer_xgboost_classifier.pkl',
        pklFilePath: '/uploads/models/customer_xgboost_classifier.pkl',
        pklFileSize: 5242880, // ~5MB
        trainingTime: 180000, // 3 minutes
        isPublic: false,
        downloadCount: 5,
        userId: user.id,
        datasetId: dataset1.id
      }
    });

    console.log('✅ Created ML models:');
    console.log('  -', model1.name, `(${model1.accuracy}% accuracy)`);
    console.log('  -', model2.name, `(${model2.accuracy}% accuracy)`);
    console.log('  -', model3.name, `(${model3.accuracy}% accuracy)`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`  - User: ${user.name} (${user.email})`);
    console.log(`  - Datasets: 2`);
    console.log(`  - ML Models: 3`);
    console.log(`  - Total records: ${dataset1.rowCount + dataset2.rowCount} rows`);
    console.log('\n💡 Note: Make sure to update the testClerkUserId variable with your actual Clerk user ID');
    console.log('    You can find this in your browser console when signed in, or in the Clerk dashboard');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });