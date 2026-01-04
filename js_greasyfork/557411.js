// ==UserScript==
// @name         Hardcover.app - Goodreads, Anna's Archive & LibGen buttons
// @namespace    hardcover-editions-native-v2.2
// @version      2.3
// @description  Adds Goodreads, Anna's & LibGen buttons using the exact CSS classes of Hardcover's 'Select Edition' button.
// @match        https://hardcover.app/books/*/editions*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557411/Hardcoverapp%20-%20Goodreads%2C%20Anna%27s%20Archive%20%20LibGen%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/557411/Hardcoverapp%20-%20Goodreads%2C%20Anna%27s%20Archive%20%20LibGen%20buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Link oluşturucu
    function createUrl(type, isbn) {
        isbn = isbn.replace(/[^0-9X]/gi, '');
        if (type === 'goodreads') {
             return isbn.length === 10
                ? 'http://www.goodreads.com/review/isbn/' + isbn
                : 'https://www.goodreads.com/book/isbn?isbn=' + isbn;
        } else if (type === 'annas') {
            return 'https://annas-archive.org/search?q=' + isbn;
        } else if (type === 'libgen') {
            return 'https://libgen.is/search.php?req=' + isbn + '&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def';
        }
    }

    // Buton oluşturucu
    function createButton(text, url) {
        const button = document.createElement('a');

        // Sitenin kendi HTML'inden alınan, 'Select Edition' butonunun birebir sınıfları:
        button.className = 'cursor-pointer inline-flex items-center focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-ring border rounded-lg active:translate-y-1 transition-all w-fit bg-background text-foreground border-tertiary hover:bg-tertiary py-1 px-2 text-sm font-medium gap-2';

        // İçerik
        button.innerHTML = `<span>🏴‍☠️ ${text}</span>`;
        button.href = url;
        button.target = '_blank';

        // Link olduğu için alt çizgiyi kaldırmak dışında hiçbir stil eklemiyoruz.
        // Geri kalan her şeyi sitenin CSS'i halledecek.
        button.style.textDecoration = 'none';

        return button;
    }

    function processEditionCard(card) {
        if (card.dataset.buttonsAdded) return;

        const htmlContent = card.innerHTML;
        let isbnMatch = htmlContent.match(/ISBN\s*13:.*?(\d{13})/s);
        if (!isbnMatch) {
            isbnMatch = htmlContent.match(/ISBN\s*10:.*?(\d{9}[\dX])/s);
        }

        if (isbnMatch && isbnMatch[1]) {
            const isbn = isbnMatch[1];

            // Butonların ekleneceği kutuyu bul
            const actionContainer = card.querySelector('.mt-2.space-x-2.flex.flex-row');

            if (actionContainer) {
                // Renk parametrelerini kaldırdık, tamamen native stil kullanıyoruz
                const btnGR = createButton('GR', createUrl('goodreads', isbn));
                const btnAA = createButton('Anna', createUrl('annas', isbn));
                const btnLG = createButton('LibGen', createUrl('libgen', isbn));

                actionContainer.appendChild(btnGR);
                actionContainer.appendChild(btnAA);
                actionContainer.appendChild(btnLG);

                card.dataset.buttonsAdded = "true";
            }
        } else {
            card.dataset.buttonsAdded = "true";
        }
    }

    function runScanner() {
        const editionCards = document.querySelectorAll('div.divide-y > div.py-4');
        editionCards.forEach(card => {
            processEditionCard(card);
        });
    }

    const observer = new MutationObserver((mutations) => {
        runScanner();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(runScanner, 1500);

})();