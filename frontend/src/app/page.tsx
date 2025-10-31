"use client";

import Navigation from "@/sections/Navigation";
import HeroSection from "@/sections/HeroSection";
import { FeaturesSection } from "@/sections/FeaturesSection";
import { Timeline } from "@/components/ui/timeline";
import LogoCarousel from "@/sections/LogoCarousel";
import TestimonialsSection from "@/sections/TestimonialsSection";
import Footer from "@/sections/Footer";
import { CallToAction } from "@/sections/callToAction";
import ScrollReveal from "@/components/ui/ScrollReveal";
import About from "@/sections/About";

const timelineData = [
  {
    title: "2024",
    content: (
      <div className="text-neutral-300">
        <p className="text-sm md:text-base">
          Launched The Technical Society with a vision to bring together the brightest minds in technology. 
          Started with our first cohort of engineers and designers.
        </p>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div className="text-neutral-300">
        <p className="text-sm md:text-base">
          Developed the core platform architecture and built our community infrastructure. 
          Conducted extensive research on modern learning methodologies.
        </p>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div className="text-neutral-300">
        <p className="text-sm md:text-base">
          Conceptualized the idea of a technical society where learning happens through collaboration, 
          experimentation, and real-world problem solving.
        </p>
      </div>
    ),
  },
  {
    title: "2021",
    content: (
      <div className="text-neutral-300">
        <p className="text-sm md:text-base">
          Identified the gap in traditional technical education and began planning a revolutionary 
          approach to learning and skill development.
        </p>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh' }} className="bg-black text-foreground">
      <Navigation />
      
      <HeroSection />

      <div className="bg-black" style={{ width: '100vw' }}>
        <About />
      </div>

      <div style={{ 
        width: '100vw', 
        position: 'relative',
        backgroundColor: 'black',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={6}
          blurStrength={30}
          containerClassName="scroll-reveal-container"
          textClassName="scroll-reveal-text"
        >
          When does real learning begin? Not in classrooms. It begins when ideas collide, code breaks, and minds rebuild stronger.
Welcome to The Technical Society — where the brightest engineers, designers, and innovators craft the future, one experiment at a time.
Here, curiosity isn&apos;t a hobby — it&apos;s a lifestyle. Build. Break. Create. Repeat.
        </ScrollReveal>
      </div>

      <div style={{ width: '100vw' }}>
        <LogoCarousel />
      </div>

      <div id="features" className="bg-black" style={{ width: '100vw' }}>
        <FeaturesSection />
      </div>

      <div id="timeline" className="bg-black" style={{ width: '100vw' }}>
        <Timeline data={timelineData} />
      </div>

      <div className="bg-black" style={{ width: '100vw' }}>
        <TestimonialsSection />
      </div>

      <div className="bg-black" style={{ width: '100vw' }}>
        <CallToAction />
      </div>

      <div className="bg-black" style={{ width: '100vw' }}>
        <Footer />
      </div>
    </div>
  );
}