// ==UserScript==
// @name           干草影视电影下载 old
// @namespace      https://github.com/laigc/firefox_addons
// @description    在豆瓣、时光、VeryCD 、IMDB 和 DMM 电影页面显示相关下载链接。
// @author         laigc
// @version        1.5.0
// @include        http://movie.douban.com/subject/*
// @include        http://www.verycd.com/entries/*
// @include        http://www.imdb.com/title/*
// @include        http://movie.mtime.com/*
// @include        http://www.dmm.co.jp/rental/-/detail/=/cid=*
// @include        http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=*
// @include        http://www.dmm.co.jp/digital/videoa/-/detail/=/cid=*
// @resource mainCSS https://gist.githubusercontent.com/FateRover/b295d27d066e9a656a38/raw/a69846a9c1b811719a3f2889db44dbebfc507de4/zuofei.css
// @require https://greasyfork.org/scripts/7511-jquery-1-11-2-js/code/jquery-1112js.js?version=32040
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grunt          none
// @downloadURL https://update.greasyfork.org/scripts/9105/%E5%B9%B2%E8%8D%89%E5%BD%B1%E8%A7%86%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/9105/%E5%B9%B2%E8%8D%89%E5%BD%B1%E8%A7%86%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%20old.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("mainCSS"));

g_default_url_prefix = 'http://laigc.com';
g_url_current = window.location.toString();

function log_trace(msg) {
    if (console !== undefined) {
        console.trace(msg);
    }
}

function fixFullURL(path) {
    if (path.indexOf(g_default_url_prefix) == 0) {
        return path
    } else {
        return g_default_url_prefix + path;
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function updateDOM(responseText) {
    var elmDivTips = document.createElement('div');
    elmDivTips.id = 'laigc-tips';

    var elmSpanBtnContainer = document.createElement('span');
    var aBtn = document.createElement('a');
    var elmDivTipsWin = null;

    var url;
    var respInJSON;
    var info;

    try {
        respInJSON = JSON.parse(responseText);
    } catch (e) {
        info = "服务器傻了";
        url = g_default_url_prefix;
    }

    if (respInJSON && respInJSON.status === 200) {
        var linkCount = respInJSON.link_list.length;
        if (linkCount > 0) {
            info = "有 " + linkCount + " 个下载链接";
            url = fixFullURL(respInJSON.uri);

            elmDivTipsWin = document.createElement('div');
            elmDivTipsWin.id = 'laigc-tips-win';
            elmDivTipsWin.className = 'text-hide';

            var elmTableLinksContainer = document.createElement('table');
            for (var i = 0; i < respInJSON.link_list.length; i++) {
                var linkObj = respInJSON.link_list[i];
                var elmTr = document.createElement('tr');
                var elmTd = document.createElement('td');


                var itemText = linkObj['title'];
                if (linkObj['size'] && linkObj['size'] > 0) {
                    var formatSizeForHuman = linkObj['size'] / 1024 / 1024 / 1024;
                    itemText = parseFloat(formatSizeForHuman).toFixed(2) + 'G ' + itemText;
                }

                var elmLink = document.createElement('a');
                elmLink.textContent = itemText;
                elmLink.target = "_blank";
                elmLink.href = url;

                elmTd.appendChild(elmLink);
                elmTr.appendChild(elmTd);
                elmTableLinksContainer.appendChild(elmTr);
            }

            elmDivTipsWin.appendChild(elmTableLinksContainer);
        } else {
            info = "暂缺下载链接";
            url = fixFullURL(respInJSON.uri);
        }
    } else {
        info = "暂缺下载链接";
        url = g_default_url_prefix;
    }

    aBtn.textContent = info;
    aBtn.className = "link-list";
    aBtn.target = "_blank";
    aBtn.href = url;

    elmSpanBtnContainer.appendChild(aBtn);
    elmDivTips.appendChild(elmSpanBtnContainer);
    if (elmDivTipsWin) {
        elmDivTips.appendChild(elmDivTipsWin);
    }

    var divSibling;
    if (isMovieDouban()) {
        elmDivTips.className = "laigc-link-list-douban";

        divSibling = document.getElementById('mainpic');
        if (!divSibling) {
            log_trace('element that be attached not found');
        } else {
            divSibling.appendChild(elmDivTips);
        }

    } else if (isVeryCD()) {
        elmDivTips.className = "laigc-link-list-verycd";

        divSibling = document.getElementById('entry_button');
        if (!divSibling) {
            log_trace('element that be attached not found');
        } else {
            divSibling.appendChild(elmDivTips);
        }
    } else if (isMovieMtime()) {
        elmDivTips.className = "laigc-link-list-mtime";

        divSibling = document.getElementById('ratingRightRegion');
        if (!divSibling) {
            log_trace('element that be attached not found');
        } else {
            divSibling.appendChild(elmDivTips);
        }
    } else if (isIMDB()) {
        elmDivTips.className = "laigc-link-list-imdb";
        aBtn.className += " btn2 large";

        divSibling = document.getElementById('overview-bottom');
        if (!divSibling) {
            log_trace('element that be attached not found');
        } else {
            divSibling.appendChild(elmDivTips);
        }
    } else if (isDMM()) {
        elmDivTips.className = "laigc-link-list-dmm";

        divSibling = document.getElementById('sample-video');
        insertAfter(elmDivTips, divSibling);
    } else {
        return;
    }

    var _jq;
    if (isMovieMtime()) {
        _jq = jQuery.noConflict();
    } else {
        _jq = $;
    }
    _jq('#laigc-tips').hover(function () {
        if (!document.getElementById('laigc-tips-win')) {
            return;
        }

        var tipsOffset = _jq(this).offset();
        var w = _jq(this).width();

        var offsetOpts = {
            left: tipsOffset.left + w,
            top: tipsOffset.top
        };

        _jq('#laigc-tips-win').removeClass('text-hide').fadeIn(300).css('z-index', 999).offset(offsetOpts);
    }, function () {
        if (!document.getElementById('laigc-tips-win')) {
            return;
        }

        _jq('#laigc-tips-win').addClass('text-hide').fadeOut(50);
    });

    if (document.getElementById('laigc-tips-win')) {
        _jq('#laigc-tips-win').hide();
    }


}

function parseMovieDoubanSubjectIDFromDouban() {
    var subjectID;
    var pattern = '/subject/(\\d+)/';
    var re = new RegExp(pattern, 'gi');
    var m = re.exec(g_url_current);
    if (m) {
        subjectID = m[1];
    }

    return subjectID;
}

function parseMovieMtimeID() {
    var mtimeID;
    var pattern = 'movie.mtime.com/(\\d+)/';
    var re = new RegExp(pattern, 'gi');
    var m = re.exec(g_url_current);
    if (m) {
        mtimeID = m[1];
    }

    return mtimeID;
}

function parseIMDBIDFromVeryCD() {
    var imdbID;
    var imdb_rate_id = document.getElementById('imdb_rate_id');
    if (imdb_rate_id) {
        imdbID = imdb_rate_id.textContent;
    }
    return imdbID;
}

function parseOriginProductID() {
    var originProductID;
    var pattern = 'cid=(\\S+)/';
    var re = new RegExp(pattern, 'gi');
    var m = re.exec(g_url_current);
    if (m) {
        originProductID = m[1];
    }

    return originProductID;
}

function doSearch(urlSearch) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                updateDOM(xhr.responseText);
            } else {
                log_trace("got un-expected status " + xhr.statusText);
            }
        }
    };

    xhr.onerror = function (e) {
        log_trace("got un-expected status " + xhr.statusText);
    };

    xhr.ontimeout = function () {
        log_trace("got timeout " + urlSearch);
    };

    xhr.open("GET", urlSearch, true);
    xhr.send(null);
}

function isMovieDouban() {
    return g_url_current.indexOf('movie.douban.com/subject/') >= 0;
}

function isVeryCD() {
    return g_url_current.indexOf('verycd.com/entries/') >= 0;
}

function isIMDB() {
    return g_url_current.indexOf('imdb.com/title/tt') >= 0;
}

function isMovieMtime() {
    return g_url_current.indexOf('movie.mtime.com/') >= 0;
}

function isDMM() {
    return g_url_current.indexOf('dmm.co.jp') >= 0;
}


function parseIMDBIDFromIMDB() {
    var imdbID;

    var pattern = '/title/(tt\\d+)/';
    var re = new RegExp(pattern, 'gi');
    var m = re.exec(g_url_current);
    if (m) {
        imdbID = m[1];
    }

    return imdbID;
}

function main() {
    var urlSearch;
    var imdbID;

    if (isMovieDouban()) {
        var subjectID = parseMovieDoubanSubjectIDFromDouban();
        if (!subjectID) {
            log_trace('parse douban movie subject ID failed');
            return;
        } else {
            urlSearch = 'http://laigc.com/m/api/movie/douban/' + subjectID + '/';
        }
    } else if (isVeryCD()) {
        imdbID = parseIMDBIDFromVeryCD();
        if (!imdbID) {
            log_trace('parse IMDB ID failed');
            return
        } else {
            urlSearch = 'http://laigc.com/m/api/movie/imdb/' + imdbID + '/';
        }
    } else if (isMovieMtime()) {
        var mtimeID = parseMovieMtimeID();
        if (!mtimeID) {
            log_trace('parse mtime movie ID failed');
            return;
        } else {
            urlSearch = 'http://laigc.com/m/api/movie/mtime/' + mtimeID + '/';
        }
    } else if (isIMDB()) {
        imdbID = parseIMDBIDFromIMDB();
        if (!imdbID) {
            log_trace('parse IMDB ID failed');
            return
        } else {
            urlSearch = 'http://laigc.com/m/api/movie/imdb/' + imdbID + '/';
        }
    } else if (isDMM()) {
        var originProductID = parseOriginProductID();
        if (!originProductID) {
            log_trace('parse origin product ID failed');
        } else {
            urlSearch = 'http://laigc.com/m/api/movie/product_id/' + originProductID + '/';
        }
    }

    if (urlSearch) {
        doSearch(urlSearch);
    }
}

main();