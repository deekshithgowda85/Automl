# 🤖 AutoML Platform - Intelligent Machine Learning Model Builder

![AutoML Banner](public/banner.jpg)

> **Democratizing Machine Learning through Automated Model Development and Deployment**

<!-- GitHub Badges -->
<div align="center">

![GitHub stars](https://img.shields.io/github/stars/deekshithgowda85/automl?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/deekshithgowda85/automl?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/deekshithgowda85/automl?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/deekshithgowda85/automl?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/deekshithgowda85/automl?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

---



---

## 🚀 Vision & Mission

AutoML Platform revolutionizes machine learning by making it accessible to everyone, regardless of technical expertise. Our mission is to build an intuitive platform that automates the entire ML pipeline - from data preprocessing to model deployment - enabling users to focus on solving business problems rather than technical complexities.

---

## 🛠️ Features

- **User Authentication:** Secure authentication with Clerk
- **Dataset Management:** Upload, analyze, and manage datasets
- **Automated ML:** One-click model training with multiple algorithms
- **Model Analytics:** Performance metrics and visualization
- **AI Chat Assistant:** Powered by Google Gemini for ML guidance
- **Magic Path:** Intelligent workflow suggestions
- **Model Export:** Download trained models as .pkl files
- **Public Gallery:** Browse and download community models

---

## 🧑‍💻 Tech Stack

| Layer              | Technology                                             |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | Next.js 15, React 19, TypeScript, Tailwind CSS 4       |
| **Backend**        | Next.js API Routes, Prisma ORM, PostgreSQL             |
| **Database**       | PostgreSQL (Neon), Prisma Client                       |
| **Authentication** | Clerk (JWT-based)                                      |
| **ML Engine**      | Python, E2B Sandboxes, scikit-learn, pandas            |
| **AI Assistant**   | Google Gemini API                                      |
| **UI Components**  | Radix UI, Framer Motion, Lucide React                  |
| **Styling**        | Tailwind CSS, CSS Custom Properties (Dark/Light Theme) |
| **File Handling**  | JSZip, File Upload API                                 |

---

## 🏗️ System Architecture

### Complete Application Flow

```mermaid
graph TB
    subgraph "Client Side"
        A[Next.js Frontend]
        B[React Components]
        C[Tailwind UI]
    end

    subgraph "Authentication"
        D[Clerk Auth]
        E[JWT Middleware]
    end

    subgraph "API Layer"
        F[Next.js API Routes]
        G[Prisma ORM]
        H[Google Gemini AI]
        I[E2B Sandbox]
    end

    subgraph "Data Layer"
        J[(PostgreSQL/Neon)]
        K[File Storage]
        L[Model Storage]
    end

    subgraph "ML Engine"
        M[Python Runtime]
        N[scikit-learn]
        O[pandas/numpy]
        P[Model Training]
    end

    A --> D
    A --> F
    B --> C
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    G --> J
    I --> M
    M --> N
    M --> O
    N --> P
    P --> L

    style A fill:#000000
    style F fill:#000000
    style J fill:#336791
    style M fill:#3776AB
```

### Database Schema (PostgreSQL)

```mermaid
erDiagram
    Users {
        string id PK
        string clerkId
        string email
        string name
        string avatar
        timestamp createdAt
        timestamp updatedAt
    }

    Datasets {
        string id PK
        string name
        string description
        string fileName
        string filePath
        int fileSize
        string fileType
        json columns
        int rowCount
        string userId FK
        timestamp createdAt
        timestamp updatedAt
    }

    MLModels {
        string id PK
        string name
        string description
        string algorithm
        string modelType
        float accuracy
        float precision
        float recall
        float f1Score
        json hyperParams
        string pklFileName
        string pklFilePath
        int pklFileSize
        int trainingTime
        boolean isPublic
        int downloadCount
        string userId FK
        string datasetId FK
        timestamp createdAt
        timestamp updatedAt
    }

    Conversations {
        string id PK
        string title
        string userId FK
        timestamp createdAt
        timestamp updatedAt
    }

    Messages {
        string id PK
        string content
        enum type
        string modelUsed
        int tokens
        string conversationId FK
        timestamp timestamp
    }

    MLModelTemplates {
        string id PK
        string slug
        string name
        string author
        string description
        string shortDesc
        string category
        string difficulty
        float accuracy
        string downloads
        int likes
        string lastUpdated
        string license
        json tags
        string iconName
        boolean isPopular
        string gradient
        float popularity
        string trainingTime
        string users
        json useCases
        json features
        json advantages
        json howItWorks
        json bestFor
        json parameters
        string codeExample
        timestamp createdAt
        timestamp updatedAt
    }

    Users ||--o{ Datasets : creates
    Users ||--o{ MLModels : trains
    Users ||--o{ Conversations : has
    Datasets ||--o{ MLModels : used_for
    Conversations ||--o{ Messages : contains
    MLModels }o--|| Datasets : trained_on
```

### ML Pipeline Integration

```mermaid
graph LR
    A[Dataset Upload] --> B[Data Validation]
    B --> C[Preprocessing]
    C --> D[E2B Sandbox API]
    D --> E[Python ML Training]
    E --> F[Model Generation]
    F --> G[Performance Metrics]

    style D fill:#3776AB
    style E fill:#FF6B6B
```

---

## 📦 Project Structure

```
automl/
├── 📁 public/                      # Static assets
│   ├── file.svg                   # File icon
│   ├── globe.svg                  # Globe icon
│   ├── next.svg                   # Next.js logo
│   ├── vercel.svg                 # Vercel logo
│   └── window.svg                 # Window icon
├── 📁 prisma/                     # Database schema & migrations
│   ├── schema.prisma              # Prisma schema definition
│   └── migrations/                # Database migration files
│       ├── migration_lock.toml    # Migration lock file
│       └── 20250924172343_*/      # Migration folders
├── 📁 sandbox-python/             # Python ML environment
│   └── python/                    # E2B Python sandbox config
│       ├── e2b.Dockerfile        # Docker environment
│       └── e2b.toml              # E2B configuration
├── 📁 scripts/                    # Utility scripts
│   ├── seed.js                   # Database seeding script
│   ├── SEED_README.md            # Seeding instructions
│   ├── setup-db.ps1              # PowerShell DB setup
│   └── setup-db.sh               # Bash DB setup
├── 📁 src/
│   ├── middleware.ts              # Next.js middleware
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── favicon.ico           # App favicon
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── 📁 api/               # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── chat/             # AI chat endpoints
│   │   │   ├── create-model/     # Model creation API
│   │   │   ├── datasets/         # Dataset management
│   │   │   │   ├── route.ts      # Main dataset API
│   │   │   │   ├── [id]/         # Individual dataset routes
│   │   │   │   ├── analyze/      # Dataset analysis
│   │   │   │   └── kaggle/       # Kaggle integration
│   │   │   ├── download-model/   # Model download API
│   │   │   ├── ml-templates/     # ML template API
│   │   │   ├── test/             # Testing endpoints
│   │   │   ├── test-model/       # Model testing API
│   │   │   ├── user/             # User management
│   │   │   │   └── profile/      # User profile API
│   │   │   └── webhooks/         # Webhook handlers
│   │   │       └── clerk/        # Clerk webhooks
│   │   ├── 📁 components/        # Shared components
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── aichat.tsx    # AI chat component
│   │   │   │   └── navbar.tsx    # Navigation bar
│   │   │   └── providers/        # Context providers
│   │   │       └── theme-provider.tsx # Theme context
│   │   ├── 📁 dashboard/         # Dashboard pages
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── 📁 datasets/          # Dataset pages
│   │   │   ├── page.tsx          # Dataset listing
│   │   │   └── [...slug]/        # Dynamic dataset routes
│   │   │       └── page.tsx      # Dataset detail page
│   │   ├── 📁 magic-path/        # Magic Path feature
│   │   │   └── page.tsx          # Magic Path interface
│   │   ├── 📁 mlmodels/          # ML model pages
│   │   │   ├── page.tsx          # Model listing
│   │   │   └── [id]/             # Individual model pages
│   │   │       └── page.tsx      # Model detail page
│   │   ├── 📁 profile/           # User profile
│   │   │   └── page.tsx          # Profile dashboard
│   │   ├── 📁 sign-in/           # Authentication
│   │   │   ├── page.tsx          # Sign in page
│   │   │   └── sso-callback/     # SSO callback
│   │   │       └── page.tsx      # SSO handler
│   │   └── 📁 sign-up/           # Registration
│   │       ├── page.tsx          # Sign up page
│   │       └── sso-callback/     # SSO callback
│   │           └── page.tsx      # SSO handler
│   ├── 📁 components/            # Reusable components
│   │   ├── automl-footer.tsx     # Footer component
│   │   ├── Homelanding.tsx       # Landing page component
│   │   ├── theme-toggle.tsx      # Theme switcher
│   │   └── ui/                   # UI component library
│   │       ├── button.tsx        # Button component
│   │       ├── input.tsx         # Input component
│   │       ├── separator.tsx     # Separator component
│   │       ├── sheet.tsx         # Sheet component
│   │       ├── sidebar.tsx       # Sidebar component
│   │       ├── skeleton.tsx      # Skeleton loader
│   │       └── tooltip.tsx       # Tooltip component
│   ├── 📁 hooks/                 # Custom React hooks
│   │   └── use-mobile.ts         # Mobile detection hook
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── kaggle.ts             # Kaggle integration
│   │   ├── ml-models-data.ts     # ML model data utilities
│   │   ├── mock-datasets.ts      # Mock data generator
│   │   ├── prisma.ts             # Prisma client setup
│   │   └── utils.ts              # General utility functions
│   └── 📁 types/                 # TypeScript definitions
│       └── dataset.ts            # Dataset type definitions
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .env.local                    # Local environment overrides
├── .gitignore                    # Git ignore rules
├── components.json               # Shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies & scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/deekshithgowda85/automl.git
cd automl
```

### 2. Setup Environment Variables

Create a `.env` file in the root folder using the template below:

```ini
# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Google Gemini AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# E2B Sandbox (for ML model training)
E2B_API_KEY=your_e2b_api_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 🔐 Environment Setup Guide:

1. **PostgreSQL Database**: Use [Neon](https://neon.tech) or any PostgreSQL provider
2. **Clerk Authentication**: Create account at [clerk.com](https://clerk.com)
3. **Google Gemini AI**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **E2B Sandbox**: Sign up at [e2b.dev](https://e2b.dev) for ML model training

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Seed with sample data
npx tsx scripts/seed.js
```

### 5. Start Development Server

```bash
npm run dev        # Starts on http://localhost:3000
```

🎉 **Access the application at [http://localhost:3000](http://localhost:3000)**

---

## 🔧 Advanced Configuration

### PostgreSQL Setup (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `DATABASE_URL`
4. Database automatically scales and manages connections

### Clerk Authentication Setup

1. Create project at [clerk.com](https://clerk.com)
2. Configure sign-in/sign-up settings
3. Add your domain to allowed origins
4. Copy publishable and secret keys

### Production Deployment

- **Frontend & Backend**: Deploy to Vercel (recommended for Next.js)
- **Database**: Neon automatically handles production scaling
- **ML Training**: E2B provides scalable sandbox environments
- **AI Assistant**: Google Gemini scales automatically

---

## 🗂️ Architecture Diagrams

### High-Level System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 15 Frontend]
        B[React 19 Components]
        C[Tailwind CSS 4]
        D[TypeScript]
    end

    subgraph "Authentication Layer"
        E[Clerk Authentication]
        F[JWT Tokens]
        G[User Management]
    end

    subgraph "API Layer"
        H[Next.js API Routes]
        I[Prisma ORM]
        J[Google Gemini AI]
        K[E2B Sandbox API]
    end

    subgraph "Data Layer"
        L[(PostgreSQL/Neon)]
        M[File Storage]
        N[Model Storage]
        O[Conversation History]
    end

    subgraph "ML Pipeline"
        P[Data Processing]
        Q[Model Training]
        R[Performance Evaluation]
        S[Model Export]
    end

    A -->|Authentication| E
    A -->|API Calls| H
    B --> C
    C --> D
    E --> F
    F --> G
    H --> I
    H --> J
    H --> K
    I --> L
    K --> P
    P --> Q
    Q --> R
    R --> S
    S --> N

    style A fill:#000000,color:#fff
    style E fill:#6C47FF,color:#fff
    style H fill:#000000,color:#fff
    style L fill:#336791,color:#fff
    style K fill:#FF6B6B,color:#fff
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Open an issue with reproduction steps
- 💡 **Feature Requests**: Have an idea for new ML capabilities?
- 🔧 **Code Contributions**: Submit pull requests for bug fixes or features
- 📖 **Documentation**: Help improve our guides and API docs
- 🎨 **Design**: UI/UX improvements for better user experience
- 🤖 **ML Models**: Add new algorithms or improve existing ones

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-ml-feature`)
3. Make your changes
4. Run tests and ensure TypeScript compliance
5. Commit changes (`git commit -m 'Add amazing ML feature'`)
6. Push to branch (`git push origin feature/amazing-ml-feature`)
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Follow React/Next.js conventions

---

## 📊 Project Stats

![GitHub Contributors](https://img.shields.io/github/contributors/deekshithgowda85/automl?style=for-the-badge)
![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/deekshithgowda85/automl?style=for-the-badge)
![GitHub Repo Size](https://img.shields.io/github/repo-size/deekshithgowda85/automl?style=for-the-badge)

---

## 🛣️ Roadmap

- [ ] **Advanced ML Algorithms**: Deep learning models, neural networks
- [ ] **Cloud Deployment**: One-click model deployment to cloud platforms
- [ ] **Real-time Predictions**: API endpoints for live model inference
- [ ] **Model Versioning**: Track and manage different model versions
- [ ] **Collaborative Features**: Team workspaces and shared models
- [ ] **Advanced Visualizations**: Interactive model interpretation
- [ ] **AutoML Pipelines**: Complex multi-step ML workflows
- [ ] **Integration APIs**: Connect with popular ML tools and platforms

---

## 🏆 Acknowledgments

- **Next.js Team**: For the incredible React framework
- **Clerk**: For seamless authentication solutions
- **Neon**: For serverless PostgreSQL database
- **Google**: For Gemini AI API access
- **E2B**: For secure Python sandbox environments
- **Prisma**: For excellent database ORM
- **Open Source Community**: For amazing tools and libraries

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Show Your Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 📢 **Sharing** with the community
- 🐛 **Reporting** any issues you find

---

## 👥 Contributors & Credits

### 🤝 **Project Contributors**

<div align="center">

| Avatar                                                                                                 | Contributor         | GitHub Profile                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/deekshithgowda85.png" width="50" height="50" style="border-radius: 50%;"> | **Deekshith Gowda** | [![GitHub](https://img.shields.io/badge/GitHub-deekshithgowda85-black?style=flat&logo=github)](https://github.com/deekshithgowda85) |

</div>

### 🌟 **Special Thanks**

We extend our gratitude to:

- **🤖 AI Assistant**: For development guidance and code optimization
- **📚 ML Community**: For algorithms, best practices, and research papers
- **🎨 Design Inspiration**: Modern SaaS platforms and ML tools
- **🔧 Tool Providers**: GitHub, Vercel, Neon, Clerk, and all open-source libraries
- **👨‍🏫 Educators**: Online courses and tutorials that made this possible

### 🎯 **Want to Contribute?**

We welcome new contributors! Here's how you can help:

1. **🐛 Bug Reports**: Found an issue? [Open an issue](https://github.com/deekshithgowda85/automl/issues)
2. **💡 Feature Requests**: Have ML ideas? We'd love to hear them!
3. **🔧 Code Contributions**: Fork, develop, and submit a pull request
4. **📖 Documentation**: Help improve our guides and API documentation
5. **🎨 Design**: UI/UX improvements and better user experience
6. **🤖 ML Models**: Add new algorithms or optimize existing ones

### 📊 **Contribution Stats**

![Contributors](https://img.shields.io/github/contributors/deekshithgowda85/automl?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/m/deekshithgowda85/automl?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/deekshithgowda85/automl?style=for-the-badge)

---

## 💡 Contact & Support

<div align="center">

### 📧 For questions or support, please open an issue:

<div align="center">

[![Issues](https://img.shields.io/badge/ISSUES-AUTOML%20PROJECT-0969DA?style=for-the-badge&logo=github)](https://github.com/deekshithgowda85/automl/issues)

### Connect with the Team:

- 🌟 **Star** the repository to show support
- 🐛 **Report issues** for bugs or improvements
- 💬 **Discussions** for questions and ML ideas
- 🚀 **Fork** to contribute to the project
- 📧 **Email**: deekshiharsha2185@gmail.com

</div>
