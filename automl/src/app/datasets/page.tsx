import React from 'react';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-4xl font-bold mb-8" style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          Datasets
        </h1>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Customer Data</h3>
              <p className="text-muted-foreground text-sm">2.1M records</p>
            </div>
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Sales Analytics</h3>
              <p className="text-muted-foreground text-sm">850K records</p>
            </div>
            <div className="p-6 rounded-lg border border-border" style={{background: 'var(--gradient-card)'}}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Product Catalog</h3>
              <p className="text-muted-foreground text-sm">125K records</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}