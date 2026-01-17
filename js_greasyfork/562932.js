// ==UserScript==
// @name			Bonk.io Auto Colour Switching (Rainbow Edition)
// @author			Figurative Lag (Modified with Rainbow)
// @description		Automatically rotate through bonk icon colours/teams with rainbow mode
// @match			https://bonk.io/*
// @version			2.0.0
// @run-at			document-idle
// @grant			none
// @license			Apache 2.0
// @namespace https://greasyfork.org/en/scripts/455254-bonk-io-auto-colour-switching
// @downloadURL https://update.greasyfork.org/scripts/562932/Bonkio%20Auto%20Colour%20Switching%20%28Rainbow%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562932/Bonkio%20Auto%20Colour%20Switching%20%28Rainbow%20Edition%29.meta.js
// ==/UserScript==

// Index 0 is actually supposed to be Spectate, which we're not going to use
// So, we have to add 1 to our index when submitting data to the web socket
const coloursList = [
	"FFA",
	"Red",
	"Blue",
	"Green",
	"Yellow"
]
const enabled = [
	true,
	true,
	true,
	true,
	true
]
let currentColour = 0
let rainbowMode = false
let rainbowIndex = 0

const RNG = (min, max) => Math.round(Math.random() * (max - min)) + min
const getFrame = () => document.getElementById("maingameframe").contentWindow
const getDoc = () => getFrame().document
const getId = id => getDoc().getElementById(id)

let websocket = null
const originalSend = getFrame().WebSocket.prototype.send

getFrame().WebSocket.prototype.send = function(args) {
	const invalidSocket = websocket == null || websocket.readState != websocket.OPEN
	const validURL = this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")

	if (validURL && invalidSocket)
		websocket = this

	originalSend.call(this, args)
}

const setColour = colour => {
	currentColour = colour

	const inCustomGame = getDoc().getElementsByClassName("newbonklobby_playerentry").length > 0

	// We have to add +1 because we removed "spectate" from index 0
	if (websocket && inCustomGame)
		websocket.send('42[6,{"targetTeam":' + (colour+1) + '}]')
}

let menu = document.getElementById("descriptioninner")
menu.style.cssText = "background-color: black !important;"

// Clear old screen
Array.from(menu.children).forEach(el => el.remove())

const createCheckbox = (colour, i) => {
	let id = `${colour}Checkbox`
	let label = document.createElement("label")
	label.innerHTML = colour
	label.htmlFor = id
	menu.appendChild(label)

	let checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = id
	checkbox.checked = true

	checkbox.onchange = function() {
		enabled[i] = this.checked
	}

	menu.appendChild(checkbox)
	menu.appendChild(document.createElement("br"))
}

const setCheckbox = (colour, value) => {
	let checkbox = document.getElementById(`${colour}Checkbox`)
	checkbox.checked = !value
	checkbox.click()
}

let h3 = document.createElement("h3")
h3.innerHTML = "Automatic Colour (Team) Switching"
h3.style.margin = 0
menu.appendChild(h3)

let p = document.createElement("p")
p.innerHTML = "Made by Figurative Lag (Rainbow Mod)"
p.style.margin = 0
menu.appendChild(p)

menu.appendChild(document.createElement("hr"))

coloursList.forEach((colour, i) => {
	createCheckbox(colour, i)
})

let disable = document.createElement("input")
disable.type = "button"
disable.value = "Quick Disable"
disable.style.marginTop = "0.5em"
disable.onclick = () => {
	coloursList.forEach(colour => {
		setCheckbox(colour, false)
	})
	setCheckbox("FFA", true)
}
menu.appendChild(disable)

let enable = document.createElement("input")
enable.type = "button"
enable.value = "Quick Enable"
enable.onclick = () => {
	coloursList.forEach(colour => {
		setCheckbox(colour, true)
	})
}
menu.appendChild(enable)

menu.appendChild(document.createElement("hr"))

// RAINBOW MODE SECTION
let rainbowSection = document.createElement("div")
rainbowSection.style.cssText = "background-color: #1a1a1a; padding: 10px; border-radius: 5px; margin: 10px 0;"

let rainbowTitle = document.createElement("h4")
rainbowTitle.innerHTML = "🌈 Rainbow Mode"
rainbowTitle.style.margin = "0 0 10px 0"
rainbowTitle.style.color = "#ff69b4"
rainbowSection.appendChild(rainbowTitle)

let rainbowDesc = document.createElement("p")
rainbowDesc.innerHTML = "Cycle through all colors in order for a rainbow effect!"
rainbowDesc.style.margin = "0 0 10px 0"
rainbowDesc.style.fontSize = "0.9em"
rainbowSection.appendChild(rainbowDesc)

let rainbowToggle = document.createElement("input")
rainbowToggle.type = "button"
rainbowToggle.value = "Enable Rainbow Mode"
rainbowToggle.style.cssText = "background-color: #4CAF50; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-weight: bold;"

rainbowToggle.onclick = () => {
	rainbowMode = !rainbowMode
	rainbowIndex = 0
	
	if (rainbowMode) {
		rainbowToggle.value = "Disable Rainbow Mode"
		rainbowToggle.style.backgroundColor = "#f44336"
		// Enable all colors for rainbow
		coloursList.forEach(colour => {
			setCheckbox(colour, true)
		})
	} else {
		rainbowToggle.value = "Enable Rainbow Mode"
		rainbowToggle.style.backgroundColor = "#4CAF50"
	}
}

rainbowSection.appendChild(rainbowToggle)
menu.appendChild(rainbowSection)

menu.appendChild(document.createElement("hr"))

p = document.createElement("p")
p.innerHTML = "<strong>Switch Interval Modification</strong><br>Warning: bonk.io will quickly rate limit you, making it switch even slower than before you reduced the delay. So, I recommend leaving it at 1000 ms for consistency.<br><em>For rainbow mode, try 500-800ms for a nice effect!</em>"
menu.appendChild(p)

let intervalInput = document.createElement("input")
intervalInput.type = "number"
intervalInput.value = 1000
intervalInput.placeholder = "Interval (ms)"
menu.appendChild(intervalInput)

let intervalSubmit = document.createElement("input")
intervalSubmit.type = "button"
intervalSubmit.value = "Submit"
intervalSubmit.onclick = () => {
	clearInterval(interval)
	interval = setInterval(timeout, parseInt(intervalInput.value))
}
menu.appendChild(intervalSubmit)

function timeout() {
	// RAINBOW MODE - cycle through colors in order
	if (rainbowMode) {
		// Get list of enabled colors
		const enabledColors = []
		for (let i = 0; i < enabled.length; i++) {
			if (enabled[i])
				enabledColors.push(i)
		}
		
		if (enabledColors.length == 0)
			return
		
		// Cycle to next color in the list
		rainbowIndex = (rainbowIndex + 1) % enabledColors.length
		setColour(enabledColors[rainbowIndex])
		return
	}
	
	// REGULAR MODE - random switching
	const listChecked = []
	for (let i = 0; i < enabled.length; i++) {
		if (enabled[i])
			listChecked.push(i)
	}

	if (listChecked.length == 0)
		return
	if (listChecked.length == 1 && currentColour == listChecked[0])
		return

	// Don't set the colour that is already set
	let colour = currentColour
	while (colour == currentColour) {
		colour = listChecked[RNG(0, listChecked.length-1)]
	}

	setColour(colour)
}
let interval = setInterval(timeout, 1000)