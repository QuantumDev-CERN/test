"use client";

import "./theme.css";
import Hero from "@/sections/blockchain/Hero";
import Narrative from "@/sections/blockchain/Narrative";
import Footer from "@/sections/blockchain/Footer";

export default function BlockchainPage() {
  return (
    <main className="blockchain-theme">
      <Hero />
      <Narrative />
      <Footer />
    </main>
  );
}
