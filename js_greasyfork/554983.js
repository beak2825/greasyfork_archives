// ==UserScript==
// @name         RYMAlbumYouTubeSearchFromMediaLinks-fork
// @description  Creates link to search YouTube for a release at the end of existing RYM media links
// @author       dougwritescode, smartacephale
// @supportURL   https://github.com/smartacephale/greasy-fork-scripts
// @version      4.0.0
// @include      https://*rateyourmusic.com/release/*
// @namespace    dougwritescode
// @license	     MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @downloadURL https://update.greasyfork.org/scripts/554983/RYMAlbumYouTubeSearchFromMediaLinks-fork.user.js
// @updateURL https://update.greasyfork.org/scripts/554983/RYMAlbumYouTubeSearchFromMediaLinks-fork.meta.js
// ==/UserScript==

GM_addStyle(`
.ui_media_link_btn_youtube_search {
  filter: invert(1) grayscale(1);
  transition: .2s ease-in;
}

.ui_media_link_btn_youtube_search:hover {
  background: #c9c9c9 url(https://img.icons8.com/?size=100&id=DZe3wFKTc8IK&format=png&color=000000);
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  filter: invert(0) grayscale(1);
}
`);

function setup() {
  const linksContainer = document.querySelector(".ui_media_links");
  if (!linksContainer) {
    setTimeout(setup, 25);
    return;
  }
  setButton()
}

function setButton() {
  const albumText = document.querySelector(".album_title").innerText.trim();
  const artistText = document.querySelector(".artist").innerText.trim();
  const searchString = `${artistText} ${albumText}`.split(/\s+/).map(encodeURIComponent).join('+');
  const searchURL = `https://www.youtube.com/results?search_query=${searchString}`;

  const searchButton = document.createElement("a");
  searchButton.setAttribute("class", "ui_media_link_btn ui_media_link_btn_youtube ui_media_link_btn_youtube_search");
  searchButton.setAttribute("target", "_blank");
  searchButton.setAttribute("rel", "noopener nofollow");
  searchButton.setAttribute("title", "Youtube Search");
  searchButton.setAttribute("aria-label", "Search in YouTube by artist and album title");
  searchButton.setAttribute("href", searchURL);

  const tempcollection = document.querySelector(".ui_media_links");
  tempcollection.appendChild(searchButton);
}

setup();
