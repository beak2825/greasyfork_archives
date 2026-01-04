// ==UserScript==
// @name         Surlignage Post
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Version de tests. Met en évidence l'auteur (OP), les citations, les PEMT, vos messages et les DDB sur tous les forums JVC.
// @author       FaceDePet
// @match        *://www.jeuxvideo.com/forums/*-*-*-*-*-*-*-*.htm
// @connect      *.jeuxvideo.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551557/Surlignage%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/551557/Surlignage%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class JVCTopicEnhancer {
        constructor() {
            this.CACHE_KEY_OP = 'jvcTopicEnhancerCacheOP';
            this.CACHE_KEY_POSTS = 'jvcUserPostsCache';
            this.CACHE_KEY_DDB = 'jvcDdbStatusCache';
            this.MAX_CACHED_POSTS_PER_TOPIC = 20;
            this.pemtColors = ['#45a093', '#5c8fba', '#896a9e', '#c77e4d', '#c06158'];
            this.init();
        }

        async init() {
            this.topicId = this.getTopicId();
            if (!this.topicId) return;

            this.currentPage = this.getCurrentPageNumber();
            this.currentUser = this.getCurrentUsername();

            this.addPostListener();

            try {
                const [opUsername, userMessages] = await Promise.all([
                    this.getOpUsername(),
                    this.currentUser ? this.getAllUserMessageContents() : []
                ]);
                this.opUsername = opUsername;
                this.currentUserMessages = userMessages;
            } catch (error) {
                console.error("JVC Enhancer: Erreur lors de la récupération des données.", error);
                return;
            }

            this.highlightRules = [
                { name: 'Original Poster', condition: (author) => author === this.opUsername },
                { name: 'User Mention', condition: (author, el) => this.isUserMentioned(author, el) },
                { name: 'Self', condition: (author) => author === this.currentUser }
            ];

            this.injectStyles();
            this.processMessages();
            this.checkFirstMessagesReportStatus();
        }

        getTopicId() { const match = window.location.href.match(/\/forums\/\d+-\d+-(\d+)-/); return match ? match[1] : null; }
        getCurrentPageNumber() { const match = window.location.href.match(/-(\d+)-0-1-0-/); return match ? parseInt(match[1], 10) : 1; }

        async getOpUsername() {
            const cache = JSON.parse(sessionStorage.getItem(this.CACHE_KEY_OP)) || {};
            if (cache[this.topicId]) return cache[this.topicId];
            let newOpUsername = (this.currentPage === 1) ? this.parseOpUsernameFromDocument(document) : await this.fetchOpUsernameFromPageOne();
            if (newOpUsername) { cache[this.topicId] = newOpUsername; sessionStorage.setItem(this.CACHE_KEY_OP, JSON.stringify(cache)); }
            return newOpUsername;
        }

        parseOpUsernameFromDocument(doc, isApi = false) { const selector = isApi ? '.post .bloc-pseudo-msg' : '.bloc-message-forum .bloc-pseudo-msg'; return doc.querySelector(selector)?.textContent.trim() || null; }
        fetchOpUsernameFromPageOne() { return this.fetchApiPageContent(1).then(doc => this.parseOpUsernameFromDocument(doc, true)); }

        fetchApiPageContent(pageNumber) {
            return new Promise((resolve, reject) => {
                const url = window.location.href.replace(`-${this.currentPage}-0-1-0-`, `-${pageNumber}-0-1-0-`).replace('www.jeuxvideo.com', 'api.jeuxvideo.com');
                GM_xmlhttpRequest({ method: "GET", url, onload: (res) => resolve(new DOMParser().parseFromString(res.responseText, "text/html")), onerror: (err) => reject(err) });
            });
        }

        fetchUrlContent(url) { return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url, onload: (res) => resolve(res.responseText), onerror: (err) => reject(err) }); }); }

        async getAllUserMessageContents() {
            const cachedPosts = this.loadUserPostsFromCache();
            let pagePosts = this.parseMessagesFromDocument(document);
            let prevPagePosts = [];
            if (this.currentPage > 1) {
                try {
                    const prevPageDoc = await this.fetchApiPageContent(this.currentPage - 1);
                    prevPagePosts = this.parseMessagesFromDocument(prevPageDoc, true);
                } catch (e) { console.error("JVC Enhancer: Impossible de charger la page N-1.", e); }
            }
            // Fusionner et dédoublonner par contenu HTML pour être plus précis
            const allMessages = [...cachedPosts, ...pagePosts, ...prevPagePosts];
            const uniqueMessages = Array.from(new Map(allMessages.map(item => [item.html, item])).values());
            return uniqueMessages;
        }

        parseMessagesFromDocument(doc, isApi = false) {
            const messages = [];
            const sel = { msg: isApi ? '.post' : '.bloc-message-forum', pseudo: isApi ? '.bloc-pseudo-msg' : '.bloc-pseudo-msg', content: isApi ? '.message' : '.txt-msg' };
            doc.querySelectorAll(sel.msg).forEach(msg => {
                if (msg.querySelector(sel.pseudo)?.textContent.trim() === this.currentUser) {
                    const contentElement = msg.querySelector(sel.content);
                    if (contentElement) {
                        const clone = contentElement.cloneNode(true);
                        clone.querySelectorAll('blockquote.blockquote-jv').forEach(bq => bq.remove());
                        messages.push({
                            text: this.normalizeText(clone.textContent),
                            html: this.normalizeHtml(clone.innerHTML)
                        });
                    }
                }
            });
            return messages;
        }

        addPostListener() {
            const postButton = document.querySelector('.postMessage');
            if (postButton) {
                postButton.addEventListener('click', () => {
                    const messageTextarea = document.querySelector('#message_topic, .messageEditor__edit');
                    if (messageTextarea && this.topicId) {
                        // On sauvegarde le texte brut, la normalisation se fera à la lecture
                        this.saveUserPostToCache(messageTextarea.value);
                    }
                }, true);
            }
        }

        saveUserPostToCache(rawText) {
            try {
                const cache = JSON.parse(localStorage.getItem(this.CACHE_KEY_POSTS)) || {};
                if (!cache[this.topicId]) cache[this.topicId] = [];
                // On stocke le texte brut
                cache[this.topicId].unshift(rawText);
                cache[this.topicId] = cache[this.topicId].slice(0, this.MAX_CACHED_POSTS_PER_TOPIC);
                localStorage.setItem(this.CACHE_KEY_POSTS, JSON.stringify(cache));
            } catch (e) { console.error("JVC Enhancer: Erreur de sauvegarde du cache.", e); }
        }

        loadUserPostsFromCache() {
            try {
                const cache = JSON.parse(localStorage.getItem(this.CACHE_KEY_POSTS)) || {};
                const posts = cache[this.topicId] || [];
                // On transforme le texte brut en objets {text, html}
                return posts.map(post => ({
                    text: this.normalizeText(post),
                    html: this.normalizeHtml(post)
                }));
            } catch (e) { console.error("JVC Enhancer: Erreur de lecture du cache.", e); return []; }
        }

        isUserMentioned(author, el) {
            if (!this.currentUser || author === this.currentUser) return false;
            const content = el.querySelector('.txt-msg');
            if (!content) return false;

            const normText = this.normalizeText(content.textContent);
            if (normText.includes(this.normalizeText(this.currentUser))) return true;

            for (const quote of el.querySelectorAll('blockquote.blockquote-jv')) {
                const cleanQuoteHtml = this.normalizeHtml(quote.innerHTML);

                if (this.currentUserMessages.some(myMsg => {
                    if (myMsg.text && this.normalizeText(quote.textContent).includes(myMsg.text)) return true;
                    if (!myMsg.text && myMsg.html && cleanQuoteHtml.includes(myMsg.html)) return true;
                    return false;
                })) {
                    return true;
                }
            }
            return false;
        }

        normalizeText(text) { return text ? text.toLowerCase().replace(/\s+/g, ' ').trim() : ''; }

        normalizeHtml(html) {
            if (!html) return '';
            // CORRECTION: La regex ne supprime que la date, pas le <p>
            return html.replace(/Le .+? :<br>/i, '').replace(/\s+/g, ' ').trim();
        }

        getCurrentUsername() { return document.querySelector('.headerAccount__pseudo')?.textContent.trim() || null; }

        injectStyles() {
            const styles = `
                .jvc-enhancer-mention { background-color: rgba(230, 195, 92, 0.07); border-left: 2px solid rgba(230, 195, 92, 0.75); }
                .jvc-enhancer-op-mention { background-color: rgba(157, 105, 212, 0.07); border-left: 2px solid rgba(157, 105, 212, 0.75); }
                .jvc-enhancer-self { box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.2); }
                html:not(.theme-light) .jvc-enhancer-self { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1); }
                .jvc-enhancer-ddb-reported { background-color: rgba(220, 53, 69, 0.07) !important; }
                .jvc-enhancer-ddb-administered { background-color: rgba(25, 135, 84, 0.07) !important; }

                .jvc-enhancer-pemt {
                    position: relative;
                    padding-right: 20px;
                }

                .jvc-enhancer-pemt::before {
                    content: '';
                    position: absolute;
                    right: 5px;
                    width: 10px;
                    height: 3px;
                    background-color: var(--pemt-color);
                    z-index: 1;
                }

                .jvc-enhancer-pemt::after {
                    content: '';
                    position: absolute;
                    right: 5px;
                    width: 2px;
                    background-color: var(--pemt-color);
                    z-index: 1;
                }

                .pemt-start::before { top: 50%; }
                .pemt-start::after {
                    top: 50%;
                    bottom: 0;
                }

                .pemt-middle::before { display: none; } /* Pas de ligne horizontale */
                .pemt-middle::after {
                    top: 0;
                    bottom: 0;
                }

                .pemt-end::before { bottom: 50%; }
                .pemt-end::after {
                    top: 0;
                    bottom: 50%;
                }

                .bloc-avatar-msg { position: relative; }
                .jvc-enhancer-avatar-badge {
                    position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); z-index: 2;
                    padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 5px;
                    white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px;
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
                }

                .badge-mention { background-color: rgba(230, 195, 92, 0.4); color: #212529; }
                .badge-op-mention { background-color: rgba(157, 105, 212, 0.4); color: white; }
                .badge-op, .badge-self, .badge-pemt { background-color: rgba(80, 80, 80, 0.5); color: rgba(255, 255, 255, 0.8); }
            `;
            const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet);
        }

        processMessages() {
            const messages = Array.from(document.querySelectorAll('.bloc-message-forum'));
            messages.forEach(el => {
                const author = el.querySelector('.bloc-pseudo-msg')?.textContent.trim();
                if (!author) return;
                const isOp = this.highlightRules[0].condition(author), isMention = this.highlightRules[1].condition(author, el), isSelf = this.highlightRules[2].condition(author);
                let hClass = '', bText = '', bClass = '';
                if (isSelf) { hClass = 'jvc-enhancer-self'; bText = 'MOI'; bClass = 'badge-self'; }
                else if (isOp && isMention) { hClass = 'jvc-enhancer-op-mention'; bText = 'OP'; bClass = 'badge-op-mention'; }
                else if (isOp) { hClass = 'jvc-enhancer-op'; bText = 'OP'; bClass = 'badge-op'; }
                else if (isMention) { hClass = 'jvc-enhancer-mention'; bText = 'CITÉ'; bClass = 'badge-mention'; }
                if (hClass) el.classList.add(hClass);
                if (bText) this.createAvatarBadge(el, bText, bClass);
            });
            this.processPEMT(messages);
        }

        processPEMT(messages) {
            let pemtGroupIndex = 0;
            for (let i = 0; i < messages.length - 1; i++) {
                const currentTimeEl = messages[i].querySelector('.bloc-date-msg a');
                const time = currentTimeEl?.textContent.match(/\d{2}:\d{2}:\d{2}$/)?.[0];

                if (!time) continue;

                const group = [messages[i]];
                for (let j = i + 1; j < messages.length; j++) {
                    const nextTimeEl = messages[j].querySelector('.bloc-date-msg a');
                    if (nextTimeEl?.textContent.match(/\d{2}:\d{2}:\d{2}$/)?.[0] === time) {
                        group.push(messages[j]);
                    } else {
                        break;
                    }
                }

                if (group.length > 1) {
                    const color = this.pemtColors[pemtGroupIndex % this.pemtColors.length];

                    group.forEach((msg, index) => {
                        msg.classList.add('jvc-enhancer-pemt');
                        msg.style.setProperty('--pemt-color', color);

                        if (index === 0) {
                            msg.classList.add('pemt-start');
                        } else if (index === group.length - 1) {
                            msg.classList.add('pemt-end');
                        } else {
                            msg.classList.add('pemt-middle');
                        }

                        if (!msg.querySelector('.jvc-enhancer-avatar-badge')) {
                            this.createAvatarBadge(msg, 'PEMT', 'badge-pemt');
                        }
                    });

                    pemtGroupIndex++;
                    i += group.length - 1; // On saute les messages déjà traités
                }
            }
        }
        createAvatarBadge(el, text, bClass, color = null) {
            if (el.querySelector(`.jvc-enhancer-avatar-badge`)) return;
            const container = el.querySelector('.bloc-avatar-msg');
            if (!container) return;
            const badge = document.createElement('span');
            badge.className = `jvc-enhancer-avatar-badge ${bClass}`;
            badge.textContent = text;
            if (color) badge.style.backgroundColor = `${color}66`;
            container.appendChild(badge);
        }

        async checkFirstMessagesReportStatus() {
            if (this.currentPage !== 1) return;
            const firstTwoMessages = Array.from(document.querySelectorAll('.bloc-message-forum')).slice(0, 2);
            const ddbCache = JSON.parse(sessionStorage.getItem(this.CACHE_KEY_DDB)) || {};
            for (const messageElement of firstTwoMessages) {
                const reportIcon = messageElement.querySelector('.picto-msg-exclam');
                const messageId = messageElement.dataset.id;
                if (!reportIcon || !messageId) continue;
                if (ddbCache[messageId]) { this.applyDdbHighlight(messageElement, ddbCache[messageId]); continue; }
                const selectorUrl = reportIcon.dataset.selector;
                if (!selectorUrl) continue;
                const reportUrl = new URL(selectorUrl, "https://www.jeuxvideo.com").href;
                try {
                    const responseText = await this.fetchUrlContent(reportUrl);
                    let status = 'clean';
                    if (responseText.includes("Ce contenu a déjà été signalé")) status = 'reported';
                    else if (responseText.includes("Ce contenu a déjà été modéré")) status = 'administered';
                    if (status !== 'clean') { ddbCache[messageId] = status; this.applyDdbHighlight(messageElement, status); }
                } catch (error) { console.error(`JVC Enhancer: Erreur DDB pour msg ${messageId}`, error); }
            }
            sessionStorage.setItem(this.CACHE_KEY_DDB, JSON.stringify(ddbCache));
        }

        applyDdbHighlight(messageElement, status) {
            messageElement.classList.remove('jvc-enhancer-mention', 'jvc-enhancer-op-mention');
            if (status === 'reported') {
                messageElement.classList.add('jvc-enhancer-ddb-reported');
            } else if (status === 'administered') {
                messageElement.classList.add('jvc-enhancer-ddb-administered');
            }
        }
    }

    new JVCTopicEnhancer();
})();