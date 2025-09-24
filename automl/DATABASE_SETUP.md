# AutoML Platform Database Setup

This guide will help you set up the Prisma database for the AutoML platform.

## Prerequisites

1. PostgreSQL database running locally or remotely
2. Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @prisma/client prisma
```

### 2. Environment Variables

Copy `.env.example` to `.env` and update the database URL:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in your `.env` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/automl_db?schema=public"
```

### 3. Initialize Database

Generate Prisma client:

```bash
npm run db:generate
```

Push the schema to your database:

```bash
npm run db:push
```

Or create a migration (for production):

```bash
npm run db:migrate
```

### 4. View Database (Optional)

Launch Prisma Studio to view your data:

```bash
npm run db:studio
```

## Database Schema

The schema includes:

- **User**: User accounts with authentication
- **Dataset**: Uploaded CSV/JSON files with metadata
- **MLModel**: Trained ML models with .pkl files
- **Conversation**: Chat conversations
- **Message**: Individual chat messages

## Usage in Code

```typescript
import { prisma } from "@/lib/prisma";

// Create a new dataset
const dataset = await prisma.dataset.create({
  data: {
    name: "Iris Dataset",
    fileName: "iris.csv",
    filePath: "/uploads/iris.csv",
    fileSize: 1024,
    fileType: "csv",
    userId: "user_id_here",
  },
});

// Create a new ML model
const model = await prisma.mLModel.create({
  data: {
    name: "Iris Classifier",
    algorithm: "RandomForest",
    modelType: "classification",
    pklFileName: "iris_model.pkl",
    pklFilePath: "/models/iris_model.pkl",
    pklFileSize: 2048,
    userId: "user_id_here",
    datasetId: dataset.id,
  },
});
```

## Next Steps

1. Install Prisma packages: `npm install`
2. Set up your database connection
3. Run `npm run db:push` to create tables
4. Start using the database in your API routes
