// ==UserScript==
// @name       private.com
// @namespace   Violentmonkey Scripts
// @match       https://members.private.com/en/scene/*
// @grant       none
// @version     1.1.0
// @author      -
// @license MIT
// @description 9/15/2025, 10:25:49 AM
// @downloadURL https://update.greasyfork.org/scripts/562979/privatecom.user.js
// @updateURL https://update.greasyfork.org/scripts/562979/privatecom.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  var videoPlaylist = document.querySelector('.title-zone')
  // var linkList = videoPlaylist.querySelectorAll("h1");
  // console.log(videoPlaylist)
  console.log(videoPlaylist.firstChild)
  var linkList = videoPlaylist.querySelectorAll('.tag-models')
  for (var i = 0; i < linkList.length; i++) {
    console.log(linkList[i].innerText)
  }

  var downloadList = document.querySelectorAll('.full_download_link')
  // for (var i = 0; i < downloadList.length; i++) {

  i = 0

  const fileUrl = downloadList[i].href
  const fileName = downloadList[i].download // Optional: Specify a custom file name
  const link = document.createElement('a')
  link.href = fileUrl
  link.text = fileUrl

  link.download = fileName // Set the file name for the download
  document.body.appendChild(link)

  // Trigger the download
  // document.body.removeChild(link);
  console.log(downloadList[i].href)
  // }

  //   const fileUrl = 'https://example.com/path/to/file';
  //     const fileName = 'downloaded-file.txt'; // Optional: Specify a custom file name

  //     // Create an invisible link element
  //     const link = document.createElement('a');
  //     link.href = fileUrl;
  //     link.download = fileName; // Set the file name for the download
  //     document.body.appendChild(link);

  //     // Trigger the download
  //     link.click();

  //     // Clean up the DOM
  //     document.body.removeChild(link);
})()
