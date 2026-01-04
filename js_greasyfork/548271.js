// ==UserScript==
// @name         ChimkenScripts - SearchGenes
// @namespace    http://tampermonkey.net/
// @version      2025.09.08
// @description  Adds a search icon to one-click search a chicken's uniqueness
// @author       Aviivix
// @match        https://chicken.pet/chicken/*
// @match        https://chicken.pet/random
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chicken.pet
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548271/ChimkenScripts%20-%20SearchGenes.user.js
// @updateURL https://update.greasyfork.org/scripts/548271/ChimkenScripts%20-%20SearchGenes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // this is gross
    var color_ids = {"pink": 1, "maroon": 2, "rose": 3, "crimson": 55, "red": 4, "russet": 5, "brown": 6, "vermilion": 50, "bark": 7, "cream": 8, "beige": 9, "orange": 10, "honey": 51, "gold": 11, "ochre": 12, "yellow": 13, "lemon": 14, "lime": 15, "apple": 52, "chartreuse": 16, "olive": 17, "leaf": 18, "grass": 54, "gluppy": 53, "viridian": 19, "spring": 20, "mint": 21, "turquoise": 22, "teal": 23, "aqua": 24, "sea": 25, "cerulean": 26, "sky": 27, "sapphire": 28, "ultramarine": 29, "tumblr": 30, "navy": 31, "indigo": 32, "lilac": 33, "blurple": 34, "overcast": 35, "violet": 36, "amethyst": 37, "lavender": 38, "orchid": 39, "plum": 40, "fuchsia": 41, "wine": 42, "black": 43, "sable": 44, "grey": 45, "ash": 46, "silver": 47, "mist": 48, "white": 49}
    var colors = document.getElementsByClassName("colour")
    let color1 = color_ids[colors[0].children[0].children[0].innerText.toLowerCase()]
    let color2 = color_ids[colors[1].children[0].children[0].innerText.toLowerCase()]
    let color3 = color_ids[colors[2].children[0].children[0].innerText.toLowerCase()]
    var url = `https://chicken.pet/search?match=start&name=&user_name=&age=&sleeping=&owner=&base=${color1}&plus%5Bbase%5D=0&over=${color2}&plus%5Bover%5D=0&flair=${color3}&plus%5Bflair%5D=0&peep=&feet=&tail=&comb=&body=&pattern=&eyespot=&wattle=&search=1`
    var url2 = `https://chicken.pet/search?match=start&name=&user_name=&age=&sleeping=&owner=&base=${color1}&plus%5Bbase%5D=1&over=${color2}&plus%5Bover%5D=1&flair=${color3}&plus%5Bflair%5D=1&peep=&feet=&tail=&comb=&body=&pattern=&eyespot=&wattle=&search=1`
    document.getElementsByClassName("main")[0].children[10].children[0].children[0].innerHTML = `Color genes <a href="${url}">🔍</a><a href="${url2}">+</a>`
})();