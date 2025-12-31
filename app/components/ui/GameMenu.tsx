import React from "react";
import { useGame, VENUE_CONFIG } from "../../context/GameContext";
import { motion } from "framer-motion";
import { Coins, Users, Zap, ArrowUpCircle, Briefcase } from "lucide-react";

const STAFF_CONFIG = {
  worshipLeader: { name: "Worship Leader", cost: 100, desc: "+0.5 Spirit/sec", icon: Zap },
  outreachTeam: { name: "Outreach Team", cost: 150, desc: "+0.1 Members/sec", icon: Users },
  adminStaff: { name: "Admin Staff", cost: 200, desc: "+$1 Money/sec", icon: Coins },
};

export default function GameMenu() {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = React.useState<'actions' | 'staff'>('actions');

  // Logic from ActionPanel
  const nextVenue = VENUE_CONFIG[state.venue].next;
  const upgradeCost = VENUE_CONFIG[state.venue].upgradeCost;
  const canUpgradeVenue = nextVenue && state.money >= upgradeCost;
  const outreachCost = 10;
  const serviceSpiritCost = 10;

  const handleHoldService = () => {
    if (state.spirit >= serviceSpiritCost) {
      dispatch({ type: "ADD_SPIRIT", amount: -serviceSpiritCost });
      const tithes = Math.floor(state.members * 1.5) + 10; 
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

  const handleHire = (type: keyof typeof STAFF_CONFIG) => {
    const config = STAFF_CONFIG[type];
    if (state.money >= config.cost) {
        dispatch({ type: "BUY_UPGRADE", upgradeType: type, cost: config.cost });
        dispatch({ type: "LOG_MESSAGE", message: `Hired ${config.name}!` });
    }
  };

  return (
    <div className="bg-[#fdf6e3] h-full w-full flex flex-col border-l-4 border-[#002b36] shadow-xl">
        <div className="flex border-b-2 border-[#002b36]">
            <button 
                className={`flex-1 py-3 font-bold uppercase text-sm ${activeTab === 'actions' ? 'bg-[#268bd2] text-white' : 'bg-[#eee8d5] text-[#657b83]'}`}
                onClick={() => setActiveTab('actions')}
            >
                Actions
            </button>
            <button 
                className={`flex-1 py-3 font-bold uppercase text-sm ${activeTab === 'staff' ? 'bg-[#268bd2] text-white' : 'bg-[#eee8d5] text-[#657b83]'}`}
                onClick={() => setActiveTab('staff')}
            >
                Staff
            </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
            {activeTab === 'actions' && (
                <div className="flex flex-col gap-3">
                    <button onClick={handleHoldService} disabled={state.spirit < serviceSpiritCost} className="pixel-btn p-3 flex items-center justify-between text-left">
                        <div>
                            <div className="font-bold">Hold Service</div>
                            <div className="text-[10px] opacity-80">Cost: {serviceSpiritCost} Spirit</div>
                        </div>
                        <Users size={20} />
                    </button>

                    <button onClick={handleOutreach} disabled={state.money < outreachCost} className="pixel-btn bg-[#b58900] p-3 flex items-center justify-between text-left">
                         <div>
                            <div className="font-bold">Outreach Event</div>
                            <div className="text-[10px] opacity-80">Cost: ${outreachCost}</div>
                        </div>
                        <Briefcase size={20} />
                    </button>

                    {nextVenue && (
                        <button onClick={handleUpgradeVenue} disabled={!canUpgradeVenue} className="pixel-btn bg-[#d33682] p-3 flex items-center justify-between text-left mt-4">
                             <div>
                                <div className="font-bold">Upgrade Venue</div>
                                <div className="text-[10px] opacity-80">Move to {nextVenue}</div>
                                <div className="text-[10px] opacity-80">Cost: ${upgradeCost}</div>
                            </div>
                            <ArrowUpCircle size={20} />
                        </button>
                    )}
                </div>
            )}

            {activeTab === 'staff' && (
                <div className="flex flex-col gap-3">
                    {(Object.keys(STAFF_CONFIG) as Array<keyof typeof STAFF_CONFIG>).map((key) => {
                         const item = STAFF_CONFIG[key];
                         const currentCount = state.autoClickers[key];
                         const canAfford = state.money >= item.cost;
                         const Icon = item.icon;

                         return (
                            <div key={key} className="pixel-card p-2 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-200 p-1 rounded"><Icon size={16} className="text-[#002b36]" /></div>
                                        <div>
                                            <div className="font-bold text-sm text-[#002b36]">{item.name}</div>
                                            <div className="text-[10px] text-[#586e75]">{item.desc}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-[#268bd2] text-xs">Lvl {currentCount}</div>
                                </div>
                                <button 
                                    onClick={() => handleHire(key)}
                                    disabled={!canAfford}
                                    className="pixel-btn text-xs py-1 w-full"
                                >
                                    Hire (${item.cost})
                                </button>
                            </div>
                         )
                    })}
                </div>
            )}
        </div>
        
        {/* Message Log Mini */}
        <div className="bg-[#073642] p-2 text-xs text-[#839496] h-32 overflow-y-auto border-t-4 border-[#002b36]">
             {state.messages.slice(0, 5).map((msg, i) => (
                <div key={i} className={`mb-1 ${i === 0 ? 'text-[#eee8d5] font-bold' : ''}`}>
                    {'> '}{msg}
                </div>
            ))}
        </div>
    </div>
  );
}
