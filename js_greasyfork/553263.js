// ==UserScript==
// @name           Flickr - Archives ➕ directly by date taken
// @version        1.0.0
// @description	   Show Archives directly by date taken (Small view with pagination) and show the Hidden Archives options (where you can show others type of views (Square / Small / Medium and Large)
// @icon           https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @namespace      https://greasyfork.org/users/8

// @match          http*://www.flickr.com/people/*
// @match          https://www.flickr.com/photos/*/archives/*

// @author         decembre
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/553263/Flickr%20-%20Archives%20%E2%9E%95%20directly%20by%20date%20taken.user.js
// @updateURL https://update.greasyfork.org/scripts/553263/Flickr%20-%20Archives%20%E2%9E%95%20directly%20by%20date%20taken.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const archivesLinkSelector = '.fluid.html-profile-page-view .profile-page-view .profile-container .bio-infos-container a.archives-link';

  // Add style rules for the button hover effect
  var style = document.createElement('style');
  style.innerHTML = `
    .profile-bio-view .bio-description .bio-infos .bio-infos-container ul li a.archives-link.archives-plus-badge {
      background-color: #34C759 !important;
      color: white !important;
      border-radius: 5px;
      padding: 1px;
      text-decoration: none;
      margin-left: 5px;
    }
    .profile-bio-view .bio-description .bio-infos .bio-infos-container ul li a.archives-link.archives-plus-badge:hover {
      background-color: #2ecc71 !important;
      color: red !important;
      cursor: pointer;
    }
    .profile-bio-view .bio-description .bio-infos .bio-infos-container ul li a.archives-link.archives-plus-badge:before {
    content: "+";
    position: absolute;
    height: 10px;
    line-height: 10px ;
    width: 10px;
    margin: -5px 0 0 15px; ;
    padding: 1px;
    text-decoration: none;
    text-align: center;
    border-radius: 100%;
color: white !important;
background-color: red !important;
}
.profile-bio-view .bio-description .bio-infos .bio-infos-container ul li a.archives-link.archives-plus-badge:after {
    content: "Archives" !important;
    position: absolute !important;
    height: 10px;
    line-height: 10px ;
    width: auto ;
    margin: -8px 0 0 4px; ;
    padding: 0px 0px;
    text-decoration: none;
    text-align: center;
    font-size: 0px ;
    border-radius: 5px;
    transition: all ease 0.7s ;
color: white !important;
background-color: red !important;
}
.profile-bio-view .bio-description .bio-infos .bio-infos-container ul li a.archives-link.archives-plus-badge:hover:after {
    content: "Archives" !important;
    position: absolute !important;
    height: 10px;
    line-height: 10px ;
    width: auto ;
    margin: -25px 0 0 -35px; ;
    padding: 5px 5px;
    text-decoration: none;
    text-align: center;
    font-size: 12px ;
    border-radius: 5px;
color: white !important;
background-color: red !important;
}

/* (new324) == Flickr ARCHIVES PLUS - TWEAKS == */

/* (new324) ARCHIVES - TOP HEADER  */

html.styleguide .new-header:not(.breakout-justified).header-underlap.js .searchified-options ,
html.styleguide .new-header:not(.breakout-justified).header-underlap.js #archives-options.searchified-options {
    position: relative;
    display: inline-block;
    width: 100%;
    margin: -1vh 0 0vh 0px;
    z-index: 50000;
color:white;
background: #333;
border: 1px solid #333;
}

#archives-tabs {
    position: relative;
    display: inline-block;
    height: auto;
    width: 100%;
    right: 0%;
    margin: -1.6vh 0 3vh 0px ;
    padding: 0px 0px;
    text-align: center;
    z-index: 50000;
/*background: olive;*/
    background: #333;
border: 1px solid #333;
}
#archives-tabs .tabs {
    display: inline-block;

    width: 99.8%;
    margin: 0 auto;

    padding: 0px 0px;
    text-align: center;
/*background: red;*/
/*border: 1px solid aqua;*/
}

#archives-navigation + .searchified-options-view,
#archives-navigation {
    color: white;
}
#archives-navigation a,
#archives-navigation strong:not(.InHere) {
    color: gold;
}
#archives-navigation strong.InHere {
    color: #ea84b9;
}
#archives-navigation + .searchified-options-view strong {
    color: gold;
}
#archives-navigation + .searchified-options-view .searchified-menu-button span.caret   {
    filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%);
}
#archives-tabs a.item ,
#archives-tabs .prev a ,
#archives-tabs .next a ,
#archives-navigation + .searchified-options-view a {
    color: peru;
}

#archives-tabs .prev {
    right: 0;
    margin: 1px 0 0  47.5%  ;
    padding: 0 0 0 0;
    text-align: left;
color: white;
}
#archives-tabs .next {
    left: 0;
    margin: 1px 50% 0 0px ;
    padding: 0 0 0 0;
    text-align: right;
color: white;

}
/* DATE POSTED */
#archives-navigation a[href$="/archives/date-posted/"]  {
    color: #28ddc3;
}
#archives-navigation a[href$="/archives/date-posted/"]:after {
    content: "........";
    background: url("data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC7UlEQVQ4jS2TXWibdRTGf+f/5k3eNEnzsbR2CbardCb9cGNDJyudHwzBgjAvxDsvxJuC3ujNLhRBFMGr6XBSEJl33nghQ/FitgU7cRBLja02FnVdbcJSaz8TsyV9/8eLd1fnwHkezgMPP1kszanhEAVUQDBgfQSDiKDBBTCIDTQqiqIYK4SENqiDIIGOwAyKWgUAEwwrPuAQvFHEQEhweOvtEVZW4zz62A5vTFWYf2UBgJGpQYpU6J3+DAPc+vQy70yforSQZriwz3vvLhMCZXPLY6PaxbHBJmqVVq2Fr8rhfx0cmkRqdwDw1bK941KteWQzbYx1kMXSdf29kqLRcEgl7/HQYIOtn/cwQGIgTpwDImtrCELz1Cirf6XZ3nOJJzqMFg4IGeDJH64Qub1BqzjEev5FPrw2DggvPF+FgWW+DH0LCG8yxNmfruJV/uBef57NwksYsUJsoUz33DxdSyu02w6zsz3MzB2heidCtVVnpn6DmfoNOtYn+ssKqdl5EgtlECFkxbBzYZKD8TO0H8wT9XxenfoTBIYLTUgWee3hlwGIOh67z56nNTbMYc8RAEIqsMwYd2kTI0rGbaHjlxBAes7A5ijcnAAE8htcK8J6P/R6wiQQMljWvqqzvbRP37kM0bMuV1Y/B5RUOAmVx/l4ehBwuPBcjW9qM3xfv8mJ9AiTuaeCGrOnu/GyLqlinLAJ8UzfBBYl5z0AfXc5//Q/CBB2fU6mRnHFZSCWBwQpl77T3yoJDhou6WSH48f22SrvogLd/TES2iByex3E0jx5gt1bHdp7HdyEIVWIBwkuXR6ivJTkiYl/ef/iIj++voJiOX3xOEcpk/vgIwTDr19/QeXq39Tnt8k80s25T8YICdCTbZHPhcmkO6gxdB31UHycmMEnSjvXC4CIJZJ26cp5eNkIioOUS9dVVRBRRBSsoCIISsCSICJYDhEVBEBNgKVDkEDVYLEE3YG5vxgRFAtqcQiD+PgScH8fUP4Hoqkgf3Xl8AoAAAAASUVORK5CYII=") no-repeat ;
    margin: 0 0 0 20px;
}

/* (new321) ARCHIVES -TOP DROPDOWN MENU - SIZE */
html.styleguide .yui3-popover-content-hider:has(#thumb-options.searchified-menu):has(a[href*="/?view=s"]) {
    position: absolute;
    top: -2vh;
    margin:  0 0 0 100px ;
    z-index: 50000;
}

/* (new321) ARCHIVES - PAGI */
/*#archives-footer {
    position: fixed;
    display: inline-block;
    width: 55%;
    height: 4.7vh;
    line-height: 3vh;
    margin: 0vh 0 0 0;
    top: 15.5vh;
    right: 15%;
    z-index: 100;
    color: white;
background: #111;
}
#archives-footer .pagination{
    display: inline-block;
    width: 100%;
    height: 3vh;
    line-height: 3vh;
    margin: -2.5vh 0 0 0;
}*/


  `;
  document.head.appendChild(style);

  function addArchivesPlusLink(link) {
    const originalHref = link.href;
    const newHref = `${originalHref}/date-taken/detail/?view=sm`;
    const newLink = document.createElement('a');
    newLink.href = newHref;
    newLink.textContent = "A+";
    newLink.className = 'archives-link archives-plus-badge';
    link.parentNode.insertBefore(newLink, link.nextSibling);
  }

  const observer = new MutationObserver((mutations) => {
    const archivesLinks = document.querySelectorAll(archivesLinkSelector);
    archivesLinks.forEach((link) => {
      const plusLink = link.parentNode.querySelector('.archives-plus-badge');
      if (!plusLink) {
        addArchivesPlusLink(link);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
