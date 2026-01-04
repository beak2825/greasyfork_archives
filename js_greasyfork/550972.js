// ==UserScript==
// @name            YT: Expand Comments(L2)
// @namespace       https://greasyfork.org/zh-TW/users/4839
// @version         1.0.0
// @description     Adds a "Expand all" button to video comments which expands every comment and replies - no more clicking "Read more".
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @match           https://www.youtube.com/*
// @require https://update.greasyfork.org/scripts/550956/1668280/Library%3A%20onElementReady%20ES7.js
// @run-at          document-end
// @grant           GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550972/YT%3A%20Expand%20Comments%28L2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550972/YT%3A%20Expand%20Comments%28L2%29.meta.js
// ==/UserScript==


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

        .expand-all-comments-button2
        {
            padding: 0;
            align-self: start;
            margin: 0;
            font-size:20px;
            background: red;
        }

    `)
}

/**
 * Set global busy mode
 * @param {Boolean} isbusy - Yes/No
 * @param {String=} selector - Contextual element selector
 */
let setbusy = (isbusy, selector = 'ytd-comments') => {
    // console.debug('setbusy', 'isbusy:', isbusy)

    let element = document.querySelector(selector)

    if (isbusy === true) {
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
let getbuttonElement = () => document.querySelector('.expand-all-comments-button2')

/**
 * Get toggle state2
 * @returns {Boolean} - On/Off
 */
//let gettoggleState2 = () => Boolean(getbuttonElement() && getbuttonElement().checked)

/**
 * Expand all comments
 */
let expandAllComments = () => {
    console.debug('expandAllComments')

    // Look for "View X replies" buttons in comment section
    onElementReady('ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer', false, (buttonElement) => {

        //  Click button
        //buttonElement.click()
    })
  //ExpandNestedReplies顯示更多回復
  /*
  onElementReady('ytd-comment-replies-renderer ytd-continuation-item-renderer button', false, (buttonElement) => {

        //  Click button
        buttonElement.click()
    })
    */
    // Look for "Read More" buttons in comment section顯示完整內容(ytd-comments刪除開頭，才能支援兼容post)
    onElementReady('tp-yt-paper-button.ytd-expander#more:not([hidden])', false, (buttonElement) => {

        //  Click button
        buttonElement.click()
    })
  //"less"隱藏"顯示部分內容"(ytd-comments刪除開頭，才能支援兼容post)
  onElementReady('tp-yt-paper-button.ytd-expander#less:not([hidden])', false, (buttonElement) => {

        //  Click button
        buttonElement.style.display = 'none';
    })
}


/**
 * Check if the toggle is enabled, if yes, start expanding
 */
let tryexpandAllComments = () => {
  expandAllComments()


    // Abort if toggle disabled

}


/**
 * Render button: 'Expand all Comments'
 * @param {Element} element - Container element
 */
let renderButton = (element) => {
    console.debug('renderButton')

    const buttonElement = document.createElement('tp-yt-paper-checkbox')
    buttonElement.className = 'expand-all-comments-button2'
    buttonElement.innerHTML = `
    <div id="icon-label" class="yt-dropdown-menu">
        B
    </div>
    `
    // Add button
    element.appendChild(buttonElement)

    // Handle button toggle
    buttonElement.onchange = tryexpandAllComments
  //預設執行
buttonElement.click()
    // Status
    console.debug('rendered button')
}

let init = () => {
    console.info('init')
    // Add Stylesheet
    injectStylesheet()

    // Wait for menu container
    onElementReady('ytd-comments ytd-comments-header-renderer > #title', false, (element) => {
        console.debug('onElementReady', 'ytd-comments ytd-comments-header-renderer > #title')

        // Render button
        renderButton(element)
    })
}

init()
//監聽LIVE事件才啟動
/*
window.addEventListener('yt-navigate-finish', () => {
    init()
})
*/