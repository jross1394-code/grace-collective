"use client";

import React, { useState } from "react";
import IsoMap from "./components/ui/IsoMap";
import HUD from "./components/ui/HUD";
import GameMenu from "./components/ui/GameMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="w-full h-screen relative overflow-hidden bg-[#87ceeb]">
      
      {/* 1. Full Screen Map */}
      <div className="absolute inset-0 z-0">
         <IsoMap />
      </div>

      {/* 2. HUD (Heads Up Display) */}
      <HUD toggleMenu={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

      {/* 3. Sliding Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute inset-0 bg-black z-30"
                />
                
                {/* Menu Drawer */}
                <motion.div 
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-0 right-0 h-full w-80 max-w-[90%] z-40"
                >
                    <GameMenu />
                </motion.div>
            </>
        )}
      </AnimatePresence>
      
    </main>
  );
}
