// ==UserScript==
// @name        Cowz+
// @namespace   namespace
// @match       *://cowz.io/*
// @grant       none
// @version     1.2
// @author      dsim
// @description Scroll to zoom in/out, items filtered and highlighted based on rarity and type.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549452/Cowz%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/549452/Cowz%2B.meta.js
// ==/UserScript==

const brandColors = {
    13: "hsl(250 33.9% 49.8%)",
    14: "hsl(250 33.9% 49.8%)",
    15: "hsl(250 33.9% 49.8%)",
    16: "hsl(250 33.9% 49.8%)",
    17: "hsl(285 100% 47.1%)",
    18: "hsl(285 100% 47.1%)",
    19: "hsl(285 100% 47.1%)",
    20: "hsl(285 100% 47.1%)",
    21: "hsl(285 100% 47.1%)",
    22: "hsl(333 100% 47.1%)",
    23: "hsl(333 100% 47.1%)",
    24: "hsl(333 100% 47.1%)",
    25: "hsl(333 100% 47.1%)",
    26: "hsl(333 100% 47.1%)"
};

let c, ctx;

let menuVisible = false;
let settings = { darkMode: false, filter: true, highlight: true };

function createElement(tag, styles, text) {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    if (text) element.textContent = text;
    return element;
}

const menu = createElement('div', {
    position: 'fixed', top: '15%', left: '20px',
    background: 'rgba(0,0,0,0.7)', padding: '20px 30px', minWidth: '200px',
    textAlign: 'center', color: 'white', zIndex: 10001, display: 'none'
});

function createButton(text, onClick) {
    const button = createElement('div', {
        padding: '12px 20px', fontSize: '16px', color: '#999999', userSelect: 'none'
    });

    let isHovering = false;

    function updateButton() {
        const isToggleButton = text !== 'Close';
        const settingKey = text === 'Dark Mode' ? 'darkMode' :
                         text === 'Item Filter' ? 'filter' :
                         text === 'Item Highlight' ? 'highlight' :
                         text.toLowerCase().replace(' ', '');

        if (isToggleButton) {
            button.textContent = `${text}: ${settings[settingKey] ? 'ON' : 'OFF'}`;
        } else {
            button.textContent = text;
        }

        button.style.color = isHovering ? 'white' : '#999999';
    }

    button.onclick = () => {
        onClick();
        if (text !== 'Close') updateButton();
    };

    button.onmouseenter = () => {
        isHovering = true;
        button.style.color = 'white';
    };

    button.onmouseleave = () => {
        isHovering = false;
        button.style.color = '#999999';
    };

    updateButton();
    return button;
}

function createSeparator() {
    return createElement('div', {
        height: '2px',
        background: 'linear-gradient(to right, transparent, #666666, transparent)',
        margin: '8px 5px'
    });
}

function toggleSetting(settingName) {
    settings[settingName] = !settings[settingName];
    window.dispatchEvent(new CustomEvent(`${settingName}Toggle`, {
        detail: { enabled: settings[settingName] }
    }));
}

function showMenu() {
    menuVisible = true;
    menu.style.display = 'block';
}

function hideMenu() {
    menuVisible = false;
    menu.style.display = 'none';
}

function toggleMenu() {
    menuVisible ? hideMenu() : showMenu();
}

let currentZoom = null;
let targetZoom = null;
let hasUserScrolled = false;
const minZoom = 0.00005;
const maxZoom = 800;
const zoomSpeed = 0.3;

function init() {
    const gameCanvas = document.getElementById("main_canvas");
    if (gameCanvas) {
        c = document.createElement("canvas");
        c.style.position = "absolute";
        c.style.top = "0";
        c.style.left = "0";
        c.style.pointerEvents = "none";
        c.style.zIndex = "9999";

        c.width = gameCanvas.width;
        c.height = gameCanvas.height;

        ctx = c.getContext("2d");
        if (window.game && window.game.visibility) {
            window.game.visibility.render = function() {};
        }
        if (ctx) {
            gameCanvas.parentNode.insertBefore(c, gameCanvas.nextSibling);

            menu.appendChild(createElement('div', {
                fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'
            }, 'Cowz+'));

            ['Item Filter', 'Item Highlight', 'Dark Mode'].forEach(buttonText => {
                const settingKey = buttonText === 'Dark Mode' ? 'darkMode' :
                                 buttonText === 'Item Filter' ? 'filter' :
                                 buttonText === 'Item Highlight' ? 'highlight' :
                                 buttonText.toLowerCase().replace(' ', '');
                menu.appendChild(createButton(buttonText, () => toggleSetting(settingKey)));
                menu.appendChild(createSeparator());
            });

            menu.appendChild(createButton('Close', hideMenu));

            document.body.appendChild(menu);

            menu.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            menu.addEventListener('mousedown', (event) => {
                event.stopPropagation();
            });

            menu.addEventListener('mouseup', (event) => {
                event.stopPropagation();
            });

            document.addEventListener('keydown', (event) => {
                if (event.key.toLowerCase() === 'd' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
                    const activeElement = document.activeElement;
                    const isTyping = activeElement && (
                        activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.contentEditable === 'true'
                    );

                    if (!isTyping) {
                        event.preventDefault();
                        toggleMenu();
                    }
                }
                else if (event.key === 'Escape' && menuVisible) {
                    hideMenu();
                }
            });

            window.addEventListener('darkModeToggle', (e) => {
                toggleDarkOverlay(e.detail.enabled);
            });

            window.addEventListener('filterToggle', (e) => {
                toggleFilter(e.detail.enabled);
            });

            window.addEventListener('highlightToggle', (e) => {
                toggleHighlight(e.detail.enabled);
            });

            if (window.game && window.game.update) {
                const game = window.game;
                const originalUpdate = game.update;

                if (game.camera) {
                    Object.defineProperty(game.camera, 'z', {
                        get: function() {
                            return hasUserScrolled ? (currentZoom || 1) : this._z || 1;
                        },
                        set: function(value) {
                            if (hasUserScrolled) {
                                return;
                            }
                            this._z = value;
                            if (currentZoom === null) {
                                currentZoom = value;
                                targetZoom = value;
                            }
                        }
                    });

                    game.camera._z = game.camera.z;

                window.zoomOverrideCount = 0;
                }

                game.update = function(deltaTime) {
                    originalUpdate.call(this, deltaTime);
                    run();
                };

                interceptLmbCommand();
            } else {
                setTimeout(init, 100);
                return;
            }
        } else {
            setTimeout(init, 100);
        }
    } else {
        setTimeout(init, 100);
    }
}

function handleWheel(event) {
    event.preventDefault();

    if (!hasUserScrolled) {
        hasUserScrolled = true;
    }

    if (event.deltaY > 0) {
        targetZoom = Math.min(maxZoom, targetZoom + zoomSpeed);
    } else {
        targetZoom = Math.max(minZoom, targetZoom - zoomSpeed);
    }
}

document.addEventListener('wheel', handleWheel, { passive: false });

function renderItem(item, renderData) {
    if (renderData.hidden) {
        setHidden(item);
        return;
    }

    setVisible(item);

    if (renderData.highlighted) {
        const camera = window.game.camera;
        const worldX = item.pos.x;
        const worldY = item.pos.y;

        const screenX = 0.5 * window.innerWidth - (camera.pos.x - worldX) / camera.z * camera.ppu;
        const screenY = 0.5 * window.innerHeight + (camera.pos.y - worldY) / camera.z * camera.ppu;
        ctx.globalAlpha = 0.5;
        const itemScale = 0.75 / camera.z;
        const highlightSize = itemScale * 120;

        ctx.fillStyle = renderData.highlightColor;
        ctx.fillRect(screenX - highlightSize/2, screenY - highlightSize/2, highlightSize, highlightSize);
    }
}

function setHidden(item) {
    if (item.container.visible) {
        item.container.visible = false;
    }
    if (item.nameText.visible) {
        item.nameText.visible = false;
    }
    if (item.itemEmitter) {
        if (item.itemEmitter.enabled) {
            item.itemEmitter.enabled = false;
        }
    }
}
function setVisible(item) {
    if (!item.container.visible) {
        item.container.visible = true;
    }
    if (!item.nameText.visible) {
        item.nameText.visible = true;
    }
    if (item.itemEmitter) {
        if (!item.itemEmitter.enabled) {
            item.itemEmitter.enabled = true;
        }
    }
}

let filterEnabled = true;
let highlightEnabled = true;

function computeRenderData(item) {
    const itemData = item.item;
    const baseType = itemData.baseType;
    const type = itemData.type;
    const rarity = itemData.rarity;
    const lvlReq = itemData.lvlReq;
    const flags = itemData.flags;

    let renderData = {
        hidden: false,
        highlighted: false,
        highlightColor: null,
        id: itemData.itemId,
        idOld: itemData.itemIdOld
    };
    if (!highlightEnabled && !filterEnabled) {
        return renderData;
    } else {
        if (baseType.startsWith("brand")) {
            let brandLevel = Number(baseType.match(/\d+$/));
            if (brandLevel >= 13) {
                if (highlightEnabled) {
                    renderData.highlighted = true;
                    renderData.highlightColor = brandColors[brandLevel];
                }
            } else if (filterEnabled && !(brandLevel === 5 || brandLevel === 6 || brandLevel === 8 || brandLevel === 9)) {
                renderData.hidden = true;
            }
        } else if (baseType.startsWith("jewel")) {
            if (rarity >= 3) {
                if (highlightEnabled) {
                    renderData.highlighted = true;
                    renderData.highlightColor = "hsl(11 100% 47.1%)";
                }
            } else if (filterEnabled && rarity <= 1) {
                renderData.hidden = true;
            }
        } else if (baseType.endsWith("ring") || baseType.endsWith("amulet")) {
            if (rarity >= 3) {
                if (highlightEnabled) {
                    renderData.highlighted = true;
                    renderData.highlightColor = "hsl(21 100% 47.1%)";
                }
            } else if (filterEnabled && rarity <= 1) {
                renderData.hidden = true;
            }
        } else if (baseType === "aburite") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(185 100% 61.5%)";
            }
        } else if (baseType === "steak_cow_03") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(31 83.5% 47.9%)";
            }
        } else if (baseType === "amber") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "orange";
            }
        } else if (baseType === "bezoar") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(46 67% 41%)";
            }
        } else if (type.startsWith("fat_king")) {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(299 54.2% 51%)";
            }
        } else if (baseType.startsWith("map")) {
            if (highlightEnabled) {
                if (Number(item.item.baseType.slice(-1)) >= 4) {
                    renderData.highlighted = true;
                    renderData.highlightColor = "hsl(275 43.5% 50%)";
                }
            }
        } else if (type === "unq_tome_portal" || type === "unq_shepherd_codex" || type === "unq_skeleton_key") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(119 100% 51%)";
            }
        } else if (baseType === "skill_orb_passive") {
            if (filterEnabled && lvlReq !== 17) {
                renderData.hidden = true;
            }
        } else if (baseType === "scroll_seven_hands") {
            if (highlightEnabled) {
                renderData.highlighted = true;
                renderData.highlightColor = "hsl(40 63.2% 47.8%)";
            }
        } else if (baseType.endsWith("_03")) {
            if (rarity >= 3) {
                if (highlightEnabled) {
                    renderData.highlighted = true;
                    renderData.highlightColor = "red";
                }
            } else if (rarity === 0) {
                if (flags >= 2) {
                    if (highlightEnabled) {
                        renderData.highlighted = true;
                        renderData.highlightColor = "white";
                    }
                }
            } else if (filterEnabled) {
                renderData.hidden = true;
            }
        } else if (filterEnabled && rarity <= 2 && !(baseType === "scroll_focus" || baseType === "pearl" || baseType === "marrow")) {
            renderData.hidden = true;
        }
    }
    return renderData;
}

function renderItems() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.globalAlpha = 0.5;
    let items = window.game.itemBarn.items.filter(item => item.entityActive);
    items.forEach(item => {
        if (!item._renderData || item.item.itemId !== item._renderData.id || item.item.itemIdOld !== item._renderData.idOld) {
            item._renderData = computeRenderData(item);
        }
        renderItem(item, item._renderData);
    });

    ctx.globalAlpha = 1;
}

let darkOverlay = null;

function createDarkOverlay() {
    if (!window.game || !window.game.renderer || !window.game.renderer.gameContainer) {
        return;
    }

    if (!darkOverlay) {
        let Graphics = null;

        if (window.game.map && window.game.map.groundGfx) {
            Graphics = window.game.map.groundGfx.constructor;
        }

        if (Graphics) {
            darkOverlay = new Graphics();
            darkOverlay.beginFill(0x000000, 0.7);
            darkOverlay.drawRect(-10000, -10000, 20000, 20000);
            darkOverlay.endFill();
            darkOverlay.zIndex = 0.5;
            darkOverlay.visible = false;
            window.game.renderer.gameContainer.addChildAt(darkOverlay, 0);
        }
    }
}

function toggleDarkOverlay(enabled) {
    if (darkOverlay) {
        darkOverlay.visible = enabled;
    }
}

function toggleFilter(enabled) {
    filterEnabled = enabled;
    if (window.game && window.game.itemBarn && window.game.itemBarn.items) {
        window.game.itemBarn.items.forEach(item => {
            if (item.entityActive) {
                item._renderData = computeRenderData(item);
            }
        });
    }
}

function toggleHighlight(enabled) {
    highlightEnabled = enabled;
    if (window.game && window.game.itemBarn && window.game.itemBarn.items) {
        window.game.itemBarn.items.forEach(item => {
            if (item.entityActive) {
                item._renderData = computeRenderData(item);
            }
        });
    }
}

function interceptLmbCommand() {
    if (!window.game || !window.game.selection) return;

    const originalGetGameLmbCommand = window.game.selection.getGameLmbCommand;
    window.game.selection.getGameLmbCommand = function(game) {
        const command = originalGetGameLmbCommand.call(this, game);

        if (command.targetEntityId && game.itemBarn && game.itemBarn.items) {
            const targetItem = game.itemBarn.items.find(item =>
                item.entityId === command.targetEntityId && item.entityActive
            );

            if (targetItem && targetItem._renderData && targetItem._renderData.hidden) {
                return {
                    cmd: 1,
                    targetPos: command.targetPos || {x: 0, y: 0},
                    lmbPressed: command.lmbPressed,
                    setTarget: command.setTarget
                };
            }
        }

        return command;
    };
}

function run() {
    if (!window.game || !window.game.itemBarn || !window.game.itemBarn.items || !window.game.camera) {
        return;
    }

    createDarkOverlay();
    if (currentZoom === null) {
        currentZoom = window.game.camera.z;
        targetZoom = window.game.camera.z;
    }

    if (hasUserScrolled) {
        const zoomDiff = targetZoom - currentZoom;
        if (Math.abs(zoomDiff) > 0.01) {
            currentZoom += zoomDiff * 0.1;
        }
    } else {
        currentZoom = window.game.camera.z;
        targetZoom = window.game.camera.z;
    }

    if (hasUserScrolled && currentZoom !== null) {
        window.game.camera._z = currentZoom;
    }


    if (window.game.selection.setTarget) {

    }

    renderItems();

}

init();