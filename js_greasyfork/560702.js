// ==UserScript==
// @name         TMN Rankbar
// @namespace    http://tmn2010.net/
// @version      1.0.0
// @license      MIT
// @description  Save yourself 10 credits.
// @author       Pap
// @match        *.tmn2010.net/*uthenticated/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560702/TMN%20Rankbar.user.js
// @updateURL https://update.greasyfork.org/scripts/560702/TMN%20Rankbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GM Fallback Layer ---
    const GM_getValue = typeof window.GM_getValue === "function"
        ? window.GM_getValue
        : (key, def) => {
            const v = localStorage.getItem(key);
            try { return v !== null ? JSON.parse(v) : def; }
            catch { return v !== null ? v : def; }
        };

    const GM_setValue = typeof window.GM_setValue === "function"
        ? window.GM_setValue
        : (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        };

    const AddRankBar = (() => {
        let interceptorInstalled = false;

        function UpdateRankbar() {
            const $tmnRankbar = $(window.top.document.querySelector('#ctl00_userInfo_lblRankbarPerc'));
            const $lblRank = $(window.top.document.querySelector('#ctl00_userInfo_lblrank'));

            if ($tmnRankbar.length && $lblRank.length) {
                $tmnRankbar.css({
                    /*color: 'blue',
                    fontWeight: 'bold'*/
                }).text(`(${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}%)`);
            } else {
                const rankbarHtml = ` <a href="statistics.aspx?p=p"><span id="ctl00_userInfo_lblRankbarPerc" class="usrinfovalue" /*style="color: blue; font-weight: bold;*/">${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}</span></a>`
                $('#ctl00_userInfo_lblrank').after(rankbarHtml);
            }

            function CalculateRankPercent(exp) {
                if (exp === '?') return '?';
                const savedExp = GM_getValue('TMN_EXPERIENCE', 0);
                const ranks = [ 'Scum', 'Wannabe', 'Thug', 'Criminal', 'Gangster', 'Hitman', 'Hired Gunner', 'Assassin', 'Boss', 'Don', 'Enemy of the State', 'Global Threat', 'Global Dominator', 'Global Disaster', 'Legend' ];
                const rankId = ranks.indexOf($('#ctl00_userInfo_lblrank').text());
                const totalExpAmts = [0, 5, 20, 80, 140, 220, 320, 450, 600, 800, 1100, 1500, 2000, 3000, 3000 ];
                const perRankReq = [5, 15, 60, 60, 80, 100, 130, 150, 200, 300, 400, 500, 1000, 2000, 2000 ];
                GM_setValue('TMN_EXPERIENCE', Math.max(savedExp, exp));
                const rankPerc = (exp - totalExpAmts[rankId]) / perRankReq[rankId] * 100;
                return FormatPercent(rankPerc);
            }

            function FormatPercent(rankPerc) {
                let formattedPerc = rankPerc.toFixed(2).replace('.', ',').replace(/,(\d*[1-9])0+$|,0+$/,',$1').replace(/,$/, '');

                return formattedPerc;
            }
        };

        function AddPersonalStatsInterceptor() {
            if (interceptorInstalled) return;
            interceptorInstalled = true;

            const TARGET = 'hndlr.ashx?m=pst&t=';
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                this._intercept = url.includes(TARGET);
                return originalOpen.call(this, method, url, ...rest);
            };

            XMLHttpRequest.prototype.send = function(...args) {
                if (this._intercept) {
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                let data = JSON.parse(this.responseText);
                                GM_setValue('TMN_EXPERIENCE', data[0].Experience);
                                UpdateRankbar();
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    });
                }

                return originalSend.apply(this, args);
            };

            const $statRefresh = $('#ctl00_imgRefresh');
            if ($statRefresh.length ) $statRefresh.closest('a').prop('onclick')();
        };

        // ---- the callable function ----
        const run = () => {
            AddPersonalStatsInterceptor();
            UpdateRankbar();
        };

        // ---- run immediately ----
        run();

        // ---- return for later calls ----
        return run;
    })();
})();