'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';
import Homelanding from '@/components/Homelanding';
import gsap from 'gsap';


const HomePage = () => {
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const bottomLeftCardRef = useRef<HTMLDivElement>(null);
  const bottomRightCardsRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Navigation function
  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  useEffect(() => {
    // Load GSAP dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      
      // Set initial states for cards with 3D transforms
      gsap.set([leftCardRef.current, rightCardRef.current, bottomLeftCardRef.current, bottomRightCardsRef.current], {
        opacity: 0,
        y: 100,
        rotationX: 15,
        rotationY: 0,
        z: -100,
        transformStyle: "preserve-3d"
      });

      // Animate cards in sequence with 3D effects
      const tl = gsap.timeline();
      
      tl.to(leftCardRef.current, {
        opacity: 1,
        y: 0,
        rotationX: 15,
        rotationY: 25,
        rotationZ: 12,
        z: 50,
        duration: 1.5,
        ease: "power3.out"
      })
      .to(rightCardRef.current, {
        opacity: 1,
        y: 0,
        rotationX: -15,
        rotationY: -20,
        rotationZ: -8,
        z: 30,
        duration: 1.5,
        ease: "power3.out"
      }, "-=1")
      .to(bottomLeftCardRef.current, {
        opacity: 1,
        y: 0,
        rotationX: 8,
        rotationY: 15,
        rotationZ: 6,
        z: 20,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8")
      .to(bottomRightCardsRef.current, {
        opacity: 1,
        y: 0,
        rotationX: -5,
        rotationY: -15,
        rotationZ: -3,
        z: 10,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.6");

      // Floating animation for cards
      gsap.to(leftCardRef.current, {
        y: "+=20",
        rotationZ: "+=3",
        duration: 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(rightCardRef.current, {
        y: "+=15",
        rotationZ: "-=2",
        duration: 5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(bottomLeftCardRef.current, {
        y: "+=12",
        rotationZ: "+=2",
        duration: 3.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Animate floating elements
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            y: `+=${Math.random() * 40 + 20}`,
            x: `+=${Math.random() * 30 - 15}`,
            duration: Math.random() * 3 + 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.4
          });
        }
      });

      // Mouse parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        gsap.to(leftCardRef.current, {
          rotationY: 25 + xPercent * 12,
          rotationX: 15 + yPercent * 8,
          duration: 0.6,
          ease: "power2.out"
        });

        gsap.to(rightCardRef.current, {
          rotationY: -20 + xPercent * 10,
          rotationX: -15 + yPercent * 6,
          duration: 0.6,
          ease: "power2.out"
        });

        gsap.to(bottomLeftCardRef.current, {
          rotationY: 15 + xPercent * 8,
          rotationX: 8 + yPercent * 4,
          duration: 0.6,
          ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // GSAP animations for hero section
      const heroTl = gsap.timeline();
      
      heroTl.fromTo('.hero-title', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      )
      .fromTo('.hero-subtitle', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8'
      )
      .fromTo('.hero-buttons', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4'
      );

      // Floating animation for components
      gsap.to('.floating-item', {
        y: -15,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
  <div className="min-h-screen bg-background text-foreground overflow-hidden relative transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section with 3D Cards */}
      <div
        className="min-h-screen relative overflow-hidden transition-colors duration-300"
        style={{ 
          perspective: '1200px', 
          marginTop: '0',
          background: 'hsl(var(--background))'
        }}
      >
        {/* Black and white gradient background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-gray-50/30 to-white/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-black/50"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-black/10 to-gray-500/10 dark:from-white/10 dark:to-gray-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-gray-600/10 to-black/10 dark:from-gray-300/10 dark:to-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-tr from-gray-400/20 to-gray-600/20 dark:from-gray-500/15 dark:to-gray-300/15 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* 3D AutoML Cards/Interfaces */}
        <div
          ref={leftCardRef}
          className="absolute z-10 top-[18%] left-[6%] w-80 h-96"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(15deg) rotateY(25deg) rotateZ(12deg)'
          }}
        >
          <div className="w-full h-full bg-background border border-border rounded-xl backdrop-blur-md shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-foreground text-sm font-medium">🤖 Model Training</span>
                <span className="text-muted-foreground text-xs">Active</span>
              </div>
              <div className="mb-8">
                <div className="text-3xl font-bold text-foreground">94.7%</div>
                <div className="text-muted-foreground text-sm">Training Accuracy</div>
              </div>
              <div className="h-40 bg-muted rounded-lg mb-6 relative overflow-hidden border border-border">
                <div className="absolute inset-0" style={{ background: 'var(--gradient-card)' }}></div>
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-2">
                  {[...Array(48)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`bg-muted rounded-sm ${Math.random() > 0.8 ? 'animate-pulse bg-foreground/20' : ''}`}
                      style={{animationDelay: `${Math.random() * 2}s`}}
                    ></div>
                  ))}
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                  Neural Network Training
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Epochs</span>
                  <span className="text-foreground font-medium">847/1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Models Trained</span>
                  <span className="text-foreground font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Score</span>
                  <span className="text-foreground font-medium">0.947</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={rightCardRef}
          className="absolute z-10 top-[22%] right-[6%] w-72 h-80"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-15deg) rotateY(-20deg) rotateZ(-8deg)'
          }}
        >
          <div className="w-full h-full bg-background border border-border rounded-xl backdrop-blur-md shadow-xl">
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-foreground text-sm font-medium">📊 Data Pipeline</span>
                <span className="text-muted-foreground text-xs bg-background px-2 py-1 rounded border border-border">LIVE</span>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-foreground">2.4M</div>
                <div className="text-muted-foreground text-sm">Records Processed</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <div className="text-foreground text-xl font-bold">12</div>
                  <div className="text-muted-foreground text-xs">Features</div>
                </div>
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <div className="text-foreground text-xl font-bold">8.9GB</div>
                  <div className="text-muted-foreground text-xs">Dataset Size</div>
                </div>
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <div className="text-foreground text-xl font-bold">99.1%</div>
                  <div className="text-muted-foreground text-xs">Data Quality</div>
                </div>
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <div className="text-foreground text-xl font-bold">7</div>
                  <div className="text-muted-foreground text-xs">Models</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Processing</span>
                  <span className="text-foreground">84%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 border border-border">
                  <div className="bg-foreground h-2 rounded-full relative" style={{width: '84%'}}>
                    <div className="absolute right-0 top-0 w-1 h-2 bg-background rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={bottomLeftCardRef}
          className="absolute z-10 bottom-[12%] left-[10%] w-64 h-32"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(8deg) rotateY(15deg) rotateZ(6deg)'
          }}
        >
          <div className="w-full h-full bg-background border border-green-500/30 rounded-xl backdrop-blur-md shadow-xl">
            <div className="p-4">
              <div className="text-green-600 text-sm mb-3 font-medium">🎯 AutoML Pipeline</div>
              <div className="text-foreground text-xl font-bold mb-1">Expert Level</div>
              <div className="text-muted-foreground text-xs mb-3">Model Optimization</div>
              <div className="w-full bg-muted rounded-full h-1.5 border border-green-500/30">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full animate-pulse" style={{width: '92%'}}></div>
              </div>
              <div className="text-right text-xs text-green-600 mt-1">92% Complete</div>
            </div>
          </div>
        </div>

        <div
          ref={bottomRightCardsRef}
          className="absolute z-10 bottom-[14%] right-[12%] space-y-3"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-5deg) rotateY(-15deg) rotateZ(-3deg)'
          }}
        >
          <div className="w-48 h-16 bg-background rounded-lg border border-blue-500/30 backdrop-blur-md shadow-xl">
            <div className="p-3 h-full flex items-center">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧠</span>
                  <div>
                    <div className="text-foreground text-sm font-medium">TensorFlow</div>
                    <div className="text-blue-600 text-xs">Deep Learning</div>
                  </div>
                </div>
                <div className="text-green-600 text-xs font-mono">READY</div>
              </div>
            </div>
          </div>
          
          <div className="w-48 h-16 bg-background rounded-lg border border-orange-500/30 backdrop-blur-md shadow-xl">
            <div className="p-3 h-full flex items-center">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔬</span>
                  <div>
                    <div className="text-foreground text-sm font-medium">Scikit-Learn</div>
                    <div className="text-orange-500 text-xs">ML Pipeline</div>
                  </div>
                </div>
                <div className="text-orange-500 text-xs font-mono">ACTIVE</div>
              </div>
            </div>
          </div>

          <div className="w-48 h-16 bg-background rounded-lg border border-purple-500/30 backdrop-blur-md shadow-xl">
            <div className="p-3 h-full flex items-center">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📈</span>
                  <div>
                    <div className="text-foreground text-sm font-medium">XGBoost</div>
                    <div className="text-purple-600 text-xs">Gradient Boost</div>
                  </div>
                </div>
                <div className="text-purple-600 text-xs font-mono">TRAIN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating ML Elements */}
        <div 
          ref={el => { floatingElementsRef.current[0] = el; }}
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-foreground rounded-full opacity-70 animate-pulse"
        ></div>
        <div 
          ref={el => { floatingElementsRef.current[1] = el; }}
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-muted-foreground rounded-full opacity-80"
        ></div>
        <div 
          ref={el => { floatingElementsRef.current[2] = el; }}
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-foreground rounded-full opacity-60 animate-pulse"
        ></div>
        <div 
          ref={el => { floatingElementsRef.current[3] = el; }}
          className="absolute top-20 right-1/3 w-1 h-1 bg-muted-foreground rounded-full opacity-50"
        ></div>
        
        {/* Additional decorative ML elements */}
        <div className="absolute top-16 right-1/3 text-foreground/20 text-xs transform rotate-45 font-mono select-none">
          AUTOML
        </div>
        <div className="absolute bottom-32 left-1/4 text-muted-foreground/30 text-xs transform -rotate-12 font-mono select-none">
          NEURAL
        </div>
        <div className="absolute top-1/4 right-16 text-foreground/20 text-xs transform rotate-90 font-mono select-none">
          PIPELINE
        </div>
        <div className="absolute bottom-1/4 left-20 text-muted-foreground/30 text-xs transform -rotate-45 font-mono select-none">
          OPTIMIZE
        </div>

        {/* Main Content (Heading, Subtitle, CTA) */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none pt-16">
          <div className="text-foreground text-sm mb-4 tracking-wider opacity-60 pointer-events-auto hero-subtitle">
            Automated Machine Learning • Enterprise Grade
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-bold text-center mb-8 leading-tight pointer-events-auto">
            <div className="text-foreground">AutoML Platform</div>
            <div style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
              Build. Train. Deploy.
            </div>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 text-center max-w-2xl leading-relaxed pointer-events-auto hero-subtitle">
            Accelerate your machine learning workflow with automated model selection, hyperparameter tuning, and deployment
          </p>
          <div className="hero-buttons flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-12 pointer-events-auto w-full md:w-auto px-4">
            <button
              className="w-full md:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/mlmodels')}
            >
              Start Training
            </button>
            <button
              className="w-full md:w-auto border-2 border-black hover:bg-black dark:border-white dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </button>
          </div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div 
            className="absolute inset-0 dark:hidden" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
          <div 
            className="absolute inset-0 hidden dark:block" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
      </div>
      <Homelanding />
      {/* Community Section - Updated for AutoML */}
      <div className="min-h-screen relative overflow-hidden transition-colors duration-300" style={{background: 'hsl(var(--background))'}}>
        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/50 dark:from-gray-950/50 dark:via-black/30 dark:to-gray-900/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating decorative elements */}
          <motion.div 
            className="floating-item absolute top-32 right-20 w-2 h-2 bg-foreground/60 rounded-full"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="floating-item absolute top-48 right-32 w-1 h-1 bg-muted-foreground/60 rounded-full"
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="floating-item absolute top-40 left-20 w-1.5 h-1.5 bg-foreground/60 rounded-full"
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-8 lg:px-16 pt-32 pb-20">
          {/* Navigation badges */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium">
              AI-Powered
            </div>
            <div className="bg-muted-foreground text-background px-4 py-2 rounded-full text-sm font-medium">
              AutoML
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Built for developers,
              <br />
              <span className="text-gradient">
                Loved by data scientists
              </span>
            </h1>
          </motion.div>

          {/* Feature cards section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
            
            {/* Left card - Developers */}
            <motion.div 
              className="relative w-80 h-96 bg-background border border-border rounded-3xl p-6 overflow-hidden shadow-professional"
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card header */}
              <div className="bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mb-6">
                <span className="text-foreground text-sm font-medium">Developers</span>
              </div>

              {/* Feature list */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                  <span className="text-sm">Easy API integration & deployment</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                  <span className="text-sm">Version control for ML models</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                  <span className="text-sm">Automated CI/CD pipelines</span>
                </div>
              </div>

              {/* Bottom decorative elements */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-foreground rounded-lg flex items-center justify-center">
                    <span className="text-background text-2xl">🐍</span>
                  </div>
                  
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-foreground text-2xl">🔥</span>
                  </div>

                  <div className="w-16 h-16 bg-foreground/80 rounded-lg flex items-center justify-center">
                    <span className="text-background text-2xl">📊</span>
                  </div>

                  <div className="w-16 h-16 bg-muted-foreground rounded-lg flex items-center justify-center">
                    <span className="text-background text-2xl">🚀</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center decorative elements */}
            <motion.div 
              className="hidden lg:flex flex-col items-center justify-center space-y-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {/* ML workflow visualization */}
              <div className="relative w-32 h-32">
                <motion.svg 
                  className="absolute inset-0 w-full h-full text-foreground/40" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 128 128"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M32 64C32 44 44 32 64 32C84 32 96 44 96 64" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M96 64C96 84 84 96 64 96C44 96 32 84 32 64" />
                </motion.svg>
                
                <div className="absolute top-2 right-8 w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-background rounded-full"></div>
                </div>
                
                <div className="absolute bottom-8 left-2 w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
                </div>
                
                <div className="absolute top-8 left-8 text-foreground/60">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Right card - Data Scientists */}
            <motion.div 
              className="relative w-80 h-96 bg-background border border-border rounded-3xl p-6 overflow-hidden shadow-professional"
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              whileHover={{ scale: 1.02, rotateY: -5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card header */}
              <div className="bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mb-8">
                <span className="text-foreground text-sm font-medium">Data Scientists</span>
              </div>

              {/* Feature list */}
              <div className="space-y-6">
                <div className="flex items-start gap-3 text-foreground">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm leading-relaxed">Advanced feature engineering tools</span>
                </div>
                <div className="flex items-start gap-3 text-foreground">
                  <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm leading-relaxed">Experiment tracking & model comparison</span>
                </div>
                <div className="flex items-start gap-3 text-foreground">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm leading-relaxed">Collaborative notebooks & workflows</span>
                </div>
              </div>

              {/* Performance metrics display */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Model Performance</span>
                    <span className="text-xs text-foreground font-mono">OPTIMAL</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">0.94</div>
                      <div className="text-xs text-muted-foreground">F1</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">0.91</div>
                      <div className="text-xs text-muted-foreground">Precision</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">0.97</div>
                      <div className="text-xs text-muted-foreground">Recall</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-muted-foreground">0.89</div>
                      <div className="text-xs text-muted-foreground">AUC</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.button
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mlmodels')}
            >
              🧠 Explore ML Models
            </motion.button>
            <motion.button
              className="border-2 border-black hover:bg-black dark:border-white dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-8 py-3 rounded-lg font-medium text-sm transition-all duration-200 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/datasets')}
            >
              📊 Browse Datasets
            </motion.button>
          </motion.div>

          {/* Additional AutoML Features Section */}
          <motion.div 
            className="mt-32 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-8">
              Why Choose Our AutoML Platform?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Feature 1 */}
              <motion.div 
                className="bg-background border border-border rounded-xl p-6 hover:border-foreground/40 transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Train and deploy models 10x faster with our optimized AutoML pipelines and distributed computing
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-background border border-border rounded-xl p-6 hover:border-foreground/40 transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Precision Tuned</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced hyperparameter optimization and neural architecture search for optimal model performance
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-background border border-border rounded-xl p-6 hover:border-foreground/40 transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Enterprise Ready</h3>
                <p className="text-muted-foreground text-sm">
                  Bank-level security, compliance standards, and scalable infrastructure for production workloads
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">50K+</div>
              <div className="text-muted-foreground text-sm">Models Trained</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-muted-foreground text-sm">Uptime SLA</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">2.4TB</div>
              <div className="text-muted-foreground text-sm">Data Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-muted-foreground text-sm">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;