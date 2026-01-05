// ==UserScript==
// @name        SteamGifts: Open in pop-in
// @namespace   lainscripts_steamgifts_steam_popin
// @description Opens various links in pop-in window. This includes Giveaway links, links to Steam store and new messages.
// @include     *://www.steamgifts.com/*
// @include     *://steamdb.info/*
// @version     4.6
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/8064/SteamGifts%3A%20Open%20in%20pop-in.user.js
// @updateURL https://update.greasyfork.org/scripts/8064/SteamGifts%3A%20Open%20in%20pop-in.meta.js
// ==/UserScript==
/* jshint esnext: true */
(()=>{
    'use strict';

    let empty = [],
        truncSubdomains = (s) => (s.match(/[^.]+\.[^.]+$/i) || empty)[0],
        domains = {
            SteamGifts : 'steamgifts.com',
            SteamDB : 'steamdb.info'
        },

        inIframe = (
            function()
            {
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            }
        )(),

        runCodeFor = {
            [domains.SteamGifts]: function()
            {
                let isSteamGifts = (s) => truncSubdomains(s) === domains.SteamGifts,
                    getFirstLevel = (pathname) => (/^\/[^/]+/i.exec(pathname) || empty)[0],
                    isKnown = /^\/giveaways\/|\/(about|account|discussions?|giveaway|go\/comment|legal|messages|roles|support|user)(\/|$)/i,
                    isAboutLegal = /^\/(about|legal)\//i,
                    isDiscussion = /^\/(discussion|go\/comment)\//i,
                    isSearch = /^\/giveaways\/search/i,
                    isSteamStore = /^store\.steampowered\.com$/i,
                    isSteamPackage = /\/(app|sub)\//i;

                // attach styles before document displayed
                (function(style)
                 {
                    let insert = style.sheet.insertRule.bind(style.sheet);
                    style.id = 'popinStyles';
                    style.type = 'text/css';

                    insert('@keyframes spinnerFrames {0% {transform:rotate(0deg)} 100% {transform:rotate(-360deg)}}',0);
                    insert(
                        '#popinSpinner svg {'+(
                            'animation: spinnerFrames linear 1s;'+
                            'animation-iteration-count: infinite;'+
                            'transform-origin: 50% 50%'
                        )+'}', 0);
                    insert(
                        '#popinBackground {'+(
                            'box-sizing: border-box;'+
                            'position: fixed;'+
                            'top: 0;'+
                            'left: 0;'+
                            'padding: 35px 40px;'+
                            'width: 100%;'+
                            'height: 100%;'+
                            'background-color: rgba(0,0,0,0.85);'+
                            'z-index: 1000000;'+
                            'display: none'
                        )+'}', 0);
                    insert(
                        '#popinFrame {'+(
                            'position: relative;'+
                            'width: 100%;'+
                            'height: 100%;'+
                            'border: #aaa 2px solid;'+
                            'border-radius: 3px;'+
                            'background-color: rgba(0,0,0,0.33);'+
                            'z-index: 1'
                        )+'}', 0);
                    insert(
                        '#popinSpinner {'+(
                            'position: fixed;'+
                            'top: 50%;'+
                            'left: 50%;'+
                            'margin-top: -50px;'+
                            'margin-left: -50px;'+
                            'width: 100px;'+
                            'height: 100px;'+
                            'z-index: 2'
                        )+'}', 0);

                    // modify navigation elements when various pages are loaded in the pop-in
                    if (inIframe)
                    {
                        // make page cover the entire window height and reset padding with margin if someone changed them
                        insert(
                            'html, body {'+(
                                'height: 100%;'+
                                'padding: 0!important;'+
                                'margin: 0!important'
                            )+'}', 0);
                        // hide some useless for pop-in blocks
                        insert((
                            '.offer__outer-wrap,'+
                            '.footer__outer-wrap'
                        )+' {display: none}', 0);
                        // make content as heigh as the page + fix for the giveaway pages (they have 1 extra block)
                        if (getFirstLevel(document.location.pathname) === '/giveaway')
                            insert('.page__outer-wrap {min-height: calc(100% - 50px - 208px)}', 0);
                        else
                            insert('.page__outer-wrap {min-height: calc(100% - 50px)}', 0);
                        // display floating account button in the top-right corner (except for the account page)
                        if (getFirstLevel(document.location.pathname) === '/account')
                            insert('header {display: none!important}', 0);
                        else
                        {
                            insert((
                                '.nav__left-container,'+
                                '.nav__button-container--notification'
                            )+' {display: none}', 0);
                            insert('header > nav {padding: 0!important}', 0);
                            insert('.sidebar {top: 25px!important}', 0);
                            insert(
                                'header {'+(
                                    'top: -5px!important;'+
                                    'right: 0;'+
                                    'padding: 0;'+
                                    'position: fixed;'+
                                    'width: auto!important;'+
                                    'background: none;'+
                                    'z-index: 100'
                                )+'}', 0);
                        }
                        // hide Browse category in frames on pages with giveaways lists
                        if (getFirstLevel(document.location.pathname) === '/giveaways')
                            insert('.sidebar__heading:first-of-type, .sidebar__navigation:first-of-type {display: none}', 0);
                        // hide sidebar and padding at the left side for discussions
                        if (getFirstLevel(document.location.pathname) === '/discussion')
                        {
                            insert('.sidebar {display: none}', 0);
                            insert(
                                '.widget-container>div:not(:first-child) {'+(
                                    'padding-left: 0!important;'+
                                    'margin-left: 0!important;'+
                                    'border-left: none!important'
                                )+'}', 0);
                            insert('.page__heading__breadcrumbs a {pointer-events: none}');
                        }
                    }
                })(document.documentElement.appendChild(document.createElement('style')));

                function createSVGSpinner(out_radius, in_radius, width, number_of_lines)
                {
                    let nameSpace = 'http://www.w3.org/2000/svg';
                    let shift = out_radius + width / 2;

                    let svg = document.createElementNS(nameSpace, 'svg');
                    svg.setAttribute('version', '1.1');
                    svg.setAttribute('x', '0px');
                    svg.setAttribute('y', '0px');
                    svg.setAttribute('width', (2 * shift) + 'px');
                    svg.setAttribute('height', (2 * shift) + 'px');
                    svg.setAttribute('style', (
                        'stroke: #fff;'+
                        'stroke-width: ' + width + 'px;'+
                        'stroke-linecap: round'));

                    let g = svg.appendChild(document.createElementNS(nameSpace, 'g'));

                    let num = number_of_lines,
                        line;
                    while (num--) {
                        line = g.appendChild(document.createElementNS(nameSpace, 'line'));
                        line.setAttribute('x1', shift + Math.cos(2 * Math.PI / number_of_lines * num) * in_radius);
                        line.setAttribute('y1', shift + Math.sin(2 * Math.PI / number_of_lines * num) * in_radius);
                        line.setAttribute('x2', shift + Math.cos(2 * Math.PI / number_of_lines * num) * out_radius);
                        line.setAttribute('y2', shift + Math.sin(2 * Math.PI / number_of_lines * num) * out_radius);
                        line.setAttribute('stroke-opacity', 1 / (num + 1));
                    }
                    return svg;
                }

                function popinObj()
                {
                    /* jshint validthis: true */
                    let _self = this;
                    _self.childPopin = null;

                    let spinner = document.createElement('div');
                    spinner.appendChild(createSVGSpinner(45, 25, 10, 10));
                    spinner.id = 'popinSpinner';

                    let popin = document.createElement('div');
                    popin.id = 'popinBackground';

                    let ifrm = null;

                    function createFrame(a)
                    {
                        let url = a.href;
                        let ifr = document.createElement('iframe');
                        ifr.id = 'popinFrame';

                        ifr.onload = function()
                        {
                            spinner.style.zIndex = 0;
                            if (isSteamGifts(a.hostname))
                                _self.childPopin = this.contentDocument.popin;
                        };

                        // Hide spinner if page keeps loading after a 5 seconds
                        setTimeout(
                            function()
                            {
                                if (popin.style.display === 'block')
                                    spinner.style.zIndex = 0;
                            }, 5000
                        );

                        url = url
                            .replace('http:', 'https:')
                            .replace('/store.steampowered.com/', '/steamdb.info/');

                        ifr.src = url;
                        return ifr;
                    }

                    popin.appendChild(spinner);
                    document.body.appendChild(popin);

                    _self.show = function (a)
                    {
                        document.body.style.overflowY = 'hidden';
                        ifrm = createFrame(a);
                        popin.appendChild(ifrm);
                        popin.style.display = 'block';
                    };

                    _self.hide = function ()
                    {
                        let onUpdateParent = false;
                        if (ifrm.src.search('/www.steamgifts.com/') > -1)
                        {
                            // propagate outdated state of parent document and reload it if applicable
                            let deepPopin = _self.childPopin;
                            while(deepPopin && deepPopin.childPopin && !deepPopin.isOutdated())
                                deepPopin = deepPopin.childPopin;
                            if (deepPopin && deepPopin.isOutdated())
                            {
                                document.popin.setIsOutdated();
                                // only pages with active giveaways should be reloaded
                                if (document.location.pathname === '/' ||
                                    isSearch.test(document.location.pathname))
                                {
                                    location.reload();
                                    onUpdateParent = true;
                                }
                            }
                            else
                            {
                                // update points and notifications in parent window
                                let ifDoc = ifrm.contentDocument,
                                    points = '.nav__points',
                                    notifs = '.nav__button[href^="/giveaways/"],.nav__button[href="/messages"]';

                                let pin = ifDoc.querySelector(points);
                                if (pin)
                                    for (let po of document.querySelectorAll(points))
                                        po.textContent = pin.textContent;

                                pin = ifDoc.querySelectorAll(notifs);
                                if (pin.length)
                                {
                                    let replaceNavNotification = function(pTo, to, from) {
                                        if (to && from)
                                            to.textContent = from.textContent;
                                        if (!to && from)
                                            pTo.appendChild(from.cloneNode(true));
                                        if (to && !from)
                                            pTo.removeChild(to);
                                    };
                                    let nnSelector = '.nav__notification';

                                    let pi, po;
                                    for (po of document.querySelectorAll(notifs)) for (pi of pin)
                                        if (po.href === pi.href)
                                        {
                                            po.parentNode.className = pi.parentNode.className;
                                            replaceNavNotification(
                                                po,
                                                po.querySelector(nnSelector),
                                                pi.querySelector(nnSelector)
                                            );
                                        }
                                }
                            }
                        }
                        if (!onUpdateParent)
                        {
                            document.body.style.overflowY = 'auto';
                            popin.removeAttribute('style');
                            spinner.removeAttribute('style');
                        }
                        _self.childPopin = null;
                        ifrm.parentNode.removeChild(ifrm);
                        ifrm = null;
                    };

                    popin.onclick = _self.hide;

                    // parent document state checker (in some cases it's only logical to refresh parent page when popin closed)
                    let isParentOutdated = false;

                    _self.isOutdated = () => isParentOutdated;
                    _self.setIsOutdated = () => isParentOutdated = true;
                }

                document.addEventListener (
                    "DOMContentLoaded", function()
                    {
                        let willMakeTopPageOutdated = '.form__sync-default,.table__remove-default,.js__submit-hide-games';
                        document.popin = new popinObj();

                        document.body.addEventListener(
                            'click', function(e)
                            {
                                let t = e.target;

                                // handle only LMB clicks
                                if (e.button > 0)
                                    return;

                                if (t.closest(willMakeTopPageOutdated))
                                    document.popin.setIsOutdated();

                                // try to drill up to an A element if present
                                t = t.closest('A');

                                // if user clicked a link - try to handle it properly
                                if (t && t.href)
                                {
                                    // handle known links - specific categories on SteamGifts and links to packages on Steam
                                    if ((isSteamGifts(t.hostname) && isKnown.test(t.pathname) && !isSearch.test(t.pathname)) ||
                                        (isSteamStore.test(t.hostname) && isSteamPackage.test(t.pathname)))
                                    {
                                        // do not handle links to pages of the same category as the current one
                                        if ((document.location.pathname !== '/giveaways' &&
                                             (getFirstLevel(t.pathname) === getFirstLevel(document.location.pathname))) ||
                                            (isAboutLegal.test(t.pathname) && isAboutLegal.test(document.location.pathname)) ||
                                            (isDiscussion.test(t.pathname) && isDiscussion.test(document.location.pathname)))
                                            return;
                                        // Workaround for EasySteamGifts: do not handle join button if present
                                        if (t.closest('.esg-join'))
                                            return;
                                        // if we are still here, then
                                        document.popin.show(t);
                                        e.preventDefault();
                                    }
                                    else
                                        // handle unknown links when page is loaded in a frame
                                        if (inIframe)
                                            t.target = '_blank';
                                }
                            }
                        );
                    }
                );
            },

            [domains.SteamDB] : function()
            {
                if (!inIframe)
                    return;

                let isSteamDB = (s) => truncSubdomains(s) === domains.SteamDB;

                document.addEventListener(
                    "DOMContentLoaded", function()
                    {
                        document.body.addEventListener(
                            'click', function(e)
                            {
                                let t = e.target;

                                // handle only LMB clicks
                                if (e.button > 0)
                                    return;

                                // try to drill up to an A element if present
                                t = t.closest('A');

                                // open all third-party domains in a new tab
                                if (t && t.href && !isSteamDB(t.hostname))
                                    t.target = '_blank';
                            }
                        );
                    }
                );
            }
        };

    runCodeFor[truncSubdomains(document.location.hostname)]();
})();