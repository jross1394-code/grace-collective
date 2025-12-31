import React from "react";
import { useGame, VENUE_CONFIG } from "../../context/GameContext";
import { Coins, Users, Flame, Calendar } from "lucide-react";

export default function Header() {
  const { state } = useGame();
  const capacity = VENUE_CONFIG[state.venue].capacity;

  return (
    <div className="flex flex-wrap gap-2 justify-between items-center mb-4 bg-[#fdf6e3] border-b-4 border-[#002b36] pb-2">
      <div className="flex gap-4">
        <div className="flex items-center gap-1 text-[#b58900] font-bold">
            <Coins size={16} />
            <span>${Math.floor(state.money)}</span>
        </div>
        <div className="flex items-center gap-1 text-[#2aa198] font-bold">
            <Users size={16} />
            <span>{Math.floor(state.members)} / {capacity}</span>
        </div>
        <div className="flex items-center gap-1 text-[#dc322f] font-bold">
            <Flame size={16} />
            <span>{Math.floor(state.spirit)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-[#657b83] text-sm">
        <Calendar size={16} />
        <span>Wk {state.week}, Day {state.day}</span>
      </div>
    </div>
  );
}
