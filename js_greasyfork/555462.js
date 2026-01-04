// ==UserScript==
// @name         Drawaria Mechanic World Force 🌌🪐
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú temático de planetas con efectos galácticos aleatorios.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555462/Drawaria%20Mechanic%20World%20Force%20%F0%9F%8C%8C%F0%9F%AA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555462/Drawaria%20Mechanic%20World%20Force%20%F0%9F%8C%8C%F0%9F%AA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'mechanic-world-menu-container';
    const OVERLAY_ID = 'galactic-overlay';
    const DREAMCAST_SOUND_URL = 'https://www.myinstants.com/media/sounds/dreamcast_startup.mp3';
    const EFFECT_DURATION = 4000; // Duración base para los efectos

    // 1. Contenido del SVG (Se incluyen los IDs de los planetas)
    const menuSVG = `
        <svg id="mechanic-world-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-17.251 -27.109 877.782 653.226" xmlns:bx="https://boxy-svg.com">
          <g id="main-group" style="opacity: 0;">
            <g id="planet-1">
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(46, 151, 111); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);" cx="424.246" cy="292.9" rx="124.707" ry="120.532"/>
              <g>
                <path d="M 425.811 296.031 m -208.714 0 a 208.714 198.801 0 1 0 417.428 0 a 208.714 198.801 0 1 0 -417.428 0 Z M 425.811 296.031 m -160.71 0 a 160.71 153.076 0 0 1 321.42 0 a 160.71 153.076 0 0 1 -321.42 0 Z" bx:shape="ring 425.811 296.031 160.71 153.076 208.714 198.801 1@8f4e1ec6" style="stroke: rgb(0, 0, 0); fill: rgb(236, 216, 148); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
                <path fill="rgb(255,0,0)" stroke="rgb(255,0,0)" stroke-width="0" d="M 521.881 294.974 C 526.492 293.707 529.795 294.557 532.953 295.764 C 535.93 296.903 538.594 297.672 540.466 301.696 C 543.852 308.973 546.952 332.218 544.42 343.61 C 542.284 353.223 531.903 364.113 529.79 366.94 C 529.1 367.863 529.353 367.35 528.604 368.126 C 526.578 370.223 520.726 378.178 514.764 382.757 C 507.697 388.184 498.349 392.822 487.875 397.783 C 475.489 403.649 455.981 412.327 444.379 415.181 C 436.023 417.236 431.397 417.218 423.817 416.763 C 415.037 416.235 401.92 414.532 394.556 411.227 C 388.691 408.594 384.51 404.357 381.507 400.55 C 378.946 397.304 377.549 393.846 376.762 390.27 C 375.982 386.725 376.026 382.521 376.762 379.198 C 377.446 376.113 378.386 373.115 380.716 370.894 C 383.43 368.308 389.129 366.217 392.974 365.358 C 396.319 364.612 398.741 365.265 402.464 365.358 C 407.124 365.475 412.218 367.809 419.072 366.149 C 429.143 363.71 446.643 350.961 457.823 346.378 C 466.693 342.742 477.364 343.428 481.153 339.261 C 484.112 336.006 480.904 330.513 482.735 326.212 C 484.837 321.271 488.788 316.263 494.202 311.581 C 500.953 305.743 514.815 296.915 521.881 294.974 Z M 408.088 169.318 C 411.242 168.658 416.312 168.694 421.432 169.213 C 425.34 168.945 428.745 168.916 431.871 169.652 C 435.765 170.569 439.566 171.767 441.756 174.792 C 442.024 175.162 442.28 175.584 442.522 176.046 C 444.784 177.645 446.689 179.348 448.026 180.785 C 450.006 182.914 450.594 184.411 451.189 187.112 C 451.958 190.604 452.502 196.623 451.189 200.556 C 449.917 204.366 447.407 207.994 443.676 210.442 C 439.226 213.361 429.696 212.705 425.091 215.582 C 421.169 218.033 419.92 223.14 416.787 225.468 C 413.928 227.592 410.959 228.716 407.297 229.422 C 403.081 230.234 396.021 226.762 392.667 229.422 C 388.854 232.445 386.838 245.41 387.131 248.797 C 387.275 250.46 387.52 250.636 389.108 251.565 C 392.652 253.64 408.308 255.45 413.624 257.892 C 417.053 259.467 418.722 260.535 420.346 263.032 C 422.231 265.931 424.199 271.019 423.51 274.895 C 422.767 279.072 419.872 283.882 415.206 287.153 C 409.035 291.478 397.738 294.127 386.736 295.852 C 373.7 297.896 348.388 292.468 341.262 297.039 C 336.813 299.892 339.196 306.983 337.308 310.483 C 335.729 313.41 334.234 315.682 331.377 317.205 C 327.92 319.047 321.107 320.078 317.142 319.577 C 313.83 319.16 311.329 317.946 308.838 315.623 C 305.787 312.78 302.643 307.257 300.929 302.574 C 299.218 297.898 298.765 293.116 298.557 287.548 C 298.318 281.165 298.225 272.387 300.139 266.196 C 300.46 265.156 300.881 264.088 301.368 263.021 C 303.174 255.653 309.586 243.177 315.032 233.662 C 315.295 232.541 315.596 231.615 315.955 231.004 C 316.358 230.319 316.864 229.913 317.391 229.621 C 318.323 228.056 319.194 226.634 319.967 225.406 C 324.241 218.62 329.168 213.568 332.225 210.776 C 334.036 209.121 335.488 209.021 336.574 208.008 C 336.583 208 336.591 207.992 336.599 207.984 C 336.878 207.599 337.159 207.215 337.443 206.834 C 337.72 206.334 337.984 205.811 338.551 205.24 C 338.676 205.114 338.818 204.983 338.974 204.848 C 340.335 203.145 341.759 201.544 343.239 200.161 C 345.465 198.082 348.104 195.942 350.931 193.846 C 351.246 193.402 351.592 192.965 351.996 192.586 C 353.357 191.312 356.079 189.889 357.136 189.028 C 357.761 188.519 357.326 188.471 358.323 187.841 C 361.541 185.806 377.049 177.431 386.793 174.397 C 392.469 172.63 398.913 171.529 404.905 170.781 C 405.787 170.131 406.8 169.588 408.088 169.318 Z" style="fill: rgb(166, 209, 48); stroke: rgb(129, 151, 57); stroke-width: 2px; filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
              </g>
            </g>
            <g id="planet-2">
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(188, 146, 120); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);" cx="102.743" cy="104.555" rx="79.509" ry="78.138"/>
              <path d="M 24.275 82.214 C 29.368 117.576 193.676 103.544 180.947 82.841 C 187.148 75.607 202.182 98.594 198.495 102.895 C 198.152 139.231 3.942 141.915 3.594 105.402 C -2.076 97.842 19.957 76.457 24.275 82.214 Z" style="stroke: rgb(0, 0, 0); fill: rgb(204, 228, 13); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
            </g>
            <g id="planet-3">
              <path d="M 737.995 89.124 L 831.567 293.162 L 644.423 293.162 L 737.995 89.124 Z" bx:shape="triangle 644.423 89.124 187.144 204.038 0.5 0 1@e4f7bfe7" style="stroke: rgb(0, 0, 0); fill: rgb(238, 92, 172); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
              <path d="M 739.945 20.426 L 754.153 60.423 L 797.419 61.286 L 762.935 86.868 L 775.466 127.399 L 739.945 103.212 L 704.424 127.399 L 716.955 86.868 L 682.471 61.286 L 725.737 60.423 Z" bx:shape="star 739.945 79.559 60.432 59.133 0.4 5 1@df4505ac" style="stroke: rgb(0, 0, 0); fill: rgb(217, 208, 5); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
            </g>
            <g id="planet-4">
              <path style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(77, 97, 252);" transform="matrix(1.13773525, 0, 0, 1.2762394, -201.28422973, -137.07524399)" d="M 745.226 437.5 A 63.889 63.889 0 1 1 745.226 501.389 A 46.75 46.75 0 1 0 745.226 437.5 Z" bx:shape="crescent 800.556 469.444 63.889 300 0.7 1@79bf1587"/>
            </g>
            <g id="planet-5">
              <path d="M 421.111 451.111 Q 421.111 450.026 422.099 449.4 Q 423.154 448.732 424.532 449.136 Q 426.065 449.585 427.037 451.111 Q 428.129 452.826 427.954 455.062 Q 427.758 457.562 426.049 459.664 Q 424.157 461.993 421.111 462.963 Q 417.772 464.026 414.198 463.086 Q 410.315 462.064 407.426 459.012 Q 404.312 455.723 403.333 451.111 Q 402.286 446.174 404.004 441.235 Q 405.834 435.977 410.247 432.294 Q 414.921 428.393 421.111 427.407 Q 427.64 426.368 433.951 428.872 Q 440.582 431.504 445.06 437.284 Q 449.751 443.338 450.741 451.111 Q 451.774 459.229 448.482 466.914 Q 445.052 474.919 437.901 480.192 Q 430.469 485.674 421.111 486.667 Q 411.405 487.697 402.346 483.614 Q 392.967 479.387 386.898 470.864 Q 380.625 462.055 379.63 451.111 Q 378.602 439.817 383.476 429.383 Q 388.499 418.63 398.395 411.766 Q 408.58 404.701 421.111 403.704 Q 433.994 402.679 445.803 408.344 Q 457.93 414.163 465.589 425.432 Q 473.446 436.993 474.444 451.111 Q 475.468 465.581 469.01 478.765 Q 462.396 492.267 449.753 500.721 Q 436.816 509.371 421.111 510.37 Q 405.053 511.393 390.494 504.142 Q 375.618 496.733 366.37 482.716 Q 356.927 468.403 355.926 451.111 Q 354.905 433.465 362.948 417.531 Q 371.152 401.28 386.543 391.238 Q 402.231 381.002 421.111 380 Q 421.111 380 421.111 380" bx:shape="spiral 421.111 451.111 0 71.111 0 1080 1@7b5361f8" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(154, 40, 243);" transform="matrix(1.13773525, 0, 0, 1.13773263, -348.53858161, -1.47035197)"/>
            </g>
            <text style="fill: rgb(51, 51, 51); font-family: Armata; font-size: 45.3px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);" x="183.662" y="24.116">mechanic world force</text>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 4;0 0" begin="0.08s" dur="2s" fill="freeze" keyTimes="0; 0.498235; 1" repeatCount="indefinite"/>
            <animate attributeName="display" values="none;inline" begin="0s" dur="7s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="0;1" begin="6.56s" dur="2s" fill="freeze" keyTimes="0; 1"/>
          </g>
          <defs>
            <style bx:fonts="Armata">@import url(https://fonts.googleapis.com/css2?family=Armata%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 10 0 0.18 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="0.36"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-0" bx:preset="outline 1 1 #0a0d02" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
              <feFlood flood-color="#0a0d02" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-1" bx:preset="outline 1 2 #fdfefc" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
              <feFlood flood-color="#fdfefc" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-2" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-2" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-2" bx:preset="outline 1 1 #090a05" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
              <feFlood flood-color="#090a05" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-3" bx:preset="outline 1 1 #fbfcf8" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
              <feFlood flood-color="#fbfcf8" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <animate attributeName="opacity" values="1;0.93;1" dur="2s" fill="freeze" keyTimes="0; 0.508073; 1" repeatCount="indefinite"/>
          <path d="M 655 253.889 Q 655 252.66 656.119 251.951 Q 657.314 251.194 658.876 251.651 Q 660.612 252.16 661.713 253.889 Q 662.95 255.832 662.751 258.364 Q 662.53 261.196 660.594 263.578 Q 658.45 266.216 655 267.315 Q 651.217 268.519 647.168 267.454 Q 642.77 266.297 639.497 262.84 Q 635.97 259.113 634.861 253.889 Q 633.674 248.296 635.621 242.701 Q 637.694 236.745 642.693 232.572 Q 647.988 228.153 655 227.037 Q 662.396 225.86 669.545 228.697 Q 677.057 231.677 682.13 238.225 Q 687.444 245.083 688.565 253.889 Q 689.736 263.085 686.006 271.79 Q 682.121 280.858 674.02 286.833 Q 665.601 293.042 655 294.167 Q 644.005 295.333 633.742 290.708 Q 623.118 285.92 616.243 276.265 Q 609.137 266.287 608.009 253.889 Q 606.846 241.094 612.367 229.275 Q 618.057 217.094 629.267 209.318 Q 640.805 201.315 655 200.185 Q 669.593 199.024 682.971 205.442 Q 696.708 212.034 705.385 224.799 Q 714.285 237.896 715.417 253.889 Q 716.576 270.281 709.26 285.216 Q 701.768 300.511 687.446 310.087 Q 672.791 319.886 655 321.019 Q 636.809 322.177 620.316 313.963 Q 603.465 305.57 592.988 289.691 Q 582.291 273.478 581.157 253.889 Q 580.001 233.899 589.113 215.849 Q 598.406 197.44 615.841 186.064 Q 633.613 174.468 655 173.333 Q 654.947 173.336 655 173.333" bx:shape="spiral 655 253.889 0 80.556 0 1080 1@49ea94ca" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(154, 97, 205);" transform="matrix(2.290496, 0, 0, 2.290491, -186.831817, 41.404426)">
            <animateTransform type="scale" additive="sum" attributeName="transform" values="0 0;1 1;1 1" begin="-0.2s" dur="2.24s" fill="freeze" keyTimes="0; 0.93632; 1"/>
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="1;0" begin="1.52s" dur="0.48s" fill="freeze" keyTimes="0; 1"/>
          </path>
          <path style="stroke: rgb(0, 0, 0); fill: rgb(69, 142, 255); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); opacity: 0; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(2.290496, 0, 0, 2.340015, -143.491816, 53.996553)" d="M 585.992 181.389 A 102.778 102.778 0 1 1 585.992 284.167 A 75.207 75.207 0 1 0 585.992 181.389 Z" bx:shape="crescent 675 232.778 102.778 300 0.7 1@201d5036">
            <animate attributeName="opacity" values="1;1;0" begin="2.87s" dur="3.37s" fill="freeze" keyTimes="0; 0.916638; 1"/>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="0 0;1 1;1 1" begin="2.76s" dur="2.17s" fill="freeze" keyTimes="0; 0.902; 1"/>
          </path>
          <path d="M -123.89 192.154 L -96.147 271.797 L -11.668 273.515 L -79.001 324.455 L -54.533 405.16 L -123.89 357 L -193.247 405.16 L -168.779 324.455 L -236.112 273.515 L -151.633 271.797 Z" bx:shape="star -123.89 309.901 117.997 117.747 0.4 5 1@ee7d4a3f" style="stroke: rgb(0, 0, 0); fill: rgb(229, 248, 10); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); opacity: 0; transform-box: fill-box; transform-origin: 50% 50%;">
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;360" begin="4.65s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;500 0" begin="4.63s" dur="0.83s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="0;1" begin="4.61s" dur="0.22s" fill="freeze" keyTimes="0; 1"/>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;2 2" begin="5.94s" dur="0.99s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="1;0" begin="6.59s" dur="0.48s" fill="freeze" keyTimes="0; 1"/>
          </path>
          <path d="M 294.156 -87.983 C 294.156 -47.925 275.925 -15.451 253.436 -15.451 C 230.947 -15.451 212.716 -47.925 212.716 -87.983 C 212.716 -128.04 230.947 -160.51 253.436 -160.51 C 275.925 -160.51 294.156 -128.04 294.156 -87.983 Z" style="stroke: rgb(0, 0, 0); fill: rgb(30, 72, 207); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); stroke-width: 1; opacity: 0;">
            <animate attributeName="opacity" values="1;0.99;0" begin="1.73s" dur="0.65s" fill="freeze" keyTimes="0; 0.892467; 1"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 800" begin="1.74s" dur="0.26s" fill="freeze" keyTimes="0; 1"/>
          </path>
          <path d="M 633.973 -76.57 C 633.973 -36.512 615.742 -4.038 593.253 -4.038 C 570.764 -4.038 552.533 -36.512 552.533 -76.57 C 552.533 -116.63 570.764 -149.1 593.253 -149.1 C 615.742 -149.1 633.973 -116.63 633.973 -76.57 Z" style="stroke: rgb(0, 0, 0); fill: rgb(30, 72, 207); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); stroke-width: 1; opacity: 0;">
            <animate attributeName="opacity" values="1;0.99;0" begin="2.25s" dur="0.63s" fill="freeze" keyTimes="0; 0.892467; 1"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 800" begin="2.28s" dur="0.26s" fill="freeze" keyTimes="0; 1"/>
          </path>
          <path d="M 483.23 -107.92 C 483.23 -67.859 464.999 -35.385 442.51 -35.385 C 420.021 -35.385 401.79 -67.859 401.79 -107.92 C 401.79 -147.97 420.021 -180.44 442.51 -180.44 C 464.999 -180.44 483.23 -147.97 483.23 -107.92 Z" style="stroke: rgb(0, 0, 0); fill: rgb(30, 72, 207); filter: url(&quot;#drop-shadow-filter-2&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;); stroke-width: 1; opacity: 0;">
            <animate attributeName="opacity" values="1;0.99;0" begin="1.95s" dur="0.59s" fill="freeze" keyTimes="0; 0.892467; 1"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 800" begin="1.94s" dur="0.26s" fill="freeze" keyTimes="0; 1"/>
          </path>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo el botón de inicio y keyframes)
    GM_addStyle(`
        /* BOTÓN DE INICIO */
        #start-button-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: black;
            z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            transition: opacity 1.5s ease-out;
        }
        #start-button {
            width: 280px; height: 120px;
            background: #20b2aa; /* MediumAquaMarine */
            border: 5px solid #fff;
            border-radius: 8px;
            color: #1f3f4a;
            font-size: 24px;
            font-weight: bold;
            font-family: 'Armata', sans-serif;
            cursor: pointer;
            box-shadow: 0 0 20px #00ffff;
            text-align: center;
            line-height: 120px;
            user-select: none;
            transition: transform 0.1s;
        }
        #start-button:active {
            transform: scale(0.98);
        }

        /* MENÚ PRINCIPAL */
        #${MENU_ID} {
            position: fixed;
            top: 50px; left: 300px;
            width: 800px; /* Tamaño grande para ver bien el SVG */
            height: auto;
            z-index: 10001;
            cursor: grab;
            display: none; /* Inicialmente oculto */
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }
        /* Hacemos los planetas clicables */
        #planet-1, #planet-2, #planet-3, #planet-4, #planet-5 {
            cursor: pointer;
        }

        /* Contenedor de efectos (overlay transparente para albergar las partículas) */
        #${OVERLAY_ID} {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
        .effect-active {
            opacity: 1 !important;
            pointer-events: all !important;
        }

        /* --------------------------------- */
        /* EFECTO 1: Warp Speed (Distorsión y Estiramiento) */
        /* --------------------------------- */
        @keyframes warp-distort {
            0% { transform: scale(1) skew(0deg); opacity: 1; }
            10% { transform: scale(1.1) skew(-5deg); opacity: 0.5; }
            20% { transform: scale(0.8) skew(5deg); opacity: 1; }
            90% { transform: scale(1) skew(0deg); opacity: 1; }
        }
        .warp-speed {
            filter: hue-rotate(90deg);
            animation: warp-distort 0.4s ease-in-out infinite alternate;
        }

        /* --------------------------------- */
        /* EFECTO 2: Cosmic Rift (Grieta Cósmica) */
        /* --------------------------------- */
        @keyframes color-flicker {
            0%, 100% { background-color: rgba(50, 0, 100, 0.5); }
            50% { background-color: rgba(10, 0, 30, 0.7); }
        }
        .cosmic-rift {
            animation: color-flicker 0.2s linear infinite;
            background: rgba(50, 0, 100, 0.5);
            /* El efecto de grieta lo creamos con el backdrop-filter */
            backdrop-filter: hue-rotate(180deg) saturate(2);
            -webkit-backdrop-filter: hue-rotate(180deg) saturate(2);
        }

        /* --------------------------------- */
        /* EFECTO 3: Nebula Bloom (Partículas en Expansión) */
        /* --------------------------------- */
        @keyframes bloom-expand {
            0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
        }
        .nebula-particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 10px; height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--color), transparent 70%);
            animation: bloom-expand 4s ease-out forwards;
        }

        /* --------------------------------- */
        /* EFECTO 4: Galactic Glitch (Filtros de Errores) */
        /* --------------------------------- */
        @keyframes glitch-shift {
            0% { clip-path: inset(0 0 0 0); filter: saturate(1); }
            5% { clip-path: inset(10px 0 10px 0); filter: saturate(2); }
            10% { clip-path: inset(0 20px 0 0); filter: saturate(1); }
            15% { clip-path: inset(15px 0 5px 0); filter: saturate(2); }
            20% { clip-path: inset(0 0 0 0); filter: saturate(1); }
        }
        .galactic-glitch {
            animation: glitch-shift 0.2s infinite alternate;
            background-color: rgba(100, 0, 0, 0.1);
        }
    `);


    // 3. Funciones de Efectos (Galácticos y Aleatorios)

    /** Toca un sonido. */
    function playSound(url) {
        try {
            const audio = new Audio(url);
            audio.volume = 1;
            audio.play().catch(e => console.log("Audio playback failed:", e));
        } catch (error) {
            console.error("Error al reproducir el sonido:", error);
        }
    }

    /** Obtiene el overlay de efectos (o lo crea) y lo devuelve. */
    function getOverlay() {
        let overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            document.body.appendChild(overlay);
        }
        // Limpia el contenido y las clases antes de usar
        overlay.innerHTML = '';
        overlay.className = '';
        return overlay;
    }

    /**
     * EFECTO 1 (Planet-1): Warp Speed (Distorsión y Estiramiento)
     * Aplica una animación rápida a todo el <body>.
     */
    function effectWarpSpeed() {
        const body = document.body;
        body.classList.add('warp-speed');

        setTimeout(() => {
            body.classList.remove('warp-speed');
            body.style.filter = '';
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2 (Planet-2): Cosmic Rift (Grieta Cósmica)
     * Aplica filtros extremos y un flicker de color al overlay.
     */
    function effectCosmicRift() {
        const overlay = getOverlay();
        overlay.classList.add('cosmic-rift', 'effect-active');

        setTimeout(() => {
            overlay.classList.remove('cosmic-rift', 'effect-active');
            overlay.style.backdropFilter = 'none';
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 3 (Planet-3): Nebula Bloom (Partículas en Expansión)
     * Genera una ráfaga de partículas de colores que se expanden desde el centro.
     */
    function effectNebulaBloom() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');
        const particleColors = ['#ff66ff', '#00ffff', '#ffff66', '#ff0000', '#00ff00'];

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'nebula-particle';
            particle.style.setProperty('--color', particleColors[Math.floor(Math.random() * particleColors.length)]);
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            overlay.appendChild(particle);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 4 (Planet-4): Galactic Glitch (Filtros de Errores)
     * Aplica un efecto de "falla" visual mediante clip-path y filtros.
     */
    function effectGalacticGlitch() {
        const overlay = getOverlay();
        overlay.classList.add('galactic-glitch', 'effect-active');

        setTimeout(() => {
            overlay.classList.remove('galactic-glitch', 'effect-active');
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 5 (Planet-5): Black Hole Pull (Atracción de Agujero Negro)
     * La pantalla se "oscurece" y los elementos se acercan brevemente al centro.
     */
    function effectBlackHolePull() {
        const body = document.body;
        body.style.transition = 'transform 0.5s ease-in-out, filter 1s';
        body.style.transformOrigin = 'center center';

        // 1. Oscurecer y Aplicar Filtro de Distorsión
        body.style.filter = 'saturate(0.5) blur(2px)';
        body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        // 2. Aplicar "Atracción" (Zoom rápido y vuelta)
        setTimeout(() => {
            body.style.transform = 'scale(0.9)';
        }, 50);

        // 3. Restaurar después de la duración
        setTimeout(() => {
            body.style.transform = 'scale(1)';
            body.style.filter = '';
            body.style.backgroundColor = '';
            setTimeout(() => {
                 body.style.transition = ''; // Eliminar transición después de la restauración
            }, 500);
        }, EFFECT_DURATION);
    }

    /**
     * Mapea y ejecuta el efecto del planeta.
     */
    function handlePlanetClick(event) {
        // Sonido de hada para feedback
        playSound(DREAMCAST_SOUND_URL); // Reutilizamos el sonido de Dreamcast, o un sonido genérico.

        // Identificar el planeta
        const planetId = event.currentTarget.id;

        const effectMap = {
            'planet-1': effectWarpSpeed,
            'planet-2': effectCosmicRift,
            'planet-3': effectNebulaBloom,
            'planet-4': effectGalacticGlitch,
            'planet-5': effectBlackHolePull
        };

        // Ocultar el menú temporalmente
        const menuContainer = document.getElementById(MENU_ID);
        if(menuContainer) menuContainer.style.opacity = '0.3';

        if (effectMap[planetId]) {
            effectMap[planetId]();
        } else {
            console.warn(`Planeta sin efecto asignado: ${planetId}`);
        }

        // Mostrar el menú de nuevo
        setTimeout(() => {
             if(menuContainer) menuContainer.style.opacity = '1';
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Activación y Dragging

    function handleStartButtonClick() {
        // 1. Sonido de Dreamcast
        playSound(DREAMCAST_SOUND_URL);

        // 2. Ocultar el botón de inicio con fade out
        const startOverlay = document.getElementById('start-button-overlay');
        startOverlay.style.opacity = 0;

        // 3. Mostrar el menú SVG
        const menuContainer = document.getElementById(MENU_ID);
        menuContainer.style.display = 'block';

        // 4. Activar las animaciones SVG
        const mainGroup = document.getElementById('main-group');
        mainGroup.style.opacity = 1; // Hacer visible el SVG

        const svgElement = document.getElementById('mechanic-world-svg');
        // Para reproducir la animación sincronizada con la música (o desde el inicio)
        svgElement.setCurrentTime(0);

        // 5. Eliminar el overlay después de la transición
        setTimeout(() => startOverlay.remove(), 1500);
    }

    /**
     * Hace un elemento HTML arrastrable.
     */
    function dragElement(element) {
        let pos3 = 0, pos4 = 0;
        let isDragging = false;
        const DRAG_THRESHOLD = 5;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Solo permitir el clic/drag si el clic es dentro del SVG
            if (!e.target.closest('#mechanic-world-svg')) return;

            isDragging = false;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            const dx = e.clientX - pos3;
            const dy = e.clientY - pos4;

            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                isDragging = true;

                element.style.top = (element.offsetTop + dy) + "px";
                element.style.left = (element.offsetLeft + dx) + "px";

                pos3 = e.clientX;
                pos4 = e.clientY;
            }
        }

        function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;

            if (!isDragging) {
                // Si no hubo arrastre, se considera un clic en un planeta.
                // Usamos e.target para encontrar el planeta clicado
                const clickedPlanet = e.target.closest('#planet-1, #planet-2, #planet-3, #planet-4, #planet-5');
                if (clickedPlanet) {
                    handlePlanetClick({ currentTarget: clickedPlanet, preventDefault: () => {} });
                }
            }
        }
    }


    // 5. Inicialización
    window.addEventListener('load', () => {
        // 5.1. Crear el contenedor del menú (inicialmente oculto)
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Crear el Overlay del Botón de Inicio
        const startOverlay = document.createElement('div');
        startOverlay.id = 'start-button-overlay';
        startOverlay.innerHTML = '<div id="start-button">START MECHANIC WORLD FORCE</div>';
        document.body.appendChild(startOverlay);

        // 5.3. Asignar eventos
        document.getElementById('start-button').addEventListener('click', handleStartButtonClick);

        // 5.4. Hacer el menú arrastrable (y manejar clics en planetas a través de dragElement)
        dragElement(menuContainer);
    });

})();