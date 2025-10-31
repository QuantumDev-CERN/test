"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Aarav Gupta",
    role: "President, Coding Club",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content:
      "The Technical Society has been a launchpad for countless student projects and hackathons. It’s where ideas evolve into real-world solutions through collaboration and teamwork.",
  },
  {
    name: "Neha Sharma",
    role: "Lead, Robotics Club",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content:
      "From building drones to participating in national-level competitions, the society provided us with the mentorship, tools, and exposure to grow as innovators.",
  },
  {
    name: "Rohan Verma",
    role: "AI & ML Club Coordinator",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content:
      "Being part of the Technical Society helped me explore AI research and contribute to projects that truly make an impact. The collaboration across clubs is inspiring.",
  },
  {
    name: "Priya Mehta",
    role: "Member, Design & Innovation Club",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content:
      "The creative freedom and inter-club events have been amazing. The Technical Society connects every tech enthusiast on campus under one dynamic community.",
  },
  {
    name: "Aniket Singh",
    role: "Core Member, Electronics Club",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content:
      "From circuit design workshops to real hardware projects, the society gives every student a platform to explore, learn, and share knowledge.",
  },
  {
    name: "Simran Kaur",
    role: "Hackathon Organizer",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content:
      "Organizing events under the Technical Society taught me leadership, teamwork, and execution. It's not just about tech — it’s about community.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4 text-white">
            Voices of Innovation
          </h2>
          <p className="text-muted-foreground text-lg text-white/70">
            Hear from the students driving technology forward at IIIT Sonepat
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            {/* First marquee row */}
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={`${index}-1`}
                  className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-white/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>

            {/* Second marquee row (duplicate for seamless loop) */}
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={`${index}-2`}
                  className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-white/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
