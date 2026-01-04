// ==UserScript==
// @name         Revert StackOverflow Comment Dates
// @namespace    socuul.revert_stackoverflow_comment_dates
// @version      0.1
// @description  Restores full "Month Day, Year" text for comments
// @author       SoCuul
// @license      MIT
// @match        https://stackoverflow.com/*
// @match        https://*.stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558959/Revert%20StackOverflow%20Comment%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/558959/Revert%20StackOverflow%20Comment%20Dates.meta.js
// ==/UserScript==

(function() {

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }

    const modifyElement = (el, time) => {
        const commentDate = new Date(time)
        if (isNaN(commentDate)) return

        const dateString = commentDate.toLocaleDateString(undefined, dateOptions)
        el.innerText = dateString

        el.classList.add('reverted-time')
    }

    const observerOptions = { subtree: true, childList: true }
    const mObserver = new MutationObserver(function() {

        document.querySelectorAll('time.s-user-card--time:not(.reverted-time)')
            .forEach(el => modifyElement(el, el?.title))

        document.querySelectorAll('a.comment-link > .relativetime-clean:not(.reverted-time)')
            .forEach(el => modifyElement(el, el?.title?.split(',', 1)))

    })

    mObserver.observe(document, observerOptions)

})();