# AutoML Dashboard - Gemini AI Setup

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API key"
3. Copy the generated API key

### 2. Configure Environment Variables

1. Open `.env.local` file in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Start the Application

```bash
npm run dev
```

### 4. Test the Integration

1. Navigate to `/dashboard`
2. Start chatting with the AI assistant
3. Try asking questions like:
   - "What's the difference between Random Forest and XGBoost?"
   - "How do I handle missing data in my dataset?"
   - "Explain cross-validation"

## Features

- **Real-time Chat**: Chat with Gemini AI directly in your dashboard
- **ML Expertise**: Get expert advice on machine learning concepts
- **Context Awareness**: The AI remembers your conversation history
- **Clean UI**: Professional ChatGPT-style interface with dark/light themes

## Troubleshooting

### Error: "Invalid or missing Google API key"

- Make sure you've set the `GOOGLE_API_KEY` in `.env.local`
- Restart your development server after adding the API key
- Verify the API key is correct from Google AI Studio

### Error: "API quota exceeded"

- You've reached your free tier limits
- Wait for the quota to reset or upgrade to a paid plan

### Connection Issues

- Check your internet connection
- Verify the API key has the correct permissions
- Make sure `.env.local` is in the project root directory

## Next Steps

Your AutoML dashboard is now ready with Gemini AI integration! You can:

1. Expand the AI prompts for more specific ML guidance
2. Add more specialized ML tools and calculators
3. Integrate with ML libraries for actual model training
4. Add file upload for dataset analysis

Happy machine learning! 🤖✨
