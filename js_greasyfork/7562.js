// ==UserScript==
// @name       Visual Wordpress Changes 
// @namespace none
// @version    20170727a
// @description  Just some stupid wordpress color changes so items stand out a bit more.
// @match      https://*/wp-admin/plugins.php
// @match      http://*/wp-admin/plugins.php
// @copyright  none
// @downloadURL https://update.greasyfork.org/scripts/7562/Visual%20Wordpress%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/7562/Visual%20Wordpress%20Changes.meta.js
// ==/UserScript==



// Function to add style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


/* Plugins Page */ 
/* For some reason it's always been hard for me to see the plugins that need to be updated. So I've adjusted that. */
addGlobalStyle(' .plugins .active.update td, .plugins .active.update th, tr.active.update+tr.plugin-update-tr .plugin-update, tr.active+tr.plugin-update-tr .plugin-update .update-message {background-color: rgba(202, 112, 23, 0.32); } ');
addGlobalStyle(' .plugins .active.update td, .plugins .active.update th, tr.active.update+tr.plugin-update-tr .plugin-update, tr.active+tr.plugin-update-tr .plugin-update .update-message a:link {font-weight: bold;font-size: 1.2em;} ');
