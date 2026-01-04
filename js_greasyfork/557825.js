// ==UserScript==
// @name         Open in Anna's Archive (Goodreads)
// @namespace    open-in-annas-archive-goodreads
// @version      2.0
// @description  Adds a button with dropdown to Goodreads book pages to redirect to Anna's Archive search page. Supports ISBN/ASIN/EAN/UPC/DOI/MD5/OCLC or title+author
// @match        https://www.goodreads.com/book/show/*
// @grant        none
// @author       vorm--
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557825/Open%20in%20Anna%27s%20Archive%20%28Goodreads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557825/Open%20in%20Anna%27s%20Archive%20%28Goodreads%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractAllIdentifiers() {
        var identifiers = {};
        var fullText = document.body.textContent || document.body.innerText || '';
        var seen = {};

        function addIdentifier(type, value) {
            if (value && !seen[type + ':' + value]) {
                if (!identifiers[type]) {
                    identifiers[type] = [];
                }
                identifiers[type].push(value);
                seen[type + ':' + value] = true;
            }
        }

        var jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < jsonLdScripts.length; i++) {
            try {
                var jsonData = JSON.parse(jsonLdScripts[i].textContent);
                if (jsonData['@type'] === 'Book' || jsonData.type === 'Book') {
                    if (jsonData.isbn) {
                        var isbn = jsonData.isbn.toString().replace(/-/g, '').trim();
                        if (isbn.length === 13) {
                            addIdentifier('ISBN-13', isbn);
                        } else if (isbn.length === 10) {
                            addIdentifier('ISBN-10', isbn);
                        } else {
                            addIdentifier('ISBN', isbn);
                        }
                    }
                    if (jsonData.identifier) {
                        if (Array.isArray(jsonData.identifier)) {
                            for (var j = 0; j < jsonData.identifier.length; j++) {
                                var id = jsonData.identifier[j];
                                if (typeof id === 'string') {
                                    var cleanId = id.replace(/-/g, '').trim();
                                    if (cleanId.match(/^[0-9]{13}$/)) {
                                        addIdentifier('ISBN-13', cleanId);
                                    } else if (cleanId.match(/^[0-9X]{10}$/)) {
                                        addIdentifier('ISBN-10', cleanId);
                                    } else if (cleanId.match(/^[A-Z0-9]{10}$/i)) {
                                        addIdentifier('ASIN', cleanId.toUpperCase());
                                    } else if (cleanId.match(/^10\./)) {
                                        addIdentifier('DOI', cleanId);
                                    } else if (cleanId.match(/^[0-9]{8,14}$/)) {
                                        addIdentifier('EAN', cleanId);
                                    }
                                } else if (id.propertyID) {
                                    var propId = id.propertyID.toLowerCase();
                                    var value = id.value.toString().trim();
                                    if (propId.includes('isbn')) {
                                        addIdentifier(propId.toUpperCase(), value.replace(/-/g, ''));
                                    } else if (propId.includes('asin')) {
                                        addIdentifier('ASIN', value.toUpperCase());
                                    } else if (propId.includes('doi')) {
                                        addIdentifier('DOI', value);
                                    } else if (propId.includes('oclc')) {
                                        addIdentifier('OCLC', value);
                                    }
                                }
                            }
                        } else if (typeof jsonData.identifier === 'string') {
                            var cleanId = jsonData.identifier.replace(/-/g, '').trim();
                            if (cleanId.match(/^[0-9]{13}$/)) {
                                addIdentifier('ISBN-13', cleanId);
                            } else if (cleanId.match(/^[0-9X]{10}$/)) {
                                addIdentifier('ISBN-10', cleanId);
                            }
                        }
                    }
                }
            } catch (e) {
            }
        }

        var metaIsbn = document.querySelector('meta[property="books:isbn"]');
        if (metaIsbn) {
            var isbn = metaIsbn.getAttribute('content').replace(/-/g, '').trim();
            if (isbn.length === 13) {
                addIdentifier('ISBN-13', isbn);
            } else if (isbn.length === 10) {
                addIdentifier('ISBN-10', isbn);
            } else {
                addIdentifier('ISBN', isbn);
            }
        }

        var metaAsin = document.querySelector('meta[name="ASIN"], meta[property="books:asin"]');
        if (metaAsin) {
            addIdentifier('ASIN', metaAsin.getAttribute('content').trim().toUpperCase());
        }

        var metaDoi = document.querySelector('meta[name="citation_doi"], meta[name="DOI"], meta[property="citation_doi"]');
        if (metaDoi) {
            addIdentifier('DOI', metaDoi.getAttribute('content').trim());
        }

        var isbnElements = document.querySelectorAll('[itemprop="isbn"]');
        for (var i = 0; i < isbnElements.length; i++) {
            var isbn = isbnElements[i].textContent.trim().replace(/-/g, '');
            if (isbn.length === 13) {
                addIdentifier('ISBN-13', isbn);
            } else if (isbn.length === 10) {
                addIdentifier('ISBN-10', isbn);
            } else {
                addIdentifier('ISBN', isbn);
            }
        }

        var asinElements = document.querySelectorAll('[data-asin], [itemprop="asin"], [data-amzn-asin]');
        for (var i = 0; i < asinElements.length; i++) {
            var asin = asinElements[i].getAttribute('data-asin') || 
                      (asinElements[i].getAttribute('itemprop') === 'asin' ? asinElements[i].textContent.trim() : null) ||
                      asinElements[i].getAttribute('data-amzn-asin');
            if (asin && asin.match(/^[A-Z0-9]{10}$/i)) {
                addIdentifier('ASIN', asin.toUpperCase());
            }
        }

        var detailsSection = document.querySelector('[data-testid="bookDetailsBox"]');
        if (detailsSection) {
            var text = detailsSection.textContent;
            var matches = text.matchAll(/(ISBN-13|ISBN-10|ISBN|ASIN|DOI|OCLC|EAN|UPC|MD5)[:\s]+([^\s\n]+)/gi);
            for (var match of matches) {
                var type = match[1].toUpperCase();
                var value = match[2].trim().replace(/-/g, '');
                if (type === 'ISBN-13' && value.match(/^[0-9]{13}$/)) {
                    addIdentifier('ISBN-13', value);
                } else if (type === 'ISBN-10' && value.match(/^[0-9X]{10}$/)) {
                    addIdentifier('ISBN-10', value);
                } else if (type === 'ISBN' && value.match(/^[0-9X]{10,13}$/)) {
                    if (value.length === 13) {
                        addIdentifier('ISBN-13', value);
                    } else {
                        addIdentifier('ISBN-10', value);
                    }
                } else if (type === 'ASIN' && value.match(/^[A-Z0-9]{10}$/i)) {
                    addIdentifier('ASIN', value.toUpperCase());
                } else if (type === 'DOI' && value.match(/^10\./)) {
                    addIdentifier('DOI', value);
                } else if (type === 'OCLC' && value.match(/^[0-9]+$/)) {
                    addIdentifier('OCLC', value);
                } else if (type === 'EAN' && value.match(/^[0-9]{8,14}$/)) {
                    addIdentifier('EAN', value);
                } else if (type === 'UPC' && value.match(/^[0-9]{12}$/)) {
                    addIdentifier('UPC', value);
                } else if (type === 'MD5' && value.match(/^[a-f0-9]{32}$/i)) {
                    addIdentifier('MD5', value.toLowerCase());
                }
            }
        }

        var bookDetails = document.querySelector('.BookPage__rightColumn');
        if (bookDetails) {
            var text = bookDetails.textContent;
            var matches = text.matchAll(/(ISBN-13|ISBN-10|ISBN|ASIN|DOI|OCLC|EAN|UPC|MD5)[:\s]+([^\s\n]+)/gi);
            for (var match of matches) {
                var type = match[1].toUpperCase();
                var value = match[2].trim().replace(/-/g, '');
                if (type === 'ISBN-13' && value.match(/^[0-9]{13}$/)) {
                    addIdentifier('ISBN-13', value);
                } else if (type === 'ISBN-10' && value.match(/^[0-9X]{10}$/)) {
                    addIdentifier('ISBN-10', value);
                } else if (type === 'ISBN' && value.match(/^[0-9X]{10,13}$/)) {
                    if (value.length === 13) {
                        addIdentifier('ISBN-13', value);
                    } else {
                        addIdentifier('ISBN-10', value);
                    }
                } else if (type === 'ASIN' && value.match(/^[A-Z0-9]{10}$/i)) {
                    addIdentifier('ASIN', value.toUpperCase());
                } else if (type === 'DOI' && value.match(/^10\./)) {
                    addIdentifier('DOI', value);
                } else if (type === 'OCLC' && value.match(/^[0-9]+$/)) {
                    addIdentifier('OCLC', value);
                } else if (type === 'EAN' && value.match(/^[0-9]{8,14}$/)) {
                    addIdentifier('EAN', value);
                } else if (type === 'UPC' && value.match(/^[0-9]{12}$/)) {
                    addIdentifier('UPC', value);
                } else if (type === 'MD5' && value.match(/^[a-f0-9]{32}$/i)) {
                    addIdentifier('MD5', value.toLowerCase());
                }
            }
        }

        var isbn13Matches = fullText.matchAll(/ISBN-13[:\s]+([0-9-]{13,17})/gi);
        for (var match of isbn13Matches) {
            addIdentifier('ISBN-13', match[1].replace(/-/g, '').trim());
        }

        var isbn10Matches = fullText.matchAll(/ISBN-10[:\s]+([0-9X-]{10,13})/gi);
        for (var match of isbn10Matches) {
            addIdentifier('ISBN-10', match[1].replace(/-/g, '').trim());
        }

        var isbnMatches = fullText.matchAll(/ISBN[:\s]+([0-9X-]{10,17})/gi);
        for (var match of isbnMatches) {
            var isbn = match[1].replace(/-/g, '').trim();
            if (isbn.length === 13) {
                addIdentifier('ISBN-13', isbn);
            } else if (isbn.length === 10) {
                addIdentifier('ISBN-10', isbn);
            }
        }

        var asinMatches = fullText.matchAll(/ASIN[:\s]+([A-Z0-9]{10})/gi);
        for (var match of asinMatches) {
            addIdentifier('ASIN', match[1].toUpperCase());
        }

        var doiMatches = fullText.matchAll(/DOI[:\s]+(10\.[^\s\n]+)/gi);
        for (var match of doiMatches) {
            addIdentifier('DOI', match[1].trim());
        }

        var oclcMatches = fullText.matchAll(/OCLC[:\s]+([0-9]+)/gi);
        for (var match of oclcMatches) {
            addIdentifier('OCLC', match[1].trim());
        }

        var eanMatches = fullText.matchAll(/EAN[:\s]+([0-9]{8,14})/gi);
        for (var match of eanMatches) {
            addIdentifier('EAN', match[1].trim());
        }

        var upcMatches = fullText.matchAll(/UPC[:\s]+([0-9]{12})/gi);
        for (var match of upcMatches) {
            addIdentifier('UPC', match[1].trim());
        }

        var md5Matches = fullText.matchAll(/MD5[:\s]+([a-f0-9]{32})/gi);
        for (var match of md5Matches) {
            addIdentifier('MD5', match[1].toLowerCase().trim());
        }

        var amazonLinks = document.querySelectorAll('a[href*="amazon"], a[href*="amzn"]');
        for (var i = 0; i < amazonLinks.length; i++) {
            var href = amazonLinks[i].getAttribute('href');
            var asinMatch = href.match(/[\/dp\/gp\/product\/]([A-Z0-9]{10})/i);
            if (asinMatch) {
                addIdentifier('ASIN', asinMatch[1].toUpperCase());
            }
        }

        var allLinks = document.querySelectorAll('a[href]');
        for (var i = 0; i < allLinks.length; i++) {
            var href = allLinks[i].getAttribute('href');
            if (href) {
                if ((href.includes('amazon') || href.includes('amzn'))) {
                    var asinMatch = href.match(/[\/dp\/gp\/product\/]([A-Z0-9]{10})/i);
                    if (asinMatch) {
                        addIdentifier('ASIN', asinMatch[1].toUpperCase());
                    }
                }
                if (href.includes('doi.org') || href.includes('dx.doi.org')) {
                    var doiMatch = href.match(/10\.[^\s\/]+/);
                    if (doiMatch) {
                        addIdentifier('DOI', doiMatch[0]);
                    }
                }
            }
        }

        var standaloneAsin = fullText.match(/\b([B][A-Z0-9]{9})\b/);
        if (standaloneAsin) {
            addIdentifier('ASIN', standaloneAsin[1].toUpperCase());
        }

        return identifiers;
    }

    function extractTitleAndAuthor() {
        var title = null;
        var author = null;

        var jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < jsonLdScripts.length; i++) {
            try {
                var jsonData = JSON.parse(jsonLdScripts[i].textContent);
                if (jsonData['@type'] === 'Book' || jsonData.type === 'Book') {
                    if (jsonData.name) {
                        title = jsonData.name;
                    }
                    if (jsonData.author && jsonData.author.length > 0) {
                        if (typeof jsonData.author[0] === 'string') {
                            author = jsonData.author[0];
                        } else if (jsonData.author[0].name) {
                            author = jsonData.author[0].name;
                        }
                    }
                    if (title && author) break;
                }
            } catch (e) {
            }
        }

        if (!title) {
            var titleElement = document.querySelector('h1[data-testid="bookTitle"]');
            if (!titleElement) {
                titleElement = document.querySelector('h1.BookPageTitleSection__title');
            }
            if (!titleElement) {
                titleElement = document.querySelector('h1');
            }
            if (titleElement) {
                title = titleElement.textContent.trim();
            }
        }

        if (!author) {
            var authorLink = document.querySelector('a[data-testid="name"]');
            if (!authorLink) {
                authorLink = document.querySelector('.BookPageTitleSection__author a');
            }
            if (!authorLink) {
                authorLink = document.querySelector('[itemprop="author"] a');
            }
            if (authorLink) {
                author = authorLink.textContent.trim();
            }
        }

        if (title && author) {
            return title + ' ' + author;
        }
        return title || author || null;
    }

    function redirectToAnnasArchive(searchQuery) {
        if (!searchQuery) {
            alert("No search query provided.");
            return;
        }

        var annasArchiveUrl = 'https://annas-archive.org/search?q=' + encodeURIComponent(searchQuery);
        window.open(annasArchiveUrl, '_blank');
    }

    function createDropdownMenu(identifiers, titleAuthor) {
        var menu = document.createElement('div');
        menu.className = 'DropdownMenu';
        menu.style.position = 'absolute';
        menu.style.top = '100%';
        menu.style.left = '0';
        menu.style.right = '0';
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ddd';
        menu.style.borderRadius = '4px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        menu.style.zIndex = '1000';
        menu.style.maxHeight = '300px';
        menu.style.overflowY = 'auto';
        menu.style.display = 'none';
        menu.style.marginTop = '4px';

        var priorityOrder = ['ISBN-13', 'ISBN-10', 'ISBN', 'ASIN', 'DOI', 'OCLC', 'EAN', 'UPC', 'MD5'];
        var hasItems = false;

        for (var i = 0; i < priorityOrder.length; i++) {
            var type = priorityOrder[i];
            if (identifiers[type] && identifiers[type].length > 0) {
                for (var j = 0; j < identifiers[type].length; j++) {
                    var value = identifiers[type][j];
                    var item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'DropdownMenuItem';
                    item.style.width = '100%';
                    item.style.textAlign = 'left';
                    item.style.padding = '8px 12px';
                    item.style.border = 'none';
                    item.style.backgroundColor = 'transparent';
                    item.style.cursor = 'pointer';
                    item.style.fontSize = '14px';
                    item.textContent = type + ': ' + value;
                    item.onclick = function(query) {
                        return function() {
                            redirectToAnnasArchive(query);
                            menu.style.display = 'none';
                        };
                    }(value);
                    item.onmouseenter = function() {
                        this.style.backgroundColor = '#f5f5f5';
                    };
                    item.onmouseleave = function() {
                        this.style.backgroundColor = 'transparent';
                    };
                    menu.appendChild(item);
                    hasItems = true;
                }
            }
        }

        if (titleAuthor) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'DropdownMenuItem';
            item.style.width = '100%';
            item.style.textAlign = 'left';
            item.style.padding = '8px 12px';
            item.style.border = 'none';
            item.style.borderTop = '1px solid #eee';
            item.style.backgroundColor = 'transparent';
            item.style.cursor = 'pointer';
            item.style.fontSize = '14px';
            item.textContent = 'Title + Author: ' + titleAuthor;
            item.onclick = function(query) {
                return function() {
                    redirectToAnnasArchive(query);
                    menu.style.display = 'none';
                };
            }(titleAuthor);
            item.onmouseenter = function() {
                this.style.backgroundColor = '#f5f5f5';
            };
            item.onmouseleave = function() {
                this.style.backgroundColor = 'transparent';
            };
            menu.appendChild(item);
            hasItems = true;
        }

        if (!hasItems) {
            var item = document.createElement('div');
            item.style.padding = '8px 12px';
            item.style.color = '#999';
            item.style.fontSize = '14px';
            item.textContent = 'No identifiers found';
            menu.appendChild(item);
        }

        return menu;
    }

    function createButton() {
        var identifiers = extractAllIdentifiers();
        var titleAuthor = extractTitleAndAuthor();
        
        var hasIdentifiers = false;
        for (var key in identifiers) {
            if (identifiers[key].length > 0) {
                hasIdentifiers = true;
                break;
            }
        }

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'BookActions__button';
        buttonContainer.style.position = 'relative';

        var buttonGroup = document.createElement('div');
        buttonGroup.className = 'ButtonGroup ButtonGroup--block';
        buttonGroup.style.position = 'relative';

        var mainButtonWrapper = document.createElement('div');
        mainButtonWrapper.className = 'Button__container Button__container--block';

        var mainButton = document.createElement('button');
        mainButton.type = 'button';
        mainButton.className = 'Button Button--buy Button--medium Button--block';
        mainButton.setAttribute('aria-label', 'Open in Anna\'s Archive, link, opens in new tab');
        mainButton.setAttribute('role', 'link');

        var labelItem = document.createElement('span');
        labelItem.className = 'Button__labelItem';
        
        var defaultQuery = null;
        var priorityOrder = ['ISBN-13', 'ISBN-10', 'ISBN', 'ASIN', 'DOI', 'OCLC', 'EAN', 'UPC', 'MD5'];
        for (var i = 0; i < priorityOrder.length; i++) {
            var type = priorityOrder[i];
            if (identifiers[type] && identifiers[type].length > 0) {
                defaultQuery = identifiers[type][0];
                break;
            }
        }
        if (!defaultQuery && titleAuthor) {
            defaultQuery = titleAuthor;
        }

        if (defaultQuery) {
            labelItem.textContent = '🏴‍☠️ Open in Anna\'s Archive';
            mainButton.onclick = function(query) {
                return function() {
                    redirectToAnnasArchive(query);
                };
            }(defaultQuery);
        } else {
            labelItem.textContent = '🏴‍☠️ Open in Anna\'s Archive';
            mainButton.onclick = function() {
                alert("No identifiers found.");
            };
        }

        var emptyLabelItem = document.createElement('span');
        emptyLabelItem.className = 'Button__labelItem';

        mainButton.appendChild(labelItem);
        mainButton.appendChild(emptyLabelItem);

        mainButtonWrapper.appendChild(mainButton);
        buttonGroup.appendChild(mainButtonWrapper);

        if (hasIdentifiers || titleAuthor) {
            var dropdownWrapper = document.createElement('div');
            dropdownWrapper.className = 'Button__container';
            
            var dropdownButton = document.createElement('button');
            dropdownButton.type = 'button';
            dropdownButton.className = 'Button Button--buy Button--medium Button--rounded';
            dropdownButton.setAttribute('aria-label', 'More options to search Anna\'s Archive, Menu pop up');
            
            var chevronIcon = document.createElement('span');
            chevronIcon.className = 'Button__labelItem';
            chevronIcon.innerHTML = '<i class="Icon ChevronIcon"><svg viewBox="0 0 24 24"><path d="M8.70710678,9.27397892 C8.31658249,8.90867369 7.68341751,8.90867369 7.29289322,9.27397892 C6.90236893,9.63928415 6.90236893,10.2315609 7.29289322,10.5968662 L12,15 L16.7071068,10.5968662 C17.0976311,10.2315609 17.0976311,9.63928415 16.7071068,9.27397892 C16.3165825,8.90867369 15.6834175,8.90867369 15.2928932,9.27397892 L12,12.3542255 L8.70710678,9.27397892 Z" transform="rotate(0 12 12)"></path></svg></i>';
            
            dropdownButton.appendChild(chevronIcon);
            
            var dropdownMenu = createDropdownMenu(identifiers, titleAuthor);
            buttonGroup.appendChild(dropdownMenu);
            
            dropdownButton.onclick = function(e) {
                e.stopPropagation();
                if (dropdownMenu.style.display === 'none' || !dropdownMenu.style.display) {
                    dropdownMenu.style.display = 'block';
                } else {
                    dropdownMenu.style.display = 'none';
                }
            };
            
            dropdownWrapper.appendChild(dropdownButton);
            buttonGroup.appendChild(dropdownWrapper);
        }

        document.addEventListener('click', function(e) {
            if (!buttonGroup.contains(e.target)) {
                var menus = document.querySelectorAll('.DropdownMenu');
                for (var i = 0; i < menus.length; i++) {
                    menus[i].style.display = 'none';
                }
            }
        });

        buttonContainer.appendChild(buttonGroup);

        return buttonContainer;
    }

    function insertButton() {
        var bookActions = document.querySelector('.BookActions');
        if (!bookActions) {
            return;
        }

        var existingButtons = bookActions.querySelectorAll('.BookActions__button');
        if (existingButtons.length === 0) {
            return;
        }

        var buyButton = null;
        for (var i = 0; i < existingButtons.length; i++) {
            var button = existingButtons[i];
            var buyButtonElement = button.querySelector('button[aria-label*="Buy on Amazon"]');
            if (buyButtonElement) {
                buyButton = button;
                break;
            }
        }

        if (!buyButton) {
            var lastButton = existingButtons[existingButtons.length - 1];
            buyButton = lastButton;
        }

        if (bookActions.querySelector('button[aria-label*="Anna\'s Archive"]')) {
            return;
        }

        var annasArchiveButton = createButton();

        if (buyButton && buyButton.nextSibling) {
            buyButton.parentNode.insertBefore(annasArchiveButton, buyButton.nextSibling);
        } else if (buyButton) {
            buyButton.parentNode.appendChild(annasArchiveButton);
        } else {
            bookActions.appendChild(annasArchiveButton);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }

    var observer = new MutationObserver(function (mutations) {
        var bookActions = document.querySelector('.BookActions');
        if (bookActions && !bookActions.querySelector('button[aria-label*="Anna\'s Archive"]')) {
            insertButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
