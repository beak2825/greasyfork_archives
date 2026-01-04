// ==UserScript==
// @name            Library: onElementReady ES7
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/ee7a6b80315148ad1fb6847e72a22313/raw/
// @version         0.8.1
// @description     Detect any new DOM Element by its CSS Selector, then trigger a function. Includes Promise- & Callback interface. Based on ES6 MutationObserver. Ships legacy waitForKeyElements interface, too.
// @author          sidneys
// @icon            https://i.imgur.com/nmbtzlX.png
// @match           *://*/*
// ==/UserScript==
/**
 * ESLint
 * @exports
 */
/* exported onElementReady, waitForKeyElements */
/**
 * @private
 *
 * Query for new DOM nodes matching a specified selector.
 *
 * @param {String} selector - CSS Selector
 * @param {function=} callback - Callback
 */
let queryForElements = (selector, callback) => {
    // console.debug('queryForElements', 'selector:', selector)
    // Remember already-found elements via this attribute
    const attributeName = 'was-queried2'
    // Search for elements by selector
    let elementList = document.querySelectorAll(selector) || []
    elementList.forEach((element) => {
        if (element.hasAttribute(attributeName)) { return }
        element.setAttribute(attributeName, 'true')
        callback(element)
    })
}
/**
 * @public
 *
 * Wait for Elements with a given CSS selector to enter the DOM.
 * Returns a Promise resolving with new Elements, and triggers a callback for every Element.
 *
 * @param {String} selector - CSS Selector
 * @param {Boolean=} findOnce - Stop querying after first successful pass
 * @param {function=} callback - Callback with Element
 * @returns {Promise<Element>} - Resolves with Element
 */
let onElementReady = (selector, findOnce = false, callback = () => {}) => {
    // console.debug('onElementReady', 'findOnce:', findOnce)
    return new Promise((resolve) => {
        // Initial Query
        queryForElements(selector, (element) => {
            resolve(element)
            callback(element)
        })
        // Continuous Query
        const observer = new MutationObserver(() => {
            // DOM Changes detected
            queryForElements(selector, (element) => {
                resolve(element)
                callback(element)
            })
            if (findOnce) { observer.disconnect() }
        })
        // Observe DOM Changes
        observer.observe(document.documentElement, {
            attributes: false,
            childList: true,
            subtree: true
        })
    })
}
/**
 * @public
 * @deprecated
 *
 * waitForKeyElements Polyfill
 *
 * @param {String} selector - CSS selector of elements to search / monitor ('.comment')
 * @param {function} callback - Callback executed on element detection (called with element as argument)
 * @param {Boolean=} findOnce - Stop lookup after the last currently available element has been found
 * @returns {Promise<Element>} - Element
 */
let waitForKeyElements = (selector, callback, findOnce) => onElementReady(selector, findOnce, callback)