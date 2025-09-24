import React from 'react'

function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          AutoML Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Models</h2>
            <p className="text-muted-foreground">Manage your ML models</p>
          </div>
          <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Datasets</h2>
            <p className="text-muted-foreground">Upload and manage datasets</p>
          </div>
          <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Experiments</h2>
            <p className="text-muted-foreground">Track your experiments</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage