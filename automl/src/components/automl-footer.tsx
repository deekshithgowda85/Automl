'use client'

import Link from "next/link"

export default function AutoMLFooter() {
  return (
    <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-8 md:px-16 lg:px-24 xl:px-32 text-[13px] text-muted-foreground bg-background border-t border-border">
      <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
        <div className="flex items-center cursor-pointer">
          <div className="text-foreground text-2xl md:text-3xl font-extrabold tracking-widest select-none" style={{ letterSpacing: '0.15em', opacity: 0.8 }}>
            <span className="inline-block align-middle mr-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.12" />
                <path d="M8 24L24 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2.5"/>
              </svg>
            </span>
            AutoML
          </div>
        </div>

        <div>
          <p className="text-foreground font-semibold">Platform</p>
          <ul className="mt-2 space-y-2">
            <li><Link href="/datasets" className="hover:text-primary transition">Datasets</Link></li>
            <li><Link href="/mlmodels" className="hover:text-primary transition">ML Models</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary transition">Dashboard</Link></li>
            <li><Link href="/profile" className="hover:text-primary transition">Profile</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-foreground font-semibold">GitHub Contributors</p>
          <ul className="mt-2 space-y-2">
            <li><a href="https://github.com/deekshithgowda85/Automl/contributors" target="_blank" rel="noreferrer" className="hover:text-primary transition">View All Contributors</a></li>
            <li><a href="https://github.com/deekshithgowda85/Automl/issues" target="_blank" rel="noreferrer" className="hover:text-primary transition">Report Issues</a></li>
            <li><a href="https://github.com/deekshithgowda85/Automl/pulls" target="_blank" rel="noreferrer" className="hover:text-primary transition">Pull Requests</a></li>
            <li><a href="https://github.com/deekshithgowda85/Automl/wiki" target="_blank" rel="noreferrer" className="hover:text-primary transition">Documentation</a></li>
            <li><a href="https://github.com/deekshithgowda85/Automl/releases" target="_blank" rel="noreferrer" className="hover:text-primary transition">Releases</a></li>
          </ul>
        </div>

        <div>
          <p className="text-foreground font-semibold">Support</p>
          <ul className="mt-2 space-y-2">
            <li><Link href="/" className="hover:text-primary transition">Help Center</Link></li>
            <li><Link href="/" className="hover:text-primary transition">Contact Us</Link></li>
            <li><Link href="/" className="hover:text-primary transition">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:text-primary transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
        <p className="max-w-60 text-muted-foreground">
          Empowering everyone to build, train, and deploy machine learning models with ease.
        </p>

        <div className="flex items-center gap-4 mt-3">
          <a href="https://github.com/deekshithgowda85/Automl" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 hover:text-primary transition-colors"
              aria-hidden="true"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>

          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 hover:text-primary transition-colors"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect width="4" height="12" x="2" y="9"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          <a href="https://github.com/deekshithgowda85/Automl/stargazers" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-muted/20 hover:bg-muted/40 px-2 py-1 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-500"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Star us</span>
          </a>

          <a href="mailto:support@automl.com">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 hover:text-primary transition-colors"
              aria-hidden="true"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </a>
        </div>

        <p className="mt-3 text-center text-muted-foreground">
          © 2025 <span className="text-foreground font-semibold">AutoML Platform</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}