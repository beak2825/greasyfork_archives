// ==UserScript==
// @name         shikimori-ext-beta
// @namespace    http://tampermonkey.net/
// @version      0.22.6-beta
// @description  Добавляет ссылки на просмотр и горячую клавишу C (с ограничением по вышедшим эпизодам)
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://shikimori.one/animes/*
// @match        https://shikimori.me/animes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553298/shikimori-ext-beta.user.js
// @updateURL https://update.greasyfork.org/scripts/553298/shikimori-ext-beta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class Settings {
        static config = {
            logger: {
                ui: true,
                console: true,
                level: ['info', 'success', 'warn', 'error']
            },
            hotkeys: {
                incrementEpisode: 'KeyC',
                watchFirstLink: 'KeyW'
            }
        };
    }

    class Logger {
        static timeoutId = null;
        static hover = false;

        static init() {
            if (!Settings.config.logger.ui || document.getElementById("shikimori-log")) return;

            const logDiv = document.createElement("div");
            logDiv.id = "shikimori-log";
            logDiv.style.cssText = `
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                border-radius: 0.5rem;
                font-family: monospace;
                z-index: 9999;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: auto;
                cursor: default;
            `;
            logDiv.addEventListener('mouseenter', () => { Logger.hover = true; Logger.show(); clearTimeout(Logger.timeoutId); });
            logDiv.addEventListener('mouseleave', () => { Logger.hover = false; Logger.startHideTimer(); });
            document.body.appendChild(logDiv);
        }

        static show() { document.getElementById("shikimori-log")?.style.setProperty('opacity','1'); }
        static hide() { document.getElementById("shikimori-log")?.style.setProperty('opacity','0'); }

        static startHideTimer() {
            clearTimeout(Logger.timeoutId);
            Logger.timeoutId = setTimeout(() => { if (!Logger.hover) Logger.hide(); }, 5000);
        }

        static log(msg, type='info') {
            if ((!Settings.config.logger.ui && !Settings.config.logger.console) || !Settings.config.logger.level.includes(type)) return;

            const colors = { info:"#00aaff", success:"#00cc66", warn:"#ffaa00", error:"#ff4444" };
            if (Settings.config.logger.console) console.log(`%c[shikimori-ext] ${msg}`, `color: ${colors[type] || "#00aaff"}`);
            if (Settings.config.logger.ui) {
                const el = document.getElementById("shikimori-log");
                if (!el) return;
                el.textContent = `[shikimori-ext] ${msg}`;
                el.style.borderLeft = `4px solid ${colors[type] || "#00aaff"}`;
                Logger.show();
                Logger.startHideTimer();
            }
        }
    }

    class WatchLinks {
        constructor() { this.init(); }

        init() {
            const meta = document.querySelector("#animes_show > section > div > header > meta");
            if (!meta) {
                Logger.log("Meta тэг не найден, не удалось определить название аниме", "error");
                return;
            }
            const animename = meta.content;

            if (!document.querySelector(".b-watch_links")) {
                const image = document.querySelector(".c-image");
                if (!image) {
                    Logger.log("Изображение аниме не найдено, ссылки не созданы", "warn");
                    return;
                }
                const div = document.createElement("div");
                div.className = "b-watch_links";
                div.innerHTML = `
                <a class="b-link_button" href="https://anime-365.ru/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Anime365</a>
                <a class="b-link_button" href="https://smotret-anime.com/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Anime365 (mirror)</a>
                <a class="b-link_button" href="https://hentai365.ru/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Hentai365</a>
                <a class="b-link_button" href="https://h365-art.org/catalog/search?q=${encodeURIComponent(animename)}" target="_blank">Hentai365 (mirror)</a>
                <a class="b-link_button" href="https://animego.org/search/anime?q=${encodeURIComponent(animename)}" target="_blank">AnimeGO</a>
                <a class="b-link_button b-link_button--loading" id="animelib-link" target="_blank">Animelib...</a>
            `;
                image.append(div);
                Logger.log("Ссылки на аниме созданы", "success");
            }

            this.fetchAnimelib(animename);
        }

        fetchAnimelib(name) {
            fetch(`https://api.cdnlibs.org/api/anime?q=${encodeURIComponent(name)}`)
                .then(r => r.json())
                .then(json => {
                const entry = json?.data?.[0];
                const link = document.getElementById("animelib-link");
                if (!entry || !entry.slug_url || !link) {
                    Logger.log(`Animelib: не удалось найти аниме`, "error");
                    if (link) { link.textContent = "Animelib (не найдено)"; link.removeAttribute("href"); }
                    return;
                }
                link.textContent = "Animelib";
                link.href = `https://v3.animelib.org/ru/anime/${entry.slug_url}`;
                link.classList.remove("b-link_button--loading");
                //Logger.log(`Animelib: ссылка на "${name}" создана`, "success");
            })
                .catch((err) => {
                Logger.log(`Animelib: ошибка поиска аниме "${name}": ${err}`, "error");
                const link = document.getElementById("animelib-link");
                if (link) { link.textContent = "Animelib (ошибка)"; link.removeAttribute("href"); }
            });
        }
    }

    class Hotkeys {
        constructor() { this.init(); }

        init() {
            document.addEventListener("keydown", (e) => {
                const episodesEl = Array.from(document.querySelectorAll("#animes_show .c-info-left .block .value"))
                .find(el => el.previousElementSibling?.textContent.trim() === "Эпизоды:");
                const rateSpan = document.querySelector("#animes_show .b-user_rate .rate-number .current-episodes");
                const addBtn = document.querySelector(".rate-number .item-add.increment");

                // Клавиша C – увеличить эпизод
                if (e.code === Settings.config.hotkeys.incrementEpisode) {
                    if (!episodesEl || !rateSpan || !addBtn) return;

                    const match = episodesEl.textContent.match(/(\d+)(?:\s*\/\s*(\d+))?/);
                    console.log(episodesEl,rateSpan,addBtn,match);

                    if (!match) return;

                    const current = parseInt(rateSpan.textContent.trim()) || 0;
                    const released = parseInt(match[1], 10);
                    if (current < released) {
                        addBtn.click();
                        Logger.log(`Эпизод добавлен: ${current+1}/${released}`, 'success');
                    } else {
                        Logger.log(`Максимум вышедших эпизодов достигнут: ${current}/${released}`, 'warn');
                    }
                }

                // Клавиша W – открыть первую ссылку
                if (e.code === Settings.config.hotkeys.watchFirstLink) {
                    const firstLink = document.querySelector(".b-watch_links a");
                    if (firstLink && firstLink.href) {
                        window.open(firstLink.href, "_blank");
                        Logger.log(`Открыта первая ссылка`, 'success');
                    } else {
                        Logger.log("Первая ссылка не найдена", 'warn');
                    }
                }
            });
        }
    }

    function onDocumentReady(callback) {
        document.addEventListener('page:load', callback);
        document.addEventListener('turbolinks:load', callback);
        if (document.readyState !== 'loading') callback();
        else document.addEventListener('DOMContentLoaded', callback);
    }

    onDocumentReady(() => {
        Logger.init();
        Logger.log("Инициализация расширения...", 'info');
        new WatchLinks();
        new Hotkeys();
    });

})();
