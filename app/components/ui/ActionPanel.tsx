import React from "react";
import { useGame, VENUE_CONFIG } from "../../context/GameContext";

export default function ActionPanel() {
  const { state, dispatch } = useGame();
  
  const nextVenue = VENUE_CONFIG[state.venue].next;
  const upgradeCost = VENUE_CONFIG[state.venue].upgradeCost;
  const canUpgradeVenue = nextVenue && state.money >= upgradeCost;

  // Costs for basic actions
  const outreachCost = 10;
  const serviceSpiritCost = 10;

  const handleHoldService = () => {
    if (state.spirit >= serviceSpiritCost) {
      dispatch({ type: "ADD_SPIRIT", amount: -serviceSpiritCost });
      const tithes = Math.floor(state.members * 1.5) + 10; // Basic formula
      dispatch({ type: "ADD_MONEY", amount: tithes });
      dispatch({ type: "LOG_MESSAGE", message: `Held Service! Collected $${tithes}.` });
    } else {
        dispatch({ type: "LOG_MESSAGE", message: "Not enough Spirit to hold service!" });
    }
  };

  const handleOutreach = () => {
    if (state.money >= outreachCost) {
      dispatch({ type: "ADD_MONEY", amount: -outreachCost });
      const newMembers = Math.floor(Math.random() * 3) + 1;
      dispatch({ type: "ADD_MEMBERS", amount: newMembers });
      dispatch({ type: "LOG_MESSAGE", message: `Outreach successful! +${newMembers} members.` });
    } else {
        dispatch({ type: "LOG_MESSAGE", message: "Not enough money for outreach!" });
    }
  };

  const handleUpgradeVenue = () => {
    if (canUpgradeVenue && nextVenue) {
      dispatch({ type: "UPGRADE_VENUE", newVenue: nextVenue, cost: upgradeCost });
    }
  };

  return (
    <div className="pixel-box mb-4">
      <h3 className="font-bold text-[#002b36] mb-2 uppercase border-b-2 border-[#002b36]">Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <button 
            onClick={handleHoldService}
            disabled={state.spirit < serviceSpiritCost}
            className="pixel-btn py-2 px-4 text-sm"
        >
          Hold Service
          <div className="text-[10px] opacity-80">Cost: {serviceSpiritCost} Spirit</div>
        </button>

        <button 
            onClick={handleOutreach}
            disabled={state.money < outreachCost}
            className="pixel-btn py-2 px-4 text-sm bg-[#b58900]"
        >
          Outreach
          <div className="text-[10px] opacity-80">Cost: ${outreachCost}</div>
        </button>

        {nextVenue && (
             <button 
             onClick={handleUpgradeVenue}
             disabled={!canUpgradeVenue}
             className="pixel-btn py-2 px-4 text-sm col-span-2 bg-[#d33682]"
         >
           Move to {nextVenue}
           <div className="text-[10px] opacity-80">Cost: ${upgradeCost}</div>
         </button>
        )}
      </div>
    </div>
  );
}
