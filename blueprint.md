# Church Tycoon: Mega-Church Simulator

## Overview
A web-based isometric tycoon game where players manage a growing non-denominational suburban church. The goal is to grow from a small living room gathering to a massive mega-church campus, managing resources, staff, and congregation satisfaction.

## Project Structure & Features
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **State Management:** React Context (`GameContext.tsx`)
*   **Graphics:** 16-bit style isometric assets rendered programmatically via SVG.

### Current Features
*   **Game Loop:** Time-based resource generation (money, faith).
*   **Venues:** Progressive venues (Living Room -> School Auditorium -> Warehouse).
*   **Isometric View:** `IsoMap` component renders the church layout.
*   **UI:** HUD, Action Panel, Message Log, Staff Panel.
*   **Assets:** Basic SVG sprites for chairs, pulpits, speakers, plants, and casual attendees.

## Plan: Enhanced 16-bit Assets & Entity Expansion

### Objective
Expand the visual fidelity of the game by creating a dedicated asset library (`GameAssets.tsx`) containing "16-bit" style SVG sprites for a wider range of entities and furniture, simulating a pixel-art aesthetic.

### Steps
1.  **Refactor Assets:** Move SVG rendering logic from `IsoMap.tsx` to a new dedicated component `app/components/ui/GameAssets.tsx`.
2.  **Implement New Entities:**
    *   **Staff:** Ushers (w/ badges/lanyards), Tech Team (black clothes, headsets).
    *   **Band:** Guitarist (w/ instrument), Drummer (w/ kit), Worship Leader.
3.  **Implement New Furniture/Decor:**
    *   **Stage Gear:** Drum kit, Monitors, Mic stands.
    *   **Lobby Items:** Coffee station, Welcome desk.
    *   **Flooring:** Refined tile patterns.
4.  **Update Rendering:** Update `IsoMap.tsx` to utilize the new asset library and render the diverse crowd and staff types.
