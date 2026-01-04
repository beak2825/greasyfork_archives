// ==UserScript==
// @name X.com Enhanced Gallery
// @namespace https://github.com/PiesP/xcom-enhanced-gallery
// @version 1.6.0
// @description Media viewer and download functionality for X.com
// @author PiesP
// @license MIT
// Copyright (c) 2024-2025 X.com Enhanced Gallery Contributors
// @homepageURL https://github.com/PiesP/xcom-enhanced-gallery
// @match https://x.com/*
// @match https://*.x.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_download
// @grant GM_notification
// @grant GM_xmlhttpRequest
// @grant GM_cookie
// @connect pbs.twimg.com
// @connect video.twimg.com
// @connect api.twitter.com
// @run-at document-idle
// @supportURL https://github.com/PiesP/xcom-enhanced-gallery/issues
// @icon https://abs.twimg.com/favicons/twitter.3.ico
// @compatible chrome 117+
// @compatible firefox 119+
// @compatible edge 117+
// @compatible safari 17+
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558276/Xcom%20Enhanced%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/558276/Xcom%20Enhanced%20Gallery.meta.js
// ==/UserScript==
/*
 * Third-Party Licenses
 * ====================
 * Source: https://github.com/PiesP/xcom-enhanced-gallery/tree/v1.6.0/LICENSES
 *
 * MIT License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (M (Lucide)
 * Copyright (c) 2016-2024 Ryan Carniato (Solid.js)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function(){if(typeof document==='undefined')return;var css=".xg-EeSh{display:flex;flex-direction:column;gap:var(--xse-g);padding:var(--xse-p)} .xg-nm9B{gap:var(--sps)} .xg-PI5C{display:flex;flex-direction:column;gap:var(--xse-cg)} .xg-VUTt{gap:var(--spx)} .xg-vhT3{font-size:var(--xse-lf);font-weight:var(--xse-lw);color:var(--xct-p)} .xg-Y62M{font-size:var(--fsx);color:var(--xct-s);letter-spacing:.04em;text-transform:uppercase} .xg-jpiS{width:100%;padding:var(--xse-sp);font-size:var(--xfs-b);color:var(--xct-p);background-color:var(--xte-b);border:var(--bwt) solid var(--xt-b);border-radius:var(--xr-m);cursor:pointer;line-height:1.375;min-height:2.75em;transform:none;overflow:visible;transition:border-color var(--xdf) var(--xe-s), background-color var(--xdf) var(--xe-s), box-shadow var(--xdf) var(--xe-s)} .xg-jpiS:hover{border-color:var(--xcb-h);background-color:var(--xte-bs);box-shadow:0 0 0 2px color-mix(in oklch, var(--xt-b) 20%, transparent 80%)} .xg-jpiS:focus, .xg-jpiS:focus-visible{border-color:var(--xfic);box-shadow:0 0 0 3px color-mix(in oklch, var(--xfic) 25%, transparent 75%)} .xg-jpiS option{padding:.5em .75em;line-height:1.5} .xg-4eoj{color:var(--xtt-c, var(--xct-p));cursor:pointer;font-size:.875em;font-weight:500;width:var(--xsb-m);height:var(--xsb-m);min-width:var(--xsb-m);min-height:var(--xsb-m);padding:.5em;aspect-ratio:1;position:relative;overflow:clip;border-radius:var(--xr-m);background:transparent;border:none;transition:var(--xts), transform var(--xdf) var(--xe-s)} .xg-4eoj:focus, .xg-4eoj:focus-visible{background:var(--xte-b, var(--xcn1))} .xg-fLg7{--toolbar-surface-base:var( --xtp-s, var(--xt-s, var(--xcbg-p, Canvas)) );--toolbar-surface-border:var(--xt-b);background:var(--toolbar-surface-base);border:none;border-radius:var(--xr-l);position:fixed;top:1.25em;left:50%;transform:translateX(-50%);z-index:var(--xz-t, 2147483620);display:var(--toolbar-display, inline-flex);align-items:center;justify-content:space-between;height:3em;padding:.5em 1em;gap:0;color:var(--xtt-c, var(--xct-p));visibility:var(--toolbar-visibility, visible);opacity:var(--toolbar-opacity, 1);pointer-events:var(--toolbar-pointer-events, auto);transition:var(--xten);user-select:none;overscroll-behavior:contain} .xg-fLg7.xg-ZpP8, .xg-fLg7.xg-t4eq{border-radius:var(--xr-l) var(--xr-l) 0 0} .xg-fLg7.xg-ojCW{--toolbar-opacity:1;--toolbar-pointer-events:auto;--toolbar-visibility:visible;--toolbar-display:inline-flex} .xg-fLg7.xg-Y6KF, .xg-fLg7.xg-n-ab, .xg-fLg7.xg-bEzl{--toolbar-opacity:1;--toolbar-pointer-events:auto;--toolbar-visibility:visible;--toolbar-display:inline-flex} .xg-f8g4{display:flex;align-items:center;justify-content:center;width:100%;max-width:100%;overflow:hidden} .xg-Ix3j{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:var(--spx);width:100%} .xg-Ix3j > *{flex:0 0 auto} .xg-0EHq{display:flex;align-items:center;justify-content:center;padding-inline:var(--sps);min-width:5em} .xg-FKnO{color:var(--xtt-m, var(--xct-p));margin:0 .125em}:where(.xg-4eoj[aria-pressed=\"true\"]){background:var(--xte-bs, var(--xcn2))} .xg-4eoj:disabled{color:var(--xtt-m, var(--xcn4));cursor:not-allowed} @media (hover:hover){.xg-4eoj:hover:not(:disabled){background:var(--xte-b, var(--xcn1));transform:translateY(var(--xb-l))}} .xg-4eoj:active:not(:disabled){background:var(--xte-bs, var(--xcn2));transform:translateY(0)} .xg-njlf{} .xg-AU-d{} .xg-Vn14{} .xg-atmJ{position:relative} .xg-GG86{position:relative;gap:0;min-width:5em;min-height:2.5em;padding-bottom:.5em;box-sizing:border-box} .xg-2cjm{color:var(--xtt-c, var(--xct-p));font-size:var(--xfs-m);font-weight:600;text-align:center;white-space:nowrap;line-height:1;background:transparent;padding:.25em .5em;border-radius:var(--xr-m);border:none} .xg-JEXm{color:var(--xtt-c, var(--xct-p));font-weight:700} .xg-d1et{color:var(--xtt-c, var(--xct-p))} .xg-vB6N{position:absolute;left:50%;bottom:.125em;transform:translateX(-50%);width:3.75em;height:.125em;background:var(--xtp-pt, var(--xcn2));border-radius:var(--xr-s);overflow:clip} .xg-LWQw{width:100%;height:100%;background:var(--xtt-c, var(--xct-p));border-radius:var(--xr-s);transition:var(--xtwn);transform-origin:left} .xg-Q7dU, button.xg-Q7dU{transition:var(--xti);position:relative;z-index:10;pointer-events:auto} .xg-Q7dU[data-selected=\"true\"]{} .xg-Q7dU:focus, .xg-Q7dU:focus-visible{border:none} @media (prefers-reduced-transparency:reduce){.xg-fLg7{background:var(--xtp-s, var(--xt-s))} [data-theme=\"dark\"] .xg-fLg7{background:var(--xtp-s, var(--xt-s))}} @media (prefers-reduced-motion:reduce){.xg-4eoj:hover:not(:disabled), .xg-atmJ:hover:not(:disabled), .xg-Vn14:hover:not(:disabled), .xg-Q7dU:hover{transform:none}}:where(.xg-JcF-, .xg-yRtv){position:absolute;top:100%;left:0;right:0;width:100%;display:flex;flex-direction:column;gap:var(--spm);padding:var(--xs-l);max-height:var(--xtp-mh);overflow:hidden;opacity:0;transform:translateY(-.5em);visibility:hidden;pointer-events:none;transition:var(--xtp-t), transform var(--xdn) var(--xe-s), visibility 0s var(--xdn);background:var( --toolbar-surface-base, var(--xtp-s, var(--xt-s)) );border-top:var(--bwt) solid var(--toolbar-surface-border, var(--xt-b));border-radius:0 0 var(--xr-l) var(--xr-l);z-index:var(--xz-tp);will-change:transform, opacity;overscroll-behavior:contain} .xg-JcF-{height:var(--xtp-h)} .xg-yRtv{min-height:var(--xtp-h)}:where(.xg-JcF-, .xg-yRtv).xg-4a2L{height:auto;opacity:1;transform:translateY(0);visibility:visible;pointer-events:auto;border-top-color:var(--toolbar-surface-border, var(--xt-b));transition:var(--xtp-t), transform var(--xdn) var(--xe-s), visibility 0s 0s;z-index:var(--xz-ta)} .xg-w56C{display:flex;flex-direction:column;gap:var(--sps)} .xg-rSWg{display:flex;align-items:center;padding-bottom:var(--xs-xs);border-bottom:var(--bwt) solid var(--toolbar-surface-border);margin-bottom:var(--xs-s)} .xg-jd-V{font-size:var(--xfs-s);font-weight:var(--xfw-s);color:var(--xtt-c);text-transform:uppercase;letter-spacing:.04em} .xg-jmjG{padding:var(--xs-s) var(--xs-m);font-size:var(--xfs-b);line-height:var(--xeg-line-height-snug);color:var(--xtt-c, var(--xct-p));background:var( --toolbar-surface-base, var(--xtp-s, var(--xt-s)) );border:var(--bwt) solid var(--toolbar-surface-border, var(--xt-b));border-radius:var(--xr-m);white-space:pre-wrap;word-wrap:break-word;overflow-y:auto;overscroll-behavior:contain;max-height:18em;transition:var(--xts);user-select:text;-webkit-user-select:text;cursor:text} .xg-jmjG::-webkit-scrollbar{width:.5em} .xg-jmjG::-webkit-scrollbar-track{background:var(--xts-t, var(--xcn2));border-radius:var(--xr-s)} .xg-jmjG::-webkit-scrollbar-thumb{background:var(--xts-th, var(--xcn4));border-radius:var(--xr-s)} .xg-jmjG::-webkit-scrollbar-thumb:hover{background:var(--xte-bs, var(--xcn5))} .xg-jmjG a{color:var(--xc-p);text-decoration:none;font-weight:var(--xfw-m);padding:.125em .25em;margin:-.125em -.25em;border-radius:var(--xr-xs);overflow-wrap:break-word;transition:color var(--xdf) var(--xe-s), background-color var(--xdf) var(--xe-s);cursor:pointer} .xg-jmjG a:hover{color:var(--xc-ph);background:var(--xte-b);text-decoration:underline;text-decoration-thickness:.0625rem;text-underline-offset:.125em} .xg-jmjG a:focus, .xg-jmjG a:focus-visible{background:var(--xte-bs, var(--xcn2));color:var(--xc-ph);border-radius:var(--xr-xs)} .xg-jmjG a:active{color:var(--xc-p-active)} .xg-0Eeq{display:flex;align-items:center;gap:var(--spx);padding:var(--sps);margin-bottom:var(--sps);background:var(--xte-bs);border:var(--bwt) solid var(--toolbar-surface-border, var(--xt-b));border-radius:var(--xr-s);transition:var(--xts)} .xg-0Eeq:hover{background:color-mix( in oklch, var(--xte-bs) 85%, var(--xc-p) 15% );border-color:var(--xcb-h)} .xg-AVKe{display:flex;align-items:center;gap:.375em;width:100%;color:var(--xc-p);text-decoration:none;font-size:var(--xfs-s);font-weight:500;transition:color var(--xdf) var(--xe-s)} .xg-AVKe:hover{color:var(--xc-ph)} .xg-AVKe:focus, .xg-AVKe:focus-visible{outline:2px solid var(--xfic);outline-offset:2px;border-radius:var(--xr-xs)} .xg-5RjR{flex-shrink:0;width:.875em;height:.875em;stroke:currentColor} .xg-8Stf{flex-shrink:0;color:var(--xtt-m, var(--xct-s));font-weight:600} .xg-3pwZ{flex:1;color:var(--xc-p);overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .xg-sltl{width:100%;height:var(--bwt);background:color-mix(in oklch, var(--toolbar-surface-border) 60%, transparent 40%);margin:var(--xs-m) 0;border-radius:var(--xr-s)} @layer xeg.components{:root{--xtt:opacity var(--xdt) var(--xeo), transform var(--xdt) var(--xeo), visibility 0ms;--xeg-spacing-gallery:clamp(var(--xs-s), 2.5vw, var(--xs-l));--xeg-spacing-mobile:clamp(var(--xs-xs), 2vw, var(--xs-m));--xeg-spacing-compact:clamp(.25rem, 1.5vw, var(--xs-s));--xth-o:0;--xth-v:hidden;--xth-pe:none}} @media (prefers-reduced-motion:reduce){@layer xeg.components{:root{--xtt:none}}} .xg-X9gZ{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:var(--xz-g, 10000);background:var(--xg-b);display:flex;flex-direction:column;transform:var(--xgh);will-change:opacity, transform;contain:layout style paint;opacity:1;visibility:visible;transition:var(--xten);cursor:default;pointer-events:auto;container-type:size;container-name:gallery-container;scroll-behavior:smooth;overscroll-behavior:none} .xg-meO3{position:fixed;top:0;left:0;right:0;height:auto;z-index:var(--xz-t, 2147483620);opacity:var(--toolbar-opacity, 0);visibility:var(--toolbar-visibility, hidden);display:block;transition:var(--xtt);will-change:transform, opacity, visibility;contain:layout style;transform:var(--xgh);backface-visibility:var(--xbv);pointer-events:var(--toolbar-pointer-events, none);background:transparent;border:none;border-radius:0;margin:0;padding-block-end:var(--xeg-spacing-gallery)} .xg-meO3:is(:hover,:focus-within){--toolbar-opacity:1;--toolbar-visibility:visible;--toolbar-pointer-events:auto} .xg-meO3:focus-within{transition:var(--xtef)} .xg-meO3 *{pointer-events:inherit} .xg-meO3 [data-gallery-element=\"settings-panel\"][data-expanded=\"true\"]{pointer-events:auto} .xg-meO3:has([data-gallery-element=\"settings-panel\"][data-expanded=\"true\"]){--toolbar-opacity:1;--toolbar-visibility:visible;--toolbar-pointer-events:auto} .xg-X9gZ.xg-9abg{cursor:none} .xg-X9gZ.xg-sOsS[data-xeg-gallery=\"true\"][data-xeg-role=\"gallery\"] .xg-meO3{--toolbar-opacity:var(--xth-o, 0);--toolbar-visibility:var(--xth-v, hidden);--toolbar-pointer-events:var(--xth-pe, none)} .xg-X9gZ *{pointer-events:auto} .xg-gmRW{flex:1;display:flex;flex-direction:column;overflow:auto;position:relative;z-index:0;contain:layout style;transform:var(--xgh);overscroll-behavior:contain;scrollbar-gutter:stable;pointer-events:auto;container-type:size;container-name:items-list} .xg-gmRW::-webkit-scrollbar{width:var(--xsw)} .xg-gmRW::-webkit-scrollbar-track{background:transparent} .xg-gmRW::-webkit-scrollbar-thumb{background:var(--xcn3);border-radius:var( --xsbr );transition:background-color var(--xdn) var(--xe-s)} .xg-gmRW::-webkit-scrollbar-thumb:hover{background:var(--xcn4)} .xg-X9gZ.xg-9abg .xg-meO3{pointer-events:none;opacity:0;transition:opacity var(--xdf) var(--xeo)} .xg-X9gZ.xg-9abg [data-xeg-role=\"items-list\"], .xg-X9gZ.xg-9abg .xg-gmRW{pointer-events:auto} .xg-X9gZ.xg-yhK-{justify-content:center;align-items:center} .xg-EfVa{position:relative;margin-bottom:var(--xs-m, 1rem);border-radius:var(--xr-l, .5rem);transition:var(--xten);contain:layout style;transform:var(--xgh)} .xg-LxHL{position:relative;z-index:1} .xg-sfF0{height:calc(100vh - var(--xeg-toolbar-height, 3.75rem));min-height:50vh;pointer-events:none;user-select:none;flex-shrink:0;background:transparent;opacity:0;contain:strict;content-visibility:auto} .xg-gC-m{position:fixed;top:0;left:0;right:0;height:var(--xhzh);z-index:var(--xz-th, 2147483618);background:transparent;pointer-events:auto} .xg-gC-m:hover{z-index:var(--xz-th);background:transparent} .xg-X9gZ.xg-Canm:not([data-settings-expanded=\"true\"]) .xg-gC-m, .xg-X9gZ:has(.xg-meO3:hover):not([data-settings-expanded=\"true\"]) .xg-gC-m{pointer-events:none} .xg-X9gZ.xg-Canm .xg-meO3, .xg-X9gZ:has(.xg-gC-m:hover) .xg-meO3{--toolbar-opacity:1;--toolbar-visibility:visible;--toolbar-pointer-events:auto} .xg-meO3 [class*=\"galleryToolbar\"]{opacity:var(--toolbar-opacity, 0);visibility:var(--toolbar-visibility, hidden);display:flex;pointer-events:var(--toolbar-pointer-events, none)} .xg-meO3 button, .xg-meO3 [role=\"button\"], .xg-meO3 .xg-e06X{pointer-events:auto;position:relative;z-index:10} .xg-fwsr{text-align:center;color:var(--xct-s);max-inline-size:min(25rem, 90vw);padding:clamp(1.875rem, 5vw, 2.5rem)} .xg-fwsr h3{margin:0 0 clamp(.75rem, 2vw, 1rem);font-size:clamp(1.25rem, 4vw, 1.5rem);font-weight:600;color:var(--xct-p);line-height:1.2} .xg-fwsr p{margin:0;font-size:clamp(.875rem, 2.5vw, 1rem);line-height:1.5;color:var(--xct-t)} @container gallery-container (max-width:48rem){.xg-gmRW{padding:var(--xeg-spacing-mobile);gap:var(--xeg-spacing-mobile)} .xg-meO3{padding-block-end:var(--xeg-spacing-mobile)}} @container gallery-container (max-width:30rem){.xg-gmRW{padding:var(--xeg-spacing-compact);gap:var(--xeg-spacing-compact)}} @media (prefers-reduced-motion:reduce){.xg-gmRW{scroll-behavior:auto;will-change:auto;transform:none}} @media (prefers-reduced-motion:reduce){.xg-meO3:hover, .xg-meO3:focus-within{transform:none}} .xg-X9gZ [class*=\"galleryToolbar\"]:hover{--toolbar-opacity:1;--toolbar-pointer-events:auto} .xg-huYo{position:relative;margin-bottom:var(--xs-m);margin-inline:auto;border-radius:var(--xr-l);overflow:visible;transition:var(--xti);cursor:pointer;border:.0625rem solid var(--xcb-p);background:var(--xcbg-s);padding:var(--xs-s);width:fit-content;max-width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;pointer-events:auto;transform:var(--xgh);will-change:transform;contain:layout style} .xg-huYo[data-fit-mode=\"original\"]{max-width:none;flex-shrink:0;width:max-content;align-self:center} .xg-huYo:hover{transform:var(--xhl);background:var(--xc-se);border-color:var(--xbe)} .xg-huYo:focus-visible{border-color:var(--xfic, var(--xcb-p))} .xg-huYo.xg-xm-1{border-color:var(--xbe, var(--xcb-s));transition:var(--xti)} .xg-huYo.xg-xm-1:focus-visible{border-color:var(--xfic, var(--xcb-s))} .xg-huYo.xg-luqi{border-color:var(--xfic, var(--xcb-p));transition:var(--xti)} .xg-8-c8{position:relative;background:var(--xcbg-s);width:fit-content;max-width:100%;margin:0 auto;display:flex;justify-content:center;align-items:center;contain:layout paint} .xg-huYo[data-fit-mode=\"original\"] .xg-8-c8{width:auto;max-width:none} .xg-huYo[data-media-loaded=\"false\"] .xg-8-c8{min-height:var(--xs-3);aspect-ratio:var(--xad)} .xg-lhkE{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:var(--xsk-b);min-height:var(--xs-3)} .xg-6YYD{--xsp-s:var(--xs-l);--xsp-bw:.125rem;--xsp-tc:var(--xcb-p);--xsp-ic:var(--xc-p)} .xg-FWlk, .xg-GUev{display:block;border-radius:var(--xr-m);object-fit:contain;pointer-events:auto;user-select:none;-webkit-user-drag:none;transform:var(--xgh);will-change:opacity;transition:opacity var(--xdn) var(--xeo)}:is(.xg-FWlk, .xg-GUev).xg-8Z3S{opacity:0}:is(.xg-FWlk, .xg-GUev).xg-y9iP{opacity:1} .xg-GUev{inline-size:100%;overflow:clip}:is(.xg-FWlk, .xg-GUev).xg-yYtG{inline-size:auto;block-size:auto;max-inline-size:none;max-block-size:none;object-fit:none}:is(.xg-FWlk, .xg-GUev).xg-Uc0o{inline-size:auto;block-size:auto;max-inline-size:100%;max-block-size:none;object-fit:scale-down}:is(.xg-FWlk, .xg-GUev).xg-M9Z6{inline-size:auto;block-size:auto;max-inline-size:calc(100vw - var(--xs-l) * 2);max-block-size:var(--xvhc);object-fit:scale-down}:is(.xg-FWlk, .xg-GUev).xg--Mlr{inline-size:auto;block-size:auto;max-inline-size:100%;max-block-size:var(--xvhc);object-fit:contain} .xg-Wno7{font-size:var(--xfs-2);margin-bottom:var(--xs-s)} .xg-8-wi{font-size:var(--xfs-s);text-align:center} .xg-Gswe{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--xc-e-bg);color:var(--xc-e);min-height:var(--xs-3)} .xg-huYo[data-media-loaded=\"false\"][data-fit-mode=\"original\"]{inline-size:min(var(--xgi-w, 100%), 100%);max-inline-size:min(var(--xgi-w, 100%), 100%);max-block-size:min( var(--xgi-h, var(--xs-5)), var(--xvhc) )} .xg-huYo[data-media-loaded=\"false\"][data-fit-mode=\"original\"] .xg-FWlk, .xg-huYo[data-media-loaded=\"false\"][data-fit-mode=\"original\"] .xg-GUev{inline-size:min(var(--xgi-w, 100%), 100%);max-inline-size:min(var(--xgi-w, 100%), 100%);max-block-size:min( var(--xgi-h, var(--xs-5)), var(--xvhc) )} .xg-huYo[data-media-loaded=\"false\"][data-has-intrinsic-size=\"true\"][data-fit-mode=\"fitHeight\"], .xg-huYo[data-media-loaded=\"false\"][data-has-intrinsic-size=\"true\"][data-fit-mode=\"fitContainer\"]{--xgf-ht:min( var(--xgi-h, var(--xs-5)), var(--xvhc) );max-block-size:var(--xgf-ht);inline-size:min( 100%, calc(var(--xgf-ht) * var(--xgi-r, 1)) );max-inline-size:min( 100%, calc(var(--xgf-ht) * var(--xgi-r, 1)) )} .xg-huYo[data-media-loaded=\"false\"][data-has-intrinsic-size=\"true\"]:is( [data-fit-mode=\"fitHeight\"], [data-fit-mode=\"fitContainer\"] ):is(.xg-FWlk, .xg-GUev){max-block-size:var(--xgf-ht);max-inline-size:min( 100%, calc(var(--xgf-ht) * var(--xgi-r, 1)) )} @media (prefers-reduced-motion:reduce){.xg-huYo{will-change:auto} .xg-huYo:hover{transform:none}} @layer xeg.features{:where(.xeg-surface, .xeg-glass-surface){background:var(--xsu-b);border:var(--bwt) solid var(--xsu-br);border-radius:var(--xr-2);isolation:isolate;transition:opacity var(--xdn) var(--xe-s)}:where(.xeg-surface, .xeg-glass-surface):hover{background:var(--xsu-bh, var(--xsu-b))} .xeg-gallery-renderer[data-renderer=\"gallery\"]{display:block;width:0;height:0;overflow:visible} .xeg-gallery-overlay{display:flex;align-items:center;justify-content:center;position:fixed;inset:0;z-index:var(--xz-g, 10000);background:var(--xg-b);opacity:1;transition:opacity var(--xdn) var(--xe-s);pointer-events:auto} .xeg-gallery-container{position:relative;width:100%;height:100%;max-width:100vw;max-height:100vh;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}} @layer xeg.tokens, xeg.base, xeg.utilities, xeg.components, xeg.features, xeg.overrides;@layer xeg.tokens{:where(:root, .xeg-theme-scope){--cbw:oklch(1 0 0);--cbb:oklch(0 0 0);--cg0:oklch(.97 .002 206.2);--cg1:oklch(.943 .006 206.2);--cg2:oklch(.896 .006 206.2);--cg3:oklch(.796 .006 206.2);--cg4:oklch(.696 .006 286.3);--cg5:oklch(.598 .006 286.3);--cg6:oklch(.488 .006 286.3);--cg7:oklch(.378 .005 286.3);--cg8:oklch( .306 .005 282 );--cg9:oklch(.234 .006 277.8);--spx:.25rem;--sps:.5rem;--spm:1rem;--spl:1.5rem;--rs:.25em;--rm:.375em;--rl:.5em;--r2:1em;--rf:50%;--ffp:\"TwitterChirp\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;--fsx:.75rem;--fss:.875rem;--fsb:.9375rem;--fsm:1rem;--fs2:1.5rem;--fwm:500;--fws:600;--fwb:700;--df:150ms;--dn:250ms;--bwt:.0625rem;--line-height-snug:1.375;--lhn:1.5}} @layer xeg.tokens{:where(:root, .xeg-theme-scope){--cbp:var(--cbw);--cbs:var(--cg0);--cbu:var(--cbw);--cbe:var(--cbw);--xbgt:var(--cbu);--xt-b:var(--xcb-p);--xt-s:var(--xbgt);--xtp-s:var(--xt-s);--xcbg-s:var(--cbs);--xg-bl:var(--cbp);--xg-bd:var(--cg9);--xg-b:var(--xg-bl);--xad:4 / 3;--ctp:var(--cbb);--cts:var( --cg6 );--cbd:var(--cg2);--cbe2:var(--cg5);--xcb-p:var(--cbd);--xcb-h:var(--cg3);--xcb-s:var(--cbe2);--xtt-c:var(--xct-p);--xtt-m:var(--xct-s);--xte-b:color-mix( in oklch, var(--xbgt) 80%, var(--cbw) 20% );--xte-bs:color-mix( in oklch, var(--xbgt) 65%, var(--cbw) 35% );--xte-br:color-mix( in oklch, var(--xt-b) 85%, var(--cbw) 15% );--xtp-pt:color-mix( in oklch, var(--xte-b) 60%, var(--xte-br) 40% );--xts-t:color-mix( in oklch, var(--xte-b) 50%, var(--cbw) 50% );--xts-th:color-mix( in oklch, var(--xte-br) 80%, var(--cbw) 20% );--xc-e:var(--cg8);--xc-e-bg:var(--cg1);--xc-p:var(--cg9);--xc-ph:var(--cg7);--xc-p-active:var(--cg8);--xcn1:var(--cg1);--xcn2:var(--cg2);--xcn3:var(--cg3);--xcn4:var(--cg4);--xcn5:var(--cg5);--xct-p:var(--ctp);--xct-s:var(--cts);--xct-t:var(--cg5);--xcbg-p:var(--cbp);--xsb-m:2.5em;--xfic:var(--xcb-p);--xfs-s:var(--fss);--xfs-b:var(--fsb);--xfs-m:var(--fsm);--xfs-2:var(--fs2);--xfw-m:var(--fwm);--xfw-s:var(--fws);--xeg-line-height-snug:var(--line-height-snug);--xdf:var(--df);--xdn:var(--dn);--xdt:var(--dn);--xsu-b:var(--cbu);--xsu-br:var(--cbd);--xsu-bh:var(--cbs);--xc-se:var(--cbe);--xsk-b:var(--cbs);--xbe:var(--cbe2);--xz-g:2147483600;--xz-th:2147483618;--xz-t:2147483620;--xz-tp:2147483622;--xz-ta:2147483624;--xe-s:cubic-bezier(.4, 0, .2, 1);--xe-d:cubic-bezier(0, 0, .2, 1);--xe-a:cubic-bezier(.4, 0, 1, 1);--xeo:cubic-bezier(.4, 0, .2, 1);--xel:linear;--xlh:var(--lhn, 1.5);--xb-l:-.0625rem;--xhl:translateY(-.125rem);--xr-s:var(--rs);--xr-m:var(--rm);--xr-l:var(--rl);--xr-2:var(--r2);--xr-f:var(--rf);--xeg-scrollbar-thumb-color:var(--cg4);--xeg-scrollbar-thumb-hover-color:var(--cg5)}:where(:root, .xeg-theme-scope)[data-theme=\"light\"]{--cbp:var(--cbw);--ctp:var(--cbb);--cts:var(--cg6);--xg-b:var(--xg-bl)}:where(:root, .xeg-theme-scope)[data-theme=\"dark\"]{--cbp:var(--cg9);--cbu:var(--cg9);--cbe:var(--cg7);--ctp:var(--cbw);--cts:var(--cg4);--xbgt:var(--cg8);--xcb-p:var(--cg6);--xt-b:var(--cg6);--xcbg-s:var(--cg8);--xg-b:var(--xg-bd);--xtt-c:var(--ctp);--xtt-m:var(--cg3);--xte-b:color-mix( in oklch, var(--xbgt) 85%, var(--cbb) 15% );--xte-bs:color-mix( in oklch, var(--xbgt) 70%, var(--cbb) 30% );--xte-br:color-mix( in oklch, var(--xt-b) 75%, var(--cbb) 25% );--xtp-pt:color-mix( in oklch, var(--xt-b) 65%, var(--xbgt) 35% );--xts-t:color-mix( in oklch, var(--xte-b) 80%, var(--cbb) 20% );--xts-th:color-mix( in oklch, var(--xte-br) 85%, var(--cbb) 15% );--xc-p:var(--cg1);--xc-ph:var(--cg2);--xc-p-active:var(--cg3);--xsu-b:var(--cg9);--xsu-br:var(--cg6);--xsu-bh:var(--cg8)} @media (prefers-reduced-motion:reduce){:where(:root, .xeg-theme-scope){--xdf:0ms;--xts:none;--xten:none;--xtef:none;--xti:none;--xtwn:none}}:where(:root, .xeg-theme-scope){--xse-g:var(--spm);--xse-p:var(--spm);--xse-cg:var(--sps);--xse-lf:var(--fss);--xse-lw:var( --fwb );--xse-sp:var(--sps) var(--spm)}} @layer xeg.tokens{:where(:root, .xeg-theme-scope){--xtp-t:height var(--xdn) var(--xe-s), opacity var(--xdf) var(--xe-s);--xtp-h:0;--xtp-mh:17.5rem;--xsw:.5rem;--xhzh:7.5rem;--xsp-sd:1rem;--xsp-bw:.125rem;--xsp-tc:color-mix(in oklch, var(--xcn4) 60%, transparent);--xsp-ic:var(--xc-p, currentColor);--xsp-d:var(--xdn);--xsp-e:var(--xel);--xts:background-color var(--xdf) var(--xe-s), border-color var(--xdf) var(--xe-s), color var(--xdf) var(--xe-s);--xten:transform var(--xdn) var(--xe-s), opacity var(--xdn) var(--xe-s);--xtef:transform var(--xdf) var(--xe-s), opacity var(--xdf) var(--xe-s);--xti:background-color var(--xdf) var(--xeo), border-color var(--xdf) var(--xeo), color var(--xdf) var(--xeo), transform var(--xdf) var(--xeo);--xtwn:width var(--xdn) var(--xe-s);--xs-xs:var(--spx);--xs-s:var(--sps);--xs-m:var(--spm);--xs-l:var(--spl);--xvhc:90vh} @media (prefers-reduced-transparency:reduce){:where(:root, .xeg-theme-scope){--xsu-b:var(--xcbg-p)}}} @layer xeg.components{.xeg-surface{background:var(--xsu-b);border:.0625rem solid var(--xsu-br);border-radius:var(--xr-l)} .xeg-spinner{display:inline-block;width:var(--xsp-s, var(--xsp-sd));height:var(--xsp-s, var(--xsp-sd));border-radius:var(--xr-f);border:var(--xsp-bw) solid var(--xsp-tc);border-top-color:var(--xsp-ic);animation:xeg-spin var(--xsp-d) var(--xsp-e) infinite;box-sizing:border-box} @media (prefers-reduced-motion:reduce){.xeg-spinner{animation:none}}} @layer xeg.components{@keyframes xeg-fade-in{from{opacity:0} to{opacity:1}} @keyframes xeg-fade-out{from{opacity:1} to{opacity:0}} @keyframes xeg-spin{from{transform:rotate(0deg)} to{transform:rotate(360deg)}}} @layer xeg.tokens{:root{--xe-d:cubic-bezier(0, 0, .2, 1);--xe-a:cubic-bezier(.4, 0, 1, 1);--xe-s:cubic-bezier(.4, 0, .2, 1);--xe-e:var(--xe-d);--xgh:translate3d(0, 0, 0);--xbv:hidden}} @layer xeg.base{:where(.xeg-gallery-root, .xeg-gallery-root *),:where(.xeg-gallery-root *::before, .xeg-gallery-root *::after){box-sizing:border-box;margin:0;padding:0} .xeg-gallery-root button{border:none;background:none;cursor:pointer;font:inherit;color:inherit} .xeg-gallery-root a{color:inherit;text-decoration:none} .xeg-gallery-root img{max-width:100%;height:auto;display:block} .xeg-gallery-root ul, .xeg-gallery-root ol{list-style:none} .xeg-gallery-root input, .xeg-gallery-root textarea, .xeg-gallery-root select{font:inherit;color:inherit;background:transparent} .xeg-gallery-root::-webkit-scrollbar{width:var(--xsw, .5rem);height:var(--xsw, .5rem)} .xeg-gallery-root::-webkit-scrollbar-track{background:transparent} .xeg-gallery-root::-webkit-scrollbar-thumb{background:var(--xeg-scrollbar-thumb-color);border-radius:var(--xr-s, .25em)} .xeg-gallery-root::-webkit-scrollbar-thumb:hover{background:var(--xeg-scrollbar-thumb-hover-color)}} @layer xeg.utilities{.xeg-row-center{display:flex;align-items:center} .xeg-inline-center{display:inline-flex;align-items:center;justify-content:center} .xeg-gap-sm{gap:var(--xs-s)}} @layer xeg.utilities{.xeg-fade-in{animation:xeg-fade-in var(--xdn) var(--xe-e);animation-fill-mode:both} .xeg-fade-out{animation:xeg-fade-out var(--xdf) var(--xe-a);animation-fill-mode:both} @media (prefers-reduced-motion:reduce){.xeg-fade-in, .xeg-fade-out{animation:none}}} @layer xeg.features{.xeg-gallery-root{all:unset;box-sizing:border-box;scroll-behavior:smooth;font-family:var(--ffp);font-size:var(--fsb, .9375rem);line-height:var(--xlh, 1.5);color:var(--xct-p, currentColor);position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:var(--xz-g, 10000);isolation:isolate;contain:style paint;background:var(--xg-b, var(--xcbg-p, Canvas));pointer-events:auto;user-select:none;overscroll-behavior:contain;transform:translateZ(0);will-change:opacity, transform;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}}";var s=document.getElementById('xeg-injected-styles');if(!s){s=document.createElement('style');s.id='xeg-injected-styles';(document.head||document.documentElement).appendChild(s);}s.textContent=css;})();
(function () {
'use strict';
const SERVICE_KEYS = {
LANGUAGE: "core.language",
GALLERY_DOWNLOAD: "gallery.download",
GALLERY_RENDERER: "gallery.renderer",
MEDIA_FILENAME: "media.filename",
MEDIA_SERVICE: "media.service",
SETTINGS: "settings.manager",
THEME: "ui.theme"
};
const noop = () => {
};
const NOOP_LOGGER = {
info: noop,
warn: noop,
error: noop,
debug: noop,
trace: noop
};
const logger = NOOP_LOGGER;
function isBaseLanguageCode(value) {
return value === "en" || value === "ko" || value === "ja";
}
function buildLanguageStringsFromValues(values) {
let i = 0;
const next = () => values[i++];
const built = {
tb: {
prev: next(),
next: next(),
dl: next(),
dlAllCt: next(),
setOpen: next(),
cls: next(),
twTxt: next(),
twPanel: next(),
twUrl: next(),
fitOri: next(),
fitW: next(),
fitH: next(),
fitC: next()
},
st: {
th: next(),
lang: next(),
thAuto: next(),
thLt: next(),
thDk: next(),
langAuto: next(),
langKo: next(),
langEn: next(),
langJa: next()
},
msg: {
err: {
t: next(),
b: next()
},
kb: {
t: next(),
prev: next(),
next: next(),
cls: next(),
toggle: next()
},
dl: {
one: {
err: {
t: next(),
b: next()
}
},
allFail: {
t: next(),
b: next()
},
part: {
t: next(),
b: next()
}
},
gal: {
emptyT: next(),
emptyD: next(),
itemLbl: next(),
loadFail: next()
}
}
};
return Object.freeze(built);
}
const EN_VALUES = [
"Previous",
"Next",
"Download",
"Download all {count} files as ZIP",
"Open Settings",
"Close",
"View tweet",
"Tweet text panel",
"View original tweet",
"Original",
"Fit Width",
"Fit Height",
"Fit Window",
"Theme",
"Language",
"Auto",
"Light",
"Dark",
"Auto / 자동 / 自動",
"Korean",
"English",
"Japanese",
"An error occurred",
"An unexpected error occurred: {error}",
"Keyboard shortcuts",
"ArrowLeft: Previous media",
"ArrowRight: Next media",
"Escape: Close gallery",
"?: Show this help",
"Download Failed",
"Could not download the file: {error}",
"Download Failed",
"Failed to download all items.",
"Partial Failure",
"Failed to download {count} items.",
"No media available",
"There are no images or videos to display.",
"Media {index}: {filename}",
"Failed to load {type}"
];
const en = buildLanguageStringsFromValues(EN_VALUES);
const JA_VALUES = [
"前へ",
"次へ",
"ダウンロード",
"すべての{count}件をZIPでダウンロード",
"設定を開く",
"閉じる",
"ツイートを見る",
"ツイートテキストパネル",
"元のツイートを見る",
"原寸",
"幅に合わせる",
"高さに合わせる",
"ウィンドウに合わせる",
"テーマ",
"Language / 언어 / 言語",
"自動",
"ライト",
"ダーク",
"Auto / 자동 / 自動",
"韓国語",
"英語",
"日本語",
"エラーが発生しました",
"予期しないエラーが発生しました: {error}",
"キーボードショートカット",
"ArrowLeft: 前のメディア",
"ArrowRight: 次のメディア",
"Escape: ギャラリーを閉じる",
"?: このヘルプを表示",
"ダウンロード失敗",
"ファイルを取得できません: {error}",
"ダウンロード失敗",
"すべての項目をダウンロードできませんでした。",
"一部失敗",
"{count}個の項目を取得できませんでした。",
"メディアがありません",
"表示する画像や動画がありません。",
"メディア {index}: {filename}",
"{type} の読み込みに失敗しました"
];
const ja = buildLanguageStringsFromValues(JA_VALUES);
const KO_VALUES = [
"이전",
"다음",
"다운로드",
"모든 {count}개 파일을 ZIP으로 다운로드",
"설정 열기",
"닫기",
"트윗 보기",
"트윗 텍스트 패널",
"원본 트윗 보기",
"원본",
"너비 맞춤",
"높이 맞춤",
"창 맞춤",
"테마",
"Language / 언어 / 言語",
"자동",
"라이트",
"다크",
"Auto / 자동 / 自動",
"한국어",
"영어",
"일본어",
"오류가 발생했습니다",
"예상치 못한 오류가 발생했습니다: {error}",
"키보드 단축키",
"ArrowLeft: 이전 미디어",
"ArrowRight: 다음 미디어",
"Escape: 갤러리 닫기",
"?: 이 도움말 표시",
"다운로드 실패",
"파일을 가져올 수 없습니다: {error}",
"다운로드 실패",
"모든 항목을 다운로드할 수 없었습니다.",
"일부 실패",
"{count}개 항목을 가져올 수 없었습니다.",
"미디어 없음",
"표시할 이미지 또는 동영상이 없습니다.",
"미디어 {index}: {filename}",
"{type} 로드 실패"
];
const ko = buildLanguageStringsFromValues(KO_VALUES);
const TRANSLATION_REGISTRY = {
en,
ko,
ja
};
const DEFAULT_LANGUAGE = "en";
function getLanguageStrings(language) {
const strings = TRANSLATION_REGISTRY[language];
if (strings) {
return strings;
}
return TRANSLATION_REGISTRY[DEFAULT_LANGUAGE];
}
function resolveTranslationValue(dictionary, key) {
const segments = key.split(".");
let current = dictionary;
for (const segment of segments) {
if (!current || typeof current !== "object") {
return void 0;
}
current = current[segment];
}
return typeof current === "string" ? current : void 0;
}
function createLifecycle(serviceName, options = {}) {
const { onInitialize, onDestroy} = options;
let initialized = false;
const shouldLog = false;
const initialize = async () => {
if (initialized) return;
try {
if (onInitialize) {
await onInitialize();
}
initialized = true;
if (shouldLog) ;
} catch (error) {
throw error;
}
};
const destroy = () => {
if (!initialized) return;
try {
if (onDestroy) {
onDestroy();
}
if (shouldLog) ;
} catch (error) {
} finally {
initialized = false;
}
};
const isInitialized = () => initialized;
return {
initialize,
destroy,
isInitialized,
serviceName
};
}
function createNetworkErrorResponse(details) {
return {
finalUrl: details.url,
readyState: 4,
status: 0,
statusText: "Network Error",
responseHeaders: "",
response: void 0,
responseXML: null,
responseText: "",
context: details.context
};
}
function scheduleUserscriptRequestFailureCallbacks(details, response) {
Promise.resolve().then(() => {
try {
details.onerror?.(response);
details.onloadend?.(response);
} catch {
}
});
}
function resolveGMAPIs() {
const global = globalThis;
const download = typeof GM_download !== "undefined" ? GM_download : global.GM_download;
const setValue = typeof GM_setValue !== "undefined" ? GM_setValue : global.GM_setValue;
const getValue = typeof GM_getValue !== "undefined" ? GM_getValue : global.GM_getValue;
const deleteValue = typeof GM_deleteValue !== "undefined" ? GM_deleteValue : global.GM_deleteValue;
const listValues = typeof GM_listValues !== "undefined" ? GM_listValues : global.GM_listValues;
const xmlHttpRequest = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : global.GM_xmlhttpRequest;
const notification = typeof GM_notification !== "undefined" ? GM_notification : global.GM_notification;
const cookieCandidate = typeof GM_cookie !== "undefined" ? GM_cookie : global.GM_cookie;
const cookie = cookieCandidate && typeof cookieCandidate.list === "function" ? cookieCandidate : void 0;
return {
download,
setValue,
getValue,
deleteValue,
listValues,
xmlHttpRequest,
cookie,
notification
};
}
let cachedGMAPIs = null;
function getResolvedGMAPIsCached() {
if (cachedGMAPIs) return cachedGMAPIs;
cachedGMAPIs = resolveGMAPIs();
return cachedGMAPIs;
}
function asFunction(value) {
return typeof value === "function" ? value : void 0;
}
function resolveGMDownload() {
return getResolvedGMAPIsCached().download;
}
function createStrictUserscriptAPI() {
const resolved = getResolvedGMAPIsCached();
const gmDownload = asFunction(resolved.download);
const gmSetValue = asFunction(resolved.setValue);
const gmGetValue = asFunction(resolved.getValue);
const gmDeleteValue = asFunction(
resolved.deleteValue
);
const gmListValues = asFunction(resolved.listValues);
const gmXmlHttpRequest = asFunction(
resolved.xmlHttpRequest
);
const gmNotification = asFunction(
resolved.notification
);
return {
async download(url, filename) {
if (!gmDownload) throw new Error("GM_download unavailable");
gmDownload(url, filename);
},
async setValue(key, value) {
if (!gmSetValue) throw new Error("GM_setValue unavailable");
await Promise.resolve(gmSetValue(key, value));
},
async getValue(key, defaultValue) {
if (!gmGetValue) throw new Error("GM_getValue unavailable");
const value = await Promise.resolve(gmGetValue(key, defaultValue));
return value;
},
getValueSync(key, defaultValue) {
if (!gmGetValue) return defaultValue;
const value = gmGetValue(key, defaultValue);
return value instanceof Promise ? defaultValue : value;
},
async deleteValue(key) {
if (!gmDeleteValue) throw new Error("GM_deleteValue unavailable");
await Promise.resolve(gmDeleteValue(key));
},
async listValues() {
if (!gmListValues) throw new Error("GM_listValues unavailable");
const values = await Promise.resolve(gmListValues());
return Array.isArray(values) ? values : [];
},
xmlHttpRequest(details) {
if (!gmXmlHttpRequest) throw new Error("GM_xmlhttpRequest unavailable");
return gmXmlHttpRequest(details);
},
notification(details) {
if (!gmNotification) return;
gmNotification(details, void 0);
},
cookie: resolved.cookie
};
}
function safeCall(fn) {
if (!fn) return Promise.resolve(void 0);
try {
return Promise.resolve(fn()).catch(() => void 0);
} catch {
return Promise.resolve(void 0);
}
}
function createSafeUserscriptAPI() {
const resolved = getResolvedGMAPIsCached();
const gmDownload = asFunction(resolved.download);
const gmSetValue = asFunction(resolved.setValue);
const gmGetValue = asFunction(resolved.getValue);
const gmDeleteValue = asFunction(
resolved.deleteValue
);
const gmListValues = asFunction(resolved.listValues);
const gmXmlHttpRequest = asFunction(
resolved.xmlHttpRequest
);
const gmNotification = asFunction(
resolved.notification
);
return {
async download(url, filename) {
await safeCall(gmDownload ? () => gmDownload(url, filename) : null);
},
async setValue(key, value) {
await safeCall(gmSetValue ? () => gmSetValue(key, value) : null);
},
async getValue(key, defaultValue) {
if (!gmGetValue) return defaultValue;
try {
const value = await Promise.resolve(gmGetValue(key, defaultValue));
return value;
} catch {
return defaultValue;
}
},
getValueSync(key, defaultValue) {
if (!gmGetValue) return defaultValue;
try {
const value = gmGetValue(key, defaultValue);
return value instanceof Promise ? defaultValue : value;
} catch {
return defaultValue;
}
},
async deleteValue(key) {
await safeCall(gmDeleteValue ? () => gmDeleteValue(key) : null);
},
async listValues() {
if (!gmListValues) return [];
try {
const values = await Promise.resolve(gmListValues());
return Array.isArray(values) ? values : [];
} catch {
return [];
}
},
xmlHttpRequest(details) {
if (gmXmlHttpRequest) {
try {
return gmXmlHttpRequest(details);
} catch {
}
}
const response = createNetworkErrorResponse(details);
scheduleUserscriptRequestFailureCallbacks(details, response);
return { abort() {
} };
},
notification(details) {
void safeCall(gmNotification ? () => gmNotification(details, void 0) : null);
},
cookie: resolved.cookie
};
}
function getUserscript() {
return createStrictUserscriptAPI();
}
function getUserscriptSafe() {
return createSafeUserscriptAPI();
}
const GM_API_CHECKS = {
getValue: (gm) => typeof gm.getValue === "function",
setValue: (gm) => typeof gm.setValue === "function",
download: (gm) => typeof gm.download === "function",
notification: (gm) => typeof gm.notification === "function",
deleteValue: (gm) => typeof gm.deleteValue === "function",
listValues: (gm) => typeof gm.listValues === "function",
cookie: (gm) => typeof gm.cookie?.list === "function"
};
function isGMAPIAvailable(apiName) {
const checker = GM_API_CHECKS[apiName];
try {
return checker(getResolvedGMAPIsCached());
} catch {
return false;
}
}
function createSingleton(factory) {
let hasInstance = false;
let instance;
const get = () => {
if (!hasInstance) {
instance = factory();
hasInstance = true;
}
return instance;
};
{
return { get };
}
}
class PersistentStorage {
get userscript() {
return getUserscriptSafe();
}
static singleton = createSingleton(() => new PersistentStorage());
constructor() {
}
static getInstance() {
return PersistentStorage.singleton.get();
}
parseMaybeJsonString(rawValue) {
try {
const parsed = JSON.parse(rawValue);
return typeof parsed === "string" ? parsed : void 0;
} catch {
return void 0;
}
}
serializeValueForStorage(value) {
if (typeof value === "string") {
return value;
}
return JSON.stringify(value);
}
async setString(key, value) {
return this.set(key, value);
}
async setJson(key, value) {
if (value === void 0) {
await this.userscript.deleteValue(key);
return;
}
const serialized = JSON.stringify(value);
if (serialized === void 0) {
await this.userscript.deleteValue(key);
return;
}
await this.userscript.setValue(key, serialized);
}
async set(key, value) {
if (value === void 0) {
await this.userscript.deleteValue(key);
return;
}
const serialized = this.serializeValueForStorage(value);
if (serialized === void 0) {
await this.userscript.deleteValue(key);
return;
}
await this.userscript.setValue(key, serialized);
}
async getString(key, defaultValue) {
const value = await this.userscript.getValue(key);
if (value === void 0 || value === null) return defaultValue;
const parsedString = this.parseMaybeJsonString(value);
if (parsedString !== void 0) return parsedString;
return value;
}
async trySelfHealOnParseError(key) {
try {
await this.userscript.deleteValue(key);
} catch {
}
}
async get(key, defaultValue, options = {}) {
const value = await this.userscript.getValue(key);
if (value === void 0 || value === null) return defaultValue;
try {
return JSON.parse(value);
} catch {
if (options.selfHealOnParseError === true) {
await this.trySelfHealOnParseError(key);
}
return defaultValue;
}
}
async getJson(key, defaultValue, options = {}) {
return this.get(key, defaultValue, options);
}
async has(key) {
const value = await this.userscript.getValue(key);
return value !== void 0 && value !== null;
}
getSync(key, defaultValue) {
try {
const value = this.userscript.getValueSync(key);
if (value === void 0 || value === null) return defaultValue;
try {
return JSON.parse(value);
} catch {
return defaultValue;
}
} catch {
return defaultValue;
}
}
getJsonSync(key, defaultValue) {
return this.getSync(key, defaultValue);
}
getStringSync(key, defaultValue) {
try {
const value = this.userscript.getValueSync(key);
if (value === void 0 || value === null) return defaultValue;
try {
const parsedString = this.parseMaybeJsonString(value);
if (parsedString !== void 0) return parsedString;
} catch {
}
return value;
} catch {
return defaultValue;
}
}
async remove(key) {
await this.userscript.deleteValue(key);
}
}
function getPersistentStorage() {
return PersistentStorage.getInstance();
}
class LanguageService {
lifecycle;
static STORAGE_KEY = "xeg-language";
currentLanguage = "auto";
listeners =  new Set();
storage = getPersistentStorage();
static singleton = createSingleton(() => new LanguageService());
static getInstance() {
return LanguageService.singleton.get();
}
constructor() {
this.lifecycle = createLifecycle("LanguageService", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
}
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
try {
const saved = await this.storage.getString(LanguageService.STORAGE_KEY);
const normalized = this.normalizeLanguage(saved);
if (normalized !== this.currentLanguage) {
this.currentLanguage = normalized;
this.notifyListeners(normalized);
}
} catch (error) {
}
}
onDestroy() {
this.listeners.clear();
}
detectLanguage() {
const browserLang = typeof navigator !== "undefined" && navigator.language ? navigator.language.slice(0, 2) : DEFAULT_LANGUAGE;
if (isBaseLanguageCode(browserLang)) {
return browserLang;
}
return DEFAULT_LANGUAGE;
}
getCurrentLanguage() {
return this.currentLanguage;
}
setLanguage(language) {
const normalized = this.normalizeLanguage(language);
if (this.currentLanguage === normalized) {
return;
}
this.currentLanguage = normalized;
this.notifyListeners(normalized);
this.persistLanguage(normalized).catch((error) => {
});
}
translate(key, params) {
const language = this.getEffectiveLanguage();
const dictionary = getLanguageStrings(language);
const template = resolveTranslationValue(dictionary, key);
if (!template) {
return key;
}
if (!params) {
return template;
}
return template.replace(/\{(\w+)\}/g, (_, placeholder) => {
if (Object.hasOwn(params, placeholder)) {
return String(params[placeholder]);
}
return `{${placeholder}}`;
});
}
onLanguageChange(callback) {
this.listeners.add(callback);
return () => this.listeners.delete(callback);
}
normalizeLanguage(language) {
if (!language) {
return "auto";
}
if (language === "auto") {
return "auto";
}
if (isBaseLanguageCode(language)) {
return language;
}
return DEFAULT_LANGUAGE;
}
notifyListeners(language) {
this.listeners.forEach((listener) => {
try {
listener(language);
} catch (error) {
}
});
}
async persistLanguage(language) {
try {
await this.storage.setString(LanguageService.STORAGE_KEY, language);
} catch (error) {
}
}
getEffectiveLanguage() {
return this.currentLanguage === "auto" ? this.detectLanguage() : this.currentLanguage;
}
}
function formatErrorMessage(error, mode) {
if (error instanceof Error) {
return mode === "normalized" ? error.message || error.name || "Error" : error.message;
}
if (typeof error === "string") return error;
if (error == null) return mode === "normalized" ? String(error) : "";
if (typeof error === "object") {
const record = error;
const message = record.message;
if (typeof message === "string") return message;
if (mode === "raw") {
return "message" in record ? String(message ?? "") : String(record);
}
try {
return JSON.stringify(record);
} catch {
return String(record);
}
}
return String(error);
}
function normalizeErrorMessage(error) {
return formatErrorMessage(error, "normalized");
}
function getErrorMessage(error) {
return formatErrorMessage(error, "raw");
}
const USER_CANCELLED_MESSAGE = "Download cancelled by user";
const DEFAULT_ABORT_MESSAGE = "This operation was aborted";
function isAbortError(value) {
if (value instanceof DOMException) {
return value.name === "AbortError" || value.name === "TimeoutError";
}
if (value instanceof Error) {
return value.name === "AbortError" || value.name === "TimeoutError" || value.message.toLowerCase().includes("aborted");
}
return false;
}
function isTimeoutError(value) {
if (value instanceof DOMException) {
return value.name === "TimeoutError";
}
if (value instanceof Error) {
return value.name === "TimeoutError";
}
return false;
}
function attachCause(target, cause) {
if (cause === void 0) {
return;
}
try {
target.cause = cause;
} catch {
}
}
function createAbortError(message, cause) {
try {
const error = new DOMException(message, "AbortError");
attachCause(error, cause);
return error;
} catch {
const error = new Error(message);
error.name = "AbortError";
attachCause(error, cause);
return error;
}
}
function createUserCancelledAbortError(cause) {
const error = new Error(USER_CANCELLED_MESSAGE);
error.name = "AbortError";
attachCause(error, cause);
return error;
}
function isUserCancelledAbortError(error) {
if (error instanceof DOMException) {
return error.name === "AbortError" && error.message === USER_CANCELLED_MESSAGE;
}
if (error instanceof Error) {
return error.name === "AbortError" && error.message === USER_CANCELLED_MESSAGE;
}
return false;
}
function getUserCancelledAbortErrorFromSignal(signal) {
const reason = signal?.reason;
if (isTimeoutError(reason)) {
return reason;
}
if (isUserCancelledAbortError(reason)) {
return reason;
}
return createUserCancelledAbortError(reason);
}
function getAbortReasonOrAbortErrorFromSignal(signal) {
const reason = signal?.reason;
if (reason instanceof DOMException) {
return reason;
}
if (reason instanceof Error) {
return reason;
}
return createAbortError(DEFAULT_ABORT_MESSAGE, reason);
}
function promisifyCallback(executor, options) {
return new Promise((resolve, reject) => {
try {
executor((result, error) => {
if (error) {
if (options?.fallback) {
resolve(Promise.resolve(options.fallback()));
} else {
reject(new Error(String(error)));
}
return;
}
resolve(result);
});
} catch (error) {
if (options?.fallback) {
resolve(Promise.resolve(options.fallback()));
} else {
reject(error instanceof Error ? error : new Error(String(error)));
}
}
});
}
function createDeferred() {
let resolve;
let reject;
const promise = new Promise((res, rej) => {
resolve = res;
reject = rej;
});
return { promise, resolve, reject };
}
class HttpRequestService {
static singleton = createSingleton(() => new HttpRequestService());
defaultTimeout = 1e4;
constructor() {
}
async request(method, url, options) {
const deferred = createDeferred();
let abortListener = null;
const cleanupAbortListener = () => {
if (abortListener && options?.signal) {
options.signal.removeEventListener("abort", abortListener);
abortListener = null;
}
};
let settled = false;
const safeResolve = (value) => {
if (settled) return;
settled = true;
try {
cleanupAbortListener();
} catch {
}
deferred.resolve(value);
};
const safeReject = (reason) => {
if (settled) return;
settled = true;
try {
cleanupAbortListener();
} catch {
}
deferred.reject(reason);
};
try {
const userscript = getUserscript();
if (options?.signal?.aborted) {
safeReject(getAbortReasonOrAbortErrorFromSignal(options.signal));
return deferred.promise;
}
const headers = options?.headers;
const details = {
method,
url,
...headers ? { headers } : {},
timeout: options?.timeout ?? this.defaultTimeout,
onload: (response) => {
safeResolve({
ok: response.status >= 200 && response.status < 300,
status: response.status,
data: response.response
});
},
onerror: (response) => {
const status = response.status ?? 0;
const errorMessage = status === 0 ? "NET" : `HTTP:${status}`;
const error = new Error(errorMessage);
error.status = status;
safeReject(error);
},
ontimeout: () => {
const error = new Error("TIMEOUT");
error.status = 0;
safeReject(error);
},
onabort: () => {
safeReject(getAbortReasonOrAbortErrorFromSignal(options?.signal));
}
};
if (options?.responseType) {
details.responseType = options.responseType;
}
const data = options?.data;
if (data !== void 0) {
details.data = data;
}
const control = userscript.xmlHttpRequest(details);
if (options?.signal) {
abortListener = () => {
control.abort();
};
options.signal.addEventListener("abort", abortListener, { once: true });
if (options.signal.aborted) {
abortListener();
}
}
} catch (error) {
safeReject(error);
}
return deferred.promise;
}
static getInstance() {
return HttpRequestService.singleton.get();
}
async get(url, options) {
return this.request("GET", url, options);
}
async post(url, data, options) {
const nextOptions = data === void 0 ? options : { ...options, data };
return this.request("POST", url, nextOptions);
}
async put(url, data, options) {
const nextOptions = data === void 0 ? options : { ...options, data };
return this.request("PUT", url, nextOptions);
}
async delete(url, options) {
return this.request("DELETE", url, options);
}
async patch(url, data, options) {
const nextOptions = data === void 0 ? options : { ...options, data };
return this.request("PATCH", url, nextOptions);
}
}
class TimerManager {
timers =  new Set();
setTimeout(callback, delay) {
let id;
id = window.setTimeout(() => {
try {
callback();
} finally {
this.timers.delete(id);
}
}, delay);
this.timers.add(id);
return id;
}
clearTimeout(id) {
if (this.timers.has(id)) {
window.clearTimeout(id);
this.timers.delete(id);
}
}
cleanup() {
this.timers.forEach((id) => window.clearTimeout(id));
this.timers.clear();
}
getActiveTimersCount() {
return this.timers.size;
}
}
const globalTimerManager = new TimerManager();
const getIdleAPIs = () => {
const source = typeof globalThis !== "undefined" ? globalThis : void 0;
const ric = source && typeof source === "object" && "requestIdleCallback" in source ? source.requestIdleCallback || null : null;
const cic = source && typeof source === "object" && "cancelIdleCallback" in source ? source.cancelIdleCallback || null : null;
return { ric, cic };
};
function scheduleIdle(task) {
const { ric, cic } = getIdleAPIs();
if (ric) {
const id = ric(() => {
try {
task();
} catch (error) {
}
});
return {
cancel: () => {
cic?.(id);
}
};
}
const timerId = globalTimerManager.setTimeout(() => {
try {
task();
} catch (error) {
}
}, 0);
return {
cancel: () => {
globalTimerManager.clearTimeout(timerId);
}
};
}
class PrefetchManager {
cache =  new Map();
activeRequests =  new Map();
maxEntries;
constructor(maxEntries = 20) {
this.maxEntries = maxEntries;
}
async prefetch(media, schedule = "idle") {
if (schedule === "immediate") {
await this.prefetchSingle(media.url);
return;
}
scheduleIdle(() => {
void this.prefetchSingle(media.url).catch(() => {
});
});
}
get(url) {
return this.cache.get(url) ?? null;
}
cancelAll() {
for (const controller of this.activeRequests.values()) {
controller.abort();
}
this.activeRequests.clear();
}
clear() {
this.cache.clear();
}
destroy() {
this.cancelAll();
this.clear();
}
async prefetchSingle(url) {
if (this.cache.has(url)) return;
const controller = new AbortController();
this.activeRequests.set(url, controller);
const fetchPromise = HttpRequestService.getInstance().get(url, {
signal: controller.signal,
responseType: "blob"
}).then((response) => {
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return response.data;
}).finally(() => {
this.activeRequests.delete(url);
});
if (this.cache.size >= this.maxEntries) {
this.evictOldest();
}
this.cache.set(url, fetchPromise);
try {
await fetchPromise;
} catch (error) {
if (this.cache.get(url) === fetchPromise) {
this.cache.delete(url);
}
}
}
evictOldest() {
const first = this.cache.keys().next();
if (!first.done) {
const url = first.value;
const controller = this.activeRequests.get(url);
if (controller) {
controller.abort();
this.activeRequests.delete(url);
}
this.cache.delete(url);
}
}
}
const CLASSES = {
OVERLAY: "xeg-gallery-overlay",
CONTAINER: "xeg-gallery-container",
ROOT: "xeg-gallery-root",
RENDERER: "xeg-gallery-renderer",
VERTICAL_VIEW: "xeg-vertical-gallery",
ITEM: "xeg-gallery-item"
};
const DATA_ATTRIBUTES = {
GALLERY: "data-xeg-gallery",
CONTAINER: "data-xeg-gallery-container",
ELEMENT: "data-gallery-element",
ROLE: "data-xeg-role",
ROLE_COMPAT: "data-xeg-role-compat",
GALLERY_TYPE: "data-xeg-gallery-type",
GALLERY_VERSION: "data-xeg-gallery-version"
};
const SELECTORS = {
OVERLAY: `.${CLASSES.OVERLAY}`,
CONTAINER: `.${CLASSES.CONTAINER}`,
ROOT: `.${CLASSES.ROOT}`,
RENDERER: `.${CLASSES.RENDERER}`,
VERTICAL_VIEW: `.${CLASSES.VERTICAL_VIEW}`,
ITEM: `.${CLASSES.ITEM}`,
DATA_GALLERY: `[${DATA_ATTRIBUTES.GALLERY}]`,
DATA_CONTAINER: `[${DATA_ATTRIBUTES.CONTAINER}]`,
DATA_ELEMENT: `[${DATA_ATTRIBUTES.ELEMENT}]`,
DATA_ROLE: `[${DATA_ATTRIBUTES.ROLE}]`,
DATA_ROLE_COMPAT: `[${DATA_ATTRIBUTES.ROLE_COMPAT}]`,
DATA_GALLERY_TYPE: `[${DATA_ATTRIBUTES.GALLERY_TYPE}]`,
DATA_GALLERY_VERSION: `[${DATA_ATTRIBUTES.GALLERY_VERSION}]`,
ROLE_GALLERY: `[${DATA_ATTRIBUTES.ROLE}="gallery"]`,
ROLE_ITEMS_CONTAINER: `[${DATA_ATTRIBUTES.ROLE}="items-container"]`
};
const INTERNAL_SELECTORS = [
SELECTORS.OVERLAY,
SELECTORS.CONTAINER,
SELECTORS.ROOT,
SELECTORS.RENDERER,
SELECTORS.VERTICAL_VIEW,
SELECTORS.ITEM,
SELECTORS.DATA_GALLERY,
SELECTORS.DATA_CONTAINER,
SELECTORS.DATA_ELEMENT,
SELECTORS.DATA_ROLE,
SELECTORS.DATA_ROLE_COMPAT,
SELECTORS.DATA_GALLERY_TYPE,
SELECTORS.DATA_GALLERY_VERSION,
SELECTORS.ROLE_GALLERY,
SELECTORS.ROLE_ITEMS_CONTAINER
];
const CSS = {
CLASSES,
SELECTORS,
INTERNAL_SELECTORS
};
const TWEET_ARTICLE_SELECTOR = '[data-testid="tweet"], article';
const TWEET_PHOTO_SELECTOR = '[data-testid="tweetPhoto"]';
const TWEET_TEXT_SELECTOR = '[data-testid="tweetText"]';
const VIDEO_PLAYER_SELECTOR = '[data-testid="videoPlayer"]';
const VIDEO_PLAYER_CONTEXT_SELECTOR = `${VIDEO_PLAYER_SELECTOR},[data-testid="videoComponent"],[data-testid="videoPlayerControls"],[data-testid="videoPlayerOverlay"],[role="application"],[aria-label*="Video"]`;
const STATUS_LINK_SELECTOR = 'a[href*="/status/"]';
const TWITTER_MEDIA_SELECTOR = 'img[src*="pbs.twimg.com"], video[src*="video.twimg.com"]';
const STABLE_TWEET_CONTAINERS_SELECTORS = [
'article[data-testid="tweet"]',
'article[role="article"]'
];
const STABLE_MEDIA_CONTAINERS_SELECTORS = [
'[data-testid="tweetPhoto"]',
'[data-testid="videoPlayer"]'
];
const STABLE_VIDEO_CONTAINERS_SELECTORS = ['[data-testid="videoPlayer"]', "video"];
const STABLE_IMAGE_CONTAINERS_SELECTORS = [
'[data-testid="tweetPhoto"]',
'img[src*="pbs.twimg.com"]'
];
const STABLE_MEDIA_VIEWERS_SELECTORS = [
'[data-testid="photoViewer"]',
'[aria-modal="true"][data-testid="Drawer"]',
'[aria-roledescription="carousel"]'
];
function closestWithFallback(element, selectors) {
for (const selector of selectors) {
try {
const match = element.closest(selector);
if (match) {
return match;
}
} catch (error) {
}
}
return null;
}
const FALLBACK_BASE_URL = "https://x.com";
function tryParseUrl(value, base = FALLBACK_BASE_URL) {
if (value instanceof URL) {
return value;
}
if (typeof value !== "string") {
return null;
}
const trimmed = value.trim();
if (!trimmed) {
return null;
}
try {
if (trimmed.startsWith("//")) {
return new URL(`https:${trimmed}`);
}
return new URL(trimmed, base);
} catch {
return null;
}
}
function isHostMatching(value, allowedHosts, options = {}) {
if (!Array.isArray(allowedHosts)) {
return false;
}
const parsed = value instanceof URL ? value : tryParseUrl(value);
if (!parsed) {
return false;
}
const hostname = parsed.hostname.toLowerCase();
const allowSubdomains = options.allowSubdomains === true;
return allowedHosts.some((host) => {
const normalized = host.toLowerCase();
if (hostname === normalized) {
return true;
}
return allowSubdomains && hostname.endsWith(`.${normalized}`);
});
}
const RESERVED_TWITTER_PATHS =  new Set([
"home",
"explore",
"notifications",
"messages",
"search",
"settings",
"i",
"intent",
"compose",
"hashtag"
]);
const TWITTER_USERNAME_PATTERN = /^[a-zA-Z0-9_]{1,15}$/;
const TWITTER_HOSTS = ["twitter.com", "x.com"];
function extractUsernameFromUrl(url, options = {}) {
if (!url || typeof url !== "string") {
return null;
}
try {
let path;
if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
const parsed = tryParseUrl(url);
if (!parsed) {
return null;
}
if (options.strictHost) {
if (!isHostMatching(parsed, TWITTER_HOSTS, { allowSubdomains: true })) {
return null;
}
}
path = parsed.pathname;
} else {
path = url;
}
const segments = path.split("/").filter(Boolean);
if (segments.length >= 3 && segments[1] === "status") {
const username = segments[0];
if (!username) {
return null;
}
if (RESERVED_TWITTER_PATHS.has(username.toLowerCase())) {
return null;
}
if (TWITTER_USERNAME_PATTERN.test(username)) {
return username;
}
}
return null;
} catch {
return null;
}
}
const DEFAULT_TWEET_ORIGIN = "https://x.com";
function normalizeTweetUrl$1(inputUrl) {
try {
const url = new URL(inputUrl, DEFAULT_TWEET_ORIGIN);
const hostname = url.hostname.toLowerCase();
if (hostname === "twitter.com" || hostname === "www.twitter.com" || hostname === "mobile.twitter.com") {
url.hostname = "x.com";
url.protocol = "https:";
}
if (hostname === "www.x.com") {
url.hostname = "x.com";
url.protocol = "https:";
}
return url.toString();
} catch {
if (inputUrl.startsWith("/")) {
return `${DEFAULT_TWEET_ORIGIN}${inputUrl}`;
}
return inputUrl;
}
}
const extractFromElement = (element) => {
const dataId = element.dataset.tweetId;
if (dataId && /^\d+$/.test(dataId)) {
return {
tweetId: dataId,
username: element.dataset.user ?? "unknown",
tweetUrl: `https://x.com/i/status/${dataId}`,
extractionMethod: "element-attribute",
confidence: 0.9
};
}
const href = element.getAttribute("href");
if (href) {
const match = href.match(/\/status\/(\d+)/);
if (match?.[1]) {
return {
tweetId: match[1],
username: extractUsernameFromUrl(href) ?? "unknown",
tweetUrl: normalizeTweetUrl$1(href),
extractionMethod: "element-href",
confidence: 0.8
};
}
}
return null;
};
const extractFromDOM = (element) => {
const container = element.closest(TWEET_ARTICLE_SELECTOR);
if (!container) return null;
const statusLink = container.querySelector(STATUS_LINK_SELECTOR);
if (!statusLink) return null;
const href = statusLink.getAttribute("href");
if (!href) return null;
const match = href.match(/\/status\/(\d+)/);
if (!match || !match[1]) return null;
const tweetId = match[1];
const username = extractUsernameFromUrl(href) ?? "unknown";
return {
tweetId,
username,
tweetUrl: normalizeTweetUrl$1(href),
extractionMethod: "dom-structure",
confidence: 0.85,
metadata: { containerTag: container.tagName.toLowerCase() }
};
};
const extractFromMediaGridItem = (element) => {
const link = element.closest("a");
if (!link) return null;
const href = link.getAttribute("href");
if (!href) return null;
const match = href.match(/\/status\/(\d+)/);
if (!match || !match[1]) return null;
const tweetId = match[1];
const username = extractUsernameFromUrl(href) ?? "unknown";
return {
tweetId,
username,
tweetUrl: normalizeTweetUrl$1(href),
extractionMethod: "media-grid-item",
confidence: 0.8
};
};
class TweetInfoExtractor {
strategies = [
extractFromElement,
extractFromDOM,
extractFromMediaGridItem
];
async extract(element) {
for (const strategy of this.strategies) {
try {
const result = strategy(element);
if (result && this.isValid(result)) {
if (false) ;
return result;
}
} catch {
}
}
return null;
}
isValid(info) {
return !!info.tweetId && /^\d+$/.test(info.tweetId) && info.tweetId !== "unknown";
}
}
function safeParseInt(value, radix = 10) {
if (value == null) {
return 0;
}
const result = Number.parseInt(value, radix);
return Number.isNaN(result) ? 0 : result;
}
function clamp(value, min = 0, max = 1) {
return Math.min(Math.max(value, min), max);
}
function clampIndex(index, length) {
if (!Number.isFinite(index) || length <= 0) {
return 0;
}
return clamp(Math.floor(index), 0, length - 1);
}
const STANDARD_GALLERY_HEIGHT = 720;
const DEFAULT_DIMENSIONS = {
width: 540,
height: STANDARD_GALLERY_HEIGHT
};
function hasValidUrlPrefix(str) {
return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("//") || str.startsWith("/") || str.startsWith("./") || str.startsWith("../");
}
function extractFilenameFromUrl(url) {
if (!url) return null;
const trimmed = url.trim();
if (!trimmed || !hasValidUrlPrefix(trimmed)) return null;
const parsed = tryParseUrl(trimmed, "https://example.invalid");
if (!parsed) return null;
const filename = parsed.pathname.split("/").pop();
return filename && filename.length > 0 ? filename : null;
}
function getMediaDedupKey(media) {
const urlCandidate = typeof media.originalUrl === "string" && media.originalUrl.length > 0 ? media.originalUrl : typeof media.url === "string" && media.url.length > 0 ? media.url : null;
if (!urlCandidate) {
return null;
}
const typePrefix = media.type === "image" || media.type === "video" || media.type === "gif" ? `${media.type}:` : "";
const parsed = tryParseUrl(urlCandidate, "https://example.invalid");
if (parsed) {
const host = parsed.hostname;
const path = parsed.pathname;
const format = parsed.searchParams.get("format");
const formatSuffix = format ? `?format=${format}` : "";
if (host && path) {
return `${typePrefix}${host}${path}${formatSuffix}`;
}
}
const filename = extractFilenameFromUrl(urlCandidate);
return filename ? `${typePrefix}${filename}` : `${typePrefix}${urlCandidate}`;
}
function removeDuplicateMediaItems(mediaItems) {
if (!mediaItems?.length) {
return [];
}
const seen =  new Set();
const result = [];
for (const item of mediaItems) {
if (item == null) continue;
const key = getMediaDedupKey(item);
if (!key) {
continue;
}
if (!seen.has(key)) {
seen.add(key);
result.push(item);
}
}
return result;
}
function extractVisualIndexFromUrl(url) {
if (!url) return 0;
const match = url.match(/\/(photo|video)\/(\d+)(?:[?#].*)?$/);
const visualNumber = match?.[2] ? Number.parseInt(match[2], 10) : NaN;
return Number.isFinite(visualNumber) && visualNumber > 0 ? visualNumber - 1 : 0;
}
function sortMediaByVisualOrder(mediaItems) {
if (mediaItems.length <= 1) return mediaItems;
const withVisualIndex = mediaItems.map((media) => {
const visualIndex = extractVisualIndexFromUrl(media.expanded_url || "");
return { media, visualIndex };
});
withVisualIndex.sort((a, b) => a.visualIndex - b.visualIndex);
return withVisualIndex.map(({ media }, newIndex) => ({
...media,
index: newIndex
}));
}
function extractDimensionsFromUrl(url) {
if (!url) return null;
const match = url.match(/\/(\d{2,6})x(\d{2,6})(?:\/|\.|$)/);
if (!match) return null;
const width = Number.parseInt(match[1] ?? "", 10);
const height = Number.parseInt(match[2] ?? "", 10);
if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
return null;
}
return { width, height };
}
function normalizeDimension(value) {
if (typeof value === "number" && Number.isFinite(value) && value > 0) {
return Math.round(value);
}
if (typeof value === "string") {
const parsed = Number.parseFloat(value);
if (Number.isFinite(parsed) && parsed > 0) {
return Math.round(parsed);
}
}
return null;
}
function normalizeMediaUrl(url) {
if (!url) return null;
const trimmed = url.trim();
if (!trimmed || !hasValidUrlPrefix(trimmed)) return null;
const parsed = tryParseUrl(trimmed, "https://example.invalid");
if (!parsed) return null;
let filename = parsed.pathname.split("/").pop();
if (!filename) return null;
const dotIndex = filename.lastIndexOf(".");
if (dotIndex !== -1) {
filename = filename.substring(0, dotIndex);
}
return filename && filename.length > 0 ? filename : null;
}
function scaleAspectRatio(widthRatio, heightRatio) {
if (heightRatio <= 0 || widthRatio <= 0) {
return DEFAULT_DIMENSIONS;
}
const scaledHeight = STANDARD_GALLERY_HEIGHT;
const scaledWidth = Math.max(1, Math.round(widthRatio / heightRatio * scaledHeight));
return {
width: scaledWidth,
height: scaledHeight
};
}
function extractDimensionsFromMetadataObject(dimensions) {
if (!dimensions) {
return null;
}
const width = normalizeDimension(dimensions.width);
const height = normalizeDimension(dimensions.height);
if (width && height) {
return { width, height };
}
return null;
}
function deriveDimensionsFromMetadata(metadata) {
if (!metadata) {
return null;
}
const dimensions = extractDimensionsFromMetadataObject(
metadata.dimensions
);
if (dimensions) {
return dimensions;
}
const apiData = metadata.apiData;
if (!apiData) {
return null;
}
const originalWidth = normalizeDimension(apiData.original_width ?? apiData.originalWidth);
const originalHeight = normalizeDimension(apiData.original_height ?? apiData.originalHeight);
if (originalWidth && originalHeight) {
return { width: originalWidth, height: originalHeight };
}
const downloadUrl = apiData.download_url;
if (typeof downloadUrl === "string" && downloadUrl) {
const fromDownloadUrl = extractDimensionsFromUrl(downloadUrl);
if (fromDownloadUrl) {
return fromDownloadUrl;
}
}
const previewUrl = apiData.preview_url;
if (typeof previewUrl === "string" && previewUrl) {
const fromPreviewUrl = extractDimensionsFromUrl(previewUrl);
if (fromPreviewUrl) {
return fromPreviewUrl;
}
}
const aspectRatio = apiData.aspect_ratio;
if (Array.isArray(aspectRatio) && aspectRatio.length >= 2) {
const ratioWidth = normalizeDimension(aspectRatio[0]);
const ratioHeight = normalizeDimension(aspectRatio[1]);
if (ratioWidth && ratioHeight) {
return scaleAspectRatio(ratioWidth, ratioHeight);
}
}
return null;
}
function deriveDimensionsFromMediaUrls(media) {
const candidates = [media.url, media.originalUrl, media.thumbnailUrl];
for (const candidate of candidates) {
if (typeof candidate === "string" && candidate) {
const dimensions = extractDimensionsFromUrl(candidate);
if (dimensions) {
return dimensions;
}
}
}
return null;
}
function resolveMediaDimensionsWithIntrinsicFlag(media) {
if (!media) {
return { dimensions: DEFAULT_DIMENSIONS, hasIntrinsicSize: false };
}
const directWidth = normalizeDimension(media.width);
const directHeight = normalizeDimension(media.height);
if (directWidth && directHeight) {
return { dimensions: { width: directWidth, height: directHeight }, hasIntrinsicSize: true };
}
const fromMetadata = deriveDimensionsFromMetadata(
media.metadata
);
if (fromMetadata) {
return { dimensions: fromMetadata, hasIntrinsicSize: true };
}
const fromUrls = deriveDimensionsFromMediaUrls(media);
if (fromUrls) {
return { dimensions: fromUrls, hasIntrinsicSize: true };
}
return { dimensions: DEFAULT_DIMENSIONS, hasIntrinsicSize: false };
}
function toRem(pixels) {
return `${(pixels / 16).toFixed(4)}rem`;
}
function createIntrinsicSizingStyle(dimensions) {
const ratio = dimensions.height > 0 ? dimensions.width / dimensions.height : 1;
return {
"--xeg-aspect-default": `${dimensions.width} / ${dimensions.height}`,
"--xeg-gallery-item-intrinsic-width": toRem(dimensions.width),
"--xeg-gallery-item-intrinsic-height": toRem(dimensions.height),
"--xeg-gallery-item-intrinsic-ratio": ratio.toFixed(6)
};
}
function adjustClickedIndexAfterDeduplication(originalItems, uniqueItems, originalClickedIndex) {
if (uniqueItems.length === 0) return 0;
const safeOriginalIndex = clampIndex(originalClickedIndex, originalItems.length);
const clickedItem = originalItems[safeOriginalIndex];
if (!clickedItem) return 0;
const clickedKey = getMediaDedupKey(clickedItem);
if (!clickedKey) return 0;
const newIndex = uniqueItems.findIndex((item) => {
return getMediaDedupKey(item) === clickedKey;
});
return newIndex >= 0 ? newIndex : 0;
}
function resolveDimensionsFromApiMedia(apiMedia) {
const widthFromOriginal = normalizeDimension(apiMedia.original_width);
const heightFromOriginal = normalizeDimension(apiMedia.original_height);
if (widthFromOriginal && heightFromOriginal) {
return {
width: widthFromOriginal,
height: heightFromOriginal
};
}
return null;
}
function createMediaInfoFromAPI(apiMedia, tweetInfo, index, tweetTextHTML) {
try {
const mediaType = apiMedia.type === "photo" ? "image" : "video";
const dimensions = resolveDimensionsFromApiMedia(apiMedia);
const metadata = {
apiIndex: index,
apiData: apiMedia
};
if (dimensions) {
metadata.dimensions = dimensions;
}
const username = apiMedia.screen_name || tweetInfo.username;
return {
id: `${tweetInfo.tweetId}_api_${index}`,
url: apiMedia.download_url,
type: mediaType,
filename: "",
tweetUsername: username,
tweetId: tweetInfo.tweetId,
tweetUrl: tweetInfo.tweetUrl,
tweetText: apiMedia.tweet_text,
tweetTextHTML,
originalUrl: apiMedia.download_url,
thumbnailUrl: apiMedia.preview_url,
alt: `${mediaType} ${index + 1}`,
...dimensions && {
width: dimensions.width,
height: dimensions.height
},
metadata
};
} catch (error) {
return null;
}
}
async function convertAPIMediaToMediaInfo(apiMedias, tweetInfo, tweetTextHTML) {
const mediaItems = [];
for (let i = 0; i < apiMedias.length; i++) {
const apiMedia = apiMedias[i];
if (!apiMedia) continue;
const mediaInfo = createMediaInfoFromAPI(apiMedia, tweetInfo, i, tweetTextHTML);
if (mediaInfo) {
mediaItems.push(mediaInfo);
}
}
return mediaItems;
}
const TWITTER_API_CONFIG = {
GUEST_AUTHORIZATION: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
TWEET_RESULT_BY_REST_ID_QUERY_ID: "zAz9764BcLZOJ0JU2wrd1A",
SUPPORTED_HOSTS: ["x.com", "twitter.com"],
DEFAULT_HOST: "x.com"
};
function serializeQueryParams(value) {
return typeof value === "string" ? value : JSON.stringify(value);
}
function buildTweetResultByRestIdUrl(args) {
const { host, queryId, variables, features, fieldToggles } = args;
const urlObj = new URL(`https://${host}/i/api/graphql/${queryId}/TweetResultByRestId`);
urlObj.searchParams.set("variables", serializeQueryParams(variables));
urlObj.searchParams.set("features", serializeQueryParams(features));
urlObj.searchParams.set("fieldToggles", serializeQueryParams(fieldToggles));
return urlObj.toString();
}
function getLocationLike() {
try {
const anyGlobal = globalThis;
return anyGlobal.location;
} catch {
return void 0;
}
}
function getSafeLocationValue(key) {
const location = getLocationLike();
if (!location) return void 0;
try {
return location[key];
} catch {
return void 0;
}
}
function getSafeHref() {
return getSafeLocationValue("href");
}
function getSafeOrigin() {
return getSafeLocationValue("origin");
}
function getSafeHostname() {
return getSafeLocationValue("hostname");
}
function getSafeLocationHeaders() {
const referer = getSafeHref();
const origin = getSafeOrigin();
if (!referer && !origin) {
return {};
}
return {
...referer ? { referer } : {},
...origin ? { origin } : {}
};
}
async function delay(ms, signal) {
if (ms <= 0) return;
if (signal?.aborted) {
throw getAbortReasonOrAbortErrorFromSignal(signal);
}
return new Promise((resolve, reject) => {
const timerId = globalTimerManager.setTimeout(() => {
cleanup();
resolve();
}, ms);
const onAbort = () => {
cleanup();
reject(getAbortReasonOrAbortErrorFromSignal(signal));
};
const cleanup = () => {
globalTimerManager.clearTimeout(timerId);
signal?.removeEventListener("abort", onAbort);
};
signal?.addEventListener("abort", onAbort, { once: true });
});
}
function getExponentialBackoffDelayMs(attempt, baseDelayMs) {
return baseDelayMs * 2 ** attempt;
}
const DEFAULT_OPTIONS = {
maxAttempts: 3,
baseDelayMs: 200,
maxDelayMs: 1e4
};
function calculateBackoff(attempt, baseDelayMs, maxDelayMs) {
const exponentialDelay = getExponentialBackoffDelayMs(attempt, baseDelayMs);
const jitter = Math.random() * 0.25 * exponentialDelay;
const totalDelay = exponentialDelay + jitter;
return Math.min(Math.floor(totalDelay), maxDelayMs);
}
async function withRetry(operation, options = {}) {
const {
maxAttempts = DEFAULT_OPTIONS.maxAttempts,
baseDelayMs = DEFAULT_OPTIONS.baseDelayMs,
maxDelayMs = DEFAULT_OPTIONS.maxDelayMs,
signal,
onRetry,
shouldRetry = () => true
} = options;
let lastError;
let attempt = 0;
while (attempt < maxAttempts) {
if (signal?.aborted) {
return {
success: false,
error: signal.reason ?? new DOMException("Operation was aborted", "AbortError"),
attempts: attempt
};
}
try {
const data = await operation();
return {
success: true,
data,
attempts: attempt + 1
};
} catch (error) {
lastError = error;
attempt++;
if (isAbortError(error)) {
return {
success: false,
error,
attempts: attempt
};
}
if (!shouldRetry(error)) {
return {
success: false,
error,
attempts: attempt
};
}
if (attempt >= maxAttempts) {
break;
}
const delayMs = calculateBackoff(attempt - 1, baseDelayMs, maxDelayMs);
onRetry?.(attempt, error, delayMs);
try {
await delay(delayMs, signal);
} catch (delayError) {
if (isAbortError(delayError)) {
return {
success: false,
error: delayError,
attempts: attempt
};
}
throw delayError;
}
}
}
return {
success: false,
error: lastError,
attempts: attempt
};
}
function escapeRegExp(value) {
return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function cx(...inputs) {
const classes = [];
for (const input of inputs) {
if (!input) continue;
if (typeof input === "string" || typeof input === "number") {
classes.push(String(input));
continue;
}
if (Array.isArray(input)) {
const nested = cx(...input);
if (nested) classes.push(nested);
continue;
}
if (typeof input === "object") {
for (const key in input) {
if (input[key]) {
classes.push(key);
}
}
}
}
return classes.join(" ");
}
let cachedCookieAPI;
function decode(value) {
if (!value) return void 0;
try {
return decodeURIComponent(value);
} catch {
return value;
}
}
function resolveCookieAPI() {
try {
const userscript = getUserscript();
if (userscript.cookie) {
return userscript.cookie;
}
} catch (error) {
}
return null;
}
function getCookieAPI() {
if (cachedCookieAPI === void 0) {
cachedCookieAPI = resolveCookieAPI();
}
return cachedCookieAPI;
}
function listFromDocument(options) {
if (typeof document === "undefined" || typeof document.cookie !== "string") {
return [];
}
const domain = typeof document.location?.hostname === "string" ? document.location.hostname : void 0;
const records = document.cookie.split(";").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
const [rawName, ...rest] = entry.split("=");
const nameDecoded = decode(rawName);
if (!nameDecoded) {
return null;
}
const value = decode(rest.join("=")) ?? "";
const record = {
name: nameDecoded,
value,
path: "/",
session: true,
...domain ? { domain } : {}
};
return record;
}).filter((record) => !!record);
const filtered = options?.name ? records.filter((record) => record.name === options.name) : records;
return filtered;
}
async function listCookies(options) {
const gmCookie = getCookieAPI();
if (!gmCookie?.list) {
return listFromDocument(options);
}
return promisifyCallback(
(callback) => gmCookie?.list(options, (cookies, error) => {
if (error) {
;
}
callback(error ? void 0 : (cookies ?? []).map((c) => ({ ...c })), error);
}),
{ fallback: () => listFromDocument(options) }
);
}
async function getCookieValue(name, options) {
const gmCookie = getCookieAPI();
if (gmCookie?.list) {
const cookies = await listCookies({ ...options, name });
const value = cookies[0]?.value;
if (value) {
return value;
}
}
return getCookieValueSync(name);
}
function getCookieValueSync(name) {
if (typeof document === "undefined" || typeof document.cookie !== "string") {
return void 0;
}
const pattern = new RegExp(`(?:^|;\\s*)${escapeRegExp(name)}=([^;]*)`);
const match = document.cookie.match(pattern);
return decode(match?.[1]);
}
const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 100;
let _csrfToken;
let _tokensInitialized = false;
let _initPromise = null;
function getBackoffDelay(attempt) {
return getExponentialBackoffDelayMs(attempt, BASE_RETRY_DELAY_MS);
}
async function fetchTokenWithRetry() {
const syncToken = getCookieValueSync("ct0");
if (syncToken) {
return syncToken;
}
for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
try {
const value = await getCookieValue("ct0");
if (value) {
if (false) ;
return value;
}
if (attempt < MAX_RETRY_ATTEMPTS - 1) {
const delayMs = getBackoffDelay(attempt);
if (false) ;
await delay(delayMs);
}
} catch (error) {
if (attempt < MAX_RETRY_ATTEMPTS - 1) {
const delayMs = getBackoffDelay(attempt);
await delay(delayMs);
}
}
}
return void 0;
}
function initializeTokensSync() {
if (_tokensInitialized) {
return;
}
const syncToken = getCookieValueSync("ct0");
if (syncToken) {
_csrfToken = syncToken;
_tokensInitialized = true;
}
}
async function initTokens() {
if (_tokensInitialized && _csrfToken) {
return _csrfToken;
}
if (_initPromise) {
return _initPromise;
}
_initPromise = (async () => {
try {
const token = await fetchTokenWithRetry();
_csrfToken = token;
_tokensInitialized = true;
return token;
} finally {
_initPromise = null;
}
})();
return _initPromise;
}
function getCsrfToken() {
initializeTokensSync();
return _csrfToken;
}
async function getCsrfTokenAsync() {
if (_tokensInitialized && _csrfToken) {
return _csrfToken;
}
return initTokens();
}
function resolveDimensions(media, mediaUrl) {
const dimensionsFromUrl = extractDimensionsFromUrl(mediaUrl);
const widthFromOriginal = normalizeDimension(media.original_info?.width);
const heightFromOriginal = normalizeDimension(media.original_info?.height);
const widthFromUrl = normalizeDimension(dimensionsFromUrl?.width);
const heightFromUrl = normalizeDimension(dimensionsFromUrl?.height);
const width = widthFromOriginal ?? widthFromUrl;
const height = heightFromOriginal ?? heightFromUrl;
const result = {};
if (width !== null && width !== void 0) {
result.width = width;
}
if (height !== null && height !== void 0) {
result.height = height;
}
return result;
}
function removeUrlTokensFromText(text, urls) {
let result = text;
for (const url of urls) {
if (!url) continue;
const token = escapeRegExp(url);
const re = new RegExp(`(^|\\s+)${token}(?=\\s+|$)`, "g");
result = result.replace(re, (_match, leadingWs) => leadingWs);
}
result = result.replace(/[ \t\f\v\u00A0]{2,}/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n");
return result.trim();
}
function resolveAspectRatio(media, dimensions) {
const aspectRatioValues = Array.isArray(media.video_info?.aspect_ratio) ? media.video_info?.aspect_ratio : void 0;
const aspectRatioWidth = normalizeDimension(aspectRatioValues?.[0]);
const aspectRatioHeight = normalizeDimension(aspectRatioValues?.[1]);
if (aspectRatioWidth && aspectRatioHeight) {
return [aspectRatioWidth, aspectRatioHeight];
}
if (dimensions.width && dimensions.height) {
return [dimensions.width, dimensions.height];
}
return void 0;
}
function getPhotoHighQualityUrl(mediaUrlHttps) {
if (!mediaUrlHttps) return mediaUrlHttps;
const isAbsolute = /^(https?:)?\/\//i.test(mediaUrlHttps);
const parsed = tryParseUrl(mediaUrlHttps, "https://pbs.twimg.com");
if (!parsed) {
const [pathPart = "", existingQuery = ""] = mediaUrlHttps.split("?");
const pathMatch2 = pathPart.match(/\.(jpe?g|png)$/i);
if (!pathMatch2) return mediaUrlHttps;
const ext2 = (pathMatch2[1] ?? "").toLowerCase();
const params = new URLSearchParams(existingQuery);
const hasFormat = Array.from(params.keys()).some((k) => k.toLowerCase() === "format");
if (!hasFormat) {
params.set("format", ext2);
}
params.set("name", "orig");
const query = params.toString();
return query ? `${pathPart}?${query}` : pathPart;
}
const hasParamCaseInsensitive = (key) => {
return Array.from(parsed.searchParams.keys()).some((k) => k.toLowerCase() === key);
};
const setParamCaseInsensitive = (key, value) => {
for (const k of Array.from(parsed.searchParams.keys())) {
if (k !== key && k.toLowerCase() === key) {
parsed.searchParams.delete(k);
}
}
parsed.searchParams.set(key, value);
};
const pathMatch = parsed.pathname.match(/\.(jpe?g|png)$/i);
if (!pathMatch) return mediaUrlHttps;
const ext = (pathMatch[1] ?? "").toLowerCase();
if (!hasParamCaseInsensitive("format")) {
setParamCaseInsensitive("format", ext);
}
setParamCaseInsensitive("name", "orig");
if (isAbsolute) return parsed.toString();
return `${parsed.pathname}${parsed.search}`;
}
function getVideoHighQualityUrl(media) {
const variants = media.video_info?.variants ?? [];
const mp4Variants = variants.filter((v) => v.content_type === "video/mp4");
if (mp4Variants.length === 0) return null;
const bestVariant = mp4Variants.reduce((best, current) => {
const bestBitrate = best.bitrate ?? 0;
const currentBitrate = current.bitrate ?? 0;
return currentBitrate > bestBitrate ? current : best;
});
return bestVariant.url;
}
function getHighQualityMediaUrl(media) {
if (media.type === "photo") {
return getPhotoHighQualityUrl(media.media_url_https) ?? null;
}
if (media.type === "video" || media.type === "animated_gif") {
return getVideoHighQualityUrl(media);
}
return null;
}
function createMediaEntry(media, mediaUrl, screenName, tweetId, tweetText, index, sourceLocation) {
const mediaType = media.type === "animated_gif" ? "video" : media.type;
const dimensions = resolveDimensions(media, mediaUrl);
const aspectRatio = resolveAspectRatio(media, dimensions);
const entry = {
screen_name: screenName,
tweet_id: tweetId,
download_url: mediaUrl,
type: mediaType,
typeOriginal: media.type,
index,
preview_url: media.media_url_https,
media_id: media.id_str,
media_key: media.media_key ?? "",
expanded_url: media.expanded_url ?? "",
short_expanded_url: media.display_url ?? "",
short_tweet_url: media.url ?? "",
tweet_text: tweetText,
sourceLocation
};
if (dimensions.width) {
entry.original_width = dimensions.width;
}
if (dimensions.height) {
entry.original_height = dimensions.height;
}
if (aspectRatio) {
entry.aspect_ratio = aspectRatio;
}
return entry;
}
function extractMediaFromTweet(tweetResult, tweetUser, sourceLocation = "original") {
const quotedResult = tweetResult.quoted_status_result?.result;
const parseTarget = sourceLocation === "quoted" && quotedResult ? quotedResult : tweetResult;
if (!parseTarget.extended_entities?.media) return [];
const mediaItems = [];
const screenName = tweetUser.screen_name ?? "";
const tweetId = parseTarget.rest_id ?? parseTarget.id_str ?? "";
const inlineMedia = parseTarget.note_tweet?.note_tweet_results?.result?.media?.inline_media;
const inlineMediaOrder =  new Map();
if (Array.isArray(inlineMedia)) {
for (const item of inlineMedia) {
if (item.media_id && typeof item.index === "number") {
inlineMediaOrder.set(item.media_id, item.index);
}
}
}
const orderedMedia = (() => {
const mediaList = parseTarget.extended_entities?.media ?? [];
if (inlineMediaOrder.size === 0) return mediaList;
return mediaList.map((media, originalIndex) => ({ media, originalIndex })).sort((left, right) => {
const leftInline = inlineMediaOrder.get(left.media.id_str);
const rightInline = inlineMediaOrder.get(right.media.id_str);
if (leftInline !== void 0 && rightInline !== void 0) return leftInline - rightInline;
if (leftInline !== void 0) return -1;
if (rightInline !== void 0) return 1;
return left.originalIndex - right.originalIndex;
}).map((entry) => entry.media);
})();
const baseTweetText = (parseTarget.full_text ?? "").trim();
const mediaShortUrls = orderedMedia.map((m) => m.url).filter((u) => typeof u === "string" && u.length > 0);
const normalizedTweetText = removeUrlTokensFromText(baseTweetText, mediaShortUrls);
for (let index = 0; index < orderedMedia.length; index++) {
const media = orderedMedia[index];
if (!media?.type) {
continue;
}
if (!media.id_str) {
continue;
}
if (!media.media_url_https) {
continue;
}
try {
const mediaUrl = getHighQualityMediaUrl(media);
if (!mediaUrl) {
continue;
}
const tweetText = normalizedTweetText;
const entry = createMediaEntry(
media,
mediaUrl,
screenName,
tweetId,
tweetText,
index,
sourceLocation
);
mediaItems.push(entry);
} catch (error) {
}
}
return mediaItems;
}
function normalizeLegacyTweet(tweet) {
if (tweet.legacy) {
if (!tweet.extended_entities && tweet.legacy.extended_entities) {
tweet.extended_entities = tweet.legacy.extended_entities;
}
if (!tweet.full_text && tweet.legacy.full_text) {
tweet.full_text = tweet.legacy.full_text;
}
if (!tweet.id_str && tweet.legacy.id_str) {
tweet.id_str = tweet.legacy.id_str;
}
}
const noteTweetText = tweet.note_tweet?.note_tweet_results?.result?.text;
if (noteTweetText) {
tweet.full_text = noteTweetText;
}
}
function normalizeLegacyUser(user) {
if (user.legacy) {
if (!user.screen_name && user.legacy.screen_name) {
user.screen_name = user.legacy.screen_name;
}
if (!user.name && user.legacy.name) {
user.name = user.legacy.name;
}
}
}
function resolveTwitterApiHost(hostname, supportedHosts, defaultHost) {
if (!hostname) {
return defaultHost;
}
const normalized = hostname.toLowerCase();
let candidate = null;
if (normalized === "x.com" || normalized.endsWith(".x.com")) {
candidate = "x.com";
} else if (normalized === "twitter.com" || normalized.endsWith(".twitter.com")) {
candidate = "twitter.com";
}
return candidate && supportedHosts.includes(candidate) ? candidate : defaultHost;
}
function getSafeHost() {
return resolveTwitterApiHost(
getSafeHostname(),
TWITTER_API_CONFIG.SUPPORTED_HOSTS,
TWITTER_API_CONFIG.DEFAULT_HOST
);
}
class TwitterAPI {
static async getTweetMedias(tweetId) {
const url = TwitterAPI.createTweetEndpointUrl(tweetId);
const json = await TwitterAPI.apiRequest(url);
if (!json.data?.tweetResult?.result) return [];
let tweetResult = json.data.tweetResult.result;
if (tweetResult.tweet) tweetResult = tweetResult.tweet;
const tweetUser = tweetResult.core?.user_results?.result;
normalizeLegacyTweet(tweetResult);
if (!tweetUser) return [];
normalizeLegacyUser(tweetUser);
let result = extractMediaFromTweet(tweetResult, tweetUser, "original");
result = sortMediaByVisualOrder(result);
if (tweetResult.quoted_status_result?.result) {
let quotedTweet = tweetResult.quoted_status_result.result;
if (quotedTweet.tweet) {
quotedTweet = quotedTweet.tweet;
}
const quotedUser = quotedTweet.core?.user_results?.result;
if (quotedTweet && quotedUser) {
normalizeLegacyTweet(quotedTweet);
normalizeLegacyUser(quotedUser);
const quotedMedia = extractMediaFromTweet(quotedTweet, quotedUser, "quoted");
const sortedQuotedMedia = sortMediaByVisualOrder(quotedMedia);
const adjustedResult = result.map((media) => ({
...media,
index: media.index + sortedQuotedMedia.length
}));
result = [...sortedQuotedMedia, ...adjustedResult];
}
}
return result;
}
static async apiRequest(url) {
const csrfToken = await getCsrfTokenAsync() ?? getCsrfToken() ?? "";
const headers = new Headers({
authorization: TWITTER_API_CONFIG.GUEST_AUTHORIZATION,
"x-csrf-token": csrfToken,
"x-twitter-client-language": "en",
"x-twitter-active-user": "yes",
"content-type": "application/json",
"x-twitter-auth-type": "OAuth2Session"
});
const locationHeaders = getSafeLocationHeaders();
if (locationHeaders.referer) {
headers.append("referer", locationHeaders.referer);
}
if (locationHeaders.origin) {
headers.append("origin", locationHeaders.origin);
}
try {
const httpService = HttpRequestService.getInstance();
const response = await httpService.get(url, {
headers: Object.fromEntries(headers.entries()),
responseType: "json"
});
if (!response.ok) {
if (false) ;
throw new Error(`TW:${response.status}`);
}
const json = response.data;
if (false) ;
return json;
} catch (error) {
throw error;
}
}
static createTweetEndpointUrl(tweetId) {
const host = getSafeHost();
const variables = {
tweetId,
withCommunity: false,
includePromotedContent: false,
withVoice: false
};
return buildTweetResultByRestIdUrl({
host,
queryId: TWITTER_API_CONFIG.TWEET_RESULT_BY_REST_ID_QUERY_ID,
variables,
features: {
creator_subscriptions_tweet_preview_api_enabled: true,
premium_content_api_read_enabled: false,
communities_web_enable_tweet_community_results_fetch: true,
c9s_tweet_anatomy_moderator_badge_enabled: true,
responsive_web_grok_analyze_button_fetch_trends_enabled: false,
responsive_web_grok_analyze_post_followups_enabled: false,
responsive_web_jetfuel_frame: false,
responsive_web_grok_share_attachment_enabled: true,
articles_preview_enabled: true,
responsive_web_edit_tweet_api_enabled: true,
graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
view_counts_everywhere_api_enabled: true,
longform_notetweets_consumption_enabled: true,
responsive_web_twitter_article_tweet_consumption_enabled: true,
tweet_awards_web_tipping_enabled: false,
responsive_web_grok_show_grok_translated_post: false,
responsive_web_grok_analysis_button_from_backend: false,
creator_subscriptions_quote_tweet_preview_enabled: false,
freedom_of_speech_not_reach_fetch_enabled: true,
standardized_nudges_misinfo: true,
tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
longform_notetweets_rich_text_read_enabled: true,
longform_notetweets_inline_media_enabled: true,
profile_label_improvements_pcf_label_in_post_enabled: true,
rweb_tipjar_consumption_enabled: true,
verified_phone_label_enabled: false,
responsive_web_grok_image_annotation_enabled: true,
responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
responsive_web_graphql_timeline_navigation_enabled: true,
responsive_web_enhance_cards_enabled: false
},
fieldToggles: {
withArticleRichContentState: true,
withArticlePlainText: false,
withGrokAnalyze: false,
withDisallowedReplyControls: false
}
});
}
}
const DEFAULT_MAX_DESCENDANT_DEPTH = 6;
const DEFAULT_MAX_ANCESTOR_HOPS = 3;
const DEFAULT_TRAVERSAL_OPTIONS = {
maxDescendantDepth: DEFAULT_MAX_DESCENDANT_DEPTH,
maxAncestorHops: DEFAULT_MAX_ANCESTOR_HOPS
};
function isMediaElement(element) {
if (!element) {
return false;
}
return element.tagName === "IMG" || element.tagName === "VIDEO";
}
function findMediaElementInDOM(target, options = {}) {
const { maxDescendantDepth, maxAncestorHops } = {
...DEFAULT_TRAVERSAL_OPTIONS,
...options
};
if (isMediaElement(target)) {
return target;
}
const descendant = findMediaDescendant(target, {
includeRoot: false,
maxDepth: maxDescendantDepth
});
if (descendant) {
return descendant;
}
let branch = target;
for (let hops = 0; hops < maxAncestorHops && branch; hops++) {
branch = branch.parentElement;
if (!branch) {
break;
}
const ancestorMedia = findMediaDescendant(branch, {
includeRoot: true,
maxDepth: maxDescendantDepth
});
if (ancestorMedia) {
return ancestorMedia;
}
}
return null;
}
function extractMediaUrlFromElement(element) {
if (element instanceof HTMLImageElement) {
const attr = element.getAttribute("src");
const current = element.currentSrc || null;
const resolved = attr ? element.src : null;
return pickFirstTruthy([current, resolved, attr]);
}
if (element instanceof HTMLVideoElement) {
const attr = element.getAttribute("src");
const posterAttr = element.getAttribute("poster");
const current = element.currentSrc || null;
const resolved = attr ? element.src : null;
const posterResolved = posterAttr ? element.poster : null;
return pickFirstTruthy([current, resolved, attr, posterResolved, posterAttr]);
}
return null;
}
function findMediaDescendant(root, { includeRoot, maxDepth }) {
const queue = [{ node: root, depth: 0 }];
while (queue.length) {
const current = queue.shift();
if (!current) {
break;
}
const { node, depth } = current;
if ((includeRoot || node !== root) && isMediaElement(node)) {
return node;
}
if (depth >= maxDepth) {
continue;
}
for (const child of Array.from(node.children)) {
if (child instanceof HTMLElement) {
queue.push({ node: child, depth: depth + 1 });
}
}
}
return null;
}
function pickFirstTruthy(values) {
for (const value of values) {
if (value) {
return value;
}
}
return null;
}
function determineClickedIndex(clickedElement, mediaItems) {
try {
const mediaElement = findMediaElementInDOM(clickedElement);
if (!mediaElement) return 0;
const elementUrl = extractMediaUrlFromElement(mediaElement);
if (!elementUrl) return 0;
const normalizedElementUrl = normalizeMediaUrl(elementUrl);
if (!normalizedElementUrl) return 0;
const index = mediaItems.findIndex((item, i) => {
if (!item) return false;
const itemUrl = item.url || item.originalUrl;
if (itemUrl && normalizeMediaUrl(itemUrl) === normalizedElementUrl) {
if (false) ;
return true;
}
if (item.thumbnailUrl && normalizeMediaUrl(item.thumbnailUrl) === normalizedElementUrl) {
if (false) ;
return true;
}
return false;
});
if (index !== -1) return index;
if (false) ;
return 0;
} catch (error) {
return 0;
}
}
function extractTweetTextHTML(tweetArticle) {
if (!tweetArticle) return void 0;
try {
const tweetTextElement = tweetArticle.querySelector(TWEET_TEXT_SELECTOR);
if (!tweetTextElement) {
if (false) ;
return void 0;
}
const text = tweetTextElement.textContent?.trim();
if (!text) {
if (false) ;
return void 0;
}
if (false) ;
return text;
} catch (error) {
return void 0;
}
}
function extractTweetTextHTMLFromClickedElement(element, maxDepth = 10) {
const tweetArticle = closestWithFallback(element, STABLE_TWEET_CONTAINERS_SELECTORS);
if (tweetArticle) {
return extractTweetTextHTML(tweetArticle);
}
return void 0;
}
class TwitterAPIExtractor {
async extract(tweetInfo, clickedElement, _options, extractionId) {
const now = typeof performance !== "undefined" && typeof performance.now === "function" ? () => performance.now() : () => Date.now();
const startedAt = now();
try {
if (false) ;
const apiMedias = await TwitterAPI.getTweetMedias(tweetInfo.tweetId);
if (!apiMedias || apiMedias.length === 0) {
const totalProcessingTime2 = Math.max(0, now() - startedAt);
const failure = this.createFailureResult("No media found in API response");
return {
...failure,
metadata: {
...failure.metadata ?? {},
totalProcessingTime: totalProcessingTime2
}
};
}
const tweetTextHTML = extractTweetTextHTMLFromClickedElement(clickedElement);
const mediaItems = await convertAPIMediaToMediaInfo(apiMedias, tweetInfo, tweetTextHTML);
const clickedIndex = determineClickedIndex(clickedElement, mediaItems);
const totalProcessingTime = Math.max(0, now() - startedAt);
return {
success: true,
mediaItems,
clickedIndex,
metadata: {
extractedAt: Date.now(),
sourceType: "twitter-api",
strategy: "api-extraction",
totalProcessingTime,
apiMediaCount: apiMedias.length
},
tweetInfo
};
} catch (error) {
const totalProcessingTime = Math.max(0, now() - startedAt);
const failure = this.createFailureResult(getErrorMessage(error) || "API extraction failed");
return {
...failure,
metadata: {
...failure.metadata ?? {},
totalProcessingTime
}
};
}
}
createFailureResult(error) {
return {
success: false,
mediaItems: [],
clickedIndex: 0,
metadata: {
extractedAt: Date.now(),
sourceType: "twitter-api",
strategy: "api-extraction-failed",
error,
totalProcessingTime: 0
},
tweetInfo: null
};
}
}
class ExtractionError extends Error {
constructor(code, message, originalError) {
super(message);
this.code = code;
this.originalError = originalError;
this.name = "ExtractionError";
}
}
const ErrorCode = {
NONE: "NONE",
CANCELLED: "CANCELLED",
NETWORK: "NETWORK",
TIMEOUT: "TIMEOUT",
EMPTY_INPUT: "EMPTY_INPUT",
ALL_FAILED: "ALL_FAILED",
PARTIAL_FAILED: "PARTIAL_FAILED",
UNKNOWN: "UNKNOWN",
ELEMENT_NOT_FOUND: "ELEMENT_NOT_FOUND",
INVALID_ELEMENT: "INVALID_ELEMENT",
NO_MEDIA_FOUND: "NO_MEDIA_FOUND",
INVALID_URL: "INVALID_URL",
PERMISSION_DENIED: "PERMISSION_DENIED"
};
function createId() {
try {
if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
return crypto.randomUUID().replaceAll("-", "");
}
} catch {
}
return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}
function createPrefixedId(prefix, separator = "_") {
return `${prefix}${separator}${createId()}`;
}
class MediaExtractionService {
tweetInfoExtractor;
apiExtractor;
constructor() {
this.tweetInfoExtractor = new TweetInfoExtractor();
this.apiExtractor = new TwitterAPIExtractor();
}
async extractFromClickedElement(element, options = {}) {
const extractionId = this.generateExtractionId();
try {
const tweetInfo = await this.tweetInfoExtractor.extract(element);
if (!tweetInfo?.tweetId) {
if (false) ;
return this.createErrorResult("No tweet information found");
}
const apiResult = await this.apiExtractor.extract(tweetInfo, element, options, extractionId);
if (apiResult.success && apiResult.mediaItems.length > 0) {
return this.finalizeResult({
...apiResult,
tweetInfo: this.mergeTweetInfoMetadata(tweetInfo, apiResult.tweetInfo)
});
}
if (false) ;
return this.createApiErrorResult(apiResult, tweetInfo);
} catch (error) {
return this.createErrorResult(error);
}
}
async extractAllFromContainer(container, options = {}) {
try {
const firstMedia = container.querySelector(TWITTER_MEDIA_SELECTOR);
if (!firstMedia || !(firstMedia instanceof HTMLElement)) {
return this.createErrorResult("No media found in container");
}
return this.extractFromClickedElement(firstMedia, options);
} catch (error) {
return this.createErrorResult(error);
}
}
generateExtractionId() {
return createPrefixedId("simp");
}
createErrorResult(error) {
const errorMessage = getErrorMessage(error) || "Unknown error";
return {
success: false,
mediaItems: [],
clickedIndex: 0,
metadata: {
extractedAt: Date.now(),
sourceType: "extraction-failed",
strategy: "media-extraction",
error: errorMessage
},
tweetInfo: null,
errors: [new ExtractionError(ErrorCode.NO_MEDIA_FOUND, errorMessage)]
};
}
createApiErrorResult(apiResult, tweetInfo) {
const apiErrorMessage = apiResult.metadata?.error ?? apiResult.errors?.[0]?.message ?? "API extraction failed";
const mergedTweetInfo = this.mergeTweetInfoMetadata(tweetInfo, apiResult.tweetInfo);
return {
success: false,
mediaItems: [],
clickedIndex: apiResult.clickedIndex ?? 0,
metadata: {
...apiResult.metadata ?? {},
strategy: "api-extraction",
sourceType: "extraction-failed"
},
tweetInfo: mergedTweetInfo,
errors: [new ExtractionError(ErrorCode.NO_MEDIA_FOUND, apiErrorMessage)]
};
}
finalizeResult(result) {
if (!result.success) return result;
const uniqueItems = removeDuplicateMediaItems(result.mediaItems);
if (uniqueItems.length === 0) {
return { ...result, mediaItems: [], clickedIndex: 0 };
}
const adjustedIndex = adjustClickedIndexAfterDeduplication(
result.mediaItems,
uniqueItems,
result.clickedIndex ?? 0
);
return {
...result,
mediaItems: uniqueItems,
clickedIndex: adjustedIndex
};
}
mergeTweetInfoMetadata(base, override) {
if (!base) return override ?? null;
if (!override) return base;
return {
...base,
...override,
metadata: {
...base.metadata ?? {},
...override.metadata ?? {}
}
};
}
}
class MediaService {
lifecycle;
static singleton = createSingleton(() => new MediaService());
mediaExtraction = null;
prefetchManager = new PrefetchManager(20);
didCleanup = false;
constructor(_options = {}) {
this.lifecycle = createLifecycle("MediaService", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
}
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.cleanupOnce();
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
{
this.mediaExtraction = new MediaExtractionService();
}
}
onDestroy() {
this.cleanupOnce();
}
static getInstance(_options) {
return MediaService.singleton.get();
}
cleanupOnce() {
if (this.didCleanup) {
return;
}
this.didCleanup = true;
this.prefetchManager.destroy();
}
async extractFromClickedElement(element, options = {}) {
if (!this.mediaExtraction) throw new Error("Media Extraction not initialized");
const result = await this.mediaExtraction.extractFromClickedElement(element, options);
if (result.success && result.mediaItems.length > 0) {
const items = result.mediaItems;
const clickedIndex = clampIndex(result.clickedIndex ?? 0, items.length);
const scheduled =  new Set();
const clickedItem = items[clickedIndex];
if (clickedItem) {
scheduled.add(clickedItem.url);
this.prefetchMedia(clickedItem, "immediate");
}
items.forEach((item, index) => {
if (!item) return;
if (index === clickedIndex) return;
if (scheduled.has(item.url)) return;
scheduled.add(item.url);
this.prefetchMedia(item, "idle");
});
}
return result;
}
async extractAllFromContainer(container, options = {}) {
if (!this.mediaExtraction) throw new Error("Media Extraction not initialized");
return this.mediaExtraction.extractAllFromContainer(container, options);
}
async prefetchMedia(media, schedule = "idle") {
return this.prefetchManager.prefetch(media, schedule);
}
getCachedMedia(url) {
return this.prefetchManager.get(url);
}
cancelAllPrefetch() {
this.prefetchManager.cancelAll();
}
clearPrefetchCache() {
this.prefetchManager.clear();
}
async cleanup() {
this.cancelAllPrefetch();
this.clearPrefetchCache();
this.onDestroy();
}
}
function isDisposable(value) {
return value !== null && typeof value === "object" && "destroy" in value && typeof value.destroy === "function";
}
class CoreService {
static singleton = createSingleton(() => new CoreService());
services =  new Map();
constructor() {
}
static getInstance() {
return CoreService.singleton.get();
}
register(key, instance, options) {
const allowOverride = options?.allowOverride ?? false;
const onDuplicate = options?.onDuplicate ?? "warn";
if (this.services.has(key) && !allowOverride) {
if (onDuplicate === "throw") {
throw new Error(`[CoreService] Duplicate service key: ${key}`);
}
return;
}
this.services.set(key, instance);
}
get(key) {
if (this.services.has(key)) {
return this.services.get(key);
}
throw new Error(`Service not found: ${key}`);
}
tryGet(key) {
if (this.services.has(key)) {
return this.services.get(key);
}
return null;
}
has(key) {
return this.services.has(key);
}
getRegisteredServices() {
return Array.from(this.services.keys());
}
cleanup() {
this.services.forEach((service) => {
try {
if (isDisposable(service)) {
service.destroy();
}
} catch (e) {
}
});
this.services.clear();
}
reset() {
this.cleanup();
}
}
const APP_SETTINGS_STORAGE_KEY = "xeg-app-settings";
const THEME_DOM_ATTRIBUTE = "data-theme";
function syncThemeAttributes(theme, options = {}) {
if (typeof document === "undefined") {
return;
}
const { scopes, includeDocumentRoot = false } = options;
if (includeDocumentRoot) {
document.documentElement?.setAttribute(THEME_DOM_ATTRIBUTE, theme);
}
const targets = scopes ?? document.querySelectorAll(".xeg-theme-scope");
for (const target of Array.from(targets)) {
if (target instanceof HTMLElement) {
target.setAttribute(THEME_DOM_ATTRIBUTE, theme);
}
}
}
const listeners =  new Map();
function generateListenerId(ctx) {
return ctx ? createPrefixedId(ctx, ":") : createId();
}
function addListener(element, type, listener, options, context) {
const id = generateListenerId(context);
if (!element || typeof element.addEventListener !== "function") {
return id;
}
try {
element.addEventListener(type, listener, options);
const listenerContext = {
id,
element,
type,
listener,
options,
context
};
listeners.set(id, listenerContext);
if (false) ;
return id;
} catch (error) {
return id;
}
}
function removeEventListenerManaged(id) {
const ctx = listeners.get(id);
if (!ctx) {
return false;
}
try {
ctx.element.removeEventListener(ctx.type, ctx.listener, ctx.options);
listeners.delete(id);
if (false) ;
return true;
} catch (error) {
return false;
}
}
class EventManager {
lifecycle;
static singleton = createSingleton(() => new EventManager());
isDestroyed = false;
ownedListenerContexts =  new Map();
constructor() {
this.lifecycle = createLifecycle("EventManager", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
}
static getInstance() {
return EventManager.singleton.get();
}
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
this.isDestroyed = false;
}
onDestroy() {
this.cleanup();
}
addListener(element, type, listener, options, context) {
if (this.isDestroyed) {
return null;
}
const id = addListener(element, type, listener, options, context);
if (id) {
this.ownedListenerContexts.set(id, context);
}
return id || null;
}
addEventListener(element, type, listener, options) {
const normalized = options ?? {};
const { context, ...listenerOptions } = normalized;
return this.addListener(element, type, listener, listenerOptions, context);
}
removeListener(id) {
if (!this.ownedListenerContexts.has(id)) {
return false;
}
this.ownedListenerContexts.delete(id);
return removeEventListenerManaged(id);
}
removeByContext(context) {
const toRemove = [];
for (const [id, ctx] of this.ownedListenerContexts) {
if (ctx === context) {
toRemove.push(id);
}
}
let count = 0;
for (const id of toRemove) {
this.ownedListenerContexts.delete(id);
if (removeEventListenerManaged(id)) {
count++;
}
}
return count;
}
getIsDestroyed() {
return this.isDestroyed;
}
getListenerStatus() {
{
return { total: 0, byContext: {}, byType: {} };
}
}
cleanup() {
if (this.isDestroyed) {
return;
}
const ids = Array.from(this.ownedListenerContexts.keys());
this.ownedListenerContexts.clear();
for (const id of ids) {
try {
removeEventListenerManaged(id);
} catch {
}
}
this.isDestroyed = true;
}
}
class ThemeService {
lifecycle;
storage = getPersistentStorage();
mediaQueryList = null;
mediaQueryListener = null;
domEventsController = null;
currentTheme = "light";
themeSetting = "auto";
listeners =  new Set();
boundSettingsService = null;
settingsUnsubscribe = null;
observer = null;
static singleton = createSingleton(() => new ThemeService());
static getInstance() {
return ThemeService.singleton.get();
}
earlyRestoreFailed = false;
earlyRestorePromise = null;
didCleanup = false;
constructor() {
this.lifecycle = createLifecycle("ThemeService", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
if (typeof window !== "undefined") {
this.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
this.observer = new MutationObserver((mutations) => {
for (const m of mutations) {
m.addedNodes.forEach((node) => {
if (node instanceof Element) {
if (node.classList.contains("xeg-theme-scope")) {
syncThemeAttributes(this.currentTheme, { scopes: [node] });
}
node.querySelectorAll(".xeg-theme-scope").forEach((scope) => {
syncThemeAttributes(this.currentTheme, { scopes: [scope] });
});
}
});
}
});
if (document.documentElement) {
this.observer.observe(document.documentElement, {
childList: true,
subtree: true
});
}
}
this.themeSetting = this.loadThemeSync();
this.applyCurrentTheme(true);
this.scheduleEarlyAsyncRestore();
}
scheduleEarlyAsyncRestore() {
if (this.earlyRestorePromise) {
return;
}
this.earlyRestorePromise = (async () => {
try {
const saved = await this.loadThemeAsync();
if (saved && saved !== this.themeSetting) {
this.themeSetting = saved;
this.applyCurrentTheme(true);
}
} catch (error) {
this.earlyRestoreFailed = true;
} finally {
try {
this.initializeSystemDetection();
} catch (error) {
}
}
})();
}
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.cleanupOnce();
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
await (this.earlyRestorePromise ?? Promise.resolve());
if (this.earlyRestoreFailed) {
const saved = await this.loadThemeAsync();
if (saved && saved !== this.themeSetting) {
this.themeSetting = saved;
this.applyCurrentTheme(true);
}
}
try {
const settingsService = CoreService.getInstance().tryGet(
SERVICE_KEYS.SETTINGS
);
if (settingsService) {
this.bindSettingsService(settingsService);
}
} catch (err) {
}
}
bindSettingsService(settingsService) {
if (!settingsService || this.boundSettingsService === settingsService) return;
if (this.settingsUnsubscribe) {
this.settingsUnsubscribe();
}
this.boundSettingsService = settingsService;
const settingsTheme = settingsService.get?.("gallery.theme");
if (settingsTheme && ["light", "dark", "auto"].includes(settingsTheme)) {
if (settingsTheme !== this.themeSetting) {
this.themeSetting = settingsTheme;
this.applyCurrentTheme(true);
}
}
if (typeof settingsService.subscribe === "function") {
this.settingsUnsubscribe = settingsService.subscribe((event) => {
if (event?.key === "gallery.theme") {
const newVal = event.newValue;
if (["light", "dark", "auto"].includes(newVal) && newVal !== this.themeSetting) {
this.themeSetting = newVal;
this.applyCurrentTheme();
}
}
});
}
}
setTheme(setting, options) {
const validSettings = ["light", "dark", "auto"];
const normalized = validSettings.includes(setting) ? setting : "light";
this.themeSetting = normalized;
if (options?.persist !== false && this.boundSettingsService?.set) {
const result = this.boundSettingsService.set("gallery.theme", this.themeSetting);
if (result instanceof Promise) {
result.catch((error) => {
});
}
}
const notified = this.applyCurrentTheme(options?.force);
if (!notified) {
this.notifyListeners();
}
}
getEffectiveTheme() {
if (this.themeSetting === "auto") {
return this.mediaQueryList?.matches ? "dark" : "light";
}
return this.themeSetting;
}
getCurrentTheme() {
return this.themeSetting;
}
isDarkMode() {
return this.getEffectiveTheme() === "dark";
}
onThemeChange(listener) {
this.listeners.add(listener);
return () => this.listeners.delete(listener);
}
onDestroy() {
this.cleanupOnce();
}
cleanupOnce() {
if (this.didCleanup) {
return;
}
this.didCleanup = true;
if (this.settingsUnsubscribe) {
this.settingsUnsubscribe();
this.settingsUnsubscribe = null;
}
this.listeners.clear();
if (this.observer) {
this.observer.disconnect();
this.observer = null;
}
if (this.domEventsController) {
this.domEventsController.abort();
this.domEventsController = null;
}
this.mediaQueryListener = null;
this.mediaQueryList = null;
}
initializeSystemDetection() {
if (this.mediaQueryList && !this.mediaQueryListener) {
if (!this.domEventsController || this.domEventsController.signal.aborted) {
this.domEventsController = new AbortController();
}
this.mediaQueryListener = () => {
if (this.themeSetting === "auto") {
this.applyCurrentTheme();
}
};
const listener = this.mediaQueryListener;
if (!listener) {
return;
}
const eventListener = (evt) => {
listener(evt);
};
EventManager.getInstance().addEventListener(this.mediaQueryList, "change", eventListener, {
signal: this.domEventsController.signal,
context: "theme-service"
});
}
}
applyCurrentTheme(force = false) {
const effective = this.getEffectiveTheme();
if (force || this.currentTheme !== effective) {
this.currentTheme = effective;
syncThemeAttributes(this.currentTheme);
this.notifyListeners();
return true;
}
return false;
}
notifyListeners() {
this.listeners.forEach((l) => l(this.currentTheme, this.themeSetting));
}
loadThemeSync() {
try {
const snapshot = this.storage.getSync(APP_SETTINGS_STORAGE_KEY);
return snapshot?.gallery?.theme ?? "auto";
} catch {
return "auto";
}
}
async loadThemeAsync() {
try {
const snapshot = await this.storage.get(APP_SETTINGS_STORAGE_KEY);
return snapshot?.gallery?.theme ?? null;
} catch {
return null;
}
}
}
function registerCoreServices() {
const core = CoreService.getInstance();
if (!core.has(SERVICE_KEYS.THEME)) {
core.register(SERVICE_KEYS.THEME, ThemeService.getInstance());
}
if (!core.has(SERVICE_KEYS.LANGUAGE)) {
core.register(SERVICE_KEYS.LANGUAGE, LanguageService.getInstance());
}
if (!core.has(SERVICE_KEYS.MEDIA_SERVICE)) {
core.register(SERVICE_KEYS.MEDIA_SERVICE, MediaService.getInstance());
}
}
async function initializeCoreBaseServices() {
const coreService = CoreService.getInstance();
try {
registerCoreServices();
const theme = coreService.get(SERVICE_KEYS.THEME);
if (theme && typeof theme.initialize === "function") {
await theme.initialize();
}
const language = coreService.get(SERVICE_KEYS.LANGUAGE);
if (language && typeof language.initialize === "function") {
await language.initialize();
}
const media = coreService.get(SERVICE_KEYS.MEDIA_SERVICE);
if (media && typeof media.initialize === "function") {
await media.initialize();
}
if (false) ;
} catch (error) {
throw new Error("[base-services] initialization failed", {
cause: error instanceof Error ? error : new Error(String(error))
});
}
}
async function initializeCriticalSystems() {
registerCoreServices();
}
function ensureDevNamespace() {
{
return void 0;
}
}
function mutateDevNamespace(mutator) {
const namespace = ensureDevNamespace();
if (!namespace) {
return;
}
mutator(namespace);
}
function setupDevNamespace(galleryAppInstance, actions) {
mutateDevNamespace((namespace) => {
const mainNamespace = namespace.main ?? (namespace.main = {
...actions
});
mainNamespace.start = actions.start;
mainNamespace.createConfig = actions.createConfig;
mainNamespace.cleanup = actions.cleanup;
if (galleryAppInstance !== void 0) {
if (galleryAppInstance) {
mainNamespace.galleryApp = galleryAppInstance;
} else {
delete mainNamespace.galleryApp;
}
}
});
}
function wireGlobalEvents(onBeforeUnload) {
const hasWindow = typeof window !== "undefined" && !!window.addEventListener;
if (!hasWindow) {
return () => {
};
}
let disposed = false;
const eventManager = EventManager.getInstance();
const controller = new AbortController();
const invokeOnce = () => {
if (disposed) {
return;
}
disposed = true;
controller.abort();
onBeforeUnload();
};
const handler = () => {
invokeOnce();
};
eventManager.addEventListener(window, "pagehide", handler, {
once: true,
passive: true,
signal: controller.signal,
context: "bootstrap:pagehide"
});
return () => {
if (disposed) {
return;
}
disposed = true;
controller.abort();
};
}
function sanitize(name) {
const sanitized = name.replace(/[<>:"/\\|?*]/g, "_").replace(/^[\s.]+|[\s.]+$/g, "").slice(0, 255);
return sanitized || "media";
}
function resolveNowMs$1(nowMs) {
return Number.isFinite(nowMs) ? nowMs : 0;
}
function getExtension(url) {
try {
const path = url.split("?")[0];
if (!path) return "jpg";
const ext = path.split(".").pop();
if (ext && /^(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i.test(ext)) {
return ext.toLowerCase();
}
} catch {
}
return "jpg";
}
function getIndexFromMediaId(mediaId) {
if (!mediaId) return null;
const match = mediaId.match(/_media_(\d+)$/) || mediaId.match(/_(\d+)$/);
if (match) {
const idx = safeParseInt(match[1], 10);
return mediaId.includes("_media_") ? (idx + 1).toString() : match[1] ?? null;
}
return null;
}
function normalizeIndex(index) {
if (index === void 0 || index === null) return "1";
const num = typeof index === "string" ? safeParseInt(index, 10) : index;
return Number.isNaN(num) || num < 1 ? "1" : num.toString();
}
function resolveMetadata(media, fallbackUsername) {
let username = null;
let tweetId = null;
if (media.sourceLocation === "quoted" && media.quotedUsername && media.quotedTweetId) {
username = media.quotedUsername;
tweetId = media.quotedTweetId;
} else {
tweetId = media.tweetId ?? null;
if (media.tweetUsername && media.tweetUsername !== "unknown") {
username = media.tweetUsername;
} else {
const url = ("originalUrl" in media ? media.originalUrl : null) || media.url;
if (typeof url === "string") {
username = extractUsernameFromUrl(url, { strictHost: true });
}
}
}
if (!username && fallbackUsername) {
username = fallbackUsername;
}
return { username, tweetId };
}
function generateMediaFilename(media, options = {}) {
try {
if (media.filename) {
return sanitize(media.filename);
}
const nowMs = resolveNowMs$1(options.nowMs);
const extension = options.extension ?? getExtension(media.originalUrl ?? media.url);
const index = getIndexFromMediaId(media.id) ?? normalizeIndex(options.index);
const { username, tweetId } = resolveMetadata(media, options.fallbackUsername);
if (username && tweetId) {
return sanitize(`${username}_${tweetId}_${index}.${extension}`);
}
if (tweetId && /^\d+$/.test(tweetId)) {
return sanitize(`tweet_${tweetId}_${index}.${extension}`);
}
const prefix = options.fallbackPrefix ?? "media";
return sanitize(`${prefix}_${nowMs}_${index}.${extension}`);
} catch {
const nowMs = resolveNowMs$1(options.nowMs);
return `media_${nowMs}.${options.extension || "jpg"}`;
}
}
function generateZipFilename(mediaItems, options = {}) {
try {
const firstItem = mediaItems[0];
if (firstItem) {
const { username, tweetId } = resolveMetadata(firstItem);
if (username && tweetId) {
return sanitize(`${username}_${tweetId}.zip`);
}
}
const prefix = options.fallbackPrefix ?? "xcom_gallery";
const nowMs = resolveNowMs$1(options.nowMs);
return sanitize(`${prefix}_${nowMs}.zip`);
} catch {
const nowMs = resolveNowMs$1(options.nowMs);
return `download_${nowMs}.zip`;
}
}
function planSingleDownload(input) {
const { method, mediaUrl, filename, hasProvidedBlob } = input;
if (method === "gm_download") {
return {
strategy: "gm_download",
url: mediaUrl,
filename,
useBlobUrl: hasProvidedBlob
};
}
return { strategy: "none", filename, error: "No download method" };
}
function planBulkDownload(input) {
const items = input.mediaItems.map((media) => ({
url: media.url,
desiredName: input.nowMs === void 0 ? generateMediaFilename(media) : generateMediaFilename(media, { nowMs: input.nowMs }),
blob: input.prefetchedBlobs?.get(media.url)
}));
const zipFilename = input.zipFilename || (input.nowMs === void 0 ? generateZipFilename(input.mediaItems) : generateZipFilename(input.mediaItems, { nowMs: input.nowMs }));
return { items, zipFilename };
}
function planZipSave(method) {
if (method === "gm_download") return "gm_download";
return "none";
}
function detectDownloadCapability() {
const rawGMDownload = resolveGMDownload();
const gmDownload = typeof rawGMDownload === "function" ? rawGMDownload : void 0;
const hasGMDownload = isGMAPIAvailable("download") && !!gmDownload;
return {
hasGMDownload,
method: hasGMDownload ? "gm_download" : "none",
gmDownload
};
}
function toActionCommand(plan, timeoutMs) {
if (plan.strategy === "gm_download") {
return {
type: "DOWNLOAD_WITH_GM_DOWNLOAD",
url: plan.url,
filename: plan.filename,
timeoutMs,
useBlobUrl: plan.useBlobUrl
};
}
return { type: "FAIL", filename: plan.filename, error: plan.error };
}
function createSingleDownloadCommands(input) {
const timeoutMs = input.timeoutMs ?? 3e4;
const plan = planSingleDownload({
method: input.method,
mediaUrl: input.mediaUrl,
filename: input.filename,
hasProvidedBlob: input.hasProvidedBlob
});
const action = toActionCommand(plan, timeoutMs);
const shouldReportPreparing = action.type === "DOWNLOAD_WITH_GM_DOWNLOAD" || action.type === "FAIL";
return shouldReportPreparing ? [
{
type: "REPORT_PROGRESS",
phase: "preparing",
percentage: 0,
filename: input.filename
},
action
] : [action];
}
async function executeSingleDownloadCommand(cmd, options, capability, blob) {
switch (cmd.type) {
case "FAIL":
return { success: false, error: cmd.error };
case "REPORT_PROGRESS":
options.onProgress?.({
phase: cmd.phase,
current: 0,
total: 1,
percentage: cmd.percentage,
filename: cmd.filename
});
return { success: true, filename: cmd.filename };
case "DOWNLOAD_WITH_GM_DOWNLOAD": {
const gmDownload = capability.gmDownload;
if (!gmDownload) {
return { success: false, error: "GM_download unavailable" };
}
let url = cmd.url;
let isBlobUrl = false;
if (cmd.useBlobUrl) {
if (!blob) {
return { success: false, error: "Blob unavailable" };
}
url = URL.createObjectURL(blob);
isBlobUrl = true;
}
return await new Promise((resolve) => {
let timer;
const cleanup = () => {
if (isBlobUrl) {
URL.revokeObjectURL(url);
}
if (timer) {
globalTimerManager.clearTimeout(timer);
timer = void 0;
}
};
let settled = false;
const settle = (result, completePercentage) => {
if (settled) return;
settled = true;
if (completePercentage !== void 0) {
options.onProgress?.({
phase: "complete",
current: 1,
total: 1,
percentage: completePercentage,
filename: cmd.filename
});
}
cleanup();
resolve(result);
};
timer = globalTimerManager.setTimeout(() => {
settle({ success: false, error: "Download timeout" }, 0);
}, cmd.timeoutMs);
try {
gmDownload({
url,
name: cmd.filename,
onload: () => {
if (false) ;
settle({ success: true, filename: cmd.filename }, 100);
},
onerror: (error) => {
const errorMsg = getErrorMessage(error);
if (false) ;
settle({ success: false, error: errorMsg }, 0);
},
ontimeout: () => {
settle({ success: false, error: "Download timeout" }, 0);
},
onprogress: (progress) => {
if (settled) return;
if (options.onProgress && progress.total > 0) {
options.onProgress({
phase: "downloading",
current: 1,
total: 1,
percentage: Math.round(progress.loaded / progress.total * 100),
filename: cmd.filename
});
}
}
});
} catch (error) {
const errorMsg = getErrorMessage(error);
settle({ success: false, error: errorMsg });
}
});
}
default:
return { success: false, error: "Unknown download command" };
}
}
async function downloadSingleFile(media, options = {}, capability) {
if (options.signal?.aborted) {
return { success: false, error: "User cancelled download" };
}
const filename = generateMediaFilename(media, { nowMs: Date.now() });
const effectiveCapability = capability ?? detectDownloadCapability();
const cmds = createSingleDownloadCommands({
method: effectiveCapability.method,
mediaUrl: media.url,
filename,
hasProvidedBlob: !!options.blob,
timeoutMs: 3e4
});
let lastOk = { success: true, filename };
for (const cmd of cmds) {
const result = await executeSingleDownloadCommand(
cmd,
options,
effectiveCapability,
options.blob
);
if (!result.success) {
return result;
}
lastOk = result;
}
return lastOk;
}
const textEncoder = new TextEncoder();
let crc32Table = null;
function ensureCRC32Table() {
if (crc32Table) {
return crc32Table;
}
const table = new Uint32Array(256);
const polynomial = 3988292384;
for (let i = 0; i < 256; i++) {
let crc = i;
for (let j = 0; j < 8; j++) {
crc = crc & 1 ? crc >>> 1 ^ polynomial : crc >>> 1;
}
table[i] = crc >>> 0;
}
crc32Table = table;
return table;
}
function encodeUtf8(value) {
return textEncoder.encode(value);
}
function calculateCRC32(data) {
const table = ensureCRC32Table();
let crc = 4294967295;
for (let i = 0; i < data.length; i++) {
crc = crc >>> 8 ^ table[(crc ^ data[i]) & 255];
}
return (crc ^ 4294967295) >>> 0;
}
function writeUint16LE(value) {
const bytes = new Uint8Array(2);
bytes[0] = value & 255;
bytes[1] = value >>> 8 & 255;
return bytes;
}
function writeUint32LE(value) {
const bytes = new Uint8Array(4);
bytes[0] = value & 255;
bytes[1] = value >>> 8 & 255;
bytes[2] = value >>> 16 & 255;
bytes[3] = value >>> 24 & 255;
return bytes;
}
const ZIP_CONST = {
MAX_UINT16: 65535,
MAX_UINT32: 4294967295,
ZIP32_ERROR: "Zip32 limit exceeded"
};
function assertZip32(condition, message) {
if (condition) return;
throw new Error(ZIP_CONST.ZIP32_ERROR);
}
const concat = (arrays) => {
let len = 0;
for (const array of arrays) len += array.length;
const result = new Uint8Array(len);
let offset = 0;
for (const array of arrays) {
result.set(array, offset);
offset += array.length;
}
return result;
};
class StreamingZipWriter {
chunks = [];
entries = [];
currentOffset = 0;
addFile(filename, data) {
assertZip32(
this.entries.length < ZIP_CONST.MAX_UINT16 - 1);
assertZip32(data.length < ZIP_CONST.MAX_UINT32);
assertZip32(
this.currentOffset < ZIP_CONST.MAX_UINT32);
const filenameBytes = encodeUtf8(filename);
const crc32 = calculateCRC32(data);
const localHeader = concat([
new Uint8Array([80, 75, 3, 4]),
writeUint16LE(20),
writeUint16LE(2048),
writeUint16LE(0),
writeUint16LE(0),
writeUint16LE(0),
writeUint32LE(crc32),
writeUint32LE(data.length),
writeUint32LE(data.length),
writeUint16LE(filenameBytes.length),
writeUint16LE(0),
filenameBytes
]);
assertZip32(
this.currentOffset + localHeader.length + data.length < ZIP_CONST.MAX_UINT32);
this.chunks.push(localHeader, data);
this.entries.push({ filename, data, offset: this.currentOffset, crc32 });
this.currentOffset += localHeader.length + data.length;
}
finalize() {
assertZip32(
this.entries.length < ZIP_CONST.MAX_UINT16);
const centralDirStart = this.currentOffset;
assertZip32(
centralDirStart < ZIP_CONST.MAX_UINT32);
const centralDirChunks = [];
for (const entry of this.entries) {
const filenameBytes = encodeUtf8(entry.filename);
assertZip32(entry.offset < ZIP_CONST.MAX_UINT32);
assertZip32(
entry.data.length < ZIP_CONST.MAX_UINT32);
centralDirChunks.push(
concat([
new Uint8Array([80, 75, 1, 2]),
writeUint16LE(20),
writeUint16LE(20),
writeUint16LE(2048),
writeUint16LE(0),
writeUint16LE(0),
writeUint16LE(0),
writeUint32LE(entry.crc32),
writeUint32LE(entry.data.length),
writeUint32LE(entry.data.length),
writeUint16LE(filenameBytes.length),
writeUint16LE(0),
writeUint16LE(0),
writeUint16LE(0),
writeUint16LE(0),
writeUint32LE(0),
writeUint32LE(entry.offset),
filenameBytes
])
);
}
const centralDir = concat(centralDirChunks);
assertZip32(
centralDir.length < ZIP_CONST.MAX_UINT32);
const endOfCentralDir = concat([
new Uint8Array([80, 75, 5, 6]),
writeUint16LE(0),
writeUint16LE(0),
writeUint16LE(this.entries.length),
writeUint16LE(this.entries.length),
writeUint32LE(centralDir.length),
writeUint32LE(centralDirStart),
writeUint16LE(0)
]);
return concat([...this.chunks, centralDir, endOfCentralDir]);
}
}
const DEFAULT_BACKOFF_BASE_MS = 200;
async function fetchArrayBufferWithRetry(url, retries, signal, backoffBaseMs = DEFAULT_BACKOFF_BASE_MS) {
if (signal?.aborted) {
throw getUserCancelledAbortErrorFromSignal(signal);
}
const httpService = HttpRequestService.getInstance();
const maxAttempts = Math.max(1, retries + 1);
const result = await withRetry(
async () => {
if (signal?.aborted) {
throw getUserCancelledAbortErrorFromSignal(signal);
}
const options = {
responseType: "arraybuffer",
timeout: 3e4,
...signal ? { signal } : {}
};
const response = await httpService.get(url, options);
if (!response.ok) {
throw new Error(`HTTP error: ${response.status}`);
}
return new Uint8Array(response.data);
},
{
maxAttempts,
baseDelayMs: backoffBaseMs,
...signal ? { signal } : {}
}
);
if (result.success) {
return result.data;
}
if (signal?.aborted) {
throw getUserCancelledAbortErrorFromSignal(signal);
}
if (isAbortError(result.error)) {
throw result.error;
}
throw result.error;
}
function ensureUniqueFilenameFactory() {
const usedNames =  new Set();
const baseCounts =  new Map();
return (desired) => {
if (!usedNames.has(desired)) {
usedNames.add(desired);
baseCounts.set(desired, 0);
return desired;
}
const lastDot = desired.lastIndexOf(".");
const name = lastDot > 0 ? desired.slice(0, lastDot) : desired;
const ext = lastDot > 0 ? desired.slice(lastDot) : "";
const baseKey = desired;
let count = baseCounts.get(baseKey) ?? 0;
while (true) {
count += 1;
const candidate = `${name}-${count}${ext}`;
if (!usedNames.has(candidate)) {
baseCounts.set(baseKey, count);
usedNames.add(candidate);
return candidate;
}
}
};
}
async function downloadAsZip(items, options = {}) {
const writer = new StreamingZipWriter();
const concurrency = Math.min(8, Math.max(1, options.concurrency ?? 6));
const retries = Math.max(0, options.retries ?? 0);
const abortSignal = options.signal;
const total = items.length;
let processed = 0;
let successful = 0;
const failures = [];
const ensureUniqueFilename = ensureUniqueFilenameFactory();
const assignedFilenames = items.map((item) => ensureUniqueFilename(item.desiredName));
let currentIndex = 0;
const runNext = async () => {
while (currentIndex < total) {
if (abortSignal?.aborted) {
throw createUserCancelledAbortError(abortSignal.reason);
}
const index = currentIndex++;
const item = items[index];
if (!item) continue;
options.onProgress?.({
phase: "downloading",
current: processed + 1,
total,
percentage: Math.min(100, Math.max(0, Math.round((processed + 1) / total * 100))),
filename: assignedFilenames[index] ?? item.desiredName
});
try {
let data;
if (item.blob) {
const blob = item.blob instanceof Promise ? await item.blob : item.blob;
if (abortSignal?.aborted) {
throw createUserCancelledAbortError(abortSignal.reason);
}
data = new Uint8Array(await blob.arrayBuffer());
} else {
data = await fetchArrayBufferWithRetry(
item.url,
retries,
abortSignal,
DEFAULT_BACKOFF_BASE_MS
);
}
if (abortSignal?.aborted) {
throw createUserCancelledAbortError(abortSignal.reason);
}
const filename = assignedFilenames[index] ?? item.desiredName;
writer.addFile(filename, data);
successful++;
} catch (error) {
if (abortSignal?.aborted) throw createUserCancelledAbortError(abortSignal.reason);
failures.push({ url: item.url, error: getErrorMessage(error) });
} finally {
processed++;
}
}
};
const workers = Array.from({ length: concurrency }, () => runNext());
await Promise.all(workers);
const zipBytes = writer.finalize();
return {
filesSuccessful: successful,
failures,
zipData: zipBytes
};
}
class DownloadOrchestrator {
lifecycle;
static singleton = createSingleton(() => new DownloadOrchestrator());
capability = null;
constructor() {
this.lifecycle = createLifecycle("DownloadOrchestrator", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
}
static getInstance() {
return DownloadOrchestrator.singleton.get();
}
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
}
onDestroy() {
this.capability = null;
}
getCapability() {
if (!this.capability) {
this.capability = detectDownloadCapability();
}
return this.capability;
}
async downloadSingle(media, options = {}) {
const capability = this.getCapability();
return downloadSingleFile(media, options, capability);
}
async downloadBulk(mediaItems, options = {}) {
const plan = planBulkDownload({
mediaItems,
prefetchedBlobs: options.prefetchedBlobs,
zipFilename: options.zipFilename,
nowMs: Date.now()
});
const items = plan.items;
try {
const result = await downloadAsZip(items, options);
if (result.filesSuccessful === 0) {
return {
success: false,
status: "error",
filesProcessed: items.length,
filesSuccessful: 0,
error: "No files downloaded",
failures: result.failures,
code: ErrorCode.ALL_FAILED
};
}
const zipBlob = new Blob([result.zipData], {
type: "application/zip"
});
const filename = plan.zipFilename;
const capability = this.getCapability();
const saveResult = await this.saveZipBlob(zipBlob, filename, options, capability);
if (!saveResult.success) {
return {
success: false,
status: "error",
filesProcessed: items.length,
filesSuccessful: result.filesSuccessful,
error: saveResult.error || "Failed to save ZIP file",
failures: result.failures,
code: ErrorCode.ALL_FAILED
};
}
return {
success: true,
status: result.filesSuccessful === items.length ? "success" : "partial",
filesProcessed: items.length,
filesSuccessful: result.filesSuccessful,
filename,
failures: result.failures,
code: ErrorCode.NONE
};
} catch (error) {
return {
success: false,
status: "error",
filesProcessed: items.length,
filesSuccessful: 0,
error: getErrorMessage(error) || "Unknown error",
code: ErrorCode.ALL_FAILED
};
}
}
async saveZipBlob(zipBlob, filename, _options, capability) {
const saveStrategy = planZipSave(capability.method);
if (saveStrategy === "gm_download" && capability.gmDownload) {
return this.saveWithGMDownload(capability.gmDownload, zipBlob, filename);
}
return { success: false, error: "No download method" };
}
async saveWithGMDownload(gmDownload, blob, filename) {
const url = URL.createObjectURL(blob);
try {
await new Promise((resolve, reject) => {
gmDownload({
url,
name: filename,
onload: () => resolve(),
onerror: (err) => reject(err),
ontimeout: () => reject(new Error("Timeout"))
});
});
return { success: true };
} catch (error) {
return {
success: false,
error: getErrorMessage(error) || "GM_download failed"
};
} finally {
URL.revokeObjectURL(url);
}
}
}
function tryGetFromCoreService(key) {
try {
const coreService = CoreService.getInstance();
if (coreService.has(key)) {
return coreService.get(key);
}
} catch (error) {
}
return null;
}
function getThemeService() {
return tryGetFromCoreService(SERVICE_KEYS.THEME) ?? ThemeService.getInstance();
}
function getLanguageService() {
return tryGetFromCoreService(SERVICE_KEYS.LANGUAGE) ?? LanguageService.getInstance();
}
function getMediaService() {
return tryGetFromCoreService(SERVICE_KEYS.MEDIA_SERVICE) ?? MediaService.getInstance();
}
function getGalleryRenderer() {
return CoreService.getInstance().get(SERVICE_KEYS.GALLERY_RENDERER);
}
async function getDownloadOrchestrator() {
const coreService = CoreService.getInstance();
if (coreService.has(SERVICE_KEYS.GALLERY_DOWNLOAD)) {
return coreService.get(SERVICE_KEYS.GALLERY_DOWNLOAD);
}
const orchestrator = DownloadOrchestrator.getInstance();
coreService.register(SERVICE_KEYS.GALLERY_DOWNLOAD, orchestrator);
return orchestrator;
}
function registerGalleryRenderer(renderer) {
CoreService.getInstance().register(SERVICE_KEYS.GALLERY_RENDERER, renderer);
}
function registerSettingsManager(settings) {
CoreService.getInstance().register(SERVICE_KEYS.SETTINGS, settings);
}
function tryGetSettingsManager() {
return CoreService.getInstance().tryGet(SERVICE_KEYS.SETTINGS);
}
const DEFAULT_SEVERITY = "error";
class AppErrorReporter {
static notificationCallback = null;
static setNotificationCallback(callback) {
AppErrorReporter.notificationCallback = callback;
}
static report(error, options) {
const severity = options.severity ?? DEFAULT_SEVERITY;
const message = normalizeErrorMessage(error);
if (options.notify && AppErrorReporter.notificationCallback) {
AppErrorReporter.notificationCallback(message, options.context);
}
const result = {
reported: true,
message,
context: options.context,
severity
};
if (severity === "critical") {
throw error instanceof Error ? error : new Error(message);
}
return result;
}
static reportAndReturn(error, options, defaultValue) {
const effectiveOptions = {
...options,
severity: options.severity === "critical" ? "error" : options.severity
};
AppErrorReporter.report(error, effectiveOptions);
return defaultValue;
}
static forContext(context) {
return {
critical: (error, options) => AppErrorReporter.report(error, { ...options, context, severity: "critical" }),
error: (error, options) => AppErrorReporter.report(error, { ...options, context, severity: "error" }),
warn: (error, options) => AppErrorReporter.report(error, { ...options, context, severity: "warning" }),
info: (error, options) => AppErrorReporter.report(error, { ...options, context, severity: "info" })
};
}
}
const bootstrapErrorReporter = AppErrorReporter.forContext("bootstrap");
const galleryErrorReporter = AppErrorReporter.forContext("gallery");
const mediaErrorReporter = AppErrorReporter.forContext("media");
const settingsErrorReporter = AppErrorReporter.forContext("settings");
class NotificationService {
static singleton = createSingleton(() => new NotificationService());
get userscript() {
return getUserscriptSafe();
}
constructor() {
}
static getInstance() {
return NotificationService.singleton.get();
}
async show(options) {
this.userscript.notification({
title: options.title,
text: options.text,
image: options.image,
timeout: options.timeout,
onclick: options.onclick
});
}
async error(title, text, timeout = 5e3) {
await this.show({ title, text, timeout });
}
}
const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const SUPPORTS_PROXY = typeof Proxy === "function";
const signalOptions = {
equals: equalFn
};
let ERROR = null;
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
owned: null,
cleanups: null,
context: null,
owner: null
};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
const listener = Listener,
owner = Owner,
unowned = fn.length === 0,
current = detachedOwner === undefined ? owner : detachedOwner,
root = unowned ? UNOWNED : {
owned: null,
cleanups: null,
context: current ? current.context : null,
owner: current
},
updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
Owner = root;
Listener = null;
try {
return runUpdates(updateFn, true);
} finally {
Listener = listener;
Owner = owner;
}
}
function createSignal(value, options) {
options = options ? Object.assign({}, signalOptions, options) : signalOptions;
const s = {
value,
observers: null,
observerSlots: null,
comparator: options.equals || undefined
};
const setter = value => {
if (typeof value === "function") {
value = value(s.value);
}
return writeSignal(s, value);
};
return [readSignal.bind(s), setter];
}
function createRenderEffect(fn, value, options) {
const c = createComputation(fn, value, false, STALE);
updateComputation(c);
}
function createEffect(fn, value, options) {
runEffects = runUserEffects;
const c = createComputation(fn, value, false, STALE);
c.user = true;
Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
options = options ? Object.assign({}, signalOptions, options) : signalOptions;
const c = createComputation(fn, value, true, 0);
c.observers = null;
c.observerSlots = null;
c.comparator = options.equals || undefined;
updateComputation(c);
return readSignal.bind(c);
}
function batch$1(fn) {
return runUpdates(fn, false);
}
function untrack(fn) {
if (Listener === null) return fn();
const listener = Listener;
Listener = null;
try {
if (ExternalSourceConfig) ;
return fn();
} finally {
Listener = listener;
}
}
function on(deps, fn, options) {
const isArray = Array.isArray(deps);
let prevInput;
let defer = options && options.defer;
return prevValue => {
let input;
if (isArray) {
input = Array(deps.length);
for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
} else input = deps();
if (defer) {
defer = false;
return prevValue;
}
const result = untrack(() => fn(input, prevInput, prevValue));
prevInput = input;
return result;
};
}
function onMount(fn) {
createEffect(() => untrack(fn));
}
function onCleanup(fn) {
if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
return fn;
}
function catchError(fn, handler) {
ERROR || (ERROR = Symbol("error"));
Owner = createComputation(undefined, undefined, true);
Owner.context = {
...Owner.context,
[ERROR]: [handler]
};
try {
return fn();
} catch (err) {
handleError(err);
} finally {
Owner = Owner.owner;
}
}
function readSignal() {
if (this.sources && (this.state)) {
if ((this.state) === STALE) updateComputation(this);else {
const updates = Updates;
Updates = null;
runUpdates(() => lookUpstream(this), false);
Updates = updates;
}
}
if (Listener) {
const sSlot = this.observers ? this.observers.length : 0;
if (!Listener.sources) {
Listener.sources = [this];
Listener.sourceSlots = [sSlot];
} else {
Listener.sources.push(this);
Listener.sourceSlots.push(sSlot);
}
if (!this.observers) {
this.observers = [Listener];
this.observerSlots = [Listener.sources.length - 1];
} else {
this.observers.push(Listener);
this.observerSlots.push(Listener.sources.length - 1);
}
}
return this.value;
}
function writeSignal(node, value, isComp) {
let current = node.value;
if (!node.comparator || !node.comparator(current, value)) {
node.value = value;
if (node.observers && node.observers.length) {
runUpdates(() => {
for (let i = 0; i < node.observers.length; i += 1) {
const o = node.observers[i];
const TransitionRunning = Transition && Transition.running;
if (TransitionRunning && Transition.disposed.has(o)) ;
if (TransitionRunning ? !o.tState : !o.state) {
if (o.pure) Updates.push(o);else Effects.push(o);
if (o.observers) markDownstream(o);
}
if (!TransitionRunning) o.state = STALE;
}
if (Updates.length > 10e5) {
Updates = [];
if (IS_DEV) ;
throw new Error();
}
}, false);
}
}
return value;
}
function updateComputation(node) {
if (!node.fn) return;
cleanNode(node);
const time = ExecCount;
runComputation(node, node.value, time);
}
function runComputation(node, value, time) {
let nextValue;
const owner = Owner,
listener = Listener;
Listener = Owner = node;
try {
nextValue = node.fn(value);
} catch (err) {
if (node.pure) {
{
node.state = STALE;
node.owned && node.owned.forEach(cleanNode);
node.owned = null;
}
}
node.updatedAt = time + 1;
return handleError(err);
} finally {
Listener = listener;
Owner = owner;
}
if (!node.updatedAt || node.updatedAt <= time) {
if (node.updatedAt != null && "observers" in node) {
writeSignal(node, nextValue);
} else node.value = nextValue;
node.updatedAt = time;
}
}
function createComputation(fn, init, pure, state = STALE, options) {
const c = {
fn,
state: state,
updatedAt: null,
owned: null,
sources: null,
sourceSlots: null,
cleanups: null,
value: init,
owner: Owner,
context: Owner ? Owner.context : null,
pure
};
if (Owner === null) ;else if (Owner !== UNOWNED) {
{
if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
}
}
return c;
}
function runTop(node) {
if ((node.state) === 0) return;
if ((node.state) === PENDING) return lookUpstream(node);
if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
const ancestors = [node];
while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
if (node.state) ancestors.push(node);
}
for (let i = ancestors.length - 1; i >= 0; i--) {
node = ancestors[i];
if ((node.state) === STALE) {
updateComputation(node);
} else if ((node.state) === PENDING) {
const updates = Updates;
Updates = null;
runUpdates(() => lookUpstream(node, ancestors[0]), false);
Updates = updates;
}
}
}
function runUpdates(fn, init) {
if (Updates) return fn();
let wait = false;
if (!init) Updates = [];
if (Effects) wait = true;else Effects = [];
ExecCount++;
try {
const res = fn();
completeUpdates(wait);
return res;
} catch (err) {
if (!wait) Effects = null;
Updates = null;
handleError(err);
}
}
function completeUpdates(wait) {
if (Updates) {
runQueue(Updates);
Updates = null;
}
if (wait) return;
const e = Effects;
Effects = null;
if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
let i,
userLength = 0;
for (i = 0; i < queue.length; i++) {
const e = queue[i];
if (!e.user) runTop(e);else queue[userLength++] = e;
}
for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
node.state = 0;
for (let i = 0; i < node.sources.length; i += 1) {
const source = node.sources[i];
if (source.sources) {
const state = source.state;
if (state === STALE) {
if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
} else if (state === PENDING) lookUpstream(source, ignore);
}
}
}
function markDownstream(node) {
for (let i = 0; i < node.observers.length; i += 1) {
const o = node.observers[i];
if (!o.state) {
o.state = PENDING;
if (o.pure) Updates.push(o);else Effects.push(o);
o.observers && markDownstream(o);
}
}
}
function cleanNode(node) {
let i;
if (node.sources) {
while (node.sources.length) {
const source = node.sources.pop(),
index = node.sourceSlots.pop(),
obs = source.observers;
if (obs && obs.length) {
const n = obs.pop(),
s = source.observerSlots.pop();
if (index < obs.length) {
n.sourceSlots[s] = index;
obs[index] = n;
source.observerSlots[index] = s;
}
}
}
}
if (node.tOwned) {
for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
delete node.tOwned;
}
if (node.owned) {
for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
node.owned = null;
}
if (node.cleanups) {
for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
node.cleanups = null;
}
node.state = 0;
}
function castError(err) {
if (err instanceof Error) return err;
return new Error(typeof err === "string" ? err : "Unknown error", {
cause: err
});
}
function runErrors(err, fns, owner) {
try {
for (const f of fns) f(err);
} catch (e) {
handleError(e, owner && owner.owner || null);
}
}
function handleError(err, owner = Owner) {
const fns = ERROR && owner && owner.context && owner.context[ERROR];
const error = castError(err);
if (!fns) throw error;
if (Effects) Effects.push({
fn() {
runErrors(error, fns, owner);
},
state: STALE
});else runErrors(error, fns, owner);
}
const FALLBACK = Symbol("fallback");
function dispose(d) {
for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
let items = [],
mapped = [],
disposers = [],
len = 0,
indexes = mapFn.length > 1 ? [] : null;
onCleanup(() => dispose(disposers));
return () => {
let newItems = list() || [],
newLen = newItems.length,
i,
j;
return untrack(() => {
let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
if (newLen === 0) {
if (len !== 0) {
dispose(disposers);
disposers = [];
items = [];
mapped = [];
len = 0;
indexes && (indexes = []);
}
if (options.fallback) {
items = [FALLBACK];
mapped[0] = createRoot(disposer => {
disposers[0] = disposer;
return options.fallback();
});
len = 1;
}
}
else if (len === 0) {
mapped = new Array(newLen);
for (j = 0; j < newLen; j++) {
items[j] = newItems[j];
mapped[j] = createRoot(mapper);
}
len = newLen;
} else {
temp = new Array(newLen);
tempdisposers = new Array(newLen);
indexes && (tempIndexes = new Array(newLen));
for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
temp[newEnd] = mapped[end];
tempdisposers[newEnd] = disposers[end];
indexes && (tempIndexes[newEnd] = indexes[end]);
}
newIndices = new Map();
newIndicesNext = new Array(newEnd + 1);
for (j = newEnd; j >= start; j--) {
item = newItems[j];
i = newIndices.get(item);
newIndicesNext[j] = i === undefined ? -1 : i;
newIndices.set(item, j);
}
for (i = start; i <= end; i++) {
item = items[i];
j = newIndices.get(item);
if (j !== undefined && j !== -1) {
temp[j] = mapped[i];
tempdisposers[j] = disposers[i];
indexes && (tempIndexes[j] = indexes[i]);
j = newIndicesNext[j];
newIndices.set(item, j);
} else disposers[i]();
}
for (j = start; j < newLen; j++) {
if (j in temp) {
mapped[j] = temp[j];
disposers[j] = tempdisposers[j];
if (indexes) {
indexes[j] = tempIndexes[j];
indexes[j](j);
}
} else mapped[j] = createRoot(mapper);
}
mapped = mapped.slice(0, len = newLen);
items = newItems.slice(0);
}
return mapped;
});
function mapper(disposer) {
disposers[j] = disposer;
if (indexes) {
const [s, set] = createSignal(j);
indexes[j] = set;
return mapFn(newItems[j], s);
}
return mapFn(newItems[j]);
}
};
}
function createComponent(Comp, props) {
return untrack(() => Comp(props || {}));
}
function trueFn() {
return true;
}
const propTraps = {
get(_, property, receiver) {
if (property === $PROXY) return receiver;
return _.get(property);
},
has(_, property) {
if (property === $PROXY) return true;
return _.has(property);
},
set: trueFn,
deleteProperty: trueFn,
getOwnPropertyDescriptor(_, property) {
return {
configurable: true,
enumerable: true,
get() {
return _.get(property);
},
set: trueFn,
deleteProperty: trueFn
};
},
ownKeys(_) {
return _.keys();
}
};
function resolveSource(s) {
return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
for (let i = 0, length = this.length; i < length; ++i) {
const v = this[i]();
if (v !== undefined) return v;
}
}
function mergeProps(...sources) {
let proxy = false;
for (let i = 0; i < sources.length; i++) {
const s = sources[i];
proxy = proxy || !!s && $PROXY in s;
sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
}
if (SUPPORTS_PROXY && proxy) {
return new Proxy({
get(property) {
for (let i = sources.length - 1; i >= 0; i--) {
const v = resolveSource(sources[i])[property];
if (v !== undefined) return v;
}
},
has(property) {
for (let i = sources.length - 1; i >= 0; i--) {
if (property in resolveSource(sources[i])) return true;
}
return false;
},
keys() {
const keys = [];
for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
return [...new Set(keys)];
}
}, propTraps);
}
const sourcesMap = {};
const defined = Object.create(null);
for (let i = sources.length - 1; i >= 0; i--) {
const source = sources[i];
if (!source) continue;
const sourceKeys = Object.getOwnPropertyNames(source);
for (let i = sourceKeys.length - 1; i >= 0; i--) {
const key = sourceKeys[i];
if (key === "__proto__" || key === "constructor") continue;
const desc = Object.getOwnPropertyDescriptor(source, key);
if (!defined[key]) {
defined[key] = desc.get ? {
enumerable: true,
configurable: true,
get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
} : desc.value !== undefined ? desc : undefined;
} else {
const sources = sourcesMap[key];
if (sources) {
if (desc.get) sources.push(desc.get.bind(source));else if (desc.value !== undefined) sources.push(() => desc.value);
}
}
}
}
const target = {};
const definedKeys = Object.keys(defined);
for (let i = definedKeys.length - 1; i >= 0; i--) {
const key = definedKeys[i],
desc = defined[key];
if (desc && desc.get) Object.defineProperty(target, key, desc);else target[key] = desc ? desc.value : undefined;
}
return target;
}
function splitProps(props, ...keys) {
const len = keys.length;
if (SUPPORTS_PROXY && $PROXY in props) {
const blocked = len > 1 ? keys.flat() : keys[0];
const res = keys.map(k => {
return new Proxy({
get(property) {
return k.includes(property) ? props[property] : undefined;
},
has(property) {
return k.includes(property) && property in props;
},
keys() {
return k.filter(property => property in props);
}
}, propTraps);
});
res.push(new Proxy({
get(property) {
return blocked.includes(property) ? undefined : props[property];
},
has(property) {
return blocked.includes(property) ? false : property in props;
},
keys() {
return Object.keys(props).filter(k => !blocked.includes(k));
}
}, propTraps));
return res;
}
const objects = [];
for (let i = 0; i <= len; i++) {
objects[i] = {};
}
for (const propName of Object.getOwnPropertyNames(props)) {
let keyIndex = len;
for (let i = 0; i < keys.length; i++) {
if (keys[i].includes(propName)) {
keyIndex = i;
break;
}
}
const desc = Object.getOwnPropertyDescriptor(props, propName);
const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
isDefaultDesc ? objects[keyIndex][propName] = desc.value : Object.defineProperty(objects[keyIndex], propName, desc);
}
return objects;
}
const narrowedError = name => `Stale read from <${name}>.`;
function For(props) {
const fallback = "fallback" in props && {
fallback: () => props.fallback
};
return createMemo(mapArray(() => props.each, props.children, fallback || undefined));
}
function Show(props) {
const keyed = props.keyed;
const conditionValue = createMemo(() => props.when, undefined, undefined);
const condition = keyed ? conditionValue : createMemo(conditionValue, undefined, {
equals: (a, b) => !a === !b
});
return createMemo(() => {
const c = condition();
if (c) {
const child = props.children;
const fn = typeof child === "function" && child.length > 0;
return fn ? untrack(() => child(keyed ? c : () => {
if (!untrack(condition)) throw narrowedError("Show");
return conditionValue();
})) : child;
}
return props.fallback;
}, undefined, undefined);
}
let Errors;
function ErrorBoundary$1(props) {
let err;
const [errored, setErrored] = createSignal(err, undefined);
Errors || (Errors = new Set());
Errors.add(setErrored);
onCleanup(() => Errors.delete(setErrored));
return createMemo(() => {
let e;
if (e = errored()) {
const f = props.fallback;
return typeof f === "function" && f.length ? untrack(() => f(e, () => setErrored())) : f;
}
return catchError(() => props.children, setErrored);
}, undefined, undefined);
}
function createSignalSafe(initial) {
const [read, write] = createSignal(initial, { equals: false });
const setSignal = write;
const subscribers =  new Set();
const notify = (value) => {
for (const subscriber of subscribers) {
subscriber(value);
}
};
const setValue = (value) => {
if (typeof value === "function") {
setSignal(() => value);
} else {
setSignal(value);
}
notify(value);
};
const updateValue = (updater) => {
const nextValue = updater(read());
setSignal(updater);
notify(nextValue);
};
const subscribe = (callback) => {
subscribers.add(callback);
callback(read());
return () => {
subscribers.delete(callback);
};
};
return {
get value() {
return read();
},
set value(v) {
setValue(v);
},
set: setValue,
update: updateValue,
subscribe
};
}
const INITIAL_NAVIGATION_STATE = {
lastSource: "auto-focus",
lastTimestamp: 0,
lastNavigatedIndex: null
};
const navigationSignals = {
lastSource: createSignalSafe(INITIAL_NAVIGATION_STATE.lastSource),
lastTimestamp: createSignalSafe(INITIAL_NAVIGATION_STATE.lastTimestamp),
lastNavigatedIndex: createSignalSafe(INITIAL_NAVIGATION_STATE.lastNavigatedIndex)
};
function resolveNowMs(nowMs) {
return nowMs ?? Date.now();
}
function isManualSource(source) {
return source === "button" || source === "keyboard";
}
function recordNavigation(targetIndex, source, nowMs) {
const timestamp = resolveNowMs(nowMs);
const currentIndex = navigationSignals.lastNavigatedIndex.value;
const currentSource = navigationSignals.lastSource.value;
const isDuplicate = targetIndex === currentIndex && isManualSource(source) && isManualSource(currentSource);
if (isDuplicate) {
navigationSignals.lastTimestamp.value = timestamp;
return { isDuplicate: true };
}
navigationSignals.lastSource.value = source;
navigationSignals.lastTimestamp.value = timestamp;
navigationSignals.lastNavigatedIndex.value = targetIndex;
return { isDuplicate: false };
}
function resetNavigation(nowMs) {
navigationSignals.lastSource.value = INITIAL_NAVIGATION_STATE.lastSource;
navigationSignals.lastTimestamp.value = resolveNowMs(nowMs);
navigationSignals.lastNavigatedIndex.value = INITIAL_NAVIGATION_STATE.lastNavigatedIndex;
}
function resolveNavigationSource(trigger) {
if (trigger === "scroll") {
return "scroll";
}
if (trigger === "keyboard") {
return "keyboard";
}
return "button";
}
const INITIAL_UI_STATE = {
viewMode: "vertical",
isLoading: false,
error: null
};
const uiSignals = {
viewMode: createSignalSafe(INITIAL_UI_STATE.viewMode),
isLoading: createSignalSafe(INITIAL_UI_STATE.isLoading),
error: createSignalSafe(INITIAL_UI_STATE.error)
};
function setError(error) {
uiSignals.error.value = error;
if (error) {
uiSignals.isLoading.value = false;
}
}
function createEventEmitter() {
const listeners =  new Map();
return {
on(event, callback) {
if (!listeners.has(event)) {
listeners.set(event,  new Set());
}
listeners.get(event).add(callback);
return () => {
listeners.get(event)?.delete(callback);
};
},
emit(event, data) {
const eventListeners = listeners.get(event);
if (!eventListeners) {
return;
}
eventListeners.forEach((callback) => {
try {
callback(data);
} catch {
}
});
},
dispose() {
listeners.clear();
}
};
}
const batch = batch$1;
const INITIAL_STATE$2 = {
isOpen: false,
mediaItems: [],
currentIndex: 0};
const galleryIndexEvents = createEventEmitter();
const gallerySignals = {
isOpen: createSignalSafe(INITIAL_STATE$2.isOpen),
mediaItems: createSignalSafe(INITIAL_STATE$2.mediaItems),
currentIndex: createSignalSafe(INITIAL_STATE$2.currentIndex),
isLoading: uiSignals.isLoading,
error: uiSignals.error,
viewMode: uiSignals.viewMode,
focusedIndex: createSignalSafe(null),
currentVideoElement: createSignalSafe(null)
};
function applyGalleryStateUpdate(state) {
batch(() => {
gallerySignals.mediaItems.value = state.mediaItems;
gallerySignals.currentIndex.value = state.currentIndex;
gallerySignals.isLoading.value = state.isLoading;
gallerySignals.error.value = state.error;
gallerySignals.viewMode.value = state.viewMode;
gallerySignals.isOpen.value = state.isOpen;
});
}
const galleryState = {
get value() {
return {
isOpen: gallerySignals.isOpen.value,
mediaItems: gallerySignals.mediaItems.value,
currentIndex: gallerySignals.currentIndex.value,
isLoading: gallerySignals.isLoading.value,
error: gallerySignals.error.value,
viewMode: gallerySignals.viewMode.value
};
},
set value(state) {
applyGalleryStateUpdate(state);
}};
function openGallery(items, startIndex = 0) {
const validIndex = clampIndex(startIndex, items.length);
galleryState.value = {
...galleryState.value,
isOpen: true,
mediaItems: items,
currentIndex: validIndex,
error: null
};
gallerySignals.focusedIndex.value = validIndex;
resetNavigation();
}
function closeGallery() {
galleryState.value = {
...galleryState.value,
isOpen: false,
currentIndex: 0,
mediaItems: [],
error: null
};
gallerySignals.focusedIndex.value = null;
gallerySignals.currentVideoElement.value = null;
resetNavigation();
}
function navigateToItem(index, trigger = "button", source) {
const state = galleryState.value;
const validIndex = clampIndex(index, state.mediaItems.length);
const navigationSource = source ?? resolveNavigationSource(trigger);
const result = recordNavigation(validIndex, navigationSource);
if (result.isDuplicate) {
gallerySignals.focusedIndex.value = validIndex;
return;
}
galleryIndexEvents.emit("navigate:start", {
from: state.currentIndex,
to: validIndex,
trigger
});
batch(() => {
galleryState.value = {
...state,
currentIndex: validIndex
};
gallerySignals.focusedIndex.value = validIndex;
});
galleryIndexEvents.emit("navigate:complete", { index: validIndex, trigger });
}
function navigatePrevious(trigger = "button") {
const state = galleryState.value;
const baseIndex = getCurrentActiveIndex();
const newIndex = baseIndex > 0 ? baseIndex - 1 : state.mediaItems.length - 1;
const source = resolveNavigationSource(trigger);
navigateToItem(newIndex, trigger, source);
}
function navigateNext(trigger = "button") {
const state = galleryState.value;
const baseIndex = getCurrentActiveIndex();
const newIndex = baseIndex < state.mediaItems.length - 1 ? baseIndex + 1 : 0;
const source = resolveNavigationSource(trigger);
navigateToItem(newIndex, trigger, source);
}
function getCurrentActiveIndex() {
return gallerySignals.focusedIndex.value ?? galleryState.value.currentIndex;
}
const videoPlaybackStateMap =  new WeakMap();
function getCurrentGalleryVideo(video) {
if (video) {
return video;
}
const signaled = gallerySignals.currentVideoElement.value;
return signaled instanceof HTMLVideoElement ? signaled : null;
}
function executeVideoControl(action, options = {}) {
const { video, context } = options;
try {
const videoElement = getCurrentGalleryVideo(video);
if (!videoElement) {
if (false) ;
return;
}
switch (action) {
case "play": {
const maybePromise = videoElement.play?.();
if (maybePromise && typeof maybePromise.then === "function") {
maybePromise.then(() => videoPlaybackStateMap.set(videoElement, { playing: true })).catch(() => {
videoPlaybackStateMap.set(videoElement, { playing: false });
if (false) ;
});
} else {
videoPlaybackStateMap.set(videoElement, { playing: true });
}
break;
}
case "pause":
videoElement.pause?.();
videoPlaybackStateMap.set(videoElement, { playing: false });
break;
case "togglePlayPause": {
const current = videoPlaybackStateMap.get(videoElement)?.playing ?? !videoElement.paused;
const next = !current;
if (next) {
const maybePromise = videoElement.play?.();
if (maybePromise && typeof maybePromise.then === "function") {
maybePromise.then(() => videoPlaybackStateMap.set(videoElement, { playing: true })).catch(() => {
videoPlaybackStateMap.set(videoElement, { playing: false });
if (false) ;
});
} else {
videoPlaybackStateMap.set(videoElement, { playing: true });
}
} else {
videoElement.pause?.();
videoPlaybackStateMap.set(videoElement, { playing: false });
}
break;
}
case "volumeUp": {
const newVolume = Math.min(1, Math.round((videoElement.volume + 0.1) * 100) / 100);
videoElement.volume = newVolume;
if (newVolume > 0 && videoElement.muted) {
videoElement.muted = false;
}
break;
}
case "volumeDown": {
const newVolume = Math.max(0, Math.round((videoElement.volume - 0.1) * 100) / 100);
videoElement.volume = newVolume;
if (newVolume === 0 && !videoElement.muted) {
videoElement.muted = true;
}
break;
}
case "mute":
videoElement.muted = true;
break;
case "toggleMute":
videoElement.muted = !videoElement.muted;
break;
}
if (false) ;
} catch (error) {
}
}
const keyboardDebounceState = {
lastExecutionTime: 0,
lastKey: ""
};
function shouldExecuteKeyboardAction(key, minIntervalMs) {
const now = Date.now();
const timeSinceLastExecution = now - keyboardDebounceState.lastExecutionTime;
if (key === keyboardDebounceState.lastKey && timeSinceLastExecution < minIntervalMs) {
return false;
}
keyboardDebounceState.lastExecutionTime = now;
keyboardDebounceState.lastKey = key;
return true;
}
function resetKeyboardDebounceState() {
keyboardDebounceState.lastExecutionTime = 0;
keyboardDebounceState.lastKey = "";
}
function checkGalleryOpen() {
return gallerySignals.isOpen.value;
}
function handleKeyboardEvent(event, handlers, options) {
if (!options.enableKeyboard) return;
try {
if (checkGalleryOpen()) {
const key = event.key;
const isNavKey = key === "Home" || key === "End" || key === "PageDown" || key === "PageUp" || key === "ArrowLeft" || key === "ArrowRight" || key === "?" || key === " " || key === "Space";
const isVideoKey = key === " " || key === "Space" || key === "ArrowUp" || key === "ArrowDown" || key === "m" || key === "M";
if (isNavKey || isVideoKey) {
event.preventDefault();
event.stopPropagation();
switch (key) {
case " ":
case "Space":
if (shouldExecuteKeyboardAction(event.key, 150)) {
executeVideoControl("togglePlayPause");
}
break;
case "ArrowLeft":
navigatePrevious("keyboard");
break;
case "ArrowRight":
navigateNext("keyboard");
break;
case "?":
if (shouldExecuteKeyboardAction(event.key, 500)) {
try {
const languageService = getLanguageService();
const title = languageService.translate("msg.kb.t");
const text = [
languageService.translate("msg.kb.prev"),
languageService.translate("msg.kb.next"),
languageService.translate("msg.kb.cls"),
languageService.translate("msg.kb.toggle")
].join("\n");
void NotificationService.getInstance().show({
title,
text,
timeout: 6e3
});
} catch {
}
}
break;
case "Home":
navigateToItem(0, "keyboard");
break;
case "End": {
const lastIndex = Math.max(0, gallerySignals.mediaItems.value.length - 1);
navigateToItem(lastIndex, "keyboard");
break;
}
case "PageDown": {
navigateToItem(
Math.min(
gallerySignals.mediaItems.value.length - 1,
gallerySignals.currentIndex.value + 5
),
"keyboard"
);
break;
}
case "PageUp": {
navigateToItem(Math.max(0, gallerySignals.currentIndex.value - 5), "keyboard");
break;
}
case "ArrowUp":
if (shouldExecuteKeyboardAction(event.key, 100)) {
executeVideoControl("volumeUp");
}
break;
case "ArrowDown":
if (shouldExecuteKeyboardAction(event.key, 100)) {
executeVideoControl("volumeDown");
}
break;
case "m":
case "M":
if (shouldExecuteKeyboardAction(event.key, 100)) {
executeVideoControl("toggleMute");
}
break;
}
if (handlers.onKeyboardEvent) {
handlers.onKeyboardEvent(event);
}
return;
}
}
if (event.key === "Escape" && checkGalleryOpen()) {
handlers.onGalleryClose();
event.preventDefault();
event.stopPropagation();
return;
}
if (handlers.onKeyboardEvent) {
handlers.onKeyboardEvent(event);
}
} catch (error) {
}
}
const VIDEO_CONTROL_DATASET_PREFIXES = [
"play",
"pause",
"mute",
"unmute",
"volume",
"slider",
"seek",
"scrub",
"progress"
];
const VIDEO_CONTROL_ROLES = ["slider", "progressbar"];
const VIDEO_CONTROL_ARIA_TOKENS = [
"volume",
"mute",
"unmute",
"seek",
"scrub",
"timeline",
"progress"
];
function createEventListener(handler) {
return (event) => {
handler(event);
};
}
function isHTMLElement(element) {
return element instanceof HTMLElement;
}
function isRecord(value) {
return typeof value === "object" && value !== null && !Array.isArray(value);
}
const GALLERY_SELECTORS = CSS.INTERNAL_SELECTORS;
const VIDEO_CONTROL_SELECTORS = [".video-controls", ".video-progress button"];
function safeClosest(element, selector) {
try {
return element.closest(selector);
} catch (error) {
return null;
}
}
function safeMatches(element, selector) {
try {
return element.matches(selector);
} catch (error) {
return false;
}
}
function containsControlToken(value, tokens) {
if (!value) {
return false;
}
const normalized = value.toLowerCase();
return tokens.some((token) => normalized.includes(token.toLowerCase()));
}
function getNearestAttributeValue(element, attribute) {
const host = safeClosest(element, `[${attribute}]`);
const value = host?.getAttribute(attribute) ?? null;
return value;
}
function isWithinVideoPlayer(element) {
return safeClosest(element, VIDEO_PLAYER_CONTEXT_SELECTOR) !== null;
}
function matchesVideoControlSelectors(element) {
return VIDEO_CONTROL_SELECTORS.some(
(selector) => safeMatches(element, selector) || safeClosest(element, selector) !== null
);
}
function isVideoControlElement(element) {
if (!isHTMLElement(element)) return false;
const tagName = element.tagName.toLowerCase();
if (tagName === "video") return true;
if (typeof element.matches !== "function") {
return false;
}
if (matchesVideoControlSelectors(element)) {
return true;
}
const dataTestId = getNearestAttributeValue(element, "data-testid");
const dataTestIdMatch = containsControlToken(dataTestId, VIDEO_CONTROL_DATASET_PREFIXES);
if (dataTestIdMatch) {
return true;
}
const ariaLabel = getNearestAttributeValue(element, "aria-label");
if (containsControlToken(ariaLabel, VIDEO_CONTROL_ARIA_TOKENS)) {
return true;
}
if (!isWithinVideoPlayer(element)) {
return false;
}
const role = element.getAttribute("role");
if (role && VIDEO_CONTROL_ROLES.includes(role.toLowerCase())) {
return true;
}
return safeMatches(element, 'input[type="range"]');
}
function isGalleryInternalElement(element) {
if (!isHTMLElement(element)) return false;
if (typeof element.matches !== "function") {
return false;
}
return GALLERY_SELECTORS.some((selector) => {
try {
return element.matches(selector) || element.closest(selector) !== null;
} catch (error) {
return false;
}
});
}
function isGalleryInternalEvent(event) {
const target = event.target;
if (!isHTMLElement(target)) return false;
return isGalleryInternalElement(target);
}
const MEDIA = {
HOSTS: {
MEDIA_CDN: ["pbs.twimg.com", "video.twimg.com"]
}};
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;
const SCHEME_WHITESPACE_REGEX = /[\u0000-\u001F\u007F\s]+/g;
const EXPLICIT_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const MAX_DECODE_ITERATIONS = 3;
const MAX_SCHEME_PROBE_LENGTH = 64;
const DEFAULT_BLOCKED_PROTOCOL_HINTS = Object.freeze([
"javascript:",
"vbscript:",
"file:",
"filesystem:",
"ms-appx:",
"ms-appx-web:",
"about:",
"intent:",
"mailto:",
"tel:",
"sms:",
"wtai:",
"chrome:",
"chrome-extension:",
"opera:",
"resource:",
"data:text",
"data:application",
"data:video",
"data:audio"
]);
function isUrlAllowed(rawUrl, policy) {
if (!rawUrl || typeof rawUrl !== "string") {
return false;
}
const normalized = rawUrl.replace(CONTROL_CHARS_REGEX, "").trim();
if (!normalized) {
return false;
}
const blockedHints = policy.blockedProtocolHints ?? DEFAULT_BLOCKED_PROTOCOL_HINTS;
if (startsWithBlockedProtocolHint(normalized, blockedHints)) {
return false;
}
const lower = normalized.toLowerCase();
if (lower.startsWith("data:")) {
return policy.allowDataUrls === true;
}
if (lower.startsWith("//")) {
return handleProtocolRelative();
}
const hasScheme = EXPLICIT_SCHEME_REGEX.test(normalized);
if (!hasScheme) {
return policy.allowRelative === true;
}
try {
const parsed = new URL(normalized);
return policy.allowedProtocols.has(parsed.protocol);
} catch {
return false;
}
}
function startsWithBlockedProtocolHint(value, hints) {
const probe = value.slice(0, MAX_SCHEME_PROBE_LENGTH);
if (/%(?![0-9A-Fa-f]{2})/.test(probe)) {
return true;
}
const variants = buildProbeVariants(probe);
return variants.some((candidate) => hints.some((hint) => candidate.startsWith(hint)));
}
function buildProbeVariants(value) {
const variants =  new Set();
const base = value.toLowerCase();
variants.add(base);
variants.add(base.replace(SCHEME_WHITESPACE_REGEX, ""));
let decoded = base;
for (let i = 0; i < MAX_DECODE_ITERATIONS; i += 1) {
try {
decoded = decodeURIComponent(decoded);
variants.add(decoded);
variants.add(decoded.replace(SCHEME_WHITESPACE_REGEX, ""));
} catch {
break;
}
}
return Array.from(variants.values());
}
function handleProtocolRelative(url, policy) {
{
return false;
}
}
const MAX_URL_LENGTH = 2048;
const ALLOWED_MEDIA_HOSTS = MEDIA.HOSTS.MEDIA_CDN;
function isValidMediaUrl(url) {
if (typeof url !== "string" || url.length > MAX_URL_LENGTH) {
return false;
}
const parsed = tryParseUrl(url);
if (!parsed) {
return false;
}
if (!isHttpProtocol(parsed.protocol)) {
return false;
}
if (!isHostMatching(parsed, ALLOWED_MEDIA_HOSTS)) {
return false;
}
return isAllowedMediaPath(parsed.hostname, parsed.pathname);
}
function isHttpProtocol(protocol) {
return protocol === "https:" || protocol === "http:";
}
function isAllowedMediaPath(hostname, pathname) {
if (hostname === "pbs.twimg.com") {
return checkPbsMediaPath(pathname);
}
if (hostname === "video.twimg.com") {
return checkVideoMediaPath(pathname);
}
return false;
}
function checkPbsMediaPath(pathname) {
return pathname.startsWith("/media/") || pathname.startsWith("/ext_tw_video_thumb/") || pathname.startsWith("/tweet_video_thumb/") || pathname.startsWith("/video_thumb/") || pathname.startsWith("/amplify_video_thumb/");
}
function checkVideoMediaPath(pathname) {
return pathname.startsWith("/ext_tw_video/") || pathname.startsWith("/tweet_video/") || pathname.startsWith("/amplify_video/") || pathname.startsWith("/dm_video/");
}
const MEDIA_LINK_SELECTORS = [
STATUS_LINK_SELECTOR,
'a[href*="/photo/"]',
'a[href*="/video/"]'
];
const MEDIA_LINK_SELECTOR = MEDIA_LINK_SELECTORS.join(", ");
const MEDIA_CONTAINER_SELECTOR = STABLE_MEDIA_CONTAINERS_SELECTORS.join(", ");
const INTERACTIVE_SELECTOR = [
"button",
"a",
'[role="button"]',
'[data-testid="like"]',
'[data-testid="retweet"]',
'[data-testid="reply"]',
'[data-testid="share"]',
'[data-testid="bookmark"]'
].join(", ");
const BLOCKED_MEDIA_CONTEXT_SELECTOR = [
'[data-testid="card.wrapper"]',
'[data-testid="twitterArticleReadView"]',
'[data-testid="longformRichTextComponent"]',
'[data-testid="twitterArticleRichTextView"]',
'[data-testid="article-cover-image"]',
...STABLE_MEDIA_VIEWERS_SELECTORS,
'[data-testid="swipe-to-dismiss"]',
'[data-testid="mask"]'
].join(", ");
function isValidMediaSource(url) {
if (!url) return false;
if (url.startsWith("blob:")) return true;
return isValidMediaUrl(url);
}
function shouldBlockMediaTrigger(target) {
if (!target) return false;
if (isVideoControlElement(target)) return true;
if (target.closest(CSS.SELECTORS.ROOT) || target.closest(CSS.SELECTORS.OVERLAY)) return true;
if (target.closest(BLOCKED_MEDIA_CONTEXT_SELECTOR)) return true;
const interactive = target.closest(INTERACTIVE_SELECTOR);
if (interactive) {
const matchesMediaLinkSelector = interactive.matches(MEDIA_LINK_SELECTOR);
if (interactive.tagName === "A" && !matchesMediaLinkSelector) {
return true;
}
const matchesMediaContainerSelector = interactive.matches(MEDIA_CONTAINER_SELECTOR);
const hasMediaContainerDescendant = interactive.querySelector(MEDIA_CONTAINER_SELECTOR) !== null;
const isMediaLink = matchesMediaLinkSelector || matchesMediaContainerSelector || hasMediaContainerDescendant;
return !isMediaLink;
}
return false;
}
function isProcessableMedia(target) {
if (!target) return false;
if (gallerySignals.isOpen.value) return false;
if (shouldBlockMediaTrigger(target)) return false;
const mediaElement = findMediaElementInDOM(target);
if (mediaElement) {
const mediaUrl = extractMediaUrlFromElement(mediaElement);
if (isValidMediaSource(mediaUrl)) {
return true;
}
}
return !!target.closest(MEDIA_CONTAINER_SELECTOR);
}
async function handleMediaClick(event, handlers, options) {
if (!options.enableMediaDetection) {
return { handled: false, reason: "Media detection disabled" };
}
const target = event.target;
if (!isHTMLElement(target)) {
return { handled: false, reason: "Invalid target (not HTMLElement)" };
}
if (gallerySignals.isOpen.value && isGalleryInternalElement(target)) {
return { handled: false, reason: "Gallery internal event" };
}
if (isVideoControlElement(target)) {
return { handled: false, reason: "Video control element" };
}
if (!isProcessableMedia(target)) {
return { handled: false, reason: "Non-processable media target" };
}
event.stopImmediatePropagation();
event.preventDefault();
await handlers.onMediaClick(target, event);
return {
handled: true,
reason: "Media click handled"
};
}
const DEFAULT_GALLERY_EVENT_OPTIONS = {
enableKeyboard: true,
enableMediaDetection: true,
debugMode: false,
preventBubbling: true,
context: "gallery"
};
const initialLifecycleState = {
initialized: false,
options: null,
handlers: null,
keyListener: null,
clickListener: null,
listenerContext: null,
eventTarget: null
};
let lifecycleState$1 = { ...initialLifecycleState };
function sanitizeContext(context) {
const trimmed = context?.trim();
return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_GALLERY_EVENT_OPTIONS.context;
}
function resolveInitializationInput(optionsOrRoot) {
if (optionsOrRoot instanceof HTMLElement) {
return {
options: { ...DEFAULT_GALLERY_EVENT_OPTIONS },
root: optionsOrRoot
};
}
const partial = optionsOrRoot ?? {};
const merged = {
...DEFAULT_GALLERY_EVENT_OPTIONS,
...partial
};
merged.context = sanitizeContext(merged.context);
return {
options: merged,
root: null
};
}
function resolveEventTarget(explicitRoot) {
return explicitRoot || document.body || document.documentElement || document;
}
async function initializeGalleryEvents(handlers, optionsOrRoot) {
if (lifecycleState$1.initialized) {
cleanupGalleryEvents();
}
if (!handlers) {
return () => {
};
}
const { options: finalOptions, root: explicitGalleryRoot } = resolveInitializationInput(optionsOrRoot);
const listenerContext = sanitizeContext(finalOptions.context);
const keyHandler = (evt) => {
const event = evt;
handleKeyboardEvent(event, handlers, finalOptions);
};
const clickHandler = async (evt) => {
const event = evt;
await handleMediaClick(event, handlers, finalOptions);
};
const target = resolveEventTarget(explicitGalleryRoot);
const listenerOptions = {
capture: true,
passive: false
};
const eventManager = EventManager.getInstance();
if (finalOptions.enableKeyboard) {
eventManager.addListener(target, "keydown", keyHandler, listenerOptions, listenerContext);
}
if (finalOptions.enableMediaDetection) {
eventManager.addListener(target, "click", clickHandler, listenerOptions, listenerContext);
}
resetKeyboardDebounceState();
lifecycleState$1 = {
initialized: true,
options: finalOptions,
handlers,
keyListener: keyHandler,
clickListener: clickHandler,
listenerContext,
eventTarget: target
};
return () => {
cleanupGalleryEvents();
};
}
function cleanupGalleryEvents() {
if (!lifecycleState$1.initialized) {
return;
}
if (lifecycleState$1.listenerContext) {
EventManager.getInstance().removeByContext(lifecycleState$1.listenerContext);
}
resetKeyboardDebounceState();
lifecycleState$1 = { ...initialLifecycleState };
}
const ZERO_RESULT = Object.freeze({
pausedCount: 0,
totalCandidates: 0,
skippedCount: 0
});
function resolveRoot(root) {
if (root && typeof root.querySelectorAll === "function") return root;
return typeof document !== "undefined" && typeof document.querySelectorAll === "function" ? document : null;
}
function isVideoPlaying(video) {
try {
return !video.paused && !video.ended;
} catch {
return false;
}
}
function shouldPauseVideo(video, force = false) {
return video instanceof HTMLVideoElement && !isGalleryInternalElement(video) && video.isConnected && (force || isVideoPlaying(video));
}
function tryPauseVideo(video) {
try {
video.pause?.();
return true;
} catch (error) {
return false;
}
}
function pauseActiveTwitterVideos(options = {}) {
const root = resolveRoot(options.root ?? null);
if (!root) return ZERO_RESULT;
const videos = Array.from(root.querySelectorAll("video"));
const inspectedCount = videos.length;
if (inspectedCount === 0) return ZERO_RESULT;
let pausedCount = 0;
let totalCandidates = 0;
for (const video of videos) {
if (!shouldPauseVideo(video, options.force)) {
continue;
}
totalCandidates += 1;
if (tryPauseVideo(video)) {
pausedCount += 1;
}
}
const result = {
pausedCount,
totalCandidates,
skippedCount: inspectedCount - pausedCount
};
return result;
}
const VIDEO_TRIGGER_SCOPES =  new Set([
VIDEO_PLAYER_SELECTOR,
...STABLE_VIDEO_CONTAINERS_SELECTORS
]);
const IMAGE_TRIGGER_SCOPES =  new Set([
TWEET_PHOTO_SELECTOR,
...STABLE_IMAGE_CONTAINERS_SELECTORS
]);
const PAUSE_RESULT_DEFAULT = Object.freeze({
pausedCount: 0,
totalCandidates: 0,
skippedCount: 0
});
function findTweetContainer(element) {
if (!element) {
return null;
}
return closestWithFallback(element, STABLE_TWEET_CONTAINERS_SELECTORS);
}
function resolvePauseContext(request) {
if (request.root !== void 0) {
return {
root: request.root ?? null,
scope: "custom"
};
}
const tweetContainer = findTweetContainer(request.sourceElement);
if (tweetContainer) {
return {
root: null,
scope: "tweet"
};
}
return {
root: null,
scope: "document"
};
}
function isVideoTriggerElement(element) {
if (!element) return false;
if (element.tagName === "VIDEO") return true;
const selectors = Array.from(VIDEO_TRIGGER_SCOPES);
for (const selector of selectors) {
try {
if (element.matches(selector)) {
return true;
}
} catch {
}
}
return closestWithFallback(element, selectors) !== null;
}
function isImageTriggerElement(element) {
if (!element) return false;
if (element.tagName === "IMG") return true;
const selectors = Array.from(IMAGE_TRIGGER_SCOPES);
for (const selector of selectors) {
try {
if (element.matches(selector)) {
return true;
}
} catch {
}
}
return closestWithFallback(element, selectors) !== null;
}
function inferAmbientVideoTrigger(element) {
if (isVideoTriggerElement(element)) {
return "video-click";
}
if (isImageTriggerElement(element)) {
return "image-click";
}
return "unknown";
}
function pauseAmbientVideosForGallery(request = {}) {
const trigger = request.trigger ?? inferAmbientVideoTrigger(request.sourceElement);
const force = request.force ?? true;
const reason = request.reason ?? trigger;
const { root, scope } = resolvePauseContext(request);
let result;
try {
result = pauseActiveTwitterVideos({
root,
force
});
} catch (error) {
return {
...PAUSE_RESULT_DEFAULT,
trigger,
forced: force,
reason,
scope
};
}
return {
...result,
trigger,
forced: force,
reason,
scope
};
}
let guardDispose = null;
let guardSubscribers = 0;
function ensureGuardEffect() {
if (guardDispose) {
return;
}
guardDispose = gallerySignals.isOpen.subscribe((isOpen) => {
if (!isOpen) return;
const result = pauseAmbientVideosForGallery({ trigger: "guard", reason: "guard" });
if (result.pausedCount <= 0) {
return;
}
});
}
function startAmbientVideoGuard() {
guardSubscribers += 1;
ensureGuardEffect();
return () => {
stopAmbientVideoGuard();
};
}
function stopAmbientVideoGuard() {
if (guardSubscribers === 0) {
return;
}
guardSubscribers -= 1;
if (guardSubscribers > 0) {
return;
}
guardDispose?.();
guardDispose = null;
}
class GalleryApp {
galleryRenderer = null;
isInitialized = false;
notificationService = NotificationService.getInstance();
ambientVideoGuardDispose = null;
constructor() {
}
async initialize() {
try {
this.galleryRenderer = getGalleryRenderer();
this.galleryRenderer?.setOnCloseCallback(() => this.closeGallery());
await this.setupEventHandlers();
this.ambientVideoGuardDispose = this.ambientVideoGuardDispose ?? startAmbientVideoGuard();
this.isInitialized = true;
} catch (error) {
galleryErrorReporter.critical(error, {
code: "GALLERY_APP_INIT_FAILED"
});
}
}
async setupEventHandlers() {
try {
const settingsService = tryGetSettingsManager();
const enableKeyboard = settingsService?.get("gallery.enableKeyboardNav") ?? true;
await initializeGalleryEvents(
{
onMediaClick: (element, event) => this.handleMediaClick(element, event),
onGalleryClose: () => this.closeGallery(),
onKeyboardEvent: (event) => {
if (event.key === "Escape" && gallerySignals.isOpen.value) {
this.closeGallery();
}
}
},
{
enableKeyboard,
enableMediaDetection: true,
debugMode: false,
preventBubbling: true,
context: "gallery"
}
);
} catch (error) {
galleryErrorReporter.critical(error, {
code: "EVENT_HANDLERS_SETUP_FAILED"
});
}
}
async handleMediaClick(element, _event) {
try {
const mediaService = getMediaService();
const result = await mediaService.extractFromClickedElement(element);
if (result.success && result.mediaItems.length > 0) {
await this.openGallery(result.mediaItems, result.clickedIndex, {
pauseContext: {
sourceElement: element,
reason: "media-click"
}
});
} else {
mediaErrorReporter.warn(new Error("Media extraction returned no items"), {
code: "MEDIA_EXTRACTION_EMPTY",
metadata: { success: result.success }
});
this.notificationService.error("Failed to load media", "Could not find images or videos.");
}
} catch (error) {
mediaErrorReporter.error(error, {
code: "MEDIA_EXTRACTION_ERROR",
notify: true
});
this.notificationService.error("Error occurred", getErrorMessage(error) || "Unknown error");
}
}
async openGallery(mediaItems, startIndex = 0, options = {}) {
if (!this.isInitialized) {
this.notificationService.error("Gallery unavailable", "Userscript manager required.");
return;
}
if (!mediaItems?.length) return;
try {
const validIndex = clampIndex(startIndex, mediaItems.length);
const providedContext = options.pauseContext ?? null;
const pauseContext = {
...providedContext,
reason: providedContext?.reason ?? (providedContext ? "media-click" : "programmatic")
};
try {
pauseAmbientVideosForGallery(pauseContext);
} catch (error) {
}
openGallery(mediaItems, validIndex);
} catch (error) {
galleryErrorReporter.error(error, {
code: "GALLERY_OPEN_FAILED",
metadata: { itemCount: mediaItems.length, startIndex },
notify: true
});
this.notificationService.error(
"Failed to load gallery",
getErrorMessage(error) || "Unknown error"
);
throw error;
}
}
closeGallery() {
try {
if (gallerySignals.isOpen.value) {
closeGallery();
}
} catch (error) {
galleryErrorReporter.error(error, {
code: "GALLERY_CLOSE_FAILED"
});
}
}
async cleanup() {
try {
if (gallerySignals.isOpen.value) {
this.closeGallery();
}
this.ambientVideoGuardDispose?.();
this.ambientVideoGuardDispose = null;
try {
cleanupGalleryEvents();
} catch (error) {
}
this.galleryRenderer = null;
this.isInitialized = false;
delete globalThis.xegGalleryDebug;
} catch (error) {
galleryErrorReporter.error(error, {
code: "GALLERY_CLEANUP_FAILED"
});
}
}
}
const memo = fn => createMemo(() => fn());
function reconcileArrays(parentNode, a, b) {
let bLength = b.length,
aEnd = a.length,
bEnd = bLength,
aStart = 0,
bStart = 0,
after = a[aEnd - 1].nextSibling,
map = null;
while (aStart < aEnd || bStart < bEnd) {
if (a[aStart] === b[bStart]) {
aStart++;
bStart++;
continue;
}
while (a[aEnd - 1] === b[bEnd - 1]) {
aEnd--;
bEnd--;
}
if (aEnd === aStart) {
const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
} else if (bEnd === bStart) {
while (aStart < aEnd) {
if (!map || !map.has(a[aStart])) a[aStart].remove();
aStart++;
}
} else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
const node = a[--aEnd].nextSibling;
parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
parentNode.insertBefore(b[--bEnd], node);
a[aEnd] = b[bEnd];
} else {
if (!map) {
map = new Map();
let i = bStart;
while (i < bEnd) map.set(b[i], i++);
}
const index = map.get(a[aStart]);
if (index != null) {
if (bStart < index && index < bEnd) {
let i = aStart,
sequence = 1,
t;
while (++i < aEnd && i < bEnd) {
if ((t = map.get(a[i])) == null || t !== index + sequence) break;
sequence++;
}
if (sequence > index - bStart) {
const node = a[aStart];
while (bStart < index) parentNode.insertBefore(b[bStart++], node);
} else parentNode.replaceChild(b[bStart++], a[aStart++]);
} else aStart++;
} else a[aStart++].remove();
}
}
}
const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
let disposer;
createRoot(dispose => {
disposer = dispose;
element === document ? code() : insert(element, code(), element.firstChild ? null : undefined, init);
}, options.owner);
return () => {
disposer();
element.textContent = "";
};
}
function template(html, isImportNode, isSVG, isMathML) {
let node;
const create = () => {
const t = isMathML ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
t.innerHTML = html;
return isSVG ? t.content.firstChild.firstChild : isMathML ? t.firstChild : t.content.firstChild;
};
const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
fn.cloneNode = fn;
return fn;
}
function delegateEvents(eventNames, document = window.document) {
const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
for (let i = 0, l = eventNames.length; i < l; i++) {
const name = eventNames[i];
if (!e.has(name)) {
e.add(name);
document.addEventListener(name, eventHandler);
}
}
}
function setAttribute(node, name, value) {
if (value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function className(node, value) {
if (value == null) node.removeAttribute("class");else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
if (delegate) {
if (Array.isArray(handler)) {
node[`$$${name}`] = handler[0];
node[`$$${name}Data`] = handler[1];
} else node[`$$${name}`] = handler;
} else if (Array.isArray(handler)) {
const handlerFn = handler[0];
node.addEventListener(name, handler[0] = e => handlerFn.call(node, handler[1], e));
} else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function style(node, value, prev) {
if (!value) return prev ? setAttribute(node, "style") : value;
const nodeStyle = node.style;
if (typeof value === "string") return nodeStyle.cssText = value;
typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
prev || (prev = {});
value || (value = {});
let v, s;
for (s in prev) {
value[s] == null && nodeStyle.removeProperty(s);
delete prev[s];
}
for (s in value) {
v = value[s];
if (v !== prev[s]) {
nodeStyle.setProperty(s, v);
prev[s] = v;
}
}
return prev;
}
function setStyleProperty(node, name, value) {
value != null ? node.style.setProperty(name, value) : node.style.removeProperty(name);
}
function use(fn, element, arg) {
return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
if (marker !== undefined && !initial) initial = [];
if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function eventHandler(e) {
let node = e.target;
const key = `$$${e.type}`;
const oriTarget = e.target;
const oriCurrentTarget = e.currentTarget;
const retarget = value => Object.defineProperty(e, "target", {
configurable: true,
value
});
const handleNode = () => {
const handler = node[key];
if (handler && !node.disabled) {
const data = node[`${key}Data`];
data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
if (e.cancelBubble) return;
}
node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
return true;
};
const walkUpTree = () => {
while (handleNode() && (node = node._$host || node.parentNode || node.host));
};
Object.defineProperty(e, "currentTarget", {
configurable: true,
get() {
return node || document;
}
});
if (e.composedPath) {
const path = e.composedPath();
retarget(path[0]);
for (let i = 0; i < path.length - 2; i++) {
node = path[i];
if (!handleNode()) break;
if (node._$host) {
node = node._$host;
walkUpTree();
break;
}
if (node.parentNode === oriCurrentTarget) {
break;
}
}
}
else walkUpTree();
retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
while (typeof current === "function") current = current();
if (value === current) return current;
const t = typeof value,
multi = marker !== undefined;
parent = multi && current[0] && current[0].parentNode || parent;
if (t === "string" || t === "number") {
if (t === "number") {
value = value.toString();
if (value === current) return current;
}
if (multi) {
let node = current[0];
if (node && node.nodeType === 3) {
node.data !== value && (node.data = value);
} else node = document.createTextNode(value);
current = cleanChildren(parent, current, marker, node);
} else {
if (current !== "" && typeof current === "string") {
current = parent.firstChild.data = value;
} else current = parent.textContent = value;
}
} else if (value == null || t === "boolean") {
current = cleanChildren(parent, current, marker);
} else if (t === "function") {
createRenderEffect(() => {
let v = value();
while (typeof v === "function") v = v();
current = insertExpression(parent, v, current, marker);
});
return () => current;
} else if (Array.isArray(value)) {
const array = [];
const currentArray = current && Array.isArray(current);
if (normalizeIncomingArray(array, value, current, unwrapArray)) {
createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
return () => current;
}
if (array.length === 0) {
current = cleanChildren(parent, current, marker);
if (multi) return current;
} else if (currentArray) {
if (current.length === 0) {
appendNodes(parent, array, marker);
} else reconcileArrays(parent, current, array);
} else {
current && cleanChildren(parent);
appendNodes(parent, array);
}
current = array;
} else if (value.nodeType) {
if (Array.isArray(current)) {
if (multi) return current = cleanChildren(parent, current, marker, value);
cleanChildren(parent, current, null, value);
} else if (current == null || current === "" || !parent.firstChild) {
parent.appendChild(value);
} else parent.replaceChild(value, parent.firstChild);
current = value;
} else ;
return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
let dynamic = false;
for (let i = 0, len = array.length; i < len; i++) {
let item = array[i],
prev = current && current[normalized.length],
t;
if (item == null || item === true || item === false) ; else if ((t = typeof item) === "object" && item.nodeType) {
normalized.push(item);
} else if (Array.isArray(item)) {
dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
} else if (t === "function") {
if (unwrap) {
while (typeof item === "function") item = item();
dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
} else {
normalized.push(item);
dynamic = true;
}
} else {
const value = String(item);
if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);else normalized.push(document.createTextNode(value));
}
}
return dynamic;
}
function appendNodes(parent, array, marker = null) {
for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
if (marker === undefined) return parent.textContent = "";
const node = replacement || document.createTextNode("");
if (current.length) {
let inserted = false;
for (let i = current.length - 1; i >= 0; i--) {
const el = current[i];
if (node !== el) {
const isParent = el.parentNode === parent;
if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
} else inserted = true;
}
} else parent.insertBefore(node, marker);
return [node];
}
var _tmpl$$9 =  template(`<button>`);
function IconButton(props) {
return (() => {
var _el$ = _tmpl$$9();
addEventListener(_el$, "click", props.onClick, true);
addEventListener(_el$, "mousedown", props.onMouseDown, true);
var _ref$ = props.ref;
typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
insert(_el$, () => props.children);
createRenderEffect((_p$) => {
var _v$ = props.id, _v$2 = props.type ?? "button", _v$3 = cx(props.class), _v$4 = props.title, _v$5 = props.disabled, _v$6 = props.tabIndex, _v$7 = props["data-testid"], _v$8 = props["aria-label"], _v$9 = props["aria-controls"], _v$0 = props["aria-expanded"], _v$1 = props["aria-pressed"], _v$10 = props["aria-busy"];
_v$ !== _p$.e && setAttribute(_el$, "id", _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$, "type", _p$.t = _v$2);
_v$3 !== _p$.a && className(_el$, _p$.a = _v$3);
_v$4 !== _p$.o && setAttribute(_el$, "title", _p$.o = _v$4);
_v$5 !== _p$.i && (_el$.disabled = _p$.i = _v$5);
_v$6 !== _p$.n && setAttribute(_el$, "tabindex", _p$.n = _v$6);
_v$7 !== _p$.s && setAttribute(_el$, "data-testid", _p$.s = _v$7);
_v$8 !== _p$.h && setAttribute(_el$, "aria-label", _p$.h = _v$8);
_v$9 !== _p$.r && setAttribute(_el$, "aria-controls", _p$.r = _v$9);
_v$0 !== _p$.d && setAttribute(_el$, "aria-expanded", _p$.d = _v$0);
_v$1 !== _p$.l && setAttribute(_el$, "aria-pressed", _p$.l = _v$1);
_v$10 !== _p$.u && setAttribute(_el$, "aria-busy", _p$.u = _v$10);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0,
n: void 0,
s: void 0,
h: void 0,
r: void 0,
d: void 0,
l: void 0,
u: void 0
});
return _el$;
})();
}
delegateEvents(["mousedown", "click"]);
var _tmpl$$8 =  template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=none stroke="var(--xeg-icon-color, currentColor)"stroke-width=var(--xeg-icon-stroke-width) stroke-linecap=round stroke-linejoin=round>`);
function Icon({
size = "var(--xeg-icon-size)",
class: className = "",
children,
"aria-label": ariaLabel
}) {
const sizeValue = typeof size === "number" ? `${size}px` : size;
return (() => {
var _el$ = _tmpl$$8();
setAttribute(_el$, "width", sizeValue);
setAttribute(_el$, "height", sizeValue);
setAttribute(_el$, "class", className);
setAttribute(_el$, "role", ariaLabel ? "img" : void 0);
setAttribute(_el$, "aria-label", ariaLabel);
setAttribute(_el$, "aria-hidden", ariaLabel ? void 0 : "true");
insert(_el$, children);
return _el$;
})();
}
const LUCIDE_ICON_NODES = {
"chevron-left": [["path", { d: "m15 18-6-6 6-6" }]],
"chevron-right": [["path", { d: "m9 18 6-6-6-6" }]],
download: [
["path", { d: "M12 15V3" }],
["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
["path", { d: "m7 10 5 5 5-5" }]
],
"folder-down": [
[
"path",
{
d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
}
],
["path", { d: "M12 10v6" }],
["path", { d: "m15 13-3 3-3-3" }]
],
"maximize-2": [
["path", { d: "M15 3h6v6" }],
["path", { d: "m21 3-7 7" }],
["path", { d: "m3 21 7-7" }],
["path", { d: "M9 21H3v-6" }]
],
"minimize-2": [
["path", { d: "m14 10 7-7" }],
["path", { d: "M20 10h-6V4" }],
["path", { d: "m3 21 7-7" }],
["path", { d: "M4 14h6v6" }]
],
"move-horizontal": [
["path", { d: "m18 8 4 4-4 4" }],
["path", { d: "M2 12h20" }],
["path", { d: "m6 8-4 4 4 4" }]
],
"move-vertical": [
["path", { d: "M12 2v20" }],
["path", { d: "m8 18 4 4 4-4" }],
["path", { d: "m8 6 4-4 4 4" }]
],
"settings-2": [
["path", { d: "M14 17H5" }],
["path", { d: "M19 7h-9" }],
["circle", { cx: 17, cy: 17, r: 3 }],
["circle", { cx: 7, cy: 7, r: 3 }]
],
"messages-square": [
[
"path",
{
d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
}
],
[
"path",
{
d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"
}
]
],
"external-link": [
["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }],
["path", { d: "m15 3 6 6" }],
["path", { d: "M10 14 21 3" }]
],
x: [
["path", { d: "M18 6 6 18" }],
["path", { d: "m6 6 12 12" }]
]
};
var _tmpl$$7 =  template(`<svg><path></svg>`, false, true, false), _tmpl$2$4 =  template(`<svg><circle></svg>`, false, true, false);
const renderNode = (node) => {
const [tag, attrs] = node;
switch (tag) {
case "path":
return (() => {
var _el$ = _tmpl$$7();
createRenderEffect(() => setAttribute(_el$, "d", String(attrs.d ?? "")));
return _el$;
})();
case "circle":
return (() => {
var _el$2 = _tmpl$2$4();
createRenderEffect((_p$) => {
var _v$ = String(attrs.cx ?? ""), _v$2 = String(attrs.cy ?? ""), _v$3 = String(attrs.r ?? "");
_v$ !== _p$.e && setAttribute(_el$2, "cx", _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$2, "cy", _p$.t = _v$2);
_v$3 !== _p$.a && setAttribute(_el$2, "r", _p$.a = _v$3);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0
});
return _el$2;
})();
default: {
const exhaustive = tag;
return exhaustive;
}
}
};
function LucideIcon(props) {
const nodes = LUCIDE_ICON_NODES[props.name];
return createComponent(Icon, {
get size() {
return props.size;
},
get ["class"]() {
return props.class;
},
get ["aria-label"]() {
return props["aria-label"];
},
get children() {
return nodes.map(renderNode);
}
});
}
function resolve(value) {
return typeof value === "function" ? value() : value;
}
function resolveOptional(value) {
if (value === void 0) {
return void 0;
}
return resolve(value);
}
function toAccessor(value) {
return typeof value === "function" ? value : () => value;
}
function toRequiredAccessor(resolver, fallback) {
return () => {
const value = resolver();
const resolved = resolveOptional(value);
return resolved ?? fallback;
};
}
function toOptionalAccessor(resolver) {
return () => resolveOptional(resolver());
}
const body = "xg-EeSh";
const bodyCompact = "xg-nm9B";
const setting = "xg-PI5C";
const settingCompact = "xg-VUTt";
const label = "xg-vhT3";
const compactLabel = "xg-Y62M";
const select = "xg-jpiS";
const styles$3 = {
body: body,
bodyCompact: bodyCompact,
setting: setting,
settingCompact: settingCompact,
label: label,
compactLabel: compactLabel,
select: select
};
var _tmpl$$6 =  template(`<div><div><label></label><select></select></div><div><label></label><select>`), _tmpl$2$3 =  template(`<option>`);
const THEME_OPTIONS = ["auto", "light", "dark"];
const LANGUAGE_OPTIONS = ["auto", "ko", "en", "ja"];
function SettingsControls(props) {
const languageService = getLanguageService();
const [revision, setRevision] = createSignal(0);
onMount(() => {
const unsubscribe = languageService.onLanguageChange(() => setRevision((v) => v + 1));
onCleanup(unsubscribe);
});
const strings = createMemo(() => {
revision();
return {
theme: {
title: languageService.translate("st.th"),
labels: {
auto: languageService.translate("st.thAuto"),
light: languageService.translate("st.thLt"),
dark: languageService.translate("st.thDk")
}
},
language: {
title: languageService.translate("st.lang"),
labels: {
auto: languageService.translate("st.langAuto"),
ko: languageService.translate("st.langKo"),
en: languageService.translate("st.langEn"),
ja: languageService.translate("st.langJa")
}
}
};
});
const selectClass = cx("xeg-inline-center", styles$3.select);
const containerClass = cx(styles$3.body, props.compact && styles$3.bodyCompact);
const settingClass = cx(styles$3.setting, props.compact && styles$3.settingCompact);
const labelClass = cx(styles$3.label, props.compact && styles$3.compactLabel);
const themeValue = createMemo(() => resolve(props.currentTheme));
const languageValue = createMemo(() => resolve(props.currentLanguage));
const themeSelectId = props["data-testid"] ? `${props["data-testid"]}-theme-select` : "settings-theme-select";
const languageSelectId = props["data-testid"] ? `${props["data-testid"]}-language-select` : "settings-language-select";
const themeStrings = () => strings().theme;
const languageStrings = () => strings().language;
return (() => {
var _el$ = _tmpl$$6(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling;
className(_el$, containerClass);
className(_el$2, settingClass);
setAttribute(_el$3, "for", themeSelectId);
className(_el$3, labelClass);
insert(_el$3, () => themeStrings().title);
addEventListener(_el$4, "change", props.onThemeChange);
setAttribute(_el$4, "id", themeSelectId);
className(_el$4, selectClass);
insert(_el$4, () => THEME_OPTIONS.map((option) => (() => {
var _el$8 = _tmpl$2$3();
_el$8.value = option;
insert(_el$8, () => themeStrings().labels[option]);
return _el$8;
})()));
className(_el$5, settingClass);
setAttribute(_el$6, "for", languageSelectId);
className(_el$6, labelClass);
insert(_el$6, () => languageStrings().title);
addEventListener(_el$7, "change", props.onLanguageChange);
setAttribute(_el$7, "id", languageSelectId);
className(_el$7, selectClass);
insert(_el$7, () => LANGUAGE_OPTIONS.map((option) => (() => {
var _el$9 = _tmpl$2$3();
_el$9.value = option;
insert(_el$9, () => languageStrings().labels[option]);
return _el$9;
})()));
createRenderEffect((_p$) => {
var _v$ = void 0, _v$2 = themeStrings().title, _v$3 = themeStrings().title, _v$4 = void 0, _v$5 = languageStrings().title, _v$6 = languageStrings().title, _v$7 = void 0;
_v$ !== _p$.e && setAttribute(_el$, "data-testid", _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$4, "aria-label", _p$.t = _v$2);
_v$3 !== _p$.a && setAttribute(_el$4, "title", _p$.a = _v$3);
_v$4 !== _p$.o && setAttribute(_el$4, "data-testid", _p$.o = _v$4);
_v$5 !== _p$.i && setAttribute(_el$7, "aria-label", _p$.i = _v$5);
_v$6 !== _p$.n && setAttribute(_el$7, "title", _p$.n = _v$6);
_v$7 !== _p$.s && setAttribute(_el$7, "data-testid", _p$.s = _v$7);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0,
n: void 0,
s: void 0
});
createRenderEffect(() => _el$4.value = themeValue());
createRenderEffect(() => _el$7.value = languageValue());
return _el$;
})();
}
function useTranslation() {
const languageService = getLanguageService();
const [revision, setRevision] = createSignal(0);
const unsubscribe = languageService.onLanguageChange(() => {
setRevision((value) => value + 1);
});
onCleanup(() => {
unsubscribe();
});
return (key, params) => {
revision();
return languageService.translate(key, params);
};
}
function safeEventPrevent(event) {
if (!event) return;
event.preventDefault();
event.stopPropagation();
}
function safeEventPreventAll(event) {
if (!event) return;
event.preventDefault();
event.stopPropagation();
event.stopImmediatePropagation();
}
function findScrollableAncestor(target, scrollableSelector) {
if (!(target instanceof HTMLElement)) {
return null;
}
return target.closest(scrollableSelector);
}
function canConsumeWheelEvent(element, deltaY, tolerance = 1) {
const overflow = element.scrollHeight - element.clientHeight;
if (overflow <= tolerance) {
return false;
}
if (deltaY < 0) {
return element.scrollTop > tolerance;
}
if (deltaY > 0) {
const maxScrollTop = overflow;
return element.scrollTop < maxScrollTop - tolerance;
}
return true;
}
function shouldAllowWheelDefault$1(event, options) {
const scrollable = findScrollableAncestor(event.target, options.scrollableSelector);
if (!scrollable) {
return false;
}
return canConsumeWheelEvent(scrollable, event.deltaY, options.tolerance);
}
const toolbarButton = "xg-4eoj";
const galleryToolbar = "xg-fLg7";
const settingsExpanded = "xg-ZpP8";
const tweetPanelExpanded = "xg-t4eq";
const stateIdle = "xg-ojCW";
const stateLoading = "xg-Y6KF";
const stateDownloading = "xg-n-ab";
const stateError = "xg-bEzl";
const toolbarContent = "xg-f8g4";
const toolbarControls = "xg-Ix3j";
const counterBlock = "xg-0EHq";
const separator = "xg-FKnO";
const downloadCurrent = "xg-njlf";
const downloadAll = "xg-AU-d";
const closeButton = "xg-Vn14";
const downloadButton = "xg-atmJ";
const mediaCounterWrapper = "xg-GG86";
const mediaCounter = "xg-2cjm";
const currentIndex = "xg-JEXm";
const totalCount = "xg-d1et";
const progressBar = "xg-vB6N";
const progressFill = "xg-LWQw";
const fitButton = "xg-Q7dU";
const settingsPanel = "xg-JcF-";
const tweetPanel = "xg-yRtv";
const panelExpanded = "xg-4a2L";
const tweetPanelBody = "xg-w56C";
const tweetTextHeader = "xg-rSWg";
const tweetTextLabel = "xg-jd-V";
const tweetContent = "xg-jmjG";
const tweetUrlSection = "xg-0Eeq";
const tweetUrlLink = "xg-AVKe";
const tweetUrlIcon = "xg-5RjR";
const tweetUrlLabel = "xg-8Stf";
const tweetUrlValue = "xg-3pwZ";
const tweetUrlDivider = "xg-sltl";
const styles$2 = {
toolbarButton: toolbarButton,
galleryToolbar: galleryToolbar,
settingsExpanded: settingsExpanded,
tweetPanelExpanded: tweetPanelExpanded,
stateIdle: stateIdle,
stateLoading: stateLoading,
stateDownloading: stateDownloading,
stateError: stateError,
toolbarContent: toolbarContent,
toolbarControls: toolbarControls,
counterBlock: counterBlock,
separator: separator,
downloadCurrent: downloadCurrent,
downloadAll: downloadAll,
closeButton: closeButton,
downloadButton: downloadButton,
mediaCounterWrapper: mediaCounterWrapper,
mediaCounter: mediaCounter,
currentIndex: currentIndex,
totalCount: totalCount,
progressBar: progressBar,
progressFill: progressFill,
fitButton: fitButton,
settingsPanel: settingsPanel,
tweetPanel: tweetPanel,
panelExpanded: panelExpanded,
tweetPanelBody: tweetPanelBody,
tweetTextHeader: tweetTextHeader,
tweetTextLabel: tweetTextLabel,
tweetContent: tweetContent,
tweetUrlSection: tweetUrlSection,
tweetUrlLink: tweetUrlLink,
tweetUrlIcon: tweetUrlIcon,
tweetUrlLabel: tweetUrlLabel,
tweetUrlValue: tweetUrlValue,
tweetUrlDivider: tweetUrlDivider
};
var _tmpl$$5 =  template(`<a target=_blank rel="noopener noreferrer">`), _tmpl$2$2 =  template(`<div><a target=_blank rel="noopener noreferrer"><span></span><span>`), _tmpl$3$1 =  template(`<div><div><span></div><div data-gallery-scrollable=true><span>`), _tmpl$4$1 =  template(`<div>`);
const TWEET_TEXT_URL_POLICY = {
allowedProtocols:  new Set(["http:", "https:"]),
allowRelative: false,
allowProtocolRelative: false,
allowFragments: false,
allowDataUrls: false
};
const LINK_PATTERN = /https?:\/\/[^\s]+|(?<![\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu;
const URL_TRAILING_PUNCTUATION = /[),.!?:;\]]+$/;
const PROTOCOL_PREFIX = /^https?:\/\//;
const buildHashtagUrl = (tag) => `https://x.com/hashtag/${encodeURIComponent(tag)}`;
const splitUrlTrailingPunctuation = (value) => {
const match = value.match(URL_TRAILING_PUNCTUATION);
if (!match) {
return {
url: value,
trailing: ""
};
}
const trailing = match[0] ?? "";
const url = value.slice(0, Math.max(0, value.length - trailing.length));
return {
url,
trailing
};
};
const tokenizeTweetText = (input) => {
const tokens = [];
let lastIndex = 0;
for (const match of input.matchAll(LINK_PATTERN)) {
const startIndex = match.index ?? 0;
const rawMatch = match[0] ?? "";
if (startIndex > lastIndex) {
tokens.push({
type: "text",
value: input.slice(lastIndex, startIndex)
});
}
if (rawMatch.startsWith("http://") || rawMatch.startsWith("https://")) {
const {
url,
trailing
} = splitUrlTrailingPunctuation(rawMatch);
if (url && isUrlAllowed(url, TWEET_TEXT_URL_POLICY)) {
tokens.push({
type: "url",
value: url,
href: url
});
if (trailing) {
tokens.push({
type: "text",
value: trailing
});
}
} else {
tokens.push({
type: "text",
value: rawMatch
});
}
} else if (rawMatch.startsWith("#")) {
const tag = rawMatch.slice(1);
if (tag) {
tokens.push({
type: "hashtag",
value: rawMatch,
href: buildHashtagUrl(tag)
});
} else {
tokens.push({
type: "text",
value: rawMatch
});
}
} else {
tokens.push({
type: "text",
value: rawMatch
});
}
lastIndex = startIndex + rawMatch.length;
}
if (lastIndex < input.length) {
tokens.push({
type: "text",
value: input.slice(lastIndex)
});
}
return tokens;
};
const normalizeTweetUrl = (value) => {
const trimmed = value?.trim();
if (!trimmed) return null;
if (!isUrlAllowed(trimmed, TWEET_TEXT_URL_POLICY)) return null;
return trimmed;
};
const formatTweetUrlLabel = (url) => url.replace(PROTOCOL_PREFIX, "");
const renderTweetTokens = (tokens) => {
return tokens.map((token) => {
if ((token.type === "url" || token.type === "hashtag") && token.href) {
return (() => {
var _el$ = _tmpl$$5();
insert(_el$, () => token.value);
createRenderEffect(() => setAttribute(_el$, "href", token.href));
return _el$;
})();
}
return token.value;
});
};
const TweetUrlLink = (props) => {
const translate = useTranslation();
return (() => {
var _el$2 = _tmpl$2$2(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling;
insert(_el$3, createComponent(LucideIcon, {
name: "external-link",
size: 14,
get ["class"]() {
return styles$2.tweetUrlIcon;
}
}), _el$4);
insert(_el$4, () => translate("tb.twUrl"));
insert(_el$5, () => props.label);
createRenderEffect((_p$) => {
var _v$ = styles$2.tweetUrlSection, _v$2 = props.url, _v$3 = styles$2.tweetUrlLink, _v$4 = styles$2.tweetUrlLabel, _v$5 = styles$2.tweetUrlValue;
_v$ !== _p$.e && className(_el$2, _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$3, "href", _p$.t = _v$2);
_v$3 !== _p$.a && className(_el$3, _p$.a = _v$3);
_v$4 !== _p$.o && className(_el$4, _p$.o = _v$4);
_v$5 !== _p$.i && className(_el$5, _p$.i = _v$5);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0
});
return _el$2;
})();
};
function TweetTextPanel(props) {
const translate = useTranslation();
const tweetText = props.tweetTextHTML ?? props.tweetText ?? "";
const tokens = tweetText ? tokenizeTweetText(tweetText) : [];
const safeTweetUrl = normalizeTweetUrl(props.tweetUrl);
const tweetUrlLabel = safeTweetUrl ? formatTweetUrlLabel(safeTweetUrl) : "";
return (() => {
var _el$6 = _tmpl$3$1(), _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild, _el$9 = _el$7.nextSibling, _el$0 = _el$9.firstChild;
insert(_el$8, () => translate("tb.twTxt"));
insert(_el$9, safeTweetUrl && createComponent(TweetUrlLink, {
url: safeTweetUrl,
label: tweetUrlLabel
}), _el$0);
insert(_el$9, (() => {
var _c$ = memo(() => !!(safeTweetUrl && tokens.length > 0));
return () => _c$() && (() => {
var _el$1 = _tmpl$4$1();
createRenderEffect(() => className(_el$1, styles$2.tweetUrlDivider));
return _el$1;
})();
})(), _el$0);
insert(_el$0, () => renderTweetTokens(tokens));
createRenderEffect((_p$) => {
var _v$6 = styles$2.tweetPanelBody, _v$7 = styles$2.tweetTextHeader, _v$8 = styles$2.tweetTextLabel, _v$9 = styles$2.tweetContent;
_v$6 !== _p$.e && className(_el$6, _p$.e = _v$6);
_v$7 !== _p$.t && className(_el$7, _p$.t = _v$7);
_v$8 !== _p$.a && className(_el$8, _p$.a = _v$8);
_v$9 !== _p$.o && className(_el$9, _p$.o = _v$9);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0
});
return _el$6;
})();
}
var _tmpl$$4 =  template(`<div data-gallery-element=toolbar><div><div><div><div><span aria-live=polite><span></span><span>/</span><span></span></span><div><div></div></div></div></div></div></div><div id=toolbar-settings-panel data-gallery-scrollable=true role=region aria-label="Settings Panel"aria-labelledby=settings-button data-gallery-element=settings-panel></div><div id=toolbar-tweet-panel role=region aria-labelledby=tweet-text-button data-gallery-element=tweet-panel>`);
const SCROLLABLE_SELECTOR = '[data-gallery-scrollable="true"]';
const SCROLL_LOCK_TOLERANCE = 1;
const shouldAllowWheelDefault = (event) => {
return shouldAllowWheelDefault$1(event, {
scrollableSelector: SCROLLABLE_SELECTOR,
tolerance: SCROLL_LOCK_TOLERANCE
});
};
function ToolbarView(props) {
const totalCount = createMemo(() => resolve(props.totalCount));
const currentIndex = createMemo(() => resolve(props.currentIndex));
const displayedIndex = createMemo(() => props.displayedIndex());
const isToolbarDisabled = createMemo(() => !!resolveOptional(props.disabled));
const activeFitMode = createMemo(() => props.activeFitMode());
const tweetText = createMemo(() => resolveOptional(props.tweetText) ?? null);
const tweetTextHTML = createMemo(() => resolveOptional(props.tweetTextHTML) ?? null);
const tweetUrl = createMemo(() => resolveOptional(props.tweetUrl) ?? null);
const [toolbarElement, setToolbarElement] = createSignal(null);
const [counterElement, setCounterElement] = createSignal(null);
const [settingsPanelEl, setSettingsPanelEl] = createSignal(null);
const [tweetPanelEl, setTweetPanelEl] = createSignal(null);
const translate = useTranslation();
const nav = createMemo(() => props.navState());
const fitModeLabels = createMemo(() => resolve(props.fitModeLabels));
const assignToolbarRef = (element) => {
setToolbarElement(element);
props.settingsController.assignToolbarRef(element);
};
const assignSettingsPanelRef = (element) => {
setSettingsPanelEl(element);
props.settingsController.assignSettingsPanelRef(element);
};
createEffect(() => {
const current = String(currentIndex());
const focused = String(displayedIndex());
const toolbar = toolbarElement();
if (toolbar) {
toolbar.dataset.currentIndex = current;
toolbar.dataset.focusedIndex = focused;
}
const counter = counterElement();
if (counter) {
counter.dataset.currentIndex = current;
counter.dataset.focusedIndex = focused;
}
});
const hasTweetContent = () => !!(tweetTextHTML() ?? tweetText() ?? tweetUrl());
const toolbarButtonClass = (...extra) => cx(styles$2.toolbarButton, "xeg-inline-center", ...extra);
const toolbarStateClass = () => {
const state = props.toolbarDataState();
switch (state) {
case "loading":
return styles$2.stateLoading;
case "downloading":
return styles$2.stateDownloading;
case "error":
return styles$2.stateError;
default:
return styles$2.stateIdle;
}
};
const handlePanelWheel = (event) => {
if (shouldAllowWheelDefault(event)) {
event.stopPropagation();
return;
}
};
const preventScrollChaining = (event) => {
if (shouldAllowWheelDefault(event)) {
event.stopPropagation();
return;
}
safeEventPreventAll(event);
};
const registerWheelListener = (getElement, handler, options) => {
createEffect(() => {
const element = getElement();
if (!element) return;
const controller = new AbortController();
const eventManager = EventManager.getInstance();
const listener = (event) => handler(event);
eventManager.addEventListener(element, "wheel", listener, {
passive: options.passive,
signal: controller.signal,
context: options.context
});
onCleanup(() => controller.abort());
});
};
registerWheelListener(toolbarElement, preventScrollChaining, {
passive: false,
context: "toolbar:wheel:prevent-scroll-chaining"
});
registerWheelListener(settingsPanelEl, preventScrollChaining, {
passive: false,
context: "toolbar:wheel:prevent-scroll-chaining:settings-panel"
});
registerWheelListener(tweetPanelEl, handlePanelWheel, {
passive: true,
context: "toolbar:wheel:panel"
});
return (() => {
var _el$ = _tmpl$$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$6.nextSibling, _el$1 = _el$0.firstChild, _el$10 = _el$2.nextSibling, _el$11 = _el$10.nextSibling;
_el$.$$keydown = (event) => props.settingsController.handleToolbarKeyDown(event);
addEventListener(_el$, "blur", props.onBlur);
addEventListener(_el$, "focus", props.onFocus);
use(assignToolbarRef, _el$);
insert(_el$3, createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass();
},
size: "toolbar",
get ["aria-label"]() {
return translate("tb.prev");
},
get title() {
return translate("tb.prev");
},
get disabled() {
return nav().prevDisabled;
},
get onClick() {
return props.onPreviousClick;
},
get children() {
return createComponent(LucideIcon, {
name: "chevron-left",
size: 18
});
}
}), _el$4);
insert(_el$3, createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass();
},
size: "toolbar",
get ["aria-label"]() {
return translate("tb.next");
},
get title() {
return translate("tb.next");
},
get disabled() {
return nav().nextDisabled;
},
get onClick() {
return props.onNextClick;
},
get children() {
return createComponent(LucideIcon, {
name: "chevron-right",
size: 18
});
}
}), _el$4);
use((element) => {
setCounterElement(element);
}, _el$6);
insert(_el$7, () => displayedIndex() + 1);
insert(_el$9, totalCount);
insert(_el$3, () => props.fitModeOrder.map(({
mode,
iconName
}) => {
const label = fitModeLabels()[mode];
return createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass(styles$2.fitButton);
},
size: "toolbar",
get onClick() {
return props.handleFitModeClick(mode);
},
get disabled() {
return props.isFitDisabled(mode);
},
get ["aria-label"]() {
return label.label;
},
get title() {
return label.title;
},
get ["aria-pressed"]() {
return activeFitMode() === mode;
},
get children() {
return createComponent(LucideIcon, {
name: iconName,
size: 18
});
}
});
}), null);
insert(_el$3, createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass(styles$2.downloadButton, styles$2.downloadCurrent);
},
size: "toolbar",
get onClick() {
return props.onDownloadCurrent;
},
get disabled() {
return nav().downloadDisabled;
},
get ["aria-label"]() {
return translate("tb.dl");
},
get title() {
return translate("tb.dl");
},
get children() {
return createComponent(LucideIcon, {
name: "download",
size: 18
});
}
}), null);
insert(_el$3, (() => {
var _c$ = memo(() => !!nav().canDownloadAll);
return () => _c$() && createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass(styles$2.downloadButton, styles$2.downloadAll);
},
size: "toolbar",
get onClick() {
return props.onDownloadAll;
},
get disabled() {
return nav().downloadDisabled;
},
get ["aria-label"]() {
return translate("tb.dlAllCt", {
count: totalCount()
});
},
get title() {
return translate("tb.dlAllCt", {
count: totalCount()
});
},
get children() {
return createComponent(LucideIcon, {
name: "folder-down",
size: 18
});
}
});
})(), null);
insert(_el$3, (() => {
var _c$2 = memo(() => !!props.showSettingsButton);
return () => _c$2() && createComponent(IconButton, {
ref(r$) {
var _ref$ = props.settingsController.assignSettingsButtonRef;
typeof _ref$ === "function" ? _ref$(r$) : props.settingsController.assignSettingsButtonRef = r$;
},
id: "settings-button",
get ["class"]() {
return toolbarButtonClass();
},
size: "toolbar",
get ["aria-label"]() {
return translate("tb.setOpen");
},
get ["aria-expanded"]() {
return props.settingsController.isSettingsExpanded() ? "true" : "false";
},
"aria-controls": "toolbar-settings-panel",
get title() {
return translate("tb.setOpen");
},
get disabled() {
return isToolbarDisabled();
},
get onMouseDown() {
return props.settingsController.handleSettingsMouseDown;
},
get onClick() {
return props.settingsController.handleSettingsClick;
},
get children() {
return createComponent(LucideIcon, {
name: "settings-2",
size: 18
});
}
});
})(), null);
insert(_el$3, (() => {
var _c$3 = memo(() => !!hasTweetContent());
return () => _c$3() && createComponent(IconButton, {
id: "tweet-text-button",
get ["class"]() {
return toolbarButtonClass();
},
size: "toolbar",
get ["aria-label"]() {
return translate("tb.twTxt");
},
get ["aria-expanded"]() {
return props.isTweetPanelExpanded() ? "true" : "false";
},
"aria-controls": "toolbar-tweet-panel",
get title() {
return translate("tb.twTxt");
},
get disabled() {
return isToolbarDisabled();
},
get onClick() {
return props.toggleTweetPanelExpanded;
},
get children() {
return createComponent(LucideIcon, {
name: "messages-square",
size: 18
});
}
});
})(), null);
insert(_el$3, createComponent(IconButton, {
get ["class"]() {
return toolbarButtonClass(styles$2.closeButton);
},
size: "toolbar",
get ["aria-label"]() {
return translate("tb.cls");
},
get title() {
return translate("tb.cls");
},
get disabled() {
return isToolbarDisabled();
},
get onClick() {
return props.onCloseClick;
},
get children() {
return createComponent(LucideIcon, {
name: "x",
size: 18
});
}
}), null);
addEventListener(_el$10, "click", props.settingsController.handlePanelClick, true);
addEventListener(_el$10, "mousedown", props.settingsController.handlePanelMouseDown, true);
use(assignSettingsPanelRef, _el$10);
insert(_el$10, createComponent(Show, {
get when() {
return props.settingsController.isSettingsExpanded();
},
get children() {
return createComponent(SettingsControls, {
get currentTheme() {
return props.settingsController.currentTheme;
},
get currentLanguage() {
return props.settingsController.currentLanguage;
},
get onThemeChange() {
return props.settingsController.handleThemeChange;
},
get onLanguageChange() {
return props.settingsController.handleLanguageChange;
},
compact: true,
"data-testid": void 0
});
}
}));
use(setTweetPanelEl, _el$11);
insert(_el$11, createComponent(Show, {
get when() {
return memo(() => !!props.isTweetPanelExpanded())() && hasTweetContent();
},
get children() {
return createComponent(TweetTextPanel, {
get tweetText() {
return tweetText() ?? void 0;
},
get tweetTextHTML() {
return tweetTextHTML() ?? void 0;
},
get tweetUrl() {
return tweetUrl() ?? void 0;
}
});
}
}));
createRenderEffect((_p$) => {
var _v$ = cx(props.toolbarClass(), toolbarStateClass(), props.settingsController.isSettingsExpanded() ? styles$2.settingsExpanded : void 0, props.isTweetPanelExpanded() ? styles$2.tweetPanelExpanded : void 0), _v$2 = props.role ?? "toolbar", _v$3 = props["aria-label"] ?? "Gallery Toolbar", _v$4 = props["aria-describedby"], _v$5 = isToolbarDisabled(), _v$6 = void 0, _v$7 = props.tabIndex, _v$8 = cx(styles$2.toolbarContent, "xeg-row-center"), _v$9 = styles$2.toolbarControls, _v$0 = styles$2.counterBlock, _v$1 = cx(styles$2.mediaCounterWrapper, "xeg-inline-center"), _v$10 = cx(styles$2.mediaCounter, "xeg-inline-center"), _v$11 = styles$2.currentIndex, _v$12 = styles$2.separator, _v$13 = styles$2.totalCount, _v$14 = styles$2.progressBar, _v$15 = styles$2.progressFill, _v$16 = props.progressWidth(), _v$17 = cx(styles$2.settingsPanel, props.settingsController.isSettingsExpanded() ? styles$2.panelExpanded : void 0), _v$18 = cx(styles$2.tweetPanel, props.isTweetPanelExpanded() ? styles$2.panelExpanded : void 0), _v$19 = translate("tb.twPanel");
_v$ !== _p$.e && className(_el$, _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$, "role", _p$.t = _v$2);
_v$3 !== _p$.a && setAttribute(_el$, "aria-label", _p$.a = _v$3);
_v$4 !== _p$.o && setAttribute(_el$, "aria-describedby", _p$.o = _v$4);
_v$5 !== _p$.i && setAttribute(_el$, "aria-disabled", _p$.i = _v$5);
_v$6 !== _p$.n && setAttribute(_el$, "data-testid", _p$.n = _v$6);
_v$7 !== _p$.s && setAttribute(_el$, "tabindex", _p$.s = _v$7);
_v$8 !== _p$.h && className(_el$2, _p$.h = _v$8);
_v$9 !== _p$.r && className(_el$3, _p$.r = _v$9);
_v$0 !== _p$.d && className(_el$4, _p$.d = _v$0);
_v$1 !== _p$.l && className(_el$5, _p$.l = _v$1);
_v$10 !== _p$.u && className(_el$6, _p$.u = _v$10);
_v$11 !== _p$.c && className(_el$7, _p$.c = _v$11);
_v$12 !== _p$.w && className(_el$8, _p$.w = _v$12);
_v$13 !== _p$.m && className(_el$9, _p$.m = _v$13);
_v$14 !== _p$.f && className(_el$0, _p$.f = _v$14);
_v$15 !== _p$.y && className(_el$1, _p$.y = _v$15);
_v$16 !== _p$.g && setStyleProperty(_el$1, "width", _p$.g = _v$16);
_v$17 !== _p$.p && className(_el$10, _p$.p = _v$17);
_v$18 !== _p$.b && className(_el$11, _p$.b = _v$18);
_v$19 !== _p$.T && setAttribute(_el$11, "aria-label", _p$.T = _v$19);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0,
n: void 0,
s: void 0,
h: void 0,
r: void 0,
d: void 0,
l: void 0,
u: void 0,
c: void 0,
w: void 0,
m: void 0,
f: void 0,
y: void 0,
g: void 0,
p: void 0,
b: void 0,
T: void 0
});
return _el$;
})();
}
delegateEvents(["keydown", "mousedown", "click"]);
let toolbarSettingsControllerListenerSeq = 0;
const DEFAULT_FOCUS_DELAY_MS = 50;
const DEFAULT_SELECT_GUARD_MS = 300;
function useToolbarSettingsController(options) {
const {
isSettingsExpanded,
setSettingsExpanded,
toggleSettingsExpanded,
documentRef = typeof document !== "undefined" ? document : void 0,
themeService: providedThemeService,
languageService: providedLanguageService,
focusDelayMs = DEFAULT_FOCUS_DELAY_MS,
selectChangeGuardMs = DEFAULT_SELECT_GUARD_MS
} = options;
const themeManager = providedThemeService ?? getThemeService();
const languageService = providedLanguageService ?? getLanguageService();
const scheduleTimeout = (callback, delay) => {
return globalTimerManager.setTimeout(callback, delay);
};
const clearScheduledTimeout = (handle) => {
if (handle == null) {
return;
}
globalTimerManager.clearTimeout(handle);
};
const [toolbarRef, setToolbarRef] = createSignal(void 0);
const [settingsPanelRef, setSettingsPanelRef] = createSignal(
void 0
);
const [settingsButtonRef, setSettingsButtonRef] = createSignal(
void 0
);
const toThemeOption = (value) => {
return value === "light" || value === "dark" ? value : "auto";
};
const getInitialTheme = () => {
try {
const currentSetting = themeManager.getCurrentTheme();
return toThemeOption(currentSetting);
} catch (error) {
}
return "auto";
};
const [currentTheme, setCurrentTheme] = createSignal(getInitialTheme());
const [currentLanguage, setCurrentLanguage] = createSignal(
languageService.getCurrentLanguage()
);
const syncThemeFromService = () => {
try {
const setting = themeManager.getCurrentTheme();
setCurrentTheme(toThemeOption(setting));
} catch (error) {
}
};
syncThemeFromService();
if (typeof themeManager.isInitialized === "function" && !themeManager.isInitialized()) {
void themeManager.initialize().then(syncThemeFromService).catch((error) => {
});
}
createEffect(() => {
const unsubscribe = themeManager.onThemeChange((_, setting) => {
setCurrentTheme(toThemeOption(setting));
});
onCleanup(() => {
unsubscribe?.();
});
});
createEffect(() => {
const unsubscribe = languageService.onLanguageChange((next) => {
setCurrentLanguage(next);
});
onCleanup(() => {
unsubscribe();
});
});
createEffect(() => {
if (!documentRef) {
return;
}
const expanded = isSettingsExpanded();
const panel = settingsPanelRef();
if (!expanded || !panel) {
return;
}
const eventManager = EventManager.getInstance();
const listenerContext = `toolbar-settings-controller:${toolbarSettingsControllerListenerSeq++}`;
let isSelectActive = false;
let selectGuardTimeout = null;
const handleSelectFocus = () => {
isSelectActive = true;
};
const handleSelectBlur = () => {
scheduleTimeout(() => {
isSelectActive = false;
}, 100);
};
const handleSelectChange = () => {
isSelectActive = true;
clearScheduledTimeout(selectGuardTimeout);
selectGuardTimeout = scheduleTimeout(() => {
isSelectActive = false;
selectGuardTimeout = null;
}, selectChangeGuardMs);
};
const selects = Array.from(panel.querySelectorAll("select"));
selects.forEach((select) => {
eventManager.addListener(select, "focus", handleSelectFocus, void 0, listenerContext);
eventManager.addListener(select, "blur", handleSelectBlur, void 0, listenerContext);
eventManager.addListener(select, "change", handleSelectChange, void 0, listenerContext);
});
const handleOutsideClick = (event) => {
const target = event.target;
const settingsButton = settingsButtonRef();
const toolbarElement = toolbarRef();
if (!target) {
return;
}
if (isSelectActive) {
return;
}
const targetElement = target;
if (toolbarElement?.contains(targetElement)) {
return;
}
if (settingsButton?.contains(targetElement)) {
return;
}
if (panel.contains(targetElement)) {
return;
}
let currentNode = targetElement;
while (currentNode) {
if (currentNode.tagName === "SELECT" || currentNode.tagName === "OPTION") {
return;
}
currentNode = currentNode.parentElement;
}
setSettingsExpanded(false);
};
eventManager.addListener(
documentRef,
"mousedown",
handleOutsideClick,
{ capture: false },
listenerContext
);
onCleanup(() => {
clearScheduledTimeout(selectGuardTimeout);
eventManager.removeByContext(listenerContext);
});
});
const handleSettingsClick = (event) => {
event.stopImmediatePropagation?.();
const wasExpanded = isSettingsExpanded();
toggleSettingsExpanded();
if (!wasExpanded) {
scheduleTimeout(() => {
const panel = settingsPanelRef();
const firstControl = panel?.querySelector("select");
if (firstControl) {
firstControl.focus({ preventScroll: true });
}
}, focusDelayMs);
}
};
const handleSettingsMouseDown = (event) => {
event.stopPropagation();
};
const handleToolbarKeyDown = (event) => {
if (event.key === "Escape" && isSettingsExpanded()) {
event.preventDefault();
event.stopPropagation();
setSettingsExpanded(false);
scheduleTimeout(() => {
const settingsButton = settingsButtonRef();
if (settingsButton) {
settingsButton.focus({ preventScroll: true });
}
}, focusDelayMs);
}
};
const handlePanelMouseDown = (event) => {
event.stopPropagation();
};
const handlePanelClick = (event) => {
event.stopPropagation();
};
const handleThemeChange = (event) => {
const select = event.target;
if (!select) {
return;
}
const theme = toThemeOption(select.value);
setCurrentTheme(theme);
themeManager.setTheme(theme);
try {
const settingsService = tryGetSettingsManager();
if (settingsService) {
void settingsService.set("gallery.theme", theme).catch((error) => {
;
});
}
} catch (error) {
}
};
const handleLanguageChange = (event) => {
const select = event.target;
if (!select) {
return;
}
const language = select.value || "auto";
setCurrentLanguage(language);
languageService.setLanguage(language);
};
return {
assignToolbarRef: (element) => {
setToolbarRef(element ?? void 0);
},
assignSettingsPanelRef: (element) => {
setSettingsPanelRef(element ?? void 0);
},
assignSettingsButtonRef: (element) => {
setSettingsButtonRef(element ?? void 0);
},
isSettingsExpanded,
currentTheme,
currentLanguage,
handleSettingsClick,
handleSettingsMouseDown,
handleToolbarKeyDown,
handlePanelMouseDown,
handlePanelClick,
handleThemeChange,
handleLanguageChange
};
}
const INITIAL_STATE$1 = {
isDownloading: false,
isLoading: false,
hasError: false
};
function useToolbarState() {
const [isDownloading, setIsDownloading] = createSignal(INITIAL_STATE$1.isDownloading);
const [isLoading, setIsLoading] = createSignal(INITIAL_STATE$1.isLoading);
const [hasError, setHasError] = createSignal(INITIAL_STATE$1.hasError);
let lastDownloadToggle = 0;
let downloadTimeoutRef = null;
const clearDownloadTimeout = () => {
if (downloadTimeoutRef !== null) {
globalTimerManager.clearTimeout(downloadTimeoutRef);
downloadTimeoutRef = null;
}
};
const setDownloading = (downloading) => {
const now = Date.now();
if (downloading) {
lastDownloadToggle = now;
clearDownloadTimeout();
setIsDownloading(true);
setHasError(false);
return;
}
const timeSinceStart = now - lastDownloadToggle;
const minDisplayTime = 300;
if (timeSinceStart < minDisplayTime) {
clearDownloadTimeout();
downloadTimeoutRef = globalTimerManager.setTimeout(() => {
setIsDownloading(false);
downloadTimeoutRef = null;
}, minDisplayTime - timeSinceStart);
return;
}
setIsDownloading(false);
};
const setLoading = (loading) => {
setIsLoading(loading);
if (loading) {
setHasError(false);
}
};
const setError = (errorState) => {
setHasError(errorState);
if (errorState) {
setIsLoading(false);
setIsDownloading(false);
}
};
const resetState = () => {
clearDownloadTimeout();
lastDownloadToggle = 0;
setIsDownloading(INITIAL_STATE$1.isDownloading);
setIsLoading(INITIAL_STATE$1.isLoading);
setHasError(INITIAL_STATE$1.hasError);
};
onCleanup(() => {
clearDownloadTimeout();
});
const actions = {
setDownloading,
setLoading,
setError,
resetState
};
const state = {
get isDownloading() {
return isDownloading();
},
get isLoading() {
return isLoading();
},
get hasError() {
return hasError();
}
};
return [state, actions];
}
const DEFAULT_PROPS = {
isDownloading: false,
disabled: false,
className: ""
};
const FIT_MODE_ORDER = [{
mode: "original",
iconName: "maximize-2"
}, {
mode: "fitWidth",
iconName: "move-horizontal"
}, {
mode: "fitHeight",
iconName: "move-vertical"
}, {
mode: "fitContainer",
iconName: "minimize-2"
}];
const resolveDisplayedIndex = ({
total,
currentIndex,
focusedIndex
}) => {
if (total <= 0) {
return 0;
}
if (typeof focusedIndex === "number" && focusedIndex >= 0 && focusedIndex < total) {
return focusedIndex;
}
return clampIndex(currentIndex, total);
};
const calculateProgressWidth = (index, total) => {
if (total <= 0) {
return "0%";
}
return `${(index + 1) / total * 100}%`;
};
const computeNavigationState = ({
total,
toolbarDisabled,
downloadBusy
}) => {
const hasItems = total > 0;
const canNavigate = hasItems && total > 1;
const prevDisabled = toolbarDisabled || !canNavigate;
const nextDisabled = toolbarDisabled || !canNavigate;
const downloadDisabled = toolbarDisabled || downloadBusy || !hasItems;
return {
prevDisabled,
nextDisabled,
canDownloadAll: total > 1,
downloadDisabled,
anyActionDisabled: toolbarDisabled
};
};
const createGuardedHandler = (guard, action) => {
return (event) => {
safeEventPrevent(event);
if (guard()) {
return;
}
action?.();
};
};
function getToolbarDataState(state) {
if (state.hasError) return "error";
if (state.isDownloading) return "downloading";
if (state.isLoading) return "loading";
return "idle";
}
function ToolbarContainer(rawProps) {
const props = mergeProps(DEFAULT_PROPS, rawProps);
const currentIndex = toRequiredAccessor(() => props.currentIndex, 0);
const totalCount = toRequiredAccessor(() => props.totalCount, 0);
const focusedIndex = toRequiredAccessor(() => props.focusedIndex, null);
const isDownloadingProp = toRequiredAccessor(() => props.isDownloading, false);
const isDisabled = toRequiredAccessor(() => props.disabled, false);
const currentFitMode = toOptionalAccessor(() => props.currentFitMode);
const tweetText = toOptionalAccessor(() => props.tweetText);
const tweetTextHTML = toOptionalAccessor(() => props.tweetTextHTML);
const tweetUrl = toOptionalAccessor(() => props.tweetUrl);
const translate = useTranslation();
const [toolbarState, toolbarActions] = useToolbarState();
const [settingsExpandedSignal, setSettingsExpandedSignal] = createSignal(false);
const [tweetExpanded, setTweetExpanded] = createSignal(false);
const setSettingsExpanded = (expanded) => {
setSettingsExpandedSignal(expanded);
if (expanded) {
setTweetExpanded(false);
}
};
const toggleSettings = () => {
setSettingsExpanded(!settingsExpandedSignal());
};
const toggleTweet = () => {
setTweetExpanded((prev) => {
const next = !prev;
if (next) {
setSettingsExpanded(false);
}
return next;
});
};
createEffect(on(isDownloadingProp, (value) => {
toolbarActions.setDownloading(!!value);
}));
const baseSettingsController = useToolbarSettingsController({
isSettingsExpanded: settingsExpandedSignal,
setSettingsExpanded,
toggleSettingsExpanded: toggleSettings
});
const settingsController = {
...baseSettingsController,
handleSettingsClick: (event) => {
const wasOpen = settingsExpandedSignal();
baseSettingsController.handleSettingsClick(event);
if (!wasOpen && settingsExpandedSignal()) {
props.handlers.lifecycle.onOpenSettings?.();
}
}
};
const toolbarClass = createMemo(() => cx(styles$2.toolbar, styles$2.galleryToolbar, props.className));
const totalItems = createMemo(() => Math.max(0, totalCount()));
const currentIndexForNav = createMemo(() => clampIndex(currentIndex(), totalItems()));
const displayedIndex = createMemo(() => resolveDisplayedIndex({
total: totalItems(),
currentIndex: currentIndexForNav(),
focusedIndex: focusedIndex()
}));
const progressWidth = createMemo(() => calculateProgressWidth(displayedIndex(), totalItems()));
const toolbarDataState = createMemo(() => getToolbarDataState(toolbarState));
const navState = createMemo(() => computeNavigationState({
total: totalItems(),
toolbarDisabled: !!isDisabled(),
downloadBusy: !!(isDownloadingProp() || toolbarState.isDownloading)
}));
const fitModeHandlers = createMemo(() => ({
original: props.handlers.fitMode?.onFitOriginal,
fitWidth: props.handlers.fitMode?.onFitWidth,
fitHeight: props.handlers.fitMode?.onFitHeight,
fitContainer: props.handlers.fitMode?.onFitContainer
}));
const fitModeLabels = createMemo(() => ({
original: {
label: translate("tb.fitOri"),
title: translate("tb.fitOri")
},
fitWidth: {
label: translate("tb.fitW"),
title: translate("tb.fitW")
},
fitHeight: {
label: translate("tb.fitH"),
title: translate("tb.fitH")
},
fitContainer: {
label: translate("tb.fitC"),
title: translate("tb.fitC")
}
}));
const activeFitMode = createMemo(() => currentFitMode() ?? FIT_MODE_ORDER[0]?.mode ?? "original");
const isToolbarDisabled = () => !!isDisabled();
const handleFitModeClick = (mode) => (event) => {
safeEventPreventAll(event);
if (isToolbarDisabled()) {
return;
}
fitModeHandlers()[mode]?.(event);
};
const isFitDisabled = (mode) => {
if (isToolbarDisabled()) {
return true;
}
const handler = fitModeHandlers()[mode];
if (!handler) {
return true;
}
return activeFitMode() === mode;
};
const handlePrevious = createGuardedHandler(() => navState().prevDisabled, props.handlers.navigation.onPrevious);
const handleNext = createGuardedHandler(() => navState().nextDisabled, props.handlers.navigation.onNext);
const handleDownloadCurrent = createGuardedHandler(() => navState().downloadDisabled, props.handlers.download.onDownloadCurrent);
const handleDownloadAll = createGuardedHandler(() => navState().downloadDisabled, props.handlers.download.onDownloadAll);
const handleClose = (event) => {
safeEventPrevent(event);
props.handlers.lifecycle.onClose();
};
return createComponent(
ToolbarView,
{
currentIndex,
focusedIndex,
totalCount,
isDownloading: isDownloadingProp,
disabled: isDisabled,
get ["aria-label"]() {
return props["aria-label"];
},
get ["aria-describedby"]() {
return props["aria-describedby"];
},
get role() {
return props.role;
},
get tabIndex() {
return props.tabIndex;
},
get ["data-testid"]() {
return props["data-testid"];
},
get onFocus() {
return props.handlers.focus?.onFocus;
},
get onBlur() {
return props.handlers.focus?.onBlur;
},
tweetText,
tweetTextHTML,
tweetUrl,
toolbarClass,
toolbarState,
toolbarDataState,
navState,
displayedIndex,
progressWidth,
fitModeOrder: FIT_MODE_ORDER,
fitModeLabels,
activeFitMode,
handleFitModeClick,
isFitDisabled,
onPreviousClick: handlePrevious,
onNextClick: handleNext,
onDownloadCurrent: handleDownloadCurrent,
onDownloadAll: handleDownloadAll,
onCloseClick: handleClose,
settingsController,
get showSettingsButton() {
return typeof props.handlers.lifecycle.onOpenSettings === "function";
},
isTweetPanelExpanded: tweetExpanded,
toggleTweetPanelExpanded: toggleTweet
}
);
}
const Toolbar = ToolbarContainer;
function requireSettingsService() {
const service = tryGetSettingsManager();
if (!service) {
throw new Error(
"SettingsService not registered."
);
}
return service;
}
function getTypedSettingOr(path, fallback) {
const value = requireSettingsService().get(path);
return value === void 0 ? fallback : value;
}
function setTypedSetting(path, value) {
return requireSettingsService().set(path, value);
}
const INITIAL_STATE = {
activeTasks:  new Map(),
queue: [],
isProcessing: false
};
let downloadStateSignal = null;
function getDownloadState() {
if (!downloadStateSignal) {
downloadStateSignal = createSignalSafe(INITIAL_STATE);
}
return downloadStateSignal;
}
function setProcessingFlag(isProcessing) {
const currentState = downloadState.value;
if (currentState.isProcessing === isProcessing) {
return;
}
downloadState.value = {
...currentState,
isProcessing
};
}
function acquireDownloadLock() {
setProcessingFlag(true);
return () => {
const { queue, activeTasks } = downloadState.value;
if (queue.length === 0 && activeTasks.size === 0) {
setProcessingFlag(false);
}
};
}
function isDownloadLocked() {
return downloadState.value.isProcessing;
}
const downloadState = {
get value() {
return getDownloadState().value;
},
set value(newState) {
getDownloadState().value = newState;
}};
function isDownloadUiBusy(context) {
return !!context.downloadProcessing;
}
function computePreloadIndices(currentIndex, total, count) {
const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
const safeIndex = clampIndex(Math.floor(currentIndex), safeTotal);
const safeCount = clamp(Math.floor(count), 0, 20);
if (safeTotal === 0 || safeCount === 0) return [];
const indices = [];
for (let i = 1; i <= safeCount; i++) {
const idx = safeIndex - i;
if (idx >= 0) indices.push(idx);
else break;
}
for (let i = 1; i <= safeCount; i++) {
const idx = safeIndex + i;
if (idx < safeTotal) indices.push(idx);
else break;
}
return indices;
}
let observerRegistry =  new WeakMap();
const SharedObserver = {
observe(element, callback, options = {}) {
const observer = new IntersectionObserver((entries) => {
for (const entry of entries) {
try {
callback(entry);
} catch (error) {
}
}
}, options);
observer.observe(element);
let set = observerRegistry.get(element);
if (!set) {
set =  new Set();
observerRegistry.set(element, set);
}
set.add(observer);
let isActive = true;
const unsubscribe = () => {
if (!isActive) {
return;
}
isActive = false;
try {
observer.unobserve(element);
} catch {
}
try {
observer.disconnect();
} catch {
}
const currentSet = observerRegistry.get(element);
if (currentSet) {
currentSet.delete(observer);
if (currentSet.size === 0) {
observerRegistry.delete(element);
}
}
};
return unsubscribe;
},
unobserve(element) {
const set = observerRegistry.get(element);
if (!set || set.size === 0) {
return;
}
for (const observer of set) {
try {
observer.disconnect();
} catch {
}
}
observerRegistry.delete(element);
}
};
const DEFAULTS = {
THRESHOLD: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
ROOT_MARGIN: "0px"
};
class FocusCoordinator {
constructor(options) {
this.options = options;
this.observerOptions = {
threshold: options.threshold ?? [...DEFAULTS.THRESHOLD],
rootMargin: options.rootMargin ?? DEFAULTS.ROOT_MARGIN
};
}
items =  new Map();
observerOptions;
registerItem(index, element) {
const prev = this.items.get(index);
prev?.unsubscribe?.();
if (!element) {
this.items.delete(index);
return;
}
const trackedItem = { element, isVisible: false };
trackedItem.unsubscribe = SharedObserver.observe(
element,
(entry) => {
const item = this.items.get(index);
if (item) {
item.entry = entry;
item.isVisible = entry.isIntersecting;
}
},
this.observerOptions
);
this.items.set(index, trackedItem);
}
updateFocus(force = false) {
if (!force && !this.options.isEnabled()) return;
const container = this.options.container();
if (!container) return;
const containerRect = container.getBoundingClientRect();
const selection = this.selectBestCandidate(containerRect);
if (!selection) return;
const currentIndex = this.options.activeIndex();
const hasChanged = currentIndex !== selection.index;
if (hasChanged) {
this.options.onFocusChange(selection.index, "auto");
}
}
cleanup() {
for (const item of this.items.values()) {
item.unsubscribe?.();
}
this.items.clear();
}
selectBestCandidate(containerRect) {
const viewportHeight = Math.max(containerRect.height, 1);
const viewportTop = containerRect.top;
const viewportBottom = viewportTop + viewportHeight;
const viewportCenter = viewportTop + viewportHeight / 2;
const topProximityThreshold = 50;
let bestCandidate = null;
let topAlignedCandidate = null;
let highestVisibilityCandidate = null;
for (const [index, item] of this.items) {
if (!item.isVisible || !item.element.isConnected) continue;
const rect = item.element.getBoundingClientRect();
const itemTop = rect.top;
const itemHeight = rect.height;
const itemBottom = itemTop + itemHeight;
const itemCenter = itemTop + itemHeight / 2;
const visibleTop = Math.max(itemTop, viewportTop);
const visibleBottom = Math.min(itemBottom, viewportBottom);
const visibleHeight = Math.max(0, visibleBottom - visibleTop);
const visibilityRatio = itemHeight > 0 ? visibleHeight / itemHeight : 0;
const centerDistance = Math.abs(itemCenter - viewportCenter);
const topDistance = Math.abs(itemTop - viewportTop);
if (topDistance <= topProximityThreshold && visibilityRatio > 0.1) {
if (!topAlignedCandidate || topDistance < topAlignedCandidate.distance) {
topAlignedCandidate = { index, distance: topDistance };
}
}
if (visibilityRatio > 0.1) {
const isBetterVisibility = !highestVisibilityCandidate || visibilityRatio > highestVisibilityCandidate.ratio || visibilityRatio === highestVisibilityCandidate.ratio && centerDistance < highestVisibilityCandidate.centerDistance;
if (isBetterVisibility) {
highestVisibilityCandidate = { index, ratio: visibilityRatio, centerDistance };
}
}
if (!bestCandidate || centerDistance < bestCandidate.distance) {
bestCandidate = { index, distance: centerDistance };
}
}
if (topAlignedCandidate) {
return topAlignedCandidate;
}
if (highestVisibilityCandidate) {
return { index: highestVisibilityCandidate.index, distance: 0 };
}
return bestCandidate;
}
}
function useGalleryFocusTracker(options) {
const isEnabled = toAccessor(options.isEnabled);
const container = toAccessor(options.container);
const isScrolling = options.isScrolling;
const lastNavigationTrigger = options.lastNavigationTrigger;
const shouldTrack = () => {
return isEnabled() && (isScrolling() || lastNavigationTrigger() === "scroll");
};
const coordinator = new FocusCoordinator({
isEnabled: shouldTrack,
container,
activeIndex: () => galleryState.value.currentIndex,
...options.threshold !== void 0 && { threshold: options.threshold },
rootMargin: options.rootMargin ?? "0px",
onFocusChange: (index, source) => {
if (source === "auto" && index !== null) {
navigateToItem(index, "scroll", "auto-focus");
}
}
});
onCleanup(() => coordinator.cleanup());
const handleItemFocus = (index) => {
navigateToItem(index, "keyboard");
};
return {
focusedIndex: () => gallerySignals.focusedIndex.value,
registerItem: (index, element) => coordinator.registerItem(index, element),
handleItemFocus,
forceSync: () => coordinator.updateFocus(true)
};
}
function useGalleryItemScroll(containerRef, currentIndex, totalItems, options = {}) {
const containerAccessor = typeof containerRef === "function" ? containerRef : () => containerRef.current;
const enabled = toAccessor(options.enabled ?? true);
const behavior = toAccessor(options.behavior ?? "auto");
const block = toAccessor(options.block ?? "start");
const alignToCenter = toAccessor(options.alignToCenter ?? false);
const isScrolling = toAccessor(options.isScrolling ?? false);
const currentIndexAccessor = toAccessor(currentIndex);
const totalItemsAccessor = toAccessor(totalItems);
const itemsCache =  new Map();
const getCachedItem = (index, itemsRoot) => {
const cached = itemsCache.get(index)?.deref();
if (cached?.isConnected) return cached;
const items = itemsRoot.querySelectorAll('[data-xeg-role="gallery-item"]');
const element = items[index];
if (element) {
itemsCache.set(index, new WeakRef(element));
}
return element ?? null;
};
const scrollToItem = (index) => {
const container = containerAccessor();
if (!enabled() || !container || index < 0 || index >= totalItemsAccessor()) return;
const itemsRoot = container.querySelector(
'[data-xeg-role="items-list"], [data-xeg-role="items-container"]'
);
if (!itemsRoot) return;
const target = getCachedItem(index, itemsRoot);
if (target) {
options.onScrollStart?.();
target.scrollIntoView({
behavior: behavior(),
block: alignToCenter() ? "center" : block(),
inline: "nearest"
});
} else {
requestAnimationFrame(() => {
const retryTarget = getCachedItem(index, itemsRoot);
if (retryTarget) {
options.onScrollStart?.();
retryTarget.scrollIntoView({
behavior: behavior(),
block: alignToCenter() ? "center" : block(),
inline: "nearest"
});
}
});
}
};
createEffect(() => {
const index = currentIndexAccessor();
const container = containerAccessor();
const total = totalItemsAccessor();
if (!container || total <= 0) {
return;
}
if (untrack(enabled) && !untrack(isScrolling)) {
scrollToItem(index);
}
});
return {
scrollToItem,
scrollToCurrentItem: () => scrollToItem(currentIndexAccessor())
};
}
const SCROLL_IDLE_TIMEOUT = 250;
const PROGRAMMATIC_SCROLL_WINDOW = 100;
const LISTENER_CONTEXT_PREFIX = "useGalleryScroll";
function useGalleryScroll({
container,
scrollTarget,
onScroll,
onScrollEnd,
enabled = true,
programmaticScrollTimestamp
}) {
const containerAccessor = toAccessor(container);
const scrollTargetAccessor = toAccessor(scrollTarget ?? containerAccessor);
const enabledAccessor = toAccessor(enabled);
const programmaticTimestampAccessor = toAccessor(programmaticScrollTimestamp ?? 0);
const isGalleryOpen = createMemo(() => galleryState.value.isOpen);
const [isScrolling, setIsScrolling] = createSignal(false);
const [lastScrollTime, setLastScrollTime] = createSignal(0);
let scrollIdleTimerId = null;
const clearScrollIdleTimer = () => {
if (scrollIdleTimerId !== null) {
globalTimerManager.clearTimeout(scrollIdleTimerId);
scrollIdleTimerId = null;
}
};
const markScrolling = () => {
setIsScrolling(true);
setLastScrollTime(Date.now());
};
const scheduleScrollEnd = () => {
clearScrollIdleTimer();
scrollIdleTimerId = globalTimerManager.setTimeout(() => {
setIsScrolling(false);
onScrollEnd?.();
}, SCROLL_IDLE_TIMEOUT);
};
const shouldIgnoreScroll = () => Date.now() - programmaticTimestampAccessor() < PROGRAMMATIC_SCROLL_WINDOW;
const isToolbarScroll = (event) => {
const target = event.target;
if (!(target instanceof HTMLElement)) return false;
return !!(target.closest('[data-gallery-element="toolbar"]') || target.closest('[data-gallery-element="settings-panel"]') || target.closest('[data-gallery-element="tweet-panel"]') || target.closest('[data-role="toolbar"]'));
};
const handleWheel = (event) => {
if (!isGalleryOpen() || !isGalleryInternalEvent(event)) return;
if (isToolbarScroll(event)) return;
markScrolling();
onScroll?.();
scheduleScrollEnd();
};
const handleScroll = () => {
if (!isGalleryOpen() || shouldIgnoreScroll()) return;
markScrolling();
onScroll?.();
scheduleScrollEnd();
};
createEffect(() => {
const isEnabled = enabledAccessor();
const containerElement = containerAccessor();
const scrollElement = scrollTargetAccessor();
const eventTarget = scrollElement ?? containerElement;
if (!isEnabled || !eventTarget) {
setIsScrolling(false);
clearScrollIdleTimer();
return;
}
const eventManager = EventManager.getInstance();
const listenerContext = createPrefixedId(LISTENER_CONTEXT_PREFIX, ":");
const listenerIds = [];
const registerListener = (type, handler) => {
const id = eventManager.addListener(
eventTarget,
type,
handler,
{ passive: true },
listenerContext
);
if (id) {
listenerIds.push(id);
}
};
registerListener("wheel", handleWheel);
registerListener("scroll", handleScroll);
onCleanup(() => {
for (const id of listenerIds) {
eventManager.removeListener(id);
}
clearScrollIdleTimer();
setIsScrolling(false);
});
});
onCleanup(clearScrollIdleTimer);
return { isScrolling, lastScrollTime };
}
function useGalleryKeyboard({ onClose }) {
createEffect(() => {
if (typeof document === "undefined") {
return;
}
const isEditableTarget = (target) => {
const element = target;
if (!element) {
return false;
}
const tag = element.tagName?.toUpperCase();
if (tag === "INPUT" || tag === "TEXTAREA") {
return true;
}
return !!element.isContentEditable;
};
const handleKeyDown = (event) => {
const keyboardEvent = event;
if (isEditableTarget(keyboardEvent.target)) {
return;
}
let handled = false;
if (keyboardEvent.key === "Escape") {
onClose();
handled = true;
}
if (handled) {
keyboardEvent.preventDefault();
keyboardEvent.stopPropagation();
}
};
const eventManager = EventManager.getInstance();
const listenerId = eventManager.addListener(
document,
"keydown",
handleKeyDown,
{ capture: true },
"gallery-keyboard-navigation"
);
onCleanup(() => {
if (listenerId) {
eventManager.removeListener(listenerId);
}
});
});
}
function ensureGalleryScrollAvailable(element) {
if (!element) {
return;
}
const scrollableElements = element.querySelectorAll(
'[data-xeg-role="items-list"], .itemsList, .content'
);
scrollableElements.forEach((el) => {
if (el.style.overflowY !== "auto" && el.style.overflowY !== "scroll") {
el.style.overflowY = "auto";
}
});
}
function computeViewportConstraints(rect, chrome = {}) {
const vw = Math.max(0, Math.floor(rect.width));
const vh = Math.max(0, Math.floor(rect.height));
const top = Math.max(0, Math.floor(chrome.paddingTop ?? 0));
const bottom = Math.max(0, Math.floor(chrome.paddingBottom ?? 0));
const toolbar = Math.max(0, Math.floor(chrome.toolbarHeight ?? 0));
const constrained = Math.max(0, vh - top - bottom - toolbar);
return { viewportW: vw, viewportH: vh, constrainedH: constrained };
}
function applyViewportCssVars(el, v) {
el.style.setProperty("--xeg-viewport-w", `${v.viewportW}px`);
el.style.setProperty("--xeg-viewport-h", `${v.viewportH}px`);
el.style.setProperty("--xeg-viewport-height-constrained", `${v.constrainedH}px`);
}
function observeViewportCssVars(el, getChrome) {
let disposed = false;
const calcAndApply = () => {
if (disposed) return;
const rect = el.getBoundingClientRect();
const v = computeViewportConstraints({ width: rect.width, height: rect.height }, getChrome());
applyViewportCssVars(el, v);
};
let pending = false;
const schedule = () => {
if (pending) return;
pending = true;
if (typeof requestAnimationFrame === "function") {
requestAnimationFrame(() => {
pending = false;
calcAndApply();
});
} else {
globalTimerManager.setTimeout(() => {
pending = false;
calcAndApply();
}, 0);
}
};
calcAndApply();
let ro = null;
if (typeof ResizeObserver !== "undefined") {
ro = new ResizeObserver(() => schedule());
try {
ro.observe(el);
} catch {
}
}
const onResize = () => schedule();
let resizeListenerId = null;
if (typeof window !== "undefined") {
resizeListenerId = EventManager.getInstance().addListener(
window,
"resize",
createEventListener(onResize),
{ passive: true },
"viewport:resize"
);
}
return () => {
disposed = true;
if (ro) {
try {
ro.disconnect();
} catch {
}
}
if (resizeListenerId) {
EventManager.getInstance().removeListener(resizeListenerId);
resizeListenerId = null;
}
};
}
const ANIMATION_CLASSES = {
FADE_IN: "xeg-fade-in",
FADE_OUT: "xeg-fade-out"
};
function runCssAnimation(element, className) {
return new Promise((resolve) => {
try {
const handleAnimationEnd = () => {
element.classList.remove(className);
resolve();
};
element.addEventListener("animationend", handleAnimationEnd, { once: true });
element.classList.add(className);
} catch (error) {
resolve();
}
});
}
async function animateGalleryEnter(element) {
return runCssAnimation(element, ANIMATION_CLASSES.FADE_IN);
}
async function animateGalleryExit(element) {
return runCssAnimation(element, ANIMATION_CLASSES.FADE_OUT);
}
function useGalleryLifecycle(options) {
const { containerEl, toolbarWrapperEl, isVisible } = options;
createEffect(
on(containerEl, (element) => {
if (element) {
ensureGalleryScrollAvailable(element);
}
})
);
createEffect(
on(
[containerEl, isVisible],
([container, visible]) => {
if (!container) return;
if (visible) {
animateGalleryEnter(container);
} else {
animateGalleryExit(container);
const videos = container.querySelectorAll("video");
videos.forEach((video) => {
try {
video.pause();
} catch (error) {
}
try {
if (video.currentTime !== 0) {
video.currentTime = 0;
}
} catch (error) {
}
});
}
},
{ defer: true }
)
);
createEffect(() => {
const container = containerEl();
const wrapper = toolbarWrapperEl();
if (!container || !wrapper) return;
const cleanup = observeViewportCssVars(container, () => {
const toolbarHeight = wrapper ? Math.floor(wrapper.getBoundingClientRect().height) : 0;
return { toolbarHeight, paddingTop: 0, paddingBottom: 0 };
});
onCleanup(() => {
cleanup?.();
});
});
}
function useGalleryNavigation(options) {
const { isVisible, scrollToItem } = options;
const [lastNavigationTrigger, setLastNavigationTrigger] = createSignal(
null
);
const [programmaticScrollTimestamp, setProgrammaticScrollTimestamp] = createSignal(0);
createEffect(
on(isVisible, (visible) => {
if (!visible) {
return;
}
const dispose = registerNavigationEvents({
onTriggerChange: setLastNavigationTrigger,
onNavigateComplete: ({ index, trigger }) => {
if (trigger === "scroll") {
return;
}
scrollToItem(index);
}
});
onCleanup(dispose);
})
);
return {
lastNavigationTrigger,
setLastNavigationTrigger,
programmaticScrollTimestamp,
setProgrammaticScrollTimestamp
};
}
function registerNavigationEvents({
onTriggerChange,
onNavigateComplete
}) {
const stopStart = galleryIndexEvents.on(
"navigate:start",
(payload) => onTriggerChange(payload.trigger)
);
const stopComplete = galleryIndexEvents.on(
"navigate:complete",
(payload) => {
onTriggerChange(payload.trigger);
onNavigateComplete(payload);
}
);
return () => {
stopStart();
stopComplete();
};
}
function useToolbarAutoHide(options) {
const { isVisible, hasItems } = options;
const computeInitialVisibility = () => !!(isVisible() && hasItems());
const [isInitialToolbarVisible, setIsInitialToolbarVisible] = createSignal(
computeInitialVisibility()
);
let activeTimer = null;
const clearActiveTimer = () => {
if (activeTimer === null) {
return;
}
globalTimerManager.clearTimeout(activeTimer);
activeTimer = null;
};
createEffect(() => {
onCleanup(clearActiveTimer);
if (!computeInitialVisibility()) {
setIsInitialToolbarVisible(false);
return;
}
setIsInitialToolbarVisible(true);
const rawAutoHideDelay = getTypedSettingOr("toolbar.autoHideDelay", 3e3);
const autoHideDelay = Math.max(0, typeof rawAutoHideDelay === "number" ? rawAutoHideDelay : 0);
if (autoHideDelay === 0) {
setIsInitialToolbarVisible(false);
return;
}
activeTimer = globalTimerManager.setTimeout(() => {
setIsInitialToolbarVisible(false);
activeTimer = null;
}, autoHideDelay);
});
return {
isInitialToolbarVisible,
setIsInitialToolbarVisible
};
}
function useVerticalGallery(options) {
const {
isVisible,
currentIndex,
mediaItemsCount,
containerEl,
toolbarWrapperEl,
itemsContainerEl,
onClose
} = options;
let focusSyncCallback = null;
const { isInitialToolbarVisible, setIsInitialToolbarVisible } = useToolbarAutoHide({
isVisible,
hasItems: () => mediaItemsCount() > 0
});
let scrollToItemRef = null;
const navigationState = useGalleryNavigation({
isVisible,
scrollToItem: (index) => scrollToItemRef?.(index)
});
const { isScrolling } = useGalleryScroll({
container: containerEl,
scrollTarget: itemsContainerEl,
enabled: isVisible,
programmaticScrollTimestamp: () => navigationState.programmaticScrollTimestamp(),
onScrollEnd: () => focusSyncCallback?.()
});
const { scrollToItem, scrollToCurrentItem } = useGalleryItemScroll(
containerEl,
currentIndex,
mediaItemsCount,
{
enabled: () => !isScrolling() && navigationState.lastNavigationTrigger() !== "scroll",
block: "start",
isScrolling,
onScrollStart: () => navigationState.setProgrammaticScrollTimestamp(Date.now())
}
);
scrollToItemRef = scrollToItem;
const {
focusedIndex,
registerItem: registerFocusItem,
handleItemFocus,
forceSync: focusTrackerForceSync
} = useGalleryFocusTracker({
container: containerEl,
isEnabled: isVisible,
isScrolling,
lastNavigationTrigger: navigationState.lastNavigationTrigger
});
focusSyncCallback = focusTrackerForceSync;
useGalleryLifecycle({
containerEl,
toolbarWrapperEl,
isVisible
});
createEffect(() => {
if (isScrolling()) {
setIsInitialToolbarVisible(false);
}
});
useGalleryKeyboard({
onClose: onClose ?? (() => {
})
});
return {
scroll: {
isScrolling,
scrollToItem,
scrollToCurrentItem
},
navigation: {
lastNavigationTrigger: navigationState.lastNavigationTrigger,
setLastNavigationTrigger: navigationState.setLastNavigationTrigger,
programmaticScrollTimestamp: navigationState.programmaticScrollTimestamp,
setProgrammaticScrollTimestamp: navigationState.setProgrammaticScrollTimestamp
},
focus: {
focusedIndex,
registerItem: registerFocusItem,
handleItemFocus,
forceSync: focusTrackerForceSync
},
toolbar: {
isInitialToolbarVisible,
setIsInitialToolbarVisible
}
};
}
const container$1 = "xg-X9gZ";
const toolbarWrapper = "xg-meO3";
const isScrolling = "xg-sOsS";
const itemsContainer = "xg-gmRW";
const empty = "xg-yhK-";
const galleryItem = "xg-EfVa";
const itemActive = "xg-LxHL";
const scrollSpacer = "xg-sfF0";
const toolbarHoverZone = "xg-gC-m";
const initialToolbarVisible = "xg-Canm";
const emptyMessage = "xg-fwsr";
const styles$1 = {
container: container$1,
toolbarWrapper: toolbarWrapper,
isScrolling: isScrolling,
itemsContainer: itemsContainer,
empty: empty,
galleryItem: galleryItem,
itemActive: itemActive,
scrollSpacer: scrollSpacer,
toolbarHoverZone: toolbarHoverZone,
initialToolbarVisible: initialToolbarVisible,
emptyMessage: emptyMessage
};
function createDebounced(fn, delayMs = 300) {
let timeoutId = null;
let pendingArgs = null;
const cancel = () => {
if (timeoutId !== null) {
globalTimerManager.clearTimeout(timeoutId);
timeoutId = null;
}
pendingArgs = null;
};
const flush = () => {
if (timeoutId !== null && pendingArgs !== null) {
globalTimerManager.clearTimeout(timeoutId);
timeoutId = null;
const args = pendingArgs;
pendingArgs = null;
fn(...args);
}
};
const debounced = ((...args) => {
cancel();
pendingArgs = args;
timeoutId = globalTimerManager.setTimeout(() => {
timeoutId = null;
const savedArgs = pendingArgs;
pendingArgs = null;
if (savedArgs !== null) {
fn(...savedArgs);
}
}, delayMs);
});
debounced.cancel = cancel;
debounced.flush = flush;
return debounced;
}
function createVideoVisibilityController(options) {
const { video, setMuted } = options;
let wasPlayingBeforeHidden = false;
let wasMutedBeforeHidden = null;
let didAutoMute = false;
const pauseVideo = () => {
if (typeof video.pause === "function") {
video.pause();
}
};
const playVideo = () => {
if (typeof video.play !== "function") {
return;
}
try {
const result = video.play();
if (result && typeof result.catch === "function") {
void result.catch((err) => {
if (false) ;
});
}
} catch (err) {
}
};
const applyMuted = (nextMuted) => {
if (typeof setMuted === "function") {
setMuted(video, nextMuted);
return;
}
video.muted = nextMuted;
};
return {
handleEntry(entry) {
if (!entry.isIntersecting) {
try {
if (wasMutedBeforeHidden === null) {
wasPlayingBeforeHidden = !video.paused;
wasMutedBeforeHidden = video.muted;
didAutoMute = false;
}
if (!video.muted) {
applyMuted(true);
didAutoMute = true;
}
if (!video.paused) {
pauseVideo();
}
} catch (err) {
}
} else {
try {
if (wasMutedBeforeHidden !== null) {
if (didAutoMute && video.muted === true && wasMutedBeforeHidden === false) {
applyMuted(false);
}
}
if (wasPlayingBeforeHidden) {
playVideo();
}
} catch (err) {
} finally {
wasPlayingBeforeHidden = false;
wasMutedBeforeHidden = null;
didAutoMute = false;
}
}
}
};
}
function useVideoVisibility(options) {
const { container, video, isVideo, setMuted } = options;
createEffect(() => {
if (!isVideo()) {
return;
}
const containerEl = container();
const videoEl = video();
if (!containerEl || !videoEl) {
return;
}
const controller = createVideoVisibilityController(
typeof setMuted === "function" ? { video: videoEl, setMuted } : { video: videoEl }
);
const unsubscribeObserver = SharedObserver.observe(containerEl, controller.handleEntry, {
threshold: 0,
rootMargin: "0px"
});
onCleanup(() => {
unsubscribeObserver();
});
});
}
const DEFAULT_VOLUME_EPSILON = 1e-3;
function areVolumesEquivalent(a, b) {
if (!Number.isFinite(a) || !Number.isFinite(b)) {
return a === b;
}
return Math.abs(a - b) <= DEFAULT_VOLUME_EPSILON;
}
function nowMs() {
return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
function createVideoVolumeChangeGuard(options = {}) {
const windowMs = options.windowMs ?? 500;
const MAX_EXPECTED_MARKS = 4;
let expectedMarks = [];
const pruneExpiredMarks = (now) => {
if (expectedMarks.length === 0) return;
expectedMarks = expectedMarks.filter((mark) => {
const age = now - mark.markedAt;
if (age < 0) return false;
return age <= windowMs;
});
};
return {
markProgrammaticChange(expected) {
const now = nowMs();
pruneExpiredMarks(now);
expectedMarks = [...expectedMarks, { snapshot: expected, markedAt: now }];
if (expectedMarks.length > MAX_EXPECTED_MARKS) {
expectedMarks = expectedMarks.slice(-MAX_EXPECTED_MARKS);
}
},
shouldIgnoreChange(current) {
if (expectedMarks.length === 0) return false;
const now = nowMs();
pruneExpiredMarks(now);
if (expectedMarks.length === 0) {
return false;
}
return expectedMarks.some(
(mark) => areVolumesEquivalent(current.volume, mark.snapshot.volume) && current.muted === mark.snapshot.muted
);
}
};
}
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi"];
function cleanFilename(filename) {
if (!filename) {
return "Untitled";
}
const MAX_LENGTH = 40;
const TRUNCATION_MARKER = "...";
const truncateMiddlePreservingExtension = (value) => {
if (value.length <= MAX_LENGTH) {
return value;
}
const extensionMatch = value.match(/(\.[^./\\]{1,10})$/);
const extension = extensionMatch?.[1] ?? "";
const base = extension ? value.slice(0, -extension.length) : value;
const available = MAX_LENGTH - extension.length - TRUNCATION_MARKER.length;
if (available <= 1) {
return value.slice(0, MAX_LENGTH);
}
const headLen = Math.max(1, Math.floor(available / 2));
const tailLen = Math.max(1, available - headLen);
const head = base.slice(0, headLen);
const tail = base.slice(Math.max(0, base.length - tailLen));
return `${head}${TRUNCATION_MARKER}${tail}${extension}`;
};
let cleaned = filename.replace(/^twitter_media_\d{8}T\d{6}_/, "").replace(/^\/media\//, "").replace(/^\.\//, "");
const lastSegment = cleaned.split(/[\\/]/).pop();
if (lastSegment) {
cleaned = lastSegment;
}
if (/^[\\/]+$/.test(cleaned)) {
cleaned = "";
}
cleaned = cleaned.trim();
if (!cleaned) {
return "Image";
}
return truncateMiddlePreservingExtension(cleaned);
}
function normalizeVideoVolumeSetting(value, fallback = 1) {
const candidate = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
if (!Number.isFinite(candidate)) {
return fallback;
}
return Math.min(1, Math.max(0, candidate));
}
function normalizeVideoMutedSetting(value, fallback = false) {
if (typeof value === "boolean") {
return value;
}
if (typeof value === "number") {
return value !== 0;
}
if (typeof value === "string") {
const normalized = value.trim().toLowerCase();
if (normalized === "true" || normalized === "1") {
return true;
}
if (normalized === "false" || normalized === "0") {
return false;
}
}
return fallback;
}
function isVideoMedia(media) {
const urlLowerCase = media.url.toLowerCase();
let parsedUrl = null;
try {
parsedUrl = new URL(media.url);
} catch {
parsedUrl = null;
}
const pathToCheck = parsedUrl ? parsedUrl.pathname.toLowerCase() : urlLowerCase.split(/[?#]/)[0] ?? "";
if (VIDEO_EXTENSIONS.some((ext) => pathToCheck.endsWith(ext))) {
return true;
}
if (media.filename) {
const filenameLowerCase = media.filename.toLowerCase();
if (VIDEO_EXTENSIONS.some((ext) => filenameLowerCase.endsWith(ext))) {
return true;
}
}
if (parsedUrl) {
return parsedUrl.hostname === "video.twimg.com";
}
return false;
}
const container = "xg-huYo";
const active = "xg-xm-1";
const focused = "xg-luqi";
const imageWrapper = "xg-8-c8";
const placeholder = "xg-lhkE";
const loadingSpinner = "xg-6YYD";
const image = "xg-FWlk";
const video = "xg-GUev";
const loading = "xg-8Z3S";
const loaded = "xg-y9iP";
const fitOriginal = "xg-yYtG";
const fitWidth = "xg-Uc0o";
const fitHeight = "xg-M9Z6";
const fitContainer = "xg--Mlr";
const errorIcon = "xg-Wno7";
const errorText = "xg-8-wi";
const error = "xg-Gswe";
const styles = {
container: container,
active: active,
focused: focused,
imageWrapper: imageWrapper,
placeholder: placeholder,
loadingSpinner: loadingSpinner,
image: image,
video: video,
loading: loading,
loaded: loaded,
fitOriginal: fitOriginal,
fitWidth: fitWidth,
fitHeight: fitHeight,
fitContainer: fitContainer,
errorIcon: errorIcon,
errorText: errorText,
error: error
};
var _tmpl$$3 =  template(`<div data-xeg-role=gallery-item data-xeg-gallery=true data-xeg-gallery-type=item data-xeg-gallery-version=2.0 data-xeg-component=vertical-image-item data-xeg-block-twitter=true><div data-xeg-role=media-wrapper>`), _tmpl$2$1 =  template(`<div><div>`), _tmpl$3 =  template(`<video controls>`), _tmpl$4 =  template(`<img decoding=async>`, true, false, false), _tmpl$5 =  template(`<div><span>⚠️</span><span>`);
const FIT_MODE_CLASSES = {
original: styles.fitOriginal,
fitHeight: styles.fitHeight,
fitWidth: styles.fitWidth,
fitContainer: styles.fitContainer
};
function VerticalImageItem(props) {
const [local] = splitProps(props, [
"media",
"index",
"isActive",
"isFocused",
"forceVisible",
"isVisible",
"onClick",
"onImageContextMenu",
"className",
"onMediaLoad",
"fitMode",
"style",
"data-testid",
"aria-label",
"aria-describedby",
"registerContainer",
"role",
"tabIndex",
"onFocus",
"onBlur",
"onKeyDown"
]);
const isFocused = createMemo(() => local.isFocused ?? false);
const className$1 = createMemo(() => local.className ?? "");
const shouldEagerLoad = createMemo(() => {
const isPreloaded = local.forceVisible ?? false;
const isCurrent = local.isActive ?? false;
return isPreloaded || isCurrent;
});
const translate = useTranslation();
const isVideo = createMemo(() => {
switch (local.media.type) {
case "video":
case "gif":
return true;
case "image":
return false;
default:
return isVideoMedia(local.media);
}
});
const [isLoaded, setIsLoaded] = createSignal(false);
const [isError, setIsError] = createSignal(false);
createEffect(() => {
setIsLoaded(false);
setIsError(false);
});
const [containerRef, setContainerRef] = createSignal(null);
const [imageRef, setImageRef] = createSignal(null);
const [videoRef, setVideoRef] = createSignal(null);
const resolvedDimensions = createMemo(() => resolveMediaDimensionsWithIntrinsicFlag(local.media));
const dimensions = () => resolvedDimensions().dimensions;
const hasIntrinsicSize = () => resolvedDimensions().hasIntrinsicSize;
const intrinsicSizingStyle = createMemo(() => {
return createIntrinsicSizingStyle(dimensions());
});
const mergedStyle = createMemo(() => {
const base = intrinsicSizingStyle();
const extra = local.style ?? {};
return {
...base,
...extra
};
});
const volumeChangeGuard = createVideoVolumeChangeGuard();
const applyMutedProgrammatically = (videoEl, muted) => {
volumeChangeGuard.markProgrammaticChange({
volume: videoEl.volume,
muted
});
videoEl.muted = muted;
};
const applyVolumeProgrammatically = (videoEl, volume) => {
volumeChangeGuard.markProgrammaticChange({
volume,
muted: videoEl.muted
});
videoEl.volume = volume;
};
useVideoVisibility({
container: containerRef,
video: videoRef,
isVideo,
setMuted: applyMutedProgrammatically
});
createEffect(() => {
const video = videoRef();
if (local.isActive && video) {
const alreadySignaled = untrack(() => gallerySignals.currentVideoElement.value === video);
if (!alreadySignaled) {
gallerySignals.currentVideoElement.value = video;
}
return;
}
const shouldClear = untrack(() => gallerySignals.currentVideoElement.value === video);
if (shouldClear) {
gallerySignals.currentVideoElement.value = null;
}
});
const [videoVolume, setVideoVolume] = createSignal(normalizeVideoVolumeSetting(getTypedSettingOr("gallery.videoVolume", 1), 1));
const [videoMuted, setVideoMuted] = createSignal(normalizeVideoMutedSetting(getTypedSettingOr("gallery.videoMuted", false), false));
let isApplyingVideoSettings = false;
createEffect(() => {
const video = videoRef();
if (video && isVideo()) {
isApplyingVideoSettings = true;
try {
untrack(() => {
const nextMuted = normalizeVideoMutedSetting(videoMuted(), false);
const nextVolume = normalizeVideoVolumeSetting(videoVolume(), 1);
if (nextMuted !== videoMuted()) {
setVideoMuted(nextMuted);
}
if (nextVolume !== videoVolume()) {
setVideoVolume(nextVolume);
}
applyMutedProgrammatically(video, nextMuted);
applyVolumeProgrammatically(video, nextVolume);
});
} finally {
isApplyingVideoSettings = false;
}
}
});
const debouncedSaveVolume = createDebounced((volume, muted) => {
void setTypedSetting("gallery.videoVolume", volume);
void setTypedSetting("gallery.videoMuted", muted);
}, 300);
onCleanup(() => {
debouncedSaveVolume.flush();
});
const handleVolumeChange = (event) => {
const video = event.currentTarget;
const snapshot = {
volume: video.volume,
muted: video.muted
};
if (isApplyingVideoSettings || volumeChangeGuard.shouldIgnoreChange(snapshot)) {
return;
}
const newVolume = normalizeVideoVolumeSetting(snapshot.volume, 1);
const newMuted = normalizeVideoMutedSetting(snapshot.muted, false);
setVideoVolume(newVolume);
setVideoMuted(newMuted);
debouncedSaveVolume(newVolume, newMuted);
};
const preventDragStart = (event) => {
event.preventDefault();
};
const handleContainerClick = (event) => {
event.stopPropagation();
if (isVideo()) {
const video = videoRef();
if (video) {
const target = event.target;
const targetInVideo = target instanceof Node && video.contains(target);
const path = typeof event.composedPath === "function" ? event.composedPath() : [];
const pathIncludesVideo = Array.isArray(path) && path.includes(video);
if (targetInVideo || pathIncludesVideo) {
return;
}
}
containerRef()?.focus?.({
preventScroll: true
});
local.onClick();
return;
}
containerRef()?.focus?.({
preventScroll: true
});
local.onClick();
};
const handleContainerKeyDown = (event) => {
if (typeof local.onKeyDown === "function") {
local.onKeyDown(event);
return;
}
if ((local.role ?? (isVideo() ? "group" : "button")) !== "button") {
return;
}
const key = event.key;
if (key === "Enter" || key === " " || key === "Spacebar") {
event.preventDefault();
event.stopPropagation();
local.onClick();
}
};
const handleMediaLoad = () => {
if (!isLoaded()) {
setIsLoaded(true);
setIsError(false);
local.onMediaLoad?.(local.media.id, local.index);
}
};
const handleMediaError = () => {
setIsError(true);
setIsLoaded(false);
};
const handleContextMenu = (event) => {
local.onImageContextMenu?.(event, local.media);
};
createEffect(() => {
if (isLoaded()) {
return;
}
if (isVideo()) {
const video = videoRef();
if (video && video.readyState >= 1) {
handleMediaLoad();
}
} else {
const image = imageRef();
if (image?.complete) {
if (image.naturalWidth > 0) {
handleMediaLoad();
} else {
handleMediaError();
}
}
}
});
const resolvedFitMode = createMemo(() => {
const value = local.fitMode;
if (typeof value === "function") {
return value() ?? "fitWidth";
}
return value ?? "fitWidth";
});
const fitModeClass = createMemo(() => FIT_MODE_CLASSES[resolvedFitMode()] ?? "");
const containerClasses = createMemo(() => cx("xeg-gallery", "xeg-gallery-item", "vertical-item", styles.container, local.isActive ? styles.active : void 0, isFocused() ? styles.focused : void 0, className$1()));
const assignContainerRef = (element) => {
setContainerRef(element);
local.registerContainer?.(element);
};
const defaultContainerRole = createMemo(() => isVideo() ? "group" : "button");
const resolvedContainerRole = createMemo(() => local.role ?? defaultContainerRole());
const defaultAriaLabel = createMemo(() => translate("msg.gal.itemLbl", {
index: local.index + 1,
filename: cleanFilename(local.media.filename)
}));
return (() => {
var _el$ = _tmpl$$3(), _el$2 = _el$.firstChild;
_el$.$$keydown = handleContainerKeyDown;
addEventListener(_el$, "blur", local.onBlur);
addEventListener(_el$, "focus", local.onFocus);
_el$.$$click = handleContainerClick;
use(assignContainerRef, _el$);
insert(_el$2, (() => {
var _c$ = memo(() => !!(!isLoaded() && !isError() && !isVideo()));
return () => _c$() && (() => {
var _el$3 = _tmpl$2$1(), _el$4 = _el$3.firstChild;
createRenderEffect((_p$) => {
var _v$11 = styles.placeholder, _v$12 = cx("xeg-spinner", styles.loadingSpinner);
_v$11 !== _p$.e && className(_el$3, _p$.e = _v$11);
_v$12 !== _p$.t && className(_el$4, _p$.t = _v$12);
return _p$;
}, {
e: void 0,
t: void 0
});
return _el$3;
})();
})(), null);
insert(_el$2, (() => {
var _c$2 = memo(() => !!isVideo());
return () => _c$2() ? (() => {
var _el$5 = _tmpl$3();
_el$5.addEventListener("volumechange", handleVolumeChange);
_el$5.addEventListener("dragstart", preventDragStart);
_el$5.$$contextmenu = handleContextMenu;
_el$5.addEventListener("error", handleMediaError);
_el$5.addEventListener("canplay", handleMediaLoad);
_el$5.addEventListener("loadeddata", handleMediaLoad);
_el$5.addEventListener("loadedmetadata", handleMediaLoad);
use(setVideoRef, _el$5);
createRenderEffect((_p$) => {
var _v$13 = local.media.url, _v$14 = cx(styles.video, fitModeClass(), isLoaded() ? styles.loaded : styles.loading);
_v$13 !== _p$.e && setAttribute(_el$5, "src", _p$.e = _v$13);
_v$14 !== _p$.t && className(_el$5, _p$.t = _v$14);
return _p$;
}, {
e: void 0,
t: void 0
});
return _el$5;
})() : (() => {
var _el$6 = _tmpl$4();
_el$6.addEventListener("dragstart", preventDragStart);
_el$6.$$contextmenu = handleContextMenu;
_el$6.addEventListener("error", handleMediaError);
_el$6.addEventListener("load", handleMediaLoad);
use(setImageRef, _el$6);
createRenderEffect((_p$) => {
var _v$15 = local.media.url, _v$16 = cleanFilename(local.media.filename), _v$17 = shouldEagerLoad() ? "eager" : "lazy", _v$18 = cx(styles.image, fitModeClass(), isLoaded() ? styles.loaded : styles.loading);
_v$15 !== _p$.e && setAttribute(_el$6, "src", _p$.e = _v$15);
_v$16 !== _p$.t && setAttribute(_el$6, "alt", _p$.t = _v$16);
_v$17 !== _p$.a && setAttribute(_el$6, "loading", _p$.a = _v$17);
_v$18 !== _p$.o && className(_el$6, _p$.o = _v$18);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0
});
return _el$6;
})();
})(), null);
insert(_el$2, (() => {
var _c$3 = memo(() => !!isError());
return () => _c$3() && (() => {
var _el$7 = _tmpl$5(), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling;
insert(_el$9, () => translate("msg.gal.loadFail", {
type: isVideo() ? "video" : "image"
}));
createRenderEffect((_p$) => {
var _v$19 = styles.error, _v$20 = styles.errorIcon, _v$21 = styles.errorText;
_v$19 !== _p$.e && className(_el$7, _p$.e = _v$19);
_v$20 !== _p$.t && className(_el$8, _p$.t = _v$20);
_v$21 !== _p$.a && className(_el$9, _p$.a = _v$21);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0
});
return _el$7;
})();
})(), null);
createRenderEffect((_p$) => {
var _v$ = containerClasses(), _v$2 = local.index, _v$3 = resolvedFitMode(), _v$4 = isLoaded() ? "true" : "false", _v$5 = hasIntrinsicSize() ? "true" : void 0, _v$6 = mergedStyle(), _v$7 = local["aria-label"] || defaultAriaLabel(), _v$8 = local["aria-describedby"], _v$9 = resolvedContainerRole(), _v$0 = local.tabIndex ?? 0, _v$1 = void 0, _v$10 = styles.imageWrapper;
_v$ !== _p$.e && className(_el$, _p$.e = _v$);
_v$2 !== _p$.t && setAttribute(_el$, "data-index", _p$.t = _v$2);
_v$3 !== _p$.a && setAttribute(_el$, "data-fit-mode", _p$.a = _v$3);
_v$4 !== _p$.o && setAttribute(_el$, "data-media-loaded", _p$.o = _v$4);
_v$5 !== _p$.i && setAttribute(_el$, "data-has-intrinsic-size", _p$.i = _v$5);
_p$.n = style(_el$, _v$6, _p$.n);
_v$7 !== _p$.s && setAttribute(_el$, "aria-label", _p$.s = _v$7);
_v$8 !== _p$.h && setAttribute(_el$, "aria-describedby", _p$.h = _v$8);
_v$9 !== _p$.r && setAttribute(_el$, "role", _p$.r = _v$9);
_v$0 !== _p$.d && setAttribute(_el$, "tabindex", _p$.d = _v$0);
_v$1 !== _p$.l && setAttribute(_el$, "data-testid", _p$.l = _v$1);
_v$10 !== _p$.u && className(_el$2, _p$.u = _v$10);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0,
n: void 0,
s: void 0,
h: void 0,
r: void 0,
d: void 0,
l: void 0,
u: void 0
});
return _el$;
})();
}
delegateEvents(["click", "keydown", "contextmenu"]);
var _tmpl$$2 =  template(`<div><div><h3></h3><p>`), _tmpl$2 =  template(`<div data-xeg-gallery=true data-xeg-role=gallery><div data-role=toolbar-hover-zone></div><div data-role=toolbar></div><div data-xeg-role=items-container data-xeg-role-compat=items-list><div aria-hidden=true data-xeg-role=scroll-spacer>`);
function VerticalGalleryViewCore({
onClose,
className: className$1 = "",
onPrevious,
onNext,
onDownloadCurrent,
onDownloadAll
}) {
const mediaItems = createMemo(() => galleryState.value.mediaItems);
const currentIndex = createMemo(() => galleryState.value.currentIndex);
const isDownloading = createMemo(() => isDownloadUiBusy({
downloadProcessing: downloadState.value.isProcessing
}));
const [containerEl, setContainerEl] = createSignal(null);
const [toolbarWrapperEl, setToolbarWrapperEl] = createSignal(null);
const [itemsContainerEl, setItemsContainerEl] = createSignal(null);
const isVisible = createMemo(() => mediaItems().length > 0);
const activeMedia = createMemo(() => {
const items = mediaItems();
const index = currentIndex();
return items[index] ?? null;
});
const preloadIndices = createMemo(() => {
const count = getTypedSettingOr("gallery.preloadCount", 3);
return computePreloadIndices(currentIndex(), mediaItems().length, count);
});
const {
scroll,
navigation,
focus,
toolbar
} = useVerticalGallery({
isVisible,
currentIndex,
mediaItemsCount: () => mediaItems().length,
containerEl,
toolbarWrapperEl,
itemsContainerEl,
onClose
});
const translate = useTranslation();
createEffect(() => {
if (!isVisible() || navigation.lastNavigationTrigger()) {
return;
}
navigateToItem(currentIndex(), "click");
});
const getInitialFitMode = () => {
return getTypedSettingOr("gallery.imageFitMode", "fitWidth");
};
const [imageFitMode, setImageFitMode] = createSignal(getInitialFitMode());
const persistFitMode = (mode) => setTypedSetting("gallery.imageFitMode", mode).catch((error) => {
});
const applyFitMode = (mode, event) => {
safeEventPrevent(event);
setImageFitMode(mode);
void persistFitMode(mode);
scroll.scrollToCurrentItem();
navigateToItem(currentIndex(), "click");
};
const handleDownloadCurrent = () => onDownloadCurrent?.();
const handleDownloadAll = () => onDownloadAll?.();
const handleFitOriginal = (event) => applyFitMode("original", event);
const handleFitWidth = (event) => applyFitMode("fitWidth", event);
const handleFitHeight = (event) => applyFitMode("fitHeight", event);
const handleFitContainer = (event) => applyFitMode("fitContainer", event);
const handlePrevious = () => {
const current = currentIndex();
if (current > 0) {
navigateToItem(current - 1, "click");
}
};
const handleNext = () => {
const current = currentIndex();
const items = mediaItems();
if (current < items.length - 1) {
navigateToItem(current + 1, "click");
}
};
const handleBackgroundClick = (event) => {
const target = event.target;
if (!(target instanceof Element)) {
return;
}
const ignoreSelector = '[data-role="toolbar"], [data-role="toolbar-hover-zone"], [data-gallery-element], [data-xeg-role="gallery-item"], [data-xeg-role="scroll-spacer"]';
if (target.closest(ignoreSelector)) {
return;
}
onClose?.();
};
const handleMediaItemClick = (index) => {
const items = mediaItems();
const current = currentIndex();
if (index >= 0 && index < items.length && index !== current) {
navigateToItem(index, "click");
}
};
createEffect(() => {
const container = containerEl();
if (!container) return;
const controller = new AbortController();
const handleContainerWheel = (event) => {
const itemsContainer = itemsContainerEl();
if (!itemsContainer) return;
const target = event.target;
if (!(target instanceof Element)) {
return;
}
if (itemsContainer.contains(target)) {
return;
}
event.preventDefault();
event.stopPropagation();
itemsContainer.scrollTop += event.deltaY;
};
const eventManager = EventManager.getInstance();
const listener = (event) => {
handleContainerWheel(event);
};
eventManager.addEventListener(container, "wheel", listener, {
passive: false,
signal: controller.signal,
context: "gallery:wheel:container-redirect"
});
onCleanup(() => controller.abort());
});
if (!isVisible()) {
return (() => {
var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
insert(_el$3, () => translate("msg.gal.emptyT"));
insert(_el$4, () => translate("msg.gal.emptyD"));
createRenderEffect((_p$) => {
var _v$ = cx(styles$1.container, styles$1.empty, className$1), _v$2 = styles$1.emptyMessage;
_v$ !== _p$.e && className(_el$, _p$.e = _v$);
_v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
return _p$;
}, {
e: void 0,
t: void 0
});
return _el$;
})();
}
return (() => {
var _el$5 = _tmpl$2(), _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling, _el$9 = _el$8.firstChild;
_el$5.$$click = handleBackgroundClick;
use((el) => setContainerEl(el ?? null), _el$5);
use((el) => setToolbarWrapperEl(el ?? null), _el$7);
insert(_el$7, createComponent(Toolbar, {
currentIndex,
get focusedIndex() {
return focus.focusedIndex;
},
totalCount: () => mediaItems().length,
isDownloading,
get currentFitMode() {
return imageFitMode();
},
tweetText: () => activeMedia()?.tweetText,
tweetTextHTML: () => activeMedia()?.tweetTextHTML,
tweetUrl: () => activeMedia()?.tweetUrl,
get className() {
return styles$1.toolbar || "";
},
handlers: {
navigation: {
onPrevious: onPrevious || handlePrevious,
onNext: onNext || handleNext
},
download: {
onDownloadCurrent: handleDownloadCurrent,
onDownloadAll: handleDownloadAll
},
fitMode: {
onFitOriginal: handleFitOriginal,
onFitWidth: handleFitWidth,
onFitHeight: handleFitHeight,
onFitContainer: handleFitContainer
},
lifecycle: {
onClose: onClose || (() => {
}),
onOpenSettings: () => {
}
}
}
}));
use((el) => setItemsContainerEl(el ?? null), _el$8);
insert(_el$8, createComponent(For, {
get each() {
return mediaItems();
},
children: (item, index) => {
const actualIndex = index();
const forcePreload = preloadIndices().includes(actualIndex);
return createComponent(VerticalImageItem, {
media: item,
index: actualIndex,
get isActive() {
return actualIndex === currentIndex();
},
get isFocused() {
return actualIndex === focus.focusedIndex();
},
forceVisible: forcePreload,
fitMode: imageFitMode,
onClick: () => handleMediaItemClick(actualIndex),
get className() {
return cx(styles$1.galleryItem, actualIndex === currentIndex() && styles$1.itemActive);
},
registerContainer: (element) => focus.registerItem(actualIndex, element),
onFocus: () => focus.handleItemFocus(actualIndex)
});
}
}), _el$9);
createRenderEffect((_p$) => {
var _v$3 = cx(styles$1.container, toolbar.isInitialToolbarVisible() && styles$1.initialToolbarVisible, scroll.isScrolling() && styles$1.isScrolling, className$1), _v$4 = styles$1.toolbarHoverZone, _v$5 = styles$1.toolbarWrapper, _v$6 = styles$1.itemsContainer, _v$7 = styles$1.scrollSpacer;
_v$3 !== _p$.e && className(_el$5, _p$.e = _v$3);
_v$4 !== _p$.t && className(_el$6, _p$.t = _v$4);
_v$5 !== _p$.a && className(_el$7, _p$.a = _v$5);
_v$6 !== _p$.o && className(_el$8, _p$.o = _v$6);
_v$7 !== _p$.i && className(_el$9, _p$.i = _v$7);
return _p$;
}, {
e: void 0,
t: void 0,
a: void 0,
o: void 0,
i: void 0
});
return _el$5;
})();
}
const VerticalGalleryView = VerticalGalleryViewCore;
delegateEvents(["click"]);
var _tmpl$$1 =  template(`<div data-xeg-gallery-container>`);
const DISPOSE_SYMBOL =  Symbol();
function mountGallery(container, element) {
const host = container;
host[DISPOSE_SYMBOL]?.();
const factory = typeof element === "function" ? element : () => element ?? null;
host[DISPOSE_SYMBOL] = render(factory, host);
return container;
}
function unmountGallery(container) {
const host = container;
host[DISPOSE_SYMBOL]?.();
delete host[DISPOSE_SYMBOL];
container.replaceChildren();
}
function GalleryContainer({
children,
onClose,
className: className$1,
registerEscapeListener
}) {
const classes = cx("xeg-gallery-overlay", "xeg-gallery-container", className$1);
const hasCloseHandler = typeof onClose === "function";
const escapeListener = (event) => {
if (!hasCloseHandler) {
return;
}
const keyboardEvent = event;
if (keyboardEvent.key === "Escape") {
keyboardEvent.preventDefault();
keyboardEvent.stopPropagation();
onClose?.();
}
};
createEffect(() => {
if (!hasCloseHandler) {
return;
}
const eventManager = EventManager.getInstance();
const listenerId = eventManager.addListener(document, "keydown", escapeListener);
onCleanup(() => {
if (listenerId) {
eventManager.removeListener(listenerId);
}
});
});
return (() => {
var _el$ = _tmpl$$1();
className(_el$, classes);
insert(_el$, children);
return _el$;
})();
}
var _tmpl$ =  template(`<div role=alert data-xeg-error-boundary aria-live=polite><p class=xeg-error-boundary__title></p><p class=xeg-error-boundary__body></p><button type=button class=xeg-error-boundary__action>Retry`);
function stringifyError(error) {
if (error instanceof Error && error.message) {
return error.message;
}
try {
return String(error);
} catch {
return "Unknown error";
}
}
function translateError(error) {
try {
const languageService = getLanguageService();
return {
title: languageService.translate("msg.err.t"),
body: languageService.translate("msg.err.b", {
error: stringifyError(error)
})
};
} catch {
return {
title: "Unexpected error",
body: stringifyError(error)
};
}
}
function ErrorBoundary(props) {
let lastReportedError;
const [caughtError, setCaughtError] = createSignal(void 0);
const [boundaryMounted, setBoundaryMounted] = createSignal(true);
const notifyError = (error) => {
if (lastReportedError === error) return;
lastReportedError = error;
const copy = translateError(error);
try {
NotificationService.getInstance().error(copy.title, copy.body);
} catch {
}
};
const handleRetry = () => {
lastReportedError = void 0;
setCaughtError(void 0);
setBoundaryMounted(false);
queueMicrotask(() => setBoundaryMounted(true));
};
const renderFallback = (error) => {
const {
title,
body
} = translateError(error);
return (() => {
var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling;
insert(_el$2, title);
insert(_el$3, body);
_el$4.$$click = handleRetry;
return _el$;
})();
};
return [createComponent(Show, {
get when() {
return boundaryMounted();
},
get children() {
return createComponent(ErrorBoundary$1, {
fallback: (boundaryError) => {
notifyError(boundaryError);
setCaughtError(boundaryError);
return null;
},
get children() {
return props.children;
}
});
}
}), createComponent(Show, {
get when() {
return caughtError();
},
children: (error) => renderFallback(error())
})];
}
delegateEvents(["click"]);
class GalleryRenderer {
container = null;
isMounting = false;
stateUnsubscribe = null;
onCloseCallback;
constructor() {
this.setupStateSubscription();
}
setOnCloseCallback(onClose) {
this.onCloseCallback = onClose;
}
setupStateSubscription() {
this.stateUnsubscribe = gallerySignals.isOpen.subscribe((isOpen) => {
if (isOpen && !this.container) {
this.renderGallery();
} else if (!isOpen && this.container) {
this.cleanupGallery();
}
});
}
renderGallery() {
if (this.isMounting || this.container) return;
const {
isOpen,
mediaItems
} = gallerySignals;
if (!isOpen.value || mediaItems.value.length === 0) return;
this.isMounting = true;
try {
this.createContainer();
this.renderComponent();
} catch (error) {
this.cleanupContainer();
setError(getErrorMessage(error) || "Gallery rendering failed");
} finally {
this.isMounting = false;
}
}
createContainer() {
this.cleanupContainer();
this.container = document.createElement("div");
this.container.className = CSS.CLASSES.RENDERER;
this.container.setAttribute("data-renderer", "gallery");
document.body.appendChild(this.container);
}
renderComponent() {
if (!this.container) return;
const themeService = getThemeService();
const languageService = getLanguageService();
const handleClose = () => {
closeGallery();
this.onCloseCallback?.();
};
const handleDownload = (type) => this.handleDownload(type);
const Root = () => {
const [currentTheme, setCurrentTheme] = createSignal(themeService.getCurrentTheme());
const [currentLanguage, setCurrentLanguage] = createSignal(languageService.getCurrentLanguage());
const unbindTheme = themeService.onThemeChange((_, setting) => setCurrentTheme(setting));
const unbindLanguage = languageService.onLanguageChange((lang) => setCurrentLanguage(lang));
onCleanup(() => {
unbindTheme();
unbindLanguage();
});
return createComponent(GalleryContainer, {
onClose: handleClose,
get className() {
return `${CSS.CLASSES.RENDERER} ${CSS.CLASSES.ROOT} xeg-theme-scope`;
},
get ["data-theme"]() {
return currentTheme();
},
get ["data-language"]() {
return currentLanguage();
},
get children() {
return createComponent(ErrorBoundary, {
get children() {
return createComponent(VerticalGalleryView, {
onClose: handleClose,
onPrevious: () => navigatePrevious("button"),
onNext: () => navigateNext("button"),
onDownloadCurrent: () => handleDownload("current"),
onDownloadAll: () => handleDownload("all"),
get className() {
return CSS.CLASSES.VERTICAL_VIEW;
}
});
}
});
}
});
};
mountGallery(this.container, () => createComponent(Root, {}));
}
async handleDownload(type) {
if (isDownloadLocked()) return;
const releaseLock = acquireDownloadLock();
const notifyError = (title, body) => {
try {
void NotificationService.getInstance().error(title, body);
} catch {
}
};
try {
const languageService = getLanguageService();
const mediaItems = gallerySignals.mediaItems.value;
const mediaService = getMediaService();
const downloadService = await this.getDownloadService();
if (type === "current") {
const currentMedia = mediaItems[gallerySignals.currentIndex.value];
if (currentMedia) {
let blob;
try {
const pending = mediaService.getCachedMedia(currentMedia.url);
if (pending) {
blob = await pending;
}
} catch {
}
const result = await downloadService.downloadSingle(currentMedia, {
...blob ? {
blob
} : {}
});
if (!result.success) {
const error = result.error || "Unknown error";
const title = languageService.translate("msg.dl.one.err.t");
const body = languageService.translate("msg.dl.one.err.b", {
error
});
setError(body);
notifyError(title, body);
}
}
} else {
const prefetchedBlobs =  new Map();
for (const item of mediaItems) {
if (!item) continue;
const pending = mediaService.getCachedMedia(item.url);
if (!pending) continue;
prefetchedBlobs.set(item.url, pending);
}
const result = await downloadService.downloadBulk([...mediaItems], {
...prefetchedBlobs.size > 0 ? {
prefetchedBlobs
} : {}
});
if (!result.success) {
if (result.filesSuccessful === 0) {
const title = languageService.translate("msg.dl.allFail.t");
const body = languageService.translate("msg.dl.allFail.b");
setError(body);
notifyError(title, body);
} else {
const error = result.error || "Failed to save ZIP file";
const title = languageService.translate("msg.dl.one.err.t");
const body = languageService.translate("msg.dl.one.err.b", {
error
});
setError(body);
notifyError(title, body);
}
return;
}
if (result.status === "partial") {
const failures = Math.max(0, result.filesProcessed - result.filesSuccessful);
if (failures > 0) {
const title = languageService.translate("msg.dl.part.t");
const body = languageService.translate("msg.dl.part.b", {
count: failures
});
setError(body);
notifyError(title, body);
}
}
}
} catch (error) {
try {
const languageService = getLanguageService();
const message = getErrorMessage(error) || "Unknown error";
const title = languageService.translate("msg.dl.one.err.t");
const body = languageService.translate("msg.dl.one.err.b", {
error: message
});
setError(body);
notifyError(title, body);
} catch {
setError(getErrorMessage(error) || "Download failed.");
}
} finally {
releaseLock();
}
}
async getDownloadService() {
return getDownloadOrchestrator();
}
cleanupGallery() {
this.isMounting = false;
this.cleanupContainer();
}
cleanupContainer() {
if (this.container) {
const container = this.container;
try {
unmountGallery(container);
} catch (error) {
}
try {
container.remove();
} catch (error) {
} finally {
this.container = null;
}
}
}
async render(mediaItems, renderOptions) {
const pauseContext = renderOptions?.pauseContext ?? {
reason: "programmatic"
};
try {
pauseAmbientVideosForGallery(pauseContext);
} catch (error) {
}
openGallery(mediaItems, renderOptions?.startIndex ?? 0);
}
close() {
if (!gallerySignals.isOpen.value) {
return;
}
closeGallery();
this.onCloseCallback?.();
}
isRendering() {
return !!(this.container && gallerySignals.isOpen.value);
}
destroy() {
this.stateUnsubscribe?.();
this.cleanupGallery();
}
}
const STATIC_DEFAULT_SETTINGS = {
gallery: {
autoScrollSpeed: 5,
infiniteScroll: true,
preloadCount: 3,
imageFitMode: "fitWidth",
theme: "auto",
animations: true,
enableKeyboardNav: true,
videoVolume: 1,
videoMuted: false
},
toolbar: {
autoHideDelay: 3e3
},
download: {
filenamePattern: "original",
imageQuality: "original",
maxConcurrentDownloads: 3,
autoZip: false,
folderStructure: "flat"
},
tokens: {
autoRefresh: true,
expirationMinutes: 60
},
accessibility: {
reduceMotion: false,
screenReaderSupport: true,
focusIndicators: true
},
features: {
gallery: true,
settings: true,
download: true,
mediaExtraction: true,
accessibility: true
},
version: "1.5.1",
lastModified: 0
};
const DEFAULT_SETTINGS = STATIC_DEFAULT_SETTINGS;
function createDefaultSettings(timestamp = Date.now()) {
const settings = globalThis.structuredClone(DEFAULT_SETTINGS);
settings.lastModified = timestamp;
return settings;
}
const migrations = {
"1.0.0": (input) => {
const next = { ...input };
next.gallery = {
...next.gallery,
enableKeyboardNav: true
};
return next;
}
};
function pruneWithTemplate(input, template) {
if (!isRecord(input)) return {};
const out = {};
for (const key of Object.keys(template)) {
const tplVal = template[key];
const inVal = input[key];
if (inVal === void 0) continue;
if (isRecord(tplVal) && !Array.isArray(tplVal)) {
out[key] = pruneWithTemplate(inVal, tplVal);
} else {
out[key] = inVal;
}
}
return out;
}
function fillWithDefaults(settings, nowMs) {
const pruned = pruneWithTemplate(settings, DEFAULT_SETTINGS);
const categories = {
gallery: DEFAULT_SETTINGS.gallery,
toolbar: DEFAULT_SETTINGS.toolbar,
download: DEFAULT_SETTINGS.download,
tokens: DEFAULT_SETTINGS.tokens,
accessibility: DEFAULT_SETTINGS.accessibility,
features: DEFAULT_SETTINGS.features
};
const merged = { ...DEFAULT_SETTINGS, ...pruned };
for (const [key, defaults] of Object.entries(categories)) {
merged[key] = {
...defaults,
...pruned[key] ?? {}
};
}
return {
...merged,
version: DEFAULT_SETTINGS.version,
lastModified: nowMs
};
}
function migrateSettings(input, nowMs) {
let working = { ...input };
const currentVersion = input.version;
const mig = migrations[currentVersion];
if (typeof mig === "function") {
try {
working = mig(working);
} catch {
}
}
return fillWithDefaults(working, nowMs);
}
const SETTINGS_SCHEMA_HASH = "1";
function computeCurrentSettingsSchemaHash() {
return SETTINGS_SCHEMA_HASH;
}
class PersistentSettingsRepository {
storage = getPersistentStorage();
schemaHash = computeCurrentSettingsSchemaHash();
async load() {
try {
const stored = await this.storage.getJson(APP_SETTINGS_STORAGE_KEY);
if (!stored) {
const defaults = createDefaultSettings();
try {
await this.persist(defaults);
} catch (persistError) {
}
return globalThis.structuredClone(defaults);
}
const nowMs = Date.now();
const migrated = migrateSettings(stored, nowMs);
if (stored.__schemaHash !== this.schemaHash) {
try {
await this.persist(migrated);
} catch (persistError) {
}
}
return globalThis.structuredClone(migrated);
} catch (error) {
const defaults = createDefaultSettings();
try {
await this.persist(defaults);
} catch (persistError) {
}
return globalThis.structuredClone(defaults);
}
}
async save(settings) {
try {
await this.persist(settings);
} catch (error) {
throw error;
}
}
async persist(settings) {
await this.storage.setJson(APP_SETTINGS_STORAGE_KEY, {
...settings,
__schemaHash: this.schemaHash
});
}
}
const FORBIDDEN_PATH_KEYS = ["__proto__", "constructor", "prototype"];
function isSafePathKey(key) {
return key !== "" && !FORBIDDEN_PATH_KEYS.includes(key);
}
function resolveNestedPath(source, path) {
if (typeof path !== "string" || path === "") {
return void 0;
}
let current = source;
const segments = path.split(".");
for (const segment of segments) {
if (!isSafePathKey(segment)) {
return void 0;
}
if (current === null || typeof current !== "object") {
return void 0;
}
current = current[segment];
}
return current;
}
function assignNestedPath(target, path, value) {
if (target === null || typeof target !== "object") {
return false;
}
if (typeof path !== "string" || path === "") {
return false;
}
const segments = path.split(".");
const last = segments[segments.length - 1];
if (!last || !isSafePathKey(last)) {
return false;
}
let current = target;
for (let i = 0; i < segments.length - 1; i++) {
const segment = segments[i];
if (!segment || !isSafePathKey(segment)) {
return false;
}
const existing = current[segment];
if (existing === null || typeof existing !== "object") {
const next = {};
current[segment] = next;
current = next;
continue;
}
current = existing;
}
current[last] = value;
return true;
}
const FEATURE_DEFAULTS = Object.freeze({ ...DEFAULT_SETTINGS.features });
function normalizeFeatureFlags(features) {
const featureKeys = Object.keys(FEATURE_DEFAULTS);
return featureKeys.reduce(
(acc, key) => {
const candidate = features?.[key];
acc[key] = typeof candidate === "boolean" ? candidate : FEATURE_DEFAULTS[key];
return acc;
},
{}
);
}
class SettingsService {
constructor(repository = new PersistentSettingsRepository()) {
this.repository = repository;
this.lifecycle = createLifecycle("SettingsService", {
onInitialize: () => this.onInitialize(),
onDestroy: () => this.onDestroy()
});
}
lifecycle;
static singleton = createSingleton(() => new SettingsService());
static getInstance() {
return SettingsService.singleton.get();
}
settings = createDefaultSettings();
featureMap = normalizeFeatureFlags(this.settings.features);
listeners =  new Set();
async initialize() {
return this.lifecycle.initialize();
}
destroy() {
this.lifecycle.destroy();
}
isInitialized() {
return this.lifecycle.isInitialized();
}
async onInitialize() {
this.settings = await this.repository.load();
this.refreshFeatureMap();
}
onDestroy() {
this.listeners.clear();
this.repository.save(this.settings).catch((error) => {
});
}
getAllSettings() {
this.assertInitialized();
return globalThis.structuredClone(this.settings);
}
get(key) {
this.assertInitialized();
const value = resolveNestedPath(this.settings, key);
return value === void 0 ? this.getDefaultValue(key) : value;
}
async set(key, value) {
this.assertInitialized();
if (!this.isValid(key, value)) throw new Error(`Invalid setting value for ${key}`);
const oldValue = this.get(key);
if (!assignNestedPath(this.settings, key, value)) {
throw new Error(`Failed to assign setting value for ${key}`);
}
this.settings.lastModified = Date.now();
this.refreshFeatureMap();
this.notifyListeners({
key,
oldValue,
newValue: value,
timestamp: Date.now(),
status: "success"
});
await this.persist();
}
async updateBatch(updates) {
this.assertInitialized();
const entries = Object.entries(updates);
for (const [key, value] of entries) {
if (!this.isValid(key, value)) throw new Error(`Invalid setting value for ${key}`);
}
const previous = globalThis.structuredClone(this.settings);
const timestamp = Date.now();
for (const [key, value] of entries) {
if (!assignNestedPath(this.settings, key, value)) {
throw new Error(`Failed to assign setting value for ${key}`);
}
}
this.settings.lastModified = timestamp;
this.refreshFeatureMap();
for (const [key, value] of entries) {
const oldValue = resolveNestedPath(previous, key);
this.notifyListeners({
key,
oldValue,
newValue: value,
timestamp,
status: "success"
});
}
await this.persist();
}
async resetToDefaults(category) {
this.assertInitialized();
const previous = this.getAllSettings();
if (!category) {
this.settings = createDefaultSettings();
} else if (category in DEFAULT_SETTINGS) {
const defaultValue = DEFAULT_SETTINGS[category];
if (defaultValue !== void 0) {
Object.assign(this.settings, { [category]: globalThis.structuredClone(defaultValue) });
}
}
this.settings.lastModified = Date.now();
this.refreshFeatureMap();
this.notifyListeners({
key: category ?? "all",
oldValue: previous,
newValue: this.getAllSettings(),
timestamp: Date.now(),
status: "success"
});
await this.persist();
}
subscribe(listener) {
this.listeners.add(listener);
return () => {
this.listeners.delete(listener);
};
}
exportSettings() {
this.assertInitialized();
return JSON.stringify(this.settings, null, 2);
}
async importSettings(jsonString) {
this.assertInitialized();
try {
const imported = JSON.parse(jsonString);
if (!imported || typeof imported !== "object") throw new Error("Invalid settings");
const previous = this.getAllSettings();
const nowMs = Date.now();
this.settings = migrateSettings(imported, nowMs);
this.settings.lastModified = nowMs;
this.refreshFeatureMap();
this.notifyListeners({
key: "all",
oldValue: previous,
newValue: this.getAllSettings(),
timestamp: nowMs,
status: "success"
});
await this.persist();
} catch (error) {
throw error;
}
}
getFeatureMap() {
this.assertInitialized();
return Object.freeze({ ...this.featureMap });
}
refreshFeatureMap() {
this.featureMap = normalizeFeatureFlags(this.settings.features);
}
async persist() {
await this.repository.save(this.settings);
}
isValid(key, value) {
const def = this.getDefaultValue(key);
if (def === void 0) return true;
const type = Array.isArray(def) ? "array" : typeof def;
if (type === "array") return Array.isArray(value);
if (type === "object") return typeof value === "object" && value !== null;
return typeof value === type;
}
getDefaultValue(key) {
return resolveNestedPath(DEFAULT_SETTINGS, key);
}
notifyListeners(event) {
this.listeners.forEach((listener) => {
try {
listener(event);
} catch (error) {
}
});
}
assertInitialized() {
if (!this.isInitialized()) {
throw new Error("SettingsService must be initialized before use");
}
}
}
let rendererRegistrationTask = null;
async function registerRenderer() {
if (!rendererRegistrationTask) {
rendererRegistrationTask = (async () => {
registerGalleryRenderer(new GalleryRenderer());
})().finally(() => {
rendererRegistrationTask = null;
});
}
await rendererRegistrationTask;
}
async function initializeServices() {
const hasRequiredGMAPIs = isGMAPIAvailable("download") || isGMAPIAvailable("setValue");
if (!hasRequiredGMAPIs) {
bootstrapErrorReporter.warn(new Error("Tampermonkey APIs limited"), {
code: "GM_API_LIMITED"
});
}
let settingsService = null;
try {
const service = new SettingsService();
await service.initialize();
registerSettingsManager(service);
settingsService = service;
if (false) ;
} catch (error) {
settingsErrorReporter.warn(error, {
code: "SETTINGS_SERVICE_INIT_FAILED"
});
}
try {
const themeService = getThemeService();
if (!themeService.isInitialized()) {
await themeService.initialize();
}
if (settingsService) {
themeService.bindSettingsService(settingsService);
}
if (false) ;
} catch (error) {
bootstrapErrorReporter.warn(error, {
code: "THEME_SYNC_FAILED"
});
}
}
async function initializeGalleryApp() {
try {
if (false) ;
await Promise.all([registerRenderer(), initializeServices()]);
const galleryApp = new GalleryApp();
await galleryApp.initialize();
if (false) ;
return galleryApp;
} catch (error) {
galleryErrorReporter.error(error, {
code: "GALLERY_APP_INIT_FAILED"
});
throw error;
}
}
const __vite_import_meta_env__ = {"BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false};
const FALLBACK_VERSION = "0.0.0";
const APP_NAME = "X.com Enhanced Gallery";
const MAX_GALLERY_ITEMS = 100;
const DEFAULT_ANIMATION_DURATION = "var(--xeg-duration-normal)";
const DEFAULT_SERVICE_TIMEOUT_MS = 1e4;
const DEFAULT_BOOTSTRAP_RETRY_ATTEMPTS = 3;
const DEFAULT_BOOTSTRAP_RETRY_DELAY_MS = 100;
const importMetaEnv = resolveImportMetaEnv();
const nodeEnv = resolveNodeEnv();
const buildVersion = "1.6.0" ;
const rawVersion = resolveStringValue(
buildVersion,
importMetaEnv.VITE_VERSION,
nodeEnv.VITE_VERSION,
nodeEnv.npm_package_version
) ?? FALLBACK_VERSION;
const devFlag = parseBooleanFlag(importMetaEnv.DEV);
const nodeDevFlag = parseBooleanFlag(nodeEnv.DEV);
const mode = importMetaEnv.MODE ?? nodeEnv.NODE_ENV ?? "production";
const isTest = mode === "test";
const isDev = devFlag ?? nodeDevFlag ?? (!isTest && mode !== "production");
const isProd = !isDev && !isTest;
const autoStartFlag = parseBooleanFlag(importMetaEnv.VITE_AUTO_START ?? nodeEnv.VITE_AUTO_START);
const debugToolsFlag = parseBooleanFlag(
importMetaEnv.VITE_ENABLE_DEBUG_TOOLS ?? nodeEnv.VITE_ENABLE_DEBUG_TOOLS
);
const resolvedAppConfig = Object.freeze({
meta: {
name: APP_NAME,
version: rawVersion
},
environment: {
mode,
isDev,
isTest,
isProduction: isProd
},
runtime: {
autoStart: autoStartFlag ?? true
},
limits: {
maxGalleryItems: MAX_GALLERY_ITEMS
},
ui: {
animationDuration: DEFAULT_ANIMATION_DURATION
},
features: {
gallery: true,
download: true,
settings: true,
accessibility: true,
debugTools: debugToolsFlag ?? isDev
},
diagnostics: {
enableLogger: true,
enableVerboseLogs: isDev
},
bootstrap: {
serviceTimeoutMs: DEFAULT_SERVICE_TIMEOUT_MS,
retryAttempts: DEFAULT_BOOTSTRAP_RETRY_ATTEMPTS,
retryDelayMs: DEFAULT_BOOTSTRAP_RETRY_DELAY_MS
}
});
const APP_CONFIG = resolvedAppConfig;
function getAppConfig() {
return APP_CONFIG;
}
function createAppConfig() {
const config = getAppConfig();
return {
version: config.meta.version,
isDevelopment: config.environment.isDev,
debug: config.features.debugTools,
autoStart: config.runtime.autoStart
};
}
function resolveImportMetaEnv() {
if (typeof globalThis !== "undefined" && globalThis.__XEG_IMPORT_META_ENV__) {
return globalThis.__XEG_IMPORT_META_ENV__;
}
try {
return __vite_import_meta_env__ ?? {};
} catch {
return {};
}
}
function resolveNodeEnv() {
if (typeof process !== "undefined" && process?.env) {
return process.env;
}
return {};
}
function parseBooleanFlag(value) {
if (typeof value === "boolean") {
return value;
}
if (typeof value === "string") {
const normalized = value.trim().toLowerCase();
if (!normalized) {
return void 0;
}
if (["1", "true", "yes", "on"].includes(normalized)) {
return true;
}
if (["0", "false", "no", "off"].includes(normalized)) {
return false;
}
}
return void 0;
}
function resolveStringValue(...values) {
for (const value of values) {
if (typeof value === "string") {
const normalized = value.trim();
if (normalized.length > 0) {
return normalized;
}
}
}
return void 0;
}
class GlobalErrorHandler {
static singleton = createSingleton(() => new GlobalErrorHandler());
isInitialized = false;
controller = null;
errorListenerId = null;
rejectionListenerId = null;
errorListener = (event) => {
};
rejectionListener = (event) => {
};
static getInstance() {
return GlobalErrorHandler.singleton.get();
}
constructor() {
}
initialize() {
if (this.isInitialized || typeof window === "undefined") {
return;
}
const eventManager = EventManager.getInstance();
this.controller = new AbortController();
const onError = (evt) => {
this.errorListener(evt);
};
const onUnhandledRejection = (evt) => {
this.rejectionListener(evt);
};
this.errorListenerId = eventManager.addEventListener(window, "error", onError, {
signal: this.controller.signal,
context: "global-error-handler"
}) ?? null;
this.rejectionListenerId = eventManager.addEventListener(window, "unhandledrejection", onUnhandledRejection, {
signal: this.controller.signal,
context: "global-error-handler"
}) ?? null;
this.isInitialized = true;
}
destroy() {
if (!this.isInitialized || typeof window === "undefined") {
return;
}
const eventManager = EventManager.getInstance();
if (this.errorListenerId) {
eventManager.removeListener(this.errorListenerId);
this.errorListenerId = null;
}
if (this.rejectionListenerId) {
eventManager.removeListener(this.rejectionListenerId);
this.rejectionListenerId = null;
}
this.controller?.abort();
this.controller = null;
this.isInitialized = false;
}
}
const isDevEnvironment = false;
const lifecycleState = {
started: false,
startPromise: null,
galleryApp: null
};
const debugCleanupLog = void 0;
let globalEventTeardown = null;
async function refreshDevNamespace(app) {
setupDevNamespace(app, {
start: startApplication,
createConfig: createAppConfig,
cleanup
});
}
function tearDownGlobalEventHandlers() {
if (!globalEventTeardown) {
return;
}
const teardown = globalEventTeardown;
globalEventTeardown = null;
try {
teardown();
} catch (error) {
}
}
function tearDownCommandRuntime() {
{
return;
}
}
async function runOptionalCleanup(label, task, log) {
try {
await task();
} catch (error) {
}
}
async function runBootstrapStages() {
await initializeCriticalSystems();
try {
await initializeBaseServicesStage();
} catch {
}
await applyInitialThemeSetting();
setupGlobalEventHandlers();
await initializeGallery();
}
async function initializeBaseServicesStage() {
try {
await initializeCoreBaseServices();
if (false) ;
} catch (error) {
bootstrapErrorReporter.warn(error, {
code: "BASE_SERVICES_INIT_FAILED"
});
throw error;
}
}
async function applyInitialThemeSetting() {
try {
const themeService = getThemeService();
if (typeof themeService.isInitialized === "function" && !themeService.isInitialized()) {
await themeService.initialize();
}
const savedSetting = themeService.getCurrentTheme();
themeService.setTheme(savedSetting, { force: true, persist: false });
if (false) ;
} catch (error) {
}
}
function setupGlobalEventHandlers() {
tearDownGlobalEventHandlers();
globalEventTeardown = wireGlobalEvents(() => {
cleanup().catch((error) => {
});
});
}
async function cleanup() {
try {
if (false) ;
tearDownGlobalEventHandlers();
tearDownCommandRuntime();
await runOptionalCleanup(false ? "Gallery cleanup" : "1", async () => {
if (!lifecycleState.galleryApp) {
return;
}
await lifecycleState.galleryApp.cleanup();
lifecycleState.galleryApp = null;
});
await runOptionalCleanup(false ? "CoreService cleanup" : "2", () => {
CoreService.getInstance().cleanup();
});
await runOptionalCleanup(false ? "Global timer cleanup" : "3", () => {
globalTimerManager.cleanup();
});
await runOptionalCleanup(
false ? "Global error handler cleanup" : "4",
async () => {
GlobalErrorHandler.getInstance().destroy();
},
debugCleanupLog
);
if (false) ;
if (isDevEnvironment) ;
lifecycleState.started = false;
if (false) ;
} catch (error) {
bootstrapErrorReporter.error(error, {
code: "CLEANUP_FAILED"
});
throw error;
}
}
async function startApplication() {
if (lifecycleState.started) {
return;
}
if (lifecycleState.startPromise) {
return lifecycleState.startPromise;
}
lifecycleState.startPromise = (async () => {
await runBootstrapStages();
lifecycleState.started = true;
})().catch((error) => {
lifecycleState.started = false;
bootstrapErrorReporter.error(error, {
code: "APP_INIT_FAILED",
metadata: { leanMode: true }
});
throw error;
}).finally(() => {
lifecycleState.startPromise = null;
});
return lifecycleState.startPromise;
}
async function initializeGallery() {
try {
if (false) ;
lifecycleState.galleryApp = await initializeGalleryApp();
if (false) ;
} catch (error) {
lifecycleState.galleryApp = null;
galleryErrorReporter.error(error, {
code: "GALLERY_INIT_FAILED"
});
throw error;
}
}
void startApplication().catch(() => {
});
})();
