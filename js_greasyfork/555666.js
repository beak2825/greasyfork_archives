// ==UserScript==
// @name         [EOL] diverses: darktheme/lighttheme artikel-edit
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      0.0.9
// @description  Rendert opus.geizhals.at/kalif/artikel mit darktheme/lighttheme Filter Mode
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @match        https://opus.geizhals.at/kalif/artikel?clone_id=*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/555666/%5BEOL%5D%20diverses%3A%20darkthemelighttheme%20artikel-edit.user.js
// @updateURL https://update.greasyfork.org/scripts/555666/%5BEOL%5D%20diverses%3A%20darkthemelighttheme%20artikel-edit.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // ============================================================================
    // MUTATION OBSERVER FÜR DYNAMISCHE DROPDOWN OPTIONS
    // ============================================================================

    function initDropdownOptionObserver() {
        // Überwache ALLE Menus auf neue Option-Elemente
        const menuObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Wenn neue Optionen hinzugefügt wurden
                            if (node.className && (node.className.includes('option') || node.getAttribute('role') === 'option')) {
                                applyOptionStyle(node);
                            }
                            // Oder wenn ein neues Menu/Listbox hinzugefügt wurde
                            if (node.className && (node.className.includes('menu') || node.getAttribute('role') === 'listbox')) {
                                styleDropdown(node);
                                // Überwache auch dieses neue Menu
                                watchDropdownForOptions(node);
                            }
                            // Suche auch nested Options
                            const nestedOptions = node.querySelectorAll ? node.querySelectorAll('[class*="option"], [role="option"]') : [];
                            nestedOptions.forEach(opt => applyOptionStyle(opt));
                        }
                    });
                }
            });
        });

        return menuObserver;
    }

    let globalDropdownObserver = null;

    function getDropdownObserver() {
        if (!globalDropdownObserver) {
            globalDropdownObserver = initDropdownOptionObserver();
        }
        return globalDropdownObserver;
    }

    // ============================================================================
    // Z-INDEX STACKING CONTEXT FIX FÜR DROPDOWNS
    // ============================================================================
    // PROBLEM: Nach dem Schließen eines Dropdowns behielt das Element einen hohen
    // z-index, was dazu führte, dass es nachfolgende Dropdowns überdeckte.
    //
    // LÖSUNG: Dynamische z-index Steuerung
    // - Wenn Dropdown GEÖFFNET ist: z-index = 999999999 (ganz oben)
    // - Wenn Dropdown GESCHLOSSEN ist: z-index = 1 (minimal)
    //
    // Dies wird durch einen MutationObserver überwacht, der auf Änderungen der
    // Menu-Elemente reagiert und die z-index Werte der Dropdowns automatisch
    // anpasst. So können geschlossene Dropdowns andere Dropdowns nicht überdecken.
    // ============================================================================

    function watchDropdownForOptions(dropdownElement) {
        const observer = getDropdownObserver();
        observer.observe(dropdownElement, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // Fix parent overflow issues
        fixParentOverflow(dropdownElement);

        // Watch for dropdown closing (when menu disappears)
        const closeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const menuElements = dropdownElement.querySelectorAll('[class*="menu"]');
                    if (menuElements.length === 0 ||
                        (menuElements[0] && window.getComputedStyle(menuElements[0]).display === 'none')) {
                        // Dropdown is closed - reset z-index on parent
                        if (dropdownElement.parentElement) {
                            dropdownElement.parentElement.style.setProperty('z-index', '1', 'important');
                        }
                        dropdownElement.style.setProperty('z-index', '1', 'important');
                    } else {
                        // Dropdown is open - restore z-index
                        if (dropdownElement.parentElement) {
                            dropdownElement.parentElement.style.setProperty('z-index', '999999998', 'important');
                        }
                        dropdownElement.style.setProperty('z-index', '999999999', 'important');
                    }
                }
            });
        });

        closeObserver.observe(dropdownElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function applyOptionStyle(optionEl) {
        optionEl.style.setProperty('display', 'block', 'important');
        optionEl.style.setProperty('height', 'auto', 'important');
        optionEl.style.setProperty('min-height', '32px', 'important');
        optionEl.style.setProperty('padding', '8px 12px', 'important');
        optionEl.style.setProperty('background-color', '#2a2a2a', 'important');
        optionEl.style.setProperty('color', '#e8e6e3', 'important');
        optionEl.style.setProperty('opacity', '1', 'important');
        optionEl.style.setProperty('overflow', 'visible', 'important');
        optionEl.style.setProperty('visibility', 'visible', 'important');
        optionEl.style.setProperty('filter', 'none', 'important');
        optionEl.style.setProperty('border', 'none', 'important');
        optionEl.style.setProperty('cursor', 'pointer', 'important');
    }

    function styleDropdown(dropdownEl) {
        dropdownEl.style.setProperty('opacity', '1', 'important');
        dropdownEl.style.setProperty('background-color', '#2a2a2a', 'important');
        dropdownEl.style.setProperty('color', '#e8e6e3', 'important');
        dropdownEl.style.setProperty('filter', 'none', 'important');
        dropdownEl.style.setProperty('z-index', '999999999', 'important');
        dropdownEl.style.setProperty('position', 'absolute', 'important');
        dropdownEl.style.setProperty('pointer-events', 'auto', 'important');
        dropdownEl.style.setProperty('visibility', 'visible', 'important');
        dropdownEl.style.setProperty('display', 'block', 'important');
        dropdownEl.style.setProperty('height', 'auto', 'important');
        dropdownEl.style.setProperty('max-height', 'none', 'important');
        dropdownEl.style.setProperty('overflow', 'visible', 'important');

        // Make immediate parent position: relative for absolute positioning and give it high z-index
        if (dropdownEl.parentElement) {
            dropdownEl.parentElement.style.setProperty('position', 'relative', 'important');
            dropdownEl.parentElement.style.setProperty('z-index', '999999998', 'important');
        }
    }

    function fixParentOverflow(el) {
        try {
            let current = el.parentElement;
            let depth = 0;
            while (current && current !== document.body && depth < 30) {
                try {
                    const comp = window.getComputedStyle(current);
                    if (comp.overflow === 'hidden' || comp.overflow === 'auto' || comp.overflow === 'scroll') {
                        current.style.setProperty('overflow', 'visible', 'important');
                    }
                    if (comp.clipPath !== 'none') {
                        current.style.setProperty('clip-path', 'none', 'important');
                    }
                    // Set position relative if not already positioned
                    if (comp.position === 'static') {
                        current.style.setProperty('position', 'relative', 'important');
                    }
                } catch (e) {}
                current = current.parentElement;
                depth++;
            }
        } catch (e) {}
    }

    // ============================================================================
    // END MUTATION OBSERVER
    // ============================================================================

    const STORAGE_KEY = "geizhals_darkmode_settings";
    const COLORS_STORAGE_KEY = "geizhals_color_customizations";
    const STYLE_ID = "geizhals-darkmode-style";

    const DEFAULT_SETTINGS = {
        enabled: true,
        invertAmount: 95
    };

    const COLOR_VARIABLES = {
        "--bs-body-bg-rgb": "255, 255, 255",
        "--bs-body-color-rgb": "33, 37, 41",
        "--bs-border-color-translucent": "rgba(0, 0, 0, 0.175)",
        "--bs-orange": "#fd7e14",
        "--bs-success": "#198754",
        "--bs-code-color": "#d63384",
        "--bs-primary": "#0d6efd",
        "--bs-cyan": "#0dcaf0",
        "--bs-green": "#198754",
        "--bs-purple": "#6f42c1",
        "--bs-pink": "#d63384",
        "--bs-gray-100": "#f8f9fa",
        "--bs-white": "#4d4d4d",
        "--bs-danger": "#dc3545",
        "--bs-gray-600": "#6c757d",
        "--bs-dark": "#212529",
        "--bs-gray-500": "#adb5bd",
        "--bs-teal": "#20c997",
        "--bs-indigo": "#6610f2",
        "--bs-warning": "#ffc107",
        "--bs-blue": "#0d6efd",
        "--bs-yellow": "#ffc107",
        "--bs-info": "#46b9af",
        "--bs-border-color": "#a3a3a3",
        "--bs-gray": "#6c757d",
        "--bs-secondary": "#6c757d",
        "--bs-gray-200": "#e9ecef",
        "--bs-gray-800": "#343a40",
        "--bs-gray-700": "#495057",
        "--bs-secondary-bg": "#e9ecef",
        "--bs-gray-dark": "#343a40",
        "--bs-red": "#dc3545",
        "--bs-gray-900": "#212529",
        "--bs-form-valid-color": "#198754",
        "--bs-highlight-color": "#212529",
        "--bs-gray-300": "#dee2e6",
        "--bs-light": "#f8f9fa",
        "--bs-body-bg": "#dedede",
        "--bs-body-color": "#212529",
        "--bs-tertiary-bg": "#f8f9fa",
        "--bs-black": "#000000",
        "--bs-light-border-subtle": "#e9ecef",
        "--bs-link-color": "#0d6efd",
        "--bs-form-valid-border-color": "#198754",
        "--bs-form-invalid-color": "#dc3545",
        "--bs-form-invalid-border-color": "#dc3545",
        "--bs-gray-400": "#aaadb1",
        "--bs-emphasis-color-rgb": "0, 0, 0",
        "--bs-emphasis-color": "#000000",
        "--bs-heading-color": "#212529",
        "--bs-info-bg-subtle": "#daf1ef",
        "--bs-link-color-rgb": "13, 110, 253",
        "--bs-link-hover-color-rgb": "10, 88, 202",
        "--bs-secondary-bg-rgb": "233, 236, 239",
        "--bs-secondary-color-rgb": "33, 37, 41",
        "--bs-tertiary-bg-rgb": "248, 249, 250",
        "--bs-tertiary-color-rgb": "33, 37, 41",
        "--cws-custom-highlight-bg": "#EF0FFF",
        "--cws-custom-highlight-txt": "#FFFFFF",
        "--bs-navbar-brand-color": "#ffffff",
        "--bs-warning-bg-subtle": "rgb(255, 242.6, 205.4)",
        "--bs-danger-text-emphasis": "rgb(88, 21.2, 27.6)",
        "--bs-info-text-emphasis": "#1c4a46",
        "--bs-light-bg-subtle": "rgb(251.5, 252, 252.5)",
        "--bs-primary-border-subtle": "rgb(158.2, 197, 254.2)",
        "--bs-link-hover-color": "rgb(10.4, 88, 202.4)",
        "--bs-dark-text-emphasis": "#495057",
        "--bs-primary-text-emphasis": "rgb(5.2, 44, 101.2)",
        "--bs-primary-bg-subtle": "rgb(120, 139, 232)",
        "--bs-success-text-emphasis": "rgb(10, 54, 33.6)",
        "--bs-success-bg-subtle": "rgb(209, 231, 220.8)",
        "--bs-secondary-bg-subtle": "rgb(137, 155, 179)",
        "--bs-table-hover-color": "#000000",
        "--bs-table-active-bg": "rgba(0, 0, 0, 0.1)",
        "--bs-table-color-type": "#000000",
        "--bs-table-bg-type": "rgba(0, 0, 0, 0.05)",
        "--bs-table-striped-bg": "rgba(0, 0, 0, 0.05)",
        "--bs-info-border-subtle": "#b5e3df",
        "--bs-success-border-subtle": "rgb(163, 207, 186.6)",
        "--bs-secondary-text-emphasis": "rgb(43.2, 46.8, 50)",
        "--bs-focus-ring-color": "rgba(13, 110, 253, 0.25)",
        "--bs-warning-border-subtle": "rgb(255, 230.2, 155.8)",
        "--bs-table-striped-color": "#000000",
        "--bs-table-color": "#000000",
        "--bs-table-active-color": "#000000",
        "--bs-table-border-color": "#dee2e6",
        "--bs-tertiary-color": "rgba(33, 37, 41, 0.5)",
        "--bs-warning-text-emphasis": "rgb(102, 77.2, 2.8)",
        "--bs-dark-bg-subtle": "#ced4da",
        "--bs-danger-bg-subtle": "rgb(248, 214.6, 217.8)",
        "--bs-danger-border-subtle": "rgb(241, 174.2, 180.6)",
        "--bs-table-hover-bg": "rgba(0, 0, 0, 0.125)",
        "--bs-highlight-bg": "rgb(255, 242.6, 205.4)",
        "--bs-secondary-border-subtle": "rgb(196.2, 199.8, 203)",
        "--bs-dark-border-subtle": "#adb5bd",
        "--bs-table-bg": "#b3b2b2",
        "--bs-carousel-caption-color": "#ffffff",
        "--bs-carousel-indicator-active-bg": "#ffffff",
        "--bs-emphasis-color": "#000000",
        "--bs-secondary-color": "rgba(33, 37, 41, 0.75)",
        "--bs-light-text-emphasis": "#495057",
        "--section-color": "#577294",
        "--section-background": "#e8ecf0",
        "--background-even": "#b3b3b3",
        "--background-odd": "#b4bac0"
    };

    function getSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (e) {
        }
        return DEFAULT_SETTINGS;
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            applySettings(settings);
            return true;
        } catch (e) {
            return false;
        }
    }

    function getColorCustomizations() {
        try {
            const stored = localStorage.getItem(COLORS_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
        }
        return {};
    }

    function saveColorCustomization(varName, hexValue) {
        try {
            const customizations = getColorCustomizations();
            customizations[varName] = hexValue;
            localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(customizations));
            applyColorVariable(varName, hexValue);
            return true;
        } catch (e) {
            return false;
        }
    }

    function resetColorCustomization(varName) {
        try {
            const customizations = getColorCustomizations();
            delete customizations[varName];
            localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(customizations));
            const originalValue = COLOR_VARIABLES[varName];
            applyColorVariable(varName, originalValue);
            return true;
        } catch (e) {
            return false;
        }
    }

    function exportSettings() {
        try {
            const settings = getSettings();
            const colors = getColorCustomizations();
            const exportData = {
                settings: settings,
                colors: colors,
                exportDate: new Date().toISOString()
            };
            return JSON.stringify(exportData, null, 2);
        } catch (e) {
            console.error("Error exporting settings:", e);
            return null;
        }
    }

    function importSettings(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            if (importData.settings) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.settings));
            }
            if (importData.colors) {
                localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(importData.colors));
            }
            location.reload();
            return true;
        } catch (e) {
            alert("Fehler beim Importieren der Einstellungen. Bitte prüfen Sie das Format.");
            return false;
        }
    }

    function resetAllSettings() {
        if (confirm("Alle Einstellungen und Farben zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(COLORS_STORAGE_KEY);
                location.reload();
            } catch (e) {
                alert("Fehler beim Zurücksetzen der Einstellungen.");
            }
        }
    }

    // ============================================================================
    // COLOR UTILITIES
    // ============================================================================

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    function normalizeHex(hex) {
        if (!hex.startsWith("#")) return hex;
        if (hex.length === 7) return hex;
        if (hex.length === 4) {
            return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        return hex;
    }

    function parseColorValue(value) {
        value = value.trim();
        if (value.startsWith("#")) {
            return normalizeHex(value);
        }
        if (value.startsWith("rgb")) {
            const matches = value.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return rgbToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]));
            }
        }
        return "#000000";
    }

    function applyColorVariable(varName, hexValue) {
        // Setze auf root element
        document.documentElement.style.setProperty(varName, hexValue);

        // Setze auch auf alle Shadow DOM Host-Elemente
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.shadowRoot) {
                el.style.setProperty(varName, hexValue);
            }
        });

        // Spezial-Handling für --background-even und --background-odd
        if (varName === '--background-even' || varName === '--background-odd') {
            const templateRows = document.querySelectorAll('.template-rows > div');
            let evenColor = document.documentElement.style.getPropertyValue('--background-even').trim() || '#f0f3f6';
            let oddColor = document.documentElement.style.getPropertyValue('--background-odd').trim() || '#e8ecf0';

            if (varName === '--background-even') {
                evenColor = hexValue;
            } else {
                oddColor = hexValue;
            }

            templateRows.forEach((el, index) => {
                const bgColor = index % 2 === 0 ? evenColor : oddColor;
                const style = (el.getAttribute('style') || '').replace(/background-color[^;]*/g, '');
                el.setAttribute('style', style + `; background-color: ${bgColor} !important;`);
            });
        }

        // Spezial-Handling für --section-color: berechne abhängige Variablen neu
        if (varName === '--section-color') {
            // Entferne alten Override-Style
            const oldOverride = document.getElementById('geizhals-section-overrides');
            if (oldOverride) oldOverride.remove();

            // Berechne color-mix Werte
            const bgSubtle = `color-mix(in oklab, 40% ${hexValue}, white)`;
            const bgEven = `color-mix(in oklab, 20% ${bgSubtle}, white)`;

            // Erstelle neuen Override mit neuberechneten Werten
            const overrideStyle = document.createElement('style');
            overrideStyle.id = 'geizhals-section-overrides';
            overrideStyle.textContent = `
                .section {
                    --section-color: ${hexValue} !important;
                    --section-background: ${bgSubtle} !important;
                }
                .template-rows {
                    --background-even: ${bgEven} !important;
                    --background-odd: ${bgSubtle} !important;
                }
                .template-rows > div:nth-child(4n+1) {
                    background-color: ${bgEven} !important;
                }
                .template-rows > div:nth-child(4n+3) {
                    background-color: ${bgSubtle} !important;
                }
            `;
            document.head.appendChild(overrideStyle);
        }
    }

    // ============================================================================
    // SETTINGS APPLICATION WITH CSS
    // ============================================================================

    function generateCSS(settings) {
        if (!settings.enabled) {
            return `
                * {
                    filter: none !important;
                    -webkit-filter: none !important;
                }
                html, body {
                    background-color: inherit !important;
                    color: inherit !important;
                }
                input[type="text"],
                input[type="url"],
                input[type="search"],
                input[type="email"],
                input[type="number"],
                textarea,
                select,
                .form-control,
                .form-select {
                  background-color: #ffffff !important;
                  color: #000000 !important;
                  border-color: #dee2e6 !important;
                }
            `;
        }

        const invertAmount = settings.invertAmount !== undefined ? settings.invertAmount : 100;
        const filterValue = `invert(${invertAmount}%) hue-rotate(180deg)`;

        return `
/* Leading rule */
html {
  -webkit-filter: ${filterValue} !important;
  filter: ${filterValue} !important;
}

/* Reverse rule */
img,
video,
:not(object):not(body)>embed,
object,
svg image,
[style*="background:url"],
[style*="background-image:url"],
[style*="background: url"],
[style*="background-image: url"],
[background],
twitterwidget,
.sr-reader,
.sr-backdrop,
iframe:fullscreen,
[class="opinary-iframe"] {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

[style*="background:url"] *,
[style*="background-image:url"] *,
[style*="background: url"] *,
[style*="background-image: url"] *,
[background] *,
img[src^="https://s0.wp.com/latex.php"],
img.Wirisformula,
twitterwidget .NaturalImage-image {
  -webkit-filter: none !important;
  filter: none !important;
}

/* Text contrast */
html {
  text-shadow: 0 0 0 !important;
}

/* Full screen */
:-webkit-full-screen, :-webkit-full-screen * {
  -webkit-filter: none !important;
  filter: none !important;
}
:-moz-full-screen, :-moz-full-screen * {
  -webkit-filter: none !important;
  filter: none !important;
}
:fullscreen, :fullscreen * {
  -webkit-filter: none !important;
  filter: none !important;
}

/* Page background */
html {
  background: rgb(255,255,255) !important;
}

/* Input field styling for dark mode readability */
input[type="text"],
input[type="url"],
input[type="search"],
input[type="email"],
input[type="number"],
textarea,
select,
.form-control {
  background-color: #3a3a3a !important;
  color: #e8e6e3 !important;
  border-color: #555 !important;
}

input[type="text"]::placeholder,
input[type="url"]::placeholder,
input[type="search"]::placeholder,
input[type="email"]::placeholder,
input[type="number"]::placeholder,
textarea::placeholder {
  color: #888 !important;
  opacity: 1 !important;
}

input[type="text"]:focus,
input[type="url"]:focus,
input[type="search"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus,
.form-control:focus {
  background-color: #4a4a4a !important;
  color: #e8e6e3 !important;
  border-color: #4a9eff !important;
  box-shadow: 0 0 0 0.2rem rgba(74, 158, 255, 0.25) !important;
}

/* React Select specific styling */
.css-1d5uema input,
.css-1d5uema {
  background-color: #3a3a3a !important;
  color: #e8e6e3 !important;
}

.css-1d5uema input::placeholder {
  color: #888 !important;
}

.css-13a0z1d-control,
.css-1cfhtl4-control,
.css-b62m3t-container {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

.css-8akrpk {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

.css-13a0z1d-control input,
.css-1cfhtl4-control input {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
  background-color: transparent !important;
}

.css-kmdooj-singleValue {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

.css-1u9des2-indicatorSeparator {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

/* Select dropdown styling - EXPLIZITE FARBEN */
.css-26l3qy-menu,
.css-1nmdiq5-menu,
[class*="css-"][class*="menu"] {
  background-color: #2a2a2a !important;
  color: #e8e6e3 !important;
  z-index: 9999999 !important;
  display: block !important;
  overflow: auto !important;
  min-height: 50px !important;
  padding: 0px !important;
  filter: none !important;
}

.css-1nmdiq5-option,
[class*="css-"][class*="option"],
[role="option"] {
  background-color: #2a2a2a !important;
  color: #e8e6e3 !important;
  z-index: 9999999 !important;
  display: block !important;
  min-height: 32px !important;
  padding: 8px 12px !important;
  filter: none !important;
  opacity: 1 !important;
}

.css-1nmdiq5-option:hover,
[class*="css-"][class*="option"]:hover,
[role="option"]:hover {
  background-color: #3a3a3a !important;
  color: #ffffff !important;
  filter: none !important;
}

.css-1nmdiq5-option--is-selected,
[class*="css-"][class*="option--is-selected"],
[role="option"][aria-selected="true"] {
  background-color: #1a4d7a !important;
  color: #ffffff !important;
  filter: none !important;
}

/* Textarea specific */
textarea {
  background-color: #3a3a3a !important;
  color: #e8e6e3 !important;
  border-color: #555 !important;
}

textarea:focus {
  background-color: #4a4a4a !important;
  border-color: #4a9eff !important;
}

/* Label text for forms */
label,
.form-label,
.form-text {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
  color: #FEFEFE !important;
}

.form-label {
  color: #FEFEFE !important;
}

/* Disabled input styling */
input:disabled,
textarea:disabled,
select:disabled,
.form-control:disabled {
  background-color: #2a2a2a !important;
  color: #888 !important;
  opacity: 0.6 !important;
}

/* Input fields with inverse filter to show native styling */
input[type="text"],
input[type="url"],
input[type="search"],
input[type="email"],
input[type="number"],
textarea,
select,
.form-control,
.form-select,
.input-numeric {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

/* Protect ghodmode modal from theme */
.ghodmode-modal-body {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

.ghodmode-modal-body img,
.ghodmode-modal-body video,
.ghodmode-modal-body svg,
.ghodmode-modal-body [style*="background:url"],
.ghodmode-modal-body [style*="background-image:url"],
.ghodmode-modal-body [style*="background: url"],
.ghodmode-modal-body [style*="background-image: url"],
.ghodmode-modal-body [background] {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

/* Protect theme options menu */
#geizhals-darkmode-options-menu {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}

#geizhals-darkmode-options-menu * {
  -webkit-filter: none !important;
  filter: none !important;
}

/* Protect pane container */
.pane.primary.ps-2,
.pane.primary.ps-2 * {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
}


/* MAXIMUM z-index hierarchy for React-Select */
[class*="css-"][class*="menu"] {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
  z-index: 999999999 !important;
  position: absolute !important;
  pointer-events: auto !important;
}

[class*="css-"][class*="option"] {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
  z-index: 999999999 !important;
}

[class*="css-"][role="listbox"],
[class*="css-"][role="menu"] {
  -webkit-filter: invert(100%) hue-rotate(180deg) !important;
  filter: invert(100%) hue-rotate(180deg) !important;
  z-index: 999999999 !important;
  position: absolute !important;
  pointer-events: auto !important;
}

[class*="css-"][style*="position"] {
  z-index: 999999999 !important;
  pointer-events: auto !important;
}


/* Force high z-index for ALL css-module containers */
[class*="css-"] {
  z-index: auto !important;
}

[class*="css-"][class*="menu"],
[class*="css-"][class*="dropdown"],
[role="listbox"],
[role="menu"] {
  z-index: 9999999999 !important;
  /* position NICHT setzen */
}

/* Input fields und Controls mit NIEDRIGER z-index */
.css-1cfhtl4-control,
.css-13a0z1d-control,
.css-b62m3t-container,
[class*="css-"][class*="control"] {
  z-index: auto !important;
}

/* Suppress all other page elements z-index */
input[type="text"],
input[type="number"],
textarea,
select,
.form-control {
  z-index: auto !important;
}

/* Section/Page containers: lower z-index */
.section,
.pane,
.content,
main {
  z-index: auto !important;
}
        `;
    }

    function applySettings(settings) {
        let styleEl = document.getElementById(STYLE_ID);

        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = STYLE_ID;
            styleEl.type = "text/css";
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = generateCSS(settings);
    }

    // ============================================================================
    // OPTIONS MENU CREATION
    // ============================================================================

    function createOptionsMenu() {
        if (document.getElementById("geizhals-darkmode-options-menu")) {
            return;
        }

        const settings = getSettings();
        const customizations = getColorCustomizations();
        const menu = document.createElement("div");
        menu.id = "geizhals-darkmode-options-menu";

        let colorPickersHTML = '<div class="color-pickers-section">';

        Object.entries(COLOR_VARIABLES).forEach(([varName, defaultValue]) => {
            const currentValue = customizations[varName] || parseColorValue(defaultValue);
            const rgb = hexToRgb(currentValue) || {r: 0, g: 0, b: 0};

            colorPickersHTML += `
                <div class="color-picker-group">
                    <label class="color-label">${varName}</label>
                    <div class="color-picker-controls">
                        <input type="color" class="color-input" data-var="${varName}" value="${currentValue}">
                        <input type="text" class="rgb-input" data-var="${varName}" placeholder="R,G,B" value="${rgb.r},${rgb.g},${rgb.b}">
                        <button class="reset-btn" data-var="${varName}">↻</button>
                    </div>
                </div>
            `;
        });

        colorPickersHTML += '</div>';

        const menuHTML = `
            <h2>Dark Mode Optionen</h2>

            <div class="setting-group">
                <label class="toggle-label">
                    <span class="toggle-label-text">${settings.enabled ? "Dark Theme" : "Light Theme"}</span>
                    <input type="checkbox" id="darkmode-toggle" class="toggle-checkbox" ${settings.enabled ? "checked" : ""}>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <div class="setting-group">
                <label for="invert-slider" style="display: flex; gap: 10px; align-items: center;">
                    <span>Invert-Betrag:</span>
                    <input type="range" id="invert-slider" min="0" max="100" value="${settings.invertAmount !== undefined ? settings.invertAmount : 100}" style="flex: 1; cursor: pointer;">
                    <span id="invert-value-display" style="min-width: 35px; text-align: right;">${settings.invertAmount !== undefined ? settings.invertAmount : 100}%</span>
                </label>
            </div>

            <div class="setting-group">
                <button id="darkmode-reset-all-btn" style="width: 100%; padding: 8px 12px; background-color: #dc3545; border-color: #dc3545; color: white;">Einstellungen zurücksetzen</button>
            </div>

            <div class="export-import-section">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="darkmode-export-btn" class="primary" style="flex: 1;">Exportieren</button>
                    <button id="darkmode-import-btn" class="primary" style="flex: 1;">Importieren</button>
                </div>
                <input type="file" id="darkmode-import-file" accept=".json" style="display: none;">
            </div>

            <div class="colors-divider">Farben anpassen</div>

            <div class="filter-section">
                <input type="text" id="color-filter-input" placeholder="Farben filtern (z.B. 'btn', 'table', 'bs-gray')..." class="color-filter-input">
            </div>

            ${colorPickersHTML}

            <div class="buttons">
                <button class="primary" id="darkmode-save-btn">Speichern</button>
                <button id="darkmode-close-btn">Schließen</button>
            </div>
        `;

        menu.innerHTML = menuHTML;

        const overlay = document.createElement("div");
        overlay.id = "geizhals-darkmode-options-overlay";
        overlay.style.backdropFilter = "none";
        overlay.style.backgroundColor = "transparent";

        document.body.appendChild(overlay);
        document.body.appendChild(menu);

        // Dark Mode Toggle
        document.getElementById("darkmode-toggle").addEventListener("change", (e) => {
            settings.enabled = e.target.checked;
            document.querySelector(".toggle-label-text").textContent = settings.enabled ? "Dark Theme" : "Light Theme";
            saveSettings(settings);
        });

        // Invert Amount Slider
        const invertSlider = document.getElementById("invert-slider");
        if (invertSlider) {
            invertSlider.addEventListener("input", (e) => {
                const newValue = parseInt(e.target.value);
                settings.invertAmount = newValue;
                document.getElementById("invert-value-display").textContent = newValue + "%";
                applySettings(settings);
            });
        }

        // Reset All Settings Button
        document.getElementById("darkmode-reset-all-btn").addEventListener("click", () => {
            resetAllSettings();
        });

        // Export Button
        document.getElementById("darkmode-export-btn").addEventListener("click", () => {
            const exportData = exportSettings();
            if (exportData) {
                const blob = new Blob([exportData], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `geizhals-darkmode-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });

        // Import Button
        document.getElementById("darkmode-import-btn").addEventListener("click", () => {
            document.getElementById("darkmode-import-file").click();
        });

        // Import File Input
        document.getElementById("darkmode-import-file").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    importSettings(event.target.result);
                };
                reader.readAsText(file);
            }
        });

        // Color Filter Input
        const filterInput = document.getElementById("color-filter-input");
        if (filterInput) {
            filterInput.addEventListener("input", (e) => {
                const filterText = e.target.value.toLowerCase();
                const pickerGroups = document.querySelectorAll(".color-picker-group");

                pickerGroups.forEach(group => {
                    const label = group.querySelector(".color-label");
                    const varName = label ? label.textContent.toLowerCase() : "";

                    if (filterText === "" || varName.includes(filterText)) {
                        group.style.display = "flex";
                    } else {
                        group.style.display = "none";
                    }
                });
            });
        }

        // Color Pickers
        document.querySelectorAll(".color-input").forEach(input => {
            input.addEventListener("input", (e) => {
                const varName = e.target.dataset.var;
                const hexValue = e.target.value;
                const rgb = hexToRgb(hexValue);

                // Update RGB field
                const rgbInput = document.querySelector(`.rgb-input[data-var="${varName}"]`);
                if (rgbInput) {
                    rgbInput.value = `${rgb.r},${rgb.g},${rgb.b}`;
                }

                saveColorCustomization(varName, hexValue);
            });
        });

        // RGB Inputs
        document.querySelectorAll(".rgb-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const varName = e.target.dataset.var;
                const values = e.target.value.split(",").map(v => parseInt(v.trim()));

                if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
                    const hexValue = rgbToHex(values[0], values[1], values[2]);

                    // Update color picker
                    const colorInput = document.querySelector(`.color-input[data-var="${varName}"]`);
                    if (colorInput) {
                        colorInput.value = hexValue;
                    }

                    saveColorCustomization(varName, hexValue);
                } else {
                    alert("Bitte geben Sie RGB-Werte zwischen 0-255 ein (z.B. '255,128,0')");
                }
            });
        });

        // Reset Buttons
        document.querySelectorAll(".reset-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const varName = e.target.dataset.var;
                const defaultValue = COLOR_VARIABLES[varName];
                const hexValue = parseColorValue(defaultValue);
                const rgb = hexToRgb(hexValue);

                // Update color picker
                document.querySelector(`.color-input[data-var="${varName}"]`).value = hexValue;

                // Update RGB input only if valid
                if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
                    document.querySelector(`.rgb-input[data-var="${varName}"]`).value = `${rgb.r},${rgb.g},${rgb.b}`;
                } else {
                    document.querySelector(`.rgb-input[data-var="${varName}"]`).value = defaultValue;
                }

                resetColorCustomization(varName);
            });
        });

        // Save Button
        document.getElementById("darkmode-save-btn").addEventListener("click", () => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) {
            }
            menu.remove();
            overlay.remove();
        });

        // Close Button
        document.getElementById("darkmode-close-btn").addEventListener("click", () => {
            menu.remove();
            overlay.remove();
        });

        // Overlay Click to Close
        overlay.addEventListener("click", () => {
            menu.remove();
            overlay.remove();
        });
    }

    // ============================================================================
    // DEBUG CSS VARIABLES
    // ============================================================================

    // ============================================================================
    // DARK MODE BUTTON INJECTION
    // ============================================================================

    function calculateButtonPosition() {
        let rightPosition = 240;
        const cloneInfo = document.getElementById("geizhals-clone-info");

        if (cloneInfo) {
            const cloneWidth = cloneInfo.offsetWidth || 0;
            rightPosition = 240 + cloneWidth + 5;
        }

        return rightPosition;
    }

    function updateButtonPosition() {
        const button = document.getElementById("geizhals-darkmode-button");
        if (button) {
            const rightPos = calculateButtonPosition();
            button.style.right = rightPos + "px";
        }
    }

    function injectDarkModeButton() {
        const tryInject = () => {
            if (document.getElementById("geizhals-darkmode-button")) {
                return;
            }

            const darkModeButton = document.createElement("button");
            darkModeButton.id = "geizhals-darkmode-button";
            darkModeButton.type = "button";
            darkModeButton.title = "Dark Mode Einstellungen";
            const rightPos = calculateButtonPosition();
            darkModeButton.style.cssText = `position: fixed; top: 0.5rem; right: ${rightPos}px; display: flex; align-items: center; padding: 0.21rem 0.6rem; z-index: 999999; background-color: #f8f9fa; color: #212529; border: 1px solid #dee2e6; border-radius: 4px; cursor: pointer; font-size: 0.875rem; font-weight: 500; opacity: 1; visibility: visible; height: 1.5rem;`;
            darkModeButton.textContent = "Theme";

            darkModeButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                createOptionsMenu();
            });

            document.body.appendChild(darkModeButton);
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", tryInject);
        } else {
            tryInject();
        }

        setTimeout(tryInject, 1000);

        // Beobachte ob geizhals-clone-info Element auftaucht und passe Position an
        const observer = new MutationObserver(() => {
            updateButtonPosition();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });

        // Zusätzliche Prüfung nach 500ms
        setTimeout(() => {
            updateButtonPosition();
        }, 500);
    }

    // ============================================================================
    // MENU STYLES INJECTION
    // ============================================================================

    function injectMenuStyles() {
        const styleId = "geizhals-darkmode-menu-style";

        if (document.getElementById(styleId)) {
            return;
        }

        const css = `
            #geizhals-darkmode-options-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #2a2a2a;
                border: 2px solid #444;
                border-radius: 8px;
                padding: 20px;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                max-width: 600px;
                max-height: 85vh;
                overflow-y: auto;
                color: #e8e6e3;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.5;
                filter: none !important;
                -webkit-filter: none !important;
            }

            #geizhals-darkmode-options-menu h2 {
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 20px;
                border-bottom: 1px solid #444;
                padding-bottom: 10px;
            }

            #geizhals-darkmode-options-menu .setting-group {
                margin-bottom: 15px;
            }

            #geizhals-darkmode-options-menu .export-import-section {
                margin-bottom: 15px;
                padding: 12px;
                background-color: #333;
                border-radius: 4px;
            }

            #geizhals-darkmode-options-menu input[type="range"] {
                accent-color: #4a9eff;
                height: 6px;
                border-radius: 3px;
            }

            #geizhals-darkmode-options-menu input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4a9eff;
                cursor: pointer;
                border: 2px solid #333;
            }

            #geizhals-darkmode-options-menu input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4a9eff;
                cursor: pointer;
                border: 2px solid #333;
            }

            #geizhals-darkmode-options-menu label {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-weight: 500;
            }

            #geizhals-darkmode-options-menu input[type="checkbox"] {
                display: none;
            }

            #geizhals-darkmode-options-menu .toggle-label {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                font-weight: 500;
            }

            #geizhals-darkmode-options-menu .toggle-label-text {
                min-width: 100px;
                color: #e8e6e3;
            }

            #geizhals-darkmode-options-menu .toggle-checkbox {
                display: none;
            }

            #geizhals-darkmode-options-menu .toggle-slider {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
                background-color: #555;
                border-radius: 13px;
                transition: background-color 0.3s;
                cursor: pointer;
            }

            #geizhals-darkmode-options-menu .toggle-slider::before {
                content: '';
                position: absolute;
                height: 22px;
                width: 22px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: transform 0.3s;
            }

            #geizhals-darkmode-options-menu .toggle-checkbox:checked + .toggle-slider {
                background-color: #4a9eff;
            }

            #geizhals-darkmode-options-menu .toggle-checkbox:checked + .toggle-slider::before {
                transform: translateX(24px);
            }

            #geizhals-darkmode-options-menu .colors-divider {
                margin-top: 20px;
                margin-bottom: 15px;
                font-size: 14px;
                font-weight: 600;
                color: #4a9eff;
                border-bottom: 1px solid #444;
                padding-bottom: 8px;
            }

            #geizhals-darkmode-options-menu .filter-section {
                margin-bottom: 15px;
            }

            #geizhals-darkmode-options-menu .color-filter-input {
                width: 100%;
                background-color: #3a3a3a;
                color: #e8e6e3;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 13px;
                box-sizing: border-box;
            }

            #geizhals-darkmode-options-menu .color-filter-input:focus {
                border-color: #4a9eff;
                outline: none;
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }

            #geizhals-darkmode-options-menu .color-filter-input::placeholder {
                color: #777;
            }

            #geizhals-darkmode-options-menu .color-pickers-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                margin-bottom: 20px;
                max-height: 400px;
                overflow-y: auto;
            }

            #geizhals-darkmode-options-menu .color-picker-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                background-color: #333;
                padding: 10px;
                border-radius: 4px;
            }

            #geizhals-darkmode-options-menu .color-label {
                font-size: 12px;
                color: #aaa;
                font-weight: 500;
                margin: 0;
            }

            #geizhals-darkmode-options-menu .color-picker-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            #geizhals-darkmode-options-menu .color-input {
                width: 50px;
                height: 32px;
                border: 1px solid #555;
                border-radius: 4px;
                cursor: pointer;
            }

            #geizhals-darkmode-options-menu .rgb-input {
                flex: 1;
                background-color: #3a3a3a;
                color: #e8e6e3;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
            }

            #geizhals-darkmode-options-menu .rgb-input:focus {
                border-color: #4a9eff;
                outline: none;
            }

            #geizhals-darkmode-options-menu .reset-btn {
                width: 32px;
                height: 32px;
                padding: 0;
                background-color: #444;
                color: #e8e6e3;
                border: 1px solid #555;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
            }

            #geizhals-darkmode-options-menu .reset-btn:hover {
                background-color: #555;
                border-color: #666;
            }

            #geizhals-darkmode-options-menu .buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                border-top: 1px solid #444;
                padding-top: 15px;
                flex-wrap: wrap;
            }

            #geizhals-darkmode-options-menu button {
                flex: 0 1 auto;
                padding: 8px 16px;
                border: 1px solid #444;
                border-radius: 4px;
                background-color: #333;
                color: #e8e6e3;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s;
                min-width: 100px;
            }

            #geizhals-darkmode-options-menu button:hover {
                background-color: #444;
                border-color: #555;
            }

            #geizhals-darkmode-options-menu button.primary {
                background-color: #4a9eff;
                border-color: #4a9eff;
                color: white;
            }

            #geizhals-darkmode-options-menu button.primary:hover {
                background-color: #357abd;
                border-color: #357abd;
            }

            #geizhals-darkmode-options-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: transparent;
                z-index: 999998;
                filter: none !important;
                -webkit-filter: none !important;
            }

            #geizhals-darkmode-button {
                filter: none !important;
                -webkit-filter: none !important;
                background-color: #f8f9fa !important;
                color: #212529 !important;
                border: 1px solid #dee2e6 !important;
                opacity: 1 !important;
                visibility: visible !important;
                display: flex !important;
            }

            #geizhals-darkmode-button:hover {
                background-color: #e9ecef !important;
                border-color: #adb5bd !important;
            }

            #geizhals-darkmode-button * {
                filter: none !important;
                -webkit-filter: none !important;
            }

            .changed__field {
                overflow: visible !important;
                z-index: auto !important;
            }

            [class*="css-"][class*="control"],
            [class*="css-"][class*="menu"],
            [class*="css-"][class*="option"],
            [class*="css-"][class*="container"] {
                z-index: auto !important;
            }

            [data-custom-dropdown-protected="true"],
            [data-react-select-protected="true"] {
                z-index: 999999999 !important;
            }
        `;

        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // ============================================================================
    // INIT
    // ============================================================================

    function init() {
        // Inject menu styles
        injectMenuStyles();

        // Load and apply settings
        const settings = getSettings();
        applySettings(settings);

        // Apply all COLOR_VARIABLES (customizations override defaults)
        const customizations = getColorCustomizations();
        Object.entries(COLOR_VARIABLES).forEach(([varName, defaultValue]) => {
            const hexValue = customizations[varName] || parseColorValue(defaultValue);
            applyColorVariable(varName, hexValue);
        });

        // Inject Dark Mode button
        injectDarkModeButton();

        // Breite Selektoren für alle CSS-Module Menus
        // React-Select generiert dynamische Klassennamen, daher nutzen wir breite Matcher

                // Observer für dynamische React-Select Elemente
        const observerOptions = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // React-Select Controls
                            const controls = node.querySelectorAll ? node.querySelectorAll('.css-1cfhtl4-control, .css-13a0z1d-control, .css-b62m3t-container') : [];
                            if (node.classList && (node.classList.contains('css-1cfhtl4-control') || node.classList.contains('css-13a0z1d-control') || node.classList.contains('css-b62m3t-container'))) {
                                applyReactSelectProtection(node);
                            }
                            controls.forEach(el => applyReactSelectProtection(el));

                            // Dropdown-Menüs (React-Select)
                            const menus = node.querySelectorAll ? node.querySelectorAll('.css-26l3qy-menu, .css-1nmdiq5-menu') : [];
                            if (node.classList && (node.classList.contains('css-26l3qy-menu') || node.classList.contains('css-1nmdiq5-menu'))) {
                                applyDropdownProtection(node);
                            }
                            menus.forEach(el => applyDropdownProtection(el));

                            // Alle CSS-Module Elemente schützen (aggressiv)
                            try {
                                if (node.className && node.className.includes('css-') && node.className.includes('menu')) {
                                    applyCustomDropdownProtection(node);
                                }
                                const allCssMenus = node.querySelectorAll ? node.querySelectorAll('[class*="css-"][class*="menu"]') : [];
                                allCssMenus.forEach(el => applyCustomDropdownProtection(el));
                            } catch (e) {}
                        }
                    });
                }
            });
        });

        observer.observe(document.body, observerOptions);

        // Start global dropdown observer
        watchDropdownForOptions(document.body);

        function applyReactSelectProtection(el) {
            if (!el.dataset.reactSelectProtected) {
                el.style.setProperty('filter', 'invert(100%) hue-rotate(180deg)', 'important');
                el.style.setProperty('-webkit-filter', 'invert(100%) hue-rotate(180deg)', 'important');
                el.dataset.reactSelectProtected = 'true';
            }

            // Auch Dropdown-Menüs schützen
            const menus = el.querySelectorAll ? el.querySelectorAll('.css-26l3qy-menu, .css-1nmdiq5-menu') : [];
            menus.forEach(menu => applyDropdownProtection(menu));
        }

        function applyDropdownProtection(menu) {
            if (!menu.dataset.reactSelectProtected) {
                styleDropdown(menu);
                watchDropdownForOptions(menu);

                // Stylen alle existierenden Options sofort
                const existingOptions = menu.querySelectorAll('[class*="option"], [role="option"]');
                existingOptions.forEach(opt => applyOptionStyle(opt));

                menu.dataset.reactSelectProtected = 'true';
            }
        }



        function applyCustomDropdownProtection(el) {
            if (!el.dataset.customDropdownProtected) {
                styleDropdown(el);
                watchDropdownForOptions(el);

                // Stylen alle existierenden Options sofort
                const existingOptions = el.querySelectorAll('[class*="option"], [role="option"]');
                existingOptions.forEach(opt => applyOptionStyle(opt));

                el.dataset.customDropdownProtected = 'true';
            }
        }
        // Suche auch in Shadow DOM
        function findReactSelectElements() {
            const allElements = [];

            // Normale DOM
            allElements.push(...document.querySelectorAll('.css-1cfhtl4-control, .css-13a0z1d-control, .css-b62m3t-container'));

            // Shadow DOM durchsuchen
            const walkDom = (node) => {
                if (node.shadowRoot) {
                    allElements.push(...node.shadowRoot.querySelectorAll('.css-1cfhtl4-control, .css-13a0z1d-control, .css-b62m3t-container'));
                    node.shadowRoot.querySelectorAll('*').forEach(walkDom);
                }
                node.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) walkDom(el);
                });
            };

            walkDom(document.body);
            return allElements;
        }

        // Initial alle React-Select Elemente schützen
        findReactSelectElements().forEach(el => applyReactSelectProtection(el));

        // Initial alle CSS-Module schützen + kontinuierlicher Schutz
        function protectAllCssElements() {
            try {
                // Alle Elemente mit css-* Klassen die menu/dropdown-artig sind
                document.querySelectorAll('[class*="css-"]').forEach(el => {
                    if (el.className && (el.className.includes('menu') || el.className.includes('option') ||
                        el.classList.contains('css-uvrstl') || el.classList.contains('css-d7l1ni-option'))) {
                        applyCustomDropdownProtection(el);
                    }
                });
            } catch (e) {}
        }
        protectAllCssElements();

        // Kontinuierlicher Schutz mit setInterval
        const continuousProtectionInterval = setInterval(protectAllCssElements, 150);


        // Zusätzliche aggressive Protection mit requestAnimationFrame
        let lastProtectionTime = 0;
        let protectionRAF = null;

        function aggressiveRAFProtection() {
            const now = Date.now();
            if (now - lastProtectionTime > 100) {  // Nur alle 100ms ausführen
                try {
                    // Schütze ALLE neu hinzugefügten css-Elemente
                    const allCssElements = document.querySelectorAll('[class*="css-"]');
                    allCssElements.forEach(el => {
                        if (!el.dataset.cssProtected) {
                            // Aggressiver Parent-Schutz
                            if (el.parentElement) {
                                el.parentElement.style.setProperty('z-index', '999999999', 'important');
                            }
                            // Prüfe ob es ein Dropdown/Menu/Option Element ist
                            const classes = el.className || '';
                            if (classes.includes('menu') ||
                                classes.includes('option') ||
                                classes.includes('listbox') ||
                                el.getAttribute('role') === 'listbox' ||
                                el.getAttribute('role') === 'option') {
                                applyCustomDropdownProtection(el);
                                el.dataset.cssProtected = 'true';
                            }
                        }
                    });
                } catch (e) {}
                lastProtectionTime = now;
            }
            protectionRAF = requestAnimationFrame(aggressiveRAFProtection);
        }
        aggressiveRAFProtection();
    }

    // Start
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();