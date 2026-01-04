// ==UserScript==
// @name        Reddit User History Search
// @namespace   Reddit
// @match       https://www.reddit.com/user/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds a link to search for author:username on new Reddit
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552687/Reddit%20User%20History%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/552687/Reddit%20User%20History%20Search.meta.js
// ==/UserScript==

const userBanner = document.querySelector("[data-testid='profile-main']")
const username = document.URL.split("/")[4]
const authorSearchUrl = `https://www.reddit.com/search/?q=author%3A${username}`

const searchButton = document.createElement("a")
searchButton.href = authorSearchUrl
searchButton.innerText = "🔎"
searchButton.style.fontSize = "2em"

userBanner.appendChild(searchButton)

