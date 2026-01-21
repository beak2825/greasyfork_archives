// ==UserScript==
// @name         Dead Frontier Quick link - Floating Pill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This is a convenience button script with floating pill design
// @author       Catss
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/
// @license      LGPL License
// @downloadURL https://update.greasyfork.org/scripts/563375/Dead%20Frontier%20Quick%20link%20-%20Floating%20Pill.user.js
// @updateURL https://update.greasyfork.org/scripts/563375/Dead%20Frontier%20Quick%20link%20-%20Floating%20Pill.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const currentUrl = window.location.href;
    const shouldHide = currentUrl.includes('page=21');
    if (shouldHide) {
        return;
    }
    var container = createButtonContainer();
    document.body.appendChild(container);
    restorePosition(container);
    addCustomStyles();

    function createButtonContainer() {
        var container = document.createElement('div');
        container.id = 'df-floating-nav';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '99999';
        container.style.background = 'rgba(0, 0, 0, 0.85)';
        container.style.backdropFilter = 'blur(10px)';
        container.style.padding = '12px 20px';
        container.style.borderRadius = '50px';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '8px';
        container.style.alignItems = 'center';
        container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        container.style.transition = 'all 0.3s ease';

        var buttons = [
            { name: 'Travel', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=61', icon: '🗺️' },
            { name: 'Craft', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59', icon: '🔨' },
            { name: 'Vendi', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84', icon: '📱' },
            { name: 'Inventory', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25', icon: '🎒' },
            { name: 'Market', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35', icon: '🏪' },
            { name: 'Bank', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15', icon: '🏦' },
            { name: 'Storage', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50', icon: '📦' },
            { name: 'Yard', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24', icon: '🏠' },
            { name: 'OP', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=0', icon: '⚙️' },
        ];

        buttons.forEach(function(buttonInfo) {
            createQuickNavigationButton(container, buttonInfo.name, buttonInfo.link, buttonInfo.icon);
        });

        var separator = document.createElement('div');
        separator.style.width = '1px';
        separator.style.height = '24px';
        separator.style.background = 'rgba(255, 255, 255, 0.2)';
        separator.style.margin = '0 4px';
        container.appendChild(separator);

        createQuickNavigationButton(container, 'Inner City', 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21', '➡️');

        var separator2 = document.createElement('div');
        separator2.style.width = '1px';
        separator2.style.height = '24px';
        separator2.style.background = 'rgba(255, 255, 255, 0.2)';
        separator2.style.margin = '0 4px';
        container.appendChild(separator2);

        createDragHandle(container);
        makeDraggable(container);

        return container;
    }

    function createQuickNavigationButton(container, buttonTitle, url, icon) {
        let button = document.createElement("button");
        button.innerHTML = `<span class="btn-icon">${icon}</span><span class="btn-text">${buttonTitle}</span>`;
        button.classList.add("df-nav-button");
        button.addEventListener("click", function() {
            if (buttonTitle === 'Inner City') {
                handleInnerCityNavigation();
            } else {
                window.location.href = url;
            }
        });
        container.appendChild(button);
    }

    function handleInnerCityNavigation() {
        const isHomePage = window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/index.php")[1] === "" ||
                          window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/")[1] === "";
                
        if (isHomePage && typeof unsafeWindow !== 'undefined' && unsafeWindow.doPageChange) {
            unsafeWindow.doPageChange(21, 1, false);
        } else {
            window.location.href = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?redirectTo=21';
        }
    }

    function createDragHandle(container) {
        let dragHandle = document.createElement("div");
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.classList.add("df-drag-handle");
        dragHandle.title = "Drag to move";
        container.appendChild(dragHandle);
    }

    function makeDraggable(container) {
        let isDragging = false;
        let offsetX, offsetY;
        const dragHandle = container.querySelector('.df-drag-handle');

        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            dragHandle.style.cursor = 'grabbing';
            container.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));
            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
            container.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'grab';
                container.style.transition = 'all 0.3s ease';
                savePosition(container);
            }
        });

        dragHandle.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    }

    function savePosition(container) {
        const position = {
            left: container.style.left,
            top: container.style.top,
            transform: container.style.transform
        };
        localStorage.setItem('df-nav-position', JSON.stringify(position));
    }

    function restorePosition(container) {
        const savedPosition = localStorage.getItem('df-nav-position');
        if (savedPosition) {
            try {
                const position = JSON.parse(savedPosition);
                if (position.left && position.top) {
                    container.style.left = position.left;
                    container.style.top = position.top;
                    container.style.transform = position.transform || 'none';
                }
            } catch (e) {}
        }
    }

    function addCustomStyles() {
        var style = document.createElement('style');
        style.innerHTML = `
            #df-floating-nav:hover {
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
                border-color: rgba(255, 255, 255, 0.2);
            }
            .df-nav-button {
                padding: 8px 14px;
                border: none;
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
            }
            .df-nav-button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
            }
            .df-nav-button:active {
                transform: translateY(0);
            }
            .btn-icon {
                font-size: 14px;
                line-height: 1;
            }
            .btn-text {
                font-size: 12px;
            }
            .df-drag-handle {
                padding: 4px 8px;
                color: rgba(255, 255, 255, 0.5);
                cursor: grab;
                user-select: none;
                font-size: 16px;
                line-height: 1;
                transition: color 0.2s ease;
            }
            .df-drag-handle:hover {
                color: rgba(255, 255, 255, 0.8);
            }
            .df-drag-handle:active {
                cursor: grabbing;
            }
            @media (max-width: 768px) {
                #df-floating-nav {
                    flex-wrap: wrap;
                    max-width: 90vw;
                    top: 10px;
                }
                .btn-text {
                    display: none;
                }
                .df-nav-button {
                    padding: 8px 10px;
                    min-width: 36px;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();