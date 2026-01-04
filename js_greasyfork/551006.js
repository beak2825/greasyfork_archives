// ==UserScript==
// @name         Show comment number on Discuss button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  You no longer need to click to know whether a video on submeta.io has been commented, as the comment count is displayed right on the Discuss button
// @match        https://submeta.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=submeta.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551006/Show%20comment%20number%20on%20Discuss%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/551006/Show%20comment%20number%20on%20Discuss%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function log(obj){
        return
        console.log(obj);
    }

    class Mutex {
        constructor() {
            this.isLocked = false;
            this.waitingResolvers = [];
        }

        async lock() {
            log('locking mutex')
            if (this.isLocked) {
                // wait until released
                log('mutex already locked, store job in queue...')
                await new Promise(resolve => this.waitingResolvers.push(resolve));
            }
            this.isLocked = true;
        }

        unlock() {
            log('unlocking mutex')
            this.isLocked = false;
            this.waitingResolvers.forEach(resolve => resolve());
            this.waitingResolvers = [];
        }

        discardQueue() {
            log('discarding mutex queue')
            this.waitingResolvers = [];
        }

        async runExclusive(fn) {
            await this.lock();
            try {
                return await fn();
            } finally {
                this.unlock();
            }
        }
    }


    //let sleepDuration = 2000;

    const mutex = new Mutex();
    async function launch() {
        await mutex.runExclusive(async () => {
            const a = document.querySelector('a[href^="/discussion"]');

            if (!a || !a.href)
            {
                log('Link not found on ' + a);
                return
            }

            // optional: only handle same-origin links
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) {
                log(url.origin + ' !== ' + location.origin)
                return
            };

            // const dur = sleepDuration
            // sleepDuration += 2000
            // log('Sleeping ' + dur +'ms')
            // await new Promise(r => setTimeout(r, dur));
            // log('Done sleeping ' + dur +'ms')

            let discussSpans = Array.from(a.querySelectorAll('span')).filter(it=>it.textContent === 'Discuss')

            if (discussSpans.length === 0) {
                log('Discuss button does not exist')
                return
            }

            // fetch the target page (include credentials for cookies)

            log('Fetching Discuss link: ' + a.href);
            const res = await fetch(url.href, { credentials: 'include' });
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

            const html = await res.text();

            // parse HTML into a Document
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const scriptBlock = doc.querySelector('script#__NEXT_DATA__')

            const data = JSON.parse(scriptBlock.textContent)
            const commentCount = countComments(data.props.pageProps.discussion)

            discussSpans = Array.from(a.querySelectorAll('span')).filter(it=>it.textContent === 'Discuss')

            if (discussSpans.length === 0) {
                log('Discuss button does not exist')
                return
            }

            for (const elt of discussSpans){
                elt.textContent += ' ('+commentCount+')'
                log('Renaming to ' + elt.textContent)
                //sleepDuration = 2000
            }

            mutex.discardQueue()
        });
    }

    function countComments(comments) {
        if (!comments || comments.length === 0) return 0;

        return comments.reduce((total, comment) => {
            return total + 1 + countComments(comment.replies);
        }, 0);
    }

    // example handler - replace with your logic
    function handleFetchedDoc(doc, href, linkElement) {
        // e.g. find a node, extract metadata, etc.
        const title = doc.querySelector('title')?.textContent || '(no title)';
        const someNode = doc.querySelector('.some-class');
        console.log('Inspected', href, { title, someNodeExists: !!someNode });

        // If you want to show the result in-page instead of console:
        // showPreviewModal(title, doc.querySelector('#main')?.innerHTML || '(no main)');
    }

    window.addEventListener('locationchange', () => {
        console.log('SPA navigation detected. New URL:', location.href);
    });

    // Initial run
    launch();

    // Observe dynamically added inputs
    const observer = new MutationObserver(() => launch());
    observer.observe(document.body, { childList: true, subtree: true });
})();
