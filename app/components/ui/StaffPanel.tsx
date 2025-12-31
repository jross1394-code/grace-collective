import React from "react";
import { useGame } from "../../context/GameContext";

const STAFF_CONFIG = {
  worshipLeader: { name: "Worship Leader", cost: 100, desc: "+0.5 Spirit/sec" },
  outreachTeam: { name: "Outreach Team", cost: 150, desc: "+0.1 Members/sec" },
  adminStaff: { name: "Admin Staff", cost: 200, desc: "+$1 Money/sec" },
};

export default function StaffPanel() {
  const { state, dispatch } = useGame();

  const handleHire = (type: keyof typeof STAFF_CONFIG) => {
    const config = STAFF_CONFIG[type];
    if (state.money >= config.cost) {
        dispatch({ type: "BUY_UPGRADE", upgradeType: type, cost: config.cost });
        dispatch({ type: "LOG_MESSAGE", message: `Hired ${config.name}!` });
    }
  };

  return (
    <div className="pixel-box mb-4">
      <h3 className="font-bold text-[#002b36] mb-2 uppercase border-b-2 border-[#002b36]">Staffing</h3>
      <div className="flex flex-col gap-2">
        {(Object.keys(STAFF_CONFIG) as Array<keyof typeof STAFF_CONFIG>).map((key) => {
            const item = STAFF_CONFIG[key];
            const currentCount = state.autoClickers[key];
            const canAfford = state.money >= item.cost;

            return (
                <div key={key} className="flex justify-between items-center pixel-card">
                    <div>
                        <div className="font-bold text-sm">{item.name}</div>
                        <div className="text-[10px] text-gray-500">{item.desc}</div>
                        <div className="text-[10px] text-blue-600">Owned: {currentCount}</div>
                    </div>
                    <button 
                        onClick={() => handleHire(key)}
                        disabled={!canAfford}
                        className="pixel-btn text-xs px-2 py-1"
                    >
                        Hire ${item.cost}
                    </button>
                </div>
            )
        })}
      </div>
    </div>
  );
}
