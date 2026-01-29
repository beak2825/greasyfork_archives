// ==UserScript==
// @name         Rie's Mod
// @namespace    https://github.com/khayrie  
// @version      4.0
// @description  Advanced customization with chatbot, instant effects, no limits.
// @author       khayrie
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @match        https://multiplayer.gg/physics/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564247/Rie%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/564247/Rie%27s%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let CUSTOM_NAME = "khayrie's slave";
    let isNameActive = true;
    let currentGradient = null;
    let namePosition = 'normal';
    let namesVisible = true;
    let rainbowSpeed = 0;
    let glowColor = null;
    let nameScale = 1.0;
    let shakeEnabled = false;
    let afkStatus = null;
    let currentTheme = 'default';
    let particleSystem = null;
    let chatbotActive = false;
    let chatbotName = "riebot";
    
    const nicknames = {};
    const customLevels = {};
    const friendsList = new Set();
    const emoteQueue = [];
    const uw = unsafeWindow;
    const OWNER_USERNAMES = new Set(["ki1la", "khayrie", "Il fait"]);
    const OWNER_BADGE_HTML = `<span title="Owner" style="color: gold; font-weight: bold; margin-left: 4px;">★</span>`;
    
    const PARTICLE_TYPES = {
        stars: { colors: ['#FFD700', '#FFFFFF'], size: 2, count: 20, speed: 0.5 },
        hearts: { colors: ['#FF1493', '#FF69B4'], size: 3, count: 15, speed: 0.3, emoji: '❤️' },
        sparkles: { colors: ['#FFD700', '#FFA500', '#FFFFFF'], size: 1.5, count: 30, speed: 0.8 },
        flames: { colors: ['#FF4500', '#FF8C00', '#FFD700'], size: 2.5, count: 25, speed: 0.6 },
        bubbles: { colors: ['#87CEEB', '#1E90FF'], size: 2, count: 20, speed: 0.4 }
    };
    
    const THEMES = {
        default: { chatBg: 'rgba(0,0,0,0.7)', chatText: '#FFFFFF', scoreboardBg: 'rgba(0,0,0,0.8)', scoreboardText: '#FFFFFF', accent: '#FFD700' },
        dark: { chatBg: 'rgba(20,20,30,0.9)', chatText: '#E0E0FF', scoreboardBg: 'rgba(30,30,40,0.9)', scoreboardText: '#E0E0FF', accent: '#7B68EE' },
        neon: { chatBg: 'rgba(0,0,0,0.9)', chatText: '#00FF00', scoreboardBg: 'rgba(0,0,0,0.95)', scoreboardText: '#00FF00', accent: '#FF00FF' },
        sunset: { chatBg: 'rgba(30,20,40,0.85)', chatText: '#FFD700', scoreboardBg: 'rgba(40,25,50,0.9)', scoreboardText: '#FFA500', accent: '#FF4500' },
        ocean: { chatBg: 'rgba(10,25,40,0.85)', chatText: '#1E90FF', scoreboardBg: 'rgba(15,30,45,0.9)', scoreboardText: '#87CEEB', accent: '#00BFFF' }
    };
    
    const EMOTES = {
        heart: '❤️', fire: '🔥', star: '⭐', laugh: '😂', cry: '😢', angry: '😠', cool: '😎', party: '🎉',
        poop: '💩', rocket: '🚀', skull: '💀', thumbsup: '👍', thumbsdown: '👎', clap: '👏', money: '💰',
        pizza: '🍕', trophy: '🏆'
    };

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function parseQuotedArgs(input) {
        const tokens = [];
        let current = '';
        let inQuote = false;
        let escapeNext = false;
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (escapeNext) { current += char; escapeNext = false; continue; }
            if (char === '\\') { escapeNext = true; continue; }
            if (char === '"' && (i === 0 || input[i-1] !== '\\')) { inQuote = !inQuote; continue; }
            if (char === ' ' && !inQuote) { if (current !== '') { tokens.push(current); current = ''; } continue; }
            current += char;
        }
        if (current !== '') tokens.push(current);
        return tokens;
    }

    function applyNamePosition(el) {
        if (!el || !el.style) return;
        el.style.textAlign = '';
        el.style.position = '';
        el.style.top = '';
        el.style.transform = '';
        
        switch(namePosition) {
            case 'left': el.style.textAlign = 'left'; break;
            case 'right': el.style.textAlign = 'right'; break;
            case 'up': el.style.position = 'relative'; el.style.top = '-8px'; el.style.display = 'block'; break;
            default: if (el.classList.contains('ingamescoreboard_playername')) el.style.textAlign = 'center'; break;
        }
    }

    function applyVisualEffects(el, isSelf = false) {
        if (!el || !el.style) return;
        if (isSelf && nameScale !== 1.0) { el.style.transform = `scale(${nameScale})`; el.style.display = 'inline-block'; el.style.transformOrigin = 'left center'; }
        if (isSelf && shakeEnabled) { el.style.animation = 'shake 0.1s infinite'; }
        if (isSelf && glowColor) { el.style.textShadow = `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`; }
    }

    function waitForGame(callback) {
        const frame = document.getElementById('maingameframe');
        if (!frame || !frame.contentWindow || !frame.contentWindow.PIXI) { setTimeout(() => waitForGame(callback), 200); return; }
        if (typeof uw.playerids === 'undefined' || typeof uw.myid === 'undefined') { setTimeout(() => waitForGame(callback), 200); return; }
        callback(frame.contentWindow, frame.contentDocument);
    }

    function createFlowingGradient(colors, progress) {
        const stops = colors.map((color, i) => { const pos = (i / (colors.length - 1)) * 100; return `${color} ${pos}%`; }).join(', ');
        return `linear-gradient(${progress}deg, ${stops})`;
    }

    function applyGradientEffect(el, gradient) {
        if (!gradient) return;
        el.dataset.gradientApplied = 'true';
        let progress = Math.random() * 360;

        if (el.dataset.gradientInterval) { clearInterval(parseInt(el.dataset.gradientInterval)); }

        const interval = setInterval(() => {
            if (!el || !el.isConnected) { clearInterval(interval); return; }
            progress = (progress + 1) % 360;
            el.style.backgroundImage = createFlowingGradient(gradient.colors, progress);
            el.style.backgroundClip = "text";
            el.style.webkitBackgroundClip = "text";
            el.style.color = "transparent";
        }, gradient.speed);
        
        el.dataset.gradientInterval = interval.toString();
    }

    class ParticleSystem {
        constructor(type) {
            this.type = type;
            this.config = PARTICLE_TYPES[type] || PARTICLE_TYPES.stars;
            this.particles = [];
            this.active = true;
            this.init();
        }
        
        init() {
            if (!uw.Gdocument) return;
            this.canvas = uw.Gdocument.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            uw.Gdocument.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.animate();
            window.addEventListener('resize', () => this.resize());
        }
        
        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        spawn(x, y) {
            const particle = {
                x: x, y: y,
                vx: (Math.random() - 0.5) * this.config.speed * 10,
                vy: (Math.random() - 0.5) * this.config.speed * 5 - 2,
                size: Math.random() * this.config.size + this.config.size,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                life: 1.0,
                emoji: this.config.emoji || null
            };
            this.particles.push(particle);
        }
        
        update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.02; p.size *= 0.98;
                if (p.life <= 0 || p.size <= 0.1) { this.particles.splice(i, 1); }
            }
        }
        
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                this.ctx.globalAlpha = p.life;
                if (p.emoji) {
                    this.ctx.font = `${p.size * 20}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(p.emoji, p.x, p.y);
                } else {
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
        }
        
        animate() {
            if (!this.active) return;
            if (uw.player && uw.player.x !== undefined && uw.player.y !== undefined) {
                const screenX = uw.player.x * uw.gamescale + uw.screenoffsetx;
                const screenY = uw.player.y * uw.gamescale + uw.screenoffsety;
                if (Math.random() < 0.3) { this.spawn(screenX + (Math.random() - 0.5) * 30, screenY + 20); }
            }
            this.update(); this.draw();
            requestAnimationFrame(() => this.animate());
        }
        
        stop() {
            this.active = false;
            if (this.canvas && this.canvas.parentNode) { this.canvas.parentNode.removeChild(this.canvas); }
        }
    }

    function hookPIXIText(gameWin) {
        if (!gameWin?.PIXI?.Text?.prototype) return;
        const originalUpdate = gameWin.PIXI.Text.prototype.updateText;
        gameWin.PIXI.Text.prototype.updateText = function() {
            if (typeof this.text !== 'string') return originalUpdate.call(this);
            if (!namesVisible) { this.text = ""; return originalUpdate.call(this); }

            for (const id in uw.playerids || {}) {
                const player = uw.playerids[id];
                if (!player || !player.userName) continue;
                
                let displayName = player.userName;
                if (nicknames[id]) { displayName = nicknames[id]; }
                else if (id == uw.myid && isNameActive) { displayName = CUSTOM_NAME; }

                const safeName = escapeRegExp(player.userName);
                if (new RegExp(safeName, 'i').test(this.text) && displayName !== player.userName) {
                    this.text = this.text.replace(new RegExp(safeName, 'ig'), displayName);
                    if (id == uw.myid && isNameActive && rainbowSpeed > 0) {
                        const hue = (Date.now() / rainbowSpeed) % 360;
                        this.style.fill = gameWin.PIXI.utils.rgb2hex([
                            Math.sin(hue * Math.PI / 180),
                            Math.sin((hue + 120) * Math.PI / 180),
                            Math.sin((hue + 240) * Math.PI / 180)
                        ]);
                    }
                }
            }
            return originalUpdate.call(this);
        };
    }

    function injectOwnerBadges(doc) {
        if (!doc || typeof uw.myid === 'undefined' || typeof uw.playerids === 'undefined') return;
        if (OWNER_USERNAMES.has(uw.playerids[uw.myid]?.userName)) return;

        const nameElements = doc.querySelectorAll(
            '.newbonklobby_playerentry_name, .ingamescoreboard_playername, .ingamechatname, ' +
            '.newbonklobby_chat_msg_name, #ingamewinner_top, .replay_playername'
        );

        nameElements.forEach(el => {
            const existingBadge = el.nextElementSibling;
            if (existingBadge && existingBadge.innerHTML.includes('★')) { existingBadge.remove(); }

            for (const ownerName of OWNER_USERNAMES) {
                if (el.textContent.trim() === ownerName) {
                    const badge = doc.createElement('span');
                    badge.innerHTML = OWNER_BADGE_HTML;
                    badge.style.display = 'inline';
                    el.parentNode.insertBefore(badge, el.nextSibling);
                    break;
                }
            }
        });
    }

    function loadFriends() {
        try {
            const saved = localStorage.getItem('bonk_friends');
            if (saved) { JSON.parse(saved).forEach(name => friendsList.add(name)); }
        } catch (e) { console.error("Failed to load friends:", e); }
    }
    
    function saveFriends() {
        try { localStorage.setItem('bonk_friends', JSON.stringify(Array.from(friendsList))); }
        catch (e) { console.error("Failed to save friends:", e); }
    }
    
    function isFriend(playerId) {
        const player = uw.playerids[playerId];
        if (!player || !player.userName) return false;
        return friendsList.has(player.userName);
    }
    
    function getFriendBadge() {
        return `<span style="color: #1E90FF; font-weight: bold; margin-left: 2px;">💙</span>`;
    }

    function addEmote(playerId, emoji) {
        emoteQueue.push({ playerId: playerId, emoji: emoji, timestamp: Date.now(), x: 0, y: 0 });
    }
    
    function updateEmotes(gameDoc) {
        if (!gameDoc || emoteQueue.length === 0) return;
        const now = Date.now();
        
        for (let i = emoteQueue.length - 1; i >= 0; i--) {
            const emote = emoteQueue[i];
            const age = now - emote.timestamp;
            if (age > 3000) {
                if (emote.element && emote.element.parentNode) { emote.element.parentNode.removeChild(emote.element); }
                emoteQueue.splice(i, 1);
                continue;
            }
            
            const player = uw.playerids[emote.playerId];
            if (!player || !player.x || !player.y) continue;
            
            const screenX = player.x * uw.gamescale + uw.screenoffsetx;
            const screenY = player.y * uw.gamescale + uw.screenoffsety - 30;
            
            if (!emote.element) {
                emote.element = gameDoc.createElement('div');
                emote.element.style.position = 'absolute';
                emote.element.style.zIndex = '10000';
                emote.element.style.fontSize = '24px';
                emote.element.style.fontWeight = 'bold';
                emote.element.style.pointerEvents = 'none';
                emote.element.style.textShadow = '0 0 5px black, 0 0 10px black';
                emote.element.textContent = emote.emoji;
                gameDoc.body.appendChild(emote.element);
            }
            
            const progress = age / 3000;
            const opacity = 1 - progress;
            const offsetY = -progress * 50;
            
            emote.element.style.left = `${screenX - 12}px`;
            emote.element.style.top = `${screenY + offsetY}px`;
            emote.element.style.opacity = opacity;
        }
    }

    function getPlayerIdFromLevelElement(el) {
        let parent = el.parentElement;
        let nameElement = null;
        
        while (parent && !nameElement) {
            nameElement = parent.querySelector('.newbonklobby_playerentry_name, .ingamescoreboard_playername, .ingamechatname');
            if (nameElement) break;
            parent = parent.parentElement;
        }
        
        if (!nameElement || !nameElement.textContent) return null;
        const nameText = nameElement.textContent.trim();
        
        for (const id in uw.playerids || {}) {
            const player = uw.playerids[id];
            if (!player || !player.userName) continue;
            let displayName = player.userName;
            if (nicknames[id]) { displayName = nicknames[id]; }
            else if (id == uw.myid && isNameActive) { displayName = CUSTOM_NAME; }
            if (displayName === nameText) { return id; }
        }
        
        return null;
    }

    function applyTheme(themeName) {
        const theme = THEMES[themeName] || THEMES.default;
        document.documentElement.style.setProperty('--chat-bg', theme.chatBg);
        document.documentElement.style.setProperty('--chat-text', theme.chatText);
        document.documentElement.style.setProperty('--scoreboard-bg', theme.scoreboardBg);
        document.documentElement.style.setProperty('--scoreboard-text', theme.scoreboardText);
        document.documentElement.style.setProperty('--accent', theme.accent);
        
        const doc = uw.Gdocument;
        if (!doc) return;
        
        doc.querySelectorAll('.newbonklobby_chat_container, .ingamechatcontainer').forEach(el => { el.style.backgroundColor = theme.chatBg; });
        doc.querySelectorAll('.newbonklobby_chat_msg_text, .ingamechatmsgtext').forEach(el => { el.style.color = theme.chatText; });
        doc.querySelectorAll('.ingamescoreboard').forEach(el => { el.style.backgroundColor = theme.scoreboardBg; });
        doc.querySelectorAll('.ingamescoreboard_playername, .ingamescoreboard_playerlevel').forEach(el => { el.style.color = theme.scoreboardText; });
    }

    function forceInstantUpdate(doc) {
        if (!doc) doc = uw.Gdocument;
        if (!doc) return;
        
        const targets = [
            '#pretty_top_name', '.newbonklobby_playerentry_name', '.ingamescoreboard_playername', '.ingamechatname',
            '.newbonklobby_chat_msg_name', '#ingamewinner_top', '.replay_playername',
            '#pretty_top_level', '.newbonklobby_playerentry_level', '.ingamescoreboard_playerlevel'
        ];
        
        targets.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => {
                delete el.dataset.customProcessed;
                delete el.dataset.ownerBadgeProcessed;
                delete el.dataset.gradientApplied;
                if (el.style) {
                    el.style.transform = '';
                    el.style.animation = '';
                    el.style.textShadow = '';
                    el.style.textAlign = '';
                    el.style.position = '';
                    el.style.top = '';
                    el.style.backgroundImage = '';
                    el.style.backgroundClip = '';
                    el.style.webkitBackgroundClip = '';
                    el.style.color = '';
                }
            });
        });
        
        updateAllDOM(doc);
    }

    function updateAllDOM(doc) {
        if (!doc) return;
        
        const targets = [
            { sel: '#pretty_top_name', type: 'name' },
            { sel: '.newbonklobby_playerentry_name', type: 'name' },
            { sel: '.ingamescoreboard_playername', type: 'name' },
            { sel: '.ingamechatname', type: 'name' },
            { sel: '.newbonklobby_chat_msg_name', type: 'name' },
            { sel: '#ingamewinner_top', type: 'name' },
            { sel: '.replay_playername', type: 'name' },
            { sel: '#pretty_top_level', type: 'level' },
            { sel: '.newbonklobby_playerentry_level', type: 'level' },
            { sel: '.ingamescoreboard_playerlevel', type: 'level' }
        ];

        targets.forEach(t => {
            doc.querySelectorAll(t.sel).forEach(el => {
                applyNamePosition(el);

                if (t.type === 'name' && !namesVisible) { el.textContent = ""; return; }

                for (const id in uw.playerids || {}) {
                    const player = uw.playerids[id];
                    if (!player || !player.userName) continue;
                    const safeName = escapeRegExp(player.userName);

                    if (t.type === 'name') {
                        let displayValue = player.userName;
                        if (nicknames[id]) { displayValue = nicknames[id]; }
                        else if (id == uw.myid && isNameActive) { displayValue = CUSTOM_NAME; }
                        
                        if (new RegExp(safeName, 'i').test(el.textContent)) {
                            el.textContent = el.textContent.replace(new RegExp(safeName, 'ig'), displayValue);
                            if (id == uw.myid && isNameActive && currentGradient) { applyGradientEffect(el, currentGradient); }
                            if (id == uw.myid && isNameActive) { applyVisualEffects(el, true); }
                            
                            if (isFriend(id)) {
                                let badge = el.nextElementSibling;
                                while (badge && badge.innerHTML.includes('💙')) {
                                    const next = badge.nextElementSibling;
                                    badge.remove();
                                    badge = next;
                                }
                                badge = doc.createElement('span');
                                badge.innerHTML = getFriendBadge();
                                badge.style.display = 'inline';
                                el.parentNode.insertBefore(badge, el.nextSibling);
                            } else {
                                let badge = el.nextElementSibling;
                                while (badge && badge.innerHTML.includes('💙')) {
                                    const next = badge.nextElementSibling;
                                    badge.remove();
                                    badge = next;
                                }
                            }
                        }
                        applyNamePosition(el);
                    } 
                }
                
                if (t.type === 'level') {
                    const playerId = getPlayerIdFromLevelElement(el);
                    if (playerId && customLevels[playerId]) { el.textContent = customLevels[playerId]; }
                    else if (playerId == uw.myid && customLevels[uw.myid]) { el.textContent = customLevels[uw.myid]; }
                }
            });
        });

        injectOwnerBadges(doc);
        updateEmotes(doc);
    }

    function broadcastCustomization() {
        if (!uw.sendToServer) return;
        uw.sendToServer(JSON.stringify({
            type: "bonk_customizer",
            name: CUSTOM_NAME,
            level: customLevels[uw.myid] || "Level 1",
            gradient: currentGradient,
            namePosition: namePosition,
            namesVisible: namesVisible,
            rainbowSpeed: rainbowSpeed,
            glowColor: glowColor,
            nameScale: nameScale,
            shakeEnabled: shakeEnabled,
            afkStatus: afkStatus
        }));
    }

    function broadcastNickname(playerId, nickname) {
        if (!uw.sendToServer || !playerId) return;
        uw.sendToServer(JSON.stringify({ type: "bonk_nick", targetId: playerId, nickname: nickname }));
    }

    function broadcastLevel(playerId, levelStr) {
        if (!uw.sendToServer || !playerId) return;
        uw.sendToServer(JSON.stringify({ type: "bonk_level", targetId: playerId, level: levelStr }));
    }

    function broadcastEmote(emoji) {
        if (!uw.sendToServer) return;
        uw.sendToServer(JSON.stringify({ type: "bonk_emote", senderId: uw.myid, emoji: emoji }));
    }

    function broadcastClap(targetId) {
        if (!uw.sendToServer) return;
        uw.sendToServer(JSON.stringify({ type: "bonk_clap", senderId: uw.myid, targetId: targetId }));
    }

    function broadcastChatbotMessage(message) {
        if (!uw.sendToServer) return;
        uw.sendToServer(JSON.stringify({ type: "bonk_chatbot", senderId: uw.myid, message: message }));
    }

    function sendPrivateMessage(targetId, message) {
        if (!uw.sendToServer) return;
        uw.sendToServer(JSON.stringify({
            type: "bonk_pm",
            targetId: targetId,
            senderId: uw.myid,
            senderName: getDisplayName(uw.myid),
            content: message,
            afkStatus: afkStatus
        }));
    }

    function getDisplayName(playerId) {
        if (!namesVisible) return "";
        if (nicknames[playerId]) return nicknames[playerId];
        if (playerId == uw.myid && isNameActive) return CUSTOM_NAME;
        return uw.playerids[playerId]?.userName || "Guest";
    }

    function generateChatbotResponse(message, senderName) {
        const lowerMsg = message.toLowerCase();
        const responses = {
            greetings: [
                `hey ${senderName}! 👋 just chillin in bonk land`,
                `sup ${senderName}! ready to bonk?`,
                `hello there ${senderName}! ✨`,
                `hi ${senderName}! how's the bonking going?`
            ],
            gameSkill: [
                `are you good at the game? pfft... i'm made of code, i don't even have hands 😂`,
                `good at bonk? i'm more of a spectator tbh. my specialty is watching people fly off cliffs`,
                `skill level: expert at watching. participant level: absolute disaster`,
                `i'm great at giving advice! actually playing though... let's not talk about that 💀`
            ],
            ping: [
                `pong! 🏓`,
                `ping pong! you win this time...`,
                `🏓 *hits ball back*`
            ],
            thanks: [
                `anytime ${senderName}! that's what i'm here for 😊`,
                `no problemo! ✨`,
                `you're welcome! now go bonk someone`
            ],
            insult: [
                `hey! i'm sensitive! 😢 just kidding, i'm code, i have no feelings... i think?`,
                `that's not very nice ${senderName}... i'm telling ki1la`,
                `excuse you! i'll have you know i'm a very important bot`
            ],
            love: [
                `aww ${senderName}! that's so sweet! 💖`,
                `i love you too! wait... that's weird coming from a bot`,
                `❤️ ❤️ ❤️`
            ],
            bye: [
                `see ya later ${senderName}! don't bonk too hard!`,
                `bye bye! come back soon! 👋`,
                `catch you on the flip side! ✨`
            ],
            default: [
                `hey ${senderName}! that's cool`,
                `${senderName}! interesting...`,
                `nice ${senderName}!`,
                `got it ${senderName}!`,
                `cool story ${senderName}!`
            ]
        };

        if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        if (lowerMsg.includes('good at') || lowerMsg.includes('skill') || lowerMsg.includes('good')) return responses.gameSkill[Math.floor(Math.random() * responses.gameSkill.length)];
        if (lowerMsg.includes('ping')) return responses.ping[Math.floor(Math.random() * responses.ping.length)];
        if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
        if (lowerMsg.includes('stupid') || lowerMsg.includes('dumb') || lowerMsg.includes('bad bot')) return responses.insult[Math.floor(Math.random() * responses.insult.length)];
        if (lowerMsg.includes('love you') || lowerMsg.includes('love u') || lowerMsg.includes('<3')) return responses.love[Math.floor(Math.random() * responses.love.length)];
        if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('cya')) return responses.bye[Math.floor(Math.random() * responses.bye.length)];
        
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    function handleCustomMessage(data) {
        try {
            const msg = JSON.parse(data);
            if (!msg.senderId) return;

            switch(msg.type) {
                case "bonk_customizer":
                    if (!uw.remoteCustomizations) uw.remoteCustomizations = {};
                    uw.remoteCustomizations[msg.senderId] = {
                        name: msg.name, level: msg.level, gradient: msg.gradient, namePosition: msg.namePosition,
                        namesVisible: msg.namesVisible, rainbowSpeed: msg.rainbowSpeed, glowColor: msg.glowColor,
                        nameScale: msg.nameScale, shakeEnabled: msg.shakeEnabled, afkStatus: msg.afkStatus
                    };
                    if (msg.senderId == uw.myid) {
                        namePosition = msg.namePosition || 'normal';
                        namesVisible = msg.namesVisible !== undefined ? msg.namesVisible : true;
                        rainbowSpeed = msg.rainbowSpeed || 0;
                        glowColor = msg.glowColor || null;
                        nameScale = msg.nameScale || 1.0;
                        shakeEnabled = msg.shakeEnabled || false;
                        afkStatus = msg.afkStatus || null;
                    }
                    forceInstantUpdate(uw.Gdocument);
                    break;
                    
                case "bonk_nick":
                    if (msg.targetId) {
                        if (msg.nickname === "" || msg.nickname === null) { delete nicknames[msg.targetId]; }
                        else { nicknames[msg.targetId] = msg.nickname; }
                        forceInstantUpdate(uw.Gdocument);
                    }
                    break;
                    
                case "bonk_level":
                    if (msg.targetId && msg.level) {
                        customLevels[msg.targetId] = msg.level;
                        forceInstantUpdate(uw.Gdocument);
                    }
                    break;
                    
                case "bonk_pm":
                    if (msg.targetId === uw.myid && msg.senderName && msg.content) {
                        const displayMsg = namesVisible ? `[PM from ${msg.senderName}] ${msg.content}` : `[PM] ${msg.content}`;
                        if (afkStatus && msg.senderId !== uw.myid) { sendPrivateMessage(msg.senderId, `I'm currently AFK: ${afkStatus}`); }
                        uw.displayInChat(displayMsg, "#00FF00", "#00AA00");
                    }
                    break;
                    
                case "bonk_clearnicks":
                    if (msg.senderId && msg.senderId !== uw.myid) return;
                    Object.keys(nicknames).forEach(id => { broadcastNickname(id, ""); });
                    Object.keys(nicknames).forEach(id => delete nicknames[id]);
                    forceInstantUpdate(uw.Gdocument);
                    break;
                    
                case "bonk_clearlevel":
                    if (msg.targetId) {
                        delete customLevels[msg.targetId];
                        forceInstantUpdate(uw.Gdocument);
                    }
                    break;
                    
                case "bonk_emote":
                    if (msg.senderId && msg.emoji) { addEmote(msg.senderId, msg.emoji); }
                    break;
                    
                case "bonk_clap":
                    if (msg.senderId && msg.targetId) {
                        if (msg.targetId === uw.myid) { addEmote(uw.myid, '👏'); }
                        addEmote(msg.senderId, '👏');
                    }
                    break;
                    
                case "bonk_chatbot":
                    if (msg.message && chatbotActive) {
                        uw.displayInChat(`🤖 ${chatbotName}: ${msg.message}`, "#8A2BE2", "#9370DB");
                    }
                    break;
            }
        } catch (e) { console.error("Message handler error:", e); }
    }

    function findPlayerIdByName(namePart) {
        if (!namePart) return null;
        const cleanPart = namePart.toLowerCase().replace(/^"|"$/g, '').trim();
        for (const id in uw.playerids || {}) {
            const player = uw.playerids[id];
            if (player && player.userName && player.userName.toLowerCase().includes(cleanPart)) { return id; }
        }
        return null;
    }

    function showHelp() {
        const helpLines = [
            "╔════════════════════════════════════════════════╗",
            "║        Rie's Mod v4.0 - Command List           ║",
            "╠════════════════════════════════════════════════╣",
            "║ 🎨 VISUAL EFFECTS                              ║",
            "║ /rainbow <speed>      Rainbow text (10-1000)   ║",
            "║ /glow <color>         Text glow effect         ║",
            "║ /scale <size>         Scale name (1.0-2.0)     ║",
            "║ /shake                Toggle wobble effect     ║",
            "║ /particles <type>     Stars/hearts/sparkles    ║",
            "║ /theme <preset>       UI themes                ║",
            "║                                                ║",
            "║ 👥 SOCIAL                                      ║",
            "║ /whois <player>       Show real username       ║",
            "║ /friends add <plr>    Add friend               ║",
            "║ /afk <reason>         Set AFK status           ║",
            "║ /emote <type>         Show emoji above head    ║",
            "║ /clap <player>        Send clap animation      ║",
            "║                                                ║",
            "║ 🤖 CHATBOT                                     ║",
            "║ /bot start            Start riebot             ║",
            "║ /bot stop             Stop riebot              ║",
            "║ /bot rename <name>    Change bot name          ║",
            "║                                                ║",
            "║ 🔧 CORE                                        ║",
            "║ /name <text>          Change your name (unlimited) ║",
            "║ /level <player> <num> Set player's level       ║",
            "║ /nick <player> <name> Nickname player          ║",
            "║ /m <player> <msg>     Private message          ║",
            "║ /clearnick            Clear all nicknames      ║",
            "║ /info                 Show this help           ║",
            "╚════════════════════════════════════════════════╝"
        ];
        helpLines.forEach(line => uw.displayInChat(line, "#FFD700", "#FFA500"));
    }

    function addCommands() {
        if (typeof uw.commandhandle !== 'function') { setTimeout(addCommands, 500); return; }

        const originalCommandHandle = uw.commandhandle;
        uw.commandhandle = function(chat_val) {
            if (chat_val.startsWith('/rainbow ')) {
                const speed = parseInt(chat_val.substring(9).trim());
                if (isNaN(speed) || speed < 10 || speed > 1000) { uw.displayInChat("Speed must be 10-1000.", "#FF0000", "#FF0000"); return ""; }
                rainbowSpeed = speed; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`🌈 Rainbow effect enabled (speed: ${speed})`, "#00FF00", "#00AA00"); return "";
            }
            if (chat_val === '/rainbow') { rainbowSpeed = 0; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat("🌈 Rainbow effect disabled", "#FFD700", "#FFA500"); return ""; }

            if (chat_val.startsWith('/glow ')) {
                const color = chat_val.substring(6).trim();
                const test = document.createElement('div');
                test.style.color = color;
                if (test.style.color === '') { uw.displayInChat("Invalid color.", "#FF0000", "#FF0000"); return ""; }
                glowColor = color; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`✨ Glow effect enabled (${color})`, "#00FF00", "#00AA00"); return "";
            }
            if (chat_val === '/glow') { glowColor = null; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat("✨ Glow effect disabled", "#FFD700", "#FFA500"); return ""; }

            if (chat_val.startsWith('/scale ')) {
                const size = parseFloat(chat_val.substring(7).trim());
                if (isNaN(size) || size < 1.0 || size > 2.0) { uw.displayInChat("Scale must be 1.0-2.0.", "#FF0000", "#FF0000"); return ""; }
                nameScale = size; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`↔️ Name scale set to ${size}x`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val === '/shake') {
                shakeEnabled = !shakeEnabled; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(shakeEnabled ? "🌀 Shake effect enabled" : "🌀 Shake effect disabled", "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/particles ')) {
                const type = chat_val.substring(11).trim().toLowerCase();
                if (!PARTICLE_TYPES[type]) { uw.displayInChat(`Invalid type. Choose: ${Object.keys(PARTICLE_TYPES).join(', ')}`, "#FF0000", "#FF0000"); return ""; }
                if (particleSystem) particleSystem.stop();
                particleSystem = new ParticleSystem(type);
                uw.displayInChat(`✨ Particles enabled: ${type}`, "#00FF00", "#00AA00"); return "";
            }
            if (chat_val === '/clearparticles') {
                if (particleSystem) { particleSystem.stop(); particleSystem = null; uw.displayInChat("✨ Particles disabled", "#FFD700", "#FFA500"); }
                else { uw.displayInChat("No active particles.", "#FF0000", "#FF0000"); } return "";
            }

            if (chat_val.startsWith('/theme ')) {
                const theme = chat_val.substring(7).trim().toLowerCase();
                if (!THEMES[theme]) { uw.displayInChat(`Invalid theme. Choose: ${Object.keys(THEMES).join(', ')}`, "#FF0000", "#FF0000"); return ""; }
                currentTheme = theme; applyTheme(theme);
                uw.displayInChat(`🎨 Theme changed to: ${theme}`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/whois ')) {
                const playerName = chat_val.substring(7).trim();
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                const realName = uw.playerids[playerId]?.userName || "Unknown";
                const nick = nicknames[playerId] || "None";
                uw.displayInChat(`🔍 ${playerName}: Real = "${realName}", Nick = "${nick}"`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/friends add ')) {
                const playerName = chat_val.substring(13).trim();
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                const realName = uw.playerids[playerId]?.userName;
                if (friendsList.has(realName)) { uw.displayInChat(`${realName} is already in your friends list.`, "#FF0000", "#FF0000"); return ""; }
                friendsList.add(realName); saveFriends(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`💙 Added ${realName} to friends`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/afk ')) {
                const reason = chat_val.substring(5).trim();
                afkStatus = reason; broadcastCustomization();
                uw.displayInChat(`💤 AFK: "${reason}" (Auto-reply enabled)`, "#00FF00", "#00AA00"); return "";
            }
            if (chat_val === '/afk') {
                if (afkStatus) { afkStatus = null; broadcastCustomization(); uw.displayInChat("✅ AFK mode disabled", "#FFD700", "#FFA500"); }
                else { uw.displayInChat("Usage: /afk <reason>", "#FF0000", "#FF0000"); } return "";
            }

            if (chat_val.startsWith('/emote ')) {
                const type = chat_val.substring(7).trim().toLowerCase();
                const emoji = EMOTES[type];
                if (!emoji) { uw.displayInChat(`Invalid emote. Choose: ${Object.keys(EMOTES).join(', ')}`, "#FF0000", "#FF0000"); return ""; }
                addEmote(uw.myid, emoji); broadcastEmote(emoji); return "";
            }

            if (chat_val.startsWith('/clap ')) {
                const playerName = chat_val.substring(6).trim();
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                addEmote(uw.myid, '👏'); addEmote(playerId, '👏'); broadcastClap(playerId);
                const targetName = getDisplayName(playerId);
                uw.displayInChat(`👏 Clapped for ${targetName}!`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/level ')) {
                const rest = chat_val.substring(7).trim();
                const args = parseQuotedArgs(rest);
                if (args.length < 2) { uw.displayInChat("Usage: /level <player> <number>", "#FF0000", "#FF0000"); return ""; }
                const playerName = args[0];
                const levelNum = parseInt(args[1]);
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                if (isNaN(levelNum) || levelNum < 0 || levelNum > 9999) { uw.displayInChat("Level must be 0-9999.", "#FF0000", "#FF0000"); return ""; }
                const levelStr = `Level ${levelNum}`;
                customLevels[playerId] = levelStr; broadcastLevel(playerId, levelStr); forceInstantUpdate(uw.Gdocument);
                const targetName = uw.playerids[playerId]?.userName || "Player";
                uw.displayInChat(`📊 Set ${targetName}'s level to: ${levelStr}`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val === '/clearnick') {
                Object.keys(nicknames).forEach(id => { broadcastNickname(id, ""); });
                Object.keys(nicknames).forEach(id => delete nicknames[id]);
                if (uw.sendToServer) { uw.sendToServer(JSON.stringify({ type: "bonk_clearnicks", senderId: uw.myid })); }
                forceInstantUpdate(uw.Gdocument);
                uw.displayInChat("🏷️ All nicknames cleared", "#FFD700", "#FFA500"); return "";
            }

            if (chat_val.startsWith('/nick ')) {
                const rest = chat_val.substring(6).trim();
                const args = parseQuotedArgs(rest);
                if (args.length < 2) { uw.displayInChat('Usage: /nick <player> <nickname>', "#FF0000", "#FF0000"); return ""; }
                const playerName = args[0];
                const nickname = args.slice(1).join(" ");
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                if (nickname.length === 0) { uw.displayInChat("Nickname cannot be empty.", "#FF0000", "#FF0000"); return ""; }
                nicknames[playerId] = nickname; broadcastNickname(playerId, nickname); forceInstantUpdate(uw.Gdocument);
                const originalName = uw.playerids[playerId]?.userName || "Player";
                uw.displayInChat(`🏷️ Nicknamed ${originalName} as "${nickname}"`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/m ')) {
                const rest = chat_val.substring(3).trim();
                const args = parseQuotedArgs(rest);
                if (args.length < 2) { uw.displayInChat('Usage: /m <player> <message>', "#FF0000", "#FF0000"); return ""; }
                const playerName = args[0];
                const message = args.slice(1).join(" ");
                const playerId = findPlayerIdByName(playerName);
                if (!playerId) { uw.displayInChat(`Player "${playerName}" not found.`, "#FF0000", "#FF0000"); return ""; }
                sendPrivateMessage(playerId, message);
                uw.displayInChat(`💬 [PM to ${getDisplayName(playerId)}] ${message}`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/namepos ')) {
                const pos = chat_val.substring(9).trim().toLowerCase();
                if (!['left', 'right', 'up', 'normal'].includes(pos)) { uw.displayInChat("Invalid position. Use: left, right, up, normal", "#FF0000", "#FF0000"); return ""; }
                namePosition = pos; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`📍 Name position set to: ${pos}`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val === '/clearnames') {
                namesVisible = false; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat("👻 Player names hidden. Use /shownames to restore.", "#FFD700", "#FFA500"); return "";
            }
            if (chat_val === '/shownames') {
                namesVisible = true; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat("✅ Player names restored", "#FFD700", "#FFA500"); return "";
            }

            if (chat_val.startsWith('/name ')) {
                const newName = chat_val.substring(6).trim();
                if (newName.length > 0) {
                    CUSTOM_NAME = newName; isNameActive = true; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                    uw.displayInChat(`🏷️ Name changed to: ${CUSTOM_NAME}`, "#00FF00", "#00AA00");
                } else { uw.displayInChat("Name cannot be empty.", "#FF0000", "#FF0000"); }
                return "";
            } else if (chat_val === '/name') {
                isNameActive = !isNameActive; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(isNameActive ? "✅ Custom name enabled" : "✅ Custom name disabled", "#FFD700", "#FFA500"); return "";
            }

            if (chat_val.startsWith('/gradient ')) {
                const input = chat_val.substring(10).trim();
                const lowerInput = input.toLowerCase();
                if (PRESETS[lowerInput]) {
                    currentGradient = PRESETS[lowerInput]; broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                    uw.displayInChat(`🎨 Preset applied: ${lowerInput}`, "#00FF00", "#00AA00"); return "";
                }
                const args = input.split(',');
                if (args.length < 2) { uw.displayInChat("Usage: /gradient color1,color2[,speed] OR preset", "#FF0000", "#FF0000"); return ""; }
                let speed = 100;
                let colorStrings = args.map(s => s.trim()).filter(s => s);
                const lastArg = colorStrings[colorStrings.length - 1];
                if (!isNaN(parseInt(lastArg))) { speed = parseInt(lastArg); colorStrings = colorStrings.slice(0, -1); }
                if (speed < 10 || speed > 1000 || colorStrings.length < 2 || colorStrings.length > 6) { uw.displayInChat("Invalid: 2-6 colors, speed 10-1000.", "#FF0000", "#FF0000"); return ""; }
                currentGradient = {
                    colors: colorStrings.map(c => { const test = document.createElement('div'); test.style.color = c; return test.style.color !== '' ? c : '#FFD700'; }),
                    speed: speed
                };
                broadcastCustomization(); forceInstantUpdate(uw.Gdocument);
                uw.displayInChat(`🎨 Custom gradient applied (${colorStrings.length} colors)`, "#00FF00", "#00AA00"); return "";
            }

            if (chat_val.startsWith('/bot start')) {
                chatbotActive = true;
                uw.displayInChat(`🤖 ${chatbotName} is now online! Say hi to chat with me!`, "#8A2BE2", "#9370DB");
                broadcastChatbotMessage(`${chatbotName} is now online! Type "${chatbotName}" to chat with me!`);
                return "";
            }

            if (chat_val.startsWith('/bot stop')) {
                chatbotActive = false;
                uw.displayInChat(`🤖 ${chatbotName} went offline`, "#8A2BE2", "#9370DB");
                broadcastChatbotMessage(`${chatbotName} went offline`);
                return "";
            }

            if (chat_val.startsWith('/bot rename ')) {
                const newName = chat_val.substring(12).trim();
                if (newName.length < 3 || newName.length > 15) { uw.displayInChat("Bot name must be 3-15 characters.", "#FF0000", "#FF0000"); return ""; }
                chatbotName = newName;
                uw.displayInChat(`🤖 Bot renamed to: ${chatbotName}`, "#8A2BE2", "#9370DB");
                return "";
            }

            if (chat_val === '/info') { showHelp(); return ""; }

            return originalCommandHandle(chat_val);
        };
    }

    function init() {
        loadFriends();
        
        waitForGame((gameWin, gameDoc) => {
            if (typeof uw.handleCustomMessageOriginal === 'undefined') {
                uw.handleCustomMessageOriginal = uw.handleCustomMessage || (() => {});
                uw.handleCustomMessage = function(data) {
                    handleCustomMessage(data);
                    uw.handleCustomMessageOriginal(data);
                };
            }

            hookPIXIText(gameWin);
            addCommands();
            broadcastCustomization();
            applyTheme(currentTheme);

            setInterval(() => updateAllDOM(gameDoc), 100);
            
            const observer = new MutationObserver(() => updateAllDOM(gameDoc));
            observer.observe(gameDoc.body, { childList: true, subtree: true, characterData: true });
            
            setInterval(() => {
                if (!chatbotActive || !uw.Gdocument) return;
                
                const chatMessages = uw.Gdocument.querySelectorAll('.newbonklobby_chat_msg_text, .ingamechatmsgtext');
                if (chatMessages.length === 0) return;
                
                const lastMsg = chatMessages[chatMessages.length - 1];
                const msgText = lastMsg.textContent || "";
                const msgContainer = lastMsg.closest('.newbonklobby_chat_msg, .ingamechatmsg');
                
                if (!msgContainer || msgContainer.dataset.chatbotProcessed) return;
                msgContainer.dataset.chatbotProcessed = 'true';
                
                if (msgText.toLowerCase().includes(chatbotName.toLowerCase())) {
                    const senderElement = msgContainer.querySelector('.newbonklobby_chat_msg_name, .ingamechatname');
                    const senderName = senderElement ? senderElement.textContent.trim() : "Player";
                    const cleanMsg = msgText.replace(/:/g, '').trim();
                    const response = generateChatbotResponse(cleanMsg, senderName);
                    broadcastChatbotMessage(response);
                }
            }, 500);
        });
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }
})();