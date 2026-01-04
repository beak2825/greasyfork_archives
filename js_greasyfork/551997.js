// ==UserScript==
// @name               IG Zoom Lens
// @name:pt-BR         IG Zoom Lens
// @name:zh-CN         IG Zoom Lens
// @name:zh-TW         IG Zoom Lens
// @name:en            IG Zoom Lens
// @name:es            IG Zoom Lens
// @name:ja            IG Zoom Lens
// @name:ko            IG Zoom Lens
// @name:de            IG Zoom Lens
// @name:fr            IG Zoom Lens
// @namespace          http://github.com/0H4S
// @version            1.0
// @description        Adds a circular zoom lens when hovering over images on Instagram, with panning support and zoom adjustment via mouse scroll.
// @description:pt-BR  Adiciona uma lente de zoom circular ao passar o mouse sobre imagens no Instagram, com suporte a panning e ajuste de zoom via scroll do mouse.
// @description:zh-CN  在Instagram上悬停在图像上时添加一个圆形缩放镜头，支持平移和通过鼠标滚动调整缩放。
// @description:zh-TW  在Instagram上懸停在圖像上時添加一個圓形縮放鏡頭，支持平移和通過鼠標滾動調整縮放。
// @description:en     Adds a circular zoom lens when hovering over images on Instagram, with panning support and zoom adjustment via mouse scroll.
// @description:es     Añade una lente de zoom circular al pasar el ratón sobre las imágenes en Instagram, con soporte para paneo y ajuste de zoom mediante la rueda del ratón.
// @description:ja     Instagramの画像にマウスをホバーすると円形のズームレンズが追加され、パンニングサポートとマウススクロールによるズーム調整が可能になります。
// @description:ko     인스타그램 이미지 위에 마우스를 올리면 원형 줌 렌즈가 추가되며, 팬닝 지원 및 마우스 스크롤을 통한 줌 조정이 가능합니다.
// @description:de     Fügt eine kreisförmige Zoom-Linse hinzu, wenn Sie mit der Maus über Bilder auf Instagram fahren, mit Unterstützung für Panning und Zoom-Anpassung über das Mausrad.
// @description:fr     Ajoute une lentille de zoom circulaire lors du survol des images sur Instagram, avec prise en charge du panoramique et ajustement du zoom via la molette de la souris.
// @author             OHAS
// @license            CC-BY-NC-ND-4.0
// @copyright          2025 OHAS. All Rights Reserved.
// @icon               https://i.imgur.com/HH9zLZE.png
// @match              https://www.instagram.com/*
// @require            https://update.greasyfork.org/scripts/549920/Script%20Notifier.js
// @connect            gist.githubusercontent.com
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_xmlhttpRequest
// @compatible         chrome
// @compatible         firefox
// @compatible         edge
// @downloadURL https://update.greasyfork.org/scripts/551997/IG%20Zoom%20Lens.user.js
// @updateURL https://update.greasyfork.org/scripts/551997/IG%20Zoom%20Lens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) {
        return;
    }

    const SCRIPT_CONFIG = {
        notificationsUrl: 'https://gist.githubusercontent.com/0H4S/aa1f90cc844db6c516379befd9ff354c/raw/ig_zoom_lens_notifications.json',
        scriptVersion: '1.0',
    };

    const notifier = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();

    const DEFAULT_LENS_SIZE = 200;
    const MIN_LENS_SIZE = 100;
    const MAX_LENS_SIZE = 500;
    const LENS_SIZE_STEP = 20;
    const LENS_STORAGE_KEY = 'LensSize';

    const MIN_ZOOM = 3;
    const MAX_ZOOM = 30;
    const ZOOM_STEP = 0.5;
    const ZOOM_STORAGE_KEY = 'ZoomLevel';

    let currentLensSize = GM_getValue(LENS_STORAGE_KEY, DEFAULT_LENS_SIZE);
    let currentZoomLevel = GM_getValue(ZOOM_STORAGE_KEY, MIN_ZOOM);

    let currentImage = null;
    let isZoomActive = false;
    let isPanning = false;

    let panStartClientX = 0;
    let panStartClientY = 0;
    let initialBgPosX = 0;
    let initialBgPosY = 0;
    let lastMouseEvent = null;

    function addCursorStyles() {
        const style = document.createElement('style');
        style.textContent = ` .ig-zoom-active-image { cursor: none !important; } `;
        document.head.appendChild(style);
    }

    addCursorStyles();

    function createZoomLens() {
        const lens = document.createElement('div');
        lens.id = 'ig-zoom-lens';
        lens.style.position = 'fixed';
        lens.style.width = `${currentLensSize}px`;
        lens.style.height = `${currentLensSize}px`;
        lens.style.borderRadius = '50%';
        lens.style.border = '3px solid white';
        lens.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.15), 0 4px 15px rgba(0,0,0,0.3)';
        lens.style.pointerEvents = 'none';
        lens.style.zIndex = '9999';
        lens.style.overflow = 'hidden';
        lens.style.transition = 'opacity 0.25s, transform 0.25s, border-color 0.15s linear';
        lens.style.backgroundRepeat = 'no-repeat';
        lens.style.backgroundSize = `${currentZoomLevel * 100}%`;
        lens.style.display = 'none';
        document.body.appendChild(lens);
        return lens;
    }

    const zoomLens = createZoomLens();

    function updateLensSize() {
        if (!zoomLens) return;
        zoomLens.style.width = `${currentLensSize}px`;
        zoomLens.style.height = `${currentLensSize}px`;
        if (isZoomActive && lastMouseEvent && currentImage) {
            updateZoomPosition(lastMouseEvent, currentImage);
        }
    }

    function provideVisualFeedback() {
        zoomLens.style.display = 'block';
        zoomLens.style.borderColor = '#3897f0';
        setTimeout(() => {
            zoomLens.style.borderColor = isPanning ? '#ff2323ff' : 'white';
            if (!isZoomActive) {
                zoomLens.style.display = 'none';
            }
        }, 200);
    }

    function increaseLensSize() {
        currentLensSize = Math.min(MAX_LENS_SIZE, currentLensSize + LENS_SIZE_STEP);
        GM_setValue(LENS_STORAGE_KEY, currentLensSize);
        updateLensSize();
        provideVisualFeedback();
    }

    function decreaseLensSize() {
        currentLensSize = Math.max(MIN_LENS_SIZE, currentLensSize - LENS_SIZE_STEP);
        GM_setValue(LENS_STORAGE_KEY, currentLensSize);
        updateLensSize();
        provideVisualFeedback();
    }

    function resetLensSize() {
        currentLensSize = DEFAULT_LENS_SIZE;
        GM_setValue(LENS_STORAGE_KEY, currentLensSize);
        updateLensSize();
        provideVisualFeedback();
    }

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            increaseLensSize();
        } else if (e.key === '-') {
            e.preventDefault();
            decreaseLensSize();
        } else if (e.key === '0') {
            e.preventDefault();
            resetLensSize();
        }
    });

    function getHighResImageSrc(img) {
        if (img.srcset) {
            const sources = img.srcset.split(',').map(s => {
                const parts = s.trim().split(' ');
                return { url: parts[0], width: parseInt(parts[1]) || 0 };
            });
            sources.sort((a, b) => b.width - a.width);
            if (sources.length > 0 && sources[0].url) return sources[0].url;
        }
        return img.src;
    }

    function hideZoom() {
        if (!isZoomActive) return;
        isZoomActive = false;
        isPanning = false;
        if (currentImage) {
            currentImage.classList.remove('ig-zoom-active-image');
        }
        currentImage = null;
        zoomLens.style.borderColor = 'white';
        zoomLens.style.opacity = '0';
        zoomLens.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (!isZoomActive) {
                zoomLens.style.display = 'none';
            }
        }, 250);
    }

    function showZoom(img, e) {
        if (isZoomActive && currentImage === img) return;
        const src = getHighResImageSrc(img);
        if (!src || src.includes('profile_pic')) return;
        currentImage = img;
        isZoomActive = true;
        img.classList.add('ig-zoom-active-image');
        zoomLens.style.backgroundImage = `url(${src})`;
        zoomLens.style.backgroundSize = `${currentZoomLevel * 100}%`;
        zoomLens.style.display = 'block';
        setTimeout(() => {
            if (isZoomActive) {
                zoomLens.style.opacity = '1';
                zoomLens.style.transform = 'scale(1)';
            }
        }, 10);
        updateZoomPosition(e, img);
    }

    function updateZoomPosition(e, img) {
        if (!isZoomActive || currentImage !== img) return;
        lastMouseEvent = e;

        if (isPanning) {
            const deltaX = e.clientX - panStartClientX;
            const deltaY = e.clientY - panStartClientY;
            const deltaPercentX = (deltaX / currentLensSize) * 50;
            const deltaPercentY = (deltaY / currentLensSize) * 50;
            const newBgPosX = initialBgPosX + deltaPercentX;
            const newBgPosY = initialBgPosY + deltaPercentY;
            zoomLens.style.backgroundPosition = `${newBgPosX}% ${newBgPosY}%`;
            return;
        }

        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            hideZoom();
            return;
        }

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        zoomLens.style.left = `${e.clientX - currentLensSize / 2}px`;
        zoomLens.style.top = `${e.clientY - currentLensSize / 2}px`;
        zoomLens.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }

    function applyZoomEffect(img) {
        if (img.dataset.zoomApplied) return;
        img.dataset.zoomApplied = 'true';

        img.addEventListener('mouseenter', function(e) { showZoom(img, e); });
        img.addEventListener('mousemove', function(e) { updateZoomPosition(e, img); });
        img.addEventListener('mouseleave', function() { if (!isPanning) { hideZoom(); } });

        img.addEventListener('mousedown', function(e) {
            if (e.button === 0 && isZoomActive) {
                e.preventDefault();
                isPanning = true;
                zoomLens.style.transition = 'none';
                zoomLens.style.borderColor = '#ff2323ff';
                panStartClientX = e.clientX;
                panStartClientY = e.clientY;
                const bgPos = zoomLens.style.backgroundPosition.split(' ');
                initialBgPosX = parseFloat(bgPos[0]) || 0;
                initialBgPosY = parseFloat(bgPos[1]) || 0;
            }
        });

        img.addEventListener('wheel', function(e) {
            if (!isZoomActive) return;
            e.preventDefault();
            const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
            const newZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoomLevel + delta));
            if (newZoomLevel !== currentZoomLevel) {
                currentZoomLevel = newZoomLevel;
                GM_setValue(ZOOM_STORAGE_KEY, currentZoomLevel);
                zoomLens.style.backgroundSize = `${currentZoomLevel * 100}%`;
                if (!isPanning) {
                    updateZoomPosition(e, img);
                }
            }
        });
    }

    document.addEventListener('mouseup', function() {
        if (isPanning) {
            isPanning = false;
            zoomLens.style.transition = 'opacity 0.25s, transform 0.25s, border-color 0.15s linear';
            zoomLens.style.borderColor = 'white';
        }
    });

    function isOverNavigationButton(element) {
        if (!element) return false;
        let current = element;
        while (current && current !== document.body) {
            if (current.classList.contains('_afxw') || current.classList.contains('_afxv')) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    document.addEventListener('mousemove', function(e) {
        lastMouseEvent = e;
        if (isPanning && currentImage) {
            updateZoomPosition(e, currentImage);
            return;
        }
        if (isOverNavigationButton(e.target) && isZoomActive) {
            hideZoom();
            return;
        }
        if (!e.target.closest('img') && isZoomActive) {
            hideZoom();
        }
    });

    function applyToAllImages() {
        const images = document.querySelectorAll('img.x5yr21d:not([src*="profile_pic"]):not([src*="s150x150"]):not([data-zoom-applied])');
        images.forEach(img => {
            if (img.offsetWidth > 150 || img.offsetHeight > 150) {
                applyZoomEffect(img);
            } else {
                img.onload = () => {
                    if (img.offsetWidth > 150 || img.offsetHeight > 150) {
                        applyZoomEffect(img);
                    }
                };
            }
        });
    }

    setTimeout(applyToAllImages, 1000);

    const observer = new MutationObserver(function(mutations) {
        let shouldReapply = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('img.x5yr21d') || node.querySelector && node.querySelector('img.x5yr21d')) {
                            shouldReapply = true;
                        }
                    }
                });
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'src' && mutation.target.matches('img.x5yr21d')) {
                mutation.target.removeAttribute('data-zoom-applied');
                shouldReapply = true;
            }
        });
        if (shouldReapply) {
            setTimeout(applyToAllImages, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src'],
        characterData: false
    });

})();