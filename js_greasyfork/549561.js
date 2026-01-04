// ==UserScript==
// @name           Show duplicate recordings on Musicbrainz
// @description    Shows duplicate recordings on Musicbrainz release and recordings pages
// @author         belewiw366
// @namespace      belewiw366
// @version        2025.09.14
// @license        MIT
// @match          *://*.musicbrainz.org/release/*
// @exclude-match  *://*.musicbrainz.org/release/*/*
// @match          *://*.musicbrainz.org/artist/*/recordings*
// @require        https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js#sha256-SJaoj5aTpQnhG+35hrJ/HLgc3x98mUUXoApz8zlFTeY=
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/549561/Show%20duplicate%20recordings%20on%20Musicbrainz.user.js
// @updateURL https://update.greasyfork.org/scripts/549561/Show%20duplicate%20recordings%20on%20Musicbrainz.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    const acoustid_apikey = 'U9ylkdBDYe';
    function getapikey() {
        return acoustid_apikey;
    }

    class RateLimiter {
        constructor(requests, timespan) {
            this.maxrequests = requests;
            this.timespan = timespan;
            this.tokens = 1;
            this.lastrefill = Date.now();
        }
        async getToken() {
            const elapsed = Date.now() - this.lastrefill;
            if (elapsed > 0) {
                const newtokens = Math.floor(elapsed / this.timespan * this.maxrequests);
                if (newtokens > 0) {
                    this.tokens = Math.min(this.maxrequests, this.tokens + newtokens);
                    this.lastrefill = Date.now();
                }
            }
            if (this.tokens > 0) {
                this.tokens--;
                return true;
            } else {
                const delay = this.timespan / this.maxrequests;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getToken();
            }
        }
        async request(url) {
            await this.getToken();
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: response => { console.debug(response.responseText); resolve(JSON.parse(response.responseText)) },
                    onerror: reject
                });
            });
        }
    }
    const limiter = new RateLimiter(4, 1333);

    function getTrackid(id) {
        const url = `https://api.acoustid.org/v2/track/list_by_mbid?mbid=${id}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: response => { console.debug(response.responseText); resolve(JSON.parse(response.responseText)) },
                onerror: reject
            });
        });
    }
    function getRecordings(id) {
        return limiter.request('https://api.acoustid.org/v2/lookup?client=' + getapikey() + `&meta=recordingids&trackid=${id}`);
    }

    async function processLink(link) {
        const parts = link.href.split('/');
        let mbid = "";
        if (parts[3] == 'recording') {
            mbid = parts[4];
            try {
                const trackids = await getTrackid(mbid);
                const recordings = [];
                for (const track of trackids.tracks) {
                    const result = await getRecordings(track.id);
                    recordings.push(result);
                }

                for (const recording of recordings) {
                    for (const recs of recording.results) {
                        recs.count = 0;
                        for (const rec of recs.recordings) {
                            const response = await fetch("https://musicbrainz.org/recording/" + rec.id, { method: 'HEAD', redirect: 'manual' });
                            if (response.status == 200) {
                                recs.count += 1;
                            }
                        }
                    }
                }
                updateElement(link, recordings);
            } catch (error) {
                console.error(error);
            }
        }
    }

    function updateElement(link, recordings) {
        for (const recording of recordings) {
            const rec = recording.results[0];
            let a = document.createElement("a");
            a.style.float = "right";
            a.href = '//acoustid.org/track/' + rec.id;
            a.target = '_blank';
            let rot = "180";
            if (rec.count > 1) {
                rot = "0";
            }
            a.innerHTML = `<img style="filter: hue-rotate(${rot}deg) saturate(200%)" src="//acoustid.org/static/acoustid-wave-12.png" title="${rec.id}" alt="AcoustID" />`
            link.parentNode.insertBefore(a, link.nextSibling);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                observer.unobserve(element);
                processLink(element);
            }
        });
    });
    waitForKeyElements('.tbl tr td a', (element) => {
        observer.observe(element);
    }, false);
})();
