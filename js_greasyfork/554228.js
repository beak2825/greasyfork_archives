// ==UserScript==
// @name         050 HDRezka: Автозамена и переключение CDN с проверкой потока (v0.5.0)
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Автоматическая подмена заблокированных доменов на рабочие CDN, реагирует на смену озвучки, корректно перезапускает поток и отображает текущий CDN.
// @author       You
// @include      /^https?:\/\/.*rezk.*\/(films|series)\/.*$/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/554228/050%20HDRezka%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20CDN%20%D1%81%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0%20%28v050%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554228/050%20HDRezka%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20CDN%20%D1%81%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0%20%28v050%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let vers = '0.5.0';

    console.log('%c[HDRezka Fix] v0.5.0 запущен', 'color:#4caf50;font-weight:bold;');

    const blockedHosts = [
        'sambray.org',
        'stream.voidboost.cc'
    ];

    const workingCDNs = [
        'prx-ams.ukrtelcdn.net',
        'prx2-ams.ukrtelcdn.net',
        'ukrtelcdn.net',
        'prx.ukrtelcdn.net',
        'prx-cogent.ukrtelcdn.net',
        'prx2-cogent.ukrtelcdn.net',
        'prx3-cogent.ukrtelcdn.net',
        'prx4-cogent.ukrtelcdn.net',
        'prx5-cogent.ukrtelcdn.net'
    ];

    // 🔹 Проверка потока (HEAD-запрос)
    async function checkStreamAvailable(url) {
        try {
            const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            return res.ok || res.type === 'opaque';
        } catch {
            return false;
        }
    }

    // 🔹 Получить элемент <video>
    function findVideo() {
        return document.querySelector('video');
    }

    // 🔹 Определить текущий CDN по адресу
    function getCurrentCDN(src) {
        if (!src) return null;
        for (const cdn of workingCDNs) {
            if (src.includes(cdn)) return cdn;
        }
        return null;
    }

    // 🔹 Заменить хост на новый CDN
    function replaceCDN(src, newCDN) {
        if (!src) return null;
        try {
            const url = new URL(src);
            const hostname = url.hostname.toLowerCase();
            for (const host of blockedHosts.concat(workingCDNs)) {
                const h = host.toLowerCase();
                if (hostname === h || hostname.endsWith('.' + h)) {
                    url.hostname = newCDN;
                    return url.toString();
                }
            }
            return src;
        } catch (e) {
            console.warn('[HDRezka Fix] Ошибка в replaceCDN:', e);
            return null;
        }
    }

    // 🔹 Обновить источник видео
    async function updateVideoSource(video, newSrc) {
        if (!video) return;
        try {
            video.pause();
            video.src = newSrc;
            video.load();
            setTimeout(() => {
                video.play().catch(err => console.warn('[HDRezka Fix] Не удалось autoplay:', err));
            }, 800);
            console.log('[HDRezka Fix] Поток обновлён:', newSrc);
        } catch (e) {
            console.error('[HDRezka Fix] Ошибка при смене источника:', e);
        }
    }

    // 🔹 Обновить текст текущего CDN
    function showCDNInfo(cdn) {
        const info = document.getElementById('cdn-info-display');
        if (info) info.textContent = `Текущий CDN: ${cdn ?? 'неизвестно'}`;
    }

    // 🔹 Автоматическая подмена заблокированного домена
    async function autoFixCDN() {
        const video = findVideo();
        if (!video || !video.src) return;

        const src = video.src;
        const isBlocked = blockedHosts.some(h => src.includes(h));
        if (!isBlocked) {
            const current = getCurrentCDN(src);
            showCDNInfo(current);
            return;
        }

        console.log('[HDRezka Fix] Найден заблокированный поток:', src);

        for (const cdn of workingCDNs) {
            const newSrc = replaceCDN(src, cdn);
            if (!newSrc) continue;

            const ok = await checkStreamAvailable(newSrc);
            console.log(`[HDRezka Fix] Проверка CDN ${cdn}: ${ok ? '✅ доступен' : '❌ недоступен'}`);
            if (ok) {
                await updateVideoSource(video, newSrc);
                showCDNInfo(cdn);
                console.log(`✅ Переключено на ${cdn}`);
                return;
            }
        }

        console.warn('❌ Нет доступных CDN');
    }

    // 🔹 Создать интерфейс выбора CDN
    function createCDNSelector(currentCDN = 'неизвестно') {
        if (document.getElementById('cdn-selector-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'cdn-selector-wrapper';
        wrapper.style.cssText = `
            margin: 8px 0 12px 0;
            font-family: Arial, sans-serif;
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
        `;

        const info = document.createElement('div');
        info.id = 'cdn-info-display';
        info.style.cssText = `
            background: #63b55b;
            color: white;
            padding: 2px 10px;
            font-weight: bold;
            border-radius: 2px;
            user-select: none;
        `;
        info.textContent = `Текущий CDN: ${currentCDN ?? 'неизвестно'}`;
        wrapper.appendChild(info);

        const label = document.createElement('label');
        label.textContent = 'Выбрать CDN:';
        label.style.color = '#007acc';
        wrapper.appendChild(label);

        const select = document.createElement('select');
        select.style.padding = '4px 6px';
        select.style.borderRadius = '3px';
        select.style.border = '1px solid #007acc';
        workingCDNs.forEach(cdn => {
            const opt = document.createElement('option');
            opt.value = cdn;
            opt.textContent = cdn;
            if (cdn === currentCDN) opt.selected = true;
            select.appendChild(opt);
        });
        wrapper.appendChild(select);

        const btn = document.createElement('button');
        btn.textContent = 'Сменить поток';
        btn.style.cssText = `
            padding: 5px 10px;
            background: #007acc;
            font-size: 12px;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        btn.onclick = async () => {
            const video = findVideo();
            if (!video) return console.warn('❌ Видео не найдено');
            const newCDN = select.value;
            const newSrc = replaceCDN(video.src, newCDN);
            if (!newSrc) return console.warn('❌ Не удалось заменить CDN');
            const ok = await checkStreamAvailable(newSrc);
            if (!ok) return console.warnn('❌ CDN недоступен');
            await updateVideoSource(video, newSrc);
            showCDNInfo(newCDN);
            console.log(`✅ Переключено на ${newCDN}`);
        };
        wrapper.appendChild(btn);

        const version = document.createElement('div');
        version.id = 'cdn-version-display';
        version.style.cssText = `
            background: #63b55b;
            color: white;
            padding: 2px 8px;
            font-weight: bold;
            font-size: 10px;
            border-radius: 2px;
            user-select: none;
        `;
        version.textContent = 'v. ' + vers;
        wrapper.appendChild(version);

        const target = document.querySelector('.b-post__description_text');
        (target?.parentNode || document.body).insertBefore(wrapper, target?.nextSibling || null);
    }

    // 🔹 Основная инициализация
    async function main() {
        await autoFixCDN();
        const video = findVideo();
        const cdn = video?.src ? getCurrentCDN(video.src) : 'неизвестно';
        createCDNSelector(cdn);
    }

    // 🔹 Реагируем на любую смену <video> (новая озвучка / качество)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if ([...m.addedNodes].some(n => n.tagName === 'VIDEO')) {
                console.log('[HDRezka Fix] Обнаружено новое видео → перезапуск проверки');
                setTimeout(main, 800);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => setTimeout(main, 1500));
})();
