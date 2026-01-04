// ==UserScript==
// @name         Last.fm Bulk Delete Scrobbles
// @description  This script allows a bulk delete of Last.fm scrobbles
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       xXMrJackXx (updated by finnnjake)
// @match        https://*.last.fm/user/*
// @exclude      https://*.last.fm/user/*/loved
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559821/Lastfm%20Bulk%20Delete%20Scrobbles.user.js
// @updateURL https://update.greasyfork.org/scripts/559821/Lastfm%20Bulk%20Delete%20Scrobbles.meta.js
// ==/UserScript==

// please note this is an edited version of xxMrJackXx's original script (greasyfork.org/en/scripts/370386-last-fm-bulk-delete-scrobbles), which I have updated and is working as of 22 Dec 25 on thorium 130.0.6723.174 . Has large clickable areas and the ability to shift click. Also for clarity this was done with AI

/* globals $, exportFunction */

(function() {
    'use strict';

    // Track last clicked checkbox for shift+click range selection
    let lastClickedIndex = null;

    GM_addStyle(`
    .batch-button {
      width: 100px;
      margin-right: 10px;
      border-radius: 6px;
      outline: none;
    }
    .batch-checkbox-cell {
      width: 50px;
      cursor: pointer;
      text-align: center;
      vertical-align: middle;
    }
    .batch-checkbox-cell:hover {
      background-color: rgba(185, 0, 0, 0.1);
    }
    .batch-checkbox {
      cursor: pointer;
      width: 18px;
      height: 18px;
      pointer-events: none;
    }
    `);

    const observer = new MutationObserver(() => $('.chartlist') && process());

    // clear localStorage on first load
    localStorage.clear();
    process();
    registerPJax();

    function init() {
        const main = $(".col-main");
        const div = $("<div id='batchDeleteButtons'>");
        main.prepend(div);

        // add delete button
        const deleteButton = $('<input type="button" value="Delete" class="batch-button"/>');
        deleteButton.click(function() {
            $('table.chartlist').find('input:checked').each(function() {
                // find delete button and simulate a click of every checked checkbox
                const del = this.closest('tr').querySelector('[data-ajax-form-sets-state="deleted"]');
                if (del) { del.click(); }
                // remove from localStorage
                localStorage.removeItem(this.id);
                // remove checkbox
                this.remove();
            });
        });
        div.prepend(deleteButton);

        // add check/uncheck all button
        const checkButton = $('<input type="button" value="Check all" data-type="check" class="batch-button"/>');
        checkButton.click(function() {
            const cbs = $(main).find('input.batch-checkbox');
            if ($(this).attr('data-type') === 'check') {
                $(this).attr('data-type', 'uncheck');
                $(this).val('Uncheck all');
                cbs.prop('checked', true);
                // add every checkbox id to the localStorage
                cbs.each(function() {
                    localStorage.setItem(this.id, this.id);
                });
            } else {
                $(this).attr('data-type', 'check');
                $(this).val('Check all');
                cbs.prop('checked', false);
                // remove every checkbox id from the localStorage
                cbs.each(function() {
                    localStorage.removeItem(this.id);
                });
            }
        });
        div.prepend(checkButton);
    }

    function handleCheckboxChange(checkbox, checked) {
        checkbox.checked = checked;
        if (checked) {
            localStorage.setItem(checkbox.id, checkbox.id);
        } else {
            localStorage.removeItem(checkbox.id);
        }
    }

    function handleCellClick(e) {
        const cell = e.currentTarget;
        const checkbox = cell.querySelector('input.batch-checkbox');
        if (!checkbox) return;

        const allCheckboxes = Array.from(document.querySelectorAll('input.batch-checkbox'));
        const currentIndex = allCheckboxes.indexOf(checkbox);
        const newCheckedState = !checkbox.checked;

        // Shift+click: select range
        if (e.shiftKey && lastClickedIndex !== null && lastClickedIndex !== currentIndex) {
            const start = Math.min(lastClickedIndex, currentIndex);
            const end = Math.max(lastClickedIndex, currentIndex);

            for (let i = start; i <= end; i++) {
                handleCheckboxChange(allCheckboxes[i], newCheckedState);
            }
        } else {
            // Normal click: toggle single checkbox
            handleCheckboxChange(checkbox, newCheckedState);
        }

        lastClickedIndex = currentIndex;
    }

    function process() {
        observer.disconnect();

        // add checkboxes for every not already deleted entries
        $('tr[data-ajax-form-state!="deleted"] .chartlist-play').each(function() {
            const track = $(this).siblings('.chartlist-name').find('a[title]').attr('title');
            const timestamp = $(this).siblings('.chartlist-timestamp').find('span[title]').attr('title');
            if (track !== undefined && timestamp !== undefined) {
                // combination of timestamp and track title should be unique
                const id = normalizeString(timestamp + track);
                const cb = $('<input type="checkbox" class="batch-checkbox" id="' + id + '"/>');
                // Create cell with larger clickable area
                const td = $('<td class="batch-checkbox-cell"/>');
                td.append(cb);
                td.on('click', handleCellClick);
                td.insertBefore($(this));
            }
        });

        // reload localStorage items
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
            // check every checkbox that is contained in the localStorage
            const id = keys[i];
            const cb = $('#' + id);
            if (cb.length) {
                cb.prop('checked', true);
            }
        }

        if ($('.chartlist tbody').length) {
            observer.takeRecords();
            observer.observe($('.chartlist tbody')[0], {childList: true});

            // add buttons only if not already present
            if ($('#batchDeleteButtons').length === 0) {
                init();
            }
        }
    }

    function registerPJax() {
        document.addEventListener('pjax:end:batch-delete', process);
        window.addEventListener('load', function onLoad() {
            window.removeEventListener('load', onLoad);
            unsafeWindow.jQuery(unsafeWindow.document).on('pjax:end', exportFunction(() => document.dispatchEvent(new CustomEvent('pjax:end:batch-delete')), unsafeWindow));
        });
    }

    function normalizeString(str) {
        return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
    }
})();
