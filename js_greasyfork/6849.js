// ==UserScript==
// @name            Thread Navigating by Arrow keys
// @name:vi         Thread Navigating by Arrow keys
// @namespace       https://greasyfork.org/scripts/6849-thread-navigating-by-arrow-keys
// @description     Use ← or → and Ctrl to navigate to previous, next, first or last page
// @description:vi  Use ← or → and Ctrl to navigate to previous, next, first or last page
// @author          theheroofvn
// @include         /^.*(thread|forum|diendan).*$/
// @include         http://www.vn-zoom.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @noframes
// @grant           GM_addStyle
// @version         6.8
// @downloadURL https://update.greasyfork.org/scripts/6849/Thread%20Navigating%20by%20Arrow%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/6849/Thread%20Navigating%20by%20Arrow%20keys.meta.js
// ==/UserScript==

$(document).ready(function () {
    $(window).focus();

    function custom_site(list) {
        if (list.length === 0) return 0;
        for (var i = 0; i < list.length; i++) {
            if (location.hostname == list[i].host) {
                prev = list[i].prev;
                next = list[i].next;
                first = list[i].first;
                last = list[i].last;
                up = list[i].up;
                return 1;
            }
        }
        return 0;
    }

    function checkScriptExist(script) {
        return $('script[src*="' + script + '"]').length > 0 ? true : false;
    }

    function detect_forum() {
        if (window.location.hostname === 'forum.xda-developers.com') {
            return 'vbb';
        }

        let result = "";

        if (checkScriptExist("vbulletin")) result = "vbb";
        else if (checkScriptExist("/js/xf/")) result = "xenforo";
        else if (checkScriptExist("general.js")) result = "mybb";
        else if (checkScriptExist("forum_fn.js")) result = "phpbb";

        return result;
    }

    var prev, next, first, last, up, up_sub = '[itemtype="https://schema.org/BreadcrumbList"] a';
    var site_info = [
        {
            host: "voz.vn",
            prev: "a.pageNav-jump--prev",
            next: "a.pageNav-jump--next",
            first: ".pageNav-main>.pageNav-page:first-child>a",
            last: ".pageNav-main>.pageNav-page:last-child>a"
        }
        , {
            host: "www.webtretho.com",
            prev: "a.arrowPrePage",
            next: "a.arrowNextPage",
            first: "a.arrowFstPage",
            last: "a.arrowLstPage"
        }, {
            host: "forum.bkav.com.vn",
            prev: "a.js-pagenav-prev-button",
            next: "a.js-pagenav-next-button",
            first: "a[data-page='1']",
            last: "a.js-pagenav-button:nth-last-child(2)",
            up: "#breadcrumbs a.crumb-link"
        }
    ];

    if (custom_site(site_info) === 0) {
        switch (detect_forum()) {
            case 'vbb':
                prev = 'a[rel="prev"]';
                next = 'a[rel="next"]';
                first = 'a[rel="start"], a[rel="first"]';
                last = 'a[title^="Last"], a[title*="uối"]';
                up = "span.navbar a, li.navbit a";
                break;
            case 'xenforo':
                prev = "a.pageNav-jump--prev";
                next = "a.pageNav-jump--next";
                last = ".pageNav-main > .pageNav-page:last-child > a";
                first = '.pageNav-main > .pageNav-page:first-child > a';
                // up = ".p-breadcrumbs";
                break;
            case 'mybb':
                prev = "a.pagination_previous";
                next = "a.pagination_next";
                first = "a.pagination_first";
                last = "a.pagination_last";
                up = ".navigation > a";
                break;
            case 'phpbb':
                prev = ".display-options a.left-box.left";
                next = ".display-options a.right-box.right";
                first = ".pagination > span > a:first-child";
                last = ".pagination > span > a:last-child";
                up = ".navlinks > .icon-home a";
                break;
            default:
                return;
        }
    }

    var nav = {
        prev: function () {
            return $(prev);
        },

        next: function () {
            return $(next);
        },

        first: function () {
            if ($(first).length > 0) {
                return $(first);
            } else {
                var $prev = $(prev).first();

                if ($prev) {
                    $prev.attr('href', function (_, value) {
                        return value.replace(/page=\d+/, 'page=1');
                    });

                    return $prev;
                } else {
                    return $();
                }
            }
        },

        last: function () {
            if ($(last).length > 0) {
                return $(last);
            } else {
                var $next = $(next).first();

                if ($next) {
                    $next.attr('href', function (_, value) {
                        return value.replace(/page=\d+/, 'page=9999');
                    });

                    return $next;
                } else {
                    return $();
                }
            }
        },

        up: function () {
            return $(up).length > 0 ? $(up).last() : $(up_sub).last();
        }
    };

    var allowed = true;

    $(document).keydown(function (e) {
        if (!allowed) {
            return;
        }

        allowed = false;

        var key = e.keyCode,
            action = null;

        if (e.ctrlKey) {
            allowed = true;
            if (key == 39) action = "last";
            else if (key == 37) action = "first";
            else if (key == 8) action = "up";
        } else if (key == 39) {
            action = "next";
        } else if (key == 37) {
            action = "prev";
        } else {
            return;
        }

        if (!action || e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA" || e.target.isContentEditable) {
            return;
        }

        var $anchor = nav[action]();

        if ($anchor.length) {
            window.location.href = $anchor[0].href;
        }
    }).keyup(function (e) {
        allowed = true;
    });
});
