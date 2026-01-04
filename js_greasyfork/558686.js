// ==UserScript==
// @name         思齐玩PT 未拥有站点红角标
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在邀请/缴清大厅中，为你尚未拥有的站点卡片添加右上角红色“未拥有”角标
// @author       lingsheen
// @license      Copyright (c) 2025 lingsheen, All Rights Reserved
// @match        https://si-qi.xyz/play_pt.php*
// @icon         https://si-qi.xyz/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558686/%E6%80%9D%E9%BD%90%E7%8E%A9PT%20%E6%9C%AA%E6%8B%A5%E6%9C%89%E7%AB%99%E7%82%B9%E7%BA%A2%E8%A7%92%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/558686/%E6%80%9D%E9%BD%90%E7%8E%A9PT%20%E6%9C%AA%E6%8B%A5%E6%9C%89%E7%AB%99%E7%82%B9%E7%BA%A2%E8%A7%92%E6%A0%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function collectOwnedSiteNames() {
        const ownedNames = new Set();
        // 所有“我的站点”里的卡片：.site-box .name
        document.querySelectorAll('.site-box .name').forEach(nameEl => {
            const text = (nameEl.textContent || '').trim();
            if (text) {
                ownedNames.add(text);
            }
        });
        return ownedNames;
    }

    function findInviteHallContainer() {
        // 找到标题为“邀请大厅”或“缴清大厅”的卡片
        const cards = document.querySelectorAll('.play-pt-card');
        for (const card of cards) {
            const h3 = card.querySelector('h3');
            if (!h3) continue;
            const txt = (h3.textContent || '').trim();
            if (txt.includes('邀请大厅') || txt.includes('缴清大厅')) {
                return card;
            }
        }
        return null;
    }

    function markUnownedInvites() {
        const hall = findInviteHallContainer();
        if (!hall) return;

        const ownedNames = collectOwnedSiteNames();

        // 先清理旧的角标，确保状态刷新时不会重复
        hall.querySelectorAll('.invite-box .pt-unowned-badge').forEach(badge => badge.remove());

        const boxes = hall.querySelectorAll('.invite-box');
        boxes.forEach(box => {
            const nameSpan = box.querySelector('.name span');
            const siteName = nameSpan ? (nameSpan.textContent || '').trim() : '';
            if (!siteName) return;

            const isOwned = ownedNames.has(siteName);

            if (isOwned) {
                // 已拥有就不打标
                return;
            }

            // 未拥有 => 加红色角标
            // 保证卡片可以放绝对定位
            const currentPos = window.getComputedStyle(box).position;
            if (currentPos === 'static' || !currentPos) {
                box.style.position = 'relative';
            }

            const badge = document.createElement('div');
            badge.className = 'pt-unowned-badge';
            badge.textContent = '未拥有';
            badge.style.position = 'absolute';
            badge.style.top = '4px';
            badge.style.right = '4px';
            badge.style.background = '#e53935';
            badge.style.color = '#fff';
            badge.style.fontSize = '10px';
            badge.style.padding = '2px 6px';
            badge.style.borderRadius = '3px';
            badge.style.zIndex = '10';
            badge.style.pointerEvents = 'none';
            badge.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';

            box.appendChild(badge);
        });
    }

    function setupObserver() {
        markUnownedInvites();

        document.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            const text = (btn.textContent || '').trim();
            const oc = btn.getAttribute('onclick') || '';

            const needRecheck =
                // 大厅筛选 / 展开
                oc.indexOf('toggleInviteAll') !== -1 ||
                oc.indexOf('setInviteFilter') !== -1 ||
                // 打开/提交求邀相关
                oc.indexOf('openInviteModal') !== -1 ||
                oc.indexOf('joinInvite') !== -1 ||
                // 兜底：根据按钮文字判断
                text.includes('求邀') ||
                text.includes('求眼熟') ||
                text.includes('加好感');

            if (needRecheck) {
                // 请求 + render 的时间不好精确判断，这里分几次补打标，成本很低
                [200, 800, 1600, 2600].forEach(function (delay) {
                    setTimeout(function () {
                        markUnownedInvites();
                    }, delay);
                });
            }
        });
    }

    function ready(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 0);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(setupObserver);
})();
