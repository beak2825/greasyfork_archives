// ==UserScript==
// @name Lightshot direct link and next image
// @namespace  http://prntscr.com/
// @version    1.2
// @description  Adds buttons below prntscr.com images
// @include http://prntscr.com/*
// @include http://prnt.sc/*
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/9806/Lightshot%20direct%20link%20and%20next%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/9806/Lightshot%20direct%20link%20and%20next%20image.meta.js
// ==/UserScript==

console.log("Prntscr direct link loaded")

var Debugging = false

if (Debugging) {
	console.trace()
}

function Print(output) { //It would be immoral to spam others' consoles.
	if (Debugging) {
		console.log(output)
	}
}

function NextImage() {
	var ID = location.href.match("[0-9|a-z]*$")[0]
	location.href = "http://prnt.sc/" + (parseInt(ID, 36) + 1).toString(36) //Add one on in decimal, then convert to base36
}

if (typeof unsafeWindow != "undefined") { //GM
	unsafeWindow.NextImage = NextImage
}

window.onload = function () {
	var Container = document.getElementsByClassName("image-info")
	if (Container) {
		Container = Container[0]

		Container.appendChild(Container.children[1].cloneNode(true))
		Container.appendChild(Container.children[2].cloneNode(true))

		var LinkButton = Container.children[6].firstChild //Direct link button
		LinkButton.id = ""
		Print(document.getElementById("screenshot-image").src)
		var src = document.getElementById("screenshot-image").src
		var Matches = src.match("url=.*$")
		if (Matches != null) { //A script on-page adds the redirect
			LinkButton.href = "https" + Matches[0].slice(8) //Gets base image URL, have to use https because imgur
		} else {
			LinkButton.href = src
		}
		LinkButton.target = "_self"
		LinkButton.children[0].className = "icon-gallery"
		LinkButton.children[1].textContent = "direct link"
		
		
		Container.appendChild(Container.children[1].cloneNode(true))
		Container.appendChild(Container.children[2].cloneNode(true))
		
		var NextButton = Container.children[8].firstChild //Next image button, purely for fun.
		NextButton.id = ""
		NextButton.href = "javascript: NextImage();"
		NextButton.target = "_self"
		NextButton.children[0].className = "icon-reload"
		NextButton.children[1].textContent = "next image"
	}
}