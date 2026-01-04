// ==UserScript==
// @name         Aimware for google
// @namespace   http://tampermonkey.net/
// @version       4.0
// @description   Aimware更新了谷歌小恐龙？
// @author       Jeyor1337
// @license       MIT
// @match       *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551634/Aimware%20for%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/551634/Aimware%20for%20google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let isMenuOpen = false;
    let originalGameOver = null;
    let gameInstance = null;
    
    let checkInterval = setInterval(() => {
        if (window.Runner && window.Runner.instance_) {
            clearInterval(checkInterval);
            initializeMod();
        }
    }, 1000);
    
    function initializeMod() {
        gameInstance = Runner.instance_;
        originalGameOver = gameInstance.gameOver;
        
        createMenuButton();
        createAimwareGUI();
    }
    
    function createMenuButton() {
        const menuBtn = document.createElement('div');
        menuBtn.innerHTML = '≡';
        menuBtn.style.position = 'fixed';
        menuBtn.style.bottom = '20px';
        menuBtn.style.left = '20px';
        menuBtn.style.zIndex = '10000';
        menuBtn.style.width = '32px';
        menuBtn.style.height = '32px';
        menuBtn.style.backgroundColor = 'rgba(25, 25, 25, 0.9)';
        menuBtn.style.color = '#ffffff';
        menuBtn.style.borderRadius = '4px';
        menuBtn.style.display = 'flex';
        menuBtn.style.alignItems = 'center';
        menuBtn.style.justifyContent = 'center';
        menuBtn.style.cursor = 'pointer';
        menuBtn.style.fontWeight = 'bold';
        menuBtn.style.fontSize = '16px';
        menuBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
        menuBtn.style.transition = 'all 0.2s ease';
        menuBtn.style.border = '1px solid rgba(255,255,255,0.1)';
        
        menuBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(35, 35, 35, 0.95)';
        });
        
        menuBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(25, 25, 25, 0.9)';
        });
        
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        document.body.appendChild(menuBtn);
    }
    
    function createAimwareGUI() {
        const gui = document.createElement('div');
        gui.id = 'aimware-gui';
        gui.style.position = 'fixed';
        gui.style.bottom = '60px';
        gui.style.left = '20px';
        gui.style.zIndex = '9999';
        gui.style.width = '280px';
        gui.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
        gui.style.borderRadius = '6px';
        gui.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
        gui.style.display = 'none';
        gui.style.overflow = 'hidden';
        gui.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        gui.style.backdropFilter = 'blur(10px)';
        gui.style.border = '1px solid rgba(255,255,255,0.08)';
        
        const titleBar = document.createElement('div');
        titleBar.style.backgroundColor = 'rgba(15, 15, 15, 0.98)';
        titleBar.style.padding = '14px 16px';
        titleBar.style.color = '#e0e0e0';
        titleBar.style.fontWeight = '600';
        titleBar.style.fontSize = '13px';
        titleBar.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        titleBar.style.letterSpacing = '0.5px';
        titleBar.textContent = 'DinoWare';
        gui.appendChild(titleBar);
        
        const content = document.createElement('div');
        content.style.padding = '16px';
        
        const godModeContainer = createToggleSwitch('God Mode', false, (checked) => {
            if (checked) {
                gameInstance.gameOver = function() {};
            } else {
                gameInstance.gameOver = originalGameOver;
            }
        });
        content.appendChild(godModeContainer);
        
        const speedContainer = createSlider('Speed Multiplier', 1, 1, 20, (value) => {
            if (gameInstance) {
                gameInstance.currentSpeed = value;
                if (gameInstance.config) {
                    gameInstance.config.SPEED = value;
                    gameInstance.config.ACCELERATION = value;
                    gameInstance.config.MAX_SPEED = value;
                    gameInstance.config.BG_CLOUD_SPEED = value;
                }
            }
        });
        content.appendChild(speedContainer);
        
        const scoreContainer = createScoreInput();
        content.appendChild(scoreContainer);
        
        const endGameBtn = document.createElement('button');
        endGameBtn.textContent = 'End Game';
        endGameBtn.style.width = '100%';
        endGameBtn.style.padding = '12px';
        endGameBtn.style.marginTop = '16px';
        endGameBtn.style.backgroundColor = 'rgba(211, 47, 47, 0.9)';
        endGameBtn.style.color = 'white';
        endGameBtn.style.border = 'none';
        endGameBtn.style.borderRadius = '4px';
        endGameBtn.style.cursor = 'pointer';
        endGameBtn.style.fontWeight = '600';
        endGameBtn.style.fontSize = '13px';
        endGameBtn.style.transition = 'all 0.2s ease';
        endGameBtn.style.letterSpacing = '0.5px';
        
        endGameBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(183, 28, 28, 0.95)';
        });
        
        endGameBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(211, 47, 47, 0.9)';
        });
        
        endGameBtn.addEventListener('click', function() {
            if (originalGameOver) {
                originalGameOver.call(gameInstance);
            }
        });
        
        content.appendChild(endGameBtn);
        
        gui.appendChild(content);
        document.body.appendChild(gui);
        
        document.addEventListener('click', function(e) {
            if (isMenuOpen && 
                !e.target.closest('#aimware-gui') && 
                !e.target.closest('div[style*="bottom: 20px"][style*="left: 20px"]')) {
                closeMenu();
            }
        });
    }
    
    function createToggleSwitch(label, defaultValue, onChange) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.marginBottom = '18px';
        
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.color = '#d0d0d0';
        labelEl.style.fontSize = '13px';
        labelEl.style.fontWeight = '500';
        
        const switchContainer = document.createElement('label');
        switchContainer.style.position = 'relative';
        switchContainer.style.display = 'inline-block';
        switchContainer.style.width = '44px';
        switchContainer.style.height = '22px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = defaultValue;
        checkbox.style.opacity = '0';
        checkbox.style.width = '0';
        checkbox.style.height = '0';
        
        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = 'rgba(255,255,255,0.15)';
        slider.style.transition = '.3s';
        slider.style.borderRadius = '22px';
        
        const sliderBefore = document.createElement('span');
        sliderBefore.style.position = 'absolute';
        sliderBefore.style.height = '18px';
        sliderBefore.style.width = '18px';
        sliderBefore.style.left = '2px';
        sliderBefore.style.bottom = '2px';
        sliderBefore.style.backgroundColor = 'rgba(255,255,255,0.9)';
        sliderBefore.style.transition = '.3s';
        sliderBefore.style.borderRadius = '50%';
        sliderBefore.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        slider.appendChild(sliderBefore);
        switchContainer.appendChild(checkbox);
        switchContainer.appendChild(slider);
        
        function updateSlider() {
            if (checkbox.checked) {
                slider.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
                sliderBefore.style.transform = 'translateX(22px)';
            } else {
                slider.style.backgroundColor = 'rgba(255,255,255,0.15)';
                sliderBefore.style.transform = 'translateX(0)';
            }
        }
        
        checkbox.addEventListener('change', function() {
            updateSlider();
            onChange(this.checked);
        });
        
        updateSlider();
        
        container.appendChild(labelEl);
        container.appendChild(switchContainer);
        
        return container;
    }
    
    function createSlider(label, defaultValue, min, max, onChange) {
        const container = document.createElement('div');
        container.style.marginBottom = '22px';
        
        const labelContainer = document.createElement('div');
        labelContainer.style.display = 'flex';
        labelContainer.style.justifyContent = 'space-between';
        labelContainer.style.marginBottom = '10px';
        
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.color = '#d0d0d0';
        labelEl.style.fontSize = '13px';
        labelEl.style.fontWeight = '500';
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = defaultValue;
        valueDisplay.style.color = 'rgba(76, 175, 80, 0.9)';
        valueDisplay.style.fontSize = '13px';
        valueDisplay.style.fontWeight = '600';
        
        labelContainer.appendChild(labelEl);
        labelContainer.appendChild(valueDisplay);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = defaultValue;
        slider.style.width = '100%';
        slider.style.height = '4px';
        slider.style.borderRadius = '2px';
        slider.style.background = 'rgba(255,255,255,0.1)';
        slider.style.outline = 'none';
        slider.style.webkitAppearance = 'none';
        slider.style.cursor = 'pointer';
        
        slider.style.background = `linear-gradient(to right, rgba(76, 175, 80, 0.9) 0%, rgba(76, 175, 80, 0.9) ${(defaultValue - min) / (max - min) * 100}%, rgba(255,255,255,0.1) ${(defaultValue - min) / (max - min) * 100}%, rgba(255,255,255,0.1) 100%)`;
        
        slider.addEventListener('input', function() {
            const value = parseInt(this.value);
            valueDisplay.textContent = value;
            this.style.background = `linear-gradient(to right, rgba(76, 175, 80, 0.9) 0%, rgba(76, 175, 80, 0.9) ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) 100%)`;
            onChange(value);
        });
        
        container.appendChild(labelContainer);
        container.appendChild(slider);
        
        return container;
    }
    
    function createScoreInput() {
        const container = document.createElement('div');
        container.style.marginBottom = '18px';
        
        const label = document.createElement('div');
        label.textContent = 'Set Score';
        label.style.color = '#d0d0d0';
        label.style.fontSize = '13px';
        label.style.marginBottom = '10px';
        label.style.fontWeight = '500';
        
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter score';
        input.style.flex = '1';
        input.style.padding = '10px 12px';
        input.style.border = '1px solid rgba(255,255,255,0.08)';
        input.style.borderRadius = '4px 0 0 4px';
        input.style.backgroundColor = 'rgba(15, 15, 15, 0.7)';
        input.style.color = '#e0e0e0';
        input.style.outline = 'none';
        input.style.fontSize = '13px';
        
        const button = document.createElement('button');
        button.textContent = 'Set';
        button.style.padding = '10px 16px';
        button.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '0 4px 4px 0';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '600';
        button.style.fontSize = '13px';
        button.style.transition = 'all 0.2s ease';
        
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(25, 118, 210, 0.95)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
        });
        
        button.addEventListener('click', function() {
            const score = parseInt(input.value);
            if (!isNaN(score) && gameInstance) {
                gameInstance.distanceRan = score;
                if (gameInstance.updateScoreDisplay) {
                    gameInstance.updateScoreDisplay();
                }
                const scoreElement = document.getElementById('score');
                if (scoreElement) {
                    scoreElement.textContent = Math.floor(score).toString();
                }
                input.value = '';
            }
        });
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(button);
        
        container.appendChild(label);
        container.appendChild(inputContainer);
        
        return container;
    }
    
    function toggleMenu() {
        const gui = document.getElementById('aimware-gui');
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        const gui = document.getElementById('aimware-gui');
        gui.style.display = 'block';
        isMenuOpen = true;
    }
    
    function closeMenu() {
        const gui = document.getElementById('aimware-gui');
        gui.style.display = 'none';
        isMenuOpen = false;
    }
})();
