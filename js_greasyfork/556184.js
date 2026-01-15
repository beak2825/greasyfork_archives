// ==UserScript==
// @name         chimo-chimo-loop
// @name:zh-CN   chimo-chimo-loop
// @namespace    https://github.com/ryu-dayo/chimo-chimo-loop
// @version      1.1.0
// @description  Adds PiP, loop, and speed controls to HTML5 videos.
// @description:zh-CN  为 HTML5 视频播放器添加画中画（PiP）、循环播放和倍速控制按钮。
// @author       ryu-dayo
// @match        https://www.douyin.com/*
// @match        https://www.instagram.com/*
// @match        https://www.threads.com/*
// @match        https://www.xiaohongshu.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556184/chimo-chimo-loop.user.js
// @updateURL https://update.greasyfork.org/scripts/556184/chimo-chimo-loop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ICONS = {
        enterPip: 'data:image/svg+xml,%3Csvg%20width%3D%22101%22%20height%3D%2282%22%20viewBox%3D%220%200%20101%2082%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.4512%2063.2813H68.2129C76.5625%2063.2813%2080.6641%2059.2285%2080.6641%2051.0254V12.2559C80.6641%204.0527%2076.5625%200%2068.2129%200H12.4512C4.10158%200%200%204.0527%200%2012.2559V51.0254C0%2059.2285%204.10158%2063.2813%2012.4512%2063.2813ZM7.03128%2050.6348V12.6465C7.03128%208.9356%209.03318%207.0313%2012.5489%207.0313H68.1153C71.6309%207.0313%2073.6328%208.9356%2073.6328%2012.6465V50.6348C73.6328%2054.3457%2071.6309%2056.25%2068.1153%2056.25H12.5489C9.03318%2056.25%207.03128%2054.3457%207.03128%2050.6348Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M30.957%2016.8457C30.8105%2015.625%2029.1991%2014.209%2027.6366%2015.8692L23.4374%2019.9707L17.5781%2014.1113C16.5527%2013.0371%2014.8437%2013.0371%2013.8183%2014.1113C12.7441%2015.1367%2012.7441%2016.8457%2013.8183%2017.8711L19.6777%2023.7305L15.5761%2027.9297C13.9159%2029.4922%2015.332%2031.1035%2016.5527%2031.25L30.664%2033.3984C31.3476%2033.4961%2032.0312%2033.252%2032.5195%2032.8125C32.9589%2032.3242%2033.2031%2031.6406%2033.1054%2030.957L30.957%2016.8457Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M50.4883%2081.6407H87.6953C95.9964%2081.6407%20100.146%2077.5879%20100.146%2069.3848V44.7754C100.146%2036.6211%2095.9964%2032.5195%2087.6953%2032.5195H50.4883C42.1875%2032.5195%2038.0371%2036.5723%2038.0371%2044.7754V69.3848C38.0371%2077.5879%2042.1875%2081.6407%2050.4883%2081.6407Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        exitPip: 'data:image/svg+xml,%3Csvg%20width%3D%22101%22%20height%3D%2282%22%20viewBox%3D%220%200%20101%2082%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.4512%2063.2813H68.2129C76.5625%2063.2813%2080.6641%2059.2285%2080.6641%2051.0254V12.2559C80.6641%204.0527%2076.5625%200%2068.2129%200H12.4512C4.10158%200%200%204.0527%200%2012.2559V51.0254C0%2059.2285%204.10158%2063.2813%2012.4512%2063.2813ZM7.03128%2050.6348V12.6465C7.03128%208.9356%209.03318%207.0313%2012.5489%207.0313H68.1153C71.6309%207.0313%2073.6328%208.9356%2073.6328%2012.6465V50.6348C73.6328%2054.3457%2071.6309%2056.25%2068.1153%2056.25H12.5489C9.03318%2056.25%207.03128%2054.3457%207.03128%2050.6348Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M15.1366%2029.8827C15.2831%2031.1034%2016.9433%2032.4706%2018.5058%2030.8593L22.6562%2026.7577L28.5644%2032.6171C29.5898%2033.6425%2031.2988%2033.6425%2032.3241%2032.6171C33.3495%2031.5917%2033.3495%2029.8827%2032.3241%2028.8573L26.4648%2022.9491L30.5663%2018.7987C32.1777%2017.2362%2030.8105%2015.5761%2029.5409%2015.4296L15.4784%2013.33C14.746%2013.2323%2014.1113%2013.4765%2013.623%2013.9159C13.1835%2014.4042%2012.9394%2015.0878%2013.037%2015.7714L15.1366%2029.8827Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M50.4883%2081.6407H87.6953C95.9964%2081.6407%20100.146%2077.5879%20100.146%2069.3848V44.7754C100.146%2036.6211%2095.9964%2032.5195%2087.6953%2032.5195H50.4883C42.1875%2032.5195%2038.0371%2036.5723%2038.0371%2044.7754V69.3848C38.0371%2077.5879%2042.1875%2081.6407%2050.4883%2081.6407Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        enableLoop: 'data:image/svg+xml,%3Csvg%20width%3D%2299%22%20height%3D%2266%22%20viewBox%3D%220%200%2099%2066%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M28.1739%2065.8691H70.6543C87.6953%2065.8691%2098.8284%2054.834%2098.8284%2037.7441C98.8284%2020.6543%2087.6953%209.47259%2070.6543%209.47259H62.2559C60.3028%209.47259%2058.7403%2011.084%2058.7403%2012.9883C58.7403%2014.9414%2060.3028%2016.5527%2062.2559%2016.5527H70.6543C83.252%2016.5527%2091.7964%2025.1465%2091.7964%2037.7441C91.7964%2050.3418%2083.252%2058.8379%2070.6543%2058.8379H28.1739C15.5274%2058.8379%207.03128%2050.3418%207.03128%2037.7441C7.03128%2025.1465%2015.5274%2016.5527%2028.1739%2016.5527H33.3496C33.1055%2015.332%2032.959%2014.0625%2032.959%2012.7441C32.959%2011.6699%2033.0567%2010.5957%2033.252%209.52149L28.1739%209.47259C11.0352%209.32619%200%2020.6543%200%2037.7441C0%2054.834%2011.0352%2065.8691%2028.1739%2065.8691Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M51.3672%2025.4394C58.4473%2025.4394%2064.1114%2019.7266%2064.1114%2012.6953C64.1114%205.6641%2058.4473%200%2051.3672%200C44.336%200%2038.6719%205.6641%2038.6719%2012.6953C38.6719%2019.7266%2044.336%2025.4394%2051.3672%2025.4394ZM51.3672%2018.6035C48.0957%2018.6035%2045.5078%2015.9668%2045.5078%2012.6953C45.5078%209.375%2048.0957%206.8359%2051.3672%206.8359C54.7364%206.8359%2057.2754%209.375%2057.2754%2012.6953C57.2754%2015.9668%2054.7364%2018.6035%2051.3672%2018.6035Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        disableLoop: 'data:image/svg+xml,%3Csvg%20width%3D%2299%22%20height%3D%2266%22%20viewBox%3D%220%200%2099%2066%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M28.1739%2065.8691H70.6543C87.6953%2065.8691%2098.8284%2054.834%2098.8284%2037.7441C98.8284%2020.6543%2087.6953%209.47259%2070.6543%209.47259H62.2559C60.3028%209.47259%2058.7403%2011.084%2058.7403%2012.9883C58.7403%2014.9414%2060.3028%2016.5527%2062.2559%2016.5527H70.6543C83.252%2016.5527%2091.7964%2025.1465%2091.7964%2037.7441C91.7964%2050.3418%2083.252%2058.8379%2070.6543%2058.8379H28.1739C15.5274%2058.8379%207.03128%2050.3418%207.03128%2037.7441C7.03128%2025.1465%2015.5274%2016.5527%2028.1739%2016.5527H33.3496C33.1055%2015.332%2032.959%2014.0625%2032.959%2012.7441C32.959%2011.6699%2033.0567%2010.5957%2033.252%209.52149L28.1739%209.47259C11.0352%209.32619%200%2020.6543%200%2037.7441C0%2054.834%2011.0352%2065.8691%2028.1739%2065.8691Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M51.3672%2025.4394C58.4473%2025.4394%2064.1114%2019.7266%2064.1114%2012.6953C64.1114%205.6641%2058.4473%200%2051.3672%200C44.336%200%2038.6719%205.6641%2038.6719%2012.6953C38.6719%2019.7266%2044.336%2025.4394%2051.3672%2025.4394Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        stats: 'data:image/svg+xml,%3Csvg%20width%3D%2279%22%20height%3D%2279%22%20viewBox%3D%220%200%2079%2079%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M39.4043%2078.8086C61.1817%2078.8086%2078.8575%2061.1816%2078.8575%2039.4043C78.8575%2017.627%2061.1817%200%2039.4043%200C17.6758%200%200%2017.627%200%2039.4043C0%2061.1816%2017.6758%2078.8086%2039.4043%2078.8086ZM39.4043%2071.3867C21.7286%2071.3867%207.47066%2057.0801%207.47066%2039.4043C7.47066%2021.7285%2021.7286%207.42191%2039.4043%207.42191C57.0801%207.42191%2071.3868%2021.7285%2071.3868%2039.4043C71.3868%2057.0801%2057.0801%2071.3867%2039.4043%2071.3867Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M32.8125%2061.0352H48.3399C50.0977%2061.0352%2051.5137%2059.7656%2051.5137%2057.959C51.5137%2056.25%2050.0977%2054.9316%2048.3399%2054.9316H44.043V36.6699C44.043%2034.2773%2042.8711%2032.7637%2040.6739%2032.7637H33.545C31.7871%2032.7637%2030.42%2034.082%2030.42%2035.7422C30.42%2037.5488%2031.7871%2038.8184%2033.545%2038.8184H37.1094V54.9316H32.8125C31.0547%2054.9316%2029.6387%2056.25%2029.6387%2057.959C29.6387%2059.7656%2031.0547%2061.0352%2032.8125%2061.0352ZM39.0137%2026.7578C42.0899%2026.7578%2044.4825%2024.3164%2044.4825%2021.2402C44.4825%2018.1641%2042.0899%2015.7715%2039.0137%2015.7715C35.9864%2015.7715%2033.545%2018.1641%2033.545%2021.2402C33.545%2024.3164%2035.9864%2026.7578%2039.0137%2026.7578Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        playbackRate: 'data:image/svg+xml,%3Csvg%20width%3D%2279%22%20height%3D%2279%22%20viewBox%3D%220%200%2079%2079%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M39.4043%2078.8086C61.1817%2078.8086%2078.8575%2061.1816%2078.8575%2039.4043C78.8575%2017.627%2061.1817%200%2039.4043%200C17.6758%200%200%2017.627%200%2039.4043C0%2061.1816%2017.6758%2078.8086%2039.4043%2078.8086ZM39.4043%2071.3867C21.7286%2071.3867%207.47066%2057.0801%207.47066%2039.4043C7.47066%2021.7285%2021.7286%207.42191%2039.4043%207.42191C57.0801%207.42191%2071.3868%2021.7285%2071.3868%2039.4043C71.3868%2057.0801%2057.0801%2071.3867%2039.4043%2071.3867Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M24.3653%2057.8125C26.3184%2057.8125%2027.9297%2056.2012%2027.9297%2054.248C27.9297%2052.2949%2026.3184%2050.6836%2024.3653%2050.6836C22.4121%2050.6836%2020.8008%2052.2949%2020.8008%2054.248C20.8008%2056.2012%2022.4121%2057.8125%2024.3653%2057.8125ZM18.1641%2042.9687C20.1172%2042.9687%2021.7286%2041.3574%2021.7286%2039.4043C21.7286%2037.4512%2020.1172%2035.8398%2018.1641%2035.8398C16.211%2035.8398%2014.5508%2037.4512%2014.5508%2039.4043C14.5508%2041.3574%2016.211%2042.9687%2018.1641%2042.9687ZM24.3653%2028.125C26.3184%2028.125%2027.9297%2026.5137%2027.9297%2024.5605C27.9297%2022.6074%2026.3184%2020.9961%2024.3653%2020.9961C22.4121%2020.9961%2020.8008%2022.6074%2020.8008%2024.5605C20.8008%2026.5137%2022.4121%2028.125%2024.3653%2028.125ZM39.3555%2021.7773C41.3086%2021.7773%2042.9688%2020.166%2042.9688%2018.2129C42.9688%2016.2598%2041.3086%2014.6484%2039.3555%2014.6484C37.4024%2014.6484%2035.7911%2016.2598%2035.7911%2018.2129C35.7911%2020.166%2037.4024%2021.7773%2039.3555%2021.7773ZM60.4981%2042.9687C62.4512%2042.9687%2064.1114%2041.3574%2064.1114%2039.4043C64.1114%2037.4512%2062.4512%2035.8398%2060.4981%2035.8398C58.545%2035.8398%2056.9336%2037.4512%2056.9336%2039.4043C56.9336%2041.3574%2058.545%2042.9687%2060.4981%2042.9687ZM54.2969%2057.8125C56.25%2057.8125%2057.8614%2056.2012%2057.8614%2054.248C57.8614%2052.2949%2056.25%2050.6836%2054.2969%2050.6836C52.3438%2050.6836%2050.7325%2052.2949%2050.7325%2054.248C50.7325%2056.2012%2052.3438%2057.8125%2054.2969%2057.8125ZM32.8614%2045.8008C35.5469%2048.4863%2039.3067%2048.4863%2041.9922%2045.8008C42.5293%2045.2637%2043.3106%2044.1406%2043.7989%2043.457L56.3477%2025.0488C57.0801%2023.9746%2056.836%2022.998%2056.25%2022.3633C55.6641%2021.7773%2054.6387%2021.582%2053.6133%2022.2656L35.1563%2034.8144C34.5215%2035.3027%2033.3496%2036.1328%2032.8614%2036.6211C30.1758%2039.3066%2030.1758%2043.1152%2032.8614%2045.8008Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
    };

    const STYLE = `
        .ccl-controls-container {
            position: fixed;
            z-index: 999;
            display: block;
            pointer-events: none;
            will-change: top, left, width, height;
        }

        .ccl-bar {
            position: absolute;
            top: 6px;
            left: 6px;
            display: inline-flex;
            will-change: transform;
            height: 31px;
        }

        .ccl-bg, .ccl-bg > div {
            position: absolute;
            inset: 0;
            border-radius: 24px;
            pointer-events: none;
        }

        .ccl-bg > .blur {
            background-color: rgba(0, 0, 0, 0.55);
            backdrop-filter: saturate(180%) blur(17.5px);
            -webkit-backdrop-filter: saturate(180%) blur(17.5px);
        }

        .ccl-btn-container > button {
            display: flex;
            align-items: center;
            justify-content: center;
            border-width: 0;
            padding: 0;
            cursor: pointer;
            background-color: transparent !important;
            transition: opacity 0.1s linear;
        }

        .ccl-icon-pip { --icon: url('${ICONS.enterPip}'); }
        .ccl-icon-pip[data-active="true"] { --icon: url('${ICONS.exitPip}'); }
        .ccl-icon-loop { --icon: url('${ICONS.enableLoop}'); }
        .ccl-icon-loop[data-active="true"] { --icon: url('${ICONS.disableLoop}'); }
        .ccl-icon-stats { --icon: url('${ICONS.stats}'); }
        .ccl-icon-rate { --icon: url('${ICONS.playbackRate}'); }

        .ccl-btn-container picture {
            width: 16px;
            height: 16px;
            background-color: white;
            mix-blend-mode: plus-lighter;
            mask-image: var(--icon);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            transition: transform 150ms;
            pointer-events: none;
        }

        .ccl-btn-container > button:active:not(:has(.ccl-menu:active)) picture { transform: scale(0.89); }

        .ccl-btn-container {
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: center;
            padding: 0 16px;
        }

        .ccl-bar.hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .ccl-bar.visible {
            opacity: 1;
            pointer-events: auto;
            transition: opacity 0.3s ease;
        }

        .ccl-menu {
            position: absolute;
            top: 50%;
            left: 80%;
            display: none;
            flex-direction: column;
            gap: 2px;
            padding: 6px;
            background-color: hsla(0, 0%, 25%, 0.6);
            transition: opacity 0.2s ease;
            border-radius: 8px;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            cursor: default;
        }

        .ccl-menu.visible { display: flex; }

        .ccl-menu-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 12px;
            font-family: sans-serif;
            padding: 4px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
            pointer-events: auto;
        }

        .ccl-menu-item:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }

        .ccl-menu-item:active {
            color: rgba(255, 255, 255, 0.5);
            font-weight: bold;
        }

        .ccl-menu-item::before {
            content: '✓';
            visibility: hidden;
            color: white;
            font-weight: bold;
            width: 12px;
        }

        .ccl-menu-item.active::before {
            visibility: visible;
        }

        .ccl-stats-container {
            width: 100%;
            height: 100%;
            position: absolute;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            display: none;
            z-index: 999;
        }

        .ccl-stats-container.visible { display: flex; }

        .ccl-stats-container > table {
            padding: 4px;
            background-color: hsla(0, 0%, 25%, 0.6);
            border-radius: 6px;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }

        .ccl-stats-container th {
            padding-inline-end: 6px;
            text-align: end;
        }

        .ccl-stats-container th, .ccl-stats-container td {
            font-size: 12px;
            font-family: sans-serif;
            color: hsl(0, 0%, 95%);
        }
    `;

    class BaseControl {
        constructor(cls, onClick) {
            this.video = null;
            this.el = this.createButton(cls, onClick);
        }

        createButton(cls, onClick) {
            const btn = document.createElement('button');
            const picture = document.createElement('picture');
            picture.classList.add(cls);
            btn.appendChild(picture);
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            };
            return btn;
        }

        setVideo(v) { this.video = v; this.update(); }
        update() { }
    }

    class PipControl extends BaseControl {
        constructor() {
            super('ccl-icon-pip', () => {
                if (typeof this.video.webkitSetPresentationMode === 'function') {
                    const mode = this.video.webkitPresentationMode;
                    this.video.webkitSetPresentationMode(mode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
                } else {
                    if (document.pictureInPictureElement === this.video) document.exitPictureInPicture();
                    else this.video.requestPictureInPicture();
                }
            });
        }

        setVideo(v) {
            this.video = v;

            if (!this.isPipSupport(v)) this.el.style.display = 'none';
            else { this.el.style.display = 'flex'; this.update(); }
        }

        isPipSupport(video) {
            const isStandard = document.pictureInPictureEnabled && !video.disablePictureInPicture;
            const isSafari = typeof video.webkitSetPresentationMode === 'function';
            return isStandard || isSafari;
        }

        update() {
            this.el.querySelector('picture').setAttribute('data-active', document.pictureInPictureElement === this.video);
        }
    }

    class LoopControl extends BaseControl {
        constructor() {
            super('ccl-icon-loop', () => { this.video.loop = !this.video.loop; this.update(); });
            this.observer = null;
        }

        setVideo(v) {
            super.setVideo(v);

            if (this.observer) this.observer.disconnect();
            this.observer = new MutationObserver(() => this.update());
            this.observer.observe(v, { attributes: true, attributeFilter: ['loop'] });
        }

        update() {
            this.el.querySelector('picture').setAttribute('data-active', this.video.loop);
        }
    }

    class StatsControl extends BaseControl {
        constructor(onTogglePanel) {
            super('ccl-icon-stats', () => onTogglePanel());
        }
        update() { }
    }

    class RateControl extends BaseControl {
        constructor() {
            super('ccl-icon-rate', () => this.toggleMenu());
            this.menu = this.createMenu();
            this.el.appendChild(this.menu);
            this._handleDocumentClick = this.handleDocumentClick.bind(this);
        }

        createMenu() {
            const menu = document.createElement('div');
            menu.classList.add('ccl-menu');

            [0.5, 1, 1.25, 1.5, 2].forEach(r => {
                const item = document.createElement('div');
                item.classList.add('ccl-menu-item');
                item.textContent = r + '×';
                item.dataset.rate = r;
                item.onclick = (e) => {
                    e.stopPropagation();
                    if (this.video) this.video.playbackRate = r;
                    this.closeMenu();
                };
                menu.appendChild(item);
            })
            return menu;
        }

        toggleMenu() {
            const isVisible = this.menu.classList.contains('visible');
            isVisible ? this.closeMenu() : this.openMenu();
        }

        openMenu() {
            this.menu.classList.add('visible');
            this.update();
            document.addEventListener('click', this._handleDocumentClick, true);
        }

        closeMenu() {
            this.menu.classList.remove('visible');
            document.removeEventListener('click', this._handleDocumentClick, true);
        }

        handleDocumentClick(e) {
            if (this.el.contains(e.target)) return;
            this.closeMenu();
        }

        update() {
            if (!this.video) return;
            Array.from(this.menu.children).forEach(item => {
                const rate = parseFloat(item.textContent);
                item.classList.toggle('active', Math.abs(this.video.playbackRate - rate) < 0.01);
            });
        }
    }

    class UIManager {
        constructor() {
            this.target = null;
            this.container = this.createContainer();
            this.pipControl = new PipControl();
            this.loopControl = new LoopControl();
            this.statsCotrol = new StatsControl(() => this.updateStats());
            this.rateControl = new RateControl();
            this.controls = [this.pipControl, this.loopControl, this.statsCotrol, this.rateControl];
            this.init();
        }

        init() {
            const style = document.createElement('style');
            style.textContent = STYLE;
            document.head.appendChild(style);

            const bar = this.createControlsBar();
            const stats = this.createStatsContainer();
            this.container.append(bar, stats);

            document.body.appendChild(this.container);
        }

        createContainer() {
            const container = document.createElement('div');
            container.classList.add('ccl-controls-container');
            return container;
        }

        createControlsBar() {
            const bg = document.createElement('div');
            bg.classList.add('ccl-bg');

            const blur = document.createElement('div');
            blur.classList.add('blur');

            bg.appendChild(blur);

            const container = document.createElement('div');
            container.classList.add('ccl-btn-container');
            this.controls.forEach(c => container.appendChild(c.el));

            const bar = document.createElement('div');
            bar.classList.add('ccl-bar', 'hidden');
            bar.append(bg, container);

            return bar;
        }

        createStatsContainer() {
            const container = document.createElement('div');
            container.classList.add('ccl-stats-container');
            const table = document.createElement('table');
            container.append(table);
            return container;
        }

        updateStats() {
            const isVisible = this.container.querySelector('.ccl-stats-container').classList.toggle('visible');
            if (isVisible && this.target) {
                const getSourceType = () => {
                    const src = this.target.currentSrc;
                    if (src.startsWith('blob:')) return 'Media Source';
                    if (src.includes('m3u8')) return 'HLS';
                    return 'File';
                };

                const data = {
                    'Source': getSourceType(),
                    'Viewport': `${this.target.clientWidth}×${this.target.clientHeight} (${window.devicePixelRatio}x)`,
                    'Resolution': `${this.target.videoWidth}×${this.target.videoHeight}`
                };

                const table = this.container.querySelector('table');
                table.textContent = '';
                for (const [key, val] of Object.entries(data)) {
                    const row = document.createElement('tr');
                    const th = document.createElement('th');
                    th.textContent = key;
                    const td = document.createElement('td');
                    td.textContent = val;

                    row.append(th, td);
                    table.appendChild(row);
                }
            }
        }

        attach(video) {
            this.target = video;

            this.controls.forEach(c => c.setVideo(video));
            this.container.querySelector('.ccl-stats-container').classList.remove('visible');
        }

        detach() {
            this.target = null;
            this.hide();
            this.container.querySelector('.ccl-stats-container').classList.remove('visible');
        }

        reposition(rect) {
            if (!rect) return;
            Object.assign(this.container.style, {
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
            });
        }

        show() { this.container.querySelector('.ccl-bar').classList.replace('hidden', 'visible'); }
        hide() { this.container.querySelector('.ccl-bar').classList.replace('visible', 'hidden'); }
    }

    class App {
        constructor() {
            this.ui = new UIManager();
            this.activeVideo = null;
            this.videoRect = null;

            this.isPlayEventTriggered = false;
            this.isPaused = false

            this.hideTimeout = null;
            this.isThrottled = false;
            this.pollingId = null;
            this.layoutObserver = null;

            this.setupEvents();
            this.scan();
        }

        setupEvents() {
            const onPlay = (e) => {
                if (e.target instanceof HTMLVideoElement) this.activate(e.target);
                this.isPlayEventTriggered = true;
                this.isPaused = false;
                this.showAndTimer(0);
            };

            const onPause = () => {
                this.isPaused = true;
                this.showPersistent();
            };

            document.addEventListener('play', onPlay, true);
            document.addEventListener('pause', onPause, true);

            document.addEventListener('scroll', () => this.updateRectAndPosition(), { passive: true });
            window.addEventListener('resize', () => this.updateRectAndPosition(), { passive: true });

            document.addEventListener('enterpictureinpicture', () => this.ui.pipControl.update(), true);
            document.addEventListener('leavepictureinpicture', () => this.ui.pipControl.update(), true);
            document.addEventListener('webkitpresentationmodechanged', () => this.ui.pipControl.update(), true);

            window.addEventListener('pointermove', (e) => this.handleGlobalPointer(e), { passive: true });
        }

        showPersistent() {
            this.clearHideTimer();
            this.ui.show();
        }

        updateRectAndPosition() {
            if (!this.activeVideo) return;

            if (!this.activeVideo.isConnected) {
                this.detach();
                return;
            }

            this.videoRect = this.activeVideo.getBoundingClientRect();
            this.ui.reposition(this.videoRect);
        }

        activate(video) {
            if (!this.shouldSwitchVideo(video)) return;
            this.activeVideo = video;
            this.ui.attach(video);

            this.startPolling(500);

            this.observerCleanup();
            this.observeVideoLayout(video);
        }

        detach() {
            this.ui.detach();
            this.activeVideo = null;
            this.observerCleanup();
        }

        shouldSwitchVideo(newVideo) {
            const oldVideo = this.activeVideo;
            if (!oldVideo) return true;
            if (oldVideo === newVideo) return false;
            if (!oldVideo.isConnected) return true;

            const o = this.videoRect;
            const n = newVideo.getBoundingClientRect();

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dNew = Math.hypot(n.left + n.width / 2 - cx, n.top + n.height / 2 - cy);
            const dOld = Math.hypot(o.left + o.width / 2 - cx, o.top + o.height / 2 - cy);
            if (dNew < dOld) return true;

            if (!oldVideo.paused) {
                if (o.width * o.height > n.width * n.height) return false;
            }
            return true;
        }

        observeVideoLayout(video) {
            this.layoutObserver = new ResizeObserver(() => {
                if (!video.isConnected || video.style.display === 'none') {
                    this.ui.hide();
                    return;
                }

                if (this.activeVideo === video) {
                    this.updateRectAndPosition();
                }
            })
            this.layoutObserver.observe(video);
        }

        observerCleanup() {
            if (this.layoutObserver) {
                this.layoutObserver.disconnect();
                this.layoutObserver = null;
            }
        }

        scan() {
            const v = document.querySelector('video');
            if (v) this.activate(v);
        }

        handleGlobalPointer(e) {
            if (this.isThrottled) return;
            this.isThrottled = true;
            setTimeout(() => { this.isThrottled = false; }, 200);

            if (this.activeVideo && !this.activeVideo.isConnected) {
                this.detach();
                return;
            }
            if (!this.activeVideo || !this.videoRect || this.isPaused) return;

            const rect = this.videoRect;
            const isOverVideo = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            const isOverControls = this.ui.container.contains(e.target);
            if (isOverVideo || isOverControls) {
                this.isPlayEventTriggered = false;
                this.showAndTimer();
            } else {
                if (!this.isPlayEventTriggered) this.ui.hide();
            }
        }

        showAndTimer(timeout = 3000) {
            this.clearHideTimer();
            this.ui.show();

            this.hideTimeout = setTimeout(() => { this.ui.hide(); this.isPlayEventTriggered = false; }, timeout);
        }

        clearHideTimer() {
            if (!this.hideTimeout) return;
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        startPolling(duration) {
            this.stopPolling();
            const startTime = performance.now();

            const poll = (now) => {
                this.updateRectAndPosition();
                if (now - startTime < duration) {
                    this.pollingId = requestAnimationFrame(poll);
                }
            };
            this.pollingId = requestAnimationFrame(poll);
        }

        stopPolling() {
            if (!this.pollingId) return;
            cancelAnimationFrame(this.pollingId);
            this.pollingId = null;
        }
    }

    new App();
})();
