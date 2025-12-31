# Project Blueprint: Church Planting Tycoon

## Overview
"Church Planting Tycoon" is a management simulation game built with Next.js (App Router). Inspired by Kairosoft games, it features a pixel-art aesthetic and deep management mechanics. Players start as a church planter in a suburban living room and aim to grow their non-denominational congregation into a stadium-filling movement.

## Features
- **Progression System:** Evolve from Living Room -> School Auditorium -> Movie Theater -> Warehouse -> Stadium.
- **Resource Management:** Manage Funds, Congregation Size, and "Spirit" (Morale/Influence).
- **Staffing:** Recruit volunteers and hire pastors (Worship Leader, Youth Pastor, Executive Pastor).
- **Aesthetic:** Retro pixel-art style UI with vibrant colors and isometric-inspired layouts.
- **Gameplay Loop:** Hold services, organize outreach events, upgrade facilities, and manage random community events.
- **Visuals:** Isometric tile-based map representing the church layout and service setup.

## Plan & Steps
1.  **Project Restructure:** (Completed)
2.  **Game Engine Core:** (Completed)
3.  **UI Construction:** (Completed)
    *   *Update:* Replace `VenueDisplay` with `IsometricMap` component.
4.  **Mechanics Implementation:**
    *   **Living Room Phase:** Basic mechanics (Invite neighbors, Bible study).
    *   **Growth Logic:** Thresholds for moving to the next venue.
    *   **Staffing System:** Unlockable staff slots.
    *   *New:* Visual "Setup" phase where the room populates.
5.  **Refinement:**
    *   Add animations and "juice" (popups, numbers floating up).
    *   Ensure mobile responsiveness.
