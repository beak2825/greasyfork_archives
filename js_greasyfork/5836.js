// ==UserScript==
// @icon         http://web.archive.org/favicon.ico
// @name         Web Archive Save Link
// @version      2.0.0
// @description  Adds a save button to web archive pages.
// @author       Benji Grant
// @license      MIT
// @match        https://web.archive.org/web/*
// @match        http://web.archive.org/web/*
// @grant        none
// @namespace    https://greasyfork.org/users/4072
// @downloadURL https://update.greasyfork.org/scripts/5836/Web%20Archive%20Save%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5836/Web%20Archive%20Save%20Link.meta.js
// ==/UserScript==

document.body.addEventListener('load', () => {
  const pageURL = window.location.pathname.replace(/\/web\/\d+\//, '')

  const saveLink = document.createElement('a')
  saveLink.href = `https://web.archive.org/save/${encodeURIComponent(pageURL)}`
  saveLink.style.fontFamily = 'sans-serif'
  saveLink.style.fontSize = '14px'
  saveLink.style.color = 'initial'
  saveLink.style.display = 'inline-block'
  saveLink.style.background = 'rgba(255,255,255,0.9)'
  saveLink.style.border = '5px solid black'
  saveLink.style.borderTop = '0'
  saveLink.style.borderRadius = '0 0 8px 8px'
  saveLink.style.boxShadow = '1px 1px 4px #333'
  saveLink.style.position = 'fixed'
  saveLink.style.top = '65px'
  saveLink.style.left = '25px'
  saveLink.style.padding = '8px 12px'
  saveLink.style.zIndex = '10000000000'
  saveLink.style.textDecoration = 'underline'
  saveLink.append(document.createTextNode('Save URL'))

  document.querySelector('#wm-ipp-base').after(saveLink)
})
