// ==UserScript==
// @name         D3.ru Dark Theme Toggle
// @namespace    https://d3.ru
// @version      2025.12.06
// @description  Dark-light toggle for d3.ru, uses cookies
// @author       Anton
// @match        https://d3.ru/*
// @match        https://*.d3.ru/*
// @grant        none
// @run-at       document-start
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556986/D3ru%20Dark%20Theme%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/556986/D3ru%20Dark%20Theme%20Toggle.meta.js
// ==/UserScript==


(function injectSelf() {
    console.log('D3 injection');
    // 1. Compose the main script body as a string:
    const code = '(' + function() {
        console.log('D3 injection STARTED');

        function getCookie(name) {
            return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
        }

        if (window.__D3_Dark_Theme_Active__) {
            console.log('Already injected. Theme is active: '+ getCookie('d3ru-dark'));
            return;
        }
        window.__D3_Dark_Theme_Active__ = true;

        // --------- FASTER: Insert minimal style tag right away if dark is enabled ---------
        if (getCookie('d3ru-dark') === '1') {
            const quick = document.createElement('style');
            quick.id = 'd3-dark-theme-style-instant';
            quick.textContent = `
            html, body { background: #111 !important; color: #fff !important; }
        `;
            document.documentElement.appendChild(quick); // as early as possible
        }

        // --------- All the rest runs after DOM is ready ---------
        function start() {
            if (!document.body) {
                setTimeout(start, 50);
                return;
            }
            console.log('D3 injection on DOMContentLoaded');

            let DARK_CSS = `
        .react, .react .b-karma_vote-count_0 .b-karma__value { color: #FFF !important; }
        .react .b-user-popup__location, .react .b-user-popup__note-text, .react .b-sidebar-social__title { color: #EEE !important; }
        .react .b-link_color_blue, .react .p-post-item__menu-section.b-radio_checked_true .b-radio__label { color: rgb(100 120 205) !important; }
        .react .b-link_color_black, .react .b-radio_mode_tab, .react .b-rating_vote-sign_zero .b-rating__value, .react .b-user-login_color_black { color: #EEE !important; }
        html, body, .react .w-app { background: #111 !important; }
        .react .b-user-popup, .react .b-domain-popup { background: #444 !important; }
        .react .b-post-cut, .react .p-post-item__layout { background: #333 !important; }
        .react .b-sidebar-footer__fixed-container { background: #333 !important; border: 1px solid #444 !important; }
        .react .b-context-menu__container { background: #222 !important; }
        .react .b-button_mode_default.b-button_color_white { color: #EEE !important; background: #222 !important; border: 1px solid #444 !important; }
        .react .s-footer { background: #222 !important; border-top: 1px solid #444 !important; }
        .react .b-comment_unread_true.b-comment_mode_default.b-comment_folded_false>.b-comment__body { background: #444 !important; }
        .react .b-base-sidebar__post-list, .react .p-post-item__post-list, .react .p-post-item__sidebar, .react .b-wysiwyg__editor, .react .b-tag { background: #333 !important; }
        .react .b-domain-info { background: #333 !important; border-color: #444 !important; border-width: 1px !important; }
        .react .b-action_color_textgrey { color: rgba(125,125,125,1) !important; }
        .react .p-post-item__menu-section .b-radio__label { color: rgba(125,125,125,1) !important; }
        .react .b-post-footer { color: rgba(125,125,125,1) !important; }
        .react .b-comment__footer { color: rgba(125,125,125,1) !important; }
        .react .b-button.b-button_mode_icon.b-button_color_textgrey { color: rgba(125,125,125,1) !important; }
        .react .b-sidebar-post__rating { color: rgba(125,125,125,1) !important; text-shadow: 1px 1px 0 #333; }
        .react .s-domain-toolbar { background: #222 !important; }
        .react .b-icon { fill: currentColor; }
        .react .p-post-item__layout, .react .p-post-item__post-list, .react .b-post-cut, .react .b-base-sidebar__post-list { border: 1px solid #444 !important; }
        .react .b-sidebar-post { border-bottom: 1px solid #444 !important; }
        .react .p-post-item__line { background: #444 !important; }
        .react .b-button_mode_default.b-button_color_snowgrey { background: #333 !important; color: #CCC !important; }
        .react .b-notification-popup__toolbar, .react .b-notification { background: #333 !important; border-bottom: 1px solid #444 !important; }
        .react .b-notification_unread_true { background: #555 !important; }
        .react .b-notification-popup { background: #333 !important; border: 1px solid #444 !important; }
        .react .b-button.b-button_mode_default.b-button_color_white-textgrey { background: #333 !important; border: 1px solid #444 !important; }
        .react .b-wysiwyg__toolbar { background: #444 !important; }
        .react .b-wysiwyg__button_action_b.active, .react .b-wysiwyg__button_action_i.active, .react .b-wysiwyg__button_action_irony.active, .react .b-wysiwyg__button_action_link.active, .react .b-wysiwyg__button_action_u.active { background: #333 !important; }
        .react .b-tag { border: 1px solid #444 !important; }
        html.react .s-footer__app-button { border: 1px solid #444 !important; }
        .react .b-search { border: 1px solid #444 !important; }
        .react .b-select__menu { background: #444 !important; }
        .react .b-checkbox_mode_toggle .b-checkbox__box { background: #666 !important; border-color: #444 !important; }
        .react .s-menu__popup, .react .s-menu__domain-list { background: #444 !important; }
        .react .b-link_color_textgrey { color: #EEE !important; }
        .b-user_cover-bg { background: #333 !important; }
        .react .b-tag_mode_text .b-tag__link { padding: 0 1px !important; }
        .react .b-post-cut__gallery-image { border: 2px solid #333 !important; }
        .react .b-rating-popup { background: #444 !important; }
        .react .b-rating-popup__value { color: #EEE !important; }
        .b-form_submit { background: #333 !important; }
        .react .b-alert { background: #444 !important; }
        .react .p-post-tag__sidebar-info { background: #333 !important; border: 1px solid #444 !important; }
        .react .b-feed-message__container { background: #222 !important; }
        `;
        // Special for "Inboxes"
        DARK_CSS += `
        .l-content, .l-header { background: #333 !important; color: #FFF !important; }
        .l-header { box-shadow: inset 0 -2px 0 -1px #444; }
        .l-base_domain .b-header_nav_button__active, .b-inbox_controls { background: #555 !important; }
        .b-header_nav_button .b-button_caption { color: #FFF !important; }
        .b-menu_link { background: transparent !important; color: #EEE !important; border-bottom: #555 !important; }
        .b-menu_link_text { border-top: #555 !important; }
        .post_inbox_page .post h3 { color: #FFF !important; }
        .b-notification-item, a.b-notification-item_mention_link { color: #EEE !important; }
        `
        // Special for "New post"
        DARK_CSS += `
        .b-post_header, .b-post_header .l-header-base, .space_page .l-header-base, .l-adv_page .l-header-base { background: #333 !important; color: #EEE !important; }
        .b-new_post, .b-new_post_footer, .b-new_post_domain { background: #333 !important; color: #EEE !important; }
        .l-footer { background: #333 !important; border-top: 1px solid #444 !important; }
        .i-form_textarea_white, .i-form_text_input_white { background: #444 !important; color: #EEE !important; }
        .b-tags_link { background: #444 !important; color: #EEE !important; }
        .i-form_textarea_pure { color: #EEE !important; border: 1px solid #444 !important; }
        .b-textarea_editor { background: #444 !important; color: #EEE !important; }
        .b-post_page_post .b-post_preview { background: #444 !important; color: #EEE !important; }
        irony, .irony { color: #E44 !important; }
        .b-post_tags .tag { color: #EEE !important; background-color: #444 !important; border-right: 1px solid #444 !important; border-bottom: 1px solid #444 !important; }
        .tag { border: 1px solid #444 !important; }
        .b-post_file_uploader a { color: #EEE !important; }
        .b-post_page { background: #111 !important; }
        `
        // Special for subdomain edit
        DARK_CSS += `
        .react .p-domain-editor-main__container { background: #333 !important; color: #EEE !important; border: 1px solid #444 !important; }
        .react .p-domain-editor-main__header { color: #FFF !important; }
        .react .p-domain-editor-ban__container { background: #333 !important; color: #EEE !important; border: 1px solid #444 !important; }
        .react .p-domain-editor-ban__header { color: #FFF !important; }
        .react .b-search__toggle-button  { color: #EEE !important; }
        `
        // Special for "Loading" screen
        DARK_CSS += `
        body #overlay { background: #111 !important; }
        `
        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.style = `
            position: fixed; top: 16px; right: 16px; z-index: 10000;
            background: #222; color: #fff; border: none; border-radius: 20px;
            padding: 6px 13px; font-size: 21px; cursor: pointer;
            box-shadow: 0 2px 10px #0004;
        `;
        let darkStyle = null;

        function setCookie(name, value, days = 365) {
            let d = new Date();
            d.setTime(d.getTime() + days*24*60*60*1000);
            document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; domain=.d3.ru; SameSite=Lax`;
        }

        function enableDark() {
            if (!darkStyle) {
                darkStyle = document.createElement('style');
                darkStyle.id = 'd3-dark-theme-style';
                darkStyle.textContent = DARK_CSS;
                document.head.appendChild(darkStyle);
            }
            // Remove fast inital style if present
            document.getElementById('d3-dark-theme-style-instant')?.remove();
            btn.textContent = '🌙';
            setCookie('d3ru-dark', '1');
        }

        function disableDark() {
            if (darkStyle) darkStyle.remove();
            darkStyle = null;
            btn.textContent = '☀️';
            setCookie('d3ru-dark', '');
            document.getElementById('d3-dark-theme-style-instant')?.remove();
        }

        btn.onclick = function() {
            if (darkStyle) disableDark();
            else enableDark();
        };

        // Init
        if (getCookie('d3ru-dark') === '1') enableDark();
        else disableDark();

        document.body.appendChild(btn);

        function ensureTheme() {
            console.log('checking theme...')
            if (!document.getElementById('theme-toggle-btn')) {
                document.body.appendChild(btn);
            }
            if (getCookie('d3ru-dark') === '1') {
                if (!document.getElementById('d3-dark-theme-style')) enableDark();
            } else {
                if (document.getElementById('d3-dark-theme-style')) disableDark();
            }
        }
        const mo = new MutationObserver(ensureTheme);
        mo.observe(document.body, {childList:true, subtree:true});
        //setInterval(ensureTheme, 500);
        window.addEventListener('popstate', ensureTheme);
    }
        start();
    }.toString() + ')();';

    // 2. Actually inject it as a <script> node:
    const el = document.createElement('script');
    el.textContent = code;
    document.documentElement.appendChild(el);
})();