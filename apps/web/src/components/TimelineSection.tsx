"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";

const timelineData = [
  {
    title: "Baby Years",
    achuImage: "/achubaby.jpeg",
    appuImage: "/appubaby.jpeg",
  },
  {
    title: "Growing Up",
    achuImage: "/achumiddleage.jpeg",
    appuImage: "/appumiddleage.jpeg",
  },
  {
    title: "Present Day",
    achuImage: "/achucurrent.jpeg",
    appuImage: "/appucurrent.jpeg",
  }
];

export function TimelineSection() {
  const [votedAppu, setVotedAppu] = useState(false);
  const [achuPos, setAchuPos] = useState({ x: 0, y: 0 });
  const [achuClicks, setAchuClicks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate floating hearts for the right answer
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number }[]>([]);

  const handleAppuVote = () => {
    setVotedAppu(true);
    setShowConfetti(true);
    // Create random hearts
    const newHearts = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setHearts(newHearts);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const handleAchuVote = () => {
    // Make the button run away
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 150;
    setAchuPos({ x: randomX, y: randomY });
    setAchuClicks(prev => prev + 1);
  };

  return (
    <section className="w-full py-20 px-4 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Through the Years</h2>
          <p className="text-muted-foreground font-light text-lg">A highly scientific comparison of cuteness over time.</p>
        </div>

        <div className="space-y-24 relative before:absolute before:inset-0 before:ml-auto before:-translate-x-1/2 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/50 before:to-primary/20 before:z-0">
          
          {timelineData.map((era, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Era Title Badge */}
              <div className="mb-8 inline-flex items-center justify-center rounded-full bg-background border-2 border-primary/30 px-6 py-2 shadow-sm">
                <span className="font-serif font-medium text-primary text-lg">{era.title}</span>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl px-2">
                {/* Achu's Photo */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-border/50 bg-muted">
                    <Image 
                      src={era.achuImage} 
                      alt={`Achu ${era.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-muted-foreground text-sm tracking-wide">Achu</span>
                </div>

                {/* Appu's Photo */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-border/50 bg-muted">
                    <Image 
                      src={era.appuImage} 
                      alt={`Appu ${era.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-muted-foreground text-sm tracking-wide">Appu</span>
                </div>
              </div>
            </motion.div>
          ))}

        </div>

        {/* The Cuteness Poll */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-32 max-w-xl mx-auto bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 text-center relative z-20"
        >
          <h3 className="text-3xl font-serif mb-2">The Ultimate Question</h3>
          <p className="text-muted-foreground mb-8">Having reviewed the evidence, who is cuter?</p>

          {!votedAppu ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative h-40 md:h-auto">
              
              {/* Achu Button (The wrong answer) */}
              <motion.button
                animate={{ x: achuPos.x, y: achuPos.y }}
                onClick={handleAchuVote}
                onMouseEnter={handleAchuVote}
                className="absolute md:relative px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium shadow-md transition-colors hover:bg-secondary/80 outline-none z-10"
              >
                Definitely Achu
              </motion.button>

              {/* Appu Button (The right answer) */}
              <button
                onClick={handleAppuVote}
                className="absolute md:relative px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:bg-primary/90 hover:scale-105 transition-all outline-none z-20 top-20 md:top-auto"
              >
                100% Appu
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </div>
              <h4 className="text-2xl font-serif text-foreground mb-2">Correct Answer!</h4>
              <p className="text-muted-foreground">Achu agrees wholeheartedly. (He had no choice).</p>
            </motion.div>
          )}

          {/* Funny toast for clicking Achu */}
          {achuClicks > 0 && !votedAppu && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={achuClicks}
              className="absolute -bottom-10 left-0 right-0 text-destructive text-sm font-medium"
            >
              {achuClicks === 1 && "Error 404: Cuteness not found. Try again."}
              {achuClicks === 2 && "Are you sure? Look at the evidence again."}
              {achuClicks > 2 && "The system refuses to accept this answer!"}
            </motion.p>
          )}
        </motion.div>

      </div>

      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ y: "100vh", opacity: 1, scale: 0 }}
              animate={{ 
                y: "-20vh", 
                opacity: 0, 
                scale: [0, 1.5, 1],
                x: Math.sin(heart.id) * 100 // Slight horizontal drift
              }}
              transition={{ 
                duration: 2.5 + Math.random() * 2, 
                delay: heart.delay,
                ease: "easeOut"
              }}
              className="absolute bottom-0 text-primary"
              style={{ left: `${heart.left}%` }}
            >
              <Heart className="w-8 h-8 fill-primary" />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
