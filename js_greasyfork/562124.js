// ==UserScript==
// @name         PornTube Helper — Free Filter + Faphouse Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto add ?pricing=free + hide cards containing "Faphouse"
// @author       Grok + ChatGPT
// @match        https://www.4tube.com/*
// @match        https://www.aipornvideos.com/*
// @match        https://www.analgalore.com/*
// @match        https://www.asiangalore.com/*
// @match        https://www.assoass.com/*
// @match        https://www.bb-pornvideos.com/*
// @match        https://www.bigcockxxx.com/*
// @match        https://www.biporn.com/*
// @match        https://www.cartoonpornvideos.com/*
// @match        https://www.dinotube.com/*
// @match        https://www.ebonygalore.com/*
// @match        https://www.el-ladies.com/*
// @match        https://www.forhertube.com/*
// @match        https://www.fucd.com/*
// @match        https://www.fullpornvideos.com/*
// @match        https://www.fuq.com/*
// @match        https://www.fux.com/*
// @match        https://www.fuqpremium.com/*
// @match        https://www.gaymaletube.com/*
// @match        https://www.gotporn.com/*
// @match        https://www.hentaigalore.com/*
// @match        https://www.homemadegalore.com/*
// @match        https://www.ixxx.com/*
// @match        https://www.latingalore.com/*
// @match        https://www.lesbianpornvideos.com/*
// @match        https://www.lobstertube.com/*
// @match        https://www.lupoporno.com/*
// @match        https://www.maturetube.com/*
// @match        https://www.melonstube.com/*
// @match        https://www.metaporn.com/*
// @match        https://www.modelgalore.com/*
// @match        https://www.newporno.com/*
// @match        https://www.pornhd.com/*
// @match        https://www.pornmd.com/*
// @match        https://www.porntv.com/*
// @match        https://www.porzo.com/*
// @match        https://www.qorno.com/*
// @match        https://www.sambaporno.com/*
// @match        https://www.shortporn.com/*
// @match        https://www.stocking-tease.com/*
// @match        https://www.tgtube.com/*
// @match        https://www.tiava.com/*
// @match        https://www.toroporno.com/*
// @match        https://www.tubebdsm.com/*
// @match        https://www.tubegalore.com/*
// @match        https://www.tubeporn.com/*
// @match        https://www.tubepornstars.com/*
// @match        https://www.vrxxx.com/*
// @match        https://www.xxxmilfs.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562124/PornTube%20Helper%20%E2%80%94%20Free%20Filter%20%2B%20Faphouse%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/562124/PornTube%20Helper%20%E2%80%94%20Free%20Filter%20%2B%20Faphouse%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* -------------------------
       1) Force ?pricing=free
    -------------------------- */
    try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('pricing') !== 'free') {
            url.searchParams.set('pricing', 'free');
            window.location.replace(url.toString());
            return; // Stop further execution until redirect happens
        }
    } catch (e) {
        console.error('Pricing redirect failed:', e);
    }

    /* -------------------------
       2) Remove "Faphouse" cards
    -------------------------- */
    const selector = "div.space-y-1.block.relative.group.sub.card";

    function removeFaphouse() {
        document.querySelectorAll(selector).forEach(el => {
            if (el.textContent.toLowerCase().includes("faphouse")) {
                el.remove();
            }
        });
    }

    // Run when DOM ready
    document.addEventListener("DOMContentLoaded", removeFaphouse);

    // Watch for dynamically added elements
    const observer = new MutationObserver(removeFaphouse);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();