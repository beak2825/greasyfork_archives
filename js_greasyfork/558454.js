// ==UserScript==
// @name         I'm not a robot neal.fun level-controller
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Adds buttons and controls to skip levels or end the game.
// @author       Suomynona589
// @match        https://neal.fun/not-a-robot/*
// @grant        unsafeWindow
// @icon         https://neal.fun/favicons/not-a-robot.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558454/I%27m%20not%20a%20robot%20nealfun%20level-controller.user.js
// @updateURL https://update.greasyfork.org/scripts/558454/I%27m%20not%20a%20robot%20nealfun%20level-controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setLevel(val) {
        try {
            unsafeWindow['not-a-robot-level'] = val;
            window['not-a-robot-level'] = val;
            localStorage.setItem('not-a-robot-level', String(val));
            console.log('not-a-robot-level ->', val);
        } catch (e) {
            console.warn('Failed to set level:', e);
        }
        location.reload();
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '75px';
    container.style.left = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);

    const topRow = document.createElement('div');
    topRow.style.position = 'absolute';
    topRow.style.left = '50%';
    topRow.style.transform = 'translateX(-50%)';
    topRow.style.zIndex = '9999';
    topRow.style.display = 'flex';
    topRow.style.flexDirection = 'row';
    topRow.style.gap = '150px';
    document.body.appendChild(topRow);

    let positionTimeout = null;

    function positionButtons() {
        const captcha = document.querySelector('.captcha-container');
        if (!captcha) return;

        if (positionTimeout) clearTimeout(positionTimeout);

        positionTimeout = setTimeout(() => {
            const rect = captcha.getBoundingClientRect();
            const scrollY = window.scrollY || document.documentElement.scrollTop;

            topRow.style.top = (rect.bottom + scrollY + 50) + 'px';
        }, 150);
    }

    positionButtons();
    window.addEventListener('resize', positionButtons);
    window.addEventListener('scroll', positionButtons);

    const obs = new MutationObserver(positionButtons);
    obs.observe(document.body, { childList: true, subtree: true });

    const endBtn = document.createElement('button');
    endBtn.textContent = 'End Game';
    endBtn.style.padding = '15px 25px';
    endBtn.style.fontSize = '18px';
    endBtn.style.background = '#28a745';
    endBtn.style.color = '#fff';
    endBtn.style.border = 'none';
    endBtn.style.borderRadius = '8px';
    endBtn.style.cursor = 'pointer';
    endBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    endBtn.addEventListener('click', () => setLevel(47));
    container.appendChild(endBtn);

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '⏪';
    prevBtn.style.padding = '0';
    prevBtn.style.margin = '0';
    prevBtn.style.background = 'none';
    prevBtn.style.border = 'none';
    prevBtn.style.fontSize = '32px';
    prevBtn.style.color = '#fff';
    prevBtn.style.cursor = 'pointer';
    prevBtn.style.boxShadow = 'none';
    prevBtn.style.lineHeight = '1';
    prevBtn.style.display = 'inline';

    prevBtn.addEventListener('click', () => {
        let current = parseInt(localStorage.getItem('not-a-robot-level') || '0', 10);
        if (isNaN(current)) current = 0;
        let prev = current - 1;
        if (prev < 0) prev = 0;
        setLevel(prev);
    });
    topRow.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '⏩';
    nextBtn.style.padding = '0';
    nextBtn.style.margin = '0';
    nextBtn.style.background = 'none';
    nextBtn.style.border = 'none';
    nextBtn.style.fontSize = '32px';
    nextBtn.style.color = '#fff';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.boxShadow = 'none';
    nextBtn.style.lineHeight = '1';
    nextBtn.style.display = 'inline';

    nextBtn.addEventListener('click', () => {
        let current = parseInt(localStorage.getItem('not-a-robot-level') || '0', 10);
        if (isNaN(current)) current = 0;
        let next = current + 1;
        if (next > 47) next = 47;
        setLevel(next);
    });
    topRow.appendChild(nextBtn);

    const levelRow = document.createElement('div');
    levelRow.style.display = 'flex';
    levelRow.style.flexDirection = 'row';
    levelRow.style.gap = '10px';
    container.appendChild(levelRow);

    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.min = '1';
    levelInput.max = '47';
    levelInput.value = '';
    levelInput.placeholder = 'Level';
    levelInput.style.width = '70px';
    levelInput.style.fontSize = '18px';
    levelInput.style.padding = '5px';
    levelInput.style.borderRadius = '6px';
    levelInput.style.border = '1px solid #ccc';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Go';
    confirmBtn.style.padding = '10px 20px';
    confirmBtn.style.fontSize = '16px';
    confirmBtn.style.background = '#007bff';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '6px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    confirmBtn.addEventListener('click', () => {
        let val = parseInt(levelInput.value, 10);
        if (isNaN(val)) return;
        if (val < 1) val = 1;
        if (val > 47) val = 47;
        setLevel(val - 1);
    });

    levelInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });

    levelRow.appendChild(levelInput);
    levelRow.appendChild(confirmBtn);

    let skipVideosEnabled = localStorage.getItem('skipEndingVideo') !== 'false';

    const switchContainer = document.createElement('div');
    switchContainer.style.display = 'flex';
    switchContainer.style.alignItems = 'center';
    switchContainer.style.gap = '10px';

    const switchLabel = document.createElement('span');
    switchLabel.textContent = 'Skip Ending Video';
    switchLabel.style.fontSize = '16px';

    const switchToggle = document.createElement('label');
    switchToggle.style.position = 'relative';
    switchToggle.style.display = 'inline-block';
    switchToggle.style.width = '50px';
    switchToggle.style.height = '24px';

    const switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    switchInput.checked = skipVideosEnabled;
    switchInput.style.opacity = '0';
    switchInput.style.width = '0';
    switchInput.style.height = '0';

    const slider = document.createElement('span');
    slider.style.position = 'absolute';
    slider.style.cursor = 'pointer';
    slider.style.top = '0';
    slider.style.left = '0';
    slider.style.right = '0';
    slider.style.bottom = '0';
    slider.style.backgroundColor = '#ccc';
    slider.style.transition = '.4s';
    slider.style.borderRadius = '24px';

    const knob = document.createElement('span');
    knob.style.position = 'absolute';
    knob.style.height = '18px';
    knob.style.width = '18px';
    knob.style.left = '3px';
    knob.style.bottom = '3px';
    knob.style.backgroundColor = 'white';
    knob.style.transition = '.4s';
    knob.style.borderRadius = '50%';
    slider.appendChild(knob);

    switchToggle.appendChild(switchInput);
    switchToggle.appendChild(slider);

    function updateSwitchUI() {
        if (skipVideosEnabled) {
            slider.style.backgroundColor = '#4CAF50';
            knob.style.transform = 'translateX(26px)';
        } else {
            slider.style.backgroundColor = '#ccc';
            knob.style.transform = 'translateX(0)';
        }
    }
    updateSwitchUI();

    switchInput.addEventListener('change', () => {
        skipVideosEnabled = switchInput.checked;
        localStorage.setItem('skipEndingVideo', skipVideosEnabled ? 'true' : 'false');
        updateSwitchUI();
        console.log('Skip Ending Video:', skipVideosEnabled);
    });

    switchContainer.appendChild(switchLabel);
    switchContainer.appendChild(switchToggle);
    container.appendChild(switchContainer);

    function skipVideosToEnd() {
        if (!skipVideosEnabled) return;
        document.querySelectorAll('video').forEach(v => {
            if (v.readyState >= 1) {
                v.currentTime = v.duration;
                console.log('Skipped video to end:', v.src);
            } else {
                v.addEventListener('loadedmetadata', () => {
                    if (skipVideosEnabled) {
                        v.currentTime = v.duration;
                        console.log('Skipped video to end after metadata:', v.src);
                    }
                });
            }
        });
    }

    skipVideosToEnd();
    const observer = new MutationObserver(() => skipVideosToEnd());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('keydown', (e) => {
        let current = parseInt(localStorage.getItem('not-a-robot-level') || '0', 10);
        if (isNaN(current)) current = 0;

        const ctrlRequiredLevels = [14, 25, 37];
        const ctrlRequired = ctrlRequiredLevels.includes(current);

        if (ctrlRequired && !e.ctrlKey) return;
        if (!ctrlRequired && e.ctrlKey) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        }
    });

})();