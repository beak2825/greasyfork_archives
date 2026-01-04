// ==UserScript==
// @name         BloxyBet Username & Avatar Changer
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Altera TODAS as imagens do lado esquerdo em TODOS os VS
// @author       You
// @match        https://www.bloxybet.com/*
// @match        https://bloxybet.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553728/BloxyBet%20Username%20%20Avatar%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/553728/BloxyBet%20Username%20%20Avatar%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MY_USERNAME = 'cmn8';
    const MY_AVATAR_URL = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E0BAA34937A0755CA8D7EDE3413C174B-Png/420/420/AvatarHeadshot/Png/noFilter';

    // Função para encontrar TODOS os containers de VS
    function findAllVsContainers() {
        const containers = [];
        const allDivs = document.querySelectorAll('div');

        for (let div of allDivs) {
            for (let child of div.children) {
                if (child.textContent.trim() === 'Vs') {
                    const container = div.parentElement || div;
                    if (!containers.includes(container)) {
                        containers.push(container);
                    }
                }
            }
        }

        return containers;
    }

    // Função para processar UM container VS
    function processVsContainer(container) {
        const allImages = container.querySelectorAll('img');
        const centerX = window.innerWidth / 2;

        // Procura pela maior imagem do lado esquerdo
        let largestLeftImage = null;
        let largestSize = 0;

        allImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const size = rect.width * rect.height;

            // Se está no lado esquerdo e é maior que 80x80 pixels
            if (rect.left < centerX && rect.width > 80 && rect.height > 80) {
                if (size > largestSize) {
                    largestSize = size;
                    largestLeftImage = img;
                }
            }
        });

        // Substitui a imagem se não for a minha
        if (largestLeftImage && !largestLeftImage.src.includes('E0BAA34937A0755CA8D7EDE3413C174B')) {
            largestLeftImage.src = MY_AVATAR_URL;
            largestLeftImage.srcset = MY_AVATAR_URL;

            // Substitui o nome
            replaceUsername(container, largestLeftImage);
        }
    }

    // Função para substituir o nome
    function replaceUsername(container, targetImage) {
        const imgRect = targetImage.getBoundingClientRect();
        const allElements = container.querySelectorAll('*');

        allElements.forEach(element => {
            const rect = element.getBoundingClientRect();

            const isBelow = rect.top > imgRect.bottom && rect.top < imgRect.bottom + 100;
            const isAligned = Math.abs(rect.left - imgRect.left) < 150;

            if (isBelow && isAligned) {
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.nodeValue.trim();

                        if (text &&
                            text.length >= 3 &&
                            text.length <= 20 &&
                            text !== 'Vs' &&
                            !text.includes('Joining') &&
                            !text.includes('%') &&
                            !text.includes('#') &&
                            text !== MY_USERNAME) {

                            node.nodeValue = MY_USERNAME;
                        }
                    }
                }
            }
        });
    }

    // Função principal que processa TODOS os VS
    function replaceAllVsImages() {
        const containers = findAllVsContainers();

        if (containers.length > 0) {
            containers.forEach(container => {
                processVsContainer(container);
            });
        }
    }

    // Observer
    const observer = new MutationObserver(function(mutations) {
        replaceAllVsImages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Executa constantemente
    setInterval(replaceAllVsImages, 200);

    // Execuções iniciais
    setTimeout(replaceAllVsImages, 100);
    setTimeout(replaceAllVsImages, 300);
    setTimeout(replaceAllVsImages, 500);
    setTimeout(replaceAllVsImages, 1000);
    setTimeout(replaceAllVsImages, 2000);
    setTimeout(replaceAllVsImages, 3000);
    setTimeout(replaceAllVsImages, 5000);

})();