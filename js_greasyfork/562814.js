// ==UserScript==
// @name 		MAM - SearchParty
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version     1.0

// @match 		https://www.myanonamouse.net/*

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://gist.github.com/WirlyWirly/79d7e3ea68b7a862233ee4d468996c83/

// @description It's a search party! More search bars for all the things that need searching!
// @grant 		none
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/562814/MAM%20-%20SearchParty.user.js
// @updateURL https://update.greasyfork.org/scripts/562814/MAM%20-%20SearchParty.meta.js
// ==/UserScript==

// ----------------------------------- UserScript --------------------------------------

// Each line is a query for which a search bar will be generated
// * The placeholder '__SEARCHTEXT__' will be replaced with the user input
// * Append a '#' before the url to open the search in a new tab

searchBars = {
    'Torrents': 'https://www.myanonamouse.net/tor/browse.php?action=search&tor[text]=__SEARCHTEXT__&[srchIn]=0',
    'AudioBooks': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[searchIn]=torrents&tor[cat][]=39&tor[cat][]=49&tor[cat][]=50&tor[cat][]=83&tor[cat][]=51&tor[cat][]=97&tor[cat][]=40&tor[cat][]=41&tor[cat][]=106&tor[cat][]=42&tor[cat][]=52&tor[cat][]=98&tor[cat][]=54&tor[cat][]=55&tor[cat][]=43&tor[cat][]=99&tor[cat][]=84&tor[cat][]=44&tor[cat][]=56&tor[cat][]=45&tor[cat][]=57&tor[cat][]=85&tor[cat][]=87&tor[cat][]=119&tor[cat][]=88&tor[cat][]=58&tor[cat][]=59&tor[cat][]=46&tor[cat][]=47&tor[cat][]=53&tor[cat][]=89&tor[cat][]=100&tor[cat][]=108&tor[cat][]=48&tor[cat][]=111&tor[cat][]=0',
    'eBooks': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[searchIn]=torrents&tor[cat][]=60&tor[cat][]=71&tor[cat][]=72&tor[cat][]=90&tor[cat][]=61&tor[cat][]=73&tor[cat][]=101&tor[cat][]=62&tor[cat][]=63&tor[cat][]=107&tor[cat][]=64&tor[cat][]=74&tor[cat][]=102&tor[cat][]=76&tor[cat][]=77&tor[cat][]=65&tor[cat][]=103&tor[cat][]=115&tor[cat][]=91&tor[cat][]=66&tor[cat][]=78&tor[cat][]=67&tor[cat][]=79&tor[cat][]=80&tor[cat][]=92&tor[cat][]=118&tor[cat][]=94&tor[cat][]=120&tor[cat][]=95&tor[cat][]=81&tor[cat][]=82&tor[cat][]=68&tor[cat][]=69&tor[cat][]=75&tor[cat][]=96&tor[cat][]=104&tor[cat][]=109&tor[cat][]=70&tor[cat][]=112&tor[cat][]=0',
    'Series': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[srchIn]=Series',
    'Comics': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[cat][]=61',
    'Audible': '#https://www.audible.com/search?keywords=__SEARCHTEXT__',
    'Goodreads': '#https://www.goodreads.com/search?q=__SEARCHTEXT__',
}

// =================================== CODE ======================================

// The element that will hold the search bars
let rowElement = document.createElement('div')
rowElement.setAttribute('class', 'flexbox fbCen')

let navBar = document.getElementById('preNav')
navBar.parentElement.insertBefore(rowElement, navBar)

let searchBarKeys = Object.keys(searchBars)
for (let key of searchBarKeys) {
    // Generate a searchbar for each definied query

    let searchInput = document.createElement('input')
    searchInput.setAttribute('type', 'text') 
    searchInput.setAttribute('data-searchBarKey', key)
    searchInput.setAttribute('placeholder', `Search ${key}`)
    searchInput.setAttribute('class', 'ac_combined ui-autocomplete-input')
    searchInput.setAttribute('autocomplete', 'off')
    searchInput.setAttribute('size', '15')
    searchInput.setAttribute('style', 'text-align: center; margin-top: 2pt; margin-bottom: 5pt; margin-right: 5pt')

    searchInput.addEventListener('keypress', function(event) {
        if (event.key == 'Enter') {
            let query = searchBars[this.getAttribute('data-searchBarKey')]
            let url = query.replace(/^#?(.*)__SEARCHTEXT__(.*)/, `$1${encodeURIComponent(this.value)}$2`)

            if ( query.match(/^#/) ) {
                // Open the search in a new tab
                this.value = ''
                window.open(url)
            } else {
                // Open the search in the current tab
                window.location = url
            }
        }
    })

    rowElement.appendChild(searchInput)
}