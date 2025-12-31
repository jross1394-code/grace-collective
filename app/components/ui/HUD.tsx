import React, { useState } from "react";
import { Coins, Users, Flame, Calendar, Menu, X } from "lucide-react";
import { useGame, VENUE_CONFIG } from "../../context/GameContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HUD({ toggleMenu, isMenuOpen }: { toggleMenu: () => void, isMenuOpen: boolean }) {
  const { state } = useGame();
  const capacity = VENUE_CONFIG[state.venue].capacity;

  return (
    <div className="absolute top-0 left-0 w-full p-2 z-20 pointer-events-none">
        <div className="flex justify-between items-start">
            {/* Stats Container */}
            <div className="bg-[#fdf6e3] border-2 border-[#002b36] p-2 rounded shadow-lg pointer-events-auto flex flex-col gap-1 max-w-[200px]">
                <div className="flex items-center gap-2 text-[#b58900] font-bold text-sm">
                    <Coins size={14} />
                    <span>${Math.floor(state.money)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2aa198] font-bold text-sm">
                    <Users size={14} />
                    <span>{Math.floor(state.members)} / {capacity}</span>
                </div>
                <div className="flex items-center gap-2 text-[#dc322f] font-bold text-sm">
                    <Flame size={14} />
                    <span>{Math.floor(state.spirit)}</span>
                </div>
            </div>

            {/* Menu Button & Date */}
            <div className="flex flex-col items-end gap-2 pointer-events-auto">
                <button 
                    onClick={toggleMenu}
                    className="bg-[#002b36] text-[#fdf6e3] p-2 rounded-full border-2 border-[#fdf6e3] shadow-lg hover:bg-[#073642]"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="bg-[#fdf6e3] border-2 border-[#002b36] px-2 py-1 rounded text-xs font-bold text-[#657b83]">
                    Wk {state.week}, Day {state.day}
                </div>
            </div>
        </div>
        
        {/* Venue Label Floating */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-[#002b36] text-[#002b36] font-bold shadow-lg">
                {state.venue}
            </div>
        </div>
    </div>
  );
}
