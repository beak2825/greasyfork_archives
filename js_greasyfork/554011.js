// ==UserScript==
// @name         ROBLOX Developer Products Preview
// @namespace    http://tampermonkey.net/
// @version      1337
// @description  Preview developer products on a ROBLOX game page (some may not be available for purchase in-game).
// @author       Andrew Oliver
// @match        https://www.roblox.com/games/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554011/ROBLOX%20Developer%20Products%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/554011/ROBLOX%20Developer%20Products%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previewButtonAdded = false;

    function getPlaceId(url) {
        const match = url.match(/\/games\/(\d+)/);
        return match ? match[1] : null;
    }

    async function init() {
        const placeId = getPlaceId(window.location.href);
        if (!placeId || previewButtonAdded) return;

        previewButtonAdded = true;

        async function getUniverseId(placeId) {
            const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
            while (true) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.universeId) return data.universeId;
                    }
                } catch (err) { console.error(err); }
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        async function getDeveloperProducts(universeId) {
            const url = `https://apis.roblox.com/developer-products/v2/universes/${universeId}/developerproducts?limit=100`;
            while (true) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        const products = [];
                        if (data.developerProducts && data.developerProducts.length > 0) {
                            for (const p of data.developerProducts) {
                                products.push({
                                    DisplayName: p.displayName || p.Name,
                                    PriceInRobux: p.PriceInRobux,
                                    DeveloperProductId: p.DeveloperProductId
                                });
                            }
                        }
                        return products;
                    }
                } catch (err) { console.error(err); }
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        async function getDeveloperProductImages(productIds) {
            if (productIds.length === 0) return {};
            const url = `https://thumbnails.roblox.com/v1/developer-products/icons?developerProductIds=${productIds.join(",")}&size=150x150&format=png&isCircular=false`;
            while (true) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        const images = {};
                        (data.data || []).forEach(item => images[item.targetId] = item.imageUrl);
                        return images;
                    }
                } catch (err) { console.error(err); }
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        let previewVisible = false;
        let previewContainer = null;
        let dataLoaded = false;
        let cachedProducts = [];
        let cachedGameUrl = "";

        const previewButton = document.createElement('button');
        previewButton.textContent = 'Preview Products';
        previewButton.style.position = 'fixed';
        previewButton.style.bottom = '30px';
        previewButton.style.right = '30px';
        previewButton.style.padding = '12px 22px';
        previewButton.style.fontSize = '16px';
        previewButton.style.background = '#28a745';
        previewButton.style.color = '#fff';
        previewButton.style.border = 'none';
        previewButton.style.borderRadius = '8px';
        previewButton.style.cursor = 'pointer';
        previewButton.style.zIndex = '99999';
        previewButton.style.fontWeight = "600";
        document.body.appendChild(previewButton);

        previewButton.addEventListener('click', async function handlePreviewClick() {
            if (!dataLoaded) {
                previewButton.disabled = true;
                const originalText = previewButton.textContent;
                previewButton.textContent = 'Loading...';

                try {
                    const gameUrl = window.location.href;
                    const universeId = await getUniverseId(placeId);
                    let productsList = await getDeveloperProducts(universeId);

                    const productIds = productsList.map(p => p.DeveloperProductId);
                    const imagesMap = await getDeveloperProductImages(productIds);
                    const placeholderImage = "https://tr.rbxcdn.com/180DAY-155b79f176f56ede3583d6c4bd4eefff/150/150/Hat/Webp/noFilter";

                    productsList.forEach(p => {
                        p.ImageUrl = imagesMap[p.DeveloperProductId] || placeholderImage;
                    });

                    cachedProducts = productsList;
                    cachedGameUrl = gameUrl;

                    buildPreviewDOM(cachedProducts, cachedGameUrl);
                    dataLoaded = true;

                    previewContainer.style.display = 'block';
                    previewVisible = true;
                } finally {
                    previewButton.textContent = originalText;
                    previewButton.disabled = false;
                }
                return;
            }

            if (previewContainer) {
                previewContainer.style.display = previewVisible ? 'none' : 'block';
                previewVisible = !previewVisible;
            }
        });

        function buildPreviewDOM(productsList, gameUrl) {
            const bodyClass = document.body.className;

            previewContainer = document.createElement('div');
            previewContainer.id = 'preview-products-container';
            previewContainer.style.position = 'fixed';
            previewContainer.style.top = '50%';
            previewContainer.style.left = '50%';
            previewContainer.style.transform = 'translate(-50%, -50%)';
            previewContainer.style.padding = '20px';
            previewContainer.style.borderRadius = '10px';
            previewContainer.style.zIndex = '100000';
            previewContainer.style.maxHeight = '80vh';
            previewContainer.style.width = '100%';
            previewContainer.style.maxWidth = '1200px';
            previewContainer.style.overflowY = 'auto';
            previewContainer.style.boxSizing = 'border-box';

            if (bodyClass.includes('dark-theme')) {
                previewContainer.style.backgroundColor = '#1e1e1e';
                previewContainer.style.color = '#f0f0f0';
                previewContainer.style.boxShadow = '0 0 15px rgba(4,4,8,0.25)';
            } else {
                previewContainer.style.backgroundColor = '#ffffff';
                previewContainer.style.color = '#111';
                previewContainer.style.boxShadow = '0 0 15px rgba(0,0,0,0.08)';
            }

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.textContent = '✕';
            closeBtn.setAttribute('aria-label', 'Close preview');
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '8px';
            closeBtn.style.right = '12px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '18px';
            closeBtn.style.background = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.color = bodyClass.includes('dark-theme') ? '#ddd' : '#444';
            closeBtn.style.padding = '0';
            closeBtn.style.lineHeight = '1';
            closeBtn.addEventListener('click', () => {
                previewContainer.style.display = 'none';
                previewVisible = false;
            });
            previewContainer.appendChild(closeBtn);

            const urlTitle = document.createElement('h3');
            urlTitle.textContent = 'Game URL:';
            previewContainer.appendChild(urlTitle);

            const urlP = document.createElement('p');
            urlP.textContent = gameUrl;
            previewContainer.appendChild(urlP);

            const dpTitle = document.createElement('h3');
            dpTitle.textContent = 'Developer Products:';
            previewContainer.appendChild(dpTitle);

            const ul = document.createElement('ul');
            ul.className = 'hlist store-cards gear-passes-container';
            ul.style.overflowX = 'auto';
            ul.style.whiteSpace = 'nowrap';
            ul.style.listStyle = 'none';
            ul.style.padding = '10px';
            ul.style.margin = '0';

            if (productsList.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No developer products found.';
                li.style.fontStyle = 'italic';
                li.style.color = bodyClass.includes('dark-theme') ? '#ccc' : '#666';
                ul.appendChild(li);
            } else {
                productsList.forEach(p => {
                    const li = document.createElement('li');
                    li.className = 'list-item real-game-pass';
                    li.style.display = 'inline-block';
                    li.style.marginRight = '12px';
                    li.style.verticalAlign = 'top';

                    const card = document.createElement('div');
                    card.className = 'store-card';
                    card.style.width = '150px';

                    const img = document.createElement('img');
                    img.src = p.ImageUrl;
                    img.alt = p.DisplayName;
                    img.style.width = '150px';
                    img.style.height = '150px';
                    img.style.backgroundColor = p.ImageUrl ? "transparent" : bodyClass.includes('dark-theme') ? "#2a2a2a" : "#f0f0f0";
                    card.appendChild(img);

                    const caption = document.createElement('div');
                    caption.className = 'store-card-caption';

                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'text-overflow store-card-name';
                    nameDiv.title = p.DisplayName;
                    nameDiv.textContent = p.DisplayName;
                    nameDiv.style.color = bodyClass.includes('dark-theme') ? '#f0f0f0' : '#111';
                    caption.appendChild(nameDiv);

                    const priceDiv = document.createElement('div');
                    priceDiv.className = 'store-card-price';
                    priceDiv.innerHTML = `<span class="icon-robux-16x16"></span> <span class="text-robux">${p.PriceInRobux}</span>`;
                    priceDiv.style.color = bodyClass.includes('dark-theme') ? '#ddd' : '#333';
                    caption.appendChild(priceDiv);

                    card.appendChild(caption);
                    li.appendChild(card);
                    ul.appendChild(li);
                });
            }

            previewContainer.appendChild(ul);
            previewContainer.style.display = 'none';
            document.body.appendChild(previewContainer);
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, {subtree: true, childList: true});

    init();
})();
