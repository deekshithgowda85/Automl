Write-Host "🚀 Setting up ML Model Templates..." -ForegroundColor Green

# Generate Prisma client
Write-Host "📦 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Push schema to database (for development)
Write-Host "📊 Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

# Run seed script
Write-Host "🌱 Seeding database with ML model templates..." -ForegroundColor Yellow
npm run db:seed

Write-Host "✅ Setup complete!" -ForegroundColor Green