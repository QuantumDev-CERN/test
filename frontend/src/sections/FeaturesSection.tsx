"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FeatureTab } from "../components/features/FeatureTab";
import { FeatureContent } from "../components/features/FeatureContent";
import { features } from "../config/features";

export const FeaturesSection = () => {
  return (
    <section className="container px-4 py-24">
      {/* Header Section */}
      <div className="max-w-2xl mb-20">
        <h2 className="text-5xl md:text-6xl font-normal mb-6 tracking-tight text-left">
          Explore the
          <br />
          <span className="text-gradient font-medium">
            Spirit of Innovation
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-left">
          The Technical Society of IIIT Sonepat is a collective of passionate
          students, clubs, and innovators working together to explore technology,
          startups, and creativity. Here, individuals come together to learn,
          build, and innovate impactful solutions for the real world.
        </p>
      </div>

      <Tabs defaultValue={features[0].title} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left side - Tab triggers */}
          <div className="md:col-span-5 space-y-3">
            <TabsList className="flex flex-col w-full bg-transparent h-auto p-0 space-y-3">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.title}
                  value={feature.title}
                  className="w-full data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  <FeatureTab
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    isActive={false}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Right side - Tab content with images */}
          <div className="md:col-span-7">
            {features.map((feature) => (
              <TabsContent
                key={feature.title}
                value={feature.title}
                className="mt-0 h-full"
              >
                <FeatureContent image={feature.image} title={feature.title} />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </section>
  );
};
