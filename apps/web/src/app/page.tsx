"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CalendarHeart, Heart, ChevronDown, Utensils, Star, Coffee, Clock, Zap, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TimelineSection } from "../components/TimelineSection";

// Reusable Flip Card Component for the Couple
const FlipCard = ({ person }: { person: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleSuperpowerClick = (e: React.MouseEvent) => {
    if (person.superpower === "The Monkey Whisperer") {
      e.stopPropagation();
      setShowEasterEgg(true);
    }
  };

  return (
    <>
    <motion.div 
      initial={{ rotateZ: 0 }}
      whileInView={{ rotateZ: [0, -3, 3, -2, 2, 0] }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-sm h-[450px] perspective-1000 mx-auto cursor-pointer group relative"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500 ease-in-out"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of Card (Photo) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl border-4 border-secondary/20 bg-card">
          <div className="relative w-full h-full">
            <Image 
              src={person.image} 
              alt={person.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
              <h3 className="text-3xl font-serif text-white">{person.name}</h3>
              <p className="text-secondary font-medium tracking-wider text-sm uppercase mt-1">{person.title}</p>
            </div>
          </div>
          {/* Tap to flip badge */}
          <div className="absolute bottom-6 right-6 bg-primary/90 text-primary-foreground backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse border border-white/20">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Tap</span>
          </div>
        </div>

        {/* Back of Card (Funny Stats) */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl border border-border bg-card p-6 flex flex-col justify-center items-center text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          
          <h3 className="text-xl font-serif text-foreground mb-1">Superpower</h3>
          <div 
            className={`px-3 py-1 rounded-full mb-1 transition-all ${person.superpower === "The Monkey Whisperer" ? "bg-primary/20 cursor-pointer hover:scale-105 hover:bg-primary/30" : ""}`}
            onClick={handleSuperpowerClick}
          >
            <p className="text-sm font-bold text-primary">
              {person.superpower} {person.superpower === "The Monkey Whisperer" && "🐒"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mb-6 italic px-2">"{person.superpowerDesc}"</p>
          
          <div className="space-y-3 w-full">
            {person.stats.map((stat: any, i: number) => (
              <div key={i} className="flex flex-col items-center p-2.5 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  {stat.icon} {stat.label}
                </span>
                <span className="text-primary font-bold mt-0.5">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>

    {/* Monkey Easter Egg Modal */}
    <AnimatePresence>
      {showEasterEgg && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowEasterEgg(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-card rounded-3xl p-4 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-muted">
              <Image 
                src="/appuwithmonkey.jpeg" 
                alt="Appu with Monkey"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center pb-4 px-2">
              <h3 className="text-2xl font-serif mb-2 text-foreground">The exact moment she met her true soulmate.</h3>
              <p className="text-muted-foreground italic text-lg">(Sorry, bro).</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

// Reusable FAQ Accordion
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden mb-4 bg-card shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent"
      >
        <span className="font-serif text-lg text-foreground">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-muted-foreground font-light leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const couple = [
    {
      name: "Achu",
      title: "The Groom",
      image: "/achu.jpeg",
      superpower: "The Amma Summoner",
      superpowerDesc: "Calling Amma to turn on a fan that is exactly 2 feet away from him.",
      stats: [
        { label: "Laziness", value: "100 / 10", icon: <Star className="w-4 h-4"/> },
        { label: "\"Amma!\" calls per day", value: "47", icon: <Coffee className="w-4 h-4"/> },
        { label: "KFC on Wednesdays", value: "Non-negotiable", icon: <Utensils className="w-4 h-4"/> },
      ]
    },
    {
      name: "Appu",
      title: "The Bride",
      image: "/appu1.jpeg",
      superpower: "The Monkey Whisperer",
      superpowerDesc: "Naturally attracts monkeys and insists on hugging them.",
      stats: [
        { label: "Ability to tolerate Achu's jokes", value: "Legendary", icon: <Star className="w-4 h-4"/> },
        { label: "Monkeys befriended", value: "At least 1", icon: <Heart className="w-4 h-4"/> },
        { label: "Love for Achu", value: "11 / 10", icon: <Heart className="w-4 h-4"/> },
      ]
    }
  ];

  const faqs = [
    {
      question: "Is there a dress code?",
      answer: "Traditional Kerala attire is highly encouraged! Basically, wear whatever gives you enough breathing room for the Sadya, and whatever you don't mind getting chased by a monkey in."
    },
    {
      question: "Will Achu actually do any work at his own wedding?",
      answer: "Current statistical models indicate a 98% chance of him delegating all heavy lifting to Appu, and the remaining 2% to Amma."
    },
    {
      question: "Who built this ridiculously amazing website?",
      answer: "The groom's cool brother. Building this was basically my way of quietly reminding all the aunties and uncles that I'm officially next in line. Please keep those blessings (and alliances) coming."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-start relative overflow-hidden bg-background">
      {/* Background Image of the Couple */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <Image 
          src="/achuappu.jpeg" 
          alt="Achu and Appu Background" 
          fill 
          className="object-cover object-center" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      </div>

      {/* Decorative background shapes */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-6 z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center rounded-full border border-secondary/50 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary-foreground backdrop-blur-sm shadow-sm">
            <CalendarHeart className="w-4 h-4 mr-2 text-primary" />
            <span className="tracking-widest uppercase text-xs">You are invited</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter text-foreground leading-tight py-4">
            Ashwin <span className="text-secondary italic font-light">&</span> Aparna
          </h1>
          
          <div className="space-y-4">
            <p className="max-w-[700px] text-muted-foreground md:text-2xl text-xl font-light leading-relaxed mx-auto">
              From sharing spreadsheets to sharing a life.
            </p>
            <p className="max-w-[600px] text-muted-foreground/80 md:text-lg text-base font-light mx-auto">
              What started as a workplace friendship slowly turned into a lifetime commitment. We invite you to join us as we tie the knot!
            </p>
          </div>
        </motion.div>
      </section>

      {/* Meet the Couple Section */}
      <section className="w-full py-24 px-4 z-10 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Meet the Couple</h2>
            <p className="text-muted-foreground font-light text-lg">Tap the cards below to reveal their true stats!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-8 max-w-4xl mx-auto">
            {couple.map((person, index) => (
              <FlipCard key={index} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Photo Timeline & Poll Section */}
      <TimelineSection />

      {/* RSVP Call To Action */}
      <section className="w-full py-20 px-4 bg-primary/5 border-t border-border/50 flex justify-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-6 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Are you ready to join us?</h2>
          <p className="text-muted-foreground font-light text-lg">Unlock your personal invitation and let us know if you can make it!</p>
          <div className="pt-4">
            <Link href="/login">
              <div className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-10 font-medium text-lg text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 w-full sm:w-auto">
                <span className="mr-2">Unlock Invitation & RSVP</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 px-4 z-10">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Important Details</h2>
            <p className="text-muted-foreground font-light text-lg">Everything you need to know before the big day.</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Added simple CSS for 3D flip effect since Tailwind doesn't have it built-in by default */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}} />
    </div>
  );
}
