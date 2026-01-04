// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://greasyfork.org/en/users/1543169-evilfae
// @author       Modified by fae
// @license      GPL-3.0-only
// @version      1.4
// @include      *://*.bandcamp.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_download
// @description test
// @downloadURL https://update.greasyfork.org/scripts/557915/Bandcamp%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557915/Bandcamp%20Downloader.meta.js
// ==/UserScript==

var tracklist = TralbumData.trackinfo;

(function () {
  "use strict";

  $("body")
    .append(
      $("<div/>")
        .addClass("dl-sidebar-container dl-sidebar dl-color-1 hidden")
        .append(
          $("<p/>")
            .addClass("dl-info")
            .text("HIIIiiii iIi FAE HERE JUST SCROLL DOWN AND CLICK THE GREY BUTTON AND IT SHOULD WORK")
        )
        .append($("<ol/>").addClass("dl-tracklist"))
        .append(
          $("<div/>")
            .addClass("dl-all-button dl-progress dl-color-2")
            .append($("<div/>").addClass("dl-progress-bar"))
            .append($("<div/>").addClass("dl-progress-text").text("Download Album"))
        )
    )
    .append(
      $("<div/>")
        .addClass("dl-sidebar-toggle dl-sidebar dl-color-1 hidden")
        .text("Faggot downloader")
    );

  tracklist.forEach((track) => {
    $(".dl-tracklist").append(
      $("<li/>")
        .attr("id", "track-" + track.track_num)
        .append(
          $("<a/>")
            .addClass("dl-link custom-color")
            .attr("data-url", track.file["mp3-128"])
            .attr("data-trackid", tracklist.indexOf(track))
            .text(track.title)
        )
    );
  });

  GM_addStyle(
    ".dl-sidebar-toggle{font-family:biolinum;left:0;top:50px;position:fixed;transform:rotate(90deg);transform-origin:left bottom;border-top-right-radius:5px;border-top-left-radius:5px;padding:5px;z-index:5001;background:inherit;border:1px solid #000;border-bottom:none;cursor:pointer}.dl-sidebar-toggle.active{left:400px}.dl-sidebar-container{width:390px;min-height:300px;left:-400px;top:50px;max-height:500px;overflow-y:scroll;padding:10px;position:fixed;z-index:5000;border:1px solid #000;border-left:none}.dl-sidebar-container.active{left:0}.dl-all-button{cursor:pointer;background:#fff;color:#000;border-color:#000;margin-top:10px}.dl-progress,.dl-progress-bar,.dl-progress-text{height:25px;left:0;right:0;top:0;bottom:0}.dl-progress-bar{width:0;overflow:hidden;transition:width .2s linear;background:#000}.dl-progress-text{text-align:center;position:absolute;line-height:25px}.dl-sidebar{opacity:1;transition:opacity 1s,left .5s}.dl-sidebar.hidden{opacity:0}.dl-sidebar::-webkit-scrollbar{width:10px}.dl-sidebar::-webkit-scrollbar-track{background:#000}.dl-sidebar::-webkit-scrollbar-thumb{background:#fff}"
  );

  $(".dl-color-1").css({
    "background-color": $("#pgBd").css("background-color"),
    color: $("#pgBd").css("color"),
    "border-color": $("#pgBd").css("color")
  });
  $(".dl-color-2").css({
    "background-color": $("#follow-unfollow").css("background-color"),
    color: $("#follow-unfollow").css("color"),
    "border-color": $("#follow-unfollow").css("border-color")
  });
  $(".dl-progress-bar").css({
    "background-color": $("#pgFt").css("background-color")
  });

  $(".dl-info").css({
    color: "#fff",
    "font-size": "14px",
    "margin-bottom": "10px",
    "text-shadow": "0 0 3px #000"
  });

  $(".dl-sidebar").removeClass("hidden");

  $(".dl-sidebar-toggle").click(() => {
    $(".dl-sidebar").toggleClass("active");
  });

  $(".dl-link").click((e) => {
    const t = tracklist[$(e.target).attr("data-trackid")];
    let clean = t.title.replace(/^[^–-]+[-–]\s*/, "");
    GM_download($(e.target).attr("data-url"), `${t.track_num} ${clean}.mp3`);
  });

  $(".dl-all-button").click(() => faeisadirtyfuckingmutt());

  function faeisadirtyfuckingmutt() {
    var P = window.Promise || JSZip.external.Promise;

    function urlToPromise(url) {
      return new P((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: "arraybuffer",
          onload: (res) => resolve(res.response),
          onerror: reject
        });
      });
    }

    var zip = new JSZip();

    tracklist.forEach((track) => {
      let clean = track.title.replace(/^[^–-]+[-–]\s*/, "");
      let name = `${track.track_num} ${clean}.mp3`;
      zip.file(name, urlToPromise(track.file["mp3-128"]), { binary: true });
    });

    zip
      .generateAsync({ type: "blob" }, (m) => {
        $(".dl-progress-bar").css("width", `${m.percent}%`);
      })
      .then((blob) => {
        GM_download(URL.createObjectURL(blob), `${TralbumData.current.title}.zip`);
      });
  }
})();
