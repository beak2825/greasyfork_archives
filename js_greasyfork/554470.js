// ==UserScript==
// @name         Xhamster Auto Clean Boost - v.2.06
// @namespace    http://tampermonkey.net/
// @version      2.07
// @description  Auto Clean Playlist by deleting Unavailable Videos after clicking on its button and Count the number of deleting items. "Auto Clean" button became red when there is something to delete
// @icon         https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @author       janvier57
// @match        https://xhamster.com/my/favorites/videos/*
// @match        https://xhvid.com/my/favorites/videos/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554470/Xhamster%20Auto%20Clean%20Boost%20-%20v206.user.js
// @updateURL https://update.greasyfork.org/scripts/554470/Xhamster%20Auto%20Clean%20Boost%20-%20v206.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DELAY = 1000; // 1 second
    const PAGINATION_DELAY = 1000; // 5 seconds

    // Selectors
    const deletedVideoSelector = '[data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text)';
    const privateVideoSelectors = [
        '[data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text, .xh-icon.lock)',
        '[data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text, .xh-icon.photo-error2)' ,
        '[data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text, .xh-icon.lock-vb)'
    ];
    const paginationSelector = 'nav.desktop-pagination[data-role="pagination-cleaner"]';
    //const nextButtonSelector = `${paginationSelector} .prev-next-list-button:nth-child(2)`;
    // nav[class^="desktop-pagination pagination-"][data-role="pagination-cleaner"] .prev-next-list .page-list-wrapper .page-list-container ol.page-list li:has( .page-button-link--active) + li button.page-button-link
    const nextButtonSelector = `${paginationSelector} .prev-next-list .page-list-wrapper .page-list-container ol.page-list li:has(.page-button-link--active) + li .page-button-link`;
    GM_addStyle(`
        .xhamster-auto-clean-button {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: linear-gradient(to bottom, #33cc33, #009900);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        }
        .xhamster-auto-clean-button.has-items-to-delete {
            background: linear-gradient(to bottom, #ff0000, #cc0000);
        }
        .dialog-desktop-container__backing,
        .dialog-mobile-container__backing {
             background-color: transparent;
}
/* XHAM GM AUTO CLEAN BOOST - PAGINATION TEST */

.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .desktop-pagination {
	position: absolute ;
    display: flex;
    justify-content: center;
	top: 1vh ;
	right:  15% !important;
	margin:  0 0 0 0 ;
}
/* SUPP */
.user-page.favorites-page .desktop-dialog.desktop-dialog--small.desktop-dialog--fixed-footer:has(.desktop-dialog__footer [class*="color-brand-"]) .search-form ,
[data-role="promo-messages-wrapper"] {
    display: none  !important;
}
/* SMALL THUMBNAIL */
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) {
    width: 100%;
	min-width: 100% ;
	max-width: 100% ;
    margin: 0 0 0 0 ;
    min-height: 100%;
}
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .width-wrap {
	width: 100%;
	min-width: 100% ;
	max-width: 100% ;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item {
	width: 6%;
/*border: 1px solid aqua  !important;*/
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item .thumb-image-container {
        height: 5vh;
        width: 100%;
 }
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item .thumb-image-container .thumb-image-container__image {
    height: 100%;
    object-fit: contain;
    width: 100%;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item .video-thumb-info .video-thumb__trigger +.video-thumb-info__name,
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item .video-thumb-info .xh-dropdown+.video-thumb-info__name {
	display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
	padding-right: 20px;
	font-size: 12px;
    line-height: 12px;
}
/* DELETED */
.favorites-nav-container:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) + .content-column [data-role="favorites-video-collections"] .thumb-list.thumb-list--sidebar .thumb-list__item:has(.ist-trigger.disabled) .thumb-image-container__status.status {
	top: 34%;
	background-color: red ;
}

/* VIDEO - LEFT FAV NAV CONTAINER */
.user-page.user-videos-page.my-uploads-page .user-content-section .user-content-body:has(.favorites-nav-container) .favorites-nav-container ,
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .favorites-nav-container:has([class*="link-"],[class*="isActive-"]) {
	position: absolute  !important;
    display: inline-block ;
    width: 10%;
	margin: 4vh 0 0px 0 ;
	left: -10%;
	z-index: 5000000;
background-color: red ;
}
.user-page.user-videos-page.my-uploads-page .user-content-section .user-content-body:has(.favorites-nav-container) .favorites-nav-container:before ,
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .favorites-nav-container:has([class*="link-"],[class*="isActive-"]):before {
	content: "❤️";
	position: absolute;
    display: inline-block ;
    width: 10% ;
	margin: 0vh 0 0px 0 ;
	right: -10% ;
	padding: 5px 0;
	border-radius: 0 5px 5px 0;
	font-size: 13px;
	z-index: 5000000 !important;
background-color: red ;
}
/* HOVER */
.user-page.user-videos-page.my-uploads-page .user-content-section .user-content-body:has(.favorites-nav-container) .favorites-nav-container:focus-within ,
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .favorites-nav-container:has([class*="link-"],[class*="isActive-"]):focus-within ,

.user-page.user-videos-page.my-uploads-page .user-content-section .user-content-body:has(.favorites-nav-container) .favorites-nav-container:hover ,
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .favorites-nav-container:has([class*="link-"],[class*="isActive-"]):hover {
	position: absolute;
    display: inline-block ;
    width: 10%;
	margin: 4vh 0 0px 0 ;
	left: 0%;
	z-index: 5000000;
background-color: green ;
}
.user-page.user-videos-page.my-uploads-page .user-content-section .user-content-body:has(.favorites-nav-container) .favorites-nav-container:hover:before ,
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"]) .favorites-nav-container:has([class*="link-"],[class*="isActive-"]):hover:before {
	background-color: green ;
}


/* VIDEO PLAYLIST MENU */
.main-wrap:has([class*="link-"],[class*="isActive-"], [class^="subnav-"])  .favorites-nav-container:has([class*="link-"],[class*="isActive-"]) ul[class^="subnav-"] {
	height: 40vh;
	width: 100%;
    padding: 0 0 0 0 ;
	overflow: hidden auto !important;
background-color: #222 ;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"]) ul[class^="subnav-"] li [class^="body-"] {
    display: inline-block ;
    width: 100%;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"]) ul[class^="subnav-"] li [class^="body-"] a {
    display: inline-block ;
    width: 100%;
	margin: 0 0 -5px 0 ;
background-color: brown ;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"]) ul[class^="subnav-"] li [class^="body-"] a span {
    display: inline-block ;
    width: 100%;
	margin: 0 0 0px 0 ;
	white-space: pre-wrap ;
	color: silver ;
background-color: #075b07 ;
}
.favorites-nav-container:has([class*="link-"],[class*="isActive-"]) ul[class^="subnav-"] li [class^="body-"] a:visited span {
    display: inline-block ;
    width: 100%;
	margin: 0 0 0px 0 ;
	white-space: pre-wrap ;
	color: silver ;
background-color: #931c1c ;
}
    `);
const observer = new MutationObserver(() => {
    const paginationButtons = document.querySelectorAll(`${paginationSelector} .prev-next-list .page-list-wrapper .page-list-container ol.page-list li:has(.page-button-link--active) + li .page-button-link`);

    if (paginationButtons.length > 0) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    checkForItemsToDelete();
                }, 100); // wait for 1 second
            });
        });

        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
    let deleteCount = 0;

    // Function to delete videos
    async function deleteVideos(selector, menuSelector, deleteButtonSelector, saveSelector) {
        const videos = document.querySelectorAll(selector);
        if (videos.length === 0) {
            return 0;
        }

        let deleted = 0;
        for (const video of videos) {
            const menu = video.querySelector(menuSelector);
            if (menu) {
                menu.click();
                await new Promise(resolve => setTimeout(resolve, 100)); // wait for 1 second
                const deleteButton = video.querySelector(deleteButtonSelector);
                if (deleteButton) {
                    deleteButton.click();
                    await new Promise(resolve => setTimeout(resolve, 100)); // wait for 1 second
                    const saveButton = document.querySelector(saveSelector);
                    if (saveButton) {
                        saveButton.click();
                        deleted++;
                    }
                }
            }
        }
        return deleted;
    }

    // Function to auto clean
    let processing = false;
    async function autoClean() {
    if (processing) return;
    processing = true;

    console.log('Auto Clean button clicked');

    let deleted = 0;
    deleted += await deleteVideos(deletedVideoSelector, '.video-thumb__trigger', '.dropdown.position-right.v-position-down.open .xh-dropdown-item', '.desktop-dialog.desktop-dialog--small.desktop-dialog--fixed-footer:has(.desktop-dialog__header-new) button[class*="color-brand-"]');
    for (const selector of privateVideoSelectors) {
        deleted += await deleteVideos(selector, '.video-thumb__trigger', '.xh-dropdown:has(.video-thumb__trigger) span', '.desktop-dialog.desktop-dialog--small.desktop-dialog--fixed-footer:has(.desktop-dialog__header-new) button[class*="color-brand-"]');
    }

    deleteCount += deleted;
    const autoCleanButton = document.querySelector('.xhamster-auto-clean-button');
    autoCleanButton.textContent = `Auto Clean (${deleteCount})`;

    // Check if there are items to delete
    checkForItemsToDelete();

    // Check for pagination and proceed
    const pagination = document.querySelector(paginationSelector);
    if (pagination) {
        const nextButton = document.querySelector(nextButtonSelector);
        if (nextButton) {
            console.log('Checking next page...');
            nextButton.click();
            setTimeout(() => {
                processing = false;
                autoClean();
            }, PAGINATION_DELAY);
        } else {
            console.log('No more pages to check.');
            processing = false;
        }
    } else {
        console.log('Pagination not found.');
        processing = false;
    }
}

// Add Auto Clean button
const targetElement = document.querySelector('body');
if (targetElement) {
    setTimeout(() => {
        const autoCleanButton = document.createElement('button');
        autoCleanButton.textContent = 'Auto Clean (0)';
        autoCleanButton.className = 'xhamster-auto-clean-button';
        autoCleanButton.onclick = autoClean;
        targetElement.appendChild(autoCleanButton);

        console.log('Auto Clean button added');

        // Call checkForItemsToDelete after adding the button
        checkForItemsToDelete();

        // Create a MutationObserver to observe changes to the page
        const observer = new MutationObserver(() => {
            checkForItemsToDelete();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, DELAY); // Wait for 1 second before adding the button
}


// Function to check for items to delete
function checkForItemsToDelete() {
    console.log('Checking for items to delete...');
    const autoCleanButton = document.querySelector('.xhamster-auto-clean-button');
    if (!autoCleanButton) {
        console.log('Auto clean button not found. Retrying in 1 second...');
        setTimeout(checkForItemsToDelete, 1000);
        return;
    }

    const videosToDelete = document.querySelectorAll(deletedVideoSelector);
    console.log(`Found ${videosToDelete.length} videos to delete using selector: ${deletedVideoSelector}`);

    let privateVideosToDelete = 0;
    for (const selector of privateVideoSelectors) {
        const privateVideos = document.querySelectorAll(selector);
        console.log(`Found ${privateVideos.length} private videos to delete using selector: ${selector}`);
        privateVideosToDelete += privateVideos.length;
    }

    const hasItemsToDelete = videosToDelete.length + privateVideosToDelete > 0;

    console.log(`Total items to delete: ${videosToDelete.length + privateVideosToDelete}`);

    if (hasItemsToDelete) {
        console.log('Changing button color to red');
        autoCleanButton.classList.add('has-items-to-delete');
        autoCleanButton.style.background = 'linear-gradient(to bottom, #ff0000, #cc0000)';
    } else {
        console.log('Changing button color to green');
        autoCleanButton.classList.remove('has-items-to-delete');
        autoCleanButton.style.background = 'linear-gradient(to bottom, #33cc33, #009900)';
    }
}



    // Run checkForItemsToDelete on page changes
    document.addEventListener('DOMContentLoaded', function() {
    checkForItemsToDelete();
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});
    setTimeout(() => {
        checkForItemsToDelete();
    }, 100); // Call checkForItemsToDelete after 2 seconds

    console.log('Userscript loaded');
})();