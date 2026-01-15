// ==UserScript==
// @name          mods.de Forum - Verbesserungen und Funktionen für mehr Benutzerfreundlichkeit
// @description   Verbessert die Navigation, Lesezeichenverwaltung und Threadliste des Forums
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://forum.mods.de/*
// @match         https://forum.mods.de/bb/*
// @icon          https://i.imgur.com/wwA18B8.png
// @version       2.13
// @grant         GM_openInTab
// @grant         GM_addStyle
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js
// @downloadURL https://update.greasyfork.org/scripts/562398/modsde%20Forum%20-%20Verbesserungen%20und%20Funktionen%20f%C3%BCr%20mehr%20Benutzerfreundlichkeit.user.js
// @updateURL https://update.greasyfork.org/scripts/562398/modsde%20Forum%20-%20Verbesserungen%20und%20Funktionen%20f%C3%BCr%20mehr%20Benutzerfreundlichkeit.meta.js
// ==/UserScript==

/* globals $, async_get */

(function() {
    'use strict';

    const pathname = window.location.pathname;
    const hasBookmarks = $('#bookmarklist').length > 0;
    const isBoardPage = pathname.indexOf('/board.php') !== -1;
    const isThreadPage = pathname.indexOf('/thread.php') !== -1;
    const isReplyPage = pathname.indexOf('/newreply.php') !== -1 || pathname.indexOf('/editreply.php') !== -1;

    const smileys = [
        {code: ':)', src: './img/smilies/icon7.gif', desc: 'Fröhlich'},
        {code: '^^', src: './img/smilies/icon5.gif', desc: 'Glücklich'},
        {code: ':D', src: 'img/smilies/biggrin.gif', desc: 'Grinsen'},
        {code: ':(', src: './img/smilies/icon12.gif', desc: 'Traurig'},
        {code: '8|', src: './img/icons/icon3.gif', desc: 'Ungläubig'},
        {code: ':what:', src: './img/smilies/sceptic.gif', desc: 'Skeptisch'},
        {code: ':mata:', src: 'img/smilies/mata.gif', desc: 'Mata'},
        {code: ':o', src: 'img/smilies/icon16.gif', desc: 'Oha'},
        {code: ':eek:', src: 'img/smilies/icon15.gif', desc: 'Überrascht'},
        {code: ':confused:', src: './img/smilies/confused.gif', desc: 'Verwirrt'},
        {code: ':hm:', src: 'img/smilies/hm.gif', desc: 'Verwundert'},
        {code: ':huch:', src: './img/smilies/freaked.gif', desc: 'Erschrocken'},
        {code: ':|', src: 'img/smilies/icon8.gif', desc: 'Ernsthaft?'},
        {code: ':mad:', src: 'img/smilies/icon13.gif', desc: 'Wütend'},
        {code: ':xx:', src: './img/icons/icon11.gif', desc: 'Alter...'},
        {code: ':bang:', src: './img/smilies/banghead.gif', desc: 'Junge...'},
        {code: ':moo:', src: 'img/smilies/smiley-pillepalle.gif', desc: 'Gehts?'},
        {code: ':p', src: 'img/smilies/icon2.gif', desc: 'Ätsch'},
        {code: ':0:', src: './img/icons/icon4.gif', desc: 'Ironisch'},
        {code: ':roll:', src: './img/smilies/icon18.gif', desc: 'Jaja...'},
        {code: ';)', src: 'img/smilies/wink.gif', desc: '[Arschloch]'},
        {code: ':ugly:', src: 'img/smilies/ugly.gif', desc: 'Hässlon'},
        {code: ':zyklop:', src: './img/smilies/icon1.gif', desc: 'Zyklop'},
        {code: ':zzz:', src: 'img/smilies/sleepy.gif', desc: 'Brunch früh'},
        {code: ':wurgs:', src: './img/smilies/urgs.gif', desc: 'Brunch spät'}
    ];

    function loadJQueryUITheme() {
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/eggplant/jquery-ui.min.css" type="text/css" />');
    }

    function applyForumDialogStyling($dialog) {
        $dialog.css({
            'background-color': '#000000',
            'color': '#FFFFFF'
        });

        const $dialogWidget = $dialog.dialog('widget');
        $dialogWidget.find('.ui-dialog-titlebar').css({
            'background-color': '#222E3A',
            'color': '#FFFFFF',
            'border': '1px solid #000000'
        });

        $dialogWidget.find('.ui-dialog-buttonpane').css({
            'background-color': '#222E3A',
            'border-top': '1px solid #000000'
        });

        $dialogWidget.find('button').css({
            'background-color': '#394E63',
            'color': '#000000',
            'border': '1px solid #000000'
        });
    }

    function showDialog(title, message, buttons) {
        let $dialog = $('#overlayDialog');
        if ($dialog.length === 0) {
            $dialog = $('<div id="overlayDialog"></div>').appendTo('body');
        }
        $dialog.html(message);

        $dialog.dialog({
            draggable: false,
            resizable: false,
            modal: true,
            title: title,
            buttons: buttons || {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            position: { my: "right top", at: "right top", of: window },
            open: function() {
                applyForumDialogStyling($(this));
            },
            close: function() {
                $(this).dialog('destroy').remove();
            }
        });
    }

    function setupBookmarkFunctions() {
        unsafeWindow.setBookmark = function(pid, token) {
            if (typeof async_get === 'undefined') return;

            async_get('async/set-bookmark.php?PID=' + pid + '&token=' + token, null, function(xml) {
                let message = '';
                switch(parseInt(xml.responseText)) {
                    case 1: message = 'Das Lesezeichen wurde gesetzt.'; break;
                    case 2: message = 'Du hast bereits zu viele Lesezeichen!'; break;
                    default: message = 'Unbekannter Fehler:<br>' + xml.responseText; break;
                }
                showDialog('Lesezeichen', message);
            });
        };

        unsafeWindow.removeBookmark = function(bmid, token, thread) {
            const message = thread
                ? 'Soll das Lesezeichen \'' + thread + '\' wirklich gelöscht werden?'
                : 'Soll dieses Lesezeichen wirklich gelöscht werden?';

            showDialog('Lesezeichen', message, {
                Ja: function() {
                    if (typeof async_get !== 'undefined') {
                        async_get('async/remove-bookmark.php?BMID=' + bmid + '&token=' + token, null, null);
                    }
                    $(this).dialog('close');
                },
                Nein: function() {
                    $(this).dialog('close');
                }
            });
        };

        unsafeWindow.openLinks = function() {
            $('#bookmarklist > table > tbody > tr').each(function() {
                const $newIndicator = $('td:nth-child(4)', this);
                if ($newIndicator.length && $newIndicator.text().indexOf('neu') !== -1) {
                    const href = $('td:nth-child(3) > a', this).attr('href');
                    if (href) {
                        GM_openInTab('http://forum.mods.de/' + href);
                    }
                }
            });
        };

        $('.bookmarklist > span').wrapInner('<a href="javascript:openLinks()"></a>');
    }

    function stripeBookmarkRows() {
        $('#bookmarklist > table > tbody > tr')
            .removeClass('color3b')
            .filter(':even')
            .addClass('color3b');
    }

    function setupBookmarkTable() {
        const $table = $('#bookmarklist > table');
        if (!$table.length) return;

        $table.prepend('<thead><tr class="l"><th></th><th>Forum</th><th>Thread</th><th>#Posts</th><th></th><th></th><th style="display:none"></th></tr></thead>');

        $table.find('tbody > tr').each(function() {
            const $row = $(this);
            const $postsCell = $row.find('td:nth-child(4)');
            const $threadCell = $row.find('td:nth-child(3)');

            let sortValue = '1';
            if ($postsCell.text().indexOf('neu') !== -1) {
                sortValue = '0';
            } else if ($threadCell.find('del').length > 0) {
                sortValue = '2';
            }
            $row.append('<td style="display:none">' + sortValue + '</td>');
        });

        $table.tablesorter({
            sortList: [[6,0], [3,1], [1,1], [2,0]],
            sortForce: [[6,0]],
            headers: {
                0: { sorter: false },
                4: { sorter: false },
                5: { sorter: false },
                6: { sorter: false }
            }
        });

        $table.on('sortEnd', stripeBookmarkRows);
        $table.css('border-collapse', 'collapse');
        $table.find('tbody > tr').css('border-bottom', '2px solid transparent');
        $table.find('tbody > tr > td > a').css('color', '#ccc');

        stripeBookmarkRows();
    }

    function navigateToLink(selector) {
        const $link = $(selector).filter(':first');
        const href = $link.attr('href');
        if (href) {
            window.location.assign(href);
            return true;
        }
        return false;
    }

    function findFirstPageLink() {
        const $prevLink = $('a:contains("« vorherige"):first');
        if (!$prevLink.length) return null;

        const $container = $prevLink.parent();
        const $ersteLink = $container.find('a:contains("« erste")');
        if ($ersteLink.length) return $ersteLink;

        const $numberLinks = $container.find('a').filter(function() {
            return /^\d+$/.test($(this).text().trim());
        });

        if ($numberLinks.length > 0) {
            return $numberLinks.first();
        }

        return null;
    }

    function findLastPageLink() {
        const $prevOrNextLink = $('a:contains("« vorherige"):first, a:contains("nächste »"):first');
        if (!$prevOrNextLink.length) return null;

        const $container = $prevOrNextLink.parent();
        const $letzteLink = $container.find('a:contains("letzte »")');
        if ($letzteLink.length) return $letzteLink;

        const $numberLinks = $container.find('a').filter(function() {
            return /^\d+$/.test($(this).text().trim());
        });

        if ($numberLinks.length > 0) {
            return $numberLinks.last();
        }

        return null;
    }

    function handleGlobalKeydown(e) {
        if ($(e.target).is('input, textarea, select, [contenteditable]')) {
            if (e.ctrlKey && (e.key === 'Enter' || e.which === 13)) {
                $('input[value="Eintragen"]').click();
            }
            return;
        }

        const key = e.key || e.which;
        const isCtrl = e.ctrlKey;

        const checkKey = (kStr, kCode) => (e.key === kStr || e.which === kCode);

        if (!isCtrl && (checkKey('r', 82) || checkKey('y', 89))) {
            window.location.reload();
            return;
        }

        if (hasBookmarks && !isCtrl && checkKey('l', 76)) {
             if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.openLinks === 'function') {
                unsafeWindow.openLinks();
            }
            return;
        }

        if (isThreadPage || isBoardPage) {
            if (checkKey('ArrowLeft', 37)) {
                if (isCtrl) {
                    e.preventDefault();
                    const $firstLink = findFirstPageLink();
                    if ($firstLink) {
                        const href = $firstLink.attr('href');
                        if (href) window.location.assign(href);
                    }
                } else {
                    navigateToLink('a:contains("« vorherige"):first');
                }
            }
            else if (checkKey('ArrowRight', 39)) {
                if (isCtrl) {
                    e.preventDefault();
                    const $lastLink = findLastPageLink();
                    if ($lastLink) {
                        const href = $lastLink.attr('href');
                        if (href) window.location.assign(href);
                    }
                } else {
                    navigateToLink('a:contains("nächste »"):first');
                }
            }
        }

        if (isThreadPage) {
            if (isCtrl && checkKey('ArrowUp', 38)) {
                e.preventDefault();
                window.scrollTo(0, 0);
            }
            else if (isCtrl && checkKey('ArrowDown', 40)) {
                e.preventDefault();
                window.scrollTo(0, document.body.scrollHeight);
            }
            else if (!isCtrl && checkKey('i', 73)) {
                window.location.assign('http://forum.mods.de/');
            }
            else if (!isCtrl && checkKey('p', 80)) {
                navigateToLink('a[href^="newreply.php"]');
            }
            else if (!isCtrl && checkKey('l', 76)) {
                const $bookmarkLink = $('a:contains("lesezeichen"):last');
                if ($bookmarkLink.length && $bookmarkLink.parent().text().match(/.*\+lesezeichen.*/)) {
                    const hrefAttr = $bookmarkLink.attr('href');
                    if (hrefAttr) {
                        const match = hrefAttr.match(/setBookmark\(.*\)/);
                        if (match && typeof unsafeWindow !== 'undefined') {
                            eval('unsafeWindow.' + match[0]);
                        }
                    }
                }
            }
        }
    }

    function handleMetaRefresh() {
        const content = $('meta[http-equiv="refresh"]').attr('content');
        if (content) {
            const urlIndex = content.indexOf('url=');
            if (urlIndex !== -1) {
                const href = content.substring(urlIndex + 4);
                window.location.assign(href);
            }
        }
    }

    function hideThreads() {
        $('body > div:eq(2) > table:eq(1) > tbody > tr > td > table > tbody > tr').each(function() {
            const $bookmarkLink = $('td:eq(2) > a', this);
            if ($bookmarkLink.hasClass('bookmark')) {
                $(this).hide();
            }

            const $closedIcon = $('td:eq(0) > img[src*="closed.gif"]', this);
            if ($closedIcon.length > 0) {
                $(this).hide();
            }
        });
    }

    function isFirstBoardPage() {
        const pageParam = new URLSearchParams(window.location.search).get('page');
        if (pageParam && pageParam !== '1') return false;
        if ($('a:contains("« vorherige")').length) return false;
        return true;
    }

    function getThreadIdFromRow($row) {
        const $link = $row.find('a[href*="TID="]').first();
        if ($link.length) {
            return $link.attr('href');
        }
        return null;
    }

    function appendSecondBoardPageThreads() {
        if (!isFirstBoardPage()) return;

        const $nextLink = $('a:contains("nächste »"):first');
        if (!$nextLink.length) return;

        const nextUrl = $nextLink.attr('href');
        const $targetTbody = $('body > div:eq(2) > table:eq(1) > tbody > tr > td > table > tbody');

        const existingThreads = new Set();
        $targetTbody.find('tr').each(function() {
            const tid = getThreadIdFromRow($(this));
            if (tid) existingThreads.add(tid);
        });

        $.get(nextUrl, function(html) {
             const doc = new DOMParser().parseFromString(html, 'text/html');
             const $rows = $(doc).find('body > div:eq(2) > table:eq(1) > tbody > tr > td > table > tbody > tr');

             if ($rows.length) {
                 $targetTbody.find('tr').each(function() {
                     if ($(this).find('img[src$="foo.png"]').length) {
                         $(this).remove();
                     }
                 });

                 $rows.each(function() {
                     const $row = $(this);
                     if ($row.attr('bgcolor') && $row.attr('bgcolor').toUpperCase() === '#222E3A') {
                         const tid = getThreadIdFromRow($row);
                         if (tid && !existingThreads.has(tid)) {
                             $targetTbody.append($row);
                             existingThreads.add(tid);
                         }
                     }
                 });
                 hideThreads();
             }
        });
    }

    function insertAtCursor(textarea, text) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const textWithSpace = text + ' ';
        textarea.value = textarea.value.substring(0, startPos) + textWithSpace + textarea.value.substring(endPos);
        const newCursorPos = startPos + textWithSpace.length;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        return newCursorPos;
    }

    function setupNamedLinkDialog() {
        $('img[onclick*="makeNamedLink"]').each(function() {
            $(this).removeAttr('onclick');
        }).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const form = document.forms['newreply'] || document.forms['editreply'];

            if (!form || !form.message) {
                console.error('Form or message textarea not found!');
                return;
            }

            const $dialog = $('<div><p><label for="linkUrl">URL:</label><br><input type="text" id="linkUrl" style="width:100%;margin-top:5px;background-color:#EFEFEF;border:1px solid #000000;"></p><p style="margin-top:10px;"><label for="linkText">Link Text:</label><br><input type="text" id="linkText" style="width:100%;margin-top:5px;background-color:#EFEFEF;border:1px solid #000000;"></p></div>');

            $dialog.dialog({
                title: 'Link mit Text einfügen',
                modal: false,
                width: 450,
                position: { my: "center top", at: "center top+100", of: window },
                buttons: {
                    'Einfügen': function() {
                        const url = $('#linkUrl').val().trim();
                        const text = $('#linkText').val().trim();
                        if (url && text) {
                            const bbcode = '[url=' + url + ']' + text + '[/url]';
                            const newPos = insertAtCursor(form.message, bbcode);

                            $(this).one('dialogclose', function() {
                                form.message.focus();
                                form.message.setSelectionRange(newPos, newPos);
                            });
                        }
                        $(this).dialog('close');
                    },
                    'Abbrechen': function() {
                        $(this).dialog('close');
                    }
                },
                open: function() {
                    const $dialogInstance = $(this);
                    applyForumDialogStyling($dialogInstance);

                    $('#linkUrl, #linkText').on('keydown', function(event) {
                        if (event.key === 'Enter' || event.which === 13) {
                            event.preventDefault();
                            $dialogInstance.parent().find('button:contains("Einfügen")').click();
                        }
                    });

                    $('#linkUrl').focus();
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                }
            });

            return false;
        });
    }

    function setupSmileyDialog() {
        $('img[onclick*="window.open"][onclick*="smilies"]').each(function() {
            $(this).removeAttr('onclick');
        }).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const form = document.forms['newreply'] || document.forms['editreply'];

            if (!form || !form.message) {
                console.error('Form or message textarea not found!');
                return;
            }

            let html = '<div style="max-height:400px;overflow-y:auto;"><table border="0" cellpadding="4" cellspacing="1" width="100%" style="border-collapse:collapse;">';
            html += '<tr style="background-color:#222E3A;"><td width="80"><b>Icon</b></td><td width="120"><b>Text</b></td><td><b>Bedeutung</b></td></tr>';

            smileys.forEach(function(smiley, index) {
                const bgColor = (index % 2 === 0) ? '#222E3A' : '#394E63';
                html += '<tr style="background-color:' + bgColor + ';cursor:pointer;" class="smiley-row" data-code="' + smiley.code + '">';
                html += '<td align="center"><img src="' + smiley.src + '" alt="' + smiley.code + '" title="' + smiley.code + '"></td>';
                html += '<td>' + smiley.code + '</td>';
                html += '<td>' + smiley.desc + '</td>';
                html += '</tr>';
            });
            html += '</table></div>';

            const $dialog = $(html);

            $dialog.dialog({
                title: 'Smilie einfügen',
                modal: false,
                width: 400,
                position: { my: "center top", at: "center top+100", of: window },
                buttons: {
                    'Schließen': function() {
                        $(this).dialog('close');
                    }
                },
                open: function() {
                    applyForumDialogStyling($(this));
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                }
            });

            $dialog.on('click', '.smiley-row', function() {
                const code = $(this).data('code');
                const newPos = insertAtCursor(form.message, code);

                $dialog.one('dialogclose', function() {
                    form.message.focus();
                    form.message.setSelectionRange(newPos, newPos);
                });

                $dialog.dialog('close');
            });

            return false;
        });
    }

    $(document).ready(function() {
        if (hasBookmarks || isThreadPage) {
            loadJQueryUITheme();
            setupBookmarkFunctions();
            if (hasBookmarks) setupBookmarkTable();
        }

        if (isReplyPage) {
            if (!hasBookmarks && !isThreadPage) loadJQueryUITheme();
            setupNamedLinkDialog();
            setupSmileyDialog();
        }

        if (isBoardPage) {
            hideThreads();
            appendSecondBoardPageThreads();
        }

        $(document).on('keydown', handleGlobalKeydown);

        handleMetaRefresh();
    });

})();
