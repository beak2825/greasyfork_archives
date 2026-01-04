// ==UserScript==
// @name            CS-214 Prettifier
// @name:fr         CS-214 Enjoliveur
// @name:de         CS-214 Verschönerer
// @namespace       github@FocusedFaust
// @version         2025-09-29
// @description     Prettifier for the class website, to track your work
// @description:fr  Enjoliveur pour le cours de CS-214, permet de suivre l'évolution de son travail
// @description:de  Shit I should've listened to my german teachers
// @author          FocusedFaust
// @match           *://cs-214.epfl.ch/*
// @icon            https://raw.githubusercontent.com/FocusedFaust/CS214-Prettifier/refs/heads/master/favicon_pwetty.png
// @grant           GM_registerMenuCommand
// @license         AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/550061/CS-214%20Prettifier.user.js
// @updateURL https://update.greasyfork.org/scripts/550061/CS-214%20Prettifier.meta.js
// ==/UserScript==

const data_key = 'data'
const selection_range = 'h2,h3,h4'

GM_registerMenuCommand('Clear all data', function() {
    localStorage.setItem(data_key, JSON.stringify({}))
    var boxes = document.querySelectorAll("#work_tracker")
    // Set data
    for (const box of boxes) {
        box.checked = false
    }
    allCheckboxes()
}) // Third parameter is the access key

console.log("The extension is up and running");

var headings = document.querySelectorAll(selection_range)

for (const title of headings) {
    var checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.id = "work_tracker"
    checkbox.style.display = 'block'
    checkbox.style.marginRight = '1.5em'
    checkbox.style.accentColor = '#295414'
    var fetched = JSON.parse(localStorage.getItem(data_key))
    if (fetched != null) {
        checkbox.checked = fetched[title.querySelector('a').textContent]
        checkbox.onclick = allCheckboxes
    } else {
        fetched = {}
        localStorage.setItem(data_key, JSON.stringify(fetched))
    }
    title.style.display = 'flex'
    title.insertBefore(checkbox, title.firstChild)
}

allCheckboxes() // Update ToC upon launch

function allCheckboxes() {
    var boxes = document.querySelectorAll("#work_tracker")

    // Fetch data from the storage or create it if nonexistant
    var fetched = JSON.parse(localStorage.getItem(data_key))
    if (fetched == null) {
        localStorage.setItem(data_key, JSON.stringify({}))
        fetched = JSON.parse(localStorage.getItem(data_key))
    }
    // Set data
    for (const box of boxes) {
        fetched[box.parentElement.querySelector('a').textContent] = box.checked
        localStorage.setItem(data_key, JSON.stringify(fetched))
    }

    // Go through the table of content to change the color depending on completion
    for (const entry of document.querySelectorAll('li')) {
        const elemA = entry.querySelector('a')
        if (elemA != null && elemA.textContent in JSON.parse(localStorage.getItem(data_key))) {
            const text = elemA.textContent
            const value = JSON.parse(localStorage.getItem(data_key))[text]
            const style = window.getComputedStyle(document.body).getPropertyValue('color-scheme')
            if (value == true) {
                elemA.style.color = (style == 'light dark') ? '#7bb263' : '#295414'
                elemA.style.fontWeight = 470
            }
            else {
                elemA.style.color = (style == 'light dark') ? '#c0c0c0' : '#888'
                elemA.style.fontWeight = 'normal'
            }
        }
    }
}