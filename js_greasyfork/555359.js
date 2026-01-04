// ==UserScript==
// @name         Drawaria Air Fortress 🚢☁️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable que cicla entre efectos climáticos al hacer clic.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555359/Drawaria%20Air%20Fortress%20%F0%9F%9A%A2%E2%98%81%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555359/Drawaria%20Air%20Fortress%20%F0%9F%9A%A2%E2%98%81%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'air-fortress-menu-container';
    const OVERLAY_ID = 'weather-overlay';
    let weatherState = 0; // 0: Niebla, 1: Lluvia, 2: Tormenta, 3: Nieve

    // 1. Contenido del SVG (Se simplifica para la inyección)
    const menuSVG = `
        <svg id="air-fortress-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-31.881 -513.409 5923.356 3039.594" xmlns:bx="https://boxy-svg.com">
          <g id="air-fortress-main-group" style="filter: url(&quot;#drop-shadow-filter-1&quot;);">
            <g style="transform-origin: 1495.64px 112.457px;" transform="matrix(1, 0, 0, 1, -158.036808, -41.759564)">
              <path d="M -974.2 92.6 L -830.1 380.797 L -1118.3 380.797 L -974.2 92.6 Z" bx:shape="triangle -1118.3 92.6 288.2 288.197 0.5 0 1@866b0512" style="stroke: rgb(0, 0, 0); fill: rgb(218, 40, 40); transform-origin: -974.21px 236.699px;" transform="matrix(0, -1, -1, 0, 2236.608735, -185.197224)"/>
              <path d="M 1262.4 -92.6 L 1406.5 195.597 L 1118.3 195.597 L 1262.4 -92.6 Z" bx:shape="triangle 1118.3 -92.6 288.2 288.197 0.5 0 1@a5ca850c" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(218, 40, 40); transform-origin: 1262.39px 51.499px;" transform="matrix(0, -1, -1, 0, 466.490581, 121.932468)"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1;1 1" begin="0s" dur="2s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
            </g>
            <path d="M 1322.88 -13.012 H 1429.061 V -13.012 H 1429.061 V 540.638 H 1429.061 V 540.638 H 1322.88 V 540.638 H 1322.88 V -13.012 H 1322.88 V -13.012 Z" bx:shape="rect 1322.88 -13.012 106.181 553.65 3 0 0 2@755551b0" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <path d="M 845.084 -141.95 H 958.849 V -141.95 H 958.849 V 411.7 H 958.849 V 411.7 H 845.084 V 411.7 H 845.084 V -141.95 H 845.084 V -141.95 Z" bx:shape="rect 845.084 -141.95 113.765 553.65 3 0 0 2@19309fab" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <path d="M 351.647 390.099 H 2048.377 V 390.099 H 2048.377 V 966.119 H 2048.377 V 966.119 H 351.647 V 966.119 H 351.647 V 390.099 H 351.647 V 390.099 Z" bx:shape="rect 351.647 390.099 1696.73 576.02 3 0 0 2@d67bbe77" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <g transform="matrix(1, 0, 0, 1, 108.968661, 626.054029)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 653.400832, 611.520765)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 1248.554836, 616.037061)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <path d="M 606.889 597.57 L 1373.47 597.57 L 1373.47 662.437 C 1396.38 682.935 1410.33 710.119 1410.33 739.94 C 1410.33 803.759 1346.43 855.495 1267.61 855.495 C 1251.74 855.495 1236.48 853.399 1222.23 849.531 C 1191.04 903.047 1126.52 939.8 1051.99 939.8 C 1028.32 939.8 1005.66 936.094 984.763 929.322 C 947.286 1005.05 865.775 1057.54 771.255 1057.54 C 641.216 1057.54 535.799 958.194 535.799 835.656 C 535.799 773.374 563.032 717.086 606.889 676.788 L 606.889 597.57 Z" style="stroke: rgb(0, 0, 0); fill: rgb(252, 252, 252); transform-box: fill-box; transform-origin: 50% 50%;">
              <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-24;0" begin="0s" dur="1.02s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.500116; 1"/>
              <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 70;0 0" begin="0s" dur="1.02s" fill="freeze" keyTimes="0; 0.511256; 1" repeatCount="indefinite"/>
            </path>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 30;0 0" begin="0s" dur="2.46s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
          </g>
          <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(8.451408, 0, 0, 8.200039, -4827.655376, 2322.986866)" x="846.837" y="-280.1">Air Fortress</text>
          <defs>
            <style bx:fonts="ADLaM Display">@import url(https://fonts.googleapis.com/css2?family=ADLaM+Display%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 0 0 20 0.82 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="20"/>
              <feOffset dx="0" dy="0"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="1.64"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 40 40 15 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
              <feOffset dx="40" dy="40"/>
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
          </defs>
          <g style="filter: url(&quot;#filter-1&quot;);" transform="matrix(1, 0, 0, 1, 1758.965858, 1169.880884)">
            <g style="transform-origin: 1495.64px 112.457px;" transform="matrix(1.641126, 0, 0, 1.678072, 391.507271, -114.427157)">
              <path d="M -974.2 92.6 L -830.1 380.797 L -1118.3 380.797 L -974.2 92.6 Z" bx:shape="triangle -1118.3 92.6 288.2 288.197 0.5 0 1@866b0512" style="stroke: rgb(0, 0, 0); fill: rgb(218, 40, 40); transform-origin: -974.21px 236.699px;" transform="matrix(0, -1, -1, 0, 2236.608735, -185.197224)"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1;1 1" begin="0s" dur="2s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
            </g>
            <path d="M 1078.86 -358.81 H 1265.563 V -358.81 H 1265.563 V 570.254 H 1265.563 V 570.254 H 1078.86 V 570.254 H 1078.86 V -358.81 H 1078.86 V -358.81 Z" bx:shape="rect 1078.86 -358.81 186.703 929.064 3 0 0 2@4c385348" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <path d="M 351.647 390.099 H 2048.377 V 390.099 H 2048.377 V 966.119 H 2048.377 V 966.119 H 351.647 V 966.119 H 351.647 V 390.099 H 351.647 V 390.099 Z" bx:shape="rect 351.647 390.099 1696.73 576.02 3 0 0 2@d67bbe77" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <g transform="matrix(1, 0, 0, 1, 108.968661, 626.054029)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 653.400832, 611.520765)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 1248.554836, 616.037061)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <path d="M 606.889 597.57 L 1373.47 597.57 L 1373.47 662.437 C 1396.38 682.935 1410.33 710.119 1410.33 739.94 C 1410.33 803.759 1346.43 855.495 1267.61 855.495 C 1251.74 855.495 1236.48 853.399 1222.23 849.531 C 1191.04 903.047 1126.52 939.8 1051.99 939.8 C 1028.32 939.8 1005.66 936.094 984.763 929.322 C 947.286 1005.05 865.775 1057.54 771.255 1057.54 C 641.216 1057.54 535.799 958.194 535.799 835.656 C 535.799 773.374 563.032 717.086 606.889 676.788 L 606.889 597.57 Z" style="stroke: rgb(0, 0, 0); fill: rgb(252, 252, 252); transform-box: fill-box; transform-origin: 50% 50%;">
              <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-24;0" begin="0s" dur="1.02s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.500116; 1"/>
              <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 70;0 0" begin="0s" dur="1.02s" fill="freeze" keyTimes="0; 0.511256; 1" repeatCount="indefinite"/>
            </path>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 30;0 0" begin="0s" dur="2.46s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
          </g>
          <g style="filter: url(&quot;#filter-2&quot;);" transform="matrix(1, 0, 0, 1, 3705.688067, -0.536145)">
            <g style="transform-origin: 1495.64px 112.457px;" transform="matrix(1, 0, 0, 1, 69.008852, 0)">
              <path d="M -974.2 92.6 L -830.1 380.797 L -1118.3 380.797 L -974.2 92.6 Z" bx:shape="triangle -1118.3 92.6 288.2 288.197 0.5 0 1@866b0512" style="stroke: rgb(0, 0, 0); fill: rgb(218, 40, 40); transform-origin: -974.21px 236.699px;" transform="matrix(0, -1, -1, 0, 2236.608735, -185.197224)"/>
              <path d="M 1262.4 -92.6 L 1406.5 195.597 L 1118.3 195.597 L 1262.4 -92.6 Z" bx:shape="triangle 1118.3 -92.6 288.2 288.197 0.5 0 1@a5ca850c" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(218, 40, 40); transform-origin: 1262.39px 51.499px;" transform="matrix(0, -1, -1, 0, 466.490581, 121.932468)"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1;1 1" begin="0s" dur="2s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
            </g>
            <path d="M 1549.93 28.748 H 1656.111 V 28.748 H 1656.111 V 582.398 H 1656.111 V 582.398 H 1549.93 V 582.398 H 1549.93 V 28.748 H 1549.93 V 28.748 Z" bx:shape="rect 1549.93 28.748 106.181 553.65 3 0 0 2@479df4d9" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <path d="M 1072.13 -100.19 H 1185.895 V -100.19 H 1185.895 V 453.46 H 1185.895 V 453.46 H 1072.13 V 453.46 H 1072.13 V -100.19 H 1072.13 V -100.19 Z" bx:shape="rect 1072.13 -100.19 113.765 553.65 3 0 0 2@c27299bc" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <g style="transform-origin: 1495.64px 112.457px;" transform="matrix(1, 0, 0, 1, -904.627827, -41.523866)">
              <path d="M 1262.4 -92.6 L 1406.5 195.597 L 1118.3 195.597 L 1262.4 -92.6 Z" bx:shape="triangle 1118.3 -92.6 288.2 288.197 0.5 0 1@a5ca850c" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(218, 40, 40); transform-origin: 1262.39px 51.499px;" transform="matrix(0, -1, -1, 0, 466.490581, 121.932468)"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.1 1;1 1" begin="0s" dur="2s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
            </g>
            <path d="M 576.291 -12.775 H 682.472 V -12.775 H 682.472 V 540.875 H 682.472 V 540.875 H 576.291 V 540.875 H 576.291 V -12.775 H 576.291 V -12.775 Z" bx:shape="rect 576.291 -12.775 106.181 553.65 3 0 0 2@5aa7c71a" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25); stroke-width: 1;"/>
            <path d="M 351.647 390.099 H 2048.377 V 390.099 H 2048.377 V 966.119 H 2048.377 V 966.119 H 351.647 V 966.119 H 351.647 V 390.099 H 351.647 V 390.099 Z" bx:shape="rect 351.647 390.099 1696.73 576.02 3 0 0 2@d67bbe77" style="stroke: rgb(0, 0, 0); fill: rgb(147, 67, 25);"/>
            <g transform="matrix(1, 0, 0, 1, 108.968661, 626.054029)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 653.400832, 611.520765)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <g transform="matrix(1, 0, 0, 1, 1248.554836, 616.037061)">
              <path d="M 528.63 -128.84 H 537.935 V 71.889 H 738.664 V 78.54 H 537.935 V 279.269 H 528.63 V 78.54 H 327.901 V 71.889 H 528.63 V -128.84 Z" bx:shape="rect 327.901 -128.84 410.763 408.109 3 200.729 200.729 2@f67d4304" style="stroke: rgb(0, 0, 0); transform-box: fill-box; transform-origin: 50% 50%;">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
            </g>
            <path d="M 606.889 597.57 L 1373.47 597.57 L 1373.47 662.437 C 1396.38 682.935 1410.33 710.119 1410.33 739.94 C 1410.33 803.759 1346.43 855.495 1267.61 855.495 C 1251.74 855.495 1236.48 853.399 1222.23 849.531 C 1191.04 903.047 1126.52 939.8 1051.99 939.8 C 1028.32 939.8 1005.66 936.094 984.763 929.322 C 947.286 1005.05 865.775 1057.54 771.255 1057.54 C 641.216 1057.54 535.799 958.194 535.799 835.656 C 535.799 773.374 563.032 717.086 606.889 676.788 L 606.889 597.57 Z" style="stroke: rgb(0, 0, 0); fill: rgb(252, 252, 252); transform-box: fill-box; transform-origin: 50% 50%;">
              <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-24;0" begin="0s" dur="1.02s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.500116; 1"/>
              <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 70;0 0" begin="0s" dur="1.02s" fill="freeze" keyTimes="0; 0.511256; 1" repeatCount="indefinite"/>
            </path>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 30;0 0" begin="0s" dur="2.46s" fill="freeze" keyTimes="0; 0.501996; 1" repeatCount="indefinite"/>
          </g>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos climáticos)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 500px; /* Tamaño del menú */
            height: auto;
            z-index: 10001;
            cursor: grab;
            /* La parte principal de la nave para hacer clic */
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }

        /* Contenedor de efectos climáticos (Overlay de pantalla completa) */
        #${OVERLAY_ID} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none; /* No debe interferir con el juego */
            transition: opacity 1s ease-in-out;
            /* Estilos base (clima despejado/neutro) */
            opacity: 0;
            background: transparent;
        }

        /* --------------------------------- */
        /* EFECTO 0: Niebla (Fog) */
        /* --------------------------------- */
        @keyframes fog-move {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }
        .weather-fog {
            opacity: 1 !important;
            backdrop-filter: blur(2px) grayscale(0.2);
            -webkit-backdrop-filter: blur(2px) grayscale(0.2);
            /* Patrón de niebla con degradado radial y movimiento lento */
            background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(200, 200, 200, 0.3) 50%, rgba(200, 200, 200, 0) 70%) no-repeat;
            background-size: 200% 200%;
            animation: fog-move 30s linear infinite alternate;
        }

        /* --------------------------------- */
        /* EFECTO 1: Lluvia (Rain) */
        /* --------------------------------- */
        @keyframes rain-fall {
            0% { background-position: 0% 0%; }
            100% { background-position: 20% 100%; }
        }
        .weather-rain {
            opacity: 1 !important;
            background: repeating-linear-gradient(
                45deg,
                rgba(100, 100, 255, 0.4),
                rgba(100, 100, 255, 0.4) 1px,
                transparent 1px,
                transparent 10px
            );
            background-size: 100px 100px;
            animation: rain-fall 0.5s linear infinite;
        }

        /* --------------------------------- */
        /* EFECTO 2: Tormenta Eléctrica (Thunderstorm) */
        /* --------------------------------- */
        @keyframes lightning-flash {
            0%, 5%, 15%, 30%, 100% { background-color: rgba(0, 0, 0, 0.5); }
            10%, 20% { background-color: rgba(255, 255, 200, 0.8); } /* Flash de luz */
        }
        .weather-thunderstorm {
            opacity: 1 !important;
            animation: lightning-flash 5s infinite step-end;
            backdrop-filter: brightness(0.8) contrast(1.5);
            -webkit-backdrop-filter: brightness(0.8) contrast(1.5);
        }

        /* --------------------------------- */
        /* EFECTO 3: Nieve (Snow) */
        /* --------------------------------- */
        @keyframes snow-fall {
            0% { background-position: 0 0; }
            100% { background-position: 50% 100%; }
        }
        .weather-snow {
            opacity: 1 !important;
            /* Múltiples fondos para crear diferentes capas de copos */
            background:
                /* Capa 1: Copos pequeños y rápidos */
                radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 60%) 0 0 / 50px 50px,
                /* Capa 2: Copos grandes y lentos */
                radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 60%) 50px 50px / 75px 75px;
            animation: snow-fall 20s linear infinite;
            backdrop-filter: saturate(0.5) brightness(1.2);
            -webkit-backdrop-filter: saturate(0.5) brightness(1.2);
        }
    `);


    // 3. Funciones de Efectos

    /** Aplica el estado climático actual. */
    function applyWeatherEffect() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) return;

        // 1. Limpiar clases y animaciones previas
        overlay.className = '';
        overlay.style.animation = 'none'; // Detiene animaciones CSS específicas

        // 2. Aplicar el nuevo estado
        switch (weatherState) {
            case 0: // Niebla
                overlay.classList.add('weather-fog');
                break;
            case 1: // Lluvia
                overlay.classList.add('weather-rain');
                break;
            case 2: // Tormenta Eléctrica
                overlay.classList.add('weather-thunderstorm');
                break;
            case 3: // Nieve
                overlay.classList.add('weather-snow');
                break;
            default:
                // Estado neutro: simplemente vacío (opacity: 0 de la base)
                break;
        }

        // 3. Mostrar el nombre del clima en la consola
        const weatherNames = ['Niebla 🌫️', 'Lluvia 🌧️', 'Tormenta ⛈️', 'Nieve ❄️'];
        console.log(`Clima Actual: ${weatherNames[weatherState] || 'Neutro'}`);
    }

    /**
     * Cicla al siguiente estado climático y lo aplica.
     */
    function cycleWeather() {
        // Incrementa el estado, volviendo a 0 después de 3
        weatherState = (weatherState + 1) % 4; // 0, 1, 2, 3 -> 0

        // Aplicar el efecto
        applyWeatherEffect();
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleMenuClick(event) {
        // Se asegura de que el clic no sea para arrastrar, sino para una interacción
        // Usaremos una pequeña lógica de debounce para diferenciar arrastre de clic
        if (event._isDragging) return;

        // Clic en la nave: cambiar el clima
        cycleWeather();
    }

    /**
     * Hace un elemento HTML arrastrable.
     */
    function dragElement(element) {
        let pos3 = 0, pos4 = 0;
        let isDragging = false;
        const DRAG_THRESHOLD = 5; // Pixels para considerar arrastre

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;

            // Permitir el clic si el evento de arrastre no se dispara
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

                // Mover el elemento
                element.style.top = (element.offsetTop + dy) + "px";
                element.style.left = (element.offsetLeft + dx) + "px";

                // Reiniciar posición inicial del mouse para el siguiente movimiento
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
        }

        function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;

            if (!isDragging) {
                // Si no hubo arrastre, se considera un clic
                e._isDragging = false; // Flag para el manejador de clic
                handleMenuClick(e);
            } else {
                // Si hubo arrastre, evita el clic
                e._isDragging = true;
            }
        }
    }


    // 5. Inicialización
    window.addEventListener('load', () => {
        // 5.1. Crear el contenedor del menú e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Crear el Overlay de Clima
        const weatherOverlay = document.createElement('div');
        weatherOverlay.id = OVERLAY_ID;
        document.body.appendChild(weatherOverlay);

        // 5.3. Asignar eventos y funcionalidad
        dragElement(menuContainer);

        // 5.4. Establecer el clima inicial
        applyWeatherEffect(); // Aplicar el estado 0 (Niebla)
    });

})();