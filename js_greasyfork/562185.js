// ==UserScript==
// @name         MOTRIMGv4
// @namespace    http://tampermonkey.net/
// @version      2026-01-11
// @description  fix missing images at motr-online.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       MOTRIMG
// @match        https://calc.motr-online.com/*
// @match        https://motr-online.com/*
// @match        https://forum.motr-online.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=motr-online.com
// @grant        none
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/562185/MOTRIMGv4.user.js
// @updateURL https://update.greasyfork.org/scripts/562185/MOTRIMGv4.meta.js
// ==/UserScript==

/*globals $*/

var loot_old_prefix = "//dbpic.motr-online.com/dbpic/collection/"
var loot_new_prefix = "//dbpic.motr-online.com/dbpic_/collection/"

var card_old_prefix = "//dbpic.motr-online.com/dbpic/card2/"
var card_new_prefix = "//dbpic.motr-online.com/dbpic_/card2/"

var monster_old_prefix = "//dbpic.motr-online.com/dbpic/monster2/"
var monster_new_prefix = "//dbpic.motr-online.com/dbpic_/monster2/"

var another_loot_old_prefix = "//dbpic.motr-online.com/dbpic/item2/"
var another_loot_new_prefix = "//dbpic.motr-online.com/dbpic_/item2/"

var map_old_prefix = "//dbpic.motr-online.com/dbpic/maps2/"
var map_new_prefix = "//dbpic.motr-online.com/dbpic_/maps2/"


var images = document.getElementsByTagName('img');

var item_number;

let result;

var old_test = "dbpic.motr-online.com/dbpic/skill_ico/"
var new_test = "https://dbpic.motr-online.com/dbpic_/skill_ico/"

$(document).ready(function(){
    //change images on vending and knowledge base
    for(var i = 0; i < images.length; i++) {
        if (images[i].src.includes(loot_old_prefix)){
            result = images[i].src.match(/\d+/g)
            item_number = result[0]
            images[i].src = loot_new_prefix + item_number + ".png";
        }
        if (images[i].src.includes(card_old_prefix)){
            result = images[i].src.match(/\d+/g)
            item_number = result[1]
            images[i].src = card_new_prefix + item_number + ".png"
        }
        if (images[i].src.includes(monster_old_prefix)){
            result = images[i].src.match(/\d+/g)
            item_number = result[1]
            images[i].src = monster_new_prefix + item_number + ".png"
            images[i].height = 100;
        }
        if (images[i].src.includes(another_loot_old_prefix)){
            result = images[i].src.match(/\d+/g)
            item_number = result[1]
            images[i].src = another_loot_new_prefix + item_number + ".png"
        }
        if (images[i].src.includes(map_old_prefix)){
            result = images[i].src.split('/')[5].split('.')[0]
            images[i].src = map_new_prefix + result + ".png"
        }
        if (images[i].src.includes(old_test)){
            result = images[i].src.split('/')[5].split('.')[0]
            result = result.toLowerCase()
            images[i].src = new_test + result + ".png"
        }
   }

    //change images in calculator
    var calc_image = document.querySelectorAll('div.tree-item__img > img')
    for(var j = 0; j < calc_image.length; j++) {
        if (calc_image[j].src.includes(old_test)){
            result = calc_image[j].src.split('/')[5].split('.')[0]
            calc_image[j].src = new_test + result + '.png'
        }
    }
});