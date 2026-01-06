// ==UserScript==
// @name         FV - BBCode Editor
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.6
// @description  Adds a BBCode formatting toolbar to Furvilla text editors.
// @match        https://www.furvilla.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561567/FV%20-%20BBCode%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/561567/FV%20-%20BBCode%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Inherit */
        .bbcode-toolbar button {
            padding: 6px 8px;
            background: inherit;
            border: 1px solid currentColor;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            min-width: 32px;
            height: 32px;
            color: inherit;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
        }

        .bbcode-toolbar button:hover {
            background: inherit;
            border-color: currentColor;
            transform: translateY(-1px);
            opacity: 1;
        }

        .bbcode-toolbar button:active {
            transform: translateY(0);
            opacity: 0.9;
            box-shadow: none;
        }

        .bbcode-toolbar button:focus {
            outline: 2px solid currentColor;
            outline-offset: 2px;
        }

        /* Dark mode support - inherit from parent */
        .theme-dark .bbcode-toolbar button,
        body.dark-mode .bbcode-toolbar button,
        .dark .bbcode-toolbar button {
            background: inherit;
            border-color: currentColor;
            color: inherit;
            opacity: 0.7;
        }

        .theme-dark .bbcode-toolbar button:hover,
        body.dark-mode .bbcode-toolbar button:hover,
        .dark .bbcode-toolbar button:hover {
            background: inherit;
            border-color: currentColor;
            color: inherit;
            opacity: 1;
        }

        /* SVG icon styles */
        .bbcode-toolbar button svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
            stroke: currentColor;
        }

        /* Tooltip styles - inherit from Furvilla */
        .bbcode-toolbar button::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 8px;
            background: inherit;
            color: inherit;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s;
            z-index: 1000;
            pointer-events: none;
            border: 1px solid currentColor;
        }

        .theme-dark .bbcode-toolbar button::after,
        body.dark-mode .bbcode-toolbar button::after,
        .dark .bbcode-toolbar button::after {
            background: inherit;
            color: inherit;
            border-color: currentColor;
        }

        .bbcode-toolbar {
            margin-bottom: 10px;
            padding: 8px;
            background: inherit;
            border: 1px solid currentColor;
            border-radius: 5px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            justify-content: center;

        }

        .theme-dark .bbcode-toolbar,
        body.dark-mode .bbcode-toolbar,
        .dark .bbcode-toolbar {
            background: inherit;
            border-color: currentColor;
        }

        /* Ensure proper inheritance chain */
        .bbcode-toolbar,
        .bbcode-toolbar button,
        .bbcode-toolbar button svg {
            color: inherit;
            background-color: inherit;
            border-color: inherit;
        }
    `);

    // SVG conversion
    const icons = {
        bold: '<svg viewBox="0 0 384 512"><path d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 72.18 19.187 72.18 54.973 0 24.848-18.591 42.035-44.905 49.368z"/></svg>',
        italic: '<svg viewBox="0 0 384 512"><path d="M176 48h-48V16c0-8.837-7.163-16-16-16H80c-8.837 0-16 7.163-16 16v32H16C7.163 48 0 55.163 0 64v32c0 8.837 7.163 16 16 16h48v320H16c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h48v32c0 8.837 7.163 16 16 16h32c8.837 0 16-7.163 16-16v-32h48c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-48V112h48c8.837 0 16-7.163 16-16V64c0-8.837-7.163-16-16-16z"/></svg>',
        underline: '<svg viewBox="0 0 448 512"><path d="M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H288a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32v160a96 96 0 0 1-192 0V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm400 384H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg>',
        strikethrough: '<svg viewBox="0 0 512 512"><path d="M496 288H16c-8.837 0-16-7.163-16-16v-32c0-8.837 7.163-16 16-16h480c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16zm-214.666 16c27.258 12.937 46.524 28.683 46.524 56.243 0 33.108-28.977 53.676-75.621 53.676-32.325 0-76.874-12.08-76.874-44.271V368c0-8.837-7.164-16-16-16H113.75c-8.836 0-16 7.163-16 16v19.204c0 66.845 77.717 101.82 154.487 101.82 88.578 0 162.013-45.438 162.013-134.424 0-19.815-3.618-36.417-10.143-50.6H281.334zm-30.952-96c-32.422-13.505-56.836-28.946-56.836-59.683 0-33.92 30.901-47.406 64.962-47.406 42.647 0 64.962 16.593 64.962 32.985V136c0 8.837 7.163 16 16 16h45.613c8.836 0 16-7.163 16-16v-30.318c0-52.438-71.725-79.875-142.575-79.875-85.203 0-150.726 40.972-150.726 125.646 0 22.71 4.665 41.176 12.777 56.547h129.823z"/></svg>',
        'align-center': '<svg viewBox="0 0 448 512"><path d="M108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zM432 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 416h231.81A12.09 12.09 0 0 0 352 403.9v-39.81A12.09 12.09 0 0 0 339.91 352H108.1A12.09 12.09 0 0 0 96 364.09v39.81a12.1 12.1 0 0 0 12.1 12.1z"/></svg>',
        'align-right': '<svg viewBox="0 0 448 512"><path d="M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z"/></svg>',
        'quote-right': '<svg viewBox="0 0 512 512"><path d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"/></svg>',
        code: '<svg viewBox="0 0 640 512"><path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"/></svg>',
        'eye-slash': '<svg viewBox="0 0 640 512"><path d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"/></svg>',
        link: '<svg viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>',
        image: '<svg viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"/></svg>',
        'list-ul': '<svg viewBox="0 0 512 512"><path d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg>',
        'list-ol': '<svg viewBox="0 0 512 512"><path d="M24 368h24v48a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16zm0-224h24v48a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16zm0 112h24v48a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16zm472-224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg>',
        'text-height': '<svg viewBox="0 0 576 512"><path d="M304 32H16A16 16 0 0 0 0 48v96a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32h88v304H80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-56V112h88v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm256 336h-48V144h48c14.31 0 21.33-17.31 11.31-27.31l-80-80a16 16 0 0 0-22.62 0l-80 80C379.36 126 384.36 144 400 144h48v224h-48c-14.31 0-21.32 17.31-11.31 27.31l80 80a16 16 0 0 0 22.62 0l80-80C580.64 386 575.64 368 560 368z"/></svg>',
        'arrow-right': '<svg viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg>',
        'arrow-left': '<svg viewBox="0 0 448 512"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg>',
        table: '<svg viewBox="0 0 512 512"><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"/></svg>',
        youtube: '<svg viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>'
    };

    window.addEventListener('load', function() {
        addBBCodeToolbars();

        const observer = new MutationObserver(addBBCodeToolbars);
        observer.observe(document.body, { childList: true, subtree: true });

        watchForThemeChanges();
    });

    function watchForThemeChanges() {
        const themeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    updateToolbarStyles();
                }
            });
        });

        themeObserver.observe(document.body, { attributes: true });

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', updateToolbarStyles);
    }

    function updateToolbarStyles() {
        const toolbars = document.querySelectorAll('.bbcode-toolbar');
        toolbars.forEach(toolbar => {
            toolbar.style.display = 'none';
            toolbar.offsetHeight;
            toolbar.style.display = 'flex';
        });
    }

    function addBBCodeToolbars() {
        const textareas = document.querySelectorAll('textarea:not([data-bbcode-toolbar])');

        textareas.forEach(textarea => {
            if (textarea.offsetWidth < 100 || textarea.offsetHeight < 20) return;

            textarea.dataset.bbcodeToolbar = 'added';

            const toolbar = document.createElement('div');
            toolbar.className = 'bbcode-toolbar';

            const buttons = [
                { title: 'Bold', tag: 'b', icon: 'bold', desc: 'Bold Text' },
                { title: 'Italic', tag: 'i', icon: 'italic', desc: 'Italic Text' },
                { title: 'Underline', tag: 'u', icon: 'underline', desc: 'Underlined Text' },
                { title: 'Strikethrough', tag: 's', icon: 'strikethrough', desc: 'Strikethrough Text' },
                { title: 'Center Align', tag: 'center', icon: 'align-center', desc: 'Center Align' },
                { title: 'Right Align', tag: 'right', icon: 'align-right', desc: 'Right Align' },
                { title: 'Quote', tag: 'quote', icon: 'quote-right', desc: 'Add Quote' },
                { title: 'Code', tag: 'code', icon: 'code', desc: 'Code block' },
                { title: 'Spoiler', tag: 'spoiler', icon: 'eye-slash', desc: 'Spoiler Text' },
                { title: 'Link', tag: 'url', icon: 'link', desc: 'Insert lLink' },
                { title: 'Image', tag: 'img', icon: 'image', desc: 'Insert Image' },
                { title: 'YouTube', tag: 'youtube', icon: 'youtube', desc: 'YouTube Video' },
                { title: 'List', tag: 'list', icon: 'list-ul', desc: 'Bullet List' },
                { title: 'Numbered List', tag: 'list=1', icon: 'list-ol', desc: 'Numbered List' },
                { title: 'Size', tag: 'size', icon: 'text-height', desc: 'Text Size' },
                { title: 'Float Right', tag: 'floatright', icon: 'arrow-right', desc: 'Float Right' },
                { title: 'Float Left', tag: 'floatleft', icon: 'arrow-left', desc: 'Float Left' },
                { title: 'Table', tag: 'table', icon: 'table', desc: 'Create Table' }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.type = 'button';
                button.title = btn.desc;
                button.innerHTML = icons[btn.icon];

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    insertBBCode(textarea, btn.tag);
                });

                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        insertBBCode(textarea, btn.tag);
                    }
                });

                toolbar.appendChild(button);
            });

            textarea.parentNode.insertBefore(toolbar, textarea);

            if (textarea.previousElementSibling &&
                textarea.previousElementSibling.classList.contains('bbcode-toolbar')) {
                const separator = document.createElement('div');
                separator.style.cssText = 'height: 8px; width: 100%;';
                textarea.parentNode.insertBefore(separator, textarea);
            }
        });
    }

    function insertBBCode(textarea, tag) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let newText = '';
        let cursorPosition = start;

        switch(tag) {
            case 'url':
                if (selectedText) {
                    if (selectedText.match(/^https?:\/\//)) {
                        newText = `[url]${selectedText}[/url]`;
                    } else {
                        newText = `[url=${selectedText}]${selectedText}[/url]`;
                    }
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[url]https://example.com[/url]`;
                    cursorPosition = start + 6;
                }
                break;

            case 'img':
                if (selectedText) {
                    newText = `[img]${selectedText}[/img]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[img]https://example.com/image.jpg[/img]`;
                    cursorPosition = start + 6;
                }
                break;

            case 'youtube':
                if (selectedText) {
                    newText = `[youtube]${selectedText}[/youtube]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[youtube]RuV3YMEhAB8[/youtube]`;
                    cursorPosition = start + 11;
                }
                break;

            case 'quote':
                if (selectedText) {
                    newText = `[quote]${selectedText}[/quote]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[quote][/quote]`;
                    cursorPosition = start + 7;
                }
                break;

            case 'size':
                if (selectedText) {
                    newText = `[size=4]${selectedText}[/size]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[size=3][/size]`;
                    cursorPosition = start + 8;
                }
                break;

            case 'list':
            case 'list=1':
                if (selectedText) {
                    const lines = selectedText.split('\n');
                    const listItems = lines.map(line => line.trim() ? `[*]${line}` : '').join('\n');
                    newText = `[${tag}]\n${listItems}\n[/list]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[${tag}]\n[*]\n[/list]`;
                    cursorPosition = start + tag.length + 4;
                }
                break;

            case 'table':
                if (selectedText) {
                    newText = selectedText;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[table][tr][td][/td][td][/td][/tr][tr][td][/td][td][/td][/tr][/table]`;
                    cursorPosition = start + 17;
                }
                break;

            default:
                if (selectedText) {
                    newText = `[${tag}]${selectedText}[/${tag}]`;
                    cursorPosition = start + newText.length;
                } else {
                    newText = `[${tag}][/${tag}]`;
                    cursorPosition = start + tag.length + 2;
                }
        }

        textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);

        textarea.focus();

        requestAnimationFrame(() => {
            textarea.setSelectionRange(cursorPosition, cursorPosition);

            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
            const cursorLine = Math.floor(cursorPosition / 80);
            textarea.scrollTop = cursorLine * lineHeight;
        });

        const inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        textarea.dispatchEvent(changeEvent);
    }
})();