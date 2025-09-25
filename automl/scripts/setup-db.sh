#!/bin/bash

echo "🚀 Setting up ML Model Templates..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database (for development)
echo "📊 Pushing schema to database..."
npx prisma db push --accept-data-loss

# Run seed script
echo "🌱 Seeding database with ML model templates..."
npm run db:seed

echo "✅ Setup complete!"