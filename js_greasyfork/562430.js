// ==UserScript==
// @name         Torn Loot Rangers Floating Panel
// @namespace    npc.timing.floating
// @version      3.2
// @description  Loot Rangers NPC attack info in a compact floating box 
// @author       IceBlueFire
// @license      MIT
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/newspaper.php
// @exclude      https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @connect      api.lzpt.io
// @downloadURL https://update.greasyfork.org/scripts/562430/Torn%20Loot%20Rangers%20Floating%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/562430/Torn%20Loot%20Rangers%20Floating%20Panel.meta.js
// ==/UserScript==

/******************** CONFIG SETTINGS ********************/
const color = "#8abeef";                 // Text / border color
const EXPAND_THRESHOLD_SECONDS = 10 * 60; // 10 minutes
/****************** END CONFIG SETTINGS *******************/

(function () {
    'use strict';

    // Inject basic CSS (namespaced)
    const style = document.createElement('style');
    style.textContent = `
.lr-panel {
  position: fixed;
  z-index: 999999;
  background: rgba(11, 15, 25, 0.95);
  border: 1px solid ${color};
  border-radius: 6px;
  padding: 0;
  color: ${color};
  font-size: 12px;
  font-family: Verdana, Arial, sans-serif;
  max-width: 320px;
  box-shadow: 0 0 6px rgba(0,0,0,0.6);
}
.lr-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 4px 6px;
  cursor: move;
  border-bottom: 1px solid ${color};
}
.lr-title-left {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lr-title-left[data-lr-tooltip] {
  position: relative;
}
.lr-title-left[data-lr-tooltip]:hover::after {
  content: attr(data-lr-tooltip);
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 2px;
  background: rgba(15, 20, 30, 0.95);
  color: ${color};
  padding: 3px 6px;
  font-size: 10px;
  border: 1px solid ${color};
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1000000;
}
.lr-buttons {
  flex-shrink: 0;
  cursor: default;
  display: flex;
  gap: 2px;
}
.lr-btn {
  padding: 0 4px;
  font-size: 10px;
  background: transparent;
  color: ${color};
  border: 1px solid ${color};
  border-radius: 3px;
  cursor: pointer;
  min-width: 30px;
}
.lr-body {
  padding: 4px 6px;
  line-height: 1.3;
  cursor: default;
}
.lr-body.hidden {
  display: none;
}
.lr-status-line {
  font-size: 10px;
  opacity: 0.85;
  margin-top: 1px;
}
`;
    document.head.appendChild(style);

    // Load saved position
    let savedPos = null;

    try {
        const rawPos = localStorage.getItem('lootFloatingPos');
        if (rawPos) {
            savedPos = JSON.parse(rawPos);
        }
    } catch (e) {
        console.error('Error reading saved Loot panel position', e);
    }

    // Create floating panel
    const panel = document.createElement('div');
    panel.id = 'lr-panel';
    panel.className = 'lr-panel';

    // Default bottom-right if no saved position
    if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
        panel.style.left = savedPos.left + 'px';
        panel.style.top  = savedPos.top + 'px';
    } else {
        panel.style.bottom = '20px';
        panel.style.right  = '20px';
    }

    panel.innerHTML =
        '<div id="lr-title" class="lr-title">' +
        '  <span id="lr-title-text" class="lr-title-left" data-lr-tooltip="Shows Loot Rangers NPC attack time, order and countdown.">' +
        '    Loot Rangers' +
        '    <div id="lr-status-line" class="lr-status-line"></div>' +
        '  </span>' +
        '  <span class="lr-buttons">' +
        '    <button id="lr-close-btn"  title="Close panel" class="lr-btn">✖</button>' +
        '  </span>' +
        '</div>' +
        '<div id="lr-body" class="lr-body hidden">' +
        '  Loading NPC data…' +
        '</div>';

    document.body.appendChild(panel);

    const title      = document.getElementById('lr-title');
    const closeBtn   = document.getElementById('lr-close-btn');
    const statusLine = document.getElementById('lr-status-line');
    const bodyEl     = document.getElementById('lr-body');

    // Drag using the title; ignore clicks on buttons
    makeDraggable(panel, title);

    // Global timing / state
    window.nextClearTs = 0;
    let lootRefreshing = false;
    let lastLootData   = null;  // cache last valid API result
    let lastAttackFlag = false; // true if last known state was attack

    /******************** DATA REFRESH ********************/
    function refreshLoot() {
        if (lootRefreshing) return; // prevent overlapping calls
        lootRefreshing = true;

        getAttackTimes().then(result => {
            if (!bodyEl) return;

            if (!result || !result.time || !result.order || !result.npcs) {
                if (lastLootData) {
                    renderLoot(lastLootData, bodyEl);
                } else {
                    bodyEl.textContent = 'Error loading Loot Rangers data.';
                    window.nextClearTs = 0;
                }
                return;
            }

            lastLootData   = result;
            lastAttackFlag = !!result.time.attack;
            renderLoot(result, bodyEl);
        }).catch(e => {
            if (bodyEl && !lastLootData) {
                bodyEl.textContent = 'Error loading Loot Rangers data.';
                window.nextClearTs = 0;
            }
            console.error(e);
        }).finally(() => {
            lootRefreshing = false;
        });
    }

    // Initial load + periodic refresh
    refreshLoot();
    setInterval(refreshLoot, 60000); // refresh every 60s

    /******************** COUNTDOWN + AUTO EXPAND ********************/
    function updateStatusLine(optionalDiffSeconds) {
        if (!statusLine) return;

        let text = '';

        const clearTs = window.nextClearTs || 0;
        if (clearTs > 0) {
            const now = Math.floor(Date.now() / 1000);
            let diff = typeof optionalDiffSeconds === 'number'
                ? optionalDiffSeconds
                : clearTs - now;

            if (diff <= 0) {
                text = 'Time until: now';
            } else {
                const hours = Math.floor(diff / 3600);
                diff -= hours * 3600;
                const minutes = Math.floor(diff / 60);
                const seconds = diff - minutes * 60;

                const pad = (n) => (n < 10 ? '0' + n : '' + n);
                text = 'Time until: ' +
                    pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
            }
        } else {
            text = '';
        }

        statusLine.textContent = text;
    }

    setInterval(() => {
        const clearTs = window.nextClearTs || 0;
        if (!clearTs || clearTs <= 0) {
            updateStatusLine(null);
            if (bodyEl && !lastAttackFlag) {
                bodyEl.classList.add('hidden');
            }
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        let diff = clearTs - now;

        // Update status line timer
        updateStatusLine(diff);

        // Auto expand body when <= threshold or when attack is active
        if (bodyEl) {
            if (diff <= EXPAND_THRESHOLD_SECONDS || lastAttackFlag) {
                bodyEl.classList.remove('hidden');
            } else {
                bodyEl.classList.add('hidden');
            }
        }
    }, 1000);

    /******************** CLOSE BUTTON ********************/
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        });
    }

    /******************** RENDER FUNCTION ********************/
    function renderLoot(result, bodyEl) {
        let attackOrder  = '';
        let attackString = '';
        let attackTarget = 0;

        if (result.time.clear === 0 && result.time.attack === false) {
            attackString = result.time.reason
                ? 'NPC attacking will resume after ' + result.time.reason
                : 'No attack currently set.';
            window.nextClearTs = 0;
        } else {
            $.each(result.order, function (key, value) {
                const npc = result.npcs[value];
                if (!npc) return;

                const npcUrl  = 'loader.php?sid=attack&user2ID=' + value;
                const npcName = '<a href="' + npcUrl + '" ' +
                                'style="color:' + color + ';text-decoration:underline;" ' +
                                'target="_blank" title="Attack ' + npc.name + '">' +
                                npc.name + '</a>';

                if (npc.next) {
                    if (result.time.attack === true) {
                        if (npc.hosp_out >= result.time.current) {
                            attackOrder += '<span style="text-decoration: line-through">' + npcName + '</span>, ';
                        } else {
                            attackOrder += npcName + ', ';
                        }
                    } else {
                        attackOrder += npcName + ', ';
                    }
                }
                if (result.time.attack === true) {
                    if (npc.hosp_out <= result.time.current) {
                        if (attackTarget === 0) {
                            attackTarget = value;
                        }
                    }
                }
            });

            if (attackTarget === 0) {
                attackTarget = result.order[0];
            }

            attackOrder = attackOrder ? attackOrder.slice(0, -2) + '.' : '';

            const targetNpc = result.npcs[attackTarget];
            const nextNpcName = targetNpc
                ? '<a href="loader.php?sid=attack&user2ID=' + attackTarget + '" ' +
                  'style="color:' + color + ';text-decoration:underline;" target="_blank" title="Attack ' + targetNpc.name + '">' +
                  targetNpc.name + '</a>'
                : 'Unknown';

            if (result.time.attack === true) {
                attackString =
                    'NPC attack is underway! Next: ' + nextNpcName + '. Get in there and get some loot!';
            } else {
                attackString =
                    'Next: ' + nextNpcName +
                    ' at ' + utcformat(result.time.clear) +
                    (attackOrder ? '<br>Order: ' + attackOrder : '');
            }

            window.nextClearTs = result.time.clear || 0;
        }

        bodyEl.innerHTML = '<span id="lr-npctimer">' + attackString + '</span>';
    }

})();

/******************** HELPER FUNCTIONS ********************/

// Always TCT 24h
function utcformat(ts) {
    const d = new Date(ts * 1000);
    const D = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
    const T = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()];

    for (let i = 0; i < 3; i++) {
        if (D[i] < 10) D[i] = '0' + D[i];
        if (T[i] < 10) T[i] = '0' + T[i];
    }

    return T.join(':') + ' TCT';
}

// Fetch the NPC details from Loot Rangers
async function getAttackTimes() {
    return new Promise(resolve => {
        const request_url = `https://api.lzpt.io/loot`;
        GM_xmlhttpRequest({
            method: "GET",
            url: request_url,
            headers: {
                "Content-Type": "application/json"
            },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data) {
                        console.log('No response from Loot Rangers');
                        return resolve(null);
                    } else {
                        return resolve(data);
                    }
                } catch (e) {
                    console.error(e);
                    return resolve(null);
                }
            },
            onerror: (e) => {
                console.error(e);
                return resolve(null);
            }
        });
    });
}

// Draggable behavior for mouse + touch (title bar is handle) with position saving
// and no page scrolling while dragging
function makeDraggable(element, handle) {
    let isDown = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    function startDrag(clientX, clientY) {
        isDown = true;

        const rect = element.getBoundingClientRect();
        element.style.left   = rect.left + 'px';
        element.style.top    = rect.top + 'px';
        element.style.right  = 'auto';
        element.style.bottom = 'auto';

        startX = clientX;
        startY = clientY;
        startLeft = rect.left;
        startTop  = rect.top;

        document.body.style.userSelect = 'none';
        document.body.style.overflow  = 'hidden';
    }

    function moveDrag(clientX, clientY) {
        const dx = clientX - startX;
        const dy = clientY - startY;

        element.style.left = (startLeft + dx) + 'px';
        element.style.top  = (startTop  + dy) + 'px';
    }

    function endDrag() {
        isDown = false;
        document.body.style.userSelect = '';
        document.body.style.overflow  = '';

        try {
            const rect = element.getBoundingClientRect();
            const pos = { left: rect.left, top: rect.top };
            localStorage.setItem('lootFloatingPos', JSON.stringify(pos));
        } catch (e) {
            console.error('Error saving Loot panel position', e);
        }
    }

    handle.addEventListener('mousedown', (e) => {
        if (e.target && e.target.classList.contains('lr-btn')) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        moveDrag(e.clientX, e.clientY);
    }, { passive: false });

    document.addEventListener('mouseup', () => {
        if (!isDown) return;
        endDrag();
    });

    handle.addEventListener('touchstart', (e) => {
        if (e.target && e.target.classList.contains('lr-btn')) return;
        const t = e.touches[0];
        if (!t) return;
        e.preventDefault();
        startDrag(t.clientX, t.clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const t = e.touches[0];
        if (!t) return;
        e.preventDefault();
        moveDrag(t.clientX, t.clientY);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (!isDown) return;
        endDrag();
    });
}
