// ==UserScript==
// @name         Drawaria Game Level 7 - Cold Passages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 7: Cold Passages. Traverse the freezing icy caverns, meeting unique, multiplying characters.
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

    const LEVEL_TITLE = "Cold Passages";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-cold.mp3";
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
<svg height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="243.428" y1="128.946" x2="243.428" y2="488.232" id="gradient-0" gradientTransform="matrix(-0.999202, 0.039959, -0.011187, -0.279745, 488.10427, 368.307736)">
      <stop offset="0" style="stop-color: rgb(84.706% 82.745% 58.039%)"/>
      <stop offset="1" style="stop-color: rgb(48.849% 47.669% 24.914%)"/>
    </linearGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="433.518" cy="435.826" r="32.791" id="gradient-3" gradientTransform="matrix(3.843631, 0.079564, -0.053167, 2.568434, -1209.593106, -718.056588)">
      <stop offset="0" style="stop-color: rgb(84.706% 82.745% 58.039%)"/>
      <stop offset="1" style="stop-color: rgb(48.849% 47.669% 24.914%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="68.393" cy="435.09" r="32.791" id="gradient-4" gradientTransform="matrix(6.077309, -0.091903, 0.040046, 2.648098, -364.675869, -710.785376)">
      <stop offset="0" style="stop-color: rgb(84.706% 82.745% 58.039%)"/>
      <stop offset="1" style="stop-color: rgb(48.849% 47.669% 24.914%)"/>
    </radialGradient>
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
  <g style="filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 248.664px 269.065px;" transform="matrix(1, 0, 0, 1, 0, -0.06)">
    <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-0&quot;);" cx="243.428" cy="308.589" rx="158.295" ry="179.643"/>
    <path d="M -70.976 213.08 L 2.712 351.969 L -70.976 351.969 L -70.976 213.08 Z" bx:shape="triangle -70.976 213.08 73.688 138.889 0 0 1@3a6989c7" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(216, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.86785, 0.496827, 0.505002, -0.86317, 158.93172, -150.959687)"/>
    <path d="M 127.712 51.86 C 148.936 31.601 396.058 174.454 374.054 195.458 L 109.718 192.759 L 127.712 51.86 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(216, 0, 0);"/>
    <path d="M 140.852 245.418 C 127.753 245.975 116.585 237.563 114.66 226.208 C 104.353 224.503 96.357 216.322 95.925 206.156 C 95.424 194.389 105.243 184.413 117.864 183.854 C 121.216 175.117 129.366 168.773 139.139 168.358 C 147.896 167.985 155.758 172.465 160.235 179.46 C 164.394 173.863 170.875 170.135 178.289 169.82 C 185.371 169.519 191.867 172.39 196.461 177.2 C 201.145 171.078 208.579 166.969 217.096 166.606 C 226.923 166.189 235.734 170.863 240.758 178.19 C 244.892 172.256 251.571 168.267 259.252 167.941 C 267.449 167.592 274.863 171.496 279.449 177.734 C 283.975 173.511 290.069 170.8 296.865 170.511 C 306.575 170.098 315.281 174.733 320.228 181.99 C 324.368 176.123 331.008 172.186 338.637 171.862 C 350.708 171.349 361.079 180.056 363.224 191.858 C 364.232 191.687 365.263 191.577 366.314 191.532 C 378.957 190.994 389.611 200.108 390.112 211.888 C 390.613 223.669 380.771 233.654 368.128 234.191 C 366.463 234.262 364.832 234.165 363.255 233.917 C 359.742 242.311 350.92 248.473 340.35 248.923 C 331.665 249.292 323.829 245.718 318.973 239.958 C 314.534 244.314 308.256 247.161 301.2 247.461 C 291.945 247.854 283.653 243.77 278.905 237.334 C 274.457 241.783 268.11 244.698 260.965 245.002 C 252.28 245.371 244.444 241.797 239.588 236.037 C 235.149 240.393 228.871 243.239 221.814 243.539 C 213.51 243.892 205.981 240.64 201.092 235.318 C 196.845 241.91 189.066 246.495 180.003 246.881 C 171.317 247.25 163.481 243.676 158.625 237.916 C 154.186 242.272 147.909 245.118 140.852 245.418 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(255, 255, 255);"/>
    <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: rgb(255, 255, 255);" cx="52.181" cy="179.03" rx="21.001" ry="21.37"/>
    <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-4&quot;);" cx="68.393" cy="435.09" rx="32.791" ry="31.686">
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;40 -30" begin="0s" dur="5s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </ellipse>
    <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-3&quot;);" cx="433.518" cy="435.826" rx="32.791" ry="31.686">
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-40 -30" dur="5s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </ellipse>
    <path d="M 156.817 318.662 Q 184.451 272.975 212.084 318.662 L 212.084 318.662 Q 239.717 364.348 184.45 364.348 L 184.45 364.348 Q 129.184 364.348 156.817 318.662 Z" bx:shape="triangle 129.184 272.975 110.533 91.373 0.5 0.5 1@add76a3b" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    <path d="M 257.035 317.557 Q 284.669 271.87 312.302 317.557 L 312.302 317.557 Q 339.935 363.243 284.669 363.243 L 284.669 363.243 Q 229.402 363.243 257.035 317.557 Z" bx:shape="triangle 229.402 271.87 110.533 91.373 0.5 0.5 1@8cd4b924" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    <path d="M 288.353 395.737 C 288.353 409.981 284.584 425.212 242.666 425.212 C 200.748 425.212 190.347 405.559 190.347 391.315 C 190.347 377.071 200.748 396.473 242.666 396.473 C 284.584 396.473 288.353 381.493 288.353 395.737 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    <path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 3px;" d="M 87.183 281.52 C 98.726 273.227 111.748 264.808 124.54 259.294 C 131.616 256.244 138.609 251.309 143.474 248.688 C 146.754 246.92 157.665 242.023 157.665 239.237"/>
    <path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 3px;" d="M 345.092 248.36 C 353.485 256.956 361.175 265.445 370.604 273.721 C 381.038 282.88 393.984 289.983 400.617 296.775"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -30" begin="0s" dur="5s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-4" begin="0.02s" dur="5s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100" xmlns:bx="https://boxy-svg.com">
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
  <g style="transform-origin: 209.672px 279.901px;">
    <path style="stroke: rgb(171, 43, 185); stroke-width: 3px; fill: rgb(207, 126, 216); filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 209.672px 321.34px;" d="M 177.795 240.51 C 167.979 243.781 156.445 239.392 145.867 241.507 C 132.204 244.24 118.327 251.688 111.943 264.455 C 110.962 266.417 106.398 274.875 108.95 277.426 C 115.931 284.407 132.244 287.953 142.873 284.41 C 149.497 282.202 162.399 279.56 165.822 286.406 C 168.049 290.86 164.254 304.079 162.828 308.356 C 160.48 315.4 162.638 324.084 160.833 331.304 C 156.692 347.869 153.691 384.027 165.822 396.158 C 182.157 412.492 197.692 376.289 203.736 367.223 C 205.318 364.851 214.975 355.514 217.705 358.243 C 220.066 360.605 222.675 362.196 224.689 366.225 C 228.431 373.708 229.855 408.541 244.644 401.146 C 265.135 390.901 270.475 351.813 264.599 328.311 C 262.976 321.818 259.295 303.999 262.604 297.381 C 265.375 291.838 275.012 295.906 279.566 294.388 C 290.805 290.641 304.698 290.019 310.496 278.424 C 315.555 268.305 290.221 258.904 285.23 256.408 C 278.92 253.253 250.767 252.491 246.703 248.427 C 243.983 245.707 193.212 241.121 177.086 241.121"/>
    <ellipse style="stroke: rgb(171, 43, 185); stroke-width: 3px; fill: rgb(207, 126, 216); filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="221.43" cy="207.101" rx="51.03" ry="49.468"/>
    <path d="M 256.031 218.14 C 256.031 229.376 243.183 238.483 227.332 238.483 C 211.482 238.483 198.633 229.376 198.633 218.14 C 198.633 206.904 211.482 221.878 227.332 221.878 C 243.183 221.878 256.031 206.904 256.031 218.14 Z" style="stroke: rgb(171, 43, 185); stroke-width: 3px; fill: rgb(207, 126, 216); filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <ellipse style="stroke: rgb(171, 43, 185); stroke-width: 3px; filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="211.412" cy="197.845" rx="10.265" ry="10.055"/>
    <ellipse style="stroke: rgb(171, 43, 185); stroke-width: 3px; filter: url(&quot;#inner-shadow-filter-0&quot;);" cx="245.138" cy="196.168" rx="10.265" ry="10.055"/>
    <path d="M 248.699 224.132 C 248.699 228.649 239.602 232.31 228.379 232.31 C 217.156 232.31 208.059 228.649 208.059 224.132 C 208.059 219.614 217.156 225.634 228.379 225.634 C 239.602 225.634 248.699 219.614 248.699 224.132 Z" style="stroke: rgb(171, 43, 185); stroke-width: 3px; filter: url(&quot;#inner-shadow-filter-0&quot;);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;80 0" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="20.458 15.31 498.529 558.926" width="129px" height="117px" xmlns:bx="https://boxy-svg.com">
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
    <filter id="filter-1" bx:preset="inner-shadow 1 0 0 10 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
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
  <g style="filter: url(&quot;#inner-shadow-filter-0&quot;); transform-origin: 271.069px 295.436px;" transform="matrix(0.965926, -0.258818, 0.25882, 0.965926, 0.000002, -0.000004)">
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="275.765" cy="172.969" rx="84.893" ry="80.737"/>
    <path d="M 324.048 296.481 C 325.709 296.613 327.786 296.438 330.468 295.313 C 334.617 293.573 342.699 284.193 346.809 284.808 C 350.305 285.332 351.794 293.526 354.396 295.313 C 356.303 296.623 358.313 296.842 360.233 296.481 C 362.305 296.091 365.113 294.717 366.361 292.687 C 367.782 290.374 368.303 285.779 367.528 282.766 C 366.751 279.747 360 278.391 361.692 274.595 C 365.654 265.7 425.727 239.089 433.477 230.24 C 436.465 226.829 435.636 224.889 435.228 222.653 C 434.844 220.545 433.296 218.243 431.435 217.109 C 429.414 215.877 427.881 214.623 423.264 215.941 C 411.7 219.242 366.493 259.021 352.937 257.962 C 344.824 257.328 343.277 242.382 339.222 239.87 C 336.685 238.298 334.246 238.703 332.219 239.286 C 330.285 239.843 328.3 241.221 327.258 243.08 C 326.061 245.214 325.301 248.528 326.091 251.834 C 327.136 256.212 336.338 262.529 335.429 267.008 C 334.468 271.739 322.008 275.109 319.087 279.264 C 316.925 282.339 316.314 285.855 316.753 288.602 C 317.161 291.155 319.697 294.067 321.13 295.313 C 322.115 296.171 322.808 296.382 324.048 296.481 Z" style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122); transform-origin: 376.135px 256.008px;" transform="matrix(-1, 0, 0, -1, -0.000048, 0.000011)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="273.39" cy="304.761" rx="92.017" ry="83.112"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="279.326" cy="446.644" rx="112.202" ry="105.077"/>
    <path d="M 113.917 201.137 C 115.578 201.005 117.655 201.18 120.337 202.305 C 124.486 204.045 132.568 213.425 136.678 212.81 C 140.174 212.286 141.663 204.092 144.265 202.305 C 146.172 200.995 148.182 200.776 150.102 201.137 C 152.174 201.527 154.982 202.901 156.23 204.931 C 157.651 207.244 158.172 211.839 157.397 214.852 C 156.62 217.871 149.869 219.227 151.561 223.023 C 155.523 231.918 215.596 258.529 223.346 267.378 C 226.334 270.789 225.505 272.729 225.097 274.965 C 224.713 277.073 223.165 279.375 221.304 280.509 C 219.283 281.741 217.75 282.995 213.133 281.677 C 201.569 278.376 156.362 238.597 142.806 239.656 C 134.693 240.29 133.146 255.236 129.091 257.748 C 126.554 259.32 124.115 258.915 122.088 258.332 C 120.154 257.775 118.169 256.397 117.127 254.538 C 115.93 252.404 115.17 249.09 115.96 245.784 C 117.005 241.406 126.207 235.089 125.298 230.61 C 124.337 225.879 111.877 222.509 108.956 218.354 C 106.794 215.279 106.183 211.763 106.622 209.016 C 107.03 206.463 109.566 203.551 110.999 202.305 C 111.984 201.447 112.677 201.236 113.917 201.137 Z" style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122);"/>
    <path d="M 267.021 185.814 C 269.048 185.783 273.858 186.884 276.65 189.024 C 279.812 191.446 281.832 198.832 284.529 200.404 C 286.439 201.518 288.662 201.04 290.366 200.404 C 292.065 199.771 293.427 198.166 294.743 196.611 C 296.178 194.914 296.632 191.711 298.536 190.483 C 300.547 189.186 304.524 188.808 306.707 189.316 C 308.553 189.745 310.067 190.86 311.084 192.526 C 312.326 194.558 313.557 198.203 312.835 201.28 C 311.955 205.032 307.646 210.33 304.373 213.244 C 301.431 215.863 298.266 217.575 294.451 218.497 C 290.214 219.52 284.53 220.191 279.86 218.497 C 274.66 216.61 268.242 211.003 264.978 206.532 C 262.123 202.622 260.005 197.137 260.309 193.693 C 260.554 190.91 263.374 188.225 264.686 186.981 C 265.524 186.187 265.843 185.832 267.021 185.814 Z M 261.768 126.804 C 264.543 126.488 270.783 127.556 273.149 129.138 C 274.935 130.333 275.444 131.836 276.067 134.099 C 276.926 137.22 277.493 143.423 276.65 146.939 C 275.937 149.92 274.333 152.836 272.273 154.234 C 270.297 155.575 267.168 155.935 264.686 155.401 C 262.005 154.824 258.52 152.984 256.807 150.44 C 254.917 147.633 254.311 142.422 254.473 138.768 C 254.624 135.351 255.869 131.107 257.391 129.138 C 258.538 127.655 259.794 127.028 261.768 126.804 Z M 310.533 125.507 C 312.169 125.083 316.541 124.731 318.704 125.507 C 320.589 126.183 322.043 127.026 323.081 129.3 C 324.742 132.94 325.45 144.108 324.832 147.976 C 324.469 150.248 323.926 151.266 322.497 152.353 C 320.703 153.719 316.521 155.11 314.035 154.688 C 311.696 154.291 309.498 152.243 307.907 150.311 C 306.248 148.296 305.009 145.522 304.405 142.724 C 303.758 139.726 303.546 135.568 304.405 132.802 C 305.175 130.325 307.628 127.845 308.782 126.674 C 309.476 125.971 309.582 125.753 310.533 125.507 Z" style="stroke-width: 3px; stroke: rgb(122, 122, 122);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122);" cx="320.692" cy="170.715" rx="33.396" ry="9.079"/>
    <path d="M 175.893 120.977 L 196.771 105.851 L 167.977 61.462 C 158.666 37.309 184.779 33.463 190.946 46.564 L 218.971 89.768 L 239.443 74.936 L 252.927 93.548 L 189.377 139.589 L 175.893 120.977 Z" style="stroke-width: 3px; stroke: rgb(122, 122, 122);"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;30" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <animate attributeName="display" values="inline;none" begin="0s" dur="4s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5" repeatCount="indefinite"/>
  </g>
  <g style="filter: url(&quot;#filter-1&quot;); transform-origin: 271.069px 295.436px;" transform="matrix(-0.965926, -0.258818, -0.25882, 0.965926, -1.347125, -0.663277)">
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="275.765" cy="172.969" rx="84.893" ry="80.737"/>
    <path d="M 324.048 296.481 C 325.709 296.613 327.786 296.438 330.468 295.313 C 334.617 293.573 342.699 284.193 346.809 284.808 C 350.305 285.332 351.794 293.526 354.396 295.313 C 356.303 296.623 358.313 296.842 360.233 296.481 C 362.305 296.091 365.113 294.717 366.361 292.687 C 367.782 290.374 368.303 285.779 367.528 282.766 C 366.751 279.747 360 278.391 361.692 274.595 C 365.654 265.7 425.727 239.089 433.477 230.24 C 436.465 226.829 435.636 224.889 435.228 222.653 C 434.844 220.545 433.296 218.243 431.435 217.109 C 429.414 215.877 427.881 214.623 423.264 215.941 C 411.7 219.242 366.493 259.021 352.937 257.962 C 344.824 257.328 343.277 242.382 339.222 239.87 C 336.685 238.298 334.246 238.703 332.219 239.286 C 330.285 239.843 328.3 241.221 327.258 243.08 C 326.061 245.214 325.301 248.528 326.091 251.834 C 327.136 256.212 336.338 262.529 335.429 267.008 C 334.468 271.739 322.008 275.109 319.087 279.264 C 316.925 282.339 316.314 285.855 316.753 288.602 C 317.161 291.155 319.697 294.067 321.13 295.313 C 322.115 296.171 322.808 296.382 324.048 296.481 Z" style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122); transform-origin: 376.135px 256.008px;" transform="matrix(-1, 0, 0, -1, -0.000048, 0.000011)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="273.39" cy="304.761" rx="92.017" ry="83.112"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 255, 255); stroke: rgb(122, 122, 122);" cx="279.326" cy="446.644" rx="112.202" ry="105.077"/>
    <path d="M 113.917 201.137 C 115.578 201.005 117.655 201.18 120.337 202.305 C 124.486 204.045 132.568 213.425 136.678 212.81 C 140.174 212.286 141.663 204.092 144.265 202.305 C 146.172 200.995 148.182 200.776 150.102 201.137 C 152.174 201.527 154.982 202.901 156.23 204.931 C 157.651 207.244 158.172 211.839 157.397 214.852 C 156.62 217.871 149.869 219.227 151.561 223.023 C 155.523 231.918 215.596 258.529 223.346 267.378 C 226.334 270.789 225.505 272.729 225.097 274.965 C 224.713 277.073 223.165 279.375 221.304 280.509 C 219.283 281.741 217.75 282.995 213.133 281.677 C 201.569 278.376 156.362 238.597 142.806 239.656 C 134.693 240.29 133.146 255.236 129.091 257.748 C 126.554 259.32 124.115 258.915 122.088 258.332 C 120.154 257.775 118.169 256.397 117.127 254.538 C 115.93 252.404 115.17 249.09 115.96 245.784 C 117.005 241.406 126.207 235.089 125.298 230.61 C 124.337 225.879 111.877 222.509 108.956 218.354 C 106.794 215.279 106.183 211.763 106.622 209.016 C 107.03 206.463 109.566 203.551 110.999 202.305 C 111.984 201.447 112.677 201.236 113.917 201.137 Z" style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122);"/>
    <path d="M 267.021 185.814 C 269.048 185.783 273.858 186.884 276.65 189.024 C 279.812 191.446 281.832 198.832 284.529 200.404 C 286.439 201.518 288.662 201.04 290.366 200.404 C 292.065 199.771 293.427 198.166 294.743 196.611 C 296.178 194.914 296.632 191.711 298.536 190.483 C 300.547 189.186 304.524 188.808 306.707 189.316 C 308.553 189.745 310.067 190.86 311.084 192.526 C 312.326 194.558 313.557 198.203 312.835 201.28 C 311.955 205.032 307.646 210.33 304.373 213.244 C 301.431 215.863 298.266 217.575 294.451 218.497 C 290.214 219.52 284.53 220.191 279.86 218.497 C 274.66 216.61 268.242 211.003 264.978 206.532 C 262.123 202.622 260.005 197.137 260.309 193.693 C 260.554 190.91 263.374 188.225 264.686 186.981 C 265.524 186.187 265.843 185.832 267.021 185.814 Z M 261.768 126.804 C 264.543 126.488 270.783 127.556 273.149 129.138 C 274.935 130.333 275.444 131.836 276.067 134.099 C 276.926 137.22 277.493 143.423 276.65 146.939 C 275.937 149.92 274.333 152.836 272.273 154.234 C 270.297 155.575 267.168 155.935 264.686 155.401 C 262.005 154.824 258.52 152.984 256.807 150.44 C 254.917 147.633 254.311 142.422 254.473 138.768 C 254.624 135.351 255.869 131.107 257.391 129.138 C 258.538 127.655 259.794 127.028 261.768 126.804 Z M 310.533 125.507 C 312.169 125.083 316.541 124.731 318.704 125.507 C 320.589 126.183 322.043 127.026 323.081 129.3 C 324.742 132.94 325.45 144.108 324.832 147.976 C 324.469 150.248 323.926 151.266 322.497 152.353 C 320.703 153.719 316.521 155.11 314.035 154.688 C 311.696 154.291 309.498 152.243 307.907 150.311 C 306.248 148.296 305.009 145.522 304.405 142.724 C 303.758 139.726 303.546 135.568 304.405 132.802 C 305.175 130.325 307.628 127.845 308.782 126.674 C 309.476 125.971 309.582 125.753 310.533 125.507 Z" style="stroke-width: 3px; stroke: rgb(122, 122, 122);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 183, 49); stroke: rgb(122, 122, 122);" cx="320.692" cy="170.715" rx="33.396" ry="9.079"/>
    <path d="M 175.893 120.977 L 196.771 105.851 L 167.977 61.462 C 158.666 37.309 184.779 33.463 190.946 46.564 L 218.971 89.768 L 239.443 74.936 L 252.927 93.548 L 189.377 139.589 L 175.893 120.977 Z" style="stroke-width: 3px; stroke: rgb(122, 122, 122);"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;30" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animate attributeName="display" values="none;inline" begin="0s" dur="4s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_4 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100" xmlns:bx="https://boxy-svg.com">
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
  <g transform="matrix(-1, 0, 0, 1, 447.887979, 2)" style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <g>
      <path d="M 277.685 44.117 C 263.761 24.574 237.454 26.756 221.938 44.984 C 206.554 25.793 179.509 23.151 165.321 43.064 C 157.384 54.205 155.79 69.936 161.138 84.333 C 171.714 112.799 202.717 122.529 220.967 105.389 C 239.049 123.961 271.082 114.418 281.867 85.386 C 287.216 70.99 285.622 55.258 277.685 44.117 Z M 249.161 88.327 C 238.283 90.993 230.16 79.591 234.539 67.803 C 236.571 62.333 240.934 58.2 245.983 56.963 C 256.86 54.297 264.984 65.699 260.604 77.487 C 258.572 82.958 254.21 87.09 249.161 88.327 Z M 182.401 76.434 C 178.022 64.647 186.146 53.244 197.023 55.91 C 202.072 57.148 206.434 61.28 208.466 66.751 C 212.846 78.538 204.722 89.939 193.844 87.274 C 188.795 86.036 184.433 81.905 182.401 76.434 Z" style="stroke-width: 3px; stroke: rgb(98, 31, 31); fill: rgb(216, 207, 0);"/>
      <path d="M 151.074 419.356 m -38.167 0 a 38.167 65.924 0 1 0 76.334 0 a 38.167 65.924 0 1 0 -76.334 0 Z M 151.074 419.356 m -14.503 0 a 14.503 25.051 0 0 1 29.006 0 a 14.503 25.051 0 0 1 -29.006 0 Z" bx:shape="ring 151.074 419.356 14.503 25.051 38.167 65.924 1@31c22b16" style="stroke-width: 3px; stroke: rgb(98, 31, 31); fill: rgb(216, 207, 0); transform-origin: 151.074px 419.356px;" transform="matrix(0.679393, 0.733774, -0.733781, 0.679386, 131.968569, 2.233899)">
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -20" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </path>
      <path d="M 151.074 419.356 m -40.851 0 a 40.851 68.41 0 1 0 81.702 0 a 40.851 68.41 0 1 0 -81.702 0 Z M 151.074 419.356 m -15.523 0 a 15.523 25.995 0 0 1 31.046 0 a 15.523 25.995 0 0 1 -31.046 0 Z" bx:shape="ring 151.074 419.356 15.523 25.995 40.851 68.41 1@0cc8bb04" style="stroke-width: 3px; stroke: rgb(98, 31, 31); fill: rgb(216, 207, 0); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.679393, 0.733774, -0.733781, 0.679386, -7.304904, -5.482489)">
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -10" begin="0.04s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </path>
      <rect x="69.819" y="92.751" width="312.264" height="293.264" style="stroke-width: 3px; stroke: rgb(98, 31, 31); fill: rgb(216, 0, 0);"/>
      <path d="M 188.384 92.377 H 263.22 V 204.269 H 381.708 V 274.937 H 263.22 V 386.829 H 188.384 V 274.937 H 69.896 V 204.269 H 188.384 Z" bx:shape="cross 69.896 92.377 311.812 294.452 70.668 74.836 0.5 1@044ab183" style="stroke-width: 3px; stroke: rgb(98, 31, 31); fill: rgb(255, 255, 255);"/>
      <path d="M 150.617 -207.158 Q 178.056 -252.89 205.496 -207.158 L 205.496 -207.158 Q 232.935 -161.426 178.056 -161.426 L 178.056 -161.426 Q 123.177 -161.426 150.617 -207.158 Z" bx:shape="triangle 123.177 -252.89 109.758 91.464 0.5 0.5 1@137bed66" style="stroke-width: 3px; stroke: rgb(98, 31, 31);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
      <path d="M 251.228 -205.788 Q 278.667 -251.52 306.107 -205.788 L 306.107 -205.788 Q 333.546 -160.056 278.667 -160.056 L 278.667 -160.056 Q 223.788 -160.056 251.228 -205.788 Z" bx:shape="triangle 223.788 -251.52 109.758 91.464 0.5 0.5 1@0347f103" style="stroke-width: 3px; stroke: rgb(98, 31, 31);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    </g>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-40 0" begin="0s" dur="9.09s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_5 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100" xmlns:bx="https://boxy-svg.com">
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
    <g transform="matrix(1, 0, 0, 1, -21, 0)">
      <g style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
        <g>
          <path style="stroke: rgb(101, 101, 101); stroke-width: 3px; fill: rgb(255, 255, 255);" d="M 436.522 359.497 C 429.135 363.19 153.47 369.901 90.237 359.363 C 64.222 355.027 18.175 355.735 25.558 318.817 C 28.57 303.757 36.924 290.491 51.679 285.573 C 66.389 280.67 86.332 285.352 95.61 276.074 C 105.509 266.175 111.542 237.282 115.795 220.271 C 119.226 206.546 132.517 194.966 143.103 187.026 C 155.661 177.608 177.679 174.038 191.783 181.09 C 194.759 182.578 213.824 189.919 216.717 187.026 C 238.856 164.887 237.847 121.609 267.771 99.166 C 294.266 79.295 350.585 84.62 373.443 107.477 C 399.297 133.331 396.581 178.051 403.126 210.773 C 404.599 218.138 405.386 239.154 410.25 244.017 C 421.731 255.499 440.688 266.522 451.806 283.198 C 456.25 289.865 456.946 301.384 458.93 309.319 C 464.496 331.585 454.471 350.73 437.558 359.186"/>
          <path d="M 337.888 241.799 C 353.797 264.86 369.707 264.86 385.616 241.799 C 400.073 220.842 394.823 209.408 369.864 207.496 L 388.181 201.208 L 384.846 191.491 L 326.172 211.633 L 329.507 221.349 L 330.003 221.179 C 329.461 226.52 332.09 233.394 337.888 241.799 Z M 239.62 200.75 L 261.201 207.749 C 239.739 210.564 235.83 221.861 249.474 241.639 C 265.383 264.7 281.293 264.7 297.202 241.639 C 303.335 232.749 305.921 225.573 304.962 220.11 L 308.279 209.882 L 243.475 188.864 L 239.62 200.75 Z" style="stroke: rgb(101, 101, 101); stroke-width: 3px; fill: rgb(3, 3, 3); transform-box: fill-box; transform-origin: 50% 50%;">
            <animateTransform type="skewY" additive="sum" attributeName="transform" values="0;-5" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
          </path>
          <g>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 4px; stroke: rgb(101, 101, 101);" d="M 151.155 223.293 C 149.466 224.419 146.918 227.382 146.417 229.384 C 144.878 235.542 142.171 241.67 149.125 246.305 C 156.349 251.122 180.936 248.715 180.936 238.86"/>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 4; stroke: rgb(101, 101, 101);" d="M 180.657 289.1 C 179.188 290.285 176.972 293.406 176.537 295.515 C 175.199 302 172.844 308.454 178.891 313.337 C 185.175 318.411 206.557 315.875 206.557 305.495"/>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 4; stroke: rgb(101, 101, 101);" d="M 87.762 308.052 C 85.727 309.447 82.657 313.12 82.054 315.603 C 80.2 323.235 76.938 330.832 85.315 336.579 C 94.021 342.552 123.644 339.567 123.644 327.349"/>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 4; stroke: rgb(101, 101, 101); transform-box: fill-box; transform-origin: 50% 50%;" d="M 304.05 303.314 C 302.266 304.649 299.576 308.164 299.047 310.541 C 297.423 317.844 294.564 325.115 301.905 330.615 C 309.535 336.331 335.495 333.474 335.495 321.781"/>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 6.56648; stroke: rgb(101, 101, 101); vector-effect: non-scaling-stroke; transform-origin: 315.29px 135.643px;" d="M 302.386 120.568 C 300.508 121.903 297.676 125.418 297.119 127.795 C 295.409 135.098 292.399 142.369 300.128 147.869 C 308.162 153.585 335.495 150.728 335.495 139.035"/>
            <path style="fill: rgba(255, 255, 255, 0.55); stroke-width: 4; stroke: rgb(101, 101, 101); transform-origin: 415.124px 296.392px;" d="M 403.301 276.917 C 401.579 278.642 398.985 283.183 398.474 286.254 C 396.908 295.687 394.149 305.08 401.232 312.186 C 408.592 319.57 433.636 315.879 433.636 300.773"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-6 6" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
          </g>
        </g>
      </g>
    </g>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;43 0" begin="0s" dur="5.35s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CIRCLE_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="700"  xmlns:bx="https://boxy-svg.com">
  <g transform="matrix(1.579664, 0, 0, 1.894767, 12.246603, -80.738275)" style="pointer-events: none;">
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
  <g transform="matrix(1.579664, 0, 0, 1.894767, 12.246603, -80.738275)" style="pointer-events: none;">
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
  <g>
    <path d="M 357.456 474.35 L 169.798 474.35 L 179.994 427.741 C 173.843 418.353 170.367 407.684 170.367 396.37 C 170.367 358.775 208.751 328.298 256.101 328.298 C 303.451 328.298 341.835 358.775 341.835 396.37 C 341.835 406.348 339.131 415.824 334.274 424.363 L 357.456 474.35 Z" style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="249.111" cy="309.165" rx="61.449" ry="50.042"/>
    <path style="stroke-width: 3px; fill: rgb(140, 216, 46); stroke: rgb(7, 54, 30);" d="M 208.923 273.185 C 204.353 262.775 286.958 260.31 293.765 275.814 C 295.137 303.531 210.725 309.586 208.923 273.185 Z"/>
    <path d="M 244.194 386.264 C 244.194 392.202 239.27 397.014 233.195 397.014 C 227.121 397.014 222.196 392.202 222.196 386.264 C 222.196 385.411 222.298 384.579 222.49 383.783 L 152.338 314.933 L 164.934 296.769 L 236.175 366.687 C 236.991 366.353 237.887 366.168 238.826 366.168 C 242.658 366.168 245.766 369.238 245.766 373.024 C 245.766 375.839 244.045 378.261 241.585 379.314 C 243.212 381.189 244.194 383.614 244.194 386.264 Z" style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30);"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="163.009" cy="299.337" rx="26.861" ry="22.813"/>
    <path d="M 340.7 310.81 C 340.7 304.745 336.086 299.829 330.394 299.829 C 324.702 299.829 320.087 304.745 320.087 310.81 C 320.087 311.683 320.183 312.532 320.364 313.346 L 254.628 383.684 L 266.431 402.241 L 333.186 330.811 C 333.951 331.152 334.79 331.34 335.67 331.34 C 339.261 331.34 342.173 328.205 342.173 324.338 C 342.173 321.461 340.561 318.987 338.255 317.911 C 339.78 315.996 340.7 313.517 340.7 310.81 Z" style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.00007, -0.000019)"/>
    <ellipse style="stroke-width: 3px; fill: rgb(145, 216, 129); stroke: rgb(7, 54, 30);" cx="329.693" cy="300.073" rx="24.285" ry="23.549"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 229.596 274.003 L 224.955 293.497 L 229.596 274.003 Z"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 252.958 276.788 L 252.803 298.138 L 252.958 276.788 Z"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30); transform-box: fill-box; transform-origin: 50% 50%;" d="M 278.175 293.497 L 273.534 274.003 L 278.175 293.497 Z" transform="matrix(-1, 0, 0, -1, -0.000038, 0.000026)"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 175.614 451.586 L 346.777 452.031"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 195.518 473.502 L 196.186 451.689"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 239.403 473.946 L 238.838 451.895"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 323.659 473.947 L 322.991 452.134"/>
    <path style="fill: rgb(216, 216, 216); stroke-width: 3px; stroke: rgb(7, 54, 30);" d="M 277.891 473.605 L 278.559 451.792"/>
    <animateMotion path="M 0 0 L -0.279 12.176 L 0.313 0" calcMode="linear" dur="4s" fill="freeze" keyTimes="0; 0.486169; 1" keyPoints="0; 0.486169; 1" repeatCount="indefinite"/>
  </g>
  <g>
    <ellipse style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);" cx="144.462" cy="155.856" rx="104.931" ry="104.403"/>
    <ellipse style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);" cx="356.516" cy="155.856" rx="104.931" ry="104.403"/>
    <ellipse style="stroke-width: 3px; fill: rgb(255, 244, 235); stroke: rgb(7, 54, 30);" cx="252.912" cy="203.076" rx="91.621" ry="73.223"/>
    <path d="M 396.229 158.035 C 405.719 177.944 346.805 178.014 303.884 167.892 C 286.095 163.697 262.807 158.838 248.78 148.841 C 235.384 161.203 209.02 169.799 198.586 172.453 C 156.702 183.108 97.623 177.112 106.164 152.458 C 114.705 127.804 159.162 71.113 198.586 71.113 C 218.155 71.113 235.885 76.796 248.78 85.999 C 263.204 76.796 283.037 71.113 304.926 71.113 C 349.024 71.113 386.739 138.126 396.229 158.035 Z" style="stroke-width: 3px; fill: rgb(57, 216, 136); stroke: rgb(7, 54, 30);"/>
    <path d="M 204.525 -212.249 Q 220.532 -237.27 236.538 -212.249 L 236.538 -212.249 Q 252.544 -187.228 220.532 -187.228 L 220.532 -187.228 Q 188.519 -187.228 204.525 -212.249 Z" bx:shape="triangle 188.519 -237.27 64.025 50.042 0.5 0.5 1@3efc720f" style="stroke-width: 3px; stroke: rgb(7, 54, 30);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <path d="M 268.182 -212.619 Q 284.189 -237.64 300.195 -212.619 L 300.195 -212.619 Q 316.201 -187.598 284.189 -187.598 L 284.189 -187.598 Q 252.176 -187.598 268.182 -212.619 Z" bx:shape="triangle 252.176 -237.64 64.025 50.042 0.5 0.5 1@c050bfcc" style="stroke-width: 3px; stroke: rgb(7, 54, 30);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
    <path d="M 269.47 240.574 C 269.47 245.248 274.733 251.245 252.176 251.245 C 229.619 251.245 231.203 244.512 231.203 239.838 C 231.203 235.164 230.355 241.678 252.912 241.678 C 275.469 241.678 269.47 235.9 269.47 240.574 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(7, 54, 30);" cx="213.419" cy="199.581" rx="8.095" ry="9.199"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(7, 54, 30);" cx="278.18" cy="200.685" rx="8.095" ry="9.199"/>
    <path d="M 239.08 172.175 C 239.08 174.613 230.998 172.75 220.634 172.75 C 210.27 172.75 201.548 174.613 201.548 172.175 C 201.548 169.737 209.95 167.76 220.314 167.76 C 230.678 167.76 239.08 169.737 239.08 172.175 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <path d="M 304.209 172.911 C 304.209 175.349 296.127 173.486 285.763 173.486 C 275.399 173.486 266.677 175.349 266.677 172.911 C 266.677 170.473 275.079 168.496 285.443 168.496 C 295.807 168.496 304.209 170.473 304.209 172.911 Z" style="stroke-width: 3px; stroke: rgb(7, 54, 30);"/>
    <animateMotion path="M 0 0 L -0.205 20.066 L -0.001 -0.497" calcMode="linear" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.488361; 1" keyPoints="0; 0.488361; 1" repeatCount="indefinite"/>
  </g>
</svg>`; // Final NPC for this level

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    // Multiplicación/Repetición de personajes para llenar 7 fases (0-6)
    const NPC_DATA = {
        0: [
            { char_id: 'CHAR_1_Cboy', name: 'Christmas Boy', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Christmas Boy: Brrr! It's freezing in these passages!", "Christmas Boy: The walls are slick with ice, be careful!"] },
            { char_id: 'CHAR_2_Cookie', name: 'Cookie Man', svg_content: CHAR_SVG_2, initial_x: 550, dialogue: ["Cookie Man: Don't eat the floor, it's not gingerbread!", "Cookie Man: The deeper you go, the colder the reception."] }
        ],
        1: [
            { char_id: 'CHAR_3_Cooper', name: 'Cooper Man', svg_content: CHAR_SVG_3, initial_x: 350, dialogue: ["Cooper Man: Only the brave dare pass here. Or the foolish.", "Cooper Man: I've seen ice monsters lurking in the shadows..."] },
            { char_id: 'CHAR_4_Elderly', name: 'Elderly Gif', svg_content: CHAR_SVG_4, initial_x: 600, dialogue: ["Elderly Gif: Ho ho ho! This cold is good for the soul!", "Elderly Gif: Hurry, before the next ice storm hits!"] }
        ],
        2: [
            { char_id: 'CHAR_5_Monster', name: 'Ice Monster', svg_content: CHAR_SVG_5, initial_x: 450, dialogue: ["Ice Monster: RRRR! I guard this passage! Why disturb my sleep?", "Ice Monster: The path ahead is slippery, prepare to slide!"] }
        ],
        3: [
            { char_id: 'CHAR_1_Cboy_R2', name: 'Christmas Boy', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Christmas Boy: Still here! This level is huge!", "Christmas Boy: The light is faint now, almost there!"] },
            { char_id: 'CHAR_3_Cooper_R2', name: 'Cooper Man', svg_content: CHAR_SVG_3, initial_x: 550, dialogue: ["Cooper Man: The temperature is dropping again. Move fast!", "Cooper Man: The tunnels are endless, but the end is near."] }
        ],
        4: [
            { char_id: 'CHAR_2_Cookie_R2', name: 'Cookie Man', svg_content: CHAR_SVG_2, initial_x: 300, dialogue: ["Cookie Man: I'm starting to get brittle from the cold!", "Cookie Man: The Circle Fairy is the key to escaping the freeze!"] },
            { char_id: 'CHAR_5_Monster_R2', name: 'Ice Monster', svg_content: CHAR_SVG_5, initial_x: 650, dialogue: ["Ice Monster: A second challenge! You are persistent!", "Ice Monster: I'll let you pass if you promise to warm up my passage."] }
        ],
        5: [
            { char_id: 'CHAR_4_Elderly_R2', name: 'Elderly Gif', svg_content: CHAR_SVG_4, initial_x: 400, dialogue: ["Elderly Gif: The cold never bothered me anyway!", "Elderly Gif: You're close, I can feel the change in the air!"] }
        ],
        6: [
            { char_id: 'CHAR_1_Cboy_R3', name: 'Christmas Boy', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Christmas Boy: Look! The final exit!", "Christmas Boy: Go meet the fairy, she's waiting!"] },
            { char_id: 'CHAR_5_Monster_R3', name: 'Ice Monster', svg_content: CHAR_SVG_5, initial_x: 550, dialogue: ["Ice Monster: I'm too frozen to fight. Go. Just go.", "Ice Monster: Be free!"] }
        ],
        7: { char_id: 'CIRCLE_FAIRY', name: 'Circle Fairy', svg_content: CIRCLE_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Circle Fairy: You navigated the most treacherous cold of Drawaria.", "Circle Fairy: Your journey through the elemental levels is complete!", "Circle Fairy: Cold Passages finished. You are truly a master explorer!"] },
    };

    const MAX_TRANSITIONS = 7; // 7 transitions (Map 1 -> 2 -> ... -> 8). Total 8 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cold Sky Gradient (Teal/Blue-Green) -->
    <linearGradient id="coldSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(140, 190, 190);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(160, 210, 210);stop-opacity:1" />
    </linearGradient>
    <!-- Snow Ground Gradient (Pure White/Light Blue) -->
    <linearGradient id="snowGroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Cold Teal) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#coldSkyGradient)" />

  <!-- 2. Falling Snow Effect (Static white dots) -->
  <g fill="white" opacity="0.8">
    <circle cx="50" cy="50" r="2" />
    <circle cx="150" cy="120" r="1.5" />
    <circle cx="250" cy="50" r="1" />
    <circle cx="350" cy="150" r="2.5" />
    <circle cx="450" cy="80" r="1.5" />
    <circle cx="550" cy="180" r="2" />
    <circle cx="650" cy="100" r="1" />
    <circle cx="750" cy="30" r="2.5" />
  </g>

  <!-- 3. Distant Snowy Hills/Trees (Muted background) -->
  <path d="M0 350 Q200 320, 400 350 T800 320 V500 H0 Z"
        fill="rgb(180, 220, 220)" />

  <!-- 4. Foreground Ground (Heavy Snow Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#snowGroundGradient)" />

  <!-- 5. Snowy Cottages (Red houses with white roofs) -->
  <g transform="translate(150, 400)">
    <!-- House 1 -->
    <rect x="-50" y="-50" width="100" height="100" fill="red" />
    <rect x="-30" y="10" width="20" height="20" fill="white" stroke="black" stroke-width="1" />
    <!-- Roof Snow -->
    <polygon points="-70,-50 70,-50 0,-100" fill="white" stroke="rgb(220, 220, 220)" stroke-width="2" />
    <rect x="-70" y="-50" width="140" height="10" fill="white" />
  </g>
  <g transform="translate(600, 400)">
    <!-- House 2 -->
    <rect x="-50" y="-50" width="100" height="100" fill="red" />
    <rect x="10" y="10" width="20" height="20" fill="white" stroke="black" stroke-width="1" />
    <!-- Roof Snow -->
    <polygon points="-70,-50 70,-50 0,-100" fill="white" stroke="rgb(220, 220, 220)" stroke-width="2" />
    <rect x="-70" y="-50" width="140" height="10" fill="white" />
  </g>

  <!-- 6. Snowy Trees (Bare branches with snow) -->
  <g fill="rgb(100, 50, 20)" opacity="0.8">
    <rect x="400" y="300" width="10" height="150" />
    <path d="M405 300 Q400 250, 450 300 M405 300 Q410 250, 350 300" fill="none" stroke="rgb(100, 50, 20)" stroke-width="3" />
    <circle cx="405" cy="300" r="50" fill="white" />
  </g>

  <!-- 7. Small Snow Path/Ripples on ground -->
  <path d="M0 450 Q200 448, 400 450 T800 448" fill="none" stroke="rgb(220, 240, 255)" stroke-width="3" opacity="0.8" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Storm Sky Gradient (Muted Gray/Blue, low light) -->
    <linearGradient id="stormSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 120, 140);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 140, 160);stop-opacity:1" />
    </linearGradient>
    <!-- Snow Ground Gradient (Colder, shadowed tone) -->
    <linearGradient id="shadowedSnowGroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Stormy Gray-Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#stormSkyGradient)" />

  <!-- 2. Strong Wind/Snow Lines (Visual effect for the storm) -->
  <g stroke="white" stroke-width="2" opacity="0.6">
    <path d="M0 100 L200 110" />
    <path d="M0 250 L300 265" />
    <path d="M800 150 L600 160" />
    <path d="M800 300 L500 315" />
  </g>

  <!-- 3. Obscured Distant Forest (Dark, hidden silhouette) -->
  <path d="M0 350 Q200 320, 400 350 T800 320 V500 H0 Z"
        fill="rgb(60, 80, 100)" />

  <!-- 4. Foreground Ground (Shadowed Snow Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#shadowedSnowGroundGradient)" />

  <!-- 5. Snow Drifts/Banks (Irregular foreground obstacles) -->
  <g fill="white" stroke="rgb(200, 200, 200)" stroke-width="1" opacity="0.9">
    <path d="M50 450 C100 420, 150 430, 200 450 L200 500 L50 500 Z" />
    <path d="M500 450 C550 410, 650 430, 700 450 L700 500 L500 500 Z" />
  </g>

  <!-- 6. Distant Chimney/Structure Silhouettes (Faintly visible) -->
  <rect x="100" y="300" width="10" height="50" fill="rgb(40, 60, 80)" />
  <rect x="700" y="320" width="10" height="40" fill="rgb(40, 60, 80)" />

  <!-- 7. Small Icicles/Ice Shards (Detail hanging near the ground) -->
  <g fill="rgb(200, 230, 255)" opacity="0.9">
    <polygon points="400,450 405,440 410,450 Z" />
    <polygon points="550,450 555,435 560,450 Z" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Ice Cave Interior Gradient (Deep cold blue) -->
    <linearGradient id="iceCaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 150, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 180, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Ice/Crystal Platform Gradient -->
    <linearGradient id="crystalIcePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 230, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 250, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Cave Interior/Sky (Deep Blue Ice) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#iceCaveGradient)" />

  <!-- 2. Ice Walls/Cavern Structure (Left and Right pillars/walls) -->
  <path d="M0 500 V0 C100 50, 200 0, 300 50 L300 500 Z"
        fill="rgb(100, 160, 210)" opacity="0.8" />
  <path d="M800 500 V0 C700 50, 600 0, 500 50 L500 500 Z"
        fill="rgb(100, 160, 210)" opacity="0.8" />

  <!-- 3. Foreground Platform (Crystal Ice) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#crystalIcePlatformGradient)" />

  <!-- 4. Ice Cracks/Reflections (Detail on the floor) -->
  <g stroke="rgb(100, 180, 255)" stroke-width="2" opacity="0.6" fill="none">
    <path d="M50 450 L100 480" />
    <path d="M750 450 L700 480" />
    <path d="M300 460 Q400 450, 500 460" />
  </g>

  <!-- 5. Hanging Icicles (From the cavern roof) -->
  <g fill="white" opacity="0.9">
    <polygon points="400,0 410,50 390,50 Z" />
    <polygon points="150,0 160,30 140,30 Z" />
    <polygon points="650,0 660,40 640,40 Z" />
  </g>

  <!-- 6. Soft Blue Light Glow (Atmospheric effect) -->
  <circle cx="400" cy="250" r="100" fill="rgb(200, 230, 255)" opacity="0.2" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Tunnel Interior Gradient (Very dark and cold) -->
    <linearGradient id="darkTunnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(40, 60, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(60, 80, 100);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Ice/Stone Platform Gradient (Shadowed) -->
    <linearGradient id="shadowedIcePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 170, 190);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 200, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Faint Light Source (From the end of the tunnel) -->
    <radialGradient id="faintLight" cx="90%" cy="50%" r="50%" fx="90%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(255, 255, 255);stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:rgb(60, 80, 100);stop-opacity:0.1"/>
    </radialGradient>
  </defs>

  <!-- 1. Tunnel Interior/Sky (Dark Cold) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#darkTunnelGradient)" />

  <!-- 2. Faint Light Source (From the distant tunnel end) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#faintLight)" />

  <!-- 3. Tunnel Walls/Ceiling (Closer, dark rock/ice) -->
  <path d="M0 0 L100 0 L150 500 L0 500 Z"
        fill="rgb(30, 40, 50)" />
  <path d="M800 0 L700 0 L650 500 L800 500 Z"
        fill="rgb(30, 40, 50)" />
  <rect x="0" y="0" width="800" height="80" fill="rgb(30, 40, 50)" />

  <!-- 4. Foreground Platform (Shadowed Ice) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#shadowedIcePlatformGradient)" />

  <!-- 5. Water/Ice Pool in the middle of the path (Obstacle/Detail) -->
  <ellipse cx="400" cy="460" rx="150" ry="25" fill="rgb(0, 100, 150)" opacity="0.7" />

  <!-- 6. Dripping Water/Ice Shards (Vertical lines) -->
  <g fill="white" opacity="0.3">
    <rect x="250" y="80" width="2" height="10" />
    <rect x="550" y="80" width="2" height="15" />
    <rect x="400" y="80" width="3" height="12" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Crystal Chamber Interior Gradient (Bright, light blue) -->
    <linearGradient id="crystalChamberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 220, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Crystal Ice Platform Gradient (Reflective) -->
    <linearGradient id="reflectiveIcePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 230, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Crystal Detail Color (Deep icy blue) -->
    <stop id="crystalBlue" stop-color="rgb(0, 150, 255)" />
  </defs>

  <!-- 1. Chamber Interior/Sky (Bright Ice Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#crystalChamberGradient)" />

  <!-- 2. Crystal Wall Details (Reflecting blue light) -->
  <g fill="rgb(150, 200, 255)" stroke="rgb(100, 180, 255)" stroke-width="1" opacity="0.7">
    <!-- Left Wall Crystals -->
    <polygon points="0,450 50,400 100,450" />
    <polygon points="150,300 180,250 210,300" />
    <!-- Right Wall Crystals -->
    <polygon points="800,450 750,400 700,450" />
    <polygon points="650,300 620,250 590,300" />
  </g>

  <!-- 3. Foreground Platform (Reflective Ice) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#reflectiveIcePlatformGradient)" />

  <!-- 4. Large Crystal Formations (Jutting out of the ground) -->
  <g transform="translate(400, 450)" fill="rgb(0, 100, 150)" stroke="rgb(0, 150, 255)" stroke-width="2" opacity="0.8">
    <polygon points="-50,0 50,0 0,-100 Z" />
    <polygon points="100,0 150,-50 200,0 Z" />
  </g>

  <!-- 5. Scattered Crystal Shards on the ground -->
  <g fill="white" opacity="0.9">
    <polygon points="50,450 55,440 60,450 Z" />
    <polygon points="750,450 755,435 760,450 Z" />
  </g>

  <!-- 6. Gentle Light Rays (Vertical white streaks) -->
  <g stroke="white" stroke-width="1" opacity="0.3">
    <path d="M400 0 L400 500" />
    <path d="M200 0 L200 500" />
    <path d="M600 0 L600 500" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Wind-Swept Sky Gradient (Gray/White) -->
    <linearGradient id="windSweptSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 170, 180);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 210, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Compacted Snow Dune Gradient -->
    <linearGradient id="snowDuneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Wind-Swept Gray-Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#windSweptSkyGradient)" />

  <!-- 2. Distant Snow Peaks (Faint, low visibility) -->
  <polygon points="0,450 400,250 800,450" fill="rgb(120, 140, 160)" opacity="0.6" />

  <!-- 3. Blowing Snow/Blizzard Effect (Horizontal white streaks) -->
  <g stroke="white" stroke-width="2" opacity="0.7">
    <path d="M0 100 L200 105" />
    <path d="M800 250 L600 255" />
    <path d="M0 350 L150 352" />
  </g>
  <g fill="white" opacity="0.5">
    <rect x="0" y="0" width="800" height="500" />
  </g>

  <!-- 4. Foreground Platform (Compacted Snow Dunes) -->
  <path d="M0 450 Q200 420, 400 450 T800 420 V500 H0 Z"
        fill="url(#snowDuneGradient)" />

  <!-- 5. Snow Drift Texture (Shadow detail on the dunes) -->
  <g fill="rgb(200, 220, 240)" opacity="0.7">
    <path d="M0 450 Q100 435, 200 450 L200 500 L0 500 Z" />
    <path d="M400 450 Q500 430, 600 450 L600 500 L400 500 Z" />
  </g>

  <!-- 6. Single Frozen Tree Silhouette (Detail) -->
  <rect x="700" y="350" width="10" height="100" fill="rgb(80, 50, 20)" opacity="0.8" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Icy Sky Gradient (Cold Blue/Gray) -->
    <linearGradient id="icySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(160, 200, 230);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 230, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Icy Platform Gradient (Slick, reflective ice) -->
    <linearGradient id="slickIcePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Deep Crevasse Shadow -->
    <stop id="crevasseShadow" stop-color="rgb(0, 50, 100)" />
  </defs>

  <!-- 1. Sky (Icy Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#icySkyGradient)" />

  <!-- 2. Distant Peaks/Cavern Walls (Simple, shadowed background) -->
  <polygon points="0,450 400,250 800,450" fill="rgb(100, 140, 170)" opacity="0.7" />

  <!-- 3. Foreground Crevasse/Drop-off (The visual danger below the platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#crevasseShadow)" />

  <!-- 4. Main Platform (Narrow Icy Path - Sits right at the visual edge) -->
  <path d="M0 450 Q400 440, 800 450 L800 460 L0 460 Z"
        fill="url(#slickIcePlatformGradient)"
        stroke="rgb(150, 180, 220)"
        stroke-width="2" />

  <!-- 5. Grietas/Cracks en la plataforma (Blue lines) -->
  <g stroke="rgb(0, 100, 150)" stroke-width="1" opacity="0.8" fill="none">
    <path d="M150 450 L180 445 L200 450" />
    <path d="M500 455 Q550 450, 600 455" />
  </g>

  <!-- 6. Small Ice Shards/Obstacles (Detail) -->
  <g fill="white" opacity="0.9">
    <polygon points="400,430 405,420 410,430 Z" />
    <polygon points="250,435 255,425 260,435 Z" />
  </g>

  <!-- 7. Fog/Mist rising from the crevasse -->
  <rect x="0" y="400" width="800" height="50" fill="white" opacity="0.1" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_8 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Warm Portal Light Gradient (White/Yellow-Orange) -->
    <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(255, 255, 200);stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(255, 200, 150);stop-opacity:0.5"/>
    </radialGradient>
    <!-- Final Ice Platform Gradient (Light and Pure) -->
    <linearGradient id="finalIcePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(240, 250, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Background Ice/Rock -->
    <linearGradient id="backgroundIceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 140, 170);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 160, 190);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Background Ice/Rock -->
  <rect x="0" y="0" width="800" height="500" fill="url(#backgroundIceGradient)" />

  <!-- 2. Central Warm Portal/Light Source (Contrast to the cold) -->
  <circle cx="400" cy="250" r="250" fill="url(#portalGlow)" />

  <!-- 3. Portal Frame/Archway (Where the Circle Fairy sits/appears) -->
  <g transform="translate(400, 450)">
    <!-- Archway Pillars -->
    <rect x="-200" y="-200" width="20" height="200" fill="rgb(200, 200, 220)" stroke="rgb(150, 150, 170)" stroke-width="3" />
    <rect x="180" y="-200" width="20" height="200" fill="rgb(200, 200, 220)" stroke="rgb(150, 150, 170)" stroke-width="3" />
    <!-- Top Arch (Open space) -->
    <path d="M-200 -200 A200 200 0 0 1 200 -200 L180 -200 A180 180 0 0 0 -180 -200 Z"
          fill="rgb(255, 255, 200)" opacity="0.6" />
  </g>

  <!-- 4. Foreground Platform (Final Pure Ice) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#finalIcePlatformGradient)" />

  <!-- 5. Warm Light Reflection on Floor -->
  <ellipse cx="400" cy="460" rx="300" ry="30" fill="rgb(255, 200, 100)" opacity="0.3" />

  <!-- 6. Small Icy Altar/Pedestal (For the Circle Fairy) -->
  <rect x="350" y="400" width="100" height="50" fill="rgb(200, 230, 255)" stroke="rgb(150, 180, 220)" stroke-width="2" />

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
            background-color: #3498db; /* Icy Blue */
            color: white;
            border: 2px solid #ecf0f1; /* White/Ice Border */
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.7);
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

            // *** FIX 2: Añadir el área de clic al mapContainer (la escena de juego) ***
            // Usar document.body.appendChild(clickArea) para que el NPC no sea removido al cambiar el mapContainer.innerHTML
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

        // Custom style for the Cold Passages dialogue box (icy blue/dark theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(41, 128, 185, 0.9); /* Darker Icy Blue */
            border: 5px solid #ecf0f1; /* White/Ice Border */
            box-shadow: 0 0 20px rgba(236, 240, 241, 0.7);
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

        // Final Level Completion Check (Circle Fairy is only NPC in phase 7)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:#ecf0f1; font-size:36px; text-align:center; font-family: Arial, sans-serif; text-shadow: 0 0 10px #ecf0f1;">
                    LEVEL COMPLETE!<br>The Cold Passages are now behind you.
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
            border: 4px solid #ecf0f1;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(236, 240, 241, 0.7);
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

        // Standard Platformer Physics (Normal Gravity, No Wind)
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