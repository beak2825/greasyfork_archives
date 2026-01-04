// ==UserScript==
// @name         Drawaria Game Level 4 - Sunny Beach
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 4: Sunny Beach. Enjoy the sun and waves as you meet characters on your journey across the sand.
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

    const LEVEL_TITLE = "Sunny Beach";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-beach.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    // Y position where the bottom of the avatar rests (simulating the ground on the SVG sand)
    const AVATAR_HEIGHT_PX = 64;
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX;

    const LEVEL_END_X = VIEWBOX_WIDTH + 220; // Trigger for advancing the level
    const LEVEL_START_X = 50; // Starting X coordinate

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const NPC_WIDTH_DEFAULT = 100; // Default size for simpler NPC collision

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // Character SVG Placeholders (Movable NPCs)
    const CHAR_SVG_1 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="250.801" y1="30.325" x2="250.801" y2="463.551" id="gradient-3" gradientTransform="matrix(-0.999892, -0.014703, 0.004807, -0.326924, 483.725308, 241.794082)">
      <stop offset="0" style="stop-color: rgb(100% 93.333% 34.118%)"/>
      <stop offset="1" style="stop-color: rgb(57.183% 53.469% 0%)"/>
    </linearGradient>
  </defs>
  <ellipse style="stroke-width: 3px; stroke: rgb(105, 119, 35); fill: url(&quot;#gradient-3&quot;);" cx="250.801" cy="246.938" rx="173.395" ry="216.613"/>
  <path style="stroke-width: 3px; stroke: rgb(105, 119, 35); fill: rgba(255, 238, 87, 0.01);" d="M 79.106 214.459 C 105.144 205.78 128.057 183.047 142.604 160.419 C 154.877 141.328 162.41 120.961 176.379 103.001 C 180.378 97.86 183.291 87.983 187.187 84.087 C 187.545 83.729 193.485 85.381 193.942 85.438 C 201.331 86.362 209.453 85.438 216.909 85.438 C 238.534 85.438 261.55 86.047 283.108 84.087 C 288.254 83.62 298.55 78.683 301.347 78.683 C 301.346 82.311 304.5 84.989 306.075 88.14 C 309.237 94.465 311.873 101.479 314.181 108.406 C 323.467 136.263 345.961 159.099 366.871 180.009 C 373.43 186.568 380.309 197.749 387.136 202.3 C 392.04 205.57 395.762 210.796 400.646 214.459 C 404.875 217.631 412.257 220.666 415.507 223.916 C 416.619 225.028 420.755 227.969 422.262 227.969"/>
  <path d="M 253.049 86.79 L 270.205 92.852 L 296.139 87.671 L 303.438 94.232 L 336.521 90.257 L 333.506 96.906 L 371.658 94.388 L 358.518 100.707 L 399.343 99.802 L 376.903 105.394 L 417.836 106.16 L 387.505 110.673 L 425.974 113.063 L 389.66 116.214 L 423.247 120.076 L 383.231 121.667 L 409.826 126.759 L 368.621 126.689 L 386.554 132.692 L 346.75 130.967 L 354.893 137.502 L 318.992 134.23 L 316.833 140.887 L 287.09 136.273 L 274.765 142.635 L 253.049 136.969 L 231.333 142.635 L 219.008 136.273 L 189.265 140.887 L 187.106 134.23 L 151.205 137.502 L 159.348 130.967 L 119.544 132.692 L 137.477 126.689 L 96.272 126.759 L 122.867 121.667 L 82.851 120.076 L 116.438 116.214 L 80.124 113.063 L 118.593 110.673 L 88.262 106.16 L 129.195 105.394 L 106.755 99.802 L 147.58 100.707 L 134.44 94.388 L 172.592 96.906 L 169.577 90.257 L 202.66 94.232 L 209.959 87.671 L 235.893 92.852 Z" bx:shape="star 253.049 114.823 173.267 28.033 0.79 25 1@956b4dc9" style="stroke-width: 3px; stroke: rgb(105, 119, 35); fill: rgb(73, 165, 216);"/>
  <ellipse style="stroke-width: 3px; stroke: rgb(105, 119, 35);" cx="191.915" cy="240.969" rx="20.941" ry="48.636"/>
  <ellipse style="stroke-width: 3px; stroke: rgb(105, 119, 35);" cx="299.997" cy="245.697" rx="20.941" ry="48.636"/>
  <path d="M 309.682 359.213 C 309.682 371.525 288.613 360.564 254.291 360.564 C 219.969 360.564 185.39 371.525 185.39 359.213 C 185.39 346.901 213.214 336.921 247.536 336.921 C 281.858 336.921 309.682 346.901 309.682 359.213 Z" style="stroke-width: 3px; stroke: rgb(105, 119, 35);"/>
  <ellipse style="stroke-width: 3px; stroke: rgb(105, 119, 35);" cx="126.621" cy="297.067" rx="36.477" ry="8.782"/>
  <ellipse style="stroke-width: 3px; stroke: rgb(105, 119, 35);" cx="133.376" cy="328.14" rx="34.451" ry="8.782"/>
  <ellipse style="stroke-width: 3; stroke: rgb(105, 119, 35);" cx="-367.44" cy="307.199" rx="36.477" ry="8.782" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
  <ellipse style="stroke-width: 3; stroke: rgb(105, 119, 35);" cx="-360.68" cy="338.272" rx="34.451" ry="8.782" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
  <path d="M 225.92 189.253 C 222.219 194.91 206.97 191.48 191.861 181.594 C 176.752 171.708 167.503 159.108 171.205 153.451 C 174.906 147.794 176.645 153.925 191.754 163.811 C 206.864 173.698 229.622 183.596 225.92 189.253 Z" style="stroke-width: 3; stroke: rgb(105, 119, 35); transform-origin: 196.268px 174.859px;"/>
  <path d="M 463.627 144.462 C 459.926 138.805 444.677 142.234 429.568 152.12 C 414.459 162.006 405.21 174.607 408.911 180.263 C 412.613 185.92 414.352 179.789 429.461 169.903 C 444.571 160.016 467.329 150.118 463.627 144.462 Z" style="stroke-width: 3; stroke: rgb(105, 119, 35); transform-origin: 363.047px 168.988px;" transform="matrix(-1, 0, 0, -1, 0.000004, -0.000012)"/>
  <path d="M 252.885 395.671 L 279.511 399.47 L 317.996 397.819 L 325.629 402.748 L 365.661 403.688 L 352.255 408.427 L 383.107 411.705 L 352.255 414.983 L 365.661 419.722 L 325.629 420.662 L 317.996 425.591 L 279.511 423.94 L 252.885 427.739 L 226.259 423.94 L 187.774 425.591 L 180.141 420.662 L 140.109 419.722 L 153.515 414.983 L 122.663 411.705 L 153.515 408.427 L 140.109 403.688 L 180.141 402.748 L 187.774 397.819 L 226.259 399.47 Z" bx:shape="star 252.885 411.705 130.222 16.034 0.79 12 1@2ee07150" style="stroke-width: 3px; stroke: rgb(105, 119, 35); fill: rgb(73, 216, 100);"/>
  <path d="M 248.512 437.458 L 265.501 439.76 L 290.057 438.76 L 294.927 441.747 L 320.469 442.317 L 311.916 445.189 L 331.601 447.176 L 311.916 449.163 L 320.469 452.035 L 294.927 452.605 L 290.057 455.592 L 265.501 454.592 L 248.512 456.894 L 231.523 454.592 L 206.967 455.592 L 202.097 452.605 L 176.555 452.035 L 185.108 449.163 L 165.423 447.176 L 185.108 445.189 L 176.555 442.317 L 202.097 441.747 L 206.967 438.76 L 231.523 439.76 Z" bx:shape="star 248.512 447.176 83.089 9.718 0.79 12 1@9629f3f3" style="stroke-width: 3px; stroke: rgb(105, 119, 35); fill: rgb(73, 216, 100);"/>
  <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-4" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 9 0.64 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="9"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1.28"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g style="transform-origin: 264.329px 285.468px;">
    <g style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
      <rect x="249.348" y="324.335" width="24.81" height="118.604" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(81, 216, 52);"/>
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(81, 216, 52);" transform="matrix(0.866432, 0.499295, -0.499295, 0.866432, 279.912419, -47.327284)" cx="190.651" cy="430.836" rx="41.206" ry="17.577"/>
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(81, 216, 52);" transform="matrix(-0.866432, 0.499295, 0.499295, 0.866432, 244.804236, -44.301089)" cx="190.651" cy="430.836" rx="41.206" ry="17.577"/>
      <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 3px;" transform="matrix(0.853506, 0.521083, -0.521083, 0.853506, 253.355361, -59.824956)" cx="229.076" cy="422.97" rx="33.677" ry="1.147"/>
      <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 3px;" transform="matrix(-0.853506, 0.521083, 0.521083, 0.853506, 265.611828, -56.799844)" cx="229.076" cy="422.97" rx="33.677" ry="1.147"/>
      <path d="M 360.229 174.307 L 358.755 299.237 C 356.278 325.544 314.912 346.473 264.245 346.473 C 213.578 346.473 172.212 325.544 169.735 299.237 L 169.06 299.237 C 169.06 299.237 169.157 167.318 169.589 163.856 C 170.909 153.3 170.393 111.817 170.393 111.817 C 170.393 111.817 194.15 147.878 196.613 146.646 C 203.041 143.433 227.314 109.343 230.65 111.011 C 232.511 111.941 257.62 147.797 258.466 148.643 C 258.652 148.829 260.944 147.047 261.268 146.641 C 264.267 142.893 293.554 113.884 298.501 111.411 C 300.83 110.247 320.608 149.932 324.123 153.447 C 324.271 153.596 358.688 111.34 359.358 112.011 C 359.918 112.57 360.109 157.406 360.147 174.307 L 360.229 174.307 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(216, 177, 95);"/>
      <path d="M 210.877 -240.161 Q 231.565 -263.31 252.253 -240.161 L 252.253 -240.161 Q 272.941 -217.012 231.565 -217.012 L 231.565 -217.012 Q 190.189 -217.012 210.877 -240.161 Z" bx:shape="triangle 190.189 -263.31 82.752 46.298 0.5 0.5 1@a17a4789" style="stroke: rgb(0, 0, 0); stroke-width: 3px;" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 286.822 -241.021 Q 307.51 -264.17 328.198 -241.021 L 328.198 -241.021 Q 348.886 -217.872 307.51 -217.872 L 307.51 -217.872 Q 266.134 -217.872 286.822 -241.021 Z" bx:shape="triangle 266.134 -264.17 82.752 46.298 0.5 0.5 1@c3dc6425" style="stroke: rgb(0, 0, 0); stroke-width: 3px;" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <rect x="184.303" y="214.659" width="163.839" height="9.187" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    </g>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.2 1.2" begin="0s" dur="6s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;3" dur="6s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #3f3fff" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#3f3fff" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 0 0 15 1 #2c94b39f" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl" type="linear" slope="2"/>
      </feComponentTransfer>
      <feFlood flood-color="#2c94b39f"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g>
    <ellipse style="stroke-width: 3px; stroke: rgb(0, 0, 0); fill: rgb(85, 201, 216); filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="140.481" cy="144.187" rx="54.454" transform="matrix(0.008771, 0.999962, -0.999962, 0.008771, 283.428834, 2.44871)" ry="50.612"/>
    <path style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" d="M 121.071 156.194 C 128.926 157.504 137.213 157.51 145.185 157.51 C 146.013 157.51 153.596 157.151 154.393 157.948 C 156.122 159.677 151.664 170.322 150.447 171.54 C 147.045 174.942 142.478 175.02 136.855 172.893 C 135.851 172.513 122.06 164.949 122.824 156.633"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.018865, 0.999822, -0.999822, 0.018865, 248.619811, 21.501097)" cx="113.206" cy="132.561" rx="10.22" ry="11.085"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.018865, 0.999822, -0.999822, 0.018865, 289.685364, 24.392857)" cx="113.206" cy="132.561" rx="10.22" ry="11.085"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(0, 0, 0); fill: rgb(85, 201, 216); filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="140.481" cy="144.187" rx="34.645" transform="matrix(0.009669, 0.999953, -0.99997, 0.007956, 401.902393, 66.307587)" ry="35.499"/>
    <path style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" d="M 245.464 215.567 C 250.974 216.401 256.786 216.405 262.378 216.405 C 262.959 216.405 268.277 216.176 268.836 216.683 C 270.049 217.783 266.922 224.556 266.069 225.331 C 263.683 227.495 260.479 227.545 256.535 226.192 C 255.831 225.95 246.158 221.138 246.694 215.847"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.020797, 0.999784, -0.99986, 0.017113, 373.651697, 88.02553)" cx="113.206" cy="132.561" rx="6.502" ry="7.775"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.020797, 0.999784, -0.99986, 0.017113, 402.455012, 89.865374)" cx="113.206" cy="132.561" rx="6.502" ry="7.775"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(0, 0, 0); fill: rgb(85, 201, 216); filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="140.481" cy="144.187" rx="26.941" transform="matrix(0.009354, 0.999956, -0.999967, 0.008224, 306.256819, 135.608048)" ry="26.706"/>
    <path style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" d="M 153.147 283.209 C 157.292 283.857 161.664 283.86 165.871 283.86 C 166.308 283.86 170.309 283.682 170.729 284.076 C 171.642 284.932 169.29 290.199 168.648 290.802 C 166.853 292.484 164.442 292.523 161.475 291.471 C 160.946 291.283 153.669 287.541 154.072 283.426"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.02012, 0.999798, -0.999846, 0.017689, 281.904889, 158.277563)" cx="113.206" cy="132.561" rx="5.056" ry="5.849"/>
    <ellipse style="stroke-width: 3px; fill: rgb(216, 216, 216); stroke: rgb(26, 59, 254);" transform="matrix(0.02012, 0.999798, -0.999846, 0.017689, 303.573835, 159.708318)" cx="113.206" cy="132.561" rx="5.056" ry="5.849"/>
    <animateMotion path="M 0 0 L 1 -78" calcMode="linear" begin="0s" dur="10s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_4 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
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
  <g style="transform-origin: 237.837px 230.41px; filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <path d="M 857.222 413.889 Q 857.222 409.299 861.401 406.651 Q 865.863 403.823 871.697 405.532 Q 878.182 407.431 882.294 413.889 Q 886.913 421.145 886.172 430.603 Q 885.344 441.179 878.115 450.076 Q 870.109 459.93 857.222 464.032 Q 843.093 468.529 827.972 464.551 Q 811.544 460.23 799.322 447.317 Q 786.148 433.4 782.008 413.889 Q 777.575 393 784.847 372.103 Q 792.588 349.859 811.258 334.276 Q 831.033 317.771 857.222 313.603 Q 884.843 309.207 911.544 319.801 Q 939.599 330.933 958.547 355.389 Q 978.392 381.002 982.579 413.889 Q 986.952 448.234 973.022 480.746 Q 958.512 514.613 928.258 536.926 Q 896.815 560.117 857.222 564.317 Q 816.157 568.675 777.829 551.401 Q 738.149 533.519 712.472 497.46 Q 685.933 460.192 681.722 413.889 Q 677.376 366.104 697.997 321.96 Q 719.248 276.467 761.115 247.426 Q 775.047 237.763 790.528 230.649" bx:shape="spiral 857.222 413.889 0 195 0 700 1@093acc45" style="stroke: rgb(10, 108, 129); fill: rgb(182, 235, 255); stroke-width: 3.20079px; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.224391, -0.910011, -0.910014, -0.22439, -594.457616, -167.511897)">
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1; 1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
    </path>
    <rect style="fill: rgb(216, 216, 216); stroke: rgb(10, 108, 129); stroke-width: 3px; fill-opacity: 0;" height="0.005" transform="matrix(0.841401, 0.540411, 0.540411, -0.841401, 553.539093, 417.755418)" x="-300.17" y="-0.452" width="94.1"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;20" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
  <g style="transform-origin: 213.268px 159.79px;">
    <path d="M 197.716 175.813 C 186.971 175.387 138.968 180.541 131.232 175.813 C 123.496 171.085 146.115 140.87 164.474 140.87 C 182.833 140.87 208.461 176.239 197.716 175.813 Z" style="stroke: rgb(0, 0, 0);"/>
    <path d="M 294.32 143.768 C 283.575 144.194 235.572 139.04 227.836 143.768 C 220.1 148.496 242.719 178.711 261.078 178.711 C 279.437 178.711 305.065 143.342 294.32 143.768 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000054, 0.000003)"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;10 -30" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_5 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="258.407" y1="78.818" x2="258.407" y2="437.426" id="gradient-1">
      <stop offset="0" style="stop-color: rgb(100% 96.078% 47.451%)"/>
      <stop offset="1" style="stop-color: rgb(56.907% 55.075% 1.2779%)"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 412.549 141.323 C 412.542 143.164 412.337 144.986 411.939 146.783 L 412.428 146.783 L 412.428 437.426 L 105.212 437.426 L 105.212 147.333 C 104.578 145.031 104.256 142.693 104.265 140.324 C 104.393 106.081 173.507 78.545 258.638 78.82 C 343.768 79.096 412.677 107.079 412.549 141.323 Z" style="stroke-width: 3px; stroke: rgb(98, 97, 29); fill: url(&quot;#gradient-1&quot;);"/>
    <path style="stroke-width: 3px; stroke: rgb(98, 97, 29); fill: rgb(255, 245, 121);" d="M 134.415 221.588 C 155.889 202.835 175.611 188.253 201.575 155.129 C 208.793 145.921 214.073 133.792 219.266 123.702 C 220.574 121.16 222.804 115.845 222.804 115.845 C 222.804 115.845 222.338 119.202 222.804 120.756 C 223.492 123.047 228.427 127 229.881 128.612 C 239.741 139.56 254.113 146.827 265.262 156.112 C 272.7 162.306 280.235 170.662 288.261 175.754 C 298.897 182.502 311.673 185.787 322.758 191.468 C 342.461 201.564 366.178 214.081 386.447 214.081"/>
    <path style="stroke-width: 3px; stroke: rgb(98, 97, 29); fill: rgb(255, 245, 121);" d="M 135.109 220.915 C 128.304 235.275 140.206 335.557 144.904 349.467 C 155.352 380.406 166.234 401.67 178.098 407.194 C 188.833 412.192 198.234 424.261 210.002 428.183 C 220.985 431.844 232.373 434.337 243.584 436.579 C 254.045 438.671 265.554 434.876 275.488 433.221 C 318.658 426.025 354.076 386.027 372.877 348.425 C 393.455 307.27 385.471 255.59 385.471 214.095"/>
    <path d="M 259.494 139.551 L 300.478 146.018 L 359.716 143.208 L 371.464 151.599 L 433.083 153.199 L 412.448 161.265 L 459.937 166.846 L 412.448 172.427 L 433.083 180.494 L 371.464 182.093 L 359.716 190.484 L 300.478 187.674 L 259.494 194.141 L 218.51 187.674 L 159.272 190.484 L 147.524 182.093 L 85.905 180.494 L 106.54 172.427 L 59.051 166.846 L 106.54 161.265 L 85.905 153.199 L 147.524 151.599 L 159.272 143.208 L 218.51 146.018 Z" bx:shape="star 259.494 166.846 200.443 27.295 0.79 12 1@e70c867c" style="stroke-width: 3px; stroke: rgb(98, 97, 29); fill: rgb(245, 157, 255);"/>
    <path d="M 254.803 383.495 L 275.748 389.113 L 308.393 384.766 L 315.368 391.046 L 356.176 388.441 L 348.424 394.703 L 392.974 394.122 L 371.336 399.687 L 414.799 401.193 L 381.619 405.458 L 419.285 408.888 L 378.16 411.391 L 405.948 416.373 L 361.333 416.842 L 376.231 422.837 L 332.962 421.222 L 333.356 427.58 L 296.121 424.056 L 281.969 430.087 L 254.803 425.036 L 227.637 430.087 L 213.485 424.056 L 176.25 427.58 L 176.644 421.222 L 133.375 422.837 L 148.273 416.842 L 103.658 416.373 L 131.446 411.391 L 90.321 408.888 L 127.987 405.458 L 94.807 401.193 L 138.27 399.687 L 116.632 394.122 L 161.182 394.703 L 153.43 388.441 L 194.238 391.046 L 201.213 384.766 L 233.858 389.113 Z" bx:shape="star 254.803 406.951 165.046 23.456 0.771 19 1@53192229" style="stroke-width: 3px; stroke: rgb(98, 97, 29); fill: rgb(133, 255, 121);"/>
    <path d="M 225.682 255.371 C 225.682 263.093 208.474 246.422 187.737 246.422 C 166.999 246.422 150.583 263.093 150.583 255.371 C 150.583 247.649 165.924 220.64 186.662 220.64 C 207.4 220.64 225.682 247.649 225.682 255.371 Z" style="stroke-width: 3; stroke: rgb(98, 97, 29); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999753, 0.022217, -0.022217, 0.999753, 0, 0.000001)"/>
    <path d="M 365.541 260.019 C 365.541 267.741 348.59 251.07 328.16 251.07 C 307.731 251.07 291.559 267.741 291.559 260.019 C 291.559 252.297 306.672 225.288 327.102 225.288 C 347.531 225.288 365.541 252.297 365.541 260.019 Z" style="stroke-width: 3; stroke: rgb(98, 97, 29); transform-origin: 328.55px 243.674px;" transform="matrix(0.999753, 0.022217, -0.022217, 0.999753, 0, -0.000001)"/>
    <path style="stroke-width: 3px; stroke: rgb(98, 97, 29);" d="M 206.183 302.2 L 308.682 301.483 C 317.091 342.235 222.111 379.387 206.183 302.2 Z"/>
  </g>
  <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;3" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
</svg>`;
    const CHAR_SVG_6 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <g style="transform-origin: 239.965px 239.544px;">
    <path style="fill: rgb(207, 216, 37); stroke-width: 3.25689px; stroke: rgb(97, 127, 0);" transform="matrix(0.897984, 0, 0, 0.944262, -311.297339, -74.161562)" d="M 613.889 170.556 L 613.889 170.556 L 645.362 235.357 A 101.85 101.85 0 0 1 645.362 235.357 L 708.914 201.431 L 708.914 201.431 L 696.287 272.356 A 101.85 101.85 0 0 1 696.287 272.356 L 767.643 282.264 L 767.643 282.264 L 715.739 332.222 A 101.85 101.85 0 0 1 715.739 332.222 L 767.643 382.18 L 767.643 382.18 L 696.287 392.088 A 101.85 101.85 0 0 1 696.287 392.088 L 708.914 463.013 L 708.914 463.013 L 645.362 429.087 A 101.85 101.85 0 0 1 645.362 429.087 L 613.889 493.889 L 613.889 493.889 L 582.416 429.087 A 101.85 101.85 0 0 1 582.416 429.087 L 518.864 463.013 L 518.864 463.013 L 531.491 392.088 A 101.85 101.85 0 0 1 531.491 392.088 L 460.135 382.18 L 460.135 382.18 L 512.039 332.222 A 101.85 101.85 0 0 1 512.039 332.222 L 460.135 282.264 L 460.135 282.264 L 531.491 272.356 A 101.85 101.85 0 0 1 531.491 272.356 L 518.864 201.431 L 518.864 201.431 L 582.416 235.357 A 101.85 101.85 0 0 1 582.416 235.357 Z M 613.889 332.222 A 0 0 0 0 0 613.889 332.222 A 0 0 0 0 0 613.889 332.222" bx:shape="cog 613.889 332.222 0 101.85 161.667 1 10 1@f32c09b4"/>
    <ellipse style="fill: rgb(207, 216, 37); stroke-width: 3px; stroke: rgb(97, 127, 0);" cx="239.964" cy="240.541" rx="86.306" ry="92.791"/>
    <path style="stroke-width: 3px; stroke: rgb(97, 127, 0);" d="M 200.083 261.587 L 271.706 260.817 C 275.532 293.34 208.233 330.865 200.083 261.587 Z"/>
    <path d="M 195.194 193.905 C 199.525 193.356 203.468 192.958 208 194.417 C 213.503 196.189 221.341 200.581 225.672 205.43 C 229.869 210.129 232.473 217.206 233.868 222.846 C 235.126 227.932 235.3 234.072 234.38 237.701 C 233.699 240.392 232.304 242.355 230.539 243.592 C 228.793 244.815 225.961 245.5 223.879 245.129 C 221.774 244.753 219.332 243.577 217.989 241.287 C 216.17 238.186 217.136 230.762 215.94 226.432 C 214.886 222.621 214.155 218.931 211.586 216.443 C 208.801 213.748 202.951 211.413 199.292 211.321 C 196.152 211.242 192.832 212.465 190.84 214.65 C 188.626 217.079 187.943 221.978 187.254 225.92 C 186.543 229.991 187.723 235.76 186.742 238.726 C 186.043 240.837 184.963 242.098 183.412 243.08 C 181.718 244.152 178.834 244.988 176.753 244.616 C 174.648 244.24 172.172 243.226 170.862 240.775 C 168.933 237.166 168.632 228.037 169.325 222.334 C 169.975 216.993 172.273 211.689 174.448 207.479 C 176.383 203.733 178.129 200.25 181.363 198.003 C 184.877 195.562 190.653 194.48 195.194 193.905 Z M 274.762 192.71 C 281.709 191.468 290.297 192.212 296.276 194.246 C 301.562 196.045 306.381 199.539 309.339 203.211 C 312.042 206.566 313.107 210.294 313.949 214.992 C 314.97 220.689 315.132 231.4 313.949 235.482 C 313.251 237.89 312.208 238.853 310.619 239.836 C 308.834 240.94 305.53 241.68 303.448 241.372 C 301.576 241.096 299.745 239.777 298.582 238.555 C 297.509 237.429 296.953 236.487 296.533 234.457 C 295.86 231.207 297.35 223.451 296.533 219.602 C 295.905 216.647 295.416 214.273 293.203 212.687 C 290.384 210.666 284.103 209.401 279.372 210.126 C 274.141 210.927 266.168 215.255 263.237 218.322 C 261.19 220.463 261.149 222.434 260.676 225.237 C 260.085 228.732 261.684 234.782 260.676 238.043 C 259.869 240.651 258.152 242.795 256.321 243.933 C 254.606 245 252.091 245.337 250.175 244.958 C 248.247 244.577 245.95 242.849 244.796 241.628 C 243.892 240.672 243.598 240.294 243.259 238.555 C 242.595 235.149 242.491 224.942 243.259 220.114 C 243.842 216.453 244.682 214.266 246.333 211.406 C 248.188 208.193 250.423 204.763 254.273 201.93 C 259.162 198.332 267.701 193.971 274.762 192.71 Z" style="stroke-width: 3px; stroke: rgb(97, 127, 0);"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;8" begin="0s" dur="6s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.2 1.2" begin="0s" dur="6s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_7 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <defs>
    <radialGradient gradientUnits="userSpaceOnUse" cx="263.509" cy="236.164" r="216.715" id="gradient-0">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="177.336" cy="280.296" r="31.09" id="gradient-1">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="349.836" cy="282.775" r="31.09" id="gradient-2">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
  </defs>
  <g style="transform-origin: 263.509px 236.164px;">
    <path d="M 373.241 392.896 L 156.627 392.896 L 154.6 371.66 C 155.721 358.236 127.06 306.19 77.213 279.342 C 11.27 243.825 65.63 170.883 116.77 165.688 C 126.244 164.726 136.2 165.399 146.321 167.5 C 160.337 116.738 207.199 79.432 262.85 79.432 C 320.074 79.432 368.006 118.877 380.488 171.837 C 391.776 169.149 402.904 168.198 413.435 169.268 C 464.575 174.463 514.869 254.068 448.263 288.326 C 410.123 307.943 375.982 337.099 373.88 376.065 L 373.241 392.896 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; fill: url(&quot;#gradient-0&quot;);"/>
    <path d="M 208.426 281.004 C 208.426 342.224 205.929 391.852 202.848 391.852 C 199.767 391.852 197.27 342.224 197.27 281.004 C 197.27 219.785 143.292 168.74 146.373 168.74 C 149.453 168.74 208.426 219.785 208.426 281.004 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; fill: url(&quot;#gradient-1&quot;);"/>
    <path d="M 380.926 282.078 C 380.926 221.815 378.429 172.962 375.348 172.962 C 372.267 172.962 369.77 221.815 369.77 282.078 C 369.77 342.341 315.792 392.588 318.873 392.588 C 321.953 392.588 380.926 342.341 380.926 282.078 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%; fill: url(&quot;#gradient-2&quot;);" transform="matrix(-1, 0, 0, -1, -0.000038, -0.000031)"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
  <g style="transform-origin: 261.008px 214.275px;">
    <path d="M 242.561 194.955 C 242.561 218.642 223.611 237.844 200.236 237.844 C 177.381 237.844 158.756 219.486 157.939 196.528 C 145.42 195.181 137.351 193.062 137.351 190.68 C 137.351 188.664 163.179 188.064 189.242 188.467 C 196.981 188.371 205.248 188.619 212.904 189.124 C 229.667 189.822 242.563 190.957 242.563 192.382 C 242.563 192.876 242.217 193.332 241.558 193.754 C 242.212 194.143 242.561 194.545 242.561 194.955 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px;"/>
    <path d="M 384.662 233.596 C 384.662 209.909 365.712 190.707 342.337 190.707 C 319.482 190.707 300.857 209.065 300.04 232.023 C 287.521 233.37 279.452 235.489 279.452 237.871 C 279.452 239.887 305.28 240.487 331.343 240.084 C 339.082 240.18 347.349 239.932 355.005 239.427 C 371.768 238.729 384.664 237.594 384.664 236.169 C 384.664 235.675 384.318 235.219 383.659 234.797 C 384.313 234.408 384.662 234.006 384.662 233.596 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000057, -0.000008)"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -10" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_8 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <defs>
    <radialGradient gradientUnits="userSpaceOnUse" cx="263.509" cy="236.164" r="216.715" id="gradient-0">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="177.336" cy="280.296" r="31.09" id="gradient-1">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="349.836" cy="282.775" r="31.09" id="gradient-2">
      <stop offset="0" style="stop-color: rgb(70.588% 96.471% 100%)"/>
      <stop offset="1" style="stop-color: rgb(31.004% 56.33% 59.679%)"/>
    </radialGradient>
  </defs>
  <g style="transform-origin: 263.509px 236.164px;">
    <path d="M 373.241 392.896 L 156.627 392.896 L 154.6 371.66 C 155.721 358.236 127.06 306.19 77.213 279.342 C 11.27 243.825 65.63 170.883 116.77 165.688 C 126.244 164.726 136.2 165.399 146.321 167.5 C 160.337 116.738 207.199 79.432 262.85 79.432 C 320.074 79.432 368.006 118.877 380.488 171.837 C 391.776 169.149 402.904 168.198 413.435 169.268 C 464.575 174.463 514.869 254.068 448.263 288.326 C 410.123 307.943 375.982 337.099 373.88 376.065 L 373.241 392.896 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; fill: url(&quot;#gradient-0&quot;);"/>
    <path d="M 208.426 281.004 C 208.426 342.224 205.929 391.852 202.848 391.852 C 199.767 391.852 197.27 342.224 197.27 281.004 C 197.27 219.785 143.292 168.74 146.373 168.74 C 149.453 168.74 208.426 219.785 208.426 281.004 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; fill: url(&quot;#gradient-1&quot;);"/>
    <path d="M 380.926 282.078 C 380.926 221.815 378.429 172.962 375.348 172.962 C 372.267 172.962 369.77 221.815 369.77 282.078 C 369.77 342.341 315.792 392.588 318.873 392.588 C 321.953 392.588 380.926 342.341 380.926 282.078 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%; fill: url(&quot;#gradient-2&quot;);" transform="matrix(-1, 0, 0, -1, -0.000038, -0.000031)"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
  <g style="transform-origin: 261.008px 214.275px;">
    <path d="M 242.561 194.955 C 242.561 218.642 223.611 237.844 200.236 237.844 C 177.381 237.844 158.756 219.486 157.939 196.528 C 145.42 195.181 137.351 193.062 137.351 190.68 C 137.351 188.664 163.179 188.064 189.242 188.467 C 196.981 188.371 205.248 188.619 212.904 189.124 C 229.667 189.822 242.563 190.957 242.563 192.382 C 242.563 192.876 242.217 193.332 241.558 193.754 C 242.212 194.143 242.561 194.545 242.561 194.955 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px;"/>
    <path d="M 384.662 233.596 C 384.662 209.909 365.712 190.707 342.337 190.707 C 319.482 190.707 300.857 209.065 300.04 232.023 C 287.521 233.37 279.452 235.489 279.452 237.871 C 279.452 239.887 305.28 240.487 331.343 240.084 C 339.082 240.18 347.349 239.932 355.005 239.427 C 371.768 238.729 384.664 237.594 384.664 236.169 C 384.664 235.675 384.318 235.219 383.659 234.797 C 384.313 234.408 384.662 234.006 384.662 233.596 Z" style="stroke: rgb(42, 91, 123); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000057, -0.000008)"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -10" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const PENTAGON_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"  width="700" xmlns:bx="https://boxy-svg.com">
  <g transform="matrix(1.255971, 0, 0, 1.527577, 37.24648, 3.528937)" style="">
    <g transform="rotate(0)">
      <g transform="scale(1 1)">
        <g transform="translate(0 0)">
          <g fill="#ffffff" fill-opacity="1" id="Stroke_1621dde92081436eaad105ac9bbdd3c0" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
            <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="stroke: none; pointer-events: none;"/>
            <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
          </g>
        </g>
      </g>
    </g>
    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
  </g>
  <g transform="matrix(1.255971, 0, 0, 1.527577, 37.24648, 3.528937)" style="">
    <g transform="rotate(0)">
      <g transform="scale(1 1)">
        <g transform="translate(0 0)">
          <g fill="#ffffff" fill-opacity="1" id="Stroke_4d999fc5476b486eacb44fb99a752478" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
            <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke: none; pointer-events: none;"/>
            <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
          </g>
        </g>
      </g>
    </g>
    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
  </g>
  <g>
    <path d="M 200.739 356.733 L 263.415 356.733 L 285.887 451.246 L 175.53 452.825 L 200.739 356.733 Z" style="stroke-width: 3px; fill: rgb(194, 113, 216); stroke: rgb(80, 19, 92); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999863, 0.016575, -0.016575, 0.999863, 0.000001, 0)"/>
    <path d="M 433.333 273.401 L 468.961 303.923 L 468.961 364.966 L 433.333 395.487 L 397.705 364.966 L 397.705 303.923 Z" bx:shape="n-gon 433.333 334.444 41.14 61.043 6 0 1@d9295583" style="vector-effect: non-scaling-stroke; stroke-width: 3px; fill: rgb(194, 113, 216); stroke: rgb(80, 19, 92);" transform="matrix(-0.01915066, 0.99981661, -0.99981662, -0.01915027, 575.71295007, -104.70092515)"/>
    <path d="M 228.141 378.035 C 228.141 379.685 227.456 381.186 226.337 382.3 C 226.7 383.243 226.896 384.25 226.896 385.295 C 226.896 390.679 221.695 395.044 215.28 395.044 C 208.865 395.044 203.664 390.679 203.664 385.295 C 203.664 383.124 204.51 381.119 205.94 379.498 L 168.402 324.935 L 183.17 314.775 L 222.451 371.875 C 225.668 372.306 228.141 374.9 228.141 378.035 Z" style="stroke-width: 3px; fill: rgb(255, 254, 248); stroke: rgb(80, 19, 92);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(194, 113, 216); stroke: rgb(80, 19, 92);" cx="166.743" cy="317.883" rx="17.838" ry="15.349"/>
    <path d="M 256.349 381.354 C 256.349 386.395 251.892 390.481 246.393 390.481 C 241.104 390.481 236.778 386.7 236.456 381.926 C 233.558 381.222 231.385 378.312 231.385 374.828 C 231.385 370.818 234.264 367.568 237.815 367.568 C 238.253 367.568 238.681 367.617 239.095 367.712 L 278.232 315.261 L 291.197 324.935 L 253.715 375.169 C 255.35 376.795 256.349 378.968 256.349 381.354 Z" style="stroke-width: 3px; fill: rgb(255, 254, 248); stroke: rgb(80, 19, 92);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(194, 113, 216); stroke: rgb(80, 19, 92);" cx="293.893" cy="316.016" rx="15.142" ry="14.312"/>
    <path d="M 265.477 422.328 L 285.389 451.782 L 245.564 451.782 L 245.679 451.612 L 209.035 451.612 L 209.195 451.367 L 175.455 451.367 L 196.405 419.839 L 213.24 445.176 L 229.363 420.499 L 247.719 448.595 Z" style="stroke-width: 3px; fill: rgb(199, 162, 216); stroke: rgb(80, 19, 92);"/>
    <path style="stroke-width: 3px; fill: rgb(194, 113, 216); stroke: rgb(80, 19, 92);" d="M 185.655 306.459 C 192.598 314.592 239.725 292.551 235.022 286.961 C 229.46 289.047 265.49 308.827 277.337 304.384"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.500058; 1" repeatCount="indefinite"/>
  </g>
  <g style="" transform="matrix(1.002364, 0, 0, 0.960781, -1.001028, 11.54786)">
    <path d="M 191.413 241.326 L 198.695 277.551 C 208.459 299.332 113.868 290.075 109.545 280.432 L 156.341 213.411 L 191.413 241.326 Z" style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92); transform-origin: 187.762px 272.884px;"/>
    <path d="M 482.222 107.53 L 545.786 152.999 L 521.507 226.569 L 442.937 226.569 L 418.658 152.999 Z" bx:shape="n-gon 482.222 173.333 66.835 65.803 5 0 1@54403d3a" style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92);" transform="matrix(0.9665614, -0.25643528, 0.26516901, 0.96424429, -388.53882193, 95.26698154)"/>
    <path d="M 482.222 107.53 L 545.786 152.999 L 521.507 226.569 L 442.937 226.569 L 418.658 152.999 Z" bx:shape="n-gon 482.222 173.333 66.835 65.803 5 0 1@54403d3a" style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92); transform-origin: 487.326px 170.824px;" transform="matrix(-0.966562, -0.256435, -0.265169, 0.964244, -147.040822, -26.281289)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92);" cx="237.343" cy="72.875" rx="32.241" ry="29.598"/>
    <path d="M 284.792 305.003 L 292.074 268.778 C 301.838 246.997 207.247 256.254 202.924 265.897 L 249.72 332.918 L 284.792 305.003 Z" style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92); transform-origin: 281.141px 273.445px;" transform="matrix(-1, 0, 0, -1, -0.000017, 0.000003)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 254, 248); stroke: rgb(80, 19, 92);" cx="235.677" cy="192.44" rx="98.714" ry="102.008"/>
    <path d="M 221.952 190.815 C 221.952 208.216 217.02 212.456 210.935 212.456 C 204.85 212.456 199.918 208.216 199.918 190.815 C 199.918 173.414 204.85 159.307 210.935 159.307 C 217.02 159.307 221.952 173.414 221.952 190.815 Z" style="stroke-width: 3px; stroke: rgb(16, 4, 18);"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(16, 4, 18);" cx="207.857" cy="175.538" rx="3.726" ry="8.912"/>
    <path d="M 224.868 238.194 C 217.385 225.473 221.022 227.785 235.781 227.666 C 250.54 227.547 254.281 225.173 247.006 238.014 C 239.73 250.855 232.351 250.914 224.868 238.194 Z" style="stroke-width: 3px; stroke: rgb(16, 4, 18);"/>
    <path d="M 270.232 191.293 C 270.232 208.694 265.3 212.935 259.215 212.935 C 253.13 212.935 248.198 208.694 248.198 191.293 C 248.198 173.892 253.13 159.786 259.215 159.786 C 265.3 159.786 270.232 173.892 270.232 191.293 Z" style="stroke-width: 3px; stroke: rgb(16, 4, 18);"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(16, 4, 18);" cx="256.137" cy="176.017" rx="3.726" ry="8.912"/>
    <path d="M 331.077 157.674 C 335.999 181.232 331.252 171.752 270.917 151.098 C 210.581 130.445 238.319 147.757 232.787 121.511 C 232.18 118.636 232.52 115.849 232.148 113.329 C 232.015 114.375 232.024 115.46 231.941 116.58 C 230.346 138.11 239.066 140.218 201.437 149.455 C 163.807 158.691 126.296 198.431 140.429 156.03 C 154.563 113.629 190.709 88.637 223.467 88.637 C 233.339 88.637 245.676 90.28 249.734 90.28 C 280.151 90.28 326.155 134.115 331.077 157.674 Z" style="stroke-width: 3px; fill: rgb(194, 48, 216); stroke: rgb(80, 19, 92);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" dur="4s" fill="freeze" keyTimes="0; 0.490799; 1" repeatCount="indefinite"/>
  </g>
</svg>`;

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    const NPC_DATA = {
        0: { char_id: 'CHAR_1_AngryBeachman', name: 'Angry Beachman', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Angry Beachman: Get off my beach! The sun is too bright!", "Angry Beachman: Just kidding. But the end is far, keep going."] },
        1: { char_id: 'CHAR_2_BoredFlower', name: 'Bored Flower', svg_content: CHAR_SVG_2, initial_x: 500, dialogue: ["Bored Flower: The tides go in, the tides go out. It's so repetitive.", "Bored Flower: The wind will push you if you jump too high."] },
        2: { char_id: 'CHAR_3_Bubbles', name: 'Bubbles', svg_content: CHAR_SVG_3, initial_x: 600, dialogue: ["Bubbles: Pop! Pop! Pop! Don't let the heat get to you!", "Bubbles: The deeper you go, the crazier it gets."] },
        3: { char_id: 'CHAR_4_Caracol', name: 'Caracol', svg_content: CHAR_SVG_4, initial_x: 350, dialogue: ["Caracol: I'm slow, but I always make it. Speed isn't everything.", "Caracol: Follow the path of the waves, not the wind."] },
        4: { char_id: 'CHAR_5_HappyBeachwoman', name: 'Happy Beachwoman', svg_content: CHAR_SVG_5, initial_x: 550, dialogue: ["Happy Beachwoman: What a beautiful day for a walk on the beach!", "Happy Beachwoman: I heard the Pentagon Fairy lives near the giant seashell."] },
        5: { char_id: 'CHAR_6_HappySun', name: 'Happy Sun', svg_content: CHAR_SVG_6, initial_x: 300, dialogue: ["Happy Sun: Shine, shine, shine! I'll light your way!", "Happy Sun: Keep your eyes peeled for rare pearls in the sand!"] },
        6: { char_id: 'CHAR_7_Krabs', name: 'Krabs', svg_content: CHAR_SVG_7, initial_x: 450, dialogue: ["Krabs: Money! I mean, Move on! Before the tide comes back!", "Krabs: Only two more transitions to the final shore!"] },
        7: { char_id: 'CHAR_8_Pearl', name: 'Pearl', svg_content: CHAR_SVG_8, initial_x: 700, dialogue: ["Pearl: I am the rarest of gems. Go and claim your final reward!", "Pearl: The path of the Pentagon is open."] },
        8: { char_id: 'PENTAGON_FAIRY', name: 'Pentagon Fairy', svg_content: PENTAGON_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Pentagon Fairy: You made it to the final shore!", "Pentagon Fairy: The beach is boundless, but your journey here is complete.", "Pentagon Fairy: Sunny Beach cleared. Adventure awaits!"] },
    };

    const MAX_TRANSITIONS = 8; // 8 transitions (Map 1 -> 2 -> ... -> 9). Total 9 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunny Sky Gradient -->
    <linearGradient id="sunnySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Ocean Water Gradient -->
    <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 140, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 120, 160);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient -->
    <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 230, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 210, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunnySkyGradient)" />

  <!-- 2. Sun (Top Right) -->
  <circle cx="750" cy="50" r="80" fill="rgb(255, 255, 0)" />

  <!-- 3. Clouds (Flat White Style) -->
  <g fill="white" opacity="0.8">
    <ellipse cx="200" cy="150" rx="70" ry="30" />
    <ellipse cx="500" cy="100" rx="90" ry="35" />
    <ellipse cx="650" cy="180" rx="50" ry="20" />
  </g>

  <!-- 4. Ocean Water -->
  <rect x="0" y="250" width="800" height="200" fill="url(#oceanGradient)" />

  <!-- 5. Wave Line / Horizon detail -->
  <path d="M0 250 Q100 245, 200 250 T400 248 T600 250 T800 245"
        fill="none"
        stroke="white"
        stroke-width="2"
        opacity="0.6" />

  <!-- 6. Sand Beach (The main platform) -->
  <path d="M0 450 H800 V380 Q600 350, 400 380 Q200 410, 0 380 Z"
        fill="url(#sandGradient)" />

  <!-- 7. Small Waves/Foam on Sand Edge -->
  <path d="M0 380 Q100 375, 200 380 M300 375 Q400 380, 500 375"
        fill="none"
        stroke="white"
        stroke-width="1"
        opacity="0.5" />

  <!-- 8. Distant Sailboat Silhouette (Ocean detail) -->
  <g transform="translate(300, 280) scale(0.5)" fill="white" stroke="black" stroke-width="2" opacity="0.9">
    <polygon points="0,0 50,100 -50,100" fill="white" stroke="none" />
    <rect x="-5" y="0" width="10" height="100" fill="rgb(100, 50, 0)" stroke="none" />
    <path d="M-50 100 Q0 120, 50 100 L-50 100 Z" fill="rgb(150, 100, 50)" stroke="none" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunny Sky Gradient (Consistent) -->
    <linearGradient id="sunnySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Ocean Water Gradient (Consistent) -->
    <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 140, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 120, 160);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Consistent) -->
    <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 230, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 210, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunnySkyGradient)" />

  <!-- 2. Sun (Top Right) -->
  <circle cx="750" cy="50" r="80" fill="rgb(255, 255, 0)" />

  <!-- 3. Clouds -->
  <g fill="white" opacity="0.8">
    <ellipse cx="200" cy="150" rx="70" ry="30" />
    <ellipse cx="500" cy="100" rx="90" ry="35" />
  </g>

  <!-- 4. Ocean Water -->
  <rect x="0" y="250" width="800" height="200" fill="url(#oceanGradient)" />

  <!-- 5. Main Ground: Rocky Outcrop/Cabo -->
  <!-- The main beach platform -->
  <path d="M0 450 H800 V380 Q400 350, 0 380 Z" fill="url(#sandGradient)" />

  <!-- Lighthouse Island/Hill -->
  <path d="M500 380 C550 350, 650 350, 700 380 V450 H500 Z"
        fill="rgb(100, 150, 80)" /> <!-- Green hill base -->

  <!-- 6. Lighthouse (The main feature) -->
  <g transform="translate(600, 200) scale(0.6)">
    <!-- Base -->
    <rect x="-50" y="0" width="100" height="300" fill="white" stroke="black" stroke-width="2" />
    <!-- Red Stripe -->
    <rect x="-50" y="100" width="100" height="50" fill="red" />
    <!-- Black Stripe -->
    <rect x="-50" y="200" width="100" height="50" fill="black" />
    <!-- Lamp Top -->
    <rect x="-60" y="-20" width="120" height="20" fill="rgb(80, 80, 80)" />
    <polygon points="-70,-20 70,-20 70,0 -70,0" fill="black" />
    <!-- Roof -->
    <polygon points="0,-70 -30,-20 30,-20" fill="red" />
    <!-- Light Effect (subtle yellow glow) -->
    <path d="M0,-30 L-100,-100 L100,-100 Z" fill="yellow" opacity="0.3"/>
  </g>

  <!-- 7. Small Waves near shore -->
  <path d="M0 380 Q100 375, 200 380 T400 375 T600 380 T800 375"
        fill="none"
        stroke="white"
        stroke-width="1"
        opacity="0.4" />

  <!-- 8. Birds (Distant Detail) -->
  <path d="M100 200 L110 205 L105 200 M120 210 L130 215 L125 210"
        fill="none"
        stroke="black"
        stroke-width="2"
        opacity="0.7" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunny Sky Gradient (Consistent) -->
    <linearGradient id="sunnySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Deep Ocean Water Gradient (Darker blue for deeper water) -->
    <linearGradient id="deepOceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 100, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 80, 120);stop-opacity:1" />
    </linearGradient>
    <!-- Wet Sand/Shore Gradient (Slightly darker for the tide line) -->
    <linearGradient id="wetSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 190, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 170, 80);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunnySkyGradient)" />

  <!-- 2. Sun -->
  <circle cx="750" cy="50" r="80" fill="rgb(255, 255, 0)" />

  <!-- 3. Ocean Water (Deep, covering more vertical space) -->
  <rect x="0" y="200" width="800" height="300" fill="url(#deepOceanGradient)" />

  <!-- 4. Water Horizon/Wave Details -->
  <path d="M0 200 Q150 195, 300 200 T600 190 T800 200"
        fill="none"
        stroke="white"
        stroke-width="2"
        opacity="0.5" />

  <!-- 5. Shoreline Sand (Narrower strip of sand) -->
  <path d="M0 450 H800 V400 Q400 380, 0 400 Z"
        fill="url(#wetSandGradient)" />

  <!-- 6. Small Rock/Coral Feature (Detail in the shallower water/shore) -->
  <ellipse cx="650" cy="400" rx="40" ry="20" fill="rgb(100, 120, 100)" />
  <rect x="640" y="400" width="20" height="50" fill="rgb(120, 140, 120)" />

  <!-- 7. Distant Island/Cove Silhouette -->
  <path d="M50 200 Q100 180, 150 200 L150 250 L50 250 Z" fill="rgb(0, 100, 0)" opacity="0.6"/>

  <!-- 8. Seagull Trail (Small, dynamic detail) -->
  <path d="M400 150 L410 155 L405 150 M420 160 L430 165 L425 160"
        fill="none"
        stroke="black"
        stroke-width="2"
        opacity="0.7">
    <animateMotion attributeName="transform" dur="10s" repeatCount="indefinite" path="M0,0 C 100,20, 150,-10, 200,0" />
  </path>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunny Sky Gradient (Consistent) -->
    <linearGradient id="sunnySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Ocean Water Gradient (Mid-depth blue) -->
    <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 140, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 120, 160);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Dry, light sand) -->
    <linearGradient id="sandDryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 240, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 220, 170);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunnySkyGradient)" />

  <!-- 2. Sun -->
  <circle cx="750" cy="50" r="80" fill="rgb(255, 255, 0)" />

  <!-- 3. Ocean Water (Receded, starting higher up) -->
  <rect x="0" y="280" width="800" height="220" fill="url(#oceanGradient)" />

  <!-- 4. Water Horizon/Wave Details -->
  <path d="M0 280 Q150 275, 300 280 T600 270 T800 280"
        fill="none"
        stroke="white"
        stroke-width="2"
        opacity="0.5" />

  <!-- 5. Main Ground: Extended Sand Beach (The main platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sandDryGradient)" />

  <!-- 6. Tidal Pools/Wet Patches (Darker blue spots on the beach) -->
  <g fill="rgb(100, 200, 255)" opacity="0.8">
    <ellipse cx="150" cy="450" rx="60" ry="15" />
    <ellipse cx="600" cy="450" rx="40" ry="10" />
  </g>

  <!-- 7. Distant Beach Towel/Umbrella (Detail on the far left) -->
  <rect x="50" y="430" width="40" height="10" fill="red" />
  <rect x="65" y="400" width="5" height="30" fill="brown" />
  <path d="M67.5 400 L50 390 L85 390 Z" fill="yellow" />

  <!-- 8. Seagulls on the ground (Static details) -->
  <g fill="black" opacity="0.6">
    <circle cx="350" cy="445" r="2" />
    <path d="M352 445 L355 440 L358 445 Z" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunset Sky Gradient (Warm, dramatic colors) -->
    <linearGradient id="sunsetSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 150, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 100, 120);stop-opacity:1" />
    </linearGradient>
    <!-- Ocean Water Gradient (Reflecting sunset colors) -->
    <linearGradient id="sunsetOceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 80, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 60, 120);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Shadowed, golden hue) -->
    <linearGradient id="sunsetSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 190, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 160, 80);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Sunset Colors) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunsetSkyGradient)" />

  <!-- 2. Setting Sun (Large, low, glowing orange) -->
  <circle cx="400" cy="150" r="150" fill="rgb(255, 99, 71)" opacity="0.8" />
  <circle cx="400" cy="150" r="100" fill="rgb(255, 140, 0)" opacity="0.9" />

  <!-- 3. Ocean Water (Reflecting sunset light) -->
  <rect x="0" y="280" width="800" height="220" fill="url(#sunsetOceanGradient)" />

  <!-- 4. Water Horizon/Wave Details (Orange highlights) -->
  <path d="M0 280 Q150 275, 300 280 T600 270 T800 280"
        fill="none"
        stroke="rgb(255, 200, 150)"
        stroke-width="2"
        opacity="0.6" />

  <!-- 5. Main Ground: Sand Beach (Golden shadow) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sunsetSandGradient)" />

  <!-- 6. Distant Headland/Island Silhouette -->
  <path d="M700 280 C750 250, 800 270, 800 300 V350 H700 Z"
        fill="rgb(50, 30, 0)" opacity="0.9" />

  <!-- 7. Clouds/Light Streaks (Darker, elongated shadows) -->
  <g fill="rgb(150, 80, 100)" opacity="0.5">
    <ellipse cx="200" cy="80" rx="90" ry="20" transform="rotate(-10 200 80)"/>
    <ellipse cx="600" cy="120" rx="120" ry="30" transform="rotate(15 600 120)"/>
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Night Sky Gradient (Deep Blue/Violet) -->
    <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(20, 0, 50);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(50, 40, 100);stop-opacity:1" />
    </linearGradient>
    <!-- Night Ocean Gradient (Very Dark, reflecting moon) -->
    <linearGradient id="nightOceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0, 30, 60);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0, 10, 40);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Cool, moonlight tone) -->
    <linearGradient id="nightSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 120, 150);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Night Blue/Violet) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#nightSkyGradient)" />

  <!-- 2. Moon (Top Left, Silver Glow) -->
  <circle cx="150" cy="100" r="100" fill="white" opacity="0.4" />
  <circle cx="150" cy="100" r="70" fill="rgb(240, 240, 255)" />

  <!-- 3. Stars (Scattered white dots) -->
  <g fill="white" opacity="0.7">
    <circle cx="500" cy="50" r="2" />
    <circle cx="750" cy="120" r="1.5" />
    <circle cx="400" cy="20" r="1" />
    <circle cx="600" cy="180" r="2.5" />
  </g>

  <!-- 4. Ocean Water (Dark) -->
  <rect x="0" y="280" width="800" height="220" fill="url(#nightOceanGradient)" />

  <!-- 5. Moonlight Reflection Path on Water -->
  <path d="M150 100 L400 500 L-100 500 Z" fill="white" opacity="0.15" />

  <!-- 6. Main Ground: Sand Beach (Cool Shadow) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#nightSandGradient)" />

  <!-- 7. Distant Rock Silhouette (Foreground) -->
  <path d="M50 450 Q70 420, 100 450 Z" fill="rgb(50, 50, 70)" />
  <path d="M700 450 Q720 400, 750 450 Z" fill="rgb(40, 40, 60)" />

  <!-- 8. Wave/Shore Glints (Subtle white highlights from moonlight) -->
  <path d="M0 450 Q200 448, 400 450 T800 448"
        fill="none"
        stroke="rgb(220, 220, 255)"
        stroke-width="1"
        opacity="0.3" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunrise Sky Gradient (Soft Pink/Orange/Blue) -->
    <linearGradient id="sunriseSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 200, 180);stop-opacity:1" />
      <stop offset="50%" style="stop-color:rgb(200, 180, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Ocean Water Gradient (Calm, light blue) -->
    <linearGradient id="calmOceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 180, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 190, 230);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Freshly lit, soft yellow) -->
    <linearGradient id="softSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 240, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 220, 170);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Sunrise Colors) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#sunriseSkyGradient)" />

  <!-- 2. Rising Sun (Low, soft orange disk) -->
  <circle cx="400" cy="200" r="100" fill="rgb(255, 165, 0)" opacity="0.6" />
  <circle cx="400" cy="200" r="70" fill="rgb(255, 190, 100)" opacity="0.8" />

  <!-- 3. Clouds (Very soft, pink-tinged) -->
  <g fill="rgb(255, 220, 230)" opacity="0.7">
    <ellipse cx="200" cy="100" rx="60" ry="25" />
    <ellipse cx="650" cy="80" rx="90" ry="30" />
  </g>

  <!-- 4. Ocean Water (Calm) -->
  <rect x="0" y="280" width="800" height="220" fill="url(#calmOceanGradient)" />

  <!-- 5. Water Horizon/Wave Details (Pink/Orange highlights) -->
  <path d="M0 280 Q150 278, 300 280 T600 275 T800 280"
        fill="none"
        stroke="rgb(255, 220, 200)"
        stroke-width="2"
        opacity="0.8" />

  <!-- 6. Main Ground: Sand Beach (Soft Yellow) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#softSandGradient)" />

  <!-- 7. Foreground Wet Sand Reflection (Pink/Blue streaks near the ground) -->
  <g opacity="0.3">
    <rect x="50" y="450" width="100" height="5" fill="rgb(255, 180, 200)" />
    <rect x="300" y="450" width="200" height="5" fill="rgb(100, 180, 255)" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_8 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (Mid-day clear blue) -->
    <linearGradient id="clearSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 200, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Shallow Water Gradient (Turquoise) -->
    <linearGradient id="shallowWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 220, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Gradient (Light yellow/beige) -->
    <linearGradient id="sandLightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 245, 210);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 230, 190);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#clearSkyGradient)" />

  <!-- 2. Sun (Top Right) -->
  <circle cx="750" cy="50" r="80" fill="rgb(255, 255, 0)" />

  <!-- 3. Distant Island Silhouette -->
  <path d="M0 280 C100 250, 200 260, 300 280 L300 350 L0 350 Z" fill="rgb(0, 100, 0)" opacity="0.7"/>

  <!-- 4. Shallow Ocean Water (Turquoise) -->
  <rect x="0" y="280" width="800" height="220" fill="url(#shallowWaterGradient)" />

  <!-- 5. Water Horizon/Wave Details -->
  <path d="M0 280 Q150 275, 300 280 T600 270 T800 280"
        fill="none"
        stroke="white"
        stroke-width="2"
        opacity="0.5" />

  <!-- 6. Main Ground: Virgin Sand Beach (Large, light area) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sandLightGradient)" />

  <!-- 7. Washed-up Driftwood / Log (Foreground Detail) -->
  <rect x="50" y="430" width="150" height="20" fill="rgb(150, 100, 50)" rx="5" ry="5" stroke="rgb(100, 70, 30)" stroke-width="1" />

  <!-- 8. Scattered Shells/Seaweed (Details near the sand edge) -->
  <g fill="rgb(180, 255, 180)" opacity="0.8">
    <path d="M600 450 V440 Q610 435, 620 440 V450 Z" />
    <circle cx="700" cy="445" r="5" fill="white" />
  </g>
  <g fill="rgb(240, 240, 200)" opacity="0.9">
    <path d="M250 440 Q260 430, 270 440 L260 445 Z" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_9 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky Gradient (Ethereal Blue/White, bright final stage) -->
    <linearGradient id="finalSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 230, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 245, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Calm Ocean Gradient (Light, reflecting sky) -->
    <linearGradient id="calmFinalOceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 220, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 230, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Sacred Sand Gradient (Pure White/Lightest tone) -->
    <linearGradient id="sacredSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 255, 250);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 240, 230);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#finalSkyGradient)" />

  <!-- 2. Subtle Rainbow/Light Arc (Behind the main feature) -->
  <path d="M200 300 C400 100, 600 100, 800 300" fill="none" stroke="pink" stroke-width="10" opacity="0.3"/>
  <path d="M200 300 C400 110, 600 110, 800 300" fill="none" stroke="yellow" stroke-width="10" opacity="0.3"/>

  <!-- 3. Calm Ocean Water -->
  <rect x="0" y="300" width="800" height="200" fill="url(#calmFinalOceanGradient)" />

  <!-- 4. Water Horizon/Wave Details -->
  <path d="M0 300 Q150 295, 300 300 T600 298 T800 300"
        fill="none"
        stroke="white"
        stroke-width="1"
        opacity="0.7" />

  <!-- 5. Main Ground: Sacred Sand Beach (Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sacredSandGradient)" />

  <!-- 6. Giant Seashell/Arrecife Platform (Where the Fairy sits) -->
  <g transform="translate(450, 400)">
    <!-- Main Shell Body (Oyster/Scallop shape) -->
    <path d="M-150 0 C-100 -150, 100 -150, 150 0 C100 50, -100 50, -150 0 Z"
          fill="rgb(255, 240, 220)"
          stroke="rgb(200, 190, 180)"
          stroke-width="3" />
    <!-- Interior/Seat -->
    <ellipse cx="0" cy="10" rx="100" ry="30" fill="rgb(240, 220, 200)" />
    <!-- Small Pearl/Glow (Focus point for the fairy) -->
    <circle cx="0" cy="-50" r="15" fill="white" stroke="rgb(200, 200, 255)" stroke-width="2" opacity="0.9">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- 7. Foreground Ripples/Zen Garden Sand (Detail) -->
  <path d="M0 450 Q200 455, 400 450 T800 455" fill="none" stroke="rgb(200, 200, 200)" stroke-width="1" opacity="0.5"/>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3, MAP_SVG_4, MAP_SVG_5, MAP_SVG_6, MAP_SVG_7, MAP_SVG_8, MAP_SVG_9];

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
            background-color: #f39c12; /* Beach/Sunny Orange */
            color: white;
            border: 2px solid #fff;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
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

    // --- FUNCIÓN CORREGIDA ---
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
        const size = isFinalNPC ? NPC_WIDTH_DEFAULT : NPC_WIDTH_DEFAULT;
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

        // *** FIX 2: Añadir el área de clic al mapContainer (la escena de juego) ***
        mapContainer.appendChild(clickArea);
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

        // Custom style for the Sunny Beach dialogue box (bright blue/yellow theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(52, 152, 219, 0.9); /* Ocean Blue */
            border: 5px solid #f1c40f; /* Sand Yellow/Gold Border */
            box-shadow: 0 0 20px rgba(241, 196, 15, 0.7);
            border-radius: 10px;
            font-family: Arial, sans-serif;
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

        // Final Level Completion Check (Pentagon Fairy is only NPC in phase 8)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:gold; font-size:36px; text-align:center; font-family: Arial, sans-serif;">
                    LEVEL COMPLETE!<br>The waves of Sunny Beach brought you here.
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
            background-color: #3498db;
            color: white;
            border: 4px solid #f1c40f;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(241, 196, 15, 0.7);
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
                 // Final transition to the last map (MAP_SVG_9)
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