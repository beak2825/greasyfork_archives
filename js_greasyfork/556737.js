// ==UserScript==
// @name         Fidelity Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Forces a dark theme on Fidelity.com using CSS inversion and adjustments. Optimized for color perception, transparency, and specific data card components.
// @author       ice_fly
// @match        *://*.fidelity.com/*
// @license      GNU GPLv3 
// @grant        GM_addStyle
// @run-at       document-start //use document-start to ensure the styles load as early as possible to prevent a "flash of white" before dark mode kicks in.
// @icon         https://greasyfork.org/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTk2ODkwLCJwdXIiOiJibG9iX2lkIn19--f204b4fe40741e4f1ea0fa3a947fb858d0013bb8/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlsyMDAsMjAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--74d795a80595346362306a325643f8710996102f/mark_composite_light__e4488798cdedc751dc9904fa78e1f408.png?locale=en
// @downloadURL https://update.greasyfork.org/scripts/556737/Fidelity%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556737/Fidelity%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dark_mode_css = ` html {
            filter: invert(100%) hue-rotate(180deg) !important; //Invert(100%) makes white -> black and black -> white (luminance inversion) Hue-rotate(180deg) fixes the color hue so that red/green (finance colors) remain correctly perceived after the luminance inversion
            background-color: #FFF !important; //Deep dark background for the page
        }

        img:not(.simple-footer--fid-logo), video, canvas, [role="img"], //General role for images
        .icon, svg:not(.apex-kit-web-icon-root), polyline, path, .Fidelity-svg-icon, //Targeting common SVG icons used by Fidelity
        .chart, // Charts often use canvas or specific containers
        {
            filter: invert(90%) hue-rotate(180deg) !important;
        }

        div, span, li, p, section, header, footer, main {
            border-color: rgba(255, 255, 255, 0.15) !important; //Subtle light gray border
            box-shadow: none !important; // Remove bright box shadows
        }

        a {
            color: #4ac9ff !important; // Bright blue for links
        }

        .DDS_Button, button, input[type="submit"], input[type="button"] {
            border-color: #0076a8 !important;
        }

        .chart-container, .highcharts-container, .DDS_Chart {
            background-color: transparent !important;
        }`;

    // Apply the CSS styles using GM_addStyle
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(dark_mode_css);
    } else {
        // Fallback for non-Violentmonkey environments (less reliable)
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(dark_mode_css));
        document.head.appendChild(style);
    }
})();