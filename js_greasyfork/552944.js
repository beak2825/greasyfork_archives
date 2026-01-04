// ==UserScript==
// @name WTR-Lab Reader & UI Enhancer
// @description Enhance your WTR-Lab reading experience with customizable reader width, navigation panel controls, and font styling options. Create the perfect reading environment on wtr-lab.com with this powerful userscript.
// @version 3.5.1
// @author MasuRii
// @supportURL https://github.com/MasuRii/wtr-lab-enhancer/issues
// @match https://wtr-lab.com/en/novel/*/*/chapter-*
// @connect gwfh.mranftl.com
// @connect fonts.googleapis.com
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @homepageURL https://github.com/MasuRii/wtr-lab-enhancer
// @icon https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/552944/WTR-Lab%20Reader%20%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/552944/WTR-Lab%20Reader%20%20UI%20Enhancer.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/panel.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/panel.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Modern CSS Design System with Fallbacks */
:root {
    /* Container Queries Support Detection */
    --supports-container-queries: false;
    
    /* Design Tokens - Colors */
    --panel-bg-primary: var(--bs-component-bg, #ffffff);
    --panel-bg-secondary: var(--bs-tertiary-bg, #f8f9fa);
    --panel-bg-elevated: var(--bs-body-bg, #ffffff);
    --panel-text-primary: var(--bs-body-color, #212529);
    --panel-text-secondary: var(--bs-secondary-color, #6c757d);
    --panel-border: var(--bs-border-color, #dee2e6);
    --panel-accent: var(--bs-primary, #0d6efd);
    --panel-accent-hover: #0b5ed7;
    --panel-success: #198754;
    --panel-danger: #dc3545;
    --panel-warning: #fd7e14;
    
    /* Design Tokens - Spacing */
    --panel-spacing-xs: 0.25rem;
    --panel-spacing-sm: 0.5rem;
    --panel-spacing-md: 1rem;
    --panel-spacing-lg: 1.5rem;
    --panel-spacing-xl: 2rem;
    
    /* Design Tokens - Typography */
    --panel-font-family: var(--bs-font-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    --panel-font-size-xs: 0.75rem;
    --panel-font-size-sm: 0.875rem;
    --panel-font-size-md: 1rem;
    --panel-font-size-lg: 1.125rem;
    --panel-font-size-xl: 1.25rem;
    --panel-font-weight-normal: 400;
    --panel-font-weight-medium: 500;
    --panel-font-weight-bold: 600;
    --panel-line-height-tight: 1.2;
    --panel-line-height-normal: 1.5;
    --panel-line-height-relaxed: 1.75;
    
    /* Design Tokens - Border Radius */
    --panel-radius-sm: var(--bs-border-radius-sm, 0.25rem);
    --panel-radius-md: var(--bs-border-radius, 0.375rem);
    --panel-radius-lg: var(--bs-border-radius-lg, 0.5rem);
    --panel-radius-xl: 0.75rem;
    --panel-radius-full: 9999px;
    
    /* Design Tokens - Shadows */
    --panel-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --panel-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
    --panel-shadow-lg: var(--bs-box-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    --panel-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    
    /* Design Tokens - Transitions */
    --panel-transition-fast: 0.15s ease;
    --panel-transition-normal: 0.3s ease;
    --panel-transition-slow: 0.5s ease;
    --panel-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Design Tokens - Z-Index */
    --panel-z-overlay: 9999;
    --panel-z-panel: 10000;
    --panel-z-tooltip: 10001;
}

/* Container Queries Support Detection */
@supports (container-type: inline-size) {
    :root {
        --supports-container-queries: true;
    }
}

/* Panel Container for Container Queries */
#wtr-config-container {
    container-name: wtr-panel;
    container-type: inline-size;
    container-index: 0;
}

/* Enhanced panel styling with design tokens */
#wtr-config-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: var(--panel-z-overlay);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px);
    contain: layout style paint;
}

#wtr-config-panel {
    background: var(--panel-bg-primary);
    color: var(--panel-text-primary);
    padding: var(--panel-spacing-xl);
    border-radius: var(--panel-radius-lg);
    width: 90%;
    max-width: 550px;
    box-shadow: var(--panel-shadow-xl);
    font-family: var(--panel-font-family);
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-lg);
    max-height: 90vh;
    border: 1px solid var(--panel-border);
    
    /* Performance optimizations */
    contain: layout style paint;
    will-change: transform, opacity;
    transform: translateZ(0);
}

/* Enhanced Typography with Design Tokens */
#wtr-config-panel h2 {
    margin: 0;
    text-align: center;
    font-weight: var(--panel-font-weight-medium);
    font-size: var(--panel-font-size-xl);
    line-height: var(--panel-line-height-tight);
    color: var(--panel-text-primary);
    flex-shrink: 0;
}

/* Enhanced Sections with Containment */
#wtr-config-panel #wtr-config-sections {
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-lg);
    padding-right: var(--panel-spacing-md);
    margin-right: calc(-1 * var(--panel-spacing-md));
    
    /* Performance optimization */
    contain: layout style;
}

#wtr-config-panel .wtr-config-section {
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-lg);
    padding: var(--panel-spacing-lg);
    border: 1px solid var(--panel-border);
    border-radius: var(--panel-radius-lg);
    background: var(--panel-bg-secondary);
    
    /* Performance optimization */
    contain: layout style paint;
}

#wtr-config-panel .wtr-control-group {
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-sm);
}

/* Modern Control Layout with Grid Fallback */
#wtr-config-panel .wtr-config-controls {
    display: flex;
    gap: var(--panel-spacing-sm);
    align-items: center;
    flex-wrap: wrap;
}

#wtr-config-panel .wtr-config-controls.font-controls {
    flex-wrap: nowrap;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--panel-spacing-sm);
}

#wtr-config-panel .wtr-config-controls.checkbox-control {
    justify-content: flex-start;
    cursor: pointer;
    padding: var(--panel-spacing-sm) 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--panel-spacing-sm);
    cursor: pointer;
}

#wtr-config-panel .wtr-config-controls.checkbox-control label {
    user-select: none;
}

#wtr-config-panel .wtr-config-controls.checkbox-control input {
    margin-right: var(--panel-spacing-sm);
}

/* Enhanced Form Controls with Touch Optimization */
#wtr-config-panel input[type="number"],
#wtr-config-panel select {
    flex-grow: 1;
    min-width: 100px;
    min-height: 44px; /* Touch target size */
    text-align: center;
    background: var(--panel-bg-secondary);
    color: var(--panel-text-primary);
    border: 1px solid var(--panel-border);
    border-radius: var(--panel-radius-md);
    padding: var(--panel-spacing-sm) var(--panel-spacing-md);
    font-family: var(--panel-font-family);
    font-size: var(--panel-font-size-sm);
    
    /* Performance */
    contain: layout style;
}

#wtr-config-panel select:disabled {
    background: var(--panel-bg-secondary);
    color: var(--panel-text-secondary);
    cursor: not-allowed;
}

/* Modern Button Layout */
#wtr-config-panel .wtr-button-group {
    display: grid;
    grid-auto-flow: column;
    gap: var(--panel-spacing-sm);
    justify-content: end;
    flex-shrink: 0;
}

/* Enhanced Button Styling with Motion Controls */
#wtr-config-panel .wtr-config-button {
    min-height: 44px; /* iOS guideline */
    min-width: 44px;
    padding: var(--panel-spacing-sm) var(--panel-spacing-md);
    border: none;
    border-radius: var(--panel-radius-md);
    cursor: pointer;
    background-color: var(--panel-accent);
    color: white;
    font-weight: var(--panel-font-weight-bold);
    font-size: var(--panel-font-size-sm);
    flex-shrink: 0;
    transition: background-color var(--panel-transition-fast),
                transform var(--panel-transition-fast);
    
    /* Touch optimization */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    
    /* Performance */
    contain: layout style paint;
    will-change: transform;
    transform: translateZ(0);
}

#wtr-config-panel .wtr-config-button:hover,
#wtr-config-panel .wtr-config-button:focus-visible {
    background-color: var(--panel-accent-hover);
    transform: translateY(-1px);
}

#wtr-config-panel .wtr-config-button:active {
    transform: translateY(0);
}

#wtr-config-panel .wtr-config-button:disabled {
    background-color: var(--panel-text-secondary);
    cursor: not-allowed;
    transform: none;
}

#wtr-config-panel .wtr-config-button.control {
    width: 44px;
    aspect-ratio: 1;
}

#wtr-config-panel .wtr-config-button.reset {
    background-color: var(--panel-danger);
}

#wtr-config-panel #wtr-config-close-btn {
    background-color: var(--panel-text-secondary);
    align-self: center;
    width: 100px;
    flex-shrink: 0;
}

/* Enhanced Typography */
#wtr-config-panel .wtr-section-title {
    font-weight: var(--panel-font-weight-medium);
    text-align: center;
    margin-bottom: var(--panel-spacing-sm);
    display: block;
    font-size: var(--panel-font-size-lg);
    color: var(--panel-text-primary);
}

#wtr-config-panel .wtr-subsection-title {
    font-weight: var(--panel-font-weight-medium);
    text-align: left;
    margin-top: var(--panel-spacing-lg);
    display: block;
    border-top: 1px solid var(--panel-border);
    padding-top: var(--panel-spacing-lg);
    color: var(--panel-text-primary);
}

/* Enhanced Button Hide Controls Layout */
#wtr-config-panel .wtr-button-hide-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--panel-spacing-md);
    justify-content: flex-start;
}

#wtr-config-panel .icon-checkbox label {
    display: flex;
    align-items: center;
    gap: var(--panel-spacing-sm);
}

#wtr-config-panel .icon-checkbox svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
}

#wtr-config-panel .icon-checkbox svg:has(use[href*="text_fields"], use[href*="tts"], use[href*="list"]) {
    fill: currentColor;
    stroke: none;
}

/* Width Controls Grouping - Responsive Layout */
#wtr-config-panel .wtr-width-controls-group {
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-lg);
    width: 100%;
}

#wtr-config-panel .wtr-width-control-item {
    display: flex;
    flex-direction: column;
    gap: var(--panel-spacing-sm);
    width: 100%;
}

#wtr-config-panel .wtr-width-label {
    font-weight: var(--panel-font-weight-medium);
    color: var(--panel-text-primary);
    text-align: left;
    margin-bottom: var(--panel-spacing-xs);
}

#wtr-config-panel .wtr-config-controls.width-controls {
    display: flex;
    align-items: center;
    gap: var(--panel-spacing-sm);
    flex-wrap: nowrap;
    width: 100%;
}

#wtr-config-panel .wtr-width-input {
    flex: 1;
    min-width: 80px;
    text-align: center;
    /* Grow to fill available space */
    max-width: none;
}

/* Motion Preference Handling - WCAG 2.2/2.3 Compliance */
@media (prefers-reduced-motion: reduce) {
    #wtr-config-overlay,
    #wtr-config-panel,
    .wtr-config-button {
        transition: none !important;
        animation: none !important;
        transform: none !important;
    }
}

/* Enable motion for users who haven't disabled it */
@supports not (prefers-reduced-motion: reduce) {
    #wtr-config-panel {
        transition: transform var(--panel-transition-normal) var(--panel-timing-function),
                   opacity var(--panel-transition-normal) ease;
        transform: scale(0.95);
    }
    
    #wtr-config-panel.visible {
        transform: scale(1);
    }
}

/* Container Query Responsive Design */
@container wtr-panel (max-width: 480px) {
    #wtr-config-panel {
        width: 95%;
        padding: var(--panel-spacing-lg);
    }
    
    .wtr-config-controls {
        flex-direction: column;
        gap: var(--panel-spacing-xs);
    }
    
    .wtr-config-controls.font-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .wtr-button-group {
        margin-left: 0;
        justify-content: center;
        grid-auto-flow: row;
    }
    
    .wtr-button-hide-controls {
        grid-template-columns: 1fr;
        gap: var(--panel-spacing-sm);
    }
    
    /* Width controls maintain grouping but stack on small screens */
    .wtr-width-controls-group {
        gap: var(--panel-spacing-md);
    }
    
    .wtr-width-control-item {
        width: 100%;
    }
    
    .wtr-config-controls.width-controls {
        width: 100%;
    }
    
    .wtr-width-input {
        min-width: 70px;
        flex: 1;
    }
}

@container wtr-panel (max-width: 360px) {
    #wtr-config-panel {
        width: 98%;
        margin: var(--panel-spacing-md);
        padding: var(--panel-spacing-md);
    }
    
    .wtr-config-section {
        padding: var(--panel-spacing-md);
    }
    
    .wtr-config-button {
        min-width: 40px;
    }
    
    /* Extra small screens - ensure width controls stay in single column */
    .wtr-width-controls-group {
        gap: var(--panel-spacing-sm);
    }
    
    .wtr-width-control-item {
        width: 100%;
    }
    
    .wtr-config-controls.width-controls {
        flex-wrap: wrap;
        gap: var(--panel-spacing-xs);
    }
    
    .wtr-width-input {
        min-width: 60px;
        flex: 1;
    }
}

/* Grid Layout Fallbacks */
@supports not (display: grid) {
    .wtr-config-controls {
        display: flex;
        flex-wrap: wrap;
    }
    
    .wtr-button-group {
        display: flex;
        flex-wrap: wrap;
    }
    
    .wtr-button-hide-controls {
        display: flex;
        flex-wrap: wrap;
    }
    
    /* Width controls fallback - ensure they stay in single column */
    .wtr-width-controls-group {
        display: flex;
        flex-direction: column;
        gap: var(--panel-spacing-md);
    }
    
    .wtr-width-control-item {
        display: flex;
        flex-direction: column;
        gap: var(--panel-spacing-sm);
        width: 100%;
    }
    
    .wtr-config-controls.width-controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--panel-spacing-sm);
        width: 100%;
    }
}

/* Container Queries Fallback */
@supports not (container-type: inline-size) {
    #wtr-config-container {
        /* Fallback - styles remain as above for viewport-based responsiveness */
    }
    
    /* Legacy media queries as fallback */
    @media (max-width: 480px) {
        #wtr-config-panel {
            width: 95%;
            padding: var(--panel-spacing-lg);
        }
        
        .wtr-config-controls {
            flex-direction: column;
            gap: var(--panel-spacing-xs);
        }
        
        /* Width controls fallback for legacy browsers */
        .wtr-width-controls-group {
            gap: var(--panel-spacing-md);
        }
        
        .wtr-width-control-item {
            width: 100%;
        }
        
        .wtr-config-controls.width-controls {
            width: 100%;
        }
        
        .wtr-width-input {
            min-width: 70px;
            flex: 1;
        }
    }
    
    /* Extra small screens fallback */
    @media (max-width: 360px) {
        .wtr-width-controls-group {
            gap: var(--panel-spacing-sm);
        }
        
        .wtr-config-controls.width-controls {
            flex-wrap: wrap;
            gap: var(--panel-spacing-xs);
        }
        
        .wtr-width-input {
            min-width: 60px;
            flex: 1;
        }
    }
}

/* Backdrop Filter Fallback */
@supports not (backdrop-filter: blur(1px)) {
    #wtr-config-overlay {
        background-color: rgba(0, 0, 0, 0.8);
    }
}

/* Touch-specific enhancements */
@media (hover: none) and (pointer: coarse) {
    .wtr-config-button {
        min-height: 48px;
        padding: var(--panel-spacing-md) var(--panel-spacing-lg);
        font-size: var(--panel-font-size-md);
    }
    
    .wtr-config-controls input[type="number"],
    .wtr-config-controls select {
        min-height: 48px;
        font-size: var(--panel-font-size-md);
    }
}`, "",{"version":3,"sources":["webpack://./src/styles/panel.css"],"names":[],"mappings":"AAAA,4CAA4C;AAC5C;IACI,wCAAwC;IACxC,mCAAmC;;IAEnC,2BAA2B;IAC3B,mDAAmD;IACnD,oDAAoD;IACpD,+CAA+C;IAC/C,mDAAmD;IACnD,0DAA0D;IAC1D,+CAA+C;IAC/C,0CAA0C;IAC1C,6BAA6B;IAC7B,wBAAwB;IACxB,uBAAuB;IACvB,wBAAwB;;IAExB,4BAA4B;IAC5B,2BAA2B;IAC3B,0BAA0B;IAC1B,wBAAwB;IACxB,0BAA0B;IAC1B,wBAAwB;;IAExB,+BAA+B;IAC/B,yGAAyG;IACzG,6BAA6B;IAC7B,8BAA8B;IAC9B,0BAA0B;IAC1B,8BAA8B;IAC9B,6BAA6B;IAC7B,+BAA+B;IAC/B,+BAA+B;IAC/B,6BAA6B;IAC7B,8BAA8B;IAC9B,+BAA+B;IAC/B,iCAAiC;;IAEjC,kCAAkC;IAClC,sDAAsD;IACtD,oDAAoD;IACpD,qDAAqD;IACrD,0BAA0B;IAC1B,2BAA2B;;IAE3B,4BAA4B;IAC5B,gDAAgD;IAChD,+CAA+C;IAC/C,+EAA+E;IAC/E,sDAAsD;;IAEtD,gCAAgC;IAChC,mCAAmC;IACnC,oCAAoC;IACpC,kCAAkC;IAClC,qDAAqD;;IAErD,4BAA4B;IAC5B,uBAAuB;IACvB,sBAAsB;IACtB,wBAAwB;AAC5B;;AAEA,wCAAwC;AACxC;IACI;QACI,kCAAkC;IACtC;AACJ;;AAEA,0CAA0C;AAC1C;IACI,yBAAyB;IACzB,2BAA2B;IAC3B,kBAAkB;AACtB;;AAEA,8CAA8C;AAC9C;IACI,eAAe;IACf,MAAM;IACN,OAAO;IACP,WAAW;IACX,YAAY;IACZ,oCAAoC;IACpC,+BAA+B;IAC/B,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,0BAA0B;IAC1B,2BAA2B;AAC/B;;AAEA;IACI,mCAAmC;IACnC,gCAAgC;IAChC,gCAAgC;IAChC,qCAAqC;IACrC,UAAU;IACV,gBAAgB;IAChB,kCAAkC;IAClC,qCAAqC;IACrC,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,gBAAgB;IAChB,qCAAqC;;IAErC,8BAA8B;IAC9B,2BAA2B;IAC3B,+BAA+B;IAC/B,wBAAwB;AAC5B;;AAEA,2CAA2C;AAC3C;IACI,SAAS;IACT,kBAAkB;IAClB,4CAA4C;IAC5C,oCAAoC;IACpC,2CAA2C;IAC3C,gCAAgC;IAChC,cAAc;AAClB;;AAEA,uCAAuC;AACvC;IACI,gBAAgB;IAChB,YAAY;IACZ,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,sCAAsC;IACtC,gDAAgD;;IAEhD,6BAA6B;IAC7B,qBAAqB;AACzB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,gCAAgC;IAChC,qCAAqC;IACrC,qCAAqC;IACrC,qCAAqC;;IAErC,6BAA6B;IAC7B,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,4BAA4B;AAChC;;AAEA,6CAA6C;AAC7C;IACI,aAAa;IACb,4BAA4B;IAC5B,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,iBAAiB;IACjB,aAAa;IACb,0BAA0B;IAC1B,4BAA4B;AAChC;;AAEA;IACI,2BAA2B;IAC3B,eAAe;IACf,kCAAkC;IAClC,aAAa;IACb,+BAA+B;IAC/B,4BAA4B;IAC5B,eAAe;AACnB;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,qCAAqC;AACzC;;AAEA,mDAAmD;AACnD;;IAEI,YAAY;IACZ,gBAAgB;IAChB,gBAAgB,EAAE,sBAAsB;IACxC,kBAAkB;IAClB,qCAAqC;IACrC,gCAAgC;IAChC,qCAAqC;IACrC,qCAAqC;IACrC,wDAAwD;IACxD,qCAAqC;IACrC,oCAAoC;;IAEpC,gBAAgB;IAChB,qBAAqB;AACzB;;AAEA;IACI,qCAAqC;IACrC,kCAAkC;IAClC,mBAAmB;AACvB;;AAEA,yBAAyB;AACzB;IACI,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,oBAAoB;IACpB,cAAc;AAClB;;AAEA,iDAAiD;AACjD;IACI,gBAAgB,EAAE,kBAAkB;IACpC,eAAe;IACf,wDAAwD;IACxD,YAAY;IACZ,qCAAqC;IACrC,eAAe;IACf,qCAAqC;IACrC,YAAY;IACZ,0CAA0C;IAC1C,oCAAoC;IACpC,cAAc;IACd;sDACkD;;IAElD,uBAAuB;IACvB,0BAA0B;IAC1B,wCAAwC;;IAExC,gBAAgB;IAChB,2BAA2B;IAC3B,sBAAsB;IACtB,wBAAwB;AAC5B;;AAEA;;IAEI,2CAA2C;IAC3C,2BAA2B;AAC/B;;AAEA;IACI,wBAAwB;AAC5B;;AAEA;IACI,6CAA6C;IAC7C,mBAAmB;IACnB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,eAAe;AACnB;;AAEA;IACI,qCAAqC;AACzC;;AAEA;IACI,6CAA6C;IAC7C,kBAAkB;IAClB,YAAY;IACZ,cAAc;AAClB;;AAEA,wBAAwB;AACxB;IACI,4CAA4C;IAC5C,kBAAkB;IAClB,sCAAsC;IACtC,cAAc;IACd,oCAAoC;IACpC,gCAAgC;AACpC;;AAEA;IACI,4CAA4C;IAC5C,gBAAgB;IAChB,mCAAmC;IACnC,cAAc;IACd,yCAAyC;IACzC,oCAAoC;IACpC,gCAAgC;AACpC;;AAEA,yCAAyC;AACzC;IACI,aAAa;IACb,2DAA2D;IAC3D,4BAA4B;IAC5B,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,4BAA4B;AAChC;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,oBAAoB;IACpB,UAAU;AACd;;AAEA;IACI,kBAAkB;IAClB,YAAY;AAChB;;AAEA,gDAAgD;AAChD;IACI,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,WAAW;AACf;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,4BAA4B;IAC5B,WAAW;AACf;;AAEA;IACI,4CAA4C;IAC5C,gCAAgC;IAChC,gBAAgB;IAChB,sCAAsC;AAC1C;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,4BAA4B;IAC5B,iBAAiB;IACjB,WAAW;AACf;;AAEA;IACI,OAAO;IACP,eAAe;IACf,kBAAkB;IAClB,iCAAiC;IACjC,eAAe;AACnB;;AAEA,yDAAyD;AACzD;IACI;;;QAGI,2BAA2B;QAC3B,0BAA0B;QAC1B,0BAA0B;IAC9B;AACJ;;AAEA,oDAAoD;AACpD;IACI;QACI;8DACsD;QACtD,sBAAsB;IAC1B;;IAEA;QACI,mBAAmB;IACvB;AACJ;;AAEA,sCAAsC;AACtC;IACI;QACI,UAAU;QACV,gCAAgC;IACpC;;IAEA;QACI,sBAAsB;QACtB,4BAA4B;IAChC;;IAEA;QACI,sBAAsB;QACtB,oBAAoB;IACxB;;IAEA;QACI,cAAc;QACd,uBAAuB;QACvB,mBAAmB;IACvB;;IAEA;QACI,0BAA0B;QAC1B,4BAA4B;IAChC;;IAEA,gEAAgE;IAChE;QACI,4BAA4B;IAChC;;IAEA;QACI,WAAW;IACf;;IAEA;QACI,WAAW;IACf;;IAEA;QACI,eAAe;QACf,OAAO;IACX;AACJ;;AAEA;IACI;QACI,UAAU;QACV,+BAA+B;QAC/B,gCAAgC;IACpC;;IAEA;QACI,gCAAgC;IACpC;;IAEA;QACI,eAAe;IACnB;;IAEA,sEAAsE;IACtE;QACI,4BAA4B;IAChC;;IAEA;QACI,WAAW;IACf;;IAEA;QACI,eAAe;QACf,4BAA4B;IAChC;;IAEA;QACI,eAAe;QACf,OAAO;IACX;AACJ;;AAEA,0BAA0B;AAC1B;IACI;QACI,aAAa;QACb,eAAe;IACnB;;IAEA;QACI,aAAa;QACb,eAAe;IACnB;;IAEA;QACI,aAAa;QACb,eAAe;IACnB;;IAEA,gEAAgE;IAChE;QACI,aAAa;QACb,sBAAsB;QACtB,4BAA4B;IAChC;;IAEA;QACI,aAAa;QACb,sBAAsB;QACtB,4BAA4B;QAC5B,WAAW;IACf;;IAEA;QACI,aAAa;QACb,eAAe;QACf,4BAA4B;QAC5B,WAAW;IACf;AACJ;;AAEA,+BAA+B;AAC/B;IACI;QACI,wEAAwE;IAC5E;;IAEA,qCAAqC;IACrC;QACI;YACI,UAAU;YACV,gCAAgC;QACpC;;QAEA;YACI,sBAAsB;YACtB,4BAA4B;QAChC;;QAEA,gDAAgD;QAChD;YACI,4BAA4B;QAChC;;QAEA;YACI,WAAW;QACf;;QAEA;YACI,WAAW;QACf;;QAEA;YACI,eAAe;YACf,OAAO;QACX;IACJ;;IAEA,iCAAiC;IACjC;QACI;YACI,4BAA4B;QAChC;;QAEA;YACI,eAAe;YACf,4BAA4B;QAChC;;QAEA;YACI,eAAe;YACf,OAAO;QACX;IACJ;AACJ;;AAEA,6BAA6B;AAC7B;IACI;QACI,oCAAoC;IACxC;AACJ;;AAEA,gCAAgC;AAChC;IACI;QACI,gBAAgB;QAChB,wDAAwD;QACxD,oCAAoC;IACxC;;IAEA;;QAEI,gBAAgB;QAChB,oCAAoC;IACxC;AACJ","sourcesContent":["/* Modern CSS Design System with Fallbacks */\r\n:root {\r\n    /* Container Queries Support Detection */\r\n    --supports-container-queries: false;\r\n    \r\n    /* Design Tokens - Colors */\r\n    --panel-bg-primary: var(--bs-component-bg, #ffffff);\r\n    --panel-bg-secondary: var(--bs-tertiary-bg, #f8f9fa);\r\n    --panel-bg-elevated: var(--bs-body-bg, #ffffff);\r\n    --panel-text-primary: var(--bs-body-color, #212529);\r\n    --panel-text-secondary: var(--bs-secondary-color, #6c757d);\r\n    --panel-border: var(--bs-border-color, #dee2e6);\r\n    --panel-accent: var(--bs-primary, #0d6efd);\r\n    --panel-accent-hover: #0b5ed7;\r\n    --panel-success: #198754;\r\n    --panel-danger: #dc3545;\r\n    --panel-warning: #fd7e14;\r\n    \r\n    /* Design Tokens - Spacing */\r\n    --panel-spacing-xs: 0.25rem;\r\n    --panel-spacing-sm: 0.5rem;\r\n    --panel-spacing-md: 1rem;\r\n    --panel-spacing-lg: 1.5rem;\r\n    --panel-spacing-xl: 2rem;\r\n    \r\n    /* Design Tokens - Typography */\r\n    --panel-font-family: var(--bs-font-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);\r\n    --panel-font-size-xs: 0.75rem;\r\n    --panel-font-size-sm: 0.875rem;\r\n    --panel-font-size-md: 1rem;\r\n    --panel-font-size-lg: 1.125rem;\r\n    --panel-font-size-xl: 1.25rem;\r\n    --panel-font-weight-normal: 400;\r\n    --panel-font-weight-medium: 500;\r\n    --panel-font-weight-bold: 600;\r\n    --panel-line-height-tight: 1.2;\r\n    --panel-line-height-normal: 1.5;\r\n    --panel-line-height-relaxed: 1.75;\r\n    \r\n    /* Design Tokens - Border Radius */\r\n    --panel-radius-sm: var(--bs-border-radius-sm, 0.25rem);\r\n    --panel-radius-md: var(--bs-border-radius, 0.375rem);\r\n    --panel-radius-lg: var(--bs-border-radius-lg, 0.5rem);\r\n    --panel-radius-xl: 0.75rem;\r\n    --panel-radius-full: 9999px;\r\n    \r\n    /* Design Tokens - Shadows */\r\n    --panel-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);\r\n    --panel-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);\r\n    --panel-shadow-lg: var(--bs-box-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));\r\n    --panel-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\r\n    \r\n    /* Design Tokens - Transitions */\r\n    --panel-transition-fast: 0.15s ease;\r\n    --panel-transition-normal: 0.3s ease;\r\n    --panel-transition-slow: 0.5s ease;\r\n    --panel-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\r\n    \r\n    /* Design Tokens - Z-Index */\r\n    --panel-z-overlay: 9999;\r\n    --panel-z-panel: 10000;\r\n    --panel-z-tooltip: 10001;\r\n}\r\n\r\n/* Container Queries Support Detection */\r\n@supports (container-type: inline-size) {\r\n    :root {\r\n        --supports-container-queries: true;\r\n    }\r\n}\r\n\r\n/* Panel Container for Container Queries */\r\n#wtr-config-container {\r\n    container-name: wtr-panel;\r\n    container-type: inline-size;\r\n    container-index: 0;\r\n}\r\n\r\n/* Enhanced panel styling with design tokens */\r\n#wtr-config-overlay {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, 0.7);\r\n    z-index: var(--panel-z-overlay);\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    backdrop-filter: blur(4px);\r\n    contain: layout style paint;\r\n}\r\n\r\n#wtr-config-panel {\r\n    background: var(--panel-bg-primary);\r\n    color: var(--panel-text-primary);\r\n    padding: var(--panel-spacing-xl);\r\n    border-radius: var(--panel-radius-lg);\r\n    width: 90%;\r\n    max-width: 550px;\r\n    box-shadow: var(--panel-shadow-xl);\r\n    font-family: var(--panel-font-family);\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-lg);\r\n    max-height: 90vh;\r\n    border: 1px solid var(--panel-border);\r\n    \r\n    /* Performance optimizations */\r\n    contain: layout style paint;\r\n    will-change: transform, opacity;\r\n    transform: translateZ(0);\r\n}\r\n\r\n/* Enhanced Typography with Design Tokens */\r\n#wtr-config-panel h2 {\r\n    margin: 0;\r\n    text-align: center;\r\n    font-weight: var(--panel-font-weight-medium);\r\n    font-size: var(--panel-font-size-xl);\r\n    line-height: var(--panel-line-height-tight);\r\n    color: var(--panel-text-primary);\r\n    flex-shrink: 0;\r\n}\r\n\r\n/* Enhanced Sections with Containment */\r\n#wtr-config-panel #wtr-config-sections {\r\n    overflow-y: auto;\r\n    flex-grow: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-lg);\r\n    padding-right: var(--panel-spacing-md);\r\n    margin-right: calc(-1 * var(--panel-spacing-md));\r\n    \r\n    /* Performance optimization */\r\n    contain: layout style;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-section {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-lg);\r\n    padding: var(--panel-spacing-lg);\r\n    border: 1px solid var(--panel-border);\r\n    border-radius: var(--panel-radius-lg);\r\n    background: var(--panel-bg-secondary);\r\n    \r\n    /* Performance optimization */\r\n    contain: layout style paint;\r\n}\r\n\r\n#wtr-config-panel .wtr-control-group {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-sm);\r\n}\r\n\r\n/* Modern Control Layout with Grid Fallback */\r\n#wtr-config-panel .wtr-config-controls {\r\n    display: flex;\r\n    gap: var(--panel-spacing-sm);\r\n    align-items: center;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-controls.font-controls {\r\n    flex-wrap: nowrap;\r\n    display: grid;\r\n    grid-template-columns: 1fr;\r\n    gap: var(--panel-spacing-sm);\r\n}\r\n\r\n#wtr-config-panel .wtr-config-controls.checkbox-control {\r\n    justify-content: flex-start;\r\n    cursor: pointer;\r\n    padding: var(--panel-spacing-sm) 0;\r\n    display: grid;\r\n    grid-template-columns: auto 1fr;\r\n    gap: var(--panel-spacing-sm);\r\n    cursor: pointer;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-controls.checkbox-control label {\r\n    user-select: none;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-controls.checkbox-control input {\r\n    margin-right: var(--panel-spacing-sm);\r\n}\r\n\r\n/* Enhanced Form Controls with Touch Optimization */\r\n#wtr-config-panel input[type=\"number\"],\r\n#wtr-config-panel select {\r\n    flex-grow: 1;\r\n    min-width: 100px;\r\n    min-height: 44px; /* Touch target size */\r\n    text-align: center;\r\n    background: var(--panel-bg-secondary);\r\n    color: var(--panel-text-primary);\r\n    border: 1px solid var(--panel-border);\r\n    border-radius: var(--panel-radius-md);\r\n    padding: var(--panel-spacing-sm) var(--panel-spacing-md);\r\n    font-family: var(--panel-font-family);\r\n    font-size: var(--panel-font-size-sm);\r\n    \r\n    /* Performance */\r\n    contain: layout style;\r\n}\r\n\r\n#wtr-config-panel select:disabled {\r\n    background: var(--panel-bg-secondary);\r\n    color: var(--panel-text-secondary);\r\n    cursor: not-allowed;\r\n}\r\n\r\n/* Modern Button Layout */\r\n#wtr-config-panel .wtr-button-group {\r\n    display: grid;\r\n    grid-auto-flow: column;\r\n    gap: var(--panel-spacing-sm);\r\n    justify-content: end;\r\n    flex-shrink: 0;\r\n}\r\n\r\n/* Enhanced Button Styling with Motion Controls */\r\n#wtr-config-panel .wtr-config-button {\r\n    min-height: 44px; /* iOS guideline */\r\n    min-width: 44px;\r\n    padding: var(--panel-spacing-sm) var(--panel-spacing-md);\r\n    border: none;\r\n    border-radius: var(--panel-radius-md);\r\n    cursor: pointer;\r\n    background-color: var(--panel-accent);\r\n    color: white;\r\n    font-weight: var(--panel-font-weight-bold);\r\n    font-size: var(--panel-font-size-sm);\r\n    flex-shrink: 0;\r\n    transition: background-color var(--panel-transition-fast),\r\n                transform var(--panel-transition-fast);\r\n    \r\n    /* Touch optimization */\r\n    touch-action: manipulation;\r\n    -webkit-tap-highlight-color: transparent;\r\n    \r\n    /* Performance */\r\n    contain: layout style paint;\r\n    will-change: transform;\r\n    transform: translateZ(0);\r\n}\r\n\r\n#wtr-config-panel .wtr-config-button:hover,\r\n#wtr-config-panel .wtr-config-button:focus-visible {\r\n    background-color: var(--panel-accent-hover);\r\n    transform: translateY(-1px);\r\n}\r\n\r\n#wtr-config-panel .wtr-config-button:active {\r\n    transform: translateY(0);\r\n}\r\n\r\n#wtr-config-panel .wtr-config-button:disabled {\r\n    background-color: var(--panel-text-secondary);\r\n    cursor: not-allowed;\r\n    transform: none;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-button.control {\r\n    width: 44px;\r\n    aspect-ratio: 1;\r\n}\r\n\r\n#wtr-config-panel .wtr-config-button.reset {\r\n    background-color: var(--panel-danger);\r\n}\r\n\r\n#wtr-config-panel #wtr-config-close-btn {\r\n    background-color: var(--panel-text-secondary);\r\n    align-self: center;\r\n    width: 100px;\r\n    flex-shrink: 0;\r\n}\r\n\r\n/* Enhanced Typography */\r\n#wtr-config-panel .wtr-section-title {\r\n    font-weight: var(--panel-font-weight-medium);\r\n    text-align: center;\r\n    margin-bottom: var(--panel-spacing-sm);\r\n    display: block;\r\n    font-size: var(--panel-font-size-lg);\r\n    color: var(--panel-text-primary);\r\n}\r\n\r\n#wtr-config-panel .wtr-subsection-title {\r\n    font-weight: var(--panel-font-weight-medium);\r\n    text-align: left;\r\n    margin-top: var(--panel-spacing-lg);\r\n    display: block;\r\n    border-top: 1px solid var(--panel-border);\r\n    padding-top: var(--panel-spacing-lg);\r\n    color: var(--panel-text-primary);\r\n}\r\n\r\n/* Enhanced Button Hide Controls Layout */\r\n#wtr-config-panel .wtr-button-hide-controls {\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\r\n    gap: var(--panel-spacing-md);\r\n    justify-content: flex-start;\r\n}\r\n\r\n#wtr-config-panel .icon-checkbox label {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: var(--panel-spacing-sm);\r\n}\r\n\r\n#wtr-config-panel .icon-checkbox svg {\r\n    width: 20px;\r\n    height: 20px;\r\n    stroke: currentColor;\r\n    fill: none;\r\n}\r\n\r\n#wtr-config-panel .icon-checkbox svg:has(use[href*=\"text_fields\"], use[href*=\"tts\"], use[href*=\"list\"]) {\r\n    fill: currentColor;\r\n    stroke: none;\r\n}\r\n\r\n/* Width Controls Grouping - Responsive Layout */\r\n#wtr-config-panel .wtr-width-controls-group {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-lg);\r\n    width: 100%;\r\n}\r\n\r\n#wtr-config-panel .wtr-width-control-item {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: var(--panel-spacing-sm);\r\n    width: 100%;\r\n}\r\n\r\n#wtr-config-panel .wtr-width-label {\r\n    font-weight: var(--panel-font-weight-medium);\r\n    color: var(--panel-text-primary);\r\n    text-align: left;\r\n    margin-bottom: var(--panel-spacing-xs);\r\n}\r\n\r\n#wtr-config-panel .wtr-config-controls.width-controls {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: var(--panel-spacing-sm);\r\n    flex-wrap: nowrap;\r\n    width: 100%;\r\n}\r\n\r\n#wtr-config-panel .wtr-width-input {\r\n    flex: 1;\r\n    min-width: 80px;\r\n    text-align: center;\r\n    /* Grow to fill available space */\r\n    max-width: none;\r\n}\r\n\r\n/* Motion Preference Handling - WCAG 2.2/2.3 Compliance */\r\n@media (prefers-reduced-motion: reduce) {\r\n    #wtr-config-overlay,\r\n    #wtr-config-panel,\r\n    .wtr-config-button {\r\n        transition: none !important;\r\n        animation: none !important;\r\n        transform: none !important;\r\n    }\r\n}\r\n\r\n/* Enable motion for users who haven't disabled it */\r\n@supports not (prefers-reduced-motion: reduce) {\r\n    #wtr-config-panel {\r\n        transition: transform var(--panel-transition-normal) var(--panel-timing-function),\r\n                   opacity var(--panel-transition-normal) ease;\r\n        transform: scale(0.95);\r\n    }\r\n    \r\n    #wtr-config-panel.visible {\r\n        transform: scale(1);\r\n    }\r\n}\r\n\r\n/* Container Query Responsive Design */\r\n@container wtr-panel (max-width: 480px) {\r\n    #wtr-config-panel {\r\n        width: 95%;\r\n        padding: var(--panel-spacing-lg);\r\n    }\r\n    \r\n    .wtr-config-controls {\r\n        flex-direction: column;\r\n        gap: var(--panel-spacing-xs);\r\n    }\r\n    \r\n    .wtr-config-controls.font-controls {\r\n        flex-direction: column;\r\n        align-items: stretch;\r\n    }\r\n    \r\n    .wtr-button-group {\r\n        margin-left: 0;\r\n        justify-content: center;\r\n        grid-auto-flow: row;\r\n    }\r\n    \r\n    .wtr-button-hide-controls {\r\n        grid-template-columns: 1fr;\r\n        gap: var(--panel-spacing-sm);\r\n    }\r\n    \r\n    /* Width controls maintain grouping but stack on small screens */\r\n    .wtr-width-controls-group {\r\n        gap: var(--panel-spacing-md);\r\n    }\r\n    \r\n    .wtr-width-control-item {\r\n        width: 100%;\r\n    }\r\n    \r\n    .wtr-config-controls.width-controls {\r\n        width: 100%;\r\n    }\r\n    \r\n    .wtr-width-input {\r\n        min-width: 70px;\r\n        flex: 1;\r\n    }\r\n}\r\n\r\n@container wtr-panel (max-width: 360px) {\r\n    #wtr-config-panel {\r\n        width: 98%;\r\n        margin: var(--panel-spacing-md);\r\n        padding: var(--panel-spacing-md);\r\n    }\r\n    \r\n    .wtr-config-section {\r\n        padding: var(--panel-spacing-md);\r\n    }\r\n    \r\n    .wtr-config-button {\r\n        min-width: 40px;\r\n    }\r\n    \r\n    /* Extra small screens - ensure width controls stay in single column */\r\n    .wtr-width-controls-group {\r\n        gap: var(--panel-spacing-sm);\r\n    }\r\n    \r\n    .wtr-width-control-item {\r\n        width: 100%;\r\n    }\r\n    \r\n    .wtr-config-controls.width-controls {\r\n        flex-wrap: wrap;\r\n        gap: var(--panel-spacing-xs);\r\n    }\r\n    \r\n    .wtr-width-input {\r\n        min-width: 60px;\r\n        flex: 1;\r\n    }\r\n}\r\n\r\n/* Grid Layout Fallbacks */\r\n@supports not (display: grid) {\r\n    .wtr-config-controls {\r\n        display: flex;\r\n        flex-wrap: wrap;\r\n    }\r\n    \r\n    .wtr-button-group {\r\n        display: flex;\r\n        flex-wrap: wrap;\r\n    }\r\n    \r\n    .wtr-button-hide-controls {\r\n        display: flex;\r\n        flex-wrap: wrap;\r\n    }\r\n    \r\n    /* Width controls fallback - ensure they stay in single column */\r\n    .wtr-width-controls-group {\r\n        display: flex;\r\n        flex-direction: column;\r\n        gap: var(--panel-spacing-md);\r\n    }\r\n    \r\n    .wtr-width-control-item {\r\n        display: flex;\r\n        flex-direction: column;\r\n        gap: var(--panel-spacing-sm);\r\n        width: 100%;\r\n    }\r\n    \r\n    .wtr-config-controls.width-controls {\r\n        display: flex;\r\n        flex-wrap: wrap;\r\n        gap: var(--panel-spacing-sm);\r\n        width: 100%;\r\n    }\r\n}\r\n\r\n/* Container Queries Fallback */\r\n@supports not (container-type: inline-size) {\r\n    #wtr-config-container {\r\n        /* Fallback - styles remain as above for viewport-based responsiveness */\r\n    }\r\n    \r\n    /* Legacy media queries as fallback */\r\n    @media (max-width: 480px) {\r\n        #wtr-config-panel {\r\n            width: 95%;\r\n            padding: var(--panel-spacing-lg);\r\n        }\r\n        \r\n        .wtr-config-controls {\r\n            flex-direction: column;\r\n            gap: var(--panel-spacing-xs);\r\n        }\r\n        \r\n        /* Width controls fallback for legacy browsers */\r\n        .wtr-width-controls-group {\r\n            gap: var(--panel-spacing-md);\r\n        }\r\n        \r\n        .wtr-width-control-item {\r\n            width: 100%;\r\n        }\r\n        \r\n        .wtr-config-controls.width-controls {\r\n            width: 100%;\r\n        }\r\n        \r\n        .wtr-width-input {\r\n            min-width: 70px;\r\n            flex: 1;\r\n        }\r\n    }\r\n    \r\n    /* Extra small screens fallback */\r\n    @media (max-width: 360px) {\r\n        .wtr-width-controls-group {\r\n            gap: var(--panel-spacing-sm);\r\n        }\r\n        \r\n        .wtr-config-controls.width-controls {\r\n            flex-wrap: wrap;\r\n            gap: var(--panel-spacing-xs);\r\n        }\r\n        \r\n        .wtr-width-input {\r\n            min-width: 60px;\r\n            flex: 1;\r\n        }\r\n    }\r\n}\r\n\r\n/* Backdrop Filter Fallback */\r\n@supports not (backdrop-filter: blur(1px)) {\r\n    #wtr-config-overlay {\r\n        background-color: rgba(0, 0, 0, 0.8);\r\n    }\r\n}\r\n\r\n/* Touch-specific enhancements */\r\n@media (hover: none) and (pointer: coarse) {\r\n    .wtr-config-button {\r\n        min-height: 48px;\r\n        padding: var(--panel-spacing-md) var(--panel-spacing-lg);\r\n        font-size: var(--panel-font-size-md);\r\n    }\r\n    \r\n    .wtr-config-controls input[type=\"number\"],\r\n    .wtr-config-controls select {\r\n        min-height: 48px;\r\n        font-size: var(--panel-font-size-md);\r\n    }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/modules/config.js":
/*!*******************************!*\
  !*** ./src/modules/config.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEBUG_KEY: () => (/* binding */ DEBUG_KEY),
/* harmony export */   FONTS_API_URL: () => (/* binding */ FONTS_API_URL),
/* harmony export */   MIN_WIDTH: () => (/* binding */ MIN_WIDTH),
/* harmony export */   RECOMMENDED_FONTS: () => (/* binding */ RECOMMENDED_FONTS),
/* harmony export */   STEP_WIDTH: () => (/* binding */ STEP_WIDTH),
/* harmony export */   configs: () => (/* binding */ configs)
/* harmony export */ });
const DEBUG_KEY = "wtr_lab_enhancer_debug";
const STEP_WIDTH = 50;
const MIN_WIDTH = 300;
const FONTS_API_URL = "https://gwfh.mranftl.com/api/fonts";
const RECOMMENDED_FONTS = {
  serif: ["Merriweather", "Lora", "Crimson Text", "Libre Baskerville", "Spectral", "EB Garamond", "Noto Serif"],
  sansSerif: ["Roboto", "Open Sans", "Source Sans Pro"]
};
const configs = {
  reader: {
    key: "wtr_lab_reader_width",
    selector: ".fix-size.card",
    defaultWidth: 760,
    label: "Reader Content Width"
  },
  nav: {
    key: "wtr_lab_nav_width",
    selector: "nav.bottom-reader-nav .fix-size",
    defaultWidth: 760,
    label: "Bottom Navigator Width"
  },
  navConstraint: {
    key: "wtr_lab_nav_constraint",
    selector: "nav.bottom-reader-nav",
    defaultState: false,
    label: "Constrain Navigator Background"
  },
  fontToggle: {
    key: "wtr_lab_font_style_enabled",
    defaultState: false,
    label: "Enable Custom Font Style"
  },
  font: {
    key: "wtr_lab_font_family",
    selector: ".chapter-body",
    defaultFont: "Merriweather",
    label: "Font Style"
  },
  blockAddTerm: {
    key: "wtr_lab_block_add_term",
    selector: ".floating-add-term-btn",
    defaultState: false,
    label: 'Block "Add Term" Button'
  },
  hideBookBtn: {
    key: "wtr_lab_hide_book_btn",
    selector: 'div.btn-group button.wtr:has(svg use[href*="book"])',
    defaultState: false,
    label: "Book",
    iconHTML: '<svg><use href="/icons/sprite_cd1f90d7.svg#book"></use></svg>'
  },
  hideTextFieldsBtn: {
    key: "wtr_lab_hide_text_fields_btn",
    selector: 'div.btn-group button.wtr:has(svg use[href*="text_fields"])',
    defaultState: false,
    label: "Text",
    iconHTML: '<svg><use href="/icons/sprite_cd1f90d7.svg#text_fields"></use></svg>'
  },
  hideTtsBtn: {
    key: "wtr_lab_hide_tts_btn",
    selector: 'div.btn-group button.wtr:has(svg use[href*="tts"])',
    defaultState: false,
    label: "TTS",
    iconHTML: '<svg><use href="/icons/sprite_cd1f90d7.svg#tts"></use></svg>'
  },
  hideCogBtn: {
    key: "wtr_lab_hide_cog_btn",
    selector: 'div.btn-group button.wtr:has(svg use[href*="cog-outline"])',
    defaultState: false,
    label: "Settings",
    iconHTML: '<svg><use href="/icons/sprite_cd1f90d7.svg#cog-outline"></use></svg>'
  },
  hideListBtn: {
    key: "wtr_lab_hide_list_btn",
    selector: 'div.btn-group button.wtr:has(svg use[href*="list"])',
    defaultState: false,
    label: "List",
    iconHTML: '<svg><use href="/icons/sprite_cd1f90d7.svg#list"></use></svg>'
  },
  debug: {
    key: DEBUG_KEY,
    defaultState: false,
    label: "Enable Debug Logging"
  }
};

/***/ }),

/***/ "./src/modules/features.js":
/*!*********************************!*\
  !*** ./src/modules/features.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectCSSFeatures: () => (/* binding */ detectCSSFeatures),
/* harmony export */   initializeBackdropEffects: () => (/* binding */ initializeBackdropEffects),
/* harmony export */   initializeContainerQueryResponsive: () => (/* binding */ initializeContainerQueryResponsive),
/* harmony export */   initializeGridLayouts: () => (/* binding */ initializeGridLayouts),
/* harmony export */   initializeModernFeatures: () => (/* binding */ initializeModernFeatures),
/* harmony export */   initializeTouchOptimizations: () => (/* binding */ initializeTouchOptimizations)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./src/modules/logger.js");

const detectCSSFeatures = () => {
  const features = {
    containerQueries: CSS.supports('container-type: inline-size'),
    grid: CSS.supports('display: grid'),
    backdropFilter: CSS.supports('backdrop-filter: blur(1px)'),
    customProperties: CSS.supports('--custom: 0'),
    motionPreferences: window.matchMedia('(prefers-reduced-motion: reduce)'),
    touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
  (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)('CSS Feature Detection:', features);
  return features;
};
const initializeModernFeatures = () => {
  const features = detectCSSFeatures();

  // Add feature flags to the document for CSS fallbacks
  document.documentElement.setAttribute('data-container-queries', features.containerQueries);
  document.documentElement.setAttribute('data-grid', features.grid);
  document.documentElement.setAttribute('data-backdrop-filter', features.backdropFilter);
  document.documentElement.setAttribute('data-touch-device', features.touchDevice);

  // Initialize modern features if supported
  if (features.containerQueries) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)('Container queries supported - enabling responsive container design');
    initializeContainerQueryResponsive();
  }
  if (features.grid) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)('CSS Grid supported - enabling modern grid layouts');
    initializeGridLayouts();
  }
  if (features.backdropFilter) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)('Backdrop filter supported - enabling blur effects');
    initializeBackdropEffects();
  }
  if (features.touchDevice) {
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)('Touch device detected - optimizing for touch interactions');
    initializeTouchOptimizations();
  }

  // Set up motion preference listeners
  features.motionPreferences.addEventListener('change', e => {
    const isReducedMotion = e.matches;
    document.documentElement.setAttribute('data-reduced-motion', isReducedMotion);
    (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.log)(`Motion preference changed: ${isReducedMotion ? 'Reduce motion' : 'Allow motion'}`);
  });

  // Set initial motion preference
  document.documentElement.setAttribute('data-reduced-motion', features.reducedMotion);
};
const initializeContainerQueryResponsive = () => {
  const container = document.getElementById('wtr-config-container');
  if (container) {
    container.classList.add('wtr-container-responsive');
  }
};
const initializeGridLayouts = () => {
  const controls = document.querySelectorAll('.wtr-config-controls');
  controls.forEach(control => {
    control.classList.add('wtr-grid-enabled');
  });
};
const initializeBackdropEffects = () => {
  const overlay = document.getElementById('wtr-config-overlay');
  if (overlay) {
    overlay.classList.add('wtr-backdrop-filter');
  }
};
const initializeTouchOptimizations = () => {
  const buttons = document.querySelectorAll('.wtr-config-button');
  buttons.forEach(button => {
    button.classList.add('wtr-touch-optimized');
  });
  const inputs = document.querySelectorAll('input[type="number"], select');
  inputs.forEach(input => {
    input.classList.add('wtr-touch-optimized');
  });
};

/***/ }),

/***/ "./src/modules/fontManager.js":
/*!************************************!*\
  !*** ./src/modules/fontManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyFontStyle: () => (/* binding */ applyFontStyle),
/* harmony export */   fetchFonts: () => (/* binding */ fetchFonts),
/* harmony export */   getFallbackFonts: () => (/* binding */ getFallbackFonts),
/* harmony export */   populateFontDropdown: () => (/* binding */ populateFontDropdown)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/modules/config.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.js */ "./src/modules/logger.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.js */ "./src/modules/styles.js");



const loadValue = (key, defaultValue) => GM_getValue(key, defaultValue);
const getFallbackFonts = () => ({
  recommendedSerif: _config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.serif,
  recommendedSansSerif: _config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.sansSerif,
  other: ["Georgia", "Times New Roman", "Arial", "Verdana"]
});
const fetchFonts = () => new Promise(resolve => GM_xmlhttpRequest({
  method: "GET",
  url: _config_js__WEBPACK_IMPORTED_MODULE_0__.FONTS_API_URL,
  onload: r => {
    try {
      const d = JSON.parse(r.responseText);
      const rec = [..._config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.serif, ..._config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.sansSerif];
      resolve({
        recommendedSerif: _config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.serif,
        recommendedSansSerif: _config_js__WEBPACK_IMPORTED_MODULE_0__.RECOMMENDED_FONTS.sansSerif,
        other: d.map(f => f.family).filter(f => !rec.includes(f)).sort()
      });
    } catch (e) {
      resolve(getFallbackFonts());
    }
  },
  onerror: () => resolve(getFallbackFonts())
}));
const applyFontStyle = fontFamily => {
  const isEnabled = loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.fontToggle.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.fontToggle.defaultState);
  if (!isEnabled) {
    (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.removeFontStyle)();
    return;
  }
  (0,_logger_js__WEBPACK_IMPORTED_MODULE_1__.log)(`Applying font: ${fontFamily}`);
  const primaryFont = fontFamily.split(",")[0].trim();
  const styleId = "custom-font-styler";
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(primaryFont)}&display=swap`;
  let linkElement = document.getElementById("userscript-font-link");
  if (!linkElement) {
    linkElement = document.createElement("link");
    linkElement.id = "userscript-font-link";
    linkElement.rel = "stylesheet";
    document.head.appendChild(linkElement);
  }
  linkElement.href = fontUrl;
  styleElement.textContent = `${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.selector} { font-family: "${primaryFont}", serif, sans-serif !important; }`;
};
const populateFontDropdown = async (initialFontGroups = null) => {
  const fontSelect = document.getElementById("wtr-font-select");
  if (!fontSelect) return;
  const currentFont = loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.defaultFont);
  fontSelect.innerHTML = "";
  const fontGroups = initialFontGroups || (await fetchFonts());
  const groupLabels = {
    recommendedSerif: "Recommended (Serif)",
    recommendedSansSerif: "Recommended (Sans-serif)",
    other: "All Other Fonts"
  };
  for (const groupKey in fontGroups) {
    if (fontGroups[groupKey].length === 0) continue;
    const optgroup = document.createElement("optgroup");
    optgroup.label = groupLabels[groupKey] || "Fonts";
    fontGroups[groupKey].forEach(font => {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      optgroup.appendChild(option);
    });
    fontSelect.appendChild(optgroup);
  }
  fontSelect.value = Object.values(fontGroups).flat().includes(currentFont) ? currentFont : _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.defaultFont;
};


/***/ }),

/***/ "./src/modules/logger.js":
/*!*******************************!*\
  !*** ./src/modules/logger.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   syncDebugState: () => (/* binding */ syncDebugState),
/* harmony export */   toggleDebugLogging: () => (/* binding */ toggleDebugLogging)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/modules/config.js");

let isDebugEnabled = GM_getValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.DEBUG_KEY, false);
const syncDebugState = () => {
  isDebugEnabled = GM_getValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.DEBUG_KEY, false);
};
const log = (...args) => {
  if (isDebugEnabled) console.log("[WTR-Lab Enhancer]", ...args);
};
const toggleDebugLogging = () => {
  isDebugEnabled = !isDebugEnabled;
  GM_setValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.DEBUG_KEY, isDebugEnabled);
  alert(`Debug logging is now ${isDebugEnabled ? "ENABLED" : "DISABLED"}.`);
};

/***/ }),

/***/ "./src/modules/styles.js":
/*!*******************************!*\
  !*** ./src/modules/styles.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyWidthStyle: () => (/* binding */ applyWidthStyle),
/* harmony export */   removeFontStyle: () => (/* binding */ removeFontStyle),
/* harmony export */   updateBlockAddTerm: () => (/* binding */ updateBlockAddTerm),
/* harmony export */   updateButtonVisibilityStyles: () => (/* binding */ updateButtonVisibilityStyles),
/* harmony export */   updateNavConstraint: () => (/* binding */ updateNavConstraint)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/modules/config.js");

const loadValue = (key, defaultValue) => GM_getValue(key, defaultValue);
const applyWidthStyle = (configName, width) => {
  const styleId = `custom-width-styler-${configName}`;
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs[configName].selector} { max-width: ${width}px !important; }`;
};
const updateNavConstraint = () => {
  const isConstrained = loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.navConstraint.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.navConstraint.defaultState);
  const styleId = 'custom-nav-constraint-styler';
  let styleElement = document.getElementById(styleId);
  if (isConstrained) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    const navContentWidth = loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.nav.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.nav.defaultWidth);
    const marginValue = Math.max(0, (window.innerWidth - navContentWidth) / 2);
    styleElement.textContent = `${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.navConstraint.selector} { margin-left: ${marginValue}px !important; margin-right: ${marginValue}px !important; }`;
  } else if (styleElement) {
    styleElement.remove();
  }
};
const updateBlockAddTerm = () => {
  const isBlocked = loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.blockAddTerm.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.blockAddTerm.defaultState);
  const styleId = 'custom-block-add-term-styler';
  let styleElement = document.getElementById(styleId);
  if (isBlocked) {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.blockAddTerm.selector} { display: none !important; }`;
  } else if (styleElement) {
    styleElement.remove();
  }
};
const updateButtonVisibilityStyles = () => {
  const styleId = 'custom-button-visibility-styler';
  let styleElement = document.getElementById(styleId);
  const buttonConfigs = [_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.hideBookBtn, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.hideTextFieldsBtn, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.hideTtsBtn, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.hideCogBtn, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.hideListBtn];
  const selectorsToHide = buttonConfigs.filter(config => loadValue(config.key, config.defaultState)).map(config => config.selector);
  if (!styleElement && selectorsToHide.length > 0) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  if (styleElement) {
    styleElement.textContent = selectorsToHide.length > 0 ? `${selectorsToHide.join(', ')} { display: none !important; }` : '';
  }
};
const removeFontStyle = () => {
  const styleElement = document.getElementById('custom-font-styler');
  if (styleElement) styleElement.remove();
  const linkElement = document.getElementById('userscript-font-link');
  if (linkElement) linkElement.remove();
};

/***/ }),

/***/ "./src/modules/ui.js":
/*!***************************!*\
  !*** ./src/modules/ui.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createConfigPanel: () => (/* binding */ createConfigPanel),
/* harmony export */   hideConfigPanel: () => (/* binding */ hideConfigPanel),
/* harmony export */   showConfigPanel: () => (/* binding */ showConfigPanel)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./src/modules/config.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.js */ "./src/modules/logger.js");
/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.js */ "./src/modules/styles.js");
/* harmony import */ var _fontManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fontManager.js */ "./src/modules/fontManager.js");




const saveValue = (key, value) => GM_setValue(key, value);
const loadValue = (key, defaultValue) => GM_getValue(key, defaultValue);
let isDebugEnabled = GM_getValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.debug.key, false);

// --- UI CONFIGURATION PANEL ---
const createConfigPanel = () => {
  const panelHTML = `<div id="wtr-config-container" class="wtr-panel-container"><div id="wtr-config-overlay" style="display: none;"><div id="wtr-config-panel"><h2>WTR-Lab Enhancer Settings</h2><div id="wtr-config-sections"></div><button id="wtr-config-close-btn" class="wtr-config-button">Close</button></div></div></div>`;
  document.body.insertAdjacentHTML("beforeend", panelHTML);
  const sectionsContainer = document.getElementById("wtr-config-sections");

  // Section 1: Layout & Sizing
  const layoutSection = document.createElement("div");
  layoutSection.className = "wtr-config-section";
  layoutSection.innerHTML = `<label class="wtr-section-title">Layout & Sizing</label>
            <div class="wtr-width-controls-group">
                <div class="wtr-width-control-item">
                    <label for="wtr-reader-width-input" class="wtr-width-label">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.reader.label} (px)</label>
                    <div class="wtr-config-controls width-controls">
                        <button id="wtr-reader-decrease-btn" class="wtr-config-button control">-</button>
                        <input type="number" id="wtr-reader-width-input" min="${_config_js__WEBPACK_IMPORTED_MODULE_0__.MIN_WIDTH}" step="10" class="wtr-width-input">
                        <button id="wtr-reader-increase-btn" class="wtr-config-button control">+</button>
                        <button id="wtr-reader-reset-btn" class="wtr-config-button reset">Reset</button>
                    </div>
                </div>
                <div class="wtr-width-control-item">
                    <label for="wtr-nav-width-input" class="wtr-width-label">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.nav.label} (px)</label>
                    <div class="wtr-config-controls width-controls">
                        <button id="wtr-nav-decrease-btn" class="wtr-config-button control">-</button>
                        <input type="number" id="wtr-nav-width-input" min="${_config_js__WEBPACK_IMPORTED_MODULE_0__.MIN_WIDTH}" step="10" class="wtr-width-input">
                        <button id="wtr-nav-increase-btn" class="wtr-config-button control">+</button>
                        <button id="wtr-nav-reset-btn" class="wtr-config-button reset">Reset</button>
                    </div>
                </div>
            </div>`;
  sectionsContainer.appendChild(layoutSection);

  // Section 2: Font Customization
  const fontSection = document.createElement("div");
  fontSection.className = "wtr-config-section";
  fontSection.innerHTML = `<label class="wtr-section-title">Font Customization</label>
            <div class="wtr-config-controls checkbox-control"><input type="checkbox" id="wtr-fontToggle-toggle"><label for="wtr-fontToggle-toggle">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.fontToggle.label}</label></div>
            <div class="wtr-control-group">
                <label for="wtr-font-select">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.label}</label>
                <div class="wtr-config-controls font-controls"><select id="wtr-font-select"></select></div>
                <div class="wtr-config-controls font-controls"><div class="wtr-button-group"><button id="wtr-font-refresh-btn" class="wtr-config-button">Refresh</button><button id="wtr-font-reset-btn" class="wtr-config-button reset">Reset</button></div></div>
            </div>`;
  sectionsContainer.appendChild(fontSection);

  // Section 3: Element Visibility
  const visibilitySection = document.createElement("div");
  visibilitySection.className = "wtr-config-section";
  visibilitySection.innerHTML = `<label class="wtr-section-title">Element Visibility</label>
            <div class="wtr-config-controls checkbox-control"><input type="checkbox" id="wtr-navConstraint-toggle"><label for="wtr-navConstraint-toggle">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.navConstraint.label}</label></div>
            <div class="wtr-config-controls checkbox-control"><input type="checkbox" id="wtr-blockAddTerm-toggle"><label for="wtr-blockAddTerm-toggle">${_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.blockAddTerm.label}</label></div>
            <div class="wtr-control-group"><label class="wtr-subsection-title">Hide Toolbar Buttons</label><div class="wtr-button-hide-controls"></div></div>`;
  const buttonControlsContainer = visibilitySection.querySelector(".wtr-button-hide-controls");
  Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs).filter(([n]) => n.startsWith("hide")).forEach(([name, config]) => {
    buttonControlsContainer.insertAdjacentHTML("beforeend", `<div class="wtr-config-controls checkbox-control icon-checkbox"><input type="checkbox" id="wtr-${name}-toggle"><label for="wtr-${name}-toggle">${config.iconHTML}<span>${config.label}</span></label></div>`);
  });
  sectionsContainer.appendChild(visibilitySection);

  // Section 4: Debug & Advanced
  const debugSection = document.createElement("div");
  debugSection.className = "wtr-config-section";
  debugSection.innerHTML = `<label class="wtr-section-title">Debug & Advanced</label>
			         <div class="wtr-config-controls checkbox-control"><input type="checkbox" id="wtr-debug-toggle"><label for="wtr-debug-toggle">Enable Debug Logging</label></div>`;
  sectionsContainer.appendChild(debugSection);
  (0,_fontManager_js__WEBPACK_IMPORTED_MODULE_3__.populateFontDropdown)((0,_fontManager_js__WEBPACK_IMPORTED_MODULE_3__.getFallbackFonts)());
  attachPanelEventListeners();
};
const attachPanelEventListeners = () => {
  document.getElementById("wtr-config-overlay").addEventListener("click", e => {
    if (e.target.id === "wtr-config-overlay") hideConfigPanel();
  });
  document.getElementById("wtr-config-close-btn").addEventListener("click", hideConfigPanel);
  const updateSetting = (configName, value) => {
    const config = _config_js__WEBPACK_IMPORTED_MODULE_0__.configs[configName];
    saveValue(config.key, value);
    if (configName === "font") {
      (0,_fontManager_js__WEBPACK_IMPORTED_MODULE_3__.applyFontStyle)(value);
      document.getElementById("wtr-font-select").value = value;
    } else if (configName === "fontToggle") {
      updateFontControlsState(value);
      (0,_fontManager_js__WEBPACK_IMPORTED_MODULE_3__.applyFontStyle)(loadValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.key, _config_js__WEBPACK_IMPORTED_MODULE_0__.configs.font.defaultFont));
    } else if (configName === "debug") {
      isDebugEnabled = value;
      GM_setValue(_config_js__WEBPACK_IMPORTED_MODULE_0__.DEBUG_KEY, isDebugEnabled);
      (0,_logger_js__WEBPACK_IMPORTED_MODULE_1__.log)(`Debug logging ${isDebugEnabled ? "ENABLED" : "DISABLED"}`);
    } else if (configName === "navConstraint") {
      (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.updateNavConstraint)();
    } else if (configName === "blockAddTerm") {
      (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.updateBlockAddTerm)();
    } else if (configName.startsWith("hide")) {
      (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.updateButtonVisibilityStyles)();
    } else {
      const validatedWidth = Math.max(_config_js__WEBPACK_IMPORTED_MODULE_0__.MIN_WIDTH, parseInt(value, 10));
      if (isNaN(validatedWidth)) return;
      (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.applyWidthStyle)(configName, validatedWidth);
      document.getElementById(`wtr-${configName}-width-input`).value = validatedWidth;
      saveValue(config.key, validatedWidth);
      if (configName === "nav") (0,_styles_js__WEBPACK_IMPORTED_MODULE_2__.updateNavConstraint)();
    }
  };
  for (const [name, config] of Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs)) {
    if (name === "font") {
      const select = document.getElementById("wtr-font-select");
      select.addEventListener("change", () => updateSetting(name, select.value));
      document.getElementById("wtr-font-reset-btn").addEventListener("click", () => updateSetting(name, config.defaultFont));
      const refreshBtn = document.getElementById("wtr-font-refresh-btn");
      refreshBtn.addEventListener("click", async () => {
        refreshBtn.textContent = "Fetching...";
        refreshBtn.disabled = true;
        await (0,_fontManager_js__WEBPACK_IMPORTED_MODULE_3__.populateFontDropdown)();
        refreshBtn.textContent = "Refresh";
        refreshBtn.disabled = false;
      });
    } else if (["fontToggle", "navConstraint", "blockAddTerm", "debug"].includes(name) || name.startsWith("hide")) {
      const toggle = document.getElementById(`wtr-${name}-toggle`);
      if (toggle) toggle.addEventListener("change", () => updateSetting(name, toggle.checked));
    } else if (["reader", "nav"].includes(name)) {
      const input = document.getElementById(`wtr-${name}-width-input`);
      document.getElementById(`wtr-${name}-increase-btn`).addEventListener("click", () => updateSetting(name, parseInt(input.value, 10) + _config_js__WEBPACK_IMPORTED_MODULE_0__.STEP_WIDTH));
      document.getElementById(`wtr-${name}-decrease-btn`).addEventListener("click", () => updateSetting(name, parseInt(input.value, 10) - _config_js__WEBPACK_IMPORTED_MODULE_0__.STEP_WIDTH));
      document.getElementById(`wtr-${name}-reset-btn`).addEventListener("click", () => updateSetting(name, config.defaultWidth));
      input.addEventListener("change", () => updateSetting(name, input.value));
    }
  }
};
const updateFontControlsState = isEnabled => {
  ["wtr-font-select", "wtr-font-refresh-btn", "wtr-font-reset-btn"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.disabled = !isEnabled;
  });
};
const showConfigPanel = () => {
  for (const [name, config] of Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_0__.configs)) {
    if (name === "font") {
      document.getElementById("wtr-font-select").value = loadValue(config.key, config.defaultFont);
    } else if (name === "fontToggle") {
      const isEnabled = loadValue(config.key, config.defaultState);
      document.getElementById("wtr-fontToggle-toggle").checked = isEnabled;
      updateFontControlsState(isEnabled);
    } else if (["navConstraint", "blockAddTerm", "debug"].includes(name) || name.startsWith("hide")) {
      const toggle = document.getElementById(`wtr-${name}-toggle`);
      if (toggle) toggle.checked = loadValue(config.key, config.defaultState);
    } else if (["reader", "nav"].includes(name)) {
      document.getElementById(`wtr-${name}-width-input`).value = loadValue(config.key, config.defaultWidth);
    }
  }
  document.getElementById("wtr-config-overlay").style.display = "flex";
};
const hideConfigPanel = () => document.getElementById("wtr-config-overlay").style.display = "none";

/***/ }),

/***/ "./src/styles/panel.css":
/*!******************************!*\
  !*** ./src/styles/panel.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./panel.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/panel.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_panel_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/panel.css */ "./src/styles/panel.css");
/* harmony import */ var _modules_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/config.js */ "./src/modules/config.js");
/* harmony import */ var _modules_logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/logger.js */ "./src/modules/logger.js");
/* harmony import */ var _modules_styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/styles.js */ "./src/modules/styles.js");
/* harmony import */ var _modules_fontManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/fontManager.js */ "./src/modules/fontManager.js");
/* harmony import */ var _modules_ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/ui.js */ "./src/modules/ui.js");
/* harmony import */ var _modules_features_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/features.js */ "./src/modules/features.js");
// Import the panel's CSS. Webpack will inject it into the page.


// Import modules






const saveValue = (key, value) => GM_setValue(key, value);
const loadValue = (key, defaultValue) => GM_getValue(key, defaultValue);

// --- INITIALIZATION ---
const init = async () => {
  (0,_modules_logger_js__WEBPACK_IMPORTED_MODULE_2__.log)("Initializing script...");
  (0,_modules_logger_js__WEBPACK_IMPORTED_MODULE_2__.syncDebugState)();
  (0,_modules_ui_js__WEBPACK_IMPORTED_MODULE_5__.createConfigPanel)();

  // Apply initial styles
  (0,_modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.applyWidthStyle)("reader", loadValue(_modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.reader.key, _modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.reader.defaultWidth));
  (0,_modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.applyWidthStyle)("nav", loadValue(_modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.nav.key, _modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.nav.defaultWidth));
  (0,_modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.updateNavConstraint)();
  (0,_modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.updateBlockAddTerm)();
  (0,_modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.updateButtonVisibilityStyles)();

  // Set up font
  const fontGroups = await (0,_modules_fontManager_js__WEBPACK_IMPORTED_MODULE_4__.fetchFonts)();
  const allAvailableFonts = Object.values(fontGroups).flat();
  let initialFont = loadValue(_modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.font.key, _modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.font.defaultFont);
  if (!allAvailableFonts.includes(initialFont)) {
    initialFont = _modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.font.defaultFont;
    saveValue(_modules_config_js__WEBPACK_IMPORTED_MODULE_1__.configs.font.key, initialFont);
  }
  (0,_modules_fontManager_js__WEBPACK_IMPORTED_MODULE_4__.applyFontStyle)(initialFont);
  (0,_modules_fontManager_js__WEBPACK_IMPORTED_MODULE_4__.populateFontDropdown)(fontGroups);

  // Event Listeners & Menu Commands
  window.addEventListener("resize", _modules_styles_js__WEBPACK_IMPORTED_MODULE_3__.updateNavConstraint);
  GM_registerMenuCommand("Configure Settings", _modules_ui_js__WEBPACK_IMPORTED_MODULE_5__.showConfigPanel);

  // Progressive Enhancement
  (0,_modules_features_js__WEBPACK_IMPORTED_MODULE_6__.initializeModernFeatures)();
  (0,_modules_logger_js__WEBPACK_IMPORTED_MODULE_2__.log)("Initialization complete.");
};

// Run the script
init();
})();

/******/ })()
;
//# sourceMappingURL=wtr-lab-enhancer-greasyfork.user.js.map