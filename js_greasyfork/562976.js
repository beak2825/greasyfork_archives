// ==UserScript==
// @name     Better pornhub.com playlist videos link grabber
// @description This adds a button to pornhub playlists to grab links to all videos of this playlist
// @version  1.2.1
// @license MIT
// @grant    none
// @match    https://*.pornhub.com/playlist/*
// @match    https://*.pornhubpremium.com/playlist/*
// @namespace https://greasyfork.org/users/984905
// @downloadURL https://update.greasyfork.org/scripts/562976/Better%20pornhubcom%20playlist%20videos%20link%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/562976/Better%20pornhubcom%20playlist%20videos%20link%20grabber.meta.js
// ==/UserScript==
 
;(function () {
  'use strict'
 
  var btnContainer = document.querySelector(
    '#userPlaylistActions #js-playlistTabsNav'
  )
 
  var linkGrabberBtn = document.createElement('button')
  linkGrabberBtn.onclick = grabVideoList
  linkGrabberBtn.classList.add('playlistButtons') //playlistButtons tooltipTrig js-pop
  var span = document.createElement('span')
  span.innerText = 'Get all video links'
  span.className = 'text'
  linkGrabberBtn.appendChild(span)
  btnContainer.appendChild(linkGrabberBtn)
 
  
  function copyText () {
    var text= '';
      var videoPlaylist = document.getElementById('videoPlaylist')
    var linkList = videoPlaylist.querySelectorAll('div > a')
    for (var i = 0; i < linkList.length; i++) {
      // innerHTML = linkList[i].href;
      // console.log(linkList[i].href,linkList[i].href.match(/view_video/) )
      if (linkList[i].href.match(/view_video/) !== null) {
        text = text + '\n' + linkList[i].href
      }
    }
    navigator.clipboard
      .writeText(text)
  }

  function grabVideoList () {
    var videoPlaylist = document.getElementById('videoPlaylist')
    var linkList = videoPlaylist.querySelectorAll('div > a')
    //     for(var i = 0; i< linkList.length; i++){
 
    //       // console.log(linkList[i]);
    //     }
    showLinks(linkList)
  }
 
  function showLinks (linkList) {
    var outerModalDiv = document.createElement('div')
    var innerModalDiv = document.createElement('div')
    outerModalDiv.id = 'playlistVidsLinkContainingModalPanel' //use a long id to avoid name conflicts
    outerModalDiv.style.display = 'block'
    outerModalDiv.style.position = 'fixed'
    outerModalDiv.style.zIndex = '100'
    outerModalDiv.style.paddingTop = '100px'
    outerModalDiv.style.left = '0'
    outerModalDiv.style.top = '0'
    outerModalDiv.style.width = '100%'
    outerModalDiv.style.height = '100%'
    outerModalDiv.style.backgroundColor = 'rgb(0,0,0)'
    outerModalDiv.style.backgroundColor = 'rgb(0,0,0,0.4)'
 
    //add close btn
    var buttonContainer = document.createElement('div')
    buttonContainer.className = 'userButtons'
    var closeBtn = document.createElement('div')
    var innerCloseBtn = document.createElement('button')
    closeBtn.style.cssFloat = 'right'
    closeBtn.classList.add('mainButton')
    closeBtn.classList.add('addFriendButton')
    closeBtn.classList.add('add')
 
    innerCloseBtn.innerText = 'X'
    innerCloseBtn.className = 'buttonBase'
 
    closeBtn.onclick = RemoveOuterModalPanel
    closeBtn.appendChild(innerCloseBtn)
    buttonContainer.appendChild(closeBtn)
    innerModalDiv.appendChild(buttonContainer)
 
    innerModalDiv.style.backgroundColor = '#1b1b1b'
    innerModalDiv.style.margin = 'auto'
    innerModalDiv.style.padding = '20px'
    innerModalDiv.style.border = '1px solid #888'
    innerModalDiv.style.width = '80%'
    innerModalDiv.style.color = '#ababab'
    innerModalDiv.style.overflowY = 'auto'
    innerModalDiv.style.height = '80%'
 
    var CopyTexBtn = document.createElement('button')
    CopyTexBtn.onclick = copyText
    CopyTexBtn.classList.add('playlistButtons') //playlistButtons tooltipTrig js-pop
    var CopyTexrspan = document.createElement('span')
    CopyTexrspan.innerText = 'Get all video links'
    CopyTexrspan.className = 'text'
    CopyTexBtn.appendChild(CopyTexrspan)
 
    var instructions1 = document.createElement('p')
    var instructions2 = document.createElement('p')
    var instructions3 = document.createElement('p')
    instructions1.innerHTML =
      'Save the links to a local textfile (e.g. &quotC:\\Temp\\dl\\linklist.txt)&quot and run youtube-dl whith the -a argument and the path to the linklist.'
    instructions2.innerHTML =
      'youtube-dl -a &quotC:\\Temp\\dl\\linklist.txt&quot'
    instructions3.innerHTML = 'Or just use jDownloader with the linklist'
    innerModalDiv.appendChild(instructions1)
    innerModalDiv.appendChild(instructions2)
    innerModalDiv.appendChild(instructions3)
    innerModalDiv.appendChild(CopyTexBtn)
 
    var linkListDiv = document.createElement('div')
    linkListDiv.id = 'linkListDivID'
    for (var i = 0; i < linkList.length; i++) {
      // innerHTML = linkList[i].href;
      // console.log(linkList[i].href,linkList[i].href.match(/view_video/) )
      if (linkList[i].href.match(/view_video/) !== null) {
        var a = document.createElement('a')
        a.innerHTML = linkList[i].href
        a.href = linkList[i].href
        linkListDiv.appendChild(a)
        linkListDiv.appendChild(document.createElement('br'))
      }
    }
    innerModalDiv.appendChild(linkListDiv)
 
    outerModalDiv.appendChild(innerModalDiv)
    document.body.appendChild(outerModalDiv)
  }
 
  function RemoveOuterModalPanel () {
    var toRemove = document.getElementById(
      'playlistVidsLinkContainingModalPanel'
    )
    toRemove.parentNode.removeChild(toRemove)
  }
})()