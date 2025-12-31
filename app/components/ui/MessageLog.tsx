import React, { useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";

export default function MessageLog() {
  const { state } = useGame();
  
  return (
    <div className="pixel-box bg-[#073642] text-[#839496] text-xs h-32 overflow-hidden flex flex-col justify-end">
        <div className="flex flex-col gap-1">
            {state.messages.slice().reverse().map((msg, i) => (
                <div key={i} className={`border-b border-[#002b36] pb-1 ${i === 0 ? 'text-[#eee8d5] font-bold' : 'opacity-70'}`}>
                    {i === 0 ? '> ' : ''}{msg}
                </div>
            ))}
        </div>
    </div>
  );
}
