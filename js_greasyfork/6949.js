// ==UserScript==
// @name         Redirect remover
// @version      2018.06.29.01
// @description  Tính năng: xoá redirect link
// @namespace    idmresettrial
// @author       idmresettrial
// @run-at       document-start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @icon         http://i.imgur.com/cnWhhD8.png
// Website list
// @include       *
// End list
// @downloadURL https://update.greasyfork.org/scripts/6949/Redirect%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/6949/Redirect%20remover.meta.js
// ==/UserScript==
var site = window.location.hostname;
site = site.replace(/[^.]+\.deviantart\.com/i, 'www.deviantart.com');
if (window.top !== window.self && site !== 'www.google.com') {
    return;
}
this.$ = this.jQuery = jQuery.noConflict(true);
document.addEventListener('DOMContentLoaded', function () {
    var link, i, url;
    switch (site)
    {
        case 'forums.voz.vn':
        case 'sinhvienit.net':
        case 'phienbanmoi.com':
        case 'forum.vietdesigner.net':
        case 'www.webtretho.com':
        case 'chiaseit.vn':
        case 'www.hdvietnam.com':
        case 'www.deviantart.com':
            {
                $('a').each(function () {
                    url = unescape($(this).attr('href'));
                    if (site === 'forum.vietdesigner.net' || site === 'chiaseit.vn') url = unescape(url);
                    redirect = /[?=]http/i;
                    if (redirect.test(url)) {
                        $(this).attr('href', url.replace(/^.+[?=]http/i, 'http'));
                    }
                });
                var particular = {
                    'vozforums.com': function () {
                        var errPage = [
                            'vozForums Database Error',
                            '502 Bad Gateway',
                            '500 Internal Server Error'
                        ];
                        if (errPage.indexOf(document.title) > - 1) {
                            document.title = 'Connecting... - By Redirect Remover';
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        }
                    },
                    'sinhvienit.net': function () {
                        if ($('form[name=vtlai_firewall]').length) {
                            $('#btnSubmit1').click();
                        }
                    }
                };
                if (Object.keys(particular).indexOf(site) > - 1) particular[site]();
                break;
            }
        case 'adf.ly':
        case 'q.gs':
        case 'chathu.apkmania.co':
            {
                url = '';
                speedUp();
                t = setInterval(function () {
                    url = $('#skip_button').attr('href') || '';
                    if (url.length) {
                        clearInterval(t);
                        window.onbeforeunload = null;
                        window.onunload = null;
                        gogogo(url);
                    }
                }, 1000);
                break;
            }
        case 'linkshrink.net':
            {
                url = $('#skip a.bt').attr('href');
                if (url.length) gogogo(url);
                break;
            }
        case 'www.oni.vn':
            {
                domain = window.location.protocol + '//' + window.location.host + '/';
                $.ajax({
                    type: 'GET',
                    url: domain + 'click.html',
                    data: $('html').html().match(/code=([^"]+)/i) [0],
                    contentType: 'application/json; charset=utf-8',
                    success: function (html) {
                        url = html;
                        gogogo(url);
                    }
                });
                break;
            }
        case 'ouo.io':
        case 'ouo.press':
            {
                url = $('a#btn-main').attr('href');
                gogogo(url);
                break;
            }
            /*case 'www.google.com':
            {
                if (!(/(9gag\.com|vechai\.info)/gi).test(document.referrer)) {
                    setTimeout(function () {
                        bVerify = $('div.recaptcha-checkbox-checkmark');
                        if (bVerify.length) bVerify.click();
                    }, 1000);
                }
                break;
            }*/
        case 'acer-a500.ru':
        case 'vegaviet.com':
            {
                $('a').each(function () {
                    url = unescape($(this).attr('href'));
                    redirect = {
                        'acer-a500.ru': 'http://acer-a500.ru/engine/redir/index/leech_out.php?a:',
                        'vegaviet.com': 'http://vegaviet.com/redirect/?to='
                    };
                    if (url.indexOf(redirect[site]) === 0) {
                        $(this).attr('href', window.atob(url.substring(redirect[site].length, url.length)));
                    }
                });
                break;
            }
        case 'www.facebook.com':
            {
                $('body').on('mouseenter', 'a[onmouseover^="LinkshimAsyncLink.swap"]', function () {
                    $(this) [0].removeAttribute('onclick');
                    $(this) [0].removeAttribute('onmouseover');
                    $(this) [0].outerHTML += '';
                });
                $('body').on('mouseenter', 'a[href^="https://l.facebook.com/l.php?u="]', function () {
                    $(this) [0].href = unescape( $(this) [0].href.match(/\?u=(.*)&h=/) [1] );
                });
                break;
            }
        case 'muare.vn':
            {
                $('a.ProxyLink').removeClass('ProxyLink');
                break;
            }
        case 'www.vn-zoom.com':
            {
                $('a[href^="http://www.mediafire.com/"]').click(function (e) {
                    e.preventDefault();
                    $('body').append('<iframe style="visibility:hidden" id="rr-mf" src="about:blank"></iframe>').find('iframe#rr-mf').contents().find('body').append('<a onclick="window.open(this.href);return false;" target="_blank"></a>').find('a').attr('href', $(this).attr('href')) [0].click();
                    $('iframe#rr-mf').remove();
                });
                $('img[src*="i.imgur.com/"]').each(function () {
                    $(this).attr('src', $(this).attr('src').replace('http://i.imgur.com/', 'http://kageurufu.net/imgur/?'));
                });
                break;
            }
        case 'linksvip.net':
            {
                if (window.location.href.indexOf('linksvip.net/dl') > - 1) {
                    setTimeout(function () {
                        url = $('a.linkvip').attr('href');
                        if (url.length && url.indexOf('linksvip.net') > - 1) {
                            gogogo(url);
                        }
                    }, 1000);
                }
                if (window.location.href.indexOf('linksvip.net/get-link') > - 1) {
                    url = $('#skip a.bt').attr('href');
                    if (url.length) {
                        gogogo(url);
                    }
                }
                if (window.location.href.indexOf('&ref=idmresettrial') > - 1) {
                    /*var alert = (function alert() {
                        window.location.href = $('#a_down').attr('href');
                    }).toString();
                    var script = document.createElement('script');
                    script.innerHTML = alert;
                    document.head.appendChild(script);
                    */
                    i = setInterval(function() {
                        var a_down = $('#a_down').attr('href');
                        if (a_down.length) {
                            clearInterval(i);
                            gogogo(a_down);
                        }
                    }, 1000);
                }
                break;
            }
        case 'www.linkvip.info':
            {
                if (window.location.href.indexOf('&ref=idmresettrial') > - 1) {
                    link = window.location.href.match(/link=(.*?)&ref/)[1];
                    i = setInterval(function() {
                        url = $("input[name=url");
                        if (url.length) {
                            clearInterval(i);
                            $('input[name="url"]').val(link);
                            $('button[type=submit]')[0].click();
                            setTimeout(function() {
                                if (link.indexOf("4share") > -1) {
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: $('a[href*="4share"]').attr("href"),
                                        onload: function(data) {
                                            window.location.href = $(data.responseText).find("direct_link").text();
                                        }
                                    });
                                } else if (link.indexOf("fshare") > -1) {
                                    var directLink = $('div.ui.message a[href*="fshare"]');
                                    if (directLink.length) console.log(directLink.attr("href"));
                                }
                            }, 1000);
                        }
                    }, 1000);
                }
                break;
            }            
        case 'getlinkfshare.com':
            {
                if (window.location.href.indexOf('&ref=idmresettrial') > - 1) {
                    link = window.location.href.match(/link=(.*?)&ref/)[1];
                    $("#linkget").val(link);
                    $("#getlink").click();
                }
                break;
            }
        case '4share.vn':
            {
                if (window.location.href.indexOf("4share.vn/d/") > -1) {
                    $('a[href^="/f/"]').each(function() {
                        $(this).attr("href", "http://www.4share.vn" + $(this).attr("href"));
                    });
                }
                break;
            }
        case 'srnk.co':
            {
                if (window.location.href.indexOf('srnk.co/i') > - 1) {
                    speedUp();
                    setTimeout(function () {
                        $('#btn-with-link').click();
                    }, 10000);
                }
                break;
            }
        case 'www.teamos-hkrg.com':
        case 'teamos-hkrg.com':
            {
                $('a.externalLink').each(function() {
                    $(this).attr("href", unescape($(this).attr("data-proxy-href").match(/link=(.*)&hash/)[1]));
                });
                break;
            }
        default:
            {
                /*
        //if ($('body').text().match(/\b(london|hotel|deal)s?\b/gi).length > 5) {
        selector = {
          'baomoitoday.com': 'div[align="center"][style="padding:5px"] a',
          'travelworld24h.com': 'div.cms-content a',
          'kenhphunu180.com': 'center a, div#news_main a, strong a, div.main_content a'
        };
        //if (typeof selector[site] === 'undefined') site = 'default';
        url = $(selector[site]).attr('href');
        gogogo(url);
        //}
        */
                break;
            }
    }

    // fshare link

    $('a[href^="https://www.fshare.vn/file"], a[href^="http://www.fshare.vn/file"]').each(function () {
        var style = "display:inline-block; margin:0px 5px; padding:0px 5px; background:#fff; border:1px solid #cdcdcd; border-radius:3px; color:#7e7e7e; font-size:10px; line-height:15px; height:18px;";
        GM_addStyle("#dlfolder .filelist .file_name, #dlfolder .filelist_header .file_name {width: 580px} #download_folder {width: 890px;} .container {width: 1190px;} #dlfolder #dlnav.affix {width: 850px;}");
        $('<a style="' + style + '" target="_blank" href="http://linksvip.net/?link=' + $(this).attr('href') + '&ref=idmresettrial">Get vip link 1</a>' +
          '<a style="' + style + '" target="_blank" href="https://getlinkfshare.com/?link=' + $(this).attr('href') + '&ref=idmresettrial">Get vip link 2</a>').insertAfter($(this));
    });

    // 4share link

    $('a[href^="https://www.4share.vn/f/"], a[href^="http://www.4share.vn/f/"], a[href^="http://4share.vn/f/"]').each(function () {
        var style = "display:inline-block; margin:0px 5px; padding:0px 5px; background:#fff; border:1px solid #cdcdcd; border-radius:3px; color:#7e7e7e; font-size:10px; line-height:15px; height:18px;";
        $('<a style="' + style + '" target="_blank" href="http://www.linkvip.info/?link=' + $(this).attr('href') + '&ref=idmresettrial">Get vip link 1</a>' +
          '').insertAfter($(this));
    });

});
function gogogo(url) {
    if (typeof url !== 'undefined') {
        if (url.length === 0) return;
        page = '' +
            '<html><head><title>Đang chuyển hướng...</title>' +
            '<style type="text/css">' +
            'div#rr{margin:10px;}a{text-decoration:none;color:#000}.ellipsis{overflow:hidden;display:inline-block;vertical-align:bottom;-webkit-animation:ellipsis 1s infinite;-moz-animation:ellipsis 1s infinite}@-webkit-keyframes ellipsis{from{width:2px}to{width:12px}}@-moz-keyframes ellipsis{from{width:2px}to{width:12px}}' +
            '</style>' +
            '</head><body>' +
            '<div style="background-image:url(http://i.imgur.com/qflyJA3.gif?r=' + (new Date().getTime()) + ')"></div>' + // Redirect removed count
            '<div id="rr"><b>Đang chuyển hướng đến <a href="' + url + '">trang gốc</a></b><span class="ellipsis">...</span></div>' +
            '</body></html>';
        $('html').html(page);
        $(window).unload(function () {
            $('title').html(url);
            $('body').html('');
        });
        window.location.replace(url);
    }
}
function speedUp() {
    var tmp = (function () {
        var oSetInterval = setInterval;
        setInterval = function (fn, delay) {
            oSetInterval(fn, 10);
        };
    }).toString();
    $('head').append('<script>(' + tmp + ')()</script>');
}