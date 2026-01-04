// ==UserScript==
// @name         Genius Lyrics Copier
// @namespace    https://github.com
// @version      1.9
// @description  Copy clean lyrics from Genius
// @match        https://genius.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/554582/Genius%20Lyrics%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/554582/Genius%20Lyrics%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.addEventListener('load', function() {
        setTimeout(addCopyButton, 3000);
    });
    
    function addCopyButton() {
        const lyricsContainers = document.querySelectorAll('div[data-lyrics-container="true"]');
        if (lyricsContainers.length === 0) return;
        
        const existingButton = document.getElementById('copy-lyrics-btn');
        if (existingButton) existingButton.remove();
        
        const copyButton = document.createElement('button');
        copyButton.id = 'copy-lyrics-btn';
        copyButton.innerHTML = '📋 Copy Lyrics';
        copyButton.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: #fffc00;
            color: #000;
            border: 2px solid #000;
            border-radius: 8px;
            padding: 10px 15px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 3px 3px 0 #000;
            transition: all 0.2s;
            font-family: inherit;
        `;
        
        copyButton.addEventListener('click', copyLyrics);
        document.body.appendChild(copyButton);
    }
    
    function copyLyrics() {
        const lyricsContainers = document.querySelectorAll('div[data-lyrics-container="true"]');
        let allLyricsText = '';
        
        lyricsContainers.forEach((container) => {
            const containerText = getCleanContainerText(container);
            if (containerText && containerText.length > 5) {
                allLyricsText += containerText;
            }
        });
        
        allLyricsText = finalCleanupWithSpacing(allLyricsText);
        
        if (!allLyricsText) return;
        
        GM_setClipboard(allLyricsText, 'text');
        
        const button = document.getElementById('copy-lyrics-btn');
        button.innerHTML = '✅ Copied!';
        button.style.background = '#90ee90';
        setTimeout(() => {
            button.innerHTML = '📋 Copy Lyrics';
            button.style.background = '#fffc00';
        }, 2000);
    }
    
    function getCleanContainerText(container) {
        const clone = container.cloneNode(true);
        
        const removeSelectors = [
            '.ReferentFragmentdesktop__ClickTarget-sc-110r0d9-0',
            '.InlineAnnotation__Footnote-sc-1k009w0-0',
            'a[data-id]',
            'button',
            '.ReactCollapse--collapse'
        ];
        
        removeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        let html = clone.innerHTML;
        html = html.replace(/<br\s*\/?>/gi, '\n');
        html = html.replace(/<\/div>/gi, '\n</div>');
        
        let text = html.replace(/<[^>]*>/g, '');
        text = text.replace(/\u2005/g, ' ');
        
        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .split('\n')
            .map(line => line.trim())
            .filter(line => {
                return !line.match(/^\d+\s+Contributors/) &&
                       !line.match(/Read More/) &&
                       !line.match(/You might also like/) &&
                       !line.match(/See Tech N9ne Live/) &&
                       !line.match(/Get tickets as low as/) &&
                       !line.match(/\bLyrics\b/i) &&
                       !line.match(/^\s*$/);
            })
            .join('\n');
        
        return text + '\n';
    }
    
    function finalCleanupWithSpacing(text) {
        const lines = text.split('\n');
        const cleanedLines = [];
        let lastLine = '';
        let lastWasVerseEnd = false;
        
        for (let i = 0; i < lines.length; i++) {
            let currentLine = lines[i].trim();
            
            if (!currentLine) {
                if (lastLine !== '') {
                    cleanedLines.push('');
                    lastLine = '';
                }
                continue;
            }
            
            const isSectionHeader = currentLine.match(/^\[(Verse|Chorus|Interlude|Hook|Bridge|Intro|Outro|Pre-Chorus)/i);
            
            if (isSectionHeader && lastWasVerseEnd) {
                if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] !== '') {
                    cleanedLines.push('');
                }
            }
            
            cleanedLines.push(currentLine);
            
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const nextIsSectionHeader = nextLine.match(/^\[(Verse|Chorus|Interlude|Hook|Bridge|Intro|Outro|Pre-Chorus)/i);
                
                if (nextIsSectionHeader && currentLine && !currentLine.match(/^\[/)) {
                    cleanedLines.push('');
                    lastWasVerseEnd = true;
                } else {
                    lastWasVerseEnd = false;
                }
            }
            
            lastLine = currentLine;
        }
        
        while (cleanedLines.length > 0 && cleanedLines[0] === '') {
            cleanedLines.shift();
        }
        while (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] === '') {
            cleanedLines.pop();
        }
        
        const finalLines = [];
        for (let i = 0; i < cleanedLines.length; i++) {
            const currentLine = cleanedLines[i];
            const isSectionHeader = currentLine.match(/^\[(Verse|Chorus|Interlude|Hook|Bridge|Intro|Outro|Pre-Chorus)/i);
            
            if (isSectionHeader && i > 0) {
                if (finalLines.length > 0 && finalLines[finalLines.length - 1] !== '') {
                    finalLines.push('');
                }
            }
            
            finalLines.push(currentLine);
            
            if (i + 1 < cleanedLines.length) {
                const nextLine = cleanedLines[i + 1];
                const nextIsSectionHeader = nextLine.match(/^\[(Verse|Chorus|Interlude|Hook|Bridge|Intro|Outro|Pre-Chorus)/i);
                const currentIsLocation = currentLine.match(/^(KC|Denmark|Alabama|Chicago|New York|Kansas|California|Turkey)$/i);
                const nextIsLocation = nextLine.match(/^(KC|Denmark|Alabama|Chicago|New York|Kansas|California|Turkey)$/i);
                
                if (nextIsSectionHeader && !currentIsLocation && !nextIsLocation) {
                    finalLines.push('');
                }
            }
        }
        
        return finalLines.join('\n').replace(/\u2005/g, ' ');
    }
    
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addCopyButton, 2000);
        }
    }).observe(document, { subtree: true, childList: true });
})();