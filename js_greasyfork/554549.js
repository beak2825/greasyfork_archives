// ==UserScript==
// @name         Danbooru Note Formatting Helper
// @namespace    http://tampermonkey.net/
// @version      1.71.0
// @description  A formatting helper toolbar for Danbooru note editing dialogs, adding buttons to wrap highlighted text with HTML tags for easy formatting.
// @author       FunkyJustin
// @license      MIT
// @match        https://danbooru.donmai.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554549/Danbooru%20Note%20Formatting%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554549/Danbooru%20Note%20Formatting%20Helper.meta.js
// ==/UserScript==
/*
Update History:
- v1.71.0: Enabled vertical drag resizing on textarea (resize: vertical) with dedicated ResizeObserver to detect height changes and auto-expand dialog accordingly (smooth expansion without internal scroll or snap-back overrides); added taResizeObservers tracking for cleanup; total lines ~2480.
- v1.70.0: Fixed dialog shaking/snapping on open/resize by isolating autoResizeDialog to initial injection and content input events only (via manualResizeActive flag hooked to jQuery UI resizestart/resizestop); ResizeObserver now solely syncs textarea height without full dialog recalc during manual drags, preventing snap-back overrides; total lines ~2435.
- v1.69.0: Fixed textarea height not expanding beyond two lines by adding dynamic resizeTextarea on input events (auto-fit scrollHeight) and ResizeObserver on dialog for manual resize sync, ensuring content expands without internal scroll when typing or dragging dialog; enhanced autoResizeDialog to call resizeTextarea; total lines ~2415.
- v1.68.0: Fixed history modal close refusal after delete by closing current modal before refresh reopen; tuned typing debounce to 400ms (groups fast words/phrases into single undo steps like Word/WPS, allows single-char undo on pause >400ms, immediate save if insert ends with space/punct); total lines ~2365.
- v1.67.0: Improved undo/redo instantaneity like Word/WPS: immediate saveState on 'input' for insertText/deleteText (char-level typing/deletion steps, no debounce), debounced only for insertFromPaste/compositionstart/end (groups multi-char pastes); ensures instant single-keystroke undo/redo without lag while preserving grouped actions; total lines ~2350.
- v1.66.0: Enhanced undo/redo: pre-action snapshots before buttons (clean branching), state validation with native fallback, multi-tab sync on focus (rebuild if mismatch), dynamic debounce (150ms typing/500ms paste), UI feedback (titles/steps, disable bounds, save pulse), visual history modal (thumbnails/jump/last 10), lite branching (fork >5s idle, max 3, discard on new), per-note persistence (localStorage nfh_history_${noteId}, merge/load); total lines ~2310.
- v1.65.0: Enhanced undo/redo reliability, especially for new notes: synchronous initial blank snapshot (no debounce), reduced dialog injection delay to 100ms for faster setup before typing, added immediate (non-debounced) saveState calls after all modifying button actions (e.g., applyFormat, clearFormatting) while preserving debounced saves for typing/paste; ensures clean history branching and undo to empty on new notes; total lines ~2205.
- v1.64.0: Added "Gradient Outline" template button with parametric picker (font, size, gradient start/end colors/angle, optional outline toggle/color/width) and live preview; positioned beside other templates in Formatting group; total lines ~2185.
- v1.63.0: Fixed undo/redo reliability by adding debounced state saves on 'input' event for typing/paste/etc., ensuring snapshots for all user actions (now captures original on open, typing, button mods); swapped Font Size and Change Case button positions in Font group; total lines ~1990.
- v1.62.0: Fixed Change Case marker removal by collecting comment nodes first before deleting to avoid TreeWalker iteration issues during DOM mutation; ensures clean output without leftover <!--NFH_END-->; total lines ~1980.
- v1.61.0: Fixed Copy Format for full-note scenarios by replacing DOM outerHTML truncation with regex extraction of full nested opening tag prefix ((?:<[^>\/]+>)+) and closing suffix ((?:<\/[^>]+>)+), ensuring balanced count and content presence; captures complete nesting like <b><i><u><s>...</s></u></i></b> even without selection; total lines ~1975.
- v1.60.0: Fixed ReferenceError in modal close functions by replacing local escHandler with global shared escHandler for Escape key, ensuring proper event listener removal across all modals without scope issues; total lines ~1965.
- v1.59.0: Fixed Copy/Paste Format nested tag order by reversing parents for open tags and adjusting close concatenation (now captures <span><b> correctly); added Change Case button/modal to right of Font dropdown (Sentence/Lower/Upper/Toggle/Capitalize options via DOM text node traversal, preserves HTML/tags, auto-applies to full note if no selection); total lines ~1960.
- v1.58.0: Fixed auto-resize height adjustment by explicitly calculating and setting .ui-dialog-content height, measuring titlebar/buttonpane offsets for precise dialog sizing; enhanced width/content sync; total lines ~1825.
- v1.57.0: Replaced numeric prompts in settings with interactive modal for setting default size by dragging dialog resizers and confirming (live size display in modal); total lines ~1805.
- v1.56.0: Fixed Live Preview persistence by unconditionally nulling global references in cleanup (removed parentNode condition for nulling), ensuring fresh injection on every dialog open; total lines ~1755.
- v1.55.0: Doubled default auto-resize height to 724px; improved auto-resize to dynamically fit textarea contents (via scrollHeight) and preview pane (if enabled) for better initial visibility without manual dragging; fixed Live Preview persistence across multiple notes by nulling global toolbar/previewDiv/textarea references on dialog close, ensuring proper re-injection and toggle behavior on subsequent notes; added localStorage persistence for previewEnabled toggle state; total lines ~1750.
- v1.54.0: Added dedicated Note Utilities group (Clear Formatting, Copy Note) positioned to the left of Copy/Paste Format group; fixed Live Preview toggle (ensured persistent listener attachment/detachment on toggle, immediate re-render on enable, and enhanced styles for better HTML/CSS markup rendering mimicking Danbooru notes); total lines ~1720.
- v1.53.0: Reorganized ribbon groups (Undo/Redo separate before Font, Copy/Paste Format group before Formatting, new Formatting group with Pink/Double Outline/Clear/Copy Note/Snippets, Auto group with Resize/Settings/Center/Preview, References group with SFX button at end); removed broken Syntax Highlight button/feature; fixed Live Preview (default enabled, ensured pane appears and renders formatted HTML); total lines ~1700.
- v1.52.0: Fixed Copy Format tag detection using DOM parser for accurate full/partial/nested tags with attributes (handles <span style="..."> correctly); added full Snippets Manager modal (preview rendered sample, edit open/close/name, delete to empty slot, export/import JSON for backup/portability); total lines ~1650.
- v1.51.0: Fixed Paste Format bug for no-selection/full-note wrap (now sets selection range before apply); enhanced Copy Format with auto-detect enclosing tags via stack-based parser for partial selects (balances tags, handles malformed like missing <); added toggleable syntax highlighting in preview (IDE-like coloring for tags/attrs/strings; toggle "SH" button); added Format Snippets Manager (save/load presets in dropdown next to CF/PF, JSON localStorage, 5 slots); auto-tag balance on copy (warns/trims unbalanced); changed Copy Note icon to 📄; total lines ~1420.
- v1.50.0: Enhanced Copy/Paste Format to handle nested tags (e.g., <b><i>text</i></b> copies full open/close sequences); defaults to entire note if no selection (with user info); added Clear Format (XC, 🗑️, Ctrl+Shift+X) button; updated icons (✂️ CF, 📋 PF); dynamic PF button title previews current format; total lines ~1170.
- v1.49.0: Added Copy Format (CF) and Paste Format (PF) buttons to transfer HTML tags/styles (e.g., <b> or <span style="...">) between notes; extracts enclosing tags from selected formatted text via regex; persists via localStorage for multi-tab; total lines ~1120.
- v1.48.0: Fixed drag preview positioning during note creation by renaming the live preview element ID from 'note-preview' to 'nfh-preview' to avoid CSS conflicts with Danbooru's native #note-preview element used for temporary selection preview; total lines ~1020.
- v1.47.0: Fixed interference with note creation drag mode by delaying observer setup (2s after load) to avoid potential mutation conflicts during initial area selection, and removing unnecessary 'position: relative' style from dialog content to preserve original note display positioning; total lines ~1015.
- v1.46.0: Added ColorZilla extension link (🔗) next to eyedropper buttons in Firefox for fallback/advanced color picking; total lines ~1012.
- v1.45.0: Added Firefox support for EyeDropper API by updating titles to be browser-agnostic (no Chrome-specific mentions); disabled message now generic; total lines 982.
- v1.44.0: Upgraded color pickers (all features) with black/white swatches added to ROYGBIV palette and EyeDropper tool for easy screen/image color picking; fluid palette grid; total lines 978.
- v1.43.0: Removed Templates palette (no longer needed); removed auto <mark> highlight on selection (annoying); added character count display in toolbar and "Copy Note" button for convenience; improved mobile button sizing; total lines 928.
- v1.42.0: Added "Double Outline" template picker (pink text, white thick inner/black thin outer shadows, params for font/style/shadows); "Templates" palette with presets/customs (save/delete via localStorage); live HTML preview pane (toggleable); selection syntax highlight (yellow mark); export/import templates in settings; total lines 1042.
- v1.41.0: Fixed Pink Outline preview flash (JS-initialized shadows); added alpha sliders to Pink Outline text/outline (with rgba support); fluid symbols grid for mobile; total lines 892.
- v1.40.0: Added "Pink Outline" template button with parametric picker (font, size, colors, offset, blur) and live preview; icons updated; total lines ~850.
- v1.39.0: Added '♥' to symbols palette after other hearts; added Unicode icons to buttons (replacing text where possible) for ribbon-like Word appearance; total lines ~795.
- v1.38.0: Fixed syntax error by replacing template literals with concatenation to avoid injection parsing issues; added self-validation on load; total lines ~785.
- v1.37.0: Simplified labels to ASCII to avoid potential Unicode parsing issues in older engines; shortened debug messages; total lines ~810.
- v1.36.0: Shortened @description to avoid potential long-line parsing issues; total lines ~810.
- v1.35.0: Ensured full code completeness and syntax validation; no truncation issues.
- v1.34.0: Fixed syntax error in observer setup (subtree: true).
- v1.33.0: Replaced individual heart/dash buttons with "Symbols" palette popup; total lines ~810.
- v1.32.0: Added hyphen, en/em dashes insert buttons; total lines ~725.
- v1.31.0: Hoisted font dropdown action; replaced optional chaining; total lines ~702.
- v1.30.0: Added font family dropdown and heart buttons.
- v1.29.0: hexToRgb global; logging with line count (612 lines).
- v1.28.0: Fixed shadow outline; unified hexToRgb; resize delay.
- Earlier: Base features, color picker, undo/redo, auto-resize.
Analyzed script integrity on 2025-11-09; syntax validated, no errors found.
*/
(function() {
    'use strict';
    // Global try-catch wrapper to prevent errors from halting execution
    try {
        // Configuration object for easy extension - declared first to avoid hoisting issues
        const CONFIG = {
            version: '1.71.0',
            toolbarId: 'note-formatting-toolbar',
            buttons: [
                // Undo/Redo Group (moved before Font)
                {
                    id: 'undo-btn',
                    label: 'Undo',
                    title: 'Undo (Ctrl+Z)',
                    action: function(ta) { undo(ta); }
                },
                {
                    id: 'redo-btn',
                    label: 'Redo',
                    title: 'Redo (Ctrl+Y)',
                    action: function(ta) { redo(ta); }
                },
                {
                    id: 'history-modal-btn',
                    label: 'History',
                    title: 'Open Visual History Modal (view/jump to snapshots)',
                    action: function(ta) { openHistoryModal(ta); }
                },
                // Font Group
                {
                    id: 'font-family-dropdown',
                    type: 'dropdown',
                    title: 'Font Family (select and apply to text)',
                    options: [ // Generics first
                        {value: 'serif', label: 'Serif'},
                        {value: 'sans-serif', label: 'Sans Serif'},
                        {value: 'monospace', label: 'Monospace'},
                        {value: 'cursive', label: 'Cursive'},
                        {value: 'fantasy', label: 'Fantasy'},
                        // Danbooru-supplied (aliases as values, common labels)
                        {value: 'comic', label: 'Comic Sans MS'},
                        {value: 'narrow', label: 'Arial Narrow'},
                        {value: 'mono', label: 'Plex Mono'},
                        {value: 'slab sans', label: 'Impact'},
                        {value: 'slab serif', label: 'Rockwell'},
                        {value: 'formal serif', label: 'Formal Serif (Lora)'},
                        {value: 'formal cursive', label: 'Formal Cursive'},
                        {value: 'print', label: 'Print (Kalam)'},
                        {value: 'hand', label: 'Hand (Indie Flower)'},
                        {value: 'childlike', label: 'Childlike (Giselle)'},
                        {value: 'blackletter', label: 'Blackletter'},
                        {value: 'scary', label: 'Scary (Anarchy)'}
                    ],
                    action: function(ta, value) { applyFontFamily(ta, value); }
                },
                {
                    id: 'font-size-btn',
                    label: 'Size',
                    title: 'Font Size (prompt px/em)',
                    action: function(ta) { promptFontSize(ta); }
                },
                {
                    id: 'change-case-btn',
                    label: 'Aa',
                    title: 'Change Case (Sentence, Lower, Upper, Toggle, Capitalize Each Word)',
                    action: function(ta) { openChangeCaseModal(ta); }
                },
                {
                    id: 'big-btn',
                    label: 'Big',
                    title: 'Big Text (<big>)',
                    action: function(ta) { applyFormat(ta, '<big>', '</big>'); }
                },
                {
                    id: 'small-btn',
                    label: 'Small',
                    title: 'Small Text (<small>)',
                    action: function(ta) { applyFormat(ta, '<small>', '</small>'); }
                },
                {
                    id: 'sup-btn',
                    label: 'Sup',
                    title: 'Superscript (<sup>)',
                    action: function(ta) { applyFormat(ta, '<sup>', '</sup>'); }
                },
                {
                    id: 'sub-btn',
                    label: 'Sub',
                    title: 'Subscript (<sub>)',
                    action: function(ta) { applyFormat(ta, '<sub>', '</sub>'); }
                },
                {
                    id: 'shadow-btn',
                    label: 'Shadow',
                    title: 'Text Shadow (picker for offset/blur/color, outline mode)',
                    action: function(ta) { openShadowPicker(ta); }
                },
                {
                    id: 'color-btn',
                    label: 'Color',
                    title: 'Text Color (click for palette/picker)',
                    action: function(ta) { openColorPicker(ta, 'color'); }
                },
                {
                    id: 'highlight-btn',
                    label: 'Highlight',
                    title: 'Text Highlight (background-color, click for palette/picker)',
                    action: function(ta) { openColorPicker(ta, 'background-color'); }
                },
                {
                    id: 'bold-btn',
                    label: 'B',
                    title: 'Bold (<b>) (Ctrl+B)',
                    action: function(ta) { applyFormat(ta, '<b>', '</b>'); }
                },
                {
                    id: 'italic-btn',
                    label: 'I',
                    title: 'Italic (<i>) (Ctrl+I)',
                    action: function(ta) { applyFormat(ta, '<i>', '</i>'); }
                },
                {
                    id: 'underline-btn',
                    label: 'U',
                    title: 'Underline (<u>) (Ctrl+U)',
                    action: function(ta) { applyFormat(ta, '<u>', '</u>'); }
                },
                {
                    id: 'strikethrough-btn',
                    label: 'S',
                    title: 'Strikethrough (<s>)',
                    action: function(ta) { applyFormat(ta, '<s>', '</s>'); }
                },
                // Pink Outline (moved to Formatting group)
                {
                    id: 'pink-outline-btn',
                    label: 'Pink Outline',
                    title: 'Pink Outline Template (white text with pink outline, customizable)',
                    action: function(ta) { openPinkOutlinePicker(ta); }
                },
                // Double Outline (moved to Formatting group)
                {
                    id: 'double-outline-btn',
                    label: 'Double Outline',
                    title: 'Double Outline Template (pink text, white thick inner/black thin outer shadows)',
                    action: function(ta) { openDoubleOutlinePicker(ta); }
                },
                // Gradient Outline (new, beside other templates)
                {
                    id: 'gradient-outline-btn',
                    label: 'Gradient Outline',
                    title: 'Gradient Outline Template (linear gradient text transition left-to-right, customizable colors/angle, optional outline)',
                    action: function(ta) { openGradientOutlinePicker(ta); }
                },
                // Paragraph Group
                {
                    id: 'align-left-btn',
                    label: 'Left',
                    title: 'Align Left (<div align="left">)',
                    action: function(ta) { applyFormat(ta, '<div align="left">', '</div>'); }
                },
                {
                    id: 'align-center-btn',
                    label: 'Center',
                    title: 'Align Center (<div align="center">)',
                    action: function(ta) { applyFormat(ta, '<div align="center">', '</div>'); }
                },
                {
                    id: 'align-right-btn',
                    label: 'Right',
                    title: 'Align Right (<div align="right">)',
                    action: function(ta) { applyFormat(ta, '<div align="right">', '</div>'); }
                },
                // Insert Group
                {
                    id: 'link-btn',
                    label: 'Link',
                    title: 'Insert Link (<a href="...">)',
                    action: function(ta) { insertLink(ta); }
                },
                {
                    id: 'tn-btn',
                    label: 'TN',
                    title: 'Translator Note (<tn>)',
                    action: function(ta) { applyFormat(ta, '<tn>', '</tn>'); }
                },
                {
                    id: 'symbols-btn',
                    label: 'Symbols',
                    title: 'Symbols Palette (hearts, dashes, ★ ☆ • … etc.)',
                    action: function(ta) { openSymbolsPicker(ta); }
                },
                // Clear/History/Settings Group (parts moved)
                {
                    id: 'clear-btn',
                    label: 'Clear',
                    title: 'Clear Formatting (strip HTML tags)',
                    action: function(ta) { clearFormatting(ta); }
                },
                {
                    id: 'copy-btn',
                    label: 'Copy',
                    title: 'Copy Entire Note to Clipboard',
                    action: function(ta) { copyNote(ta); }
                },
                {
                    id: 'snippets-dropdown',
                    type: 'dropdown',
                    title: 'Format Snippets (select preset or save current)',
                    options: [], // Dynamically loaded
                    action: function(ta, value) {
                        if (value.startsWith('save:')) {
                            const name = prompt('Save current format as:');
                            if (name && copiedFormat) saveSnippet(name);
                        } else if (value) {
                            loadSnippet(value);
                            pasteFormat(ta); // Auto-paste loaded
                        }
                    }
                },
                {
                    id: 'manage-snippets-btn',
                    label: '⚙️',
                    title: 'Manage Format Snippets (edit name/open/close, preview rendered, delete, export/import JSON)',
                    action: function(ta) { openSnippetsManager(); }
                },
                {
                    id: 'copy-format-btn',
                    label: 'CF',
                    title: 'Copy Format (select formatted text/tags; auto-detects enclosing even partial; defaults to entire note)',
                    action: function(ta) { copyFormat(ta); }
                },
                {
                    id: 'paste-format-btn',
                    label: 'PF',
                    title: 'Paste Format (applies last copied/preset tags to selection; defaults to entire note)',
                    action: function(ta) { pasteFormat(ta); }
                },
                {
                    id: 'clear-format-btn',
                    label: 'XC',
                    title: 'Clear Copied Format (resets clipboard for format copy/paste)',
                    action: function(ta) { clearCopiedFormat(ta); }
                },
                {
                    id: 'toggle-resize-btn',
                    label: 'AR',
                    title: 'Toggle Auto-Resize On/Off',
                    action: function(ta) { toggleAutoResize(); }
                },
                {
                    id: 'toggle-center-btn',
                    label: 'AC',
                    title: 'Toggle Auto-Center On/Off',
                    action: function(ta) { toggleAutoCenter(); }
                },
                {
                    id: 'toggle-preview-btn',
                    label: 'Preview',
                    title: 'Toggle Live HTML Preview Pane',
                    action: function(ta) { togglePreview(); }
                },
                {
                    id: 'settings-btn',
                    label: 'Settings',
                    title: 'Set Default Window Size (drag dialog, then confirm in modal)',
                    action: function(ta) { openSettings(); }
                },
                // New References Group
                {
                    id: 'sfx-btn',
                    label: 'SFX',
                    title: 'Open Japanese SFX Translations Wiki[](https://danbooru.donmai.us/wiki_pages/list_of_sfx)',
                    action: function(ta) { window.open('https://danbooru.donmai.us/wiki_pages/list_of_sfx', '_blank'); }
                }
            ],
            icons: {
                'font-size-btn': '📏',
                'big-btn': '↗️',
                'small-btn': '↙️',
                'sup-btn': '²',
                'sub-btn': '₂',
                'shadow-btn': '🌑',
                'color-btn': '🎨',
                'highlight-btn': '🖍️',
                'bold-btn': '𝐛',
                'italic-btn': '𝑖',
                'underline-btn': '𝑢',
                'strikethrough-btn': '𝑠',
                'align-left-btn': '◀',
                'align-center-btn': '▢',
                'align-right-btn': '▶',
                'link-btn': '🔗',
                'tn-btn': 'TN',
                'symbols-btn': '♥',
                'clear-btn': '🧹',
                'copy-btn': '📄',
                'copy-format-btn': '✂️',
                'paste-format-btn': '📋',
                'clear-format-btn': '🗑️',
                'undo-btn': '↶',
                'redo-btn': '↷',
                'history-modal-btn': '📜',
                'toggle-resize-btn': '📐',
                'toggle-center-btn': '🎯',
                'toggle-preview-btn': '👁',
                'settings-btn': '⚙️',
                'manage-snippets-btn': '⚙️',
                'sfx-btn': '🔊',
                'change-case-btn': 'Aa',
                'gradient-outline-btn': '🌈'
            },
            shortcuts: {
                bold: 'Ctrl+B',
                italic: 'Ctrl+I',
                underline: 'Ctrl+U',
                undo: 'Ctrl+Z',
                redo: 'Ctrl+Y',
                copyFormat: 'Ctrl+Shift+C',
                pasteFormat: 'Ctrl+Shift+V',
                clearFormat: 'Ctrl+Shift+X'
            },
            manualTrigger: 'Ctrl+Shift+I', // Force inject
            historyLimit: 50, // Max undo/redo states
            branchLimit: 3, // Max branches per note
            checkpointInterval: 10, // Every N saves, checkpoint with diff
            idleBranchThreshold: 5000, // ms since last save to branch
            commonColors: ['#000000', '#FFFFFF', '#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'], // Black, White + ROYGBIV hex
            symbols: ['♡', '❤', '♥', '★', '☆', '•', '◦', '…', '‥', '—', '–', '-', '⸺', '⸻', '©', '™', '®', '§', '¶', '†', '‡', '°', '±', '×', '÷', '≈', '≠', '≤', '≥'], // Common translation/math symbols
            autoResize: {
                enabled: true,
                defaultWidth: 523,
                defaultHeight: 724
            },
            autoCenter: {
                enabled: true
            },
            previewEnabled: true,
            debounceDelay: 400, // Base ms for input events; dynamic override (tuned for word-grouping)
            colorZillaUrl: 'https://addons.mozilla.org/en-US/firefox/addon/colorzilla/',
            styles: "#note-formatting-toolbar { " +
                    "display: flex; " +
                    "flex-wrap: wrap; " +
                    "gap: 10px; " +
                    "margin: 5px 0; " +
                    "padding: 5px; " +
                    "background: #f0f0f0; " +
                    "border: 1px solid #ccc; " +
                    "border-radius: 4px; " +
                    "font-family: sans-serif; " +
                    "font-size: 12px; " +
                    "justify-content: center; " +
                    "overflow-x: auto; " +
                    "max-width: 100%; " +
                    "} " +
                    "#note-formatting-toolbar .group { " +
                    "display: flex; " +
                    "gap: 2px; " +
                    "padding: 2px 5px; " +
                    "background: white; " +
                    "border-radius: 3px; " +
                    "border: 1px solid #ddd; " +
                    "} " +
                    "#note-formatting-toolbar button { " +
                    "padding: 4px 6px; " +
                    "border: 1px solid #ccc; " +
                    "background: white; " +
                    "border-radius: 3px; " +
                    "cursor: pointer; " +
                    "font-weight: bold; " +
                    "font-size: 11px; " +
                    "min-width: auto; " +
                    "transition: background 0.2s; " +
                    "} " +
                    "#note-formatting-toolbar button:hover { " +
                    "background: #e0e0e0; " +
                    "} " +
                    "#note-formatting-toolbar button:disabled { " +
                    "background: #f5f5f5; cursor: not-allowed; opacity: 0.5; " +
                    "} " +
                    "#note-formatting-toolbar button.pulse { " +
                    "animation: pulse 0.5s ease-in-out; " +
                    "} " +
                    "@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } " +
                    "#note-formatting-toolbar select { " +
                    "padding: 4px 6px; " +
                    "border: 1px solid #ccc; " +
                    "background: white; " +
                    "border-radius: 3px; " +
                    "cursor: pointer; " +
                    "font-weight: bold; " +
                    "font-size: 11px; " +
                    "min-width: auto; " +
                    "} " +
                    "#note-formatting-toolbar select:focus { " +
                    "outline: 1px solid #007cba; " +
                    "background: #e6f3ff; " +
                    "} " +
                    ".note-edit-dialog #note-formatting-toolbar { " +
                    "margin-bottom: 5px; " +
                    "} " +
                    "#toolbar-minimize { " +
                    "margin-left: auto; " +
                    "background: #ddd; " +
                    "font-size: 10px; " +
                    "padding: 2px 4px; " +
                    "} " +
                    "#debug-indicator { " +
                    "position: fixed; " +
                    "top: 10px; " +
                    "right: 10px; " +
                    "background: #ffeb3b; " +
                    "color: #000; " +
                    "padding: 5px; " +
                    "border: 1px solid #ccc; " +
                    "font-size: 12px; " +
                    "z-index: 9999; " +
                    "display: none; " +
                    "max-width: 300px; " +
                    "} " +
                    "/* Color Picker Styles */ " +
                    "#color-picker, #shadow-picker, #symbol-picker, #pink-outline-picker, #double-outline-picker, #gradient-outline-picker, #snippets-manager, #resize-settings-modal, #change-case-modal, #history-modal { " +
                    "position: fixed; " +
                    "top: 50%; " +
                    "left: 50%; " +
                    "transform: translate(-50%, -50%); " +
                    "background: #1E1E2C; " +
                    "color: #E0E0E0; " +
                    "border: 1px solid #ccc; " +
                    "border-radius: 8px; " +
                    "padding: 20px; " +
                    "box-shadow: 0 4px 20px rgba(0,0,0,0.5); " +
                    "z-index: 10000; " +
                    "min-width: 300px; " +
                    "font-family: sans-serif; " +
                    "max-height: 80vh; " +
                    "overflow-y: auto; " +
                    "} " +
                    "#gradient-outline-picker, #history-modal { min-width: 500px; } " +
                    "#change-case-modal { min-width: 250px; } " +
                    "#resize-settings-modal { " +
                    "min-width: 250px; background: #f0f0f0; color: #000; } " +
                    "#resize-settings-modal .version, #gradient-outline-picker .version, #history-modal .version { " +
                    "position: absolute; top: 5px; right: 5px; font-size: 10px; color: #666; } " +
                    "#resize-settings-modal h3, #gradient-outline-picker h3, #history-modal h3 { margin: 0 0 10px; color: #000; } " +
                    "#gradient-outline-picker h3, #history-modal h3 { color: #F0F0F0; } " +
                    "#resize-settings-modal #current-size { font-weight: bold; margin-bottom: 10px; color: #000; } " +
                    "#resize-settings-modal .buttons { display: flex; gap: 10px; justify-content: center; } " +
                    "#resize-settings-modal button { padding: 5px 10px; border: 1px solid #ccc; background: white; border-radius: 3px; cursor: pointer; } " +
                    "#resize-settings-modal button:hover { background: #e0e0e0; } " +
                    "#snippets-manager { min-width: 600px; max-width: 80vw; } " +
                    ".snippet-item { " +
                    "display: block; " +
                    "margin-bottom: 15px; " +
                    "padding: 10px; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "background: #333; " +
                    "} " +
                    ".snippet-item h4 { margin: 0 0 5px 0; color: #F0F0F0; } " +
                    ".snippet-item textarea { " +
                    "width: 100%; " +
                    "background: #444; " +
                    "color: #E0E0E0; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "padding: 5px; " +
                    "font-family: monospace; " +
                    "font-size: 12px; " +
                    "} " +
                    ".snippet-preview { " +
                    "border: 1px solid #666; " +
                    "padding: 10px; " +
                    "margin: 5px 0; " +
                    "min-height: 20px; " +
                    "background: white; " +
                    "color: black; " +
                    "border-radius: 4px; " +
                    "overflow: auto; " +
                    "} " +
                    ".snippet-buttons { " +
                    "display: flex; " +
                    "gap: 5px; " +
                    "margin-top: 5px; " +
                    "} " +
                    ".snippet-buttons button { " +
                    "padding: 4px 8px; " +
                    "background: #444; " +
                    "color: #E0E0E0; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "cursor: pointer; " +
                    "font-size: 10px; " +
                    "} " +
                    ".snippet-buttons button:hover { background: #555; } " +
                    "#color-picker h3, #shadow-picker h3, #symbol-picker h3, #pink-outline-picker h3, #double-outline-picker h3, #gradient-outline-picker h3, #snippets-manager h3, #resize-settings-modal h3, #change-case-modal h3, #history-modal h3 { " +
                    "margin: 0 0 10px 0; " +
                    "text-align: center; " +
                    "color: #F0F0F0; " +
                    "} " +
                    "#resize-settings-modal h3 { color: #000; } " +
                    "#change-case-modal h3 { color: #F0F0F0; } " +
                    ".palette { " +
                    "display: grid; " +
                    "grid-template-columns: repeat(auto-fit, minmax(30px, 1fr)); " +
                    "gap: 2px; " +
                    "margin-bottom: 15px; " +
                    "} " +
                    ".symbols-palette { " +
                    "display: grid; " +
                    "grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)); " +
                    "gap: 10px; " +
                    "margin-bottom: 15px; " +
                    "justify-items: center; " +
                    "} " +
                    ".palette button, .symbols-palette button { " +
                    "width: 30px; " +
                    "height: 30px; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "cursor: pointer; " +
                    "font-size: 16px; " +
                    "background: #333; " +
                    "color: #E0E0E0; " +
                    "} " +
                    ".palette button:hover, .symbols-palette button:hover { " +
                    "background: #444; " +
                    "} " +
                    ".custom-section, .shadow-section, .outline-section, .gradient-section { " +
                    "margin-bottom: 10px; " +
                    "} " +
                    ".custom-section label, .shadow-section label, .outline-section label, .gradient-section label { " +
                    "display: block; " +
                    "margin-bottom: 5px; " +
                    "color: #D0D0D0; " +
                    "} " +
                    ".shadow-inputs, .outline-inputs, .gradient-inputs { " +
                    "display: flex; " +
                    "flex-direction: column; " +
                    "gap: 5px; " +
                    "} " +
                    ".shadow-inputs input[type=\"number\"], .outline-inputs input[type=\"number\"], .gradient-inputs input[type=\"number\"] { " +
                    "background: #333; " +
                    "color: #fff; " +
                    "border: 1px solid #666; " +
                    "padding: 2px; " +
                    "} " +
                    ".rgb-sliders { " +
                    "display: flex; " +
                    "gap: 10px; " +
                    "margin-bottom: 10px; " +
                    "} " +
                    ".rgb-sliders input[type=\"range\"] { " +
                    "flex: 1; " +
                    "background: #333; " +
                    "color: #fff; " +
                    "} " +
                    ".rgb-inputs { " +
                    "display: flex; " +
                    "gap: 5px; " +
                    "} " +
                    ".rgb-inputs input[type=\"number\"] { " +
                    "width: 50px; " +
                    "background: #333; " +
                    "color: #fff; " +
                    "border: 1px solid #666; " +
                    "} " +
                    ".hex-input { " +
                    "margin-bottom: 10px; " +
                    "} " +
                    ".hex-input input[type=\"text\"] { " +
                    "width: 100px; " +
                    "background: #333; " +
                    "color: #fff; " +
                    "border: 1px solid #666; " +
                    "text-transform: uppercase; " +
                    "} " +
                    ".eyedropper-btn { " +
                    "padding: 4px 8px; " +
                    "font-size: 12px; " +
                    "background: #555; " +
                    "color: #E0E0E0; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "cursor: pointer; " +
                    "margin-top: 5px; " +
                    "width: 100%; " +
                    "} " +
                    ".eyedropper-btn:hover { " +
                    "background: #666; " +
                    "} " +
                    ".eyedropper-btn:disabled { " +
                    "background: #333; " +
                    "cursor: not-allowed; " +
                    "} " +
                    ".extension-link { " +
                    "display: inline-block; " +
                    "margin-left: 5px; " +
                    "font-size: 16px; " +
                    "text-decoration: none; " +
                    "color: #E0E0E0; " +
                    "vertical-align: middle; " +
                    "} " +
                    ".extension-link:hover { " +
                    "color: #007cba; " +
                    "} " +
                    "#color-preview, #shadow-preview, #outline-preview, #double-preview, #gradient-preview { " +
                    "width: 100%; " +
                    "height: 40px; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "margin-bottom: 10px; " +
                    "display: flex; " +
                    "align-items: center; " +
                    "justify-content: center; " +
                    "color: #fff; " +
                    "font-weight: bold; " +
                    "font-size: 18px; " +
                    "background: #333; " +
                    "} " +
                    "#gradient-preview { " +
                    "background: linear-gradient(90deg, #573073, #D852BE 100%); " +
                    "-webkit-background-clip: text; " +
                    "color: transparent; " +
                    "-webkit-text-stroke: 1px #ffffff; " +
                    "font-size: 20px; " +
                    "font-family: print, sans-serif; " +
                    "font-weight: bold; " +
                    "height: 50px; " +
                    "} " +
                    ".preset-buttons { " +
                    "display: flex; " +
                    "gap: 5px; " +
                    "margin-bottom: 10px; " +
                    "} " +
                    ".preset-buttons button { " +
                    "padding: 4px 8px; " +
                    "background: #444; " +
                    "color: #E0E0E0; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "cursor: pointer; " +
                    "font-size: 10px; " +
                    "} " +
                    ".preset-buttons button:hover { " +
                    "background: #555; " +
                    "} " +
                    ".picker-buttons { " +
                    "display: flex; " +
                    "gap: 10px; " +
                    "justify-content: center; " +
                    "} " +
                    ".picker-buttons button { " +
                    "padding: 8px 16px; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "cursor: pointer; " +
                    "background: #333; " +
                    "color: #E0E0E0; " +
                    "} " +
                    ".picker-buttons button:hover { " +
                    "background: #444; " +
                    "} " +
                    "#color-picker-overlay, #shadow-picker-overlay, #symbol-picker-overlay, #pink-outline-picker-overlay, #double-outline-picker-overlay, #gradient-outline-picker-overlay, #snippets-manager-overlay, #resize-settings-overlay, #change-case-modal-overlay, #history-modal-overlay { " +
                    "position: fixed; " +
                    "top: 0; " +
                    "left: 0; " +
                    "width: 100%; " +
                    "height: 100%; " +
                    "background: rgba(0,0,0,0.5); " +
                    "z-index: 9999; " +
                    "} " +
                    ".font-family-preview { " +
                    "font-family: inherit; " +
                    "font-size: inherit; " +
                    "font-weight: inherit; " +
                    "color: inherit; " +
                    "text-shadow: inherit; " +
                    "white-space: nowrap; " +
                    "overflow: hidden; " +
                    "text-overflow: ellipsis; " +
                    "} " +
                    "#nfh-preview { " +
                    "margin-top: 10px; " +
                    "padding: 10px; " +
                    "border: 1px solid #ccc; " +
                    "background: white; " +
                    "min-height: 100px; " +
                    "overflow: auto; " +
                    "font-family: sans-serif; " +
                    "font-size: 14px; " +
                    "border-radius: 4px; " +
                    "display: none; " + // Hidden by default
                    "line-height: 1.4; " +
                    "max-width: 100%; " +
                    "word-wrap: break-word; " +
                    "} " +
                    "#nfh-preview.show { " +
                    "display: block; " +
                    "} " +
                    "#double-preview { " +
                    "background-color: #333; " +
                    "color: #D87C86; " +
                    "font-size: 20px; " +
                    "font-family: print; " +
                    "font-weight: bold; " +
                    "display: flex; " +
                    "align-items: center; " +
                    "justify-content: center; " +
                    "height: 50px; " +
                    "border: 1px solid #666; " +
                    "border-radius: 4px; " +
                    "margin-bottom: 10px; " +
                    "text-shadow: none; " + // JS sets shadows
                    "} " +
                    "#char-count { " +
                    "margin-left: auto; " +
                    "font-size: 10px; " +
                    "color: #666; " +
                    "padding: 2px 5px; " +
                    "background: #f9f9f9; " +
                    "border-radius: 3px; " +
                    "border: 1px solid #ddd; " +
                    "align-self: center; " +
                    "min-width: 60px; " +
                    "text-align: center; " +
                    "} " +
                    "#change-case-modal .option { " +
                    "display: flex; " +
                    "align-items: center; " +
                    "gap: 10px; " +
                    "margin-bottom: 10px; " +
                    "} " +
                    "#change-case-modal input[type=\"radio\"] { " +
                    "margin: 0; " +
                    "} " +
                    "#change-case-modal label { " +
                    "cursor: pointer; " +
                    "color: #E0E0E0; " +
                    "} " +
                    ".outline-toggle { " +
                    "display: flex; " +
                    "align-items: center; " +
                    "gap: 10px; " +
                    "margin-bottom: 10px; " +
                    "} " +
                    ".outline-toggle input[type=\"checkbox\"] { " +
                    "margin: 0; " +
                    "} " +
                    ".outline-section.hidden { " +
                    "display: none; " +
                    "} " +
                    "/* History Modal Styles */ " +
                    "#history-modal .history-list { " +
                    "max-height: 400px; overflow-y: auto; margin-bottom: 10px; } " +
                    ".history-item { " +
                    "display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid #666; border-radius: 4px; background: #333; margin-bottom: 5px; cursor: pointer; } " +
                    ".history-item:hover { background: #444; } " +
                    ".history-thumbnail { width: 100px; height: 30px; border: 1px solid #ccc; padding: 5px; overflow: hidden; font-size: 12px; background: white; color: black; } " +
                    ".history-meta { flex: 1; font-size: 12px; } " +
                    ".history-buttons { display: flex; gap: 5px; } " +
                    ".history-buttons button { padding: 4px 8px; background: #444; color: #E0E0E0; border: 1px solid #666; border-radius: 4px; cursor: pointer; font-size: 10px; } " +
                    ".history-buttons button:hover { background: #555; } " +
                    "@media (max-width: 600px) { " +
                    " #note-formatting-toolbar button, #note-formatting-toolbar select { " +
                    " font-size: 10px; " +
                    " padding: 3px 4px; " +
                    " } " +
                    " #note-formatting-toolbar .group { " +
                    " flex-wrap: wrap; " +
                    " gap: 1px; " +
                    " } " +
                    " #gradient-outline-picker, #history-modal { min-width: 90vw; } " +
                    " .history-item { flex-direction: column; align-items: flex-start; } " +
                    " .history-thumbnail { width: 100%; } " +
                    "} " +
                    "/* Draggable Textarea Styles */ " +
                    ".note-edit-dialog textarea { " +
                    "resize: vertical; " +
                    "overflow: hidden; " +
                    "min-height: 60px; " + // Ensure at least 2 lines
                    "}"
        };
        // Global variables for state management (per-tab isolation for multi-tab support)
        var observer = null;
        var activeDialogs = new Set(); // Track multiple dialogs if possible (rare, but robust)
        var toolbar = null;
        var textarea = null;
        var previewDiv = null;
        var charCountSpan = null;
        var isMinimized = false;
        var manualResizeActive = false; // New: Flag for manual dialog resize in progress
        var debugMode = true; // Enable for logging; set to false in prod if needed
        var manualTriggerHandler = null;
        var history = []; // Undo/redo history array of {value, start, end, timestamp, diff? (for checkpoints), branchId}
        var historyIndex = -1; // Current position in history
        var branches = {}; // {branchId: {history: [], index: 0}} for lite branching
        var currentBranchId = 'main'; // Default branch
        var lastSaveTime = 0; // For branching threshold
        var saveCount = 0; // For checkpointing
        var colorPicker = null; // Color picker dialog
        var shadowPicker = null; // Shadow picker dialog
        var symbolPicker = null; // Symbols picker dialog
        var pinkOutlinePicker = null; // Pink outline picker dialog
        var doubleOutlinePicker = null; // Double outline picker dialog
        var gradientOutlinePicker = null; // Gradient outline picker dialog
        var snippetsManager = null; // Snippets manager dialog
        var resizeSettingsModal = null; // Resize settings modal
        var changeCaseModal = null; // Change case modal
        var historyModal = null; // History modal dialog
        var debounceTimer = null; // For input events
        var copiedFormat = null; // {open: string, close: string} for format copy/paste
        var pasteButton = null; // Reference to PF button for dynamic title updates
        var undoButton = null; // Reference to undo button for dynamic title/disable
        var redoButton = null; // Reference to redo button for dynamic title/disable
        var snippets = []; // Array of {name: string, open: string, close: string}
        var snippetsDropdown = null; // Reference to dropdown
        var sizeUpdateInterval = null; // For live size updates in modal
        var globalEscHandler = function(e) {
            if (e.key === 'Escape') {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
            }
        };
        // Per-dialog ResizeObserver instances for height sync
        var dialogResizeObservers = new WeakMap();
        // Per-textarea ResizeObserver instances for drag detection
        var taResizeObservers = new WeakMap();
        // Utility: Detect Firefox
        function isFirefox() {
            return navigator.userAgent.includes('Firefox');
        }
        // Utility: Add ColorZilla link next to eyedropper button
        function addColorZillaLink(eyedropperBtn) {
            if (!isFirefox()) return;
            const link = document.createElement('a');
            link.href = CONFIG.colorZillaUrl;
            link.target = '_blank';
            link.className = 'extension-link';
            link.innerHTML = '🔗';
            link.title = 'ColorZilla Extension for advanced color picking';
            link.style.cssText = 'display: inline-block; margin-left: 5px; font-size: 16px; text-decoration: none; color: #E0E0E0; vertical-align: middle;';
            eyedropperBtn.parentNode.insertBefore(link, eyedropperBtn.nextSibling);
            log('Added ColorZilla link next to eyedropper in Firefox.');
        }
        // Utility: Log with prefix for easy console filtering - uses CONFIG.version safely
        function log(message, data) {
            if (typeof data === 'undefined') data = null;
            var version = CONFIG ? CONFIG.version : 'unknown';
            console.log('[NoteFmtHelper v' + version + '] ' + message, data || '');
        }
        // Unified hexToRgb (strips # if present) - moved to global scope to eliminate duplication
        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            var r = parseInt(hex.substr(0, 2), 16);
            var g = parseInt(hex.substr(2, 2), 16);
            var b = parseInt(hex.substr(4, 2), 16);
            return { r: r, g: g, b: b };
        }
        // Apply font family - hoisted for syntax safety
        function applyFontFamily(ta, value) {
            if (!value) return;
            // Fallback to generic if needed (per docs)
            var family = value.includes(' ') ? value + ', serif' : value + ', sans-serif';
            var openTag = '<span style="font-family: ' + family + ';">';
            applyFormat(ta, openTag, '</span>');
        }
        // Update paste button title with current format preview
        function updatePasteButtonTitle() {
            if (!pasteButton) return;
            var preview = copiedFormat ? (copiedFormat.open.substring(0, 30) + '...' + copiedFormat.close.substring(0, 15) + '...') : 'None';
            pasteButton.title = CONFIG.buttons.find(function(b) { return b.id === 'paste-format-btn'; }).title + ' Current: ' + preview;
        }
        // Update undo/redo button titles and states
        function updateUndoRedoUI() {
            if (!undoButton || !redoButton) return;
            const stepsUndo = historyIndex;
            const stepsRedo = history.length - 1 - historyIndex;
            undoButton.title = 'Undo (' + stepsUndo + ' steps available)';
            redoButton.title = 'Redo (' + stepsRedo + ' steps available)';
            undoButton.disabled = stepsUndo === 0;
            redoButton.disabled = stepsRedo === 0;
            if (saveCount % CONFIG.checkpointInterval === 0) {
                // Subtle pulse on checkpoint save
                undoButton.classList.add('pulse');
                setTimeout(() => undoButton.classList.remove('pulse'), 500);
            }
        }
        // Load/save snippets from/to localStorage
        function loadSnippets() {
            try {
                const saved = localStorage.getItem('nfh_snippets');
                if (saved) {
                    snippets = JSON.parse(saved);
                } else {
                    // Default empty slots
                    snippets = [{name: 'Slot 1', open: '', close: ''}, {name: 'Slot 2', open: '', close: ''}, {name: 'Slot 3', open: '', close: ''}, {name: 'Slot 4', open: '', close: ''}, {name: 'Slot 5', open: '', close: ''}];
                    saveSnippets();
                }
                updateSnippetsDropdown();
                log('Snippets loaded:', snippets);
            } catch (err) {
                log('Load snippets error', err);
                snippets = [];
            }
        }
        function saveSnippets() {
            try {
                localStorage.setItem('nfh_snippets', JSON.stringify(snippets));
                updateSnippetsDropdown();
            } catch (err) {
                log('Save snippets error', err);
            }
        }
        function saveSnippet(name) {
            if (!copiedFormat || !name) return;
            // Find empty slot or overwrite last
            let slot = snippets.find(s => !s.open);
            if (!slot) slot = snippets[snippets.length - 1];
            slot.name = name;
            slot.open = copiedFormat.open;
            slot.close = copiedFormat.close;
            saveSnippets();
            showDebugIndicator('Saved snippet: ' + name, 'success');
        }
        function loadSnippet(name) {
            const snippet = snippets.find(s => s.name === name);
            if (snippet && snippet.open) {
                copiedFormat = {open: snippet.open, close: snippet.close};
                localStorage.setItem('nfh_copiedFormat', JSON.stringify(copiedFormat));
                updatePasteButtonTitle();
                showDebugIndicator('Loaded snippet: ' + name, 'success');
            }
        }
        function updateSnippetsDropdown() {
            if (!snippetsDropdown) return;
            snippetsDropdown.innerHTML = '';
            // Add save option
            const saveOpt = document.createElement('option');
            saveOpt.value = 'save:';
            saveOpt.textContent = 'Save Current...';
            snippetsDropdown.appendChild(saveOpt);
            // Add slots
            snippets.forEach(function(snip) {
                const opt = document.createElement('option');
                opt.value = snip.name;
                opt.textContent = snip.name + (snip.open ? '' : ' (empty)');
                snippetsDropdown.appendChild(opt);
            });
        }
        // Open Snippets Manager modal
        function openSnippetsManager() {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'snippets-manager-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                snippetsManager = document.createElement('div');
                snippetsManager.id = 'snippets-manager';
                var content = '<h3>Format Snippets Manager</h3>';
                snippets.forEach(function(snip, index) {
                    content += '<div class="snippet-item">' +
                               '<h4>Slot ' + (index + 1) + ': <input type="text" class="snippet-name" value="' + (snip.name || '') + '" placeholder="Snippet name" /></h4>' +
                               '<textarea class="snippet-open" placeholder="Open tag (e.g., &lt;span style=...)">' + (snip.open || '') + '</textarea>' +
                               '<textarea class="snippet-close" placeholder="Close tag (e.g., &lt;/span&gt;)">' + (snip.close || '') + '</textarea>' +
                               '<div class="snippet-preview"></div>' +
                               '<div class="snippet-buttons">' +
                               '<button class="preview-btn">Preview</button>' +
                               '<button class="update-btn">Update</button>' +
                               '<button class="delete-btn">Delete</button>' +
                               '</div>' +
                               '</div>';
                });
                content += '<div class="picker-buttons">' +
                           '<button id="export-snippets">Export JSON</button>' +
                           '<input type="file" id="import-file" accept=".json" style="display:none;" />' +
                           '<button id="import-snippets">Import JSON</button>' +
                           '<button id="manager-ok">Save All</button>' +
                           '<button id="manager-cancel">Cancel</button>' +
                           '</div>';
                snippetsManager.innerHTML = content;
                document.body.appendChild(snippetsManager);
                // Event listeners
                snippetsManager.querySelector('#manager-ok').addEventListener('click', function() {
                    snippets.forEach(function(snip, index) {
                        const item = snippetsManager.querySelectorAll('.snippet-item')[index];
                        snip.name = item.querySelector('.snippet-name').value.trim();
                        snip.open = item.querySelector('.snippet-open').value.trim();
                        snip.close = item.querySelector('.snippet-close').value.trim();
                    });
                    saveSnippets();
                    showDebugIndicator('Snippets updated and saved.', 'success');
                    closeSnippetsManager();
                });
                snippetsManager.querySelector('#manager-cancel').addEventListener('click', closeSnippetsManager);
                snippetsManager.querySelector('#export-snippets').addEventListener('click', function() {
                    const blob = new Blob([JSON.stringify(snippets, null, 2)], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'nfh-snippets.json';
                    a.click();
                    URL.revokeObjectURL(url);
                    showDebugIndicator('Snippets exported as JSON.', 'success');
                });
                snippetsManager.querySelector('#import-snippets').addEventListener('click', function() {
                    snippetsManager.querySelector('#import-file').click();
                });
                snippetsManager.querySelector('#import-file').addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        try {
                            const imported = JSON.parse(ev.target.result);
                            if (Array.isArray(imported) && imported.length === 5) {
                                snippets = imported;
                                saveSnippets();
                                showDebugIndicator('Snippets imported successfully.', 'success');
                                closeSnippetsManager();
                            } else {
                                showDebugIndicator('Invalid JSON: Must be array of 5 snippets.', 'error');
                            }
                        } catch (err) {
                            showDebugIndicator('Import failed: Invalid JSON.', 'error');
                            log('Import error', err);
                        }
                    };
                    reader.readAsText(file);
                });
                // Per-snippet listeners
                snippetsManager.querySelectorAll('.preview-btn').forEach(function(btn, index) {
                    btn.addEventListener('click', function() {
                        const item = btn.closest('.snippet-item');
                        const open = item.querySelector('.snippet-open').value;
                        const close = item.querySelector('.snippet-close').value;
                        const preview = item.querySelector('.snippet-preview');
                        if (open && close) {
                            preview.innerHTML = open + 'Sample Text' + close;
                        } else {
                            preview.innerHTML = '<em>No format to preview</em>';
                        }
                    });
                });
                snippetsManager.querySelectorAll('.update-btn').forEach(function(btn, index) {
                    btn.addEventListener('click', function() {
                        const item = btn.closest('.snippet-item');
                        snippets[index].name = item.querySelector('.snippet-name').value.trim();
                        snippets[index].open = item.querySelector('.snippet-open').value.trim();
                        snippets[index].close = item.querySelector('.snippet-close').value.trim();
                        showDebugIndicator('Snippet ' + (index + 1) + ' updated.', 'success');
                    });
                });
                snippetsManager.querySelectorAll('.delete-btn').forEach(function(btn, index) {
                    btn.addEventListener('click', function() {
                        if (confirm('Delete snippet ' + (index + 1) + '? This empties the slot.')) {
                            snippets[index].name = 'Slot ' + (index + 1);
                            snippets[index].open = '';
                            snippets[index].close = '';
                            const item = btn.closest('.snippet-item');
                            item.querySelector('.snippet-name').value = snippets[index].name;
                            item.querySelector('.snippet-open').value = '';
                            item.querySelector('.snippet-close').value = '';
                            item.querySelector('.snippet-preview').innerHTML = '';
                            showDebugIndicator('Snippet ' + (index + 1) + ' deleted (slot emptied).', 'success');
                        }
                    });
                });
                overlay.addEventListener('click', closeSnippetsManager);
                window.addEventListener('keydown', globalEscHandler);
                log('Snippets manager opened.');
            } catch (err) {
                log('Snippets manager open error', err);
                showDebugIndicator('Snippets manager failed; check console.', 'error');
            }
        }
        function closeSnippetsManager() {
            window.removeEventListener('keydown', globalEscHandler);
            if (snippetsManager) {
                const overlay = document.getElementById('snippets-manager-overlay');
                if (overlay) overlay.remove();
                snippetsManager.remove();
                snippetsManager = null;
            }
        }
        // Open Change Case Modal
        function openChangeCaseModal(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'change-case-modal-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                changeCaseModal = document.createElement('div');
                changeCaseModal.id = 'change-case-modal';
                changeCaseModal.innerHTML = '<h3>Change Case</h3>' +
                    '<div class="options">' +
                    '<div class="option"><input type="radio" name="case" value="sentence" id="case-sentence" checked><label for="case-sentence">Sentence Case</label></div>' +
                    '<div class="option"><input type="radio" name="case" value="lower" id="case-lower"><label for="case-lower">Lower Case</label></div>' +
                    '<div class="option"><input type="radio" name="case" value="upper" id="case-upper"><label for="case-upper">Upper Case</label></div>' +
                    '<div class="option"><input type="radio" name="case" value="toggle" id="case-toggle"><label for="case-toggle">Toggle Case</label></div>' +
                    '<div class="option"><input type="radio" name="case" value="capitalize" id="case-capitalize"><label for="case-capitalize">Capitalize Each Word</label></div>' +
                    '</div>' +
                    '<div class="picker-buttons">' +
                    '<button id="case-ok">OK</button>' +
                    '<button id="case-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(changeCaseModal);
                changeCaseModal.querySelector('#case-ok').addEventListener('click', function() {
                    const option = changeCaseModal.querySelector('input[name="case"]:checked').value;
                    changeCaseInRange(ta, option);
                    closeChangeCaseModal();
                });
                changeCaseModal.querySelector('#case-cancel').addEventListener('click', closeChangeCaseModal);
                overlay.addEventListener('click', closeChangeCaseModal);
                window.addEventListener('keydown', globalEscHandler);
                log('Change case modal opened.');
            } catch (err) {
                log('Change case modal open error', err);
                showDebugIndicator('Change case modal failed; check console.', 'error');
            }
        }
        function closeChangeCaseModal() {
            window.removeEventListener('keydown', globalEscHandler);
            if (changeCaseModal) {
                const overlay = document.getElementById('change-case-modal-overlay');
                if (overlay) overlay.remove();
                changeCaseModal.remove();
                changeCaseModal = null;
            }
        }
        // Change case in selection range via DOM text nodes
        function changeCaseInRange(ta, option) {
            try {
                var start = ta.selectionStart;
                var end = ta.selectionEnd;
                var isFull = false;
                if (start === end) {
                    start = 0;
                    end = ta.value.length;
                    isFull = true;
                    showDebugIndicator('No selection; changing case for entire note.', 'info');
                }
                var markerStart = '<!--NFH_START-->';
                var markerEnd = '<!--NFH_END-->';
                var modifiedText = ta.value.substring(0, start) + markerStart + ta.value.substring(start, end) + markerEnd + ta.value.substring(end);
                var temp = document.createElement('div');
                temp.innerHTML = modifiedText;
                // Find markers
                var walker = document.createTreeWalker(temp, NodeFilter.SHOW_COMMENT, null, false);
                var startNode = null;
                var endNode = null;
                while (walker.nextNode()) {
                    if (walker.currentNode.data === 'NFH_START') startNode = walker.currentNode;
                    if (walker.currentNode.data === 'NFH_END') endNode = walker.currentNode;
                }
                if (!startNode || !endNode) {
                    showDebugIndicator('Failed to locate range for case change.', 'error');
                    return;
                }
                // Create range and get text nodes
                var range = document.createRange();
                range.setStartAfter(startNode);
                range.setEndBefore(endNode);
                var textNodes = [];
                var nodeIterator = document.createNodeIterator(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, null, false);
                var node;
                while (node = nodeIterator.nextNode()) {
                    textNodes.push(node);
                }
                // Apply case change
                textNodes.forEach(function(node) {
                    var text = node.textContent;
                    switch (option) {
                        case 'lower':
                            node.textContent = text.toLowerCase();
                            break;
                        case 'upper':
                            node.textContent = text.toUpperCase();
                            break;
                        case 'toggle':
                            node.textContent = text.split('').map(function(c, i) { return i % 2 === 0 ? c.toUpperCase() : c.toLowerCase(); }).join('');
                            break;
                        case 'capitalize':
                            node.textContent = text.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                            break;
                        case 'sentence':
                            var lowered = text.toLowerCase();
                            var sentences = lowered.split(/(?=[.!?]\s+)/);
                            var capitalized = sentences.map(function(s, i) {
                                if (i === 0 || /[.?!]\s*$/.test(sentences[i - 1])) {
                                    return s.replace(/^\s*(\w)/, function(match, c) { return match.toUpperCase(); });
                                }
                                return s;
                            }).join('');
                            node.textContent = capitalized;
                            break;
                    }
                });
                // Remove markers - FIXED: Collect first to avoid TreeWalker mutation issues
                var markersToRemove = [];
                walker = document.createTreeWalker(temp, NodeFilter.SHOW_COMMENT, null, false);
                while (walker.nextNode()) {
                    if (walker.currentNode.data.includes('NFH')) {
                        markersToRemove.push(walker.currentNode);
                    }
                }
                markersToRemove.forEach(function(node) {
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                });
                // Update textarea
                ta.value = temp.innerHTML;
                ta.selectionStart = start;
                ta.selectionEnd = end;
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                saveState(ta, true); // Immediate save after modification
                if (CONFIG.previewEnabled) debounceUpdatePreview();
                updateCharCount();
                updateUndoRedoUI();
                showDebugIndicator('Case changed to ' + option + (isFull ? ' (full note)' : ' (selection)'), 'success');
                log('Case changed:', { option: option, isFull: isFull, nodesChanged: textNodes.length });
            } catch (err) {
                log('Change case error', err);
                showDebugIndicator('Case change failed; check console.', 'error');
            }
        }
        // Open Resize Settings Modal
        function openSettings() {
            try {
                closeAllPickers();
                closeSnippetsManager();
                closeHistoryModal();
                const dialog = document.querySelector('.note-edit-dialog');
                if (!dialog) {
                    showDebugIndicator('No note dialog open.', 'error');
                    return;
                }
                const overlay = document.createElement('div');
                overlay.id = 'resize-settings-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                resizeSettingsModal = document.createElement('div');
                resizeSettingsModal.id = 'resize-settings-modal';
                resizeSettingsModal.innerHTML = '<h3>Set Default Size</h3>' +
                    '<div id="current-size">Current: 360 x 157</div>' +
                    '<p>Drag the dialog resizers to adjust, then confirm below.</p>' +
                    '<div class="buttons">' +
                    '<button id="confirm-size">Confirm</button>' +
                    '<button id="cancel-size">Cancel</button>' +
                    '</div>' +
                    '<span class="version">v' + CONFIG.version + '</span>';
                document.body.appendChild(resizeSettingsModal);
                const currentSize = resizeSettingsModal.querySelector('#current-size');
                function updateCurrentSize() {
                    const w = parseInt(dialog.style.width) || 360;
                    const h = parseInt(dialog.style.height) || 157;
                    currentSize.textContent = 'Current: ' + w + ' x ' + h;
                }
                updateCurrentSize(); // Initial
                sizeUpdateInterval = setInterval(updateCurrentSize, 200); // Live update
                resizeSettingsModal.querySelector('#confirm-size').addEventListener('click', function() {
                    const w = parseInt(dialog.style.width) || CONFIG.autoResize.defaultWidth;
                    const h = parseInt(dialog.style.height) || CONFIG.autoResize.defaultHeight;
                    if (w < 300 || h < 200) {
                        showDebugIndicator('Size too small; minimum 300x200.', 'error');
                        return;
                    }
                    CONFIG.autoResize.defaultWidth = w;
                    CONFIG.autoResize.defaultHeight = h;
                    localStorage.setItem('nfh_defaultWidth', w.toString());
                    localStorage.setItem('nfh_defaultHeight', h.toString());
                    log('Default size set via modal:', {width: w, height: h});
                    showDebugIndicator('Default size set: ' + w + 'x' + h, 'success');
                    closeResizeSettings();
                    // Re-apply if enabled
                    if (CONFIG.autoResize.enabled) {
                        dialog.dataset.helperResized = 'false';
                        setTimeout(function() { autoResizeDialog(dialog); }, 100);
                    }
                });
                resizeSettingsModal.querySelector('#cancel-size').addEventListener('click', closeResizeSettings);
                overlay.addEventListener('click', closeResizeSettings);
                window.addEventListener('keydown', globalEscHandler);
                log('Resize settings modal opened.');
            } catch (err) {
                log('Resize settings open error', err);
                showDebugIndicator('Resize settings failed; check console.', 'error');
            }
        }
        function closeResizeSettings() {
            window.removeEventListener('keydown', globalEscHandler);
            if (sizeUpdateInterval) {
                clearInterval(sizeUpdateInterval);
                sizeUpdateInterval = null;
            }
            if (resizeSettingsModal) {
                const overlay = document.getElementById('resize-settings-overlay');
                if (overlay) overlay.remove();
                resizeSettingsModal.remove();
                resizeSettingsModal = null;
            }
        }
        // Open Visual History Modal
        function openHistoryModal(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeSnippetsManager();
                const overlay = document.createElement('div');
                overlay.id = 'history-modal-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                historyModal = document.createElement('div');
                historyModal.id = 'history-modal';
                historyModal.innerHTML = '<h3>History Modal</h3>' +
                    '<span class="version">v' + CONFIG.version + '</span>' +
                    '<div class="history-list" id="history-list"></div>' +
                    '<div class="picker-buttons">' +
                    '<button id="history-close">Close</button>' +
                    '</div>';
                document.body.appendChild(historyModal);
                const list = historyModal.querySelector('#history-list');
                // Show last 10 snapshots from current branch
                const recent = history.slice(-10).reverse();
                recent.forEach(function(state, idx) {
                    const relIdx = history.length - recent.length + idx;
                    const item = document.createElement('div');
                    item.className = 'history-item';
                    const timeAgo = ((Date.now() - state.timestamp) / 1000).toFixed(0) + 's ago';
                    const snippet = state.value.substring(0, 50) + (state.value.length > 50 ? '...' : '');
                    const thumb = document.createElement('div');
                    thumb.className = 'history-thumbnail';
                    thumb.innerHTML = state.value.substring(0, 100); // Render snippet as HTML
                    const meta = document.createElement('div');
                    meta.className = 'history-meta';
                    meta.innerHTML = '<strong>Snapshot ' + relIdx + '</strong><br>' + snippet + '<br>' + timeAgo;
                    const buttons = document.createElement('div');
                    buttons.className = 'history-buttons';
                    const jumpBtn = document.createElement('button');
                    jumpBtn.textContent = 'Jump';
                    jumpBtn.addEventListener('click', function() {
                        // Jump to this state
                        historyIndex = relIdx;
                        ta.value = state.value;
                        ta.selectionStart = state.start;
                        ta.selectionEnd = state.end;
                        ta.focus();
                        ta.dispatchEvent(new Event('input', { bubbles: true }));
                        if (CONFIG.previewEnabled) debounceUpdatePreview();
                        updateCharCount();
                        updateUndoRedoUI();
                        showDebugIndicator('Jumped to snapshot ' + relIdx, 'success');
                        closeHistoryModal();
                    });
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Delete this snapshot?')) {
                            history.splice(relIdx, 1);
                            if (historyIndex >= relIdx) historyIndex--;
                            updateUndoRedoUI();
                            closeHistoryModal(); // FIXED: Close before refresh to prevent stacking
                            openHistoryModal(ta); // Refresh
                        }
                    });
                    buttons.appendChild(jumpBtn);
                    buttons.appendChild(deleteBtn);
                    item.appendChild(thumb);
                    item.appendChild(meta);
                    item.appendChild(buttons);
                    list.appendChild(item);
                });
                if (recent.length === 0) {
                    list.innerHTML = '<em>No history yet.</em>';
                }
                historyModal.querySelector('#history-close').addEventListener('click', function() {
                    closeHistoryModal();
                });
                overlay.addEventListener('click', closeHistoryModal);
                window.addEventListener('keydown', globalEscHandler);
                log('History modal opened.');
            } catch (err) {
                log('History modal open error', err);
                showDebugIndicator('History modal failed; check console.', 'error');
            }
        }
        function closeHistoryModal() {
            window.removeEventListener('keydown', globalEscHandler);
            if (historyModal) {
                const overlay = document.getElementById('history-modal-overlay');
                if (overlay) overlay.remove();
                historyModal.remove();
                historyModal = null;
            }
        }
        // Load configs from localStorage
        function loadConfigs() {
            try {
                loadAutoResizeConfig();
                loadSnippets(); // New
                // Load copied format from localStorage for persistence across tabs/sessions/notes
                const savedFormat = localStorage.getItem('nfh_copiedFormat');
                if (savedFormat) {
                    try {
                        copiedFormat = JSON.parse(savedFormat);
                        log('Copied format loaded from localStorage:', copiedFormat);
                        // Update title after load (if button exists)
                        setTimeout(updatePasteButtonTitle, 100);
                    } catch (parseErr) {
                        log('Invalid copied format in localStorage; cleared.', parseErr);
                        localStorage.removeItem('nfh_copiedFormat');
                        copiedFormat = null;
                    }
                }
                // Load preview enabled state
                const savedPreview = localStorage.getItem('nfh_previewEnabled');
                if (savedPreview !== null) {
                    CONFIG.previewEnabled = savedPreview === 'true';
                }
                log('Configs loaded.');
            } catch (err) {
                log('Load configs error', err);
            }
        }
        // Load per-note history from localStorage (merge if diverged)
        function loadNoteHistory(noteId) {
            try {
                const key = 'nfh_history_' + noteId;
                const saved = localStorage.getItem(key);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.branchId === currentBranchId) {
                        history = parsed.history || [];
                        historyIndex = parsed.index || 0;
                        branches = parsed.branches || {};
                        saveCount = parsed.saveCount || 0;
                        log('History loaded for note ' + noteId + ':', {length: history.length});
                    } else {
                        // Merge: Append current if diverged
                        if (confirm('History diverged (different branch/session). Merge changes?')) {
                            const currentState = {value: textarea.value, start: textarea.selectionStart, end: textarea.selectionEnd, timestamp: Date.now()};
                            history.push(currentState);
                            historyIndex++;
                        }
                    }
                }
                updateUndoRedoUI();
            } catch (err) {
                log('Load note history error for ' + noteId, err);
            }
        }
        // Save per-note history to localStorage
        function saveNoteHistory(noteId) {
            try {
                const key = 'nfh_history_' + noteId;
                const toSave = {
                    history: history,
                    index: historyIndex,
                    branchId: currentBranchId,
                    branches: branches,
                    saveCount: saveCount
                };
                localStorage.setItem(key, JSON.stringify(toSave));
            } catch (err) {
                log('Save note history error for ' + noteId, err);
            }
        }
        // Load auto-resize and auto-center config from localStorage (persistent across tabs/sessions)
        function loadAutoResizeConfig() {
            try {
                var savedEnabled = localStorage.getItem('nfh_autoResizeEnabled');
                if (savedEnabled !== null) {
                    CONFIG.autoResize.enabled = savedEnabled === 'true';
                }
                var savedWidth = localStorage.getItem('nfh_defaultWidth');
                if (savedWidth && !isNaN(parseInt(savedWidth))) {
                    CONFIG.autoResize.defaultWidth = parseInt(savedWidth);
                }
                var savedHeight = localStorage.getItem('nfh_defaultHeight');
                if (savedHeight && !isNaN(parseInt(savedHeight))) {
                    CONFIG.autoResize.defaultHeight = parseInt(savedHeight);
                }
                var savedCenterEnabled = localStorage.getItem('nfh_autoCenterEnabled');
                if (savedCenterEnabled !== null) {
                    CONFIG.autoCenter.enabled = savedCenterEnabled === 'true';
                }
                log('Auto-resize and auto-center config loaded from localStorage.', { autoResize: CONFIG.autoResize, autoCenter: CONFIG.autoCenter });
            } catch (err) {
                log('Load auto-resize config error', err);
            }
        }
        // Utility: Dynamic textarea height resize (auto-fit to content, min 60px for 2+ lines visibility)
        function resizeTextarea(ta) {
            try {
                if (!ta) return;
                const minHeight = 60; // Ensure at least 2 lines visible without scroll
                ta.style.height = 'auto';
                const newHeight = Math.max(minHeight, ta.scrollHeight);
                ta.style.height = newHeight + 'px';
                log('Textarea resized to ' + newHeight + 'px (content: ' + ta.scrollHeight + 'px)');
            } catch (err) {
                log('Resize textarea error', err);
            }
        }
        // Utility: Inject styles if not already present - stringified to avoid const issues
        function injectStyles() {
            try {
                if (document.getElementById('note-formatting-styles')) return;
                var style = document.createElement('style');
                style.id = 'note-formatting-styles';
                style.textContent = CONFIG.styles;
                document.head.appendChild(style);
                log('Styles injected.');
            } catch (err) {
                console.error('[NoteFmtHelper] Style injection error:', err);
            }
        }
        // Utility: Create or update toolbar with minimize button (Word-like ribbon with groups)
        function createToolbar() {
            try {
                if (toolbar) return toolbar;
                toolbar = document.createElement('div');
                toolbar.id = CONFIG.toolbarId;
                // Groups for Word-like layout - reorganized per user request, Undo/Redo first
                var groups = {
                    undo: ['undo-btn', 'redo-btn', 'history-modal-btn'],
                    font: ['font-family-dropdown', 'font-size-btn', 'change-case-btn', 'big-btn', 'small-btn', 'sup-btn', 'sub-btn', 'shadow-btn', 'color-btn', 'highlight-btn', 'bold-btn', 'italic-btn', 'underline-btn', 'strikethrough-btn'],
                    paragraph: ['align-left-btn', 'align-center-btn', 'align-right-btn'],
                    insert: ['link-btn', 'tn-btn', 'symbols-btn'],
                    noteUtils: ['clear-btn', 'copy-btn'],
                    copyPaste: ['copy-format-btn', 'paste-format-btn', 'clear-format-btn'],
                    formatting: ['pink-outline-btn', 'double-outline-btn', 'gradient-outline-btn', 'snippets-dropdown', 'manage-snippets-btn'],
                    auto: ['toggle-resize-btn', 'settings-btn', 'toggle-center-btn', 'toggle-preview-btn'],
                    references: ['sfx-btn']
                };
                Object.entries(groups).forEach(function(entry) {
                    var groupName = entry[0];
                    var btnIds = entry[1];
                    var group = document.createElement('div');
                    group.className = 'group';
                    group.title = groupName.charAt(0).toUpperCase() + groupName.slice(1); // e.g., "Font"
                    btnIds.forEach(function(btnId) {
                        var btnConfig = CONFIG.buttons.find(function(b) { return b.id === btnId; });
                        if (btnConfig) {
                            if (btnConfig.type === 'dropdown') {
                                // Create select for dropdown
                                var select = document.createElement('select');
                                select.id = btnConfig.id;
                                select.title = btnConfig.title;
                                if (btnId === 'snippets-dropdown') {
                                    snippetsDropdown = select; // Set reference
                                    updateSnippetsDropdown(); // Initial populate
                                } else {
                                    // Default to first option
                                    select.value = btnConfig.options[0] ? btnConfig.options[0].value : '';
                                    btnConfig.options.forEach(function(opt) {
                                        var option = document.createElement('option');
                                        option.value = opt.value;
                                        option.textContent = opt.label;
                                        option.style.fontFamily = opt.value; // Preview in font style
                                        select.appendChild(option);
                                    });
                                }
                                select.addEventListener('change', function(e) {
                                    var value = e.target.value;
                                    if (textarea && !textarea.disabled) {
                                        if (document.activeElement !== textarea) textarea.focus();
                                        // Pre-action save for branching
                                        saveState(textarea, true);
                                        btnConfig.action(textarea, value);
                                        saveState(textarea, true); // Post-action save
                                        // Reset to first for quick re-use, but keep preview (except snippets)
                                        if (btnId !== 'snippets-dropdown') {
                                            setTimeout(function() {
                                                select.value = btnConfig.options[0] ? btnConfig.options[0].value : '';
                                            }, 0);
                                        }
                                        updateUndoRedoUI();
                                    } else {
                                        log('Dropdown changed but textarea not ready.');
                                    }
                                });
                                group.appendChild(select);
                            } else {
                                // Standard button
                                var button = document.createElement('button');
                                button.id = btnConfig.id;
                                button.type = 'button';
                                button.innerHTML = CONFIG.icons[btnConfig.id] || btnConfig.label;
                                button.title = btnConfig.title;
                                if (btnId === 'paste-format-btn') {
                                    pasteButton = button; // Set reference
                                    updatePasteButtonTitle(); // Initial update
                                } else if (btnId === 'undo-btn') {
                                    undoButton = button;
                                    updateUndoRedoUI();
                                } else if (btnId === 'redo-btn') {
                                    redoButton = button;
                                    updateUndoRedoUI();
                                }
                                button.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (textarea && !textarea.disabled) {
                                        if (document.activeElement !== textarea) textarea.focus();
                                        // Pre-action save for modifying buttons
                                        if (!['undo-btn', 'redo-btn', 'history-modal-btn', 'toggle-resize-btn', 'toggle-center-btn', 'toggle-preview-btn', 'settings-btn', 'copy-btn', 'copy-format-btn', 'clear-format-btn', 'manage-snippets-btn', 'sfx-btn'].includes(btnConfig.id)) {
                                            saveState(textarea, true);
                                        }
                                        btnConfig.action(textarea);
                                        // Post-action save for modifying buttons
                                        if (!['undo-btn', 'redo-btn', 'history-modal-btn', 'toggle-resize-btn', 'toggle-center-btn', 'toggle-preview-btn', 'settings-btn', 'copy-btn', 'copy-format-btn', 'clear-format-btn', 'manage-snippets-btn', 'sfx-btn'].includes(btnConfig.id)) {
                                            saveState(textarea, true);
                                        }
                                        updateUndoRedoUI();
                                        log('Button ' + btnConfig.id + ' clicked.');
                                    } else if (['toggle-resize-btn', 'toggle-center-btn', 'toggle-preview-btn', 'settings-btn', 'copy-btn', 'copy-format-btn', 'paste-format-btn', 'clear-format-btn', 'snippets-dropdown', 'manage-snippets-btn', 'sfx-btn', 'history-modal-btn'].includes(btnConfig.id)) {
                                        // Allow these even without textarea focus (global config)
                                        btnConfig.action(textarea);
                                        log(btnConfig.id + ' button clicked (global).');
                                    } else {
                                        log('Button clicked but textarea not ready.', { focused: document.activeElement });
                                    }
                                });
                                group.appendChild(button);
                            }
                        }
                    });
                    toolbar.appendChild(group);
                });
                // Character count span
                charCountSpan = document.createElement('span');
                charCountSpan.id = 'char-count';
                charCountSpan.textContent = '0 chars';
                toolbar.appendChild(charCountSpan);
                // Minimize button (smaller, optional for buttonset fit)
                var minimizeBtn = document.createElement('button');
                minimizeBtn.id = 'toolbar-minimize';
                minimizeBtn.type = 'button';
                minimizeBtn.innerHTML = '-'; // Plain minus for minimize
                minimizeBtn.title = 'Minimize Formatting Toolbar';
                minimizeBtn.style.fontSize = '0.8em';
                minimizeBtn.style.padding = '0.3em 0.5em';
                minimizeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMinimize();
                });
                toolbar.appendChild(minimizeBtn);
                // Version display (small span, not a button) - in corner as per style
                var versionSpan = document.createElement('span');
                versionSpan.id = 'toolbar-version';
                versionSpan.textContent = 'v' + CONFIG.version;
                versionSpan.className = 'ui-widget';
                versionSpan.title = 'v' + CONFIG.version + ' - Interactive drag-to-set default size modal';
                versionSpan.style.cssText = 'margin-left: 5px; font-size: 0.8em; color: #666; padding: 0.4em 0; align-self: center;';
                toolbar.appendChild(versionSpan);
                // Responsive: Adjust on resize
                window.addEventListener('resize', adjustToolbarLayout);
                adjustToolbarLayout();
                log('Toolbar created as Word-like ribbon with Note Utilities group before Copy/Paste Format, enhanced Live Preview rendering.');
                return toolbar;
            } catch (err) {
                log('Toolbar creation error', err);
                return null;
            }
        }
        // Update character count
        function updateCharCount() {
            if (charCountSpan && textarea) {
                charCountSpan.textContent = textarea.value.length + ' chars';
            }
        }
        // Copy entire note to clipboard
        function copyNote(ta) {
            try {
                navigator.clipboard.writeText(ta.value).then(function() {
                    showDebugIndicator('Note copied to clipboard!', 'success');
                    log('Note copied.');
                }).catch(function(err) {
                    // Fallback
                    var textArea = document.createElement('textarea');
                    textArea.value = ta.value;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showDebugIndicator('Note copied to clipboard!', 'success');
                    log('Note copied (fallback).');
                });
            } catch (err) {
                log('Copy note error', err);
                showDebugIndicator('Copy failed; check permissions.', 'error');
            }
        }
        // DOM-based tag parser for accurate enclosing tags with attributes/nesting
        function getEnclosingTags(text, selStart, selEnd) {
            var temp = document.createElement('div');
            var marker = '<!--NFH_MARKER-->';
            var modifiedText;
            var isFullNote = (selStart === 0 && selEnd === text.length);
            if (isFullNote) {
                // For full note, use regex to extract nested opening prefix and closing suffix
                var fullHtml = temp.innerHTML = text.trim();
                if (fullHtml) {
                    var openMatch = fullHtml.match(/^((?:<[^>\/]+>)+)/);
                    var closeMatch = fullHtml.match(/((?:<\/[^>]+>)+)$/);
                    var openStr = openMatch ? openMatch[1] : '';
                    var closeStr = closeMatch ? closeMatch[1] : '';
                    // Validate: balanced counts and has content
                    var openCount = (openStr.match(/<[^>\/]+>/g) || []).length;
                    var closeCount = (closeStr.match(/<\/[^>]+>/g) || []).length;
                    if (openStr && closeStr && openCount === closeCount && openStr.length + closeStr.length < fullHtml.length) {
                        return {open: openStr, close: closeStr};
                    }
                }
                // Fallback for invalid full note
                return {open: '', close: ''};
            } else {
                // Insert marker for partial selection
                modifiedText = text.substring(0, selStart) + marker + text.substring(selEnd);
                temp.innerHTML = modifiedText;
                // Find marker comment
                var walker = document.createTreeWalker(temp, NodeFilter.SHOW_COMMENT, null, false);
                var markerNode = null;
                while (walker.nextNode()) {
                    if (walker.currentNode.data === 'NFH_MARKER') {
                        markerNode = walker.currentNode;
                        break;
                    }
                }
                if (!markerNode) {
                    return {open: '', close: ''};
                }
                // Get parent chain
                var parents = [];
                var current = markerNode.parentNode;
                while (current && current !== temp) {
                    if (current.nodeType === 1) {
                        parents.push(current);
                    }
                    current = current.parentNode;
                }
                // Build open/close strings - FIXED: reverse for open (outer first), append for close (inner first)
                var openStr = '';
                var closeStr = '';
                var reversedParents = parents.slice().reverse();
                reversedParents.forEach(function(el) {
                    openStr += el.outerHTML.substring(0, el.outerHTML.indexOf('>') + 1);
                });
                parents.forEach(function(el) {
                    closeStr += '</' + el.tagName.toLowerCase() + '>';
                });
                return {open: openStr, close: closeStr};
            }
        }
        // Copy format: Extract enclosing tags from selected text (DOM-based for accuracy)
        function copyFormat(ta) {
            try {
                var start = ta.selectionStart;
                var end = ta.selectionEnd;
                var selected = ta.value.substring(start, end).trim();
                var isFullNote = false;
                if (start === end || !selected) {
                    // Default to entire note
                    selected = ta.value.trim();
                    isFullNote = true;
                    start = 0;
                    end = ta.value.length;
                    showDebugIndicator('No selection; analyzing entire note for enclosing tags.', 'info');
                }
                if (!selected) {
                    showDebugIndicator('Note is empty; nothing to copy.', 'info');
                    return;
                }
                // Use DOM parser for enclosing tags
                var parsed = getEnclosingTags(ta.value, start, end);
                if (parsed.open && parsed.close) {
                    copiedFormat = { open: parsed.open, close: parsed.close };
                    localStorage.setItem('nfh_copiedFormat', JSON.stringify(copiedFormat));
                    updatePasteButtonTitle();
                    var preview = parsed.open.substring(0, 30) + '...' + parsed.close.substring(0, 15) + '...';
                    showDebugIndicator('Copied format: ' + preview + (isFullNote ? ' (full note)' : ' (selection)'), 'success');
                    log('Format copied:', copiedFormat, { isFullNote: isFullNote });
                } else {
                    var msg = isFullNote ? 'No single enclosing tag in full note (multiple top-level?). Select within a tag.' : 'No tags found. Select text within tags.';
                    showDebugIndicator(msg, 'error');
                    log('Copy format failed: no tags', { selected: selected.substring(0, 50) + '...', isFullNote: isFullNote });
                }
            } catch (err) {
                log('Copy format error', err);
                showDebugIndicator('Copy format failed; check console.', 'error');
            }
        }
        // Paste format: Apply copied tags to selection (defaults to full if no sel, fixed wrap)
        function pasteFormat(ta) {
            try {
                if (!copiedFormat) {
                    showDebugIndicator('No format copied yet. Use CF or select snippet first.', 'info');
                    return;
                }
                var origStart = ta.selectionStart;
                var origEnd = ta.selectionEnd;
                var selected = ta.value.substring(origStart, origEnd);
                var isFullNote = false;
                var start = origStart;
                var end = origEnd;
                if (origStart === origEnd || !selected.trim()) {
                    // Default to entire note
                    isFullNote = true;
                    start = 0;
                    end = ta.value.length;
                    selected = ta.value;
                    showDebugIndicator('No selection; pasted format to entire note.', 'info');
                }
                // Fix: Set selection to range before apply
                ta.selectionStart = start;
                ta.selectionEnd = end;
                // Pre-action save
                saveState(ta, true);
                applyFormat(ta, copiedFormat.open, copiedFormat.close);
                // Restore original cursor if not full
                if (!isFullNote) {
                    ta.selectionStart = origStart + copiedFormat.open.length;
                    ta.selectionEnd = origStart + copiedFormat.open.length + (origEnd - origStart);
                }
                updatePasteButtonTitle(); // Refresh in case
                updateUndoRedoUI();
                showDebugIndicator('Pasted format to ' + (isFullNote ? 'entire note' : 'selection') + ': ' + copiedFormat.open.substring(0, 20) + '...', 'success');
                log('Format pasted:', copiedFormat, { isFullNote: isFullNote });
            } catch (err) {
                log('Paste format error', err);
                showDebugIndicator('Paste format failed; check console.', 'error');
            }
        }
        // Clear copied format
        function clearCopiedFormat(ta) {
            try {
                copiedFormat = null;
                localStorage.removeItem('nfh_copiedFormat');
                updatePasteButtonTitle();
                showDebugIndicator('Copied format cleared.', 'success');
                log('Format cleared.');
            } catch (err) {
                log('Clear format error', err);
                showDebugIndicator('Clear format failed; check console.', 'error');
            }
        }
        // Minimize/Maximize functionality for better UX (hides main buttons, including dropdowns)
        function toggleMinimize() {
            try {
                isMinimized = !isMinimized;
                const mainButtons = toolbar ? toolbar.querySelectorAll('button:not(#toolbar-minimize), select') : [];
                const versionSpan = document.getElementById('toolbar-version');
                const minimizeBtn = document.getElementById('toolbar-minimize');
                const charCount = document.getElementById('char-count');
                if (isMinimized) {
                    mainButtons.forEach(function(el) { el.style.display = 'none'; });
                    if (versionSpan) versionSpan.style.display = 'none';
                    if (charCount) charCount.style.display = 'none';
                    if (minimizeBtn) {
                        minimizeBtn.innerHTML = '+'; // Plus for maximize
                        minimizeBtn.title = 'Expand Formatting Toolbar';
                    }
                    log('Formatting toolbar minimized.');
                } else {
                    mainButtons.forEach(function(el) { el.style.display = ''; });
                    if (versionSpan) versionSpan.style.display = '';
                    if (charCount) charCount.style.display = '';
                    if (minimizeBtn) {
                        minimizeBtn.innerHTML = '-';
                        minimizeBtn.title = 'Minimize Formatting Toolbar';
                    }
                    adjustToolbarLayout();
                    log('Formatting toolbar expanded.');
                }
            } catch (err) {
                log('Toggle minimize error', err);
            }
        }
        // Responsive layout adjustment (for buttonset fit) - improved with matchMedia
        function adjustToolbarLayout() {
            try {
                const isMobile = window.matchMedia('(max-width: 800px)').matches;
                if (toolbar && isMobile) {
                    toolbar.style.flexDirection = 'column';
                    toolbar.style.alignItems = 'stretch';
                    toolbar.querySelectorAll('button, select').forEach(function(el) { el.style.minWidth = 'auto'; el.style.fontSize = '10px'; el.style.padding = '3px 4px'; });
                } else {
                    toolbar.style.flexDirection = 'row';
                    toolbar.style.alignItems = 'center';
                    toolbar.querySelectorAll('button, select').forEach(function(el) { el.style.minWidth = 'initial'; el.style.fontSize = ''; el.style.padding = ''; });
                }
            } catch (err) {
                log('Layout adjustment error', err);
            }
        }
        // Center dialog on viewport (with bounds clamping)
        function centerDialog(dialog) {
            try {
                // Settle layout
                setTimeout(function() {
                    const rect = dialog.getBoundingClientRect();
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;
                    let left = (vw - rect.width) / 2;
                    let top = (vh - rect.height) / 2;
                    // Clamp to viewport bounds
                    left = Math.max(0, Math.min(left, vw - rect.width));
                    top = Math.max(0, Math.min(top, vh - rect.height));
                    // Account for scroll
                    dialog.style.left = (left + window.scrollX) + 'px';
                    dialog.style.top = (top + window.scrollY) + 'px';
                    log('Centered dialog at ' + (left + window.scrollX) + 'px, ' + (top + window.scrollY) + 'px');
                }, 0);
            } catch (err) {
                log('Center dialog error', err);
            }
        }
        // Auto-expand dialog to fit ribbon + textarea + preview if enabled
        function autoResizeDialog(dialog) {
            try {
                if (!CONFIG.autoResize.enabled) {
                    log('Auto-resize disabled; skipped.');
                    return;
                }
                if (dialog.dataset.helperResized === 'true') return; // One-time per dialog (reset via settings if needed)
                const tb = dialog.querySelector('#' + CONFIG.toolbarId);
                const ta = dialog.querySelector('textarea');
                const pv = dialog.querySelector('#nfh-preview');
                const content = dialog.querySelector('.ui-dialog-content');
                const titlebar = dialog.querySelector('.ui-dialog-titlebar');
                const buttonpane = dialog.querySelector('.ui-dialog-buttonpane');
                if (!tb || !ta || !content || !titlebar || !buttonpane) {
                    log('Auto-resize skipped: Missing elements.');
                    return;
                }
                // Dynamically fit textarea to its content (now calls dedicated function for consistency)
                resizeTextarea(ta);
                const taHeight = parseInt(ta.style.height) || ta.scrollHeight;
                // Fit preview if enabled and exists
                let pvHeight = 0;
                if (pv && CONFIG.previewEnabled) {
                    updatePreview();
                    pv.style.height = 'auto';
                    pvHeight = pv.scrollHeight;
                    pv.style.height = pvHeight + 'px';
                }
                // Measure fixed parts
                const titleHeight = titlebar.offsetHeight;
                const buttonHeight = buttonpane.offsetHeight;
                const toolbarHeight = tb.offsetHeight;
                const contentPadding = 10; // Estimate for internal padding/margins
                const dialogPadding = 10; // Estimate for dialog outer padding
                // Calculate content height
                const contentHeight = toolbarHeight + taHeight + pvHeight + contentPadding;
                // Calculate full dialog height
                const newHeight = titleHeight + contentHeight + buttonHeight + dialogPadding;
                // Width calculation for better fit
                const contentWidth = Math.max(tb.offsetWidth, ta.offsetWidth) + 10; // Padding for borders/scroll
                const newWidth = Math.max(CONFIG.autoResize.defaultWidth, Math.max(500, contentWidth));
                // Apply resize to dialog
                dialog.style.width = newWidth + 'px';
                dialog.style.height = newHeight + 'px';
                // Sync content dimensions explicitly
                content.style.width = (newWidth - 4) + 'px'; // Account for borders
                content.style.height = contentHeight + 'px';
                log('Auto-resized dialog: ' + newWidth + 'x' + newHeight + 'px (content: ' + contentHeight + 'px, preview: ' + (pvHeight > 0) + ')');
                dialog.dataset.helperResized = 'true';
                // Auto-center if enabled
                if (CONFIG.autoCenter.enabled) {
                    centerDialog(dialog);
                }
                // Checkpoint on resize
                if (textarea) saveState(textarea, true);
            } catch (err) {
                log('Auto-resize error', err);
                // Autonomous: Log but continue; next trigger may succeed
            }
        }
        // Toggle auto-resize enable/disable
        function toggleAutoResize() {
            try {
                CONFIG.autoResize.enabled = !CONFIG.autoResize.enabled;
                localStorage.setItem('nfh_autoResizeEnabled', CONFIG.autoResize.enabled.toString());
                const status = CONFIG.autoResize.enabled ? 'enabled' : 'disabled';
                log('Auto-resize ' + status + '.');
                showDebugIndicator('Auto-resize ' + status + '.', 'info');
                // If enabling, re-apply to current dialog
                if (CONFIG.autoResize.enabled) {
                    const dialog = document.querySelector('.note-edit-dialog');
                    if (dialog) {
                        dialog.dataset.helperResized = 'false';
                        setTimeout(function() { autoResizeDialog(dialog); }, 100);
                    }
                }
            } catch (err) {
                log('Toggle auto-resize error', err);
            }
        }
        // Toggle auto-center enable/disable
        function toggleAutoCenter() {
            try {
                CONFIG.autoCenter.enabled = !CONFIG.autoCenter.enabled;
                localStorage.setItem('nfh_autoCenterEnabled', CONFIG.autoCenter.enabled.toString());
                const status = CONFIG.autoCenter.enabled ? 'enabled' : 'disabled';
                log('Auto-center ' + status + '.');
                showDebugIndicator('Auto-center ' + status + '.', 'info');
                // If enabling, re-apply to current dialog
                if (CONFIG.autoCenter.enabled) {
                    const dialog = document.querySelector('.note-edit-dialog');
                    if (dialog) {
                        centerDialog(dialog);
                    }
                }
            } catch (err) {
                log('Toggle auto-center error', err);
            }
        }
        // Toggle live preview pane
        function togglePreview() {
            try {
                const dialog = document.querySelector('.note-edit-dialog');
                if (!dialog) return;
                textarea = dialog.querySelector('textarea'); // Update global reference
                const content = dialog.querySelector('.ui-dialog-content');
                CONFIG.previewEnabled = !CONFIG.previewEnabled;
                localStorage.setItem('nfh_previewEnabled', CONFIG.previewEnabled.toString());
                if (CONFIG.previewEnabled) {
                    if (!previewDiv) {
                        injectPreview(dialog);
                    } else {
                        previewDiv.classList.add('show');
                        updatePreview();
                    }
                    if (textarea) {
                        textarea.addEventListener('input', debounceUpdatePreview);
                    }
                } else {
                    if (previewDiv) {
                        previewDiv.classList.remove('show');
                    }
                    if (textarea) {
                        textarea.removeEventListener('input', debounceUpdatePreview);
                    }
                }
                const status = CONFIG.previewEnabled ? 'enabled' : 'disabled';
                log('Live preview ' + status + '.');
                showDebugIndicator('Live preview ' + status + '.', 'info');
                // Re-resize if enabled
                dialog.dataset.helperResized = 'false';
                setTimeout(function() { autoResizeDialog(dialog); }, 100);
            } catch (err) {
                log('Toggle preview error', err);
            }
        }
        // Debounced preview update
        function debounceUpdatePreview() {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updatePreview, CONFIG.debounceDelay);
        }
        // Update preview div with sanitized HTML (fixed rendering, no syntax highlight)
        function updatePreview() {
            try {
                if (!previewDiv || !textarea) return;
                var html = textarea.value;
                // Minimal sanitize: Remove <script> to prevent XSS (notes shouldn't have it)
                html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                // Render as HTML
                previewDiv.innerHTML = html;
                log('Preview updated (rendered HTML).');
            } catch (err) {
                log('Preview update error', err);
                previewDiv.innerHTML = 'Preview error: Invalid HTML.';
            }
        }
        // Inject preview div below textarea
        function injectPreview(dialog) {
            try {
                const content = dialog.querySelector('.ui-dialog-content');
                if (previewDiv && previewDiv.parentNode !== content) {
                    if (previewDiv.parentNode) previewDiv.remove();
                    previewDiv = null;
                }
                if (previewDiv) return;
                previewDiv = document.createElement('div');
                previewDiv.id = 'nfh-preview';
                if (CONFIG.previewEnabled) previewDiv.classList.add('show');
                content.appendChild(previewDiv);
                if (CONFIG.previewEnabled && textarea) {
                    updatePreview();
                    textarea.addEventListener('input', debounceUpdatePreview);
                }
                log('Preview pane injected (default enabled).');
            } catch (err) {
                log('Inject preview error', err);
            }
        }
        // Unified apply format function for tags, styles, aligns (replaces applyStyle/applyAlign)
        function applyFormat(ta, openTag, closeTag) {
            try {
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const text = ta.value;
                const selected = text.substring(start, end);
                const before = text.substring(0, start);
                const after = text.substring(end);
                var newText;
                var cursorStart, cursorEnd;
                if (selected) {
                    newText = before + openTag + selected + closeTag + after;
                    cursorStart = start + openTag.length;
                    cursorEnd = cursorStart + selected.length;
                } else {
                    const placeholder = openTag + 'text' + closeTag;
                    newText = before + placeholder + after;
                    cursorStart = start + openTag.length;
                    cursorEnd = cursorStart + 4; // Position inside 'text'
                }
                ta.value = newText;
                ta.selectionStart = cursorStart;
                ta.selectionEnd = cursorEnd;
                ta.focus();
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                // Update preview if enabled
                if (CONFIG.previewEnabled) debounceUpdatePreview();
                updateCharCount();
                log('Applied format: ' + openTag.substring(0, 20) + '...');
            } catch (err) {
                log('Apply format error', err);
            }
        }
        // Prompt for font size and apply via applyFormat
        function promptFontSize(ta) {
            try {
                const size = prompt('Enter font size (e.g., 18px, 1.5em, large):', '16px');
                if (!size) return;
                const styleStr = 'font-size: ' + size + ';';
                const openTag = '<span style="' + styleStr + '">';
                // Pre-action save
                saveState(ta, true);
                applyFormat(ta, openTag, '</span>');
                updateUndoRedoUI();
            } catch (err) {
                log('Font size prompt error', err);
            }
        }
        // Open color picker for text color or highlight
        function openColorPicker(ta, type) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                // Overlay
                const overlay = document.createElement('div');
                overlay.id = 'color-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                // Picker dialog
                colorPicker = document.createElement('div');
                colorPicker.id = 'color-picker';
                var titleText = (type === 'background-color') ? 'Text Highlight' : 'Text Color';
                colorPicker.innerHTML = '<h3>' + titleText + '</h3>' +
                    '<div class="palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="r-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="g-slider" min="0" max="255" value="0" />' +
                    '<input type="range" id="b-slider" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="r-input" min="0" max="255" value="255" />' +
                    '<span>G:</span><input type="number" id="g-input" min="0" max="255" value="0" />' +
                    '<span>B:</span><input type="number" id="b-input" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="hex-input" value="#FF0000" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Brightness (Alpha 0-1)</label>' +
                    '<input type="range" id="alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="alpha-value">1.00</span>' +
                    '</div>' +
                    '<div id="color-preview" style="background-color: rgb(255,0,0);"></div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-ok">OK</button>' +
                    '<button id="picker-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(colorPicker);
                // Palette, OK, cancel, events (same as before)
                const palette = colorPicker.querySelector('.palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        colorPicker.querySelector('#r-slider').value = rgb.r;
                        colorPicker.querySelector('#g-slider').value = rgb.g;
                        colorPicker.querySelector('#b-slider').value = rgb.b;
                        colorPicker.querySelector('#r-input').value = rgb.r;
                        colorPicker.querySelector('#g-input').value = rgb.g;
                        colorPicker.querySelector('#b-input').value = rgb.b;
                        colorPicker.querySelector('#hex-input').value = color;
                        updateColor(colorPicker);
                    });
                    palette.appendChild(btn);
                });
                colorPicker.querySelector('#picker-ok').addEventListener('click', function(e) {
                    const r = colorPicker.querySelector('#r-slider').value;
                    const g = colorPicker.querySelector('#g-slider').value;
                    const b = colorPicker.querySelector('#b-slider').value;
                    const alpha = colorPicker.querySelector('#alpha-slider').value;
                    const colorValue = (alpha < 1) ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')' : 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    const styleStr = type + ': ' + colorValue + ';';
                    const openTag = '<span style="' + styleStr + '">';
                    // Pre-action save
                    saveState(ta, true);
                    applyFormat(ta, openTag, '</span>');
                    updateUndoRedoUI();
                    closeColorPicker();
                });
                colorPicker.querySelector('#picker-cancel').addEventListener('click', closeColorPicker);
                overlay.addEventListener('click', closeColorPicker);
                window.addEventListener('keydown', globalEscHandler);
                // Eyedropper
                const eyedropperBtn = colorPicker.querySelector('#eyedropper');
                addColorZillaLink(eyedropperBtn);
                if (eyedropperBtn && 'eyedropper' in navigator) {
                    eyedropperBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                colorPicker.querySelector('#r-slider').value = r;
                                colorPicker.querySelector('#g-slider').value = g;
                                colorPicker.querySelector('#b-slider').value = b;
                                colorPicker.querySelector('#r-input').value = r;
                                colorPicker.querySelector('#g-input').value = g;
                                colorPicker.querySelector('#b-input').value = b;
                                colorPicker.querySelector('#hex-input').value = hex;
                                colorPicker.querySelector('#alpha-slider').value = alpha;
                                colorPicker.querySelector('#alpha-value').textContent = alpha.toFixed(2);
                                updateColor(colorPicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperBtn) {
                    eyedropperBtn.disabled = true;
                    eyedropperBtn.title = 'EyeDropper API not supported in this browser';
                }
                function updateColor(picker) {
                    const r = picker.querySelector('#r-slider').value;
                    const g = picker.querySelector('#g-slider').value;
                    const b = picker.querySelector('#b-slider').value;
                    const alpha = picker.querySelector('#alpha-slider').value;
                    picker.querySelector('#alpha-value').textContent = alpha;
                    const color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
                    picker.querySelector('#color-preview').style.backgroundColor = color;
                    picker.querySelector('#r-input').value = r;
                    picker.querySelector('#g-input').value = g;
                    picker.querySelector('#b-input').value = b;
                    const hex = '#' + Math.round(r).toString(16).padStart(2, '0') + Math.round(g).toString(16).padStart(2, '0') + Math.round(b).toString(16).padStart(2, '0');
                    picker.querySelector('#hex-input').value = hex.toUpperCase();
                }
                function updateSlider(channel, picker) {
                    const input = picker.querySelector('#' + channel + '-input').value;
                    picker.querySelector('#' + channel + '-slider').value = input;
                    updateColor(picker);
                }
                colorPicker.addEventListener('input', function(e) {
                    if (e.target.matches('input[type="range"], input[type="number"]')) {
                        if (e.target.id.includes('input') && e.target.type === 'number') {
                            const channel = e.target.id.split('-')[0];
                            updateSlider(channel, colorPicker);
                        } else {
                            updateColor(colorPicker);
                        }
                    } else if (e.target.id === 'hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            colorPicker.querySelector('#r-slider').value = rgb.r;
                            colorPicker.querySelector('#g-slider').value = rgb.g;
                            colorPicker.querySelector('#b-slider').value = rgb.b;
                            colorPicker.querySelector('#r-input').value = rgb.r;
                            colorPicker.querySelector('#g-input').value = rgb.g;
                            colorPicker.querySelector('#b-input').value = rgb.b;
                            updateColor(colorPicker);
                        }
                    }
                });
                updateColor(colorPicker);
                function closeColorPicker() {
                    window.removeEventListener('keydown', globalEscHandler);
                    if (colorPicker) colorPicker.remove();
                    const overlay = document.getElementById('color-picker-overlay');
                    if (overlay) overlay.remove();
                    colorPicker = null;
                }
            } catch (err) {
                log('Color picker open error', err);
            }
        }
        // Close all open pickers
        function closeAllPickers() {
            closeColorPicker();
            closeShadowPicker();
            closeSymbolsPicker();
            closePinkOutlinePicker();
            closeDoubleOutlinePicker();
            closeGradientOutlinePicker();
            closeSnippetsManager();
            closeChangeCaseModal();
            window.removeEventListener('keydown', globalEscHandler);
        }
        function closeColorPicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (colorPicker) {
                const overlay = document.getElementById('color-picker-overlay');
                if (overlay) overlay.remove();
                colorPicker.remove();
                colorPicker = null;
            }
        }
        function closeShadowPicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (shadowPicker) {
                const overlay = document.getElementById('shadow-picker-overlay');
                if (overlay) overlay.remove();
                shadowPicker.remove();
                shadowPicker = null;
            }
        }
        function closeSymbolsPicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (symbolPicker) {
                const overlay = document.getElementById('symbol-picker-overlay');
                if (overlay) overlay.remove();
                symbolPicker.remove();
                symbolPicker = null;
            }
        }
        function closePinkOutlinePicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (pinkOutlinePicker) {
                const overlay = document.getElementById('pink-outline-picker-overlay');
                if (overlay) overlay.remove();
                pinkOutlinePicker.remove();
                pinkOutlinePicker = null;
            }
        }
        function closeDoubleOutlinePicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (doubleOutlinePicker) {
                const overlay = document.getElementById('double-outline-picker-overlay');
                if (overlay) overlay.remove();
                doubleOutlinePicker.remove();
                doubleOutlinePicker = null;
            }
        }
        function closeGradientOutlinePicker() {
            window.removeEventListener('keydown', globalEscHandler);
            if (gradientOutlinePicker) {
                const overlay = document.getElementById('gradient-outline-picker-overlay');
                if (overlay) overlay.remove();
                gradientOutlinePicker.remove();
                gradientOutlinePicker = null;
            }
        }
        // Open shadow picker for text shadow (outlines/drop shadows)
        function openShadowPicker(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                // Overlay and HTML (same as before, added eyedropper)
                const overlay = document.createElement('div');
                overlay.id = 'shadow-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                shadowPicker = document.createElement('div');
                shadowPicker.id = 'shadow-picker';
                shadowPicker.innerHTML = '<h3>Text Shadow</h3>' +
                    '<div class="preset-buttons">' +
                    '<button id="preset-drop">Drop Shadow</button>' +
                    '<button id="preset-outline">Outline</button>' +
                    '</div>' +
                    '<div class="shadow-section">' +
                    '<div class="shadow-inputs">' +
                    '<label>X Offset (px): <input type="number" id="x-offset" value="1" step="0.1" min="-10" max="10" aria-label="X offset" /></label>' +
                    '<label>Y Offset (px): <input type="number" id="y-offset" value="1" step="0.1" min="-10" max="10" aria-label="Y offset" /></label>' +
                    '<label>Blur Radius (px): <input type="number" id="blur" value="0" step="0.1" min="0" max="20" aria-label="Blur radius" /></label>' +
                    '<label><input type="checkbox" id="outline-mode" /> Outline Mode (4 shadows around text)</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Shadow Color</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="r-slider" min="0" max="255" value="0" />' +
                    '<input type="range" id="g-slider" min="0" max="255" value="0" />' +
                    '<input type="range" id="b-slider" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="r-input" min="0" max="255" value="0" />' +
                    '<span>G:</span><input type="number" id="g-input" min="0" max="255" value="0" />' +
                    '<span>B:</span><input type="number" id="b-input" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="hex-input" value="#000000" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-shadow" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Brightness (Alpha 0-1)</label>' +
                    '<input type="range" id="alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="alpha-value">1.00</span>' +
                    '</div>' +
                    '<div id="shadow-preview" style="background-color: #333; color: #fff; text-shadow: 1px 1px 0 #000;">Preview</div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-ok">OK</button>' +
                    '<button id="picker-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(shadowPicker);
                // Palette, presets, listeners (same as v1.41, added eyedropper)
                const palette = shadowPicker.querySelector('.palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        shadowPicker.querySelector('#r-slider').value = rgb.r;
                        shadowPicker.querySelector('#g-slider').value = rgb.g;
                        shadowPicker.querySelector('#b-slider').value = rgb.b;
                        shadowPicker.querySelector('#r-input').value = rgb.r;
                        shadowPicker.querySelector('#g-input').value = rgb.g;
                        shadowPicker.querySelector('#b-input').value = rgb.b;
                        shadowPicker.querySelector('#hex-input').value = color;
                        updateShadowPreview(shadowPicker);
                    });
                    palette.appendChild(btn);
                });
                shadowPicker.querySelector('#preset-drop').addEventListener('click', function() {
                    shadowPicker.querySelector('#x-offset').value = 2;
                    shadowPicker.querySelector('#y-offset').value = 2;
                    shadowPicker.querySelector('#blur').value = 2;
                    shadowPicker.querySelector('#outline-mode').checked = false;
                    shadowPicker.querySelector('#r-slider').value = 0;
                    shadowPicker.querySelector('#g-slider').value = 0;
                    shadowPicker.querySelector('#b-slider').value = 0;
                    shadowPicker.querySelector('#r-input').value = 0;
                    shadowPicker.querySelector('#g-input').value = 0;
                    shadowPicker.querySelector('#b-input').value = 0;
                    shadowPicker.querySelector('#hex-input').value = '#000000';
                    updateShadowPreview(shadowPicker);
                });
                shadowPicker.querySelector('#preset-outline').addEventListener('click', function() {
                    shadowPicker.querySelector('#x-offset').value = 1;
                    shadowPicker.querySelector('#y-offset').value = 1;
                    shadowPicker.querySelector('#blur').value = 0;
                    shadowPicker.querySelector('#outline-mode').checked = true;
                    shadowPicker.querySelector('#r-slider').value = 0;
                    shadowPicker.querySelector('#g-slider').value = 0;
                    shadowPicker.querySelector('#b-slider').value = 0;
                    shadowPicker.querySelector('#r-input').value = 0;
                    shadowPicker.querySelector('#g-input').value = 0;
                    shadowPicker.querySelector('#b-input').value = 0;
                    shadowPicker.querySelector('#hex-input').value = '#000000';
                    updateShadowPreview(shadowPicker);
                });
                shadowPicker.querySelector('#outline-mode').addEventListener('change', function(e) {
                    updateShadowPreview(shadowPicker);
                });
                shadowPicker.querySelector('#picker-ok').addEventListener('click', function(e) {
                    var x = parseFloat(shadowPicker.querySelector('#x-offset').value) || 1;
                    var y = parseFloat(shadowPicker.querySelector('#y-offset').value) || 1;
                    var blur = parseFloat(shadowPicker.querySelector('#blur').value) || 0;
                    x = Math.max(-10, Math.min(10, x)); // Clamp
                    y = Math.max(-10, Math.min(10, y));
                    blur = Math.max(0, Math.min(20, blur));
                    const r = shadowPicker.querySelector('#r-slider').value;
                    const g = shadowPicker.querySelector('#g-slider').value;
                    const b = shadowPicker.querySelector('#b-slider').value;
                    const alpha = shadowPicker.querySelector('#alpha-slider').value;
                    const colorValue = (alpha < 1) ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')' : 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    var shadowRule;
                    const absX = Math.abs(x);
                    const absY = Math.abs(y);
                    if (shadowPicker.querySelector('#outline-mode').checked) {
                        shadowRule = '-' + absX + 'px -' + absY + 'px ' + blur + 'px ' + colorValue + ', ' + absX + 'px -' + absY + 'px ' + blur + 'px ' + colorValue + ', -' + absX + 'px ' + absY + 'px ' + blur + 'px ' + colorValue + ', ' + absX + 'px ' + absY + 'px ' + blur + 'px ' + colorValue;
                    } else {
                        shadowRule = x + 'px ' + y + 'px ' + blur + 'px ' + colorValue;
                    }
                    const styleStr = 'text-shadow: ' + shadowRule + ';';
                    const openTag = '<span style="' + styleStr + '">';
                    // Pre-action save
                    saveState(ta, true);
                    applyFormat(ta, openTag, '</span>');
                    updateUndoRedoUI();
                    closeShadowPicker();
                });
                shadowPicker.querySelector('#picker-cancel').addEventListener('click', closeShadowPicker);
                overlay.addEventListener('click', closeShadowPicker);
                window.addEventListener('keydown', globalEscHandler);
                // Eyedropper for shadow
                const eyedropperShadowBtn = shadowPicker.querySelector('#eyedropper-shadow');
                addColorZillaLink(eyedropperShadowBtn);
                if (eyedropperShadowBtn && 'eyedropper' in navigator) {
                    eyedropperShadowBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                shadowPicker.querySelector('#r-slider').value = r;
                                shadowPicker.querySelector('#g-slider').value = g;
                                shadowPicker.querySelector('#b-slider').value = b;
                                shadowPicker.querySelector('#r-input').value = r;
                                shadowPicker.querySelector('#g-input').value = g;
                                shadowPicker.querySelector('#b-input').value = b;
                                shadowPicker.querySelector('#hex-input').value = hex;
                                shadowPicker.querySelector('#alpha-slider').value = alpha;
                                shadowPicker.querySelector('#alpha-value').textContent = alpha.toFixed(2);
                                updateShadowPreview(shadowPicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperShadowBtn) {
                    eyedropperShadowBtn.disabled = true;
                    eyedropperShadowBtn.title = 'EyeDropper API not supported in this browser';
                }
                function updateShadowPreview(picker) {
                    const x = parseFloat(picker.querySelector('#x-offset').value) || 1;
                    const y = parseFloat(picker.querySelector('#y-offset').value) || 1;
                    const blur = parseFloat(picker.querySelector('#blur').value) || 0;
                    const r = picker.querySelector('#r-slider').value;
                    const g = picker.querySelector('#g-slider').value;
                    const b = picker.querySelector('#b-slider').value;
                    const alpha = picker.querySelector('#alpha-slider').value;
                    const colorValue = (alpha < 1) ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')' : 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    var shadowRule;
                    const absX = Math.abs(x);
                    const absY = Math.abs(y);
                    if (picker.querySelector('#outline-mode').checked) {
                        shadowRule = '-' + absX + 'px -' + absY + 'px ' + blur + 'px ' + colorValue + ', ' + absX + 'px -' + absY + 'px ' + blur + 'px ' + colorValue + ', -' + absX + 'px ' + absY + 'px ' + blur + 'px ' + colorValue + ', ' + absX + 'px ' + absY + 'px ' + blur + 'px ' + colorValue;
                    } else {
                        shadowRule = x + 'px ' + y + 'px ' + blur + 'px ' + colorValue;
                    }
                    picker.querySelector('#shadow-preview').style.textShadow = shadowRule;
                    picker.querySelector('#r-input').value = r;
                    picker.querySelector('#g-input').value = g;
                    picker.querySelector('#b-input').value = b;
                    const hex = '#' + Math.round(r).toString(16).padStart(2, '0') + Math.round(g).toString(16).padStart(2, '0') + Math.round(b).toString(16).padStart(2, '0');
                    picker.querySelector('#hex-input').value = hex.toUpperCase();
                    picker.querySelector('#alpha-value').textContent = alpha;
                }
                function updateSlider(channel, picker) {
                    const input = picker.querySelector('#' + channel + '-input').value;
                    picker.querySelector('#' + channel + '-slider').value = input;
                    updateShadowPreview(picker);
                }
                shadowPicker.addEventListener('input', function(e) {
                    if (e.target.matches('#x-offset, #y-offset, #blur')) {
                        updateShadowPreview(shadowPicker);
                    } else if (e.target.matches('input[type="range"], input[type="number"]')) {
                        if (e.target.id.includes('input') && e.target.type === 'number') {
                            const channel = e.target.id.split('-')[0];
                            updateSlider(channel, shadowPicker);
                        } else {
                            updateShadowPreview(shadowPicker);
                        }
                    } else if (e.target.id === 'hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            shadowPicker.querySelector('#r-slider').value = rgb.r;
                            shadowPicker.querySelector('#g-slider').value = rgb.g;
                            shadowPicker.querySelector('#b-slider').value = rgb.b;
                            shadowPicker.querySelector('#r-input').value = rgb.r;
                            shadowPicker.querySelector('#g-input').value = rgb.g;
                            shadowPicker.querySelector('#b-input').value = rgb.b;
                            updateShadowPreview(shadowPicker);
                        }
                    }
                });
                updateShadowPreview(shadowPicker);
            } catch (err) {
                log('Shadow picker open error', err);
                showDebugIndicator('Shadow picker failed; check console.', 'error');
            }
        }
        // Open pink outline picker - added eyedropper for text and outline
        function openPinkOutlinePicker(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'pink-outline-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                pinkOutlinePicker = document.createElement('div');
                pinkOutlinePicker.id = 'pink-outline-picker';
                pinkOutlinePicker.innerHTML = '<h3>Pink Outline Template</h3>' +
                    '<div class="outline-section">' +
                    '<div class="outline-inputs">' +
                    '<label>Font Family: <select id="font-family-select"><option value="print">Print (Kalam)</option><option value="serif">Serif</option><option value="sans-serif">Sans Serif</option><option value="monospace">Monospace</option><option value="cursive">Cursive</option><option value="fantasy">Fantasy</option><option value="comic">Comic Sans MS</option><option value="narrow">Arial Narrow</option><option value="mono">Plex Mono</option><option value="slab sans">Impact</option><option value="slab serif">Rockwell</option><option value="formal serif">Formal Serif (Lora)</option><option value="formal cursive">Formal Cursive</option><option value="hand">Hand (Indie Flower)</option><option value="childlike">Childlike (Giselle)</option><option value="blackletter">Blackletter</option><option value="scary">Scary (Anarchy)</option></select></label>' +
                    '<label>Font Size (px): <input type="number" id="font-size" value="30" min="10" max="100" step="1" /></label>' +
                    '<label><input type="checkbox" id="font-bold" checked /> Bold</label>' +
                    '<label>Outline Offset (px): <input type="number" id="offset" value="2" min="0" max="10" step="0.1" /></label>' +
                    '<label>Blur Radius (px): <input type="number" id="blur" value="5" min="0" max="20" step="0.1" /></label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-section">' +
                    '<h4>Text Color</h4>' +
                    '<div class="palette" id="text-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="text-r-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="text-g-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="text-b-slider" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="text-r-input" min="0" max="255" value="255" />' +
                    '<span>G:</span><input type="number" id="text-g-input" min="0" max="255" value="255" />' +
                    '<span>B:</span><input type="number" id="text-b-input" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="text-hex-input" value="#FFFFFF" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-text" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="text-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="text-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-section">' +
                    '<h4>Outline Color</h4>' +
                    '<div class="palette" id="outline-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="outline-r-slider" min="0" max="255" value="235" />' +
                    '<input type="range" id="outline-g-slider" min="0" max="255" value="115" />' +
                    '<input type="range" id="outline-b-slider" min="0" max="255" value="161" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="outline-r-input" min="0" max="255" value="235" />' +
                    '<span>G:</span><input type="number" id="outline-g-input" min="0" max="255" value="115" />' +
                    '<span>B:</span><input type="number" id="outline-b-input" min="0" max="255" value="161" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="outline-hex-input" value="#EB73A1" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-outline" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="outline-alpha-slider" min="0" max="1" step="0.01" value="0.8" />' +
                    '<span id="outline-alpha-value">0.80</span>' +
                    '</div>' +
                    '</div>' +
                    '<div id="outline-preview">Preview</div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-ok">OK</button>' +
                    '<button id="picker-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(pinkOutlinePicker);
                // Text palette
                const textPalette = pinkOutlinePicker.querySelector('#text-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        pinkOutlinePicker.querySelector('#text-r-slider').value = rgb.r;
                        pinkOutlinePicker.querySelector('#text-g-slider').value = rgb.g;
                        pinkOutlinePicker.querySelector('#text-b-slider').value = rgb.b;
                        pinkOutlinePicker.querySelector('#text-r-input').value = rgb.r;
                        pinkOutlinePicker.querySelector('#text-g-input').value = rgb.g;
                        pinkOutlinePicker.querySelector('#text-b-input').value = rgb.b;
                        pinkOutlinePicker.querySelector('#text-hex-input').value = color;
                        pinkOutlinePicker.querySelector('#text-alpha-slider').value = 1;
                        updateOutlinePreview(pinkOutlinePicker);
                    });
                    textPalette.appendChild(btn);
                });
                // Outline palette
                const outlinePalette = pinkOutlinePicker.querySelector('#outline-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        pinkOutlinePicker.querySelector('#outline-r-slider').value = rgb.r;
                        pinkOutlinePicker.querySelector('#outline-g-slider').value = rgb.g;
                        pinkOutlinePicker.querySelector('#outline-b-slider').value = rgb.b;
                        pinkOutlinePicker.querySelector('#outline-r-input').value = rgb.r;
                        pinkOutlinePicker.querySelector('#outline-g-input').value = rgb.g;
                        pinkOutlinePicker.querySelector('#outline-b-input').value = rgb.b;
                        pinkOutlinePicker.querySelector('#outline-hex-input').value = color;
                        pinkOutlinePicker.querySelector('#outline-alpha-slider').value = 0.8;
                        updateOutlinePreview(pinkOutlinePicker);
                    });
                    outlinePalette.appendChild(btn);
                });
                pinkOutlinePicker.querySelector('#picker-ok').addEventListener('click', function(e) {
                    const fontFamily = pinkOutlinePicker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = pinkOutlinePicker.querySelector('#font-size').value + 'px';
                    var styleStr = 'font-size: ' + fontSize + '; font-family: ' + fontFamilyStr + '; ';
                    const bold = pinkOutlinePicker.querySelector('#font-bold').checked;
                    if (bold) styleStr += 'font-weight: bold; ';
                    const offset = parseFloat(pinkOutlinePicker.querySelector('#offset').value) || 2;
                    const blur = parseFloat(pinkOutlinePicker.querySelector('#blur').value) || 5;
                    const textR = pinkOutlinePicker.querySelector('#text-r-slider').value;
                    const textG = pinkOutlinePicker.querySelector('#text-g-slider').value;
                    const textB = pinkOutlinePicker.querySelector('#text-b-slider').value;
                    const textAlpha = pinkOutlinePicker.querySelector('#text-alpha-slider').value;
                    const outlineR = pinkOutlinePicker.querySelector('#outline-r-slider').value;
                    const outlineG = pinkOutlinePicker.querySelector('#outline-g-slider').value;
                    const outlineB = pinkOutlinePicker.querySelector('#outline-b-slider').value;
                    const outlineAlpha = pinkOutlinePicker.querySelector('#outline-alpha-slider').value;
                    const textColor = (textAlpha < 1) ? 'rgba(' + textR + ', ' + textG + ', ' + textB + ', ' + textAlpha + ')' : 'rgb(' + textR + ', ' + textG + ', ' + textB + ')';
                    const outlineColor = (outlineAlpha < 1) ? 'rgba(' + outlineR + ', ' + outlineG + ', ' + outlineB + ', ' + outlineAlpha + ')' : 'rgb(' + outlineR + ', ' + outlineG + ', ' + outlineB + ')';
                    styleStr += 'color: ' + textColor + '; ';
                    const absOffset = Math.abs(offset);
                    var shadowRule = '-' + absOffset + 'px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '-' + absOffset + 'px 0px ' + blur + 'px ' + outlineColor + ', ' +
                                     '-' + absOffset + 'px ' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '0px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '0px ' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px 0px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px ' + absOffset + 'px ' + blur + 'px ' + outlineColor;
                    styleStr += 'text-shadow: ' + shadowRule + ';';
                    var openTag = '<span style="' + styleStr + '">';
                    // Pre-action save
                    saveState(ta, true);
                    applyFormat(ta, openTag, '</span>');
                    updateUndoRedoUI();
                    closePinkOutlinePicker();
                });
                pinkOutlinePicker.querySelector('#picker-cancel').addEventListener('click', closePinkOutlinePicker);
                overlay.addEventListener('click', closePinkOutlinePicker);
                window.addEventListener('keydown', globalEscHandler);
                // Eyedropper for text
                const eyedropperTextBtn = pinkOutlinePicker.querySelector('#eyedropper-text');
                addColorZillaLink(eyedropperTextBtn);
                if (eyedropperTextBtn && 'eyedropper' in navigator) {
                    eyedropperTextBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                pinkOutlinePicker.querySelector('#text-r-slider').value = r;
                                pinkOutlinePicker.querySelector('#text-g-slider').value = g;
                                pinkOutlinePicker.querySelector('#text-b-slider').value = b;
                                pinkOutlinePicker.querySelector('#text-r-input').value = r;
                                pinkOutlinePicker.querySelector('#text-g-input').value = g;
                                pinkOutlinePicker.querySelector('#text-b-input').value = b;
                                pinkOutlinePicker.querySelector('#text-hex-input').value = hex;
                                pinkOutlinePicker.querySelector('#text-alpha-slider').value = alpha;
                                pinkOutlinePicker.querySelector('#text-alpha-value').textContent = alpha.toFixed(2);
                                updateOutlinePreview(pinkOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperTextBtn) {
                    eyedropperTextBtn.disabled = true;
                    eyedropperTextBtn.title = 'EyeDropper API not supported in this browser';
                }
                // Eyedropper for outline
                const eyedropperOutlineBtn = pinkOutlinePicker.querySelector('#eyedropper-outline');
                addColorZillaLink(eyedropperOutlineBtn);
                if (eyedropperOutlineBtn && 'eyedropper' in navigator) {
                    eyedropperOutlineBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                pinkOutlinePicker.querySelector('#outline-r-slider').value = r;
                                pinkOutlinePicker.querySelector('#outline-g-slider').value = g;
                                pinkOutlinePicker.querySelector('#outline-b-slider').value = b;
                                pinkOutlinePicker.querySelector('#outline-r-input').value = r;
                                pinkOutlinePicker.querySelector('#outline-g-input').value = g;
                                pinkOutlinePicker.querySelector('#outline-b-input').value = b;
                                pinkOutlinePicker.querySelector('#outline-hex-input').value = hex;
                                pinkOutlinePicker.querySelector('#outline-alpha-slider').value = alpha;
                                pinkOutlinePicker.querySelector('#outline-alpha-value').textContent = alpha.toFixed(2);
                                updateOutlinePreview(pinkOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperOutlineBtn) {
                    eyedropperOutlineBtn.disabled = true;
                    eyedropperOutlineBtn.title = 'EyeDropper API not supported in this browser';
                }
                function updateOutlinePreview(picker) {
                    const fontFamily = picker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = picker.querySelector('#font-size').value + 'px';
                    const bold = picker.querySelector('#font-bold').checked ? 'bold' : 'normal';
                    const offset = parseFloat(picker.querySelector('#offset').value) || 2;
                    const blur = parseFloat(picker.querySelector('#blur').value) || 5;
                    const textR = picker.querySelector('#text-r-slider').value;
                    const textG = picker.querySelector('#text-g-slider').value;
                    const textB = picker.querySelector('#text-b-slider').value;
                    const textAlpha = picker.querySelector('#text-alpha-slider').value;
                    const outlineR = picker.querySelector('#outline-r-slider').value;
                    const outlineG = picker.querySelector('#outline-g-slider').value;
                    const outlineB = picker.querySelector('#outline-b-slider').value;
                    const outlineAlpha = picker.querySelector('#outline-alpha-slider').value;
                    const textColor = (textAlpha < 1) ? 'rgba(' + textR + ', ' + textG + ', ' + textB + ', ' + textAlpha + ')' : 'rgb(' + textR + ', ' + textG + ', ' + textB + ')';
                    const outlineColor = (outlineAlpha < 1) ? 'rgba(' + outlineR + ', ' + outlineG + ', ' + outlineB + ', ' + outlineAlpha + ')' : 'rgb(' + outlineR + ', ' + outlineG + ', ' + outlineB + ')';
                    const absOffset = Math.abs(offset);
                    var shadowRule = '-' + absOffset + 'px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '-' + absOffset + 'px 0px ' + blur + 'px ' + outlineColor + ', ' +
                                     '-' + absOffset + 'px ' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '0px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     '0px ' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px -' + absOffset + 'px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px 0px ' + blur + 'px ' + outlineColor + ', ' +
                                     absOffset + 'px ' + absOffset + 'px ' + blur + 'px ' + outlineColor;
                    const preview = picker.querySelector('#outline-preview');
                    preview.style.fontFamily = fontFamilyStr;
                    preview.style.fontSize = fontSize;
                    preview.style.fontWeight = bold;
                    preview.style.color = textColor;
                    preview.style.textShadow = shadowRule;
                    picker.querySelector('#text-alpha-value').textContent = textAlpha;
                    picker.querySelector('#outline-alpha-value').textContent = outlineAlpha;
                    const textHex = '#' + Math.round(textR).toString(16).padStart(2, '0') + Math.round(textG).toString(16).padStart(2, '0') + Math.round(textB).toString(16).padStart(2, '0');
                    picker.querySelector('#text-hex-input').value = textHex.toUpperCase();
                    const outlineHex = '#' + Math.round(outlineR).toString(16).padStart(2, '0') + Math.round(outlineG).toString(16).padStart(2, '0') + Math.round(outlineB).toString(16).padStart(2, '0');
                    picker.querySelector('#outline-hex-input').value = outlineHex.toUpperCase();
                }
                function updateTextSlider(channel, picker) {
                    const input = picker.querySelector('#text-' + channel + '-input').value;
                    picker.querySelector('#text-' + channel + '-slider').value = input;
                    updateOutlinePreview(picker);
                }
                function updateOutlineSlider(channel, picker) {
                    const input = picker.querySelector('#outline-' + channel + '-input').value;
                    picker.querySelector('#outline-' + channel + '-slider').value = input;
                    updateOutlinePreview(picker);
                }
                pinkOutlinePicker.addEventListener('input', function(e) {
                    if (e.target.id === 'font-family-select' || e.target.id === 'font-size' || e.target.id === 'font-bold' || e.target.id === 'offset' || e.target.id === 'blur' || e.target.id === 'text-alpha-slider' || e.target.id === 'outline-alpha-slider') {
                        updateOutlinePreview(pinkOutlinePicker);
                    } else if (e.target.matches('#text-r-slider, #text-g-slider, #text-b-slider')) {
                        updateOutlinePreview(pinkOutlinePicker);
                    } else if (e.target.matches('#outline-r-slider, #outline-g-slider, #outline-b-slider')) {
                        updateOutlinePreview(pinkOutlinePicker);
                    } else if (e.target.id.includes('text-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('text-', '').replace('-input', '');
                        updateTextSlider(channel, pinkOutlinePicker);
                    } else if (e.target.id.includes('outline-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('outline-', '').replace('-input', '');
                        updateOutlineSlider(channel, pinkOutlinePicker);
                    } else if (e.target.id === 'text-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            pinkOutlinePicker.querySelector('#text-r-slider').value = rgb.r;
                            pinkOutlinePicker.querySelector('#text-g-slider').value = rgb.g;
                            pinkOutlinePicker.querySelector('#text-b-slider').value = rgb.b;
                            pinkOutlinePicker.querySelector('#text-r-input').value = rgb.r;
                            pinkOutlinePicker.querySelector('#text-g-input').value = rgb.g;
                            pinkOutlinePicker.querySelector('#text-b-input').value = rgb.b;
                            updateOutlinePreview(pinkOutlinePicker);
                        }
                    } else if (e.target.id === 'outline-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            pinkOutlinePicker.querySelector('#outline-r-slider').value = rgb.r;
                            pinkOutlinePicker.querySelector('#outline-g-slider').value = rgb.g;
                            pinkOutlinePicker.querySelector('#outline-b-slider').value = rgb.b;
                            pinkOutlinePicker.querySelector('#outline-r-input').value = rgb.r;
                            pinkOutlinePicker.querySelector('#outline-g-input').value = rgb.g;
                            pinkOutlinePicker.querySelector('#outline-b-input').value = rgb.b;
                            updateOutlinePreview(pinkOutlinePicker);
                        }
                    }
                });
                updateOutlinePreview(pinkOutlinePicker);
            } catch (err) {
                log('Pink outline picker open error', err);
                showDebugIndicator('Pink outline picker failed; check console.', 'error');
            }
        }
        // Open double outline picker - added eyedropper for text, inner, outer
        function openDoubleOutlinePicker(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'double-outline-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                doubleOutlinePicker = document.createElement('div');
                doubleOutlinePicker.id = 'double-outline-picker';
                doubleOutlinePicker.innerHTML = '<h3>Double Outline Template</h3>' +
                    '<div class="outline-section">' +
                    '<div class="outline-inputs">' +
                    '<label>Font Family: <select id="font-family-select"><option value="print">Print (Kalam)</option><option value="serif">Serif</option><option value="sans-serif">Sans Serif</option><option value="monospace">Monospace</option><option value="cursive">Cursive</option><option value="fantasy">Fantasy</option><option value="comic">Comic Sans MS</option><option value="narrow">Arial Narrow</option><option value="mono">Plex Mono</option><option value="slab sans">Impact</option><option value="slab serif">Rockwell</option><option value="formal serif">Formal Serif (Lora)</option><option value="formal cursive">Formal Cursive</option><option value="hand">Hand (Indie Flower)</option><option value="childlike">Childlike (Giselle)</option><option value="blackletter">Blackletter</option><option value="scary">Scary (Anarchy)</option></select></label>' +
                    '<label>Font Size (px): <input type="number" id="font-size" value="20" min="10" max="100" step="1" /></label>' +
                    '<label><input type="checkbox" id="font-bold" checked /> Bold</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-section">' +
                    '<h4>Text Color (Pink)</h4>' +
                    '<div class="palette" id="text-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="text-r-slider" min="0" max="255" value="216" />' +
                    '<input type="range" id="text-g-slider" min="0" max="255" value="124" />' +
                    '<input type="range" id="text-b-slider" min="0" max="255" value="134" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="text-r-input" min="0" max="255" value="216" />' +
                    '<span>G:</span><input type="number" id="text-g-input" min="0" max="255" value="124" />' +
                    '<span>B:</span><input type="number" id="text-b-input" min="0" max="255" value="134" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="text-hex-input" value="#D87C86" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-text" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="text-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="text-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-section">' +
                    '<h4>Inner Outline (White, Thick)</h4>' +
                    '<div class="palette" id="inner-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Offset (px): <input type="number" id="inner-offset" value="2" min="0" max="10" step="0.1" /></label>' +
                    '<label>Blur (px): <input type="number" id="inner-blur" value="0" min="0" max="20" step="0.1" /></label>' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="inner-r-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="inner-g-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="inner-b-slider" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="inner-r-input" min="0" max="255" value="255" />' +
                    '<span>G:</span><input type="number" id="inner-g-input" min="0" max="255" value="255" />' +
                    '<span>B:</span><input type="number" id="inner-b-input" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="inner-hex-input" value="#FFFFFF" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-inner" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="inner-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="inner-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-section">' +
                    '<h4>Outer Outline (Black, Thin)</h4>' +
                    '<div class="palette" id="outer-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Offset (px): <input type="number" id="outer-offset" value="3" min="0" max="10" step="0.1" /></label>' +
                    '<label>Blur (px): <input type="number" id="outer-blur" value="0" min="0" max="20" step="0.1" /></label>' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="outer-r-slider" min="0" max="255" value="0" />' +
                    '<input type="range" id="outer-g-slider" min="0" max="255" value="0" />' +
                    '<input type="range" id="outer-b-slider" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="outer-r-input" min="0" max="255" value="0" />' +
                    '<span>G:</span><input type="number" id="outer-g-input" min="0" max="255" value="0" />' +
                    '<span>B:</span><input type="number" id="outer-b-input" min="0" max="255" value="0" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="outer-hex-input" value="#000000" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-outer" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="outer-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="outer-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div id="double-preview">Preview</div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-ok">OK</button>' +
                    '<button id="picker-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(doubleOutlinePicker);
                // Text palette
                const textPalette = doubleOutlinePicker.querySelector('#text-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        doubleOutlinePicker.querySelector('#text-r-slider').value = rgb.r;
                        doubleOutlinePicker.querySelector('#text-g-slider').value = rgb.g;
                        doubleOutlinePicker.querySelector('#text-b-slider').value = rgb.b;
                        doubleOutlinePicker.querySelector('#text-r-input').value = rgb.r;
                        doubleOutlinePicker.querySelector('#text-g-input').value = rgb.g;
                        doubleOutlinePicker.querySelector('#text-b-input').value = rgb.b;
                        doubleOutlinePicker.querySelector('#text-hex-input').value = color;
                        doubleOutlinePicker.querySelector('#text-alpha-slider').value = 1;
                        updateDoublePreview(doubleOutlinePicker);
                    });
                    textPalette.appendChild(btn);
                });
                // Inner palette
                const innerPalette = doubleOutlinePicker.querySelector('#inner-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        doubleOutlinePicker.querySelector('#inner-r-slider').value = rgb.r;
                        doubleOutlinePicker.querySelector('#inner-g-slider').value = rgb.g;
                        doubleOutlinePicker.querySelector('#inner-b-slider').value = rgb.b;
                        doubleOutlinePicker.querySelector('#inner-r-input').value = rgb.r;
                        doubleOutlinePicker.querySelector('#inner-g-input').value = rgb.g;
                        doubleOutlinePicker.querySelector('#inner-b-input').value = rgb.b;
                        doubleOutlinePicker.querySelector('#inner-hex-input').value = color;
                        doubleOutlinePicker.querySelector('#inner-alpha-slider').value = 1;
                        updateDoublePreview(doubleOutlinePicker);
                    });
                    innerPalette.appendChild(btn);
                });
                // Outer palette
                const outerPalette = doubleOutlinePicker.querySelector('#outer-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        doubleOutlinePicker.querySelector('#outer-r-slider').value = rgb.r;
                        doubleOutlinePicker.querySelector('#outer-g-slider').value = rgb.g;
                        doubleOutlinePicker.querySelector('#outer-b-slider').value = rgb.b;
                        doubleOutlinePicker.querySelector('#outer-r-input').value = rgb.r;
                        doubleOutlinePicker.querySelector('#outer-g-input').value = rgb.g;
                        doubleOutlinePicker.querySelector('#outer-b-input').value = rgb.b;
                        doubleOutlinePicker.querySelector('#outer-hex-input').value = color;
                        doubleOutlinePicker.querySelector('#outer-alpha-slider').value = 1;
                        updateDoublePreview(doubleOutlinePicker);
                    });
                    outerPalette.appendChild(btn);
                });
                doubleOutlinePicker.querySelector('#picker-ok').addEventListener('click', function(e) {
                    const fontFamily = doubleOutlinePicker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = doubleOutlinePicker.querySelector('#font-size').value + 'px';
                    var styleStr = 'font-size: ' + fontSize + '; font-family: ' + fontFamilyStr + '; ';
                    const bold = doubleOutlinePicker.querySelector('#font-bold').checked;
                    if (bold) styleStr += 'font-weight: bold; ';
                    const textR = doubleOutlinePicker.querySelector('#text-r-slider').value;
                    const textG = doubleOutlinePicker.querySelector('#text-g-slider').value;
                    const textB = doubleOutlinePicker.querySelector('#text-b-slider').value;
                    const textAlpha = doubleOutlinePicker.querySelector('#text-alpha-slider').value;
                    const textColor = (textAlpha < 1) ? 'rgba(' + textR + ', ' + textG + ', ' + textB + ', ' + textAlpha + ')' : 'rgb(' + textR + ', ' + textG + ', ' + textB + ')';
                    styleStr += 'color: ' + textColor + '; ';
                    const innerOffset = parseFloat(doubleOutlinePicker.querySelector('#inner-offset').value) || 2;
                    const innerBlur = parseFloat(doubleOutlinePicker.querySelector('#inner-blur').value) || 0;
                    const innerR = doubleOutlinePicker.querySelector('#inner-r-slider').value;
                    const innerG = doubleOutlinePicker.querySelector('#inner-g-slider').value;
                    const innerB = doubleOutlinePicker.querySelector('#inner-b-slider').value;
                    const innerAlpha = doubleOutlinePicker.querySelector('#inner-alpha-slider').value;
                    const innerColor = (innerAlpha < 1) ? 'rgba(' + innerR + ', ' + innerG + ', ' + innerB + ', ' + innerAlpha + ')' : 'rgb(' + innerR + ', ' + innerG + ', ' + innerB + ')';
                    const outerOffset = parseFloat(doubleOutlinePicker.querySelector('#outer-offset').value) || 3;
                    const outerBlur = parseFloat(doubleOutlinePicker.querySelector('#outer-blur').value) || 0;
                    const outerR = doubleOutlinePicker.querySelector('#outer-r-slider').value;
                    const outerG = doubleOutlinePicker.querySelector('#outer-g-slider').value;
                    const outerB = doubleOutlinePicker.querySelector('#outer-b-slider').value;
                    const outerAlpha = doubleOutlinePicker.querySelector('#outer-alpha-slider').value;
                    const outerColor = (outerAlpha < 1) ? 'rgba(' + outerR + ', ' + outerG + ', ' + outerB + ', ' + outerAlpha + ')' : 'rgb(' + outerR + ', ' + outerG + ', ' + outerB + ')';
                    // Inner shadows (8 dir)
                    const absInner = Math.abs(innerOffset);
                    var innerRule = '-' + absInner + 'px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '-' + absInner + 'px 0px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '-' + absInner + 'px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '0px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '0px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px 0px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor;
                    // Outer shadows (8 dir)
                    const absOuter = Math.abs(outerOffset);
                    var outerRule = '-' + absOuter + 'px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '-' + absOuter + 'px 0px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '-' + absOuter + 'px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '0px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '0px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px 0px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor;
                    styleStr += 'text-shadow: ' + innerRule + ', ' + outerRule + ';';
                    var openTag = '<span style="' + styleStr + '">';
                    // Pre-action save
                    saveState(ta, true);
                    applyFormat(ta, openTag, '</span>');
                    updateUndoRedoUI();
                    closeDoubleOutlinePicker();
                });
                doubleOutlinePicker.querySelector('#picker-cancel').addEventListener('click', closeDoubleOutlinePicker);
                overlay.addEventListener('click', closeDoubleOutlinePicker);
                window.addEventListener('keydown', globalEscHandler);
                // Eyedropper for text
                const eyedropperTextBtn = doubleOutlinePicker.querySelector('#eyedropper-text');
                addColorZillaLink(eyedropperTextBtn);
                if (eyedropperTextBtn && 'eyedropper' in navigator) {
                    eyedropperTextBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                doubleOutlinePicker.querySelector('#text-r-slider').value = r;
                                doubleOutlinePicker.querySelector('#text-g-slider').value = g;
                                doubleOutlinePicker.querySelector('#text-b-slider').value = b;
                                doubleOutlinePicker.querySelector('#text-r-input').value = r;
                                doubleOutlinePicker.querySelector('#text-g-input').value = g;
                                doubleOutlinePicker.querySelector('#text-b-input').value = b;
                                doubleOutlinePicker.querySelector('#text-hex-input').value = hex;
                                doubleOutlinePicker.querySelector('#text-alpha-slider').value = alpha;
                                doubleOutlinePicker.querySelector('#text-alpha-value').textContent = alpha.toFixed(2);
                                updateDoublePreview(doubleOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperTextBtn) {
                    eyedropperTextBtn.disabled = true;
                    eyedropperTextBtn.title = 'EyeDropper API not supported in this browser';
                }
                // Eyedropper for inner
                const eyedropperInnerBtn = doubleOutlinePicker.querySelector('#eyedropper-inner');
                addColorZillaLink(eyedropperInnerBtn);
                if (eyedropperInnerBtn && 'eyedropper' in navigator) {
                    eyedropperInnerBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                doubleOutlinePicker.querySelector('#inner-r-slider').value = r;
                                doubleOutlinePicker.querySelector('#inner-g-slider').value = g;
                                doubleOutlinePicker.querySelector('#inner-b-slider').value = b;
                                doubleOutlinePicker.querySelector('#inner-r-input').value = r;
                                doubleOutlinePicker.querySelector('#inner-g-input').value = g;
                                doubleOutlinePicker.querySelector('#inner-b-input').value = b;
                                doubleOutlinePicker.querySelector('#inner-hex-input').value = hex;
                                doubleOutlinePicker.querySelector('#inner-alpha-slider').value = alpha;
                                doubleOutlinePicker.querySelector('#inner-alpha-value').textContent = alpha.toFixed(2);
                                updateDoublePreview(doubleOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperInnerBtn) {
                    eyedropperInnerBtn.disabled = true;
                    eyedropperInnerBtn.title = 'EyeDropper API not supported in this browser';
                }
                // Eyedropper for outer
                const eyedropperOuterBtn = doubleOutlinePicker.querySelector('#eyedropper-outer');
                addColorZillaLink(eyedropperOuterBtn);
                if (eyedropperOuterBtn && 'eyedropper' in navigator) {
                    eyedropperOuterBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                doubleOutlinePicker.querySelector('#outer-r-slider').value = r;
                                doubleOutlinePicker.querySelector('#outer-g-slider').value = g;
                                doubleOutlinePicker.querySelector('#outer-b-slider').value = b;
                                doubleOutlinePicker.querySelector('#outer-r-input').value = r;
                                doubleOutlinePicker.querySelector('#outer-g-input').value = g;
                                doubleOutlinePicker.querySelector('#outer-b-input').value = b;
                                doubleOutlinePicker.querySelector('#outer-hex-input').value = hex;
                                doubleOutlinePicker.querySelector('#outer-alpha-slider').value = alpha;
                                doubleOutlinePicker.querySelector('#outer-alpha-value').textContent = alpha.toFixed(2);
                                updateDoublePreview(doubleOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperOuterBtn) {
                    eyedropperOuterBtn.disabled = true;
                    eyedropperOuterBtn.title = 'EyeDropper API not supported in this browser';
                }
                function updateDoublePreview(picker) {
                    const fontFamily = picker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = picker.querySelector('#font-size').value + 'px';
                    const bold = picker.querySelector('#font-bold').checked ? 'bold' : 'normal';
                    const textR = picker.querySelector('#text-r-slider').value;
                    const textG = picker.querySelector('#text-g-slider').value;
                    const textB = picker.querySelector('#text-b-slider').value;
                    const textAlpha = picker.querySelector('#text-alpha-slider').value;
                    const textColor = (textAlpha < 1) ? 'rgba(' + textR + ', ' + textG + ', ' + textB + ', ' + textAlpha + ')' : 'rgb(' + textR + ', ' + textG + ', ' + textB + ')';
                    const innerOffset = parseFloat(picker.querySelector('#inner-offset').value) || 2;
                    const innerBlur = parseFloat(picker.querySelector('#inner-blur').value) || 0;
                    const innerR = picker.querySelector('#inner-r-slider').value;
                    const innerG = picker.querySelector('#inner-g-slider').value;
                    const innerB = picker.querySelector('#inner-b-slider').value;
                    const innerAlpha = picker.querySelector('#inner-alpha-slider').value;
                    const innerColor = (innerAlpha < 1) ? 'rgba(' + innerR + ', ' + innerG + ', ' + innerB + ', ' + innerAlpha + ')' : 'rgb(' + innerR + ', ' + innerG + ', ' + innerB + ')';
                    const outerOffset = parseFloat(picker.querySelector('#outer-offset').value) || 3;
                    const outerBlur = parseFloat(picker.querySelector('#outer-blur').value) || 0;
                    const outerR = picker.querySelector('#outer-r-slider').value;
                    const outerG = picker.querySelector('#outer-g-slider').value;
                    const outerB = picker.querySelector('#outer-b-slider').value;
                    const outerAlpha = picker.querySelector('#outer-alpha-slider').value;
                    const outerColor = (outerAlpha < 1) ? 'rgba(' + outerR + ', ' + outerG + ', ' + outerB + ', ' + outerAlpha + ')' : 'rgb(' + outerR + ', ' + outerG + ', ' + outerB + ')';
                    const absInner = Math.abs(innerOffset);
                    var innerRule = '-' + absInner + 'px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '-' + absInner + 'px 0px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '-' + absInner + 'px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '0px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    '0px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px -' + absInner + 'px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px 0px ' + innerBlur + 'px ' + innerColor + ', ' +
                                    absInner + 'px ' + absInner + 'px ' + innerBlur + 'px ' + innerColor;
                    const absOuter = Math.abs(outerOffset);
                    var outerRule = '-' + absOuter + 'px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '-' + absOuter + 'px 0px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '-' + absOuter + 'px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '0px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    '0px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px -' + absOuter + 'px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px 0px ' + outerBlur + 'px ' + outerColor + ', ' +
                                    absOuter + 'px ' + absOuter + 'px ' + outerBlur + 'px ' + outerColor;
                    const preview = picker.querySelector('#double-preview');
                    preview.style.fontFamily = fontFamilyStr;
                    preview.style.fontSize = fontSize;
                    preview.style.fontWeight = bold;
                    preview.style.color = textColor;
                    preview.style.textShadow = innerRule + ', ' + outerRule;
                    picker.querySelector('#text-alpha-value').textContent = textAlpha;
                    picker.querySelector('#inner-alpha-value').textContent = innerAlpha;
                    picker.querySelector('#outer-alpha-value').textContent = outerAlpha;
                    const textHex = '#' + Math.round(textR).toString(16).padStart(2, '0') + Math.round(textG).toString(16).padStart(2, '0') + Math.round(textB).toString(16).padStart(2, '0');
                    picker.querySelector('#text-hex-input').value = textHex.toUpperCase();
                    const innerHex = '#' + Math.round(innerR).toString(16).padStart(2, '0') + Math.round(innerG).toString(16).padStart(2, '0') + Math.round(innerB).toString(16).padStart(2, '0');
                    picker.querySelector('#inner-hex-input').value = innerHex.toUpperCase();
                    const outerHex = '#' + Math.round(outerR).toString(16).padStart(2, '0') + Math.round(outerG).toString(16).padStart(2, '0') + Math.round(outerB).toString(16).padStart(2, '0');
                    picker.querySelector('#outer-hex-input').value = outerHex.toUpperCase();
                }
                // Update sliders for text/inner/outer (similar to pink)
                function updateTextSlider(channel, picker) {
                    const input = picker.querySelector('#text-' + channel + '-input').value;
                    picker.querySelector('#text-' + channel + '-slider').value = input;
                    updateDoublePreview(picker);
                }
                function updateInnerSlider(channel, picker) {
                    const input = picker.querySelector('#inner-' + channel + '-input').value;
                    picker.querySelector('#inner-' + channel + '-slider').value = input;
                    updateDoublePreview(picker);
                }
                function updateOuterSlider(channel, picker) {
                    const input = picker.querySelector('#outer-' + channel + '-input').value;
                    picker.querySelector('#outer-' + channel + '-slider').value = input;
                    updateDoublePreview(picker);
                }
                doubleOutlinePicker.addEventListener('input', function(e) {
                    if (e.target.id === 'font-family-select' || e.target.id === 'font-size' || e.target.id === 'font-bold' || e.target.id === 'text-alpha-slider' || e.target.id === 'inner-offset' || e.target.id === 'inner-blur' || e.target.id === 'inner-alpha-slider' || e.target.id === 'outer-offset' || e.target.id === 'outer-blur' || e.target.id === 'outer-alpha-slider') {
                        updateDoublePreview(doubleOutlinePicker);
                    } else if (e.target.matches('#text-r-slider, #text-g-slider, #text-b-slider')) {
                        updateDoublePreview(doubleOutlinePicker);
                    } else if (e.target.matches('#inner-r-slider, #inner-g-slider, #inner-b-slider')) {
                        updateDoublePreview(doubleOutlinePicker);
                    } else if (e.target.matches('#outer-r-slider, #outer-g-slider, #outer-b-slider')) {
                        updateDoublePreview(doubleOutlinePicker);
                    } else if (e.target.id.includes('text-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('text-', '').replace('-input', '');
                        updateTextSlider(channel, doubleOutlinePicker);
                    } else if (e.target.id.includes('inner-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('inner-', '').replace('-input', '');
                        updateInnerSlider(channel, doubleOutlinePicker);
                    } else if (e.target.id.includes('outer-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('outer-', '').replace('-input', '');
                        updateOuterSlider(channel, doubleOutlinePicker);
                    } else if (e.target.id === 'text-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            doubleOutlinePicker.querySelector('#text-r-slider').value = rgb.r;
                            doubleOutlinePicker.querySelector('#text-g-slider').value = rgb.g;
                            doubleOutlinePicker.querySelector('#text-b-slider').value = rgb.b;
                            doubleOutlinePicker.querySelector('#text-r-input').value = rgb.r;
                            doubleOutlinePicker.querySelector('#text-g-input').value = rgb.g;
                            doubleOutlinePicker.querySelector('#text-b-input').value = rgb.b;
                            updateDoublePreview(doubleOutlinePicker);
                        }
                    } else if (e.target.id === 'inner-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            doubleOutlinePicker.querySelector('#inner-r-slider').value = rgb.r;
                            doubleOutlinePicker.querySelector('#inner-g-slider').value = rgb.g;
                            doubleOutlinePicker.querySelector('#inner-b-slider').value = rgb.b;
                            doubleOutlinePicker.querySelector('#inner-r-input').value = rgb.r;
                            doubleOutlinePicker.querySelector('#inner-g-input').value = rgb.g;
                            doubleOutlinePicker.querySelector('#inner-b-input').value = rgb.b;
                            updateDoublePreview(doubleOutlinePicker);
                        }
                    } else if (e.target.id === 'outer-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            doubleOutlinePicker.querySelector('#outer-r-slider').value = rgb.r;
                            doubleOutlinePicker.querySelector('#outer-g-slider').value = rgb.g;
                            doubleOutlinePicker.querySelector('#outer-b-slider').value = rgb.b;
                            doubleOutlinePicker.querySelector('#outer-r-input').value = rgb.r;
                            doubleOutlinePicker.querySelector('#outer-g-input').value = rgb.g;
                            doubleOutlinePicker.querySelector('#outer-b-input').value = rgb.b;
                            updateDoublePreview(doubleOutlinePicker);
                        }
                    }
                });
                updateDoublePreview(doubleOutlinePicker);
            } catch (err) {
                log('Double outline picker open error', err);
                showDebugIndicator('Double outline picker failed; check console.', 'error');
            }
        }
        // Open gradient outline picker - new
        function openGradientOutlinePicker(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'gradient-outline-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                gradientOutlinePicker = document.createElement('div');
                gradientOutlinePicker.id = 'gradient-outline-picker';
                gradientOutlinePicker.innerHTML = '<h3>Gradient Outline Template</h3>' +
                    '<span class="version">v' + CONFIG.version + '</span>' +
                    '<div class="gradient-section">' +
                    '<div class="gradient-inputs">' +
                    '<label>Font Family: <select id="font-family-select"><option value="print">Print (Kalam)</option><option value="serif">Serif</option><option value="sans-serif">Sans Serif</option><option value="monospace">Monospace</option><option value="cursive">Cursive</option><option value="fantasy">Fantasy</option><option value="comic">Comic Sans MS</option><option value="narrow">Arial Narrow</option><option value="mono">Plex Mono</option><option value="slab sans">Impact</option><option value="slab serif">Rockwell</option><option value="formal serif">Formal Serif (Lora)</option><option value="formal cursive">Formal Cursive</option><option value="hand">Hand (Indie Flower)</option><option value="childlike">Childlike (Giselle)</option><option value="blackletter">Blackletter</option><option value="scary">Scary (Anarchy)</option></select></label>' +
                    '<label>Font Size (px): <input type="number" id="font-size" value="30" min="10" max="100" step="1" /></label>' +
                    '<label><input type="checkbox" id="font-bold" checked /> Bold</label>' +
                    '<label>Gradient Angle (deg): <input type="number" id="gradient-angle" value="90" min="0" max="360" step="1" /></label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="gradient-section">' +
                    '<h4>Start Color</h4>' +
                    '<div class="palette" id="start-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="start-r-slider" min="0" max="255" value="87" />' +
                    '<input type="range" id="start-g-slider" min="0" max="255" value="48" />' +
                    '<input type="range" id="start-b-slider" min="0" max="255" value="115" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="start-r-input" min="0" max="255" value="87" />' +
                    '<span>G:</span><input type="number" id="start-g-input" min="0" max="255" value="48" />' +
                    '<span>B:</span><input type="number" id="start-b-input" min="0" max="255" value="115" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="start-hex-input" value="#573073" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-start" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="start-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="start-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="gradient-section">' +
                    '<h4>End Color</h4>' +
                    '<div class="palette" id="end-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="end-r-slider" min="0" max="255" value="216" />' +
                    '<input type="range" id="end-g-slider" min="0" max="255" value="82" />' +
                    '<input type="range" id="end-b-slider" min="0" max="255" value="190" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="end-r-input" min="0" max="255" value="216" />' +
                    '<span>G:</span><input type="number" id="end-g-input" min="0" max="255" value="82" />' +
                    '<span>B:</span><input type="number" id="end-b-input" min="0" max="255" value="190" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="end-hex-input" value="#D852BE" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-end" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="end-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="end-alpha-value">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="outline-toggle">' +
                    '<input type="checkbox" id="outline-toggle" checked /> Use Outline' +
                    '</div>' +
                    '<div class="outline-section" id="outline-section">' +
                    '<h4>Outline Color</h4>' +
                    '<div class="palette" id="outline-palette"></div>' +
                    '<div class="custom-section">' +
                    '<label>Custom RGB</label>' +
                    '<div class="rgb-sliders">' +
                    '<input type="range" id="outline-r-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="outline-g-slider" min="0" max="255" value="255" />' +
                    '<input type="range" id="outline-b-slider" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="rgb-inputs">' +
                    '<span>R:</span><input type="number" id="outline-r-input" min="0" max="255" value="255" />' +
                    '<span>G:</span><input type="number" id="outline-g-input" min="0" max="255" value="255" />' +
                    '<span>B:</span><input type="number" id="outline-b-input" min="0" max="255" value="255" />' +
                    '</div>' +
                    '<div class="hex-input">' +
                    '<label>Hex (#RRGGBB):</label>' +
                    '<input type="text" id="outline-hex-input" value="#FFFFFF" maxlength="7" />' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                    '<button id="eyedropper-outline" class="eyedropper-btn" title="Pick color from screen" style="width: auto; flex: 1; margin-right: 5px;">👁 Pick from Screen</button>' +
                    '</div>' +
                    '<label>Opacity (Alpha 0-1)</label>' +
                    '<input type="range" id="outline-alpha-slider" min="0" max="1" step="0.01" value="1" />' +
                    '<span id="outline-alpha-value">1.00</span>' +
                    '</div>' +
                    '<label>Stroke Width (px): <input type="number" id="stroke-width" value="1" min="0" max="5" step="0.1" /></label>' +
                    '</div>' +
                    '<div id="gradient-preview">*twitch*</div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-ok">OK</button>' +
                    '<button id="picker-cancel">Cancel</button>' +
                    '</div>';
                document.body.appendChild(gradientOutlinePicker);
                // Start palette
                const startPalette = gradientOutlinePicker.querySelector('#start-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        gradientOutlinePicker.querySelector('#start-r-slider').value = rgb.r;
                        gradientOutlinePicker.querySelector('#start-g-slider').value = rgb.g;
                        gradientOutlinePicker.querySelector('#start-b-slider').value = rgb.b;
                        gradientOutlinePicker.querySelector('#start-r-input').value = rgb.r;
                        gradientOutlinePicker.querySelector('#start-g-input').value = rgb.g;
                        gradientOutlinePicker.querySelector('#start-b-input').value = rgb.b;
                        gradientOutlinePicker.querySelector('#start-hex-input').value = color;
                        gradientOutlinePicker.querySelector('#start-alpha-slider').value = 1;
                        updateGradientPreview(gradientOutlinePicker);
                    });
                    startPalette.appendChild(btn);
                });
                // End palette
                const endPalette = gradientOutlinePicker.querySelector('#end-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        gradientOutlinePicker.querySelector('#end-r-slider').value = rgb.r;
                        gradientOutlinePicker.querySelector('#end-g-slider').value = rgb.g;
                        gradientOutlinePicker.querySelector('#end-b-slider').value = rgb.b;
                        gradientOutlinePicker.querySelector('#end-r-input').value = rgb.r;
                        gradientOutlinePicker.querySelector('#end-g-input').value = rgb.g;
                        gradientOutlinePicker.querySelector('#end-b-input').value = rgb.b;
                        gradientOutlinePicker.querySelector('#end-hex-input').value = color;
                        gradientOutlinePicker.querySelector('#end-alpha-slider').value = 1;
                        updateGradientPreview(gradientOutlinePicker);
                    });
                    endPalette.appendChild(btn);
                });
                // Outline palette
                const outlinePalette = gradientOutlinePicker.querySelector('#outline-palette');
                CONFIG.commonColors.forEach(function(color) {
                    const btn = document.createElement('button');
                    btn.style.backgroundColor = color;
                    btn.addEventListener('click', function() {
                        const rgb = hexToRgb(color);
                        gradientOutlinePicker.querySelector('#outline-r-slider').value = rgb.r;
                        gradientOutlinePicker.querySelector('#outline-g-slider').value = rgb.g;
                        gradientOutlinePicker.querySelector('#outline-b-slider').value = rgb.b;
                        gradientOutlinePicker.querySelector('#outline-r-input').value = rgb.r;
                        gradientOutlinePicker.querySelector('#outline-g-input').value = rgb.g;
                        gradientOutlinePicker.querySelector('#outline-b-input').value = rgb.b;
                        gradientOutlinePicker.querySelector('#outline-hex-input').value = color;
                        gradientOutlinePicker.querySelector('#outline-alpha-slider').value = 1;
                        updateGradientPreview(gradientOutlinePicker);
                    });
                    outlinePalette.appendChild(btn);
                });
                // Outline toggle listener
                const outlineToggle = gradientOutlinePicker.querySelector('#outline-toggle');
                const outlineSection = gradientOutlinePicker.querySelector('#outline-section');
                outlineToggle.addEventListener('change', function() {
                    outlineSection.classList.toggle('hidden', !this.checked);
                    updateGradientPreview(gradientOutlinePicker);
                });
                gradientOutlinePicker.querySelector('#picker-ok').addEventListener('click', function(e) {
                    const fontFamily = gradientOutlinePicker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = gradientOutlinePicker.querySelector('#font-size').value + 'px';
                    var styleStr = 'font-size: ' + fontSize + '; font-family: ' + fontFamilyStr + '; ';
                    const bold = gradientOutlinePicker.querySelector('#font-bold').checked;
                    if (bold) styleStr += 'font-weight: bold; ';
                    const angle = gradientOutlinePicker.querySelector('#gradient-angle').value + 'deg';
                    const startR = gradientOutlinePicker.querySelector('#start-r-slider').value;
                    const startG = gradientOutlinePicker.querySelector('#start-g-slider').value;
                    const startB = gradientOutlinePicker.querySelector('#start-b-slider').value;
                    const startAlpha = gradientOutlinePicker.querySelector('#start-alpha-slider').value;
                    const endR = gradientOutlinePicker.querySelector('#end-r-slider').value;
                    const endG = gradientOutlinePicker.querySelector('#end-g-slider').value;
                    const endB = gradientOutlinePicker.querySelector('#end-b-slider').value;
                    const endAlpha = gradientOutlinePicker.querySelector('#end-alpha-slider').value;
                    const startColor = (startAlpha < 1) ? 'rgba(' + startR + ', ' + startG + ', ' + startB + ', ' + startAlpha + ')' : 'rgb(' + startR + ', ' + startG + ', ' + startB + ')';
                    const endColor = (endAlpha < 1) ? 'rgba(' + endR + ', ' + endG + ', ' + endB + ', ' + endAlpha + ')' : 'rgb(' + endR + ', ' + endG + ', ' + endB + ')';
                    styleStr += 'background: linear-gradient(' + angle + ', ' + startColor + ', ' + endColor + ' 100%); -webkit-background-clip: text; color: transparent; ';
                    const useOutline = gradientOutlinePicker.querySelector('#outline-toggle').checked;
                    if (useOutline) {
                        const outlineR = gradientOutlinePicker.querySelector('#outline-r-slider').value;
                        const outlineG = gradientOutlinePicker.querySelector('#outline-g-slider').value;
                        const outlineB = gradientOutlinePicker.querySelector('#outline-b-slider').value;
                        const outlineAlpha = gradientOutlinePicker.querySelector('#outline-alpha-slider').value;
                        const outlineColor = (outlineAlpha < 1) ? 'rgba(' + outlineR + ', ' + outlineG + ', ' + outlineB + ', ' + outlineAlpha + ')' : 'rgb(' + outlineR + ', ' + outlineG + ', ' + outlineB + ')';
                        const strokeWidth = gradientOutlinePicker.querySelector('#stroke-width').value + 'px';
                        styleStr += '-webkit-text-stroke: ' + strokeWidth + ' ' + outlineColor + '; ';
                    }
                    var openTag = '<span style="' + styleStr + '">';
                    // Pre-action save
                    saveState(ta, true);
                    applyFormat(ta, openTag, '</span>');
                    updateUndoRedoUI();
                    closeGradientOutlinePicker();
                });
                gradientOutlinePicker.querySelector('#picker-cancel').addEventListener('click', closeGradientOutlinePicker);
                overlay.addEventListener('click', closeGradientOutlinePicker);
                window.addEventListener('keydown', globalEscHandler);
                // Eyedropper for start
                const eyedropperStartBtn = gradientOutlinePicker.querySelector('#eyedropper-start');
                addColorZillaLink(eyedropperStartBtn);
                if (eyedropperStartBtn && 'eyedropper' in navigator) {
                    eyedropperStartBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                gradientOutlinePicker.querySelector('#start-r-slider').value = r;
                                gradientOutlinePicker.querySelector('#start-g-slider').value = g;
                                gradientOutlinePicker.querySelector('#start-b-slider').value = b;
                                gradientOutlinePicker.querySelector('#start-r-input').value = r;
                                gradientOutlinePicker.querySelector('#start-g-input').value = g;
                                gradientOutlinePicker.querySelector('#start-b-input').value = b;
                                gradientOutlinePicker.querySelector('#start-hex-input').value = hex;
                                gradientOutlinePicker.querySelector('#start-alpha-slider').value = alpha;
                                gradientOutlinePicker.querySelector('#start-alpha-value').textContent = alpha.toFixed(2);
                                updateGradientPreview(gradientOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperStartBtn) {
                    eyedropperStartBtn.disabled = true;
                    eyedropperStartBtn.title = 'EyeDropper API not supported in this browser';
                }
                // Eyedropper for end
                const eyedropperEndBtn = gradientOutlinePicker.querySelector('#eyedropper-end');
                addColorZillaLink(eyedropperEndBtn);
                if (eyedropperEndBtn && 'eyedropper' in navigator) {
                    eyedropperEndBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                gradientOutlinePicker.querySelector('#end-r-slider').value = r;
                                gradientOutlinePicker.querySelector('#end-g-slider').value = g;
                                gradientOutlinePicker.querySelector('#end-b-slider').value = b;
                                gradientOutlinePicker.querySelector('#end-r-input').value = r;
                                gradientOutlinePicker.querySelector('#end-g-input').value = g;
                                gradientOutlinePicker.querySelector('#end-b-input').value = b;
                                gradientOutlinePicker.querySelector('#end-hex-input').value = hex;
                                gradientOutlinePicker.querySelector('#end-alpha-slider').value = alpha;
                                gradientOutlinePicker.querySelector('#end-alpha-value').textContent = alpha.toFixed(2);
                                updateGradientPreview(gradientOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperEndBtn) {
                    eyedropperEndBtn.disabled = true;
                    eyedropperEndBtn.title = 'EyeDropper API not supported in this browser';
                }
                // Eyedropper for outline
                const eyedropperOutlineBtn = gradientOutlinePicker.querySelector('#eyedropper-outline');
                addColorZillaLink(eyedropperOutlineBtn);
                if (eyedropperOutlineBtn && 'eyedropper' in navigator) {
                    eyedropperOutlineBtn.addEventListener('click', async function() {
                        try {
                            const result = await navigator.eyedropper.pick({withAlpha: true});
                            if (result && result.sRGBHex) {
                                const hexFull = result.sRGBHex;
                                const alphaHex = hexFull.slice(-2);
                                const hex = '#' + hexFull.slice(1,7).toUpperCase();
                                const r = parseInt(hexFull.slice(1,3), 16);
                                const g = parseInt(hexFull.slice(3,5), 16);
                                const b = parseInt(hexFull.slice(5,7), 16);
                                const alpha = parseInt(alphaHex, 16) / 255;
                                gradientOutlinePicker.querySelector('#outline-r-slider').value = r;
                                gradientOutlinePicker.querySelector('#outline-g-slider').value = g;
                                gradientOutlinePicker.querySelector('#outline-b-slider').value = b;
                                gradientOutlinePicker.querySelector('#outline-r-input').value = r;
                                gradientOutlinePicker.querySelector('#outline-g-input').value = g;
                                gradientOutlinePicker.querySelector('#outline-b-input').value = b;
                                gradientOutlinePicker.querySelector('#outline-hex-input').value = hex;
                                gradientOutlinePicker.querySelector('#outline-alpha-slider').value = alpha;
                                gradientOutlinePicker.querySelector('#outline-alpha-value').textContent = alpha.toFixed(2);
                                updateGradientPreview(gradientOutlinePicker);
                            }
                        } catch (err) {
                            log('Eyedropper error:', err);
                            showDebugIndicator('Eyedropper cancelled or failed.', 'info');
                        }
                    });
                } else if (eyedropperOutlineBtn) {
                    eyedropperOutlineBtn.disabled = true;
                    eyedropperOutlineBtn.title = 'EyeDropper API not supported in this browser';
                }
                function updateGradientPreview(picker) {
                    const fontFamily = picker.querySelector('#font-family-select').value;
                    const fontFamilyStr = fontFamily.includes(' ') ? fontFamily + ', serif' : fontFamily + ', sans-serif';
                    const fontSize = picker.querySelector('#font-size').value + 'px';
                    const bold = picker.querySelector('#font-bold').checked ? 'bold' : 'normal';
                    const angle = picker.querySelector('#gradient-angle').value + 'deg';
                    const startR = picker.querySelector('#start-r-slider').value;
                    const startG = picker.querySelector('#start-g-slider').value;
                    const startB = picker.querySelector('#start-b-slider').value;
                    const startAlpha = picker.querySelector('#start-alpha-slider').value;
                    const endR = picker.querySelector('#end-r-slider').value;
                    const endG = picker.querySelector('#end-g-slider').value;
                    const endB = picker.querySelector('#end-b-slider').value;
                    const endAlpha = picker.querySelector('#end-alpha-slider').value;
                    const startColor = (startAlpha < 1) ? 'rgba(' + startR + ', ' + startG + ', ' + startB + ', ' + startAlpha + ')' : 'rgb(' + startR + ', ' + startG + ', ' + startB + ')';
                    const endColor = (endAlpha < 1) ? 'rgba(' + endR + ', ' + endG + ', ' + endB + ', ' + endAlpha + ')' : 'rgb(' + endR + ', ' + endG + ', ' + endB + ')';
                    const preview = picker.querySelector('#gradient-preview');
                    preview.style.fontFamily = fontFamilyStr;
                    preview.style.fontSize = fontSize;
                    preview.style.fontWeight = bold;
                    preview.style.background = 'linear-gradient(' + angle + ', ' + startColor + ', ' + endColor + ' 100%)';
                    preview.style.webkitBackgroundClip = 'text';
                    preview.style.color = 'transparent';
                    const useOutline = picker.querySelector('#outline-toggle').checked;
                    if (useOutline) {
                        const outlineR = picker.querySelector('#outline-r-slider').value;
                        const outlineG = picker.querySelector('#outline-g-slider').value;
                        const outlineB = picker.querySelector('#outline-b-slider').value;
                        const outlineAlpha = picker.querySelector('#outline-alpha-slider').value;
                        const outlineColor = (outlineAlpha < 1) ? 'rgba(' + outlineR + ', ' + outlineG + ', ' + outlineB + ', ' + outlineAlpha + ')' : 'rgb(' + outlineR + ', ' + outlineG + ', ' + outlineB + ')';
                        const strokeWidth = picker.querySelector('#stroke-width').value + 'px';
                        preview.style.webkitTextStroke = strokeWidth + ' ' + outlineColor;
                    } else {
                        preview.style.webkitTextStroke = 'none';
                    }
                    picker.querySelector('#start-alpha-value').textContent = startAlpha;
                    picker.querySelector('#end-alpha-value').textContent = endAlpha;
                    if (useOutline) {
                        picker.querySelector('#outline-alpha-value').textContent = outlineAlpha;
                        const startHex = '#' + Math.round(startR).toString(16).padStart(2, '0') + Math.round(startG).toString(16).padStart(2, '0') + Math.round(startB).toString(16).padStart(2, '0');
                        picker.querySelector('#start-hex-input').value = startHex.toUpperCase();
                        const endHex = '#' + Math.round(endR).toString(16).padStart(2, '0') + Math.round(endG).toString(16).padStart(2, '0') + Math.round(endB).toString(16).padStart(2, '0');
                        picker.querySelector('#end-hex-input').value = endHex.toUpperCase();
                        const outlineHex = '#' + Math.round(outlineR).toString(16).padStart(2, '0') + Math.round(outlineG).toString(16).padStart(2, '0') + Math.round(outlineB).toString(16).padStart(2, '0');
                        picker.querySelector('#outline-hex-input').value = outlineHex.toUpperCase();
                    }
                }
                // Update sliders for start/end/outline (reused pattern)
                function updateStartSlider(channel, picker) {
                    const input = picker.querySelector('#start-' + channel + '-input').value;
                    picker.querySelector('#start-' + channel + '-slider').value = input;
                    updateGradientPreview(picker);
                }
                function updateEndSlider(channel, picker) {
                    const input = picker.querySelector('#end-' + channel + '-input').value;
                    picker.querySelector('#end-' + channel + '-slider').value = input;
                    updateGradientPreview(picker);
                }
                function updateOutlineSlider(channel, picker) {
                    const input = picker.querySelector('#outline-' + channel + '-input').value;
                    picker.querySelector('#outline-' + channel + '-slider').value = input;
                    updateGradientPreview(picker);
                }
                gradientOutlinePicker.addEventListener('input', function(e) {
                    if (e.target.id === 'font-family-select' || e.target.id === 'font-size' || e.target.id === 'font-bold' || e.target.id === 'gradient-angle' || e.target.id === 'start-alpha-slider' || e.target.id === 'end-alpha-slider' || e.target.id === 'outline-toggle' || e.target.id === 'stroke-width') {
                        updateGradientPreview(gradientOutlinePicker);
                    } else if (e.target.matches('#start-r-slider, #start-g-slider, #start-b-slider')) {
                        updateGradientPreview(gradientOutlinePicker);
                    } else if (e.target.matches('#end-r-slider, #end-g-slider, #end-b-slider')) {
                        updateGradientPreview(gradientOutlinePicker);
                    } else if (e.target.matches('#outline-r-slider, #outline-g-slider, #outline-b-slider')) {
                        updateGradientPreview(gradientOutlinePicker);
                    } else if (e.target.id.includes('start-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('start-', '').replace('-input', '');
                        updateStartSlider(channel, gradientOutlinePicker);
                    } else if (e.target.id.includes('end-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('end-', '').replace('-input', '');
                        updateEndSlider(channel, gradientOutlinePicker);
                    } else if (e.target.id.includes('outline-') && e.target.id.includes('input') && e.target.type === 'number') {
                        const channel = e.target.id.replace('outline-', '').replace('-input', '');
                        updateOutlineSlider(channel, gradientOutlinePicker);
                    } else if (e.target.id === 'start-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            gradientOutlinePicker.querySelector('#start-r-slider').value = rgb.r;
                            gradientOutlinePicker.querySelector('#start-g-slider').value = rgb.g;
                            gradientOutlinePicker.querySelector('#start-b-slider').value = rgb.b;
                            gradientOutlinePicker.querySelector('#start-r-input').value = rgb.r;
                            gradientOutlinePicker.querySelector('#start-g-input').value = rgb.g;
                            gradientOutlinePicker.querySelector('#start-b-input').value = rgb.b;
                            updateGradientPreview(gradientOutlinePicker);
                        }
                    } else if (e.target.id === 'end-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            gradientOutlinePicker.querySelector('#end-r-slider').value = rgb.r;
                            gradientOutlinePicker.querySelector('#end-g-slider').value = rgb.g;
                            gradientOutlinePicker.querySelector('#end-b-slider').value = rgb.b;
                            gradientOutlinePicker.querySelector('#end-r-input').value = rgb.r;
                            gradientOutlinePicker.querySelector('#end-g-input').value = rgb.g;
                            gradientOutlinePicker.querySelector('#end-b-input').value = rgb.b;
                            updateGradientPreview(gradientOutlinePicker);
                        }
                    } else if (e.target.id === 'outline-hex-input') {
                        const hexValue = e.target.value.replace('#', '').toUpperCase();
                        if (hexValue.match(/^([0-9A-F]{6})$/)) {
                            const rgb = hexToRgb(hexValue);
                            gradientOutlinePicker.querySelector('#outline-r-slider').value = rgb.r;
                            gradientOutlinePicker.querySelector('#outline-g-slider').value = rgb.g;
                            gradientOutlinePicker.querySelector('#outline-b-slider').value = rgb.b;
                            gradientOutlinePicker.querySelector('#outline-r-input').value = rgb.r;
                            gradientOutlinePicker.querySelector('#outline-g-input').value = rgb.g;
                            gradientOutlinePicker.querySelector('#outline-b-input').value = rgb.b;
                            updateGradientPreview(gradientOutlinePicker);
                        }
                    }
                });
                updateGradientPreview(gradientOutlinePicker);
                log('Gradient outline picker opened.');
            } catch (err) {
                log('Gradient outline picker open error', err);
                showDebugIndicator('Gradient outline picker failed; check console.', 'error');
            }
        }
        // Open symbols palette picker
        function openSymbolsPicker(ta) {
            try {
                closeAllPickers();
                closeResizeSettings();
                closeHistoryModal();
                const overlay = document.createElement('div');
                overlay.id = 'symbol-picker-overlay';
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;';
                document.body.appendChild(overlay);
                symbolPicker = document.createElement('div');
                symbolPicker.id = 'symbol-picker';
                symbolPicker.innerHTML = '<h3>Symbols Palette</h3>' +
                    '<div class="symbols-palette"></div>' +
                    '<div class="picker-buttons">' +
                    '<button id="picker-cancel">Close</button>' +
                    '</div>';
                document.body.appendChild(symbolPicker);
                const palette = symbolPicker.querySelector('.symbols-palette');
                CONFIG.symbols.forEach(function(sym) {
                    const btn = document.createElement('button');
                    btn.innerHTML = sym;
                    btn.title = 'Insert ' + sym;
                    btn.addEventListener('click', function() {
                        // Pre-action save
                        saveState(ta, true);
                        insertAtCursor(ta, sym);
                        updateUndoRedoUI();
                        closeSymbolsPicker();
                    });
                    palette.appendChild(btn);
                });
                symbolPicker.querySelector('#picker-cancel').addEventListener('click', closeSymbolsPicker);
                overlay.addEventListener('click', closeSymbolsPicker);
                window.addEventListener('keydown', globalEscHandler);
            } catch (err) {
                log('Symbols picker open error', err);
                showDebugIndicator('Symbols picker failed; check console.', 'error');
            }
        }
        // Clear formatting: Strip HTML tags
        function clearFormatting(ta) {
            try {
                // Pre-action save
                saveState(ta, true);
                const text = ta.value.replace(/<[^>]*>/g, '');
                ta.value = text;
                ta.selectionStart = ta.selectionEnd = 0;
                ta.focus();
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                // Update preview
                if (CONFIG.previewEnabled) debounceUpdatePreview();
                updateCharCount();
                updateUndoRedoUI();
                log('Formatting cleared.');
            } catch (err) {
                log('Clear formatting error', err);
            }
        }
        // Insert link prompt with intelligent defaults
        function insertLink(ta) {
            try {
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const selected = ta.value.substring(start, end);
                const url = prompt('Enter URL:');
                if (!url) return;
                var text;
                if (selected) {
                    text = prompt('Enter link text (optional):', selected) || selected;
                } else {
                    text = prompt('Enter link text (optional):', '') || url;
                }
                const linkHTML = '<a href="' + url + '">' + text + '</a>';
                // Pre-action save
                saveState(ta, true);
                insertAtCursor(ta, linkHTML);
                updateUndoRedoUI();
            } catch (err) {
                log('Link insert error', err);
            }
        }
        // Insert text at cursor
        function insertAtCursor(ta, text) {
            try {
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                ta.value = ta.value.substring(0, start) + text + ta.value.substring(end);
                ta.selectionStart = ta.selectionEnd = start + text.length;
                ta.focus();
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                // Update preview
                if (CONFIG.previewEnabled) debounceUpdatePreview();
                updateCharCount();
            } catch (err) {
                log('Insert at cursor error', err);
            }
        }
        // History management for undo/redo - enhanced with branching, checkpoints, validation
        function saveState(ta, immediate = false, event = null) {
            try {
                if (!immediate && debounceTimer) {
                    clearTimeout(debounceTimer);
                    debounceTimer = null;
                }
                // Dynamic debounce: Adjust based on event if provided
                let effectiveDelay = CONFIG.debounceDelay;
                if (event && event.inputType === 'insertFromPaste') {
                    effectiveDelay = 500; // Longer for paste
                } else if (event && event.inputType === 'insertText') {
                    effectiveDelay = 400; // Tuned for word-grouping (groups fast typing, single-char on pause)
                    // Immediate if ends with space or punctuation (word boundary)
                    const lastChar = event.data || '';
                    if (/\s|[.,!?;:]/.test(lastChar)) {
                        effectiveDelay = 0;
                    }
                }
                const doSave = () => {
                    try {
                        const now = Date.now();
                        const state = {
                            value: ta.value,
                            start: ta.selectionStart,
                            end: ta.selectionEnd,
                            timestamp: now
                        };
                        // Checkpoint every N saves: Store diff instead of full for memory
                        if (saveCount % CONFIG.checkpointInterval === 0 && saveCount > 0) {
                            const prevState = history[historyIndex];
                            if (prevState) {
                                const diff = ta.value.substring(prevState.value.length); // Simple append diff for now
                                state.diff = diff;
                                state.baseIndex = historyIndex;
                            }
                        }
                        saveCount++;
                        lastSaveTime = now;
                        // Branch if idle > threshold and on button action (immediate)
                        if (immediate && (now - lastSaveTime > CONFIG.idleBranchThreshold) && Object.keys(branches).length < CONFIG.branchLimit) {
                            const newBranchId = 'branch_' + Date.now();
                            branches[newBranchId] = {
                                history: [state],
                                index: 0
                            };
                            currentBranchId = newBranchId;
                            log('Forked new branch:', newBranchId);
                            showDebugIndicator('Branched history (idle action). Redo shows branch tooltip.', 'info');
                        } else {
                            // Trim history to limit per branch
                            const currentBranch = branches[currentBranchId] || {history: history, index: historyIndex};
                            if (currentBranch.history.length > CONFIG.historyLimit) {
                                currentBranch.history.shift();
                                if (currentBranch.index > 0) currentBranch.index--;
                            }
                            // Push after current index (discard future)
                            currentBranch.history = currentBranch.history.slice(0, currentBranch.index + 1);
                            currentBranch.history.push(state);
                            currentBranch.index = currentBranch.history.length - 1;
                            if (!branches[currentBranchId]) {
                                branches[currentBranchId] = currentBranch;
                            }
                        }
                        history = branches[currentBranchId].history;
                        historyIndex = branches[currentBranchId].index;
                        updateUndoRedoUI();
                        // Batch low-priority saves on idle if not immediate
                        if (!immediate && 'requestIdleCallback' in window) {
                            requestIdleCallback(() => saveNoteHistory(getNoteId(ta)));
                        } else {
                            saveNoteHistory(getNoteId(ta));
                        }
                        log('State saved. History length: ' + history.length + ', Branch: ' + currentBranchId);
                    } catch (saveErr) {
                        log('Inner save error, retrying once', saveErr);
                        // Autonomous recovery: Retry once
                        setTimeout(doSave, 100);
                    }
                };
                if (immediate || effectiveDelay === 0) {
                    doSave();
                } else {
                    debounceTimer = setTimeout(doSave, effectiveDelay);
                }
            } catch (err) {
                log('Save state error', err);
                // Autonomous: Clear debounce and retry on next input
                if (debounceTimer) clearTimeout(debounceTimer);
            }
        }
        // Get note ID from dialog data attr or fallback
        function getNoteId(ta) {
            const dialog = ta.closest('.note-edit-dialog');
            return dialog ? (dialog.dataset.noteId || 'unknown') : 'unknown';
        }
        function undo(ta) {
            try {
                if (history.length === 0) {
                    log('Undo: No history available, fallback to native.');
                    document.execCommand('undo');
                    return;
                }
                const currentState = {value: ta.value, start: ta.selectionStart, end: ta.selectionEnd};
                if (historyIndex > 0) {
                    const prevState = history[historyIndex - 1];
                    // Validation: Suspicious size?
                    if (prevState.value.length > currentState.value.length * 2) {
                        log('Suspicious undo state size, skipping to native fallback.');
                        document.execCommand('undo');
                        return;
                    }
                    historyIndex--;
                    ta.value = prevState.value;
                    ta.selectionStart = prevState.start;
                    ta.selectionEnd = prevState.end;
                    ta.focus();
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                    if (CONFIG.previewEnabled) debounceUpdatePreview();
                    updateCharCount();
                    updateUndoRedoUI();
                    showDebugIndicator('Undone to previous state.', 'success');
                    log('Undo to index ' + historyIndex);
                } else {
                    log('Undo: At start of history (original state).');
                    showDebugIndicator('Already at original state.', 'info');
                }
            } catch (err) {
                log('Undo error', err);
                showDebugIndicator('Undo failed; check console.', 'error');
                // Fallback to native
                document.execCommand('undo');
            }
        }
        function redo(ta) {
            try {
                if (history.length === 0) {
                    log('Redo: No history available, fallback to native.');
                    document.execCommand('redo');
                    return;
                }
                const currentState = {value: ta.value, start: ta.selectionStart, end: ta.selectionEnd};
                if (historyIndex < history.length - 1) {
                    const nextState = history[historyIndex + 1];
                    // Validation
                    if (nextState.value.length > currentState.value.length * 2) {
                        log('Suspicious redo state size, skipping to native fallback.');
                        document.execCommand('redo');
                        return;
                    }
                    historyIndex++;
                    ta.value = nextState.value;
                    ta.selectionStart = nextState.start;
                    ta.selectionEnd = nextState.end;
                    ta.focus();
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                    if (CONFIG.previewEnabled) debounceUpdatePreview();
                    updateCharCount();
                    updateUndoRedoUI();
                    showDebugIndicator('Redone to next state.', 'success');
                    log('Redo to index ' + historyIndex);
                } else {
                    log('Redo: At end of history.');
                    showDebugIndicator('Already at latest state.', 'info');
                }
            } catch (err) {
                log('Redo error', err);
                showDebugIndicator('Redo failed; check console.', 'error');
                // Fallback to native
                document.execCommand('redo');
            }
        }
        // Setup initial history snapshot (synchronous, no debounce, ensure blank root)
        function setupHistory(ta) {
            try {
                const noteId = getNoteId(ta);
                loadNoteHistory(noteId); // Load persisted
                if (history.length === 0) {
                    const state = {
                        value: ta.value || '', // Ensure blank if empty
                        start: 0,
                        end: 0,
                        timestamp: Date.now()
                    };
                    history = [state];
                    historyIndex = 0;
                    saveNoteHistory(noteId);
                    log('Initial blank history snapshot set (sync for new note reliability).');
                } else {
                    // Sync check: If mismatch, rebuild from current
                    if (history[historyIndex].value !== ta.value) {
                        log('History mismatch on load; rebuilding from current.');
                        const state = {
                            value: ta.value,
                            start: ta.selectionStart,
                            end: ta.selectionEnd,
                            timestamp: Date.now()
                        };
                        history = [state];
                        historyIndex = 0;
                        saveNoteHistory(noteId);
                    }
                }
                updateUndoRedoUI();
            } catch (err) {
                log('History setup error', err);
                // Fallback: Reset to current
                history = [{value: ta.value, start: ta.selectionStart, end: ta.selectionEnd, timestamp: Date.now()}];
                historyIndex = 0;
            }
        }
        // Keyboard shortcuts (per-tab, checks focus) - extended for undo/redo + copy/paste/clear format
        function setupShortcuts() {
            try {
                // Remove existing listener to avoid duplicates in multi-tab/reload
                document.removeEventListener('keydown', handleKeydown);
                document.addEventListener('keydown', handleKeydown, true);
                log('Shortcuts set up.');
            } catch (err) {
                log('Shortcuts setup error', err);
            }
        }
        function handleKeydown(e) {
            try {
                if (!textarea || document.activeElement !== textarea) return;
                if (e.ctrlKey) {
                    if (e.key === 'b') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'bold-btn'; }).action(textarea);
                    } else if (e.key === 'i') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'italic-btn'; }).action(textarea);
                    } else if (e.key === 'u') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'underline-btn'; }).action(textarea);
                    } else if (e.key === 'z' && !e.shiftKey) {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'undo-btn'; }).action(textarea);
                    } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'redo-btn'; }).action(textarea);
                    } else if (e.shiftKey && e.key === 'C') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'copy-format-btn'; }).action(textarea);
                    } else if (e.shiftKey && e.key === 'V') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'paste-format-btn'; }).action(textarea);
                    } else if (e.shiftKey && e.key === 'X') {
                        e.preventDefault();
                        CONFIG.buttons.find(function(b) { return b.id === 'clear-format-btn'; }).action(textarea);
                    }
                }
            } catch (err) {
                log('Keydown handler error', err);
            }
        }
        // Manual force inject handler - defined early to avoid ReferenceError
        function setupManualTrigger() {
            try {
                if (manualTriggerHandler) return;
                manualTriggerHandler = function(e) {
                    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                        e.preventDefault();
                        const dialog = document.querySelector('.note-edit-dialog');
                        if (dialog) {
                            injectToolbar(dialog, true); // Force with banner
                            log('Manual trigger: Forced injection.');
                        } else {
                            showDebugIndicator('Manual trigger: No dialog open.', 'error');
                        }
                    }
                };
                document.addEventListener('keydown', manualTriggerHandler, true);
                log('Manual trigger (Ctrl+Shift+I) set up.');
            } catch (err) {
                log('Manual trigger setup error', err);
            }
        }
        // Dialog injection: Insert ribbon above textarea, preview below
        function injectToolbar(dialog, isManual) {
            if (typeof isManual === 'undefined') isManual = false;
            try {
                log('Attempting injection for dialog:', dialog);
                const content = dialog.querySelector('.ui-dialog-content');
                if (!content) {
                    log('No .ui-dialog-content found.');
                    return;
                }
                const headerSpan = content.querySelector('span');
                if (!headerSpan) {
                    log('No header span found.');
                    return;
                }
                textarea = content.querySelector('textarea');
                if (!textarea) {
                    log('No textarea found in content.');
                    return;
                }
                // Extract note ID for persistence
                const noteId = dialog.dataset.noteId || 'unknown';
                // Stable injection check: Use dataset attribute to prevent re-inject
                if (dialog.dataset.helperInjected === 'true') {
                    log('Dialog already injected (dataset check). Skipping.');
                    return;
                }
                // Remove any existing toolbar in content
                const existing = content.querySelector('#' + CONFIG.toolbarId);
                if (existing) {
                    existing.remove();
                    log('Removed existing toolbar.');
                }
                const tb = createToolbar();
                if (tb) {
                    content.insertBefore(tb, textarea); // Insert after header, before textarea
                    log('Formatting ribbon inserted above textarea.');
                } else {
                    log('Failed to create toolbar.');
                    return;
                }
                injectPreview(dialog);
                // Early textarea height adjustment for immediate fit
                resizeTextarea(textarea);
                // Enable vertical drag resizing on textarea
                textarea.style.resize = 'vertical';
                textarea.style.overflow = 'hidden';
                textarea.style.minHeight = '60px';
                // Mark as injected
                dialog.dataset.helperInjected = 'true';
                // New: Hook jQuery UI resizable events to detect manual resize (Danbooru uses jQuery)
                const $dialog = $(dialog);
                if ($dialog.resizable) {
                    $dialog.on('resizestart.nfh', function() {
                        manualResizeActive = true;
                        log('Manual dialog resize started.');
                    });
                    $dialog.on('resizestop.nfh', function() {
                        manualResizeActive = false;
                        log('Manual dialog resize stopped.');
                    });
                } else {
                    log('jQuery UI resizable not detected; manual resize flag unavailable.');
                }
                setupShortcuts(); // Re-setup for this textarea
                setupHistory(textarea); // Sync initial snapshot with persistence
                // Setup char count listener
                textarea.addEventListener('input', function(e) {
                    updateCharCount();
                    // Improved word-grouped undo/redo: debounced for typing (groups fast words/phrases), immediate on word boundary or button actions
                    saveState(this, false, e);
                    if (CONFIG.previewEnabled) debounceUpdatePreview();
                    // Dynamic textarea resize on input for scroll-free multi-line editing
                    resizeTextarea(this);
                    // Re-sync dialog height after content change (only if not during manual resize)
                    const dlg = this.closest('.note-edit-dialog');
                    if (dlg && CONFIG.autoResize.enabled && !manualResizeActive) {
                        setTimeout(() => autoResizeDialog(dlg), 50);
                    }
                });
                updateCharCount();
                // Auto-resize dialog immediately after insertion (reduced delay for faster new note setup)
                setTimeout(function() { autoResizeDialog(dialog); }, 100);
                // Setup ResizeObserver for dialog resize events (manual drag sync) - FIXED: Only sync textarea, no full autoResize to prevent snapping
                if ('ResizeObserver' in window && !dialogResizeObservers.has(dialog)) {
                    const resizeObserver = new ResizeObserver(function(entries) {
                        for (let entry of entries) {
                            if (entry.target === dialog) {
                                // Only adjust textarea height to content during manual dialog resize (no dialog snap-back)
                                if (textarea) resizeTextarea(textarea);
                            }
                        }
                    });
                    resizeObserver.observe(dialog);
                    dialogResizeObservers.set(dialog, resizeObserver);
                    log('ResizeObserver attached to dialog for textarea height sync only.');
                }
                // Setup ResizeObserver for textarea drag resize detection
                if ('ResizeObserver' in window && !taResizeObservers.has(textarea)) {
                    const taResizeObserver = new ResizeObserver(function(entries) {
                        for (let entry of entries) {
                            if (entry.target === textarea) {
                                // Adjust dialog on textarea drag resize (if auto-resize enabled)
                                const dlg = textarea.closest('.note-edit-dialog');
                                if (dlg && CONFIG.autoResize.enabled && !manualResizeActive) {
                                    setTimeout(() => autoResizeDialog(dlg), 50);
                                }
                            }
                        }
                    });
                    taResizeObserver.observe(textarea);
                    taResizeObservers.set(textarea, taResizeObserver);
                    log('ResizeObserver attached to textarea for drag height sync and dialog expansion.');
                }
                // Cleanup on dialog close - remove dataset, but keep copiedFormat global
                const observerCleanup = new MutationObserver(function(mutations) {
                    if (!document.body.contains(dialog)) {
                        const noteIdCleanup = dialog.dataset.noteId || 'unknown';
                        saveNoteHistory(noteIdCleanup); // Persist on close
                        activeDialogs.delete(dialog); // Track by reference now
                        if (toolbar) {
                            if (toolbar.parentNode) toolbar.remove();
                            toolbar = null;
                        }
                        if (previewDiv) {
                            if (previewDiv.parentNode) previewDiv.remove();
                            previewDiv = null;
                        }
                        if (textarea) {
                            // Disconnect textarea ResizeObserver
                            const taRO = taResizeObservers.get(textarea);
                            if (taRO) {
                                taRO.disconnect();
                                taResizeObservers.delete(textarea);
                            }
                            textarea = null;
                        }
                        // Disconnect ResizeObserver
                        const ro = dialogResizeObservers.get(dialog);
                        if (ro) {
                            ro.disconnect();
                            dialogResizeObservers.delete(dialog);
                        }
                        // Unbind jQuery events
                        const $dialog = $(dialog);
                        $dialog.off('.nfh');
                        delete dialog.dataset.helperInjected;
                        delete dialog.dataset.helperResized;
                        closeAllPickers();
                        closeResizeSettings();
                        closeHistoryModal();
                        observerCleanup.disconnect();
                        log('Cleaned up for closed dialog.');
                    }
                });
                observerCleanup.observe(document.body, { childList: true, subtree: true });
                // Only show banner on first auto or manual
                if (isManual || !activeDialogs.has(dialog)) {
                    log('Ribbon injected above textarea for dialog.');
                    showDebugIndicator('Word-like Ribbon Injected (Note Utils group added)! DOM-based CF (accurate attrs/nested/partial), Snippets Manager (preview/edit/delete/export/import), Eyedropper (Firefox+ColorZilla), Live Preview (default on, fixed toggle), Char Count, SFX Ref, Drag-to-Set Size Modal, Change Case, Gradient Outline, Draggable Textarea Height available.', 'success');
                }
                activeDialogs.add(dialog); // Track by reference for multi-dialog
            } catch (err) {
                log('Injection error', err);
                showDebugIndicator('Injection Failed - Check Console. Try Ctrl+Shift+I.', 'error');
                // Autonomous recovery: Poll will retry
            }
        }
        // Debug indicator: Temporary overlay for visibility issues
        function showDebugIndicator(message, type) {
            if (typeof type === 'undefined') type = 'info';
            try {
                if (!debugMode) return;
                var indicator = document.getElementById('debug-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.id = 'debug-indicator';
                    document.body.appendChild(indicator);
                }
                indicator.textContent = '[NoteFmtHelper] ' + message;
                indicator.style.background = (type === 'error') ? '#ffcccc' : (type === 'success') ? '#ccffcc' : (type === 'warning') ? '#fff3cd' : '#ffeb3b';
                indicator.style.display = 'block';
                setTimeout(function() { indicator.style.display = 'none'; }, 5000); // Shorter now to reduce spam
                log(message);
            } catch (err) {
                console.error('[NoteFmtHelper] Debug indicator error', err);
            }
        }
        // Main observer for dialog detection (subtree for nested changes)
        function setupObserver() {
            try {
                if (observer) {
                    log('Observer already set up.');
                    return;
                }
                observer = new MutationObserver(function(mutations) {
                    var detected = false;
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1 && node.matches && node.matches('.note-edit-dialog')) {
                                    log('Dialog added via observer:', node);
                                    detected = true;
                                    setTimeout(function() { injectToolbar(node); }, 100); // Reduced delay for faster new note setup
                                }
                            });
                        }
                    });
                    if (detected) log('Observer triggered injection.');
                });
                observer.observe(document.body, { childList: true, subtree: true });
            } catch (err) {
                log('Observer setup error', err);
            }
        }
        // Fallback poll for edge cases (e.g., observer misses, multi-tab glitches) - faster for persistence
        var pollInterval = null;
        function startPoll() {
            try {
                if (pollInterval) return;
                pollInterval = setInterval(function() {
                    const dialogs = document.querySelectorAll('.note-edit-dialog');
                    if (dialogs.length === 0) {
                        if (toolbar) {
                            toolbar.remove();
                            toolbar = null;
                            activeDialogs.clear();
                            log('No dialogs; cleaned up.');
                        }
                        return;
                    }
                    dialogs.forEach(function(dialog) {
                        // Use dataset check here too
                        if (dialog.dataset.helperInjected !== 'true') {
                            const content = dialog.querySelector('.ui-dialog-content');
                            const ta = content ? content.querySelector('textarea') : null;
                            if (content && ta) {
                                log('Poll detected eligible dialog:', dialog);
                                injectToolbar(dialog);
                            }
                        }
                    });
                }, 3000); // Slower poll (3s) now that dataset prevents retry
                log('Poll started (every 3s).');
            } catch (err) {
                log('Poll start error', err);
            }
        }
        // Multi-tab sync on focus
        window.addEventListener('focus', function() {
            if (textarea) {
                const noteId = getNoteId(textarea);
                loadNoteHistory(noteId);
                updateUndoRedoUI();
            }
            setTimeout(function() {
                if (pollInterval) clearInterval(pollInterval);
                startPoll();
            }, 100);
        });
        // Init: Robust, multi-tab safe - load configs first
        function init() {
            try {
                loadConfigs(); // Load user settings first
                injectStyles();
                setupManualTrigger(); // Defined early, no ReferenceError
                setTimeout(setupObserver, 2000); // Delay observer to avoid interference with initial note drag mode
                startPoll(); // Poll starts immediately for reliability
                showDebugIndicator('Script Loaded v' + CONFIG.version + '! Note Utils Group, Enhanced Preview, Drag-to-Set Size, Change Case, Gradient Outline, Draggable Textarea ready. Ctrl+Shift+I to force.', 'info');
                log('Note Formatting Helper v' + CONFIG.version + ' initialized. Ready for multi-tab use. Open DevTools > Console to monitor logs.');
            } catch (err) {
                console.error('[NoteFmtHelper] Init error:', err);
                showDebugIndicator('Init error - script partially loaded. Try Ctrl+Shift+I on dialog open.', 'error');
            }
        }
        // DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
        // Handle page navigation (Danbooru hash changes)
        window.addEventListener('hashchange', function(e) {
            setTimeout(function() {
                if (pollInterval) clearInterval(pollInterval);
                startPoll();
            }, 500);
            log('Page navigated; re-setup observers.');
        });
    } catch (globalErr) {
        console.error('[NoteFmtHelper] Global error - script failed to load:', globalErr);
        // Fallback: Create minimal debug indicator
        const indicator = document.createElement('div');
        indicator.id = 'debug-indicator';
        indicator.style.cssText = 'position:fixed;top:10px;right:10px;background:#ffcccc;color:#000;padding:5px;border:1px solid #ccc;z-index:9999;';
        indicator.textContent = '[NoteFmtHelper] Fatal error - reinstall script. Check console.';
        document.body.appendChild(indicator);
    }
})();