// ==UserScript==
// @name         YouTube 2021-2022 Watch10 Beta Reconstruct
// @version      2025.10.06
// @description  This is the version of the watch layout from May 2021 until October 2022 before they forced to use the rounded layout. Plus, it used to be possible to use this watch layout by modifying experimental flags before it got patched since April 26th, 2023.
// @author       LegendCraftMC
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-idle
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551787/YouTube%202021-2022%20Watch10%20Beta%20Reconstruct.user.js
// @updateURL https://update.greasyfork.org/scripts/551787/YouTube%202021-2022%20Watch10%20Beta%20Reconstruct.meta.js
// ==/UserScript==

// Enable strict mode to catch common coding mistakes
"use strict";

// Define the flags to assign to the EXPERIMENT_FLAGS object
const flagsToAssign = {
  // Disable animated features and ambient mode
  web_animated_actions: false,
  web_animated_like: false,
  web_animated_like_lazy_load: false,
  smartimation_background: false,
  kevlar_measure_ambient_mode_idle: false,
  kevlar_watch_cinematics_invisible: false,
  web_cinematic_theater_mode: false,
  web_cinematic_fullscreen: false,
  enable_cinematic_blur_desktop_loading: false,
  kevlar_watch_cinematics: false,
  web_cinematic_masthead: false,
  web_watch_cinematics_preferred_reduced_motion_default_disabled: false,
  // Disable the no_old_secondary_data flag
  kevlar_watch_metadata_refresh_no_old_secondary_data: false
};

const updateFlags = () => {
  // Check if the EXPERIMENT_FLAGS object exists in the window.yt.config_ property chain
  const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;

  // If EXPERIMENT_FLAGS is not found, exit the function
  if (!expFlags) return;

  // Assign the defined flags to the EXPERIMENT_FLAGS object
  Object.assign(expFlags, flagsToAssign);
};

// Create a MutationObserver that calls the updateFlags function when changes occur in the document's subtree
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });

(function() {
let css = `
/* Build Watch10b UI */
#top-row.ytd-watch-metadata {
border-bottom: 0 !important;
padding-bottom: 0 !important
}

#description.ytd-watch-metadata {
margin-top: -46px !important;
border-radius: 0 !important;
background: none !important;
min-width: calc(380px) !important;
max-width: calc(50% - 6px) !important
}

#description-inner.ytd-watch-metadata {
margin: 0 !important
}

#comment-teaser, #teaser-carousel, #expandable-metadata.ytd-watch-flexy {
display: none !important
}

#owner.ytd-watch-metadata {
visibility: hidden
}

ytd-watch-metadata.ytd-watch-flexy {
margin-bottom: 0 !important;
padding-bottom: 0 !important
}

/* Re-add meta information */
#meta-contents {
display: block !important
}

ytd-expander.ytd-video-secondary-info-renderer {
display: none !important
}

#top-row.ytd-video-secondary-info-renderer {
margin-top: 8px !important;
padding: 4px !important;
border: 1px solid var(--yt-spec-10-percent-layer);
border-radius: 2px !important
}

#meta #avatar {
width: 40px !important;
height: 40px !important;
margin-right: 12px !important
}

#meta #avatar img {
width: 100% !important
}

#channel-name.ytd-video-owner-renderer {
font-size: 1.4rem !important;
line-height: 1.6rem !important
}

/* Fix action buttons on small mode */
ytd-watch-metadata[actions-on-separate-line] #owner {
margin-bottom: -56px !important
}

ytd-watch-metadata[actions-on-separate-line] #bottom-row {
margin-top: 60px !important
}

/* Other tweaks */
ytd-watch-flexy[default-layout][reduced-top-margin] #primary.ytd-watch-flexy,
ytd-watch-flexy[default-layout][reduced-top-margin] #secondary.ytd-watch-flexy {
padding-top: var(--ytd-margin-6x) !important
}
 
h1.ytd-watch-metadata {
font-family: "YouTube Sans","Roboto",sans-serif !important;
font-weight: 600 !important;
font-size: 2rem !important;
line-height: 2.8rem !important
}

lottie-component.smartimation__border-gradient.lottie-component,
smartimation__background-lottie lottie-component {
display: none !important
}

.smartimation--active-border .smartimation__overlay {
opacity: 0;
z-index: 0
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();