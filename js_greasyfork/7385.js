// ==UserScript==
// @name        VKDownloadMedia
// @description Скачать фото/аудио/видео-файлы с соц. сети ВКонтакте.
// @namespace   https://github.com/KJ86/VKDownloadMedia
// @version     6.1.3
// @date        2019-10-14
// @author      KJ86
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjODI4YTk5IiBkPSJtIDEwLDYgaCA0IHYgNiBoIDMgbCAtNSw2IC01LC02IGggMyB6IiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjwvc3ZnPg==
// @homepage    https://greasyfork.org/ru/scripts/7385-vkdownloadmedia
// @supportURL  https://vk.com/vkdownloadmedia
// @include     https://vk.com/*
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_addStyle
// @connect     self
// @connect     *
// @nocompat    Chrome
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/7385/VKDownloadMedia.user.js
// @updateURL https://update.greasyfork.org/scripts/7385/VKDownloadMedia.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /** @var {Object} unsafeWindow */
    /** @var {Function} GM_addStyle */
    /** @var {Function} GM_download */
    /** @var {Function} GM_xmlhttpRequest */
    /** @var {Function} Promise */
    /** @var {Function} geByClass */
    /** @var {Function} geByClass1 */
    /** @var {Function} ge */
    /** @var {Function} se */
    /** @var {Function} re */
    /** @var {Function} ce */
    /** @var {Function} addEvent */
    /** @var {Function} cancelEvent */
    /** @var {Function} domInsertAfter */
    /** @var {Object} Videoview */
    /** @var {Object} tooltips */
    /** @var {Object} mvcur */
    /** @var {Object} ap */
    /** @var {Function} domInsertBefore */
    /** @var {Function} matchesSelector */
    /** @var {Function} showTooltip */
    /** @var {Function} uiActionsMenu */
    /** @var {Function} domClosest */
    /** @var {Function} getProgressHtml */
    /** @var {Function} setStyle */
    /** @var {Function} showFastBox */
    /** @var {Function} domQuery */
    /** @var {Function} data */
    /** @var {Function} each */

    /**
     * @type {Window}
     */
    var win = unsafeWindow || window;

    // Check supported browsers
    if (typeof win.Promise === 'undefined') return;

    /**
     * @function
     */
    var DOMNodeInserted = (function () {
        var _callbacks = [];
        var element = document.documentElement;
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if (MutationObserver) {
            (new MutationObserver(function (mutations) {
                var addedNodes = [];

                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes.length) {
                        for (var i = 0, l = mutation.addedNodes.length; i < l; i++) {
                            if (mutation.addedNodes[i].nodeType === Node.ELEMENT_NODE) {
                                addedNodes.push(mutation.addedNodes[i]);
                            }
                        }
                    }
                });

                if (addedNodes.length) {
                    fire(addedNodes);
                }
            })).observe(element, {
                childList: true,
                subtree: true
            });
        } else { // Fallback
            element.addEventListener('DOMNodeInserted', function (e) {
                if (e.target.nodeType === Node.ELEMENT_NODE) {
                    fire([e.target]);
                }
            }, false);
        }

        function fire(addedNodes) {
            addedNodes.forEach(function (node) {
                for (var i = 0, l = _callbacks.length; i < l; i++) {
                    var selector = _callbacks[i].selector;
                    var callback = _callbacks[i].callback;
                    var isOnce = _callbacks[i].isOnce;

                    if (matchesSelector(node, selector)) {
                        callback.call(_callbacks, node);

                        if (isOnce) {
                            _callbacks.splice(i, 1);
                            return;
                        }
                    }

                    var found = node.querySelectorAll(selector);

                    if (found.length) {
                        for (var j = 0, l2 = found.length; j < l2; j++) {
                            callback.call(_callbacks, found[j]);

                            if (isOnce) {
                                _callbacks.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
            });
        }

        return function (selector, callback, isOnce) {
            _callbacks.push({
                selector: selector,
                callback: callback,
                isOnce: !!isOnce
            });
        };
    })();

    /**
     * @namespace
     */
    var VKDM = {
        /**
         * @param {Array|String} [mask]
         * @returns {Promise}
         */
        audioUnmaskSource: function fn(mask) {
            if (typeof fn.module === 'undefined') {
                var ORIGIN = 'https://m.vk.com';

                fn.module = request({
                    url: ORIGIN,
                    _isAjax: false
                }).then(function (xhr) {
                    var match = xhr.response.match(/src="(.+?common\..+?js.*?)"/);
                    var commonJsSrc = match && match[1];

                    if (commonJsSrc) {
                        return request({
                            url: ORIGIN + commonJsSrc,
                            _isAjax: false
                        }).then(function (xhr) {
                            var modules = {};

                            // Inject and exec
                            eval(xhr.response.replace(/^!function.*?\{/, '$& var a0 = arguments[0]; for (var p in a0) {if (a0[p].toString().indexOf(".audioUnmaskSource=") !== -1) {a0[p](null, modules);break;}} return;'));

                            if ('audioUnmaskSource' in modules) {
                                return modules;
                            }

                            return Promise.reject();
                        });
                    }

                    return Promise.reject();
                });
            }

            return fn.module.then(function (modules) {
                if (mask) {
                    if (Array.isArray(mask)) {
                        return mask.map(function (item) {
                            return modules.audioUnmaskSource(item);
                        });
                    }

                    return modules.audioUnmaskSource(mask);
                }
            });
        },

        /**
         * @param ids
         * @returns {Promise}
         */
        audioRequestData: function (ids) {
            return request({
                url: '/al_audio.php',
                method: 'POST',
                data: {
                    'act': 'reload_audio',
                    'al': '1',
                    'ids': ids
                },
                _isMobile: true
            }).then(function (xhr) {
                var items;

                try {
                    var json = JSON.parse(xhr.response);

                    items = json.payload[1][0];
                } catch (e) {
                    // Deprecated
                    try {
                        if (xhr.response.indexOf('<!>') !== -1) {
                            items = JSON.parse(xhr.response.split('<!>')[5].replace('<!json>', ''));
                        }
                    } catch (e) {}
                }

                if (Array.isArray(items)) {
                    return items;
                }

                return Promise.reject();
            });
        },

        audioShowActionTooltip: function (btn) {
            var audioRow = domClosest('audio_row', btn);
            var getTText = function () {
                var duration = data(audioRow, 'vkdm_audio_row_duration');
                var fileSize = data(audioRow, 'vkdm_audio_row_file_size');
                var fileSizeMByte = '...';
                var bitrate = '...';

                if (duration && fileSize) {
                    fileSizeMByte = (fileSize / 1024 / 1024).toFixed(1) + ' МБ';
                    bitrate = '~' + (fileSize * 8 / duration / 1000).toFixed(0) + ' кбит/с';
                }

                return 'Скачать аудиозапись<br>Битрейт: ' + bitrate + '<br>Размер: ' + fileSizeMByte;
            };

            if (!data(audioRow, 'vkdm_audio_row_duration') && !btn.classList.contains('vkdm_ajax_in_progress')) {
                var audioData = JSON.parse(audioRow.getAttribute('data-audio'));
                var hashes = audioData[13].split('/');
                var ids = audioRow.getAttribute('data-full-id') + '_' + hashes[2] + '_' + hashes[5];

                btn.classList.add('vkdm_ajax_in_progress');

                VKDM.audioRequestData(ids).then(function (items) {
                    VKDM.audioUnmaskSource(items[0][2]).then(function (url) {
                        request({
                            url: url,
                            method: 'HEAD'
                        }).then(function (xhr) {
                            var contentLength = xhr.getResponseHeader('content-length');

                            data(audioRow, 'vkdm_audio_row_duration', parseInt(items[0][5]));
                            data(audioRow, 'vkdm_audio_row_file_size', parseInt(contentLength));

                            if (document.body.contains(btn)) {
                                btn.classList.remove('vkdm_ajax_in_progress');
                                geByClass1('tt_text', btn.tt.container).innerHTML = getTText();
                                tooltips.rePositionTT(btn.tt);
                            }
                        });
                    });
                });
            }

            showTooltip(btn, {
                text: getTText,
                black: 1,
                shift: [7, 5, 0],
                needLeft: true
            });
        },

        downloadAudio: function (btn) {
            var audioRow = domClosest('audio_row', btn);
            var audioData = JSON.parse(audioRow.getAttribute('data-audio'));
            var hashes = audioData[13].split('/');
            var ids = audioRow.getAttribute('data-full-id') + '_' + hashes[2] + '_' + hashes[5];

            VKDM.audioRequestData(ids).then(function (items) {
                VKDM.audioUnmaskSource(items[0][2]).then(function (url) {
                    GM_download(url, ce('div', {innerHTML: items[0][4] + ' &ndash; ' + items[0][3]}).textContent + getExtension(url));
                });
            });
        },

        downloadPhotoAlbumsList: function () {
            var isFastBoxClosed = false;
            var downloadListBtnWrapID = getRandomID();
            var fileName = document.title.replace(/"/g, '');
            var progress = se(getProgressHtml('', 'pr_medium'));

            setStyle(progress, {
                'opacity': 1,
                'padding-top': '11px',
                'padding-bottom': '12px'
            });

            showFastBox({
                title: 'Скачать альбом',
                dark: 1,
                hideButtons: 1,
                onShow: function () {
                    var items = [];
                    var match = location.pathname.match(/album(-?[0-9]+)_([0-9]+)/);
                    var ownerId = match[1];
                    var albumId = match[2];
                    var count = 1000;

                    switch (albumId) {
                        case '0':
                            albumId = 'profile';
                            break;
                        case '00':
                            albumId = 'wall';
                            break;
                        case '000':
                            albumId = 'saved';
                            break;
                    }

                    void function getAllItems(offset) {
                        if (isFastBoxClosed === true) return;

                        var params = [
                            'owner_id=' + ownerId,
                            'album_id=' + albumId,
                            'count=' + count,
                            'offset=' + offset,
                            'access_token=08ee532d08ee532d08ee532dbc08a6df23008ee08ee532d54ae800969245a7851077ff5',
                            'v=5.53'
                        ];

                        request.getJSONP('https://api.vk.com/method/photos.get?' + params.join('&'), function (data) {
                            items = items.concat(data.items);

                            if (items.length === data.count) {
                                var srcArr = [];

                                items.forEach(function (item) {
                                    var nSizes = [];

                                    for (var prop in item) {
                                        var match = prop.match(/photo_(\d+)/);

                                        if (match) {
                                            nSizes.push(match[1]);
                                        }
                                    }

                                    if (nSizes.length) {
                                        srcArr.push(item['photo_' + Math.max.apply(null, nSizes)]);
                                    }
                                });

                                var downloadListBtnWrap = ge(downloadListBtnWrapID);

                                if (downloadListBtnWrap) {
                                    var url = createFile('text/plain;charset=utf-8', srcArr.join('\r\n'));

                                    downloadListBtnWrap.innerHTML = '<a href="' + url + '" class="flat_button secondary" download="' + fileName + '.txt">Список URL</a>';
                                }
                            } else {
                                getAllItems(offset + count);
                            }
                        });
                    }(0);
                },
                onBeforeHide: function () {
                    isFastBoxClosed = true;

                    each(domQuery('#' + downloadListBtnWrapID + ' a'), function (i, el) {
                        (window.URL || window.webkitURL).revokeObjectURL(el.href);
                    });
                }
            }, (
            '<div style="text-align: center;">' +
            '<h4 class="subheader">' + fileName + '</h4>' +
            '<div id="' + downloadListBtnWrapID + '">' + progress.outerHTML + '</div>' +
            '</div>'
            ));
        },

        downloadCurrentAudioPlayList: function () {
            var audioIdsArr = [];
            var isFastBoxClosed = false;
            var downloadListBtnWrapID = getRandomID();
            var playListTitle = '';

            (function () {
                var items = [];
                var title = '';

                if ('_list' in ap._currentPlaylist) {
                    items = ap._currentPlaylist._list;
                    title = ap._currentPlaylist._title;
                } else {
                    for (var prop in ap._currentPlaylist) {
                        if ('_list' in ap._currentPlaylist[prop]) {
                            items = ap._currentPlaylist[prop]['_list'];
                            title = ap._currentPlaylist[prop]['_title'];
                            break;
                        }
                    }
                }

                each(items, function (i, el) {
                    var hashes = el[13].split('/');

                    audioIdsArr.push(el[1] + '_' + el[0] + '_' + hashes[2] + '_' + hashes[5]);
                });

                playListTitle = (title || 'playlist') + ' (' + items.length + ')';
            })();

            if (audioIdsArr.length) {
                var progress = se(getProgressHtml('', 'pr_medium'));

                setStyle(progress, {
                    'opacity': 1,
                    'padding-top': '11px',
                    'padding-bottom': '12px'
                });

                showFastBox({
                    title: 'Скачать плейлист',
                    dark: 1,
                    hideButtons: 1,
                    onShow: function () {
                        var dataArr = [];

                        void function getAudioLinks(ids) {
                            if (isFastBoxClosed === true) return;

                            VKDM.audioRequestData(ids).then(function (items) {
                                if (!Array.isArray(items)) {
                                    setTimeout(function () {
                                        getAudioLinks(ids);
                                    }, 10000);

                                    return;
                                }

                                items.forEach(function (item) {
                                    if (item[2]) {
                                        dataArr.push({
                                            mask: item[2],
                                            name: item[4] + ' – ' + item[3],
                                            duration: item[5]
                                        });
                                    }
                                });

                                if (audioIdsArr.length) {
                                    getAudioLinks(audioIdsArr.splice(0, 10).join(','));
                                } else {
                                    var textFileData = [];
                                    var m3uFileData = ['#EXTM3U'];

                                    VKDM.audioUnmaskSource(dataArr.map(function (el) {
                                        return el.mask;
                                    })).then(function (urlArr) {
                                        dataArr.forEach(function (el, i) {
                                            textFileData.push(urlArr[i]);
                                            m3uFileData.push('#EXTINF:' + el.duration + ', ' + el.name + '\r\n' + urlArr[i]);
                                        });

                                        var textFileURL = createFile('text/plain;charset=utf-8', textFileData.join('\r\n'));
                                        var m3uFileURL = createFile('audio/x-mpegurl;charset=utf-8', m3uFileData.join('\r\n'));
                                        var downloadListBtnWrap = ge(downloadListBtnWrapID);

                                        if (textFileURL && m3uFileURL) {
                                            downloadListBtnWrap.innerHTML = (
                                            '<a href="' + m3uFileURL + '" class="flat_button secondary" download="' + playListTitle + '.m3u8">M3U</a>&nbsp;' +
                                            '<a href="' + textFileURL + '" class="flat_button secondary" download="' + playListTitle + '.txt">Список URL</a>'
                                            );
                                        } else {
                                            downloadListBtnWrap.textContent = 'Не удалось создать файл.';
                                        }
                                    });
                                }
                            });
                        }(audioIdsArr.splice(0, 10).join(','));
                    },
                    onBeforeHide: function () {
                        isFastBoxClosed = true;

                        each(domQuery('#' + downloadListBtnWrapID + ' a'), function (i, el) {
                            (window.URL || window.webkitURL).revokeObjectURL(el.href);
                        });
                    }
                }, (
                '<div style="text-align: center;">' +
                '<h4 class="subheader">' + playListTitle + '</h4>' +
                '<div id="' + downloadListBtnWrapID + '">' + progress.outerHTML + '</div>' +
                '</div>'
                ));
            }
        }
    };

    // region Init
    // Add CSS rules
    GM_addStyle(
        '.audio_row .audio_row__action_download {background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjODI4YTk5IiBkPSJtIDEwLDYgaCA0IHYgNiBoIDMgbCAtNSw2IC01LC02IGggMyB6IiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjwvc3ZnPg==");}' +
        '.audio_layer_container .audio_page__footer_download_playlist {float: right; cursor: pointer;}' +
        '.audio_layer_container .audio_page__footer_download_playlist:hover {text-decoration: underline;}'
    );

    // Preload module
    VKDM.audioUnmaskSource('').then(null);

    // Adding audio download button
    DOMNodeInserted('.audio_row:not(.audio_claimed) .audio_row__actions', function (node) {
        // When module ready
        VKDM.audioUnmaskSource('').then(function () {
            var btn = se('<button aria-label="Скачать аудиозапись" data-action="download" class="audio_row__action audio_row__action_download"></button>');

            addEvent(btn, 'click', function (e) {
                VKDM.downloadAudio(this);
                cancelEvent(e);
            });
            addEvent(btn, 'mouseover', function () {
                VKDM.audioShowActionTooltip(this);
            });
            domInsertBefore(btn, node.firstElementChild);
        });
    });

    // Adding video download button
    DOMNodeInserted('#video_player', function () {
        if (Videoview && Videoview.showVideo) {
            var addAction = function () {
                try {
                    if (mvcur && mvcur.player) {
                        var videoData = mvcur.player.getVars();

                        if (videoData) {
                            var prop, match;
                            var items = [];

                            for (prop in videoData) {
                                match = prop.match(/url(\d+)/);

                                if (match) {
                                    items.push([parseInt(match[1], 10), videoData[prop]]);
                                }
                            }

                            if (items.length) {
                                var itemsHTML = items
                                    .sort(function (a, b) {
                                        if (a[0] < b[0]) return -1;
                                        if (a[0] > b[0]) return 1;
                                        return 0;
                                    })
                                    .map(function (item) {
                                        return (
                                        '<a class="ui_actions_menu_item" href="' + item[1] + '" tabindex="0" role="link">' +
                                        item[0] + 'p' + (item[0] >= 720 ? ' <span style="font-size:10px;color:#939393;vertical-align:top;">HD</span>' : '') +
                                        '</a>'
                                        );
                                    })
                                    .join('');

                                var actionEl = se(
                                    '<div class="ui_actions_menu_wrap _ui_menu_wrap " onmouseover="uiActionsMenu.show(this, event, {autopos: true, dy: 6});" onmouseout="uiActionsMenu.hide(this);">' +
                                    '<div class="ui_actions_menu_icons"  tabindex="0" aria-label="Действия" role="button" onclick="uiActionsMenu.keyToggle(this, event);">' +
                                    '<span class="blind_label">Действия</span>' +
                                    '<a class="ui_actions_menu_more">Скачать</a>' +
                                    '</div>' +
                                    '<div class="ui_actions_menu _ui_menu" >' +
                                    itemsHTML +
                                    '</div>' +
                                    '</div>'
                                );

                                geByClass('ui_actions_menu_item', actionEl).forEach(function (element) {
                                    addEvent(element, 'click', function (e) {
                                        e.originalEvent.preventDefault();
                                        GM_download(this.href, ge('mv_title').textContent + getExtension(this.href));
                                    });
                                });

                                domInsertAfter(actionEl, geByClass1('ui_actions_menu_more').parentNode.parentNode);
                            }
                        }
                    }
                } catch (e) {
                }
            };
            var _showVideo = Videoview.showVideo;

            Videoview.showVideo = function () {
                _showVideo.apply(this, arguments);
                addAction();
            };

            addAction();
        }
    }, true);

    // Adding photo download button
    DOMNodeInserted('.photos_album_intro_info', (function () {
        var element = geByClass1('photos_album_intro_info');

        if (element) {
            handler(element);
        }

        function handler(node) {
            if (!ge('vkdm_download_album')) {
                var act = se('<a id="vkdm_download_album" href="javascript:;">Скачать альбом</a>');
                var actWrap = se('<span class="photos_album_info"></span>');

                addEvent(act, 'click', function () {
                    VKDM.downloadPhotoAlbumsList();
                    return false;
                });

                actWrap.appendChild(act);
                node.appendChild(se('<span class="divide">|</span>'));
                node.appendChild(actWrap);
            }
        }

        return handler;
    })());

    // Adding playlist download button
    DOMNodeInserted('#page_header .audio_page__footer_clear_playlist', function (node) {
        var act = se('<span class="audio_page__footer_download_playlist">Скачать плейлист</span>');

        addEvent(act, 'click', function () {
            VKDM.downloadCurrentAudioPlayList();
        });

        domInsertAfter(act, node);
    });
    // endregion Init

    // region Helpers
    /**
     * @param {Object} options
     * @returns {Promise}
     */
    function request(options) {
        return new Promise(function (resolve, reject) {
            options.method = options.method || 'GET';
            options.headers = options.headers || {};

            if (options._isAjax !== false) {
                options.headers['x-requested-with'] = 'XMLHttpRequest';
            }

            if (options._isMobile) {
                options.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';
            }

            // POST
            if (options.method.toUpperCase() === 'POST') {
                options.headers['content-type'] = 'application/x-www-form-urlencoded';

                if (typeof options.data === 'object') {
                    var dataArr = [];

                    for (var p in options.data) {
                        dataArr.push(encodeURIComponent(p) + '=' + encodeURIComponent(options.data[p]));
                    }

                    options.data = dataArr.join('&');
                }
            }

            options.onload = function (xhr) {
                if (xhr.status === 200) {
                    xhr.getResponseHeader = function (name) {
                        var header;
                        var headers = xhr.responseHeaders.split('\n');

                        for (var i = 0; i < headers.length; i++) {
                            header = headers[i].split(':');

                            if (header[0].trim().toLowerCase() === name.toLowerCase()) {
                                return header[1].trim();
                            }
                        }

                        return null;
                    };

                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };

            options.onerror = function (xhr) {
                reject(xhr);
            };

            GM_xmlhttpRequest(options);
        });
    }

    /**
     * @param {String} url
     * @param {Function} [success]
     */
    request.getJSONP = function (url, success) {
        var tempFuncName = 'vkdmFunc' + Date.now();

        win[tempFuncName] = function (response) {
            success(response.response);
            delete win[tempFuncName];
        };

        document.body.appendChild(ce('script', {
            src: url + '&callback=' + tempFuncName,
            onload: function () {
                re(this);
            },
            onerror: function () {
                re(this);
            }
        }));
    };

    function createFile(type, data) {
        return (window.URL || window.webkitURL).createObjectURL(new Blob([data], {type: type}));
    }

    function getExtension(url) {
        return url.split('?')[0].match(/\.\w+$/)[0];
    }

    function getRandomID(name) {
        var prefix = 'vkdm' + (name ? '_' + name + '_' : '_');

        return prefix + Math.random().toString().slice(2, 10);
    }
    // endregion Helpers
})();
