// ==UserScript==
// @name         Various Streaming Websites - Gradient Overlay Removers
// @namespace    userstyles.world/user/ariackonrel
// @version      1.0
// @description  Removes gradient/black overlays from various streaming sites (Discovery+, Peacock, Hulu, HBO Max, Amazon Prime Video, Paramount Plus)
// @author       ariackonrel
// @match        *://play.discoveryplus.com/video/watch/*
// @match        *://*.peacocktv.com/watch/*
// @match        *://*.hulu.com/watch/*
// @match        *://play.hbomax.com/video/watch/*
// @match        *://*.amazon.com/gp/video/*
// @match        *://www.paramountplus.com/shows/video/*
// @match        *://www.paramountplus.com/movies/video/*
// @match        *://www.paramountplus.com/live-tv/stream/*
// @license      No License
// @grant        GM_addStyle
// @homepageURL  https://userstyles.world/user/ariackonrel
// @downloadURL https://update.greasyfork.org/scripts/552219/Various%20Streaming%20Websites%20-%20Gradient%20Overlay%20Removers.user.js
// @updateURL https://update.greasyfork.org/scripts/552219/Various%20Streaming%20Websites%20-%20Gradient%20Overlay%20Removers.meta.js
// ==/UserScript==
/*     Portions of this code and design ideas were inspired by:
//   - https://github.com/bakerTX/better-peacock-overlays
//   - https://userstyles.world/style/9701/remove-hulu-overlay-controls-edge-dimming-fade-darkening-effect
//   - https://userstyles.world/style/7779/default-slug */

(function() {
    'use strict';
    const host = window.location.hostname;
    const url = window.location.href;

    /* Discovery+ */
    if (host.includes('discoveryplus.com') && url.includes('/video/watch/')) {
        GM_addStyle(`
            .TopGradient-Fuse-Web-Play__sc-xdp0fw-1,
            .BottomGradient-Fuse-Web-Play__sc-xdp0fw-2,
            [class*="TopGradient-Fuse-Web-Play"],
            [class*="BottomGradient-Fuse-Web-Play"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            div[class*="overlay"],
            div[class*="Overlay"] {
                background: none !important;
                opacity: 1 !important;
            }
        `);
    }

    /* PeacockTV */
    if (host.includes('peacocktv.com') && url.includes('/watch/')) {
        GM_addStyle(`
            .playback-overlay__container,
            .playback-rating-overlay__container,
            .playback-header__container {
                background: none !important;
            }
            .playback-header__container,
            .playback-overlay__container-upper-controls,
            .playback-controls__container {
                transform: scale(0.75) !important;
            }
            .playback-metadata__container-title {
                font-size: 2rem !important;
            }
            .playback-metadata__container {
                margin-bottom: 0 !important;
            }
            div[class*="overlay"],
            div[class*="Overlay"] {
                background: none !important;
                opacity: 1 !important;
            }
        `);
    }

    /* Hulu */
    if (host.includes('hulu.com') && url.includes('/watch/')) {
        GM_addStyle(`
            .ControlScrims,
            .ControlScrim__bottom,
            .ControlScrim__top,
            .ControlScrim__gradient,
            .PlaybackControls,
            .BottomUiControls__playbackControls,
            .PlaybackControls,
            .VolumeControl,
            .PlaybackControls__item,
            .BottomUiControls__playbackControls,
            .PlayerSettingsGroup,
            .BottomUiControls__playerSettingsGroup,
            .Timeline,
            .Timeline__sliderContainer,
            .Timeline__slider,
            .ControlsContainer__panel,
            .FliptrayWrapper,
            .FliptrayWrapper:before,
            .FliptrayWrapper:after,
            .Thumbnail__mask,
            .hulu-player-app[min-width~="2160px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient,
            .hulu-player-app[min-width~="1440px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient,
            .hulu-player-app[min-width~="1024px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient,
            .hulu-player-app[min-width~="768px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient,
            .hulu-player-app[min-width~="480px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient,
            .hulu-player-app[min-width~="320px"] .ControlScrims .ControlScrim__bottom .ControlScrim__gradient {
                background: none !important;
                text-shadow: 2px 2px #000;
            }
            .ControlsContainer__transition {
                transition-property: none !important;
            }
        `);
    }

    /* HBO Max / Max */
    if (host.includes('hbomax.com') && url.includes('/video/watch/')) {
        GM_addStyle(`
            div[class*="ProtectionLayerContainer-Fuse-Web-Play"] div[class*="TopGradient-Fuse-Web-Play"],
            div[class*="ProtectionLayerContainer-Fuse-Web-Play"] div[class*="BottomGradient-Fuse-Web-Play"],
            div.tui-play-slate,
            div.max-section-trailer-nav,
            div.tui-control-bar__background {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                background: none !important;
            }
            div.tui-control-bar,
            div.max-section-trailer-nav {
                transition: none !important;
            }
            [id*="overlay-root"] div[class*="Overlay"],
            [id*="overlay-root"] div[class*="overlay"] {
                background: none !important;
                opacity: 1 !important;
            }
        `);
    }

    /* Amazon Prime Video */
    if (host.includes('amazon.com') && url.includes('/gp/video/')) {
        GM_addStyle(`
            body > div.dv-player-fullscreen div.atvwebplayersdk-overlays-container > div {
                background: none !important;
            }
            body > div.dv-player-fullscreen div.atvwebplayersdk-overlays-container * {
                transition: none !important;
            }
            body > div.dv-player-fullscreen div.atvwebplayersdk-overlays-container img,
            body > div.dv-player-fullscreen div.atvwebplayersdk-captions-overlay {
                opacity: 1 !important;
            }
        `);
    }

    /* Paramount Plus */
    if (host.includes('paramountplus.com')) {
        GM_addStyle(`
            div.top-menu-backplane,
            div.controls-backplane,
            div.top-menu-hint-bg,
            div.start-panel-click-overlay,
            div.start-panel-metadata,
            div.skin-sidebar-plugin {
                background: none !important;
            }
            main#main-container * {
                transition: none !important;
            }
            div.tt-container[style] {
                padding: 10px !important;
                text-shadow: black 2px 2px 2px;
            }
            div.rating-manager {
                display: none !important;
            }
        `);
    }

})();