import React from 'react';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-4xl font-bold mb-8" style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          Profile
        </h1>
        <div className="max-w-2xl mx-auto px-4">
          <div className="p-8 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">DS</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Data Scientist</h2>
              <p className="text-muted-foreground">AutoML Platform User</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Models Trained:</span>
                <span className="text-foreground font-semibold">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Datasets Processed:</span>
                <span className="text-foreground font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experiments Run:</span>
                <span className="text-foreground font-semibold">156</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}