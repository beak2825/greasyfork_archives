// ==UserScript==
// @name       What.CD Load FileList and LOG
// @namespace  http://use.i.E.your.homepage/
// @version    1.2.5
// @description  Adds file_list and log loaders to torrent row
// @match *://what.cd/artist.php*
// @match *://what.cd/collages.php*
// @match *://what.cd/torrents.php*
// @match *://what.cd/userhistory.php?action=subscribed_collages*
// @copyright  2014+, Krulvis, sEXEcutor
// @require http://code.jquery.com/jquery-latest.js
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/7254/WhatCD%20Load%20FileList%20and%20LOG.user.js
// @updateURL https://update.greasyfork.org/scripts/7254/WhatCD%20Load%20FileList%20and%20LOG.meta.js
// ==/UserScript==

$(function () {
    
    var countImages = true;
    var showLogLinks = true;
    var showFileLinks = true;
    var imgBgColor = 'lemonchiffon';
    
    var torrentPage = $('#covers').length > 0;
    var globalGroupId = torrentPage ? window.location.href.split(/[\?&]{1}id=/)[1].split(/[^0-9]/)[0] : null;
    
    var gtoggle = function (elem) {
        if ($(elem).hasClass('hidden')) {
            $(elem).removeClass('hidden');
        } else {
            $(elem).addClass('hidden');
        }
    };
    
    var highlightImage = function (table) {
        $('tr', table).each(function (i, row) {
            var cell = $(row).find("td:not(:empty):first:contains('.jpg'), :contains('.png'), :contains('.jpeg'), :contains('.JPG'), :contains('.PNG'), :contains('.JPEG')");
            if (cell !== 'undefined') {
                cell.parent().css('background', imgBgColor);
            }
        });
    };
    
    var infoOnLoad = function () {
        if ($('pre', $(this)).length > 0) {
            var log_notes = [];
            var pre = $('pre', $(this));
            var pre_text = pre.text();
            pre.css('white-space', 'pre-wrap').css('font-size', '11px');
            $('.log_outer', $(this)).css('margin', '0').css('padding', 0);
            if ($('.log_bad ul:first', $(this)).text().trim() === '') {
               $('.log_bad', $(this)).hide();
            }
            if (pre_text.indexOf('Exact Audio Copy V1.0') > -1) {
                log_notes.push('<span style="color:green">EAC 1.0+</span>');
            } else if (pre_text.indexOf('Exact Audio Copy V0.9') > -1 || pre_text.indexOf('EAC extraction logfile') > -1) {
                log_notes.push('<span style="color:orange">EAC <=0.99</span>');
            } else if (pre_text.indexOf('X Lossless Decoder version 201') > -1) {
                log_notes.push('<span style="color:green">X Lossless Decoder</span>');
            } else if (pre_text.indexOf('X Lossless Decoder version 200') > -1) {
                log_notes.push('<span style="color:orange">X Lossless Decoder (pre-2010/01/23 version)</span>');
            }
            if (pre_text.indexOf('Test CRC') > -1 || pre_text.indexOf('CRC32 hash (test run)') > -1) {
                log_notes.push('<span style="color:green">Test&Copy</span>');
            } else {
                log_notes.push('<span style="color:#c00">No Test&Copy</span>');
            }
            if (pre_text.indexOf('Defeat audio cache      : No') > -1) {
                log_notes.push('<span style="color:orange">Cache is not disabled</span>');
            }
            if (pre_text.indexOf(': Not detected, thus') > -1) {
                log_notes.push('<span style="color:orange">Gaps not detected</span>');
            }
            if (pre_text.indexOf('Range status and errors') > -1) {
                log_notes.push('<span style="color:orange">Ripped as range</span>');
            }
            if (pre_text.indexOf('==== Log checksum') > -1 || pre_text.indexOf('-----BEGIN XLD SIGNATURE-----') > -1) {
                log_notes.push('<span style="color:green">Checksum</span>');
            } else {
                log_notes.push('<span style="color:#c00">No checksum</span>');
            }
            if (pre_text.indexOf('Accurately ripped') > -1 || pre_text.indexOf('AccurateRip') > -1) {
                log_notes.push('<span style="color:green">AccurateRip</span>');
            } else {
                log_notes.push('<span style="color:#c00">No AccurateRip</span>');
            }
            if (pre_text.indexOf('Exact Audio Copy ') > -1) {
                if (pre_text.indexOf('---- CUETools DB Plugin') > -1 && pre_text.indexOf("The remote name could not be resolved: 'db.cuetools.net'") === -1) {
                    log_notes.push('<span style="color:green">CTDB</span>');
                } else {
                    log_notes.push('<span style="color:orange">No CTDB</span>');
                }
            }
            if (pre_text.indexOf('TOC of the extracted CD') > -1) {
                log_notes.push('<span style="color:green">TOC</span>');
            } else {
                log_notes.push('<span style="color:#c00">No TOC</span>');
            }
            if (log_notes !== '') {
                $(this).prepend('<b>' + log_notes.join(' / ') + '</b>');
            }
        }
                
        highlightImage($('.filelist_table', $(this)));
                
        $(this).prepend('[ <a href="#">Close</a> ] ');
        $(this).append('[ <a href="#">Close</a> ]');
                
        $(this).find('a').on('click', function () {
            gtoggle($(this).closest('.info_block'));
            return false;
        });
                
        $(this).find('a:last').on('click', function () {
            $('html, body').animate({
                scrollTop: $('#torrent' + $(this).parent().data('torrent-id')).offset().top
            }, 500);
            return false;
        });
    };

    var infoToggle = function (index, element) {
        var that = $(this);
        var groupId = that.data('group-id');
        var torrentId = that.data('torrent-id');
        var url = that.data('url');
        var currentMode = that.data('mode');
        var containerSel = '#' + currentMode + '_' + torrentId;
                
        if (torrentPage) {
            $('#files_' + torrentId).addClass('info_block').addClass('info_block_files');
            var torrent = $('#torrent_' + torrentId);
            $('.info_block', torrent).not('.info_block_' + currentMode).addClass('hidden');
                             
            if ($(containerSel).length === 0) {
                $('#torrent_' + torrentId + ' td:first-child blockquote:first-child').after('<blockquote id="' + currentMode + '_' + torrentId + '" class="info_block info_block_' + currentMode + ' hidden" data-torrent-id="' + torrentId + '"></blockquote>');
            }
                             
            gtoggle(containerSel);
            var container = $(containerSel);
                             
            if (container.hasClass('hidden')) {
                torrent.addClass('hidden');
            } else {
                torrent.removeClass('hidden');
            }
                             
            if (currentMode === 'files') {
                highlightImage($('.filelist_table', container));
            }
                
        } else {
            if ($(containerSel).length == 0) {
                $(this).parent().parent().parent().after('<tr id="' + currentMode + '_' + torrentId + '" class="hidden info_block"><td colspan="6" data-torrent-id="' + torrentId + '"></td></tr>');
            }
                             
            var container = $(containerSel + ' td:first-child');
            gtoggle(containerSel);
        }
                
        if (container.text() === '') {
            $(container).html('<center><p>Loading...</p></center>').load(url, infoOnLoad);
        }
                             
        return false;
    };

    if (torrentPage && window.location.hash.indexOf('#files_') === 0) {
        gtoggle(window.location.hash);
    }
                             
    $('.group_torrent').not('.edition').each(function (index, element) {
        var that = $(this);
        var td = that.children().eq(0);
        var a = td.children().last();
                             
        if (torrentPage) {
            var group_id = globalGroupId;
            var torrentid = that.attr('id').replace('torrent', '');
            
            if (countImages) {
                var pics = ($('#torrent_' + torrentid + ' .filelist_table').text().match(/\.(jpg|jpeg|png)/ig) || []).length;
                if (pics === 1) {
                    a.append(' / <span style="color:mediumseagreen">1 image</span>');
                } else if (pics > 1) {
                    a.append(' / <span style="color:darkorange">'+pics+' images</span>');
                }
            }
            
        } else {
            var href = a.attr('href');
            var group_id = href.split(/[\?&]{1}id=/)[1].split(/[^0-9]/)[0];
            var torrentid = href.split('torrentid=')[1].split(/[^0-9]/)[0];
            that.attr('id', 'torrent' + torrentid);
        }

        var span = td.children().eq(0);
        if (showFileLinks) {
           span.children().last().after(' | <a href="' + a.attr('href') + '#files_' + torrentid + '" class="tooltip info-toggle info-files" data-mode="files" data-url="torrents.php?id=' + group_id + ' #files_' + torrentid + ' .filelist_table" data-torrent-id="' + torrentid + '" data-group-id="' + group_id + '" title="Show file list">FN</a> ');
        }
        if (showLogLinks && a.text().indexOf('/ Log ') > -1) {
           span.children().last().after(' | <a href="torrents.php?action=viewlog&torrentid=' + torrentid + '&groupid=' + group_id + '" class="tooltip info-toggle info-log" data-mode="log" data-url="torrents.php?action=viewlog&torrentid=' + torrentid + '&groupid=' + group_id + ' .log_outer" data-torrent-id="' + torrentid + '" data-group-id="' + group_id + '" title="Show LOG">LOG</a> ');
        }
    });
    
    $('.info-toggle').on('click', infoToggle);
    
});