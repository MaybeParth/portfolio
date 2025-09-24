"use client";

import Hero from "@/components/hero";
import SkillsGrid from "@/components/skills-grid";
import BookCarousel from "@/components/book-carousel";
import Projects from "@/components/projects";
import ContactForm from "@/components/contact-form";
import { hobbies } from "@/lib/data";
import { X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openVideoModal = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Hero />
      <div className="mt-4" />
      <SkillsGrid />
      <Projects />
              {/* Book of Hobbies */}
              <BookCarousel hobbies={hobbies} onMediaClick={openVideoModal} />

              {/* Media Modal */}
              {selectedVideo && (
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={closeVideoModal}
                >
                  <div className="relative w-full max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
                    <button
                      onClick={closeVideoModal}
                      className="absolute top-4 right-4 z-10 rounded-full bg-black/50 hover:bg-black/70 p-2 transition-colors"
                    >
                      <X size={24} className="text-white" />
                    </button>
                    {selectedVideo.endsWith('.mp4') ? (
                      <video
                        src={selectedVideo}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        loop
                        style={{ maxHeight: '80vh' }}
                      />
                    ) : (
                      <img
                        src={selectedVideo}
                        alt="Hobby image"
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '80vh' }}
                      />
                    )}
                  </div>
                </div>
              )}

      
      <section id="contact" className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Contact</h2>
        <ContactForm />
      </section>
    </>
  );
}
