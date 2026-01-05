// ==UserScript==
// @name          WME Maximized (Basic)
// @version       0.4.7 (Beta)
// @namespace     http://greasyfork.org
// @description	  Modifies the Waze Map Editor layout to provide a larger viewing area for editing, adds additional navigation links to menu, and prevents Place Update and UR panels from dropping below visible area.
// @author        SeekingSerenity
// @homepage      https://greasyfork.org/en/scripts/6238-wme-maximized-basic
// @include       https://www.waze.com/*
// @include       https://wiki.waze.com/*
// @include       https://editor-beta.waze.com/*     
// @run-at        document-start
// @grant         none
// @thx	          SuperMedic for function begin() and integration support
// @downloadURL https://update.greasyfork.org/scripts/6238/WME%20Maximized%20%28Basic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6238/WME%20Maximized%20%28Basic%29.meta.js
// ==/UserScript==

function begin() { 
   if(typeof($)==='function'){
       addLinks();
   } else {
       console.info('no Jquery');
       window.setTimeout(begin,400);
   }
}  

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
function addLinks() {
   $("ul.waze-header-menu").append('<li><a href="https://www.waze.com/editor">EDITOR</a></li>');
   $("ul.waze-header-menu").append('<li><a href="https://www.waze.com/forum" target="_blank">FORUM</a></li>');
   $("ul.waze-header-menu").append('<li><a href="https://www.waze.com/forum/ucp.php?i=pm&folder=inbox" target="_blank">INBOX</a></li>');
   $("ul.waze-header-menu").append('<li><a href="https://wiki.waze.com/wiki" target="_blank">WIKI</a></li>');
}

addGlobalStyle('.chat-intro-tip { display: none !important; }');
addGlobalStyle('.waze-header { height: 24px !important;  line-height: 26px !important; }');
addGlobalStyle('.waze-header-contents { margin-left: 0px !important; width: 100% !important; }');
addGlobalStyle('.waze-header-logo { background-size: 60px !important; margin: 4px 0px auto auto !important; background-position: top center !important; }');
addGlobalStyle('.waze-header-menu { line-height: 25px !important; font-size: 11px !important; }');
addGlobalStyle('.waze-header-menu li a { padding: 0px 10px !important; }');
addGlobalStyle('.waze-header .login-view { padding-right: 15px !important; }');
addGlobalStyle('#login-status { margin-right: 5px !important; }');
addGlobalStyle('#header-actions, .waze-header .login-view .login-button, .waze-header .navigation { right: 20px !important; }');
addGlobalStyle('#map-search { line-height: 60px !important; }');
addGlobalStyle('#edit-buttons { width: 292px !important; }');
addGlobalStyle('#toolbar.toolbar-button { width: 25px !important; height: 25px !important; }');
addGlobalStyle('.toolbar-sprite, .toolbar-addplace, .toolbar-addroad, .toolbar-layers, .toolbar-redo, .toolbar-save, .toolbar-trash, .toolbar-undo, #toolbar #layer-switcher-menu:after, #edit-buttons .toolbar-button.toolbar-group-drawing::after, #edit-buttons .toolbar-button.toolbar-group-venues::after, #edit-buttons .toolbar-button.WazeControlUndoControl::after, #edit-buttons .toolbar-button.WazeControlRedoControl::after, #edit-buttons .toolbar-button.WazeControlSave::after, #edit-buttons .toolbar-button.WazeControlDeleteFeature::after, #map-lightbox .content .header .toolbar .toolbar-addplace, #map-lightbox .content .header .toolbar .toolbar-addroad, #map-lightbox .content .header .toolbar .toolbar-layers, #map-lightbox .content .header .toolbar .toolbar-redo, #map-lightbox .content .header .toolbar .toolbar-save, #map-lightbox .content .header .toolbar .toolbar-trash, #map-lightbox .content .header .toolbar .toolbar-undo, #toolbar #layer-switcher-menu a span { background-size: 25px 175px !important; }');
addGlobalStyle('#map-search, #toolbar { height: 40px !important; line-height: 40px !important; }');
addGlobalStyle('#map-search { max-width: 280px !important; }');
addGlobalStyle('#map-search .input-wrapper .input-addon-left { margin-top: 8px !important; }');
addGlobalStyle('#toolbar .toolbar-button:after { width: 25px !important; height: 25px !important; top: 9px !important; }');
addGlobalStyle('#edit-buttons .toolbar-button.toolbar-group-drawing:after { background-position: 0px -25px !important; }');
addGlobalStyle('#edit-buttons .toolbar-button.WazeControlDeleteFeature:after { background-position: 0px -125px !important; }');
addGlobalStyle('#edit-buttons .toolbar-button.WazeControlRedoControl:after { background-position: 0px -75px !important; }');
addGlobalStyle('#edit-buttons .toolbar-button.WazeControlUndoControl:after { background-position: 0px -150px !important; }');
addGlobalStyle('#edit-buttons .toolbar-button.WazeControlSave:after { background-position: 0px -100px !important; }'); 
addGlobalStyle('#toolbar #layer-switcher-menu a span, #toolbar #layer-switcher-menu:after { width: 25px !important; height: 25px !important; background-position: 0px -50px !important; }');
addGlobalStyle('#toolbar .toolbar-button, #layer-switcher, #layer-switcher .dropdown a { width: 42px !important; height: 40px !important; }'); 
addGlobalStyle('#layer-switcher .dropdown-menu { top: 39px !important; line-height: 18px !important; }');
addGlobalStyle('#toolbar .toolbar-separator { height: 40px !important; }');
addGlobalStyle('#sidebar { max-width: 260px !important; }');
addGlobalStyle('.show-sidebar .row-fluid .fluid-fixed { margin-left: 260px !important; }');
addGlobalStyle('#user-info h2 { display:none !important; }');
addGlobalStyle('#sidebar #user-details .rank span  { margin: 0px !important; }');
addGlobalStyle('#sidebar .message { font-size: 12px !important; line-height: 14px  !important; margin: 5px  !important; }');
addGlobalStyle('.tips { display: none !important; }');
addGlobalStyle('#sidebar .tab-content { margin-bottom: 35px !important; padding: 3px 3px 10px 0px !important; }');
addGlobalStyle('#sidebar #sidepanel-prefs .tab-content { padding: 0px !important; }');
addGlobalStyle('#sidebar #sidepanel-prefs .controls .btn-group { right: 20px !important; }');
addGlobalStyle('table.add-alt-street-form { table-layout: fixed !important; }');
addGlobalStyle('.alt-street-form-template > td:nth-child(2) { padding-bottom: 41px !important; }');
addGlobalStyle('.alt-street-form-template > td:nth-child(3) { padding-bottom: 45px !important; }');
addGlobalStyle('#edit-panel .address-form-actions { margin-top: 0px !important; }');
addGlobalStyle('ul.typeahead .dropdown-menu { width: 100px !important; }');
addGlobalStyle('.typeahead .dropdown-menu > li > a { padding: 3px !important; font-size: 11px !important; }');
addGlobalStyle('.nav > li > a { padding: 4px !important; }');
addGlobalStyle('#sidebar #links { width: 260px !important; font-size: 10px !important; background-color: #e9e9e9 !important; border-right: #dfdfdf thin solid !important; }');

/* Add Validator Styles
 */
addGlobalStyle('.c1249150122 span { width: 224px !important; white-space: normal !important; }');
addGlobalStyle('.c2952996808 { height: 180px !important; font-size: 12px !important; }');
addGlobalStyle('.c2952996808 label.checkbox { height: 34px !important; }');
addGlobalStyle('.c2952996808 label.checkbox span, #sidebar label { white-space: normal !important; overflow: visible !important; }');
addGlobalStyle('button.btn:nth-child(5) { margin-right: 0px !important; }');
addGlobalStyle('.side-panel-section:not(:last-child):after { margin: 5px 0px !important; }');
addGlobalStyle('.c1249150123 { width: 180px !important; }');

/* Add ScriptKit and WME AutoUR Styles
 */
addGlobalStyle('#sidepanel-scriptkit { margin-top: -5px !important; }');
addGlobalStyle('#sidepanel-scriptkit-imagebar { width: 237px !important; }');
addGlobalStyle('#sidepanel-scriptkit-imagebar button { width: 47px !important; height: 47px !important; }');
addGlobalStyle('#WMEAutoUR_Settings_Select  { font-size: 12px !important; width: 80% !important; }');
addGlobalStyle('#WMEAutoUR_SET_TAB > div:nth-child(1) > button:nth-child(4) { font-size: 11px !important; width: 20% !important; float: right !important; }');
addGlobalStyle('#WMEAutoUR_SET_TAB > div:nth-child(1) > button:nth-child(5) { font-size: 11px !important; width: 40% !important; }');
addGlobalStyle('#WMEAutoUR_Settings_customName { width: 60% !important; }');
addGlobalStyle('#WMEAutoUR_EDIT_TAB.tab-pane.active div button { font-size: 11px !important; width: 19.5% !important; }');

/* Chat Styles
addGlobalStyle('.room-name.single-room-label {font-size: 11px !important; padding-left: 8px !important; }');
addGlobalStyle('.dropdown .dropdown-toggle { padding-left: 5px !important; padding-right: 0px !important; }');
addGlobalStyle('.status { font-size: 11px !important; }');
addGlobalStyle('#ChatJumper-JUMP.ChatJumper, #ChatJumper-JUMP-clear { font-size: 11px !important; padding-left: 1px !important; padding-right: 1px !important; }');
 */

/* Add Toolbar Styles
 */
addGlobalStyle('.olControlAttribution { margin-left: 45px !important; }');
addGlobalStyle('#WMETB_NavBar.ui-draggable { z-index: 2000 !important; height: 37px !important; line-height: 22px !important; color: #000 !important; background-color: #dfdfdf !important; border: #59899E 2px solid !important; }');
addGlobalStyle('.WazeControlLayerSwitcherIcon { width: 40px !important; height: 40px !important; background-size: 25px 25px !important; float: none !important; }');

/* Add Place Image Styles
 */
addGlobalStyle('.modal-dialog {margin: 90px auto !important;}');

/* Add WME Place Update Fix
 */
addGlobalStyle('.place-update-edit .body {height:69vh !important; overflow-y:scroll !important;}');
addGlobalStyle('.panel.place-update-edit .image-preview, .panel.place-update-edit .missing-image {margin-top:5px !important;}');
addGlobalStyle('.panel.place-update-edit .header {line-height:32px !important;}');
addGlobalStyle('.panel.place-update-edit .request-details, .panel.place-update-edit .changes, .panel.place-update-edit .navigation {padding:5px 15px 15px !important;}');
addGlobalStyle('.panel.place-update-edit .actions {padding: 5px 15px 5px !important;}');

/* Add WME UR Panel Fix
 */
addGlobalStyle('#panel-container .panel { max-height:85vh !important; }');
addGlobalStyle('#panel-container .panel .header { line-height: 18px !important; }');
addGlobalStyle('.section .title { line-height: 26px !important; }');
addGlobalStyle('.more-info > div:nth-child(3){ padding-top: 8px !important; padding-bottom: 8px !important; }');
addGlobalStyle('#panel-container .panel .header .type { font-size: 16px !important; }');
addGlobalStyle('.collapsible.content {padding: 5px 5px !important; }');
addGlobalStyle('.problem-edit .conversation.section .comment-list { padding: 0px 0px !important;}');
addGlobalStyle('.problem-edit .conversation.section .comment-list li.comment { padding: 0px 10px !important; }');
addGlobalStyle('.problem-edit .conversation.section .comment .comment-content { padding: 0px 0px !important; }');
addGlobalStyle('.problem-edit .conversation.section .new-comment-form { padding: 10px 0px 0px !important; }');
addGlobalStyle('.actions.section .collapsible.content form.controls-container { width: 140px !important; float: left !important; padding-bottom: 10px !important; }');
addGlobalStyle('.problem-edit .actions .done { width: 30% !important; float: right !important; }');
addGlobalStyle('.problem-edit .actions .controls-container label { margin-bottom: 5px !important; }');
addGlobalStyle(' {}');
addGlobalStyle(' {}');

/* Add UR-MP Tracking Styles
 */
addGlobalStyle('p#urt-main-title { margin-top: 0px !important; }');
addGlobalStyle('section#sidepanel-urt { margin-left: -9px !important; }');
addGlobalStyle('#urmpt-tab-content { overflow-x: scroll !important; }');

/* Add Location Info Styles
 */
addGlobalStyle('.WazeControlLocationInfo { font-size: 14px !important; padding: 0px 10px !important; line-height: 30px !important; left: 50px !important; }');

/* Add Location Info Styles
 */
addGlobalStyle('#RSconditions, #RSoperations, #RSselection { text-indent: 0px !important; }');

/* Add WME Aerial Shifter Styles
 */
addGlobalStyle('#header-actions > div:nth-child(4) { right: 380px !important; }');


begin();