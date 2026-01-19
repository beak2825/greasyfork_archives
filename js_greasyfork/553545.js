// ==UserScript==
// @name         eventsTimer
// @namespace    NearestEventTimer
// @version      1.0.12
// @grant        GM_getValue
// @grant        GM_setValue
// @description  ljovcheg  [3191064]
// @author       ljovcheg  [3191064] 
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/553545/eventsTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/553545/eventsTimer.meta.js
// ==/UserScript==

/*
HOT FIX
*/

(function () {
    'use strict';
    throwRed(`started | v${GM_info.script?.version || null}`);

    GM_addStyle(`
        .currentEvent{
            border: 2px solid rgba(97, 119, 0, 1) !important;
            background-color: rgba(20, 48, 6, 0.3) !important;
            color: rgba(255, 255, 255, 0.9);
        }   
        #eventTimer {
            background-color: rgba(0, 0, 0, 0.5);
            margin-bottom: 7px;
            border-radius: 5px;
            padding: 6px;
            overflow: hidden;
 
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; 
            line-height: 16px;
            font-weight: normal;
            font-size: 11px;
            
        }
       
        
 
 
        /* Container default: icon + time on same row, name hidden */
        .eventT {
            display: flex;
            align-items: center;
            gap: 1px;
            
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            
        }
 
        .hidden{
            display: none;
        }
       
        /* Icon button fixed 20x20 */
        .eventT .icon {
            width: 40px;
            height: 15px;
            padding: 0;
            border: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
 
            background-color: transparent;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
 
            opacity: 1;
        }
 
        .eventT .icon:hover{
            border-radius: 5px;
        }
 
 
        /* Ensure the embedded image is exactly 20x20 */
        .eventT .icon img {
        }
 
        /* Name is hidden by default (second element in DOM) */
        .eventT .name {
            display: none;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font: inherit;
        }
 
        /* Time sits on the right in the default row */
        .eventT .time {
            margin-left: auto; /* push to right */
            width: 100%; 
        }
 
        /* --- Expanded state: .show-name --- */
        /* When showing name: stack vertically, hide icon, show name, time moves below */
        .eventT.show-name {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
 
        /* hide the icon in expanded state */
        .eventT.show-name .icon {
            display: none;
        }
 
        /* show the name in expanded state */
        .eventT.show-name .name {
            display: inline-block;
            text-align: center;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }
 
        /* place time on its own row in expanded state */
        .eventT.show-name .time {
            margin-left: 0;
        
        }
 
        /*
        .eventT .icon:focus,
        .eventT .name:focus {
            outline: 2px solid rgba(0, 120, 215, 0.6);
            outline-offset: 2px;
            border-radius: 3px;
        }
        */
 
        /* Optional: small transition for a pleasant toggle */
        .eventT .name,
        .eventT .time,
        .eventT .icon img {
            transition: opacity 120ms ease, transform 120ms ease;
        }
        
    `);

    let apiKey;;
    let events;
    let userEventStartTime;
    let nearestEvent;
    let sortedEvents;

    let tornClockSearchAttempt = 0

    let div;    // timer div object

    let iconDiv;
    let nameDiv;
    let timeDiv;
    let msgDiv;
    let eventDiv;

    let mode = "";
    //  List of Torn events that uses user start time
    /*
    let eventsWithUserTimte = [
        "Valentine's Day",
        "St Patrick's Day",
        "Easter Egg Hunt",
        "420 Day",
        "Museum Day",
        "World Blood Donor Day",
        "World Population Day",
        "World Tiger Day",
        "International Beer Day",
        "Tourism Day",
        "CaffeineCon 2025",
        "Trick or Treat",
        "World Diabetes Day",
        "Slash Wednesday",
        "Christmas town"
    ]
        */

    //TODO this should be removed when API bug is fixed.
    let eventsWithUserTimte = [
        { name: "Weekend Road Trip", start: 1769990400, end: 1770163200 },
        { name: "Valentine's Day", start: 0, end: 0 },
        { name: "St Patrick's Day", start: 0, end: 0 },
        { name: "Easter Egg Hunt", start: 0, end: 0 },
        { name: "420 Day", start: 0, end: 0 },
        { name: "Museum Day", start: 0, end: 0 },
        { name: "World Blood Donor Day", start: 0, end: 0 },
        { name: "World Population Day", start: 0, end: 0 },
        { name: "World Tiger Day", start: 0, end: 0 },
        { name: "International Beer Day", start: 0, end: 0 },
        { name: "Tourism Day", start: 0, end: 0 },
        { name: "CaffeineCon 2025", start: 0, end: 0 },
        { name: "Trick or Treat", start: 0, end: 0 },
        { name: "World Diabetes Day", start: 1762992000, end: 1763164800 },
        { name: "Slash Wednesday", start: 1765324800, end: 1765497600 },
        { name: "Christmas town", start: 1766102400, end: 1767139200 }
    ];

    let iconColor = '#fff';
    let iconWidth = 1.2
    const eventIcons = {
        "awareness week": `<svg class="iconColor" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${iconColor}' stroke-linecap='round' stroke-linejoin='round' stroke-width='${iconWidth}'><path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0'/><path d='M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6'/></svg>`,
        "weekend road trip": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4"/></svg>`,
        "valentine's day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke='${iconColor}' stroke-linecap="round" stroke-linejoin="round" stroke-width='${iconWidth}' d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/></svg>`,
        "employee appreciation day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke='${iconColor}' stroke-linecap="round" stroke-linejoin="round"  stroke-width='${iconWidth}'><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm5-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-4 5v.01"/><path d="M3 13a20 20 0 0 0 18 0"/></g></svg>`,
        "st. patrick's day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 256 256"><path  fill='${iconColor}' d="M211.66 165.54C225.16 159.7 232 144.37 232 120s-6.84-39.7-20.34-45.55c-11.65-5-27.24-2.23-46.46 8.35c10.58-19.22 13.39-34.81 8.35-46.46C167.7 22.84 152.37 16 128 16s-39.7 6.84-45.55 20.34c-5 11.65-2.23 27.24 8.35 46.45C71.58 72.22 56 69.4 44.34 74.45C30.84 80.3 24 95.63 24 120s6.84 39.7 20.34 45.54A31 31 0 0 0 56.8 168c9.6 0 21-3.62 34-10.79c-10.58 19.2-13.39 34.79-8.35 46.44C88.3 217.15 103.63 224 128 224s39.7-6.85 45.55-20.35a32.24 32.24 0 0 0 2.34-15c10.45 16.23 19.64 34.48 24.35 53.33A8 8 0 0 0 208 248a8.13 8.13 0 0 0 1.95-.24a8 8 0 0 0 5.82-9.7c-6.94-27.76-22.27-53.8-37.86-74.79Q189.68 168 199.2 168a31 31 0 0 0 12.46-2.46m-6.37-76.4C214.14 93 216 108 216 120s-1.86 27-10.7 30.86c-8.36 3.63-23.52-1.31-42.68-13.91a243.4 243.4 0 0 1-22.54-17c18.41-15.58 50.32-37.27 65.21-30.81M97.14 42.7C101 33.86 116 32 128 32s27 1.86 30.86 10.7c3.63 8.36-1.31 23.52-13.91 42.68a243.4 243.4 0 0 1-17 22.54C112.37 89.51 90.69 57.59 97.14 42.7M50.71 150.86C41.86 147 40 132 40 120s1.86-27 10.7-30.86A15.64 15.64 0 0 1 57 88c8.75 0 21.34 5.17 36.4 15.07a243.4 243.4 0 0 1 22.54 17c-18.43 15.55-50.35 37.25-65.23 30.79m108.15 46.43C155 206.14 140 208 128 208s-27-1.86-30.86-10.7c-3.63-8.36 1.31-23.52 13.91-42.68a243.4 243.4 0 0 1 17-22.54c15.58 18.41 37.26 50.33 30.81 65.21"/></svg>`,
        "420 day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none"  stroke='${iconColor}' stroke-linecap="round" stroke-linejoin="round" stroke-width='${iconWidth}' d="M7 20s0-2 1-3.5c-1.5 0-2-.5-4-1.5c0 0 1.839-1.38 5-1c-1.789-.97-3.279-2.03-5-6c0 0 3.98-.3 6.5 3.5C8.216 6.6 12 2 12 2c2.734 5.47 2.389 7.5 1.5 9.5C16.031 7.73 20 8 20 8c-1.721 3.97-3.211 5.03-5 6c3.161-.38 5 1 5 1c-2 1-2.5 1.5-4 1.5c1 1.5 1 3.5 1 3.5c-2 0-4.438-2.22-5-3c-.563.78-3 3-5 3zm5 2v-5"/></svg>`,
        // "museum day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48" fill="none"><g fill="none" stroke='${iconColor}' stroke-width='${iconWidth}'><path stroke-linecap="round" stroke-linejoin="round" d="M4 44h40"/><path stroke-linejoin="round" d="M8 8.364L24 4l16 4.364V14H8V8.364Z"/><path stroke-linecap="round" d="M10 14v24m7-24v24m7-24v24m7-24v24m7-24v24"/><path stroke-linejoin="round" d="M7 38h34v6H7z"/></g></svg>`,
        "museum day": `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path fill='${iconColor}' d="M12.61 6.79L13 11.5h-2l.39-4.71A.99.99 0 0 1 11 6v-.5h2V6c0 .32-.15.61-.39.79m-3 0L10 11.5H8l.39-4.71A.99.99 0 0 1 8 6v-.5h2V6c0 .32-.15.61-.39.79m-3 0L7 11.5H5l.39-4.71A.99.99 0 0 1 5 6v-.5h2V6c0 .32-.15.61-.39.79m-3 0L4 11.5H2l.39-4.71A.99.99 0 0 1 2 6v-.5h2V6c0 .32-.15.61-.39.79M7.5 1L14 3.5V5H1V3.5zm-6 11h12l.5 1v1H1v-1z"/></svg>`,
        "world blood donor day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48" fill="${iconColor}"><g fill="${iconColor}"><path fill-rule="evenodd" d="M20.923 10.615a1 1 0 0 0-1.846 0l-5 12a1 1 0 0 0 1.846.77L16.917 21h6.166l.994 2.385a1 1 0 0 0 1.846-.77l-5-12ZM20 13.6l2.25 5.4h-4.5L20 13.6Z" clip-rule="evenodd"/><path d="M31 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z"/><path fill-rule="evenodd" d="M38 34.03c0 2.193-1.79 3.97-4 3.97h-4v2h-5v4h-2v-4h-5v-2h-4c-2.21 0-4-1.777-4-3.97V10.328c0-2.192 1.79-3.97 4-3.97h6l1.132-1.155a4.022 4.022 0 0 1 5.736 0L28 6.358h6c2.21 0 4 1.777 4 3.97V34.03ZM26.571 7.759a2 2 0 0 0 1.429.6h6c1.12 0 2 .896 2 1.97v17.21a8.441 8.441 0 0 0-.925-.625c-1.825-1.062-4.465-1.614-7.583.226c-2.568 1.515-4.983 1.925-7.61 1.98c-1.171.025-2.368-.02-3.651-.069l-.53-.02A68.676 68.676 0 0 0 12 28.972V10.327c0-1.073.88-1.97 2-1.97h6a2 2 0 0 0 1.429-.6l1.132-1.155a2.021 2.021 0 0 1 2.878 0l1.132 1.156Zm-10.944 23.27A66.538 66.538 0 0 0 12 30.971v3.06c0 1.073.88 1.969 2 1.969h20c1.12 0 2-.896 2-1.97v-3.7a6.998 6.998 0 0 0-1.931-1.688c-1.294-.753-3.155-1.2-5.56.22c-2.958 1.744-5.743 2.197-8.585 2.257c-1.234.026-2.494-.021-3.77-.07l-.527-.02Z" clip-rule="evenodd"/></g></svg>`,
        //"world blood donor day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="${iconColor}"><g fill="${iconColor}"><path fill-rule="evenodd" d="M10.962 6.81a.5.5 0 0 0-.924 0L8.729 9.987l-.008.02l-.433 1.053a.5.5 0 1 0 .924.38l.31-.752h1.956l.31.752a.5.5 0 1 0 .924-.38l-.433-1.052l-.008-.021zM10.5 8.313l.566 1.374H9.934z" clip-rule="evenodd"/><path d="M12.854 9a.5.5 0 0 1 .5-.5h.546V8a.5.5 0 0 1 1 0v.5h.454a.5.5 0 1 1 0 1H14.9v.5a.5.5 0 0 1-1 0v-.5h-.546a.5.5 0 0 1-.5-.5"/><path fill-rule="evenodd" d="M19 5.164v11.851A1.99 1.99 0 0 1 17 19h-2v1h-2v2h-2v-2H9v-1H7c-1.105 0-2-.889-2-1.985V5.164c0-1.096.895-1.985 2-1.985h3l.566-.578a2.01 2.01 0 0 1 2.868 0L14 3.18h3c1.105 0 2 .889 2 1.985m-5 .015a2 2 0 0 1-1.429-.6L12.005 4h-.01l-.566.579a2 2 0 0 1-1.429.6H7v9.437q.502 0 .98.003c2.262.015 4.13.028 5.906-.975c1.285-.725 2.378-.38 3.114.093V5.18z" clip-rule="evenodd"/></g></svg>`,
        "world population day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" d="M13.647 17.716c.38-.097.68-.447 1.28-1.149l5.187-6.059c1.91-2.23 2.64-5.348.904-7.969c-.575-.869-1.537-.56-2.138.034L2.574 18.692a1.92 1.92 0 0 0 0 2.74a1.975 1.975 0 0 0 3.005-.276c.946-1.368 2.428-4.885 4.08-5.51c1.712-.65 2.309 2.498 3.988 2.07" color="currentColor"/></svg>`,
        //"world tiger day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="${iconColor}" d="M425.479 25.666c.695.03 1.233.235 1.6.637c28.156 30.856 23.75 58.537 18.36 87.437c-2.37 4.836-4.483 8.801-6.79 12.07c-5.074 7.188-11.345 12.477-26.674 20.141l8.05 16.098c16.671-8.336 26.4-16.047 33.327-25.86a76.374 76.374 0 0 0 1.99-2.98c23.481 29.638 37.639 65.615 40.162 105.69c-10.473-11.076-20.322-14.383-32.865-16.864c-3.655-17.373-11.07-34.942-23.44-51.433l-14.398 10.796c22.344 29.793 25.952 62.948 20.375 90.836c-5.578 27.889-21.494 49.864-33.201 55.717c-17.61 8.805-30.338 21.686-40.338 31.686c-5 5-9.353 9.287-12.854 11.965c-.175.133-.333.24-.502.365c-.852-4.857-2.097-9.886-3.67-15.076c-5.313-17.534-14.622-37.068-26.894-57.522l-15.434 9.262c11.728 19.546 20.419 38.012 25.106 53.478c4.687 15.467 4.988 27.718 2.256 34.55c-2.733 6.83-7.22 10.423-19.944 10.847c-11.082.37-27.763-2.992-49.941-11.604C317.866 378.86 305.89 348.962 304 320c-16 32-32 32-48 32s-32 0-48-32c-1.89 28.962-13.866 58.859 34.24 75.902c-22.178 8.612-38.86 11.973-49.941 11.604c-12.724-.424-17.211-4.017-19.944-10.848c-2.732-6.83-2.43-19.082 2.256-34.549c4.687-15.466 13.378-33.932 25.106-53.478l-15.434-9.262c-12.272 20.454-21.581 39.988-26.894 57.522c-1.573 5.19-2.818 10.22-3.67 15.076c-.169-.124-.327-.232-.502-.365c-3.501-2.678-7.854-6.965-12.854-11.965c-10-10-22.728-22.88-40.338-31.686c-11.707-5.853-27.623-27.828-33.2-55.717c-5.578-27.888-1.97-61.043 20.374-90.836l-14.398-10.796c-12.37 16.491-19.785 34.06-23.44 51.433c-12.543 2.48-22.392 5.788-32.865 16.863c2.523-40.074 16.68-76.05 40.162-105.689a76.374 76.374 0 0 0 1.99 2.98c6.927 9.813 16.656 17.524 33.327 25.86l8.05-16.098c-15.329-7.664-21.6-12.953-26.673-20.14c-2.308-3.27-4.42-7.235-6.791-12.07c-5.39-28.9-9.796-56.582 18.36-87.438c.367-.402.905-.607 1.6-.637c9.097-.394 45.217 28.95 79.051 35.594c19.651-6.115 40.847-10.22 63.332-12.094l4.448 15.568c-13.92 1.875-28.343 5.444-44.198 10.729l5.692 17.074c16.147-5.382 30.123-8.91 43.425-10.584l4.463 15.62c-6.012.517-11.858 1.388-17.295 2.667c-9.38 2.207-17.681 5.276-23.802 11.397l12.726 12.726c1.88-1.879 7.578-4.81 15.198-6.603c5.387-1.268 11.681-2.114 18.226-2.506L256 144l8.213-28.746c6.545.392 12.839 1.238 18.226 2.506c7.62 1.793 13.319 4.724 15.198 6.603l12.726-12.726c-6.12-6.121-14.422-9.19-23.802-11.397c-5.437-1.279-11.283-2.15-17.295-2.668l4.463-15.619c13.302 1.673 27.278 5.202 43.425 10.584l5.692-17.074c-15.855-5.285-30.278-8.854-44.198-10.729l4.448-15.568c22.485 1.873 43.68 5.98 63.332 12.094c33.834-6.643 69.954-35.988 79.05-35.594zm-92.82 109.979c-40 16-59.059 23.357-76.659 23.357c-17.6 0-36.658-7.357-76.658-23.357l-6.684 16.71c40 16 60.942 24.643 83.342 24.643s43.342-8.643 83.342-24.643zm43.292 4.33c-14.39 28.78-43.976 43.976-75.976 59.976l7.588 15.172c-4.818 6.521-8.924 14.296-11.934 23.482c0 0-7.629 33.395-8.506 47.916l17.754 2.958C304 272 304 256 312.527 244.664c5.173 7.024 13.406 11.635 22.694 11.635c15.685 0 28.367-13.15 28.367-28.863c0-9.105-4.264-17.342-10.897-22.666c12.317-3.675 24.332-3.772 31.309-3.772v-17.996c-4.717 0-12.708-.032-22.129 1.363c12.116-9.681 22.675-21.335 30.178-36.34zm-239.902 0l-16.098 8.05c7.503 15.005 18.062 26.659 30.178 36.34c-9.421-1.395-17.412-1.363-22.129-1.363v17.996c6.977 0 18.992.097 31.309 3.772c-6.633 5.324-10.897 13.561-10.897 22.666c0 15.712 12.682 28.863 28.367 28.863c9.288 0 17.521-4.611 22.694-11.635C208 256 208 272 207.123 289.48l17.754-2.958c-.877-14.521-8.506-47.916-8.506-47.916c-3.01-9.186-7.116-16.96-11.934-23.482l7.588-15.172c-32-16-61.586-31.196-75.976-59.976zm272.488 49.18l-17.074 5.69c3.336 10.009 2.55 18.53-.664 27.313c-3.214 8.784-9.13 17.608-15.903 26.317c-6.773 8.708-14.338 17.246-20.529 26.129c-6.19 8.882-11.365 18.396-11.365 29.396h17.996c0-5 2.826-11.486 8.135-19.104c5.309-7.617 12.744-16.08 19.97-25.37c7.227-9.292 14.312-19.468 18.598-31.184c4.287-11.716 5.5-25.196.836-39.188zm-305.074 0c-4.664 13.991-3.45 27.47.836 39.187c4.286 11.716 11.37 21.892 18.597 31.183c7.227 9.292 14.662 17.754 19.971 25.371c5.31 7.618 8.135 14.104 8.135 19.104h17.996c0-11-5.174-20.514-11.365-29.396c-6.191-8.883-13.756-17.42-20.53-26.13c-6.773-8.708-12.688-17.532-15.902-26.316c-3.213-8.784-4-17.304-.664-27.312zm231.758 27.413c5.708 0 10.369 4.638 10.369 10.868c0 6.229-4.66 10.865-10.37 10.865c-5.708 0-10.368-4.636-10.368-10.865c0-6.23 4.66-10.868 10.369-10.868zm-158.442 0c5.709 0 10.37 4.638 10.37 10.868c0 6.229-4.661 10.865-10.37 10.865c-5.708 0-10.369-4.636-10.369-10.865c0-6.23 4.66-10.868 10.37-10.868zm287.065 12.034C499.508 289.222 495.39 352.61 480 368c-9.787-15.381-20.124-27.816-32-32c9.426 36.059 0 64-16 80c0-16-3.432-23.686-16-32c3.293 39.931-18.232 56.793-32 64c-6.028-11.65-17.48-24.433-33.275-35.494a31.768 31.768 0 0 0 5.63-9.164c1.46-3.648 2.367-7.5 2.829-11.526c3.896-1.288 7.36-3.491 10.533-5.918c4.999-3.822 9.646-8.535 14.646-13.535c10-10 21.272-21.12 35.662-28.314c20.293-10.147 36.377-36.172 42.8-68.283c2.935-14.677 3.599-30.76 1.019-47.164zm-415.688 0c-2.58 16.403-1.916 32.487 1.02 47.164c6.422 32.111 22.506 58.136 42.799 68.283c14.39 7.195 25.662 18.314 35.662 28.314c5 5 9.647 9.713 14.646 13.535c3.173 2.427 6.637 4.63 10.533 5.918c.462 4.027 1.37 7.878 2.829 11.526a31.768 31.768 0 0 0 5.63 9.164C145.48 423.566 134.028 436.35 128 448c-13.768-7.207-35.293-24.069-32-64c-12.568 8.314-16 16-16 32c-16-16-25.426-43.941-16-80c-11.876 4.184-22.213 16.619-32 32c-15.39-15.39-19.508-78.778 16.156-139.398zM424.998 256h-17.996c0 11.5-10.11 26.464-21.834 40.143c-5.862 6.839-11.89 13.345-16.754 19.56c-4.864 6.215-9.412 11.798-9.412 20.297h17.996c0 .5 1.452-3.918 5.588-9.203c4.136-5.285 10.108-11.779 16.246-18.94c12.276-14.321 26.166-31.358 26.166-51.857zm-320 0H87.002c0 20.5 13.89 37.536 26.166 51.857c6.138 7.161 12.11 13.655 16.246 18.94c4.136 5.285 5.588 9.702 5.588 9.203h17.996c0-8.5-4.548-14.082-9.412-20.297c-4.864-6.215-10.892-12.721-16.754-19.56c-11.724-13.679-21.834-28.642-21.834-40.143zm201.725 168.805c4.823.6 9.34.83 13.576.69a53.604 53.604 0 0 0 5.383-.466c-2.526 8.899-6.629 17.366-12.768 24.733C301.151 463.877 282 472.998 256 472.998s-45.151-9.12-56.914-23.236c-6.14-7.367-10.242-15.834-12.768-24.733c1.752.236 3.54.404 5.383.465c4.236.141 8.753-.088 13.576-.69c1.86 4.965 4.373 9.518 7.637 13.434c8.237 9.885 21.086 16.764 43.086 16.764s34.849-6.88 43.086-16.764c3.264-3.916 5.776-8.47 7.637-13.433z"/></svg>`,
        "world tiger day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48" fill="none"><g fill="none" stroke="${iconColor}" stroke-width="${iconWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M11.29 21.99s-1.879.132-3.773 1.408c-.26.175-.567.263-.88.263h-.534c-.44 0-.86-.18-1.162-.499h0a1.6 1.6 0 0 1-.414-1.397l.45-2.42c.068-.37.27-.7.568-.93l1.571-1.21s.851-3.28 2.976-1.647c2.425 1.863-1.108 3.26-1.108 3.26"/><path d="M10.741 16.234s3.476-1.695 5.673-1.385c.89.107 1.793.068 2.671-.117c3.353-.635 10.484-1.652 14.084.335c0 0 5.476 1.572 6.109 11.023c.045.85.43 1.645 1.069 2.208c.776.66 2.685 1.177 3.153-1.371m-26.89-4.629s.568 3.358-.991 4.317c-1.746 1.074-5.479 3.424-5.479 3.424s.434 3.61-2.346 2.21c-1.932-.763-.002-3.125 1.01-4.334l2.756-2.703c-.867-3.789.394-5.446.394-5.446"/><path d="M16.844 25.213s7.847-.575 9.306-1.258s1.929-.596 1.929-.596"/><path d="M28.17 20.529s-1.114 3.217 2.159 8.901l-.749 3.247a1.16 1.16 0 0 0 1.131 1.422h.002a1.16 1.16 0 0 0 1.096-.777l1.36-3.892s-1.656-3.098.04-6.071s1.24-4.65 1.24-4.65"/><path d="M32.6 24.907s2.538 3.294 4.433 4.23c1.317.651 1.213 2.784 1.213 2.784v.108c0 .69.56 1.248 1.249 1.248h.239a1.25 1.25 0 0 0 1.194-1.247c0-2.086-1.038-4.231-1.038-4.231M16.294 25.85c.884 2.988.78 4.951.55 6.265h0a1.04 1.04 0 0 0 .915 1.533h.256a1.04 1.04 0 0 0 1.005-.774l.657-2.878l-.24-5.004m-1.24-10.083s2.52 2.083 1.48 7.908m2.634 1.867s1.423-4.103.39-7.328m1.944-3.336s1.305 1.568 1.357 5.053m2.406-5.133s1.463 1.075 1.36 3.78M14.89 19.382a7.44 7.44 0 0 0-1.048-4.28"/></g></svg>`,
        "international beer day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 256 256"><path fill="${iconColor}" d="m245.66 42.34l-32-32a8 8 0 0 0-11.32 11.32l1.48 1.47l-55.17 41.38l-38.22 7.65a8.05 8.05 0 0 0-4.09 2.18L23 157.66a24 24 0 0 0 0 33.94L64.4 233a24 24 0 0 0 33.94 0l83.32-83.31a8 8 0 0 0 2.18-4.09l7.65-38.22l41.38-55.17l1.47 1.48a8 8 0 0 0 11.32-11.32ZM81.37 224a7.94 7.94 0 0 1-5.65-2.34l-41.38-41.38a8 8 0 0 1 0-11.31l5.66-5.66L92.69 216L87 221.66a8 8 0 0 1-5.63 2.34ZM177.6 99.2a7.92 7.92 0 0 0-1.44 3.23l-7.53 37.63l-8.63 8.63L107.31 96l8.63-8.63l37.63-7.53a7.92 7.92 0 0 0 3.23-1.44l58.45-43.84l6.19 6.19Z"/></svg>`,
        "tourism day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" d="m15.157 11.81l4.83 1.295a2 2 0 1 1-1.036 3.863L4.462 13.086L3.117 6.514l2.898.776l1.414 2.45l2.898.776l-.12-7.279l2.898.777l2.052 7.797zM3 21h18"/></svg>`,
        "caffeinecon": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" d="M12.748 3.572c.059-.503-.532-.777-.835-.388L4.11 13.197c-.258.33-.038.832.364.832h6.988c.285 0 .506.267.47.57l-.68 5.83c-.06.502.53.776.834.387l7.802-10.013c.258-.33.038-.832-.364-.832h-6.988c-.285 0-.506-.267-.47-.57l.68-5.83Z"/></svg>`,
        "trick or treat": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}"><path d="m9 15l1.5 1l1.5-1l1.5 1l1.5-1m-5-4h.01M14 11h.01"/><path d="M17 6.082c2.609.588 3.627 4.162 2.723 7.983c-.903 3.82-2.75 6.44-5.359 5.853a3.355 3.355 0 0 1-.774-.279A3.728 3.728 0 0 1 12 20c-.556 0-1.09-.127-1.59-.362a3.296 3.296 0 0 1-.774.28c-2.609.588-4.456-2.033-5.36-5.853c-.903-3.82.115-7.395 2.724-7.983c1.085-.244 1.575.066 2.585.787C10.301 6.315 11.125 6 12 6c.876 0 1.699.315 2.415.87c1.01-.722 1.5-1.032 2.585-.788z"/><path d="M12 6c0-1.226.693-2.346 1.789-2.894L14 3"/></g></svg>`,
        "world diabetes day": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}"><path d="m7.05 11.293l4.243-4.243a2 2 0 0 1 2.828 0l2.829 2.83a2 2 0 0 1 0 2.828l-4.243 4.243a2 2 0 0 1-2.828 0L7.05 14.12a2 2 0 0 1 0-2.828zm9.193-2.121l3.086-.772a1.5 1.5 0 0 0 .697-2.516L17.81 3.667a1.5 1.5 0 0 0-2.44.47L14.122 7.05"/><path d="M9.172 16.243L8.4 19.329a1.5 1.5 0 0 1-2.516.697L3.667 17.81a1.5 1.5 0 0 1 .47-2.44l2.913-1.248"/></g></svg>`,
        "torn anniversary": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill=""><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}"><path d="M3 20h18v-8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8z"/><path d="M3 14.803A2.4 2.4 0 0 0 4 15a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35.007.692-.062 1-.197M12 4l1.465 1.638a2 2 0 1 1-3.015.099L12 4z"/></g></svg>`,
        "black friday": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" color="currentColor"><path d="M17.5 5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/><path d="M2.774 11.144c-1.003 1.12-1.024 2.81-.104 4a34 34 0 0 0 6.186 6.186c1.19.92 2.88.899 4-.104a92 92 0 0 0 8.516-8.698a1.95 1.95 0 0 0 .47-1.094c.164-1.796.503-6.97-.902-8.374s-6.578-1.066-8.374-.901a1.95 1.95 0 0 0-1.094.47a92 92 0 0 0-8.698 8.515"/><path d="M13.788 12.367c.022-.402.134-1.135-.476-1.693m0 0a2.3 2.3 0 0 0-.797-.451c-1.257-.443-2.8 1.039-1.708 2.396c.587.73 1.04.954.996 1.782c-.03.582-.602 1.191-1.356 1.423c-.655.202-1.378-.065-1.835-.576c-.559-.624-.502-1.212-.507-1.468m5.208-3.106L14 9.986m-5.34 5.34l-.653.653"/></g></svg>`,
        "slash wednesday": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32"><path fill="${iconColor}" d="M25 16h-8a2.002 2.002 0 0 0-2 2v6H4V14H2v16h2v-4h24v4h2v-9a5.006 5.006 0 0 0-5-5Zm3 8H17v-6h8a3.003 3.003 0 0 1 3 3Z"/><path fill="${iconColor}" d="M9.5 17A1.5 1.5 0 1 1 8 18.5A1.502 1.502 0 0 1 9.5 17m0-2a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 9.5 15zM21 6h-4V2h-2v4h-4v2h4v4h2V8h4V6z"/></svg>`, "elemination": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}"><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/></g></svg>`,
        "christmas town": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}"><path d="m10 4l2 1l2-1"/><path d="M12 2v6.5l3 1.72m2.928-3.952l.134 2.232l1.866 1.232"/><path d="m20.66 7l-5.629 3.25l.01 3.458m4.887.56L18.062 15.5l-.134 2.232"/><path d="m20.66 17l-5.629-3.25l-2.99 1.738M14 20l-2-1l-2 1"/><path d="M12 22v-6.5l-3-1.72m-2.928 3.952L5.938 15.5l-1.866-1.232"/><path d="m3.34 17l5.629-3.25l-.01-3.458m-4.887-.56L5.938 8.5l.134-2.232"/><path d="m3.34 7l5.629 3.25l2.99-1.738"/></g></svg>`,
        "other": `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${iconWidth}" d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/></svg>`,








    }

    const updateInterval = 1800; //30min



    function injectDiv() {
        if (document.getElementById("eventTimer")) {
            checkCache();
            return;
        }
        let tornClock = document.querySelector(".tc-clock-tooltip");
        if (tornClock) {
            let p = tornClock.appendChild(document.createElement("div"));
            //p.addEventListener("click", divClicked); //TODO
            // p.innerHTML = `<div id="eventTimer">...</div>`; //TODO
            p.innerHTML = `
                <div id="eventTimer">
                    <div id="eventTimerMsg">...</div>
                    <div class="eventT hidden">
                        <button class="icon" aria-expanded="false" aria-label="Show name">
 
                        </button>
 
                        <button class="name" aria-hidden="true"></button>
                        <div class="time"></div>
                    </div>
                </div>
            `;
            div = document.getElementById('eventTimer');

            document.getElementById('eventTimerMsg').addEventListener("click", divClicked);
            msgDiv = document.getElementById('eventTimerMsg');


            document.querySelectorAll('.eventT').forEach(eventEl => {

                eventDiv = eventEl;
                const iconBtn = iconDiv = eventEl.querySelector('.icon');
                const nameBtn = nameDiv = eventEl.querySelector('.name');
                timeDiv = eventEl.querySelector('.time');

                timeDiv.addEventListener("click", divClicked); //TODO

                if (!iconBtn || !nameBtn) return;



                function setState(showName) {
                    eventDiv.classList.toggle('show-name', showName);
                    // icon's aria-expanded describes the resulting state (name visible?)
                    iconDiv.setAttribute('aria-expanded', showName ? 'true' : 'false');
                    // name should be programmatically hidden/shown for assistive tech
                    nameDiv.setAttribute('aria-hidden', showName ? 'false' : 'true');
                }

                function toggle() {
                    const isShowing = eventDiv.classList.contains('show-name');
                    setState(!isShowing);

                    // Focus the element that is now visible for smooth keyboard UX
                    if (!isShowing) {
                        nameBtn.focus();
                        GM_setValue('timer_mode', "");
                    } else {
                        iconDiv.focus();
                        GM_setValue('timer_mode', "icon");
                    }
                }

                // Click handlers
                iconBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggle();
                });

                nameBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggle();
                });

                // Optional: allow listener on the container for delegated clicks (if desired)
                // If you add dynamic items later, consider delegation.

                // Initialize ARIA state (default: name hidden)
                setState(false);
            });

            checkCache();
        } else {
            //  lets try again 

            if (tornClockSearchAttempt < 3) {
                tornClockSearchAttempt++;
                throwRed(`.tc-clock-tooltip not found, ${tornClockSearchAttempt} try`);
                setTimeout(() => {
                    injectDiv();
                }, 300);
            } else {
                throwRed(`.tc-clock-tooltip not found :(`);
            }

        }
    }
    injectDiv();
    function checkCache() {
        let currentTimeStamp = Math.round(Date.now() / 1000);

        //  read cache
        apiKey = GM_getValue('timer_api_key', null);
        events = GM_getValue('events', null);
        mode = GM_getValue('timer_mode', "");
        userEventStartTime = GM_getValue('userEventStartTime', null);

        if (mode === "icon") {

        } else {
            iconDiv.click();
        }

        let lastUpdated = GM_getValue('updated', null);
        if (!apiKey) {
            throwRed("No api key")
            setText("limited apy key needed");
            return;
        }
        if (!lastUpdated || currentTimeStamp - lastUpdated > updateInterval || !events || !userEventStartTime) {
            fetchData();
        } else {
            setEventTimes("cache");
        }
    }
    async function fetchData() {

        setText("fetching torn...");
        const tornData = await GM_fetch('torn', 'calendar');
        if (tornData.calendar) {
            let json = tornData.calendar;
            if (json.events && json.competitions) {
                events = json["events"].concat(json.competitions);
            } else {
                events = json.events;
            }

            GM_setValue('events', events)
        } else if (tornData.error) {
            throwRed(tornData.error);
            setText(tornData.error.error);
            return;
        }

        setText("fetching user...");
        const userData = await GM_fetch('user', 'calendar,timestamp');
        if (userData.calendar) {
            let json = userData.calendar;
            if (json.start_time) {
                userEventStartTime = json.start_time.toLowerCase().split(" tct")[0];
                GM_setValue('userEventStartTime', userEventStartTime);
            }
        } else if (userData.error) {
            throwRed(tornData.error);
            setText(userData.error.error);
            return;
        }




        let currentTimeStamp = Math.round(Date.now() / 1000);
        GM_setValue('updated', currentTimeStamp);

        setEventTimes("fetch");
    }



    function setEventTimes(from = null) {
        //if (from) throwRed(`Came here from ${from}`);

        // setting evetns start/end times with user start time if needed


        /*
        events.push({
            title: "Test event",
            start: 1762897054,
            end: 1763156254
        })
        */


        events.forEach(event => {
            let eventStartTime = event.start;
            let eventEndTime = event.end;
            console.log(event.title)
            const isEventWithUserTime = eventsWithUserTimte.find(e =>
                e.name.toLowerCase().includes(event.title.toLowerCase())
            );

            if (isEventWithUserTime) {

                event.start = isEventWithUserTime.start;
                event.end = isEventWithUserTime.end;

                eventStartTime = setTimeOnUnix(event.start, userEventStartTime);
                eventEndTime = setTimeOnUnix(event.end, userEventStartTime);
                event.userTimeAffect = true;
            }



            //let isEventWithUserTime = (eventsWithUserTimte.indexOf(event.title) !== -1) ? true : false;
            /*
            console.log(event.title)
            const isEventWithUserTime = eventsWithUserTimte.find(event =>
                event.name.toLowerCase().includes(event.title.toLowerCase())
            );

            console.log("isEventWithUserTime", isEventWithUserTime)

            if (isEventWithUserTime) {
                eventStartTime = setTimeOnUnix(event.start, userEventStartTime);
                eventEndTime = setTimeOnUnix(event.end, userEventStartTime);
                event.userTimeAffect = true;
            }
    */

            event.start = eventStartTime;
            event.end = eventEndTime;

            console.log(event.title, event.start)
        });

        getNearestEvent();

    }

    function getNearestEvent() {
        let currentTimeStamp = Math.round(Date.now() / 1000);

        if (!events || events.length === 0) return null;



        let eventsList = [];

        events.forEach(event => {
            event.startDiff = (event.start - currentTimeStamp);
            event.endDiff = (event.end - currentTimeStamp);

            if (event.startDiff >= 0 || event.endDiff >= 0) eventsList.push(event)
            //console.log(event.title, event.startDiff, event.endDiff)
        });

        const now = Math.floor(Date.now() / 1000); // current timestamp in seconds

        const upcomingOrActiveEvents = events.filter(e => !(e.startDiff < 0 && e.endDiff < 0));

        // Optional: sort after filtering (same logic as before)
        sortedEvents = upcomingOrActiveEvents.sort((a, b) => {
            const aActive = a.startDiff <= 0 && a.endDiff >= 0;
            const bActive = b.startDiff <= 0 && b.endDiff >= 0;

            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;

            if (aActive && bActive) return a.endDiff - b.endDiff;
            if (a.startDiff > 0 && b.startDiff > 0) return a.startDiff - b.startDiff;

            return a.startDiff - b.startDiff;
        });


        // Active events (sorted by soonest ending)
        const activeEvents = sortedEvents.filter(e => now >= e.start && now <= e.end);


        //console.log("Active events:", activeEvents);
        //console.log("Sorted events:", sortedEvents);

        nearestEvent = sortedEvents[0];

        showTimer();
        // console.log(events);
        // console.log(eventsList)
    }
    function showTimer() {
        let currentTimeStamp = Math.round(Date.now() / 1000);
        let difTime = 0;
        let val = "in";
        let currentEvent = false;
        if (nearestEvent.startDiff > 0) {
            difTime = nearestEvent.start - currentTimeStamp;
            if (div.classList.contains('currentEvent')) {
                div.classList.remove("currentEvent")
            }
        } else {
            if (!div.classList.contains('currentEvent')) {
                div.classList.add("currentEvent")
            }
            difTime = nearestEvent.end - currentTimeStamp;
            val = "ends";
            currentEvent = true;
        }

        let text = `
            ${nearestEvent.title}<br>
            <b>${val}: ${secondsToTime(difTime)}</b>
        `;
        /*
        if (currentEvent && sortedEvents[1].startDiff > 0) {
            let nextDiff = sortedEvents[1].start - currentTimeStamp;;
            text += `
            
                <br/>${sortedEvents[1].title}<br/>
                <b>in: ${secondsToTime(nextDiff)}</b>
            `;
        }
            */
        nameDiv.textContent = nearestEvent.title;
        timeDiv.textContent = secondsToTime(difTime);


        var keys = Object.keys(eventIcons);
        var last = keys[keys.length - 1];

        let icon = keys.indexOf(nearestEvent.title.toLowerCase());
        if (icon === -1) {
            icon = eventIcons['other'];
        } else {
            icon = eventIcons[keys[icon]];
        }

        const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(icon);
        iconDiv.style.backgroundImage = `url("${dataUrl}")`;


        setText()

        if (difTime < 0) {
            throwRed(`Event ${nearestEvent.title} is over.`)
            getNearestEvent();
            return;
        }

        setTimeout(showTimer, 1000);
    }

    function secondsToTime(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400); // 1 day = 86400 seconds
        totalSeconds %= 86400;

        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Pad with leading zeros
        const paddedHours = hours < 10 ? "0" + hours : hours;
        const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const paddedSeconds = seconds < 10 ? "0" + seconds : seconds;

        if (days > 0) {
            // Include days, show full time
            return `${days} day${days > 1 ? "s" : ""} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else if (hours > 0) {
            // Hours, minutes, seconds
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else if (minutes > 0) {
            // Only minutes and seconds
            return `${paddedMinutes} min ${paddedSeconds} sec`;
        } else {
            // Only seconds
            return `${paddedSeconds} sec`;
        }
    }

    function secondsToTime_old(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400); // 1 day = 86400 seconds
        totalSeconds %= 86400;

        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const paddedHours = hours < 10 ? "0" + hours : hours;
        const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const paddedSeconds = seconds < 10 ? "0" + seconds : seconds;

        if (days > 0) {
            // Include days and limit hours to 0–23
            return `${days} day${days > 1 ? "s" : ""} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else {
            // No days, just hours/minutes/seconds
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        }
    }

    function setTimeOnUnix(unixTime, timeString) {

        const [targetHour, targetMinute] = timeString.split(":").map(Number);


        const date = new Date(unixTime * 1000);


        date.setUTCHours(targetHour);
        date.setUTCMinutes(targetMinute);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);



        return Math.floor(date.getTime() / 1000);

    }

    function divClicked() {
        if (apiKey === null) apiKey = '';
        let w = prompt("Api key", apiKey);
        if (w || w === "" && w !== null) {
            //save key
            GM_setValue('timer_api_key', w);
            apiKey = w;
        }
        if (apiKey && w !== null) fetchData();

    }
    function setText(data) {
        if (data) {
            msgDiv.classList.remove('hidden');
            eventDiv.classList.add('hidden');
            msgDiv.innerHTML = data;
            return;
        }

        msgDiv.classList.add('hidden');
        eventDiv.classList.remove('hidden');
        //div.innerHTML = data //TODO
    }
    function throwRed(data) {
        console.log(`%ceventsTimer${(typeof data !== 'object') ? ': ' + data : ''}`, 'background: #212c37; color: white;padding:10px; border-radius:3px;', (typeof data === 'object') ? data : '');
    }

    async function GM_fetch(page, selections) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/v2/${page}/?selections=${selections}&key=${apiKey}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function (response) {
                    try {
                        if (!response || !response.responseText) {
                            return reject(new Error("Empty response"));
                        }
                        const json = JSON.parse(response.responseText);
                        resolve(json);

                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                },
            });
        });
    }
})();