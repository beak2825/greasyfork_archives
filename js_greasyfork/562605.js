// ==UserScript==
// @name         WME Segment Node Count
// @namespace    https://greasyfork.org/en/users/1558508-darkest-ways-waze
// @description  Displays the number of geo-nodes in a segment in Waze Map Editor and warns if segment is too complex.
// @version      2026.01.14.04
// @author       DarkestWays
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        none
// @license      GPL-3.0
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/562605/WME%20Segment%20Node%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/562605/WME%20Segment%20Node%20Count.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* global getWmeSdk */
/* global toastr */

const SCRIPT_NAME = GM_info.script.name;
const SCRIPT_VERSION = GM_info.script.version;
const SCRIPT_ID = 'wme_segment_node_count';
const SCRIPT_SHORTNAME = 'WME-SNC';
const MAX_NODES_PER_SEGMENT = 500;
const WARNING_THRESHOLD = 450;

const WARNING_COLOR = 'rgba(88,40,24,0.9)';
const WARNING_BACKGROUND_COLOR = 'rgba(255,229,125,0.85)';
const WARNING_TIMEOUT = 8000;

const DANGER_COLOR = 'rgba(253,253,253,0.9)';
const DANGER_BACKGROUND_COLOR = 'rgba(246,108,108,0.8)';
const DANGER_TIMEOUT = 0;

const STYLE_BASE = {
    display: 'flex',
    position: 'relative',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '5px',
};
const STYLE_ERROR_BASE = {
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '3px 6px',
    cursor: 'pointer',
}
const STYLE_WARNING = {
    backgroundColor: WARNING_BACKGROUND_COLOR,
    color: WARNING_COLOR,
};
const STYLE_DANGER = {
    backgroundColor: DANGER_BACKGROUND_COLOR,
    color: DANGER_COLOR,
};

const DEF_NOTIF_TIMEOUT = 5000; // 5 seconds
const DEF_NOTIF_RATE_LIMIT = 30000; // 1 notification per 30 seconds block, unless showNow is true

const PARENT_EDIT_PANEL_ID = 'edit-panel';
const SFE_SELECTOR = 'div.segment-feature-editor';
const ADD_ATTR_SELECTOR = '#segment-edit-general > div > ul.additional-attributes';

const logger = (message) => {
    console.log(`[${SCRIPT_SHORTNAME}]: ${message}`);
};

function init() {
    'use strict';

    loadToastr();

    const wmeSdk = window.getWmeSdk({scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME});
    let segmentEditorPanelObserver = null;

    function displaySegmentNodeCounts(segmentNodeCounts, totalNodeCount) {
        // Get segment that has the max node count
        const segmentIdWithMaxNodes = Object.keys(segmentNodeCounts).reduce((a, b) => segmentNodeCounts[a] > segmentNodeCounts[b] ? a : b);
        const maxNodeCount = segmentNodeCounts[segmentIdWithMaxNodes];
        const nodeCountHigh = maxNodeCount >= WARNING_THRESHOLD;
        const nodeCountTooHigh = maxNodeCount >= MAX_NODES_PER_SEGMENT;

        const parentEditPanel = document.getElementById(PARENT_EDIT_PANEL_ID);
        let segmentEditPanel = document.querySelector(SFE_SELECTOR);

        // We will make edits here
        // TODO: Refactor to avoid duplication and single concern principle
        async function updateDisplay() {
            const addAttrsUL = segmentEditPanel.querySelector(ADD_ATTR_SELECTOR);
            const countElemClass = 'segment-node-count-display';

            // Clear previous counts
            const existingCount = addAttrsUL.querySelector(`.${countElemClass}`);
            existingCount?.remove();

            const countDisplay = document.createElement('li');
            countDisplay.className = countElemClass;
            countDisplay.textContent = `Node Count: ${totalNodeCount}${nodeCountHigh ? ` [${segmentIdWithMaxNodes}(${maxNodeCount})]` : ''}`;

            Object.assign(countDisplay.style, STYLE_BASE);
            if (nodeCountTooHigh) {
                Object.assign(countDisplay.style, STYLE_ERROR_BASE, STYLE_DANGER);
                showNotification(`Segment ${segmentIdWithMaxNodes} has exceeded the maximum node count of ${MAX_NODES_PER_SEGMENT}! Simplify or split the segment, else WME BE won't save.`, {
                    title: 'Segment too complex',
                    type: 'error',
                    timeout: DANGER_TIMEOUT,
                    showNow: true
                });
            } else if (nodeCountHigh) {
                Object.assign(countDisplay.style, STYLE_ERROR_BASE, STYLE_WARNING);
                showNotification(`Segment ${segmentIdWithMaxNodes} has a high node count of ${maxNodeCount}. Consider splitting the segment to improve performance.`, {
                    title: 'High Node Count',
                    type: 'warning',
                    timeout: WARNING_TIMEOUT
                });
            }

            if (nodeCountHigh) {
                countDisplay.title = `Segment ${segmentIdWithMaxNodes} has ${maxNodeCount} nodes. Consider splitting the segment to improve performance. Click to select this segment.`;
                countDisplay.onclick = () => {
                    // Select the segment with max nodes
                    wmeSdk.Editing.setSelection({selection: {objectType: 'segment', ids: [parseInt(segmentIdWithMaxNodes)]}});
                };
            }

            // Insert at the top of the additional attributes UL element
            addAttrsUL.prepend(countDisplay);
        }

        if (segmentEditPanel) {
            updateDisplay().catch((error) => {
                logger(`Error updating display: ${error}`);
            });
            return;
        }

        // Set up a MutationObserver to monitor changes in the segment editor panel
        segmentEditorPanelObserver = new MutationObserver((mutationsList, observer) => {
            // Check if the segment editor panel is still present
            segmentEditPanel = document.querySelector(SFE_SELECTOR);
            if (!segmentEditPanel) return;

            // Update the display whenever there are changes
            observer.disconnect();
            segmentEditorPanelObserver = null;
            updateDisplay().catch((error) => {
                logger(`Error updating display: ${error}`);
            });
        });

        // Start observing the parent edit panel for changes
        segmentEditorPanelObserver.observe(parentEditPanel, {childList: true, subtree: true});

    }

    async function updateSegmentNodeCount() {
        if (segmentEditorPanelObserver) {
            segmentEditorPanelObserver.disconnect();
            segmentEditorPanelObserver = null;
        }

        const selectedFeatures = wmeSdk.Editing.getSelection();
        let segmentNodeCounts = {};
        let totalNodeCount = 0;

        // Only proceed if one or more segments are selected
        if (!selectedFeatures || selectedFeatures.objectType !== 'segment' || !selectedFeatures.ids) return;

        // For each selected segment, calculate and display node count
        for (const segmentId of selectedFeatures.ids) {
            const segment = wmeSdk.DataModel.Segments.getById({segmentId: segmentId});

            if (!segment) continue;

            totalNodeCount += segmentNodeCounts[segmentId] = segment.geometry.coordinates.length;
        }
        logger(`Total Node Count: ${totalNodeCount}; Segment Node Counts: ${JSON.stringify(segmentNodeCounts)}`);

        displaySegmentNodeCounts(segmentNodeCounts, totalNodeCount);
    }

    // Adapted from WME True Segment Length script
    async function waitAndUpdate(){
        await new Promise(r => setTimeout(r, 175));
        await updateSegmentNodeCount();
    }

    // register to events:
    wmeSdk.Events.once({eventName: "wme-ready"}).then(() => {
        logger("WME is now ready");
        showNotification(`v${SCRIPT_VERSION} loaded`, {title: '', type: 'success', showNow: true});
    });
    wmeSdk.Events.on({
        eventName: "wme-selection-changed",
        eventHandler: waitAndUpdate
    });
    wmeSdk.Events.on({
        eventName: "wme-after-edit",
        eventHandler: updateSegmentNodeCount
    });
    wmeSdk.Events.on({
        eventName: "wme-after-undo",
        eventHandler: updateSegmentNodeCount
    });

    logger(`${SCRIPT_NAME} v${SCRIPT_VERSION} initialized.`);
}

// Load Toastr for notifications
function loadToastr() {
    logger("Loading Toastr library");

    // Initialize Toastr after the script is loaded
    function initToastr() {
        logger("Toastr loaded");
        // Default Toastr options
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-center",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": 1000,
            "hideDuration": 1000,
            "timeOut": DEF_NOTIF_TIMEOUT,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }

    let toastrCss = document.createElement('link');
    toastrCss.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css";
    toastrCss.type = "text/css";
    toastrCss.rel = "stylesheet";
    document.head.appendChild(toastrCss);

    let toastrJs = document.createElement('script');
    toastrJs.src = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js";
    toastrJs.type = "text/javascript";
    toastrJs.onload = initToastr;
    document.head.appendChild(toastrJs);
}

function showNotification(message, options = {}) {
    const {
        title = 'Notice',
        type = 'info',
        timeout = DEF_NOTIF_TIMEOUT,
        showNow = false
    } = options;

    let rateLimitKey = `${SCRIPT_ID}_last_notification_time`;
    let now = Date.now();
    let lastNotificationTime = parseInt(localStorage.getItem(rateLimitKey)) || 0;

    // Rate limit notifications
    if (!showNow && (now - lastNotificationTime < DEF_NOTIF_RATE_LIMIT)) {
        return;
    }
    localStorage.setItem(rateLimitKey, showNow ? lastNotificationTime : now.toString());

    if (toastr) {
        toastr[type](message, `[${SCRIPT_SHORTNAME}] ${title}`, {timeOut: timeout});
    } else {
        logger(`Toastr not loaded. Message: ${title} - ${message}`);
    }
}

window.SDK_INITIALIZED.then(init);
