'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  ctaLink?: string;
  ctaText?: string;
}

interface HeroSliderProps {
  slides?: Slide[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: '/hero.jpg',
    title: 'Saving Lives, Building Futures',
    description: 'Empowering communities in Eastern Equatoria State, South Sudan through sustainable development programs.',
    ctaLink: '/donate',
    ctaText: 'Donate Now',
  },
  {
    id: 2,
    image: '/health.jpg',
    title: 'Healthcare for All',
    description: 'Bringing quality healthcare services to remote communities across South Sudan.',
    ctaLink: '/programs/health',
    ctaText: 'Learn More',
  },
  {
    id: 3,
    image: '/hero.jpg',
    title: 'Education is Hope',
    description: 'Providing quality education and skills training to children and youth in our communities.',
    ctaLink: '/programs/education',
    ctaText: 'Our Programs',
  },
];

export function HeroSlider({ 
  slides = defaultSlides, 
  autoSlide = true, 
  autoSlideInterval = 5000 
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoSlide) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, nextSlide]);

  return (
    <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] min-h-[300px] max-h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
                {slide.description}
              </p>
              {slide.ctaText && (
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <a href={slide.ctaLink}>{slide.ctaText}</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
