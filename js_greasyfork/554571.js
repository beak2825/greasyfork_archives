// ==UserScript==
// @name         Drawaria Game Level 10 - The Top of the Castle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 10: The Final Level. Ascend to the highest spire, face the Diamond Queen, and complete the adventure.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/
// @match        https://*.drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. LEVEL METADATA AND CONSTANTS ---

    const LEVEL_TITLE = "The Top of the Castle";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-top-castle.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    const AVATAR_HEIGHT_PX = 64;
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX;

    const LEVEL_END_X = VIEWBOX_WIDTH + 220;
    const LEVEL_START_X = 50;

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const NPC_WIDTH_DEFAULT = 100;

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // Final Boss Character SVG Placeholder
    const QUEEN_DIAMOND_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="800" width="800" xmlns="http://www.w3.org/2000/svg" viewBox="-16.622 0 516.622 754.084" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 5 0.5 #fff" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#fff" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 -20 11 0.13 #fff688" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="11"/>
      <feOffset dx="10" dy="-20"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl" type="linear" slope="0.26"/>
      </feComponentTransfer>
      <feFlood flood-color="#fff688"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g style="transform-origin: 232.425px 276.437px;">
    <path d="M 268.499 74.175 C 270.457 75.467 272.289 76.836 273.981 78.274 C 273.981 86.47 354.518 138.88 354.518 138.486 C 353.008 136.976 291.387 133.419 295.978 138.01 C 287.165 148.292 347.686 281.633 358.177 269.394 C 354.419 271.388 313.534 271.528 319.671 271.525 C 297.965 279.418 352.339 401.166 365.639 396.33 C 365.029 401.985 302.604 372.556 304.988 390.351 C 291.075 408.901 332.321 486.083 336.626 480.343 C 333.48 509.795 199.961 478.2 203.155 447.423 C 203.155 447.423 189.669 451.926 175.934 445.338 C 82.431 400.487 110.816 382.487 121.145 319.918 C 124.342 300.553 131.949 287.337 141.686 277.126 C 144.073 267.002 147.018 255.506 149.091 241.93 C 154.05 209.458 171.568 194.058 190.78 181.127 C 191.126 178.687 191.437 176.147 191.69 173.496 C 192.844 161.413 196.863 152.567 202.426 145.484 C 172.459 140.888 150.221 123.948 150.221 103.752 C 150.221 80.025 180.915 60.791 218.777 60.791 C 236.528 60.791 268.499 74.175 268.499 74.175 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(185, 232, 225); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;"/>
    <path d="M -179.13 51.07 L -135.254 96.316 L -179.13 96.316 L -179.13 51.07 Z" bx:shape="triangle -179.13 51.07 43.876 45.246 0 0 1@497701cd" style="stroke-width: 3px; fill: rgb(185, 232, 225); filter: none; stroke: rgb(141, 180, 189); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-0.954316, -0.2988, -0.298805, 0.954314, 290.098407, 36.576554)"/>
    <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;3;0" begin="0s" dur="4.04s" fill="freeze" keyTimes="0; 0.490532; 1" repeatCount="indefinite"/>
  </g>
  <rect style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 255, 231); filter: none;" height="35.762" transform="matrix(0, 1, -1, 0, 334.03141, 72.155206)" x="175.479" y="169.444" width="49.199"/>
  <path d="M 236.928 164.234 C 254.665 197.943 199.978 250.295 139.442 252.855 C 78.906 255.414 90.491 249.911 112.536 179.436 C 134.58 108.961 143.416 102.393 176.484 100.792 C 209.552 99.191 219.191 130.526 236.928 164.234 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 255, 231); filter: none;"/>
  <g style="transform-origin: 154.298px 163.845px;">
    <g transform="matrix(0.77912, 0, 0, 0.906355, 39.182687, 3.125705)" style="filter: none;">
      <path d="M 205.651 -107 Q 218.021 -125.39 230.392 -107 L 230.392 -107 Q 242.762 -88.609 218.021 -88.609 L 218.021 -88.609 Q 193.28 -88.609 205.651 -107 Z" bx:shape="triangle 193.28 -125.39 49.482 36.781 0.5 0.5 1@25bd427e" style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(64, 117, 128); stroke-width: 3.56079px; fill: rgb(255, 255, 255);" transform="matrix(0.989466, -0.144768, -0.275758, -0.970301, -42.077915, 280.992269)"/>
      <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55983px; fill: rgb(255, 255, 255);" d="M 153.018 169.463 L 196.894 159.865"/>
      <path style="transform-origin: 182.119px 193.09px; stroke: rgb(64, 117, 128); stroke-width: 3.55983px; fill: rgb(255, 255, 255);" d="M 168.536 194.174 L 195.702 192.006"/>
    </g>
    <g transform="matrix(0.840475, 0, 0, 0.933733, 26.199267, -0.159217)" style="filter: none;">
      <path d="M 194.748 -101.4 Q 206.463 -118.83 218.178 -101.4 L 218.178 -101.4 Q 229.892 -83.971 206.463 -83.971 L 206.463 -83.971 Q 183.034 -83.971 194.748 -101.4 Z" bx:shape="triangle 183.034 -118.83 46.858 34.859 0.5 0.5 1@e5cf8636" style="transform-origin: 206.463px -97.044px; stroke: rgb(64, 117, 128); stroke-width: 3.38221px; fill: rgb(255, 255, 255);" transform="matrix(-0.989466, -0.144768, 0.275758, -0.970301, -79.159255, 274.692213)"/>
      <path style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(64, 117, 128); stroke-width: 3.38179px; fill: rgb(255, 255, 255);" d="M 106.857 160.093 L 150.733 169.691" transform="matrix(-1, 0, 0, -1, 0.000024, 0.000003)"/>
      <path style="transform-origin: 122.928px 190.854px; stroke: rgb(64, 117, 128); stroke-width: 3.38179px; fill: rgb(255, 255, 255);" d="M 109.345 189.77 L 136.511 191.938" transform="matrix(-1, 0, 0, -1, -0.000011, -0.000012)"/>
    </g>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1; 1" begin="18.78s" dur="2s" fill="freeze"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1; 1" begin="18.78s" dur="2s" fill="freeze"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.9;1 1" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.490799; 1" repeatCount="indefinite"/>
  </g>
  <path style="fill: rgb(216, 216, 216); stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none;" d="M 147.12 179.712 C 147.12 184.509 145.786 189.402 144.583 193.966 C 144.213 195.367 143.849 199.227 142.771 200.343"/>
  <path style="fill: rgb(216, 216, 216); stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none;" d="M 142.771 200.343 C 145.605 201.18 158.716 204.651 158.716 199.967"/>
  <path style="fill: rgb(216, 216, 216); stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none;" d="M 152.069 223.425 L 175.129 215.24 L 173.208 215.612"/>
  <path fill="rgb(255,0,0)" d="M 143.937 87.398 C 145.599 86.833 148.027 86.613 149.932 87.068 C 151.892 87.535 154.031 89.163 155.519 90.263 C 156.76 91.183 156.809 92.105 158.46 93.093 C 161.232 94.749 167.32 96.94 172.443 98.44 C 178.075 100.091 185.135 101.661 191.019 102.371 C 196.444 103.027 202.364 102 206.512 102.815 C 209.781 103.457 212.309 104.266 214.427 105.985 C 216.569 107.724 217.503 109.596 219.255 113.241 C 222.092 119.146 225.878 133.619 228.882 140.614 C 231.098 145.769 244.409 180.146 247.887 185.858 C 249.299 188.176 249.294 188.529 249.281 190.158 C 249.264 192.091 248.69 195.065 247.208 196.787 C 245.609 198.645 242.17 200.451 239.645 200.66 C 237.223 200.858 235.509 200.684 232.366 198.274 C 225.992 193.39 212.683 151.782 209.776 145.056 C 206.673 137.871 205.745 125.142 201.495 121.764 C 198.333 119.252 194.439 122.067 189.541 121.502 C 182.924 120.736 172.206 119.068 164.687 116.583 C 157.695 114.274 150.09 110.381 145.692 107.46 C 142.586 105.399 140.539 103.38 139.266 101.455 C 138.289 99.977 137.835 98.817 137.874 97.156 C 137.922 95.113 139.104 91.652 140.296 89.995 C 141.261 88.654 142.457 87.902 143.937 87.398 Z" style="fill: rgb(166, 209, 48); transform-origin: 201.101px 143.644px; stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none;"/>
  <g style="transform-origin: 64.388px 58.948px; filter: url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(0.959098, 0.283073, -0.283079, 0.959098, 173.440937, -7.380397)">
    <path d="M 15.667 42.259 L 47.628 65.986 L 66.623 17.603 L 86.009 69.267 L 112.64 41.848 L 112.64 100.2 L 91.795 100.2 L 92.922 103.898 L 40.323 103.898 L 41.325 100.611 L 15.667 100.611 L 15.667 42.259 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 246, 136);"/>
    <path d="M 113.469 101.486 C 113.469 110.337 91.586 105.275 64.592 105.275 C 37.598 105.275 15.715 110.337 15.715 101.486 C 15.715 92.635 37.598 85.46 64.592 85.46 C 91.586 85.46 113.469 92.635 113.469 101.486 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 246, 136);"/>
    <ellipse style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 246, 136);" cx="15.972" cy="42.24" rx="9.045" ry="9.843"/>
    <ellipse style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 246, 136);" cx="67.177" cy="23.151" rx="9.577" ry="11.971"/>
    <ellipse style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(255, 246, 136);" cx="112.804" cy="44.102" rx="9.045" ry="10.109"/>
  </g>
  <path d="M 117.654 559.517 L 201.17 597.469 C 201.321 606.421 118.718 605.526 118.506 592.998 L 117.654 559.517 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none; fill: rgb(99, 255, 201);" transform="matrix(-0.925676, 0.378316, -0.378316, -0.925676, 452.545115, 1097.090721)"/>
  <path d="M 125.347 605.126 L 80.739 596.473 L 110.438 443.363 L 144.182 449.908 L 183.234 442.333 L 212.932 595.444 L 168.324 604.096 L 146.935 493.826 L 125.347 605.126 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;"/>
  <rect rx="8" ry="8" style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" height="79.291" transform="matrix(0.005025, 0.999987, -0.999987, 0.005025, 400.806161, 172.549991)" x="114.909" y="214.555" width="162.909"/>
  <g>
    <path d="M 86.679 465.085 L 113.738 465.085 L 113.738 343.323 C 119.531 340.283 123.461 334.376 123.461 327.587 C 123.461 317.691 115.111 309.668 104.81 309.668 C 94.992 309.668 86.945 316.957 86.213 326.21 C 79.377 326.875 74.092 331.331 74.092 336.729 C 74.092 342.249 79.618 346.784 86.679 347.287 L 86.679 465.085 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none; fill: rgb(255, 255, 255); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000047, 0.000036)"/>
    <ellipse style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" cx="101.402" cy="301.856" rx="24.15" ry="25.377"/>
    <path d="M 213.973 440.4 C 213.973 450.296 205.623 458.319 195.322 458.319 C 185.504 458.319 177.457 451.03 176.725 441.777 C 169.889 441.112 164.604 436.656 164.604 431.258 C 164.604 425.592 170.426 420.964 177.754 420.668 L 177.754 316.268 L 205.473 316.268 L 205.473 425.365 C 210.589 428.56 213.973 434.101 213.973 440.4 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3px; filter: none; fill: rgb(255, 255, 255);"/>
    <ellipse style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" cx="190.632" cy="301.447" rx="27.424" ry="27.424"/>
    <animateMotion path="M 0 0 L 0.415 9.487 C 0.173 10.996 0.542 8.415 0.041 0" calcMode="linear" begin="0s" dur="4.48s" fill="freeze" repeatCount="indefinite"/>
  </g>
  <path style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" d="M 100.283 500.13 C 109.083 507.17 145.381 459.653 136.581 452.613"/>
  <path style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" d="M 156.072 452.005 C 164.872 444.965 201.17 492.482 192.37 499.522" transform="matrix(-1, 0, 0, -1, 0.000023, -0.000033)"/>
  <path style="stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" d="M 101.385 491.741 C 107.733 497.751 133.915 457.186 127.567 451.176"/>
  <path style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(64, 117, 128); stroke-width: 3px; fill: rgb(22, 56, 216); filter: none;" d="M 165.713 452.118 C 172.061 446.108 198.243 486.673 191.895 492.683" transform="matrix(-1, 0, 0, -1, 0.000034, -0.000038)"/>
  <g transform="matrix(0.933786, 0, 0, 0.752685, 115.037242, 64.715715)" style="filter: none;">
    <g>
      <path d="M 33 -417.01 L 60.174 -353.495 L 5.825 -353.495 L 33 -417.01 Z" bx:shape="triangle 5.825 -417.01 54.349 63.515 0.5 0 1@5e4957fa" style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 14.02 341.981 L 52.039 341.981 L 60.197 353.702 L 5.908 353.702 L 14.02 341.981 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3.55773px; fill: rgb(64, 255, 247); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.99999, -0.005618, 0.00365, 0.99999, 0, 0)"/>
    </g>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 19.794 342.428 L 19.494 353.892"/>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 32.908 342.578 L 32.608 353.075"/>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 46.047 341.769 L 45.747 353.959"/>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 19.561 353.225 L 32.458 415.612"/>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 32.458 353.525 L 33.358 416.512"/>
    <path style="stroke: rgb(64, 117, 128); stroke-width: 3.55772px; fill: rgb(64, 255, 247);" d="M 45.955 353.525 L 33.358 415.912"/>
  </g>
  <path d="M 228.135 627.164 L 136.469 623.629 C 132.942 615.399 209.744 584.978 214.68 596.493 L 228.135 627.164 Z" style="stroke: rgb(64, 117, 128); stroke-width: 3; filter: none; fill: rgb(99, 255, 201); transform-origin: 180.177px 622.644px;"/>
</svg>`;

    // Final Boss Central Position
    const QUEEN_X = 400 - NPC_WIDTH_DEFAULT/2;
    const QUEEN_Y = 300;
    const QUEEN_SCALE = 0.4;

    // NPC DATA - Only Queen Diamond appears in the final phase
    const NPC_DATA = {
        4: { char_id: 'QUEEN_DIAMOND', name: 'Queen Diamond', svg_content: QUEEN_DIAMOND_SVG_CONTENT, x: QUEEN_X, y: QUEEN_Y, scale: QUEEN_SCALE, final_npc: true, dialogue: [
            "Queen Diamond: So, you finally stand before me. The culmination of all my trials.",
            "Queen Diamond: You have walked through the memories of Drawaria: the Foundation, the Wilderness, the Scars, the Serenity, and the Machinery.",
            "Queen Diamond: But the greatest challenge is not the journey you undertook, but the question you face now.",
            "Queen Diamond: Who are you, traveler? Are you merely a player in this world, or the true artist of your destiny?",
            "Queen Diamond: I am the Queen, the pure essence of all shapes. My existence is defined by perfection and order.",
            "Queen Diamond: Yet, your journey—full of unpredictable, imperfect motion—is what gives my world meaning.",
            "Queen Diamond: Your answer is reflected in your completion of all the trials. You are the Architect.",
            "Queen Diamond: With that, I yield my final secret."
        ] },
    };

    const MAX_TRANSITIONS = 4; // 4 transitions (Map 1 -> 2 -> 3 -> 4 -> 5). Total 5 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky/Ceiling Gradient (High-Altitude Pale Blue/White) -->
    <linearGradient id="paleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 250, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Marble Floor Gradient (Cool, reflective white/gray) -->
    <linearGradient id="marbleFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 200, 210);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(230, 230, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Accent Blue (Diamond/Aqua Color) -->
    <stop id="diamondAqua" stop-color="rgb(0, 255, 255)" />
  </defs>

  <!-- 1. Ceiling/Walls (High, Pale Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#paleSkyGradient)" />

  <!-- 2. Grand Staircase (Perspective view, going up/right) -->
  <g fill="rgb(240, 240, 250)" stroke="rgb(180, 180, 190)" stroke-width="2">
    <!-- Step 1 -->
    <rect x="100" y="400" width="700" height="50" />
    <!-- Step 2 -->
    <rect x="200" y="350" width="600" height="50" />
    <!-- Step 3 -->
    <rect x="300" y="300" width="500" height="50" />
  </g>

  <!-- 3. Foreground Platform (Final Step of the Staircase) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#marbleFloorGradient)" />

  <!-- 4. Diamond/Jewel Accents (Scattered sparkle) -->
  <g fill="rgb(0, 255, 255)" opacity="0.8">
    <!-- Blue Diamonds on steps -->
    <polygon points="150,440 160,420 170,440 160,450 Z" />
    <polygon points="350,390 360,370 370,390 360,400 Z" />
    <!-- Aqua Gems on the wall -->
    <circle cx="50" cy="100" r="8" fill="rgb(0, 200, 200)" />
    <circle cx="750" cy="50" r="10" fill="rgb(0, 200, 200)" />
  </g>

  <!-- 5. Railing/Guard Detail (Top of the wall/platform) -->
  <rect x="0" y="440" width="800" height="10" fill="rgb(100, 150, 200)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`; // Grand Staircase

    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Wall Gradient (Opulent, polished stone) -->
    <linearGradient id="opulentStoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 200, 210);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(230, 230, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Reflective Floor Gradient (Mirror-like reflection) -->
    <linearGradient id="reflectiveFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Accent Aqua/Blue (Crystal Color) -->
    <stop id="crystalBlue" stop-color="rgb(0, 200, 255)" />
  </defs>

  <!-- 1. Walls/Ceiling (Opulent Stone) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#opulentStoneGradient)" />

  <!-- 2. Arched Windows/Alcoves (Perspective along the walls) -->
  <g fill="rgb(180, 220, 255)" stroke="rgb(100, 150, 200)" stroke-width="3" opacity="0.8">
    <!-- Left Alcoves -->
    <rect x="50" y="150" width="100" height="250" />
    <rect x="250" y="200" width="80" height="200" />
    <!-- Right Alcoves -->
    <rect x="650" y="150" width="100" height="250" />
    <rect x="470" y="200" width="80" height="200" />
  </g>

  <!-- 3. Foreground Platform (Reflective Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#reflectiveFloorGradient)" />

  <!-- 4. Chandelier/Crystal Detail (From the ceiling) -->
  <g transform="translate(400, 50)" fill="white" stroke="url(#crystalBlue)" stroke-width="2">
    <path d="M0 0 L-20 40 L20 40 Z" />
    <path d="M0 0 L-30 60 L-10 60 Z" />
    <path d="M0 0 L30 60 L10 60 Z" />
    <circle cx="0" cy="0" r="10" fill="rgb(0, 255, 255)" />
  </g>

  <!-- 5. Diamond Accents (Scattered sparkle on walls) -->
  <g fill="rgb(0, 255, 255)" opacity="0.9">
    <polygon points="10,400 20,380 30,400 20,410 Z" />
    <polygon points="770,400 780,380 790,400 780,410 Z" />
  </g>

  <!-- 6. Floor Reflection Line (Indicates mirror quality) -->
  <path d="M0 450 Q400 445, 800 450" stroke="white" stroke-width="2" opacity="0.3" fill="none" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`; // Diamond Gallery

    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Wall Gradient (Security Gray/Metal) -->
    <linearGradient id="securityWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 120, 130);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
    </linearGradient>
    <!-- Metal Grate Floor Gradient -->
    <linearGradient id="metalGrateFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 80, 90);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(110, 110, 120);stop-opacity:1" />
    </linearGradient>
    <!-- Accent Red (Security Warning) -->
    <stop id="securityRed" stop-color="rgb(255, 0, 0)" />
  </defs>

  <!-- 1. Walls/Ceiling (Security Gray) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#securityWallGradient)" />

  <!-- 2. Security Grates/Bars (Background detail) -->
  <g stroke="rgb(90, 90, 100)" stroke-width="5" opacity="0.9">
    <!-- Vertical Bars -->
    <line x1="50" y1="0" x2="50" y2="450" />
    <line x1="750" y1="0" x2="750" y2="450" />
    <!-- Horizontal Bars -->
    <line x1="0" y1="200" x2="800" y2="200" />
  </g>

  <!-- 3. Foreground Platform (Metal Grate Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#metalGrateFloorGradient)" />

  <!-- 4. Warning Lights/Panels (Red security details) -->
  <g fill="url(#securityRed)" opacity="0.7">
    <rect x="100" y="400" width="50" height="50" />
    <rect x="650" y="400" width="50" height="50" />
    <rect x="400" y="10" width="10" height="20" />
  </g>

  <!-- 5. Floor Grid/Plates (Detail on the floor) -->
  <g stroke="rgb(150, 150, 160)" stroke-width="1" opacity="0.8">
    <line x1="0" y1="475" x2="800" y2="475" />
    <line x1="300" y1="450" x2="300" y2="500" />
    <line x1="500" y1="450" x2="500" y2="500" />
  </g>

  <!-- 6. Faint Blue Diamond Glow (Reminder of the goal) -->
  <circle cx="400" cy="250" r="200" fill="rgb(0, 200, 255)" opacity="0.05" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`; // Throne Ante-Chamber
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Wall Gradient (Vibrant, high-energy blue) -->
    <linearGradient id="vibrantBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(50, 100, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 130, 230);stop-opacity:1" />
    </linearGradient>
    <!-- Energy Floor Gradient (White/Aqua) -->
    <linearGradient id="energyFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Diamond Energy Focus (Intense Aqua/White) -->
    <radialGradient id="diamondFocusGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(0, 255, 255);stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:rgb(0, 255, 255);stop-opacity:0.1"/>
    </radialGradient>
  </defs>

  <!-- 1. Walls/Ceiling (Vibrant Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#vibrantBlueGradient)" />

  <!-- 2. Energy Focus Glow (Center) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#diamondFocusGlow)" />

  <!-- 3. Foreground Platform (Energy Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#energyFloorGradient)" />

  <!-- 4. Energy Lines (Converging toward the center-top) -->
  <g stroke="white" stroke-width="2" opacity="0.8">
    <line x1="0" y1="450" x2="400" y2="100" />
    <line x1="800" y1="450" x2="400" y2="100" />
    <line x1="200" y1="450" x2="400" y2="200" />
    <line x1="600" y1="450" x2="400" y2="200" />
  </g>

  <!-- 5. Diamond Crystalline Pillars (Foreground frame) -->
  <g fill="rgb(0, 200, 200)" stroke="white" stroke-width="2">
    <rect x="0" y="150" width="30" height="300" />
    <rect x="770" y="150" width="30" height="300" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`; // Final Ascent
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Throne Room Wall Gradient (Warm Gold/Yellow) -->
    <linearGradient id="throneWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(240, 220, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 240, 180);stop-opacity:1" />
    </linearGradient>
    <!-- Throne Room Floor Gradient (Polished Marble/Gold inlay) -->
    <linearGradient id="throneFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 200, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 220, 220);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Walls/Ceiling (Warm Gold/Yellow) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#throneWallGradient)" />

  <!-- 2. Distant Colonnade/Windows (Perspective detail, using gold lines) -->
  <g stroke="rgb(218, 165, 32)" stroke-width="3" opacity="0.7" fill="none">
    <line x1="100" y1="0" x2="100" y2="450" />
    <line x1="700" y1="0" x2="700" y2="450" />
    <line x1="200" y1="0" x2="200" y2="450" />
    <line x1="600" y1="0" x2="600" y2="450" />
  </g>

  <!-- 3. Throne Altar/Pedestal (Central feature for the Queen) -->
  <g transform="translate(400, 450)">
    <!-- Main Pedestal Box (Inspired by the white/metal box) -->
    <rect x="-150" y="-150" width="300" height="150" fill="rgb(240, 240, 240)" stroke="rgb(180, 180, 180)" stroke-width="2" />
    <!-- Gold Trim/Railing -->
    <rect x="-160" y="-160" width="320" height="10" fill="gold" />

    <!-- Throne Chair Silhouette (Red/Gold detail) -->
    <g transform="translate(0, -150) scale(0.8)">
      <rect x="-100" y="-150" width="200" height="200" fill="red" />
      <rect x="-80" y="-130" width="160" height="180" fill="rgb(150, 0, 0)" />
      <path d="M-100 50 Q0 -100, 100 50" fill="rgb(255, 215, 0)" stroke="rgb(218, 165, 32)" stroke-width="3" />
    </g>
  </g>

  <!-- 4. Foreground Platform (Throne Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#throneFloorGradient)" />

  <!-- 5. Royal Carpet (Red path detail) -->
  <rect x="350" y="450" width="100" height="50" fill="red" />

  <!-- 6. Diamond/Crystal Chandelier Shadow (Small dots of light on the floor) -->
  <g fill="rgb(0, 255, 255)" opacity="0.5">
    <circle cx="250" cy="460" r="3" />
    <circle cx="550" cy="480" r="4" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`; // Throne Room

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3, MAP_SVG_4, MAP_SVG_5];

    // All other NPC SVG placeholders are defined inside NPC_DATA above.

    // --- 3. STATE AND GAME VARIABLES ---

    let mapContainer = null;
    let backgroundMusic = null;
    let musicButton = null;
    let currentMapIndex = 0;
    let phasesCompleted = 0;

    // Avatar state
    let avatarX = LEVEL_START_X;
    let avatarY = AVATAR_GROUND_Y;
    let avatarVX = 0;
    let avatarVY = 0;
    let isJumping = false;
    let isLevelComplete = false;
    let selfAvatarImage = null;
    let keys = {};

    // Dialogue state
    let isDialogueActive = false;
    let currentDialogueIndex = 0;
    let dialogueBox = null;
    let dialogueName = null;
    let dialogueText = null;
    let activeNPCDialogue = null;


    // --- 4. ENVIRONMENT AND SETUP ---

    function setupEnvironment() {
        const originalBody = document.body;

        selfAvatarImage = document.querySelector('#selfavatarimage');
        if (!selfAvatarImage) {
            setTimeout(setupEnvironment, 100);
            return;
        }

        // 1. Setup the Map Container and clear body
        mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            overflow: hidden;
            background-color: #000000;
        `;

        originalBody.innerHTML = '';
        originalBody.style.background = 'none';
        originalBody.appendChild(mapContainer);

        // 2. Add Avatar
        originalBody.appendChild(selfAvatarImage);
        selfAvatarImage.style.position = 'absolute';
        selfAvatarImage.style.zIndex = '1000';
        selfAvatarImage.style.pointerEvents = 'none';
        selfAvatarImage.style.display = 'block';
        selfAvatarImage.style.width = AVATAR_HEIGHT_PX + 'px';
        selfAvatarImage.style.height = AVATAR_HEIGHT_PX + 'px';

        // 3. Inject Dialogue Box
        createDialogueBox();

        // 4. Load initial map (Map 1)
        updateMapSVG();

        // 5. Setup Music (initialization only) and Button
        initializeMusic();
        createMusicButton();

        // 6. Start game loop
        updateAvatar();
    }

    function initializeMusic() {
        backgroundMusic = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
    }

    function createMusicButton() {
        musicButton = document.createElement('button');
        musicButton.textContent = LEVEL_TITLE + " Music";
        musicButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #34495e;
            color: #ecf0f1;
            border: 2px solid #bdc3c7;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(189, 195, 199, 0.7);
        `;
        musicButton.addEventListener('click', startMusic);
        document.body.appendChild(musicButton);
    }

    function startMusic() {
        if (backgroundMusic) {
            backgroundMusic.play()
                .then(() => {
                    musicButton.style.display = 'none';
                    musicButton.removeEventListener('click', startMusic);
                })
                .catch(e => {
                    console.error("Failed to play music on click:", e);
                    musicButton.textContent = "Music Error (Click to retry)";
                });
        }
    }

    function updateMapSVG() {
        if (currentMapIndex < BACKGROUND_SVGS.length) {
            mapContainer.innerHTML = BACKGROUND_SVGS[currentMapIndex];
        }
        // Inject NPCs relevant to the current map phase
        injectNPCs();
    }

    function removeAllNPCs() {
        document.querySelectorAll('.npc-clickarea').forEach(npc => npc.remove());
    }

    // Injects NPCs based on the phase (same corrected function as before)
    function injectNPCs() {
        removeAllNPCs();

        const currentNPCData = NPC_DATA[currentMapIndex];
        if (!currentNPCData) return;

        const npcs = Array.isArray(currentNPCData) ? currentNPCData : [currentNPCData];

        npcs.forEach(npcData => {
            const isFinalNPC = npcData.final_npc;
            const size = NPC_WIDTH_DEFAULT;
            const x = npcData.initial_x || npcData.x;
            const y = npcData.initial_y || npcData.y || AVATAR_GROUND_Y;

            const clickArea = document.createElement('div');
            clickArea.id = `${npcData.char_id}-clickarea`;
            clickArea.className = 'npc-clickarea';

            clickArea.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                z-index: 999;
                cursor: pointer;
                display: block;
            `;

            const svgContainer = document.createElement('div');
            svgContainer.id = npcData.char_id;
            svgContainer.innerHTML = npcData.svg_content;

            svgContainer.style.cssText = `
                width: 100%;
                height: 100%;
                ${isFinalNPC && npcData.scale ? `transform: scale(${npcData.scale}); transform-origin: top left;` : ''}
            `;

            clickArea.appendChild(svgContainer);
            clickArea.addEventListener('click', () => startDialogue(npcData));
            document.body.appendChild(clickArea);
        });
    }


    // --- 5. NPC AND DIALOGUE LOGIC ---

    function createDialogueBox() {
        const box = document.createElement('div');
        box.id = DIALOGUE_BOX_ID;

        dialogueName = document.createElement('div');
        dialogueName.style.cssText = `
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
            color: #f1c40f; /* Gold for The Top */
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        dialogueText = document.createElement('div');
        dialogueText.style.cssText = `
            font-size: 18px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        box.appendChild(dialogueName);
        box.appendChild(dialogueText);
        document.body.appendChild(box);
        dialogueBox = box;

        // Custom style for the final, regal dialogue box
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 650px; /* Slightly wider for the serious dialogue */
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(20, 20, 30, 0.95); /* Deep Black/Blue Velvet */
            border: 5px solid #ffd700; /* True Gold Border */
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.9); /* Strong Gold Glow */
            border-radius: 10px;
            font-family: 'Times New Roman', serif; /* Royal Font */
            z-index: 10001;
            display: none;
            cursor: pointer;
        `;
    }

    function startDialogue(npcData) {
        if (isDialogueActive || isLevelComplete) return;

        isDialogueActive = true;
        currentDialogueIndex = 0;
        activeNPCDialogue = npcData.dialogue;

        dialogueBox.style.display = 'block';
        dialogueBox.style.pointerEvents = 'auto';

        // Reset listeners
        dialogueBox.removeEventListener('click', processDialogue);
        dialogueBox.removeEventListener('click', endDialogue);

        processDialogue();
        dialogueBox.addEventListener('click', processDialogue);
    }

    function processDialogue() {
        if (!isDialogueActive || !activeNPCDialogue) return;

        if (currentDialogueIndex >= activeNPCDialogue.length) {
            endDialogue();
            return;
        }

        const line = activeNPCDialogue[currentDialogueIndex];
        const parts = line.split(':');
        const name = parts[0];
        const text = parts.slice(1).join(':').trim();

        dialogueName.textContent = `${name}:`;
        dialogueText.textContent = text;

        currentDialogueIndex++;

        // If this is the last line, change the listener to end the dialogue/level
        if (currentDialogueIndex >= activeNPCDialogue.length) {
            dialogueBox.removeEventListener('click', processDialogue);
            dialogueBox.addEventListener('click', endDialogue);
        }
    }

    function endDialogue() {
        isDialogueActive = false;
        dialogueBox.style.display = 'none';
        currentDialogueIndex = 0;
        dialogueBox.style.pointerEvents = 'none';

        // Final Level Completion Check (Queen Diamond is only NPC in phase 4)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- GRAND FINALE VICTORY SCREEN ---
            const finalMessageLine = NPC_DATA[4].dialogue[7]; // "Your answer is reflected... Go, and draw your future."
            const finalMessage = "DRAWARIA.ONLINE STORIES IS COMPLETE!";
            const subMessage = finalMessageLine.split(':')[1].trim().toUpperCase();

            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:30%; left:50%; transform:translate(-50%, -50%); color:#ffd700; font-size:48px; text-align:center; font-family: 'Times New Roman', serif; text-shadow: 0 0 20px #ffd700;">
                    ${finalMessage}<br>
                    <span style="font-size: 28px; color: white;">"${subMessage}"</span>
                </div>
            `;
            createBackToLevelsButton();
            // ---------------------------

            if (backgroundMusic) {
                 backgroundMusic.pause();
            }
            if (musicButton) {
                musicButton.style.display = 'none';
            }
            removeAllNPCs();

            // Disable movement
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }

    function createBackToLevelsButton() {
        const button = document.createElement('button');
        button.textContent = "Play Again";
        button.style.cssText = `
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background-color: #34495e;
            color: #ffd700;
            border: 4px solid #ffd700;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
        `;
        button.addEventListener('click', () => {
            window.location.reload();
        });
        document.body.appendChild(button);
    }


    // --- 6. GAME LOOP AND MOVEMENT LOGIC ---

    function advanceMap() {
        // Increment phase/map
        phasesCompleted++;
        if (currentMapIndex < BACKGROUND_SVGS.length - 1) {
            currentMapIndex++;
            updateMapSVG();
        }
    }

    function updateAvatar() {
        if (isLevelComplete) return;

        // Standard Platformer Physics
        const GRAVITY = 0.5;
        const JUMP_HEIGHT = 15;
        const MAX_SPEED = 10;
        const FRICTION = 0.9;

        // Stop movement during dialogue
        if (isDialogueActive) {
            avatarVX = 0;
            avatarVY = 0;
            isJumping = false;
        } else {
            avatarVY += GRAVITY;

            if (keys['ArrowRight']) {
                avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
            } else if (keys['ArrowLeft']) {
                avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
            } else {
                avatarVX *= FRICTION;
            }

            // Normal Platformer Jump
            if (keys['ArrowUp'] && !isJumping) {
                avatarVY = -JUMP_HEIGHT;
                isJumping = true;
            }
        }

        avatarX += avatarVX;
        avatarY += avatarVY;

        // Ground collision
        if (avatarY > AVATAR_GROUND_Y) {
            avatarY = AVATAR_GROUND_Y;
            avatarVY = 0;
            isJumping = false;
        }

        // LEVEL PROGRESSION LOGIC (Teleport to start and advance map)
        if (avatarX > LEVEL_END_X) {
            avatarX = LEVEL_START_X; // Teleport to start

            // Advance map if there are more phases
            if (phasesCompleted < MAX_TRANSITIONS) {
                advanceMap();
            } else if (currentMapIndex === BACKGROUND_SVGS.length - 2) {
                 // Final transition to the last map (MAP_SVG_5)
                 currentMapIndex++;
                 updateMapSVG();
            }
        }

        // Keep avatar within left boundary
        if (avatarX < 0) {
            avatarX = 0;
            avatarVX = 0;
        }

        // Update the visual representation of the avatar
        drawAvatar(avatarX, avatarY);

        requestAnimationFrame(updateAvatar);
    }

    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    function drawAvatar(x, y) {
        if (selfAvatarImage) {
            // Apply scale/translation for the in-game coordinates
            selfAvatarImage.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            selfAvatarImage.style.border = 'none';
            selfAvatarImage.style.boxShadow = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Initial script start with a delay to ensure Drawaria elements are loaded
    setTimeout(setupEnvironment, 1000);

})();