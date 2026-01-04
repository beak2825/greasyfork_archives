// ==UserScript==
// @name         ChatBulle
// @namespace    InGame
// @version      1.3.4
// @author       JD Asalia & Laïn
// @description  Affiche une bulle de tchat au-dessus des personnages
// @match        *://www.dreadcast.net/Main*
// @match        *://www.dreadcast.eu/Main*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554530/ChatBulle.user.js
// @updateURL https://update.greasyfork.org/scripts/554530/ChatBulle.meta.js
// ==/UserScript==

$('<style>').text(`
    .chatbulle-highlight {
        outline: 2px solid rgba(0, 207, 255, 0.8);
        outline-offset: 2px;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0, 207, 255, 0.8);
        transition: box-shadow 0.3s ease-in-out;
    }

    .chat_bubble {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        font-size: 12px;
        line-height: 14px;
        max-width: 180px;
        min-width: 60px;
        color: #00cfff;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        pointer-events: none;
        padding: 6px 10px;
        opacity: 0;
        z-index: 150000;
        transition: left 0.1s ease-out, top 0.1s ease-out;
        transform: translate(-50%, -100%);
    }

    #chatbubble-config-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 200000;
        display: none;
        justify-content: center;
        align-items: center;
    }

    #chatbubble-config-panel {
        background-color: #1a1a1a;
        border: 2px solid #00cfff;
        border-radius: 8px;
        padding: 20px;
        width: 400px;
        max-width: 90%;
        color: #00cfff;
        box-shadow: 0 0 20px rgba(0, 207, 255, 0.5);
    }

    #chatbubble-config-panel h2 {
        margin-top: 0;
        text-align: center;
        color: #00cfff;
        font-size: 18px;
        border-bottom: 1px solid #00cfff;
        padding-bottom: 10px;
    }

    .config-option {
        margin: 20px 0;
    }

    .config-option label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #00cfff;
    }

    .config-option input[type="range"] {
        width: 100%;
        margin: 10px 0;
    }

    .config-option .value-display {
        display: inline-block;
        margin-left: 10px;
        color: #ffffff;
        font-weight: bold;
    }

    .config-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        gap: 10px;
    }

    .config-buttons button {
        flex: 1;
        padding: 10px;
        border: 1px solid #00cfff;
        background-color: #0a3a4a;
        color: #00cfff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .config-buttons button:hover {
        background-color: #00cfff;
        color: #000000;
    }
    .whisper-sender {
    color: #707070 !important; /* gris foncé */
}
.shout-sender {
    color: #ff5555 !important;
}
    .bubble-preview {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 6px 10px;
        text-align: center;
        margin: 15px auto;
        max-width: 180px;
        color: #00cfff;
    }
    `).appendTo('head');

const CHAT_CONTAINER_SELECTOR = '#chatContent';
const CHARACTERS_SELECTOR = '.personnages';
const CROSS_SELECTOR = '#croix_position';
const MSG_SELECTOR = '.msg';
const PSEUDO_SELECTOR = 'span.linkable, em';
const BUBBLE_OFFSET_LEFT = 0;
const BUBBLE_OFFSET_TOP = 10;
const BUBBLE_PADDING = '6px 10px';
const BUBBLE_BG_COLOR = 'rgba(0, 0, 0, 0.1)';
const BUBBLE_BORDER_RADIUS = '12px';
const BUBBLE_FONT_SIZE = '12px';
const BUBBLE_LINE_HEIGHT = '14px';
const BUBBLE_MAX_WIDTH = '180px';
const BUBBLE_MIN_WIDTH = '60px';
const BUBBLE_Z_INDEX = 100000;
const BUBBLE_TEXT_COLOR = '#00cfff';
const BUBBLE_ANIMATION_DURATION = 300;
const BUBBLE_FADE_IN_DURATION = 300;
const BUBBLE_DISPLAY_DURATION = 10000;
const BUBBLE_FADE_OUT_DURATION = 300;
const BUBBLE_SPACING = 0;
const POSITION_UPDATE_INTERVAL = 100;
const POSITION_MARGIN = 15;
const HIGHLIGHT_DURATION = 3000;
const POSITION_ORDER = ['north', 'east', 'west', 'south'];

(function() {
    'use strict';
    console.log('[ChatBulle Dynamic] Script chargé ✅');

    const activeBubbles = {};
    const pseudoPositions = {};
    const usedPositions = new Set();
    const bubbleCounters = {};

    const DEFAULT_SETTINGS = {
        fontSize: 12,
        backgroundOpacity: 0.2,
        displayDuration: 5000
    };

    function loadSettings() {
        const saved = localStorage.getItem('chatbubble_settings');
        if (saved) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('[ChatBulle] Erreur de chargement des paramètres:', e);
                return DEFAULT_SETTINGS;
            }
        }
        return DEFAULT_SETTINGS;
    }

    function saveSettings(settings) {
        localStorage.setItem('chatbubble_settings', JSON.stringify(settings));
        applySettings(settings);
    }

    function applySettings(settings) {
        let styleElement = document.getElementById('chatbubble-dynamic-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'chatbubble-dynamic-style';
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
                .chat_bubble {
                    font-size: ${settings.fontSize}px !important;
                    line-height: ${settings.fontSize + 2}px !important;
                    background-color: rgba(0, 0, 0, ${settings.backgroundOpacity}) !important;
                }
            `;
    }

    let userSettings = loadSettings();
    applySettings(userSettings);

    function showConfigPanel() {
        let overlay = document.getElementById('chatbubble-config-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'chatbubble-config-overlay';

            const panel = document.createElement('div');
            panel.id = 'chatbubble-config-panel';
            panel.innerHTML = `
                    <h2>⚙️ Configuration Bulle Chat</h2>

                    <div class="config-option">
                        <label>Taille du texte: <span class="value-display" id="fontSize-value">${userSettings.fontSize}px</span></label>
                        <input type="range" id="fontSize-slider" min="8" max="20" value="${userSettings.fontSize}" step="1">
                    </div>

                    <div class="config-option">
                        <label>Opacité du fond: <span class="value-display" id="bgOpacity-value">${Math.round(userSettings.backgroundOpacity * 100)}%</span></label>
                        <input type="range" id="bgOpacity-slider" min="0" max="100" value="${userSettings.backgroundOpacity * 100}" step="5">
                    </div>

                    <div class="config-option">
                        <label>Durée d'affichage: <span class="value-display" id="duration-value">${userSettings.displayDuration / 1000}s</span></label>
                        <input type="range" id="duration-slider" min="1" max="10" value="${userSettings.displayDuration / 1000}" step="1">
                    </div>

                    <div class="config-option">
                        <label>Aperçu:</label>
                        <div class="bubble-preview" id="bubble-preview">
                            <span style="color: #00cfff;">Exemple: Message de test</span>
                        </div>
                    </div>

                    <div class="config-buttons">
                        <button id="config-reset">Réinitialiser</button>
                        <button id="config-close">Fermer</button>
                    </div>
                `;

            overlay.appendChild(panel);
            document.body.appendChild(overlay);

            const fontSizeSlider = document.getElementById('fontSize-slider');
            const fontSizeValue = document.getElementById('fontSize-value');
            const bgOpacitySlider = document.getElementById('bgOpacity-slider');
            const bgOpacityValue = document.getElementById('bgOpacity-value');
            const durationSlider = document.getElementById('duration-slider');
            const durationValue = document.getElementById('duration-value');
            const preview = document.getElementById('bubble-preview');

            fontSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                fontSizeValue.textContent = value + 'px';
                preview.style.fontSize = value + 'px';
                preview.style.lineHeight = (value + 2) + 'px';

                userSettings.fontSize = value;
                saveSettings(userSettings);
            });

            bgOpacitySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) / 100;
                bgOpacityValue.textContent = Math.round(value * 100) + '%';
                preview.style.backgroundColor = `rgba(0, 0, 0, ${value})`;

                userSettings.backgroundOpacity = value;
                saveSettings(userSettings);
            });

            durationSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) * 1000;
                durationValue.textContent = (value / 1000) + 's';

                userSettings.displayDuration = value;
                saveSettings(userSettings);
            });

            document.getElementById('config-reset').addEventListener('click', () => {
                userSettings = { ...DEFAULT_SETTINGS };
                saveSettings(userSettings);

                fontSizeSlider.value = DEFAULT_SETTINGS.fontSize;
                fontSizeValue.textContent = DEFAULT_SETTINGS.fontSize + 'px';
                bgOpacitySlider.value = DEFAULT_SETTINGS.backgroundOpacity * 100;
                bgOpacityValue.textContent = Math.round(DEFAULT_SETTINGS.backgroundOpacity * 100) + '%';
                durationSlider.value = DEFAULT_SETTINGS.displayDuration / 1000;
                durationValue.textContent = (DEFAULT_SETTINGS.displayDuration / 1000) + 's';

                preview.style.fontSize = DEFAULT_SETTINGS.fontSize + 'px';
                preview.style.lineHeight = (DEFAULT_SETTINGS.fontSize + 2) + 'px';
                preview.style.backgroundColor = `rgba(0, 0, 0, ${DEFAULT_SETTINGS.backgroundOpacity})`;
            });

            document.getElementById('config-close').addEventListener('click', () => {
                overlay.style.display = 'none';
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });

            preview.style.fontSize = userSettings.fontSize + 'px';
            preview.style.lineHeight = (userSettings.fontSize + 2) + 'px';
            preview.style.backgroundColor = `rgba(0, 0, 0, ${userSettings.backgroundOpacity})`;
        }

        overlay.style.display = 'flex';
    }

    function addConfigMenuItem() {
        const checkInterval = setInterval(() => {
            const parametresMenu = $('.parametres.couleur5.right ul');
            if (parametresMenu.length > 0) {
                clearInterval(checkInterval);

                if (!parametresMenu.find('.chatbubble-config-menu').length) {
                    const menuItem = $('<li class="link couleur2 chatbubble-config-menu">Bulle Chat</li>');
                    menuItem.on('click', (e) => {
                        e.stopPropagation();
                        showConfigPanel();
                    });

                    const configChatItem = parametresMenu.find('li:contains("Configuration du Chat")');
                    if (configChatItem.length > 0) {
                        configChatItem.after(menuItem);
                    } else {
                        parametresMenu.append(menuItem);
                    }

                    console.log('[ChatBulle] Menu de configuration ajouté ✅');
                }
            }
        }, 1000);

        setTimeout(() => clearInterval(checkInterval), 30000);
    }

    function arePositionsClose(pos1, pos2, threshold = 60) {
        if (!pos1 || !pos2) return false;
        const dx = pos1.left - pos2.left;
        const dy = pos1.top - pos2.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < threshold;
    }

    function assignPosition(pseudo, pionPosition) {
        if (pseudoPositions[pseudo]) {
            return pseudoPositions[pseudo];
        }

        for (const [otherPseudo, position] of Object.entries(pseudoPositions)) {
            if (!activeBubbles[otherPseudo] || activeBubbles[otherPseudo].length === 0) {
                delete pseudoPositions[otherPseudo];
                usedPositions.delete(position);
            }
        }

        const nearbyPositions = new Set();

        for (const [otherPseudo, position] of Object.entries(pseudoPositions)) {
            if (otherPseudo === pseudo) continue;

            const $otherInfo = $(`${CHARACTERS_SELECTOR} .info_a_afficher`).filter(function() {
                return $(this).text().trim().toLowerCase() === otherPseudo.trim().toLowerCase();
            });

            let otherPosition = null;
            if ($otherInfo.length > 0) {
                const $otherPion = $otherInfo.closest('.icon_perso');
                otherPosition = $otherPion.offset();
            } else {
                const $cross = $(CROSS_SELECTOR);
                if ($cross.length) otherPosition = $cross.offset();
            }

            if (arePositionsClose(pionPosition, otherPosition)) {
                nearbyPositions.add(position);
            }
        }

        let assignedPosition = POSITION_ORDER[0];
        for (const pos of POSITION_ORDER) {
            if (!nearbyPositions.has(pos)) {
                assignedPosition = pos;
                break;
            }
        }

        pseudoPositions[pseudo] = assignedPosition;
        return assignedPosition;
    }

    function rectanglesOverlap(rect1, rect2, margin = 1) {
        return !(rect1.right + margin < rect2.left ||
                 rect1.left - margin > rect2.right ||
                 rect1.bottom + margin < rect2.top ||
                 rect1.top - margin > rect2.bottom);
    }

    function getBubbleRect(left, top, width, height) {
        const actualLeft = left - (width / 2);
        const actualTop = top - height;

        return {
            left: actualLeft,
            top: actualTop,
            right: actualLeft + width,
            bottom: actualTop + height,
            width: width,
            height: height
        };
    }

    function getPositionOffset(position, bubbleWidth, bubbleHeight, targetWidth, targetHeight, baseLeft, baseTop, currentBubble) {
        let offset = { x: 0, y: -POSITION_MARGIN };

        switch (position) {
            case 'north':
                offset = { x: 0, y: -POSITION_MARGIN };
                break;
            case 'east':
                offset = {
                    x: targetWidth / 2 + bubbleWidth / 2 + POSITION_MARGIN,
                    y: 0
                };
                break;
            case 'west':
                offset = {
                    x: -(targetWidth / 2 + bubbleWidth / 2 + POSITION_MARGIN),
                    y: 0
                };
                break;
            case 'south':
                offset = {
                    x: 0,
                    y: targetHeight + POSITION_MARGIN
                };
                break;
        }

        return offset;
    }

    function showChatBubble(pseudo, messageHTML, isWhisper, isShout, colorClass) {

        let $target = null;

        const $info = $(`${CHARACTERS_SELECTOR} .info_a_afficher`)
        .filter(function() {
            return $(this).html().toLowerCase()
                .split('<br>')
                .map(s=>s.trim())
                .includes(pseudo.toLowerCase());
        });

        if ($info.length) {
            const $icon = $info.closest('.icon_perso');
            $target = $icon.find('.le_icon_perso');
            if (!$target.length) $target = $icon;

            $target.addClass('chatbulle-highlight');
            setTimeout(() => $target.removeClass('chatbulle-highlight'), HIGHLIGHT_DURATION);
        } else {
            $target = $(CROSS_SELECTOR);
            if($target.length){
                $target.addClass('chatbulle-highlight');
                setTimeout(()=> $target.removeClass('chatbulle-highlight'), HIGHLIGHT_DURATION);
            }
        }

        if(!$target || !$target.length) return;

        const $bubble = $('<div class="chat_bubble"></div>').html(messageHTML);
        if(colorClass) $bubble.addClass(colorClass);
        if(isWhisper) $bubble.addClass('whisper');
        if(isShout)   $bubble.addClass('shout');

        $bubble.css({ zIndex:BUBBLE_Z_INDEX });
        $bubble.data('pseudo', pseudo);

        $('body').append($bubble);

        if(!activeBubbles[pseudo]) { activeBubbles[pseudo]=[]; bubbleCounters[pseudo]=0; }

        const stackIndex = bubbleCounters[pseudo]++;
        $bubble.data('stackIndex', stackIndex);

        let lastValid = null;

        function update() {
            let $t2=null;

            const $i2 = $(`${CHARACTERS_SELECTOR} .info_a_afficher`)
            .filter(function(){ return $(this).html().toLowerCase().split('<br>').map(s=>s.trim()).includes(pseudo.toLowerCase()); });
            let offsetleft = 0;
            if($i2.length)
            {
                $t2 = $i2.closest('.icon_perso');
                if (document.getElementById('combat_carte'))
                    offsetleft -= 230;
            }
            else
                $t2 = $(CROSS_SELECTOR);

            if(!$t2 || !$t2.length) return;

            const off = $t2.offset();
            if(!off) return;

            const tw = $t2.outerWidth() || 0;
            const th = $t2.outerHeight() || 0;

            const baseLeft = off.left + tw/2;
            const baseTop  = off.top;

            const bw = $bubble.outerWidth() || 90;
            const bh = $bubble.outerHeight() || 30;

            const pos = assignPosition(pseudo, off);

            $bubble.data('cardinalPosition', pos);

            const o = getPositionOffset(pos, bw, bh, tw, th);

            let left = baseLeft + o.x + offsetleft;
            let top  = baseTop  + o.y;

            let stackOffset = 0;
            const myIndex = $bubble.data('stackIndex');

            for(const p in activeBubbles){
                for(const ob of activeBubbles[p]){
                    if(ob[0] === $bubble[0]) continue;
                    if(ob.css('opacity')==='0') continue;

                    const oi = ob.data('stackIndex');
                    const ol = parseFloat(ob.css('left'));
                    const ow = ob.outerWidth();
                    const oh = ob.outerHeight();

                    const overlapH = !(
                        left - bw/2 > ol + ow/2 + 1 ||
                        left + bw/2 < ol - ow/2 - 1
                    );

                    if(overlapH && oi > myIndex){
                        stackOffset += oh;
                    }
                }
            }

            if(pos==='north') top -= stackOffset;
            else if(pos==='south') top += stackOffset;
            else top -= stackOffset;

            lastValid = {left, top};
            $bubble.css({ left:left+"px", top:top+"px" });
        }

        update();
        activeBubbles[pseudo].unshift($bubble);

        $bubble.animate({opacity:1}, BUBBLE_FADE_IN_DURATION);

        const interval = setInterval(update, POSITION_UPDATE_INTERVAL);
        $bubble.data('trackingInterval', interval);

        setTimeout(()=>{
            clearInterval(interval);
            $bubble.animate({opacity:0}, BUBBLE_FADE_OUT_DURATION, function(){
                const arr = activeBubbles[pseudo];
                const idx = arr.indexOf($bubble);
                if(idx!==-1) arr.splice(idx,1);
                $(this).remove();

                if(arr.length===0){
                    delete activeBubbles[pseudo];
                    delete bubbleCounters[pseudo];
                    delete pseudoPositions[pseudo];
                }
            });
        }, userSettings.displayDuration);
    }

function colorizeMessage($node) {
    const $clone = $node.clone();
    $clone.find('.moment').remove();

    const isWhisper = $node.hasClass('couleur5');
    const isShout   = $node.hasClass('couleur_rouge');

    $clone.find(PSEUDO_SELECTOR).each(function() {
        const $pseudo = $(this);
        const next = $pseudo[0].nextSibling;
        let colon = '';

        // On extrait le ":" qui suit le pseudo
        if (next && next.nodeType === Node.TEXT_NODE) {
            const match = next.textContent.match(/^(:\s*)/);
            if (match) {
                colon = match[1];
                next.textContent = next.textContent.slice(match[1].length);
            }
        }

        if (isWhisper) {
            $pseudo.addClass('whisper-sender');
            $pseudo.html(`<span class="whisper-sender">${$pseudo.text()}</span>${colon}`);
        } else if (isShout) {
            $pseudo.addClass('shout-sender');
            $pseudo.html(`<span class="shout-sender">${$pseudo.text()}</span>${colon}`);
        } else {
            // Ligne normale : on enveloppe le texte du pseudo mais on garde le ":" intact
            $pseudo.contents().filter(function() { return this.nodeType === Node.TEXT_NODE; })
                .wrap('<span class="' + $pseudo.attr('class') + '"></span>');
            // On remet le ":" après
            if (colon) {
                $pseudo.append(colon);
            }
        }
    });

    return { html: $clone.html().trim(), isWhisper: isWhisper, isShout: isShout };
}

function observeChat() {
    const chat = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if(!chat) return;

    console.log('[ChatBulle] Observer prêt.');

    const obs = new MutationObserver(muts=>{
        for(const m of muts){
            for(const n of m.addedNodes){
                if(n.nodeType!==1 || !n.classList.contains('msg')) continue;

                const $msg = $(n);

                let pseudo = '';
                let contentHTML = '';
                let isWhisper=false;
                let isShout=false;

                const em = $msg.find('em');
                const link = $msg.find('span.linkable');

                if(em.length){
                    pseudo = em.text().trim().split(' ')[0];
                }
                else if(link.length){
                    pseudo = link.text().trim();
                }
                else {
                    pseudo = $msg.text().split(':')[0].trim();
                }

                if(pseudo.includes('@')) pseudo = pseudo.split('@')[0].trim();

                const c = colorizeMessage($msg);
                contentHTML = c.html;
                isWhisper   = c.isWhisper;
                isShout     = c.isShout;

                // === PATCH : Récupérer couleur du pseudo ===
                let colorClass = null;
                const pseudoSpan = $msg.find('span.linkable');
                if(pseudoSpan.length){
                    pseudoSpan.attr('class').split(' ').forEach(cl=>{
                        if(cl.startsWith('c')) colorClass = cl;
                    });
                }
                // ========== FIN PATCH ==========

                showChatBubble(pseudo, contentHTML, isWhisper, isShout, colorClass);
            }
        }
    });

    obs.observe(chat, {childList:true});
}
    function waitForChat() {
        const chatOK = $(CHAT_CONTAINER_SELECTOR).length > 0;
        const mapOK = $(CHARACTERS_SELECTOR).length > 0;
        if (chatOK && mapOK) {
            observeChat();
            addConfigMenuItem();
        } else {
            setTimeout(waitForChat, 1000);
        }
    }

    waitForChat();
})();