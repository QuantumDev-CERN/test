"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  CITIES_DATA,
  ARCS_DATA,
  RINGS_DATA,
  GLOBE_CONFIG,
  ANIMATION_CONFIG,
} from "../constants/EarthData";
import Button from "../components/Button";
import AnimatedCoding from "../components/AnimatedCoding";
import RotaryDial from "../components/RotaryDial";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-[326px] h-[326px] flex items-center justify-center bg-gray-800 rounded-3xl">
      <div className="text-white">Loading Globe...</div>
    </div>
  ),
});

const About = () => {
  return (
    <section className="c-space my-20" id="about">
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <Image
              src="/assets/grid1.gif"
              alt="grid-1"
              width={500}
              height={276}
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Technical Society of IIIT Sonepat</p>
              <p className="grid-subtext">
                We are a student-driven community at IIIT Sonepat, uniting
                passionate minds in technology, innovation, and entrepreneurship.
                Our society brings together diverse clubs that focus on coding,
                design, startups, robotics, research, and more — creating an
                ecosystem where learning meets real-world impact. Together, we
                learn, build, and inspire the next generation of innovators.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <AnimatedCoding />
            <div>
              <p className="grid-headtext">What We Do</p>
              <p className="grid-subtext">
                From hackathons and workshops to startup mentorship and open-source
                collaborations, the Technical Society empowers every student to
                explore technology hands-on. We provide resources, guidance, and
                a collaborative environment where ideas transform into impactful
                projects. Whether you’re a beginner or an expert, there’s always
                something new to learn and contribute to.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe
                height={326}
                width={326}
                {...GLOBE_CONFIG}
                pointsData={CITIES_DATA}
                pointColor={() => "#ffffff"}
                pointAltitude={0.02}
                pointRadius={(d: unknown) => (d as { size: number }).size * 0.3 + 0.2}
                pointsMerge={ANIMATION_CONFIG.pointsMerge}
                pointsTransitionDuration={
                  ANIMATION_CONFIG.pointsTransitionDuration
                }
                arcsData={ARCS_DATA}
                arcColor={(d: unknown) => (d as { color: string }).color}
                arcDashLength={() => Math.random() * 0.4 + 0.3}
                arcDashGap={() => Math.random() * 0.3 + 0.1}
                arcDashAnimateTime={() => 2000 + Math.random() * 3000}
                arcStroke={() => Math.random() * 0.5 + 0.25}
                arcsTransitionDuration={ANIMATION_CONFIG.arcsTransitionDuration}
                arcAltitude={() => Math.random() * 0.4 + 0.1}
                arcAltitudeAutoScale={ANIMATION_CONFIG.arcAltitudeAutoScale}
                arcCurveResolution={ANIMATION_CONFIG.arcCurveResolution}
                arcCircularResolution={ANIMATION_CONFIG.arcCircularResolution}
                ringsData={RINGS_DATA}
                ringColor={() =>
                  `rgba(255,255,255,${Math.random() * 0.4 + 0.2})`
                }
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
                ringResolution={ANIMATION_CONFIG.ringResolution}
                enablePointerInteraction={
                  ANIMATION_CONFIG.enablePointerInteraction
                }
                lineHoverPrecision={ANIMATION_CONFIG.lineHoverPrecision}
              />
            </div>
            <div>
              <p className="grid-headtext">
                A Community That Connects Beyond Boundaries
              </p>
              <p className="grid-subtext">
                Our society’s reach extends far beyond campus walls. Through
                collaborations, global hackathons, and digital outreach, we
                connect with innovators and tech enthusiasts worldwide. The
                Technical Society of IIIT Sonepat believes in open knowledge,
                community-driven growth, and building technology that creates
                meaningful change.
              </p>
              <a
                href="https://www.linkedin.com/school/iiit-sonepat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  name="Join Our Network"
                  isBeam
                  containerClass="w-full mt-10"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container">
            <Image
              src="/assets/grid3.png"
              alt="grid-3"
              width={500}
              height={266}
              className="w-full sm:h-[266px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Our Vision</p>
              <p className="grid-subtext">
                The Technical Society aims to cultivate a thriving culture of
                technology and innovation at IIIT Sonepat. We strive to empower
                students to think creatively, collaborate openly, and solve
                real-world problems through technology.<br></br>
                Our focus areas include:<br></br>
                ⦿ Promoting open-source contributions and research<br></br>
                ⦿ Organizing tech talks, hackathons, and workshops<br></br>
                ⦿ Encouraging interdisciplinary projects and startups<br></br>
                ⦿ Building a strong network of innovators and leaders<br></br>
                Here, passion meets purpose — where ideas grow into innovations
                that shape the future.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container flex flex-col items-center">
            <p className="grid-headtext">Connect With Us</p>
            <div className="w-full flex justify-center items-center">
              <RotaryDial />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
