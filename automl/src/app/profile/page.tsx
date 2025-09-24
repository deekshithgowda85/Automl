import React from 'react';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div>page</div>
      </main>
      <Footer />
    </div>
  );
}