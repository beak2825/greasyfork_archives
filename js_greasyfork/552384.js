// ==UserScript==
// @name         Tłumacz OPR-pl
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatycznie i wydajnie podmienia opisy zdolności na stronie Army Forge OPR.
// @author       22 (Optymalizacja by AI)
// @match        *://army-forge.onepagerules.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552384/T%C5%82umacz%20OPR-pl.user.js
// @updateURL https://update.greasyfork.org/scripts/552384/T%C5%82umacz%20OPR-pl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const jsonUrl = 'https://raw.githubusercontent.com/Kolodny22/opr-pl/refs/heads/main/tlumaczenia.json';

    // Funkcja do "ucieczki" znaków specjalnych w stringu, aby bezpiecznie użyć go w RegExp
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Funkcja przetwarzająca pojedynczy węzeł tekstowy
    function processTextNode(node, replacements, wordsRegex) {
        let text = node.nodeValue;
        let originalText = text;

        // Krok 1: Podmień całe opisy. To jest szybsze niż RegEx dla długich, dokładnych dopasowań.
        for (const originalDescription in replacements.descriptions) {
            if (text.includes(originalDescription)) {
                // Używamy funkcji replaceAll dla pewności, że wszystkie wystąpienia zostaną podmienione
                text = text.replaceAll(originalDescription, replacements.descriptions[originalDescription]);
            }
        }

        // Krok 2: Użyj jednego, pre-kompilowanego wyrażenia regularnego do podmiany wszystkich słów naraz.
        // To jest wielokrotnie szybsze niż tworzenie RegExp w pętli.
        if (wordsRegex) {
            text = text.replace(wordsRegex, (matchedWord) => {
                // Obsługa wielkości liter dzięki fladze 'i' w RegExp
                return replacements.words[matchedWord.toLowerCase()] || matchedWord;
            });
        }

        // Aktualizuj DOM tylko wtedy, gdy tekst faktycznie się zmienił
        if (text !== originalText) {
            node.nodeValue = text;
        }
    }

    // Zoptymalizowana funkcja do przechodzenia po DOM używająca TreeWalker API
    function traverseAndReplace(element, replacements, wordsRegex) {
        // TreeWalker jest natywnym i bardzo wydajnym sposobem na iterację po określonych typach węzłów
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            processTextNode(node, replacements, wordsRegex);
        }
    }

    // Pobieranie i przetwarzanie danych
    GM_xmlhttpRequest({
        method: "GET",
        url: jsonUrl,
        onload: function(response) {
            try {
                const replacements = JSON.parse(response.responseText);
                
                // Przygotuj dane do tłumaczenia, aby uniknąć powtarzania pracy
                const wordKeys = Object.keys(replacements.words || {});
                const wordsRegex = wordKeys.length > 0
                    ? new RegExp(`\\b(${wordKeys.map(escapeRegExp).join('|')})\\b`, 'gi')
                    : null;
                
                // Mapowanie kluczy na małe litery, aby dopasowanie było niewrażliwe na wielkość znaków
                const lowercasedWords = {};
                for (const key of wordKeys) {
                    lowercasedWords[key.toLowerCase()] = replacements.words[key];
                }
                replacements.words = lowercasedWords;


                // --- Główne wykonanie ---

                // 1. Przetłumacz treść, która już istnieje na stronie
                traverseAndReplace(document.body, replacements, wordsRegex);

                // 2. Ustaw MutationObserver do obserwowania przyszłych zmian w DOM
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        // Jeśli dodano nowe elementy, przeskanuj tylko te nowe elementy
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                // Sprawdzamy, czy węzeł jest elementem, aby uniknąć błędów
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    traverseAndReplace(node, replacements, wordsRegex);
                                }
                            }
                        }
                        // Jeśli zmieniła się treść istniejącego tekstu
                        else if (mutation.type === 'characterData') {
                             processTextNode(mutation.target, replacements, wordsRegex);
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });

            } catch (e) {
                console.error("Błąd podczas parsowania JSON:", e);
            }
        },
        onerror: function(response) {
            console.error("Błąd pobierania pliku JSON. Status:", response.status);
        }
    });
})();
