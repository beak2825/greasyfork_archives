// ==UserScript==
// @name https://www.roblox.com/users/3438194418/profile
// @namespace github.com/openstyles/stylus
// @version 1.1
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.roblox.com/*
// @downloadURL https://update.greasyfork.org/scripts/558322/https%3Awwwrobloxcomusers3438194418profile.user.js
// @updateURL https://update.greasyfork.org/scripts/558322/https%3Awwwrobloxcomusers3438194418profile.meta.js
// ==/UserScript==

(function() {
let css = `

  .light-theme .profile-avatar-gradient {
    display: none!important;
}

  .profile-platform-container .thumbnail-holder.thumbnail-holder-position {
    background: #fff;
    height: 300px;
    width: 485px;
}

  .profile-currently-wearing .item-card-caption {
    display: none;
}

  .profile-currently-wearing .item-card {
    width: 100px!important;
    height: 100px!important;
}

  .profile-currently-wearing .item-card-container, .profile-collections .item-card-container {
    box-shadow: none!important;
}

  .item-card-container .item-card-thumb-container {
    border-bottom: none!important;
    border-radius: 3px!important;
}

  .profile-currently-wearing .css-1i465w8-carousel {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill,minmax(90px,1fr));
    height: 235px;
    width: 485px;
    padding: 20px 22px;
    position: absolute;
    top: 15px;
}

  .profile-currently-wearing .css-1jynqc0-carouselContainer {
    height: 300px;
    width: 485px;
    background-color: #3a7498;
    margin-left: 485px;
}

  .profile-currently-wearing .css-1jynqc0-carouselContainer:before {
    display: block;
    height: 300px;
    width: 485px;
    background-color: #fff;
    content: "Loading";
    color: transparent;
    margin-left: -485px;
    background-image: url(https://images.rbxcdn.com/4bed93c91f909002b1f17f05c0ce13d1.gif);
    background-repeat: no-repeat;
    background-position: center;
}

  .profile-currently-wearing .css-17g81zd-collectionCarouselContainer {
    gap: 2px;
}

  .profile-currently-wearing h2 {
    font-size: 24px!important;
    font-weight: 300!important;
}

  .profile-currently-wearing:before {
    height: 38px;
    width: 40px;
    background-color: #fff;
    content: "3D";
    position: relative;
    margin-top: -35px;
    top: 80px;
    left: 433px;
    cursor: pointer;
    display: flex;
    font-weight: 400;
    text-align: center;
    padding: 8px 9px;
    font-size: 18px;
    border-radius: 3px;
    border: 1px solid #B8B8B8;
    color: #B8B8B8;
    transition: box-shadow 200ms ease-in-out;
    z-index: 4;
}

  .profile-currently-wearing:hover:before {
    box-shadow: 0 1px 3px rgba(150,150,150,0.74);
}

  .profile-currently-wearing .scroll-arrow.next {
    display: none;
}

  .profile-header-overlay {
    position: revert;
}

  .profile-platform-container .relative:has(.avatar-thumbnail-container) {
    display: block;
    position: absolute;
    height: 300px;
    width: 485px;
    top: 505px;
    visibility: hidden;
}

  .profile-platform-container {
    margin-top: 69px;
}

  .avatar-loading-shimmer-overlay {
    display: none!important;
}

  #footer-container .language-selector-wrapper {
    display: none!important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
