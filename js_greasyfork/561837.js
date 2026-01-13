// ==UserScript==
// @name         SeaArt - Improved batch work item selection, download and deletion
// @description  Makes batch downloading and deleting work items a lot more comfortable
// @author       TheRealHawk
// @license      MIT
// @namespace    https://greasyfork.org/en/users/18936-therealhawk
// @match        https://www.seaart.ai/*
// @version      1.53
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @connect      cdn.seaart.ai
// @connect      seaart.ai
// @connect      www.seaart.ai
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/561837/SeaArt%20-%20Improved%20batch%20work%20item%20selection%2C%20download%20and%20deletion.user.js
// @updateURL https://update.greasyfork.org/scripts/561837/SeaArt%20-%20Improved%20batch%20work%20item%20selection%2C%20download%20and%20deletion.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    const REPLACED_CLASS_PREFIX = 'tm-replaced-select-';
    const SELECT_COUNTS = [25, 50];

    let activeSelectCount = 0;
    let isDownloading = false;
    let pendingDeletionIDs = [];
    let blockedZipUrl = null;

    function resolveUrl(url) {
        if (!url) return url;
        if (url.startsWith('http')) return url;
        if (url.startsWith('//')) return window.location.protocol + url;
        return window.location.origin + (url.startsWith('/') ? '' : '/') + url;
    }

    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const el = originalCreateElement.apply(this, arguments);
        if (tagName.toLowerCase() === 'a') {
            const originalClick = el.click;
            el.click = function() {
                if (blockedZipUrl && this.href && this.href.includes(blockedZipUrl)) {
                    return;
                }
                return originalClick.apply(this, arguments);
            };
        }
        return el;
    };

    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
        if (blockedZipUrl && url && url.includes(blockedZipUrl)) {
            return null;
        }
        return originalWindowOpen.apply(this, arguments);
    };

    const XHR = XMLHttpRequest.prototype;
    const originalOpen = XHR.open;
    const originalSend = XHR.send;

    XHR.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
    };

    XHR.send = function(body) {
        if (this._url && this._url.includes('/resource/batchImagesZip')) {
            this.addEventListener('load', function() {
                try {
                    if (!this.responseText) return;
                    const res = JSON.parse(this.responseText);

                    if (res && res.data && res.data.url && res.data.url.trim() !== '') {
                        const url = res.data.url;
                        blockedZipUrl = url;
                        downloadAndVerify(url);
                    } else if (res && res.status && (res.status.code === 10000 || res.status === 10000)) {
                         const $btn = $('.tm-download-active span');
                         if($btn.length && $btn.text() !== 'Processing...') {
                             $btn.text('Processing...');
                         }
                    }
                } catch (e) {}
            });
        }

        if (this._url && this._url.includes('batch-cancel') && this._method === 'POST') {
            try {
                const requestData = JSON.parse(body);
                if (requestData.work_ids && Array.isArray(requestData.work_ids)) {
                    pendingDeletionIDs = requestData.work_ids;
                } else if (requestData.ids && Array.isArray(requestData.ids)) {
                    pendingDeletionIDs = requestData.ids;
                }
            } catch (e) {}

            this.addEventListener('load', function() {
                 try {
                    const res = JSON.parse(this.responseText);
                    if (res && res.status && (res.status.code === 10000 || res.status === 10000)) {
                        setTimeout(() => {
                            $(document).trigger('seaart_items_deleted');
                        }, 500);
                    }
                } catch (e) {}
            });
        }

        return originalSend.apply(this, arguments);
    };

    function triggerDownloadState(state, progress) {
        $(document).trigger('seaart_download_update', { state, progress });
    }

    function downloadAndVerify(url) {
        const absoluteUrl = resolveUrl(url);
        const fileName = absoluteUrl.split('/').pop().split('?')[0] || 'seaart_batch.zip';

        triggerDownloadState('Verifying', 0);

        GM_xmlhttpRequest({
            method: 'GET',
            url: absoluteUrl,
            responseType: 'blob',
            onprogress: function(e) {
                if (e.lengthComputable) {
                    const percent = Math.floor((e.loaded / e.total) * 100);
                    triggerDownloadState('Downloading', percent);
                }
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const blob = response.response;
                    const contentLength = response.responseHeaders.match(/content-length:\s*(\d+)/i);
                    const expectedSize = contentLength ? parseInt(contentLength[1], 10) : null;

                    if (expectedSize && blob.size !== expectedSize) {
                        triggerDownloadState('Corrupt');
                        const serverMB = (blob.size / (1024 * 1024)).toFixed(2);
                        const expectedMB = (expectedSize / (1024 * 1024)).toFixed(2);
                        alert(`Download failed validation. Server sent ${serverMB} MB, expected ${expectedMB} MB.`);
                        return;
                    }

                    saveFile(blob, fileName);
                    triggerDownloadState('Complete');
                } else {
                    triggerDownloadState('Error');
                }
            },
            onerror: function(err) {
                triggerDownloadState('Error');
            }
        });
    }

    function saveFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);

        if (a.click) {
             a.click();
        }

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    function normalizeText(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function addCustomStyles() {
        if ($('#tm-custom-styles').length) return;
        const style = document.createElement('style');
        style.id = 'tm-custom-styles';
        style.textContent = `
            .tm-select-btn {
                color: #fff !important;
                opacity: 1 !important;
                cursor: pointer !important;
                pointer-events: auto !important;
                transition: background-color 0.2s ease, opacity 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .tm-select-btn:hover {
                background-color: rgba(255, 255, 255, 0.15) !important;
            }
            .tm-select-btn span {
                color: #fff !important;
            }
            .tm-select-btn-disabled {
                opacity: 0.5 !important;
                pointer-events: none !important;
                cursor: not-allowed !important;
                background-color: transparent !important;
            }
            .tm-select-btn-disabled span {
                color: rgba(255, 255, 255, 0.5) !important;
            }
            .tm-disabled-state {
                opacity: 0.5 !important;
                pointer-events: none !important;
                cursor: not-allowed !important;
            }
            .tm-download-complete span {
                color: #4caf50 !important;
            }
            .tm-download-error span {
                color: #f44336 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function updateDeleteButton() {
        const $deleteBtn = $('.floating-box .btn-box .item-btn').filter((i, el) => normalizeText($(el).text()) === 'Delete');
        if (isDownloading) {
            $deleteBtn.addClass('tm-disabled-state');
        } else {
            $deleteBtn.removeClass('tm-disabled-state');
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
                $btn.addClass('tm-download-active tm-disabled-state');
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

    function forceGridRepack() {
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
            const $activeFilter = $('.item-filter.active').first();
            if ($activeFilter.length) {
                nativeClick($activeFilter[0]);
            }
        }, 100);
    }

    $(document).on('seaart_download_update', function(e, data) {
        const $btn = $('.tm-download-active');
        if (!$btn.length) return;

        const $txt = $btn.find('span').length ? $btn.find('span') : $btn;

        if (data.state === 'Downloading') {
            $txt.text(`DL ${data.progress}%`);
        } else if (data.state === 'Verifying') {
            $txt.text('Verifying...');
        } else if (data.state === 'Complete') {
            $txt.text('Complete');
            $btn.removeClass('tm-disabled-state tm-download-active').addClass('tm-download-complete');
            isDownloading = false;
            updateDeleteButton();
        } else if (data.state === 'Error' || data.state === 'Corrupt') {
            $txt.text('Download');
            $btn.removeClass('tm-disabled-state tm-download-active tm-download-error');
            isDownloading = false;
            updateDeleteButton();
        }
    });

    $(document).on('seaart_items_deleted', function() {
        // Reset Download Button State
        const $dlBtn = $('.floating-box .btn-box .item-btn').filter(function() {
            return $(this).hasClass('tm-download-hooked');
        });
        if ($dlBtn.length) {
            $dlBtn.removeClass('tm-download-active tm-download-complete tm-download-error tm-disabled-state');
            const $txt = $dlBtn.find('span').length ? $dlBtn.find('span') : $dlBtn;
            $txt.text('Download');
            isDownloading = false;
        }

        if (pendingDeletionIDs && pendingDeletionIDs.length > 0) {
            let removedCount = 0;
            pendingDeletionIDs.forEach((workID) => {
                try {
                    let $item = $('.waterfall-item').filter(function() {
                        const href = $(this).attr('href');
                        if (href && href.includes(workID)) return true;
                        const $link = $(this).find('a[href*="' + workID + '"]');
                        return $link.length > 0;
                    });

                    if ($item.length) {
                        $item.remove();
                        removedCount++;
                    } else {
                        const $byData = $('.waterfall-item').filter(function() {
                            const dataId = $(this).attr('data-id') || $(this).attr('data-work-id') || $(this).data('id') || $(this).data('work-id');
                            return dataId === workID;
                        });
                        if ($byData.length) {
                            $byData.remove();
                            removedCount++;
                        }
                    }
                } catch (e) {}
            });
            pendingDeletionIDs = [];

            if (removedCount > 0) {
                forceGridRepack();
            }
        }

        activeSelectCount = 0;
        updateSelectButtonsUI();
        updateDeleteButton();
    });

    function ensureEditModeActive() {
        const $editBtn = $('.manageGroup .edit-btn');
        if ($editBtn.length && !$editBtn.hasClass('active')) {
            $editBtn[0].click();
        }
    }

    function nativeClick(element) {
        if (element.click) {
            element.click();
        } else {
            element.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }));
        }
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
            await sleep(600);
        }
    }

    function setSelectButtonUI($btn, count) {
        const $checkIcon = $btn.find('.check-box i');
        const $textSpan = $btn.find('span');
        $btn.removeAttr('style');

        if (activeSelectCount === count) {
            $checkIcon.show().css({ 'visibility': 'visible', 'opacity': '1' });
            $btn.addClass('tm-select-btn').removeClass('tm-select-btn-disabled');
        } else if (activeSelectCount !== 0 && activeSelectCount !== count) {
            $checkIcon.hide();
            $btn.addClass('tm-select-btn tm-select-btn-disabled');
        } else {
            $checkIcon.hide();
            $btn.addClass('tm-select-btn').removeClass('tm-select-btn-disabled');
        }
        $textSpan.text('Select ' + count);
    }

    function updateSelectButtonsUI() {
        SELECT_COUNTS.forEach((count) => {
            const $btn = $('.' + REPLACED_CLASS_PREFIX + count);
            if ($btn.length) setSelectButtonUI($btn, count);
        });
    }

    async function onSelectButtonClick($btn, count) {
        if ($btn.hasClass('tm-working')) return;

        const $textSpan = $btn.find('span');
        const $checkIcon = $btn.find('.check-box i');

        $btn.addClass('tm-working');
        $btn.css('opacity', '0.7');

        if (activeSelectCount === count) {
            activeSelectCount = 0;
            $checkIcon.hide();
            $textSpan.text('Unselecting...');
            try {
                unselectAll();
            } catch (err) {
            } finally {
                $btn.removeClass('tm-working').css('opacity', '');
                updateSelectButtonsUI();
            }
            return;
        }

        if (activeSelectCount !== 0 && activeSelectCount !== count) {
            try {
                unselectAll();
                await sleep(250);
            } catch (err) {
            }
        }

        activeSelectCount = count;
        updateSelectButtonsUI();

        $checkIcon.show().css({ 'visibility': 'visible', 'opacity': '1' });
        $textSpan.text('Selecting...');

        try {
            await selectFirstN(count);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            activeSelectCount = 0;
        } finally {
            $btn.removeClass('tm-working').css('opacity', '');
            updateSelectButtonsUI();
        }
    }

    function buildSelectButton($templateBtn, count) {
        const $btn = $templateBtn.clone().addClass(REPLACED_CLASS_PREFIX + count);

        $btn.removeClass('disabled is-disabled');
        $btn.removeAttr('disabled');
        $btn.attr('aria-disabled', 'false');

        $btn.off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            onSelectButtonClick($btn, count);
        });

        setSelectButtonUI($btn, count);
        return $btn;
    }

    function replaceSelectButtons() {
        ensureEditModeActive();
        const $btnBox = $('.floating-box .btn-box');
        if (!$btnBox.length) return;

        const $existing = SELECT_COUNTS.map(c => $btnBox.find('.' + REPLACED_CLASS_PREFIX + c).first()).filter($b => $b.length);
        if ($existing.length === SELECT_COUNTS.length) {
            updateSelectButtonsUI();
            return;
        }

        const $originalBtn = $btnBox.find('.item-btn').filter(function() {
            const $b = $(this);
            if ($b.hasClass(REPLACED_CLASS_PREFIX + '25') || $b.hasClass(REPLACED_CLASS_PREFIX + '50')) return false;
            return $b.find('.check-box').length > 0;
        }).first();

        if (!$originalBtn.length) return;

        const $btns = SELECT_COUNTS.map(count => buildSelectButton($originalBtn, count));

        $originalBtn.replaceWith($btns[0]);
        if ($btns[1]) $btns[0].after($btns[1]);

        updateSelectButtonsUI();
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
        updateSelectButtonsUI();
    }

    $(document).ready(function() {
        addCustomStyles();
        setInterval(() => {
            if ($('.manageGroup').length) {
                replaceSelectButtons();
            }
            hookDownloadButton();
            hookDeleteButton();
            cleanInterface();
        }, 100);
    });

})();
