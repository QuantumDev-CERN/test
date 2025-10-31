import { Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full py-12 mt-20">
      <div className="container px-4">
        <div className="glass glass-hover rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Technical Society — IIIT Sonepat</h3>
              <p className="text-sm text-muted-foreground">
                A community of passionate innovators, coders, and creators. 
                We aim to help students explore technology, startups, and research — 
                and turn their ideas into real-world impact.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Clubs Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Our Clubs</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#clubs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Coding Club
                  </a>
                </li>
                <li>
                  <a
                    href="#clubs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Robotics & AI Club
                  </a>
                </li>
                <li>
                  <a
                    href="#clubs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Startup & Innovation Cell
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#events"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Workshops & Events
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Open Source Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#learn"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Learning Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Get Involved</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#join"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Join the Society
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#team"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Meet the Team
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Technical Society, IIIT Sonepat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
