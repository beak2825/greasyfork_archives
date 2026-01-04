// ==UserScript==
// @name         QuickNav for Google AI Studio
// @namespace    http://tampermonkey.net/
// @version      21.1
// @description  Restores classic chat navigation in Google AI Studio, adding essential UI controls for precise, message-by-message browsing, and a powerful message index menu for efficient conversation navigation. This script operates entirely locally in your browser, does not collect any personal data, and makes no requests to external servers.
// @author       Axl_script
// @homepageURL  https://greasyfork.org/en/scripts/548346-quicknav-for-google-ai-studio
// @contributionURL https://nowpayments.io/donation/axl_script
// @match        https://aistudio.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548346/QuickNav%20for%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/548346/QuickNav%20for%20Google%20AI%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Handles text manipulation actions (Clear, Copy, Paste) for the prompt area.
    const PromptActions = {
        undoStack: [],
        redoStack: [],
        textareaRef: null,

        getTextarea() {
            const el = document.querySelector('ms-prompt-box textarea') || document.querySelector('.prompt-box-container textarea');
            if (el && el !== this.textareaRef) {
                this.textareaRef = el;
                this.attachHistoryListeners(el);
            }
            return el;
        },

        attachHistoryListeners(textarea) {
            textarea.addEventListener('keydown', (e) => {
                const isCtrl = e.ctrlKey || e.metaKey;
                
                if (isCtrl && e.code === 'KeyZ' && !e.shiftKey) {
                    this.handleUndo(textarea);
                }
                
                if (isCtrl && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
                    this.handleRedo(textarea);
                }
            });
        },

        handleUndo(textarea) {
            const preUndoValue = textarea.value;
            setTimeout(() => {
                if (textarea.value === preUndoValue && this.undoStack.length > 0) {
                    const snapshot = this.undoStack.pop();
                    this.pushToStack(this.redoStack, this.getSnapshot(textarea));
                    this.applySnapshot(textarea, snapshot);
                    this.showToast("Undo");
                }
            }, 0);
        },

        handleRedo(textarea) {
            const preRedoValue = textarea.value;
            setTimeout(() => {
                if (textarea.value === preRedoValue && this.redoStack.length > 0) {
                    const snapshot = this.redoStack.pop();
                    this.pushToStack(this.undoStack, this.getSnapshot(textarea));
                    this.applySnapshot(textarea, snapshot);
                    this.showToast("Redo");
                }
            }, 0);
        },

        getSnapshot(textarea) {
            return {
                value: textarea.value,
                selectionStart: textarea.selectionStart,
                selectionEnd: textarea.selectionEnd,
                scrollTop: textarea.scrollTop
            };
        },

        pushToStack(stack, snapshot) {
            if (stack.length > 20) stack.shift();
            stack.push(snapshot);
        },

        applySnapshot(textarea, snapshot) {
            if (!snapshot) return;
            textarea.value = snapshot.value;
            textarea.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
            textarea.scrollTop = snapshot.scrollTop;
            this.triggerInputEvent(textarea);
        },

        triggerInputEvent(textarea) {
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        },

        // Called before any destructive action (Paste/Clear)
        recordAction(textarea) {
            this.pushToStack(this.undoStack, this.getSnapshot(textarea));
            this.redoStack = [];
        },

        clear(isDoubleClick = false) {
            const textarea = this.getTextarea();
            if (!textarea) return;

            if (!isDoubleClick) {
                this.showToast("Double-click to clear");
                return;
            }

            textarea.focus();
            
            this.recordAction(textarea);

            textarea.value = '';
            textarea.style.height = ''; 
            this.triggerInputEvent(textarea);
            
            this.showToast("Cleared");
            
            if (typeof PromptResizer !== 'undefined') {
                PromptResizer.forceState(PromptResizer.STATE_MIN);
            }
        },

        async copy() {
            const textarea = this.getTextarea();
            if (!textarea) return;
            
            textarea.focus();
            const text = textarea.value;
            
            if (!text) {
                this.showToast("Nothing to copy");
                return;
            }

            try {
                await navigator.clipboard.writeText(text);
                this.showToast("Copied");
            } catch (err) {
                console.error('Copy failed: ', err);
                this.showToast("Copy Error");
            }
        },

        async paste() {
            window.focus(); 

            let clipText;
            try {
                clipText = await navigator.clipboard.readText();
            } catch (err) {
                console.error("Clipboard Read Error:", err);
                this.showToast("⚠️ Paste failed. Allow Clipboard access in Site Settings (🔒).");
                return;
            }

            if (!clipText) {
                this.showToast("Clipboard Empty");
                return;
            }

            const textarea = this.getTextarea();
            if (!textarea) return;

            textarea.focus();

            this.recordAction(textarea);

            try {
                textarea.setRangeText(clipText, textarea.selectionStart, textarea.selectionEnd, 'end');
                this.triggerInputEvent(textarea);
                textarea.scrollTop = textarea.scrollHeight;
                this.showToast("Pasted");
            } catch (e) {
                console.error("Insertion failed:", e);
                this.showToast("Paste Error");
                this.undoStack.pop();
            }
        },

        showToast(message) {
            let toast = document.querySelector('.quicknav-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'quicknav-toast';
                const container = document.getElementById('chat-nav-container');
                if (container) container.appendChild(toast);
                else document.body.appendChild(toast);
            }
            toast.textContent = message;
            
            if (message.includes('⚠️')) {
                toast.style.backgroundColor = '#d93025'; 
                toast.style.color = '#ffffff';
            } else {
                toast.style.backgroundColor = '';
                toast.style.color = '';
            }

            toast.classList.remove('show');
            void toast.offsetWidth; 
            toast.classList.add('show');
        }
    };

// Manages chat state, scrolling, observers, and turn indexing.
    const ChatController = {
        allTurns: [],
        currentIndex: -1,
        menuFocusedIndex: -1,
        isDownButtonAtEndToggle: false,
        JUMP_DISTANCE: 5,
        isScrollingProgrammatically: false,
        isQueueProcessing: false,
        isUnstickingFromBottom: false,
        originalScrollTop: 0,
        originalCurrentIndex: -1,
        loadingQueue: [],
        totalToLoad: 0,
        chatObserver: null,
        visibilityObserver: null,
        scrollObserver: null,
        chatContainerElement: null,
        currentScrollContainer: null,
        holdTimeout: null,
        holdInterval: null,
        isBottomHoldActive: false,
        bottomHoldTimeout: null,
        bottomHoldInterval: null,
        debouncedBuildTurnIndex: null,
        visibleTurnContainers: new Set(),
        isScrollUpdateQueued: false,
        boundHandlePageScroll: null,
        boundHandleRealtimeScrollSync: null,
        isScrollLocked: false,
        scrollLockInterval: null,
        scrollLockTimeout: null,

// Initialize the controller with reduced debounce for snappier updates
        init(chatContainer) {
            this.chatContainerElement = chatContainer;
            this.debouncedBuildTurnIndex = this.debounce(this.buildTurnIndex.bind(this), 300);
            
            this.boundHandlePageScroll = UIManager.handlePageScroll.bind(UIManager);
            this.boundHandleRealtimeScrollSync = this.handleRealtimeScrollSync.bind(this);

            this.initializeChatObserver(this.chatContainerElement);
            this.attachScrollListeners();
            this.buildTurnIndex();

            document.addEventListener('mousedown', this.stopBottomHold.bind(this), true);
            document.addEventListener('wheel', this.stopBottomHold.bind(this), true);
            document.addEventListener('click', this.handleEditClick.bind(this), true);
        },

        attachScrollListeners() {
            const newScrollContainer = this.chatContainerElement?.querySelector('ms-autoscroll-container');
            
            if (this.currentScrollContainer === newScrollContainer && newScrollContainer?.isConnected) {
                return;
            }

            if (this.currentScrollContainer) {
                this.currentScrollContainer.removeEventListener('scroll', this.boundHandlePageScroll);
                this.currentScrollContainer.removeEventListener('scroll', this.boundHandleRealtimeScrollSync);
            }

            if (newScrollContainer) {
                this.currentScrollContainer = newScrollContainer;
                this.currentScrollContainer.addEventListener('scroll', this.boundHandlePageScroll);
                this.currentScrollContainer.addEventListener('scroll', this.boundHandleRealtimeScrollSync);
                this.handleRealtimeScrollSync();
            } else {
                this.currentScrollContainer = null;
            }
        },

        destroy() {
            if (this.chatObserver) this.chatObserver.disconnect();
            if (this.visibilityObserver) this.visibilityObserver.disconnect();
            if (this.scrollObserver) this.scrollObserver.disconnect();
            this.chatObserver = null;
            this.visibilityObserver = null;
            this.scrollObserver = null;
            this.clearScrollLock();

            if (this.currentScrollContainer) {
                this.currentScrollContainer.removeEventListener('scroll', this.boundHandlePageScroll);
                this.currentScrollContainer.removeEventListener('scroll', this.boundHandleRealtimeScrollSync);
            }
            this.currentScrollContainer = null;

            this.chatContainerElement = null;
            this.allTurns = [];
            this.currentIndex = -1;
            this.menuFocusedIndex = -1;
            document.removeEventListener('mousedown', this.stopBottomHold.bind(this), true);
            document.removeEventListener('wheel', this.stopBottomHold.bind(this), true);
            document.removeEventListener('click', this.handleEditClick.bind(this), true);
        },

        clearScrollLock() {
            clearInterval(this.scrollLockInterval);
            clearTimeout(this.scrollLockTimeout);
            this.scrollLockInterval = null;
            this.scrollLockTimeout = null;
            this.isScrollLocked = false;
        },

        handleEditClick(event) {
            const editButton = event.target.closest('ms-chat-turn .toggle-edit-button');
            if (!editButton || this.isScrollLocked) return;

            const turnElement = event.target.closest('ms-chat-turn');
            const scrollContainer = this.currentScrollContainer;
            if (!turnElement || !scrollContainer) return;

            const buttonIcon = editButton.querySelector('.ms-button-icon-symbol');
            const isEnteringEditMode = buttonIcon && buttonIcon.textContent.trim() !== 'done_all';
            if (!isEnteringEditMode) return;

            const savedScrollTop = scrollContainer.scrollTop;
            this.isScrollLocked = true;

            const immediateClearLock = () => {
                this.clearScrollLock();
                scrollContainer.removeEventListener('wheel', immediateClearLock, { once: true });
                scrollContainer.removeEventListener('mousedown', immediateClearLock, { once: true });
            };

            scrollContainer.addEventListener('wheel', immediateClearLock, { once: true });
            scrollContainer.addEventListener('mousedown', immediateClearLock, { once: true });

            this.scrollLockInterval = setInterval(() => {
                if (scrollContainer.scrollTop !== savedScrollTop) {
                    scrollContainer.scrollTop = savedScrollTop;
                }
            }, 15);

            this.scrollLockTimeout = setTimeout(() => {
                immediateClearLock();
            }, 5000);
        },

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

// Sets up the MutationObserver to track chat additions, removals, and content updates.
        initializeChatObserver(container) {
            const observerCallback = (mutationsList) => {
                let shouldRebuildIndex = false;
                let checkScrollConnection = false;

                for (const mutation of mutationsList) {
                    const target = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
                    
                    if (!target) continue;
                    if (target.closest('ms-thought-chunk')) continue;
                    if (target.classList.contains('model-run-time-pill') || target.closest('.model-run-time-pill')) continue;

                    if (mutation.type === 'childList') {
                        checkScrollConnection = true;

                        if (mutation.addedNodes.length > 0) {
                            shouldRebuildIndex = true;
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1) { 
                                    const codeBlock = node.matches('ms-code-block') ? node : node.querySelector('ms-code-block');
                                    if (codeBlock) {
                                        const parentTurn = codeBlock.closest('ms-chat-turn');
                                        if (parentTurn) CodeBlockNavigator.processTurns([parentTurn]);
                                    }
                                }
                            }
                        }
                        if (mutation.removedNodes.length > 0) {
                            shouldRebuildIndex = true;
                        }
                    } 
                    else if (mutation.type === 'characterData') {
                        shouldRebuildIndex = true;
                    }
                }

                if (checkScrollConnection) {
                    this.attachScrollListeners();
                }

                if (shouldRebuildIndex) {
                    this.debouncedBuildTurnIndex();
                }
            };

            if (this.chatObserver) this.chatObserver.disconnect();
            this.chatObserver = new MutationObserver(observerCallback);
            this.chatObserver.observe(container, { childList: true, subtree: true, characterData: true });
        },

        setupVisibilityObserver() {
            if (this.visibilityObserver) {
                this.visibilityObserver.disconnect();
            }
            const scrollContainer = this.currentScrollContainer || document.querySelector('ms-autoscroll-container');
            if (!scrollContainer || this.allTurns.length === 0) {
                return;
            }

            const observerCallback = (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const visibleTurnElement = entry.target;
                        const turnIndex = this.allTurns.findIndex(t => t === visibleTurnElement);
                        if (turnIndex === -1) continue;

                        CodeBlockNavigator.processTurns([visibleTurnElement]);

                        const turnObject = this.allTurns[turnIndex];
                        const newContent = UIManager.getTextFromTurn(visibleTurnElement, true);

                        if (newContent.source === 'fallback') {
                            continue;
                        }

                        const hasValidCache = turnObject.cachedContent && !turnObject.isFallbackContent;
                        const isAnUpgrade = hasValidCache && turnObject.cachedContent.source === 'scrollbar' && newContent.source === 'dom';
                        const contentContainer = turnObject.querySelector('.turn-content');
                        const contentHasChanged = hasValidCache && Math.abs(turnObject.cachedContent.full.length - newContent.full.length) > 5;

                        if (!hasValidCache || isAnUpgrade || contentHasChanged) {
                            turnObject.cachedContent = newContent;
                            turnObject.isFallbackContent = false;
                            UIManager.updateMenuItemContent(turnIndex);
                        }
                    }
                }
            };

            this.visibilityObserver = new IntersectionObserver(observerCallback, {
                root: scrollContainer,
                rootMargin: "0px",
            });

            this.allTurns.forEach(turn => this.visibilityObserver.observe(turn));
        },

        setupScrollObserver() {
            if (this.scrollObserver) this.scrollObserver.disconnect();
            const scrollContainer = this.currentScrollContainer || document.querySelector('ms-autoscroll-container');
            if (!scrollContainer || this.allTurns.length === 0) return;

            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.visibleTurnContainers.add(entry.target);
                    } else {
                        this.visibleTurnContainers.delete(entry.target);
                    }
                });
            };

            this.scrollObserver = new IntersectionObserver(observerCallback, {
                root: scrollContainer,
                rootMargin: "0px",
                threshold: 0
            });

            this.allTurns.forEach(turn => {
                const container = turn.querySelector('.chat-turn-container');
                if (container) {
                    this.scrollObserver.observe(container);
                }
            });
        },

        handleRealtimeScrollSync() {
            if (this.isScrollUpdateQueued) {
                return;
            }
            this.isScrollUpdateQueued = true;

            requestAnimationFrame(() => {
                if (this.isScrollingProgrammatically || this.isQueueProcessing || this.isUnstickingFromBottom || this.isScrollLocked) {
                    this.isScrollUpdateQueued = false;
                    return;
                }

                if (!this.currentScrollContainer || !this.currentScrollContainer.isConnected) {
                    this.attachScrollListeners();
                }

                const scrollContainer = this.currentScrollContainer;
                if (!scrollContainer) {
                    this.isScrollUpdateQueued = false;
                    return;
                }

                const activationLine = scrollContainer.clientHeight * 0.3;
                let bestMatch = { element: null, minDistance: Infinity };
                
                const containersToCheck = this.visibleTurnContainers.size > 0 
                    ? this.visibleTurnContainers 
                    : this.allTurns.map(t => t.querySelector('.chat-turn-container')).filter(Boolean);

                containersToCheck.forEach(containerElement => {
                    const rect = containerElement.getBoundingClientRect();
                    const distance = Math.abs(rect.top - activationLine);

                    if (distance < bestMatch.minDistance) {
                        bestMatch = { element: containerElement, minDistance: distance };
                    }
                });

                if (bestMatch.element) {
                    const parentTurn = bestMatch.element.closest('ms-chat-turn');
                    if (parentTurn) {
                        const bestMatchIndex = this.allTurns.indexOf(parentTurn);
                        if (bestMatchIndex !== -1 && this.currentIndex !== bestMatchIndex) {
                            UIManager.updateHighlight(this.currentIndex, bestMatchIndex);
                            this.currentIndex = bestMatchIndex;

                            const currentTurn = this.allTurns[bestMatchIndex];
                            if (currentTurn && (!currentTurn.cachedContent || currentTurn.isFallbackContent)) {
                                const newContent = UIManager.getTextFromTurn(currentTurn, true);
                                if (newContent.source !== 'fallback') {
                                    currentTurn.cachedContent = newContent;
                                    currentTurn.isFallbackContent = false;
                                }
                            }
                            UIManager.updateMenuItemContent(bestMatchIndex);

                            UIManager.updateCounterDisplay();
                            UIManager.showBadge();
                            UIManager.updateScrollPercentage();
                            UIManager.hideBadge();
                        }
                    }
                }
                this.isScrollUpdateQueued = false;
            });
        },

        // Validates if a turn belongs to the user using the persistent data-turn-role attribute.
        isUserPrompt(turnElement) {
            const container = turnElement.querySelector('.virtual-scroll-container') || turnElement.querySelector('.chat-turn-container');
            return container?.dataset.turnRole === 'User' || !!turnElement.querySelector('.chat-turn-container.user');
        },

        // Robust check that completely ignores Thought chunks
        _hasMeaningfulContent(contentContainer) {
            if (!contentContainer) return false;
            
            const walker = document.createTreeWalker(
                contentContainer,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName.toUpperCase();
                            
                            // STRICT REJECT: Do not even look inside thoughts.
                            if (tagName === 'MS-THOUGHT-CHUNK') return NodeFilter.FILTER_REJECT;
                            
                            if (tagName === 'MS-CHAT-TURN-OPTIONS' || 
                                node.classList.contains('author-label') || 
                                node.classList.contains('turn-separator')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            
                            if (tagName === 'MS-CODE-BLOCK' || (tagName === 'IMG' && !node.classList.contains('thinking-progress-icon'))) {
                                return NodeFilter.FILTER_ACCEPT; 
                            }
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.nodeType === Node.ELEMENT_NODE) {
                     if (node.tagName === 'MS-CODE-BLOCK') return true;
                     if (node.tagName === 'IMG' && !node.classList.contains('thinking-progress-icon')) return true;
                }
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    return true;
                }
            }
            return false;
        },

        // Analyzes all chat turns and builds a clean index, strictly filtering out technical thought processes.
        buildTurnIndex() {
            const freshTurns = Array.from(document.querySelectorAll('ms-chat-turn')).filter(turn => {
                const scrollContainer = turn.querySelector('.virtual-scroll-container');
                const mainContainer = turn.querySelector('.chat-turn-container');
                
                const isUser = (scrollContainer?.dataset.turnRole === 'User') || mainContainer?.classList.contains('user');
                if (isUser) return true;

                const isModel = (scrollContainer?.dataset.turnRole === 'Model') || mainContainer?.classList.contains('model');
                if (isModel) {
                    const contentContainer = turn.querySelector('.turn-content');
                    const hasFooter = !!turn.querySelector('.turn-footer');
                    const hasEditBtn = !!turn.querySelector('.toggle-edit-button');
                    const isGenerating = !!turn.querySelector('loading-indicator');

                    if (!hasFooter && !hasEditBtn && !isGenerating) {
                        if (contentContainer && contentContainer.querySelector('ms-thought-chunk')) {
                            if (!this._hasMeaningfulContent(contentContainer)) return false;
                        }
                        if (!contentContainer || (contentContainer.children.length === 0 && contentContainer.textContent.trim() === '')) {
                            return false;
                        }
                    }

                    if (contentContainer?.querySelector('ms-thought-chunk')) {
                        if (!this._hasMeaningfulContent(contentContainer)) return false;
                    }

                    return true;
                }
                return false;
            });

            if (freshTurns.length !== this.allTurns.length || !this.arraysEqual(this.allTurns, freshTurns)) {
                const freshTurnsSet = new Set(freshTurns);
                this.allTurns.forEach(oldTurn => {
                    if (!freshTurnsSet.has(oldTurn)) {
                        const container = oldTurn.querySelector('.chat-turn-container');
                        if (container) {
                            container.classList.remove('prompt-turn-highlight', 'response-turn-highlight');
                        }
                    }
                });

                const contentCache = new Map();
                this.allTurns.forEach(turn => {
                    if (turn.id && turn.cachedContent) {
                        contentCache.set(turn.id, { content: turn.cachedContent, isFallback: turn.isFallbackContent });
                    }
                });

                this.allTurns = freshTurns;

                this.allTurns.forEach(turn => {
                    if (turn.id && contentCache.has(turn.id)) {
                        const cachedData = contentCache.get(turn.id);
                        turn.cachedContent = cachedData.content;
                        turn.isFallbackContent = cachedData.isFallback;
                    } else {
                        turn.cachedContent = null;
                        turn.isFallbackContent = false;
                    }
                });

                if (this.allTurns.length === 0) {
                    this.currentIndex = -1;
                } else if (this.currentIndex >= this.allTurns.length) {
                    this.currentIndex = this.allTurns.length - 1;
                    UIManager.updateHighlight(-1, this.currentIndex);
                } else {
                    UIManager.updateHighlight(-1, this.currentIndex);
                }

                this.setupScrollObserver();
                this.setupVisibilityObserver();

                const menuContainer = document.getElementById('chat-nav-menu-container');
                if (menuContainer && menuContainer.classList.contains('visible')) {
                    UIManager.populateNavMenu();
                    const menuList = document.getElementById('chat-nav-menu');
                    const items = menuList ? menuList.querySelectorAll('.chat-nav-menu-item') : [];
                    if (items.length > 0) {
                         const safeFocusIndex = Math.min(this.menuFocusedIndex, items.length - 1);
                         UIManager.updateMenuFocus(items, Math.max(0, safeFocusIndex), false);
                    }
                }

                if (this.allTurns.length > 0 && this.currentIndex === -1) {
                    setTimeout(() => this.handleRealtimeScrollSync(), 150);
                }
            }

            CodeBlockNavigator.processTurns(this.allTurns);
            UIManager.updateCounterDisplay();
        },

        arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        },

        setupHoldableButton(button, action) {
            const HOLD_DELAY = 300;
            const HOLD_INTERVAL = 100;
            let isHolding = false;
            const stopHold = () => {
                clearTimeout(this.holdTimeout);
                clearInterval(this.holdInterval);
                this.holdInterval = null;
                isHolding = false;
            };
            button.addEventListener('click', (e) => {
                if (!isHolding) {
                    action();
                }
                stopHold();
            });
            button.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                isHolding = true;
                this.holdTimeout = setTimeout(() => {
                    if (isHolding) {
                        this.holdInterval = setInterval(action, HOLD_INTERVAL);
                    }
                }, HOLD_DELAY);
            });
            button.addEventListener('mouseup', stopHold);
            button.addEventListener('mouseleave', stopHold);
        },

        scrollToAbsoluteTop() {
            const scrollContainer = this.currentScrollContainer;
            if (!scrollContainer) return;
            UIManager.hideBadge(0, true);
            this.isScrollingProgrammatically = true;
            scrollContainer.scrollTo({
                top: 0,
                behavior: this.holdInterval ? 'auto' : 'smooth'
            });
            if (this.allTurns.length > 0 && this.currentIndex !== 0) {
                UIManager.updateHighlight(this.currentIndex, 0);
                this.currentIndex = 0;
                UIManager.updateCounterDisplay();
            }
            setTimeout(() => {
                this.isScrollingProgrammatically = false;
                UIManager.showBadge();
                UIManager.updateScrollPercentage();
                UIManager.hideBadge(2000);
                this.focusChatContainer();
            }, this.holdInterval ? 50 : 800);
        },

        waitForTurnToStabilize(turnElement, timeout = 1000) {
            return new Promise((resolve, reject) => {
                let lastRect = turnElement.getBoundingClientRect();
                let stableChecks = 0;
                const STABLE_CHECKS_REQUIRED = 3;
                const CHECK_INTERVAL = 100;
                const intervalId = setInterval(() => {
                    if (!turnElement || !turnElement.isConnected) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        return reject(new Error('Target element was removed from DOM.'));
                    }
                    const currentRect = turnElement.getBoundingClientRect();
                    if (currentRect.top !== lastRect.top || currentRect.height !== lastRect.height) {
                        lastRect = currentRect;
                        stableChecks = 0;
                    } else {
                        stableChecks++;
                    }
                    if (stableChecks >= STABLE_CHECKS_REQUIRED) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        resolve();
                    }
                }, CHECK_INTERVAL);
                const timeoutId = setTimeout(() => {
                    clearInterval(intervalId);
                    reject(new Error(`Element stabilization timed out.`));
                }, timeout);
            });
        },

        async scrollToTurn(index, blockPosition = 'center') {
            const targetTurn = this.allTurns[index];
            if (!targetTurn) {
                this.isScrollingProgrammatically = false;
                return;
            }
            this.isScrollingProgrammatically = true;
            const isSmooth = !this.isQueueProcessing && !this.holdInterval;
            const scrollContainer = this.currentScrollContainer;
            if (!scrollContainer) {
                this.isScrollingProgrammatically = false;
                return;
            }
            try {
                const verticalOffset = scrollContainer.clientHeight * 0.35;

                let initialTargetScrollTop;
                if (blockPosition === 'end') {
                    initialTargetScrollTop = targetTurn.offsetTop - (scrollContainer.clientHeight - targetTurn.offsetHeight);
                } else {
                    initialTargetScrollTop = targetTurn.offsetTop - verticalOffset;
                }

                scrollContainer.scrollTop = Math.max(0, Math.min(initialTargetScrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight));
                await this.waitForTurnToStabilize(targetTurn, 4000);

                let finalTargetScrollTop;
                if (blockPosition === 'end') {
                    finalTargetScrollTop = targetTurn.offsetTop - (scrollContainer.clientHeight - targetTurn.offsetHeight);
                } else {
                    finalTargetScrollTop = targetTurn.offsetTop - verticalOffset;
                }

                finalTargetScrollTop = Math.max(0, finalTargetScrollTop);
                finalTargetScrollTop = Math.min(finalTargetScrollTop, scrollContainer.scrollHeight - scrollContainer.clientHeight);
                scrollContainer.scrollTo({
                    top: finalTargetScrollTop,
                    behavior: isSmooth ? 'smooth' : 'auto'
                });
                const timeoutDuration = isSmooth ? 800 : 50;
                await new Promise(resolve => setTimeout(resolve, timeoutDuration));
            } catch (error) {} finally {
                this.isScrollingProgrammatically = false;
                UIManager.showBadge();
                UIManager.updateScrollPercentage();
                UIManager.hideBadge(2000);
            }
        },

        async navigateToIndex(newIndex, blockPosition = 'center') {
            if (newIndex < 0 || newIndex >= this.allTurns.length) return;
            UIManager.hideBadge(0, true);
            const oldIndex = this.currentIndex;
            if (newIndex < this.allTurns.length - 1) this.isDownButtonAtEndToggle = false;
            this.currentIndex = newIndex;

            UIManager.updateHighlight(oldIndex, newIndex);
            UIManager.updateCounterDisplay();
            await this.scrollToTurn(newIndex, blockPosition);

            const targetTurn = this.allTurns[newIndex];
            if (targetTurn) {
                const newContent = UIManager.getTextFromTurn(targetTurn, true);
                if (newContent.source !== 'fallback') {
                    targetTurn.cachedContent = newContent;
                    targetTurn.isFallbackContent = false;
                    UIManager.updateMenuItemContent(newIndex);
                }
            }

            UIManager.updateScrollPercentage();
            this.focusChatContainer();
        },

        async forceScrollToTop(scrollContainer) {
            return new Promise(resolve => {
                this.isScrollingProgrammatically = true;
                const firstTurn = this.allTurns[0];
                if (!firstTurn) {
                    this.isScrollingProgrammatically = false;
                    return resolve();
                }
                let attempts = 0;
                const maxAttempts = 15;
                const attemptScroll = () => {
                    attempts++;
                    scrollContainer.scrollTop = 0;
                    setTimeout(() => {
                        if (scrollContainer.scrollTop < 50 || attempts >= maxAttempts) {
                            firstTurn.scrollIntoView({ behavior: 'auto', block: 'start' });
                            setTimeout(() => { this.isScrollingProgrammatically = false; resolve(); }, 100);
                        } else {
                            attemptScroll();
                        }
                    }, 150);
                };
                attemptScroll();
            });
        },

// Initiates the sequence to scroll through and index all messages
        async startDynamicMenuLoading() {
            if (this.isQueueProcessing) return;
            const loadButton = document.getElementById('chat-nav-load-button');
            const scrollContainer = this.currentScrollContainer;
            if (!scrollContainer || !loadButton) return;
            const menuList = document.getElementById('chat-nav-menu');
            const menuItems = menuList ? menuList.querySelectorAll('.chat-nav-menu-item') : [];
            if (menuList && menuItems.length > 0) {
                const targetIndex = this.currentIndex > -1 ? this.currentIndex : 0;
                UIManager.updateMenuFocus(menuItems, targetIndex, true);
                menuList.focus({ preventScroll: true });
            }
            this.originalCurrentIndex = this.currentIndex;
            this.originalScrollTop = scrollContainer.scrollTop;
            this.loadingQueue = this.allTurns
                .map((turn, index) => ({ turn, index, menuItem: menuItems[index] }))
                .filter(item => {
                    const text = item.menuItem.dataset.tooltip;
                    return text.endsWith('...') || text === 'Content unloaded. Click "Load All" to retrieve.' || !item.turn.cachedContent || item.turn.isFallbackContent;
                });
            if (this.loadingQueue.length > 0) {
                this.totalToLoad = this.loadingQueue.length;
                loadButton.disabled = true;
                loadButton.classList.add('loading-active');
                this.isQueueProcessing = true;
                const isAtBottom = scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight - 5;
                if (isAtBottom) {
                    this.isUnstickingFromBottom = true;
                    scrollContainer.scrollTop -= 10;
                    await new Promise(resolve => setTimeout(resolve, 50));
                    this.isUnstickingFromBottom = false;
                }
                await this.forceScrollToTop(scrollContainer);
                this.processLoadingQueue();
            } else {
                const statusIndicator = document.getElementById('chat-nav-loader-status');
                if (statusIndicator) {
                    statusIndicator.textContent = 'All loaded.';
                    statusIndicator.classList.add('google-text-flash');
                    statusIndicator.addEventListener('animationend', () => {
                        statusIndicator.classList.remove('google-text-flash');
                    }, { once: true });
                }
            }
        },

        pollForContent(turn) {
            return new Promise((resolve, reject) => {
                const maxAttempts = 50;
                let attempts = 0;
                const interval = setInterval(() => {
                    if (!this.isQueueProcessing) {
                        clearInterval(interval);
                        return reject(new Error('Loading stopped by user.'));
                    }
                    const content = UIManager.getTextFromTurn(turn, true);
                    if (content.source === 'dom') {
                        clearInterval(interval);
                        resolve(content);
                    } else if (++attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error('Content polling timed out.'));
                    }
                }, 100);
            });
        },

        async processLoadingQueue() {
            const statusIndicator = document.getElementById('chat-nav-loader-status');
            const menuItems = document.querySelectorAll('#chat-nav-menu .chat-nav-menu-item');
            while (this.loadingQueue.length > 0 && this.isQueueProcessing) {
                const itemsProcessed = this.totalToLoad - this.loadingQueue.length;
                if (statusIndicator) {
                    statusIndicator.textContent = `Loading ${itemsProcessed + 1} of ${this.totalToLoad}...`;
                    statusIndicator.classList.remove('google-text-flash');
                }
                const itemToLoad = this.loadingQueue.shift();
                const { turn, index, menuItem } = itemToLoad;
                const textSpan = menuItem.querySelector('.menu-item-text');
                if (!turn || !textSpan) continue;
                menuItem.classList.add('loading-in-progress');
                UIManager.updateMenuFocus(menuItems, index, true);
                try {
                    await this.scrollToTurn(index, 'center');
                    const newContent = await this.pollForContent(turn);
                    turn.cachedContent = newContent;
                    turn.isFallbackContent = false;
                    const truncatedText = (newContent.display.length > 200) ? newContent.display.substring(0, 197) + '...' : newContent.display;
                    textSpan.textContent = truncatedText;
                    menuItem.dataset.tooltip = newContent.full.replace(/\s+/g, ' ');
                } catch (error) {
                    console.error(`Failed to load item ${index + 1}:`, error.message);
                    textSpan.textContent = '[Error]';
                } finally {
                    menuItem.classList.remove('loading-in-progress');
                }
            }
            this.isQueueProcessing = false;
            const scrollContainer = this.currentScrollContainer;
            if (this.originalCurrentIndex > -1 && this.originalCurrentIndex < this.allTurns.length) {
                await this.navigateToIndex(this.originalCurrentIndex, 'center');
            } else if (scrollContainer) {
                this.isScrollingProgrammatically = true;
                scrollContainer.scrollTo({ top: this.originalScrollTop, behavior: 'smooth' });
                await new Promise(resolve => setTimeout(() => {
                    this.isScrollingProgrammatically = false;
                    resolve();
                }, 800));
            }
            const menuContainer = document.getElementById('chat-nav-menu-container');
            const loadButton = document.getElementById('chat-nav-load-button');
            if (loadButton) {
                loadButton.disabled = false;
                loadButton.classList.remove('loading-active');
            }
            if (statusIndicator) {
                if (this.loadingQueue.length > 0) {
                    statusIndicator.textContent = 'Stopped.';
                    statusIndicator.classList.remove('google-text-flash');
                } else {
                    statusIndicator.textContent = 'Done.';
                    statusIndicator.classList.add('google-text-flash');
                    statusIndicator.addEventListener('animationend', () => {
                        statusIndicator.classList.remove('google-text-flash');
                    }, { once: true });
                }
            }

            if (menuContainer && menuContainer.classList.contains('visible')) {
                const items = menuContainer.querySelectorAll('.chat-nav-menu-item');
                UIManager.updateMenuFocus(items, this.currentIndex, true);
                const menuList = document.getElementById('chat-nav-menu');
                if (menuList) {
                    menuList.focus({ preventScroll: true });
                }
            } else {
                this.focusChatContainer();
            }
        },

        stopDynamicMenuLoading() {
            if (!this.isQueueProcessing) return;
            this.isQueueProcessing = false;
            const loadButton = document.getElementById('chat-nav-load-button');
            if (loadButton) {
                loadButton.disabled = false;
                loadButton.classList.remove('loading-active');
            }
            const statusIndicator = document.getElementById('chat-nav-loader-status');
            if (statusIndicator) {
                statusIndicator.textContent = 'Stopped.';
                statusIndicator.classList.remove('google-text-animated');
            }
        },

        stopBottomHold() {
            if (!this.isBottomHoldActive) return;
            this.isBottomHoldActive = false;
            clearInterval(this.bottomHoldInterval);
            this.bottomHoldInterval = null;
            const btnBottom = document.getElementById('nav-bottom');
            if (btnBottom) {
                btnBottom.classList.remove('auto-click-active');
            }
        },

        focusChatContainer() {
            const scrollContainer = this.currentScrollContainer;
            if (scrollContainer) {
                scrollContainer.tabIndex = -1;
                scrollContainer.focus({ preventScroll: true });
            }
        },

        // Focuses the main chat input field with visual feedback.
        focusPromptInput() {
            const targetElement = document.querySelector('ms-prompt-box textarea') || document.querySelector('textarea[placeholder="Start typing a prompt"]');
            
            if (!targetElement) {
                console.error("QuickNav: Prompt input textarea not found.");
                return;
            }

            const originalTransition = targetElement.style.transition;
            const originalShadow = targetElement.style.boxShadow;
            
            targetElement.style.transition = 'box-shadow 0.2s ease-out';
            targetElement.style.boxShadow = '0 0 0 2px var(--ms-primary, #8ab4f8)';
            
            setTimeout(() => {
                targetElement.style.boxShadow = originalShadow;
                setTimeout(() => {
                    targetElement.style.transition = originalTransition;
                }, 200);
            }, 400);

            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            
            targetElement.dispatchEvent(mouseDownEvent);
            targetElement.dispatchEvent(mouseUpEvent);
            targetElement.dispatchEvent(clickEvent);
            targetElement.focus();
        }
    };

// Optimized utility for non-blocking CSS injection
    const SafeStyleInjector = {
        inject(id, cssContent) {
            if (document.getElementById(id)) return;
            requestAnimationFrame(() => {
                const style = document.createElement('style');
                style.id = id;
                style.textContent = cssContent;
                (document.head || document.documentElement).appendChild(style);
            });
        }
    };

// Manages global visual settings: Font Size, Chat Width, and Hover Delay.
    const StyleManager = {
        FONT: {
            DEFAULT: 14,
            MIN: 10,
            MAX: 32,
            STEP: 1,
            current: 14,
            enabled: true,
            storageKey: 'quicknav_font_size',
            enableKey: 'quicknav_font_enabled'
        },
        WIDTH: {
            DEFAULT: 1000,
            MIN: 600,
            MAX: 8000,
            STEP: 10,
            current: 1000,
            enabled: false,
            storageKey: 'quicknav_chat_width',
            enableKey: 'quicknav_width_enabled'
        },
        HOVER_MENU: {
            enabled: false,
            storageKey: 'quicknav_hover_menu_enabled',
            enableKey: 'quicknav_hover_menu_enabled'
        },
        HOVER_DELAY: {
            DEFAULT: 250,
            MIN: 0,
            MAX: 5000,
            STEP: 50,
            current: 250,
            enabled: true,
            storageKey: 'quicknav_hover_delay'
        },

        styleElement: null,
        widthResizeObserver: null,
        observedElement: null,
        
        ui: {
            fontIndicator: null,
            fontControls: null,
            fontBtnMinus: null,
            fontBtnPlus: null,
            fontCheckbox: null, 
            widthIndicator: null,
            widthControls: null,
            widthBtnMinus: null,
            widthBtnPlus: null,
            widthCheckbox: null,
            hoverCheckbox: null,
            hoverControls: null,
            hoverIndicator: null,
            hoverBtnMinus: null,
            hoverBtnPlus: null
        },

// Init method with Smart Resize Listener.
        init() {
            this.loadSettings();
            this.injectStaticBaseStyles();
            
            setTimeout(() => {
                this.setupWidthObserver();
                this.applyVariableUpdates(); 
            }, 500);
            
            let resizeTimeout;
            window.addEventListener('resize', () => {
                const dropdown = document.getElementById('quicknav-settings-dropdown');
                if (!dropdown || !dropdown.classList.contains('visible')) return;
                if (!resizeTimeout) {
                    resizeTimeout = setTimeout(() => {
                        resizeTimeout = null;
                        this.updateUIDisplay();
                    }, 150);
                }
            });
        },

        setupWidthObserver() {
            const target = document.querySelector('.chat-session-content') || document.querySelector('ms-chunk-editor');
            
            if (target && target !== this.observedElement) {
                if (this.widthResizeObserver) this.widthResizeObserver.disconnect();
                
                this.observedElement = target;
                
                this.widthResizeObserver = new ResizeObserver((entries) => {
                    if (!this.WIDTH.enabled) {
                        for (const entry of entries) {
                            if (entry.contentBoxSize) {
                                const width = entry.contentRect.width;
                                document.documentElement.style.setProperty('--quicknav-chat-width', `${width}px`);
                            }
                        }
                    }
                });
                
                this.widthResizeObserver.observe(target);
            }
        },

        measureAndSyncWidth() {
            if (this.observedElement) {
                const rect = this.observedElement.getBoundingClientRect();
                document.documentElement.style.setProperty('--quicknav-chat-width', `${rect.width}px`);
            }
        },

// --- ROBUST STORAGE SYSTEM ---
        _read(key, defaultValue) {
            let value;
            try {
                if (typeof GM_getValue === 'function') {
                    value = GM_getValue(key);
                }
            } catch (e) {
                console.warn(`[QuickNav] GM_getValue failed for ${key}, trying localStorage.`);
            }

            if (value === undefined) {
                try {
                    const local = localStorage.getItem(key);
                    if (local !== null) {
                        if (local === 'true') value = true;
                        else if (local === 'false') value = false;
                        else if (!isNaN(Number(local))) value = Number(local);
                        else value = local;
                    }
                } catch (e) {
                    console.error(`[QuickNav] localStorage failed for ${key}:`, e);
                }
            }

            return value !== undefined ? value : defaultValue;
        },

        _write(key, value) {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, value);
                }
            } catch (e) {
                console.warn(`[QuickNav] GM_setValue failed for ${key}, falling back.`);
            }

            try {
                localStorage.setItem(key, String(value));
            } catch (e) {
                console.error(`[QuickNav] localStorage write failed:`, e);
            }
        },

// Loads settings from storage.
        loadSettings() {
            const savedFont = this._read(this.FONT.storageKey, this.FONT.DEFAULT);
            this.FONT.current = parseInt(savedFont, 10) || this.FONT.DEFAULT;
            
            const savedFontEnabled = this._read(this.FONT.enableKey, true);
            this.FONT.enabled = !!savedFontEnabled;

            const savedWidth = this._read(this.WIDTH.storageKey, this.WIDTH.DEFAULT);
            this.WIDTH.current = parseInt(savedWidth, 10) || this.WIDTH.DEFAULT;

            const savedWidthEnabled = this._read(this.WIDTH.enableKey, false);
            this.WIDTH.enabled = !!savedWidthEnabled;

            const savedHover = this._read(this.HOVER_MENU.storageKey, false);
            this.HOVER_MENU.enabled = !!savedHover;

            const savedHoverDelay = this._read(this.HOVER_DELAY.storageKey, this.HOVER_DELAY.DEFAULT);
            this.HOVER_DELAY.current = parseInt(savedHoverDelay, 10);
            if (isNaN(this.HOVER_DELAY.current)) this.HOVER_DELAY.current = this.HOVER_DELAY.DEFAULT;
        },

// Injects static CSS rules utilizing CSS Variables via SafeStyleInjector
        injectStaticBaseStyles() {
            const css = `
                :root {
                    --quicknav-font-size: ${this.FONT.DEFAULT}px;
                    --quicknav-chat-width: ${this.WIDTH.DEFAULT}px;
                }

                /* Apply font size to chat content (Reading view) */
                html.quicknav-font-active .turn-content, 
                html.quicknav-font-active .turn-content p, 
                html.quicknav-font-active .turn-content li, 
                html.quicknav-font-active .turn-content span,
                html.quicknav-font-active .turn-content .cmark-node, 
                html.quicknav-font-active .turn-content pre, 
                html.quicknav-font-active .turn-content code { 
                    font-size: var(--quicknav-font-size) !important; 
                    line-height: 1.6 !important;
                }

                /* Apply CALCULATED font size (Chat Size - 1px) to Input Fields (Editing view) */
                html.quicknav-font-active .turn-content textarea,
                html.quicknav-font-active .prompt-box-container textarea,
                html.quicknav-font-active .prompt-input-wrapper-container textarea,
                html.quicknav-font-active ms-prompt-input-wrapper textarea { 
                    font-size: calc(var(--quicknav-font-size) - 1px) !important; 
                    line-height: 1.6 !important;
                }

                /* Apply font size to Navigation Menu and Tooltips */
                html.quicknav-font-active .chat-nav-menu-item,
                html.quicknav-font-active #quicknav-custom-tooltip {
                    font-size: var(--quicknav-font-size) !important;
                }

                html.quicknav-width-active .chat-session-content,
                html.quicknav-width-active .prompt-box-container,
                html.quicknav-width-active ms-prompt-box,
                html.quicknav-width-active .prompt-input-wrapper-container {
                    max-width: var(--quicknav-chat-width) !important;
                }
            `;
            SafeStyleInjector.inject('quicknav-font-styles', css);
        },

        applyVariableUpdates() {
            const root = document.documentElement;

            if (this.FONT.enabled) {
                root.style.setProperty('--quicknav-font-size', `${this.FONT.current}px`);
                root.classList.add('quicknav-font-active');
            } else {
                root.classList.remove('quicknav-font-active');
            }

            if (this.WIDTH.enabled) {
                root.style.setProperty('--quicknav-chat-width', `${this.WIDTH.current}px`);
                root.classList.add('quicknav-width-active');
            } else {
                root.classList.remove('quicknav-width-active');
                this.measureAndSyncWidth();
            }

            this.updateUIDisplay();
        },

        applyStyles() {
            this.applyVariableUpdates();
        },

        getSafeWidthMax() {
            const scrollContainer = document.querySelector('ms-autoscroll-container') || document.body;
            return Math.floor(scrollContainer.clientWidth - 24);
        },

        updateUIDisplay() {
            if (this.ui.fontIndicator) {
                this.ui.fontIndicator.textContent = `${this.FONT.current}`;
                this.updateIndicatorStyle(this.ui.fontIndicator, this.FONT);
            }
            if (this.ui.fontCheckbox) {
                this.ui.fontCheckbox.checked = this.FONT.enabled;
            }
            if (this.ui.fontControls) {
                if (this.FONT.enabled) {
                    this.ui.fontControls.classList.remove('disabled');
                    if (this.ui.fontBtnMinus) this.ui.fontBtnMinus.disabled = (this.FONT.current <= this.FONT.MIN);
                    if (this.ui.fontBtnPlus) this.ui.fontBtnPlus.disabled = (this.FONT.current >= this.FONT.MAX);
                    const btnReset = this.ui.fontControls.querySelector('.quicknav-tool-indicator');
                    if (btnReset) btnReset.disabled = false;
                } else {
                    this.ui.fontControls.classList.add('disabled');
                    this.ui.fontControls.querySelectorAll('button').forEach(btn => btn.disabled = true);
                }
            }

            if (this.ui.widthIndicator) {
                this.ui.widthIndicator.textContent = `${this.WIDTH.current}`;
                this.updateIndicatorStyle(this.ui.widthIndicator, this.WIDTH);
            }
            if (this.ui.widthCheckbox) {
                this.ui.widthCheckbox.checked = this.WIDTH.enabled;
            }
            if (this.ui.widthControls) {
                if (this.WIDTH.enabled) {
                    this.ui.widthControls.classList.remove('disabled');
                    const safeMax = this.getSafeWidthMax();
                    if (this.ui.widthBtnMinus) this.ui.widthBtnMinus.disabled = (this.WIDTH.current <= this.WIDTH.MIN);
                    if (this.ui.widthBtnPlus) {
                        this.ui.widthBtnPlus.disabled = (this.WIDTH.current >= this.WIDTH.MAX || this.WIDTH.current >= safeMax);
                    }
                    const btnReset = this.ui.widthControls.querySelector('.quicknav-tool-indicator');
                    if (btnReset) btnReset.disabled = false;
                } else {
                    this.ui.widthControls.classList.add('disabled');
                    this.ui.widthControls.querySelectorAll('button').forEach(btn => btn.disabled = true);
                }
            }

            if (this.ui.hoverCheckbox) {
                this.ui.hoverCheckbox.checked = this.HOVER_MENU.enabled;
            }
            if (this.ui.hoverIndicator) {
                this.ui.hoverIndicator.textContent = `${this.HOVER_DELAY.current}`;
                this.ui.hoverIndicator.title = `Reset delay to ${this.HOVER_DELAY.DEFAULT}ms`;
                
                const proxyConfig = {
                    current: this.HOVER_DELAY.current,
                    DEFAULT: this.HOVER_DELAY.DEFAULT,
                    enabled: this.HOVER_MENU.enabled
                };
                this.updateIndicatorStyle(this.ui.hoverIndicator, proxyConfig);
            }
            if (this.ui.hoverControls) {
                if (this.HOVER_MENU.enabled) {
                    this.ui.hoverControls.classList.remove('disabled');
                    if (this.ui.hoverBtnMinus) this.ui.hoverBtnMinus.disabled = (this.HOVER_DELAY.current <= this.HOVER_DELAY.MIN);
                    if (this.ui.hoverBtnPlus) this.ui.hoverBtnPlus.disabled = (this.HOVER_DELAY.current >= this.HOVER_DELAY.MAX);
                    const btnReset = this.ui.hoverControls.querySelector('.quicknav-tool-indicator');
                    if (btnReset) btnReset.disabled = false;
                } else {
                    this.ui.hoverControls.classList.add('disabled');
                    this.ui.hoverControls.querySelectorAll('button').forEach(btn => btn.disabled = true);
                }
            }
        },

        updateIndicatorStyle(element, config) {
            if (config.current !== config.DEFAULT && config.enabled) {
                element.style.fontWeight = '500';
                element.style.backgroundColor = 'rgba(138, 180, 248, 0.1)';
            } else {
                element.style.fontWeight = '500';
                element.style.backgroundColor = 'transparent';
            }
        },

        toggleSetting(type, state) {
            if (type === 'HOVER_MENU') {
                this.HOVER_MENU.enabled = state;
                this._write(this.HOVER_MENU.enableKey, state);
                this.updateUIDisplay();
                return;
            }

            this[type].enabled = state;
            this._write(this[type].enableKey, state);
            this.applyVariableUpdates();
        },

        changeValue(type, delta) {
            if (type === 'HOVER_DELAY') {
                 if (!this.HOVER_MENU.enabled) return;
                 const config = this.HOVER_DELAY;
                 let newValue = config.current + delta;
                 if (newValue >= config.MIN && newValue <= config.MAX) {
                     config.current = newValue;
                     this._write(config.storageKey, config.current);
                     this.updateUIDisplay();
                 }
                 return;
            }

            const config = this[type];
            if (!config.enabled) return;

            let newValue = config.current + delta;

            if (type === 'WIDTH') {
                const safeVisibleWidth = this.getSafeWidthMax();
                
                if (delta > 0) {
                    if (config.current >= safeVisibleWidth) return; 
                    if (newValue > safeVisibleWidth) newValue = safeVisibleWidth;
                }
                
                if (delta < 0 && config.current > safeVisibleWidth) {
                    newValue = safeVisibleWidth - config.STEP; 
                }
            }

            if (newValue >= config.MIN && newValue <= config.MAX) {
                const action = () => {
                    config.current = newValue;
                    this._write(config.storageKey, config.current);
                    this.applyVariableUpdates();
                };

                if (type === 'FONT') {
                    this.preserveScrollPosition(action);
                } else {
                    action();
                }
            }
        },

        resetValue(type) {
            if (type === 'HOVER_DELAY') {
                if (!this.HOVER_MENU.enabled) return;
                this.HOVER_DELAY.current = this.HOVER_DELAY.DEFAULT;
                this._write(this.HOVER_DELAY.storageKey, this.HOVER_DELAY.DEFAULT);
                this.updateUIDisplay();
                return;
            }

            const config = this[type];
            if (!config.enabled) return;
            
            const action = () => {
                config.current = config.DEFAULT;
                this._write(config.storageKey, config.current);
                this.applyVariableUpdates();
            };

            if (type === 'FONT') {
                this.preserveScrollPosition(action);
            } else {
                action();
            }
        },

        preserveScrollPosition(actionCallback) {
            const scrollContainer = document.querySelector('ms-autoscroll-container');
            if (!scrollContainer) {
                actionCallback();
                return;
            }

            const originalOverflowAnchor = scrollContainer.style.overflowAnchor;
            scrollContainer.style.overflowAnchor = 'none';
            const containerRect = scrollContainer.getBoundingClientRect();
            const readingLine = containerRect.top + (containerRect.height * 0.5); 
            
            const turns = document.querySelectorAll('ms-chat-turn');
            let anchor = null;
            let closestDist = Infinity;

            for (const turn of turns) {
                const rect = turn.getBoundingClientRect();
                
                if (rect.top > containerRect.bottom + 500) break;
                if (rect.bottom < containerRect.top - 500) continue;

                if (rect.top <= readingLine && rect.bottom > readingLine) {
                    anchor = turn;
                    break;
                }

                const distTop = Math.abs(rect.top - readingLine);
                const distBottom = Math.abs(rect.bottom - readingLine);
                const distance = Math.min(distTop, distBottom);
                
                if (distance < closestDist) {
                    closestDist = distance;
                    anchor = turn;
                }
            }

            if (!anchor) {
                actionCallback();
                scrollContainer.style.overflowAnchor = originalOverflowAnchor;
                return;
            }

            const oldRect = anchor.getBoundingClientRect();
            const offsetInElement = readingLine - oldRect.top;
            const ratio = oldRect.height > 0 ? offsetInElement / oldRect.height : 0;

            actionCallback();

            const _ = scrollContainer.scrollHeight; 
            
            const newRect = anchor.getBoundingClientRect();
            const newOffsetInElement = newRect.height * ratio;
            const desiredTop = readingLine - newOffsetInElement;
            
            const diff = newRect.top - desiredTop;

            if (Math.abs(diff) > 1) {
                scrollContainer.scrollTop += diff;
            }

            scrollContainer.style.overflowAnchor = originalOverflowAnchor;
        },

        setupAutoRepeat(button, action) {
            let timeout, interval;
            const REPEAT_DELAY = 400; 
            const REPEAT_RATE = 50;   

            const start = (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();

                if (button.disabled) return;
                
                action();

                timeout = setTimeout(() => {
                    interval = setInterval(() => {
                        if (button.disabled) {
                            stop();
                        } else {
                            action();
                        }
                    }, REPEAT_RATE);
                }, REPEAT_DELAY);
            };

            const stop = () => {
                clearTimeout(timeout);
                clearInterval(interval);
            };

            button.addEventListener('mousedown', start);
            button.addEventListener('mouseup', stop);
            button.addEventListener('mouseleave', stop);
            button.addEventListener('click', (e) => e.stopPropagation());
        },

        createSvgIcon(pathData) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "18");
            svg.setAttribute("height", "18");
            svg.setAttribute("fill", "currentColor");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            svg.appendChild(path);
            return svg;
        },

        createRow(type, iconPath, minusPath, plusPath, titleGroup, titleMinus, titlePlus, titleReset) {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'quicknav-control-row';

            const leftGroup = document.createElement('div');
            leftGroup.className = 'quicknav-row-label';
            leftGroup.title = titleGroup; 

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'quicknav-checkbox';
            checkbox.checked = this[type].enabled;
            checkbox.addEventListener('click', (e) => e.stopPropagation());
            checkbox.addEventListener('change', (e) => this.toggleSetting(type, e.target.checked));
            
            if (type === 'FONT') this.ui.fontCheckbox = checkbox;
            if (type === 'WIDTH') this.ui.widthCheckbox = checkbox;

            const labelIcon = this.createSvgIcon(iconPath);
            labelIcon.classList.add('quicknav-icon-label');
            
            leftGroup.append(checkbox, labelIcon);

            const container = document.createElement('div');
            container.className = 'quicknav-toolbar-group';
            if (type === 'FONT') this.ui.fontControls = container;
            if (type === 'WIDTH') this.ui.widthControls = container;

            const btnMinus = document.createElement('button');
            btnMinus.className = 'quicknav-tool-btn';
            btnMinus.title = titleMinus;
            btnMinus.appendChild(this.createSvgIcon(minusPath));
            this.setupAutoRepeat(btnMinus, () => this.changeValue(type, -this[type].STEP));
            
            if (type === 'FONT') this.ui.fontBtnMinus = btnMinus;
            if (type === 'WIDTH') this.ui.widthBtnMinus = btnMinus;

            const btnReset = document.createElement('button');
            btnReset.className = 'quicknav-tool-btn quicknav-tool-indicator';
            btnReset.title = titleReset;
            btnReset.textContent = `${this[type].current}`;
            btnReset.addEventListener('click', (e) => { e.stopPropagation(); this.resetValue(type); });
            
            if (type === 'FONT') this.ui.fontIndicator = btnReset;
            if (type === 'WIDTH') this.ui.widthIndicator = btnReset;

            const btnPlus = document.createElement('button');
            btnPlus.className = 'quicknav-tool-btn';
            btnPlus.title = titlePlus;
            btnPlus.appendChild(this.createSvgIcon(plusPath));
            this.setupAutoRepeat(btnPlus, () => this.changeValue(type, this[type].STEP));

            if (type === 'FONT') this.ui.fontBtnPlus = btnPlus;
            if (type === 'WIDTH') this.ui.widthBtnPlus = btnPlus;

            container.append(btnMinus, btnReset, btnPlus);
            
            rowWrapper.append(leftGroup, container);
            return rowWrapper;
        },

// Generates the settings dropdown UI with Font, Width, and Hover options.
        createControls() {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            
            const fontIcon = 'M5 4v3h5.5v12h3V7H19V4z'; 
            const fontMinus = 'M19 13H5v-2h14v2z';
            const fontPlus = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
            const fontRow = this.createRow('FONT', fontIcon, fontMinus, fontPlus, 
                'Enable custom font size', 'Decrease font size (Alt + -)', 'Increase font size (Alt + +)', 'Reset font size (Alt + 0)');
            
            const widthIconSimple = 'M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10z'; 
            const widthMinus = 'M19 13H5v-2h14v2z';
            const widthPlus = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
            const widthRow = this.createRow('WIDTH', widthIconSimple, widthMinus, widthPlus, 
                'Enable custom chat width', 'Decrease chat width (Shift + Alt + -)', 'Increase chat width (Shift + Alt + +)', 'Reset chat width (Shift + Alt + 0)');
            
            const hoverRow = document.createElement('div');
            hoverRow.className = 'quicknav-control-row';
            
            const hoverLeft = document.createElement('div');
            hoverLeft.className = 'quicknav-row-label';
            hoverLeft.title = 'Open navigation menu on hover';
            
            const hoverCheckbox = document.createElement('input');
            hoverCheckbox.type = 'checkbox';
            hoverCheckbox.className = 'quicknav-checkbox';
            hoverCheckbox.checked = this.HOVER_MENU.enabled;
            hoverCheckbox.addEventListener('click', (e) => e.stopPropagation());
            hoverCheckbox.addEventListener('change', (e) => this.toggleSetting('HOVER_MENU', e.target.checked));
            this.ui.hoverCheckbox = hoverCheckbox;
            
            const hoverIconPath = 'M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74z m9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z';
            const hoverIcon = this.createSvgIcon(hoverIconPath);
            hoverIcon.classList.add('quicknav-icon-label');
            
            hoverLeft.append(hoverCheckbox, hoverIcon);

            const hoverControls = document.createElement('div');
            hoverControls.className = 'quicknav-toolbar-group';
            this.ui.hoverControls = hoverControls;

            const delayMinus = 'M19 13H5v-2h14v2z';
            const delayPlus = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';

            const btnMinus = document.createElement('button');
            btnMinus.className = 'quicknav-tool-btn';
            btnMinus.title = 'Decrease delay';
            btnMinus.appendChild(this.createSvgIcon(delayMinus));
            this.setupAutoRepeat(btnMinus, () => this.changeValue('HOVER_DELAY', -this.HOVER_DELAY.STEP));
            this.ui.hoverBtnMinus = btnMinus;

            const btnReset = document.createElement('button');
            btnReset.className = 'quicknav-tool-btn quicknav-tool-indicator';
            btnReset.title = `Reset delay to ${this.HOVER_DELAY.DEFAULT}ms`;
            btnReset.textContent = `${this.HOVER_DELAY.current}`;
            btnReset.addEventListener('click', (e) => { e.stopPropagation(); this.resetValue('HOVER_DELAY'); });
            this.ui.hoverIndicator = btnReset;

            const btnPlus = document.createElement('button');
            btnPlus.className = 'quicknav-tool-btn';
            btnPlus.title = 'Increase delay';
            btnPlus.appendChild(this.createSvgIcon(delayPlus));
            this.setupAutoRepeat(btnPlus, () => this.changeValue('HOVER_DELAY', this.HOVER_DELAY.STEP));
            this.ui.hoverBtnPlus = btnPlus;

            hoverControls.append(btnMinus, btnReset, btnPlus);
            hoverRow.append(hoverLeft, hoverControls);
            
            container.append(fontRow, widthRow, hoverRow);
            
            this.updateUIDisplay();
            return container;
        }
    };

// Manages tag colors with a Juicy Material-style palette
    const TagManager = {
        STORAGE_KEY: 'quicknav_tag_colors',
        colors: {},
        PALETTE: [
            '#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', 
            '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', 
            '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', 
            '#FFF59D', '#FFE082', '#FFCC80', '#FFAB91'  
        ],
        init() {
            const raw = StyleManager._read(this.STORAGE_KEY, '{}');
            try {
                this.colors = JSON.parse(raw);
            } catch (e) {
                this.colors = {};
            }
        },
        getColor(tagName) {
            if (!this.colors[tagName]) {
                const randomColor = this.PALETTE[Math.floor(Math.random() * this.PALETTE.length)];
                this.setColor(tagName, randomColor);
            }
            return this.colors[tagName];
        },
        setColor(tagName, color) {
            this.colors[tagName] = color;
            this.save();
        },
        save() {
            StyleManager._write(this.STORAGE_KEY, JSON.stringify(this.colors));
        },
        getExportData() {
            return this.colors;
        },
        mergeImportData(newColors) {
            if (!newColors) return;
            this.colors = { ...this.colors, ...newColors };
            this.save();
        }
    };

// Manages the Prompt Library: storage, UI rendering, editing, and insertion logic.
    const PromptLibrary = {
        STORAGE_KEY: 'quicknav_prompt_library',
        data: [],
        currentTagFilter: 'All',
        currentSearchQuery: '',
        focusedIndex: -1,
        
// Loads prompts and initializes tag colors
        load() {
            TagManager.init();
            const raw = StyleManager._read(this.STORAGE_KEY, '[]');
            try {
                this.data = JSON.parse(raw);
                if (!Array.isArray(this.data)) this.data = [];
            } catch (e) {
                console.error('[PromptLibrary] Corrupt data, resetting.', e);
                this.data = [];
            }
        },

        save() {
            StyleManager._write(this.STORAGE_KEY, JSON.stringify(this.data));
            this.renderList();
            this.renderTags();
        },

        addPrompt(title, tagsStr, content) {
            const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
            const newPrompt = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                title: title.trim() || 'Untitled',
                tags: tags,
                content: content
            };
            this.data.unshift(newPrompt);
            
            if (tags.length > 0) this.currentTagFilter = tags[0];
            else this.currentTagFilter = 'All';

            this.save();
        },

        updatePrompt(id, title, tagsStr, content) {
            const idx = this.data.findIndex(p => p.id === id);
            if (idx !== -1) {
                const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
                this.data[idx] = {
                    ...this.data[idx],
                    title: title.trim() || 'Untitled',
                    tags: tags,
                    content: content
                };
                
                if (tags.length > 0) this.currentTagFilter = tags[0];
                
                this.save();
            }
        },

        deletePrompt(id) {
            this.data = this.data.filter(p => p.id !== id);
            this.save();
        },

        // --- INSERTION LOGIC ---
        insertAtCursor(text) {
            const textarea = PromptActions.getTextarea();
            if (!textarea) return;

            textarea.focus();
            PromptActions.recordAction(textarea);

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.setRangeText(text, start, end, 'end');

            PromptActions.triggerInputEvent(textarea);
            textarea.scrollTop = textarea.scrollHeight;
            
            this.closeModal();
            PromptActions.showToast("Prompt inserted");
        },

// Creates modal DOM with search clear functionality and layout improvements
        createModalElements() {
            if (document.getElementById('quicknav-lib-modal')) return;

            const backdrop = document.createElement('div');
            backdrop.id = 'quicknav-lib-backdrop';
            backdrop.className = 'quicknav-modal-backdrop';
            backdrop.onclick = (e) => {
                if (e.target === backdrop) this.closeModal();
            };

            const modal = document.createElement('div');
            modal.id = 'quicknav-lib-modal';
            modal.className = 'quicknav-modal';
            
            modal.addEventListener('keydown', (e) => this.handleKeyDown(e));

            const header = document.createElement('div');
            header.className = 'lib-header';

            const topRow = document.createElement('div');
            topRow.className = 'lib-header-top';

            const searchContainer = document.createElement('div');
            searchContainer.className = 'lib-search-container';
            const searchIcon = StyleManager.createSvgIcon('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search prompts...';
            searchInput.className = 'lib-search-input';
            
            const clearBtn = document.createElement('span');
            clearBtn.textContent = '×';
            clearBtn.className = 'lib-search-clear';
            clearBtn.onclick = () => {
                searchInput.value = '';
                this.currentSearchQuery = '';
                clearBtn.style.display = 'none';
                this.renderList();
                searchInput.focus();
            };

            searchInput.addEventListener('input', (e) => {
                this.currentSearchQuery = e.target.value.toLowerCase();
                clearBtn.style.display = this.currentSearchQuery ? 'block' : 'none';
                this.renderList();
            });

            searchContainer.append(searchIcon, searchInput, clearBtn);

            const actionsGroup = document.createElement('div');
            actionsGroup.className = 'lib-actions-group';

            const importBtn = document.createElement('button');
            importBtn.className = 'lib-btn-secondary';
            importBtn.title = 'Import / Export';
            importBtn.appendChild(StyleManager.createSvgIcon('M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z'));
            importBtn.onclick = () => this.openImportExport();

            const newBtn = document.createElement('button');
            newBtn.className = 'lib-btn-primary';
            newBtn.appendChild(StyleManager.createSvgIcon('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'));
            newBtn.appendChild(document.createTextNode(' New'));
            newBtn.onclick = () => this.openEditor();

            actionsGroup.append(importBtn, newBtn);
            topRow.append(searchContainer, actionsGroup);

            const tagsContainer = document.createElement('div');
            tagsContainer.id = 'lib-tags-container';
            tagsContainer.className = 'lib-tags-row';

            header.append(topRow, tagsContainer);

            const listContainer = document.createElement('div');
            listContainer.id = 'lib-content-list';
            listContainer.className = 'lib-content-list';

            modal.append(header, listContainer);
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
        },

        handleKeyDown(e) {
            const list = document.getElementById('lib-content-list');
            if (!list) return;
            const cards = Array.from(list.querySelectorAll('.lib-card'));

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.focusedIndex = Math.min(this.focusedIndex + 1, cards.length - 1);
                this.updateFocus(cards);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
                this.updateFocus(cards);
            } else if (e.key === 'Enter') {
                if (document.getElementById('lib-overlay')?.classList.contains('visible')) return;
                
                if (this.focusedIndex >= 0 && cards[this.focusedIndex]) {
                    e.preventDefault();
                    cards[this.focusedIndex].click();
                }
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const tags = Array.from(document.querySelectorAll('.lib-chip'));
                if (tags.length === 0) return;
                let currentTagIdx = tags.findIndex(t => t.classList.contains('active'));
                
                if (e.key === 'ArrowRight') currentTagIdx = (currentTagIdx + 1) % tags.length;
                else currentTagIdx = (currentTagIdx - 1 + tags.length) % tags.length;
                
                tags[currentTagIdx].click();
                tags[currentTagIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else if (e.key === 'Escape') {
                this.closeModal();
            }
        },

// Updates visual focus state and scrolls element into view
        updateFocus(cards) {
            cards.forEach((card, i) => {
                if (i === this.focusedIndex) {
                    card.classList.add('focused');
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    if (card._content) {
                        this.showTooltip(card._content);
                    }
                } else {
                    card.classList.remove('focused');
                }
            });
        },

// Renders chips with elevated active state and muted inactive state
        renderTags() {
            const container = document.getElementById('lib-tags-container');
            if (!container) return;
            container.replaceChildren();
            const allTags = new Set(['All']);
            this.data.forEach(p => p.tags.forEach(t => allTags.add(t)));
            const isDark = document.body.classList.contains('dark-theme');
            allTags.forEach(tag => {
                const chip = document.createElement('button');
                chip.className = `lib-chip ${this.currentTagFilter === tag ? 'active' : ''}`;
                chip.textContent = tag;
                chip.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                if (tag === 'All') {
                    if (this.currentTagFilter === 'All') {
                        chip.style.backgroundColor = '#1a73e8';
                        chip.style.color = '#ffffff';
                        chip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
                        chip.style.transform = 'scale(1.05)';
                        chip.style.fontWeight = '600';
                        chip.style.zIndex = '2';
                    } else {
                        chip.style.backgroundColor = isDark ? '#3c4043' : '#e8eaed';
                        chip.style.color = isDark ? '#e8eaed' : '#3c4043';
                        chip.style.opacity = '0.8';
                        chip.style.transform = 'scale(0.95)';
                    }
                } else {
                    const color = TagManager.getColor(tag);
                    chip.style.backgroundColor = color;
                    chip.style.color = '#202124';
                    chip.style.border = '1px solid transparent';
                    if (this.currentTagFilter === tag) {
                        chip.style.boxShadow = '0 3px 8px rgba(0,0,0,0.25)';
                        chip.style.transform = 'scale(1.05)';
                        chip.style.fontWeight = '700';
                        chip.style.opacity = '1';
                        chip.style.zIndex = '2';
                        chip.style.filter = 'none';
                    } else {
                        chip.style.opacity = '0.65';
                        chip.style.transform = 'scale(0.95)';
                        chip.style.filter = 'grayscale(0.4)';
                    }
                }
                chip.onclick = () => {
                    this.currentTagFilter = tag;
                    this.renderTags();
                    this.renderList();
                };
                container.appendChild(chip);
            });
        },

// Renders the list with compact layout and colored tags
        renderList() {
            const container = document.getElementById('lib-content-list');
            if (!container) return;
            container.replaceChildren();
            this.focusedIndex = -1;

            let filtered = this.data.filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(this.currentSearchQuery) || 
                                      p.content.toLowerCase().includes(this.currentSearchQuery);
                const matchesTag = this.currentTagFilter === 'All' || p.tags.includes(this.currentTagFilter);
                return matchesSearch && matchesTag;
            });

            if (filtered.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'lib-empty-state';
                empty.textContent = this.data.length === 0 ? 'No prompts yet. Create one!' : 'No matches found.';
                container.appendChild(empty);
                return;
            }

            filtered.forEach(p => {
                const card = document.createElement('div');
                card.className = 'lib-card';
                card._content = p.content;
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'lib-card-header';
                cardHeader.style.alignItems = 'center';
                
                const infoGroup = document.createElement('div');
                infoGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; margin-right: 8px;';

                const tagsWrapper = document.createElement('div');
                tagsWrapper.className = 'lib-card-tags';
                tagsWrapper.style.marginBottom = '0';
                tagsWrapper.style.flexShrink = '0';

                p.tags.slice(0, 2).forEach(t => {
                    const tSpan = document.createElement('span');
                    tSpan.textContent = t;
                    tSpan.style.backgroundColor = TagManager.getColor(t);
                    tSpan.style.color = '#202124';
                    tSpan.style.borderRadius = '4px';
                    tSpan.style.padding = '2px 8px';
                    tSpan.style.fontWeight = '500';
                    tagsWrapper.appendChild(tSpan);
                });
                if (p.tags.length > 2) {
                    const more = document.createElement('span');
                    more.textContent = `+${p.tags.length - 2}`;
                    more.style.backgroundColor = '#e0e0e0';
                    more.style.color = '#202124';
                    more.style.borderRadius = '4px';
                    more.style.padding = '2px 6px';
                    tagsWrapper.appendChild(more);
                }

                const title = document.createElement('div');
                title.className = 'lib-card-title';
                title.textContent = p.title;
                title.style.maxWidth = 'none';
                title.style.flex = '1';

                infoGroup.append(tagsWrapper, title);

                const actions = document.createElement('div');
                actions.className = 'lib-card-actions';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'lib-icon-btn';
                editBtn.appendChild(StyleManager.createSvgIcon('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'));
                editBtn.onclick = (e) => { e.stopPropagation(); this.openEditor(p); };
                
                const delBtn = document.createElement('button');
                delBtn.className = 'lib-icon-btn delete';
                delBtn.appendChild(StyleManager.createSvgIcon('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'));
                delBtn.onclick = (e) => { e.stopPropagation(); this.confirmDelete(p.id); };

                actions.append(editBtn, delBtn);
                cardHeader.append(infoGroup, actions);

                const preview = document.createElement('div');
                preview.className = 'lib-card-preview';
                preview.textContent = p.content;

                card.append(cardHeader, preview);
                card.onclick = () => this.insertAtCursor(p.content);
                
                card.onmouseenter = () => this.showTooltip(p.content, card);
                card.onmouseleave = () => this.hideTooltip();

                container.appendChild(card);
            });
        },

        // --- OVERLAYS ---
        showOverlay(contentElement) {
            let overlay = document.getElementById('lib-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'lib-overlay';
                overlay.className = 'lib-overlay';
                document.getElementById('quicknav-lib-modal').appendChild(overlay);
            }
            overlay.replaceChildren();
            overlay.appendChild(contentElement);
            overlay.classList.add('visible');
        },

        hideOverlay() {
            const overlay = document.getElementById('lib-overlay');
            if (overlay) overlay.classList.remove('visible');
        },

// Opens editor: Autocomplete on focus, integrated color picker for new tags
        openEditor(promptToEdit = null) {
            const container = document.createElement('div');
            container.className = 'lib-editor-container';
            const header = document.createElement('h3');
            header.textContent = promptToEdit ? 'Edit Prompt' : 'New Prompt';
            const inputTitle = document.createElement('input');
            inputTitle.type = 'text';
            inputTitle.className = 'lib-input-full';
            inputTitle.placeholder = 'Prompt Title';
            inputTitle.value = promptToEdit ? promptToEdit.title : '';
            
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'lib-input-full';
            tagsContainer.style.display = 'flex';
            tagsContainer.style.flexWrap = 'wrap';
            tagsContainer.style.gap = '6px';
            tagsContainer.style.alignItems = 'center';
            tagsContainer.style.padding = '6px';
            tagsContainer.style.minHeight = '42px';
            tagsContainer.style.cursor = 'text';
            tagsContainer.style.position = 'relative'; 

            const currentTags = promptToEdit ? [...promptToEdit.tags] : [];
            const allKnownTags = Array.from(new Set(this.data.flatMap(p => p.tags)));

            const renderChips = () => {
                const input = tagsContainer.querySelector('input');
                if (input) input.remove();
                
                while (tagsContainer.firstChild) {
                    if (tagsContainer.firstChild.classList && tagsContainer.firstChild.classList.contains('lib-suggestions-menu')) {
                        break; 
                    }
                    tagsContainer.removeChild(tagsContainer.firstChild);
                }

                currentTags.forEach((tag, idx) => {
                    const chip = document.createElement('span');
                    chip.textContent = tag;
                    chip.style.backgroundColor = TagManager.getColor(tag);
                    chip.style.color = '#202124';
                    chip.style.padding = '2px 8px';
                    chip.style.borderRadius = '12px';
                    chip.style.fontSize = '12px';
                    chip.style.cursor = 'pointer';
                    chip.style.display = 'inline-flex';
                    chip.style.alignItems = 'center';
                    chip.style.gap = '4px';
                    chip.style.userSelect = 'none';
                    chip.title = 'Click to change color';

                    chip.onclick = (e) => {
                        e.stopPropagation();
                        showColorPicker(e, tag);
                    };

                    const closeX = document.createElement('span');
                    closeX.textContent = '×';
                    closeX.style.fontWeight = 'bold';
                    closeX.style.fontSize = '14px';
                    closeX.style.color = 'rgba(0,0,0,0.5)';
                    closeX.style.cursor = 'pointer';
                    closeX.onmouseenter = () => closeX.style.color = '#000';
                    closeX.onmouseleave = () => closeX.style.color = 'rgba(0,0,0,0.5)';
                    
                    closeX.onclick = (e) => {
                        e.stopPropagation();
                        currentTags.splice(idx, 1);
                        renderChips();
                    };

                    chip.appendChild(closeX);
                    tagsContainer.appendChild(chip);
                });
                
                if (input) tagsContainer.appendChild(input);
                else {
                    const newInput = createTagInput();
                    tagsContainer.appendChild(newInput);
                    if (promptToEdit || currentTags.length > 0) newInput.focus();
                }
            };

            const createTagInput = () => {
                const tagInput = document.createElement('input');
                tagInput.style.border = 'none';
                tagInput.style.outline = 'none';
                tagInput.style.flex = '1';
                tagInput.style.minWidth = '60px';
                tagInput.style.fontSize = '14px';
                tagInput.style.backgroundColor = 'transparent';
                tagInput.style.color = 'inherit';
                tagInput.placeholder = currentTags.length === 0 ? 'Tags...' : '';
                
                let suggestionsBox = null;

                const closeSuggestions = () => {
                    if (suggestionsBox) {
                        suggestionsBox.remove();
                        suggestionsBox = null;
                    }
                };

                const updateSuggestions = () => {
                    const val = tagInput.value.trim().toLowerCase();
                    const matches = allKnownTags.filter(t => 
                        (val === '' || t.toLowerCase().includes(val)) && !currentTags.includes(t)
                    );
                    matches.sort();

                    if (!suggestionsBox) {
                        suggestionsBox = document.createElement('div');
                        suggestionsBox.className = 'lib-suggestions-menu';
                        suggestionsBox.style.top = '100%';
                        suggestionsBox.style.left = '0';
                        tagsContainer.appendChild(suggestionsBox);
                    }
                    suggestionsBox.replaceChildren();

                    if (matches.length > 0) {
                        matches.forEach(match => {
                            const item = document.createElement('div');
                            item.className = 'lib-suggestion-item';
                            
                            const colorDot = document.createElement('div');
                            colorDot.className = 'lib-suggestion-color';
                            colorDot.style.backgroundColor = TagManager.getColor(match);
                            
                            const text = document.createElement('span');
                            text.textContent = match;

                            item.append(colorDot, text);
                            item.onmousedown = (e) => {
                                e.preventDefault(); 
                                currentTags.push(match);
                                tagInput.value = '';
                                closeSuggestions();
                                renderChips();
                            };
                            suggestionsBox.appendChild(item);
                        });
                    }

                    if (val && !currentTags.includes(tagInput.value.trim())) {
                        const createRow = document.createElement('div');
                        createRow.className = 'lib-suggestion-create-row';
                        
                        const label = document.createElement('div');
                        label.className = 'lib-suggestion-create-label';
                        label.textContent = `Create "${tagInput.value.trim()}":`;
                        
                        const palette = document.createElement('div');
                        palette.className = 'lib-suggestion-palette';
                        
                        TagManager.PALETTE.forEach(color => {
                            const dot = document.createElement('div');
                            dot.className = 'lib-suggestion-palette-item';
                            dot.style.backgroundColor = color;
                            dot.onmousedown = (e) => {
                                e.preventDefault();
                                const newTagName = tagInput.value.trim();
                                TagManager.setColor(newTagName, color); 
                                currentTags.push(newTagName);
                                tagInput.value = '';
                                closeSuggestions();
                                renderChips();
                            };
                            palette.appendChild(dot);
                        });

                        createRow.append(label, palette);
                        suggestionsBox.appendChild(createRow);
                    }

                    if (matches.length === 0 && !val) {
                         closeSuggestions();
                    }
                };

                tagInput.addEventListener('input', updateSuggestions);
                tagInput.addEventListener('focus', updateSuggestions);

                tagInput.addEventListener('blur', () => {
                    setTimeout(closeSuggestions, 200);
                });

                tagInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = tagInput.value.trim().replace(',', '');
                        if (val && !currentTags.includes(val)) {
                            currentTags.push(val);
                            tagInput.value = '';
                            closeSuggestions();
                            renderChips();
                            setTimeout(() => {
                                const newInput = tagsContainer.querySelector('input');
                                if (newInput) newInput.focus();
                            }, 0);
                        }
                    } else if (e.key === 'Backspace' && !tagInput.value && currentTags.length > 0) {
                        currentTags.pop();
                        closeSuggestions();
                        renderChips();
                        setTimeout(() => {
                            const newInput = tagsContainer.querySelector('input');
                            if (newInput) newInput.focus();
                        }, 0);
                    }
                });
                return tagInput;
            };

            tagsContainer.onclick = (e) => {
                if (e.target === tagsContainer) {
                    const input = tagsContainer.querySelector('input');
                    if (input) input.focus();
                }
            };

            const showColorPicker = (e, tagName) => {
                const existingPicker = document.getElementById('lib-color-picker');
                if (existingPicker) existingPicker.remove();
                const picker = document.createElement('div');
                picker.id = 'lib-color-picker';
                picker.style.cssText = `
                    position: fixed; z-index: 100002;
                    padding: 8px; border-radius: 8px;
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
                `;
                TagManager.PALETTE.forEach(color => {
                    const swatch = document.createElement('div');
                    swatch.style.width = '20px';
                    swatch.style.height = '20px';
                    swatch.style.backgroundColor = color;
                    swatch.style.borderRadius = '50%';
                    swatch.style.cursor = 'pointer';
                    swatch.style.border = '1px solid rgba(0,0,0,0.1)';
                    swatch.onclick = () => {
                        TagManager.setColor(tagName, color);
                        picker.remove();
                        renderChips();
                        this.renderTags();
                    };
                    picker.appendChild(swatch);
                });
                const rect = e.currentTarget.getBoundingClientRect();
                picker.style.top = `${rect.bottom + 4}px`;
                picker.style.left = `${rect.left}px`;
                document.body.appendChild(picker);
                const closeHandler = (evt) => {
                    if (!picker.contains(evt.target) && evt.target !== e.currentTarget) {
                        picker.remove();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeHandler), 0);
            };

            tagsContainer.appendChild(createTagInput());
            renderChips();

            const contentToolbar = document.createElement('div');
            contentToolbar.className = 'lib-editor-toolbar';
            const pasteBtn = document.createElement('button');
            pasteBtn.textContent = 'Paste Clipboard';
            pasteBtn.className = 'lib-btn-text';
            pasteBtn.onclick = async () => {
                 try {
                     const text = await navigator.clipboard.readText();
                     inputContent.value += text;
                 } catch(e) { }
            };
            const fromChatBtn = document.createElement('button');
            fromChatBtn.textContent = 'From Chat Input';
            fromChatBtn.className = 'lib-btn-text';
            fromChatBtn.onclick = () => {
                const ta = PromptActions.getTextarea();
                if (ta) inputContent.value += ta.value;
            };
            contentToolbar.append(pasteBtn, fromChatBtn);
            const inputContent = document.createElement('textarea');
            inputContent.className = 'lib-textarea-full';
            inputContent.placeholder = 'Prompt Content...';
            inputContent.value = promptToEdit ? promptToEdit.content : '';
            const footer = document.createElement('div');
            footer.className = 'lib-overlay-footer';
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'lib-btn-secondary';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => this.hideOverlay();
            const saveBtn = document.createElement('button');
            saveBtn.className = 'lib-btn-primary';
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => {
                if (!inputContent.value.trim()) return;
                if (promptToEdit) {
                    const idx = this.data.findIndex(p => p.id === promptToEdit.id);
                    if (idx !== -1) {
                        this.data[idx] = {
                            ...this.data[idx],
                            title: inputTitle.value.trim() || 'Untitled',
                            tags: currentTags,
                            content: inputContent.value
                        };
                        this.save();
                    }
                } else {
                    const newPrompt = {
                        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                        title: inputTitle.value.trim() || 'Untitled',
                        tags: currentTags,
                        content: inputContent.value
                    };
                    this.data.unshift(newPrompt);
                    if (currentTags.length > 0) this.currentTagFilter = currentTags[0];
                    else this.currentTagFilter = 'All';
                    this.save();
                }
                this.renderList();
                this.renderTags();
                this.hideOverlay();
            };
            footer.append(cancelBtn, saveBtn);
            container.append(header, inputTitle, tagsContainer, contentToolbar, inputContent, footer);
            this.showOverlay(container);
            inputTitle.focus();
        },

        confirmDelete(id) {
            const container = document.createElement('div');
            container.className = 'lib-confirm-wrap';
            
            const box = document.createElement('div');
            box.className = 'lib-confirm-box';

            const header = document.createElement('h3');
            header.textContent = 'Delete Prompt?';
            const subtext = document.createElement('p');
            subtext.textContent = 'This action cannot be undone.';
            
            const actions = document.createElement('div');
            actions.className = 'lib-confirm-actions';
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'lib-btn-secondary';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => this.hideOverlay();

            const delBtn = document.createElement('button');
            delBtn.className = 'lib-btn-danger';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => {
                this.deletePrompt(id);
                this.renderList();
                this.renderTags();
                this.hideOverlay();
            };

            actions.append(cancelBtn, delBtn);
            box.append(header, subtext, actions);
            container.appendChild(box);
            this.showOverlay(container);
        },

// Handles import/export with version 2 support (prompts + colors)
        openImportExport() {
            const container = document.createElement('div');
            container.className = 'lib-editor-container';
            
            const header = document.createElement('h3');
            header.textContent = 'Import / Export';

            const fileSection = document.createElement('div');
            fileSection.style.cssText = 'display: flex; gap: 12px; margin-bottom: 12px; align-items: center;';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                    try {
                        this.processImport(JSON.parse(evt.target.result));
                        fileInput.value = ''; 
                    } catch(err) { alert('Invalid JSON'); }
                };
                reader.readAsText(file);
            };

            const exportBtn = document.createElement('button');
            exportBtn.className = 'lib-btn-primary';
            exportBtn.style.flex = '1';
            exportBtn.style.justifyContent = 'center';
            exportBtn.textContent = 'Export to File';
            exportBtn.onclick = () => {
                const exportData = {
                    version: 2,
                    prompts: this.data,
                    tagColors: TagManager.getExportData()
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `quicknav_prompts_v2_${Date.now()}.json`;
                a.click();
            };

            const importFileBtn = document.createElement('button');
            importFileBtn.className = 'lib-btn-secondary';
            importFileBtn.style.flex = '1'; 
            importFileBtn.style.justifyContent = 'center';
            importFileBtn.textContent = 'Import from File';
            importFileBtn.onclick = () => fileInput.click();

            fileSection.append(exportBtn, importFileBtn, fileInput);

            const separator = document.createElement('div');
            separator.style.cssText = 'height: 1px; background-color: #e0e0e0; margin: 0 0 16px 0; opacity: 0.6;';

            const textLabel = document.createElement('div');
            textLabel.className = 'lib-io-desc';
            textLabel.textContent = 'Or paste JSON content directly:';
            textLabel.style.marginBottom = '6px';
            textLabel.style.fontWeight = '500';

            const jsonInput = document.createElement('textarea');
            jsonInput.className = 'lib-textarea-full';
            jsonInput.style.flex = '1'; 
            jsonInput.style.minHeight = '150px';
            jsonInput.placeholder = '{ "version": 2, "prompts": [...], "tagColors": {...} }';

            const importTextBtn = document.createElement('button');
            importTextBtn.className = 'lib-btn-primary';
            importTextBtn.style.width = '100%';
            importTextBtn.style.marginTop = '12px';
            importTextBtn.style.justifyContent = 'center';
            importTextBtn.textContent = 'Import from Text';
            importTextBtn.onclick = () => {
                try {
                    const val = jsonInput.value.trim();
                    if (!val) return;
                    this.processImport(JSON.parse(val));
                } catch(err) { alert('Invalid JSON'); }
            };

            const closeBtn = document.createElement('button');
            closeBtn.className = 'lib-btn-secondary';
            closeBtn.textContent = 'Close';
            closeBtn.style.alignSelf = 'flex-end';
            closeBtn.style.marginTop = '12px';
            closeBtn.onclick = () => this.hideOverlay();

            container.append(header, fileSection, separator, textLabel, jsonInput, importTextBtn, closeBtn);
            this.showOverlay(container);
        },

        processImport(imported) {
            let prompts = [];
            let colors = null;

            if (Array.isArray(imported)) {
                prompts = imported;
            } else if (imported && imported.prompts) {
                prompts = imported.prompts;
                colors = imported.tagColors;
            } else {
                alert('Invalid Data Format');
                return;
            }

            if (colors) {
                TagManager.mergeImportData(colors);
            }

            if (Array.isArray(prompts)) {
                let added = 0;
                const ids = new Set(this.data.map(p => p.id));
                [...prompts].reverse().forEach(p => {
                    if (p.content) {
                        if (!p.id || ids.has(p.id)) {
                            p.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
                        }
                        p.title = p.title || 'Untitled';
                        p.tags = Array.isArray(p.tags) ? p.tags : [];
                        
                        this.data.unshift(p);
                        added++;
                    }
                });
                this.save();
                this.renderTags(); 
                this.renderList();
                alert(`Imported ${added} prompts.`);
                this.hideOverlay();
            }
        },

        processImport(imported) {
            if (Array.isArray(imported)) {
                let added = 0;
                const ids = new Set(this.data.map(p => p.id));
                [...imported].reverse().forEach(p => {
                    if (p.content) {
                        if (!p.id || ids.has(p.id)) {
                            p.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
                        }
                        p.title = p.title || 'Untitled';
                        p.tags = Array.isArray(p.tags) ? p.tags : [];
                        
                        this.data.unshift(p);
                        added++;
                    }
                });
                this.save();
                this.renderTags();
                alert(`Imported ${added} prompts.`);
                this.hideOverlay();
            } else {
                alert('JSON must be an array of objects.');
            }
        },

        // --- PUBLIC API ---
        open() {
            this.load();
            this.createModalElements();
            this.renderTags();
            this.renderList();
            
            const backdrop = document.getElementById('quicknav-lib-backdrop');
            backdrop.classList.add('visible');
            
            setTimeout(() => {
                const search = backdrop.querySelector('.lib-search-input');
                if (search) search.focus();
            }, 50);
        },

        toggle() {
            const backdrop = document.getElementById('quicknav-lib-backdrop');
            if (backdrop && backdrop.classList.contains('visible')) {
                this.closeModal();
            } else {
                this.open();
            }
        },

// Closes modal and immediately kills tooltip
        closeModal() {
            const backdrop = document.getElementById('quicknav-lib-backdrop');
            if (backdrop) backdrop.classList.remove('visible');
            this.hideOverlay();
            this.hideTooltip(true);
        },

// Calculates positioning with a tighter gap to the modal but safe screen margins
        showTooltip(text, sourceElement = null) {
            clearTimeout(this.tooltipTimer);

            if (this.activeCard && this.activeCard !== sourceElement) {
                this.activeCard.classList.remove('active-tooltip-source');
            }
            if (sourceElement) {
                sourceElement.classList.add('active-tooltip-source');
                this.activeCard = sourceElement;
            }

            const tt = UIManager.customTooltip;
            const modal = document.getElementById('quicknav-lib-modal');
            
            if (tt && modal) {
                tt.textContent = text;
                tt.classList.add('lib-fixed-tooltip');
                tt.style.opacity = '1';
                tt.style.pointerEvents = 'auto';

                tt.onmouseenter = () => clearTimeout(this.tooltipTimer);
                tt.onmouseleave = () => this.hideTooltip();
                
                const modalRect = modal.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                const SCREEN_PAD = 12;
                const ELEMENT_GAP = 4;
                
                const leftPos = modalRect.right + ELEMENT_GAP;
                const availableWidth = viewportWidth - leftPos - SCREEN_PAD;
                const availableHeight = viewportHeight - modalRect.top - SCREEN_PAD;
                
                tt.style.left = `${leftPos}px`;
                tt.style.top = `${modalRect.top}px`;
                tt.style.width = `${Math.max(200, availableWidth)}px`;
                tt.style.maxHeight = `${availableHeight}px`;
                tt.style.overflowY = 'auto';
            }
        },

// Hides the tooltip with a grace period to allow cursor transition
        hideTooltip(immediate = false) {
            const performHide = () => {
                const tt = UIManager.customTooltip;
                if (tt) {
                    tt.style.opacity = '0';
                    tt.classList.remove('lib-fixed-tooltip');
                    tt.style.pointerEvents = '';
                    tt.style.width = '';
                    tt.style.maxHeight = '';
                    tt.style.overflowY = '';
                    tt.onmouseenter = null;
                    tt.onmouseleave = null;
                }
                if (this.activeCard) {
                    this.activeCard.classList.remove('active-tooltip-source');
                    this.activeCard = null;
                }
            };

            if (immediate) {
                clearTimeout(this.tooltipTimer);
                performHide();
            } else {
                this.tooltipTimer = setTimeout(performHide, 300);
            }
        }
    };

// Manages the Favorites system: storage, menu rendering, and state logic.
    const FavoritesManager = {
        STORAGE_KEY: 'quicknav_favorites',
        menuId: 'quicknav-favorites-menu',
        deletingId: null,
        
        getFavorites() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        saveFavorites(favs) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
            this.updateButtonState();
        },

        isCurrentFavorite() {
            const currentUrl = window.location.href;
            const favs = this.getFavorites();
            return favs.some(f => f.url === currentUrl);
        },

        getCurrentTitle() {
            const titleEl = document.querySelector('ms-toolbar h1.mode-title');
            return titleEl ? titleEl.textContent.trim() : document.title;
        },

        addCurrent() {
            const favs = this.getFavorites();
            const url = window.location.href;
            if (favs.some(f => f.url === url)) return;
            
            favs.unshift({
                id: Date.now().toString(36),
                title: this.getCurrentTitle(),
                url: url
            });
            this.saveFavorites(favs);
            this.renderMenu();
        },

        startDelete(id) {
            this.deletingId = id;
            this.renderMenu();
        },

        cancelDelete() {
            this.deletingId = null;
            this.renderMenu();
        },

        remove(id) {
            let favs = this.getFavorites();
            favs = favs.filter(f => f.id !== id);
            this.saveFavorites(favs);
            this.deletingId = null;
            this.renderMenu();
        },

        update(id, newTitle, newUrl) {
            const favs = this.getFavorites();
            const idx = favs.findIndex(f => f.id === id);
            if (idx !== -1) {
                favs[idx].title = newTitle;
                favs[idx].url = newUrl;
                this.saveFavorites(favs);
                this.renderMenu();
            }
        },

// Updates the favorites button icon state using outlines for non-active and filled for active
        updateButtonState() {
            const btn = document.getElementById('quicknav-fav-trigger');
            if (!btn) return;
            
            const isFav = this.isCurrentFavorite();
            const svg = btn.querySelector('svg');
            if (svg) svg.remove();
            
            const filledPath = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
            const outlinePath = 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.01 4.38.38-3.32 2.88 1 4.28L12 15.4z';
            
            const newSvg = StyleManager.createSvgIcon(isFav ? filledPath : outlinePath);
            newSvg.setAttribute('width', '24');
            newSvg.setAttribute('height', '24');
            newSvg.setAttribute('viewBox', '0 0 24 24');
            
            newSvg.style.color = 'var(--ms-primary, #8ab4f8)';
            if (isFav) {
                newSvg.setAttribute('fill', 'currentColor');
            } else {
                newSvg.setAttribute('fill', 'currentColor');
            }
            
            btn.appendChild(newSvg);
        },

// Renders the list of favorite conversations
        renderMenu() {
            const menu = document.getElementById(this.menuId);
            if (!menu) return;
            
            menu.replaceChildren();

            const addBtn = document.createElement('div');
            addBtn.className = 'quicknav-dropdown-item fav-action-row';
            addBtn.style.borderBottom = '1px solid var(--ms-outline, #dadce0)';
            addBtn.style.paddingBottom = '8px';
            addBtn.style.marginBottom = '4px';
            
            const addIcon = StyleManager.createSvgIcon('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
            const addText = document.createElement('span');
            addText.textContent = 'Add conversation to favorites';
            addText.style.fontWeight = '500';
            
            addBtn.append(addIcon, addText);
            addBtn.onclick = () => this.addCurrent();
            menu.appendChild(addBtn);

            const favs = this.getFavorites();
            if (favs.length === 0) return;

            favs.forEach(fav => {
                const item = document.createElement('div');
                item.className = 'quicknav-fav-item';

                if (this.deletingId === fav.id) {
                    item.className += ' fav-confirm-mode';
                    
                    const confirmRow = document.createElement('div');
                    confirmRow.className = 'fav-confirm-row';
                    
                    const label = document.createElement('span');
                    label.textContent = 'Delete?';
                    label.className = 'fav-confirm-label';
                    
                    const actions = document.createElement('div');
                    actions.style.display = 'flex';
                    actions.style.gap = '8px';

                    const yesBtn = document.createElement('button');
                    yesBtn.className = 'lib-icon-btn delete';
                    yesBtn.title = 'Confirm Delete';
                    yesBtn.appendChild(StyleManager.createSvgIcon('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'));
                    yesBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.remove(fav.id);
                    };

                    const noBtn = document.createElement('button');
                    noBtn.className = 'lib-icon-btn';
                    noBtn.title = 'Cancel';
                    noBtn.appendChild(StyleManager.createSvgIcon('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'));
                    noBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.cancelDelete();
                    };

                    actions.append(yesBtn, noBtn);
                    confirmRow.append(label, actions);
                    item.appendChild(confirmRow);

                } else {
                    const isActive = window.location.href === fav.url;
                    if (isActive) item.classList.add('fav-active-item');

                    const displayContainer = document.createElement('div');
                    displayContainer.className = 'fav-display';
                    
                    const textGroup = document.createElement('a');
                    textGroup.className = 'fav-text-group';
                    textGroup.href = fav.url;
                    textGroup.onclick = (e) => {
                         if (window.location.href === fav.url) {
                             e.preventDefault();
                             return;
                         }
                    };
                    
                    const titleSpan = document.createElement('div');
                    titleSpan.className = 'fav-title';
                    titleSpan.textContent = fav.title;
                    
                    const urlSpan = document.createElement('div');
                    urlSpan.className = 'fav-url';
                    urlSpan.textContent = fav.url;
                    
                    textGroup.append(titleSpan, urlSpan);

                    const actions = document.createElement('div');
                    actions.className = 'fav-actions';
                    
                    const editBtn = document.createElement('button');
                    editBtn.className = 'lib-icon-btn';
                    editBtn.appendChild(StyleManager.createSvgIcon('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'));
                    
                    const delBtn = document.createElement('button');
                    delBtn.className = 'lib-icon-btn delete';
                    delBtn.appendChild(StyleManager.createSvgIcon('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'));
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.startDelete(fav.id);
                    };

                    actions.append(editBtn, delBtn);
                    displayContainer.append(textGroup, actions);

                    const editForm = document.createElement('div');
                    editForm.className = 'fav-edit-form';
                    editForm.style.display = 'none';

                    const inputTitle = document.createElement('input');
                    inputTitle.type = 'text';
                    inputTitle.className = 'lib-input-full';
                    inputTitle.value = fav.title;
                    inputTitle.placeholder = 'Name';
                    inputTitle.style.marginBottom = '4px';

                    const inputUrl = document.createElement('input');
                    inputUrl.type = 'text';
                    inputUrl.className = 'lib-input-full';
                    inputUrl.value = fav.url;
                    inputUrl.placeholder = 'URL';
                    inputUrl.style.marginBottom = '4px';

                    const btnRow = document.createElement('div');
                    btnRow.style.display = 'flex';
                    btnRow.style.justifyContent = 'flex-end';
                    btnRow.style.gap = '8px';

                    const saveBtn = document.createElement('button');
                    saveBtn.className = 'lib-btn-primary';
                    saveBtn.textContent = 'Save';
                    saveBtn.style.padding = '4px 12px';
                    saveBtn.onclick = () => this.update(fav.id, inputTitle.value, inputUrl.value);

                    const cancelBtn = document.createElement('button');
                    cancelBtn.className = 'lib-btn-secondary';
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.style.padding = '4px 12px';
                    cancelBtn.onclick = () => {
                        editForm.style.display = 'none';
                        displayContainer.style.display = 'flex';
                    };

                    btnRow.append(cancelBtn, saveBtn);
                    editForm.append(inputTitle, inputUrl, btnRow);

                    editBtn.onclick = (e) => {
                        e.stopPropagation();
                        displayContainer.style.display = 'none';
                        editForm.style.display = 'flex';
                        editForm.style.flexDirection = 'column';
                    };

                    item.append(displayContainer, editForm);
                }
                menu.appendChild(item);
            });
        }
    };

// --- MODULE: UI Manager ---
    const UIManager = {
        customTooltip: null,
        tooltipTimeout: null,
        badgeFadeTimeout: null,
        lastScrollTime: 0,
        lastScrollTop: 0,
        isHoveringOnNav: false,
        isThrottled: false,
        footerElement: null,
        toolbarElement: null,
        navContainerElement: null,
        listenedTurnElement: null,
        _handleTurnMouseMove: null,
        _handleTurnMouseLeave: null,
        injectionIntervals: [],

// Initializes the UI Manager with reactive observers
        create(targetNode) {
            if (this.navContainerElement && document.body.contains(this.navContainerElement)) return;
            this.activeObservers = new Set();
            StyleManager.init();
            this.injectStyles();
            this.createGlobalElements();
            this.createAndInjectUI();
            this.cacheStaticElements();
            this._handleTurnMouseMove = this._handleTurnMouseMove.bind(this);
            this._handleTurnMouseLeave = this._handleTurnMouseLeave.bind(this);
            document.addEventListener('click', this.closeSettingsMenu.bind(this));
            window.addEventListener('resize', this.closeSettingsMenu.bind(this));
        },

// Cleans up all injected elements and disconnects observers
        destroy() {
            if (this.activeObservers) {
                this.activeObservers.forEach(observer => observer.disconnect());
                this.activeObservers.clear();
            }

            const ui = document.getElementById('chat-nav-container');
            if (ui) ui.remove();
            const settingsWrapper = document.querySelector('.quicknav-settings-wrapper');
            if (settingsWrapper) settingsWrapper.remove();
            const dropdown = document.getElementById('quicknav-settings-dropdown');
            if (dropdown) dropdown.remove();
            const menu = document.getElementById('chat-nav-menu-container');
            if (menu) menu.remove();
            const badge = document.getElementById('quicknav-badge-floater');
            if (badge) badge.remove();
            const tooltip = document.getElementById('quicknav-custom-tooltip');
            if (tooltip) tooltip.remove();
            
            this.customTooltip = null;
            this.footerElement = null;
            this.toolbarElement = null;
            this.navContainerElement = null;
            
            if (this.listenedTurnElement) {
                this.listenedTurnElement.removeEventListener('mousemove', this._handleTurnMouseMove);
                this.listenedTurnElement.removeEventListener('mouseleave', this._handleTurnMouseLeave);
                this.listenedTurnElement = null;
            }
            document.removeEventListener('click', this.closeSettingsMenu.bind(this));
            window.removeEventListener('resize', this.closeSettingsMenu.bind(this));
        },

// Caches static references to UI boundaries for the badge positioning.
        cacheStaticElements() {
            this.footerElement = document.querySelector('ms-chunk-editor footer, section.chunk-editor-main > footer');
            this.toolbarElement = document.querySelector('ms-toolbar');
        },

        showBadge() {
            const floater = document.getElementById('quicknav-badge-floater');
            if (!floater) return;
            this.cancelHideBadge();
            floater.style.opacity = '1';
        },

        hideBadge(delay = 1000, force = false) {
            const floater = document.getElementById('quicknav-badge-floater');
            if (!floater || (this.isHoveringOnNav && !force)) return;

            this.cancelHideBadge();

            if (force) {
                floater.classList.add('quicknav-badge-notransition');
                floater.style.opacity = '0';
                requestAnimationFrame(() => {
                    floater.classList.remove('quicknav-badge-notransition');
                });
            } else {
                this.badgeFadeTimeout = setTimeout(() => {
                    floater.style.opacity = '0';
                }, delay);
            }
        },

        cancelHideBadge() {
            clearTimeout(this.badgeFadeTimeout);
        },

        setupMessageObserver() {
            const scrollContainer = document.querySelector('ms-autoscroll-container');
            const messages = document.querySelectorAll('.message-turn');
            if (!scrollContainer || !messages.length) return;

            const observerOptions = { root: scrollContainer, rootMargin: '0px', threshold: 0.1 };
            const observer = new IntersectionObserver(this.handleMessageVisibilityChange.bind(this), observerOptions);
            messages.forEach(msg => observer.observe(msg));
        },

        handleMessageVisibilityChange(entries) {
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            if (visibleEntries.length === 0) return;
            const bottomMostEntry = visibleEntries.reduce((prev, current) => {
                return prev.boundingClientRect.top > current.boundingClientRect.top ? prev : current;
            });
            if (bottomMostEntry && bottomMostEntry.target !== this.currentVisibleMessage) {
                this.currentVisibleMessage = bottomMostEntry.target;
                this.showBadge();
                this.updateScrollPercentage();
                this.hideBadge();
            }
        },

        handlePageScroll() {
            if (this.isThrottled) return;
            this.isThrottled = true;
            setTimeout(() => { this.isThrottled = false; }, 200);

            const SCROLL_SPEED_THRESHOLD = 500;
            const scrollContainer = document.querySelector('ms-autoscroll-container');
            if (!scrollContainer) return;

            const currentTime = performance.now();
            const currentScrollTop = scrollContainer.scrollTop;
            const deltaTime = currentTime - this.lastScrollTime;

            if (deltaTime > 0) {
                const deltaScroll = currentScrollTop - this.lastScrollTop;
                const scrollSpeed = Math.abs(deltaScroll / deltaTime) * 1000;
                if (scrollSpeed > SCROLL_SPEED_THRESHOLD) {
                    this.showBadge();
                    this.updateScrollPercentage();
                    this.hideBadge(1000);
                }
            }
            this.lastScrollTop = currentScrollTop;
            this.lastScrollTime = currentTime;
        },

        createGlobalElements() {
            if (!document.getElementById('quicknav-badge-floater')) {
                const badgeFloater = document.createElement('div');
                badgeFloater.id = 'quicknav-badge-floater';
                const badgeIndex = document.createElement('div');
                badgeIndex.id = 'quicknav-badge-index';
                const badgePercentage = document.createElement('div');
                badgePercentage.id = 'quicknav-badge-percentage';
                badgeFloater.append(badgeIndex, badgePercentage);
                document.body.appendChild(badgeFloater);
            }
            if (!document.getElementById('quicknav-custom-tooltip')) {
                this.customTooltip = document.createElement('div');
                this.customTooltip.id = 'quicknav-custom-tooltip';
                document.body.appendChild(this.customTooltip);
            }
        },

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

// Injects CSS with tightened layout for library header and tags plus color picker theming
        injectStyles() {
            if (document.getElementById('chat-nav-styles')) return;
            const styleSheet = document.createElement("style");
            styleSheet.id = 'chat-nav-styles';
            styleSheet.textContent = `
                .chat-turn-container {}

                @keyframes google-text-flow { to { background-position: 200% center; } }
                @keyframes donate-blue-flow { to { background-position: 200% center; } }
                @keyframes load-all-flow { to { background-position: 200% center; } }
                @keyframes quicknav-fade-in-out { 0% { opacity: 0; transform: translate(-50%, 10px); } 15% { opacity: 1; transform: translate(-50%, 0); } 85% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -10px); } }
                
                @keyframes quicknav-plasma-blue { 
                    0% { box-shadow: 0 0 6px 1px rgba(66, 133, 244, 0.5), inset 0 0 2px rgba(138, 180, 248, 0.4); border-color: #8ab4f8; color: #ffffff; background-color: rgba(66, 133, 244, 0.15); } 
                    40% { box-shadow: 0 0 14px 4px rgba(66, 133, 244, 0.9), inset 0 0 8px rgba(138, 180, 248, 0.7); border-color: #aecbfa; color: #ffffff; background-color: rgba(66, 133, 244, 0.35); }
                    80% { box-shadow: 0 0 2px 0 rgba(66, 133, 244, 0.2); border-color: #669df6; color: #8ab4f8; background-color: rgba(66, 133, 244, 0.05); } 
                    100% { box-shadow: 0 0 6px 1px rgba(66, 133, 244, 0.5), inset 0 0 2px rgba(138, 180, 248, 0.4); border-color: #8ab4f8; color: #ffffff; background-color: rgba(66, 133, 244, 0.15); } 
                }

                @keyframes quicknav-loading-flow { to { background-position: -200% center; } }
                
                .google-text-animated, .google-text-flash { background: linear-gradient(90deg, #8ab4f8, #e67c73, #f7cb73, #57bb8a, #8ab4f8); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent !important; }
                .google-text-animated { animation: google-text-flow 10s linear infinite; }
                .google-text-flash { animation: google-text-flow 1.5s ease-in-out 1; }
                .donate-button-animated { background: linear-gradient(90deg, #a8c7fa, #8ab4f8, #669df6, #8ab4f8, #a8c7fa); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent !important; animation: donate-blue-flow 8s ease-in-out infinite; }
                
                ms-autoscroll-container:focus { outline: none; }
                #chat-nav-container { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 4px auto; width: 100%; box-sizing: border-box; position: relative; z-index: 2147483647; }
                .counter-wrapper { position: relative; pointer-events: none; z-index: 9999; }
                
                .chat-nav-button, #chat-nav-counter { 
                    background-color: transparent; border: 1px solid var(--ms-on-surface-variant, #888888); 
                    transition: transform 0.1s ease-out, background-color 0.15s ease-in-out, border-color 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease, color 0.15s ease; 
                    pointer-events: auto; user-select: none; cursor: pointer; -webkit-transform: translateZ(0); transform: translateZ(0); box-shadow: 0 0 1px rgba(0,0,0,0); 
                }
                .chat-nav-button { color: var(--ms-on-surface-variant, #888888); flex-shrink: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                #nav-up, #nav-down { color: #8ab4f8; }
                #nav-top, #nav-bottom, #chat-nav-counter { color: var(--ms-on-surface-variant, #888888); }
                #chat-nav-counter { font-family: 'Google Sans', sans-serif; font-size: 14px; padding: 4px 8px; border-radius: 8px; display: inline-flex; align-items: baseline; border-color: var(--ms-on-surface-variant, #888888); }
                
                .quicknav-resize-btn { border-color: transparent !important; background-color: transparent !important; color: var(--ms-on-surface-variant, #888888) !important; transition: color 0.2s ease; }
                .quicknav-resize-btn:hover:not(:disabled) { background-color: transparent !important; border-color: transparent !important; color: #8ab4f8 !important; filter: none !important; }
                .quicknav-resize-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; filter: grayscale(100%); }

                .lib-btn-separator { margin-right: 6px; position: relative; }
                .lib-btn-separator::after { content: ''; position: absolute; right: -5px; top: 6px; bottom: 6px; width: 1px; background-color: #5f6368; opacity: 0.3; pointer-events: none; }

                .chat-nav-button:hover, .chat-nav-button:focus { outline: none; }
                #nav-top:hover, #nav-bottom:hover, #nav-top:focus, #nav-bottom:focus { background-color: rgba(136, 136, 136, 0.04); border-color: #bbbbbb; color: #e8eaed; filter: drop-shadow(0 0 2px rgba(189, 193, 198, 0.3)); }
                #nav-up:hover, #nav-down:hover, #nav-up:focus, #nav-down:focus, #chat-nav-counter:hover, #chat-nav-counter:focus { background-color: rgba(138, 180, 248, 0.04); border-color: #aecbfa; color: #d2e3fc; filter: drop-shadow(0 0 2px rgba(138, 180, 248, 0.4)); }
                .chat-nav-button:active { -webkit-transform: scale(0.95) translateZ(0); transform: scale(0.95) translateZ(0); }
                #nav-bottom.auto-click-active { animation: quicknav-plasma-blue 2.2s ease-in-out infinite; }
                
                #chat-nav-current-num.chat-nav-current-grey { color: var(--ms-on-surface-variant, #888888); }
                #chat-nav-current-num.chat-nav-current-blue { color: #8ab4f8; font-weight: 500; }
                #chat-nav-total-num { color: #8ab4f8; font-weight: 500; }
                .prompt-turn-highlight { box-shadow: inset 0 0 0 1px var(--ms-on-surface-variant, #9aa0a6) !important; }
                .response-turn-highlight { box-shadow: inset 0 0 0 1px var(--ms-primary, #8ab4f8) !important; }
                .quicknav-title { flex: 2; text-align: center; font-family: 'Google Sans', 'Inter Tight', sans-serif; font-size: 14px; user-select: text; font-weight: 600; }
                
                .quicknav-settings-wrapper { position: absolute; right: max(10px, calc(((100% - var(--quicknav-chat-width, 1000px)) / 2) + 10px)); top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 13px; z-index: 10; margin: 0; }
                .quicknav-left-wrapper { position: absolute; left: max(10px, calc(((100% - var(--quicknav-chat-width, 1000px)) / 2) + 10px)); top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 4px; z-index: 10; margin: 0; }

                .quicknav-dropdown-trigger { border: 1px solid transparent; background: transparent; color: #8ab4f8; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: all 0.15s ease-in-out; padding: 0; margin-left: 8px; }
                .quicknav-dropdown-trigger:hover, .quicknav-dropdown-trigger.active { background-color: rgba(138, 180, 248, 0.04); border-color: rgba(138, 180, 248, 0.5); color: #d2e3fc; filter: drop-shadow(0 0 2px rgba(138, 180, 248, 0.4)); }
                .quicknav-dropdown-menu { position: fixed; background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 8px; z-index: 2147483648; min-width: 160px; display: none; flex-direction: column; gap: 8px; }
                .quicknav-dropdown-menu.visible { display: flex; }
                .quicknav-control-row { display: flex; align-items: center; gap: 8px; padding: 0 4px; justify-content: space-between; }
                .quicknav-checkbox { cursor: pointer; width: 16px; height: 16px; accent-color: #8ab4f8; margin: 0; }
                .quicknav-toolbar-group { display: flex; align-items: center; gap: 4px; justify-content: center; transition: opacity 0.2s ease, filter 0.2s ease; }
                .quicknav-toolbar-group.disabled { opacity: 0.4; pointer-events: none; filter: grayscale(100%); }
                .quicknav-tool-btn { border: 1px solid transparent; background: transparent; color: #8ab4f8; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: all 0.15s ease-in-out; padding: 0 4px; }
                .quicknav-tool-indicator { font-family: 'Google Sans', sans-serif; font-size: 13px; font-weight: 500; min-width: 40px; text-align: center; }
                .quicknav-tool-btn:hover { background-color: rgba(138, 180, 248, 0.08); border-color: rgba(138, 180, 248, 0.5); }
                .quicknav-tool-btn:active { background-color: rgba(138, 180, 248, 0.25); }
                .quicknav-tool-btn:disabled { color: var(--ms-on-surface-variant, #9aa0a6); opacity: 0.5; cursor: default; background-color: transparent; border-color: transparent; }
                .quicknav-row-label { display: flex; align-items: center; gap: 6px; }
                .quicknav-icon-label { width: 18px; height: 18px; color: #5f6368; }

                /* Favorites Menu Styles */
                .quicknav-dropdown-item { padding: 8px 12px; cursor: pointer; font-size: 13px; color: #202124; display: flex; align-items: center; gap: 8px; border-radius: 4px; }
                .quicknav-dropdown-item:hover { background-color: #f1f3f4; }
                
                .quicknav-fav-item { display: flex; flex-direction: column; padding: 6px 12px; border-radius: 4px; gap: 4px; cursor: default; border-left: 3px solid transparent; }
                .quicknav-fav-item:hover { background-color: #f8f9fa; }
                .quicknav-fav-item.fav-active-item { background-color: rgba(138, 180, 248, 0.12); border-left-color: #1a73e8; }
                
                .quicknav-fav-item.fav-confirm-mode { background-color: #fce8e6; border: 1px solid #fad2cf; }
                
                .fav-display { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; width: 100%; }
                .fav-text-group { display: flex; flex-direction: column; flex: 1; text-decoration: none; color: inherit; cursor: pointer; min-width: 0; }
                .fav-title { font-weight: 500; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #202124; }
                .fav-url { font-size: 10px; color: #5f6368; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                
                .fav-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.2s; }
                .quicknav-fav-item:hover .fav-actions { opacity: 1; }
                
                .fav-confirm-row { display: flex; align-items: center; justify-content: space-between; width: 100%; color: #d93025; }
                .fav-confirm-label { font-size: 13px; font-weight: 500; }

                body.dark-theme .quicknav-dropdown-menu { background-color: #202124; border-color: #5f6368; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                body.dark-theme .quicknav-icon-label { color: #9aa0a6; }
                body.dark-theme .quicknav-tool-indicator { color: #e8eaed; }
                body.dark-theme .quicknav-tool-btn:hover { background-color: rgba(138, 180, 248, 0.15); }
                
                body.dark-theme .quicknav-dropdown-item { color: #e8eaed; }
                body.dark-theme .quicknav-dropdown-item:hover { background-color: #3c4043; }
                body.dark-theme .fav-title { color: #e8eaed; }
                body.dark-theme .fav-url { color: #9aa0a6; }
                body.dark-theme .quicknav-fav-item:hover { background-color: #2d2e30; }
                body.dark-theme .quicknav-fav-item.fav-active-item { background-color: rgba(138, 180, 248, 0.15); border-left-color: #8ab4f8; }
                body.dark-theme .fav-action-row { border-bottom-color: #5f6368 !important; }
                
                body.dark-theme .quicknav-fav-item.fav-confirm-mode { background-color: #410e0b; border-color: #8c1d18; }
                body.dark-theme .fav-confirm-row { color: #f28b82; }

                #chat-nav-menu-container { display: flex; flex-direction: column; position: fixed; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); max-height: 90vh; z-index: 99999; max-width: 95vw; min-width: 300px; box-sizing: border-box; visibility: hidden; opacity: 0; pointer-events: none; transition: opacity 0.15s ease-in-out, visibility 0s linear 0.15s; background-color: #f1f3f4; border: 2px solid #1a73e8; }
                #chat-nav-menu-container.visible { visibility: visible; opacity: 1; pointer-events: auto; transition: opacity 0.15s ease-in-out, visibility 0s linear 0s; }
                #chat-nav-menu-container:focus { outline: none; }
                #chat-nav-menu { list-style: none; margin: 0; padding: 0 8px 8px 8px; overflow-y: auto; scroll-behavior: smooth; flex-grow: 1; border-radius: 0 0 10px 10px; background-color: #f1f3f4; }
                .chat-nav-menu-item { display: flex; align-items: center; padding: 8px 12px; margin: 2px 0; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Google Sans', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background-color: #ffffff; color: #202124; }
                .chat-nav-menu-item:hover { background-color: #e8eaed; }
                .chat-nav-menu-item.menu-item-focused { background-color: #dfe1e5; }
                .chat-nav-menu-item.loading-in-progress { background: linear-gradient(100deg, #f1f3f4 20%, #d2e3fc 40%, #d2e3fc 60%, #f1f3f4 80%); background-size: 200% 100%; animation: quicknav-loading-flow 1.8s linear infinite; }
                .menu-item-number { font-weight: 500; margin-right: 8px; flex-shrink: 0; }
                .prompt-number-color { color: var(--ms-on-surface-variant, #9aa0a6); }
                .response-number-color { color: var(--ms-primary, #8ab4f8); }
                .menu-item-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .prompt-item-bg { border-left: 3px solid var(--ms-on-surface-variant, #9aa0a6); margin-left: 32px; }
                .response-item-bg { border-left: 3px solid var(--ms-primary, #8ab4f8); border-bottom: 1px solid var(--ms-primary, #8ab4f8); }
                .chat-nav-menu-header { flex-shrink: 0; z-index: 1; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 10px 10px 0 0; background-color: #f1f3f4; border-bottom: 1px solid #1a73e8; }
                .header-controls { flex: 1; display: flex; align-items: center; gap: 8px; }
                .header-controls.left { justify-content: flex-start; }
                .header-controls.right { justify-content: flex-end; }
                .header-button { font-family: 'Google Sans', sans-serif; text-decoration: none; font-size: 12px; padding: 4px 10px; border-radius: 16px; transition: background-color 0.15s ease-in-out; border: 1px solid #669df6; cursor: pointer; font-weight: 500; }
                .header-button:disabled { opacity: 0.5; cursor: not-allowed; }
                .header-button:hover:not(:disabled) { box-shadow: 0 0 8px rgba(66, 133, 244, 0.4); }
                #chat-nav-load-button { background-color: #e8f0fe; color: #1967d2; }
                #chat-nav-load-button:hover:not(:disabled) { background-color: #d2e3fc; }
                #chat-nav-load-button.loading-active { color: #ffffff; background: linear-gradient(90deg, #1967d2, #4285f4, #1967d2); background-size: 200% auto; animation: load-all-flow 2s linear infinite; }
                #chat-nav-loader-status { font-family: 'Google Sans', sans-serif; font-size: 12px; color: var(--ms-on-surface-variant, #9aa0a6); padding: 4px 10px; font-weight: 600; }
                #quicknav-custom-tooltip { position: fixed; z-index: 100000; border-radius: 6px; padding: 8px 12px; font-size: 13px; font-family: 'Google Sans', sans-serif; max-width: 40vw; pointer-events: none; opacity: 0; transition: opacity 0.15s ease-in-out; white-space: pre-wrap; background-color: #f1f3f4; color: #202124; border: 1px solid #dadce0; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
                .response-item-bg .menu-item-text { color: #174ea6; }

                #quicknav-custom-tooltip.lib-fixed-tooltip { z-index: 100002 !important; max-width: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important; background-color: #ffffff !important; border-color: #8ab4f8 !important; }

                body.dark-theme #chat-nav-menu-container { background-color: #191919; border-color: #8ab4f8; }
                body.dark-theme #chat-nav-menu { background-color: #191919; }
                body.dark-theme .chat-nav-menu-item { background-color: #202124; color: #e8eaed; }
                body.dark-theme .chat-nav-menu-item:hover { background-color: #3c4043; }
                body.dark-theme .chat-nav-menu-item.menu-item-focused { background-color: #5f6368; }
                body.dark-theme .chat-nav-menu-item.loading-in-progress { background: linear-gradient(100deg, #202124 20%, #3c4043 40%, #3c4043 60%, #202124 80%); background-size: 200% 100%; animation: quicknav-loading-flow 1.8s linear infinite; }
                body.dark-theme .chat-nav-menu-header { background-color: #191919; border-color: #8ab4f8; }
                body.dark-theme .header-button { background-color: #3c4043; color: #e8eaed; border-color: #8ab4f8; }
                body.dark-theme #chat-nav-load-button { background-color: #28354a; color: #a8c7fa; }
                body.dark-theme .header-button:hover:not(:disabled) { background-color: #5f6368; }
                body.dark-theme #chat-nav-load-button:hover:not(:disabled) { background-color: #3c4043; }
                body.dark-theme #chat-nav-load-button.loading-active { color: #202124; background: linear-gradient(90deg, #8ab4f8, #a8c7fa, #8ab4f8); background-size: 200% auto; animation: load-all-flow 2s linear infinite; }
                
                body.dark-theme #quicknav-custom-tooltip { background-color: #2d2d2d; color: #e0e0e0; border: 1px solid #555; }
                body.dark-theme #quicknav-custom-tooltip.lib-fixed-tooltip { background-color: #202124 !important; border-color: #8ab4f8 !important; }
                body.dark-theme .response-item-bg .menu-item-text { color: var(--ms-primary, #8ab4f8); }

                #quicknav-badge-floater { position: fixed; z-index: 99998; opacity: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; padding: 4px 3px; border-radius: 8px; font-family: 'Google Sans', sans-serif; transition: opacity 0.15s ease-in-out; min-width: 28px; box-sizing: border-box; }
                .quicknav-badge-notransition { transition: none !important; }
                #quicknav-badge-index { font-size: 13px; font-weight: 500; line-height: 1.2; }
                #quicknav-badge-percentage { font-size: 10px; font-weight: 400; line-height: 1.2; border-top: 1px solid rgba(255, 255, 255, 0.3); margin-top: 3px; padding-top: 3px; }
                .prompt-badge-bg { background-color: #5f6368; color: #FFFFFF; }
                .response-badge-bg { background-color: #174ea6; color: #FFFFFF; }
                #chat-nav-menu::-webkit-scrollbar { width: 8px; }
                #chat-nav-menu::-webkit-scrollbar-track { background: #e8eaed; }
                #chat-nav-menu::-webkit-scrollbar-thumb { background-color: #dfe1e5; }
                #chat-nav-menu::-webkit-scrollbar-thumb:hover { background-color: #9aa0a6; }

                .quicknav-menu-resizer { position: absolute; top: 0; bottom: 0; width: 20px; cursor: ew-resize; z-index: 2147483647; touch-action: none; background: transparent; transition: background-color 0.15s; }
                .quicknav-menu-resizer:hover { background-color: rgba(138, 180, 248, 0.2); }
                .quicknav-resizer-left { left: -10px; }
                .quicknav-resizer-right { right: -10px; }
                body.quicknav-resizing { cursor: ew-resize !important; user-select: none !important; }
                
                .code-block-nav-container { display: flex; align-items: center; gap: 8px; margin-left: auto; }
                .code-nav-button { background: transparent; border: 1px solid #669df6; color: #8ab4f8; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.15s ease, transform 0.1s ease, border-color 0.15s ease, color 0.15s ease; padding: 0 12px; }
                .code-nav-counter { font-family: 'Google Sans', sans-serif; font-size: 12px; font-weight: 500; color: #8ab4f8; user-select: none; }
                .code-nav-button:hover:not(:disabled) { background-color: rgba(138, 180, 248, 0.08); }
                .code-nav-button:active:not(:disabled) { transform: scale(0.95); }
                .code-nav-button:disabled { opacity: 0.5; cursor: not-allowed; color: var(--ms-on-surface-variant, #9aa0a6); border-color: var(--ms-on-surface-variant, #9aa0a6); }

                ms-prompt-box .text-wrapper, .prompt-box-container .text-wrapper { position: relative !important; }
                ms-prompt-box textarea, .prompt-box-container textarea { resize: none !important; min-height: 40px !important; max-height: 90vh !important; overflow-y: auto !important; }
                .quicknav-custom-resizer { position: absolute; top: 0; right: 0; width: 14px; height: 14px; background-color: #1a73e8; cursor: ns-resize; z-index: 100; clip-path: polygon(0 0, 100% 0, 100% 100%); opacity: 0.15; transition: opacity 0.2s, transform 0.1s; }
                .quicknav-custom-resizer:hover { opacity: 0.9; transform: scale(1.1); }
                
                .quicknav-toast { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); background-color: #202124; color: #fff; padding: 6px 12px; border-radius: 4px; font-family: 'Google Sans', sans-serif; font-size: 13px; pointer-events: none; opacity: 0; z-index: 200; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap; }
                .quicknav-toast.show { animation: quicknav-fade-in-out 2s forwards; }
                body.dark-theme .quicknav-toast { background-color: #e8eaed; color: #202124; }

                .quicknav-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 100000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
                .quicknav-modal-backdrop.visible { display: flex; opacity: 1; }
                
                .quicknav-modal { width: 800px; max-width: 90vw; height: 70vh; background-color: #ffffff; border-radius: 16px; box-shadow: 0 12px 24px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; transform: scale(0.96); transition: transform 0.2s; position: relative; }
                .quicknav-modal-backdrop.visible .quicknav-modal { transform: scale(1); }
                
                .lib-header { padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 8px; }
                .lib-header-top { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
                
                .lib-search-container { flex: 1; position: relative; display: flex; align-items: center; }
                .lib-search-input { width: 100%; padding: 8px 32px 8px 36px; border: 1px solid #dadce0; border-radius: 8px; font-size: 14px; font-family: 'Google Sans', sans-serif; outline: none; background-color: #f1f3f4; color: #202124; transition: background-color 0.2s, box-shadow 0.2s; }
                .lib-search-input:focus { background-color: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border-color: #1a73e8; }
                .lib-search-container svg { position: absolute; left: 10px; color: #5f6368; pointer-events: none; }
                .lib-search-clear { position: absolute; right: 10px; cursor: pointer; color: #5f6368; display: none; font-weight: bold; font-size: 16px; line-height: 1; padding: 4px; }
                .lib-search-clear:hover { color: #202124; }
                
                .lib-actions-group { display: flex; gap: 8px; }
                .lib-btn-primary { background-color: #1a73e8; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .lib-btn-primary:hover { background-color: #1557b0; }
                .lib-btn-secondary { background-color: transparent; color: #5f6368; border: 1px solid #dadce0; padding: 6px 12px; border-radius: 20px; font-size: 13px; cursor: pointer; display: flex; align-items: center; transition: background 0.2s; }
                .lib-btn-secondary:hover { background-color: #f1f3f4; }
                .lib-btn-danger { background-color: #d93025; color: white; border: none; padding: 6px 16px; border-radius: 20px; cursor: pointer; }
                .lib-btn-danger:hover { background-color: #b31412; }
                
                .lib-tags-row { display: flex; gap: 8px; overflow-x: auto; padding: 2px 4px 6px 4px; scrollbar-width: none; }
                .lib-chip { background-color: #e8eaed; border: none; padding: 4px 12px; border-radius: 8px; font-size: 12px; color: #3c4043; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .lib-chip:hover { background-color: #dadce0; }
                .lib-chip.active { background-color: #e8f0fe; color: #1967d2; font-weight: 500; }
                
                .lib-content-list { flex: 1; overflow-y: auto; background-color: #f8f9fa; padding: 16px; display: grid; grid-template-columns: 1fr; gap: 16px; align-content: start; }
                .lib-empty-state { text-align: center; color: #5f6368; margin-top: 40px; font-size: 14px; }
                
                .lib-card { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 6px; position: relative; min-height: 90px; }
                .lib-card:hover, .lib-card.active-tooltip-source { border-color: #8ab4f8; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
                .lib-card.focused { border-color: #1a73e8; box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.3); }
                
                .lib-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .lib-card-title { font-weight: 600; font-size: 14px; color: #202124; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 85%; }
                
                .lib-card-actions { opacity: 0; transition: opacity 0.2s; display: flex; gap: 4px; }
                .lib-card:hover .lib-card-actions, .lib-card.focused .lib-card-actions, .lib-card.active-tooltip-source .lib-card-actions { opacity: 1; }
                .lib-icon-btn { background: transparent; border: none; padding: 4px; border-radius: 4px; color: #5f6368; cursor: pointer; }
                .lib-icon-btn:hover { background-color: #f1f3f4; color: #1a73e8; }
                .lib-icon-btn.delete:hover { background-color: #fce8e6; color: #d93025; }
                
                .lib-card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 2px; }
                .lib-card-tags span { font-size: 10px; background-color: #f1f3f4; padding: 2px 6px; border-radius: 4px; color: #5f6368; }
                
                .lib-card-preview { font-size: 13px; color: #5f6368; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }
                
                .lib-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #ffffff; z-index: 10; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; opacity: 0; pointer-events: none; transform: scale(0.98); transition: opacity 0.2s ease, transform 0.2s ease; }
                .lib-overlay.visible { opacity: 1; pointer-events: auto; transform: scale(1); }
                
                .lib-editor-container { display: flex; flex-direction: column; height: 100%; gap: 12px; }
                .lib-editor-container h3 { margin: 0 0 8px 0; font-size: 18px; color: #202124; }
                .lib-input-full { padding: 8px 12px; border: 1px solid #dadce0; border-radius: 4px; font-family: 'Google Sans', sans-serif; font-size: 14px; outline: none; background-color: #f1f3f4; color: #202124; }
                .lib-input-full:focus { border-color: #1a73e8; background-color: #ffffff; }
                .lib-textarea-full { flex: 1; padding: 12px; border: 1px solid #dadce0; border-radius: 4px; font-family: 'Roboto Mono', monospace; font-size: 13px; outline: none; resize: none; background-color: #f1f3f4; color: #202124; }
                .lib-textarea-full:focus { border-color: #1a73e8; background-color: #ffffff; }
                
                /* Autocomplete & Palette in Dropdown */
                .lib-suggestions-menu { position: absolute; background: white; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-height: 250px; overflow-y: auto; z-index: 20; display: flex; flex-direction: column; width: 220px; }
                .lib-suggestion-item { padding: 8px 12px; cursor: pointer; font-size: 13px; color: #202124; display: flex; align-items: center; gap: 8px; }
                .lib-suggestion-item:hover { background-color: #f1f3f4; }
                .lib-suggestion-color { width: 10px; height: 10px; border-radius: 50%; }
                
                .lib-suggestion-create-row { display: flex; flex-direction: column; padding: 8px 12px; border-top: 1px solid #f1f3f4; gap: 6px; }
                .lib-suggestion-create-label { font-size: 12px; color: #5f6368; font-weight: 500; }
                .lib-suggestion-palette { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; }
                .lib-suggestion-palette-item { width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: 1px solid rgba(0,0,0,0.1); }
                .lib-suggestion-palette-item:hover { transform: scale(1.2); }

                /* Color Picker Global Styles */
                #lib-color-picker { background-color: #ffffff; border: 1px solid #dadce0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                body.dark-theme #lib-color-picker { background-color: #202124; border-color: #5f6368; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }

                .lib-editor-toolbar { display: flex; gap: 8px; padding-bottom: 4px; }
                .lib-btn-text { background: none; border: none; color: #1a73e8; font-size: 12px; font-weight: 500; cursor: pointer; padding: 0; }
                .lib-btn-text:hover { text-decoration: underline; }
                .lib-overlay-footer { margin-top: auto; display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; border-top: 1px solid #f1f3f4; }
                
                .lib-confirm-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; }
                .lib-confirm-box { background: #fff; border: 1px solid #dadce0; border-radius: 12px; padding: 24px; text-align: center; max-width: 320px; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .lib-confirm-box h3 { margin: 0 0 8px 0; color: #d93025; font-size: 18px; }
                .lib-confirm-box p { color: #5f6368; margin-bottom: 20px; font-size: 14px; }
                .lib-confirm-actions { display: flex; justify-content: center; gap: 12px; }

                .lib-io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1; min-height: 0; }
                .lib-io-col { display: flex; flex-direction: column; gap: 10px; padding: 16px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0; }
                .lib-io-col h4 { margin: 0 0 8px 0; font-size: 14px; color: #202124; }
                .lib-io-desc { font-size: 12px; color: #5f6368; margin-bottom: 8px; }
                
                body.dark-theme .quicknav-modal { background-color: #202124; }
                body.dark-theme .lib-header { background-color: #202124; border-bottom-color: #5f6368; }
                body.dark-theme .lib-search-input { background-color: #303134; border-color: #5f6368; color: #e8eaed; }
                body.dark-theme .lib-search-input:focus { background-color: #202124; border-color: #8ab4f8; }
                body.dark-theme .lib-search-clear { color: #9aa0a6; }
                body.dark-theme .lib-search-clear:hover { color: #e8eaed; }
                body.dark-theme .lib-content-list { background-color: #171717; }
                body.dark-theme .lib-card { background-color: #2d2e30; border-color: #5f6368; }
                body.dark-theme .lib-card:hover, body.dark-theme .lib-card.active-tooltip-source { border-color: #8ab4f8; background-color: #303134; }
                body.dark-theme .lib-card.focused { border-color: #8ab4f8; box-shadow: 0 0 0 2px rgba(138, 180, 248, 0.3); }
                body.dark-theme .lib-card-title { color: #e8eaed; }
                body.dark-theme .lib-icon-btn { color: #9aa0a6; }
                body.dark-theme .lib-icon-btn:hover { background-color: #3c4043; color: #8ab4f8; }
                body.dark-theme .lib-icon-btn.delete:hover { background-color: #410e0b; color: #f28b82; }
                body.dark-theme .lib-card-tags span { background-color: #3c4043; color: #9aa0a6; }
                body.dark-theme .lib-card-preview { color: #9aa0a6; }
                body.dark-theme .lib-chip { background-color: #303134; color: #e8eaed; }
                body.dark-theme .lib-chip:hover { background-color: #3c4043; }
                body.dark-theme .lib-chip.active { background-color: #174ea6; color: #ffffff; }
                body.dark-theme .lib-btn-secondary { border-color: #5f6368; color: #e8eaed; }
                body.dark-theme .lib-btn-secondary:hover { background-color: #3c4043; }
                body.dark-theme .lib-overlay { background-color: #202124; }
                body.dark-theme .lib-editor-container h3 { color: #e8eaed; }
                body.dark-theme .lib-input-full { background-color: #303134; border-color: #5f6368; color: #e8eaed; }
                body.dark-theme .lib-textarea-full { background-color: #303134; border-color: #5f6368; color: #e8eaed; }
                body.dark-theme .lib-input-full:focus, body.dark-theme .lib-textarea-full:focus { border-color: #8ab4f8; background-color: #202124; }
                body.dark-theme .lib-overlay-footer { border-top-color: #3c4043; }
                body.dark-theme .lib-btn-text { color: #8ab4f8; }
                body.dark-theme .lib-btn-separator::after { background-color: #9aa0a6; opacity: 0.3; }
                body.dark-theme .lib-empty-state { color: #9aa0a6; }
                
                body.dark-theme .lib-confirm-box { background-color: #2d2d2d; border-color: #5f6368; }
                body.dark-theme .lib-confirm-box h3 { color: #f28b82; }
                body.dark-theme .lib-confirm-box p { color: #e8eaed; }
                
                body.dark-theme .lib-io-col { background-color: #303134; border-color: #5f6368; }
                body.dark-theme .lib-io-col h4 { color: #e8eaed; }
                body.dark-theme .lib-io-desc { color: #9aa0a6; }

                body.dark-theme .lib-suggestions-menu { background-color: #202124; border-color: #5f6368; }
                body.dark-theme .lib-suggestion-item { color: #e8eaed; }
                body.dark-theme .lib-suggestion-item:hover { background-color: #3c4043; }
                body.dark-theme .lib-suggestion-create-row { border-top-color: #3c4043; }
                body.dark-theme .lib-suggestion-create-label { color: #9aa0a6; }

                body.dark-theme #chat-nav-menu::-webkit-scrollbar-track { background: #202124; }
                body.dark-theme #chat-nav-menu::-webkit-scrollbar-thumb { background-color: #5f6368; }
                body.dark-theme #chat-nav-menu::-webkit-scrollbar-thumb:hover { background-color: #9aa0a6; }
            `;
            document.head.appendChild(styleSheet);
        },

// Waits for an element to appear using MutationObserver instead of polling
        waitForElement(selector, callback) {
            const existing = document.querySelector(selector);
            if (existing) {
                callback(existing);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    if (this.activeObservers) this.activeObservers.delete(obs);
                    callback(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            if (this.activeObservers) this.activeObservers.add(observer);
        },

// Toggles the settings menu with dynamic positioning based on screen location
        toggleSettingsMenu(e, forceState = null) {
            e.stopPropagation();
            const dropdown = document.getElementById('quicknav-settings-dropdown');
            const trigger = e.currentTarget;
            
            if (dropdown && trigger) {
                const isVisible = dropdown.classList.contains('visible');
                const shouldOpen = forceState !== null ? forceState : !isVisible;
                
                if (!shouldOpen) {
                    dropdown.classList.remove('visible');
                    trigger.classList.remove('active');
                } else {
                    StyleManager.updateUIDisplay();

                    dropdown.classList.add('visible');
                    trigger.classList.add('active');
                    
                    const rect = trigger.getBoundingClientRect();
                    const menuWidth = dropdown.offsetWidth;
                    const menuHeight = dropdown.offsetHeight;
                    const viewportHeight = window.innerHeight;
                    
                    let leftPos = rect.right - menuWidth;
                    if (leftPos < 4) leftPos = rect.left; 
                    if (leftPos + menuWidth > window.innerWidth) leftPos = window.innerWidth - menuWidth - 10;

                    const spaceBelow = viewportHeight - rect.bottom;
                    const spaceAbove = rect.top;

                    if (spaceBelow > menuHeight || spaceBelow > spaceAbove) {
                        dropdown.style.top = `${rect.bottom + 6}px`;
                        dropdown.style.bottom = 'auto';
                    } else {
                        dropdown.style.top = 'auto';
                        dropdown.style.bottom = `${viewportHeight - rect.top + 6}px`; 
                    }
                    
                    dropdown.style.left = `${leftPos}px`;
                }
            }
        },

// Closes the settings menu if clicked outside.
        closeSettingsMenu(e) {
            const dropdown = document.getElementById('quicknav-settings-dropdown');
            const trigger = document.querySelector('.quicknav-dropdown-trigger');
            
            if (dropdown && dropdown.classList.contains('visible')) {
                if (!dropdown.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
                    dropdown.classList.remove('visible');
                    if (trigger) trigger.classList.remove('active');
                }
            }
        },

// Creates DOM elements and sets up reactive injections for both Footer and Header
        createAndInjectUI() {
            if (!document.getElementById('quicknav-header-sep-style')) {
                const style = document.createElement('style');
                style.id = 'quicknav-header-sep-style';
                style.textContent = `
                    .quicknav-header-sep { position: relative; }
                    .quicknav-header-sep::after {
                        content: '';
                        position: absolute;
                        right: -6px;
                        top: 10px;
                        bottom: 10px;
                        width: 1px;
                        background-color: var(--ms-on-surface-variant, #5f6368);
                        opacity: 0.3;
                        pointer-events: none;
                    }
                `;
                document.head.appendChild(style);
            }

            const navContainer = document.createElement('div');
            navContainer.id = 'chat-nav-container';
            const pathTop = 'M12 4l-6 6 1.41 1.41L12 6.83l4.59 4.58L18 10z M12 12l-6 6 1.41 1.41L12 14.83l4.59 4.58L18 18z';
            const pathUp = 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z';
            const pathDown = 'M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z';
            const pathBottom = 'M12 12l-6-6 1.41-1.41L12 9.17l4.59-4.58L18 6z M12 20l-6-6 1.41-1.41L12 17.17l4.59-4.58L18 14z';
            const btnTop = this.createButton('nav-top', 'Go to the first message (Shift + Alt + PgUp)', pathTop);
            const btnUp = this.createButton('nav-up', 'Go to the previous message (Alt + PgUp)', pathUp);
            const counterWrapper = document.createElement('div');
            counterWrapper.className = 'counter-wrapper';
            const counter = document.createElement('span');
            counter.id = 'chat-nav-counter';
            counter.title = 'Open navigation menu (Alt + M)';
            counter.tabIndex = 0;
            counter.setAttribute('role', 'button');
            const currentNumSpan = document.createElement('span');
            currentNumSpan.id = 'chat-nav-current-num';
            counter.appendChild(currentNumSpan);
            const separatorSpan = document.createElement('span');
            separatorSpan.id = 'chat-nav-separator';
            separatorSpan.textContent = ' / ';
            counter.appendChild(separatorSpan);
            const totalNumSpan = document.createElement('span');
            totalNumSpan.id = 'chat-nav-total-num';
            counter.appendChild(totalNumSpan);
            const btnDown = this.createButton('nav-down', 'Go to the next message (Alt + PgDown)', pathDown);
            const btnBottom = this.createButton('nav-bottom', 'Go to the last message (Shift + Alt + PgDown)', pathBottom);
            let menuContainer = document.getElementById('chat-nav-menu-container');
            if (!menuContainer) {
                menuContainer = document.createElement('div');
                menuContainer.id = 'chat-nav-menu-container';
                menuContainer.tabIndex = -1;
                menuContainer.setAttribute('role', 'menu');
                const resizerLeft = document.createElement('div');
                resizerLeft.className = 'quicknav-menu-resizer quicknav-resizer-left';
                resizerLeft.title = 'Drag to resize';
                const resizerRight = document.createElement('div');
                resizerRight.className = 'quicknav-menu-resizer quicknav-resizer-right';
                resizerRight.title = 'Drag to resize';
                menuContainer.append(resizerLeft, resizerRight);
                this.setupMenuResizer(resizerLeft, -1, menuContainer);
                this.setupMenuResizer(resizerRight, 1, menuContainer);
                document.body.appendChild(menuContainer);
            }
            counterWrapper.append(counter);
            
            const settingsWrapper = document.createElement('div');
            settingsWrapper.className = 'quicknav-settings-wrapper';
            settingsWrapper.style.cssText = `
                position: absolute; 
                right: max(10px, calc(((100% - var(--quicknav-chat-width, 1000px)) / 2) + 10px)); 
                top: 50%; 
                transform: translateY(-50%); 
                display: flex; 
                align-items: center; 
                gap: 4px;
                z-index: 10; 
                margin: 0;
            `;
            const pathLib = 'M3 7h26v1H3z M3 12h26v1H3z M3 17h26v1H3z';
            const btnLib = this.createButton('nav-action-lib', 'Toggle Prompt Library (Alt + L)', pathLib);
            btnLib.classList.add('quicknav-resize-btn', 'lib-btn-separator');
            btnLib.style.setProperty('color', '#8ab4f8', 'important');
            btnLib.style.width = '44px';
            btnLib.style.borderRadius = '8px';
            
            const libSvg = btnLib.querySelector('svg');
            if (libSvg) {
                libSvg.setAttribute('viewBox', '0 0 32 24');
                libSvg.setAttribute('width', '32px');
            }

            btnLib.addEventListener('click', () => PromptLibrary.toggle());
            btnLib.addEventListener('mouseenter', () => {
                btnLib.style.setProperty('filter', 'drop-shadow(0 0 3px #8ab4f8)', 'important');
            });
            btnLib.addEventListener('mouseleave', () => {
                btnLib.style.removeProperty('filter');
            });

            let libHoverTimeout;
            btnLib.addEventListener('mouseenter', () => {
                if (!StyleManager.HOVER_MENU.enabled) return;
                clearTimeout(libHoverTimeout);
                libHoverTimeout = setTimeout(() => {
                    if (!document.getElementById('quicknav-lib-backdrop')?.classList.contains('visible')) {
                        PromptLibrary.open();
                    }
                }, StyleManager.HOVER_DELAY.current);
            });
            btnLib.addEventListener('mouseleave', () => clearTimeout(libHoverTimeout));

            const pathClear = 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z';
            const btnClear = this.createButton('nav-action-clear', 'Double-click to clear prompt (Alt + Shift + Backspace)', pathClear);
            btnClear.classList.add('quicknav-resize-btn');
            btnClear.addEventListener('click', (e) => { PromptActions.clear(false); });
            btnClear.addEventListener('dblclick', (e) => { PromptActions.clear(true); });
            btnClear.addEventListener('mouseenter', () => {
                btnClear.style.setProperty('color', '#d93025', 'important');
            });
            btnClear.addEventListener('mouseleave', () => {
                btnClear.style.removeProperty('color');
            });
            const pathCopy = 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z';
            const btnCopy = this.createButton('nav-action-copy', 'Copy prompt (Alt + C)', pathCopy);
            btnCopy.classList.add('quicknav-resize-btn');
            btnCopy.addEventListener('click', () => { PromptActions.copy(); });
            const pathPaste = 'M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z';
            const btnPaste = this.createButton('nav-action-paste', "Paste to prompt (Alt + V) • Requires 'Allow' in Site Settings", pathPaste);
            btnPaste.classList.add('quicknav-resize-btn');
            btnPaste.addEventListener('click', () => { PromptActions.paste(); });
            const leftWrapper = document.createElement('div');
            leftWrapper.className = 'quicknav-left-wrapper';
            leftWrapper.style.cssText = `
                position: absolute; 
                left: max(10px, calc(((100% - var(--quicknav-chat-width, 1000px)) / 2) + 10px)); 
                top: 50%; 
                transform: translateY(-50%); 
                display: flex; 
                align-items: center; 
                gap: 4px;
                z-index: 10; 
                margin: 0;
            `;
            leftWrapper.appendChild(btnLib);
            leftWrapper.appendChild(btnClear);
            leftWrapper.appendChild(btnCopy);
            leftWrapper.appendChild(btnPaste);
            const pathUnderscore = 'M4 20h16v2H4z'; 
            const btnExpandDown = this.createButton('nav-expand-down', 'Decrease prompt height (Alt + Down)', pathUnderscore);
            btnExpandDown.classList.add('quicknav-resize-btn');
            const pathOverscore = 'M4 2h16v2H4z';
            const btnExpandUp = this.createButton('nav-expand-up', 'Increase prompt height (Alt + Up)', pathOverscore);
            btnExpandUp.classList.add('quicknav-resize-btn');
            const resizeGroup = document.createElement('div');
            resizeGroup.style.display = 'flex';
            resizeGroup.style.gap = '0px';
            resizeGroup.appendChild(btnExpandDown);
            resizeGroup.appendChild(btnExpandUp);
            
            const createHeaderButton = () => {
                const triggerBtn = document.createElement('button');
                triggerBtn.id = 'quicknav-header-trigger';
                triggerBtn.className = 'quicknav-dropdown-trigger quicknav-header-sep';
                triggerBtn.title = 'QuickNav Settings';
                triggerBtn.style.cssText = 'height: 40px; width: 40px; margin: 0 10px 0 4px; border-radius: 50%;'; 
                
                const svgDots = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgDots.setAttribute('height', '24px');
                svgDots.setAttribute('viewBox', '0 0 24 24');
                svgDots.setAttribute('width', '24px');
                svgDots.setAttribute('fill', 'var(--ms-primary, #8ab4f8)'); 
                const pathDots = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                pathDots.setAttribute('d', 'M6 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm12 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z');
                svgDots.appendChild(pathDots);
                triggerBtn.appendChild(svgDots);
                
                triggerBtn.addEventListener('click', this.toggleSettingsMenu.bind(this));
                triggerBtn.addEventListener('mouseenter', (e) => {
                    clearTimeout(this.settingsCloseTimeout);
                    this.toggleSettingsMenu(e, true);
                });
                
                const closeMenuDelayed = () => {
                    this.settingsCloseTimeout = setTimeout(() => {
                        const dropdown = document.getElementById('quicknav-settings-dropdown');
                        const trigger = document.getElementById('quicknav-header-trigger');
                        if (dropdown) dropdown.classList.remove('visible');
                        if (trigger) trigger.classList.remove('active');
                    }, 300);
                };
                
                triggerBtn.addEventListener('mouseleave', closeMenuDelayed);
                return triggerBtn;
            };

            const headerBtn = createHeaderButton();

            const createFavoritesButton = () => {
                const favBtn = document.createElement('button');
                favBtn.id = 'quicknav-fav-trigger';
                favBtn.className = 'quicknav-dropdown-trigger';
                favBtn.title = 'Favorites';
                favBtn.style.cssText = 'height: 40px; width: 40px; margin: 0; border-radius: 50%;';
                
                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const menu = document.getElementById('quicknav-favorites-menu');
                    const trigger = e.currentTarget;
                    if (menu && trigger) {
                        const isVisible = menu.classList.contains('visible');
                        if (isVisible) {
                            menu.classList.remove('visible');
                            trigger.classList.remove('active');
                        } else {
                            FavoritesManager.renderMenu();
                            menu.classList.add('visible');
                            trigger.classList.add('active');
                            const rect = trigger.getBoundingClientRect();
                            menu.style.top = `${rect.bottom + 6}px`;
                            menu.style.left = `${rect.right - 450}px`; 
                        }
                    }
                });
                
                let favCloseTimeout;
                let favOpenTimeout;

                favBtn.addEventListener('mouseenter', () => {
                    clearTimeout(favCloseTimeout);
                    if (StyleManager.HOVER_MENU.enabled) {
                        clearTimeout(favOpenTimeout);
                        favOpenTimeout = setTimeout(() => {
                            const menu = document.getElementById('quicknav-favorites-menu');
                            if (menu && !menu.classList.contains('visible')) {
                                FavoritesManager.renderMenu();
                                menu.classList.add('visible');
                                favBtn.classList.add('active');
                                const rect = favBtn.getBoundingClientRect();
                                menu.style.top = `${rect.bottom + 6}px`;
                                menu.style.left = `${rect.right - 450}px`;
                            }
                        }, StyleManager.HOVER_DELAY.current);
                    }
                });

                favBtn.addEventListener('mouseleave', () => {
                    clearTimeout(favOpenTimeout);
                    favCloseTimeout = setTimeout(() => {
                        const menu = document.getElementById('quicknav-favorites-menu');
                        if (menu && !menu.matches(':hover')) {
                            menu.classList.remove('visible');
                            favBtn.classList.remove('active');
                        }
                    }, 300);
                });

                return favBtn;
            };

            const favBtn = createFavoritesButton();

            let dropdownMenu = document.getElementById('quicknav-settings-dropdown');
            if (!dropdownMenu) {
                dropdownMenu = document.createElement('div');
                dropdownMenu.id = 'quicknav-settings-dropdown';
                dropdownMenu.className = 'quicknav-dropdown-menu';
                const styleControls = StyleManager.createControls();
                dropdownMenu.appendChild(styleControls);
                document.body.appendChild(dropdownMenu);
            }
            
            dropdownMenu.addEventListener('mouseenter', () => clearTimeout(this.settingsCloseTimeout));
            dropdownMenu.addEventListener('mouseleave', () => {
                this.settingsCloseTimeout = setTimeout(() => {
                    dropdownMenu.classList.remove('visible');
                    const trigger = document.getElementById('quicknav-header-trigger');
                    if (trigger) trigger.classList.remove('active');
                }, 300);
            });

            let favoritesMenu = document.getElementById('quicknav-favorites-menu');
            if (!favoritesMenu) {
                favoritesMenu = document.createElement('div');
                favoritesMenu.id = 'quicknav-favorites-menu';
                favoritesMenu.className = 'quicknav-dropdown-menu';
                favoritesMenu.style.width = '450px';
                
                favoritesMenu.addEventListener('mouseenter', () => {
                    const btn = document.getElementById('quicknav-fav-trigger');
                    if (btn) {
                        const evt = new MouseEvent('mouseenter');
                        btn.dispatchEvent(evt);
                    }
                });
                favoritesMenu.addEventListener('mouseleave', () => {
                     const btn = document.getElementById('quicknav-fav-trigger');
                     if (btn) {
                         const evt = new MouseEvent('mouseleave');
                         btn.dispatchEvent(evt);
                     }
                });
                document.body.appendChild(favoritesMenu);
            }

            settingsWrapper.appendChild(resizeGroup);
            navContainer.append(leftWrapper, btnTop, btnUp, counterWrapper, btnDown, btnBottom, settingsWrapper);
            this.navContainerElement = navContainer;
            
            const injectNavBar = (anchor) => {
                if (document.getElementById('chat-nav-container')) return;
                if (anchor && anchor.parentNode) {
                    anchor.parentNode.insertBefore(navContainer, anchor);
                    this.attachNavigationLogic(btnTop, btnUp, btnDown, btnBottom, counter, menuContainer);
                    this.updateCounterDisplay();
                    navContainer.addEventListener('mouseenter', () => {
                        this.isHoveringOnNav = true;
                        this.updateScrollPercentage();
                        this.showBadge();
                    });
                    navContainer.addEventListener('mouseleave', () => {
                        this.isHoveringOnNav = false;
                        this.hideBadge(1000);
                    });
                }
            };

            const ensureHeaderTriggers = () => {
                const toolbarRight = document.querySelector('ms-toolbar .toolbar-right');
                if (toolbarRight) {
                    const existingBtn = document.getElementById('quicknav-header-trigger');
                    const existingFav = document.getElementById('quicknav-fav-trigger');
                    
                    if (!existingBtn || !existingBtn.isConnected) {
                        if (existingBtn) existingBtn.remove();
                        if (existingFav) existingFav.remove();
                        toolbarRight.insertBefore(headerBtn, toolbarRight.firstChild);
                        toolbarRight.insertBefore(favBtn, headerBtn);
                        FavoritesManager.updateButtonState();
                    }
                }
            };

            this.waitForElement('ms-chunk-editor footer, section.chunk-editor-main > footer', injectNavBar);
            
            // Updated to 'ms-prompt-box' to match actual HTML, preventing hanging observer
            this.waitForElement('ms-prompt-box', (inputWrapper) => {
                if (!document.getElementById('chat-nav-container')) {
                    injectNavBar(inputWrapper);
                }
            });

            // Replaced setInterval with MutationObserver for Header Injection
            this.waitForElement('ms-toolbar .toolbar-right', (toolbarRight) => {
                ensureHeaderTriggers();
                const observer = new MutationObserver(() => {
                    ensureHeaderTriggers();
                });
                observer.observe(toolbarRight, { childList: true });
                if (this.activeObservers) this.activeObservers.add(observer);
            });
        },

        createButton(id, title, pathData) {
            const button = document.createElement('button');
            button.id = id;
            button.className = 'chat-nav-button';
            button.title = title;
            button.setAttribute('aria-label', title);
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('height', '24px');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '24px');
            svg.setAttribute('fill', 'currentColor');
            const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute('d', pathData);
            svg.appendChild(path);
            button.appendChild(svg);
            return button;
        },

// Attaches event listeners and logic to the navigation UI buttons and menu.
        attachNavigationLogic(btnTop, btnUp, btnDown, btnBottom, counter, menuContainer) {
            const lastIndex = () => ChatController.allTurns.length - 1;

            ChatController.setupHoldableButton(btnTop, () => {
                ChatController.scrollToAbsoluteTop();
            });

            ChatController.setupHoldableButton(btnUp, async () => {
                const last = lastIndex();
                const scrollContainer = document.querySelector('ms-autoscroll-container');

                if (ChatController.currentIndex === last && last > -1 && scrollContainer) {
                    const currentTurn = ChatController.allTurns[last];
                    const isScrolledPastTop = scrollContainer.scrollTop > currentTurn.offsetTop + 10;
                    if (isScrolledPastTop) {
                        await ChatController.navigateToIndex(last, 'center');
                        return;
                    }
                }

                if (ChatController.currentIndex === 0) {
                    ChatController.scrollToAbsoluteTop();
                    return;
                }
                await ChatController.navigateToIndex(ChatController.currentIndex - 1, 'center');
            });

            ChatController.setupHoldableButton(btnDown, async () => {
                const last = lastIndex();
                if (ChatController.currentIndex < last) {
                    await ChatController.navigateToIndex(ChatController.currentIndex + 1, 'center');
                } else {
                    const scrollContainer = document.querySelector('ms-autoscroll-container');
                    if (!scrollContainer) return;
                    if (ChatController.isDownButtonAtEndToggle) {
                        await ChatController.navigateToIndex(last, 'center');
                        ChatController.isDownButtonAtEndToggle = false;
                    } else {
                        UIManager.hideBadge(0, true);
                        ChatController.isScrollingProgrammatically = true;
                        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
                        setTimeout(() => {
                            ChatController.isScrollingProgrammatically = false;
                            UIManager.showBadge();
                            UIManager.updateScrollPercentage();
                            UIManager.hideBadge(3000);
                            ChatController.focusChatContainer();
                        }, 800);
                        ChatController.isDownButtonAtEndToggle = true;
                    }
                }
            });

            let ignoreNextBottomClick = false;
            const bottomNavAction = async () => {
                UIManager.hideBadge(0, true);
                const last = lastIndex();
                if (ChatController.currentIndex === last) {
                    const scrollContainer = document.querySelector('ms-autoscroll-container');
                    if (scrollContainer) {
                        const isSmooth = !ChatController.isBottomHoldActive;
                        ChatController.isScrollingProgrammatically = true;
                        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: isSmooth ? 'smooth' : 'auto' });
                        setTimeout(() => {
                            ChatController.isScrollingProgrammatically = false;
                            UIManager.showBadge();
                            UIManager.updateScrollPercentage();
                            UIManager.hideBadge(3000);
                            ChatController.focusChatContainer();
                        }, isSmooth ? 800 : 50);
                    }
                } else {
                    await ChatController.navigateToIndex(last, 'center');
                }
            };
            btnBottom.addEventListener('mousedown', (e) => {
                if (ChatController.isBottomHoldActive) return;
                ChatController.bottomHoldTimeout = setTimeout(() => {
                    ChatController.isBottomHoldActive = true;
                    btnBottom.classList.add('auto-click-active');
                    ignoreNextBottomClick = true;
                    bottomNavAction();
                    ChatController.bottomHoldInterval = setInterval(bottomNavAction, 150);
                }, 750);
            });
            const stopBottomHoldDetector = () => { clearTimeout(ChatController.bottomHoldTimeout); };
            btnBottom.addEventListener('mouseup', stopBottomHoldDetector);
            btnBottom.addEventListener('mouseleave', stopBottomHoldDetector);
            btnBottom.addEventListener('click', (e) => {
                if (ignoreNextBottomClick) {
                    ignoreNextBottomClick = false;
                    return;
                }
                if (ChatController.isBottomHoldActive) {
                    ChatController.stopBottomHold();
                } else {
                    if (e.target.closest('#nav-bottom')) {
                        bottomNavAction();
                    }
                }
            });

            counter.addEventListener('click', (e) => { e.stopPropagation(); this.toggleNavMenu(); });
            
            let hoverOpenTimeout = null;

            const handleHoverOpen = () => {
                if (!StyleManager.HOVER_MENU.enabled) return;
                clearTimeout(this.menuCloseTimeout);
                
                if (!menuContainer.classList.contains('visible')) {
                    clearTimeout(hoverOpenTimeout);
                    hoverOpenTimeout = setTimeout(() => {
                        this.toggleNavMenu();
                    }, StyleManager.HOVER_DELAY.current);
                }
            };
            
            const handleHoverClose = () => {
                if (!StyleManager.HOVER_MENU.enabled) return;
                
                clearTimeout(hoverOpenTimeout);

                this.menuCloseTimeout = setTimeout(() => {
                    if (menuContainer.classList.contains('visible')) {
                        this.toggleNavMenu();
                    }
                }, 300);
            };

            counter.addEventListener('mouseenter', handleHoverOpen);
            counter.addEventListener('mouseleave', handleHoverClose);
            
            menuContainer.addEventListener('mouseenter', () => {
                clearTimeout(this.menuCloseTimeout);
                clearTimeout(hoverOpenTimeout);
            });
            menuContainer.addEventListener('mouseleave', handleHoverClose);

            counter.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleNavMenu();
                } else if (e.key === 'Tab' && menuContainer.classList.contains('visible')) {
                    e.preventDefault();
                    const menuList = document.getElementById('chat-nav-menu');
                    const donateBtn = document.getElementById('chat-nav-donate-link');
                    if (e.shiftKey) {
                        if (donateBtn) donateBtn.focus();
                    } else {
                        if (menuList) menuList.focus();
                    }
                }
            });

            menuContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const menuList = document.getElementById('chat-nav-menu');
                    const loadBtn = document.getElementById('chat-nav-load-button');
                    const donateBtn = document.getElementById('chat-nav-donate-link');
                    const activeEl = document.activeElement;

                    if (e.shiftKey) {
                        if (activeEl === menuList) counter.focus();
                        else if (activeEl === loadBtn) menuList.focus();
                        else if (activeEl === donateBtn) loadBtn.focus();
                    } else {
                        if (activeEl === menuList) loadBtn.focus();
                        else if (activeEl === loadBtn) donateBtn.focus();
                        else if (activeEl === donateBtn) counter.focus();
                    }
                    return;
                }

                const items = menuContainer.querySelectorAll('.chat-nav-menu-item');
                let newIndex = ChatController.menuFocusedIndex;
                let shouldUpdateFocus = true;

                switch (e.key) {
                    case 'ArrowDown': e.preventDefault(); if (items.length > 0) newIndex = (ChatController.menuFocusedIndex + 1) % items.length; break;
                    case 'ArrowUp': e.preventDefault(); if (items.length > 0) newIndex = (ChatController.menuFocusedIndex - 1 + items.length) % items.length; break;
                    case 'PageDown': e.preventDefault(); if (items.length > 0) newIndex = Math.min(items.length - 1, ChatController.menuFocusedIndex + ChatController.JUMP_DISTANCE); break;
                    case 'PageUp': e.preventDefault(); if (items.length > 0) newIndex = Math.max(0, ChatController.menuFocusedIndex - ChatController.JUMP_DISTANCE); break;
                    case 'Home': e.preventDefault(); if (items.length > 0) newIndex = 0; break;
                    case 'End': e.preventDefault(); if (items.length > 0) newIndex = items.length - 1; break;
                    case 'Enter':
                        e.preventDefault();
                        const activeEl = document.activeElement;
                        if (activeEl && activeEl.matches('button, a[href]') && menuContainer.contains(activeEl)) {
                            activeEl.click();
                        } else if (ChatController.menuFocusedIndex !== -1 && items[ChatController.menuFocusedIndex]) {
                            items[ChatController.menuFocusedIndex].click();
                        }
                        shouldUpdateFocus = false;
                        break;
                    case 'Escape': e.preventDefault(); this.toggleNavMenu(); shouldUpdateFocus = false; break;
                    default: shouldUpdateFocus = false; break;
                }
                if (shouldUpdateFocus && newIndex !== ChatController.menuFocusedIndex) { this.updateMenuFocus(items, newIndex); }
            });
        },

// Handles mouse movement over the highlighted turn to show/hide the badge.
        _handleTurnMouseMove(e) {
            const hotzoneWidth = 24;
            const rect = this.listenedTurnElement.getBoundingClientRect();
            const cursorX = e.clientX;
            if (cursorX >= rect.left && cursorX <= rect.left + hotzoneWidth ||
                cursorX >= rect.right - hotzoneWidth && cursorX <= rect.right) {
                this.showBadge();
                this.updateScrollPercentage();
            } else {
                this.hideBadge(1000);
            }
        },

        _handleTurnMouseLeave() {
            this.hideBadge(1000);
        },

// Updates the visual highlight, ensuring only one turn is highlighted at a time.
        updateHighlight(oldIndex, newIndex) {
            if (oldIndex > -1 && oldIndex < ChatController.allTurns.length) {
                const oldTurn = ChatController.allTurns[oldIndex];
                const oldTurnContainer = oldTurn.querySelector('.chat-turn-container');
                if (oldTurnContainer) {
                    oldTurnContainer.classList.remove('prompt-turn-highlight', 'response-turn-highlight');
                }
            }

            if (this.listenedTurnElement) {
                this.listenedTurnElement.removeEventListener('mousemove', this._handleTurnMouseMove);
                this.listenedTurnElement.removeEventListener('mouseleave', this._handleTurnMouseLeave);
                this.listenedTurnElement = null;
            }
            const floater = document.getElementById('quicknav-badge-floater');
            if (!floater) return;

            if (newIndex > -1 && newIndex < ChatController.allTurns.length) {
                const newTurn = ChatController.allTurns[newIndex];
                const isPrompt = ChatController.isUserPrompt(newTurn);
                const newContainer = newTurn.querySelector('.chat-turn-container');
                if (newContainer) {
                    newContainer.classList.add(isPrompt ? 'prompt-turn-highlight' : 'response-turn-highlight');
                }
                const badgeIndex = document.getElementById('quicknav-badge-index');
                const badgeClass = isPrompt ? 'prompt-badge-bg' : 'response-badge-bg';
                if (badgeIndex) {
                    badgeIndex.textContent = newIndex + 1;
                }
                floater.className = badgeClass;
                this.listenedTurnElement = newTurn;
                this.listenedTurnElement.addEventListener('mousemove', this._handleTurnMouseMove);
                this.listenedTurnElement.addEventListener('mouseleave', this._handleTurnMouseLeave);
            }
        },

        updateCounterDisplay() {
            let currentNumSpan = document.getElementById('chat-nav-current-num');
            let totalNumSpan = document.getElementById('chat-nav-total-num');
            if (!currentNumSpan || !totalNumSpan) return;
            const current = ChatController.currentIndex > -1 ? ChatController.currentIndex + 1 : '-';
            const total = ChatController.allTurns.length;
            currentNumSpan.textContent = current;
            totalNumSpan.textContent = total;
            currentNumSpan.classList.remove('chat-nav-current-grey', 'chat-nav-current-blue');
            if (ChatController.currentIndex === total - 1 && total > 0) {
                currentNumSpan.classList.add('chat-nav-current-blue');
            } else {
                currentNumSpan.classList.add('chat-nav-current-grey');
            }
        },

// Toggles the visibility and state of the main navigation menu.
        toggleNavMenu() {
            const menuContainer = document.getElementById('chat-nav-menu-container');
            const counter = document.getElementById('chat-nav-counter');
            if (!menuContainer || !counter) return;

            const isVisible = menuContainer.classList.contains('visible');
            if (isVisible) {
                menuContainer.classList.remove('visible');
                const menuList = document.getElementById('chat-nav-menu');
                if (menuList) menuList.tabIndex = -1;
                counter.setAttribute('aria-expanded', 'false');
                document.removeEventListener('click', this.closeNavMenu, true);
                ChatController.stopDynamicMenuLoading();
                ChatController.focusChatContainer();
            } else {
                this.populateNavMenu();
                const newMenuList = document.getElementById('chat-nav-menu');
                if (newMenuList) newMenuList.tabIndex = 0;

                const savedWidth = StyleManager._read('quicknav_menu_custom_width');
                if (savedWidth) {
                    menuContainer.style.width = `${savedWidth}px`;
                } else {
                    const chatContainer = document.querySelector('ms-chunk-editor');
                    if (chatContainer) {
                        const chatWidth = chatContainer.clientWidth;
                        const finalWidth = Math.max(300, Math.min(chatWidth, 800));
                        menuContainer.style.width = `${finalWidth}px`;
                    }
                }

                const counterRect = counter.getBoundingClientRect();
                menuContainer.style.bottom = `${window.innerHeight - counterRect.top + 8}px`;
                menuContainer.style.left = `${counterRect.left + (counterRect.width / 2)}px`;
                menuContainer.style.transform = 'translateX(-50%)';

                const availableSpace = counterRect.top - 18;
                menuContainer.style.maxHeight = `${availableSpace}px`;

                this._proactivelySyncMenuScroll();
                menuContainer.classList.add('visible');
                counter.setAttribute('aria-expanded', 'true');

                const items = newMenuList ? newMenuList.querySelectorAll('.chat-nav-menu-item') : [];
                const initialFocusIndex = ChatController.currentIndex > -1 ? ChatController.currentIndex : 0;
                this.updateMenuFocus(items, initialFocusIndex, false);

                if (newMenuList) {
                    newMenuList.focus();
                } else {
                    menuContainer.focus();
                }

                setTimeout(() => document.addEventListener('click', this.closeNavMenu, true), 0);
            }
        },

// Sets up drag-to-resize logic for the menu handles with improved performance and constraints.
        setupMenuResizer(handle, direction, container) {
            let startX, startWidth, rafId;

            const onMouseMove = (e) => {
                if (rafId) return;

                rafId = requestAnimationFrame(() => {
                    const currentX = e.clientX;
                    const deltaX = (currentX - startX) * direction;
                    
                    let newWidth = startWidth + (deltaX * 2);
                    
                    const maxWidth = window.innerWidth - 32;
                    newWidth = Math.max(300, Math.min(newWidth, maxWidth));
                    
                    container.style.width = `${newWidth}px`;
                    container.style.maxWidth = '100vw'; 
                    
                    rafId = null;
                });
            };

            const onMouseUp = () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.cursor = '';
                document.body.classList.remove('quicknav-resizing');
                
                const currentWidth = parseInt(container.style.width, 10);
                if (currentWidth) {
                    StyleManager._write('quicknav_menu_custom_width', currentWidth);
                }
            };

            handle.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                
                startX = e.clientX;
                startWidth = container.getBoundingClientRect().width;
                
                document.body.style.cursor = 'ew-resize';
                document.body.classList.add('quicknav-resizing');
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        },

// Handles clicks outside the menu to close it.
        closeNavMenu(e) {
            const menuContainer = document.getElementById('chat-nav-menu-container');
            const counter = document.getElementById('chat-nav-counter');
            if (menuContainer && counter && !menuContainer.contains(e.target) && !counter.contains(e.target) && menuContainer.classList.contains('visible')) {
                this.toggleNavMenu();
            }
        },

// Proactively sets the scroll position of the (possibly hidden) nav menu.
        _proactivelySyncMenuScroll() {
            const menuList = document.getElementById('chat-nav-menu');
            if (!menuList) return;

            const items = menuList.querySelectorAll('.chat-nav-menu-item');
            const targetIndex = ChatController.currentIndex;

            if (targetIndex < 0 || targetIndex >= items.length) return;

            const focusedItem = items[targetIndex];
            if (focusedItem) {
                menuList.style.scrollBehavior = 'auto';
                menuList.scrollTop = focusedItem.offsetTop - (menuList.clientHeight / 2) + (focusedItem.clientHeight / 2);
                menuList.style.scrollBehavior = '';
            }
        },

// Updates the text content of a single menu item if the menu is visible.
        updateMenuItemContent(index) {
            const menuContainer = document.getElementById('chat-nav-menu-container');
            if (!menuContainer || !menuContainer.classList.contains('visible')) return;

            const menuList = document.getElementById('chat-nav-menu');
            if (!menuList) return;

            const menuItem = menuList.children[index];
            const turn = ChatController.allTurns[index];
            if (!menuItem || !turn || !turn.cachedContent) return;

            const textSpan = menuItem.querySelector('.menu-item-text');
            if (textSpan) {
                const { display, full } = turn.cachedContent;
                const truncatedText = (display.length > 200) ? display.substring(0, 197) + '...' : display;
                if (textSpan.textContent !== truncatedText) {
                    textSpan.textContent = truncatedText;
                }
                menuItem.dataset.tooltip = full.replace(/\s+/g, ' ');
            }
        },

        updateMenuFocus(items, newIndex, shouldScroll = true) {
            if (!items || items.length === 0 || newIndex < 0 || newIndex >= items.length) return;
            if (ChatController.menuFocusedIndex > -1 && ChatController.menuFocusedIndex < items.length) {
                items[ChatController.menuFocusedIndex].classList.remove('menu-item-focused');
            }
            items[newIndex].classList.add('menu-item-focused');
            if (shouldScroll) {
                const menuList = document.getElementById('chat-nav-menu');
                const focusedItem = items[newIndex];
                if (menuList && focusedItem) {
                    const itemRect = focusedItem.getBoundingClientRect();
                    const menuRect = menuList.getBoundingClientRect();
                    if (itemRect.bottom > menuRect.bottom) {
                        menuList.scrollTop += itemRect.bottom - menuRect.bottom;
                    } else if (itemRect.top < menuRect.top) {
                        menuList.scrollTop -= menuRect.top - itemRect.top;
                    }
                }
            }
            ChatController.menuFocusedIndex = newIndex;
        },

// Extracts text content from a turn with DOM priority and scrollbar fallback
        getTextFromTurn(turn, fromDOMOnly = false) {
            const contentContainer = turn.querySelector('.turn-content');
            if (contentContainer) {
                const clonedContainer = contentContainer.cloneNode(true);
                clonedContainer.querySelectorAll('ms-code-block').forEach(codeBlockElement => {
                    const codeContent = codeBlockElement.querySelector('pre code');
                    if (codeContent) {
                        const pre = document.createElement('pre');
                        pre.textContent = ` [Code Block] `;
                        codeBlockElement.parentNode.replaceChild(pre, codeBlockElement);
                    } else { codeBlockElement.remove(); }
                });
                clonedContainer.querySelectorAll('.author-label, .turn-separator, ms-thought-chunk').forEach(el => el.remove());
                const text = clonedContainer.textContent?.trim().replace(/\s+/g, ' ');
                if (text) {
                    return { display: text, full: text, source: 'dom' };
                }
            }
            if (!fromDOMOnly) {
                const turnId = turn.id;
                if (turnId) {
                    const scrollbarButton = document.getElementById(`scrollbar-item-${turnId.replace('turn-', '')}`);
                    if (scrollbarButton && scrollbarButton.getAttribute('aria-label')) {
                        const labelText = scrollbarButton.getAttribute('aria-label');
                        return { display: labelText, full: labelText, source: 'scrollbar' };
                    }
                }
            }
            return { display: '...', full: 'Content unloaded. Click "Load All" to retrieve.', source: 'fallback' };
        },

// Populates the navigation menu, performing an initial cache fill on first run.
        populateNavMenu() {
            const menuContainer = document.getElementById('chat-nav-menu-container');
            if (!menuContainer) return;
            
            Array.from(menuContainer.children).forEach(child => {
                if (!child.classList.contains('quicknav-menu-resizer')) {
                    child.remove();
                }
            });

            const header = document.createElement('div');
            header.className = 'chat-nav-menu-header';
            const menuList = document.createElement('ul');
            menuList.id = 'chat-nav-menu';
            menuList.tabIndex = -1;

            ChatController.allTurns.forEach((turn, index) => {
                let displayContent;
                if (turn.cachedContent && !turn.isFallbackContent) {
                    displayContent = turn.cachedContent;
                } else {
                    displayContent = this.getTextFromTurn(turn);

                    const isStreaming = !!turn.querySelector('loading-indicator');

                    if (isStreaming) {
                        turn.cachedContent = null;
                        turn.isFallbackContent = true;
                    } else {
                        turn.cachedContent = displayContent;
                        turn.isFallbackContent = displayContent.source === 'fallback';
                    }
                }

                const { display, full } = displayContent;
                const truncatedText = (display.length > 200) ? display.substring(0, 197) + '...' : display;
                const item = document.createElement('li');
                item.className = 'chat-nav-menu-item';
                item.setAttribute('role', 'menuitem');
                const isPrompt = ChatController.isUserPrompt(turn);
                item.classList.add(isPrompt ? 'prompt-item-bg' : 'response-item-bg');
                const numberSpan = document.createElement('span');
                numberSpan.className = `menu-item-number ${isPrompt ? 'prompt-number-color' : 'response-number-color'}`;
                numberSpan.textContent = `${index + 1}.`;
                const textSpan = document.createElement('span');
                textSpan.className = 'menu-item-text';
                textSpan.textContent = truncatedText;
                item.append(numberSpan, textSpan);
                item.dataset.tooltip = full.replace(/\s+/g, ' ');

                item.addEventListener('click', () => {
                    this.toggleNavMenu();
                    ChatController.navigateToIndex(index);
                });
                menuList.appendChild(item);
            });

            menuList.addEventListener('wheel', (e) => {
                const list = e.currentTarget;
                const isScrollable = list.scrollHeight > list.clientHeight;
                const isScrollingUp = e.deltaY < 0;
                const isScrollingDown = e.deltaY > 0;

                if (!isScrollable) {
                    e.preventDefault();
                    return;
                }

                const isAtTop = list.scrollTop === 0;
                const isAtBottom = Math.ceil(list.scrollTop + list.clientHeight) >= list.scrollHeight;

                if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
                    e.preventDefault();
                }
            });

            let tooltipTarget = null;
            menuList.addEventListener('mousemove', e => {
                const currentTarget = e.target.closest('.chat-nav-menu-item');
                if (currentTarget && currentTarget === tooltipTarget && this.customTooltip.style.opacity === '1') {
                    this.positionTooltip(e);
                    return;
                }
                if (currentTarget !== tooltipTarget) {
                    clearTimeout(this.tooltipTimeout);
                    this.customTooltip.style.opacity = '0';
                    tooltipTarget = currentTarget;
                    if (tooltipTarget) {
                        this.tooltipTimeout = setTimeout(() => {
                            if (!tooltipTarget) return;
                            this.customTooltip.textContent = tooltipTarget.dataset.tooltip;
                            if (tooltipTarget.classList.contains('response-item-bg')) {
                                const isDarkMode = document.body.classList.contains('dark-theme');
                                this.customTooltip.style.color = isDarkMode ? 'var(--ms-primary, #8ab4f8)' : '#174ea6';
                            } else {
                                this.customTooltip.style.color = '';
                            }
                            this.customTooltip.style.opacity = '1';
                            requestAnimationFrame(() => this.positionTooltip(e));
                        }, 500);
                    }
                }
            });
            menuList.addEventListener('mouseleave', () => {
                clearTimeout(this.tooltipTimeout);
                this.customTooltip.style.opacity = '0';
                tooltipTarget = null;
            });

            const leftContainer = document.createElement('div');
            leftContainer.className = 'header-controls left';
            const loadButton = document.createElement('button');
            loadButton.id = 'chat-nav-load-button';
            loadButton.className = 'header-button';
            loadButton.textContent = 'Load All';
            loadButton.title = 'Load full text for all messages';
            loadButton.addEventListener('click', (e) => {
                e.stopPropagation();
                ChatController.startDynamicMenuLoading();
            });
            const statusIndicator = document.createElement('span');
            statusIndicator.id = 'chat-nav-loader-status';
            leftContainer.append(loadButton, statusIndicator);
            const titleElement = document.createElement('div');
            titleElement.className = 'quicknav-title google-text-animated';
            titleElement.textContent = 'QuickNav for Google AI Studio';
            const rightContainer = document.createElement('div');
            rightContainer.className = 'header-controls right';
            const donateButton = document.createElement('a');
            donateButton.id = 'chat-nav-donate-link';
            donateButton.href = 'https://nowpayments.io/donation/axl_script';
            donateButton.target = '_blank';
            donateButton.rel = 'noopener noreferrer';
            donateButton.className = 'header-button';
            donateButton.title = 'Support the developer';
            const donateText = document.createElement('span');
            donateText.className = 'donate-button-animated';
            donateText.textContent = 'Donate';
            donateButton.appendChild(donateText);
            donateButton.addEventListener('click', (e) => e.stopPropagation());
            rightContainer.append(donateButton);
            header.append(leftContainer, titleElement, rightContainer);
            menuContainer.appendChild(header);
            menuContainer.appendChild(menuList);
        },

        // Updates the badge's position and content, ensuring it stays within all UI boundaries.
        updateScrollPercentage() {
            const floater = document.getElementById('quicknav-badge-floater');
            const percentageBadge = document.getElementById('quicknav-badge-percentage');
            const scrollContainer = document.querySelector('ms-autoscroll-container');

            if (!floater || !percentageBadge || !scrollContainer || ChatController.currentIndex < 0) {
                if (floater) this.hideBadge(0, true);
                return;
            }

            const currentTurn = ChatController.allTurns[ChatController.currentIndex];
            if (!currentTurn) {
                this.hideBadge(0, true);
                return;
            }

            const rect = currentTurn.getBoundingClientRect();
            const scrollContainerRect = scrollContainer.getBoundingClientRect();
            const turnHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const MIN_VISIBLE_HEIGHT = 40;

            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const isElementVisible = visibleHeight >= MIN_VISIBLE_HEIGHT;

            if (floater.style.opacity === '1' && !isElementVisible) {
                this.hideBadge(0, true);
                return;
            }
            if (!isElementVisible || turnHeight <= 0) {
                return;
            }

            const floaterHeight = floater.offsetHeight || 44;

            const visibleTurnTop = Math.max(rect.top, scrollContainerRect.top);
            const visibleTurnBottom = Math.min(rect.bottom, scrollContainerRect.bottom);
            const idealTop = (visibleTurnTop + visibleTurnBottom) / 2 - (floaterHeight / 2);

            const toolbarBottom = this.toolbarElement ? this.toolbarElement.getBoundingClientRect().bottom : 0;
            const footerTop = this.footerElement ? this.footerElement.getBoundingClientRect().top : viewportHeight;
            const navContainerTop = this.navContainerElement ? this.navContainerElement.getBoundingClientRect().top : viewportHeight;

            const upperBound = Math.max(scrollContainerRect.top + 4, rect.top, toolbarBottom + 4);
            const lowerBound = Math.min(scrollContainerRect.bottom, rect.bottom, footerTop, navContainerTop) - floaterHeight - 4;

            let finalTop = Math.max(upperBound, Math.min(idealTop, lowerBound));
            floater.style.top = `${finalTop}px`;
            floater.style.left = `${rect.right - (floater.offsetWidth / 2)}px`;

            const viewportCenterY = viewportHeight / 2;
            const distanceScrolled = viewportCenterY - rect.top;
            const percentage = (distanceScrolled / turnHeight) * 100;
            const clampedPercentage = Math.max(0, Math.min(percentage, 100));
            percentageBadge.textContent = `${Math.round(clampedPercentage)}%`;
        },

        positionTooltip(e) {
            const tooltip = this.customTooltip;
            if (!tooltip) return;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const tipHeight = tooltip.offsetHeight;
            const tipWidth = tooltip.offsetWidth;
            const margin = 10;
            let top;
            if (tipHeight >= winHeight) {
                top = 0;
            } else {
                top = e.clientY + 15;
                if (top + tipHeight + margin > winHeight) {
                    top = winHeight - tipHeight - margin;
                }
            }
            let left = e.clientX + 100;
            if (left + tipWidth + margin > winWidth) {
                left = winWidth - tipWidth - margin;
            }
            left = Math.max(margin, left);
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    };

    UIManager.closeNavMenu = UIManager.closeNavMenu.bind(UIManager);

    // --- MODULE: Code Block Navigator ---
// Finds code blocks and injects or updates intra-message navigation controls.
    const CodeBlockNavigator = {
        processTurns(allTurns) {
            if (!allTurns) return;
            
            requestAnimationFrame(() => {
                allTurns.forEach(turn => {
                    const codeBlocksInTurn = Array.from(turn.querySelectorAll('ms-code-block'));
                    if (codeBlocksInTurn.length === 0) return;

                    codeBlocksInTurn.forEach((block, index) => {
                        const header = block.querySelector('mat-expansion-panel-header .mat-content');
                        const actionsContainer = header ? header.querySelector('.actions-container') : null;
                        if (!header || !actionsContainer) return;

                        let navContainer = header.querySelector('.code-block-nav-container');

                        if (!navContainer) {
                            navContainer = document.createElement('div');
                            navContainer.className = 'code-block-nav-container';

                            const pathUp = 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z';
                            const pathDown = 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z';

                            const btnUp = this._createNavButton(pathUp);
                            const counter = document.createElement('div');
                            counter.className = 'code-nav-counter';
                            const btnDown = this._createNavButton(pathDown);

                            btnUp.addEventListener('click', (e) => this._handleNavClick(e));
                            btnDown.addEventListener('click', (e) => this._handleNavClick(e));

                            navContainer.append(btnUp, counter, btnDown);
                            actionsContainer.appendChild(navContainer);
                        }

                        const [btnUp, counter, btnDown] = navContainer.children;
                        const totalBlocks = codeBlocksInTurn.length;
                        const currentBlockNum = index + 1;
                        const isFirst = index === 0;
                        const isLast = index === totalBlocks - 1;

                        counter.textContent = `${currentBlockNum} / ${totalBlocks}`;
                        counter.title = `Code block ${currentBlockNum} of ${totalBlocks}`;

                        if (isFirst) {
                            btnUp.dataset.navTarget = 'header';
                            btnUp.title = `Scroll to the header of this block (${currentBlockNum}/${totalBlocks})`;
                        } else {
                            btnUp.dataset.navTarget = 'previous';
                            btnUp.title = `Go to previous block (${currentBlockNum - 1}/${totalBlocks})`;
                        }

                        if (isLast) {
                            btnDown.dataset.navTarget = 'footer';
                            btnDown.title = `Scroll to the footer of this block (${currentBlockNum}/${totalBlocks})`;
                        } else {
                            btnDown.dataset.navTarget = 'next';
                            btnDown.title = `Go to next block (${currentBlockNum + 1}/${totalBlocks})`;
                        }
                    });
                });
            });
        },

        _createNavButton(pathData) {
            const button = document.createElement('button');
            button.className = 'code-nav-button';
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('height', '16px');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '16px');
            svg.setAttribute('fill', 'currentColor');
            const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute('d', pathData);
            svg.appendChild(path);
            button.appendChild(svg);
            return button;
        },

        _handleNavClick(event) {
            event.stopPropagation();
            event.preventDefault();

            const button = event.currentTarget;
            const navTarget = button.dataset.navTarget;
            const currentCodeBlock = button.closest('ms-code-block');
            if (!currentCodeBlock) return;

            const parentTurn = currentCodeBlock.closest('ms-chat-turn');
            if (!parentTurn) return;

            const turnCodeBlocks = Array.from(parentTurn.querySelectorAll('ms-code-block'));
            const currentIndex = turnCodeBlocks.indexOf(currentCodeBlock);

            let targetBlock = null;

            switch (navTarget) {
                case 'header':
                    this._scrollToElement(currentCodeBlock, 'header');
                    break;
                case 'footer':
                    this._scrollToElement(currentCodeBlock, 'footer');
                    break;
                case 'previous':
                    if (currentIndex > 0) {
                        targetBlock = turnCodeBlocks[currentIndex - 1];
                        this._scrollToElement(targetBlock, 'header');
                    }
                    break;
                case 'next':
                    if (currentIndex < turnCodeBlocks.length - 1) {
                        targetBlock = turnCodeBlocks[currentIndex + 1];
                        this._scrollToElement(targetBlock, 'header');
                    }
                    break;
            }
        },

        _scrollToElement(element, position = 'header') {
            if (!element) return;
            ChatController.isScrollingProgrammatically = true;

            const anchor = document.createElement('div');
            let scrollOptions = { behavior: 'smooth', block: 'center' };
            let targetNodeForAnchor;

            if (position === 'header') {
                targetNodeForAnchor = element.querySelector('mat-expansion-panel-header');
                if (targetNodeForAnchor) {
                    anchor.style.cssText = 'position: absolute; height: 0; width: 0; margin-top: -30px;';
                    targetNodeForAnchor.parentNode.insertBefore(anchor, targetNodeForAnchor);
                }
            } else {
                targetNodeForAnchor = element;
                anchor.style.cssText = 'display: block; height: 1px;';
                targetNodeForAnchor.appendChild(anchor);
                scrollOptions.block = 'end';
            }

            if (targetNodeForAnchor) {
                anchor.scrollIntoView(scrollOptions);
            }

            setTimeout(() => {
                anchor.remove();
                ChatController.isScrollingProgrammatically = false;
            }, 700);
        }
    };

// Handles global keyboard shortcuts for navigation and styling.
    const HotkeysManager = {
        pressedKeys: new Set(),
        lastStyleChange: 0,
        keyMap: {
            'Alt_PageUp': '#nav-up',
            'Alt_PageDown': '#nav-down',
            'Shift_Alt_PageUp': '#nav-top',
            'Shift_Alt_PageDown': '#nav-bottom',
            'Alt_KeyM': '#chat-nav-counter', 
            'Alt_KeyL': '#nav-action-lib'
        },

        init() {
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));
            window.addEventListener('blur', this.handleBlur.bind(this));
        },

        getKeyCombination(e) {
            let key = '';
            if (e.shiftKey) key += 'Shift_';
            if (e.altKey) key += 'Alt_';
            key += e.code;
            return key;
        },

        handleKeyDown(e) {
            if (e.altKey && e.code === 'KeyP') {
                const promptInput = document.querySelector('ms-prompt-box textarea') || document.querySelector('.prompt-box-container textarea');
                if (promptInput && document.activeElement !== promptInput) {
                    e.preventDefault();
                    e.stopPropagation();
                    ChatController.focusPromptInput();
                    return;
                }
            }

            if (e.altKey && !e.shiftKey) {
                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    e.stopPropagation();
                    PromptResizer.shiftState(1);
                    return;
                }
                if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    e.stopPropagation();
                    PromptResizer.shiftState(-1);
                    return;
                }
            }

            if (e.altKey) {
                if (e.code === 'KeyC' && !e.shiftKey) { 
                    e.preventDefault();
                    e.stopPropagation();
                    PromptActions.copy();
                    return;
                }
                if (e.code === 'KeyV' && !e.shiftKey) { 
                    e.preventDefault();
                    e.stopPropagation();
                    PromptActions.paste();
                    return;
                }
                if (e.code === 'Backspace' && e.shiftKey) { 
                    e.preventDefault();
                    e.stopPropagation();
                    PromptActions.clear(true); 
                    return;
                }
            }

            if (e.altKey && (e.code === 'Minus' || e.code === 'Equal')) {
                e.preventDefault();
                e.stopPropagation();

                const now = Date.now();
                if (now - this.lastStyleChange < 50) return;
                this.lastStyleChange = now;

                const isShift = e.shiftKey;
                const isPlus = e.code === 'Equal';
                
                const type = isShift ? 'WIDTH' : 'FONT';
                const config = StyleManager[type];
                const step = isPlus ? config.STEP : -config.STEP;

                if (!config.enabled) {
                    StyleManager.toggleSetting(type, true);
                }

                StyleManager.changeValue(type, step);
                return;
            }

            if (e.altKey && e.code === 'Digit0') {
                e.preventDefault();
                e.stopPropagation();
                
                const type = e.shiftKey ? 'WIDTH' : 'FONT';
                
                if (!StyleManager[type].enabled) {
                    StyleManager.toggleSetting(type, true);
                }
                
                StyleManager.resetValue(type);
                return;
            }

            const isTypingArea = e.target.isContentEditable || e.target.closest('[contenteditable="true"]') || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
            
            if (e.repeat || (!e.altKey && isTypingArea)) {
                return;
            }

            const combination = this.getKeyCombination(e);
            const targetSelector = this.keyMap[combination];
            
            if (targetSelector) {
                e.preventDefault();
                e.stopPropagation();
                if (!this.pressedKeys.has(combination)) {
                    this.pressedKeys.add(combination);
                    const targetElement = document.querySelector(targetSelector);
                    if (targetElement) {
                        targetElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, buttons: 1 }));
                    }
                }
            }
        },

        handleKeyUp(e) {
            const releasedCombos = [];
            this.pressedKeys.forEach(combo => {
                const parts = combo.split('_');
                const mainKey = parts[parts.length - 1];
                let isReleased = false;
                
                if (mainKey === e.code) {
                    isReleased = true;
                } else if ((parts.includes('Shift') && (e.code === 'ShiftLeft' || e.code === 'ShiftRight')) || (parts.includes('Alt') && (e.code === 'AltLeft' || e.code === 'AltRight'))) {
                    const requiredAlt = parts.includes('Alt');
                    const requiredShift = parts.includes('Shift');
                    if ((requiredAlt && !e.altKey) || (requiredShift && !e.shiftKey)) {
                        isReleased = true;
                    }
                }
                
                if (isReleased) {
                    releasedCombos.push(combo);
                }
            });

            if (releasedCombos.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                releasedCombos.forEach(combo => {
                    this.pressedKeys.delete(combo);
                    const targetSelector = this.keyMap[combo];
                    if (targetSelector) {
                        const targetElement = document.querySelector(targetSelector);
                        if (targetElement) {
                            targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, buttons: 0 }));
                            targetElement.click(); 
                        }
                    }
                });
            }
        },

        handleBlur() {
            this.pressedKeys.forEach(combo => {
                const targetSelector = this.keyMap[combo];
                if (targetSelector) {
                    const targetElement = document.querySelector(targetSelector);
                    if (targetElement) {
                        targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, buttons: 0 }));
                    }
                }
            });
            this.pressedKeys.clear();
        }
    };

// Manages the prompt input field expansion with 3-state logic (Elevator pattern).
    const PromptResizer = {
        STATE_MIN: 0,
        STATE_MID: 1,
        STATE_MAX: 2,
        
        currentState: 0, 
        
        textarea: null,
        wrapper: null,
        resizerHandle: null,
        styleObserver: null,
        
        keys: {
            mid: 'quicknav_h_collapsed',
            max: 'quicknav_h_expanded'
        },
        
        startHeight: 0,
        startY: 0,
        isInternalResize: false, 
        
        boundHandleClick: null,
        boundStartDrag: null,
        boundDoDrag: null,
        boundStopDrag: null,
        boundInputHandler: null,
        boundDblClick: null,

// Initializes the resizer, setting default state and listeners.
        init() {
            this.injectLockStyles();
            this.currentState = this.STATE_MIN;
            this.isManualExpansion = false; 
            
            this.boundHandleClick = this.handleClick.bind(this);
            this.boundStartDrag = this.startDrag.bind(this);
            this.boundDoDrag = this.doDrag.bind(this);
            this.boundStopDrag = this.stopDrag.bind(this);
            this.boundInputHandler = this.onInput.bind(this);
            this.boundDblClick = this.handleDblClick.bind(this);

            document.addEventListener('click', this.boundHandleClick);
            this.startObserving();
        },

        injectLockStyles() {
            if (document.getElementById('quicknav-lock-styles')) return;
            const style = document.createElement('style');
            style.id = 'quicknav-lock-styles';
            style.textContent = `
                /* Locked: Fixed height for Mid/Max states */
                textarea.quicknav-locked-height {
                    height: var(--quicknav-prompt-height) !important;
                    max-height: 90vh !important;
                    min-height: 40px !important;
                }
                
                /* Limited: Auto-height but capped at Mid state height for Min state */
                textarea.quicknav-limited-height {
                    max-height: var(--quicknav-limit-height) !important;
                    overflow-y: auto !important;
                }
            `;
            document.head.appendChild(style);
        },

        destroy() {
            document.removeEventListener('click', this.boundHandleClick);
            if (this.textarea) {
                this.textarea.removeEventListener('input', this.boundInputHandler);
                this.textarea.classList.remove('quicknav-locked-height', 'quicknav-limited-height');
                this.textarea.style.removeProperty('--quicknav-prompt-height');
                this.textarea.style.removeProperty('--quicknav-limit-height');
            }
            if (this.resizerHandle) {
                this.resizerHandle.removeEventListener('mousedown', this.boundStartDrag);
                this.resizerHandle.removeEventListener('dblclick', this.boundDblClick);
                this.resizerHandle.remove();
            }
            if (this.styleObserver) this.styleObserver.disconnect();
            this.textarea = null;
            this.wrapper = null;
        },

// Continuously watches for the prompt textarea to attach listeners and manage state logic.
        startObserving() {
            const findAndAttach = () => {
                const newTextarea = document.querySelector('ms-prompt-box textarea') || document.querySelector('.prompt-box-container textarea');
                
                if (newTextarea && newTextarea !== this.textarea) {
                    if (this.styleObserver) this.styleObserver.disconnect();
                    if (this.textarea) this.textarea.removeEventListener('input', this.boundInputHandler);
                    
                    this.textarea = newTextarea;
                    this.wrapper = this.textarea.parentElement; 
                    
                    if (this.wrapper) {
                        this.injectResizerHandle();
                        this.textarea.addEventListener('input', this.boundInputHandler);
                        
                        if (this.textarea.value.trim() === '') {
                            this.currentState = this.STATE_MIN;
                        } else {
                            this.currentState = this.STATE_MID;
                        }
                        
                        this.isManualExpansion = false;
                        
                        this.applyState(this.currentState);
                        this.setupStyleObserver();
                    }
                }
                else if (this.textarea && this.textarea.isConnected) {
                    const hasText = this.textarea.value.trim().length > 0;
                    
                    if (hasText) {
                        this.isManualExpansion = false;
                    }

                    if (!hasText && this.currentState !== this.STATE_MIN && !this.isManualExpansion) {
                        this.forceState(this.STATE_MIN);
                    }
                }
            };
            setInterval(findAndAttach, 1000);
            findAndAttach();
        },

        setupStyleObserver() {
            if (this.styleObserver) this.styleObserver.disconnect();
            this.styleObserver = new MutationObserver((mutations) => {
                if (this.isInternalResize) return;
                if (this.currentState === this.STATE_MIN) return;

                for (const mutation of mutations) {
                    if (mutation.attributeName === 'style') this.enforceHeight();
                }
            });
            this.styleObserver.observe(this.textarea, { attributes: true, attributeFilter: ['style'] });
        },

// Handles user input events to auto-expand or auto-collapse.
        onInput() {
            if (this.isInternalResize) return;

            const hasText = this.textarea.value.trim().length > 0;
            
            if (hasText) {
                this.isManualExpansion = false;
            }

            if (!hasText && this.currentState !== this.STATE_MIN && !this.isManualExpansion) {
                this.forceState(this.STATE_MIN);
                return;
            }

            if (this.currentState === this.STATE_MIN && hasText) {
                const midHeight = StyleManager._read(this.keys.mid, 150);
                if (this.textarea.scrollHeight >= (midHeight - 5)) {
                    this.forceState(this.STATE_MID);
                }
            } 
            else {
                this.enforceHeight();
            }
        },

        enforceHeight() {
            if (!this.textarea) return;
            
            let key = null;
            if (this.currentState === this.STATE_MID) key = this.keys.mid;
            else if (this.currentState === this.STATE_MAX) key = this.keys.max;
            
            if (!key) return; 

            const savedHeight = StyleManager._read(key);
            
            if (savedHeight) {
                const varHeight = this.textarea.style.getPropertyValue('--quicknav-prompt-height');
                if (varHeight !== `${savedHeight}px` || !this.textarea.classList.contains('quicknav-locked-height')) {
                    this.isInternalResize = true;
                    this.textarea.style.setProperty('--quicknav-prompt-height', `${savedHeight}px`);
                    this.textarea.classList.add('quicknav-locked-height');
                    setTimeout(() => { this.isInternalResize = false; }, 0);
                }
            }
        },

        injectResizerHandle() {
            if (!this.wrapper) return;
            if (this.wrapper.querySelector('.quicknav-custom-resizer')) return;

            const handle = document.createElement('div');
            handle.className = 'quicknav-custom-resizer';
            handle.title = 'Drag to resize, Double-click to reset';
            
            handle.addEventListener('mousedown', this.boundStartDrag);
            handle.addEventListener('dblclick', this.boundDblClick);
            
            this.wrapper.appendChild(handle);
            this.resizerHandle = handle;
        },

        handleDblClick(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.textarea) return;
            if (this.currentState === this.STATE_MIN) return; 

            const viewportH = window.innerHeight;
            let newHeight;
            let key;

            if (this.currentState === this.STATE_MAX) {
                newHeight = Math.floor(viewportH * 0.80);
                key = this.keys.max;
            } else {
                newHeight = Math.floor(viewportH * 0.15);
                key = this.keys.mid;
            }

            newHeight = Math.max(40, Math.min(newHeight, viewportH * 0.9));
            StyleManager._write(key, newHeight);
            
            this.isInternalResize = true;
            this.textarea.style.setProperty('--quicknav-prompt-height', `${newHeight}px`);
            this.textarea.classList.add('quicknav-locked-height');
            setTimeout(() => { this.isInternalResize = false; }, 50);
        },

        startDrag(e) {
            if (!this.textarea) return;
            e.preventDefault();
            this.startY = e.clientY;
            this.startHeight = parseInt(window.getComputedStyle(this.textarea).height, 10);
            
            if (this.currentState === this.STATE_MIN) {
                this.currentState = this.STATE_MID;
                this.updateIcons(); 
            }

            this.isInternalResize = true;
            document.documentElement.addEventListener('mousemove', this.boundDoDrag, false);
            document.documentElement.addEventListener('mouseup', this.boundStopDrag, false);
        },

        doDrag(e) {
            if (!this.textarea) return;
            const delta = this.startY - e.clientY;
            const newHeight = this.startHeight + delta;
            
            if (newHeight > 40) {
                this.textarea.style.setProperty('--quicknav-prompt-height', `${newHeight}px`);
                this.textarea.classList.add('quicknav-locked-height');
            }
        },

        stopDrag(e) {
            document.documentElement.removeEventListener('mousemove', this.boundDoDrag, false);
            document.documentElement.removeEventListener('mouseup', this.boundStopDrag, false);
            
            if (this.textarea) {
                let key = this.keys.mid;
                if (this.currentState === this.STATE_MAX) key = this.keys.max;
                
                const finalHeight = parseInt(this.textarea.style.getPropertyValue('--quicknav-prompt-height'), 10);
                if (finalHeight) {
                    StyleManager._write(key, finalHeight);
                }
            }
            
            setTimeout(() => { this.isInternalResize = false; }, 50);
        },

        handleClick(e) {
            const btnDown = e.target.closest('#nav-expand-down');
            const btnUp = e.target.closest('#nav-expand-up');

            if (btnDown) {
                e.preventDefault();
                e.stopPropagation();
                btnDown.blur();
                this.shiftState(-1);
            } else if (btnUp) {
                e.preventDefault();
                e.stopPropagation();
                btnUp.blur();
                this.shiftState(1);
            }
        },

// Shifts the resize state up or down (Min <-> Mid <-> Max).
        shiftState(delta) {
            let nextState = this.currentState + delta;
            nextState = Math.max(this.STATE_MIN, Math.min(this.STATE_MAX, nextState));
            
            if (nextState !== this.currentState) {
                if (delta > 0) {
                    this.isManualExpansion = true;
                } else {
                    this.isManualExpansion = false;
                }

                this.currentState = nextState;
                this.applyState(this.currentState);
            }
        },
        
        forceState(newState) {
            if (newState < 0 || newState > 2) return;
            this.currentState = newState;
            this.applyState(this.currentState);
        },

        applyState(state) {
            this.updateIcons();
            
            if (state === this.STATE_MIN) {
                this.isInternalResize = true;
                
                let midHeight = StyleManager._read(this.keys.mid, 150);
                midHeight = Math.max(midHeight, 60); 

                this.textarea.classList.remove('quicknav-locked-height');
                
                this.textarea.style.setProperty('--quicknav-limit-height', `${midHeight}px`);
                this.textarea.classList.add('quicknav-limited-height');
                
                this.textarea.style.removeProperty('--quicknav-prompt-height');
                this.textarea.style.height = ''; 
                
                setTimeout(() => { this.isInternalResize = false; }, 100);
                return;
            }

            let key = (state === this.STATE_MAX) ? this.keys.max : this.keys.mid;
            let defaultVal = (state === this.STATE_MAX) ? 500 : 150;
            
            if (state === this.STATE_MAX) {
                const savedMax = StyleManager._read(this.keys.max);
                const savedMid = StyleManager._read(this.keys.mid, 150);
                if (savedMax && savedMax <= savedMid) {
                    StyleManager._write(this.keys.max, Math.max(savedMid + 100, 500));
                }
            }

            const heightToApply = StyleManager._read(key, defaultVal);
            
            this.isInternalResize = true;
            
            this.textarea.classList.remove('quicknav-limited-height');
            this.textarea.style.removeProperty('--quicknav-limit-height');

            this.textarea.style.setProperty('--quicknav-prompt-height', `${heightToApply}px`);
            this.textarea.classList.add('quicknav-locked-height');
            
            setTimeout(() => { this.isInternalResize = false; }, 100);
        },

        updateIcons() {
            const btnDown = document.getElementById('nav-expand-down');
            const btnUp = document.getElementById('nav-expand-up');
            
            if (btnDown) {
                btnDown.disabled = (this.currentState === this.STATE_MIN);
            }
            if (btnUp) {
                btnUp.disabled = (this.currentState === this.STATE_MAX);
            }
        }
    };

// Ultra-optimized DOM monitor using Native Custom Elements API to prevent layout thrashing during load
    const DOMObserver = {
        observer: null,
        isChatActive: false,
        onChatReady: null,
        onChatDestroyed: null,
        NAV_ID: 'chat-nav-container',
        // We only care about the main editor container
        PRIMARY_TAG: 'MS-CHUNK-EDITOR', 

        start(onReady, onDestroyed) {
            this.onChatReady = onReady;
            this.onChatDestroyed = onDestroyed;
            
            // 1. Fast Path: Check if element exists right now
            if (this.fastCheck()) return;

            // 2. Zero-Overhead Path: Wait for the Web Component definition
            // This allows the browser to load heavy assets without us scanning the DOM
            if (window.customElements) {
                customElements.whenDefined(this.PRIMARY_TAG.toLowerCase()).then(() => {
                    this.fastCheck();
                });
            }
            
            // 3. Background Path: Optimized Observer (Shallow checks only)
            this.observer = new MutationObserver(this.handleMutations.bind(this));
            this.observer.observe(document.body, { childList: true, subtree: true });
        },

        fastCheck() {
            const chatElement = document.querySelector(this.PRIMARY_TAG.toLowerCase());
            if (chatElement && chatElement.isConnected) {
                this.handleFound(chatElement);
                return true;
            }
            return false;
        },

        handleMutations(mutationsList) {
            // During heavy loading, we process ONLY direct tag matches to avoid CPU spikes
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Check added nodes (Injection phase)
                    if (mutation.addedNodes.length > 0) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            const node = mutation.addedNodes[i];
                            // STRICT RULE: No querySelector inside this loop. Only properties.
                            if (node.nodeType === 1 && node.tagName === this.PRIMARY_TAG) {
                                this.handleFound(node);
                                return; // Stop processing immediately
                            }
                        }
                    }
                    
                    // Check removed nodes (Navigation phase)
                    if (this.isChatActive && mutation.removedNodes.length > 0) {
                        for (let i = 0; i < mutation.removedNodes.length; i++) {
                            const node = mutation.removedNodes[i];
                            if (node.nodeType === 1 && node.tagName === this.PRIMARY_TAG) {
                                this.isChatActive = false;
                                this.onChatDestroyed();
                                return;
                            }
                        }
                    }
                }
            }
            
            // Fallback integrity check (rarely needed, throttled via RAF)
            if (this.isChatActive) {
                this.ensureIntegrity();
            }
        },

        handleFound(element) {
            if (this.isChatActive) return;
            this.isChatActive = true;
            // Delay slightly to allow Angular to finish internal hydration
            requestAnimationFrame(() => {
                this.onChatReady(element, element);
            });
        },

        ensureIntegrity() {
            if (!this.rafId) {
                this.rafId = requestAnimationFrame(() => {
                    const navUI = document.getElementById(this.NAV_ID);
                    if (!navUI || !navUI.isConnected) {
                         const chatElement = document.querySelector(this.PRIMARY_TAG.toLowerCase());
                         if (chatElement && chatElement.isConnected) {
                             this.onChatReady(chatElement, chatElement);
                         } else {
                             this.isChatActive = false;
                             this.onChatDestroyed();
                         }
                    }
                    this.rafId = null;
                });
            }
        }
    };

// --- MAIN APP ORCHESTRATOR ---
// Initializes and coordinates all modules.
    const QuickNavApp = {
        init() {
            DOMObserver.start(
                this.handleChatReady.bind(this),
                this.handleChatDestroyed.bind(this)
            );
            HotkeysManager.init();
        },

        handleChatReady(chatContainer, uiAnchor) {
            try {
                UIManager.create(uiAnchor);
                ChatController.init(chatContainer);
                PromptResizer.init();
            } catch (e) {
                console.error('[QuickNav] Error during UI initialization:', e);
            }
        },

        handleChatDestroyed() {
            UIManager.destroy();
            ChatController.destroy();
            PromptResizer.destroy();
        }
    };

    QuickNavApp.init();

})();