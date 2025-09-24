import React from 'react';
import Navbar from '../components/layout/navbar';
import AutoMLFooter from '@/components/automl-footer';

export default function MLModelsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-4xl font-bold mb-8" style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          ML Models
        </h1>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Random Forest</h3>
              <p className="text-muted-foreground text-sm mb-2">Accuracy: 94.2%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">XGBoost</h3>
              <p className="text-muted-foreground text-sm mb-2">Accuracy: 91.8%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '91%'}}></div>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Neural Network</h3>
              <p className="text-muted-foreground text-sm mb-2">Accuracy: 89.5%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '89%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AutoMLFooter />
    </div>
  );
}