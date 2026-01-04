// ==UserScript==
// @name         Cizgidiyari: Mediafire/Mega/YandexDisk/GDrive Link Açıcı ve Like Seçici
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  İlk gönderinin Beğeni linkini seçen ve Mediafire/Mega/YandexDisk/GoogleDrive linklerini onaylarak açan yüzen buton
// @author       cizgicicocuk
// @match        https://www.cizgidiyari.com/*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553670/Cizgidiyari%3A%20MediafireMegaYandexDiskGDrive%20Link%20A%C3%A7%C4%B1c%C4%B1%20ve%20Like%20Se%C3%A7ici.user.js
// @updateURL https://update.greasyfork.org/scripts/553670/Cizgidiyari%3A%20MediafireMegaYandexDiskGDrive%20Link%20A%C3%A7%C4%B1c%C4%B1%20ve%20Like%20Se%C3%A7ici.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // MediaFire (normal + direct download servers)
    const mediafirePattern = /https?:\/\/(?:[a-z0-9]+\.)?mediafire\.com\/(?:(file|file_premium)\/|(\?[a-zA-Z0-9]+))|https?:\/\/download\d+\.mediafire\.com\//i;


    // Mega.nz
    const megaPattern = /https?:\/\/mega\.nz\/(?:file\/[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+|folder\/[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+|#![a-zA-Z0-9_-]+![a-zA-Z0-9_-]+)/i;


    // Yandex Disk
    const yandexPattern = /https?:\/\/disk\.yandex\.(?:com|com\.tr|ru|eu)\/i\/[a-zA-Z0-9_-]+/i;

    // Google Drive (file, folder, open?id, uc?id)
    const gdrivePattern =
        /https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|drive\/(?:u\/\d\/)?folders\/)[a-zA-Z0-9_-]+/i;

    const opened = new Set();

    // Floating button
    const button = document.createElement('button');
    button.textContent = 'Link ve Like';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 9999;
    button.style.padding = '8px 12px';
    button.style.backgroundColor = '#ff6600';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        console.log('Yüzen butona tıklandı — Beğeni linki vurgulanıyor ve linkler hazırlanıyor...');

        // First post like selector
        const firstPost = document.querySelector('.message.message--post');
        if (firstPost) {
            const likeLink = firstPost.querySelector('a[href*="/react?reaction_id=1"]');
            if (likeLink) {
                likeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                likeLink.style.outline = '3px solid #ff6600';
                likeLink.focus();
            }
        }

        // Collect all download links
        const links = Array.from(document.querySelectorAll('a[href]'));
        const allUrls = links
            .map(link => decodeURIComponent(link.href))
            .filter(url =>
                mediafirePattern.test(url) ||
                megaPattern.test(url) ||
                yandexPattern.test(url) ||
                gdrivePattern.test(url)
            );

        const targets = Array.from(new Set(allUrls)).filter(url => !opened.has(url));

        if (targets.length === 0) {
            alert('Bu sayfada yeni MediaFire, Mega, YandexDisk veya GoogleDrive linki bulunamadı.');
            return;
        }

        // Confirmation dialog
        let confirmMsg =
            `${targets.length} adet MediaFire / Mega / YandexDisk / GoogleDrive linki bulundu.\n\nArka planda açılsın mı?\n\n`;
        const maxDisplay = 10;

        targets.slice(0, maxDisplay).forEach((url, i) => {
            confirmMsg += `${i + 1}. ${url}\n`;
        });

        if (targets.length > maxDisplay) {
            confirmMsg += `\n...ve ${targets.length - maxDisplay} adet daha`;
        }

        if (!confirm(confirmMsg)) return;

        // Open links in background
        for (const url of targets) {
            GM_openInTab(url, { active: false, insert: true });
            opened.add(url);
        }

        console.log(`${targets.length} adet link açıldı.`);
    });
})();
