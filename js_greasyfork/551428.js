// ==UserScript==
// @name            YT:Expand Comments(L)
// @name:zh-TW           YT展開貼文及評論回復完整內容
// @namespace       https://greasyfork.org/users/4839
// @homepage        https://greasyfork.org/zh-TW/scripts/551428
// @version         4.8.1
// @description     Adds a "Expand all" button to video comments which expands every comment and replies - no more clicking "Read more".
// @description:zh-TW     評論上方增加勾選框，可一次展開所有貼文+評論+回復顯示完整內容(隱藏顯示較少內容)
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @noframes
// @match           https://www.youtube.com/watch*
// @match           https://www.youtube.com/post/*
// @run-at          document-end
// @grant           GM_addStyle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/551428/YT%3AExpand%20Comments%28L%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551428/YT%3AExpand%20Comments%28L%29.meta.js
// ==/UserScript==
//https://gist.githubusercontent.com/sidneys/6756166a781bd76b97eeeda9fb0bc0c1/raw/
//將引用js直接合併為一個腳本
/* global Debug, onElementReady */

/**
 * ESLint
 * @global
 */
Debug = false


/**
 * Applicable URL paths
 * @default
 * @constant
 */
const urlPathList = [
    '/watch','/post/'
]


/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM_addStyle(`
        /* =======================================
           ELEMENTS
           ======================================= */

        /* Button: Expand all Comments
           --------------------------------------- */

        .expand-all-comments-button
        {
            padding: 0;
            align-self: start;
            margin: 0;
                    background: red;
            font-size:20px;

        }


        .expand-all-comments-button #checkboxLabel
        {
            padding-left: 0;
            display: inline-flex;
        }

        .busy .expand-all-comments-button #checkboxContainer,
        .busy .expand-all-comments-button #checkboxLabel
        {
            animation: var(--animation-busy-on);
        }

        /* Button: Expand all Comments
           Spinner
           --------------------------------------- */

        .expand-all-comments-button #checkboxLabel::after
        {
            background-size: 100%;
            background-repeat: no-repeat;
            height: var(--ytd-margin-4x, 26px);
            width: var(--ytd-margin-4x, 26px);
        }

        .expand-all-comments-button #checkboxLabel,
        .expand-all-comments-button #checkboxLabel::after
        {
            transition: filter 1000ms ease-in-out;
        }

        :not(.busy) .expand-all-comments-button #checkboxLabel::after
        {

            filter: opacity(0);
        }

        .busy .expand-all-comments-button #checkboxLabel::after
        {

            filter: opacity(1);
        }


        /* =======================================
           ANIMATIONS
           ======================================= */

        :root
        {
            --animation-busy-on: 'busy-on' 500ms ease-in-out 1000ms 1 normal forwards running;
        }

        @keyframes busy-on {
            from {
                pointer-events: none;
                cursor: default;
            }
            to {
                filter: saturate(0.1);
                color: hsla(0deg, 0%, 100%, 0.5);
            }
        }
    `)
}

/**
 * Set global busy mode
 * @param {Boolean} isBusy - Yes/No
 * @param {String=} selector - Contextual element selector
 */
let setBusy = (isBusy, selector = 'ytd-comments') => {
    // console.debug('setBusy', 'isBusy:', isBusy)

    let element = document.querySelector(selector)

    if (isBusy === true) {
        element.classList.add('busy')
        return
    } else {
        element.classList.remove('busy')
    }
}

/**
 * Get Button element
 * @returns {Boolean} - On/Off
 */
let getButtonElement = () => document.querySelector('.expand-all-comments-button')

/**
 * Get Toggle state
 * @returns {Boolean} - On/Off
 */
let getToggleState = () => Boolean(getButtonElement() && getButtonElement().checked)


/**
 * Expand all comments
 */
let expandAllComments = () => {
    console.debug('expandAllComments')

    // Look for "View X replies" buttons in comment section
    onElementReady('ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer', false, (buttonElement) => {
        // Abort if toggle disabled
        if (!getToggleState()) { return }

        /** @listens buttonElement:Event#click */
        // buttonElement.addEventListener('click', () => setBusy(false), { once: true, passive: true })

        // Busy = yes
        // setBusy(true)

        //  Click button
        buttonElement.click()
    })

    // Look for "Read More" buttons in comment section
    onElementReady('ytd-comments tp-yt-paper-button.ytd-expander#more:not([hidden])', false, (buttonElement) => {
        // Abort if toggle disabled
        if (!getToggleState()) { return }

        /** @listens buttonElement:Event#click */
        // buttonElement.addEventListener('click', () => setBusy(false), { once: true, passive: true })

        // Busy = yes
        // setBusy(true)

        //  Click button
        buttonElement.click()
    })
  //ExpandNestedReplies顯示更多回復

  onElementReady('ytd-comment-replies-renderer ytd-continuation-item-renderer button', false, (buttonElement) => {

        //  Click button
        buttonElement.click()
    })

  //"less"隱藏"顯示部分內容"(ytd-comments刪除開頭，才能支援兼容post)
  onElementReady('ytd-comments tp-yt-paper-button.ytd-expander#less:not([hidden])', false, (buttonElement) => {

        //  Click button
        buttonElement.style.display = 'none';
    })
}


/**
 * Check if the toggle is enabled, if yes, start expanding
 */
let tryExpandAllComments = () => {
    console.debug('tryExpandAllComments')

    const toggleState = getToggleState()

    console.debug('toggle state:', toggleState)

    // Abort if toggle disabled
    if (!toggleState) { return }

    expandAllComments()
}


/**
 * Render button: 'Expand all Comments'
 * @param {Element} element - Container element
 */
let renderButton = (element) => {
    console.debug('renderButton')

    const buttonElement = document.createElement('tp-yt-paper-checkbox')
    buttonElement.className = 'expand-all-comments-button'
    buttonElement.innerHTML = `
    <div id="icon-label" class="yt-dropdown-menu">
        V
    </div>
    `

    // Add button
    element.appendChild(buttonElement)

    // Handle button toggle
    buttonElement.onchange = tryExpandAllComments

    // Status
    console.debug('rendered button')
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Verify URL path
    if (!urlPathList.some(urlPath => window.location.pathname.startsWith(urlPath))) { return }

    // Add Stylesheet
    injectStylesheet()

    // Wait for menu container
    onElementReady('ytd-comments ytd-comments-header-renderer > #title', false, (element) => {
        console.debug('onElementReady', 'ytd-comments ytd-comments-header-renderer > #title')

        // Render button
        renderButton(element)
    })

    // // Wait for variable section container
    // onElementReady('ytd-item-section-renderer#sections.style-scope.ytd-comments > #contents', false, (element) => {
    //     console.debug('onElementReady', 'element:',  '#contents')
    //
    //     /**
    //      * YouTube: Detect "Load More" stuff
    //      * @listens ytd-item-section-rendere:Event#yt-load-next-continuation
    //      */
    //     element.parentElement.addEventListener('yt-load-next-continuation', (event) => {
    //         console.debug('ytd-item-section-renderer#yt-load-next-continuation')
    //
    //         const currentTarget = event.currentTarget
    //         const shownItems = currentTarget && currentTarget.__data && currentTarget.__data.shownItems || []
    //         const shownItemsCount = shownItems.length
    //
    //         // DEBUG
    //         // console.debug('currentTarget.__data:')
    //         // console.dir(currentTarget.__data)
    //
    //         // Probe whether this is still the initial item batch, if yes, skip
    //         if (shownItemsCount === 0) { return }
    //
    //         tryExpandAllComments()
    //     })
    // })
}

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
    const attributeName = 'was-queried'

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


/**
 * YouTube: Detect in-page navigation
 * @listens window:Event#yt-navigate-finish
 */
    document.addEventListener('yt-navigate-finish', () => {
    //console.debug('window#yt-navigate-finish')
    init()
})

    // Look for "Read More" buttons in comment section
onElementReady('tp-yt-paper-button.ytd-expander#more:not([hidden])', false, (buttonElement) => {

        //  Click button
        buttonElement.click()
    })
  //"less"隱藏"顯示部分內容"
onElementReady('tp-yt-paper-button.ytd-expander#less:not([hidden])', false, (buttonElement) => {

        //  Click button
        buttonElement.style.display = 'none';
    })