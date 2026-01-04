// ==UserScript==
// @name         MusicBrainz: Relationship Editor Batch Remove
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.1.1
// @description  Adds a toggle to batch remove/restore relationships. Shift+Click: Same Type. Ctrl+Click: Same Target. Ctrl+Shift+Click: Same Type & Target.
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/*/edit-relationships
// @match        *://*.musicbrainz.org/area/*/edit
// @match        *://*.musicbrainz.org/artist/*/edit
// @match        *://*.musicbrainz.org/event/*/edit
// @match        *://*.musicbrainz.org/instrument/*/edit
// @match        *://*.musicbrainz.org/label/*/edit
// @match        *://*.musicbrainz.org/place/*/edit
// @match        *://*.musicbrainz.org/recording/*/edit
// @match        *://*.musicbrainz.org/release-group/*/edit
// @match        *://*.musicbrainz.org/series/*/edit
// @match        *://*.musicbrainz.org/work/*/edit
// @match        *://*.musicbrainz.org/url/*/edit
// @match        *://*.musicbrainz.eu/release/*/edit-relationships
// @match        *://*.musicbrainz.eu/area/*/edit
// @match        *://*.musicbrainz.eu/artist/*/edit
// @match        *://*.musicbrainz.eu/event/*/edit
// @match        *://*.musicbrainz.eu/instrument/*/edit
// @match        *://*.musicbrainz.eu/label/*/edit
// @match        *://*.musicbrainz.eu/place/*/edit
// @match        *://*.musicbrainz.eu/recording/*/edit
// @match        *://*.musicbrainz.eu/release-group/*/edit
// @match        *://*.musicbrainz.eu/series/*/edit
// @match        *://*.musicbrainz.eu/work/*/edit
// @match        *://*.musicbrainz.eu/url/*/edit
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547867/MusicBrainz%3A%20Relationship%20Editor%20Batch%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/547867/MusicBrainz%3A%20Relationship%20Editor%20Batch%20Remove.meta.js
// ==/UserScript==

'use strict';

const DEBUG = false;
const SCRIPT_NAME = GM.info.script.name;

/**
 * Injects CSS to provide visual feedback when modifier keys are held.
 * - Ctrl Only (Target Match): Orange outline
 * - Shift Only (Type Match): Blue outline
 * - Ctrl + Shift (Specific Match): Yellow outline
 */
function addGlobalStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        body.ctrl-is-down:not(.shift-is-down) .rel-editor-table .remove-item { background-color: #ffe0b2 !important; outline: 2px solid #ff9800; }
        body.shift-is-down:not(.ctrl-is-down) .rel-editor-table .remove-item { background-color: #bbdefb !important; outline: 2px solid #2196f3; }
        body.ctrl-is-down.shift-is-down .rel-editor-table .remove-item { background-color: #ffc !important; outline: 2px solid #cc0; }
    `;
    document.head.appendChild(style);
}

/**
 * Event handler to toggle CSS classes on the body based on modifier keys.
 * Used for the visual feedback styling defined in addGlobalStyle.
 * * @param {KeyboardEvent} event - The keydown or keyup event.
 */
function toggleModifierClasses(event) {
    if (event.key === 'Control') document.body.classList.toggle('ctrl-is-down', event.type === 'keydown');
    if (event.key === 'Shift') document.body.classList.toggle('shift-is-down', event.type === 'keydown');
}

/**
 * Traverses the internal React Fiber tree starting from a DOM element to retrieve its props.
 * This allows access to the internal 'relationship' and 'source' objects bound to the UI component,
 * bypassing the need for fragile DOM parsing or ID scraping.
 *
 * @param {HTMLElement} element - The DOM element (button) that was clicked.
 * @returns {Object|null} The React props object containing { relationship, source, dispatch } or null if not found.
 */
function getReactProps(element) {
    const key = Object.keys(element).find(k => k.startsWith('__reactFiber'));
    if (!key) return null;

    let fiber = element[key];

    while (fiber) {
        const props = fiber.memoizedProps || fiber.props;
        if (props && props.relationship && props.source) {
            return props;
        }
        fiber = fiber.return;
    }
    return null;
}

/**
 * Resolves which entity in a relationship is the "Target" (the entity being linked TO).
 * MusicBrainz relationships are stored as { entity0, entity1 }, not source/target.
 * This function compares IDs against the current source to find the other entity.
 *
 * @param {Object} rel - The relationship object from MusicBrainz state.
 * @param {Object} source - The source entity object currently being edited.
 * @returns {Object|null} The target entity object, or null if data is malformed.
 */
function resolveTarget(rel, source) {
    // 1. Return explicit target if available (some contexts provide this)
    if (rel.target) return rel.target;

    // 2. Safety check for malformed data
    if (!rel.entity0 || !rel.entity1) return null;

    // 3. Compare IDs to find the one that isn't the source
    if (rel.entity0.id !== source.id) return rel.entity0;
    if (rel.entity1.id !== source.id) return rel.entity1;

    // 4. Edge Case: Self-Link (Source ID == Target ID)
    // If both IDs match the source, return entity1 as the default valid target reference.
    return rel.entity1;
}

/**
 * Main click handler for the batch remove functionality.
 * * Logic Flow:
 * 1. Validates the click target (must be a remove button) and modifier keys.
 * 2. Retrieves the specific relationship data via React Fiber props (getReactProps).
 * 3. Identifies the "Master" relationship (the one clicked) and its context (Source Entity Type).
 * 4. Harvests all visible relationships from the MB state tree, filtering strictly by Source Entity Type.
 * 5. Filters the harvested list against the user's criteria (Link Type match or Target Entity match).
 * 6. Dispatches 'remove-relationship' actions to the remaining matches.
 * * @param {MouseEvent} event - The click event triggered on the content area.
 */
function handleBatchToggle(event) {
    const target = event.target;

    // 1. Basic Validation
    if (!target.matches('.icon.remove-item')) return;

    const matchType = event.shiftKey;
    const matchTarget = event.ctrlKey;

    // Only proceed if a modifier key is held
    if (!matchType && !matchTarget) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // --- STEP 1: GET MASTER DATA ---
    const props = getReactProps(target);

    if (!props) return;

    const masterRel = props.relationship;
    const masterSource = props.source;
    const dispatch = props.dispatch;

    if (!dispatch) return;

    // Safe Resolve of Target Entity
    const masterTargetEntity = resolveTarget(masterRel, masterSource);

    // Abort if we can't identify the target to prevent accidental removals
    if (!masterTargetEntity) {
        if (DEBUG) console.warn(`[${SCRIPT_NAME}] Target entity could not be resolved. Aborting.`);
        return;
    }

    const masterTargetGid = masterTargetEntity.gid;
    const masterLinkTypeId = masterRel.linkTypeID;

    if (DEBUG) {
        console.log(`[${SCRIPT_NAME}] Target: ${masterTargetEntity.name} (GID: ${masterTargetGid})`);
        console.log(`[${SCRIPT_NAME}] Source: ${masterSource.entityType} (ID: ${masterSource.id})`);
    }

    // --- STEP 2: HARVEST & SCOPE ---
    const { relationshipEditor, tree: wbt } = MB;
    const candidates = [];

    // Strategy A: Full Editor (Release/Release Group - Tree Structure)
    if (wbt && relationshipEditor && relationshipEditor.state.relationshipsBySource) {
        for (const [source, targetTypeGroups] of wbt.iterate(relationshipEditor.state.relationshipsBySource)) {
            // Strict Scope Check
            // We only collect relationships from the same Source Entity Type (e.g. only 'work' or only 'recording').
            // This prevents ID collisions where two different entities share a relationship ID.
            if (source.entityType !== masterSource.entityType) continue;

            for (const [, linkTypeGroups] of wbt.iterate(targetTypeGroups)) {
                for (const linkTypeGroup of wbt.iterate(linkTypeGroups)) {
                    if (linkTypeGroup.phraseGroups) {
                        for (const phraseGroup of wbt.iterate(linkTypeGroup.phraseGroups)) {
                            if (phraseGroup.relationships) {
                                for (const rel of wbt.iterate(phraseGroup.relationships)) {
                                    candidates.push({ rel, source });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // Strategy B: Mini Editor (Edit Artist/Recording/Work - Flat Array)
    // On individual edit pages, the source entity holds the list directly.
    else if (masterSource && masterSource.relationships) {
        masterSource.relationships.forEach(rel => {
            candidates.push({ rel, source: masterSource });
        });
    }

    // --- STEP 3: FILTER MATCHES ---
    const relsToToggle = candidates.filter(({ rel, source }) => {
        const targetEntity = resolveTarget(rel, source);
        // If target is missing or malformed on a candidate, skip it safely
        if (!targetEntity || !targetEntity.gid) return false;

        let isMatch = true;
        // Check Shift: Link Type Match
        if (matchType && rel.linkTypeID !== masterLinkTypeId) isMatch = false;
        // Check Ctrl: Target Entity Match
        if (matchTarget && targetEntity.gid !== masterTargetGid) isMatch = false;

        return isMatch;
    });

    if (DEBUG) console.log(`[${SCRIPT_NAME}] Found ${relsToToggle.length} items.`);

    // --- STEP 4: ACTION ---
    // Determine Toggle Direction:
    // - If ALL selected items are removed (Status 3), we restore them.
    // - If ANY selected item is active, we remove the active ones.
    const areAllRemoved = relsToToggle.every(({ rel }) => rel._status === 3);

    let changeCount = 0;
    relsToToggle.forEach(({ rel }) => {
        const isRemoved = (rel._status === 3);
        const shouldAct = areAllRemoved ? isRemoved : !isRemoved;

        if (shouldAct) {
            dispatch({ type: 'remove-relationship', relationship: rel });
            changeCount++;
        }
    });

    if (DEBUG) console.log(`[${SCRIPT_NAME}] Processed ${changeCount} items.`);
}

/**
 * Initializes the script: adds styles and event listeners.
 */
function setup() {
    addGlobalStyle();

    document.addEventListener('keydown', toggleModifierClasses);
    document.addEventListener('keyup', toggleModifierClasses);

    // Clear modifiers on blur to prevent "stuck" keys when Alt-Tabbing
    window.addEventListener('blur', () => document.body.classList.remove('ctrl-is-down', 'shift-is-down'));

    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('click', handleBatchToggle, true);
    }
}

// Wait for the MB relationship editor to be fully initialized.
const initInterval = setInterval(() => {
    if (Object.keys((window.MB?.linkedEntities?.link_type_tree) ?? {}).length) {
        clearInterval(initInterval);
        setup();
    }
}, 250);