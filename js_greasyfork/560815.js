// ==UserScript==
// @name         Discord Redirect
// @namespace    https://www.discord.com
// @version      1.0
// @description  redirect from main discord.com page to discord.com/channels/@me so you directly land on the server overview page
// @author       Agreasyforkuser
// @match        https://discord.com/
// @icon         https://www.google.com/s2/favicons?domain=https://discord.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560815/Discord%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/560815/Discord%20Redirect.meta.js
// ==/UserScript==

window.location.replace ("https://discord.com/channels/@me")

