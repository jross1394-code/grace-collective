import React from "react";
import { useGame, VENUE_CONFIG } from "../../context/GameContext";

export default function VenueDisplay() {
  const { state } = useGame();

  // Simple visual representation changes based on venue
  const getVenueEmoji = () => {
    switch (state.venue) {
      case "Living Room": return "🏠";
      case "School Auditorium": return "🏫";
      case "Movie Theater": return "🎬";
      case "Warehouse": return "🏭";
      case "Stadium": return "🏟️";
      default: return "🏠";
    }
  };

  return (
    <div className="pixel-box mb-4 flex flex-col items-center justify-center h-48 bg-[#eee8d5] relative">
       <div className="absolute top-2 left-2 text-xs font-bold text-[#586e75] uppercase">Current Venue</div>
       <div className="text-6xl animate-bounce">{getVenueEmoji()}</div>
       <h2 className="text-xl font-bold mt-2 text-[#002b36]">{state.venue}</h2>
       <div className="text-xs text-[#586e75] mt-1">Capacity: {VENUE_CONFIG[state.venue].capacity}</div>
    </div>
  );
}
