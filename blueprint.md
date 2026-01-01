# Church Tycoon: Mega-Church Simulator

## Overview
A web-based isometric tycoon game where players manage a growing non-denominational suburban church. The goal is to grow from a small living room gathering to a massive mega-church campus, managing resources, staff, and congregation satisfaction.

## Project Structure & Features
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **State Management:** React Context (`GameContext.tsx`)
*   **Graphics:** 16-bit pixel-art style isometric assets rendered via HTML5 Canvas (Raster).

### Current Features
*   **Game Loop:** Time-based resource generation (money, faith).
*   **Venues:** Progressive venues (Living Room -> School Auditorium -> Warehouse).
*   **Isometric View:** `IsoMap` component renders the church layout.
*   **UI:** HUD, Action Panel, Message Log, Staff Panel.
*   **Assets:** Programmatic pixel-art sprites (defined in code) for authentic 16-bit aesthetic.

## Plan: Enhanced 16-bit Assets & Entity Expansion

### Objective
Achieve a strict 16-bit pixel art aesthetic (comparable to Stardew Valley or Game Dev Story) by abandoning SVG in favor of raster graphics rendered on an HTML Canvas. Assets will be defined as pixel matrices within the codebase to simulate a sprite sheet.

### Steps
1.  **Create Sprite System:**
    *   `app/lib/pixelData.ts`: Define raw pixel matrices (string arrays) for all game entities (chairs, staff, band, furniture).
    *   `app/lib/canvasUtils.ts`: Utilities to render pixel matrices to Canvas contexts.
2.  **Refactor Rendering:**
    *   Replace `IsoMap.tsx` with a Canvas-based implementation (`IsoCanvas`).
    *   Implement an isometric drawing loop that handles depth sorting of sprite bitmaps.
3.  **Implement New Entities (Pixel Art):**
    *   **Staff:** Ushers (Yellow vests), Tech Team (Black shirts/headsets).
    *   **Band:** Pixelated instruments and musicians.
    *   **Decor:** Coffee stations, welcome desks, sound equipment.
4.  **Polish:**
    *   Ensure crisp `image-rendering: pixelated` CSS.
    *   Implement "wobble" or simple animation frames if time permits.
