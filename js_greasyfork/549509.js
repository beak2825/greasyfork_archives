// ==UserScript==
// @name         iNaturalist Street View Extension
// @namespace    https://greasyfork.org/users/1514977
// @version      2.12
// @description  Adds the buttons and radius input in Google Maps Street View to find nearby observations and species on iNaturalist.
// @author       ChatGPT, Alok, KaKa
// @include      *://maps.google.com/*
// @include      *://*.google.*/maps/*
// @icon         https://www.svgrepo.com/show/407400/seedling.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549509/iNaturalist%20Street%20View%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/549509/iNaturalist%20Street%20View%20Extension.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForStreetViewContainer(callback) {
        const checkExist = setInterval(function () {
            const svContainer = document.querySelector('canvas');
            if (svContainer && window.location.href.includes('@')) {
                clearInterval(checkExist);
                callback();
            }
        }, 1000);
    }

    function createInterface() {
        if (document.getElementById('inat-container')) return;

        // === TOGGLE BUTTON ===
        const toggleBtn = document.createElement('img');
        toggleBtn.src = 'https://static.inaturalist.org/wiki_page_attachments/3154-medium.png';
        toggleBtn.id = 'inat-toggle-btn';
        toggleBtn.title = 'Toggle iNaturalist Panel';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 118px;
            right: 16px;
            width: 48px;
            height: 48px;
            z-index: 10000;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            background-color: white;
            padding: 4px;
        `;

        document.body.appendChild(toggleBtn);

        // === MAIN PANEL ===
        const container = document.createElement('div');
        container.id = 'inat-container';
        container.style.position = 'fixed';
        container.style.top = '178px';
        container.style.right = '16px';
        container.style.zIndex = 9999;
        container.style.padding = '10px';
        container.style.backgroundColor = 'rgba(240, 255, 240, 0.95)';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.width = '260px';
        container.style.display = 'none'; // hidden by default

        // Toggle logic
        toggleBtn.addEventListener('click', () => {
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
                popoutBtn.style.display = 'none'; // 👈 hide when panel closes
            }
        });

        // === Rest of UI ===
        const button = document.createElement('button');
        button.id = 'inat-button';
        button.innerText = 'Find Nearby Observations';
        button.style.cssText = 'display:block;width:100%;padding:10px;margin-bottom:8px;background-color:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;text-shadow:2px 2px 5px rgba(0,0,0,0.5);';

        const speciesButton = document.createElement('button');
        speciesButton.id = 'inat-species-button';
        speciesButton.innerText = 'Show Nearby Species';
        speciesButton.style.cssText = 'display:block;width:100%;padding:10px;margin-bottom:8px;background-color:#2196F3;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;text-shadow:2px 2px 5px rgba(0,0,0,0.5);';

        const radiusLabel = document.createElement('label');
        radiusLabel.innerText = 'Search Radius (km):';
        radiusLabel.style.fontSize = '12px';
        radiusLabel.style.display = 'block';
        radiusLabel.style.marginBottom = '4px';

        const radiusInput = document.createElement('input');
        radiusInput.type = 'number';
        radiusInput.id = 'inat-radius';
        radiusInput.placeholder = '1';
        radiusInput.min = '0.1';
        radiusInput.step = '0.1';
        radiusInput.style.cssText = 'width:50%;padding:6px;font-size:14px;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;';

        // === Load saved radius if available ===
        const savedRadius = localStorage.getItem('inat-radius');
        if (savedRadius) {
            radiusInput.value = savedRadius;
        }

        // === Save radius whenever it changes ===
        radiusInput.addEventListener('input', () => {
            if (radiusInput.value && parseFloat(radiusInput.value) > 0) {
                localStorage.setItem('inat-radius', radiusInput.value);
            }
        });

        const taxonLabel = document.createElement('label');
        taxonLabel.innerText = 'Taxon Group:';
        taxonLabel.style.fontSize = '12px';
        taxonLabel.style.display = 'block';
        taxonLabel.style.marginBottom = '4px';

        const taxonSelect = document.createElement('select');
        taxonSelect.id = 'inat-taxon-select';
        taxonSelect.style.cssText = 'width:100%;padding:6px;font-size:14px;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;';

        const taxonOptions = [
            { label: 'Plants', value: '47126' },
            { label: 'Animals', value: '1' },
            { label: 'Fungi', value: '47170' },
            { label: 'Chromista', value: '48222' },
            { label: 'Enter taxon ID', value: 'custom' }
        ];

        taxonOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            taxonSelect.appendChild(option);
        });

        const customTaxonInput = document.createElement('input');
        customTaxonInput.type = 'number';
        customTaxonInput.id = 'inat-custom-taxon';
        customTaxonInput.placeholder = 'Enter taxon ID';
        customTaxonInput.style.cssText = 'width:50%;padding:6px;font-size:14px;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;display:none;';

        // === INFO BUTTON ===
        const infoBtn = document.createElement('span');
        infoBtn.innerText = 'ℹ️';
        infoBtn.title = 'About Taxon IDs';
        infoBtn.style.cssText = `
            cursor: pointer;
            font-size: 18px;
            margin-bottom: 10px;
            margin-left: 1px;
            display: none; /* hidden by default */
        `;
        // === INPUT + INFO WRAPPER ===
        const taxonInputWrapper = document.createElement('div');
        taxonInputWrapper.style.cssText = `
            display: flex;
            align-items: center;
        `;
        taxonInputWrapper.appendChild(customTaxonInput);
        taxonInputWrapper.appendChild(infoBtn);

        // === Load saved taxon selection ===
        const savedTaxon = localStorage.getItem('inat-taxon-select');
        const savedCustomTaxon = localStorage.getItem('inat-custom-taxon');
        if (savedTaxon) {
            taxonSelect.value = savedTaxon;
            if (savedTaxon === 'custom' && savedCustomTaxon) {
                customTaxonInput.value = savedCustomTaxon;
                customTaxonInput.style.display = 'block';
                infoBtn.style.display = 'inline';
            }
        }

        // === Save taxon selection whenever it changes ===
        taxonSelect.addEventListener('change', () => {
            localStorage.setItem('inat-taxon-select', taxonSelect.value);
            customTaxonInput.style.display = taxonSelect.value === 'custom' ? 'block' : 'none';
            infoBtn.style.display = taxonSelect.value === 'custom' ? 'inline' : 'none';
            repositionPopoutBtn();
        });

        customTaxonInput.addEventListener('input', () => {
            if (customTaxonInput.value) {
                localStorage.setItem('inat-custom-taxon', customTaxonInput.value);
            }
        });

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'inat-species-results';
        resultsContainer.style.cssText = `
            max-height:300px;
            overflow-y:auto;
            font-size:13px;
            background-color:white;
            padding:8px;
            border:1px solid #ccc;
            border-radius:6px;
            box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);
            display:none;
            position: relative; /* needed for absolute button */
        `;

        // === POP OUT BUTTON (hidden by default) ===
        const popoutBtn = document.createElement('div');
        popoutBtn.innerHTML = '&#x26F6;'; // ⛶ expand icon
        popoutBtn.title = 'Expand Species List';
        popoutBtn.style.cssText = `
            position: absolute;
            font-size: 16px;
            color: #333;
            background: rgba(255,255,255,0.85);
            border: 1px solid #aaa;
            border-radius: 4px;
            padding: 2px 6px;
            cursor: pointer;
            z-index: 10;
            display: none; /* start hidden */
        `;
        container.appendChild(popoutBtn);

        // === Function to reposition the button relative to resultsContainer ===
        function repositionPopoutBtn() {
            popoutBtn.style.top = (resultsContainer.offsetTop + 4) + 'px';
            popoutBtn.style.left =
                (resultsContainer.offsetLeft + 4) + 'px';
        }

        // === FULLSCREEN SPECIES PANEL ===
        const fullscreenPanel = document.createElement('div');
        fullscreenPanel.id = 'inat-fullscreen-panel';
        fullscreenPanel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 30000;
        `;

        const fullscreenContent = document.createElement('div');
        fullscreenContent.className = 'species-grid';
        fullscreenContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 90%;
            max-height: 85%;
            overflow-y: auto;
        `;

        // Add responsive CSS rules
        const style = document.createElement('style');
        style.textContent = `
          #inat-fullscreen-panel .species-grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }

          @media (min-width: 1200px) {
            #inat-fullscreen-panel .species-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }
        `;
        document.head.appendChild(style);

        const fullscreenClose = document.createElement('div');
        fullscreenClose.innerHTML = '&times;';
        fullscreenClose.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 32px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            z-index: 30001;
        `;

        fullscreenPanel.appendChild(fullscreenContent);
        fullscreenPanel.appendChild(fullscreenClose);
        document.body.appendChild(fullscreenPanel);

        // === OPEN FULLSCREEN (rebuild species cards in grid) ===
        popoutBtn.addEventListener('click', () => {
            fullscreenContent.innerHTML = '';

            // only iterate the actual species item containers
            const items = resultsContainer.querySelectorAll('.inat-species-item');
            items.forEach(parent => {
                const imgEl = parent.querySelector('img');
                const linkEl = parent.querySelector('a');
                const countEl = parent.querySelector('.inat-species-count');

                const card = document.createElement('div');
                card.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                `;

                // Only add image if it exists and is visible
                if (imgEl && imgEl.src && imgEl.style.display !== 'none') {
                    const img = document.createElement('img');
                    img.src = imgEl.src;
                    img.style.cssText = `
                        width: 180px;
                        height: 180px;
                        object-fit: cover;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        margin-bottom: 6px;
                        cursor: pointer;
                    `;
                    img.addEventListener('click', () => {
                        // use the parent's img src and try to show original
                        const src = (parent.querySelector('img')?.src || '').replace('medium', 'original');
                        lightboxImg.src = src || (parent.querySelector('img')?.src || '');
                        lightbox.style.display = 'flex';
                    });
                    card.appendChild(img);
                } else {
                    // nicer look for cards without images
                    card.style.justifyContent = 'center';
                    card.style.paddingTop = '18px';
                    card.style.paddingBottom = '18px';
                }

                if (linkEl) {
                    const link = linkEl.cloneNode(true);
                    link.style.marginBottom = '4px';
                    card.appendChild(link);
                }

                if (countEl) {
                    const count = countEl.cloneNode(true);
                    card.appendChild(count);
                }

                fullscreenContent.appendChild(card);
            });

            fullscreenPanel.style.display = 'flex';
        });

        // === CLOSE FULLSCREEN ===
        fullscreenClose.addEventListener('click', () => {
            fullscreenPanel.style.display = 'none';
        });
        fullscreenPanel.addEventListener('click', (e) => {
            if (e.target === fullscreenPanel) {
                fullscreenPanel.style.display = 'none';
            }
        });

        // === LIGHTBOX OVERLAY ===
        const lightbox = document.createElement('div');
        lightbox.id = 'inat-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 40000;
        `;

        const lightboxImg = document.createElement('img');
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 40001;
        `;

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 32px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            z-index: 40002;
        `;

        function closeLightbox() {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }

        // Close when clicking X
        closeBtn.addEventListener('click', closeLightbox);

        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        // === INFO LIGHTBOX ===
        const infoLightbox = document.createElement('div');
        infoLightbox.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 45000;
        `;

        const infoContent = document.createElement('div');
        infoContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            font-family: Arial, sans-serif;
            text-align: left;
        `;

        infoContent.innerHTML = `
          <b>Quick links to the taxonomic divisions:</b><br><br>
          <div style="margin-bottom:8px;"><a href="https://www.inaturalist.org/taxa/47126#taxonomy-tab" target="_blank">🌱 Plants</a></div>
          <div style="margin-bottom:8px;"><a href="https://www.inaturalist.org/taxa/1#taxonomy-tab" target="_blank">🐾 Animals</a></div>
          <div style="margin-bottom:8px;"><a href="https://www.inaturalist.org/taxa/47170#taxonomy-tab" target="_blank">🍄 Fungi</a></div>
          <div style="margin-bottom:12px;"><a href="https://www.inaturalist.org/taxa/48222#taxonomy-tab" target="_blank">🌊 Chromista</a></div>
          Find the taxon IDs in the web page links of the taxonomic divisions on iNaturalist.
        `;

        const infoClose = document.createElement('div');
        infoClose.innerHTML = '&times;';
        infoClose.style.cssText = `
            position: absolute;
            top: 20px; right: 30px;
            font-size: 28px;
            color: white;
            cursor: pointer;
        `;

        infoBtn.addEventListener('click', () => {
            infoLightbox.style.display = 'flex';
        });
        infoClose.addEventListener('click', () => {
            infoLightbox.style.display = 'none';
        });
        infoLightbox.addEventListener('click', e => {
            if (e.target === infoLightbox) infoLightbox.style.display = 'none';
        });

        infoLightbox.appendChild(infoContent);
        infoLightbox.appendChild(infoClose);
        document.body.appendChild(infoLightbox);

        function getTaxonId() {
            if (taxonSelect.value === 'custom') {
                const id = parseInt(customTaxonInput.value);
                return isNaN(id) ? null : id;
            }
            return taxonSelect.value;
        }

        function extractCoordinatesFromUrl() {
            const matches = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (matches && matches.length === 3) {
                return {
                    lat: matches[1],
                    lng: matches[2]
                };
            }
            return null;
        }

        button.onclick = function () {
            const coords = extractCoordinatesFromUrl();
            if (!coords) return alert('Could not extract coordinates from URL.');

            const { lat, lng } = coords;
            let radius = parseFloat(radiusInput.value);
            if (isNaN(radius) || radius <= 0) radius = 1;

            const taxonId = getTaxonId();
            if (!taxonId) return alert('Please enter a valid Taxon ID.');

            const inatUrl = `https://www.inaturalist.org/observations?taxon_id=${taxonId}&lat=${lat}&lng=${lng}&radius=${radius}&subview=map`;
            window.open(inatUrl, '_blank');
        };

        speciesButton.onclick = async function () {
            const coords = extractCoordinatesFromUrl();
            if (!coords) return alert('Could not extract coordinates from URL.');

            const { lat, lng } = coords;
            let radius = parseFloat(radiusInput.value);
            if (isNaN(radius) || radius <= 0) radius = 1;

            const taxonId = getTaxonId();
            if (!taxonId) return alert('Please enter a valid Taxon ID.');

            const url = `https://api.inaturalist.org/v1/observations/species_counts?lat=${lat}&lng=${lng}&radius=${radius}&taxon_id=${taxonId}&verifiable=true&locale=en`;

            resultsContainer.innerHTML = '<em>Loading nearby species...</em>';
            resultsContainer.style.display = 'block';
            popoutBtn.style.display = 'none'; // 👈 hide while loading

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!data.results || data.results.length === 0) {
                    resultsContainer.innerHTML = '<strong>No species found.</strong>';
                    popoutBtn.style.display = 'none'; // hide button
                    return;
                }

                const sorted = data.results.sort((a, b) => b.count - a.count);
                resultsContainer.innerHTML = '';
                popoutBtn.style.display = 'block'; // show button once results load
                repositionPopoutBtn();

                sorted.forEach(species => {
                    const taxon = species.taxon;
                    if (!taxon) return;

                    const div = document.createElement('div');
                    div.className = 'inat-species-item';
                    div.style.textAlign = 'center';
                    div.style.marginBottom = '14px';

                    const img = document.createElement('img');
                    img.src = taxon.default_photo ? taxon.default_photo.medium_url : '';
                    img.alt = taxon.name;
                    img.style.width = '120px';
                    img.style.height = '120px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    img.style.border = '1px solid #ccc';
                    img.style.marginBottom = '6px';
                    img.style.cursor = 'pointer'; // 👈 makes it show hand cursor
                    if (!taxon.default_photo) img.style.display = 'none';

                    // === CLICK TO ENLARGE ===
                    if (taxon.default_photo) {
                        img.addEventListener('click', () => {
                            lightboxImg.src = taxon.default_photo.original_url || taxon.default_photo.medium_url;
                            lightbox.style.display = 'flex';
                        });
                    }

                    const link = document.createElement('a');
                    link.href = `https://www.inaturalist.org/taxa/${taxon.id}`;
                    link.target = '_blank';
                    link.style.color = '#2c3e50';
                    link.style.textDecoration = 'none';
                    link.style.fontWeight = 'bold';
                    link.style.display = 'block';
                    link.textContent = `${taxon.preferred_common_name || taxon.name} (${taxon.name})`;

                    const count = document.createElement('div');
                    count.className = 'inat-species-count';
                    count.style.fontSize = '12px';
                    count.style.color = '#555';
                    count.textContent = `Observations: ${species.count}`;

                    div.appendChild(img);
                    div.appendChild(link);
                    div.appendChild(count);
                    resultsContainer.appendChild(div);
                });
            } catch (err) {
                resultsContainer.innerHTML = '<strong>Error loading species data.</strong>';
                popoutBtn.style.display = 'none';
                console.error(err);
            }
        };

        // Add everything to panel
        container.appendChild(button);
        container.appendChild(speciesButton);
        container.appendChild(radiusLabel);
        container.appendChild(radiusInput);
        container.appendChild(taxonLabel);
        container.appendChild(taxonSelect);
        container.appendChild(taxonInputWrapper);
        container.appendChild(resultsContainer);

        document.body.appendChild(container);
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(() => {
                if (currentUrl.includes('@') && currentUrl.includes('!1s')) {
                    createInterface();
                }
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    waitForStreetViewContainer(() => {
        if (window.location.href.includes('@') && window.location.href.includes('!1s')) {
            createInterface();
        }
    });
})();