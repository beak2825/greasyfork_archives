// ==UserScript==
// @name         Weebcentral on Steroids(extra features)
// @namespace    http://tampermonkey.net/
// @version      56.0
// @description  Improved navigation for Pages and Chapters. Keyboard shortcuts(page:A/D | chapter:W/S). Added a progress bar and Page Counter.
// @author       Nirmal Bhasarkar
// @license      MIT
// @match        https://weebcentral.com/chapters/*
// @icon         https://weebcentral.com/static/images/apple-touch-icon.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553130/Weebcentral%20on%20Steroids%28extra%20features%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553130/Weebcentral%20on%20Steroids%28extra%20features%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================================================
    // --- CONFIGURATION ---
    // This section allows you to customize all features of the script.
    // ====================================================================================

    const CONFIG = {
        // --- Feature Toggles ---
        ENABLE_PROGRESS_BAR: true,
        ENABLE_PAGE_COUNTER: true,
        ENABLE_CLICK_NAVIGATE: true,
        ENABLE_KEYBOARD_SHORTCUTS: true,    // Use keyboard for page & chapter navigation

        // --- General Settings ---
        SCRIPT_PREFIX: 'wcps', // A prefix for all element IDs and classes to prevent conflicts.

        // --- Keyboard Shortcuts ---
        keyboardShortcuts: {
            // Page Navigation
            KEY_PREVIOUS_PAGE: 'd',
            KEY_NEXT_PAGE: 'a',
            // Chapter Navigation
            KEY_PREV_CHAPTER: 's',
            KEY_NEXT_CHAPTER: 'w',
            KEY_PREV_CHAPTER_ALT: 'arrowdown',
            KEY_NEXT_CHAPTER_ALT: 'arrowup'
        },

        // --- Vertical Progress Bar ---
        progressBar: {
            // Sizing and Positioning
            BAR_WIDTH: '30px',
            BAR_LEFT_OFFSET: '0px',
            TRIGGER_WIDTH: '10px',
            TOP_OFFSET: '45px',
            BOTTOM_OFFSET: '45px',
            // Layout Behavior
            SCROLL_THRESHOLD: 18, // Pages above this number will make the bar scrollable.
            // General Style
            BACKGROUND_COLOR: 'rgba(73, 83, 89, 1.0)',
            FONT_FAMILY: 'Inter, sans-serif',
            BAR_BORDER_RADIUS: '15px',
            // Clickable Page Box Colors
            BOX_BORDER_RADIUS: '9999px',
            BAR_FONT_SIZE: '17px',
            TEXT_COLOR: 'rgba(255, 255, 255, 0.6)',
            TEXT_HOVER_COLOR: 'rgba(255, 255, 255, 1)',
            ACTIVE_PAGE_COLOR: '#ffffff',
            ACTIVE_PAGE_BG_COLOR: 'rgba(56, 189, 248, 0.2)',
            HOVER_BORDER: '0.3px solid rgba(1, 1, 12, 1.0)',
            // Page Counter (Bottom Left)
            COUNTER_FONT_SIZE: '17px',
            COUNTER_FONT_WEIGHT: '525',
            COUNTER_TEXT_COLOR: 'rgba(255, 255, 255, 0.5)',
            COUNTER_POSITION: { bottom: '2px', left: '5px' }
        },

        // --- Click to Navigate (for Pages) ---
        clickNavigate: {
            // Sizing
            FIXED_OVERLAY_WIDTH: 520, // in pixels
            // Behavior
            DEBOUNCE_DELAY: 150,      // ms, delay for repositioning to save resources
            CURSOR_IDLE_TIME: 2000,   // ms, before cursor hides
        }
    };

    // ====================================================================================
    // --- GLOBAL VARIABLES & CONSTANTS ---
    // ====================================================================================

    const SCRIPT_NAME = "[Weebcentral Power Suite v56.0]";
    let prevChapterUrl = null;
    let nextChapterUrl = null;

    // ====================================================================================
    // --- HELPER & UTILITY FUNCTIONS ---
    // General-purpose functions used throughout the script.
    // ====================================================================================

    /**
     * Debounces a function to limit the rate at which it gets called.
     * @param {Function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Finds the main manga content element, which contains the images.
     * @returns {HTMLElement|null} The manga content element or null if not found.
     */
    function findMangaContentElement() {
        // This selector targets the specific section containing the manga pages.
        const el = document.querySelector('main > section:nth-of-type(3)');
        // A simple check to ensure it's a valid element with content.
        return (el && el.clientHeight > 200) ? el : null;
    }

    /**
     * Reads the current and total page numbers from hidden input fields on the page.
     * @returns {{current: number|null, total: number|null}} An object with page data.
     */
    function getPageData() {
        let current = null, total = null;
        try {
            const maxPageInput = document.getElementById('max_page');
            if (maxPageInput?.value) total = parseInt(maxPageInput.value, 10);
            const pageButton = document.querySelector("button[x-text=\"'Page ' + page\"]");
            if (pageButton?.textContent) {
                const match = pageButton.textContent.match(/(\d+)/);
                if (match?.[1]) current = parseInt(match[1], 10);
            }
        } catch (e) { /* Suppress errors as this runs frequently */ }
        return { current, total };
    }

    // ====================================================================================
    // --- NAVIGATION LOGIC (PAGE & CHAPTER) ---
    // Functions responsible for handling page and chapter changes.
    // ====================================================================================

    /**
     * Scrolls the main manga image into the vertical center of the viewport.
     * This is triggered after navigating via the progress bar.
     */
    function scrollToMangaContent() {
        // A short delay allows the new page image to render before we scroll to it.
        setTimeout(() => {
            const mangaContent = findMangaContentElement();
            if (mangaContent) {
                mangaContent.scrollIntoView({
                    behavior: 'auto', // 'auto' for an instant jump, 'smooth' for animation.
                    block: 'center'
                });
            }
        }, 100);
    }

    /**
     * Navigates to a specific page number by interacting with the website's page select modal.
     * @param {number} pageNum The page number to navigate to.
     */
    function goToPage(pageNum) {
        try {
            // 1. Open the page selection modal.
            document.querySelector("button[onclick*='page_select_modal.showModal()']")?.click();
            // 2. In the next frame, find and click the correct page button.
            requestAnimationFrame(() => {
                const pageSelectModal = document.getElementById('page_select_modal');
                if (!pageSelectModal) return;
                const pageButtons = pageSelectModal.querySelectorAll('button.btn');
                const targetButton = [...pageButtons].find(btn => btn.textContent.trim() == pageNum);
                if (targetButton) {
                    targetButton.click();
                    // 3. After clicking, scroll the new page into view.
                    scrollToMangaContent();
                } else {
                    // If the page isn't found, close the modal to avoid getting stuck.
                    pageSelectModal.querySelector("form[method='dialog'] button")?.click();
                }
            });
        } catch (e) {
            console.error(`${SCRIPT_NAME} Error in goToPage:`, e);
        }
    }

    /**
     * Simulates a keyboard press event on the document body.
     * This is used to trigger the website's default page navigation.
     * @param {string} key The key to simulate (e.g., 'ArrowLeft', 'ArrowRight').
     */
    function simulateKeyPress(key) {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }));
    }

    /**
     * Updates the website's "PREV" and "NEXT" buttons to navigate between chapters.
     */
    function updateChapterButtons() {
        const allButtons = document.querySelectorAll('main button');
        const prevPageButtons = Array.from(allButtons).filter(btn => btn.textContent.trim().includes('PREV'));
        const nextPageButtons = Array.from(allButtons).filter(btn => btn.textContent.trim().includes('NEXT'));

        const configureButton = (button, url, text) => {
            if (url) {
                // Change the button's action to navigate to the new chapter URL.
                button.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.location.href = url; };
                // Update the button's text.
                const textSpan = button.querySelector('span');
                if (textSpan) textSpan.textContent = text;
                else button.textContent = text;
            } else {
                // If there's no next/prev chapter, hide the button.
                button.style.display = 'none';
            }
        };

        prevPageButtons.forEach(btn => configureButton(btn, prevChapterUrl, 'Prev Chapter'));
        nextPageButtons.forEach(btn => configureButton(btn, nextChapterUrl, 'Next Chapter'));
    }

    /**
     * Fetches the chapter list, finds the current chapter, and determines the URLs for the
     * previous and next chapters.
     */
    async function setupChapterNavigation() {
        try {
            const chapterSelectButton = document.querySelector('button[hx-get*="/chapter-select"]');
            if (!chapterSelectButton) return;

            // Fetch the HTML content of the chapter selection modal.
            const chapterListUrl = new URL(chapterSelectButton.getAttribute('hx-get'), window.location.origin).href;
            const response = await fetch(chapterListUrl);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // Find the currently selected chapter in the list.
            const selectedChapter = doc.getElementById('selected_chapter');
            if (!selectedChapter) return;

            // The website lists chapters from newest to oldest.
            // So the 'next' sibling is the previous chapter, and vice-versa.
            const prevLink = selectedChapter.nextElementSibling;
            const nextLink = selectedChapter.previousElementSibling;

            prevChapterUrl = prevLink?.tagName === 'A' ? prevLink.href : null;
            nextChapterUrl = nextLink?.tagName === 'A' ? nextLink.href : null;

            updateChapterButtons();
        } catch (error) {
            console.error(`${SCRIPT_NAME} Chapter Nav Error:`, error);
        }
    }

    // ====================================================================================
    // --- UI CREATION & STYLING ---
    // Functions that create and style the script's visual elements.
    // ====================================================================================

    /**
     * Injects a single stylesheet for all the script's custom UI.
     */
    function injectCSS() {
        if (document.getElementById(`${CONFIG.SCRIPT_PREFIX}-styles`)) return;
        const style = document.createElement('style');
        style.id = `${CONFIG.SCRIPT_PREFIX}-styles`;
        style.textContent = `
            /* Hide scrollbar on the progress bar */
            #${CONFIG.SCRIPT_PREFIX}-page-list::-webkit-scrollbar { display: none; }
            #${CONFIG.SCRIPT_PREFIX}-page-list { scrollbar-width: none; }

            /* Basic styling for the navigation overlay */
            .${CONFIG.SCRIPT_PREFIX}-nav-overlay {
                position: absolute; display: none; z-index: 9999; cursor: pointer;
            }
            .${CONFIG.SCRIPT_PREFIX}-nav-overlay.${CONFIG.SCRIPT_PREFIX}-cursor-hidden {
                cursor: none;
            }

            /* Prevent text selection highlight on the page counter */
            #${CONFIG.SCRIPT_PREFIX}-page-counter {
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates the DOM elements for the vertical progress bar.
     */
    function createProgressBarUI() {
        if (!CONFIG.ENABLE_PROGRESS_BAR || document.getElementById(`${CONFIG.SCRIPT_PREFIX}-progress-bar-container`)) return;

        const p = { ...CONFIG.progressBar };
        const container = document.createElement('div');
        container.id = `${CONFIG.SCRIPT_PREFIX}-progress-bar-container`;
        Object.assign(container.style, {
            position: 'fixed', top: p.TOP_OFFSET, bottom: p.BOTTOM_OFFSET,
            left: `-${p.BAR_WIDTH}`, width: p.BAR_WIDTH,
            backgroundColor: p.BACKGROUND_COLOR, backdropFilter: 'blur(5px)',
            transition: 'left 0.3s ease-in-out', zIndex: '2147483646',
            display: 'flex', justifyContent: 'center', boxSizing: 'border-box',
            borderRadius: p.BAR_BORDER_RADIUS
        });
        container.addEventListener('mouseleave', () => container.style.left = `-${p.BAR_WIDTH}`);
        container.addEventListener('wheel', (e) => e.stopPropagation());

        const pageList = document.createElement('div');
        pageList.id = `${CONFIG.SCRIPT_PREFIX}-page-list`;
        Object.assign(pageList.style, {
            position: 'relative', width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
        });
        container.appendChild(pageList);
        document.body.append(container);

        document.body.addEventListener('mousemove', (e) => {
            const triggerZone = {
                left: parseInt(p.BAR_LEFT_OFFSET, 10),
                width: parseInt(p.TRIGGER_WIDTH, 10),
                top: parseInt(p.TOP_OFFSET, 10),
                bottom: window.innerHeight - parseInt(p.BOTTOM_OFFSET, 10)
            };
            if (e.clientX >= triggerZone.left && e.clientX < triggerZone.left + triggerZone.width &&
                e.clientY >= triggerZone.top && e.clientY < triggerZone.bottom) {
                container.style.left = p.BAR_LEFT_OFFSET;
            }
        });
    }

    /**
     * Creates the DOM element for the page counter.
     */
    function createPageCounterUI() {
        if (!CONFIG.ENABLE_PAGE_COUNTER || document.getElementById(`${CONFIG.SCRIPT_PREFIX}-page-counter`)) return;

        const p = { ...CONFIG.progressBar };
        const pageCounter = document.createElement('div');
        pageCounter.id = `${CONFIG.SCRIPT_PREFIX}-page-counter`;
        Object.assign(pageCounter.style, {
            position: 'fixed', ...p.COUNTER_POSITION,
            padding: '5px 7px', color: p.COUNTER_TEXT_COLOR, zIndex: '99999',
            fontSize: p.COUNTER_FONT_SIZE, fontFamily: p.FONT_FAMILY,
            fontWeight: p.COUNTER_FONT_WEIGHT, pointerEvents: 'none',
            opacity: '0', transition: 'opacity 0.2s'
        });
        document.body.append(pageCounter);
    }

    /**
     * Creates the invisible overlay for click-to-navigate functionality.
     */
    function createClickNavUI() {
        if (!CONFIG.ENABLE_CLICK_NAVIGATE || document.getElementById(`${CONFIG.SCRIPT_PREFIX}-nav-overlay`)) return;

        const overlay = document.createElement('div');
        overlay.id = `${CONFIG.SCRIPT_PREFIX}-nav-overlay`;
        overlay.className = `${CONFIG.SCRIPT_PREFIX}-nav-overlay`;

        overlay.addEventListener('click', (e) => {
            e.preventDefault(); e.stopImmediatePropagation();
            simulateKeyPress('ArrowRight');
        }, true);

        overlay.addEventListener('contextmenu', (e) => {
            e.preventDefault(); e.stopImmediatePropagation();
            simulateKeyPress('ArrowLeft');
        }, true);

        let idleTimer;
        const cursorHiddenClass = `${CONFIG.SCRIPT_PREFIX}-cursor-hidden`;
        const idleTime = CONFIG.clickNavigate.CURSOR_IDLE_TIME;
        const startTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => overlay.classList.add(cursorHiddenClass), idleTime);
        };
        const resetTimer = () => {
            overlay.classList.remove(cursorHiddenClass);
            startTimer();
        };
        overlay.addEventListener('mouseenter', startTimer);
        overlay.addEventListener('mousemove', resetTimer);
        overlay.addEventListener('mouseleave', () => {
            clearTimeout(idleTimer);
            overlay.classList.remove(cursorHiddenClass);
        });

        document.body.appendChild(overlay);
    }

    // ====================================================================================
    // --- EVENT LISTENERS & OBSERVERS ---
    // Functions that listen for user input and page changes.
    // ====================================================================================

    /**
     * Sets up keyboard shortcuts for both page and chapter navigation.
     */
    function setupKeyboardShortcuts() {
        if (!CONFIG.ENABLE_KEYBOARD_SHORTCUTS) return;

        document.body.addEventListener('keydown', (e) => {
            const targetTagName = e.target.tagName.toLowerCase();
            if (['input', 'textarea', 'select'].includes(targetTagName)) {
                return;
            }

            const key = e.key.toLowerCase();
            const shortcuts = CONFIG.keyboardShortcuts;

            if (key === shortcuts.KEY_PREVIOUS_PAGE.toLowerCase()) {
                simulateKeyPress('ArrowLeft');
            } else if (key === shortcuts.KEY_NEXT_PAGE.toLowerCase()) {
                simulateKeyPress('ArrowRight');
            }

            const prevChapterKeys = [shortcuts.KEY_PREV_CHAPTER.toLowerCase(), shortcuts.KEY_PREV_CHAPTER_ALT.toLowerCase()];
            const nextChapterKeys = [shortcuts.KEY_NEXT_CHAPTER.toLowerCase(), shortcuts.KEY_NEXT_CHAPTER_ALT.toLowerCase()];

            if (prevChapterKeys.includes(key) && prevChapterUrl) {
                e.preventDefault();
                window.location.href = prevChapterUrl;
            } else if (nextChapterKeys.includes(key) && nextChapterUrl) {
                e.preventDefault();
                window.location.href = nextChapterUrl;
            }
        });
    }

    // ====================================================================================
    // --- DYNAMIC UI UPDATES ---
    // Functions that are called repeatedly to keep the UI in sync with the page.
    // ====================================================================================

    /**
     * Updates the progress bar's page numbers, active page highlight.
     */
    function updateProgressBarUI() {
        if (!CONFIG.ENABLE_PROGRESS_BAR) return;

        const { current, total } = getPageData();
        const p = { ...CONFIG.progressBar };
        const pageListElement = document.getElementById(`${CONFIG.SCRIPT_PREFIX}-page-list`);

        if (!pageListElement) return;

        if (total && pageListElement.children.length !== total) {
            pageListElement.innerHTML = '';
            const requiresScrolling = total > p.SCROLL_THRESHOLD;
            pageListElement.style.justifyContent = requiresScrolling ? 'flex-start' : 'space-between';
            pageListElement.style.overflowY = requiresScrolling ? 'auto' : 'hidden';

            for (let i = 1; i <= total; i++) {
                const pageNumDiv = document.createElement('div');
                Object.assign(pageNumDiv.style, {
                    textAlign: 'center', width: '100%', padding: '7px 0',
                    borderRadius: p.BOX_BORDER_RADIUS, boxSizing: 'border-box',
                    border: '0.3px solid transparent', color: p.TEXT_COLOR,
                    fontFamily: p.FONT_FAMILY, fontSize: p.BAR_FONT_SIZE, fontWeight: '500',
                    cursor: 'pointer', transition: 'all 0.2s'
                });
                pageNumDiv.dataset.pageNum = i;
                pageNumDiv.textContent = i;
                pageNumDiv.addEventListener('click', (e) => { e.stopPropagation(); goToPage(i); });
                pageNumDiv.addEventListener('mouseenter', () => {
                    pageNumDiv.style.color = p.TEXT_HOVER_COLOR;
                    if (!pageNumDiv.classList.contains('active-page')) pageNumDiv.style.border = p.HOVER_BORDER;
                });
                pageNumDiv.addEventListener('mouseleave', () => {
                    pageNumDiv.style.border = '0.3px solid transparent';
                    pageNumDiv.style.color = pageNumDiv.classList.contains('active-page') ? p.ACTIVE_PAGE_COLOR : p.TEXT_COLOR;
                });
                pageListElement.appendChild(pageNumDiv);
            }
        }

        if (current) {
            const prevActive = pageListElement.querySelector('.active-page');
            if (prevActive) {
                prevActive.classList.remove('active-page');
                Object.assign(prevActive.style, { backgroundColor: 'transparent', color: p.TEXT_COLOR, fontWeight: '400' });
            }
            const newActive = pageListElement.querySelector(`[data-page-num='${current}']`);
            if (newActive) {
                newActive.classList.add('active-page');
                Object.assign(newActive.style, { backgroundColor: p.ACTIVE_PAGE_BG_COLOR, color: p.ACTIVE_PAGE_COLOR, fontWeight: '800' });
                if (pageListElement.style.overflowY === 'auto') {
                    newActive.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }

    /**
     * Updates the page counter text.
     */
    function updatePageCounterUI() {
        if (!CONFIG.ENABLE_PAGE_COUNTER) return;

        const { current, total } = getPageData();
        const pageCounterElement = document.getElementById(`${CONFIG.SCRIPT_PREFIX}-page-counter`);

        if (pageCounterElement) {
            pageCounterElement.textContent = (current !== null && total !== null) ? `${current}/${total}` : '';
            pageCounterElement.style.opacity = (current !== null && total !== null) ? '1' : '0';
        }
    }

    /**
     * Updates the position and size of the click-to-navigate overlay to match the manga image.
     */
    function positionClickNavOverlay() {
        if (!CONFIG.ENABLE_CLICK_NAVIGATE) return;

        const mangaContent = findMangaContentElement();
        const navOverlay = document.getElementById(`${CONFIG.SCRIPT_PREFIX}-nav-overlay`);
        if (!mangaContent || !navOverlay) return;

        const contentRect = mangaContent.getBoundingClientRect();
        const overlayWidth = CONFIG.clickNavigate.FIXED_OVERLAY_WIDTH;
        const showOverlay = contentRect.height >= 100 && contentRect.width > overlayWidth;

        Object.assign(navOverlay.style, {
            top: `${contentRect.top + window.scrollY}px`,
            left: `${contentRect.right + window.scrollX - overlayWidth}px`,
            width: `${overlayWidth}px`,
            height: `${contentRect.height}px`,
            display: showOverlay ? 'block' : 'none',
        });
    }


    // ====================================================================================
    // --- INITIALIZATION ---
    // Sets up the script and observers when the page loads.
    // ====================================================================================

    /**
     * Sets up a MutationObserver to watch for the chapter button, which is loaded dynamically.
     */
    function initializeChapterNavigation() {
        const observer = new MutationObserver((mutations, obs) => {
            const chapterButton = document.querySelector('button[hx-get*="/chapter-select"]');
            if (chapterButton) {
                setupChapterNavigation();
                obs.disconnect(); // Stop observing once the element is found.
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    /**
     * Sets up a MutationObserver to watch for page changes and keep the UI updated.
     */
    function startPageObserver() {
        const debouncedPositioner = debounce(positionClickNavOverlay, CONFIG.clickNavigate.DEBOUNCE_DELAY);
        const observerTarget = document.querySelector('main');

        if (!observerTarget) {
            console.error(`${SCRIPT_NAME} Could not find <main> element. Falling back to timer.`);
            setInterval(() => {
                updateProgressBarUI();
                updatePageCounterUI();
                positionClickNavOverlay();
            }, 750);
            return;
        }

        const observer = new MutationObserver(() => {
            updateProgressBarUI();
            updatePageCounterUI();
            debouncedPositioner();
        });

        observer.observe(observerTarget, { childList: true, subtree: true });
    }

    /**
     * Main execution function, called when the window has loaded.
     */
    function main() {
        console.log(`${SCRIPT_NAME} Initializing.`);
        injectCSS();
        createProgressBarUI();
        createPageCounterUI();
        createClickNavUI();
        setupKeyboardShortcuts();
        initializeChapterNavigation();

        // Perform initial UI setup and position checks.
        updateProgressBarUI();
        updatePageCounterUI();
        setTimeout(positionClickNavOverlay, 500); // Delay to allow images to load.
        window.addEventListener('resize', debounce(positionClickNavOverlay, CONFIG.clickNavigate.DEBOUNCE_DELAY));

        startPageObserver();
    }

    // Start the main execution after the page has fully loaded.
    window.addEventListener('load', main);

})();

