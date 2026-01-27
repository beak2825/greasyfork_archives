// ==UserScript==
// @name         GVN vB 3.x
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Restore vB 3.x
// @author       quanzi
// @match        https://f.gvn.co/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564158/GVN%20vB%203x.user.js
// @updateURL https://update.greasyfork.org/scripts/564158/GVN%20vB%203x.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* Your custom CSS here */
        body, .message-body, .bbCodeBlock-content {
            font-family: 'Arial', sans-serif !important;
        }
        .block-body {
        		background-color: #f5f5ff;
        }
        .block-container .structItemContainer-group .structItem-title a {
        		color: #22229c !important;
        }
        .structItem {
        		background: hsla(var(--xf-contentAltBg));
        }
        .structItem--thread {
        		border-color: #d1d1e1 !important;
        }
        .structItem-title {
        		font-size: 15px;
            text-decoration: underline !important;
            text-decoration-color: #22229c !important;
        }
        .structItem-minor, .structItem-pageJump {
        		font-size: 12px !important;
        }
        .avatar {
        		background-color: #fff !important;
        }
        .message-cell .avatar {
        		border-radius: 0px;
            padding: 2px;
  					border: 1px solid #a5cae4;
        }
        .structItem a.avatar {
        		border-radius: 0px;
        }
        .structItem-cell {
            padding: 7px 11px;
        }
        .structItem-cell--icon:not(.structItem-cell--iconEnd), .structItem-cell--meta {
        		background: #e1e4f2 none !important;
  					border-right: 1px solid #d1d1e1 !important;
        }
        .structItem-cell--meta {
        		border-left: 1px solid #d1d1e1 !important;
        }
        .structItem-cell--meta dt, .structItem-cell--meta dd {
        		color: black;
        }
        
        .message-cell {
        		background-color: #f5f5ff;
        }
        .bbCodeBlock-content, .bbCodeBlock-title {
        		background-color: #e1e4f2;
        }
        .bbCodeBlock-content {
            font-style: italic;
        }
        .bbCodeBlock-title {
        		font-weight: bold;
            color: black;
        }
        a.bbCodeBlock-sourceJump::after {
        		content: '↑';
            vertical-align: inherit;
            mask: inherit;
            -webkit-mask: inherit;
            background-color: inherit;
        }
        .message-userArrow {
        		display: none;
        }
        .bbCodeBlock {
            border-left: 1px solid #9a9a9a !important;
            border-top: 1px solid #9a9a9a !important;
            border-right: 1px solid #eee !important;
            border-bottom: 1px solid #eee !important;
        }
        .message-userExtras {
        		font-size: 10px;
            padding-top: 6px;
        }
        .message-avatar, .message-name, .message-userTitle {
        		text-align: left;
        }
        .userTitle {
        		font-size: 11px;
        }
        .message .pairs dt, .message .pairs dd {
        		color: black;
            font-size: 10px;
            padding-top: 3px;
        }
        .message .pairs:nth-of-type(1) dt::after {
            content: 'Ngày tham gia: ';
        }
        .message .pairs:nth-of-type(2) dt::after {
        		content: 'Bài viết:';
        }
        .message .pairs:nth-of-type(3) dt::after {
        		content: 'Reactions:';
        }
        .message .pairs svg {
        		display: none;
        }
        .actionBar-action {
        		background: #4b6ca6 url('styles/default/xenforo/gradients/form-button-white-25px.png') repeat-x center -6px !important;
            border-radius: 9px !important;
            line-height: 18px !important;
            height: 19px !important;
            font-weight: bold !important;
            font-size: 8pt !important;
            font-family: verdana,sans-serif !important;
            color: #fff !important;
            padding: 0 8px !important;
            text-shadow: 0 0 2px #000 !important;
        }
        .message {
        		border-top: 22px solid #546994 !important;
            border-radius: 0px !important;
        }
        .message-attribution-main li, .message-attribution-opposite li {
        		top: -31px;
            position: relative;
            text-decoration: none;
            color: white !important;
        }
        .message-attribution-main li:nth-of-type(1) {
            left: -162px;
        }
        .message-attribution {
        		height: 0px;
            padding-bottom: 0px !important;
            border: none;
            font-size: 12px;
        }
        .reactionsBar {
        		background-color: #eaeaff;
            padding-top: 3px !important;
            padding-bottom: 3px !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    
    // Append to head when available
    if (document.head) {
        document.head.appendChild(style);
    } else {
        // Wait for head to be available
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(style);
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
})();