// ==UserScript==
// @name         Strava Feed Filter
// @name:en      Strava Feed Filter
// @description  Advanced filtering for your Strava activity feed: keywords, activity types, distance, duration, elevation, pace, map presence; draggable UI; real-time updates.
// @description:en Advanced filtering for your Strava activity feed: keywords, activity types, distance, duration, elevation, pace, map presence; draggable UI; real-time updates.
// @namespace    https://github.com/Inc21/Tempermonkey-Strava-Feed-Filter
// @version      2.3.3
// @license      MIT
// @author       Inc21
// @match        https://www.strava.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @homepageURL  https://github.com/Inc21/Tempermonkey-Strava-Feed-Filter
// @supportURL   https://github.com/Inc21/Tempermonkey-Strava-Feed-Filter/issues
// @downloadURL https://update.greasyfork.org/scripts/550272/Strava%20Feed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/550272/Strava%20Feed%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
     * Copyright (c) 2025 Inc21
     * Licensed under the MIT License. See LICENSE file in the project root for full license text.
     */

    // DISCLAIMER: Currently tested with Firefox (Desktop) and Firefox for Android.
    // Other browsers may work but are not yet fully verified for this release.

    console.log(' Clean Filter: Script starting...');

    const STORAGE_KEY = "stravaFeedFilter";
    const POS_KEY = "stravaFeedFilterPos";

    const DEFAULTS = {
        keywords: [],
        allowedAthletes: [],
        ignoredAthletes: [],
        types: {},
        hideNoMap: false,
        hideGiveGift: false,
        hideClubPosts: false,
        hideChallenges: false,
        hideJoinedChallenges: false,
        hideSuggestedFriends: false,
        hideYourClubs: false,
        hideMyWindsock: false,
        hideSummitbag: false,
        hideRunHealth: false,
        hideWandrer: false,
        hideBandok: false,
        hideCoros: false,
        hideJoinWorkout: false,
        hideCoachCat: false,
        hideAthleteJoinedClub: false,
        hideFooter: false,
        showKudosButton: false,
        minKm: 0,
        maxKm: 0,
        minMins: 0,
        maxMins: 0,
        minElevM: 0,
        maxElevM: 0,
        minPace: 0,
        maxPace: 0,
        unitSystem: 'metric', // 'metric' or 'imperial'
        enabled: true
    };

    const SCRIPT_VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version)
        ? GM_info.script.version
        : 'userscript';

    const TYPES = [
        { key: "Ride", label: "Ride" },
        { key: "Walk", label: "Walk" },
        { key: "VirtualRide", label: "Virtual Ride" },
        { key: "Run", label: "Run" },
        { key: "Swim", label: "Swim" },
        { key: "Hike", label: "Hike" },
        { key: "TrailRun", label: "Trail Run" },
        { key: "MountainBikeRide", label: "Mountain Bike Ride" },
        { key: "GravelRide", label: "Gravel Ride" },
        { key: "EBikeRide", label: "E-Bike Ride" },
        { key: "EMountainBikeRide", label: "E-Mountain Bike Ride" },
        { key: "AlpineSki", label: "Alpine Ski" },
        { key: "Badminton", label: "Badminton" },
        { key: "BackcountrySki", label: "Backcountry Ski" },
        { key: "Canoeing", label: "Canoe" },
        { key: "Crossfit", label: "Crossfit" },
        { key: "Elliptical", label: "Elliptical" },
        { key: "Golf", label: "Golf" },
        { key: "IceSkate", label: "Ice Skate" },
        { key: "InlineSkate", label: "Inline Skate" },
        { key: "Handcycle", label: "Handcycle" },
        { key: "HighIntensityIntervalTraining", label: "HIIT" },
        { key: "Kayaking", label: "Kayaking" },
        { key: "Kitesurf", label: "Kitesurf" },
        { key: "NordicSki", label: "Nordic Ski" },
        { key: "Pickleball", label: "Pickleball" },
        { key: "Pilates", label: "Pilates" },
        { key: "Racquetball", label: "Racquetball" },
        { key: "RockClimbing", label: "Rock Climb" },
        { key: "RollerSki", label: "Roller Ski" },
        { key: "Rowing", label: "Rowing" },
        { key: "Sail", label: "Sail" },
        { key: "Skateboard", label: "Skateboard" },
        { key: "Snowboard", label: "Snowboard" },
        { key: "Snowshoe", label: "Snowshoe" },
        { key: "Soccer", label: "Football (Soccer)" },
        { key: "Squash", label: "Squash" },
        { key: "StandUpPaddling", label: "Stand Up Paddling" },
        { key: "StairStepper", label: "Stair-Stepper" },
        { key: "Surfing", label: "Surfing" },
        { key: "TableTennis", label: "Table Tennis" },
        { key: "Tennis", label: "Tennis" },
        { key: "Velomobile", label: "Velomobile" },
        { key: "VirtualRun", label: "Virtual Run" },
        { key: "VirtualRow", label: "Virtual Rowing" },
        { key: "WeightTraining", label: "Weight Training" },
        { key: "Windsurf", label: "Windsurf" },
        { key: "Wheelchair", label: "Wheelchair" },
        { key: "Workout", label: "Workout" },
        { key: "Yoga", label: "Yoga" }
    ];

    const normalizeTypeLabel = (str = '') => str.toLowerCase().replace(/\s+/g, ' ').trim();
    const condenseTypeLabel = (str = '') => normalizeTypeLabel(str).replace(/[^a-z0-9]/g, '');
    const TYPE_LABEL_METADATA = TYPES.map(t => ({
        ...t,
        normalized: normalizeTypeLabel(t.label),
        condensed: condenseTypeLabel(t.label)
    }));

    const TYPE_SYNONYMS = {
        VirtualRide: /\b(virtual\s*ride)\b/i,
        VirtualRun: /\b(virtual\s*run)\b/i,
        VirtualRow: /\b(virtual\s*row|virtual\s*rowing)\b/i,
        MountainBikeRide: /\b(mountain\s*bike|mtb|mountain\s*ride|mountain\s*biking)\b/i,
        GravelRide: /\b(gravel\s*(ride|spin|ride))\b/i,
        EBikeRide: /\b(e-bike|ebike|electric\s*bike)\b/i,
        EMountainBikeRide: /\b(e-mtb|e-mountain\s*bike)\b/i,
        TrailRun: /\b(trail\s*run|trail-run|trailrun)\b/i,
        Ride: /\b(ride|rode|riding|cycle|cycling|cycled|bike|biked|biking|spin)\b/i,
        Run: /\b(run|ran|running|jog|jogged|jogging)\b/i,
        Walk: /\b(walk|walked|walking|stroll|strolling)\b/i,
        Hike: /\b(hike|hiked|hiking|trek|trekking)\b/i,
        Swim: /\b(swim|swam|swimming)\b/i,
        Workout: /\b(workout|strength\s*training|gym)\b/i,
        Yoga: /\b(yoga)\b/i
    };

    function matchActivityType(rawType) {
        const normalized = normalizeTypeLabel(rawType);
        if (!normalized) return null;

        const exact = TYPE_LABEL_METADATA.find(t => t.normalized === normalized);
        if (exact) return exact;

        const condensed = condenseTypeLabel(rawType);
        const compactMatch = TYPE_LABEL_METADATA.find(t => t.condensed === condensed);
        if (compactMatch) return compactMatch;

        const partialMatches = TYPE_LABEL_METADATA
            .filter(t => normalized.includes(t.normalized))
            .sort((a, b) => b.normalized.length - a.normalized.length);

        if (partialMatches[0]) return partialMatches[0];

        return matchTypeBySynonym(rawType);
    }

    function matchTypeBySynonym(rawType = '') {
        if (!rawType) return null;
        for (const [key, regex] of Object.entries(TYPE_SYNONYMS)) {
            if (regex.test(rawType)) {
                return TYPE_LABEL_METADATA.find(t => t.key === key) || null;
            }
        }
        return null;
    }

    function collectActivityTypeCandidates(activity) {
        const texts = new Set();
        const push = (txt) => {
            if (!txt) return;
            const value = txt.trim();
            if (value) texts.add(value);
        };

        push(activity.querySelector('svg[data-testid="activity-icon"] title, svg[data-testid="activity_icon"] title')?.textContent);
        const icon = activity.querySelector('svg[data-testid="activity-icon"], svg[data-testid="activity_icon"]');
        if (icon) {
            push(icon.getAttribute('aria-label'));
            push(icon.getAttribute('title'));
        }
        push(activity.querySelector('[data-testid="tag"]')?.textContent);
        push(activity.querySelector('.entry-head, .activity-type')?.textContent);
        push(activity.querySelector('[data-testid="entry-header"] button')?.textContent);
        push(activity.querySelector('[data-testid="entry-header"]')?.textContent);
        push(activity.querySelector('[data-testid="activity_name"]')?.textContent);
        push(activity.getAttribute('data-activity-type'));

        return Array.from(texts);
    }

    function resolveActivityType(activity) {
        const candidates = collectActivityTypeCandidates(activity);
        for (const candidate of candidates) {
            const match = matchActivityType(candidate);
            if (match) {
                return { match, raw: candidate };
            }
        }
        return { match: null, raw: candidates[0] || '' };
    }



    // CSS Module - Step 1 of modular refactoring
    function injectStyles() {
        GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
      .sff-clean-btn {
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 2147483647 !important;
        padding: 5px 12px !important;
        background: #fc5200 !important;
        color: white !important;
        border: 1px solid transparent !important;
        cursor: pointer !important;
        font-weight: 700 !important;
        border-radius: 4px !important;
        font-family: 'Roboto', sans-serif !important;
        text-align: center !important;
        transition: background-color 0.15s ease !important;
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 1px !important;
        line-height: 1.2 !important;
      }

      .sff-clean-btn:hover {
        background: #e04a00 !important;
      }

      .sff-btn-title {
        font-size: 14px !important;
        line-height: 1.1 !important;
        text-transform: uppercase !important;
        padding: 3px 6px !important;
        margin-left: 6px !important;
      }

      .sff-clean-btn .sff-btn-sub {
        font-weight: 500 !important;
        text-transform: uppercase !important;
        color: white !important;
        opacity: 1 !important;
        line-height: 1 !important;
      }

      /* Drop the button earlier to avoid covering header buttons */
      @media (max-width: 1460px) {
        .sff-clean-btn {
          top: 56px !important; /* drop below header a bit */
        }
      }

      /* Switch button to left and up; move panel to left as well */
      @media (max-width: 985px) {
        .sff-clean-btn {
          top: 10px !important;
          right: auto !important;
          left: 280px !important; /* shift by roughly button width to clear logo */
        }

        .sff-clean-panel {
          right: auto !important;
          left: 10px !important;
        }
      }

      /* Even smaller screens: keep at top, but push further right to avoid burger */
      @media (max-width: 760px) {
        .sff-clean-btn {
          top: 10px !important; /* remain at top */
          left: 340px !important; /* push further right to clear burger */
          right: auto !important;
        }
      }



      .sff-view-filters, .sff-view-settings {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .sff-view-filters.hidden {
        display: none !important;
      }
      .sff-view-settings {
        display: none !important;
      }
      .sff-view-settings.active {
        display: block !important;
        animation: sff-fade-in 0.2s ease-out;
      }
      
      @keyframes sff-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .sff-settings-btn {
        display: block !important;
        width: 100% !important;
        padding: 10px !important;
        margin-bottom: 10px !important;
        background: white !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        color: #333 !important;
        font-size: 14px !important;
        cursor: pointer !important;
        text-align: center !important;
        font-weight: 500 !important;
        transition: all 0.2s !important;
      }
      .sff-settings-btn:hover {
        background: #f7f7f7 !important;
        border-color: #ccc !important;
        color: #fc5200 !important;
      }
      .sff-settings-btn.danger {
        color: #dc3545 !important;
        border-color: #fadbd8 !important;
      }
      .sff-settings-btn.danger:hover {
        background: #fff5f5 !important;
        border-color: #dc3545 !important;
      }
      
      .sff-file-input {
        display: none !important;
      }

      .sff-clean-panel {
        position: fixed !important;
        top: 60px !important;
        right: 10px !important;
        z-index: 2147483646 !important;
        width: 380px !important;
        min-width: 280px !important;
        max-width: 600px !important;
        min-height: 180px !important;
        max-height: 70vh !important;
        background: white !important;
        border: 2px solid #fc5200 !important;
        border-radius: 8px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
        font-family: Arial, sans-serif !important;
        overflow: visible !important;
        display: none !important;
        visibility: visible !important;
        opacity: 1 !important;
        transition: none !important;
      }
      
      .sff-resize-handle {
        position: absolute !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 20px !important;
        height: 20px !important;
        cursor: ew-resize !important;
        z-index: 10 !important;
        background: linear-gradient(135deg, transparent 50%, #fc5200 50%) !important;
        border-radius: 0 0 6px 0 !important;
      }
      
      .sff-resize-handle:hover {
        background: linear-gradient(135deg, transparent 50%, #e04800 50%) !important;
      }
      
      @media (max-width: 768px) {
        .sff-clean-panel {
          width: 320px !important;
        }
      }

      .sff-clean-panel.show {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .sff-panel-header {
        background: #fc5200 !important;
        padding: 12px 16px !important;
        border-bottom: none !important;
        cursor: move !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        border-radius: 6px 6px 0 0 !important;
      }

      .sff-panel-header h3 {
        margin: 0 !important;
        font-size: 14px !important;
        user-select: none !important;
        color: white !important;
        font-family: 'Poppins', 'Montserrat', sans-serif !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
      }

      .sff-header-main {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100%;
        margin-right: 16px !important;
      }

      .sff-toggle-switch {
        position: relative !important;
        display: inline-block !important;
        width: 34px !important;
        height: 20px !important;
      }

      .sff-toggle-switch input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }

      .sff-slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background-color: #ccc !important;
        transition: .4s !important;
        border-radius: 20px !important;
      }

      .sff-slider:before {
        position: absolute !important;
        content: "" !important;
        height: 14px !important;
        width: 14px !important;
        left: 3px !important;
        bottom: 3px !important;
        background-color: white !important;
        transition: .4s !important;
        border-radius: 50% !important;
      }

      input:checked + .sff-slider {
        background-color: #4CAF50 !important;
      }

      input:checked + .sff-slider:before {
        transform: translateX(14px) !important;
      }

      .sff-clean-panel .sff-section h4 {
        margin: 0 0 10px 0 !important;
        font-size: 13px !important;
        color: #333 !important;
        font-weight: 600 !important;
      }

      .sff-panel-header .sff-close {
        background: none !important;
        border: 1px solid white !important;
        font-size: 22px !important;
        color: white !important;
        cursor: pointer !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        line-height: 1 !important;
      }

      .sff-panel-header .sff-close:hover {
        background: rgba(255,255,255,0.2) !important;
        color: #fc5200 !important;
      }

      .sff-panel-content {
        padding: 16px !important;
        max-height: calc(70vh - 100px) !important;
        overflow-y: scroll !important;
      }

      .sff-clean-panel .sff-row {
        margin: 0 0 16px 0 !important;
        display: block !important;
      }

      .sff-clean-panel .sff-label {
        display: block !important;
        font-size: 14px !important;
        margin-bottom: 6px !important;
        font-weight: 500 !important;
        color: #333 !important;
      }

      .sff-clean-panel .sff-input {
        width: 100% !important;
        padding: 8px 12px !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
        background: white !important;
        color: #333 !important;
      }

      .sff-clean-panel .sff-input:focus {
        outline: none !important;
        border-color: #fc5200 !important;
        box-shadow: 0 0 0 2px rgba(252, 82, 0, 0.1) !important;
      }

      .sff-input-group {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
      }

      .sff-unit-toggle {
        display: flex !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        overflow: hidden !important;
      }

      .sff-unit-btn {
        flex: 1 !important;
        padding: 8px !important;
        border: none !important;
        background: #f7f7f7 !important;
        cursor: pointer !important;
        font-size: 13px !important;
        transition: background-color 0.2s ease !important;
      }

      .sff-unit-btn:not(.active) {
        background: white !important;
        color: #555 !important;
      }

      .sff-unit-btn.active {
        background: #fc5200 !important;
        color: white !important;
        font-weight: 600 !important;
      }

      .sff-unit-btn.metric {
        border-right: 1px solid #ddd !important;
      }

      .sff-dropdown-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        cursor: pointer !important;
        padding: 8px 12px !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        background: #f7f7f7 !important;
        transition: background-color 0.2s ease !important;
      }

      .sff-dropdown-header:hover {
          background: #eee !important;
      }

      .sff-dropdown.open .sff-dropdown-header {
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
      }

      .sff-dropdown-header .sff-label {
        margin-bottom: 0 !important;
      }

      .sff-activity-count {
        font-size: 12px !important;
        color: #666 !important;
      }

      .sff-dropdown-content {
        display: none; /* Initially hidden */
        padding: 12px !important;
        border: 1px solid #ddd !important;
        border-top: none !important;
        border-radius: 0 0 6px 6px !important;
        margin-top: -1px !important;
      }

      .sff-dropdown-right {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .sff-dropdown-indicator {
        transition: transform 0.2s ease !important;
      }

      .sff-dropdown.open .sff-dropdown-indicator {
        transform: rotate(180deg) !important;
      }

      .sff-clean-panel .sff-keywords {
        min-height: 40px !important;
        max-height: 120px !important;
        resize: vertical !important;
        line-height: 1.4 !important;
      }

      .sff-types {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
        gap: 4px 8px !important; /* Increased gap */
        margin-top: 3px !important;
      }
      
      /* Limit to maximum 4 columns */
      @supports (grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))) {
        .sff-types {
          grid-template-columns: repeat(auto-fill, minmax(max(80px, calc(25% - 6px)), 1fr)) !important;
        }
      }

      .sff-clean-panel .sff-chip {
        font-family: 'Roboto', sans-serif !important;
        font-weight: 400 !important;
        font-size: 14px !important; /* Increased for readability */
        display: flex !important;
        align-items: flex-start !important;
        padding: 4px 0 !important;
        border: none !important;
        border-radius: 0 !important;
        line-height: 1.3 !important;
        background: transparent !important;
        cursor: pointer !important;
        transition: none !important;
        user-select: none !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }

      .sff-clean-panel .sff-chip:hover {
        background: transparent !important;
      }

      .sff-clean-panel .sff-chip.checked {
        background: transparent !important;
        color: #333 !important;
        font-weight: 400 !important; /* Ensure it's not bold when checked */
      }

      .sff-clean-panel .sff-chip input {
        margin-right: 4px !important;
        margin-left: 0 !important;
        transform: scale(0.85) !important;
      }

      .sff-switch {
        position: relative !important;
        display: inline-block !important;
        width: 40px !important;
        height: 22px !important;
      }

      .sff-switch input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }

      .sff-slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background-color: #ccc !important;
        transition: .4s !important;
        border-radius: 22px !important;
      }

      .sff-slider:before {
        position: absolute !important;
        content: "" !important;
        height: 16px !important;
        width: 16px !important;
        left: 3px !important;
        bottom: 3px !important;
        background-color: white !important;
        transition: .4s !important;
        border-radius: 50% !important;
      }

      input:checked + .sff-slider {
        background-color: #fc5200 !important;
      }

      input:checked + .sff-slider:before {
        transform: translateX(18px) !important;
      }

      .sff-toggle-section {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        margin-bottom: 16px !important;
      }

      .sff-clean-panel .sff-section {
        margin-bottom: 16px !important;
      }


      .sff-clean-panel .sff-buttons {
        display: flex !important;
        gap: 8px !important;
        justify-content: center !important;
        margin-top: 16px !important;
        padding-top: 12px !important;
        border-top: 1px solid #eee !important;
      }

      .sff-header-kudos-btn {
        padding: 6px 12px !important; /* Align with gift button */
        background: #fc5200 !important;
        color: white !important;
        border: 1px solid transparent !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        text-decoration: none !important;
        font-family: 'Roboto', sans-serif !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        line-height: 1.2 !important;
        transition: background-color 0.15s ease !important;
      }

      .sff-header-kudos-btn:hover {
        background: #e04a00 !important;
      }

      .sff-desc {
        font-size: 11px !important;
        color: #666 !important;
        margin: -2px 0 8px 22px !important;
      }

      .sff-clean-panel .sff-buttons button {
        padding: 6px 12px !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        font-weight: 500 !important;
      }

      .sff-clean-panel .sff-save {
        background: #fc5200 !important;
        color: white !important;
        border-color: #fc5200 !important;
      }

      .sff-clean-panel .sff-save:hover {
        background: #e04700 !important;
        border-color: #e04700 !important;
      }

      .sff-clean-panel .sff-reset {
        background: white !important;
        color: #fc5200 !important;
        border-color: #fc5200 !important;
      }

      .sff-clean-panel .sff-reset:hover {
        background: rgba(252, 82, 0, 0.05) !important;
        color: #e04700 !important;
        border-color: #e04700 !important;
      }

      .sff-footer {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-top: 12px !important;
        padding: 8px 12px !important;
        background: #f8f9fa !important;
        border: 1px solid #e9ecef !important;
        border-radius: 6px !important;
        gap: 8px !important;
      }

      .sff-credits {
        text-align: left !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
        border: none !important;
        border-radius: 0 !important;
        font-size: 11px !important;
        color: #666 !important;
        flex: 1 !important;
      }

      .sff-credits p {
        margin: 0 !important;
        line-height: 1.3 !important;
      }

      .sff-credits p:first-child {
        font-weight: 600 !important;
        color: #333 !important;
      }

      .sff-credits a {
        color: #fc5200 !important;
        text-decoration: none !important;
        font-weight: 700 !important;
        transition: color 0.2s ease !important;
      }

      .sff-credits a:hover {
        color: #e04a00 !important;
        text-decoration: underline !important;
      }

      .sff-bmc {
        text-align: right !important;
        margin: 0 !important;
        padding: 0 !important;
        border-top: none !important;
        flex-shrink: 0 !important;
      }

      .sff-bmc a {
        display: inline-block !important;
        padding: 8px 16px !important;
        background: #FC5200 !important;
        color: #fff !important;
        text-decoration: none !important;
        border-radius: 6px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        transition: all 0.2s !important;
      }

      .sff-bmc a:hover {
        background: #e04a00 !important;
      }

      .sff-copyright {
        text-align: center !important;
        margin-top: 6px !important;
        padding-top: 6px !important;
        border-top: 1px solid #eee !important;
        font-size: 9px !important;
        color: #aaa !important;
      }

      .sff-copyright p {
        margin: 0 !important;
        line-height: 1.2 !important;
      }

      /* Secondary navigation row for smaller screens */
      .sff-secondary-nav {
        position: fixed !important;
        top: 55px !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 10 !important;
        background: white !important;
        border-bottom: 1px solid #e5e5e5 !important;
        padding: 8px 16px !important;
        display: none !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 12px !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
      }

      /* Show secondary nav on smaller screens ONLY on dashboard */
      @media (max-width: 1479px) {
        body[data-sff-dashboard="true"] .sff-secondary-nav {
          display: flex !important;
        }

        /* Hide main filter button on smaller screens ONLY on dashboard */
        body[data-sff-dashboard="true"] .sff-clean-btn {
          display: none !important;
        }

        /* Hide main header kudos button on smaller screens ONLY on dashboard */
        body[data-sff-dashboard="true"] #gj-kudos-li {
          display: none !important;
        }

        /* Adjust page content to account for secondary nav ONLY on dashboard */
        body[data-sff-dashboard="true"] {
          padding-top: 60px !important;
        }

        /* Additional margin for main content area to ensure no overlap */
        body[data-sff-dashboard="true"] main,
        body[data-sff-dashboard="true"] .view {
          margin-top: 8px !important;
        }
      }

      /* Secondary nav filter button */
      .sff-secondary-filter-btn {
        padding: 6px 12px !important;
        background: #fc5200 !important;
        color: white !important;
        border: 1px solid transparent !important;
        cursor: pointer !important;
        font-weight: 700 !important;
        border-radius: 4px !important;
        font-family: 'Roboto', sans-serif !important;
        text-align: center !important;
        transition: background-color 0.15s ease !important;
        font-size: 14px !important;
        line-height: 1.2 !important;
        text-transform: uppercase !important;
        position: relative !important;
        z-index: 1000 !important;
      }

      .sff-secondary-filter-btn:hover {
        background: #e04a00 !important;
      }

      /* Secondary nav kudos button */
      .sff-secondary-kudos-btn {
        padding: 6px 12px !important;
        background: #fc5200 !important;
        color: white !important;
        border: 1px solid transparent !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        text-decoration: none !important;
        font-family: 'Roboto', sans-serif !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        line-height: 1.2 !important;
        transition: background-color 0.15s ease !important;
        position: relative !important;
        z-index: 1000 !important;
      }

      .sff-secondary-kudos-btn:hover {
        background: #e04a00 !important;
      }
        `);
    }

    // Initialize CSS Module
    injectStyles();

    // Utilities Module - Step 2 of modular refactoring
    const UtilsModule = {
        // Settings management
        loadSettings() {
            let s;
            try {
                s = JSON.parse(localStorage.getItem(STORAGE_KEY));
            } catch(e) {}
            return s ? {...DEFAULTS, ...s} : {...DEFAULTS};
        },

        updateCommuteTagVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                activities.forEach(activity => {
                    const tags = Array.from(activity.querySelectorAll('[data-testid="tag"]')).map(el => (el.textContent || '').trim().toLowerCase());
                    const isCommute = tags.some(t => t === 'commute');
                    if (isCommute) {
                        if (settings.enabled && settings.hideCommuteTag) {
                            if (activity.dataset.sffHiddenCommute !== 'sff') {
                                activity.dataset.sffHiddenCommute = 'sff';
                                activity.style.display = 'none';
                            }
                        } else if (activity.dataset.sffHiddenCommute === 'sff') {
                            activity.style.display = '';
                            delete activity.dataset.sffHiddenCommute;
                        }
                    }
                });
            } catch (e) {
                console.warn('updateCommuteTagVisibility error:', e);
            }
        },

        saveSettings(s) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
            } catch(e) {
                console.error('Error saving settings:', e);
            }
        },

        // Debounce helper
        debounce(fn, wait) {
            let t;
            return function(...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        },

        // Page detection
        isOnDashboard() {
            return window.location.pathname === '/dashboard' || window.location.pathname === '/';
        },

        // Data parsing utilities
        parseDurationSeconds(activityEl) {
            const timeLi = [...activityEl.querySelectorAll('li')].find(li => {
                const label = li.querySelector('span');
                return label && label.textContent.trim().toLowerCase() === 'time';
            });
            if (!timeLi) return null;

            const value = timeLi.querySelector('.vNsSU') || timeLi;
            if (!value) return null;

            let h = 0, m = 0, s = 0;
            const abbrs = value.querySelectorAll('abbr.unit');
            if (!abbrs.length) {
                const t = (value.textContent || '').trim();
                if (!t) return null;
                if (t.includes(':')) {
                    const parts = t.split(':').map(x => parseInt(x.trim(), 10));
                    if (parts.every(n => Number.isFinite(n))) {
                        if (parts.length === 3) [h, m, s] = parts;
                        else if (parts.length === 2) [m, s] = parts;
                        else if (parts.length === 1) m = parts[0];
                        return h * 3600 + m * 60 + s;
                    }
                }
                const maybe = parseFloat(t);
                return Number.isFinite(maybe) ? Math.round(maybe * 60) : null;
            }

            abbrs.forEach(abbr => {
                const unit = (abbr.getAttribute('title') || '').toLowerCase();
                const numText = (abbr.previousSibling && abbr.previousSibling.textContent) ? abbr.previousSibling.textContent.trim() : '';
                const num = parseInt(numText, 10);
                if (!Number.isFinite(num)) return;
                if (unit.includes('hour')) h = num;
                else if (unit.includes('minute')) m = num;
                else if (unit.includes('second')) s = num;
            });
            return h * 3600 + m * 60 + s;
        },

        parseDistanceKm(activityEl) {
            const distLi = [...activityEl.querySelectorAll('li')].find(li => {
                const label = li.querySelector('span');
                return label && label.textContent.trim().toLowerCase() === 'distance';
            });
            if (!distLi) return null;

            const value = distLi.querySelector('.vNsSU') || distLi;
            if (!value) return null;

            const abbr = value.querySelector('abbr.unit');
            const text = (value.textContent || '').trim();
            let num = NaN;
            if (abbr && abbr.previousSibling && abbr.previousSibling.textContent) {
                num = parseFloat(abbr.previousSibling.textContent.trim());
            }
            if (!Number.isFinite(num)) {
                const m = text.match(/([0-9]+(?:\.[0-9]+)?)/);
                if (m) num = parseFloat(m[1]);
            }
            if (!Number.isFinite(num)) return null;

            const unitTitle = (abbr && abbr.getAttribute('title')) ? abbr.getAttribute('title').toLowerCase() : '';
            if (unitTitle.includes('kilometer')) return num;
            if (unitTitle.includes('mile')) return num * 1.60934;
            if (unitTitle.includes('meter')) return num / 1000;
            if (unitTitle.includes('yard')) return num * 0.0009144;
            if (unitTitle.includes('foot') || unitTitle.includes('feet')) return num * 0.0003048;
            return num; // assume km if unknown
        },

        parseElevationM(activityEl) {
            const elevLi = [...activityEl.querySelectorAll('li')].find(li => {
                const label = li.querySelector('span');
                return label && (label.textContent.trim().toLowerCase() === 'elev gain' || label.textContent.trim().toLowerCase() === 'elevation gain');
            });
            if (!elevLi) return null;

            const value = elevLi.querySelector('.vNsSU') || elevLi;
            if (!value) return null;

            const text = (value.textContent || '').trim().replace(/,/g, ''); // remove commas from thousands
            let num = parseFloat(text);

            if (!Number.isFinite(num)) return null;

            const abbr = value.querySelector('abbr.unit');
            const unitTitle = (abbr && abbr.getAttribute('title')) ? abbr.getAttribute('title').toLowerCase() : '';

            if (unitTitle.includes('foot') || unitTitle.includes('feet')) return num * 0.3048;
            // assume meters if no unit or meters
            return num;
        }
    };

    // UI Module - Step 3 of modular refactoring
    const UIModule = {
        updateActivityCount(panel) {
            const countEl = panel.querySelector('.sff-activity-count');
            if (!countEl) return;

            const total = TYPES.length;
            const hidden = panel.querySelectorAll('.sff-types input[type="checkbox"]:checked').length;
            countEl.textContent = `(${hidden} hidden / ${total} total)`;
        },

        updateFilterLabels(panel, unitSystem) {
            const isMetric = unitSystem === 'metric';
            panel.querySelector('[data-label-type="distance"]').textContent = `Distance (${isMetric ? 'km' : 'mi'}):`;
            panel.querySelector('[data-label-type="elevation"]').textContent = `Elevation Gain (${isMetric ? 'm' : 'ft'}):`;
            panel.querySelector('[data-label-type="pace"]').textContent = `Pace for Runs (${isMetric ? 'min/km' : 'min/mi'}):`;
        },

        showToast(panel, message, type = 'success') {
            const toast = panel.querySelector('.sff-toast');
            if (!toast) return;

            toast.textContent = message;
            toast.className = `sff-toast ${type} show`;

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        },

        applySettings(panel) {
            settings.keywords = panel.querySelector('.sff-keywords').value
                .split(',')
                .map(x => x.trim())
                .filter(Boolean);

            settings.allowedAthletes = panel.querySelector('.sff-allowed-athletes').value
                .split(',')
                .map(x => x.trim())
                .filter(Boolean);

            settings.ignoredAthletes = panel.querySelector('.sff-ignored-athletes').value
                .split(',')
                .map(x => x.trim())
                .filter(Boolean);

            settings.minKm = +panel.querySelector('.sff-minKm').value || 0;
            settings.maxKm = +panel.querySelector('.sff-maxKm').value || 0;
            settings.minMins = +panel.querySelector('.sff-minMins').value || 0;
            settings.maxMins = +panel.querySelector('.sff-maxMins').value || 0;
            settings.minElevM = +panel.querySelector('.sff-minElevM').value || 0;
            settings.maxElevM = +panel.querySelector('.sff-maxElevM').value || 0;
            settings.minPace = +panel.querySelector('.sff-minPace').value || 0;
            settings.maxPace = +panel.querySelector('.sff-maxPace').value || 0;
            settings.unitSystem = panel.querySelector('.sff-unit-btn.active').dataset.unit;
            settings.hideNoMap = panel.querySelector('.sff-hideNoMap').checked;
            settings.hideClubPosts = panel.querySelector('.sff-hideClubPosts').checked;
            settings.hideChallenges = panel.querySelector('.sff-hideChallenges').checked;
            settings.hideJoinedChallenges = panel.querySelector('.sff-hideJoinedChallenges') ? panel.querySelector('.sff-hideJoinedChallenges').checked : settings.hideJoinedChallenges;
            settings.hideSuggestedFriends = panel.querySelector('.sff-hideSuggestedFriends').checked;
            settings.hideYourClubs = panel.querySelector('.sff-hideYourClubs').checked;
            settings.hideMyWindsock = panel.querySelector('.sff-hideMyWindsock').checked;
            settings.hideSummitbag = panel.querySelector('.sff-hideSummitbag').checked;
            settings.hideRunHealth = panel.querySelector('.sff-hideRunHealth').checked;
            settings.hideWandrer = panel.querySelector('.sff-hideWandrer') ? panel.querySelector('.sff-hideWandrer').checked : settings.hideWandrer;
            settings.hideBandok = panel.querySelector('.sff-hideBandok') ? panel.querySelector('.sff-hideBandok').checked : settings.hideBandok;
            settings.hideCoros = panel.querySelector('.sff-hideCoros') ? panel.querySelector('.sff-hideCoros').checked : settings.hideCoros;
            settings.hideCommuteTag = panel.querySelector('.sff-hideCommuteTag') ? panel.querySelector('.sff-hideCommuteTag').checked : settings.hideCommuteTag;
            settings.hideJoinWorkout = panel.querySelector('.sff-hideJoinWorkout') ? panel.querySelector('.sff-hideJoinWorkout').checked : settings.hideJoinWorkout;
            settings.hideCoachCat = panel.querySelector('.sff-hideCoachCat') ? panel.querySelector('.sff-hideCoachCat').checked : settings.hideCoachCat;
            settings.hideAthleteJoinedClub = panel.querySelector('.sff-hideAthleteJoinedClub') ? panel.querySelector('.sff-hideAthleteJoinedClub').checked : settings.hideAthleteJoinedClub;
            settings.hideFooter = panel.querySelector('.sff-hideFooter') ? panel.querySelector('.sff-hideFooter').checked : settings.hideFooter;
            settings.showKudosButton = panel.querySelector('.sff-showKudosButton').checked;
            LogicModule.manageHeaderKudosButton(); // Update button immediately on apply
            UIModule.syncSecondaryKudosVisibility(); // Sync secondary button visibility
            const giftChk = panel.querySelector('.sff-hideGift');
            settings.hideGiveGift = giftChk ? giftChk.checked : settings.hideGiveGift;

            settings.types = {};
            panel.querySelectorAll('input[type=checkbox][data-typ]').forEach(input => {
                settings.types[input.dataset.typ] = input.checked;
            });

            UtilsModule.saveSettings(settings);
            console.log('💾 Settings saved:', settings);
        },

        createElements() {
            console.log('🔧 Clean Filter: Creating elements...');

            // Remove existing
            document.querySelectorAll('.sff-clean-btn, .sff-clean-panel, .sff-secondary-nav').forEach(el => el.remove());

            // Only create elements on dashboard
            const isDashboardPage = UtilsModule.isOnDashboard();

            // Set dashboard attribute for CSS targeting
            if (isDashboardPage) {
                document.body.setAttribute('data-sff-dashboard', 'true');
            } else {
                document.body.removeAttribute('data-sff-dashboard');
                // On non-dashboard pages, apply global and embed settings
                LogicModule.updateGiftVisibility();
                LogicModule.updateChallengesVisibility();
                LogicModule.updateSuggestedFriendsVisibility();
                LogicModule.updateYourClubsVisibility();
                LogicModule.updateMyWindsockVisibility();
                LogicModule.updateSummitbagVisibility();
                LogicModule.updateRunHealthVisibility();
                LogicModule.updateBandokVisibility();
                LogicModule.updateCorosVisibility();
                LogicModule.updateJoinWorkoutVisibility();
                LogicModule.updateCoachCatVisibility();
                LogicModule.updateAthleteJoinedClubVisibility();
                return; // Exit early, no UI elements needed on non-dashboard pages
            }

            // Create secondary navigation row
            const secondaryNav = document.createElement('div');
            secondaryNav.className = 'sff-secondary-nav';

            // Create secondary filter button
            const secondaryFilterElement = document.createElement('button');
            secondaryFilterElement.className = 'sff-secondary-filter-btn';
            secondaryFilterElement.innerHTML = 'Filter <span class="sff-btn-sub">(0)</span>';

            // Create secondary kudos button (will be shown/hidden based on settings)
            const secondaryKudosElement = document.createElement('a');
            secondaryKudosElement.className = 'sff-secondary-kudos-btn';
            secondaryKudosElement.href = 'javascript:void(0);';
            secondaryKudosElement.textContent = 'Give 👍 to Everyone';
            // Use setProperty with !important to override CSS rules
            secondaryKudosElement.style.setProperty('display', settings.showKudosButton ? 'inline-flex' : 'none', 'important');

            secondaryNav.appendChild(secondaryKudosElement);
            secondaryNav.appendChild(secondaryFilterElement);
            document.body.appendChild(secondaryNav);

            // Ensure secondary kudos button visibility is properly synchronized
            this.syncSecondaryKudosVisibility();

            // Create button
            const btn = document.createElement('button');
            btn.className = 'sff-clean-btn';
            btn.innerHTML = '<span class="sff-btn-title">Filter <span class="sff-btn-sub">(0)</span></span>';
            btn.style.position = 'fixed';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.zIndex = '2147483647';

            // Create panel using helper method
            const panel = this._createPanel();

            document.body.appendChild(btn);
            document.body.appendChild(panel);

            console.log('✅ Clean Filter: Elements added');

            // Get secondary elements (we're only on dashboard at this point)
            const secondaryFilterBtn = document.querySelector('.sff-secondary-filter-btn');
            const secondaryKudosBtn = document.querySelector('.sff-secondary-kudos-btn');

            this.setupEvents(btn, panel, secondaryFilterBtn, secondaryKudosBtn);
            return { btn, panel, secondaryFilterBtn, secondaryKudosBtn };
        },

        // Synchronize secondary kudos button visibility with settings
        syncSecondaryKudosVisibility() {
            const secondaryKudosBtn = document.querySelector('.sff-secondary-kudos-btn');
            if (secondaryKudosBtn) {
                const shouldShow = settings.enabled && settings.showKudosButton;
                // Use setProperty with !important to override CSS rules
                secondaryKudosBtn.style.setProperty('display', shouldShow ? 'inline-flex' : 'none', 'important');
                console.log('🔄 Secondary kudos button visibility updated:', shouldShow ? 'visible' : 'hidden');
            }
        },

        _createPanel() {
            const panel = document.createElement('div');
            panel.className = 'sff-clean-panel';

            // Set initial styles - ensure it's hidden by default
            panel.style.position = 'fixed';
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
            panel.style.opacity = '0';
            panel.style.zIndex = '2147483646';
            panel.style.width = '320px';
            panel.style.right = '10px';
            panel.style.top = '60px';
            panel.style.transition = 'opacity 0.2s ease, visibility 0.2s';

            // Load position
            const savedPos = JSON.parse(localStorage.getItem('sffPanelPos') || '{}');
            if (savedPos.left || savedPos.top) {
                panel.style.left = savedPos.left || '';
                panel.style.right = savedPos.left ? 'auto' : '10px';
                panel.style.top = savedPos.top || '60px';
            }

            // Build panel content sections
            const header = this._createPanelHeader();
            const content = this._createPanelContent();
            const resizeHandle = this._createResizeHandle();

            panel.appendChild(header);
            panel.appendChild(content);
            panel.appendChild(resizeHandle);

            return panel;
        },

        _createResizeHandle() {
            const handle = document.createElement('div');
            handle.className = 'sff-resize-handle';
            handle.title = 'Drag to resize';
            return handle;
        },

        _createPanelHeader() {
            const header = document.createElement('div');
            header.className = 'sff-panel-header';
            header.innerHTML = `
                <div class="sff-header-main">
                    <h3>Strava Feed Filter</h3>
                </div>
                <button class="sff-close">×</button>
            `;
            return header;
        },

        _createPanelContent() {
            const content = document.createElement('div');
            content.className = 'sff-panel-content';
            content.innerHTML = this._getPanelHTML();
            return content;
        },

        _getPanelHTML() {
            return `
                <div class="sff-toast"></div>
                <div class="sff-view-filters">
                <div class="sff-toggle-section">
                    <label class="sff-switch">
                        <input type="checkbox" class="sff-enabled-toggle" ${settings.enabled ? 'checked' : ''}>
                        <span class="sff-slider"></span>
                    </label>
                    <span class="sff-label">
                        <span class="sff-toggle-text">FILTER ${settings.enabled ? 'ON' : 'OFF'}</span>
                    </span>
                    <button class="sff-settings-toggle" title="Settings" style="margin-left: auto; color: #666; font-size: 20px; border: none; background: none; cursor: pointer; padding: 4px; line-height: 1; opacity: 0.8; transition: opacity 0.2s;">⚙️</button>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Keywords to Hide</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <textarea class="sff-input sff-keywords" placeholder="e.g. warm up, cool down">${settings.keywords.join(', ')}</textarea>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Allowed Athletes</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <textarea class="sff-input sff-allowed-athletes" placeholder="e.g. John Doe, Jane Smith">${settings.allowedAthletes.join(', ')}</textarea>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Ignore Athletes</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <textarea class="sff-input sff-ignored-athletes" placeholder="e.g. John Doe, Jane Smith">${settings.ignoredAthletes.join(', ')}</textarea>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Activity Types</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-activity-count"></span>
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <div class="sff-types-actions">
                            <button type="button" class="sff-types-select" data-action="select-all">Select All</button>
                            <button type="button" class="sff-types-select" data-action="clear-all">Clear All</button>
                        </div>
                        <div class="sff-types">
                            ${TYPES.map(t => `
                                <label class="sff-chip ${settings.types[t.key] ? 'checked' : ''}">
                                    <input type="checkbox" data-typ="${t.key}" ${settings.types[t.key] ? 'checked' : ''}>
                                    ${t.label}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Min/Max Filters</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <div class="sff-row">
                            <label class="sff-label">Unit System</label>
                            <div class="sff-unit-toggle">
                                <button class="sff-unit-btn metric ${settings.unitSystem === 'metric' ? 'active' : ''}" data-unit="metric">Metric</button>
                                <button class="sff-unit-btn imperial ${settings.unitSystem === 'imperial' ? 'active' : ''}" data-unit="imperial">Imperial</button>
                            </div>
                        </div>
                        <div class="sff-row">
                            <label class="sff-label" data-label-type="distance">Distance (km):</label>
                            <div class="sff-input-group">
                                <input type="number" class="sff-input sff-minKm" min="0" step="0.1" value="${settings.minKm || ''}" placeholder="Min">
                                <input type="number" class="sff-input sff-maxKm" min="0" step="0.1" value="${settings.maxKm || ''}" placeholder="Max">
                            </div>
                        </div>
                        <div class="sff-row">
                            <label class="sff-label" data-label-type="duration">Duration (minutes):</label>
                            <div class="sff-input-group">
                                <input type="number" class="sff-input sff-minMins" min="0" value="${settings.minMins || ''}" placeholder="Min">
                                <input type="number" class="sff-input sff-maxMins" min="0" value="${settings.maxMins || ''}" placeholder="Max">
                            </div>
                        </div>
                        <div class="sff-row">
                            <label class="sff-label" data-label-type="elevation">Elevation Gain (m):</label>
                            <div class="sff-input-group">
                                <input type="number" class="sff-input sff-minElevM" min="0" value="${settings.minElevM || ''}" placeholder="Min">
                                <input type="number" class="sff-input sff-maxElevM" min="0" step="0.1" value="${settings.maxElevM || ''}" placeholder="Max">
                            </div>
                        </div>
                        <div class="sff-row">
                            <label class="sff-label" data-label-type="pace">Pace for Runs (min/km):</label>
                            <div class="sff-input-group">
                                <input type="number" class="sff-input sff-minPace" min="0" step="0.1" value="${settings.minPace || ''}" placeholder="Min (Slowest)">
                                <input type="number" class="sff-input sff-maxPace" min="0" step="0.1" value="${settings.maxPace || ''}" placeholder="Max (Fastest)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">External Service Embeds</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <label class="sff-chip ${settings.hideMyWindsock ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideMyWindsock" ${settings.hideMyWindsock ? 'checked' : ''}>
                            Hide "myWindsock Report"
                        </label>
                        <label class="sff-chip ${settings.hideSummitbag ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideSummitbag" ${settings.hideSummitbag ? 'checked' : ''}>
                            Hide "summitbag.com"
                        </label>
                        <label class="sff-chip ${settings.hideRunHealth ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideRunHealth" ${settings.hideRunHealth ? 'checked' : ''}>
                            Hide "Run Health"
                        </label>
                        <label class="sff-chip ${settings.hideWandrer ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideWandrer" ${settings.hideWandrer ? 'checked' : ''}>
                            Hide "Wandrer" embeds
                        </label>
                        <label class="sff-chip ${settings.hideBandok ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideBandok" ${settings.hideBandok ? 'checked' : ''}>
                            Hide "Bandok.com"
                        </label>
                        <label class="sff-chip ${settings.hideCoros ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideCoros" ${settings.hideCoros ? 'checked' : ''}>
                            Hide "COROS"
                        </label>
                        <label class="sff-chip ${settings.hideJoinWorkout ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideJoinWorkout" ${settings.hideJoinWorkout ? 'checked' : ''}>
                            Hide "JOIN workout"
                        </label>
                        <label class="sff-chip ${settings.hideCoachCat ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideCoachCat" ${settings.hideCoachCat ? 'checked' : ''}>
                            Hide "CoachCat Training Summary"
                        </label>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Sidebar</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <label class="sff-chip ${settings.hideChallenges ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideChallenges" ${settings.hideChallenges ? 'checked' : ''}>
                            Hide your challenges section
                        </label>
                        <label class="sff-chip ${settings.hideSuggestedFriends ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideSuggestedFriends" ${settings.hideSuggestedFriends ? 'checked' : ''}>
                            Hide "Suggested Friends" section
                        </label>
                        <label class="sff-chip ${settings.hideYourClubs ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideYourClubs" ${settings.hideYourClubs ? 'checked' : ''}>
                            Hide "Your Clubs" section
                        </label>
                        <label class="sff-chip ${settings.hideFooter ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideFooter" ${settings.hideFooter ? 'checked' : ''}>
                            Hide Strava footer
                        </label>
                    </div>
                </div>
                <div class="sff-row sff-dropdown">
                    <div class="sff-dropdown-header">
                        <span class="sff-label">Other</span>
                        <div class="sff-dropdown-right">
                            <span class="sff-dropdown-indicator">▼</span>
                        </div>
                    </div>
                    <div class="sff-dropdown-content">
                        <label class="sff-chip ${settings.hideNoMap ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideNoMap" ${settings.hideNoMap ? 'checked' : ''}>
                            Hide activities without map
                        </label>
                        <label class="sff-chip ${settings.hideCommuteTag ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideCommuteTag" ${settings.hideCommuteTag ? 'checked' : ''}>
                            Hide commute (tag)
                        </label>
                        <label class="sff-chip ${settings.hideJoinedChallenges ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideJoinedChallenges" ${settings.hideJoinedChallenges ? 'checked' : ''}>
                            Hide "Athlete joined a challenge"
                        </label>
                        <label class="sff-chip ${settings.hideAthleteJoinedClub ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideAthleteJoinedClub" ${settings.hideAthleteJoinedClub ? 'checked' : ''}>
                            Hide "Athlete joined a club"
                        </label>
                        <label class="sff-chip ${settings.hideClubPosts ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideClubPosts" ${settings.hideClubPosts ? 'checked' : ''}>
                            Hide club posts
                        </label>
                        <label class="sff-chip ${settings.hideGiveGift ? 'checked' : ''}">
                            <input type="checkbox" class="sff-hideGift" ${settings.hideGiveGift ? 'checked' : ''}>
                            Hide "Give a Gift" button
                        </label>
                        <label class="sff-chip ${settings.showKudosButton ? 'checked' : ''}">
                            <input type="checkbox" class="sff-showKudosButton" ${settings.showKudosButton ? 'checked' : ''}>
                            Show "Give 👍 to Everyone"
                        </label>
                        <p class="sff-desc">Adds a button to the header to give kudos to all visible activities.</p>
                    </div>
                </div>
                <div class="sff-buttons">
                    <button class="sff-btn-action sff-save">Apply & Refresh</button>
                    <button class="sff-btn-action sff-reset">Reset</button>
                </div>
                <div class="sff-footer">
                    <div class="sff-credits">
                        <p>Developed By: <a href="https://github.com/Inc21" target="_blank">Inc21</a></p>
                    </div>
                    <div class="sff-bmc">
                        <a href="https://www.buymeacoffee.com/inc21" target="_blank">☕ Buy me a coffee</a>
                    </div>
                </div>
                <div class="sff-copyright">
                    <p>Report a bug or dead filter: <a href="https://github.com/Inc21/Tempermonkey-Strava-Feed-Filter/issues" target="_blank">HERE</a></p>
                    <p id="sff-version" style="font-size: 0.85em; opacity: 0.7; margin-top: 5px;">Version</p>
                </div>
            </div>

            <div class="sff-view-settings">
                <button class="sff-back-btn" style="background: none; border: none; cursor: pointer; color: #fc5200; font-weight: 600; font-size: 14px; padding: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 4px;">
                    ← Back to Filters
                </button>
                <p class="sff-settings-desc">
                    Manage your Strava Feed Filter settings. You can back up your configuration or restore from a previous backup.
                </p>
                
                <button class="sff-settings-btn sff-action-export">Export Settings</button>
                <button class="sff-settings-btn sff-action-import">Import Settings</button>
                <input type="file" class="sff-file-input sff-file-import" accept=".json">
                
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
                
                <button class="sff-settings-btn danger sff-action-reset">Reset to Defaults</button>
            </div>
        `
    },

    setupEvents(btn, panel, secondaryFilterBtn, secondaryKudosBtn) {
        // Track if we're currently resizing to prevent click-outside from firing
        let isCurrentlyResizing = false;

        // Initialize draggable and resizable
        const cleanupDraggable = this.makeDraggable(panel);
        const cleanupResizable = this.makeResizable(panel, () => {
            isCurrentlyResizing = true;
        }, () => {
            isCurrentlyResizing = false;
        });

        // Load saved position
            const savedPos = JSON.parse(localStorage.getItem('sffPanelPos') || '{}');
            if (savedPos.left || savedPos.top) {
                panel.style.left = savedPos.left || '';
                panel.style.top = savedPos.top || '';
                panel.style.right = savedPos.left ? 'auto' : '10px';
            }

            // Ensure panel is in viewport on load
            setTimeout(() => this.keepInViewport(panel), 100);

            // Handle window resize
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Sync secondary kudos button visibility on resize
                    this.syncSecondaryKudosVisibility();

                    // Update position to stay in viewport (without hiding panel)
                    this.keepInViewport(panel);

                    // Save new position
                    localStorage.setItem('sffPanelPos', JSON.stringify({
                        left: panel.style.left,
                        top: panel.style.top
                    }));
                }, 100);
            };

            window.addEventListener('resize', handleResize);

            // Settings view toggle (gear icon)
            const settingsToggle = panel.querySelector('.sff-settings-toggle');
            const filtersView = panel.querySelector('.sff-view-filters');
            const settingsView = panel.querySelector('.sff-view-settings');
            const backBtn = panel.querySelector('.sff-back-btn');

            if (settingsToggle && filtersView && settingsView) {
                settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    filtersView.classList.add('hidden');
                    settingsView.classList.add('active');
                    settingsToggle.style.opacity = '0';
                    settingsToggle.style.pointerEvents = 'none';
                });
            }

            if (backBtn && filtersView && settingsView && settingsToggle) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    settingsView.classList.remove('active');
                    filtersView.classList.remove('hidden');
                    settingsToggle.style.opacity = '0.8';
                    settingsToggle.style.pointerEvents = 'auto';
                });
            }

            // Settings actions (export / import / reset)
            const exportBtn = panel.querySelector('.sff-action-export');
            if (exportBtn) {
                exportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    try {
                        const exportData = {
                            version: SCRIPT_VERSION,
                            exportDate: new Date().toISOString(),
                            settings
                        };

                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `strava-feed-filter-settings-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        this.showToast(panel, 'Settings exported successfully!', 'success');
                    } catch (err) {
                        console.error('Export failed:', err);
                        this.showToast(panel, 'Export failed. See console.', 'error');
                    }
                });
            }

            const importBtn = panel.querySelector('.sff-action-import');
            const fileInput = panel.querySelector('.sff-file-import');
            if (importBtn && fileInput) {
                importBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const imported = JSON.parse(ev.target?.result);
                            const newSettings = imported.settings || imported;
                            if (!newSettings || typeof newSettings !== 'object') {
                                throw new Error('Invalid settings format');
                            }

                            settings = { ...DEFAULTS, ...newSettings };
                            UtilsModule.saveSettings(settings);
                            this.showToast(panel, 'Settings imported! Reloading...', 'success');
                            setTimeout(() => location.reload(), 1500);
                        } catch (err) {
                            console.error('Import failed:', err);
                            this.showToast(panel, 'Import failed: Invalid file.', 'error');
                        }
                    };
                    reader.onerror = () => {
                        this.showToast(panel, 'Failed to read file.', 'error');
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                });
            }

            const resetBtn = panel.querySelector('.sff-action-reset');
            if (resetBtn) {
                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to reset all filters to their default values? This cannot be undone.')) {
                        settings = { ...DEFAULTS };
                        UtilsModule.saveSettings(settings);
                        this.showToast(panel, 'Settings reset! Reloading...', 'success');
                        setTimeout(() => location.reload(), 1500);
                    }
                });
            }

            const versionEl = panel.querySelector('#sff-version');
            if (versionEl) {
                versionEl.textContent = `Version ${SCRIPT_VERSION}`;
            }

            // Handle click outside (define first)
            const handleClickOutside = (e) => {
                // Don't close if we're currently resizing or just finished resizing
                if (isCurrentlyResizing) {
                    return;
                }
                
                const clickedSecondaryBtn = secondaryFilterBtn && secondaryFilterBtn.contains(e.target);
                if (!panel.contains(e.target) && !btn.contains(e.target) && !clickedSecondaryBtn) {
                    const isVisible = panel.style.display === 'block' && panel.style.visibility !== 'hidden';
                    if (isVisible) {
                        togglePanel();
                    }
                }
            };

            // Toggle panel function
            const togglePanel = () => {
                const isVisible = panel.style.display === 'block' && panel.style.visibility !== 'hidden';
                console.log('🔄 Toggle panel called. Currently visible:', isVisible);

                if (!isVisible) {
                    console.log('📁 Showing panel...');
                    // Close all dropdowns before showing the panel
                    panel.querySelectorAll('.sff-dropdown.open').forEach(dropdown => {
                        dropdown.classList.remove('open');
                        const content = dropdown.querySelector('.sff-dropdown-content');
                        if (content) content.style.display = 'none';
                    });

                    // Position panel directly under the active button
                    const activeBtn = (window.innerWidth <= 1479 && secondaryFilterBtn) ? secondaryFilterBtn : btn;
                    const btnRect = activeBtn.getBoundingClientRect();
                    const gap = 5; // Small gap between button and panel

                    panel.style.left = btnRect.left + 'px';
                    panel.style.top = (btnRect.bottom + gap) + 'px';
                    panel.style.right = 'auto';

                    // Show panel
                    panel.style.display = 'block';
                    panel.style.visibility = 'visible';
                    panel.style.opacity = '1';
                    panel.classList.add('show');

                    // Ensure panel stays within viewport after positioning
                    this.keepInViewport(panel);
                    console.log('✅ Panel should now be visible');

                    // Add click outside handler
                    setTimeout(() => {
                        document.addEventListener('click', handleClickOutside);
                    }, 0);
                } else {
                    console.log('😫 Hiding panel...');
                    // Hide panel
                    panel.classList.remove('show');
                    panel.style.opacity = '0';
                    panel.style.visibility = 'hidden';
                    document.removeEventListener('click', handleClickOutside);

                    // After transition completes, update display
                    setTimeout(() => {
                        if (panel.style.visibility === 'hidden') {
                            panel.style.display = 'none';
                        }
                    }, 200);
                }
            };

            // Toggle panel on button click
            btn.addEventListener('click', (e) => {
                console.log('🔥 Filter button clicked!');
                e.stopPropagation();
                togglePanel();
            });

            // Setup secondary filter button event (only if exists)
            if (secondaryFilterBtn) {
                secondaryFilterBtn.addEventListener('click', (e) => {
                    console.log('🔥 Secondary filter button clicked!');
                    e.stopPropagation();
                    togglePanel();
                });
            }

            // Setup secondary kudos button event (only if exists)
            if (secondaryKudosBtn) {
                secondaryKudosBtn.addEventListener('click', () => {
                    let kudosGiven = 0;
                    const kudosButtons = document.querySelectorAll("button[data-testid='kudos_button']");

                    kudosButtons.forEach(button => {
                        const feedEntry = button.closest('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                        if (feedEntry && feedEntry.style.display !== 'none' && button.title !== 'View all kudos') {
                            button.click();
                            kudosGiven++;
                        }
                    });

                    const originalText = secondaryKudosBtn.textContent;
                    secondaryKudosBtn.textContent = `Gave ${kudosGiven} 👍`;
                    secondaryKudosBtn.style.pointerEvents = 'none';

                    setTimeout(() => {
                        secondaryKudosBtn.textContent = originalText;
                        secondaryKudosBtn.style.pointerEvents = 'auto';
                    }, 3000);
                });
            }

            // Close button
            panel.querySelector('.sff-close').addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel();
            });

            // Toggle all dropdowns
            panel.querySelectorAll('.sff-dropdown-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    const dropdown = e.currentTarget.closest('.sff-dropdown');
                    if (!dropdown) return;

                    const content = dropdown.querySelector('.sff-dropdown-content');
                    const isVisible = content.style.display === 'block';

                    // Close all other dropdowns first
                    if (!isVisible) {
                        panel.querySelectorAll('.sff-dropdown.open').forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('open');
                                const otherContent = otherDropdown.querySelector('.sff-dropdown-content');
                                if (otherContent) otherContent.style.display = 'none';
                            }
                        });
                    }

                    content.style.display = isVisible ? 'none' : 'block';
                    dropdown.classList.toggle('open', !isVisible);
                });
            });

            // Checkbox styling and real-time updates
            panel.addEventListener('change', (e) => {
                if (e.target.type !== 'checkbox') return;

                const chip = e.target.closest('.sff-chip');
                if (chip) chip.classList.toggle('checked', e.target.checked);

                // Master enable toggle
                if (e.target.classList.contains('sff-enabled-toggle')) {
                    settings.enabled = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    const toggleText = document.querySelector('.sff-toggle-text');
                    if (toggleText) toggleText.textContent = `FILTER ${settings.enabled ? 'ON' : 'OFF'}`;
                    LogicModule.applyAllFilters();
                    return; // Other toggles not relevant when flipping master
                }

                // Header kudos toggle
                if (e.target.classList.contains('sff-showKudosButton')) {
                    settings.showKudosButton = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.manageHeaderKudosButton();
                    UIModule.syncSecondaryKudosVisibility();
                }

                // Gift button
                if (e.target.classList.contains('sff-hideGift')) {
                    settings.hideGiveGift = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateGiftVisibility();
                }

                // Your challenges section
                if (e.target.classList.contains('sff-hideChallenges')) {
                    settings.hideChallenges = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateChallengesVisibility();
                    LogicModule.filterActivities();
                }

                // Joined challenge cards
                if (e.target.classList.contains('sff-hideJoinedChallenges')) {
                    settings.hideJoinedChallenges = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateJoinedChallengesVisibility();
                    LogicModule.filterActivities();
                }

                // Suggested Friends
                if (e.target.classList.contains('sff-hideSuggestedFriends')) {
                    settings.hideSuggestedFriends = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateSuggestedFriendsVisibility();
                    LogicModule.filterActivities();
                }

                // Your Clubs
                if (e.target.classList.contains('sff-hideYourClubs')) {
                    settings.hideYourClubs = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateYourClubsVisibility();
                    LogicModule.filterActivities();
                }

                // External embeds
                if (e.target.classList.contains('sff-hideMyWindsock')) {
                    settings.hideMyWindsock = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateMyWindsockVisibility();
                }
                if (e.target.classList.contains('sff-hideSummitbag')) {
                    settings.hideSummitbag = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateSummitbagVisibility();
                }
                if (e.target.classList.contains('sff-hideWandrer')) {
                    settings.hideWandrer = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateWandrerVisibility();
                }
                if (e.target.classList.contains('sff-hideBandok')) {
                    settings.hideBandok = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateBandokVisibility();
                }
                if (e.target.classList.contains('sff-hideCoros')) {
                    settings.hideCoros = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateCorosVisibility();
                }
                if (e.target.classList.contains('sff-hideRunHealth')) {
                    settings.hideRunHealth = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateRunHealthVisibility();
                }
                if (e.target.classList.contains('sff-hideCommuteTag')) {
                    settings.hideCommuteTag = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    // apply both visibility update and filter for counts
                    LogicModule.updateCommuteTagVisibility();
                    LogicModule.filterActivities();
                }
                if (e.target.classList.contains('sff-hideJoinWorkout')) {
                    settings.hideJoinWorkout = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateJoinWorkoutVisibility();
                }
                if (e.target.classList.contains('sff-hideCoachCat')) {
                    settings.hideCoachCat = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateCoachCatVisibility();
                }
                if (e.target.classList.contains('sff-hideAthleteJoinedClub')) {
                    settings.hideAthleteJoinedClub = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateAthleteJoinedClubVisibility();
                    LogicModule.filterActivities();
                }
                // Footer
                if (e.target.classList.contains('sff-hideFooter')) {
                    settings.hideFooter = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.updateFooterVisibility();
                }

                // Activity visibility rules
                if (e.target.classList.contains('sff-hideNoMap')) {
                    settings.hideNoMap = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.filterActivities();
                }
                if (e.target.classList.contains('sff-hideClubPosts')) {
                    settings.hideClubPosts = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.filterActivities();
                }

                // Activity type chips
                if (e.target.hasAttribute('data-typ')) {
                    const typ = e.target.getAttribute('data-typ');
                    settings.types[typ] = e.target.checked;
                    UtilsModule.saveSettings(settings);
                    LogicModule.filterActivities();
                }

                // Update count display
                UIModule.updateActivityCount(panel);
            });

            const typesActions = panel.querySelector('.sff-types-actions');
            if (typesActions) {
                typesActions.addEventListener('click', (event) => {
                    const button = event.target instanceof Element ? event.target.closest('button[data-action]') : null;
                    if (!button) return;
                    event.preventDefault();
                    event.stopPropagation();

                    const shouldCheck = button.dataset.action === 'select-all';
                    const checkboxes = [...panel.querySelectorAll('.sff-types input[type="checkbox"][data-typ]')];
                    if (!checkboxes.length) {
                        console.warn('⚠️ No activity type checkboxes found for bulk toggle');
                        return;
                    }

                    checkboxes.forEach(cb => {
                        const typ = cb.dataset.typ;
                        cb.checked = shouldCheck;
                        settings.types[typ] = shouldCheck;
                        cb.closest('.sff-chip')?.classList.toggle('checked', shouldCheck);
                    });

                    UtilsModule.saveSettings(settings);
                    UIModule.updateActivityCount(panel);
                    LogicModule.filterActivities();
                });
            }

            // Apply button
            panel.querySelector('.sff-save').addEventListener('click', () => {
                console.log('💾 Applying and refreshing...');
                this.applySettings(panel);
                location.reload();
            });

            // Reset button
            panel.querySelector('.sff-reset').addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all filters to their default values?')) {
                    settings = {...DEFAULTS};
                    UtilsModule.saveSettings(settings);
                    location.reload();
                }
            });

            // Unit system toggle
            panel.querySelector('.sff-unit-toggle').addEventListener('click', (e) => {
                if (e.target.matches('.sff-unit-btn')) {
                    const newUnit = e.target.dataset.unit;
                    if (newUnit !== settings.unitSystem) {
                        settings.unitSystem = newUnit;
                        panel.querySelectorAll('.sff-unit-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.updateFilterLabels(panel, newUnit);
                    }
                }
            });

            // Setup responsive behavior
            this.setupWindowResize(panel);
            this.setupButtonResponsive(btn);
            this.updateActivityCount(panel);
            this.updateFilterLabels(panel, settings.unitSystem);

            console.log('✅ Events attached');

            // Return cleanup function for when the script is unloaded
            return () => {
                window.removeEventListener('resize', handleResize);
                cleanupDraggable && cleanupDraggable();
                cleanupResizable && cleanupResizable();
                document.removeEventListener('click', handleClickOutside);
            };
        },

        makeDraggable(panel) {
            const header = panel.querySelector('.sff-panel-header');
            if (!header) return () => {}; // Return empty cleanup if no header

            let isDragging = false;
            let startX, startY, startLeft, startTop;

            const onMouseDown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                if (panel.style.visibility !== 'visible') return; // Only drag when visible

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                // Get current position without forcing reflow
                const rect = panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                header.style.cursor = 'grabbing';
                document.body.style.userSelect = 'none'; // Prevent text selection
                e.preventDefault();
                e.stopPropagation();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Calculate new position - allow free movement in all directions
                let newLeft = startLeft + dx;
                let newTop = startTop + dy;

                // Get viewport and panel dimensions
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const panelRect = panel.getBoundingClientRect();

                // Keep panel within viewport bounds with margins from memory: 6px left, 20px right, 6px top/bottom
                const leftMargin = 6;
                const rightMargin = 20;
                const topBottomMargin = 6;
                newLeft = Math.max(leftMargin, Math.min(newLeft, viewportWidth - panelRect.width - rightMargin));
                newTop = Math.max(topBottomMargin, Math.min(newTop, viewportHeight - panelRect.height - topBottomMargin));

                // Apply new position with !important to override CSS (from memory: avoid style conflicts)
                panel.style.setProperty('left', newLeft + 'px', 'important');
                panel.style.setProperty('top', newTop + 'px', 'important');
                panel.style.setProperty('right', 'auto', 'important');
                panel.style.setProperty('bottom', 'auto', 'important');

                // Save position
                localStorage.setItem('sffPanelPos', JSON.stringify({
                    left: panel.style.left,
                    top: panel.style.top
                }));
            };

            const onMouseUp = (e) => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = '';
                    document.body.style.userSelect = ''; // Restore text selection
                }
            };

            header.addEventListener('mousedown', onMouseDown, { passive: false });
            document.addEventListener('mousemove', onMouseMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp, { passive: false });

            // Cleanup function
            return () => {
                header.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // Save final position
                localStorage.setItem('sffPanelPos', JSON.stringify({
                    left: panel.style.left,
                    top: panel.style.top
                }));
            };
        },

        makeResizable(panel, onResizeStart, onResizeEnd) {
            const handle = panel.querySelector('.sff-resize-handle');
            if (!handle) return () => {};

            let isResizing = false;
            let startX, startWidth;

            const onMouseDown = (e) => {
                isResizing = true;
                startX = e.clientX;
                startWidth = parseInt(getComputedStyle(panel).width, 10);
                document.body.style.userSelect = 'none';
                
                // Notify that resize started
                if (onResizeStart) onResizeStart();
                
                e.preventDefault();
                e.stopPropagation();
            };

            const onMouseMove = (e) => {
                if (!isResizing) return;

                const dx = e.clientX - startX;
                let newWidth = startWidth + dx;

                // Constrain width
                const minWidth = 280;
                const maxWidth = 600;
                newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

                panel.style.setProperty('width', newWidth + 'px', 'important');
            };

            const onMouseUp = (e) => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.userSelect = '';
                    
                    // Prevent click outside handler from firing immediately after resize
                    e.stopPropagation();
                    
                    // Notify that resize ended after a short delay to ensure click-outside doesn't fire
                    setTimeout(() => {
                        if (onResizeEnd) onResizeEnd();
                    }, 100);
                }
            };

            handle.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, true); // Use capture phase

            return () => {
                handle.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp, true);
            };
        },

        keepInViewport(panel) {
            const rect = panel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const panelWidth = rect.width;
            const panelHeight = rect.height;

            let left = parseInt(panel.style.left) || 0;
            let top = parseInt(panel.style.top) || 0;

            // Adjust if panel is outside viewport with margins from memory: 6px left, 20px right, 6px top/bottom
            const leftMargin = 6;
            const rightMargin = 20;
            const topBottomMargin = 6;

            if (left + panelWidth > viewportWidth) {
                left = viewportWidth - panelWidth - rightMargin;
            }

            if (top + panelHeight > viewportHeight) {
                top = viewportHeight - panelHeight - topBottomMargin;
            }

            if (left < 0) {
                left = leftMargin;
            }

            if (top < 0) {
                top = topBottomMargin;
            }

            // Apply new position
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'auto';

            // Save adjusted position
            localStorage.setItem('sffPanelPos', JSON.stringify({
                left: panel.style.left,
                top: panel.style.top
            }));
        },

        setupWindowResize(panel) {
            window.addEventListener('resize', () => {
                const rect = panel.getBoundingClientRect();

                if (rect.right > window.innerWidth) {
                    panel.style.right = '10px';
                }
                if (rect.bottom > window.innerHeight) {
                    panel.style.top = Math.max(20, window.innerHeight - panel.offsetHeight - 20) + 'px';
                }
                if (rect.left < 0) {
                    panel.style.right = Math.max(0, window.innerWidth - panel.offsetWidth - 10) + 'px';
                }
                if (rect.top < 0) {
                    panel.style.top = '20px';
                }

                localStorage.setItem('sffPanelPos', JSON.stringify({
                    top: panel.style.top,
                    right: panel.style.right
                }));
            });
        },

        setupButtonResponsive(btn) {
            const adjust = () => {
                const w = window.innerWidth;
                // When width <= 985px, button is on the left; adjust its left offset smoothly
                if (w <= 985) {
                    const minW = 760; // at and below this, we want the MIN left offset (closest to logo)
                    const maxW = 985; // at this width, we want the MAX left offset
                    const minLeft = 180; // px (closest to logo on very small widths)
                    const maxLeft = 265; // px (more to the right when there's space)

                    let leftPx;
                    if (w <= minW) {
                        leftPx = minLeft; // smallest left when width is smallest
                    } else {
                        const t = (maxW - w) / (maxW - minW); // 0..1 as width shrinks
                        // As width shrinks, move left toward logo (decrease left value)
                        leftPx = Math.round(maxLeft - t * (maxLeft - minLeft));
                    }

                    btn.style.setProperty('left', leftPx + 'px', 'important');
                    btn.style.setProperty('right', 'auto', 'important');
                    btn.style.setProperty('top', '10px', 'important');
                } else {
                    // Clear inline overrides so CSS media queries control right-mode positioning
                    btn.style.removeProperty('left');
                    btn.style.removeProperty('right');
                    btn.style.removeProperty('top');
                }
            };

            // Run once now and on resize
            adjust();
            window.addEventListener('resize', adjust);
            // Also run after a short delay to allow page header to stabilize
            setTimeout(adjust, 250);
        }
    };

    // Logic Module - Step 6 of modular refactoring
    const LogicModule = {
        // Determine if a feed node is a club post
        isClubPost(node) {
            if (!node) return false;
            const el = (node.matches?.('[data-testid="web-feed-entry"]') ? node : node.closest?.('[data-testid="web-feed-entry"]')) || node;
            try {
                if (el.querySelector?.('.clubMemberPostHeaderLinks a.clubLink[href^="/clubs/"]')) return true;
                if (el.querySelector?.('a[data-testid="club-avatar"][href^="/clubs/"]')) return true;
                const postLink = el.querySelector?.('a[data-testid="post-details-url"]');
                if (postLink && /^\/clubs\//.test(postLink.getAttribute('href') || '')) return true;
                if (el.querySelector?.('a[href^="/clubs/"]')) return true;
                return false;
            } catch (_) {
                return false;
            }
        },
        // Determine if a feed node is a challenge card ("joined a challenge")
        isChallengeEntry(node) {
            if (!node) return false;
            const el = (node.matches?.('[data-testid="web-feed-entry"]') ? node : node.closest?.('[data-testid="web-feed-entry"]')) || node;
            // Common markers for challenges
            if (el.matches?.('[data-testid="challenge-card"], .challenge-card')) return true;
            // Join Challenge button present
            const hasJoinBtn = el.querySelector?.('button, a') && Array.from(el.querySelectorAll('button, a')).some(b => (b.textContent || '').trim().toLowerCase().includes('join challenge'));
            if (hasJoinBtn) return true;
            // Links to /challenges/... without an owners-name (no athlete owner)
            const hasChallengeLink = !!el.querySelector?.('a[href^="/challenges/"]');
            const hasOwnerName = !!el.querySelector?.('[data-testid="owners-name"], .entry-athlete');
            if (hasChallengeLink && !hasOwnerName) return true;
            return false;
        },

        // Determine if a feed node is a real activity entry (not a challenge or club post)
        isActivityEntry(node) {
            if (!node) return false;
            const el = (node.matches?.('[data-testid="web-feed-entry"]') ? node : node.closest?.('[data-testid="web-feed-entry"]')) || node;
            // Must have activity icon or activity container
            const hasIcon = !!el.querySelector?.('svg[data-testid="activity-icon"]');
            const hasActivityContainer = !!el.querySelector?.('[data-testid="activity_entry_container"], .activity-name, .entry-title');
            // Exclude challenge entries explicitly
            return (hasIcon || hasActivityContainer) && !this.isChallengeEntry(el);
        },

        updateJoinedChallengesVisibility() {
            try {
                const entries = document.querySelectorAll('[data-testid="web-feed-entry"], .feed-entry, .activity');
                entries.forEach(entry => {
                    if (this.isChallengeEntry(entry)) {
                        if (settings.enabled && settings.hideJoinedChallenges) {
                            if (entry.dataset.sffHiddenChallenge !== 'sff') {
                                entry.dataset.sffHiddenChallenge = 'sff';
                                entry.style.display = 'none';
                            }
                        } else if (entry.dataset.sffHiddenChallenge === 'sff') {
                            entry.style.display = '';
                            delete entry.dataset.sffHiddenChallenge;
                        }
                    }
                });
            } catch (e) {
                console.warn('updateJoinedChallengesVisibility error:', e);
            }
        },
        updateGiftVisibility() {
            try {
                const links = document.querySelectorAll('a[href*="/gift"][href*="origin=global_nav"]');
                links.forEach(a => {
                    if (settings.enabled && settings.hideGiveGift) {
                        if (a.dataset.sffHiddenBy !== 'sff') {
                            a.dataset.sffHiddenBy = 'sff';
                            a.style.display = 'none';
                        }
                    } else if (a.dataset.sffHiddenBy === 'sff') {
                        a.style.display = '';
                        delete a.dataset.sffHiddenBy;
                    }
                });
            } catch (e) {
                console.warn('updateGiftVisibility error:', e);
            }
        },

        updateChallengesVisibility() {
            try {
                const challengesSection = document.querySelector('#your-challenges');
                if (challengesSection) {
                    if (settings.enabled && settings.hideChallenges) {
                        if (challengesSection.dataset.sffHiddenBy !== 'sff') {
                            challengesSection.dataset.sffHiddenBy = 'sff';
                            challengesSection.style.display = 'none';
                        }
                    } else if (challengesSection.dataset.sffHiddenBy === 'sff') {
                        challengesSection.style.display = '';
                        delete challengesSection.dataset.sffHiddenBy;
                    }
                }
            } catch (e) {
                console.warn('updateChallengesVisibility error:', e);
            }
        },

        updateSuggestedFriendsVisibility() {
            try {
                const suggestedFriendsSection = document.querySelector('#suggested-follows');
                if (suggestedFriendsSection) {
                    if (settings.enabled && settings.hideSuggestedFriends) {
                        if (suggestedFriendsSection.dataset.sffHiddenBy !== 'sff') {
                            suggestedFriendsSection.dataset.sffHiddenBy = 'sff';
                            suggestedFriendsSection.style.display = 'none';
                        }
                    } else if (suggestedFriendsSection.dataset.sffHiddenBy === 'sff') {
                        suggestedFriendsSection.style.display = '';
                        delete suggestedFriendsSection.dataset.sffHiddenBy;
                    }
                }
            } catch (e) {
                console.warn('updateSuggestedFriendsVisibility error:', e);
            }
        },

        updateYourClubsVisibility() {
            try {
                const yourClubsSection = document.querySelector('#your-clubs');
                if (yourClubsSection) {
                    if (settings.enabled && settings.hideYourClubs) {
                        if (yourClubsSection.dataset.sffHiddenBy !== 'sff') {
                            yourClubsSection.dataset.sffHiddenBy = 'sff';
                            yourClubsSection.style.display = 'none';
                        }
                    } else if (yourClubsSection.dataset.sffHiddenBy === 'sff') {
                        yourClubsSection.style.display = '';
                        delete yourClubsSection.dataset.sffHiddenBy;
                    }
                }
            } catch (e) {
                console.warn('updateYourClubsVisibility error:', e);
            }
        },

        updateFooterVisibility() {
            try {
                // Find ONLY the footer section that includes footer-specific markers
                const markerSelector = 'a[href*="/legal/terms"], a[href*="/legal/privacy"], a[href*="/legal/cookie_policy"], #language-picker, #cpra-compliance-cta';
                let footerSection = Array.from(document.querySelectorAll('div.FvXwlgEO > section._01jT9FUf, section._01jT9FUf'))
                    .find(sec => sec.querySelector(markerSelector) || /©\s*\d{4}\s*Strava/i.test(sec.textContent || '')) || null;
                if (!footerSection) {
                    // Fallback to canonical footer elements
                    footerSection = document.querySelector('footer, [data-testid="footer"], .global-footer, .site-footer');
                }
                if (!footerSection) return;

                if (settings.enabled && settings.hideFooter) {
                    if (footerSection.dataset.sffHiddenBy !== 'sff') {
                        footerSection.dataset.sffHiddenBy = 'sff';
                        footerSection.style.setProperty('display', 'none', 'important');
                        footerSection.style.setProperty('margin', '0', 'important');
                        footerSection.style.setProperty('padding', '0', 'important');
                        footerSection.style.setProperty('height', '0', 'important');
                    }
                } else if (footerSection.dataset.sffHiddenBy === 'sff') {
                    footerSection.style.removeProperty('display');
                    footerSection.style.removeProperty('margin');
                    footerSection.style.removeProperty('padding');
                    footerSection.style.removeProperty('height');
                    delete footerSection.dataset.sffHiddenBy;
                }
            } catch (e) {
                console.warn('updateFooterVisibility error:', e);
            }
        },

        updateMyWindsockVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for myWindsock content`);

                activities.forEach(activity => {
                    // Find only text-containing elements (paragraphs and spans) that specifically contain myWindsock content
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        // Only hide if this element specifically contains the myWindsock report and not other content
                        if (text.includes('-- myWindsock Report --') && text.length < 500) { // Limit to avoid hiding large containers
                            console.log('🔮 Found myWindsock content in text element:', element);
                            if (settings.enabled && settings.hideMyWindsock) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🔮 myWindsock text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateMyWindsockVisibility error:', e);
            }
        },

        updateSummitbagVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for summitbag content`);

                activities.forEach(activity => {
                    // Find only text-containing elements (paragraphs and spans) that specifically contain summitbag content
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        // Only hide if this element specifically contains summitbag and not other content
                        if (text.includes('summitbag.com') && text.length < 500) { // Limit to avoid hiding large containers
                            console.log('🏔️ Found summitbag content in text element:', element);
                            if (settings.enabled && settings.hideSummitbag) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🏔️ summitbag text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateSummitbagVisibility error:', e);
            }
        },

        updateBandokVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');

                activities.forEach(activity => {
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text, [data-testid="activity_description_wrapper"]');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        // Match "Activity name auto generated by Bandok.com"
                        const hasBandok = /activity\s+name\s+auto\s+generated\s+by\s+bandok\.com/i.test(text);
                        if (hasBandok && text.length < 200) {
                            if (settings.enabled && settings.hideBandok) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🎯 Bandok.com description hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateBandokVisibility error:', e);
            }
        },

        updateCorosVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');

                activities.forEach(activity => {
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text, [data-testid="activity_description_wrapper"]');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        // Match "-- from COROS" or similar patterns
                        const hasCoros = /--\s*from\s+coros/i.test(text) || /--\s*coros/i.test(text);
                        if (hasCoros && text.length < 500) {
                            if (settings.enabled && settings.hideCoros) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('⌚ COROS description hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateCorosVisibility error:', e);
            }
        },

        updateWandrerVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for Wandrer content`);

                activities.forEach(activity => {
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text, [data-testid="activity_description_wrapper"]');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        const hasWandrer = /\bfrom\s+wandrer\b/i.test(text) || /\bwandrer\b/i.test(text);
                        if (hasWandrer && text.length < 800) {
                            console.log('🧭 Found Wandrer content in text element:', element);
                            if (settings.enabled && settings.hideWandrer) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🧭 Wandrer text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateWandrerVisibility error:', e);
            }
        },

        updateRunHealthVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for Run Health content`);

                activities.forEach(activity => {
                    // Find only text-containing elements (paragraphs and spans) that specifically contain Run Health content
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        // Only hide if this element specifically contains Run Health and not other content
                        if (text.includes('www.myTF.run') && text.length < 500) { // Limit to avoid hiding large containers
                            console.log('🏃 Found Run Health content in text element:', element);
                            if (settings.enabled && settings.hideRunHealth) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🏃 Run Health text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateRunHealthVisibility error:', e);
            }
        },

        updateJoinWorkoutVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for JOIN workout content`);

                activities.forEach(activity => {
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text, [data-testid="activity_description_wrapper"]');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        const hasJoin = /\bJOIN workout\b/i.test(text) || text.includes('strava.com/clubs/join-cycling');
                        if (hasJoin && text.length < 800) {
                            console.log('🧩 Found JOIN workout content in text element:', element);
                            if (settings.enabled && settings.hideJoinWorkout) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🧩 JOIN workout text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateJoinWorkoutVisibility error:', e);
            }
        },

        updateCoachCatVisibility() {
            try {
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                console.log(`🔍 Checking ${activities.length} activities for CoachCat content`);

                activities.forEach(activity => {
                    const textElements = activity.querySelectorAll('p, span, .text-content, .description-text, .activity-text, [data-testid="activity_description_wrapper"]');

                    textElements.forEach(element => {
                        const text = element.textContent?.trim() || '';
                        const hasCoachCat = /\bCoachCat Training Summary\b/i.test(text) || text.includes('fascatcoaching.com/app');
                        if (hasCoachCat && text.length < 800) {
                            console.log('🐱 Found CoachCat content in text element:', element);
                            if (settings.enabled && settings.hideCoachCat) {
                                if (element.dataset.sffHiddenBy !== 'sff') {
                                    element.dataset.sffHiddenBy = 'sff';
                                    element.style.display = 'none';
                                    console.log('🐱 CoachCat text content hidden:', element);
                                }
                            } else if (element.dataset.sffHiddenBy === 'sff') {
                                element.style.display = '';
                                delete element.dataset.sffHiddenBy;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('updateCoachCatVisibility error:', e);
            }
        },

        updateAthleteJoinedClubVisibility() {
            try {
                const toHide = new Set();

                // 1) Header-based detection
                const headers = document.querySelectorAll('[data-testid="group-header"]');
                headers.forEach(header => {
                    const text = header.textContent?.trim() || '';
                    if (/joined a club/i.test(text)) {
                        const entry = header.closest('[data-testid="web-feed-entry"], .feed-entry, .activity');
                        if (!entry) return;
                        const container = entry.closest('[id^="feed-entry-"]') || entry;
                        toHide.add(container);
                    }
                });

                // 2) Button-based detection (fallback): entries containing a "Join Club" button
                const entries = document.querySelectorAll('[data-testid="web-feed-entry"], .feed-entry, .activity');
                entries.forEach(entry => {
                    // find any button or link that looks like a Join Club CTA
                    const cta = entry.querySelector('button, a[role="button"], a');
                    const hasJoinCta = !![...(entry.querySelectorAll('button, a[role="button"], a'))]
                        .some(el => /\bjoin club\b/i.test(el.textContent?.trim() || ''));
                    if (hasJoinCta) {
                        const container = entry.closest('[id^="feed-entry-"]') || entry;
                        toHide.add(container);
                    }
                });

                // Apply/hide or restore
                toHide.forEach(container => {
                    if (settings.enabled && settings.hideAthleteJoinedClub) {
                        if (container.dataset.sffHiddenJoinedClub !== 'sff') {
                            container.dataset.sffHiddenJoinedClub = 'sff';
                            container.style.setProperty('display', 'none', 'important');
                            console.log('🙅 Hiding "Athlete joined a club" entry:', container);
                        }
                    } else if (container.dataset.sffHiddenJoinedClub === 'sff') {
                        container.style.removeProperty('display');
                        delete container.dataset.sffHiddenJoinedClub;
                    }
                });
            } catch (e) {
                console.warn('updateAthleteJoinedClubVisibility error:', e);
            }
        },

        // Count hidden sections for display in filter button
        countHiddenSections() {
            let hiddenSectionsCount = 0;

            // Count hidden sections
            const sectionsToCheck = [
                { selector: '#your-challenges', setting: 'hideChallenges' },
                { selector: '#suggested-follows', setting: 'hideSuggestedFriends' },
                { selector: '#your-clubs', setting: 'hideYourClubs' },
                { selector: 'div.FvXwlgEO', setting: 'hideFooter' }
            ];

            sectionsToCheck.forEach(({ selector, setting }) => {
                const section = document.querySelector(selector);
                if (section && settings[setting] && section.dataset.sffHiddenBy === 'sff') {
                    hiddenSectionsCount++;
                }
            });

            return hiddenSectionsCount;
        },

        filterActivities() {
            const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');

            if (!settings.enabled) {
                activities.forEach(activity => {
                    activity.style.display = '';
                });

                // Update button to show "OFF" when filtering is disabled
                const btn = document.querySelector('.sff-clean-btn .sff-btn-sub');
                const secondaryBtn = document.querySelector('.sff-secondary-filter-btn .sff-btn-sub');
                if (btn) btn.textContent = 'OFF';
                if (secondaryBtn) secondaryBtn.textContent = 'OFF';
                return;
            }
            let hiddenCount = 0;

            activities.forEach(activity => {
                // Get the primary owner of the activity
                const ownerLink = activity.querySelector('.entry-athlete a, [data-testid="owners-name"]');
                let athleteName = ownerLink?.textContent || '';
                
                // For "joined a club" and similar entries, check group-header
                if (!athleteName) {
                    const groupHeader = activity.querySelector('[data-testid="group-header"]');
                    if (groupHeader) {
                        const headerLink = groupHeader.querySelector('a');
                        athleteName = headerLink?.textContent || '';
                    }
                }

                // Check if the PRIMARY athlete should be ignored (applies to ALL entry types)
                // Skip group activities (detected by "rode with" or similar text in buttons)
                if (settings.ignoredAthletes.length > 0 && athleteName) {
                    // Check if this is a group activity
                    const isGroupActivity = Array.from(activity.querySelectorAll('button')).some(btn => 
                        /\b(rode|ran|walked|hiked|swam)\s+with\b/i.test(btn.textContent || '')
                    );
                    
                    // Only apply ignore filter to non-group activities
                    if (!isGroupActivity) {
                        const nameParts = athleteName.toLowerCase().split(/\s+/);
                        const isIgnored = settings.ignoredAthletes.some(ignoredName => {
                            if (!ignoredName) return false;
                            const ignoredNameParts = ignoredName.toLowerCase().split(/\s+/);
                            return ignoredNameParts.every(part => nameParts.includes(part));
                        });

                        if (isIgnored) {
                            activity.style.display = 'none';
                            hiddenCount++;
                            return;
                        }
                    }
                }

                // Handle club posts (robust detection)
                const isClub = this.isClubPost(activity) || (ownerLink && ownerLink.getAttribute('href')?.includes('/clubs/'));
                if (isClub) {
                    if (settings.hideClubPosts) {
                        activity.style.display = 'none';
                        hiddenCount++;
                    } else {
                        // Ensure previously hidden club posts are shown again when toggled off
                        activity.style.display = '';
                    }
                    return; // Club posts are not subject to other filters
                }

                // Hide commute-tagged activities early
                try {
                    const tags = Array.from(activity.querySelectorAll('[data-testid="tag"]')).map(el => (el.textContent || '').trim().toLowerCase());
                    const hasCommute = tags.some(t => t === 'commute');
                    if (hasCommute && settings.hideCommuteTag) {
                        activity.style.display = 'none';
                        hiddenCount++;
                        return;
                    }
                } catch (_) {}

                // Handle joined challenge cards separately
                if (this.isChallengeEntry(activity)) {
                    if (settings.hideJoinedChallenges) {
                        activity.style.display = 'none';
                        hiddenCount++;
                    } else {
                        activity.style.display = '';
                    }
                    return; // Do not apply activity filters to challenge cards
                }

                const title = activity.querySelector('.entry-title, .activity-name, [data-testid="entry-title"], [data-testid="activity_name"]')?.textContent || '';
                const { match: resolvedType, raw: resolvedRawType } = resolveActivityType(activity);
                const typeText = resolvedRawType || '';
                const normalizedTypeText = normalizeTypeLabel(typeText);
                const isRunActivity = resolvedType ? /run$/i.test(resolvedType.key) : normalizedTypeText.includes('run');

                let shouldHide = false;

                // Keywords, Activity types, Distance, Duration, Elevation, Pace, Map, Athletes logic...
                // [Filtering logic implementation here]
                if (!shouldHide && settings.keywords.length > 0 && title) {
                    const hasKeyword = settings.keywords.some(keyword => keyword && title.toLowerCase().includes(keyword.toLowerCase()));
                    if (hasKeyword) shouldHide = true;
                }

                if (!shouldHide && (resolvedType || typeText)) {
                    if (resolvedType && settings.types[resolvedType.key]) {
                        shouldHide = true;
                    } else if (normalizedTypeText.includes('virtual')) {
                        const hideAnyVirtual = TYPE_LABEL_METADATA.filter(t => t.normalized.includes('virtual')).some(t => settings.types[t.key]);
                        if (hideAnyVirtual) shouldHide = true;
                    }
                }

                if (!shouldHide && (settings.minKm > 0 || settings.maxKm > 0)) {
                    const km = UtilsModule.parseDistanceKm(activity);
                    if (km !== null) {
                        const val = settings.unitSystem === 'metric' ? km : km * 0.621371;
                        if (settings.minKm > 0 && val < settings.minKm) shouldHide = true;
                        if (!shouldHide && settings.maxKm > 0 && val > settings.maxKm) shouldHide = true;
                    }
                }

                if (!shouldHide && (settings.minMins > 0 || settings.maxMins > 0)) {
                    const secs = UtilsModule.parseDurationSeconds(activity);
                    if (secs !== null) {
                        const mins = secs / 60;
                        if (settings.minMins > 0 && mins < settings.minMins) shouldHide = true;
                        if (!shouldHide && settings.maxMins > 0 && mins > settings.maxMins) shouldHide = true;
                    }
                }

                if (!shouldHide && (settings.minElevM > 0 || settings.maxElevM > 0)) {
                    const elevM = UtilsModule.parseElevationM(activity);
                    if (elevM !== null) {
                        const val = settings.unitSystem === 'metric' ? elevM : elevM * 3.28084;
                        if (settings.minElevM > 0 && val < settings.minElevM) shouldHide = true;
                        if (!shouldHide && settings.maxElevM > 0 && val > settings.maxElevM) shouldHide = true;
                    }
                }

                if (!shouldHide && (settings.minPace > 0 || settings.maxPace > 0) && isRunActivity) {
                    // Robustly locate the Pace value within this activity card
                    let valueDiv = null;
                    const paceLabel = [...activity.querySelectorAll('span')].find(s => /(^|\b)pace(\b|$)/i.test(s.textContent || ''));
                    if (paceLabel) {
                        const metricContainer = paceLabel.closest('div');
                        valueDiv = metricContainer?.querySelector('div');
                        // Prefer specific class if present
                        if (metricContainer) {
                            const specific = metricContainer.querySelector('.vNsSU');
                            if (specific) valueDiv = specific;
                        }
                    }
                    // Fallbacks to older selectors
                    if (!valueDiv) valueDiv = activity.querySelector('.pace .value, [data-testid="pace"] .value');

                    if (valueDiv) {
                        const timeText = (valueDiv.childNodes[0]?.textContent || valueDiv.textContent || '').trim();
                        const match = timeText.match(/^(\d+):(\d{1,2})/);
                        if (match) {
                            const mm = parseInt(match[1], 10);
                            const ss = parseInt(match[2], 10);
                            if (!isNaN(mm) && !isNaN(ss)) {
                                let paceMinPerUnit = mm + ss / 60;
                                const abbr = valueDiv.querySelector('abbr');
                                const abbrTxt = (abbr?.textContent || '').trim().toLowerCase();
                                const abbrTitle = (abbr?.getAttribute('title') || '').toLowerCase();
                                const isPerMile = abbrTxt.includes('/mi') || abbrTitle.includes('mile');
                                // Convert min/mi to min/km if necessary
                                const paceVal = isPerMile ? paceMinPerUnit * 1.60934 : paceMinPerUnit;
                                // Semantics:
                                // - minPace: hide anything SLOWER than this (greater minutes per km)
                                // - maxPace: hide anything FASTER than this (smaller minutes per km)
                                if (settings.minPace > 0 && paceVal > settings.minPace) shouldHide = true;
                                if (!shouldHide && settings.maxPace > 0 && paceVal < settings.maxPace) shouldHide = true;
                            }
                        }
                    }
                }

                if (!shouldHide && settings.hideNoMap) {
                    // Only apply no-map rule to real activity entries
                    if (this.isActivityEntry(activity)) {
                        const map = activity.querySelector('img[data-testid="map"], svg.map, .activity-map, [data-testid="activity-map"]');
                        if (!map) shouldHide = true;
                    }
                }

                if (shouldHide && settings.allowedAthletes.length > 0 && athleteName) {
                    const nameParts = athleteName.toLowerCase().split(/\s+/);
                    const isAllowed = settings.allowedAthletes.some(allowedName => {
                        if (!allowedName) return false;
                        const allowedNameParts = allowedName.toLowerCase().split(/\s+/);
                        return allowedNameParts.every(part => nameParts.includes(part));
                    });

                    if (isAllowed) {
                        shouldHide = false;
                    }
                }

                if (shouldHide) {
                    activity.style.display = 'none';
                    hiddenCount++;
                } else {
                    activity.style.display = '';
                }
            });

            console.log(`🎯 Filtered ${hiddenCount}/${activities.length} activities`);
            const btn = document.querySelector('.sff-clean-btn .sff-btn-sub');
            const secondaryBtn = document.querySelector('.sff-secondary-filter-btn .sff-btn-sub');
            if (btn) btn.textContent = `(${hiddenCount})`;
            if (secondaryBtn) secondaryBtn.textContent = `(${hiddenCount})`;
        },

        manageHeaderKudosButton() {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = 500;

            const placeButton = () => {
                const kudosListItem = document.getElementById('gj-kudos-li');

                if (!settings.enabled || !settings.showKudosButton) {
                    if (kudosListItem) kudosListItem.remove();
                    // Also ensure secondary button is hidden
                    UIModule.syncSecondaryKudosVisibility();
                    return;
                }

                if (kudosListItem) {
                    // Button exists, ensure secondary is also synced
                    UIModule.syncSecondaryKudosVisibility();
                    return;
                }

                const navList = document.querySelector('.user-nav.nav-group');

                if (navList) {
                    const newListItem = document.createElement('li');
                    newListItem.id = 'gj-kudos-li';
                    newListItem.className = 'nav-item';
                    newListItem.dataset.addedByScript = 'true';
                    newListItem.style.paddingRight = '10px';
                    newListItem.style.display = 'flex';
                    newListItem.style.alignItems = 'center';

                    const kudosBtn = document.createElement('a');
                    kudosBtn.className = 'sff-header-kudos-btn';
                    kudosBtn.href = 'javascript:void(0);';
                    kudosBtn.textContent = 'Give 👍 to Everyone';

                    kudosBtn.addEventListener('click', () => {
                        let kudosGiven = 0;
                        const kudosButtons = document.querySelectorAll("button[data-testid='kudos_button']");

                        kudosButtons.forEach(button => {
                            const feedEntry = button.closest('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                            if (feedEntry && feedEntry.style.display !== 'none' && button.title !== 'View all kudos') {
                                button.click();
                                kudosGiven++;
                            }
                        });

                        const originalText = kudosBtn.textContent;
                        kudosBtn.textContent = `Gave ${kudosGiven} 👍`;
                        kudosBtn.style.pointerEvents = 'none';

                        setTimeout(() => {
                            kudosBtn.textContent = originalText;
                            kudosBtn.style.pointerEvents = 'auto';
                        }, 3000);
                    });

                    newListItem.appendChild(kudosBtn);
                    navList.prepend(newListItem);

                    // Sync secondary button visibility after creating main button
                    UIModule.syncSecondaryKudosVisibility();
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(placeButton, interval);
                    }
                }
            };

            placeButton();
        },

        setupAutoFilter() {
            const debouncedFilter = UtilsModule.debounce(() => {
                try {
                    this.filterActivities();
                    this.updateGiftVisibility();
                    this.updateChallengesVisibility();
                    this.updateSuggestedFriendsVisibility();
                    this.updateYourClubsVisibility();
                    this.updateFooterVisibility();
                    this.updateJoinedChallengesVisibility();
                    this.updateMyWindsockVisibility();
                    this.updateWandrerVisibility();
                    this.updateSummitbagVisibility();
                    this.updateRunHealthVisibility();
                    this.updateBandokVisibility();
                    this.updateCorosVisibility();
                } catch (e) {
                    console.error('Auto-filter error:', e);
                }
            }, 250);

            this.filterActivities();

            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (!m.addedNodes || m.addedNodes.length === 0) continue;
                    for (const node of m.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        if (
                            (node.matches && node.matches('.activity, .feed-entry, [data-testid="web-feed-entry"]')) ||
                            node.querySelector?.('.activity, .feed-entry, [data-testid="web-feed-entry"]')
                        ) {
                            debouncedFilter();
                            break;
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            window.addEventListener('scroll', debouncedFilter, { passive: true });
            window.__sffObserver = observer;
        },

        // Master function to apply all filters (activities and sections) based on enabled state
        applyAllFilters() {
            if (settings.enabled) {
                // When filter is enabled, apply all filtering
                this.filterActivities();
                this.updateGiftVisibility();
                this.updateChallengesVisibility();
                this.updateFooterVisibility();
                this.updateJoinedChallengesVisibility();
                this.updateSuggestedFriendsVisibility();
                this.updateYourClubsVisibility();
                this.updateMyWindsockVisibility();
                this.updateWandrerVisibility();
                this.updateSummitbagVisibility();
                this.updateRunHealthVisibility();
                this.updateBandokVisibility();
                this.updateCorosVisibility();
                this.manageHeaderKudosButton();
                UIModule.syncSecondaryKudosVisibility();
            } else {
                // When filter is disabled, show all activities and reset sections
                const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                activities.forEach(activity => {
                    activity.style.display = '';
                });

                // Reset all sections to visible
                const challengesSection = document.querySelector('#your-challenges');
                if (challengesSection && challengesSection.dataset.sffHiddenBy === 'sff') {
                    challengesSection.style.display = '';
                    delete challengesSection.dataset.sffHiddenBy;
                }

                const suggestedFriendsSection = document.querySelector('#suggested-follows');
                if (suggestedFriendsSection && suggestedFriendsSection.dataset.sffHiddenBy === 'sff') {
                    suggestedFriendsSection.style.display = '';
                    delete suggestedFriendsSection.dataset.sffHiddenBy;
                }

                const yourClubsSection = document.querySelector('#your-clubs');
                if (yourClubsSection && yourClubsSection.dataset.sffHiddenBy === 'sff') {
                    yourClubsSection.style.display = '';
                    delete yourClubsSection.dataset.sffHiddenBy;
                }

                const giftLinks = document.querySelectorAll('a[href*="/gift"][href*="origin=global_nav"]');
                giftLinks.forEach(a => {
                    if (a.dataset.sffHiddenBy === 'sff') {
                        a.style.display = '';
                        delete a.dataset.sffHiddenBy;
                    }
                });
                // Reset footer visibility
                this.updateFooterVisibility();
                // Reset joined challenges
                const entries = document.querySelectorAll('[data-testid="web-feed-entry"], .feed-entry, .activity');
                entries.forEach(entry => {
                    if (entry.dataset.sffHiddenChallenge === 'sff') {
                        entry.style.display = '';
                        delete entry.dataset.sffHiddenChallenge;
                    }
                });

                // Reset external service embed activities
                this.updateMyWindsockVisibility();
                this.updateWandrerVisibility();
                this.updateSummitbagVisibility();
                this.updateRunHealthVisibility();
                this.updateBandokVisibility();
                this.updateCorosVisibility();

                // Hide kudos buttons when master toggle is off
                this.manageHeaderKudosButton();
                UIModule.syncSecondaryKudosVisibility();

                // Update button counter to 0
                const btn = document.querySelector('.sff-clean-btn .sff-btn-sub');
                const secondaryBtn = document.querySelector('.sff-secondary-filter-btn .sff-btn-sub');
                if (btn) btn.textContent = '(0)';
                if (secondaryBtn) secondaryBtn.textContent = '(0)';
            }
        }
    };

    // Initialize utilities and update settings references
    let settings = UtilsModule.loadSettings();

    function handleClickOutside(event, panel, btn) {
        // Check if click is outside panel and not on the toggle button
        if (!panel.contains(event.target) && !btn.contains(event.target)) {
            panel.classList.remove('show');
            panel.style.display = 'none';
            document.removeEventListener('click', (e) => handleClickOutside(e, panel, btn));
        }
    }



    function setupEvents(btn, panel, secondaryFilterBtn, secondaryKudosBtn) {
        console.log('🎯 Clean Filter: Setting up events...');

        // Initialize draggable
        const cleanupDraggable = makeDraggable(panel);

        // Load saved position
        const savedPos = JSON.parse(localStorage.getItem('sffPanelPos') || '{}');
        if (savedPos.left || savedPos.top) {
            panel.style.left = savedPos.left || '';
            panel.style.top = savedPos.top || '';
            panel.style.right = savedPos.left ? 'auto' : '10px';
        }

        // Ensure panel is in viewport on load
        setTimeout(() => keepInViewport(panel), 100);

        // Handle window resize
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasVisible = panel.style.display === 'block';
                if (wasVisible) {
                    panel.style.display = 'none';
                }

                // Force reflow to ensure proper measurements
                void panel.offsetHeight;

                // Update position to stay in viewport
                keepInViewport(panel);

                if (wasVisible) {
                    panel.style.display = 'block';
                }

                // Save new position
                localStorage.setItem('sffPanelPos', JSON.stringify({
                    left: panel.style.left,
                    top: panel.style.top
                }));
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        // Handle click outside (define first)
        const handleClickOutside = (e) => {
            const clickedSecondaryBtn = secondaryFilterBtn && secondaryFilterBtn.contains(e.target);
            if (!panel.contains(e.target) && !btn.contains(e.target) && !clickedSecondaryBtn) {
                const isVisible = panel.style.display === 'block' && panel.style.visibility !== 'hidden';
                if (isVisible) {
                    togglePanel();
                }
            }
        };

        // Toggle panel function
        const togglePanel = () => {
            const isVisible = panel.style.display === 'block' && panel.style.visibility !== 'hidden';
            console.log('🔄 Toggle panel called. Currently visible:', isVisible);

            if (!isVisible) {
                console.log('📁 Showing panel...');
                // Close all dropdowns before showing the panel
                panel.querySelectorAll('.sff-dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                    const content = dropdown.querySelector('.sff-dropdown-content');
                    if (content) content.style.display = 'none';
                });

                // Position panel directly under the active button
                const activeBtn = (window.innerWidth <= 1479 && secondaryFilterBtn) ? secondaryFilterBtn : btn;
                const btnRect = activeBtn.getBoundingClientRect();
                const gap = 5; // Small gap between button and panel

                panel.style.left = btnRect.left + 'px';
                panel.style.top = (btnRect.bottom + gap) + 'px';
                panel.style.right = 'auto';

                // Show panel
                panel.style.display = 'block';
                panel.style.visibility = 'visible';
                panel.style.opacity = '1';
                panel.classList.add('show');

                // Ensure panel stays within viewport after positioning
                keepInViewport(panel);
                console.log('✅ Panel should now be visible');

                // Add click outside handler
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside);
                }, 0);
            } else {
                console.log('🚫 Hiding panel...');
                // Hide panel
                panel.classList.remove('show');
                panel.style.opacity = '0';
                panel.style.visibility = 'hidden';
                document.removeEventListener('click', handleClickOutside);

                // After transition completes, update display
                setTimeout(() => {
                    if (panel.style.visibility === 'hidden') {
                        panel.style.display = 'none';
                    }
                }, 200);
            }
        };

        // Toggle panel on button click
        btn.addEventListener('click', (e) => {
            console.log('🔥 Filter button clicked!');
            e.stopPropagation();
            togglePanel();
        });

        // Setup secondary filter button event (only if exists)
        if (secondaryFilterBtn) {
            secondaryFilterBtn.addEventListener('click', (e) => {
                console.log('🔥 Secondary filter button clicked!');
                e.stopPropagation();
                togglePanel();
            });
        }

        // Setup secondary kudos button event (only if exists)
        if (secondaryKudosBtn) {
            secondaryKudosBtn.addEventListener('click', () => {
                let kudosGiven = 0;
                const kudosButtons = document.querySelectorAll("button[data-testid='kudos_button']");

                kudosButtons.forEach(button => {
                    const feedEntry = button.closest('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                    if (feedEntry && feedEntry.style.display !== 'none' && button.title !== 'View all kudos') {
                        button.click();
                        kudosGiven++;
                    }
                });

                const originalText = secondaryKudosBtn.textContent;
                secondaryKudosBtn.textContent = `Gave ${kudosGiven} 👍`;
                secondaryKudosBtn.style.pointerEvents = 'none';

                setTimeout(() => {
                    secondaryKudosBtn.textContent = originalText;
                    secondaryKudosBtn.style.pointerEvents = 'auto';
                }, 3000);
            });
        }

        // Close button
        panel.querySelector('.sff-close').addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });

        // Main toggle switch
        panel.querySelector('.sff-enabled-toggle').addEventListener('change', (e) => {
            settings.enabled = e.target.checked;
            UtilsModule.saveSettings(settings);
            LogicModule.applyAllFilters();
        });

        // Toggle all dropdowns
        panel.querySelectorAll('.sff-dropdown-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const dropdown = e.currentTarget.closest('.sff-dropdown');
                if (!dropdown) return;

                const content = dropdown.querySelector('.sff-dropdown-content');
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';
                dropdown.classList.toggle('open', !isVisible);
            });
        });

        // Dragging - Only use makeDraggable from setupEvents, not setupDragging
        // setupDragging(panel);  // Remove duplicate dragging logic
        setupWindowResize(panel);
        setupButtonResponsive(btn);
        UIModule.updateActivityCount(panel);
        UIModule.updateFilterLabels(panel, settings.unitSystem);


        // Unit system toggle
        panel.querySelector('.sff-unit-toggle').addEventListener('click', (e) => {
            if (e.target.matches('.sff-unit-btn')) {
                const newUnit = e.target.dataset.unit;
                if (newUnit !== settings.unitSystem) {
                    settings.unitSystem = newUnit;
                    panel.querySelectorAll('.sff-unit-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    UIModule.updateFilterLabels(panel, newUnit);
                }
            }
        });

        console.log('✅ Events attached');

        // Return cleanup function for when the script is unloaded
        return () => {
            window.removeEventListener('resize', handleResize);
            cleanupDraggable && cleanupDraggable();
            document.removeEventListener('click', handleClickOutside);
        };
    }



    function setupDragging(panel) {
        const header = panel.querySelector('.sff-panel-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.getComputedStyle(panel).right, 10);
            startTop = parseInt(window.getComputedStyle(panel).top, 10);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = startX - e.clientX;
            const deltaY = e.clientY - startY;

            const newRight = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, startLeft + deltaX));
            const newTop = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, startTop + deltaY));

            panel.style.right = newRight + 'px';
            panel.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                localStorage.setItem(POS_KEY, JSON.stringify({
                    top: panel.style.top,
                    right: panel.style.right
                }));
            }
            isDragging = false;
        });
    }

    // Hide/show the Strava header "Give a Gift" button based on settings
    function updateGiftVisibility() {
        try {
            const links = document.querySelectorAll('a[href*="/gift"][href*="origin=global_nav"]');
            links.forEach(a => {
                if (settings.hideGiveGift) {
                    if (a.dataset.sffHiddenBy !== 'sff') {
                        a.dataset.sffHiddenBy = 'sff';
                        a.style.display = 'none';
                    }
                } else if (a.dataset.sffHiddenBy === 'sff') {
                    a.style.display = '';
                    delete a.dataset.sffHiddenBy;
                }
            });
        } catch (e) {
            console.warn('updateGiftVisibility error:', e);
        }
    }







    function filterActivities() {
        const activities = document.querySelectorAll('.activity, .feed-entry, [data-testid="web-feed-entry"]');

        if (!settings.enabled) {
            activities.forEach(activity => {
                activity.style.display = '';
            });
            const btn = document.querySelector('.sff-clean-btn .sff-btn-sub');
            const secondaryBtn = document.querySelector('.sff-secondary-filter-btn .sff-btn-sub');
            if (btn) btn.textContent = 'OFF';
            if (secondaryBtn) secondaryBtn.textContent = 'OFF';
            return;
        }
        let hiddenCount = 0;

        activities.forEach(activity => {
            // Get the primary owner of the activity
            const ownerLink = activity.querySelector('.entry-athlete a, [data-testid="owners-name"]');
            let athleteName = ownerLink?.textContent || '';
            
            // For "joined a club" and similar entries, check group-header
            if (!athleteName) {
                const groupHeader = activity.querySelector('[data-testid="group-header"]');
                if (groupHeader) {
                    const headerLink = groupHeader.querySelector('a');
                    athleteName = headerLink?.textContent || '';
                }
            }

            // Check if the PRIMARY athlete should be ignored (applies to ALL entry types)
            // Skip group activities (detected by "rode with" or similar text in buttons)
            if (settings.ignoredAthletes.length > 0 && athleteName) {
                // Check if this is a group activity
                const isGroupActivity = Array.from(activity.querySelectorAll('button')).some(btn => 
                    /\b(rode|ran|walked|hiked|swam)\s+with\b/i.test(btn.textContent || '')
                );
                
                // Only apply ignore filter to non-group activities
                if (!isGroupActivity) {
                    const nameParts = athleteName.toLowerCase().split(/\s+/);
                    const isIgnored = settings.ignoredAthletes.some(ignoredName => {
                        if (!ignoredName) return false;
                        const ignoredNameParts = ignoredName.toLowerCase().split(/\s+/);
                        return ignoredNameParts.every(part => nameParts.includes(part));
                    });

                    if (isIgnored) {
                        activity.style.display = 'none';
                        hiddenCount++;
                        return;
                    }
                }
            }

            // Hide commute-tagged activities early
            try {
                const tags = Array.from(activity.querySelectorAll('[data-testid="tag"]')).map(el => (el.textContent || '').trim().toLowerCase());
                const hasCommute = tags.some(t => t === 'commute');
                if (hasCommute && settings.hideCommuteTag) {
                    activity.style.display = 'none';
                    hiddenCount++;
                    return;
                }
            } catch (_) {}

            // Handle club posts (robust detection)
            const isClub = (typeof LogicModule !== 'undefined' && LogicModule.isClubPost ? LogicModule.isClubPost(activity) : false) || (ownerLink && ownerLink.getAttribute('href')?.includes('/clubs/'));
            if (isClub) {
                if (settings.hideClubPosts) {
                    activity.style.display = 'none';
                    hiddenCount++;
                }
                return; // Club posts are not subject to other filters
            }

            const title = activity.querySelector('.entry-title, .activity-name, [data-testid="entry-title"], [data-testid="activity_name"]')?.textContent || '';
            const svgIcon = activity.querySelector('svg[data-testid="activity-icon"] title');
            const typeEl = activity.querySelector('[data-testid="tag"]') || activity.querySelector('.entry-head, .activity-type');
            const type = svgIcon?.textContent || typeEl?.textContent || '';

            let shouldHide = false;

            // Keywords
            if (!shouldHide && settings.keywords.length > 0 && title) {
                const hasKeyword = settings.keywords.some(keyword => keyword && title.toLowerCase().includes(keyword.toLowerCase()));
                if (hasKeyword) shouldHide = true;
            }

            // Activity types
            if (!shouldHide && (resolvedType || typeText)) {
                if (resolvedType) {
                    if (settings.types[resolvedType.key]) {
                        shouldHide = true;
                    }
                    // Explicit resolved types stop here. We do NOT fall through to generic checks.
                } else {
                    // Fallback for group activities or unresolved types
                    const isVirtual = normalizeTypeLabel(typeText).includes('virtual');
                    
                    if (isVirtual) {
                        const hideAnyVirtual = TYPE_LABEL_METADATA.filter(t => t.normalized.includes('virtual')).some(t => settings.types[t.key]);
                        if (hideAnyVirtual) shouldHide = true;
                    } else {
                        // Only check for generic ride if it's NOT virtual
                        const hasGroupAvatars = !!activity.querySelector('[data-testid="avatar_group"]');
                        const isRide = normalizeTypeLabel(typeText).includes('ride') || 
                                     /\b(rode|cycling|cycle)\b/i.test(title) || 
                                     (activity.querySelector('[data-testid="group-header"]') && /rode/i.test(activity.textContent || '')) ||
                                     (hasGroupAvatars && !normalizeTypeLabel(typeText).includes('run')); // Assume group activity is a ride if not explicitly a run
                        
                        if (isRide) {
                             if (settings.types['Ride']) shouldHide = true;
                        }
                    }
                }
            }

            // Distance
            if (!shouldHide && (settings.minKm > 0 || settings.maxKm > 0)) {
                const km = UtilsModule.parseDistanceKm(activity);
                if (km !== null) {
                    const val = settings.unitSystem === 'metric' ? km : km * 0.621371;
                    if (settings.minKm > 0 && val < settings.minKm) shouldHide = true;
                    if (!shouldHide && settings.maxKm > 0 && val > settings.maxKm) shouldHide = true;
                }
            }

            // Duration (minutes)
            if (!shouldHide && (settings.minMins > 0 || settings.maxMins > 0)) {
                const secs = UtilsModule.parseDurationSeconds(activity);
                if (secs !== null) {
                    const mins = secs / 60;
                    if (settings.minMins > 0 && mins < settings.minMins) shouldHide = true;
                    if (!shouldHide && settings.maxMins > 0 && mins > settings.maxMins) shouldHide = true;
                }
            }

            // Elevation Gain
            if (!shouldHide && (settings.minElevM > 0 || settings.maxElevM > 0)) {
                const elevM = UtilsModule.parseElevationM(activity);
                if (elevM !== null) {
                    const val = settings.unitSystem === 'metric' ? elevM : elevM * 3.28084;
                    if (settings.minElevM > 0 && val < settings.minElevM) shouldHide = true;
                    if (!shouldHide && settings.maxElevM > 0 && val > settings.maxElevM) shouldHide = true;
                }
            }

            // Pace for runs
            if (!shouldHide && (settings.minPace > 0 || settings.maxPace > 0) && type && type.toLowerCase().includes('run')) {
                let valueDiv = null;
                const paceLabel = [...activity.querySelectorAll('span')].find(s => /(^|\b)pace(\b|$)/i.test(s.textContent || ''));
                if (paceLabel) {
                    const metricContainer = paceLabel.closest('div');
                    valueDiv = metricContainer?.querySelector('div');
                    const specific = metricContainer?.querySelector('.vNsSU');
                    if (specific) valueDiv = specific;
                }
                if (!valueDiv) valueDiv = activity.querySelector('.pace .value, [data-testid="pace"] .value');

                if (valueDiv) {
                    const timeText = (valueDiv.childNodes[0]?.textContent || valueDiv.textContent || '').trim();
                    const match = timeText.match(/^(\d+):(\d{1,2})/);
                    if (match) {
                        const mm = parseInt(match[1], 10);
                        const ss = parseInt(match[2], 10);
                        if (!isNaN(mm) && !isNaN(ss)) {
                            let paceMinPerUnit = mm + ss / 60;
                            const abbr = valueDiv.querySelector('abbr');
                            const abbrTxt = (abbr?.textContent || '').trim().toLowerCase();
                            const abbrTitle = (abbr?.getAttribute('title') || '').toLowerCase();
                            const isPerMile = abbrTxt.includes('/mi') || abbrTitle.includes('mile');
                            const paceVal = isPerMile ? paceMinPerUnit * 1.60934 : paceMinPerUnit;
                            if (settings.minPace > 0 && paceVal > settings.minPace) shouldHide = true;
                            if (!shouldHide && settings.maxPace > 0 && paceVal < settings.maxPace) shouldHide = true;
                        }
                    }
                }
            }

            // Hide activities without a map
            if (!shouldHide && settings.hideNoMap) {
                const map = activity.querySelector('img[data-testid="map"], svg.map, .activity-map, [data-testid="activity-map"]');
                if (!map) shouldHide = true;
            }

            // Allowed Athletes override
            if (shouldHide && settings.allowedAthletes.length > 0 && athleteName) {
                const nameParts = athleteName.toLowerCase().split(/\s+/);
                const isAllowed = settings.allowedAthletes.some(allowedName => {
                    if (!allowedName) return false;
                    const allowedNameParts = allowedName.toLowerCase().split(/\s+/);
                    return allowedNameParts.every(part => nameParts.includes(part));
                });

                if (isAllowed) {
                    shouldHide = false; // It's an allowed athlete, so don't hide it
                }
            }

            if (shouldHide) {
                activity.style.display = 'none';
                hiddenCount++;
            } else {
                activity.style.display = '';
            }
        });

        console.log(`🎯 Filtered ${hiddenCount}/${activities.length} activities`);

        // Add hidden sections count to the total
        const hiddenSectionsCount = this.countHiddenSections();
        const totalHiddenCount = hiddenCount + hiddenSectionsCount;

        const btn = document.querySelector('.sff-clean-btn .sff-btn-sub');
        const secondaryBtn = document.querySelector('.sff-secondary-filter-btn .sff-btn-sub');
        if (btn) btn.textContent = `(${totalHiddenCount})`;
        if (secondaryBtn) secondaryBtn.textContent = `(${totalHiddenCount})`;
    }



    function manageHeaderKudosButton() {
        let attempts = 0;
        const maxAttempts = 10; // Try for 5 seconds
        const interval = 500; // 0.5 seconds

        const placeButton = () => {
            const kudosListItem = document.getElementById('gj-kudos-li');

            // If button should be hidden, remove it and stop.
            if (!settings.showKudosButton) {
                if (kudosListItem) kudosListItem.remove();
                // Also ensure secondary button is hidden
                UIModule.syncSecondaryKudosVisibility();
                return;
            }

            // If button already exists, ensure secondary is synced
            if (kudosListItem) {
                UIModule.syncSecondaryKudosVisibility();
                return;
            }

            const navList = document.querySelector('.user-nav.nav-group');

            if (navList) {
                const newListItem = document.createElement('li');
                newListItem.id = 'gj-kudos-li';
                newListItem.className = 'nav-item';
                newListItem.dataset.addedByScript = 'true'; // Mark for cleanup
                newListItem.style.paddingRight = '10px';
                newListItem.style.display = 'flex';
                newListItem.style.alignItems = 'center';

                const kudosBtn = document.createElement('a');
                kudosBtn.className = 'sff-header-kudos-btn';
                kudosBtn.href = 'javascript:void(0);';
                kudosBtn.textContent = 'Give 👍 to Everyone';

                kudosBtn.addEventListener('click', () => {
                    let kudosGiven = 0;
                    const kudosButtons = document.querySelectorAll("button[data-testid='kudos_button']");

                    kudosButtons.forEach(button => {
                        const feedEntry = button.closest('.activity, .feed-entry, [data-testid="web-feed-entry"]');
                        if (feedEntry && feedEntry.style.display !== 'none' && button.title !== 'View all kudos') {
                            button.click();
                            kudosGiven++;
                        }
                    });

                    const originalText = kudosBtn.textContent;
                    kudosBtn.textContent = `Gave ${kudosGiven} 👍`;
                    kudosBtn.style.pointerEvents = 'none';

                    setTimeout(() => {
                        kudosBtn.textContent = originalText;
                        kudosBtn.style.pointerEvents = 'auto';
                    }, 3000);
                });

                newListItem.appendChild(kudosBtn);
                navList.prepend(newListItem);

                // Sync secondary button visibility after creating main button
                UIModule.syncSecondaryKudosVisibility();
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(placeButton, interval);
                }
            }
        };

        placeButton();
    }

    // Observe DOM for new activities and re-apply filters automatically
    function setupAutoFilter() {
        const debouncedFilter = UtilsModule.debounce(() => {
            try {
                LogicModule.filterActivities();
                LogicModule.updateGiftVisibility();
                LogicModule.updateChallengesVisibility();
                LogicModule.updateSuggestedFriendsVisibility();
                LogicModule.updateYourClubsVisibility();
            } catch (e) {
                console.error('Auto-filter error:', e);
            }
        }, 250);

        // Initial filter
        filterActivities();

        // MutationObserver for dynamically inserted feed entries
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (!m.addedNodes || m.addedNodes.length === 0) continue;
                for (const node of m.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    // If the added node is an activity or contains one, trigger filtering
                    if (
                        (node.matches && node.matches('.activity, .feed-entry, [data-testid="web-feed-entry"]')) ||
                        node.querySelector?.('.activity, .feed-entry, [data-testid="web-feed-entry"]')
                    ) {
                        debouncedFilter();
                        break;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback: when user scrolls and Strava lazy-loads content, re-run filtering
        window.addEventListener('scroll', debouncedFilter, { passive: true });

        // Store on window for potential debugging/cleanup
        window.__sffObserver = observer;
    }

    // ==== SFF SECTION: INIT BOOTSTRAP ====
    // Setup global features that work on all pages
    let globalFeaturesInitialized = false;
    function setupGlobalFeatures() {
        if (globalFeaturesInitialized) return;
        globalFeaturesInitialized = true;

        // Apply gift button hiding immediately
        LogicModule.updateGiftVisibility();

        // Apply challenges section hiding immediately
        LogicModule.updateChallengesVisibility();

        // Apply suggested friends section hiding immediately
        LogicModule.updateSuggestedFriendsVisibility();

        // Apply your clubs section hiding immediately
        LogicModule.updateYourClubsVisibility();

        // Apply footer hiding immediately
        LogicModule.updateFooterVisibility();

        // Apply external service embed hiding immediately
        LogicModule.updateMyWindsockVisibility();
        LogicModule.updateWandrerVisibility();
        LogicModule.updateSummitbagVisibility();
        LogicModule.updateRunHealthVisibility();
        LogicModule.updateBandokVisibility();
        LogicModule.updateCorosVisibility();
        LogicModule.updateJoinWorkoutVisibility();
        LogicModule.updateCoachCatVisibility();
        LogicModule.updateAthleteJoinedClubVisibility();

        // Setup observer for dynamically loaded content to hide gift buttons and challenges
        const observer = new MutationObserver(() => {
            LogicModule.updateGiftVisibility();
            LogicModule.updateChallengesVisibility();
            LogicModule.updateFooterVisibility();
            LogicModule.updateJoinedChallengesVisibility();
            LogicModule.updateSuggestedFriendsVisibility();
            LogicModule.updateYourClubsVisibility();
            LogicModule.updateMyWindsockVisibility();
            LogicModule.updateWandrerVisibility();
            LogicModule.updateSummitbagVisibility();
            LogicModule.updateRunHealthVisibility();
            LogicModule.updateBandokVisibility();
            LogicModule.updateCorosVisibility();
            LogicModule.updateJoinWorkoutVisibility();
            LogicModule.updateCoachCatVisibility();
            LogicModule.updateAthleteJoinedClubVisibility();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Store observer for cleanup if needed
        window.__sffGlobalObserver = observer;
    }

    // Initialize
    function init() {
        console.log('🚀 Clean Filter: Initializing...');

        setTimeout(() => {
            // Always setup global features on all pages
            setupGlobalFeatures();

            // Only create UI elements and run filtering on dashboard
            if (UtilsModule.isOnDashboard()) {
                UIModule.createElements();
                LogicModule.manageHeaderKudosButton();
                // Ensure secondary kudos button is properly synchronized
                UIModule.syncSecondaryKudosVisibility();
                if (settings.enabled) {
                    LogicModule.filterActivities();
                    LogicModule.setupAutoFilter();
                }
            }
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle navigation changes in SPA
    let currentPath = window.location.pathname;
    const checkPageChange = () => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;

            if (UtilsModule.isOnDashboard()) {
                // We navigated to dashboard, initialize dashboard-specific features
                document.body.setAttribute('data-sff-dashboard', 'true');
                if (!document.querySelector('.sff-secondary-nav')) {
                    // Create dashboard elements if they don't exist
                    const existingElements = document.querySelectorAll('.sff-clean-btn, .sff-clean-panel');
                    if (existingElements.length === 0) {
                        init();
                    }
                }
                // Ensure secondary kudos button visibility is synchronized after navigation
                setTimeout(() => UIModule.syncSecondaryKudosVisibility(), 100);
            } else {
                // We navigated away from dashboard, cleanup dashboard-specific elements
                document.body.removeAttribute('data-sff-dashboard');
                document.querySelectorAll('.sff-clean-btn, .sff-clean-panel, .sff-secondary-nav').forEach(el => el.remove());
                // Remove header kudos button if it exists
                const kudosLi = document.getElementById('gj-kudos-li');
                if (kudosLi && kudosLi.dataset.addedByScript) {
                    kudosLi.remove();
                }
            }
        }
    };

    // Check for page changes periodically
    setInterval(checkPageChange, 500);

    console.log('✅ Clean Filter: Setup complete');

})();
