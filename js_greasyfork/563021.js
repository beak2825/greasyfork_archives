// ==UserScript==
// @name          Open2ch Find Link Modifier
// @namespace     https://greasyfork.org/ja/users/864059
// @version       0.6
// @description   レス番号リンクのハイフン削除と、安価があればそれも含める修正。表示数(/lXX)を動的に変更。プリセットボタン付き。
// @author        七色の彩り
// @match         https://find.open2ch.net/*
// @icon         https://open2ch.net/favicon.ico
// @grant         none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/563021/Open2ch%20Find%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563021/Open2ch%20Find%20Link%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetLValue = localStorage.getItem('open2ch_find_l_value') || '50';
    let observer = null;

    function injectUI() {
        if ($('#l-modifier-container').length) return;
        const customStyle = `<style>
            .l-preset-btn { margin-left: 5px; padding: 2px 6px; font-size: 11px; cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 3px; display: inline-block; }
            .l-preset-btn:hover { background: #ddd; }
            #l-modifier-container { margin-top: 0px; display: flex; align-items: center; flex-wrap: wrap; color: #333; }
        </style>`;
        const uiHtml = `
            <div id="l-modifier-container">
                <span style="font-size: 12px; font-weight: bold; margin-right: 5px;">スレタイリンク</span>
                <input type="text" id="l-value-input" class="form-control"
                       value="${targetLValue === 'all' ? '' : targetLValue}"
                       placeholder="${targetLValue === 'all' ? 'ALL' : ''}"
                       style="width: 60px; height: 28px; display: inline-block; text-align: center;">
                <div id="l-presets">
                    <span class="l-preset-btn" data-val="10">l10</span>
                    <span class="l-preset-btn" data-val="30">l30</span>
                    <span class="l-preset-btn" data-val="50">l50</span>
                    <span class="l-preset-btn" data-val="100">l100</span>
                    <span class="l-preset-btn" data-val="all">ALL</span>
                </div>
            </div>`;
        $('head').append(customStyle);
        $('.input-group').after(uiHtml);

        $('#l-value-input').on('input', function() {
            updateLValue($(this).val() === '' ? 'all' : $(this).val());
        });
        $('.l-preset-btn').on('click', function() {
            const val = $(this).data('val');
            $('#l-value-input').val(val === 'all' ? '' : val).attr('placeholder', val === 'all' ? 'ALL' : '');
            updateLValue(val);
        });
    }

    function updateLValue(val) {
        targetLValue = val;
        localStorage.setItem('open2ch_find_l_value', val);
        fixFindLinks();
    }

    function fixFindLinks() {
        // 監視を一時停止して無限ループを防ぐ
        if (observer) observer.disconnect();

        // 1. スレタイおよびli要素の修正
        $('.result .subject a, li.list-group-item[url]').each(function() {
            let attrName = $(this).is('a') ? 'href' : 'url';
            let url = $(this).attr(attrName);
            if (!url || !url.includes('/test/read.cgi/')) return;

            if (!$(this).data('original-url')) $(this).data('original-url', url);

            let base = $(this).data('original-url').replace(/\/l\d+$/, '');
            let newUrl = (targetLValue === 'all') ? base : `${base}/l${targetLValue}`;
            if (url !== newUrl) $(this).attr(attrName, newUrl);
        });

        // 2. レス番号リンクの修正
        $('.result .content .th').each(function() {
            const $th = $(this);
            const $link = $th.find('a').first();
            let href = $link.attr('href');
            if (!href) return;

            if (!$link.data('original-href')) $link.data('original-href', href);

            let newHref = $link.data('original-href').replace(/-$/, '');
            $link.text($link.text().replace(/-$/, ''));

            const thText = $th.text();
            const matches = thText.match(/(?:>>|!aku|!kaijo|!cap|!set|!sub)(\d+)/g);
            if (matches) {
                const nums = matches.map(m => m.match(/\d+/)[0]);
                const uniqueNums = [...new Set(nums)];
                newHref += ',' + uniqueNums.join(',');
            }

            if (href !== newHref) $link.attr('href', newHref);
        });

        // 監視を再開
        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    $(function() {
        injectUI();

        observer = new MutationObserver(function() {
            // UIが消えていれば再注入
            if (!$('#l-modifier-container').length) injectUI();
            fixFindLinks();
        });

        fixFindLinks();
    });

})();