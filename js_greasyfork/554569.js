// ==UserScript==
// @name         Drawaria Game Level 8 - Castle Lands
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 8: Castle Lands. Navigate the futuristic, metallic fortress and survive the robotic defenders.
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

    const LEVEL_TITLE = "Castle Lands";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-castle-lands.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    // Y position where the bottom of the avatar rests (simulating the ground)
    const AVATAR_HEIGHT_PX = 64;
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX;

    const LEVEL_END_X = VIEWBOX_WIDTH + 220; // Trigger for advancing the level
    const LEVEL_START_X = 50; // Starting X coordinate

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const NPC_WIDTH_DEFAULT = 100; // Default size for simpler NPC collision

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // Character SVG Placeholders
    const CHAR_SVG_1 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="200" style="filter: url(&quot;#inner-shadow-filter-0&quot;);" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="229.661" cy="196.95" rx="86.437" ry="28.118"/>
    <path d="M 123.437 44.321 C 142.524 77.723 343.568 59.686 340.225 41.761 L 326.512 110.971 L 131.768 110.971 L 123.437 44.321 Z" style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);"/>
    <path d="M 130.727 109.93 C 130.727 85.998 331.719 80.052 331.719 109.93 L 331.719 177.621 C 331.719 186.824 324.259 194.284 315.056 194.284 C 317.357 180.477 150.61 174.962 147.39 194.284 C 138.187 194.284 130.727 186.824 130.727 177.621 L 130.727 109.93 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="147.317" cy="113.921" rx="5.247" ry="6.44"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="149.702" cy="175.935" rx="4.293" ry="6.44"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-314.04" cy="111.297" rx="5.247" ry="6.44" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-311.65" cy="173.311" rx="4.293" ry="6.44" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
    <g style="transform-origin: 299.114px 407.214px;" transform="matrix(1, 0, 0, 1, -102.00001, 0)">
      <path d="M 303.14 435.297 C 305.001 435.36 306.448 435.548 307.976 434.951 C 309.629 434.306 311.623 433.063 312.639 431.324 C 313.79 429.355 314.592 426.666 314.021 423.379 C 313.194 418.617 307.636 411.645 305.04 405.072 C 302.292 398.115 299.064 388.267 298.131 382.619 C 297.496 378.774 298.902 376.164 298.131 373.637 C 297.435 371.357 296.515 369.388 294.159 367.938 C 290.82 365.884 282.507 364.014 277.923 364.484 C 274.05 364.881 269.909 367.479 268.079 369.147 C 266.87 370.249 266.648 371.325 266.351 372.601 C 266.037 373.957 266.018 374.638 266.351 377.092 C 267.055 382.271 269.06 396.504 272.915 405.417 C 276.864 414.55 285.88 426.906 290.013 431.151 C 292.165 433.362 293.167 433.567 295.195 434.26 C 297.466 435.036 300.864 435.219 303.14 435.297 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000011, 0.000001)"/>
      <rect x="-332.12" y="425.069" width="55.653" height="24.948" style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" rx="7.292" ry="7.292" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-290.8" cy="400.526" rx="4.159" ry="5.891" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-320.26" cy="437.039" rx="2.426" ry="4.284" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-30" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;20 -10" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g>
      <path d="M 369.736 314.728 L 392.707 304.396 L 379.311 268.906 C 383.708 276.833 347.855 297.515 342.794 288.39 L 369.736 314.728 Z" style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 370.709px 293.344px;" transform="matrix(-1, 0, 0, -1, -0.000025, 0)"/>
      <path d="M 372.807 288.261 C 374.444 287.372 375.786 286.801 376.801 285.511 C 377.899 284.118 378.988 282.035 378.982 280.021 C 378.976 277.741 378.304 275.016 376.146 272.472 C 373.019 268.786 364.694 265.594 359.125 261.244 C 353.23 256.639 345.455 249.786 341.788 245.391 C 339.292 242.398 339.181 239.436 337.235 237.648 C 335.48 236.035 333.689 234.804 330.923 234.749 C 327.003 234.671 318.889 237.272 315.176 240.001 C 312.039 242.306 309.786 246.645 309.054 249.01 C 308.57 250.573 308.924 251.613 309.315 252.864 C 309.732 254.192 310.061 254.788 311.592 256.735 C 314.824 260.843 323.766 272.095 331.607 277.824 C 339.641 283.696 353.676 289.777 359.39 291.341 C 362.366 292.156 363.334 291.825 365.433 291.394 C 367.784 290.912 370.806 289.347 372.807 288.261 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64); transform-origin: 343.672px 264.322px;" transform="matrix(-1, 0, 0, -1, -0.000002, 0.000006)"/>
      <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 98.445px 269.8px;" cx="97.802" cy="270.433" rx="4.159" ry="5.891" transform="matrix(-0.862017, 0.50688, 0.506882, 0.862016, 231.652927, -15.575514)"/>
      <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 98.445px 269.8px;" cx="97.802" cy="270.433" rx="4.159" ry="5.891" transform="matrix(-0.862017, 0.50688, 0.506882, 0.862016, 254.560612, 1.012792)"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 20" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g>
      <path d="M 73.461 270.285 L 96.432 280.617 L 83.036 316.107 C 87.433 308.18 51.58 287.498 46.519 296.623 L 73.461 270.285 Z" style="stroke-width: 3; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 74.434px 291.669px;"/>
      <path d="M 130.607 238.708 C 132.244 239.597 133.586 240.168 134.601 241.458 C 135.699 242.851 136.788 244.934 136.782 246.948 C 136.776 249.228 136.104 251.953 133.946 254.497 C 130.819 258.183 122.494 261.375 116.925 265.725 C 111.03 270.33 103.255 277.183 99.588 281.578 C 97.092 284.571 96.981 287.533 95.035 289.321 C 93.28 290.934 91.489 292.165 88.723 292.22 C 84.803 292.298 76.689 289.697 72.976 286.968 C 69.839 284.663 67.586 280.324 66.854 277.959 C 66.37 276.396 66.724 275.356 67.115 274.105 C 67.532 272.777 67.861 272.181 69.392 270.234 C 72.624 266.126 81.566 254.874 89.407 249.145 C 97.441 243.273 111.476 237.192 117.19 235.628 C 120.166 234.813 121.134 235.144 123.233 235.575 C 125.584 236.057 128.606 237.622 130.607 238.708 Z" style="stroke-width: 3; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64); transform-origin: 101.472px 262.647px;"/>
      <ellipse style="stroke-width: 3; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 98.445px 269.8px;" cx="97.802" cy="270.433" rx="4.159" ry="5.891" transform="matrix(0.862017, 0.50688, -0.506882, 0.862016, 16.601387, -17.250556)"/>
      <ellipse style="stroke-width: 3; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55); transform-origin: 98.445px 269.8px;" cx="97.802" cy="270.433" rx="4.159" ry="5.891" transform="matrix(0.862017, 0.50688, -0.506882, 0.862016, -6.306358, -0.662242)"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 20" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g transform="matrix(-1, 0, 0, 1, 406.34205, 0)" style="">
      <g style="transform-origin: 144.671px 407.869px;">
        <g style="transform-origin: 144.671px 407.869px;">
          <path d="M 166.609 365.144 C 168.47 365.081 169.917 364.893 171.445 365.49 C 173.098 366.135 175.092 367.378 176.108 369.117 C 177.259 371.086 178.061 373.775 177.49 377.062 C 176.663 381.824 171.105 388.796 168.509 395.369 C 165.761 402.326 162.533 412.174 161.6 417.822 C 160.965 421.667 162.371 424.277 161.6 426.804 C 160.904 429.084 159.984 431.053 157.628 432.503 C 154.289 434.557 145.976 436.427 141.392 435.957 C 137.519 435.56 133.378 432.962 131.548 431.294 C 130.339 430.192 130.117 429.116 129.82 427.84 C 129.506 426.484 129.487 425.803 129.82 423.349 C 130.524 418.17 132.529 403.937 136.384 395.024 C 140.333 385.891 149.349 373.535 153.482 369.29 C 155.634 367.079 156.636 366.874 158.664 366.181 C 160.935 365.405 164.333 365.222 166.609 365.144 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64);"/>
          <rect x="111.663" y="425.724" width="55.653" height="24.948" style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" rx="7.292" ry="7.292"/>
          <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="152.985" cy="401.181" rx="4.159" ry="5.891"/>
          <animateTransform type="rotate" additive="sum" attributeName="transform" values="0; 0" dur="2s" fill="freeze"/>
        </g>
        <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="123.529" cy="437.694" rx="2.426" ry="4.284"/>
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;41" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-20 -10" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      </g>
    </g>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="221.17" cy="296.022" rx="102.084" ry="96.837"/>
    <path d="M 190.164 331.51 L 250.269 331.51 C 240.754 335.835 257.268 385.312 261.241 383.506 C 262.884 393.914 181.011 397.174 178.853 383.506 C 182.862 387.456 199.665 339.924 190.164 331.51 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64);"/>
    <path d="M 124.81 266.634 L 317.53 266.634 L 319.53 271.881 L 122.81 271.881 L 124.81 266.634 Z" style="stroke-width: 3px; stroke: rgb(26, 26, 26); fill: rgb(64, 64, 64);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="202.888" cy="344.348" rx="4.159" ry="5.198"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="200.462" cy="377.616" rx="3.812" ry="4.505"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-237.08" cy="344.289" rx="4.159" ry="5.198" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(144, 144, 144); stroke: rgb(55, 55, 55);" cx="-239.5" cy="377.557" rx="3.812" ry="4.505" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(55, 55, 55); fill: rgb(46, 46, 46);" cx="177.936" cy="233.107" rx="6.238" ry="7.624"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(55, 55, 55); fill: rgb(46, 46, 46);" cx="270.6" cy="232.988" rx="6.503" ry="7.277"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(55, 55, 55); fill: rgb(46, 46, 46);" cx="295.416" cy="289.782" rx="5.891" ry="7.624"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(55, 55, 55); fill: rgb(46, 46, 46);" cx="154.451" cy="288.059" rx="6.931" ry="8.664"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;30 0" dur="9.19s" fill="freeze" keyTimes="0; 1" begin="-0.04s" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.185 709.389" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 0 0 6 0.86 #719b9fd3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl" type="linear" slope="1.72"/>
      </feComponentTransfer>
      <feFlood flood-color="#719b9fd3"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <rect x="149.573" y="95.126" width="169.787" height="160.287" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" rx="13.654" ry="13.654"/>
    <g transform="matrix(1, -0.004712, 0, 1, 0, -9.000002)" style="transform-origin: 231.802px 554.332px;">
      <path d="M 233.165 519.618 L 233.165 605.717 L 166.64 605.717 L 166.64 478.486 L 233.165 478.486 L 233.165 478.788 L 233.71 478.788 L 233.71 478.485 L 300.235 478.485 L 300.235 605.716 L 233.71 605.716 L 233.71 519.618 L 233.165 519.618 Z" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);"/>
      <path d="M 163.096 600.782 Q 197.722 571.866 232.347 600.782 L 232.347 600.782 Q 266.973 629.698 197.722 629.698 L 197.722 629.698 Q 128.47 629.698 163.096 600.782 Z" bx:shape="triangle 128.47 571.866 138.503 57.832 0.5 0.5 1@9d318b85" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(136, 208, 206);"/>
      <path d="M 231.257 601.264 Q 265.883 572.348 300.508 601.264 L 300.508 601.264 Q 335.134 630.18 265.883 630.18 L 265.883 630.18 Q 196.631 630.18 231.257 601.264 Z" bx:shape="triangle 196.631 572.348 138.503 57.832 0.5 0.5 1@24dde6bf" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(136, 208, 206);"/>
      <animateTransform type="skewY" additive="sum" attributeName="transform" values="0;-9" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <rect x="190.363" y="253.064" width="131.96" height="193.738" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(167, 255, 252);" transform="matrix(0.999999, 0.001252, 0, 1.000001, -22.633467, 32.941918)"/>
    <path d="M 318.173 252.236 C 318.173 267.194 279.243 313.592 232.686 313.592 C 186.128 313.592 149.573 267.194 149.573 252.236 C 149.573 237.277 187.315 225.15 233.873 225.15 C 280.431 225.15 318.173 237.277 318.173 252.236 Z" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(114, 174, 172);"/>
    <path d="M 175.694 71.011 L 290.864 72.198 C 302.292 69.864 335.213 78.674 331.233 94.758 L 331.233 131.563 C 331.233 140.744 323.791 148.186 314.61 148.186 L 153.135 148.186 C 143.954 148.186 136.512 140.744 136.512 131.563 L 136.512 94.758 C 132.25 84.968 150.156 68.674 175.694 71.011 Z" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(114, 174, 172);"/>
    <path d="M 186.965 -200.442 Q 236.888 -238.84 286.812 -200.442 L 286.812 -200.442 Q 336.735 -162.043 236.888 -162.043 L 236.888 -162.043 Q 137.041 -162.043 186.965 -200.442 Z" bx:shape="triangle 137.041 -238.84 199.694 76.797 0.5 0.5 1@e9c72f41" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(189, 233, 255); filter: url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="156.825" cy="129.887" rx="8.725" ry="7.634"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="160.642" cy="91.717" rx="8.179" ry="6.543"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="304.053" cy="87.9" rx="8.725" ry="7.089"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="308.415" cy="135.885" rx="8.725" ry="5.998"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="180.817" cy="247.123" rx="7.634" ry="5.998"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="206.446" cy="284.202" rx="9.27" ry="5.998"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="282.241" cy="250.394" rx="8.725" ry="5.998"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" cx="260.429" cy="285.292" rx="8.725" ry="5.998"/>
    <g>
      <rect x="104.477" y="308.849" width="50.167" height="151.589" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123); transform-box: fill-box; transform-origin: 50% 50%;" rx="9.815" ry="9.815" transform="matrix(0.987925, 0.154936, -0.154939, 0.987924, -11.996437, -1.090665)"/>
      <path d="M 107.203 -314.152 Q 138.285 -359.41 169.366 -314.152 L 169.366 -314.152 Q 200.448 -268.893 138.285 -268.893 L 138.285 -268.893 Q 76.122 -268.893 107.203 -314.152 Z" bx:shape="triangle 76.122 -359.41 124.326 90.517 0.5 0.5 1@10eff422" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(136, 208, 206);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <rect x="104.48" y="308.85" width="50.167" height="151.589" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123); transform-origin: 129.566px 384.645px;" rx="9.815" ry="9.815" transform="matrix(-0.908961, 0.416881, 0.416888, 0.908958, 239.920544, -8.18138)"/>
      <path d="M 299.145 -311.011 Q 330.226 -356.27 361.308 -311.011 L 361.308 -311.011 Q 392.389 -265.753 330.226 -265.753 L 330.226 -265.753 Q 268.063 -265.753 299.145 -311.011 Z" bx:shape="triangle 268.063 -356.27 124.326 90.517 0.5 0.5 1@7b86bcd9" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(136, 208, 206);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(167, 255, 252);" cx="101.751" cy="476.087" rx="37.625" ry="34.898"/>
      <rect x="48.771" y="418.8" width="33.808" height="320.62" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(82, 124, 123);" transform="matrix(0.999999, 0.001417, 0, 1.000001, 328.895606, -227.91361)" rx="8.725" ry="8.725"/>
      <path d="M 394.592 140.919 Q 396.751 136.273 398.91 140.919 L 430.581 209.057 Q 432.74 213.703 428.421 213.703 L 365.081 213.703 Q 360.762 213.703 362.921 209.057 Z" bx:shape="triangle 360.762 136.273 71.978 77.43 0.5 0.06 1@03500566" style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(167, 255, 252);"/>
      <ellipse style="stroke-width: 3px; stroke: rgb(46, 77, 85); fill: rgb(167, 255, 252);" cx="418.018" cy="439.008" rx="31.081" ry="31.626"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;20 0" dur="6.56s" fill="freeze" begin="-0.07s" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <pattern x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse" viewBox="0 0 100 100" id="pattern-0">
      <rect x="0" y="0" width="50" height="100" style="fill: black;"/>
    </pattern>
    <pattern id="pattern-0-0" href="#pattern-0" patternTransform="matrix(1, 0, 0, 1, 172.029179, -247.981569)"/>
    <pattern id="pattern-0-1" href="#pattern-0" patternTransform="matrix(1, 0, 0, 1, 172.029287, -247.981859)"/>
    <pattern id="pattern-0-2" href="#pattern-0" patternTransform="matrix(1, 0, 0, 1, 213.974, 179.457007)"/>
    <pattern id="pattern-0-3" href="#pattern-0" patternTransform="matrix(1, 0, 0, 1, 292.984992, 185.182994)"/>
    <linearGradient gradientUnits="userSpaceOnUse" x1="260.413" y1="172.237" x2="260.413" y2="338.459" id="gradient-0">
      <stop offset="0" style="stop-color: rgb(56.471% 56.471% 56.471%)"/>
      <stop offset="1" style="stop-color: rgb(33.08% 33.08% 33.08%)"/>
    </linearGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="394.444" cy="216.666" r="62.348" id="gradient-1">
      <stop offset="0" style="stop-color: rgb(56.471% 56.471% 56.471%)"/>
      <stop offset="1" style="stop-color: rgb(33.08% 33.08% 33.08%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="727.222" cy="501.667" r="68.159" id="gradient-2">
      <stop offset="0" style="stop-color: rgb(56.471% 56.471% 56.471%)"/>
      <stop offset="1" style="stop-color: rgb(33.08% 33.08% 33.08%)"/>
    </radialGradient>
  </defs>
  <g>
    <g>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 186.517 233.522 C 186.517 221.637 204.569 202.444 194.828 205.027 C 191.282 205.967 142.785 152.839 159.209 137.35 C 160.411 136.217 150.556 141.083 148.523 142.099 C 137.855 147.433 127.48 155.375 121.215 159.909 C 111.261 167.113 152.245 244.281 191.266 235.897"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67); transform-box: fill-box; transform-origin: 50% 50%;" d="M 378.725 349.664 C 378.725 337.779 396.777 318.586 387.036 321.169 C 383.49 322.109 334.993 268.981 351.417 253.492 C 352.619 252.359 342.764 257.225 340.731 258.241 C 330.063 263.575 319.688 271.517 313.423 276.051 C 303.469 283.255 344.453 360.423 383.474 352.039" transform="matrix(-1, 0, 0, -1, -0.000006, -0.00001)"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3.35473px; fill: url(&quot;#gradient-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.893502, 0, 0, 0.895017, -270.781439, -84.573847)" d="M 394.444 151.111 L 394.444 151.111 L 406.599 179.258 A 39.333 39.333 0 0 1 406.599 179.258 L 432.977 163.631 L 432.977 163.631 L 426.266 193.547 A 39.333 39.333 0 0 1 426.266 193.547 L 456.792 196.409 L 456.792 196.409 L 433.778 216.667 A 39.333 39.333 0 0 1 433.778 216.667 L 456.792 236.924 L 456.792 236.924 L 426.266 239.786 A 39.333 39.333 0 0 1 426.266 239.786 L 432.977 269.702 L 432.977 269.702 L 406.599 254.075 A 39.333 39.333 0 0 1 406.599 254.075 L 394.444 282.222 L 394.444 282.222 L 382.29 254.075 A 39.333 39.333 0 0 1 382.29 254.075 L 355.912 269.702 L 355.912 269.702 L 362.623 239.786 A 39.333 39.333 0 0 1 362.623 239.786 L 332.097 236.924 L 332.097 236.924 L 355.111 216.667 A 39.333 39.333 0 0 1 355.111 216.667 L 332.097 196.409 L 332.097 196.409 L 362.623 193.547 A 39.333 39.333 0 0 1 362.623 193.547 L 355.912 163.631 L 355.912 163.631 L 382.29 179.258 A 39.333 39.333 0 0 1 382.29 179.258 Z M 394.444 201.589 A 15.078 15.078 0 0 0 394.444 231.744 A 15.078 15.078 0 0 0 394.444 201.589" bx:shape="cog 394.444 216.667 15.078 39.333 65.556 1 10 1@5b3da3e4">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-180" begin="0s" dur="1.04s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      </path>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 358.873 270.739 C 366.227 280.985 336.291 303.697 327.159 296.779 C 335.025 303.543 365.891 283.163 358.873 270.739 Z"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 377.793 295.489 C 385.147 305.735 355.211 328.447 346.079 321.529 C 353.945 328.293 384.811 307.913 377.793 295.489 Z"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3.77709px; fill: url(&quot;#gradient-2&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.788157, 0, 0, 0.800368, -354.852058, -139.555759)" d="M 727.222 430 L 727.222 430 L 740.953 459.408 A 44.433 44.433 0 0 1 740.953 459.408 L 769.347 443.687 L 769.347 443.687 L 763.17 475.549 A 44.433 44.433 0 0 1 763.17 475.549 L 795.381 479.52 L 795.381 479.52 L 771.656 501.667 A 44.433 44.433 0 0 1 771.656 501.667 L 795.381 523.813 L 795.381 523.813 L 763.17 527.784 A 44.433 44.433 0 0 1 763.17 527.784 L 769.347 559.646 L 769.347 559.646 L 740.953 543.925 A 44.433 44.433 0 0 1 740.953 543.925 L 727.222 573.333 L 727.222 573.333 L 713.492 543.925 A 44.433 44.433 0 0 1 713.492 543.925 L 685.098 559.646 L 685.098 559.646 L 691.275 527.784 A 44.433 44.433 0 0 1 691.275 527.784 L 659.063 523.813 L 659.063 523.813 L 682.789 501.667 A 44.433 44.433 0 0 1 682.789 501.667 L 659.063 479.52 L 659.063 479.52 L 691.275 475.549 A 44.433 44.433 0 0 1 691.275 475.549 L 685.098 443.687 L 685.098 443.687 L 713.492 459.408 A 44.433 44.433 0 0 1 713.492 459.408 Z M 727.222 484.467 A 17.2 17.2 0 0 0 727.222 518.867 A 17.2 17.2 0 0 0 727.222 484.467" bx:shape="cog 727.222 501.667 17.2 44.433 71.667 1 10 1@5b54acff">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="0.93s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </path>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 161.646 164.764 C 169 175.01 139.064 197.722 129.932 190.804 C 137.798 197.568 168.664 177.188 161.646 164.764 Z"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 179.147 189.365 C 186.501 199.611 156.565 222.323 147.433 215.405 C 155.299 222.169 186.165 201.789 179.147 189.365 Z"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 30" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g style="">
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-0&quot;);" cx="260.413" cy="255.348" rx="81.331" ry="83.111"/>
      <path d="M 167.015 -242.925 Q 184.529 -272.7 202.044 -242.925 L 202.044 -242.925 Q 219.558 -213.151 184.529 -213.151 L 184.529 -213.151 Q 149.5 -213.151 167.015 -242.925 Z" bx:shape="triangle 149.5 -272.7 70.058 59.549 0.5 0.5 1@b6bddd82" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#pattern-0-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.89629, 0.443469, 0.443476, -0.896286, 42.027033, 505.991111)"/>
      <path d="M 167.015 -242.925 Q 184.529 -272.7 202.044 -242.925 L 202.044 -242.925 Q 219.558 -213.151 184.529 -213.151 L 184.529 -213.151 Q 149.5 -213.151 167.015 -242.925 Z" bx:shape="triangle 149.5 -272.7 70.058 59.549 0.5 0.5 1@b6bddd82" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#pattern-0-1&quot;); transform-origin: 184.529px -235.482px;" transform="matrix(-0.89629, 0.443469, -0.443476, -0.896286, 112.965547, 504.683973)"/>
      <path style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(67, 67, 67);" d="M 192.087 210.399 C 192.087 228.314 330.965 238.378 330.965 213.308 C 324.835 168.041 210.892 149.03 192.087 210.399 Z"/>
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#pattern-0-2&quot;);" cx="226.474" cy="191.957" rx="6.584" ry="6.012"/>
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#pattern-0-3&quot;);" cx="305.485" cy="197.683" rx="6.012" ry="4.867"/>
    </g>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;20 -30" begin="0.06s" dur="6.33s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_4 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g>
    <g style="transform-origin: 238.723px 114.096px;" transform="matrix(-1, 0, 0, 1, 13.935252, 0)">
      <rect x="124.833" y="43.033" width="151.89" height="164.842" style="filter: url(&quot;#inner-shadow-filter-0&quot;); stroke-width: 3px; stroke: rgb(67, 127, 22); fill: rgb(188, 216, 190); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.748313, 0.663346, -0.699443, 0.716314, 42.397454, -11.35749)"/>
      <path d="M 131.519 120.914 C 154.973 98.223 178.427 98.223 201.88 120.914 C 225.334 143.605 213.607 145.372 166.7 145.372 C 119.792 145.372 108.065 143.605 131.519 120.914 Z" style="filter: url(&quot;#inner-shadow-filter-0&quot;); stroke-width: 3px; stroke: rgb(67, 127, 22); paint-order: fill; fill: rgb(101, 216, 197); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000012, -0.000002)"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-12" begin="0s" dur="5.28s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <rect x="-142.59" y="-48.626" width="173.502" height="186.266" style="filter: url(&quot;#inner-shadow-filter-0&quot;); stroke-width: 3px; stroke: rgb(67, 127, 22); fill: rgb(188, 216, 190); transform-origin: -55.844px 44.507px;" transform="matrix(-0.748313, 0.663346, 0.699443, 0.716314, 301.534698, 313.806433)"/>
    <rect x="-71.26" y="-15.521" width="86.706" height="59.454" style="filter: url(&quot;#inner-shadow-filter-0&quot;); stroke-width: 3px; stroke: rgb(67, 127, 22); fill: rgb(188, 216, 190); transform-origin: -27.908px 14.206px;" transform="matrix(-0.748313, 0.663346, 0.699443, 0.716314, 211.265433, 285.64984)"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10" begin="0s" dur="5.31s" fill="freeze" keyTimes="0; 1" calcMode="spline" keySplines="0.11 0.84 0.83 0.25" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_5 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="200" width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com" style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 11 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="11"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="inner-shadow-filter-1" bx:preset="inner-shadow 1 0 0 10 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g>
    <path style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 127, 127);" d="M 154.451 243.913 L 299.304 243.913 C 337.24 453.668 140.717 643.914 154.451 243.913 Z"/>
    <rect x="128.33" y="72.881" width="203.032" height="174.534" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 127, 127);"/>
    <rect x="197.194" y="310.402" width="59.366" height="56.991" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 23, 23); filter: url(&quot;#inner-shadow-filter-1&quot;);"/>
    <rect x="193.667" y="207.013" width="67.961" height="40.202" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 23, 23); filter: url(&quot;#inner-shadow-filter-1&quot;);"/>
    <path d="M 249.187 340.161 C 245.071 346.739 248.021 322.197 244.431 321.917 C 240.841 321.637 221.012 314.787 240.376 312.943 C 259.74 311.099 253.303 333.583 249.187 340.161 Z" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 179, 179); transform-origin: 237.621px 325.728px;"/>
    <ellipse style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 179, 179);" cx="215.305" cy="343.934" rx="6.12" ry="5.743"/>
    <ellipse style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(54, 45, 45);" cx="212.332" cy="224.286" rx="3.35" ry="11.486"/>
    <ellipse style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(54, 45, 45);" cx="246.916" cy="224.349" rx="4.307" ry="11.008"/>
    <g>
      <path d="M 177.54 -157.757 Q 193.151 -187.23 208.762 -157.757 L 208.762 -157.757 Q 224.373 -128.284 193.151 -128.284 L 193.151 -128.284 Q 161.929 -128.284 177.54 -157.757 Z" bx:shape="triangle 161.929 -187.23 62.444 58.946 0.5 0.5 1@afbfc7b2" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 23, 23);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 196.023 -140.778 Q 201.643 -149.27 207.263 -140.778 L 207.263 -140.778 Q 212.883 -132.285 201.643 -132.285 L 201.643 -132.285 Q 190.403 -132.285 196.023 -140.778 Z" bx:shape="triangle 190.403 -149.27 22.48 16.985 0.5 0.5 1@484f22e2" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 74, 74);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    </g>
    <g transform="matrix(1, 0, 0, 1, 66.939493, 0.499545)">
      <path d="M 177.54 -157.757 Q 193.151 -187.23 208.762 -157.757 L 208.762 -157.757 Q 224.373 -128.284 193.151 -128.284 L 193.151 -128.284 Q 161.929 -128.284 177.54 -157.757 Z" bx:shape="triangle 161.929 -187.23 62.444 58.946 0.5 0.5 1@afbfc7b2" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 23, 23);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 196.023 -140.778 Q 201.643 -149.27 207.263 -140.778 L 207.263 -140.778 Q 212.883 -132.285 201.643 -132.285 L 201.643 -132.285 Q 190.403 -132.285 196.023 -140.778 Z" bx:shape="triangle 190.403 -149.27 22.48 16.985 0.5 0.5 1@484f22e2" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(111, 80, 80);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    </g>
    <path d="M 155.41 24.233 Q 157.184 20.58 158.958 24.233 L 180.747 69.115 Q 182.521 72.768 178.974 72.768 L 135.394 72.768 Q 131.847 72.768 133.621 69.115 Z" bx:shape="triangle 131.847 20.58 50.674 52.188 0.5 0.07 1@b32e368e" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 127, 127);"/>
    <path d="M 294.284 24.233 Q 296.058 20.58 297.832 24.233 L 319.621 69.115 Q 321.395 72.768 317.848 72.768 L 274.268 72.768 Q 270.721 72.768 272.495 69.115 Z" bx:shape="triangle 270.721 20.58 50.674 52.188 0.5 0.07 1@8e839491" style="stroke: rgb(90, 0, 0); stroke-width: 3px; fill: rgb(216, 127, 127);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;30 0" begin="0.06s" dur="9.3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10" begin="-0.93s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const HEXAGON_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg  height="700" xmlns="http://www.w3.org/2000/svg" viewBox="15.108 0 484.892 607.377" width="700" xmlns:bx="https://boxy-svg.com">
  <g style="">
    <g transform="matrix(1.579664, 0, 0, 1.894767, 27.836423, -26.943587)" style="">
      <g transform="rotate(0)">
        <g transform="scale(1 1)">
          <g transform="translate(0 0)">
            <g fill="#ffffff" fill-opacity="1" id="Stroke_1621dde92081436eaad105ac9bbdd3c0" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
              <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="stroke:none;"/>
              <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
          </g>
        </g>
      </g>
      <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
    </g>
    <g transform="matrix(1.579664, 0, 0, 1.894767, 27.836423, -26.943587)" style="">
      <g transform="rotate(0)">
        <g transform="scale(1 1)">
          <g transform="translate(0 0)">
            <g fill="#ffffff" fill-opacity="1" id="Stroke_4d999fc5476b486eacb44fb99a752478" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
              <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke:none;"/>
              <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
          </g>
        </g>
      </g>
      <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
    </g>
  </g>
  <g>
    <path d="M 229.042 412.165 L 305.306 412.165 L 381.57 562.292 L 146.543 557.976 L 229.042 412.165 Z" style="stroke-width: 3px; fill: rgb(255, 47, 47); stroke: rgb(113, 6, 6);"/>
    <path d="M 558.889 268.77 L 607.465 306.607 L 607.465 382.281 L 558.889 420.118 L 510.313 382.281 L 510.313 306.607 Z" bx:shape="n-gon 558.889 344.444 56.091 75.674 6 0 1@3a289cbf" style="stroke-width: 3px; fill: rgb(255, 47, 47); stroke: rgb(113, 6, 6); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-0.000947, 1, -1, -0.000947, -291.270454, 19.835772)"/>
    <path d="M 265.015 429.262 C 265.015 432.723 262.442 435.695 258.767 436.979 C 258.776 437.203 258.78 437.428 258.78 437.655 C 258.78 446.397 252.445 453.483 244.63 453.483 C 236.815 453.483 230.48 446.397 230.48 437.655 C 230.48 435.662 230.809 433.755 231.41 431.999 L 171.005 379.619 L 185.521 362.879 L 252.598 421.043 C 253.278 420.928 253.982 420.868 254.703 420.868 C 260.398 420.868 265.015 424.626 265.015 429.262 Z" style="stroke-width: 3px; fill: rgb(255, 240, 223); stroke: rgb(113, 6, 6);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 75, 75); stroke: rgb(113, 6, 6);" cx="180.938" cy="368.424" rx="19.155" ry="17.806"/>
    <path d="M 359.505 386.357 C 359.505 382.896 356.932 379.924 353.257 378.64 C 353.266 378.416 353.27 378.191 353.27 377.964 C 353.27 369.222 346.935 362.136 339.12 362.136 C 331.305 362.136 324.97 369.222 324.97 377.964 C 324.97 379.957 325.299 381.864 325.9 383.62 L 265.495 436 L 280.011 452.74 L 347.088 394.576 C 347.768 394.691 348.472 394.751 349.193 394.751 C 354.888 394.751 359.505 390.993 359.505 386.357 Z" style="stroke-width: 3px; fill: rgb(255, 240, 223); stroke: rgb(113, 6, 6); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000015, -0.000032)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 75, 75); stroke: rgb(113, 6, 6);" cx="353.876" cy="366.266" rx="18.886" ry="16.727"/>
    <path style="fill: rgba(216, 216, 216, 0); stroke-width: 3px; stroke: rgb(113, 6, 6);" d="M 225.849 321.714 C 244.699 311.212 274.958 366.694 270.13 375.533 C 270.679 356.269 292.931 312.428 311.131 325.699"/>
    <ellipse style="stroke-width: 3px; fill: rgb(244, 226, 0); stroke: rgb(113, 6, 6);" cx="269.597" cy="340.775" rx="7.199" ry="6.83"/>
    <path d="M 333.605 511.43 L 380.13 561.792 L 287.079 561.792 L 287.447 561.394 L 218.49 561.394 L 219.155 560.674 L 146.064 560.674 L 192.59 510.312 L 229.135 549.871 L 265.016 511.032 L 299.494 548.353 L 333.605 511.43 Z" style="stroke-width: 3px; fill: rgb(255, 149, 149); stroke: rgb(113, 6, 6); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999926, 0.012141, -0.012141, 0.999926, 0, 0)"/>
    <animateMotion path="M 0 0 L -0.922 16.787 L -0.419 -0.652" calcMode="linear" begin="0s" dur="3s" fill="freeze" keyTimes="0; 0.425727; 1" keyPoints="0; 0.425727; 1" repeatCount="indefinite"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, -1, 0)">
    <path d="M 257.351 113.454 C 294.535 143.721 286.007 223.616 258.543 246.503 C 231.078 269.389 77.998 351.224 87.05 339.32 C 92.817 331.736 112.133 177.68 123.883 136.898 C 135.633 96.117 220.168 83.19 257.351 113.454 Z" style="stroke-width: 3px; stroke: rgb(113, 6, 6); fill: rgb(255, 26, 26); transform-origin: 170.96px 215.66px;" transform="matrix(0.999859, 0.016815, -0.016815, 0.999859, 0, 0)"/>
    <path d="M 453.793 329.374 C 490.977 299.107 482.449 219.212 454.985 196.325 C 427.52 173.439 274.44 91.604 283.492 103.508 C 289.259 111.092 308.575 265.148 320.325 305.93 C 332.075 346.711 416.61 359.638 453.793 329.374 Z" style="stroke-width: 3px; stroke: rgb(113, 6, 6); fill: rgb(255, 26, 26); transform-origin: 367.402px 227.168px;" transform="matrix(-0.999859, 0.016815, -0.016815, -0.999859, -0.000069, 0.000015)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 240, 223); stroke: rgb(113, 6, 6);" cx="272.328" cy="238.394" rx="96.099" ry="86.543"/>
    <path d="M 253.41 195.871 C 219.329 213.067 96.21 224.326 112.025 212.031 C 127.84 199.736 167.873 115.935 192.776 94.298 C 214.041 75.822 246.953 83.073 267.168 95.982 C 287.432 82.027 329.28 67.783 343.281 93.156 C 363.7 130.162 426.754 207.435 425.111 213.587 C 423.468 219.739 316.728 211.925 282.647 194.729 C 277.544 192.154 272.89 189.142 268.721 185.788 C 264.206 189.603 259.086 193.007 253.41 195.871 Z" style="stroke-width: 3px; stroke: rgb(113, 6, 6); fill: rgb(255, 26, 26);"/>
    <path d="M 225.149 -245.659 Q 243.032 -273.87 260.914 -245.659 L 260.914 -245.659 Q 278.796 -217.448 243.032 -217.448 L 243.032 -217.448 Q 207.267 -217.448 225.149 -245.659 Z" bx:shape="triangle 207.267 -273.87 71.529 56.422 0.5 0.5 1@c4aab48d" style="stroke-width: 3px; stroke: rgb(0, 0, 0);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(0, 0, 0);" cx="234.022" cy="231.651" rx="7.917" ry="10.647"/>
    <path d="M 284.119 -244.989 Q 302.002 -273.2 319.884 -244.989 L 319.884 -244.989 Q 337.766 -216.778 302.002 -216.778 L 302.002 -216.778 Q 266.237 -216.778 284.119 -244.989 Z" bx:shape="triangle 266.237 -273.2 71.529 56.422 0.5 0.5 1@50afb6eb" style="stroke-width: 3px; stroke: rgb(0, 0, 0);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(0, 0, 0);" cx="292.992" cy="230.974" rx="7.917" ry="10.647"/>
    <path d="M 291.082 281.5 C 291.082 286.042 281.815 294.169 270.809 294.169 C 259.802 294.169 251.223 286.042 251.223 281.5 C 251.223 276.958 260.489 283.056 271.496 283.056 C 282.503 283.056 291.082 276.958 291.082 281.5 Z" style="stroke-width: 3px; stroke: rgb(0, 0, 0);"/>
    <animateMotion path="M 0 0 L 0.91 17.861 L 1.01 0.028" calcMode="linear" begin="0s" dur="3s" fill="freeze" keyTimes="0; 0.486342; 1" keyPoints="0; 0.486342; 1" repeatCount="indefinite"/>
  </g>
</svg>`; // Final NPC for this level

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    // Multiplicación/Repetición de personajes para llenar 7 fases (0-6)
    const NPC_DATA = {
        0: [
            { char_id: 'CHAR_1_BigBot', name: 'Big Bot', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Big Bot: ACCESS DENIED. INITIATE DEFENSE PROTOCOL.", "Big Bot: All intruders must be contained and dismantled."] },
            { char_id: 'CHAR_2_Guardian', name: 'Guardian', svg_content: CHAR_SVG_2, initial_x: 550, dialogue: ["Guardian: Sector 1 is secured. Proceed only if authorized.", "Guardian: The Castle's defenses are layered and complex."] }
        ],
        1: [
            { char_id: 'CHAR_3_SawMan', name: 'Saw Man', svg_content: CHAR_SVG_3, initial_x: 400, dialogue: ["Saw Man: *Whirring saw sounds*. Unauthorized presence detected.", "Saw Man: I am programmed for demolition. Prepare to be optimized."] },
            { char_id: 'CHAR_4_TeleBot', name: 'TeleBot', svg_content: CHAR_SVG_4, initial_x: 600, dialogue: ["TeleBot: Beep-boop. Spatial coordinates scrambled. You are lost.", "TeleBot: Escape velocity calculated at 0.0% probability."] }
        ],
        2: [
            { char_id: 'CHAR_5_Vigilant', name: 'Vigilant Bot', svg_content: CHAR_SVG_5, initial_x: 250, dialogue: ["Vigilant Bot: Scanning area. Energy signature matches a low-threat organic.", "Vigilant Bot: Remain still. Resistance is mechanically illogical."] }
        ],
        3: [
            { char_id: 'CHAR_2_Guardian_R2', name: 'Guardian', svg_content: CHAR_SVG_2, initial_x: 500, dialogue: ["Guardian: Alert! Reinforcements deployed. You cannot bypass this sector.", "Guardian: We protect the Hexagon Core!"] },
            { char_id: 'CHAR_1_BigBot_R2', name: 'Big Bot', svg_content: CHAR_SVG_1, initial_x: 150, dialogue: ["Big Bot: ERROR. TARGET ACQUISITION LOST. RECALIBRATING.", "Big Bot: The Castle's security cannot fail. Resistance is futile."] }
        ],
        4: [
            { char_id: 'CHAR_4_TeleBot_R2', name: 'TeleBot', svg_content: CHAR_SVG_4, initial_x: 350, dialogue: ["TeleBot: Warning: Security level elevated to critical.", "TeleBot: The next passage leads directly to the core chamber."] },
            { char_id: 'CHAR_3_SawMan_R2', name: 'Saw Man', svg_content: CHAR_SVG_3, initial_x: 650, dialogue: ["Saw Man: *Loud grating noise*. Final warning. Turn back now.", "Saw Man: My final maintenance check indicates... I must stop you."] }
        ],
        5: [
            { char_id: 'CHAR_5_Vigilant_R2', name: 'Vigilant Bot', svg_content: CHAR_SVG_5, initial_x: 450, dialogue: ["Vigilant Bot: Only one checkpoint remains. You are almost at the Hexagon.", "Vigilant Bot: Proceed with caution. The final defense is autonomous."] }
        ],
        6: [
            { char_id: 'CHAR_2_Guardian_R3', name: 'Guardian', svg_content: CHAR_SVG_2, initial_x: 200, dialogue: ["Guardian: Final defense layer breached. Only the Hexagon Fairy remains.", "Guardian: Farewell, intruder. I must now self-destruct."] },
            { char_id: 'CHAR_5_Vigilant_R3', name: 'Vigilant Bot', svg_content: CHAR_SVG_5, initial_x: 600, dialogue: ["Vigilant Bot: Scanning... You are... inevitable.", "Vigilant Bot: The Castle Lands are yours."] }
        ],
        7: { char_id: 'HEXAGON_FAIRY', name: 'Hexagon Fairy', svg_content: HEXAGON_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Hexagon Fairy: You have surpassed the final robotic defenses.", "Hexagon Fairy: The Castle Lands accept your dominance over the machine.", "Hexagon Fairy: Castle Lands victory! Your adventure in Drawaria is complete!"] },
    };

    const MAX_TRANSITIONS = 7; // 7 transitions (Map 1 -> 2 -> ... -> 8). Total 8 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Castle Sky Gradient (Overcast Gray/Futuristic Dusk) -->
    <linearGradient id="castleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Castle Stone/Wall Gradient (Weathered Gray) -->
    <linearGradient id="stoneWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Battlements/Platform -->
    <linearGradient id="battlementPlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 80, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(110, 110, 110);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Overcast Gray) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#castleSkyGradient)" />

  <!-- 2. Distant Castle Walls/Towers (Main Background) -->
  <g fill="url(#stoneWallGradient)" stroke="rgb(70, 70, 70)" stroke-width="1" opacity="0.8">
    <!-- Main Wall -->
    <rect x="100" y="200" width="600" height="200" />
    <!-- Tower 1 (Left) -->
    <rect x="100" y="100" width="80" height="100" />
    <!-- Tower 2 (Right) -->
    <rect x="620" y="150" width="80" height="50" />
    <!-- Battlements Detail -->
    <rect x="100" y="200" width="600" height="20" fill="rgb(150, 150, 150)" />
  </g>

  <!-- 3. Foreground Wall/Platform (The player's immediate area) -->
  <rect x="0" y="400" width="800" height="50" fill="url(#battlementPlatformGradient)" />
  <rect x="0" y="450" width="800" height="50" fill="rgb(90, 90, 90)" />

  <!-- 4. Foreground Battlements (Simulating the top edge from the reference image) -->
  <g fill="rgb(70, 70, 70)">
    <rect x="50" y="400" width="20" height="50" />
    <rect x="100" y="400" width="20" height="50" />
    <rect x="700" y="400" width="20" height="50" />
    <rect x="750" y="400" width="20" height="50" />
  </g>

  <!-- 5. Windows/Openings (Small dark details) -->
  <g fill="rgb(50, 50, 50)" opacity="0.7">
    <rect x="120" y="250" width="30" height="40" />
    <rect x="650" y="280" width="20" height="30" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Castle Sky Gradient (Consistent) -->
    <linearGradient id="castleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Castle Stone/Wall Gradient (Consistent) -->
    <linearGradient id="stoneWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Moat/Energy Field Color -->
    <linearGradient id="moatEnergyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 50, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 20, 50);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Metal Platform -->
    <linearGradient id="metalPlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(130, 130, 140);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#castleSkyGradient)" />

  <!-- 2. Distant Castle Walls (Consistent) -->
  <g fill="url(#stoneWallGradient)" stroke="rgb(70, 70, 70)" stroke-width="1" opacity="0.8">
    <rect x="100" y="200" width="600" height="200" />
    <rect x="100" y="100" width="80" height="100" />
    <rect x="620" y="150" width="80" height="50" />
    <rect x="100" y="200" width="600" height="20" fill="rgb(150, 150, 150)" />
  </g>

  <!-- 3. Bridge/Moat Opening -->
  <rect x="300" y="450" width="200" height="50" fill="url(#moatEnergyGradient)" />
  <rect x="300" y="400" width="200" height="50" fill="url(#moatEnergyGradient)" />

  <!-- 4. Foreground Platform (Divided by the moat) -->
  <rect x="0" y="450" width="300" height="50" fill="url(#metalPlatformGradient)" />
  <rect x="500" y="450" width="300" height="50" fill="url(#metalPlatformGradient)" />

  <!-- 5. Moat Energy Glow -->
  <rect x="300" y="440" width="200" height="10" fill="rgb(0, 200, 255)" opacity="0.5" />

  <!-- 6. Chains/Suspension Wires (Visual detail for the bridge opening) -->
  <g stroke="rgb(100, 100, 100)" stroke-width="3" opacity="0.7" fill="none">
    <line x1="320" y1="400" x2="350" y2="200" />
    <line x1="480" y1="400" x2="450" y2="200" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Castle Sky Gradient (Consistent) -->
    <linearGradient id="castleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Distant Ground/Shadow (Deep void below the platform) -->
    <stop id="voidShadow" stop-color="rgb(20, 20, 30)" />
    <!-- Foreground Grate/Metal Platform Gradient -->
    <linearGradient id="gratePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(170, 170, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 190, 200);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#castleSkyGradient)" />

  <!-- 2. Distant Castle Walls (Far below and in the distance) -->
  <rect x="50" y="400" width="700" height="100" fill="rgb(100, 100, 100)" opacity="0.6"/>

  <!-- 3. Deep Void/Drop-off (Implied endless drop below the player) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#voidShadow)" />

  <!-- 4. Foreground Platform (Elevated Metallic Grate/Walkway) -->
  <rect x="0" y="400" width="800" height="50" fill="url(#gratePlatformGradient)" />

  <!-- 5. Grate Texture (Dark lines on the floor) -->
  <g stroke="rgb(130, 130, 140)" stroke-width="2" opacity="0.8">
    <line x1="0" y1="410" x2="800" y2="410" />
    <line x1="0" y1="430" x2="800" y2="430" />
    <line x1="50" y1="400" x2="50" y2="450" />
    <line x1="150" y1="400" x2="150" y2="450" />
    <line x1="750" y1="400" x2="750" y2="450" />
  </g>

  <!-- 6. Support Beams/Columns (Extending into the void) -->
  <g fill="rgb(110, 110, 120)">
    <rect x="100" y="450" width="20" height="50" />
    <rect x="700" y="450" width="20" height="50" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 (Now the bottom of the visible platform) -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Chamber Gradient (Muted, industrial gray) -->
    <linearGradient id="chamberSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 110);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 140);stop-opacity:1" />
    </linearGradient>
    <!-- Industrial Floor Gradient (Darker metallic platform) -->
    <linearGradient id="industrialFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(60, 60, 70);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 80, 90);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Chamber Interior/Sky (Industrial Gray) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#chamberSkyGradient)" />

  <!-- 2. Gears/Saw Blades (Background detail, rotating effect) -->
  <g transform="translate(150, 300) rotate(0)">
    <circle cx="0" cy="0" r="80" fill="rgb(150, 150, 150)" stroke="rgb(100, 100, 100)" stroke-width="5" />
    <rect x="-10" y="-80" width="20" height="160" fill="rgb(100, 100, 100)" />
    <rect x="-80" y="-10" width="160" height="20" fill="rgb(100, 100, 100)" />
    <!-- Rotation Animation -->
    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
  </g>
  <g transform="translate(650, 200) rotate(0) scale(0.7)">
    <circle cx="0" cy="0" r="70" fill="rgb(180, 180, 180)" stroke="rgb(100, 100, 100)" stroke-width="5" />
    <rect x="-70" y="-10" width="140" height="20" fill="rgb(100, 100, 100)" />
    <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="5s" repeatCount="indefinite" />
  </g>

  <!-- 3. Foreground Platform (Industrial Metal) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#industrialFloorGradient)" />

  <!-- 4. Warning Lights/Energy Beams (Red/Blue details) -->
  <g fill="rgb(255, 0, 0)" opacity="0.6">
    <rect x="0" y="440" width="20" height="10" />
    <rect x="780" y="440" width="20" height="10" />
  </g>

  <!-- 5. Ventilation/Pipework (Top detail) -->
  <rect x="0" y="100" width="800" height="30" fill="rgb(80, 80, 90)" />
  <rect x="50" y="130" width="10" height="20" fill="rgb(150, 150, 160)" />
  <rect x="740" y="130" width="10" height="20" fill="rgb(150, 150, 160)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Chamber Gradient (Soft blue/white futuristic glow) -->
    <linearGradient id="teleportChamberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Data Grid Floor Gradient (Bright, clean metal) -->
    <linearGradient id="dataGridFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(190, 210, 230);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Chamber Interior/Sky (Futuristic Glow) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#teleportChamberGradient)" />

  <!-- 2. Data/Control Panel (Background structure) -->
  <rect x="100" y="150" width="600" height="200" fill="rgb(100, 150, 200)" stroke="rgb(50, 100, 150)" stroke-width="5" />
  <g fill="rgb(0, 255, 255)" opacity="0.6">
    <rect x="150" y="180" width="100" height="140" />
    <rect x="550" y="180" width="100" height="140" />
  </g>

  <!-- 3. Foreground Platform (Data Grid Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#dataGridFloorGradient)" />

  <!-- 4. Grid Lines (Floor detail) -->
  <g stroke="rgb(150, 170, 190)" stroke-width="2" opacity="0.7" fill="none">
    <line x1="0" y1="460" x2="800" y2="460" />
    <line x1="0" y1="480" x2="800" y2="480" />
    <line x1="200" y1="450" x2="200" y2="500" />
    <line x1="600" y1="450" x2="600" y2="500" />
  </g>

  <!-- 5. Teleport Pad/Zone (Center floor glow) -->
  <ellipse cx="400" cy="460" rx="100" ry="20" fill="rgb(0, 255, 255)" opacity="0.4" />

  <!-- 6. Overhead Lights (Ceiling detail) -->
  <g fill="rgb(0, 200, 200)" opacity="0.8">
    <rect x="10" y="10" width="50" height="10" />
    <rect x="740" y="10" width="50" height="10" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Castle Sky Gradient (Overcast Gray) -->
    <linearGradient id="castleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Wall/Metal Gradient -->
    <linearGradient id="metalWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Distant Castle Stone -->
    <linearGradient id="distantCastleStone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 120, 130);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(140, 140, 150);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#castleSkyGradient)" />

  <!-- 2. Distant Castle Walls/Grounds (Simplified view) -->
  <rect x="0" y="300" width="800" height="150" fill="rgb(100, 100, 100)" opacity="0.6"/>

  <!-- 3. Grand Surveillance Tower (Right Background) -->
  <g transform="translate(650, 450)">
    <!-- Tower Base -->
    <rect x="-70" y="-300" width="140" height="300" fill="url(#distantCastleStone)" stroke="rgb(80, 80, 80)" stroke-width="2" />
    <!-- Turret Top -->
    <rect x="-70" y="-300" width="140" height="20" fill="rgb(80, 80, 80)" />
    <!-- Surveillance Pod (Blue/Cyan Light) -->
    <circle cx="0" cy="-250" r="40" fill="rgb(0, 200, 255)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- 4. Foreground Platform (Wall Exterior) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#metalWallGradient)" />

  <!-- 5. Railings/Grate Texture (Metal details on the platform) -->
  <g stroke="rgb(60, 60, 60)" stroke-width="3" fill="none">
    <line x1="0" y1="450" x2="800" y2="450" />
    <line x1="0" y1="450" x2="0" y2="400" />
    <line x1="800" y1="450" x2="800" y2="400" />
  </g>

  <!-- 6. Searchlight/Laser Effect (Coming from the tower) -->
  <path d="M650 150 L300 450 L350 450 Z" fill="rgb(255, 255, 0)" opacity="0.15" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Interior Hall Gradient (Rich, dark metallic) -->
    <linearGradient id="hallInteriorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(50, 50, 70);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(70, 70, 90);stop-opacity:1" />
    </linearGradient>
    <!-- Polished Floor Gradient (Reflective Black/Dark Gray) -->
    <linearGradient id="polishedFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(40, 40, 50);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(60, 60, 70);stop-opacity:1" />
    </linearGradient>
    <!-- Pedestal Stone/Metal -->
    <stop id="pedestalMetal" stop-color="rgb(130, 130, 150)" />
  </defs>

  <!-- 1. Interior Hall Walls/Ceiling -->
  <rect x="0" y="0" width="800" height="500" fill="url(#hallInteriorGradient)" />

  <!-- 2. Display Niches/Recesses (Background detail) -->
  <g fill="rgb(30, 30, 40)" opacity="0.9">
    <rect x="150" y="100" width="150" height="300" rx="10" ry="10" />
    <rect x="500" y="100" width="150" height="300" rx="10" ry="10" />
  </g>

  <!-- 3. Foreground Platform (Polished Floor) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#polishedFloorGradient)" />

  <!-- 4. Pedestals/Display Bases (Obstacles/NPC spots) -->
  <g fill="url(#pedestalMetal)" stroke="rgb(90, 90, 100)" stroke-width="2">
    <rect x="50" y="400" width="100" height="50" />
    <rect x="650" y="400" width="100" height="50" />
  </g>

  <!-- 5. Weapon Display Silhouettes (Small detail inside the niches) -->
  <g fill="rgb(180, 180, 180)" opacity="0.6">
    <rect x="200" y="250" width="10" height="50" transform="rotate(15 205 275)" />
    <rect x="590" y="200" width="10" height="70" transform="rotate(-10 595 235)" />
  </g>

  <!-- 6. Floor Reflection (Subtle white line on the polished floor) -->
  <path d="M0 450 Q400 448, 800 450" stroke="white" stroke-width="1" opacity="0.2" fill="none" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_8 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Castle Sky Gradient (Overcast Gray/Futuristic Dusk) -->
    <linearGradient id="castleSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 180, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Castle Stone/Wall Gradient (Weathered Gray) -->
    <linearGradient id="stoneWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Battlements/Platform -->
    <linearGradient id="battlementPlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 80, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(110, 110, 110);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Overcast Gray) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#castleSkyGradient)" />

  <!-- 2. Distant Castle Walls/Towers (Main Background) -->
  <g fill="url(#stoneWallGradient)" stroke="rgb(70, 70, 70)" stroke-width="1" opacity="0.8">
    <!-- Main Wall -->
    <rect x="100" y="200" width="600" height="200" />
    <!-- Tower 1 (Left) -->
    <rect x="100" y="100" width="80" height="100" />
    <!-- Tower 2 (Right) -->
    <rect x="620" y="150" width="80" height="50" />
    <!-- Battlements Detail -->
    <rect x="100" y="200" width="600" height="20" fill="rgb(150, 150, 150)" />
  </g>

  <!-- 3. Foreground Wall/Platform (The player's immediate area) -->
  <rect x="0" y="400" width="800" height="50" fill="url(#battlementPlatformGradient)" />
  <rect x="0" y="450" width="800" height="50" fill="rgb(90, 90, 90)" />

  <!-- 4. Foreground Battlements (Simulating the top edge from the reference image) -->
  <g fill="rgb(70, 70, 70)">
    <rect x="50" y="400" width="20" height="50" />
    <rect x="100" y="400" width="20" height="50" />
    <rect x="700" y="400" width="20" height="50" />
    <rect x="750" y="400" width="20" height="50" />
  </g>

  <!-- 5. Windows/Openings (Small dark details) -->
  <g fill="rgb(50, 50, 50)" opacity="0.7">
    <rect x="120" y="250" width="30" height="40" />
    <rect x="650" y="280" width="20" height="30" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3, MAP_SVG_4, MAP_SVG_5, MAP_SVG_6, MAP_SVG_7, MAP_SVG_8];

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
            background-color: #7f8c8d; /* Metal/Robot Gray */
            color: white;
            border: 2px solid #ecf0f1; /* White/Clean Border */
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(236, 240, 241, 0.7);
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

    // --- FUNCIÓN CORREGIDA (de la solicitud anterior) ---
    function injectNPCs() {
        removeAllNPCs();

        const currentNPCData = NPC_DATA[currentMapIndex];
        if (!currentNPCData) return;

        // Asegura que currentNPCData sea un array para la iteración
        const npcs = Array.isArray(currentNPCData) ? currentNPCData : [currentNPCData];

        npcs.forEach(npcData => {
            const isFinalNPC = npcData.final_npc;
            // La escala para el tamaño solo se aplica al NPC final (Fairy),
            // para los demás, se usa el tamaño por defecto.
            const size = NPC_WIDTH_DEFAULT;
            const x = npcData.initial_x || npcData.x;
            const y = npcData.initial_y || npcData.y || AVATAR_GROUND_Y;

            // Container for the clickable area
            const clickArea = document.createElement('div');
            clickArea.id = `${npcData.char_id}-clickarea`;
            clickArea.className = 'npc-clickarea';

            // Calculate scale and position for the generic container
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

            // SVG Container for the graphic
            const svgContainer = document.createElement('div');
            svgContainer.id = npcData.char_id;
            svgContainer.innerHTML = npcData.svg_content;

            // Adjust SVG display within the container (important for the fairy's scaling)
            // La escala de la hada se aplica al contenedor SVG interno para mantener el área de clic
            // con el tamaño por defecto si fuera necesario.
            svgContainer.style.cssText = `
                width: 100%;
                height: 100%;
                ${isFinalNPC && npcData.scale ? `transform: scale(${npcData.scale}); transform-origin: top left;` : ''}
            `;

            // *** FIX 1: Añadir el SVG al área de clic ***
            clickArea.appendChild(svgContainer);

            clickArea.addEventListener('click', () => startDialogue(npcData));

            // *** FIX 2: Añadir el área de clic al document.body ***
            document.body.appendChild(clickArea);
        });
    }
    // --- FIN DE LA FUNCIÓN CORREGIDA ---


    // --- 5. NPC AND DIALOGUE LOGIC ---

    function createDialogueBox() {
        const box = document.createElement('div');
        box.id = DIALOGUE_BOX_ID;

        dialogueName = document.createElement('div');
        dialogueName.style.cssText = `
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
            color: white;
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

        // Custom style for the Castle Lands dialogue box (metallic/futuristic theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(44, 62, 80, 0.9); /* Dark Blue/Metal */
            border: 5px solid #bdc3c7; /* Polished Silver Border */
            box-shadow: 0 0 20px rgba(189, 195, 199, 0.7);
            border-radius: 10px;
            font-family: 'Courier New', monospace;
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

        // Final Level Completion Check (Hexagon Fairy is only NPC in phase 7)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:#bdc3c7; font-size:36px; text-align:center; font-family: 'Courier New', monospace; text-shadow: 0 0 10px #bdc3c7;">
                    LEVEL COMPLETE!<br>The Castle Lands are under your command.
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
        button.textContent = "BACK TO LEVELS";
        button.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background-color: #34495e;
            color: white;
            border: 4px solid #bdc3c7;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(189, 195, 199, 0.7);
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

        // Standard Platformer Physics (Robotic Precision)
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
                 // Final transition to the last map (MAP_SVG_8)
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