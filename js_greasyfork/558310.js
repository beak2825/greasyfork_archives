// ==UserScript==
// @name         Streamscharts Direct Links
// @namespace    https://streamscharts.com/
// @version      1.0.0
// @description  Extract direct video links from streamscharts
// @author       You
// @match        https://streamscharts.com/top-live-channels*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamscharts.com
// @grant        none
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/558310/Streamscharts%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/558310/Streamscharts%20Direct%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let trs = document.querySelectorAll("#table-screen table > tbody tr");
  for (const tr of trs) {
    let aChannel = tr.querySelector("td:nth-child(3) a");
    let aLive = tr.querySelector("td:nth-child(8) a");
    let btnEmbed = tr.querySelector("td:nth-child(7) > button[x-on\\:click]");

    let rawChannelHref = aChannel.href;
    let channelHref = new URL(rawChannelHref);
    let channelPlatform = channelHref.searchParams.get('platform') || 'twitch';
    let channelID = channelHref.pathname.split('/').at(2);

    // console.log({channelPlatform, channelID}); // TODO: log

    let attr = btnEmbed?.getAttribute('x-on:click');
    let match = attr?.match(/'(http[^']+)'/);
    let embedUrl = match ? match[1] : null;

    // console.log({embedUrl}); // TODO: log

    if (!channelID) {
      continue;
    }

    aChannel.target="_blank";
    aLive.target="_blank";

    if (channelPlatform === "chzzk") {
      aChannel.href = `https://chzzk.naver.com/${channelID}`;
      aLive.href = `https://chzzk.naver.com/live/${channelID}`;
    } else if (channelPlatform === "youtube") {
      aChannel.href = `https://www.youtube.com/channel/${channelID}`;
      let _embedUrl = new URL(embedUrl);
      let liveID = _embedUrl.pathname.split('/').at(2);
      aLive.href = liveID
        ? `https://www.youtube.com/watch?v=${liveID}`
        : embedUrl;
    } else if (channelPlatform === "twitch") {
      aChannel.href = `https://twitch.tv/${channelID}`;
      aLive.href = aChannel.href;
    } else if (channelPlatform === "kick") {
      aChannel.href = `https://kick.com/${channelID}`;
      aLive.href = aChannel.href;
    } else if (channelPlatform === "afreecatv") {
      aChannel.href = `https://www.sooplive.co.kr/station/${channelID}`;
      let livePath = new URL(embedUrl).pathname.split('/').slice(1, 3).join('/');
      aLive.href = `https://play.sooplive.co.kr/${livePath}`;
    } else if (channelPlatform === "soop") {
      aChannel.href = `https://www.sooplive.com/${channelID}`;
      aLive.href = aChannel.href;
    } else if (channelPlatform === "nimo") {
      aChannel.href = `https://www.nimo.tv/user/${channelID}`;
      aLive.href = `https://www.nimo.tv/${channelID}`;
    } else if (channelPlatform === "trovo") {
      aChannel.href = `https://trovo.live/s/${channelID}`;
      aLive.href = aChannel.href;
    } else if (channelPlatform === "steam") {

      // TODO: steam uses numeric ID instead of text username, it needs API call to extract it
      // aChannel.href = `https://steamcommunity.com/id/${channelID}`;
      // aLive.href = `https://steamcommunity.com/broadcast/watch/${channelID}`;

      aChannel.href = `https://steamcommunity.com/?subsection=broadcasts`;
      aLive.href = `https://steamcommunity.com/?subsection=broadcasts`;
    } else if (channelPlatform === "bigo") {
      aChannel.href = `https://www.bigo.tv/user/${channelID}`;
      aLive.href = `https://www.bigo.tv/${channelID}`;
    }
  }
})();
