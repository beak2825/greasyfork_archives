// ==UserScript==
// @name         HDRezka Speed Toggle + Slider
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  Кнопка со слайдером для плавного изменения скорости воспроизведения видео на HDRezka
// @author       T.Er
// @icon         https://img.icons8.com/?size=100&id=MSyqQ3LgGhFt&format=png&color=000000
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549550/HDRezka%20Speed%20Toggle%20%2B%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/549550/HDRezka%20Speed%20Toggle%20%2B%20Slider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActive = false;

    function addSpeedButtons() {
        const forwardBtn = document.querySelector('.hc-player-control.hc-player-control-forward');
        //if (!controls || !forwardBtn) return;

        const video = document.querySelector('video');
        if (!video) return;

        // ищем контейнер управления плеером
        //let controls = document.querySelector('.hc-player-control')
                       //|| document.querySelector('.gm-hc-player-control');
        let controls = document.querySelector('.gm-hc-player-control');
        if (!controls) {
            // если нет, создаём свой контейнер
            controls = document.createElement('div');
            controls.className = 'gm-hc-player-control';
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';
            controls.style.justifyContent = 'flex-start';
            controls.style.gap = '5px';
            controls.style.fontSize = '11px';
            controls.style.position = 'absolute';
            controls.style.bottom = '55px';
            controls.style.width = '60px';
            controls.style.height = '35px';
            controls.style.left = '10px';
            controls.style.zIndex = 9999;
            controls.style.background = 'rgba(23, 35, 34, 0.7)';
            controls.style.padding = '0px 0px 0px 5px';
            controls.style.borderRadius = '4px';
            video.parentElement.appendChild(controls);

            // обработка hover через JS
            controls.addEventListener('mouseenter', () => {
                controls.style.background = 'rgba(0, 173, 239, 0.7)';
            });
            controls.addEventListener('mouseleave', () => {
                controls.style.background = 'rgba(23, 35, 34, 0.7)';
            });

        }

        // проверяем, есть ли уже кнопка
        let existingBtn = document.querySelector('.hc-player-control-speed-slider-btn');
        if (existingBtn) {
            return;
        }
        const sliderBtn = document.createElement('div');
        sliderBtn.className = 'hc-player-control hc-player-control-speed-slider-btn';
        sliderBtn.style.width = '50px';
        sliderBtn.style.height = '35px';
        sliderBtn.style.fontSize = '11px';
        sliderBtn.style.display = 'flex';
        sliderBtn.style.flexDirection = 'column';
        sliderBtn.style.alignItems = 'center';
        sliderBtn.style.justifyContent = 'center';
        sliderBtn.style.cursor = 'pointer';
        sliderBtn.style.position = 'relative';
        sliderBtn.style.zIndex = '9999';
        sliderBtn.style.transition = 'opacity 0.3s';

        // надпись Speed
        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'Speed';
        titleSpan.style.fontSize = '11px';
        sliderBtn.appendChild(titleSpan);

        // текущее значение скорости
        const valueSpan = document.createElement('span');
        valueSpan.textContent = video.playbackRate.toFixed(2) + 'x';
        valueSpan.style.fontSize = '10px';
        valueSpan.style.color = 'white';
        sliderBtn.appendChild(valueSpan);

        // контейнер для ползунка (над кнопкой)
        const sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'absolute';
        sliderContainer.style.zIndex = '10000';
        sliderContainer.style.bottom = '35px'; // над кнопкой
        sliderContainer.style.left = '50%';
        sliderContainer.style.transform = 'translateX(-50%)';
        sliderContainer.style.padding = '5px';
        //sliderContainer.style.background = 'rgba(0,0,0,0.2)';
        sliderContainer.style.borderRadius = '4px';
        //sliderContainer.style.display = 'none';
        sliderContainer.style.zIndex = 1000;
        sliderContainer.style.display = 'flex';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.gap = '5px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0.5;
        slider.max = 3;
        slider.step = 0.05;
        slider.value = video.playbackRate;
        slider.style.width = '100px';

        slider.addEventListener('input', () => {
            video.playbackRate = parseFloat(slider.value);
            valueSpan.textContent = slider.value + 'x'; // обновляем надпись на кнопке
        });

        sliderContainer.appendChild(slider);
        sliderBtn.appendChild(sliderContainer);

        // показать/спрятать сам ползунок по клику
        //sliderBtn.addEventListener('click', () => {
            //sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'flex' : 'none';
        //});

        // --- логика автоскрытия кнопки ---
        let hideTimer = null;

        function resetHideTimer() {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                sliderBtn.style.opacity = '0';
                controls.style.background = 'transparent'
                sliderBtn.style.pointerEvents = 'none'; // чтобы не мешал
            }, 2000);
        }

        // показывать кнопку при движении мыши над плеером
        video.parentElement.addEventListener('mousemove', () => {
            sliderBtn.style.opacity = '1';
            sliderBtn.style.pointerEvents = 'auto';
            resetHideTimer();
        });

        // если кнопка уже есть в DOM
        if (forwardBtn) {
            sliderBtn.remove();
            forwardBtn.insertAdjacentElement('afterend', sliderBtn);
        } else {
            controls.appendChild(sliderBtn);
        }

    }

    const observer = new MutationObserver(() => addSpeedButtons());
    observer.observe(document.body, { childList: true, subtree: true });
})();
