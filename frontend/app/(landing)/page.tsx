"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ForWhoSection from "@/components/landing/ForWhoSection";
import TechStackSection from "@/components/landing/TechStackSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/landing/ScrollProgress";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <ScrollProgress />
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.div variants={sectionVariants} custom={0}>
          <HeroSection />
        </motion.div>
        <motion.div variants={sectionVariants} custom={1}>
          <FeaturesSection />
        </motion.div>
        <motion.div variants={sectionVariants} custom={2}>
          <ForWhoSection />
        </motion.div>
        <motion.div variants={sectionVariants} custom={3}>
          <TechStackSection />
        </motion.div>
        <motion.div variants={sectionVariants} custom={4}>
          <PricingSection />
        </motion.div>
        <motion.div variants={sectionVariants} custom={5}>
          <Footer />
        </motion.div>
      </motion.div>
    </main>
  );
}
