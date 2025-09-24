import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BookOpen, Brain, Target, Award, Users, TrendingUp, Zap } from 'lucide-react';
import * as THREE from 'three';

const Homelanding: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationId = useRef<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Initialize Three.js background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    sceneRef.current = scene;
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating particles for educational theme
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x666666, // neutral gray for theme compatibility
      transparent: true,
      opacity: 0.4
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create knowledge network lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < 60; i++) {
      linePositions.push(
        Math.random() * 25 - 12.5,
        Math.random() * 25 - 12.5,
        Math.random() * 25 - 12.5,
        Math.random() * 25 - 12.5,
        Math.random() * 25 - 12.5,
        Math.random() * 25 - 12.5
      );
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x888888, // theme-neutral gray
      transparent: true,
      opacity: 0.15
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 10;

    // Animation loop
    const animate = () => {
      animationId.current = requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0008;
      particlesMesh.rotation.y += 0.0012;
      
      lines.rotation.x += 0.0004;
      lines.rotation.y += 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Animation callback
  const animateOnScroll = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      'gsap' in window &&
      sectionRef.current &&
      !hasAnimated
    ) {
  const gsap = (window as typeof window & { gsap?: unknown }).gsap;
  if (!gsap) return;

  
  gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -100, y: 30 },
        { opacity: 1, x: 0, y: 0, duration: 1, ease: 'power3.out' }
      );

  gsap.fromTo(
        mobileRef.current,
        { opacity: 0, x: 100, y: 30, scale: 0.9, rotateY: 15 },
        { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );


  gsap.fromTo(
        '.feature-item',
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: 'power2.out' }
      );
  gsap.to(mobileRef.current, {
        y: -12,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.5
      });

      setHasAnimated(true);
    }
  }, [hasAnimated]);

  // Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;

    const IntersectionObserverClass = window.IntersectionObserver;
    const observer = new IntersectionObserverClass(
      (entries) => {
        entries.forEach((entry) => {
          if ((entry as IntersectionObserverEntry).isIntersecting && !hasAnimated) {
            animateOnScroll();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [animateOnScroll, hasAnimated]);

  return (
    <>
      <div className="h-20"></div>
  <div ref={sectionRef} className="relative min-h-screen bg-background overflow-hidden">
        {/* Three.js Background Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0 opacity-25"
        />

        {/* Main Content */}
        <div className="relative z-10 flex items-center min-h-screen py-16">
          <div className="w-full max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div ref={textRef} className="space-y-10 max-w-2xl">
                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                    Accelerate AI innovation with{' '}
                    <span className="font-extrabold" style={{background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
                      automated machine learning
                    </span>{' '}
                    and build{' '}
                    <span className="font-extrabold" style={{background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', color: 'transparent'}}>models that matter</span>{' '}
                    for your business!
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    The all-in-one AutoML platform to automate data science workflows, from data preparation to model deployment. Empower your team to build, compare, and deploy high-performing machine learning models—no coding required.
                  </p>
                </div>
                {/* Feature Item */}
                <div className="space-y-4">
                  <div className="feature-item rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300" style={{background: 'var(--gradient-card)'}}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
                        <Brain className="w-6 h-6 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-2">
                          How does Automated Machine Learning boost productivity?
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Our platform automates data preprocessing, feature engineering, model selection, and hyperparameter tuning. Instantly compare results, visualize metrics, and deploy the best models to production with a single click—freeing your team to focus on insights, not infrastructure.
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-background rounded-full flex items-center justify-center cursor-pointer border border-border transition-all duration-200 hover:scale-110">
                        <Target className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Content - Mobile Learning App Mockup */}
              <div ref={mobileRef} className="flex justify-center lg:justify-end relative">
                <div className="relative transform-gpu">
                  {/* Mobile Frame */}
                  <div className="relative w-80 h-[680px] bg-background rounded-[3.5rem] p-2.5 shadow-2xl hover:shadow-3xl transition-shadow duration-500 border border-border">
                    {/* Screen */}
                    <div className="w-full h-full bg-background rounded-[3rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-6 py-3 text-foreground">
                        <span className="font-semibold text-sm">10:24</span>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-0.5">
                            <div className="w-1 h-1 bg-foreground rounded-full"></div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          </div>
                          <div className="w-6 h-3 border border-border rounded-sm relative">
                            <div className="w-5 h-1.5 bg-foreground rounded-sm absolute top-0.5 left-0.5"></div>
                          </div>
                        </div>
                      </div>
                      {/* App Content */}
                      <div className="px-6 pt-8 pb-6 h-full">
                        {/* Header with logo */}
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background: 'var(--gradient-main)'}}>
                            <BookOpen className="w-7 h-7 text-foreground" />
                          </div>
                          <div>
                            <h2 className="text-foreground font-bold text-lg">AutoML Studio</h2>
                            <p className="text-muted-foreground text-sm font-medium">Project: Customer Churn Prediction</p>
                          </div>
                        </div>
                        {/* Learning Progress Dashboard */}
                        <div className="space-y-6">
                          {/* Progress Overview */}
                          <div className="rounded-3xl p-6 border border-border backdrop-blur-sm" style={{background: 'var(--gradient-card)'}}>
                            <div className="flex justify-between items-center mb-4">
                                    <span className="text-foreground font-medium">Experiment Progress</span>
                                    <div className="flex items-center space-x-2">
                                      <TrendingUp className="w-4 h-4 text-foreground" />
                                      <span className="text-foreground font-bold text-sm">+3 new models</span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                                    <div className="bg-foreground h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
                                  </div>
                                  <p className="text-muted-foreground text-sm">11 of 12 experiments complete • 2h 15m runtime</p>
                          </div>
                          {/* Current Learning Modules */}
                          <div className="space-y-3">
                            <div className="rounded-2xl p-4 border border-border transition-colors duration-300" style={{background: 'var(--gradient-success)'}}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
                                  <Award className="w-4 h-4 text-foreground" />
                                </div>
                                <div className="flex-1">
                                        <p className="text-foreground font-semibold text-sm">Random Forest Classifier</p>
                                        <p className="text-muted-foreground text-xs">Completed • Accuracy: 94%</p>
                                      </div>
                                      <div className="text-foreground font-bold text-lg">✓</div>
                              </div>
                            </div>
                            <div className="rounded-2xl p-4 border border-border transition-colors duration-300" style={{background: 'var(--gradient-main)'}}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
                                  <Zap className="w-4 h-4 text-foreground" />
                                </div>
                                <div className="flex-1">
                                        <p className="text-foreground font-semibold text-sm">XGBoost Model</p>
                                        <p className="text-muted-foreground text-xs">Training • 67% complete</p>
                                      </div>
                                      <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                              </div>
                            </div>
                            <div className="rounded-2xl p-4 border border-border transition-colors duration-300" style={{background: 'var(--gradient-accent)'}}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
                                  <Users className="w-4 h-4 text-foreground" />
                                </div>
                                <div className="flex-1">
                                        <p className="text-foreground font-semibold text-sm">Neural Network</p>
                                        <p className="text-muted-foreground text-xs">Queued • Starts in 2 min</p>
                                      </div>
                                      <div className="w-6 h-6 border-2 border-border rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          {/* Quick Learning Actions */}
                          <div className="grid grid-cols-2 gap-3 mt-8">
                            <button className="rounded-2xl p-4 text-foreground font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95" style={{background: 'var(--gradient-main)'}}>
                              New Experiment
                            </button>
                            <button className="rounded-2xl p-4 text-foreground font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95" style={{background: 'var(--gradient-card)'}}>
                              Deploy Model
                            </button>
                          </div>
                          {/* Achievement Badge */}
                          <div className="mt-6 rounded-2xl p-4 border border-border" style={{background: 'var(--gradient-warning)'}}>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border">
                                <Award className="w-5 h-5 text-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="text-foreground font-semibold text-sm">Deployment Success!</p>
                                <p className="text-muted-foreground text-xs">Model live at endpoint</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Home indicator */}
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-muted rounded-full"></div>
                    </div>
                  </div>
                  {/* Floating decorative elements */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-background border-2 border-border rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-background border-2 border-border rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 -right-10 w-12 h-12 bg-background border-2 border-border rounded-full animate-bounce"></div>
                  <div className="absolute bottom-1/4 -left-8 w-10 h-10 bg-background border-2 border-border rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </>
  );
};

export default Homelanding;