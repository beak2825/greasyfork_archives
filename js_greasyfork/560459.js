// ==UserScript==
// @name        WGSM - PluginParty
// @author      WirlyWirly
// @version     0.8
// @namespace   https://github.com/WirlyWirly

// @match       https://windowsgsm.com/*

// @icon        https://windowsgsm.com/favicon.ico
// @description It's a plugin party! List all available WindowsGSM plugins on a single page and filter through them with a searchbar!

// @homepage    https://gist.github.com/WirlyWirly/fb6fce9864eb8d1701cb226b6f83cb45/

// @grant       GM_xmlhttpRequest

// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/560459/WGSM%20-%20PluginParty.user.js
// @updateURL https://update.greasyfork.org/scripts/560459/WGSM%20-%20PluginParty.meta.js
// ==/UserScript==

function pluginParty() {
    // The main pluginParty function; Load each plugins-page and then list all available plugins onto the current page
    
    let mainListElement = document.querySelector("main div.mx-auto")
    let navBarElement = mainListElement.querySelector("nav[aria-label='Page navigation']").parentElement

    // let pluginCount = mainListElement.childNodes[0].querySelector('span')
    let pluginCount = mainListElement.childNodes[0].querySelectorAll('span')[2].innerText
    mainListElement.childNodes[0].innerHTML = `<span class="font-semibold text-gray-900 dark:text-white"><a href="https://gist.github.com/WirlyWirly/fb6fce9864eb8d1701cb226b6f83cb45">PluginParty</a></span> [v${GM_info.script.version}] - Showing All <span class="font-semibold text-gray-900 dark:text-white">${pluginCount}</span> Plugins`

    // Clean the current page by removing all listed plugins
    mainListElement.querySelectorAll("a[target='_blank']").forEach((item) => item.remove())

    let pageElements = navBarElement.querySelectorAll("li a")
    for (let element of pageElements) {
        // Create a placeholder element so that page results are displayed in-order

        let pageNumber = element.innerText
        let placeholder = document.createElement('div')
        placeholder.id = `placeholder${pageNumber}`

        mainListElement.insertBefore(placeholder, navBarElement)
    }

    for (let element of pageElements) {
        // Asychronous: For each page, get and append its list of plugins into the current page

        let placeholder = mainListElement.querySelector(`#placeholder${element.innerText}`)

        GM_xmlhttpRequest({
            'url': element.href,
            'method': 'GET',
            'onload': function(response) {
                let pageDOM = response.responseXML
                
                // The plugin elements for each page
                let pluginElements = pageDOM.querySelectorAll("main div.mx-auto a[target='_blank']")

                // Insert the plugins into the current page, above their corresponding placeholder
                for (let item of pluginElements) {
                    try{
                        // Remove 'WindowsGSM.' from the plugin title
                        let cleanedTitle = item.querySelector('h2').innerText.match(/^WindowsGSM\.(.*)/i, '')
                        item.querySelector('h2').innerText = cleanedTitle[1]
                    } catch(error) {
                        // console.log(error, item)
                    }

                    // Set the matching 'searchterm' attribute now so that searches are faster later
                    item.setAttribute('data-searchterm', item.querySelector('h2').innerText.toLowerCase())

                    mainListElement.insertBefore(item, placeholder)
                }

                // pluginCount.innerText++
                placeholder.remove()
            }
        })

    }

    // Remove the pageNavBar so that users don't constantly load dupe pages
    navBarElement.remove()

    // Create and inject the search bar above the plugins listing
    let searchBar = document.createElement('input')
    searchBar.id = 'searchBar'
    searchBar.type = 'text'
    searchBar.className = 'mb-4 w-full dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
    searchBar.placeholder = 'Search Plugins...'

    mainListElement.insertBefore(searchBar, mainListElement.childNodes[0].nextSibling)
    let pluginElements = searchBar.addEventListener('click', function() {
        // When the search bar is clicked into, collect a list of all available plugins
        return pluginElements = mainListElement.querySelectorAll("a[target='_blank']")
    })

    searchBar.addEventListener('keyup', function() {
        // When a key is entered, filter the results based on each plugin-elements 'searchterm' attribute
        let term = searchBar.value.toLowerCase()

        pluginElements.forEach((item) => {
            if (item.dataset['searchterm'].includes(term)) {
                item.hidden = false
            } else {
                item.hidden = true
            }
        })
    })
}

let observer = new MutationObserver(function(mutation) {
    // Code to run when page changes are detected

    if (document.URL.match(/.+windowsgsm-plugins.*/)) {
        // The current webpage IS the plugins page, so run pluginParty...
        pluginParty()
    } else {
        // The current webpage is NOT the plugins page, so do nothing...
        return
    }
})

// --------------- START ---------------

let target = document.querySelector('main')
let config = { childList: true }

if (document.URL.match(/.+windowsgsm-plugins.*/)) {
    // The current webpage IS the plugins page, so run pluginParty...
    pluginParty()
    observer.observe(target, config)
} else {
    // The current webpage is NOT the plugins page, so wait for changes...
    observer.observe(target, config)
}