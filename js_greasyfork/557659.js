// ==UserScript==
// @name         FV - Quick Craft Dock
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      4.6
// @description  Grid/list toggle recipes. Only click the recipe you want and watch it go. Auto starts and completes recipes. Works on the Alchemist, Blacksmith, Cook, and Crafter.
// @match        https://www.furvilla.com/career/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557659/FV%20-%20Quick%20Craft%20Dock.user.js
// @updateURL https://update.greasyfork.org/scripts/557659/FV%20-%20Quick%20Craft%20Dock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Saved preferences
    const savedWidth = localStorage.getItem('blacksmithDockWidth') || '350px';
    const savedViewMode = localStorage.getItem('blacksmithDockView') || 'grid';
    let viewMode = savedViewMode;

    // Dock 
    const dock = document.createElement('div');
    dock.id = 'blacksmithDock';
    dock.style.position = 'fixed';
    dock.style.top = '60px';
    dock.style.right = '25px';   // always docked to right
    dock.style.left = 'auto';
    dock.style.width = savedWidth;
    dock.style.height = '70%';
    dock.style.backgroundColor = '#f8f8f8';
    dock.style.border = '1px solid #ccc';
    dock.style.borderRadius = '8px';
    dock.style.padding = '10px';
    dock.style.overflow = 'auto';
    dock.style.zIndex = '9999';
    dock.style.cursor = 'move';
    dock.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    document.body.appendChild(dock);

    // Vertically
    let isDragging = false;
    let offsetY = 0;
    dock.addEventListener('mousedown', e => {
        if (e.target === dock) {
            isDragging = true;
            offsetY = e.clientY - dock.offsetTop;
            e.preventDefault();
        }
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        let y = e.clientY - offsetY;
        y = Math.max(0, Math.min(window.innerHeight - dock.offsetHeight, y));
        dock.style.top = y + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    // Dock Header 
    const header = document.createElement('h2');
    header.textContent = 'Career Quick Craft';
    header.style.textAlign = 'center';
    header.style.fontSize = '16px';
    header.style.marginTop = '0';
    header.style.fontWeight = 'normal';
    dock.appendChild(header);

    // Search Box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search recipes...';
    searchBox.style.width = '90%';
    searchBox.style.margin = '5px auto 10px auto';
    searchBox.style.display = 'block';
    searchBox.style.padding = '5px';
    searchBox.style.border = '1px solid #ccc';
    searchBox.style.borderRadius = '4px';
    searchBox.style.fontSize = '12px';
    dock.appendChild(searchBox);

    //Grid/List Toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid';
    toggleBtn.style.display = 'block';
    toggleBtn.style.margin = '5px auto';
    toggleBtn.style.padding = '4px 6px';
    toggleBtn.style.fontSize = '12px';
    toggleBtn.addEventListener('click', () => {
        viewMode = viewMode === 'grid' ? 'list' : 'grid';
        localStorage.setItem('blacksmithDockView', viewMode);
        toggleBtn.textContent = viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid';
        updateDockView();
    });
    dock.appendChild(toggleBtn);

    //Recipe Container
    const recipeContainer = document.createElement('div');
    dock.appendChild(recipeContainer);

    function updateDockView() {
        if (viewMode === 'grid') {
            recipeContainer.style.display = 'grid';
            recipeContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
            recipeContainer.style.gap = '5px';
            recipeContainer.querySelectorAll('div.recipeItem').forEach(item => {
                item.querySelector('img')?.style.setProperty('display', 'block');
                item.querySelector('.nameLabel')?.style.setProperty('display', 'none');
            });
        } else {
            recipeContainer.style.display = 'flex';
            recipeContainer.style.flexDirection = 'column';
            recipeContainer.style.gap = '3px';
            recipeContainer.querySelectorAll('div.recipeItem').forEach(item => {
                item.querySelector('img')?.style.setProperty('display', 'none');
                item.querySelector('.nameLabel')?.style.setProperty('display', 'block');
            });
        }
    }

    // Load Recipes 
    const recipeLinks = document.querySelectorAll('li.crafting-list-item a[data-url]');
    recipeLinks.forEach(link => {
        const nameP = link.querySelectorAll('p')[1]; // is recipe name
        const recipeName = nameP?.textContent.trim() || 'Recipe';
        const imgSrc = link.querySelector('img')?.src || '';

        const iconBtn = document.createElement('div');
        iconBtn.classList.add('recipeItem');
        iconBtn.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        iconBtn.appendChild(img);

        const nameLabel = document.createElement('div');
        nameLabel.classList.add('nameLabel');
        nameLabel.textContent = recipeName;
        nameLabel.style.display = 'none';
        nameLabel.style.padding = '4px';
        nameLabel.style.fontSize = '12px';
        nameLabel.style.border = '1px solid #ccc';
        nameLabel.style.borderRadius = '4px';
        iconBtn.appendChild(nameLabel);

        recipeContainer.appendChild(iconBtn);

        iconBtn.addEventListener('click', e => {
            e.preventDefault();
            link.click();
        });
    });

    updateDockView();

    // Fully hide modals and backdrops
    const style = document.createElement('style');
    style.textContent = `
      div.modal {
        display: block !important;
        position: fixed !important;
        top: -9999px !important;
        left: -9999px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: 0 !important;
      }
      div.modal.fade {
        transition: none !important;
      }
      div.modal-backdrop {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Auto Craft + Complete
    setInterval(() => {
        const modal = document.querySelector('div.modal.in');
        if (modal) {
            const craftBtn = modal.querySelector('div.modal-footer a.btn');
            if (craftBtn && !craftBtn.dataset.clicked) {
                craftBtn.dataset.clicked = 'true';
                craftBtn.click();
            }
            const closeBtn = modal.querySelector('a.close');
            if (closeBtn && !closeBtn.dataset.clicked) {
                closeBtn.dataset.clicked = 'true';
                setTimeout(() => closeBtn.click(), 300);
            }
        }

        const countdowns = document.querySelectorAll('span.status.countdown');
        countdowns.forEach(cd => {
            const completeBtn = cd.querySelector('a.btn');
            if (completeBtn && completeBtn.offsetParent !== null && !completeBtn.dataset.clicked) {
                completeBtn.dataset.clicked = 'true';
                completeBtn.click();
            }
        });
    }, 300);

    // Filter
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.toLowerCase();
        const cards = recipeContainer.querySelectorAll('div.recipeItem');
        cards.forEach(card => {
            const name = card.querySelector('.nameLabel').textContent.toLowerCase();
            card.style.display = name.includes(query) ? 'block' : 'none';
        });
    });

})();
