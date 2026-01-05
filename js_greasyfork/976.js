// ==UserScript==
// @id             b77e78bb-5ab5-403b-ae45-7540077fbc64
// @name           Youtube - Right Side Description 
// @namespace      Takato
// @author         Takato
// @copyright      2010+, Takato (https://greasyfork.org/users/1158/)
// @licence        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International - Additional conditions apply; https://greasyfork.org/scripts/976/
// @description    Moves the video description to the right of the video, adds options for smaller video, retro player, retro style, and more
// @icon           https://i.imgur.com/RAHw2kQ.png https://i.imgur.com/qlQhuaa.png
// @icon64         https://i.imgur.com/qlQhuaa.png
// @resource       icon https://i.imgur.com/RAHw2kQ.png
// @resource       icon64 https://i.imgur.com/RAHw2kQ.png
// @version        2022.04.20
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @website        https://greasyfork.org/scripts/976/
// @homepageURL		 https://greasyfork.org/scripts/976/
// @noframes
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM.addStyle
// @grant          GM.getResourceUrl
// @compatible     firefox
// @compatible     chrome
// @include        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/976/Youtube%20-%20Right%20Side%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/976/Youtube%20-%20Right%20Side%20Description.meta.js
// ==/UserScript==
// This script is licenced under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (https://creativecommons.org/licenses/by-nc-sa/4.0/) with additional conditions. 
// See https://greasyfork.org/scripts/976/ for full details of the licence and conditions.
(async function() {

var script = {};
script.version = "2022.04.20";

// SETTINGS -----------------------------

// Available by hovering over the Youtube header on a video page. The settings button will appear.

// --------------------------------------

// Don't edit the code! All settings are available by clicking the button in the Youtube header. Suggest changes in the discussion/feedback section.

// Defining static script properties
script.name = "Right Side Description"; // Previously known as Better Watch Page
script.shortname = "RSD";
script.website = "https://greasyfork.org/scripts/976/";
script.discussion = "https://greasyfork.org/scripts/976/feedback";
script.icon = await GM.getResourceUrl("icon");
script.icon64 = await GM.getResourceUrl("icon64");
script.mainCSS = "ytd-app, html:not(.style-scope)[standardized-themed-scrollbar] {scrollbar-color:auto;}    /* Top Title Enabled */    	.rsdTitle ytd-watch-flexy:not([theater]) #rsd-title {margin-bottom:2px;}  	.rsdTitle ytd-watch-flexy[theater] #rsd-title, .rsdTitle ytd-watch-flexy:not([theater]) ytd-video-primary-info-renderer h1.title {display:none;}     	.rsdTitle ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy  {padding-top:5px;}    	html:not(.rsdTitle) #rsd-title {display:none;}  	    /* Side description (always) enabled */  	#meta.rsd-description {width:auto; padding-right:0; order:0; margin-bottom:16px;}    	.rsdTitle ytd-watch-flexy:not([theater]) #meta.rsd-description {margin-top:9px;}    	ytd-video-secondary-info-renderer {max-height:390px; overflow:auto; width:auto; padding-top:0; padding-bottom:0; margin-right: 0 !important; background-color:var(--yt-playlist-background-item); padding:8px; border-bottom-width:0px; --yt-endpoint-text-decoration:underline;}  	html[dark] ytd-video-secondary-info-renderer {background-color:var(--yt-dark-surface-400);}  	@media screen and (min-width: 1000px) {  		ytd-video-secondary-info-renderer {margin-left:-14px;}  	}      ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer {padding-top:0;}  	ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer paper-button {padding:4px 10px; min-width:20px;}  	ytd-video-secondary-info-renderer #subscribe-button.ytd-video-secondary-info-renderer ytd-subscription-notification-toggle-button-renderer {--yt-button-icon-size:24px; --yt-button-icon-padding:0px;}  	ytd-video-secondary-info-renderer #owner-sub-count {text-align:right;}  	ytd-video-secondary-info-renderer #subscribe-button, ytd-video-secondary-info-renderer #sponsor-button, ytd-video-secondary-info-renderer #analytics-button {align-self:start;}  	ytd-video-secondary-info-renderer #subscribe-button tp-yt-paper-button, ytd-video-secondary-info-renderer #sponsor-button tp-yt-paper-button, ytd-video-secondary-info-renderer #analytics-button tp-yt-paper-button {padding:6px; min-width:auto; }    	ytd-video-secondary-info-renderer #date.ytd-video-primary-info-renderer #dot {display:none;}  	  	  	ytd-video-secondary-info-renderer ytd-expander.ytd-video-secondary-info-renderer {margin-left:0; max-width:100%; font-size:1.3rem; line-height:normal; --ytd-expander-collapsed-height:auto !important;}  	ytd-video-secondary-info-renderer #less {display:none;}    	ytd-video-secondary-info-renderer #title.ytd-metadata-row-renderer {width:auto; font-size:1.1rem; line-height:normal;}  	ytd-video-secondary-info-renderer .content.ytd-metadata-row-renderer {width:auto; font-size:1.1rem; line-height:normal; white-space:normal;}  	ytd-video-secondary-info-renderer .content.content-line-height-override.ytd-metadata-row-renderer {line-height:normal;}    	ytd-video-secondary-info-renderer .rsdMusicCollapse:not(:hover) > * {display:none !important;}  	ytd-video-secondary-info-renderer .rsdMusicCollapse:not(:hover):before {content:'Hover to view'; opacity:0.6; font-size:1.1rem; line-height:normal; color:var(--yt-spec-text-primary);}    	ytd-video-secondary-info-renderer #contents.ytd-rich-metadata-row-renderer {margin-right:0;}  	ytd-video-secondary-info-renderer ytd-rich-metadata-renderer {transform:scale(0.68); transform-origin:top left; margin-right:-88px !important; margin-bottom:-30px !important; margin-top:0 !important; min-width:none; max-width:none;}  	  	#playlist.ytd-watch-flexy {margin-bottom:16px;}    	  	    /* Below Video */  	  	/*html:not(.rsdTitle) ytd-watch-flexy:not([theater]) ytd-video-primary-info-renderer {padding-top:10px;}    	ytd-video-primary-info-renderer #count {float:right; margin-top:-14px;}  	html:not(.rsdTitle) ytd-video-primary-info-renderer #count,  ytd-watch-flexy[theater] ytd-video-primary-info-renderer #count {margin-top:-22px;}  	ytd-video-primary-info-renderer #count yt-view-count-renderer {font-size:18px;}  	ytd-video-primary-info-renderer #sentiment.ytd-video-primary-info-renderer {width:100%;}*/  	  	ytd-video-primary-info-renderer #count ytd-video-view-count-renderer {  		font-size:17px !important;  	}    	ytd-video-primary-info-renderer ytd-menu-renderer #top-level-buttons-computed ytd-toggle-button-renderer:first-child.style-default-active  {  		color:var(--yt-spec-call-to-action);/*#065fd4;*/  	}    	ytd-merch-shelf-renderer {margin-top:0}    	ytd-watch-flexy .attached-message.ytd-watch-flexy:not(:empty) { padding-top:4px; }  	  	/*ytd-video-primary-info-renderer #like-bar.ytd-sentiment-bar-renderer {  		background-color:var(--yt-spec-call-to-action) !important;  	}*/      /* Hide cards on icon hover */  	  	#movie_player:not(.ytp-fullscreen).ytp-ce-shown .ytp-gradient-top {display:block; width:36px; height:36px; padding:4px 0 0 4px; pointer-events:auto; opacity:0.9; filter:drop-shadow(0 0 2px rgba(0,0,0,0.3)); background:no-repeat bottom right url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfBJREFUeNpi/P//PwM6YIHSIJlZUHY6A0glEC/9jwAMTAxYACM2MwECCEMQplUFiGdCrINYAAI2IDZMC0wfI8xdjDAzAAIIq03oANmNS6HG2UDp/9gUwcBhKG1LrHUgSUaAACLZTTgBzLv5QBwCxNeQ5M7CowYaarCQO/wfFYDl0BWhK8SpCFkhXkUwhQzoqYIRDa8B4o1Exx1AABGliBjAhCWqDlPDIJCf2JAMRE5Z6BjNCYiQxJa3YCFqgyWkUfQRk5ZsoK47gpycyUqURBmIxWvJ/4kDh5H1YTOIWJyJzKdaOgIIIJolSKoZxEYNgxqB+CcQ81AjjGAcXiBuA2J2HPrSiUlHMMADxJ9xpKF1pGSRz0AsCcRfsMixkRpr+AwjOfqJMozYdETQMFISJF7DSE3ZMMN+4Kr/SDWMl1p57TN6DiA39/9Hb7iwkFv8ALHx4C6PAAKMai6iVQE5qB3UCK1XeejqIhxVaD6WupmHgiqZaExIAS6H2eCpFPCBTEodhK3xRonDthCyj9wCxAZarB2BFroGQLydGumNhUL9VHcYC5XyBtUcxkLlTEuxw1hoVJrgctiAOQiXw+SoUXX8paLDZhKKPmIqV2bokIE6BQ7SAWIrJD4oxDyxNvjoUR1gKfnfArExNjWjzY8h5yAAY7TimgdUaakAAAAASUVORK5CYII=);}  	#movie_player:not(.ytp-fullscreen).ytp-ce-shown .ytp-gradient-top:hover {opacity:0;}  	#movie_player:not(.ytp-fullscreen).ytp-ce-shown .ytp-gradient-top:hover ~ .ytp-ce-element {opacity:0;}    	  	  	/*Retro Theme Enabled */    	  	html:not([dark]).rsdRetro ytd-app {background-color: white !important;}  	  	.rsdRetro body, .rsdRetro input, .rsdRetro textarea, .rsdRetro select {font-family:arial,sans-serif;}    	html:not(.style-scope)[typography].rsdRetro {  		/*Override typography changes*/  		--yt-channel-line-height: revert;/*3rem;*/  		--yt-navbar-title-line-height: revert;/*2.4rem;*/  		--yt-subheadline-line-height: revert;/*2rem;*/  		--yt-link-line-height: revert;/*1.6rem;*/  		--yt-thumbnail-attribution-font-size: revert;/*1.3rem;*/  		--yt-thumbnail-attribution-line-height: revert;/*1.8rem;*/  		--yt-user-comment-line-height: revert;/*2.1rem;*/  		--yt-guide-highlight-line-height: revert;/*1.8rem;*/  		--yt-caption-font-size: revert;/*1.3rem;*/  		--yt-caption-line-height: revert;/*normal;*/  	}  	html:not(.style-scope)[typography-spacing].rsdRetro  {  		/*Override typography changes*/  		--yt-subheadline-letter-spacing: revert;/*normal;*/  		--yt-subheadline-link-letter-spacing: revert;/*normal;*/  		--yt-link-letter-spacing: revert;/*normal;*/  		--yt-thumbnail-attribution-letter-spacing: revert;/*inherit;*/  		--yt-user-comment-letter-spacing: revert;/*normal;*/  		--yt-guide-highlight-letter-spacing: revert;/*normal;*/  		--yt-caption-letter-spacing: revert;/*.007px;*/  		--yt-badge-letter-spacing: revert;/*unset;*/  		--yt-tab-system-letter-spacing: revert;/*.007px;*/  	}    	.rsdRetro #masthead-container.ytd-app::after {display:none;}  	.rsdRetro #masthead:not([dark]) {border-bottom: 1px solid #CCCCCC;}  	.rsdRetro #container.ytd-masthead {height:49px;}  	  	  	.rsdRetro #masthead #logo-icon {background:url(data:image/png;base64,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) 0 0 no-repeat; }  	.rsdRetro #masthead[dark] #logo-icon {background-image:url(data:image/png;base64,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); }  	.rsdRetro #masthead #logo-icon svg  {visibility:hidden;}  	.rsdRetro #masthead #logo-icon {width:99px; height:42px; padding:0; padding:0; margin-left:16px;}  	.rsdRetro ytd-topbar-logo-renderer #country-code {display:none;}    	  	  	.rsdRetro #page-manager.ytd-app {margin-top: 49px;}  	  	    	.rsdRetro #rsd-title {font-size:19px; font-weight:bold;}  	  	  	.rsdRetro ytd-video-secondary-info-renderer {background:#EEEEEE;  border:1px solid #CCCCCC; font-size:12px; padding:6px; margin-bottom:8px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer {background-color:var(--yt-dark-surface-400); border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):not(.ytd-subscription-notification-toggle-button-renderer), .rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):not(.ytd-subscription-notification-toggle-button-renderer):hover {color:#0033CC;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer), html[dark].rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):hover {color:var(--yt-spec-call-to-action);}  	.rsdRetro ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer {margin-bottom:2px; }  	.rsdRetro ytd-video-secondary-info-renderer #avatar.ytd-video-owner-renderer {border-radius:0; border:1px solid white; outline:1px solid #999999; margin:1px; margin-right:7px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer #avatar.ytd-video-owner-renderer  {outline-color:#1b1b1b; border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer {justify-content:flex-start;}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer > * {font-size:1em; color:black;}  	html[dark].rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer > * {color:white;}  	.rsdRetro ytd-video-secondary-info-renderer #owner-name.ytd-video-owner-renderer, .rsdRetro ytd-video-secondary-info-renderer #channel-name.ytd-video-owner-renderer  {font-weight:bold; font-size:1em;}   	html:not([dark]).rsdRetro ytd-video-secondary-info-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {color:#0033CC;}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer .date.ytd-video-secondary-info-renderer { font-size:1em; color:var(--yt-primary-text-color);	}  	  	  	  	.rsdRetro ytd-video-secondary-info-renderer ytd-expander.ytd-video-secondary-info-renderer {font-size:1em; line-height:15px;}  	html:not([dark]).rsdRetro  ytd-video-secondary-info-renderer .content.ytd-video-secondary-info-renderer {color:#333;}  	  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer {border-top:1px solid #CCCCCC; padding-top:2px; margin-top:8px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer {border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-renderer {margin:0; margin-top:2px; }  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer[has-divider-line] {margin-top:0; border-top:0;}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer {display:inline-block; padding-top:0; }  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer + ytd-metadata-row-header-renderer {margin-left:8px; padding-left:8px; border-left:1px solid #CCCCCC;}  	html[dark].rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer + ytd-metadata-row-header-renderer {border-left-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer .content.ytd-metadata-row-header-renderer {font-size:0.9em;}  	.rsdRetro ytd-video-secondary-info-renderer #title.ytd-metadata-row-renderer {font-size:0.9em;}  	.rsdRetro ytd-video-secondary-info-renderer .content.ytd-metadata-row-renderer {font-size:0.9em;}                /* Retro Player Enabled */  	  	  	.rsdPlayer ytd-player#ytd-player #container.ytd-player  {overflow:hidden; padding-bottom:30px;}    	.rsdPlayer #player.ytd-watch-flexy {margin-bottom:30px;}  	.rsdPlayer  ytd-watch-flexy[theater] #player-theater-container {margin-bottom:30px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) {overflow:visible; contain: layout size;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-player-content, #movie_player:not(.ytp-fullscreen) .ytp-settings-menu {bottom:8px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-player-content.html5-endscreen {bottom:39px; top:28px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-bottom:not(.ytp-preview), .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-paid-content-overlay {bottom:14px; top:auto !important;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-preview {bottom:46px; top:auto !important;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .caption-window.ytp-caption-window-bottom {margin-bottom:0;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen):not(.paused-mode):not(.ytp-cards-teaser-shown):not(.ytp-iv-drawer-open):not(:hover) .ytp-cards-button {opacity:0;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-gradient-bottom {display:none;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-bottom {  background-color:#ccc; color:#000; text-shadow:none; border:0px solid #ccc; border-width: 0px 12px 0 12px; left:0 !important; opacity:1; bottom:-30px; height:27px;}       	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container {bottom:27px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-list {transform-origin:center bottom !important; background-color:#444;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) {margin-left:-12px; width:calc(100% + 24px); }    	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-chapter-hover-container:only-child {width:100% !important;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-chapter-hover-container:first-child:not(:only-child) {padding-left:12px}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-chapter-hover-container:first-child:not(:only-child) .ytp-progress-list {width:calc(100% + 14px); margin-left:-12px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-chapter-hover-container:last-child:not(:only-child) .ytp-progress-list {margin-right:-12px;}    	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-chapter-hover-container[style*='margin-right: 2px;'] .ytp-progress-list {width:calc(100% + 2px);}      	.rsdPlayer #movie_player:not(.ytp-fullscreen) .ytp-heat-map-svg {filter: drop-shadow(0px -1px 0px black);}  	.rsdPlayer #movie_player:not(.ytp-fullscreen) .ytp-heat-map-svg .ytp-heat-map-graph{fill-opacity:0.5;  }      	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls {padding-left:0; padding-right:0; margin-left:-12px; margin-right:-12px; height:27px; line-height:27px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-display {height:34px; margin-top:-3px; font-size:95%; line-height:34px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chapter-container {font-size:100%; line-height:27px; color:#4d4d4d; transition: opacity 0.05s}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen):not(.paused-mode):not(:hover) .ytp-chrome-bottom .ytp-chapter-container {opacity:0; transition: opacity 0.2s 2s}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-current {color:inherit;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-separator, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-duration {color:#666;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel {color:#4d4d4d; opacity:1; height:34px; margin-top:-3px; flex-shrink:0;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-slider {min-height:unset;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:before, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {background-color:#4d4d4d;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {opacity:0.35;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button:hover {color:#3d3d3d;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button .ytp-svg-fill, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button path[fill='#fff'] {fill:currentColor;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button .ytp-svg-shadow {stroke:none;}  	.rsdPlayer #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-autonav-toggle-button {width:17px; left:50%; transform:translate(-50%, -50%); background-image:none;}  	.rsdPlayer #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-autonav-toggle-button:after {transform:none; left:0; background-color:currentColor; opacity:0.8; height:16px; width:16px;}  	.rsdPlayer #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-autonav-toggle-button[aria-checked='true']::after {}    	  	html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-bottom {background-color:#1b1b1b; color:#fff; border-color:#1b1b1b;}      html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chapter-container {color:#8E8E8E; }  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-time-separator, html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-time-duration {color:#999;}  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button, html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel {color:#8E8E8E; }  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:before, html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle, html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {background-color:#8E8E8E;}  html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button:hover {color:#EBEBEB;}      /* Smaller player size enabled */    .rsdAltSize ytd-watch-flexy[flexy] {  	--ytd-watch-flexy-width-ratio: 16 !important;  	--ytd-watch-flexy-height-ratio: 9 !important;  	--ytd-watch-flexy-min-player-width: var(--ytd-watch-flexy-max-player-width);  	--ytd-watch-flexy-min-player-height: var(--ytd-watch-flexy-max-player-height);  	--ytd-watch-flexy-max-player-width: 640px;  	--ytd-watch-flexy-max-player-height: 360px;  }    @media screen and (max-width:656px) {  	.rsdAltSize  ytd-watch-flexy[flexy] {  		--ytd-watch-flexy-max-player-width: 426px;  		--ytd-watch-flexy-max-player-height: 240px ;  	}  }  @media screen and (min-width:1294px) and (min-height:630px) {  	.rsdAltSize  ytd-watch-flexy[flexy] {  		--ytd-watch-flexy-max-player-width: 854px;  		--ytd-watch-flexy-max-player-height: 480px ;  	}  }  @media screen and (min-width:1720px) and (min-height:980px) {  	.rsdAltSize  ytd-watch-flexy[flexy] {  		--ytd-watch-flexy-max-player-width: 1280px;  		--ytd-watch-flexy-max-player-height: 720px ;  	}  }    .rsdAltSize  ytd-watch-flexy[theater] {  	--ytd-watch-flexy-max-player-width: 854px ;  	--ytd-watch-flexy-max-player-height: 480px ;  }    @media screen and (min-width:1320px) and (min-height:870px) {  	.rsdAltSize  ytd-watch-flexy[theater] {  		--ytd-watch-flexy-max-player-width: 1280px;  		--ytd-watch-flexy-max-player-height: 720px;  	}  }    .rsdAltSize  ytd-watch-flexy[theater]:not([fullscreen]) #player-theater-container {  	height: var(--ytd-watch-flexy-max-player-height) !important;  }    .rsdAltSize  ytd-watch-flexy[theater]:not([fullscreen]) ytd-player > #container {  	width: var(--ytd-watch-flexy-max-player-width);  	margin-left:auto;  	margin-right:auto;  }    .rsdAltSize #movie_player.ytp-transparent {  	background-color: black;  }    .rsdAltSize ytd-watch-flexy[flexy][is-two-columns_] #primary.ytd-watch-flexy {    max-width: var(--ytd-watch-flexy-max-player-width) !important;    min-width: var(--ytd-watch-flexy-min-player-width) !important;  }  .rsdAltSize ytd-watch-flexy[flexy][is-vertical-video_] #player-container-inner.ytd-watch-flexy {  	position: relative;  }      .rsdAltSize  ytd-watch-flexy[theater]:not([fullscreen])[flexy][is-two-columns_] #primary.ytd-watch-flexy {    max-width: calc(var(--ytd-watch-flexy-max-player-width) - 422px) !important;    min-width: calc(var(--ytd-watch-flexy-min-player-width) - 422px) !important;  }"; 
script.settingsCSS = "html:not(.rsdLoaded) #bwp-retrostyle-toggle {display:none;}    #bwp-retrostyle-toggle {cursor:pointer; width:40px; height:40px; padding-top:4px; padding-left:4px; box-sizing:border-box; margin-right:8px; position:relative;}    #bwp-retrostyle-toggle .logobox {width:32px; height:32px; transition:width 0.05s linear, height 0.05s linear, opacity 0.05s linear; position:absolute; top:50%; left:50%; transform:translateX(-50%) translateY(-50%); opacity:0;}  #bwp-retrostyle-toggle .logobox div {border:1px solid var(--yt-spec-icon-active-other, currentColor); width:100%; box-sizing:border-box;}  #bwp-retrostyle-toggle .logobox div:first-child {height:37.5%; border-radius:4px;}  #bwp-retrostyle-toggle .logobox div:last-child {height:calc(62.5% - 1px); margin-top:1px; border-radius:3px;}  ytd-masthead:not(:hover) #bwp-retrostyle-toggle:not(.open):not(:hover) .logobox {opacity:1; width:24px; height:24px;}    #bwp-retrostyle-toggle img {transition:opacity 0.05s linear, transform 0.05s linear; }  ytd-masthead:not(:hover) #bwp-retrostyle-toggle:not(.open):not(:hover) img {opacity:0; transform:scale(0.75); }    #rsd-menu {position:absolute; position:fixed; top:55px; right:10px; width:500px; height:auto; max-height:calc(100vh - 60px); background:white; background:var(--yt-spec-brand-background-primary); color:black; color:var(--yt-spec-text-primary); border:1px black solid; border-color:var(--yt-spec-text-primary); z-index:2200; border-radius:2px; padding:12px; box-sizing: border-box; font-size:16px}    #rsd-menu .arrow {position:absolute; width:15px; height:15px; border:black solid 1px; border-color:var(--yt-spec-text-primary); border-width:1px 1px 0 0; background:inherit; transform:rotate(-45deg); top:-9px; pointer-events:none;}    #rsd-menu label {padding:4px 4px; display:block;}  #rsd-menu label:not([disabled]):hover {cursor:pointer; background:var(--yt-spec-badge-chip-background);}    #rsd-menu label[disabled] span {opacity:0.8;}    #rsd-menu input {width:20px; height:20px; vertical-align: middle; accent-color:var(--paper-toggle-button-checked-button-color, var(--primary-color));}  #rsd-menu label span {vertical-align: middle;}      #rsd-menu ul {padding-left:24px; font-size:0.9em;}  #rsd-menu li {padding-top:12px;}  ";

// Defining dynamic script properties
script.cssMainLoaded = null;
script.forceControlsTimer = null; // shared with legacy
script.forceControlsListener = null; // shared with legacy
script.watchSetupDone = false;




  

// Newtube Script 
  

function pageSetup() {
  // Runs: Once, after the first page has loaded
  // Purpose: Set up settings handling, and event hooks
	console.log("pageFirstRun");
	
	if ($("#rsd-menu").length > 0) {
    console.warn(script.shortname + " - Another version of this script is already running, so this copy will not be loaded. Check your list of installed scripts.");
    return;
  }
  
  
  // unsupported browser detection is used for additional code and warnings, not to disable the script.
  var unsupportedBrowser = false;
  if (typeof(window.customElements) != "object") {
    unsupportedBrowser = true; 
  }
  
  
  
  // Data for the settings panel
  script.settingsPanelData = {};
  script.settingsPanelData.settings = [
    {
    	idtxt:"rsd-menu-retrotheme",
      name:"Retro theme"
  	},
    {
    	idtxt:"rsd-menu-retroplayer",
      name:"Retro player"
  	},
    {
    	idtxt:"rsd-menu-titletop",
      name:"Title on top"
  	},
    {
    	idtxt:"rsd-menu-altplayersize",
      name:"Smaller player size"
  	}
  ];
  script.settingsPanelData.features = [
    {
    	name:"Hide end-card annotations",
      text:"Hover mouse over the top-left corner of the video player while end-cards are displaying"
  	}
  ];
  
  
  // Settings panel
  $(document.createElement("div"))
  	.attr("id", "rsd-menu")
  	.attr("hidden","hidden")
  	.html("<style type='text/css'>"+script.settingsCSS+"</style><div class='arrow'></div><img style='float:right; margin-left:8px;' src='"+script.icon+"'><small style='float:right; margin-left:3px; text-align:right;'>Version "+script.version+"<br/><a style='color:var(--yt-spec-call-to-action)' href='"+script.website+"' target='_blank'>Updates & Help</a></small><h3>'"+script.name+"' Script</h3><br><h4>Settings</h4><br><div class='settinglist'><label disabled><input type='checkbox' checked disabled/> <span>Description on right [Always Enabled]</span></label><!--Other settings appended by script--></div><br/><h4>Other Interactive Features</h4><!-- Features inserted by script--><ul></ul><br/>"+(unsupportedBrowser?"<br><br><small style='color:var(--error-color)'>Your browser may not be fully supported and may experience some issues. If you would like to report a bug, please include the name and version number of your browser.</small><script>window.customElements.upgrade(document.querySelector('#rsd-menu'))</script>":""))
  	.appendTo("body");
  
  $(script.settingsPanelData.settings).each(function(index, setting){
    $("#rsd-menu .settinglist").append(
      "<label for='"+setting.idtxt+"'><input type='checkbox' id='"+setting.idtxt+"' autocomplete='off'/> <span>"+setting.name+"</span></label>"
    );
  });
  $(script.settingsPanelData.features).each(function(index, feature){
    $("#rsd-menu ul").append(
      "<li><b>"+feature.name+":</b> "+feature.text+"</li>"
    );
  });
 

  PrepSettings();
  
  async function PrepSettings() {
    if (await GM.getValue("retrotheme", true)) {
      $("#rsd-menu-retrotheme").prop("checked", true);
    }
    if (await GM.getValue("retroplayer", true)) {
      $("#rsd-menu-retroplayer").prop("checked", true);
    }
    if (await GM.getValue("titletop", true)) {
      $("#rsd-menu-titletop").prop("checked", true);
    }
    if (await GM.getValue("altplayersize", false)) {
      $("#rsd-menu-altplayersize").prop("checked", true);
    }
    
  }
  
  $("#rsd-menu input:not([disabled])").click(async function() {
    var state = ($(this).prop("checked")?true:false);
    if (this.id=="rsd-menu-retrotheme") {
      await GM.setValue("retrotheme", state);
    } else if (this.id=="rsd-menu-retroplayer") {
      await GM.setValue("retroplayer", state);
    } else if (this.id=="rsd-menu-titletop") {
      await GM.setValue("titletop", state);
    } else if (this.id=="rsd-menu-altplayersize") {
      await GM.setValue("altplayersize", state);
    }
      
    watchApply(); // apply changed settings
  });
  
  
  // Settings button in header
  $(document.createElement("div"))
		.attr("id", "bwp-retrostyle-toggle")
		.attr("class", "style-scope ytd-menu-renderer style-default")
		.attr("is-icon-button", "")
		.attr("button-renderer","")
		.html("<a is='yt-endpoint' tabindex='-1' class='style-scope ytd-button-renderer'><div class='logobox'><div></div><div></div></div><img src='"+script.icon+"' title='\"Right Side Description\" Script Menu'></a>")
  	.click( function() {
    	if ($("#rsd-menu").attr("hidden") ) {
         	$("#rsd-menu").removeAttr("hidden");
        	$("#bwp-retrostyle-toggle").addClass("open");
        	$("#rsd-menu .arrow").css("right", (document.body.clientWidth - $("#bwp-retrostyle-toggle")[0].getBoundingClientRect().right) + "px");
      } else {
        $("#rsd-menu").attr("hidden","hidden");
        $("#bwp-retrostyle-toggle").removeClass("open");
      }
  	})
		.prependTo("ytd-masthead #end");
	
  
  
  
  // Inject a function to resize the player, based on user setting
  
  var playerSizeInjector = function() {
    var customPlayerSize = function(ogfuncname) {
      
      if (document.querySelector("html").classList.contains("rsdAltSize") && document.querySelector("ytd-watch-flexy") != null && !document.querySelector("ytd-watch-flexy").hasAttribute("hidden")) { // check if this should run, based on user setting & only run on watch page
        
        // Sizing logic to match 'old youtube' (non-polymer youtube)
        
        var wWidth = window.innerWidth; var wHeight = window.innerHeight;
        
        var width = 640; var height = 360;
        
        if (document.querySelector("ytd-watch-flexy").hasAttribute("theater")) {
          
          width = 854; height = 480;
          
          if (wWidth >= 1320 && wHeight >= 870) {
            width = 1280; height = 720;
          }
          
        } else {
          
          
          if (wWidth >= 1720 && wHeight >= 980) {
          	width = 1280; height = 720;
        	} else if (wWidth >= 1294 && wHeight >= 630) {
            width = 854; height = 480;
          } else if (wWidth <= 656) {
            width = 426; height = 240;
          }
           
                    
        }
        
        return {width:width, height:height};        
        
      } else { // call the original function
        
        if (ogfuncname == "calculateNormalPlayerSize_") {
          return document.querySelector("ytd-watch-flexy").calculateNormalPlayerSize_OG();
        } else { // ogfuncname == "calculateCurrentPlayerSize_"
          return document.querySelector("ytd-watch-flexy").calculateCurrentPlayerSize_OG();
        }
        
      }
      
    }
    
    // Save the original functions
    document.querySelector("ytd-watch-flexy").calculateNormalPlayerSize_OG = document.querySelector("ytd-watch-flexy").calculateNormalPlayerSize_;
    document.querySelector("ytd-watch-flexy").calculateCurrentPlayerSize_OG = document.querySelector("ytd-watch-flexy").calculateCurrentPlayerSize_;
    
    // Override the original functions with custom
  	document.querySelector("ytd-watch-flexy").calculateNormalPlayerSize_ = function() {return customPlayerSize("calculateNormalPlayerSize_")};
   	document.querySelector("ytd-watch-flexy").calculateCurrentPlayerSize_ = function() {return customPlayerSize("calculateCurrentPlayerSize_")};
  }
  
  // Inject into page
  injector = document.createElement("script");
  injector.textContent = "var rsdInjectFunction = " + playerSizeInjector.toString() + "; rsdInjectFunction();";
  document.documentElement.appendChild(injector);
  
  
  
  
  
	typeChange();
	$("ytd-app").on("yt-page-type-changed", typeChange);
}

function typeChange() {
  // Runs: Every time the page type changes
	console.log("typeChange");
	
  setTimeout(function() { // delay only seems to be needed for miniplayer closing
    console.log("typeChange - delayed section"); 
    
    if ($("#page-manager ytd-watch-flexy:not([hidden]), #page-manager ytd-watch-flexy.loading").length > 0) {
      if (!script.watchSetupDone) {
        watchSetup();
      } 
      watchApply();
    } else {
      if (script.watchSetupDone) {
        watchCleanup();
      }
    }
  
  }, 1);
  
}

function watchSetup() {
  // Runs: First time a watch page has loaded
  // Purpose: Single-time watch page modification and event hooks
	console.log("watchSetup");
	script.watchSetupDone = true;
  
  
  $('<h1 id="rsd-title" class="title style-scope ytd-video-primary-info-renderer"></h1>').prependTo( $("ytd-watch-flexy #primary-inner") );
 
  $('<div id="rsd-description-entry"></div>').prependTo("ytd-watch-flexy #related");
  
  $("#movie_player").removeClass("ytp-larger-tap-buttons"); // disable youtube experiment
  	
	dataRun();
	$("ytd-app").on("yt-update-title", dataRun);
	//yt-page-data-updated ?
	
}

async function watchApply() {
  // Changed TO a watch page, or a setting has changed
	console.log("watchApply");
	loadCSS();
	applyRetroPlayer(await GM.getValue("retroplayer", true));
}
function watchCleanup() {
  // Changed FROM a watch page (undo watchApply)
	console.log("watchCleanup");
	unloadCSS();
	$("#bwp-retrostyle-toggle").removeClass("open");
	$("#rsd-menu").attr("hidden","hidden");
	applyRetroPlayer(false);
}


function dataRun() {
  // Runs: Navigating from one video to another
  // Purpose: Modify the page in ways that need to happen after every video change
  console.log("dataRun");
  
 
	
	setTimeout(function() { // These don't generate until after yt-update-title, need to find another event to listen to
		console.log("dataRun - delayed section");
		
    // Title above video
    var titleSrc = $("ytd-video-primary-info-renderer > #container > h1 > yt-formatted-string");
    $("#rsd-title").html(titleSrc.html());
    $("#rsd-title").attr("title", titleSrc.text());
    
    
    
    // Description panel
    var meta = $("ytd-watch-flexy #primary-inner > .watch-active-metadata > #meta").addClass("rsd-description");
    $(meta).prependTo( $("#rsd-description-entry") );
 
    // Expand description
		$("#meta.rsd-description ytd-expander #more").click();
    if ($("#meta.rsd-description ytd-expander[collapsed]").length > 0) {
      console.log("Expand didn't work, manually expanding "); 
      $("#meta.rsd-description ytd-expander[collapsed]").removeAttr("collapsed");
    }
    
    // Upload date - move from below video to description panel
    $("ytd-video-primary-info-renderer #info #info-strings").insertAfter("ytd-video-owner-renderer #channel-name");
    $("ytd-video-owner-renderer #info-strings > #dot:first-child").remove();
    
    // Sub count
    if ( $("#meta.rsd-description #subscribe-button").text() ) { // prevent picking up the skeleton
			$("#meta.rsd-description #owner-sub-count").appendTo("#meta.rsd-description ytd-video-secondary-info-renderer #subscribe-button");
    }
    
    // Collapse music rights info
    $("#meta.rsd-description ytd-video-secondary-info-renderer ytd-metadata-row-renderer #content.rsdMusicCollapse").removeClass("rsdMusicCollapse"); // clear any previous vid status
    var musicrightsStrings = ["Licensed to YouTube by", "Licenced to YouTube by"];
    $("#meta.rsd-description ytd-video-secondary-info-renderer ytd-metadata-row-renderer").each(function(){
      var title = $("#title", this).text().trim();
      if (musicrightsStrings.includes(title)) {
        $("#content", this).addClass("rsdMusicCollapse"); // collapse handled by CSS
      }
    });
    
    
    
    // Below video
    
    // Viewcount
    //$("ytd-video-primary-info-renderer #info #count").prependTo("ytd-video-primary-info-renderer #info #menu-container");
    
    // New container for shifted buttons, move them into it (all except like/dislike)
   /* $("#menu-container-left-rsd").remove(); // remove old copies
    $("<div id='menu-container-left-rsd'></div>").prependTo("ytd-video-primary-info-renderer #info");
    $("ytd-video-primary-info-renderer #info #menu-container #top-level-buttons > *").each(function() {
      if (this.nodeName != "YTD-TOGGLE-BUTTON-RENDERER") {
        $(this).appendTo("#menu-container-left-rsd");
      }
    });
    $("ytd-video-primary-info-renderer #info #menu-container #top-level-buttons + *").insertAfter("#menu-container-left-rsd");*/
    
		
	}, 1);

}

// Initiate script
if ($("ytd-watch-flexy").length > 0) {
  console.log("Page already loaded, initiate setup");
  pageSetup();
} else {
  console.log("Page not ready or otherwise not a video page, wait for ready");
  $(document).one("yt-navigate-finish", pageSetup);
}



// possible script points [old test notes]
// yt-update-title on ytd-app - seems to run when data changes?
// yt-page-type-changed on ytd-app - for detecting if they've move away from video or back
// yt-page-data-updated on body - may run after all data changed?
// yt-navigate-finish on document - same as above?

async function loadCSS() {
	if (!script.cssMainLoaded) {
		script.cssMainLoaded = GM_addStyle(script.mainCSS);
	}
  
  $("html").addClass("rsdLoaded");
  if (await GM.getValue("retrotheme", true)) {
    $("html").addClass("rsdRetro");
  } else {
    $("html").removeClass("rsdRetro");
  }
  if (await GM.getValue("retroplayer", true)) {
    $("html").addClass("rsdPlayer");
    applyRetroPlayer(true);
  } else {
    $("html").removeClass("rsdPlayer");
    applyRetroPlayer(false);
  }
  if (await GM.getValue("titletop", true)) {
    $("html").addClass("rsdTitle");
  } else {
    $("html").removeClass("rsdTitle");
  }
  if (await GM.getValue("altplayersize", false)) {
    $("html").addClass("rsdAltSize");
    window.dispatchEvent(new Event('resize')); // Triggers player size resizing, if the setting has been applied or changed
  } else {
    $("html").removeClass("rsdAltSize");
    window.dispatchEvent(new Event('resize')); // Triggers player size resizing, if the setting has changed
  }
	  
  
}
function unloadCSS() {
	if (script.cssMainLoaded) {
		$(script.cssMainLoaded).remove();
		script.cssMainLoaded = null;
	}
  
  applyRetroPlayer(false);
  
  $("html").removeClass("rsdLoaded");
  $("html").removeClass("rsdRetro");
  $("html").removeClass("rsdPlayer");
  $("html").removeClass("rsdTitle");
  $("html").removeClass("rsdAltSize");
  
  window.dispatchEvent(new Event('resize')); // Triggers player size resizing, so miniplayer works
  
  
}

function applyRetroPlayer(activate) { // Also used by legacy script
	if (activate) {
		if (!script.forceControlsTimer) {
			var mouseMoveEvent = new Event('mousemove');
			script.forceControlsTimer = setInterval(function() {
				if (!document.hidden) {
					$("#movie_player.playing-mode:not(.ytp-fullscreen)")[0].dispatchEvent(mouseMoveEvent);
				}
			}, 1000);
		}
		if (!script.forceControlsListener) {
			script.forceControlsListener = function() {
				if (!document.hidden) {
					var mouseMoveEvent = new Event('mousemove');
					$("#movie_player.playing-mode:not(.ytp-fullscreen)")[0].dispatchEvent(mouseMoveEvent);
				}
			};
			$(document).on("visibilitychange", script.forceControlsListener);
		}
	} else {
		if (script.forceControlsTimer) {
			clearInterval(script.forceControlsTimer);
			script.forceControlsTimer = null;
		}
		if (script.forceControlsListener) {
			$(document).off("visibilitychange", script.forceControlsListener);
			script.forceControlsListener = null;
		}		
	}
}


  
  


  



})();