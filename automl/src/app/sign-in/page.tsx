'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Sign in to your AutoML account</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-1">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none w-full",
                headerTitle: "text-2xl font-bold text-slate-900 dark:text-slate-100",
                headerSubtitle: "text-slate-600 dark:text-slate-400",
                socialButtonsBlockButton: "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-slate-200 dark:bg-slate-700",
                dividerText: "text-slate-500 dark:text-slate-400",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200",
                formFieldInput: "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                identityPreviewText: "text-slate-600 dark:text-slate-400",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                footerActionText: "text-slate-600 dark:text-slate-400",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200",
                otpCodeFieldInput: "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
                formResendCodeLink: "text-blue-600 hover:text-blue-700",
                alertText: "text-red-600 dark:text-red-400",
                formFieldWarningText: "text-amber-600 dark:text-amber-400"
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false
              }
            }}
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
          />
        </div>

        <div className="text-center mt-6 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Powered by </span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Clerk</span>
          <span className="text-slate-600 dark:text-slate-400"> - Enterprise Authentication</span>
        </div>
      </div>
    </div>
  );
}