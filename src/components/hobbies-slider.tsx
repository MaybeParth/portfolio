"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Camera, Mountain, Zap, Users, Plane, Play } from "lucide-react";

type Hobby = {
  title: string;
  description: string;
  image?: string;
  activities?: string[];
};

type Props = {
  hobbies: Hobby[];
  onVideoClick: (videoSrc: string) => void;
  autoplaySpeed?: number;
  showControls?: boolean;
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HobbiesSlider({
  hobbies,
  onVideoClick,
  autoplaySpeed = 30,
  showControls = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Create infinite array for seamless loop
  const infiniteHobbies = [...hobbies, ...hobbies, ...hobbies];

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".hobby-card",
        { y: 100, opacity: 0, scale: 0.8, rotationY: 45 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMounted]);

  // River animation effect
  useEffect(() => {
    if (!isMounted || !trackRef.current) return;

    // Small delay to ensure track is rendered
    const timeoutId = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;

      const singleSetWidth = track.scrollWidth / 3; // Width of one set of hobbies
      const duration = autoplaySpeed; // seconds

      let animation: gsap.core.Tween;

      if (isPlaying && !isHovered) {
        console.log('Starting river animation', { singleSetWidth, duration, scrollWidth: track.scrollWidth });
        animation = gsap.to(track, {
          x: -singleSetWidth,
          duration: duration,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            // Animation is running
          }
        });
      } else {
        console.log('Pausing river animation', { isPlaying, isHovered });
        gsap.set(track, { x: 0 });
      }

      return () => {
        if (animation) {
          animation.kill();
        }
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted, isPlaying, isHovered, autoplaySpeed, hobbies.length]);

  const getHobbyIcon = (title: string) => {
    const iconProps = { size: 10, className: "text-primary" };
    switch (title) {
      case "Photography":
        return <Camera {...iconProps} />;
      case "Hiking":
        return <Mountain {...iconProps} />;
      case "Skateboarding":
        return <Zap {...iconProps} />;
      case "Skiing":
        return <Mountain {...iconProps} />;
      case "Soccer":
        return <Users {...iconProps} />;
      case "Squash":
        return <Zap {...iconProps} />;
      case "Traveling":
        return <Plane {...iconProps} />;
      default:
        return <Zap {...iconProps} />;
    }
  };


  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="relative w-full py-8 pb-16 overflow-hidden">
        <div className="flex gap-8">
          {hobbies.map((hobby, index) => (
            <div
              key={index}
              className="hobby-card relative rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 w-64 h-72 flex flex-col flex-shrink-0"
            >
              {hobby.image && (
                <div className="relative h-60 w-full flex-shrink-0">
                  {hobby.image.endsWith('.mp4') ? (
                    <video
                      src={hobby.image}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={hobby.image}
                      alt={`${hobby.title} hobby`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}
              <div className="px-2 flex flex-col items-center justify-center h-12">
                <div className="flex items-center justify-center gap-1">
                  <div className="rounded-full bg-primary/20 p-0.5">
                    {getHobbyIcon(hobby.title)}
                  </div>
                  <h3 className="text-sm font-medium text-center">{hobby.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 pb-16 overflow-hidden"
      role="region"
      aria-label="Hobbies carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {hoveredCard ? `Hovering over: ${hoveredCard}` : isPlaying && !isHovered ? "River is flowing" : "River paused on hover"}
      </div>

      {/* River Track */}
      <div 
        ref={trackRef}
        className={`flex gap-8 will-change-transform hobbies-river-track ${isPlaying && !isHovered ? 'animate-river' : 'paused'}`}
        style={{ 
          width: 'max-content',
          display: 'flex',
          gap: '2rem'
        }}
      >
        {infiniteHobbies.map((hobby, index) => (
          <div
            key={`${hobby.title}-${index}`}
            className="hobby-card relative rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg w-64 h-72 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-110 flex-shrink-0"
            onClick={() => {
              if (hobby.image) {
                onVideoClick(hobby.image);
              }
            }}
            onMouseEnter={() => setHoveredCard(hobby.title)}
            onMouseLeave={() => setHoveredCard(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (hobby.image) {
                  onVideoClick(hobby.image);
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${hobby.title} ${hobby.image?.endsWith('.mp4') ? 'video' : 'image'}`}
          >
            {hobby.image && (
              <div className="relative h-60 w-full flex-shrink-0">
                {hobby.image.endsWith('.mp4') ? (
                  <>
                    <video
                      src={hobby.image}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 group-hover:bg-white/30 transition-colors">
                        <Play size={16} className="text-white" />
                      </div>
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to view</span>
                    </div>
                  </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={hobby.image}
                      alt={`${hobby.title} hobby`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    {/* Click indicator for images */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                        <div className="rounded-full bg-white/20 backdrop-blur-sm p-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M21 3L3 21M21 3L15 21M21 3L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-white text-xs font-medium">Click to view</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            <div className="px-2 flex flex-col items-center justify-center h-12">
              <div className="flex items-center justify-center gap-1">
                <div className="rounded-full bg-primary/20 p-0.5">
                  {getHobbyIcon(hobby.title)}
                </div>
                <h3 className="text-sm font-medium text-center">{hobby.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Mouse-following card name */}
      {hoveredCard && (
        <div
          className="fixed pointer-events-none z-50 bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap transition-opacity duration-200"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          {hoveredCard}
        </div>
      )}


    </div>
  );
}