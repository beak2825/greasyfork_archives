// ==UserScript==
// @name         Vivid XDCC links
// @namespace    VividXDCC
// @version      1.01
// @description  Adds XDCC Button
// @match        http://hii.aoi-chan.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/9259/Vivid%20XDCC%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/9259/Vivid%20XDCC%20links.meta.js
// ==/UserScript==

// Set to 1 if you wish to the full filename of the download
var showFullFilename = 0;

function changeLinks()
{
    $(".list li a").each(function()
    {
        var name = $(this).children("span:last").text();
        if (showFullFilename != 1) name = name.substring(name.indexOf(']') + 2, name.length - 18);
        
        var packID = $(this).children("span:first").text();
        packID = packID.trim();
        
        $(this).attr("href", "javascript: var link = prompt('" + name + "', '/MSG Vivid|Hii XDCC SEND " + packID + "');");
        
    });
}

$(".list").bind("DOMSubtreeModified", changeLinks);