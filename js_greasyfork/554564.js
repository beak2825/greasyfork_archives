// ==UserScript==
// @name         Drawaria Game Level 3 - Grand Desert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 3: Grand Desert. Traverse the scorching desert, meeting new characters in each phase.
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

    const LEVEL_TITLE = "Grand Desert";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-desert.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    // Y position where the bottom of the avatar rests (simulating the ground on the SVG floor)
    const AVATAR_HEIGHT_PX = 64;
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX; // Top position for the avatar image

    const LEVEL_END_X = VIEWBOX_WIDTH + 220; // Trigger for advancing the level (consistent across levels)
    const LEVEL_START_X = 50; // Starting X coordinate

    const DIALOGUE_BOX_ID = 'centered-dialogue-box';
    const NPC_WIDTH_DEFAULT = 100; // Default size for simpler NPC collision

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // Character SVG Placeholders (Movable NPCs)
    const CHAR_SVG_1 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="227.971" y1="41.578" x2="227.971" y2="429.487" id="gradient-0" gradientTransform="matrix(0.999893, -0.014613, 0.010507, 0.718943, -0.412511, 15.017064)">
      <stop offset="0" style="stop-color: rgb(16.471% 89.02% 46.667%)"/>
      <stop offset="1" style="stop-color: rgb(0% 52.429% 20.315%)"/>
    </linearGradient>
  </defs>
  <g style="transform-origin: 225.655px 235.533px;">
    <path d="M 92.506 135.043 C 108.534 149.091 133.819 258.249 164.156 188.829 L 164.156 94.392 C 160.301 85.999 194.323 39.276 240.545 41.667 C 277.094 43.558 316.417 71.969 316.417 91.307 C 316.417 110.645 318.094 179.811 315.901 194 C 310.859 226.62 316.965 231.849 341.112 205.235 C 379.123 163.342 462.188 182.519 323.878 280.983 C 322.263 282.133 319.935 280.93 318.002 280.826 L 318.002 429.487 L 164.156 429.487 L 164.156 294.077 C 190.151 304.863 76.042 251.981 59.402 199.732 C 31.736 112.859 76.478 120.995 92.506 135.043 Z" style="fill: url(&quot;#gradient-0&quot;); stroke-width: 3px; stroke: rgb(34, 86, 11);"/>
    <ellipse style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(34, 86, 11);" cx="243.753" cy="197.24" rx="38.881" ry="2.651" transform="matrix(1, 0, 0, 1, 0, 2)">
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 2;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 4;1 1" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </ellipse>
    <ellipse style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(34, 86, 11);" cx="211.144" cy="161.01" rx="12.96" ry="16.305">
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.2" begin="0s" dur="4s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    </ellipse>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="3;0" dur="4s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <ellipse style="stroke-width: 1; transform-origin: 277.34px 160.581px; stroke: rgb(34, 86, 11);" cx="277.34" cy="160.581" rx="12.96" ry="16.305">
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.2" begin="0s" dur="4s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    </ellipse>
  </g>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="189.816" y1="133.346" x2="189.816" y2="260.411" id="gradient-0" gradientTransform="matrix(0.077299, 0.997008, -0.793799, 0.061544, 337.546511, -7.088601)">
      <stop offset="0" style="stop-color: rgb(39.216% 34.118% 2.3529%)"/>
      <stop offset="1" style="stop-color: rgb(24.489% 20.84% 0%)"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="204.467" y1="235.539" x2="204.467" y2="329.634" id="gradient-1" gradientTransform="matrix(0.36826, 0.929723, -0.639248, 0.253204, 334.575451, 38.043423)">
      <stop offset="0" style="stop-color: rgb(39.216% 34.118% 2.3529%)"/>
      <stop offset="1" style="stop-color: rgb(24.489% 20.84% 0%)"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="425.726" y1="184.709" x2="425.726" y2="403.913" id="gradient-2" gradientTransform="matrix(0.995677, -0.092879, 0.058978, 0.632255, -21.98172, 188.077665)">
      <stop offset="0" style="stop-color: rgb(39.216% 34.118% 2.3529%)"/>
      <stop offset="1" style="stop-color: rgb(24.489% 20.84% 0%)"/>
    </linearGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="209.936" cy="362.952" r="144.765" id="gradient-3" gradientTransform="matrix(1.341459, -0.03152, 0.02349, 0.999724, -80.210221, 6.717189)">
      <stop offset="0" style="stop-color: rgb(100% 95.294% 66.667%)"/>
      <stop offset="1" style="stop-color: rgb(178, 173, 132);"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="56.624" cy="439.317" r="32.051" id="gradient-4" gradientTransform="matrix(2.132002, 0.100233, -0.066461, 1.413666, -34.900959, -187.405789)">
      <stop offset="0" style="stop-color: rgb(100% 95.294% 66.667%)"/>
      <stop offset="1" style="stop-color: rgb(57.764% 54.308% 27.939%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="396.368" cy="403.525" r="32.051" id="gradient-5" gradientTransform="matrix(2.463609, -0.063906, 0.038839, 1.497241, -595.800063, -175.318728)">
      <stop offset="0" style="stop-color: rgb(100% 95.294% 66.667%)"/>
      <stop offset="1" style="stop-color: rgb(57.764% 54.308% 27.939%)"/>
    </radialGradient>
  </defs>
  <g>
    <path d="M 354.701 326.602 C 354.701 405.078 289.888 468.696 209.936 468.696 C 129.984 468.696 65.171 405.078 65.171 326.602 C 65.171 248.126 123.767 257.563 203.719 257.563 C 283.67 257.563 354.701 248.126 354.701 326.602 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-3&quot;);"/>
    <g>
      <ellipse style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-4&quot;);" cx="56.624" cy="439.317" rx="32.051" ry="29.38"/>
      <animateMotion path="M 0 0 L -13.499 -74.275" calcMode="linear" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite"/>
    </g>
    <path d="M 113.316 137.343 C 124.359 142.437 183.903 125.864 275.506 137.719 C 246.146 174.856 308.864 268.956 318.52 259.785 L 61.112 258.933 C 68.331 272.27 133.006 168.799 113.316 137.343 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.990434, -0.13799, 0.13799, 0.990434, 0, 0.000003)"/>
    <path d="M 365.681 254.249 C 365.681 295.884 293.48 329.636 204.416 329.636 C 115.352 329.636 43.151 295.884 43.151 254.249 C 43.151 212.614 115.619 249.4 204.683 249.4 C 293.748 249.4 365.681 212.614 365.681 254.249 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.996036, -0.088948, 0.088948, 0.996036, -0.000002, 0.000002)"/>
    <g style="transform-origin: 421.419px 308.807px;">
      <path d="M 424.29 185.746 C 430.227 184.445 435.68 184.285 440.316 185.746 C 444.681 187.122 449.571 192.146 451.533 193.759 C 452.487 194.543 452.345 194.654 453.136 195.362 C 454.419 196.509 456.674 197.135 459.012 200.169 C 463.384 205.845 473.052 220.625 476.106 232.221 C 479.231 244.086 479.027 261.62 477.175 270.682 C 475.902 276.908 473.752 280.594 470.23 284.037 C 466.557 287.627 460.958 290.208 455.273 291.516 C 449.002 292.958 438.524 292.975 433.905 291.516 C 430.852 290.551 429.643 288.958 428.029 286.708 C 426.124 284.05 424.592 280.802 423.756 276.024 C 422.566 269.227 422.549 254.42 423.756 248.246 C 424.519 244.341 425.342 241.762 427.495 240.233 C 429.726 238.649 434.781 238.629 437.11 239.165 C 438.84 239.563 440.011 240.215 440.85 241.836 C 442.073 244.2 441.886 249.379 441.918 253.588 C 441.954 258.221 440.404 264.854 440.85 268.545 C 441.164 271.147 441.204 273.749 442.986 274.422 C 445.496 275.368 453.96 273.295 456.875 269.614 C 460.277 265.32 460.28 255.245 460.08 248.246 C 459.884 241.36 458.67 234.201 455.807 227.947 C 452.87 221.531 447.089 214.4 442.452 210.319 C 438.659 206.981 435.486 203.857 430.7 203.909 C 424.501 203.976 413.697 209.098 407.73 215.127 C 401.34 221.583 391.768 263.604 389.544 267.787 C 388.65 269.47 401.132 342.684 405.593 362.563 C 408.884 377.224 409.893 393.22 408.798 398.887 C 408.321 401.362 407.652 401.799 406.127 402.627 C 404.074 403.742 398.841 404.231 396.512 403.695 C 394.783 403.297 393.833 403.173 392.773 401.024 C 390.46 396.334 391.835 382.318 388.499 368.973 C 383.779 350.087 369.869 275.222 373.542 262.136 C 378.67 243.866 387.334 208.528 399.717 196.43 C 407.866 188.469 416.997 187.345 424.29 185.746 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-2&quot;);"/>
      <ellipse style="stroke-width: 3px; stroke: rgb(155, 120, 65); fill: url(&quot;#gradient-5&quot;);" cx="396.368" cy="403.525" rx="32.051" ry="29.38"/>
      <animateMotion path="M -40.894 -2.503 C -40.894 -2.502 -5.363 45.274 -7.658 38.389" calcMode="linear" dur="3s" fill="freeze" repeatCount="indefinite"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g style="transform-origin: 208.013px 404.611px;">
      <path d="M 245.826 417.017 C 251.189 416.499 230.075 449.658 209.687 449.658 C 189.299 449.658 164.492 422.385 173.548 415.462 C 182.604 408.539 240.463 417.535 245.826 417.017 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65);"/>
      <path d="M 188.624 386.979 C 177.12 394.877 180.038 380.056 162.472 380.056 C 144.905 380.056 142.166 394.985 132.432 385.317 C 122.698 375.649 144.905 359.564 162.472 359.564 C 180.038 359.564 200.128 379.081 188.624 386.979 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65);"/>
      <path d="M 282.583 388.928 C 271.079 396.826 273.997 382.005 256.431 382.005 C 238.864 382.005 236.125 396.934 226.391 387.266 C 216.657 377.598 238.864 361.513 256.431 361.513 C 273.997 361.513 294.087 381.03 282.583 388.928 Z" style="stroke-width: 3px; stroke: rgb(155, 120, 65);"/>
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -20" dur="3s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    </g>
    <animateMotion path="M 0 0 L 0.688 -17.526" calcMode="linear" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <radialGradient gradientUnits="userSpaceOnUse" cx="376.758" cy="440.266" r="27.646" id="gradient-3" gradientTransform="matrix(2.275915, 0.106111, -0.0849, 1.820948, -443.332211, -401.413376)">
      <stop offset="0" style="stop-color: rgb(100% 96.471% 58.431%)"/>
      <stop offset="1" style="stop-color: rgb(57.196% 55.183% 19.108%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="237.76" cy="357.09" r="137.145" id="gradient-4" gradientTransform="matrix(1.941893, -0.951779, 0.725766, 1.480734, -483.108109, 54.629699)">
      <stop offset="0" style="stop-color: rgb(100% 96.471% 58.431%)"/>
      <stop offset="1" style="stop-color: rgb(57.196% 55.183% 19.108%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="89.165" cy="441.642" r="27.646" id="gradient-5" gradientTransform="matrix(1.530079, 1.762625, -2.379985, 2.065946, 1003.836357, -627.930997)">
      <stop offset="0" style="stop-color: rgb(100% 96.471% 58.431%)"/>
      <stop offset="1" style="stop-color: rgb(57.196% 55.183% 19.108%)"/>
    </radialGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="240.076" y1="236.096" x2="240.076" y2="310.877" id="gradient-0">
      <stop offset="0" style="stop-color: rgb(59.216% 19.608% 0%)"/>
      <stop offset="1" style="stop-color: rgb(39.467% 9.8514% 0%)"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="232.87" y1="156.47" x2="232.87" y2="277.121" id="gradient-1">
      <stop offset="0" style="stop-color: rgb(59.216% 19.608% 0%)"/>
      <stop offset="1" style="stop-color: rgb(39.467% 9.8514% 0%)"/>
    </linearGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="232.522" cy="237.844" r="42.924" id="gradient-2" gradientTransform="matrix(2.038243, -0.494117, 0.271984, 1.12192, -306.10408, 85.895074)">
      <stop offset="0" style="stop-color: rgb(100% 91.765% 0%)"/>
      <stop offset="1" style="stop-color: rgb(56.533% 52.649% 0%)"/>
    </radialGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="232.467" y1="156.469" x2="232.467" y2="246.875" id="gradient-6" gradientTransform="matrix(0.055861, 0.998429, -0.266461, 0.014908, 261.174205, -77.965343)">
      <stop offset="0" style="stop-color: rgb(100% 71.765% 71.765%)"/>
      <stop offset="1" style="stop-color: rgb(63.444% 38.232% 38.759%)"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 374.905 364.952 C 374.905 305.451 313.503 257.216 237.76 257.216 C 162.017 257.216 100.615 305.451 100.615 364.952 C 100.615 424.453 156.776 456.964 232.519 456.964 C 308.262 456.964 374.905 424.453 374.905 364.952 Z" style="stroke-width: 3; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-4&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000018, 0.000002)"/>
    <path d="M 327.156 249.675 C 327.156 291.486 159.058 280.821 142.548 249.092 C 126.038 217.363 161.811 154.958 236.599 156.498 C 311.387 158.038 327.156 207.864 327.156 249.675 Z" style="stroke-width: 3px; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-1&quot;);"/>
    <path d="M 80.757 236.096 C 103.401 249.906 389.585 247.9 387.633 237.629 C 406.84 242.682 408.953 297.847 397.533 294.842 C 398.447 306.86 81.938 323.94 80.757 294.842 C 82.913 303.574 68.231 249.224 80.757 236.096 Z" style="stroke-width: 3px; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-0&quot;);"/>
    <path d="M 271.25 397.651 C 281.431 400.544 275.645 431.76 238.346 433.175 C 201.047 434.59 196.191 407.288 201.949 399.981 C 207.707 392.674 219.18 408.075 233.105 410.462 C 247.03 412.849 261.069 394.758 271.25 397.651 Z" style="stroke-width: 3px; stroke: rgb(129, 90, 65);"/>
    <path d="M 160.113 330.506 L 158.865 336.867 L 181.782 341.36 C 181.49 342.512 181.273 343.706 181.14 344.934 L 159.064 349.263 L 160.311 355.624 L 181.239 351.52 C 181.988 356.913 184.353 361.608 187.683 364.782 C 175.462 367.07 174.139 373.601 176.937 375.651 C 180.438 378.216 187.415 372.81 195.882 371.972 C 204.35 371.135 212.887 377.484 219.079 376.469 C 224.343 375.605 222.585 367.549 207.987 364.856 C 212.1 360.98 214.761 354.796 214.761 347.831 C 214.761 336.092 207.2 326.575 197.873 326.575 C 192.289 326.575 187.339 329.985 184.265 335.242 L 160.113 330.506 Z" style="stroke-width: 3px; stroke: rgb(129, 90, 65);"/>
    <path d="M 246.278 372.104 L 245.03 365.743 L 267.947 361.25 C 267.655 360.098 267.438 358.904 267.305 357.676 L 245.229 353.347 L 246.476 346.986 L 267.404 351.09 C 268.153 345.697 270.518 341.002 273.848 337.828 C 261.627 335.54 260.304 329.009 263.102 326.959 C 266.603 324.394 273.58 329.8 282.047 330.638 C 290.515 331.475 299.052 325.126 305.244 326.141 C 310.508 327.005 308.75 335.061 294.152 337.754 C 298.265 341.63 300.926 347.814 300.926 354.779 C 300.926 366.518 293.365 376.035 284.038 376.035 C 278.454 376.035 273.504 372.625 270.43 367.368 L 246.278 372.104 Z" style="stroke-width: 3; stroke: rgb(129, 90, 65); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000031, -0.000004)"/>
    <path d="M 219.822 157.775 C 219.822 156.034 243.048 156.37 243.048 156.876 C 225.421 191.462 317.033 247.952 323.846 222.151 C 324.776 222.895 328.298 246.771 326.317 245.186 C 326.317 245.186 257.23 248.832 255.177 245.411 L 210.388 245.412 C 210.388 245.412 140.413 244.415 140.371 244.288 C 138.308 246.351 136.763 226.658 139.473 223.948 C 168.217 241.629 235.401 181.443 219.822 157.775 Z" style="stroke-width: 3px; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-6&quot;);"/>
    <path d="M 232.522 198.602 L 246.396 223.63 L 275.446 228.58 L 254.971 248.999 L 259.051 277.086 L 232.522 264.677 L 205.993 277.086 L 210.073 248.999 L 189.598 228.58 L 218.648 223.63 Z" bx:shape="star 232.522 241.987 45.133 43.385 0.523 5 1@555bfabb" style="stroke-width: 3px; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-2&quot;);"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-5&quot;);" cx="89.165" cy="441.642" rx="27.646" ry="24.496">
      <animateMotion path="M 0 0 L -12.35 -88.94" calcMode="linear" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite"/>
    </ellipse>
    <ellipse style="stroke-width: 3; stroke: rgb(129, 90, 65); fill: url(&quot;#gradient-3&quot;);" cx="376.758" cy="440.266" rx="27.646" ry="24.496">
      <animateMotion path="M 0 0 L 22.65 -89.94" calcMode="linear" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite"/>
    </ellipse>
    <animateMotion path="M 0 0 L 100 0" calcMode="linear" dur="3s" fill="freeze" repeatCount="indefinite"/>
  </g>
  <animateMotion path="M 0 0 L -2.978 -41.1" calcMode="linear" dur="3s" fill="freeze" repeatCount="indefinite"/>
</svg>`;
    const CHAR_SVG_4 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <g>
    <g style="transform-origin: 179.9px 275.33px;">
      <path style="stroke-width: 3px; stroke: rgb(236, 165, 66); fill: rgb(255, 197, 80);" d="M 80.857 113.608 L 62.421 106.845 L 78.165 102.953 C 79.921 102.519 82.288 102.298 85.121 102.343 C 91.557 102.499 100.423 103.945 110.882 106.413 C 131.794 111.372 159.067 120.352 185.973 130.767 C 212.878 141.188 239.411 153.043 258.859 163.714 C 268.579 169.056 290.393 188.485 290.393 188.485 C 290.393 188.485 332.145 254.312 332.144 295.544 C 332.145 379.92 263.983 448.322 179.901 448.322 C 95.819 448.322 27.657 379.921 27.657 295.544 C 27.657 232.521 65.683 178.412 119.967 155.06 L 80.857 113.608 Z"/>
      <path style="stroke-width: 3; stroke: rgb(236, 165, 66); fill: rgb(255, 247, 163);" d="M 111.076 211.682 L 98.579 206.925 L 109.251 204.188 C 110.441 203.883 112.046 203.728 113.966 203.759 C 118.328 203.869 124.338 204.886 131.427 206.622 C 145.601 210.109 164.087 216.424 182.324 223.749 C 200.561 231.078 218.545 239.415 231.727 246.92 C 238.316 250.676 253.102 264.34 253.102 264.34 C 253.102 264.34 281.402 310.634 281.401 339.631 C 281.402 398.97 235.201 447.075 178.209 447.075 C 121.217 447.075 75.016 398.971 75.016 339.631 C 75.016 295.309 100.79 257.256 137.585 240.833 L 111.076 211.682 Z"/>
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.1" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g style="transform-origin: 187.342px 281.628px;">
      <path d="M 168.837 284.302 C 180.69 290.131 156.697 306.827 129.975 311.236 C 103.253 315.645 85.557 284.644 94.191 255.829 C 102.825 227.014 156.984 278.473 168.837 284.302 Z" style="stroke-width: 3px; stroke: rgb(236, 165, 66);"/>
      <path d="M 160.325 298.037 C 169.706 300.851 150.717 308.915 129.572 311.045 C 108.425 313.174 94.422 298.202 101.254 284.284 C 108.086 270.368 150.946 295.22 160.325 298.037 Z" style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(236, 165, 66); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.99317, -0.11668, 0.11668, 0.99317, 0, 0.000001)"/>
      <path d="M 279.59 275.777 C 291.443 269.948 267.45 253.252 240.728 248.843 C 214.006 244.434 196.31 275.435 204.944 304.25 C 213.578 333.065 267.737 281.606 279.59 275.777 Z" style="stroke-width: 3px; stroke: rgb(236, 165, 66); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0, 0.00004)"/>
      <path d="M 272.716 294.589 C 282.097 291.775 263.107 283.711 241.962 281.581 C 220.815 279.452 206.812 294.424 213.644 308.343 C 220.476 322.259 263.336 297.406 272.716 294.589 Z" style="fill: rgb(255, 255, 255); stroke-width: 3px; stroke: rgb(236, 165, 66); transform-origin: 243.537px 296.962px;" transform="matrix(-0.99317, -0.11668, 0.11668, -0.99317, 0.000013, 0.000002)"/>
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.8" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <path d="M 235.065 347.754 C 271.751 327.132 243.193 400.285 183.235 391.982 C 123.277 383.679 114.109 346.672 132.361 347.754 C 150.613 348.836 198.379 368.376 235.065 347.754 Z" style="stroke-width: 3px; stroke: rgb(236, 165, 66); transform-box: fill-box; transform-origin: 50% 50%;">
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;5" begin="0.02s" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </path>
    <animateMotion path="M 0 0 L 19.357 -25.921" calcMode="linear" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite"/>
  </g>
  <g style="transform-origin: 413.16px 271.345px;">
    <path style="stroke-width: 1; stroke: rgb(155, 0, 0); fill: rgb(255, 172, 42);" d="M 422.666 174.383 L 460.639 276.349 C 467.143 285.822 470.957 297.335 470.957 309.75 C 470.957 342.09 445.08 368.307 413.16 368.307 C 381.24 368.307 355.363 342.09 355.363 309.75 C 355.363 304.187 356.129 298.806 357.559 293.707 L 372.854 207.845 L 403.773 242.956 L 422.666 174.383 Z"/>
    <path style="stroke-width: 1; stroke: rgb(155, 0, 0); fill: rgb(249, 255, 42);" d="M 421.185 250.128 L 447.166 311.707 C 451.616 317.428 454.226 324.381 454.226 331.879 C 454.226 351.41 436.521 367.243 414.681 367.243 C 392.84 367.243 375.135 351.41 375.135 331.879 C 375.135 328.519 375.659 325.27 376.638 322.19 L 387.103 270.336 L 408.258 291.541 L 421.185 250.128 Z"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1; 1" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1.1" begin="0s" dur="4s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateMotion path="M 0 0 L -10.884 -28.801" calcMode="linear" begin="0.03s" dur="4s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_5 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="224.516" y1="73.657" x2="224.516" y2="416.008" id="gradient-0" gradientTransform="matrix(1, 0, 0, 1, 0, 0)">
      <stop offset="0" style="stop-color: rgb(100% 92.941% 50.588%)"/>
      <stop offset="1" style="stop-color: rgb(57.889% 53.038% 10.852%)"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 41.55 373.544 C 40.148 371.301 197.693 60.111 223.948 74.116 C 279.45 69.84 407.491 373.544 407.491 373.544 C 407.491 396.996 388.479 416.008 365.027 416.008 L 84.014 416.008 C 60.562 416.008 41.55 396.996 41.55 373.544 Z" style="stroke-width: 3px; paint-order: stroke markers; fill: url(&quot;#gradient-0&quot;); stroke: rgb(80, 59, 36);"/>
    <ellipse style="transform-box: fill-box; transform-origin: 50% 50%; stroke-width: 3px; stroke: rgb(80, 59, 36);" cx="178.197" cy="275.255" rx="26.463" ry="24.485">
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.4" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </ellipse>
    <path d="M 227.061 362.159 C 202.046 362.159 170.55 343.418 170.55 335.633 C 170.55 323.531 177.263 313.721 185.543 313.721 C 192.064 313.721 215.466 332.753 225.565 333.077 C 242.366 333.617 269.633 313.601 272.039 313.145 C 279.548 311.721 285.878 322.955 285.878 335.057 C 285.878 345.07 250.719 362.159 227.061 362.159 Z" style="transform-box: fill-box; transform-origin: 50% 50%; stroke-width: 3px; stroke: rgb(80, 59, 36);" transform="matrix(1, 0, 0, 1, 0, 3.167)">
      <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 5" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0; 0" begin="16.9s" dur="3s" fill="freeze" repeatCount="indefinite"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-10" begin="0s" dur="3s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 1.4" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </path>
    <ellipse style="transform-origin: 273.823px 274.767px; stroke-width: 3px; stroke: rgb(80, 59, 36);" cx="273.823" cy="274.767" rx="26.463" ry="24.485">
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.4" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </ellipse>
    <animateMotion path="M 0 0 L 0 -21" calcMode="linear" dur="3s" fill="freeze" repeatCount="indefinite"/>
  </g>
</svg>`;
    const CHAR_SVG_6 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <radialGradient gradientUnits="userSpaceOnUse" cx="237.929" cy="258.46" r="191.921" id="gradient-5" gradientTransform="matrix(1.228842, 0.608231, -0.601587, 1.215458, 101.038016, -200.403005)">
      <stop offset="0" style="stop-color: rgb(84.706% 84.706% 84.706%)"/>
      <stop offset="1" style="stop-color: rgb(48.42% 48.42% 48.42%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="239.63" cy="142.306" r="33.84" id="gradient-6">
      <stop offset="0" style="stop-color: rgb(84.706% 84.706% 84.706%)"/>
      <stop offset="1" style="stop-color: rgb(48.42% 48.42% 48.42%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="223.817" cy="414.546" r="55.223" id="gradient-8">
      <stop offset="0" style="stop-color: rgb(84.706% 84.706% 84.706%)"/>
      <stop offset="1" style="stop-color: rgb(48.42% 48.42% 48.42%)"/>
    </radialGradient>
    <radialGradient gradientUnits="userSpaceOnUse" cx="283.032" cy="410.179" r="55.223" id="gradient-9">
      <stop offset="0" style="stop-color: rgb(84.706% 84.706% 84.706%)"/>
      <stop offset="1" style="stop-color: rgb(48.42% 48.42% 48.42%)"/>
    </radialGradient>
  </defs>
  <animateMotion path="M 0 0 C 0.188 0.188 -0.122 9.607 -1.441 5.687" calcMode="linear" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
  <g>
    <path style="fill: url(&quot;#gradient-5&quot;); stroke: rgb(107, 106, 106); stroke-width: 3px;" d="M 46.008 143.509 L 193.207 141.135 C 193.22 141.137 193.188 141.258 193.112 141.487 C 210.706 132.896 230.477 128.075 251.374 128.075 C 264.146 128.075 276.496 129.876 288.187 133.237 C 304.641 115.582 418.584 91.97 429.85 109.863 C 391.154 112.637 359.45 158.607 353.932 176.416 C 372.92 199.405 384.327 228.886 384.327 261.031 C 384.327 281.622 379.647 301.119 371.292 318.517 C 384.922 325.659 428.234 374.665 422.216 383.359 C 423.139 378.558 397.689 369.206 374.458 363.634 C 387.124 383.215 399.457 407.941 394.677 412.761 C 397.441 405.542 337.267 375.598 319.703 375.108 C 299.735 387.095 276.359 393.987 251.374 393.987 C 226.866 393.987 203.907 387.356 184.193 375.79 C 168.065 375.062 105.395 406.072 108.214 413.436 C 103.435 408.617 115.768 383.89 128.433 364.309 C 105.203 369.881 79.752 379.233 80.675 384.034 C 74.635 375.309 118.283 325.979 131.746 319.116 C 123.21 301.567 118.421 281.858 118.421 261.031 C 118.421 237.331 124.622 215.079 135.49 195.809 C 118.635 176.895 79.376 145.901 46.008 143.509 Z"/>
    <g>
      <path d="M 232.051 182.042 L 223.454 134.08 C 212.979 136.714 205.79 139.396 205.79 133.547 C 205.79 124.49 219.387 102.57 239.37 102.57 C 259.353 102.57 272.95 119.285 272.95 128.342 C 272.95 128.559 272.944 128.768 272.933 128.968 L 273.47 128.968 L 267.743 173.221 L 249.48 145.986 Z" style="fill: url(&quot;#gradient-6&quot;); stroke: rgb(107, 106, 106); stroke-width: 3px;"/>
      <path d="M 290.357 330.7 C 290.357 346.419 283.932 350.174 252.908 350.174 C 221.884 350.174 213.212 345.67 213.212 329.951 C 213.212 314.232 220.386 322.461 251.41 322.461 C 282.434 322.461 290.357 314.981 290.357 330.7 Z" style="fill: rgb(255, 255, 255); stroke: rgb(107, 106, 106); stroke-width: 3px;"/>
      <path d="M 310.651 313.874 C 310.651 316.31 283.223 324.783 250.534 324.783 C 217.844 324.783 192.273 316.31 192.273 313.874 C 192.273 311.438 217.38 320.141 250.069 320.141 C 282.758 320.141 310.651 311.438 310.651 313.874 Z" style="stroke: rgb(107, 106, 106); stroke-width: 3px;"/>
      <path d="M 290.138 330.308 C 290.138 332.744 272.444 341.217 251.355 341.217 C 230.266 341.217 213.77 332.744 213.77 330.308 C 213.77 327.872 229.967 336.575 251.055 336.575 C 272.143 336.575 290.138 327.872 290.138 330.308 Z" style="stroke-width: 3px; stroke: rgb(10, 9, 9);"/>
      <path d="M 222.646 274.908 C 226.845 278.059 229.175 280.856 228.953 282.03 C 228.399 284.959 212.814 271.593 192.23 268.188 C 183.563 266.754 175.389 267.316 168.874 268.228 L 168.781 268.883 C 168.722 268.664 168.693 268.455 168.694 268.253 C 159.837 269.507 154.089 271.385 154.408 269.701 C 154.724 268.033 160.704 264.878 169.596 263.097 L 173.503 235.347 C 157.327 228.578 146.877 219.907 147.28 218.036 C 147.789 215.658 164.395 229.134 188.388 235.622 C 212.383 242.11 234.68 239.153 234.169 241.53 C 234.029 242.18 232.289 242.865 229.343 243.383 L 222.646 274.908 Z" style="stroke: rgb(107, 106, 106); stroke-width: 3px;"/>
      <path d="M 226.291 289.648 L 274.785 289.875 C 273.071 289.922 254.709 305.457 251.203 319.482 C 254.756 318.372 233.435 290.119 226.291 289.648 Z" style="stroke: rgb(107, 106, 106); stroke-width: 3px;"/>
      <path d="M 339.081 226.066 C 343.28 222.915 345.61 220.118 345.388 218.944 C 344.834 216.015 329.249 229.381 308.665 232.786 C 299.998 234.22 291.824 233.658 285.309 232.746 L 285.216 232.091 C 285.157 232.31 285.128 232.519 285.129 232.721 C 276.272 231.467 270.524 229.589 270.843 231.273 C 271.159 232.941 277.139 236.096 286.031 237.877 L 289.938 265.627 C 273.762 272.396 263.312 281.067 263.715 282.938 C 264.224 285.316 280.83 271.84 304.823 265.352 C 328.818 258.864 351.115 261.821 350.604 259.444 C 350.464 258.794 348.724 258.109 345.778 257.591 L 339.081 226.066 Z" style="stroke: rgb(107, 106, 106); stroke-width: 3; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000027, 0.000014)"/>
    </g>
    <animateMotion path="M 4.7341837739367065 -1.1455598276309047 L 8.356 19.787" calcMode="linear" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
  </g>
  <animateMotion path="M 0 0 L 0.293 9.537" calcMode="linear" dur="2s" fill="freeze" repeatCount="indefinite"/>
  <path d="M 331.719 410.67 L 306.714 410.67 C 306.743 410.545 306.771 410.421 306.797 410.295 L 338.255 397.448 L 305.884 397.448 L 330.785 387.278 C 331.118 385.468 278.957 389.227 266.59 392.362 C 245.605 397.681 226.997 384.919 227.837 406.346 C 228.677 427.773 245.605 433.553 267.525 433.553 C 278.764 433.553 288.913 430.35 296.133 425.203 L 331.719 410.67 Z" style="transform-box: fill-box; transform-origin: 50% 50%; fill: url(&quot;#gradient-9&quot;); stroke: rgb(107, 106, 106); stroke-width: 3px;" transform="matrix(-1, 0, 0, -1, -0.000018, 0.000023)">
    <animateMotion path="M 0 0 L 0.293 18.208" calcMode="linear" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
  </path>
  <path d="M 272.504 414.055 L 247.499 414.055 C 247.528 414.18 247.556 414.304 247.582 414.43 L 279.04 427.277 L 246.669 427.277 L 271.57 437.447 C 271.903 439.257 219.742 435.498 207.375 432.363 C 186.39 427.044 167.782 439.806 168.622 418.379 C 169.462 396.952 186.39 391.172 208.31 391.172 C 219.549 391.172 229.698 394.375 236.918 399.522 L 272.504 414.055 Z" style="transform-origin: 223.817px 414.547px; fill: url(&quot;#gradient-8&quot;); stroke: rgb(107, 106, 106); stroke-width: 3px;">
    <animateMotion path="M 0 0 L -4.909 8.67" calcMode="linear" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite"/>
  </path>
</svg>`;
    const CHAR_SVG_7 = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" xmlns:bx="https://boxy-svg.com">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="240.439" y1="37.447" x2="240.439" y2="382.532" id="gradient-0" gradientTransform="matrix(0.999923, 0.012408, -0.007013, 0.565177, 2.70131, 163.350255)">
      <stop offset="0" style="stop-color: rgb(100% 100% 100%)"/>
      <stop offset="1" style="stop-color: rgb(56.687% 56.687% 56.687%)"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="379.741" y1="294.406" x2="379.741" y2="486.151" id="gradient-1" gradientTransform="matrix(0.679387, -0.73378, 0.277113, 0.256572, 29.082613, 588.209009)">
      <stop offset="0" style="stop-color: rgb(100% 100% 100%)"/>
      <stop offset="1" style="stop-color: rgb(56.687% 56.687% 56.687%)"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" x1="126.979" y1="366.563" x2="126.979" y2="442.52" id="gradient-2" gradientTransform="matrix(0.999937, -0.011191, 0.006009, 0.536936, -2.651171, 206.335958)">
      <stop offset="0" style="stop-color: rgb(100% 100% 100%)"/>
      <stop offset="1" style="stop-color: rgb(56.687% 56.687% 56.687%)"/>
    </linearGradient>
  </defs>
  <g style="transform-origin: 252.887px 264.893px;">
    <path d="M 298.13 382.532 L 182.746 382.532 L 182.746 305.513 C 106.522 287.805 51.336 235.948 51.336 174.733 C 51.336 98.912 136 37.447 240.439 37.447 C 344.878 37.447 429.542 98.912 429.542 174.733 C 429.542 235.948 374.355 287.805 298.13 305.513 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-0&quot;);"/>
    <g style="transform-origin: 241.536px 210.34px;">
      <path d="M 233.542 204.388 C 242.033 208.925 210.053 249.431 180.362 249.431 C 150.671 249.431 133.765 195.279 132.413 175.909 C 131.061 156.539 225.051 199.851 233.542 204.388 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
      <path d="M 349.284 216.292 C 357.775 211.755 325.795 171.249 296.104 171.249 C 266.413 171.249 249.507 225.401 248.155 244.771 C 246.803 264.141 340.793 220.829 349.284 216.292 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000067, -0.000011)"/>
      <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1 0.7" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <rect x="220.174" y="312.707" width="7.556" height="69.745" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    <rect x="255.328" y="312.707" width="7.556" height="69.745" style="stroke: rgb(0, 0, 0); stroke-width: 3px;"/>
    <g>
      <path d="M 310.134 450.073 C 315.864 456.697 324.149 458.011 331.438 454.371 C 330.004 463.12 332.154 472.546 337.791 479.063 C 346.414 489.031 359.933 488.41 367.984 477.675 C 376.034 466.939 375.569 450.152 366.946 440.184 C 365.983 439.071 364.961 438.089 363.89 437.239 L 417.049 366.351 C 417.762 367.507 418.563 368.605 419.45 369.629 C 428.073 379.599 441.591 378.977 449.642 368.242 C 457.692 357.504 457.23 340.719 448.605 330.75 C 442.638 323.85 434.327 322.023 427.103 325.11 C 428.915 316.289 427.136 306.923 421.747 300.693 C 413.602 291.278 400.294 292.587 392.023 303.618 C 383.751 314.647 383.648 331.223 391.793 340.639 C 393.302 342.384 394.99 343.761 396.789 344.774 L 343.617 415.682 C 342.693 413.655 341.519 411.783 340.089 410.128 C 331.942 400.712 318.635 402.021 310.363 413.052 C 302.092 424.081 301.989 440.657 310.134 450.073 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-1&quot;); transform-origin: 379.803px 390.912px;" transform="matrix(0.996929, 0.078308, -0.078308, 0.996929, 0, 0.000002)"/>
      <animate attributeName="display" values="none;inline" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" calcMode="discrete" keyTimes="0; 0.5"/>
    </g>
    <g>
      <path d="M 210.643 386.491 C 210.643 394.121 205.695 400.734 198.468 403.986 C 204.7 407.643 208.856 414.219 208.856 421.726 C 208.856 433.21 199.125 442.52 187.122 442.52 C 175.118 442.52 165.387 433.21 165.387 421.726 C 165.387 420.443 165.508 419.189 165.74 417.971 L 86.484 417.971 C 86.682 419.098 86.785 420.256 86.785 421.437 C 86.785 432.921 77.054 442.231 65.05 442.231 C 53.046 442.231 43.315 432.921 43.315 421.437 C 43.315 413.49 47.975 406.583 54.824 403.083 C 48.288 399.657 43.911 393.379 43.911 386.202 C 43.911 375.355 53.909 366.563 66.241 366.563 C 78.573 366.563 88.571 375.355 88.571 386.202 C 88.571 388.212 88.228 390.152 87.589 391.978 L 166.866 391.978 C 166.291 390.236 165.983 388.396 165.983 386.491 C 165.983 375.644 175.98 366.852 188.313 366.852 C 200.645 366.852 210.643 375.644 210.643 386.491 Z" style="stroke: rgb(0, 0, 0); stroke-width: 3px; fill: url(&quot;#gradient-2&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.663385, 0.748278, -0.748278, 0.663385, 0.000004, -0.000018)"/>
      <animate attributeName="display" values="inline;none" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite" calcMode="discrete" keyTimes="0; 0.5"/>
    </g>
    <animateMotion path="M 0 0 L -1.647 -18.151" calcMode="linear" begin="0s" dur="4s" fill="freeze" repeatCount="indefinite"/>
    <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1.1" dur="4s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const TRIANGLE_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="700" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 500 500" width="700" xmlns="http://www.w3.org/2000/svg">
  <title/>
  <g id="Composition_237f8cc0cf064b83bd9184e9a0d70fd2">
    <g id="Layer_6fcc2b7d79124000a55163479d062c32" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_1621dde92081436eaad105ac9bbdd3c0" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="stroke: none; stroke-width: 2px;"/>
                <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff9005" fill-opacity="1" id="Stroke_0ef027a138354a3a914cb5c264e3f75d" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 200.262,259.119 C 200.262,259.119 201.187,306.377 201.187,306.377 201.187,306.377 115.315,307.281 115.315,307.281 115.315,307.281 114.565,256.501 114.565,256.501 115.662,233.749 134.726,219.155 157.625,219.156 180.222,219.156 198.724,236.79 200.262,259.119 200.262,259.119 200.262,259.119 200.262,259.119 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <path d="M 200.262,259.119 C 200.262,259.119 201.187,306.377 201.187,306.377 201.187,306.377 115.315,307.281 115.315,307.281 115.315,307.281 114.565,256.501 114.565,256.501 115.662,233.749 134.726,219.155 157.625,219.156 180.222,219.156 198.724,236.79 200.262,259.119 200.262,259.119 200.262,259.119 200.262,259.119 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.200000; 0.394444; 0.616667; 0.861111" path="M 0,0 C 0,0 0,-8.39442 0,-8.39442 0,-8.39442 -1.0493,-4.19721 -1.0493,-4.19721 -1.0493,-4.19721 -1.0493,-6.29581 -1.0493,-6.29581 -1.0493,-6.29581 -2.0986,-2.0986 -2.0986,-2.0986" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff3f09" fill-opacity="1" id="Stroke_2e6c824d2de64fedad20638f9ad4f5cb" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 161.688,21.2381 C 177.71,33.0612 243.079,18.3774 248.584,22.882 248.584,22.882 233.112,30.971 233.112,30.971 251.836,37.576 272.578,59.211 268.474,81.479 267.098,88.942 271.225,103.256 274.575,109.16 292.643,141 269.665,175.852 246.891,179.417 224.116,182.982 202.385,164.596 196.441,128.693 195.536,123.228 195.084,117.852 195.051,112.655 191.664,109.088 188.769,104.967 186.493,100.425 183.492,100.601 180.441,100.691 177.348,100.691 164.525,100.691 152.402,99.144 141.638,96.393 136.246,102.498 129.318,107.474 121.374,110.863 122.125,118.449 121.887,126.533 120.517,134.809 114.572,170.712 96.9428,181.189 68.674,179.807 41.0494,178.739 20.6378,133.305 42.7634,91.0991 44.5357,85.4012 50.2954,83.0588 45.6714,73.0235 29.3874,51.9235 57.1607,20.3318 80.2112,22.7888 80.2112,22.7888 161.688,21.2381 161.688,21.2381 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <path d="M 161.688,21.2381 C 177.71,33.0612 243.079,18.3774 248.584,22.882 248.584,22.882 233.112,30.971 233.112,30.971 251.836,37.576 272.578,59.211 268.474,81.479 267.098,88.942 271.225,103.256 274.575,109.16 292.643,141 269.665,175.852 246.891,179.417 224.116,182.982 202.385,164.596 196.441,128.693 195.536,123.228 195.084,117.852 195.051,112.655 191.664,109.088 188.769,104.967 186.493,100.425 183.492,100.601 180.441,100.691 177.348,100.691 164.525,100.691 152.402,99.144 141.638,96.393 136.246,102.498 129.318,107.474 121.374,110.863 122.125,118.449 121.887,126.533 120.517,134.809 114.572,170.712 96.9428,181.189 68.674,179.807 41.0494,178.739 20.6378,133.305 42.7634,91.0991 44.5357,85.4012 50.2954,83.0588 45.6714,73.0235 29.3874,51.9235 57.1607,20.3318 80.2112,22.7888 80.2112,22.7888 161.688,21.2381 161.688,21.2381 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 2 0 C 2 0 2 9.234 2 9.234 C 2 9.234 1.896 3.358 1.896 3.358 C 1.896 3.358 2.056 10.913 2.056 10.913 C 2.056 10.913 1.679 2.518 1.679 2.518" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_4d999fc5476b486eacb44fb99a752478" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke: none; stroke-width: 2px;"/>
                <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff9005" fill-opacity="1" id="Stroke_d5df62baaec7485d8e61bed9917b663d" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="157.861" cy="197.478" rx="31.17" ry="28.337" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <ellipse cx="157.861" cy="197.478" rx="31.17" ry="28.337" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.205556; 0.372222; 0.583333; 0.794444" path="M 0,0 C 0,0 0,4.19721 0,4.19721 0,4.19721 0,0 0,0 0,0 0,5.24651 0,5.24651 0,5.24651 0,1.0493 0,1.0493" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_2c49a36ac0514ecdbee6c6f6d1add8fc" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 135.773,184.525 C 133.912,182.097 136.987,176.444 141.725,172.812 145.722,169.75 155.881,168.385 158.179,168.385 160.615,168.385 171.05,170.412 174.248,172.356 179.267,175.409 181.623,180.756 180.059,183.384 178.786,185.525 175.007,185.695 170.938,184.034 169,188.19 164.019,191.146 158.179,191.147 152.282,191.147 147.26,188.131 145.364,183.911 141.325,186.205 137.329,186.555 135.773,184.525 135.773,184.525 135.773,184.525 135.773,184.525 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <path d="M 135.773,184.525 C 133.912,182.097 136.987,176.444 141.725,172.812 145.722,169.75 155.881,168.385 158.179,168.385 160.615,168.385 171.05,170.412 174.248,172.356 179.267,175.409 181.623,180.756 180.059,183.384 178.786,185.525 175.007,185.695 170.938,184.034 169,188.19 164.019,191.146 158.179,191.147 152.282,191.147 147.26,188.131 145.364,183.911 141.325,186.205 137.329,186.555 135.773,184.525 135.773,184.525 135.773,184.525 135.773,184.525 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.205556; 0.372222; 0.583333; 0.794444" path="M 0,0 C 0,0 0,4.19721 0,4.19721 0,4.19721 0,0 0,0 0,0 0,5.24651 0,5.24651 0,5.24651 0,1.0493 0,1.0493" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ebebeb" fill-opacity="1" id="Stroke_eacac69c39cb433b827dd0857a77afac" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="158.223" cy="126.244" rx="53.217" ry="47.126" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <ellipse cx="158.223" cy="126.244" rx="53.217" ry="47.126" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 2 0 C 2 0 2 9.234 2 9.234 C 2 9.234 2.358 3.358 2.358 3.358 C 2.358 3.358 2.518 10.913 2.518 10.913 C 2.518 10.913 1.679 2.518 1.679 2.518" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g id="Group_740fd26847b144998faaab5e38cb4d8a" opacity="1">
                <g fill="#ffffff" fill-opacity="1" id="Fill_32ea43da47724c7c88a983535e7acdc8" style="stroke:none;">
                  <path d="M 170.448,247.508 C 170.58,247.498 170.714,247.493 170.849,247.493 170.976,247.493 171.102,247.497 171.227,247.506 171.227,247.506 170.272,246.92 170.272,246.92 170.34,247.11 170.399,247.307 170.448,247.508 170.448,247.508 170.448,247.508 170.448,247.508 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                  <path d="M 161.639,248.91 C 161.639,246.041 163.648,243.715 166.126,243.715 167.723,243.715 169.126,244.682 169.921,246.137 169.921,246.137 198.95,198.848 198.95,198.848 198.95,198.848 206.201,203.299 206.201,203.299 206.201,203.299 176.919,251 176.919,251 176.919,251 175.829,250.331 175.829,250.331 176.703,251.624 177.225,253.265 177.225,255.05 177.225,259.224 174.37,262.607 170.849,262.607 167.328,262.607 164.473,259.224 164.473,255.05 164.473,254.618 164.504,254.194 164.563,253.781 162.855,253.046 161.639,251.142 161.639,248.91 161.639,248.91 161.639,248.91 161.639,248.91 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                  <path d="M 154.555,248.201 C 154.555,250.373 152.93,252.185 150.772,252.599 150.775,252.707 150.777,252.815 150.777,252.924 150.777,257.749 147.711,261.661 143.929,261.661 140.147,261.661 137.081,257.749 137.081,252.924 137.081,250.52 137.842,248.343 139.074,246.763 139.074,246.763 108.271,201.209 108.271,201.209 108.271,201.209 116.182,195.859 116.182,195.859 116.182,195.859 148.639,243.858 148.639,243.858 149.02,243.764 149.42,243.714 149.832,243.714 152.44,243.714 154.555,245.723 154.555,248.201 154.555,248.201 154.555,248.201 154.555,248.201 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                </g>
                <g id="Stroke_d47ef98376be4de991212e94d163c6af" stroke="#000000" stroke-opacity="1" stroke-width="1" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;">
                  <path d="M 170.448,247.508 C 170.58,247.498 170.714,247.493 170.849,247.493 170.976,247.493 171.102,247.497 171.227,247.506 171.227,247.506 170.272,246.92 170.272,246.92 170.34,247.11 170.399,247.307 170.448,247.508 170.448,247.508 170.448,247.508 170.448,247.508 Z" style="stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px; fill: rgb(255, 255, 255);"/>
                  <path d="M 161.639,248.91 C 161.639,246.041 163.648,243.715 166.126,243.715 167.723,243.715 169.126,244.682 169.921,246.137 169.921,246.137 198.95,198.848 198.95,198.848 198.95,198.848 206.201,203.299 206.201,203.299 206.201,203.299 176.919,251 176.919,251 176.919,251 175.829,250.331 175.829,250.331 176.703,251.624 177.225,253.265 177.225,255.05 177.225,259.224 174.37,262.607 170.849,262.607 167.328,262.607 164.473,259.224 164.473,255.05 164.473,254.618 164.504,254.194 164.563,253.781 162.855,253.046 161.639,251.142 161.639,248.91 161.639,248.91 161.639,248.91 161.639,248.91 Z" style="stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px; fill: rgb(255, 255, 255);"/>
                  <path d="M 154.555,248.201 C 154.555,250.373 152.93,252.185 150.772,252.599 150.775,252.707 150.777,252.815 150.777,252.924 150.777,257.749 147.711,261.661 143.929,261.661 140.147,261.661 137.081,257.749 137.081,252.924 137.081,250.52 137.842,248.343 139.074,246.763 139.074,246.763 108.271,201.209 108.271,201.209 108.271,201.209 116.182,195.859 116.182,195.859 116.182,195.859 148.639,243.858 148.639,243.858 149.02,243.764 149.42,243.714 149.832,243.714 152.44,243.714 154.555,245.723 154.555,248.201 154.555,248.201 154.555,248.201 154.555,248.201 Z" style="stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px; fill: rgb(255, 255, 255);"/>
                </g>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.205556; 0.422222; 0.700000; 0.877778" path="M 0,0 C 0,0 0,-4.19721 0,-4.19721 0,-4.19721 0,-2.84217e-14 0,-2.84217e-14 0,-2.84217e-14 0,-5.24651 0,-5.24651 0,-5.24651 0,0 0,0" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff9005" fill-opacity="1" id="Stroke_1561cdddf09f4b539b28885a2039a8d2" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="113.466" cy="192.755" rx="18.419" ry="16.53" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <ellipse cx="113.466" cy="192.755" rx="18.419" ry="16.53" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.205556; 0.372222; 0.583333; 0.794444" path="M 0,0 C 0,0 0,4.19721 0,4.19721 0,4.19721 0,0 0,0 0,0 0,5.24651 0,5.24651 0,5.24651 0,1.0493 0,1.0493" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff9005" fill-opacity="1" id="Stroke_eb651ccec2c0425a807ed944a28b1a40" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="198.477" cy="195.77" rx="16.058" ry="15.349" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <ellipse cx="198.477" cy="195.77" rx="16.058" ry="15.349" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.205556; 0.372222; 0.583333; 0.794444" path="M 0,0 C 0,0 0,4.19721 0,4.19721 0,4.19721 0,0 0,0 0,0 0,5.24651 0,5.24651 0,5.24651 0,1.0493 0,1.0493" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#000000" fill-opacity="1" id="Stroke_bd8ef478d88f44eda400d980ffd8e3a6" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="144.637" cy="120" rx="6.612" ry="17.711" style="stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
                <ellipse cx="144.637" cy="120" rx="6.612" ry="17.711" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#000000" fill-opacity="1" id="Stroke_29199cc523374aeab7ce36d757c9883a" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="171.321" cy="120.945" rx="6.848" ry="17.238" style="stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
                <ellipse cx="171.321" cy="120.945" rx="6.848" ry="17.238" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_6a3878f1a27545c4bff592bee9249b86" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="143.22" cy="111.263" rx="2.834" ry="7.557" style="stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
                <ellipse cx="143.22" cy="111.263" rx="2.834" ry="7.557" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_196d22dd532145b9b5158aa3881b44b1" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <ellipse cx="169.113" cy="111.943" rx="2.389" ry="6.514" style="stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
                <ellipse cx="169.113" cy="111.943" rx="2.389" ry="6.514" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgba(117, 32, 0, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#000000" fill-opacity="1" id="Stroke_a6468358403c43b893f3c87c920799ff" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 171.557,149.565 C 171.557,152.043 165.791,159.247 158.097,159.247 150.403,159.247 145.582,152.043 145.582,149.565 145.582,147.087 150.403,155.94 158.097,155.94 165.791,155.94 171.557,147.087 171.557,149.565 171.557,149.565 171.557,149.565 171.557,149.565 Z" style="stroke-width: 2px;"/>
                <path d="M 171.557,149.565 C 171.557,152.043 165.791,159.247 158.097,159.247 150.403,159.247 145.582,152.043 145.582,149.565 145.582,147.087 150.403,155.94 158.097,155.94 165.791,155.94 171.557,147.087 171.557,149.565 171.557,149.565 171.557,149.565 171.557,149.565 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff3f09" fill-opacity="1" id="Stroke_84828ffbec7247aeaa4d1e1c6a882ca4" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 208.427,92.512 C 215.961,99.508 164.028,102.19 159.548,98.03 167.62,98.03 165.881,87.153 161.081,87.153 171.442,96.363 107.965,102.99 103.101,98.666 130.62,88.799 161.166,62.625 158.52,65.318 158.52,65.318 165.685,78.628 165.685,78.628 165.685,78.628 188.052,66.746 188.052,66.746 188.052,66.746 208.427,92.512 208.427,92.512 208.427,92.512 208.427,92.512 208.427,92.512 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <path d="M 208.427,92.512 C 215.961,99.508 164.028,102.19 159.548,98.03 167.62,98.03 165.881,87.153 161.081,87.153 171.442,96.363 107.965,102.99 103.101,98.666 130.62,88.799 161.166,62.625 158.52,65.318 158.52,65.318 165.685,78.628 165.685,78.628 165.685,78.628 188.052,66.746 188.052,66.746 188.052,66.746 208.427,92.512 208.427,92.512 208.427,92.512 208.427,92.512 208.427,92.512 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
      <g transform="translate(0 0)">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="Stroke_3e521e50883f45bd8a6ed95e9c0282d8" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 201.012,293.275 C 201.012,293.275 201.212,308.035 201.212,308.035 201.212,308.035 115.217,308.035 115.217,308.035 115.217,308.035 115.217,292.778 115.217,292.778 115.217,292.778 115.244,292.778 115.244,292.778 115.72,285.913 119.287,281.132 127.5,281.132 135.713,281.132 136.796,287.404 142.573,293.938 142.573,293.938 150.607,280.163 157.399,281.463 169.561,283.79 171.984,297.404 174.038,293.945 190.864,265.605 199.463,295.377 201.012,293.275 201.012,293.275 201.012,293.275 201.012,293.275 Z" style="stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
                <path d="M 201.012,293.275 C 201.012,293.275 201.212,308.035 201.212,308.035 201.212,308.035 115.217,308.035 115.217,308.035 115.217,308.035 115.217,292.778 115.217,292.778 115.217,292.778 115.244,292.778 115.244,292.778 115.72,285.913 119.287,281.132 127.5,281.132 135.713,281.132 136.796,287.404 142.573,293.938 142.573,293.938 150.607,280.163 157.399,281.463 169.561,283.79 171.984,297.404 174.038,293.945 190.864,265.605 199.463,295.377 201.012,293.275 201.012,293.275 201.012,293.275 201.012,293.275 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(117, 32, 0); stroke-width: 2px;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.200000; 0.394444; 0.616667; 0.861111" path="M 0,0 C 0,0 0,-8.39442 0,-8.39442 0,-8.39442 -1.0493,-4.19721 -1.0493,-4.19721 -1.0493,-4.19721 -1.0493,-6.29581 -1.0493,-6.29581 -1.0493,-6.29581 -2.0986,-2.0986 -2.0986,-2.0986" repeatCount="indefinite"/>
      </g>
      <g fill="#ff3f09" fill-opacity="1" id="Stroke_ee476db24f844fcf9a63f57d622c6e6e" opacity="1" stroke="#00000000" stroke-opacity="1" stroke-width="0" transform="matrix(1, 0, 0, 1.21925, 0.859588, -20.1128)">
        <rect height="27.077" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgba(117, 32, 0, 0); stroke-width: 1.80241px;" width="123.351" x="101.501" y="64.4753"/>
      </g>
      <g transform="matrix(-0.758634, 0, 0, -0.311579, 258.288305, 92.002054)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ff3f09" fill-opacity="1" id="group-1" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 161.688,21.2381 C 177.71,33.0612 243.079,18.3774 248.584,22.882 248.584,22.882 233.112,30.971 233.112,30.971 251.836,37.576 272.578,59.211 268.474,81.479 267.098,88.942 271.225,103.256 274.575,109.16 292.643,141 269.665,175.852 246.891,179.417 224.116,182.982 202.385,164.596 196.441,128.693 195.536,123.228 195.084,117.852 195.051,112.655 191.664,109.088 188.769,104.967 186.493,100.425 183.492,100.601 180.441,100.691 177.348,100.691 164.525,100.691 152.402,99.144 141.638,96.393 136.246,102.498 129.318,107.474 121.374,110.863 122.125,118.449 121.887,126.533 120.517,134.809 114.572,170.712 96.9428,181.189 68.674,179.807 41.0494,178.739 20.6378,133.305 42.7634,91.0991 44.5357,85.4012 50.2954,83.0588 45.6714,73.0235 29.3874,51.9235 57.1607,20.3318 80.2112,22.7888 80.2112,22.7888 161.688,21.2381 161.688,21.2381 Z" style="stroke-width: 2px; stroke: rgba(117, 32, 0, 0);"/>
                <path d="M 161.688,21.2381 C 177.71,33.0612 243.079,18.3774 248.584,22.882 248.584,22.882 233.112,30.971 233.112,30.971 251.836,37.576 272.578,59.211 268.474,81.479 267.098,88.942 271.225,103.256 274.575,109.16 292.643,141 269.665,175.852 246.891,179.417 224.116,182.982 202.385,164.596 196.441,128.693 195.536,123.228 195.084,117.852 195.051,112.655 191.664,109.088 188.769,104.967 186.493,100.425 183.492,100.601 180.441,100.691 177.348,100.691 164.525,100.691 152.402,99.144 141.638,96.393 136.246,102.498 129.318,107.474 121.374,110.863 122.125,118.449 121.887,126.533 120.517,134.809 114.572,170.712 96.9428,181.189 68.674,179.807 41.0494,178.739 20.6378,133.305 42.7634,91.0991 44.5357,85.4012 50.2954,83.0588 45.6714,73.0235 29.3874,51.9235 57.1607,20.3318 80.2112,22.7888 80.2112,22.7888 161.688,21.2381 161.688,21.2381 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px; stroke: rgba(117, 32, 0, 0);"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.188889; 0.416667; 0.633333; 0.822222" path="M 0,0 C 0,0 0,9.23386 0,9.23386 0,9.23386 3.35777,3.35777 3.35777,3.35777 3.35777,3.35777 2.51833,10.9127 2.51833,10.9127 2.51833,10.9127 1.67888,2.51833 1.67888,2.51833" repeatCount="indefinite"/>
      </g>
    </g>
  </g>
</svg>`;

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    const NPC_DATA = {
        0: { char_id: 'CHAR_1_Cactus', name: 'Mr. Cactus', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Mr. Cactus: Welcome to the scorching desert.", "Mr. Cactus: Don't touch me! Just keep moving right."] },
        1: { char_id: 'CHAR_2_CowBoy', name: 'Cow Boy', svg_content: CHAR_SVG_2, initial_x: 500, dialogue: ["Cow Boy: Howdy, partner! This desert goes on forever.", "Cow Boy: You look like you're heading for the pyramids."] },
        2: { char_id: 'CHAR_3_CowGirl', name: 'Cow Girl', svg_content: CHAR_SVG_3, initial_x: 600, dialogue: ["Cow Girl: Careful of the sandstorms, they're sneaky!", "Cow Girl: Find the Triangle Fairy at the end!"] },
        3: { char_id: 'CHAR_4_FireGuy', name: 'Fire Guy', svg_content: CHAR_SVG_4, initial_x: 250, dialogue: ["Fire Guy: Phew! It's so hot I'm almost melting!", "Fire Guy: The desert holds many secrets, keep exploring!"] },
        4: { char_id: 'CHAR_5_PyramidHead', name: 'Pyramid Head', svg_content: CHAR_SVG_5, initial_x: 550, dialogue: ["Pyramid Head: The spirits of the sand guide your path.", "Pyramid Head: Do not falter. Continue your pilgrimage."] },
        5: { char_id: 'CHAR_6_Wolfy', name: 'Wolfy', svg_content: CHAR_SVG_6, initial_x: 350, dialogue: ["Wolfy: Aooooh! This place is lonely. Good luck finding the way out.", "Wolfy: The next phase will be your final test."] },
        6: { char_id: 'CHAR_7_SkullBones', name: 'Skull Bones', svg_content: CHAR_SVG_7, initial_x: 450, dialogue: ["Skull Bones: The end is nigh! Only the fairy can help you now.", "Skull Bones: But first, a word of advice: watch your step..."] },
        7: { char_id: 'TRIANGLE_FAIRY', name: 'Triangle Fairy', svg_content: TRIANGLE_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Triangle Fairy: Welcome, traveler, to the end of the Grand Desert.", "Triangle Fairy: You have mastered the sand and the heat.", "Triangle Fairy: You have earned your rest. Grand Desert complete!"] },
    };

    const MAX_TRANSITIONS = 7; // 7 transitions (Map 1 -> 2 -> ... -> 8). Total 8 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Desert Sky Gradient (Dusty Tan/Orange) -->
    <linearGradient id="desertSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 180, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 160, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Dune Gradient (Light Beige/Sand) -->
    <linearGradient id="sandDuneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 240, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 220, 170);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Dusty Tan) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#desertSkyGradient)" />

  <!-- 2. Sun (Intense Yellow/Orange) -->
  <circle cx="750" cy="80" r="100" fill="rgb(255, 210, 0)" />

  <!-- 3. Distant Horizon (Darker Sand) -->
  <path d="M0 350 Q200 320, 400 350 T800 340 V500 H0 Z"
        fill="rgb(180, 140, 60)" />

  <!-- 4. Main Ground Dune (Sand/Dune effect) - This is the primary platform -->
  <path d="M0 450 Q200 440, 400 450 T800 440 V500 H0 Z"
        fill="url(#sandDuneGradient)" />

  <!-- 5. Background Dune 1 (Far left) -->
  <path d="M0 450 Q100 400, 200 450"
        fill="rgb(210, 170, 90)"
        opacity="0.8" />

  <!-- 6. Background Dune 2 (Center-right) -->
  <path d="M500 450 Q650 420, 800 450 V500 H500 Z"
        fill="rgb(220, 180, 100)"
        opacity="0.9" />

  <!-- 7. Small Pyramid Silhouette (Distant detail) -->
  <g transform="translate(600, 320)" fill="rgb(160, 120, 50)" opacity="0.6">
    <polygon points="0,0 50,50 -50,50" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Desert Sky Gradient (Dusty Tan/Orange - Same as Map 1) -->
    <linearGradient id="desertSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 180, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 160, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Dune Gradient (Light Beige/Sand - Same as Map 1) -->
    <linearGradient id="sandDuneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255, 240, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 220, 170);stop-opacity:1" />
    </linearGradient>
    <!-- Pyramid Colors -->
    <linearGradient id="pyramidSideLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(210, 180, 140);"/>
      <stop offset="100%" style="stop-color:rgb(180, 150, 110);"/>
    </linearGradient>
  </defs>

  <!-- 1. Sky (Dusty Tan) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#desertSkyGradient)" />

  <!-- 2. Sun (Intense Yellow/Orange) -->
  <circle cx="750" cy="80" r="100" fill="rgb(255, 210, 0)" />

  <!-- 3. Distant Horizon (Darker Sand) -->
  <path d="M0 350 Q200 320, 400 350 T800 340 V500 H0 Z"
        fill="rgb(180, 140, 60)" />

  <!-- 4. Main Ground Dune (Steeper platform) -->
  <path d="M0 450 Q400 420, 800 450 V500 H0 Z"
        fill="url(#sandDuneGradient)" />

  <!-- 5. Pyramids (Closer detail, stylized version) -->
  <g transform="translate(150, 320)">
    <!-- Pyramid 1 (Smallest, furthest) -->
    <polygon points="0,0 70,130 -70,130" fill="url(#pyramidSideLight)" stroke="rgb(150, 120, 80)" stroke-width="1" />
    <!-- Pyramid 2 (Middle, slightly darker side) -->
    <polygon points="100,-10 200,130 0,130" fill="rgb(190, 160, 110)" stroke="rgb(150, 120, 80)" stroke-width="1" />
    <!-- Pyramid 3 (Largest, closest) -->
    <polygon points="150,-40 300,130 0,130" fill="url(#pyramidSideLight)" stroke="rgb(150, 120, 80)" stroke-width="1" />
  </g>

  <!-- 6. Small Cactus Silhouette (Background Detail) -->
  <rect x="700" y="380" width="10" height="70" fill="rgb(0, 100, 0)" />
  <circle cx="705" cy="380" r="15" fill="rgb(0, 100, 0)" />
  <rect x="695" y="400" width="20" height="10" fill="rgb(0, 100, 0)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Desert Sky Gradient (Dusty Tan/Orange - Same as Map 1) -->
    <linearGradient id="desertSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 180, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 160, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Sand/Rock Floor Gradient (More emphasis on rock/stone) -->
    <linearGradient id="rockFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(210, 180, 140);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 160, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Dusty Tan) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#desertSkyGradient)" />

  <!-- 2. Sun (Intense Yellow/Orange) -->
  <circle cx="750" cy="80" r="100" fill="rgb(255, 210, 0)" />

  <!-- 3. Distant Mesas/Canyons (Dark brown silhouette) -->
  <path d="M0 350 L150 280 L300 350 L500 250 L650 350 L800 300 V500 H0 Z"
        fill="rgb(120, 80, 40)" />

  <!-- 4. Main Ground (Flat and rocky platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#rockFloorGradient)" />

  <!-- 5. Tumbleweed Detail (Movement effect hint) -->
  <circle cx="100" cy="430" r="10" fill="rgb(160, 120, 80)" stroke="rgb(100, 70, 40)" stroke-width="1" />

  <!-- 6. Small Rocks/Pebbles (Ground detail) -->
  <g fill="rgb(140, 140, 140)" opacity="0.7">
    <circle cx="250" cy="445" r="5" />
    <ellipse cx="450" cy="440" rx="15" ry="5" />
    <circle cx="700" cy="448" r="4" />
  </g>

  <!-- 7. Small Desert Plant (Foreground detail) -->
  <path d="M50 450 V430 Q55 425, 60 430 V450" fill="rgb(0, 120, 0)" />
  <path d="M70 450 V435 Q75 428, 80 435 V450" fill="rgb(0, 100, 0)" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Desert Sky Gradient (Dusty Tan/Orange - Consistent) -->
    <linearGradient id="desertSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 180, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 160, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Floor Gradient (Main platform) -->
    <linearGradient id="sandFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(240, 220, 170);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 200, 150);stop-opacity:1" />
    </linearGradient>
    <!-- Oasis Water Color -->
    <stop id="oasisWater" stop-color="rgb(0, 170, 200)" />
  </defs>

  <!-- 1. Sky (Dusty Tan) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#desertSkyGradient)" />

  <!-- 2. Sun (Intense Yellow/Orange) -->
  <circle cx="750" cy="80" r="100" fill="rgb(255, 210, 0)" />

  <!-- 3. Distant Horizon (Darker Sand) -->
  <path d="M0 350 Q200 320, 400 350 T800 340 V500 H0 Z"
        fill="rgb(180, 140, 60)" />

  <!-- 4. Main Ground (Flat Sand Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sandFloorGradient)" />

  <!-- 5. Sandcastle/Fortress Silhouette (Background Detail) -->
  <g transform="translate(600, 350)" fill="rgb(255, 210, 0)" stroke="rgb(200, 160, 0)" stroke-width="1" opacity="0.9">
    <rect x="0" y="0" width="100" height="80" />
    <!-- Towers with Red Flags -->
    <rect x="-10" y="-30" width="20" height="30" />
    <polygon points="0,-30 10,-40 -10,-40" fill="red" />
    <rect x="90" y="-30" width="20" height="30" />
    <polygon points="100,-30 110,-40 90,-40" fill="red" />
  </g>

  <!-- 6. Oasis Pool (Foreground/Midground Feature) -->
  <g transform="translate(200, 430)">
    <ellipse cx="0" cy="0" rx="80" ry="25" fill="rgb(80, 190, 200)" />
    <!-- Palm Tree at Oasis -->
    <rect x="-5" y="-120" width="10" height="100" fill="rgb(139, 69, 19)" />
    <path d="M-50 -100 L 0 -140 L 50 -100 L 0 -120 Z" fill="rgb(0, 100, 0)" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Desert Sky Gradient (Dusty Tan/Orange - Consistent) -->
    <linearGradient id="desertSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 180, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 160, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Dark Rock Gradient -->
    <linearGradient id="darkRockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 110, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 80, 50);stop-opacity:1" />
    </linearGradient>
    <!-- Rocky Floor Gradient -->
    <linearGradient id="rockyFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(190, 160, 120);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(170, 140, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Dusty Tan) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#desertSkyGradient)" />

  <!-- 2. Sun (Intense Yellow/Orange) -->
  <circle cx="750" cy="80" r="100" fill="rgb(255, 210, 0)" />

  <!-- 3. Mesas/Cliffs (Darker, more imposing) -->
  <path d="M0 350 L100 250 L200 350 L350 200 L550 300 L650 250 L800 350 V500 H0 Z"
        fill="url(#darkRockGradient)" />
  <!-- Shadow detail on cliffs -->
  <path d="M100 250 L200 350 L150 300 Z" fill="black" opacity="0.1" />
  <path d="M550 300 L650 250 L600 275 Z" fill="black" opacity="0.1" />

  <!-- 4. Main Ground (Rocky Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#rockyFloorGradient)" />

  <!-- 5. Boulder Cluster (Left side detail) -->
  <g transform="translate(150, 430)" fill="rgb(150, 150, 150)" stroke="rgb(100, 100, 100)" stroke-width="1">
    <circle cx="0" cy="0" r="15" />
    <ellipse cx="25" cy="10" rx="20" ry="10" />
    <circle cx="-15" cy="15" r="8" />
  </g>

  <!-- 6. Wind Blown Sand/Dust Effect (Near the ground) -->
  <path d="M0 450 Q200 445, 400 450 T800 445" fill="none" stroke="rgb(255, 240, 200)" stroke-width="2" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.4;0.7" dur="4s" repeatCount="indefinite" />
  </path>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Sunset/Night Sky Gradient -->
    <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(50, 60, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 100, 140);stop-opacity:1" />
    </linearGradient>
    <!-- Sand Dune Gradient (Colder, shadowed tone) -->
    <linearGradient id="nightSandDuneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 130, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 100, 70);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Night/Sunset Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#nightSkyGradient)" />

  <!-- 2. Moon (or setting Sun) - Soft, ethereal light -->
  <circle cx="100" cy="100" r="80" fill="white" opacity="0.6" />

  <!-- 3. Distant Horizon (Darker Sand) - Silhouette -->
  <path d="M0 350 Q200 320, 400 350 T800 340 V500 H0 Z"
        fill="rgb(90, 70, 40)" />

  <!-- 4. Main Ground Dune (Colder Sand Platform) -->
  <path d="M0 450 Q200 440, 400 450 T800 440 V500 H0 Z"
        fill="url(#nightSandDuneGradient)" />

  <!-- 5. Silhouettes of Pyramids (Far Background) -->
  <g transform="translate(600, 300)" fill="rgb(50, 40, 20)" opacity="0.8">
    <polygon points="0,0 80,80 -80,80" />
    <polygon points="50,20 120,80 50,80" />
  </g>

  <!-- 6. Scattered Small Cactus (Foreground Silhouette) -->
  <rect x="150" y="400" width="10" height="50" fill="rgb(0, 80, 0)" />
  <rect x="400" y="410" width="10" height="40" fill="rgb(0, 60, 0)" />

  <!-- 7. Dust/Wind Effect (Soft, low-opacity movement) -->
  <path d="M0 450 Q200 445, 400 450 T800 445" fill="none" stroke="rgb(255, 255, 255)" stroke-width="1" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="5s" repeatCount="indefinite" />
  </path>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Midnight Sky Gradient (Very Dark Blue/Black) -->
    <linearGradient id="midnightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(20, 20, 40);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(40, 40, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Dark Sand Gradient (Deep Shadow) -->
    <linearGradient id="darkSandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 60, 40);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(60, 40, 20);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Midnight Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#midnightSkyGradient)" />

  <!-- 2. Stars/Night Glow (Small white dots) -->
  <g fill="white" opacity="0.8">
    <circle cx="150" cy="50" r="2" />
    <circle cx="300" cy="120" r="1" />
    <circle cx="500" cy="70" r="3" />
    <circle cx="650" cy="180" r="1.5" />
    <circle cx="780" cy="10" r="2.5" />
    <circle cx="40" cy="200" r="1" />
  </g>

  <!-- 3. Distant Dark Horizon (Extremely dark silhouette) -->
  <path d="M0 350 Q200 340, 400 350 T800 345 V500 H0 Z"
        fill="rgb(30, 20, 10)" />

  <!-- 4. Main Ground (Simple, dark sand platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#darkSandGradient)" />

  <!-- 5. Single Rock/Bone (Detail for Skull Bones NPC theme) -->
  <rect x="100" y="440" width="30" height="10" fill="rgb(150, 150, 150)" />
  <rect x="700" y="445" width="20" height="5" fill="rgb(160, 160, 160)" />

  <!-- 6. Subtle Fog/Mist (Low ground effect) -->
  <rect x="0" y="400" width="800" height="50" fill="white" opacity="0.05" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_8 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Final Sky Gradient (Deep, Mystical Violet/Blue) -->
    <linearGradient id="mysticalSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 50, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(100, 70, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Gold Light/Glow (For the final reveal) -->
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(255, 215, 0);stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(100, 70, 0);stop-opacity:0.3"/>
    </radialGradient>
    <!-- Sacred Ground Stone -->
    <linearGradient id="sacredStoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(150, 150, 150);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(120, 120, 120);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Mystical Violet) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#mysticalSkyGradient)" />

  <!-- 2. Pyramid Entrance/Structure (The backdrop for the Fairy) -->
  <g transform="translate(400, 450)">
    <!-- Main Large Pyramid Face (Left Side Shadowed) -->
    <polygon points="-300,0 0,-250 0,0" fill="rgb(100, 70, 40)" />
    <!-- Main Large Pyramid Face (Right Side Illuminated by the Fairy's glow) -->
    <polygon points="0,0 300,0 0,-250" fill="rgb(150, 110, 60)" />

    <!-- Pyramid Base/Platform -->
    <rect x="-400" y="0" width="800" height="50" fill="url(#sacredStoneGradient)" />

    <!-- Central Gold Symbol/Focus Point (Where the Fairy stands) -->
    <circle cx="0" cy="-100" r="100" fill="url(#goldGlow)" opacity="0.8" />
    <polygon points="-50,-100 50,-100 0,-150" fill="rgb(255, 215, 0)" stroke="rgb(200, 160, 0)" stroke-width="2" />
  </g>

  <!-- 3. Ground (Stone Platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#sacredStoneGradient)" />

  <!-- 4. Glowing Sand (Foreground light effect) -->
  <path d="M0 450 Q200 445, 400 450 T800 445" fill="none" stroke="rgb(255, 215, 0)" stroke-width="3" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
  </path>

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
    let activeNPCDialogue = null; // Stores the dialogue array for the current NPC interaction


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
            background-color: #e67e22; /* Desert/Orange color */
            color: white;
            border: 2px solid #f1c40f;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(230, 126, 34, 0.5);
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

        // Custom style for the Desert dialogue box (sand/orange/gold theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(230, 126, 34, 0.9); /* Desert Orange */
            border: 5px solid #f1c40f; /* Gold/Yellow Border */
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

        // Final Level Completion Check (Triangle Fairy is only NPC in phase 7)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:gold; font-size:36px; text-align:center; font-family: Arial, sans-serif;">
                    LEVEL COMPLETE!<br>The secrets of the Grand Desert are yours.
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
            background-color: #e67e22;
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
        phasesCompleted++;
        // Check if we need to change the background to the next map in the array
        if (currentMapIndex < BACKGROUND_SVGS.length - 1) {
            currentMapIndex++;
            updateMapSVG();
        }

        // Final NPC (Triangle Fairy) is automatically loaded with the last map (MAP_SVG_8)
    }

    function updateAvatar() {
        if (isLevelComplete) return;

        // Standard Platformer Physics (No Swimming Mode)
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