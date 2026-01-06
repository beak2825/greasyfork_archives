// ==UserScript==
// @name         ChatGPT Message Queue
// @namespace    https://github.com/maribox/my_userscripts
// @license MIT
// @version      1.0.0
// @description  Send message while ChatGPT is still thinking and automatically send when ChatGPT is ready. Inline queue UI with drag-to-reorder, edit/delete, merge queue items option and persistence. (the code is not great, but it works ig...). Also images don't work since that's a whole 'nother beast.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561517/ChatGPT%20Message%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/561517/ChatGPT%20Message%20Queue.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const storageKeyQueues = 'cgpt_message_queue_by_conversation_v1';
    const storageKeySettings = 'cgpt_message_queue_settings_by_conversation_v1';

    const pollIntervalMilliseconds = 1200;
    const transactionWaitMilliseconds = 0;
    const sendEnableWaitMilliseconds = 0;
    const streamingStartWaitMilliseconds = 0;

    const queueHostPaddingTopPixels = 10;

    const dragHandleWidthPixels = 44;

    const queueItemPaddingPixels = 12;
    const queueTextFontSizePixels = 15;
    const queueLineHeight = 1.4;

    const draftRestoreRetryDelays = [0, 40, 120, 260, 420, 700, 1100, 1600, 2300, 3200];

    const enterAnimationMilliseconds = 160;
    const exitSendAnimationMilliseconds = 170;
    const exitDeleteAnimationMilliseconds = 150;

    let currentConversationKey = null;

    let promptQueue = [];
    let transientQueue = [];

    let mergeMessagesEnabled = false;
    let transientMergeMessagesEnabled = false;

    let isQueuePumpRunning = false;
    let proseMirrorTransactionCounter = 0;

    let attachedComposerNode = null;
    let attachedSubmitButtonNode = null;
    let submitButtonMutationObserver = null;
    let queueHostNode = null;

    let activeEditIndex = null;
    let activeEditOriginalText = '';

    let isDragging = false;
    let dragSourceIndex = null;
    let dropInsertIndex = null;

    let hostListenersAttached = false;
    let dropLineNode = null;

    let sendCancellationToken = 0;

    let pendingDraftRestore = null;

    let lastRenderedQueueSnapshot = [];
    let pendingEnterCountFromBottom = 0;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const waitFor = async (predicate, timeoutMilliseconds) => {
        if (predicate()) return true;
        await Promise.resolve();
        if (predicate()) return true;
        await new Promise(requestAnimationFrame);
        if (predicate()) return true;
        await new Promise(requestAnimationFrame);
        if (predicate()) return true;

        if (timeoutMilliseconds <= 0) return false;

        const start = Date.now();
        while (Date.now() - start < timeoutMilliseconds) {
            if (predicate()) return true;
            await new Promise(requestAnimationFrame);
        }
        return false;
    };

    const isInteracting = () => isDragging || activeEditIndex !== null;

    function normalizeText(text) {
        return String(text || '').replace(/\u200B/g, '').replace(/\r\n/g, '\n').trim();
    }

    function ensureAnimationStyles() {
        if (document.getElementById('tm-cgpt-message-queue-styles')) return;

        const style = document.createElement('style');
        style.id = 'tm-cgpt-message-queue-styles';
        style.textContent = `
      @keyframes tmqEnterFromBottom {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes tmqExitToRight {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(14px); }
      }
      @keyframes tmqExitToBottom {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(10px); }
      }
      .tmq-enter {
        animation: tmqEnterFromBottom ${enterAnimationMilliseconds}ms ease-out both;
        will-change: transform, opacity;
      }
      .tmq-exit-send {
        animation: tmqExitToRight ${exitSendAnimationMilliseconds}ms ease-in both;
        will-change: transform, opacity;
      }
      .tmq-exit-delete {
        animation: tmqExitToBottom ${exitDeleteAnimationMilliseconds}ms ease-in both;
        will-change: transform, opacity;
      }
    `;
        document.head.appendChild(style);
    }

    // ---------- Conversation key ----------
    function extractConversationIdFromUrl() {
        const path = location.pathname || '';
        const match = path.match(/\/c\/([a-z0-9-]{8,})/i) || path.match(/\/chat\/([a-z0-9-]{8,})/i);
        return match ? match[1] : null;
    }

    function computeConversationKey() {
        const conversationId = extractConversationIdFromUrl();
        return conversationId ? `conversation:${conversationId}` : null;
    }

    // ---------- Storage ----------
    function loadJsonObject(key) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    function loadQueueForConversation(conversationKey) {
        if (!conversationKey) return [];
        const loaded = loadJsonObject(storageKeyQueues)[conversationKey];
        return Array.isArray(loaded) ? loaded.map(String).filter(s => s.trim()) : [];
    }

    function saveQueueForConversation(conversationKey, queueArray) {
        if (!conversationKey) return;
        const all = loadJsonObject(storageKeyQueues);
        if (Array.isArray(queueArray) && queueArray.length) all[conversationKey] = queueArray;
        else delete all[conversationKey];
        localStorage.setItem(storageKeyQueues, JSON.stringify(all));
    }

    function loadMergeSettingForConversation(conversationKey) {
        if (!conversationKey) return false;
        const all = loadJsonObject(storageKeySettings);
        return all[conversationKey]?.mergeMessagesEnabled === true;
    }

    function saveMergeSettingForConversation(conversationKey, value) {
        if (!conversationKey) return;
        const all = loadJsonObject(storageKeySettings);
        all[conversationKey] = { ...(all[conversationKey] || {}), mergeMessagesEnabled: value === true };
        localStorage.setItem(storageKeySettings, JSON.stringify(all));
    }

    function persistCurrentStateIfPossible() {
        if (!currentConversationKey) return;
        saveQueueForConversation(currentConversationKey, promptQueue);
        saveMergeSettingForConversation(currentConversationKey, mergeMessagesEnabled);
    }

    function switchConversationIfNeeded() {
        const nextConversationKey = computeConversationKey();
        if (nextConversationKey === currentConversationKey) return;

        if (currentConversationKey) persistCurrentStateIfPossible();

        if (!currentConversationKey && nextConversationKey && transientQueue.length) {
            promptQueue = transientQueue.slice();
            mergeMessagesEnabled = transientMergeMessagesEnabled;

            transientQueue = [];
            transientMergeMessagesEnabled = false;

            currentConversationKey = nextConversationKey;
            persistCurrentStateIfPossible();

            activeEditIndex = null;
            renderQueueHard();
            pumpQueue();
            return;
        }

        currentConversationKey = nextConversationKey;

        if (currentConversationKey) {
            promptQueue = loadQueueForConversation(currentConversationKey);
            mergeMessagesEnabled = loadMergeSettingForConversation(currentConversationKey);
        } else {
            transientQueue = [];
            promptQueue = transientQueue;
            transientMergeMessagesEnabled = false;
            mergeMessagesEnabled = false;
        }

        activeEditIndex = null;
        lastRenderedQueueSnapshot = [];
        pendingEnterCountFromBottom = 0;
        renderQueueHard();
        pumpQueue();
    }

    // ---------- DOM hooks ----------
    function composerNode() {
        return document.querySelector('div#prompt-textarea.ProseMirror[contenteditable="true"]')
            || document.querySelector('div#prompt-textarea[contenteditable="true"]');
    }

    function composerContainerNode() {
        const composer = composerNode();
        return composer?.closest('.wcDTda_prosemirror-parent') || composer?.parentElement || null;
    }

    function submitButtonNode() {
        return document.querySelector('button#composer-submit-button');
    }

    function submitButtonMode() {
        return submitButtonNode()?.getAttribute('data-testid') || null;
    }

    function isStreaming() {
        return submitButtonMode() === 'stop-button';
    }

    function isSendEnabled() {
        const button = submitButtonNode();
        if (!button || button.getAttribute('data-testid') !== 'send-button') return false;
        if (button.disabled) return false;
        if ((button.getAttribute('aria-disabled') || '').toLowerCase() === 'true') return false;
        if (getComputedStyle(button).pointerEvents === 'none') return false;
        return true;
    }

    function clickSubmitButtonHuman() {
        const button = submitButtonNode();
        if (!button) return false;
        button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 1 }));
        button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 1 }));
        button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
    }

    function currentComposerText() {
        return normalizeText(composerNode()?.innerText || '');
    }

    // ---------- Icons ----------
    function spriteFileBaseHref() {
        const anyUse = document.querySelector('use[href*="sprites-core"]');
        const href = anyUse?.getAttribute('href') || '';
        return href.includes('#') ? href.split('#')[0] : null;
    }

    function makeEditIconOrFallback() {
        const spriteBase = spriteFileBaseHref();
        if (!spriteBase) return document.createTextNode('✎');

        const span = document.createElement('span');
        span.className = 'flex items-center justify-center touch:w-10 h-8 w-8';
        span.contentEditable = 'false';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('class', 'icon');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', `${spriteBase}#6d87e1`);
        use.setAttribute('fill', 'currentColor');

        svg.appendChild(use);
        span.appendChild(svg);
        return span;
    }

    function makeIconButton({ title, kind }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = title;
        button.contentEditable = 'false';
        button.style.cssText =
            'width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;' +
            'border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);' +
            'color:inherit;cursor:pointer;user-select:none;flex:0 0 auto;padding:0;';
        button.addEventListener('mouseenter', () => { button.style.background = 'rgba(255,255,255,.10)'; });
        button.addEventListener('mouseleave', () => { button.style.background = 'rgba(255,255,255,.06)'; });

        if (kind === 'edit') button.appendChild(makeEditIconOrFallback());
        if (kind === 'delete') button.appendChild(document.createTextNode('✕'));
        if (kind === 'save') button.appendChild(document.createTextNode('✓'));
        if (kind === 'cancel') button.appendChild(document.createTextNode('↩'));

        return button;
    }

    // ---------- Layout styles ----------
    function queueHostStyle() {
        return [
            'position:relative',
            'display:flex',
            'flex-direction:column',
            'gap:10px',
            `padding-top:${queueHostPaddingTopPixels}px`,
            'width:100%',
            'box-sizing:border-box',
        ].join(';');
    }

    // SINGLE CONTAINER ROW: handle + bubble live together and animate together
    function queueRowWrapperStyle() {
        return [
            'position:relative',
            'display:flex',
            'align-items:stretch',
            'gap:10px',
            'max-width:100%',
            'box-sizing:border-box',
        ].join(';');
    }

    function dragHandleStyle() {
        return [
            `width:${dragHandleWidthPixels}px`,
            'flex:0 0 auto',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'align-self:stretch', // IMPORTANT: same height as bubble
            'border-radius:12px',
            'border:1px solid rgba(255,255,255,.12)',
            'background:rgba(255,255,255,.06)',
            'cursor:grab',
            'user-select:none',
            'opacity:.95',
            'box-sizing:border-box',
        ].join(';');
    }

    function queueItemBoxStyle() {
        return [
            'display:flex',
            'gap:10px',
            'align-items:stretch',
            'flex:1 1 auto',
            `padding:${queueItemPaddingPixels}px`,
            'border-radius:14px',
            'border:1px solid rgba(255,255,255,.10)',
            'background:rgba(255,255,255,.06)',
            'color:inherit',
            `font-size:${queueTextFontSizePixels}px`,
            `line-height:${queueLineHeight}`,
            'max-width:100%',
            'box-sizing:border-box',
            'min-width:0',
        ].join(';');
    }

    // Make the text vertically centered
    function queueTextStyle() {
        return [
            'flex:1',
            'min-width:0',
            'white-space:pre-wrap',
            'overflow-wrap:anywhere',
            'word-break:break-word',
            'display:flex',
            'align-items:center',
            'box-sizing:border-box',
        ].join(';');
    }

    // ---------- Host ----------
    function ensureQueueHost() {
        const container = composerContainerNode();
        const composer = composerNode();
        if (!container || !composer) return null;

        if (queueHostNode && queueHostNode.parentElement !== container) {
            queueHostNode.remove();
            queueHostNode = null;
            hostListenersAttached = false;
        }

        if (!queueHostNode) {
            queueHostNode = document.createElement('div');
            queueHostNode.id = 'tm-cgpt-message-queue';
            queueHostNode.contentEditable = 'false';
            queueHostNode.style.cssText = queueHostStyle();
            container.insertBefore(queueHostNode, composer);
        } else {
            queueHostNode.style.cssText = queueHostStyle();
        }

        if (!hostListenersAttached) {
            hostListenersAttached = true;
            queueHostNode.addEventListener('dragover', onHostDragOver, true);
            queueHostNode.addEventListener('drop', onHostDrop, true);
            queueHostNode.addEventListener('dragleave', onHostDragLeave, true);
        }

        return queueHostNode;
    }

    // ---------- Drop line ----------
    function clearDropLine() {
        if (dropLineNode) dropLineNode.remove();
        dropLineNode = null;
        dropInsertIndex = null;
    }

    function showDropLineAt(host, topWithinHostPixels) {
        if (!host) return;

        if (!dropLineNode) {
            dropLineNode = document.createElement('div');
            dropLineNode.contentEditable = 'false';
            dropLineNode.style.cssText =
                'position:absolute;pointer-events:none;height:0;' +
                'left:0;right:0;' +
                'border-top:2px solid rgba(255,255,255,.25);';
            host.appendChild(dropLineNode);
        }
        dropLineNode.style.top = `${Math.max(0, topWithinHostPixels)}px`;
    }

    function listRowWrappers(host) {
        return Array.from(host.querySelectorAll('[data-queue-row="true"]'));
    }

    function onHostDragLeave(event) {
        if (!isDragging) return;
        const related = event.relatedTarget;
        if (related && queueHostNode && queueHostNode.contains(related)) return;
        clearDropLine();
    }

    function onHostDragOver(event) {
        if (!isDragging || activeEditIndex !== null) return;
        const host = ensureQueueHost();
        if (!host) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const wrappers = listRowWrappers(host);
        if (!wrappers.length) return;

        const hostRect = host.getBoundingClientRect();
        const mouseY = event.clientY;

        let insertIndex = wrappers.length;
        let lineY = null;

        for (let i = 0; i < wrappers.length; i++) {
            const rect = wrappers[i].getBoundingClientRect();
            const mid = rect.top + rect.height / 2;

            if (mouseY < mid) {
                insertIndex = i;
                lineY = rect.top - hostRect.top;
                break;
            }
            lineY = rect.bottom - hostRect.top;
        }

        dropInsertIndex = insertIndex;
        showDropLineAt(host, lineY ?? 0);
    }

    function onHostDrop(event) {
        if (!isDragging || activeEditIndex !== null) return;

        event.preventDefault();
        event.stopPropagation();

        let sourceIndex = dragSourceIndex;
        if (sourceIndex === null) {
            const dt = (() => { try { return event.dataTransfer.getData('text/plain'); } catch { return ''; } })();
            sourceIndex = dt ? Number(dt) : null;
        }

        if (sourceIndex === null || Number.isNaN(sourceIndex)) {
            isDragging = false;
            dragSourceIndex = null;
            clearDropLine();
            return;
        }

        const rawInsertIndex = (dropInsertIndex === null) ? promptQueue.length : dropInsertIndex;
        const boundedInsertIndex = Math.max(0, Math.min(rawInsertIndex, promptQueue.length));

        const movedItem = promptQueue.splice(sourceIndex, 1)[0];

        let insertIndex = boundedInsertIndex;
        if (sourceIndex < insertIndex) insertIndex -= 1;

        insertIndex = Math.max(0, Math.min(insertIndex, promptQueue.length));
        promptQueue.splice(insertIndex, 0, movedItem);

        isDragging = false;
        dragSourceIndex = null;
        clearDropLine();

        persistCurrentStateIfPossible();
        renderQueueHard();
        pumpQueue();
    }

    // ---------- Drag handle ----------
    function makeDragHandle(index) {
        const handle = document.createElement('div');
        handle.contentEditable = 'false';
        handle.setAttribute('role', 'button');
        handle.setAttribute('aria-label', 'Drag to reorder');
        handle.setAttribute('draggable', activeEditIndex === null ? 'true' : 'false');
        handle.style.cssText = dragHandleStyle();
        handle.textContent = '⠿';

        handle.addEventListener('mouseenter', () => { handle.style.background = 'rgba(255,255,255,.10)'; });
        handle.addEventListener('mouseleave', () => { handle.style.background = 'rgba(255,255,255,.06)'; });

        handle.addEventListener('dragstart', (event) => {
            if (activeEditIndex !== null) { event.preventDefault(); return; }

            sendCancellationToken++;
            isDragging = true;
            dragSourceIndex = index;
            clearDropLine();

            event.dataTransfer.effectAllowed = 'move';
            try { event.dataTransfer.setData('text/plain', String(index)); } catch { }

            handle.style.cursor = 'grabbing';
        }, true);

        handle.addEventListener('dragend', () => {
            handle.style.cursor = 'grab';
            isDragging = false;
            dragSourceIndex = null;
            clearDropLine();
            if (promptQueue.length && !isStreaming()) pumpQueue();
        }, true);

        return handle;
    }

    // ---------- Composer manipulation (paste-first) ----------
    function fireInputEvents(composer) {
        try { composer.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: '' })); } catch { }
        try { composer.dispatchEvent(new InputEvent('input', { bubbles: true })); } catch { }
    }

    function clearComposer() {
        const composer = composerNode();
        if (!composer) return;
        composer.focus();

        try {
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
        } catch {
            composer.textContent = '';
        }

        fireInputEvents(composer);
    }

    function pasteIntoComposer(text) {
        const composer = composerNode();
        if (!composer) return false;

        composer.focus();

        try {
            const dt = new DataTransfer();
            dt.setData('text/plain', text);

            const pasteEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: dt,
            });

            composer.dispatchEvent(pasteEvent);
            fireInputEvents(composer);
            return true;
        } catch {
            return false;
        }
    }

    function setComposerText(text) {
        const composer = composerNode();
        if (!composer) return false;

        composer.focus();
        clearComposer();

        if (pasteIntoComposer(text)) {
            if (normalizeText(composer.innerText || '').length >= normalizeText(text).length * 0.7) return true;
        }

        let inserted = false;
        try { inserted = document.execCommand('insertText', false, text); } catch { inserted = false; }
        if (!inserted) composer.textContent = text;

        fireInputEvents(composer);
        return true;
    }

    function moveCaretToEndOfComposer(composer) {
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(composer);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch { }
    }

    function appendComposerText(textToAppend) {
        const composer = composerNode();
        if (!composer) return false;

        composer.focus();
        moveCaretToEndOfComposer(composer);

        if (pasteIntoComposer(textToAppend)) return true;

        let inserted = false;
        try { inserted = document.execCommand('insertText', false, textToAppend); } catch { inserted = false; }
        if (!inserted) composer.textContent = (composer.innerText || '') + textToAppend;

        fireInputEvents(composer);
        return true;
    }

    // ---------- Draft restore ----------
    function scheduleDraftRestore(draftText, attemptToken) {
        const draft = normalizeText(draftText);
        if (!draft) return;

        pendingDraftRestore = {
            attemptToken,
            draftText: draft,
            attemptIndex: 0,
            startedAt: performance.now(),
        };

        queueMicrotask(tryRestorePendingDraft);
    }

    function tryRestorePendingDraft() {
        if (!pendingDraftRestore) return;

        if (sendCancellationToken !== pendingDraftRestore.attemptToken) {
            pendingDraftRestore = null;
            return;
        }

        if (isInteracting()) return;

        const composer = composerNode();
        if (!composer) return;

        const currentText = normalizeText(composer.innerText || '');
        const draft = pendingDraftRestore.draftText;

        if (draft && currentText.includes(draft)) {
            pendingDraftRestore = null;
            return;
        }

        if (currentText === '') setComposerText(draft);
        else appendComposerText(`\n\n${draft}`);

        const afterText = normalizeText(composer.innerText || '');
        if (afterText.includes(draft)) {
            pendingDraftRestore = null;
            return;
        }

        pendingDraftRestore.attemptIndex += 1;
        if (pendingDraftRestore.attemptIndex >= draftRestoreRetryDelays.length) {
            pendingDraftRestore = null;
            return;
        }

        const delay = draftRestoreRetryDelays[pendingDraftRestore.attemptIndex];
        setTimeout(() => {
            if (pendingDraftRestore) tryRestorePendingDraft();
        }, delay);
    }

    // ---------- Queue controls ----------
    function buildToggleButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.contentEditable = 'false';
        button.setAttribute('aria-pressed', mergeMessagesEnabled ? 'true' : 'false');
        button.style.cssText =
            'display:inline-flex;align-items:center;gap:8px;' +
            'padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);' +
            'background:rgba(255,255,255,.06);color:inherit;font-size:13px;cursor:pointer;user-select:none;';

        const label = document.createElement('span');
        label.textContent = 'Merge messages';

        const state = document.createElement('span');
        state.textContent = mergeMessagesEnabled ? 'On' : 'Off';
        state.style.cssText =
            'padding:2px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.14);' +
            'background:rgba(0,0,0,.12);font-size:12px;';

        button.addEventListener('mouseenter', () => { button.style.background = 'rgba(255,255,255,.10)'; });
        button.addEventListener('mouseleave', () => { button.style.background = 'rgba(255,255,255,.06)'; });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            sendCancellationToken++;
            mergeMessagesEnabled = !mergeMessagesEnabled;

            if (mergeMessagesEnabled && promptQueue.length > 1) {
                promptQueue = [promptQueue.join('\n\n')];
                if (!currentConversationKey) transientQueue = promptQueue;
            }

            if (currentConversationKey) persistCurrentStateIfPossible();
            else transientMergeMessagesEnabled = mergeMessagesEnabled;

            renderQueueHard();
        }, true);

        button.appendChild(label);
        button.appendChild(state);
        return button;
    }

    function buildClearQueueButton() {
        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.textContent = 'Clear queue';
        clearButton.contentEditable = 'false';
        clearButton.style.cssText =
            'padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);' +
            'background:rgba(255,255,255,.06);color:inherit;font-size:13px;cursor:pointer;user-select:none;';
        clearButton.addEventListener('mouseenter', () => { clearButton.style.background = 'rgba(255,255,255,.10)'; });
        clearButton.addEventListener('mouseleave', () => { clearButton.style.background = 'rgba(255,255,255,.06)'; });

        clearButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            sendCancellationToken++;
            promptQueue.length = 0;
            persistCurrentStateIfPossible();
            renderQueueHard();
        }, true);

        return clearButton;
    }

    function buildControlsRow() {
        const row = document.createElement('div');
        row.contentEditable = 'false';
        row.dataset.queueControls = 'true';
        row.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;padding:2px 0 0 0;';
        row.appendChild(buildToggleButton());
        row.appendChild(buildClearQueueButton());
        return row;
    }

    // ---------- Render ----------
    function renderQueueHard() {
        const host = ensureQueueHost();
        if (!host) return;

        clearDropLine();
        activeEditIndex = null;
        host.innerHTML = '';
        renderQueue();
    }

    function renderQueue() {
        const host = ensureQueueHost();
        if (!host) return;
        if (activeEditIndex !== null) return;
        if (isDragging) return;

        ensureAnimationStyles();

        if (promptQueue.length > lastRenderedQueueSnapshot.length) {
            pendingEnterCountFromBottom = Math.min(
                promptQueue.length - lastRenderedQueueSnapshot.length,
                promptQueue.length
            );
        } else {
            pendingEnterCountFromBottom = 0;
        }
        lastRenderedQueueSnapshot = promptQueue.slice();

        host.innerHTML = '';
        if (promptQueue.length === 0) return;

        for (let index = 0; index < promptQueue.length; index++) {
            const rowWrapper = document.createElement('div');
            rowWrapper.contentEditable = 'false';
            rowWrapper.dataset.queueRow = 'true';
            rowWrapper.dataset.queueIndex = String(index);
            rowWrapper.style.cssText = queueRowWrapperStyle();

            // apply enter animation to the WHOLE ROW (handle + bubble)
            const isInEnterRange = pendingEnterCountFromBottom > 0 && index >= (promptQueue.length - pendingEnterCountFromBottom);
            if (isInEnterRange) rowWrapper.classList.add('tmq-enter');

            const handle = makeDragHandle(index);

            const itemBox = document.createElement('div');
            itemBox.contentEditable = 'false';
            itemBox.dataset.queueBox = 'true';
            itemBox.style.cssText = queueItemBoxStyle();

            const text = document.createElement('div');
            text.contentEditable = 'false';
            text.style.cssText = queueTextStyle();
            text.textContent = promptQueue[index];

            const buttons = document.createElement('div');
            buttons.contentEditable = 'false';
            buttons.style.cssText = 'display:flex;gap:8px;flex:0 0 auto;margin-left:auto;align-items:center;';

            const editButton = makeIconButton({ title: 'Edit', kind: 'edit' });
            const deleteButton = makeIconButton({ title: 'Delete', kind: 'delete' });

            editButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                beginInlineEdit(index);
            }, true);

            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                animateAndDeleteQueueItem(index);
            }, true);

            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);

            itemBox.appendChild(text);
            itemBox.appendChild(buttons);

            rowWrapper.appendChild(handle);
            rowWrapper.appendChild(itemBox);

            host.appendChild(rowWrapper);
        }

        host.appendChild(buildControlsRow());
    }

    function deleteQueueItem(index) {
        if (index < 0 || index >= promptQueue.length) return;
        sendCancellationToken++;
        promptQueue.splice(index, 1);
        persistCurrentStateIfPossible();
        renderQueueHard();
    }

    function animateAndDeleteQueueItem(index) {
        if (index < 0 || index >= promptQueue.length) return;
        sendCancellationToken++;

        const host = ensureQueueHost();
        const row = host?.querySelector(`[data-queue-row="true"][data-queue-index="${index}"]`);
        if (!row) return deleteQueueItem(index);

        row.classList.remove('tmq-enter');
        row.classList.add('tmq-exit-delete');

        setTimeout(() => deleteQueueItem(index), exitDeleteAnimationMilliseconds);
    }

    function beginInlineEdit(index) {
        const host = ensureQueueHost();
        if (!host) return;
        if (index < 0 || index >= promptQueue.length) return;

        sendCancellationToken++;
        clearDropLine();

        activeEditIndex = index;
        activeEditOriginalText = promptQueue[index];
        host.innerHTML = '';

        for (let i = 0; i < promptQueue.length; i++) {
            const isEditingThis = i === activeEditIndex;

            const rowWrapper = document.createElement('div');
            rowWrapper.contentEditable = 'false';
            rowWrapper.dataset.queueRow = 'true';
            rowWrapper.style.cssText = queueRowWrapperStyle();

            const handle = makeDragHandle(i);
            handle.setAttribute('draggable', 'false');
            handle.style.cursor = 'not-allowed';
            handle.style.opacity = '.55';

            const itemBox = document.createElement('div');
            itemBox.contentEditable = 'false';
            itemBox.dataset.queueBox = 'true';
            itemBox.style.cssText = queueItemBoxStyle();

            const text = document.createElement('div');
            text.contentEditable = isEditingThis ? 'true' : 'false';
            text.spellcheck = false;
            text.style.cssText = isEditingThis
                ? (queueTextStyle() + ';outline:none;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.12);padding:8px 10px;max-height:220px;overflow:auto;align-items:flex-start;')
                : queueTextStyle();
            text.textContent = promptQueue[i];

            const buttons = document.createElement('div');
            buttons.contentEditable = 'false';
            buttons.style.cssText = 'display:flex;gap:8px;flex:0 0 auto;margin-left:auto;align-items:center;';

            const primaryButton = makeIconButton({ title: isEditingThis ? 'Save' : 'Edit', kind: isEditingThis ? 'save' : 'edit' });
            const secondaryButton = makeIconButton({ title: isEditingThis ? 'Cancel' : 'Delete', kind: isEditingThis ? 'cancel' : 'delete' });

            primaryButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isEditingThis) return beginInlineEdit(i);
                commitInlineEdit(text.innerText);
            }, true);

            secondaryButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isEditingThis) return animateAndDeleteQueueItem(i);
                cancelInlineEdit();
            }, true);

            if (isEditingThis) {
                text.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelInlineEdit(); }
                    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.stopPropagation(); commitInlineEdit(text.innerText); }
                }, true);

                text.addEventListener('blur', () => {
                    if (activeEditIndex !== null) commitInlineEdit(text.innerText);
                }, { capture: true, once: true });
            }

            buttons.appendChild(primaryButton);
            buttons.appendChild(secondaryButton);

            itemBox.appendChild(text);
            itemBox.appendChild(buttons);

            rowWrapper.appendChild(handle);
            rowWrapper.appendChild(itemBox);

            host.appendChild(rowWrapper);

            if (isEditingThis) {
                queueMicrotask(() => {
                    text.focus();
                    const sel = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(text);
                    sel.removeAllRanges();
                    sel.addRange(range);
                });
            }
        }

        host.appendChild(buildControlsRow());
    }

    function commitInlineEdit(editedText) {
        if (activeEditIndex === null) return;
        const cleaned = normalizeText(editedText);
        if (!cleaned) return animateAndDeleteQueueItem(activeEditIndex);
        promptQueue[activeEditIndex] = cleaned;
        activeEditIndex = null;
        persistCurrentStateIfPossible();
        renderQueueHard();
        pumpQueue();
    }

    function cancelInlineEdit() {
        if (activeEditIndex === null) return;
        promptQueue[activeEditIndex] = activeEditOriginalText;
        activeEditIndex = null;
        persistCurrentStateIfPossible();
        renderQueueHard();
        pumpQueue();
    }

    // ---------- Queue behavior ----------
    function enqueuePrompt(promptText) {
        const normalized = normalizeText(promptText);
        if (!normalized) return;

        const beforeLength = promptQueue.length;

        if (mergeMessagesEnabled) {
            if (promptQueue.length === 0) promptQueue.push(normalized);
            else promptQueue[promptQueue.length - 1] = `${promptQueue[promptQueue.length - 1]}\n\n${normalized}`;
        } else {
            promptQueue.push(normalized);
        }

        const afterLength = promptQueue.length;
        if (afterLength > beforeLength) pendingEnterCountFromBottom = afterLength - beforeLength;
        else pendingEnterCountFromBottom = 0;

        if (currentConversationKey) persistCurrentStateIfPossible();
        else transientMergeMessagesEnabled = mergeMessagesEnabled;

        renderQueueHard();
        pumpQueue();
    }

    async function animateDequeueSendIfVisible() {
        const host = ensureQueueHost();
        const firstRow = host?.querySelector('[data-queue-row="true"]');
        if (!firstRow) return;

        ensureAnimationStyles();
        firstRow.classList.remove('tmq-enter');
        firstRow.classList.add('tmq-exit-send');
        await sleep(exitSendAnimationMilliseconds);
    }

    async function sendNextQueuedPrompt() {
        if (!promptQueue.length || isStreaming() || isInteracting()) return false;

        const myAttemptToken = sendCancellationToken;

        const savedDraftText = currentComposerText();
        const nextQueuedPromptText = promptQueue[0];
        const baselineTransactionCount = proseMirrorTransactionCounter;

        setComposerText(nextQueuedPromptText);

        const editorAcknowledgedText = await waitFor(
            () => proseMirrorTransactionCounter > baselineTransactionCount || currentComposerText() === normalizeText(nextQueuedPromptText),
            transactionWaitMilliseconds
        );
        if (sendCancellationToken !== myAttemptToken) return false;
        if (!editorAcknowledgedText) return false;

        const sendButtonEnabled = await waitFor(() => !isStreaming() && isSendEnabled(), sendEnableWaitMilliseconds);
        if (sendCancellationToken !== myAttemptToken) return false;
        if (!sendButtonEnabled) return false;

        clickSubmitButtonHuman();
        if (sendCancellationToken !== myAttemptToken) return false;

        const streamingStarted = await waitFor(() => isStreaming(), streamingStartWaitMilliseconds);
        if (sendCancellationToken !== myAttemptToken) return false;
        if (!streamingStarted) return false;

        if (savedDraftText) scheduleDraftRestore(savedDraftText, myAttemptToken);

        await animateDequeueSendIfVisible();
        if (sendCancellationToken !== myAttemptToken) return false;

        promptQueue.shift();
        persistCurrentStateIfPossible();
        renderQueueHard();

        return true;
    }

    async function pumpQueue() {
        if (isQueuePumpRunning) return;
        if (isInteracting()) return;

        isQueuePumpRunning = true;
        try { await sendNextQueuedPrompt(); }
        finally { isQueuePumpRunning = false; }
    }

    // ---------- Enter hijack while streaming ----------
    function onComposerKeydownCapture(event) {
        if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;

        const composer = composerNode();
        if (!composer || document.activeElement !== composer || !isStreaming()) return;

        event.preventDefault();
        event.stopImmediatePropagation?.();
        event.stopPropagation();

        const text = currentComposerText();
        if (text) enqueuePrompt(text);
        clearComposer();
    }

    // ---------- Attach listeners ----------
    function attachComposerListeners() {
        const composer = composerNode();
        if (!composer || composer === attachedComposerNode) return;

        attachedComposerNode = composer;

        composer.addEventListener('prosemirrorDispatchTransaction', () => {
            proseMirrorTransactionCounter++;
            if (pendingDraftRestore) tryRestorePendingDraft();
        }, false);

        composer.addEventListener('keydown', onComposerKeydownCapture, true);
    }

    function attachSubmitButtonObserver() {
        const button = submitButtonNode();
        if (!button || button === attachedSubmitButtonNode) return;

        attachedSubmitButtonNode = button;

        submitButtonMutationObserver?.disconnect();
        submitButtonMutationObserver = new MutationObserver(() => {
            if (!isStreaming() && promptQueue.length && !isInteracting()) pumpQueue();
            if (pendingDraftRestore) tryRestorePendingDraft();
        });

        submitButtonMutationObserver.observe(button, {
            attributes: true,
            attributeFilter: ['data-testid', 'disabled', 'aria-disabled'],
        });
    }

    // ---------- SPA navigation ----------
    function notifyUrlChange() { switchConversationIfNeeded(); }

    function installHistoryHooks() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            const result = originalPushState.apply(this, args);
            queueMicrotask(notifyUrlChange);
            return result;
        };

        history.replaceState = function (...args) {
            const result = originalReplaceState.apply(this, args);
            queueMicrotask(notifyUrlChange);
            return result;
        };

        window.addEventListener('popstate', () => queueMicrotask(notifyUrlChange), true);
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            switchConversationIfNeeded();
            renderQueueHard();
            if (pendingDraftRestore) tryRestorePendingDraft();
            if (promptQueue.length && !isStreaming() && !isInteracting()) pumpQueue();
        }
    }, true);

    // ---------- Main loop ----------
    function tick() {
        switchConversationIfNeeded();
        ensureQueueHost();
        attachComposerListeners();
        attachSubmitButtonObserver();

        if (!isDragging) renderQueue();

        if (pendingDraftRestore) tryRestorePendingDraft();
        if (promptQueue.length && !isStreaming() && !isInteracting()) pumpQueue();
    }

    // ---------- Bootstrap ----------
    ensureAnimationStyles();
    installHistoryHooks();
    switchConversationIfNeeded();
    setInterval(tick, pollIntervalMilliseconds);
    tick();

})();
