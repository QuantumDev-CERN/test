import { useState, useEffect } from "react";
import Link from "next/link";
import { Command, Menu, ChevronDown, Play, List, Wrench, Trophy, Bell, Building, HelpCircle, Mail, Crown, DollarSign } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'testimonials') {
      const testimonialSection = document.querySelector('.animate-marquee');
      if (testimonialSection) {
        const yOffset = -100; // Offset to account for the fixed header
        const y = testimonialSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (sectionId === 'cta') {
      const ctaSection = document.querySelector('.button-gradient');
      if (ctaSection) {
        const yOffset = -100;
        const y = ctaSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { 
      name: "Features", 
      href: "#features", 
      onClick: () => scrollToSection('features'),
      columns: [
        {
          title: "PLATFORM",
          items: [
            { title: "Platform Tour", description: "Watch 2-minute walkthrough video", href: "#tour", icon: Play },
            { title: "Explore Features", description: "Discover all platform capabilities", href: "#features", icon: List },
            { title: "Tools Library", description: "Startup tools and resources", href: "#tools", icon: Wrench }
          ]
        },
        {
          title: "ANALYTICS",
          items: [
            { title: "Advanced Analytics", description: "Real-time data insights", href: "#analytics", icon: Trophy },
            { title: "AI Integration", description: "Smart automation tools", href: "#ai", icon: Bell },
            { title: "Custom Dashboards", description: "Personalized views", href: "#dashboards", icon: Building }
          ]
        }
      ]
    },
    { 
      name: "Company", 
      href: "#timeline", 
      onClick: () => scrollToSection('timeline'),
      columns: [
        {
          title: "COMPANY",
          items: [
            { title: "Success Stories", description: "Real entrepreneurs building with us", href: "#stories", icon: Trophy },
            { title: "What's New", description: "Latest features and improvements", href: "#news", icon: Bell },
            { title: "About", description: "Learn about our mission and team", href: "#about", icon: Building }
          ]
        },
        {
          title: "SUPPORT",
          items: [
            { title: "FAQ", description: "Common questions answered", href: "#faq", icon: HelpCircle },
            { title: "Contact & Support", description: "Get help from our team", href: "#contact", icon: Mail }
          ]
        }
      ]
    },
    { 
      name: "Pricing", 
      href: "#testimonials", 
      onClick: () => scrollToSection('testimonials'),
      columns: [
        {
          title: "GET STARTED",
          items: [
            { title: "Sign Up", description: "Start exploring ideas and features", href: "#signup", icon: Crown },
            { title: "Compare Plans", description: "See all available plans", href: "#compare", icon: DollarSign },
            { title: "Enterprise", description: "Custom solutions for teams", href: "#enterprise", icon: Building }
          ]
        }
      ]
    },
  ];

  return (
    <header
      className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
        isScrolled 
          ? "h-14 bg-[#1B1B1B]/40 backdrop-blur-xl border border-white/10 scale-95 w-[90%] max-w-2xl" 
          : "h-14 bg-[#1B1B1B] w-[95%] max-w-3xl"
      }`}
    >
      <div className="mx-auto h-full px-6">
        <nav className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-primary" />
            <span className="font-bold text-base">Technical Society</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger 
                      className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 bg-transparent hover:bg-white/5 data-[state=open]:bg-white/10 rounded-lg px-3 py-2"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (item.onClick) {
                          item.onClick();
                        }
                      }}
                    >
                      {item.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-6 p-8 w-[800px] bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="grid grid-cols-2 gap-8">
                          {item.columns && item.columns.map((column, columnIndex) => (
                            <div key={columnIndex} className="space-y-4">
                              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                {column.title}
                              </h3>
                              <div className="space-y-3">
                                {column.items && column.items.map((dropdownItem, index) => {
                                  const IconComponent = dropdownItem.icon;
                                  return (
                                    <NavigationMenuLink key={index} asChild>
                                      <a
                                        href={dropdownItem.href}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                                      >
                                        <div className="flex-shrink-0 mt-0.5">
                                          <IconComponent className="h-4 w-4 text-white/60 group-hover:text-white transition-colors duration-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors duration-200">
                                            {dropdownItem.title}
                                          </div>
                                          <p className="text-xs text-white/50 mt-1 leading-relaxed group-hover:text-white/70 transition-colors duration-200">
                                            {dropdownItem.description}
                                          </p>
                                        </div>
                                      </a>
                                    </NavigationMenuLink>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* --- MODIFIED BUTTON --- */}
            <Button
              asChild 
              size="sm"
              variant="outline"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 bg-transparent hover:bg-white/5 border-white/20"
            >
              <Link href="/Blockchain_page">Blockchain</Link>
            </Button>
            {/* --- END OF MODIFIED BUTTON --- */}

            <Button 
              onClick={() => window.open('/roadmaps', '_blank')}
              size="sm"
              variant="outline"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 bg-transparent hover:bg-white/5 border-white/20"
            >
              Roadmaps
            </Button>
            <Button 
              onClick={() => scrollToSection('cta')}
              size="sm"
              className="button-gradient"
            >
              Explore
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="glass">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#1B1B1B]">
                <SheetTitle style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                  Navigation Menu
                </SheetTitle>
                <SheetDescription style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                  Main navigation menu with links to different sections of the website
                </SheetDescription>
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Collapsible 
                      key={item.name}
                      open={openMobileDropdown === item.name}
                      onOpenChange={(open: boolean) => setOpenMobileDropdown(open ? item.name : null)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-lg text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/5">
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMobileDropdown === item.name ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-2 ml-4 animate-in slide-in-from-top-2 duration-200">
                        {item.columns && item.columns.map((column, columnIndex) => (
                          <div key={columnIndex} className="space-y-2">
                            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                              {column.title}
                            </h4>
                            {column.items && column.items.map((dropdownItem, index) => {
                              const IconComponent = dropdownItem.icon;
                              return (
                                <a
                                  key={index}
                                  href={dropdownItem.href}
                                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-2 rounded-lg hover:bg-white/5"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIsMobileMenuOpen(false);
                                    setOpenMobileDropdown(null);
                                  }}
                                >
                                  <IconComponent className="h-3 w-3 text-white/60" />
                                  <span>{dropdownItem.title}</span>
                                </a>
                              );
                            })}
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {/* --- MODIFIED BUTTON --- */}
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 text-muted-foreground hover:text-foreground bg-transparent hover:bg-white/5 border-white/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/Blockchain_page">Blockchain</Link>
                  </Button>
                  {/* --- END OF MODIFIED BUTTON --- */}

                  <Button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.open('/roadmaps', '_blank');
                    }}
                    variant="outline"
                    className="mt-4 text-muted-foreground hover:text-foreground bg-transparent hover:bg-white/5 border-white/20"
                  >
                    Roadmaps
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollToSection('cta');
                    }}
                    className="button-gradient mt-2"
                  >
                    Explore
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;