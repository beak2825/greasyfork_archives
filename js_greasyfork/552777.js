// ==UserScript==
// @name         Rule34 Futanari Hider (Smart Skip)
// @name:tr      Rule34 Futanari Gizleyici (Akıllı Atlatma)
// @namespace    https://greasyfork.org/en/users/1500762-kerimdemirkaynak
// @version      3.1
// @description  Hides posts with forbidden tags (e.g., 'futanari') and intelligently skips them in the post view based on your navigation direction.
// @description:tr Belirlenen yasaklı etiketlere sahip gönderileri gizler ve tekli gönderi görünümünde gezinme yönünüze göre otomatik olarak atlar.
// @author       Kerim Demirkaynak
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Frule34.xxx%2F
// @match        https://rule34.xxx/index.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552777/Rule34%20Futanari%20Hider%20%28Smart%20Skip%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552777/Rule34%20Futanari%20Hider%20%28Smart%20Skip%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Gizlenecek etiketleri bu listeye ekleyebilirsiniz.
    const forbiddenTags = [
        'futanari',
        'futa_on_male',
        'futa_on_futa',
        'dickgirl',
        'shemale',
        'gutanari' // ve diğer istemediğiniz etiketler
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const pageType = urlParams.get('s');

    // --- Izgara/Liste Görünümü İçin (Ana Sayfa) ---
    if (pageType === 'list' || !pageType) {
        const hideThumbnails = () => {
            document.querySelectorAll('span.thumb').forEach(thumb => {
                if (thumb.style.display === 'none') return;
                const img = thumb.querySelector('img.preview');
                if (img && img.title && forbiddenTags.some(tag => img.title.toLowerCase().includes(tag))) {
                    thumb.style.display = 'none';
                }
            });
        };

        const listObserver = new MutationObserver(hideThumbnails);
        const imageList = document.getElementById('post-list');
        if (imageList) {
            listObserver.observe(imageList, { childList: true, subtree: true });
        }
        hideThumbnails();
    }

    // --- Tekli Gönderi/Görüntüleme Sayfası İçin (Akıllı Atlatma) ---
    if (pageType === 'view') {
        let lastKnownDirection = 'next'; // Varsayılan yön

        const setupDirectionListeners = () => {
            const nextButton = document.getElementById('next_search_link');
            const prevButton = document.getElementById('prev_search_link');
            if (nextButton) nextButton.addEventListener('mousedown', () => { lastKnownDirection = 'next'; }, true);
            if (prevButton) prevButton.addEventListener('mousedown', () => { lastKnownDirection = 'prev'; }, true);
        };

        const checkAndSkip = () => {
            const tagList = document.getElementById('tag-sidebar');
            const image = document.getElementById('image');
            if (!tagList || !image) return;

            // Kontrol etmeden önce resmi görünür yap (bir önceki gizlenmiş olabilir)
            image.style.visibility = 'visible';

            const currentTags = Array.from(tagList.querySelectorAll('li a')).map(a => a.innerText.toLowerCase().replace(/ /g, '_'));
            const isForbidden = currentTags.some(currentTag => forbiddenTags.includes(currentTag));

            if (isForbidden) {
                // 1. Resmi anında gizle
                image.style.visibility = 'hidden';
                console.log(`Yasaklı etiket algılandı. Yön: ${lastKnownDirection}. Atlanıyor...`);

                // 2. Doğru yöndeki butona tıkla
                const buttonToClick = (lastKnownDirection === 'next')
                    ? document.getElementById('next_search_link')
                    : document.getElementById('prev_search_link');

                if (buttonToClick && buttonToClick.href && !buttonToClick.href.endsWith('#')) {
                    buttonToClick.click();
                }
            }
        };

        // Gözlemci: Sayfa içeriği (etiketler, resim) değiştiğinde tetiklenir
        const viewObserver = new MutationObserver(() => {
            checkAndSkip();
            // Butonlar da yeniden yüklenebileceği için dinleyicileri tekrar kur
            setupDirectionListeners();
        });

        const targetNode = document.getElementById('post-view');
        if (targetNode) {
            viewObserver.observe(targetNode, { childList: true, subtree: true });
        }

        // Sayfa ilk yüklendiğinde işlemleri başlat
        setupDirectionListeners();
        checkAndSkip(); // setTimeout olmadan daha hızlı çalışır
    }
})();