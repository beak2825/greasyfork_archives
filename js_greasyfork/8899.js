// ==UserScript==
// @name Monospace Keyboard Shortcut for Confluence
// @version 0.1
// @description Adds a new keyboard shortcut (Ctrl+Alt+S) for monospace formatting
// @match https://*/wiki/pages/editpage.action*
// @match https://*/wiki/pages/createpage.action*
// @grant none
// @namespace https://greasyfork.org/users/10099
// @downloadURL https://update.greasyfork.org/scripts/8899/Monospace%20Keyboard%20Shortcut%20for%20Confluence.user.js
// @updateURL https://update.greasyfork.org/scripts/8899/Monospace%20Keyboard%20Shortcut%20for%20Confluence.meta.js
// ==/UserScript==

tinymce.activeEditor.addShortcut("ctrl+alt+s","monospace","confMonospace");