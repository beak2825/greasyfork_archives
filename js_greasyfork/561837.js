// ==UserScript==
// @name         SeaArt - Improved batch work item selection, download and deletion
// @description  Makes batch downloading and deleting work items a lot more comfortable
// @author       TheRealHawk
// @license      MIT
// @namespace    https://greasyfork.org/en/users/18936-therealhawk
// @match        https://www.seaart.ai/*
// @version      1.26
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561837/SeaArt%20-%20Improved%20batch%20work%20item%20selection%2C%20download%20and%20deletion.user.js
// @updateURL https://update.greasyfork.org/scripts/561837/SeaArt%20-%20Improved%20batch%20work%20item%20selection%2C%20download%20and%20deletion.meta.js
// ==/UserScript==

/* globals $, jQuery */

(function() {
    'use strict';

    const REPLACED_CLASS = 'tm-replaced-select-50';

    let isActive = false;
    let isDownloading = false;
    let pendingDeletionIDs = [];

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes('batch-cancel') && this._method === 'POST') {
            try {
                const requestData = JSON.parse(body);
                
                if (requestData.work_ids && Array.isArray(requestData.work_ids)) {
                    pendingDeletionIDs = requestData.work_ids;
                } else if (requestData.ids && Array.isArray(requestData.ids)) {
                    pendingDeletionIDs = requestData.ids;
                }
            } catch (e) {
                console.error('SeaArt Script: Error parsing request body', e);
            }
        }

        this.addEventListener('load', function() {
            if (this._url && this._url.includes('/resource/batchImagesZip')) {
                try {
                    const res = JSON.parse(this.responseText);
                    if (res && res.data && res.data.url) {
                        $(document).trigger('seaart_download_ready');
                    }
                } catch (e) {
                    console.error('SeaArt Script: Error parsing XHR response', e);
                }
            }

            if (this._url && this._url.includes('batch-cancel') && this._method === 'POST') {
                try {
                    const res = JSON.parse(this.responseText);
                    if (res && res.status && (res.status.code === 10000 || res.status === 10000)) {
                        setTimeout(() => {
                            $(document).trigger('seaart_items_deleted');
                        }, 100);
                    }
                } catch (e) {
                    console.error('SeaArt Script: Error parsing Delete response', e);
                }
            }
        });

        return originalSend.apply(this, arguments);
    };

    function normalizeText(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    function updateDeleteButton() {
        const $deleteBtn = $('.floating-box .btn-box .item-btn').filter((i, el) => normalizeText($(el).text()) === 'Delete');
        if (isDownloading) {
            $deleteBtn.css({
                'opacity': '0.5',
                'pointer-events': 'none',
                'cursor': 'not-allowed'
            });
        } else {
            $deleteBtn.css({
                'opacity': '1',
                'pointer-events': 'auto',
                'cursor': 'pointer'
            });
        }
    }

    function hookDownloadButton() {
        const $btns = $('.floating-box .btn-box .item-btn').filter(function() {
            return normalizeText($(this).text()) === 'Download';
        });

        $btns.each(function() {
            const $btn = $(this);
            if ($btn.hasClass('tm-download-hooked')) return;

            $btn.addClass('tm-download-hooked');

            $btn.on('click', function() {
                const $txt = $btn.find('span').length ? $btn.find('span') : $btn;
                $txt.text('Fetching');
                $btn.addClass('tm-download-active');
                $btn.css({
                    'opacity': '0.6',
                    'pointer-events': 'none',
                    'cursor': 'not-allowed'
                });

                isDownloading = true;
                updateDeleteButton();
            });
        });
    }

    function hookDeleteButton() {
        const $btns = $('.floating-box .btn-box .item-btn').filter(function() {
            return normalizeText($(this).text()) === 'Delete';
        });

        $btns.each(function() {
            const $btn = $(this);
            if ($btn.hasClass('tm-delete-hooked')) return;
            $btn.addClass('tm-delete-hooked');
        });
    }

    $(document).on('seaart_download_ready', function() {
        isDownloading = false;
        updateDeleteButton();

        const $btn = $('.tm-download-active');
        if ($btn.length) {
            const $txt = $btn.find('span').length ? $btn.find('span') : $btn;

            $txt.text('Complete');
            $btn.css({
                'opacity': '1',
                'pointer-events': 'auto',
                'cursor': 'pointer'
            });

            $btn.removeClass('tm-download-active').addClass('tm-download-complete');
        }
    });

    $(document).on('seaart_items_deleted', function() {
        if (pendingDeletionIDs && pendingDeletionIDs.length > 0) {
            pendingDeletionIDs.forEach((workID) => {
                try {
                    let $item = $('.waterfall-item').filter(function() {
                        const href = $(this).attr('href');
                        if (href && href.includes(workID)) {
                            return true;
                        }
                        
                        const $link = $(this).find('a[href*="' + workID + '"]');
                        return $link.length > 0;
                    });
                    
                    if ($item.length) {
                        $item.remove();
                    } else {
                        const $byData = $('.waterfall-item').filter(function() {
                            const dataId = $(this).attr('data-id') || $(this).attr('data-work-id') || $(this).data('id') || $(this).data('work-id');
                            return dataId === workID;
                        });
                        
                        if ($byData.length) {
                            $byData.remove();
                        }
                    }
                } catch (e) {
                    console.error('SeaArt Script: Error removing item', e);
                }
            });
            
            pendingDeletionIDs = [];
        }
    });

    function ensureEditModeActive() {
        const $editBtn = $('.manageGroup .edit-btn');
        if ($editBtn.length && !$editBtn.hasClass('active')) {
            $editBtn[0].click();
        }
    }

    function nativeClick(element) {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    function unselectAll() {
        const $cancelBtn = $('.floating-box .btn-box .item-btn').filter((i, el) => normalizeText($(el).text()) === 'Cancel');
        if ($cancelBtn.length) {
            nativeClick($cancelBtn[0]);
            return;
        }

        const $items = $('.waterfall-item:visible');
        $items.slice(0, 50).each(function() {
            const $this = $(this);
            let $target = $this.find('.listCnt, .marking-item');
            if (!$target.length) $target = $this;
            nativeClick($target[0]);
        });
    }

    async function selectFirstN(targetCount) {
        let selectedIDs = new Set();
        let retries = 0;
        const MAX_RETRIES = 20;

        while (selectedIDs.size < targetCount) {
            const $items = $('.waterfall-item:visible');
            let foundNewItem = false;

            $items.each(function() {
                if (selectedIDs.size >= targetCount) return false;
                const $this = $(this);

                let uniqueId = $this.attr('href');
                if (!uniqueId) {
                    const $childLink = $this.find('a[href*="/explore/detail/"]');
                    if ($childLink.length) uniqueId = $childLink.attr('href');
                }

                if (uniqueId && !selectedIDs.has(uniqueId)) {
                    selectedIDs.add(uniqueId);
                    foundNewItem = true;
                    let $target = $this.find('.listCnt, .marking-item');
                    if (!$target.length) $target = $this;
                    nativeClick($target[0]);
                }
            });

            if (selectedIDs.size >= targetCount) break;

            if (foundNewItem) retries = 0;
            else retries++;

            if (retries > MAX_RETRIES) break;

            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(r => setTimeout(r, 600));
        }
    }

    function replaceSelectAllButton() {
        ensureEditModeActive();
        const $btnBox = $('.floating-box .btn-box');
        if (!$btnBox.length) return;

        const $originalBtn = $btnBox.find('.item-btn').filter(function() {
            return $(this).find('.check-box').length > 0 && !$(this).hasClass(REPLACED_CLASS);
        });

        if (!$originalBtn.length) return;

        const $newBtn = $originalBtn.clone().addClass(REPLACED_CLASS);
        const $textSpan = $newBtn.find('span');
        $textSpan.text('Select 50');

        const $checkIcon = $newBtn.find('.check-box i');

        if (isActive) {
            $checkIcon.show().css({'visibility': 'visible', 'opacity': '1'});
        } else {
            $checkIcon.hide();
        }

        $newBtn.off('click').on('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($newBtn.hasClass('tm-working')) return;

            isActive = !isActive;

            $newBtn.addClass('tm-working').css('opacity', '0.7');

            if (isActive) {
                $checkIcon.show().css({'visibility': 'visible', 'opacity': '1'});
                $textSpan.text('Selecting...');
                try {
                    await selectFirstN(50);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } catch (err) {
                    console.error(err);
                    isActive = false;
                    $checkIcon.hide();
                } finally {
                    $newBtn.removeClass('tm-working').css('opacity', '1');
                    $textSpan.text('Select 50');
                }
            } else {
                $checkIcon.hide();
                $textSpan.text('Unselecting...');
                try {
                    unselectAll();
                } catch(err) {
                    console.error(err);
                } finally {
                    $newBtn.removeClass('tm-working').css('opacity', '1');
                    $textSpan.text('Select 50');
                }
            }
        });
        $originalBtn.replaceWith($newBtn);
    }

    function removeSortAndPostButtons() {
        const $bar = $('.floating-box .btn-box');
        if ($bar.length) {
            $bar.find('.item-btn').each(function() {
                const $btn = $(this);

                const hasSortTrigger = $btn.find('.moveBnt').length > 0;
                const hasSortIcon = $btn.find('i.icon-tupianji').length > 0;

                if (hasSortTrigger || hasSortIcon) {
                    const $refWrap = $btn.closest('.el-popover__reference-wrapper');
                    if ($refWrap.length) $refWrap.remove();
                    else $btn.remove();
                    return;
                }

                if (normalizeText($btn.text()) === 'Post') {
                    $btn.remove();
                }
            });
        }
    }

    function cleanInterface() {
        removeSortAndPostButtons();
        updateDeleteButton();
    }

    $(document).ready(function() {
        setInterval(() => {
            if ($('.manageGroup').length) {
                replaceSelectAllButton();
            }
            hookDownloadButton();
            hookDeleteButton();
            cleanInterface();
        }, 1000);
    });

})();
