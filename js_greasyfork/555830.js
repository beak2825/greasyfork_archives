// ==UserScript==
// @name         Danbooru Gacha: Ultimate Edition
// @namespace    https://greasyfork.org/en/users/your-username
// @version      2.1
// @description  Adds a premium "gacha" minigame to Danbooru to discover random posts in a fun way.
// @author       Gemini & You
// @match        https://danbooru.donmai.us/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555830/Danbooru%20Gacha%3A%20Ultimate%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/555830/Danbooru%20Gacha%3A%20Ultimate%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION (Rarity Colors as Gradients) ---
    const RARITY_CONFIG = {
        UR:  { name: '🌟🌟🌟🌟UR',  style: 'background: linear-gradient(135deg, #ff00cc, #3333ff); color: #fff; text-shadow: 0 0 5px #ff00cc;', border: 'linear-gradient(135deg, #ff00cc, #3333ff)' },
        SSR: { name: '🌟🌟🌟🌟SSR', style: 'background: linear-gradient(135deg, #ffcc00, #ff6600); color: #fff; text-shadow: 0 0 5px #ffcc00;', border: 'linear-gradient(135deg, #ffcc00, #ff6600)' },
        SR:  { name: '🌟🌟🌟SR',  style: 'background: linear-gradient(135deg, #9933ff, #cc66ff); color: #fff; text-shadow: 0 0 5px #9933ff;', border: 'linear-gradient(135deg, #9933ff, #cc66ff)' },
        R:   { name: '🌟🌟R',   style: 'background: linear-gradient(135deg, #00ccff, #0066ff); color: #fff; text-shadow: 0 0 5px #00ccff;', border: 'linear-gradient(135deg, #00ccff, #0066ff)' },
        N:   { name: '🌟N',    style: 'background: linear-gradient(135deg, #b0b0b0, #808080); color: #fff;', border: 'linear-gradient(135deg, #b0b0b0, #808080)' }
    };

    // --- STYLES ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');

        :root {
            --gacha-bg: #1a1b26;
            --gacha-panel: #24283b;
            --gacha-accent: #7aa2f7;
            --gacha-text: #c0caf5;
        }

        /* --- Floating Summon Button (Gem style) --- */
        .gacha-float {
            position: fixed;
            width: 70px;
            height: 70px;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #3d5afe, #7aa2f7);
            color: #FFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 0 0 0 rgba(61, 90, 254, 0.7);
            animation: gacha-pulse 2s infinite;
            transition: transform 0.2s;
            border: 2px solid rgba(255,255,255,0.3);
            user-select: none;
        }

        .gacha-float::after {
            content: '💎';
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
        }

        .gacha-float:hover {
            transform: scale(1.1) rotate(10deg);
            background: linear-gradient(135deg, #536dfe, #8cb1ff);
        }

        @keyframes gacha-pulse {
            0% { box-shadow: 0 0 0 0 rgba(61, 90, 254, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(61, 90, 254, 0); }
            100% { box-shadow: 0 0 0 0 rgba(61, 90, 254, 0); }
        }

        /* --- Modal Overlay (Glassmorphism) --- */
        .gacha-modal {
            display: none;
            position: fixed;
            z-index: 10001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: rgba(10, 10, 15, 0.85);
            backdrop-filter: blur(8px); /* Blurs the site behind */
            align-items: center;
            justify-content: center;
            font-family: 'Rajdhani', sans-serif, system-ui;
        }

        /* --- Modal Content --- */
        .gacha-modal-content {
            background: linear-gradient(160deg, var(--gacha-panel) 0%, var(--gacha-bg) 100%);
            padding: 25px;
            border: 1px solid rgba(122, 162, 247, 0.3);
            width: 90%;
            max-width: 1200px;
            max-height: 95vh;
            overflow-y: auto;
            border-radius: 20px;
            color: var(--gacha-text);
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1);
            text-align: center;
            position: relative;
            animation: gacha-modal-entry 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy entry */
        }

        @keyframes gacha-modal-entry {
            from { opacity: 0; transform: scale(0.8) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .gacha-modal h2 {
            margin-top: 0;
            font-size: 2.5em;
            text-transform: uppercase;
            letter-spacing: 2px;
            background: linear-gradient(to right, #fff, #7aa2f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 10px rgba(122, 162, 247, 0.3);
        }

        /* Close Button */
        .gacha-close {
            position: absolute;
            right: 20px;
            top: 15px;
            color: #666;
            font-size: 30px;
            line-height: 1;
            transition: color 0.2s, transform 0.2s;
            cursor: pointer;
            z-index: 10;
        }

        .gacha-close:hover {
            color: #fff;
            transform: rotate(90deg);
        }

        /* --- Gacha Stage / Result Area --- */
        #gacha-result {
            min-height: 450px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
            /* Subtle hex pattern background */
            background-color: #13141f;
            background-image: radial-gradient(#24283b 1px, transparent 1px);
            background-size: 20px 20px;
            border-radius: 15px;
            padding: 20px;
            flex-wrap: wrap;
            position: relative;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
            perspective: 1500px; /* Required for 3D hover */
            /* overflow: hidden; */
        }

        /* --- DYNAMIC SUMMONING ANIMATION --- */
        .summoning-stage {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            pointer-events: none;
            z-index: 50;
        }

        /* The magical circle */
        .magic-circle {
            width: 200px; height: 200px;
            border-radius: 50%;
            border: 4px dotted #7aa2f7;
            box-shadow: 0 0 20px #3d5afe, inset 0 0 20px #3d5afe;
            animation: circle-spin 6s linear infinite;
            position: relative;
            display: flex; align-items: center; justify-content: center;
        }
        .magic-circle::before {
            content: ''; position: absolute;
            width: 140px; height: 140px; border: 2px solid #fff;
            border-radius: 30%; transform: rotate(45deg);
            animation: circle-pulse 1.5s ease-in-out infinite alternate;
        }
        .magic-circle::after {
            content: ''; position: absolute;
            width: 140px; height: 140px; border: 2px solid #fff;
            border-radius: 30%;
            animation: circle-pulse 1.5s ease-in-out infinite alternate-reverse;
        }

        @keyframes circle-spin { 100% { transform: rotate(360deg); } }
        @keyframes circle-pulse {
            0% { transform: rotate(45deg) scale(0.8); opacity: 0.5; box-shadow: 0 0 5px #fff; }
            100% { transform: rotate(45deg) scale(1.1); opacity: 1; box-shadow: 0 0 20px #fff; }
        }

        /* The Flash effect */
        .summon-flash {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
        }
        .flash-active { animation: flash-anim 0.8s ease-out forwards; }

        @keyframes flash-anim {
            0% { opacity: 0; }
            10% { opacity: 1; }
            100% { opacity: 0; }
        }

        /* --- CARD STYLES (Keeping structure for JS hover) --- */

        /* Shared entry animation */
        @keyframes gacha-card-reveal {
            from { transform: translateY(50px) scale(0.9); opacity: 0; filter: brightness(5); }
            to { transform: translateY(0) scale(1) translateZ(0); opacity: 1; filter: brightness(1); }
        }

        /* Wrapper to handle the gradient border */
        .gacha-card-wrapper {
            position: relative;
            border-radius: 12px;
            padding: 3px; /* Thickness of the gradient border */
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform-style: preserve-3d;
            transform: translateZ(0);
            animation: gacha-card-reveal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            opacity: 0; /* Hidden until animation starts */
            transition: transform 300ms ease-out, box-shadow 300ms ease-out;
        }

        /* The actual card content */
        .gacha-card {
            background-color: #1a1b26;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .gacha-card-wrapper:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        .gacha-rarity-header {
            padding: 8px;
            font-weight: 700;
            font-size: 1.4em;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Image Placeholder / Container */
        .gacha-image-container {
            position: relative;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .gacha-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }

        /* Placeholder skeleton shimmer */
        .gacha-skeleton {
            width: 100%; height: 100%;
            background: #24283b;
            background-image: linear-gradient(to right, #24283b 0%, #2f354b 20%, #24283b 40%, #24283b 100%);
            background-repeat: no-repeat;
            background-size: 800px 100%;
            animation: gacha-shimmer 1.5s infinite linear;
        }
        @keyframes gacha-shimmer { 0% { background-position: -800px 0; } 100% { background-position: 800px 0; } }

        .gacha-info {
            padding: 15px;
            background-color: #1f2335;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gacha-info span { font-weight: bold; color: #fff; }
        .gacha-btn-link {
            background: rgba(255,255,255,0.1);
            padding: 5px 10px; border-radius: 4px;
            color: var(--gacha-accent); text-decoration: none;
            font-size: 0.9em; transition: all 0.2s;
        }
        .gacha-btn-link:hover { background: var(--gacha-accent); color: #fff; }

        /* --- Multi-Summon Grid --- */
        .gacha-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            width: 100%;
            padding: 10px;
            perspective: 1500px;
        }

        .gacha-grid-item-wrapper {
            position: relative;
            border-radius: 10px;
            padding: 2px; /* Thinner border for grid */
            transform-style: preserve-3d;
            transform: translateZ(0);
            animation: gacha-card-reveal 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            opacity: 0;
            transition: transform 300ms ease-out, box-shadow 300ms ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }

        .gacha-grid-item {
            background-color: #1a1b26;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            height: 100%;
            display: flex; flex-direction: column;
        }

        .gacha-grid-item-wrapper:hover { z-index: 10; box-shadow: 0 15px 30px rgba(0,0,0,0.6); }

        .gacha-grid-item .gacha-rarity-header { font-size: 1em; padding: 4px; }
        .gacha-grid-item img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; transition: opacity 0.3s; }
        .gacha-grid-item a:hover img { opacity: 0.8; }

        /* --- The GLOW (from original script) --- */
        .gacha-card-wrapper .glow, .gacha-grid-item-wrapper .glow {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: inherit;
            background-image: radial-gradient(circle at 50% -20%, #ffffff22, #0000000f);
            pointer-events: none;
        }

        /* --- Control Panel --- */
        .gacha-controls { margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
        #gacha-tags-info { color: #7aa2f7; font-family: monospace; background: rgba(0,0,0,0.2); display: inline-block; padding: 2px 8px; border-radius: 4px; margin-bottom: 15px;}

        .gacha-button-container { display: flex; justify-content: center; gap: 20px; }

        /* Stylish Buttons */
        .gacha-summon-button {
            position: relative;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-size: 18px; font-weight: 700; font-family: 'Rajdhani', sans-serif;
            text-transform: uppercase; letter-spacing: 1px;
            overflow: hidden; transition: all 0.2s;
            box-shadow: 0 4px #00000044, 0 0 10px rgba(0,0,0,0.2);
            top: 0;
        }

        .gacha-summon-button::before {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.4s;
        }
        .gacha-summon-button:hover::before { left: 100%; }

        .gacha-summon-button:active:not(:disabled) { top: 4px; box-shadow: 0 0px #00000044; }

        #gacha-summon-button { background: linear-gradient(to bottom, #4ade80, #16a34a); text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        #gacha-summon-multi-button { background: linear-gradient(to bottom, #60a5fa, #2563eb); text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

        .gacha-summon-button:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 6px #00000044, 0 0 15px rgba(255,255,255,0.3); }

        .gacha-summon-button:disabled {
            background: #333 !important; color: #777;
            box-shadow: none; cursor: not-allowed; top: 0; transform: none;
        }

        /* Scrollbar styling for modal */
        .gacha-modal-content::-webkit-scrollbar { width: 8px; }
        .gacha-modal-content::-webkit-scrollbar-track { background: #1a1b26; }
        .gacha-modal-content::-webkit-scrollbar-thumb { background-color: #3d5afe; border-radius: 10px; }
    `);

    // --- HTML SETUP ---
    const floatingButton = document.createElement('div');
    floatingButton.className = 'gacha-float';
    floatingButton.title = "Open Gacha";
    document.body.appendChild(floatingButton);

    const modal = document.createElement('div');
    modal.className = 'gacha-modal';
    modal.innerHTML = `
        <div class="gacha-modal-content">
            <span class="gacha-close">&times;</span>
            <h2>Danbooru Gacha</h2>
            <div class="gacha-controls">
                <p id="gacha-tags-info">Tags: None</p>
                <div class="gacha-button-container">
                    <button id="gacha-summon-button" class="gacha-summon-button">Summon x1</button>
                    <button id="gacha-summon-multi-button" class="gacha-summon-button">Summon x10</button>
                </div>
            </div>
            <div id="gacha-result">
                <div id="gacha-flash-overlay" class="summon-flash"></div>
                <div id="gacha-placeholder-text" style="font-size: 1.2em; color: #7aa2f7; opacity: 0.7;">
                    Press a button to initiate summoning sequence.
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // --- LOGIC ---
    const closeButton = modal.querySelector('.gacha-close');
    const summonButton = document.getElementById('gacha-summon-button');
    const summonMultiButton = document.getElementById('gacha-summon-multi-button');
    const resultContainer = document.getElementById('gacha-result');
    const flashOverlay = document.getElementById('gacha-flash-overlay');
    const tagsInfo = document.getElementById('gacha-tags-info');

    let isSummoning = false;

    const openModal = () => {
        document.body.style.overflow = 'hidden';
        const currentTags = document.getElementById('tags')?.value?.trim() || '';
        tagsInfo.textContent = currentTags ? `Tags: ${currentTags}` : 'Tags: None (All Posts)';
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        if (isSummoning) return;
        document.body.style.overflow = '';
        modal.style.display = 'none';
    };

    const getRarityParams = (score) => {
        if (score >= 200) return RARITY_CONFIG.UR;
        if (score >= 80)  return RARITY_CONFIG.SSR;
        if (score >= 30)  return RARITY_CONFIG.SR;
        if (score >= 10)  return RARITY_CONFIG.R;
        return RARITY_CONFIG.N;
    };

    const setUIState = (summoning) => {
        isSummoning = summoning;
        summonButton.disabled = summoning;
        summonMultiButton.disabled = summoning;
        closeButton.style.opacity = summoning ? '0.3' : '1';
        closeButton.style.pointerEvents = summoning ? 'none' : 'auto';
    };

    const fetchRandomPost = (tags = '') => {
        return new Promise((resolve, reject) => {
            let url = '/posts/random.json';
            const trimmedTags = tags.trim();
            if (trimmedTags) url += `?tags=${encodeURIComponent(trimmedTags)}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const post = JSON.parse(response.responseText);
                            if (post && post.id && (post.file_url || post.preview_file_url)) {
                                resolve(post);
                            } else {
                                resolve(fetchRandomPost(tags));
                            }
                        } catch (e) { reject('Parsing error.'); }
                    } else { reject(`Error: ${response.status}`); }
                },
                onerror: () => reject('Network error.')
            });
        });
    };

    const showSummoningAnimation = () => {
        Array.from(resultContainer.children).forEach(child => {
            if (child.id !== 'gacha-flash-overlay') child.remove();
        });
        const stage = document.createElement('div');
        stage.className = 'summoning-stage';
        stage.innerHTML = '<div class="magic-circle"></div>';
        resultContainer.appendChild(stage);
        return stage;
    };

    const triggerReveal = (contentNode, summoningStage) => {
        return new Promise(resolve => {
            flashOverlay.classList.add('flash-active');
            setTimeout(() => {
                if (summoningStage) summoningStage.remove();
                resultContainer.appendChild(contentNode);
                addHoverEffects(resultContainer); // Apply hover to the whole result area
                setTimeout(() => {
                    flashOverlay.classList.remove('flash-active');
                    resolve();
                }, 700);
            }, 150);
        });
    };

    const performSingleSummon = async () => {
        if (isSummoning) return;
        setUIState(true);
        const tags = document.getElementById('tags')?.value || '';
        const stage = showSummoningAnimation();
        const minTimePromise = new Promise(r => setTimeout(r, 1500));
        const fetchPromise = fetchRandomPost(tags).catch(e => ({ error: e }));
        const [_, postData] = await Promise.all([minTimePromise, fetchPromise]);

        if (postData.error) {
            resultContainer.innerHTML = `<p style="color: #ff5555; font-size: 1.2em;">Summon Failed: ${postData.error}</p>`;
            setUIState(false);
            return;
        }

        const post = postData;
        const rarity = getRarityParams(post.score);
        const fixedHeightVh = 50;
        const cleanH = post.image_height || 1000;
        const cleanW = post.image_width || 1000;
        const aspectRatio = cleanW / cleanH;
        const fixedHeightPx = window.innerHeight * (fixedHeightVh / 100);
        const calculatedWidth = fixedHeightPx * aspectRatio;

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'gacha-card-wrapper js-tilt';
        cardWrapper.style.background = rarity.border;
        cardWrapper.innerHTML = `
            <div class="gacha-card">
                <div class="glow"></div>
                <div class="gacha-rarity-header" style="${rarity.style}">${rarity.name}</div>
                <div class="gacha-image-container" style="height: ${fixedHeightVh}vh; width: ${calculatedWidth}px; max-width: 100%;">
                    <div class="gacha-skeleton" id="gacha-skel-${post.id}"></div>
                    <a href="/posts/${post.id}" target="_blank" style="display:none;" id="gacha-link-${post.id}">
                        <img class="gacha-image" alt="Loading..." id="gacha-img-${post.id}">
                    </a>
                </div>
                <div class="gacha-info">
                    <span>Score: ${post.score}</span>
                    <a href="/posts/${post.id}" target="_blank" class="gacha-btn-link">View Post ↗</a>
                </div>
            </div>`;

        const img = new Image();
        img.src = post.large_file_url || post.file_url;
        img.onload = () => {
            const skel = cardWrapper.querySelector(`#gacha-skel-${post.id}`);
            const link = cardWrapper.querySelector(`#gacha-link-${post.id}`);
            const htmlImg = cardWrapper.querySelector(`#gacha-img-${post.id}`);
            if (skel && link && htmlImg) {
                htmlImg.src = img.src;
                skel.style.display = 'none';
                link.style.display = 'block';
                htmlImg.animate([{opacity:0}, {opacity:1}], {duration: 300, fill: 'forwards'});
            }
        };

        await triggerReveal(cardWrapper, stage);
        setUIState(false);
    };

    const performMultiSummon = async () => {
        if (isSummoning) return;
        setUIState(true);
        const tags = document.getElementById('tags')?.value || '';
        const stage = showSummoningAnimation();
        const minTimePromise = new Promise(r => setTimeout(r, 2000));
        const promises = Array(10).fill(null).map(() => fetchRandomPost(tags).catch(() => null));
        const [_, results] = await Promise.all([minTimePromise, Promise.all(promises)]);
        const validPosts = results.filter(p => p !== null);

        if (validPosts.length === 0) {
            resultContainer.innerHTML = `<p style="color: #ff5555;">Failed to summon any posts.</p>`;
            setUIState(false);
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'gacha-grid-container';
        validPosts.forEach((post, index) => {
            const rarity = getRarityParams(post.score);
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'gacha-grid-item-wrapper js-tilt';
            itemWrapper.style.background = rarity.border;
            itemWrapper.style.animationDelay = `${index * 0.08}s`;
            const imgUrl = post.preview_file_url || post.file_url;
            itemWrapper.innerHTML = `
                <div class="gacha-grid-item">
                    <div class="glow"></div>
                    <div class="gacha-rarity-header" style="${rarity.style}">${rarity.name}</div>
                    <a href="/posts/${post.id}" target="_blank" style="flex-grow: 1; background:#000; display:flex;">
                         <img src="${imgUrl}" alt="${post.id}" loading="lazy">
                    </a>
                </div>`;
            grid.appendChild(itemWrapper);
        });

        await triggerReveal(grid, stage);
        setUIState(false);
    };

    // --- 3D HOVER EFFECT LOGIC (RESTORED FROM ORIGINAL SCRIPT) ---
    function addHoverEffects(container) {
        const cards = container.querySelectorAll('.js-tilt');
        cards.forEach(card => {
            card.addEventListener('animationend', (e) => {
                if (e.animationName === 'gacha-card-reveal') {
                    card.style.animation = 'none';
                    card.style.opacity = '1';
                }
            }, { once: true });

            let bounds;

            function rotateToMouse(e) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftX = mouseX - bounds.x;
                const topY = mouseY - bounds.y;
                const center = {
                    x: leftX - bounds.width / 2,
                    y: topY - bounds.height / 2
                };
                // Re-calculate distance from center for the original log-based rotation effect.
                const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

                // Restore the original transform logic for the requested hover effect.
                card.style.transform = `
                    scale3d(1.07, 1.07, 1.07)
                    rotate3d(
                        ${-center.y / 100},
                        ${center.x / 100},
                        0,
                        ${Math.log(distance) * 2}deg
                    )`;

                const glow = card.querySelector('.glow');
                if (glow) {
                    // Restore the original glow effect logic.
                    glow.style.backgroundImage = `
                        radial-gradient(
                            circle at
                            ${center.x * 2 + bounds.width / 2}px
                            ${center.y * 2 + bounds.height / 2}px,
                            #ffffff55,
                            #0000000f
                        )`;
                }
            }

            card.addEventListener('mouseenter', () => {
                bounds = card.getBoundingClientRect();
                document.addEventListener('mousemove', rotateToMouse);
            });

            card.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', rotateToMouse);
                card.style.transform = ''; // Reset transform
                const glow = card.querySelector('.glow');
                if (glow) {
                    glow.style.backgroundImage = ''; // Reset glow
                }
            });
        });
    }

    // --- EVENTS ---
    floatingButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    summonButton.addEventListener('click', performSingleSummon);
    summonMultiButton.addEventListener('click', performMultiSummon);

    modal.addEventListener('mousedown', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

})();