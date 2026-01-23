// ==UserScript==
// @name         MaNKeY-Bot: 1337x Comment Assistant [ABANDONED - UNTESTED]
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  [ABANDONED] Uploader tool for managing comments on 1337x. Original author banned - use at your own risk. Community contributions welcome!
// @author       MankeyDoodle (Original), Community Maintained
// @match        https://1337x.to/*
// @match        https://www.1337x.to/*
// @match        https://1337x.st/*
// @match        https://www.1337x.st/*
// @match        https://x1337x.ws/*
// @match        https://www.x1337x.ws/*
// @match        https://x1337x.eu/*
// @match        https://www.x1337x.eu/*
// @match        https://x1337x.se/*
// @match        https://www.x1337x.se/*
// @match        https://x1337x.cc/*
// @match        https://www.x1337x.cc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @license      MIT
// @homepageURL  https://github.com/MankeyDoodle/MaNKeY-Bot-1337x-Comment-Assistant
// @supportURL   https://github.com/MankeyDoodle/MaNKeY-Bot-1337x-Comment-Assistant/issues
// @downloadURL https://update.greasyfork.org/scripts/563593/MaNKeY-Bot%3A%201337x%20Comment%20Assistant%20%5BABANDONED%20-%20UNTESTED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/563593/MaNKeY-Bot%3A%201337x%20Comment%20Assistant%20%5BABANDONED%20-%20UNTESTED%5D.meta.js
// ==/UserScript==

/*
 * ========================================
 * ===== PROJECT STATUS: ABANDONED =====
 * ========================================
 *
 * This project is NO LONGER ACTIVELY MAINTAINED by the original author.
 *
 * WHY: The original developer (MankeyDoodle) was banned from 1337x before
 * this script could be properly tested and released. This script is being
 * uploaded to preserve all the work done by MankeyDoodle and UncleSamurott,
 * despite the ban.
 *
 * TESTING LIMITATIONS:
 *   - Many recently implemented features have NOT been fully tested
 *   - The script requires uploader account verification on 1337x to function
 *     properly, which is no longer possible due to the ban
 *   - This script was primarily tested on Google Chrome - browser-specific
 *     bugs on Firefox, Safari, Edge, etc. were NOT tested
 *   - This was the developer's first attempt at creating a public userscript
 *
 * USE AT YOUR OWN RISK:
 *   - Some features may be buggy or incomplete
 *   - No support will be provided by the original author
 *   - The code is provided AS-IS
 *
 * COMMUNITY CONTRIBUTIONS WELCOME:
 *   - Feel free to fork this project
 *   - Pull requests are welcome (though may not be reviewed)
 *   - Use this code for personal projects
 *   - Learn from it, modify it, make it your own!
 *
 * ===== DISCLAIMER =====
 *
 * This script is an INDEPENDENT, OPEN-SOURCE project.
 * It is NOT affiliated with, endorsed by, or related to 1337x in any way.
 * The authors have no connection to 1337x staff or administration.
 * Use at your own discretion.
 *
 * ===== INSTALLATION INSTRUCTIONS =====
 *
 * This script requires a userscript manager. Here are your options:
 *
 * CHROME / EDGE / BRAVE / OPERA:
 *   - Tampermonkey (Recommended): https://www.tampermonkey.net/
 *   - Violentmonkey: https://violentmonkey.github.io/
 *
 * FIREFOX:
 *   - Tampermonkey: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
 *   - Violentmonkey: https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
 *   - Greasemonkey: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
 *
 * SAFARI:
 *   - Userscripts: https://apps.apple.com/app/userscripts/id1463298887
 *
 * HOW TO INSTALL:
 *   1. Install one of the userscript managers above for your browser
 *   2. Click on the userscript manager icon in your browser toolbar
 *   3. Select "Create a new script" or "Add new script"
 *   4. Delete any default code and paste this entire script
 *   5. Save the script (Ctrl+S or Cmd+S)
 *   6. Visit any 1337x page - the script will activate automatically!
 *
 * FEATURES:
 *   - Block users (hard block hides comments, soft block highlights)
 *   - Trust users (green highlight for friends/helpers)
 *   - Keyword filtering to auto-hide specific content
 *   - Quick reply templates for fast responses
 *   - Custom tags displayed next to usernames
 *   - Themes and full appearance customization
 *   - Export/Import your settings and lists
 *
 * ===== ORIGINAL AUTHORS =====
 *   - MankeyDoodle (MNKYDDL) - Creator & Lead Developer
 *   - UncleSamurott - Co-Developer
 */

(function() {
  "use strict";
  const styles = `/* Main stylesheet - imports all CSS modules */

/* Base variables and reset */

/* ========== CSS CUSTOM PROPERTIES ========== */

:root {
  /* Core colors */
  --xcb-highlight-color: #ff6b6b;
  --xcb-highlight-bg: rgba(255, 107, 107, 0.15);
  --xcb-trusted-color: #4ade80;
  --xcb-trusted-bg: rgba(74, 222, 128, 0.15);
  --xcb-blocked-color: #ff6b6b;
  --xcb-keyword-color: #f59e0b;
  --xcb-keyword-bg: rgba(245, 158, 11, 0.15);

  /* Panel colors */
  --xcb-panel-bg: #1a1a2e;
  --xcb-panel-secondary-bg: #2a2a3e;
  --xcb-panel-tertiary-bg: #333;
  --xcb-panel-hover-bg: #3a3a4e;
  --xcb-panel-border: #444;
  --xcb-panel-border-light: #555;
  --xcb-panel-text: #fff;
  --xcb-panel-text-muted: #888;
  --xcb-panel-text-secondary: #aaa;
  --xcb-panel-text-dim: #666;

  /* Blue accent (setup, tour, primary actions) */
  --xcb-blue: #3b82f6;
  --xcb-blue-hover: #2563eb;

  /* Status colors */
  --xcb-success: #22c55e;
  --xcb-success-hover: #16a34a;
  --xcb-danger: #dc2626;
  --xcb-warning: #f59e0b;

  /* Action button colors (Reply, Request, Note buttons on comments) */
  --xcb-button-reply: #3b82f6;
  --xcb-button-request: #14b8a6;
  --xcb-button-note: #8b5cf6;

  /* Button text colors (for light/pastel theme support) */
  --xcb-primary-text: #ffffff;
  --xcb-danger-text: #ffffff;
  --xcb-button-reply-text: #ffffff;
  --xcb-button-request-text: #ffffff;
  --xcb-button-note-text: #ffffff;

  /* Badge colors */
  --xcb-badge-spammer: #dc2626;
  --xcb-badge-rude: #9333ea;
  --xcb-badge-beggar: #ea580c;
  --xcb-badge-offtopic: #0891b2;
  --xcb-badge-troll: #65a30d;

  /* Notes/requests colors */
  --xcb-notes-color: #8b5cf6;
  --xcb-notes-hover: #7c3aed;
  --xcb-archive-color: #6366f1;
  --xcb-request-color: #14b8a6;
  --xcb-request-hover: #0d9488;
}

/* User and reason badges */

/* ========== USER BADGES ========== */

.xcb-blocked {
  color: var(--xcb-highlight-color) !important;
  font-weight: bold !important;
  text-decoration: line-through !important;
}

.xcb-blocked::after {
  content: " \\1F6AB";
  font-size: 0.8em;
}

.xcb-soft-blocked {
  color: var(--xcb-highlight-color) !important;
  font-weight: bold !important;
}

.xcb-soft-blocked::after {
  content: " \\26A0";
  font-size: 0.8em;
}

.xcb-trusted {
  color: var(--xcb-trusted-color) !important;
  font-weight: bold !important;
}

.xcb-trusted::after {
  content: " \\2713";
  font-size: 0.8em;
}

/* ========== USER BADGE PILLS ========== */

.xcb-user-badge {
  display: inline-block;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 5px;
}

.xcb-badge-hard {
  background: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-badge-soft {
  background: transparent;
  border: 1px solid var(--xcb-highlight-color);
  color: var(--xcb-highlight-color);
}

.xcb-badge-temp {
  background: var(--xcb-warning);
  color: #000;
}

/* ========== REASON BADGES ========== */

.xcb-reason-badge {
  display: inline-block;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: bold;
  margin-top: 3px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.xcb-inline-tags .xcb-reason-badge {
  font-size: 10px;
  padding: 2px 6px;
  margin: 0 2px;
}

.xcb-reason-spammer {
  background: var(--xcb-badge-spammer);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-rude {
  background: var(--xcb-badge-rude);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-beggar {
  background: var(--xcb-badge-beggar);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-offtopic {
  background: var(--xcb-badge-offtopic);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-troll {
  background: var(--xcb-badge-troll);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-annoying {
  background: var(--xcb-badge-annoying);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-uploader {
  background: var(--xcb-badge-uploader);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-helpful {
  background: var(--xcb-badge-helpful);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-moderator {
  background: var(--xcb-badge-moderator);
  color: #000;
}

.xcb-reason-requester {
  background: var(--xcb-badge-requester);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-friend {
  background: var(--xcb-badge-friend);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-seeding {
  background: var(--xcb-badge-seeding);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-thankful {
  background: var(--xcb-badge-thankful);
  color: var(--xcb-btn-text, #fff);
}

.xcb-reason-unwanted {
  background: var(--xcb-badge-unwanted);
  color: var(--xcb-btn-text, #fff);
}

/* ========== FIRST TIMER TAG ========== */

.xcb-first-timer-tag {
  display: inline-block;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000 !important;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
  margin-left: 8px;
  cursor: pointer;
  vertical-align: middle;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  text-shadow: none;
}

.xcb-first-timer-tag:hover {
  background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* ========== BADGE PREVIEW ITEMS ========== */

.xcb-badge-preview-item,
.xcb-badge-color-preview,
.xcb-badge-font-preview {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* All button styles */

/* ========== INLINE BUTTONS ========== */

.xcb-btns {
  display: inline-flex;
  gap: 3px;
  margin-left: 5px;
}

.xcb-btn-block {
  background: transparent;
  color: var(--xcb-highlight-color);
  border: 1px solid var(--xcb-highlight-color);
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 10px;
}

.xcb-btn-block:hover {
  background: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-btn-trust {
  background: transparent;
  color: var(--xcb-trusted-color);
  border: 1px solid var(--xcb-trusted-color);
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 10px;
}

.xcb-btn-trust:hover {
  background: var(--xcb-trusted-color);
  color: var(--xcb-btn-text, #fff);
}

/* ========== FLOAT BUTTON ========== */

.xcb-float-btn {
  position: fixed;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--xcb-panel-bg);
  border: 2px solid var(--xcb-accent-danger, #ef4444);
  color: var(--xcb-panel-text, #fff);
  font-size: 20px;
  cursor: pointer;
  z-index: 99998;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Ensure float button icon is fully opaque */

.xcb-float-btn i {
  opacity: 1;
}

.xcb-float-btn.xcb-pos-bottom-right {
  bottom: 20px;
  right: 20px;
}

.xcb-float-btn.xcb-pos-bottom-left {
  bottom: 20px;
  left: 20px;
}

.xcb-float-btn.xcb-pos-top-right {
  top: 20px;
  right: 20px;
}

.xcb-float-btn.xcb-pos-top-left {
  top: 20px;
  left: 20px;
}

/* ========== PROFILE BUTTONS ========== */

.xcb-profile-btn {
  display: inline-block;
  background: var(--xcb-panel-tertiary-bg);
  border: 2px solid var(--xcb-highlight-color);
  color: var(--xcb-panel-text);
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 5px 10px 0;
  font-size: 14px;
}

.xcb-profile-btn:hover {
  background: var(--xcb-highlight-color);
}

.xcb-profile-btn-trust {
  border-color: var(--xcb-trusted-color);
}

.xcb-profile-btn-trust:hover {
  background: var(--xcb-trusted-color);
}

/* ========== SHOW/COLLAPSE BUTTONS ========== */

.xcb-show-btn {
  background: var(--xcb-panel-border);
  color: var(--xcb-panel-text);
  border: 1px solid var(--xcb-primary);
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 11px;
  margin-left: 10px;
}

.xcb-show-btn:hover {
  background: var(--xcb-panel-border-light);
}

.xcb-collapse-btn {
  background: var(--xcb-panel-tertiary-bg);
  border: 1px solid var(--xcb-primary);
  color: var(--xcb-panel-text);
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  margin-left: 10px;
}

.xcb-collapse-btn:hover {
  background: var(--xcb-primary);
}

/* ========== EDIT BUTTON ========== */

.xcb-edit-btn {
  background: transparent;
  color: var(--xcb-panel-text-muted);
  border: 1px solid var(--xcb-panel-border-light);
  font-size: 10px;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: 5px;
}

.xcb-edit-btn:hover {
  color: var(--xcb-panel-text);
  border-color: var(--xcb-panel-text-muted);
}

/* ========== IMPORT/EXPORT BUTTONS ========== */

.xcb-io-btn,
label.xcb-io-btn {
  background: var(--xcb-section-bg, #2a2a3e);
  color: var(--xcb-text, var(--xcb-panel-text-secondary, #aaa)) !important;
  border: 1px solid var(--xcb-input-border, #555);
  font-size: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  min-height: 36px;
  box-sizing: border-box;
  margin-bottom: 0;
}

.xcb-io-btn:hover {
  background: var(--xcb-hover-bg, #3a3a4e);
  border-color: var(--xcb-border, #666);
}

/* ========== CANCEL BUTTONS ========== */

.xcb-cancel-btn {
  background: var(--xcb-section-bg, #444) !important;
  color: var(--xcb-text, #fff) !important;
  border: 1px solid var(--xcb-input-border, #555);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.xcb-cancel-btn:hover {
  background: var(--xcb-hover-bg, #555);
  border-color: var(--xcb-border, #666);
}

/* Cancel button in edit mode (block/trust lists) */

.xcb-cancel-edit-btn {
  background: var(--xcb-section-bg, #444) !important;
  color: var(--xcb-text, #fff) !important;
  border: 1px solid var(--xcb-input-border, #555);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.xcb-cancel-edit-btn:hover {
  background: var(--xcb-hover-bg, #555);
  border-color: var(--xcb-border, #666);
}

/* ========== SECONDARY BUTTONS ========== */

.xcb-secondary-btn {
  background: var(--xcb-section-bg, #2a2a3e) !important;
  color: var(--xcb-text, var(--xcb-panel-text-secondary, #aaa)) !important;
  border: 1px solid var(--xcb-input-border, rgba(255, 255, 255, 0.2));
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  min-height: 32px;
  box-sizing: border-box;
}

.xcb-secondary-btn:hover {
  background: var(--xcb-hover-bg, #3a3a4e);
}

/* ========== ACCENT BUTTONS (Warning, Danger, Purple) ========== */

.xcb-warning-btn {
  background: var(--xcb-accent-warning, #f59e0b) !important;
  color: var(--xcb-btn-text, #fff) !important;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  min-height: 36px;
  box-sizing: border-box;
}

.xcb-danger-btn {
  background: var(--xcb-accent-danger, #dc2626) !important;
  color: var(--xcb-btn-text, #fff) !important;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  min-height: 32px;
  box-sizing: border-box;
}

.xcb-danger-btn-dark {
  background: var(--xcb-accent-danger-dark, #7f1d1d) !important;
  color: var(--xcb-btn-text, #fff) !important;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 10px 16px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}

.xcb-purple-btn {
  background: var(--xcb-accent-purple, #8b5cf6) !important;
  color: var(--xcb-btn-text, #fff) !important;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  min-height: 36px;
  box-sizing: border-box;
}

/* ========== SAVE NOTE BUTTON ========== */

.xcb-save-note-btn {
  background: var(--xcb-trusted-color);
  color: var(--xcb-btn-text-dark, #000) !important; /* Dark text for contrast on bright green */
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 3px 8px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  margin-top: 5px;
}

/* ========== QUICK REPLY BUTTON ========== */

.xcb-quick-reply-btn {
  background: var(--xcb-button-reply, var(--xcb-blue));
  color: var(--xcb-button-reply-text, #fff);
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 11px;
  margin-left: 5px;
}

.xcb-quick-reply-btn:hover {
  background: var(--xcb-blue-hover);
}

/* ========== HELP TOGGLE ========== */

.xcb-help-toggle {
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-text-dim);
  color: var(--xcb-panel-text-secondary);
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.xcb-help-toggle:hover {
  border-color: var(--xcb-panel-text-muted);
  color: var(--xcb-panel-text);
  background: var(--xcb-panel-border);
}

/* ========== SETUP BUTTON ========== */

.xcb-setup-btn {
  background: var(--xcb-primary, var(--xcb-blue));
  color: var(--xcb-primary-text, #fff);
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 12px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.xcb-setup-btn:hover {
  background: var(--xcb-blue-hover);
}

.xcb-setup-btn:disabled {
  background: var(--xcb-panel-border-light);
  cursor: not-allowed;
}

/* ========== ADD REQUEST/NOTE BUTTONS ========== */

.xcb-add-request-btn {
  background: var(--xcb-button-request, var(--xcb-request-color));
  color: var(--xcb-button-request-text, #fff);
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.xcb-add-request-btn:hover {
  background: var(--xcb-request-hover);
}

.xcb-add-note-btn {
  background: var(--xcb-button-note, var(--xcb-notes-color));
  color: var(--xcb-button-note-text, #fff);
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.xcb-add-note-btn:hover {
  background: var(--xcb-notes-hover);
}

/* ========== CLEAR FILTERS ========== */

.xcb-clear-filters {
  background: var(--xcb-panel-border);
  border: 1px solid var(--xcb-panel-border-light, rgba(255, 255, 255, 0.1));
  color: var(--xcb-panel-text);
  cursor: pointer;
  border-radius: 3px;
}

.xcb-clear-filters:hover {
  background: var(--xcb-panel-border-light);
}

/* Panels, overlays, modals */

/* ========== OVERLAY ========== */

.xcb-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;
}

/* ========== MAIN PANEL ========== */

.xcb-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--xcb-panel-bg);
  border: 2px solid var(--xcb-primary);
  padding: 20px;
  z-index: 100000;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: var(--xcb-panel-text);
  font-family: Arial, sans-serif;
}

.xcb-panel h3 {
  margin-top: 0;
  color: var(--xcb-primary);
}

/* ========== PANEL HEADER ========== */

.xcb-panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: -20px -20px 20px -20px;
  padding: 20px 24px;
  background: linear-gradient(180deg, var(--xcb-panel-tertiary-bg, var(--xcb-panel-secondary-bg)) 0%, var(--xcb-panel-secondary-bg) 100%);
  border-bottom: 2px solid var(--xcb-primary);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-height: 60px;
}

.xcb-panel-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: var(--xcb-primary);
  text-align: center;
  letter-spacing: 1px;
  text-transform: none;
  line-height: 1.2;
  flex: 1;
  padding: 0 40px;
}

.xcb-panel-header h2 i {
  margin-right: 12px;
  font-size: 32px;
  vertical-align: middle;
}

.xcb-close-panel {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid transparent;
  color: var(--xcb-panel-text-muted);
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.xcb-close-panel:hover {
  background: var(--xcb-danger);
  border-color: var(--xcb-danger);
  color: var(--xcb-btn-text, #fff);
}

.xcb-close-panel i {
  font-size: 14px;
  line-height: 1;
}

.xcb-panel input[type="text"],
.xcb-panel select {
  padding: 8px;
  margin-right: 5px;
  border: 1px solid var(--xcb-panel-border);
  background: var(--xcb-panel-secondary-bg);
  color: var(--xcb-input-text);
  border-radius: 3px;
}

.xcb-panel input[type="file"] {
  color: var(--xcb-panel-text);
}

.xcb-panel button {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid var(--xcb-panel-border-light, rgba(255, 255, 255, 0.1));
}

.xcb-panel .xcb-add-btn,
.xcb-panel label.xcb-add-btn {
  background: var(--xcb-primary);
  color: var(--xcb-primary-text, #fff);
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  line-height: 1.4;
  border-radius: 3px;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.15));
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  height: 36px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.xcb-panel .xcb-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  color: var(--xcb-panel-text-muted);
  font-size: 18px;
  width: 24px;
  height: 24px;
  padding: 0;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
  z-index: 10;
}

.xcb-panel .xcb-close-btn:hover {
  background: var(--xcb-panel-border);
  color: var(--xcb-panel-text);
}

.xcb-panel ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 0;
}

.xcb-panel li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid var(--xcb-panel-tertiary-bg);
  flex-wrap: wrap;
  gap: 5px;
}

.xcb-panel .xcb-remove-btn {
  background: transparent;
  color: var(--xcb-danger);
  border: 1px solid var(--xcb-danger);
  font-size: 11px;
  padding: 3px 8px;
}

/* ========== PANEL SIZE VARIANTS ========== */

.xcb-panel-small {
  width: 400px !important;
  max-height: 70vh !important;
  font-size: 12px;
}

.xcb-panel-small .xcb-section {
  padding: 8px;
  margin: 10px 0;
}

.xcb-panel-medium {
  width: 500px !important;
  max-height: 85vh !important;
}

.xcb-panel-large {
  width: 650px !important;
  max-height: 90vh !important;
}

.xcb-panel-large .xcb-section {
  padding: 15px;
}

.xcb-panel-custom {
  /* Custom size applied via inline styles */
}

/* ========== RESIZE HANDLE ========== */

.xcb-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 40%,
    var(--xcb-primary) 40%,
    var(--xcb-primary) 45%,
    transparent 45%,
    transparent 55%,
    var(--xcb-primary) 55%,
    var(--xcb-primary) 60%,
    transparent 60%,
    transparent 70%,
    var(--xcb-primary) 70%,
    var(--xcb-primary) 75%,
    transparent 75%
  );
  border-radius: 0 0 6px 0;
  z-index: 10;
  opacity: 0.7;
}

.xcb-resize-handle:hover {
  opacity: 1;
  background: linear-gradient(
    135deg,
    transparent 40%,
    #fff 40%,
    #fff 45%,
    transparent 45%,
    transparent 55%,
    #fff 55%,
    #fff 60%,
    transparent 60%,
    transparent 70%,
    #fff 70%,
    #fff 75%,
    transparent 75%
  );
}

/* ========== PANEL LINKS ========== */

.xcb-panel-link {
  color: var(--xcb-panel-text) !important;
  text-decoration: none;
}

.xcb-panel-link:hover {
  color: var(--xcb-primary) !important;
  text-decoration: underline;
}

.xcb-panel-link-trust {
  color: var(--xcb-trusted-color) !important;
}

.xcb-panel-link-block {
  color: var(--xcb-blocked-color) !important;
}

/* ========== SETUP PANEL ========== */

.xcb-setup-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--xcb-panel-bg);
  border: 2px solid var(--xcb-blue);
  padding: 25px;
  z-index: 100000;
  border-radius: 10px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  color: var(--xcb-panel-text);
  font-family: Arial, sans-serif;
  text-align: center;
}

.xcb-setup-panel h2 {
  margin: 0 0 10px 0;
  color: var(--xcb-blue);
}

.xcb-setup-panel p {
  color: var(--xcb-panel-text-secondary);
  font-size: 13px;
  margin: 10px 0;
}

.xcb-setup-panel input {
  width: 100%;
  padding: 12px;
  margin: 15px 0;
  border: 1px solid var(--xcb-panel-border);
  background: var(--xcb-panel-secondary-bg);
  color: var(--xcb-panel-text);
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.xcb-setup-panel input:focus {
  border-color: var(--xcb-blue);
  outline: none;
}

.xcb-setup-error {
  color: var(--xcb-highlight-color);
  font-size: 12px;
  margin-top: 10px;
}

.xcb-setup-example {
  background: var(--xcb-panel-secondary-bg);
  padding: 8px;
  border-radius: 5px;
  font-size: 11px;
  color: var(--xcb-panel-text-muted);
  margin: 10px 0;
  word-break: break-all;
}

/* Setup panel theme overrides for inline styles */

.xcb-setup-panel label[style*="background: #2a2a3e"],
.xcb-setup-panel label[style*="background:#2a2a3e"],
.xcb-setup-panel div[style*="background: #2a2a3e"],
.xcb-setup-panel div[style*="background:#2a2a3e"] {
  background: var(--xcb-panel-secondary-bg) !important;
}

.xcb-setup-panel select[style*="background: #1a1a2e"],
.xcb-setup-panel select[style*="background:#1a1a2e"],
.xcb-setup-panel input[style*="background: #1a1a2e"],
.xcb-setup-panel input[style*="background:#1a1a2e"] {
  background: var(--xcb-panel-bg) !important;
  color: var(--xcb-panel-text) !important;
  border-color: var(--xcb-panel-border) !important;
}

.xcb-setup-panel [style*="color: #aaa"],
.xcb-setup-panel [style*="color:#aaa"] {
  color: var(--xcb-panel-text-secondary) !important;
}

.xcb-setup-panel [style*="color: #fff"],
.xcb-setup-panel [style*="color:#fff"] {
  color: var(--xcb-panel-text) !important;
}

.xcb-setup-panel button[style*="background: #333"],
.xcb-setup-panel button[style*="background:#333"] {
  background: var(--xcb-panel-tertiary-bg) !important;
  color: var(--xcb-panel-text-secondary) !important;
  border-color: var(--xcb-panel-border-light) !important;
}

.xcb-setup-panel [style*="color: #666"],
.xcb-setup-panel [style*="color:#666"] {
  color: var(--xcb-panel-text-dim) !important;
}

/* ========== PROFILE INDICATOR ========== */

.xcb-profile-indicator {
  display: inline-block;
  background: var(--xcb-highlight-bg);
  border: 2px solid var(--xcb-highlight-color);
  color: var(--xcb-highlight-color);
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: bold;
  margin: 10px 0;
}

.xcb-profile-indicator-trust {
  background: var(--xcb-trusted-bg);
  border-color: var(--xcb-trusted-color);
  color: var(--xcb-trusted-color);
}

/* ========== HIDDEN COUNTER ========== */

.xcb-hidden-counter {
  position: fixed;
  bottom: 70px;
  right: 20px;
  background: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  z-index: 99997;
  cursor: pointer;
}

/* ========== SIZE SELECT ========== */

.xcb-size-select {
  padding: 5px 10px;
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-input-text);
  border-radius: 3px;
  cursor: pointer;
}

/* ========== JUMP TO TOP BUTTON ========== */

.xcb-jump-to-top {
  position: absolute;
  bottom: 20px;
  right: 28px;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 16px !important;
  line-height: 36px;
  text-align: center;
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text-muted);
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.15s ease;
  z-index: 150;
}

.xcb-jump-to-top:hover {
  background: var(--xcb-panel-hover-bg);
  border-color: var(--xcb-accent-success, #22c55e);
  color: var(--xcb-accent-success, #22c55e);
}

.xcb-jump-to-top i {
  font-size: 16px !important;
  line-height: 1;
}

/* ========== PANEL UTILITY BUTTONS ========== */

/* Outlined button - transparent bg with colored border/text */

.xcb-panel-btn-outline {
  padding: 4px 10px;
  font-size: 10px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  cursor: pointer;
}

/* Secondary button - subtle background */

.xcb-panel-btn-secondary {
  padding: 4px 10px;
  font-size: 10px;
  background: var(--xcb-panel-secondary-bg, #333);
  border: 1px solid var(--xcb-panel-border, #555);
  color: var(--xcb-panel-text-secondary, #aaa);
  border-radius: 4px;
  cursor: pointer;
}

.xcb-panel-btn-secondary:hover {
  background: var(--xcb-panel-hover-bg, #444);
  color: var(--xcb-panel-text, #fff);
}

/* Muted text utility */

.xcb-text-muted {
  color: var(--xcb-panel-text-muted, #888);
}

.xcb-text-secondary {
  color: var(--xcb-panel-text-secondary, #aaa);
}

/* Section/filter buttons that need theme support */

.xcb-section-filter-btn {
  padding: 4px 10px;
  font-size: 10px;
  border-radius: 4px;
  cursor: pointer;
  background: var(--xcb-panel-secondary-bg, #333);
  border: 1px solid;
  transition: all 0.15s ease;
}

.xcb-note-filter-tag {
  padding: 3px 8px;
  font-size: 10px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 600;
  /* Background and text color set via inline style from tag color */
}

.xcb-note-filter-tag:hover {
  filter: brightness(1.15);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.xcb-note-filter-tag.active {
  box-shadow: 0 0 0 2px var(--xcb-panel-bg, #1a1a2e), 0 0 0 4px currentColor;
}

/* ========== QUICK NAV (Floating above float button) ========== */

.xcb-quick-nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 99997;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

/* Position classes for quick nav - matches float button positions */

.xcb-quick-nav.xcb-pos-bottom-right {
  bottom: 75px;
  right: 20px;
}

.xcb-quick-nav.xcb-pos-bottom-left {
  bottom: 75px;
  left: 20px;
}

.xcb-quick-nav.xcb-pos-top-right {
  top: 75px;
  right: 20px;
}

.xcb-quick-nav.xcb-pos-top-left {
  top: 75px;
  left: 20px;
}

.xcb-quick-nav.xcb-nav-hidden {
  transform: translateX(50px);
  opacity: 0;
  pointer-events: none;
}

.xcb-quick-nav.xcb-pos-bottom-left.xcb-nav-hidden,
.xcb-quick-nav.xcb-pos-top-left.xcb-nav-hidden {
  transform: translateX(-50px);
}

.xcb-quick-nav-toggle {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: var(--xcb-panel-text, #fff);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 99997;
  transition: background 0.15s ease, transform 0.2s ease;
}

/* Toggle button positions - next to float button, not quick nav */

.xcb-quick-nav-toggle.xcb-pos-bottom-right {
  bottom: 24px;
  right: 75px;
}

.xcb-quick-nav-toggle.xcb-pos-bottom-left {
  bottom: 24px;
  left: 75px;
}

.xcb-quick-nav-toggle.xcb-pos-top-right {
  top: 24px;
  right: 75px;
}

.xcb-quick-nav-toggle.xcb-pos-top-left {
  top: 24px;
  left: 75px;
}

.xcb-quick-nav-toggle:hover {
  background: var(--xcb-primary, #3b82f6);
  color: #fff;
}

.xcb-quick-nav-toggle.xcb-nav-collapsed {
  transform: rotate(180deg);
}

/* Adjust toggle rotation for left-side positions */

.xcb-quick-nav-toggle.xcb-pos-bottom-left,
.xcb-quick-nav-toggle.xcb-pos-top-left {
  transform: rotate(180deg);
}

.xcb-quick-nav-toggle.xcb-pos-bottom-left.xcb-nav-collapsed,
.xcb-quick-nav-toggle.xcb-pos-top-left.xcb-nav-collapsed {
  transform: rotate(0deg);
}

.xcb-nav-tab-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.15s ease;
  position: relative;
}

/* Ensure icons are solid white */

.xcb-nav-tab-btn i {
  color: #fff;
  opacity: 1;
}

.xcb-nav-tab-btn:hover {
  background: var(--xcb-hover-bg, #3a3a4e);
  color: #fff;
  border-color: var(--xcb-primary, #3b82f6);
}

.xcb-nav-tab-btn.xcb-nav-active {
  background: var(--xcb-primary);
  color: #fff;
  border-color: var(--xcb-primary);
}

.xcb-nav-tab-btn[data-nav="block"].xcb-nav-active {
  background: var(--xcb-accent-danger, #ef4444);
  border-color: var(--xcb-accent-danger, #ef4444);
}

.xcb-nav-tab-btn[data-nav="trust"].xcb-nav-active {
  background: var(--xcb-accent-success, #22c55e);
  border-color: var(--xcb-accent-success, #22c55e);
}

.xcb-nav-tab-btn[data-nav="keyword"].xcb-nav-active {
  background: var(--xcb-accent-warning, #f59e0b);
  border-color: var(--xcb-accent-warning, #f59e0b);
}

.xcb-nav-tab-btn[data-nav="requests"].xcb-nav-active {
  background: var(--xcb-accent-info, #3b82f6);
  border-color: var(--xcb-accent-info, #3b82f6);
}

.xcb-nav-tab-btn[data-nav="notes"].xcb-nav-active {
  background: var(--xcb-accent-purple, #8b5cf6);
  border-color: var(--xcb-accent-purple, #8b5cf6);
}

/* Tooltip for nav buttons */

.xcb-nav-tab-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: var(--xcb-panel-text, #fff);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 100003;
}

.xcb-nav-tab-btn:hover::after {
  opacity: 1;
}

/* Hide tooltip for settings button (uses dropdown instead) */

.xcb-nav-tab-btn[data-nav="settings"]::after {
  display: none;
}

/* Tooltips on left side for left-positioned nav */

.xcb-quick-nav.xcb-pos-bottom-left .xcb-nav-tab-btn::after,
.xcb-quick-nav.xcb-pos-top-left .xcb-nav-tab-btn::after {
  right: auto;
  left: calc(100% + 6px);
}

/* Settings wrapper - contains settings button and expand arrow */

.xcb-nav-settings-wrapper {
  position: relative;
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

/* Expand/collapse button for settings sections */

.xcb-nav-expand-btn {
  width: 20px;
  height: 36px;
  border-radius: 4px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.15s ease;
}

.xcb-nav-expand-btn:hover {
  background: var(--xcb-hover-bg, #3a3a4e);
  border-color: var(--xcb-primary, #3b82f6);
}

.xcb-nav-expand-btn.xcb-nav-expanded {
  background: var(--xcb-primary, #3b82f6);
  border-color: var(--xcb-primary, #3b82f6);
}

.xcb-nav-expand-btn.xcb-nav-expanded i {
  transform: rotate(-90deg);
}

.xcb-nav-expand-btn i {
  transition: transform 0.2s ease;
}

/* Expandable settings sections list */

.xcb-nav-sections {
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  opacity: 1;
  visibility: visible;
}

.xcb-nav-sections.xcb-nav-sections-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  height: 0;
}

/* Section links as icon-only buttons */

.xcb-nav-sections .xcb-nav-section-link {
  width: 36px;
  height: 28px;
  border-radius: 4px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s ease;
  position: relative;
}

.xcb-nav-sections .xcb-nav-section-link:hover {
  background: var(--xcb-hover-bg, #3a3a4e);
  color: #fff;
  border-color: var(--xcb-primary, #3b82f6);
}

.xcb-nav-sections .xcb-nav-section-link i {
  color: inherit;
}

/* Tooltips for section links */

.xcb-nav-sections .xcb-nav-section-link::after {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 1px solid var(--xcb-panel-border, #444);
  color: var(--xcb-panel-text, #fff);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 100003;
}

.xcb-nav-sections .xcb-nav-section-link:hover::after {
  opacity: 1;
}

/* Tooltips on left side for left-positioned nav */

.xcb-quick-nav.xcb-pos-bottom-left .xcb-nav-sections .xcb-nav-section-link::after,
.xcb-quick-nav.xcb-pos-top-left .xcb-nav-sections .xcb-nav-section-link::after {
  right: auto;
  left: calc(100% + 8px);
}

/* Adjust expand button arrow for left-positioned nav */

.xcb-quick-nav.xcb-pos-bottom-left .xcb-nav-expand-btn i,
.xcb-quick-nav.xcb-pos-top-left .xcb-nav-expand-btn i {
  transform: rotate(180deg);
}

.xcb-quick-nav.xcb-pos-bottom-left .xcb-nav-expand-btn.xcb-nav-expanded i,
.xcb-quick-nav.xcb-pos-top-left .xcb-nav-expand-btn.xcb-nav-expanded i {
  transform: rotate(90deg);
}

/* Request button paused state (limit reached or manually paused) */

.xcb-nav-tab-btn.xcb-nav-paused {
  background: var(--xcb-accent-danger, #ef4444) !important;
  border-color: var(--xcb-accent-danger, #ef4444) !important;
}

.xcb-nav-tab-btn.xcb-nav-paused i {
  color: #fff;
}

/* Tab navigation */

/* ========== TABS ========== */

.xcb-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.xcb-tab {
  flex: 1;
  min-width: 80px;
  padding: 8px 5px;
  border: 1px solid var(--xcb-panel-border-light, rgba(255, 255, 255, 0.1));
  cursor: pointer;
  border-radius: 3px;
  font-size: 11px;
  font-family: inherit;
  background: var(--xcb-panel-border);
  color: var(--xcb-panel-text-secondary);
}

.xcb-tab-active-block {
  background: var(--xcb-highlight-color) !important;
  color: var(--xcb-btn-text, #fff) !important;
}

.xcb-tab-active-trust {
  background: var(--xcb-trusted-color) !important;
  color: var(--xcb-btn-text, #fff) !important;
}

.xcb-tab-active-keyword {
  background: var(--xcb-keyword-color) !important;
  color: var(--xcb-btn-text, #fff) !important;
}

.xcb-tab-active-settings {
  background: var(--xcb-panel-text-dim) !important;
  color: var(--xcb-panel-text) !important;
}

.xcb-tab-active-requests {
  background: var(--xcb-request-color) !important;
  color: var(--xcb-btn-text, #fff) !important;
}

.xcb-tab-active-notes {
  background: var(--xcb-notes-color) !important;
  color: var(--xcb-btn-text, #fff) !important;
}

.xcb-tab-content {
  display: none;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 0;
  padding-right: 8px; /* Prevent content from clipping into scrollbar */
}

.xcb-tab-content-active {
  display: flex;
  flex-direction: column;
}

/* Form elements (inputs, checkboxes, selects) */

/* ========== CHECKBOX LABELS ========== */

.xcb-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  cursor: pointer;
}

.xcb-checkbox-label input {
  width: 18px;
  height: 18px;
}

/* ========== NOTE INPUT ========== */

.xcb-note-input {
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  background: var(--xcb-panel-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text, #fff);
  border-radius: 3px;
  font-size: 11px;
}

/* ========== COLOR INPUT ========== */

.xcb-color-input {
  width: 50px;
  height: 30px;
  border: none;
  cursor: pointer;
  background: transparent;
}

.xcb-color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
  min-width: 0;
}

.xcb-color-row span {
  font-size: 11px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== TEMPLATE SELECT ========== */

.xcb-template-select {
  padding: 5px;
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text, #fff);
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  max-width: 200px;
}

/* ========== REPLY TEMPLATES ========== */

.xcb-reply-templates {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0;
}

.xcb-reply-template {
  display: flex;
  gap: 5px;
  align-items: center;
}

.xcb-reply-template input {
  flex: 1;
}

.xcb-reply-template button {
  padding: 5px 8px;
  font-size: 10px;
}

/* ========== TAG FILTERS ========== */

.xcb-tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.xcb-filter-tag {
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid #555;
  color: var(--xcb-panel-text-secondary);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.xcb-filter-tag:hover {
  border-color: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-filter-tag.active {
  background: var(--xcb-highlight-color);
  border-color: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-filter-tag-trust:hover {
  border-color: var(--xcb-trusted-color);
}

.xcb-filter-tag-trust.active {
  background: var(--xcb-trusted-color);
  border-color: var(--xcb-trusted-color);
}

/* ========== REASON PRESETS ========== */

.xcb-reason-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 8px 0;
  padding: 8px 10px;
  border-top: 1px solid #333;
}

.xcb-reason-preset {
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border, #555);
  color: var(--xcb-panel-text, #e0e0e0);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
}

.xcb-reason-preset:hover {
  border-color: var(--xcb-highlight-color);
  color: var(--xcb-btn-text, #fff);
}

/* Sections, stats, help boxes, misc components */

/* ========== SECTIONS ========== */

.xcb-section {
  margin: 15px 0;
  padding: 10px;
  background: var(--xcb-panel-secondary-bg);
  border-radius: 5px;
}

.xcb-section-title {
  font-size: 12px;
  color: var(--xcb-panel-text-muted);
  margin-bottom: 10px;
}

/* ========== STATS BOX ========== */

.xcb-stats-box {
  background: var(--xcb-panel-secondary-bg);
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
}

.xcb-stats-box h4 {
  margin: 0 0 10px 0;
  color: var(--xcb-panel-text-secondary);
}

.xcb-stats-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #333;
}

/* ========== HELP BOX ========== */

.xcb-help-box {
  background: var(--xcb-panel-secondary-bg);
  border-left: 3px solid #666;
  padding: 10px 15px;
  margin: 10px 0;
  font-size: 12px;
  color: var(--xcb-panel-text-secondary);
  border-radius: 0 5px 5px 0;
}

.xcb-help-box h4 {
  margin: 0 0 8px 0;
  color: var(--xcb-panel-text, #fff);
  font-size: 13px;
}

.xcb-help-box ul {
  margin: 5px 0;
  padding-left: 20px;
  max-height: none;
  overflow: visible;
}

.xcb-help-box li {
  padding: 3px 0;
  border: none;
  display: list-item;
  color: var(--xcb-panel-text-secondary);
}

/* ========== USER NOTE/META ========== */

.xcb-user-note {
  font-size: 10px;
  color: var(--xcb-panel-text-muted);
  width: 100%;
  margin-top: 3px;
}

.xcb-user-meta {
  font-size: 9px;
  color: var(--xcb-panel-text-dim);
}

/* ========== REPLY SENT INDICATOR ========== */

.xcb-reply-sent {
  color: var(--xcb-blue);
  font-size: 11px;
  margin-left: 10px;
}

/* ========== WHITELIST NOTICE ========== */

.xcb-whitelist-notice {
  color: var(--xcb-panel-text-muted);
  font-style: italic;
  font-size: 11px;
}

/* ========== KEYBOARD HINT ========== */

.xcb-keyboard-hint {
  position: absolute;
  background: rgba(26, 26, 46, 0.95);
  border: 1px solid var(--xcb-panel-border);
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  color: #ddd;
  z-index: 99998;
  display: none;
  white-space: nowrap;
  pointer-events: none;
  line-height: 1.4;
}

.xcb-keyboard-hint kbd {
  background: var(--xcb-panel-tertiary-bg);
  padding: 1px 4px;
  border-radius: 2px;
  margin: 0 2px;
  font-size: 9px;
  color: var(--xcb-panel-text);
}

/* Comment highlighting and notices */

/* ========== COMMENT HIGHLIGHTS ========== */

.xcb-comment-blocked {
  background: var(--xcb-highlight-bg) !important;
  border-left: 3px solid var(--xcb-highlight-color) !important;
  padding-left: 10px !important;
}

.xcb-comment-soft-blocked {
  border-left: 3px solid var(--xcb-highlight-color) !important;
  padding-left: 10px !important;
}

.xcb-comment-trusted {
  background: var(--xcb-trusted-bg) !important;
  border-left: 3px solid var(--xcb-trusted-color) !important;
  padding-left: 10px !important;
}

.xcb-comment-keyword {
  background: var(--xcb-keyword-bg) !important;
  border-left: 3px solid var(--xcb-keyword-color) !important;
  padding-left: 10px !important;
}

/* Highlighted keyword - cyan/teal for attention */

.xcb-comment-highlighted-keyword {
  background: var(--xcb-highlighted-keyword-bg, rgba(6, 182, 212, 0.15)) !important;
  border-left: 3px solid var(--xcb-highlighted-keyword-color, #06b6d4) !important;
  padding-left: 10px !important;
}

.xcb-comment-hidden {
  display: none !important;
}

.xcb-entire-comment-hidden {
  display: none !important;
}

/* ========== BLOCKED/KEYWORD NOTICES ========== */

.xcb-blocked-notice {
  color: var(--xcb-highlight-color);
  font-style: italic;
  font-size: 12px;
  padding: 5px 0;
}

.xcb-keyword-notice {
  color: var(--xcb-keyword-color);
  font-style: italic;
  font-size: 12px;
  padding: 5px 0;
}

.xcb-highlighted-keyword-notice {
  color: var(--xcb-highlighted-keyword-color, #06b6d4);
  font-style: italic;
  font-size: 12px;
  padding: 5px 0;
}

/* Highlighted keyword mark within comment text */

.xcb-keyword-highlight {
  background: var(--xcb-highlighted-keyword-color, #06b6d4);
  color: #fff;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
}

/* ========== SITE-TRUSTED USER BADGES ========== */

.xcb-site-badge {
  display: inline-flex !important;
  align-items: center;
  gap: 3px;
  margin-left: 6px !important;
  padding: 2px 6px !important;
  font-size: 10px !important;
  font-weight: bold !important;
  border-radius: 4px !important;
  vertical-align: middle;
  cursor: help;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff !important;
}

.xcb-site-badge i {
  font-size: 11px;
}

/* Moderator badge - green like site's moderator color */

.xcb-site-badge-mod {
  background: linear-gradient(135deg, #8bc220 0%, #6d9a18 100%) !important;
  color: #fff !important;
  border: 1px solid #9dd42a !important;
  box-shadow: 0 1px 3px rgba(139, 194, 32, 0.5);
}

/* VIP badge - blue like site's VIP color */

.xcb-site-badge-vip {
  background: linear-gradient(135deg, #7ec8e8 0%, #5eb8dc 100%) !important;
  color: #fff !important;
  border: 1px solid #a0d8f0 !important;
  box-shadow: 0 1px 3px rgba(126, 200, 232, 0.5);
}

/* Whitelist badge - purple for permanent whitelist users */

.xcb-site-badge-whitelist {
  background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%) !important;
  color: #fff !important;
  border: 1px solid #c084fc !important;
  box-shadow: 0 1px 3px rgba(168, 85, 247, 0.5);
}

/* Right-click context menu */

/* ========== CONTEXT MENU ========== */

.xcb-context-menu {
  position: fixed;
  background: var(--xcb-panel-bg);
  border: 1px solid var(--xcb-panel-border);
  border-radius: 5px;
  padding: 5px 0;
  z-index: 100001;
  min-width: 150px;
  max-width: 280px;
}

.xcb-context-item {
  padding: 8px 15px;
  cursor: pointer;
  color: var(--xcb-panel-text);
  font-size: 13px;
}

.xcb-context-item:hover {
  background: var(--xcb-panel-tertiary-bg);
}

.xcb-context-item-block {
  color: var(--xcb-highlight-color);
}

.xcb-context-item-trust {
  color: var(--xcb-trusted-color);
}

.xcb-context-item-note {
  color: var(--xcb-notes-color);
}

.xcb-context-item-request {
  color: var(--xcb-warning);
}

/* Guided tour */

/* ========== GUIDED TOUR STYLES ========== */

.xcb-tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100010;
  pointer-events: none;
}

.xcb-tour-highlight {
  position: relative;
  z-index: 100011 !important;
  box-shadow: 0 0 0 4px var(--xcb-blue), 0 0 20px rgba(59, 130, 246, 0.5) !important;
  border-radius: 6px;
  pointer-events: auto;
}

/* Preserve fixed positioning for float button during tour */

.xcb-float-btn.xcb-tour-highlight {
  position: fixed !important;
}

.xcb-tour-tooltip {
  position: fixed;
  background: var(--xcb-panel-bg);
  border: 2px solid var(--xcb-blue);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  min-width: 300px;
  z-index: 100012;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  font-family: var(--xcb-font-family);
}

.xcb-tour-tooltip h3 {
  margin: 0 0 12px 0;
  color: var(--xcb-blue);
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.xcb-tour-tooltip p {
  margin: 0 0 15px 0;
  color: var(--xcb-panel-text);
  font-size: 14px;
  line-height: 1.5;
}

.xcb-tour-tooltip .xcb-tour-tip {
  background: var(--xcb-panel-secondary-bg);
  border-left: 3px solid var(--xcb-accent-warning);
  padding: 10px 12px;
  margin: 12px 0;
  font-size: 12px;
  color: var(--xcb-panel-text-secondary);
  border-radius: 0 6px 6px 0;
}

.xcb-tour-tooltip .xcb-tour-tip strong {
  color: var(--xcb-accent-warning);
}

/* Tour list styling - uses theme colors for proper contrast */

.xcb-tour-tooltip .xcb-tour-list {
  margin: 8px 0;
  padding-left: 20px;
  color: var(--xcb-panel-text-secondary);
}

.xcb-tour-tooltip .xcb-tour-list strong {
  color: var(--xcb-panel-text);
}

/* Keyboard shortcut styling */

.xcb-tour-tooltip .xcb-tour-kbd {
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: var(--xcb-panel-text);
}

/* Warning box styling */

.xcb-tour-tooltip .xcb-tour-warning {
  margin-top: 8px;
  padding: 6px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--xcb-accent-danger);
  border-radius: 4px;
  font-size: 11px;
  color: var(--xcb-accent-danger-light);
}

.xcb-tour-tooltip .xcb-tour-warning strong {
  color: var(--xcb-accent-danger-light);
}

/* ========== TOUR PROGRESS ========== */

.xcb-tour-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--xcb-panel-border);
}

.xcb-tour-progress-bar {
  flex: 1;
  height: 6px;
  background: var(--xcb-panel-secondary-bg);
  border-radius: 3px;
  overflow: hidden;
}

.xcb-tour-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--xcb-blue), var(--xcb-accent-success));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.xcb-tour-progress-text {
  font-size: 11px;
  color: var(--xcb-panel-text-muted);
  min-width: 50px;
  text-align: right;
}

/* ========== TOUR BUTTONS ========== */

.xcb-tour-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 15px;
}

.xcb-tour-btn {
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: all 0.2s;
}

.xcb-tour-btn-skip {
  background: transparent;
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text-muted);
}

.xcb-tour-btn-skip:hover {
  border-color: var(--xcb-panel-text-muted);
  color: var(--xcb-panel-text, #fff);
}

.xcb-tour-btn-prev {
  background: var(--xcb-panel-secondary-bg);
  color: var(--xcb-panel-text);
}

.xcb-tour-btn-prev:hover {
  background: var(--xcb-hover-bg);
}

.xcb-tour-btn-next {
  background: var(--xcb-blue);
  color: var(--xcb-btn-text, #fff);
}

.xcb-tour-btn-next:hover {
  background: var(--xcb-blue-hover);
}

.xcb-tour-btn-finish {
  background: var(--xcb-accent-success);
  color: var(--xcb-btn-text, #fff);
}

.xcb-tour-btn-finish:hover {
  background: var(--xcb-accent-success-alt);
}

/* ========== TOUR ARROWS ========== */

.xcb-tour-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.xcb-tour-arrow-up {
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid var(--xcb-blue);
  top: -12px;
}

.xcb-tour-arrow-down {
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid var(--xcb-blue);
  bottom: -12px;
}

.xcb-tour-arrow-left {
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 12px solid var(--xcb-blue);
  left: -12px;
}

.xcb-tour-arrow-right {
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid var(--xcb-blue);
  right: -12px;
}

/* Request tracker */

/* ========== REQUEST STYLES ========== */

.xcb-request-item {
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
}

.xcb-request-item:hover {
  border-color: var(--xcb-request-color);
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.2);
}

.xcb-request-item.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  cursor: grabbing;
}

.xcb-request-item.drag-over {
  border-color: var(--xcb-request-color);
  border-style: dashed;
}

.xcb-request-item.archived {
  opacity: 0.7;
  border-color: #333;
}

.xcb-request-item.archived:hover {
  border-color: var(--xcb-archive-color);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

/* ========== REQUEST HEADER ========== */

.xcb-request-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.xcb-request-username {
  color: var(--xcb-request-color);
  font-weight: bold;
  text-decoration: none;
}

.xcb-request-username:hover {
  text-decoration: underline;
}

.xcb-request-date {
  color: var(--xcb-panel-text-dim);
  font-size: 11px;
}

.xcb-request-source {
  color: var(--xcb-panel-text-muted);
  font-size: 10px;
  text-decoration: none;
}

.xcb-request-source:hover {
  color: var(--xcb-request-color);
  text-decoration: underline;
}

/* ========== REQUEST TEXT ========== */

.xcb-request-text {
  color: var(--xcb-panel-text-secondary, #ccc);
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 10px;
  word-break: break-word;
  white-space: pre-wrap;
}

.xcb-request-text.collapsed {
  max-height: 60px;
  overflow: hidden;
  position: relative;
}

.xcb-request-text.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(transparent, var(--xcb-panel-secondary-bg));
}

.xcb-request-expand {
  color: var(--xcb-request-color);
  font-size: 11px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.xcb-request-expand:hover {
  text-decoration: underline;
}

/* ========== REQUEST ACTIONS ========== */

.xcb-request-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
}

.xcb-request-status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  text-transform: uppercase;
}

.xcb-request-status-pending {
  background: var(--xcb-warning);
  color: #000;
}

.xcb-request-status-completed {
  background: var(--xcb-success);
  color: var(--xcb-btn-text, #fff);
}

.xcb-request-status-declined {
  background: var(--xcb-panel-text-dim);
  color: var(--xcb-panel-text);
}

/* ========== STATUS BUTTONS ========== */

.xcb-request-status-btns {
  display: flex;
  gap: 3px;
  margin-right: 8px;
}

.xcb-status-btn {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid var(--xcb-panel-border);
  background: var(--xcb-panel-secondary-bg);
  color: var(--xcb-panel-text-dim);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.xcb-status-btn:hover {
  border-color: var(--xcb-panel-text-dim);
}

.xcb-status-btn-pending:hover,
.xcb-status-btn-pending.active {
  background: var(--xcb-warning);
  color: #000;
  border-color: var(--xcb-warning);
}

.xcb-status-btn-completed:hover,
.xcb-status-btn-completed.active {
  background: var(--xcb-success);
  color: var(--xcb-btn-text, #fff);
  border-color: var(--xcb-success);
}

.xcb-status-btn-declined:hover,
.xcb-status-btn-declined.active {
  background: var(--xcb-panel-text-dim);
  color: var(--xcb-panel-text);
  border-color: var(--xcb-panel-text-muted);
}

/* ========== REQUEST BUTTONS ========== */

.xcb-request-btn {
  background: transparent;
  border: 1px solid var(--xcb-panel-border-light);
  color: var(--xcb-panel-text-muted);
  padding: 3px 8px;
  font-size: 10px;
  border-radius: 3px;
  cursor: pointer;
}

.xcb-request-btn:hover {
  border-color: var(--xcb-panel-text-muted);
  color: var(--xcb-panel-text);
}

.xcb-request-btn-bordered {
  border: 2px solid var(--xcb-panel-border-light);
  background: var(--xcb-panel-secondary-bg);
  color: var(--xcb-panel-text-secondary);
  font-weight: 500;
}

.xcb-request-btn-bordered:hover {
  border-color: var(--xcb-request-color);
  color: var(--xcb-panel-text);
  background: var(--xcb-panel-hover-bg);
}

.xcb-request-btn-import {
  /* Match export button styling exactly */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  min-height: 28px;
  box-sizing: border-box;
  vertical-align: middle;
  margin: 0;
  font-family: inherit;
}

/* Import button now uses same hover style as bordered buttons */

.xcb-request-btn-archive {
  border-color: var(--xcb-archive-color);
  color: var(--xcb-archive-color);
}

.xcb-request-btn-archive:hover {
  background: var(--xcb-archive-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-request-btn-delete {
  border-color: var(--xcb-danger);
  color: var(--xcb-danger);
}

.xcb-request-btn-delete:hover {
  background: var(--xcb-danger);
  color: var(--xcb-btn-text, #fff);
}

/* ========== CHECKLIST STYLES ========== */

.xcb-checklist {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--xcb-panel-border);
}

.xcb-checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  transition: background 0.15s ease;
}

.xcb-checklist-item.dragging {
  opacity: 0.5;
  background: var(--xcb-panel-tertiary-bg);
}

.xcb-checklist-item.drag-over {
  border-top: 2px solid var(--xcb-request-color);
  margin-top: -2px;
}

.xcb-checklist-drag {
  cursor: grab;
  color: var(--xcb-panel-border-light);
  font-size: 12px;
  letter-spacing: -2px;
  padding: 2px 4px;
  user-select: none;
}

.xcb-checklist-drag:hover {
  color: var(--xcb-panel-text-muted);
}

.xcb-checklist-drag:active {
  cursor: grabbing;
}

.xcb-checklist-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.xcb-checklist-item.completed span:not(.xcb-checklist-drag) {
  text-decoration: line-through;
  color: var(--xcb-panel-text-dim);
}

.xcb-checklist-item span:not(.xcb-checklist-drag) {
  flex: 1;
  color: var(--xcb-panel-text-secondary);
  font-size: 12px;
  text-align: left !important;
}

.xcb-checklist-delete {
  background: none;
  border: none;
  color: var(--xcb-panel-text-dim);
  cursor: pointer;
  font-size: 14px;
  padding: 0 5px;
}

.xcb-checklist-delete:hover {
  color: var(--xcb-danger);
}

.xcb-checklist-add {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}

.xcb-checklist-add input {
  flex: 1;
  padding: 5px 8px;
  font-size: 11px;
  background: var(--xcb-panel-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-input-text, #fff);
  border-radius: 3px;
}

.xcb-checklist-add button {
  padding: 5px 10px;
  font-size: 11px;
  background: var(--xcb-request-color);
  border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2));
  color: var(--xcb-btn-text, #fff);
  border-radius: 3px;
  cursor: pointer;
}

/* ========== STATUS FILTER BUTTONS ========== */

.xcb-status-filters {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.xcb-status-filter {
  padding: 5px 12px;
  border: 1px solid var(--xcb-panel-border);
  background: transparent;
  color: var(--xcb-panel-text-muted);
  border-radius: 15px;
  cursor: pointer;
  font-size: 11px;
}

.xcb-status-filter:hover {
  border-color: var(--xcb-panel-text-dim);
  color: var(--xcb-panel-text);
}

.xcb-status-filter.active {
  background: var(--xcb-request-color);
  border-color: var(--xcb-request-color);
  color: var(--xcb-btn-text, #fff);
}

.xcb-status-filter.active-archived {
  background: var(--xcb-archive-color);
  border-color: var(--xcb-archive-color);
  color: var(--xcb-btn-text, #fff);
}

/* ========== NO REQUESTS ========== */

.xcb-no-requests {
  text-align: center;
  padding: 30px;
  color: var(--xcb-panel-text-dim);
}

/* ========== ARCHIVED SECTION ========== */

.xcb-archived-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid var(--xcb-panel-border);
}

.xcb-archived-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
}

.xcb-archived-header h4 {
  margin: 0;
  color: var(--xcb-archive-color);
  font-size: 13px;
}

.xcb-archived-toggle {
  color: var(--xcb-panel-text-dim);
  font-size: 12px;
}

/* ========== NOTES SUBTASKS ========== */

.xcb-note-subtasks-list {
  text-align: left !important;
}

.xcb-note-subtask {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 1px solid var(--xcb-panel-border);
  text-align: left !important;
}

.xcb-note-subtask-text {
  flex: 1;
  font-size: 12px;
  text-align: left !important;
  color: var(--xcb-panel-text-secondary);
}

.xcb-note-subtask.completed .xcb-note-subtask-text {
  text-decoration: line-through;
  color: var(--xcb-panel-text-dim);
}

.xcb-note-subtask-drag {
  cursor: grab;
  color: var(--xcb-panel-text-muted);
  font-size: 10px;
  margin-top: 2px;
  user-select: none;
}

.xcb-note-subtask-drag:active {
  cursor: grabbing;
}

/* Note and request popups */

/* ========== NOTE POPUP ========== */

/* IMPORTANT: Popups must have solid backgrounds - never use transparent values */

.xcb-note-popup {
  position: fixed;
  /* Solid fallback + ensure opacity is always 1 */
  background: #1a1a2e;
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 2px solid var(--xcb-notes-color);
  border-radius: 8px;
  padding: 15px;
  z-index: 100002;
  min-width: 350px;
  max-width: 450px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  /* Force full opacity even if parent has transparency */
  opacity: 1 !important;
}

.xcb-note-popup h4 {
  margin: 0 0 10px 0;
  color: var(--xcb-notes-color);
  font-size: 14px;
}

.xcb-note-popup .xcb-note-comment-preview {
  background: var(--xcb-panel-secondary-bg);
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 11px;
  color: var(--xcb-panel-text-secondary);
  max-height: 80px;
  overflow-y: auto;
  font-style: italic;
  white-space: pre-wrap;
  word-break: break-word;
}

.xcb-note-popup input,
.xcb-note-popup textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text, #fff);
  border-radius: 4px;
  box-sizing: border-box;
}

.xcb-note-popup textarea {
  min-height: 60px;
  resize: vertical;
}

.xcb-note-popup .xcb-tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.xcb-note-popup .xcb-tag-option {
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.xcb-note-popup .xcb-tag-option.selected {
  border-color: var(--xcb-panel-text, #fff);
}

.xcb-note-popup .xcb-note-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ========== REQUEST POPUP ========== */

/* IMPORTANT: Popups must have solid backgrounds - never use transparent values */

.xcb-request-popup {
  position: fixed;
  /* Solid fallback + ensure opacity is always 1 */
  background: #1a1a2e;
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 2px solid var(--xcb-warning);
  border-radius: 8px;
  padding: 15px;
  z-index: 100002;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  /* Force full opacity even if parent has transparency */
  opacity: 1 !important;
}

.xcb-request-popup h4 {
  margin: 0 0 10px 0;
  color: var(--xcb-warning);
}

.xcb-request-popup textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  background: var(--xcb-panel-secondary-bg);
  border: 1px solid var(--xcb-panel-border);
  color: var(--xcb-panel-text, #fff);
  border-radius: 4px;
  font-size: 12px;
  resize: vertical;
  box-sizing: border-box;
}

.xcb-request-popup-btns {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: flex-end;
}

.xcb-request-popup-btns button {
  padding: 6px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* ========== NOTE SUBTASK DRAG & DROP ========== */

.xcb-note-subtask {
  transition: opacity 0.2s, border-top 0.1s;
}

.xcb-note-subtask-drag {
  cursor: grab;
}

.xcb-note-subtask-drag:active {
  cursor: grabbing;
}

/* Uploads search */

/* ========== UPLOADS SEARCH ========== */

/* Injected search UI for user's uploads page */

.xcb-uploads-search {
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 1px solid var(--xcb-panel-border, #444);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.xcb-uploads-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.xcb-uploads-search-bar i {
  color: var(--xcb-panel-text-muted, #888);
  font-size: 18px;
}

.xcb-uploads-search-bar input {
  flex: 1;
  padding: 8px 12px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border: 1px solid var(--xcb-panel-border, #444);
  border-radius: 6px;
  color: var(--xcb-panel-text, #fff);
  font-size: 14px;
}

.xcb-uploads-search-bar input:focus {
  outline: none;
  border-color: var(--xcb-blue, #3b82f6);
}

.xcb-uploads-search-bar input::placeholder {
  color: var(--xcb-panel-text-muted, #888);
}

/* Buttons */

.xcb-uploads-search .xcb-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.xcb-uploads-search .xcb-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.xcb-uploads-search .xcb-btn-primary {
  background: var(--xcb-blue, #3b82f6);
  color: #fff;
}

.xcb-uploads-search .xcb-btn-primary:hover:not(:disabled) {
  background: var(--xcb-blue-hover, #2563eb);
}

.xcb-uploads-search .xcb-btn-small {
  padding: 5px 10px;
  font-size: 12px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  color: var(--xcb-panel-text-secondary, #aaa);
  border: 1px solid var(--xcb-panel-border, #444);
}

.xcb-uploads-search .xcb-btn-small:hover:not(:disabled) {
  background: var(--xcb-panel-hover-bg, #3a3a4e);
  color: var(--xcb-panel-text, #fff);
}

.xcb-uploads-search .xcb-btn-danger {
  background: var(--xcb-danger, #dc2626);
  color: #fff;
}

.xcb-uploads-search .xcb-btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

/* Status line */

.xcb-uploads-status {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--xcb-panel-text-muted, #888);
  font-size: 12px;
}

.xcb-uploads-status span:first-child {
  color: var(--xcb-panel-text, #fff);
  font-weight: 500;
}

/* Progress bar */

.xcb-uploads-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--xcb-panel-border, #444);
}

.xcb-uploads-progress-bar {
  flex: 1;
  height: 6px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border-radius: 3px;
  overflow: hidden;
}

.xcb-uploads-progress-fill {
  height: 100%;
  background: var(--xcb-blue, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

#xcbUploadsProgressText {
  color: var(--xcb-panel-text-secondary, #aaa);
  font-size: 12px;
  min-width: 150px;
}

/* Results table container */

.xcb-uploads-results {
  margin-bottom: 15px;
}

/* Results table */

.xcb-uploads-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--xcb-panel-bg, #1a1a2e);
  border: 1px solid var(--xcb-panel-border, #444);
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
}

.xcb-uploads-table thead {
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
}

.xcb-uploads-table th {
  padding: 10px 12px;
  text-align: left;
  color: var(--xcb-panel-text-muted, #888);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--xcb-panel-border, #444);
}

.xcb-uploads-table td {
  padding: 10px 12px;
  color: var(--xcb-panel-text, #fff);
  border-bottom: 1px solid var(--xcb-panel-border, #444);
}

.xcb-uploads-table tbody tr:hover {
  background: var(--xcb-panel-hover-bg, #3a3a4e);
}

.xcb-uploads-table tbody tr:last-child td {
  border-bottom: none;
}

/* Column widths */

.xcb-uploads-table th:nth-child(1),
.xcb-uploads-table td:nth-child(1) {
  width: auto;
}

.xcb-uploads-table th:nth-child(2),
.xcb-uploads-table td:nth-child(2),
.xcb-uploads-table th:nth-child(3),
.xcb-uploads-table td:nth-child(3),
.xcb-uploads-table th:nth-child(4),
.xcb-uploads-table td:nth-child(4) {
  width: 60px;
  text-align: center;
}

.xcb-uploads-table th:nth-child(5),
.xcb-uploads-table td:nth-child(5) {
  width: 100px;
  text-align: right;
}

/* Upload name column */

.xcb-upload-name {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xcb-upload-name a {
  color: var(--xcb-blue, #3b82f6);
  text-decoration: none;
}

.xcb-upload-name a:hover {
  text-decoration: underline;
}

/* Seeds column */

.xcb-upload-seeds {
  color: var(--xcb-success, #22c55e) !important;
  font-weight: 500;
}

/* Leeches column */

.xcb-upload-leeches {
  color: var(--xcb-danger, #dc2626) !important;
}

/* Comment count badge */

.xcb-comment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  padding: 2px 6px;
  background: var(--xcb-panel-secondary-bg, #2a2a3e);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.xcb-comment-pending {
  color: var(--xcb-panel-text-muted, #888);
}

/* Date column */

.xcb-upload-date {
  color: var(--xcb-panel-text-muted, #888) !important;
  font-size: 12px;
}

/* ========== NOTIFICATIONS SEARCH ========== */

/* Notification user column */

.xcb-notification-user {
  display: flex;
  align-items: center;
  gap: 6px;
}

.xcb-notification-user a {
  color: var(--xcb-blue, #3b82f6);
  text-decoration: none;
}

.xcb-notification-user a:hover {
  text-decoration: underline;
}

/* Notification badges */

.xcb-notification-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
}

.xcb-notification-badge-blocked {
  background: var(--xcb-highlight-color, #ff6b6b);
  color: #fff;
}

.xcb-notification-badge-trusted {
  background: var(--xcb-trusted-color, #4ade80);
  color: #fff;
}

/* Notification torrent column */

.xcb-notification-torrent {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.xcb-notification-torrent a {
  color: var(--xcb-panel-text, #fff);
  text-decoration: none;
}

.xcb-notification-torrent a:hover {
  color: var(--xcb-blue, #3b82f6);
  text-decoration: underline;
}

/* Notification date column */

.xcb-notification-date {
  color: var(--xcb-panel-text-muted, #888) !important;
  font-size: 12px;
  white-space: nowrap;
}
`;
  const DEFAULT_BADGE_COLORS = {
    // Block badges (negative connotations)
    badgeSpammer: "#dc2626",
    // Red - danger/spam
    badgeRude: "#be185d",
    // Rose/Magenta - distinct from purple
    badgeBeggar: "#ea580c",
    // Orange - attention-grabbing
    badgeOfftopic: "#0891b2",
    // Cyan - neutral-ish
    badgeTroll: "#65a30d",
    // Lime green - troublemaker
    badgeAnnoying: "#854d0e",
    // Brown/Ochre - distinct from orange
    // Trust badges (positive connotations)
    badgeUploader: "#22c55e",
    // Green - positive/verified
    badgeHelpful: "#06b6d4",
    // Cyan - friendly
    badgeModerator: "#eab308",
    // Gold/Yellow - authority/VIP
    badgeRequester: "#f97316",
    // Orange - active user
    badgeFriend: "#ec4899",
    // Pink - personal connection
    // Extended badges (newer tags)
    badgeSeeding: "#b91c1c",
    // Dark red - issue/problem (distinct from spammer red)
    badgeThankful: "#10b981",
    // Emerald - gratitude (distinct from uploader green)
    badgeUnwanted: "#7c3aed",
    // Violet - unwanted advice (distinct from rose)
    // Username highlight colors in panel lists
    trustedUsernameColor: "#4ade80",
    // Green - matches trusted/uploader theme
    blockedUsernameColor: "#ff6b6b"
    // Red - matches blocked/danger theme
  };
  const classic = {
    panelBg: "#1a1a2e",
    panelText: "#ffffff",
    panelBorder: "#3b82f6",
    inputBg: "#2a2a3e",
    inputBorder: "#444444",
    inputText: "#ffffff",
    buttonPrimary: "#3b82f6",
    buttonDanger: "#dc2626",
    secondaryText: "#aaaaaa",
    mutedText: "#666666",
    tabBg: "#2a2a3e",
    tabActiveBg: "#3b82f6",
    sectionBg: "#2a2a3e",
    hoverBg: "#444444",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#252538",
    borderLight: "#555555",
    textDim: "#555555",
    // Accent colors
    accentSuccess: "#22c55e",
    accentWarning: "#f59e0b",
    accentDanger: "#ef4444",
    accentInfo: "#06b6d4",
    accentPurple: "#8b5cf6",
    notesColor: "#8b5cf6",
    notesHover: "#7c3aed",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#10b981",
    // Light variants (for dark theme - use lighter colors)
    accentWarningLight: "#fcd34d",
    accentDangerLight: "#fca5a5",
    accentInfoLight: "#67e8f9",
    buttonBorder: "rgba(255,255,255,0.2)",
    // Username highlight colors
    trustedUsernameColor: "#4ade80",
    blockedUsernameColor: "#ff6b6b",
    ...DEFAULT_BADGE_COLORS
  };
  const theme1337x = {
    panelBg: "#1c1c1c",
    panelText: "#e0e0e0",
    panelBorder: "#de3812",
    inputBg: "#ffffff",
    inputBorder: "#3a3a3a",
    inputText: "#000000",
    buttonPrimary: "#de3812",
    buttonDanger: "#de3812",
    secondaryText: "#cccccc",
    mutedText: "#888888",
    tabBg: "#262626",
    tabActiveBg: "#de3812",
    sectionBg: "#2a2a2a",
    sectionText: "#e0e0e0",
    hoverBg: "#3a3a3a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#242424",
    borderLight: "#4a4a4a",
    textDim: "#666666",
    // 1337x-specific accent colors (red theme)
    accentSuccess: "#22c55e",
    // Keep green for success
    accentWarning: "#f59e0b",
    // Keep orange for warnings
    accentDanger: "#de3812",
    // Use 1337x red for danger
    accentInfo: "#06b6d4",
    // Keep cyan for info
    accentPurple: "#8b5cf6",
    // Keep purple
    notesColor: "#8b5cf6",
    notesHover: "#7c3aed",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#10b981",
    // Light variants (for dark theme - use lighter colors)
    accentWarningLight: "#fcd34d",
    accentDangerLight: "#fca5a5",
    accentInfoLight: "#67e8f9",
    // Button border uses semi-transparent red for 1337x theme consistency
    buttonBorder: "rgba(222, 56, 18, 0.4)",
    // Username highlight colors
    trustedUsernameColor: "#4ade80",
    blockedUsernameColor: "#de3812",
    // Use 1337x red for blocked
    ...DEFAULT_BADGE_COLORS
  };
  const midnight = {
    panelBg: "#0d1117",
    panelText: "#c9d1d9",
    panelBorder: "#58a6ff",
    inputBg: "#161b22",
    inputBorder: "#30363d",
    inputText: "#c9d1d9",
    buttonPrimary: "#238636",
    buttonDanger: "#da3633",
    secondaryText: "#8b949e",
    mutedText: "#6e7681",
    tabBg: "#161b22",
    tabActiveBg: "#238636",
    sectionBg: "#161b22",
    hoverBg: "#21262d",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#13181e",
    borderLight: "#3d444d",
    textDim: "#484f58",
    // GitHub-inspired accent colors
    accentSuccess: "#3fb950",
    accentWarning: "#d29922",
    accentDanger: "#f85149",
    accentInfo: "#58a6ff",
    accentPurple: "#a371f7",
    notesColor: "#a371f7",
    notesHover: "#8957e5",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#2ea043",
    // Light variants (for dark theme - use lighter colors)
    accentWarningLight: "#e3b341",
    accentDangerLight: "#ffa198",
    accentInfoLight: "#79c0ff",
    buttonBorder: "rgba(255,255,255,0.15)",
    // Username highlight colors
    trustedUsernameColor: "#3fb950",
    // GitHub green
    blockedUsernameColor: "#f85149",
    // GitHub red
    ...DEFAULT_BADGE_COLORS
  };
  const ocean = {
    panelBg: "#0f172a",
    panelText: "#e2e8f0",
    panelBorder: "#0ea5e9",
    inputBg: "#1e293b",
    inputBorder: "#334155",
    inputText: "#e2e8f0",
    buttonPrimary: "#0ea5e9",
    buttonDanger: "#ef4444",
    secondaryText: "#94a3b8",
    mutedText: "#64748b",
    tabBg: "#1e293b",
    tabActiveBg: "#0ea5e9",
    sectionBg: "#1e293b",
    hoverBg: "#273549",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#172033",
    borderLight: "#475569",
    textDim: "#475569",
    // Request feature colors
    requestColor: "#06b6d4",
    // Cyan that matches ocean theme
    requestHover: "#0891b2",
    // Ocean-inspired accent colors
    accentSuccess: "#10b981",
    // Seafoam green
    accentWarning: "#f59e0b",
    accentDanger: "#ef4444",
    accentInfo: "#0ea5e9",
    // Sky blue (matches primary)
    accentPurple: "#8b5cf6",
    notesColor: "#8b5cf6",
    notesHover: "#7c3aed",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#14b8a6",
    // Teal
    // Light variants (for dark theme - use lighter colors)
    accentWarningLight: "#fcd34d",
    accentDangerLight: "#fca5a5",
    accentInfoLight: "#7dd3fc",
    buttonBorder: "rgba(255,255,255,0.2)",
    // Username highlight colors
    trustedUsernameColor: "#22d3ee",
    // Cyan-ish green for ocean theme
    blockedUsernameColor: "#fb7185",
    // Coral red
    ...DEFAULT_BADGE_COLORS
  };
  const colorblind = {
    panelBg: "#1a1a2e",
    panelText: "#ffffff",
    panelBorder: "#0077BB",
    inputBg: "#2a2a3e",
    inputBorder: "#6688aa",
    inputText: "#ffffff",
    buttonPrimary: "#0077BB",
    buttonDanger: "#EE7733",
    // Action buttons using Wong palette colors (distinct from each other)
    buttonReply: "#0077BB",
    // Blue - same as primary
    buttonRequest: "#009E73",
    // Teal - distinct from blue, easily visible
    buttonNote: "#CC79A7",
    // Pink - distinct from blue/teal
    secondaryText: "#ccddee",
    mutedText: "#99aabb",
    tabBg: "#2a2a3e",
    tabActiveBg: "#0077BB",
    sectionBg: "#2a2a3e",
    hoverBg: "#3a3a4e",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#252538",
    borderLight: "#7799bb",
    textDim: "#7799bb",
    buttonBorder: "rgba(255,255,255,0.2)",
    // Colorblind-friendly badge colors (Wong palette + variations)
    // Each badge now has a distinct color for accessibility
    badgeSpammer: "#D55E00",
    // Vermilion - danger/spam
    badgeRude: "#CC79A7",
    // Pink - distinct from orange
    badgeBeggar: "#E69F00",
    // Orange - attention
    badgeOfftopic: "#56B4E9",
    // Sky blue - neutral
    badgeTroll: "#882255",
    // Dark magenta - troublemaker
    badgeAnnoying: "#AA7744",
    // Brown/tan - distinct from orange
    badgeUploader: "#009E73",
    // Teal - positive/verified
    badgeHelpful: "#33BBEE",
    // Cyan - friendly
    badgeModerator: "#F0E442",
    // Yellow - authority/VIP (distinct from blue)
    badgeRequester: "#DDAA33",
    // Gold - active user
    badgeFriend: "#EE3377",
    // Bright pink - personal
    // Extended badges
    badgeSeeding: "#BB4411",
    // Dark orange-red - issue
    badgeThankful: "#117733",
    // Dark teal - gratitude
    badgeUnwanted: "#6611AA",
    // Purple - unwanted
    // Colorblind-friendly accent colors (Wong palette)
    // Using blue for success instead of green (most common colorblindness confuses red/green)
    accentSuccess: "#0077BB",
    // Blue - success indicator (replaces green)
    accentSuccessAlt: "#009E73",
    // Teal - alternate success
    accentWarning: "#E69F00",
    // Orange - warning (distinct from blue)
    accentDanger: "#D55E00",
    // Vermilion - danger (distinct from both)
    accentInfo: "#56B4E9",
    // Sky blue - informational
    accentPurple: "#CC79A7",
    // Pink/magenta - distinct from all above
    // Notes feature colors (using pink instead of purple for accessibility)
    notesColor: "#CC79A7",
    // Pink - same as accentPurple
    notesHover: "#B8639A",
    // Darker pink for hover
    // Light variants for text on colored backgrounds
    accentWarningLight: "#F0E442",
    // Yellow - readable on dark backgrounds
    accentDangerLight: "#EE7733",
    // Orange - readable on dark backgrounds
    accentInfoLight: "#56B4E9",
    // Sky blue - readable on dark backgrounds
    // Button text colors
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    // Username highlight colors (colorblind-friendly)
    trustedUsernameColor: "#0077BB",
    // Blue for trusted (not green)
    blockedUsernameColor: "#EE7733"
    // Orange for blocked (not red)
  };
  const monkey = {
    panelBg: "#2d1f14",
    // Dark brown
    panelText: "#f5e6d3",
    // Warm cream
    panelBorder: "#d4893a",
    // Golden orange
    inputBg: "#3d2a1a",
    // Medium brown
    inputBorder: "#6b4423",
    // Brown border
    inputText: "#f5e6d3",
    // Warm cream
    buttonPrimary: "#d4893a",
    // Golden orange
    buttonDanger: "#c53030",
    // Red
    secondaryText: "#c9a882",
    // Tan
    mutedText: "#8b6b4a",
    // Muted brown
    tabBg: "#3d2a1a",
    // Medium brown
    tabActiveBg: "#d4893a",
    // Golden orange
    sectionBg: "#3d2a1a",
    // Medium brown
    hoverBg: "#4d3a2a",
    // Lighter brown
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Additional properties
    tertiaryBg: "#352518",
    borderLight: "#7b5433",
    textDim: "#6b5a3a",
    // Warm accent colors to match theme
    accentSuccess: "#48bb78",
    // Green
    accentWarning: "#ed8936",
    // Orange
    accentDanger: "#c53030",
    // Red
    accentInfo: "#4299e1",
    // Blue
    accentPurple: "#9f7aea",
    // Purple
    notesColor: "#9f7aea",
    notesHover: "#805ad5",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#38a169",
    // Light variants (for dark theme - use lighter colors)
    accentWarningLight: "#fbd38d",
    accentDangerLight: "#fc8181",
    accentInfoLight: "#90cdf4",
    buttonBorder: "rgba(255,255,255,0.2)",
    // Warm badge colors to match theme
    badgeSpammer: "#c53030",
    // Red
    badgeRude: "#9b4dca",
    // Purple
    badgeBeggar: "#dd6b20",
    // Orange
    badgeOfftopic: "#2b6cb0",
    // Blue
    badgeTroll: "#38a169",
    // Green
    badgeAnnoying: "#ed8936",
    // Light orange
    badgeUploader: "#48bb78",
    // Green
    badgeHelpful: "#4299e1",
    // Light blue
    badgeModerator: "#9f7aea",
    // Light purple
    badgeRequester: "#d4893a",
    // Golden orange (matches theme)
    badgeFriend: "#ed64a6",
    // Pink
    // Extended badges
    badgeSeeding: "#c53030",
    // Same red as spammer/danger
    badgeThankful: "#38a169",
    // Same green as troll
    badgeUnwanted: "#9b4dca",
    // Same purple as rude
    // Username highlight colors
    trustedUsernameColor: "#48bb78",
    // Green matching uploader badge
    blockedUsernameColor: "#ed8936"
    // Light orange matching theme
  };
  const typewriter = {
    panelBg: "#f5f1e8",
    // Warm cream (like aged paper)
    panelText: "#3d3226",
    // Dark brown (ink color)
    panelBorder: "#8b7355",
    // Warm brown border
    inputBg: "#ebe5d6",
    // Slightly darker cream
    inputBorder: "#a89070",
    // Medium brown
    inputText: "#3d3226",
    // Dark brown
    buttonPrimary: "#6b5344",
    // Darker warm brown for better contrast
    buttonDanger: "#8a3020",
    // Darker muted red-brown
    secondaryText: "#5c4a3a",
    // Medium brown
    mutedText: "#6a5a48",
    // Darker muted brown for better visibility
    tabBg: "#e8e2d4",
    // Light cream
    tabActiveBg: "#6b5344",
    // Darker brown for active tab
    sectionBg: "#ebe5d6",
    // Cream
    sectionText: "#3d3226",
    // Dark brown text for sections
    hoverBg: "#ddd5c4",
    // Hover cream
    fontFamily: "'American Typewriter', 'Courier New', monospace",
    // Additional properties for light theme compatibility
    tertiaryBg: "#e0d8c8",
    // Slightly darker cream for tertiary backgrounds
    borderLight: "#a89070",
    // Medium brown for lighter borders
    textDim: "#7a6a58",
    // Dimmer brown text for subtle labels
    // Sepia-toned badges - darker for better contrast on light bg
    badgeSpammer: "#8a3020",
    // Darker rust red
    badgeRude: "#5a3a2a",
    // Darker brown
    badgeBeggar: "#8a6020",
    // Darker tan/gold
    badgeOfftopic: "#3a5a6a",
    // Darker steel blue-grey
    badgeTroll: "#3a5a3a",
    // Darker sage green
    badgeAnnoying: "#7a5020",
    // Darker caramel
    badgeUploader: "#3a6a3a",
    // Darker forest green
    badgeHelpful: "#3a5a7a",
    // Darker dusty blue
    badgeModerator: "#5a3a6a",
    // Darker dusty purple
    badgeRequester: "#6b5344",
    // Darker warm brown
    badgeFriend: "#7a3a5a",
    // Darker dusty rose
    // Extended badges (sepia-toned)
    badgeSeeding: "#8a3020",
    // Same as spammer
    badgeThankful: "#3a6a3a",
    // Same as uploader
    badgeUnwanted: "#5a3a6a",
    // Same as moderator
    // Darker accent colors for light background
    accentSuccess: "#15803d",
    // Dark green (good contrast on cream)
    accentWarning: "#b45309",
    // Dark amber/orange
    accentDanger: "#b91c1c",
    // Dark red
    accentInfo: "#0e7490",
    // Dark cyan/teal
    accentPurple: "#6d28d9",
    // Dark purple
    accentButtonText: "#ffffff",
    // White text on accent buttons (they have solid backgrounds)
    accentSuccessAlt: "#059669",
    // Darker emerald for light background
    // Light variants for text on colored backgrounds - must be DARK for light theme readability
    accentWarningLight: "#92400e",
    // Dark amber - readable on cream backgrounds
    accentDangerLight: "#991b1b",
    // Dark red - readable on cream backgrounds
    accentInfoLight: "#0e7490",
    // Dark cyan - readable on cream backgrounds
    buttonBorder: "rgba(0,0,0,0.15)",
    // Dark border overlay for light theme
    // Username highlight colors (dark for light theme readability)
    trustedUsernameColor: "#15803d",
    // Dark green (same as accentSuccess)
    blockedUsernameColor: "#b91c1c"
    // Dark red
  };
  const candy = {
    panelBg: "#0f0020",
    // Very dark purple-black for max contrast
    panelText: "#ffffff",
    // Pure white
    panelBorder: "#ff00ff",
    // Bright magenta
    inputBg: "#1a0030",
    // Dark purple
    inputBorder: "#00ffff",
    // Cyan border (different from panel!)
    inputText: "#ffffff",
    // White
    buttonPrimary: "#ff6b00",
    // Bright orange (like an orange candy)
    buttonDanger: "#ff0055",
    // Neon pink-red
    secondaryText: "#ffff00",
    // Bright yellow
    mutedText: "#00ff88",
    // Neon green
    tabBg: "#1a0030",
    // Dark purple
    tabActiveBg: "#ff00aa",
    // Hot magenta
    sectionBg: "#150028",
    // Slightly lighter purple
    sectionText: "#ffffff",
    // White
    hoverBg: "#2a0050",
    // Brighter purple on hover
    fontFamily: "'Trebuchet MS', 'Avenir Next Rounded', system-ui, sans-serif",
    // Additional properties
    tertiaryBg: "#120024",
    borderLight: "#ff00ff60",
    // Semi-transparent magenta
    textDim: "#00cc77",
    // Darker neon green
    // Request feature - cyan candy
    requestColor: "#00ffff",
    // Cyan (blue raspberry)
    requestHover: "#00cccc",
    // Darker cyan
    // Neon candy accent colors
    accentSuccess: "#00ff88",
    // Mint green (spearmint)
    accentWarning: "#ffcc00",
    // Bright gold (lemon)
    accentDanger: "#ff0055",
    // Neon pink-red
    accentInfo: "#00ffff",
    // Cyan
    accentPurple: "#aa00ff",
    // Purple (grape)
    notesColor: "#aa00ff",
    notesHover: "#8800cc",
    accentButtonText: "#ffffff",
    accentButtonTextDark: "#000000",
    accentSuccessAlt: "#00cc66",
    // Light variants (neon colors for candy theme)
    accentWarningLight: "#ffff00",
    // Bright yellow
    accentDangerLight: "#ff6688",
    // Light neon pink
    accentInfoLight: "#66ffff",
    // Light cyan
    buttonBorder: "rgba(255,255,255,0.3)",
    // RAINBOW badges - every color of the rainbow!
    badgeSpammer: "#ff0000",
    // Bright red (cherry)
    badgeRude: "#ff00ff",
    // Magenta (grape)
    badgeBeggar: "#ff8800",
    // Orange (orange candy)
    badgeOfftopic: "#00aaff",
    // Sky blue (blue raspberry)
    badgeTroll: "#00ff00",
    // Lime green (green apple)
    badgeAnnoying: "#cc8800",
    // Gold/Amber (butterscotch) - distinct from orange
    badgeUploader: "#00ff88",
    // Mint green (spearmint)
    badgeHelpful: "#00ffff",
    // Cyan (cotton candy blue)
    badgeModerator: "#ffcc00",
    // Bright gold (lemon drop) - distinct from magenta
    badgeRequester: "#ff0088",
    // Hot pink (watermelon)
    badgeFriend: "#ff66aa",
    // Pink (bubblegum)
    // Extended badges
    badgeSeeding: "#cc0000",
    // Dark red (cinnamon)
    badgeThankful: "#00cc66",
    // Teal green (mint)
    badgeUnwanted: "#aa00ff",
    // Purple (grape candy)
    // Username highlight colors (neon colors for candy theme)
    trustedUsernameColor: "#00ff88",
    // Mint green (spearmint)
    blockedUsernameColor: "#ff0055"
    // Neon pink-red (same as buttonDanger)
  };
  const THEME_PRESETS = {
    classic,
    "1337x": theme1337x,
    typewriter,
    colorblind,
    midnight,
    ocean,
    monkey,
    candy
  };
  function generateThemeCSS(themeName, themeColors) {
    const sectionTextColor = themeColors.sectionText || themeColors.panelText;
    const tertiaryBg = themeColors.tertiaryBg || themeColors.sectionBg;
    const borderLight = themeColors.borderLight || themeColors.panelBorder;
    const textDim = themeColors.textDim || themeColors.mutedText;
    const requestColor = themeColors.requestColor || "#14b8a6";
    const requestHover = themeColors.requestHover || "#0d9488";
    const buttonReply = themeColors.buttonReply || themeColors.buttonPrimary;
    const buttonRequest = themeColors.buttonRequest || "#14b8a6";
    const buttonNote = themeColors.buttonNote || "#8b5cf6";
    const buttonPrimaryText = themeColors.buttonPrimaryText || "#ffffff";
    const buttonDangerText = themeColors.buttonDangerText || "#ffffff";
    const buttonReplyText = themeColors.buttonReplyText || "#ffffff";
    const buttonRequestText = themeColors.buttonRequestText || "#ffffff";
    const buttonNoteText = themeColors.buttonNoteText || "#ffffff";
    const accentSuccess = themeColors.accentSuccess || "#22c55e";
    const accentWarning = themeColors.accentWarning || "#f59e0b";
    const accentDanger = themeColors.accentDanger || "#ef4444";
    const accentInfo = themeColors.accentInfo || "#06b6d4";
    const accentPurple = themeColors.accentPurple || "#8b5cf6";
    const notesColor = themeColors.notesColor || accentPurple;
    const notesHover = themeColors.notesHover || "#7c3aed";
    const accentButtonText = themeColors.accentButtonText || "#ffffff";
    const accentButtonTextDark = themeColors.accentButtonTextDark || "#000000";
    const accentSuccessAlt = themeColors.accentSuccessAlt || "#10b981";
    const accentWarningLight = themeColors.accentWarningLight || "#fcd34d";
    const accentDangerLight = themeColors.accentDangerLight || "#fca5a5";
    const accentInfoLight = themeColors.accentInfoLight || "#67e8f9";
    const buttonBorder = themeColors.buttonBorder || "rgba(255,255,255,0.2)";
    const trustedUsernameColor = themeColors.trustedUsernameColor || "#4ade80";
    const blockedUsernameColor = themeColors.blockedUsernameColor || "#ff6b6b";
    const themeVars = `
                --xcb-bg: ${themeColors.panelBg};
                --xcb-text: ${themeColors.panelText};
                --xcb-border: ${themeColors.panelBorder};
                --xcb-input-bg: ${themeColors.inputBg};
                --xcb-input-border: ${themeColors.inputBorder};
                --xcb-input-text: ${themeColors.inputText};
                --xcb-section-bg: ${themeColors.sectionBg};
                --xcb-section-text: ${sectionTextColor};
                --xcb-hover-bg: ${themeColors.hoverBg};
                --xcb-secondary: ${themeColors.secondaryText};
                --xcb-muted: ${themeColors.mutedText};
                --xcb-primary: ${themeColors.buttonPrimary};
                --xcb-primary-text: ${buttonPrimaryText};
                --xcb-danger: ${themeColors.buttonDanger};
                --xcb-danger-text: ${buttonDangerText};
                --xcb-button-reply: ${buttonReply};
                --xcb-button-reply-text: ${buttonReplyText};
                --xcb-button-request: ${buttonRequest};
                --xcb-button-request-text: ${buttonRequestText};
                --xcb-button-note: ${buttonNote};
                --xcb-button-note-text: ${buttonNoteText};
                --xcb-tab-bg: ${themeColors.tabBg};
                --xcb-tab-active-bg: ${themeColors.tabActiveBg};
                --xcb-font-family: ${themeColors.fontFamily};
                --xcb-badge-spammer: ${themeColors.badgeSpammer};
                --xcb-badge-rude: ${themeColors.badgeRude};
                --xcb-badge-beggar: ${themeColors.badgeBeggar};
                --xcb-badge-offtopic: ${themeColors.badgeOfftopic};
                --xcb-badge-troll: ${themeColors.badgeTroll};
                --xcb-badge-annoying: ${themeColors.badgeAnnoying};
                --xcb-badge-uploader: ${themeColors.badgeUploader};
                --xcb-badge-helpful: ${themeColors.badgeHelpful};
                --xcb-badge-moderator: ${themeColors.badgeModerator};
                --xcb-badge-requester: ${themeColors.badgeRequester};
                --xcb-badge-friend: ${themeColors.badgeFriend};
                --xcb-badge-seeding: ${themeColors.badgeSeeding || "#b91c1c"};
                --xcb-badge-thankful: ${themeColors.badgeThankful || "#10b981"};
                --xcb-badge-unwanted: ${themeColors.badgeUnwanted || "#7c3aed"};
                /* Accent colors for buttons and UI elements */
                --xcb-accent-success: ${accentSuccess};
                --xcb-accent-warning: ${accentWarning};
                --xcb-accent-danger: ${accentDanger};
                --xcb-accent-info: ${accentInfo};
                --xcb-accent-purple: ${accentPurple};
                --xcb-notes-color: ${notesColor};
                --xcb-notes-hover: ${notesHover};
                --xcb-btn-text: ${accentButtonText};
                --xcb-btn-text-dark: ${accentButtonTextDark};
                --xcb-accent-success-alt: ${accentSuccessAlt};
                --xcb-accent-warning-light: ${accentWarningLight};
                --xcb-accent-danger-light: ${accentDangerLight};
                --xcb-accent-info-light: ${accentInfoLight};
                --xcb-btn-border: ${buttonBorder};
                /* Longer aliases for CSS compatibility */
                --xcb-panel-bg: ${themeColors.panelBg};
                --xcb-panel-secondary-bg: ${themeColors.sectionBg};
                --xcb-panel-tertiary-bg: ${tertiaryBg};
                --xcb-panel-hover-bg: ${themeColors.hoverBg};
                --xcb-panel-text: ${themeColors.panelText};
                --xcb-panel-text-secondary: ${themeColors.secondaryText};
                --xcb-panel-text-muted: ${themeColors.mutedText};
                --xcb-panel-text-dim: ${textDim};
                --xcb-panel-border: ${themeColors.panelBorder};
                --xcb-panel-border-light: ${borderLight};
                --xcb-request-color: ${requestColor};
                --xcb-request-hover: ${requestHover};
                /* Override base blue with theme primary */
                --xcb-blue: ${themeColors.buttonPrimary};
                --xcb-blue-hover: ${themeColors.buttonPrimary};
                --xcb-highlight-color: ${themeColors.buttonDanger};
                /* Username colors in panel lists */
                --xcb-trusted-color: ${trustedUsernameColor};
                --xcb-blocked-color: ${blockedUsernameColor};`;
    return `
            /* Theme class for panels */
            .mankey-theme-${themeName} {${themeVars}
            }
            /* Apply theme to global floating elements (tour, setup, popups) */
            body.mankey-theme-${themeName}-active .xcb-tour-tooltip,
            body.mankey-theme-${themeName}-active .xcb-tour-highlight,
            body.mankey-theme-${themeName}-active .xcb-setup-panel,
            body.mankey-theme-${themeName}-active .xcb-reply-menu,
            body.mankey-theme-${themeName}-active .xcb-quick-reply-btn,
            body.mankey-theme-${themeName}-active .xcb-section-picker-popup,
            body.mankey-theme-${themeName}-active .xcb-section-edit-popup,
            body.mankey-theme-${themeName}-active .xcb-backup-history-popup,
            body.mankey-theme-${themeName}-active .xcb-add-request-btn,
            body.mankey-theme-${themeName}-active .xcb-add-note-btn {${themeVars}
            }`;
  }
  function getThemeClassName(settings) {
    const theme = settings.theme || "classic";
    if (THEME_PRESETS[theme]) {
      return `mankey-theme-${theme}`;
    }
    return "mankey-theme-custom";
  }
  function applyThemeClass(panel, settings) {
    panel.className = panel.className.replace(/\bmankey-theme-\S+/g, "").trim();
    panel.classList.add(getThemeClassName(settings));
  }
  function applyGlobalThemeClass(settings) {
    const theme = settings.theme || "classic";
    document.body.className = document.body.className.replace(/\bmankey-theme-\S+-active\b/g, "").trim();
    if (THEME_PRESETS[theme]) {
      document.body.classList.add(`mankey-theme-${theme}-active`);
    } else {
      document.body.classList.add("mankey-theme-custom-active");
    }
  }
  function formatDateTime$2(timestamp, options = {}, includeTime = true, forceUTC = false) {
    const date = new Date(timestamp);
    const timeFormat = options.timeFormat || "12h";
    const dateFormat = options.dateFormat || "MDY";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", {
      month: "short",
      timeZone: forceUTC ? "UTC" : void 0
    });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("en-US", {
      weekday: "short",
      timeZone: forceUTC ? "UTC" : void 0
    });
    let dateStr;
    switch (dateFormat) {
      case "DMY":
        dateStr = `${weekday}, ${day} ${month} ${year}`;
        break;
      case "YMD":
        dateStr = `${weekday}, ${year} ${month} ${day}`;
        break;
      case "MDY":
      default:
        dateStr = `${weekday}, ${month} ${day}, ${year}`;
        break;
    }
    if (!includeTime) return dateStr;
    let hours, minutes;
    if (forceUTC) {
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
    } else {
      hours = date.getHours();
      minutes = date.getMinutes();
    }
    let timeStr;
    if (forceUTC || timeFormat === "24h") {
      timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    } else {
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      timeStr = `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    }
    let tzSuffix;
    if (forceUTC) {
      tzSuffix = " UTC";
    } else {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" });
        const parts = formatter.formatToParts(date);
        const tzPart = parts.find((part) => part.type === "timeZoneName");
        tzSuffix = tzPart ? ` ${tzPart.value}` : "";
      } catch {
        const tzAbbr = date.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop() || "";
        tzSuffix = tzAbbr ? ` ${tzAbbr}` : "";
      }
    }
    return `${dateStr} at ${timeStr}${tzSuffix}`;
  }
  const HIGHLIGHT_COLOR = "#ff6b6b";
  const TRUSTED_COLOR = "#4ade80";
  const KEYWORD_COLOR = "#f59e0b";
  const REASON_COLORS = {
    helpful: "#22c55e",
    important: "#ef4444",
    complaint: "#f97316",
    question: "#3b82f6",
    feedback: "#8b5cf6",
    "follow-up": "#06b6d4"
  };
  const PERMANENT_WHITELIST = [
    "System"
    // Automatic messages from mods
  ];
  const SITE_TRUSTED_CLASSES = [
    "vip",
    // VIP users
    "moderator",
    // Moderators
    "admin",
    // Admins
    "supermod"
    // Super moderators
  ];
  const DEFAULT_QUICK_REPLIES = [
    "Sorry, I'm not taking requests at this time.",
    "Please check my other uploads for similar content.",
    "Thanks for your feedback!",
    "This has already been answered in the description."
  ];
  const DEFAULT_TRUSTED_REPLIES = [
    "Thanks for your support!",
    "I'll look into your request!",
    "Great suggestion, I'll consider it!",
    "Thanks for the feedback!"
  ];
  const DEFAULT_NEUTRAL_REPLIES = [
    "Thanks for your comment!",
    "Please read the description for more info.",
    "I appreciate the feedback!",
    "Feel free to check my other uploads."
  ];
  const DEFAULT_SEEDING_REPLIES = [
    "My seedbox is running at full speed, so the issue is on your end. Here's what to check:\n\n1) Port Forwarding - forward a port in your router and set it in your torrent client. Without this, you can only connect to peers who have their ports open.\n\n2) ISP Throttling - many ISPs throttle P2P traffic. Enable encryption (forced) in your client or use a VPN.\n\n3) Firewall/Antivirus - add an exception for your torrent client.\n\n4) Client Settings - make sure you haven't limited download speed and max connections aren't too low.\n\n5) DHT/PeX - enable these for better peer discovery.\n\nTry qBittorrent or Transmission if your current client underperforms.",
    "I'm seeding at full capacity. Make sure your torrent client has a port forwarded and isn't being throttled by your ISP or firewall.",
    "My seedbox is running at max speed. The bottleneck is likely on your end - check port forwarding, ISP throttling, or client settings.",
    "Try: 1) Forward a port, 2) Enable encryption, 3) Check if ISP throttles P2P, 4) Add firewall exception.",
    "Seeding at max speed. Check your port forwarding and ISP throttling.",
    "Speed issue is on your end - try enabling encryption or using a VPN.",
    "My seedbox is at full capacity. Check your client settings.",
    "Download speed depends on your connection, not mine."
  ];
  const BLOCK_REASON_PRESETS = [
    "Spammer",
    "Rude/Toxic",
    "Beggar",
    "Off-topic",
    "Troll",
    "Annoying",
    "Unwanted Advice"
  ];
  const TRUST_REASON_PRESETS = [
    "Uploader",
    "Helpful",
    "Requester",
    "Friend",
    "Seeding Issues",
    "Thankful"
  ];
  const DEFAULT_CUSTOM$1 = {
    colors: {
      blocked: HIGHLIGHT_COLOR,
      trusted: TRUSTED_COLOR,
      keyword: KEYWORD_COLOR,
      panelBg: "#1a1a2e",
      panelText: "#ffffff",
      panelBorder: "#3b82f6",
      inputBg: "#2a2a3e",
      inputBorder: "#444444",
      inputText: "#ffffff",
      buttonPrimary: "#3b82f6",
      buttonPrimaryText: "#ffffff",
      buttonDanger: "#dc2626",
      buttonDangerText: "#ffffff",
      buttonReply: "#3b82f6",
      // Blue (same as primary by default)
      buttonReplyText: "#ffffff",
      buttonRequest: "#14b8a6",
      // Teal
      buttonRequestText: "#ffffff",
      buttonNote: "#8b5cf6",
      // Purple
      buttonNoteText: "#ffffff",
      badgeSpammer: "#dc2626",
      // Red
      badgeRude: "#be185d",
      // Rose/Magenta (was purple - too similar to moderator)
      badgeBeggar: "#ea580c",
      // Orange
      badgeOfftopic: "#0891b2",
      // Cyan
      badgeTroll: "#65a30d",
      // Lime green
      badgeAnnoying: "#854d0e",
      // Brown/Ochre (was orange - too similar to beggar)
      badgeUploader: "#22c55e",
      // Green
      badgeHelpful: "#06b6d4",
      // Cyan
      badgeModerator: "#eab308",
      // Gold/Yellow (was purple - now distinct)
      badgeRequester: "#f97316",
      // Orange
      badgeFriend: "#ec4899",
      // Pink
      badgeSeeding: "#b91c1c",
      // Dark red (distinct from spammer)
      badgeThankful: "#10b981",
      // Emerald
      badgeUnwanted: "#7c3aed",
      // Violet (distinct from rose and gold)
      secondaryText: "#aaaaaa",
      mutedText: "#666666",
      tabBg: "#2a2a3e",
      tabActiveBg: "#3b82f6",
      sectionBg: "#2a2a3e",
      hoverBg: "#444444",
      // Username highlight colors in panel lists
      trustedUsernameColor: "#4ade80",
      blockedUsernameColor: "#ff6b6b"
    },
    font: {
      family: "inherit",
      size: "13px"
    },
    badgeFont: {
      family: "inherit",
      size: "11px"
    }
  };
  function sortUserList(list, sortOrder) {
    const sorted = [...list];
    switch (sortOrder) {
      case "recent":
        return sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
      case "oldest":
        return sorted.sort((a, b) => (a.date || 0) - (b.date || 0));
      case "alpha-asc":
        return sorted.sort(
          (a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        );
      case "alpha-desc":
        return sorted.sort(
          (a, b) => b.username.toLowerCase().localeCompare(a.username.toLowerCase())
        );
      case "most-hidden":
        return sorted.sort((a, b) => (b.hideCount || 0) - (a.hideCount || 0));
      default:
        return sorted;
    }
  }
  function sortKeywordList(list, sortOrder) {
    const sorted = [...list];
    switch (sortOrder) {
      case "recent":
        return sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
      case "oldest":
        return sorted.sort((a, b) => (a.date || 0) - (b.date || 0));
      case "alpha-asc":
        return sorted.sort(
          (a, b) => a.keyword.toLowerCase().localeCompare(b.keyword.toLowerCase())
        );
      case "alpha-desc":
        return sorted.sort(
          (a, b) => b.keyword.toLowerCase().localeCompare(a.keyword.toLowerCase())
        );
      default:
        return sorted;
    }
  }
  function sortRequestList(list, sortOrder) {
    const sorted = [...list];
    switch (sortOrder) {
      case "recent":
        return sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
      case "oldest":
        return sorted.sort((a, b) => (a.date || 0) - (b.date || 0));
      case "alpha-asc":
        return sorted.sort(
          (a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())
        );
      case "alpha-desc":
        return sorted.sort(
          (a, b) => b.text.toLowerCase().localeCompare(a.text.toLowerCase())
        );
      case "status": {
        const statusOrder = {
          pending: 0,
          completed: 1,
          declined: 2
        };
        return sorted.sort(
          (a, b) => (statusOrder[a.status || "pending"] || 0) - (statusOrder[b.status || "pending"] || 0)
        );
      }
      case "username":
        return sorted.sort(
          (a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        );
      default:
        return sorted;
    }
  }
  function getContrastColor$2(hexColor, badgeTextMode = "auto") {
    if (badgeTextMode === "white") return "#ffffff";
    if (badgeTextMode === "black") return "#000000";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }
  function isLightColor(hexColor) {
    if (!hexColor) return false;
    const hex = hexColor.replace("#", "");
    const num = parseInt(hex, 16);
    return num > 11184810 || hexColor.toLowerCase() === "#ffffff" || hexColor.toLowerCase() === "#fafafa" || hexColor.toLowerCase() === "#f8f9fa";
  }
  function hashComment(text) {
    let hash = 0;
    const str = text.substring(0, 200);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  function downloadFile(content, filename, mimeType, filenamePrefix) {
    const blob = new Blob([content], { type: mimeType + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  function getBlocklist() {
    const stored = GM_getValue("blocklist_v2", null);
    if (stored) return JSON.parse(stored);
    const oldList = GM_getValue("blocklist", null);
    if (oldList) {
      const parsed = JSON.parse(oldList);
      const newFormat = {};
      parsed.forEach((u) => {
        newFormat[u.toLowerCase()] = {
          username: u,
          note: "",
          level: "hard",
          date: Date.now(),
          expiry: null,
          hideCount: 0
        };
      });
      saveBlocklist(newFormat);
      return newFormat;
    }
    return {};
  }
  function saveBlocklist(list) {
    GM_setValue("blocklist_v2", JSON.stringify(list));
  }
  function getTrustedlist() {
    const stored = GM_getValue("trustedlist_v2", null);
    if (stored) return JSON.parse(stored);
    const oldList = GM_getValue("trustedlist", null);
    if (oldList) {
      const parsed = JSON.parse(oldList);
      const newFormat = {};
      parsed.forEach((u) => {
        newFormat[u.toLowerCase()] = { username: u, note: "", date: Date.now() };
      });
      saveTrustedlist(newFormat);
      return newFormat;
    }
    return {};
  }
  function saveTrustedlist(list) {
    GM_setValue("trustedlist_v2", JSON.stringify(list));
  }
  function getKeywords() {
    const stored = GM_getValue("keywords_v2", null);
    if (stored) return JSON.parse(stored);
    const oldList = GM_getValue("keywords", null);
    if (oldList) {
      const parsed = JSON.parse(oldList);
      const newFormat = parsed.map((kw, index) => ({
        keyword: kw,
        date: Date.now() - (parsed.length - index) * 1e3
        // Preserve order as pseudo-dates
      }));
      saveKeywords(newFormat);
      return newFormat;
    }
    return [];
  }
  function saveKeywords(list) {
    GM_setValue("keywords_v2", JSON.stringify(list));
  }
  function getKeywordStrings() {
    return getKeywords().map((k) => k.keyword);
  }
  function getHighlightedKeywords() {
    const stored = GM_getValue("highlightedKeywords_v1", null);
    if (stored) return JSON.parse(stored);
    return [];
  }
  function saveHighlightedKeywords(list) {
    GM_setValue("highlightedKeywords_v1", JSON.stringify(list));
  }
  function getHighlightedKeywordStrings() {
    return getHighlightedKeywords().map((k) => k.keyword);
  }
  function getPermanentWhitelist() {
    const stored = GM_getValue("permanentWhitelist", null);
    return stored ? JSON.parse(stored) : [];
  }
  function savePermanentWhitelist(list) {
    GM_setValue("permanentWhitelist", JSON.stringify(list));
  }
  function addToPermanentWhitelist(username) {
    const list = getPermanentWhitelist();
    const key = username.toLowerCase().trim();
    if (!list.some((u) => u.toLowerCase() === key)) {
      list.push(username.trim());
      savePermanentWhitelist(list);
      return true;
    }
    return false;
  }
  function removeFromPermanentWhitelist(username) {
    let list = getPermanentWhitelist();
    list = list.filter((u) => u.toLowerCase() !== username.toLowerCase().trim());
    savePermanentWhitelist(list);
  }
  function getCustomReasons() {
    const stored = GM_getValue("customReasons", null);
    return stored ? JSON.parse(stored) : [];
  }
  function saveCustomReasons(list) {
    GM_setValue("customReasons", JSON.stringify(list));
  }
  const MAX_CUSTOM_TAGS = 10;
  function addCustomReason(name, color) {
    const list = getCustomReasons();
    if (list.length >= MAX_CUSTOM_TAGS) return "max";
    const nameLower = name.toLowerCase();
    const allPresets = [...BLOCK_REASON_PRESETS, ...TRUST_REASON_PRESETS];
    const isDefaultPreset = allPresets.some((p) => p.toLowerCase() === nameLower);
    if (isDefaultPreset) return "default";
    const exists = list.find((r) => r.name.toLowerCase() === nameLower);
    if (exists) return "exists";
    list.push({ name: name.trim(), color });
    saveCustomReasons(list);
    return "success";
  }
  function removeCustomReason(name) {
    let list = getCustomReasons();
    list = list.filter((r) => r.name.toLowerCase() !== name.toLowerCase());
    saveCustomReasons(list);
    const tagToRemove = name.toLowerCase();
    const blocklist = getBlocklist();
    Object.values(blocklist).forEach((user) => {
      if (user.note) {
        const tags = user.note.split(/[,;]+/).map((t) => t.trim());
        const filteredTags = tags.filter((t) => t.toLowerCase() !== tagToRemove);
        user.note = filteredTags.join(", ");
      }
    });
    saveBlocklist(blocklist);
    const trustedlist = getTrustedlist();
    Object.values(trustedlist).forEach((user) => {
      if (user.note) {
        const tags = user.note.split(/[,;]+/).map((t) => t.trim());
        const filteredTags = tags.filter((t) => t.toLowerCase() !== tagToRemove);
        user.note = filteredTags.join(", ");
      }
    });
    saveTrustedlist(trustedlist);
  }
  function updateCustomReason(oldName, newName, newColor) {
    const list = getCustomReasons();
    const idx = list.findIndex(
      (r) => r.name.toLowerCase() === oldName.toLowerCase()
    );
    if (idx !== -1) {
      list[idx] = { name: newName.trim(), color: newColor };
      saveCustomReasons(list);
    }
  }
  function getSeenCommenters() {
    const stored = GM_getValue("seenCommenters", null);
    return stored ? JSON.parse(stored) : [];
  }
  function saveSeenCommenters(list) {
    GM_setValue("seenCommenters", JSON.stringify(list));
  }
  function addSeenCommenter(username) {
    const list = getSeenCommenters();
    const normalizedUsername = username.toLowerCase().trim();
    if (!list.includes(normalizedUsername)) {
      list.push(normalizedUsername);
      saveSeenCommenters(list);
    }
  }
  function migrateCustomTagsToDefaults() {
    const customReasons = getCustomReasons();
    if (customReasons.length === 0) return;
    const allPresets = [...BLOCK_REASON_PRESETS, ...TRUST_REASON_PRESETS];
    const presetsLower = allPresets.map((p) => p.toLowerCase());
    const filteredReasons = customReasons.filter((r) => {
      const isDefault = presetsLower.includes(r.name.toLowerCase());
      if (isDefault) {
        console.log(`[MaNKeY-Bot] Migrating custom tag "${r.name}" to default preset`);
      }
      return !isDefault;
    });
    if (filteredReasons.length < customReasons.length) {
      saveCustomReasons(filteredReasons);
      console.log(`[MaNKeY-Bot] Migrated ${customReasons.length - filteredReasons.length} custom tags to default presets`);
    }
  }
  const MAX_IMPORTED_THEMES = 5;
  function getSettings() {
    const stored = GM_getValue("settings", null);
    const defaults = {
      hideEntireComment: false,
      quickReplyMessage: DEFAULT_QUICK_REPLIES[0],
      quickReplies: [...DEFAULT_QUICK_REPLIES],
      trustedReplyMessage: DEFAULT_TRUSTED_REPLIES[0],
      trustedReplies: [...DEFAULT_TRUSTED_REPLIES],
      neutralReplyMessage: DEFAULT_NEUTRAL_REPLIES[0],
      neutralReplies: [...DEFAULT_NEUTRAL_REPLIES],
      seedingReplyMessage: DEFAULT_SEEDING_REPLIES[0],
      seedingReplies: [...DEFAULT_SEEDING_REPLIES],
      myUsername: "",
      setupSkipped: false,
      keyboardShortcuts: true,
      panelSize: "medium",
      panelCustomWidth: null,
      panelCustomHeight: null,
      customColors: { ...DEFAULT_CUSTOM$1.colors },
      customFont: { ...DEFAULT_CUSTOM$1.font },
      badgeFont: { ...DEFAULT_CUSTOM$1.badgeFont },
      theme: "classic",
      importedThemes: [],
      badgeTextMode: "auto",
      requestsEnabled: true,
      notesEnabled: true,
      requestsPaused: false,
      requestLimitPerUser: 0,
      totalRequestsLimit: 0,
      requestCountMode: "requests",
      autoBackupEnabled: false,
      autoBackupInterval: "daily",
      lastAutoBackup: null,
      backupShowSaveAs: true,
      backupFilenamePrefix: "mankey-bot-backup",
      blocklistSortOrder: "recent",
      trustedlistSortOrder: "recent",
      keywordsSortOrder: "recent",
      requestsSortOrder: "recent",
      firstTimerTrackingEnabled: true,
      showHelpByDefault: false,
      guidedTourCompleted: true,
      wantsGuidedTour: false,
      lastSeenTourVersion: 1,
      setupCompletedAt: null,
      buttonPosition: "bottom-right",
      noteSectionViewEnabled: false,
      timeFormat: "12h",
      dateFormat: "MDY",
      onlyShowToolsOnMyUploads: true,
      keyboardHintShown: false
    };
    const result = stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    result.customColors = {
      ...DEFAULT_CUSTOM$1.colors,
      ...result.customColors
    };
    result.customFont = { ...DEFAULT_CUSTOM$1.font, ...result.customFont };
    result.badgeFont = {
      ...DEFAULT_CUSTOM$1.badgeFont,
      ...result.badgeFont || {}
    };
    result.theme = result.theme || "classic";
    if (result.countSubtasksAsRequests !== void 0 && !result.requestCountMode) {
      result.requestCountMode = result.countSubtasksAsRequests ? "requests_and_subtasks" : "requests";
      delete result.countSubtasksAsRequests;
    }
    if (!result.requestCountMode || !["requests", "requests_and_subtasks", "subtasks_only"].includes(result.requestCountMode)) {
      result.requestCountMode = "requests";
    }
    result.seedingReplies = [...DEFAULT_SEEDING_REPLIES];
    if (!result.seedingReplyMessage || !DEFAULT_SEEDING_REPLIES.includes(result.seedingReplyMessage)) {
      result.seedingReplyMessage = DEFAULT_SEEDING_REPLIES[0];
    }
    return result;
  }
  function saveSettings(settings) {
    GM_setValue("settings", JSON.stringify(settings));
  }
  function getMyUsername() {
    const settings = getSettings();
    if (settings.myUsername) {
      return settings.myUsername;
    }
    return getVerifiedUsername() || "";
  }
  function setMyUsername(username) {
    const s = getSettings();
    s.myUsername = username.trim();
    saveSettings(s);
  }
  function isLoggedInToSite() {
    var _a, _b;
    const loginLinks = document.querySelectorAll('a[href*="/login"], a[href*="/register"], a[href*="registering.html"]');
    for (const link of loginLinks) {
      const linkEl = link;
      link.getAttribute("href") || "";
      const text = ((_a = linkEl.textContent) == null ? void 0 : _a.trim().toLowerCase()) || "";
      const inNavArea = link.closest(".head") || link.closest(".header") || link.closest("nav") || link.closest(".top-menu") || link.closest(".dropdown") || link.closest(".navbar") || link.closest(".main-menu") || link.closest("#header") || link.closest(".box-info");
      const style = window.getComputedStyle(linkEl);
      const isHidden = style.display === "none" || style.visibility === "hidden" || style.opacity === "0" || linkEl.offsetWidth === 0 || linkEl.offsetHeight === 0;
      if (inNavArea && !isHidden) {
        if (text.includes("login") || text.includes("register") || text.includes("sign in") || text.includes("sign up")) {
          return false;
        }
      }
    }
    const logoutLink = document.querySelector('a[href*="logout"], a[href*="/logout"]');
    if (logoutLink) {
      const style = window.getComputedStyle(logoutLink);
      const isHidden = style.display === "none" || style.visibility === "hidden";
      if (!isHidden) {
        return true;
      }
    }
    const allLinks = document.querySelectorAll("a");
    for (const link of allLinks) {
      const text = ((_b = link.textContent) == null ? void 0 : _b.trim().toLowerCase()) || "";
      if (text === "logout" || text === "log out" || text === "sign out") {
        return true;
      }
    }
    const accountIndicators = [
      'a[href*="/account"]',
      'a[href*="/my-torrents"]',
      'a[href*="/my-profile"]',
      'a[href*="/upload"]',
      // Upload link typically requires login
      ".user-menu",
      ".account-menu",
      ".profile-dropdown"
    ];
    for (const selector of accountIndicators) {
      const el = document.querySelector(selector);
      if (el) {
        const inNavArea = el.closest(".head") || el.closest(".header") || el.closest("nav") || el.closest(".top-menu") || el.closest(".navbar") || el.closest("#header");
        if (inNavArea) {
          const style = window.getComputedStyle(el);
          const isHidden = style.display === "none" || style.visibility === "hidden";
          if (!isHidden) {
            return true;
          }
        }
      }
    }
    const headerUserLink = document.querySelector(
      '.head a[href*="/user/"], .header a[href*="/user/"], nav a[href*="/user/"], .top-menu a[href*="/user/"], .navbar a[href*="/user/"], #header a[href*="/user/"]'
    );
    if (headerUserLink) {
      return true;
    }
    return false;
  }
  function getLoggedInUsername() {
    var _a, _b;
    if (!window.location.pathname.includes("/account")) {
      return null;
    }
    const pageText = document.body.innerText;
    const welcomeMatch = pageText.match(/(?:Welcome|Hello|Hi),?\s+([A-Za-z0-9_-]{3,})/i);
    if (welcomeMatch) return welcomeMatch[1];
    const usernameLabel = pageText.match(/Username[:\s]+([A-Za-z0-9_-]{3,})/i);
    if (usernameLabel) return usernameLabel[1];
    const dropdownLinks = document.querySelectorAll(".dropdown a, .dropdown-toggle, .user-dropdown, .account-dropdown");
    for (const link of dropdownLinks) {
      const text = ((_a = link.textContent) == null ? void 0 : _a.trim()) || "";
      if (text && text.length >= 3 && /^[A-Za-z0-9_-]+$/.test(text)) {
        return text;
      }
    }
    const headerUserLinks = document.querySelectorAll('.head a[href*="/user/"], .header a[href*="/user/"], nav a[href*="/user/"], .top-menu a[href*="/user/"]');
    for (const link of headerUserLinks) {
      const href = link.getAttribute("href") || "";
      const match = href.match(/\/user\/([^/?#]+)/);
      if (match && match[1].length >= 3) return decodeURIComponent(match[1]);
    }
    const boxInfo = document.querySelector(".box-info, .box-info-detail, .box-info-heading");
    if (boxInfo) {
      const userLink = boxInfo.querySelector('a[href*="/user/"]');
      if (userLink) {
        const href = userLink.getAttribute("href") || "";
        const match = href.match(/\/user\/([^/?#]+)/);
        if (match && match[1].length >= 3) return decodeURIComponent(match[1]);
      }
    }
    const headings = document.querySelectorAll("h1, h2, h3, .heading");
    for (const heading of headings) {
      const userLink = heading.querySelector('a[href*="/user/"]');
      if (userLink) {
        const href = userLink.getAttribute("href") || "";
        const match = href.match(/\/user\/([^/?#]+)/);
        if (match && match[1].length >= 3) return decodeURIComponent(match[1]);
      }
    }
    const allUserLinks = document.querySelectorAll('a[href*="/user/"]');
    for (const link of allUserLinks) {
      const linkElement = link;
      const href = linkElement.getAttribute("href") || "";
      const match = href.match(/\/user\/([^/?#]+)/);
      if (match) {
        const username = decodeURIComponent(match[1]);
        const linkText = ((_b = linkElement.textContent) == null ? void 0 : _b.trim()) || "";
        if (username && username.length >= 3 && linkText.toLowerCase() === username.toLowerCase()) {
          return username;
        }
      }
    }
    const accountSections = document.querySelectorAll('.account, .profile, .user-info, .user-details, [class*="account"], [class*="profile"]');
    for (const section of accountSections) {
      const userLink = section.querySelector('a[href*="/user/"]');
      if (userLink) {
        const href = userLink.getAttribute("href") || "";
        const match = href.match(/\/user\/([^/?#]+)/);
        if (match && match[1].length >= 3) return decodeURIComponent(match[1]);
      }
    }
    for (const link of allUserLinks) {
      const href = link.getAttribute("href") || "";
      const match = href.match(/\/user\/([^/?#]+)/);
      if (match) {
        const username = decodeURIComponent(match[1]);
        if (username && username.length >= 3) {
          return username;
        }
      }
    }
    return null;
  }
  function getVerifiedUsername() {
    const stored = GM_getValue("verifiedUsername", null);
    return stored;
  }
  function setVerifiedUsername(username) {
    if (username) {
      GM_setValue("verifiedUsername", username);
    } else {
      GM_deleteValue("verifiedUsername");
    }
  }
  function getUserRank() {
    if (!window.location.pathname.includes("/account")) {
      return null;
    }
    const pageText = document.body.innerText;
    const rankMatch = pageText.match(/User\s+rank[:\s]+(\w+(?:\s+\w+)?)/i);
    if (rankMatch) {
      const rankText = rankMatch[1].trim();
      if (/admin/i.test(rankText)) return "Admin";
      if (/moderator/i.test(rankText)) return "Moderator";
      if (/vip/i.test(rankText)) return "VIP";
      if (/trial\s*uploader/i.test(rankText)) return "Trial Uploader";
      if (/uploader/i.test(rankText)) return "Uploader";
      if (/member/i.test(rankText)) return "Member";
    }
    const boxInfos = document.querySelectorAll(".box-info, .box-info-detail, .list-1 li");
    for (const box of boxInfos) {
      const text = box.textContent || "";
      if (text.includes("User rank") || text.includes("Rank")) {
        if (/Admin/i.test(text)) return "Admin";
        if (/Moderator/i.test(text)) return "Moderator";
        if (/VIP/i.test(text)) return "VIP";
        if (/Trial Uploader/i.test(text)) return "Trial Uploader";
        if (/Uploader/i.test(text) && !/Trial/i.test(text)) return "Uploader";
        if (/Member/i.test(text)) return "Member";
      }
    }
    return null;
  }
  function getVerifiedRank() {
    const stored = GM_getValue("verifiedRank", null);
    return stored;
  }
  function setVerifiedRank(rank) {
    if (rank) {
      GM_setValue("verifiedRank", rank);
    } else {
      GM_deleteValue("verifiedRank");
    }
  }
  function isRankVerified() {
    return getVerifiedRank() !== null;
  }
  function hasUploaderAccess() {
    const rank = getVerifiedRank();
    if (!rank) return false;
    const uploaderRanks = ["Trial Uploader", "Uploader", "VIP", "Moderator", "Admin"];
    return uploaderRanks.includes(rank);
  }
  function isMemberRank() {
    return getVerifiedRank() === "Member";
  }
  function clearVerifiedRank() {
    GM_deleteValue("verifiedRank");
  }
  function detectMemberFromUploadPage() {
    if (!window.location.pathname.includes("/upload")) {
      return false;
    }
    const pageText = document.body.innerText.toLowerCase();
    const pageHTML = document.body.innerHTML.toLowerCase();
    const applicationIndicators = [
      "apply to become",
      "become an uploader",
      "uploader application",
      "application form",
      "apply for uploader",
      "to become uploader",
      "want to upload",
      "wish to upload",
      "uploading privileges",
      "upload privileges",
      "request upload",
      "must be an uploader",
      "need to be an uploader",
      "only uploaders can",
      "uploaders only"
    ];
    const rejectionIndicators = [
      "application rejected",
      "application denied",
      "application pending",
      "under review",
      "not approved",
      "was rejected",
      "has been rejected",
      "been denied",
      "try again later",
      "reapply",
      "re-apply"
    ];
    const instructionIndicators = [
      "read the rules",
      "read our rules",
      "upload rules",
      "uploading rules",
      "follow these steps",
      "requirements to upload",
      "upload requirements",
      "before you can upload",
      "in order to upload"
    ];
    for (const indicator of [...applicationIndicators, ...rejectionIndicators, ...instructionIndicators]) {
      if (pageText.includes(indicator)) {
        return true;
      }
    }
    const hasUploadForm = document.querySelector('input[type="file"]') !== null || document.querySelector('form[action*="upload"]') !== null || document.querySelector('[name="torrent"]') !== null || document.querySelector(".upload-form") !== null || pageHTML.includes('enctype="multipart/form-data"');
    if (!hasUploadForm && pageText.length > 100) {
      const noAccessIndicators = [
        "you cannot upload",
        "you can't upload",
        "not allowed to upload",
        "no permission",
        "permission denied",
        "access denied"
      ];
      for (const indicator of noAccessIndicators) {
        if (pageText.includes(indicator)) {
          return true;
        }
      }
    }
    return false;
  }
  function detectUploaderFromUploadPage() {
    if (!window.location.pathname.includes("/upload")) {
      return false;
    }
    const pageHTML = document.body.innerHTML.toLowerCase();
    const hasUploadForm = document.querySelector('input[type="file"]') !== null || document.querySelector('form[action*="upload"]') !== null || document.querySelector('[name="torrent"]') !== null || document.querySelector(".upload-form") !== null || pageHTML.includes('enctype="multipart/form-data"');
    return hasUploadForm;
  }
  function getStats() {
    const stored = GM_getValue("stats", null);
    return stored ? JSON.parse(stored) : { totalHidden: 0, keywordHidden: 0 };
  }
  function saveStats(stats) {
    GM_setValue("stats", JSON.stringify(stats));
  }
  function addToBlocklist(username, note = "", level = "hard", expiryDays = null, sourceUrl = "") {
    const list = getBlocklist();
    const key = username.toLowerCase().trim();
    if (!list[key]) {
      list[key] = {
        username: username.trim(),
        note,
        level,
        date: Date.now(),
        expiry: expiryDays ? Date.now() + expiryDays * 24 * 60 * 60 * 1e3 : null,
        hideCount: 0,
        sourceUrl: sourceUrl || void 0
      };
      saveBlocklist(list);
      removeFromTrustedlist(username);
      return true;
    }
    return false;
  }
  function updateBlockedUser(username, updates) {
    const list = getBlocklist();
    const key = username.toLowerCase().trim();
    if (list[key]) {
      list[key] = { ...list[key], ...updates };
      saveBlocklist(list);
    }
  }
  function removeFromBlocklist(username) {
    const list = getBlocklist();
    const key = username.toLowerCase().trim();
    delete list[key];
    saveBlocklist(list);
    addSeenCommenter(username);
  }
  function isBlocked(username) {
    const list = getBlocklist();
    const key = username.toLowerCase().trim();
    const entry = list[key];
    if (!entry) return false;
    if (entry.expiry && Date.now() > entry.expiry) {
      removeFromBlocklist(username);
      return false;
    }
    return true;
  }
  function getBlockedUser(username) {
    const list = getBlocklist();
    return list[username.toLowerCase().trim()];
  }
  function incrementHideCount(username, commentText = "") {
    const list = getBlocklist();
    const key = username.toLowerCase().trim();
    if (list[key]) {
      const pageUrl = window.location.pathname;
      const commentHash = hashComment(commentText);
      const commentId = `${pageUrl}#${commentHash}`;
      if (!list[key].countedComments) {
        list[key].countedComments = [];
      }
      if (!list[key].countedComments.includes(commentId)) {
        list[key].countedComments.push(commentId);
        list[key].hideCount = (list[key].hideCount || 0) + 1;
        if (list[key].countedComments.length > 500) {
          list[key].countedComments = list[key].countedComments.slice(-500);
        }
        saveBlocklist(list);
        const stats = getStats();
        stats.totalHidden++;
        saveStats(stats);
      }
    }
  }
  function addToTrustedlist(username, note = "", sourceUrl = "") {
    const list = getTrustedlist();
    const key = username.toLowerCase().trim();
    if (!list[key]) {
      list[key] = {
        username: username.trim(),
        note,
        date: Date.now(),
        sourceUrl: sourceUrl || void 0
      };
      saveTrustedlist(list);
      removeFromBlocklist(username);
      return true;
    }
    return false;
  }
  function updateTrustedUser(username, updates) {
    const list = getTrustedlist();
    const key = username.toLowerCase().trim();
    if (list[key]) {
      list[key] = { ...list[key], ...updates };
      saveTrustedlist(list);
    }
  }
  function removeFromTrustedlist(username) {
    const list = getTrustedlist();
    const key = username.toLowerCase().trim();
    delete list[key];
    saveTrustedlist(list);
    addSeenCommenter(username);
  }
  function isTrusted(username) {
    const list = getTrustedlist();
    return !!list[username.toLowerCase().trim()];
  }
  function getTrustedUser(username) {
    const list = getTrustedlist();
    return list[username.toLowerCase().trim()];
  }
  function addKeyword(keyword) {
    const list = getKeywords();
    const kw = keyword.toLowerCase().trim();
    if (kw && !list.some((k) => k.keyword === kw)) {
      list.push({ keyword: kw, date: Date.now() });
      saveKeywords(list);
      return true;
    }
    return false;
  }
  function removeKeyword(keyword) {
    let list = getKeywords();
    list = list.filter((k) => k.keyword !== keyword.toLowerCase().trim());
    saveKeywords(list);
  }
  function containsKeyword(text) {
    const keywords = getKeywordStrings();
    const lowerText = text.toLowerCase();
    return keywords.find((kw) => lowerText.includes(kw));
  }
  function addHighlightedKeyword(keyword) {
    const list = getHighlightedKeywords();
    const kw = keyword.toLowerCase().trim();
    if (kw && !list.some((k) => k.keyword === kw)) {
      list.push({ keyword: kw, date: Date.now() });
      saveHighlightedKeywords(list);
      return true;
    }
    return false;
  }
  function removeHighlightedKeyword(keyword) {
    let list = getHighlightedKeywords();
    list = list.filter((k) => k.keyword !== keyword.toLowerCase().trim());
    saveHighlightedKeywords(list);
  }
  function containsHighlightedKeyword(text) {
    const keywords = getHighlightedKeywordStrings();
    const lowerText = text.toLowerCase();
    return keywords.find((kw) => lowerText.includes(kw));
  }
  function isMyUsername(username) {
    const myUsername = getMyUsername();
    if (!myUsername) return false;
    return username.toLowerCase().trim() === myUsername.toLowerCase();
  }
  function isWhitelisted(username) {
    const key = username.toLowerCase().trim();
    const storedWhitelist = getPermanentWhitelist();
    return PERMANENT_WHITELIST.some((u) => u.toLowerCase() === key) || storedWhitelist.some((u) => u.toLowerCase() === key);
  }
  function isFirstTimer(username) {
    const settings = getSettings();
    if (!settings.firstTimerTrackingEnabled) return false;
    if (isMyUsername(username)) return false;
    if (getBlockedUser(username) || getTrustedUser(username)) return false;
    const seenList = getSeenCommenters();
    const normalizedUsername = username.toLowerCase().trim();
    return !seenList.includes(normalizedUsername);
  }
  function isSiteTrustedUser(linkElement) {
    var _a;
    if (!linkElement) return false;
    const checkEl = linkElement.closest(".user-name") || linkElement.parentElement || linkElement;
    let classStr = (linkElement.className + " " + checkEl.className + " " + (((_a = checkEl.parentElement) == null ? void 0 : _a.className) || "")).toLowerCase();
    const commentContainer = linkElement.closest(".comment-info, .comment-detail");
    if (commentContainer) {
      const frame = commentContainer.querySelector(".frame");
      if (frame) {
        classStr += " " + frame.className.toLowerCase();
      }
    }
    return SITE_TRUSTED_CLASSES.some((cls) => classStr.includes(cls));
  }
  function shouldSkipUser(username, linkElement) {
    return isMyUsername(username) || isWhitelisted(username) || isSiteTrustedUser(linkElement);
  }
  function getRequests() {
    const stored = GM_getValue("requests", null);
    return stored ? JSON.parse(stored) : [];
  }
  function saveRequests(list) {
    GM_setValue("requests", JSON.stringify(list));
  }
  function addRequest(username, text, sourceUrl = "") {
    const list = getRequests();
    const newRequest = {
      id: "req_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      text: text.trim(),
      date: Date.now(),
      status: "pending",
      order: list.filter((r) => !r.archived).length,
      sourceUrl,
      archived: false,
      checklist: []
    };
    list.push(newRequest);
    saveRequests(list);
    return newRequest;
  }
  function updateRequest(id, updates) {
    const list = getRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveRequests(list);
      return list[idx];
    }
    return null;
  }
  function deleteRequest(id, permanent = false) {
    if (permanent) {
      let list = getRequests();
      list = list.filter((r) => r.id !== id);
      list.filter((r) => !r.archived).forEach((r, i) => r.order = i);
      saveRequests(list);
    } else {
      moveRequestToTrash(id);
    }
  }
  function archiveRequest(id) {
    return updateRequest(id, { archived: true, archivedDate: Date.now() });
  }
  function unarchiveRequest(id) {
    const list = getRequests();
    const maxOrder = Math.max(
      ...list.filter((r) => !r.archived).map((r) => r.order),
      -1
    );
    return updateRequest(id, { archived: false, order: maxOrder + 1 });
  }
  function reorderRequests(orderedIds) {
    const list = getRequests();
    orderedIds.forEach((id, index) => {
      const req = list.find((r) => r.id === id);
      if (req) req.order = index;
    });
    saveRequests(list);
  }
  function addChecklistItem(requestId, text) {
    const list = getRequests();
    const req = list.find((r) => r.id === requestId);
    if (req) {
      if (!req.checklist) req.checklist = [];
      req.checklist.push({
        id: "chk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        text: text.trim(),
        completed: false
      });
      saveRequests(list);
      return req;
    }
    return null;
  }
  function updateChecklistItem(requestId, checklistId, updates) {
    const list = getRequests();
    const req = list.find((r) => r.id === requestId);
    if (req && req.checklist) {
      const item = req.checklist.find((c) => c.id === checklistId);
      if (item) {
        Object.assign(item, updates);
        saveRequests(list);
        return req;
      }
    }
    return null;
  }
  function deleteChecklistItem(requestId, checklistId) {
    const list = getRequests();
    const req = list.find((r) => r.id === requestId);
    if (req && req.checklist) {
      req.checklist = req.checklist.filter((c) => c.id !== checklistId);
      saveRequests(list);
      return req;
    }
    return null;
  }
  function reorderChecklistItems(requestId, checklistIds) {
    const list = getRequests();
    const req = list.find((r) => r.id === requestId);
    if (req && req.checklist) {
      const itemMap = new Map(req.checklist.map((item) => [item.id, item]));
      const reordered = [];
      for (const id of checklistIds) {
        const item = itemMap.get(id);
        if (item) reordered.push(item);
      }
      for (const item of req.checklist) {
        if (!checklistIds.includes(item.id)) reordered.push(item);
      }
      req.checklist = reordered;
      saveRequests(list);
      return req;
    }
    return null;
  }
  function getActiveRequests() {
    return getRequests().filter((r) => !r.archived).sort((a, b) => a.order - b.order);
  }
  function getArchivedRequests() {
    return getRequests().filter((r) => r.archived).sort((a, b) => (b.archivedDate || b.date) - (a.archivedDate || a.date));
  }
  function getRequestCountByUser(username, countMode = "requests") {
    const userRequests = getRequests().filter(
      (r) => r.username.toLowerCase() === username.toLowerCase() && !r.archived && r.status === "pending"
    );
    if (countMode === "requests_and_subtasks") {
      return userRequests.reduce(
        (sum, r) => sum + 1 + (r.checklist ? r.checklist.length : 0),
        0
      );
    } else if (countMode === "subtasks_only") {
      return userRequests.reduce(
        (sum, r) => sum + (r.checklist ? r.checklist.length : 0),
        0
      );
    }
    return userRequests.length;
  }
  function getTotalRequestCount(countMode = "requests") {
    const pendingRequests = getActiveRequests().filter(
      (r) => r.status === "pending"
    );
    if (countMode === "requests_and_subtasks") {
      return pendingRequests.reduce(
        (sum, r) => sum + 1 + (r.checklist ? r.checklist.length : 0),
        0
      );
    } else if (countMode === "subtasks_only") {
      return pendingRequests.reduce(
        (sum, r) => sum + (r.checklist ? r.checklist.length : 0),
        0
      );
    }
    return pendingRequests.length;
  }
  function canUserSubmitRequest$1(username, requestLimitPerUser, countMode = "requests") {
    if (requestLimitPerUser <= 0) return true;
    return getRequestCountByUser(username, countMode) < requestLimitPerUser;
  }
  function canAcceptMoreRequests$1(totalRequestsLimit, countMode = "requests") {
    if (totalRequestsLimit <= 0) return true;
    return getTotalRequestCount(countMode) < totalRequestsLimit;
  }
  const TRASH_EXPIRY_DAYS$1 = 14;
  function getDeletedRequests() {
    const stored = GM_getValue("deletedRequests", null);
    const list = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const filtered = list.filter((item) => {
      const deletedAt = item.deletedAt || 0;
      const daysSinceDeleted = (now - deletedAt) / (1e3 * 60 * 60 * 24);
      return daysSinceDeleted < TRASH_EXPIRY_DAYS$1;
    });
    if (filtered.length !== list.length) {
      GM_setValue("deletedRequests", JSON.stringify(filtered));
    }
    return filtered.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
  }
  function saveDeletedRequests(list) {
    GM_setValue("deletedRequests", JSON.stringify(list));
  }
  function moveRequestToTrash(id) {
    const requests = getRequests();
    const request = requests.find((r) => r.id === id);
    if (request) {
      const filtered = requests.filter((r) => r.id !== id);
      filtered.filter((r) => !r.archived).forEach((r, i) => r.order = i);
      saveRequests(filtered);
      const trash = getDeletedRequests();
      trash.push({ ...request, deletedAt: Date.now() });
      saveDeletedRequests(trash);
    }
  }
  function restoreRequestFromTrash(id) {
    const trash = getDeletedRequests();
    const request = trash.find((r) => r.id === id);
    if (request) {
      const { deletedAt, ...restoredRequest } = request;
      const requests = getRequests();
      const maxOrder = Math.max(
        ...requests.filter((r) => !r.archived).map((r) => r.order),
        -1
      );
      restoredRequest.order = maxOrder + 1;
      restoredRequest.archived = false;
      requests.push(restoredRequest);
      saveRequests(requests);
      const filtered = trash.filter((r) => r.id !== id);
      saveDeletedRequests(filtered);
    }
  }
  function permanentlyDeleteRequest(id) {
    const trash = getDeletedRequests();
    const filtered = trash.filter((r) => r.id !== id);
    saveDeletedRequests(filtered);
  }
  const SECTION_LEVEL_PREFIXES = [
    (n) => `${n + 1}.`,
    // Level 0: 1. 2. 3.
    (n) => String.fromCharCode(65 + n) + ".",
    // Level 1: A. B. C.
    (n) => String.fromCharCode(97 + n) + ".",
    // Level 2: a. b. c.
    (n) => ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][n] + "."
    // Level 3: i. ii. iii.
  ];
  function getSectionPrefix(level, order) {
    if (level < 0 || level > 3) return "";
    return SECTION_LEVEL_PREFIXES[level](order);
  }
  function getNotes() {
    const stored = GM_getValue("notes", null);
    return stored ? JSON.parse(stored) : [];
  }
  function saveNotes(list) {
    GM_setValue("notes", JSON.stringify(list));
  }
  function getSortedNotes(sortOrder = "recent") {
    const notes = getNotes();
    return notes.sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return (a.date || 0) - (b.date || 0);
        case "alpha-user":
          return (a.username || "").toLowerCase().localeCompare((b.username || "").toLowerCase());
        case "alpha-user-desc":
          return (b.username || "").toLowerCase().localeCompare((a.username || "").toLowerCase());
        case "alpha-tag":
          const aTag = (a.tags || [])[0] || "";
          const bTag = (b.tags || [])[0] || "";
          return aTag.toLowerCase().localeCompare(bTag.toLowerCase());
        case "recent":
        default:
          return (b.date || 0) - (a.date || 0);
      }
    });
  }
  function addNote(username, commentText, note, tags = [], sourceUrl = "") {
    const list = getNotes();
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      commentText: commentText.trim(),
      note: note.trim(),
      tags,
      sourceUrl,
      date: Date.now(),
      archived: false
    };
    list.push(newNote);
    saveNotes(list);
    return newNote;
  }
  function updateNote(id, updates) {
    const list = getNotes();
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveNotes(list);
      return list[idx];
    }
    return null;
  }
  function deleteNote(id, permanent = false) {
    if (permanent) {
      let list = getNotes();
      list = list.filter((n) => n.id !== id);
      saveNotes(list);
    } else {
      moveNoteToTrash(id);
    }
  }
  function archiveNote(id) {
    return updateNote(id, { archived: true, archivedDate: Date.now() });
  }
  function unarchiveNote(id) {
    return updateNote(id, { archived: false });
  }
  function getActiveNotes() {
    return getNotes().filter((n) => !n.archived).sort((a, b) => b.date - a.date);
  }
  function getArchivedNotes() {
    return getNotes().filter((n) => n.archived).sort((a, b) => (b.archivedDate || b.date) - (a.archivedDate || a.date));
  }
  function getNoteSections() {
    const stored = GM_getValue("noteSections", null);
    return stored ? JSON.parse(stored) : [];
  }
  function saveNoteSections(sections) {
    GM_setValue("noteSections", JSON.stringify(sections));
  }
  function addNoteSection(name, parentId = null, color = "#8b5cf6") {
    const sections = getNoteSections();
    const parentSection = parentId ? sections.find((s) => s.id === parentId) : null;
    const level = parentSection ? parentSection.level + 1 : 0;
    if (level > 3) return null;
    const siblings = sections.filter((s) => s.parentId === parentId);
    const order = siblings.length;
    const newSection = {
      id: "sec_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      color,
      parentId,
      level,
      order,
      collapsed: false
    };
    sections.push(newSection);
    saveNoteSections(sections);
    return newSection;
  }
  function updateNoteSection(id, updates) {
    const sections = getNoteSections();
    const idx = sections.findIndex((s) => s.id === id);
    if (idx !== -1) {
      sections[idx] = { ...sections[idx], ...updates };
      saveNoteSections(sections);
      return sections[idx];
    }
    return null;
  }
  function deleteNoteSection(id, deleteChildren = false) {
    var _a;
    let sections = getNoteSections();
    const notes = getNotes();
    if (deleteChildren) {
      const getAllChildIds = (parentId2) => {
        const children = sections.filter((s) => s.parentId === parentId2);
        let ids = children.map((c) => c.id);
        children.forEach((c) => {
          ids = ids.concat(getAllChildIds(c.id));
        });
        return ids;
      };
      const childIds = getAllChildIds(id);
      sections = sections.filter((s) => s.id !== id && !childIds.includes(s.id));
      const allDeletedIds = [id, ...childIds];
      notes.forEach((note) => {
        if (allDeletedIds.includes(note.sectionId || "")) {
          note.sectionId = null;
        }
      });
      saveNotes(notes);
    } else {
      const children = sections.filter((s) => s.parentId === id);
      const thisSection = sections.find((s) => s.id === id);
      children.forEach((child) => {
        child.parentId = (thisSection == null ? void 0 : thisSection.parentId) || null;
        child.level = Math.max(0, child.level - 1);
      });
      sections = sections.filter((s) => s.id !== id);
      notes.forEach((note) => {
        if (note.sectionId === id) {
          note.sectionId = null;
        }
      });
      saveNotes(notes);
    }
    const parentId = ((_a = sections.find((s) => s.id === id)) == null ? void 0 : _a.parentId) || null;
    const siblings = sections.filter((s) => s.parentId === parentId).sort((a, b) => a.order - b.order);
    siblings.forEach((s, i) => s.order = i);
    saveNoteSections(sections);
  }
  function moveNoteToSection(noteId, sectionId) {
    return updateNote(noteId, { sectionId });
  }
  function findSubtaskByPath(subtasks, path) {
    if (!path || path.length === 0 || !subtasks) return null;
    const id = path[0];
    const subtask = subtasks.find((s) => s.id === id);
    if (!subtask) return null;
    if (path.length === 1) return subtask;
    return findSubtaskByPath(subtask.subtasks || [], path.slice(1));
  }
  function addNoteSubtask(noteId, text, parentPath = []) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return null;
    if (!note.subtasks) note.subtasks = [];
    const newSubtask = {
      id: "st_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      subtasks: []
    };
    if (parentPath.length === 0) {
      note.subtasks.push(newSubtask);
    } else {
      const parent = findSubtaskByPath(note.subtasks, parentPath);
      if (parent) {
        if (!parent.subtasks) parent.subtasks = [];
        if (parentPath.length < 3) {
          parent.subtasks.push(newSubtask);
        }
      }
    }
    saveNotes(notes);
    return newSubtask;
  }
  function updateNoteSubtask(noteId, subtaskPath, updates) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note || !note.subtasks) return false;
    const subtask = findSubtaskByPath(note.subtasks, subtaskPath);
    if (subtask) {
      Object.assign(subtask, updates);
      saveNotes(notes);
      return true;
    }
    return false;
  }
  function deleteNoteSubtask(noteId, subtaskPath) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note || !note.subtasks || subtaskPath.length === 0) return false;
    if (subtaskPath.length === 1) {
      note.subtasks = note.subtasks.filter((s) => s.id !== subtaskPath[0]);
    } else {
      const parentPath = subtaskPath.slice(0, -1);
      const subtaskId = subtaskPath[subtaskPath.length - 1];
      const parent = findSubtaskByPath(note.subtasks, parentPath);
      if (parent && parent.subtasks) {
        parent.subtasks = parent.subtasks.filter((s) => s.id !== subtaskId);
      }
    }
    saveNotes(notes);
    return true;
  }
  function countNoteSubtasks(subtasks, completedOnly = false) {
    if (!subtasks || subtasks.length === 0) return 0;
    let count = 0;
    for (const st of subtasks) {
      if (!completedOnly || st.completed) count++;
      count += countNoteSubtasks(st.subtasks, completedOnly);
    }
    return count;
  }
  function reorderNoteSubtasks(noteId, orderedIds, parentPath = []) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return false;
    if (!note.subtasks) note.subtasks = [];
    let subtasksToReorder;
    if (parentPath.length === 0) {
      subtasksToReorder = note.subtasks;
    } else {
      const parent = findSubtaskByPath(note.subtasks, parentPath);
      if (!parent || !parent.subtasks) return false;
      subtasksToReorder = parent.subtasks;
    }
    const subtaskMap = new Map(subtasksToReorder.map((st) => [st.id, st]));
    const reordered = [];
    for (const id of orderedIds) {
      const st = subtaskMap.get(id);
      if (st) reordered.push(st);
    }
    for (const st of subtasksToReorder) {
      if (!orderedIds.includes(st.id)) reordered.push(st);
    }
    if (parentPath.length === 0) {
      note.subtasks = reordered;
    } else {
      const parent = findSubtaskByPath(note.subtasks, parentPath);
      if (parent) parent.subtasks = reordered;
    }
    saveNotes(notes);
    return true;
  }
  const TRASH_EXPIRY_DAYS = 14;
  function getDeletedNotes() {
    const stored = GM_getValue("deletedNotes", null);
    const list = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const filtered = list.filter((item) => {
      const deletedAt = item.deletedAt || 0;
      const daysSinceDeleted = (now - deletedAt) / (1e3 * 60 * 60 * 24);
      return daysSinceDeleted < TRASH_EXPIRY_DAYS;
    });
    if (filtered.length !== list.length) {
      GM_setValue("deletedNotes", JSON.stringify(filtered));
    }
    return filtered.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
  }
  function saveDeletedNotes(list) {
    GM_setValue("deletedNotes", JSON.stringify(list));
  }
  function moveNoteToTrash(id) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === id);
    if (note) {
      const filtered = notes.filter((n) => n.id !== id);
      saveNotes(filtered);
      const trash = getDeletedNotes();
      trash.push({ ...note, deletedAt: Date.now() });
      saveDeletedNotes(trash);
    }
  }
  function restoreNoteFromTrash(id) {
    const trash = getDeletedNotes();
    const note = trash.find((n) => n.id === id);
    if (note) {
      const { deletedAt, ...restoredNote } = note;
      const notes = getNotes();
      notes.push(restoredNote);
      saveNotes(notes);
      const filtered = trash.filter((n) => n.id !== id);
      saveDeletedNotes(filtered);
    }
  }
  function permanentlyDeleteNote(id) {
    const trash = getDeletedNotes();
    const filtered = trash.filter((n) => n.id !== id);
    saveDeletedNotes(filtered);
  }
  function createFullBackup(getSettings2, getStats2) {
    const backup = {
      version: "0.3.3",
      exportDate: (/* @__PURE__ */ new Date()).toISOString(),
      data: {
        blocklist: getBlocklist(),
        trustedlist: getTrustedlist(),
        keywords: getKeywords(),
        requests: getRequests(),
        notes: getNotes(),
        noteSections: getNoteSections(),
        customReasons: getCustomReasons(),
        permanentWhitelist: getPermanentWhitelist(),
        seenCommenters: getSeenCommenters(),
        settings: getSettings2(),
        stats: getStats2()
      }
    };
    return JSON.stringify(backup, null, 2);
  }
  function createRequestsOnlyBackup() {
    const backup = {
      version: "0.3.3",
      exportDate: (/* @__PURE__ */ new Date()).toISOString(),
      type: "requests_only",
      data: {
        requests: getRequests()
      }
    };
    return JSON.stringify(backup, null, 2);
  }
  function importBackup$1(jsonString, getSettings2) {
    try {
      const backup = JSON.parse(jsonString);
      if (!backup.data) {
        throw new Error("Invalid backup format");
      }
      const imported = {
        blocklist: 0,
        trusted: 0,
        keywords: 0,
        requests: 0,
        notes: 0,
        noteSections: 0,
        customTags: 0,
        settings: false
      };
      if (backup.data.blocklist) {
        GM_setValue("blocklist_v2", JSON.stringify(backup.data.blocklist));
        imported.blocklist = Object.keys(backup.data.blocklist).length;
      }
      if (backup.data.trustedlist) {
        GM_setValue("trustedlist_v2", JSON.stringify(backup.data.trustedlist));
        imported.trusted = Object.keys(backup.data.trustedlist).length;
      }
      if (backup.data.keywords) {
        GM_setValue("keywords_v2", JSON.stringify(backup.data.keywords));
        imported.keywords = backup.data.keywords.length;
      }
      if (backup.data.requests) {
        GM_setValue("requests", JSON.stringify(backup.data.requests));
        imported.requests = backup.data.requests.length;
      }
      if (backup.data.notes) {
        GM_setValue("notes", JSON.stringify(backup.data.notes));
        imported.notes = backup.data.notes.length;
      }
      if (backup.data.noteSections) {
        GM_setValue("noteSections", JSON.stringify(backup.data.noteSections));
        imported.noteSections = backup.data.noteSections.length;
      }
      if (backup.data.customReasons) {
        GM_setValue("customReasons", JSON.stringify(backup.data.customReasons));
        imported.customTags = backup.data.customReasons.length;
      }
      if (backup.data.permanentWhitelist) {
        GM_setValue(
          "permanentWhitelist",
          JSON.stringify(backup.data.permanentWhitelist)
        );
      }
      if (backup.data.seenCommenters) {
        GM_setValue("seenCommenters", JSON.stringify(backup.data.seenCommenters));
      }
      if (backup.data.settings) {
        const currentSettings = getSettings2();
        const mergedSettings = {
          ...currentSettings,
          ...backup.data.settings
        };
        if (backup.data.settings.customColors && typeof backup.data.settings.customColors === "object") {
          mergedSettings.customColors = {
            ...currentSettings.customColors,
            ...backup.data.settings.customColors
          };
        }
        if (backup.data.settings.badgeFont && typeof backup.data.settings.badgeFont === "object") {
          mergedSettings.badgeFont = {
            ...currentSettings.badgeFont,
            ...backup.data.settings.badgeFont
          };
        }
        if (backup.data.settings.customFont && typeof backup.data.settings.customFont === "object") {
          mergedSettings.customFont = {
            ...currentSettings.customFont,
            ...backup.data.settings.customFont
          };
        }
        GM_setValue("settings", JSON.stringify(mergedSettings));
        imported.settings = true;
      }
      if (backup.data.stats) {
        GM_setValue("stats", JSON.stringify(backup.data.stats));
      }
      return imported;
    } catch (e) {
      console.error("Backup import error:", e);
      throw new Error(
        "Failed to import backup: " + (e instanceof Error ? e.message : String(e))
      );
    }
  }
  function checkAutoBackup$1(getSettings2, getStats2, saveSettings2) {
    const settings = getSettings2();
    if (!settings.autoBackupEnabled) return;
    const now = Date.now();
    const lastBackup = settings.lastAutoBackup || 0;
    let intervalMs;
    switch (settings.autoBackupInterval) {
      case "hourly":
        intervalMs = 60 * 60 * 1e3;
        break;
      case "daily":
        intervalMs = 24 * 60 * 60 * 1e3;
        break;
      case "weekly":
        intervalMs = 7 * 24 * 60 * 60 * 1e3;
        break;
      default:
        intervalMs = 24 * 60 * 60 * 1e3;
    }
    if (now - lastBackup >= intervalMs) {
      performAutoBackup(getSettings2, getStats2, saveSettings2);
    }
  }
  function performAutoBackup(getSettings2, getStats2, saveSettings2) {
    const backup = createFullBackup(getSettings2, getStats2);
    const backupHistory = GM_getValue("backupHistory", []) || [];
    backupHistory.unshift({
      date: (/* @__PURE__ */ new Date()).toISOString(),
      data: backup
    });
    while (backupHistory.length > 5) {
      backupHistory.pop();
    }
    GM_setValue("backupHistory", backupHistory);
    const settings = getSettings2();
    settings.lastAutoBackup = Date.now();
    saveSettings2(settings);
    console.log("MaNKeY-Bot: Auto-backup completed");
  }
  function getBackupHistory() {
    return GM_getValue("backupHistory", []) || [];
  }
  function restoreFromBackupHistory$1(index, getSettings2) {
    const history = getBackupHistory();
    if (index >= 0 && index < history.length) {
      return importBackup$1(history[index].data, getSettings2);
    }
    throw new Error("Backup not found");
  }
  function getBackupFromHistory(index) {
    const history = getBackupHistory();
    if (index >= 0 && index < history.length) {
      return history[index].data;
    }
    return null;
  }
  function getBackupDateFromHistory(index) {
    const history = getBackupHistory();
    if (index >= 0 && index < history.length) {
      return history[index].date;
    }
    return null;
  }
  function exportFullBackup() {
    const backup = createFullBackup(getSettings, getStats);
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    downloadFile(backup, `mankey-bot-backup_${date}.json`, "application/json");
  }
  function exportRequestsBackup() {
    const backup = createRequestsOnlyBackup();
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    downloadFile(
      backup,
      `mankey-bot-requests_${date}.json`,
      "application/json"
    );
  }
  function downloadBackupFromHistory(index) {
    const data = getBackupFromHistory(index);
    const date = getBackupDateFromHistory(index);
    if (data && date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      downloadFile(
        data,
        `mankey-bot-backup_${formattedDate}.json`,
        "application/json"
      );
    }
  }
  function exportBlocklistOnly() {
    const blocklist = getBlocklist();
    const usernames = Object.values(blocklist).map((u) => u.username);
    const data = {
      version: "1.0",
      type: "blocklist-share",
      usernames,
      count: usernames.length,
      exportDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `1337x-blocklist-share-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function importDataFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if ("data" in data && data.data) {
        const result = importBackup$1(jsonString, getSettings);
        const parts = [];
        if (result.blocklist > 0)
          parts.push(`${result.blocklist} blocked users`);
        if (result.trusted > 0) parts.push(`${result.trusted} trusted users`);
        if (result.keywords > 0) parts.push(`${result.keywords} keywords`);
        if (result.requests > 0) parts.push(`${result.requests} requests`);
        if (result.notes > 0) parts.push(`${result.notes} notes`);
        if (result.noteSections > 0)
          parts.push(`${result.noteSections} note sections`);
        if (result.customTags > 0)
          parts.push(`${result.customTags} custom tags`);
        if (result.settings) parts.push("settings");
        const message = parts.length > 0 ? `Import successful!

Restored: ${parts.join(", ")}

Refresh the page to see changes.` : "Import successful! Refresh the page to see changes.";
        return { success: true, message };
      } else {
        const legacyData = data;
        if (legacyData.blocklist) saveBlocklist(legacyData.blocklist);
        if (legacyData.trustedlist) saveTrustedlist(legacyData.trustedlist);
        if (legacyData.keywords) saveKeywords(legacyData.keywords);
        if (legacyData.settings) saveSettings(legacyData.settings);
        return {
          success: true,
          message: "Import successful! Refresh the page to see changes.",
          isLegacy: true
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid file format";
      return { success: false, message: `Import failed: ${errorMessage}` };
    }
  }
  function getCachedUploads() {
    const stored = GM_getValue("cachedUploads", null);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  function saveCachedUploads(data) {
    GM_setValue("cachedUploads", JSON.stringify(data));
  }
  function parseTorrentRows(doc) {
    const rows = [];
    const torrentTable = doc.querySelector(".table-list tbody, table.torrents tbody");
    if (!torrentTable) return rows;
    const trs = torrentTable.querySelectorAll("tr");
    trs.forEach((tr) => {
      var _a, _b, _c, _d;
      const nameCell = tr.querySelector("td.coll-1.name, td:first-child");
      if (!nameCell) return;
      const link = nameCell.querySelector("a:not(.icon)");
      if (!link) return;
      const title = ((_a = link.textContent) == null ? void 0 : _a.trim()) || "";
      const url = link.href || "";
      const idMatch = url.match(/\/torrent\/(\d+)/);
      const id = idMatch ? idMatch[1] : "";
      const seederCell = tr.querySelector("td.coll-2.seeds, td:nth-child(2)");
      const leecherCell = tr.querySelector("td.coll-3.leeches, td:nth-child(3)");
      const seeds = ((_b = seederCell == null ? void 0 : seederCell.textContent) == null ? void 0 : _b.trim()) || "0";
      const leeches = ((_c = leecherCell == null ? void 0 : leecherCell.textContent) == null ? void 0 : _c.trim()) || "0";
      const dateCell = tr.querySelector("td.coll-date, td:nth-child(4)");
      const date = ((_d = dateCell == null ? void 0 : dateCell.textContent) == null ? void 0 : _d.trim()) || "";
      if (title && url && id) {
        rows.push({ title, url, id, seeds, leeches, date });
      }
    });
    return rows;
  }
  async function fetchUserUploads(username, maxPages = 100, filter = "all") {
    const allUploads2 = [];
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= maxPages) {
      try {
        const url = `/${username}-torrents/${page}/`;
        const response = await fetch(url);
        if (!response.ok) break;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const rows = parseTorrentRows(doc);
        if (rows.length === 0) {
          hasMore = false;
        } else {
          allUploads2.push(...rows);
          page++;
        }
        if (hasMore && page <= maxPages) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch {
        break;
      }
    }
    return allUploads2;
  }
  let allUploads = [];
  let filteredUploads = [];
  let isLoading$1 = false;
  let loadingAborted$1 = false;
  function isOwnUploadsPage() {
    const myUsername = getMyUsername();
    if (!myUsername) return false;
    const path = window.location.pathname.toLowerCase();
    const usernameLower = myUsername.toLowerCase();
    const patterns = [
      `/user/${usernameLower}/uploads`,
      `/user/${usernameLower}/`,
      `/${usernameLower}-torrents`
    ];
    return patterns.some((p) => path.startsWith(p));
  }
  function createSearchUI$1() {
    const container = document.createElement("div");
    container.className = "xcb-uploads-search";
    container.innerHTML = `
    <div class="xcb-uploads-search-bar">
      <i class="ph-bold ph-magnifying-glass"></i>
      <input type="text" id="xcbUploadsSearchInput" placeholder="Search uploads..." />
      <button id="xcbLoadAllUploads" class="xcb-btn xcb-btn-primary">
        <i class="ph-bold ph-download-simple"></i> Load All
      </button>
    </div>
    <div class="xcb-uploads-status">
      <span id="xcbUploadsCount">Loading...</span>
      <span id="xcbUploadsLastFetched"></span>
      <button id="xcbRefreshUploads" class="xcb-btn xcb-btn-small" style="display: none;">
        <i class="ph-bold ph-arrows-clockwise"></i> Refresh
      </button>
    </div>
    <div id="xcbUploadsProgress" class="xcb-uploads-progress" style="display: none;">
      <div class="xcb-uploads-progress-bar">
        <div id="xcbUploadsProgressFill" class="xcb-uploads-progress-fill"></div>
      </div>
      <span id="xcbUploadsProgressText">Loading page 1...</span>
      <button id="xcbUploadsCancelLoad" class="xcb-btn xcb-btn-small xcb-btn-danger">Cancel</button>
    </div>
  `;
    return container;
  }
  function createResultsTable$1() {
    const container = document.createElement("div");
    container.className = "xcb-uploads-results";
    container.id = "xcbUploadsResults";
    container.style.display = "none";
    container.innerHTML = `
    <table class="xcb-uploads-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SE</th>
          <th>LE</th>
          <th><i class="ph-bold ph-chat-circle"></i></th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="xcbUploadsTableBody"></tbody>
    </table>
  `;
    return container;
  }
  function renderUploads(uploads) {
    const tbody = document.getElementById("xcbUploadsTableBody");
    if (!tbody) return;
    if (uploads.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No uploads found</td></tr>`;
      return;
    }
    tbody.innerHTML = uploads.map(
      (upload) => `
    <tr>
      <td class="xcb-upload-name">
        <a href="${upload.url}" title="${escapeHtml$1(upload.title)}">${escapeHtml$1(upload.title)}</a>
      </td>
      <td class="xcb-upload-seeds">${upload.seeds}</td>
      <td class="xcb-upload-leeches">${upload.leeches}</td>
      <td class="xcb-upload-comments" data-url="${upload.url}">
        ${upload.commentCount !== void 0 ? `<span class="xcb-comment-badge">${upload.commentCount}</span>` : '<span class="xcb-comment-pending"><i class="ph ph-dots-three"></i></span>'}
      </td>
      <td class="xcb-upload-date">${upload.date}</td>
    </tr>
  `
    ).join("");
  }
  function updateStatusDisplay$1() {
    const countEl = document.getElementById("xcbUploadsCount");
    const lastFetchedEl = document.getElementById("xcbUploadsLastFetched");
    const refreshBtn = document.getElementById("xcbRefreshUploads");
    if (countEl) {
      if (filteredUploads.length !== allUploads.length) {
        countEl.textContent = `Showing ${filteredUploads.length} of ${allUploads.length} uploads`;
      } else {
        countEl.textContent = `${allUploads.length} uploads`;
      }
    }
    const cached = getCachedUploads();
    if (lastFetchedEl && cached) {
      const date = new Date(cached.fetchedAt);
      lastFetchedEl.textContent = `Last fetched: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      if (refreshBtn) refreshBtn.style.display = "inline-flex";
    }
  }
  function showProgress$1(show) {
    const progressEl = document.getElementById("xcbUploadsProgress");
    if (progressEl) progressEl.style.display = show ? "flex" : "none";
  }
  function updateProgress$1(current, total, text) {
    const fillEl = document.getElementById("xcbUploadsProgressFill");
    const textEl = document.getElementById("xcbUploadsProgressText");
    if (fillEl) {
      const percent = total > 0 ? current / total * 100 : 0;
      fillEl.style.width = `${percent}%`;
    }
    if (textEl) {
      textEl.textContent = text || `Loading page ${current} of ${total}...`;
    }
  }
  async function loadAllUploads() {
    if (isLoading$1) return;
    const myUsername = getMyUsername();
    if (!myUsername) return;
    isLoading$1 = true;
    loadingAborted$1 = false;
    const loadBtn = document.getElementById("xcbLoadAllUploads");
    if (loadBtn) loadBtn.setAttribute("disabled", "true");
    showProgress$1(true);
    updateProgress$1(0, 0, "Starting...");
    try {
      const uploads = await fetchUserUploads(myUsername, 100, "all");
      if (loadingAborted$1) {
        console.log("[MaNKeY-Bot] Upload loading cancelled");
        return;
      }
      allUploads = uploads.map((u) => ({
        title: u.title,
        url: u.url,
        seeds: u.seeds,
        leeches: u.leeches,
        date: u.date,
        commentCount: u.commentCount
      }));
      filteredUploads = [...allUploads];
      saveCachedUploads({
        username: myUsername,
        fetchedAt: Date.now(),
        uploads: allUploads
      });
      const resultsEl = document.getElementById("xcbUploadsResults");
      if (resultsEl) resultsEl.style.display = "block";
      hideNativeTable();
      renderUploads(filteredUploads);
      updateStatusDisplay$1();
      fetchCommentCountsBackground();
    } catch (err) {
      console.error("[MaNKeY-Bot] Error loading uploads:", err);
      updateProgress$1(0, 0, "Error loading uploads");
    } finally {
      isLoading$1 = false;
      if (loadBtn) loadBtn.removeAttribute("disabled");
      setTimeout(() => showProgress$1(false), 500);
    }
  }
  function hideNativeTable() {
    const tables = document.querySelectorAll("table.table-list, .table-list");
    tables.forEach((table) => {
      if (table instanceof HTMLElement) {
        table.style.display = "none";
      }
    });
    const pagination = document.querySelectorAll(".pagination, .pager");
    pagination.forEach((p) => {
      if (p instanceof HTMLElement) {
        p.style.display = "none";
      }
    });
  }
  function showNativeTable() {
    const tables = document.querySelectorAll("table.table-list, .table-list");
    tables.forEach((table) => {
      if (table instanceof HTMLElement) {
        table.style.display = "";
      }
    });
    const pagination = document.querySelectorAll(".pagination, .pager");
    pagination.forEach((p) => {
      if (p instanceof HTMLElement) {
        p.style.display = "";
      }
    });
  }
  async function fetchCommentCountsBackground() {
    updateProgress$1(0, allUploads.length, "Fetching comment counts...");
    showProgress$1(true);
    for (let i = 0; i < allUploads.length; i++) {
      if (loadingAborted$1) break;
      const upload = allUploads[i];
      if (upload.commentCount !== void 0) continue;
      try {
        const count = await fetchCommentCount(upload.url);
        upload.commentCount = count;
        const cell = document.querySelector(
          `td.xcb-upload-comments[data-url="${upload.url}"]`
        );
        if (cell) {
          cell.innerHTML = `<span class="xcb-comment-badge">${count}</span>`;
        }
        updateProgress$1(
          i + 1,
          allUploads.length,
          `Fetching comments: ${i + 1}/${allUploads.length}`
        );
        await sleep$1(200);
      } catch (err) {
        console.log("[MaNKeY-Bot] Error fetching comment count:", upload.url);
      }
    }
    const myUsername = getMyUsername();
    if (myUsername && !loadingAborted$1) {
      saveCachedUploads({
        username: myUsername,
        fetchedAt: Date.now(),
        uploads: allUploads
      });
    }
    showProgress$1(false);
  }
  async function fetchCommentCount(torrentUrl) {
    const response = await fetch(torrentUrl);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const comments = doc.querySelectorAll(
      ".comment, .comment-item, #comments > div, .comments-list > div"
    );
    return comments.length;
  }
  function filterUploads(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredUploads = [...allUploads];
    } else {
      filteredUploads = allUploads.filter(
        (u) => u.title.toLowerCase().includes(q)
      );
    }
    renderUploads(filteredUploads);
    updateStatusDisplay$1();
  }
  function setupEventHandlers$1() {
    const searchInput = document.getElementById(
      "xcbUploadsSearchInput"
    );
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          filterUploads(searchInput.value);
        }, 150);
      });
    }
    const loadBtn = document.getElementById("xcbLoadAllUploads");
    if (loadBtn) {
      loadBtn.addEventListener("click", () => loadAllUploads());
    }
    const refreshBtn = document.getElementById("xcbRefreshUploads");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        allUploads = [];
        filteredUploads = [];
        showNativeTable();
        const resultsEl = document.getElementById("xcbUploadsResults");
        if (resultsEl) resultsEl.style.display = "none";
        loadAllUploads();
      });
    }
    const cancelBtn = document.getElementById("xcbUploadsCancelLoad");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        loadingAborted$1 = true;
        showProgress$1(false);
      });
    }
  }
  function loadFromCache$1() {
    const cached = getCachedUploads();
    const myUsername = getMyUsername();
    if (!cached || !myUsername) return false;
    if (cached.username.toLowerCase() !== myUsername.toLowerCase()) return false;
    allUploads = cached.uploads;
    filteredUploads = [...allUploads];
    const resultsEl = document.getElementById("xcbUploadsResults");
    if (resultsEl) resultsEl.style.display = "block";
    hideNativeTable();
    renderUploads(filteredUploads);
    updateStatusDisplay$1();
    return true;
  }
  function initUploadsSearch() {
    if (!isOwnUploadsPage()) return;
    console.log("[MaNKeY-Bot] Initializing uploads search");
    const table = document.querySelector("table.table-list, .table-list");
    if (!table || !table.parentNode) {
      console.log("[MaNKeY-Bot] Could not find torrent table");
      return;
    }
    const searchUI = createSearchUI$1();
    const resultsTable = createResultsTable$1();
    table.parentNode.insertBefore(searchUI, table);
    table.parentNode.insertBefore(resultsTable, table);
    setupEventHandlers$1();
    const hadCache = loadFromCache$1();
    if (!hadCache) {
      const countEl = document.getElementById("xcbUploadsCount");
      if (countEl) countEl.textContent = 'Click "Load All" to fetch all uploads';
    }
  }
  function escapeHtml$1(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function sleep$1(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function getCachedNotifications() {
    const stored = GM_getValue("cachedNotifications", null);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  function saveCachedNotifications(data) {
    GM_setValue("cachedNotifications", JSON.stringify(data));
  }
  let allNotifications = [];
  let filteredNotifications = [];
  let isLoading = false;
  let loadingAborted = false;
  function isNotificationsPage() {
    const myUsername = getMyUsername();
    if (!myUsername) return false;
    const path = window.location.pathname.toLowerCase();
    const usernameLower = myUsername.toLowerCase();
    return path.includes(`/user/${usernameLower}/`) && path.includes("/notifications");
  }
  function createSearchUI() {
    const container = document.createElement("div");
    container.className = "xcb-uploads-search";
    container.innerHTML = `
    <div class="xcb-uploads-search-bar">
      <i class="ph-bold ph-magnifying-glass"></i>
      <input type="text" id="xcbNotificationsSearchInput" placeholder="Search by username..." />
      <button id="xcbLoadAllNotifications" class="xcb-btn xcb-btn-primary">
        <i class="ph-bold ph-download-simple"></i> Load All
      </button>
    </div>
    <div class="xcb-uploads-status">
      <span id="xcbNotificationsCount">Loading...</span>
      <span id="xcbNotificationsLastFetched"></span>
      <button id="xcbRefreshNotifications" class="xcb-btn xcb-btn-small" style="display: none;">
        <i class="ph-bold ph-arrows-clockwise"></i> Refresh
      </button>
    </div>
    <div id="xcbNotificationsProgress" class="xcb-uploads-progress" style="display: none;">
      <div class="xcb-uploads-progress-bar">
        <div id="xcbNotificationsProgressFill" class="xcb-uploads-progress-fill"></div>
      </div>
      <span id="xcbNotificationsProgressText">Loading page 1...</span>
      <button id="xcbNotificationsCancelLoad" class="xcb-btn xcb-btn-small xcb-btn-danger">Cancel</button>
    </div>
  `;
    return container;
  }
  function createResultsTable() {
    const container = document.createElement("div");
    container.className = "xcb-uploads-results";
    container.id = "xcbNotificationsResults";
    container.style.display = "none";
    container.innerHTML = `
    <table class="xcb-uploads-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Torrent</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="xcbNotificationsTableBody"></tbody>
    </table>
  `;
    return container;
  }
  function getUserBadge(username) {
    if (isBlocked(username)) {
      return `<span class="xcb-notification-badge xcb-notification-badge-blocked"><i class="ph-bold ph-prohibit"></i></span>`;
    }
    if (isTrusted(username)) {
      return `<span class="xcb-notification-badge xcb-notification-badge-trusted"><i class="ph-bold ph-check-circle"></i></span>`;
    }
    return "";
  }
  function renderNotifications(notifications) {
    const tbody = document.getElementById("xcbNotificationsTableBody");
    if (!tbody) return;
    if (notifications.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">No notifications found</td></tr>`;
      return;
    }
    tbody.innerHTML = notifications.map(
      (notif) => `
    <tr>
      <td class="xcb-notification-user">
        ${getUserBadge(notif.username)}
        <a href="/user/${encodeURIComponent(notif.username)}/" title="${escapeHtml(notif.username)}">${escapeHtml(notif.username)}</a>
      </td>
      <td class="xcb-notification-torrent">
        <a href="${notif.torrentUrl}" title="${escapeHtml(notif.torrentTitle)}">${escapeHtml(notif.torrentTitle)}</a>
      </td>
      <td class="xcb-notification-date">${notif.date}</td>
    </tr>
  `
    ).join("");
  }
  function updateStatusDisplay() {
    const countEl = document.getElementById("xcbNotificationsCount");
    const lastFetchedEl = document.getElementById("xcbNotificationsLastFetched");
    const refreshBtn = document.getElementById("xcbRefreshNotifications");
    if (countEl) {
      if (filteredNotifications.length !== allNotifications.length) {
        countEl.textContent = `Showing ${filteredNotifications.length} of ${allNotifications.length} notifications`;
      } else {
        countEl.textContent = `${allNotifications.length} notifications`;
      }
    }
    const cached = getCachedNotifications();
    if (lastFetchedEl && cached) {
      const date = new Date(cached.fetchedAt);
      lastFetchedEl.textContent = `Last fetched: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      if (refreshBtn) refreshBtn.style.display = "inline-flex";
    }
  }
  function showProgress(show) {
    const progressEl = document.getElementById("xcbNotificationsProgress");
    if (progressEl) progressEl.style.display = show ? "flex" : "none";
  }
  function updateProgress(current, total, text) {
    const fillEl = document.getElementById("xcbNotificationsProgressFill");
    const textEl = document.getElementById("xcbNotificationsProgressText");
    if (fillEl) {
      const percent = total > 0 ? current / total * 100 : 0;
      fillEl.style.width = `${percent}%`;
    }
    if (textEl) {
      textEl.textContent = text || `Loading page ${current} of ${total}...`;
    }
  }
  function parseNotificationItems(doc) {
    const notifications = [];
    const baseUrl = window.location.origin;
    const selectors = [
      "table.table-list tbody tr",
      ".table-list tbody tr",
      "table tbody tr",
      ".box-info-detail table tr",
      ".notifications-list > div",
      ".notification-item"
    ];
    let rows = doc.querySelectorAll(".__nonexistent__");
    for (const selector of selectors) {
      rows = doc.querySelectorAll(selector);
      if (rows.length > 0) break;
    }
    rows.forEach((row) => {
      var _a, _b, _c;
      if (row.querySelector("th")) return;
      const userLink = row.querySelector('a[href*="/user/"]');
      if (!userLink) return;
      const username = ((_a = userLink.textContent) == null ? void 0 : _a.trim()) || "";
      if (!username) return;
      const torrentLink = row.querySelector('a[href*="/torrent/"]');
      const torrentTitle = ((_b = torrentLink == null ? void 0 : torrentLink.textContent) == null ? void 0 : _b.trim()) || "Unknown Torrent";
      let torrentUrl = (torrentLink == null ? void 0 : torrentLink.getAttribute("href")) || "";
      if (torrentUrl && !torrentUrl.startsWith("http")) {
        torrentUrl = baseUrl + torrentUrl;
      }
      const dateCell = row.querySelector("td.coll-date, td:last-child, time, .date");
      const date = ((_c = dateCell == null ? void 0 : dateCell.textContent) == null ? void 0 : _c.trim()) || "";
      notifications.push({
        username,
        torrentTitle,
        torrentUrl,
        date
      });
    });
    return notifications;
  }
  async function loadAllNotifications() {
    if (isLoading) return;
    const myUsername = getMyUsername();
    if (!myUsername) return;
    isLoading = true;
    loadingAborted = false;
    const loadBtn = document.getElementById("xcbLoadAllNotifications");
    if (loadBtn) loadBtn.setAttribute("disabled", "true");
    showProgress(true);
    updateProgress(0, 0, "Starting...");
    const baseUrl = window.location.origin;
    const notificationsBaseUrl = `${baseUrl}/user/${encodeURIComponent(myUsername)}/notifications/`;
    try {
      allNotifications = [];
      let page = 1;
      let hasMore = true;
      const seenUsernames = /* @__PURE__ */ new Set();
      while (hasMore && !loadingAborted && page <= 50) {
        updateProgress(page, page + 1, `Loading page ${page}...`);
        const pageUrl = page === 1 ? notificationsBaseUrl : `${notificationsBaseUrl}${page}/`;
        const response = await fetch(pageUrl);
        if (!response.ok) {
          console.log(`[MaNKeY-Bot] Failed to fetch page ${page}: ${response.status}`);
          break;
        }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const pageNotifications = parseNotificationItems(doc);
        if (pageNotifications.length === 0) {
          hasMore = false;
        } else {
          for (const notif of pageNotifications) {
            const key = `${notif.username.toLowerCase()}:${notif.torrentUrl}`;
            if (!seenUsernames.has(key)) {
              seenUsernames.add(key);
              allNotifications.push(notif);
            }
          }
          page++;
          await sleep(100);
        }
      }
      if (loadingAborted) {
        console.log("[MaNKeY-Bot] Notification loading cancelled");
        return;
      }
      filteredNotifications = [...allNotifications];
      saveCachedNotifications({
        username: myUsername,
        fetchedAt: Date.now(),
        notifications: allNotifications
      });
      const resultsEl = document.getElementById("xcbNotificationsResults");
      if (resultsEl) resultsEl.style.display = "block";
      hideNativeContent();
      renderNotifications(filteredNotifications);
      updateStatusDisplay();
      console.log(`[MaNKeY-Bot] Loaded ${allNotifications.length} notifications from ${page - 1} pages`);
    } catch (err) {
      console.error("[MaNKeY-Bot] Error loading notifications:", err);
      updateProgress(0, 0, "Error loading notifications");
    } finally {
      isLoading = false;
      if (loadBtn) loadBtn.removeAttribute("disabled");
      setTimeout(() => showProgress(false), 500);
    }
  }
  function hideNativeContent() {
    const tables = document.querySelectorAll("table.table-list, .table-list");
    tables.forEach((table) => {
      if (table.closest("#xcbNotificationsResults")) return;
      if (table instanceof HTMLElement) {
        table.style.display = "none";
      }
    });
    const pagination = document.querySelectorAll(".pagination, .pager");
    pagination.forEach((p) => {
      if (p instanceof HTMLElement) {
        p.style.display = "none";
      }
    });
  }
  function showNativeContent() {
    const tables = document.querySelectorAll("table.table-list, .table-list");
    tables.forEach((table) => {
      if (table.closest("#xcbNotificationsResults")) return;
      if (table instanceof HTMLElement) {
        table.style.display = "";
      }
    });
    const pagination = document.querySelectorAll(".pagination, .pager");
    pagination.forEach((p) => {
      if (p instanceof HTMLElement) {
        p.style.display = "";
      }
    });
  }
  function filterNotifications(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredNotifications = [...allNotifications];
    } else {
      filteredNotifications = allNotifications.filter(
        (n) => n.username.toLowerCase().includes(q)
      );
    }
    renderNotifications(filteredNotifications);
    updateStatusDisplay();
  }
  function setupEventHandlers() {
    const searchInput = document.getElementById(
      "xcbNotificationsSearchInput"
    );
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          filterNotifications(searchInput.value);
        }, 150);
      });
    }
    const loadBtn = document.getElementById("xcbLoadAllNotifications");
    if (loadBtn) {
      loadBtn.addEventListener("click", () => loadAllNotifications());
    }
    const refreshBtn = document.getElementById("xcbRefreshNotifications");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        allNotifications = [];
        filteredNotifications = [];
        showNativeContent();
        const resultsEl = document.getElementById("xcbNotificationsResults");
        if (resultsEl) resultsEl.style.display = "none";
        loadAllNotifications();
      });
    }
    const cancelBtn = document.getElementById("xcbNotificationsCancelLoad");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        loadingAborted = true;
        showProgress(false);
      });
    }
  }
  function loadFromCache() {
    const cached = getCachedNotifications();
    const myUsername = getMyUsername();
    if (!cached || !myUsername) return false;
    if (cached.username.toLowerCase() !== myUsername.toLowerCase()) return false;
    allNotifications = cached.notifications;
    filteredNotifications = [...allNotifications];
    const resultsEl = document.getElementById("xcbNotificationsResults");
    if (resultsEl) resultsEl.style.display = "block";
    hideNativeContent();
    renderNotifications(filteredNotifications);
    updateStatusDisplay();
    return true;
  }
  function initNotificationsSearch() {
    if (!isNotificationsPage()) return;
    console.log("[MaNKeY-Bot] Initializing notifications search");
    const table = document.querySelector("table.table-list, .table-list, .box-info-detail");
    if (!table || !table.parentNode) {
      console.log("[MaNKeY-Bot] Could not find notifications list");
      return;
    }
    const searchUI = createSearchUI();
    const resultsTable = createResultsTable();
    table.parentNode.insertBefore(searchUI, table);
    table.parentNode.insertBefore(resultsTable, table);
    setupEventHandlers();
    const hadCache = loadFromCache();
    if (!hadCache) {
      const countEl = document.getElementById("xcbNotificationsCount");
      if (countEl) countEl.textContent = 'Click "Load All" to fetch all notifications';
    }
  }
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let deps;
  let activeTourCleanup = null;
  function initGuidedTour(dependencies) {
    deps = dependencies;
  }
  function stopGuidedTour() {
    if (activeTourCleanup) {
      activeTourCleanup();
      activeTourCleanup = null;
    }
  }
  function startGuidedTour() {
    var _a;
    const settings = deps.getSettings();
    if (settings.wantsGuidedTour) {
      settings.wantsGuidedTour = false;
      deps.saveSettings(settings);
    }
    const tourSteps = [
      {
        id: "welcome",
        title: '<i class="ph-bold ph-book-open-text"></i> Welcome to the Guided Tour!',
        content: `<p>This tour will walk you through all the features of MaNKeY-Bot. You'll learn how to block spammers, trust helpful users, track requests, and more!</p>`,
        tip: `<strong>Tip:</strong> You can restart this tour anytime from <strong>Settings → Getting Started</strong>.`,
        target: null,
        // No specific target for intro
        position: "center"
      },
      {
        id: "toggle-btn",
        title: '<i class="ph-bold ph-gear"></i> Settings Button',
        content: `<p>Look for the <strong><i class="ph-bold ph-user"></i> button</strong> on your screen (default: bottom-right corner). Click it to open the main panel.</p>
        <p>The button shows your blocked count, trusted count, and more at a glance.</p>`,
        tip: `<strong>Keyboard shortcut:</strong> Press <kbd>S</kbd> to toggle the panel. You can change the button's position in <strong>Settings → Appearance</strong>.`,
        target: "#xcbToggleBtn",
        position: "auto"
        // Will be calculated based on button position
      },
      {
        id: "block-tab",
        title: '<i class="ph-bold ph-prohibit"></i> Block Tab',
        content: `<p>Manage blocked users here. You can:</p>
        <ul class="xcb-tour-list">
          <li><strong style="color: ${HIGHLIGHT_COLOR};">Hard Block</strong> - Completely hide their comments</li>
          <li><strong style="color: ${HIGHLIGHT_COLOR};">Soft Block</strong> - Just highlight them in red</li>
          <li><strong style="color: var(--xcb-accent-warning);">Temp Block</strong> - Auto-expires after a set time</li>
        </ul>`,
        tip: `<strong>Note:</strong> Hard-blocked users only have Undo and Show buttons - no reply options.`,
        target: '[data-tab="block"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="block"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "trust-tab",
        title: '<i class="ph-bold ph-check-circle"></i> Trust Tab',
        content: `<p>Add trusted users here. Trusted users:</p>
        <ul class="xcb-tour-list">
          <li>Are highlighted in <strong style="color: ${TRUSTED_COLOR};">green</strong></li>
          <li>Never have comments hidden by keywords</li>
          <li>Get a handy Reply button for quick responses</li>
        </ul>`,
        tip: `<strong>Use for:</strong> Fellow uploaders, helpful commenters, frequent requesters.`,
        target: '[data-tab="trust"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="trust"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "keyword-tab",
        title: '<i class="ph-bold ph-key"></i> Keywords Tab',
        content: `<p>Two types of keyword filters:</p>
        <ul class="xcb-tour-list">
          <li><strong style="color: ${KEYWORD_COLOR};"><i class="ph-bold ph-prohibit"></i> Blocked</strong> - Hide comments containing these words</li>
          <li><strong style="color: #06b6d4;"><i class="ph-bold ph-eye"></i> Highlighted</strong> - Visually mark comments with these words (not hidden)</li>
        </ul>
        <p>Use <strong>blocked</strong> for spam, requests, or annoying phrases. Use <strong>highlighted</strong> for "thank you", "please", or specific names you want to notice.</p>`,
        tip: `<strong>Note:</strong> Trusted users bypass blocked keywords, but can still trigger highlighted keywords.`,
        target: '[data-tab="keyword"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="keyword"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "requests-tab",
        title: '<i class="ph-bold ph-clipboard-text"></i> Requests Tab',
        content: `<p>Track user requests with this powerful feature:</p>
        <ul class="xcb-tour-list">
          <li>Save requests with one click</li>
          <li>Track status: Pending, Completed, Declined</li>
          <li>Add checklists to complex requests</li>
          <li>Export/import your request list</li>
        </ul>`,
        tip: `<strong>Pro tip:</strong> Use the Pause toggle when you need a break from requests.`,
        target: '[data-tab="requests"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="requests"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "notes-tab",
        title: '<i class="ph-bold ph-note-pencil"></i> Notes Tab',
        content: `<p>Save comments that catch your attention:</p>
        <ul class="xcb-tour-list">
          <li>Save <strong>helpful</strong> comments for reference</li>
          <li>Track <strong>complaints</strong> or feedback</li>
          <li>Add tags like <em>Important</em>, <em>Question</em>, <em>Follow-up</em></li>
          <li>Archive notes when you're done with them</li>
        </ul>`,
        tip: `<strong>How to use:</strong> Click the <i class="ph-bold ph-note-pencil"></i> Note button on any comment, or use Shift+Right-click → Add Note.`,
        target: '[data-tab="notes"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="notes"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "settings-tab",
        title: '<i class="ph-bold ph-gear"></i> Settings Tab',
        content: `<p>Customize everything here! Settings are organized into sections:</p>
        <ul class="xcb-tour-list">
          <li><strong style="color: var(--xcb-accent-success);"><i class="ph-bold ph-rocket"></i> Start/Account</strong> - Verification, whitelist & tour</li>
          <li><strong style="color: var(--xcb-accent-info);"><i class="ph-bold ph-monitor"></i> Display</strong> - UI options, panel size, date formats</li>
          <li><strong style="color: var(--xcb-primary);"><i class="ph-bold ph-palette"></i> Theme</strong> - Themes, badge colors, fonts</li>
          <li><strong style="color: var(--xcb-accent-warning);"><i class="ph-bold ph-lightning"></i> Features</strong> - Requests, notes, tracking</li>
          <li><strong style="color: var(--xcb-accent-success-alt);"><i class="ph-bold ph-chat-dots"></i> Replies</strong> - Quick reply templates</li>
          <li><strong style="color: var(--xcb-accent-purple);"><i class="ph-bold ph-floppy-disk"></i> Data</strong> - Statistics, backup & export</li>
        </ul>`,
        tip: `<strong>Pro tip:</strong> Use the jump buttons at the top to quickly navigate between sections!`,
        target: '[data-tab="settings"]',
        position: "bottom",
        action: () => {
          var _a2;
          return (_a2 = document.querySelector('[data-tab="settings"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
        }
      },
      {
        id: "context-menu",
        title: '<i class="ph-bold ph-cursor-click"></i> Shift + Right-Click Menu',
        content: `<p>The fastest way to block or trust users!</p>
        <p><strong>Hold Shift + Right-click</strong> on any username to see options:</p>
        <ul class="xcb-tour-list">
          <li>Block (hard, soft, or temp)</li>
          <li>Trust user</li>
          <li>Add request from their comment</li>
        </ul>`,
        tip: `<strong>Why Shift?</strong> Normal right-click shows browser menu (Open in new tab, etc.)`,
        target: null,
        position: "center"
      },
      {
        id: "keyboard-shortcuts",
        title: '<i class="ph-bold ph-keyboard"></i> Keyboard Shortcuts',
        content: `<p>Speed up your workflow with keyboard shortcuts!</p>
        <p><strong>Global shortcut:</strong></p>
        <ul class="xcb-tour-list" style="margin-bottom: 12px;">
          <li><kbd class="xcb-tour-kbd">S</kbd> - Toggle control panel (works anywhere)</li>
        </ul>
        <p><strong>When hovering over a username:</strong></p>
        <ul class="xcb-tour-list">
          <li><kbd class="xcb-tour-kbd">B</kbd> - Block user</li>
          <li><kbd class="xcb-tour-kbd">T</kbd> - Trust user</li>
          <li><kbd class="xcb-tour-kbd">U</kbd> - Undo (unblock/untrust)</li>
        </ul>`,
        tip: `<strong>Hint:</strong> The keyboard hint bar appears at the bottom when hovering over usernames.`,
        target: null,
        position: "center"
      },
      {
        id: "getting-started",
        title: '<i class="ph-bold ph-rocket"></i> Start/Account Section',
        content: `<p>The <strong>Getting Started & Account</strong> section at the top of Settings has everything you need!</p>
        <ul class="xcb-tour-list">
          <li><strong>Account verification</strong> - Verify your 1337x account</li>
          <li><strong>Help & tour</strong> - Toggle help boxes, restart this tour</li>
          <li><strong>Uploader resources</strong> - Links to guides and staff chat</li>
          <li><strong>Auto-whitelist</strong> - Users who never show block/trust buttons</li>
        </ul>`,
        tip: `<strong>First time?</strong> Visit your Account page to verify your username so the tool knows which uploads are yours!`,
        target: "#xcbSectionGettingStarted",
        position: "bottom",
        action: () => {
          var _a2;
          (_a2 = document.querySelector('[data-tab="settings"]')) == null ? void 0 : _a2.dispatchEvent(new MouseEvent("click"));
          setTimeout(() => {
            const section = document.getElementById("xcbSectionGettingStarted");
            if (section)
              section.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      },
      {
        id: "complete",
        title: '<i class="ph-bold ph-confetti"></i> Tour Complete!',
        content: `<p>You're all set! Here's a quick summary:</p>
        <ul class="xcb-tour-list">
          <li><strong style="color: ${HIGHLIGHT_COLOR};">Block</strong> spammers and trolls</li>
          <li><strong style="color: ${TRUSTED_COLOR};">Trust</strong> helpful users</li>
          <li><strong style="color: ${KEYWORD_COLOR};">Keywords</strong> hide or highlight matching comments</li>
          <li><strong style="color: var(--xcb-accent-warning);">Requests</strong> track what users ask for</li>
          <li><strong style="color: var(--xcb-accent-purple);">Notes</strong> save interesting comments</li>
          <li><kbd class="xcb-tour-kbd">S</kbd> to toggle panel, <kbd class="xcb-tour-kbd">Shift</kbd>+<kbd class="xcb-tour-kbd">Right-click</kbd> for quick actions</li>
          <li><strong>Auto-backup</strong> protects your data automatically</li>
        </ul>`,
        tip: `<strong>Need help later?</strong> Visit <strong>Getting Started</strong> in Settings to restart this tour anytime!`,
        target: null,
        position: "center"
      }
    ];
    let currentStep = 0;
    let overlay = null;
    let tooltip = null;
    let previousHighlight = null;
    function cleanup() {
      if (overlay) overlay.remove();
      if (tooltip) tooltip.remove();
      if (previousHighlight)
        previousHighlight.classList.remove("xcb-tour-highlight");
      overlay = null;
      tooltip = null;
      previousHighlight = null;
      activeTourCleanup = null;
    }
    activeTourCleanup = cleanup;
    function endTour(completed = false) {
      cleanup();
      const s = deps.getSettings();
      if (completed) {
        s.guidedTourCompleted = true;
        s.wantsGuidedTour = false;
      }
      deps.saveSettings(s);
      if (completed) {
        const themeClass = deps.getThemeClassName();
        const msg = document.createElement("div");
        msg.className = themeClass;
        msg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--xcb-panel-bg);border:2px solid var(--xcb-success);border-radius:12px;padding:30px;z-index:100020;text-align:center;max-width:400px;font-family:var(--xcb-font-family);";
        msg.innerHTML = `
        <h2 style="color:var(--xcb-success);margin:0 0 15px 0;"><i class="ph-bold ph-confetti"></i> You're Ready!</h2>
        <p style="color:var(--xcb-panel-text);margin:0 0 20px 0;">The guided tour is complete. Enjoy using MaNKeY-Bot!</p>
        <button onclick="this.parentElement.remove()" style="background:var(--xcb-success);color:#fff;border:1px solid rgba(255, 255, 255, 0.2);padding:12px 30px;border-radius:6px;cursor:pointer;font-weight:bold;">Got it!</button>
      `;
        document.body.appendChild(msg);
      }
    }
    function showStep(stepIndex) {
      cleanup();
      if (stepIndex < 0 || stepIndex >= tourSteps.length) {
        endTour(stepIndex >= tourSteps.length);
        return;
      }
      const step = tourSteps[stepIndex];
      currentStep = stepIndex;
      if (step.action) {
        step.action();
        setTimeout(() => renderStep(step, stepIndex), 100);
      } else {
        renderStep(step, stepIndex);
      }
    }
    function renderStep(step, stepIndex) {
      const themeClass = deps.getThemeClassName();
      overlay = document.createElement("div");
      overlay.className = `xcb-tour-overlay ${themeClass}`;
      document.body.appendChild(overlay);
      let targetEl = null;
      let targetRect = null;
      if (step.target) {
        targetEl = document.querySelector(step.target);
        if (targetEl) {
          targetEl.classList.add("xcb-tour-highlight");
          previousHighlight = targetEl;
          targetRect = targetEl.getBoundingClientRect();
        }
      }
      tooltip = document.createElement("div");
      tooltip.className = `xcb-tour-tooltip ${themeClass}`;
      const progress = (stepIndex + 1) / tourSteps.length * 100;
      const isFirst = stepIndex === 0;
      const isLast = stepIndex === tourSteps.length - 1;
      tooltip.innerHTML = `
      <div class="xcb-tour-progress">
        <div class="xcb-tour-progress-bar">
          <div class="xcb-tour-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="xcb-tour-progress-text">${stepIndex + 1} / ${tourSteps.length}</div>
      </div>
      <h3>${step.title}</h3>
      ${step.content}
      ${step.tip ? `<div class="xcb-tour-tip">${step.tip}</div>` : ""}
      <div class="xcb-tour-buttons">
        <button class="xcb-tour-btn xcb-tour-btn-skip" id="xcbTourSkip">Skip Tour</button>
        <div style="display:flex;gap:10px;">
          ${!isFirst ? '<button class="xcb-tour-btn xcb-tour-btn-prev" id="xcbTourPrev">← Back</button>' : ""}
          ${isLast ? '<button class="xcb-tour-btn xcb-tour-btn-finish" id="xcbTourNext">Finish!</button>' : '<button class="xcb-tour-btn xcb-tour-btn-next" id="xcbTourNext">Next →</button>'}
        </div>
      </div>
    `;
      document.body.appendChild(tooltip);
      positionTooltip(tooltip, targetRect, step.position);
      document.getElementById("xcbTourSkip").onclick = () => {
        if (confirm(
          "Are you sure you want to skip the tour? You can restart it later from Settings."
        )) {
          endTour(false);
        }
      };
      const nextBtn = document.getElementById("xcbTourNext");
      if (nextBtn) {
        nextBtn.onclick = () => showStep(currentStep + 1);
      }
      const prevBtn = document.getElementById("xcbTourPrev");
      if (prevBtn) {
        prevBtn.onclick = () => showStep(currentStep - 1);
      }
      const keyHandler = (e) => {
        if (e.key === "Escape") {
          if (confirm("Are you sure you want to skip the tour?")) {
            endTour(false);
          }
        } else if (e.key === "ArrowRight" || e.key === "Enter") {
          showStep(currentStep + 1);
        } else if (e.key === "ArrowLeft") {
          showStep(currentStep - 1);
        }
      };
      document.addEventListener("keydown", keyHandler, { once: true });
    }
    function positionTooltip(tooltip2, targetRect, position) {
      const padding = 20;
      let top;
      let left;
      let arrowClass = "";
      if (!targetRect || position === "center") {
        tooltip2.style.top = "50%";
        tooltip2.style.left = "50%";
        tooltip2.style.transform = "translate(-50%, -50%)";
        return;
      }
      const tooltipRect = tooltip2.getBoundingClientRect();
      let effectivePosition = position;
      if (position === "auto") {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const isOnRight = targetCenterX > window.innerWidth / 2;
        const isOnBottom = targetCenterY > window.innerHeight / 2;
        if (isOnBottom && isOnRight) {
          effectivePosition = "top";
        } else if (isOnBottom && !isOnRight) {
          effectivePosition = "top";
        } else if (!isOnBottom && isOnRight) {
          effectivePosition = "left";
        } else {
          effectivePosition = "right";
        }
      }
      switch (effectivePosition) {
        case "bottom":
          top = targetRect.bottom + padding;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowClass = "xcb-tour-arrow-up";
          break;
        case "top":
          top = targetRect.top - tooltipRect.height - padding;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowClass = "xcb-tour-arrow-down";
          break;
        case "left":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.left - tooltipRect.width - padding;
          arrowClass = "xcb-tour-arrow-right";
          break;
        case "right":
        default:
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + padding;
          arrowClass = "xcb-tour-arrow-left";
          break;
      }
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }
      if (arrowClass) {
        const arrow = document.createElement("div");
        arrow.className = `xcb-tour-arrow ${arrowClass}`;
        if (arrowClass.includes("up") || arrowClass.includes("down")) {
          const arrowX = targetRect.left + targetRect.width / 2 - left;
          arrow.style.left = `${Math.max(20, Math.min(arrowX, tooltipRect.width - 20))}px`;
        } else {
          const arrowY = targetRect.top + targetRect.height / 2 - top;
          arrow.style.top = `${Math.max(20, Math.min(arrowY, tooltipRect.height - 20))}px`;
        }
        tooltip2.appendChild(arrow);
      }
      tooltip2.style.top = `${top}px`;
      tooltip2.style.left = `${left}px`;
    }
    const panel = document.querySelector(".xcb-panel");
    if (!panel || panel.style.display === "none") {
      (_a = document.getElementById("xcbToggleBtn")) == null ? void 0 : _a.click();
      setTimeout(() => showStep(0), 300);
    } else {
      showStep(0);
    }
  }
  let contextMenu = null;
  let blockMenu = null;
  let showQuickTagPopupFn = null;
  let showRequestPopupFn = null;
  let showNotePopupFn = null;
  function initMenus(callbacks) {
    showQuickTagPopupFn = callbacks.showQuickTagPopup;
    showRequestPopupFn = callbacks.showRequestPopup;
    showNotePopupFn = callbacks.showNotePopup;
  }
  function positionMenuWithinViewport(menu, x, y) {
    menu.style.left = "-9999px";
    menu.style.top = "-9999px";
    document.body.appendChild(menu);
    const menuRect = menu.getBoundingClientRect();
    const menuHeight = menuRect.height;
    const menuWidth = menuRect.width;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let finalX = x;
    let finalY = y;
    if (x + menuWidth > viewportWidth - 10) {
      finalX = viewportWidth - menuWidth - 10;
    }
    if (finalX < 10) finalX = 10;
    if (y + menuHeight > viewportHeight - 10) {
      finalY = Math.max(10, viewportHeight - menuHeight - 10);
    }
    menu.style.left = finalX + "px";
    menu.style.top = finalY + "px";
  }
  function showContextMenu(x, y, username, commentText = "", isSiteTrusted = false) {
    hideContextMenu();
    contextMenu = document.createElement("div");
    contextMenu.className = "xcb-context-menu";
    const blocked = isBlocked(username);
    const trusted = isTrusted(username);
    const settings = getSettings();
    const isLoggedIn = isLoggedInToSite();
    const requestsAvailable = settings.requestsEnabled !== false && !settings.requestsPaused;
    let requestOption = "";
    if (requestsAvailable && isLoggedIn) {
      requestOption = `<div class="xcb-context-item xcb-context-item-request" data-action="add-request">+ Add Request from ${username}</div>`;
    } else if (requestsAvailable && !isLoggedIn) {
      requestOption = `<div class="xcb-context-item" style="color: #666; cursor: not-allowed; opacity: 0.6;"><i class="ph-bold ph-lock"></i> Login required to add requests</div>`;
    } else if (settings.requestsEnabled !== false && settings.requestsPaused) {
      requestOption = `<div class="xcb-context-item" style="color: #666; cursor: not-allowed;">⏸ Requests Paused</div>`;
    }
    const noteOption = settings.notesEnabled !== false ? `<div class="xcb-context-item xcb-context-item-note" data-action="add-note"><i class="ph-bold ph-note-pencil"></i> Add Note about ${username}</div>` : "";
    const keywordOption = commentText.trim() ? `<div class="xcb-context-item xcb-context-item-keyword" data-action="add-keyword" style="color: var(--xcb-keyword-color, #f59e0b);"><i class="ph-bold ph-text-aa"></i> Add "${commentText.length > 20 ? commentText.substring(0, 20) + "..." : commentText}" to Keywords</div>` : "";
    if (isSiteTrusted) {
      const hasAnyOption = requestOption || noteOption || keywordOption;
      if (!hasAnyOption) {
        return;
      }
      contextMenu.innerHTML = `
      <div style="color: #888; font-size: 11px; padding: 5px 10px; border-bottom: 1px solid #333;">
        <i class="ph-bold ph-shield-star"></i> Site-trusted user (VIP/Mod)
      </div>
      ${requestOption}
      ${noteOption}
      ${keywordOption}
    `;
    } else if (blocked) {
      contextMenu.innerHTML = `
      <div class="xcb-context-item xcb-context-item-trust" data-action="unblock"><i class="ph-bold ph-arrow-counter-clockwise"></i> Unblock ${username}</div>
      <div class="xcb-context-item" data-action="change-tags-block" style="color: #f59e0b;"><i class="ph-bold ph-tag"></i> Change Tags</div>
      <div class="xcb-context-item xcb-context-item-trust" data-action="move-trust"><i class="ph-bold ph-check-circle"></i> Move to Trusted</div>
      ${requestOption ? `<div style="border-top: 1px solid #333; margin: 5px 0;"></div>${requestOption}` : ""}
      ${noteOption}
      ${keywordOption}
    `;
    } else if (trusted) {
      contextMenu.innerHTML = `
      <div class="xcb-context-item xcb-context-item-block" data-action="untrust"><i class="ph-bold ph-arrow-counter-clockwise"></i> Remove from Trusted</div>
      <div class="xcb-context-item" data-action="change-tags-trust" style="color: #f59e0b;"><i class="ph-bold ph-tag"></i> Change Tags</div>
      <div class="xcb-context-item xcb-context-item-block" data-action="move-block"><i class="ph-bold ph-prohibit"></i> Move to Block List</div>
      ${requestOption ? `<div style="border-top: 1px solid #333; margin: 5px 0;"></div>${requestOption}` : ""}
      ${noteOption}
      ${keywordOption}
    `;
    } else {
      contextMenu.innerHTML = `
      <div class="xcb-context-item xcb-context-item-block" data-action="block"><i class="ph-bold ph-prohibit"></i> Block ${username}</div>
      <div class="xcb-context-item xcb-context-item-block" data-action="block-soft"><i class="ph-bold ph-prohibit"></i> Soft Block (highlight only)</div>
      <div class="xcb-context-item xcb-context-item-block" data-action="block-temp"><i class="ph-bold ph-clock"></i> Temp Block (7 days)</div>
      <div class="xcb-context-item xcb-context-item-trust" data-action="trust"><i class="ph-bold ph-check-circle"></i> Trust ${username}</div>
      ${requestOption ? `<div style="border-top: 1px solid #333; margin: 5px 0;"></div>${requestOption}` : ""}
      ${noteOption}
      ${keywordOption}
    `;
    }
    contextMenu.querySelectorAll(".xcb-context-item").forEach((item) => {
      item.onclick = (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        const rect = item.getBoundingClientRect();
        switch (action) {
          case "block":
            addToBlocklist(username, "", "hard", null, window.location.href);
            break;
          case "block-soft":
            addToBlocklist(username, "", "soft", null, window.location.href);
            break;
          case "block-temp":
            addToBlocklist(username, "", "hard", 7, window.location.href);
            break;
          case "unblock":
            removeFromBlocklist(username);
            break;
          case "move-trust":
            removeFromBlocklist(username);
            addToTrustedlist(username, "", window.location.href);
            hideContextMenu();
            if (showQuickTagPopupFn) {
              showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "trust");
            }
            return;
          case "trust":
            addToTrustedlist(username, "", window.location.href);
            hideContextMenu();
            if (showQuickTagPopupFn) {
              showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "trust");
            }
            return;
          case "untrust":
            removeFromTrustedlist(username);
            break;
          case "change-tags-block":
            hideContextMenu();
            if (showQuickTagPopupFn) {
              showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "block", true);
            }
            return;
          case "change-tags-trust":
            hideContextMenu();
            if (showQuickTagPopupFn) {
              showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "trust", true);
            }
            return;
          case "move-block":
            removeFromTrustedlist(username);
            addToBlocklist(username, "", "hard", null, window.location.href);
            break;
          case "add-request":
            hideContextMenu();
            if (showRequestPopupFn) {
              showRequestPopupFn(
                rect.left,
                rect.bottom + 5,
                username,
                commentText,
                window.location.href
              );
            }
            return;
          case "add-note":
            hideContextMenu();
            if (showNotePopupFn) {
              showNotePopupFn(
                rect.left,
                rect.bottom + 5,
                username,
                commentText,
                window.location.href
              );
            }
            return;
          case "add-keyword":
            if (commentText.trim()) {
              const added = addKeyword(commentText.trim());
              if (added) {
                alert(`Added "${commentText.trim()}" to keyword block list. Comments containing this keyword will be highlighted.`);
              } else {
                alert(`"${commentText.trim()}" is already in your keyword block list.`);
              }
            }
            hideContextMenu();
            return;
        }
        hideContextMenu();
        location.reload();
      };
    });
    positionMenuWithinViewport(contextMenu, x, y);
  }
  function hideContextMenu() {
    if (contextMenu) {
      contextMenu.remove();
      contextMenu = null;
    }
  }
  function showBlockMenu(x, y, username) {
    hideBlockMenu();
    hideContextMenu();
    blockMenu = document.createElement("div");
    blockMenu.className = "xcb-context-menu";
    const customReasons = getCustomReasons();
    const builtInPresetsHtml = BLOCK_REASON_PRESETS.map(
      (reason) => `<span class="xcb-reason-preset" data-reason="${reason}">${reason}</span>`
    ).join("");
    const customPresetsHtml = customReasons.map(
      (r) => `<span class="xcb-reason-preset" data-reason="${r.name}" style="border-color:${r.color};">${r.name}</span>`
    ).join("");
    const presetsHtml = builtInPresetsHtml + customPresetsHtml;
    blockMenu.innerHTML = `
    <div class="xcb-context-item xcb-context-item-block xcb-quick-block" data-action="quick" style="background:#dc2626;">
      <strong><i class="ph-bold ph-lightning"></i> Quick Block</strong> <span style="font-size:10px;color:#fca5a5;">(block now, add tags after)</span>
    </div>
    <div style="border-top: 1px solid #333; margin: 5px 0;"></div>
    <div class="xcb-context-item xcb-context-item-block" data-action="hard" data-days="">
      <strong>Hard Block</strong> <span style="font-size:10px;color:#888;">(hide comments)</span>
    </div>
    <div class="xcb-context-item xcb-context-item-block" data-action="soft" data-days="">
      <strong>Soft Block</strong> <span style="font-size:10px;color:#888;">(highlight only)</span>
    </div>
    <div style="border-top: 1px solid #333; margin: 5px 0;"></div>
    <div class="xcb-context-item" style="color: #f59e0b;" data-action="hard" data-days="1">
      Temp Block - 1 day
    </div>
    <div class="xcb-context-item" style="color: #f59e0b;" data-action="hard" data-days="7">
      Temp Block - 7 days
    </div>
    <div class="xcb-context-item" style="color: #f59e0b;" data-action="hard" data-days="30">
      Temp Block - 30 days
    </div>
    <div class="xcb-reason-presets">
      <span style="font-size:10px;color:#666;width:100%;margin-bottom:3px;">Or select tags first, then click block type:</span>
      ${presetsHtml}
      <span style="font-size:9px;color:#555;width:100%;margin-top:5px;display:block;">Note: Only first 2 tags (max 25 chars) shown inline</span>
    </div>
  `;
    let selectedReasons = [];
    blockMenu.querySelectorAll(".xcb-reason-preset").forEach((preset) => {
      preset.onclick = (e) => {
        e.stopPropagation();
        const reason = preset.dataset.reason;
        const idx = selectedReasons.indexOf(reason);
        if (idx === -1) {
          selectedReasons.push(reason);
          preset.style.borderColor = HIGHLIGHT_COLOR;
          preset.style.color = "#fff";
        } else {
          selectedReasons.splice(idx, 1);
          preset.style.borderColor = "#555";
          preset.style.color = "#aaa";
        }
      };
    });
    blockMenu.querySelectorAll(".xcb-context-item").forEach((item) => {
      item.onclick = (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        const daysStr = item.dataset.days;
        const days = daysStr ? parseInt(daysStr) : null;
        if (action === "quick") {
          addToBlocklist(username, "", "hard", null, window.location.href);
          const rect = item.getBoundingClientRect();
          hideBlockMenu();
          if (showQuickTagPopupFn) {
            showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "block");
          }
        } else if (selectedReasons.length > 0 || days) {
          addToBlocklist(username, selectedReasons.join(", "), action, days, window.location.href);
          hideBlockMenu();
          location.reload();
        } else {
          addToBlocklist(username, "", action, null, window.location.href);
          const rect = item.getBoundingClientRect();
          hideBlockMenu();
          if (showQuickTagPopupFn) {
            showQuickTagPopupFn(rect.left, rect.bottom + 5, username, "block");
          }
        }
      };
    });
    blockMenu.onclick = (e) => e.stopPropagation();
    positionMenuWithinViewport(blockMenu, x, y);
  }
  function hideBlockMenu() {
    if (blockMenu) {
      blockMenu.remove();
      blockMenu = null;
    }
  }
  let quickTagPopup = null;
  let requestPopup = null;
  let notePopup = null;
  let sectionPickerPopup = null;
  let sectionEditPopup = null;
  let requestEditPopup = null;
  let noteSubtaskPopup = null;
  let noteEditPopup = null;
  let backupHistoryPopup = null;
  let showManagementPanelFn = null;
  let canUserSubmitRequestFn = null;
  let canAcceptMoreRequestsFn = null;
  let getContrastColorFn$1 = null;
  let restoreFromBackupHistoryFn$1 = null;
  let getAllNoteTagsFn = null;
  let getThemeClassNameFn = null;
  function initPopups(callbacks) {
    showManagementPanelFn = callbacks.showManagementPanel;
    canUserSubmitRequestFn = callbacks.canUserSubmitRequest;
    canAcceptMoreRequestsFn = callbacks.canAcceptMoreRequests;
    getContrastColorFn$1 = callbacks.getContrastColor;
    restoreFromBackupHistoryFn$1 = callbacks.restoreFromBackupHistory;
    getAllNoteTagsFn = callbacks.getAllNoteTags;
    getThemeClassNameFn = callbacks.getThemeClassName || null;
  }
  function getPopupThemeClass() {
    return getThemeClassNameFn ? getThemeClassNameFn() : "mankey-theme-dark";
  }
  function showQuickTagPopup(x, y, username, listType, isEditing = false) {
    hideQuickTagPopup();
    hideRequestPopup();
    hideNotePopup();
    hideBlockMenu();
    hideContextMenu();
    quickTagPopup = document.createElement("div");
    quickTagPopup.className = "xcb-context-menu";
    const presets = listType === "block" ? BLOCK_REASON_PRESETS : TRUST_REASON_PRESETS;
    const customReasons = getCustomReasons();
    const color = listType === "block" ? HIGHLIGHT_COLOR : TRUSTED_COLOR;
    let existingTags = [];
    if (isEditing) {
      if (listType === "block") {
        const blockedUser = getBlockedUser(username);
        if (blockedUser == null ? void 0 : blockedUser.note) {
          existingTags = blockedUser.note.split(",").map((t) => t.trim()).filter((t) => t);
        }
      } else {
        const trustedUser = getTrustedUser(username);
        if (trustedUser == null ? void 0 : trustedUser.note) {
          existingTags = trustedUser.note.split(",").map((t) => t.trim()).filter((t) => t);
        }
      }
    }
    const presetsHtml = presets.map((reason) => {
      const isSelected = existingTags.some((t) => t.toLowerCase() === reason.toLowerCase());
      return `<span class="xcb-reason-preset${isSelected ? " xcb-preset-selected" : ""}" data-reason="${reason}" style="${isSelected ? `border-color:${color};color:#fff;` : ""}">${reason}</span>`;
    }).join("") + customReasons.map((r) => {
      const isSelected = existingTags.some((t) => t.toLowerCase() === r.name.toLowerCase());
      return `<span class="xcb-reason-preset${isSelected ? " xcb-preset-selected" : ""}" data-reason="${r.name}" style="border-color:${isSelected ? color : r.color};${isSelected ? "color:#fff;" : ""}">${r.name}</span>`;
    }).join("");
    const headerText = isEditing ? `<i class="ph-bold ph-tag"></i> Edit tags for ${username}` : `<i class="ph-bold ph-check"></i> ${listType === "block" ? "Blocked" : "Trusted"}! Add tags?`;
    const headerColor = isEditing ? "#f59e0b" : "#4ade80";
    quickTagPopup.innerHTML = `
    <div style="padding: 8px 12px; color: ${headerColor}; font-weight: bold; border-bottom: 1px solid #333;">
      ${headerText}
    </div>
    <div class="xcb-reason-presets">
      <span style="font-size:10px;color:#666;width:100%;margin-bottom:3px;">Click tags to ${isEditing ? "toggle" : "add"} (optional):</span>
      ${presetsHtml}
      <span style="font-size:9px;color:#555;width:100%;margin-top:5px;display:block;">Note: Only first 2 tags (max 25 chars) shown inline</span>
    </div>
    <div style="padding: 8px; border-top: 1px solid #333;">
      <button class="xcb-quick-tag-done" style="background:${color};color:#fff;border:none;padding:5px 12px;border-radius:3px;cursor:pointer;width:100%;">${isEditing ? "Save Changes" : "Done"}</button>
    </div>
  `;
    let selectedReasons = [...existingTags];
    quickTagPopup.querySelectorAll(".xcb-reason-preset").forEach((preset) => {
      preset.onclick = (e) => {
        e.stopPropagation();
        const reason = preset.dataset.reason;
        const idx = selectedReasons.findIndex((r) => r.toLowerCase() === reason.toLowerCase());
        if (idx === -1) {
          selectedReasons.push(reason);
          preset.style.borderColor = color;
          preset.style.color = "#fff";
          preset.classList.add("xcb-preset-selected");
        } else {
          selectedReasons.splice(idx, 1);
          const customReason = customReasons.find((r) => r.name === reason);
          preset.style.borderColor = customReason ? customReason.color : "#555";
          preset.style.color = "#aaa";
          preset.classList.remove("xcb-preset-selected");
        }
      };
    });
    quickTagPopup.querySelector(".xcb-quick-tag-done").onclick = (e) => {
      e.stopPropagation();
      if (listType === "block") {
        updateBlockedUser(username, { note: selectedReasons.join(", ") });
      } else {
        updateTrustedUser(username, { note: selectedReasons.join(", ") });
      }
      hideQuickTagPopup();
      location.reload();
    };
    quickTagPopup.onclick = (e) => e.stopPropagation();
    positionMenuWithinViewport(quickTagPopup, x, y);
  }
  function hideQuickTagPopup() {
    if (quickTagPopup) {
      quickTagPopup.remove();
      quickTagPopup = null;
    }
  }
  function showRequestPopup(x, y, username, commentText, sourceUrl) {
    if (!isLoggedInToSite()) {
      const toast = document.createElement("div");
      toast.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #dc2626; color: #fff; padding: 12px 20px; border-radius: 8px; z-index: 100003; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);";
      toast.innerHTML = '<i class="ph-bold ph-lock"></i> <strong>Login required</strong> - Please log in to add requests';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3e3);
      return;
    }
    hideRequestPopup();
    hideNotePopup();
    hideQuickTagPopup();
    hideContextMenu();
    hideBlockMenu();
    const settings = getSettings();
    const countMode = settings.requestCountMode || "requests";
    const userCanSubmit = canUserSubmitRequestFn ? canUserSubmitRequestFn(username) : true;
    const canAcceptMore = canAcceptMoreRequestsFn ? canAcceptMoreRequestsFn() : true;
    const currentCount = getRequestCountByUser(username, countMode);
    const totalCount = getTotalRequestCount(countMode);
    const userLimitReached = !userCanSubmit && settings.requestLimitPerUser > 0;
    const totalLimitReached = !canAcceptMore && settings.totalRequestsLimit > 0;
    const limitReached = userLimitReached || totalLimitReached;
    requestPopup = document.createElement("div");
    requestPopup.className = "xcb-request-popup";
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = x;
    let top = y;
    if (left + 350 > viewportWidth) {
      left = viewportWidth - 360;
    }
    if (top + 200 > viewportHeight) {
      top = viewportHeight - 210;
    }
    requestPopup.style.left = left + "px";
    requestPopup.style.top = top + "px";
    let limitWarning = "";
    if (totalLimitReached) {
      const pendingRequests = getActiveRequests().filter((r) => r.status === "pending");
      const requestsList = pendingRequests.slice(0, 5).map(
        (r) => `<li style="margin: 2px 0;"><strong>${r.username}</strong>: ${r.text.length > 40 ? r.text.substring(0, 40) + "..." : r.text}</li>`
      ).join("");
      const moreCount = pendingRequests.length > 5 ? `<li style="margin: 2px 0; color: #fca5a5;">...and ${pendingRequests.length - 5} more</li>` : "";
      limitWarning = `<div style="background: #dc2626; color: #fff; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 11px;">
      <strong>Total limit reached:</strong> You have ${totalCount}/${settings.totalRequestsLimit} active requests.
      <br>Archive, complete, or delete existing requests to add more.
      <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 10px;">${requestsList}${moreCount}</ul>
    </div>`;
    } else if (userLimitReached) {
      const userRequests = getActiveRequests().filter(
        (r) => r.username.toLowerCase() === username.toLowerCase() && r.status === "pending"
      );
      const requestsList = userRequests.map(
        (r) => `<li style="margin: 2px 0;">${r.text.length > 50 ? r.text.substring(0, 50) + "..." : r.text}</li>`
      ).join("");
      limitWarning = `<div style="background: #dc2626; color: #fff; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 11px;">
      <strong>User limit reached:</strong> ${username} already has ${currentCount}/${settings.requestLimitPerUser} active requests.
      <br>Archive or delete their existing requests to add more.
      <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 10px;">${requestsList}</ul>
    </div>`;
    }
    let countsDisplay = "";
    if (settings.requestLimitPerUser > 0 || settings.totalRequestsLimit > 0) {
      countsDisplay = `<div style="font-size: 10px; color: #888; margin-bottom: 5px;">`;
      if (settings.requestLimitPerUser > 0) {
        countsDisplay += `${username}'s: ${currentCount}/${settings.requestLimitPerUser}`;
      }
      if (settings.requestLimitPerUser > 0 && settings.totalRequestsLimit > 0) {
        countsDisplay += ` | `;
      }
      if (settings.totalRequestsLimit > 0) {
        countsDisplay += `Total: ${totalCount}/${settings.totalRequestsLimit}`;
      }
      countsDisplay += `</div>`;
    }
    requestPopup.innerHTML = `
    <h4>Add Request from ${username}</h4>
    ${limitWarning}
    ${countsDisplay}
    <textarea id="xcbRequestPopupText" placeholder="Request description...">${commentText || ""}</textarea>
    <div style="font-size: 10px; color: #666; margin-top: 5px;">
      Source: ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" style="color: #f59e0b;">${sourceUrl.substring(0, 50)}...</a>` : "Current page"}
    </div>
    <div class="xcb-request-popup-btns">
      <button id="xcbRequestPopupCancel" class="xcb-cancel-btn">Cancel</button>
      <button id="xcbRequestPopupSave" style="background: ${limitReached ? "#666" : "#f59e0b"}; border: 1px solid rgba(255, 255, 255, 0.2); color: ${limitReached ? "#999" : "#000"};" ${limitReached ? "disabled" : ""}>Save Request</button>
    </div>
  `;
    requestPopup.querySelector("#xcbRequestPopupCancel").onclick = (e) => {
      e.stopPropagation();
      hideRequestPopup();
    };
    requestPopup.querySelector("#xcbRequestPopupSave").onclick = (e) => {
      var _a;
      e.stopPropagation();
      const text = requestPopup.querySelector("#xcbRequestPopupText").value.trim();
      if (text) {
        addRequest(username, text, sourceUrl || window.location.href);
        hideRequestPopup();
        (_a = window.updateQuickNavRequestsState) == null ? void 0 : _a.call(window);
        const confirm2 = document.createElement("div");
        confirm2.style.cssText = "position:fixed;top:20px;right:20px;background:#f59e0b;color:#000;padding:12px 20px;border-radius:6px;z-index:100003;font-weight:bold;";
        confirm2.textContent = "Request saved!";
        document.body.appendChild(confirm2);
        setTimeout(() => confirm2.remove(), 2e3);
      }
    };
    requestPopup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(requestPopup);
    requestPopup.querySelector("#xcbRequestPopupText").focus();
  }
  function hideRequestPopup() {
    if (requestPopup) {
      requestPopup.remove();
      requestPopup = null;
    }
  }
  function showNotePopup(x, y, username, commentText, sourceUrl, editNoteId = null) {
    hideNotePopup();
    hideRequestPopup();
    hideQuickTagPopup();
    hideContextMenu();
    hideBlockMenu();
    const existingNote = editNoteId ? getNotes().find((n) => n.id === editNoteId) : null;
    notePopup = document.createElement("div");
    notePopup.className = "xcb-note-popup";
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 400;
    const popupHeight = Math.min(450, viewportHeight - 40);
    let left = x;
    let top = y;
    if (left + popupWidth > viewportWidth - 10) {
      left = viewportWidth - popupWidth - 10;
    }
    if (left < 10) left = 10;
    if (top + popupHeight > viewportHeight - 10) {
      const spaceAbove = y - 10;
      if (spaceAbove >= popupHeight) {
        top = y - popupHeight - 10;
      } else {
        top = Math.max(20, (viewportHeight - popupHeight) / 2);
      }
    }
    if (top < 10) top = 10;
    notePopup.style.left = left + "px";
    notePopup.style.top = top + "px";
    const builtInTags = [
      "Helpful",
      "Important",
      "Complaint",
      "Question",
      "Feedback",
      "Follow-up"
    ];
    const customTags = getCustomReasons().map((r) => r.name);
    const allTags = [...builtInTags, ...customTags];
    const selectedTags = existingNote ? existingNote.tags || [] : [];
    const getContrastColor2 = getContrastColorFn$1 || ((c) => "#fff");
    const tagOptions = allTags.map((tag) => {
      const customReason = getCustomReasons().find(
        (r) => r.name.toLowerCase() === tag.toLowerCase()
      );
      const color = customReason ? customReason.color : REASON_COLORS[tag.toLowerCase()] || "#6b7280";
      const isSelected = selectedTags.includes(tag);
      return '<span class="xcb-tag-option' + (isSelected ? " selected" : "") + '" data-tag="' + tag + '" style="background: ' + color + "; color: " + getContrastColor2(color) + ';">' + tag + "</span>";
    }).join("");
    notePopup.innerHTML = "<h4>" + (editNoteId ? "Edit Note" : '<i class="ph-bold ph-note-pencil"></i> Save Note') + " - " + (username || "Manual Note") + '</h4><div class="xcb-note-comment-preview">"' + (commentText || "") + '"</div><div style="margin-bottom: 8px;"><label style="font-size: 11px; color: #888;">Tags (click to select):</label></div><div class="xcb-tag-selector">' + tagOptions + '</div><textarea id="xcbNotePopupText" placeholder="Your notes about this comment...">' + (existingNote ? existingNote.note : "") + '</textarea><div style="font-size: 10px; color: #666; margin-bottom: 10px;">Source: ' + (sourceUrl ? '<a href="' + sourceUrl + '" target="_blank" style="color: #8b5cf6;">' + sourceUrl.substring(0, 50) + "...</a>" : "Current page") + '</div><div class="xcb-note-btns"><button id="xcbNotePopupCancel" class="xcb-edit-btn">Cancel</button><button id="xcbNotePopupSave" class="xcb-add-btn" style="background: #8b5cf6;">' + (editNoteId ? "Update Note" : "Save Note") + "</button></div>";
    notePopup.querySelectorAll(".xcb-tag-option").forEach((tagEl) => {
      tagEl.onclick = (e) => {
        e.stopPropagation();
        tagEl.classList.toggle("selected");
      };
    });
    notePopup.querySelector("#xcbNotePopupCancel").onclick = (e) => {
      e.stopPropagation();
      hideNotePopup();
    };
    notePopup.querySelector("#xcbNotePopupSave").onclick = (e) => {
      e.stopPropagation();
      const noteText = notePopup.querySelector("#xcbNotePopupText").value.trim();
      const selectedTagEls = notePopup.querySelectorAll(".xcb-tag-option.selected");
      const tags = Array.from(selectedTagEls).map((el) => el.dataset.tag);
      if (editNoteId) {
        updateNote(editNoteId, {
          note: noteText,
          tags
        });
      } else {
        addNote(username || "Unknown", commentText, noteText, tags, sourceUrl);
      }
      hideNotePopup();
      const notesTabActive = document.querySelector(
        '.xcb-tab[data-tab="notes"].active, .xcb-tab.active[data-tab="notes"]'
      );
      const panelOpen = document.querySelector(".xcb-overlay");
      if (panelOpen && notesTabActive && showManagementPanelFn) {
        const overlay = document.querySelector(".xcb-overlay");
        const panel = overlay == null ? void 0 : overlay.nextElementSibling;
        if (overlay && panel) {
          overlay.remove();
          panel.remove();
          showManagementPanelFn("notes");
        }
      }
      const successMsg = document.createElement("div");
      successMsg.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #8b5cf6; color: #fff; padding: 10px 20px; border-radius: 8px; z-index: 100003; font-size: 14px;";
      successMsg.textContent = editNoteId ? "Note updated!" : "Note saved!";
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 2e3);
    };
    notePopup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(notePopup);
  }
  function hideNotePopup() {
    if (notePopup) {
      notePopup.remove();
      notePopup = null;
    }
  }
  function showNoteSectionPicker(triggerElement, noteId) {
    hideSectionPicker();
    const sections = getNoteSections();
    const note = getNotes().find((n) => n.id === noteId);
    if (!note) return;
    const rect = triggerElement.getBoundingClientRect();
    const popup = document.createElement("div");
    popup.className = `xcb-section-picker-popup ${getPopupThemeClass()}`;
    popup.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 5}px;
    left: ${rect.left}px;
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 1px solid #8b5cf6;
    border-radius: 8px;
    padding: 10px;
    z-index: 100015;
    min-width: 200px;
    max-width: 300px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;
    const renderOptions = (parentId = null, depth = 0) => {
      const children = sections.filter((s) => s.parentId === parentId).sort((a, b) => a.order - b.order);
      return children.map((section) => {
        const prefix = getSectionPrefix(section.level, section.order);
        const isSelected = note.sectionId === section.id;
        const indent = depth * 12;
        return `
          <div class="xcb-section-option" data-section-id="${section.id}" style="padding: 8px 10px; margin-left: ${indent}px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; ${isSelected ? "background: #8b5cf640;" : ""}" onmouseover="this.style.background='#2a2a3e'" onmouseout="this.style.background='${isSelected ? "#8b5cf640" : ""}'">
            <span style="color: ${section.color}; font-weight: bold; font-size: 11px;">${prefix}</span>
            <span style="color: #e0e0e0; font-size: 12px;">${section.name}</span>
            ${isSelected ? '<span style="color: #8b5cf6; font-size: 10px; margin-left: auto;"><i class="ph-bold ph-check"></i></span>' : ""}
          </div>
          ${renderOptions(section.id, depth + 1)}
        `;
      }).join("");
    };
    popup.innerHTML = `
    <div style="font-size: 11px; color: #888; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333;">Move note to section:</div>
    <div class="xcb-section-option" data-section-id="" style="padding: 8px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; ${!note.sectionId ? "background: #8b5cf640;" : ""}" onmouseover="this.style.background='#2a2a3e'" onmouseout="this.style.background='${!note.sectionId ? "#8b5cf640" : ""}'">
      <span style="color: #666; font-size: 12px;"><i class="ph-bold ph-clipboard-text"></i> Unsectioned</span>
      ${!note.sectionId ? '<span style="color: #8b5cf6; font-size: 10px; margin-left: auto;"><i class="ph-bold ph-check"></i></span>' : ""}
    </div>
    ${sections.length === 0 ? '<div style="padding: 15px; text-align: center; color: #666; font-size: 11px;">No sections created yet.<br>Add sections from the Notes tab.</div>' : renderOptions()}
  `;
    popup.querySelectorAll(".xcb-section-option").forEach((opt) => {
      opt.onclick = () => {
        const sectionId = opt.dataset.sectionId || null;
        moveNoteToSection(noteId, sectionId);
        hideSectionPicker();
        if (showManagementPanelFn) showManagementPanelFn("notes");
      };
    });
    setTimeout(() => {
      document.addEventListener("click", hideSectionPicker, { once: true });
    }, 10);
    popup.onclick = (e) => e.stopPropagation();
    sectionPickerPopup = popup;
    document.body.appendChild(popup);
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.right > window.innerWidth - 10) {
      popup.style.left = window.innerWidth - popupRect.width - 10 + "px";
    }
    if (popupRect.bottom > window.innerHeight - 10) {
      popup.style.top = rect.top - popupRect.height - 5 + "px";
    }
  }
  function hideSectionPicker() {
    if (sectionPickerPopup) {
      sectionPickerPopup.remove();
      sectionPickerPopup = null;
    }
  }
  function showSectionEditPopup(sectionId, parentId) {
    hideSectionEditPopup();
    const sections = getNoteSections();
    const existingSection = sectionId ? sections.find((s) => s.id === sectionId) : null;
    const parentSection = parentId ? sections.find((s) => s.id === parentId) : null;
    const isEditing = !!existingSection;
    const level = existingSection ? existingSection.level : parentSection ? parentSection.level + 1 : 0;
    const levelLabels = [
      "Main Section (1.)",
      "Subsection (A.)",
      "Sub-subsection (a.)",
      "Item (i.)"
    ];
    const presetColors = [
      "#8b5cf6",
      "var(--xcb-primary)",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
      "#06b6d4",
      "#84cc16"
    ];
    const popup = document.createElement("div");
    popup.className = "xcb-section-edit-popup";
    popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    padding: 20px;
    z-index: 100016;
    min-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  `;
    popup.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #8b5cf6; font-size: 16px;">${isEditing ? '<i class="ph-bold ph-pencil-simple"></i> Edit Section' : '<i class="ph-bold ph-folder-plus"></i> Add New Section'}</h3>
    ${parentSection ? `<div style="font-size: 11px; color: #888; margin-bottom: 10px;">Parent: <span style="color: ${parentSection.color};">${getSectionPrefix(parentSection.level, parentSection.order)} ${parentSection.name}</span></div>` : ""}
    <div style="font-size: 11px; color: #666; margin-bottom: 15px;">Level: ${levelLabels[level] || "Unknown"}</div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Section Name:</label>
      <input type="text" id="xcbSectionName" value="${(existingSection == null ? void 0 : existingSection.name) || ""}" placeholder="e.g., Important Notes, Bug Reports..." style="width: 100%; padding: 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid #444; color: #fff; border-radius: 6px; font-size: 13px; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Color:</label>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        ${presetColors.map(
      (color) => `
            <button class="xcb-section-color-btn" data-color="${color}" style="width: 32px; height: 32px; border-radius: 50%; background: ${color}; border: 3px solid ${((existingSection == null ? void 0 : existingSection.color) || "#8b5cf6") === color ? "#fff" : "transparent"}; cursor: pointer; transition: border 0.2s;"></button>
          `
    ).join("")}
        <div style="position: relative; width: 32px; height: 32px;">
          <input type="color" id="xcbSectionCustomColor" value="${(existingSection == null ? void 0 : existingSection.color) || "#8b5cf6"}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
          <div id="xcbSectionCustomColorBtn" style="width: 32px; height: 32px; border-radius: 50%; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); border: 3px solid ${!presetColors.includes((existingSection == null ? void 0 : existingSection.color) || "") && (existingSection == null ? void 0 : existingSection.color) ? "#fff" : "transparent"}; cursor: pointer; pointer-events: none;"></div>
        </div>
      </div>
      <div id="xcbCustomColorPreview" style="margin-top: 8px; display: ${!presetColors.includes((existingSection == null ? void 0 : existingSection.color) || "") && (existingSection == null ? void 0 : existingSection.color) ? "flex" : "none"}; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: #888;">Custom:</span>
        <div id="xcbCustomColorSwatch" style="width: 20px; height: 20px; border-radius: 4px; background: ${(existingSection == null ? void 0 : existingSection.color) || "#8b5cf6"}; border: 1px solid #555;"></div>
        <span id="xcbCustomColorHex" style="font-size: 11px; color: #aaa; font-family: monospace;">${(existingSection == null ? void 0 : existingSection.color) || "#8b5cf6"}</span>
      </div>
      <input type="hidden" id="xcbSectionColor" value="${(existingSection == null ? void 0 : existingSection.color) || "#8b5cf6"}">
    </div>

    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
      <button id="xcbSectionCancel" style="padding: 10px 20px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer;">Cancel</button>
      <button id="xcbSectionSave" style="padding: 10px 20px; background: #8b5cf6; border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; border-radius: 6px; cursor: pointer; font-weight: bold;">${isEditing ? "Save Changes" : "Add Section"}</button>
    </div>
  `;
    popup.querySelectorAll(".xcb-section-color-btn").forEach((btn) => {
      btn.onclick = () => {
        popup.querySelectorAll(".xcb-section-color-btn").forEach((b) => b.style.border = "3px solid transparent");
        btn.style.border = "3px solid #fff";
        document.getElementById("xcbSectionColor").value = btn.dataset.color;
        document.getElementById("xcbCustomColorPreview").style.display = "none";
        document.getElementById("xcbSectionCustomColorBtn").style.border = "3px solid transparent";
      };
    });
    const customColorInput = popup.querySelector("#xcbSectionCustomColor");
    customColorInput.oninput = (e) => {
      const color = e.target.value;
      popup.querySelectorAll(".xcb-section-color-btn").forEach((b) => b.style.border = "3px solid transparent");
      document.getElementById("xcbSectionCustomColorBtn").style.border = "3px solid #fff";
      document.getElementById("xcbSectionColor").value = color;
      const preview = document.getElementById("xcbCustomColorPreview");
      preview.style.display = "flex";
      document.getElementById("xcbCustomColorSwatch").style.background = color;
      document.getElementById("xcbCustomColorHex").textContent = color.toUpperCase();
    };
    popup.querySelector("#xcbSectionCancel").onclick = () => {
      hideSectionEditPopup();
    };
    popup.querySelector("#xcbSectionSave").onclick = () => {
      const name = document.getElementById("xcbSectionName").value.trim();
      const color = document.getElementById("xcbSectionColor").value;
      if (!name) {
        alert("Please enter a section name.");
        return;
      }
      if (isEditing && sectionId) {
        updateNoteSection(sectionId, { name, color });
      } else {
        addNoteSection(name, parentId, color);
      }
      hideSectionEditPopup();
      if (showManagementPanelFn) showManagementPanelFn("notes");
    };
    const overlay = document.createElement("div");
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 100015;
  `;
    overlay.onclick = hideSectionEditPopup;
    sectionEditPopup = { popup, overlay };
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.getElementById("xcbSectionName").focus();
  }
  function hideSectionEditPopup() {
    if (sectionEditPopup) {
      sectionEditPopup.popup.remove();
      sectionEditPopup.overlay.remove();
      sectionEditPopup = null;
    }
  }
  function showRequestEditPopup(requestId) {
    hideRequestEditPopup();
    const req = getRequests().find((r) => r.id === requestId);
    if (!req) return;
    requestEditPopup = document.createElement("div");
    requestEditPopup.className = "xcb-request-edit-popup";
    requestEditPopup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #f59e0b;
    border-radius: 12px;
    padding: 20px;
    z-index: 100002;
    min-width: 450px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  `;
    const checklist = req.checklist || [];
    let editedChecklist = checklist.map((item) => ({ ...item }));
    function renderChecklistHtml() {
      if (editedChecklist.length === 0) {
        return '<div style="color: #666; font-size: 12px; padding: 5px;">No sub-tasks yet</div>';
      }
      return editedChecklist.map(
        (item, index) => `
        <div class="xcb-edit-checklist-item" data-index="${index}" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--xcb-panel-bg, #1a1a2e); border-radius: 4px; margin-bottom: 6px;">
          <input type="checkbox" ${item.completed ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
          <input type="text" value="${item.text.replace(/"/g, "&quot;")}" style="flex: 1; padding: 6px 8px; background: #333; border: 1px solid #555; color: #fff; border-radius: 4px; font-size: 12px;">
          <button class="xcb-edit-checklist-delete" data-index="${index}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 2px 6px;" title="Delete sub-task">×</button>
        </div>
      `
      ).join("");
    }
    requestEditPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #f59e0b; font-size: 16px;">Edit Request</h3>
      <span style="color: #888; font-size: 12px;">from ${req.username}</span>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Request Text:</label>
      <textarea id="xcbEditRequestText" style="
        width: 100%;
        min-height: 120px;
        padding: 10px;
        background: var(--xcb-section-bg, #2a2a3e);
        border: 1px solid #444;
        color: #fff;
        border-radius: 6px;
        font-size: 13px;
        resize: vertical;
        box-sizing: border-box;
      ">${req.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 12px;">Sub-tasks (${checklist.length}):</label>
      <div id="xcbEditChecklist" style="background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; padding: 10px;">
        ${renderChecklistHtml()}
      </div>
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <input type="text" id="xcbNewSubtaskText" placeholder="Add new sub-task..." style="flex: 1; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px;">
        <button id="xcbAddSubtaskBtn" style="background: #22c55e; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">+ Add</button>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">
      <button id="xcbEditRequestCancel" class="xcb-cancel-btn">Cancel</button>
      <button id="xcbEditRequestSave" style="background: #f59e0b; color: #000; border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">Save Changes</button>
    </div>
  `;
    function refreshChecklistUI() {
      const container = requestEditPopup.querySelector("#xcbEditChecklist");
      container.innerHTML = renderChecklistHtml();
      attachChecklistHandlers();
    }
    function attachChecklistHandlers() {
      requestEditPopup.querySelectorAll(".xcb-edit-checklist-delete").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.index);
          editedChecklist.splice(index, 1);
          refreshChecklistUI();
        };
      });
      requestEditPopup.querySelectorAll('.xcb-edit-checklist-item input[type="checkbox"]').forEach((cb, index) => {
        cb.onchange = () => {
          editedChecklist[index].completed = cb.checked;
        };
      });
      requestEditPopup.querySelectorAll('.xcb-edit-checklist-item input[type="text"]').forEach((input, index) => {
        input.oninput = () => {
          editedChecklist[index].text = input.value;
        };
      });
    }
    attachChecklistHandlers();
    const addSubtaskBtn = requestEditPopup.querySelector("#xcbAddSubtaskBtn");
    const newSubtaskInput = requestEditPopup.querySelector("#xcbNewSubtaskText");
    addSubtaskBtn.onclick = () => {
      const text = newSubtaskInput.value.trim();
      if (text) {
        editedChecklist.push({
          id: "chk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          text,
          completed: false
        });
        newSubtaskInput.value = "";
        refreshChecklistUI();
      }
    };
    newSubtaskInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSubtaskBtn.click();
      }
    };
    requestEditPopup.querySelector("#xcbEditRequestCancel").onclick = () => {
      hideRequestEditPopup();
    };
    requestEditPopup.querySelector("#xcbEditRequestSave").onclick = () => {
      const newText = requestEditPopup.querySelector("#xcbEditRequestText").value.trim();
      if (newText) {
        updateRequest(requestId, {
          text: newText,
          checklist: editedChecklist.filter((item) => item.text.trim())
        });
        hideRequestEditPopup();
        const panelOpen = document.querySelector(".xcb-overlay");
        if (panelOpen && showManagementPanelFn) {
          const overlay = document.querySelector(".xcb-overlay");
          const panel = overlay == null ? void 0 : overlay.nextElementSibling;
          if (overlay && panel) {
            overlay.remove();
            panel.remove();
            showManagementPanelFn("requests");
          }
        }
        const successMsg = document.createElement("div");
        successMsg.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #f59e0b; color: #000; padding: 10px 20px; border-radius: 8px; z-index: 100003; font-size: 14px; font-weight: bold;";
        successMsg.textContent = "Request updated!";
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2e3);
      }
    };
    requestEditPopup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(requestEditPopup);
  }
  function hideRequestEditPopup() {
    if (requestEditPopup) {
      requestEditPopup.remove();
      requestEditPopup = null;
    }
  }
  function showNoteSubtaskPopup(noteId, parentPath = [], _triggerElement = null) {
    hideNoteSubtaskPopup();
    const note = getNotes().find((n) => n.id === noteId);
    if (!note) return;
    const isNested = parentPath.length > 0;
    const titleText = isNested ? "Add Nested Sub-task" : "Add Sub-task";
    noteSubtaskPopup = document.createElement("div");
    noteSubtaskPopup.className = "xcb-note-subtask-popup";
    noteSubtaskPopup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    padding: 20px;
    z-index: 100002;
    min-width: 380px;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  `;
    noteSubtaskPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #8b5cf6; font-size: 16px;">${titleText}</h3>
      <button id="xcbNoteSubtaskClose" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
    </div>
    <div style="margin-bottom: 10px; color: #888; font-size: 12px;">
      Note: ${(note.username || "Unknown").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </div>
    <div style="margin-bottom: 15px;">
      <input type="text" id="xcbNoteSubtaskInput" placeholder="Enter sub-task text..." style="
        width: 100%;
        padding: 12px;
        background: var(--xcb-section-bg, #2a2a3e);
        border: 1px solid #444;
        color: #fff;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
      " autofocus>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button id="xcbNoteSubtaskCancel" class="xcb-cancel-btn">Cancel</button>
      <button id="xcbNoteSubtaskAdd" style="background: #8b5cf6; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">Add Sub-task</button>
    </div>
  `;
    setTimeout(() => {
      const input = noteSubtaskPopup.querySelector("#xcbNoteSubtaskInput");
      if (input) input.focus();
    }, 50);
    noteSubtaskPopup.querySelector("#xcbNoteSubtaskCancel").onclick = () => hideNoteSubtaskPopup();
    noteSubtaskPopup.querySelector("#xcbNoteSubtaskClose").onclick = () => hideNoteSubtaskPopup();
    noteSubtaskPopup.querySelector("#xcbNoteSubtaskAdd").onclick = () => {
      const input = noteSubtaskPopup.querySelector("#xcbNoteSubtaskInput");
      const text = input.value.trim();
      if (text) {
        addNoteSubtask(noteId, text, parentPath);
        hideNoteSubtaskPopup();
        const panelOpen = document.querySelector(".xcb-overlay");
        if (panelOpen && showManagementPanelFn) {
          showManagementPanelFn("notes");
        }
        const successMsg = document.createElement("div");
        successMsg.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #8b5cf6; color: #fff; padding: 10px 20px; border-radius: 8px; z-index: 100003; font-size: 14px;";
        successMsg.textContent = "Sub-task added!";
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2e3);
      }
    };
    noteSubtaskPopup.querySelector("#xcbNoteSubtaskInput").onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        noteSubtaskPopup.querySelector("#xcbNoteSubtaskAdd").click();
      }
    };
    noteSubtaskPopup.onkeydown = (e) => {
      if (e.key === "Escape") {
        hideNoteSubtaskPopup();
      }
    };
    noteSubtaskPopup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(noteSubtaskPopup);
  }
  function hideNoteSubtaskPopup() {
    if (noteSubtaskPopup) {
      noteSubtaskPopup.remove();
      noteSubtaskPopup = null;
    }
  }
  function showNoteEditPopup(noteId) {
    hideNoteEditPopup();
    const note = getNotes().find((n) => n.id === noteId);
    if (!note) return;
    noteEditPopup = document.createElement("div");
    noteEditPopup.className = "xcb-note-edit-popup";
    noteEditPopup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    padding: 20px;
    z-index: 100002;
    min-width: 500px;
    max-width: 650px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  `;
    const subtasks = note.subtasks || [];
    const tags = note.tags || [];
    const allTags = getAllNoteTagsFn ? getAllNoteTagsFn() : [];
    const getContrastColor2 = getContrastColorFn$1 || ((c) => "#fff");
    function deepCopySubtasks(subtaskList) {
      if (!subtaskList) return [];
      return subtaskList.map((st) => ({
        ...st,
        subtasks: deepCopySubtasks(st.subtasks)
      }));
    }
    let editedSubtasks = deepCopySubtasks(subtasks);
    let editedTags = [...tags];
    function findSubtaskById(list, id) {
      for (const st of list) {
        if (st.id === id) return st;
        if (st.subtasks) {
          const found = findSubtaskById(st.subtasks, id);
          if (found) return found;
        }
      }
      return null;
    }
    function deleteSubtaskById(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1);
          return true;
        }
        if (list[i].subtasks && deleteSubtaskById(list[i].subtasks, id)) {
          return true;
        }
      }
      return false;
    }
    function renderSubtaskList(subtaskList, level = 0) {
      if (!subtaskList || subtaskList.length === 0) return "";
      const indent = level * 20;
      return subtaskList.map((st) => {
        const nestedHtml = st.subtasks ? renderSubtaskList(st.subtasks, level + 1) : "";
        return `
          <div class="xcb-edit-subtask-item" data-id="${st.id}" data-level="${level}" style="margin-left: ${indent}px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; margin-bottom: 4px;">
              <input type="checkbox" class="xcb-edit-subtask-check" ${st.completed ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
              <input type="text" class="xcb-edit-subtask-text" value="${(st.text || "").replace(/"/g, "&quot;")}" style="flex: 1; padding: 6px 8px; background: #333; border: 1px solid #555; color: ${st.completed ? "#666" : "#fff"}; border-radius: 4px; font-size: 12px; ${st.completed ? "text-decoration: line-through;" : ""}">
              ${level < 2 ? `<button class="xcb-edit-subtask-add-nested" data-id="${st.id}" style="background: transparent; border: none; color: #8b5cf6; cursor: pointer; font-size: 14px; padding: 2px 6px;" title="Add nested sub-task">➕</button>` : ""}
              <button class="xcb-edit-subtask-delete" data-id="${st.id}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 2px 6px;" title="Delete sub-task">&times;</button>
            </div>
            ${nestedHtml}
          </div>
        `;
      }).join("");
    }
    const tagOptions = allTags.map((tag) => {
      const customReason = getCustomReasons().find(
        (r) => r.name.toLowerCase() === tag.toLowerCase()
      );
      const color = customReason ? customReason.color : REASON_COLORS[tag.toLowerCase()] || "#6b7280";
      const isSelected = tags.includes(tag);
      return `<span class="xcb-edit-tag-option${isSelected ? " selected" : ""}" data-tag="${tag}" style="
        background: ${isSelected ? color : "transparent"};
        color: ${isSelected ? getContrastColor2(color) : color};
        border: 1px solid ${color};
        padding: 3px 8px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      ">${tag}</span>`;
    }).join("");
    noteEditPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #8b5cf6; font-size: 16px;">Edit Note</h3>
      <span style="color: #888; font-size: 12px;">from ${(note.username || "Unknown").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Original Comment:</label>
      <div style="background: var(--xcb-section-bg, #2a2a3e); padding: 10px; border-radius: 6px; font-size: 12px; color: #888; font-style: italic; max-height: 80px; overflow-y: auto; white-space: pre-wrap; word-break: break-word;">"${(note.commentText || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}"</div>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Tags (click to toggle):</label>
      <div id="xcbEditNoteTags" style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${tagOptions}
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;">Your Notes:</label>
      <textarea id="xcbEditNoteText" style="
        width: 100%;
        min-height: 100px;
        padding: 10px;
        background: var(--xcb-section-bg, #2a2a3e);
        border: 1px solid #444;
        color: #fff;
        border-radius: 6px;
        font-size: 13px;
        resize: vertical;
        box-sizing: border-box;
      ">${(note.note || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
    </div>

    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 12px;">Sub-tasks (${subtasks.length}):</label>
      <div id="xcbEditNoteSubtasks" style="background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid #333; border-radius: 6px; padding: 10px; max-height: 200px; overflow-y: auto;">
        ${subtasks.length === 0 ? '<div style="color: #666; font-size: 12px; padding: 5px;">No sub-tasks yet</div>' : renderSubtaskList(editedSubtasks)}
      </div>
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <input type="text" id="xcbNewNoteSubtaskText" placeholder="Add new sub-task..." style="flex: 1; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px;">
        <button id="xcbAddNoteSubtaskBtn" style="background: #22c55e; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">+ Add</button>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">
      <button id="xcbEditNoteCancel" class="xcb-cancel-btn">Cancel</button>
      <button id="xcbEditNoteSave" style="background: #8b5cf6; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">Save Changes</button>
    </div>
  `;
    function refreshSubtasksUI() {
      const container = noteEditPopup.querySelector("#xcbEditNoteSubtasks");
      if (editedSubtasks.length === 0) {
        container.innerHTML = '<div style="color: #666; font-size: 12px; padding: 5px;">No sub-tasks yet</div>';
      } else {
        container.innerHTML = renderSubtaskList(editedSubtasks);
      }
      attachSubtaskHandlers();
    }
    function attachSubtaskHandlers() {
      noteEditPopup.querySelectorAll(".xcb-edit-subtask-check").forEach((cb) => {
        cb.onchange = () => {
          const itemEl = cb.closest(".xcb-edit-subtask-item");
          const id = itemEl.dataset.id;
          const st = findSubtaskById(editedSubtasks, id);
          if (st) {
            st.completed = cb.checked;
            const textInput = itemEl.querySelector(".xcb-edit-subtask-text");
            if (textInput) {
              textInput.style.color = cb.checked ? "#666" : "#fff";
              textInput.style.textDecoration = cb.checked ? "line-through" : "none";
            }
          }
        };
      });
      noteEditPopup.querySelectorAll(".xcb-edit-subtask-text").forEach((input) => {
        input.oninput = () => {
          const itemEl = input.closest(".xcb-edit-subtask-item");
          const id = itemEl.dataset.id;
          const st = findSubtaskById(editedSubtasks, id);
          if (st) {
            st.text = input.value;
          }
        };
      });
      noteEditPopup.querySelectorAll(".xcb-edit-subtask-delete").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          deleteSubtaskById(editedSubtasks, id);
          refreshSubtasksUI();
        };
      });
      noteEditPopup.querySelectorAll(".xcb-edit-subtask-add-nested").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const parentId = btn.dataset.id;
          const parent = findSubtaskById(editedSubtasks, parentId);
          if (parent) {
            const text = "New sub-task";
            if (!parent.subtasks) parent.subtasks = [];
            parent.subtasks.push({
              id: "st_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
              text,
              completed: false,
              subtasks: []
            });
            refreshSubtasksUI();
          }
        };
      });
    }
    attachSubtaskHandlers();
    noteEditPopup.querySelectorAll(".xcb-edit-tag-option").forEach((tagEl) => {
      tagEl.onclick = () => {
        const tag = tagEl.dataset.tag;
        const customReason = getCustomReasons().find(
          (r) => r.name.toLowerCase() === tag.toLowerCase()
        );
        const color = customReason ? customReason.color : REASON_COLORS[tag.toLowerCase()] || "#6b7280";
        if (tagEl.classList.contains("selected")) {
          tagEl.classList.remove("selected");
          tagEl.style.background = "transparent";
          tagEl.style.color = color;
          editedTags = editedTags.filter((t) => t !== tag);
        } else {
          tagEl.classList.add("selected");
          tagEl.style.background = color;
          tagEl.style.color = getContrastColor2(color);
          editedTags.push(tag);
        }
      };
    });
    const addSubtaskBtn = noteEditPopup.querySelector("#xcbAddNoteSubtaskBtn");
    const newSubtaskInput = noteEditPopup.querySelector("#xcbNewNoteSubtaskText");
    addSubtaskBtn.onclick = () => {
      const text = newSubtaskInput.value.trim();
      if (text) {
        editedSubtasks.push({
          id: "st_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
          text,
          completed: false,
          subtasks: []
        });
        newSubtaskInput.value = "";
        refreshSubtasksUI();
      }
    };
    newSubtaskInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSubtaskBtn.click();
      }
    };
    noteEditPopup.querySelector("#xcbEditNoteCancel").onclick = () => {
      hideNoteEditPopup();
    };
    noteEditPopup.querySelector("#xcbEditNoteSave").onclick = () => {
      const newNoteText = noteEditPopup.querySelector("#xcbEditNoteText").value;
      updateNote(noteId, {
        note: newNoteText,
        tags: editedTags,
        subtasks: editedSubtasks.filter((st) => st.text.trim())
      });
      hideNoteEditPopup();
      const panelOpen = document.querySelector(".xcb-overlay");
      if (panelOpen && showManagementPanelFn) {
        showManagementPanelFn("notes");
      }
      const successMsg = document.createElement("div");
      successMsg.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #8b5cf6; color: #fff; padding: 10px 20px; border-radius: 8px; z-index: 100003; font-size: 14px; font-weight: bold;";
      successMsg.textContent = "Note updated!";
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 2e3);
    };
    noteEditPopup.onkeydown = (e) => {
      if (e.key === "Escape") {
        hideNoteEditPopup();
      }
    };
    noteEditPopup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(noteEditPopup);
  }
  function hideNoteEditPopup() {
    if (noteEditPopup) {
      noteEditPopup.remove();
      noteEditPopup = null;
    }
  }
  function showBackupHistoryPopup() {
    hideBackupHistoryPopup();
    const backupHistoryData = getBackupHistory();
    if (backupHistoryData.length === 0) return;
    const overlay = document.createElement("div");
    overlay.className = "xcb-backup-history-overlay";
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 100010;
  `;
    const popup = document.createElement("div");
    popup.className = "xcb-backup-history-popup";
    popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    padding: 20px;
    z-index: 100011;
    min-width: 450px;
    max-width: 550px;
    max-height: 70vh;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  `;
    popup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #8b5cf6; font-size: 16px;">📂 Auto-Backup History</h3>
      <button id="xcbBackupHistoryClose" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
    </div>
    <p style="font-size: 11px; color: #888; margin-bottom: 15px;">
      Backups are stored in TamperMonkey's local storage. Up to 5 backups are kept automatically.
    </p>
    <div style="max-height: 300px; overflow-y: auto; border: 1px solid #333; border-radius: 6px;">
      ${backupHistoryData.map(
      (backup, index) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #333; ${index === 0 ? "background: var(--xcb-section-bg, #2a2a3e);" : ""}">
            <div>
              <div style="color: ${index === 0 ? "#8b5cf6" : "#ccc"}; font-size: 12px; font-weight: ${index === 0 ? "600" : "400"};">
                ${index === 0 ? "★ Most Recent" : "Backup #" + (index + 1)}
              </div>
              <div style="color: #888; font-size: 11px; margin-top: 2px;">
                ${new Date(backup.date).toLocaleString()}
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="xcb-popup-backup-download" data-index="${index}" style="background: var(--xcb-primary); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Download</button>
              <button class="xcb-popup-backup-restore" data-index="${index}" style="background: #10b981; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Restore</button>
            </div>
          </div>
        `
    ).join("")}
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
      <button id="xcbPopupClearHistory" style="background: #ef4444; color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear All Backups</button>
      <button id="xcbBackupHistoryDone" class="xcb-cancel-btn">Done</button>
    </div>
  `;
    overlay.onclick = hideBackupHistoryPopup;
    popup.querySelector("#xcbBackupHistoryClose").onclick = hideBackupHistoryPopup;
    popup.querySelector("#xcbBackupHistoryDone").onclick = hideBackupHistoryPopup;
    popup.querySelectorAll(".xcb-popup-backup-download").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        downloadBackupFromHistory(index);
      };
    });
    popup.querySelectorAll(".xcb-popup-backup-restore").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        if (confirm("Restore this backup? Your current data will be replaced.")) {
          try {
            if (restoreFromBackupHistoryFn$1) {
              restoreFromBackupHistoryFn$1(index);
            }
            hideBackupHistoryPopup();
            alert("Backup restored successfully! The page will reload.");
            window.location.reload();
          } catch (err) {
            alert("Error restoring backup: " + err.message);
          }
        }
      };
    });
    popup.querySelector("#xcbPopupClearHistory").onclick = (e) => {
      e.stopPropagation();
      if (confirm("Clear all auto-backup history? This cannot be undone.")) {
        GM_setValue("backupHistory", []);
        hideBackupHistoryPopup();
        const panelOpen = document.querySelector(".xcb-overlay");
        if (panelOpen && showManagementPanelFn) {
          showManagementPanelFn("settings");
        }
      }
    };
    popup.onclick = (e) => e.stopPropagation();
    backupHistoryPopup = { popup, overlay };
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  }
  function hideBackupHistoryPopup() {
    if (backupHistoryPopup) {
      backupHistoryPopup.popup.remove();
      backupHistoryPopup.overlay.remove();
      backupHistoryPopup = null;
    }
  }
  function checkPopupsOnClick(e) {
    if (requestPopup && !requestPopup.contains(e.target) && !e.target.closest(".xcb-add-request-btn") && !e.target.closest(".xcb-context-item")) {
      hideRequestPopup();
    }
    if (notePopup && !notePopup.contains(e.target) && !e.target.closest(".xcb-add-note-btn") && !e.target.closest(".xcb-context-item")) {
      hideNotePopup();
    }
  }
  function renderBlockTab(data) {
    const { initialTab, blocklistArr, settings, customReasons, formatDateTime: formatDateTime2, formatNoteDisplay: formatNoteDisplay2 } = data;
    return `
            <!-- BLOCK TAB -->
            <div id="xcbBlockTab" class="xcb-tab-content ${initialTab === "block" ? "xcb-tab-content-active" : ""}">
                <button class="xcb-help-toggle" id="xcbBlockHelp">? Help</button>
                <div id="xcbBlockHelpBox" class="xcb-help-box" style="display: none;">
                    <h4>Block Types</h4>
                    <ul>
                        <li><strong style="color: ${HIGHLIGHT_COLOR};">Hard Block:</strong> Hides comments completely. Only shows Undo (<i class="ph-bold ph-arrow-counter-clockwise"></i>) and Show/Hide buttons - no reply options or context menu. Best for spammers/trolls you want to ignore completely.</li>
                        <li><strong style="color: ${HIGHLIGHT_COLOR};">Soft Block:</strong> Highlights name in red but shows comments. Full interaction options remain available. Good for users to watch.</li>
                        <li><strong style="color: var(--xcb-accent-warning, #f59e0b);">Temporary Block:</strong> Auto-expires after 1, 7, or 30 days.</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Quick Actions</h4>
                    <ul>
                        <li><strong>Quick Block:</strong> Shift + Right-click username → select "Block" to block instantly</li>
                        <li><strong>Multiple Tags:</strong> Add tags separated by commas (e.g., "spammer, rude"). Only first 2 tags shown inline.</li>
                        <li><strong>Context Menu:</strong> Shift + Right-click any username for quick block/trust options (not available for hard-blocked users)</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Filtering & Sorting</h4>
                    <ul>
                        <li><strong>Tag Filters:</strong> Click tags above the list to filter. Click multiple for AND logic.</li>
                        <li><strong>Search:</strong> Type in the search box to find users by username or notes.</li>
                        <li><strong>Sort:</strong> Use dropdown to sort by recent, oldest, A-Z, Z-A, or most hidden.</li>
                    </ul>
                    <p style="margin-top: 8px;"><strong>Tip:</strong> Click "Edit" next to any user to change their tags or block settings.</p>
                </div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                    <input type="text" id="xcbNewBlockUser" placeholder="Username..." style="flex: 1; min-width: 100px;">
                    <input type="text" id="xcbNewBlockNote" placeholder="Note (e.g., 'spammer', 'rude')" style="flex: 1; min-width: 100px;">
                    <select id="xcbNewBlockLevel" title="Hard = hide comments, Soft = highlight only">
                        <option value="hard">Hard Block</option>
                        <option value="soft">Soft Block</option>
                    </select>
                    <select id="xcbNewBlockExpiry" title="When should this block expire?">
                        <option value="">Permanent</option>
                        <option value="1">1 day</option>
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                    </select>
                    <button class="xcb-add-btn" id="xcbAddBlockUser"><i class="ph-bold ph-prohibit"></i> Block</button>
                    <button class="xcb-io-btn" id="xcbExportBlocklist" title="Export block list"><i class="ph-bold ph-file-arrow-up"></i> Export</button>
                    <label class="xcb-io-btn" title="Import block list">
                        <i class="ph-bold ph-file-arrow-down"></i> Import
                        <input type="file" id="xcbImportBlocklist" accept=".json,.txt" style="display: none;">
                    </label>
                </div>
                <div class="xcb-reason-presets" id="xcbBlockPresets" style="border-top: none; padding-top: 0; margin-top: -5px; margin-bottom: 10px;">
                    <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; width: 100%; margin-bottom: 4px;">Quick tags:</span>
                    ${BLOCK_REASON_PRESETS.map(
      (reason) => `<span class="xcb-reason-preset xcb-block-preset" data-reason="${reason}" style="border-color: ${HIGHLIGHT_COLOR};">${reason}</span>`
    ).join("")}
                </div>
                <div class="xcb-tag-filters" id="xcbBlockTagFilters" style="margin-bottom: 8px;">
                    <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; margin-bottom: 4px;">Filter by tags (click multiple for AND):</span>
                    <span class="xcb-filter-tag" data-tag="__untagged__" style="border-color:#666; font-style: italic;">Untagged</span>
                    ${BLOCK_REASON_PRESETS.map(
      (tag) => `<span class="xcb-filter-tag" data-tag="${tag.toLowerCase()}">${tag}</span>`
    ).join("")}
                    ${customReasons.map(
      (r) => `<span class="xcb-filter-tag" data-tag="${r.name.toLowerCase()}" style="border-color:${r.color};">${r.name}</span>`
    ).join("")}
                    <button class="xcb-clear-filters" id="xcbClearBlockFilters" style="font-size: 10px; padding: 2px 6px; margin-left: 5px; display: none;">Clear</button>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                    <input type="text" id="xcbSearchBlock" placeholder="Search by username or note..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                    <select id="xcbBlockSortOrder" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;" title="Sort order">
                        <option value="recent" ${settings.blocklistSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                        <option value="oldest" ${settings.blocklistSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                        <option value="alpha-asc" ${settings.blocklistSortOrder === "alpha-asc" ? "selected" : ""}>A → Z</option>
                        <option value="alpha-desc" ${settings.blocklistSortOrder === "alpha-desc" ? "selected" : ""}>Z → A</option>
                        <option value="most-hidden" ${settings.blocklistSortOrder === "most-hidden" ? "selected" : ""}>Most Hidden</option>
                    </select>
                </div>
                <!-- Bulk Actions Bar -->
                <div id="xcbBlockBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                        <input type="checkbox" id="xcbSelectAllBlock" style="width: 16px; height: 16px;">
                        Select All
                    </label>
                    <span id="xcbBlockSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                    <div style="flex: 1;"></div>
                    <button id="xcbBulkTagBlock" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-warning, #f59e0b); color: var(--xcb-accent-warning, #f59e0b); display: none;" title="Add tag to selected users"><i class="ph-bold ph-tag"></i> Add Tag</button>
                    <button id="xcbBulkMoveToTrust" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-success, #22c55e); color: var(--xcb-accent-success, #22c55e); display: none;" title="Move selected users to trusted list"><i class="ph-bold ph-arrow-right"></i> Move to Trust</button>
                    <button id="xcbBulkRemoveBlock" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Remove selected users from blocklist"><i class="ph-bold ph-trash"></i> Remove</button>
                </div>
                <ul id="xcbBlockList">
                    ${blocklistArr.length === 0 ? '<li style="color: var(--xcb-panel-text-muted, #888);">No users blocked</li>' : blocklistArr.map(
      (u) => `
                        <li data-username="${u.username}" data-searchable="${u.username.toLowerCase()} ${(u.note || "").toLowerCase()}" data-tags="${(u.note || "").split(/[,;]+/).map((t) => t.trim().toLowerCase()).join("|")}">
                            <div style="flex: 1; display: flex; align-items: flex-start; gap: 8px;">
                                <input type="checkbox" class="xcb-block-select" data-username="${u.username}" style="width: 16px; height: 16px; margin-top: 2px; cursor: pointer; flex-shrink: 0;">
                                <div style="flex: 1;">
                                    <a href="/user/${encodeURIComponent(u.username)}/" class="xcb-panel-link xcb-panel-link-block" target="_blank">${u.username}</a>
                                <span class="xcb-user-badge ${u.level === "hard" ? "xcb-badge-hard" : "xcb-badge-soft"}">${u.level}</span>
                                ${u.expiry ? `<span class="xcb-user-badge xcb-badge-temp">expires ${formatDateTime2(u.expiry, true)}</span>` : ""}
                                <span class="xcb-user-meta"> - ${u.hideCount || 0} comment${(u.hideCount || 0) !== 1 ? "s" : ""} hidden</span>
                                <span class="xcb-user-meta" style="color: var(--xcb-panel-text-dim, #666);"> | Added: ${u.date ? formatDateTime2(u.date, false) : "Unknown"}</span>
                                <button class="xcb-edit-btn" data-user="${u.username}" data-list="block">Edit</button>
                                <div class="xcb-user-note" id="xcbNote-block-${u.username.replace(/[^a-zA-Z0-9]/g, "_")}">${formatNoteDisplay2(u.note)}</div>
                                </div>
                            </div>
                            <button class="xcb-remove-btn" data-user="${u.username}" data-list="block">Remove</button>
                        </li>
                    `
    ).join("")}
                </ul>
            </div>`;
  }
  function renderTrustTab(data) {
    const { initialTab, trustedlistArr, settings, customReasons, formatDateTime: formatDateTime2, formatNoteDisplay: formatNoteDisplay2 } = data;
    return `
            <!-- TRUST TAB -->
            <div id="xcbTrustTab" class="xcb-tab-content ${initialTab === "trust" ? "xcb-tab-content-active" : ""}">
                <button class="xcb-help-toggle" id="xcbTrustHelp">? Help</button>
                <div id="xcbTrustHelpBox" class="xcb-help-box" style="display: none;">
                    <h4>Trusted Users</h4>
                    <ul>
                        <li><strong style="color: ${TRUSTED_COLOR};">Trusted users</strong> are highlighted in green with a checkmark <i class="ph-bold ph-check"></i></li>
                        <li>Their comments are never hidden, even if they contain blocked keywords</li>
                        <li>Use this for: fellow uploaders, helpful users, moderators, frequent requesters</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Quick Actions</h4>
                    <ul>
                        <li><strong>Hover menu:</strong> Click "Trust" on any comment to add the user</li>
                        <li><strong>Context Menu:</strong> Shift + Right-click any username → select "Trust"</li>
                        <li><strong>Quick Tag popup:</strong> After trusting, a popup appears to add tags instantly</li>
                        <li><strong>Multiple tags:</strong> Separate tags with commas (Uploader, Helpful, Friend)</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Filtering & Sorting</h4>
                    <ul>
                        <li><strong>Tag filters:</strong> Click tag buttons to filter. Multiple = AND logic.</li>
                        <li><strong>Search:</strong> Type in the search box to filter by username or notes</li>
                        <li><strong>Sort:</strong> Use dropdown to sort by recent, oldest, A-Z, or Z-A</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Quick Replies</h4>
                    <ul>
                        <li><strong>Reply button:</strong> Green "Reply" button appears next to trusted comments</li>
                        <li><strong>More options:</strong> Click "▾" to access ALL reply templates</li>
                        <li><strong>Custom templates:</strong> Edit in Settings → Quick Reply - Trusted Users</li>
                    </ul>
                    <p style="margin-top: 8px;"><strong>Auto-whitelist:</strong> Site moderators, VIPs, and trusted uploaders are automatically ignored.</p>
                </div>
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <input type="text" id="xcbNewTrustUser" placeholder="Username..." style="flex: 1;">
                    <input type="text" id="xcbNewTrustNote" placeholder="Note (e.g., 'mod', 'uploader', 'requester')" style="flex: 1;">
                    <button class="xcb-add-btn" id="xcbAddTrustUser" style="background: ${TRUSTED_COLOR};"><i class="ph-bold ph-check-circle"></i> Trust</button>
                    <button class="xcb-io-btn" id="xcbExportTrusted" title="Export trusted list"><i class="ph-bold ph-file-arrow-up"></i> Export</button>
                    <label class="xcb-io-btn" title="Import trusted list">
                        <i class="ph-bold ph-file-arrow-down"></i> Import
                        <input type="file" id="xcbImportTrusted" accept=".json,.txt" style="display: none;">
                    </label>
                </div>
                <div class="xcb-reason-presets" id="xcbTrustPresets" style="border-top: none; padding-top: 0; margin-top: -5px; margin-bottom: 10px;">
                    <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; width: 100%; margin-bottom: 4px;">Quick tags:</span>
                    ${TRUST_REASON_PRESETS.map(
      (reason) => `<span class="xcb-reason-preset xcb-trust-preset" data-reason="${reason}" style="border-color: ${TRUSTED_COLOR};">${reason}</span>`
    ).join("")}
                </div>
                <div class="xcb-tag-filters" id="xcbTrustTagFilters" style="margin-bottom: 8px;">
                    <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; margin-bottom: 4px;">Filter by tags (click multiple for AND):</span>
                    <span class="xcb-filter-tag xcb-filter-tag-trust" data-tag="__untagged__" style="border-color:#666; font-style: italic;">Untagged</span>
                    ${TRUST_REASON_PRESETS.map(
      (tag) => `<span class="xcb-filter-tag xcb-filter-tag-trust" data-tag="${tag.toLowerCase()}">${tag}</span>`
    ).join("")}
                    ${customReasons.map(
      (r) => `<span class="xcb-filter-tag xcb-filter-tag-trust" data-tag="${r.name.toLowerCase()}" style="border-color:${r.color};">${r.name}</span>`
    ).join("")}
                    <button class="xcb-clear-filters" id="xcbClearTrustFilters" style="font-size: 10px; padding: 2px 6px; margin-left: 5px; display: none;">Clear</button>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                    <input type="text" id="xcbSearchTrust" placeholder="Search by username or note..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                    <select id="xcbTrustSortOrder" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;" title="Sort order">
                        <option value="recent" ${settings.trustedlistSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                        <option value="oldest" ${settings.trustedlistSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                        <option value="alpha-asc" ${settings.trustedlistSortOrder === "alpha-asc" ? "selected" : ""}>A → Z</option>
                        <option value="alpha-desc" ${settings.trustedlistSortOrder === "alpha-desc" ? "selected" : ""}>Z → A</option>
                    </select>
                </div>
                <!-- Bulk Actions Bar -->
                <div id="xcbTrustBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                        <input type="checkbox" id="xcbSelectAllTrust" style="width: 16px; height: 16px;">
                        Select All
                    </label>
                    <span id="xcbTrustSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                    <div style="flex: 1;"></div>
                    <button id="xcbBulkTagTrust" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-success, #22c55e); color: var(--xcb-accent-success, #22c55e); display: none;" title="Add tag to selected users"><i class="ph-bold ph-tag"></i> Add Tag</button>
                    <button id="xcbBulkWhitelist" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: #fbbf24; color: #fbbf24; display: none;" title="Add to permanent whitelist (never show block/trust buttons)"><i class="ph-bold ph-star"></i> Whitelist</button>
                    <button id="xcbBulkMoveToBlock" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: ${HIGHLIGHT_COLOR}; color: ${HIGHLIGHT_COLOR}; display: none;" title="Move selected users to block list"><i class="ph-bold ph-arrow-right"></i> Move to Block</button>
                    <button id="xcbBulkRemoveTrust" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Remove selected users from trusted list"><i class="ph-bold ph-trash"></i> Remove</button>
                </div>
                <ul id="xcbTrustList">
                    ${trustedlistArr.length === 0 ? '<li style="color: var(--xcb-panel-text-muted, #888);">No trusted users</li>' : trustedlistArr.map(
      (u) => `
                        <li data-username="${u.username}" data-searchable="${u.username.toLowerCase()} ${(u.note || "").toLowerCase()}" data-tags="${(u.note || "").split(/[,;]+/).map((t) => t.trim().toLowerCase()).join("|")}">
                            <div style="flex: 1; display: flex; align-items: flex-start; gap: 8px;">
                                <input type="checkbox" class="xcb-trust-select" data-username="${u.username}" style="width: 16px; height: 16px; margin-top: 2px; cursor: pointer; flex-shrink: 0;">
                                <div style="flex: 1;">
                                    <a href="/user/${encodeURIComponent(u.username)}/" class="xcb-panel-link xcb-panel-link-trust" target="_blank">${u.username}</a>
                                    <span class="xcb-user-meta" style="color: var(--xcb-panel-text-dim, #666);"> | Added: ${u.date ? formatDateTime2(u.date, false) : "Unknown"}</span>
                                    <button class="xcb-edit-btn" data-user="${u.username}" data-list="trust">Edit</button>
                                    <div class="xcb-user-note" id="xcbNote-trust-${u.username.replace(/[^a-zA-Z0-9]/g, "_")}">${formatNoteDisplay2(u.note)}</div>
                                </div>
                            </div>
                            <button class="xcb-remove-btn" data-user="${u.username}" data-list="trust">Remove</button>
                        </li>
                    `
    ).join("")}
                </ul>
            </div>`;
  }
  const HIGHLIGHTED_KEYWORD_COLOR = "#06b6d4";
  function renderKeywordTab(data) {
    const { initialTab, sortedKeywords, sortedHighlightedKeywords, settings, formatDateTime: formatDateTime2, keywordSubTab = "blocked" } = data;
    return `
            <!-- KEYWORD TAB -->
            <div id="xcbKeywordTab" class="xcb-tab-content ${initialTab === "keyword" ? "xcb-tab-content-active" : ""}">
                <button class="xcb-help-toggle" id="xcbKeywordHelp">? Help</button>
                <div id="xcbKeywordHelpBox" class="xcb-help-box" style="display: none;">
                    <h4><i class="ph-bold ph-prohibit" style="color: ${KEYWORD_COLOR};"></i> Blocked Keywords</h4>
                    <ul>
                        <li>Comments containing blocked keywords are automatically <strong>hidden</strong></li>
                        <li>The matched keyword is shown in the hidden notice</li>
                        <li><strong>Trusted users:</strong> Their comments are never hidden by keywords</li>
                    </ul>
                    <h4 style="margin-top: 10px;"><i class="ph-bold ph-eye" style="color: ${HIGHLIGHTED_KEYWORD_COLOR};"></i> Highlighted Keywords</h4>
                    <ul>
                        <li>Comments containing highlighted keywords are <strong>visually marked</strong> (not hidden)</li>
                        <li>The matching keyword is highlighted within the comment text</li>
                        <li>Great for tracking: "Please", "Thank you", specific names, etc.</li>
                    </ul>
                    <h4 style="margin-top: 10px;">How Matching Works</h4>
                    <ul>
                        <li><strong>Case-insensitive:</strong> "REQUEST" matches "request", "Request", etc.</li>
                        <li><strong>Substring matching:</strong> "upload" matches "please upload this"</li>
                        <li><strong>Partial words:</strong> "seed" matches "seeding", "reseeded"</li>
                    </ul>
                    <p style="margin-top: 8px;"><strong>Examples:</strong> Block "request", "pls upload" | Highlight "please", "thank you", "appreciate"</p>
                </div>

                <!-- Sub-tabs for Blocked/Highlighted -->
                <div style="display: flex; gap: 0; margin-bottom: 15px; border-bottom: 2px solid var(--xcb-panel-border, #444);">
                    <button class="xcb-keyword-subtab ${keywordSubTab === "blocked" ? "xcb-keyword-subtab-active" : ""}" data-subtab="blocked" style="flex: 1; padding: 10px; background: ${keywordSubTab === "blocked" ? "var(--xcb-section-bg, #2a2a3e)" : "transparent"}; border: none; border-bottom: 2px solid ${keywordSubTab === "blocked" ? KEYWORD_COLOR : "transparent"}; margin-bottom: -2px; color: ${keywordSubTab === "blocked" ? KEYWORD_COLOR : "var(--xcb-panel-text-muted, #888)"}; cursor: pointer; font-weight: bold; font-size: 12px; transition: all 0.2s;">
                        <i class="ph-bold ph-prohibit"></i> Blocked (${sortedKeywords.length})
                    </button>
                    <button class="xcb-keyword-subtab ${keywordSubTab === "highlighted" ? "xcb-keyword-subtab-active" : ""}" data-subtab="highlighted" style="flex: 1; padding: 10px; background: ${keywordSubTab === "highlighted" ? "var(--xcb-section-bg, #2a2a3e)" : "transparent"}; border: none; border-bottom: 2px solid ${keywordSubTab === "highlighted" ? HIGHLIGHTED_KEYWORD_COLOR : "transparent"}; margin-bottom: -2px; color: ${keywordSubTab === "highlighted" ? HIGHLIGHTED_KEYWORD_COLOR : "var(--xcb-panel-text-muted, #888)"}; cursor: pointer; font-weight: bold; font-size: 12px; transition: all 0.2s;">
                        <i class="ph-bold ph-eye"></i> Highlighted (${sortedHighlightedKeywords.length})
                    </button>
                </div>

                <!-- BLOCKED KEYWORDS SECTION -->
                <div id="xcbBlockedKeywordsSection" style="display: ${keywordSubTab === "blocked" ? "block" : "none"};">
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input type="text" id="xcbNewKeyword" placeholder="Enter keyword to block..." style="flex: 1;">
                        <button class="xcb-add-btn" id="xcbAddKeyword" style="background: ${KEYWORD_COLOR};"><i class="ph-bold ph-plus"></i> Block</button>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                        <button id="xcbExportKeywords" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-arrow-up"></i> Export</button>
                        <label class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-import" style="padding: 6px 12px; cursor: pointer; font-size: 11px;">
                            <i class="ph-bold ph-file-arrow-down"></i> Import
                            <input type="file" id="xcbImportKeywords" accept=".txt,.json" style="display: none;">
                        </label>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                        <input type="text" id="xcbSearchKeyword" placeholder="Search blocked keywords..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                        <select id="xcbKeywordSortOrder" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;" title="Sort order">
                            <option value="recent" ${settings.keywordsSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                            <option value="oldest" ${settings.keywordsSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                            <option value="alpha-asc" ${settings.keywordsSortOrder === "alpha-asc" ? "selected" : ""}>A → Z</option>
                            <option value="alpha-desc" ${settings.keywordsSortOrder === "alpha-desc" ? "selected" : ""}>Z → A</option>
                        </select>
                    </div>
                    <!-- Bulk Actions Bar -->
                    <div id="xcbKeywordBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                            <input type="checkbox" id="xcbSelectAllKeyword" style="width: 16px; height: 16px;">
                            Select All
                        </label>
                        <span id="xcbKeywordSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                        <div style="flex: 1;"></div>
                        <button id="xcbBulkMoveToHighlighted" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: ${HIGHLIGHTED_KEYWORD_COLOR}; color: ${HIGHLIGHTED_KEYWORD_COLOR}; display: none;" title="Move selected to highlighted"><i class="ph-bold ph-arrow-right"></i> To Highlighted</button>
                        <button id="xcbBulkRemoveKeyword" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Remove selected keywords"><i class="ph-bold ph-trash"></i> Remove</button>
                    </div>
                    <ul id="xcbKeywordList">
                        ${sortedKeywords.length === 0 ? '<li style="color: var(--xcb-panel-text-muted, #888);">No blocked keywords</li>' : sortedKeywords.map(
      (k) => `
                            <li data-keyword="${k.keyword}" data-searchable="${k.keyword.toLowerCase()}">
                                <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" class="xcb-keyword-select" data-keyword="${k.keyword}" style="width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;">
                                    <div style="flex: 1;">
                                        <span style="font-weight: 500;">${k.keyword}</span>
                                        <span class="xcb-user-meta" style="color: var(--xcb-panel-text-dim, #666);"> | Added: ${k.date ? formatDateTime2(k.date, false) : "Unknown"}</span>
                                    </div>
                                </div>
                                <button class="xcb-remove-btn" data-keyword="${k.keyword}">Remove</button>
                            </li>
                        `
    ).join("")}
                    </ul>
                </div>

                <!-- HIGHLIGHTED KEYWORDS SECTION -->
                <div id="xcbHighlightedKeywordsSection" style="display: ${keywordSubTab === "highlighted" ? "block" : "none"};">
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input type="text" id="xcbNewHighlightedKeyword" placeholder="Enter keyword to highlight..." style="flex: 1;">
                        <button class="xcb-add-btn" id="xcbAddHighlightedKeyword" style="background: ${HIGHLIGHTED_KEYWORD_COLOR};"><i class="ph-bold ph-plus"></i> Highlight</button>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                        <button id="xcbExportHighlightedKeywords" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-arrow-up"></i> Export</button>
                        <label class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-import" style="padding: 6px 12px; cursor: pointer; font-size: 11px;">
                            <i class="ph-bold ph-file-arrow-down"></i> Import
                            <input type="file" id="xcbImportHighlightedKeywords" accept=".txt,.json" style="display: none;">
                        </label>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                        <input type="text" id="xcbSearchHighlightedKeyword" placeholder="Search highlighted keywords..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                        <select id="xcbHighlightedKeywordSortOrder" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;" title="Sort order">
                            <option value="recent" ${settings.highlightedKeywordsSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                            <option value="oldest" ${settings.highlightedKeywordsSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                            <option value="alpha-asc" ${settings.highlightedKeywordsSortOrder === "alpha-asc" ? "selected" : ""}>A → Z</option>
                            <option value="alpha-desc" ${settings.highlightedKeywordsSortOrder === "alpha-desc" ? "selected" : ""}>Z → A</option>
                        </select>
                    </div>
                    <!-- Bulk Actions Bar -->
                    <div id="xcbHighlightedKeywordBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                            <input type="checkbox" id="xcbSelectAllHighlightedKeyword" style="width: 16px; height: 16px;">
                            Select All
                        </label>
                        <span id="xcbHighlightedKeywordSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                        <div style="flex: 1;"></div>
                        <button id="xcbBulkMoveToBlocked" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: ${KEYWORD_COLOR}; color: ${KEYWORD_COLOR}; display: none;" title="Move selected to blocked"><i class="ph-bold ph-arrow-right"></i> To Blocked</button>
                        <button id="xcbBulkRemoveHighlightedKeyword" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Remove selected keywords"><i class="ph-bold ph-trash"></i> Remove</button>
                    </div>
                    <ul id="xcbHighlightedKeywordList">
                        ${sortedHighlightedKeywords.length === 0 ? '<li style="color: var(--xcb-panel-text-muted, #888);">No highlighted keywords</li>' : sortedHighlightedKeywords.map(
      (k) => `
                            <li data-keyword="${k.keyword}" data-searchable="${k.keyword.toLowerCase()}">
                                <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" class="xcb-highlighted-keyword-select" data-keyword="${k.keyword}" style="width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;">
                                    <div style="flex: 1;">
                                        <span style="font-weight: 500; color: ${HIGHLIGHTED_KEYWORD_COLOR};">${k.keyword}</span>
                                        <span class="xcb-user-meta" style="color: var(--xcb-panel-text-dim, #666);"> | Added: ${k.date ? formatDateTime2(k.date, false) : "Unknown"}</span>
                                    </div>
                                </div>
                                <button class="xcb-highlighted-remove-btn" data-keyword="${k.keyword}">Remove</button>
                            </li>
                        `
    ).join("")}
                    </ul>
                </div>
            </div>`;
  }
  function renderRequestsTab(data) {
    const {
      initialTab,
      settings,
      activeRequests,
      sortedActiveRequests,
      archivedRequests,
      deletedRequests,
      formatDateTime: formatDateTime2
    } = data;
    if (settings.requestsEnabled === false) {
      return "<!-- Requests disabled -->";
    }
    return `
            <!-- REQUESTS TAB -->
            <div id="xcbRequestsTab" class="xcb-tab-content ${initialTab === "requests" ? "xcb-tab-content-active" : ""}">
                <button class="xcb-help-toggle" id="xcbRequestsHelp">? Help</button>
                <div id="xcbRequestsHelpBox" class="xcb-help-box" style="display: none;">
                    <h4>Adding Requests</h4>
                    <ul>
                        <li><strong style="color: var(--xcb-accent-warning, #f59e0b);">+ Button:</strong> Click the + button on any comment to save it as a request</li>
                        <li><strong>Manual entry:</strong> Use the form below to add requests manually</li>
                        <li><strong>Source link:</strong> Each captured request links back to the original page</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Highlight + Shift+Right-Click</h4>
                    <ul>
                        <li><strong>Method 1:</strong> Shift + Right-click on any <strong style="color: var(--xcb-accent-warning, #f59e0b);">username</strong> → select "+ Add Request"</li>
                        <li><strong>Method 2:</strong> <strong style="color: var(--xcb-accent-success, #22c55e);">Highlight text</strong> in a comment → Shift + Right-click on the highlight → select "+ Add Request"</li>
                        <li>The highlighted text will be pre-filled in the request popup</li>
                        <li><strong style="color: ${HIGHLIGHT_COLOR};">Note:</strong> Request options are not available for hard-blocked users</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Managing Requests</h4>
                    <ul>
                        <li><strong>Quick Status:</strong> Click <i class="ph-bold ph-hourglass"></i> (pending), <i class="ph-bold ph-check"></i> (completed), or <i class="ph-bold ph-x"></i> (declined) to set status instantly</li>
                        <li><strong>Checklist:</strong> Add sub-tasks to break down complex requests</li>
                        <li><strong>Drag & Drop:</strong> Drag requests to reorder/prioritize them</li>
                        <li><strong>Archive:</strong> Archive completed requests to keep your list clean</li>
                        <li><strong>Sort:</strong> Use the dropdown to sort by date, alphabetically, status, or username</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Import & Export</h4>
                    <ul>
                        <li><strong>Export TXT/CSV:</strong> Download your requests as a text or spreadsheet file</li>
                        <li><strong>Import CSV:</strong> Restore requests from a previously exported CSV file</li>
                        <li>Duplicates are automatically skipped during import</li>
                    </ul>
                    <h4 style="margin-top: 10px;">Pause & Limits</h4>
                    <ul>
                        <li><strong>Pause:</strong> Toggle to temporarily stop accepting new requests</li>
                        <li><strong>Per-user limit:</strong> Set in Settings to limit requests per user</li>
                    </ul>
                </div>

                <!-- Pause Toggle & Export Buttons -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: ${settings.requestsPaused ? "var(--xcb-accent-danger, #dc2626)" : "var(--xcb-primary, #6b5344)"}; border-radius: 6px; cursor: pointer; border: 1px solid var(--xcb-btn-border, rgba(255,255,255,0.2));">
                        <input type="checkbox" id="xcbRequestsPaused" ${settings.requestsPaused ? "checked" : ""} style="width: 16px; height: 16px;">
                        <span style="color: var(--xcb-btn-text, #fff); font-size: 12px; font-weight: bold;">${settings.requestsPaused ? '<i class="ph-bold ph-pause"></i> Requests PAUSED' : '<i class="ph-bold ph-play"></i> Taking Requests'}</span>
                    </label>
                    <div style="flex: 1;"></div>
                    <div class="xcb-export-dropdown" style="position: relative;">
                        <button id="xcbExportTXT" class="xcb-request-btn xcb-request-btn-bordered xcb-export-trigger" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-text"></i> Export TXT <i class="ph-bold ph-caret-down" style="font-size: 10px; margin-left: 4px;"></i></button>
                        <div class="xcb-export-menu" data-format="txt" style="display: none; position: absolute; top: 100%; left: 0; background: var(--xcb-panel-bg); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 4px; z-index: 100; min-width: 150px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            <button class="xcb-export-option" data-filter="all" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">All Requests</button>
                            <button class="xcb-export-option" data-filter="pending" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Pending Only</button>
                            <button class="xcb-export-option" data-filter="completed" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Completed Only</button>
                            <button class="xcb-export-option" data-filter="archived" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Archived Only</button>
                        </div>
                    </div>
                    <div class="xcb-export-dropdown" style="position: relative;">
                        <button id="xcbExportCSV" class="xcb-request-btn xcb-request-btn-bordered xcb-export-trigger" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-csv"></i> Export CSV <i class="ph-bold ph-caret-down" style="font-size: 10px; margin-left: 4px;"></i></button>
                        <div class="xcb-export-menu" data-format="csv" style="display: none; position: absolute; top: 100%; left: 0; background: var(--xcb-panel-bg); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 4px; z-index: 100; min-width: 150px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            <button class="xcb-export-option" data-filter="all" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">All Requests</button>
                            <button class="xcb-export-option" data-filter="pending" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Pending Only</button>
                            <button class="xcb-export-option" data-filter="completed" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Completed Only</button>
                            <button class="xcb-export-option" data-filter="archived" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Archived Only</button>
                        </div>
                    </div>
                    <div class="xcb-export-dropdown" style="position: relative;">
                        <button id="xcbExportJSON" class="xcb-request-btn xcb-request-btn-bordered xcb-export-trigger" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-code"></i> Export JSON <i class="ph-bold ph-caret-down" style="font-size: 10px; margin-left: 4px;"></i></button>
                        <div class="xcb-export-menu" data-format="json" style="display: none; position: absolute; top: 100%; left: 0; background: var(--xcb-panel-bg); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 4px; z-index: 100; min-width: 150px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            <button class="xcb-export-option" data-filter="all" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">All Requests</button>
                            <button class="xcb-export-option" data-filter="pending" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Pending Only</button>
                            <button class="xcb-export-option" data-filter="completed" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Completed Only</button>
                            <button class="xcb-export-option" data-filter="archived" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Archived Only</button>
                        </div>
                    </div>
                    <label class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-import" style="padding: 6px 12px; cursor: pointer; font-size: 11px;">
                        <i class="ph-bold ph-file-arrow-down"></i> Import
                        <input type="file" id="xcbImportCSV" accept=".csv,.json,.txt" style="display: none;">
                    </label>
                </div>

                ${settings.requestsPaused ? `
                <div style="background: var(--xcb-accent-danger, #dc2626); color: var(--xcb-btn-text, #fff); padding: 12px; border-radius: 6px; margin-bottom: 15px; text-align: center;">
                    <strong style="color: inherit;">⏸ Requests are currently PAUSED</strong><br>
                    <span style="font-size: 12px; color: inherit;">New request buttons are hidden from comments. Toggle above to resume.</span>
                </div>
                ` : ""}

                <!-- Add Request Form -->
                <div style="background: var(--xcb-section-bg, #2a2a3e); padding: 12px; border-radius: 6px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="xcbNewRequestUser" placeholder="Username..." style="flex: 1; min-width: 80px;">
                        <input type="text" id="xcbNewRequestSource" placeholder="Source URL (optional)" style="flex: 2; min-width: 120px;">
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <textarea id="xcbNewRequestText" placeholder="Request description..." style="flex: 1; min-height: 50px; resize: vertical;"></textarea>
                        <button class="xcb-add-btn" id="xcbAddRequest" style="background: var(--xcb-accent-warning, #f59e0b); color: var(--xcb-btn-text-dark, #000); align-self: flex-end;">Add</button>
                    </div>
                </div>

                <!-- Status Filters -->
                <div class="xcb-status-filters" id="xcbRequestFilters">
                    <button class="xcb-status-filter" data-filter="all">All (${activeRequests.length})</button>
                    <button class="xcb-status-filter active" data-filter="pending">Pending (${activeRequests.filter((r) => r.status === "pending").length})</button>
                    <button class="xcb-status-filter" data-filter="completed">Completed (${activeRequests.filter((r) => r.status === "completed").length})</button>
                    <button class="xcb-status-filter" data-filter="declined">Declined (${activeRequests.filter((r) => r.status === "declined").length})</button>
                    ${archivedRequests.length > 0 ? `<button class="xcb-status-filter" data-filter="archived" style="border-color: var(--xcb-panel-border, #666); color: var(--xcb-panel-text-muted, #888);"><i class="ph-bold ph-archive"></i> Archived (${archivedRequests.length})</button>` : ""}
                    ${deletedRequests.length > 0 ? `<button class="xcb-status-filter" data-filter="deleted" style="border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444);"><i class="ph-bold ph-trash"></i> Deleted (${deletedRequests.length})</button>` : ""}
                </div>

                <!-- Search and Sort -->
                <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                    <input type="text" id="xcbSearchRequests" placeholder="Search requests..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                    <select id="xcbRequestSortOrder" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;" title="Sort order">
                        <option value="recent" ${settings.requestsSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                        <option value="oldest" ${settings.requestsSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                        <option value="alpha-asc" ${settings.requestsSortOrder === "alpha-asc" ? "selected" : ""}>A → Z</option>
                        <option value="alpha-desc" ${settings.requestsSortOrder === "alpha-desc" ? "selected" : ""}>Z → A</option>
                        <option value="status" ${settings.requestsSortOrder === "status" ? "selected" : ""}>By Status</option>
                        <option value="username" ${settings.requestsSortOrder === "username" ? "selected" : ""}>By Username</option>
                    </select>
                </div>

                <!-- Bulk Actions Bar -->
                <div id="xcbBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                        <input type="checkbox" id="xcbSelectAllRequests" style="width: 16px; height: 16px;">
                        Select All
                    </label>
                    <span id="xcbSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                    <div style="flex: 1;"></div>
                    <button id="xcbBulkComplete" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; display: none;" title="Mark selected as completed"><i class="ph-bold ph-check"></i> Complete</button>
                    <button id="xcbBulkArchive" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; display: none;" title="Archive selected requests"><i class="ph-bold ph-archive"></i> Archive</button>
                    <button id="xcbBulkDelete" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Delete selected requests"><i class="ph-bold ph-trash"></i> Delete</button>
                </div>

                <!-- Request List -->
                <div id="xcbRequestList">
                    ${sortedActiveRequests.length === 0 ? '<div class="xcb-no-requests">No requests yet. Add one above or capture from comments!</div>' : sortedActiveRequests.map(
      (req) => `
                        <div class="xcb-request-item" draggable="true" data-id="${req.id}" data-status="${req.status}" data-searchable="${req.username.toLowerCase()} ${req.text.toLowerCase()}" style="${req.status !== "pending" ? "display: none;" : ""}">
                            <div class="xcb-request-header">
                                <input type="checkbox" class="xcb-request-select" data-id="${req.id}" style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer;">
                                <a href="/user/${encodeURIComponent(req.username)}/" class="xcb-request-username" target="_blank">${req.username}</a>
                                <span class="xcb-request-date">${formatDateTime2(req.date, false)}</span>
                                ${req.sourceUrl ? `<a href="${req.sourceUrl}" class="xcb-request-source" target="_blank" title="View original comment"><i class="ph-bold ph-map-pin"></i> Source</a>` : ""}
                            </div>
                            <div class="xcb-request-text ${req.text.length > 150 ? "collapsed" : ""}" data-full-text="${req.text.replace(/"/g, "&quot;")}">${req.text}</div>
                            ${req.text.length > 150 ? '<button class="xcb-request-expand">Show more</button>' : ""}

                            <!-- Checklist -->
                            <div class="xcb-checklist" data-request-id="${req.id}">
                                ${(req.checklist || []).map(
        (item) => `
                                    <div class="xcb-checklist-item ${item.completed ? "completed" : ""}" data-checklist-id="${item.id}" draggable="true">
                                        <span class="xcb-checklist-drag" title="Drag to reorder">⋮⋮</span>
                                        <input type="checkbox" ${item.completed ? "checked" : ""}>
                                        <span>${item.text}</span>
                                        <button class="xcb-checklist-delete" title="Remove">×</button>
                                    </div>
                                `
      ).join("")}
                                <div class="xcb-checklist-add">
                                    <input type="text" placeholder="Add sub-task...">
                                    <button>+</button>
                                </div>
                            </div>

                            <div class="xcb-request-actions">
                                <div class="xcb-request-status-btns" data-id="${req.id}">
                                    <button class="xcb-status-btn xcb-status-btn-pending ${req.status === "pending" ? "active" : ""}" data-status="pending" data-id="${req.id}" title="Pending"><i class="ph-bold ph-hourglass"></i></button>
                                    <button class="xcb-status-btn xcb-status-btn-completed ${req.status === "completed" ? "active" : ""}" data-status="completed" data-id="${req.id}" title="Completed"><i class="ph-bold ph-check"></i></button>
                                    <button class="xcb-status-btn xcb-status-btn-declined ${req.status === "declined" ? "active" : ""}" data-status="declined" data-id="${req.id}" title="Declined"><i class="ph-bold ph-x"></i></button>
                                </div>
                                <button class="xcb-request-btn xcb-request-btn-bordered" data-action="edit" data-id="${req.id}">Edit</button>
                                <button class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-archive" data-action="archive" data-id="${req.id}">Archive</button>
                                <button class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-delete" data-action="delete" data-id="${req.id}">Delete</button>
                            </div>
                        </div>
                    `
    ).join("")}
                </div>

                <!-- Archived Section -->
                <div id="xcbArchivedRequestsSection" style="display: none; margin-top: 15px;">
                    ${archivedRequests.length > 0 ? `
                    <div style="background: var(--xcb-panel-bg, #1a1a1a); border: 1px solid var(--xcb-panel-border, #666); border-radius: 6px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="margin: 0; color: var(--xcb-panel-text-muted, #888);"><i class="ph-bold ph-archive"></i> Archived Requests (${archivedRequests.length})</h4>
                        </div>
                        <!-- Bulk Actions for Archived -->
                        <div id="xcbArchivedBulkActions" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-panel-tertiary-bg, #1f1f1f); border-radius: 6px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                                <input type="checkbox" id="xcbSelectAllArchived" style="width: 16px; height: 16px;">
                                Select All
                            </label>
                            <span id="xcbArchivedSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                            <div style="flex: 1;"></div>
                            <button id="xcbBulkUnarchive" style="padding: 4px 10px; font-size: 11px; background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Restore selected"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>
                            <button id="xcbBulkDeleteArchived" style="padding: 4px 10px; font-size: 11px; background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Delete selected"><i class="ph-bold ph-trash"></i> Delete</button>
                        </div>
                        ${archivedRequests.map(
      (req) => `
                            <div class="xcb-request-item archived" data-id="${req.id}" style="background: var(--xcb-panel-bg, #0a0a0a); border-left: 3px solid var(--xcb-panel-border, #666); opacity: 0.8; margin-bottom: 8px;">
                                <div class="xcb-request-header">
                                    <input type="checkbox" class="xcb-archived-select" data-id="${req.id}" style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer;">
                                    <a href="/user/${encodeURIComponent(req.username)}/" class="xcb-request-username" target="_blank" style="color: var(--xcb-panel-text-muted, #888);">${req.username}</a>
                                    <span class="xcb-request-date">${formatDateTime2(req.date, false)}</span>
                                    ${req.sourceUrl ? `<a href="${req.sourceUrl}" class="xcb-request-source" target="_blank"><i class="ph-bold ph-map-pin"></i> Source</a>` : ""}
                                </div>
                                <div class="xcb-request-text" style="color: var(--xcb-panel-text-dim, #666);">${req.text.length > 100 ? req.text.substring(0, 100) + "..." : req.text}</div>
                                <div class="xcb-request-actions">
                                    <button class="xcb-request-btn xcb-request-btn-bordered" data-action="unarchive" data-id="${req.id}" style="background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>
                                    <button class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-delete" data-action="delete" data-id="${req.id}" style="background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-trash"></i> Delete</button>
                                </div>
                            </div>
                        `
    ).join("")}
                    </div>
                    ` : '<div style="text-align: center; padding: 20px; color: var(--xcb-panel-text-dim, #666);">No archived requests</div>'}
                </div>

                <!-- Recently Deleted Requests Section -->
                <div id="xcbDeletedRequestsSection" style="display: none; margin-top: 15px;">
                    ${deletedRequests.length > 0 ? `
                    <div style="background: var(--xcb-panel-bg, #1a1a1a); border: 1px solid #ef4444; border-radius: 6px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="margin: 0; color: var(--xcb-accent-danger, #ef4444);"><i class="ph-bold ph-trash"></i> Recently Deleted (${deletedRequests.length})</h4>
                            <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">Items are automatically removed after 14 days</span>
                        </div>
                        <!-- Bulk Actions for Deleted -->
                        <div id="xcbDeletedBulkActions" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-panel-tertiary-bg, #1f1f1f); border-radius: 6px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                                <input type="checkbox" id="xcbSelectAllDeleted" style="width: 16px; height: 16px;">
                                Select All
                            </label>
                            <span id="xcbDeletedSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                            <div style="flex: 1;"></div>
                            <button id="xcbBulkRestore" style="padding: 4px 10px; font-size: 11px; background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Restore selected"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>
                            <button id="xcbBulkPermanentDelete" style="padding: 4px 10px; font-size: 11px; background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Permanently delete selected"><i class="ph-bold ph-trash"></i> Delete Forever</button>
                        </div>
                        ${deletedRequests.map((req) => {
      const autoDeleteDate = new Date(
        (req.deletedAt || Date.now()) + 14 * 24 * 60 * 60 * 1e3
      );
      const autoDeleteStr = formatDateTime2(
        autoDeleteDate.getTime(),
        true
      );
      const daysRemaining = Math.ceil(
        (autoDeleteDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
      );
      return `
                            <div class="xcb-request-item xcb-deleted-request" data-id="${req.id}" style="background: var(--xcb-panel-bg, #0a0a0a); border-left: 3px solid #ef4444; opacity: 0.7; margin-bottom: 8px;">
                                <div class="xcb-request-header">
                                    <input type="checkbox" class="xcb-deleted-select" data-id="${req.id}" style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer;">
                                    <span class="xcb-request-username" style="color: var(--xcb-panel-text-muted, #888);">${req.username}</span>
                                    <span class="xcb-request-date">Created: ${formatDateTime2(req.date, false)}</span>
                                </div>
                                <div style="font-size: 10px; color: var(--xcb-accent-danger, #ef4444); margin: 6px 0; padding: 4px 8px; background: #ef444415; border-radius: 4px; display: inline-block;"><i class="ph-bold ph-clock"></i> Auto-deletes: ${autoDeleteStr} (${daysRemaining} days remaining)</div>
                                <div class="xcb-request-text" style="color: var(--xcb-panel-text-dim, #666);">${req.text.length > 100 ? req.text.substring(0, 100) + "..." : req.text}</div>
                                <div class="xcb-request-actions">
                                    <button class="xcb-deleted-request-action" data-action="restore" data-id="${req.id}" style="background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>
                                    <button class="xcb-deleted-request-action" data-action="permanent-delete" data-id="${req.id}" style="background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-trash"></i> Delete Forever</button>
                                </div>
                            </div>
                            `;
    }).join("")}
                    </div>
                    ` : '<div style="text-align: center; padding: 20px; color: var(--xcb-panel-text-dim, #666);">No deleted requests</div>'}
                </div>
            </div>`;
  }
  const TAG_CSS_VAR_MAP = {
    spammer: "--xcb-badge-spammer",
    "rude/toxic": "--xcb-badge-rude",
    rude: "--xcb-badge-rude",
    toxic: "--xcb-badge-rude",
    beggar: "--xcb-badge-beggar",
    "off-topic": "--xcb-badge-offtopic",
    troll: "--xcb-badge-troll",
    annoying: "--xcb-badge-annoying",
    "unwanted advice": "--xcb-badge-unwanted",
    uploader: "--xcb-badge-uploader",
    helpful: "--xcb-badge-helpful",
    moderator: "--xcb-badge-moderator",
    requester: "--xcb-badge-requester",
    friend: "--xcb-badge-friend",
    "seeding issues": "--xcb-badge-seeding",
    thankful: "--xcb-badge-thankful"
  };
  function getTagColor(tag, settings, customReasons) {
    const tagLower = tag.toLowerCase();
    const customReason = customReasons.find(
      (r) => r.name.toLowerCase() === tagLower
    );
    if (customReason) return customReason.color;
    const cssVar = TAG_CSS_VAR_MAP[tagLower];
    if (cssVar) {
      const colors = settings.customColors;
      const fallbackMap = {
        "--xcb-badge-spammer": colors.badgeSpammer,
        "--xcb-badge-rude": colors.badgeRude,
        "--xcb-badge-beggar": colors.badgeBeggar,
        "--xcb-badge-offtopic": colors.badgeOfftopic,
        "--xcb-badge-troll": colors.badgeTroll,
        "--xcb-badge-annoying": colors.badgeAnnoying,
        "--xcb-badge-unwanted": colors.badgeUnwanted,
        "--xcb-badge-uploader": colors.badgeUploader,
        "--xcb-badge-helpful": colors.badgeHelpful,
        "--xcb-badge-moderator": colors.badgeModerator,
        "--xcb-badge-requester": colors.badgeRequester,
        "--xcb-badge-friend": colors.badgeFriend,
        "--xcb-badge-seeding": colors.badgeSeeding,
        "--xcb-badge-thankful": colors.badgeThankful
      };
      const fallback = fallbackMap[cssVar] || "#6b7280";
      return `var(${cssVar}, ${fallback})`;
    }
    if (REASON_COLORS[tagLower]) {
      return REASON_COLORS[tagLower];
    }
    return "#6b7280";
  }
  function renderNotesTab(data) {
    const {
      initialTab,
      settings,
      notes,
      sortedNotes,
      activeNotes,
      archivedNotes,
      deletedNotes,
      noteSections,
      customReasons,
      currentNoteSectionFilter: currentNoteSectionFilter2,
      getContrastColor: getContrastColor2,
      formatDateTime: formatDateTime2,
      getSectionPrefix: getSectionPrefix2,
      renderNoteSubtasks: renderNoteSubtasks2,
      countNoteSubtasks: countNoteSubtasks2
    } = data;
    const getTagTextColor = (tag) => {
      const tagLower = tag.toLowerCase();
      const customReason = customReasons.find(
        (r) => r.name.toLowerCase() === tagLower
      );
      if (customReason) return getContrastColor2(customReason.color);
      const cssVar = TAG_CSS_VAR_MAP[tagLower];
      if (cssVar) {
        const colors = settings.customColors;
        const fallbackMap = {
          "--xcb-badge-spammer": colors.badgeSpammer,
          "--xcb-badge-rude": colors.badgeRude,
          "--xcb-badge-beggar": colors.badgeBeggar,
          "--xcb-badge-offtopic": colors.badgeOfftopic,
          "--xcb-badge-troll": colors.badgeTroll,
          "--xcb-badge-annoying": colors.badgeAnnoying,
          "--xcb-badge-unwanted": colors.badgeUnwanted,
          "--xcb-badge-uploader": colors.badgeUploader,
          "--xcb-badge-helpful": colors.badgeHelpful,
          "--xcb-badge-moderator": colors.badgeModerator,
          "--xcb-badge-requester": colors.badgeRequester,
          "--xcb-badge-friend": colors.badgeFriend,
          "--xcb-badge-seeding": colors.badgeSeeding,
          "--xcb-badge-thankful": colors.badgeThankful
        };
        const fallback = fallbackMap[cssVar] || "#6b7280";
        return getContrastColor2(fallback);
      }
      if (REASON_COLORS[tagLower]) {
        return getContrastColor2(REASON_COLORS[tagLower]);
      }
      return "#ffffff";
    };
    const buildTagFilterHtml = () => {
      const allTags = /* @__PURE__ */ new Set();
      notes.forEach((n) => (n.tags || []).forEach((t) => allTags.add(t)));
      if (allTags.size === 0) {
        return '<span class="xcb-text-muted" style="font-size: 11px;">No tags yet</span>';
      }
      return Array.from(allTags).map((tag) => {
        const bgColor = getTagColor(tag, settings, customReasons);
        const textColor = getTagTextColor(tag);
        return '<button class="xcb-note-filter-tag" data-tag="' + tag + '" style="background: ' + bgColor + "; color: " + textColor + ';">' + tag + "</button>";
      }).join("");
    };
    const buildSectionTreeHtml = () => {
      const allNotes = notes.filter((n) => !n.archived);
      const unsectionedCount = allNotes.filter((n) => !n.sectionId).length;
      if (noteSections.length === 0) {
        return '<div style="text-align: center; padding: 15px; color: var(--xcb-panel-text-dim, #666); font-size: 11px;">No sections yet. Click "+ Add Section" to create one.</div>';
      }
      const filterButtons = '<div style="display: flex; gap: 6px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333;"><button class="xcb-section-filter-btn" data-section-filter="" style="background: ' + (currentNoteSectionFilter2 === null ? "#8b5cf6" : "var(--xcb-panel-secondary-bg, #333)") + "; border-color: var(--xcb-accent-purple, #8b5cf6); color: " + (currentNoteSectionFilter2 === null ? "#fff" : "#8b5cf6") + ';"><i class="ph-bold ph-clipboard-text"></i> All (' + allNotes.length + ')</button><button class="xcb-section-filter-btn" data-section-filter="unsectioned" style="background: ' + (currentNoteSectionFilter2 === "unsectioned" ? "var(--xcb-panel-text-muted, #666)" : "var(--xcb-panel-secondary-bg, #333)") + "; border-color: var(--xcb-panel-text-muted, #666); color: " + (currentNoteSectionFilter2 === "unsectioned" ? "var(--xcb-panel-bg, #fff)" : "var(--xcb-panel-text-muted, #888)") + ';"><i class="ph-bold ph-file"></i> Unsectioned (' + unsectionedCount + ")</button></div>";
      const renderSectionTree = (parentId = null, depth = 0) => {
        const children = noteSections.filter((s) => s.parentId === parentId).sort((a, b) => a.order - b.order);
        if (children.length === 0) return "";
        return children.map((section) => {
          const prefix = getSectionPrefix2(section.level, section.order);
          const noteCount = notes.filter(
            (n) => n.sectionId === section.id && !n.archived
          ).length;
          const hasChildren = noteSections.some((s) => s.parentId === section.id);
          const indent = depth * 16;
          const isSelected = currentNoteSectionFilter2 === section.id;
          return '<div class="xcb-section-tree-item" data-section-id="' + section.id + '" style="padding: 6px 8px; margin-left: ' + indent + "px; background: " + (isSelected ? section.color + "30" : "var(--xcb-section-bg, #2a2a3e)") + "; border-radius: 4px; margin-bottom: 4px; border-left: 3px solid " + section.color + "; border: " + (isSelected ? "1px solid " + section.color : "1px solid transparent") + '; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" title="Click to filter notes in this section"><div style="display: flex; align-items: center; gap: 6px;">' + (hasChildren ? '<span class="xcb-section-collapse-toggle" data-section-id="' + section.id + '" style="color: var(--xcb-panel-text-dim, #666); font-size: 10px; padding: 2px;" title="Expand/collapse">' + (section.collapsed ? "▶" : "▼") + "</span>" : '<span style="width: 14px;"></span>') + '<span style="color: ' + section.color + '; font-weight: bold; font-size: 11px;">' + prefix + '</span><span style="color: var(--xcb-panel-text, #e0e0e0); font-size: 12px;">' + section.name + '</span><span style="color: var(--xcb-panel-text-dim, #666); font-size: 10px;">(' + noteCount + ")</span>" + (isSelected ? '<span style="color: ' + section.color + '; font-size: 10px;"><i class="ph-bold ph-check"></i></span>' : "") + '</div><div style="display: flex; gap: 4px;">' + (section.level < 3 ? '<button class="xcb-section-add-child" data-parent-id="' + section.id + '" style="background: transparent; border: none; color: var(--xcb-accent-purple, #8b5cf6); cursor: pointer; font-size: 10px; padding: 2px 4px;" title="Add subsection">+</button>' : "") + '<button class="xcb-section-edit" data-section-id="' + section.id + '" style="background: transparent; border: none; color: var(--xcb-primary); cursor: pointer; font-size: 10px; padding: 2px 4px;" title="Edit"><i class="ph-bold ph-pencil-simple"></i></button><button class="xcb-section-delete" data-section-id="' + section.id + '" style="background: transparent; border: none; color: var(--xcb-accent-danger, #ef4444); cursor: pointer; font-size: 10px; padding: 2px 4px;" title="Delete"><i class="ph-bold ph-trash"></i></button></div></div>' + (section.collapsed ? "" : renderSectionTree(section.id, depth + 1));
        }).join("");
      };
      return filterButtons + renderSectionTree();
    };
    const buildSectionFilterIndicator = () => {
      if (currentNoteSectionFilter2 === null) return "";
      if (currentNoteSectionFilter2 === "unsectioned") {
        return '<div id="xcbSectionFilterIndicator" style="margin-bottom: 10px; padding: 8px 12px; background: #66666620; border: 1px solid var(--xcb-panel-border, #666); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">📄 Showing: <strong style="color: var(--xcb-panel-text-secondary, #ccc);">Unsectioned notes</strong></span><button id="xcbClearSectionFilter" style="background: transparent; border: 1px solid var(--xcb-panel-border, #666); color: var(--xcb-panel-text-muted, #888); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;">✕ Clear Filter</button></div>';
      }
      const section = noteSections.find((s) => s.id === currentNoteSectionFilter2);
      if (!section) return "";
      const prefix = getSectionPrefix2(section.level, section.order);
      return '<div id="xcbSectionFilterIndicator" style="margin-bottom: 10px; padding: 8px 12px; background: ' + section.color + "15; border: 1px solid " + section.color + '40; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa);"><i class="ph-bold ph-folder"></i> Showing: <strong style="color: ' + section.color + ';">' + prefix + " " + section.name + '</strong></span><button id="xcbClearSectionFilter" style="background: transparent; border: 1px solid ' + section.color + "; color: " + section.color + '; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;">✕ Clear Filter</button></div>';
    };
    const buildNotesListHtml = () => {
      if (sortedNotes.length === 0 && deletedNotes.length === 0) {
        return '<div class="xcb-notes-empty" style="text-align: center; padding: 30px; color: var(--xcb-panel-text-dim, #666);"><p style="font-size: 14px; margin-bottom: 5px;"><i class="ph-bold ph-note-pencil"></i> No notes yet</p><p style="font-size: 11px;">Click the Note button on any comment to save it.</p></div>';
      }
      const notesHtml = sortedNotes.map((note) => {
        const isArchived = note.archived === true;
        const statusClass = isArchived ? "archived" : "active";
        const noteTags = (note.tags || []).map((tag) => {
          const color = getTagColor(tag, settings, customReasons);
          return '<span class="xcb-reason-badge" style="background: ' + color + "; color: " + getContrastColor2(color) + ';">' + tag + "</span>";
        }).join("");
        const tagsStr = (note.tags || []).join(" ").toLowerCase();
        const searchable = (note.username + " " + (note.commentText || "") + " " + (note.note || "") + " " + tagsStr).toLowerCase();
        const sectionHtml = (() => {
          const section = note.sectionId ? noteSections.find((s) => s.id === note.sectionId) : null;
          return section ? '<span style="color: ' + section.color + "; font-size: 10px; margin-left: 8px; padding: 2px 6px; background: " + section.color + "20; border: 1px solid " + section.color + '40; border-radius: 3px;" title="Section: ' + section.name + '">' + getSectionPrefix2(section.level, section.order) + " " + section.name + "</span>" : "";
        })();
        return '<div class="xcb-note-card" data-id="' + note.id + '" data-status="' + statusClass + '" data-section-id="' + (note.sectionId || "") + '" data-searchable="' + searchable.replace(/"/g, "&quot;") + '" style="background: ' + (isArchived ? "#1a1a2e" : "#2a2a3e") + "; border-radius: 8px; padding: 12px; border-left: 3px solid " + (isArchived ? "#666" : "#8b5cf6") + "; " + (isArchived ? "opacity: 0.8;" : "") + ' display: none;"><div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" class="xcb-note-select" data-id="' + note.id + '" style="width: 16px; height: 16px; cursor: pointer;"><strong style="color: ' + (isArchived ? "#aaa" : "#e0e0e0") + ';">' + note.username + '</strong><span style="color: var(--xcb-panel-text-dim, #666); font-size: 11px; margin-left: 8px;">' + formatDateTime2(note.date, false) + "</span>" + (isArchived ? '<span style="color: var(--xcb-panel-text-dim, #666); font-size: 10px; margin-left: 8px; padding: 2px 6px; background: var(--xcb-panel-secondary-bg, #333); border-radius: 3px;">Archived</span>' : "") + sectionHtml + '</div><div style="display: flex; gap: 5px;">' + (note.sourceUrl ? '<a href="' + note.sourceUrl + '" target="_blank" style="color: var(--xcb-primary); font-size: 11px; text-decoration: none;" title="View original"><i class="ph-bold ph-link"></i></a>' : "") + '<button class="xcb-note-action" data-action="move" data-id="' + note.id + '" style="background: transparent; border: none; color: var(--xcb-accent-purple, #8b5cf6); cursor: pointer; font-size: 12px;" title="Move to section"><i class="ph-bold ph-folder"></i></button><button class="xcb-note-action" data-action="edit" data-id="' + note.id + '" style="background: transparent; border: none; color: var(--xcb-primary); cursor: pointer; font-size: 12px;" title="Edit"><i class="ph-bold ph-pencil-simple"></i></button>' + (isArchived ? '<button class="xcb-note-action" data-action="unarchive" data-id="' + note.id + '" style="background: transparent; border: none; color: var(--xcb-accent-success, #22c55e); cursor: pointer; font-size: 12px;" title="Restore"><i class="ph-bold ph-arrow-counter-clockwise"></i></button>' : '<button class="xcb-note-action" data-action="archive" data-id="' + note.id + '" style="background: transparent; border: none; color: var(--xcb-accent-warning, #f59e0b); cursor: pointer; font-size: 12px;" title="Archive"><i class="ph-bold ph-archive"></i></button>') + '<button class="xcb-note-action" data-action="delete" data-id="' + note.id + '" style="background: transparent; border: none; color: var(--xcb-accent-danger, #ef4444); cursor: pointer; font-size: 12px;" title="Delete"><i class="ph-bold ph-trash"></i></button></div></div>' + ((note.tags || []).length > 0 ? '<div style="margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 5px;">' + noteTags + "</div>" : "") + '<div style="background: var(--xcb-panel-secondary-bg, #1a1a2e); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); font-style: italic; max-height: 100px; overflow-y: auto; white-space: pre-wrap; word-break: break-word;">"' + (note.commentText || "").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '"</div>' + (note.note ? '<div style="font-size: 12px; color: var(--xcb-panel-text, #e0e0e0); margin-bottom: 8px;"><strong style="color: var(--xcb-accent-purple, #8b5cf6);">Your note:</strong> ' + note.note + "</div>" : "") + // Subtasks section
        '<div class="xcb-note-subtasks-section" data-note-id="' + note.id + '" style="margin-top: 8px;">' + (note.subtasks && note.subtasks.length > 0 ? '<div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 4px;">Subtasks (' + countNoteSubtasks2(note.subtasks, true) + "/" + countNoteSubtasks2(note.subtasks) + ' done):</div><div class="xcb-note-subtasks-list" style="background: var(--xcb-panel-secondary-bg, #1a1a2e); border-radius: 4px; padding: 6px; text-align: left;">' + renderNoteSubtasks2(note.id, note.subtasks) + "</div>" : "") + '<div style="margin-top: 6px;"><button class="xcb-note-add-subtask" data-note-id="' + note.id + '" style="background: color-mix(in srgb, var(--xcb-notes-color, #8b5cf6) 25%, transparent); border: 1px dashed var(--xcb-notes-color, #8b5cf6); color: var(--xcb-notes-color, #8b5cf6); padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">+ Add subtask</button></div></div></div>';
      }).join("");
      const deletedDisclaimer = deletedNotes.length > 0 ? '<div class="xcb-deleted-disclaimer" data-status="deleted" style="display: none; background: var(--xcb-panel-bg, #1a1a1a); border: 1px solid #ef4444; border-radius: 6px; padding: 10px; margin-bottom: 10px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><span style="color: var(--xcb-accent-danger, #ef4444); font-weight: bold;"><i class="ph-bold ph-trash"></i> Recently Deleted Notes</span><span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">Items are automatically removed after 14 days</span></div><div id="xcbDeletedNotesBulkActions" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-panel-tertiary-bg, #1f1f1f); border-radius: 6px;"><label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);"><input type="checkbox" id="xcbSelectAllDeletedNotes" style="width: 16px; height: 16px;">Select All</label><span id="xcbDeletedNotesSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span><div style="flex: 1;"></div><button id="xcbBulkRestoreNotes" style="padding: 4px 10px; font-size: 11px; background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Restore selected"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button><button id="xcbBulkPermanentDeleteNotes" style="padding: 4px 10px; font-size: 11px; background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; display: none;" title="Permanently delete selected"><i class="ph-bold ph-trash"></i> Delete Forever</button></div></div>' : "";
      const deletedNotesHtml = deletedNotes.map((note) => {
        const autoDeleteDate = new Date(
          (note.deletedAt || Date.now()) + 14 * 24 * 60 * 60 * 1e3
        );
        const autoDeleteStr = formatDateTime2(autoDeleteDate.getTime(), true);
        const daysRemaining = Math.ceil(
          (autoDeleteDate.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
        );
        const noteTags = (note.tags || []).map((tag) => {
          const color = getTagColor(tag, settings, customReasons);
          return '<span class="xcb-reason-badge" style="background: ' + color + "; color: " + getContrastColor2(color) + '; opacity: 0.6;">' + tag + "</span>";
        }).join("");
        const searchable = (note.username + " " + (note.commentText || "") + " " + (note.note || "")).toLowerCase();
        return '<div class="xcb-note-card xcb-deleted-note" data-id="' + note.id + '" data-status="deleted" data-searchable="' + searchable.replace(/"/g, "&quot;") + '" style="background: #1a1a1a; border-radius: 8px; padding: 12px; border-left: 3px solid #ef4444; opacity: 0.7; display: none;"><div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" class="xcb-deleted-note-select" data-id="' + note.id + '" style="width: 16px; height: 16px; cursor: pointer;"><strong style="color: var(--xcb-panel-text-muted, #888);">' + note.username + '</strong><span style="color: var(--xcb-panel-text-dim, #555); font-size: 11px; margin-left: 8px;">Created: ' + formatDateTime2(note.date, false) + '</span></div><div style="display: flex; gap: 5px;"><button class="xcb-deleted-note-action" data-action="restore" data-id="' + note.id + '" style="background: #22c55e; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); cursor: pointer; font-size: 11px; padding: 4px 8px; border-radius: 4px;" title="Restore"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button><button class="xcb-deleted-note-action" data-action="permanent-delete" data-id="' + note.id + '" style="background: #ef4444; border: 1px solid rgba(255,255,255,0.2); color: var(--xcb-btn-text, #fff); cursor: pointer; font-size: 11px; padding: 4px 8px; border-radius: 4px;" title="Delete Forever"><i class="ph-bold ph-trash"></i> Delete</button></div></div><div style="font-size: 10px; color: var(--xcb-accent-danger, #ef4444); margin-bottom: 8px; padding: 4px 8px; background: #ef444415; border-radius: 4px; display: inline-block;"><i class="ph-bold ph-clock"></i> Auto-deletes: ' + autoDeleteStr + " (" + daysRemaining + " days remaining)</div>" + ((note.tags || []).length > 0 ? '<div style="margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 5px;">' + noteTags + "</div>" : "") + '<div style="background: var(--xcb-panel-bg, #0a0a0a); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 12px; color: var(--xcb-panel-text-dim, #666); font-style: italic; max-height: 100px; overflow-y: auto; white-space: pre-wrap; word-break: break-word;">"' + (note.commentText || "").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '"</div>' + (note.note ? '<div style="font-size: 12px; color: var(--xcb-panel-text-muted, #888);"><strong style="color: #8b5cf680;">Your note:</strong> ' + note.note + "</div>" : "") + "</div>";
      }).join("");
      return notesHtml + deletedDisclaimer + deletedNotesHtml;
    };
    return `
            <!-- NOTES TAB -->
            <div id="xcbNotesTab" class="xcb-tab-content ${initialTab === "notes" ? "xcb-tab-content-active" : ""}" ${settings.notesEnabled === false ? 'style="display: none;"' : ""}>
                <button class="xcb-help-toggle" id="xcbNotesHelp">? Help</button>
                <div id="xcbNotesHelpBox" class="xcb-help-box" style="display: none;">
                    <h4><i class="ph-bold ph-note-pencil"></i> Notes Feature</h4>
                    <ul>
                        <li><strong>Save Comments:</strong> Click the Note button on any comment to save it with your notes and tags.</li>
                        <li><strong>Tag Notes:</strong> Apply tags to categorize notes (helpful, complaint, important, etc.)</li>
                        <li><strong>Filter:</strong> Use the tabs to filter by status, or click tags to filter by category.</li>
                        <li><strong>Archive:</strong> Archive notes you've addressed but want to keep for reference.</li>
                    </ul>

                    <h4 style="margin-top: 12px;"><i class="ph-bold ph-folder"></i> Organizing Notes with Sections</h4>
                    <p style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;">Group your notes into a hierarchical folder structure with up to 4 levels:</p>
                    <ul>
                        <li><strong>Create Sections:</strong> Click <span style="background: var(--xcb-notes-color, #8b5cf6); color: var(--xcb-panel-text, #fff); padding: 2px 6px; border-radius: 3px; font-size: 10px;">+ Add Section</span> to create a top-level section (numbered 1, 2, 3...)</li>
                        <li><strong>Add Subsections:</strong> Click the <span style="color: var(--xcb-accent-purple, #8b5cf6);">+</span> button next to any section to add a child subsection:
                            <ul style="margin: 4px 0 4px 15px; font-size: 11px; color: var(--xcb-panel-text-muted, #888);">
                                <li>Level 1: 1. 2. 3. (Main sections)</li>
                                <li>Level 2: A. B. C. (Subsections)</li>
                                <li>Level 3: a. b. c. (Sub-subsections)</li>
                                <li>Level 4: i. ii. iii. (Items)</li>
                            </ul>
                        </li>
                        <li><strong>Move Notes:</strong> Click the <i class="ph-bold ph-folder"></i> button on any note to assign it to a section</li>
                        <li><strong>Filter by Section:</strong> Click on any section to filter and show only notes in that section. Click again to clear the filter.</li>
                        <li><strong>Collapse/Expand:</strong> Click the ▶/▼ arrow to collapse or expand subsections</li>
                        <li><strong>Edit/Delete:</strong> Use <i class="ph-bold ph-pencil-simple"></i> to edit section name/color, or <i class="ph-bold ph-trash"></i> to delete (sub-sections also deleted, notes move to Unsectioned)</li>
                    </ul>
                </div>

                <div class="xcb-section" style="padding: 10px;">
                    <!-- Header with Add Note and Import/Export -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="xcb-section-title" style="margin: 0;">Your Notes (${notes.length})</div>
                        <div style="display: flex; gap: 8px;">
                            <button class="xcb-add-btn" id="xcbAddNoteManual" style="background: var(--xcb-notes-color, #8b5cf6); padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-plus"></i> Add Note</button>
                            <div class="xcb-export-dropdown" style="position: relative;">
                                <button id="xcbExportNotesTXT" class="xcb-request-btn xcb-request-btn-bordered xcb-notes-export-trigger" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-text"></i> Export TXT <i class="ph-bold ph-caret-down" style="font-size: 10px; margin-left: 4px;"></i></button>
                                <div class="xcb-notes-export-menu" data-format="txt" style="display: none; position: absolute; top: 100%; right: 0; background: var(--xcb-panel-bg); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 4px; z-index: 100; min-width: 150px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                                    <button class="xcb-notes-export-option" data-filter="all" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">All Notes</button>
                                    <button class="xcb-notes-export-option" data-filter="active" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Active Only</button>
                                    <button class="xcb-notes-export-option" data-filter="archived" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Archived Only</button>
                                </div>
                            </div>
                            <div class="xcb-export-dropdown" style="position: relative;">
                                <button id="xcbExportNotesCSV" class="xcb-request-btn xcb-request-btn-bordered xcb-notes-export-trigger" style="padding: 6px 12px; font-size: 11px;"><i class="ph-bold ph-file-csv"></i> Export CSV <i class="ph-bold ph-caret-down" style="font-size: 10px; margin-left: 4px;"></i></button>
                                <div class="xcb-notes-export-menu" data-format="csv" style="display: none; position: absolute; top: 100%; right: 0; background: var(--xcb-panel-bg); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 4px; z-index: 100; min-width: 150px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                                    <button class="xcb-notes-export-option" data-filter="all" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">All Notes</button>
                                    <button class="xcb-notes-export-option" data-filter="active" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Active Only</button>
                                    <button class="xcb-notes-export-option" data-filter="archived" style="display: block; width: 100%; text-align: left; padding: 8px 12px; background: transparent; border: none; color: var(--xcb-panel-text); font-size: 11px; cursor: pointer; border-radius: 4px;">Archived Only</button>
                                </div>
                            </div>
                            <label class="xcb-request-btn xcb-request-btn-bordered xcb-request-btn-import" style="padding: 6px 12px; cursor: pointer; font-size: 11px;">
                                <i class="ph-bold ph-file-arrow-down"></i> Import CSV
                                <input type="file" id="xcbImportNotesCSV" accept=".csv" style="display: none;">
                            </label>
                        </div>
                    </div>

                    <!-- Status Filters -->
                    <div class="xcb-status-filters" id="xcbNoteFilters">
                        <button class="xcb-status-filter xcb-note-status-filter" data-filter="all">All (${notes.length})</button>
                        <button class="xcb-status-filter xcb-note-status-filter active" data-filter="active">Active (${activeNotes.length})</button>
                        <button class="xcb-status-filter xcb-note-status-filter" data-filter="archived">Archived (${archivedNotes.length})</button>
                        ${deletedNotes.length > 0 ? `<button class="xcb-status-filter xcb-note-status-filter" data-filter="deleted" style="border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444);"><i class="ph-bold ph-trash"></i> Deleted (${deletedNotes.length})</button>` : ""}
                    </div>

                    <!-- Search and Sort -->
                    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
                        <input type="text" id="xcbSearchNotes" placeholder="Search by username, comment, or note..." style="flex: 1; padding: 8px; box-sizing: border-box;">
                        <select id="xcbNoteSortOrder" style="padding: 6px 10px; border-radius: 4px; font-size: 12px;" title="Sort order">
                            <option value="recent" ${settings.notesSortOrder === "recent" ? "selected" : ""}>Recent First</option>
                            <option value="oldest" ${settings.notesSortOrder === "oldest" ? "selected" : ""}>Oldest First</option>
                            <option value="alpha-user" ${settings.notesSortOrder === "alpha-user" ? "selected" : ""}>Username A → Z</option>
                            <option value="alpha-user-desc" ${settings.notesSortOrder === "alpha-user-desc" ? "selected" : ""}>Username Z → A</option>
                            <option value="alpha-tag" ${settings.notesSortOrder === "alpha-tag" ? "selected" : ""}>Tag A → Z</option>
                        </select>
                    </div>

                    <!-- Tag Filter -->
                    <div id="xcbNotesTagFilter" style="margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 5px; align-items: center;">
                        <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-right: 5px;">Filter by tag:</span>
                        ${buildTagFilterHtml()}
                        <button id="xcbClearNoteFilters" style="padding: 3px 8px; font-size: 10px; border-radius: 3px; border: 1px solid var(--xcb-panel-border, #666); background: transparent; color: var(--xcb-panel-text-muted, #888); cursor: pointer; display: none;">Clear</button>
                    </div>

                    <!-- Sections Management -->
                    <div id="xcbNoteSectionsBar" style="margin-bottom: 10px; padding: 8px; background: var(--xcb-panel-bg, #1a1a2e); border-radius: 6px; border: 1px solid #444;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 11px; color: var(--xcb-accent-purple, #8b5cf6); font-weight: bold;"><i class="ph-bold ph-folder"></i> Sections</span>
                                <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">(${noteSections.length} sections)</span>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button id="xcbToggleSectionView" class="xcb-section-view-btn" style="padding: 4px 10px; font-size: 10px; background: ${settings.noteSectionViewEnabled ? "var(--xcb-notes-color, #8b5cf6)" : "var(--xcb-panel-secondary-bg, #333)"}; border: 1px solid var(--xcb-notes-color, #8b5cf6); color: ${settings.noteSectionViewEnabled ? "var(--xcb-btn-text, #fff)" : "var(--xcb-notes-color, #8b5cf6)"}; border-radius: 4px; cursor: pointer;" title="Toggle section view">
                                    ${settings.noteSectionViewEnabled ? '<i class="ph-bold ph-eye"></i> Hide Sections' : '<i class="ph-bold ph-eye-slash"></i> Show Sections'}
                                </button>
                                <button id="xcbManageNoteSections" style="padding: 4px 10px; font-size: 10px; background: var(--xcb-panel-secondary-bg, #333); border: 1px solid var(--xcb-panel-border, #555); color: var(--xcb-panel-text-secondary, #aaa); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-gear"></i> Manage</button>
                                <button id="xcbAddNoteSection" style="padding: 4px 10px; font-size: 10px; background: var(--xcb-notes-color, #8b5cf6); border: 1px solid rgba(255, 255, 255, 0.2); color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer;">+ Add Section</button>
                            </div>
                        </div>

                        <!-- Section Tree (collapsible) -->
                        <div id="xcbSectionTreeContainer" style="display: ${settings.noteSectionViewEnabled ? "block" : "none"}; margin-top: 10px; max-height: 200px; overflow-y: auto;">
                            ${buildSectionTreeHtml()}
                        </div>
                    </div>

                    <!-- Section Filter Indicator -->
                    ${buildSectionFilterIndicator()}

                    <!-- Bulk Actions Bar -->
                    <div id="xcbNotesBulkActionsBar" style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; padding: 8px 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--xcb-panel-text-secondary, #ccc);">
                            <input type="checkbox" id="xcbSelectAllNotes" style="width: 16px; height: 16px;">
                            Select All
                        </label>
                        <span id="xcbNotesSelectedCount" style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-left: 8px;">(0 selected)</span>
                        <div style="flex: 1;"></div>
                        <button id="xcbBulkMoveToSection" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-purple, #8b5cf6); color: var(--xcb-accent-purple, #8b5cf6); display: none;" title="Move selected notes to section"><i class="ph-bold ph-folder"></i> Move to Section</button>
                        <button id="xcbBulkUnarchiveNotes" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-success, #22c55e); color: var(--xcb-accent-success, #22c55e); display: none;" title="Return selected notes to pending"><i class="ph-bold ph-arrow-counter-clockwise"></i> Return to Pending</button>
                        <button id="xcbBulkArchiveNotes" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; display: none;" title="Mark selected notes as completed"><i class="ph-bold ph-check"></i> Mark Completed</button>
                        <button id="xcbBulkDeleteNotes" class="xcb-request-btn xcb-request-btn-bordered" style="padding: 4px 10px; font-size: 11px; border-color: var(--xcb-accent-danger, #ef4444); color: var(--xcb-accent-danger, #ef4444); display: none;" title="Delete selected notes"><i class="ph-bold ph-trash"></i> Delete</button>
                    </div>

                    <!-- Notes List (All notes with data-status for filtering) -->
                    <div id="xcbNotesList" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;">
                        ${buildNotesListHtml()}
                    </div>
                </div>
            </div>`;
  }
  function renderSettingsTab(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const {
      initialTab,
      settings,
      panelSize,
      stats,
      blocklistCount,
      trustedlistCount,
      getVerifiedUsername: getVerifiedUsername2,
      getVerifiedRank: getVerifiedRank2,
      getPermanentWhitelist: getPermanentWhitelist2,
      getCustomReasons: getCustomReasons2,
      getBackupHistory: getBackupHistory2,
      getContrastColor: getContrastColor2,
      maxCustomTags,
      mankeyDoodlePfp: mankeyDoodlePfp2,
      uncleSamurottPfp: uncleSamurottPfp2
    } = data;
    return `
            <!-- SETTINGS TAB -->
            <div id="xcbSettingsTab" class="xcb-tab-content ${initialTab === "settings" ? "xcb-tab-content-active" : ""}">

                <!-- Jump to Section Navigation -->
                <div style="margin-bottom: 15px; padding: 10px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                    <div style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Jump to Section:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        <button class="xcb-jump-btn" data-section="xcbSectionGettingStarted" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-success, #22c55e); color: var(--xcb-accent-success, #22c55e); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-rocket"></i> Start/Account</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionDisplay" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-info, #06b6d4); color: var(--xcb-accent-info, #06b6d4); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-monitor"></i> Display</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionTheme" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-primary); color: var(--xcb-primary); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-palette"></i> Theme</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionFeatures" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-warning, #f59e0b); color: var(--xcb-accent-warning, #f59e0b); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-gear"></i> Features</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionReplies" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-success-alt, #10b981); color: var(--xcb-accent-success-alt, #10b981); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-chat-dots"></i> Replies</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionData" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-purple, #8b5cf6); color: var(--xcb-accent-purple, #8b5cf6); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-floppy-disk"></i> Data</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionDanger" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-danger, #dc2626); color: var(--xcb-accent-danger, #dc2626); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-warning"></i> Danger</button>
                        <button class="xcb-jump-btn" data-section="xcbSectionCredits" style="padding: 5px 10px; font-size: 11px; background: var(--xcb-panel-secondary-bg, #3a3a4e); border: 1px solid var(--xcb-accent-purple, #8b5cf6); color: var(--xcb-accent-purple, #8b5cf6); border-radius: 4px; cursor: pointer;"><i class="ph-bold ph-heart"></i> Credits</button>
                    </div>
                </div>


                <!-- ═══════════════════ GETTING STARTED & ACCOUNT ═══════════════════ -->
                <div id="xcbSectionGettingStarted" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-success, #22c55e); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-success-faded, #22c55e40);"><i class="ph-bold ph-rocket"></i> Getting Started & Account</div>

                <div class="xcb-section" id="xcbSectionAccountVerification" style="border: 2px solid ${getVerifiedUsername2() ? "var(--xcb-accent-success, #22c55e)" : "var(--xcb-accent-warning, #f59e0b)"};">
                    ${getVerifiedUsername2() ? `
                        <div class="xcb-section-title"><i class="ph-bold ph-user-check"></i> Your Verified Account</div>
                        <p style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 12px;">
                            Your account was verified during setup. This ensures buttons don't appear on your own comments.
                        </p>
                        <div style="background: var(--xcb-panel-bg, #1a1a2e); padding: 12px; border-radius: 6px; border: 1px solid var(--xcb-accent-success-faded, #22c55e40);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="ph-bold ph-user-check" style="font-size: 24px; color: var(--xcb-accent-success, #22c55e);"></i>
                                <div>
                                    <div style="font-size: 14px; color: var(--xcb-accent-success, #22c55e); font-weight: bold;">${getVerifiedUsername2()}</div>
                                    ${getVerifiedRank2() ? `<div style="font-size: 11px; color: ${getVerifiedRank2() === "Member" ? "var(--xcb-accent-warning, #f59e0b)" : "var(--xcb-accent-success, #22c55e)"};">${getVerifiedRank2()}</div>` : ""}
                                </div>
                            </div>
                            <button id="xcbReVerifyAccount" style="margin-top: 10px; padding: 6px 12px; background: var(--xcb-panel-tertiary-bg); border: 1px solid var(--xcb-panel-border); color: var(--xcb-muted); border-radius: 4px; cursor: pointer; font-size: 11px;">
                                <i class="ph-bold ph-arrows-clockwise"></i> Re-verify Account
                            </button>
                        </div>
                    ` : `
                        <div class="xcb-section-title"><i class="ph-bold ph-user"></i> Account Verification</div>
                        <p style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 12px;">
                            Verify your account to ensure buttons don't appear on your own comments.
                        </p>
                        <div style="background: var(--xcb-panel-bg, #1a1a2e); padding: 12px; border-radius: 6px; border: 1px solid var(--xcb-accent-warning-faded, #f59e0b40);">
                            <div style="color: var(--xcb-accent-warning, #f59e0b); margin-bottom: 10px;">
                                <i class="ph-bold ph-warning"></i> Account not verified
                            </div>
                            <p style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 10px;">
                                Go to your Account page to verify your username and rank.
                            </p>
                            <button id="xcbVerifyAccount" style="padding: 8px 14px; background: var(--xcb-accent-info, #3b82f6); border: none; color: var(--xcb-btn-text, #fff); border-radius: 4px; cursor: pointer; font-size: 12px;">
                                <i class="ph-bold ph-arrow-right"></i> Go to Account Page
                            </button>
                        </div>
                    `}
                </div>

                <div class="xcb-section" id="xcbHelpSection">
                    <div class="xcb-section-title"><i class="ph-bold ph-book-open-text"></i> Help & Guided Tour</div>
                    <label class="xcb-checkbox-label" style="margin-bottom: 8px;">
                        <input type="checkbox" id="xcbShowHelpByDefault" ${settings.showHelpByDefault ? "checked" : ""}>
                        Auto-show help boxes when opening tabs
                    </label>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0 0 10px 22px;">Recommended for new users. Disable once you're familiar with the app.</p>
                    <button id="xcbRestartTour" style="background: var(--xcb-accent-purple, #8b5cf6); color: var(--xcb-btn-text, #fff); border: 1px solid var(--xcb-btn-border, rgba(255, 255, 255, 0.2)); padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: bold;">
                        <i class="ph-bold ph-book-open-text"></i> Start Guided Tour
                    </button>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 6px 0 0 0;">Take a step-by-step walkthrough of all features.</p>
                </div>

                <div class="xcb-section" id="xcbSectionUploaderResources">
                    <div class="xcb-section-title"><i class="ph-bold ph-books"></i> Uploader Resources</div>
                    <p style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 12px;">Helpful links and resources for 1337x uploaders:</p>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <a href="https://1337x-to.github.io/" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-primary); border-radius: 6px; text-decoration: none; transition: all 0.2s ease;">
                            <span style="font-size: 18px;"><i class="ph-bold ph-book-open"></i></span>
                            <div>
                                <div style="color: var(--xcb-primary); font-weight: bold; font-size: 12px;">Uploader Guide & FAQ</div>
                                <div style="color: var(--xcb-panel-text-muted, #888); font-size: 10px;">Comprehensive guide for uploaders - tutorials, tips, and best practices</div>
                            </div>
                        </a>
                        <a href="https://1337x.to/rules" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-accent-warning, #f59e0b); border-radius: 6px; text-decoration: none; transition: all 0.2s ease;">
                            <span style="font-size: 18px;"><i class="ph-bold ph-scroll"></i></span>
                            <div>
                                <div style="color: var(--xcb-accent-warning, #f59e0b); font-weight: bold; font-size: 12px;">Site Rules</div>
                                <div style="color: var(--xcb-panel-text-muted, #888); font-size: 10px;">Official 1337x rules - important for all uploaders to know</div>
                            </div>
                        </a>
                        <a href="https://chat.1337x.to/" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-accent-success, #22c55e); border-radius: 6px; text-decoration: none; transition: all 0.2s ease;">
                            <span style="font-size: 18px;"><i class="ph-bold ph-chat-dots"></i></span>
                            <div>
                                <div style="color: var(--xcb-accent-success, #22c55e); font-weight: bold; font-size: 12px;">Staff Chat Room</div>
                                <div style="color: var(--xcb-panel-text-muted, #888); font-size: 10px;">Contact staff, ask questions, and get help from moderators</div>
                            </div>
                        </a>
                    </div>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 10px 0 0 0;"><i class="ph-bold ph-lightbulb" style="color: var(--xcb-accent-warning, #f59e0b);"></i> <strong>Tip:</strong> The chat room is the best place to contact staff for account issues, upload questions, or report problems.</p>
                </div>

                <div class="xcb-section" id="xcbWhitelistSection">
                    <div class="xcb-section-title">Auto-Whitelist</div>
                    <p style="color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">These users are automatically ignored (no block/trust buttons shown):</p>
                    <ul style="color: var(--xcb-panel-text-secondary, #aaa); margin: 5px 0 10px 0; padding-left: 20px;">
                        <li><strong>Your username:</strong> ${getVerifiedUsername2() || '<em style="color: var(--xcb-accent-warning, #f59e0b);">Not verified</em>'}</li>
                        <li><strong>Site-trusted users:</strong> VIPs and Moderators (detected by CSS class, shown with badges)</li>
                    </ul>
                    <div style="margin-top: 10px;">
                        <div style="color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Permanent Whitelist:</strong> <span style="color: var(--xcb-panel-text-dim, #666);">(users you never want to see block/trust buttons for)</span></div>
                        <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                            <input type="text" id="xcbNewWhitelistUser" placeholder="Username to whitelist..." style="flex: 1;">
                            <button class="xcb-add-btn" id="xcbAddWhitelistUser" style="background: var(--xcb-accent-indigo, #6366f1);">Add</button>
                        </div>
                        <div id="xcbWhitelistUsers" style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${getPermanentWhitelist2().length === 0 ? '<span style="color: var(--xcb-panel-text-dim, #666);">No users in permanent whitelist</span>' : getPermanentWhitelist2().map(
      (u) => `
                                <span class="xcb-whitelist-tag" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; background: #6366f120; border: 1px solid #6366f1; border-radius: 4px; color: var(--xcb-panel-text, #e0e0e0);">
                                    ${u}
                                    <button class="xcb-whitelist-remove" data-user="${u}" style="background: transparent; border: none; color: var(--xcb-accent-danger, #ff6b6b); cursor: pointer; padding: 0;" title="Remove">✕</button>
                                </span>
                              `
    ).join("")}
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════ DISPLAY OPTIONS ═══════════════════ -->
                <div id="xcbSectionDisplay" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-info, #06b6d4); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-info, #06b6d4)40;"><i class="ph-bold ph-monitor"></i> Display Options</div>

                <div class="xcb-section" id="xcbDisplaySection">
                    <div class="xcb-section-title">Panel Settings</div>
                    <div>
                        <span style="font-size: 12px; color: var(--xcb-panel-text-muted, #888); margin-right: 10px;">Panel Size:</span>
                        <select id="xcbPanelSize" class="xcb-size-select">
                            <option value="small" ${panelSize === "small" ? "selected" : ""}>Small</option>
                            <option value="medium" ${panelSize === "medium" ? "selected" : ""}>Medium</option>
                            <option value="large" ${panelSize === "large" ? "selected" : ""}>Large</option>
                            <option value="custom" ${panelSize === "custom" ? "selected" : ""}>Custom (drag to resize)</option>
                        </select>
                    </div>
                    <div style="margin-top: 10px;">
                        <span style="font-size: 12px; color: var(--xcb-panel-text-muted, #888); margin-right: 10px;">Button Position:</span>
                        <select id="xcbButtonPosition" class="xcb-size-select">
                            <option value="bottom-right" ${(settings.buttonPosition || "bottom-right") === "bottom-right" ? "selected" : ""}>Bottom Right</option>
                            <option value="bottom-left" ${settings.buttonPosition === "bottom-left" ? "selected" : ""}>Bottom Left</option>
                            <option value="top-right" ${settings.buttonPosition === "top-right" ? "selected" : ""}>Top Right</option>
                            <option value="top-left" ${settings.buttonPosition === "top-left" ? "selected" : ""}>Top Left</option>
                        </select>
                        <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 4px 0 0 0;">Position of the settings button on the screen.</p>
                    </div>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--xcb-panel-border, #444);">
                        <div style="font-size: 12px; color: var(--xcb-accent-purple, #8b5cf6); font-weight: bold; margin-bottom: 10px;">📅 Date & Time Format</div>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                            <div>
                                <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); display: block; margin-bottom: 4px;">Date Format:</span>
                                <select id="xcbDateFormat" class="xcb-size-select">
                                    <option value="MDY" ${(settings.dateFormat || "MDY") === "MDY" ? "selected" : ""}>Jan 15, 2024 (US)</option>
                                    <option value="DMY" ${settings.dateFormat === "DMY" ? "selected" : ""}>15 Jan 2024 (EU/UK)</option>
                                    <option value="YMD" ${settings.dateFormat === "YMD" ? "selected" : ""}>2024 Jan 15 (ISO)</option>
                                </select>
                            </div>
                            <div>
                                <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); display: block; margin-bottom: 4px;">Time Format:</span>
                                <select id="xcbTimeFormat" class="xcb-size-select">
                                    <option value="12h" ${(settings.timeFormat || "12h") === "12h" ? "selected" : ""}>12-hour (1:30 PM)</option>
                                    <option value="24h" ${settings.timeFormat === "24h" ? "selected" : ""}>24-hour (13:30)</option>
                                </select>
                            </div>
                        </div>
                        <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 6px 0 0 0;">Used for timestamp displays throughout the panel.</p>
                    </div>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--xcb-panel-border, #444);">
                        <button class="xcb-add-btn" id="xcbSaveDisplayOptions" style="background: var(--xcb-primary);">Save Display Options</button>
                    </div>
                </div>

                <!-- ═══════════════════ THEME & APPEARANCE ═══════════════════ -->
                <div id="xcbSectionTheme" style="font-size: 11px; font-weight: bold; color: var(--xcb-primary); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-primary)40;"><i class="ph-bold ph-palette"></i> Theme & Appearance</div>

                <div class="xcb-section" id="xcbThemeSection">
                    <div class="xcb-section-title">Theme Presets</div>
                    <p style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 10px;">Choose a preset theme or customize colors and fonts.</p>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Select Theme:</strong></div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button class="xcb-theme-btn mankey-theme-classic ${settings.theme === "classic" ? "xcb-theme-active" : ""}" data-theme="classic">🎨 Classic</button>
                            <button class="xcb-theme-btn mankey-theme-1337x ${settings.theme === "1337x" ? "xcb-theme-active" : ""}" data-theme="1337x">💀 1337x</button>
                            <button class="xcb-theme-btn mankey-theme-typewriter ${settings.theme === "typewriter" ? "xcb-theme-active" : ""}" data-theme="typewriter">📜 Typewriter</button>
                            <button class="xcb-theme-btn mankey-theme-colorblind ${settings.theme === "colorblind" ? "xcb-theme-active" : ""}" data-theme="colorblind">👁️ Colorblind</button>
                            <button class="xcb-theme-btn mankey-theme-midnight ${settings.theme === "midnight" ? "xcb-theme-active" : ""}" data-theme="midnight">🌙 Midnight</button>
                            <button class="xcb-theme-btn mankey-theme-ocean ${settings.theme === "ocean" ? "xcb-theme-active" : ""}" data-theme="ocean">🌊 Ocean</button>
                            <button class="xcb-theme-btn mankey-theme-monkey ${settings.theme === "monkey" ? "xcb-theme-active" : ""}" data-theme="monkey">🐵 Monkey</button>
                            <button class="xcb-theme-btn mankey-theme-candy ${settings.theme === "candy" ? "xcb-theme-active" : ""}" data-theme="candy">🍬 Candy</button>
                            ${(settings.importedThemes || []).map((theme) => `
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <button class="xcb-theme-btn ${settings.theme === `custom-${theme.id}` ? "xcb-theme-active" : ""}" data-theme="custom-${theme.id}" style="background: #2d2520 !important; color: #d4893a !important; border: 1px dashed #d4893a !important;">✨ ${theme.name}</button>
                                <button class="xcb-delete-custom-theme" data-theme-id="${theme.id}" title="Delete custom theme" style="background: transparent !important; border: 1px solid var(--xcb-accent-danger, #ef4444) !important; color: var(--xcb-accent-danger, #ef4444) !important; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0;">&times;</button>
                            </div>
                            `).join("")}
                        </div>
                        <div style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin-top: 5px;">Colorblind theme uses blue/orange palette optimized for deuteranopia & protanopia</div>
                        <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                            <button id="xcbExportTheme" style="padding: 6px 12px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-panel-text-secondary, #aaa); border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-export"></i> Export Theme</button>
                            <button id="xcbImportTheme" style="padding: 6px 12px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-panel-text-secondary, #aaa); border-radius: 4px; cursor: pointer; font-size: 11px;"><i class="ph-bold ph-download"></i> Import Theme</button>
                            <button id="xcbSaveAsThemeTop" style="padding: 6px 12px; background: var(--xcb-accent-purple, #8b5cf6); border: 1px solid var(--xcb-accent-purple, #8b5cf6); color: #fff; border-radius: 4px; cursor: pointer; font-size: 11px;" title="Save modified appearance as a new named theme"><i class="ph-bold ph-floppy-disk"></i> Save as Theme</button>
                            <button id="xcbRevertChangesTop" style="padding: 6px 12px; background: transparent; border: 1px solid var(--xcb-panel-border, #555); color: var(--xcb-panel-text-secondary, #aaa); border-radius: 4px; cursor: pointer; font-size: 11px;" title="Revert all color pickers and fonts to the current saved theme"><i class="ph-bold ph-arrow-counter-clockwise"></i> Revert Changes</button>
                            <input type="file" id="xcbThemeFileInput" accept=".json" style="display: none;">
                        </div>
                    </div>

                    <!-- ═══════════ WEBSITE ELEMENTS (1337x Page) ═══════════ -->
                    <div style="font-size: 10px; font-weight: bold; color: var(--xcb-accent-info, #06b6d4); text-transform: uppercase; letter-spacing: 0.5px; margin: 15px 0 10px 0; padding: 6px 10px; background: var(--xcb-accent-info, #06b6d4)15; border-radius: 4px; border-left: 3px solid var(--xcb-accent-info, #06b6d4);"><i class="ph-bold ph-globe"></i> Website Elements (1337x Page)</div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Comment Action Buttons:</strong> <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">(buttons that appear on hover menu)</span></div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <!-- Reply Button Group -->
                            <div style="display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                                <span style="font-size: 10px; font-weight: 600; color: var(--xcb-panel-text-secondary, #aaa); text-transform: uppercase; letter-spacing: 0.5px;">Reply</span>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonReply" value="${settings.customColors.buttonReply || "#3b82f6"}">
                                    <span style="font-size: 11px;">Background</span>
                                </div>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonReplyText" value="${settings.customColors.buttonReplyText || "#ffffff"}">
                                    <span style="font-size: 11px;">Text</span>
                                </div>
                            </div>
                            <!-- Request Button Group -->
                            <div style="display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                                <span style="font-size: 10px; font-weight: 600; color: var(--xcb-panel-text-secondary, #aaa); text-transform: uppercase; letter-spacing: 0.5px;">Request</span>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonRequest" value="${settings.customColors.buttonRequest || "#14b8a6"}">
                                    <span style="font-size: 11px;">Background</span>
                                </div>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonRequestText" value="${settings.customColors.buttonRequestText || "#ffffff"}">
                                    <span style="font-size: 11px;">Text</span>
                                </div>
                            </div>
                            <!-- Note Button Group -->
                            <div style="display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                                <span style="font-size: 10px; font-weight: 600; color: var(--xcb-panel-text-secondary, #aaa); text-transform: uppercase; letter-spacing: 0.5px;">Note</span>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonNote" value="${settings.customColors.buttonNote || "#8b5cf6"}">
                                    <span style="font-size: 11px;">Background</span>
                                </div>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonNoteText" value="${settings.customColors.buttonNoteText || "#ffffff"}">
                                    <span style="font-size: 11px;">Text</span>
                                </div>
                            </div>
                        </div>
                        <div id="xcbActionButtonPreview" style="margin-top: 12px;">
                            <div style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;"><i class="ph-bold ph-globe"></i> Live Preview (1337x comment box):</div>
                            <!-- Mock 1337x comment box -->
                            <div style="position: relative; background: #fafafa; border: 1px solid #d1d1d1; border-radius: 5px; padding: 10px 14px; margin-left: 20px;">
                                <!-- Speech bubble arrow -->
                                <div style="position: absolute; left: -8px; top: 15px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #d1d1d1;"></div>
                                <div style="position: absolute; left: -6px; top: 15px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #fafafa;"></div>
                                <!-- Username row -->
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                                    <a style="color: #92b347; font-weight: bold; font-size: 12px; text-decoration: none;">SampleUser</a>
                                    <span style="color: #999; font-size: 10px;"><i class="ph ph-clock"></i> 2 hours ago</span>
                                </div>
                                <!-- Comment text -->
                                <p style="color: #656565; font-size: 12px; margin: 0 0 10px 0; font-family: 'Opensans Regular', sans-serif;">Thanks for the upload! Works great.</p>
                                <!-- Action buttons -->
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <button class="xcb-action-btn-preview" data-btn="reply" style="background: ${settings.customColors.buttonReply || "#3b82f6"}; color: ${settings.customColors.buttonReplyText || "#ffffff"}; padding: 4px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; border: none; cursor: default;"><i class="ph-bold ph-arrow-bend-up-left"></i> Reply</button>
                                    <button class="xcb-action-btn-preview" data-btn="request" style="background: ${settings.customColors.buttonRequest || "#14b8a6"}; color: ${settings.customColors.buttonRequestText || "#ffffff"}; padding: 4px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; border: none; cursor: default;"><i class="ph-bold ph-plus-circle"></i> Request</button>
                                    <button class="xcb-action-btn-preview" data-btn="note" style="background: ${settings.customColors.buttonNote || "#8b5cf6"}; color: ${settings.customColors.buttonNoteText || "#ffffff"}; padding: 4px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; border: none; cursor: default;"><i class="ph-bold ph-note-pencil"></i> Note</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Block Badge Colors:</strong></div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;">
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorSpammer" value="${settings.customColors.badgeSpammer}">
                                <span style="font-size: 11px;">Spammer</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorRude" value="${settings.customColors.badgeRude}">
                                <span style="font-size: 11px;">Rude/Toxic</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorBeggar" value="${settings.customColors.badgeBeggar}">
                                <span style="font-size: 11px;">Beggar</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorOfftopic" value="${settings.customColors.badgeOfftopic}">
                                <span style="font-size: 11px;">Off-topic</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorTroll" value="${settings.customColors.badgeTroll}">
                                <span style="font-size: 11px;">Troll</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorAnnoying" value="${settings.customColors.badgeAnnoying || "#854d0e"}">
                                <span style="font-size: 11px;">Annoying</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorUnwanted" value="${settings.customColors.badgeUnwanted || "#7c3aed"}">
                                <span style="font-size: 11px;">Unwanted Advice</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Trust Badge Colors:</strong></div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;">
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorUploader" value="${settings.customColors.badgeUploader || "#22c55e"}">
                                <span style="font-size: 11px;">Uploader</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorHelpful" value="${settings.customColors.badgeHelpful || "#06b6d4"}">
                                <span style="font-size: 11px;">Helpful</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorRequester" value="${settings.customColors.badgeRequester || "#f97316"}">
                                <span style="font-size: 11px;">Requester</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorFriend" value="${settings.customColors.badgeFriend || "#ec4899"}">
                                <span style="font-size: 11px;">Friend</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorSeeding" value="${settings.customColors.badgeSeeding || "#b91c1c"}">
                                <span style="font-size: 11px;">Seeding Issues</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorThankful" value="${settings.customColors.badgeThankful || "#10b981"}">
                                <span style="font-size: 11px;">Thankful</span>
                            </div>
                        </div>
                        <div id="xcbBadgeColorPreview" style="margin-top: 12px;">
                            <div style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;"><i class="ph-bold ph-globe"></i> Live Preview (1337x comment box):</div>
                            <div style="font-size: 9px; color: var(--xcb-panel-text-dim, #666); margin-bottom: 8px;"><i class="ph-bold ph-info"></i> Username colors can be changed in Control Panel Appearance below.</div>
                            <!-- Mock 1337x comment boxes showing different badge types -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <!-- Hard Block example -->
                                <div style="position: relative; background: #fafafa; border: 1px solid #d1d1d1; border-radius: 5px; padding: 8px 12px; margin-left: 20px;">
                                    <div style="position: absolute; left: -8px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #d1d1d1;"></div>
                                    <div style="position: absolute; left: -6px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #fafafa;"></div>
                                    <div style="font-size: 9px; color: #999; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Hard Block (hidden by default):</div>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
                                        <a class="xcb-preview-username xcb-preview-username-blocked" style="color: ${settings.customColors.blockedUsernameColor || "#ff6b6b"}; font-weight: bold; font-size: 12px; text-decoration: none;">BlockedUser</a>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorSpammer" style="background: ${settings.customColors.badgeSpammer}; color: ${getContrastColor2(settings.customColors.badgeSpammer)}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Spammer</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorRude" style="background: ${settings.customColors.badgeRude}; color: ${getContrastColor2(settings.customColors.badgeRude)}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Rude</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorBeggar" style="background: ${settings.customColors.badgeBeggar}; color: ${getContrastColor2(settings.customColors.badgeBeggar)}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Beggar</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorTroll" style="background: ${settings.customColors.badgeTroll}; color: ${getContrastColor2(settings.customColors.badgeTroll)}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Troll</span>
                                    </div>
                                </div>
                                <!-- Soft Block example -->
                                <div style="position: relative; background: #fafafa; border: 1px solid #d1d1d1; border-radius: 5px; padding: 8px 12px; margin-left: 20px;">
                                    <div style="position: absolute; left: -8px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #d1d1d1;"></div>
                                    <div style="position: absolute; left: -6px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #fafafa;"></div>
                                    <div style="font-size: 9px; color: #999; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Soft Block (visible, tagged):</div>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
                                        <a class="xcb-preview-username xcb-preview-username-blocked" style="color: ${settings.customColors.blockedUsernameColor || "#ff6b6b"}; font-weight: bold; font-size: 12px; text-decoration: none;">AnnoyingUser</a>
                                        <span class="xcb-badge-color-preview xcb-badge-soft-preview" data-input="xcbColorOfftopic" style="background: transparent; color: ${settings.customColors.badgeOfftopic}; border: 1px solid ${settings.customColors.badgeOfftopic}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Off-topic</span>
                                        <span class="xcb-badge-color-preview xcb-badge-soft-preview" data-input="xcbColorAnnoying" style="background: transparent; color: ${settings.customColors.badgeAnnoying || "#854d0e"}; border: 1px solid ${settings.customColors.badgeAnnoying || "#854d0e"}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Annoying</span>
                                        <span class="xcb-badge-color-preview xcb-badge-soft-preview" data-input="xcbColorUnwanted" style="background: transparent; color: ${settings.customColors.badgeUnwanted || "#7c3aed"}; border: 1px solid ${settings.customColors.badgeUnwanted || "#7c3aed"}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Unwanted</span>
                                    </div>
                                </div>
                                <!-- Trust Tags example -->
                                <div style="position: relative; background: #fafafa; border: 1px solid #d1d1d1; border-radius: 5px; padding: 8px 12px; margin-left: 20px;">
                                    <div style="position: absolute; left: -8px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #d1d1d1;"></div>
                                    <div style="position: absolute; left: -6px; top: 12px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #fafafa;"></div>
                                    <div style="font-size: 9px; color: #999; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Trust Tags:</div>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
                                        <a class="xcb-preview-username xcb-preview-username-trusted" style="color: ${settings.customColors.trustedUsernameColor || "#4ade80"}; font-weight: bold; font-size: 12px; text-decoration: none;">TrustedUser</a>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorUploader" style="background: ${settings.customColors.badgeUploader || "#22c55e"}; color: ${getContrastColor2(settings.customColors.badgeUploader || "#22c55e")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Uploader</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorHelpful" style="background: ${settings.customColors.badgeHelpful || "#06b6d4"}; color: ${getContrastColor2(settings.customColors.badgeHelpful || "#06b6d4")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Helpful</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorRequester" style="background: ${settings.customColors.badgeRequester || "#f59e0b"}; color: ${getContrastColor2(settings.customColors.badgeRequester || "#f59e0b")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Requester</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorFriend" style="background: ${settings.customColors.badgeFriend || "#ec4899"}; color: ${getContrastColor2(settings.customColors.badgeFriend || "#ec4899")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Friend</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorSeeding" style="background: ${settings.customColors.badgeSeeding || "#b91c1c"}; color: ${getContrastColor2(settings.customColors.badgeSeeding || "#b91c1c")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Seeding</span>
                                        <span class="xcb-badge-color-preview xcb-badge-hard-preview" data-input="xcbColorThankful" style="background: ${settings.customColors.badgeThankful || "#10b981"}; color: ${getContrastColor2(settings.customColors.badgeThankful || "#10b981")}; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">Thankful</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Badge Text Color:</strong></div>
                        <select id="xcbBadgeTextMode" style="padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px;">
                            <option value="auto" ${settings.badgeTextMode === "auto" ? "selected" : ""}>Auto-contrast (recommended)</option>
                            <option value="white" ${settings.badgeTextMode === "white" ? "selected" : ""}>Always White</option>
                            <option value="black" ${settings.badgeTextMode === "black" ? "selected" : ""}>Always Black</option>
                        </select>
                        <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin-left: 8px;">Auto picks white/black based on background brightness</span>
                        <div id="xcbBadgeTextPreview" style="margin-top: 10px; padding: 10px; background: var(--xcb-section-bg); border-radius: 6px; border: 1px solid var(--xcb-panel-border);">
                            <div style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Preview (notice how auto-contrast changes text color based on brightness):</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                <span class="xcb-badge-preview-item" data-color="#ef4444" style="background: #ef4444; color: ${getContrastColor2("#ef4444")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Dark Red</span>
                                <span class="xcb-badge-preview-item" data-color="#facc15" style="background: #facc15; color: ${getContrastColor2("#facc15")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Yellow</span>
                                <span class="xcb-badge-preview-item" data-color="#22c55e" style="background: #22c55e; color: ${getContrastColor2("#22c55e")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Green</span>
                                <span class="xcb-badge-preview-item" data-color="#1e3a8a" style="background: #1e3a8a; color: ${getContrastColor2("#1e3a8a")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Navy</span>
                                <span class="xcb-badge-preview-item" data-color="#f0abfc" style="background: #f0abfc; color: ${getContrastColor2("#f0abfc")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Pink</span>
                                <span class="xcb-badge-preview-item" data-color="#0f172a" style="background: #0f172a; color: ${getContrastColor2("#0f172a")}; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">Black</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Badge/Tag Font:</strong> <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">(text inside badge labels like "Spammer", "Uploader")</span></div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                            <select id="xcbBadgeFontFamily" class="xcb-size-select">
                                <option value="inherit" ${(((_a = settings.badgeFont) == null ? void 0 : _a.family) || "inherit") === "inherit" ? "selected" : ""}>Default</option>
                                <option value="Arial, sans-serif" ${((_b = settings.badgeFont) == null ? void 0 : _b.family) === "Arial, sans-serif" ? "selected" : ""}>Arial</option>
                                <option value="'Segoe UI', sans-serif" ${((_c = settings.badgeFont) == null ? void 0 : _c.family) === "'Segoe UI', sans-serif" ? "selected" : ""}>Segoe UI</option>
                                <option value="Verdana, sans-serif" ${((_d = settings.badgeFont) == null ? void 0 : _d.family) === "Verdana, sans-serif" ? "selected" : ""}>Verdana</option>
                                <option value="'Courier New', monospace" ${((_e = settings.badgeFont) == null ? void 0 : _e.family) === "'Courier New', monospace" ? "selected" : ""}>Courier New</option>
                                <option value="Georgia, serif" ${((_f = settings.badgeFont) == null ? void 0 : _f.family) === "Georgia, serif" ? "selected" : ""}>Georgia</option>
                                ${(() => {
      var _a2;
      const presetFonts = ["inherit", "Arial, sans-serif", "'Segoe UI', sans-serif", "Verdana, sans-serif", "'Courier New', monospace", "Georgia, serif"];
      const currentFont = (_a2 = settings.badgeFont) == null ? void 0 : _a2.family;
      if (currentFont && !presetFonts.includes(currentFont)) {
        const displayName = currentFont.split(",")[0].replace(/['"]/g, "").trim();
        return `<option value="${currentFont}" selected>Custom: ${displayName}</option>`;
      }
      return "";
    })()}
                            </select>
                            <select id="xcbBadgeFontSize" class="xcb-size-select">
                                <option value="9px" ${(((_g = settings.badgeFont) == null ? void 0 : _g.size) || "11px") === "9px" ? "selected" : ""}>Small</option>
                                <option value="11px" ${(((_h = settings.badgeFont) == null ? void 0 : _h.size) || "11px") === "11px" ? "selected" : ""}>Medium</option>
                                <option value="13px" ${((_i = settings.badgeFont) == null ? void 0 : _i.size) === "13px" ? "selected" : ""}>Large</option>
                                <option value="15px" ${((_j = settings.badgeFont) == null ? void 0 : _j.size) === "15px" ? "selected" : ""}>X-Large</option>
                            </select>
                            <div id="xcbBadgeFontPreview" style="display: flex; gap: 6px; align-items: center;">
                                <span style="font-size: 10px; color: var(--xcb-panel-text-muted, #888);">Preview:</span>
                                <span class="xcb-badge-font-preview" style="background: ${settings.customColors.badgeSpammer}; color: ${getContrastColor2(settings.customColors.badgeSpammer)}; padding: 3px 8px; border-radius: 3px; font-family: ${((_k = settings.badgeFont) == null ? void 0 : _k.family) || "inherit"}; font-size: ${((_l = settings.badgeFont) == null ? void 0 : _l.size) || "11px"}; font-weight: 600;">Spammer</span>
                                <span class="xcb-badge-font-preview" style="background: ${settings.customColors.badgeUploader || "#22c55e"}; color: ${getContrastColor2(settings.customColors.badgeUploader || "#22c55e")}; padding: 3px 8px; border-radius: 3px; font-family: ${((_m = settings.badgeFont) == null ? void 0 : _m.family) || "inherit"}; font-size: ${((_n = settings.badgeFont) == null ? void 0 : _n.size) || "11px"}; font-weight: 600;">Uploader</span>
                            </div>
                        </div>
                    </div>

                    <div class="xcb-section" id="xcbCustomTagsSection" style="margin-top: 15px; padding: 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                        <div class="xcb-section-title" style="margin-bottom: 8px;">Custom Reason Tags <span id="xcbCustomTagCount" style="font-weight: normal; color: ${getCustomReasons2().length >= maxCustomTags ? "var(--xcb-accent-danger, #ef4444)" : "var(--xcb-panel-text-muted, #888)"};">(${getCustomReasons2().length}/${maxCustomTags})</span></div>
                        <p style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 10px;">Create your own reason tags with custom colors. <span style="color: var(--xcb-accent-warning, #f59e0b);">Max 20 characters per tag.</span></p>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; align-items: center;">
                            <input type="text" id="xcbNewReasonName" placeholder="Tag name (max 20 chars)..." maxlength="20" style="flex: 1; min-width: 150px; padding: 8px;" ${getCustomReasons2().length >= maxCustomTags ? "disabled" : ""}>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="color" id="xcbNewReasonColor" value="#8b5cf6" class="xcb-color-input" title="Tag color" ${getCustomReasons2().length >= maxCustomTags ? "disabled" : ""}>
                                <button class="xcb-add-btn" id="xcbAddCustomReason" style="background: ${getCustomReasons2().length >= maxCustomTags ? "var(--xcb-panel-secondary-bg, #666)" : "var(--xcb-accent-purple, #8b5cf6)"};" ${getCustomReasons2().length >= maxCustomTags ? "disabled" : ""}>Add Tag</button>
                            </div>
                        </div>
                        <div id="xcbCustomReasonsList" style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${getCustomReasons2().length === 0 ? '<span style="color: var(--xcb-panel-text-dim, #666); font-size: 12px;">No custom tags yet</span>' : getCustomReasons2().map(
      (r) => `
                                <div class="xcb-custom-tag" data-name="${r.name}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 4px; background: ${r.color}20; border: 1px solid ${r.color}; color: var(--xcb-panel-text, #e0e0e0);">
                                    <span class="xcb-reason-badge" style="background: ${r.color}; color: ${getContrastColor2(r.color)};">${r.name}</span>
                                    <input type="color" class="xcb-color-input xcb-tag-color-edit" value="${r.color}" data-name="${r.name}" title="Change color">
                                    <button class="xcb-tag-edit" data-name="${r.name}" data-color="${r.color}" style="background: transparent; border: none; color: var(--xcb-primary); cursor: pointer; font-size: 14px; padding: 2px 6px;" title="Edit tag name">✎</button>
                                    <button class="xcb-tag-delete" data-name="${r.name}" style="background: transparent; border: none; color: var(--xcb-accent-danger, #ff6b6b); cursor: pointer; font-size: 16px; padding: 2px 6px;" title="Delete tag">✕</button>
                                </div>
                            `
    ).join("")}
                        </div>
                    </div>

                    <!-- ═══════════ CONTROL PANEL APPEARANCE ═══════════ -->
                    <div style="font-size: 10px; font-weight: bold; color: var(--xcb-accent-purple, #8b5cf6); text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 10px 0; padding: 6px 10px; background: var(--xcb-accent-purple, #8b5cf6)15; border-radius: 4px; border-left: 3px solid var(--xcb-accent-purple, #8b5cf6);"><i class="ph-bold ph-sliders"></i> Control Panel Appearance</div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Panel Colors:</strong></div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;">
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorPanelBg" value="${settings.customColors.panelBg}">
                                <span style="font-size: 11px;">Background</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorPanelText" value="${settings.customColors.panelText}">
                                <span style="font-size: 11px;">Text</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorPanelBorder" value="${settings.customColors.panelBorder}">
                                <span style="font-size: 11px;">Inner Borders</span>
                            </div>
                        </div>
                        <div style="font-size: 9px; color: var(--xcb-panel-text-dim, #666); margin-top: 4px;"><i class="ph-bold ph-info"></i> Inner borders are section dividers. The main panel border &amp; header use the Primary color above.</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Panel Input Colors:</strong></div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;">
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorInputBg" value="${settings.customColors.inputBg}">
                                <span style="font-size: 11px;">Input Background</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorInputBorder" value="${settings.customColors.inputBorder}">
                                <span style="font-size: 11px;">Input Border</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorInputText" value="${settings.customColors.inputText}">
                                <span style="font-size: 11px;">Input Text</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Panel Button Colors:</strong></div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <!-- Primary Button Group -->
                            <div style="display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                                <span style="font-size: 10px; font-weight: 600; color: var(--xcb-panel-text-secondary, #aaa); text-transform: uppercase; letter-spacing: 0.5px;">Primary <span style="font-weight: normal; opacity: 0.7;">(+ header)</span></span>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonPrimary" value="${settings.customColors.buttonPrimary}">
                                    <span style="font-size: 11px;">Background</span>
                                </div>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonPrimaryText" value="${settings.customColors.buttonPrimaryText || "#ffffff"}">
                                    <span style="font-size: 11px;">Button Text</span>
                                </div>
                                <div style="font-size: 9px; color: var(--xcb-panel-text-dim, #666); margin-top: 2px;"><i class="ph-bold ph-info"></i> Also colors panel header, border &amp; accents</div>
                            </div>
                            <!-- Danger Button Group -->
                            <div style="display: flex; flex-direction: column; gap: 6px; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #444);">
                                <span style="font-size: 10px; font-weight: 600; color: var(--xcb-panel-text-secondary, #aaa); text-transform: uppercase; letter-spacing: 0.5px;">Danger <span style="font-weight: normal; opacity: 0.7;">(remove btns)</span></span>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonDanger" value="${settings.customColors.buttonDanger}">
                                    <span style="font-size: 11px;">Background</span>
                                </div>
                                <div class="xcb-color-row">
                                    <input type="color" class="xcb-color-input" id="xcbColorButtonDangerText" value="${settings.customColors.buttonDangerText || "#ffffff"}">
                                    <span style="font-size: 11px;">Button Text</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Username Highlight Colors:</strong> <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">(usernames in Block/Trust tabs)</span></div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorTrustedUsername" value="${settings.customColors.trustedUsernameColor || "#4ade80"}">
                                <span style="font-size: 11px;">Trusted Users</span>
                            </div>
                            <div class="xcb-color-row">
                                <input type="color" class="xcb-color-input" id="xcbColorBlockedUsername" value="${settings.customColors.blockedUsernameColor || "#ff6b6b"}">
                                <span style="font-size: 11px;">Blocked Users</span>
                            </div>
                        </div>
                        <div id="xcbUsernameColorPreview" style="margin-top: 10px; padding: 10px; background: var(--xcb-bg, #1a1a2e); border-radius: 6px; border: 1px solid var(--xcb-panel-border, #333);">
                            <div style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Live Preview: <span style="font-size: 9px; opacity: 0.7;">(shown on panel background)</span></div>
                            <div style="display: flex; gap: 20px; font-size: 12px;">
                                <span class="xcb-username-preview" data-type="trusted" style="color: ${settings.customColors.trustedUsernameColor || "#4ade80"}; font-weight: 600;"><i class="ph-bold ph-check-circle"></i> TrustedUser123</span>
                                <span class="xcb-username-preview" data-type="blocked" style="color: ${settings.customColors.blockedUsernameColor || "#ff6b6b"}; font-weight: 600;"><i class="ph-bold ph-prohibit"></i> BlockedUser456</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;"><strong>Panel/UI Font:</strong> <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">(text in this settings panel)</span></div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                            <select id="xcbFontFamily" class="xcb-size-select">
                                <option value="inherit" ${settings.customFont.family === "inherit" ? "selected" : ""}>Default</option>
                                <option value="Arial, sans-serif" ${settings.customFont.family === "Arial, sans-serif" ? "selected" : ""}>Arial</option>
                                <option value="'Segoe UI', sans-serif" ${settings.customFont.family === "'Segoe UI', sans-serif" ? "selected" : ""}>Segoe UI</option>
                                <option value="Verdana, sans-serif" ${settings.customFont.family === "Verdana, sans-serif" ? "selected" : ""}>Verdana</option>
                                <option value="'Courier New', monospace" ${settings.customFont.family === "'Courier New', monospace" ? "selected" : ""}>Courier New</option>
                                <option value="Georgia, serif" ${settings.customFont.family === "Georgia, serif" ? "selected" : ""}>Georgia</option>
                                <option value="'American Typewriter', 'Courier New', monospace" ${settings.customFont.family === "'American Typewriter', 'Courier New', monospace" ? "selected" : ""}>American Typewriter</option>
                                ${(() => {
      const presetFonts = ["inherit", "Arial, sans-serif", "'Segoe UI', sans-serif", "Verdana, sans-serif", "'Courier New', monospace", "Georgia, serif", "'American Typewriter', 'Courier New', monospace"];
      const currentFont = settings.customFont.family;
      if (currentFont && !presetFonts.includes(currentFont)) {
        const displayName = currentFont.split(",")[0].replace(/['"]/g, "").trim();
        return `<option value="${currentFont}" selected>Custom: ${displayName}</option>`;
      }
      return "";
    })()}
                            </select>
                            <select id="xcbFontSize" class="xcb-size-select">
                                <option value="11px" ${settings.customFont.size === "11px" ? "selected" : ""}>Small</option>
                                <option value="13px" ${settings.customFont.size === "13px" ? "selected" : ""}>Medium</option>
                                <option value="15px" ${settings.customFont.size === "15px" ? "selected" : ""}>Large</option>
                                <option value="17px" ${settings.customFont.size === "17px" ? "selected" : ""}>X-Large</option>
                                <option value="custom" ${!["11px", "13px", "15px", "17px"].includes(settings.customFont.size) ? "selected" : ""}>Custom...</option>
                            </select>
                            <input type="number" id="xcbFontSizeCustom" min="8" max="30" value="${parseInt(settings.customFont.size) || 13}" style="display: ${!["11px", "13px", "15px", "17px"].includes(settings.customFont.size) ? "block" : "none"}; width: 70px; padding: 6px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-primary); color: #fff; border-radius: 4px; text-align: center;">
                            <span id="xcbFontSizeCustomLabel" style="display: ${!["11px", "13px", "15px", "17px"].includes(settings.customFont.size) ? "inline" : "none"}; color: var(--xcb-panel-text-secondary, #aaa);">px (8-30)</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        <button class="xcb-add-btn" id="xcbSaveCustomize" style="background: var(--xcb-primary);">Apply Changes</button>
                        <button class="xcb-add-btn" id="xcbSaveAsNewTheme" style="background: var(--xcb-accent-purple, #8b5cf6);" title="Save modified appearance as a new named theme"><i class="ph-bold ph-floppy-disk"></i> Save as Theme</button>
                        <button class="xcb-edit-btn" id="xcbRevertChanges" title="Revert all color pickers and fonts to the current saved theme"><i class="ph-bold ph-arrow-counter-clockwise"></i> Revert Changes</button>
                    </div>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin-top: 8px;"><i class="ph-bold ph-lightbulb" style="color: var(--xcb-accent-warning, #f59e0b);"></i> <strong>Apply Changes</strong> saves your current appearance settings. <strong>Revert Changes</strong> restores values to the saved theme.</p>
                </div>

                <!-- ═══════════════════ FEATURES ═══════════════════ -->
                <div id="xcbSectionFeatures" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-warning, #f59e0b); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-warning-faded, #f59e0b40);"><i class="ph-bold ph-lightning"></i> Features</div>

                <div class="xcb-section" id="xcbCommentBehaviorSection">
                    <div class="xcb-section-title">Comment Behavior</div>
                    <label class="xcb-checkbox-label">
                        <input type="checkbox" id="xcbOnlyMyUploads" ${settings.onlyShowToolsOnMyUploads !== false ? "checked" : ""}>
                        Only show tools on my uploads
                        <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; margin-left: 22px; margin-top: 2px;">Hide Note/Request buttons and context menus on other uploaders' pages</span>
                    </label>
                    <label class="xcb-checkbox-label">
                        <input type="checkbox" id="xcbHideEntire" ${settings.hideEntireComment ? "checked" : ""}>
                        Hide entire comment box (not just text)
                        <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; margin-left: 22px; margin-top: 2px;">When enabled, blocked users' comments are completely hidden instead of just obscuring the text</span>
                    </label>
                    <label class="xcb-checkbox-label">
                        <input type="checkbox" id="xcbKeyboardShortcuts" ${settings.keyboardShortcuts !== false ? "checked" : ""}>
                        Enable keyboard shortcuts
                        <span style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); display: block; margin-left: 22px; margin-top: 2px;">B=Block, T=Trust, U=Undo, S=Settings (hover over username to use)</span>
                    </label>
                </div>

                <div class="xcb-section" id="xcbRequestSettingsSection">
                    <div class="xcb-section-title">Request Settings</div>
                    <label class="xcb-checkbox-label" style="margin-bottom: 5px;">
                        <input type="checkbox" id="xcbRequestsEnabled" ${settings.requestsEnabled !== false ? "checked" : ""}>
                        Enable Requests feature
                    </label>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0 0 8px 22px;">Your saved requests are preserved when disabled.</p>
                    <label class="xcb-checkbox-label" style="margin-bottom: 5px;">
                        <input type="checkbox" id="xcbRequestsPausedSetting" ${settings.requestsPaused ? "checked" : ""}>
                        Pause requests (hide buttons, keep tab)
                    </label>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0 0 8px 22px;">Temporarily stop accepting new requests.</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">Limit per user:</span>
                        <select id="xcbRequestLimit" style="padding: 4px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px;">
                            <option value="0" ${settings.requestLimitPerUser === 0 ? "selected" : ""}>Unlimited</option>
                            <option value="1" ${settings.requestLimitPerUser === 1 ? "selected" : ""}>1 request</option>
                            <option value="2" ${settings.requestLimitPerUser === 2 ? "selected" : ""}>2 requests</option>
                            <option value="3" ${settings.requestLimitPerUser === 3 ? "selected" : ""}>3 requests</option>
                            <option value="5" ${settings.requestLimitPerUser === 5 ? "selected" : ""}>5 requests</option>
                            <option value="10" ${settings.requestLimitPerUser === 10 ? "selected" : ""}>10 requests</option>
                            <option value="custom" ${![0, 1, 2, 3, 5, 10].includes(settings.requestLimitPerUser ?? 0) && (settings.requestLimitPerUser ?? 0) > 0 ? "selected" : ""}>Custom...</option>
                        </select>
                        <input type="number" id="xcbRequestLimitCustom" min="1" max="999" value="${settings.requestLimitPerUser ?? 0}" style="width: 60px; padding: 4px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; display: ${![0, 1, 2, 3, 5, 10].includes(settings.requestLimitPerUser ?? 0) && (settings.requestLimitPerUser ?? 0) > 0 ? "block" : "none"};">
                    </div>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 4px 0 0 0;">Max active requests per username (archived don't count).</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">Total requests limit:</span>
                        <select id="xcbTotalRequestLimit" style="padding: 4px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px;">
                            <option value="0" ${settings.totalRequestsLimit === 0 ? "selected" : ""}>Unlimited</option>
                            <option value="5" ${settings.totalRequestsLimit === 5 ? "selected" : ""}>5 requests</option>
                            <option value="10" ${settings.totalRequestsLimit === 10 ? "selected" : ""}>10 requests</option>
                            <option value="15" ${settings.totalRequestsLimit === 15 ? "selected" : ""}>15 requests</option>
                            <option value="20" ${settings.totalRequestsLimit === 20 ? "selected" : ""}>20 requests</option>
                            <option value="25" ${settings.totalRequestsLimit === 25 ? "selected" : ""}>25 requests</option>
                            <option value="50" ${settings.totalRequestsLimit === 50 ? "selected" : ""}>50 requests</option>
                            <option value="custom" ${![0, 5, 10, 15, 20, 25, 50].includes(settings.totalRequestsLimit ?? 0) && (settings.totalRequestsLimit ?? 0) > 0 ? "selected" : ""}>Custom...</option>
                        </select>
                        <input type="number" id="xcbTotalRequestLimitCustom" min="1" max="999" value="${settings.totalRequestsLimit ?? 0}" style="width: 60px; padding: 4px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; display: ${![0, 5, 10, 15, 20, 25, 50].includes(settings.totalRequestsLimit ?? 0) && (settings.totalRequestsLimit ?? 0) > 0 ? "block" : "none"};">
                    </div>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 4px 0 0 0;">Max total active requests (archived don't count). Prevents getting overwhelmed.</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                        <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">Count towards limits:</span>
                        <select id="xcbRequestCountMode" style="padding: 4px 8px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px;">
                            <option value="requests" ${settings.requestCountMode === "requests" ? "selected" : ""}>Requests only</option>
                            <option value="requests_and_subtasks" ${settings.requestCountMode === "requests_and_subtasks" ? "selected" : ""}>Requests + Sub-tasks</option>
                            <option value="subtasks_only" ${settings.requestCountMode === "subtasks_only" ? "selected" : ""}>Sub-tasks only</option>
                        </select>
                    </div>
                    <div style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 6px 0 0 0; line-height: 1.6;">
                        <div><b>Requests only:</b> Each request = 1</div>
                        <div><b>Requests + Sub-tasks:</b> Request + its checklist items</div>
                        <div><b>Sub-tasks only:</b> Only checklist items count</div>
                    </div>
                    <div style="margin-top: 12px;">
                        <button class="xcb-add-btn" id="xcbSaveRequestSettings" style="background: var(--xcb-accent-warning, #f59e0b);">Save Request Settings</button>
                    </div>
                </div>

                <div class="xcb-section" id="xcbNotesSettingsSection">
                    <div class="xcb-section-title"><i class="ph-bold ph-note-pencil"></i> Notes Settings</div>
                    <label class="xcb-checkbox-label" style="margin-bottom: 5px;">
                        <input type="checkbox" id="xcbNotesEnabled" ${settings.notesEnabled !== false ? "checked" : ""}>
                        Enable Notes feature
                    </label>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0 0 8px 22px;">Your saved notes are preserved when disabled.</p>
                    <div style="margin-top: 12px;">
                        <button class="xcb-add-btn" id="xcbSaveNotesSettings" style="background: var(--xcb-accent-purple, #8b5cf6);">Save Notes Settings</button>
                    </div>
                </div>

                <div class="xcb-section">
                    <div class="xcb-section-title"><i class="ph-bold ph-star"></i> First-timer Tracking</div>
                    <label class="xcb-checkbox-label" style="margin-bottom: 5px;">
                        <input type="checkbox" id="xcbFirstTimerEnabled" ${settings.firstTimerTrackingEnabled !== false ? "checked" : ""}>
                        Show "First-timer" tag for new commenters
                    </label>
                    <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0 0 0 22px;">Highlights users who haven't commented on your uploads before. Click the tag to mark them as seen.</p>
                    <div style="margin-top: 12px;">
                        <button class="xcb-add-btn" id="xcbSaveFirstTimer" style="background: var(--xcb-accent-warning, #f59e0b);">Save First-timer Settings</button>
                    </div>
                </div>

                <!-- ═══════════════════ REPLY TEMPLATES ═══════════════════ -->
                <div id="xcbSectionReplies" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-success-alt, #10b981); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-success-alt, #10b981)40;"><i class="ph-bold ph-chat-dots"></i> Reply Templates</div>

                <div class="xcb-section" id="xcbQuickReplySection">
                    <div class="xcb-section-title">Quick Reply - Blocked Users <i class="ph-bold ph-prohibit"></i></div>
                    <p style="color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Reply template for blocked users. The username will be @mentioned automatically.</p>
                    <select id="xcbQuickReplySelect" class="xcb-template-select" style="width: 100%; margin-bottom: 5px;">
                        <option value="" disabled selected>-- Select a template --</option>
                        ${(settings.quickReplies || DEFAULT_QUICK_REPLIES).map(
      (reply, i) => `<option value="${i}">${reply.substring(0, 50)}${reply.length > 50 ? "..." : ""}</option>`
    ).join("")}
                        <option value="custom">Custom message...</option>
                    </select>
                    <textarea id="xcbQuickReplyMsg" style="width: 100%; min-height: 80px; max-height: 200px; margin-bottom: 5px; resize: vertical; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; font-family: inherit; box-sizing: border-box;" placeholder="Enter your quick reply message...">${(settings.quickReplyMessage || DEFAULT_QUICK_REPLIES[0]).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                    <button class="xcb-add-btn" id="xcbSaveQuickReply" style="background: var(--xcb-primary);">Save Message</button>
                </div>

                <div class="xcb-section">
                    <div class="xcb-section-title">Quick Reply - Trusted Users <i class="ph-bold ph-heart" style="color: var(--xcb-accent-success, #22c55e);"></i></div>
                    <p style="color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Reply template for trusted users. The username will be @mentioned automatically.</p>
                    <select id="xcbTrustedReplySelect" class="xcb-template-select" style="width: 100%; margin-bottom: 5px;">
                        <option value="" disabled selected>-- Select a template --</option>
                        ${(settings.trustedReplies || DEFAULT_TRUSTED_REPLIES).map(
      (reply, i) => `<option value="${i}">${reply.substring(0, 50)}${reply.length > 50 ? "..." : ""}</option>`
    ).join("")}
                        <option value="custom">Custom message...</option>
                    </select>
                    <textarea id="xcbTrustedReplyMsg" style="width: 100%; min-height: 80px; max-height: 200px; margin-bottom: 5px; resize: vertical; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; font-family: inherit; box-sizing: border-box;" placeholder="Enter your quick reply message for trusted users...">${(settings.trustedReplyMessage || DEFAULT_TRUSTED_REPLIES[0]).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                    <button class="xcb-add-btn" id="xcbSaveTrustedReply" style="background: var(--xcb-accent-success, #22c55e);">Save Message</button>
                </div>

                <div class="xcb-section">
                    <div class="xcb-section-title">Quick Reply - Neutral Users <i class="ph-bold ph-chat-dots"></i></div>
                    <p style="color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Reply template for regular (non-blocked, non-trusted) users. The username will be @mentioned automatically.</p>
                    <select id="xcbNeutralReplySelect" class="xcb-template-select" style="width: 100%; margin-bottom: 5px;">
                        <option value="" disabled selected>-- Select a template --</option>
                        ${(settings.neutralReplies || DEFAULT_NEUTRAL_REPLIES).map(
      (reply, i) => `<option value="${i}">${reply.substring(0, 50)}${reply.length > 50 ? "..." : ""}</option>`
    ).join("")}
                        <option value="custom">Custom message...</option>
                    </select>
                    <textarea id="xcbNeutralReplyMsg" style="width: 100%; min-height: 80px; max-height: 200px; margin-bottom: 5px; resize: vertical; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; font-family: inherit; box-sizing: border-box;" placeholder="Enter your quick reply message for neutral users...">${(settings.neutralReplyMessage || DEFAULT_NEUTRAL_REPLIES[0]).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                    <button class="xcb-add-btn" id="xcbSaveNeutralReply" style="background: var(--xcb-accent-indigo, #6366f1);">Save Message</button>
                </div>

                <div class="xcb-section">
                    <div class="xcb-section-title">Quick Reply - Seeding Questions <i class="ph-bold ph-plant" style="color: var(--xcb-accent-success, #22c55e);"></i></div>
                    <p style="color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Reply templates for users asking about download speeds or seeding. The username will be @mentioned automatically.</p>
                    <select id="xcbSeedingReplySelect" class="xcb-template-select" style="width: 100%; margin-bottom: 5px;">
                        <option value="" disabled selected>-- Select a template --</option>
                        ${(settings.seedingReplies || DEFAULT_SEEDING_REPLIES).map(
      (reply, i) => `<option value="${i}">${i === 0 ? "Long Answer: " : ""}${reply.substring(0, i === 0 ? 37 : 50)}${reply.length > (i === 0 ? 37 : 50) ? "..." : ""}</option>`
    ).join("")}
                        <option value="custom">Custom message...</option>
                    </select>
                    <textarea id="xcbSeedingReplyMsg" style="width: 100%; min-height: 80px; max-height: 200px; margin-bottom: 5px; resize: vertical; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 3px; font-family: inherit; box-sizing: border-box;" placeholder="Enter your quick reply message for seeding questions...">${(settings.seedingReplyMessage || DEFAULT_SEEDING_REPLIES[0]).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
                    <button class="xcb-add-btn" id="xcbSaveSeedingReply" style="background: var(--xcb-accent-warning, #f59e0b);">Save Message</button>
                </div>

                <!-- ═══════════════════ DATA MANAGEMENT ═══════════════════ -->
                <div id="xcbSectionData" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-purple, #8b5cf6); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-purple-faded, #8b5cf640);"><i class="ph-bold ph-chart-bar"></i> Data Management</div>

                <div class="xcb-section" id="xcbStatsSection">
                    <div class="xcb-section-title">Statistics</div>
                    <div class="xcb-stats-box">
                        <div class="xcb-stats-item"><span>Total comments hidden:</span><span>${stats.totalHidden}</span></div>
                        <div class="xcb-stats-item"><span>Keyword matches:</span><span>${stats.keywordHidden}</span></div>
                        <div class="xcb-stats-item"><span>Users blocked:</span><span>${blocklistCount}</span></div>
                        <div class="xcb-stats-item"><span>Users trusted:</span><span>${trustedlistCount}</span></div>
                    </div>
                </div>

                <div class="xcb-section" id="xcbBackupSection">
                    <div class="xcb-section-title">Backup & Restore</div>
                    <div style="background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #333); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                            <label class="xcb-checkbox-label" style="margin: 0;">
                                <input type="checkbox" id="xcbAutoBackupEnabled" ${settings.autoBackupEnabled ? "checked" : ""}>
                                Enable Auto-Backup
                            </label>
                            <select id="xcbAutoBackupInterval" style="padding: 5px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;">
                                <option value="hourly" ${settings.autoBackupInterval === "hourly" ? "selected" : ""}>Every Hour</option>
                                <option value="daily" ${settings.autoBackupInterval === "daily" ? "selected" : ""}>Daily</option>
                                <option value="weekly" ${settings.autoBackupInterval === "weekly" ? "selected" : ""}>Weekly</option>
                            </select>
                        </div>
                        <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin: 0;">
                            ${settings.lastAutoBackup ? "Last auto-backup: " + new Date(settings.lastAutoBackup).toLocaleString() : "No auto-backup yet"}
                            ${settings.autoBackupEnabled ? " • " + getBackupHistory2().length + " backup(s) stored" : ""}
                        </p>
                    </div>
                    <div style="background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #333); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
                        <div style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px; font-weight: 600;">Backup File Settings</div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); white-space: nowrap;">Filename prefix:</span>
                            <input type="text" id="xcbBackupFilenamePrefix" value="${settings.backupFilenamePrefix || "mankey-bot-backup"}" placeholder="mankey-bot-backup" style="flex: 1; padding: 6px 10px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; font-size: 12px;">
                        </div>
                        <p style="font-size: 10px; color: var(--xcb-panel-text-dim, #666); margin-top: 6px; margin-bottom: 0;">Files will be named: <code style="background: var(--xcb-panel-secondary-bg, #333); padding: 2px 4px; border-radius: 2px;">${settings.backupFilenamePrefix || "mankey-bot-backup"}_2024-01-01.json</code></p>
                        <p style="font-size: 10px; color: var(--xcb-panel-text-muted, #888); margin-top: 6px; margin-bottom: 0;">Files will download to your browser's default download folder.</p>
                        <div style="margin-top: 10px;">
                            <button class="xcb-add-btn" id="xcbSaveBackupSettings" style="background: var(--xcb-accent-purple, #8b5cf6);">Save Backup Settings</button>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                        <button class="xcb-add-btn" id="xcbExport" style="flex: 1; min-width: 130px;"><i class="ph-bold ph-file-arrow-up"></i> Export Full Backup</button>
                        <label class="xcb-io-btn" style="flex: 1; min-width: 130px; cursor: pointer;"><i class="ph-bold ph-file-arrow-down"></i> Import Backup<input type="file" id="xcbImport" accept=".json" style="display: none;"></label>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                        <button class="xcb-warning-btn" id="xcbExportRequests" style="flex: 1; min-width: 130px;"><i class="ph-bold ph-file-arrow-up"></i> Export Requests Only</button>
                    </div>
                    ${renderBackupHistorySection(getBackupHistory2)}
                    <div class="xcb-section-title" style="margin-top: 10px;">Share Blocklist</div>
                    <p style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;">Share your blocklist with others (usernames only, no personal notes)</p>
                    <div style="display: flex; gap: 10px;">
                        <button class="xcb-purple-btn" id="xcbShareExport" style="flex: 1; min-width: 130px;"><i class="ph-bold ph-file-arrow-up"></i> Export Blocklist</button>
                        <label class="xcb-io-btn" style="flex: 1; min-width: 130px; cursor: pointer;"><i class="ph-bold ph-file-arrow-down"></i> Import Shared List<input type="file" id="xcbShareImport" accept=".json" style="display: none;"></label>
                    </div>
                </div>

                <!-- ═══════════════════ DANGER ZONE ═══════════════════ -->
                <div id="xcbSectionDanger" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-danger, #dc2626); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-danger-faded, #dc262640);"><i class="ph-bold ph-warning"></i> Danger Zone</div>

                <div class="xcb-section" style="background: var(--xcb-panel-bg, #1a1a2e); padding: 15px; border-radius: 8px; border: 1px solid var(--xcb-accent-danger, #dc2626);">
                    <div class="xcb-section-title" style="font-size: 14px; color: var(--xcb-accent-danger, #dc2626);">Reset Options</div>

                    <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border-left: 3px solid var(--xcb-accent-warning, #f59e0b);">
                            <button class="xcb-remove-btn" id="xcbResetStats" style="padding: 10px 16px; font-size: 12px; white-space: nowrap;">Reset Statistics</button>
                            <div style="flex: 1;">
                                <div style="font-size: 11px; color: var(--xcb-accent-warning, #f59e0b); font-weight: bold;">Low Risk</div>
                                <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa);">Resets the "comments hidden" counters to zero. Your lists, requests, and settings are NOT affected.</div>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 6px; border-left: 3px solid var(--xcb-accent-danger, #dc2626);">
                            <button class="xcb-danger-btn-dark" id="xcbFactoryReset"><i class="ph-bold ph-warning"></i> Factory Reset</button>
                            <div style="flex: 1;">
                                <div style="font-size: 11px; color: var(--xcb-accent-danger, #dc2626); font-weight: bold;">Irreversible!</div>
                                <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa);">Deletes EVERYTHING: blocked users, trusted users, keywords, requests, notes, custom tags, all settings. Shows welcome screen again.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════ CREDITS ═══════════════════ -->
                <div id="xcbSectionCredits" style="font-size: 11px; font-weight: bold; color: var(--xcb-accent-purple, #8b5cf6); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--xcb-accent-purple-faded, #8b5cf640);"><i class="ph-bold ph-heart"></i> Credits & Info</div>

                <div class="xcb-section" style="background: linear-gradient(135deg, var(--xcb-panel-bg, #1a1a2e) 0%, var(--xcb-section-bg, #2a2a4e) 100%); padding: 20px; border-radius: 8px; border: 1px solid var(--xcb-accent-purple, #8b5cf6);">
                    <div style="background: var(--xcb-accent-danger-faded, #dc262620); border: 1px solid var(--xcb-accent-danger, #dc2626); border-radius: 6px; padding: 10px; margin-bottom: 15px;">
                        <div style="font-size: 12px; color: var(--xcb-accent-danger, #dc2626); font-weight: bold; margin-bottom: 4px;"><i class="ph-bold ph-warning"></i> PROJECT ABANDONED</div>
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #ccc);">This project is no longer actively maintained. Uploaded to preserve MankeyDoodle & UncleSamurott's work despite the ban. The script requires uploader account verification which is no longer possible. Primarily tested on Chrome only. This was the developer's first public script. Community contributions welcome!</div>
                    </div>

                    <div style="background: var(--xcb-accent-warning-faded, #f59e0b20); border: 1px solid var(--xcb-accent-warning, #f59e0b); border-radius: 6px; padding: 10px; margin-bottom: 15px;">
                        <div style="font-size: 12px; color: var(--xcb-accent-warning, #f59e0b); font-weight: bold; margin-bottom: 4px;">📤 Designed for Uploaders</div>
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #ccc);">This script is built specifically for 1337x uploaders to manage comments on their uploads.</div>
                    </div>

                    <div style="background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); border-radius: 6px; padding: 10px; margin-bottom: 15px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-secondary, #aaa);"><i class="ph-bold ph-info"></i> <strong>Disclaimer:</strong> This script is an independent, open-source project. It is NOT affiliated with, endorsed by, or related to 1337x in any way. The authors have no connection to 1337x staff or administration.</div>
                    </div>

                    <div style="display: flex; gap: 15px; align-items: flex-start; margin-bottom: 15px;">
                        <div style="flex-shrink: 0;">
                            <img src="${mankeyDoodlePfp2}" alt="MankeyDoodle" style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid var(--xcb-accent-purple, #8b5cf6); background: var(--xcb-section-bg, #2a2a3e);">
                        </div>
                        <div>
                            <div style="font-size: 16px; font-weight: bold; color: var(--xcb-accent-purple, #8b5cf6); margin-bottom: 5px;">🐵 MankeyDoodle (MNKYDDL)</div>
                            <div style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;">Original Creator (No longer active)</div>
                            <div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">Created this script to help uploaders manage comments. Project abandoned due to 1337x account ban before release.</div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; align-items: flex-start; margin-bottom: 15px;">
                        <div style="flex-shrink: 0;">
                            <img src="${uncleSamurottPfp2}" alt="UncleSamurott" style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid #de3812; background: var(--xcb-section-bg, #2a2a3e); object-fit: cover;">
                        </div>
                        <div>
                            <div style="font-size: 16px; font-weight: bold; color: #de3812; margin-bottom: 5px;">🦦 UncleSamurott</div>
                            <div style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px;">Co-Developer</div>
                            <div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888);">Contributed features, bug fixes, and improvements during development.</div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid var(--xcb-panel-border, #444); padding-top: 12px; margin-bottom: 12px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;"><i class="ph-bold ph-map-pin"></i> Original Profiles:</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <a href="https://1337x.to/user/MankeyDoodle/" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #555; color: var(--xcb-btn-text, #fff); text-decoration: line-through; border-radius: 4px; font-size: 11px; opacity: 0.7;">
                                🏴‍☠️ 1337x (Account Banned)
                            </a>
                            <a href="https://ext.to/user/mankeydoodle/uploads/" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #555; color: var(--xcb-btn-text, #fff); border-radius: 4px; font-size: 11px; opacity: 0.7;">
                                🏴‍☠️ EXT.to (Inactive)
                            </a>
                            <a href="https://1337x.to/user/UncleSamurott/" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #de3812; color: var(--xcb-btn-text, #fff); text-decoration: none; border-radius: 4px; font-size: 11px; font-weight: bold;">
                                🦦 UncleSamurott @ 1337x
                            </a>
                        </div>
                    </div>

                    <div style="border-top: 1px solid var(--xcb-panel-border, #444); padding-top: 12px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;"><i class="ph-bold ph-folder-open"></i> Script Source (Open Source):</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <a href="https://github.com/MankeyDoodle/MaNKeY-Bot-1337x-Comment-Assistant" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #24292e; border: 1px solid #555; color: #fff; text-decoration: none; border-radius: 4px; font-size: 11px;">
                                <i class="ph-bold ph-github-logo"></i> GitHub
                            </a>
                            <a href="https://greasyfork.org/en/scripts/563593-mankey-bot-1337x-comment-assistant-abandoned-untested" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #670000; border: 1px solid #8b0000; color: #fff; text-decoration: none; border-radius: 4px; font-size: 11px;">
                                <i class="ph-bold ph-wrench"></i> GreasyFork
                            </a>
                        </div>
                    </div>

                    <div style="border-top: 1px solid var(--xcb-panel-border, #444); padding-top: 12px; margin-top: 12px;">
                        <div style="font-size: 11px; color: var(--xcb-panel-text-muted, #888); margin-bottom: 8px;"><i class="ph-bold ph-palette"></i> Icons & Assets:</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <a href="https://phosphoricons.com/" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid #555; color: var(--xcb-panel-text-secondary, #ccc); text-decoration: none; border-radius: 4px; font-size: 11px;">
                                <i class="ph-bold ph-diamond"></i> Phosphor Icons (MIT)
                            </a>
                        </div>
                    </div>

                    <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid var(--xcb-panel-border, #444); text-align: center;">
                        <div style="font-size: 10px; color: var(--xcb-panel-text-dim, #666);">MaNKeY-Bot: 1337x Comment Assistant v0.3.3 [ABANDONED]</div>
                        <div style="font-size: 10px; color: var(--xcb-panel-text-dim, #555); margin-top: 3px;">Originally made with <i class="ph-bold ph-heart" style="color: #a855f7;"></i> for the 1337x community</div>
                        <div style="font-size: 10px; color: var(--xcb-accent-info, #3b82f6); margin-top: 5px;">Feel free to fork, modify, and continue development!</div>
                    </div>
                </div>

            </div>`;
  }
  function renderBackupHistorySection(getBackupHistory2) {
    const backupHistory = getBackupHistory2();
    if (backupHistory.length === 0) return "";
    const mostRecent = backupHistory[0];
    return `
    <div style="background: var(--xcb-panel-bg, #1a1a2e); border: 1px solid var(--xcb-panel-border, #333); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
        <div style="font-size: 12px; color: var(--xcb-panel-text-secondary, #aaa); margin-bottom: 8px; font-weight: 600;">Most Recent Auto-Backup</div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; font-size: 11px;">
            <span style="color: var(--xcb-panel-text-secondary, #ccc);">${new Date(mostRecent.date).toLocaleString()}</span>
            <div style="display: flex; gap: 6px;">
                <button class="xcb-backup-history-download" data-index="0" style="background: var(--xcb-primary); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 10px;">Download</button>
                <button class="xcb-backup-history-restore" data-index="0" style="background: var(--xcb-accent-success-alt, #10b981); color: var(--xcb-btn-text, #fff); border: 1px solid var(--xcb-btn-border, rgba(255,255,255,0.2)); padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 10px;">Restore</button>
            </div>
        </div>
        ${backupHistory.length > 1 ? `
        <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button id="xcbViewAllBackups" class="xcb-secondary-btn" style="flex: 1;"><i class="ph-bold ph-folder-open"></i> View All Backups (${backupHistory.length})</button>
            <button id="xcbClearBackupHistory" class="xcb-danger-btn">Clear All</button>
        </div>
        ` : `
        <button id="xcbClearBackupHistory" class="xcb-danger-btn" style="margin-top: 8px; width: 100%;">Clear Backup History</button>
        `}
    </div>
  `;
  }
  function filterList(listId, searchQuery, activeTags) {
    document.querySelectorAll(`#${listId} li[data-searchable]`).forEach((li) => {
      const searchable = li.dataset.searchable || "";
      const itemTags = (li.dataset.tags || "").split("|").filter((t) => t);
      const matchesSearch = !searchQuery || searchable.includes(searchQuery);
      const matchesTags = activeTags.length === 0 || activeTags.every((tag) => {
        if (tag === "__untagged__") {
          return itemTags.length === 0 || itemTags.every((t) => !t.trim());
        }
        return itemTags.some((itemTag) => itemTag.includes(tag));
      });
      li.style.display = matchesSearch && matchesTags ? "" : "none";
    });
  }
  function updateClearButton(buttonId, hasTags) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.style.display = hasTags ? "inline-block" : "none";
    }
  }
  function performFactoryReset() {
    GM_deleteValue("blocklist");
    GM_deleteValue("blocklist_v2");
    GM_deleteValue("trustedlist");
    GM_deleteValue("trustedlist_v2");
    GM_deleteValue("keywords");
    GM_deleteValue("keywords_v2");
    GM_deleteValue("requests");
    GM_deleteValue("notes");
    GM_deleteValue("noteSections");
    GM_deleteValue("settings");
    GM_deleteValue("stats");
    GM_deleteValue("customReasons");
    GM_deleteValue("seenCommenters");
    GM_deleteValue("permanentWhitelist");
    GM_deleteValue("verifiedRank");
    GM_deleteValue("verifiedUsername");
    alert("Factory reset complete. The page will now reload.");
    location.reload();
  }
  function initResizeHandler(options) {
    const {
      panel,
      resizeHandle,
      minWidth = 350,
      maxWidthRatio = 0.9,
      minHeight = 300,
      maxHeightRatio = 0.95,
      listHeightOffset = 250
    } = options;
    let isResizing = false;
    let startX;
    let startY;
    let startWidth;
    let startHeight;
    const onMouseDown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = panel.offsetWidth;
      startHeight = panel.offsetHeight;
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.max(
        minWidth,
        Math.min(window.innerWidth * maxWidthRatio, startWidth + (e.clientX - startX))
      );
      const newHeight = Math.max(
        minHeight,
        Math.min(window.innerHeight * maxHeightRatio, startHeight + (e.clientY - startY))
      );
      panel.style.width = newWidth + "px";
      panel.style.height = newHeight + "px";
      panel.className = `xcb-panel xcb-panel-custom ${getThemeClassName(getSettings())}`;
      const listHeight = Math.max(100, newHeight - listHeightOffset) + "px";
      panel.querySelectorAll("ul").forEach((ul) => {
        ul.style.maxHeight = listHeight;
      });
    };
    const onMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        const s = getSettings();
        s.panelSize = "custom";
        s.panelCustomWidth = panel.offsetWidth;
        s.panelCustomHeight = panel.offsetHeight;
        saveSettings(s);
        const sizeSelect = document.getElementById("xcbPanelSize");
        if (sizeSelect) sizeSelect.value = "custom";
      }
    };
    resizeHandle.onmousedown = onMouseDown;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      resizeHandle.onmousedown = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }
  function setupBlockHandlers({ panel, refreshPanel }) {
    panel.querySelectorAll(".xcb-block-preset").forEach((preset) => {
      preset.onclick = () => {
        const noteInput = document.getElementById("xcbNewBlockNote");
        if (noteInput && preset.dataset.reason) {
          noteInput.value = preset.dataset.reason;
        }
        panel.querySelectorAll(".xcb-block-preset").forEach((p) => {
          p.style.borderColor = HIGHLIGHT_COLOR;
          p.style.background = "var(--xcb-section-bg, #2a2a3e)";
        });
        preset.style.borderColor = "#fff";
        preset.style.background = HIGHLIGHT_COLOR;
      };
    });
    const addBlockBtn = document.getElementById("xcbAddBlockUser");
    if (addBlockBtn) {
      addBlockBtn.onclick = () => {
        const usernameInput = document.getElementById("xcbNewBlockUser");
        const noteInput = document.getElementById("xcbNewBlockNote");
        const levelSelect = document.getElementById("xcbNewBlockLevel");
        const expirySelect = document.getElementById("xcbNewBlockExpiry");
        const username = (usernameInput == null ? void 0 : usernameInput.value.trim()) || "";
        const note = (noteInput == null ? void 0 : noteInput.value.trim()) || "";
        const level = (levelSelect == null ? void 0 : levelSelect.value) || "hard";
        const expiry = (expirySelect == null ? void 0 : expirySelect.value) || "";
        if (username) {
          addToBlocklist(username, note, level, expiry ? parseInt(expiry) : null);
          refreshPanel("block");
        }
      };
    }
    const exportBlocklistBtn = document.getElementById("xcbExportBlocklist");
    if (exportBlocklistBtn) {
      exportBlocklistBtn.onclick = () => {
        const blocklist = getBlocklist();
        const users = Object.entries(blocklist).map(([username, data2]) => ({
          username,
          note: data2.note || "",
          level: data2.level || "hard",
          date: data2.date,
          expiry: data2.expiry || null
        }));
        if (users.length === 0) {
          alert("No blocked users to export!");
          return;
        }
        const data = {
          version: "1.0",
          type: "blocklist",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          users
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mankey-blocklist-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
    const importBlocklistInput = document.getElementById("xcbImportBlocklist");
    if (importBlocklistInput) {
      importBlocklistInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          var _a2;
          try {
            const content = (_a2 = event.target) == null ? void 0 : _a2.result;
            let usersToImport = [];
            try {
              const json = JSON.parse(content);
              if (json.type === "blocklist" && Array.isArray(json.users)) {
                usersToImport = json.users;
              } else if (Array.isArray(json)) {
                usersToImport = json;
              }
            } catch {
              const lines = content.split("\n").filter((l) => l.trim());
              usersToImport = lines.map((line) => {
                const parts = line.split(",").map((p) => p.trim());
                return { username: parts[0], note: parts[1] || "", level: "hard" };
              });
            }
            if (usersToImport.length === 0) {
              alert("No valid users found in file.");
              return;
            }
            let imported = 0;
            let skipped = 0;
            const blocklist = getBlocklist();
            usersToImport.forEach((user) => {
              var _a3;
              const username = (_a3 = user.username) == null ? void 0 : _a3.trim();
              if (username && !blocklist[username.toLowerCase()]) {
                addToBlocklist(username, user.note || "", user.level || "hard", user.expiryDays || null);
                imported++;
              } else {
                skipped++;
              }
            });
            alert(`Imported ${imported} blocked user(s). ${skipped > 0 ? `Skipped ${skipped} duplicate(s).` : ""}`);
            refreshPanel("block");
          } catch (err) {
            alert("Error importing file: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    panel.querySelectorAll('.xcb-remove-btn[data-user][data-list="block"]').forEach((btn) => {
      btn.onclick = () => {
        const user = btn.dataset.user;
        if (user) {
          removeFromBlocklist(user);
          refreshPanel("block");
        }
      };
    });
    const updateBlockBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-block-select:checked").length;
      const countEl = panel.querySelector("#xcbBlockSelectedCount");
      const tagBtn = panel.querySelector("#xcbBulkTagBlock");
      const moveBtn = panel.querySelector("#xcbBulkMoveToTrust");
      const removeBtn = panel.querySelector("#xcbBulkRemoveBlock");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (tagBtn) tagBtn.style.display = selectedCount > 0 ? "" : "none";
      if (moveBtn) moveBtn.style.display = selectedCount > 0 ? "" : "none";
      if (removeBtn) removeBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllBlockCheckbox = panel.querySelector("#xcbSelectAllBlock");
    if (selectAllBlockCheckbox) {
      selectAllBlockCheckbox.onchange = () => {
        const isChecked = selectAllBlockCheckbox.checked;
        panel.querySelectorAll(".xcb-block-select").forEach((cb) => {
          const li = cb.closest("li");
          if (li && li.style.display !== "none") {
            cb.checked = isChecked;
          }
        });
        updateBlockBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-block-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateBlockBulkUI();
        const visibleCheckboxes = Array.from(panel.querySelectorAll(".xcb-block-select")).filter((cb) => {
          const li = cb.closest("li");
          return li && li.style.display !== "none";
        });
        const allChecked = visibleCheckboxes.every((cb) => cb.checked);
        if (selectAllBlockCheckbox) selectAllBlockCheckbox.checked = allChecked && visibleCheckboxes.length > 0;
      };
    });
    const bulkRemoveBlockBtn = panel.querySelector("#xcbBulkRemoveBlock");
    if (bulkRemoveBlockBtn) {
      bulkRemoveBlockBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-block-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        if (confirm(`Remove ${selectedUsernames.length} user(s) from blocklist?`)) {
          selectedUsernames.forEach((username) => removeFromBlocklist(username));
          refreshPanel("block");
        }
      };
    }
    const bulkMoveToTrustBtn = panel.querySelector("#xcbBulkMoveToTrust");
    if (bulkMoveToTrustBtn) {
      bulkMoveToTrustBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-block-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        if (confirm(`Move ${selectedUsernames.length} user(s) from blocklist to trusted list?`)) {
          const blocklist = getBlocklist();
          selectedUsernames.forEach((username) => {
            var _a;
            const lowerUsername = username.toLowerCase();
            const note = ((_a = blocklist[lowerUsername]) == null ? void 0 : _a.note) || "";
            removeFromBlocklist(username);
            addToTrustedlist(username, note);
          });
          refreshPanel("trust");
        }
      };
    }
    const bulkTagBlockBtn = panel.querySelector("#xcbBulkTagBlock");
    if (bulkTagBlockBtn) {
      bulkTagBlockBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-block-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        const popup = document.createElement("div");
        popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--xcb-panel-bg, #1a1a2e);
        border: 2px solid #f59e0b;
        border-radius: 12px;
        padding: 20px;
        z-index: 100002;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      `;
        popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #f59e0b; font-size: 16px;"><i class="ph-bold ph-tag"></i> Add Tag to ${selectedUsernames.length} User(s)</h3>
          <button class="xcb-bulk-tag-close" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;">Select a preset tag:</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
            ${BLOCK_REASON_PRESETS.map((preset) => `
              <button class="xcb-bulk-tag-preset" data-tag="${preset}" style="
                padding: 6px 12px;
                background: #2a2a3e;
                border: 1px solid #f59e0b;
                color: #f59e0b;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
              " onmouseover="this.style.background='#f59e0b';this.style.color='#fff'" onmouseout="this.style.background='#2a2a3e';this.style.color='#f59e0b'">${preset}</button>
            `).join("")}
          </div>
          <label style="display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;">Or enter a custom tag:</label>
          <input type="text" id="xcbBulkTagInput" placeholder="Enter tag..." style="
            width: 100%;
            padding: 10px;
            background: var(--xcb-section-bg, #2a2a3e);
            border: 1px solid #444;
            color: var(--xcb-panel-text, #fff);
            border-radius: 6px;
            font-size: 13px;
            box-sizing: border-box;
          ">
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="xcb-bulk-tag-cancel xcb-cancel-btn">Cancel</button>
          <button class="xcb-bulk-tag-apply" style="background: #f59e0b; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">Apply Tag</button>
        </div>
      `;
        document.body.appendChild(popup);
        const closePopup = () => popup.remove();
        popup.querySelector(".xcb-bulk-tag-close").onclick = closePopup;
        popup.querySelector(".xcb-bulk-tag-cancel").onclick = closePopup;
        const tagInput = popup.querySelector("#xcbBulkTagInput");
        popup.querySelectorAll(".xcb-bulk-tag-preset").forEach((btn) => {
          btn.onclick = () => {
            tagInput.value = btn.dataset.tag || "";
          };
        });
        popup.querySelector(".xcb-bulk-tag-apply").onclick = () => {
          const tag = tagInput.value.trim();
          if (!tag) {
            alert("Please enter or select a tag.");
            return;
          }
          const blocklist = getBlocklist();
          selectedUsernames.forEach((username) => {
            const lowerUsername = username.toLowerCase();
            if (blocklist[lowerUsername]) {
              const currentNote = blocklist[lowerUsername].note || "";
              const existingTags = currentNote.split(/[,;]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
              if (!existingTags.includes(tag.toLowerCase())) {
                blocklist[lowerUsername].note = currentNote ? `${currentNote}, ${tag}` : tag;
              }
            }
          });
          saveBlocklist(blocklist);
          closePopup();
          refreshPanel("block");
        };
        tagInput.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            popup.querySelector(".xcb-bulk-tag-apply").click();
          } else if (e.key === "Escape") {
            closePopup();
          }
        };
        setTimeout(() => tagInput.focus(), 50);
      };
    }
  }
  function setupTrustHandlers({ panel, refreshPanel }) {
    panel.querySelectorAll(".xcb-trust-preset").forEach((preset) => {
      preset.onclick = () => {
        const noteInput = document.getElementById("xcbNewTrustNote");
        if (noteInput && preset.dataset.reason) {
          noteInput.value = preset.dataset.reason;
        }
        panel.querySelectorAll(".xcb-trust-preset").forEach((p) => {
          p.style.borderColor = TRUSTED_COLOR;
          p.style.background = "#2a2a3e";
        });
        preset.style.borderColor = "#fff";
        preset.style.background = TRUSTED_COLOR;
      };
    });
    const addTrustBtn = document.getElementById("xcbAddTrustUser");
    if (addTrustBtn) {
      addTrustBtn.onclick = () => {
        const usernameInput = document.getElementById("xcbNewTrustUser");
        const noteInput = document.getElementById("xcbNewTrustNote");
        const username = (usernameInput == null ? void 0 : usernameInput.value.trim()) || "";
        const note = (noteInput == null ? void 0 : noteInput.value.trim()) || "";
        if (username) {
          addToTrustedlist(username, note);
          refreshPanel("trust");
        }
      };
    }
    const exportTrustedBtn = document.getElementById("xcbExportTrusted");
    if (exportTrustedBtn) {
      exportTrustedBtn.onclick = () => {
        const trustedlist = getTrustedlist();
        const users = Object.entries(trustedlist).map(([username, data2]) => ({
          username,
          note: data2.note || "",
          date: data2.date
        }));
        if (users.length === 0) {
          alert("No trusted users to export!");
          return;
        }
        const data = {
          version: "1.0",
          type: "trustedlist",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          users
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mankey-trustedlist-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
    const importTrustedInput = document.getElementById("xcbImportTrusted");
    if (importTrustedInput) {
      importTrustedInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          var _a2;
          try {
            const content = (_a2 = event.target) == null ? void 0 : _a2.result;
            let usersToImport = [];
            try {
              const json = JSON.parse(content);
              if (json.type === "trustedlist" && Array.isArray(json.users)) {
                usersToImport = json.users;
              } else if (Array.isArray(json)) {
                usersToImport = json;
              }
            } catch {
              const lines = content.split("\n").filter((l) => l.trim());
              usersToImport = lines.map((line) => {
                const parts = line.split(",").map((p) => p.trim());
                return { username: parts[0], note: parts[1] || "" };
              });
            }
            if (usersToImport.length === 0) {
              alert("No valid users found in file.");
              return;
            }
            let imported = 0;
            let skipped = 0;
            const trustedlist = getTrustedlist();
            usersToImport.forEach((user) => {
              var _a3;
              const username = (_a3 = user.username) == null ? void 0 : _a3.trim();
              if (username && !trustedlist[username.toLowerCase()]) {
                addToTrustedlist(username, user.note || "");
                imported++;
              } else {
                skipped++;
              }
            });
            alert(`Imported ${imported} trusted user(s). ${skipped > 0 ? `Skipped ${skipped} duplicate(s).` : ""}`);
            refreshPanel("trust");
          } catch (err) {
            alert("Error importing file: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    panel.querySelectorAll('.xcb-remove-btn[data-user][data-list="trust"]').forEach((btn) => {
      btn.onclick = () => {
        const user = btn.dataset.user;
        if (user) {
          removeFromTrustedlist(user);
          refreshPanel("trust");
        }
      };
    });
    const updateTrustBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-trust-select:checked").length;
      const countEl = panel.querySelector("#xcbTrustSelectedCount");
      const tagBtn = panel.querySelector("#xcbBulkTagTrust");
      const whitelistBtn = panel.querySelector("#xcbBulkWhitelist");
      const moveBtn = panel.querySelector("#xcbBulkMoveToBlock");
      const removeBtn = panel.querySelector("#xcbBulkRemoveTrust");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (tagBtn) tagBtn.style.display = selectedCount > 0 ? "" : "none";
      if (whitelistBtn) whitelistBtn.style.display = selectedCount > 0 ? "" : "none";
      if (moveBtn) moveBtn.style.display = selectedCount > 0 ? "" : "none";
      if (removeBtn) removeBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllTrustCheckbox = panel.querySelector("#xcbSelectAllTrust");
    if (selectAllTrustCheckbox) {
      selectAllTrustCheckbox.onchange = () => {
        const isChecked = selectAllTrustCheckbox.checked;
        panel.querySelectorAll(".xcb-trust-select").forEach((cb) => {
          const li = cb.closest("li");
          if (li && li.style.display !== "none") {
            cb.checked = isChecked;
          }
        });
        updateTrustBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-trust-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateTrustBulkUI();
        const visibleCheckboxes = Array.from(panel.querySelectorAll(".xcb-trust-select")).filter((cb) => {
          const li = cb.closest("li");
          return li && li.style.display !== "none";
        });
        const allChecked = visibleCheckboxes.every((cb) => cb.checked);
        if (selectAllTrustCheckbox) selectAllTrustCheckbox.checked = allChecked && visibleCheckboxes.length > 0;
      };
    });
    const bulkRemoveTrustBtn = panel.querySelector("#xcbBulkRemoveTrust");
    if (bulkRemoveTrustBtn) {
      bulkRemoveTrustBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-trust-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        if (confirm(`Remove ${selectedUsernames.length} user(s) from trusted list?`)) {
          selectedUsernames.forEach((username) => removeFromTrustedlist(username));
          refreshPanel("trust");
        }
      };
    }
    const bulkMoveToBlockBtn = panel.querySelector("#xcbBulkMoveToBlock");
    if (bulkMoveToBlockBtn) {
      bulkMoveToBlockBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-trust-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        if (confirm(`Move ${selectedUsernames.length} user(s) from trusted list to blocklist?`)) {
          const trustedlist = getTrustedlist();
          selectedUsernames.forEach((username) => {
            var _a;
            const lowerUsername = username.toLowerCase();
            const note = ((_a = trustedlist[lowerUsername]) == null ? void 0 : _a.note) || "";
            removeFromTrustedlist(username);
            addToBlocklist(username, note, "soft", null);
          });
          refreshPanel("block");
        }
      };
    }
    const bulkWhitelistBtn = panel.querySelector("#xcbBulkWhitelist");
    if (bulkWhitelistBtn) {
      bulkWhitelistBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-trust-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        if (confirm(`Add ${selectedUsernames.length} user(s) to permanent whitelist?

Whitelisted users will never show block/trust buttons and are always skipped.`)) {
          let added = 0;
          selectedUsernames.forEach((username) => {
            if (addToPermanentWhitelist(username)) {
              added++;
            }
          });
          alert(`Added ${added} user(s) to permanent whitelist.${added < selectedUsernames.length ? ` ${selectedUsernames.length - added} were already whitelisted.` : ""}`);
          refreshPanel("trust");
        }
      };
    }
    const bulkTagTrustBtn = panel.querySelector("#xcbBulkTagTrust");
    if (bulkTagTrustBtn) {
      bulkTagTrustBtn.onclick = () => {
        const selectedUsernames = Array.from(panel.querySelectorAll(".xcb-trust-select:checked")).map((cb) => cb.dataset.username).filter(Boolean);
        if (selectedUsernames.length === 0) return;
        const popup = document.createElement("div");
        popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--xcb-panel-bg, #1a1a2e);
        border: 2px solid ${TRUSTED_COLOR};
        border-radius: 12px;
        padding: 20px;
        z-index: 100002;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      `;
        popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: ${TRUSTED_COLOR}; font-size: 16px;"><i class="ph-bold ph-tag"></i> Add Tag to ${selectedUsernames.length} User(s)</h3>
          <button class="xcb-bulk-tag-close" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;">Select a preset tag:</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
            ${TRUST_REASON_PRESETS.map((preset) => `
              <button class="xcb-bulk-tag-preset" data-tag="${preset}" style="
                padding: 6px 12px;
                background: #2a2a3e;
                border: 1px solid ${TRUSTED_COLOR};
                color: ${TRUSTED_COLOR};
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
              " onmouseover="this.style.background='${TRUSTED_COLOR}';this.style.color='#fff'" onmouseout="this.style.background='#2a2a3e';this.style.color='${TRUSTED_COLOR}'">${preset}</button>
            `).join("")}
          </div>
          <label style="display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;">Or enter a custom tag:</label>
          <input type="text" id="xcbBulkTagInput" placeholder="Enter tag..." style="
            width: 100%;
            padding: 10px;
            background: var(--xcb-section-bg, #2a2a3e);
            border: 1px solid #444;
            color: var(--xcb-panel-text, #fff);
            border-radius: 6px;
            font-size: 13px;
            box-sizing: border-box;
          ">
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="xcb-bulk-tag-cancel xcb-cancel-btn">Cancel</button>
          <button class="xcb-bulk-tag-apply" style="background: ${TRUSTED_COLOR}; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">Apply Tag</button>
        </div>
      `;
        document.body.appendChild(popup);
        const closePopup = () => popup.remove();
        popup.querySelector(".xcb-bulk-tag-close").onclick = closePopup;
        popup.querySelector(".xcb-bulk-tag-cancel").onclick = closePopup;
        const tagInput = popup.querySelector("#xcbBulkTagInput");
        popup.querySelectorAll(".xcb-bulk-tag-preset").forEach((btn) => {
          btn.onclick = () => {
            tagInput.value = btn.dataset.tag || "";
          };
        });
        popup.querySelector(".xcb-bulk-tag-apply").onclick = () => {
          const tag = tagInput.value.trim();
          if (!tag) {
            alert("Please enter or select a tag.");
            return;
          }
          const trustedlist = getTrustedlist();
          selectedUsernames.forEach((username) => {
            const lowerUsername = username.toLowerCase();
            if (trustedlist[lowerUsername]) {
              const currentNote = trustedlist[lowerUsername].note || "";
              const existingTags = currentNote.split(/[,;]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
              if (!existingTags.includes(tag.toLowerCase())) {
                trustedlist[lowerUsername].note = currentNote ? `${currentNote}, ${tag}` : tag;
              }
            }
          });
          saveTrustedlist(trustedlist);
          closePopup();
          refreshPanel("trust");
        };
        tagInput.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            popup.querySelector(".xcb-bulk-tag-apply").click();
          } else if (e.key === "Escape") {
            closePopup();
          }
        };
        setTimeout(() => tagInput.focus(), 50);
      };
    }
  }
  function setupKeywordHandlers({ panel, refreshPanel }) {
    const subtabButtons = panel.querySelectorAll(".xcb-keyword-subtab");
    subtabButtons.forEach((btn) => {
      btn.onclick = () => {
        const subtab = btn.dataset.subtab;
        if (!subtab) return;
        subtabButtons.forEach((b) => b.classList.remove("xcb-keyword-subtab-active"));
        btn.classList.add("xcb-keyword-subtab-active");
        const blockedSection = panel.querySelector("#xcbBlockedKeywordsSection");
        const highlightedSection = panel.querySelector("#xcbHighlightedKeywordsSection");
        if (blockedSection) blockedSection.style.display = subtab === "blocked" ? "block" : "none";
        if (highlightedSection) highlightedSection.style.display = subtab === "highlighted" ? "block" : "none";
      };
    });
    const addKeywordBtn = document.getElementById("xcbAddKeyword");
    if (addKeywordBtn) {
      addKeywordBtn.onclick = () => {
        const keywordInput = document.getElementById("xcbNewKeyword");
        const keyword = (keywordInput == null ? void 0 : keywordInput.value.trim()) || "";
        if (keyword) {
          addKeyword(keyword);
          refreshPanel("keyword", { keywordSubTab: "blocked" });
        }
      };
    }
    const newKeywordInput = document.getElementById("xcbNewKeyword");
    if (newKeywordInput) {
      newKeywordInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const keyword = newKeywordInput.value.trim();
          if (keyword) {
            addKeyword(keyword);
            refreshPanel("keyword", { keywordSubTab: "blocked" });
          }
        }
      };
    }
    const exportKeywordsBtn = document.getElementById("xcbExportKeywords");
    if (exportKeywordsBtn) {
      exportKeywordsBtn.onclick = () => {
        const keywords = getKeywords();
        if (keywords.length === 0) {
          alert("No blocked keywords to export!");
          return;
        }
        const data = {
          version: "1.0",
          type: "blocked_keywords",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          keywords: keywords.map((k) => k.keyword)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mankey-bot-blocked-keywords-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
    const importKeywordsInput = document.getElementById("xcbImportKeywords");
    if (importKeywordsInput) {
      importKeywordsInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          var _a2;
          try {
            const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
            let keywordsToImport = [];
            try {
              const data = JSON.parse(text);
              if (data.keywords && Array.isArray(data.keywords)) {
                keywordsToImport = data.keywords;
              } else if (Array.isArray(data)) {
                keywordsToImport = data;
              }
            } catch {
              keywordsToImport = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
            }
            if (keywordsToImport.length === 0) {
              alert("No keywords found in file!");
              return;
            }
            let added = 0;
            let skipped = 0;
            keywordsToImport.forEach((kw) => {
              if (typeof kw === "string" && kw.trim()) {
                if (addKeyword(kw.trim())) {
                  added++;
                } else {
                  skipped++;
                }
              }
            });
            alert(
              `Import complete!

Added: ${added} blocked keywords
Skipped (duplicates): ${skipped}`
            );
            refreshPanel("keyword", { keywordSubTab: "blocked" });
          } catch (err) {
            alert("Failed to import keywords: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    panel.querySelectorAll(".xcb-remove-btn[data-keyword]").forEach((btn) => {
      btn.onclick = () => {
        const keyword = btn.dataset.keyword;
        if (keyword) {
          removeKeyword(keyword);
          refreshPanel("keyword", { keywordSubTab: "blocked" });
        }
      };
    });
    const searchKeywordInput = document.getElementById("xcbSearchKeyword");
    if (searchKeywordInput) {
      searchKeywordInput.oninput = () => {
        const query = searchKeywordInput.value.toLowerCase().trim();
        const keywordList = document.getElementById("xcbKeywordList");
        if (keywordList) {
          keywordList.querySelectorAll("li").forEach((item) => {
            const searchable = item.dataset.searchable || "";
            item.style.display = searchable.includes(query) ? "" : "none";
          });
        }
        const selectAllCheckbox = panel.querySelector("#xcbSelectAllKeyword");
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        updateKeywordBulkUI();
      };
    }
    const updateKeywordBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-keyword-select:checked").length;
      const countEl = panel.querySelector("#xcbKeywordSelectedCount");
      const removeBtn = panel.querySelector("#xcbBulkRemoveKeyword");
      const moveToHighlightedBtn = panel.querySelector("#xcbBulkMoveToHighlighted");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (removeBtn) removeBtn.style.display = selectedCount > 0 ? "" : "none";
      if (moveToHighlightedBtn) moveToHighlightedBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllKeywordCheckbox = panel.querySelector("#xcbSelectAllKeyword");
    if (selectAllKeywordCheckbox) {
      selectAllKeywordCheckbox.onchange = () => {
        const isChecked = selectAllKeywordCheckbox.checked;
        panel.querySelectorAll(".xcb-keyword-select").forEach((cb) => {
          const li = cb.closest("li");
          if (li && li.style.display !== "none") {
            cb.checked = isChecked;
          }
        });
        updateKeywordBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-keyword-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateKeywordBulkUI();
        const visibleCheckboxes = Array.from(panel.querySelectorAll(".xcb-keyword-select")).filter((cb) => {
          const li = cb.closest("li");
          return li && li.style.display !== "none";
        });
        const allChecked = visibleCheckboxes.every((cb) => cb.checked);
        if (selectAllKeywordCheckbox) selectAllKeywordCheckbox.checked = allChecked && visibleCheckboxes.length > 0;
      };
    });
    const bulkRemoveKeywordBtn = panel.querySelector("#xcbBulkRemoveKeyword");
    if (bulkRemoveKeywordBtn) {
      bulkRemoveKeywordBtn.onclick = () => {
        const selectedKeywords = Array.from(panel.querySelectorAll(".xcb-keyword-select:checked")).map((cb) => cb.dataset.keyword).filter(Boolean);
        if (selectedKeywords.length === 0) return;
        if (confirm(`Remove ${selectedKeywords.length} blocked keyword(s)?`)) {
          selectedKeywords.forEach((keyword) => removeKeyword(keyword));
          refreshPanel("keyword", { keywordSubTab: "blocked" });
        }
      };
    }
    const bulkMoveToHighlightedBtn = panel.querySelector("#xcbBulkMoveToHighlighted");
    if (bulkMoveToHighlightedBtn) {
      bulkMoveToHighlightedBtn.onclick = () => {
        const selectedKeywords = Array.from(panel.querySelectorAll(".xcb-keyword-select:checked")).map((cb) => cb.dataset.keyword).filter(Boolean);
        if (selectedKeywords.length === 0) return;
        if (confirm(`Move ${selectedKeywords.length} keyword(s) to highlighted?`)) {
          selectedKeywords.forEach((keyword) => {
            removeKeyword(keyword);
            addHighlightedKeyword(keyword);
          });
          refreshPanel("keyword", { keywordSubTab: "highlighted" });
        }
      };
    }
    const addHighlightedKeywordBtn = document.getElementById("xcbAddHighlightedKeyword");
    if (addHighlightedKeywordBtn) {
      addHighlightedKeywordBtn.onclick = () => {
        const keywordInput = document.getElementById("xcbNewHighlightedKeyword");
        const keyword = (keywordInput == null ? void 0 : keywordInput.value.trim()) || "";
        if (keyword) {
          addHighlightedKeyword(keyword);
          refreshPanel("keyword", { keywordSubTab: "highlighted" });
        }
      };
    }
    const newHighlightedKeywordInput = document.getElementById("xcbNewHighlightedKeyword");
    if (newHighlightedKeywordInput) {
      newHighlightedKeywordInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const keyword = newHighlightedKeywordInput.value.trim();
          if (keyword) {
            addHighlightedKeyword(keyword);
            refreshPanel("keyword", { keywordSubTab: "highlighted" });
          }
        }
      };
    }
    const exportHighlightedKeywordsBtn = document.getElementById("xcbExportHighlightedKeywords");
    if (exportHighlightedKeywordsBtn) {
      exportHighlightedKeywordsBtn.onclick = () => {
        const keywords = getHighlightedKeywords();
        if (keywords.length === 0) {
          alert("No highlighted keywords to export!");
          return;
        }
        const data = {
          version: "1.0",
          type: "highlighted_keywords",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          keywords: keywords.map((k) => k.keyword)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mankey-bot-highlighted-keywords-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
    const importHighlightedKeywordsInput = document.getElementById("xcbImportHighlightedKeywords");
    if (importHighlightedKeywordsInput) {
      importHighlightedKeywordsInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          var _a2;
          try {
            const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
            let keywordsToImport = [];
            try {
              const data = JSON.parse(text);
              if (data.keywords && Array.isArray(data.keywords)) {
                keywordsToImport = data.keywords;
              } else if (Array.isArray(data)) {
                keywordsToImport = data;
              }
            } catch {
              keywordsToImport = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
            }
            if (keywordsToImport.length === 0) {
              alert("No keywords found in file!");
              return;
            }
            let added = 0;
            let skipped = 0;
            keywordsToImport.forEach((kw) => {
              if (typeof kw === "string" && kw.trim()) {
                if (addHighlightedKeyword(kw.trim())) {
                  added++;
                } else {
                  skipped++;
                }
              }
            });
            alert(
              `Import complete!

Added: ${added} highlighted keywords
Skipped (duplicates): ${skipped}`
            );
            refreshPanel("keyword", { keywordSubTab: "highlighted" });
          } catch (err) {
            alert("Failed to import keywords: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    panel.querySelectorAll(".xcb-highlighted-remove-btn[data-keyword]").forEach((btn) => {
      btn.onclick = () => {
        const keyword = btn.dataset.keyword;
        if (keyword) {
          removeHighlightedKeyword(keyword);
          refreshPanel("keyword", { keywordSubTab: "highlighted" });
        }
      };
    });
    const searchHighlightedKeywordInput = document.getElementById("xcbSearchHighlightedKeyword");
    if (searchHighlightedKeywordInput) {
      searchHighlightedKeywordInput.oninput = () => {
        const query = searchHighlightedKeywordInput.value.toLowerCase().trim();
        const keywordList = document.getElementById("xcbHighlightedKeywordList");
        if (keywordList) {
          keywordList.querySelectorAll("li").forEach((item) => {
            const searchable = item.dataset.searchable || "";
            item.style.display = searchable.includes(query) ? "" : "none";
          });
        }
        const selectAllCheckbox = panel.querySelector("#xcbSelectAllHighlightedKeyword");
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        updateHighlightedKeywordBulkUI();
      };
    }
    const updateHighlightedKeywordBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-highlighted-keyword-select:checked").length;
      const countEl = panel.querySelector("#xcbHighlightedKeywordSelectedCount");
      const removeBtn = panel.querySelector("#xcbBulkRemoveHighlightedKeyword");
      const moveToBlockedBtn = panel.querySelector("#xcbBulkMoveToBlocked");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (removeBtn) removeBtn.style.display = selectedCount > 0 ? "" : "none";
      if (moveToBlockedBtn) moveToBlockedBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllHighlightedKeywordCheckbox = panel.querySelector("#xcbSelectAllHighlightedKeyword");
    if (selectAllHighlightedKeywordCheckbox) {
      selectAllHighlightedKeywordCheckbox.onchange = () => {
        const isChecked = selectAllHighlightedKeywordCheckbox.checked;
        panel.querySelectorAll(".xcb-highlighted-keyword-select").forEach((cb) => {
          const li = cb.closest("li");
          if (li && li.style.display !== "none") {
            cb.checked = isChecked;
          }
        });
        updateHighlightedKeywordBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-highlighted-keyword-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateHighlightedKeywordBulkUI();
        const visibleCheckboxes = Array.from(panel.querySelectorAll(".xcb-highlighted-keyword-select")).filter((cb) => {
          const li = cb.closest("li");
          return li && li.style.display !== "none";
        });
        const allChecked = visibleCheckboxes.every((cb) => cb.checked);
        if (selectAllHighlightedKeywordCheckbox) selectAllHighlightedKeywordCheckbox.checked = allChecked && visibleCheckboxes.length > 0;
      };
    });
    const bulkRemoveHighlightedKeywordBtn = panel.querySelector("#xcbBulkRemoveHighlightedKeyword");
    if (bulkRemoveHighlightedKeywordBtn) {
      bulkRemoveHighlightedKeywordBtn.onclick = () => {
        const selectedKeywords = Array.from(panel.querySelectorAll(".xcb-highlighted-keyword-select:checked")).map((cb) => cb.dataset.keyword).filter(Boolean);
        if (selectedKeywords.length === 0) return;
        if (confirm(`Remove ${selectedKeywords.length} highlighted keyword(s)?`)) {
          selectedKeywords.forEach((keyword) => removeHighlightedKeyword(keyword));
          refreshPanel("keyword", { keywordSubTab: "highlighted" });
        }
      };
    }
    const bulkMoveToBlockedBtn = panel.querySelector("#xcbBulkMoveToBlocked");
    if (bulkMoveToBlockedBtn) {
      bulkMoveToBlockedBtn.onclick = () => {
        const selectedKeywords = Array.from(panel.querySelectorAll(".xcb-highlighted-keyword-select:checked")).map((cb) => cb.dataset.keyword).filter(Boolean);
        if (selectedKeywords.length === 0) return;
        if (confirm(`Move ${selectedKeywords.length} keyword(s) to blocked?`)) {
          selectedKeywords.forEach((keyword) => {
            removeHighlightedKeyword(keyword);
            addKeyword(keyword);
          });
          refreshPanel("keyword", { keywordSubTab: "blocked" });
        }
      };
    }
    updateKeywordBulkUI();
    updateHighlightedKeywordBulkUI();
  }
  function setupRequestsHandlers({ panel, refreshPanel }) {
    const requestsHelpBtn = document.getElementById("xcbRequestsHelp");
    if (requestsHelpBtn) {
      requestsHelpBtn.onclick = () => {
        const box = document.getElementById("xcbRequestsHelpBox");
        if (box) {
          box.style.display = box.style.display === "none" ? "block" : "none";
        }
      };
    }
    const pauseRequestsBtn = document.getElementById("xcbRequestsPaused");
    if (pauseRequestsBtn) {
      pauseRequestsBtn.onchange = () => {
        var _a;
        const s = getSettings();
        const isPaused = pauseRequestsBtn.checked;
        s.requestsPaused = isPaused;
        saveSettings(s);
        (_a = window.updateQuickNavRequestsState) == null ? void 0 : _a.call(window);
        document.querySelectorAll(".xcb-add-request-btn").forEach((btn) => {
          btn.style.display = isPaused ? "none" : "";
        });
        const settingsToggle = document.getElementById("xcbRequestsPausedSetting");
        if (settingsToggle) {
          settingsToggle.checked = isPaused;
        }
        refreshPanel("requests");
      };
    }
    const getFilteredRequests = (filter) => {
      const active = getActiveRequests();
      const archived = getArchivedRequests();
      switch (filter) {
        case "pending":
          return active.filter((r) => r.status === "pending" || !r.status);
        case "completed":
          return active.filter((r) => r.status === "completed");
        case "archived":
          return archived;
        case "all":
        default:
          return [...active, ...archived];
      }
    };
    panel.querySelectorAll(".xcb-export-trigger").forEach((btn) => {
      btn.onclick = (e) => {
        var _a;
        e.stopPropagation();
        const dropdown = (_a = btn.parentElement) == null ? void 0 : _a.querySelector(".xcb-export-menu");
        if (!dropdown) return;
        panel.querySelectorAll(".xcb-export-menu").forEach((menu) => {
          if (menu !== dropdown) menu.style.display = "none";
        });
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      };
    });
    panel.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.closest(".xcb-export-dropdown")) {
        panel.querySelectorAll(".xcb-export-menu").forEach((menu) => {
          menu.style.display = "none";
        });
      }
    });
    panel.querySelectorAll(".xcb-export-option").forEach((option) => {
      option.onmouseenter = () => {
        option.style.background = "var(--xcb-hover-bg, #333)";
      };
      option.onmouseleave = () => {
        option.style.background = "transparent";
      };
      option.onclick = (e) => {
        e.stopPropagation();
        const filter = option.dataset.filter || "all";
        const menu = option.closest(".xcb-export-menu");
        const format = (menu == null ? void 0 : menu.dataset.format) || "txt";
        const requests = getFilteredRequests(filter);
        if (requests.length === 0) {
          alert(`No ${filter === "all" ? "" : filter + " "}requests to export!`);
          menu.style.display = "none";
          return;
        }
        const filterSuffix = filter === "all" ? "" : `-${filter}`;
        const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        if (format === "txt") {
          let txt = "MaNKeY-Bot Requests Export\n";
          txt += "==========================\n";
          txt += `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}

`;
          requests.forEach((req, i) => {
            txt += i + 1 + ". " + req.username + " (" + new Date(req.date).toLocaleString() + ")\n";
            txt += "   Status: " + (req.archived ? "Archived" : req.status || "Active") + "\n";
            txt += '   Request: "' + (req.text || "").replace(/\n/g, " ") + '"\n';
            if (req.sourceUrl) txt += "   Source: " + req.sourceUrl + "\n";
            if (req.checklist && req.checklist.length > 0) {
              txt += "   Checklist:\n";
              req.checklist.forEach((item) => {
                const checkbox = item.completed ? "[x]" : "[ ]";
                txt += `      ${checkbox} ${item.text.replace(/\n/g, " ")}
`;
              });
            }
            txt += "\n";
          });
          const blob = new Blob([txt], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `mankey-bot-requests${filterSuffix}-${dateStr}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (format === "csv") {
          const escapeCSV = (str) => '"' + (str || "").replace(/"/g, '""').replace(/\n/g, " ") + '"';
          const makeHyperlink = (url2) => {
            if (!url2 || !url2.trim()) return '""';
            const escapedUrl = url2.replace(/"/g, '""');
            return `"=HYPERLINK(""${escapedUrl}"",""View Source"")"`;
          };
          const formatChecklist = (checklist) => {
            if (!checklist || checklist.length === 0) return "";
            return checklist.map((item) => {
              const status = item.completed ? "[x]" : "[ ]";
              return `${status} ${item.text.replace(/\n/g, " ")}`;
            }).join("; ");
          };
          let csv = "Username,Date,Status,Request,Checklist,Source Link\n";
          requests.forEach((req) => {
            csv += escapeCSV(req.username) + ",";
            csv += escapeCSV(new Date(req.date).toISOString()) + ",";
            csv += escapeCSV(req.archived ? "Archived" : req.status || "Active") + ",";
            csv += escapeCSV(req.text || "") + ",";
            csv += escapeCSV(formatChecklist(req.checklist)) + ",";
            csv += makeHyperlink(req.sourceUrl || "") + "\n";
          });
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `mankey-bot-requests${filterSuffix}-${dateStr}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (format === "json") {
          const data = {
            version: "1.0",
            type: "requests",
            filter,
            exportDate: (/* @__PURE__ */ new Date()).toISOString(),
            requests: requests.map((req) => ({
              username: req.username,
              text: req.text || "",
              date: req.date,
              status: req.status || "pending",
              archived: req.archived || false,
              sourceUrl: req.sourceUrl || "",
              checklist: req.checklist || []
            }))
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `mankey-requests${filterSuffix}-${dateStr}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
        menu.style.display = "none";
      };
    });
    const importCSVInput = document.getElementById("xcbImportCSV");
    if (importCSVInput) {
      importCSVInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          var _a2, _b, _c;
          try {
            const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
            let imported = 0;
            if (file.name.endsWith(".json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
              try {
                const json = JSON.parse(text);
                const requests = json.requests || json;
                if (Array.isArray(requests)) {
                  requests.forEach((req) => {
                    const username = req.username || "Unknown";
                    const commentText = req.text || req.request || req.comment || "";
                    const sourceUrl = req.sourceUrl || req.source || "";
                    if (username && commentText) {
                      addRequest(username, commentText, sourceUrl);
                      imported++;
                    }
                  });
                  alert(`Imported ${imported} request(s) from JSON`);
                  (_b = window.updateQuickNavRequestsState) == null ? void 0 : _b.call(window);
                  refreshPanel("requests");
                  return;
                }
              } catch {
              }
            }
            const lines = text.split("\n");
            if (lines.length < 1) {
              alert("File appears to be empty");
              return;
            }
            const firstLine = lines[0].trim().toLowerCase();
            const startIdx = firstLine.includes("username") || firstLine.includes("request") ? 1 : 0;
            for (let i = startIdx; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              if (line.includes(",")) {
                const fields = [];
                let field = "";
                let inQuotes = false;
                for (let j = 0; j < line.length; j++) {
                  const char = line[j];
                  if (char === '"') {
                    if (inQuotes && line[j + 1] === '"') {
                      field += '"';
                      j++;
                    } else {
                      inQuotes = !inQuotes;
                    }
                  } else if (char === "," && !inQuotes) {
                    fields.push(field);
                    field = "";
                  } else {
                    field += char;
                  }
                }
                fields.push(field);
                if (fields.length >= 4) {
                  const username = fields[0] || "Unknown";
                  const commentText = fields[3] || "";
                  const sourceUrl = fields[4] || "";
                  if (username && commentText) {
                    addRequest(username, commentText, sourceUrl);
                    imported++;
                  }
                } else if (fields.length >= 2) {
                  const username = fields[0] || "Unknown";
                  const commentText = fields[1] || "";
                  if (username && commentText) {
                    addRequest(username, commentText, "");
                    imported++;
                  }
                }
              } else {
                addRequest("Unknown", line, "");
                imported++;
              }
            }
            alert(`Imported ${imported} request(s)`);
            (_c = window.updateQuickNavRequestsState) == null ? void 0 : _c.call(window);
            refreshPanel("requests");
          } catch (err) {
            alert("Error importing file: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    const addRequestBtn = document.getElementById("xcbAddRequest");
    if (addRequestBtn) {
      addRequestBtn.onclick = () => {
        var _a;
        const usernameInput = document.getElementById("xcbNewRequestUser");
        const textInput = document.getElementById("xcbNewRequestText");
        const sourceInput = document.getElementById("xcbNewRequestSource");
        const username = (usernameInput == null ? void 0 : usernameInput.value.trim()) || "";
        const text = (textInput == null ? void 0 : textInput.value.trim()) || "";
        const sourceUrl = (sourceInput == null ? void 0 : sourceInput.value.trim()) || "";
        if (username && text) {
          addRequest(username, text, sourceUrl);
          (_a = window.updateQuickNavRequestsState) == null ? void 0 : _a.call(window);
          refreshPanel("requests");
        }
      };
    }
    panel.querySelectorAll("#xcbRequestFilters .xcb-status-filter").forEach((btn) => {
      btn.onclick = () => {
        panel.querySelectorAll("#xcbRequestFilters .xcb-status-filter").forEach((b) => b.classList.remove("active", "active-archived"));
        btn.classList.add(
          btn.dataset.filter === "archived" ? "active-archived" : "active"
        );
        const filter = btn.dataset.filter;
        const requestList2 = document.getElementById("xcbRequestList");
        const deletedSection = document.getElementById("xcbDeletedRequestsSection");
        const archivedSection = document.getElementById("xcbArchivedRequestsSection");
        const bulkActionsBar = document.getElementById("xcbBulkActionsBar");
        if (filter === "deleted") {
          if (requestList2) requestList2.style.display = "none";
          if (archivedSection) archivedSection.style.display = "none";
          if (deletedSection) deletedSection.style.display = "";
          if (bulkActionsBar) bulkActionsBar.style.display = "none";
        } else if (filter === "archived") {
          if (requestList2) requestList2.style.display = "none";
          if (deletedSection) deletedSection.style.display = "none";
          if (archivedSection) archivedSection.style.display = "";
          if (bulkActionsBar) bulkActionsBar.style.display = "none";
        } else {
          if (deletedSection) deletedSection.style.display = "none";
          if (archivedSection) archivedSection.style.display = "none";
          if (bulkActionsBar) bulkActionsBar.style.display = "";
          if (requestList2) {
            requestList2.style.display = "";
            requestList2.querySelectorAll(".xcb-request-item").forEach((item) => {
              if (filter === "all" || item.dataset.status === filter) {
                item.style.display = "";
              } else {
                item.style.display = "none";
              }
            });
          }
        }
      };
    });
    panel.querySelectorAll(".xcb-deleted-request-action").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!id) return;
        if (action === "restore") {
          restoreRequestFromTrash(id);
          refreshPanel("requests");
        } else if (action === "permanent-delete") {
          if (confirm("Permanently delete this request? This cannot be undone.")) {
            permanentlyDeleteRequest(id);
            refreshPanel("requests");
          }
        }
      };
    });
    const updateDeletedBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-deleted-select:checked").length;
      const countEl = panel.querySelector("#xcbDeletedSelectedCount");
      const restoreBtn = panel.querySelector("#xcbBulkRestore");
      const deleteBtn = panel.querySelector("#xcbBulkPermanentDelete");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (restoreBtn) restoreBtn.style.display = selectedCount > 0 ? "" : "none";
      if (deleteBtn) deleteBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllDeletedCheckbox = panel.querySelector("#xcbSelectAllDeleted");
    if (selectAllDeletedCheckbox) {
      selectAllDeletedCheckbox.onchange = () => {
        const isChecked = selectAllDeletedCheckbox.checked;
        panel.querySelectorAll(".xcb-deleted-select").forEach((cb) => {
          cb.checked = isChecked;
        });
        updateDeletedBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-deleted-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateDeletedBulkUI();
        const allCheckboxes = panel.querySelectorAll(".xcb-deleted-select");
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        if (selectAllDeletedCheckbox) selectAllDeletedCheckbox.checked = allChecked && allCheckboxes.length > 0;
      };
    });
    const bulkRestoreBtn = panel.querySelector("#xcbBulkRestore");
    if (bulkRestoreBtn) {
      bulkRestoreBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-deleted-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Restore ${selectedIds.length} request(s)?`)) {
          selectedIds.forEach((id) => restoreRequestFromTrash(id));
          refreshPanel("requests");
        }
      };
    }
    const bulkPermanentDeleteBtn = panel.querySelector("#xcbBulkPermanentDelete");
    if (bulkPermanentDeleteBtn) {
      bulkPermanentDeleteBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-deleted-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Permanently delete ${selectedIds.length} request(s)? This cannot be undone.`)) {
          selectedIds.forEach((id) => permanentlyDeleteRequest(id));
          refreshPanel("requests");
        }
      };
    }
    const updateArchivedBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-archived-select:checked").length;
      const countEl = panel.querySelector("#xcbArchivedSelectedCount");
      const unarchiveBtn = panel.querySelector("#xcbBulkUnarchive");
      const deleteBtn = panel.querySelector("#xcbBulkDeleteArchived");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (unarchiveBtn) unarchiveBtn.style.display = selectedCount > 0 ? "" : "none";
      if (deleteBtn) deleteBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllArchivedCheckbox = panel.querySelector("#xcbSelectAllArchived");
    if (selectAllArchivedCheckbox) {
      selectAllArchivedCheckbox.onchange = () => {
        const isChecked = selectAllArchivedCheckbox.checked;
        panel.querySelectorAll(".xcb-archived-select").forEach((cb) => {
          cb.checked = isChecked;
        });
        updateArchivedBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-archived-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateArchivedBulkUI();
        const allCheckboxes = panel.querySelectorAll(".xcb-archived-select");
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        if (selectAllArchivedCheckbox) selectAllArchivedCheckbox.checked = allChecked && allCheckboxes.length > 0;
      };
    });
    const bulkUnarchiveBtn = panel.querySelector("#xcbBulkUnarchive");
    if (bulkUnarchiveBtn) {
      bulkUnarchiveBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-archived-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Restore ${selectedIds.length} request(s) from archive?`)) {
          selectedIds.forEach((id) => unarchiveRequest(id));
          refreshPanel("requests");
        }
      };
    }
    const bulkDeleteArchivedBtn = panel.querySelector("#xcbBulkDeleteArchived");
    if (bulkDeleteArchivedBtn) {
      bulkDeleteArchivedBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-archived-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} archived request(s)?`)) {
          selectedIds.forEach((id) => deleteRequest(id));
          refreshPanel("requests");
        }
      };
    }
    const searchRequests = document.getElementById("xcbSearchRequests");
    if (searchRequests) {
      searchRequests.oninput = () => {
        const query = searchRequests.value.toLowerCase();
        const requestList2 = document.getElementById("xcbRequestList");
        if (requestList2) {
          requestList2.querySelectorAll(".xcb-request-item").forEach((item) => {
            const searchable = item.dataset.searchable || "";
            item.style.display = searchable.includes(query) ? "" : "none";
          });
        }
      };
    }
    panel.querySelectorAll(".xcb-status-btn").forEach((btn) => {
      btn.onclick = (e) => {
        var _a, _b;
        e.stopPropagation();
        const id = btn.dataset.id;
        const newStatus = btn.dataset.status;
        if (!id || !newStatus) return;
        updateRequest(id, { status: newStatus });
        const container = btn.closest(".xcb-request-status-btns");
        if (container) {
          container.querySelectorAll(".xcb-status-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        }
        const item = btn.closest(".xcb-request-item");
        if (item) {
          item.dataset.status = newStatus;
          const activeFilter = panel.querySelector("#xcbRequestFilters .xcb-status-filter.active");
          const currentFilter = ((_a = activeFilter == null ? void 0 : activeFilter.dataset) == null ? void 0 : _a.filter) || "all";
          if (currentFilter === "all" || currentFilter === newStatus) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
          const filterBtns = panel.querySelectorAll("#xcbRequestFilters .xcb-status-filter");
          const allItems = panel.querySelectorAll("#xcbRequestList .xcb-request-item");
          filterBtns.forEach((filterBtn) => {
            var _a2;
            const filter = filterBtn.dataset.filter;
            let count = 0;
            allItems.forEach((reqItem) => {
              if (filter === "all" || reqItem.dataset.status === filter) count++;
            });
            const text = ((_a2 = filterBtn.textContent) == null ? void 0 : _a2.replace(/\(\d+\)/, `(${count})`)) || "";
            filterBtn.textContent = text;
          });
          const requestsTabBtn = panel.querySelector('.xcb-tab[data-tab="requests"]');
          if (requestsTabBtn) {
            const currentSettings = getSettings();
            let pendingCount = 0;
            Array.from(allItems).forEach((reqItem) => {
              if (reqItem.dataset.status === "pending") {
                const checklistItems = reqItem.querySelectorAll(".xcb-checklist-item");
                if (currentSettings.requestCountMode === "requests_and_subtasks") {
                  pendingCount += 1 + checklistItems.length;
                } else if (currentSettings.requestCountMode === "subtasks_only") {
                  pendingCount += checklistItems.length;
                } else {
                  pendingCount++;
                }
              }
            });
            requestsTabBtn.textContent = ((_b = requestsTabBtn.textContent) == null ? void 0 : _b.replace(
              /\(\d+\)/,
              `(${pendingCount})`
            )) || "";
          }
        }
      };
    });
    panel.querySelectorAll(".xcb-request-btn[data-action]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!id) return;
        if (action === "delete") {
          if (confirm("Move this request to trash? You can restore it within 14 days.")) {
            deleteRequest(id);
            refreshPanel("requests");
          }
        } else if (action === "archive") {
          archiveRequest(id);
          refreshPanel("requests");
        } else if (action === "unarchive") {
          unarchiveRequest(id);
          refreshPanel("requests");
        } else if (action === "edit") {
          showRequestEditPopup(id);
        }
      };
    });
    const updateBulkUI = () => {
      const checkboxes = panel.querySelectorAll(".xcb-request-select:checked");
      const count = checkboxes.length;
      const countEl = panel.querySelector("#xcbSelectedCount");
      const completeBtn = panel.querySelector("#xcbBulkComplete");
      const archiveBtn = panel.querySelector("#xcbBulkArchive");
      const deleteBtn = panel.querySelector("#xcbBulkDelete");
      if (countEl) countEl.textContent = `(${count} selected)`;
      if (completeBtn) completeBtn.style.display = count > 0 ? "" : "none";
      if (archiveBtn) archiveBtn.style.display = count > 0 ? "" : "none";
      if (deleteBtn) deleteBtn.style.display = count > 0 ? "" : "none";
    };
    const selectAllCheckbox = panel.querySelector("#xcbSelectAllRequests");
    if (selectAllCheckbox) {
      selectAllCheckbox.onchange = () => {
        const isChecked = selectAllCheckbox.checked;
        panel.querySelectorAll(".xcb-request-item").forEach((item) => {
          if (item.style.display !== "none") {
            const checkbox = item.querySelector(".xcb-request-select");
            if (checkbox) checkbox.checked = isChecked;
          }
        });
        updateBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-request-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateBulkUI();
        const allCheckboxes = panel.querySelectorAll(".xcb-request-item:not([style*='display: none']) .xcb-request-select");
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        if (selectAllCheckbox) selectAllCheckbox.checked = allChecked && allCheckboxes.length > 0;
      };
    });
    const bulkCompleteBtn = panel.querySelector("#xcbBulkComplete");
    if (bulkCompleteBtn) {
      bulkCompleteBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-request-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Mark ${selectedIds.length} request(s) as completed?`)) {
          selectedIds.forEach((id) => updateRequest(id, { status: "completed" }));
          refreshPanel("requests");
        }
      };
    }
    const bulkArchiveBtn = panel.querySelector("#xcbBulkArchive");
    if (bulkArchiveBtn) {
      bulkArchiveBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-request-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Archive ${selectedIds.length} request(s)?`)) {
          selectedIds.forEach((id) => archiveRequest(id));
          refreshPanel("requests");
        }
      };
    }
    const bulkDeleteBtn = panel.querySelector("#xcbBulkDelete");
    if (bulkDeleteBtn) {
      bulkDeleteBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-request-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Move ${selectedIds.length} request(s) to trash?`)) {
          selectedIds.forEach((id) => deleteRequest(id));
          refreshPanel("requests");
        }
      };
    }
    panel.querySelectorAll(".xcb-request-expand").forEach((btn) => {
      btn.onclick = () => {
        const textEl = btn.previousElementSibling;
        if (textEl) {
          if (textEl.classList.contains("collapsed")) {
            textEl.classList.remove("collapsed");
            btn.textContent = "Show less";
          } else {
            textEl.classList.add("collapsed");
            btn.textContent = "Show more";
          }
        }
      };
    });
    panel.querySelectorAll(".xcb-checklist").forEach((checklist) => {
      const requestId = checklist.dataset.requestId;
      if (!requestId) return;
      checklist.querySelectorAll('.xcb-checklist-item input[type="checkbox"]').forEach((checkbox) => {
        checkbox.onchange = () => {
          const item = checkbox.closest(".xcb-checklist-item");
          const checklistId = item == null ? void 0 : item.dataset.checklistId;
          if (checklistId) {
            updateChecklistItem(requestId, checklistId, {
              completed: checkbox.checked
            });
            item == null ? void 0 : item.classList.toggle("completed", checkbox.checked);
          }
        };
      });
      checklist.querySelectorAll(".xcb-checklist-delete").forEach((btn) => {
        btn.onclick = () => {
          const item = btn.closest(".xcb-checklist-item");
          const checklistId = item == null ? void 0 : item.dataset.checklistId;
          if (checklistId) {
            deleteChecklistItem(requestId, checklistId);
            item == null ? void 0 : item.remove();
          }
        };
      });
      const addForm = checklist.querySelector(".xcb-checklist-add");
      if (addForm) {
        const input = addForm.querySelector("input");
        const addBtn = addForm.querySelector("button");
        const doAdd = () => {
          const text = (input == null ? void 0 : input.value.trim()) || "";
          if (text) {
            const settings = getSettings();
            const countMode = settings.requestCountMode || "requests";
            if (countMode === "requests_and_subtasks" || countMode === "subtasks_only") {
              const request = getRequests().find((r) => r.id === requestId);
              if (request && request.status === "pending" && !request.archived) {
                const warnings = [];
                const perUserLimit = settings.requestLimitPerUser || 0;
                if (perUserLimit > 0) {
                  const currentUserCount = getRequestCountByUser(request.username, countMode);
                  if (currentUserCount >= perUserLimit) {
                    warnings.push(`${request.username} is at their limit (${currentUserCount}/${perUserLimit})`);
                  } else if (currentUserCount + 1 >= perUserLimit) {
                    warnings.push(`This will put ${request.username} at their limit (${currentUserCount + 1}/${perUserLimit})`);
                  }
                }
                const totalLimit = settings.totalRequestsLimit || 0;
                if (totalLimit > 0) {
                  const currentTotal = getTotalRequestCount(countMode);
                  if (currentTotal >= totalLimit) {
                    warnings.push(`Total requests at limit (${currentTotal}/${totalLimit})`);
                  } else if (currentTotal + 1 >= totalLimit) {
                    warnings.push(`This will put you at your total limit (${currentTotal + 1}/${totalLimit})`);
                  }
                }
                if (warnings.length > 0) {
                  const proceed = confirm(`Warning: Sub-tasks count towards your request limits.

${warnings.join("\n")}

Add sub-task anyway?`);
                  if (!proceed) return;
                }
              }
            }
            addChecklistItem(requestId, text);
            refreshPanel("requests");
          }
        };
        if (addBtn) addBtn.onclick = doAdd;
        if (input) {
          input.onkeypress = (e) => {
            if (e.key === "Enter") doAdd();
          };
        }
      }
      let draggedChecklistItem = null;
      checklist.querySelectorAll(".xcb-checklist-item").forEach((item) => {
        item.addEventListener("dragstart", (e) => {
          draggedChecklistItem = item;
          item.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
          e.stopPropagation();
        });
        item.addEventListener("dragend", () => {
          item.classList.remove("dragging");
          checklist.querySelectorAll(".xcb-checklist-item").forEach((el) => {
            el.classList.remove("drag-over");
          });
          draggedChecklistItem = null;
        });
        item.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedChecklistItem && draggedChecklistItem !== item) {
            item.classList.add("drag-over");
          }
        });
        item.addEventListener("dragleave", () => {
          item.classList.remove("drag-over");
        });
        item.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          item.classList.remove("drag-over");
          if (draggedChecklistItem && draggedChecklistItem !== item) {
            const items = Array.from(checklist.querySelectorAll(".xcb-checklist-item"));
            const draggedIdx = items.indexOf(draggedChecklistItem);
            const targetIdx = items.indexOf(item);
            if (draggedIdx < targetIdx) {
              item.after(draggedChecklistItem);
            } else {
              item.before(draggedChecklistItem);
            }
            const newOrder = Array.from(checklist.querySelectorAll(".xcb-checklist-item")).map(
              (el) => el.dataset.checklistId
            ).filter(Boolean);
            reorderChecklistItems(requestId, newOrder);
          }
        });
      });
    });
    const archivedToggle = document.getElementById("xcbArchivedToggle");
    if (archivedToggle) {
      archivedToggle.onclick = () => {
        const list = document.getElementById("xcbArchivedList");
        const toggle = archivedToggle.querySelector(".xcb-archived-toggle");
        if (list) {
          if (list.style.display === "none") {
            list.style.display = "block";
            if (toggle) toggle.textContent = "▲";
          } else {
            list.style.display = "none";
            if (toggle) toggle.textContent = "▼";
          }
        }
      };
    }
    const requestList = document.getElementById("xcbRequestList");
    if (requestList) {
      let draggedItem = null;
      requestList.querySelectorAll('.xcb-request-item[draggable="true"]').forEach((item) => {
        item.addEventListener("dragstart", (e) => {
          draggedItem = item;
          item.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        item.addEventListener("dragend", () => {
          item.classList.remove("dragging");
          requestList.querySelectorAll(".xcb-request-item").forEach((i) => i.classList.remove("drag-over"));
          draggedItem = null;
          const orderedIds = Array.from(
            requestList.querySelectorAll('.xcb-request-item[draggable="true"]')
          ).map((i) => i.dataset.id).filter(Boolean);
          reorderRequests(orderedIds);
        });
        item.addEventListener("dragover", (e) => {
          e.preventDefault();
          if (draggedItem && draggedItem !== item) {
            item.classList.add("drag-over");
          }
        });
        item.addEventListener("dragleave", () => {
          item.classList.remove("drag-over");
        });
        item.addEventListener("drop", (e) => {
          var _a, _b;
          e.preventDefault();
          item.classList.remove("drag-over");
          if (draggedItem && draggedItem !== item) {
            const allItems = Array.from(
              requestList.querySelectorAll('.xcb-request-item[draggable="true"]')
            );
            const draggedIndex = allItems.indexOf(draggedItem);
            const targetIndex = allItems.indexOf(item);
            if (draggedIndex < targetIndex) {
              (_a = item.parentNode) == null ? void 0 : _a.insertBefore(draggedItem, item.nextSibling);
            } else {
              (_b = item.parentNode) == null ? void 0 : _b.insertBefore(draggedItem, item);
            }
          }
        });
      });
    }
  }
  let currentNoteSectionFilter = null;
  let currentNoteStatusFilter = "active";
  function getCurrentNoteSectionFilter() {
    return currentNoteSectionFilter;
  }
  function setupNotesHandlers({ panel, refreshPanel }) {
    const notesHelpBtn = document.getElementById("xcbNotesHelp");
    const notesHelpBox = document.getElementById("xcbNotesHelpBox");
    if (notesHelpBtn && notesHelpBox) {
      notesHelpBtn.onclick = () => {
        if (notesHelpBox.style.display === "none") {
          notesHelpBox.style.display = "block";
          notesHelpBtn.textContent = "✕ Hide Help";
        } else {
          notesHelpBox.style.display = "none";
          notesHelpBtn.textContent = "? Help";
        }
      };
    }
    const applyNoteStatusFilter = (filter) => {
      currentNoteStatusFilter = filter;
      const notesList = document.getElementById("xcbNotesList");
      if (notesList) {
        notesList.querySelectorAll(".xcb-note-card").forEach((card) => {
          const status = card.dataset.status;
          const sectionId = card.dataset.sectionId || "";
          const matchesStatus = filter === "all" || status === filter;
          let matchesSection = true;
          if (currentNoteSectionFilter !== null) {
            if (currentNoteSectionFilter === "unsectioned") {
              matchesSection = !sectionId;
            } else {
              matchesSection = sectionId === currentNoteSectionFilter;
            }
          }
          if (matchesStatus && matchesSection) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        const deletedDisclaimer = notesList.querySelector(".xcb-deleted-disclaimer");
        if (deletedDisclaimer) {
          deletedDisclaimer.style.display = filter === "deleted" ? "" : "none";
        }
        const visibleCards = Array.from(
          notesList.querySelectorAll(".xcb-note-card")
        ).filter((c) => c.style.display !== "none");
        const emptyMsg = notesList.querySelector(".xcb-notes-empty");
        if (emptyMsg) {
          emptyMsg.style.display = visibleCards.length === 0 ? "" : "none";
        }
      }
      panel.querySelectorAll(".xcb-note-status-filter").forEach((b) => {
        b.classList.remove("active", "active-archived");
        if (b.dataset.filter === filter) {
          b.classList.add(filter === "archived" ? "active-archived" : "active");
        }
      });
    };
    applyNoteStatusFilter(currentNoteStatusFilter);
    panel.querySelectorAll(".xcb-note-status-filter").forEach((btn) => {
      btn.onclick = () => {
        applyNoteStatusFilter(btn.dataset.filter || "all");
      };
    });
    const searchNotesInput = document.getElementById("xcbSearchNotes");
    if (searchNotesInput) {
      searchNotesInput.oninput = () => {
        const query = searchNotesInput.value.toLowerCase();
        const notesList = document.getElementById("xcbNotesList");
        if (notesList) {
          notesList.querySelectorAll(".xcb-note-card").forEach((card) => {
            const status = card.dataset.status;
            const sectionId = card.dataset.sectionId || "";
            const searchable = card.dataset.searchable || "";
            const matchesStatus = currentNoteStatusFilter === "all" || status === currentNoteStatusFilter;
            let matchesSection = true;
            if (currentNoteSectionFilter !== null) {
              if (currentNoteSectionFilter === "unsectioned") {
                matchesSection = !sectionId;
              } else {
                matchesSection = sectionId === currentNoteSectionFilter;
              }
            }
            const matchesSearch = searchable.includes(query);
            card.style.display = matchesStatus && matchesSection && matchesSearch ? "" : "none";
          });
        }
      };
    }
    const noteSortSelect = document.getElementById("xcbNoteSortOrder");
    if (noteSortSelect) {
      noteSortSelect.onchange = () => {
        const sortOrder = noteSortSelect.value;
        const s = getSettings();
        s.notesSortOrder = sortOrder;
        saveSettings(s);
        refreshPanel("notes");
      };
    }
    const getFilteredNotes = (filter) => {
      const all = getNotes();
      switch (filter) {
        case "active":
          return all.filter((n) => !n.archived);
        case "archived":
          return all.filter((n) => n.archived);
        case "all":
        default:
          return all;
      }
    };
    panel.querySelectorAll(".xcb-notes-export-trigger").forEach((btn) => {
      btn.onclick = (e) => {
        var _a;
        e.stopPropagation();
        const dropdown = (_a = btn.parentElement) == null ? void 0 : _a.querySelector(".xcb-notes-export-menu");
        if (!dropdown) return;
        panel.querySelectorAll(".xcb-notes-export-menu").forEach((menu) => {
          if (menu !== dropdown) menu.style.display = "none";
        });
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      };
    });
    const notesTab = panel.querySelector("#xcbTabNotes");
    if (notesTab) {
      notesTab.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.closest(".xcb-export-dropdown")) {
          panel.querySelectorAll(".xcb-notes-export-menu").forEach((menu) => {
            menu.style.display = "none";
          });
        }
      });
    }
    panel.querySelectorAll(".xcb-notes-export-option").forEach((option) => {
      option.onmouseenter = () => {
        option.style.background = "var(--xcb-hover-bg, #333)";
      };
      option.onmouseleave = () => {
        option.style.background = "transparent";
      };
      option.onclick = (e) => {
        e.stopPropagation();
        const filter = option.dataset.filter || "all";
        const menu = option.closest(".xcb-notes-export-menu");
        const format = (menu == null ? void 0 : menu.dataset.format) || "txt";
        const notes = getFilteredNotes(filter);
        if (notes.length === 0) {
          alert(`No ${filter === "all" ? "" : filter + " "}notes to export!`);
          menu.style.display = "none";
          return;
        }
        const sections = getNoteSections();
        const filterSuffix = filter === "all" ? "" : `-${filter}`;
        const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const formatSubtasks = (subtasks, indent = "      ") => {
          if (!subtasks || subtasks.length === 0) return "";
          let result = "";
          subtasks.forEach((st) => {
            const checkbox = st.completed ? "[x]" : "[ ]";
            result += `${indent}${checkbox} ${st.text.replace(/\n/g, " ")}
`;
            if (st.subtasks && st.subtasks.length > 0) {
              result += formatSubtasks(st.subtasks, indent + "   ");
            }
          });
          return result;
        };
        if (format === "txt") {
          let txt = "MaNKeY-Bot Notes Export\n";
          txt += "========================\n";
          txt += `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}

`;
          notes.forEach((note, i) => {
            txt += i + 1 + ". " + note.username + " (" + new Date(note.date).toLocaleString() + ")\n";
            txt += "   Status: " + (note.archived ? "Archived" : "Active") + "\n";
            if (note.sectionId) {
              const section = sections.find((s) => s.id === note.sectionId);
              if (section) {
                const prefix = getSectionPrefix(section.level, section.order);
                txt += "   Section: " + prefix + " " + section.name + "\n";
              }
            }
            if (note.tags && note.tags.length > 0) txt += "   Tags: " + note.tags.join(", ") + "\n";
            txt += '   Comment: "' + (note.commentText || "").replace(/\n/g, " ") + '"\n';
            if (note.note) txt += "   Your Note: " + note.note + "\n";
            if (note.sourceUrl) txt += "   Source: " + note.sourceUrl + "\n";
            if (note.subtasks && note.subtasks.length > 0) {
              txt += "   Subtasks:\n";
              txt += formatSubtasks(note.subtasks);
            }
            txt += "\n";
          });
          const blob = new Blob([txt], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `mankey-bot-notes${filterSuffix}-${dateStr}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (format === "csv") {
          const escapeCSV = (str) => '"' + (str || "").replace(/"/g, '""').replace(/\n/g, " ") + '"';
          const makeHyperlink = (url2) => {
            if (!url2 || !url2.trim()) return '""';
            const escapedUrl = url2.replace(/"/g, '""');
            return `"=HYPERLINK(""${escapedUrl}"",""View Source"")"`;
          };
          const getSectionName = (sectionId) => {
            if (!sectionId) return "";
            const section = sections.find((s) => s.id === sectionId);
            if (!section) return "";
            const prefix = getSectionPrefix(section.level, section.order);
            return `${prefix} ${section.name}`;
          };
          const formatSubtasksFlat = (subtasks, depth = 0) => {
            if (!subtasks || subtasks.length === 0) return "";
            const items = [];
            const indent = "→".repeat(depth);
            subtasks.forEach((st) => {
              const checkbox = st.completed ? "[x]" : "[ ]";
              const prefix = depth > 0 ? indent + " " : "";
              items.push(`${prefix}${checkbox} ${st.text.replace(/\n/g, " ")}`);
              if (st.subtasks && st.subtasks.length > 0) {
                const nested = formatSubtasksFlat(st.subtasks, depth + 1);
                if (nested) items.push(nested);
              }
            });
            return items.join("; ");
          };
          let csv = "Username,Date,Status,Section,Tags,Comment,Note,Subtasks,Source Link\n";
          notes.forEach((note) => {
            csv += escapeCSV(note.username) + ",";
            csv += escapeCSV(new Date(note.date).toISOString()) + ",";
            csv += escapeCSV(note.archived ? "Archived" : "Active") + ",";
            csv += escapeCSV(getSectionName(note.sectionId)) + ",";
            csv += escapeCSV((note.tags || []).join("; ")) + ",";
            csv += escapeCSV(note.commentText || "") + ",";
            csv += escapeCSV(note.note || "") + ",";
            csv += escapeCSV(formatSubtasksFlat(note.subtasks)) + ",";
            csv += makeHyperlink(note.sourceUrl || "") + "\n";
          });
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `mankey-bot-notes${filterSuffix}-${dateStr}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }
        menu.style.display = "none";
      };
    });
    const importNotesCSVInput = document.getElementById("xcbImportNotesCSV");
    if (importNotesCSVInput) {
      importNotesCSVInput.onchange = (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          var _a2;
          try {
            const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
            const lines = text.split("\n");
            if (lines.length < 2) {
              alert("CSV file appears to be empty");
              return;
            }
            let imported = 0;
            const notes = getNotes();
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              const fields = [];
              let field = "";
              let inQuotes = false;
              for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                  if (inQuotes && line[j + 1] === '"') {
                    field += '"';
                    j++;
                  } else {
                    inQuotes = !inQuotes;
                  }
                } else if (char === "," && !inQuotes) {
                  fields.push(field);
                  field = "";
                } else {
                  field += char;
                }
              }
              fields.push(field);
              if (fields.length >= 5) {
                const username = fields[0] || "Unknown";
                const dateStr = fields[1];
                const status = fields[2];
                const tagsStr = fields[3];
                const commentText = fields[4];
                const noteText = fields[5] || "";
                const sourceUrl = fields[6] || "";
                const newNote = {
                  id: "note-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
                  username,
                  commentText,
                  note: noteText,
                  tags: tagsStr ? tagsStr.split(";").map((t) => t.trim()).filter((t) => t) : [],
                  date: dateStr ? new Date(dateStr).getTime() : Date.now(),
                  sourceUrl,
                  archived: status.toLowerCase().includes("archived")
                };
                notes.push(newNote);
                imported++;
              }
            }
            saveNotes(notes);
            alert("Imported " + imported + " notes!");
            refreshPanel("notes");
          } catch (err) {
            console.error("Import error:", err);
            alert("Error importing CSV: " + err.message);
          }
        };
        reader.readAsText(file);
        target.value = "";
      };
    }
    const addNoteManualBtn = document.getElementById("xcbAddNoteManual");
    if (addNoteManualBtn) {
      addNoteManualBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = addNoteManualBtn.getBoundingClientRect();
        const popupX = Math.min(rect.left, window.innerWidth - 420);
        const popupY = Math.min(rect.bottom + 5, window.innerHeight - 400);
        showNotePopup(
          Math.max(10, popupX),
          Math.max(10, popupY),
          "",
          "",
          window.location.href
        );
      };
    }
    panel.querySelectorAll(".xcb-note-action").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!id) return;
        const note = getNotes().find((n) => n.id === id);
        if (action === "delete") {
          if (confirm("Move this note to trash? You can restore it within 14 days.")) {
            deleteNote(id);
            refreshPanel("notes");
          }
        } else if (action === "archive") {
          archiveNote(id);
          refreshPanel("notes");
        } else if (action === "unarchive") {
          unarchiveNote(id);
          refreshPanel("notes");
        } else if (action === "edit" && note) {
          showNoteEditPopup(id);
        } else if (action === "move" && note) {
          showNoteSectionPicker(btn, id);
        }
      };
    });
    const toggleSectionViewBtn = document.getElementById("xcbToggleSectionView");
    if (toggleSectionViewBtn) {
      toggleSectionViewBtn.onclick = () => {
        const s = getSettings();
        s.noteSectionViewEnabled = !s.noteSectionViewEnabled;
        saveSettings(s);
        refreshPanel("notes");
      };
    }
    const addSectionBtn = document.getElementById("xcbAddNoteSection");
    if (addSectionBtn) {
      addSectionBtn.onclick = () => {
        showSectionEditPopup(null, null);
      };
    }
    const manageSectionsBtn = document.getElementById("xcbManageNoteSections");
    if (manageSectionsBtn) {
      manageSectionsBtn.onclick = () => {
        const container = document.getElementById("xcbSectionTreeContainer");
        if (container) {
          container.style.display = container.style.display === "none" ? "block" : "none";
        }
      };
    }
    panel.querySelectorAll(".xcb-section-add-child").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const parentId = btn.dataset.parentId || null;
        showSectionEditPopup(null, parentId);
      };
    });
    panel.querySelectorAll(".xcb-section-edit").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sectionId = btn.dataset.sectionId || null;
        showSectionEditPopup(sectionId, null);
      };
    });
    panel.querySelectorAll(".xcb-section-delete").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sectionId = btn.dataset.sectionId;
        if (!sectionId) return;
        const sections = getNoteSections();
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;
        const hasChildren = sections.some((s) => s.parentId === sectionId);
        const message = hasChildren ? `Delete section "${section.name}" and all its sub-sections? Notes will be moved to unsectioned.` : `Delete section "${section.name}"? Notes will be moved to unsectioned.`;
        if (confirm(message)) {
          deleteNoteSection(sectionId, true);
          refreshPanel("notes");
        }
      };
    });
    panel.querySelectorAll(".xcb-section-filter-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const filterValue = btn.dataset.sectionFilter;
        if (filterValue === "") {
          currentNoteSectionFilter = null;
        } else if (filterValue === "unsectioned") {
          currentNoteSectionFilter = "unsectioned";
        }
        refreshPanel("notes");
      };
    });
    const clearSectionFilterBtn = document.getElementById("xcbClearSectionFilter");
    if (clearSectionFilterBtn) {
      clearSectionFilterBtn.onclick = () => {
        currentNoteSectionFilter = null;
        refreshPanel("notes");
      };
    }
    panel.querySelectorAll(".xcb-section-tree-item").forEach((item) => {
      item.onclick = (e) => {
        if (e.target.closest("button") || e.target.closest(".xcb-section-collapse-toggle"))
          return;
        const sectionId = item.dataset.sectionId;
        if (currentNoteSectionFilter === sectionId) {
          currentNoteSectionFilter = null;
        } else {
          currentNoteSectionFilter = sectionId || null;
        }
        refreshPanel("notes");
      };
    });
    panel.querySelectorAll(".xcb-section-collapse-toggle").forEach((toggle) => {
      toggle.onclick = (e) => {
        e.stopPropagation();
        const sectionId = toggle.dataset.sectionId;
        if (!sectionId) return;
        const section = getNoteSections().find((s) => s.id === sectionId);
        if (section) {
          updateNoteSection(sectionId, { collapsed: !section.collapsed });
          refreshPanel("notes");
        }
      };
    });
    panel.querySelectorAll(".xcb-deleted-note-action").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!id) return;
        if (action === "restore") {
          restoreNoteFromTrash(id);
          refreshPanel("notes");
        } else if (action === "permanent-delete") {
          if (confirm("Permanently delete this note? This cannot be undone.")) {
            permanentlyDeleteNote(id);
            refreshPanel("notes");
          }
        }
      };
    });
    const updateDeletedNotesBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-deleted-note-select:checked").length;
      const countEl = panel.querySelector("#xcbDeletedNotesSelectedCount");
      const restoreBtn = panel.querySelector("#xcbBulkRestoreNotes");
      const deleteBtn = panel.querySelector("#xcbBulkPermanentDeleteNotes");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      if (restoreBtn) restoreBtn.style.display = selectedCount > 0 ? "" : "none";
      if (deleteBtn) deleteBtn.style.display = selectedCount > 0 ? "" : "none";
    };
    const selectAllDeletedNotesCheckbox = panel.querySelector("#xcbSelectAllDeletedNotes");
    if (selectAllDeletedNotesCheckbox) {
      selectAllDeletedNotesCheckbox.onchange = () => {
        const isChecked = selectAllDeletedNotesCheckbox.checked;
        panel.querySelectorAll(".xcb-deleted-note-select").forEach((cb) => {
          cb.checked = isChecked;
        });
        updateDeletedNotesBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-deleted-note-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateDeletedNotesBulkUI();
        const allCheckboxes = panel.querySelectorAll(".xcb-deleted-note-select");
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        if (selectAllDeletedNotesCheckbox) selectAllDeletedNotesCheckbox.checked = allChecked && allCheckboxes.length > 0;
      };
    });
    const bulkRestoreNotesBtn = panel.querySelector("#xcbBulkRestoreNotes");
    if (bulkRestoreNotesBtn) {
      bulkRestoreNotesBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-deleted-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Restore ${selectedIds.length} note(s)?`)) {
          selectedIds.forEach((id) => restoreNoteFromTrash(id));
          refreshPanel("notes");
        }
      };
    }
    const bulkPermanentDeleteNotesBtn = panel.querySelector("#xcbBulkPermanentDeleteNotes");
    if (bulkPermanentDeleteNotesBtn) {
      bulkPermanentDeleteNotesBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-deleted-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Permanently delete ${selectedIds.length} note(s)? This cannot be undone.`)) {
          selectedIds.forEach((id) => permanentlyDeleteNote(id));
          refreshPanel("notes");
        }
      };
    }
    panel.querySelectorAll(".xcb-note-add-subtask").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const noteId = btn.dataset.noteId;
        if (noteId) {
          showNoteSubtaskPopup(noteId, [], btn);
        }
      };
    });
    panel.querySelectorAll(".xcb-note-subtask-check").forEach((checkbox) => {
      checkbox.onchange = (e) => {
        e.stopPropagation();
        const subtaskDiv = checkbox.closest(".xcb-note-subtask");
        if (!subtaskDiv) return;
        const noteId = subtaskDiv.dataset.noteId;
        const pathStr = subtaskDiv.dataset.path;
        if (!noteId || !pathStr) return;
        const path = pathStr.split(",");
        updateNoteSubtask(noteId, path, { completed: checkbox.checked });
        refreshPanel("notes");
      };
    });
    panel.querySelectorAll(".xcb-note-subtask-delete").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const subtaskDiv = btn.closest(".xcb-note-subtask");
        if (!subtaskDiv) return;
        const noteId = subtaskDiv.dataset.noteId;
        const pathStr = subtaskDiv.dataset.path;
        if (!noteId || !pathStr) return;
        const path = pathStr.split(",");
        if (confirm("Delete this subtask?")) {
          deleteNoteSubtask(noteId, path);
          refreshPanel("notes");
        }
      };
    });
    panel.querySelectorAll(".xcb-note-subtask-edit").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const subtaskDiv = btn.closest(".xcb-note-subtask");
        if (!subtaskDiv) return;
        const noteId = subtaskDiv.dataset.noteId;
        const pathStr = subtaskDiv.dataset.path;
        if (!noteId || !pathStr) return;
        const path = pathStr.split(",");
        const textSpan = subtaskDiv.querySelector(".xcb-note-subtask-text");
        const currentText = (textSpan == null ? void 0 : textSpan.textContent) || "";
        const editPopup = document.createElement("div");
        editPopup.className = "xcb-subtask-edit-popup";
        editPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--xcb-panel-bg, #1a1a2e);
        border: 2px solid var(--xcb-primary, #3b82f6);
        border-radius: 12px;
        padding: 20px;
        z-index: 100002;
        min-width: 380px;
        max-width: 500px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      `;
        editPopup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: var(--xcb-primary, #3b82f6); font-size: 16px;"><i class="ph-bold ph-pencil-simple"></i> Edit Sub-task</h3>
          <button id="xcbSubtaskEditClose" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
        </div>
        <div style="margin-bottom: 15px;">
          <input type="text" id="xcbSubtaskEditInput" value="${currentText.replace(/"/g, "&quot;")}" style="
            width: 100%;
            padding: 12px;
            background: var(--xcb-section-bg, #2a2a3e);
            border: 1px solid #444;
            color: var(--xcb-panel-text, #fff);
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          " autofocus>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="xcbSubtaskEditCancel" class="xcb-cancel-btn">Cancel</button>
          <button id="xcbSubtaskEditSave" style="background: var(--xcb-primary, #3b82f6); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">Save</button>
        </div>
      `;
        document.body.appendChild(editPopup);
        const input = editPopup.querySelector("#xcbSubtaskEditInput");
        setTimeout(() => input.focus(), 50);
        input.select();
        const closePopup = () => editPopup.remove();
        editPopup.querySelector("#xcbSubtaskEditClose").onclick = closePopup;
        editPopup.querySelector("#xcbSubtaskEditCancel").onclick = closePopup;
        editPopup.querySelector("#xcbSubtaskEditSave").onclick = () => {
          const newText = input.value.trim();
          if (newText && newText !== currentText) {
            updateNoteSubtask(noteId, path, { text: newText });
            refreshPanel("notes");
          }
          closePopup();
        };
        input.onkeydown = (evt) => {
          if (evt.key === "Enter") {
            evt.preventDefault();
            editPopup.querySelector("#xcbSubtaskEditSave").click();
          } else if (evt.key === "Escape") {
            closePopup();
          }
        };
        editPopup.onclick = (evt) => evt.stopPropagation();
      };
    });
    panel.querySelectorAll(".xcb-note-subtask-add").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const subtaskDiv = btn.closest(".xcb-note-subtask");
        if (!subtaskDiv) return;
        const noteId = subtaskDiv.dataset.noteId;
        const pathStr = subtaskDiv.dataset.path;
        if (!noteId || !pathStr) return;
        const parentPath = pathStr.split(",");
        showNoteSubtaskPopup(noteId, parentPath, btn);
      };
    });
    let draggedNoteSubtask = null;
    panel.querySelectorAll(".xcb-note-subtask").forEach((item) => {
      item.addEventListener("dragstart", (e) => {
        draggedNoteSubtask = item;
        item.style.opacity = "0.5";
        e.dataTransfer.effectAllowed = "move";
        e.stopPropagation();
      });
      item.addEventListener("dragend", () => {
        item.style.opacity = "";
        panel.querySelectorAll(".xcb-note-subtask").forEach((el) => {
          el.style.borderTop = "";
        });
        draggedNoteSubtask = null;
      });
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedNoteSubtask && draggedNoteSubtask !== item) {
          const draggedLevel = draggedNoteSubtask.dataset.level;
          const targetLevel = item.dataset.level;
          const draggedNoteId = draggedNoteSubtask.dataset.noteId;
          const targetNoteId = item.dataset.noteId;
          const draggedPath = (draggedNoteSubtask.dataset.path || "").split(",");
          const targetPath = (item.dataset.path || "").split(",");
          const draggedParentPath = draggedPath.slice(0, -1).join(",");
          const targetParentPath = targetPath.slice(0, -1).join(",");
          if (draggedLevel === targetLevel && draggedNoteId === targetNoteId && draggedParentPath === targetParentPath) {
            item.style.borderTop = "2px solid #8b5cf6";
          }
        }
      });
      item.addEventListener("dragleave", () => {
        item.style.borderTop = "";
      });
      item.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.style.borderTop = "";
        if (draggedNoteSubtask && draggedNoteSubtask !== item) {
          const draggedLevel = draggedNoteSubtask.dataset.level;
          const targetLevel = item.dataset.level;
          const noteId = draggedNoteSubtask.dataset.noteId;
          const targetNoteId = item.dataset.noteId;
          const draggedPath = (draggedNoteSubtask.dataset.path || "").split(",");
          const targetPath = (item.dataset.path || "").split(",");
          const draggedParentPath = draggedPath.slice(0, -1);
          const targetParentPath = targetPath.slice(0, -1);
          if (draggedLevel === targetLevel && noteId === targetNoteId && draggedParentPath.join(",") === targetParentPath.join(",")) {
            const parentPathStr = draggedParentPath.join(",");
            const siblings = Array.from(panel.querySelectorAll(".xcb-note-subtask")).filter((el) => {
              const elPath = (el.dataset.path || "").split(",");
              const elParentPath = elPath.slice(0, -1).join(",");
              return el.dataset.noteId === noteId && el.dataset.level === draggedLevel && elParentPath === parentPathStr;
            });
            const draggedIdx = siblings.indexOf(draggedNoteSubtask);
            const targetIdx = siblings.indexOf(item);
            if (draggedIdx < targetIdx) {
              item.after(draggedNoteSubtask);
            } else {
              item.before(draggedNoteSubtask);
            }
            const updatedSiblings = Array.from(panel.querySelectorAll(".xcb-note-subtask")).filter((el) => {
              const elPath = (el.dataset.path || "").split(",");
              const elParentPath = elPath.slice(0, -1).join(",");
              return el.dataset.noteId === noteId && el.dataset.level === draggedLevel && elParentPath === parentPathStr;
            });
            const newOrder = updatedSiblings.map((el) => {
              const path = (el.dataset.path || "").split(",");
              return path[path.length - 1];
            });
            if (noteId) {
              reorderNoteSubtasks(noteId, newOrder, draggedParentPath);
            }
          }
        }
      });
    });
    let activeNoteFilters = [];
    panel.querySelectorAll(".xcb-note-filter-tag").forEach((btn) => {
      btn.onclick = () => {
        const tag = btn.dataset.tag;
        if (!tag) return;
        btn.classList.toggle("active");
        if (btn.classList.contains("active")) {
          activeNoteFilters.push(tag);
        } else {
          activeNoteFilters = activeNoteFilters.filter((t) => t !== tag);
        }
        const clearBtn = document.getElementById("xcbClearNoteFilters");
        if (clearBtn)
          clearBtn.style.display = activeNoteFilters.length > 0 ? "inline-block" : "none";
        panel.querySelectorAll(".xcb-note-card").forEach((card) => {
          const noteId = card.dataset.id;
          const status = card.dataset.status;
          const note = getNotes().find((n) => n.id === noteId);
          const noteTags = note ? note.tags || [] : [];
          const matchesStatus = currentNoteStatusFilter === "all" || status === currentNoteStatusFilter;
          if (!matchesStatus) {
            card.style.display = "none";
            return;
          }
          if (activeNoteFilters.length === 0) {
            card.style.display = "";
          } else {
            const hasAllTags = activeNoteFilters.every(
              (f) => noteTags.includes(f)
            );
            card.style.display = hasAllTags ? "" : "none";
          }
        });
      };
    });
    const clearNoteFiltersBtn = document.getElementById("xcbClearNoteFilters");
    if (clearNoteFiltersBtn) {
      clearNoteFiltersBtn.onclick = () => {
        activeNoteFilters = [];
        clearNoteFiltersBtn.style.display = "none";
        panel.querySelectorAll(".xcb-note-filter-tag").forEach((btn) => {
          btn.classList.remove("active");
        });
        panel.querySelectorAll(".xcb-note-card").forEach((card) => {
          const status = card.dataset.status;
          const matchesStatus = currentNoteStatusFilter === "all" || status === currentNoteStatusFilter;
          card.style.display = matchesStatus ? "" : "none";
        });
      };
    }
    const updateNotesBulkUI = () => {
      const selectedCount = panel.querySelectorAll(".xcb-note-select:checked").length;
      const countEl = panel.querySelector("#xcbNotesSelectedCount");
      const archiveBtn = panel.querySelector("#xcbBulkArchiveNotes");
      const unarchiveBtn = panel.querySelector("#xcbBulkUnarchiveNotes");
      const deleteBtn = panel.querySelector("#xcbBulkDeleteNotes");
      const moveToSectionBtn = panel.querySelector("#xcbBulkMoveToSection");
      if (countEl) countEl.textContent = `(${selectedCount} selected)`;
      const hasSelection = selectedCount > 0;
      if (deleteBtn) deleteBtn.style.display = hasSelection ? "" : "none";
      if (moveToSectionBtn) moveToSectionBtn.style.display = hasSelection ? "" : "none";
      const isArchivedView = currentNoteStatusFilter === "archived";
      if (archiveBtn) archiveBtn.style.display = hasSelection && !isArchivedView ? "" : "none";
      if (unarchiveBtn) unarchiveBtn.style.display = hasSelection && isArchivedView ? "" : "none";
    };
    const selectAllNotesCheckbox = panel.querySelector("#xcbSelectAllNotes");
    if (selectAllNotesCheckbox) {
      selectAllNotesCheckbox.onchange = () => {
        const isChecked = selectAllNotesCheckbox.checked;
        panel.querySelectorAll(".xcb-note-select").forEach((cb) => {
          const card = cb.closest(".xcb-note-card");
          if (card && card.style.display !== "none") {
            cb.checked = isChecked;
          }
        });
        updateNotesBulkUI();
      };
    }
    panel.querySelectorAll(".xcb-note-select").forEach((checkbox) => {
      checkbox.onchange = () => {
        updateNotesBulkUI();
        const visibleCheckboxes = Array.from(panel.querySelectorAll(".xcb-note-select")).filter((cb) => {
          const card = cb.closest(".xcb-note-card");
          return card && card.style.display !== "none";
        });
        const allChecked = visibleCheckboxes.every((cb) => cb.checked);
        if (selectAllNotesCheckbox) selectAllNotesCheckbox.checked = allChecked && visibleCheckboxes.length > 0;
      };
    });
    const bulkArchiveNotesBtn = panel.querySelector("#xcbBulkArchiveNotes");
    if (bulkArchiveNotesBtn) {
      bulkArchiveNotesBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Archive ${selectedIds.length} note(s)?`)) {
          selectedIds.forEach((id) => archiveNote(id));
          refreshPanel("notes");
        }
      };
    }
    const bulkDeleteNotesBtn = panel.querySelector("#xcbBulkDeleteNotes");
    if (bulkDeleteNotesBtn) {
      bulkDeleteNotesBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} note(s)?`)) {
          selectedIds.forEach((id) => deleteNote(id));
          refreshPanel("notes");
        }
      };
    }
    const bulkUnarchiveNotesBtn = panel.querySelector("#xcbBulkUnarchiveNotes");
    if (bulkUnarchiveNotesBtn) {
      bulkUnarchiveNotesBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        if (confirm(`Return ${selectedIds.length} note(s) to pending?`)) {
          selectedIds.forEach((id) => unarchiveNote(id));
          refreshPanel("notes");
        }
      };
    }
    const bulkMoveToSectionBtn = panel.querySelector("#xcbBulkMoveToSection");
    if (bulkMoveToSectionBtn) {
      bulkMoveToSectionBtn.onclick = () => {
        const selectedIds = Array.from(panel.querySelectorAll(".xcb-note-select:checked")).map((cb) => cb.dataset.id).filter(Boolean);
        if (selectedIds.length === 0) return;
        const sections = getNoteSections();
        if (sections.length === 0) {
          alert("No sections available. Create a section first in the Sections panel.");
          return;
        }
        const popup = document.createElement("div");
        popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--xcb-panel-bg, #1a1a2e);
        border: 2px solid #8b5cf6;
        border-radius: 12px;
        padding: 20px;
        z-index: 100002;
        min-width: 300px;
        max-width: 400px;
        max-height: 500px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      `;
        const buildSectionOptions = (parentId = null, depth = 0) => {
          return sections.filter((s) => s.parentId === parentId).sort((a, b) => a.order - b.order).map((section) => {
            const prefix = getSectionPrefix(section.level, section.order);
            const indent = depth * 16;
            return `
              <div class="xcb-bulk-section-option" data-section-id="${section.id}" style="
                padding: 8px 12px;
                margin-left: ${indent}px;
                cursor: pointer;
                border-radius: 4px;
                border-left: 3px solid ${section.color};
                margin-bottom: 4px;
                background: #2a2a3e;
              " onmouseover="this.style.background='${section.color}30'" onmouseout="this.style.background='#2a2a3e'">
                <span style="color: ${section.color}; font-weight: bold;">${prefix}</span>
                <span style="color: #e0e0e0;">${section.name}</span>
              </div>
              ${buildSectionOptions(section.id, depth + 1)}
            `;
          }).join("");
        };
        popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #8b5cf6; font-size: 16px;"><i class="ph-bold ph-folder"></i> Move ${selectedIds.length} Note(s) to Section</h3>
          <button class="xcb-bulk-section-close" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 20px; padding: 0;">&times;</button>
        </div>
        <div style="max-height: 350px; overflow-y: auto; margin-bottom: 15px;">
          <div class="xcb-bulk-section-option" data-section-id="" style="
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            border-left: 3px solid #666;
            margin-bottom: 8px;
            background: #2a2a3e;
          " onmouseover="this.style.background='#66666630'" onmouseout="this.style.background='#2a2a3e'">
            <span style="color: #888;"><i class="ph-bold ph-file"></i> Remove from section (Unsectioned)</span>
          </div>
          ${buildSectionOptions()}
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <button class="xcb-bulk-section-cancel xcb-cancel-btn">Cancel</button>
        </div>
      `;
        document.body.appendChild(popup);
        const closePopup = () => popup.remove();
        popup.querySelector(".xcb-bulk-section-close").onclick = closePopup;
        popup.querySelector(".xcb-bulk-section-cancel").onclick = closePopup;
        popup.querySelectorAll(".xcb-bulk-section-option").forEach((opt) => {
          opt.onclick = () => {
            const sectionId = opt.dataset.sectionId || null;
            selectedIds.forEach((id) => moveNoteToSection(id, sectionId));
            closePopup();
            refreshPanel("notes");
          };
        });
      };
    }
  }
  const DEFAULT_CUSTOM = {
    colors: {
      panelBg: "#1a1a2e",
      panelText: "#e0e0e0",
      panelBorder: "#3a3a4e",
      inputBg: "#2a2a3e",
      inputBorder: "#4a4a5e",
      inputText: "#e0e0e0",
      buttonPrimary: "var(--xcb-primary)",
      buttonPrimaryText: "#ffffff",
      buttonDanger: "#ef4444",
      buttonDangerText: "#ffffff",
      buttonReply: "#3b82f6",
      buttonReplyText: "#ffffff",
      buttonRequest: "#14b8a6",
      buttonRequestText: "#ffffff",
      buttonNote: "#8b5cf6",
      buttonNoteText: "#ffffff",
      badgeSpammer: "#dc2626",
      badgeRude: "#be185d",
      badgeBeggar: "#ea580c",
      badgeOfftopic: "#0891b2",
      badgeTroll: "#65a30d",
      badgeAnnoying: "#854d0e",
      badgeUploader: "#22c55e",
      badgeHelpful: "#06b6d4",
      badgeModerator: "#eab308",
      badgeRequester: "#f97316",
      badgeFriend: "#ec4899",
      badgeSeeding: "#b91c1c",
      badgeThankful: "#10b981",
      badgeUnwanted: "#7c3aed",
      trustedUsernameColor: "#4ade80",
      blockedUsernameColor: "#ff6b6b"
    }
  };
  function deriveActionButtonColors(preset) {
    return {
      buttonReply: preset.buttonReply || preset.buttonPrimary || DEFAULT_CUSTOM.colors.buttonReply,
      buttonReplyText: preset.buttonReplyText || DEFAULT_CUSTOM.colors.buttonReplyText,
      buttonRequest: preset.buttonRequest || DEFAULT_CUSTOM.colors.buttonRequest,
      buttonRequestText: preset.buttonRequestText || DEFAULT_CUSTOM.colors.buttonRequestText,
      buttonNote: preset.buttonNote || DEFAULT_CUSTOM.colors.buttonNote,
      buttonNoteText: preset.buttonNoteText || DEFAULT_CUSTOM.colors.buttonNoteText
    };
  }
  function setupSettingsHandlers(context) {
    const {
      panel,
      refreshPanel,
      closePanel,
      showPanel,
      formatDateTime: formatDateTime2,
      getContrastColor: getContrastColor2,
      restoreFromBackupHistoryFn: restoreFromBackupHistoryFn2,
      applyCustomStylesFn: applyCustomStylesFn2,
      exportDataFn: exportDataFn2,
      importBackupFn: importBackupFn2
    } = context;
    const formatDate = (timestamp, includeTime = true, forceUTC = false) => {
      if (formatDateTime2) {
        return formatDateTime2(timestamp, includeTime, forceUTC);
      }
      return new Date(timestamp).toLocaleString();
    };
    const getContrast = (color) => {
      if (getContrastColor2) {
        return getContrastColor2(color);
      }
      return "#ffffff";
    };
    const hideEntireCheckbox = document.getElementById("xcbHideEntire");
    if (hideEntireCheckbox) {
      hideEntireCheckbox.onchange = (e) => {
        const s = getSettings();
        s.hideEntireComment = e.target.checked;
        saveSettings(s);
      };
    }
    const keyboardShortcutsCheckbox = document.getElementById("xcbKeyboardShortcuts");
    if (keyboardShortcutsCheckbox) {
      keyboardShortcutsCheckbox.onchange = (e) => {
        const s = getSettings();
        s.keyboardShortcuts = e.target.checked;
        saveSettings(s);
        alert(
          "Keyboard shortcuts " + (e.target.checked ? "enabled" : "disabled") + ". Refresh the page to apply changes."
        );
      };
    }
    const onlyMyUploadsCheckbox = document.getElementById("xcbOnlyMyUploads");
    if (onlyMyUploadsCheckbox) {
      onlyMyUploadsCheckbox.onchange = (e) => {
        const s = getSettings();
        s.onlyShowToolsOnMyUploads = e.target.checked;
        saveSettings(s);
        alert(
          "Tools will " + (e.target.checked ? "only show on your uploads" : "show on all pages") + ". Refresh the page to apply changes."
        );
      };
    }
    const requestsEnabledCheckbox = document.getElementById("xcbRequestsEnabled");
    if (requestsEnabledCheckbox) {
      requestsEnabledCheckbox.onchange = (e) => {
        const s = getSettings();
        s.requestsEnabled = e.target.checked;
        saveSettings(s);
        alert(
          "Requests feature " + (e.target.checked ? "enabled" : "disabled") + ". Your saved requests are preserved. Refresh the page to apply changes."
        );
      };
    }
    const requestsPausedSetting = document.getElementById("xcbRequestsPausedSetting");
    if (requestsPausedSetting) {
      requestsPausedSetting.onchange = (e) => {
        const s = getSettings();
        const isPaused = e.target.checked;
        s.requestsPaused = isPaused;
        saveSettings(s);
        document.querySelectorAll(".xcb-add-request-btn").forEach((btn) => {
          btn.style.display = isPaused ? "none" : "";
        });
        const requestsTabToggle = document.getElementById("xcbRequestsPaused");
        if (requestsTabToggle && requestsTabToggle !== requestsPausedSetting) {
          requestsTabToggle.checked = isPaused;
          const label = requestsTabToggle.closest("label");
          if (label) {
            const span = label.querySelector("span");
            if (span) {
              span.innerHTML = isPaused ? '<i class="ph-bold ph-pause"></i> Requests PAUSED' : '<i class="ph-bold ph-play"></i> Taking Requests';
            }
            label.style.background = isPaused ? "var(--xcb-accent-danger, #dc2626)" : "var(--xcb-primary, #6b5344)";
          }
        }
      };
    }
    const requestLimitSelect = document.getElementById("xcbRequestLimit");
    const requestLimitCustom = document.getElementById("xcbRequestLimitCustom");
    if (requestLimitSelect) {
      requestLimitSelect.onchange = (e) => {
        const target = e.target;
        if (target.value === "custom") {
          if (requestLimitCustom) {
            requestLimitCustom.style.display = "block";
            requestLimitCustom.focus();
          }
        } else {
          if (requestLimitCustom) requestLimitCustom.style.display = "none";
          const s = getSettings();
          s.requestLimitPerUser = parseInt(target.value);
          saveSettings(s);
        }
      };
    }
    if (requestLimitCustom) {
      requestLimitCustom.onchange = (e) => {
        const val = parseInt(e.target.value);
        if (val > 0) {
          const s = getSettings();
          s.requestLimitPerUser = val;
          saveSettings(s);
        }
      };
    }
    const totalRequestLimitSelect = document.getElementById("xcbTotalRequestLimit");
    const totalRequestLimitCustom = document.getElementById("xcbTotalRequestLimitCustom");
    if (totalRequestLimitSelect) {
      totalRequestLimitSelect.onchange = (e) => {
        const target = e.target;
        if (target.value === "custom") {
          if (totalRequestLimitCustom) {
            totalRequestLimitCustom.style.display = "block";
            totalRequestLimitCustom.focus();
          }
        } else {
          if (totalRequestLimitCustom) totalRequestLimitCustom.style.display = "none";
          const s = getSettings();
          s.totalRequestsLimit = parseInt(target.value);
          saveSettings(s);
        }
      };
    }
    if (totalRequestLimitCustom) {
      totalRequestLimitCustom.onchange = (e) => {
        const val = parseInt(e.target.value);
        if (val > 0) {
          const s = getSettings();
          s.totalRequestsLimit = val;
          saveSettings(s);
        }
      };
    }
    const firstTimerEnabled = document.getElementById("xcbFirstTimerEnabled");
    if (firstTimerEnabled) {
      firstTimerEnabled.onchange = (e) => {
        const s = getSettings();
        s.firstTimerTrackingEnabled = e.target.checked;
        saveSettings(s);
        alert(
          "First-timer tracking " + (e.target.checked ? "enabled" : "disabled") + ". Refresh the page to apply changes."
        );
      };
    }
    const showHelpByDefault = document.getElementById("xcbShowHelpByDefault");
    if (showHelpByDefault) {
      showHelpByDefault.onchange = (e) => {
        const s = getSettings();
        s.showHelpByDefault = e.target.checked;
        saveSettings(s);
      };
    }
    const restartTourBtn = document.getElementById("xcbRestartTour");
    if (restartTourBtn) {
      restartTourBtn.onclick = () => {
        const s = getSettings();
        s.guidedTourCompleted = false;
        s.wantsGuidedTour = true;
        saveSettings(s);
        closePanel();
        startGuidedTour();
      };
    }
    const panelSizeSelect = document.getElementById("xcbPanelSize");
    if (panelSizeSelect) {
      panelSizeSelect.onchange = (e) => {
        const s = getSettings();
        const newSize = e.target.value;
        s.panelSize = newSize;
        if (newSize !== "custom") {
          panel.style.width = "";
          panel.style.height = "";
          s.panelCustomWidth = null;
          s.panelCustomHeight = null;
          panel.querySelectorAll("ul").forEach((ul) => {
            ul.style.maxHeight = "";
          });
        } else if (s.panelCustomWidth && s.panelCustomHeight) {
          panel.style.width = s.panelCustomWidth + "px";
          panel.style.height = s.panelCustomHeight + "px";
          const listHeight = Math.max(100, s.panelCustomHeight - 250) + "px";
          panel.querySelectorAll("ul").forEach((ul) => {
            ul.style.maxHeight = listHeight;
          });
        }
        saveSettings(s);
        panel.className = `xcb-panel xcb-panel-${newSize} ${getThemeClassName(s)}`;
      };
    }
    const buttonPositionSelect = document.getElementById("xcbButtonPosition");
    if (buttonPositionSelect) {
      buttonPositionSelect.onchange = (e) => {
        const s = getSettings();
        const newPosition = e.target.value;
        s.buttonPosition = newPosition;
        saveSettings(s);
        const floatBtn = document.querySelector(".xcb-float-btn");
        if (floatBtn) {
          floatBtn.className = "xcb-float-btn xcb-pos-" + newPosition;
        }
        const quickNav = document.getElementById("xcbQuickNav");
        if (quickNav) {
          quickNav.className = quickNav.className.replace(/xcb-pos-\S+/, "xcb-pos-" + newPosition);
        }
        const quickNavToggle = document.getElementById("xcbQuickNavToggle");
        if (quickNavToggle) {
          quickNavToggle.className = quickNavToggle.className.replace(/xcb-pos-\S+/, "xcb-pos-" + newPosition);
        }
      };
    }
    const dateFormatSelect = document.getElementById("xcbDateFormat");
    if (dateFormatSelect) {
      dateFormatSelect.onchange = (e) => {
        const s = getSettings();
        s.dateFormat = e.target.value;
        saveSettings(s);
        refreshPanel("settings");
      };
    }
    const timeFormatSelect = document.getElementById("xcbTimeFormat");
    if (timeFormatSelect) {
      timeFormatSelect.onchange = (e) => {
        const s = getSettings();
        s.timeFormat = e.target.value;
        saveSettings(s);
        refreshPanel("settings");
      };
    }
    const saveDisplayOptionsBtn = document.getElementById("xcbSaveDisplayOptions");
    if (saveDisplayOptionsBtn) {
      saveDisplayOptionsBtn.onclick = () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const s = getSettings();
        s.hideEntireComment = ((_a = document.getElementById("xcbHideEntire")) == null ? void 0 : _a.checked) || false;
        s.keyboardShortcuts = ((_b = document.getElementById("xcbKeyboardShortcuts")) == null ? void 0 : _b.checked) || false;
        s.onlyShowToolsOnMyUploads = ((_c = document.getElementById("xcbOnlyMyUploads")) == null ? void 0 : _c.checked) || false;
        s.panelSize = ((_d = document.getElementById("xcbPanelSize")) == null ? void 0 : _d.value) || "medium";
        s.buttonPosition = ((_e = document.getElementById("xcbButtonPosition")) == null ? void 0 : _e.value) || "bottom-right";
        s.dateFormat = ((_f = document.getElementById("xcbDateFormat")) == null ? void 0 : _f.value) || "MDY";
        s.timeFormat = ((_g = document.getElementById("xcbTimeFormat")) == null ? void 0 : _g.value) || "12h";
        saveSettings(s);
        saveDisplayOptionsBtn.textContent = "Saved!";
        saveDisplayOptionsBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveDisplayOptionsBtn.textContent = "Save Display Options";
          saveDisplayOptionsBtn.style.background = "var(--xcb-primary)";
        }, 1500);
      };
    }
    const saveRequestSettingsBtn = document.getElementById("xcbSaveRequestSettings");
    if (saveRequestSettingsBtn) {
      saveRequestSettingsBtn.onclick = () => {
        var _a, _b;
        const s = getSettings();
        s.requestsEnabled = ((_a = document.getElementById("xcbRequestsEnabled")) == null ? void 0 : _a.checked) || false;
        const pausedCheckbox = document.getElementById("xcbRequestsPausedSetting");
        if (pausedCheckbox) s.requestsPaused = pausedCheckbox.checked;
        const limitSelect = document.getElementById("xcbRequestLimit");
        const limitCustom = document.getElementById("xcbRequestLimitCustom");
        if (limitSelect) {
          if (limitSelect.value === "custom" && limitCustom) {
            s.requestLimitPerUser = parseInt(limitCustom.value) || 0;
          } else {
            s.requestLimitPerUser = parseInt(limitSelect.value);
          }
        }
        const totalLimitSelect = document.getElementById("xcbTotalRequestLimit");
        const totalLimitCustom = document.getElementById("xcbTotalRequestLimitCustom");
        if (totalLimitSelect) {
          if (totalLimitSelect.value === "custom" && totalLimitCustom) {
            s.totalRequestsLimit = parseInt(totalLimitCustom.value) || 0;
          } else {
            s.totalRequestsLimit = parseInt(totalLimitSelect.value);
          }
        }
        const requestCountModeSelect = document.getElementById("xcbRequestCountMode");
        if (requestCountModeSelect) {
          s.requestCountMode = requestCountModeSelect.value;
        }
        saveSettings(s);
        (_b = window.updateQuickNavRequestsState) == null ? void 0 : _b.call(window);
        saveRequestSettingsBtn.textContent = "Saved!";
        saveRequestSettingsBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveRequestSettingsBtn.textContent = "Save Request Settings";
          saveRequestSettingsBtn.style.background = "#f59e0b";
        }, 1500);
      };
    }
    const saveNotesSettingsBtn = document.getElementById("xcbSaveNotesSettings");
    if (saveNotesSettingsBtn) {
      saveNotesSettingsBtn.onclick = () => {
        var _a;
        const s = getSettings();
        s.notesEnabled = ((_a = document.getElementById("xcbNotesEnabled")) == null ? void 0 : _a.checked) || false;
        saveSettings(s);
        saveNotesSettingsBtn.textContent = "Saved!";
        saveNotesSettingsBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveNotesSettingsBtn.textContent = "Save Notes Settings";
          saveNotesSettingsBtn.style.background = "#8b5cf6";
        }, 1500);
        alert(
          "Notes feature " + (s.notesEnabled ? "enabled" : "disabled") + ". Your saved notes are preserved. Refresh the page to apply changes."
        );
      };
    }
    const saveFirstTimerBtn = document.getElementById("xcbSaveFirstTimer");
    if (saveFirstTimerBtn) {
      saveFirstTimerBtn.onclick = () => {
        var _a;
        const s = getSettings();
        s.firstTimerTrackingEnabled = ((_a = document.getElementById("xcbFirstTimerEnabled")) == null ? void 0 : _a.checked) || false;
        saveSettings(s);
        saveFirstTimerBtn.textContent = "Saved!";
        saveFirstTimerBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveFirstTimerBtn.textContent = "Save First-timer Settings";
          saveFirstTimerBtn.style.background = "#f59e0b";
        }, 1500);
      };
    }
    const saveHelpSettingsBtn = document.getElementById("xcbSaveHelpSettings");
    if (saveHelpSettingsBtn) {
      saveHelpSettingsBtn.onclick = () => {
        var _a;
        const s = getSettings();
        s.showHelpByDefault = ((_a = document.getElementById("xcbShowHelpByDefault")) == null ? void 0 : _a.checked) || false;
        saveSettings(s);
        saveHelpSettingsBtn.textContent = "Saved!";
        saveHelpSettingsBtn.style.background = "#16a34a";
        setTimeout(() => {
          saveHelpSettingsBtn.textContent = "Save Help Settings";
          saveHelpSettingsBtn.style.background = "#22c55e";
        }, 1500);
      };
    }
    const saveBackupSettingsBtn = document.getElementById("xcbSaveBackupSettings");
    if (saveBackupSettingsBtn) {
      saveBackupSettingsBtn.onclick = () => {
        var _a, _b, _c, _d, _e;
        const s = getSettings();
        s.autoBackupEnabled = ((_a = document.getElementById("xcbAutoBackupEnabled")) == null ? void 0 : _a.checked) || false;
        s.autoBackupInterval = ((_b = document.getElementById("xcbAutoBackupInterval")) == null ? void 0 : _b.value) || "weekly";
        s.backupShowSaveAs = ((_c = document.getElementById("xcbBackupShowSaveAs")) == null ? void 0 : _c.checked) || false;
        s.backupFilenamePrefix = ((_e = (_d = document.getElementById("xcbBackupFilenamePrefix")) == null ? void 0 : _d.value) == null ? void 0 : _e.trim()) || "mankey-bot-backup";
        saveSettings(s);
        saveBackupSettingsBtn.textContent = "Saved!";
        saveBackupSettingsBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveBackupSettingsBtn.textContent = "Save Backup Settings";
          saveBackupSettingsBtn.style.background = "#8b5cf6";
        }, 1500);
      };
    }
    setupQuickReplyHandlers();
    panel.querySelectorAll(".xcb-jump-btn").forEach((btn) => {
      btn.onclick = () => {
        const sectionId = btn.dataset.section;
        if (!sectionId) return;
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          const originalBg = section.style.background;
          section.style.background = "rgba(59, 130, 246, 0.3)";
          section.style.borderRadius = "4px";
          section.style.padding = "5px";
          section.style.marginLeft = "-5px";
          setTimeout(() => {
            section.style.background = originalBg;
            section.style.padding = "";
            section.style.marginLeft = "";
          }, 1e3);
        }
      };
    });
    setupJumpToTopButton();
    setupUsernameHandlers();
    setupExportImportHandlers(refreshPanel, exportDataFn2);
    setupAutoBackupHandlers(refreshPanel, restoreFromBackupHistoryFn2);
    setupSortOrderHandlers(refreshPanel);
    setupCustomizationHandlers(panel, refreshPanel, getContrast, applyCustomStylesFn2);
    setupResetHandlers(refreshPanel);
    setupSearchFilterHandlers();
    setupWhitelistHandlers(refreshPanel);
    setupHelpToggleHandlers();
    setupEditNoteHandlers(panel, refreshPanel, formatDate);
    setupEnterKeyHandlers();
  }
  function setupQuickReplyHandlers() {
    const quickReplySelect = document.getElementById("xcbQuickReplySelect");
    if (quickReplySelect) {
      quickReplySelect.onchange = (e) => {
        const select = e.target;
        const msgInput = document.getElementById("xcbQuickReplyMsg");
        if (!msgInput) return;
        if (select.value === "custom") {
          msgInput.value = "";
          msgInput.focus();
        } else {
          const s = getSettings();
          const templates = s.quickReplies || DEFAULT_QUICK_REPLIES;
          msgInput.value = templates[parseInt(select.value)] || "";
        }
      };
    }
    const saveQuickReplyBtn = document.getElementById("xcbSaveQuickReply");
    if (saveQuickReplyBtn) {
      saveQuickReplyBtn.onclick = () => {
        var _a, _b;
        const s = getSettings();
        s.quickReplyMessage = ((_b = (_a = document.getElementById("xcbQuickReplyMsg")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || DEFAULT_QUICK_REPLIES[0];
        saveSettings(s);
        saveQuickReplyBtn.textContent = "Saved!";
        saveQuickReplyBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveQuickReplyBtn.textContent = "Save Message";
          saveQuickReplyBtn.style.background = "var(--xcb-primary)";
        }, 1500);
      };
    }
    const trustedReplySelect = document.getElementById("xcbTrustedReplySelect");
    if (trustedReplySelect) {
      trustedReplySelect.onchange = (e) => {
        const select = e.target;
        const msgInput = document.getElementById("xcbTrustedReplyMsg");
        if (!msgInput) return;
        if (select.value === "custom") {
          msgInput.value = "";
          msgInput.focus();
        } else {
          const s = getSettings();
          const templates = s.trustedReplies || DEFAULT_TRUSTED_REPLIES;
          msgInput.value = templates[parseInt(select.value)] || "";
        }
      };
    }
    const saveTrustedReplyBtn = document.getElementById("xcbSaveTrustedReply");
    if (saveTrustedReplyBtn) {
      saveTrustedReplyBtn.onclick = () => {
        var _a, _b;
        const s = getSettings();
        s.trustedReplyMessage = ((_b = (_a = document.getElementById("xcbTrustedReplyMsg")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || DEFAULT_TRUSTED_REPLIES[0];
        saveSettings(s);
        saveTrustedReplyBtn.textContent = "Saved!";
        saveTrustedReplyBtn.style.background = "#16a34a";
        setTimeout(() => {
          saveTrustedReplyBtn.textContent = "Save Message";
          saveTrustedReplyBtn.style.background = "#22c55e";
        }, 1500);
      };
    }
    const neutralReplySelect = document.getElementById("xcbNeutralReplySelect");
    if (neutralReplySelect) {
      neutralReplySelect.onchange = (e) => {
        const select = e.target;
        const msgInput = document.getElementById("xcbNeutralReplyMsg");
        if (!msgInput) return;
        if (select.value === "custom") {
          msgInput.value = "";
          msgInput.focus();
        } else {
          const s = getSettings();
          const templates = s.neutralReplies || DEFAULT_NEUTRAL_REPLIES;
          msgInput.value = templates[parseInt(select.value)] || "";
        }
      };
    }
    const saveNeutralReplyBtn = document.getElementById("xcbSaveNeutralReply");
    if (saveNeutralReplyBtn) {
      saveNeutralReplyBtn.onclick = () => {
        var _a, _b;
        const s = getSettings();
        s.neutralReplyMessage = ((_b = (_a = document.getElementById("xcbNeutralReplyMsg")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || DEFAULT_NEUTRAL_REPLIES[0];
        saveSettings(s);
        saveNeutralReplyBtn.textContent = "Saved!";
        saveNeutralReplyBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveNeutralReplyBtn.textContent = "Save Message";
          saveNeutralReplyBtn.style.background = "#6366f1";
        }, 1500);
      };
    }
    const seedingReplySelect = document.getElementById("xcbSeedingReplySelect");
    if (seedingReplySelect) {
      seedingReplySelect.onchange = (e) => {
        const select = e.target;
        const msgInput = document.getElementById("xcbSeedingReplyMsg");
        if (!msgInput) return;
        if (select.value === "custom") {
          msgInput.value = "";
          msgInput.focus();
        } else {
          const s = getSettings();
          const templates = s.seedingReplies || DEFAULT_SEEDING_REPLIES;
          msgInput.value = templates[parseInt(select.value)] || "";
        }
      };
    }
    const saveSeedingReplyBtn = document.getElementById("xcbSaveSeedingReply");
    if (saveSeedingReplyBtn) {
      saveSeedingReplyBtn.onclick = () => {
        var _a, _b;
        const s = getSettings();
        s.seedingReplyMessage = ((_b = (_a = document.getElementById("xcbSeedingReplyMsg")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || DEFAULT_SEEDING_REPLIES[0];
        saveSettings(s);
        saveSeedingReplyBtn.textContent = "Saved!";
        saveSeedingReplyBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveSeedingReplyBtn.textContent = "Save Message";
          saveSeedingReplyBtn.style.background = "#f59e0b";
        }, 1500);
      };
    }
  }
  function setupJumpToTopButton() {
    const jumpToTopBtn = document.getElementById("xcbJumpToTop");
    const settingsTab = document.getElementById("xcbSettingsTab");
    if (jumpToTopBtn && settingsTab) {
      const scrollThreshold = 200;
      const updateButtonVisibility = () => {
        const isSettingsVisible = settingsTab.classList.contains("xcb-tab-content-active");
        const isScrolledDown = settingsTab.scrollTop > scrollThreshold;
        jumpToTopBtn.style.display = isSettingsVisible && isScrolledDown ? "block" : "none";
      };
      settingsTab.addEventListener("scroll", updateButtonVisibility);
      jumpToTopBtn.onclick = () => {
        settingsTab.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }
  function setupUsernameHandlers(refreshPanel) {
    const reVerifyBtn = document.getElementById("xcbReVerifyAccount");
    if (reVerifyBtn) {
      reVerifyBtn.onclick = () => {
        clearVerifiedRank();
        setVerifiedUsername(null);
        window.location.href = "/account";
      };
    }
    const verifyBtn = document.getElementById("xcbVerifyAccount");
    if (verifyBtn) {
      verifyBtn.onclick = () => {
        window.location.href = "/account";
      };
    }
  }
  function setupExportImportHandlers(refreshPanel, exportDataFn2, importBackupFn2) {
    const exportBtn = document.getElementById("xcbExport");
    if (exportBtn && exportDataFn2) {
      exportBtn.onclick = exportDataFn2;
    }
    const importInput = document.getElementById("xcbImport");
    if (importInput) {
      importInput.onchange = (e) => {
        var _a;
        const file = (_a = e.target.files) == null ? void 0 : _a[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            var _a2;
            const jsonString = (_a2 = event.target) == null ? void 0 : _a2.result;
            if (jsonString) {
              const result = importDataFromJSON(jsonString);
              alert(result.message);
              if (result.success) {
                refreshPanel("settings");
              }
            }
          };
          reader.onerror = () => {
            alert("Failed to read file. Please try again.");
          };
          reader.readAsText(file);
        }
        e.target.value = "";
      };
    }
    const shareExportBtn = document.getElementById("xcbShareExport");
    if (shareExportBtn) {
      shareExportBtn.onclick = exportBlocklistOnly;
    }
    const exportRequestsBtn = document.getElementById("xcbExportRequests");
    if (exportRequestsBtn) {
      exportRequestsBtn.onclick = exportRequestsBackup;
    }
  }
  function setupAutoBackupHandlers(refreshPanel, restoreFromBackupHistoryFn2) {
    const autoBackupCheckbox = document.getElementById("xcbAutoBackupEnabled");
    if (autoBackupCheckbox) {
      autoBackupCheckbox.onchange = () => {
        const settings = getSettings();
        settings.autoBackupEnabled = autoBackupCheckbox.checked;
        saveSettings(settings);
        if (autoBackupCheckbox.checked) {
          checkAutoBackup$1(getSettings, getStats, saveSettings);
        }
      };
    }
    const autoBackupInterval = document.getElementById("xcbAutoBackupInterval");
    if (autoBackupInterval) {
      autoBackupInterval.onchange = () => {
        const settings = getSettings();
        settings.autoBackupInterval = autoBackupInterval.value;
        saveSettings(settings);
      };
    }
    const backupShowSaveAs = document.getElementById("xcbBackupShowSaveAs");
    if (backupShowSaveAs) {
      backupShowSaveAs.onchange = () => {
        const settings = getSettings();
        settings.backupShowSaveAs = backupShowSaveAs.checked;
        saveSettings(settings);
      };
    }
    const backupFilenamePrefix = document.getElementById("xcbBackupFilenamePrefix");
    if (backupFilenamePrefix) {
      backupFilenamePrefix.onchange = () => {
        const settings = getSettings();
        settings.backupFilenamePrefix = backupFilenamePrefix.value.trim() || "mankey-bot-backup";
        saveSettings(settings);
      };
    }
    document.querySelectorAll(".xcb-backup-history-download").forEach((btn) => {
      btn.onclick = () => {
        const index = parseInt(btn.dataset.index || "0");
        downloadBackupFromHistory(index);
      };
    });
    document.querySelectorAll(".xcb-backup-history-restore").forEach((btn) => {
      btn.onclick = () => {
        const index = parseInt(btn.dataset.index || "0");
        if (confirm("Restore this backup? This will replace all current data.")) {
          try {
            if (restoreFromBackupHistoryFn2) {
              restoreFromBackupHistoryFn2(index);
            }
            alert("Backup restored successfully!");
            refreshPanel("settings");
          } catch (e) {
            alert("Error restoring backup: " + e.message);
          }
        }
      };
    });
    const clearBackupHistoryBtn = document.getElementById("xcbClearBackupHistory");
    if (clearBackupHistoryBtn) {
      clearBackupHistoryBtn.onclick = () => {
        if (confirm("Clear all auto-backup history? This cannot be undone.")) {
          GM_setValue("backupHistory", []);
          refreshPanel("settings");
        }
      };
    }
    const viewAllBackupsBtn = document.getElementById("xcbViewAllBackups");
    if (viewAllBackupsBtn) {
      viewAllBackupsBtn.onclick = () => {
        showBackupHistoryPopup();
      };
    }
  }
  function setupSortOrderHandlers(refreshPanel) {
    const blockSortOrder = document.getElementById("xcbBlockSortOrder");
    if (blockSortOrder) {
      blockSortOrder.onchange = () => {
        const settings = getSettings();
        settings.blocklistSortOrder = blockSortOrder.value;
        saveSettings(settings);
        refreshPanel("block");
      };
    }
    const trustSortOrder = document.getElementById("xcbTrustSortOrder");
    if (trustSortOrder) {
      trustSortOrder.onchange = () => {
        const settings = getSettings();
        settings.trustedlistSortOrder = trustSortOrder.value;
        saveSettings(settings);
        refreshPanel("trust");
      };
    }
    const keywordSortOrder = document.getElementById("xcbKeywordSortOrder");
    if (keywordSortOrder) {
      keywordSortOrder.onchange = () => {
        const settings = getSettings();
        settings.keywordsSortOrder = keywordSortOrder.value;
        saveSettings(settings);
        refreshPanel("keyword");
      };
    }
    const requestSortOrder = document.getElementById("xcbRequestSortOrder");
    if (requestSortOrder) {
      requestSortOrder.onchange = () => {
        const settings = getSettings();
        settings.requestsSortOrder = requestSortOrder.value;
        saveSettings(settings);
        refreshPanel("requests");
      };
    }
  }
  function setupCustomizationHandlers(panel, refreshPanel, getContrast, applyCustomStylesFn2) {
    function refreshCustomReasonsList() {
      const listContainer = document.getElementById("xcbCustomReasonsList");
      if (!listContainer) return;
      const reasons = getCustomReasons();
      const count = reasons.length;
      const atMax = count >= MAX_CUSTOM_TAGS;
      const countSpan = document.getElementById("xcbCustomTagCount");
      if (countSpan) {
        countSpan.textContent = `(${count}/${MAX_CUSTOM_TAGS})`;
        countSpan.style.color = atMax ? "#ef4444" : "#888";
      }
      const nameInput = document.getElementById("xcbNewReasonName");
      const colorInput = document.getElementById("xcbNewReasonColor");
      const addBtn = document.getElementById("xcbAddCustomReason");
      if (nameInput) nameInput.disabled = atMax;
      if (colorInput) colorInput.disabled = atMax;
      if (addBtn) {
        addBtn.disabled = atMax;
        addBtn.style.background = atMax ? "#666" : "#8b5cf6";
      }
      if (reasons.length === 0) {
        listContainer.innerHTML = '<span style="color: #666; font-size: 12px;">No custom tags yet</span>';
      } else {
        listContainer.innerHTML = reasons.map(
          (r) => `
            <div class="xcb-custom-tag" data-name="${r.name}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 4px; background: ${r.color}20; border: 1px solid ${r.color}; color: #e0e0e0;">
              <span class="xcb-reason-badge" style="background: ${r.color}; color: ${getContrast(r.color)};">${r.name}</span>
              <input type="color" class="xcb-color-input xcb-tag-color-edit" value="${r.color}" data-name="${r.name}" title="Change color">
              <button class="xcb-tag-edit" data-name="${r.name}" data-color="${r.color}" style="background: transparent; border: none; color: var(--xcb-primary); cursor: pointer; font-size: 14px; padding: 2px 6px;" title="Edit tag name">✎</button>
              <button class="xcb-tag-delete" data-name="${r.name}" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: 16px; padding: 2px 6px;" title="Delete tag">✕</button>
            </div>
          `
        ).join("");
        listContainer.querySelectorAll(".xcb-tag-color-edit").forEach((input) => {
          input.onchange = () => {
            const name = input.dataset.name;
            const newColor = input.value;
            if (name) {
              updateCustomReason(name, name, newColor);
              refreshCustomReasonsList();
            }
          };
        });
        listContainer.querySelectorAll(".xcb-tag-edit").forEach((btn) => {
          btn.onclick = () => {
            const oldName = btn.dataset.name;
            const color = btn.dataset.color;
            if (!oldName || !color) return;
            const newName = prompt("Enter new tag name (max 20 characters):", oldName);
            if (newName && newName.trim() && newName.trim() !== oldName) {
              const trimmedName = newName.trim().substring(0, 20);
              updateCustomReason(oldName, trimmedName, color);
              refreshCustomReasonsList();
            }
          };
        });
        listContainer.querySelectorAll(".xcb-tag-delete").forEach((btn) => {
          btn.onclick = () => {
            const name = btn.dataset.name;
            if (name && confirm(`Delete the "${name}" tag?`)) {
              removeCustomReason(name);
              refreshCustomReasonsList();
            }
          };
        });
      }
    }
    const addCustomReasonBtn = document.getElementById("xcbAddCustomReason");
    if (addCustomReasonBtn) {
      addCustomReasonBtn.onclick = () => {
        var _a;
        const nameInput = document.getElementById("xcbNewReasonName");
        const colorInput = document.getElementById("xcbNewReasonColor");
        const name = (((_a = nameInput == null ? void 0 : nameInput.value) == null ? void 0 : _a.trim()) || "").substring(0, 20);
        const color = (colorInput == null ? void 0 : colorInput.value) || "#6b7280";
        if (!name) {
          alert("Please enter a tag name.");
          return;
        }
        if (name.length > 20) {
          alert("Tag name must be 20 characters or less.");
          return;
        }
        const result = addCustomReason(name, color);
        if (result === "success") {
          if (nameInput) nameInput.value = "";
          refreshCustomReasonsList();
        } else if (result === "default") {
          alert(`"${name}" is already a default tag. You can customize its color in the Tag Colors section above.`);
        } else if (result === "exists") {
          alert("A tag with that name already exists.");
        } else if (result === "max") {
          alert(`Maximum of ${MAX_CUSTOM_TAGS} custom tags reached. Delete some tags to add more.`);
        }
      };
    }
    panel.querySelectorAll(".xcb-tag-color-edit").forEach((input) => {
      input.onchange = () => {
        const name = input.dataset.name;
        const newColor = input.value;
        if (name) {
          updateCustomReason(name, name, newColor);
          refreshCustomReasonsList();
        }
      };
    });
    panel.querySelectorAll(".xcb-tag-edit").forEach((btn) => {
      btn.onclick = () => {
        const oldName = btn.dataset.name;
        const color = btn.dataset.color;
        if (!oldName || !color) return;
        const newName = prompt("Enter new tag name (max 20 characters):", oldName);
        if (newName && newName.trim() && newName.trim() !== oldName) {
          const trimmedName = newName.trim().substring(0, 20);
          updateCustomReason(oldName, trimmedName, color);
          refreshCustomReasonsList();
        }
      };
    });
    panel.querySelectorAll(".xcb-tag-delete").forEach((btn) => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        if (name && confirm(`Delete the "${name}" tag?`)) {
          removeCustomReason(name);
          refreshCustomReasonsList();
        }
      };
    });
    panel.querySelectorAll(".xcb-theme-btn").forEach((btn) => {
      btn.onclick = () => {
        const theme = btn.dataset.theme;
        if (!theme) return;
        const s = getSettings();
        if (theme.startsWith("custom-")) {
          const themeId = theme.replace("custom-", "");
          const importedTheme = (s.importedThemes || []).find((t) => t.id === themeId);
          if (importedTheme) {
            s.theme = theme;
            s.customColors = { ...importedTheme.colors };
            s.customFont = { ...importedTheme.font };
            s.badgeFont = { ...importedTheme.badgeFont };
            saveSettings(s);
            if (applyCustomStylesFn2) applyCustomStylesFn2();
            refreshPanel("settings");
          }
          return;
        }
        const preset = THEME_PRESETS[theme];
        if (preset) {
          s.theme = theme;
          const actionButtonColors = deriveActionButtonColors(preset);
          s.customColors = { ...s.customColors, ...preset, ...actionButtonColors };
          if (theme === "typewriter") {
            s.customFont = s.customFont || {};
            s.customFont.family = "'American Typewriter', 'Courier New', monospace";
            s.badgeFont = s.badgeFont || {};
            s.badgeFont.family = "'American Typewriter', 'Courier New', monospace";
          } else {
            s.customFont = s.customFont || {};
            s.customFont.family = "inherit";
            s.badgeFont = s.badgeFont || {};
            s.badgeFont.family = "inherit";
          }
          saveSettings(s);
          if (applyCustomStylesFn2) applyCustomStylesFn2();
          refreshPanel("settings");
        }
      };
    });
    panel.querySelectorAll(".xcb-delete-custom-theme").forEach((btn) => {
      btn.onclick = () => {
        const themeId = btn.dataset.themeId;
        if (!themeId) return;
        if (!confirm("Delete this custom theme?")) return;
        const s = getSettings();
        s.importedThemes = (s.importedThemes || []).filter((t) => t.id !== themeId);
        if (s.theme === `custom-${themeId}`) {
          s.theme = "classic";
          const classicButtonColors = deriveActionButtonColors(THEME_PRESETS.classic);
          s.customColors = { ...s.customColors, ...THEME_PRESETS.classic, ...classicButtonColors };
          s.customFont = s.customFont || {};
          s.customFont.family = "inherit";
          s.badgeFont = s.badgeFont || {};
          s.badgeFont.family = "inherit";
        }
        saveSettings(s);
        if (applyCustomStylesFn2) applyCustomStylesFn2();
        refreshPanel("settings");
      };
    });
    setupThemeExportImportHandlers(refreshPanel, applyCustomStylesFn2);
    setupFontAndBadgeHandlers(panel);
    setupSaveResetCustomizeHandlers(refreshPanel, applyCustomStylesFn2);
    setupThemeChangeDetection();
  }
  function processImportedTheme(themeData, refreshPanel, applyCustomStylesFn2) {
    if (themeData.type !== "mankey-bot-theme") {
      alert("Invalid theme data. Please use a valid MaNKeY-Bot theme.");
      return false;
    }
    if (!themeData.customColors) {
      alert("Invalid theme data. Missing color data.");
      return false;
    }
    const s = getSettings();
    if (!s.importedThemes) s.importedThemes = [];
    if (s.importedThemes.length >= MAX_IMPORTED_THEMES) {
      alert(`You can only have up to ${MAX_IMPORTED_THEMES} custom themes. Please delete one before importing another.`);
      return false;
    }
    const rawName = themeData.themeName || "Custom";
    const themeName = rawName.length > 20 ? rawName.slice(0, 20) + "…" : rawName;
    const themeId = Date.now().toString(36);
    const importedColors = { ...themeData.customColors };
    const importedFont = themeData.customFont ? { ...s.customFont, ...themeData.customFont } : { ...s.customFont };
    const importedBadgeFont = themeData.badgeFont ? { ...s.badgeFont, ...themeData.badgeFont } : { ...s.badgeFont };
    const newTheme = {
      id: themeId,
      name: themeName,
      colors: importedColors,
      font: importedFont,
      badgeFont: importedBadgeFont
    };
    s.importedThemes.push(newTheme);
    s.theme = `custom-${themeId}`;
    s.customColors = { ...importedColors };
    s.customFont = { ...importedFont };
    s.badgeFont = { ...importedBadgeFont };
    saveSettings(s);
    if (applyCustomStylesFn2) applyCustomStylesFn2();
    refreshPanel("settings");
    alert(`Theme "${themeName}" imported successfully! (${s.importedThemes.length}/${MAX_IMPORTED_THEMES} slots used)`);
    return true;
  }
  function showThemeImportGuide(themeFileInput, refreshPanel, applyCustomStylesFn2) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 100010;
  `;
    const popup = document.createElement("div");
    popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--xcb-panel-bg, #1a1a2e);
    border: 2px solid #d4893a;
    border-radius: 12px;
    padding: 24px;
    z-index: 100011;
    min-width: 480px;
    max-width: 560px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    font-family: inherit;
  `;
    popup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="margin: 0; color: #d4893a; font-size: 16px;"><i class="ph-bold ph-palette"></i> Import a Custom Theme</h3>
      <button id="xcbThemeGuideClose" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 22px; padding: 0; line-height: 1;">&times;</button>
    </div>

    <div style="background: var(--xcb-section-bg, #2a2a3e); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h4 style="margin: 0 0 12px 0; color: var(--xcb-panel-text, #fff); font-size: 13px;"><i class="ph-bold ph-info"></i> How Theme Files Work</h4>
      <p style="margin: 0 0 10px 0; color: var(--xcb-panel-text-secondary, #aaa); font-size: 12px; line-height: 1.5;">
        Theme files are <strong>.json</strong> files containing color and font settings. You can:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: var(--xcb-panel-text-secondary, #aaa); font-size: 12px; line-height: 1.8;">
        <li><strong>Export your current theme</strong> using the "Export Theme" button to save your customizations</li>
        <li><strong>Share themes</strong> with other users by sending them your exported .json file</li>
        <li><strong>Import themes</strong> created by others to instantly apply their color scheme</li>
      </ul>
    </div>

    <div style="background: var(--xcb-section-bg, #2a2a3e); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h4 style="margin: 0 0 12px 0; color: var(--xcb-panel-text, #fff); font-size: 13px;"><i class="ph-bold ph-pencil-simple"></i> Creating Your Own Theme</h4>
      <ol style="margin: 0; padding-left: 20px; color: var(--xcb-panel-text-secondary, #aaa); font-size: 12px; line-height: 1.8;">
        <li>Start with a preset theme (Classic, Ocean, Candy, etc.)</li>
        <li>Use the <strong>Customize Theme</strong> section below to adjust colors</li>
        <li>Click <strong>Export Theme</strong> to save your creation</li>
        <li>Edit the .json file in any text editor to fine-tune colors</li>
      </ol>
    </div>

    <div style="background: linear-gradient(135deg, rgba(212, 137, 58, 0.1), rgba(212, 137, 58, 0.05)); border: 1px solid rgba(212, 137, 58, 0.3); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
      <p style="margin: 0 0 8px 0; color: #d4893a; font-size: 11px; line-height: 1.5;">
        <i class="ph-bold ph-lightbulb"></i> <strong>Tip:</strong> Theme files include panel colors, badge colors, button styles, and font settings. All values use standard hex color codes (e.g., #1a1a2e).
      </p>
      <p style="margin: 0 0 8px 0; color: var(--xcb-panel-text-secondary, #aaa); font-size: 11px; line-height: 1.5;">
        <i class="ph-bold ph-swatches"></i> Need color inspiration? Try <a href="https://coolors.co/" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">Coolors.co</a> to generate beautiful color palettes.
      </p>
      <p style="margin: 0; color: var(--xcb-panel-text-secondary, #aaa); font-size: 11px; line-height: 1.5;">
        <i class="ph-bold ph-code"></i> No code editor? Use <a href="https://jsoneditoronline.org/" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">JSON Editor Online</a> to edit theme files in your browser.
      </p>
    </div>

    <div style="background: var(--xcb-section-bg, #2a2a3e); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <div id="xcbPasteToggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
        <i class="ph-bold ph-caret-right" id="xcbPasteToggleIcon" style="color: var(--xcb-panel-text-secondary, #aaa); transition: transform 0.2s;"></i>
        <h4 style="margin: 0; color: var(--xcb-panel-text, #fff); font-size: 13px;"><i class="ph-bold ph-clipboard-text"></i> Paste JSON Code</h4>
        <span style="color: var(--xcb-panel-text-muted, #666); font-size: 11px; margin-left: auto;">Click to expand</span>
      </div>
      <div id="xcbPasteSection" style="display: none; margin-top: 12px;">
        <p style="margin: 0 0 10px 0; color: var(--xcb-panel-text-secondary, #aaa); font-size: 11px; line-height: 1.5;">
          Paste the theme JSON code below. You can get this from someone sharing their theme or from an exported theme file.
        </p>
        <details style="margin-bottom: 10px; color: var(--xcb-panel-text-secondary, #aaa); font-size: 11px;">
          <summary style="cursor: pointer; color: #60a5fa; margin-bottom: 8px;"><i class="ph-bold ph-code"></i> View example theme to copy &amp; customize</summary>
          <pre id="xcbExampleTheme" style="background: var(--xcb-input-bg, #1a1a2e); border: 1px solid var(--xcb-input-border, #444); border-radius: 6px; padding: 10px; font-size: 10px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; user-select: all; cursor: text;">{
  "version": "1.0",
  "type": "mankey-bot-theme",
  "themeName": "Magma Terminal",
  "customColors": {
    "blocked": "#6a040f",
    "trusted": "#ffba08",
    "keyword": "#faa307",
    "panelBg": "#03071e",
    "panelText": "#ffffff",
    "panelBorder": "#dc2f02",
    "inputBg": "#1a040a",
    "inputBorder": "#f48c06",
    "inputText": "#ffffff",
    "buttonPrimary": "#e85d04",
    "buttonPrimaryText": "#ffffff",
    "buttonDanger": "#9d0208",
    "buttonDangerText": "#ffffff",
    "buttonReply": "#3b82f6",
    "buttonReplyText": "#ffffff",
    "buttonRequest": "#14b8a6",
    "buttonRequestText": "#ffffff",
    "buttonNote": "#8b5cf6",
    "buttonNoteText": "#ffffff",
    "badgeSpammer": "#000000",
    "badgeRude": "#370617",
    "badgeBeggar": "#6a040f",
    "badgeOfftopic": "#9d0208",
    "badgeTroll": "#03071e",
    "badgeAnnoying": "#d00000",
    "badgeUploader": "#f48c06",
    "badgeHelpful": "#ffba08",
    "badgeModerator": "#ffffff",
    "badgeRequester": "#dc2f02",
    "badgeFriend": "#faa307",
    "badgeSeeding": "#e85d04",
    "badgeThankful": "#ffba08",
    "badgeUnwanted": "#000000",
    "secondaryText": "#ffba08",
    "mutedText": "#9d0208",
    "tabBg": "#370617",
    "tabActiveBg": "#dc2f02",
    "sectionBg": "#03071e",
    "hoverBg": "#6a040f",
    "fontFamily": "'JetBrains Mono', monospace",
    "sectionText": "#f48c06",
    "tertiaryBg": "#370617",
    "borderLight": "#f48c06",
    "textDim": "#9d0208",
    "requestColor": "#ffba08",
    "requestHover": "#ffffff",
    "trustedUsernameColor": "#ffba08",
    "blockedUsernameColor": "#9d0208"
  },
  "customFont": {
    "family": "'JetBrains Mono', monospace",
    "size": "13px"
  },
  "badgeFont": {
    "family": "'JetBrains Mono', monospace",
    "size": "11px"
  }
}</pre>
          <button id="xcbCopyExample" style="margin-top: 6px; background: var(--xcb-section-bg, #444); color: var(--xcb-panel-text-secondary, #aaa); border: 1px solid var(--xcb-input-border, #555); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;"><i class="ph-bold ph-copy"></i> Copy Example</button>
        </details>
        <textarea id="xcbThemeJsonInput" placeholder='Paste theme JSON here or copy the example above and customize it...' style="width: 100%; height: 120px; background: var(--xcb-input-bg, #1a1a2e); border: 1px solid var(--xcb-input-border, #444); border-radius: 6px; color: var(--xcb-input-text, #fff); font-family: monospace; font-size: 11px; padding: 10px; resize: vertical; box-sizing: border-box;"></textarea>
        <button id="xcbImportFromPaste" style="margin-top: 10px; background: #14b8a6; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;"><i class="ph-bold ph-clipboard-text"></i> Import from Paste</button>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button id="xcbThemeGuideCancel" style="background: var(--xcb-section-bg, #444); color: var(--xcb-panel-text-secondary, #aaa); border: 1px solid var(--xcb-panel-border, #555); padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px;">Cancel</button>
      <button id="xcbThemeGuideChoose" style="background: #d4893a; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;"><i class="ph-bold ph-folder-open"></i> Choose File...</button>
    </div>
  `;
    const closePopup = () => {
      overlay.remove();
      popup.remove();
    };
    overlay.onclick = closePopup;
    popup.querySelector("#xcbThemeGuideClose").onclick = closePopup;
    popup.querySelector("#xcbThemeGuideCancel").onclick = closePopup;
    popup.querySelector("#xcbThemeGuideChoose").onclick = () => {
      closePopup();
      themeFileInput.click();
    };
    const pasteToggle = popup.querySelector("#xcbPasteToggle");
    const pasteSection = popup.querySelector("#xcbPasteSection");
    const pasteToggleIcon = popup.querySelector("#xcbPasteToggleIcon");
    if (pasteToggle && pasteSection && pasteToggleIcon) {
      pasteToggle.onclick = () => {
        const isExpanded = pasteSection.style.display !== "none";
        pasteSection.style.display = isExpanded ? "none" : "block";
        pasteToggleIcon.style.transform = isExpanded ? "" : "rotate(90deg)";
      };
    }
    const copyExampleBtn = popup.querySelector("#xcbCopyExample");
    const exampleTheme = popup.querySelector("#xcbExampleTheme");
    if (copyExampleBtn && exampleTheme) {
      copyExampleBtn.onclick = () => {
        const exampleText = exampleTheme.textContent || "";
        navigator.clipboard.writeText(exampleText).then(() => {
          copyExampleBtn.innerHTML = '<i class="ph-bold ph-check"></i> Copied!';
          copyExampleBtn.style.color = "#22c55e";
          copyExampleBtn.style.borderColor = "#22c55e";
          setTimeout(() => {
            copyExampleBtn.innerHTML = '<i class="ph-bold ph-copy"></i> Copy Example';
            copyExampleBtn.style.color = "";
            copyExampleBtn.style.borderColor = "";
          }, 2e3);
        }).catch(() => {
          const textarea = document.createElement("textarea");
          textarea.value = exampleText;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          copyExampleBtn.innerHTML = '<i class="ph-bold ph-check"></i> Copied!';
          setTimeout(() => {
            copyExampleBtn.innerHTML = '<i class="ph-bold ph-copy"></i> Copy Example';
          }, 2e3);
        });
      };
    }
    const importFromPasteBtn = popup.querySelector("#xcbImportFromPaste");
    const themeJsonInput = popup.querySelector("#xcbThemeJsonInput");
    if (importFromPasteBtn && themeJsonInput) {
      importFromPasteBtn.onclick = () => {
        const jsonText = themeJsonInput.value.trim();
        if (!jsonText) {
          alert("Please paste theme JSON code in the text area.");
          return;
        }
        try {
          const themeData = JSON.parse(jsonText);
          const success = processImportedTheme(themeData, refreshPanel, applyCustomStylesFn2);
          if (success) {
            closePopup();
          }
        } catch (err) {
          alert("Invalid JSON format. Please check your pasted code.\n\nError: " + err.message);
        }
      };
    }
    popup.onclick = (e) => e.stopPropagation();
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  }
  function setupThemeExportImportHandlers(refreshPanel, applyCustomStylesFn2) {
    const exportThemeBtn = document.getElementById("xcbExportTheme");
    if (exportThemeBtn) {
      exportThemeBtn.onclick = () => {
        var _a;
        const s = getSettings();
        let exportThemeName = s.theme || "custom";
        if ((_a = s.theme) == null ? void 0 : _a.startsWith("custom-")) {
          const themeId = s.theme.replace("custom-", "");
          const importedTheme = (s.importedThemes || []).find((t) => t.id === themeId);
          if (importedTheme) {
            exportThemeName = importedTheme.name;
          }
        }
        const themeData = {
          version: "1.0",
          type: "mankey-bot-theme",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          themeName: exportThemeName,
          customColors: { ...s.customColors },
          customFont: { ...s.customFont },
          badgeFont: { ...s.badgeFont || {} }
        };
        const dataStr = JSON.stringify(themeData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const safeThemeName = exportThemeName.replace(/[^a-zA-Z0-9-_]/g, "_");
        const filename = `mankey-bot-theme-${safeThemeName}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }
    const importThemeBtn = document.getElementById("xcbImportTheme");
    const themeFileInput = document.getElementById("xcbThemeFileInput");
    if (importThemeBtn && themeFileInput) {
      importThemeBtn.onclick = () => {
        showThemeImportGuide(themeFileInput, refreshPanel, applyCustomStylesFn2);
      };
      themeFileInput.onchange = (e) => {
        var _a;
        const file = (_a = e.target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          var _a2;
          try {
            const themeData = JSON.parse((_a2 = event.target) == null ? void 0 : _a2.result);
            processImportedTheme(themeData, refreshPanel, applyCustomStylesFn2);
          } catch (err) {
            alert("Error reading theme file: " + err.message);
          }
        };
        reader.readAsText(file);
        themeFileInput.value = "";
      };
    }
  }
  function setupFontAndBadgeHandlers(panel) {
    const fontSizeSelect = document.getElementById("xcbFontSize");
    const fontSizeCustomInput = document.getElementById("xcbFontSizeCustom");
    const fontSizeCustomLabel = document.getElementById("xcbFontSizeCustomLabel");
    if (fontSizeSelect && fontSizeCustomInput) {
      fontSizeSelect.onchange = () => {
        if (fontSizeSelect.value === "custom") {
          fontSizeCustomInput.style.display = "block";
          if (fontSizeCustomLabel) fontSizeCustomLabel.style.display = "inline";
          fontSizeCustomInput.focus();
        } else {
          fontSizeCustomInput.style.display = "none";
          if (fontSizeCustomLabel) fontSizeCustomLabel.style.display = "none";
        }
      };
    }
    const badgeTextModeSelect = document.getElementById("xcbBadgeTextMode");
    const getPreviewTextColor = (bgColor, mode) => {
      if (mode === "white") return "#ffffff";
      if (mode === "black") return "#000000";
      const hex = bgColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    };
    const updateAllBadgePreviews = () => {
      const mode = (badgeTextModeSelect == null ? void 0 : badgeTextModeSelect.value) || "auto";
      panel.querySelectorAll(".xcb-badge-preview-item").forEach((badge) => {
        const bgColor = badge.dataset.color;
        if (bgColor) {
          badge.style.color = getPreviewTextColor(bgColor, mode);
        }
      });
      panel.querySelectorAll(".xcb-badge-color-preview").forEach((badge) => {
        const inputId = badge.dataset.input;
        if (inputId) {
          const input = document.getElementById(inputId);
          if (input) {
            const color = input.value;
            if (badge.classList.contains("xcb-badge-soft-preview")) {
              badge.style.background = "transparent";
              badge.style.color = color;
              badge.style.borderColor = color;
            } else {
              badge.style.background = color;
              badge.style.color = getPreviewTextColor(color, mode);
            }
          }
        }
      });
      panel.querySelectorAll(".xcb-badge-font-preview").forEach((badge) => {
        const bgColor = badge.style.background || badge.style.backgroundColor;
        if (bgColor) {
          const hexMatch = bgColor.match(/#[a-fA-F0-9]{6}/);
          if (hexMatch) {
            badge.style.color = getPreviewTextColor(hexMatch[0], mode);
          }
        }
      });
    };
    if (badgeTextModeSelect) {
      badgeTextModeSelect.onchange = () => {
        updateAllBadgePreviews();
        const s = getSettings();
        s.badgeTextMode = badgeTextModeSelect.value;
        saveSettings(s);
      };
      setTimeout(() => {
        updateAllBadgePreviews();
      }, 50);
    }
    const badgeColorInputs = [
      "xcbColorSpammer",
      "xcbColorRude",
      "xcbColorBeggar",
      "xcbColorOfftopic",
      "xcbColorTroll",
      "xcbColorAnnoying",
      "xcbColorUnwanted",
      "xcbColorUploader",
      "xcbColorHelpful",
      "xcbColorModerator",
      "xcbColorRequester",
      "xcbColorFriend",
      "xcbColorSeeding",
      "xcbColorThankful"
    ];
    const updateBadgeColorPreview = (inputId, color) => {
      const previews = panel.querySelectorAll(`.xcb-badge-color-preview[data-input="${inputId}"]`);
      const mode = (badgeTextModeSelect == null ? void 0 : badgeTextModeSelect.value) || "auto";
      previews.forEach((preview) => {
        if (preview.classList.contains("xcb-badge-soft-preview")) {
          preview.style.background = "transparent";
          preview.style.color = color;
          preview.style.borderColor = color;
        } else {
          preview.style.background = color;
          preview.style.color = getPreviewTextColor(color, mode);
        }
      });
    };
    badgeColorInputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.oninput = () => updateBadgeColorPreview(inputId, input.value);
      }
    });
    const panelColorMap = {
      "xcbColorPanelBg": "--xcb-bg",
      "xcbColorPanelText": "--xcb-text",
      "xcbColorPanelBorder": "--xcb-border",
      "xcbColorInputBg": "--xcb-input-bg",
      "xcbColorInputBorder": "--xcb-input-border",
      "xcbColorInputText": "--xcb-input-text",
      "xcbColorButtonPrimary": "--xcb-primary",
      "xcbColorButtonDanger": "--xcb-danger"
    };
    Object.entries(panelColorMap).forEach(([inputId, cssVar]) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.oninput = () => {
          panel.style.setProperty(cssVar, input.value);
        };
      }
    });
    const badgeFontFamilySelect = document.getElementById("xcbBadgeFontFamily");
    const badgeFontSizeSelect = document.getElementById("xcbBadgeFontSize");
    const updateBadgeFontPreview = () => {
      const family = (badgeFontFamilySelect == null ? void 0 : badgeFontFamilySelect.value) || "inherit";
      const size = (badgeFontSizeSelect == null ? void 0 : badgeFontSizeSelect.value) || "11px";
      panel.querySelectorAll(".xcb-badge-font-preview").forEach((badge) => {
        badge.style.fontFamily = family;
        badge.style.fontSize = size;
      });
    };
    if (badgeFontFamilySelect) badgeFontFamilySelect.onchange = updateBadgeFontPreview;
    if (badgeFontSizeSelect) badgeFontSizeSelect.onchange = updateBadgeFontPreview;
  }
  function setupThemeChangeDetection() {
    const saveAsThemeBtn = document.getElementById("xcbSaveAsNewTheme");
    const saveAsThemeTopBtn = document.getElementById("xcbSaveAsThemeTop");
    const revertChangesBtn = document.getElementById("xcbRevertChanges");
    const revertChangesTopBtn = document.getElementById("xcbRevertChangesTop");
    if (!saveAsThemeBtn && !saveAsThemeTopBtn && !revertChangesBtn && !revertChangesTopBtn) return;
    const settings = getSettings();
    const savedColors = settings.customColors;
    settings.customFont;
    settings.badgeFont || {};
    const colorPickerMap = {
      xcbColorSpammer: savedColors.badgeSpammer,
      xcbColorRude: savedColors.badgeRude,
      xcbColorBeggar: savedColors.badgeBeggar,
      xcbColorOfftopic: savedColors.badgeOfftopic,
      xcbColorTroll: savedColors.badgeTroll,
      xcbColorAnnoying: savedColors.badgeAnnoying,
      xcbColorUploader: savedColors.badgeUploader,
      xcbColorHelpful: savedColors.badgeHelpful,
      xcbColorModerator: savedColors.badgeModerator,
      xcbColorRequester: savedColors.badgeRequester,
      xcbColorFriend: savedColors.badgeFriend,
      xcbColorSeeding: savedColors.badgeSeeding,
      xcbColorThankful: savedColors.badgeThankful,
      xcbColorUnwanted: savedColors.badgeUnwanted,
      xcbColorPanelBg: savedColors.panelBg,
      xcbColorPanelText: savedColors.panelText,
      xcbColorPanelBorder: savedColors.panelBorder,
      xcbColorInputBg: savedColors.inputBg,
      xcbColorInputBorder: savedColors.inputBorder,
      xcbColorInputText: savedColors.inputText,
      xcbColorButtonPrimary: savedColors.buttonPrimary,
      xcbColorButtonDanger: savedColors.buttonDanger,
      xcbColorButtonReply: savedColors.buttonReply,
      xcbColorButtonReplyText: savedColors.buttonReplyText,
      xcbColorButtonRequest: savedColors.buttonRequest,
      xcbColorButtonRequestText: savedColors.buttonRequestText,
      xcbColorButtonNote: savedColors.buttonNote,
      xcbColorButtonNoteText: savedColors.buttonNoteText,
      xcbColorButtonPrimaryText: savedColors.buttonPrimaryText,
      xcbColorButtonDangerText: savedColors.buttonDangerText,
      xcbColorTrustedUsername: savedColors.trustedUsernameColor || "#4ade80",
      xcbColorBlockedUsername: savedColors.blockedUsernameColor || "#ff6b6b"
    };
    const updateButtonVisibility = () => {
    };
    const colorToCssVarMap = {
      xcbColorSpammer: "--xcb-badge-spammer",
      xcbColorRude: "--xcb-badge-rude",
      xcbColorBeggar: "--xcb-badge-beggar",
      xcbColorOfftopic: "--xcb-badge-offtopic",
      xcbColorTroll: "--xcb-badge-troll",
      xcbColorAnnoying: "--xcb-badge-annoying",
      xcbColorUploader: "--xcb-badge-uploader",
      xcbColorHelpful: "--xcb-badge-helpful",
      xcbColorModerator: "--xcb-badge-moderator",
      xcbColorRequester: "--xcb-badge-requester",
      xcbColorFriend: "--xcb-badge-friend",
      xcbColorSeeding: "--xcb-badge-seeding",
      xcbColorThankful: "--xcb-badge-thankful",
      xcbColorUnwanted: "--xcb-badge-unwanted",
      xcbColorPanelBg: "--xcb-bg",
      xcbColorPanelText: "--xcb-text",
      xcbColorPanelBorder: "--xcb-border",
      xcbColorInputBg: "--xcb-input-bg",
      xcbColorInputBorder: "--xcb-input-border",
      xcbColorInputText: "--xcb-input-text",
      xcbColorButtonPrimary: "--xcb-primary",
      xcbColorButtonDanger: "--xcb-danger",
      xcbColorButtonReply: "--xcb-button-reply",
      xcbColorButtonReplyText: "--xcb-button-reply-text",
      xcbColorButtonRequest: "--xcb-button-request",
      xcbColorButtonRequestText: "--xcb-button-request-text",
      xcbColorButtonNote: "--xcb-button-note",
      xcbColorButtonNoteText: "--xcb-button-note-text",
      xcbColorButtonPrimaryText: "--xcb-primary-text",
      xcbColorButtonDangerText: "--xcb-danger-text",
      xcbColorTrustedUsername: "--xcb-trusted-color",
      xcbColorBlockedUsername: "--xcb-blocked-color"
    };
    const getContrastForPreview = (hex) => {
      const color = hex.replace("#", "");
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    };
    const updateBadgePreview = (inputId, color) => {
      const previews = document.querySelectorAll(`.xcb-badge-color-preview[data-input="${inputId}"]`);
      previews.forEach((preview) => {
        if (preview.classList.contains("xcb-badge-soft-preview")) {
          preview.style.backgroundColor = "transparent";
          preview.style.color = color;
          preview.style.borderColor = color;
        } else {
          preview.style.backgroundColor = color;
          preview.style.color = getContrastForPreview(color);
        }
      });
    };
    const updateActionButtonPreview = (btnType, bgColor, textColor) => {
      const preview = document.querySelector(`.xcb-action-btn-preview[data-btn="${btnType}"]`);
      if (preview) {
        if (bgColor !== null) preview.style.backgroundColor = bgColor;
        if (textColor !== null) preview.style.color = textColor;
      }
    };
    const actionButtonMap = {
      xcbColorButtonReply: { type: "reply", prop: "bg" },
      xcbColorButtonReplyText: { type: "reply", prop: "text" },
      xcbColorButtonRequest: { type: "request", prop: "bg" },
      xcbColorButtonRequestText: { type: "request", prop: "text" },
      xcbColorButtonNote: { type: "note", prop: "bg" },
      xcbColorButtonNoteText: { type: "note", prop: "text" }
    };
    const updateUsernamePreview = (type, color) => {
      const preview = document.querySelector(`.xcb-username-preview[data-type="${type}"]`);
      if (preview) {
        preview.style.color = color;
      }
      const badgePreviews = document.querySelectorAll(`.xcb-preview-username-${type}`);
      badgePreviews.forEach((el) => {
        el.style.color = color;
      });
    };
    const usernameColorMap = {
      xcbColorTrustedUsername: "trusted",
      xcbColorBlockedUsername: "blocked"
    };
    const updateLivePreview = (inputId, value) => {
      const cssVar = colorToCssVarMap[inputId];
      if (!cssVar) return;
      const panel = document.querySelector(".xcb-panel");
      if (panel) {
        panel.style.setProperty(cssVar, value);
      }
      if (inputId.startsWith("xcbColor") && inputId !== "xcbColorPanelBg" && inputId !== "xcbColorPanelText" && inputId !== "xcbColorPanelBorder") {
        updateBadgePreview(inputId, value);
      }
      const actionBtn = actionButtonMap[inputId];
      if (actionBtn) {
        if (actionBtn.prop === "bg") {
          updateActionButtonPreview(actionBtn.type, value, null);
        } else {
          updateActionButtonPreview(actionBtn.type, null, value);
        }
      }
      const usernameType = usernameColorMap[inputId];
      if (usernameType) {
        updateUsernamePreview(usernameType, value);
      }
    };
    const revertLivePreview = () => {
      const panel = document.querySelector(".xcb-panel");
      if (!panel) return;
      for (const [inputId, cssVar] of Object.entries(colorToCssVarMap)) {
        const savedValue = colorPickerMap[inputId];
        if (savedValue) {
          panel.style.setProperty(cssVar, savedValue);
        }
      }
      for (const [inputId, savedValue] of Object.entries(colorPickerMap)) {
        if (savedValue) {
          updateBadgePreview(inputId, savedValue);
        }
      }
      for (const [inputId, btnInfo] of Object.entries(actionButtonMap)) {
        const savedValue = colorPickerMap[inputId];
        if (savedValue) {
          if (btnInfo.prop === "bg") {
            updateActionButtonPreview(btnInfo.type, savedValue, null);
          } else {
            updateActionButtonPreview(btnInfo.type, null, savedValue);
          }
        }
      }
      for (const [inputId, usernameType] of Object.entries(usernameColorMap)) {
        const savedValue = colorPickerMap[inputId];
        if (savedValue) {
          updateUsernamePreview(usernameType, savedValue);
        }
      }
    };
    Object.keys(colorPickerMap).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", () => {
          updateLivePreview(id, input.value);
        });
        input.addEventListener("change", () => {
          updateLivePreview(id, input.value);
        });
      }
    });
    const fontSelectors = ["xcbFontFamily", "xcbFontSize", "xcbFontSizeCustom", "xcbBadgeFontFamily", "xcbBadgeFontSize"];
    fontSelectors.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", updateButtonVisibility);
        element.addEventListener("change", updateButtonVisibility);
      }
    });
    window.__xcbRevertLivePreview = revertLivePreview;
  }
  function setupSaveResetCustomizeHandlers(refreshPanel, applyCustomStylesFn2) {
    const saveCustomizeBtn = document.getElementById("xcbSaveCustomize");
    if (saveCustomizeBtn) {
      saveCustomizeBtn.onclick = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L;
        const s = getSettings();
        s.customColors = {
          ...s.customColors,
          badgeSpammer: ((_a = document.getElementById("xcbColorSpammer")) == null ? void 0 : _a.value) || DEFAULT_CUSTOM.colors.badgeSpammer,
          badgeRude: ((_b = document.getElementById("xcbColorRude")) == null ? void 0 : _b.value) || DEFAULT_CUSTOM.colors.badgeRude,
          badgeBeggar: ((_c = document.getElementById("xcbColorBeggar")) == null ? void 0 : _c.value) || DEFAULT_CUSTOM.colors.badgeBeggar,
          badgeOfftopic: ((_d = document.getElementById("xcbColorOfftopic")) == null ? void 0 : _d.value) || DEFAULT_CUSTOM.colors.badgeOfftopic,
          badgeTroll: ((_e = document.getElementById("xcbColorTroll")) == null ? void 0 : _e.value) || DEFAULT_CUSTOM.colors.badgeTroll,
          badgeAnnoying: ((_f = document.getElementById("xcbColorAnnoying")) == null ? void 0 : _f.value) || DEFAULT_CUSTOM.colors.badgeAnnoying,
          badgeUploader: ((_g = document.getElementById("xcbColorUploader")) == null ? void 0 : _g.value) || DEFAULT_CUSTOM.colors.badgeUploader,
          badgeHelpful: ((_h = document.getElementById("xcbColorHelpful")) == null ? void 0 : _h.value) || DEFAULT_CUSTOM.colors.badgeHelpful,
          badgeModerator: ((_i = document.getElementById("xcbColorModerator")) == null ? void 0 : _i.value) || DEFAULT_CUSTOM.colors.badgeModerator,
          badgeRequester: ((_j = document.getElementById("xcbColorRequester")) == null ? void 0 : _j.value) || DEFAULT_CUSTOM.colors.badgeRequester,
          badgeFriend: ((_k = document.getElementById("xcbColorFriend")) == null ? void 0 : _k.value) || DEFAULT_CUSTOM.colors.badgeFriend,
          badgeSeeding: ((_l = document.getElementById("xcbColorSeeding")) == null ? void 0 : _l.value) || DEFAULT_CUSTOM.colors.badgeSeeding,
          badgeThankful: ((_m = document.getElementById("xcbColorThankful")) == null ? void 0 : _m.value) || DEFAULT_CUSTOM.colors.badgeThankful,
          badgeUnwanted: ((_n = document.getElementById("xcbColorUnwanted")) == null ? void 0 : _n.value) || DEFAULT_CUSTOM.colors.badgeUnwanted,
          panelBg: ((_o = document.getElementById("xcbColorPanelBg")) == null ? void 0 : _o.value) || DEFAULT_CUSTOM.colors.panelBg,
          panelText: ((_p = document.getElementById("xcbColorPanelText")) == null ? void 0 : _p.value) || DEFAULT_CUSTOM.colors.panelText,
          panelBorder: ((_q = document.getElementById("xcbColorPanelBorder")) == null ? void 0 : _q.value) || DEFAULT_CUSTOM.colors.panelBorder,
          inputBg: ((_r = document.getElementById("xcbColorInputBg")) == null ? void 0 : _r.value) || DEFAULT_CUSTOM.colors.inputBg,
          inputBorder: ((_s = document.getElementById("xcbColorInputBorder")) == null ? void 0 : _s.value) || DEFAULT_CUSTOM.colors.inputBorder,
          inputText: ((_t = document.getElementById("xcbColorInputText")) == null ? void 0 : _t.value) || DEFAULT_CUSTOM.colors.inputText,
          buttonPrimary: ((_u = document.getElementById("xcbColorButtonPrimary")) == null ? void 0 : _u.value) || DEFAULT_CUSTOM.colors.buttonPrimary,
          buttonDanger: ((_v = document.getElementById("xcbColorButtonDanger")) == null ? void 0 : _v.value) || DEFAULT_CUSTOM.colors.buttonDanger,
          buttonReply: ((_w = document.getElementById("xcbColorButtonReply")) == null ? void 0 : _w.value) || DEFAULT_CUSTOM.colors.buttonReply,
          buttonReplyText: ((_x = document.getElementById("xcbColorButtonReplyText")) == null ? void 0 : _x.value) || DEFAULT_CUSTOM.colors.buttonReplyText,
          buttonRequest: ((_y = document.getElementById("xcbColorButtonRequest")) == null ? void 0 : _y.value) || DEFAULT_CUSTOM.colors.buttonRequest,
          buttonRequestText: ((_z = document.getElementById("xcbColorButtonRequestText")) == null ? void 0 : _z.value) || DEFAULT_CUSTOM.colors.buttonRequestText,
          buttonNote: ((_A = document.getElementById("xcbColorButtonNote")) == null ? void 0 : _A.value) || DEFAULT_CUSTOM.colors.buttonNote,
          buttonNoteText: ((_B = document.getElementById("xcbColorButtonNoteText")) == null ? void 0 : _B.value) || DEFAULT_CUSTOM.colors.buttonNoteText,
          buttonPrimaryText: ((_C = document.getElementById("xcbColorButtonPrimaryText")) == null ? void 0 : _C.value) || DEFAULT_CUSTOM.colors.buttonPrimaryText,
          buttonDangerText: ((_D = document.getElementById("xcbColorButtonDangerText")) == null ? void 0 : _D.value) || DEFAULT_CUSTOM.colors.buttonDangerText,
          trustedUsernameColor: ((_E = document.getElementById("xcbColorTrustedUsername")) == null ? void 0 : _E.value) || DEFAULT_CUSTOM.colors.trustedUsernameColor,
          blockedUsernameColor: ((_F = document.getElementById("xcbColorBlockedUsername")) == null ? void 0 : _F.value) || DEFAULT_CUSTOM.colors.blockedUsernameColor
        };
        const fontSizeSelectVal = ((_G = document.getElementById("xcbFontSize")) == null ? void 0 : _G.value) || "13px";
        const fontSizeCustomVal = ((_H = document.getElementById("xcbFontSizeCustom")) == null ? void 0 : _H.value) || "13";
        s.customFont = {
          family: ((_I = document.getElementById("xcbFontFamily")) == null ? void 0 : _I.value) || "inherit",
          size: fontSizeSelectVal === "custom" ? fontSizeCustomVal + "px" : fontSizeSelectVal
        };
        s.badgeFont = {
          family: ((_J = document.getElementById("xcbBadgeFontFamily")) == null ? void 0 : _J.value) || "inherit",
          size: ((_K = document.getElementById("xcbBadgeFontSize")) == null ? void 0 : _K.value) || "11px"
        };
        s.badgeTextMode = ((_L = document.getElementById("xcbBadgeTextMode")) == null ? void 0 : _L.value) || "auto";
        s.theme = "custom";
        saveSettings(s);
        if (applyCustomStylesFn2) applyCustomStylesFn2();
        saveCustomizeBtn.textContent = "Applied!";
        saveCustomizeBtn.style.background = "#22c55e";
        setTimeout(() => {
          saveCustomizeBtn.textContent = "Apply Changes";
          saveCustomizeBtn.style.background = "var(--xcb-primary)";
          refreshPanel("settings");
        }, 1e3);
      };
    }
    const handleRevertChanges = (clickedBtn) => {
      const settings = getSettings();
      const savedColors = settings.customColors;
      const savedFont = settings.customFont;
      const savedBadgeFont = settings.badgeFont || { family: "inherit", size: "11px" };
      const colorRevertMap = {
        xcbColorSpammer: savedColors.badgeSpammer,
        xcbColorRude: savedColors.badgeRude,
        xcbColorBeggar: savedColors.badgeBeggar,
        xcbColorOfftopic: savedColors.badgeOfftopic,
        xcbColorTroll: savedColors.badgeTroll,
        xcbColorAnnoying: savedColors.badgeAnnoying,
        xcbColorUploader: savedColors.badgeUploader,
        xcbColorHelpful: savedColors.badgeHelpful,
        xcbColorModerator: savedColors.badgeModerator,
        xcbColorRequester: savedColors.badgeRequester,
        xcbColorFriend: savedColors.badgeFriend,
        xcbColorSeeding: savedColors.badgeSeeding,
        xcbColorThankful: savedColors.badgeThankful,
        xcbColorUnwanted: savedColors.badgeUnwanted,
        xcbColorPanelBg: savedColors.panelBg,
        xcbColorPanelText: savedColors.panelText,
        xcbColorPanelBorder: savedColors.panelBorder,
        xcbColorInputBg: savedColors.inputBg,
        xcbColorInputBorder: savedColors.inputBorder,
        xcbColorInputText: savedColors.inputText,
        xcbColorButtonPrimary: savedColors.buttonPrimary,
        xcbColorButtonDanger: savedColors.buttonDanger,
        xcbColorButtonReply: savedColors.buttonReply,
        xcbColorButtonReplyText: savedColors.buttonReplyText,
        xcbColorButtonRequest: savedColors.buttonRequest,
        xcbColorButtonRequestText: savedColors.buttonRequestText,
        xcbColorButtonNote: savedColors.buttonNote,
        xcbColorButtonNoteText: savedColors.buttonNoteText,
        xcbColorButtonPrimaryText: savedColors.buttonPrimaryText,
        xcbColorButtonDangerText: savedColors.buttonDangerText,
        xcbColorTrustedUsername: savedColors.trustedUsernameColor || "#4ade80",
        xcbColorBlockedUsername: savedColors.blockedUsernameColor || "#ff6b6b"
      };
      for (const [id, savedValue] of Object.entries(colorRevertMap)) {
        const input = document.getElementById(id);
        if (input && savedValue) {
          input.value = savedValue;
        }
      }
      const fontFamilySelect = document.getElementById("xcbFontFamily");
      if (fontFamilySelect) {
        let fontExists = false;
        for (const opt of fontFamilySelect.options) {
          if (opt.value === savedFont.family) {
            fontExists = true;
            break;
          }
        }
        if (!fontExists && savedFont.family !== "inherit") {
          const customOpt = document.createElement("option");
          customOpt.value = savedFont.family;
          customOpt.textContent = `Custom: ${savedFont.family}`;
          fontFamilySelect.appendChild(customOpt);
        }
        fontFamilySelect.value = savedFont.family;
      }
      const fontSizeSelect = document.getElementById("xcbFontSize");
      const fontSizeCustom = document.getElementById("xcbFontSizeCustom");
      const fontSizeCustomLabel = document.getElementById("xcbFontSizeCustomLabel");
      if (fontSizeSelect) {
        const presetSizes = ["11px", "13px", "15px", "17px"];
        if (presetSizes.includes(savedFont.size)) {
          fontSizeSelect.value = savedFont.size;
          if (fontSizeCustom) fontSizeCustom.style.display = "none";
          if (fontSizeCustomLabel) fontSizeCustomLabel.style.display = "none";
        } else {
          fontSizeSelect.value = "custom";
          if (fontSizeCustom) {
            fontSizeCustom.value = parseInt(savedFont.size, 10).toString();
            fontSizeCustom.style.display = "block";
          }
          if (fontSizeCustomLabel) fontSizeCustomLabel.style.display = "inline";
        }
      }
      const badgeFontFamilySelect = document.getElementById("xcbBadgeFontFamily");
      if (badgeFontFamilySelect) {
        let fontExists = false;
        for (const opt of badgeFontFamilySelect.options) {
          if (opt.value === savedBadgeFont.family) {
            fontExists = true;
            break;
          }
        }
        if (!fontExists && savedBadgeFont.family !== "inherit") {
          const customOpt = document.createElement("option");
          customOpt.value = savedBadgeFont.family;
          customOpt.textContent = `Custom: ${savedBadgeFont.family}`;
          badgeFontFamilySelect.appendChild(customOpt);
        }
        badgeFontFamilySelect.value = savedBadgeFont.family;
      }
      const badgeFontSizeSelect = document.getElementById("xcbBadgeFontSize");
      if (badgeFontSizeSelect) {
        badgeFontSizeSelect.value = savedBadgeFont.size;
      }
      const revertLivePreviewFn = window.__xcbRevertLivePreview;
      if (revertLivePreviewFn) revertLivePreviewFn();
      if (applyCustomStylesFn2) applyCustomStylesFn2();
      const originalText = clickedBtn.textContent;
      clickedBtn.textContent = "Reverted!";
      setTimeout(() => {
        clickedBtn.textContent = originalText;
      }, 1e3);
    };
    const revertChangesBtn = document.getElementById("xcbRevertChanges");
    const revertChangesTopBtn = document.getElementById("xcbRevertChangesTop");
    if (revertChangesBtn) {
      revertChangesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRevertChanges(revertChangesBtn);
      });
    }
    if (revertChangesTopBtn) {
      revertChangesTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRevertChanges(revertChangesTopBtn);
      });
    }
    const handleSaveAsTheme = (clickedBtn) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K;
      const s = getSettings();
      if (!s.importedThemes) s.importedThemes = [];
      if (s.importedThemes.length >= MAX_IMPORTED_THEMES) {
        alert(`You can only have up to ${MAX_IMPORTED_THEMES} custom themes. Please delete one before saving a new theme.`);
        return;
      }
      const rawName = prompt("Enter a name for your new theme:", "My Theme");
      if (!rawName) return;
      const themeName = rawName.length > 20 ? rawName.slice(0, 20) + "…" : rawName;
      const nameExists = s.importedThemes.some((t) => t.name.toLowerCase() === themeName.toLowerCase());
      if (nameExists) {
        alert(`A theme named "${themeName}" already exists. Please choose a different name.`);
        return;
      }
      const colors = {
        ...s.customColors,
        // Preserve all existing properties (secondaryText, mutedText, tabBg, sectionBg, hoverBg, etc.)
        // Now overlay values from color pickers
        badgeSpammer: ((_a = document.getElementById("xcbColorSpammer")) == null ? void 0 : _a.value) || s.customColors.badgeSpammer,
        badgeRude: ((_b = document.getElementById("xcbColorRude")) == null ? void 0 : _b.value) || s.customColors.badgeRude,
        badgeBeggar: ((_c = document.getElementById("xcbColorBeggar")) == null ? void 0 : _c.value) || s.customColors.badgeBeggar,
        badgeOfftopic: ((_d = document.getElementById("xcbColorOfftopic")) == null ? void 0 : _d.value) || s.customColors.badgeOfftopic,
        badgeTroll: ((_e = document.getElementById("xcbColorTroll")) == null ? void 0 : _e.value) || s.customColors.badgeTroll,
        badgeAnnoying: ((_f = document.getElementById("xcbColorAnnoying")) == null ? void 0 : _f.value) || s.customColors.badgeAnnoying,
        badgeUploader: ((_g = document.getElementById("xcbColorUploader")) == null ? void 0 : _g.value) || s.customColors.badgeUploader,
        badgeHelpful: ((_h = document.getElementById("xcbColorHelpful")) == null ? void 0 : _h.value) || s.customColors.badgeHelpful,
        badgeModerator: ((_i = document.getElementById("xcbColorModerator")) == null ? void 0 : _i.value) || s.customColors.badgeModerator,
        badgeRequester: ((_j = document.getElementById("xcbColorRequester")) == null ? void 0 : _j.value) || s.customColors.badgeRequester,
        badgeFriend: ((_k = document.getElementById("xcbColorFriend")) == null ? void 0 : _k.value) || s.customColors.badgeFriend,
        badgeSeeding: ((_l = document.getElementById("xcbColorSeeding")) == null ? void 0 : _l.value) || s.customColors.badgeSeeding,
        badgeThankful: ((_m = document.getElementById("xcbColorThankful")) == null ? void 0 : _m.value) || s.customColors.badgeThankful,
        badgeUnwanted: ((_n = document.getElementById("xcbColorUnwanted")) == null ? void 0 : _n.value) || s.customColors.badgeUnwanted,
        panelBg: ((_o = document.getElementById("xcbColorPanelBg")) == null ? void 0 : _o.value) || s.customColors.panelBg,
        panelText: ((_p = document.getElementById("xcbColorPanelText")) == null ? void 0 : _p.value) || s.customColors.panelText,
        panelBorder: ((_q = document.getElementById("xcbColorPanelBorder")) == null ? void 0 : _q.value) || s.customColors.panelBorder,
        inputBg: ((_r = document.getElementById("xcbColorInputBg")) == null ? void 0 : _r.value) || s.customColors.inputBg,
        inputBorder: ((_s = document.getElementById("xcbColorInputBorder")) == null ? void 0 : _s.value) || s.customColors.inputBorder,
        inputText: ((_t = document.getElementById("xcbColorInputText")) == null ? void 0 : _t.value) || s.customColors.inputText,
        buttonPrimary: ((_u = document.getElementById("xcbColorButtonPrimary")) == null ? void 0 : _u.value) || s.customColors.buttonPrimary,
        buttonDanger: ((_v = document.getElementById("xcbColorButtonDanger")) == null ? void 0 : _v.value) || s.customColors.buttonDanger,
        buttonReply: ((_w = document.getElementById("xcbColorButtonReply")) == null ? void 0 : _w.value) || s.customColors.buttonReply,
        buttonReplyText: ((_x = document.getElementById("xcbColorButtonReplyText")) == null ? void 0 : _x.value) || s.customColors.buttonReplyText,
        buttonRequest: ((_y = document.getElementById("xcbColorButtonRequest")) == null ? void 0 : _y.value) || s.customColors.buttonRequest,
        buttonRequestText: ((_z = document.getElementById("xcbColorButtonRequestText")) == null ? void 0 : _z.value) || s.customColors.buttonRequestText,
        buttonNote: ((_A = document.getElementById("xcbColorButtonNote")) == null ? void 0 : _A.value) || s.customColors.buttonNote,
        buttonNoteText: ((_B = document.getElementById("xcbColorButtonNoteText")) == null ? void 0 : _B.value) || s.customColors.buttonNoteText,
        buttonPrimaryText: ((_C = document.getElementById("xcbColorButtonPrimaryText")) == null ? void 0 : _C.value) || s.customColors.buttonPrimaryText,
        buttonDangerText: ((_D = document.getElementById("xcbColorButtonDangerText")) == null ? void 0 : _D.value) || s.customColors.buttonDangerText,
        trustedUsernameColor: ((_E = document.getElementById("xcbColorTrustedUsername")) == null ? void 0 : _E.value) || s.customColors.trustedUsernameColor || "#4ade80",
        blockedUsernameColor: ((_F = document.getElementById("xcbColorBlockedUsername")) == null ? void 0 : _F.value) || s.customColors.blockedUsernameColor || "#ff6b6b"
      };
      const fontSizeSelectVal = ((_G = document.getElementById("xcbFontSize")) == null ? void 0 : _G.value) || "13px";
      const fontSizeCustomVal = ((_H = document.getElementById("xcbFontSizeCustom")) == null ? void 0 : _H.value) || "13";
      const font = {
        family: ((_I = document.getElementById("xcbFontFamily")) == null ? void 0 : _I.value) || "inherit",
        size: fontSizeSelectVal === "custom" ? fontSizeCustomVal + "px" : fontSizeSelectVal
      };
      const badgeFont = {
        family: ((_J = document.getElementById("xcbBadgeFontFamily")) == null ? void 0 : _J.value) || "inherit",
        size: ((_K = document.getElementById("xcbBadgeFontSize")) == null ? void 0 : _K.value) || "11px"
      };
      const themeId = Date.now().toString(36);
      const newTheme = {
        id: themeId,
        name: themeName,
        colors,
        font,
        badgeFont
      };
      s.importedThemes.push(newTheme);
      s.theme = `custom-${themeId}`;
      s.customColors = { ...colors };
      s.customFont = { ...font };
      s.badgeFont = { ...badgeFont };
      saveSettings(s);
      if (applyCustomStylesFn2) applyCustomStylesFn2();
      const originalHTML = clickedBtn.innerHTML;
      const originalBg = clickedBtn.style.background;
      clickedBtn.innerHTML = '<i class="ph-bold ph-check"></i> Saved!';
      clickedBtn.style.background = "#22c55e";
      setTimeout(() => {
        clickedBtn.innerHTML = originalHTML;
        clickedBtn.style.background = originalBg;
        refreshPanel("settings");
      }, 1e3);
      alert(`Theme "${themeName}" saved successfully! (${s.importedThemes.length}/${MAX_IMPORTED_THEMES} slots used)

You can now switch to this theme from the theme presets menu.`);
    };
    const saveAsThemeBtn = document.getElementById("xcbSaveAsNewTheme");
    if (saveAsThemeBtn) {
      saveAsThemeBtn.onclick = () => handleSaveAsTheme(saveAsThemeBtn);
    }
    const saveAsThemeTopBtn = document.getElementById("xcbSaveAsThemeTop");
    if (saveAsThemeTopBtn) {
      saveAsThemeTopBtn.onclick = () => handleSaveAsTheme(saveAsThemeTopBtn);
    }
  }
  function setupResetHandlers(refreshPanel) {
    const resetStatsBtn = document.getElementById("xcbResetStats");
    if (resetStatsBtn) {
      resetStatsBtn.onclick = () => {
        if (confirm("Reset all statistics?")) {
          saveStats({ totalHidden: 0, keywordHidden: 0 });
          const blocklist = getBlocklist();
          for (const key in blocklist) {
            if (blocklist[key]) {
              blocklist[key].hideCount = 0;
              blocklist[key].countedComments = [];
            }
          }
          saveBlocklist(blocklist);
          refreshPanel("settings");
        }
      };
    }
    const factoryResetBtn = document.getElementById("xcbFactoryReset");
    if (factoryResetBtn) {
      factoryResetBtn.onclick = () => {
        if (!confirm(
          "FACTORY RESET\n\nThis will delete ALL your data:\n• Blocked users list\n• Trusted users list\n• Keywords list\n• All requests\n• All notes\n• Seen commenters\n• Custom tags\n• All settings\n\nBackup history will be preserved for recovery.\n\nAre you sure you want to continue?"
        )) {
          return;
        }
        const wantsBackup = confirm(
          "Would you like to download a backup before resetting?\n\nClick OK to download backup\nClick Cancel to skip"
        );
        if (wantsBackup) {
          exportFullBackup();
          setTimeout(() => {
            if (confirm("Backup download started.\n\nProceed with factory reset now?")) {
              performFactoryReset();
            }
          }, 500);
        } else {
          if (confirm("Final confirmation: Delete all data without backup?")) {
            performFactoryReset();
          }
        }
      };
    }
  }
  function setupSearchFilterHandlers() {
    let activeBlockTags = [];
    let activeTrustTags = [];
    const searchBlockInput = document.getElementById("xcbSearchBlock");
    if (searchBlockInput) {
      searchBlockInput.oninput = () => {
        const query = searchBlockInput.value.toLowerCase().trim();
        filterList("xcbBlockList", query, activeBlockTags);
      };
    }
    const searchTrustInput = document.getElementById("xcbSearchTrust");
    if (searchTrustInput) {
      searchTrustInput.oninput = () => {
        const query = searchTrustInput.value.toLowerCase().trim();
        filterList("xcbTrustList", query, activeTrustTags);
      };
    }
    document.querySelectorAll("#xcbBlockTagFilters .xcb-filter-tag").forEach((tag) => {
      tag.onclick = () => {
        const tagName = tag.dataset.tag;
        if (!tagName) return;
        tag.classList.toggle("active");
        if (tag.classList.contains("active")) {
          if (!activeBlockTags.includes(tagName)) {
            activeBlockTags.push(tagName);
          }
        } else {
          activeBlockTags = activeBlockTags.filter((t) => t !== tagName);
        }
        updateClearButton("xcbClearBlockFilters", activeBlockTags.length > 0);
        const query = searchBlockInput ? searchBlockInput.value.toLowerCase().trim() : "";
        filterList("xcbBlockList", query, activeBlockTags);
      };
    });
    const clearBlockFiltersBtn = document.getElementById("xcbClearBlockFilters");
    if (clearBlockFiltersBtn) {
      clearBlockFiltersBtn.onclick = () => {
        activeBlockTags = [];
        document.querySelectorAll("#xcbBlockTagFilters .xcb-filter-tag.active").forEach((t) => t.classList.remove("active"));
        updateClearButton("xcbClearBlockFilters", false);
        const query = searchBlockInput ? searchBlockInput.value.toLowerCase().trim() : "";
        filterList("xcbBlockList", query, activeBlockTags);
      };
    }
    document.querySelectorAll("#xcbTrustTagFilters .xcb-filter-tag").forEach((tag) => {
      tag.onclick = () => {
        const tagName = tag.dataset.tag;
        if (!tagName) return;
        tag.classList.toggle("active");
        if (tag.classList.contains("active")) {
          if (!activeTrustTags.includes(tagName)) {
            activeTrustTags.push(tagName);
          }
        } else {
          activeTrustTags = activeTrustTags.filter((t) => t !== tagName);
        }
        updateClearButton("xcbClearTrustFilters", activeTrustTags.length > 0);
        const query = searchTrustInput ? searchTrustInput.value.toLowerCase().trim() : "";
        filterList("xcbTrustList", query, activeTrustTags);
      };
    });
    const clearTrustFiltersBtn = document.getElementById("xcbClearTrustFilters");
    if (clearTrustFiltersBtn) {
      clearTrustFiltersBtn.onclick = () => {
        activeTrustTags = [];
        document.querySelectorAll("#xcbTrustTagFilters .xcb-filter-tag.active").forEach((t) => t.classList.remove("active"));
        updateClearButton("xcbClearTrustFilters", false);
        const query = searchTrustInput ? searchTrustInput.value.toLowerCase().trim() : "";
        filterList("xcbTrustList", query, activeTrustTags);
      };
    }
  }
  function setupWhitelistHandlers(refreshPanel) {
    const addWhitelistBtn = document.getElementById("xcbAddWhitelistUser");
    if (addWhitelistBtn) {
      addWhitelistBtn.onclick = () => {
        var _a;
        const input = document.getElementById("xcbNewWhitelistUser");
        const username = ((_a = input == null ? void 0 : input.value) == null ? void 0 : _a.trim()) || "";
        if (!username) {
          alert("Please enter a username.");
          return;
        }
        if (addToPermanentWhitelist(username)) {
          refreshPanel("settings");
        } else {
          alert("User is already in the whitelist.");
        }
      };
    }
    const newWhitelistInput = document.getElementById("xcbNewWhitelistUser");
    if (newWhitelistInput) {
      newWhitelistInput.onkeypress = (e) => {
        if (e.key === "Enter") {
          addWhitelistBtn == null ? void 0 : addWhitelistBtn.click();
        }
      };
    }
    document.querySelectorAll(".xcb-whitelist-remove").forEach((btn) => {
      btn.onclick = () => {
        const username = btn.dataset.user;
        if (!username) return;
        const overlay = document.createElement("div");
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100100; display: flex; align-items: center; justify-content: center;";
        const dialog = document.createElement("div");
        dialog.style.cssText = "background: var(--xcb-panel-bg, #1a1a2e); border: 2px solid #6366f1; border-radius: 12px; padding: 20px; max-width: 400px; color: var(--xcb-panel-text, #e0e0e0); box-shadow: 0 10px 40px rgba(0,0,0,0.5);";
        dialog.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #6366f1;"><i class="ph-bold ph-shield-check"></i> Remove from Whitelist</h3>
        <p style="margin: 0 0 15px 0; color: var(--xcb-panel-text-secondary, #aaa);">
          Remove <strong style="color: #6366f1;">${username}</strong> from the permanent whitelist?
        </p>
        <p style="margin: 0 0 15px 0; font-size: 13px; color: var(--xcb-panel-text-muted, #888);">What would you like to do with this user?</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="xcbWlRemoveNeutral" style="padding: 10px; background: var(--xcb-panel-secondary-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-panel-text, #e0e0e0); border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
            <i class="ph-bold ph-user" style="color: #888;"></i> Return to Neutral <span style="color: #888; font-size: 11px;">(default state)</span>
          </button>
          <button id="xcbWlMoveToBlock" style="padding: 10px; background: ${HIGHLIGHT_COLOR}20; border: 1px solid ${HIGHLIGHT_COLOR}; color: ${HIGHLIGHT_COLOR}; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
            <i class="ph-bold ph-prohibit"></i> Move to Block List
          </button>
          <button id="xcbWlMoveToTrust" style="padding: 10px; background: ${TRUSTED_COLOR}20; border: 1px solid ${TRUSTED_COLOR}; color: ${TRUSTED_COLOR}; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
            <i class="ph-bold ph-check-circle"></i> Move to Trust List
          </button>
          <button id="xcbWlCancel" style="padding: 10px; background: transparent; border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-panel-text-muted, #888); border-radius: 6px; cursor: pointer; font-size: 13px; margin-top: 5px;">
            Cancel
          </button>
        </div>
      `;
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        const closeDialog = () => overlay.remove();
        overlay.onclick = (e) => {
          if (e.target === overlay) closeDialog();
        };
        dialog.querySelector("#xcbWlCancel").onclick = closeDialog;
        dialog.querySelector("#xcbWlRemoveNeutral").onclick = () => {
          removeFromPermanentWhitelist(username);
          closeDialog();
          refreshPanel("settings");
        };
        dialog.querySelector("#xcbWlMoveToBlock").onclick = () => {
          removeFromPermanentWhitelist(username);
          addToBlocklist(username, "Removed from whitelist", "soft");
          closeDialog();
          refreshPanel("settings");
        };
        dialog.querySelector("#xcbWlMoveToTrust").onclick = () => {
          removeFromPermanentWhitelist(username);
          addToTrustedlist(username, "Removed from whitelist");
          closeDialog();
          refreshPanel("settings");
        };
      };
    });
  }
  function setupHelpToggleHandlers() {
    const helpSettings = getSettings();
    const isNewUser = helpSettings.setupCompletedAt !== null && helpSettings.showHelpByDefault && !helpSettings.guidedTourCompleted;
    ["Block", "Trust", "Keyword"].forEach((tab) => {
      const btn = document.getElementById(`xcb${tab}Help`);
      const box = document.getElementById(`xcb${tab}HelpBox`);
      if (btn && box) {
        if (isNewUser) {
          box.style.display = "block";
          btn.textContent = "✕ Hide Help";
        }
        btn.onclick = () => {
          box.style.display = box.style.display === "none" ? "block" : "none";
          btn.textContent = box.style.display === "none" ? "? Help" : "✕ Hide Help";
        };
      }
    });
    const requestsHelpBox = document.getElementById("xcbRequestsHelpBox");
    const requestsHelpBtn2 = document.getElementById("xcbRequestsHelp");
    if (requestsHelpBox && requestsHelpBtn2 && isNewUser) {
      requestsHelpBox.style.display = "block";
      requestsHelpBtn2.textContent = "✕ Hide Help";
    }
  }
  function setupEditNoteHandlers(panel, refreshPanel, formatDate) {
    panel.querySelectorAll(".xcb-edit-btn").forEach((btn) => {
      if (btn.id === "xcbRevertChanges") return;
      btn.onclick = () => {
        const username = btn.dataset.user;
        const listType = btn.dataset.list;
        if (!username || !listType) return;
        const li = btn.closest("li");
        if (!li) return;
        const noteDiv = li.querySelector(".xcb-user-note");
        let currentNote = "";
        if (listType === "block") {
          const user = getBlockedUser(username);
          currentNote = (user == null ? void 0 : user.note) || "";
        } else {
          const user = getTrustedUser(username);
          currentNote = (user == null ? void 0 : user.note) || "";
        }
        if (li.querySelector(".xcb-note-input")) {
          return;
        }
        const editContainer = document.createElement("div");
        editContainer.style.width = "100%";
        editContainer.style.marginTop = "5px";
        let currentLevel = "hard";
        let currentExpiry = null;
        if (listType === "block") {
          const blockedUser = getBlockedUser(username);
          currentLevel = (blockedUser == null ? void 0 : blockedUser.level) || "hard";
          currentExpiry = (blockedUser == null ? void 0 : blockedUser.expiry) || null;
        }
        const customReasonsEdit = getCustomReasons();
        const builtInBlockEditHtml = BLOCK_REASON_PRESETS.map(
          (reason) => `<span class="xcb-reason-preset xcb-edit-reason" data-reason="${reason}">${reason}</span>`
        ).join("");
        const customEditHtml = customReasonsEdit.map((r) => `<span class="xcb-reason-preset xcb-edit-reason" data-reason="${r.name}" style="border-color:${r.color};">${r.name}</span>`).join("");
        const builtInTrustEditHtml = TRUST_REASON_PRESETS.map(
          (reason) => `<span class="xcb-reason-preset xcb-edit-reason" data-reason="${reason}" style="border-color:${TRUSTED_COLOR};">${reason}</span>`
        ).join("");
        let presetsHtml = "";
        if (listType === "block") {
          presetsHtml = `
          <div class="xcb-reason-presets" style="border-top: none; padding-top: 0; margin-top: 5px; margin-bottom: 8px;">
            <span style="font-size:10px;color:#666;width:100%;margin-bottom:3px;">Quick reasons:</span>
            ${builtInBlockEditHtml}${customEditHtml}
          </div>
          <div style="display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; align-items: center;">
            <div>
              <span style="font-size:10px;color:#666;">Type:</span>
              <select id="xcbEditLevel" class="xcb-size-select" style="margin-left: 5px;">
                <option value="hard" ${currentLevel === "hard" ? "selected" : ""}>Hard Block</option>
                <option value="soft" ${currentLevel === "soft" ? "selected" : ""}>Soft Block</option>
              </select>
            </div>
            <div>
              <span style="font-size:10px;color:#666;">Duration:</span>
              <select id="xcbEditDuration" class="xcb-size-select" style="margin-left: 5px;" data-current-expiry="${currentExpiry || ""}">
                ${currentExpiry ? `<option value="keep" selected>Keep current</option>` : ""}
                <option value="" ${!currentExpiry ? "selected" : ""}>Permanent</option>
                <option value="1">1 Day (from now)</option>
                <option value="7">7 Days (from now)</option>
                <option value="30">30 Days (from now)</option>
              </select>
            </div>
            ${currentExpiry ? `<span style="font-size:10px;color:#f59e0b;">Expires: ${formatDate(currentExpiry, true)}</span>` : ""}
          </div>
        `;
        } else if (listType === "trust") {
          presetsHtml = `
          <div class="xcb-reason-presets" style="border-top: none; padding-top: 0; margin-top: 5px; margin-bottom: 8px;">
            <span style="font-size:10px;color:#666;width:100%;margin-bottom:3px;">Quick tags:</span>
            ${builtInTrustEditHtml}${customEditHtml}
          </div>
        `;
        }
        editContainer.innerHTML = `
        <input type="text" class="xcb-note-input" value="${currentNote}" placeholder="Tags separated by commas (e.g., Spammer, Troll)">
        <span style="font-size:9px;color:#555;display:block;margin:3px 0;">Click tags to add, or type custom tags separated by commas</span>
        <span style="font-size:9px;color:#888;display:block;margin-bottom:5px;"><i class="ph-bold ph-note-pencil"></i> Only first 2 tags (max 25 chars) shown next to usernames</span>
        ${presetsHtml}
        <button class="xcb-save-note-btn">Save Changes</button>
        <button class="xcb-cancel-edit-btn" style="margin-left: 5px;">Cancel</button>
      `;
        if (noteDiv) noteDiv.style.display = "none";
        const innerDiv = li.querySelector("div");
        if (innerDiv) innerDiv.appendChild(editContainer);
        const input = editContainer.querySelector(".xcb-note-input");
        input.focus();
        editContainer.querySelectorAll(".xcb-edit-reason").forEach((preset) => {
          preset.onclick = () => {
            const tag = preset.dataset.reason;
            if (!tag) return;
            const currentTags = input.value.split(/[,;]+/).map((t) => t.trim()).filter((t) => t);
            if (!currentTags.includes(tag)) {
              currentTags.push(tag);
              input.value = currentTags.join(", ");
              preset.style.borderColor = HIGHLIGHT_COLOR;
              preset.style.color = "#fff";
            } else {
              input.value = currentTags.filter((t) => t !== tag).join(", ");
              preset.style.borderColor = "#555";
              preset.style.color = "#aaa";
            }
          };
        });
        const saveBtn = editContainer.querySelector(".xcb-save-note-btn");
        if (saveBtn) {
          saveBtn.onclick = () => {
            var _a;
            const newNote = input.value.trim();
            if (listType === "block") {
              const newLevel = ((_a = document.getElementById("xcbEditLevel")) == null ? void 0 : _a.value) || "hard";
              const durationSelect = document.getElementById("xcbEditDuration");
              const durationValue = durationSelect == null ? void 0 : durationSelect.value;
              const savedExpiry = durationSelect == null ? void 0 : durationSelect.dataset.currentExpiry;
              let newExpiry = null;
              if (durationValue === "keep" && savedExpiry) {
                newExpiry = parseInt(savedExpiry);
              } else if (durationValue && durationValue !== "keep") {
                newExpiry = Date.now() + parseInt(durationValue) * 24 * 60 * 60 * 1e3;
              }
              updateBlockedUser(username, {
                note: newNote,
                level: newLevel,
                expiry: newExpiry
              });
            } else {
              const list = getTrustedlist();
              const key = username.toLowerCase().trim();
              if (list[key]) {
                list[key].note = newNote;
                saveTrustedlist(list);
              }
            }
            refreshPanel(listType);
          };
        }
        const cancelBtn = editContainer.querySelector(".xcb-cancel-edit-btn");
        if (cancelBtn) {
          cancelBtn.onclick = () => {
            editContainer.remove();
            if (noteDiv) noteDiv.style.display = "block";
          };
        }
        input.onkeypress = (e) => {
          if (e.key === "Enter") {
            saveBtn == null ? void 0 : saveBtn.click();
          }
        };
      };
    });
  }
  function setupEnterKeyHandlers() {
    ["xcbNewBlockUser", "xcbNewTrustUser", "xcbNewKeyword"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.onkeypress = (e) => {
          var _a;
          if (e.key === "Enter") {
            const btnId = id.replace("New", "Add").replace("User", "User").replace("Keyword", "Keyword");
            (_a = document.getElementById(btnId)) == null ? void 0 : _a.click();
          }
        };
      }
    });
  }
  const mankeyDoodlePfp = "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAATSwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAHgAAAB4AAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAABNTbWRhdBIACgkYGbv3YICGg0IyuyYQ0ACCCCFA2ADTjpvWtd3OZcDYjtURxo0z7U+fBLkqDet26ZFFfcCPSUnU3WZOzZPDijczbbl8Y+YCkabwxiRBnUnLGVErPvuFMQDug/H6+OknMWzTOt58s/gsFBWclZmdVtqzhi2zx2QQFp4SqUWeg+xoDVf2QNwLNb3s75zWmgzzX0hO++pXjcZRZ4TsnjINIGhW4XrWDaFBS8Huv6LBqVKB0qRfe6kDvlG+5s2Qi2ozeHkjrEYBB3kYug0MUndutrZU0od1jaiu+M4on/E/iaQdbXxw6czeGN08g3wZFh4kzPCTjGxslCq7u0izwOswSXfPdtdyJzzQ7Bfg+kAYIstLVLAIg+VOBbdZQHTIgpHknslNXYvrx9/Ae95zqW+XUBsOturqr+qGEBDZM7DAUWZsDdrnrgUV8kKqB7zr9oITNA9x+TzvHJAR9HYWSWKMkuiphEO5Usx+cYPRwCvHbDZ8gIYBGxxVTZdmky12LDprJA58pDHV7XmchV+Z2UwxAXWRox1IQbuwJvnaTwAMOfcMKwBTxcVoxJkRoVyVpfQ6+CkdptyF/zCtFq2X4i7qCfS9WZOztPVpwmoJPfMUcQJqTOk4/vELbjLCMEZbXXwLYazMQ43fAfqpXMt/NQeRLjWiTuo3fFYDNmuN6kk3g3AVRg6WdFjQlYF1LxA6hF0rNChKJZst6+uJXUNddVGQeeNRhBJWq2ZKNvPP3fpIyhrK1BdY7O1Z2NmkIRxSfsYDmOEWkVeTN2j2mt0kZq+TZqtgX4vCSZyc6Fh5cpu9RGav/o48QGXWX1GmUBaaUiX3kmLkUQ9/TdKOsHkvHAc2cIjtg3G7hQLpHH7hE3M9bS5whniAUOvBUgVAX3auedeTZYY4xQzwNegAwQFr+gn4Lp5SBs0erTFwMM7rhmgCEZgJjFMCIbcP6RCU1aiiapySKLVeCxz+TJe8yvu9W18LnFLlMhry+2qo8KTlF2Spd5Vm86ijckN3MIgAiZUGuKE2kb1xMHPMoG5YS7y99miyUIXcnUlw+HB9asNV8qeU/qT4wc4rrOxn6VKkie8C/YqLgIrMJjphlKdU252DwFjXKWjmezqHUhE6khfotENHXM6iyHZ7Oj2wxHkHUobHJDojzyenHzEJJOv0kvatmDkndA5ShH7zMDjJVpN0CCOJFT4zR7D+OvxPFv56XWSQlAYl1fwFxWnu34s3cemx0P+HB+bVB7invo5ghKVtTUZFya22MlJT3FJXdN/ojvEI5kC4fojXJdYRIHD/37bZjWAug3clcM8x08npYa2jyoTu2CUYYXnrk1dTvWLtLycX9HSPM4ChrADCst/IDOn3Y//3TLFmM0/BM12YdhDfqruZO/KD5jpGPlXGmn86Bnw3RTHpLPkRPKRJqnMNCn2/8ihL/VCdzgWh3IfuiVU37iL/PCChnSYqZD1RB6ZvTpAopRAwdx6n1g8PELnj8QrZr6JgEksrDFA6xX9XtSiJ9yhi0N691GMcAEQPbuqIXZBIwCvcXowLB6rZGEQitm83wrVzOeCaE8el73TufVoQzU68AJd02JEutIeNInbDpFj93bFKAyiotyiDwAmPjzJtDdbaYVC8u0BYgLYEj+wwlMfZ4IFtBDglGnpBOGm4wSQuJAbfCdb4CXY0R6wdcSajMKJSzcIx7vjnEa/Ku+7vFNH8qRnJJVYVG6QmVyuzfrfMPfyFxZq6LScUoEqvyh5Z6rTDm3BAA6koOoZ940/ee4kBmezD3KE+syo2l1NCeGE1JeM0r3WVOU2+lauZhqK1PoeZ22wtALpS5k1R+NQu9/5SCZVkpJFOQ+Uo1SIWh+hv4e/h+72YI8EDuqVm91bf+nlRn20kWjnBRfq2wuEPZV+Kz8nBpQ0qpVFtvXzDixLBcOANr96djkK1iyqXd0eiwopn5holTZ766aJRrJra01qSlz1OQsZX3rx+sbD8U+rMF1dshJ3F9RdYgeONiXkw1e4NdUfLkeZ3inP4seaR/TCJxheh+9Hqnm4/cJZV+CzDCbjal32khR0vVXvxmvpzXBwQTbJXToq5eZVXZ+efClwalt8XYAqVZqBV9YnQSAL+WIRhRUDHd6imh719ioca5YRs5Wfyxhugmu9FpU+v//qFe8HdNmG7L2hcdMOQAO5HTb5bwdgbZyogkGS/K65rRui7oAzHRA0GS5SWC4SXcsubP31N7gHSG5VfuuVXEsZok5noBvXmVbrvINfcFysgtiB4WiNdf70LCxSBExt6vbhZnf10mzYwDqGNl4b1jr3RITcWhzPZg+MieFs1gGH2GvCfuYW/0Y7ZhZ9mHMofTe8AGETUfKcBl+RKj4317COcx48IRUaesLTUolewGdoyWAkTHxucn4EoUEUDGzeL1rGpPe3Kp6+JLIzTo/z03ReyIi5+lpsN3EvBYOnud4wtjF6wBqWGsZFJ87979I8N2X6tdAGNR2jh/u4z0/CN5CwBRuCztAcBBQX8Cykb8xUjfszmGCnxMBPG27s5bqO91LS/+Ye5c5oEyjtUCM3j/xGfBfJF0N4VR11K/YMlskYiYnZcqAeS3x4H9IIdBI6p746l1oodi8CSWvNgzXoz+EIcTBnX4EoXq9aoAHF6yqZxQMpZxCsoPUXBlHysIsZvauPMLxalG3dDwzMb2zt9IxMYXVKSCBsBPbe6PjGXFbZUDhz7e0jL8IOXpGXyzDBm/8lUceIUqsboVaYQdQMvPlsy7uhLV4gMv5zcUSvagLxjYVDlyVtlgexf1/Rtb/ZFBQgZJuekMAA4Sw1dBpuZ81NGhseEmuVyGcIh2GW8DPCU7vJVysoN7/oVruvg6efaTg/cmEk2PNXa92VTQeqvl2YxpNq1r8cXLmyhbg6DT+tvQi05BzqVugRUAZUwgmG4CfCcxowqpkM/EXz4zkh+ATeBHMArrMXjuPYOXjdnxBEDz2vPHPbqlETqwyX2T7J4cD0BkFUrfxH7G1AydPE8fYRB9+0CvuHNCiyaj7vWkPLqpU+KdeJCwiXmpYEHjcsVNl4MxuQhp27LoSiEYhW+cMUIemyp7iWbNxAIu2fUSFzEUUziiJWpnS2e5pIlO5vc9MdRJxUp+FScefJJr1jRHbHj7nhJdUx1yMk6GEmuVnb/FJoD903SUkIukRO2sfKxgiXBmex/S7oV7RCMq6bI9r5vHYvQBpThvBeY1e/cP76F/ByEfLP4IjFbW6350mrW9oHKKk/XDfw5A7+GA/N2f4n53oqpCFkN9sqvrrllqhnAkVlkkrL9onr8JV4ZuNwFF3qgKQVqJx3TBLLFckeDDZc7vaNo3qaD6B4n/iaqTERzsl7MfN9FoKvMhA5gmo1b/WQc7ieanSwftJl5Dokq8rH4J3UKJ4wPqiev7BemAhqoaGx9kuB+jP7njuyquKk5zdt4atniQMv+EWIFlhN44NchE0E4oRBxLzGPqRNMyftQ3ryNbwtz1H4labpYmgFzIcndV62QMUbuz5CgE203ibV3yHOrxZ4XjAnNLNCkbio1Ym1TYxmf9ljVpqaQBJILl46ridIc8Uhe2PbxWyXcY27XhLnNyir15R2YECUDA+q1C2PpY6oLqeRD7MrKfDdHZj/DnOjhZH9/l21xqgddp+m12k6OeP6PBmMF4wA62qLsc+4+hgdkCJBzhrk3SihtbL7YWSsVhVgRdsUYrNKHW4mwQOG3WXcNGyYgb19NAnaLSJ737RERUzPt0I+HKED5ZVEjsKYdvqpHFb5gKFUXbqefyhaAERliAKOfUH8QLvfwPy6ug2NrqMzuJkMdxPYfYsTVymoZM+f9FIPnhoGp0BzTMjqU5AdqMH+DH38axliuuueJPpsHwDaaNzrQvQ/7nKoCRuPBRWl2DoXRit+x39Tmb2kJw+yeK5NBxybHW5rOoGgp9PRAkxUk2+oUAnUj6+pplRZAY39Q3ZFsxg+sFAL0FQlsbpkUqVhXBsqeuKdk1/d2Hty6idXMN/vsJ/r6EShCF6owOq4yok0kLT0+xx1mzTzE9mE1wbrcmRc33N5wm9aK9yxOfNUnW5xrkJCLvh8/vnRemHvdxN9xAcEjfBTV5rEQDsj5aGLyluDjqxB9lzyJBwF9/WPlHZzUvpuc4Fmk/uqf6MSgvZHIgaUhiGb/FFFS9Ge0SAec4w8Hj6M19HB28edOFwXuRnylYVWvHyPcYzMaeMUtUdRhSXFBI9ceteJxv/k8+LpXLTV25WQjufbARL+2H4P2Cl0GzzeecEwPQBkpsPYuPte2U6/Yl5h+RSfPN1hmYDM0ld8auicBNg+lLibA5GDE7NKWnm673kLIY8b5rCLI+26rXCkvl3cIRld+B3KPkmVa+rmcP6Vx5m+WyJgb4W6fFIUwSROacescL+Gisn//I96iiTkxeIB/TM8Snxf1uF4SSoDptCR39Uz+q57U32N4Qmsj97FsdoglFfsi2JA12yRKFrKibEZrXWCEwbqibB595eiXI/n7dawW8nPAPEcm9r2I6b3vg3dCCXAZBeEIFuvPCYpFh8K15cLoxFGN06W2Lyi553YHqd6rq/Go/UMQyFmFIO90px84RsWA1rsgA9Y8DgQhKPe31C2FdG5d3ORG0zN0CxNVlhRIbAg+1FBm7cC0tFZxuhDFJP5C+FM2Wh1EpKNDB+MypCWJjDxOgJUb50MGDPezieblZY2Q+22ZfLa5rD5c6s9e3rY592tZAHmZ+GYxGdCrwStZqwTd5F4F24bylJ4+7vHHlO+fQKCWkioRegK41LKH1CoyKCHmeKHB5CiSZljDsqpyIchytYtVCHYWhlnCaUFw9NtnmJ54HRRXscZsPR0Col3s4L1cpVSPTocxee4JPsSIn2Z93Lv8Z3RZ03gD+CimLUAlDCu8I57rnaTnECWFdbfRe45QS4GM2zgKaNJ27Y9Gz/6D64SN+hwz9qyuIRtuPwgxAffEd2bNckeV0KZ0mxVQrVTxtUJOPv4kO7DSCVFyrlcR3VVCk9oNaSCwLekzLOMQMYsm/SZuCP3cxXDleGHOad5gSloQJXOR8JJkp2DVo2F+r+aaeg72Hub/M2EP3UlrvCZW67Xwx7s+IgdS5ATbItYHJyn//AtvPAm19GuTzZiCaXVKCpL8Nf4WZHAc6A5WRCTBIhsyev1GiTkGEYPaOpXiUVFBKFcQdidzzP8aKOp/gYjW5iG2F5mH3ZOjsmmH/6RMBIpJy0DAboVJV0jxtGuYamuik5rpw/7t1bwbaVySmbhrYqiHam2ABKokaxnsHbkBKN+DqhBUvPk7pyEI+LoH/TOztUDEFyt9eLosDqaSe0NJlar6WeaCPE1o1IQqAFG7mXcofS0ULVrzQr6dk/S3iAeZBNMvpabkPmrBI+mFIuexKoDZYZhXqwgMbJ6mDcJbzxEXnvzRxhUEyw1BT2qMYXqo0WgtP8GPtOQKB4/ui1L+8pssxC4wbbU5gYbZ+o79+3H/7oM9AdFQZvInFHPoO9bMPzkfx+Dk7yGUMmx6nWxVkFfX2C7Mh7trGOJEBGTrFq2gkT6yYc7OU49rtKb4zkm+ZONDz/RaJ8997RQlmZBzxwiTUN9vswWM+vcv2/pimSOhQ1u7W6uNrt7Cr3SwhWITiXHJe/QxGjHg3HiGD9hD1z2IRPzBzkn/FMI4UEWqQg3aNXk4oG5UdNx5mSn5HJH/vdpA2qUYvxXt499S2UsGufITRXLkpkPThdqEBSEXZ0KaUukM3j0kwkHUmDNia+tUyzlPIfe9tx9+aV5o7iRQo61g3ms6CMefKHmUCCIfAviZwZa3+s17MJjSyojFaJlkS6KyImV3eYFYGOvTCLWug04/LjuK4tEPokeYR5ZXG2iTMbGX+uRFr43R8Xc0HnLMeeWAmN8xohMo0pndtWZwEH15MnL650wjXzbks0DeU1+iBDij+ep0nd7j38lYkzHyiK7li9t7bb7wdWliYt98R1fx+NTD99I4sANqnaPo7A7g7s9KMYVvHvJ3OygihXt2mhwfPBDf7FUtX8xs3RhoGkAdnURPi8tUJPkPNylM2Gn5jl7HcDXm8h/bopFbYUyokQ+Myqf4XH8oD9O20vpIjv/lT5zm3jOi3Zf5lsbur7/+DDzFSjoSsyGR4lRBfW+d9HAybpMYCX5StCKHwZvi92fH8mKBJrG3pmJ4XiJXMzy2y5nlhhdngge3gYvuEHHjagPji5VoZv6NkN0iFgS3/iAyF3kd5M1GyESJItgVXf96rD+iXll6YTGYFliXH9tDg75UGBCVz/anBuuP47MVPmILS9pc6CLn192tKRhrtio+TJR+R1/PlvZlY7pblxdjYiGglTFSWtlv/knEotJeiFKv5WpmmOSXqoB1FArZuJzNuwl/6Ynyse96QKS0EzZYz0tyhdcMtkTCmZBTCCzRIycGZOWPn2fv/a2NjZz/KA+guSJ9rjb3BJlg6jhvr69QLQ5pLAcjV4JzbnG04iV+/0dDeccWX+JBhRo9rW8PdPtAtu/dujFLttfiVjprm/2vAouDEYmwAKhsv0bdvXjF+FV+5J03xhPl06sVIoOYcF+UX+nKbBSL2W5MVNSDg+QBfuA=";
  const uncleSamurottPfp = "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAAc8AAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAHgAAAB4AAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAABz4bWRhdBIACgkYGbv3YICGg0Iy4DkQ0ACCCCFA3UM3FMKFt+vMAgxqG1ysiVoLOUR0hTJe+Wuk8wS2ya6HAWlwbPVPD8LVT4l4xXRYlaxuYBFjP81p9up+R2wEsLCYzChx1WkgDLlW8kkb8R+NmK7pZ3CImhzKPYpW45RRf1x0xo7C71FCBaDWob7QZ0B34Rak8bLjSjd4BYit8qncdB4Kf9ErngbmCdk7H6nTHKbye5Hibmg6pdmrY0XbQVi91Cx6v2ZfOAJCW9RLZNYj9rCSJU62TY3M4uiAA+Cxn8stG8LUDaoGwv9eyvgTG9qiziHiz0TR3dloeQUPYN1M7FYzCbAmnhSSoR6qY2udtgNcv6AZJieJMMP+BTaQEOSrxCIXSHlAp3AMYTn179NJ5uTbkHiHcZRy5cFOpoyeQQKgntmyn6c+KgeGh5FLjTcJRstzenMFZGtg2943EDmoD0uBfsJ/Zeu80vsF2syXYsc+5+4GvDTFdJx0FJMtvCQoB1RGZzoXdDUUtMXet80fkset8NtvwJBd8ffZBzZAOzO3I9Vscsx71UZinU6yrqR1LIFx49D3jOXaoWM/pK4gFzP8XjAESSUjBJaKf3MO0jTsL2Opa8ZtOZEst79d35znaDZn2P+CxCSLrYLG/U893kGvX4mxuAGh6CqepwlwVztGAlhL8NP30BBbwCfrSm2lxa6o/zd6J0wKcXsgwZznxGjrPOtX5i2pMb8lh8TZYJC3gQjxjhFaD/y6c42fXUrIXP2dbOKwE/ujND2UbYAKCehsBt05rMJFgEkBIllRpRQHpyc9tepmWGyABrxdcH6wbLzYu4kr5v29+MMcaOS21PlwC9Fx9WW7onSUM+hBjdEqpCgp7d+WZcUVeZ8z4HFpTJpJkUvofoSaTsT/1xjCPHYAlgYj3m4HdSDWR9CXyOEAeK1qkMyascaAp0DQgxP3oHNabkshgmwCbP4xekCtIe8h36UFPiRLX5s7PyO8Zxt6iQw3jfZrAA3cbKk9+z3ZNSXrG+RwbpZzifrgy6Na9tiMXDZedmi8E0JL/bW3/KdcWMoM/zDZPl+3rudQw41Voa1/RwSmcUD7efvYB+dhKKnPEqzH8rGFswc8EePkomqEf7cstGPijnolla+H3xZyHGaLapkoz46yH0JbAgLFye5+AyxpuBeW5cE4EOpmf4FcKqAowJ8xQ30Ubeuox1pW7DQ+nAySQVvCOeXDsO604yQjT+JrbJnh+rEBMynclEpXsompri4OB0bDRO4qWQzwcKm/dQvknY2gNdMA2JG3yUCxVsFITDT6yHWRpXYkAHkiGTnu7Z7agv+f+m4hPqEBmmeOYs7x33sQIByKZEKKj2oYtzuJSOz8SXNxcapkjpVoB4RK+EcV53sYkhmwK8ERDDkgBkKHt7TQItnt8WlccqiR5EkTPsNpsf+54xVgO+b8Vi9+58t8fRdqu4NO7gzihJDgJQaz7LZYOagyJ6PgqNTGo8kvRNXHP44ODYNz7pmPNJkY42OyJn1Y785DuNEmsDUNMBNVlZqC0SNhsa1y9kTmvIjH7PTEpwysobIWtveajo4pfOL+0vQ1StZS31gWRCKXoAkzvJEcoLGDJTYGaJUvENIHhWe6wQTtpS4XkFoXswlxpolqroA8y2Pa+HRa1FJj8RFe0roT66Ad4JI6ohSQXmDmzfb6jZHsprsFoGyAubysps4Vgafyn+Evp+7IWaqh1pPDJDXimvb5sY97iaqjxGloQXYDR/PzRUf5484bW89y+Vu51w2s/uDBG3RSbQZTfvlX2ze2Be254xM2G1Vu7Be0g/5DIK0HHILJYQWPi1SZ+WvgWGX8s9d5yFw+jYUnlZ3yoIEVkoenGrUsKLCSgF401O5I7Oaaw+MaN1ZlVVQVF5qTlQjACu0d4gXgkjAtuLo7YHa/Ithyp9IkyZgII1IS16vl1zGNNqthDGnAUXkFAOkA7BtkX5pvMtiUV6wIwYQnI0Lcrsc3CHTTnM1yiqs3YTg0WDpkzej6k1XeZWa80HuKnYtqBBSXg1Mf/cr0WQm6FNH3/x6zYJjyzy8kzy7ug3vuf6VLHvr6G1mNSdOcMqVVsKVc6cc3nQC1sm6tzzF8UDOzWiehm+RpiwiBD/BuwbSTDCeiem8ag18lIcqYQHTtDGijAudp1Bt2q7uZOP0e1GmvaVrfwmdOk2rLaQkKehXuG30RTppCN/ZXTYER2rU4JgD3vLiqCoDfHoW/qKbpOrSAr0SWuEscqmssG9TSXP3q6pIyVystuOGkwaIDzIsNBwPmO+89sKnoTuRdOaelwxHpIEL97f8j6ox+IoKC2hZh72hJ3EbVhpjGfZGGLj1QOGPMVmx+58+WG6t9Je0Zp4vwF7d/Lh3Kq4RIWZ5MonqmPp4Sp1TaH+vjeqRxDTBPj/QphZaEN3K46ISY3WrKWlJd6X+55szC7NRTO/FCkKyajiVmO9dqwWdnbQnAGNt7HALGePczb3EVdd4d2gv1C/9h0RKMR0azYokux3nJ3AwCAz6wrFFpwGeEPxZeaGPGHg78UUkZQe7pEJYgStXnYZAUl6QOQJAIPK+aPeadt/wDCAxDYpRK8s7ypNP7Dqh8Z3xhfYW+uPhZTbaSgXVg98oTSQg/5cCUU+8oJrFIDlJ0NuC3BcAhJQ7thIbM8iUj5JSe9m2tUVhgUoBvcJANNBsPXPnMHOwcfKR+YSGAi4VRxKQdjr/5Jx69csCwyPO5F7GZPPZ0yG1o0ryJuPGSlqRROCmlCjwLnAXG6rEtY0IMbqxhvDh1Gdl0jl5r+SVzMQDSyG/pZfUZmngiqkjlWTF9kvBP78gzU667Ji5pg5VaqX9H7vVefEr1m2BeJWmHAJSxoJ4XU+FPsFamAaPk4QI0+PPqutSuJxZaguEWJr+MoZn21hvzDBAIaPLyHUnmrNuA1UouAzcMBl8zzFtwCMMXA1wx6wWAn4DUWvx/1K4iBk5Ypq92hqjEqynpGJ/amtzV44xqcFxbOYxLei+ukCOxWW8cYdJgL2LrfFPhRTucoCbuJcoyCotD/g2kxeE6t/Ow1NImHJbEPdgDXgj5JXEyfsBoHfBlrQKbfp+R9tMZWI2l4yD6QRMamznrD2mbN5HUY9gIiZmRijaBXIcUuKvKsH7T59J31NdVyZ+QdtzTmL90BuaI2YGz38FsllK0HP+SsO5OhwngrWDyI2YzR53kXC9ooZFQeq4TcCMRaVeVhywQbLa60VfStja31mL6QORrKTDTwU6/rZhw+Yvhvpimt56y+EaUn81gi5ZoRzyGa/2J2VOQsOYjp6jxboF+iRH6Ydc7pak46vJdx/UBnd0DlZA5xZTK+ADQGIi7pp/H9hX642X4kjZOa13J9TPRrhoMNp2memSqkZ3G0wxYZtKZRnifSvSZRrJriUsam7Ng8vWhflRyXyu/2+4U7oH4jT25bgGaSaXvnrw3XJCnTklAF9hQlCBLdKId61d+67GcQhPTu3HcW6YcGCVkW+lAgc5FnWbfjUd7i4CjAAhzyiE4vLzRxxuBTHdwMrc4REZUhnPVlr/Jd7A0yMs0EJf/ZwkzDGp8eKK7ZVQvWAZVtUtYnuE7CZ+tk0/7TELNrpAyBZWjCuNelXHO/+CnHkKhuHviMiGUtp0nuii7CJ1MKUwiSRH+HwOAhhIdlbhg5D7jFo78rdOqhxs/x8S3sCYo3dNM1RYBJCU5m5LqgCsTucOfXfBrGEYeltWpEPDbVif5PvH13OOh354iYz2o5ML0+9NlbEMGWxG9YmPuOXMqlkfCoSHu28pzbh4HbDulTmoHDDWdf3OV8x3b610xce2TYZ890/eG4NuOwVEgu5eCsF2MU9Mu2M7kl60i4TrVNOPECRiaB2Xo9STDnVzm7OiI/Ao87tAv3Wq6tk/uwjhFwZKSZdUKeICcEGsh5/sI1Xul6K2RzqeUUxVtJkGQZvZTScKFxv5xMW1QC8jYcxo8YaU4K8cjwaxoXeKRqhZWmkgh8MsSvfuiiv3PgxyxzPKY5MJovox1UsFKmCqnNXjLRu//JEH+2SRMX3UnHAqhZkBZNun76fXC7qALeBYtfEazD88qPwOf1rxLxJNXj09RTYMQtNnXj+MNyJX0sDE9BnjUiKfRdQRgQbEGtgvxLOIqvzLarTQcpfQthZHGcfTIrhTfIliWdZkov4JONXKl7RhEwI/aQZXDTFzP5zm45HWOzAPMelDFGBVMmh7Nm5tgwjtXrUGLpJQnYFdq1Wu716+y/AIwXrnqz56f+r2etwTWUqNkx0BM1ohOpj0qLIlxCey6Ya8bigKNdEojFaPLsYmwR09z2z2dhKSIDXJ0MYdivT/nuGkcoQsDe2u63c2yO5e6LZh2rJ16uXYG1ZWAbSlhgKb4fPojfcrtW6vdaDVpxbMycdqfw0HYawbNYY0ka/4r9/CvsCpB7+qWmOwup6siHqv5R9eQVNs5QV9250iPZluliJWHKn6TEkshUTBFfk/X2XOYm9qAO3yaNrYjxJGqM8YWewHeZZeu65bw6No1hCR7u/QSGCqMv0LVHd2lUjo05O1i2ANkRgT6NMo3gdjdBEqVAtC6a8oFc19/2J71VmVxrvbsCgt+sKaBsRztJ6K5rOTTi/WojptCJ8CsPw853W1XdClndULVxqTh5bDQe0pZa4svQvujEqia/pi5XgGniyDSR+SO3yp6mnpIQzhKafE91pwz01tGbz8omFuv6PtkYS+tBNHD7r80tm3EjKn0ANtxadWZ8ps5HhqfwwTyFaJZ99CfNEDO8NLlG4xsu/uw5jmNB5XOn8ooT5QSyaG0Nf28SE2G+VfGi2AisrJJ8gT9P11KgqX99WUonkes5WcZIMNwDqnuuaeDdqA4IjWDdorrwcJe3yjYns/ryb+ccoIfsYYyzm1nlFG2A6gMyzGKloJnjTvWGxPWgtjPbBFfvvw2ctZPffNaAuX2DPkLxGNw1R1RqPtWfpMlTuMK9cGQUL2NRXGJTTzu5AiARmL+rTthSbavnzJf5vjZshMd3OPZIxZz9gHmHRt6QBAgHNlrg3srkxakiABIgeXfZeKu/ez6XGyuqMXvCX0ojEPEw4oabIUisdXOyXm67pEDV/AmvLWawRiGkKNgFI1syoDihICM4jtAfPcbP5xN/xGbsv2TNNvxCF+F4RnsRAbm6GzqH3E6NVAZFWFWQ0SAidiIHdety1PC2STBdC2E2nBIwX+LbgLrNGKVp0io7t+3MqDM4dN+RCgG/C4HgdZNqm+cu34D5uDuvXRFVs08WyqXlJ+qqlsFBKx60kntSnMU8Jegg6T/FaIBNp31mOR3FqU2TG9sPplDfOLKNCQRuT0Tz15cE4gElUX/hC/1SrqRhpTOrp6etp/2VEuHr8VW/mcCNJcVySy4fzop5Rd/1g2CShRZjICnAnSiZVTfoCBE9bXBQbxRJrOgkvkQLt/TlVK5vNSEgRfuM+a7/TeLRTUDpXEitLJ/0qo3DHfr+Zv+qzY1PxFlEJokmxSFqSmKZ5ViNf88Md4UV1OHxEckZfHj/YmJq2fEA6GeBePMi5EGfEUW2b2AtbX5DwX7a8ajz+MN3jJulPF30EDba6yDCxlpVzCNCfFnrCwd/c+kifspvwQTHBI3ivP4q3GDhtp1C83i5gQ+WjXdCYuDdbNysMUQjJrmzxMf8lCumS2F7RqJ0K4wQfjxrqwedIb40dbaVPlD8pUHYXEnj2ToAcO0evIWUfaeNIzS6k/SWGTqJdOIc0wcT+aO9sqZEhcBhhVTZCIVRQo2Y4wN9pr/8NQUVWZ3Gn12My30UJYH66tGmo1ZaN4EHKXHvdg3wHtcFHgHDzCzZ4L9oDr1RCdJ94CszLOxQ10l0CnxwlYAGP7ZCk7QVlmmtyQf47akOujn9D164auceGAuuCDk1ioQ+ndC69GBw5q9jfJoF1tXNcESZX0D7po1AmA4qBo/U/vTGAq1ZTbVsy7KoIY75TbXpsp/0C2QP90ZuPX3FW3SzCd/HQ5XV2wVhPzwpSBbkiEdPGQJDv4K1ybwqxJQF4xS9joILcf0UdMYOmWSSADCRvk4cZifYv1AuajkhI3wtDFjAAOSESeb+/sY4mT73DzHwtY9rhaLwscg00dZ3lIYU0U+ivFWlHpK3ixqSJj2eAHERFXsRcsrAKSXa5PEVe0R6+DyETkx+8Z6tVTcrcTLbbszRQ0wOxvfgob/rI3ctDqhtt2brKYV3kWg8Ui4p+DH/LcXMKJsyvhoU9Osz6bUU3+HcGgeORuZQSNkhn3XaFCZkuU4j4Cx5tZvHHA+KpR4ssYU9YANOiVxH2BnrrEPPV+hLklJeji1Z6RZ9s1wPPmjLguCUFM58UDB/ozqGl8AawX2nDJBUUfWFIbfO4SqUchVG4RgBgjIDH7DOY1gJ1noREQ8oKplww1VgJ3owtGd2HtlOAF3W6GE9LPXSlWx6VJL0krwv1vnSFh/6rdxGzYrV3CXB7Cpsl8s93An8Bptejkjcy4e5rE9HYgvkSJi5Jem0Q/ZVIEbYrJdVT6kQouHQWHKkixgX+i9myjE9gTrOyLyfZOsLVG/eL3XhO3A0T7yrIihQfuNEk+Umk29iOX2VKPGh4I2jJgV6nMCLU3mWrOSZjr0EQ2fgF8KpJeH9qlRiHAYvsLwVR9tAut1W+sVlDqA8LtPDUeYhwVVVUo3w9jCpDuHlv7uTw5ot7ur/nxhXB2hR5ZGMzvRSXkTIq7muJJ1CeBOPV9K+9bUwUAEYlpjtc6x4areZE70/1Rdl9QGfDyHCf/zntlgU1mMBhYzj32wzTFlavxhcg7Zo5RCwU0/G4RnBnKG7uDbdGWoxJD11T8hRsiynWe+/f2SjWcGZsLAv82TcFDhUTyd9wV9WmkMEOGnV19oZSsCCHWwGqNdnjOc85XhluN3ku5myeiWnUphHngZw6ORdBhY2NpeXhkm8PoEF5LrTXDFCCkz8vFOnAn9U1dNMdHNe6K3Dpbz+L8d9z6ShexhY0kYguyJJ2nQj0evrWyOq6AIo71MxhAMA/1IzKfKrGj+1sSRnbEczwzyqDAAnI58QDbjFUMTglgO7MYSkVdLtq3OGDJxXAo+GuZ8RVAx/8M9+ZKOl8QmBr+5ifxw5sf/la+dwA4uARuG7rPqvQk8k+OEx3tNCJTjMnhdskt8RZmd90slOLaw6s12o1HChuUo/HFMUd8KKBXDBrvKhHGd2p2ylbjiidcLACYv/y4gCGwN0NuDEQ4qPFx8Wt0EQSGwbtWD+iA+WEom62w09uAXCpxgDHjX5/dzDWBqAeWj4e2/yBQgLH1GB4lSmaehj073mPUv5Xx30SlrvP17B0m3nDJrrodQVtJZUaugZ1xYJbg0YbVbGbI9IOvZNmV3TYPNUFM/1xTiaGDANKN6nywRlY4Dtq+UxHdV44rnv/anlhHoKkGYqL/mZTisFlT30MfsKVprK2286fE4ucS/G7MF9zir5XGVKYu2ik5XcogcThqruUEk12S1l3vTBFJ0Awe8WG6t0ZEVpUTihSGKkC40egOMsUzr7F/EkgjUCaLdzoJIfRjS/HypMC5EgoPrQ3JV5wRZDBSgMQVQ/9q4pFH1UtnV7F0NV9055kgCkskquVJKvL7b33u79PN1+zgpOJgnb6LWYD3MzuIdkS4MSe3p1HstTQshpz8tnbzwIRuia9NHZAuV5nFoW93bOPaH0YL8s4+oCcJkgxx1qmXN1pnMABSoSerBFLERIBch8FKrLbRFkVd/bQYhndSRxRfVlMKe5T1nW6ilxjsFU6nDopklFWmwjSkxzHnzDoU6axyQzl3fyk/6RpEdZpdwELkvCO01KVeCyvOrQuzW0mjzGIb5dLa+AoyQRy8DU+xMHY+YUNXYTqvPVoIstO3HUmbe86/rGXO3oJaRBkp8lwM0EMt/6NiCfaZVUXi8sim1Th/Pz0gt28a/+zUATbrFMxur6f6NVsRfsk+/hVNT/ltPSSBIDeM7EyTfJbgt0wUCGELgtc0Cv3Efq/K2il6O5MNWIkqOoxFw+vNp6t5Izw/DJ9PHnjZpMealSPDtOjfQPaInVkV7QKoElKGTUKLN1Ig1v8zf9VsZbqcSLKOIbCf7Nu0LZFCaoY69vSzfwv0mES37E+LGaOB1cpKFk/TpZi2ZpjHInjW8iJMXAweysDB3CMUNgm7YblWKtwOU3bBvNnTUST9CKPEuaU8trVWElDVsm01qoPVdUlhweHXfem/So1QeN0qf1k7+SobN4mAWWWUSMAv5VSku03TohmDwzLMcSYAZJzjNvsXMjHrbEfscrYpUkhAZ43DkkcLUnq5FI38SHEMlug2LvIrB9h+f9qd+QIEqoKz1mP/r8Fdy2i55FO0kge2CzxwqtaLlACJo/Sr4KKiE6JJvLA4eoUftZpkl5rjCBld3WrIWh4aHIHts0L+RjphK4JYDQlZg3toiPA9CmwhovPsW9DKPNgAGWBTQKzTUwPcoEwkTllaHmbsevzMecjEn0wSYGDPLcBA75L7PWCeXbLwtxr3fL386MwmmwwAdISJk2aqTohdYFuQXqYm3V1JK8AWXEg0i3y1wRCOl8i0f+pe7iIoRMqb4Clu9EwHaLkFZW8j06wyIgB8s8I3/z0M/kZhlwvl1Z1ekVHOjTNQmg5PoYjJIL5NsCLXVDquhU9WmWoQOh3yL5DR1ciTTCXAzX/0H24FGM4zCp6FUsaQKyceDGdGeNZU+teJEa/7RlzV9NbvNYiv3MPLE5fL4463564L9/OeBmAXuTZZVi9jX0gdvjw2V29tOABPXc5HYcXQy+IwFC8i7IgR8JsO5nvmVJ/1dAy21I9JmttD/zQlGAMC3ufRuzFZgpPUkFMwg/9OiC5+t/01YPBX6eA6lwMiTjZ8UG2kmVQU8p+hevFNJlIojNjZFiPpJD2xMG1/65Ra/GTxdJn6E7U9IhXbbAFCCFwpuHYjGH8zCeZow6KJqcyYdu5Ea3tPUzfqeAChjmrSgNkP14ZjftyEL16MHUaR+RODFbBeWur1ElenzmEhvPhaMaM96jld40qmBQEnux3gdWd9SMj4doDBMNkXVup/Wbn08MI5+Jhp4jjXJI6NEdAZ/4rGwysMCaDXlDgDSkOhFkKKa+7hKarT9rF9kx3RD1/fz6IbJyGR29AxzXEjRlavcpvSoss6zSE6zYwZPECONUcxYuMessyTYPf+gSaZ1sVv00FVegeYvGVxOPJZ1vQkhM+xGk6v3PFI2wkvOPZiT39v2THlOEaNoPNBpIV3fOn8VPhSrDTJkjdfCiccXoNwQNYQHIcCiBC1nc+3lTGShqoFRegldBczEwwvOpEql8FD4ptaalaL4dxDrXhUfXwaH3QmXJBVWXbYVAfzXSF+lOHjrTJSY3a0AKUnZhtixytwwJxXcOLpnd6rDI6ispVlXXTD9iXjddtxZfHgenNR9lepX1ZR8hOw3K1fYkW57t7wW5u6T85WXsFXtYV1qPHDqosTH7oh7C+X3S4gSySBjK444xvL2aznkz/HIc8ets+St3+EHh78OLhVwc6nGpc2KjrufBMUzfiQiVVsvQ+EsuEEWQjrncm9aokqSQf7NHNIysZ8WYOuT1GIxGQhJZh8DQY+t1Fs0nWa4o3Eo5DrOfkDlZtC3o6MjnvVHT7Xu0D3G7tjQoMapRpkginptCqynHlAy8imsfB5KJhqxqhkU5bGC4MFhFB3wdb8ATstfiBc4ijbthAJJ2jo9zKiJ+PG+KzAkBnazecsavW9igSX+iMTdnecymEqAUPyb1EjEJ2fwtLxIhvAnvkr4oUdfF2PDBLjTXHamPztTF4KMeFnqytI9QUIRzZivtX7VhEKActQh7WVSDIBe0jeVACVxlyCI3L/dYwYZTKQ+oJoxHPzQCZQCkLd1EPA=";
  let lastPanelTab = null;
  let lastKeywordSubTab = "blocked";
  let getContrastColorFn = null;
  let formatDateTimeFn = null;
  let formatNoteDisplayFn = null;
  let renderNoteSubtasksFn = null;
  let restoreFromBackupHistoryFn = null;
  let importBackupFn = null;
  let exportDataFn = null;
  let applyCustomStylesFn = null;
  function initPanel(callbacks) {
    getContrastColorFn = callbacks.getContrastColor;
    formatDateTimeFn = callbacks.formatDateTime;
    formatNoteDisplayFn = callbacks.formatNoteDisplay;
    renderNoteSubtasksFn = callbacks.renderNoteSubtasks;
    restoreFromBackupHistoryFn = callbacks.restoreFromBackupHistory;
    importBackupFn = callbacks.importBackup;
    exportDataFn = callbacks.exportData;
    applyCustomStylesFn = callbacks.applyCustomStyles;
  }
  function getContrastColor$1(color) {
    return getContrastColorFn ? getContrastColorFn(color) : "#ffffff";
  }
  function formatDateTime$1(timestamp, includeTime = true, forceUTC = false) {
    return formatDateTimeFn ? formatDateTimeFn(timestamp, includeTime, forceUTC) : new Date(timestamp).toLocaleString();
  }
  function formatNoteDisplay$1(note, compact = false) {
    return formatNoteDisplayFn ? formatNoteDisplayFn(note, compact) : note;
  }
  function renderNoteSubtasks$1(noteId, subtasks, currentPath = [], level = 0) {
    return renderNoteSubtasksFn ? renderNoteSubtasksFn(noteId, subtasks, currentPath, level) : "";
  }
  function showManagementPanel(initialTab = null, options = {}) {
    if (isMemberRank()) {
      window.location.href = "/upload";
      return;
    }
    if (!initialTab) {
      initialTab = lastPanelTab || "block";
    }
    lastPanelTab = initialTab;
    const keywordSubTab = options.keywordSubTab || lastKeywordSubTab;
    lastKeywordSubTab = keywordSubTab;
    document.querySelectorAll(".xcb-overlay, .xcb-panel").forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "xcb-overlay";
    const settings = getSettings();
    const panelSize = settings.panelSize || "medium";
    const panel = document.createElement("div");
    panel.className = `xcb-panel xcb-panel-${panelSize} ${getThemeClassName(settings)}`;
    if (panelSize === "custom" && settings.panelCustomWidth && settings.panelCustomHeight) {
      panel.style.width = settings.panelCustomWidth + "px";
      panel.style.height = settings.panelCustomHeight + "px";
      panel.style.maxHeight = "95vh";
    }
    const blocklist = getBlocklist();
    const trustedlist = getTrustedlist();
    const keywords = getKeywords();
    const stats = getStats();
    const activeRequests = getActiveRequests();
    const archivedRequests = getArchivedRequests();
    const blocklistArr = sortUserList(
      Object.values(blocklist),
      settings.blocklistSortOrder
    );
    const trustedlistArr = sortUserList(
      Object.values(trustedlist),
      settings.trustedlistSortOrder
    );
    const sortedKeywords = sortKeywordList(keywords, settings.keywordsSortOrder);
    const highlightedKeywords = getHighlightedKeywords();
    const sortedHighlightedKeywords = sortKeywordList(highlightedKeywords, settings.highlightedKeywordsSortOrder);
    const sortedActiveRequests = sortRequestList(
      activeRequests,
      settings.requestsSortOrder
    );
    const pendingRequestsCount = (() => {
      const pendingRequests = activeRequests.filter((r) => r.status === "pending");
      if (settings.requestCountMode === "requests_and_subtasks") {
        return pendingRequests.reduce(
          (sum, r) => sum + 1 + (r.checklist ? r.checklist.length : 0),
          0
        );
      } else if (settings.requestCountMode === "subtasks_only") {
        return pendingRequests.reduce(
          (sum, r) => sum + (r.checklist ? r.checklist.length : 0),
          0
        );
      }
      return pendingRequests.length;
    })();
    const activeNotesCount = getActiveNotes().length;
    panel.innerHTML = `
        <div class="xcb-panel-header">
            <h2><i class="ph-bold ph-user-circle"></i> MaNKeY-Bot Control Panel</h2>
            <button id="xcbClosePanel" class="xcb-close-panel"><i class="ph-bold ph-x"></i></button>
        </div>
        <div class="xcb-tabs">
            <button class="xcb-tab${initialTab === "block" ? " xcb-tab-active-block" : ""}" data-tab="block"><i class="ph-bold ph-prohibit"></i> Block (${blocklistArr.length})</button>
            <button class="xcb-tab${initialTab === "trust" ? " xcb-tab-active-trust" : ""}" data-tab="trust"><i class="ph-bold ph-check-circle"></i> Trust (${trustedlistArr.length})</button>
            <button class="xcb-tab${initialTab === "keyword" ? " xcb-tab-active-keyword" : ""}" data-tab="keyword"><i class="ph-bold ph-key"></i> Keyword (${sortedKeywords.length + sortedHighlightedKeywords.length})</button>
            ${settings.requestsEnabled ? `<button class="xcb-tab${initialTab === "requests" ? " xcb-tab-active-requests" : ""}" data-tab="requests"><i class="ph-bold ph-clipboard-text"></i> Requests (${pendingRequestsCount})</button>` : ""}
            ${settings.notesEnabled ? `<button class="xcb-tab${initialTab === "notes" ? " xcb-tab-active-notes" : ""}" data-tab="notes"><i class="ph-bold ph-note-pencil"></i> Notes (${activeNotesCount})</button>` : ""}
            <button class="xcb-tab${initialTab === "settings" ? " xcb-tab-active-settings" : ""}" data-tab="settings"><i class="ph-bold ph-gear"></i> Settings</button>
        </div>

        ${renderBlockTab({
      initialTab,
      settings,
      blocklistArr,
      customReasons: getCustomReasons(),
      formatDateTime: formatDateTime$1,
      formatNoteDisplay: formatNoteDisplay$1
    })}

        ${renderTrustTab({
      initialTab,
      settings,
      trustedlistArr,
      customReasons: getCustomReasons(),
      formatDateTime: formatDateTime$1,
      formatNoteDisplay: formatNoteDisplay$1
    })}

        ${renderKeywordTab({
      initialTab,
      sortedKeywords,
      sortedHighlightedKeywords,
      settings,
      formatDateTime: formatDateTime$1,
      keywordSubTab
    })}

        ${renderRequestsTab({
      initialTab,
      settings,
      activeRequests,
      sortedActiveRequests,
      archivedRequests,
      deletedRequests: getDeletedRequests(),
      formatDateTime: formatDateTime$1
    })}

        ${renderNotesTab({
      initialTab,
      settings,
      notes: getNotes(),
      sortedNotes: getSortedNotes(),
      activeNotes: getActiveNotes(),
      archivedNotes: getArchivedNotes(),
      deletedNotes: getDeletedNotes(),
      noteSections: getNoteSections(),
      customReasons: getCustomReasons(),
      currentNoteSectionFilter: getCurrentNoteSectionFilter(),
      getContrastColor: getContrastColor$1,
      formatDateTime: formatDateTime$1,
      getSectionPrefix,
      renderNoteSubtasks: renderNoteSubtasks$1,
      countNoteSubtasks
    })}

        ${renderSettingsTab({
      initialTab,
      settings,
      panelSize,
      stats,
      blocklistCount: blocklistArr.length,
      trustedlistCount: trustedlistArr.length,
      getVerifiedUsername,
      getVerifiedRank,
      getPermanentWhitelist,
      getCustomReasons,
      getBackupHistory,
      getContrastColor: getContrastColor$1,
      maxCustomTags: MAX_CUSTOM_TAGS,
      mankeyDoodlePfp,
      uncleSamurottPfp
    })}
        <!-- Jump to Top Button - positioned in corner -->
        <button id="xcbJumpToTop" class="xcb-jump-to-top" style="display: none;" title="Back to top"><i class="ph-bold ph-arrow-up"></i></button>
        <div class="xcb-resize-handle" id="xcbResizeHandle" title="Drag to resize"></div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    if (panelSize === "custom" && settings.panelCustomHeight) {
      const listHeight = Math.max(100, settings.panelCustomHeight - 250) + "px";
      panel.querySelectorAll("ul").forEach((ul) => {
        ul.style.maxHeight = listHeight;
      });
    }
    const resizeHandle = document.getElementById("xcbResizeHandle");
    initResizeHandler({ panel, resizeHandle });
    panel.querySelectorAll(".xcb-tab").forEach((tab) => {
      tab.onclick = () => {
        panel.querySelectorAll(".xcb-tab").forEach((t) => t.className = "xcb-tab");
        panel.querySelectorAll(".xcb-tab-content").forEach((c) => c.classList.remove("xcb-tab-content-active"));
        const tabName = tab.dataset.tab;
        const tabClass = tabName === "block" ? "block" : tabName === "trust" ? "trust" : tabName === "keyword" ? "keyword" : tabName === "requests" ? "requests" : tabName === "notes" ? "notes" : "settings";
        tab.classList.add(`xcb-tab-active-${tabClass}`);
        document.getElementById(
          `xcb${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`
        ).classList.add("xcb-tab-content-active");
        lastPanelTab = tabName;
      };
    });
    const closePanel = () => {
      stopGuidedTour();
      overlay.remove();
      panel.remove();
    };
    document.getElementById("xcbClosePanel").onclick = closePanel;
    overlay.onclick = (e) => {
      if (e.target === overlay) closePanel();
    };
    const refreshPanel = (tab, options2 = {}) => {
      const activeTabContent = panel.querySelector(".xcb-tab-content-active");
      const scrollTop = activeTabContent ? activeTabContent.scrollTop : 0;
      closePanel();
      showManagementPanel(tab, options2);
      setTimeout(() => {
        const newActiveTab = document.querySelector(".xcb-tab-content-active");
        if (newActiveTab) newActiveTab.scrollTop = scrollTop;
      }, 10);
    };
    const handlerContext = {
      panel,
      refreshPanel,
      closePanel,
      showPanel: showManagementPanel,
      getContrastColor: getContrastColor$1,
      formatDateTime: formatDateTime$1
    };
    setupBlockHandlers(handlerContext);
    setupTrustHandlers(handlerContext);
    setupKeywordHandlers(handlerContext);
    setupRequestsHandlers(handlerContext);
    setupNotesHandlers(handlerContext);
    setupSettingsHandlers({
      ...handlerContext,
      restoreFromBackupHistoryFn,
      applyCustomStylesFn,
      exportDataFn,
      importBackupFn
    });
  }
  function getContrastColor(hexColor) {
    const settings = getSettings();
    const mode = settings.badgeTextMode || "auto";
    return getContrastColor$2(hexColor, mode);
  }
  function formatNoteDisplay(note, compact = false) {
    if (!note)
      return compact ? "" : '<em style="color:#555;">No note - click Edit to add one</em>';
    const settings = getSettings();
    const colors = settings.customColors;
    const colorMap = {
      // Block presets
      spammer: colors.badgeSpammer,
      "rude/toxic": colors.badgeRude,
      rude: colors.badgeRude,
      toxic: colors.badgeRude,
      beggar: colors.badgeBeggar,
      "off-topic": colors.badgeOfftopic,
      troll: colors.badgeTroll,
      annoying: colors.badgeAnnoying || "#854d0e",
      "unwanted advice": colors.badgeUnwanted || "#7c3aed",
      // Trust presets
      uploader: colors.badgeUploader || "#22c55e",
      helpful: colors.badgeHelpful || "#06b6d4",
      moderator: colors.badgeModerator || "#eab308",
      requester: colors.badgeRequester || "#f97316",
      friend: colors.badgeFriend || "#ec4899",
      "seeding issues": colors.badgeSeeding || "#b91c1c",
      thankful: colors.badgeThankful || "#10b981"
    };
    const tags = note.split(/[,;]+/).map((t) => t.trim()).filter((t) => t);
    const customReasons = getCustomReasons();
    const badges = tags.map((tag) => {
      const tagLower = tag.toLowerCase();
      const badgeColor = colorMap[tagLower];
      if (badgeColor) {
        const textColor = getContrastColor(badgeColor);
        return `<span class="xcb-reason-badge" style="background:${badgeColor};color:${textColor};">${tag}</span>`;
      }
      const customMatch = customReasons.find(
        (r) => r.name.toLowerCase() === tagLower
      );
      if (customMatch) {
        const textColor = getContrastColor(customMatch.color);
        return `<span class="xcb-reason-badge" style="background:${customMatch.color};color:${textColor};">${tag}</span>`;
      }
      return compact ? "" : tag;
    }).filter((b) => b);
    if (badges.length === 0) {
      return compact ? "" : note;
    }
    return badges.join(" ");
  }
  const MAX_INLINE_TAGS = 2;
  const MAX_INLINE_CHARS = 25;
  function getInlineTagsHTML(username) {
    const blockedUser = getBlockedUser(username);
    const trustedUser = getTrustedUser(username);
    let note = "";
    if (blockedUser && blockedUser.note) {
      note = blockedUser.note;
    } else if (trustedUser && trustedUser.note) {
      note = trustedUser.note;
    }
    if (!note) return "";
    const allTags = note.split(/[,;]+/).map((t) => t.trim()).filter((t) => t);
    let displayTags = [];
    let charCount = 0;
    let truncated = false;
    for (let i = 0; i < allTags.length; i++) {
      if (displayTags.length >= MAX_INLINE_TAGS || charCount + allTags[i].length > MAX_INLINE_CHARS) {
        truncated = true;
        break;
      }
      displayTags.push(allTags[i]);
      charCount += allTags[i].length;
    }
    const tagsHtml = formatNoteDisplay(displayTags.join(", "), true);
    if (truncated && tagsHtml) {
      return tagsHtml + '<span style="color:#666;font-size:10px;margin-left:2px;" title="' + allTags.length + ' tags total">+' + (allTags.length - displayTags.length) + "</span>";
    }
    return tagsHtml;
  }
  function applyCustomStyles() {
    const settings = getSettings();
    const colors = settings.customColors;
    const font = settings.customFont;
    const badgeFont = settings.badgeFont || { family: "inherit", size: "11px" };
    let customCSS = document.getElementById("xcb-custom-styles");
    if (!customCSS) {
      customCSS = document.createElement("style");
      customCSS.id = "xcb-custom-styles";
      document.head.appendChild(customCSS);
    }
    const isLightTheme = isLightColor(colors.panelBg);
    let allThemeCSS = "";
    for (const [themeName, themeColors] of Object.entries(THEME_PRESETS)) {
      allThemeCSS += generateThemeCSS(themeName, themeColors);
    }
    const customThemeColors = { ...colors, fontFamily: font.family };
    allThemeCSS += generateThemeCSS("custom", customThemeColors);
    document.querySelectorAll(".xcb-panel").forEach((panel) => {
      applyThemeClass(panel, settings);
    });
    applyGlobalThemeClass(settings);
    customCSS.textContent = `
            /* ===== ALL THEME CLASSES ===== */
            ${allThemeCSS}

            /* ===== PANEL BASE ===== */
            .xcb-panel {
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
                border-color: var(--xcb-border) !important;
                font-family: ${font.family} !important;
                font-size: ${font.size} !important;
            }
            /* ===== CONSISTENT FONTS ===== */
            .xcb-panel p,
            .xcb-panel span,
            .xcb-panel div,
            .xcb-panel label,
            .xcb-panel li,
            .xcb-panel button,
            .xcb-panel input,
            .xcb-panel select,
            .xcb-panel textarea,
            .xcb-panel h3,
            .xcb-panel h4,
            .xcb-panel strong,
            .xcb-panel a {
                font-size: inherit !important;
                font-family: inherit !important;
            }
            .xcb-panel .xcb-section-title {
                font-size: calc(${font.size} + 1px) !important;
                font-family: inherit !important;
            }
            /* Panel header title - larger than body text, fills header space */
            .xcb-panel .xcb-panel-header h2 {
                font-size: calc(${font.size} + 14px) !important;
                font-weight: 800 !important;
                letter-spacing: 1px !important;
            }
            .xcb-panel .xcb-tab {
                font-size: inherit !important;
                font-family: inherit !important;
            }
            /* Note cards and request cards inherit font */
            .xcb-panel .xcb-note-card,
            .xcb-panel .xcb-note-card *,
            .xcb-panel .xcb-request-item,
            .xcb-panel .xcb-request-item * {
                font-family: inherit !important;
            }
            .xcb-panel .xcb-reason-badge {
                font-family: ${badgeFont.family} !important;
                font-size: ${badgeFont.size} !important;
            }
            /* ===== SITE-WIDE BADGE FONTS (outside panel) ===== */
            .xcb-reason-badge {
                font-family: ${badgeFont.family} !important;
                font-size: ${badgeFont.size} !important;
            }
            .xcb-inline-tags .xcb-reason-badge {
                font-family: ${badgeFont.family} !important;
                font-size: calc(${badgeFont.size} - 1px) !important;
            }
            /* ===== SCALED SPACING FOR FONT SIZE ===== */
            .xcb-panel {
                line-height: 1.5 !important;
            }
            .xcb-panel p,
            .xcb-panel div {
                line-height: 1.5 !important;
            }
            .xcb-panel .xcb-section {
                padding: calc(${font.size} * 0.8) !important;
                margin-bottom: calc(${font.size} * 0.8) !important;
            }
            .xcb-panel .xcb-section-title {
                margin-bottom: calc(${font.size} * 0.6) !important;
            }
            .xcb-panel input[type="text"],
            .xcb-panel input[type="search"],
            .xcb-panel input[type="number"],
            .xcb-panel select,
            .xcb-panel textarea {
                padding: calc(${font.size} * 0.5) calc(${font.size} * 0.6) !important;
            }
            .xcb-panel button {
                padding: calc(${font.size} * 0.4) calc(${font.size} * 0.8) !important;
            }
            .xcb-panel .xcb-tab {
                padding: calc(${font.size} * 0.5) calc(${font.size} * 0.8) !important;
            }
            .xcb-panel li {
                padding: calc(${font.size} * 0.4) calc(${font.size} * 0.6) !important;
                margin-bottom: calc(${font.size} * 0.3) !important;
            }
            .xcb-panel .xcb-color-row,
            .xcb-panel [style*="display: flex"][style*="gap"] {
                gap: calc(${font.size} * 0.6) !important;
                margin-bottom: calc(${font.size} * 0.5) !important;
            }
            .xcb-panel .xcb-color-input {
                width: calc(${font.size} * 2.5) !important;
                height: calc(${font.size} * 2.5) !important;
                min-width: 32px !important;
                min-height: 32px !important;
            }
            .xcb-panel select {
                min-width: calc(${font.size} * 6) !important;
                padding: calc(${font.size} * 0.5) calc(${font.size} * 0.6) !important;
                min-height: calc(${font.size} * 2.2) !important;
            }
            .xcb-panel .xcb-template-select {
                padding: calc(${font.size} * 0.6) calc(${font.size} * 0.5) !important;
                min-height: calc(${font.size} * 2.5) !important;
            }
            .xcb-panel input[type="number"] {
                min-width: calc(${font.size} * 5.5) !important;
                width: auto !important;
            }
            .xcb-panel > h3 {
                color: var(--xcb-border) !important;
                font-size: 18px !important;
                font-weight: bold !important;
                margin-bottom: 12px !important;
            }
            .xcb-panel h4 {
                color: var(--xcb-text) !important;
            }
            .xcb-panel strong:not([style*="color"]) {
                color: var(--xcb-text) !important;
            }
            /* Text color defaults - NO !important so inline styles can override */
            .xcb-panel p {
                color: var(--xcb-secondary);
            }
            .xcb-panel span:not(.xcb-reason-badge):not(.xcb-user-badge):not(.xcb-badge-preview-item):not(.xcb-badge-color-preview):not(.xcb-badge-font-preview):not([style*="color"]) {
                color: var(--xcb-secondary);
            }
            .xcb-panel label:not([style*="color"]) {
                color: var(--xcb-text);
            }
            .xcb-panel div:not([style*="color"]) {
                color: var(--xcb-text);
            }
            .xcb-panel [style*="font-size: 10px"]:not([style*="color"]),
            .xcb-panel [style*="font-size:10px"]:not([style*="color"]) {
                color: var(--xcb-muted);
            }

            /* ===== LIGHT THEME SPECIFIC FIXES ===== */
            ${isLightTheme ? `
            /* User items */
            .xcb-panel .xcb-user-item {
                background: var(--xcb-section-bg) !important;
            }
            /* Context menus */
            .xcb-panel .xcb-context-menu {
                background: #fff !important;
                border-color: #ccc !important;
            }
            .xcb-panel .xcb-context-item {
                color: #1a1a1a !important;
            }
            .xcb-panel .xcb-context-item:hover {
                background: #e8e8e8 !important;
            }
            /* Request buttons - all types */
            .xcb-panel .xcb-request-btn {
                background: transparent !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-request-btn:hover {
                border-color: var(--xcb-primary) !important;
                color: var(--xcb-text) !important;
                background: var(--xcb-hover-bg) !important;
            }
            .xcb-panel .xcb-request-btn-bordered {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-request-btn-bordered:hover {
                background: var(--xcb-hover-bg) !important;
                border-color: var(--xcb-primary) !important;
            }
            .xcb-panel .xcb-request-btn-archive {
                border-color: #6366f1 !important;
                color: #4f46e5 !important;
            }
            .xcb-panel .xcb-request-btn-archive:hover {
                background: #6366f1 !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-request-btn-delete {
                border-color: var(--xcb-accent-danger, #dc2626) !important;
                color: var(--xcb-accent-danger, #b91c1c) !important;
            }
            .xcb-panel .xcb-request-btn-delete:hover {
                background: var(--xcb-accent-danger, #dc2626) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Status filter buttons */
            .xcb-panel .xcb-status-filter {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-status-filter:hover,
            .xcb-panel .xcb-status-filter.active {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Request items */
            .xcb-panel .xcb-request-item {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-request-item:hover {
                border-color: var(--xcb-primary) !important;
            }
            /* Note cards */
            .xcb-panel .xcb-note-card {
                background: var(--xcb-section-bg) !important;
            }
            /* Jump buttons - theme-aware styling */
            /* Note: color is NOT !important so inline styles can override for specific states */
            .xcb-panel .xcb-jump-btn {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-section-text, var(--xcb-text));
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-jump-btn:hover {
                background: var(--xcb-hover-bg) !important;
                border-color: var(--xcb-primary) !important;
                color: var(--xcb-primary);
            }
            /* Generic buttons with dark inline styles */
            .xcb-panel button[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-panel button[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-panel button[style*="background: #3a3a4e"],
            .xcb-panel button[style*="background:#3a3a4e"],
            .xcb-panel button[style*="background: #333"],
            .xcb-panel button[style*="background:#333"] {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
                border-color: var(--xcb-input-border) !important;
            }
            /* Labels and spans with inline backgrounds */
            .xcb-panel label[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-panel label[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-panel div[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-panel div[style*="background: var(--xcb-section-bg, #2a2a3e)"] {
                background: var(--xcb-section-bg) !important;
            }
            /* Elements with #1a1a2e backgrounds */
            .xcb-panel div[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel div[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel label[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel label[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel select[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel select[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel input[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel input[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel textarea[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel textarea[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel a[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-panel a[style*="background: var(--xcb-panel-bg, #1a1a2e)"] {
                background: var(--xcb-bg) !important;
            }
            /* White text on inline styles - force theme text color */
            /* But exclude buttons that need white text on solid backgrounds */
            .xcb-panel [style*="color: #fff"]:not(button):not(.xcb-add-btn):not(.xcb-request-btn):not([style*="background: #"]):not([style*="background:#"]):not([style*="background: var(--xcb-accent"]),
            .xcb-panel [style*="color:#fff"]:not(button):not(.xcb-add-btn):not(.xcb-request-btn):not([style*="background: #"]):not([style*="background:#"]):not([style*="background: var(--xcb-accent"]),
            .xcb-panel [style*="color: #ffffff"]:not(button):not(.xcb-add-btn):not(.xcb-request-btn):not([style*="background: #"]):not([style*="background:#"]):not([style*="background: var(--xcb-accent"]),
            .xcb-panel [style*="color:#ffffff"]:not(button):not(.xcb-add-btn):not(.xcb-request-btn):not([style*="background: #"]):not([style*="background:#"]):not([style*="background: var(--xcb-accent"]),
            .xcb-panel [style*="color: #e0e0e0"],
            .xcb-panel [style*="color:#e0e0e0"],
            .xcb-panel [style*="color: #ddd"],
            .xcb-panel [style*="color:#ddd"],
            .xcb-panel [style*="color: #ccc"],
            .xcb-panel [style*="color:#ccc"] {
                color: var(--xcb-text) !important;
            }
            /* Restore white text for buttons with solid colored backgrounds */
            .xcb-panel button[style*="background: #"],
            .xcb-panel button[style*="background:#"],
            .xcb-panel button[style*="background: var(--xcb-accent"],
            .xcb-panel .xcb-add-btn[style*="background"],
            .xcb-panel .xcb-request-btn[style*="background: #"],
            .xcb-panel .xcb-request-btn[style*="background:#"] {
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Setup panel overrides */
            .xcb-setup-panel div[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-setup-panel div[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-setup-panel label[style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-setup-panel label[style*="background: var(--xcb-section-bg, #2a2a3e)"] {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-setup-panel div[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-setup-panel div[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-setup-panel select[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-setup-panel select[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-setup-panel input[style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-setup-panel input[style*="background: var(--xcb-panel-bg, #1a1a2e)"] {
                background: var(--xcb-bg) !important;
            }
            .xcb-setup-panel [style*="color: #fff"],
            .xcb-setup-panel [style*="color:#fff"],
            .xcb-setup-panel [style*="color: #e0e0e0"],
            .xcb-setup-panel [style*="color:#e0e0e0"] {
                color: var(--xcb-text) !important;
            }
            /* Tab styling for light theme */
            .xcb-panel .xcb-tab {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-tab:hover {
                background: var(--xcb-hover-bg) !important;
            }
            /* Checkbox labels in settings */
            .xcb-panel label[style*="padding: 12px 14px"] {
                background: var(--xcb-section-bg) !important;
            }
            /* Export/Import buttons */
            .xcb-panel button[id^="xcbExport"],
            .xcb-panel button[id^="xcbImport"],
            .xcb-panel label.xcb-request-btn-import,
            .xcb-panel .xcb-io-btn {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            /* Select dropdowns */
            .xcb-panel select option {
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
            }
            /* Help boxes */
            .xcb-panel .xcb-help-box {
                background: var(--xcb-section-bg) !important;
            }
            /* Stats boxes */
            .xcb-panel .xcb-stats-box {
                background: var(--xcb-section-bg) !important;
            }
            /* Inline color overrides for muted text */
            .xcb-panel [style*="color: #888"],
            .xcb-panel [style*="color:#888"],
            .xcb-panel [style*="color: #aaa"],
            .xcb-panel [style*="color:#aaa"],
            .xcb-panel [style*="color: #666"],
            .xcb-panel [style*="color:#666"] {
                color: var(--xcb-secondary) !important;
            }
            /* Status buttons (pending/completed/declined) */
            .xcb-panel .xcb-status-btn {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-muted) !important;
            }
            .xcb-panel .xcb-status-btn:hover {
                border-color: var(--xcb-secondary) !important;
            }
            /* Checklist items */
            .xcb-panel .xcb-checklist {
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-checklist-item {
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-checklist-add input {
                background: var(--xcb-input-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-input-text) !important;
            }
            .xcb-panel .xcb-checklist-add button {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Primary/Add buttons - ensure correct text on colored backgrounds */
            .xcb-panel .xcb-add-btn,
            .xcb-panel label.xcb-add-btn {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-setup-panel .xcb-setup-btn {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Status completed/pending buttons need contrast */
            .xcb-panel .xcb-status-btn-completed.active {
                background: var(--xcb-accent-success, #16a34a) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-status-btn-pending.active {
                background: #ca8a04 !important;
                color: #000 !important;
            }
            /* Add Request button */
            .xcb-panel .xcb-add-request-btn {
                background: var(--xcb-request-color, var(--xcb-primary)) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Size selects - use dark text */
            .xcb-panel .xcb-size-select {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            /* Panels input/select text color */
            .xcb-panel input,
            .xcb-panel select,
            .xcb-panel textarea {
                color: var(--xcb-input-text) !important;
            }
            /* Archived/Deleted sections backgrounds */
            .xcb-panel div[style*="background: #1a1a1a"],
            .xcb-panel div[style*="background:#1a1a1a"],
            .xcb-panel div[style*="background: #0a0a0a"],
            .xcb-panel div[style*="background:#0a0a0a"] {
                background: var(--xcb-hover-bg) !important;
            }
            /* Filter tags */
            .xcb-panel .xcb-filter-tag {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-filter-tag.active {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            /* Reason presets */
            .xcb-panel .xcb-reason-preset {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-reason-preset:hover {
                background: var(--xcb-hover-bg) !important;
            }
            /* Custom tag items */
            .xcb-panel .xcb-custom-tag {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            /* Note section tree items */
            .xcb-panel .xcb-note-section-item {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-panel .xcb-note-section-item:hover {
                background: var(--xcb-hover-bg) !important;
            }
            /* Template select */
            .xcb-panel .xcb-template-select {
                background: var(--xcb-input-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-input-text) !important;
            }
            /* Reply options */
            .xcb-panel .xcb-reply-option {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-reply-option:hover {
                background: var(--xcb-hover-bg) !important;
            }
            /* Float button for light themes */
            .xcb-float-btn {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            /* Jump to top button */
            #xcbJumpToTop {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            /* ===== POPUP OVERRIDES FOR LIGHT THEMES ===== */
            .xcb-section-picker-popup,
            .xcb-section-edit-popup,
            .xcb-backup-history-popup,
            .xcb-note-popup,
            .xcb-request-popup {
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-section-picker-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-section-picker-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-section-edit-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-section-edit-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-backup-history-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-backup-history-popup [style*="background: var(--xcb-section-bg, #2a2a3e)"] {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-section-picker-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-section-picker-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-section-edit-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-section-edit-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-backup-history-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"],
            .xcb-backup-history-popup [style*="background: var(--xcb-panel-bg, #1a1a2e)"] {
                background: var(--xcb-bg) !important;
            }
            .xcb-section-picker-popup [style*="color: #e0e0e0"],
            .xcb-section-picker-popup [style*="color:#e0e0e0"],
            .xcb-section-picker-popup [style*="color: #888"],
            .xcb-section-picker-popup [style*="color:#888"],
            .xcb-section-edit-popup [style*="color: #e0e0e0"],
            .xcb-section-edit-popup [style*="color:#e0e0e0"],
            .xcb-backup-history-popup [style*="color: #ccc"],
            .xcb-backup-history-popup [style*="color:#ccc"] {
                color: var(--xcb-text) !important;
            }
            /* Reply menu popup */
            .xcb-reply-menu {
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-reply-menu [style*="background: var(--xcb-section-bg, #2a2a3e)"],
            .xcb-reply-menu [style*="background: var(--xcb-section-bg, #2a2a3e)"] {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-reply-menu [style*="color: #ddd"],
            .xcb-reply-menu [style*="color:#ddd"] {
                color: var(--xcb-text) !important;
            }
            ` : ""}

            /* ===== INPUTS & TEXTAREAS ===== */
            .xcb-panel input[type="text"],
            .xcb-panel input[type="search"],
            .xcb-panel input[type="date"],
            .xcb-panel input[type="time"],
            .xcb-panel input[type="number"],
            .xcb-panel textarea,
            .xcb-panel select {
                background: var(--xcb-input-bg) !important;
                border: 1px solid var(--xcb-input-border) !important;
                color: var(--xcb-input-text) !important;
            }
            .xcb-panel input::placeholder,
            .xcb-panel textarea::placeholder {
                color: var(--xcb-muted) !important;
                opacity: 1 !important;
            }

            /* ===== BUTTONS ===== */
            .xcb-panel .xcb-add-btn {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-remove-btn {
                background: transparent !important;
                color: var(--xcb-danger) !important;
                border-color: var(--xcb-danger) !important;
            }
            .xcb-panel .xcb-edit-btn {
                color: var(--xcb-primary) !important;
                border-color: var(--xcb-primary) !important;
            }
            .xcb-panel .xcb-edit-btn:hover {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-close-btn {
                color: var(--xcb-secondary) !important;
            }
            .xcb-panel .xcb-close-btn:hover {
                background: var(--xcb-hover-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel button:not(.xcb-add-btn):not(.xcb-theme-btn):not(.xcb-warning-btn):not(.xcb-danger-btn):not(.xcb-danger-btn-dark):not(.xcb-purple-btn):not(.xcb-secondary-btn):not(.xcb-cancel-btn):not(.xcb-io-btn):not(.xcb-status-filter):not(.xcb-note-filter-tag):not([style*="background"]) {
                color: var(--xcb-text) !important;
            }
            /* Only force white text on buttons that don't have their own inline color */
            .xcb-panel button[style*="background"]:not([style*="color"]),
            .xcb-panel label[style*="background"]:not([style*="color"]) {
                color: var(--xcb-btn-text, #fff) !important;
            }

            /* ===== SECTIONS & BOXES ===== */
            .xcb-panel .xcb-section {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-section-title {
                color: var(--xcb-secondary) !important;
            }
            .xcb-panel .xcb-info-box {
                background: var(--xcb-section-bg) !important;
                border: 1px solid var(--xcb-input-border) !important;
                border-left: 3px solid var(--xcb-primary) !important;
                border-radius: 6px !important;
                padding: 10px !important;
            }
            .xcb-panel .xcb-stats-box {
                background: var(--xcb-section-bg) !important;
                border: 1px solid var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-stats-box h4 {
                color: var(--xcb-secondary) !important;
            }
            .xcb-panel .xcb-stats-item {
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }

            /* ===== TABS ===== */
            .xcb-panel .xcb-tab {
                background: var(--xcb-tab-bg) !important;
                color: var(--xcb-text) !important;
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-tab:hover {
                background: var(--xcb-hover-bg) !important;
            }
            .xcb-panel .xcb-tab.xcb-tab-active {
                background: var(--xcb-tab-active-bg) !important;
                color: var(--xcb-btn-text, #fff) !important;
                border-color: var(--xcb-tab-active-bg) !important;
            }

            /* ===== HELP BOX ===== */
            .xcb-panel .xcb-help-box {
                background: var(--xcb-section-bg) !important;
                border-left-color: var(--xcb-input-border) !important;
                color: var(--xcb-muted) !important;
            }
            .xcb-panel .xcb-help-box h4 {
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-help-box li {
                color: var(--xcb-muted) !important;
            }
            .xcb-panel .xcb-help-box strong {
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-help-toggle {
                color: var(--xcb-secondary) !important;
                border-color: var(--xcb-input-border) !important;
                background: var(--xcb-section-bg) !important;
            }
            .xcb-panel .xcb-help-toggle:hover {
                background: var(--xcb-hover-bg) !important;
                color: var(--xcb-text) !important;
            }

            /* ===== LISTS ===== */
            .xcb-panel ul {
                background: transparent !important;
            }
            .xcb-panel ul li {
                border-color: var(--xcb-input-border) !important;
                background: transparent !important;
            }
            .xcb-panel .xcb-user-meta {
                color: var(--xcb-muted) !important;
            }
            .xcb-panel a.xcb-panel-link {
                color: var(--xcb-danger) !important;
            }
            .xcb-panel a.xcb-panel-link-trust {
                color: var(--xcb-badge-uploader) !important;
            }

            /* ===== LABELS & TEXT ===== */
            .xcb-panel label {
                color: var(--xcb-secondary) !important;
            }
            .xcb-panel .xcb-color-row span {
                color: var(--xcb-secondary) !important;
            }
            .xcb-panel .xcb-checkbox-label {
                color: var(--xcb-text) !important;
            }

            /* ===== FILTER TAGS & PRESETS ===== */
            .xcb-panel .xcb-filter-tag {
                background: var(--xcb-section-bg) !important;
                border-color: var(--xcb-input-border) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-filter-tag:hover {
                background: var(--xcb-hover-bg) !important;
            }
            .xcb-panel .xcb-filter-tag.active {
                background: var(--xcb-primary) !important;
                border-color: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-reason-preset {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-reason-preset:hover {
                background: var(--xcb-hover-bg) !important;
            }
            .xcb-panel .xcb-reason-preset.selected {
                background: var(--xcb-primary) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-custom-tag {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }

            /* ===== TEMPLATE SELECT & OPTIONS ===== */
            .xcb-panel .xcb-template-select {
                background: var(--xcb-input-bg) !important;
                color: var(--xcb-input-text) !important;
                border-color: var(--xcb-input-border) !important;
            }
            .xcb-panel .xcb-template-select option {
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
            }

            /* ===== REPLY OPTIONS ===== */
            .xcb-panel .xcb-reply-option {
                background: var(--xcb-section-bg) !important;
                color: var(--xcb-text) !important;
            }
            .xcb-panel .xcb-reply-option:hover {
                background: var(--xcb-hover-bg) !important;
            }

            /* ===== THEME BUTTONS - Each button has its own theme class ===== */
            .xcb-panel .xcb-theme-btn {
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                background: var(--xcb-bg) !important;
                color: var(--xcb-text) !important;
                border: 2px solid var(--xcb-border) !important;
                font-family: var(--xcb-font-family) !important;
            }
            /* Active theme indicator */
            .xcb-panel .xcb-theme-btn.xcb-theme-active {
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5), 0 2px 8px rgba(0,0,0,0.3) !important;
                position: relative;
                transform: scale(1.05);
            }
            .xcb-panel .xcb-theme-btn.xcb-theme-active::after {
                content: '✓';
                position: absolute;
                top: -8px;
                right: -8px;
                background: var(--xcb-accent-success, #10b981);
                color: var(--xcb-btn-text, #fff);
                font-size: 10px;
                font-weight: bold;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }

            /* ===== BADGE COLORS ===== */
            .xcb-reason-spammer { background: var(--xcb-badge-spammer) !important; }
            .xcb-reason-rude { background: var(--xcb-badge-rude) !important; }
            .xcb-reason-beggar { background: var(--xcb-badge-beggar) !important; }
            .xcb-reason-offtopic { background: var(--xcb-badge-offtopic) !important; }
            .xcb-reason-troll { background: var(--xcb-badge-troll) !important; }
            .xcb-reason-annoying { background: var(--xcb-badge-annoying) !important; }
            .xcb-reason-uploader { background: var(--xcb-badge-uploader) !important; }
            .xcb-reason-helpful { background: var(--xcb-badge-helpful) !important; }
            .xcb-reason-moderator { background: var(--xcb-badge-moderator) !important; }
            .xcb-reason-requester { background: var(--xcb-badge-requester) !important; }
            .xcb-reason-friend { background: var(--xcb-badge-friend) !important; }
            .xcb-reason-seeding { background: var(--xcb-badge-seeding) !important; }
            .xcb-reason-thankful { background: var(--xcb-badge-thankful) !important; }
            .xcb-reason-unwanted { background: var(--xcb-badge-unwanted) !important; }

            /* ===== USER BADGES (hard/soft/temp) - PRESERVE COLORS ===== */
            .xcb-panel .xcb-user-badge.xcb-badge-hard {
                background: var(--xcb-highlight-color) !important;
                color: var(--xcb-btn-text, #fff) !important;
            }
            .xcb-panel .xcb-user-badge.xcb-badge-soft {
                background: transparent !important;
                border: 1px solid var(--xcb-highlight-color) !important;
                color: ${isLightTheme ? "#b91c1c" : "var(--xcb-highlight-color)"} !important;
            }
            .xcb-panel .xcb-user-badge.xcb-badge-temp {
                background: var(--xcb-warning) !important;
                color: #000 !important;
            }

            /* ===== REASON BADGES - PRESERVE INLINE COLORS ===== */
            /* Allow inline style colors to work (from getContrastColor) */
            .xcb-panel .xcb-reason-badge[style*="color:"],
            .xcb-panel span.xcb-reason-badge[style*="color:"] {
                /* Don't override - let inline style control the color */
                text-shadow: 0 1px 1px rgba(0,0,0,0.2) !important;
            }

            /* ===== NOTE CARDS ===== */
            .xcb-panel .xcb-note-card {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-panel .xcb-note-card[data-status="archived"] {
                background: var(--xcb-bg) !important;
                opacity: 0.8;
            }
            .xcb-panel .xcb-deleted-note {
                background: var(--xcb-bg) !important;
                opacity: 0.7;
            }

            /* ===== REQUEST ITEMS ===== */
            .xcb-panel .xcb-request-item {
                background: var(--xcb-section-bg) !important;
            }

            /* ===== USER LIST ITEMS ===== */
            .xcb-panel .xcb-user-item {
                background: var(--xcb-section-bg) !important;
            }
            .xcb-panel .xcb-user-item:hover {
                background: var(--xcb-hover-bg) !important;
            }

            /* ===== JUMP BUTTONS ===== */
            .xcb-panel .xcb-jump-btn {
                font-family: inherit !important;
            }

            /* ===== POPUP/MODAL DIALOGS ===== */
            .xcb-custom-popup {
                font-family: ${font.family} !important;
            }
            .xcb-custom-popup * {
                font-family: inherit !important;
            }

            /* ===== CONTEXT MENUS ===== */
            .xcb-context-menu {
                font-family: ${font.family} !important;
            }
            .xcb-context-menu * {
                font-family: inherit !important;
            }

            /* ===== TOAST NOTIFICATIONS ===== */
            .xcb-toast {
                font-family: ${font.family} !important;
            }

            /* ===== SETUP/WELCOME SCREEN ===== */
            .xcb-setup-panel {
                font-family: ${font.family} !important;
            }
            .xcb-setup-panel * {
                font-family: inherit !important;
            }

            /* ===== GUIDED TOUR ===== */
            .xcb-tour-overlay,
            .xcb-tour-tip {
                font-family: ${font.family} !important;
            }
            .xcb-tour-overlay *,
            .xcb-tour-tip * {
                font-family: inherit !important;
            }

            /* ===== PHOSPHOR ICONS OVERRIDE ===== */
            /* Ensure icon font is never overridden by inherit rules */
            .ph-bold,
            .ph-bold::before {
                font-family: "Phosphor-Bold" !important;
            }
        `;
  }
  function canUserSubmitRequest(username) {
    const settings = getSettings();
    return canUserSubmitRequest$1(
      username,
      settings.requestLimitPerUser,
      settings.requestCountMode
    );
  }
  function canAcceptMoreRequests() {
    const settings = getSettings();
    return canAcceptMoreRequests$1(
      settings.totalRequestsLimit,
      settings.requestCountMode
    );
  }
  function importBackup(jsonString) {
    return importBackup$1(jsonString, getSettings);
  }
  function checkAutoBackup() {
    return checkAutoBackup$1(getSettings, getStats, saveSettings);
  }
  function restoreFromBackupHistory(index) {
    return restoreFromBackupHistory$1(index, getSettings);
  }
  let pageUploaderCache = null;
  let pageUploaderChecked = false;
  function getPageUploader() {
    if (pageUploaderChecked) return pageUploaderCache;
    pageUploaderChecked = true;
    if (!window.location.pathname.includes("/torrent/")) {
      pageUploaderCache = null;
      return null;
    }
    const infoList = document.querySelector(
      ".torrent-detail-page .box-info-detail, .box-info ul.list"
    );
    if (infoList) {
      const uploaderLink = infoList.querySelector('a[href*="/user/"]');
      if (uploaderLink) {
        const match = uploaderLink.href.match(/\/user\/([^\/]+)/);
        if (match) {
          pageUploaderCache = decodeURIComponent(match[1]);
          return pageUploaderCache;
        }
      }
    }
    const allUserLinks = document.querySelectorAll(
      '.box-info a[href*="/user/"], .torrent-category-detail a[href*="/user/"]'
    );
    for (const link of allUserLinks) {
      const match = link.href.match(/\/user\/([^\/]+)/);
      if (match) {
        pageUploaderCache = decodeURIComponent(match[1]);
        return pageUploaderCache;
      }
    }
    pageUploaderCache = null;
    return null;
  }
  function isMyUpload() {
    const uploader = getPageUploader();
    if (!uploader) return true;
    return isMyUsername(uploader);
  }
  function shouldShowTools() {
    const settings = getSettings();
    if (!settings.onlyShowToolsOnMyUploads) return true;
    return isMyUpload();
  }
  function doQuickReply(username, type = "blocked") {
    const settings = getSettings();
    let message;
    switch (type) {
      case "trusted":
        message = settings.trustedReplyMessage || DEFAULT_TRUSTED_REPLIES[0];
        break;
      case "neutral":
        message = settings.neutralReplyMessage || DEFAULT_NEUTRAL_REPLIES[0];
        break;
      case "blocked":
      default:
        message = settings.quickReplyMessage || DEFAULT_QUICK_REPLIES[0];
        break;
    }
    return fillCommentBox(username, message);
  }
  function fillCommentBox(username, message) {
    const textarea = document.querySelector('textarea[name="comment"]') || document.querySelector("#comment") || document.querySelector("textarea.comment-textarea") || document.querySelector("form.comment-form textarea") || document.querySelector(".add-comment textarea") || document.querySelector("textarea");
    if (!textarea) {
      alert(
        "Could not find comment box on this page. Make sure you are on a torrent page with comments."
      );
      return false;
    }
    const fullMessage = username ? `@${username} ${message}` : message;
    textarea.value = fullMessage;
    textarea.focus();
    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  function showQuickReplyPicker(username, buttonElement) {
    const existingPicker = document.querySelector(".xcb-reply-picker");
    if (existingPicker) existingPicker.remove();
    const settings = getSettings();
    const blockedReplies = settings.quickReplies || DEFAULT_QUICK_REPLIES;
    const trustedReplies = settings.trustedReplies || DEFAULT_TRUSTED_REPLIES;
    const neutralReplies = settings.neutralReplies || DEFAULT_NEUTRAL_REPLIES;
    const seedingReplies = settings.seedingReplies || DEFAULT_SEEDING_REPLIES;
    const picker = document.createElement("div");
    picker.className = "xcb-reply-picker";
    picker.style.cssText = `
            position: absolute;
            background: var(--xcb-panel-bg, #1a1a2e);
            border: 1px solid var(--xcb-primary);
            border-radius: 6px;
            padding: 12px;
            z-index: 100000;
            width: 580px;
            max-height: 450px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            font-size: 12px;
        `;
    picker.innerHTML = `
            <div style="margin-bottom: 8px; color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Pick a reply for @${username}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 350px; overflow-y: auto; padding-right: 5px;">
                <div>
                    <div style="color: #ff6b6b; font-size: 10px; margin-bottom: 4px; font-weight: bold;"><i class="ph-bold ph-prohibit"></i> Blocked Replies:</div>
                    ${blockedReplies.map(
      (reply, i) => `
                        <div class="xcb-reply-option" data-reply="${encodeURIComponent(reply)}" style="padding: 5px 8px; margin: 2px 0; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; cursor: pointer; color: var(--xcb-panel-text-secondary, #ddd); transition: background 0.2s; font-size: 11px;">
                            ${reply.substring(0, 45)}${reply.length > 45 ? "..." : ""}
                        </div>
                    `
    ).join("")}
                </div>
                <div>
                    <div style="color: #4ade80; font-size: 10px; margin-bottom: 4px; font-weight: bold;"><i class="ph-bold ph-check-circle"></i> Trusted Replies:</div>
                    ${trustedReplies.map(
      (reply, i) => `
                        <div class="xcb-reply-option" data-reply="${encodeURIComponent(reply)}" style="padding: 5px 8px; margin: 2px 0; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; cursor: pointer; color: var(--xcb-panel-text-secondary, #ddd); transition: background 0.2s; font-size: 11px;">
                            ${reply.substring(0, 45)}${reply.length > 45 ? "..." : ""}
                        </div>
                    `
    ).join("")}
                </div>
                <div>
                    <div style="color: #6366f1; font-size: 10px; margin-bottom: 4px; font-weight: bold;">Neutral Replies:</div>
                    ${neutralReplies.map(
      (reply, i) => `
                        <div class="xcb-reply-option" data-reply="${encodeURIComponent(reply)}" style="padding: 5px 8px; margin: 2px 0; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; cursor: pointer; color: var(--xcb-panel-text-secondary, #ddd); transition: background 0.2s; font-size: 11px;">
                            ${reply.substring(0, 45)}${reply.length > 45 ? "..." : ""}
                        </div>
                    `
    ).join("")}
                </div>
                <div>
                    <div style="color: #f59e0b; font-size: 10px; margin-bottom: 4px; font-weight: bold;">Seeding/Speed Replies:</div>
                    ${seedingReplies.map(
      (reply, i) => `
                        <div class="xcb-reply-option" data-reply="${encodeURIComponent(reply)}" style="padding: 5px 8px; margin: 2px 0; background: var(--xcb-section-bg, #2a2a3e); border-radius: 4px; cursor: pointer; color: var(--xcb-panel-text-secondary, #ddd); transition: background 0.2s; font-size: 11px;">
                            ${i === 0 ? '<span style="color: #f59e0b; font-weight: bold;">Long Answer:</span> ' : ""}${reply.substring(0, i === 0 ? 30 : 45)}${reply.length > (i === 0 ? 30 : 45) ? "..." : ""}
                        </div>
                    `
    ).join("")}
                </div>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;">
                <input type="text" class="xcb-custom-reply-input" placeholder="Or type a custom reply..." style="width: 100%; padding: 6px; background: var(--xcb-section-bg, #2a2a3e); border: 1px solid var(--xcb-panel-border, #444); color: var(--xcb-input-text, #fff); border-radius: 4px; box-sizing: border-box;">
            </div>
        `;
    document.body.appendChild(picker);
    const rect = buttonElement.getBoundingClientRect();
    picker.style.top = rect.bottom + window.scrollY + 5 + "px";
    picker.style.left = Math.max(10, rect.left + window.scrollX - 100) + "px";
    picker.querySelectorAll(".xcb-reply-option").forEach((opt) => {
      opt.onmouseenter = () => opt.style.background = "var(--xcb-primary)";
      opt.onmouseleave = () => opt.style.background = "#2a2a3e";
      opt.onclick = () => {
        const reply = decodeURIComponent(opt.dataset.reply);
        fillCommentBox(username, reply);
        picker.remove();
      };
    });
    const customInput = picker.querySelector(".xcb-custom-reply-input");
    customInput.onkeydown = (e) => {
      if (e.key === "Enter" && customInput.value.trim()) {
        fillCommentBox(username, customInput.value.trim());
        picker.remove();
      }
    };
    const closeHandler = (e) => {
      if (!picker.contains(e.target) && e.target !== buttonElement) {
        picker.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);
    return picker;
  }
  function formatDateTime(timestamp, includeTime = true, forceUTC = false) {
    const settings = getSettings();
    return formatDateTime$2(
      timestamp,
      { dateFormat: settings.dateFormat, timeFormat: settings.timeFormat },
      includeTime,
      forceUTC
    );
  }
  function renderNoteSubtasks(noteId, subtasks, currentPath = [], level = 0) {
    if (!subtasks || subtasks.length === 0) return "";
    if (level >= 3) return "";
    const indent = level * 16;
    let html = "";
    for (const st of subtasks) {
      const path = [...currentPath, st.id];
      const pathStr = path.join(",");
      const canAddNested = level < 2;
      html += `<div class="xcb-note-subtask" data-note-id="${noteId}" data-path="${pathStr}" data-level="${level}" draggable="true" style="display: flex; align-items: flex-start; gap: 6px; margin-left: ${indent}px; padding: 4px 0; border-bottom: 1px solid var(--xcb-panel-border, #333);">`;
      html += `<span class="xcb-note-subtask-drag" title="Drag to reorder" style="cursor: grab; color: var(--xcb-panel-text-muted, #666); font-size: 10px; margin-top: 2px; user-select: none;">⋮⋮</span>`;
      html += `<input type="checkbox" class="xcb-note-subtask-check" ${st.completed ? "checked" : ""} style="margin-top: 3px; cursor: pointer;">`;
      html += `<span class="xcb-note-subtask-text" style="flex: 1; font-size: 12px; text-align: left; color: ${st.completed ? "var(--xcb-panel-text-dim, #666)" : "var(--xcb-panel-text-secondary, #ccc)"}; ${st.completed ? "text-decoration: line-through;" : ""}">${(st.text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
      html += `<div style="display: flex; gap: 4px; flex-shrink: 0;">`;
      html += `<button class="xcb-note-subtask-edit" title="Edit" style="background: transparent; border: none; color: var(--xcb-primary, #3b82f6); cursor: pointer; font-size: 10px; padding: 2px;"><i class="ph-bold ph-pencil-simple"></i></button>`;
      if (canAddNested) {
        html += `<button class="xcb-note-subtask-add" title="Add sub-item" style="background: transparent; border: none; color: #8b5cf6; cursor: pointer; font-size: 10px; padding: 2px;">➕</button>`;
      }
      html += `<button class="xcb-note-subtask-delete" title="Delete" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 10px; padding: 2px;">✕</button>`;
      html += `</div>`;
      html += `</div>`;
      if (st.subtasks && st.subtasks.length > 0) {
        html += renderNoteSubtasks(noteId, st.subtasks, path, level + 1);
      }
    }
    return html;
  }
  function exportData() {
    exportFullBackup();
  }
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://cdn.jsdelivr.net";
  preconnect.crossOrigin = "anonymous";
  document.head.appendChild(preconnect);
  const phosphorLink = document.createElement("link");
  phosphorLink.rel = "stylesheet";
  phosphorLink.type = "text/css";
  phosphorLink.href = "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css";
  document.head.appendChild(phosphorLink);
  const fontPreload = document.createElement("link");
  fontPreload.rel = "preload";
  fontPreload.as = "font";
  fontPreload.type = "font/woff2";
  fontPreload.href = "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/Phosphor-Bold.woff2";
  fontPreload.crossOrigin = "anonymous";
  document.head.appendChild(fontPreload);
  let hiddenCount = 0;
  let counterEl = null;
  let allCollapsed = true;
  function updateHiddenCounter() {
    if (hiddenCount > 0) {
      if (!counterEl) {
        counterEl = document.createElement("div");
        counterEl.className = "xcb-hidden-counter";
        counterEl.style.cursor = "default";
        const textSpan = document.createElement("span");
        textSpan.id = "xcbHiddenText";
        textSpan.style.cursor = "pointer";
        textSpan.onclick = () => showManagementPanel("block");
        counterEl.appendChild(textSpan);
        const collapseBtn = document.createElement("button");
        collapseBtn.className = "xcb-collapse-btn";
        collapseBtn.id = "xcbCollapseAll";
        collapseBtn.textContent = "Show All";
        collapseBtn.onclick = (e) => {
          e.stopPropagation();
          toggleAllHiddenComments();
        };
        counterEl.appendChild(collapseBtn);
        document.body.appendChild(counterEl);
      }
      document.getElementById("xcbHiddenText").textContent = `${hiddenCount} comment${hiddenCount > 1 ? "s" : ""} hidden `;
      counterEl.style.display = "block";
    } else if (counterEl) {
      counterEl.style.display = "none";
    }
  }
  function toggleAllHiddenComments() {
    const hiddenComments = document.querySelectorAll(".xcb-comment-hidden");
    const btn = document.getElementById("xcbCollapseAll");
    if (allCollapsed) {
      hiddenComments.forEach((c) => c.classList.remove("xcb-comment-hidden"));
      document.querySelectorAll(".xcb-show-btn").forEach((b) => b.textContent = "Hide");
      if (btn) btn.textContent = "Hide All";
      allCollapsed = false;
    } else {
      document.querySelectorAll(".xcb-blocked-notice + p, .xcb-keyword-notice + p").forEach((c) => {
        c.classList.add("xcb-comment-hidden");
      });
      document.querySelectorAll(".xcb-show-btn").forEach((b) => b.textContent = "Show");
      if (btn) btn.textContent = "Show All";
      allCollapsed = true;
    }
  }
  document.addEventListener("click", (e) => {
    hideContextMenu();
    hideBlockMenu();
    hideQuickTagPopup();
    checkPopupsOnClick(e);
  });
  function showSetupPanel() {
    applyCustomStyles();
    document.querySelectorAll(".xcb-overlay, .xcb-setup-panel").forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "xcb-overlay";
    const panel = document.createElement("div");
    const currentThemeClass = getThemeClassName(getSettings());
    panel.className = `xcb-setup-panel ${currentThemeClass}`;
    const verifiedUser = getVerifiedUsername();
    const verifiedRank = getVerifiedRank();
    panel.innerHTML = `
            <h2>Welcome to MaNKeY-Bot: 1337x Comment Assistant!</h2>
            <p style="margin: 5px 0; padding: 8px; background: rgba(245, 158, 11, 0.12); border: 1px solid var(--xcb-accent-warning); border-radius: 4px; color: var(--xcb-accent-warning);"><i class="ph-bold ph-upload-simple"></i> <strong>Built for Uploaders</strong> — This script helps you manage comments on your uploads.</p>
            <div style="margin: 15px 0; padding: 12px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-success);">
                <div style="color: var(--xcb-accent-success); font-size: 14px;"><i class="ph-bold ph-user-check"></i> <strong>Verified Account</strong></div>
                <div style="margin-top: 8px; color: var(--xcb-secondary);">
                    <span style="color: var(--xcb-accent-success);"><strong>${verifiedUser || "Unknown"}</strong></span>
                    ${verifiedRank ? `<span style="margin-left: 10px; color: ${verifiedRank === "Member" ? "var(--xcb-accent-warning)" : "var(--xcb-accent-success)"};">(${verifiedRank})</span>` : ""}
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin: 10px 0; text-align: left;">
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-warning); cursor: pointer;">
                    <input type="checkbox" id="xcbSetupRequests" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                    <span style="font-size: 14px;"><strong style="color: var(--xcb-accent-warning);"><i class="ph-bold ph-chats"></i> Take requests</strong> <span style="color: var(--xcb-muted); font-size: 12px;">— Track user requests</span></span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-purple); cursor: pointer;">
                    <input type="checkbox" id="xcbSetupNotes" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                    <span style="font-size: 14px;"><strong style="color: var(--xcb-accent-purple);"><i class="ph-bold ph-note-pencil"></i> Notes</strong> <span style="color: var(--xcb-muted); font-size: 12px;">— Save comments with tags</span></span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-warning); cursor: pointer;">
                    <input type="checkbox" id="xcbSetupFirstTimer" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                    <span style="font-size: 14px;"><strong style="color: var(--xcb-accent-warning);"><i class="ph-bold ph-star"></i> First-timers</strong> <span style="color: var(--xcb-muted); font-size: 12px;">— Tag new commenters</span></span>
                </label>
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-danger);">
                    <span style="font-size: 14px; flex-shrink: 0;"><strong style="color: var(--xcb-accent-danger);"><i class="ph-bold ph-prohibit"></i> Blocked</strong></span>
                    <div style="display: flex; gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: var(--xcb-muted);">
                            <input type="radio" name="xcbSetupBlockDisplay" value="crossout" checked style="cursor: pointer;">
                            <span>Cross out</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: var(--xcb-muted);">
                            <input type="radio" name="xcbSetupBlockDisplay" value="hide" style="cursor: pointer;">
                            <span>Hide entirely</span>
                        </label>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-primary);">
                    <span style="font-size: 14px; flex-shrink: 0;"><strong style="color: var(--xcb-primary);"><i class="ph-bold ph-text-aa"></i> Menu font size</strong></span>
                    <select id="xcbSetupFontSize" style="padding: 6px 10px; background: var(--xcb-input-bg); border: 1px solid var(--xcb-input-border); color: var(--xcb-input-text); border-radius: 4px; font-size: 13px; cursor: pointer;">
                        <option value="11">Small</option>
                        <option value="13" selected>Medium</option>
                        <option value="15">Large</option>
                        <option value="17">Extra Large</option>
                        <option value="custom">Custom...</option>
                    </select>
                    <input type="number" id="xcbSetupFontSizeCustom" min="8" max="30" value="14" style="display: none; width: 70px; padding: 6px 8px; background: var(--xcb-input-bg); border: 1px solid var(--xcb-primary); color: var(--xcb-input-text); border-radius: 4px; font-size: 13px; text-align: center;">
                    <span id="xcbSetupFontSizeCustomLabel" style="display: none; font-size: 13px; color: var(--xcb-muted);">px (8-30)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-purple);">
                    <span style="font-size: 14px; flex-shrink: 0;"><strong style="color: var(--xcb-accent-purple);"><i class="ph-bold ph-calendar"></i> Date format</strong></span>
                    <select id="xcbSetupDateFormat" style="padding: 6px 10px; background: var(--xcb-input-bg); border: 1px solid var(--xcb-input-border); color: var(--xcb-input-text); border-radius: 4px; font-size: 13px; cursor: pointer;">
                        <option value="MDY">Jan 15, 2024 (US)</option>
                        <option value="DMY">15 Jan 2024 (EU/UK)</option>
                        <option value="YMD">2024 Jan 15 (ISO)</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-info);">
                    <span style="font-size: 14px; flex-shrink: 0;"><strong style="color: var(--xcb-accent-info);"><i class="ph-bold ph-clock"></i> Time format</strong></span>
                    <select id="xcbSetupTimeFormat" style="padding: 6px 10px; background: var(--xcb-input-bg); border: 1px solid var(--xcb-input-border); color: var(--xcb-input-text); border-radius: 4px; font-size: 13px; cursor: pointer;">
                        <option value="12h">12-hour (1:30 PM)</option>
                        <option value="24h">24-hour (13:30)</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-primary);">
                    <span style="font-size: 14px; flex-shrink: 0;"><strong style="color: var(--xcb-primary);"><i class="ph-bold ph-palette"></i> Theme</strong></span>
                    <select id="xcbSetupTheme" style="padding: 6px 10px; background: var(--xcb-input-bg); border: 1px solid var(--xcb-input-border); color: var(--xcb-input-text); border-radius: 4px; font-size: 13px; cursor: pointer;">
                        <option value="classic" selected>🎨 Classic (Default)</option>
                        <option value="1337x">💀 1337x</option>
                        <option value="typewriter">📜 Typewriter (Light)</option>
                        <option value="midnight">🌙 Midnight</option>
                        <option value="ocean">🌊 Ocean</option>
                        <option value="colorblind">👁️ Colorblind-friendly</option>
                        <option value="monkey">🐵 Monkey</option>
                        <option value="candy">🍬 Candy</option>
                    </select>
                </div>
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-success); cursor: pointer;">
                    <input type="checkbox" id="xcbSetupGuidedTour" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                    <span style="font-size: 14px;"><strong style="color: var(--xcb-accent-success);"><i class="ph-bold ph-book-open-text"></i> Guided Tour</strong> <span style="color: var(--xcb-muted); font-size: 12px;">— Learn how to use the app (recommended)</span></span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--xcb-section-bg); border-radius: 6px; border-left: 3px solid var(--xcb-accent-info); cursor: pointer;">
                    <input type="checkbox" id="xcbSetupHelpBoxes" checked style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                    <span style="font-size: 14px;"><strong style="color: var(--xcb-accent-info);"><i class="ph-bold ph-question"></i> Help Boxes</strong> <span style="color: var(--xcb-muted); font-size: 12px;">— Show tips when opening tabs</span></span>
                </label>
            </div>

            <button class="xcb-setup-btn" id="xcbSetupSave">Get Started</button>
            <p style="font-size: 10px; color: var(--xcb-panel-text-dim); margin: 8px 0 0 0;">You can change these settings later in the Settings tab.</p>
        `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    const saveBtn = document.getElementById("xcbSetupSave");
    const fontSizeSelect = document.getElementById("xcbSetupFontSize");
    const fontSizeCustom = document.getElementById("xcbSetupFontSizeCustom");
    const fontSizeCustomLabel = document.getElementById(
      "xcbSetupFontSizeCustomLabel"
    );
    fontSizeSelect.onchange = () => {
      if (fontSizeSelect.value === "custom") {
        fontSizeCustom.style.display = "block";
        fontSizeCustomLabel.style.display = "block";
        fontSizeCustom.focus();
      } else {
        fontSizeCustom.style.display = "none";
        fontSizeCustomLabel.style.display = "none";
      }
    };
    const themeSelect = document.getElementById("xcbSetupTheme");
    themeSelect.onchange = () => {
      const selectedTheme = themeSelect.value;
      panel.className = panel.className.replace(/\bmankey-theme-\S+/g, "").trim();
      panel.classList.add(`mankey-theme-${selectedTheme}`);
      document.body.className = document.body.className.replace(/\bmankey-theme-\S+-active\b/g, "").trim();
      document.body.classList.add(`mankey-theme-${selectedTheme}-active`);
    };
    saveBtn.onclick = () => {
      const username = verifiedUser || "User";
      const requestsEnabled = document.getElementById("xcbSetupRequests").checked;
      const notesEnabled = document.getElementById("xcbSetupNotes").checked;
      const firstTimerEnabled = document.getElementById("xcbSetupFirstTimer").checked;
      const hideEntireComment = document.querySelector('input[name="xcbSetupBlockDisplay"]:checked').value === "hide";
      const wantsGuidedTour = document.getElementById("xcbSetupGuidedTour").checked;
      const fontSizeSelect2 = document.getElementById("xcbSetupFontSize").value;
      const fontSizeCustom2 = document.getElementById(
        "xcbSetupFontSizeCustom"
      ).value;
      const fontSize = (fontSizeSelect2 === "custom" ? fontSizeCustom2 : fontSizeSelect2) + "px";
      const dateFormat = document.getElementById("xcbSetupDateFormat").value;
      const timeFormat = document.getElementById("xcbSetupTimeFormat").value;
      const selectedTheme = document.getElementById("xcbSetupTheme").value;
      const s = getSettings();
      s.requestsEnabled = requestsEnabled;
      s.notesEnabled = notesEnabled;
      s.firstTimerTrackingEnabled = firstTimerEnabled;
      s.hideEntireComment = hideEntireComment;
      s.customFont.size = fontSize;
      s.dateFormat = dateFormat;
      s.timeFormat = timeFormat;
      s.theme = selectedTheme;
      if (THEME_PRESETS[selectedTheme]) {
        const preset = THEME_PRESETS[selectedTheme];
        const buttonReply = preset.buttonReply || preset.buttonPrimary || "#3b82f6";
        const buttonRequest = preset.buttonRequest || "#14b8a6";
        const buttonNote = preset.buttonNote || "#8b5cf6";
        s.customColors = {
          ...preset,
          buttonReply,
          buttonReplyText: preset.buttonReplyText || "#ffffff",
          buttonRequest,
          buttonRequestText: preset.buttonRequestText || "#ffffff",
          buttonNote,
          buttonNoteText: preset.buttonNoteText || "#ffffff"
        };
      }
      if (selectedTheme === "typewriter") {
        s.customFont.family = "'American Typewriter', 'Courier New', monospace";
        s.badgeFont = s.badgeFont || {};
        s.badgeFont.family = "'American Typewriter', 'Courier New', monospace";
      } else {
        s.customFont.family = "inherit";
        s.badgeFont = s.badgeFont || {};
        s.badgeFont.family = "inherit";
      }
      s.wantsGuidedTour = wantsGuidedTour;
      if (wantsGuidedTour) {
        s.guidedTourCompleted = false;
      }
      const showHelpBoxes = document.getElementById("xcbSetupHelpBoxes").checked;
      s.showHelpByDefault = showHelpBoxes;
      s.setupCompletedAt = Date.now();
      saveSettings(s);
      overlay.remove();
      panel.remove();
      if (wantsGuidedTour) {
        alert(
          `Welcome, ${username}! The page will reload and the guided tour will begin.`
        );
      } else {
        const requestsMsg = requestsEnabled ? " Requests tracking is enabled." : " Requests tracking is disabled.";
        const firstTimerMsg = firstTimerEnabled ? " First-timer tracking is enabled." : "";
        alert(
          `Welcome, ${username}! The script is now configured.${requestsMsg}${firstTimerMsg} The page will reload to apply changes.`
        );
      }
      location.reload();
    };
  }
  initGuidedTour({
    getSettings,
    saveSettings,
    getThemeClassName: () => getThemeClassName(getSettings())
  });
  function getAllNoteTags() {
    const builtInTags = [
      "Helpful",
      "Important",
      "Complaint",
      "Question",
      "Feedback",
      "Follow-up"
    ];
    const customTags = getCustomReasons().map((r) => r.name);
    const noteTags = /* @__PURE__ */ new Set();
    getNotes().forEach((n) => (n.tags || []).forEach((t) => noteTags.add(t)));
    return [.../* @__PURE__ */ new Set([...builtInTags, ...customTags, ...Array.from(noteTags)])];
  }
  initMenus({
    showQuickTagPopup,
    showRequestPopup,
    showNotePopup
  });
  initPopups({
    showManagementPanel,
    canUserSubmitRequest,
    canAcceptMoreRequests,
    getContrastColor,
    restoreFromBackupHistory,
    getAllNoteTags,
    getThemeClassName: () => getThemeClassName(getSettings())
  });
  initPanel({
    getContrastColor,
    formatDateTime,
    formatNoteDisplay,
    renderNoteSubtasks,
    restoreFromBackupHistory,
    importBackup,
    exportData,
    applyCustomStyles
  });
  function initializeScript() {
    migrateCustomTagsToDefaults();
    applyCustomStyles();
    processPage();
    processComments();
    processUserProfilePage();
    initUploadsSearch();
    initNotificationsSearch();
    setupKeyboardShortcuts();
    setupGlobalContextMenu();
    checkAutoBackup();
    const initSettings = getSettings();
    const tourSettings = getSettings();
    if (tourSettings.wantsGuidedTour && !tourSettings.guidedTourCompleted) {
      setTimeout(() => startGuidedTour(), 500);
    }
    const observer = new MutationObserver(() => {
      processPage();
      processComments();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const floatBtn = document.createElement("button");
    floatBtn.id = "xcbToggleBtn";
    floatBtn.className = "xcb-float-btn xcb-pos-" + (initSettings.buttonPosition || "bottom-right");
    const updateFloatBtnState = () => {
      const loggedIn = isLoggedInToSite();
      const memberLocked = isMemberRank();
      if (!loggedIn) {
        floatBtn.innerHTML = '<i class="ph-bold ph-lock"></i>';
        floatBtn.title = "Login Required - Click to see message";
        floatBtn.style.opacity = "0.7";
      } else if (memberLocked) {
        floatBtn.innerHTML = '<i class="ph-bold ph-lock"></i>';
        floatBtn.title = "Uploader Access Required - Click for info";
        floatBtn.style.opacity = "0.7";
      } else {
        floatBtn.innerHTML = '<i class="ph-bold ph-user"></i>';
        floatBtn.title = "Manage User Lists";
        floatBtn.style.opacity = "1";
      }
    };
    updateFloatBtnState();
    floatBtn.onclick = () => {
      if (!isLoggedInToSite()) {
        const existingToast = document.querySelector(".xcb-login-toast");
        if (existingToast) existingToast.remove();
        const toast = document.createElement("div");
        toast.className = "xcb-login-toast";
        toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a1a2e 0%, #16162a 100%);
        color: #fff;
        padding: 24px 32px;
        border-radius: 12px;
        z-index: 100003;
        font-size: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        border: 2px solid #ef4444;
        text-align: center;
        max-width: 320px;
      `;
        toast.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"><i class="ph-bold ph-lock"></i></div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #ef4444;">Login Required</div>
        <div style="color: #aaa; margin-bottom: 16px; line-height: 1.5;">
          You need to be logged in to your 1337x account to access the MaNKeY-Bot Control Panel.
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 16px;">
          <i class="ph-bold ph-info"></i> Log in to unlock block lists, trust lists, requests, notes, and more.
        </div>
        <button id="xcbDismissLoginToast" style="
          padding: 10px 24px;
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
        ">OK</button>
      `;
        const overlay = document.createElement("div");
        overlay.className = "xcb-login-toast-overlay";
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 100002;
      `;
        document.body.appendChild(overlay);
        document.body.appendChild(toast);
        const closeToast = () => {
          overlay.remove();
          toast.remove();
          updateFloatBtnState();
        };
        document.getElementById("xcbDismissLoginToast").onclick = closeToast;
        overlay.onclick = closeToast;
        setTimeout(() => {
          if (document.body.contains(toast)) {
            closeToast();
          }
        }, 1e4);
        return;
      }
      if (isMemberRank()) {
        showMemberLockedScreen();
        return;
      }
      showManagementPanel();
    };
    document.body.appendChild(floatBtn);
    const buttonPosition = initSettings.buttonPosition || "bottom-right";
    const quickNav = document.createElement("div");
    quickNav.id = "xcbQuickNav";
    quickNav.className = `xcb-quick-nav xcb-pos-${buttonPosition}${initSettings.quickNavHidden ? " xcb-nav-hidden" : ""}`;
    const requestsPaused = initSettings.requestsPaused || initSettings.requestsEnabled && !canAcceptMoreRequests();
    let quickNavHTML = `
    <button class="xcb-nav-tab-btn" data-nav="block" data-tooltip="Block List">
      <i class="ph-bold ph-prohibit"></i>
    </button>
    <button class="xcb-nav-tab-btn" data-nav="trust" data-tooltip="Trust List">
      <i class="ph-bold ph-check-circle"></i>
    </button>
    <button class="xcb-nav-tab-btn" data-nav="keyword" data-tooltip="Keywords">
      <i class="ph-bold ph-key"></i>
    </button>
  `;
    const requestBtnClass = requestsPaused ? " xcb-nav-paused" : "";
    quickNavHTML += `
    <button class="xcb-nav-tab-btn${requestBtnClass}" data-nav="requests" data-tooltip="${requestsPaused ? "Requests (Paused)" : "Requests"}" id="xcbQuickNavRequests" style="${initSettings.requestsEnabled ? "" : "display: none;"}">
      <i class="ph-bold ph-clipboard-text"></i>
    </button>`;
    quickNavHTML += `
    <button class="xcb-nav-tab-btn" data-nav="notes" data-tooltip="Notes" id="xcbQuickNavNotes" style="${initSettings.notesEnabled ? "" : "display: none;"}">
      <i class="ph-bold ph-note-pencil"></i>
    </button>`;
    quickNavHTML += `
    <div class="xcb-nav-settings-wrapper">
      <button class="xcb-nav-tab-btn" data-nav="settings" data-tooltip="Settings">
        <i class="ph-bold ph-gear"></i>
      </button>
      <button class="xcb-nav-expand-btn" id="xcbNavExpandBtn" title="Show settings sections">
        <i class="ph-bold ph-caret-left"></i>
      </button>
    </div>
    <div class="xcb-nav-sections xcb-nav-sections-hidden" id="xcbNavSections">
      <div class="xcb-nav-section-link" data-section="xcbSectionAccountVerification" data-tooltip="Account" role="button" tabindex="0"><i class="ph-bold ph-user-check"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbHelpSection" data-tooltip="Help & Tour" role="button" tabindex="0"><i class="ph-bold ph-book-open-text"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbSectionDisplay" data-tooltip="Display" role="button" tabindex="0"><i class="ph-bold ph-eye"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbThemeSection" data-tooltip="Themes" role="button" tabindex="0"><i class="ph-bold ph-paint-brush"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbCustomTagsSection" data-tooltip="Custom Tags" role="button" tabindex="0"><i class="ph-bold ph-tag"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbSectionFeatures" data-tooltip="Features" role="button" tabindex="0"><i class="ph-bold ph-toggle-right"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbRequestSettingsSection" data-tooltip="Requests" role="button" tabindex="0"><i class="ph-bold ph-clipboard-text"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbNotesSettingsSection" data-tooltip="Notes" role="button" tabindex="0"><i class="ph-bold ph-note-pencil"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbSectionReplies" data-tooltip="Quick Replies" role="button" tabindex="0"><i class="ph-bold ph-chat-dots"></i></div>
      <div class="xcb-nav-section-link" data-section="xcbSectionData" data-tooltip="Data" role="button" tabindex="0"><i class="ph-bold ph-database"></i></div>
    </div>
  `;
    quickNav.innerHTML = quickNavHTML;
    const expandBtn = quickNav.querySelector("#xcbNavExpandBtn");
    const navSections = quickNav.querySelector("#xcbNavSections");
    if (expandBtn && navSections) {
      expandBtn.onclick = (e) => {
        e.stopPropagation();
        const isHidden = navSections.classList.toggle("xcb-nav-sections-hidden");
        expandBtn.classList.toggle("xcb-nav-expanded", !isHidden);
      };
    }
    const quickNavToggle = document.createElement("button");
    quickNavToggle.id = "xcbQuickNavToggle";
    quickNavToggle.className = `xcb-quick-nav-toggle xcb-pos-${buttonPosition}${initSettings.quickNavHidden ? " xcb-nav-collapsed" : ""}`;
    quickNavToggle.title = "Toggle quick navigation";
    quickNavToggle.innerHTML = '<i class="ph-bold ph-caret-left"></i>';
    quickNavToggle.onclick = () => {
      const isHidden = quickNav.classList.toggle("xcb-nav-hidden");
      quickNavToggle.classList.toggle("xcb-nav-collapsed", isHidden);
      const currentSettings = getSettings();
      currentSettings.quickNavHidden = isHidden;
      saveSettings(currentSettings);
    };
    quickNav.querySelectorAll(".xcb-nav-tab-btn").forEach((btn) => {
      btn.onclick = (e) => {
        if (e.target.closest(".xcb-nav-settings-dropdown")) return;
        if (!isLoggedInToSite()) {
          floatBtn.click();
          return;
        }
        if (isMemberRank()) {
          floatBtn.click();
          return;
        }
        const tabName = btn.dataset.nav;
        showManagementPanel(tabName);
        quickNav.querySelectorAll(".xcb-nav-tab-btn").forEach((b) => b.classList.remove("xcb-nav-active"));
        btn.classList.add("xcb-nav-active");
      };
    });
    quickNav.querySelectorAll(".xcb-nav-section-link").forEach((link) => {
      link.onclick = (e) => {
        var _a;
        e.stopPropagation();
        if (!isLoggedInToSite()) {
          floatBtn.click();
          return;
        }
        if (isMemberRank()) {
          floatBtn.click();
          return;
        }
        const sectionId = link.dataset.section;
        showManagementPanel("settings");
        quickNav.querySelectorAll(".xcb-nav-tab-btn").forEach((b) => b.classList.remove("xcb-nav-active"));
        (_a = quickNav.querySelector('.xcb-nav-tab-btn[data-nav="settings"]')) == null ? void 0 : _a.classList.add("xcb-nav-active");
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      };
    });
    const updateQuickNavVisibility = () => {
      const loggedIn = isLoggedInToSite();
      const memberLocked = isMemberRank();
      if (!loggedIn || memberLocked) {
        quickNav.style.display = "none";
        quickNavToggle.style.display = "none";
      } else {
        quickNav.style.display = "";
        quickNavToggle.style.display = "";
      }
    };
    const updateQuickNavRequestsState = () => {
      const currentSettings = getSettings();
      const requestsBtn = document.getElementById("xcbQuickNavRequests");
      if (requestsBtn) {
        requestsBtn.style.display = currentSettings.requestsEnabled ? "" : "none";
        const isPaused = currentSettings.requestsPaused || currentSettings.requestsEnabled && !canAcceptMoreRequests();
        if (isPaused) {
          requestsBtn.classList.add("xcb-nav-paused");
          requestsBtn.dataset.tooltip = "Requests (Paused)";
        } else {
          requestsBtn.classList.remove("xcb-nav-paused");
          requestsBtn.dataset.tooltip = "Requests";
        }
      }
      const notesBtn = document.getElementById("xcbQuickNavNotes");
      if (notesBtn) {
        notesBtn.style.display = currentSettings.notesEnabled ? "" : "none";
      }
    };
    window.updateQuickNavRequestsState = updateQuickNavRequestsState;
    updateQuickNavVisibility();
    updateQuickNavRequestsState();
    document.body.appendChild(quickNav);
    document.body.appendChild(quickNavToggle);
    let lastLoginState = isLoggedInToSite();
    setInterval(() => {
      var _a;
      const currentLoginState = isLoggedInToSite();
      if (currentLoginState !== lastLoginState) {
        console.log(`[MaNKeY-Bot] Login state changed: ${lastLoginState} -> ${currentLoginState}`);
        lastLoginState = currentLoginState;
        updateFloatBtnState();
        updateQuickNavVisibility();
        if (!currentLoginState) {
          const openPanel = document.querySelector(".xcb-panel");
          if (openPanel) {
            openPanel.remove();
            (_a = document.querySelector(".xcb-overlay")) == null ? void 0 : _a.remove();
          }
        }
      }
      updateQuickNavRequestsState();
    }, 5e3);
    const headerObserver = new MutationObserver(() => {
      const currentLoginState = isLoggedInToSite();
      if (currentLoginState !== lastLoginState) {
        lastLoginState = currentLoginState;
        updateFloatBtnState();
        updateQuickNavVisibility();
      }
    });
    const headerArea = document.querySelector(".head, .header, nav, #header, .top-menu");
    if (headerArea) {
      headerObserver.observe(headerArea, { childList: true, subtree: true, characterData: true });
    }
    if (initSettings.keyboardShortcuts !== false) {
      const keyboardHint = document.createElement("div");
      keyboardHint.className = "xcb-keyboard-hint";
      keyboardHint.id = "xcbKeyboardHint";
      keyboardHint.innerHTML = "<kbd>S</kbd> Panel | Hover: <kbd>B</kbd> Block | <kbd>T</kbd> Trust | <kbd>U</kbd> Undo | <kbd>Shift</kbd>+<kbd>Right-click</kbd> Menu";
      document.body.appendChild(keyboardHint);
      if (!initSettings.keyboardHintShown) {
        const firstComment = document.querySelector(".comment-body, .box-info, .tbox, li[class*='comment'], div[class*='comment']");
        if (firstComment) {
          const rect = firstComment.getBoundingClientRect();
          keyboardHint.style.position = "fixed";
          keyboardHint.style.top = `${rect.bottom + 2}px`;
          keyboardHint.style.left = `${rect.left}px`;
        } else {
          keyboardHint.style.position = "fixed";
          keyboardHint.style.top = "150px";
          keyboardHint.style.left = "20px";
        }
        keyboardHint.style.display = "block";
        keyboardHint.style.opacity = "1";
        keyboardHint.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          keyboardHint.style.opacity = "0";
          setTimeout(() => {
            keyboardHint.style.display = "none";
            keyboardHint.style.opacity = "1";
          }, 500);
        }, 4e3);
        const s = getSettings();
        s.keyboardHintShown = true;
        saveSettings(s);
      }
    }
    const myUser = getMyUsername();
    console.log(
      "MaNKeY-Bot: 1337x Comment Assistant v0.3.3 loaded.",
      myUser ? `User: ${myUser} |` : "",
      "Blocked:",
      Object.keys(getBlocklist()).length,
      "| Trusted:",
      Object.keys(getTrustedlist()).length,
      "| Keywords:",
      getKeywords().length
    );
  }
  let lastSelectionText = "";
  document.addEventListener("selectionchange", () => {
    const sel = window.getSelection();
    const text = sel ? sel.toString() : "";
    if (text.trim().length > 0) {
      lastSelectionText = text;
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
      setTimeout(() => {
        const sel = window.getSelection();
        const text = sel ? sel.toString() : "";
        if (text.trim().length > 0) {
          lastSelectionText = text;
        }
      }, 5);
    }
  });
  document.addEventListener(
    "mousedown",
    (e) => {
      if (e.button === 2) {
        const sel = window.getSelection();
        const text = sel ? sel.toString() : "";
        if (text.trim().length > 0) {
          lastSelectionText = text;
        }
      }
    },
    true
  );
  document.addEventListener("click", (e) => {
    if (!e.target.closest(
      '.comment-info, .comment-row, [class*="comment"], .xcb-panel'
    )) {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || !sel.toString().trim()) {
          lastSelectionText = "";
        }
      }, 100);
    }
  });
  function setupGlobalContextMenu() {
    document.addEventListener("contextmenu", (e) => {
      var _a, _b, _c;
      if (!e.shiftKey) return;
      if (isMemberRank()) return;
      if (!shouldShowTools()) return;
      const usernameLink = e.target.closest('a[href*="/user/"]');
      if (usernameLink && !usernameLink.closest(".xcb-panel")) {
        let username2 = usernameLink.textContent.trim();
        if (!username2 || username2.length < 2) {
          const match = usernameLink.href.match(/\/user\/([^\/]+)/);
          if (match) username2 = decodeURIComponent(match[1]);
        }
        if (username2 && !isMyUsername(username2)) {
          const siteTrusted2 = isSiteTrustedUser(usernameLink);
          const userWhitelisted2 = isWhitelisted(username2);
          const skipBlockTrust2 = siteTrusted2 || userWhitelisted2;
          const blockedUser = getBlockedUser(username2);
          const isHardBlocked = blockedUser && blockedUser.level !== "soft";
          if (!isHardBlocked || skipBlockTrust2) {
            e.preventDefault();
            const currentText2 = window.getSelection().toString().trim();
            const storedText2 = lastSelectionText.trim();
            const selection2 = storedText2.length >= currentText2.length ? storedText2 : currentText2;
            const comment = usernameLink.closest(".comment-info");
            const commentTextEl = comment ? comment.querySelector(".detail p") : null;
            const commentText = selection2 || (commentTextEl ? commentTextEl.innerText.trim() : "");
            showContextMenu(e.clientX, e.clientY, username2, commentText, skipBlockTrust2);
            return;
          }
        }
        return;
      }
      const selection = window.getSelection();
      const currentText = selection.toString().trim();
      const storedText = lastSelectionText.trim();
      let selectedText = storedText.length >= currentText.length ? storedText : currentText;
      if (!selectedText) return;
      const anchorNode = selection.anchorNode;
      if (!anchorNode) return;
      const commentEl = ((_a = anchorNode.parentElement) == null ? void 0 : _a.closest(".comment-info")) || ((_b = anchorNode.parentElement) == null ? void 0 : _b.closest(".comment-row")) || ((_c = anchorNode.parentElement) == null ? void 0 : _c.closest('[class*="comment"]'));
      if (!commentEl) return;
      const commentUsernameLink = commentEl.querySelector('a[href*="/user/"]');
      if (!commentUsernameLink) return;
      let username = commentUsernameLink.textContent.trim();
      if (!username || username.length < 2) {
        const match = commentUsernameLink.href.match(/\/user\/([^\/]+)/);
        if (match) username = decodeURIComponent(match[1]);
      }
      if (!username) return;
      const siteTrusted = isSiteTrustedUser(commentUsernameLink);
      const userWhitelisted = isWhitelisted(username);
      const skipBlockTrust = siteTrusted || userWhitelisted;
      const settings = getSettings();
      const requestsAvailable = settings.requestsEnabled !== false && !settings.requestsPaused;
      if (!requestsAvailable) return;
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, username, selectedText, skipBlockTrust);
    });
  }
  let hoveredUsername = null;
  let hoveredLink = null;
  function setupKeyboardShortcuts() {
    const settings = getSettings();
    if (!settings.keyboardShortcuts) return;
    document.addEventListener("mouseover", (e) => {
      const link = e.target.closest('a[href*="/user/"]');
      if (link && !link.closest(".xcb-panel")) {
        let username = link.textContent.trim();
        if (!username || username.length < 2) {
          const match = link.href.match(/\/user\/([^\/]+)/);
          if (match) username = decodeURIComponent(match[1]);
        }
        const hrefMatch = link.href.match(/\/user\/([^\/]+)/);
        const hrefUsername = hrefMatch ? decodeURIComponent(hrefMatch[1]) : "";
        if (isMyUsername(username) || isMyUsername(hrefUsername)) {
          return;
        }
        if (username) {
          hoveredUsername = username;
          hoveredLink = link;
          const hint = document.getElementById("xcbKeyboardHint");
          if (hint) {
            const commentBox = link.closest(".comment-body, .box-info, .tbox, li, tr, div[class*='comment']");
            if (commentBox) {
              const rect = commentBox.getBoundingClientRect();
              hint.style.position = "fixed";
              hint.style.top = `${rect.bottom + 2}px`;
              hint.style.left = `${rect.left}px`;
            } else {
              const linkRect = link.getBoundingClientRect();
              hint.style.position = "fixed";
              hint.style.top = `${linkRect.bottom + 4}px`;
              hint.style.left = `${linkRect.left}px`;
            }
            hint.style.display = "block";
          }
        }
      }
    });
    document.addEventListener("mouseout", (e) => {
      const link = e.target.closest('a[href*="/user/"]');
      if (link) {
        hoveredUsername = null;
        hoveredLink = null;
        const hint = document.getElementById("xcbKeyboardHint");
        if (hint) hint.style.display = "none";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)
        return;
      if (isMemberRank()) return;
      const key = e.key.toLowerCase();
      if (key === "s") {
        e.preventDefault();
        const panel = document.querySelector(".xcb-panel");
        if (panel && panel.style.display !== "none") {
          closeManagementPanel();
        } else {
          showManagementPanel();
        }
        return;
      }
      if (!hoveredUsername) return;
      const siteTrusted = isSiteTrustedUser(hoveredLink);
      if (key === "b") {
        e.preventDefault();
        if (!siteTrusted && !isBlocked(hoveredUsername)) {
          const rect = hoveredLink.getBoundingClientRect();
          showBlockMenu(rect.left, rect.bottom + 5, hoveredUsername);
        }
      } else if (key === "t") {
        e.preventDefault();
        if (!siteTrusted && !isTrusted(hoveredUsername) && !isBlocked(hoveredUsername)) {
          addToTrustedlist(hoveredUsername);
          const rect = hoveredLink.getBoundingClientRect();
          showQuickTagPopup(rect.left, rect.bottom + 5, hoveredUsername, "trust");
        }
      } else if (key === "u") {
        e.preventDefault();
        if (isBlocked(hoveredUsername)) {
          removeFromBlocklist(hoveredUsername);
          location.reload();
        } else if (isTrusted(hoveredUsername)) {
          removeFromTrustedlist(hoveredUsername);
          location.reload();
        }
      }
    });
  }
  GM_registerMenuCommand("Manage Lists", () => {
    if (isMemberRank()) {
      window.location.href = "/upload";
      return;
    }
    showManagementPanel("block");
  });
  GM_registerMenuCommand("Keywords", () => {
    if (isMemberRank()) {
      window.location.href = "/upload";
      return;
    }
    showManagementPanel("keyword");
  });
  GM_registerMenuCommand("Settings", () => {
    if (isMemberRank()) {
      window.location.href = "/upload";
      return;
    }
    showManagementPanel("settings");
  });
  GM_registerMenuCommand("Export Backup", () => {
    if (isMemberRank()) {
      window.location.href = "/upload";
      return;
    }
    exportData();
  });
  function processPage() {
    const memberLocked = isMemberRank();
    document.querySelectorAll('a[href*="/user/"]').forEach((link) => {
      var _a, _b, _c, _d;
      if (link.dataset.xcbProcessed) return;
      link.dataset.xcbProcessed = "true";
      let username = link.textContent.trim();
      if (!username) {
        const match = link.href.match(/\/user\/([^\/]+)/);
        if (match) username = decodeURIComponent(match[1]);
      }
      if (!username) return;
      if (!memberLocked) {
        const blockedUser = getBlockedUser(username);
        if (blockedUser) {
          link.classList.add(
            blockedUser.level === "soft" ? "xcb-soft-blocked" : "xcb-blocked"
          );
        } else if (isTrusted(username)) {
          link.classList.add("xcb-trusted");
        }
      }
      if (!((_b = (_a = link.nextElementSibling) == null ? void 0 : _a.classList) == null ? void 0 : _b.contains("xcb-site-badge"))) {
        const linkClass = link.className.toLowerCase();
        let badgeHTML = null;
        let badgeTitle = null;
        let badgeClass = null;
        if (linkClass.includes("moderator") || linkClass.includes("supermod") || linkClass.includes("admin")) {
          badgeHTML = '<i class="ph-fill ph-shield-star"></i> MOD';
          badgeTitle = "Site Moderator";
          badgeClass = "xcb-site-badge xcb-site-badge-mod";
        } else if (linkClass.includes("vip")) {
          badgeHTML = '<i class="ph-fill ph-star"></i> VIP';
          badgeTitle = "VIP Uploader";
          badgeClass = "xcb-site-badge xcb-site-badge-vip";
        } else if (isWhitelisted(username)) {
          badgeHTML = '<i class="ph-fill ph-shield-check"></i> WL';
          badgeTitle = "Permanent Whitelist";
          badgeClass = "xcb-site-badge xcb-site-badge-whitelist";
        }
        if (badgeHTML) {
          const badge = document.createElement("span");
          badge.className = badgeClass;
          badge.innerHTML = badgeHTML;
          badge.title = badgeTitle;
          link.insertAdjacentElement("afterend", badge);
        }
      }
      if (link.closest(".xcb-panel")) return;
      if ((_d = (_c = link.nextElementSibling) == null ? void 0 : _c.classList) == null ? void 0 : _d.contains("xcb-btns")) return;
      if (memberLocked) return;
      if (shouldSkipUser(username, link)) return;
      if (!shouldShowTools()) return;
      const btnContainer = document.createElement("span");
      btnContainer.className = "xcb-btns";
      if (isBlocked(username)) {
        const unblockBtn = document.createElement("button");
        unblockBtn.className = "xcb-btn-trust";
        unblockBtn.textContent = "↩";
        unblockBtn.title = "Unblock";
        unblockBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          removeFromBlocklist(username);
          location.reload();
        };
        btnContainer.appendChild(unblockBtn);
      } else if (isTrusted(username)) {
        const untrustBtn = document.createElement("button");
        untrustBtn.className = "xcb-btn-block";
        untrustBtn.textContent = "↩";
        untrustBtn.title = "Remove from trusted";
        untrustBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          removeFromTrustedlist(username);
          location.reload();
        };
        btnContainer.appendChild(untrustBtn);
      } else {
        const blockBtn = document.createElement("button");
        blockBtn.className = "xcb-btn-block";
        blockBtn.innerHTML = '<i class="ph-bold ph-prohibit"></i>';
        blockBtn.title = "Click to choose block type";
        blockBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = blockBtn.getBoundingClientRect();
          showBlockMenu(rect.left, rect.bottom + 5, username);
        };
        const trustBtn = document.createElement("button");
        trustBtn.className = "xcb-btn-trust";
        trustBtn.textContent = "✓";
        trustBtn.title = "Trust (then add tags)";
        trustBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          addToTrustedlist(username);
          const rect = trustBtn.getBoundingClientRect();
          showQuickTagPopup(rect.left, rect.bottom + 5, username, "trust");
        };
        btnContainer.appendChild(blockBtn);
        btnContainer.appendChild(trustBtn);
      }
      if (btnContainer.children.length > 0) {
        link.parentNode.insertBefore(btnContainer, link.nextSibling);
      }
    });
  }
  function processComments() {
    const settings = getSettings();
    hiddenCount = 0;
    const memberLocked = isMemberRank();
    if (memberLocked) return;
    document.querySelectorAll("div.comment-info").forEach((comment) => {
      var _a, _b, _c;
      if (comment.dataset.xcbCommentProcessed) return;
      comment.dataset.xcbCommentProcessed = "true";
      const userNameDiv = comment.querySelector(".user-name");
      if (!userNameDiv) return;
      const userLink = userNameDiv.querySelector('a[href*="/user/"]');
      if (!userLink) return;
      let username = userLink.textContent.trim();
      if (!username) {
        const match = userLink.href.match(/\/user\/([^\/]+)/);
        if (match) username = decodeURIComponent(match[1]);
      }
      if (!username) return;
      const isOwnComment = isMyUsername(username);
      if (!userNameDiv.querySelector(".xcb-site-badge")) {
        let classStr = (userLink.className + " " + (((_a = userLink.parentElement) == null ? void 0 : _a.className) || "") + " " + (((_c = (_b = userLink.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.className) || "")).toLowerCase();
        const commentContainer = comment;
        const frame = commentContainer.querySelector(".frame");
        if (frame) {
          classStr += " " + frame.className.toLowerCase();
        }
        let badgeHTML = null;
        let badgeTitle = null;
        let badgeClass = null;
        if (classStr.includes("moderator") || classStr.includes("supermod") || classStr.includes("admin")) {
          badgeHTML = '<i class="ph-fill ph-shield-star"></i> MOD';
          badgeTitle = "Site Moderator";
          badgeClass = "xcb-site-badge xcb-site-badge-mod";
        } else if (classStr.includes("vip")) {
          badgeHTML = '<i class="ph-fill ph-star"></i> VIP';
          badgeTitle = "VIP Uploader";
          badgeClass = "xcb-site-badge xcb-site-badge-vip";
        } else if (isWhitelisted(username)) {
          badgeHTML = '<i class="ph-fill ph-shield-check"></i> WL';
          badgeTitle = "Permanent Whitelist";
          badgeClass = "xcb-site-badge xcb-site-badge-whitelist";
        }
        if (badgeHTML) {
          const badge = document.createElement("span");
          badge.className = badgeClass;
          badge.innerHTML = badgeHTML;
          badge.title = badgeTitle;
          userLink.insertAdjacentElement("afterend", badge);
        }
      }
      const inlineTags = getInlineTagsHTML(username);
      if (inlineTags && !userNameDiv.querySelector(".xcb-inline-tags")) {
        const tagsSpan = document.createElement("span");
        tagsSpan.className = "xcb-inline-tags";
        tagsSpan.innerHTML = inlineTags;
        tagsSpan.style.cssText = "margin-left: 8px; vertical-align: middle; display: inline-block;";
        userLink.insertAdjacentElement("afterend", tagsSpan);
      }
      if (shouldShowTools() && isFirstTimer(username) && !userNameDiv.querySelector(".xcb-first-timer-tag")) {
        const firstTimerTag = document.createElement("span");
        firstTimerTag.className = "xcb-first-timer-tag";
        firstTimerTag.innerHTML = '<i class="ph-bold ph-star"></i> First-timer';
        firstTimerTag.title = "Click to mark as seen";
        firstTimerTag.dataset.username = username;
        firstTimerTag.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          addSeenCommenter(username);
          document.querySelectorAll(`.xcb-first-timer-tag[data-username="${username}"]`).forEach((tag) => {
            tag.style.opacity = "0";
            setTimeout(() => tag.remove(), 200);
          });
        };
        const insertAfter = userNameDiv.querySelector(".xcb-inline-tags") || userLink;
        insertAfter.insertAdjacentElement("afterend", firstTimerTag);
      }
      const detail = comment.querySelector(".detail");
      const commentText = detail == null ? void 0 : detail.querySelector("p");
      if (isOwnComment) return;
      const blockedUser = getBlockedUser(username);
      if (blockedUser) {
        const commentTextContent = commentText ? commentText.textContent.trim() : "";
        if (blockedUser.level === "hard") {
          comment.classList.add("xcb-comment-blocked");
          if (settings.hideEntireComment) {
            comment.classList.add("xcb-entire-comment-hidden");
            hiddenCount++;
            incrementHideCount(username, commentTextContent);
          } else if (commentText && !comment.querySelector(".xcb-blocked-notice")) {
            commentText.classList.add("xcb-comment-hidden");
            hiddenCount++;
            incrementHideCount(username, commentTextContent);
            const notice = document.createElement("div");
            notice.className = "xcb-blocked-notice";
            notice.textContent = "Comment hidden from blocked user";
            const showBtn = document.createElement("button");
            showBtn.className = "xcb-show-btn";
            showBtn.textContent = "Show";
            showBtn.onclick = (e) => {
              e.preventDefault();
              if (commentText.classList.contains("xcb-comment-hidden")) {
                commentText.classList.remove("xcb-comment-hidden");
                showBtn.textContent = "Hide";
              } else {
                commentText.classList.add("xcb-comment-hidden");
                showBtn.textContent = "Show";
              }
            };
            notice.appendChild(showBtn);
            commentText.parentNode.insertBefore(notice, commentText);
          }
        } else {
          comment.classList.add("xcb-comment-soft-blocked");
          if (commentText) {
            const matchedKeyword = containsKeyword(commentText.textContent);
            if (matchedKeyword && !comment.querySelector(".xcb-keyword-notice")) {
              comment.classList.add("xcb-comment-keyword");
              commentText.classList.add("xcb-comment-hidden");
              hiddenCount++;
              const stats = getStats();
              stats.keywordHidden++;
              saveStats(stats);
              const notice = document.createElement("div");
              notice.className = "xcb-keyword-notice";
              notice.textContent = `Hidden: contains "${matchedKeyword}"`;
              const showBtn = document.createElement("button");
              showBtn.className = "xcb-show-btn";
              showBtn.textContent = "Show";
              showBtn.onclick = (e) => {
                e.preventDefault();
                if (commentText.classList.contains("xcb-comment-hidden")) {
                  commentText.classList.remove("xcb-comment-hidden");
                  showBtn.textContent = "Hide";
                } else {
                  commentText.classList.add("xcb-comment-hidden");
                  showBtn.textContent = "Show";
                }
              };
              notice.appendChild(showBtn);
              commentText.parentNode.insertBefore(notice, commentText);
            } else {
              const matchedHighlightedKeyword = containsHighlightedKeyword(commentText.textContent);
              if (matchedHighlightedKeyword && !comment.querySelector(".xcb-highlighted-keyword-notice")) {
                comment.classList.add("xcb-comment-highlighted-keyword");
                const originalHTML = commentText.innerHTML;
                const regex = new RegExp(`(${matchedHighlightedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
                commentText.innerHTML = originalHTML.replace(regex, '<span class="xcb-keyword-highlight">$1</span>');
                const notice = document.createElement("div");
                notice.className = "xcb-highlighted-keyword-notice";
                notice.innerHTML = `<i class="ph-bold ph-eye"></i> Contains: "${matchedHighlightedKeyword}"`;
                commentText.parentNode.insertBefore(notice, commentText);
              }
            }
          }
          if (shouldShowTools() && commentText && !comment.querySelector(".xcb-soft-reply-btn")) {
            const softReplyBtn = document.createElement("button");
            softReplyBtn.className = "xcb-quick-reply-btn xcb-soft-reply-btn";
            softReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
            softReplyBtn.title = "Quick reply to soft-blocked user";
            softReplyBtn.style.cssText = "margin-left: 10px;";
            softReplyBtn.onclick = (e) => {
              e.preventDefault();
              if (doQuickReply(username, "neutral")) {
                softReplyBtn.textContent = "Ready!";
                setTimeout(() => {
                  softReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
                }, 2e3);
              }
            };
            const moreRepliesBtn = document.createElement("button");
            moreRepliesBtn.className = "xcb-quick-reply-btn xcb-more-replies-btn";
            moreRepliesBtn.textContent = "▾";
            moreRepliesBtn.title = "Choose from all reply templates";
            moreRepliesBtn.style.cssText = "margin-left: 2px; padding: 4px 6px; min-width: auto;";
            moreRepliesBtn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              showQuickReplyPicker(username, moreRepliesBtn);
            };
            const userNameDiv2 = comment.querySelector(".user-name");
            if (userNameDiv2) {
              userNameDiv2.appendChild(softReplyBtn);
              userNameDiv2.appendChild(moreRepliesBtn);
            }
          }
        }
      } else if (isTrusted(username)) {
        comment.classList.add("xcb-comment-trusted");
        if (commentText) {
          const matchedHighlightedKeyword = containsHighlightedKeyword(commentText.textContent);
          if (matchedHighlightedKeyword && !comment.querySelector(".xcb-highlighted-keyword-notice")) {
            comment.classList.add("xcb-comment-highlighted-keyword");
            const originalHTML = commentText.innerHTML;
            const regex = new RegExp(`(${matchedHighlightedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
            commentText.innerHTML = originalHTML.replace(regex, '<span class="xcb-keyword-highlight">$1</span>');
            const notice = document.createElement("div");
            notice.className = "xcb-highlighted-keyword-notice";
            notice.innerHTML = `<i class="ph-bold ph-eye"></i> Contains: "${matchedHighlightedKeyword}"`;
            commentText.parentNode.insertBefore(notice, commentText);
          }
        }
        if (shouldShowTools() && commentText && !isOwnComment && !comment.querySelector(".xcb-trusted-reply-btn")) {
          const trustedReplyBtn = document.createElement("button");
          trustedReplyBtn.className = "xcb-quick-reply-btn xcb-trusted-reply-btn";
          trustedReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
          trustedReplyBtn.title = "Quick reply to trusted user";
          trustedReplyBtn.style.cssText = "margin-left: 10px;";
          trustedReplyBtn.onclick = (e) => {
            e.preventDefault();
            if (doQuickReply(username, "trusted")) {
              trustedReplyBtn.textContent = "Ready!";
              setTimeout(() => {
                trustedReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
              }, 2e3);
            }
          };
          const moreRepliesBtn = document.createElement("button");
          moreRepliesBtn.className = "xcb-quick-reply-btn xcb-more-replies-btn";
          moreRepliesBtn.textContent = "▾";
          moreRepliesBtn.title = "Choose from all reply templates";
          moreRepliesBtn.style.cssText = "margin-left: 2px; padding: 4px 6px; min-width: auto;";
          moreRepliesBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showQuickReplyPicker(username, moreRepliesBtn);
          };
          const userNameDiv2 = comment.querySelector(".user-name");
          if (userNameDiv2) {
            userNameDiv2.appendChild(trustedReplyBtn);
            userNameDiv2.appendChild(moreRepliesBtn);
          }
        }
      } else if (commentText) {
        const matchedKeyword = containsKeyword(commentText.textContent);
        if (matchedKeyword) {
          comment.classList.add("xcb-comment-keyword");
          if (!comment.querySelector(".xcb-keyword-notice")) {
            commentText.classList.add("xcb-comment-hidden");
            hiddenCount++;
            const stats = getStats();
            stats.keywordHidden++;
            saveStats(stats);
            const notice = document.createElement("div");
            notice.className = "xcb-keyword-notice";
            notice.textContent = `Hidden: contains "${matchedKeyword}"`;
            const showBtn = document.createElement("button");
            showBtn.className = "xcb-show-btn";
            showBtn.textContent = "Show";
            showBtn.onclick = (e) => {
              e.preventDefault();
              if (commentText.classList.contains("xcb-comment-hidden")) {
                commentText.classList.remove("xcb-comment-hidden");
                showBtn.textContent = "Hide";
              } else {
                commentText.classList.add("xcb-comment-hidden");
                showBtn.textContent = "Show";
              }
            };
            notice.appendChild(showBtn);
            commentText.parentNode.insertBefore(notice, commentText);
          }
        } else {
          const matchedHighlightedKeyword = containsHighlightedKeyword(commentText.textContent);
          if (matchedHighlightedKeyword && !comment.querySelector(".xcb-highlighted-keyword-notice")) {
            comment.classList.add("xcb-comment-highlighted-keyword");
            const originalHTML = commentText.innerHTML;
            const regex = new RegExp(`(${matchedHighlightedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
            commentText.innerHTML = originalHTML.replace(regex, '<span class="xcb-keyword-highlight">$1</span>');
            const notice = document.createElement("div");
            notice.className = "xcb-highlighted-keyword-notice";
            notice.innerHTML = `<i class="ph-bold ph-eye"></i> Contains: "${matchedHighlightedKeyword}"`;
            commentText.parentNode.insertBefore(notice, commentText);
          }
        }
        if (shouldShowTools() && !isOwnComment && !comment.querySelector(".xcb-neutral-reply-btn")) {
          const neutralReplyBtn = document.createElement("button");
          neutralReplyBtn.className = "xcb-quick-reply-btn xcb-neutral-reply-btn";
          neutralReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
          neutralReplyBtn.title = "Quick reply to user";
          neutralReplyBtn.style.cssText = "margin-left: 10px;";
          neutralReplyBtn.onclick = (e) => {
            e.preventDefault();
            if (doQuickReply(username, "neutral")) {
              neutralReplyBtn.textContent = "Ready!";
              setTimeout(() => {
                neutralReplyBtn.innerHTML = '<i class="ph-bold ph-chat-dots"></i> Reply';
              }, 2e3);
            }
          };
          const moreRepliesBtn = document.createElement("button");
          moreRepliesBtn.className = "xcb-quick-reply-btn xcb-more-replies-btn";
          moreRepliesBtn.textContent = "▾";
          moreRepliesBtn.title = "Choose from all reply templates";
          moreRepliesBtn.style.cssText = "margin-left: 2px; padding: 4px 6px; min-width: auto;";
          moreRepliesBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showQuickReplyPicker(username, moreRepliesBtn);
          };
          const userNameDiv2 = comment.querySelector(".user-name");
          if (userNameDiv2) {
            userNameDiv2.appendChild(neutralReplyBtn);
            userNameDiv2.appendChild(moreRepliesBtn);
          }
        }
      }
      if (shouldShowTools()) {
        const isHardBlocked = (blockedUser == null ? void 0 : blockedUser.level) === "hard";
        if (settings.requestsEnabled !== false && !settings.requestsPaused && !isOwnComment && !isHardBlocked && !comment.querySelector(".xcb-add-request-btn")) {
          const addRequestBtn = document.createElement("button");
          addRequestBtn.className = "xcb-add-request-btn";
          addRequestBtn.textContent = "+ Request";
          addRequestBtn.title = "Save this comment as a request";
          addRequestBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const commentTextEl = comment.querySelector(".detail p");
            const commentText2 = commentTextEl ? commentTextEl.innerText.trim() : "";
            const rect = addRequestBtn.getBoundingClientRect();
            showRequestPopup(
              rect.left,
              rect.bottom + 5,
              username,
              commentText2,
              window.location.href
            );
          };
          const userNameDiv2 = comment.querySelector(".user-name");
          if (userNameDiv2) {
            userNameDiv2.appendChild(addRequestBtn);
          }
        }
        if (settings.notesEnabled !== false && !isOwnComment && !isHardBlocked && !comment.querySelector(".xcb-add-note-btn")) {
          const addNoteBtn = document.createElement("button");
          addNoteBtn.className = "xcb-add-note-btn";
          addNoteBtn.innerHTML = '<i class="ph-bold ph-note-pencil"></i> Note';
          addNoteBtn.title = "Save this comment as a note";
          addNoteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const commentTextEl = comment.querySelector(".detail p");
            const commentText2 = commentTextEl ? commentTextEl.innerText.trim() : "";
            const rect = addNoteBtn.getBoundingClientRect();
            showNotePopup(
              rect.left,
              rect.bottom + 5,
              username,
              commentText2,
              window.location.href
            );
          };
          const userNameDiv2 = comment.querySelector(".user-name");
          if (userNameDiv2) {
            userNameDiv2.appendChild(addNoteBtn);
          }
        }
      }
    });
    updateHiddenCounter();
  }
  function processUserProfilePage() {
    var _a, _b, _c, _d, _e, _f;
    const userMatch = window.location.pathname.match(/^\/user\/([^\/]+)\/?$/i);
    if (!userMatch) return;
    const username = decodeURIComponent(userMatch[1]);
    if (isMyUsername(username) || isWhitelisted(username)) return;
    const profileHeader = document.querySelector("h1, .box-info-heading");
    if (!profileHeader || profileHeader.dataset.xcbProcessed) return;
    profileHeader.dataset.xcbProcessed = "true";
    const container = document.createElement("div");
    container.style.marginTop = "10px";
    const blockedUser = getBlockedUser(username);
    const trustedUser = getTrustedUser(username);
    if (blockedUser) {
      let blockStatus = `BLOCKED (${blockedUser.level})`;
      let expiryInfo = "";
      if (blockedUser.expiry) {
        const now = Date.now();
        const remaining = blockedUser.expiry - now;
        const expiryDate = new Date(blockedUser.expiry);
        const days = Math.floor(remaining / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(
          remaining % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
        );
        let timeLeft = "";
        if (days > 0) {
          timeLeft = `${days} day${days > 1 ? "s" : ""}`;
          if (hours > 0) timeLeft += `, ${hours} hour${hours > 1 ? "s" : ""}`;
        } else if (hours > 0) {
          timeLeft = `${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
          timeLeft = "less than 1 hour";
        }
        blockStatus = `TEMPORARILY BLOCKED`;
        expiryInfo = `<div style="color: #f59e0b; font-size: 12px; margin: 5px 0;">
                    ⏱ Expires in <strong>${timeLeft}</strong><br>
                    <span style="color: #888;">Unblocks on: ${formatDateTime(expiryDate, true)}</span>
                </div>`;
      }
      container.innerHTML = `
                <div class="xcb-profile-indicator">${blockStatus}</div>
                ${expiryInfo}
                ${blockedUser.note ? `<div style="color: #888; font-size: 12px; margin: 5px 0;">Note: ${blockedUser.note}</div>` : ""}
                <br>
                <button class="xcb-profile-btn" id="xcbUnblock">Unblock</button>
                <button class="xcb-profile-btn xcb-profile-btn-trust" id="xcbMoveToTrust">Move to Trusted</button>
            `;
    } else if (trustedUser) {
      container.innerHTML = `
                <div class="xcb-profile-indicator xcb-profile-indicator-trust"><i class="ph-bold ph-check-circle"></i> TRUSTED</div>
                ${trustedUser.note ? `<div style="color: #888; font-size: 12px; margin: 5px 0;">Note: ${trustedUser.note}</div>` : ""}
                <br>
                <button class="xcb-profile-btn xcb-profile-btn-trust" id="xcbUntrust">Remove from Trusted</button>
                <button class="xcb-profile-btn" id="xcbMoveToBlock">Move to Block List</button>
            `;
    } else {
      container.innerHTML = `
                <div style="display: inline-block; position: relative;">
                    <button class="xcb-profile-btn" id="xcbBlock"><i class="ph-bold ph-prohibit"></i> Block ▾</button>
                </div>
                <button class="xcb-profile-btn xcb-profile-btn-trust" id="xcbTrust"><i class="ph-bold ph-check-circle"></i> Trust</button>
            `;
    }
    profileHeader.parentNode.insertBefore(container, profileHeader.nextSibling);
    (_a = container.querySelector("#xcbUnblock")) == null ? void 0 : _a.addEventListener("click", () => {
      removeFromBlocklist(username);
      location.reload();
    });
    (_b = container.querySelector("#xcbMoveToTrust")) == null ? void 0 : _b.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromBlocklist(username);
      addToTrustedlist(username);
      const rect = e.target.getBoundingClientRect();
      showQuickTagPopup(rect.left, rect.bottom + 5, username, "trust");
    });
    (_c = container.querySelector("#xcbUntrust")) == null ? void 0 : _c.addEventListener("click", () => {
      removeFromTrustedlist(username);
      location.reload();
    });
    (_d = container.querySelector("#xcbMoveToBlock")) == null ? void 0 : _d.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = e.target.getBoundingClientRect();
      showBlockMenu(rect.left, rect.bottom + 5, username);
    });
    (_e = container.querySelector("#xcbBlock")) == null ? void 0 : _e.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = e.target.getBoundingClientRect();
      showBlockMenu(rect.left, rect.bottom + 5, username);
    });
    (_f = container.querySelector("#xcbTrust")) == null ? void 0 : _f.addEventListener("click", (e) => {
      e.stopPropagation();
      addToTrustedlist(username);
      const rect = e.target.getBoundingClientRect();
      showQuickTagPopup(rect.left, rect.bottom + 5, username, "trust");
    });
  }
  function isCloudflareChallenge() {
    const title = document.title.toLowerCase();
    if (title.includes("just a moment") || title.includes("cloudflare")) {
      return true;
    }
    const cfChallenge = document.querySelector("#challenge-running, #challenge-form, .cf-browser-verification, #cf-wrapper");
    if (cfChallenge) {
      return true;
    }
    return false;
  }
  function showLoginRequiredScreen() {
    applyCustomStyles();
    document.querySelectorAll(".xcb-overlay, .xcb-login-required-panel").forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "xcb-overlay";
    const panel = document.createElement("div");
    const themeClass = getThemeClassName(getSettings());
    panel.className = `xcb-setup-panel xcb-login-required-panel ${themeClass}`;
    panel.style.cssText = "max-width: 400px;";
    panel.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 16px; color: #f59e0b;"><i class="ph-bold ph-sign-in"></i></div>
    <h2 style="margin-bottom: 16px;">Welcome to MaNKeY-Bot!</h2>
    <p style="margin: 10px 0; padding: 12px; background: #f59e0b20; border: 1px solid #f59e0b; border-radius: 6px; color: #f59e0b;">
      <i class="ph-bold ph-warning"></i> <strong>Login Required</strong>
    </p>
    <p style="color: var(--xcb-muted); margin: 15px 0; line-height: 1.6;">
      Please log in to your 1337x account first, then refresh this page to continue setup.
    </p>
    <p style="color: var(--xcb-muted); font-size: 12px; margin: 15px 0;">
      This tool is designed for uploaders to manage comments on their uploads.
    </p>
    <button id="xcbLoginDismiss" class="xcb-setup-btn" style="background: #f59e0b;">
      <i class="ph-bold ph-check"></i> Got it
    </button>
  `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    document.getElementById("xcbLoginDismiss").onclick = () => {
      overlay.remove();
      panel.remove();
    };
    overlay.onclick = () => {
      overlay.remove();
      panel.remove();
    };
  }
  function showRankVerificationScreen() {
    applyCustomStyles();
    document.querySelectorAll(".xcb-overlay, .xcb-rank-verify-panel").forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "xcb-overlay";
    const panel = document.createElement("div");
    const themeClass = getThemeClassName(getSettings());
    panel.className = `xcb-setup-panel xcb-rank-verify-panel ${themeClass}`;
    panel.style.cssText = "max-width: 450px;";
    const isOnAccountPage = window.location.pathname.includes("/account");
    const isOnUploadPage = window.location.pathname.includes("/upload");
    let detectedRank = isOnAccountPage ? getUserRank() : null;
    let detectedUsername = isOnAccountPage ? getLoggedInUsername() : null;
    if (!detectedRank && isOnUploadPage) {
      if (detectMemberFromUploadPage()) {
        detectedRank = "Member";
      } else if (detectUploaderFromUploadPage()) {
        detectedRank = null;
      }
    }
    if (isOnAccountPage && detectedRank && detectedUsername) {
      panel.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px; color: #22c55e;"><i class="ph-bold ph-user-check"></i></div>
      <h2 style="margin-bottom: 16px;">Account Verification</h2>
      <p style="color: var(--xcb-muted); margin: 15px 0; line-height: 1.6;">
        We detected your account information:
      </p>
      <div style="background: var(--xcb-section-bg); padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
        <div style="margin-bottom: 8px;"><strong>Username:</strong> <span style="color: #22c55e;">${detectedUsername}</span></div>
        <div><strong>Rank:</strong> <span style="color: ${detectedRank === "Member" ? "#f59e0b" : "#22c55e"};">${detectedRank}</span></div>
      </div>
      ${detectedRank === "Member" ? `
        <p style="margin: 10px 0; padding: 12px; background: #f59e0b20; border: 1px solid #f59e0b; border-radius: 6px; color: #f59e0b; font-size: 13px;">
          <i class="ph-bold ph-warning"></i> <strong>Note:</strong> This tool is designed for uploaders. Members have limited access.
        </p>
      ` : ""}
      <button id="xcbVerifyRank" class="xcb-setup-btn" style="background: #22c55e; margin-top: 10px;">
        <i class="ph-bold ph-check"></i> Verify & Continue
      </button>
    `;
      document.body.appendChild(overlay);
      document.body.appendChild(panel);
      document.getElementById("xcbVerifyRank").onclick = () => {
        setVerifiedUsername(detectedUsername);
        setVerifiedRank(detectedRank);
        setMyUsername(detectedUsername);
        overlay.remove();
        panel.remove();
        if (detectedRank === "Member") {
          initializeScript();
        } else {
          const settings = getSettings();
          if (!settings.setupSkipped) {
            showSetupPanel();
          } else {
            initializeScript();
          }
        }
      };
    } else if (isOnUploadPage && detectedRank === "Member") {
      panel.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px; color: #f59e0b;"><i class="ph-bold ph-warning-circle"></i></div>
      <h2 style="margin-bottom: 16px;">Member Account Detected</h2>
      <p style="color: var(--xcb-muted); margin: 15px 0; line-height: 1.6;">
        Based on this page, your account appears to be a <strong style="color: #f59e0b;">Member</strong> (non-uploader).
      </p>
      <p style="margin: 10px 0; padding: 12px; background: #f59e0b20; border: 1px solid #f59e0b; border-radius: 6px; color: #f59e0b; font-size: 13px;">
        <i class="ph-bold ph-info"></i> MaNKeY-Bot is designed for uploaders to manage comments. Members have limited access until they become uploaders.
      </p>
      <p style="margin: 10px 0; font-size: 12px; color: var(--xcb-muted);">
        <i class="ph-bold ph-lightbulb"></i> <strong>Tip:</strong> If your upload application was rejected, check the <a href="/rules" target="_blank" style="color: #60a5fa;">site rules</a> or visit the <a href="https://chat.1337x.to/" target="_blank" style="color: #60a5fa;">chat room</a> for guidance.
      </p>
      <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; justify-content: center;">
        <button id="xcbConfirmMember" class="xcb-setup-btn" style="background: #f59e0b;">
          <i class="ph-bold ph-check"></i> I'm a Member
        </button>
        <button id="xcbVerifyAccount" class="xcb-setup-btn" style="background: var(--xcb-panel-tertiary-bg); border: 1px solid var(--xcb-panel-border); color: var(--xcb-muted);">
          <i class="ph-bold ph-arrows-clockwise"></i> Verify on Account Page
        </button>
      </div>
    `;
      document.body.appendChild(overlay);
      document.body.appendChild(panel);
      document.getElementById("xcbConfirmMember").onclick = () => {
        setVerifiedRank("Member");
        overlay.remove();
        panel.remove();
        initializeScript();
      };
      document.getElementById("xcbVerifyAccount").onclick = () => {
        window.location.href = "/account";
      };
    } else {
      panel.innerHTML = `
      <button id="xcbVerifyClose" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; color: var(--xcb-muted); cursor: pointer; font-size: 20px; padding: 4px; line-height: 1;" title="Close">
        <i class="ph-bold ph-x"></i>
      </button>
      <div style="font-size: 48px; margin-bottom: 16px; color: #3b82f6;"><i class="ph-bold ph-identification-badge"></i></div>
      <h2 style="margin-bottom: 16px;">Account Verification Required</h2>
      <p style="color: var(--xcb-muted); margin: 15px 0; line-height: 1.6;">
        Before using MaNKeY-Bot, we need to verify your account rank to ensure you have uploader privileges.
      </p>
      <p style="margin: 10px 0; padding: 12px; background: #3b82f620; border: 1px solid #3b82f6; border-radius: 6px; color: #3b82f6; font-size: 13px;">
        <i class="ph-bold ph-info"></i> Click the button below to go to your Account page for verification.
      </p>
      <button id="xcbGoToAccount" class="xcb-setup-btn" style="background: #3b82f6; margin-top: 10px;">
        <i class="ph-bold ph-arrow-right"></i> Go to Account Page
      </button>
    `;
      document.body.appendChild(overlay);
      document.body.appendChild(panel);
      const closeModal = () => {
        overlay.remove();
        panel.remove();
      };
      document.getElementById("xcbVerifyClose").onclick = closeModal;
      overlay.onclick = closeModal;
      document.getElementById("xcbGoToAccount").onclick = () => {
        window.location.href = "/account";
      };
    }
  }
  function showMemberLockedScreen() {
    applyCustomStyles();
    document.querySelectorAll(".xcb-overlay, .xcb-member-locked-panel").forEach((el) => el.remove());
    const overlay = document.createElement("div");
    overlay.className = "xcb-overlay";
    const panel = document.createElement("div");
    const themeClass = getThemeClassName(getSettings());
    panel.className = `xcb-setup-panel xcb-member-locked-panel ${themeClass}`;
    panel.style.cssText = "max-width: 500px;";
    panel.innerHTML = `
    <button id="xcbMemberLockClose" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; color: var(--xcb-muted); cursor: pointer; font-size: 20px; padding: 4px; line-height: 1;" title="Close">
      <i class="ph-bold ph-x"></i>
    </button>
    <div style="font-size: 48px; margin-bottom: 16px; color: #ef4444;"><i class="ph-bold ph-lock"></i></div>
    <h2 style="margin-bottom: 16px;">Uploader Access Required</h2>
    <p style="color: var(--xcb-muted); margin: 15px 0; line-height: 1.6;">
      MaNKeY-Bot is designed specifically for <strong>uploaders</strong> to manage comments on their torrents.
      Your account is currently a <span style="color: #f59e0b; font-weight: bold;">Member</span>.
    </p>

    <div style="background: var(--xcb-section-bg); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #22c55e;">
      <h3 style="color: #22c55e; margin: 0 0 12px 0; font-size: 16px;"><i class="ph-bold ph-rocket-launch"></i> Want to become an Uploader?</h3>
      <p style="color: var(--xcb-muted); margin: 0 0 15px 0; font-size: 13px; line-height: 1.6;">
        Becoming an uploader on 1337x gives you the ability to share content with the community. Here's how:
      </p>
      <ol style="color: var(--xcb-secondary); margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
        <li>Go to the <strong>Upload</strong> page on 1337x</li>
        <li>Read the <strong>upload rules</strong> carefully</li>
        <li>Wait for staff approval (usually 24-48 hours)</li>
        <li>Once approved, you'll be promoted to <strong>Trial Uploader</strong></li>
      </ol>
    </div>

    <div style="background: var(--xcb-section-bg); padding: 20px; border-radius: 8px; margin: 0 0 20px 0; text-align: left; border-left: 4px solid #f59e0b;">
      <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 16px;"><i class="ph-bold ph-question"></i> Application Rejected?</h3>
      <p style="color: var(--xcb-muted); margin: 0; font-size: 13px; line-height: 1.6;">
        If your application was rejected, check the <a href="/rules" target="_blank" style="color: #60a5fa; text-decoration: underline;">Site Rules</a> page for upload requirements.
        You can also visit the <strong>1337x Chat Room</strong> to get guidance from experienced uploaders and staff — the chat rules recommend this for rejected applicants.
      </p>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; justify-content: center;">
      <a href="/upload" class="xcb-setup-btn" style="background: #22c55e; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        <i class="ph-bold ph-upload-simple"></i> Go to Upload Page
      </a>
      <a href="/rules" target="_blank" class="xcb-setup-btn" style="background: #3b82f6; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        <i class="ph-bold ph-book-open"></i> Site Rules
      </a>
      <a href="https://chat.1337x.to/" target="_blank" class="xcb-setup-btn" style="background: #f59e0b; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        <i class="ph-bold ph-chats-circle"></i> Visit Chat Room
      </a>
      <button id="xcbReVerify" class="xcb-setup-btn" style="background: var(--xcb-panel-tertiary-bg); border: 1px solid var(--xcb-panel-border); color: var(--xcb-muted);">
        <i class="ph-bold ph-arrows-clockwise"></i> Re-verify Rank
      </button>
    </div>

    <p style="color: var(--xcb-muted); font-size: 11px; margin-top: 20px;">
      <i class="ph-bold ph-info"></i> If you've already been promoted, click "Re-verify Rank" to update your status.
    </p>
  `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    const closeModal = () => {
      overlay.remove();
      panel.remove();
    };
    document.getElementById("xcbMemberLockClose").onclick = closeModal;
    overlay.onclick = closeModal;
    document.getElementById("xcbReVerify").onclick = () => {
      clearVerifiedRank();
      overlay.remove();
      panel.remove();
      window.location.href = "/account";
    };
  }
  function waitForCloudflareAndInit() {
    if (isCloudflareChallenge()) {
      setTimeout(waitForCloudflareAndInit, 500);
      return;
    }
    const settings = getSettings();
    const loggedIn = isLoggedInToSite();
    const rankVerified = isRankVerified();
    hasUploaderAccess();
    const isMember = isMemberRank();
    if (rankVerified && isMember) {
      initializeScript();
      return;
    }
    if (!getMyUsername() && !settings.setupSkipped) {
      if (!loggedIn) {
        showLoginRequiredScreen();
        return;
      }
      if (!rankVerified) {
        showRankVerificationScreen();
        return;
      }
      if (isMemberRank()) {
        initializeScript();
        return;
      }
      applyCustomStyles();
      showSetupPanel();
      return;
    }
    if (!rankVerified && loggedIn) {
      if (window.location.pathname.includes("/account")) {
        const detectedRank = getUserRank();
        const detectedUsername = getLoggedInUsername();
        if (detectedRank && detectedUsername) {
          setVerifiedRank(detectedRank);
          setVerifiedUsername(detectedUsername);
          if (detectedRank === "Member") {
            initializeScript();
            return;
          }
        }
      }
      if (window.location.pathname.includes("/upload")) {
        if (detectMemberFromUploadPage()) {
          setVerifiedRank("Member");
          initializeScript();
          return;
        } else if (detectUploaderFromUploadPage()) ;
      }
    }
    if (window.location.pathname.includes("/upload") && !rankVerified && loggedIn) {
      if (detectMemberFromUploadPage()) {
        setVerifiedRank("Member");
        initializeScript();
        return;
      }
    }
    initializeScript();
  }
  waitForCloudflareAndInit();
})();
