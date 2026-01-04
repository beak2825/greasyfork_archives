// ==UserScript==
// @name         NYT Crossword Mobile Optimiser, PKB + Square Screens
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Optimises NYT Crossword for small square screens by replacing header with vertical sidebar and removing the virtual keyboard
// @author       You
// @match        https://www.nytimes.com/crosswords/game/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548563/NYT%20Crossword%20Mobile%20Optimiser%2C%20PKB%20%2B%20Square%20Screens.user.js
// @updateURL https://update.greasyfork.org/scripts/548563/NYT%20Crossword%20Mobile%20Optimiser%2C%20PKB%20%2B%20Square%20Screens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        sidebarWidth: '64px',
        sidebarBgColor: '#f5f5f5',
        buttonSize: '48px',
        transitionDuration: '300ms',
        enableXwordinfoLink: true,
        showNytLogoButton: true,
        showSettingsButton: true,
        showCheatButton: true,
        showPencilButton: true,
        forceMobileInLandscape: true
    };

    let state = {
        isExpanded: false,
        sidebarCreated: false,
        customCheatMenu: null,
        cheatPage: 'main',
        puzzleStarted: false
    };

    function waitForElements() {
        return new Promise((resolve) => {
            const check = () => {
                const grid = document.querySelector('.xwd__board--content, #xwd-board, .xwd__board');
                if (grid) {
                    resolve({ grid });
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    function resetGridSelection() {
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }
        }
        
        if (document.selection && document.selection.clear) {
            document.selection.clear();
        }
        
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        
        const selectedCells = document.querySelectorAll('.xwd__cell--selected, .xwd__cell.selected, .xwd__cell--active, .xwd__cell.active, .xwd__cell--highlighted, .xwd__cell.highlighted');
        selectedCells.forEach(cell => {
            cell.classList.remove('xwd__cell--selected', 'selected', 'xwd__cell--active', 'active', 'xwd__cell--highlighted', 'highlighted');
        });
        
        return true;
    }

    function focusActiveGridCell(retryCount = 0) {
        const activeCell = document.querySelector('.xwd__cell--selected input, .xwd__cell.selected input, .xwd__cell--active input, .xwd__cell.active input');
        
        if (activeCell && activeCell.offsetParent !== null) {
            activeCell.focus();
            if (document.activeElement === activeCell) {
                return true;
            }
        }
        
        const firstInput = document.querySelector('.xwd__cell input, .xwd__board input[type="text"]');
        if (firstInput && firstInput.offsetParent !== null) {
            firstInput.focus();
            if (document.activeElement === firstInput) {
                return true;
            }
        }
        
        const grid = document.querySelector('.xwd__board--content, #xwd-board, .xwd__board');
        if (grid && grid.offsetParent !== null) {
            grid.focus();
            if (document.activeElement === grid) {
                return true;
            }
        }
        
        if (retryCount < 3) {
            setTimeout(() => {
                focusActiveGridCell(retryCount + 1);
            }, 100);
            return false;
        }
        
        return false;
    }

    function calculateNavButtonHeight() {
        const clueBarHeight = (() => {
            const clueBar = document.querySelector('.xwd__clue-bar-mobile--bar');
            if (clueBar) {
                return clueBar.offsetHeight || 60;
            }
            const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--nyt-mobile-cluebar-h');
            return parseFloat(cssVar) || 60;
        })();

        const bottomGroup = document.querySelector('.sidebar-bottom-group');
        if (!bottomGroup) return parseInt(CONFIG.buttonSize);

        const visibleButtons = Array.from(bottomGroup.children).filter(button => {
            if (button.classList.contains('prev') || button.classList.contains('next')) {
                return false;
            }
            const style = window.getComputedStyle(button);
            return style.display !== 'none' && style.visibility !== 'hidden' && button.offsetHeight > 0;
        });

        const buttonCount = visibleButtons.length;
        const minHeight = parseInt(CONFIG.buttonSize);
        const maxHeight = clueBarHeight;
        
        if (buttonCount >= 4) {
            return minHeight;
        } else if (buttonCount <= 2) {
            return maxHeight;
        } else {
            const ratio = (4 - buttonCount) / 2;
            return Math.round(minHeight + (maxHeight - minHeight) * ratio);
        }
    }

    function updateNavButtonHeights() {
        const navHeight = calculateNavButtonHeight();
        const prevButton = document.getElementById('sidebar-prev');
        const nextButton = document.getElementById('sidebar-next');
        
        if (prevButton) prevButton.style.height = `${navHeight}px`;
        if (nextButton) nextButton.style.height = `${navHeight}px`;
    }

    function getExpandIcon(isExpanded) {
        if (isExpanded) {
            return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; pointer-events: none;">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0281 9.96432C18.0281 9.55011 17.6923 9.21432 17.2781 9.21432L14.7855 9.21432V6.72168C14.7855 6.30747 14.4497 5.97168 14.0355 5.97168C13.6213 5.97168 13.2855 6.30747 13.2855 6.72168V9.96432C13.2855 10.3785 13.6213 10.7143 14.0355 10.7143L17.2781 10.7143C17.6923 10.7143 18.0281 10.3785 18.0281 9.96432Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0355 18.028C14.4497 18.028 14.7855 17.6922 14.7855 17.278L14.7855 14.7854L17.2782 14.7854C17.6924 14.7854 18.0282 14.4496 18.0282 14.0354C18.0282 13.6212 17.6924 13.2854 17.2782 13.2854L14.0355 13.2854C13.6213 13.2854 13.2855 13.6212 13.2855 14.0354L13.2855 17.278C13.2855 17.6922 13.6213 18.028 14.0355 18.028Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.96444 18.028C9.55023 18.028 9.21444 17.6922 9.21444 17.278V14.7854H6.7218C6.30759 14.7854 5.9718 14.4496 5.9718 14.0354C5.9718 13.6212 6.30759 13.2854 6.7218 13.2854L9.96444 13.2854C10.3787 13.2854 10.7144 13.6212 10.7144 14.0354L10.7144 17.278C10.7144 17.6922 10.3787 18.028 9.96444 18.028Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.97183 9.96432C5.97183 9.55011 6.30761 9.21432 6.72183 9.21432H9.21447L9.21447 6.72168C9.21447 6.30747 9.55026 5.97168 9.96447 5.97168C10.3787 5.97168 10.7145 6.30747 10.7145 6.72168L10.7145 9.96432C10.7145 10.3785 10.3787 10.7143 9.96447 10.7143L6.72183 10.7143C6.30761 10.7143 5.97183 10.3785 5.97183 9.96432Z" fill="currentColor"></path>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; pointer-events: none;">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6642 6.34302C13.6642 6.75723 14 7.09302 14.4142 7.09302L16.9068 7.09302V9.58566C16.9068 9.99987 17.2426 10.3357 17.6568 10.3357C18.071 10.3357 18.4068 9.99987 18.4068 9.58566V6.34302C18.4068 5.9288 18.071 5.59302 17.6568 5.59302L14.4142 5.59302C14 5.59302 13.6642 5.9288 13.6642 6.34302Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6568 13.6641C17.2426 13.6641 16.9068 13.9999 16.9068 14.4141L16.9068 16.9067L14.4142 16.9067C13.9999 16.9067 13.6642 17.2425 13.6642 17.6567C13.6642 18.071 13.9999 18.4067 14.4142 18.4067L17.6568 18.4067C18.071 18.4067 18.4068 18.071 18.4068 17.6567L18.4068 14.4141C18.4068 13.9999 18.071 13.6641 17.6568 13.6641Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.34311 13.6641C6.75732 13.6641 7.09311 13.9999 7.09311 14.4141L7.09311 16.9067L9.58575 16.9067C9.99996 16.9067 10.3357 17.2425 10.3357 17.6567C10.3357 18.071 9.99996 18.4067 9.58575 18.4067L6.34311 18.4067C5.92889 18.4067 5.59311 18.071 5.59311 17.6567L5.59311 14.4141C5.59311 13.9999 5.92889 13.6641 6.34311 13.6641Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3357 6.34302C10.3357 6.75723 9.99993 7.09302 9.58572 7.09302L7.09308 7.09302L7.09308 9.58566C7.09308 9.99987 6.75729 10.3357 6.34308 10.3357C5.92887 10.3357 5.59308 9.99987 5.59308 9.58566L5.59308 6.34302C5.59308 5.9288 5.92887 5.59302 6.34308 5.59302L9.58572 5.59302C9.99993 5.59302 10.3357 5.9288 10.3357 6.34302Z" fill="currentColor"></path>
            </svg>`;
        }
    }

    function createSidebar() {
        if (state.sidebarCreated) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'nyt-mobile-sidebar';
        sidebar.className = 'nyt-mobile-sidebar';

        const styles = `
            :root { --nyt-mobile-cluebar-h: 60px; }
            .nyt-mobile-sidebar {
                position: fixed;
                right: 0;
                top: 0;
                width: ${CONFIG.sidebarWidth};
                height: 100vh;
                background-color: ${CONFIG.sidebarBgColor};
                border-left: 1px solid #e0e0e0;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                transition: all ${CONFIG.transitionDuration} ease;
            }

            .xwd__layout_container--mobile { height: 100vh !important; align-items: flex-start !important; }
            article#puzzle.xwd__layout_puzzle--mobile,
            .xwd__layout_puzzle--mobile,
            .xwd__mobile_layout--board_container,
            .xwd__board { padding: 0 !important; margin: 0 !important; }
            article#puzzle.xwd__layout_puzzle--mobile { max-width: none !important; }
            .xwd__board { position: relative !important; }
            #xwd-board { display: block !important; }

            .nyt-mobile-sidebar-button {
                width: 100%;
                height: ${CONFIG.buttonSize};
                margin: 0;
                padding: 0;
                border: none;
                border-radius: 0;
                background-color: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 12px;
                font-weight: 500;
                color: #333;
                box-sizing: border-box;
            }

            .sidebar-top-group,
            .sidebar-bottom-group {
                width: 100%;
                padding: 0;
                margin: 0;
            }

            .sidebar-bottom-group {
                visibility: hidden;
                opacity: 0;
                transition: opacity 300ms ease, visibility 300ms ease;
            }

            .sidebar-bottom-group.puzzle-started {
                visibility: visible;
                opacity: 1;
            }

            .nyt-mobile-sidebar-button.prev,
            .nyt-mobile-sidebar-button.next {
                background-color: transparent;
                color: #333;
                font-size: 24px;
                font-weight: 400;
                transition: height 0.3s ease;
                min-height: ${CONFIG.buttonSize};
            }

            .nyt-mobile-sidebar-button.timer {
                background-color: #FFECA0;
                color: #333;
                font-size: 14px;
                font-weight: 600;
            }

            .nyt-mobile-sidebar-button.expand {
                background-color: #FBF7EC;
                color: #333;
                font-size: 28px;
                font-weight: 600;
            }

            .nyt-mobile-sidebar-button.expand.expanded {
                background-color: #FE9415;
            }

            .nyt-mobile-sidebar-button.nytlogo {
                background-color: transparent;
                color: #333;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                position: relative;
            }

            .nyt-mobile-sidebar-button.nytlogo img {
                width: 24px;
                height: 24px;
                pointer-events: none;
                display: block;
            }
            
            .nyt-mobile-sidebar-button.help,
            .nyt-mobile-sidebar-button.settings {
                background-color: transparent;
                color: inherit;
            }

            .nyt-sidebar-native-button {
                position: static !important;
                width: 100% !important;
                height: ${CONFIG.buttonSize} !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                border-radius: 0 !important;
                background-color: transparent !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                color: #333 !important;
                box-sizing: border-box !important;
                left: auto !important;
                top: auto !important;
                right: auto !important;
                bottom: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
                transform: none !important;
                z-index: auto !important;
            }

            /* Pencil button specific styles - must come after base .nyt-sidebar-native-button */
            .sidebar-bottom-group .nyt-sidebar-native-button[data-skbtn="pencil"].selected,
            .sidebar-bottom-group .nyt-sidebar-pencil-button.selected,
            .sidebar-bottom-group .hg-button.selected[data-skbtn="pencil"],
            .sidebar-bottom-group div.selected[data-skbtn="pencil"],
            .sidebar-bottom-group [data-pencil-active="true"] {
                background-color: #6BAA64 !important;
            }
            
            .sidebar-bottom-group .nyt-sidebar-native-button[data-skbtn="pencil"]:not(.selected),
            .sidebar-bottom-group .nyt-sidebar-pencil-button:not(.selected),
            .sidebar-bottom-group .hg-button[data-skbtn="pencil"]:not(.selected),
            .sidebar-bottom-group div[data-skbtn="pencil"]:not(.selected) {
                background-color: transparent !important;
            }

            .nyt-sidebar-native-button.selected {
                background-color: #ffffcc !important;
            }

            .nyt-sidebar-native-button {
                position: relative !important;
            }

            .nyt-sidebar-native-button span {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                height: 100% !important;
                font-size: 12px !important;
            }

            .nyt-sidebar-native-button svg {
                width: 24px !important;
                height: 24px !important;
            }

            .nyt-sidebar-native-button img {
                width: 24px !important;
                height: 24px !important;
                pointer-events: none !important;
            }

            .nyt-mobile-sidebar-button i[data-testid="tool-icon"],
            .nyt-mobile-sidebar-button i[class^="xwd__toolbar_icon--"],
            .nyt-mobile-sidebar-button svg {
                display: block;
                width: 24px;
                height: 24px;
                pointer-events: none;
            }
            .nyt-mobile-sidebar-button.help i[class^="xwd__toolbar_icon--"],
            .nyt-mobile-sidebar-button.help svg {
                width: 21px;
                height: 21px;
            }

            #nyt-cheat-overlay {
                position: fixed;
                right: ${CONFIG.sidebarWidth};
                top: 100px;
                width: 200px;
                max-height: 70vh;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                overflow-y: auto;
                display: none;
                flex-direction: column;
            }
            #nyt-cheat-overlay button {
                width: 100%;
                padding: 8px 12px;
                border: none;
                background: none;
                text-align: left;
                font-size: 14px;
                cursor: pointer;
            }
            #nyt-cheat-overlay button:hover {
                background-color: #f0f0f0;
            }

            body.nyt-grid-scroll .xwd__mobile_layout--board_container,
            body.nyt-grid-scroll .xwd__board {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                overscroll-behavior-y: contain !important;
                touch-action: pan-y !important;
            }
            body.nyt-grid-scroll .xwd__board { padding-bottom: 0 !important; }

            .nyt-scrollbar-container {
                position: fixed;
                left: 0;
                top: 0;
                width: 20px;
                height: calc(100vh - var(--nyt-mobile-cluebar-h));
                background-color: transparent;
                z-index: 999;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                box-sizing: border-box;
                pointer-events: none;
            }
            
            .nyt-purple-scrollbar {
                width: 100%;
                background-color: rgba(128, 0, 128, 0.2);
                border-radius: 0;
                position: relative;
                cursor: pointer;
                pointer-events: auto;
                align-self: flex-start;
                transition: background-color 0.2s ease;
            }
            
            .nyt-purple-scrollbar:hover {
                background-color: rgba(128, 0, 128, 0.25);
            }
            
            .nyt-purple-scrollbar-thumb {
                position: absolute;
                left: 0;
                width: 100%;
                min-height: 60px;
                background-color: rgba(128, 0, 128, 0.8);
                border-radius: 0;
                cursor: grab;
                transition: background-color 0.2s ease;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
            }
            
            .nyt-purple-scrollbar-thumb:hover {
                background-color: rgba(128, 0, 128, 0.9);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
            }
            
            .nyt-purple-scrollbar-thumb:active {
                cursor: grabbing;
                background-color: rgb(128, 0, 128);
                box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.7);
            }
            
            .nyt-purple-scrollbar-thumb::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 12px;
                height: 3px;
                background: repeating-linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0.4) 0px,
                    rgba(255, 255, 255, 0.4) 1px,
                    transparent 1px,
                    transparent 2px
                );
                border-radius: 1px;
            }
            
            body.nyt-has-scrollbar .xwd__layout_puzzle--mobile,
            body.nyt-has-scrollbar .xwd__layout_container--mobile {
                margin-left: 20px !important;
                padding-left: 0 !important;
                width: calc(100vw - ${CONFIG.sidebarWidth} - 20px) !important;
                max-width: calc(100vw - ${CONFIG.sidebarWidth} - 20px) !important;
                box-sizing: border-box !important;
            }
            
            body.nyt-has-scrollbar .xwd__clue-bar-mobile--bar {
                left: 0 !important;
                right: ${CONFIG.sidebarWidth} !important;
                width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                margin-left: 0 !important;
                padding-left: 20px !important;
            }
            
            body.nyt-mobile-wide.nyt-has-scrollbar .xwd__layout_puzzle--mobile,
            body.nyt-mobile-wide.nyt-has-scrollbar .xwd__layout_container--mobile {
                margin-left: 20px !important;
                padding-left: 0 !important;
                width: calc(100vw - ${CONFIG.sidebarWidth} - 20px) !important;
                max-width: calc(100vw - ${CONFIG.sidebarWidth} - 20px) !important;
                box-sizing: border-box !important;
            }
            
            body.nyt-mobile-wide.nyt-has-scrollbar .xwd__clue-bar-mobile--bar {
                left: 0 !important;
                right: ${CONFIG.sidebarWidth} !important;
                width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                margin-left: 0 !important;
                padding-left: 20px !important;
            }

            body.nyt-mobile-wide .pz-header.pz-hide-loading.pz-game-header {
                display: none !important;
            }
            body.nyt-mobile-wide .xwd__keyboard.simple-keyboard.hg-theme-default.hg-layout-primary {
                position: fixed !important;
                left: -9999px !important;
                top: -9999px !important;
                visibility: hidden !important;
                pointer-events: auto !important;
                opacity: 0 !important;
                height: 1px !important;
                width: 1px !important;
                overflow: hidden !important;
                z-index: -9999 !important;
                transform: translateZ(-1000px) !important;
            }
            body.nyt-mobile-wide .xwd__layout_puzzle--mobile {
                width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                max-width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                height: calc(100vh - var(--nyt-mobile-cluebar-h)) !important;
            }
            body.nyt-mobile-wide .xwd__mobile_layout--board_container { width: 100% !important; height: 100% !important; }
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar {
                position: fixed !important;
                left: 0 !important;
                right: ${CONFIG.sidebarWidth} !important;
                width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                bottom: 0 !important;
                z-index: 1002 !important;
                height: var(--nyt-mobile-cluebar-h) !important;
                min-height: var(--nyt-mobile-cluebar-h) !important;
                visibility: hidden !important;
                opacity: 0 !important;
                transform: none !important;
                display: block !important;
                transition: opacity 300ms ease, visibility 300ms ease !important;
            }
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar.puzzle-started { visibility: visible !important; opacity: 1 !important; }
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar .xwd__clue-bar-mobile--jump.left,
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar .xwd__clue-bar-mobile--jump:not(.left) {
                display: none !important;
            }
            body.nyt-mobile-wide .xwd__clue-list--container,
            body.nyt-mobile-wide .xwd__clue-list--wrapper,
            body.nyt-mobile-wide [data-testid="clue-list"],
            body.nyt-mobile-wide [class*="clue-list"] {
                display: none !important;
            }

            @media (max-width: 720px) {
                .pz-header.pz-hide-loading.pz-game-header {
                    display: none !important;
                }

                .xwd__keyboard.simple-keyboard.hg-theme-default.hg-layout-primary {
                    position: fixed !important;
                    left: -9999px !important;
                    top: -9999px !important;
                    visibility: hidden !important;
                    pointer-events: auto !important;
                    opacity: 0 !important;
                    height: 1px !important;
                    width: 1px !important;
                    overflow: hidden !important;
                    z-index: -9999 !important;
                    transform: translateZ(-1000px) !important;
                }

                .xwd__layout_puzzle--mobile {
                    width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                    max-width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                    height: calc(100vh - var(--nyt-mobile-cluebar-h)) !important;
                }

                .xwd__mobile_layout--board_container {
                    width: 100% !important;
                    height: 100% !important;
                }
                .xwd__clue-bar-mobile--bar .xwd__clue-bar-mobile--jump.left,
                .xwd__clue-bar-mobile--bar .xwd__clue-bar-mobile--jump:not(.left) {
                    display: none !important;
                }
                .xwd__clue-bar-mobile--bar {
                    position: fixed !important;
                    left: 0 !important;
                    right: ${CONFIG.sidebarWidth} !important;
                    width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                    bottom: 0 !important;
                    z-index: 1000 !important;
                    height: var(--nyt-mobile-cluebar-h) !important;
                    min-height: var(--nyt-mobile-cluebar-h) !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    transition: opacity 300ms ease, visibility 300ms ease !important;
                }

                .xwd__clue-bar-mobile--bar.puzzle-started {
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                .xwd__toolbar--condensedMenu,
                #js-nav-burger {
                    position: absolute !important;
                    left: -9999px !important;
                }

                .Banner-module_multiIconBanner__KZi3f,
                a[href*="nytimes.onelink.me"] {
                    display: none !important;
                    visibility: hidden !important;
                }

                .xwd__menu--container[data-testid="help-menu"] {
                    position: fixed !important;
                    z-index: 10000 !important;
                    background: white !important;
                    border: 1px solid #ccc !important;
                    border-radius: 4px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    max-width: 200px !important;
                    right: ${CONFIG.sidebarWidth} !important;
                    top: 100px !important;
                }

                .pz-nav-drawer.open {
                    position: fixed !important;
                    z-index: 10000 !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                    height: 100vh !important;
                    background: white !important;
                    overflow-y: auto !important;
                }

                .xwd__menu--container .xwd__menu--item {
                    display: block !important;
                }
                .xwd__menu--container .xwd__menu--btnlink {
                    display: block !important;
                    width: 100% !important;
                    padding: 8px 12px !important;
                    border: none !important;
                    background: none !important;
                    text-align: left !important;
                    cursor: pointer !important;
                }
                .xwd__menu--container .xwd__menu--btnlink:hover {
                    background-color: #f0f0f0 !important;
                }

                .modal-system-container.pause-modal {
                    position: absolute !important;
                    width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                    height: calc(100vh - var(--nyt-mobile-cluebar-h)) !important;
                    left: 0 !important;
                    top: 0 !important;
                    right: auto !important;
                    bottom: auto !important;
                }

                .xwd__clue-bar-mobile--bar .middle {
                    padding-left: 16px !important;
                    padding-right: 16px !important;
                    font-size: 18px !important;
                    line-height: 1.2 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    height: 100% !important;
                    overflow: hidden !important;
                }

                .xwd__clue-bar-mobile--bar .middle.long-clue {
                    font-size: 14px !important;
                    line-height: 1.1 !important;
                }

                .xwd__clue-bar-mobile--bar .middle.very-long-clue {
                    font-size: 12px !important;
                    line-height: 1.0 !important;
                }
            }

            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar .middle {
                padding-left: 16px !important;
                padding-right: 16px !important;
                font-size: 18px !important;
                line-height: 1.2 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-start !important;
                height: 100% !important;
                overflow: hidden !important;
            }
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar .middle.long-clue { font-size: 14px !important; line-height: 1.1 !important; }
            body.nyt-mobile-wide .xwd__clue-bar-mobile--bar .middle.very-long-clue { font-size: 12px !important; line-height: 1.0 !important; }

            @media (max-width: 499px), (min-width: 500px) {
                .nyt-mobile-sidebar {
                    width: ${CONFIG.sidebarWidth};
                }
                .xwd__layout_puzzle--mobile {
                    width: calc(100vw - ${CONFIG.sidebarWidth}) !important;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        const topGroup = document.createElement('div');
        topGroup.className = 'sidebar-top-group';
        topGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0; padding: 0; margin: 0;';

        const topButtons = [
            { id: 'timer', text: '3:55', className: 'timer', action: 'timer' },
            { id: 'nytlogo', text: '', className: 'nytlogo', action: 'nytlogo' },
            { id: 'expand', text: '', className: 'expand', action: 'expand' }
        ];

        topButtons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = `sidebar-${button.id}`;
            btn.className = `nyt-mobile-sidebar-button ${button.className}`;
            
            if (button.id === 'nytlogo') {
                if (!CONFIG.showNytLogoButton) {
                    return;
                }
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 13.9 18.6" style="pointer-events: none; display: block;">
  <path fill="currentColor" d="M13.9,2.5C13.9.5,12,0,10.5,0V.3c.9,0,1.6.3,1.6,1a1.05872,1.05872,0,0,1-1.2,1,12.95853,12.95853,0,0,1-3.3-.8A13.27527,13.27527,0,0,0,4.1.7,3.27043,3.27043,0,0,0,.7,3.9,2.31777,2.31777,0,0,0,2.2,6.1l.1-.2a1.05381,1.05381,0,0,1-.6-1A1.26593,1.26593,0,0,1,3.1,3.8a14.776,14.776,0,0,1,3.7.9,28.25773,28.25773,0,0,0,3.7.8V8.6L9,9.9V10l1.5,1.3v4.3a4.6179,4.6179,0,0,1-2.5.6,4.92913,4.92913,0,0,1-3.9-1.6l4.1-2v-7l-5,2.2A6.68515,6.68515,0,0,1,5.8,4.9l-.1-.2A7.47133,7.47133,0,0,0,0,11.6a7.01948,7.01948,0,0,0,7,7,6.50532,6.50532,0,0,0,6.6-6.5h-.2a6.69748,6.69748,0,0,1-2.6,3.1V11.1l1.6-1.3V9.7L10.9,8.4v-3A2.85791,2.85791,0,0,0,13.9,2.5Zm-8.7,11L4,14.1a5.93247,5.93247,0,0,1-1.1-3.8,7.10647,7.10647,0,0,1,.3-2.1l2.1-.9Z"/>
</svg>`;
                btn.setAttribute('title', CONFIG.enableXwordinfoLink ? 'Open Xwordinfo Solution' : 'NYT Logo (Xwordinfo disabled)');
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
            } else if (button.id === 'expand') {
                btn.innerHTML = getExpandIcon(state.isExpanded);
                btn.setAttribute('title', state.isExpanded ? 'Minimize grid' : 'Maximize grid');
                btn.setAttribute('aria-label', btn.getAttribute('title'));
                btn.setAttribute('tabindex', '-1');
                btn.addEventListener('mousedown', (e) => { e.preventDefault(); });
                btn.addEventListener('pointerdown', (e) => {
                    if (e.pointerType === 'mouse') {
                        e.preventDefault();
                    }
                });
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
            } else {
                btn.textContent = button.text;
            }
            
            btn.setAttribute('data-action', button.action);
            btn.addEventListener('click', handleSidebarButtonClick);
            topGroup.appendChild(btn);
        });

        const bottomGroup = document.createElement('div');
        bottomGroup.className = 'sidebar-bottom-group';
        bottomGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0; position: absolute; bottom: 0; width: 100%; padding: 0; margin: 0;';

        if (CONFIG.showSettingsButton) {
            const settingsProxy = document.createElement('button');
            settingsProxy.id = 'sidebar-settings';
            settingsProxy.className = 'nyt-mobile-sidebar-button settings';
            settingsProxy.setAttribute('data-action', 'settings');
            settingsProxy.setAttribute('title', 'Settings');
            settingsProxy.addEventListener('click', handleSidebarButtonClick);
            (function(){
                const nativeIcon = document.querySelector('.xwd__tool--button button[aria-label="Puzzle Settings Menu"] i');
                if (nativeIcon) {
                    settingsProxy.appendChild(nativeIcon.cloneNode(true));
                } else {
                    settingsProxy.textContent = '⚙︎';
                }
            })();
            bottomGroup.appendChild(settingsProxy);
        }

        if (CONFIG.showCheatButton) {
            const cheatProxy = document.createElement('button');
            cheatProxy.id = 'sidebar-cheat';
            cheatProxy.className = 'nyt-mobile-sidebar-button help';
            cheatProxy.setAttribute('data-action', 'cheat');
            cheatProxy.setAttribute('title', 'Cheats');
            cheatProxy.addEventListener('click', handleSidebarButtonClick);
            (function(){
                const cheatIcon = document.querySelector('.xwd__toolbar_icon--cheat-menu');
                
                if (cheatIcon) {
                    cheatProxy.appendChild(cheatIcon.cloneNode(true));
                } else {
                    const fallbackIcon = document.querySelector(
                        'i.xwd__toolbar_icon--lifesaver, ' +
                        'i.xwd__toolbar_icon--life-preserver, ' +
                        'i[class*="lifesaver"], ' +
                        'i[class*="life-preserver"], ' +
                        'i[class*="lifebuoy"], ' +
                        '[data-testid="life-preserver-icon"], ' +
                        '.xwd__tool--button [data-testid="life-preserver-icon"]'
                    );
                    
                    if (fallbackIcon) {
                        cheatProxy.appendChild(fallbackIcon.cloneNode(true));
                    } else {
                        cheatProxy.textContent = '⛑︎';
                    }
                }
            })();
            bottomGroup.appendChild(cheatProxy);
        }

        const navButtons = [
            { id: 'prev', text: '‹', className: 'prev', action: 'prev' },
            { id: 'next', text: '›', className: 'next', action: 'next' }
        ];
        navButtons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = `sidebar-${button.id}`;
            btn.className = `nyt-mobile-sidebar-button ${button.className}`;
            
            const chevronSvg = document.createElement('div');
            chevronSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;${button.id === 'prev' ? ' transform: rotate(180deg);' : ''}">
                <path d="M1 19l7.94-9L1 1" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>`;
            
            btn.appendChild(chevronSvg.firstElementChild);
            btn.setAttribute('data-action', button.action);
            btn.addEventListener('click', handleSidebarButtonClick);
            bottomGroup.appendChild(btn);
        });

        sidebar.appendChild(topGroup);
        sidebar.appendChild(bottomGroup);

        document.body.appendChild(sidebar);
        state.sidebarCreated = true;
        
        setTimeout(() => updateNavButtonHeights(), 100);
    }

    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity || '1') === 0) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function repositionNativeKeyboardButtons() {
        const existingRebus = document.querySelector('.sidebar-bottom-group .nyt-sidebar-native-button[data-skbtn="rebus"]');
        const existingPencil = document.querySelector('.sidebar-bottom-group .nyt-sidebar-native-button[data-skbtn="pencil"]');
        
        if (existingRebus && existingPencil) {
            return;
        }

        const keyboard = document.querySelector('.xwd__keyboard.simple-keyboard.hg-theme-default.hg-layout-primary');
        if (!keyboard) {
            return;
        }

        const rebusButton = keyboard.querySelector('[data-skbtn="rebus"]');
        const pencilButton = keyboard.querySelector('[data-skbtn="pencil"]');

        if (!rebusButton && !pencilButton) {
            return;
        }

        const bottomGroup = document.querySelector('.sidebar-bottom-group');
        if (!bottomGroup) return;

        const navButtons = bottomGroup.querySelectorAll('.nyt-mobile-sidebar-button.prev, .nyt-mobile-sidebar-button.next');
        let insertBeforeElement = navButtons.length > 0 ? navButtons[0] : null;

        if (CONFIG.showPencilButton && rebusButton && !existingRebus) {
            rebusButton.classList.add('nyt-sidebar-native-button');
            
            const rebusSpan = rebusButton.querySelector('span');
            if (rebusSpan) {
                rebusSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 704.3 800" style="width: 24px; height: 24px;">
  <path fill="currentColor" d="M7.5,151.5h689c4.1,0,7.5-3.4,7.5-7.5,0-69.7-8.6-144-112-144H144C39,0,0,34.7,0,128v16c0,4.1,3.4,7.5,7.5,7.5ZM176,80c0-8.8,7.2-16,16-16h336c8.9,0,16,7.2,16,16v32c0,8.8-7.1,16-16,16H192c-8.8,0-16-7.2-16-16v-32Z"/>
  <path fill="currentColor" d="M684.7,506.1h-9.5c-15,9-32.5,14.1-51.2,14.1h-194.1c11,19.2,8.4,44.2-8,60.6-9.5,9.5-22.1,14.7-35.5,14.7s-26-5.2-35.5-14.7l-57.1-57.3c-5.2-5.3-9.5-11.1-12.9-17.4h-34.6c-9,8.7-21.3,14.1-34.8,14.1H80.3c-18.7,0-36.2-5.2-51.2-14.1C13,506.1,0,519.1,0,535.2v120.8c0,21.8,6.4,37.4,16,49v47c0,26.4,21.6,48,48,48h64c26.4,0,48-21.6,48-48v-16h352v16c0,26.4,21.6,48,48,48h64c26.4,0,48-21.6,48-48v-47c9.6-11.6,16-27.2,16-49v-130.6c0-10.7-8.6-19.3-19.3-19.3ZM192,601.8c-.9,29.3-24.8,53.2-54.1,54.1-32.4,1-58.8-25.4-57.8-57.8.9-29.3,24.8-53.2,54.1-54.1,32.4-1,58.8,25.4,57.8,57.8ZM624,601.8c-.9,29.3-24.8,53.2-54.1,54.1-32.4,1-58.8-25.4-57.8-57.8.9-29.3,24.8-53.2,54.1-54.1,32.4-1,58.8,25.4,57.8,57.8Z"/>
  <path fill="currentColor" d="M624,167H80.3C36,167,0,203,0,247.3v172.6c0,44.3,36,80.3,80.3,80.3h131.3c16.6,0,30.1-13.5,30.1-30.1s-13.5-30.1-30.1-30.1H80.3c-11.1,0-20.1-9-20.1-20.1v-172.6c0-11.1,9-20.1,20.1-20.1h543.7c11.1,0,20.1,9,20.1,20.1v172.6c0,11.1-9,20.1-20.1,20.1h-239.7l23.6-23.7c11.7-11.8,11.7-31,0-42.8-5.7-5.7-13.3-8.9-21.3-8.9s-15.6,3.1-21.3,8.9l-57.4,57.6c-21.4,21.6-21.3,56.7.1,78.2l57.1,57.3c5.7,5.7,13.3,8.9,21.3,8.9s15.6-3.1,21.3-8.9c11.7-11.8,11.7-30.9,0-42.7l-23.7-23.7h239.9c44.3,0,80.3-36,80.3-80.3v-172.6c0-44.3-36-80.3-80.3-80.3Z"/>
</svg>`;
            }
            
            if (insertBeforeElement) {
                bottomGroup.insertBefore(rebusButton, insertBeforeElement);
            } else {
                bottomGroup.appendChild(rebusButton);
            }
        }

        if (CONFIG.showPencilButton && pencilButton && !existingPencil) {
            pencilButton.classList.add('nyt-sidebar-native-button');
            pencilButton.classList.add('nyt-sidebar-pencil-button');
            
            if (insertBeforeElement) {
                bottomGroup.insertBefore(pencilButton, insertBeforeElement);
            } else {
                bottomGroup.appendChild(pencilButton);
            }
        }

        // Simple toggle state tracker for pencil button
        let pencilToggleState = false;
        let lastPencilToggleTs = 0;
        const DEBOUNCE_MS = 220;
        
        const updatePencilVisuals = (button, forceState = null) => {
            if (!button) return;
            
            // use forced state if provided; otherwise infer
            const inferred = 
                button.classList.contains('selected') ||
                button.classList.contains('active') ||
                button.getAttribute('aria-pressed') === 'true';
            
            const isActive = (forceState !== null) ? forceState : inferred;
            
            if (isActive) {
                button.style.cssText += '; background-color:#6BAA64 !important; opacity:1 !important;';
                button.setAttribute('data-pencil-active', 'true');
            } else {
                // only clear if we *know* it's off (don't nuke visuals on "unknown")
                button.style.cssText += '; background-color:transparent !important; opacity:1 !important;';
                button.removeAttribute('data-pencil-active');
            }
        };
        
        const togglePencilVisuals = (button) => {
            if (!button) return;
            
            // Fallback: just toggle our internal state
            pencilToggleState = !pencilToggleState;
            updatePencilVisuals(button, pencilToggleState);
            console.log('Pencil toggle fallback:', pencilToggleState);
        };
        
        function guardedToggle() {
            const now = Date.now();
            if (now - lastPencilToggleTs < DEBOUNCE_MS) return; // skip duplicate
            lastPencilToggleTs = now;

            // let native code run first, then do our toggle
            setTimeout(() => { togglePencilVisuals(pencilButton); }, 50);
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target === pencilButton) {
                        updatePencilVisuals(pencilButton);
                    }
                }
            });
        });

        if (rebusButton) observer.observe(rebusButton, { attributes: true });
        if (pencilButton) {
            // Keep the observer, but have it pass our remembered state
            observer.observe(pencilButton, { attributes: true, attributeFilter: ['class','aria-pressed'] });
            
            // Use ONE path (pointerup covers mouse & touch on modern browsers)
            pencilButton.addEventListener('pointerup', guardedToggle, {passive: true});
            
            const checkPencilState = () => {
                // Prefer real state if NYT exposes it...
                const hasSelected = pencilButton.classList.contains('selected')
                                 || pencilButton.getAttribute('aria-pressed') === 'true';
                if (hasSelected) {
                    pencilToggleState = true;
                    updatePencilVisuals(pencilButton, true);
                } else {
                    // ...otherwise don't blow away our janky paint immediately.
                    // Only clear after a longer interval if we truly know it's off.
                    updatePencilVisuals(pencilButton, pencilToggleState);
                }
            };
            
            checkPencilState();
            // Poll less aggressively
            setInterval(checkPencilState, 1200);
        }
        
        setTimeout(() => updateNavButtonHeights(), 50);
    }

    function handleSidebarButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const button = event.currentTarget;
        const action = button.getAttribute('data-action');

        switch (action) {
            case 'timer': {
                const timerButton = document.querySelector('.xwd__timer--button button');
                if (timerButton) {
                    timerButton.click();
                }
                break;
            }

            case 'expand':
                toggleGridExpansion();
                break;

            case 'prev': {
                let prevBtn = document.querySelector('.xwd__clue-bar-mobile--jump.left button');
                if (!prevBtn) prevBtn = document.querySelector('.xwd__clue-bar-mobile--jump.left');
                if (!prevBtn) prevBtn = document.querySelector('button[aria-label*="previous"], button[aria-label*="Previous"]');
                if (prevBtn) {
                    prevBtn.click();
                } else {
                    const grid = document.querySelector('.xwd__board--content, #xwd-board');
                    if (grid) {
                        grid.focus();
                    }
                }
                break;
            }

            case 'next': {
                let nextBtn = document.querySelector('.xwd__clue-bar-mobile--jump:not(.left) button');
                if (!nextBtn) nextBtn = document.querySelector('.xwd__clue-bar-mobile--jump:not(.left)');
                if (!nextBtn) nextBtn = document.querySelector('button[aria-label*="next"], button[aria-label*="Next"]');
                if (nextBtn) {
                    nextBtn.click();
                } else {
                    const grid = document.querySelector('.xwd__board--content, #xwd-board');
                    if (grid) {
                        grid.focus();
                    }
                }
                break;
            }

            case 'nytlogo': {
                if (!CONFIG.enableXwordinfoLink) return;
                
                const currentUrl = window.location.href;
                let xwordinfoUrl = 'https://www.xwordinfo.com/Crossword';
                
                const dateMatch = currentUrl.match(/\/(\d{4})\/(\d{2})\/(\d{2})/);
                if (dateMatch) {
                    const [, year, month, day] = dateMatch;
                    xwordinfoUrl = `https://www.xwordinfo.com/Crossword?date=${month}%2F${day}%2F${year}`;
                } else {
                    const today = new Date();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const year = today.getFullYear();
                    xwordinfoUrl = `https://www.xwordinfo.com/Crossword?date=${month}%2F${day}%2F${year}`;
                }
                
                window.open(xwordinfoUrl, '_blank');
                break;
            }

            case 'cheat': {
                toggleCustomCheatMenu();
                break;
            }

            case 'settings': {
                const settingsButton = document.querySelector('.xwd__tool--button button[aria-label="Puzzle Settings Menu"]');
                if (settingsButton) settingsButton.click();
                break;
            }
        }
    }

    function createCustomCheatMenu() {
        const overlay = document.createElement('div');
        overlay.id = 'nyt-cheat-overlay';
        document.body.appendChild(overlay);
        state.customCheatMenu = overlay;

        document.addEventListener('click', (e) => {
            if (!state.customCheatMenu) return;
            const isCheatBtn = e.target && e.target.getAttribute && e.target.getAttribute('data-action') === 'cheat';
            if (state.customCheatMenu.style.display === 'block' && !state.customCheatMenu.contains(e.target) && !isCheatBtn) {
                state.customCheatMenu.style.display = 'none';
            }
        });
    }

    function populateCustomCheatMenu() {
        const overlay = state.customCheatMenu;
        if (!overlay) return;
        overlay.innerHTML = '';

        const menu = document.querySelector('.xwd__menu--container[data-testid="help-menu"]');
        if (!menu) return;

        const makeBtn = (txt) => {
            const nb = document.createElement('button');
            nb.textContent = txt;
            nb.addEventListener('click', (ev) => {
                ev.stopPropagation();

                if (txt === 'More 〉') {
                    state.cheatPage = 'more';
                    populateCustomCheatMenu();
                    return;
                }
                if (txt === '〈 Back') {
                    state.cheatPage = 'main';
                    populateCustomCheatMenu();
                    return;
                }
                const orig = Array.from(menu.querySelectorAll('button.xwd__menu--btnlink'))
                                  .find(bb => (bb.textContent || '').trim() === txt);
                if (orig) orig.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
                overlay.style.display = 'none';
            });
            return nb;
        };

        if (state.cheatPage === 'main') {
            const wanted = ['Autocheck', 'Check Square', 'Check Word', 'Check Puzzle', 'More 〉'];
            wanted.forEach(label => overlay.appendChild(makeBtn(label)));
        } else {
            const wanted = ['Clear Incomplete', 'Clear Word', 'Reset Puzzle', 'Reveal Square', 'Reveal Word', 'Reveal Puzzle', '〈 Back'];
            wanted.forEach(label => overlay.appendChild(makeBtn(label)));
        }
    }

    function toggleCustomCheatMenu() {
        if (!state.customCheatMenu) {
            createCustomCheatMenu();
        }
        const overlay = state.customCheatMenu;
        const willOpen = !(overlay.style.display === 'block');
        if (willOpen) {
            state.cheatPage = 'main';
            populateCustomCheatMenu();
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }

    function getBoardSvg() {
        const candidates = [
            '#xwd-board',
            '#xwd-board svg',
            '.xwd__board svg',
            'svg#xwd-board',
            'svg.xwd__svg'
        ];
        for (const sel of candidates) {
            const el = document.querySelector(sel);
            if (el && el.tagName && el.tagName.toLowerCase() === 'svg') return el;
        }
        return null;
    }

    function applyGridScale() {
        const svg = getBoardSvg();
        const grid = document.querySelector('.xwd__board--content') || document.querySelector('[class*="board--content"]');
        const boardContainer = document.querySelector('.xwd__board') || (svg && svg.closest('.xwd__board')) || document.querySelector('[class*="xwd__board"]');
        const expandButton = document.getElementById('sidebar-expand');
        if (!svg || !grid || !boardContainer || !expandButton) return;

        const containerRect = boardContainer.getBoundingClientRect();
        let containerWidth = containerRect.width;
        let containerHeight = containerRect.height;

        const clueBar = document.querySelector('.xwd__clue-bar-mobile--bar');
        if (clueBar) {
            const clueH = parseFloat(getComputedStyle(clueBar).height) || 60;
            const spaceBelow = window.innerHeight - (containerRect.top + containerRect.height);
            if (spaceBelow < clueH + 1) containerHeight = Math.min(containerHeight, window.innerHeight - clueH - containerRect.top);
        }

        const baseSize = 501;

        const hasScrollbar = document.body.classList.contains('nyt-has-scrollbar');
        const reservedLeft = 20;
        const leftInset = Math.max(0, Math.round(containerRect.left));
        const needsComp = hasScrollbar && leftInset < (reservedLeft - 1);
        const effectiveContainerWidth = needsComp ? (containerWidth - reservedLeft) : containerWidth;
        
        const scaleFitWidth = effectiveContainerWidth / baseSize;
        const scaleFitHeight = containerHeight / baseSize;

        const scale = state.isExpanded ? Math.min(scaleFitHeight, scaleFitWidth) : scaleFitWidth;

        const scaledWidth = baseSize * scale;
        const scaledHeight = baseSize * scale;

        svg.style.width = `${scaledWidth}px`;
        svg.style.height = `${scaledHeight}px`;
        svg.style.position = 'absolute';
        svg.style.top = '0px';
        svg.style.left = hasScrollbar ? '0px' : `${Math.round((containerWidth - scaledWidth) / 2)}px`;
        svg.style.transformOrigin = 'top left';

        grid.style.transform = 'none';
        grid.style.width = '100%';
        grid.style.height = '100%';

        const isWide = (window.innerWidth || 0) > (window.innerHeight || 0);
        if (!isWide) {
            state.isExpanded = false;
        }
        if (expandButton) {
            expandButton.style.display = isWide ? '' : 'none';
            expandButton.classList.toggle('expanded', state.isExpanded);
            expandButton.innerHTML = getExpandIcon(state.isExpanded);
            expandButton.title = state.isExpanded ? 'Minimize grid' : 'Maximize grid';
            expandButton.setAttribute('aria-label', expandButton.title);
        }

        const scrollMode = document.body.classList.contains('nyt-grid-scroll');
        let shim = boardContainer.querySelector('#nyt-grid-scroll-shim');
        if (scrollMode) {
            if (!shim) {
                shim = document.createElement('div');
                shim.id = 'nyt-grid-scroll-shim';
                shim.style.cssText = 'width:1px; pointer-events:none; opacity:0;';
                boardContainer.appendChild(shim);
            }
            const clueH = (() => {
                const v = getComputedStyle(document.documentElement).getPropertyValue('--nyt-mobile-cluebar-h');
                const n = parseFloat(v);
                return Number.isFinite(n) ? n : 60;
            })();
            const extra = Math.max(0, Math.round(scaledHeight - containerHeight + clueH));
            shim.style.height = `${extra}px`;
        } else if (shim) {
            shim.remove();
        }
    }

    function toggleGridExpansion() {
        const wasExpanded = state.isExpanded;
        state.isExpanded = !state.isExpanded;
        const expandButton = document.getElementById('sidebar-expand');
        if (expandButton) {
            expandButton.classList.toggle('expanded', state.isExpanded);
            expandButton.innerHTML = getExpandIcon(state.isExpanded);
            expandButton.title = state.isExpanded ? 'Minimize grid' : 'Maximize grid';
            expandButton.setAttribute('aria-label', expandButton.title);
        }
        applyGridScale();
        updateScrollMode();
        createPurpleScrollbar();
        
        if (!wasExpanded) {
            setTimeout(() => {
                focusActiveGridCell();
            }, 50);
        }
    }

    function updateTimer() {
        const timerButton = document.getElementById('sidebar-timer');
        if (timerButton) {
            const originalTimer = document.querySelector('.timer-count');
            if (originalTimer) {
                timerButton.textContent = originalTimer.textContent;
            }
        }
    }

    function handleResize() {
        updateAspectMode();
        const puzzleLayout = document.querySelector('.xwd__layout_puzzle--mobile');
        if (puzzleLayout) {
            const sidebarWidth = parseInt(CONFIG.sidebarWidth);
            const availableWidth = window.innerWidth - sidebarWidth;
            puzzleLayout.style.width = `${availableWidth}px`;
            puzzleLayout.style.maxWidth = `${availableWidth}px`;
        }
        applyGridScale();
        updateScrollMode();
        createPurpleScrollbar();
        updateNavButtonHeights();
    }

    function updateAspectMode() {
        try {
            const w = window.innerWidth || 0;
            const h = window.innerHeight || 0;
            const isWide = h > 0 && w > h;
            const enable = !!CONFIG.forceMobileInLandscape && isWide;
            document.body.classList.toggle('nyt-mobile-wide', enable);
        } catch (e) { /* noop */ }
    }

    function updateScrollMode() {
        if (!CONFIG.forceMobileInLandscape) {
            document.body.classList.remove('nyt-grid-scroll');
            return;
        }
        const isWide = (window.innerWidth || 0) > (window.innerHeight || 0);
        const enable = isWide && !state.isExpanded;
        document.body.classList.toggle('nyt-grid-scroll', !!enable);
    }

    function getScrollContainer() {
        return document.querySelector('.xwd__board');
    }

    function createPurpleScrollbar() {
        const existingContainer = document.getElementById('nyt-scrollbar-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        document.body.classList.remove('nyt-has-scrollbar');

        if (!shouldShowScrollbar()) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'nyt-scrollbar-container';
        container.className = 'nyt-scrollbar-container';
        
        const scrollbar = document.createElement('div');
        scrollbar.id = 'nyt-purple-scrollbar';
        scrollbar.className = 'nyt-purple-scrollbar';
        
        const thumb = document.createElement('div');
        thumb.className = 'nyt-purple-scrollbar-thumb';
        scrollbar.appendChild(thumb);
        container.appendChild(scrollbar);
        
        document.body.appendChild(container);
        
        document.body.classList.add('nyt-has-scrollbar');
        
        const lockTrackHeightToBoard = () => {
            const board = getScrollContainer();
            if (!board) return;
            const boardHeight = Math.max(0, board.clientHeight || board.offsetHeight || 0);
            if (boardHeight > 0) {
                scrollbar.style.height = `${boardHeight}px`;
            }
        };

        setTimeout(() => {
            lockTrackHeightToBoard();
            updateScrollbarPosition();
        }, 0);

        const boardForObserve = getScrollContainer();
        if (boardForObserve && 'ResizeObserver' in window) {
            const ro = new ResizeObserver(() => {
                lockTrackHeightToBoard();
                updateScrollbarPosition();
            });
            ro.observe(boardForObserve);
        }
        
        let isDragging = false;
        let dragStartY = 0;
        let dragStartScroll = 0;
        
        const startDrag = (clientY) => {
            isDragging = true;
            dragStartY = clientY;
            const scrollContainer = getScrollContainer();
            dragStartScroll = scrollContainer ? scrollContainer.scrollTop : 0;
            thumb.style.cursor = 'grabbing';
        };
        
        const updateDrag = (clientY) => {
            if (!isDragging) return;
            
            const scrollContainer = getScrollContainer();
            if (!scrollContainer) return;
            
            const scrollbarRect = scrollbar.getBoundingClientRect();
            const thumbHeight = thumb.offsetHeight;
            const trackHeight = scrollbarRect.height - thumbHeight;
            
            if (trackHeight <= 0) return;
            
            const deltaY = clientY - dragStartY;
            const scrollRatio = deltaY / trackHeight;
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            
            scrollContainer.scrollTop = Math.max(0, Math.min(maxScroll, dragStartScroll + (scrollRatio * maxScroll)));
            updateScrollbarPosition();
        };
        
        const endDrag = () => {
            isDragging = false;
            thumb.style.cursor = 'grab';
        };
        
        thumb.addEventListener('mousedown', (e) => {
            startDrag(e.clientY);
            e.preventDefault();
            e.stopPropagation();
        });
        
        scrollbar.addEventListener('mousedown', (e) => {
            if (e.target === thumb) return;
            startDrag(e.clientY);
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('mousemove', (e) => {
            updateDrag(e.clientY);
        });
        
        document.addEventListener('mouseup', endDrag);
        
        thumb.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                startDrag(e.touches[0].clientY);
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateDrag(e.touches[0].clientY);
            }
        });
        
        document.addEventListener('touchend', endDrag);
        
        scrollbar.addEventListener('click', (e) => {
            if (e.target === thumb) return;
            
            const scrollContainer = getScrollContainer();
            if (!scrollContainer) return;
            
            const scrollbarRect = scrollbar.getBoundingClientRect();
            const clickY = e.clientY - scrollbarRect.top;
            const trackHeight = scrollbarRect.height;
            
            const thumbHeight = thumb.offsetHeight;
            const availableTrackHeight = trackHeight - thumbHeight;
            const adjustedClickY = Math.max(0, Math.min(availableTrackHeight, clickY - thumbHeight / 2));
            const scrollRatio = availableTrackHeight > 0 ? adjustedClickY / availableTrackHeight : 0;
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            
            scrollContainer.scrollTop = Math.max(0, Math.min(maxScroll, scrollRatio * maxScroll));
            updateScrollbarPosition();
        });
        
        const scrollContainer = getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updateScrollbarPosition);
        }
    }
    
    function shouldShowScrollbar() {
        const isWide = (window.innerWidth || 0) > (window.innerHeight || 0);
        if (!isWide || state.isExpanded) {
            return false;
        }
        
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) {
            return false;
        }
        
        return scrollContainer.scrollHeight > scrollContainer.clientHeight + 1;
    }
    
    function updateScrollbarPosition() {
        const scrollbar = document.getElementById('nyt-purple-scrollbar');
        const thumb = scrollbar ? scrollbar.querySelector('.nyt-purple-scrollbar-thumb') : null;
        
        if (!scrollbar || !thumb) return;
        
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) return;
        
        const visibleRatio = scrollContainer.clientHeight / scrollContainer.scrollHeight;
        const trackHeight = scrollbar.offsetHeight;
        const calculatedThumbHeight = Math.max(60, trackHeight * visibleRatio);
        
        thumb.style.height = `${calculatedThumbHeight}px`;
        
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollRatio = maxScroll > 0 ? scrollContainer.scrollTop / maxScroll : 0;
        const availableTrackHeight = trackHeight - calculatedThumbHeight;
        
        thumb.style.top = `${scrollRatio * availableTrackHeight}px`;
    }

    async function init() {
        try {
            console.log('NYT Crossword Optimizer: Waiting for grid elements...');
            await waitForElements();
            console.log('NYT Crossword Optimizer: Grid found, initializing...');

            createSidebar();

            repositionNativeKeyboardButtons();
            
            setTimeout(() => repositionNativeKeyboardButtons(), 2000);
            setTimeout(() => repositionNativeKeyboardButtons(), 5000);

            adjustPuzzleLayout();
            applyGridScale();

            const observer = new MutationObserver(() => { applyGridScale(); });
            const board = document.querySelector('.xwd__board');
            if (board) observer.observe(board, { attributes: true, childList: true, subtree: true });

            setupClueTextMonitoring();

            monitorPuzzleStart();

            setInterval(updateTimer, 1000);

            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleResize);

            updateTimer();
            updateAspectMode();

            const expandButton = document.getElementById('sidebar-expand');
            if (expandButton) {
                expandButton.classList.toggle('expanded', state.isExpanded);
                expandButton.innerHTML = getExpandIcon(state.isExpanded);
                expandButton.title = state.isExpanded ? 'Minimize grid' : 'Maximize grid';
                expandButton.setAttribute('aria-label', expandButton.title);
            }

            updateScrollMode();
            createPurpleScrollbar();

        } catch (error) {
            // Silently handle initialization errors
        }
    }

    function adjustPuzzleLayout() {
        const puzzleLayout = document.querySelector('.xwd__layout_puzzle--mobile');
        if (puzzleLayout) {
            const sidebarWidth = parseInt(CONFIG.sidebarWidth);
            const availableWidth = window.innerWidth - sidebarWidth;
            puzzleLayout.style.width = `${availableWidth}px`;
            puzzleLayout.style.maxWidth = `${availableWidth}px`;
        }
    }

    function adjustClueTextSize() {
        const clueContainer = document.querySelector('.xwd__clue-bar-mobile--bar .middle');
        if (!clueContainer) return;

        const clueText = clueContainer.textContent || '';
        const containerWidth = clueContainer.offsetWidth;

        clueContainer.classList.remove('long-clue', 'very-long-clue');

        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = 'font-size: 18px; line-height: 1.2; visibility: hidden; position: absolute; white-space: nowrap;';
        tempSpan.textContent = clueText;
        document.body.appendChild(tempSpan);

        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        if (textWidth > containerWidth * 1.8) {
            clueContainer.classList.add('very-long-clue');
        } else if (textWidth > containerWidth * 1.2) {
            clueContainer.classList.add('long-clue');
        }
    }

    function setupClueTextMonitoring() {
        const waitForClueBar = () => {
            const clueBar = document.querySelector('.xwd__clue-bar-mobile--bar .middle');
            if (!clueBar) {
                setTimeout(waitForClueBar, 100);
                return;
            }

            adjustClueTextSize();

            const clueObserver = new MutationObserver(() => {
                adjustClueTextSize();
            });

            clueObserver.observe(clueBar, {
                childList: true,
                subtree: true,
                characterData: true
            });

            window.addEventListener('resize', adjustClueTextSize);
        };

        waitForClueBar();
    }

    function monitorPuzzleStart() {
        function checkPuzzleStarted() {
            const startButton = document.querySelector('.pz-moment__button');
            const clueBar = document.querySelector('.xwd__clue-bar-mobile--bar');
            const bottomButtons = document.querySelector('.sidebar-bottom-group');

            if (!startButton || getComputedStyle(startButton).display === 'none' ||
                getComputedStyle(startButton).visibility === 'hidden' ||
                startButton.offsetParent === null) {
                state.puzzleStarted = true;
                if (clueBar && !clueBar.classList.contains('puzzle-started')) {
                    clueBar.classList.add('puzzle-started');
                }
                if (bottomButtons && !bottomButtons.classList.contains('puzzle-started')) {
                    bottomButtons.classList.add('puzzle-started');
                    setTimeout(() => updateNavButtonHeights(), 100);
                }
                if (clueBar) {
                    clueBar.style.removeProperty('display');
                    clueBar.style.removeProperty('visibility');
                }
                return true;
            }
            state.puzzleStarted = false;
            return false;
        }

        if (checkPuzzleStarted()) return;

        const pollInterval = setInterval(() => {
            if (checkPuzzleStarted()) {
                clearInterval(pollInterval);
            }
        }, 200);

        setTimeout(() => {
            if (!state.puzzleStarted) {
                const clueBar = document.querySelector('.xwd__clue-bar-mobile--bar');
                if (clueBar) {
                    clueBar.classList.add('puzzle-started');
                }
                const bottomButtons = document.querySelector('.sidebar-bottom-group');
                if (bottomButtons) bottomButtons.classList.add('puzzle-started');
            }
        }, 2000);

        const startButton = document.querySelector('.pz-moment__button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                setTimeout(() => {
                    checkPuzzleStarted();
                }, 500);
            });
        }

        const mo = new MutationObserver(() => {
            const cb = document.querySelector('.xwd__clue-bar-mobile--bar');
            if (cb && state.puzzleStarted) {
                cb.classList.add('puzzle-started');
                cb.style.removeProperty('display');
                cb.style.removeProperty('visibility');
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();