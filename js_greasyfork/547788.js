// ==UserScript==
// @name         DOC Dark Mode Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes dark mode toggle on doctorofcredit.com
// @author       sacrosaunt
// @match        https://www.doctorofcredit.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547788/DOC%20Dark%20Mode%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547788/DOC%20Dark%20Mode%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        body,
        header,
        footer,
        .widget,
        #main,
        .entry,
        .content,
        .comment-body,
        #sticky_header,
        .vce-post {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .header-bottom-wrapper {
            background-color: #1e1e1e !important;
        }

        .main-box-inside,
        .vce-cat-links a {
            background-color: #1e1e1e !important;
        }

        a {
            color: #4dabf7 !important;
        }

        a:visited {
            color: #8b68ed !important;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #e0e0e0 !important;
        }

        p, li, span, th, td {
            color: #e0e0e0 !important;
        }

        pre, code, .wp-block-code, .wp-block-preformatted {
            background-color: #1e1e1e !important;
            color: #d4d4d4 !important;
            border: 1px solid #333 !important;
            border-radius: 4px;
            padding: 1em;
        }

        blockquote, .wp-block-quote {
            background-color: #2a2a2a !important;
            border-left: 5px solid #555 !important;
            padding: 10px 20px;
            margin: 0 0 20px;
        }

        table, th, td {
            border-color: #444 !important;
        }

        table {
            background-color: #1e1e1e !important;
            border-color: #555 !important;
        }

        table td,
        table th {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
        }

        thead, .thead {
             background-color: #2a2a2a !important;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="search"],
        textarea,
        select {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border: 1px solid #555 !important;
        }

        .wpnm-slider {
            background-color: #ccc !important;
        }

        .wpnm-button.style-1.active .wpnm-slider {
            background-color: #2196F3 !important;
        }

        .sub-menu {
            background-color: #1e1e1e !important;
        }

        .sub-menu li a {
            color: #e0e0e0 !important;
        }

        .sub-menu li a:hover {
            background-color: #333 !important;
        }

        li.wp-night-mode.menu-item,
        li.wp-night-mode.menu-item:hover {
            background: transparent !important;
        }

        .wp-night-mode {
            background: transparent !important;
        }

        .nav-menu > .menu-item:hover > a {
            background-color: #333 !important;
        }

        .current-menu-item > a,
        .current-menu-ancestor > a,
        .current_page_item > a,
        .current_page_ancestor > a {
            background-color: #333 !important;
            color: #fff !important;
        }

        #toc_container.toc_light_blue {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        #toc_container .toc_title {
            color: #e0e0e0 !important;
        }

        .wpd-form-wrap,
        .wpd-form-head,
        .wpd-form,
        .wpd-field-comment,
        .wpdiscuz-textarea-wrap,
        .ql-container,
        .ql-editor,
        .ql-toolbar,
        .wpdiscuz-subscribe-bar,
        .wpdiscuz-subscribe-form-intro,
        .wpdiscuz-subscribe-form-option,
        .wpdiscuz-item,
        .wpd-avatar {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .ql-editor {
            border: 1px solid #555 !important;
        }

        .ql-toolbar button {
            background-color: #333 !important;
            border-color: #555 !important;
            color: #e0e0e0 !important;
        }

        .ql-toolbar button:hover {
            background-color: #444 !important;
        }

        .wpdiscuz_select,
        .email {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border: 1px solid #555 !important;
        }

        .wpd-prim-button {
            background-color: #4dabf7 !important;
            color: #fff !important;
            border: none !important;
        }

        .dt-paging-button.current {
            border-color: #e0e0e0 !important;
        }

        .wpdiscuz-search-box,
        .wpdiscuz-comm-search {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
        }

        .wpdiscuz-search-box i {
            color: #e0e0e0 !important;
        }

        .wpd-comment-author {
            color: #e0e0e0 !important;
        }

        #comments,
        #respond,
        .comments-area,
        #wpdcom,
        .wpd-comment,
        .wpd-comment-body {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        div#comments,
        div#respond,
        div.comments-area,
        div#wpdcom {
            background-color: #1e1e1e !important;
        }

        .main-box-title {
            color: #e0e0e0 !important;
            background-color: #1e1e1e !important;
        }

        .main-box-title,
        h3.main-box-title,
        .main-box-title[style*="color"],
        h3.main-box-title[style*="color"] {
            color: #e0e0e0 !important;
            background-color: #1e1e1e !important;
        }

        [style*="color: #333333"],
        [style*="color:#333333"],
        [style*="color: #ffffff"],
        [style*="color:#ffffff"] {
            color: #e0e0e0 !important;
        }

        [style*="background: #ffffff"],
        [style*="background:#ffffff"],
        [style*="background-color: #ffffff"],
        [style*="background-color:#ffffff"] {
            background-color: #1e1e1e !important;
        }

        .wp-block {
            color: #e0e0e0 !important;
            background-color: #1e1e1e !important;
        }

        *[style*="background: #ffffff"],
        *[style*="background:#ffffff"],
        *[style*="background-color: #ffffff"],
        *[style*="background-color:#ffffff"],
        *[style*="background: #fcfcfc"],
        *[style*="background:#fcfcfc"] {
            background-color: #1e1e1e !important;
        }

        body[style*="background: #ffffff"],
        body[style*="background:#ffffff"],
        div[style*="background: #ffffff"],
        div[style*="background:#ffffff"],
        main[style*="background: #ffffff"],
        main[style*="background:#ffffff"] {
            background-color: #1e1e1e !important;
        }
    `;

    const positioningCSS = `
        #menu-item-145255 {
            display: inline-block !important;
            width: auto !important;
        }

        .wpnm-button.style-1 {
            display: inline-block !important;
            vertical-align: middle !important;
        }

        span.dark-mode-label {
            display: inline-block !important;
            vertical-align: middle !important;
        }
    `;

    let styleElement = null;
    let positioningElement = null;

    function applyDarkModeStyles() {
        if (!styleElement) {
            styleElement = GM_addStyle(css);
        }
    }

    function removeDarkModeStyles() {
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
        }
    }

    function applyPositioningStyles() {
        if (!positioningElement) {
            positioningElement = GM_addStyle(positioningCSS);
        }
    }

    function updateToggleLabel(text) {
        let label = document.querySelector('.dark-mode-label');
        if (!label) {
            label = document.createElement('span');
            label.className = 'dark-mode-label';
            label.style.cssText = 'margin-left: 10px; font-size: 14px; font-weight: bold; vertical-align: middle; display: inline; line-height: 1;';
            
            const toggleContainer = document.querySelector('.wp-night-mode');
            if (toggleContainer) {
                toggleContainer.appendChild(label);
            }
        }
        
        if (text === 'Dark Mode') {
            label.style.color = '#e0e0e0';
        } else {
            label.style.color = '#4a4a4a';
        }
        
        label.textContent = text;
    }

    function checkToggleStateAndApplyStyles() {
        const toggleButton = document.querySelector('.wpnm-button.style-1');
        if (toggleButton) {
            if (toggleButton.classList.contains('active')) {
                applyDarkModeStyles();
                updateToggleLabel('Dark Mode');
            } else {
                removeDarkModeStyles();
                updateToggleLabel('Light Mode');
            }
        }
    }

    applyPositioningStyles();
    checkToggleStateAndApplyStyles();

    const targetNode = document.querySelector('.wpnm-button.style-1');
    if (targetNode) {
        const config = { attributes: true, attributeFilter: ['class'] };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkToggleStateAndApplyStyles();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
})();
