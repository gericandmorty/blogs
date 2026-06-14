'use client';

import React from 'react';
import Navbar from '../components/navbar/landing/Navbar';
import Hero from './_components/Hero';
import Features from './_components/Features';
import Footer from '../components/footer/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-150">
      {/* Landing specific header */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <Hero />
        <Features />
      </main>

      {/* Landing specific footer */}
      <Footer />
    </div>
  );
}
