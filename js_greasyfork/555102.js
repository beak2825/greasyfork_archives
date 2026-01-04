// ==UserScript==
// @name         Inversity's Image Downloader (USE CAUTION)
// @namespace    http://tampermonkey.net/
// @description  Download images when toggled ON; apply host-specific URL fixes, else use general rules for allowed extensions.
// @shortcutKeys [Alt + D] Activate Image Downloader then reload page.
// @author       Inversity
// @version      1.0.0
// @homepageURL  https://github.com/Inversity
// @license      GNU GPLv3
// @match        https://vipergirls.to/*
// @match        https://viperohilia.art/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555102/Inversity%27s%20Image%20Downloader%20%28USE%20CAUTION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555102/Inversity%27s%20Image%20Downloader%20%28USE%20CAUTION%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const downloadedImages = new Set();
  let active = false;

  // === Configurable host-rules ===
  // Each rule: { hostRegex: RegExp, transform: (urlStr) => urlStrOrNull }
  const hostRules = [
    {
      hostRegex: /^image\.imx\.to$/i,
      transform: urlStr => {
        // if path contains /u/t/ -> swap to /u/i/
        return urlStr.replace(/^https?:\/\/image\.imx\.to\/u\/t\//i, 'https://image.imx.to/u/i/');
      }
    },
    {
      hostRegex: /^i\.imx\.to$/i,
      transform: urlStr => {
        // if path contains /t/ after host -> swap to /i/
        return urlStr.replace(/^https?:\/\/i\.imx\.to\/t\//i, 'https://i.imx.to/i/');
      }
    },
    // Add more rules here for other hosts when you encounter them
  ];

  // Allowed extensions for general rule
  const allowedExtRegex = /\.(jpe?g)$/i;

  function toggleActive(){
    active = !active;
    console.log('Image-download mode:', active ? 'ON' : 'OFF');
    alert('Image-download mode ' + (active ? 'ON' : 'OFF'));
  }

  // Hotkey: Alt + D (you can change this)
  document.addEventListener('keydown', e=>{
    if (e.altKey && e.key.toLowerCase() === 'd') {
      toggleActive();
    }
  });

  // Menu command to toggle
  GM_registerMenuCommand('Toggle Image-Download Mode', toggleActive, 'd');

  function applyHostRules(urlStr){
    try {
      const u = new URL(urlStr);
      const host = u.host;
      for (const rule of hostRules) {
        if (rule.hostRegex.test(host)) {
          const newUrl = rule.transform(urlStr);
          if (newUrl && newUrl !== urlStr) {
            console.log('Host rule applied:', host, urlStr, '→', newUrl);
            return newUrl;
          }
        }
      }
    } catch(e) {
      // invalid URL
    }
    return urlStr;
  }

  function downloadImage(rawUrl){
    if (!active) return;

    let urlStr;
    try {
      urlStr = new URL(rawUrl, window.location.href).href;
    } catch(e) {
      console.error('Invalid URL:', rawUrl);
      return;
    }

    // Apply host-specific transforms
    urlStr = applyHostRules(urlStr);

    // General rule: only allowed extensions
    if (!urlStr.match(allowedExtRegex)) {
      return;
    }

    if (downloadedImages.has(urlStr)) {
      return;
    }
    downloadedImages.add(urlStr);

    const pathname = (new URL(urlStr)).pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/')+1) || 'downloaded.jpg';

    GM_download({
      url: urlStr,
      name: filename,
      saveAs: false,
      onerror: err => {
        console.error('Error downloading image:', err, 'URL:', urlStr);
      }
    });
  }

  function processImageElement(img){
    if (!active) return;
    if (img.src) downloadImage(img.src);
    if (img.srcset) {
      img.srcset.split(',').map(s=>s.trim().split(' ')[0]).forEach(downloadImage);
    }
    if (img.dataset && img.dataset.src) downloadImage(img.dataset.src);
    if (img.dataset && img.dataset.srcset) {
      img.dataset.srcset.split(',').map(s=>s.trim().split(' ')[0]).forEach(downloadImage);
    }
  }

  function processImagesInDocument(doc){
    if (!active) return;
    const images = doc.querySelectorAll('img');
    images.forEach(processImageElement);

    const els = doc.querySelectorAll('*');
    els.forEach(el=>{
      const style = window.getComputedStyle(el);
      const bg = style.getPropertyValue('background-image');
      if (bg && bg !== 'none') {
        const m = bg.match(/url\(['"]?(.*?)['"]?\)/);
        if (m && m[1]) downloadImage(m[1]);
      }
    });
  }

  function processIframe(iframe){
    if (!active) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (doc) processDocument(doc);
    } catch(e) {
      console.warn('Cannot access iframe (cross-origin):', iframe.src);
    }
  }

  function observeDocument(doc){
    if (!active) return;
    const observer = new MutationObserver(muts=>{
      muts.forEach(m=>{
        if (m.type === 'childList') {
          m.addedNodes.forEach(node=>{
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'IMG') {
                processImageElement(node);
              } else {
                node.querySelectorAll && node.querySelectorAll('img').forEach(processImageElement);
                node.querySelectorAll && node.querySelectorAll('iframe').forEach(processIframe);
                const style = window.getComputedStyle(node);
                const bg = style.getPropertyValue('background-image');
                if (bg && bg !== 'none') {
                  const m2 = bg.match(/url\(['"]?(.*?)['"]?\)/);
                  if (m2 && m2[1]) downloadImage(m2[1]);
                }
              }
            }
          });
        } else if (m.type === 'attributes') {
          if (m.target.tagName === 'IMG') {
            processImageElement(m.target);
          } else if (m.attributeName === 'style') {
            const style = window.getComputedStyle(m.target);
            const bg = style.getPropertyValue('background-image');
            if (bg && bg !== 'none') {
              const m2 = bg.match(/url\(['"]?(.*?)['"]?\)/);
              if (m2 && m2[1]) downloadImage(m2[1]);
            }
          }
        }
      });
    });

    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src','srcset','data-src','data-srcset','style']
    });
  }

  function processDocument(doc){
    processImagesInDocument(doc);
    observeDocument(doc);
    const iframes = doc.querySelectorAll('iframe');
    iframes.forEach(processIframe);
  }

  // Kick off
  processDocument(document);

})();