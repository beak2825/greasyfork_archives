// ==UserScript==
// @name         XenForo 2.2 GIF Ekleme (v0.1 - XD)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  XenForo'nun kendi "URL ile Resim Ekle" özelliğini sabırla bekleyerek ve kullanıcı adımlarını taklit ederek kullanan en stabil sürüm.
// @author       Elric Silverhand
// @match        *://*.guresturkiye.net/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561868/XenForo%2022%20GIF%20Ekleme%20%28v01%20-%20XD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561868/XenForo%2022%20GIF%20Ekleme%20%28v01%20-%20XD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tenorApiKey = 'AIzaSyB0aHo-IEpe_qLFWl4SW7aTpnhv3bzJ-m4';
    let searchDebounce;

    function addGifButton(toolbarElement) {
        if (toolbarElement.dataset.gifButtonAdded === 'true') return;

        const insertImageButton = toolbarElement.querySelector('.fr-command[data-cmd="insertImage"]');
        if (insertImageButton) {
            const gifButtonHtml = `
                <button type="button" tabindex="-1" role="button" title="GIF Ekle" class="fr-command fr-btn" data-cmd="insertGif">
                    <i class="far fa-smile-wink" style="font-weight: 900;" aria-hidden="true"></i>
                    <span class="fr-sr-only">GIF Ekle</span>
                </button>
            `;
            insertImageButton.insertAdjacentHTML('beforebegin', gifButtonHtml);
            toolbarElement.dataset.gifButtonAdded = 'true';

            toolbarElement.querySelector('[data-cmd="insertGif"]').addEventListener('click', (e) => {
                e.preventDefault();
                const frBox = e.target.closest('.fr-box');
                if (frBox) {
                    openGifModal(frBox);
                } else {
                    alert('Hata: Ana editör kutusu bulunamadı.');
                }
            });
        }
    }

    function openGifModal(editorBoxElement) {
        if (document.getElementById('gifModal')) document.getElementById('gifModal').remove();

        const modalHtml = `
            <div id="gifModal">
                <div id="gifModalContent">
                    <div id="gifModalHeader"><h2>GIF Seç</h2><span id="closeGifModal">&times;</span></div>
                    <input type="text" id="gifSearch" placeholder="Tenor'da GIF Ara..." autocomplete="off">
                    <div id="gifResults"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('gifModal');
        modal.editorBox = editorBoxElement;

        document.getElementById('gifSearch').addEventListener('keyup', (e) => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                searchGifs(e.target.value.trim() || null);
            }, 350);
        });

        const closeModal = () => modal.remove();
        document.getElementById('closeGifModal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        searchGifs(null);
    }

    function searchGifs(query) {
        const resultsDiv = document.getElementById('gifResults');
        if (!tenorApiKey || tenorApiKey.includes('SIZIN_TENOR')) {
            resultsDiv.innerHTML = 'Hata: Lütfen betik ayarlarından geçerli bir Tenor API anahtarı girin.';
            return;
        }
        resultsDiv.innerHTML = 'Yükleniyor...';
        let url = `https://tenor.googleapis.com/v2/featured?key=${tenorApiKey}&limit=50&media_filter=minimal`;
        if (query) url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${tenorApiKey}&limit=50&media_filter=minimal`;

        fetch(url).then(r => r.json()).then(d => displayGifs(d.results)).catch(e => {
            resultsDiv.innerHTML = 'GIFler yüklenemedi. API anahtarınızı veya internet bağlantınızı kontrol edin.';
        });
    }

    function displayGifs(gifs) {
        const modal = document.getElementById('gifModal');
        const resultsDiv = document.getElementById('gifResults');
        if (!modal || !resultsDiv) return;

        resultsDiv.innerHTML = '';
        if (!gifs || gifs.length === 0) {
            resultsDiv.innerHTML = 'Sonuç bulunamadı.';
            return;
        }

        gifs.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif.media_formats.tinygif.url;
            img.title = gif.content_description;
            img.addEventListener('click', () => {
                const editorBox = modal.editorBox;
                const gifUrl = gif.media_formats.gif.url;
                modal.remove();
                simulateImageInsert(editorBox, gifUrl);
            });
            resultsDiv.appendChild(img);
        });
    }

    function simulateImageInsert(editorBox, imageUrl) {
        const insertImageBtn = editorBox.querySelector('.fr-command[data-cmd="insertImage"]');
        if (!insertImageBtn) {
            alert("Hata: Editörün 'Resim Ekle' düğmesi bulunamadı.");
            return;
        }
        insertImageBtn.click();

        let attempts = 0;
        const maxAttempts = 50;

        const intervalId = setInterval(() => {
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(intervalId);
                alert("Hata: Resim ekleme penceresi veya 'URL ile Ekle' sekmesi zamanında bulunamadı.");
                return;
            }

            const popup = document.querySelector('.fr-popup.fr-active');
            if (!popup) return;
            const byUrlButton = popup.querySelector('button[data-cmd="imageByURL"]');
            if (!byUrlButton) return;
            if (!byUrlButton.classList.contains('fr-active')) {
                byUrlButton.click();
            }

            const urlInput = popup.querySelector('.fr-image-by-url-layer.fr-active input[type="text"]');
            const submitButton = popup.querySelector('.fr-image-by-url-layer.fr-active button.fr-submit');

            if (urlInput && submitButton) {
                clearInterval(intervalId);
                urlInput.value = imageUrl;
                submitButton.click();
            }
        }, 50);
    }

    GM_addStyle(`
        #gifModal { position: fixed; z-index: 10001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
        #gifModalContent { background-color: #fefefe; color: #333; margin: auto; padding: 20px; border: 1px solid #888; border-radius: 8px; width: 90%; max-width: 640px; }
        #gifModalHeader { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
        #gifModalHeader h2 { margin: 0; color: #333; }
        #closeGifModal { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
        #gifSearch { width: 100%; box-sizing: border-box; padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px; }
        #gifResults { height: 400px; overflow-y: scroll; display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; background: #f9f9f9; border: 1px solid #eee; padding: 5px; box-sizing: border-box; }
        #gifResults img { flex-grow: 1; width: calc(33.33% - 10px); margin: 5px; cursor: pointer; border-radius: 4px; transition: transform 0.2s; object-fit: cover; aspect-ratio: 1 / 1; max-width: 180px;}
        #gifResults img:hover { transform: scale(1.05); }
    `);

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.fr-toolbar').forEach(addGifButton);
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();