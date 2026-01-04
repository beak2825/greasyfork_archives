// ==UserScript==
// @name         ValueEdge: Follow Tickets
// @namespace    https://github.com/ahr-huber/monkey-scripts/
// @version      2025-11-04
// @description  Automatically follow tickets when you add comments or click the save button
// @license      MIT
// @author       Andreas Huber
// @match        https://*.saas.microfocus.com/*
// @match        https://ot-internal.saas.microfocus.com/ui/?p=4001/13012
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOmRodbGLijiWKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEXXBSdJES/5cUWsR4cNyPd/ced+8AoVllqtkTA1TNMtKJuJjLr4qBV/gxigAimJCYqSczi1l4jq97+Ph6F+VZ3uf+HANKwWSATySOMd2wiDeIZzctnfM+cYiVJYX4nHjSoAsSP3JddvmNc8lhgWeGjGx6njhELJa6WO5iVjZU4hnisKJqlC/kXFY4b3FWq3XWvid/YbCgrWS4TnMMCSwhiRREyKijgiosRGnVSDGRpv24h3/E8afIJZOrAkaOBdSgQnL84H/wu1uzOD3lJgXjQO+LbX9EgMAu0GrY9vexbbdOAP8zcKV1/LUmMPdJeqOjhY+AwW3g4rqjyXvA5Q4w/KRLhuRIfppCsQi8n9E35YGhW6B/ze2tvY/TByBLXS3fAAeHwHiJstc93t3X3du/Z9r9/QDakHLQl3fAPwAAAAZiS0dEAO8A7wDvwcyDBQAAAAlwSFlzAAAN1wAADdcBQiibeAAAActJREFUOMutk8trU1EQxn8zuUnqq6Du1I1ulCwtguCj6W3xH5Do0p2iIsabEJdpuxKrtKU7RcxKXLhzIaKGQgPiQnwuhFisLlqEiqGtkOccF7U18UZQdGAOHL7zfcOc+Qb+MaTjlhqO6ZelUTMpIBwF+wxUEDlAxLujrUbWiuNBOyXSIbDtYK/TepnIhgpam8Pz5mjZPOJ9pLVx3ml9lp39xqdSdY3itfM1Vpu0hlzWWC1jjydzbVAFgHz+vZaWbxucCjczmLlIMt8DwLHsbvwg1bXpQ7kt+MHZ9aI/lBXHC/qpA1BvfsWsTD6vIYFqpYqz12vY6lFamcJzHxgZMQCmJyqI7mBm+UxI4PmNBrhFnVm5ujqFocxhTBcojs2GHidzu4g0T+CIdm3HyUvF2Ce0boXAvtNR0eZDNRIKW7sliAepVET8S68YCI53CPhBWgYyj/7MSH7WF+ymizcSPJiqMXh+u7h4WXAFc/ouzLIFiuP3f06heK2I8IZaNA2gLj4MvEXYpGp9vybI/rCVh9J7xPSZQ08KdteZJJi+vvhXu6B+MObggjjuWcQK4V/nG08mnv5+mZLnNqv0XHHI3u7lbMkd6U2t++V/xHcXZav/DXBUYwAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554649/ValueEdge%3A%20Follow%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/554649/ValueEdge%3A%20Follow%20Tickets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickFollowIcon() {
        if (!isAlreadyFollowing()) // check again, because multiple clicks without page reload
        {
            document.querySelector("button[data-aid='alm-entity-form-header-follow']").click();
        }
    }

    function isFullyLoaded(){
        const alreadyFollowing = document.querySelector("[data-aid='alm-entity-form-header-following']");
        const notYetFollowing = document.querySelector("button[data-aid='alm-entity-form-header-follow']");
        return alreadyFollowing != null || notYetFollowing != null;
    }

    function isAlreadyFollowing(){
        const alreadyFollowing = document.querySelector("[data-aid='alm-entity-form-header-following']");
        return !!alreadyFollowing;
    }

    function addClickHandlerIfNotExists(selector, handler) {
        const element = document.querySelector(selector);
        if (element && element.getAttribute("data-tamper-click") == null) {
            element.addEventListener("click", handler);
            element.setAttribute("data-tamper-click", "true");
            //element.style.outline="1px dotted red";
        }
    }

    function ensureClickHandler(selector, handler){
        window.setInterval(()=>{
            if (!isFullyLoaded() || isAlreadyFollowing()){
                return;
            }

            const selectors = [
                "button[icon='save']", // save button
                'button[data-aid="comments-pane-add-new-comment-button"]' // save a new comment
            ];
            selectors.forEach(it =>{
                addClickHandlerIfNotExists(it, () =>clickFollowIcon());
            });

        }, 1000);
    }

    ensureClickHandler();
})();
