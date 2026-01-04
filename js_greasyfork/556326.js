// ==UserScript==
// @name         AnimeOut Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  A modular Script to extract, modify, and copy links for 720p and 1080p sections.
// @author       Cozian
// @run-at       document-end
// @match        https://www.animeout.xyz/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556326/AnimeOut%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556326/AnimeOut%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // --- Configuration Variables ---
    let buttonSelection='';
    const qualityMap = {
        'HD': '720pLinks',
        'FHD': '1080pLinks'
    };

    

    function copyMyText(textData) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textData)
                .then(() => {
                    alert('All URLs successfully copied to clipboard!');
                })
                .catch(err => {
                    alert('Copy failed Retrying with Download txt file \n ERROR :'+err.message);
                    fallbackcopyhandle(textData);
                    //alert(textData);
                });
        } 
    }
    
    function fallbackcopyhandle(text) {
        
        let filename=document.title+' '+buttonSelection;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const anchorElement = document.createElement('a');
        anchorElement.href = url;
        anchorElement.download = filename;
        
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        URL.revokeObjectURL(url);
}
    
    function getNewHostname(input) {
        if (!input || input.trim() === '') {
            return 'pub9';
        }
        return input.trim();
    }

    function processLinks(linkElementId) {
        try {
            linkElementId=qualityMap[linkElementId];
            const userInput = prompt('Enter download subdomain (e.g., "pub9") or a full hostname (e.g., "https://pub9.animeout.com/anime/"). Leave blank for default "pub9".');
            const newHostnameBase = getNewHostname(userInput);
            
            buttonSelection=linkElementId;
            let targetElement = document.getElementById(linkElementId);
            
            if(!targetElement){
                for(let tag of document.querySelectorAll('p')){
                    if(tag?.textContent?.includes('Direct Download:') && tag.textContent.includes(linkElementId.slice(0, -5))){
                        targetElement= tag;
                        break;
                    }
                }
            }

            if (targetElement) {
                const elementContent = targetElement.innerHTML;
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(elementContent, 'text/html');
                
                const linkElements = doc.getElementsByTagName('a'); 
                
                let updatedHrefs = '';
                
                if (linkElements.length > 0) {
                    for (let i = 0; i < linkElements.length; i++) {
                        const originalHref = linkElements[i].getAttribute('href');
                        
                        if (originalHref) {
                            let updatedUrl = originalHref;

                            updatedUrl = updatedUrl.replace(/^http:\/\//i, 'https://');
                            
                            if (newHostnameBase.includes('.')) {
                                updatedUrl = newHostnameBase + updatedUrl.split('/').at(-1);
                            } else {
                                updatedUrl = updatedUrl.replace(/^https:\/\/[^.]+\./i, `https://${newHostnameBase}.`);
                            }

                            updatedHrefs += updatedUrl.replaceAll(' ','%20') + '\n';
                        }
                    }
                    copyMyText(updatedHrefs.trim());
                } else {
                    alert(`Error: No links (<a> tags) found inside the #${linkElementId} element.`);
                }
            } else {
                alert(`Error: Element #${linkElementId} was not found on the page.`);
            }
        } catch (error) {
            alert('An unexpected script error occurred during extraction: ' + error.message);
        }
    }

    // UI Part for the Buttons
    function createSimpleSnackBar(buttonLabels) {
    // Inject minimal CSS styles dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            .snackbar-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            }
            .all-button {
                min-width: 5rem;
                height: 5rem;
                border-radius: 10rem;
                cursor: pointer;
                background-color: rgba(139, 20, 133, 0.8);
                border: 1px solid rgba(63, 26, 230, 0.8);
                font-size: 16px;
                text-align: center;
            }
            .action-button {
                display: none;
                font-size: 14px;
            }
            .snackbar-container.is-open .action-button {
                display: block;
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.classList.add('snackbar-container');
        document.body.appendChild(container);

        const toggleButtons = () => {
            container.classList.toggle('is-open');
            mainButton.textContent = mainButton.textContent === '=' ? 'X' : '=';
        };
        // Create action buttons first so they appear above the main button
        buttonLabels.forEach(labelText => {
            const button = document.createElement('button');
            button.classList.add('action-button', 'all-button');
            button.textContent = labelText;
            button.onclick = () => {
                toggleButtons();
                processLinks(labelText);
            };
            container.appendChild(button);
        });

        // Then create the main button and append it last so it stays at the bottom
        const mainButton = document.createElement('button');
        mainButton.classList.add('all-button', 'main-button');
        mainButton.textContent = '=';
        mainButton.onclick = toggleButtons;
        container.appendChild(mainButton);
    }
    createSimpleSnackBar(['HD','FHD']);

})();