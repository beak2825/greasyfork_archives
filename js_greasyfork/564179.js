// ==UserScript==
// @name YouTube Reklam Engelleyici Pro
// @namespace https://greasyfork.org/users/104641-kanalin-krali
// @version 1.0.0
// @description YouTube reklamlarini engeller
// @author Ali Osman Dinke
// @license MIT
// @match *://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/564179/YouTube%20Reklam%20Engelleyici%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/564179/YouTube%20Reklam%20Engelleyici%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('YouTube Reklam Engelleyici Pro - Ali Osman Dinke © 2026');
    
    // CSS Ekle
    const style = document.createElement('style');
    style.textContent = `
        .ytr-panel {
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: #FF0000;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial;
            width: 250px;
            border: 2px solid gold;
        }
        .ytr-panel h3 {
            margin: 0 0 10px 0;
            text-align: center;
        }
        .ytr-panel-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
        }
        .ytr-btn {
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
        }
        .ytr-subscribe {
            background: darkred;
            color: white;
        }
        .ytr-follow {
            background: green;
            color: white;
        }
        .ytr-close {
            position: absolute;
            top: 5px;
            right: 5px;
            background: black;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    // Panel Oluştur
    function createPanel() {
        if (document.querySelector('.ytr-panel')) return;
        
        const panel = document.createElement('div');
        panel.className = 'ytr-panel';
        panel.innerHTML = `
            <button class="ytr-close" onclick="this.parentElement.remove()">×</button>
            <h3>YouTube Reklam Engelleyici</h3>
            <p>Geliştirici: Ali Osman Dinke</p>
            <div class="ytr-panel-buttons">
                <a href="https://www.youtube.com/@KANALINKRALI" target="_blank" class="ytr-btn ytr-subscribe">
                    📺 Abone Ol
                </a>
                <a href="https://greasyfork.org/tr/users/104641-kanalin-krali" target="_blank" class="ytr-btn ytr-follow">
                    ⭐ Takip Et
                </a>
            </div>
            <p style="margin-top:10px;font-size:12px;text-align:center">© 2026 Tüm Hakları Saklıdır</p>
        `;
        
        document.body.appendChild(panel);
    }
    
    // Reklam Engelle
    function blockAds() {
        // Skip butonları
        document.querySelectorAll('.ytp-skip-ad-button, .videoAdUiSkipButton').forEach(btn => {
            btn.click();
        });
        
        // Video reklamları
        const video = document.querySelector('video');
        if (video && document.querySelector('.ad-showing')) {
            video.currentTime = video.duration;
        }
        
        // Banner reklamlar
        document.querySelectorAll('[class*="ad"], [id*="ad"], ytd-promoted-video-renderer').forEach(ad => {
            ad.style.display = 'none';
        });
    }
    
    // Başlat
    setTimeout(() => {
        createPanel();
        setInterval(blockAds, 1000);
        setInterval(createPanel, 5000);
    }, 3000);
    
})();