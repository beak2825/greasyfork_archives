// ==UserScript==
// @name Updated RedGifs Downloader
// @namespace hltl.scripts
// @match http*://*.redgifs.com/*
// @match http*://redgifs.com/*
// @run-at document-idle
// @grant none
// @version 1.8
// @author hunkyburrito & hltl
// @description Creates a sidebar button to download the currently playing gif in the currently selected quality.
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554459/Updated%20RedGifs%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/554459/Updated%20RedGifs%20Downloader.meta.js
// ==/UserScript==

// Object to store cached GIF information
const gifCache = {};
const maxCacheSize = 30

async function getGif(gifId) {
    // Check if the GIF information exists in the cache
    if (gifCache[gifId]) {
        return gifCache[gifId]; // Return cached data if available
    }
    else if(Object.keys(gifCache).length >= maxCacheSize){
      const firstKey = Object.keys(gifCache)[0];
      delete gifCache[firstKey];
    }

    // If not cached, fetch GIF info from the API
    const token = JSON.parse(localStorage.getItem('session_data')).token;
    let gifReq = await fetch(`https://api.redgifs.com/v2/gifs/${gifId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    let gifInfo = await gifReq.json();

    // Cache the fetched GIF information
    gifCache[gifId] = gifInfo;

    return gifInfo;
}

async function download(gifInfo) {
    let quality = localStorage.getItem('gifQuality');
    if (quality) {
        quality = quality.replace(/^"|"$/g, ''); // remove double quotes (i.e. '"hd"' => "hd")
    }
    let dlLink = gifInfo.gif.urls[quality ? quality : 'sd'];

    // Fetch the video data
    let response = await fetch(dlLink);
    let data = await response.blob();

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = `${gifInfo.gif.id}.mp4`;
    link.setAttribute('class', "download");

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

async function addButton (target, gifInfo) {
  // Check if the download button already exists for this GIF
  if (document.querySelector(`#DL_Btn_${gifInfo.gif.id}`)) {
      return;
  }

  // Sidebar item and button
  let sb_itm = document.createElement('li')
  sb_itm.setAttribute('class', 'sideBarItem')
  let dl_btn = document.createElement('button')
  dl_btn.setAttribute('class', 'DL_Btn')
  dl_btn.setAttribute('id', `DL_Btn_${gifInfo.gif.id}`); // Unique ID for each button

  // Button icon
  let dl_icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  dl_icon.setAttribute('width', '24')
  dl_icon.setAttribute('height', '24')
  dl_icon.setAttribute('viewBox', '0 0 24 24')
  dl_icon.setAttribute('fill', 'white')
  dl_icon.innerHTML = "<path d='M11.29 15.71a1 1 0 0 0 .33.21 1 1 0 0 0 .76 0 1 1 0 0 0 .33-.21l3-3a1 1 0 0 0-1.42-1.42L13 12.59V9a1 1 0 0 0-2 0v3.59l-1.29-1.3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42zM12 22A10 10 0 1 0 2 12a10 10 0 0 0 10 10zm0-18a8 8 0 1 1-8 8 8 8 0 0 1 8-8z' stroke='currentColor' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'></path>"

  dl_btn.appendChild(dl_icon)
  sb_itm.appendChild(dl_btn)

  let parent_node = await waitForElm('.sideBar', target)
  let sibling_node = await waitForElm('.SoundButton', target)

  // Copy styles of other button
  const styles = window.getComputedStyle(sibling_node);
  let cssText = styles.cssText;
  if (!cssText) {
      cssText = Array.from(styles).reduce((str, property) => {
          return `${str}${property}:${styles.getPropertyValue(property)};`;
      }, '');
  }
  dl_btn.style.cssText = cssText;

  // Insert button into sidebar
  sibling_node = sibling_node.parentNode
  parent_node.insertBefore(sb_itm, sibling_node.nextSibling)

  dl_btn.addEventListener('click', function(){ download(gifInfo) } )
}

function waitForElm(selector, target=document) {
    return new Promise(resolve => {
        if (target.querySelector(selector)) {
            return resolve(target.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (target.querySelector(selector)) {
                observer.disconnect();
                resolve(target.querySelector(selector));
            }
        });

        observer.observe(target.body, {
            childList: true,
            subtree: true
        });
    });
}

async function init() {
    let activeGif = null;

    while (true) {
        // Wait for an active GIF element
        const gif = await waitForElm('.GifPreview_isActive');

        // If the new active GIF is different from the previous one, update the button
        if (gif !== activeGif) {
            activeGif = gif;
            const info = await getGif(gif.getAttribute("data-feed-item-id"));
            addButton(gif, info);
        }

        // Introduce a delay before the next check (e.g., 100 milliseconds)
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

init();