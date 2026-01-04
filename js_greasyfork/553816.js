// ==UserScript==
// @name         Old School YouTube Player
// @namespace    https://github.com/blakegearin/old-school-youtube-player
// @version      2025.11.1
// @description  Updates YouTube's video player to the look & feel before the 2025 redesign
// @author       Blake Gearin <hello@blakeg.me> (https://blakegearin.com)
// @match        *://*.youtube.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @icon         https://raw.githubusercontent.com/blakegearin/old-school-youtube-player/main/img/logo.png
// @supportURL   https://github.com/blakegearin/old-school-youtube-player/issues
// @license      GPL-3.0-only
// @copyright    2025, Blake Gearin (https://blakegearin.com)
// @downloadURL https://update.greasyfork.org/scripts/553816/Old%20School%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/553816/Old%20School%20YouTube%20Player.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
let css = `
  /* Background */

  .ytp-delhi-modern .ytp-chrome-bottom
  {
    bottom: 0;
    z-index: 59;
  }

  /* Only display on hover */
  .ytp-delhi-modern:hover::before
  {
    content: "";
    height: 194px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADCCAYAAACIaaiTAAAAQklEQVR4AeySwQoAIAhDzf7/n2sjgqTrgw55GE5kTFnGrBPapkiHiIY8w8qwPHfCN74yXh5hmkpOF7gzFHqbvbcyAAAA//8elbrCAAAABklEQVQDALt6AjFGny3LAAAAAElFTkSuQmCC);
    opacity: 1;
    display: block;
    padding-top: 37px;
    bottom: 0;
    z-index: 24;
    background-position: bottom;
    width: 100%;
    position: absolute;
    background-repeat: repeat-x;
    pointer-events: none;
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-play-button,
  .ytp-delhi-modern.ytp-delhi-modern-compact-controls .ytp-chrome-controls .ytp-play-button,
  .ytp-delhi-modern .ytp-chapter-title.ytp-button,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls,
  .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area,
  .ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *),
  .ytp-delhi-modern .ytp-chrome-controls .ytp-next-button:not(.ytp-miniplayer-button-container > *),
  .ytp-delhi-modern .ytp-prev-button:not(.ytp-miniplayer-button-container > *)
  {
    background: transparent !important;
  }

  .ytp-delhi-modern .ytp-overlay-bottom-left,
  .ytp-delhi-modern .ytp-overlay-bottom-right
  {
    margin-bottom: -7px;
  }

  .ytp-delhi-modern.ytp-fullscreen-grid-peeking .ytp-overlay-bottom-left,
  .ytp-delhi-modern.ytp-fullscreen-grid-peeking .ytp-overlay-bottom-right
  {
    margin-bottom: -22px;
  }

  /* Height  */

  .ytp-delhi-modern .ytp-chrome-bottom
  {
    height: 51px !important;
  }

  .ytp-delhi-modern .ytp-chrome-controls
  {
    height: 48px !important;
    line-height: 48px !important;
    margin-top: 3px;
  }

  .ytp-delhi-modern .ytp-chrome-controls
  {
    height: var(--yt-delhi-bottom-controls-height,72px);
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-play-button,
  .ytp-delhi-modern .ytp-prev-button,
  .ytp-delhi-modern .ytp-prev-button svg,
  .ytp-delhi-modern .ytp-next-button,
  .ytp-delhi-modern .ytp-next-button svg,
  .ytp-delhi-modern .ytp-volume-icon.ytp-button,
  .ytp-delhi-modern .ytp-chapter-container,
  .ytp-delhi-modern .ytp-time-display:not(.ytp-miniplayer-ui *),
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-left,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-right,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls,
  .ytp-delhi-modern .ytp-subtitles-button-icon svg,
  .ytp-delhi-modern button.ytp-subtitles-button:nth-child(3) > div:nth-child(1),
  .ytp-delhi-modern .ytp-hd-quality-badge svg,
  .ytp-delhi-modern .ytp-right-controls-left button > svg,
  .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area
  {
    height: 48px !important;
  }

  /* Progress bar */

  .ytp-delhi-modern .ytp-progress-bar-container
  {
    bottom: 43px !important;
  }

  .ytp-delhi-modern .ytp-progress-bar
  {
    margin-bottom: 2px;
  }

  .ytp-delhi-modern .ytp-progress-list
  {
    background: rgba(255,255,255,.2);
  }

  .ytp-delhi-modern:not(.ytp-player-minimized) .ytp-progress-bar-container
  {
    bottom: 47px;
    height: 5px;
    margin-bottom: 3px;
  }

  .ytp-delhi-modern .ytp-progress-bar-start.ytp-progress-bar-end
  {
    border-radius: 0px;
  }

  .ytp-delhi-modern .ytp-play-progress
  {
    background: #f03;
  }

  .ytp-delhi-modern .ytp-scrubber-button
  {
    height: 13px;
    width: 13px;
  }

  .ytp-delhi-modern .ytp-scrubber-container
  {
    top: -4px;
  }

  /* Disable growing scrubber */
  .ytp-delhi-modern .ytp-progress-bar-container:hover:not([aria-disabled="true"]) .ytp-scrubber-button
  {
    transform: none !important;
  }

  .ytp-delhi-modern .ytp-heat-map-container
  {
    margin-bottom: 2px !important;
  }

  .ytp-delhi-modern .ytp-modern-heat-map
  {
    fill: white !important;
    fill-opacity: 0.4 !important;
    stroke: none !important;
  }

  /* Opacity */

  .ytp-delhi-modern .ytp-chrome-controls .ytp-next-button:not(.ytp-miniplayer-button-container>*)::after,
  .ytp-delhi-modern .ytp-prev-button:not(.ytp-miniplayer-button-container>*)::after,
  .ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *):hover::after,
  .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area::after,
  .ytp-delhi-modern .ytp-play-button::after,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button:hover::before,
  .ytp-delhi-modern .ytp-chapter-title.ytp-button::after
  {
    opacity: 0 !important;
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-button,
  .ytp-delhi-modern .ytp-replay-button
  {
    opacity: .9 !important;
  }

  .ytp-delhi-modern .ytp-chrome-top .ytp-button:hover,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-button:not([aria-disabled="true"]):not([disabled]):hover,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-button[aria-expanded="true"], .ytp-chrome-controls .ytp-button[aria-pressed="true"],
  .ytp-delhi-modern .ytp-replay-button:hover
  {
    opacity: 1 !important;
    -webkit-transition: opacity .1s cubic-bezier(0,0,.2,1) !important;
    transition: opacity .1s cubic-bezier(0,0,.2,1) !important;
  }

  /* Centering */

  .ytp-delhi-modern .ytp-chrome-controls .ytp-play-button,
  .ytp-delhi-modern .ytp-chapter-container,
  .ytp-delhi-modern .ytp-volume-icon,
  .ytp-delhi-modern .ytp-left-controls,
  .ytp-delhi-modern .ytp-volume-icon,
  .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area .ytp-volume-icon,
  .ytp-delhi-modern .ytp-chapter-container.sponsorblock-chapter-visible,
  .ytp-delhi-modern .ytp-time-display:not(.ytp-miniplayer-ui *)
  {
    display: flex !important;
    align-items: center !important;
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button,
  .ytp-delhi-modern button.ytp-subtitles-button:nth-child(3) > div:nth-child(1)
  {
    align-items: center;
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-left, .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-right-controls-right
  {
    display: flex;
    align-items: center;
    -webkit-box-align: end;
  }

  /* Play/Pause/Replay */

  .ytp-delhi-modern .ytp-play-button
  {
    height: 48px !important;
    width: 42px !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
  }

  .ytp-delhi-modern .ytp-play-button svg
  {
    height: 48px !important;
    width: 42px !important;
    filter: opacity(0.9) drop-shadow(0px 0px) !important;
  }

  .ytp-delhi-modern .ytp-play-button[data-title-no-tooltip="Play"] svg path
  {
    d: path('M12,26L25,18L12,10L12,26Z');
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-play-button[data-title-no-tooltip="Pause"] svg path
  {
    d: path('M12 26h4V10h-4zm9 0h4V10h-4z');
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-play-button[data-title-no-tooltip="Replay"] svg path
  {
    d: path('M18 11V7l-5 5 5 5v-4c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6h-2c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z');
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-play-button:hover::after,
  .ytp-delhi-modern.ytp-big-mode .ytp-play-button:hover::after
  {
    background-color: var(--yt-spec-overlay-button-secondary,rgba(255,255,255,.1));
    -webkit-transition: background-color .2s cubic-bezier(.05,0,0,1);
    transition: background-color .2s cubic-bezier(.05,0,0,1);
  }

  /* Playlists */

  .ytp-delhi-modern .ytp-prev-button svg path
  {
    d: path('M12 12h2v12h-2zm3.5 6 8.5 6V12z');
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-next-button svg path
  {
    d: path('m12 24 8.5-6-8.5-6v12zm10-12v12h2V12h-2z');
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-left-controls:has(.ytp-prev-button) .ytp-prev-button
  {
    left: -40px;
  }

  .ytp-delhi-modern .ytp-left-controls:has(.ytp-prev-button[aria-disabled="false"]) .ytp-play-button
  {
    left: 48px !important;
  }

  /* Volume */

  .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area
  {
    height: 48px !important;
    margin-left: 6px !important;
  }

  .ytp-delhi-modern .ytp-volume-icon[data-title-no-tooltip="Mute"],
  .ytp-delhi-modern .ytp-volume-icon[data-title-no-tooltip="Unmute"]
  {
    height: 48px !important;
    width: 48px !important;
  }

  .ytp-delhi-modern .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child
  {
    d: path("M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Z");
    transform: translate(-25%, -25%);
  }

  .ytp-delhi-modern .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:not(:first-child)
  {
    display: none !important;
  }

  .ytp-delhi-modern .ytp-time-wrapper
  {
    padding-left: 0 !important;
  }

  .ytp-delhi-modern .ytp-volume-icon[data-title-no-tooltip="Unmute"] svg path,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext="0% volume"]) .ytp-volume-icon svg path
  {
    d: path("M21.48 17.98a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51a8.796 8.796 0 0 0 1.03-4.15c0-4.28-2.99-7.86-7-8.76v2.05c2.89.86 5 3.54 5 6.71Zm-14.73-9-1.27 1.26 4.72 4.73H7.98v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81l2.04 2.05 1.27-1.27-9-9-7.72-7.72Zm7.72.99-2.09 2.08 2.09 2.09V9.98Z");
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.01;
    stroke-width: 2px;
    paint-order: stroke;
  }

  /* Apply max volume icon when >50% */
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext="51% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext^="5"]):has(.ytp-volume-panel[aria-valuetext$="% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext^="6"]):has(.ytp-volume-panel[aria-valuetext$="% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext^="7"]):has(.ytp-volume-panel[aria-valuetext$="% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext^="8"]):has(.ytp-volume-panel[aria-valuetext$="% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext^="9"]):has(.ytp-volume-panel[aria-valuetext$="% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child,
  .ytp-delhi-modern .ytp-volume-area:has(.ytp-volume-panel[aria-valuetext="100% volume"]) .ytp-volume-icon[data-title-no-tooltip="Mute"] svg path:first-child
  {
    d: path("M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Zm0-2.71c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06Z") !important;
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.05;
    stroke-width: 3px;
    paint-order: stroke;
  }

  /* Time */

  .ytp-time-contents span,
  .ytp-delhi-modern .ytp-time-current,
  .ytp-delhi-modern .ytp-time-separator,
  .ytp-delhi-modern .ytp-time-duration
  {
    color: #ddd;
    text-shadow: 0 0 2px rgba(0, 0, 0, .5);
    font-size: 94%;
    font-weight: normal;
  }

  /* Right controls */

  .ytp-delhi-modern .ytp-right-controls
  {
    height: 48px !important;
    margin-right: 12px;
    padding-right: 0 !important;
  }

  /* Right controls right */

  .ytp-delhi-modern .ytp-size-button svg path
  {
    d: path("M28 11v14H8V11zm-18 2h16v10H10V13z");
    transform: translate(-25%, -25%);
    fill-rule: evenodd;
    stroke: #000;
    stroke-opacity: 0.05;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-fullscreen-button svg path
  {
    d: path("M10 16h2v-4h4v-2h-6v6zM20 10v2h4v4h2v-6h-6zM24 24h-4v2h6v-6h-2v4zM12 20h-2v6h6v-2h-4v-4");
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.05;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-size-button svg,
  .ytp-delhi-modern .ytp-remote-button svg,
  .ytp-delhi-modern .ytp-fullscreen-button svg
  {
    height: 29px !important;
    width: 29px !important;
    padding: 9.5px !important;
  }

  /* Right controls left */

  .ytp-delhi-modern .ytp-right-controls-left
  {
    margin-right: 2px !important;
  }

  .ytp-delhi-modern .ytp-settings-button svg path
  {
    d: path("M23.94 18.78c.03-.25.05-.51.05-.78s-.02-.52-.05-.78l1.68-1.32c.15-.12.19-.33.09-.51l-1.6-2.76c-.09-.17-.31-.24-.48-.17l-1.99.8c-.41-.32-.86-.58-1.35-.78l-.3-2.12a.382.382 0 0 0-.39-.33h-3.2c-.2 0-.36.14-.39.33l-.3 2.12c-.48.2-.93.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.48.17l-1.6 2.76c-.1.17-.05.39.09.51l1.68 1.32c-.03.25-.05.52-.05.78s.02.52.05.78l-1.68 1.32c-.15.12-.19.33-.09.51l1.6 2.76c.09.17.31.24.48.17l1.99-.8c.41.32.86.58 1.35.78l.3 2.12c.02.19.19.33.39.33h3.2c.2 0 .36-.14.39-.33l.3-2.12c.48-.2.93-.47 1.35-.78l1.99.8c.18.07.39 0 .48-.17l1.6-2.76c.09-.17.05-.39-.09-.51l-1.68-1.32zM18 20.79c-1.54 0-2.8-1.25-2.8-2.8 0-1.54 1.25-2.8 2.8-2.8 1.54 0 2.8 1.25 2.8 2.8 0 1.54-1.25 2.8-2.8 2.8z");
    transform: translate(-25%, -25%);
    stroke: #000;
    stroke-opacity: 0.05;
    stroke-width: 2px;
    paint-order: stroke;
  }

  .ytp-delhi-modern .ytp-settings-button.ytp-hd-quality-badge::after
  {
    right: 3px;
  }

  .ytp-delhi-modern .ytp-subtitles-button-icon svg,
  .ytp-delhi-modern .ytp-settings-button svg
  {
    width: 29px !important;
    padding: 9.5px !important;
  }

  .ytp-delhi-modern .ytp-autonav-toggle
  {
    margin-right: 4px;
  }

  .ytp-delhi-modern .ytp-autonav-toggle-button[aria-checked=true]::after
  {
    left: 1px !important;
    transform: translateX(15.6px) !important;

    height: 20.4px !important;
    width: 20.4px !important;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDAxMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=') !important;
    background-size: cover !important;
    background-color: transparent !important;
    margin: 0 !important;
    margin-top: -3px !important;
    border-radius: 20.4px !important;
  }

  .ytp-delhi-modern .ytp-autonav-toggle-button[aria-checked=false]::after
  {
    height: 20.4px !important;
    width: 20.4px !important;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PGRlZnMgLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNmE3LjUgNy41IDAgMTAwLTE1IDcuNSA3LjUgMCAwMDAgMTV6IiBmaWxsPSIjNzE3MTcxIiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTcgOC41YTguNSA4LjUgMCAxMS0xNyAwIDguNSA4LjUgMCAwMTE3IDB6bS0xIDBhNy41IDcuNSAwIDExLTE1IDAgNy41IDcuNSAwIDAxMTUgMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGQ9Ik01LjUgMTJoMlY1aC0ydjd6TTkuNSA1djdoMlY1aC0yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=') !important;
    background-size: cover !important;
    background-color: transparent !important;
    margin: 0 !important;
    margin-top: -3px !important;
    border-radius: 20.4px !important;
  }

  .ytp-delhi-modern .ytp-autonav-toggle-button
  {
    height: 14.4px !important;
    width: 36px !important;
    border-radius: 14.4px !important;
    top: 50% !important;
    position: relative !important;
    cursor: pointer !important;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSI+PGRlZnMgLz48cGF0aCBvcGFjaXR5PSIuNSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMi43IDExYzIuOTUgMCA1LjMtMi4yMSA1LjMtNXMtMi4zNS01LTUuMy01SDcuM0M0LjM1IDEgMiAzLjIxIDIgNnMyLjM1IDUgNS4zIDVoMTUuNHoiIGZpbGw9IiNmZmYiIC8+PHBhdGggb3BhY2l0eT0iLjUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy4zIDFDNC4zNSAxIDIgMy4yMSAyIDZzMi4zNSA1IDUuMyA1aDE1LjRBNS4xNiA1LjE2IDAgMDAyOCA2bC0uMDMtLjU0QTUuMTYgNS4xNiAwIDAwMjIuNyAxSDcuM3ptMTUuNCAxMWMzLjQ1IDAgNi4zLTIuNiA2LjMtNnMtMi44NS02LTYuMy02SDcuM0MzLjg1IDAgMSAyLjYgMSA2czIuODUgNiA2LjMgNmgxNS40eiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMyIgLz48L3N2Zz4=') !important;
    background-color: transparent !important;
  }

  /* Closed captions */

  .ytp-delhi-modern .ytp-subtitles-button svg path
  {
    d: path("M11 11a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V13c0-1.1-.9-2-2-2H11Zm6 6h-1.5v-.5h-2v3h2V19H17v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1Zm7 0h-1.5v-.5h-2v3h2V19H24v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1Z");
    transform: translate(-25%, -25%);
  }

  .ytp-delhi-modern .ytp-subtitles-button .ytp-subtitles-button-icon svg
  {
    filter: drop-shadow(0px 0px);
  }

  .ytp-delhi-modern .ytp-subtitles-button[data-title-no-tooltip="Subtitles/closed captions unavailable"] .ytp-subtitles-button-icon svg
  {
    fill-opacity: 0.3;
  }

  .ytp-delhi-modern .ytp-subtitles-button[aria-pressed="true"]:hover .ytp-subtitles-button-icon svg
  {
    fill-opacity: 1 !important;
  }

  .ytp-delhi-modern .ytp-subtitles-button[aria-pressed="true"]:not(:hover) .ytp-subtitles-button-icon svg
  {
    fill-opacity: 0.9 !important;
  }

  .ytp-delhi-modern .ytp-subtitles-button[aria-pressed="true"] .ytp-subtitles-button-icon::after
  {
    content: "";
    display: block;
    position: absolute;
    width: 24px;
    left: 14.5px;
    height: 3px;
    border-radius: 3px;
    bottom: 9px;
    background-color: var(--yt-spec-red-indicator,#e1002d);
    -webkit-transition: left .25s cubic-bezier(0, 0, .2, 1), width .25s cubic-bezier(0, 0, .2, 1);
    transition: left .25s cubic-bezier(0, 0, .2, 1), width .25s cubic-bezier(0, 0, .2, 1);
  }

  /* Margins */

  .ytp-delhi-modern .ytp-volume-area
  {
    margin-bottom: 0 !important;
  }

  .ytp-delhi-modern .ytp-volume-area,
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls
  {
    margin-top: 0 !important;
  }

  .ytp-delhi-modern .ytp-chapter-container
  {
    padding-top: 0 !important;
  }

  .ytp-delhi-modern .ytp-chrome-controls .ytp-next-button:not(.ytp-miniplayer-button-container > *),
  .ytp-delhi-modern .ytp-prev-button:not(.ytp-miniplayer-button-container > *)
  {
    margin: 0 !important;
  }

  /* Miscellaneous */

  .ytp-delhi-modern .ytp-prev-button,
  .ytp-delhi-modern .ytp-next-button,
  .ytp-delhi-modern .ytp-time-display:not(.ytp-miniplayer-ui *),
  .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button,
  .ytp-delhi-modern-icons .ytp-chrome-controls .ytp-play-button svg
  {
    padding: 0 !important;
  }

  .ytp-delhi-modern .ytp-prev-button svg,
  .ytp-delhi-modern .ytp-next-button svg,
  .ytp-delhi-modern .ytp-subtitles-button-icon svg,
  .ytp-delhi-modern .ytp-hd-quality-badge svg,
  .ytp-delhi-modern .ytp-right-controls-left button > svg
  {
    padding: 0 12px !important;
  }
`;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
