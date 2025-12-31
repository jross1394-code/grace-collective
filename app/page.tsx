"use client";

import React from "react";
import Header from "./components/ui/Header";
import IsoMap from "./components/ui/IsoMap";
import ActionPanel from "./components/ui/ActionPanel";
import StaffPanel from "./components/ui/StaffPanel";
import MessageLog from "./components/ui/MessageLog";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col p-2">
      <Header />
      {/* Replaced VenueDisplay with IsoMap container */}
      <div className="h-64 mb-4 pixel-box p-0 overflow-hidden">
        <IsoMap />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow">
        <div className="flex flex-col gap-4">
            <ActionPanel />
            <MessageLog />
        </div>
        <div>
            <StaffPanel />
        </div>
      </div>
    </main>
  );
}
