// ==UserScript==
// @name 		MAM - SearchParty
// @author 		WirlyWirly
// @version     1.5
// @description It's a search party! More search stuff for all the things that need searching!

// @match 		https://www.myanonamouse.net/*

// @icon 		https://www.myanonamouse.net/favicon.ico
// @namespace 	https://github.com/WirlyWirly
// @run-at 		document-end

// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues

// @homepage    https://gist.github.com/WirlyWirly/79d7e3ea68b7a862233ee4d468996c83/
// @downloadURL https://update.greasyfork.org/scripts/562814/MAM%20-%20SearchParty.user.js
// @updateURL https://update.greasyfork.org/scripts/562814/MAM%20-%20SearchParty.meta.js
// ==/UserScript==

// ----------------------------------- UserScript --------------------------------------

// =================================== CONFIG MENU ======================================

let reloadWindow = false
GM_config.init({
    'id': 'MAM_SearchParty_config',
    'title': `
        <div>
            <div style="user-select: none; font-family: 'Bebas Neue', Helvetica, Tahoma, Geneva, sans-serif; background-color: #DAD142; -webkit-background-clip: text; -webkit-text-fill-color: transparent; -webkit-filter: brightness(110%); filter: brightness(110%); text-shadow: 0 0 15px rgba(230, 101, 52, 0.55); transition: all 0.3s; font-weight: bold; padding-top: 3%;"><a href="${GM_info.script.homepage}" target="_blank" style="text-decoration: none">${GM_info.script.name}</a><br></div>
            <div style="margin-top:15px"><small style="font-weight: 300; color: #95a5a6; display: block; font-size: 0.6rem; margin-top: 5px;"><i>Hover over settings marked with * to see more information</i></small></div>
        </div>
    `,
    'fields': {
        'seriesIcons': {
            'label': 'Series Search Icons',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each series in a torrent'
        },
        'searchbar1Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar1Text': {
            'label': '',
            'type': 'text',
            'default': 'Torrents 🔍',
        },
        'searchbar1URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[cat][]=0&tor[main_cat]=0',
        },
        'searchbar2Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar2Text': {
            'label': '',
            'type': 'text',
            'default': 'AudioBooks 🎧',
        },
        'searchbar2URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[cat][]=0&tor[main_cat]=13',
        },
        'searchbar3Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar3Text': {
            'label': '',
            'type': 'text',
            'default': 'eBooks 📗',
        },
        'searchbar3URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[cat][]=0&tor[main_cat]=14',
        },
        'searchbar4Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar4Text': {
            'label': '',
            'type': 'text',
            'default': 'Series 📚',
        },
        'searchbar4URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[srchIn]=Series',
        },
        'searchbar5Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar5Text': {
            'label': '',
            'type': 'text',
            'default': 'Comics 🦸',
        },
        'searchbar5URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=__SEARCHTEXT__&tor[cat][]=61',
        },
        'searchbar6Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar6Text': {
            'label': '',
            'type': 'text',
            'default': 'Audible 🔗',
        },
        'searchbar6URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.audible.com/search?keywords=__SEARCHTEXT__',
        },
        'searchbar7Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar7Text': {
            'label': '',
            'type': 'text',
            'default': 'Goodreads 🔗',
        },
        'searchbar7URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.goodreads.com/search?q=__SEARCHTEXT__',
        },
    },
    "events": {
        "open": function (doc) {
            let style = this.frame.style
            style.width = "420px"
            style.height = "575px"
            style.inset = ""
            style.top = "2%"
            style.right = "6%"
            style.borderRadius = "5px"
            style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)"

            reloadWindow = false

            // Create version element
            let githubSVG = '<svg width="16" height="16" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_730_27136)"><path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="white"/></g><defs><clipPath id="clip0_730_27136"><rect width="98" height="96" fill="white"/></clipPath></defs></svg>'

            let versionElement = document.createElement('a')
            versionElement.classList = 'version_label reset'
            versionElement.title = 'Go to homepage'
            versionElement.target = '_blank'
            versionElement.href = `${GM_info.script.homepage}`
            versionElement.innerHTML = `${githubSVG} Version ${GM_info.script.version}`

            doc.getElementById('MAM_SearchParty_config_buttons_holder').appendChild(versionElement)

            // Add success animation to save button
            let saveButton = doc.getElementById('MAM_SearchParty_config_saveBtn')
            saveButton.addEventListener('click', () => {
                saveButton.classList.add('success')
                setTimeout(() => saveButton.classList.remove('success'), 500)
            })

            // Collapse Searchbar fields into a single row
            for (let i = 1; i <= 7; i++) {
                let checkboxRowElement = doc.getElementById(`MAM_SearchParty_config_field_searchbar${i}Enabled`).parentElement
                let searchTextElement = doc.getElementById(`MAM_SearchParty_config_field_searchbar${i}Text`)
                searchTextElement.setAttribute('style', 'margin: 2%; width: 30%')
                let searchURLElement = doc.getElementById(`MAM_SearchParty_config_field_searchbar${i}URL`)

                searchTextElement.parentElement.remove()
                searchURLElement.parentElement.remove()

                checkboxRowElement.appendChild(searchTextElement)
                checkboxRowElement.appendChild(searchURLElement)
            }

        },
        "save": function () {
            reloadWindow = true
            // Clear cached data when settings are saved
            GM_listValues().forEach(key => {
                if (key !== 'MAM_SearchParty_config') {
                    GM_setValue(key, null)
                }
            })
            console.log(`${GM_info.script.name}: Cleared cache data after settings change`)
        },
        "close": function () {
            if (reloadWindow) {
                if (this.frame) {
                    window.location.reload()
                } else {
                    setTimeout(() => {
                        window.location.reload()
                    }, 250)
                }
            }
        },
        "reset": function () {
            // Handle reset functionality
            if (typeof resetToDefaults === 'function') {
                resetToDefaults()
            }
        }
    },
    'css': `
        #MAM_SearchParty_config {
            background: #191d2a;
            margin: 0;
            padding: 10px 20px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #MAM_SearchParty_config .config_header {
            color: #fff;
            padding-bottom: 10px;
            font-weight: 100;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-bottom: none;
            background: transparent;
            margin: 0;
        }
        #MAM_SearchParty_config .config_var {
            display: flex;
            flex-direction: row;
            text-align: left;
            justify-content: center;
            align-items: center;
            width: 90%;
            margin-left: 26px;
            padding: 4px 0;
            border-bottom: none;
            margin-top: 2px;
            margin-bottom: 2px;
        }
        #MAM_SearchParty_config .field_label {
            color: #fff;
            width: 35%;
            user-select: none;
            font-weight: 500;
        }
        #MAM_SearchParty_config .field_label.disabled {
            color: #B0BEC5;
        }
        #MAM_SearchParty_config textarea,
        #MAM_SearchParty_config input[type="text"],
        #MAM_SearchParty_config input[type="number"],
        #MAM_SearchParty_config select {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
            font-size: 0.9em;
            padding-left: 3px;
            width: 65%;
            transition: all 0.3s ease;
        }
        #MAM_SearchParty_config input[type="text"]:focus,
        #MAM_SearchParty_config input[type="textarea"]:focus,
        #MAM_SearchParty_config input[type="number"]:focus,
        #MAM_SearchParty_config select:focus {
            border-color: #2C3E50;
            box-shadow: 0 0 5px rgba(255, 128, 0, 0.5);
            outline: none;
        }
        #MAM_SearchParty_config input[type="checkbox"] {
            cursor: pointer;
            margin-right: 4px !important;
            width: 16px;
            height: 16px;
        }
        #MAM_SearchParty_config .reset {
            color: #95a5a6;
            text-decoration: none;
            user-select: none;
        }
        #MAM_SearchParty_config_buttons_holder {
            display: grid;
            column-gap: 20px;
            row-gap: 16px;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            width: 90%;
            margin-left: 26px;
            height: 94px;
            text-align: center;
            align-items: center;
            margin-top: 20px;
        }
        #MAM_SearchParty_config .reset_holder {
            grid-column: 3;
            grid-row: 2;
        }
        #MAM_SearchParty_config .version_label {
            grid-column: 1;
            grid-row: 2;
            text-align: left !important;
        }
        #MAM_SearchParty_config_resetLink {
            text-transform: lowercase;
            background: transparent;
            color: #95a5a6;
        }
        #MAM_SearchParty_config .version_label:hover,
        #MAM_SearchParty_config_resetLink:hover {
            text-decoration: underline;
        }
        #MAM_SearchParty_config .saveclose_buttons {
            margin: 22px 0px 4px;
        }
        #MAM_SearchParty_config_saveBtn {
            grid-column: 2;
            grid-row: 1;
            background-color: #2C3E50;
            color: #FFFFFF;
            border: none;
            border-radius: 5px;
            padding: 15px 20px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            will-change: background-color, transform;
            transition: background-color 0.2s ease, transform 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            padding-top: 6px !important;
            padding-bottom: 6px !important;
        }
        #MAM_SearchParty_config_saveBtn:hover {
            background-color: #34495E;
            transform: translateY(-2px);
        }
        #MAM_SearchParty_config_saveBtn:active {
            background-color: #fd9b3a;
            transform: translateY(1px);
        }
        #MAM_SearchParty_config_saveBtn.success {
            box-shadow: 0 0 6px 3px rgba(253, 155, 58, 0.6);
        }
        #MAM_SearchParty_config_closeBtn {
            grid-column: 3;
            grid-row: 1;
            background-color: #2C3E50;
            color: #FFFFFF;
            border: none;
            border-radius: 5px;
            padding: 15px 20px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            will-change: background-color, transform;
            transition: background-color 0.2s ease, transform 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            padding-top: 6px !important;
            padding-bottom: 6px !important;
        }
        #MAM_SearchParty_config_closeBtn:hover {
            background-color: #34495E;
            transform: translateY(-2px);
        }
        #MAM_SearchParty_config_closeBtn:active {
            background-color: #2C3E50;
            transform: translateY(1px);
        }
        /* Tooltip styling */
        #MAM_SearchParty_config .field_label[title]:hover::after {
            content: attr(title);
            position: absolute;
            background: #2C3E50;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.8em;
            max-width: 300px;
            z-index: 100;
            margin-top: 25px;
            left: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        /* Animations */
        @keyframes pulse {
            0%, 100% {box-shadow: 0 0 6px 2px rgba(255, 128, 0, 0.5);}
            50% {box-shadow: 0 0 10px 4px rgba(255, 128, 0, 0.8);}
        }
    `
})

// Register the menu command to open settings
GM_registerMenuCommand('Settings', () => {
    GM_config.open()
})


// =================================== CODE ======================================

const seriesIconsEnabled = GM_config.get('seriesIcons')

// ----------------------------------- SearchBars --------------------------------------

// The element that will hold the search bars, inserted below the site banner
let searchBarsRowElement = document.createElement('div')
searchBarsRowElement.setAttribute('class', 'flexbox fbCen')

let navBar = document.getElementById('preNav')
navBar.parentElement.insertBefore(searchBarsRowElement, navBar)

for (let i = 1; i <=7; i++) {
    // Generate a searchbar for each enabled config 

    let itemEnabled = GM_config.get(`searchbar${i}Enabled`)
    let itemText = GM_config.get(`searchbar${i}Text`)
    let itemURL = GM_config.get(`searchbar${i}URL`)

    if ( itemEnabled == false ) {
        // This searchbar # is disabled, skip creation
        continue
    }

    let searchInput = document.createElement('input')
    searchInput.setAttribute('type', 'text') 
    searchInput.setAttribute('placeholder', itemText)
    searchInput.setAttribute('class', 'ac_combined ui-autocomplete-input')
    searchInput.setAttribute('autocomplete', 'off')
    searchInput.setAttribute('size', '15')
    searchInput.setAttribute('style', 'text-align: center; margin-top: 2pt; margin-bottom: 5pt; margin-right: 5pt')

    searchInput.addEventListener('keypress', function(event) {
        if (event.key == 'Enter') {
            let url = itemURL.replace(/^#?(.*)__SEARCHTEXT__(.*)/, `$1${encodeURIComponent(this.value)}$2`)

            if ( itemURL.match(/^#/) ) {
                // Open the search in a new tab
                this.value = ''
                window.open(url)
            } else {
                // Open the search in the current tab
                window.location = url
            }
        }
    })

    searchBarsRowElement.appendChild(searchInput)
}

function generateSeriesIcons(torrentRow) {
    // For the provided torrentRow, generate and append the series search icons

    try {
        // Get all series elements of this torrent-row
        var seriesElements = torrentRow.querySelector('.torSeries').querySelectorAll('.series')
    } catch(error) {
        // No series found, so skip icons...
        // console.log(`No Series for ${torrentRow.id}`)
        return
    }

    for (let series of seriesElements) {
        // Generate the search icons for each series of this torrent-row

        let seriesId = series.href.match(/series=(\d+)/)[1]
        let seriesNextSibling = series.nextSibling

        let seriesIconURLs = {
        'all' : `https://www.myanonamouse.net/tor/browse.php?series=${seriesId}&tor[cat][]=0&tor[main_cat]=0`,
        'audiobooks' : `https://www.myanonamouse.net/tor/browse.php?series=${seriesId}&tor[cat][]=0&tor[main_cat]=13`,
        'ebooks' : `https://www.myanonamouse.net/tor/browse.php?series=${seriesId}&tor[cat][]=0&tor[main_cat]=14`,
        }

        for (let key in seriesIconURLs) {
            // Create and append the search icons alongside the series

            let seriesIconElement = document.createElement('a')
            seriesIconElement.href = seriesIconURLs[key]
            seriesIconElement.classList = 'MAM-SP-SeriesIcon'

            if (key == 'all') {
                seriesIconElement.text = '🔍'
            } else if ( key == 'audiobooks') {
                seriesIconElement.text = '🎧'
            } else if ( key == 'ebooks') {
                seriesIconElement.text = '📗'
            }
            
            series.parentElement.insertBefore(seriesIconElement, seriesNextSibling)
        }
    }
}

let observer = new MutationObserver(function(mutations) {
    // Functionality to run when changes are detected to the target element

    try {

        // All torrent elements in the table
        let torrentRows = mutations[0]['target'].getElementsByTagName('tbody')[0].getElementsByTagName('tr')

        for (let torrent of torrentRows) {
            // Loop through each individual row (torrent) in the table...
            
            if ( !torrent.classList.contains('torrentInfo') ) {
                // This row is NOT a torrent, skipping...
                continue
            }

            if ( seriesIconsEnabled == true ) {
                // Series search icons are enabled, so generate and append them...
                generateSeriesIcons(torrent)
            }

        }

    } catch(error) {
        // console.log(error)
        return

    }
})

if ( document.URL.match(/\/tor\/browse\.php/) || document.URL.match(/myanonamouse\.net\/?$/) ) {
    // --- Browse || Bookmarks || Homepage ---

    let target = document.getElementById("ssr")
    let config = { childList: true }

    // Monitor page for any changes
    observer.observe(target, config)

}