// ==UserScript==
// @name         Drawaria the Gear Machine ⚙️🛠️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable con 3 efectos aleatorios para el engranaje cruzado.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555298/Drawaria%20the%20Gear%20Machine%20%E2%9A%99%EF%B8%8F%F0%9F%9B%A0%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555298/Drawaria%20the%20Gear%20Machine%20%E2%9A%99%EF%B8%8F%F0%9F%9B%A0%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EFFECT_DURATION = 5000; // 5 segundos para el efecto de seguimiento
    const BOUNCE_DURATION = 7000; // 7 segundos para el efecto de rebote
    const TARGET_BUTTON_ID = 'menu-button-target';
    const TARGET_GEAR_GROUP_ID = 'cross-gear-effect-group';

    // 1. Contenido del SVG del menú
    // Se ha inyectado el ID 'menu-button-target' al <g> del botón.
    const menuSVG = `
        <svg id="saw-motors-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-1038.049 -282.309 4098.274 1567.994" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="drop-shadow-filter-0" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <title>Drop shadow</title>
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-1" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <title>Outline</title>
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#f7f8f5" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-0" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <title>Outline</title>
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="7"/>
              <feFlood flood-color="#030303" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge result="merge-0">
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-2" bx:preset="outline 1 4 #000" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#000" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-3" bx:preset="outline 1 4 #f7f8f2" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#f7f8f2" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <pattern id="pattern-0" viewBox="0 -74.784 261.274 250.218" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="100" height="100" bx:pinned="true" patternTransform="matrix(1, 0, 0, 1, -67.171545, 258.87311)">
              <rect x="-6.552" y="-78.146" width="270.482" height="253.804" rx="5" ry="5" style="stroke: rgb(0, 0, 0); fill: rgb(68, 66, 66);"/>
              <path style="stroke: rgb(183, 184, 182); stroke-width: 13.3px; fill: rgb(79, 79, 79); transform-origin: 622.778px 248.889px; filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-4&quot;) url(&quot;#outline-filter-5&quot;);" transform="matrix(1.124193, 0, 0, 1.131444, -494.015269, -200.201176)" d="M 612.243 162.778 L 633.313 162.778 L 637.759 194.959 A 55.972 55.972 0 0 1 650.319 200.161 L 676.218 180.55 L 691.117 195.449 L 671.506 221.348 A 55.972 55.972 0 0 1 676.708 233.907 L 708.889 238.354 L 708.889 259.424 L 676.708 263.87 A 55.972 55.972 0 0 1 671.506 276.43 L 691.117 302.329 L 676.218 317.228 L 650.319 297.617 A 55.972 55.972 0 0 1 637.759 302.819 L 633.313 335 L 612.243 335 L 607.796 302.819 A 55.972 55.972 0 0 1 595.237 297.617 L 569.337 317.228 L 554.439 302.329 L 574.05 276.43 A 55.972 55.972 0 0 1 568.848 263.87 L 536.667 259.424 L 536.667 238.354 L 568.848 233.907 A 55.972 55.972 0 0 1 574.05 221.348 L 554.439 195.449 L 569.337 180.55 L 595.237 200.161 A 55.972 55.972 0 0 1 607.796 194.959 Z M 622.778 223.056 A 25.833 25.833 0 0 0 622.778 274.722 A 25.833 25.833 0 0 0 622.778 223.056" bx:shape="cog 622.778 248.889 25.833 55.972 86.111 0.38 8 1@6653d124">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
              </path>
            </pattern>
            <pattern id="pattern-0-0" href="#pattern-0" patternTransform="matrix(1.08354, 0, 0, 1, 1124.155111, -363.904274)"/>
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
            <filter id="outline-filter-4" bx:preset="outline 1 4 #030303" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#030303" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-5" bx:preset="outline 1 4 #f7f8f5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#f7f8f5" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-6" bx:preset="outline 1 9 #000" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="9"/>
              <feFlood flood-color="#000" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="filter-4" bx:preset="outline 1 9 #000" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="9"/>
              <feFlood flood-color="#000" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-3" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" x1="58.025" y1="2.976" x2="58.025" y2="382.837" id="gradient-0" gradientTransform="matrix(-0.000003, -0.999998, 0.352444, 0, 26.684494, 231.38207)">
              <stop offset="0" style="stop-color: rgb(5, 5, 5); stop-opacity: 0;"/>
              <stop offset="1" style="stop-color: rgb(1.1765% 1.1765% 1.1765%)"/>
            </linearGradient>
            <view id="view2" viewBox="3374.169 -280.026 1655.56 1528.532">
              <title>View 1</title>
            </view>
            <filter id="drop-shadow-filter-3" bx:preset="drop-shadow 1 0 0 20 1.2 #0008" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="20"/>
              <feOffset dx="0" dy="0"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-4" type="linear" slope="2.4"/>
              </feComponentTransfer>
              <feFlood flood-color="#0008"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-7" bx:preset="outline 1 4 #fff" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#fff" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-4" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-5" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-5" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-6" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-6" bx:preset="drop-shadow 1 0 0 15 2 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
              <feOffset dx="0" dy="0"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="4"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g>
            <g transform="matrix(1, 0, 0, 1, -261.544988, -38.911786)">
              <ellipse style="stroke: rgb(183, 184, 182); stroke-width: 15px; fill: rgb(54, 52, 52); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;);" cx="969.247" cy="273.241" rx="147.394" ry="144.896"/>
              <path d="M 964.876 274.053 m -196.734 0 a 196.734 203.603 0 1 0 393.468 0 a 196.734 203.603 0 1 0 -393.468 0 Z M 964.876 274.053 m -118.04 0 a 118.04 122.162 0 0 1 236.08 0 a 118.04 122.162 0 0 1 -236.08 0 Z" bx:shape="ring 964.876 274.053 118.04 122.162 196.734 203.603 1@927da386" style="stroke: rgb(183, 184, 182); stroke-width: 15px; fill: rgb(79, 79, 79); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;);"/>
            </g>
            <g style="transform-origin: 962.065px 265.309px;" transform="matrix(1, 0, 0, 1, -261.544988, -38.911786)">
              <path style="stroke: rgb(183, 184, 182); stroke-width: 13.3px; fill: rgb(79, 79, 79); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(1.124193, 0, 0, 1.131444, 533.210216, 148.825031)" d="M 612.243 162.778 L 633.313 162.778 L 637.759 194.959 A 55.972 55.972 0 0 1 650.319 200.161 L 676.218 180.55 L 691.117 195.449 L 671.506 221.348 A 55.972 55.972 0 0 1 676.708 233.907 L 708.889 238.354 L 708.889 259.424 L 676.708 263.87 A 55.972 55.972 0 0 1 671.506 276.43 L 691.117 302.329 L 676.218 317.228 L 650.319 297.617 A 55.972 55.972 0 0 1 637.759 302.819 L 633.313 335 L 612.243 335 L 607.796 302.819 A 55.972 55.972 0 0 1 595.237 297.617 L 569.337 317.228 L 554.439 302.329 L 574.05 276.43 A 55.972 55.972 0 0 1 568.848 263.87 L 536.667 259.424 L 536.667 238.354 L 568.848 233.907 A 55.972 55.972 0 0 1 574.05 221.348 L 554.439 195.449 L 569.337 180.55 L 595.237 200.161 A 55.972 55.972 0 0 1 607.796 194.959 Z M 622.778 223.056 A 25.833 25.833 0 0 0 622.778 274.722 A 25.833 25.833 0 0 0 622.778 223.056" bx:shape="cog 622.778 248.889 25.833 55.972 86.111 0.38 8 1@6653d124">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </path>
              <path style="stroke: rgb(183, 184, 182); stroke-width: 13.3px; fill: rgb(79, 79, 79); transform-box: fill-box; transform-origin: 50% 50%; filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#outline-filter-4&quot;) url(&quot;#outline-filter-5&quot;);" transform="matrix(1.124193, 0, 0, 1.131444, 145.363422, -115.984576)" d="M 612.243 162.778 L 633.313 162.778 L 637.759 194.959 A 55.972 55.972 0 0 1 650.319 200.161 L 676.218 180.55 L 691.117 195.449 L 671.506 221.348 A 55.972 55.972 0 0 1 676.708 233.907 L 708.889 238.354 L 708.889 259.424 L 676.708 263.87 A 55.972 55.972 0 0 1 671.506 276.43 L 691.117 302.329 L 676.218 317.228 L 650.319 297.617 A 55.972 55.972 0 0 1 637.759 302.819 L 633.313 335 L 612.243 335 L 607.796 302.819 A 55.972 55.972 0 0 1 595.237 297.617 L 569.337 317.228 L 554.439 302.329 L 574.05 276.43 A 55.972 55.972 0 0 1 568.848 263.87 L 536.667 259.424 L 536.667 238.354 L 568.848 233.907 A 55.972 55.972 0 0 1 574.05 221.348 L 554.439 195.449 L 569.337 180.55 L 595.237 200.161 A 55.972 55.972 0 0 1 607.796 194.959 Z M 622.778 223.056 A 25.833 25.833 0 0 0 622.778 274.722 A 25.833 25.833 0 0 0 622.778 223.056" bx:shape="cog 622.778 248.889 25.833 55.972 86.111 0.38 8 1@6653d124">
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
              </path>
              <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
            </g>
            <animateMotion path="M 0 0 L 6.265 631.638 L 6.358 641.028 L 6.323 636.31 L 1.887 37.063" calcMode="linear" begin="0s" dur="12.02s" fill="freeze" keyTimes="0; 0.24706; 0.405219; 0.7147; 0.8521; 1" keyPoints="0; 0.392639; 0.4559203392028106; 0.5144051338247672; 0.7031813638396365; 1" repeatCount="indefinite"/>
          </g>
          <g style="transform-origin: 962.065px 265.309px;" transform="matrix(1, 0, 0, 1, -844.356707, -49.258355)">
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
          </g>
          <g>
            <rect x="-963.95" y="616.147" width="1092.11" height="382.882" rx="5" ry="5" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(34, 34, 34);"/>
            <path d="M -899.296 302.787 L 173.832 301.703 L 177.65 397.145 L -969.555 366.604 L -899.296 302.787 Z" style="stroke: rgb(0, 0, 0); opacity: 0.6;"/>
            <path d="M -619.98 980.008 L -517.75 980.008 L -517.75 616.158 C -517.75 615.035 -517.38 613.998 -516.76 613.163 L -619.98 613.163 L -619.98 980.008 Z M -303.26 616.158 L -303.26 980.008 L -190.99 980.008 L -190.99 613.163 L -304.25 613.163 C -303.63 613.998 -303.26 615.035 -303.26 616.158 Z M 31.522 980.008 L 116.729 980.008 C 119.49 980.008 121.729 982.247 121.729 985.008 L 121.729 1229.6 C 121.729 1232.36 119.49 1234.6 116.729 1234.6 L -953.76 1234.6 C -956.52 1234.6 -958.76 1232.36 -958.76 1229.6 L -958.76 985.008 C -958.76 982.247 -956.52 980.008 -953.76 980.008 L -840.49 980.008 L -840.49 613.163 L -959.78 613.163 C -962.54 613.163 -964.78 610.924 -964.78 608.163 L -964.78 385.627 C -964.78 382.866 -962.54 380.627 -959.78 380.627 L 124.749 380.627 C 127.51 380.627 129.749 382.866 129.749 385.627 L 129.749 608.163 C 129.749 610.924 127.51 613.163 124.749 613.163 L 31.522 613.163 L 31.522 980.008 Z" style="fill: url(&quot;#pattern-0&quot;); stroke: rgb(255, 255, 255); paint-order: stroke; stroke-width: 14px; filter: url(&quot;#outline-filter-6&quot;);"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 20;0 0" begin="0s" dur="7.59s" fill="freeze" keyTimes="0; 0.469893; 1" repeatCount="indefinite"/>
          </g>
          <g style="filter: url(&quot;#outline-filter-7&quot;);">
            <rect x="-836.52" y="-420.05" width="273.963" height="245.498" rx="5" ry="5" style="fill: url(&quot;#pattern-0&quot;); stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
            <animateMotion path="M 0 -116 L 3.789 513.676 L 8.69 513.705 C 12.229 513.726 15.806 513.747 19.419 513.768 C 28.828 513.824 -22.091 512.668 -12.209 512.727 C 331.096 514.751 1005.309 518.949 1005.309 518.949" calcMode="linear" begin="0s" dur="6.26s" fill="freeze" keyTimes="0; 0.376763; 0.479283; 0.6414; 1" keyPoints="0; 0.376763; 0.4517792498819137; 0.5704039999999999; 1" repeatCount="indefinite"/>
            <animate attributeName="display" values="inline; inline" begin="13.22s" dur="2s" fill="freeze"/>
          </g>
          <g>
            <rect x="-194.51" y="-10.024" width="369.51" height="379.861" style="fill: url(&quot;#gradient-0&quot;); stroke: rgba(0, 0, 0, 0);">
              <animate attributeName="opacity" values="0;0;1;0.06" begin="0s" dur="6.06s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.679079; 0.88981; 1"/>
            </rect>
            <rect x="152.458" y="-6.63" width="1183.35" height="382.882" rx="5" ry="5" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(34, 34, 34); stroke-width: 1;"/>
            <path d="M 208.388 651.981 L 1286.804 653.017 L 1333.539 622.364 L 1340.96 557.623 L 134.551 588.164 L 208.388 651.981 Z" style="stroke: rgb(0, 0, 0); opacity: 0.6; stroke-width: 1;"/>
            <g>
              <g>
                <path d="M 525.164 357.231 L 635.934 357.231 L 635.934 -6.619 C 635.934 -7.742 636.335 -8.779 637.007 -9.614 L 525.164 -9.614 L 525.164 357.231 Z M 868.344 -6.619 L 868.344 357.231 L 989.993 357.231 L 989.993 -9.614 L 867.271 -9.614 C 867.943 -8.779 868.344 -7.742 868.344 -6.619 Z M 1231.09 357.231 L 1323.42 357.231 C 1326.41 357.231 1328.84 359.47 1328.84 362.231 L 1328.84 606.823 C 1328.84 609.583 1326.41 611.823 1323.42 611.823 L 163.5 611.823 C 160.509 611.823 158.082 609.583 158.082 606.823 L 158.082 362.231 C 158.082 359.47 160.509 357.231 163.5 357.231 L 286.232 357.231 L 286.232 -9.614 L 156.977 -9.614 C 153.986 -9.614 151.559 -11.853 151.559 -14.614 L 151.559 -237.15 C 151.559 -239.91 153.986 -242.15 156.977 -242.15 L 1332.11 -242.15 C 1335.1 -242.15 1337.53 -239.91 1337.53 -237.15 L 1337.53 -14.614 C 1337.53 -11.853 1335.1 -9.614 1332.11 -9.614 L 1231.09 -9.614 L 1231.09 357.231 Z" style="fill: url(&quot;#pattern-0-0&quot;); stroke: rgb(255, 255, 255); paint-order: stroke; stroke-width: 14; filter: url(&quot;#filter-4&quot;);"/>
              </g>
            </g>
          </g>
          <g id="${TARGET_GEAR_GROUP_ID}" style="transform-origin: 2242.8px 499.065px;">
            <path d="M 2059.4 -136.06 H 2426.21 V 306.515 H 2850.41 V 691.615 H 2426.21 V 1134.19 H 2059.4 V 691.615 H 1635.2 V 306.515 H 2059.4 Z" bx:shape="cross 1635.2 -136.06 1215.21 1270.25 385.1 366.811 0.5 1@49c04065" style="fill: url(&quot;#pattern-0&quot;); stroke-width: 7px; stroke: rgb(255, 255, 255); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-3&quot;);"/>
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;90;90;0;0" begin="0s" dur="5.04s" fill="freeze" keyTimes="0; 0.194787; 0.400551; 0.595292; 1" repeatCount="indefinite"/>
          </g>
          <a href="#">
            <g id="${TARGET_BUTTON_ID}" transform="matrix(1, 0, 0, 1, 466.368998, 446.936014)" style="transform-origin: 1777.19px 40.732px; cursor: pointer;">
              <ellipse style="fill: url(&quot;#pattern-0&quot;); stroke: rgb(0, 0, 0); stroke-width: 12px; filter: url(&quot;#drop-shadow-filter-5&quot;);" cx="1777.19" cy="40.732" rx="169.271" ry="172.911"/>
              <path d="M -1647.712 48.361 L -1571.125 203.892 L -1724.3 203.892 L -1647.712 48.361 Z" bx:shape="triangle -1724.3 48.361 153.175 155.531 0.5 0 1@024c2f30" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-4&quot;); transform-origin: -1647.75px 126.126px;" transform="matrix(0, 1, -1, 0, 3446.68191, -93.727275)"/>
              <animate attributeName="opacity" values="1;0.73;1" begin="click" dur="1s" fill="freeze" keyTimes="0; 0.494077; 1"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.9 0.9;1 1" begin="click" dur="1s" fill="freeze" keyTimes="0; 0.486831; 1"/>
            </g>
          </a>
          <path style="fill: url(&quot;#pattern-0&quot;); stroke: rgb(0, 0, 0); stroke-width: 3.38777px; filter: url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-6&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(4.37221, 0, 0, 4.483169, 3239.171476, 162.017455)" d="M 949.388 212.778 L 976.167 212.778 L 981.819 253.679 A 71.139 71.139 0 0 1 997.781 260.291 L 1030.699 235.365 L 1049.635 254.301 L 1024.709 287.219 A 71.139 71.139 0 0 1 1031.321 303.181 L 1072.222 308.833 L 1072.222 335.612 L 1031.321 341.263 A 71.139 71.139 0 0 1 1024.709 357.226 L 1049.635 390.143 L 1030.699 409.079 L 997.781 384.154 A 71.139 71.139 0 0 1 981.819 390.766 L 976.167 431.667 L 949.388 431.667 L 943.737 390.766 A 71.139 71.139 0 0 1 927.774 384.154 L 894.857 409.079 L 875.921 390.143 L 900.846 357.226 A 71.139 71.139 0 0 1 894.235 341.263 L 853.333 335.612 L 853.333 308.833 L 894.235 303.181 A 71.139 71.139 0 0 1 900.846 287.219 L 875.921 254.301 L 894.857 235.365 L 927.774 260.291 A 71.139 71.139 0 0 1 943.737 253.679 Z M 962.778 289.389 A 32.833 32.833 0 0 0 962.778 355.056 A 32.833 32.833 0 0 0 962.778 289.389" bx:shape="cog 962.778 322.222 32.833 71.139 109.444 0.38 8 1@9c3ccc70">
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="0s" dur="3.13s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
          </path>
        </svg>
    `;

    // 2. Extracción y Normalización del Engranaje (para poder clonarlo en el DOM HTML)
    // Se ha extraído solo el PATH y se ha envuelto en un SVG normalizado.
    const GEAR_CLONE_SVG_CONTENT = `
        <svg class="gear-clone-svg" viewBox="1600 -200 1300 1400" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
            <path d="M 2059.4 -136.06 H 2426.21 V 306.515 H 2850.41 V 691.615 H 2426.21 V 1134.19 H 2059.4 V 691.615 H 1635.2 V 306.515 H 2059.4 Z" style="fill: rgb(34, 34, 34); stroke-width: 30px; stroke: rgb(255, 255, 255); filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));"/>
            <animateTransform attributeName="transform" type="rotate" from="0 2242.8 499.065" to="360 2242.8 499.065" dur="5s" repeatCount="indefinite"/>
        </svg>
    `;


    // 3. Inject CSS Styles
    GM_addStyle(`
        /* Aumento del tamaño del menú (Respuesta a la solicitud del usuario) */
        #gear-menu-container {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 450px; /* **MENU MÁS GRANDE** */
            height: auto;
            z-index: 10000;
            cursor: grab;
        }
        #gear-menu-container:active {
            cursor: grabbing;
        }

        /* Estilos base para los clones de engranaje */
        .gear-clone-wrapper {
            position: fixed;
            width: 150px; /* Tamaño visible del engranaje */
            height: 150px;
            z-index: 10001;
            transition: opacity 0.5s ease-out;
            pointer-events: none;
        }

        /* --------------------------------- */
        /* EFECTO 2: REBOTE */
        /* --------------------------------- */
        @keyframes bounce-fall {
            0% { transform: translateY(0); }
            10% { transform: translateY(0); }
            15% { transform: translateY(calc(100vh - 150px - var(--start-y, 0px))); } /* Cae al suelo */
            25% { transform: translateY(calc(100vh - 250px - var(--start-y, 0px))); } /* Rebota 1 */
            35% { transform: translateY(calc(100vh - 150px - var(--start-y, 0px))); }
            45% { transform: translateY(calc(100vh - 200px - var(--start-y, 0px))); } /* Rebota 2 */
            55% { transform: translateY(calc(100vh - 150px - var(--start-y, 0px))); }
            100% { transform: translateY(calc(100vh - 150px - var(--start-y, 0px))); }
        }
        .gear-bounce {
            animation: bounce-fall 7s linear forwards;
            top: 0; /* Aseguramos que el 'top' se usa para la posición inicial, no la animación */
        }

        /* --------------------------------- */
        /* EFECTO 3: COLISIÓN Y DESINTEGRACIÓN */
        /* --------------------------------- */
        @keyframes disintegrate {
            0% { opacity: 1; transform: scale(1) rotate(0deg); }
            100% { opacity: 0; transform: scale(0.01) rotate(1080deg); }
        }
        @keyframes move-collision-A {
            from { left: -150px; }
            to { left: calc(50vw - 75px); } /* Centro */
        }
        @keyframes move-collision-B {
            from { left: 100vw; }
            to { left: calc(50vw - 75px); } /* Centro */
        }
        .gear-collision-A {
            animation: move-collision-A 2s ease-in forwards;
        }
        .gear-collision-B {
            animation: move-collision-B 2s ease-in forwards;
        }
        .gear-disintegrate-effect {
            animation: disintegrate 0.6s ease-out forwards;
        }
    `);


    // 4. Funciones de Efectos

    /**
     * Crea un div clon del engranaje en posición absoluta.
     */
    function createGearClone(className = '') {
        const wrapper = document.createElement('div');
        wrapper.className = `gear-clone-wrapper ${className}`;
        wrapper.innerHTML = GEAR_CLONE_SVG_CONTENT;
        document.body.appendChild(wrapper);
        return wrapper;
    }

    /**
     * EFECTO 1: Seguir el mouse del usuario.
     */
    function effectFollowMouse() {
        const gear = createGearClone('follow');
        gear.style.opacity = 1;
        gear.style.width = '200px';
        gear.style.height = '200px';

        const mouseFollower = (e) => {
            // Centra el engranaje en el cursor
            gear.style.left = `${e.clientX - 100}px`;
            gear.style.top = `${e.clientY - 100}px`;
        };

        document.addEventListener('mousemove', mouseFollower);

        setTimeout(() => {
            document.removeEventListener('mousemove', mouseFollower);
            gear.style.opacity = 0;
            // Eliminar el elemento después de la transición de fade out
            setTimeout(() => gear.remove(), 600);
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: 7 clones caen del cielo y rebotan en el suelo.
     */
    function effectClonesBounce() {
        const COUNT = 7;
        const screenHeight = window.innerHeight;

        for (let i = 0; i < COUNT; i++) {
            const initialX = Math.random() * (window.innerWidth - 150);
            const initialY = -150 - (i * 50); // Empieza más arriba y espaciado
            const gear = createGearClone('gear-bounce');

            gear.style.left = `${initialX}px`;
            gear.style.top = `${initialY}px`;
            // Usamos una variable CSS para ajustar el rebote a la posición inicial
            gear.style.setProperty('--start-y', `${initialY}px`);

            gear.style.animationDuration = `${BOUNCE_DURATION}ms`;
            gear.style.animationDelay = `-${Math.random() * 3}s`; // Inicia en diferentes fases
            gear.style.opacity = 1;

            // Eliminar después de 7 segundos
            setTimeout(() => {
                gear.style.opacity = 0;
                setTimeout(() => gear.remove(), 600);
            }, BOUNCE_DURATION);
        }
    }

    /**
     * EFECTO 3: 2 engranajes chocan y se desintegran.
     */
    function effectCollisionDisintegrate() {
        const gearA = createGearClone('gear-collision-A');
        const gearB = createGearClone('gear-collision-B');

        gearA.style.opacity = 1;
        gearB.style.opacity = 1;
        gearA.style.top = '50vh';
        gearB.style.top = '50vh';

        // Iniciar el movimiento de colisión (dura 2 segundos)
        // La animación CSS se encarga del movimiento.

        // Retardo para la colisión + desintegración
        setTimeout(() => {
            // Activar animación de desintegración
            gearA.classList.remove('gear-collision-A');
            gearB.classList.remove('gear-collision-B');
            gearA.classList.add('gear-disintegrate-effect');
            gearB.classList.add('gear-disintegrate-effect');
        }, 2000); // 2 segundos, cuando se chocan

        // Eliminar ambos elementos después de la desintegración
        setTimeout(() => {
            gearA.remove();
            gearB.remove();
        }, 2000 + 600); // Duración del movimiento + duración de desintegración
    }

    // 5. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        const menuContainer = document.getElementById('gear-menu-container');
        if(menuContainer) menuContainer.style.opacity = '0.3';

        const effects = [
            effectFollowMouse,
            effectClonesBounce,
            effectCollisionDisintegrate
        ];

        const randomEffectIndex = Math.floor(Math.random() * effects.length);
        effects[randomEffectIndex]();

        // Mostrar el menú de nuevo
        const maxDuration = BOUNCE_DURATION;
        setTimeout(() => {
             if(menuContainer) menuContainer.style.opacity = '1';
        }, maxDuration);
    }

    /**
     * Hace un elemento HTML arrastrable.
     */
    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // No iniciar el drag si se hace clic en el botón
            if (e.target.closest(`#${TARGET_BUTTON_ID}`) || e.target.closest('a[href="#"]')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 6. Inicialización
    window.addEventListener('load', () => {
        // Crear contenedor e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = 'gear-menu-container';
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        const svgElement = document.getElementById('saw-motors-svg');
        if (!svgElement) return;

        // 6.1. Hacer el menú arrastrable
        dragElement(menuContainer);

        // 6.2. Asignar el evento al botón de acción
        const actionButton = svgElement.querySelector(`#${TARGET_BUTTON_ID}`);
        if (actionButton) {
            actionButton.addEventListener('click', handleButtonClick);
        }
    });

})();