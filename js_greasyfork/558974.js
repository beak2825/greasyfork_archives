// ==UserScript==
// @name         Старый дизайн профилей [Catwar]
// @description  Данный код возвращает старый дизайн профилей в CatWar. Работает на оба домена.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://catwar.net/*
// @match        https://catwar.su/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558974/%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%D0%B9%20%5BCatwar%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/558974/%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%D0%B9%20%5BCatwar%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        setTimeout(applyOldDesign, 300);
    }, 800);

    function applyOldDesign() {
        const profileData = document.querySelector('p[data-cat]');
        if (!profileData) return;

        const playerId = profileData.getAttribute('data-cat');

        const universeBadge = document.querySelector('.info-point[title*="вселенная"]');
        if (universeBadge) {
            const universeTitle = universeBadge.getAttribute('title') || '';
            universeBadge.remove();

            const universeDiv = document.createElement('b');
            universeDiv.textContent = universeTitle;
            universeDiv.style.cssText = 'display: block; margin-bottom: 2px; color: inherit;';

            const branchP = document.querySelector('#branch p');
            if (branchP) {
                branchP.insertBefore(universeDiv, branchP.firstChild);
                branchP.insertBefore(document.createElement('br'), universeDiv.nextSibling);
            }
        }

        function extractFactionSystem() {
            const clanTab = document.querySelector('[data-tab-content="clan"]');
            if (!clanTab) return null;

            const textNodes = clanTab.querySelectorAll('.parsed');
            textNodes.forEach(node => {
                const walker = document.createTreeWalker(
                    node,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: function(textNode) {
                            if (textNode.textContent.includes('Ошибка:') ||
                                textNode.textContent.includes('открывающий тег') ||
                                textNode.textContent.includes('закрывающий тег')) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                );

                let currentNode;
                const nodesToRemove = [];
                while (currentNode = walker.nextNode()) {
                    nodesToRemove.push(currentNode);
                }

                nodesToRemove.forEach(textNode => {
                    textNode.parentNode.removeChild(textNode);
                });
            });

            const headerLink = clanTab.querySelector('a.headers');
            if (!headerLink) return null;

            const dataId = headerLink.getAttribute('data-id');
            const contentBlock = clanTab.querySelector(`.blocks[data-id="${dataId}"]`);

            if (!contentBlock) return null;

            const systemContainer = document.createElement('div');
            systemContainer.style.cssText = 'margin-top: 10px;';

            const clonedHeader = headerLink.cloneNode(true);
            const headerImg = clonedHeader.querySelector('img');
            if (headerImg) {
                headerImg.style.cssText = `
                    display: block;
                    max-width: 400px;
                    max-height: 400px;
                    cursor: pointer;
                    border: none;
                `;
            }
            clonedHeader.style.cssText = 'display: block; text-decoration: none;';

            const clonedContent = contentBlock.cloneNode(true);
            clonedContent.style.cssText = 'display: none; margin-top: 5px;';

            const contentImages = clonedContent.querySelectorAll('img');
            contentImages.forEach(img => {
                img.style.cssText = 'display: inline-block; max-width: 400px; max-height: 400px; margin: 2px; border: none;';
            });

            clonedHeader.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                clonedContent.style.display = clonedContent.style.display === 'none' ? 'block' : 'none';
            });

            systemContainer.appendChild(clonedHeader);
            systemContainer.appendChild(clonedContent);

            return systemContainer;
        }

        const factionSystem = extractFactionSystem();
        const avatarImg = document.querySelector('.avatar');
        const nameElement = document.querySelector('.profile-text big');
        const statusElement = document.querySelector('.profile-text font');

        if (avatarImg && nameElement) {
            document.querySelector('.view-profile').style.display = 'none';
            document.querySelector('.summary-profile').style.display = 'none';

            const branchP = document.querySelector('#branch p');
            if (branchP) {
                const universeEl = branchP.querySelector('b');
                let insertPoint = universeEl ? universeEl.nextSibling : branchP.firstChild;

                while (insertPoint && insertPoint.nodeType === 1 && insertPoint.tagName === 'BR') {
                    insertPoint = insertPoint.nextSibling;
                }

                const mainContainer = document.createElement('div');
                mainContainer.style.cssText = 'margin: 2px 0; overflow: hidden;';

                const leftColumn = document.createElement('div');
                leftColumn.style.cssText = 'float: left; margin-right: 15px; width: 400px;';

                const oldAvatar = avatarImg.cloneNode(true);
                oldAvatar.style.cssText = 'display: block; border: 2px solid pink; max-width: 400px; max-height: 400px; margin-bottom: 5px;';
                leftColumn.appendChild(oldAvatar);

                if (factionSystem) {
                    leftColumn.appendChild(factionSystem);
                }

                mainContainer.appendChild(leftColumn);

                const rightColumn = document.createElement('div');
                rightColumn.style.cssText = 'overflow: hidden; padding-top: 0;';

                const nameSpan = document.createElement('span');
                nameSpan.textContent = nameElement.textContent.trim();
                nameSpan.style.cssText = 'font-size: 18px; font-weight: normal; display: inline-block; vertical-align: middle; color: inherit;';

                let statusHTML = ' — [ ??? ]';
                if (statusElement) {
                    const statusClone = statusElement.cloneNode(true);
                    statusHTML = ` — [ ${statusClone.outerHTML} ]`;
                }

                rightColumn.innerHTML = nameSpan.outerHTML + statusHTML;
                mainContainer.appendChild(rightColumn);

                const clearDiv = document.createElement('div');
                clearDiv.style.clear = 'both';
                mainContainer.appendChild(clearDiv);

                if (insertPoint && insertPoint.parentNode) {
                    insertPoint.parentNode.insertBefore(mainContainer, insertPoint);
                } else {
                    branchP.appendChild(mainContainer);
                }
            }
        }

        const tabsContainer = document.querySelector('.tabs');
        const tabContentsContainer = document.querySelector('.tab-contents');

        let aboutContentWrapper = null;

        if (tabsContainer && tabContentsContainer) {
            let activeContent = null;
            let aboutContentExists = false;

            const aboutContent = tabContentsContainer.querySelector('[data-tab-content="about"]');
            if (aboutContent && aboutContent.querySelector('.parsed')) {
                activeContent = aboutContent.cloneNode(true);
                aboutContentExists = true;
            }

            if (!activeContent) {
                const achievementsContent = tabContentsContainer.querySelector('[data-tab-content="achievements"]');
                if (achievementsContent) {
                    activeContent = achievementsContent.cloneNode(true);
                }
            }

            if (activeContent) {
                activeContent.classList.remove('hidden');
                activeContent.style.display = 'block';

                aboutContentWrapper = document.createElement('div');
                aboutContentWrapper.style.cssText = `
                    margin: 15px 0;
                    padding: 15px 0;
                    border-top: 1px solid #ffffff;
                    border-bottom: 1px solid #ffffff;
                `;

                if (aboutContentExists) {
                    const aboutHeader = document.createElement('div');
                    aboutHeader.textContent = 'О себе:';
                    aboutHeader.style.cssText = `
                        font-weight: bold;
                        font-size: 16px;
                        margin-bottom: 12px;
                        color: inherit;
                    `;
                    aboutContentWrapper.appendChild(aboutHeader);
                }

                aboutContentWrapper.appendChild(activeContent);

                const infoTable = document.querySelector('table');
                if (infoTable && infoTable.parentNode) {
                    infoTable.parentNode.insertBefore(aboutContentWrapper, infoTable.nextSibling);
                }
            }

            tabsContainer.remove();
            tabContentsContainer.remove();
        }

        function getSiteLinkColor() {
            const footerLink = document.querySelector('#footer a');
            if (footerLink) {
                const color = window.getComputedStyle(footerLink).color;
                if (color && color !== 'rgb(0, 0, 0)') {
                    return color;
                }
            }
            return '#0066cc';
        }

        const siteLinkColor = getSiteLinkColor();
        const friendBtn = document.querySelector('a[href*="fae?f="]');
        const enemyBtn = document.querySelector('a[href*="fae?e="]');
        const isLoggedIn = !!document.querySelector('.kn9[title="Выход"]');

        const links = [
            { text: 'Блоги игрока', url: `blogs?author=${playerId}` },
            { text: 'Лента игрока', url: `sniff?author=${playerId}` },
            { text: 'Достижения игрока', url: `achievements?id=${playerId}` }
        ];

        if (isLoggedIn) {
            const playerName = nameElement ? nameElement.textContent.trim() : '';

            links.push(
                { text: 'Написать личное сообщение', url: `ls?new=${encodeURIComponent(playerName)}` },
                { text: 'Написать в приват', url: `chat?${playerId}` }
            );

            if (friendBtn) {
                links.push({
                    text: 'Добавить в список друзей',
                    url: friendBtn.getAttribute('href')
                });
            }

            if (enemyBtn) {
                links.push({
                    text: 'Добавить в список врагов',
                    url: enemyBtn.getAttribute('href')
                });
            }
        }

        const linksContainer = document.createElement('div');
        linksContainer.className = 'profile-links-old';
        linksContainer.style.cssText = 'margin-top: 15px; margin-bottom: 10px;';

        links.forEach(linkInfo => {
            const link = document.createElement('a');
            link.href = linkInfo.url;
            link.textContent = linkInfo.text;

            link.style.cssText = `
                display: block;
                margin: 5px 0;
                color: ${siteLinkColor} !important;
                text-decoration: underline !important;
                font-size: 14px;
            `;

            linksContainer.appendChild(link);
        });

        const medals = document.querySelectorAll('img[src*="medal/"]');

        if (medals.length > 0) {
            const lastMedal = medals[medals.length - 1];
            if (lastMedal && lastMedal.parentNode) {
                lastMedal.parentNode.insertBefore(linksContainer, lastMedal.nextSibling);
            }
        }
        else if (aboutContentWrapper && aboutContentWrapper.parentNode) {
            aboutContentWrapper.parentNode.insertBefore(linksContainer, aboutContentWrapper.nextSibling);
        }
        else {
            const infoTable = document.querySelector('table');
            if (infoTable && infoTable.parentNode) {
                infoTable.parentNode.insertBefore(linksContainer, infoTable.nextSibling);
            }
        }

        const oldActions = document.querySelector('.col-actions');
        if (oldActions) {
            oldActions.style.display = 'none';
        }

        const colStatuses = document.querySelector('.col-statuses');
        if (colStatuses) {
            colStatuses.style.display = 'none';
        }

        const branchP = document.querySelector('#branch p');
        if (branchP) {
            const allBr = branchP.querySelectorAll('br');
            if (allBr.length > 5) {
                for (let i = 2; i < allBr.length; i++) {
                    if (allBr[i].parentNode) {
                        allBr[i].parentNode.removeChild(allBr[i]);
                    }
                }
            }

            const audioScript = branchP.querySelector('script');
            if (audioScript) {
                audioScript.remove();
            }
        }
    }
})();