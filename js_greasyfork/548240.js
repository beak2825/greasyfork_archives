// ==UserScript==
// @name         GitLab Review Automove After View
// @namespace    https://github.com/rvoortman/gitlab-review-automove-after-view
// @version      1.0
// @description  Moves to the next file after marking the current one as viewed
// @author       Robbin Voortman
// @match        https://gitlab.com/*/-/merge_requests/*
// @license      MIT
// @homepage     https://github.com/rvoortman/gitlab-review-automove-after-view
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548240/GitLab%20Review%20Automove%20After%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/548240/GitLab%20Review%20Automove%20After%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // only on 'v' key
        if (e.key.toLowerCase() !== 'v') return;

        // ignore if typing in a field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // let GitLab handle the normal 'v' first
        setTimeout(() => {
            const nextBtn = document.querySelector('[data-testid="gl-pagination-next"]');
            if (nextBtn && !nextBtn.disabled) {
                nextBtn.click();
            }
        }, 50); // small delay so GitLab's own handler runs first
    }, true); // use capture to ensure we see it early but still allow default
})();
