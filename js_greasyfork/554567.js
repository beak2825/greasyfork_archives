// ==UserScript==
// @name         Drawaria Game Level 6 - Sky Mountains
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Level 6: Sky Mountains. Ascend the icy peaks and face the cold wind of the high altitude.
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

    const LEVEL_TITLE = "Sky Mountains";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-mountain.mp3";
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
    const FLOATING_Y = 300; // Y position for floating NPCs (nicely_stars)

    // --- 2. NPC DATA AND DIALOGUE CONFIGURATION ---

    // Character SVG Placeholders
    const CHAR_SVG_1 = `<?xml version="1.0" encoding="utf-8"?>
<svg width="100" height="100" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <defs>
    <style>
      /* Estilo principal: relleno gris claro, contorno negro grueso */
      .chick-element {
        fill: #CCCCCC;
        stroke: black;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      /* Estilo para contornos internos (sin relleno) */
      .chick-inner-outline {
        fill: none;
        stroke: black;
        stroke-width: 3;
        stroke-linejoin: miter;
      }
      /* Detalles del ojo */
      .eye {
        fill: white;
        stroke: black;
        stroke-width: 2;
      }
      .pupil {
        fill: black;
      }
    </style>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 5 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <g transform="matrix(1, 0, 0, 1, -14, 0)" style="filter: url(&quot;#inner-shadow-filter-0&quot;);">
    <g transform="matrix(1, 0, 0, 1, 14.861, 9.303002)">
      <path d="M 128.465 203.173 L 143.465 203.173 L 143.465 229.642 C 152.196 229.705 159.228 232.772 159.228 236.547 C 159.228 240.361 152.048 243.453 143.191 243.453 C 134.334 243.453 127.154 240.361 127.154 236.547 C 127.154 235.322 127.895 234.171 129.195 233.173 L 128.465 233.173 L 128.465 203.173 Z" class="chick-element" style="stroke-width: 3; stroke: rgb(107, 53, 0); fill: rgb(255, 158, 100); transform-box: fill-box; transform-origin: 50% 50%;">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-12" begin="0s" dur="1s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
      </path>
      <path d="M 115.237 237.433 C 115.237 241.247 108.057 244.339 99.2 244.339 C 90.343 244.339 83.163 241.247 83.163 237.433 C 83.163 236.208 83.904 235.057 85.204 234.059 L 84.474 234.059 L 84.474 204.059 L 99.474 204.059 L 99.474 230.528 C 108.205 230.591 115.237 233.658 115.237 237.433 Z" style="stroke-width: 3px; stroke: rgb(107, 53, 0); fill: rgb(255, 158, 100); transform-box: fill-box; transform-origin: 50% 50%;">
        <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;11" begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </path>
    </g>
    <g transform="matrix(1, 0, 0, 1, 10, 10)">
      <path d="M 16.737 163.113 L 18.516 151.738 L 8.459 150.149 L 15.775 142.136 L 8.459 134.123 L 18.516 132.534 L 16.737 121.159 L 21.61 124.119 C 32.857 93.739 73.335 71.246 121.547 71.246 C 178.456 71.246 224.59 102.586 224.59 141.246 C 224.59 179.906 178.456 211.246 121.547 211.246 C 74.101 211.246 34.144 189.462 22.168 159.814 L 16.737 163.113 Z" style="stroke-width: 3px; stroke: rgb(107, 53, 0); fill: rgb(249, 255, 233);"/>
      <path d="M 204.59 141.246 C 204.59 171.622 173.25 196.246 134.59 196.246 C 103.756 196.246 77.578 180.582 68.243 158.829 L 77.818 152.446 L 64.657 143.672 C 64.613 142.874 64.59 142.071 64.59 141.265 L 77.818 132.446 L 67.48 125.554 C 76.077 102.824 102.869 86.246 134.59 86.246 C 173.25 86.246 204.59 110.87 204.59 141.246 Z" class="chick-inner-outline" style="stroke: rgb(107, 53, 0); fill: rgb(249, 255, 233);"/>
      <g>
        <ellipse style="stroke-width: 3; stroke: rgb(107, 53, 0); fill: rgb(255, 142, 44);" cx="256.808" cy="93.038" rx="11.749" ry="4.2"/>
        <ellipse style="stroke-width: 3; stroke: rgb(107, 53, 0); fill: rgb(255, 142, 44);" cx="256.965" cy="100.807" rx="11.749" ry="4.2"/>
        <circle class="chick-element" cx="214.59" cy="91.246" r="35" style="stroke: rgb(107, 53, 0); fill: rgb(249, 255, 233);"/>
        <g transform="matrix(1, 0, 0, 1, 14.590079, -8.753989)" style="">
          <line class="chick-inner-outline" x1="214.682" y1="85.936" x2="229.682" y2="90.936" style="stroke-width: 4; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000012, 0.000001)"/>
          <circle class="eye" cx="220" cy="95" r="5"/>
          <circle class="pupil" cx="221" cy="95" r="1.5"/>
        </g>
        <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 3" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
      </g>
    </g>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;30 0" begin="0s" dur="9.35s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_2 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="173" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="165" xmlns:bx="https://boxy-svg.com">
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
    <path d="M 358.729 154.31 C 358.729 157.039 359.811 162.424 359.811 162.424 L 359.811 345.277 L 102.3 345.277 L 102.3 162.424 L 102.646 162.424 C 102.417 159.745 102.301 157.039 102.301 154.31 C 102.301 93.658 159.704 44.49 230.515 44.49 C 301.326 44.49 358.729 93.658 358.729 154.31 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(138, 186, 216);"/>
    <path d="M 181.052 281.831 C 187.69 196.274 361.224 214.542 356.003 281.831 L 356.003 344.773 L 181.052 344.773 L 181.052 281.831 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(255, 255, 255);"/>
    <g style="transform-origin: 174.252px 356.638px;">
      <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(216, 186, 138);" cx="174.252" cy="356.638" rx="42.738" ry="18.935"/>
      <path d="M 211.96 349.03 C 211.96 350.159 206.749 351.075 200.321 351.075 C 193.893 351.075 188.682 350.159 188.682 349.03 C 188.682 347.901 193.893 346.985 200.321 346.985 C 206.749 346.985 211.96 347.901 211.96 349.03 Z M 214.477 361.456 C 214.477 362.585 209.266 363.501 202.838 363.501 C 196.41 363.501 191.199 362.585 191.199 361.456 C 191.199 360.327 196.41 359.411 202.838 359.411 C 209.266 359.411 214.477 360.327 214.477 361.456 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177);"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;11" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <g style="transform-origin: 296.516px 352.852px;">
      <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(216, 186, 138);" cx="296.516" cy="352.852" rx="39.492" ry="17.312"/>
      <path d="M 331.494 344.862 C 331.494 345.991 326.283 346.907 319.855 346.907 C 313.427 346.907 308.216 345.991 308.216 344.862 C 308.216 343.733 313.427 342.817 319.855 342.817 C 326.283 342.817 331.494 343.733 331.494 344.862 Z M 334.011 357.288 C 334.011 358.417 328.8 359.333 322.372 359.333 C 315.944 359.333 310.733 358.417 310.733 357.288 C 310.733 356.159 315.944 355.243 322.372 355.243 C 328.8 355.243 334.011 356.159 334.011 357.288 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177);"/>
      <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-12" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    </g>
    <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(216, 196, 138);" cx="270.11" cy="184.544" rx="26.711" ry="10.487"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(216, 196, 138);" cx="270.786" cy="166.566" rx="26.711" ry="10.487"/>
    <path d="M 260.56 101.575 C 260.56 107.367 249.512 101.13 234.76 101.13 C 220.008 101.13 207.138 107.367 207.138 101.575 C 207.138 95.783 219.097 91.088 233.849 91.088 C 248.601 91.088 260.56 95.783 260.56 101.575 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177);"/>
    <path d="M 333.617 104.306 C 333.617 110.098 322.569 103.861 307.817 103.861 C 293.065 103.861 280.195 110.098 280.195 104.306 C 280.195 98.514 292.154 93.819 306.906 93.819 C 321.658 93.819 333.617 98.514 333.617 104.306 Z" style="stroke-width: 3px; stroke: rgb(69, 125, 177);"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177);" cx="234.305" cy="133.005" rx="17.765" ry="20.498"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(69, 125, 177);" cx="305.366" cy="135.738" rx="16.854" ry="20.498"/>
    <path style="stroke-width: 3px; stroke: rgb(69, 125, 177); fill: rgb(138, 186, 216);" d="M 157.789 243.455 L 155.056 295.384 C 155.803 320.048 193.888 318.719 193.319 299.939 L 192.408 238.9"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;39 0" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CHAR_SVG_3 = `<svg height="173" inkscape:export-xdpi="96" inkscape:export-ydpi="96" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 165 173" width="165" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Animation</title>
    <defs/>
    <sodipodi:namedview bordercolor="#666666" borderlayer="true" inkscape:document-units="px" inkscape:pagecheckerboard="true" pagecolor="#ffffff"/>
    <metadata>
        <rdf:RDF>
            <cc:Work>
                <dc:format>image/svg+xml</dc:format>
                <dc:type rdf:resource="http://purl.org/dc/dcmitype/MovingImage"/>
                <dc:title>Animation</dc:title>
            </cc:Work>
        </rdf:RDF>
    </metadata>
    <g id="Composition_5c2d845b6dda42d2a53183137af201f4" inkscape:groupmode="layer" inkscape:label="Animation">
        <g transform="translate(-7.57849 6.88953)">
            <g transform="rotate(0.0961538)">
                <g transform="scale(1 1)">
                    <g transform="translate(0 0)">
                        <g id="Layer_d12d6a96496342f18955574e7b0934f0" inkscape:groupmode="layer" inkscape:label="Layer" opacity="1">
                            <g fill="#acfff8" fill-opacity="1" id="Stroke_f1fd28c6513a4580838988184d7aeed8" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <rect height="119.863" ry="32.24599838256836" style="stroke:none;" width="116.027" x="27.402" y="16.769"/>
                                <rect height="119.863" ry="32.24599838256836" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;" width="116.027" x="27.402" y="16.769"/>
                            </g>
                            <g transform="translate(1.79513 -4.55011)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g fill="#acfff8" fill-opacity="1" id="Stroke_61ff8ddc0190488c9e4cbde37550b088" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3">
                                                <ellipse cx="35.307" cy="141.257" rx="16.56" ry="16.56" style="stroke:none;"/>
                                                <ellipse cx="35.307" cy="141.257" rx="16.56" ry="16.56" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="4.200000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.436508; 0.674603" path="M 0,0 C 0,0 -13.8276,-28.9129 -13.8276,-28.9129 -13.8276,-28.9129 2.05992,-4.13718 2.05992,-4.13718" repeatCount="indefinite"/>
                            </g>
                            <g transform="translate(1.79513 -4.55011)">
                                <g transform="rotate(0)">
                                    <g transform="scale(1 1)">
                                        <g transform="translate(0 0)">
                                            <g fill="#acfff8" fill-opacity="1" id="Stroke_446af423fe81402c85bc9f0432a6d5d8" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3">
                                                <ellipse cx="116.538" cy="143.277" rx="16.56" ry="16.56" style="stroke:none;"/>
                                                <ellipse cx="116.538" cy="143.277" rx="16.56" ry="16.56" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="4.200000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.436508; 0.674603" path="M 0,0 C 0,0 -13.8276,-28.9129 -13.8276,-28.9129 -13.8276,-28.9129 2.05992,-4.13718 2.05992,-4.13718" repeatCount="indefinite"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_0da75727ff454cd3b269b182a696c678" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="56.07" cy="64.173" rx="12.617" ry="12.617" style="stroke:none;"/>
                                <ellipse cx="56.07" cy="64.173" rx="12.617" ry="12.617" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_f4d434e4ddef4dfb933f3832d48017d5" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 113.237,21.699 C 115.879,21.409 124.956,22.162 128.865,23.715 131.936,24.936 134.195,27.176 135.67,29.008 136.853,30.477 137.314,31.684 137.686,33.545 138.15,35.861 138.457,39.807 137.686,42.115 137.014,44.13 135.665,45.924 133.906,46.904 131.982,47.977 128.46,48.472 126.344,47.912 124.409,47.401 122.656,45.568 121.555,44.132 120.569,42.845 120.984,40.747 119.79,39.847 118.413,38.808 115.15,39.666 113.237,38.838 111.387,38.038 109.429,36.817 108.448,35.058 107.376,33.134 106.88,29.612 107.44,27.496 107.951,25.561 110.115,23.648 111.221,22.707 111.963,22.075 112.023,21.832 113.237,21.699 113.237,21.699 113.237,21.699 113.237,21.699 Z" sodipodi:nodetypes="cccccccccccccc" style="stroke:none;"/>
                                <path d="M 113.237,21.699 C 115.879,21.409 124.956,22.162 128.865,23.715 131.936,24.936 134.195,27.176 135.67,29.008 136.853,30.477 137.314,31.684 137.686,33.545 138.15,35.861 138.457,39.807 137.686,42.115 137.014,44.13 135.665,45.924 133.906,46.904 131.982,47.977 128.46,48.472 126.344,47.912 124.409,47.401 122.656,45.568 121.555,44.132 120.569,42.845 120.984,40.747 119.79,39.847 118.413,38.808 115.15,39.666 113.237,38.838 111.387,38.038 109.429,36.817 108.448,35.058 107.376,33.134 106.88,29.612 107.44,27.496 107.951,25.561 110.115,23.648 111.221,22.707 111.963,22.075 112.023,21.832 113.237,21.699 113.237,21.699 113.237,21.699 113.237,21.699 Z" sodipodi:nodetypes="cccccccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_fbd82cf254b84a9daa80503bf8ef3618" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="111.09" cy="48.207" rx="6.049" ry="6.049" style="stroke:none;"/>
                                <ellipse cx="111.09" cy="48.207" rx="6.049" ry="6.049" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_88321adfb99842ae82e5d39617c3846b" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <ellipse cx="88.685" cy="65.215" rx="12.617" ry="12.617" style="stroke:none;"/>
                                <ellipse cx="88.685" cy="65.215" rx="12.617" ry="12.617" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                            <g fill="#ffffff" fill-opacity="1" id="Stroke_af16b55d9cdb402b8526b303f0453888" inkscape:label="Group" opacity="1" stroke="#4db5ff" stroke-opacity="1" stroke-width="3" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M 63.146,90.062 C 63.146,90.062 84.544,90.062 84.544,90.062 84.544,90.062 84.544,97.451 84.544,97.451 84.716,98.096 84.806,98.768 84.806,99.457 84.806,104.502 79.957,108.591 73.976,108.591 67.995,108.591 63.146,104.502 63.146,99.457 63.146,99.014 63.183,98.578 63.256,98.152 63.256,98.152 63.146,98.152 63.146,98.152 63.146,98.152 63.146,90.062 63.146,90.062 63.146,90.062 63.146,90.062 63.146,90.062 Z" sodipodi:nodetypes="ccccccccc" style="stroke:none;"/>
                                <path d="M 63.146,90.062 C 63.146,90.062 84.544,90.062 84.544,90.062 84.544,90.062 84.544,97.451 84.544,97.451 84.716,98.096 84.806,98.768 84.806,99.457 84.806,104.502 79.957,108.591 73.976,108.591 67.995,108.591 63.146,104.502 63.146,99.457 63.146,99.014 63.183,98.578 63.256,98.152 63.256,98.152 63.146,98.152 63.146,98.152 63.146,98.152 63.146,90.062 63.146,90.062 63.146,90.062 63.146,90.062 63.146,90.062 Z" sodipodi:nodetypes="ccccccccc" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
            <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="4.200000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.428571; 0.666667" path="M 0,0 C 0,0 22.7355,2.06686 22.7355,2.06686 22.7355,2.06686 -2.06686,1.42109e-14 -2.06686,1.42109e-14" repeatCount="indefinite"/>
        </g>
    </g>
</svg>
`;
    const CHAR_SVG_4 = `<?xml version="1.0" encoding="utf-8"?>
<svg height="165" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="165" xmlns:bx="https://boxy-svg.com">
  <g style="transform-origin: 152.011px 228.855px;">
    <path d="M 152.011 116.762 L 194.817 177.526 L 261.95 202.393 L 221.273 264.815 L 219.957 340.948 L 152.011 318.763 L 84.065 340.948 L 82.749 264.815 L 42.072 202.393 L 109.205 177.526 Z" bx:shape="star 152.011 240.689 115.597 123.927 0.63 5 1@f2bc02f2" style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 241, 61);"/>
    <path style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);" d="M 128.058 252.884 L 186.383 252.884 C 187.226 299.735 128.963 303.208 128.058 252.884 Z"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);" cx="124.414" cy="213.832" rx="15.101" ry="15.1"/>
    <ellipse style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);" cx="183.254" cy="216.435" rx="15.101" ry="15.1"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;20 40" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;3" begin="0s" dur="1.89s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
  <g style="transform-origin: 358.212px 134.986px;">
    <path d="M 358.212 33.449 L 403.213 89.754 L 459.23 134.986 L 403.213 180.218 L 358.212 236.523 L 313.211 180.218 L 257.194 134.986 L 313.211 89.754 Z" bx:shape="star 358.212 134.986 101.018 101.537 0.63 4 1@0f61cc12" style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 241, 61);"/>
    <path style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);" d="M 337.643 148.003 L 383.007 148.003 C 383.663 184.083 338.347 186.758 337.643 148.003 Z"/>
    <path d="M 346.554 117.928 C 346.554 124.351 341.296 114.657 334.809 114.657 C 328.322 114.657 323.064 124.351 323.064 117.928 C 323.064 111.505 328.322 106.299 334.809 106.299 C 341.296 106.299 346.554 111.505 346.554 117.928 Z" style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);"/>
    <path d="M 392.319 119.932 C 392.319 126.355 387.061 116.661 380.574 116.661 C 374.087 116.661 368.829 126.355 368.829 119.932 C 368.829 113.509 374.087 108.303 380.574 108.303 C 387.061 108.303 392.319 113.509 392.319 119.932 Z" style="stroke-width: 3px; stroke: rgb(121, 82, 33); fill: rgb(255, 255, 255);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-40 -20" begin="0s" dur="9s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="1.63s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>`;
    const CUBE_FAIRY_SVG_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<svg height="700" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 500 500" width="700" xmlns="http://www.w3.org/2000/svg">
  <title/>
  <g id="Composition_445b829fca0b4132b3d29b0a3ad1fc42">
    <g id="Layer_624346cd05d646f7a3f94e5fac2a1f6e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
      <g id="Layer_62250bd6ab7a4da19142a88de5b1f690" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
        <g id="Layer_289871e692ec49548e910714011b29d5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
          <g id="Layer_605d6403a529440bad1ca6279a6fbffb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
            <g id="Layer_0faf33997edd4f84a47e7fc145bdca2a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
              <g id="Layer_0d1afe9409b44391bc4da60c4c40410a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                <g id="Layer_f3b30ec9f300423eb47305caf9da22b9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                  <g transform="translate(0 0)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_578939f9ef5948a99969d70000425c72" opacity="1">
                            <g id="Group_3546f761a4bc4a4fa3f2648a6ec0dab9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_4931839c20154578afe4254fa9a3f272" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_57e8a96570064a13b5821bf70e0482cc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4d263dd0743449e1bbed711b422bece5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_60f642c4c27c4987866e82f8de63a28d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_4b7876e756884ac28a05d4830f8e2767" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_dd0ceb27508e4ef7b40ed67c059ec48a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_d0f537ddf8c2492592085fc466e5c589" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_0910e13e62a3425ca744f9366b75b1ff" opacity="1" transform="matrix(-0.177927, 0.984044, -0.984044, -0.177927, 232.909, 58.6668)">
                                              <g id="Group_70b6aa5054fa418bb18a8a530275ab8a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_6aad8811b5a34308b46c779638ca5883" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_ada09a9e3957429ea8ad2b2e4863a825" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 91.949,36.212 C 91.949,36.212 234.759,30.017 234.759,30.017 234.759,30.017 238.941,146.341 238.941,146.341 244.172,136.214 96.782,121.014 92.078,130.119 92.078,130.119 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_afe42cc27815441b9b1b80fb9c05599f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_407c2d8105634716b3cf87b6c1d19586" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_92c3038cb3ce4b7d87316d9bbc969208" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 91.949,36.212 C 91.949,36.212 234.759,30.017 234.759,30.017 234.759,30.017 238.941,146.341 238.941,146.341 244.172,136.214 96.782,121.014 92.078,130.119 92.078,130.119 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_37337e3c3da24a1c9cebe7ba9dfb7877" opacity="1" transform="matrix(0.177927, 0.984044, -0.984044, 0.177927, 444.508, -116.305)">
                                              <g id="Group_ca67085633b44936bad142cac42e003f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_cce31530b92141fcafa11267756a6346" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_ad2c1fe7d3c446fd8d11f2ed1e2887dc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 216.969,261.288 C 216.969,261.288 359.779,267.483 359.779,267.483 359.779,267.483 363.961,151.159 363.961,151.159 369.192,161.286 221.802,176.486 217.098,167.381 217.098,167.381 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_9f262dc44b3e491b82062f66875c4d3f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_4bec6e9f6bfc45dfbcb9d017286e41c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_2a4fd8529faa4ee8bbcfe77c5f352e23" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 216.969,261.288 C 216.969,261.288 359.779,267.483 359.779,267.483 359.779,267.483 363.961,151.159 363.961,151.159 369.192,161.286 221.802,176.486 217.098,167.381 217.098,167.381 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.166667; 0.427778; 0.733333" path="M 0,0 C 0,0 0,5.24651 0,5.24651 0,5.24651 0,-1.0493 0,-1.0493 0,-1.0493 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(416.363 -0.815729)" style="">
                    <g transform="rotate(0)">
                      <g transform="scale(-1.04032 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_af8442450fe743d0881a014d1638901a" opacity="1">
                            <g id="Group_5314e37a1b974609bbf566cf63070c37" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_6e702614cd9042ba81102e880afef873" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_e0a2a5017a714cb9b03fea6ce45f81dd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_12768e2885b945e0918396d7b18ca741" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_2c2ada61ce854298b97d297e069de3df" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_b8b9b2d35195470bb581bac9ced98a15" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_565e2f10da9948ed8f59e069558ab6b4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_072c2b9ab3b74bb0b0cf52af0644fc16" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_eadcc05ee44f4a9ea6d3dbd958fd8a18" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_fe4af599a66a4a49a0281a0f413b480d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_d5b8a87626d046c891143992f8dbeb35" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Group_7bf696f18809465a934fe9d1eda181ba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_f353b22e446b483ebce3366134bca565" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_efaf09ce5ac64c13b78f1960bd9ee744" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g fill="#ffffff" fill-opacity="1" id="Fill_0aeb68a87203407e9d20d3c488ae7464" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="stroke: none; stroke-width: 1.96048px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                    <g id="Group_34668add9f7d408f8551b29402fd266e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_dd3b65c846714f1d9791a4f6c0bb0424" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Stroke_93132806e00e4c7198417ffc4cb6212b" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 1.96048px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.388889; 0.700000; 0.705556" path="M 1.856 -0.816 C 1.856 -0.816 1.631 16.315 1.631 16.315 C 1.631 16.315 1.937 -10.299 1.937 -10.299 C 1.937 -10.299 1.897 -6.9 1.897 -6.9 C 1.897 -6.9 1.651 5.975 1.651 5.975" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(0 -5.24651)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_d67fd13048d54b26a92523e6fe67bb13" opacity="1">
                            <g id="Group_21f50d7af90f499c9dc2b7bc415d97bc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_74e397143f07412cbce0eebd64898cde" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_a3762da37fe6420f991b60b055ca6dfe" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_c3f990a1c9e7438294c6bc3daff3c536" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_3333000d975344ceac3d127aea89d5b6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_7c488e718a0c4663931da30fb2691cee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_c754bc8df1954ac4a916915b9cc4b7d6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_29b60323f74b47a387fd64cb8590ebcd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_a48dab89b7334706a2c54982808c8197" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_7f63df9daa78450cb4ac1f6b6774ce7d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_3530e59116a74432806fb1ba123a3285" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#58b0ff" fill-opacity="1" id="Fill_27d16373aea74ab1b8f2809567766dc3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 264.496,318.382 C 264.496,318.382 265.05,377.193 265.05,377.193 265.05,377.193 142.904,377.193 142.904,377.193 142.904,377.193 142.351,322.953 142.351,320.625 142.351,292.572 169.707,269.83 203.453,269.83 236.295,269.83 263.085,291.37 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_94103e30fa964c94bc4a13e720e2a802" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_abb249dbca604c519c8004252594ad84" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_525022d7e07f41e2a1141072136b57ed" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 264.496,318.382 C 264.496,318.382 265.05,377.193 265.05,377.193 265.05,377.193 142.904,377.193 142.904,377.193 142.904,377.193 142.351,322.953 142.351,320.625 142.351,292.572 169.707,269.83 203.453,269.83 236.295,269.83 263.085,291.37 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_a0f94389490e42eca766562e07da8970" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_3023467dd9734fba8fd5873fe124f4c1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_fd5a78335da84dfd855583a22a71f17d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_1120be8b5a8d4514aab460416f20c7e2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="142.927" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_6623dd2ea3b94f15b55a98f52c7a49e0" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_9ae687bd935a4795aebfe24827c12131" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_a7f4031c54bf428d87ad39b9c43447ea" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="142.927" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_58f02105999346ffa661722acce66b32" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_9271c5f202714724b85b4c7b54a80324" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_1e37efe1f748432496121f11c575dfc8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_f6ef2aa16b114ecab82bd726f6138676" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="175.488" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_2a742b4c68b843d99c5ba6e5a3c9120d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_779268157858473cadd4d6dad7b87a2b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_2fab7e398ab54dabbf7f731d97e6dc87" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="175.488" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_c152098ce4ea4170bb3d0561a3aa30a4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_dd47e2b04ce5435a8e472817cb2cf756" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_22c50ae32992475c8e98eea626334e24" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_2d0478506d91449187b26e68f60f2960" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="203.059" y="351.633"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_4dc75f562f0f44afb654dc039c587cba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_b1f10a474051419692ff940fee23dd2c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_cf5303a5bb574f50afa3825adad9cafa" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="203.059" y="351.633"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_01dc3c3d42744ca4ba0d85637dbe8376" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_3c61d0bbc86f4c64af10fe69a878df02" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_a7c005ccc54d4d84a4fbdbfb4caa5803" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_082a86ce7eb844519e2202dc875e7613" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="34.923" x="230.105" y="351.632"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_a35aaf40939746b3aa59203b775f279a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_6fcc44c99614402699246237c321e4a1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_6942bc714e494dd69af43173bdb0a952" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="34.923" x="230.105" y="351.632"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.161111; 0.355556; 0.666667" path="M 0,-5.24651 C 0,-5.24651 0,4.19721 0,4.19721 0,4.19721 0,-2.0986 0,-2.0986 0,-2.0986 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(0 -0.815729)" style="">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_fea3ae62132741188596da54dce89ef2" opacity="1">
                            <g id="Group_ae46728d8ede4f0891f79e5ae1d9fe60" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_895fdefe1d8d4898baed53e0e0effc14" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_946f9b61e52749e1955b1e98946ab893" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_f9905f6dfa72444f96e86e9ed95f4f63" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_df22397efc3349b68397472c6af5f7f2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_94e16cb3c3604988be33b3f048a4edb3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_f3cebc3bf87c46bd9b23f509465c9671" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_848f66f0333b4f80adb1dcf2184da5c3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_16e607232e40425285f33a660febf23d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_4b0c789323dd4d868a6ca258481c3692" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_5c975c22c5be43908dcd08317c9c6a5b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Group_52b9e3ff5c0744ffaba9129802aeac78" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_9eb061b8adb146cf82edbccf56d19095" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_802dcfe8e719448794dd64699c5ddb52" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g fill="#ffffff" fill-opacity="1" id="Fill_fc624ae2c6a14ca0af745e2024110e37" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="stroke: none; stroke-width: 2px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                    <g id="Group_bbb436121f1c4edb9d0cbdbb57ab5975" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_96937179d9c64f739c28e922ad427e0f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Stroke_fc7db8580e784591a9d17af18d39e642" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.388889; 0.700000; 0.705556" path="M 1.326 -0.551 C 1.326 -0.551 1.631 16.315 1.631 16.315 C 1.631 16.315 1.406 -10.564 1.406 -10.564 C 1.406 -10.564 1.101 -6.37 1.101 -6.37 C 1.101 -6.37 1.386 5.71 1.386 5.71" repeatCount="indefinite"/>
                  </g>
                  <g id="Group_31139b44f4a54ed0b254b48ed355b107" opacity="1" transform="matrix(1, 0, 0, 0.950946, 0.990442, 10.583)">
                    <g id="Group_085f214f43ca45db9264a50cca82398e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_179563955cc0441aa13c0b61e4d4cbdb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Group_0c411480c5474c8cbf7f9e2d3412d17d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <g id="Group_428d0a047dd04673a092df58788dd44e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <g id="Group_f8fea14bc733433084925f346e69ec31" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_4310ff126a45430dbf89f8459cc6103e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_4c834c0193aa4a108b7d31be1504e976" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_7c221ce162d44051955593b04e951f35" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_ed41a6e8573c457080d161ed4f4751bd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_d9b96792d4bf4db9b8d041636aaa9a0f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_3019e453bde64354b02b5acbd9811f74" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g fill="#58b0ff" fill-opacity="1" id="Fill_912aeef445ee4df2900c1962603c2e6a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <path d="M 161.924,225.837 C 161.924,225.837 244.626,225.837 244.626,225.837 244.626,225.837 244.836,288.287 244.836,288.287 245.397,308.646 161.643,307.761 161.082,287.402 161.082,287.402 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2.05029px;"/>
                                          </g>
                                        </g>
                                      </g>
                                      <g id="Group_b70cd452dde64b03a53a475ec1d40823" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_07d616537785432fb5953807910067e1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Stroke_9198d846b8044b20988871940c043045" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <path d="M 161.924,225.837 C 161.924,225.837 244.626,225.837 244.626,225.837 244.626,225.837 244.836,288.287 244.836,288.287 245.397,308.646 161.643,307.761 161.082,287.402 161.082,287.402 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2.05029px;"/>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_07bf950fb5b744c08da1b602acce90f0" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 103.462, 0.097262)">
                    <g id="Group_773ac49d227d47aca3363b5015667a78" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_679d8fb26cd04228ae1dccf28c8d6003" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_bd3d28adbd8547dcac86548851a4f98d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="29.325" x="57.947" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_acc78697a70d4a40a8b549253bfbb45a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_b11e86ddd07d437f90a0c5ec7abbfda5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_ed4ad324e01742af9949383f6b8445f4" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="29.325" x="57.947" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_257af3be2db5451a98050fb0d6feaf39" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 161.795, -0.014585)">
                    <g id="Group_25ecec9c5ecc445c823a47a76d6224c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_94ba71a35feb4cda85d74446fd7116cd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_af6483015cc9479790b8c22131f2ea72" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_9bb47d7862b54caa93b83c41537c9635" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_d921cba171054c84a3f1808b8e459fe7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_2ea52e9465d54c08a559910df8d5abfa" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_b16201a6547b45e99fd4c4d8b5ee9e56" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 135.47, 0.061733)">
                    <g id="Group_bf83fc0b3341442984cd6cce2dcecd19" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_c3d6e18a5df041aca29a49d721224e64" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_56798b44691145f8a59f513c48ac8413" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_409836a08cb5459aa9d0d0f643fd5c12" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_c92d7d97dcb44812875c1b846fa1aca4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_da13152381f2499eb2f8f2e7bdbf0686" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_cc623433226b40ddaef69231521dab81" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_7fd751bd13754d8f8cdb763d0491408a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_437c13ca93864f71b80723f533099a8d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#fee8d2" fill-opacity="1" id="Fill_937828450c04405cb5b24002364ceada" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <ellipse cx="207.088" cy="182.481" rx="57.198" ry="57.693" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_f3fe49167d6f40448822a68c2beee7a8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_b4db3b4ce592487facef052e458c8c0b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_afee68700f384c14957243cd80d4c469" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <ellipse cx="207.088" cy="182.481" rx="57.198" ry="57.693" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_55e95fb7ee614601b8d9d6bc77ecc4aa" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_3f93614f02324a56858a83b53f20ec18" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_e3b8018d9e2545cc9c493fdfe7c6fe81" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_66757b8e97d242d9bb17f261a9dc6a9c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 146.529,237.848 C 146.529,237.848 191.781,277.463 191.781,277.463 192.259,277.239 196.868,282.444 196.868,285.094 196.868,287.687 195.095,289.8 192.878,289.889 192.637,294.15 190.07,297.502 186.941,297.502 183.676,297.501 181.025,293.854 180.986,289.33 180.986,289.33 137.307,247.471 137.307,247.471 137.307,247.471 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_96d7c61b65ea4e9e82eebc58d985b225" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_a5c951f1776548a5b3ee96d6bf98f312" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_75459dbecf6e461da0939c2b91942f35" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 146.529,237.848 C 146.529,237.848 191.781,277.463 191.781,277.463 192.259,277.239 196.868,282.444 196.868,285.094 196.868,287.687 195.095,289.8 192.878,289.889 192.637,294.15 190.07,297.502 186.941,297.502 183.676,297.501 181.025,293.854 180.986,289.33 180.986,289.33 137.307,247.471 137.307,247.471 137.307,247.471 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_1cc2d6febaa64442ad9f57f6d2316ae8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_d932349903a04ba2a57176818cb9c5cb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_e8ade258977946b3a941a0279fe49ff2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#58b0ff" fill-opacity="1" id="Fill_fcd55e49f8f543b485fe53795012c916" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 131.942,218.969 C 131.942,218.969 164.628,218.969 164.628,218.969 164.628,218.969 164.628,248.121 164.628,248.121 164.628,248.121 131.942,248.121 131.942,248.121 131.942,248.121 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_f29853f1642e466b8786f5df0921b7c6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_0d04e2332d414ec98d3789f06b274a2e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_c8b1b874176d440ebe70a0b4b29ddb2f" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 131.942,218.969 C 131.942,218.969 164.628,218.969 164.628,218.969 164.628,218.969 164.628,248.121 164.628,248.121 164.628,248.121 131.942,248.121 131.942,248.121 131.942,248.121 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_d712d75c75a546cc8cf8db4ff449423e" opacity="1" transform="matrix(-1, 0, 0, -1, 474.685, 531.463)">
                    <g id="Group_1c294b6e5c184912a4e38108286a79a9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_2cb5d67cf44b471f96f1ed2cd1e15bdf" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_206e73005765431584268d3c903abd1d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 216.263,296.587 C 216.263,296.587 261.515,256.972 261.515,256.972 261.993,257.196 266.602,251.991 266.602,249.341 266.602,246.748 264.829,244.635 262.612,244.546 262.371,240.285 259.804,236.933 256.675,236.933 253.41,236.934 250.759,240.581 250.72,245.105 250.72,245.105 207.041,286.964 207.041,286.964 207.041,286.964 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_904216b925194138a71af571dd411cdc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_6195333e77e3445a98657d886705e38d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_909d034755aa457996c394978b26a020" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 216.263,296.587 C 216.263,296.587 261.515,256.972 261.515,256.972 261.993,257.196 266.602,251.991 266.602,249.341 266.602,246.748 264.829,244.635 262.612,244.546 262.371,240.285 259.804,236.933 256.675,236.933 253.41,236.934 250.759,240.581 250.72,245.105 250.72,245.105 207.041,286.964 207.041,286.964 207.041,286.964 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_c47d0f843ffe43aaa964d3ba067fd74d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_fe713c29db1b4f4ab5bdc86700a247be" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_051bcc3c9a8145b7b064c28b06c3ad13" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#58b0ff" fill-opacity="1" id="Fill_e352b4de5a2e4474b2252585fda10ef6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 245.259,219.853 C 245.259,219.853 276.472,219.853 276.472,219.853 276.472,219.853 276.472,248.416 276.472,248.416 276.472,248.416 245.259,248.416 245.259,248.416 245.259,248.416 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_656efa98c79c4305b3ead9d5d74df8a4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_7594c2aad9954880b586ce0eef9433fe" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_4cb973583a15459299f98566bc1358fe" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 245.259,219.853 C 245.259,219.853 276.472,219.853 276.472,219.853 276.472,219.853 276.472,248.416 276.472,248.416 276.472,248.416 245.259,248.416 245.259,248.416 245.259,248.416 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g transform="translate(0 0)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_aca6ca588cc64afdbfbd62a7268426e3" opacity="1">
                            <g id="Group_ed2913ea75cb48e4b41ee3e0ee7b6c85" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_e3651a3aa951404a8fb7390f69f687db" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_59a87ad457764c49bd6a00f98764c656" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_779954feb6df4fb68620f8c4ff42cc3e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_11f057441cd74c6dbabf36a6ec3c12bc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_2c4aebfc2b014b59a0add11371e215aa" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_e1f194d04ca4432d9664c27ab790b148" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_f4a36f8fbc174fee9445738549544d46" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_ce197513a8cc494c93869e1d6299062b" opacity="1" transform="matrix(0.392565, 0.919724, -0.919724, 0.392565, 31.2082, 39.0615)">
                                              <g id="Group_e8350cd87e87432c991a81dca1493f5e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_66a432833f7444dca55cb2a8bebeb323" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_93cb0c00a0df448f9c457787b18ccd2b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 59.52,-164.524 C 59.52,-164.524 151.348,-124.31 151.348,-124.31 151.348,-124.31 167.611,-27.8 167.611,-27.8 167.611,-27.8 70.12,-13.574 70.12,-13.574 70.12,-13.574 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_da683ce285dc443f8fe408e0f484d72b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_f3409296c0f7452d97449901f46c19f1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_1fd6de85a5c14f219ea3f54d0822ae32" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 59.52,-164.524 C 59.52,-164.524 151.348,-124.31 151.348,-124.31 151.348,-124.31 167.611,-27.8 167.611,-27.8 167.611,-27.8 70.12,-13.574 70.12,-13.574 70.12,-13.574 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_241374713016444fa46e7d5b10ad6e9c" opacity="1" transform="matrix(-0.392565, 0.919724, -0.919724, -0.392565, 449.288, -81.2542)">
                                              <g id="Group_7b4884754f61449b94eae24ac6025192" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_e7f3fb64be42403387eb602d3da14e34" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_f16dd6039b214f8983ce4ca7911dd9c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 196.91,181.35 C 196.91,181.35 289.152,143.45 289.152,143.45 289.152,143.45 305.415,46.94 305.415,46.94 305.415,46.94 207.924,32.714 207.924,32.714 207.924,32.714 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_6600cd45f7cd4857956cfde6336b2322" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_f99e58d12d27428c97965400365bc683" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_ae14d61fcfda4f7e962eb7abc1ca43a8" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 196.91,181.35 C 196.91,181.35 289.152,143.45 289.152,143.45 289.152,143.45 305.415,46.94 305.415,46.94 305.415,46.94 207.924,32.714 207.924,32.714 207.924,32.714 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.166667; 0.427778; 0.733333" path="M 0,0 C 0,0 0,5.24651 0,5.24651 0,5.24651 0,-1.0493 0,-1.0493 0,-1.0493 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                </g>
              </g>
            </g>
            <g transform="translate(-5.68434e-14 1.71918)">
              <g transform="rotate(0)">
                <g transform="scale(1 1)">
                  <g transform="translate(0 0)">
                    <g id="Group_c1da6565ad7a44b7937e52ece78e73a7" opacity="1">
                      <g id="Group_e05da2ce9e2141d58669cc9dff991497" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Group_bba8dfa44cc04d8190f0d00939be16ef" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <g id="Group_0c531c675587458394e5098b286b4a51" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <g id="Group_caf5454d5ae04e8780788490d52a1e95" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_1b27ef5587dd4de197f5f350d043422c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_781b8505367c42a3857f234570eace38" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e94c594dd0354662a84f034fae37aac7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_c97b2af9c9c34f0ebe788810caf4e9ab" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 199.908,174.904 C 199.908,185.434 195.141,193.97 189.261,193.97 183.381,193.97 178.614,185.434 178.614,174.904 178.614,164.374 183.876,164.257 189.756,164.257 195.636,164.257 199.908,164.374 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_5f715f838b3944b7a3da530f38b50a25" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_1508c9dbd6fa46aaa56d30844c6c486d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_57410754afa04a8397fcb572b6132546" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 199.908,174.904 C 199.908,185.434 195.141,193.97 189.261,193.97 183.381,193.97 178.614,185.434 178.614,174.904 178.614,164.374 183.876,164.257 189.756,164.257 195.636,164.257 199.908,164.374 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_69526d6ad2644b0582714865bd660c90" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_fee0271290da441f8626210b71d6b96a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_c731d322ff364143b71a5a798af8bdf7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_f43b0980669249a6966233b37cf3c8cc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 234.325,174.903 C 234.325,185.433 229.558,193.969 223.678,193.969 217.798,193.969 213.031,185.433 213.031,174.903 213.031,164.373 218.293,164.256 224.173,164.256 230.053,164.256 234.325,164.373 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_29c1c68302a045ab99b09b0aa9b09afc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e6b7536fa3cb48a5b6df62a0c28f2417" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_9257e3ac72b04b10b821c75be0d620ae" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 234.325,174.903 C 234.325,185.433 229.558,193.969 223.678,193.969 217.798,193.969 213.031,185.433 213.031,174.903 213.031,164.373 218.293,164.256 224.173,164.256 230.053,164.256 234.325,164.373 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_6d802c88b86f43a4bccbe3ed0399f3b4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_645f362498b84c9db32ee5332fba1042" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e919f5e73d4b410cb87d940368242035" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_4e1603b8462841f1a51c6eb3b893da90" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 223.678,213.284 C 223.678,216.292 216.361,218.731 207.336,218.731 198.311,218.731 191.489,215.302 191.489,212.294 191.489,209.286 197.32,213.284 206.346,213.284 215.371,213.284 223.678,210.276 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_ae12bc5f84564d398f5479e2ee744666" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_671c90609d414f64bc4a9dda4bdc5fee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_51fe2c4a88e14a3983a44bbf31489932" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 223.678,213.284 C 223.678,216.292 216.361,218.731 207.336,218.731 198.311,218.731 191.489,215.302 191.489,212.294 191.489,209.286 197.32,213.284 206.346,213.284 215.371,213.284 223.678,210.276 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_988df225ba86472b95857e71cc009bb0" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_6eb2bf7373eb491295094e25c051f329" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Stroke_c94c0958917c4d249b046d44ff9d76ab" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <ellipse cx="183.276" cy="172.709" rx="2.724" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_036c24f9d8214f3cbce54c0f2b5511a7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_7ed8b3a36a9245718e21c6c601dd18f7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_f6128c42fef74189a7adb193b8531b0d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_38c19d56776d42d39e8da1ee55141f47" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_0b299d727c594def8ff19d475edfa090" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_413d579327514781a85f892f0fd029ef" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_48d91b1135ef4bcc9e3e2e87f76d31b6" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_94b3b2d1ecc54bcb83bd2af4287e7335" opacity="1" transform="matrix(0.997575, -0.069598, 0.069598, 0.997575, -10.3555, 15.7956)">
                                <g id="Group_3e6cf58a22df41aeaecab2dffde923dd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_dbe4deef0d064ae886720333f6afbd29" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_d2238b0204ca4073a7abe17a764a293d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="stroke: none; stroke-width: 2px;" width="21.346" x="179.108" y="147.914"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_5881f2eb8f67401da829c500b2b0bef2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_419ec196b3cd4d43922ded9c4369feca" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_24722db5bec74d26b6f083f6271deeb5" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="21.346" x="179.108" y="147.914"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_be0995bd67f34e859e3987fb53d1f410" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_cbd635acea7e4bbbbfc25f27e4b617c9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_3bb3174017554936a6e30ea1d6a28eba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_f93e3b5ff8514aa4aec3a042071413a2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="183.276" cy="172.709" rx="2.724" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_ad973a3955f147cd867bdfbaf4c01185" opacity="1" transform="matrix(-0.997575, -0.0695981, -0.0695981, 0.997575, 420.995, 16.5246)">
                                <g id="Group_828b524ee6c943179d1481ec334f9b88" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_acc6c697956f4ad3bfb057ec0b803172" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_09d00d4c2fa8494b897f5622bf04a927" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="stroke: none; stroke-width: 2px;" width="21.346" x="179.11" y="147.91"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_2cba7d963f4f42fa80de15bd729b1ef4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_dcfb0bad6ae440b7bfaff639c94c46ee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_f8d0d55c1cf74b408b1ef2d6283329cc" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="21.346" x="179.11" y="147.91"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_721b904a63554f419a7989a670d34dc0" opacity="1" transform="matrix(0.980581, 0.196116, -0.196116, 0.980581, 36.1716, -29.591)">
                                <g id="Group_dcd06f12613d4191aa93ac82285bb333" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4d9fd996419d4ca38abefdb622e76fd2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_8c4db01f8a294b86a25ca48da3a82df5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="stroke: none; stroke-width: 2px;" width="11.444" x="167.506" y="167.853"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_d31ed3f59dcc4eb0b5b032b76af01b5f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_1efad0479d884cd7b83b05b14626b607" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_f570a013b87b4b99a5733740cc6bec08" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="11.444" x="167.506" y="167.853"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_0c0eec48be45438095795d32aacdabdd" opacity="1" transform="matrix(-0.980581, 0.196116, 0.196116, 0.980581, 375.074, -29.3765)">
                                <g id="Group_85cbc12fbb49406698b0039ac613a554" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4dd71c4562c44ee7833fccd1c2fd5727" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_e86e56d7af1b40518583d0250ca9541d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="stroke: none; stroke-width: 2px;" width="11.444" x="167.51" y="167.85"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_25e6d3f3edff4f1fbd57b1371bb58f5a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_aa3250f8fef44c74b2e3e7974148a2c7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_12f1561499c8471f9ecbc4e3a571abc7" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="11.444" x="167.51" y="167.85"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_f2c24a9da86e4b62ad7b6c34b7c60b14" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_5e9aa5ad63a04e5a977827a22736c105" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_b5cccfe98d4f421cbc4386f369f9700a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_117872a1e50742c0971fe225f32e6a20" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_1c847fc6e7774d5c8750f96064b3a547" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_04d00887dda24f73946be18da7ca9025" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_6e4183e42f644a41b75e2cd222a9e2ae" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.411111; 0.700000" path="M -5.68434e-14,1.71918 C -5.68434e-14,1.71918 0.671553,5.7485 0.671553,5.7485 0.671553,5.7485 0.671553,1.04763 0.671553,1.04763 0.671553,1.04763 0.671553,3.73384 0.671553,3.73384" repeatCount="indefinite"/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`; // Final NPC for this level

    // NPC DATA (Phase index corresponds to MAP_SVG index)
    const NPC_DATA = {
        0: [
            { char_id: 'CHAR_1_Chicken', name: 'Crazy Chicken', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Crazy Chicken: Bawk! Too high! I can't fly anymore!", "Crazy Chicken: The wind will try to push you back, climb carefully!"] },
            { char_id: 'CHAR_2_Penguin', name: 'Good Penguin', svg_content: CHAR_SVG_2, initial_x: 550, dialogue: ["Good Penguin: Welcome to the high altitude. It's slippery here.", "Good Penguin: Just a few more peaks to the summit!"] }
        ],
        1: [
            { char_id: 'CHAR_3_IceCube', name: 'Ice Cube', svg_content: CHAR_SVG_3, initial_x: 200, dialogue: ["Ice Cube: Don't you dare melt me!", "Ice Cube: The stars up here are incredible..."] },
            { char_id: 'CHAR_4_Stars', name: 'Nicely Stars', svg_content: CHAR_SVG_4, initial_x: 550, initial_y: FLOATING_Y, is_floating: true, dialogue: ["Nicely Stars: I drift on the high winds. Don't worry about falling!", "Nicely Stars: The air is thin, but your spirit is boundless."] }
        ],
        2: [
            { char_id: 'CHAR_1_Chicken_R2', name: 'Crazy Chicken', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Crazy Chicken: Still Bawk-ing! We're halfway there!", "Crazy Chicken: Look out for the snow..."] },
            { char_id: 'CHAR_2_Penguin_R2', name: 'Good Penguin', svg_content: CHAR_SVG_2, initial_x: 550, dialogue: ["Good Penguin: Don't give up! Slide if you must, but keep moving.", "Good Penguin: The summit is calling!"] }
        ],
        3: [
            { char_id: 'CHAR_3_IceCube_R2', name: 'Ice Cube', svg_content: CHAR_SVG_3, initial_x: 200, dialogue: ["Ice Cube: Coldest peak yet! Don't look down.", "Ice Cube: Only the faintest light can reach us here."] },
            { char_id: 'CHAR_4_Stars_R2', name: 'Nicely Stars', svg_content: CHAR_SVG_4, initial_x: 550, initial_y: FLOATING_Y, is_floating: true, dialogue: ["Nicely Stars: The next mountain is the final one before the fairy.", "Nicely Stars: Feel the wind lift you up!"] }
        ],
        4: [
            { char_id: 'CHAR_1_Chicken_R3', name: 'Crazy Chicken', svg_content: CHAR_SVG_1, initial_x: 200, dialogue: ["Crazy Chicken: Squawk! I see the end, but it's steep!", "Crazy Chicken: Only the very motivated make it this high."] },
            { char_id: 'CHAR_4_Stars_R3', name: 'Nicely Stars', svg_content: CHAR_SVG_4, initial_x: 550, initial_y: FLOATING_Y, is_floating: true, dialogue: ["Nicely Stars: The air is almost electric here. You're close.", "Nicely Stars: The final fairy awaits your arrival!"] }
        ],
        5: [
            { char_id: 'CHAR_2_Penguin_R3', name: 'Good Penguin', svg_content: CHAR_SVG_2, initial_x: 200, dialogue: ["Good Penguin: Final climb! Remember all you've learned.", "Good Penguin: Go on, brave traveler!"] },
            { char_id: 'CHAR_3_IceCube_R3', name: 'Ice Cube', svg_content: CHAR_SVG_3, initial_x: 550, dialogue: ["Ice Cube: Go! Before I turn into slush from all this climbing.", "Ice Cube: Good luck!"] }
        ],
        6: { char_id: 'CUBE_FAIRY', name: 'Cube Fairy', svg_content: CUBE_FAIRY_SVG_CONTENT, x: 650, y: 250, scale: 0.3, final_npc: true, dialogue: ["Cube Fairy: Welcome back, my friend. You've reached the highest point of Drawaria.", "Cube Fairy: You have mastered all the lands: Cold, Springs, Desert, Beach, and Forest.", "Cube Fairy: Sky Mountains conquered. Your adventure is complete!"] },
    };

    const MAX_TRANSITIONS = 6; // 6 transitions (Map 1 -> 2 -> ... -> 7). Total 7 phases/maps.

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    const MAP_SVG_1 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cold Sky Gradient (Muted Blue/Gray) -->
    <linearGradient id="coldSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 150, 170);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(140, 170, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Mountain Stone/Shadow Gradient -->
    <linearGradient id="mountainShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(70, 90, 110);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(90, 110, 130);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Earth/Stone (Dark Base) -->
    <linearGradient id="foregroundStoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(40, 45, 55);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(60, 65, 75);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Cold Blue/Gray) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#coldSkyGradient)" />

  <!-- 2. Distant Clouds/Mist (High Altitude) -->
  <g fill="white" opacity="0.5">
    <ellipse cx="250" cy="180" rx="50" ry="10" />
    <ellipse cx="550" cy="150" rx="60" ry="15" />
  </g>

  <!-- 3. Central Snow Peak (Layer 1 - Furthest back) -->
  <polygon points="100,450 400,100 700,450" fill="url(#mountainShadowGradient)" />
  <!-- Snow Cap Detail -->
  <path d="M400 100 L300 280 L400 200 L500 280 L400 100 Z" fill="white" />

  <!-- 4. Midground Peaks (Layer 2 - Left and Right) -->
  <polygon points="0,450 300,250 500,450" fill="rgb(80, 100, 120)" />
  <polygon points="500,450 800,200 800,450 Z" fill="rgb(80, 100, 120)" />

  <!-- 5. Foreground Cliffs/Ground (Dark, defining the platform at Y=450) -->
  <path d="M0 450 L350 350 L800 450 V500 H0 Z"
        fill="url(#foregroundStoneGradient)" />

  <!-- 6. Foreground Texture/Dirt (Brownish detail on the dark base) -->
  <path d="M0 450 Q200 440, 400 450 T800 440" fill="rgb(100, 80, 60)" opacity="0.5" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_2 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dramatic Sky Gradient (Darker on top, brighter near mountains) -->
    <linearGradient id="dramaticSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(80, 100, 120);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 180, 200);stop-opacity:1" />
    </linearGradient>
    <!-- Heavy Snow/Ice Gradient -->
    <linearGradient id="heavySnowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Mountain Stone/Shadow Gradient (Consistent for distance) -->
    <linearGradient id="mountainShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(70, 90, 110);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(90, 110, 130);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Dramatic) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#dramaticSkyGradient)" />

  <!-- 2. Central Peak (Higher up, more snow) -->
  <polygon points="150,450 400,50 650,450" fill="url(#mountainShadowGradient)" />
  <!-- Heavy Snow Cap -->
  <path d="M400 50 L300 200 L400 150 L500 200 L400 50 Z" fill="white" />
  <!-- Icy Face Detail -->
  <path d="M400 150 L450 250 L400 300 Z" fill="rgb(180, 220, 255)" opacity="0.8" />

  <!-- 3. Midground Snowy Peaks -->
  <polygon points="0,450 200,300 400,450" fill="rgb(180, 200, 220)" />
  <polygon points="600,450 800,350 800,450 Z" fill="rgb(180, 200, 220)" />

  <!-- 4. Foreground Platform (Heavy Snow) -->
  <path d="M0 450 Q200 430, 400 450 T800 430 V500 H0 Z"
        fill="url(#heavySnowGradient)" />

  <!-- 5. Snow Drifts/Texture (Foreground detail) -->
  <path d="M50 450 C80 440, 120 440, 150 450" fill="rgb(200, 220, 255)" opacity="0.6"/>
  <path d="M700 450 C720 435, 760 435, 790 450" fill="rgb(200, 220, 255)" opacity="0.6"/>

  <!-- 6. Wind Effect Lines (Movement hint) -->
  <path d="M0 100 L50 110" stroke="white" stroke-width="2" opacity="0.5" />
  <path d="M800 200 L750 205" stroke="white" stroke-width="2" opacity="0.5" />

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_3 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Icy Sky Gradient (Bright but cold blue) -->
    <linearGradient id="icySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(160, 200, 230);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 230, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Glacier Ice/Rock Gradient -->
    <linearGradient id="glacierGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(140, 180, 210);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(180, 220, 240);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Ice Platform Gradient (Reflective White/Blue) -->
    <linearGradient id="icePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Icy Blue) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#icySkyGradient)" />

  <!-- 2. Distant Peaks (Layer 1) -->
  <polygon points="0,450 400,200 800,450" fill="rgb(100, 140, 170)" />
  <!-- Snow/Ice Cap -->
  <path d="M400 200 L300 350 L500 350 Z" fill="rgb(220, 240, 255)" />

  <!-- 3. Central Glacier/Ice Mass (Layer 2) -->
  <polygon points="100,450 450,250 700,450" fill="url(#glacierGradient)" />
  <!-- Crevasses/Cracks (Dark Blue Lines) -->
  <g stroke="rgb(0, 100, 150)" stroke-width="3" opacity="0.8" fill="none">
    <path d="M400 300 L450 350 L420 380" />
    <path d="M550 350 L580 400" />
  </g>

  <!-- 4. Foreground Platform (Flat Ice) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#icePlatformGradient)" />

  <!-- 5. Ice Shard Detail (Foreground reflection) -->
  <g fill="rgb(200, 230, 255)" opacity="0.7">
    <polygon points="50,450 60,430 70,450 Z" />
    <polygon points="700,450 710,420 720,450 Z" />
  </g>

  <!-- 6. Wind and Snow Particles (Simple white dots) -->
  <g fill="white" opacity="0.6">
    <circle cx="100" cy="400" r="1.5" />
    <circle cx="700" cy="350" r="1" />
    <circle cx="400" cy="420" r="2" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_4 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Foggy Sky Gradient (Muted, near white) -->
    <linearGradient id="foggySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Mountain Shadow/Muted Rock Gradient -->
    <linearGradient id="mutedRockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 140, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 170, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Slope Platform (Gray/Brown Stone) -->
    <linearGradient id="slopePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(100, 100, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(130, 130, 130);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Foggy/Misty) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#foggySkyGradient)" />

  <!-- 2. Dense Fog/Clouds Layer (Low visibility mid-ground) -->
  <rect x="0" y="200" width="800" height="150" fill="white" opacity="0.4" />

  <!-- 3. Distant, Obscured Peaks (Layer 1 - Muted color) -->
  <polygon points="50,450 400,250 750,450" fill="url(#mutedRockGradient)" opacity="0.6" />
  <!-- Snow detail on peaks -->
  <path d="M400 250 L350 350 L450 350 Z" fill="white" opacity="0.5" />

  <!-- 4. Foreground Slope Platform (Slanted rock platform) -->
  <path d="M0 450 L800 420 L800 500 L0 500 Z"
        fill="url(#slopePlatformGradient)" />

  <!-- 5. Small Cracks/Obstacles (Ground detail) -->
  <g stroke="rgb(50, 50, 50)" stroke-width="2" opacity="0.7" fill="none">
    <path d="M200 445 L250 435" />
    <path d="M600 430 L630 425" />
  </g>

  <!-- 6. Wind Gust effect (Horizontal lines) -->
  <g stroke="white" stroke-width="1" opacity="0.7">
    <path d="M100 100 L150 100" />
    <path d="M700 150 L650 150" />
  </g>

  <!-- NOTE: The level progression logic expects a flat Y=450 for the avatar's ground collision.
       The visual slope here is only for aesthetic. The avatar still stops at Y=450. -->
  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_5 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Night Sky Gradient (Dark Blue/Black) -->
    <linearGradient id="deepNightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(20, 20, 40);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(50, 50, 80);stop-opacity:1" />
    </linearGradient>
    <!-- Shadowed Snow Gradient -->
    <linearGradient id="shadowedSnowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(120, 140, 160);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(150, 170, 190);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Night Rock Gradient -->
    <linearGradient id="nightRockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(60, 60, 80);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(80, 80, 100);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky (Deep Night) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#deepNightSkyGradient)" />

  <!-- 2. Stars (Scattered white and blue dots) -->
  <g fill="white" opacity="0.8">
    <circle cx="100" cy="50" r="2.5" fill="rgb(255, 255, 200)" />
    <circle cx="700" cy="80" r="1.5" />
    <circle cx="400" cy="20" r="3" fill="rgb(200, 200, 255)" />
    <circle cx="550" cy="150" r="1" />
    <circle cx="250" cy="180" r="2" />
  </g>

  <!-- 3. Full Mountain Silhouette (Faintly visible) -->
  <polygon points="0,450 400,100 800,450" fill="rgb(40, 40, 60)" />
  <!-- Snow Cap (Shadowed) -->
  <path d="M400 100 L300 280 L400 200 L500 280 L400 100 Z" fill="url(#shadowedSnowGradient)" />

  <!-- 4. Foreground Platform (Night Rock/Stone) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#nightRockGradient)" />

  <!-- 5. Moonlight Reflection (Faint glow on the ground) -->
  <path d="M0 450 Q200 448, 400 450 T800 448"
        fill="none"
        stroke="rgb(200, 200, 255)"
        stroke-width="1"
        opacity="0.3" />

  <!-- 6. Small Snow Patches (Ground detail) -->
  <g fill="rgb(150, 170, 190)" opacity="0.6">
    <ellipse cx="150" cy="445" rx="20" ry="5" />
    <ellipse cx="650" cy="440" rx="30" ry="8" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_6 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Icy Sky Gradient (Consistent cold blue) -->
    <linearGradient id="icySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(160, 200, 230);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(190, 230, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Deep Abyss/Valley Shadow Gradient -->
    <linearGradient id="abyssShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(60, 80, 100);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(30, 40, 50);stop-opacity:1" />
    </linearGradient>
    <!-- Foreground Cornice Ice/Rock Gradient (The precarious platform) -->
    <linearGradient id="cornicePlatformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 200, 220);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(220, 240, 255);stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 1. Sky -->
  <rect x="0" y="0" width="800" height="500" fill="url(#icySkyGradient)" />

  <!-- 2. Distant Peaks (Layer 1) -->
  <polygon points="0,450 400,200 800,450" fill="rgb(100, 140, 170)" />
  <!-- Snow Cap -->
  <path d="M400 200 L300 350 L500 350 Z" fill="rgb(220, 240, 255)" />

  <!-- 3. Abyss/Valley Shadow (Below the current platform) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#abyssShadowGradient)" />

  <!-- 4. Foreground Cornice Platform (The thin platform at Y=450) -->
  <rect x="0" y="440" width="800" height="10" fill="url(#cornicePlatformGradient)" />
  <rect x="0" y="450" width="800" height="5" fill="rgb(200, 200, 200)" />

  <!-- 5. Dramatic Drop-off Effect (Shadow extending downwards from the platform) -->
  <path d="M0 450 L100 500 L0 500 Z" fill="rgb(30, 40, 50)" />
  <path d="M800 450 L700 500 L800 500 Z" fill="rgb(30, 40, 50)" />

  <!-- 6. Wind effect (Strong horizontal streaks) -->
  <g stroke="white" stroke-width="2" opacity="0.6">
    <path d="M0 150 L200 155" />
    <path d="M800 200 L650 200" />
    <path d="M0 250 L150 255" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;
    const MAP_SVG_7 = `<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Ethereal Summit Sky Gradient (Very light blue/white) -->
    <linearGradient id="summitSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(200, 230, 255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(240, 250, 255);stop-opacity:1" />
    </linearGradient>
    <!-- Summit Altar Stone Gradient -->
    <linearGradient id="altarSummitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(180, 180, 200);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(200, 200, 220);stop-opacity:1" />
    </linearGradient>
    <!-- Cube Fairy's Blue Glow -->
    <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:rgb(169, 204, 227);stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(169, 204, 227);stop-opacity:0.3"/>
    </radialGradient>
  </defs>

  <!-- 1. Sky (Bright Summit) -->
  <rect x="0" y="0" width="800" height="500" fill="url(#summitSkyGradient)" />

  <!-- 2. Distant Peaks (Very faint, below the clouds) -->
  <polygon points="0,450 400,250 800,450" fill="rgb(150, 170, 190)" opacity="0.4" />

  <!-- 3. Foreground Summit Platform (Small, flat area) -->
  <rect x="0" y="450" width="800" height="50" fill="url(#altarSummitGradient)" />

  <!-- 4. Central Stone Altar/Pedestal (Where the Fairy sits) -->
  <g transform="translate(400, 350)">
    <rect x="-100" y="0" width="200" height="100" fill="rgb(160, 160, 180)" stroke="rgb(120, 120, 140)" stroke-width="3" />
    <rect x="-80" y="100" width="160" height="50" fill="rgb(140, 140, 160)" />
    <!-- Light/Glow effect around the center -->
    <circle cx="0" cy="50" r="100" fill="url(#cubeGlow)" opacity="0.4" />
  </g>

  <!-- 5. Ethereal Wind/Energy Lines (Vertical movement) -->
  <g stroke="white" stroke-width="1" opacity="0.7">
    <path d="M200 0 L200 500" />
    <path d="M600 0 L600 500" />
    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="5s" repeatCount="indefinite" />
  </g>

  <!-- This horizontal line represents the absolute ground level at Y=450 -->
  <!-- <line x1="0" y1="450" x2="800" y2="450" stroke="red" stroke-width="2" /> -->
</svg>`;

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3, MAP_SVG_4, MAP_SVG_5, MAP_SVG_6, MAP_SVG_7];

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
            background-color: #5d6d7e; /* Mountain/Stone color */
            color: white;
            border: 2px solid #a9cce3; /* Cold/Sky Blue Border */
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(169, 204, 227, 0.7);
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

        // Custom style for the Sky Mountains dialogue box (white/blue/icy theme)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(169, 204, 227, 0.9); /* Icy Blue */
            border: 5px solid #fff; /* Snow White Border */
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
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

        // Final Level Completion Check (Cube Fairy is only NPC in phase 6)
        if (currentMapIndex === BACKGROUND_SVGS.length - 1) {
            isLevelComplete = true;

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:#fff; font-size:36px; text-align:center; font-family: Arial, sans-serif; text-shadow: 0 0 10px #a9cce7;">
                    LEVEL COMPLETE!<br>The Sky Mountains are conquered.
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
            background-color: #5d6d7e;
            color: white;
            border: 4px solid #a9cce3;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(169, 204, 227, 0.7);
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
        const WIND_FORCE = 0.1; // Gentle constant wind force to the left

        // Stop movement during dialogue
        if (isDialogueActive) {
            avatarVX = 0;
            avatarVY = 0;
            isJumping = false;
        } else {
            // Apply constant gravity and wind
            avatarVY += GRAVITY;
            // Avatar is constantly pushed slightly left by wind
            avatarVX -= WIND_FORCE;

            if (keys['ArrowRight']) {
                avatarVX = Math.min(avatarVX + 0.8, MAX_SPEED); // Increased acceleration to fight wind
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
                 // Final transition to the last map (MAP_SVG_7)
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