// ==UserScript==
// @license      Suruga-ya
// @name         メルカリMOD
// @namespace    S2
// @version      1.0
// @author       A2
// @match        https://jp.mercari.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercari.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        none
// @description  ja
// @downloadURL https://update.greasyfork.org/scripts/560728/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AAMOD.user.js
// @updateURL https://update.greasyfork.org/scripts/560728/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AAMOD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'mercari_search_status_pref';

    const setupStatusRadioButtons = () => {
        if ($('#custom-search-status-container').length) return;

        const $navTop = $('.merNavigationTop');
        if (!$navTop.length) return;

        const savedStatus = localStorage.getItem(STORAGE_KEY) || 'all';

        const html = `
            <div id="custom-search-status-container" style="
                display: flex;
                gap: 15px;
                padding: 8px 16px;
                background-color: var(--color-surface-primary, #fff);
                color: var(--color-text-primary, #333);
                border-bottom: 1px solid var(--color-border-primary, #e5e5e5);
                font-size: 14px;
                align-items: center;
                transition: background-color 0.3s, color 0.3s;
            ">
                <span style="font-weight: bold; margin-right: 5px;">販売状況:</span>
                <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <input type="radio" name="searchStatus" value="all" ${savedStatus === 'all' ? 'checked' : ''}> すべて
                </label>
                <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <input type="radio" name="searchStatus" value="on_sale" ${savedStatus === 'on_sale' ? 'checked' : ''}> 販売中
                </label>
                <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <input type="radio" name="searchStatus" value="sold_out" ${savedStatus === 'sold_out' ? 'checked' : ''}> 売り切れ
                </label>
            </div>
        `;

        $navTop.after(html);

        $(document).on('change', 'input[name="searchStatus"]', function() {
            localStorage.setItem(STORAGE_KEY, $(this).val());
        });
    };

    const executeCustomSearch = ($input) => {
        const status = localStorage.getItem(STORAGE_KEY) || 'all';
        const keyword = $input.val();

        if (keyword) {
            let statusParam = '';
            if (status === 'on_sale') {
                statusParam = '&status=on_sale';
            } else if (status === 'sold_out') {
                statusParam = '&status=sold_out%7Ctrading';
            }
            const searchUrl = `/search/?keyword=${encodeURIComponent(keyword)}${statusParam}`;
            window.location.href = searchUrl;
            return true;
        }
        return false;
    };

    $(document).on('keydown', 'form[role="search"] input, form[data-testid="chip-search-input"] input', function(e) {
        if (e.key === 'Enter') {
            if (executeCustomSearch($(this))) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    });

    // 既存のALT+Q機能（変更なし）
    $(document).on('keydown', function(e) {
        if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
            const $searchForm = $('form[role="search"], form[data-testid="chip-search-input"]');
            const $searchInput = $searchForm.find('input').first();

            $searchInput.focus().select();
        }
    });

    // 要素の出現を監視してUIを設置（SPA対策）
    setInterval(setupStatusRadioButtons, 1000);

})();