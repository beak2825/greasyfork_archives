// ==UserScript==
// @name       niconico Matome Blog Remover
// @namespace  http://userstyles.org/users/141086
// @version    2.0
// @description  niconicoの各サービスから不快なまとめブログとブロマガの表示を消します
// @description  Remove Matome Blogs from blomaga item lists
// @include      http://www.nicovideo.jp/
// @include      http://www.nicovideo.jp/?*
// @include      http://ch.nicovideo.jp/portal/blomaga*
// @include      http://www.nicovideo.jp/watch/*
// @copyright  AgentSmith
// @downloadURL https://update.greasyfork.org/scripts/762/niconico%20Matome%20Blog%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/762/niconico%20Matome%20Blog%20Remover.meta.js
// ==/UserScript==

(function() {
    // ==common area==
    var url = location.href.split('?'),
        timer = 0,
        gnrlCSS = '.blomaga_tab_menu li:nth-of-type(3),',
        blmgTopCSS = 'li.matomemedia, #contents_side > script[type="text/javascript"] + h2, #contents_side > script[type="text/javascript"] + h2 + div.article_ranking,',
        blacklist = ['shukanbunshun','kotaku','ch2488'];

    // function: add css to header
    function css(k) {
        var t = document.createElement('style');
        t.setAttribute('type','text/css');
        t.setAttribute('id', 'matome_remover');
        document.getElementsByTagName('head')[0].appendChild(t);
        document.getElementById('matome_remover').innerHTML = ('\n<!-- '+ k + '.remove {display:none!important} -->\n');
    }
    //function: General top item list flag
    function flag_gnrl() {
        var m = document.getElementById('Blomaga_tab').getElementsByClassName('blomaga_item');
        for (i = m.length; i--;) {
            var u = m[i].getElementsByTagName('a')[0].getAttribute('href'),
                p = m[i].getElementsByClassName('blogname')[0].getElementsByTagName('a')[0].getAttribute('href');
            if (u.indexOf('nicovideo.jp') == -1) {
                m[i].className = 'remove';
            }
            for (k = blacklist.length; k--;) {
                if (p.match(blacklist[k])) {
                    m[i].className = 'remove';
                }
            }
        }
    }
    // function: Blomaga top item list flag
    function flag_blmg() {
        var m = document.getElementById('js_contents_area').getElementsByClassName('item');
        for (i = m.length; i--;) {
            var t = m[i].getElementsByTagName('a')[0].getAttribute('href'),
                n = m[i].getElementsByClassName('blomaga_name')[0];
            if(n.className.match('matome')) {
                m[i].className = 'remove';
            }
            for (k = blacklist.length; k--;) {
                if(t.indexOf(blacklist[k]) > 1) {
                    m[i].className = 'remove';
                }
            }
        }
    }
    // function: Video page marquee area flag
    function flag_mrq() {
        var p = document.getElementById('textMarquee').getElementsByClassName('item');
        for (i = p.length; i--;) {
            if (p[i].className.match('blomaga')) {
                p[i].className = 'remove';
            }
        }
    }
    // ==/common area==
    
    //General Top
    if (url[0] == 'http://www.nicovideo.jp/') {
        css(gnrlCSS);
        flag_gnrl();
    }
    //Blomaga Top
    if(location.href.indexOf('ch.nicovideo.jp/portal/blomaga') > 0) {
        css(blmgTopCSS);
        flag_blmg();
        //Additional Items
        document.addEventListener('DOMNodeInserted', function() {
            if(timer) return;
            timer = setTimeout(function() {
                flag_blmg();
                timer = 0;
            }, 10);
        }, false);    }
    //Video Page
    if(url[0].indexOf('www.nicovideo.jp/watch/') > 1) {
        css('');
        document.addEventListener('DOMNodeInserted', function() {
            if(timer) return;
            timer = setTimeout(function() {
                flag_mrq();
                timer = 0;
            }, 10);
        }, false);
    }
})()