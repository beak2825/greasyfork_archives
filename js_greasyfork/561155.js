// ==UserScript==
// @name         AO3: return tailored kudos' and styled comments' visibility
// @namespace    https://greasyfork.org/en/users/1555174-charles-rockafellor
// @version      0.2.0
// @description  Moves AO3 works' `#feedback` and `#clear` to bottom of `.work` div, beneath the `#workskin` div
// @icon         https://i.pinimg.com/474x/5c/93/49/5c93497c0a8bebf0214fe4389f53658b.jpg
// @include      http*://archiveofourown.org/*
// @include      http*://archiveofourown.com/*
// @include      http*://archiveofourown.net/*
// @include      http*://archiveofourown.gay/*
// @include      http*://ao3.org/*
// @include      http*://archive.transformativeworks.org/*
// @include      http*://insecure.archiveofourown.org*
// @grant        @none
// @license      MIT; https://opensource.org/license/mit
// @author       Charles Rockafellor
// @homepageURL  https://archiveofourown.org/users/Charles_Rockafellor/collections
// @downloadURL https://update.greasyfork.org/scripts/561155/AO3%3A%20return%20tailored%20kudos%27%20and%20styled%20comments%27%20visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/561155/AO3%3A%20return%20tailored%20kudos%27%20and%20styled%20comments%27%20visibility.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    // Tell the script where I want to put the feedback and clear divs, which is the .work class
    const workDiv = document.querySelector('.work');

    // Tell the script what I want to move, which are the #feedback and .clear divs
    const feedback = document.querySelector('#feedback');
    const clearDiv = document.querySelector('.clear');

    // Move them individually to the end, with appendChild
    if (workDiv && feedback) {
        workDiv.appendChild(feedback);
    }
    if (workDiv && clearDiv) {
        workDiv.appendChild(clearDiv);
    }
})();