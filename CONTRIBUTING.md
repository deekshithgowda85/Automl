# Contributing to AutoML

Thank you for your interest in contributing to AutoML! We welcome contributions from everyone.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setting up the development environment

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/automl.git
   cd automl
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up the database:

   ```bash
   npm run db:setup
   # or run the setup script directly
   ./scripts/setup-db.sh
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

#### Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
3. The PR will be merged once you have the sign-off of at least one maintainer

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (we use ESLint and Prettier)
- Write meaningful commit messages
- Keep commits atomic (one feature/fix per commit)

### Testing

- Write tests for any new functionality
- Ensure all tests pass before submitting a PR
- Aim for good test coverage

## Development Workflow

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Add your meaningful commit message"
   ```

3. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

## Project Structure

```
automl/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── scripts/           # Build and setup scripts
```

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Deployment**: Vercel

## Getting Help

If you need help, you can:

- Open an issue with the `question` label
- Join our community discussions
- Check the documentation

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## License

By contributing to AutoML, you agree that your contributions will be licensed under the same license as the project.
