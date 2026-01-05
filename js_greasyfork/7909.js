// ==UserScript==
// @name       NGet Simplify
// @version    1.0
// @description  Removes all the annoying ads, banners, and navbars when watching a video on NarutoGet
// @match      http://www.narutoget.com/watch/*
// @namespace https://greasyfork.org/users/8907
// @downloadURL https://update.greasyfork.org/scripts/7909/NGet%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/7909/NGet%20Simplify.meta.js
// ==/UserScript==

function main() {
    
    var removeThese = [
        "sitepicker",
        "logo",
        "links",
        "search",
        "side-b",
        "footer",
        "stats",
        "spacer",
        "retangle",
        "cpmstar-site-skin-l",
        "cpmstar-site-skin-r",
        "cheatsheet-slider-menu",
        "cheatsheet-slider-menu-toggle"
    ];
    
    for (var i = 0; i < removeThese.length; i++) {
        var elem = document.getElementById(removeThese[i]);
        if (elem && elem.parentNode && elem.parentNode.removeChild) {
            elem.parentNode.removeChild(elem);
        }
    }
    
    var sideA = document.getElementById("side-a");
    var sideA_iframe = findFirstChild(sideA, "IFRAME");
    if (sideA_iframe) {
        sideA.removeChild(sideA_iframe);
    }
    
    var sideA_center = findFirstChild(sideA, "CENTER");
    if (sideA_center) {
        var sideA_center_iframe = findFirstChild(sideA_center, "IFRAME");
        if (sideA_center_iframe) {
            sideA_center.removeChild(sideA_center_iframe);
        }
    }
    
    var body = document.body;
    var body_iframe = findFirstChild(body, "IFRAME");
    if (body_iframe) {
        body.removeChild(body_iframe);
    }
    
    var other_iframes = document.querySelectorAll("iframe:not([src*='narutoget'])");
    if (other_iframes) {
        for (var i = 0; i < other_iframes.length; i++) {
            other_iframes[i].parentNode.removeChild(other_iframes[i]);
        }
    }
}

function findFirstChild(elem, tag) {
    if (elem && elem.childNodes) {
        var children = elem.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].tagName === tag) {
                return children[i];
            }
        }
    }
    
    return null;
}

window.addEventListener("load", function() { setTimeout(main, 1500); }, false);