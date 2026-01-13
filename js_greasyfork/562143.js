// ==UserScript==
// @name         Быстрые жалобы
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Добавляет кнопку быстрой жалобы
// @author       Forest
// @match        https://lolz.live/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562143/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562143/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentUsername() {
        if (typeof XenForo !== 'undefined' && XenForo.visitor && XenForo.visitor.username) {
            return XenForo.visitor.username;
        }
        const $visitor = $('.visitorMenu .username');
        return $visitor.length ? ($visitor.attr('data-username') || $visitor.text().trim()) : null;
    }

    function extractUsername($item, isComment) {
        if (!isComment) {
            return $item.attr('data-author');
        }

        const $customUsername = $item.find('.uniqueUsernameIcon--custom').first();
        if ($customUsername.length) {
            return $customUsername.text().trim();
        }

        const $usernameLink = $item.find('.commentInfo a.username').first();
        if ($usernameLink.length) {
            const $usernameSpan = $usernameLink.find('span').first();
            if ($usernameSpan.length) {
                return $usernameSpan.text().trim();
            }

            const textNode = $usernameLink.contents().filter(function() {
                return this.nodeType === 3;
            }).first();
            if (textNode.length) {
                const text = textNode.text().trim();
                if (text) return text;
            }
        }

        const $avatarLink = $item.find('.avatarUseraaBadges a.avatar').first();
        if ($avatarLink.length) {
            const href = $avatarLink.attr('href');
            if (href) {
                return href.replace(/\/$/, '').split('/').pop();
            }
        }

        return null;
    }

    function addReportButtons() {
        const currentUser = getCurrentUsername();

        $('.message, .comment').each(function() {
            const $item = $(this);
            const isComment = $item.hasClass('comment');
            const $controls = $item.find(isComment ? '.commentControls' : '.publicControls').first();

            if (!$controls.length || $controls.find('.lzt-quick-report').length) return;

            const username = extractUsername($item, isComment);
            if (!username) return;
            if (currentUser && username.toLowerCase() === currentUser.toLowerCase()) return;

            const itemId = $item.attr('id');
            let evidenceUrl = window.location.href;

            if (isComment && itemId) {
                const numericId = itemId.replace('post-comment-', '');
                const threadUrl = window.location.href.split('?')[0].split('#')[0];
                evidenceUrl = `${threadUrl}?comment_id=${numericId}#post-comment-${numericId}`;
            } else if (!isComment && itemId) {
                const numericId = itemId.replace('post-', '');
                evidenceUrl = `https://lolz.live/posts/${numericId}/`;
            } else if (!isComment && $item.is('.message:first')) {
                evidenceUrl = window.location.href.split('#')[0].split('?')[0];
            }

            const messageBody = `[club]1. Профиль нарушителя: @${username}
2. Краткое описание жалобы:
3. Доказательства: ${evidenceUrl}[/club]`;

            const reportUrl = `/forums/801/create-thread?title=${encodeURIComponent('Жалоба на пользователя "' + username + '"')}&message=${encodeURIComponent(messageBody)}`;

            $controls.prepend(`
                <a href="${reportUrl}" class="item control lzt-quick-report" style="color: red;" target="_blank" title="Пожаловаться на ${username}">
                    <span class="fa fa-exclamation-triangle"></span>
                </a>
            `);
        });
    }

    $(document).on('XenForoActivationComplete', function() {
        addReportButtons();
    });

    $(document).ready(function() {
        addReportButtons();
    });

})();