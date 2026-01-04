// ==UserScript==
// @name         Drawaria Game Level 5 - Toxic Forest
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 5: Toxic Forest. Navigate the dark, dangerous woods and encounter toxic creatures.
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

    const LEVEL_TITLE = "Toxic Forest";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-forest-2.mp3";
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 0 0 9 0.83 #fffffffe" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="9"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl" type="linear" slope="1.66"/>
      </feComponentTransfer>
      <feFlood flood-color="#fffffffe"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="filter-1" bx:preset="drop-shadow 1 0 0 9 0.83 #fffffffe" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="9"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="feFuncA-1" type="linear" slope="1.66"/>
      </feComponentTransfer>
      <feFlood flood-color="#fffffffe"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 5 0.29 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="0.58"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g>
    <g>
      <path d="M 245.783 328.06 C 245.726 332.271 229.951 335.472 210.549 335.208 C 192.951 334.969 178.413 331.962 175.904 328.261 L 175.404 328.261 L 175.404 282.376 L 202.648 282.376 L 202.647 320.049 C 205.252 319.952 207.967 319.918 210.756 319.955 C 230.159 320.219 245.841 323.848 245.783 328.06 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(255, 145, 23); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-6" begin="0s" dur="0.5s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </path>
      <path d="M 193.797 330.436 C 193.74 334.648 177.965 337.848 158.563 337.584 C 140.964 337.345 126.427 334.338 123.918 330.637 L 123.418 330.638 L 123.418 284.753 L 150.662 284.753 L 150.661 322.425 C 153.266 322.328 155.981 322.294 158.77 322.332 C 178.172 322.596 193.855 326.224 193.797 330.436 Z" style="stroke: rgb(0, 0, 0); fill: rgb(255, 145, 23); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;6" begin="0s" dur="0.5s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      </path>
      <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 204, 111); filter: url(&quot;#inner-shadow-filter-0&quot;);" transform="matrix(0, 1, -1, 0, 424.188241, 98.899561)" cx="129.664" cy="268.713" rx="64.567" ry="138.508"/>
      <g>
        <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 204, 111); filter: url(&quot;#inner-shadow-filter-0&quot;);" transform="matrix(0.036673, 0.999327, -0.999327, 0.036673, 370.997666, -119.244444)" cx="247.344" cy="132.81" rx="56.795" ry="54.862"/>
        <path d="M 133.065 43.46 L 284.294 43.46 C 307.531 46.108 304.484 97.831 284.294 95.53 L 137.517 95.53 C 135.3 96.992 132.339 98.126 129.679 98.722 C 126.144 99.515 121.09 99.65 118.32 98.722 C 116.257 98.03 114.812 96.826 113.825 95.1 C 112.777 93.268 112.036 90.049 112.405 87.854 C 112.715 86.009 113.506 84.162 115.07 82.717 C 112.104 82.854 109.439 82.807 107.804 82.498 C 105.676 82.096 104.75 81.72 103.781 80.269 C 102.581 78.473 101.517 74.117 101.887 71.631 C 102.228 69.349 102.92 67.327 105.437 65.779 C 107.219 64.683 110.747 63.746 114.762 63.017 C 114.739 63.009 114.715 63 114.693 62.992 C 112.437 62.166 111.086 60.388 110.196 58.812 C 109.432 57.461 109.024 56.044 109.25 54.354 C 109.539 52.182 110.516 48.504 112.799 46.83 C 115.864 44.583 133.065 43.46 133.065 43.46 Z" style="stroke: rgb(0, 0, 0); fill: rgb(255, 79, 79); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
        <path d="M 261.072 127.405 C 260.134 132.507 250.065 134.929 238.581 132.817 C 227.098 130.705 218.549 124.859 219.488 119.757 C 220.426 114.656 229.581 118.627 241.065 120.739 C 252.548 122.851 262.01 122.304 261.072 127.405 Z" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 239.74px 126.516px;"/>
        <path d="M 267.048 126.928 C 267.986 132.03 276.408 134.756 285.859 133.018 C 295.309 131.28 302.21 125.736 301.272 120.634 C 300.334 115.533 294.653 121.485 285.202 123.223 C 275.751 124.961 266.11 121.827 267.048 126.928 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(255, 255, 255); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 284.792px 127.218px;"/>
        <path d="M 313.664 152.262 C 313.664 157.729 298.358 162.162 279.476 162.162 C 260.595 162.162 245.288 157.729 245.288 152.262 C 245.288 146.794 260.595 142.362 279.476 142.362 C 298.358 142.362 313.664 146.794 313.664 152.262 Z" style="stroke: rgb(0, 0, 0); fill: rgb(255, 164, 0); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999609, 0.027961, -0.027961, 0.999609, 0, 0.000001)"/>
        <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#inner-shadow-filter-0&quot;);" transform="matrix(0.998274, 0.058722, -0.058722, 0.998274, 9.250903, -14.347265)" cx="299.745" cy="148.799" rx="13.421" ry="2.083"/>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 3" dur="1s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1" begin="-0.02s"/>
      </g>
      <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="65.105" cy="207.565" rx="42.54" transform="matrix(0.999984, -0.005618, 0.005618, 0.999984, -4.989578, 9.448181)" ry="2.403"/>
      <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="65.105" cy="207.565" rx="42.54" transform="matrix(0.999984, -0.005618, 0.005618, 0.999984, -5.944858, 25.940606)" ry="2.403"/>
    </g>
    <ellipse style="stroke: rgba(0, 0, 0, 0); fill: rgb(255, 255, 255); filter: url(&quot;#drop-shadow-filter-0&quot;);" cx="245.95" cy="126.848" rx="4.468" ry="6.278"/>
    <ellipse style="stroke: rgba(0, 0, 0, 0); fill: rgb(255, 255, 255); filter: url(&quot;#filter-1&quot;); stroke-width: 1;" cx="288.277" cy="127.447" rx="4.468" ry="6.278"/>
    <animateMotion path="M 0 0 L 100 0" calcMode="linear" begin="0s" dur="5s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
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
  <g style="transform-origin: 249.237px 238.497px;">
    <path d="M 359.889 252.699 L 310.404 271.875 L 310.404 148.038 L 191.673 148.039 L 191.673 261.917 L 143.374 243.201 L 126.214 287.484 L 191.673 312.85 L 191.673 441.302 L 310.404 441.302 L 310.404 322.808 L 377.049 296.983 L 359.889 252.699 Z" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(238, 176, 148); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 108.082 300.043 C 99.328 300.043 91.968 294.623 89.86 287.282 C 88.404 287.609 86.881 287.783 85.313 287.783 C 74.915 287.783 66.485 280.137 66.485 270.706 C 66.485 265.714 68.847 261.222 72.613 258.099 C 65.685 255.578 60.793 249.429 60.793 242.245 C 60.793 232.814 69.223 225.168 79.621 225.168 C 81.977 225.168 84.231 225.56 86.31 226.277 C 88.352 218.849 95.757 213.345 104.579 213.345 C 113.985 213.345 121.781 219.602 123.183 227.777 C 124.522 227.503 125.916 227.358 127.347 227.358 C 137.745 227.358 146.175 235.004 146.175 244.435 C 146.175 248.68 144.467 252.564 141.64 255.551 C 146.003 258.678 148.802 263.52 148.802 268.955 C 148.802 278.386 140.372 286.032 129.974 286.032 C 128.843 286.032 127.734 285.941 126.658 285.768 C 125.184 293.866 117.428 300.043 108.082 300.043 Z" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(104, 216, 101); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 396.961 310.631 C 388.207 310.631 380.847 305.211 378.739 297.87 C 377.283 298.197 375.76 298.371 374.192 298.371 C 363.794 298.371 355.364 290.725 355.364 281.294 C 355.364 276.302 357.726 271.81 361.492 268.687 C 354.564 266.166 349.672 260.017 349.672 252.833 C 349.672 243.402 358.102 235.756 368.5 235.756 C 370.856 235.756 373.11 236.148 375.189 236.865 C 377.231 229.437 384.636 223.933 393.458 223.933 C 402.864 223.933 410.66 230.19 412.062 238.365 C 413.401 238.091 414.795 237.946 416.226 237.946 C 426.624 237.946 435.054 245.592 435.054 255.023 C 435.054 259.268 433.346 263.152 430.519 266.139 C 434.882 269.266 437.681 274.108 437.681 279.543 C 437.681 288.974 429.251 296.62 418.853 296.62 C 417.722 296.62 416.613 296.529 415.537 296.356 C 414.063 304.454 406.307 310.631 396.961 310.631 Z" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(104, 216, 101); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M -222.526 -174.889 Q -208.071 -195.99 -193.617 -174.889 L -193.617 -174.889 Q -179.163 -153.787 -208.071 -153.787 L -208.071 -153.787 Q -236.98 -153.787 -222.526 -174.889 Z" bx:shape="triangle -236.98 -195.99 57.817 42.203 0.5 0.5 1@4d5fae73" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(6, 13, 6); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-0.960525, -0.278193, 0.278195, -0.960525, 431.973137, 387.27612)"/>
    <path d="M -222.526 -174.889 Q -208.071 -195.99 -193.617 -174.889 L -193.617 -174.889 Q -179.163 -153.787 -208.071 -153.787 L -208.071 -153.787 Q -236.98 -153.787 -222.526 -174.889 Z" bx:shape="triangle -236.98 -195.99 57.817 42.203 0.5 0.5 1@4d5fae73" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(6, 13, 6); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: -208.071px -169.613px;" transform="matrix(0.960525, -0.278193, -0.278195, -0.960525, 485.694291, 387.038408)"/>
    <path d="M 252.741 243.602 C 255.91 243.04 259.614 243.156 262.464 243.803 C 265.127 244.408 268.09 245.817 269.428 247.135 C 270.518 248.209 270.947 249.637 270.742 250.77 C 270.539 251.891 269.489 253.241 268.245 253.901 C 266.944 254.591 264.658 254.88 262.99 254.708 C 261.33 254.538 259.598 253.152 258.26 252.891 C 257.248 252.693 256.621 252.705 255.632 252.891 C 254.371 253.128 252.282 253.916 251.295 254.506 C 250.557 254.949 250.643 255.565 249.851 255.92 C 248.767 256.405 246.321 256.92 244.857 256.728 C 243.504 256.55 242.119 255.84 241.31 255.011 C 240.466 254.146 239.802 252.764 239.996 251.578 C 240.212 250.25 241.314 248.658 243.018 247.438 C 245.159 245.906 249.421 244.19 252.741 243.602 Z" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(6, 13, 6); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 320.34 180.129 C 311.586 180.129 304.226 174.709 302.118 167.368 C 300.662 167.695 299.139 167.869 297.571 167.869 C 293.265 167.869 289.297 166.558 286.125 164.352 C 282.708 167.51 277.948 169.47 272.684 169.47 C 271.553 169.47 270.444 169.379 269.368 169.206 C 267.894 177.304 260.138 183.481 250.792 183.481 C 242.038 183.481 234.678 178.061 232.57 170.72 C 231.114 171.047 229.591 171.221 228.023 171.221 C 222.199 171.221 216.992 168.822 213.539 165.055 C 210.402 167.176 206.511 168.431 202.298 168.431 C 201.167 168.431 200.058 168.34 198.982 168.167 C 197.508 176.265 189.752 182.442 180.406 182.442 C 171.652 182.442 164.292 177.022 162.184 169.681 C 160.728 170.008 159.205 170.182 157.637 170.182 C 147.239 170.182 138.809 162.536 138.809 153.105 C 138.809 148.113 141.171 143.621 144.937 140.498 C 138.009 137.977 133.117 131.828 133.117 124.644 C 133.117 115.213 141.547 107.567 151.945 107.567 C 154.301 107.567 156.555 107.959 158.634 108.676 C 159.288 106.298 160.491 104.117 162.115 102.251 C 158.002 98.813 155.345 93.367 155.345 87.238 C 155.345 77.832 161.602 70.036 169.777 68.634 C 169.503 67.295 169.358 65.901 169.358 64.47 C 169.358 54.072 177.004 45.642 186.435 45.642 C 190.68 45.642 194.564 47.35 197.551 50.177 C 200.678 45.814 205.52 43.015 210.955 43.015 C 215.268 43.015 219.208 44.778 222.214 47.687 C 223.089 47.574 223.984 47.515 224.894 47.515 C 227.25 47.515 229.504 47.907 231.583 48.624 C 233.625 41.196 241.03 35.692 249.852 35.692 C 259.258 35.692 267.054 41.949 268.456 50.124 C 269.795 49.85 271.189 49.705 272.62 49.705 C 277.367 49.705 281.704 51.299 285.016 53.928 C 287.385 46.956 294.546 41.888 303.011 41.888 C 312.417 41.888 320.213 48.145 321.615 56.32 C 322.954 56.046 324.348 55.901 325.779 55.901 C 336.177 55.901 344.607 63.547 344.607 72.978 C 344.607 77.223 342.899 81.107 340.072 84.094 C 344.435 87.221 347.234 92.063 347.234 97.498 C 347.234 101.366 345.816 104.933 343.426 107.796 C 351.992 109.398 358.433 116.278 358.433 124.521 C 358.433 128.766 356.725 132.65 353.898 135.637 C 358.261 138.764 361.06 143.606 361.06 149.041 C 361.06 158.472 352.63 166.118 342.232 166.118 C 341.101 166.118 339.992 166.027 338.916 165.854 C 337.442 173.952 329.686 180.129 320.34 180.129 Z" style="stroke: rgb(41, 134, 79); stroke-width: 3px; fill: rgb(104, 216, 101); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <animateTransform type="skewY" additive="sum" attributeName="transform" values="0;3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;40 0" dur="9s" fill="freeze" begin="-0.02s" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<?xml version="1.0" encoding="utf-8"?>
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
  <g>
    <g style="filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 244.817px 292.385px;">
      <path d="M 176.981 125.543 C 184.464 132.327 143.964 142.984 116.068 173.755 C 88.173 204.526 66.783 233.345 59.301 226.561 C 51.818 219.778 68.366 189.334 96.261 158.563 C 124.156 127.792 169.499 118.76 176.981 125.543 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-origin: 117.05px 165.372px;"/>
      <path d="M 398.415 193.352 C 405.898 186.568 365.398 175.911 337.503 145.141 C 309.607 114.369 288.218 85.55 280.735 92.334 C 273.252 99.117 289.801 129.561 317.696 160.332 C 345.591 191.103 390.933 200.135 398.415 193.352 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-origin: 355.534px 160.165px;" transform="matrix(-1, 0, 0, -1, -0.000032, 0.000009)"/>
      <path d="M 287.927 377.278 C 287.927 403.974 241.827 427.95 213.152 427.95 C 184.477 427.95 184.087 403.974 184.087 377.278 C 184.087 350.582 184.332 312.941 213.007 312.941 C 241.682 312.941 287.927 350.582 287.927 377.278 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(216, 126, 126); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.010638, 0.999941, -0.999946, 0.010638, -0.000003, 0.000016)"/>
      <path d="M 290.746 292.079 C 290.746 318.775 244.646 342.751 215.971 342.751 C 187.296 342.751 186.906 318.775 186.906 292.079 C 186.906 265.383 187.151 227.741 215.826 227.741 C 244.501 227.741 290.746 265.383 290.746 292.079 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(216, 126, 126); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.010638, 0.999941, -0.999946, 0.010638, -0.000006, 0.000013)"/>
      <path d="M 349.376 153.987 C 327.034 186.44 265.356 232.152 246.797 245.11 C 228.238 258.068 187.174 198.71 144.218 153.987 C 101.262 109.264 371.718 121.534 349.376 153.987 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(216, 126, 126); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999475, -0.032399, 0.032399, 0.999475, 0, 0)"/>
      <path d="M 223.906 178.571 C 217.515 190.807 202.201 195.433 189.704 188.904 C 177.206 182.376 172.256 167.164 178.648 154.929 C 185.039 142.694 194.273 148.2 206.771 154.728 C 219.268 161.257 230.298 166.336 223.906 178.571 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-origin: 198.547px 171.976px;"/>
      <path d="M 276.962 10.175 C 270.57 -2.061 255.257 -6.687 242.759 -0.158 C 230.262 6.37 225.312 21.582 231.703 33.817 C 238.095 46.052 247.329 40.546 259.826 34.017 C 272.324 27.489 283.353 22.41 276.962 10.175 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-origin: 267.449px 94.293px;" transform="matrix(-1, 0, 0, -1, -0.000007, -0.000001)"/>
      <path d="M 215.239 213.15 L 235.49 213.15 L 226.653 233.77 L 215.239 213.15 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.992661, -0.120927, 0.120928, 0.992661, 0, 0.000002)"/>
      <path d="M 241.566 234.506 L 261.817 234.506 L 252.98 213.886 L 241.566 234.506 Z" style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20); transform-origin: 251.692px 224.196px;" transform="matrix(-0.992661, -0.120927, 0.120928, -0.992661, -0.000005, -0.000006)"/>
      <ellipse style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20);" transform="matrix(0.909972, 0.41467, -0.41467, 0.909972, 114.882067, -43.387347)" cx="157.364" cy="242.88" rx="41.991" ry="9.315"/>
      <ellipse style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20);" transform="matrix(0.815899, -0.578195, 0.578195, 0.815899, -73.956899, 228.330572)" cx="321.572" cy="230.304" rx="37.644" ry="7.402"/>
      <ellipse style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20);" transform="matrix(-0.582909, 0.812538, -0.812538, -0.582909, 615.518462, 532.268006)" cx="171.148" cy="424.113" rx="41.073" ry="9.962"/>
      <ellipse style="stroke: rgb(122, 0, 0); stroke-width: 3px; fill: rgb(122, 20, 20);" transform="matrix(0.645413, 0.763834, -0.763834, 0.645413, 425.127974, -79.654558)" cx="298.356" cy="418.067" rx="40.843" ry="7.592"/>
      <animateMotion path="M 0 0 L 6 -33" calcMode="linear" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;7" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
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
  <g style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <path d="M 63.279 167.79 Q 115.09 81.353 166.9 167.79 L 166.9 167.79 Q 218.71 254.227 115.09 254.227 L 115.09 254.227 Q 11.469 254.227 63.279 167.79 Z" bx:shape="triangle 11.469 81.353 207.241 172.874 0.5 0.5 1@ef83bda3" style="stroke-width: 3px; stroke: rgb(156, 84, 52); fill: rgb(255, 255, 255); transform-box: fill-box; transform-origin: 50% 50%;">
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-40" begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </path>
    <path d="M 224.698 172.217 Q 276.509 85.78 328.319 172.217 L 328.319 172.217 Q 380.129 258.654 276.509 258.654 L 276.509 258.654 Q 172.888 258.654 224.698 172.217 Z" bx:shape="triangle 172.888 85.78 207.241 172.874 0.5 0.5 1@9ae59a74" style="stroke-width: 3px; stroke: rgb(156, 84, 52); fill: rgb(255, 255, 255); transform-box: fill-box; transform-origin: 50% 50%;">
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;40" begin="0s" dur="1s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    </path>
    <ellipse style="stroke-width: 3px; stroke: rgb(156, 84, 52); fill: rgb(211, 216, 118); transform-box: fill-box; transform-origin: 50% 50%;" cx="143.208" cy="197.471" rx="131.742" transform="matrix(0.007905, 0.999969, -0.999969, 0.007905, 55.191136, 22.914718)" ry="90.246"/>
    <path style="stroke-width: 3px; stroke: rgb(156, 84, 52);" d="M 108.774 205.201 L 287.804 205.461 C 290.924 206.501 287.544 258.082 284.424 257.042 L 111.894 257.042 C 109.501 256.731 105.54 207.797 108.774 205.201 Z"/>
    <path style="stroke-width: 3px; stroke: rgb(156, 84, 52);" d="M 120.859 285.796 L 276.292 285.975 C 279 286.692 258.821 322.559 256.112 321.843 L 140.813 320.715 C 138.911 320.797 126.846 302.497 120.859 285.796 Z"/>
    <path d="M -199.103 -387.78 L -160.827 -339.914 L -237.38 -339.914 L -199.103 -387.78 Z" bx:shape="triangle -237.38 -387.78 76.553 47.866 0.5 0 1@b82d3bcf" style="stroke-width: 3px; stroke: rgb(156, 84, 52);" transform="matrix(-1, 0, 0, -1, 0, 0)"/>
    <path d="M 241.848 163.761 C 227.783 182.195 221.754 179.052 212.5 163.761 C 208.404 156.994 206.938 151.933 208.196 148.657 C 207.905 148.138 207.738 147.54 207.738 146.903 C 207.738 144.921 209.344 143.315 211.326 143.315 L 253.312 143.315 C 255.294 143.315 256.9 144.921 256.9 146.903 C 256.899 148.884 255.293 150.49 253.312 150.49 L 247.974 150.49 C 248.864 152.884 247.133 156.834 241.848 163.761 Z M 184.776 162.782 C 175.522 178.073 169.493 181.216 155.428 162.782 C 150.143 155.855 148.412 151.905 149.302 149.511 L 143.963 149.511 C 141.981 149.511 140.375 147.905 140.375 145.923 C 140.376 143.942 141.982 142.336 143.963 142.336 L 185.949 142.336 C 187.93 142.336 189.536 143.942 189.537 145.923 C 189.537 146.56 189.371 147.158 189.08 147.677 C 190.338 150.953 188.872 156.014 184.776 162.782 Z" style="stroke-width: 3px; stroke: rgb(156, 84, 52);"/>
    <path d="M 214.983 188.087 C 214.983 192.484 207.961 196.048 199.299 196.048 C 190.637 196.048 183.615 192.484 183.615 188.087 C 183.615 183.69 190.853 188.627 199.515 188.627 C 208.177 188.627 214.983 183.69 214.983 188.087 Z" style="stroke-width: 3px; stroke: rgb(156, 84, 52); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999677, 0.025415, -0.025415, 0.999677, 0, 0)"/>
    <rect style="stroke-width: 3px; stroke: rgb(156, 84, 52);" height="5.25" transform="matrix(0.659055, 0.752095, -0.752095, 0.659055, 105.79278, -70.94053)" x="129.753" y="78.36" width="34.273"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(156, 84, 52);" transform="matrix(0.690982, 0.722872, -0.722872, 0.690982, 99.828372, -59.509016)" cx="116.068" cy="73.778" rx="12.499" ry="12.966"/>
    <rect style="stroke-width: 3px; stroke: rgb(156, 84, 52);" height="5.25" transform="matrix(-0.659055, 0.752095, 0.752095, 0.659055, 238.130856, 229.102039)" x="-129.75" y="-78.36" width="34.273"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(156, 84, 52);" transform="matrix(-0.690982, 0.722872, 0.722872, 0.690982, 297.255682, -57.92692)" cx="116.068" cy="73.778" rx="12.499" ry="12.966"/>
    <animateMotion path="M 0 0 C -8.732 30.561 103.554 100.628 127.803 15.755" calcMode="linear" begin="0.09s" dur="7.95s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_5 = `<?xml version="1.0" encoding="utf-8"?>
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
  <g style="transform-origin: 221.564px 235.618px;">
    <path style="stroke: rgb(26, 72, 31); stroke-width: 3px; fill: rgb(123, 216, 94); filter: url(&quot;#inner-shadow-filter-0&quot;);" d="M 349.094 366.443 C 309.427 388.397 276.48 399.147 228.291 387.89 C 193.957 379.869 183.605 373.383 165.805 321.307 C 150.731 277.207 285.429 163.243 248.077 143.959 C 210.45 124.533 153.345 180.123 131.44 202.573 C 126.309 207.83 100.406 223.123 90.824 220.177 C 79.196 216.602 75.315 198.311 76.244 191.45 C 80.986 156.462 100.259 127.361 132.481 106.132 C 153.001 92.612 181.451 83.268 206.421 80.197 C 226.485 77.729 251.309 78.541 270.988 83.079 C 291.254 87.751 303.398 99.922 313.686 115.738 C 346.332 165.924 315.586 229.775 280.361 270.388 C 268.752 283.772 251.733 294.055 244.953 310.732 C 242.384 317.05 237.014 324.903 240.787 331.864 C 247.633 344.492 262.892 348.193 277.237 348.193 C 305.587 348.193 326.237 335.201 350.136 324.179 C 378.969 310.882 363.703 346.547 356.384 357.799 C 352.075 364.423 346.11 367.275 340.763 372.207"/>
    <path d="M -78.587 138.546 Q -60.102 118.91 -41.617 138.546 L -41.617 138.546 Q -23.132 158.182 -60.102 158.182 L -60.102 158.182 Q -97.072 158.182 -78.587 138.546 Z" bx:shape="triangle -97.072 118.91 73.94 39.272 0.5 0.5 1@15e81d07" style="stroke: rgb(26, 72, 31); stroke-width: 3px; fill: rgb(20, 35, 15); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.706635, -0.707578, -0.707579, -0.706634, 186.204898, 15.028369)"/>
    <animateMotion path="M 0 0 L -42.304 1.756" calcMode="linear" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;5" begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_6 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #000" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#000" result="color"/>
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
  <g style="transform-origin: 255.505px 248.784px;">
    <rect x="236.23" y="199.553" width="158.221" height="122.357" style="stroke-width: 3px; stroke: rgb(0, 0, 0);"/>
    <path fill="rgb(255,0,0)" d="M 215.83 82.735 C 226.775 81.058 241.735 81.049 255.301 84.132 C 270.161 87.51 288.452 104.822 301.353 103.687 C 312.34 102.721 319.554 87.24 328.982 84.132 C 337.573 81.3 348.072 82.855 355.298 84.132 C 361.129 85.163 364.302 86.094 369.77 89.719 C 377.48 94.83 393.019 111.854 396.743 115.56 C 398.077 116.889 397.858 116.586 398.716 117.656 C 400.139 119.429 401.251 122.443 404.637 126.036 C 410.495 132.254 429.413 142.071 434.898 151.877 C 439.615 160.307 440.229 171.928 438.847 179.814 C 437.633 186.731 433.289 193.985 428.978 197.274 C 425.17 200.18 418.276 198.034 415.163 200.068 C 412.675 201.692 413.154 204.644 410.557 207.051 C 406.728 210.603 401.094 215.493 392.138 218.227 C 378.496 222.39 342.93 220.297 331.614 223.814 C 325.619 225.677 326.121 229.418 321.088 230.798 C 313.778 232.801 299.006 232.17 289.511 230.798 C 281.01 229.569 272.138 219.571 266.486 223.814 C 258.738 229.629 250.227 268.785 254.644 278.29 C 257.867 285.225 270.153 284.638 277.669 285.274 C 284.831 285.879 291.911 280.843 298.721 282.48 C 305.972 284.224 314.761 296.93 319.773 296.448 C 323.536 296.087 324.043 288.585 327.666 286.671 C 331.7 284.539 338.589 283.466 343.456 285.274 C 348.75 287.239 351.806 296.8 357.928 299.242 C 364.683 301.936 376.892 297.026 382.927 299.242 C 387.584 300.951 389.699 303.635 392.795 308.321 C 397.119 314.863 404.603 332.514 404.637 337.654 C 404.653 340.109 402.369 339.353 402.006 341.845 C 401.282 346.81 406.597 364.539 405.953 369.781 C 405.615 372.53 405.265 373.097 403.322 374.669 C 399.951 377.399 388.552 378.021 383.585 382.352 C 378.798 386.528 379.324 396.283 373.718 399.812 C 366.978 404.054 350.662 403.081 343.456 402.606 C 338.682 402.292 335.831 398.989 332.929 399.812 C 330.201 400.588 330.073 405.373 326.352 406.796 C 320.492 409.038 308.895 408.918 297.404 406.796 C 290.149 405.456 281.165 401.575 271.876 397.58 C 270.672 399.407 269.006 400.904 267.728 402.05 C 266.097 403.514 265.501 404.173 262.597 404.774 C 257.96 405.733 247.105 405.644 237.798 405.158 C 236.067 407.541 233.801 409.75 232.003 411.229 C 229.561 413.237 227.66 414.165 224.307 414.861 C 219.766 415.803 211.705 416.768 206.349 414.861 C 201.024 412.964 195.615 408.018 192.24 403.513 C 189.085 399.303 186.101 393.327 186.253 388.988 C 186.264 388.678 186.296 388.364 186.346 388.047 C 182.814 387.713 179.57 387.104 176.358 385.845 C 172.944 384.505 169.193 382.495 166.037 380.185 C 159.452 380.982 150.909 380.721 145.919 379.354 C 139.961 377.722 135.528 374.328 131.81 369.822 C 127.826 364.993 124.968 357.426 123.259 350.757 C 121.921 345.54 121.204 338.331 121.292 333.366 C 121.17 333.33 121.05 333.294 120.931 333.257 C 114.394 331.212 106.103 324.312 101.69 319.185 C 98.041 314.945 96.272 310.312 94.85 305.568 C 93.683 301.678 92.83 297.138 92.953 293.235 C 85.967 290.329 79.003 286.429 75.704 281.781 C 70.603 274.594 71.464 263.654 71.757 253.845 C 72.073 243.251 73.481 232.537 78.336 220.321 C 81.443 212.502 87.31 201.549 93.388 191.6 C 92.438 189.639 91.655 187.618 91.239 185.936 C 90.452 182.753 90.338 180.85 91.239 176.858 C 92.671 170.519 97.088 158.606 102.355 150.532 C 107.896 142.038 121.058 129.983 124.162 127.381 C 124.807 126.841 124.941 126.7 125.193 126.62 C 125.615 123.352 126.186 120.489 127.018 118.355 C 129.843 111.112 131.559 107.123 138.201 103.687 C 148.322 98.453 181.224 102.001 188.858 98.1 C 192.503 96.237 190.629 93.24 193.463 91.116 C 197.831 87.84 206.903 84.103 215.83 82.735 Z" style="fill: rgb(166, 209, 48); stroke-width: 3px; stroke: rgb(117, 136, 43); filter: url(&quot;#inner-shadow-filter-1&quot;);"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(117, 136, 43); fill: rgb(255, 255, 255); filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="305.144" cy="257.841" rx="18.283" ry="17.932"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(117, 136, 43); fill: rgb(255, 255, 255); filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="359.994" cy="260.302" rx="18.283" ry="18.986"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;30 0" begin="0s" dur="10s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;3" begin="0s" dur="1.5s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_7 = `<?xml version="1.0" encoding="utf-8"?>
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
  <g style="transform-origin: 271.789px 189.503px; filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <path d="M 89.749 184.064 L 91.393 184.064 L 158.281 55.309 L 166.849 120.417 L 203.66 35.834 L 205.176 119.423 L 252.046 18.522 L 254.01 120.017 L 284.592 30.423 L 285.584 100.189 L 323.37 16.358 L 324.828 93.989 L 350.787 41.243 L 351.915 96.232 L 382.705 33.67 L 384.332 113.015 L 412.178 60.719 L 412.178 139.287 L 451.129 99.67 L 421.005 207.555 L 463.573 179.735 L 418.602 279.858 L 466.819 252.228 L 428.305 326.294 L 459.244 327.966 L 411.84 357.956 L 410.556 360.425 L 410.014 359.707 L 410.014 361.508 L 89.749 361.508 C 74.261 378.286 70.691 204.71 89.749 184.064 Z" style="stroke-width: 3px; fill: rgb(145, 255, 172); stroke: rgb(99, 141, 81);"/>
    <g>
      <path stroke="rgb(255,0,0)" d="M 166.718 216.496 C 173.255 216.305 195.842 221.944 200.867 226.309 C 203.762 228.824 203.179 231.326 203.222 234.945 C 203.282 239.86 201.142 249.731 199.297 253.786 C 198.088 256.442 197.583 257.781 194.979 258.888 C 190.847 260.646 176.722 259.605 173.783 259.673 C 172.746 259.698 173.094 259.835 172.213 259.673 C 170.23 259.311 163.454 259.731 160.83 256.141 C 156.915 250.784 155.745 229.452 156.905 223.954 C 157.479 221.235 158.911 220.845 160.438 219.637 C 162.111 218.312 163.3 216.597 166.718 216.496 Z" style="stroke: rgb(129, 151, 57); stroke-width: 3px;"/>
      <path d="M 220.167 221.906 C 219.609 225.719 201.575 226.24 179.887 223.069 C 158.198 219.898 141.068 214.236 141.626 210.423 C 142.183 206.609 159.334 212.131 181.022 215.302 C 202.711 218.472 220.724 218.092 220.167 221.906 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; transform-origin: 180.534px 218.641px;"/>
      <path d="M 140.903 262.611 C 140.93 258.757 158.721 255.756 180.639 255.908 C 202.558 256.06 220.304 259.308 220.277 263.161 C 220.251 267.015 202.503 263.91 180.585 263.757 C 158.666 263.606 140.877 266.465 140.903 262.611 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; transform-origin: 180.608px 260.383px;"/>
      <path stroke="rgb(255,0,0)" d="M 285.087 260.431 C 291.624 260.622 314.211 254.983 319.236 250.618 C 322.131 248.103 321.548 245.601 321.591 241.982 C 321.651 237.067 319.511 227.196 317.666 223.141 C 316.457 220.485 315.952 219.146 313.348 218.039 C 309.216 216.281 295.091 217.322 292.152 217.254 C 291.115 217.229 291.463 217.092 290.582 217.254 C 288.599 217.616 281.823 217.196 279.199 220.786 C 275.284 226.143 274.114 247.475 275.274 252.973 C 275.848 255.692 277.28 256.082 278.807 257.29 C 280.48 258.615 281.669 260.33 285.087 260.431 Z" style="stroke: rgb(129, 151, 57); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000015, -0.000009)"/>
      <path d="M 337.189 215.894 C 336.631 212.081 318.597 211.56 296.909 214.731 C 275.22 217.902 258.09 223.564 258.648 227.377 C 259.205 231.191 276.356 225.669 298.044 222.498 C 319.733 219.328 337.746 219.708 337.189 215.894 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; transform-origin: 297.556px 219.159px;" transform="matrix(-1, 0, 0, -1, -0.000031, 0.000002)"/>
      <path d="M 257.777 258.673 C 257.804 262.527 275.595 265.528 297.513 265.376 C 319.432 265.224 337.178 261.976 337.151 258.123 C 337.125 254.269 319.377 257.374 297.459 257.527 C 275.54 257.678 257.751 254.819 257.777 258.673 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; transform-origin: 297.482px 260.901px;" transform="matrix(-1, 0, 0, -1, 0.00001, 0.000011)"/>
    </g>
    <animateMotion path="M 0 0 L -18.326 34.916" calcMode="linear" begin="0s" dur="10s" fill="freeze" repeatCount="indefinite"/>
    <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;6" dur="1.06s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_8 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="103.634" y1="39.694" x2="103.634" y2="436.478" id="gradient-1" gradientTransform="matrix(0.00377, 0.999995, -0.296052, 0.001116, 149.729022, 137.503452)">
      <stop offset="0" style="stop-color: rgb(255, 195, 144);"/>
      <stop offset="1" style="stop-color: rgb(58.826% 51.922% 45.923%)"/>
    </linearGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="236.251" cy="169.388" r="205.011" id="gradient-0">
      <stop offset="0" style="stop-color: rgb(86.275% 100% 85.49%)"/>
      <stop offset="1" style="stop-color: rgb(45.37% 57.913% 44.904%)"/>
    </radialGradient>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 26 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="26"/>
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
  <g style="transform-origin: 236.251px 242.77px;">
    <ellipse style="stroke-width: 3px; stroke: rgb(139, 100, 45); fill: url(&quot;#gradient-1&quot;); filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="103.634" cy="238.086" rx="226.307" transform="matrix(0.013697, 0.999906, -0.999906, 0.013697, 476.186181, 135.885099)" ry="198.392"/>
    <path style="stroke-width: 3px; stroke: rgb(139, 100, 45); fill: rgb(255, 235, 218); fill-opacity: 0;" d="M 42.712 255.269 C 70.551 245.989 114.95 149.326 118.735 141.755 C 119.701 139.824 127.761 117.224 129.149 116.761 C 134.634 114.933 146.243 123.495 152.06 123.01 C 164.906 121.939 172.501 126.939 185.385 126.134 C 212.58 124.434 240.86 129.965 267.657 125.093 C 286.147 121.731 302.746 117.033 319.727 113.637 C 321.811 113.22 338.094 110.134 339.514 111.554 C 340.278 112.319 340.354 118.878 340.556 119.886 C 342.017 127.193 346.973 136.402 350.97 142.797 C 371.405 175.493 399.342 241.731 438.448 241.731"/>
    <path d="M 40.322 146.962 C 38.967 114.736 430.864 115.316 432.195 146.962 C 445.118 149.931 443.423 218.275 432.195 215.695 C 430.726 197.482 39.109 200.647 40.322 215.695 C 32.141 217.575 24.825 150.522 40.322 146.962 Z" style="stroke-width: 3px; stroke: rgb(139, 100, 45); fill: url(&quot;#gradient-0&quot;); filter: url(&quot;#inner-shadow-filter-1&quot;);"/>
    <path d="M -273.194 -339.506 Q -235.128 -386.09 -197.063 -339.506 L -197.063 -339.506 Q -158.997 -292.922 -235.128 -292.922 L -235.128 -292.922 Q -311.26 -292.922 -273.194 -339.506 Z" bx:shape="triangle -311.26 -386.09 152.263 93.168 0.5 0.5 1@86c4a8f9" style="stroke-width: 3px; stroke: rgb(139, 100, 45); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-0.951866, -0.306514, 0.306515, -0.951866, 405.42914, 622.701533)"/>
    <path d="M -273.194 -339.506 Q -235.128 -386.09 -197.063 -339.506 L -197.063 -339.506 Q -158.997 -292.922 -235.128 -292.922 L -235.128 -292.922 Q -311.26 -292.922 -273.194 -339.506 Z" bx:shape="triangle -311.26 -386.09 152.263 93.168 0.5 0.5 1@86c4a8f9" style="stroke-width: 3px; stroke: rgb(139, 100, 45); transform-origin: -235.128px -327.86px;" transform="matrix(0.951866, -0.306514, -0.306515, -0.951866, 534.59692, 621.293064)"/>
    <g>
      <ellipse style="stroke-width: 3px; stroke: rgb(139, 100, 45);" cx="102.115" cy="325.122" rx="30.509" transform="matrix(0.999222, 0.039443, -0.039443, 0.999222, 24.937383, 11.46922)" ry="8.849"/>
      <ellipse style="stroke-width: 3px; stroke: rgb(139, 100, 45);" cx="102.115" cy="325.122" rx="30.509" transform="matrix(0.999222, 0.039443, -0.039443, 0.999222, 27.344282, 43.157163)" ry="8.849"/>
    </g>
    <g transform="matrix(-1, 0, 0, 1, 470.978281, 3.810349)" style="">
      <ellipse style="stroke-width: 3px; stroke: rgb(139, 100, 45);" cx="102.115" cy="325.122" rx="30.509" transform="matrix(0.999222, 0.039443, -0.039443, 0.999222, 24.937153, 11.468429)" ry="8.849"/>
      <ellipse style="stroke-width: 3px; stroke: rgb(139, 100, 45);" cx="102.115" cy="325.122" rx="30.509" transform="matrix(0.999222, 0.039443, -0.039443, 0.999222, 27.344282, 43.157163)" ry="8.849"/>
    </g>
    <path d="M 292.474 400.536 C 292.474 416.39 264.678 405.213 232.991 405.213 C 201.304 405.213 177.726 416.39 177.726 400.536 C 177.726 384.682 203.413 371.83 235.1 371.83 C 266.787 371.83 292.474 384.682 292.474 400.536 Z" style="stroke-width: 3px; stroke: rgb(139, 100, 45); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.99978, 0.020974, -0.020974, 0.99978, 0, 0)"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;50 0" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;6" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_9 = `<?xml version="1.0" encoding="utf-8"?>
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
    <linearGradient gradientUnits="userSpaceOnUse" x1="244.177" y1="93.199" x2="244.177" y2="420.502" id="gradient-1" gradientTransform="matrix(-0.999967, -0.008141, 0.006363, -0.781802, 488.794262, 371.124711)">
      <stop offset="0" style="stop-color: rgb(100% 94.118% 77.255%)"/>
      <stop offset="1" style="stop-color: rgb(58.282% 53.365% 38.071%)"/>
    </linearGradient>
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
  <g style="transform-origin: 240.231px 247.979px;">
    <path d="M 81.8 128.984 L 398.659 128.984 C 405.576 98.352 404.878 364.787 398.659 392.329 C 402.819 440.585 87.004 452.693 81.8 392.329 C 76.08 311.099 78.242 78.453 81.8 128.984 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); fill: rgb(255, 240, 197); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 121.935 111.381 L 366.269 111.381 C 368.092 122.378 400.533 170.923 366.269 366.98 C 257.902 424.649 232.182 450.845 121.935 366.98 C 100.909 276.186 101.655 23.807 121.935 111.381 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); filter: url(&quot;#inner-shadow-filter-0&quot;); fill: url(&quot;#gradient-1&quot;);"/>
    <path d="M 180.323 158.448 C 131.435 174.553 85.404 168.181 77.509 144.216 C 69.615 120.25 102.847 87.768 151.735 71.664 C 188.343 59.605 223.35 60.148 241.941 71.245 C 261.275 62.214 294.041 62.493 328.203 73.746 C 377.092 89.851 410.324 122.333 402.429 146.298 C 394.535 170.263 348.504 176.635 299.616 160.531 C 273.754 152.012 252.274 138.909 238.945 124.91 C 225.517 138.12 204.898 150.353 180.323 158.448 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); fill: rgb(255, 240, 197); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 72.646 148.844 C 72.646 134.581 408.517 136.861 408.517 148.844 C 418.453 148.844 413.181 208.695 408.517 208.695 C 409.405 223.799 73.634 225.493 72.646 208.695 C 65.914 209.443 62.619 149.958 72.646 148.844 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); fill: rgb(255, 197, 197); filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-1&quot;);"/>
    <path d="M 171.865 352.672 C 171.434 358.444 160.525 362.335 147.497 361.363 C 134.469 360.391 124.258 354.923 124.688 349.152 C 125.119 343.38 136.029 339.489 149.057 340.461 C 162.085 341.433 172.296 346.9 171.865 352.672 Z M 168.696 321.338 C 168.266 327.11 157.356 331.001 144.328 330.029 C 131.3 329.057 121.089 323.59 121.519 317.818 C 121.95 312.046 132.86 308.155 145.888 309.127 C 158.916 310.099 169.127 315.567 168.696 321.338 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 365.678 321.513 C 365.247 315.741 354.338 311.85 341.31 312.822 C 328.282 313.794 318.071 319.262 318.501 325.033 C 318.932 330.805 329.842 334.696 342.87 333.724 C 355.898 332.752 366.109 327.285 365.678 321.513 Z M 362.509 352.847 C 362.079 347.075 351.169 343.184 338.141 344.156 C 325.113 345.128 314.902 350.595 315.332 356.367 C 315.763 362.139 326.673 366.03 339.701 365.058 C 352.729 364.086 362.94 358.618 362.509 352.847 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 340.505px 338.94px;" transform="matrix(-1, 0, 0, -1, -0.000032, -0.000011)"/>
    <path d="M 281.357 371.331 C 281.357 379.498 264.407 376.26 242.63 376.26 C 220.853 376.26 202.495 379.498 202.495 371.331 C 202.495 363.164 220.149 356.544 241.926 356.544 C 263.703 356.544 281.357 363.164 281.357 371.331 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <path d="M 247.553 274.966 C 249.613 278.468 258.543 277.277 269.652 272.589 C 266.684 277.077 265.048 283.025 265.426 289.446 C 266.204 302.667 275.224 312.893 285.574 312.283 C 295.923 311.675 303.683 300.463 302.906 287.24 C 302.189 275.07 294.49 265.438 285.198 264.459 C 300.264 255.076 310.072 244.295 307.404 239.76 C 304.585 234.968 288.902 238.963 272.374 248.685 C 255.847 258.407 244.734 270.174 247.553 274.966 Z M 208.878 247.844 C 192.351 238.122 176.668 234.126 173.848 238.918 C 171.18 243.454 180.988 254.234 196.053 263.617 C 186.763 264.598 179.064 274.229 178.348 286.398 C 177.571 299.62 185.33 310.832 195.68 311.441 C 206.029 312.05 215.05 301.826 215.828 288.602 C 216.205 282.183 214.571 276.237 211.603 271.748 C 222.711 276.437 231.639 277.627 233.699 274.125 C 236.518 269.332 225.406 257.566 208.878 247.844 Z" style="stroke-width: 3px; stroke: rgb(151, 100, 45); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <animateMotion path="M 0 0 L 100 0" calcMode="linear" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1" keyPoints="0; 0.54"/>
    <animateTransform type="skewX" additive="sum" attributeName="transform" values="0;-6" begin="0s" dur="4.3s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
</svg>`; // Mapped to the same phase as CHAR_SVG_8
    const HEXAGON_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="700" xmlns="http://www.w3.org/2000/svg" viewBox="15.108 0 484.892 607.377" width="700" xmlns:bx="https://boxy-svg.com">
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
</svg>`;

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    const NPC_DATA = {
        // Phase 0: Map 1 - Two NPCs for the starting phase
        0: [
            { char_id: 'CHAR_1_AngryBird', name: 'Angry Bird', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Angry Bird: CAW! Get out! This forest is not for the living!", "Angry Bird: The trees are watching you..."] },
            { char_id: 'CHAR_2_AngryTree', name: 'Angry Tree', svg_content: CHAR_SVG_2, initial_x: 550, dialogue: ["Angry Tree: GRUMBLE. Each step you take poisons the ground!", "Angry Tree: Only the Hexagon Fairy can cleanse this place."] }
        ],
        1: { char_id: 'CHAR_3_BadAnt', name: 'Bad Ant', svg_content: CHAR_SVG_3, initial_x: 400, dialogue: ["Bad Ant: We crawl where the toxins flow. Keep up, human!", "Bad Ant: The queen is just beyond the next dark grove."] },
        2: { char_id: 'CHAR_4_QueenBee', name: 'Queen Bee', svg_content: CHAR_SVG_4, initial_x: 650, dialogue: ["Queen Bee: BZZZ! My hive's honey is now poisonous!", "Queen Bee: The spider's web blocks the path to the south."] },
        3: { char_id: 'CHAR_5_RageSpider', name: 'Rage Spider', svg_content: CHAR_SVG_5, initial_x: 250, dialogue: ["Rage Spider: SSSS! Tangled in my web, are you? Too bad!", "Rage Spider: The ground is thin here. Be careful when you jump."] },
        4: { char_id: 'CHAR_6_ScaredGuy', name: 'Scared Guy', svg_content: CHAR_SVG_6, initial_x: 450, dialogue: ["Scared Guy: H-h-help! Everything here is hostile!", "Scared Guy: I think I saw a talking bush up ahead!"] },
        5: { char_id: 'CHAR_7_StrangeArbust', name: 'Strange Arbust', svg_content: CHAR_SVG_7, initial_x: 500, dialogue: ["Strange Arbust: I am a sentient shrub, and I hate your kind!", "Strange Arbust: You are nearing the heart of the forest's corruption."] },
        6: { char_id: 'CHAR_8_ToxicMan', name: 'Toxic Man', svg_content: CHAR_SVG_8, initial_x: 300, dialogue: ["Toxic Man: I embody the poison. Don't breathe too deep!", "Toxic Man: My wife is waiting at the next checkpoint, if you survive my fumes."] },
        7: { char_id: 'CHAR_9_ToxicWoman', name: 'Toxic Woman', svg_content: CHAR_SVG_9, initial_x: 600, dialogue: ["Toxic Woman: Together, we rule the pollution of this wood!", "Toxic Woman: The final clearing is just a sprint away. Don't look back!"] },
        8: { char_id: 'HEXAGON_FAIRY', name: 'Hexagon Fairy', svg_content: HEXAGON_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Hexagon Fairy: You have survived the perils of the Toxic Forest.", "Hexagon Fairy: Your strength is proven. This contamination will not harm you now.", "Hexagon Fairy: Toxic Forest conquered. Go forth!"] },
    };

    const MAX_TRANSITIONS = 8; // 8 transitions (Map 1 -> 2 -> ... -> 9). Total 9 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Toxic Sky/Air Gradient (Muted, sickly green/brown) -->
    <linearGradient id="toxicSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 110, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 130, 100);stop-opacity:1" />
    </linearGradient>
    <!-- Toxic Ground/Dirt Gradient -->
    <linearGradient id="toxicGroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(70, 90, 70);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(90, 120, 90);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Air (Muted Green/Brown) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#toxicSkyGradient)" />

  <!-- 2. Distant Hills/Forest (Darker silhouette) -->
  <path d="M0 300 Q200 250, 400 300 T800 280 V500 H0 Z"
        fill="rgb(50, 80, 50)" />

  <!-- 3. Foreground Ground (Toxic Dirt Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#toxicGroundGradient)" />

  <!-- 4. Dead/Contaminated Trees (Bare silhouettes) -->
  <g fill="rgb(80, 50, 30)" opacity="0.8">
    <!-- Tree 1 -->
    <rect x="150" y="350" width="10" height="100" />
    <path d="M155 350 L140 320 L170 320 Z" />
    <!-- Tree 2 -->
    <rect x="400" y="380" width="8" height="70" />
    <path d="M404 380 L395 360 L413 360 Z" />
    <!-- Tree 3 -->
    <rect x="650" y="370" width="12" height="80" />
    <path d="M656 370 L640 340 L672 340 Z" />
  </g>

  <!-- 5. Toxic Fog/Mist (Low ground green glow/effect) -->
  <rect x="0" y="400" width="800" height="50" fill="rgb(46, 204, 113)" opacity="0.1" />

  <!-- 6. Small Toxic Plant/Glow (Foreground detail) -->
  <circle cx="100" cy="440" r="10" fill="rgb(46, 204, 113)" opacity="0.5" />
  <path d="M250 450 V430 L260 440 L250 450 Z" fill="rgb(0, 150, 0)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Toxic Sky/Air Gradient (Muted, sickly green/brown - Consistent) -->
    <linearGradient id="toxicSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 110, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 130, 100);stop-opacity:1" />
    </linearGradient>
    <!-- Toxic Ground/Dirt Gradient (More exposed dirt) -->
    <linearGradient id="exposedDirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 90, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 110, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Air -->
  <rect x="0" y="0" width="800" height="500" fill="url(#toxicSkyGradient)" />

  <!-- 2. Distant Hills/Forest (Silhouette) -->
  <path d="M0 300 Q200 250, 400 300 T800 280 V500 H0 Z"
        fill="rgb(50, 80, 50)" />

  <!-- 3. Foreground Ground (Exposed, toxic dirt) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#exposedDirtGradient)" />

  <!-- 4. Abandoned House/Cottage (Background Feature) -->
  <g transform="translate(600, 350) scale(0.6)">
    <!-- Main Body -->
    <rect x="-50" y="-50" width="100" height="80" fill="rgb(220, 200, 150)" stroke="rgb(150, 130, 80)" stroke-width="2" />
    <!-- Roof (Thatch/Straw color) -->
    <polygon points="-60,-50 60,-50 0,-100" fill="rgb(180, 160, 100)" stroke="rgb(150, 130, 80)" stroke-width="2" />
    <!-- Chimney & Smoke -->
    <rect x="30" y="-80" width="10" height="30" fill="rgb(100, 80, 60)" />
    <circle cx="35" cy="-85" r="10" fill="rgb(180, 180, 180)" opacity="0.6" />
  </g>

  <!-- 5. Dead/Contaminated Trees (Scattered, less dense) -->
  <g fill="rgb(80, 50, 30)" opacity="0.8">
    <rect x="100" y="380" width="8" height="70" />
    <rect x="250" y="360" width="10" height="90" />
    <rect x="500" y="400" width="6" height="50" />
    <rect x="700" y="390" width="10" height="60" />
  </g>

  <!-- 6. Toxic Puddle/Sludge (Low spot on the ground) -->
  <ellipse cx="400" cy="450" rx="60" ry="15" fill="rgb(46, 204, 113)" opacity="0.7" />

  <!-- 7. Toxic Plants (Spiky green shapes) -->
  <path d="M150 450 V430 L160 440 L150 450 Z" fill="rgb(0, 150, 0)" />
  <rect x="750" y="435" width="20" height="15" fill="rgb(0, 180, 0)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Forest Sky/Air Gradient (Darker, more somber) -->
    <linearGradient id="darkForestSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(50, 70, 50);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(70, 90, 70);stop-opacity:1" />
    </linearGradient>
    <!-- Irregular Toxic Ground Gradient (More uneven dirt/rock) -->
    <linearGradient id="irregularToxicGround" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 100, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 120, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Air -->
  <rect x="0" y="0" width="800" height="500" fill="url(#darkForestSkyGradient)" />

  <!-- 2. Distant Hills/Forest (Very dark, oppressive silhouette) -->
  <path d="M0 350 Q200 300, 400 350 T800 320 V500 H0 Z"
        fill="rgb(30, 50, 30)" />

  <!-- 3. Toxic Fog Layer (Low opacity green/white layer) -->
  <rect x="0" y="300" width="800" height="150" fill="rgb(46, 204, 113)" opacity="0.15" />

  <!-- 4. Foreground Ground (Irregular platform shape for variation) -->
  <path d="M0 450 H800 V400 Q600 420, 400 400 Q200 420, 0 400 Z"
        fill="url(#irregularToxicGround)" />

  <!-- 5. Very Dead/Shriveled Trees (Closer to the foreground) -->
  <g fill="rgb(60, 40, 20)" opacity="0.9">
    <!-- Tree 1 (Left) -->
    <rect x="150" y="350" width="10" height="100" />
    <path d="M155 350 Q145 320, 155 330 Q165 320, 155 350 Z" />
    <!-- Tree 2 (Right) -->
    <rect x="600" y="380" width="8" height="70" />
    <path d="M604 380 Q595 360, 604 370 Q613 360, 604 380 Z" />
  </g>

  <!-- 6. Toxic Mushrooms/Fungi (Ground Detail) -->
  <g transform="translate(300, 440)" fill="rgb(150, 0, 150)" opacity="0.7">
    <rect x="-5" y="-10" width="10" height="10" />
    <ellipse cx="0" cy="-10" rx="15" ry="5" />
  </g>
  <g transform="translate(500, 440)" fill="rgb(46, 204, 113)" opacity="0.9">
    <rect x="-5" y="-15" width="10" height="15" />
    <ellipse cx="0" cy="-15" rx="18" ry="7" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Swamp Sky Gradient (Darker and more oppressive) -->
    <linearGradient id="swampSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(40, 50, 40);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(60, 70, 60);stop-opacity:1" />
    </linearGradient>
    <!-- Swamp Water/Sludge Gradient (Dark, murky green) -->
    <linearGradient id="swampWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(30, 60, 50);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(20, 50, 40);stop-opacity:1" />
    </linearGradient>
    <!-- Solid Ground Platform (Rock/Dry patch) -->
    <linearGradient id="dryPatchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 100, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 80, 60);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Air -->
  <rect x="0" y="0" width="800" height="500" fill="url(#swampSkyGradient)" />

  <!-- 2. Distant Hills/Forest (Very dark, foggy silhouette) -->
  <path d="M0 350 Q200 300, 400 350 T800 320 V500 H0 Z"
        fill="rgb(20, 30, 20)" />

  <!-- 3. Swamp Water (The main foreground) -->
  <rect x="0" y="400" width="800" height="100" fill="url(#swampWaterGradient)" />

  <!-- 4. Dry Platform Patch (The jumpable platform at Y=450) -->
  <rect x="100" y="430" width="600" height="20" fill="url(#dryPatchGradient)" />
  <rect x="100" y="450" width="600" height="50" fill="url(#dryPatchGradient)" />

  <!-- 5. Swamp Bubbles (Toxic air rising) -->
  <g fill="rgb(46, 204, 113)" opacity="0.6">
    <circle cx="50" cy="480" r="5">
        <animate attributeName="cy" values="480;420" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.1" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="750" cy="460" r="8">
        <animate attributeName="cy" values="460;380" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.1" dur="4s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- 6. Dead Swamp Trees/Roots emerging from water -->
  <g fill="rgb(80, 50, 30)" opacity="0.9">
    <rect x="300" y="300" width="10" height="150" />
    <rect x="500" y="350" width="15" height="100" />
    <path d="M295 450 L315 450 L305 400 Z" />
    <path d="M495 450 L520 450 L507 410 Z" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Canopy Shadow Sky (Very dark, little light penetrates) -->
    <linearGradient id="canopySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(30, 40, 30);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(50, 60, 50);stop-opacity:1" />
    </linearGradient>
    <!-- Forest Floor Gradient (Dark, damp earth) -->
    <linearGradient id="forestFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(70, 60, 50);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(90, 80, 70);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Canopy Shadow -->
  <rect x="0" y="0" width="800" height="500" fill="url(#canopySkyGradient)" />

  <!-- 2. Distant Trees/Shadows (Implied background density) -->
  <path d="M0 300 Q200 250, 400 300 T800 280 V500 H0 Z"
        fill="rgb(10, 20, 10)" />

  <!-- 3. Foreground Ground (Damp Earth Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#forestFloorGradient)" />

  <!-- 4. Giant Hollow Tree/Nest Structure (Centerpiece) -->
  <g transform="translate(400, 450)">
    <!-- Tree Trunk (Hollow log look) -->
    <rect x="-150" y="-300" width="300" height="300" fill="rgb(120, 90, 60)" stroke="rgb(80, 60, 40)" stroke-width="5" rx="20" ry="20" />
    <!-- Hollow Opening/Entrance (Dark interior) -->
    <ellipse cx="0" cy="-150" rx="100" ry="120" fill="rgb(20, 10, 0)" />
    <!-- Moss/Fungi on the tree -->
    <circle cx="-100" cy="-50" r="20" fill="rgb(40, 120, 40)" opacity="0.8" />
    <circle cx="100" cy="-100" r="30" fill="rgb(46, 204, 113)" opacity="0.6" />

    <!-- Rough Webbing/Nest Texture (For spider/bee theme) -->
    <g stroke="white" stroke-width="1" opacity="0.4" fill="none">
        <path d="M-100 -50 Q-50 -100, 0 -50 Q50 -100, 100 -50" />
        <path d="M-100 -20 Q0 -70, 100 -20" />
    </g>
  </g>

  <!-- 5. Roots/Obstacles (Small bumps on the ground) -->
  <ellipse cx="100" cy="450" rx="40" ry="10" fill="rgb(80, 60, 40)" />
  <ellipse cx="700" cy="450" rx="30" ry="8" fill="rgb(80, 60, 40)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cave/Underground Sky Gradient (Cool Gray/Stone) -->
    <linearGradient id="caveSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 80, 90);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 100, 110);stop-opacity:1" />
    </linearGradient>
    <!-- Cave Floor/Rock Gradient -->
    <linearGradient id="caveFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 120, 120);stop-opacity:1" />
    </linearGradient>
    <!-- Toxic Green Light/Glow (Source of the light in the cave) -->
    <radialGradient id="toxicLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(46, 204, 113);stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:rgb(46, 204, 113);stop-opacity:0.1"/>
    </radialGradient>
  </defs>

  <!-- 1. Cave Ceiling/Walls -->
  <rect x="0" y="0" width="800" height="500" fill="url(#caveSkyGradient)" />

  <!-- 2. Cave Opening Silhouette (Background opening) -->
  <path d="M0 300 C150 200, 650 200, 800 300 V500 H0 Z"
        fill="rgb(60, 60, 60)" />

  <!-- 3. Toxic Light Source/Glow (Center back) -->
  <circle cx="400" cy="250" r="150" fill="url(#toxicLight)" />

  <!-- 4. Cave Walls (Foreground dark silhouettes) -->
  <path d="M0 500 V100 C100 50, 200 150, 300 100 L300 500 Z"
        fill="rgb(30, 30, 30)" />
  <path d="M800 500 V150 C700 80, 600 180, 500 130 L500 500 Z"
        fill="rgb(30, 30, 30)" />

  <!-- 5. Foreground Cave Floor (Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#caveFloorGradient)" />

  <!-- 6. Toxic Pool/Seepage (Foreground detail on the platform) -->
  <ellipse cx="400" cy="460" rx="100" ry="20" fill="rgb(46, 204, 113)" opacity="0.8" />

  <!-- 7. Small Toxic Crystal/Rock Formations -->
  <g transform="translate(150, 450)" fill="rgb(46, 204, 113)" opacity="0.9">
    <polygon points="0,0 15,-30 30,0" />
  </g>
  <g transform="translate(650, 450)" fill="rgb(46, 204, 113)" opacity="0.9">
    <polygon points="0,0 20,-40 40,0" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Muted Sky/Glow Gradient (Glimmer of unhealthy light) -->
    <linearGradient id="mutedSkyGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 150, 120);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 180, 150);stop-opacity:1" />
    </linearGradient>
    <!-- Forest Floor Gradient (Mossy/Damp) -->
    <linearGradient id="mossyFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 100, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 120, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Air -->
  <rect x="0" y="0" width="800" height="500" fill="url(#mutedSkyGlowGradient)" />

  <!-- 2. Dense Tree Line/Canopy (Dark silhouette surrounding the clearing) -->
  <path d="M0 300 C150 200, 650 200, 800 300 V500 H0 Z"
        fill="rgb(30, 50, 30)" />

  <!-- 3. Small Opening/Glimpse of sky (Fainter light) -->
  <ellipse cx="400" cy="150" rx="150" ry="80" fill="rgb(200, 255, 200)" opacity="0.1" />

  <!-- 4. Foreground Ground (Mossy Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#mossyFloorGradient)" />

  <!-- 5. Toxic Vines/Roots (Closer details) -->
  <g fill="rgb(46, 204, 113)" opacity="0.7">
    <!-- Vine left -->
    <path d="M100 450 Q120 400, 140 450" stroke="rgb(46, 204, 113)" stroke-width="3" fill="none" />
    <!-- Vine right -->
    <path d="M700 450 Q680 400, 660 450" stroke="rgb(46, 204, 113)" stroke-width="3" fill="none" />
  </g>

  <!-- 6. Dead Logs/Wood (Obstacle/Detail) -->
  <rect x="350" y="430" width="100" height="20" fill="rgb(100, 80, 60)" rx="5" ry="5" />

  <!-- 7. Toxic Gas Cloud (Low-level movement across the floor) -->
  <path d="M0 450 Q200 448, 400 450 T800 448" fill="rgb(46, 204, 113)" opacity="0.15">
    <animateMotion dur="15s" repeatCount="indefinite" path="M0,0 C 100,5, 100,-5, 0,0" />
  </path>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_8 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sky/Canopy Gradient (Deepest, most ominous violet/black) -->
    <linearGradient id="deepCorruptionSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(30, 0, 30);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(50, 20, 50);stop-opacity:1" />
    </linearGradient>
    <!-- Toxic Water/Sludge Gradient (Murky purple/green) -->
    <linearGradient id="toxicSludgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(60, 0, 60);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(30, 50, 30);stop-opacity:1" />
    </linearGradient>
    <!-- Central Rock Platform (Small island in the sludge) -->
    <linearGradient id="sludgeIslandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 80, 60);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky/Canopy -->
  <rect x="0" y="0" width="800" height="500" fill="url(#deepCorruptionSkyGradient)" />

  <!-- 2. Distant Trees (Solid black, looming silhouette) -->
  <path d="M0 350 C150 250, 650 250, 800 350 V500 H0 Z"
        fill="rgb(0, 0, 0)" />

  <!-- 3. Toxic Sludge/Water (Main foreground level) -->
  <rect x="0" y="400" width="800" height="100" fill="url(#toxicSludgeGradient)" />

  <!-- 4. Central Rock Platform (The only dry ground) -->
  <rect x="150" y="430" width="500" height="20" fill="url(#sludgeIslandGradient)" />
  <rect x="150" y="450" width="500" height="50" fill="url(#sludgeIslandGradient)" />

  <!-- 5. Toxic Gas Rising (Green glow/fog over the sludge) -->
  <g fill="rgb(46, 204, 113)" opacity="0.4">
    <ellipse cx="100" cy="420" rx="50" ry="10" />
    <ellipse cx="700" cy="410" rx="80" ry="15" />
    <circle cx="400" cy="400" r="10" fill="white">
        <animate attributeName="cy" values="400;350" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- 6. Dead Roots/Snags in the water -->
  <rect x="50" y="380" width="8" height="70" fill="rgb(80, 50, 30)" />
  <rect x="750" y="360" width="10" height="90" fill="rgb(80, 50, 30)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_9 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Purification Chamber Sky Gradient (Bright Green/White Light) -->
    <linearGradient id="purificationSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 255, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 255, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Altar Stone Gradient (Clean, white/light gray stone) -->
    <linearGradient id="altarStoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 200, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 220, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Hexagon Energy Glow (Bright Toxic Green) -->
    <radialGradient id="hexagonGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(46, 204, 113);stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(46, 204, 113);stop-opacity:0.3"/>
    </radialGradient>
  </defs>

  <!-- 1. Sky/Energy Field -->
  <rect x="0" y="0" width="800" height="500" fill="url(#purificationSkyGradient)" />

  <!-- 2. Distant Forest Edge (Cleaned silhouette) -->
  <path d="M0 350 C150 250, 650 250, 800 350 V500 H0 Z"
        fill="rgb(50, 80, 50)" />

  <!-- 3. Central Altar Platform (The base for the Fairy) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#altarStoneGradient)" />

  <!-- 4. Energy Center (Hexagon Glow) -->
  <circle cx="400" cy="300" r="100" fill="url(#hexagonGlow)" opacity="0.6"/>
  <circle cx="400" cy="300" r="50" fill="rgb(46, 204, 113)" opacity="0.8"/>

  <!-- 5. Hexagon Symbol (The core of the magic, background detail) -->
  <g transform="translate(400, 300) rotate(90)" stroke="rgb(255, 255, 255)" stroke-width="2" fill="none" opacity="0.8">
    <path d="M -50 -86.6 L 50 -86.6 L 100 0 L 50 86.6 L -50 86.6 L -100 0 Z" />
  </g>

  <!-- 6. Side Stone Pillars (Guarding the altar) -->
  <rect x="100" y="300" width="40" height="150" fill="rgb(180, 180, 180)" stroke="rgb(150, 150, 150)" stroke-width="2" />
  <rect x="660" y="300" width="40" height="150" fill="rgb(180, 180, 180)" stroke="rgb(150, 150, 150)" stroke-width="2" />

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
            background-color: #7f8c8d; /* Gray/Industrial/Toxic Color */
            color: white;
            border: 2px solid #2ecc71; /* Toxic Green Border */
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(46, 204, 113, 0.7);
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

        // Custom style for the Toxic Forest dialogue box (dark gray/toxic green theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(44, 62, 80, 0.9); /* Dark Forest/Asphalt */
            border: 5px solid #2ecc71; /* Toxic Green Border */
            box-shadow: 0 0 20px rgba(46, 204, 113, 0.7);
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

        // Final Level Completion Check (Hexagon Fairy is only NPC in phase 8)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:#2ecc71; font-size:36px; text-align:center; font-family: Arial, sans-serif; text-shadow: 0 0 10px #2ecc71;">
                    LEVEL COMPLETE!<br>The Toxic Forest could not stop you.
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
            background-color: #7f8c8d;
            color: white;
            border: 4px solid #2ecc71;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(46, 204, 113, 0.7);
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