// ==UserScript==
// @name Monkeydingus
// @version 5.4
// @description Torn Tool with Template Panel, Chat Buttons, Message Forwarding, Profile Signature Edit Link Displayed On Profile
// @author dingus
// @match https://www.torn.com/*
// @grant none
// @run-at document-end
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/561918/Monkeydingus.user.js
// @updateURL https://update.greasyfork.org/scripts/561918/Monkeydingus.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const LS = {
        get(key, fallback) {
            const v = localStorage.getItem(key);
            return v === null ? fallback : v;
        },
        set(key, value) {
            localStorage.setItem(key, value);
        }
    };
    let templateContent = LS.get('messageTemplate', `
<p>Hello,</p>
<p>This is a sample message template. Feel free to customize this content!</p>
<p>Best regards,<br>Your Name</p>
`.trim());
    let templateTitle = LS.get('messageTemplateTitle', 'Default Template');
    let isChatButtonEnabled = LS.get('chatButtonEnabled', 'true') !== 'false';
    let isForwardEnabled = LS.get('forwardEnabled', 'true') !== 'false';
    let isSignatureEditEnabled = LS.get('signatureEditEnabled', 'true') !== 'false';
    if (LS.get('chatButtonEnabled', null) === null) LS.set('chatButtonEnabled', 'true');
    if (LS.get('forwardEnabled', null) === null) LS.set('forwardEnabled', 'true');
    if (LS.get('signatureEditEnabled', null) === null) LS.set('signatureEditEnabled', 'true');
    function getEditor() {
        return document.querySelector('div.editor-content.mce-content-body[contenteditable="true"]');
    }
    function getTitleInput() {
        return document.querySelector('input[name="subject"]') ||
               document.evaluate('//input[@type="text"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function setTemplate() {
        const editor = getEditor();
        const titleInput = getTitleInput();
        if (editor) editor.innerHTML = templateContent;
        if (titleInput) titleInput.value = templateTitle;
    }
    function addTemplateButton() {
        const wrapper = document.querySelector('div.actionButtonsWrapper___DwpJR');
        if (!wrapper || wrapper.querySelector('#templateButton')) return false;
        const btn = document.createElement('button');
        btn.id = 'templateButton';
        btn.type = 'button';
        btn.className = 'torn-btn';
        btn.textContent = 'Template';
        btn.style.marginLeft = '5px';
        btn.addEventListener('click', setTemplate);
        wrapper.appendChild(btn);
        return true;
    }
    function initializeMessageTemplate() {
        if (!location.hash.includes('#/p=compose')) return;
        if (addTemplateButton()) return;
        let attempts = 0;
        const maxAttempts = 25;
        const iv = setInterval(() => {
            attempts++;
            if (addTemplateButton() || attempts >= maxAttempts) {
                clearInterval(iv);
            }
        }, 400);
    }
    function addChatIcons() {
        if (!isChatButtonEnabled) return;
        const userItems = document.querySelectorAll('ul.user-info-list-wrap > li');
        if (!userItems.length) return;
        userItems.forEach(item => {
            const nameLink = item.querySelector('a.user.name');
            if (!nameLink) return;
            const href = nameLink.getAttribute('href');
            const xidMatch = href.match(/XID=(\d+)/);
            if (!xidMatch) return;
            const xid = xidMatch[1];
            const iconTray = item.querySelector('div.level-icons-wrap span.user-icons span.icons-wrap ul#iconTray');
            if (!iconTray) return;
            if (iconTray.querySelector(`#chat-icon___${xid}`)) return;
            const chatItem = document.createElement('li');
            chatItem.id = `chat-icon___${xid}`;
            chatItem.className = 'iconShow';
            chatItem.setAttribute('title', '<b>Chat</b>');
            const chatLink = document.createElement('a');
            chatLink.href = 'javascript:void(0);';
            chatLink.setAttribute('aria-label', 'Private message');
            chatLink.className = 'chat-icon';
            chatLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.chat && typeof window.chat === "object") {
                    window.chat.r(xid);
                } else {
                    window.dispatchEvent(new CustomEvent("chat.openChannel", {
                        detail: { userId: String(xid) }
                    }));
                }
            });
            chatItem.appendChild(chatLink);
            iconTray.appendChild(chatItem);
        });
    }
    function removeChatIcons() {
        document.querySelectorAll('li[id^="chat-icon___"]').forEach(icon => icon.remove());
    }
    let chatObserver = null;
    function initializeChatButtons() {
        if (!window.location.pathname.includes('/page.php') || !window.location.search.includes('sid=UserList')) {
            return;
        }
        if (!isChatButtonEnabled) {
            removeChatIcons();
            return;
        }
        addChatIcons();
        const targetNode = document.querySelector('ul.user-info-list-wrap');
        if (targetNode) {
            if (chatObserver) chatObserver.disconnect();
            chatObserver = new MutationObserver(() => addChatIcons());
            chatObserver.observe(targetNode, { childList: true, subtree: true });
        }
    }
    function addForwardButton() {
        if (!isForwardEnabled) return;
        document.querySelectorAll('ul.reply-mail-action.bottom-round').forEach(list => {
            if (list.querySelector('.forward-message')) return;
            const container = list.closest('.mailbox-container');
            if (!container) return;
            const msgId = container.querySelector('a[data-id]')?.dataset.id;
            if (!msgId) return;
            const content = container.querySelector('.editor-content')?.innerHTML || '';
            const title = container.querySelector('.container-header .left')?.textContent.trim() || '';
            const sender = container.querySelector('p.bold a')?.textContent.trim() || '';
            const li = document.createElement('li');
            li.className = 'forward-message torn-divider divider-vertical';
            li.innerHTML = `<a href="#"><i class="mail-reply-forward-icon"></i>Forward</a>`;
            li.addEventListener('click', e => {
                e.preventDefault();
                location.href = `/messages.php#/p=compose&fwd=${msgId}`;
                const iv = setInterval(() => {
                    const ed = getEditor();
                    const ti = getTitleInput();
                    if (ed && ti) {
                        ed.innerHTML = `
<p>---------- Forwarded message ----------</p>
<p>From: ${sender}</p>
<p>Subject: ${title}</p>
${content}`;
                        ti.value = `Fwd: ${title}`;
                        clearInterval(iv);
                    }
                }, 500);
            });
            list.appendChild(li);
        });
    }
    function removeForwardButtons() {
        document.querySelectorAll('.forward-message').forEach(btn => btn.remove());
    }
    function initializeForward() {
        if (location.hash.includes('#/p=read')) addForwardButton();
    }
    function addEditLink() {
        if (!isSignatureEditEnabled) return;
        document.querySelectorAll('div[class*="title-black"]').forEach(div => {
            if (div.textContent.trim() !== 'Profile Signature') return;
            if (div.querySelector('a[href*="profile-signature"]')) return;
            const a = document.createElement('a');
            a.href = 'https://www.torn.com/preferences.php#tab=profile-signature';
            a.textContent = 'Edit';
            a.target = '_blank';
            a.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: inherit !important;
                font: inherit !important;
                text-decoration: none;
            `;
            a.addEventListener('mouseover', () => a.style.textDecoration = 'underline');
            a.addEventListener('mouseout', () => a.style.textDecoration = 'none');
            div.style.position = 'relative';
            div.appendChild(a);
        });
    }
    function removeEditLinks() {
        document.querySelectorAll('a[href*="profile-signature"]').forEach(link => {
            if (link.textContent === 'Edit') link.remove();
        });
    }
    let signatureObserver = null;
    function initializeSignatureEdit() {
        if (!isSignatureEditEnabled) {
            removeEditLinks();
            if (signatureObserver) signatureObserver.disconnect();
            return;
        }
        addEditLink();
        if (!signatureObserver) {
            signatureObserver = new MutationObserver(addEditLink);
            signatureObserver.observe(document.body, { childList: true, subtree: true });
        }
    }
    function addDingusButton() {
        const targetUl = document.querySelector('.ui-tabs-nav') || document.querySelector('ul[role="tablist"]');
        if (!targetUl) return false;
        const tabItems = targetUl.querySelectorAll('li[role="tab"]');
        if (tabItems.length < 7) return false;
        const seventhTab = tabItems[6];
        if (targetUl.querySelector('li a[href="#dingus"]')) return true;
        const isDingusActive = location.href.includes('#tab=dingus');
        const newLi = document.createElement('li');
        newLi.className = isDingusActive ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active' : 'c-pointer ui-state-default ui-corner-top';
        newLi.setAttribute('data-title-name', 'Custom Settings');
        newLi.setAttribute('role', 'tab');
        newLi.setAttribute('aria-controls', 'dingus');
        newLi.setAttribute('aria-labelledby', 'ui-id-8');
        const anchor = document.createElement('a');
        anchor.className = 't-gray-6 bold h email-subscriptions ui-tabs-anchor';
        anchor.setAttribute('href', '#dingus');
        anchor.setAttribute('role', 'presentation');
        anchor.setAttribute('id', 'ui-id-8');
        anchor.textContent = 'Custom Settings';
        let isHovering = false;
        function updateButtonClass() {
            const isDingusActiveNow = location.href.includes('#tab=dingus');
            newLi.className = (isDingusActiveNow || isHovering) ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active' : 'c-pointer ui-state-default ui-corner-top';
            newLi.setAttribute('aria-selected', isDingusActiveNow ? 'true' : 'false');
        }
        newLi.addEventListener('mouseover', () => { isHovering = true; updateButtonClass(); });
        newLi.addEventListener('mouseout', () => { isHovering = false; updateButtonClass(); });
        anchor.addEventListener('click', e => {
            e.preventDefault();
            history.pushState(null, '', 'https://www.torn.com/preferences.php#tab=dingus');
            toggleDingusPanel();
        });
        newLi.appendChild(anchor);
        if (seventhTab.nextSibling) {
            targetUl.insertBefore(newLi, seventhTab.nextSibling);
        } else {
            targetUl.appendChild(newLi);
        }
        return true;
    }
    function createDingusPanel() {
        if (document.getElementById('dingus')) return;
        const tabContainer = document.querySelector('.ui-tabs');
        if (!tabContainer) return;
        const dingusPanel = document.createElement('div');
        dingusPanel.id = 'dingus';
        dingusPanel.className = 'prefs-cont left ui-tabs-panel ui-widget-content ui-corner-bottom';
        dingusPanel.setAttribute('role', 'tabpanel');
        dingusPanel.setAttribute('aria-labelledby', 'ui-id-8');
        dingusPanel.setAttribute('aria-expanded', 'false');
        dingusPanel.setAttribute('aria-hidden', 'true');
        dingusPanel.style.display = 'none';
        dingusPanel.innerHTML = `
            <div class="inner-block begin-dingus-settings">
                <ul class="settings-list no-padding">
                    <li class="settings-cell p-top5 first left">
                        <div class="head t-gray-6 bold">
                            <p>Message Template Title:</p>
                            <div class="clear"></div>
                        </div>
                        <input type="text" id="message-template-title" placeholder="Enter your message template title" style="width: 100%; padding: 5px; margin-bottom: 10px;" />
                        <div class="head t-gray-6 bold">
                            <p>Message Template:</p>
                            <div class="clear"></div>
                        </div>
                        <textarea id="message-template" rows="5" cols="50" placeholder="Enter your message template (HTML format)" style="resize: vertical; padding: 5px; margin: 0; width: 100%;"></textarea>
                        <div class="p-top5">
                            <input type="checkbox" id="chat-button-toggle">
                            <label for="chat-button-toggle">Enable Chat Buttons on User List</label>
                        </div>
                        <div class="p-top5">
                            <input type="checkbox" id="forward-toggle">
                            <label for="forward-toggle">Enable Message Forward</label>
                        </div>
                        <div class="p-top5">
                            <input type="checkbox" id="signature-edit-toggle">
                            <label for="signature-edit-toggle">Enable Profile Signature Edit Link</label>
                        </div>
                        <div class="btn-wrap p-top5">
                            <button id="save-settings" class="btn torn-btn btn-big grey">Save Settings</button>
                        </div>
                    </li>
                    <div class="clear"></div>
                </ul>
            </div>
        `;
        tabContainer.appendChild(dingusPanel);
        setupSettingsPanel();
    }
    function setupSettingsPanel() {
        const templateTextarea = document.getElementById('message-template');
        const templateTitleInput = document.getElementById('message-template-title');
        const saveSettingsBtn = document.getElementById('save-settings');
        const chatButtonToggle = document.getElementById('chat-button-toggle');
        const forwardToggle = document.getElementById('forward-toggle');
        const signatureEditToggle = document.getElementById('signature-edit-toggle');
        templateTextarea.value = templateContent;
        templateTitleInput.value = templateTitle;
        chatButtonToggle.checked = isChatButtonEnabled;
        forwardToggle.checked = isForwardEnabled;
        signatureEditToggle.checked = isSignatureEditEnabled;
        saveSettingsBtn.addEventListener('click', () => {
            templateContent = templateTextarea.value.trim();
            templateTitle = templateTitleInput.value.trim();
            isChatButtonEnabled = chatButtonToggle.checked;
            isForwardEnabled = forwardToggle.checked;
            isSignatureEditEnabled = signatureEditToggle.checked;
            LS.set('messageTemplate', templateContent);
            LS.set('messageTemplateTitle', templateTitle);
            LS.set('chatButtonEnabled', isChatButtonEnabled ? 'true' : 'false');
            LS.set('forwardEnabled', isForwardEnabled ? 'true' : 'false');
            LS.set('signatureEditEnabled', isSignatureEditEnabled ? 'true' : 'false');
            applyFeatureToggles();
        });
        chatButtonToggle.addEventListener('change', () => {
            isChatButtonEnabled = chatButtonToggle.checked;
            applyChatToggle();
        });
        forwardToggle.addEventListener('change', () => {
            isForwardEnabled = forwardToggle.checked;
            applyForwardToggle();
        });
        signatureEditToggle.addEventListener('change', () => {
            isSignatureEditEnabled = signatureEditToggle.checked;
            initializeSignatureEdit();
        });
    }
    function applyFeatureToggles() {
        applyChatToggle();
        applyForwardToggle();
        initializeSignatureEdit();
    }
    function applyChatToggle() {
        if (window.location.pathname.includes('/page.php') && window.location.search.includes('sid=UserList')) {
            if (isChatButtonEnabled) {
                addChatIcons();
                if (!chatObserver) initializeChatButtons();
            } else {
                removeChatIcons();
                if (chatObserver) {
                    chatObserver.disconnect();
                    chatObserver = null;
                }
            }
        }
    }
    function applyForwardToggle() {
        if (location.hash.includes('#/p=read')) {
            if (isForwardEnabled) {
                addForwardButton();
            } else {
                removeForwardButtons();
            }
        }
    }
    function toggleDingusPanel() {
        const isDingus = location.href.includes('#tab=dingus');
        const dingusPanel = document.getElementById('dingus');
        if (dingusPanel) {
            dingusPanel.setAttribute('aria-expanded', isDingus ? 'true' : 'false');
            dingusPanel.setAttribute('aria-hidden', isDingus ? 'false' : 'true');
            dingusPanel.style.display = isDingus ? 'block' : 'none';
        }
        const dingusTab = document.querySelector('li[aria-controls="dingus"]');
        if (dingusTab) {
            dingusTab.classList.toggle('ui-tabs-active', isDingus);
            dingusTab.classList.toggle('ui-state-active', isDingus);
            dingusTab.setAttribute('aria-selected', isDingus ? 'true' : 'false');
        }
        if (isDingus) {
            document.querySelectorAll('div[role="tabpanel"]:not(#dingus)').forEach(panel => {
                panel.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.style.display = 'none';
            });
            document.querySelectorAll('li[role="tab"]:not([aria-controls="dingus"])').forEach(tab => {
                tab.classList.remove('ui-tabs-active', 'ui-state-active');
                tab.setAttribute('aria-selected', 'false');
            });
        }
        updateHeaderText();
    }
    function updateHeaderText() {
        if (!location.href.includes('#tab=dingus')) return;
        const xpath = '//div[contains(@class, "prefs-title")]/text()';
        const targetNode = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetNode) targetNode.nodeValue = 'Custom Settings';
    }
    function startPreferencesPolling() {
        if (!location.pathname.includes('/preferences.php')) return;
        if (addDingusButton()) {
            createDingusPanel();
            toggleDingusPanel();
            return;
        }
        let attempts = 0;
        const maxAttempts = 150;
        const iv = setInterval(() => {
            attempts++;
            if (addDingusButton() || attempts >= maxAttempts) {
                clearInterval(iv);
                if (addDingusButton()) {
                    createDingusPanel();
                    toggleDingusPanel();
                }
            }
        }, 50);
    }
    window.addEventListener('load', () => {
        initializeMessageTemplate();
        initializeChatButtons();
        initializeForward();
        initializeSignatureEdit();
        startPreferencesPolling();
    });
    window.addEventListener('hashchange', () => {
        initializeMessageTemplate();
        initializeForward();
        toggleDingusPanel();
    });
    setInterval(toggleDingusPanel, 500);
})();