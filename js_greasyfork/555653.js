// ==UserScript==
// @name         Drawaria The Fairys Script - HAPPY NEW YEAR 2026! 🌌✨
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lanza un mini-juego de plataformas de Año Nuevo ocultando todo el DOM original. Recolecta monedas con efectos festivos.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555653/Drawaria%20The%20Fairys%20Script%20-%20HAPPY%20NEW%20YEAR%202026%21%20%F0%9F%8C%8C%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555653/Drawaria%20The%20Fairys%20Script%20-%20HAPPY%20NEW%20YEAR%202026%21%20%F0%9F%8C%8C%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTES ---
    const MENU_ID = 'fairys-script-menu-container';
    const GAME_CONTAINER_ID = 'fairys-new-year-game';
    const PLAYER_ID = 'player';
    const HUD_SCORE_ID = 'fairys-score-hud'; // Nuevo ID para el score dentro del menú
    const DREAMCAST_SOUND_URL = 'https://www.myinstants.com/media/sounds/mariah-carey-defrost.mp3';
    const COIN_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-coin.mp3';
    const EFFECT_DURATION = 4000;

    let gameActive = false;
    let score = 0;

    // 1. Contenido del SVG RESTAURADO
    const menuSVG = `
        <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2.863 1278.806 500" xmlns:bx="https://boxy-svg.com">
  <text style="fill: rgb(242, 202, 171); font-family: Agbalumo; font-size: 52.8px; text-transform: capitalize; white-space: pre; filter: url(&quot;#point-light-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" x="345.369" y="135.127">HAPPY NEW YEAR 2026!</text>
  <text style="fill: rgb(242, 202, 171); font-family: Agbalumo; font-size: 52.8px; text-transform: capitalize; white-space: pre; filter: url(&quot;#point-light-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" x="384.847" y="70.681">THE FAIRYS SCRIPT!</text>
  <defs>
    <style bx:fonts="Agbalumo">@import url(https://fonts.googleapis.com/css2?family=Agbalumo%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
    <filter id="point-light-filter-0" bx:preset="point-light 1 0.5 0.5 0.5 15 2 0.01 0.22 #ffffff" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feSpecularLighting result="specular-lighting" lighting-color="#ffffff" specularConstant="2" specularExponent="15">
        <fePointLight x="0.5" y="0.5" z="0.5"/>
      </feSpecularLighting>
      <feDiffuseLighting result="diffuse-lighting" lighting-color="#ffffff" diffuseConstant="0.01">
        <fePointLight x="0.5" y="0.5" z="0.5"/>
      </feDiffuseLighting>
      <feMerge result="lighting">
        <feMergeNode in="diffuse-lighting"/>
        <feMergeNode in="specular-lighting"/>
      </feMerge>
      <feComposite in="SourceGraphic" in2="lighting" operator="arithmetic" k1="1" k2="0.22" k3="0" k4="0"/>
    </filter>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 5 5 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
      <feOffset dx="5" dy="5"/>
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
    <bx:export>
      <bx:file format="jpeg" path="s.jpeg"/>
    </bx:export>
  </defs>
  <g transform="matrix(0.952315, 0, 0, 1.142278, 8.738561, 112.712626)" style="pointer-events: none;">
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
  <g transform="matrix(0.952315, 0, 0, 1.142278, 8.738561, 112.712626)" style="pointer-events: none;">
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
    <g transform="matrix(0.602859, 0, 0, 0.602859, 1.355584, 161.386463)" style="">
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
    <g transform="matrix(0.602859, 0, 0, 0.602859, 1.355584, 161.386463)" style="">
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
  </g>
  <title/>
  <g id="Composition_445b829fca0b4132b3d29b0a3ad1fc42" transform="matrix(0.76305, 0, 0, 0.76305, 263.442114, 156.662754)" style="">
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
  <g>
    <g style="" transform="matrix(0.492831, 0, 0, 0.492831, 520.641613, 154.544864)">
      <g transform="matrix(1.579664, 0, 0, 1.894767, 27.836423, -26.943587)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="group-1" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
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
              <g fill="#ffffff" fill-opacity="1" id="group-2" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
                <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke:none;"/>
                <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
              </g>
            </g>
          </g>
        </g>
        <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
      </g>
    </g>
    <g transform="matrix(0.492831, 0, 0, 0.492831, 520.641613, 154.544864)" style="">
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
    <g transform="matrix(0.492831, 0, 0, 0.492831, 520.148815, 154.544864)" style="">
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
  </g>
  <g transform="matrix(1, 0, 0, 1, 8.709762, -1.451624)">
    <g transform="matrix(0.711387, 0, 0, 0.865226, 747.847611, 179.348286)" style="">
      <g transform="rotate(0)">
        <g transform="scale(1 1)">
          <g transform="translate(0 0)">
            <g fill="#ffffff" fill-opacity="1" id="group-3" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
              <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="stroke: none; pointer-events: none;"/>
              <path d="M 120.216,226.438 C 115.36,226.438 111.055,224.112 108.392,220.53 104.645,226.83 96.86,231.161 87.864,231.161 81.511,231.161 75.762,229.001 71.613,225.513 66.547,229.591 59.615,232.105 51.971,232.105 36.451,232.105 23.87,221.744 23.87,208.963 23.87,203.873 31.426,181.571 31.426,181.571 31.426,181.571 138.86,198.566 138.86,198.566 138.86,198.566 136.524,213.334 136.524,213.334 136.524,213.334 134.82,213.064 134.82,213.064 134.283,220.539 127.95,226.438 120.216,226.438 120.216,226.438 120.216,226.438 120.216,226.438 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
          </g>
        </g>
      </g>
      <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
    </g>
    <g transform="matrix(0.711387, 0, 0, 0.865226, 747.847611, 179.348286)" style="">
      <g transform="rotate(0)">
        <g transform="scale(1 1)">
          <g transform="translate(0 0)">
            <g fill="#ffffff" fill-opacity="1" id="group-4" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
              <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="stroke: none; pointer-events: none;"/>
              <path d="M 190.201,224.931 C 195.057,224.931 199.36,222.605 202.024,219.024 205.771,225.324 213.556,229.654 222.551,229.654 228.906,229.654 234.656,227.493 238.806,224.003 243.872,228.083 250.805,230.598 258.451,230.598 273.971,230.598 286.552,220.237 286.552,207.456 286.552,202.364 278.993,180.068 278.993,180.068 278.993,180.068 171.559,197.063 171.559,197.063 171.559,197.063 173.895,211.831 173.895,211.831 173.895,211.831 182.469,224.931 190.201,224.931 190.201,224.931 190.201,224.931 190.201,224.931 Z" style="fill:none;stroke-dasharray:none;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;"/>
            </g>
          </g>
        </g>
      </g>
      <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.155556; 0.350000; 0.583333; 0.811111" path="M 0,0 C 0,0 0,16.7888 0,16.7888 0,16.7888 0,-4.19721 0,-4.19721 0,-4.19721 0,11.5423 0,11.5423 0,11.5423 -1.0493,-3.14791 -1.0493,-3.14791" repeatCount="indefinite"/>
    </g>
    <g transform="matrix(0.566404, 0, 0, 0.566404, 726.751053, 177.349476)" style="">
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
    <g style="" transform="matrix(0.567743, 0, 0, 0.544191, 726.184097, 183.890217)">
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
  </g>
  <title/>
  <g id="Composition_237f8cc0cf064b83bd9184e9a0d70fd2" transform="matrix(0.885189, 0, 0, 0.885189, 957.22286, 168.622913)" style="">
    <g id="Layer_6fcc2b7d79124000a55163479d062c32" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
      <g transform="translate(0 0)" style="">
        <g transform="rotate(0)">
          <g transform="scale(1 1)">
            <g transform="translate(0 0)">
              <g fill="#ffffff" fill-opacity="1" id="group-5" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
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
              <g fill="#ffffff" fill-opacity="1" id="group-6" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
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
              <g fill="#ff3f09" fill-opacity="1" id="group-7" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1">
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
</svg>
    `;

    // --- CONFIGURACIÓN DEL JUEGO (Mantenida) ---
    const GAME_CONFIG = {
        gravity: 0.8,
        jumpPower: -18,
        moveSpeed: 6,
        platforms: [
    { x: 100, y: 500, w: 150, h: 20, color: '#9d58ed' },
    { x: 350, y: 450, w: 150, h: 20, color: '#9d58ed' },
    { x: 600, y: 400, w: 150, h: 20, color: '#ff69b4' },
    { x: 850, y: 350, w: 150, h: 20, color: '#00ffff' },
    { x: 1100, y: 300, w: 150, h: 20, color: '#ff4500' }
        ],
        coins: [
            { id: 1, x: 150, y: 450, collected: false },
            { id: 2, x: 850, y: 450, collected: false },
            { id: 3, x: 450, y: 300, collected: false },
            { id: 4, x: 180, y: 250, collected: false },
            { id: 5, x: 880, y: 300, collected: false }
        ]
    };

    // --- ESTADO DEL JUGADOR (Mantenido) ---
    const playerState = {
        x: 100,
        y: 400,
        width: 30,
        height: 30,
        vx: 0,
        vy: 0,
        onGround: false,
        keys: {}
    };

    // --- 2. ESTILOS CSS (ACTUALIZADO PARA EL SVG HUD) ---
    GM_addStyle(`
        /* Ocultar DOM de Drawaria */
        .game-active-body > *:not(#start-button-overlay):not(#${MENU_ID}):not(#${GAME_CONTAINER_ID}) {
            display: none !important;
        }

        /* Botón de Inicio (Mantenido) */
        #start-button-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000033;
            z-index: 100000;
            display: flex; justify-content: center; align-items: center;
        }
        #start-button {
            width: 400px; height: 150px;
            background: linear-gradient(135deg, #f8f8ff, #ffddf4);
            border: 5px solid #800080;
            border-radius: 25px;
            color: #800080;
            font-size: 32px;
            font-weight: bold;
            font-family: 'Agbalumo', cursive;
            cursor: pointer;
            box-shadow: 0 0 40px #ff00ff, inset 0 0 20px #da70d6;
            text-align: center;
            line-height: 140px;
            user-select: none;
            transition: transform 0.1s;
        }
        #start-button:active {
            transform: scale(0.95);
        }

        /* MENU/HUD CENTRAL PULSANTE (Contiene el SVG y el Score) */
        @keyframes menu-pulse {
            0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px #ff00ff; }
            50% { transform: translate(-50%, -50%) scale(1.03); box-shadow: 0 0 40px #00ffff; }
            100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px #ff00ff; }
        }
        #${MENU_ID} {
            position: fixed;
            top: 50%; left: 50%;
            width: 700px; /* Tamaño del HUD */
            height: 350px; /* Altura para el SVG */
            transform: translate(-50%, -50%);
            z-index: 100020;
            cursor: default;
            display: none;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 15px;
            padding: 10px;
            text-align: center;
            animation: menu-pulse 2s infinite alternate;
            border: 5px solid gold;
            overflow: hidden;
        }

        /* Contenedor del Score dentro del HUD */
        #${HUD_SCORE_ID} {
            position: absolute;
            top: 90%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            color: #fff;
            font-size: 32px;
            font-weight: bold;
            font-family: 'Agbalumo', cursive;
            text-shadow: 0 0 10px #ff00ff;
        }

        /* --- CONTENEDOR DEL JUEGO (Mantenido) --- */
        #${GAME_CONTAINER_ID} {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at bottom, #000066 0%, #000011 80%);
            overflow: hidden;
            z-index: 100010;
            display: none;
            border: 10px solid gold;
        }

        /* Personaje (Mantenido) */
        #${PLAYER_ID} {
            position: absolute;
            width: ${playerState.width}px;
            height: ${playerState.height}px;
            background: radial-gradient(circle, white, yellow, #ff00ff);
            border-radius: 50%;
            box-shadow: 0 0 15px gold;
            transition: transform 0.05s ease-out;
            z-index: 100015;
        }

        /* Plataformas, Monedas y Partículas (Mantenidos) */
        .platform {
            position: absolute;
            background-color: var(--color);
            border: 3px solid #f8f8ff;
            box-shadow: 0 0 15px var(--color);
            border-radius: 5px;
        }
        @keyframes coin-spin {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }
        .coin {
            position: absolute;
            width: 20px;
            height: 20px;
            background: gold;
            border-radius: 50%;
            box-shadow: 0 0 10px orange;
            animation: coin-spin 1s linear infinite;
            cursor: default;
            z-index: 100015;
        }
        .coin.collected {
            opacity: 0;
            transform: scale(3);
            transition: all 0.3s;
        }
        @keyframes star-fall {
            0% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh) scale(1); opacity: 0; }
        }
        .background-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 5px #00ffff;
            opacity: 0;
            pointer-events: none;
        }
    `);

    // --- 3. FUNCIONES UTILITY (Mantenidas) ---

    function playSound(url) {
        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio playback failed:", e));
        } catch (error) {
            console.error("Error al reproducir el sonido:", error);
        }
    }

    function generateBackgroundParticles() {
        // ... (Implementación mantenida)
        const gameContainer = document.getElementById(GAME_CONTAINER_ID);
        if (!gameContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'background-particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.animation = `star-fall ${Math.random() * 10 + 5}s linear infinite`;
            particle.style.animationDelay = `-${Math.random() * 15}s`;
            gameContainer.appendChild(particle);
        }
    }

    function fireworkBurst(x, y) {
        // ... (Implementación mantenida)
        const gameContainer = document.getElementById(GAME_CONTAINER_ID);
        if (!gameContainer) return;

        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff88ff'];
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px; height: 3px;
                border-radius: 50%;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 5px white;
                opacity: 1;
                transition: all 0.8s ease-out;
                z-index: 100016;
            `;
            gameContainer.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 80 + 30;
            const finalX = x + distance * Math.cos(angle);
            const finalY = y + distance * Math.sin(angle);

            setTimeout(() => {
                particle.style.transform = `translate(${finalX - x}px, ${finalY - y}px) scale(0.1)`;
                particle.style.opacity = 0;
            }, 10);

            setTimeout(() => particle.remove(), 1000);
        }
    }


    // --- 4. LÓGICA DEL JUEGO (Mantenida) ---

    function updatePhysics() {
        // ... (Lógica de física mantenida)
        if (!gameActive) return;

        playerState.onGround = false;

        // Movimiento Horizontal
        playerState.x += playerState.vx;
        playerState.vx = 0;

        // Aplicar Gravedad
        playerState.vy += GAME_CONFIG.gravity;
        playerState.y += playerState.vy;

        // Chequeo de Colisiones con Plataformas
        const playerRect = {
            left: playerState.x,
            right: playerState.x + playerState.width,
            top: playerState.y,
            bottom: playerState.y + playerState.height
        };

        let hitPlatform = false;
        GAME_CONFIG.platforms.forEach(p => {
            if (playerRect.right > p.x && playerRect.left < (p.x + p.w)) {
                if (playerState.vy > 0 && playerRect.bottom > p.y && playerRect.bottom < p.y + playerState.height) {
                    playerState.y = p.y - playerState.height;
                    playerState.vy = 0;
                    playerState.onGround = true;
                    hitPlatform = true;
                }
            }
        });

        // Colisión con el suelo
        const gameHeight = window.innerHeight;
        if (!hitPlatform && playerState.y + playerState.height > gameHeight) {
            playerState.y = gameHeight - playerState.height;
            playerState.vy = 0;
            playerState.onGround = true;
        }
    }

    function handleInput() {
        // ... (Lógica de input mantenida)
        if (playerState.keys['ArrowLeft']) {
            playerState.vx = -GAME_CONFIG.moveSpeed;
        }
        if (playerState.keys['ArrowRight']) {
            playerState.vx = GAME_CONFIG.moveSpeed;
        }
        if (playerState.keys['ArrowUp'] && playerState.onGround) {
            playerState.vy = GAME_CONFIG.jumpPower;
            playerState.onGround = false;
        }
    }

    function checkCoinCollision() {
        // ... (Lógica de colisión mantenida)
        const playerRect = {
            x: playerState.x,
            y: playerState.y,
            w: playerState.width,
            h: playerState.height
        };

        GAME_CONFIG.coins.forEach(coin => {
            if (coin.collected) return;

            const coinElement = document.getElementById(`coin-${coin.id}`);
            if (!coinElement) return;

            if (playerRect.x < coin.x + 20 &&
                playerRect.x + playerRect.w > coin.x &&
                playerRect.y < coin.y + 20 &&
                playerRect.y + playerRect.h > coin.y) {

                coin.collected = true;
                score++;
                playSound(COIN_SOUND_URL);
                coinElement.classList.add('collected');

                fireworkBurst(coin.x + 10, coin.y + 10);
                updateScoreHUD();

                if (score === GAME_CONFIG.coins.length) {
                    setTimeout(endGame, 1000);
                }
            }
        });
    }

    /** ACTUALIZADA: Ahora apunta al elemento de score dentro del HUD. */
    function updateScoreHUD() {
        const scoreHud = document.getElementById(HUD_SCORE_ID);
        if (scoreHud) {
            scoreHud.textContent = `🎊 Score: ${score} / ${GAME_CONFIG.coins.length} Monedas 🎊`;
        }
    }

    function render() {
        // ... (Lógica de renderizado mantenida)
        const playerElement = document.getElementById(PLAYER_ID);
        if (playerElement) {
            playerElement.style.transform = `translate(${playerState.x}px, ${playerState.y}px)`;
        }
    }

    let lastTime = 0;
    function gameLoop(timestamp) {
        // ... (Game loop mantenido)
        if (!gameActive) return;

        const delta = timestamp - lastTime;
        lastTime = timestamp;

        handleInput();
        updatePhysics();
        checkCoinCollision();
        render();

        requestAnimationFrame(gameLoop);
    }

    // --- 5. INICIALIZACIÓN Y CONTROL DE FLUJO ---

    function setupGameEnvironment() {
        // 1. Crear contenedor del juego
        const gameContainer = document.createElement('div');
        gameContainer.id = GAME_CONTAINER_ID;
        document.body.appendChild(gameContainer);

        // 2. Renderizar elementos del juego (Plataformas, Monedas, Jugador)
        GAME_CONFIG.platforms.forEach(p => {
            const platform = document.createElement('div');
            platform.className = 'platform';
            platform.style.left = `${p.x}px`;
            platform.style.top = `${p.y}px`;
            platform.style.width = `${p.w}px`;
            platform.style.height = `${p.h}px`;
            platform.style.setProperty('--color', p.color);
            gameContainer.appendChild(platform);
        });

        GAME_CONFIG.coins.forEach(coin => {
            const coinElement = document.createElement('div');
            coinElement.className = 'coin';
            coinElement.id = `coin-${coin.id}`;
            coinElement.style.left = `${coin.x}px`;
            coinElement.style.top = `${coin.y}px`;
            gameContainer.appendChild(coinElement);
        });

        const playerElement = document.createElement('div');
        playerElement.id = PLAYER_ID;
        gameContainer.appendChild(playerElement);

        generateBackgroundParticles();

        gameContainer.style.display = 'block';

        // 3. Configurar el HUD (Menú)
        const hud = document.getElementById(MENU_ID);
        hud.style.display = 'block';
        updateScoreHUD();

        // 4. Iniciar el juego
        document.body.classList.add('game-active-body');
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        gameActive = true;
        requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e) {
        playerState.keys[e.key] = true;
    }

    function handleKeyUp(e) {
        playerState.keys[e.key] = false;
    }

    /** ACTUALIZADA: Modifica el texto del score para el mensaje final. */
    function endGame() {
        gameActive = false;
        playSound(DREAMCAST_SOUND_URL);

        const hud = document.getElementById(MENU_ID);
        const scoreHud = document.getElementById(HUD_SCORE_ID);

        if (scoreHud) {
            scoreHud.textContent = `🥳 ¡FELICIDADES! ¡AÑO NUEVO 2026! 🥳 Has conseguido las ${score} monedas!`;
            // Asegurar que el mensaje final se vea bien sobre el SVG
            scoreHud.style.top = '10%';
            scoreHud.style.transform = 'translate(-50%, 0)';
        }

        if (hud) {
            hud.style.animation = 'none';
            hud.style.backgroundColor = 'rgba(255, 100, 0, 0.9)';
        }

        // Efecto masivo de fuegos artificiales
        for (let i = 0; i < 5; i++) {
             setTimeout(() => fireworkBurst(window.innerWidth / 2 + Math.random() * 200 - 100, window.innerHeight / 2), i * 300);
        }

        setTimeout(() => {
            if (scoreHud) scoreHud.textContent += " (Recarga la página para volver)";
        }, 5000);

        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }

    function handleStartButtonClick() {
        playSound(DREAMCAST_SOUND_URL);
        const startOverlay = document.getElementById('start-button-overlay');
        startOverlay.style.opacity = 0;

        setTimeout(() => {
            startOverlay.remove();
            setupGameEnvironment();
        }, 1000);
    }

    // --- 6. INICIALIZACIÓN GLOBAL (ACTUALIZADA) ---
    window.addEventListener('load', () => {
        // Crear el contenedor del menú (Ahora un HUD con el SVG)
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;

        // 1. Añadir el SVG
        menuContainer.innerHTML = menuSVG;

        // 2. Añadir el elemento para mostrar el score
        const scoreElement = document.createElement('div');
        scoreElement.id = HUD_SCORE_ID;
        menuContainer.appendChild(scoreElement);

        document.body.appendChild(menuContainer);

        // Crear el Overlay del Botón de Inicio
        const startOverlay = document.createElement('div');
        startOverlay.id = 'start-button-overlay';
        startOverlay.innerHTML = '<div id="start-button">LANZAR MINI-JUEGO DE AÑO NUEVO 2026</div>';
        document.body.appendChild(startOverlay);

        // Asignar evento para iniciar
        document.getElementById('start-button').addEventListener('click', handleStartButtonClick);
    });

})();