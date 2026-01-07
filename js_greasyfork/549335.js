// ==UserScript==
// @name         Extra tweaks for YouTube to improve functionally
// @version      2026.01.06
// @description  This userscript will disable and tweak some more of the functionally, forcing h.264 codec on all videos along with other tweaks to cut down on system resources.
// @author       LegendCraftMC
// @license MIT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @match        https://studio.youtube.com/live_chat*
// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-idle
// @unwrap
// @inject-into  page
// @allFrames    true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549335/Extra%20tweaks%20for%20YouTube%20to%20improve%20functionally.user.js
// @updateURL https://update.greasyfork.org/scripts/549335/Extra%20tweaks%20for%20YouTube%20to%20improve%20functionally.meta.js
// ==/UserScript==
// Add config flags to disable both animations and ambient mode functionally

// Enable strict mode to catch common coding mistakes
"use strict";

// Define the flags to assign to the EXPERIMENT_FLAGS object
const flagsToAssign = {
  // Disable animated features (except for sub and like buttons)
  web_animated_actions: false,
  web_animated_like: false,
  web_animated_like_lazy_load: false,
  smartimation_background: false,
  // Disable ambient lighting
  kevlar_measure_ambient_mode_idle: false,
  kevlar_watch_cinematics_invisible: false,
  web_cinematic_theater_mode: false,
  web_cinematic_fullscreen: false,
  enable_cinematic_blur_desktop_loading: false,
  kevlar_watch_cinematics: false,
  web_cinematic_masthead: false,
  web_watch_cinematics_preferred_reduced_motion_default_disabled: false,
  // More tweaks
  kevlar_refresh_on_theme_change: false
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

// Remove the tab prefix that displays the number of notifications
// Save the original descriptor of document.title
const originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');

// Create a custom getter and setter
Object.defineProperty(document, 'title', {
  get: function() {
    return originalTitleDescriptor.get.call(this);
  },
  set: function(newValue) {
    // Remove the (#) with regex.
    const interceptedValue = newValue.replace(/^\(\d+\)\s?/, "");

    // Call the original setter
    originalTitleDescriptor.set.call(this, interceptedValue);
  }
});

// Disable both 'trailer autoplay' and 'automatic pause' features
(function main() {
  'use strict';

  document.createElement = new Proxy(document.createElement, {
    apply(target, that, args) {
      if (args[0]?.toLowerCase() !== 'video') return Reflect.apply(target, that, args);
      const video = Reflect.apply(target, that, args);
      video.addEventListener('loadstart', () => {
        const channel = document.querySelector('ytd-channel-video-player-renderer');
        if (channel?.contains(video)) video.pause();
      }, { passive: true });
      return video;
    },
  });
}());

Object.defineProperties(document, { /*'hidden': {value: false},*/ 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });

setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);


// Force all videos to use h.264 (useful if you have a low spec machine when you load videos in 720p60)
// Modified from https://github.com/erkserkserks/h264ify/tree/master/src/inject as of 2018-05-16 (MIT license)

var mse = window.MediaSource;
if (mse){
  // Set up replacement for MediaSource type support function
  var nativeITS = mse.isTypeSupported.bind(mse);
  mse.isTypeSupported = ourITS(nativeITS);
}
// Here's the replacement
function ourITS(fallback){
  // type is a string (hopefully!) sent by the page
  return function (type) {
    if (type === undefined) return '';
    // We only reject VP9
    if (type.toLowerCase().indexOf('vp9') > -1) return '';
    if (type.toLowerCase().indexOf('vp09') > -1) return ''; // Added 12/20/2019
    // Let Firefox handle everything else
    return fallback(type);
  };
}

// Add CSS tweaks (disables frosted glass transparency on topbar to revert back to the old topbar color, reducing the bottom gradient in the video player, etc...)
(function() {
let css = `
/* Topbar tweaks */
ytm-mobile-topbar-renderer.frosted-glass,
ytm-pivot-bar-renderer.frosted-glass,
ytm-feed-filter-chip-bar-renderer.frosted-glass,
#background.ytd-masthead, #frosted-glass.ytd-app,
#left-arrow-button.ytd-feed-filter-chip-bar-renderer,
#right-arrow-button.ytd-feed-filter-chip-bar-renderer {
background: var(--yt-spec-base-background) !important;
backdrop-filter: none !important;
-webkit-backdrop-filter: none !important
}

#left-arrow.ytd-feed-filter-chip-bar-renderer:after {
background: linear-gradient(to right, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

#right-arrow.ytd-feed-filter-chip-bar-renderer:before {
background: linear-gradient(to left, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
background: transparent !important
}

div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge {
color: #fff !important
}

/* Player tweaks */
#cinematics.ytd-watch-flexy {
display: none !important
}

.ytp-gradient-top, .ytp-gradient-bottom {
height: 50px !important;
padding: 0
}

.ytp-big-mode .ytp-gradient-top, .ytp-big-mode .ytp-gradient-bottom {
height: 61px !important;
height: 0 !important
}

.ytp-gradient-top {
background: linear-gradient(to bottom, #0009, #0000) !important
}

.ytp-gradient-bottom {
background: linear-gradient(to top, #0009, #0000) !important
}

/* Remove every unwanted compact renderer in related section and limit the number of related videos to 9 (plus it disables the 'endless scrolling' feature) */
#related ytd-compact-video-renderer,
#related ytd-compact-playlist-renderer,
#related ytd-compact-radio-renderer,
#related .yt-lockup-view-model,
#related ytd-channel-renderer,
ytd-watch-flexy ytd-reel-shelf-renderer,
ytd-watch-flexy ytd-rich-section-renderer,
#related ytd-continuation-item-renderer,
#related #continuations {
display: none !important
}

#related .yt-lockup-view-model:nth-of-type(1),
#related .yt-lockup-view-model:nth-of-type(2),
#related .yt-lockup-view-model:nth-of-type(3),
#related .yt-lockup-view-model:nth-of-type(4),
#related .yt-lockup-view-model:nth-of-type(5),
#related .yt-lockup-view-model:nth-of-type(6),
ytd-watch-flexy:not([full-bleed-player]) #related .yt-lockup-view-model:nth-of-type(7),
ytd-watch-flexy:not([full-bleed-player]) #related .yt-lockup-view-model:nth-of-type(8),
ytd-watch-flexy:not([full-bleed-player]) #related .yt-lockup-view-model:nth-of-type(9) {
display: flex !important
}

/* Remove minimal annoyances and other tweaks */
ytd-ad-slot-renderer,
ytm-ad-slot-renderer,
ad-slot-renderer,
ytd-promoted-video-renderer,
ytm-promoted-video-renderer,
ytd-promoted-sparkles-web-renderer,
ytm-promoted-sparkles-web-renderer,
ytd-text-image-no-button-layout-renderer,
ytm-text-image-no-button-layout-renderer,
ytd-merch-shelf-renderer,
ytd-compact-movie-renderer,
ytd-mealbear-promo-renderer,
ytd-video-quality-promo-renderer,
tp-yt-iron-overlay-backdrop.opened,
.ytShoppingTimelyShelfContentViewModelIsVisible.ytShoppingTimelyShelfContentViewModelHost,
#clarify-box.ytd-watch-flexy {
display: none !important
}

.ytd-ghost-grid-renderer,
.info-skeleton,
.meta-skeleton,
#ghost-cards,
#ghost-comment-section,
#related-skeleton {
display: none !important
}

ytd-watch-metadata.ytd-watch-flexy {
padding-bottom: 36px !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

// Other tweaks (includes both memory leak fix and service worker prevention)
(function () {
  "use strict";

  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextType) {
    if (contextType === "webgl" || contextType === "webgl2") {
      console.log("WebGL is disabled by Tampermonkey");
      return null;
    }
    return originalGetContext.apply(this, arguments);
  };
})();

(() => {
  const Promise = ((async () => { })()).constructor;
  const ets = `
      yt-navigate
      yt-navigate-start
      yt-page-type-changed
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish`.trim().split(/\s+/)

  const fn = () => {
    if (location.search.includes('pp=')) {
      let oUrl = location.pathname + location.search;
      let nUrl = location.pathname + location.search.replace(/([?&])pp=[^=&?]+\b(\&|)/, (a, p, q) => {
        return !q ? '' : p
      });
      if (oUrl !== nUrl) history.replaceState(history.state, '', nUrl);
    }

  }
  const fh = () => {
    fn();
    Promise.resolve().then(fn);
  }
  for (const et of ets) {

    document.addEventListener(et, fh, false);
  }

})();

if (typeof ServiceWorkerContainer === "function" && typeof ServiceWorkerRegistration === "function" && typeof (ServiceWorkerContainer.prototype || 0).getRegistrations === 'function' && !ServiceWorkerContainer.prototype.register767) {
    const filterSW = (e) => {
        const url = typeof e === 'string' ? e : `${((e || 0).active || 0).scriptURL}`;
        return url.endsWith('/sw.js');
    };
    const makeReject = true;
    const unRegisterAll = () => {
        const sw = ((typeof navigator === 'object' ? navigator : null) || 0).serviceWorker || 0;
        if (sw && typeof sw.getRegistrations === 'function') {
            sw.getRegistrations().then(e => e.length >= 1 && Promise.all(e.filter(filterSW).map(e => e.unregister().catch(console.warn)))).catch(console.warn);
        }
    }
    let i = 0;
    const scriptCollection = document.getElementsByTagName('script');
    (new MutationObserver((mutations, observer) => {
        if (typeof yt !== 'object' || scriptCollection.length === 0) return;
        if (i < 394 && document.readyState === "complete") i = 394;
        if (++i > 400) {
            observer.disconnect();
            return;
        }
        if (typeof navigator !== "object") return;
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return;
        if (typeof navigator.serviceWorker.getRegistrations !== "function") return;
        unRegisterAll();
    })).observe(document, { subtree: true, childList: true, attributes: true });
    ServiceWorkerContainer.prototype.register767 = ServiceWorkerContainer.prototype.register;
    ServiceWorkerContainer.prototype.register = function (url, ...args) {
        if (!filterSW(`${url}`)) {
            return this.register767(...arguments);
        }
        if (i < 394) i = 394;
        Promise.resolve().then(unRegisterAll);
        return new Promise((resolve, reject) => {
            makeReject && setTimeout(() => {
                reject(new TypeError("Failed to register a ServiceWorker."));
            }, Math.round(1300 + 1700 * Math.random()) + 0.125);
        });
    };
    Promise.resolve().then(unRegisterAll);
    unRegisterAll();
}


(() => {

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
    const indr = o => insp(o).$ || o.$ || 0;
  
    const getThumbnail = (thumbnails) => {
      let v = 0, n = (thumbnails || 0).length;
      if (!n) return null;
      let j = -1;
      for (let i = 0; i < n; i++) {
        const thumbnail = thumbnails[i];
        let k = thumbnail.width * thumbnail.height;
        if (k > v) {
          j = i;
          v = k;
        }
      }
      if (j >= 0) {
        return thumbnails[j];
      }
      return null;
    }
  
    // let normal = false;
    const ytDOMWM = new WeakMap();
    Object.defineProperty(Element.prototype, 'usePatchedLifecycles', {
      get() {
        let val = ytDOMWM.get(this);
        if (val === 0) val = false;
        if (val && !this.isConnected && !this.classList.contains('style-scope')) val = false;
        return val;
      },
      set(nv) {
        let control = false;
        const nodeName = (this?.nodeName || '').toLowerCase();
        switch (nodeName) {
          case 'yt-attributed-string':
          case 'yt-image':
            if (this?.classList?.length > 0) {
              control = false;
            } else {
              control = true;
            }
            break;
  
          case 'yt-player-seek-continuation':
          // case 'yt-iframed-player-events-relay':
          case 'yt-payments-manager':
          case 'yt-visibility-monitor':
          // case 'yt-invalidation-continuation': // live chat loading
          case 'yt-live-chat-replay-continuation':
          case 'yt-reload-continuation':
          case 'yt-timed-continuation':
  
            control = true;
            break;
          case 'yt-horizontal-list-renderer':
          case 'ytd-rich-grid-slim-media':
          case 'ytd-rich-item-renderer':
          case 'yt-emoji-picker-renderer':
            // if (!normal) {
              // control = true;
            // }
            break;
          case 'yt-img-shadow':
            if (nv) {
              const cnt = insp(this);
              const url0 = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url
              if (url0 && url0.length > 17) {
                // normal = true;
                control = true;
                Promise.resolve(0).then(() => {
                  const url = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url || url0;
                  cnt.$.img.src = `${url}`;
                });
              } else {
                control = false;
              }
            }
            break;
          default:
            control = false;
            // if (nv) {
            //   if (!normal) {
            //     Promise.resolve(0).then(() => {
            //       if (!normal && (this.classList.contains('style-scope') || this.isConnected === true)) {
            //         normal = true;
            //       }
            //     });
            //   }
            // }
        }
        if (control) nv = 0;
        ytDOMWM.set(this, nv);
        return true;
      },
      enumerable: false,
      configurable: true
    });
  
  })();