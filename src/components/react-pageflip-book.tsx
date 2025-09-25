"use client";

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Hobby = {
  title: string;
  description: string;
  image?: string;
  activities?: string[];
};

type Props = {
  hobbies: Hobby[];
  onMediaClick?: (src: string) => void;
  onModalClose?: () => void;
};

export default function ReactPageFlipBook({ hobbies, onMediaClick, onModalClose }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pages = hobbies.filter((h) => !!h.image);
  const totalPages = pages.length;

  const goNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const goPrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const handlePageChange = (e: any) => {
    // Don't change page if modal is open
    if (isModalOpen) {
      return;
    }
    setCurrentPage(e.data);
  };

  // Reset modal state after a short delay
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 1000); // Reset after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  return (
    <section ref={containerRef} className="py-12 w-full">
      <div className="relative mx-auto max-w-4xl">

        <div className="relative mx-auto" style={{ width: "880px", maxWidth: "100%", height: "520px" }}>
          {/* Chalk instruction text - positioned to the left of the book */}
          {currentPage === 0 && (
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-0 pointer-events-none">
              <div className="flex items-center gap-2">
                <p 
                  className="text-foreground/80 dark:text-white/80 text-lg font-medium italic"
                  style={{ 
                    fontFamily: 'Chalkduster, "Comic Sans MS", cursive',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    transform: 'rotate(-2deg)'
                  }}
                >
                  Press, hold and drag to turn
                </p>
                <div 
                  className="text-foreground/80 dark:text-white/80 text-lg"
                  style={{ 
                    fontFamily: 'Chalkduster, "Comic Sans MS", cursive',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    transform: 'rotate(-2deg)'
                  }}
                >
                  →
                </div>
              </div>
            </div>
          )}

          <div className="relative">
              <HTMLFlipBook
                ref={flipBookRef}
                width={440}
                height={520}
                maxShadowOpacity={0.5}
                drawShadow={true}
                showCover={true}
                size="fixed"
                onFlip={handlePageChange}
                className="mx-auto"
                style={{}}
                startPage={0}
                minWidth={440}
                maxWidth={440}
                minHeight={520}
                maxHeight={520}
                usePortrait={true}
                useMouseEvents={true}
                swipeDistance={30}
                clickEventForward={false}
                disableFlipByClick={true}
                autoSize={false}
                showPageCorners={true}
                flippingTime={1000}
                startZIndex={0}
                mobileScrollSupport={true}
              >
                {/* Cover Page */}
                <div className="page" style={{ background: 'transparent' }}>
                  <div className="page-content cover h-full w-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-neutral-800 dark:to-neutral-700 text-foreground dark:text-white border border-yellow-200/80 dark:border-neutral-600/70 rounded-l-xl">
                    <div className="text-center px-6">
                      <div className="mx-auto mb-2 h-[2px] w-12 rounded-full bg-foreground/20" />
                      <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-foreground/70">Book of</div>
                      <div className="mt-1 text-2xl md:text-3xl font-extrabold tracking-wide text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-amber-300 dark:via-yellow-200 dark:to-amber-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                        Hobbies
                      </div>
                      <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-foreground/20" />
                      
                      {/* Creative sentence */}
                      <div className="mt-8">
                        <div className="relative rounded-xl border border-foreground/15 bg-background/65 backdrop-blur-sm shadow-sm px-6 py-5 max-w-[85%] mx-auto">
                          {/* corner accents */}
                          <span className="pointer-events-none absolute -top-1 -left-1 h-3 w-3 border-t border-l border-foreground/30 rounded-tl" />
                          <span className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 border-t border-r border-foreground/30 rounded-tr" />
                          <span className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-foreground/30 rounded-bl" />
                          <span className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-foreground/30 rounded-br" />

                          <div className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-2">Hobbies</div>
                          <p className="text-sm md:text-base text-foreground leading-relaxed">
                            <span className="italic">Still here? The plot thickens. Crack the cover to meet the rest of me.</span>
                          </p>
                          <div className="mt-3 mx-auto h-[2px] w-12 rounded-full bg-gradient-to-r from-amber-400/70 to-yellow-200/70" />
                        </div>
                      </div>

                      {/* Turn page instruction */}
                      <div className="mt-6">
                        <p 
                          className="text-lg md:text-xl text-foreground/70 dark:text-white/70 italic"
                          style={{ 
                            fontFamily: 'Chalkduster, "Comic Sans MS", cursive',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            transform: 'rotate(-2deg)'
                          }}
                        >
                          👆 Hold to turn the page
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hobby Pages - Each hobby gets a single page with large media */}
                {pages.map((hobby, index) => (
                  <div key={`${hobby.title}-${index}`} className="page">
                    <div className="page-content h-full w-full flex flex-col bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-neutral-900 dark:to-neutral-800">
                      {/* Title Header */}
                      <div className="p-6 pb-4 text-center">
                        <h3
                          className="text-2xl md:text-3xl text-foreground/90 dark:text-white/90 font-bold"
                          style={{ fontFamily: 'cursive', letterSpacing: '0.02em' }}
                        >
                          {hobby.title}
                        </h3>
                      </div>

                      {/* Large Media */}
                      <div className="flex-1 p-6 pt-0">
                        <div
                          className="relative h-full w-full rounded-lg overflow-hidden border bg-background group cursor-pointer shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (hobby.image) {
                              setIsModalOpen(true);
                              onMediaClick?.(hobby.image);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if ((e.key === "Enter" || e.key === " ") && hobby.image) {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsModalOpen(true);
                              onMediaClick?.(hobby.image);
                            }
                          }}
                          aria-label={`View ${hobby.title}`}
                        >
                          {hobby.image && (
                            <>
                              {hobby.image.endsWith('.mp4') ? (
                                <video
                                  src={hobby.image}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                              ) : (
                                <Image
                                  src={hobby.image}
                                  alt={hobby.title || "Hobby"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 440px"
                                  priority={false}
                                />
                              )}
                              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 grid place-items-center">
                                <div className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm text-white font-medium">Click to view</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Description Footer */}
                      <div className="p-6 pt-4 text-center">
                        <p
                          className="text-base md:text-lg text-foreground/80 dark:text-white/80 leading-relaxed"
                          style={{ fontFamily: 'cursive' }}
                        >
                          {hobby.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* End Cover */}
                <div className="page" style={{ background: 'transparent' }}>
                  <div className="page-content cover h-full w-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-neutral-800 dark:to-neutral-700 text-foreground dark:text-white border border-yellow-200/80 dark:border-neutral-600/70 rounded-r-xl">
                    <div className="text-center px-6">
                      <div className="mx-auto mb-4 h-[2px] w-16 rounded-full bg-foreground/20" />
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-amber-300 dark:via-yellow-200 dark:to-amber-100">
                        Thank You
                      </h2>
                      <p className="text-lg md:text-xl text-foreground/80 dark:text-white/80 leading-relaxed max-w-md">
                        Thank you for going through my interests and getting to know me better!
                      </p>
                      <div className="mx-auto mt-4 h-[2px] w-16 rounded-full bg-foreground/20" />
                    </div>
                  </div>
                </div>
              </HTMLFlipBook>

            </div>
        </div>
      </div>
    </section>
  );
}
