"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

// --- Types ---
export type Venue = "Living Room" | "School Auditorium" | "Movie Theater" | "Warehouse" | "Stadium";

export interface GameState {
  money: number;
  members: number;
  spirit: number;
  venue: Venue;
  day: number;
  week: number;
  messages: string[];
  autoClickers: {
    worshipLeader: number; // Generates Spirit
    outreachTeam: number; // Generates Members
    adminStaff: number;   // Generates Money
  };
}

type Action =
  | { type: "TICK" }
  | { type: "ADD_MONEY"; amount: number }
  | { type: "ADD_MEMBERS"; amount: number }
  | { type: "ADD_SPIRIT"; amount: number }
  | { type: "UPGRADE_VENUE"; newVenue: Venue; cost: number }
  | { type: "BUY_UPGRADE"; upgradeType: keyof GameState["autoClickers"]; cost: number }
  | { type: "LOG_MESSAGE"; message: string };

// --- Initial State ---
const initialState: GameState = {
  money: 100,
  members: 5,
  spirit: 50,
  venue: "Living Room",
  day: 1,
  week: 1,
  messages: ["Welcome to your new church plant! Start by inviting neighbors."],
  autoClickers: {
    worshipLeader: 0,
    outreachTeam: 0,
    adminStaff: 0,
  },
};

// --- Config ---
export const VENUE_CONFIG: Record<Venue, { capacity: number; upkeep: number; next: Venue | null; upgradeCost: number }> = {
  "Living Room": { capacity: 20, upkeep: 0, next: "School Auditorium", upgradeCost: 1000 },
  "School Auditorium": { capacity: 100, upkeep: 50, next: "Movie Theater", upgradeCost: 5000 },
  "Movie Theater": { capacity: 300, upkeep: 150, next: "Warehouse", upgradeCost: 15000 },
  "Warehouse": { capacity: 800, upkeep: 400, next: "Stadium", upgradeCost: 50000 },
  "Stadium": { capacity: 10000, upkeep: 2000, next: null, upgradeCost: 0 },
};

// --- Reducer ---
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK":
      // Passive generation based on staff
      const moneyGain = state.autoClickers.adminStaff * 1;
      const spiritGain = state.autoClickers.worshipLeader * 0.5;
      const memberGain = state.autoClickers.outreachTeam * 0.1; // Slow member growth

      let newMembers = state.members + memberGain;
      // Cap members by venue capacity
      const capacity = VENUE_CONFIG[state.venue].capacity;
      if (newMembers > capacity) newMembers = capacity;

      // Upkeep costs every 7 days (simplified to daily dribble or weekly check)
      // Let's do daily small upkeep
      const upkeep = VENUE_CONFIG[state.venue].upkeep / 7;
      let newMoney = state.money + moneyGain - upkeep;

      // Game over check could be here (if money < 0)

      return {
        ...state,
        money: newMoney,
        members: newMembers,
        spirit: state.spirit + spiritGain,
        day: state.day + 1,
        week: Math.floor((state.day + 1) / 7) + 1,
      };

    case "ADD_MONEY":
      return { ...state, money: state.money + action.amount };
    case "ADD_MEMBERS":
      const currentCap = VENUE_CONFIG[state.venue].capacity;
      let addedMembers = state.members + action.amount;
      if (addedMembers > currentCap) addedMembers = currentCap;
      return { ...state, members: addedMembers };
    case "ADD_SPIRIT":
      return { ...state, spirit: state.spirit + action.amount };
    case "UPGRADE_VENUE":
      return {
        ...state,
        money: state.money - action.cost,
        venue: action.newVenue,
        messages: [...state.messages, `Upgraded to ${action.newVenue}!`],
      };
    case "BUY_UPGRADE":
      return {
        ...state,
        money: state.money - action.cost,
        autoClickers: {
          ...state.autoClickers,
          [action.upgradeType]: state.autoClickers[action.upgradeType] + 1,
        },
      };
    case "LOG_MESSAGE":
      return { ...state, messages: [action.message, ...state.messages].slice(0, 5) };
    default:
      return state;
  }
}

// --- Context ---
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000); // 1 second = 1 day for pacing

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
