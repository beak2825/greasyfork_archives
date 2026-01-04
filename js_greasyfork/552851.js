// ==UserScript==
// @name         Bullet Force - Mod Menu
// @version      1
// @description  Bullet Force - Mod Menu with red crosshair dot
// @match        https://games.crazygames.com/en_US/bullet-force-multiplayer/*
// @match        https://www.multiplayerpiano.dev/*
// @match        http://localhost:48897/game
// @match        https://www.gamepix.com/play/bullet-force
// @match        https://www.miniplay.com/game/bullet-force-multiplayer
// @match        https://kbhgames.com/game/bullet-force
// @match        https://bullet-force.com/
// @match        https://www.jopi.com/game/game/bullet-force/
// @match        https://www.gogy.com/games/bullet-force
// @match        https://www.gameflare.com/online-game/bullet-force/
// @match        https://www.silvergames.com/en/bullet-force
// @match        https://kour-io.com/bullet-force
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1527535
// @downloadURL https://update.greasyfork.org/scripts/552851/Bullet%20Force%20-%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/552851/Bullet%20Force%20-%20Mod%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===========================
    //  SETTINGS (edit here)
    // ===========================
    const DEFAULT_OFFSET = -23; // Initial default vertical offset for crosshair (negative = move up)
    let DOT_OFFSET = DEFAULT_OFFSET;
    // Default dot color and size (will be overridden by saved settings if present)
    const DEFAULT_COLOR = '#ff2b2b';
    // bright red default
    const DEFAULT_SIZE = 3;
    // px diameter

    // localStorage keys
    const LS_PREFIX = 'bfv2_';
    const LS_CROSSHAIR_ON = LS_PREFIX + 'Crosshair';
    const LS_DOT_COLOR = LS_PREFIX + 'DotColor';
    const LS_DOT_SIZE = LS_PREFIX + 'DotSize';
    const LS_DOT_OFFSET = LS_PREFIX + 'DotOffset';
    const LS_LAUNCHER_LEFT = LS_PREFIX + 'LauncherLeft';
    const LS_LAUNCHER_TOP = LS_PREFIX + 'LauncherTop';
    const LS_MODAL_LEFT = LS_PREFIX + 'ModalLeft'; // New key for modal position
    const LS_MODAL_TOP = LS_PREFIX + 'ModalTop';
    // New key for modal position


    // ===========================
    //  STYLE INJECTION
    // ===========================
    const style = document.createElement('style');
    style.textContent = `
@keyframes rainbow-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1;
transform: scale(1); } }

#bf-enhancer-ui-v2{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}
#bf-enhancer-launcher span{background-image:linear-gradient(to right,#e81919,#f7ff00,#40ff00,#00fff2,#0015ff,#c300ff,#e81919);background-size:400% 100%;color:transparent;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rainbow-flow 6s ease infinite;pointer-events:none;}
.social-button{padding:6px 10px;border-radius:6px;font-weight:700;font-size:12px;border:none;cursor:pointer;color:white;transition:background 0.15s ease, transform 0.1s;flex-grow:1;text-align:center;}
/* color-dot small inline icon */
.color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
    box-shadow: 0 0 4px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.15);
}

/* ------------------------------------- */
/* !!! NEW SLEEK MODAL STYLES !!! */
/* ------------------------------------- */

/* Modal overlay: Serves only as a transparent blocker and container.
Removed centering. */
#bf-dot-modal {
    position: fixed;
    inset: 0;
    z-index: 99999997; /* MODIFIED: Lowered z-index so it doesn't overlay the main menu (99999998) */
    display: none;
    /* Removed centering properties */
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
}
/* Modal content: Now ABSOLUTELY positioned and draggable */
#bf-dot-modal .modal-card {
    position: absolute;
    /* Changed to absolute for dragging */
    top: 50%;
    /* Initial center position */
    left: 50%;
    /* Initial center position */
    transform: translate(-50%, -50%);
    /* Center it initially */
    cursor: default;
    /* Ensure the whole card doesn't grab */
    width: 210px;
    max-width: 95%;
    background: #18191d;
    padding: 16px;
    border-radius: 12px;
    /* Subtle glow border */
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 10px 30px rgba(0,0,0,0.9), 0 0 20px #2befff30; /* Dark shadow + cyan accent glow */
    color: #e5e7eb;
    /* Light gray text */
    font-family: 'Inter', Arial, sans-serif;
    font-size: 13px;
    animation: fadeIn 0.3s ease-out;
}

/* Modal Drag Handle */
#bf-dot-modal .modal-card .drag-handle-modal {
    cursor: move;
    /* Make the title a clear drag handle */
    user-select: none;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #37415130;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    color: #2befff;
}

/* Modal Close Button (X) Styling */
#bf-dot-modal .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: #e5e7eb;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
    opacity: 0.7;
}

#bf-dot-modal .close-btn:hover {
    opacity: 1;
    color: #2befff;
    background: #374151;
}

/* Utility for row structure */
#bf-dot-modal .setting-row {
    margin-bottom: 15px;
    padding: 0;
    border-bottom: 1px solid #37415130;
    padding-bottom: 12px;
}
#bf-dot-modal .setting-row:last-of-type {
     border-bottom: none;
     padding-bottom: 0;
}
#bf-dot-modal label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
}
/* Range/Input Styling */
#bf-dot-modal .range-row { display:flex; align-items:center; gap:12px; margin-top:10px; }
#bf-dot-modal input[type="range"] {
    width:100%;
    height: 6px;
    -webkit-appearance: none;
    background: #374151; /* Dark track */
    border-radius: 4px;
    outline: none;
    transition: opacity .15s ease-in-out;
}
#bf-dot-modal input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #2befff;
    /* Cyan thumb */
    cursor: pointer;
    box-shadow: 0 0 4px #2befff;
}
/* Color Swatches Grid */
#bf-dot-modal .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    /* 5 columns of swatches */
    gap: 6px;
    margin-top: 8px;
    max-height: 120px;
    /* Restrict height */
    overflow-y: auto;
}
#bf-dot-modal .swatch-item {
    width: 100%;
    aspect-ratio: 1 / 1; /* Make it a square */
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    border: 1px solid transparent;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
}
#bf-dot-modal .swatch-item:hover {
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(255,255,255,0.3);
}
#bf-dot-modal .swatch-item.selected {
    border: 2px solid #2befff; /* Cyan selection ring */
    transform: scale(1.05);
    box-shadow: 0 0 10px #2befff, inset 0 0 5px rgba(255,255,255,0.5);
}
/* Preview Dot (Inside modal) */
#bf-dot-modal .preview-dot {
    width: 60px;
    /* Slightly larger preview */
    height: 60px;
    border-radius: 50%;
    margin: 8px auto 16px auto;
    box-shadow: 0 0 25px rgba(255,255,255,0.1);
    border: 2px solid #ffffff30;
}
/* Action Buttons */
/* Updated styling for centered Reset button */
#bf-dot-modal .modal-actions {
    display:flex;
    justify-content:center; /* Center the Reset button */
    gap:8px;
    margin-top:15px;
    /* Increase gap from content */
}
#bf-dot-modal .btn {
    padding:8px 16px;
    /* Slightly larger padding for prominence */
    border-radius:6px;
    border:none;
    cursor:pointer;
    font-weight:700;
    font-size:14px;
    /* Slightly larger font */
    transition: transform 0.1s, background 0.1s;
}
#bf-dot-modal .btn:hover { transform: translateY(-1px);
}
#bf-dot-modal .btn.primary { background:#2befff; color:#18191d; } /* Cyan primary */
#bf-dot-modal .btn.ghost { background: #374151; color:#e5e7eb;
} /* Dark gray ghost */
`;
    document.head.appendChild(style);

    // ===========================
    //  UTILS
    // ===========================
    function readLS(key, fallback) {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
    }
    function writeLS(key, value) {
        localStorage.setItem(key, value);
    }

    // restore settings
    const savedDotColor = readLS(LS_DOT_COLOR, DEFAULT_COLOR);
    const savedDotSize = parseInt(readLS(LS_DOT_SIZE, String(DEFAULT_SIZE)), 10) || DEFAULT_SIZE;
    const savedDotOffset = parseInt(readLS(LS_DOT_OFFSET, String(DOT_OFFSET)), 10);
    if (!isNaN(savedDotOffset)) DOT_OFFSET = savedDotOffset;
    let crosshairOn = readLS(LS_CROSSHAIR_ON, '0') === '1';

    // ===========================
    //  CROSSHAIR (dot) functions
    // ===========================
    const CROSSHAIR_ID = 'bf-simple-crosshair';
    function getDotElement() {
        return document.getElementById(CROSSHAIR_ID);
    }
    function applyCrosshairStyle(el, color, size) {
        if (!el) return;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.background = color;
        el.style.borderRadius = '50%';
        el.style.zIndex = '999999998';
        el.style.pointerEvents = 'none';
        el.style.position = 'fixed';
        // position center with DOT_OFFSET (uses current global DOT_OFFSET value)
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = `translate(-50%, calc(-50% + ${DOT_OFFSET}px))`;
    }
    function createCrosshairIfNeeded() {
        if (!getDotElement()) {
            const c = document.createElement('div');
            c.id = CROSSHAIR_ID;
            document.body.appendChild(c);
            applyCrosshairStyle(c, savedDotColor, savedDotSize);
            return c;
        }
        return getDotElement();
    }
    function toggleCrosshair(on) {
        crosshairOn = !!on;
        writeLS(LS_CROSSHAIR_ON, on ? '1' : '0');
        const el = getDotElement();
        if (on) {
            const created = createCrosshairIfNeeded();
            applyCrosshairStyle(created, savedDotColor, savedDotSize);
        } else {
            if (el) el.remove();
        }
    }
    // if saved ON, create afterwards
    if (crosshairOn) {
        setTimeout(() => createCrosshairIfNeeded(), 500);
    }

    // ===========================
    //  COLORS: bright palette requested
    // ===========================
    const COLORS = [
        { name: 'Red', hex: '#ff2b2b' },
        { name: 'Orange', hex: '#ff7a2d' },
        { name: 'Yellow', hex: '#ffd400' },
        { name: 'Lime', hex: '#b7ff2f' },
        { name: 'Green', hex: '#2bff66' },
        {
        name: 'Cyan', hex: '#2fefff' },
        { name: 'Blue', hex: '#2b8bff' },
        { name: 'Indigo', hex: '#4b3bff' },
        { name: 'Violet', hex: '#a13bff' },
        { name: 'Pink', hex: '#ff49a1' },
        { name: 'Magenta', hex: '#ff2bff' },
        { name: 'Maroon', hex: '#a12b2b' },
        { name: 'Brown', hex: '#a86a36' },

        { name: 'Black', hex: '#0d0d0d' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Gray', hex: '#9aa0a6' },
        { name: 'Teal', hex: '#00b3a6' },
        { name: 'Turquoise', hex: '#3fe0c8' },
        { name: 'Purple', hex: '#8e2bff' },
        { name: 'Turquoise Bright', hex: '#2be3d0' }
    ];
    // ===========================
    //  BUILD UI: launcher + menu + modal
    // ===========================
    function ready(cb) {
        if (document.body) return cb();
        new MutationObserver((_, obs) => {
            if (document.body) { obs.disconnect(); cb(); }
        }).observe(document.documentElement, { childList: true });
    }

    ready(() => {
        // remove existing if present
        const existing = document.getElementById('bf-enhancer-ui-v2');
        if (existing) existing.remove();
        const existingLauncher = document.getElementById('bf-enhancer-launcher');
        if (existingLauncher) existingLauncher.remove();
        const existingModal = document.getElementById('bf-dot-modal');
        if (existingModal) existingModal.remove();

        // --- LAUNCHER ---

        const launcher = document.createElement('button');
        launcher.id = 'bf-enhancer-launcher';
        const launcherText = document.createElement('span');
        launcherText.textContent = '420 MENU';
        launcher.appendChild(launcherText);
        Object.assign(launcher.style, {
            position: 'fixed', zIndex: 99999999,
            padding: '8px 14px', borderRadius: '8px', fontWeight: '900', fontSize: '16px',
            background:
            '#1a2333', border: '2px solid #ffffff33', boxShadow: '0 6px 20px rgba(0,0,0,0.7)',
            cursor: 'grab', transition: 'background 0.2s, transform 0.1s', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        });
        launcher.onmouseover = () => launcher.style.boxShadow = '0 6px 20px #7289da70';
        launcher.onmouseout = () => launcher.style.boxShadow = '0 6px 20px rgba(0,0,0,0.7)';
        launcher.onmousedown = () => launcher.style.cursor = 'grabbing';
        launcher.onmouseup = () => launcher.style.cursor = 'grab';
        document.body.appendChild(launcher);
        // --- MENU CONTAINER ---
        const container = document.createElement('div');
        container.id = 'bf-enhancer-ui-v2';
        Object.assign(container.style, {
            position: 'fixed', zIndex: 99999998,
            width: '240px', background: 'rgba(0,0,0,0.4)', color: '#f3f4f6', padding: '12px',
            borderRadius: '12px', fontFamily: 'Inter, Arial, sans-serif', fontSize: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.1)',
            border: 'none', display: 'none', resize: 'both', overflow: 'auto'

        });

        // --- DRAG, POSITIONING, AND TOGGLE LOGIC (Unified) ---
        const defaultLeft = 20;
        // Default X offset
        const defaultTop = 20;
        // Default Y offset
        let launcherLeft = parseFloat(readLS(LS_LAUNCHER_LEFT, defaultLeft));
        let launcherTop = parseFloat(readLS(LS_LAUNCHER_TOP, defaultTop));

        // Apply saved position to launcher
        Object.assign(launcher.style, {
            left: launcherLeft + 'px',
            top: launcherTop + 'px',
        });
        // Function to position the menu relative to the launcher
        const updateContainerPosition = () => {
            // Check if launcher is visible (its offsetTop/Left will be accurate)
            const lTop = launcher.offsetTop;
            const lLeft = launcher.offsetLeft;
            container.style.left = lLeft + 'px';
            container.style.top = (lTop + launcher.offsetHeight + 10) + 'px';
            // 10px gap
        };
        // DRAG/CLICK LOGIC
        let isDragging = false;
        let hasMoved = false;
        // New flag to detect movement
        const DRAG_THRESHOLD = 5;
        // Pixels required to count as a drag

        let startX, startY, initialX, initialY;
        launcher.addEventListener('mousedown', (e) => {
            // Only start drag if not the launcher text span (which has pointer-events: none)
            if (e.button !== 0) return; // Only primary button
            isDragging = true;
            hasMoved = false; // Reset on mousedown
            startX = e.clientX;

            startY = e.clientY;
            initialX = launcher.offsetLeft;
            initialY = launcher.offsetTop;
            launcher.style.cursor = 'grabbing';
            e.preventDefault(); // Prevent text selection
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Check if movement exceeds threshold
            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {

            hasMoved = true;
            }

            let newLeft = initialX + dx;
            let newTop = initialY + dy;

            // Boundary checks (keep launcher fully visible)
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - launcher.offsetWidth));

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - launcher.offsetHeight));

            launcher.style.left = newLeft + 'px';
            launcher.style.top = newTop + 'px';

            // Update container position only if it's open
            if (container.style.display === 'block') {
                updateContainerPosition();

            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                launcher.style.cursor = 'grab';

                // Save new position regardless of whether it moved
                writeLS(LS_LAUNCHER_LEFT, launcher.offsetLeft);

                writeLS(LS_LAUNCHER_TOP, launcher.offsetTop);

                // TOGGLE LOGIC: Only toggle if NO significant movement occurred (pure click)
                if (!hasMoved) {
                     if (container.style.display === 'none') {

                         updateContainerPosition(); // Calculate position before opening
                        container.style.display = 'block';
                    } else {
                        container.style.display = 'none';

                    }
                }
                // Important: Reset hasMoved flag, though it will be reset on next mousedown too
                hasMoved = false;
            }
        });
        // --- END DRAG/POSITIONING/TOGGLE LOGIC ---


        // Title (Changed to smaller text)
        const title = document.createElement('div');
        title.className = 'drag-handle';
        title.textContent = "Bullet Force - Mod Menu";
        Object.assign(title.style, {
            fontSize: '16px', // Smaller font size
            fontWeight: '900', marginBottom: '12px', borderBottom: '1px solid #374151', paddingBottom: '6px', cursor: 'move',
            backgroundImage: 'linear-gradient(to right,#e81919,#f7ff00,#40ff00,#00fff2,#0015ff,#c300ff,#e81919)',
            backgroundSize: '400% 100%', color: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'rainbow-flow 6s ease infinite'
        });
        container.appendChild(title);

        // --- CROSSHAIR ROW with color icon + label + ON/OFF button (but clicking label toggles) ---
        const crosshairRow = document.createElement('div');
        Object.assign(crosshairRow.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 0', borderBottom: '1px dotted #374151', margin: '0', cursor: 'pointer'
        });
        // Left: color icon (button)
        const colorIconBtn = document.createElement('button');
        colorIconBtn.type = 'button';
        colorIconBtn.title = 'Change crosshair color, size & offset';
        colorIconBtn.style.border = 'none';
        colorIconBtn.style.background = 'transparent';
        colorIconBtn.style.padding = '0';
        colorIconBtn.style.marginRight = '8px';
        colorIconBtn.style.cursor = 'pointer';
        // color dot element inside
        const colorIconDot = document.createElement('span');
        colorIconDot.className = 'color-dot';
        colorIconDot.style.background = savedDotColor;
        colorIconBtn.appendChild(colorIconDot);

        // Label area
        const label = document.createElement('div');
        label.textContent = 'Simple Crosshair Dot';
        label.style.flex = '1';
        label.style.fontWeight = '700';
        label.style.color = '#fff';
        label.style.userSelect = 'none';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';

        // Place color icon (inline with label) to the left of the label text visually
        const labelWrapper = document.createElement('div');
        labelWrapper.style.display = 'flex';
        labelWrapper.style.alignItems = 'center';
        labelWrapper.appendChild(colorIconBtn);
        labelWrapper.appendChild(label);

        // ON/OFF button (kept for clarity but clicking label toggles)
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer', color: 'white', fontWeight: '700',
            minWidth: '60px', transition: 'all 0.15s ease'
        });
        function updateToggleButton(isOn) {
            btn.textContent = isOn ?
            'ON' : 'OFF';
            const bg = isOn ? '#22c55e' : '#ef4444';
            btn.style.background = bg;
            btn.style.boxShadow = isOn ?
            `0 0 8px ${bg}50` : 'none';
        }
        updateToggleButton(crosshairOn);
        // Click behavior: clicking labelWrapper toggles crosshair ON/OFF (main interface)
        labelWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            crosshairOn = !crosshairOn;
            updateToggleButton(crosshairOn);
            toggleCrosshair(crosshairOn);
        });
        // clicking the small ON/OFF does same (kept for user preference)
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            crosshairOn = !crosshairOn;
            updateToggleButton(crosshairOn);
            toggleCrosshair(crosshairOn);
        });
        crosshairRow.appendChild(labelWrapper);
        crosshairRow.appendChild(btn);
        container.appendChild(crosshairRow);

        // --- Social Buttons (YouTube + Discord) - restored per request ---
        const socialSection = document.createElement('div');
        Object.assign(socialSection.style, {
            display: 'flex',
            gap: '8px',
            padding: '10px 0 6px 0',
            borderBottom: '1px dotted #374151',
            marginBottom: '10px'
        });
        // YouTube
        const youtubeBtn = document.createElement('button');
        youtubeBtn.textContent = 'YouTube 🚀';
        youtubeBtn.className = 'social-button';
        Object.assign(youtubeBtn.style, { background: '#ff0000' });
        youtubeBtn.onclick = () => window.open('https://www.youtube.com/@ClearBlueSky420', '_blank');
        youtubeBtn.onmouseover = () => youtubeBtn.style.transform = 'scale(1.03)';
        youtubeBtn.onmouseout = () => youtubeBtn.style.transform = 'scale(1)';
        socialSection.appendChild(youtubeBtn);

        // Discord (copy)
        const discordBtn = document.createElement('button');
        discordBtn.textContent = 'Copy Discord 🫂';
        discordBtn.className = 'social-button';
        const discordName = 'japan1z';
        Object.assign(discordBtn.style, { background: '#5865f2' });
        discordBtn.onclick = () => {
            // Using document.execCommand('copy') as navigator.clipboard might fail in an iframe
            const tempInput = document.createElement('textarea');
            tempInput.value = discordName;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            const originalText = discordBtn.textContent;
            discordBtn.textContent = 'COPIED!';
            discordBtn.style.background = '#22c55e';
            setTimeout(() => {
                discordBtn.textContent = originalText;
                discordBtn.style.background = '#5865f2';
            }, 1000);
        };
        discordBtn.onmouseover = () => discordBtn.style.transform = 'scale(1.03)';
        discordBtn.onmouseout = () => discordBtn.style.transform = 'scale(1)';
        socialSection.appendChild(discordBtn);

        container.appendChild(socialSection);
        // --- Footer with Hide & Close ---
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            paddingTop: '0', display: 'flex', justifyContent: 'space-between', gap: '8px', flexDirection: 'column'
        });
        const message = document.createElement('p');
        message.textContent = 'ClearBlueSky420';
        Object.assign(message.style, {
            fontSize: '11px', color: '#FFD700', fontWeight: '600', textAlign: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dotted #374151'
        });
        footer.appendChild(message);

        const info = document.createElement('small');
        info.textContent = 'Working as of 3:22 PM 10/16/2025';
        info.style.opacity = '0.7';

        const buttonGroup = document.createElement('div');
        Object.assign(buttonGroup.style, { display: 'flex', gap: '6px', justifyContent: 'flex-end' });

        // Hide (only hide the menu)
        const hideButton = document.createElement('button');
        hideButton.textContent = 'Hide';
        Object.assign(hideButton.style, {
            padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#374151', color: 'white', fontWeight: '700', flexShrink: '0', fontSize: '12px'
        });
        hideButton.addEventListener('click', () => {
            container.style.display = 'none';
        });
        buttonGroup.appendChild(hideButton);

        // Close (hide both)
        const close = document.createElement('button');
        close.textContent = 'Close Menu';
        Object.assign(close.style, {
            padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: '#ef4444', color: 'white', fontWeight: '700', flexShrink: '0', fontSize: '12px'
        });
        close.addEventListener('click', () => {
            container.style.display = 'none';
            launcher.style.display = 'none';
            // also hide modal if open
            const modal = document.getElementById('bf-dot-modal');
            // IMPORTANT: If modal is open, we need to save the current preview values before closing, as per new auto-apply logic.

            if (modal && modal.style.display === 'flex') {
                updatePreview(true); // Save current preview state to LS and global vars
            }
            if (modal) modal.style.display = 'none';
        });
        buttonGroup.appendChild(close);

        footer.appendChild(info);
        footer.appendChild(buttonGroup);
        container.appendChild(footer);

        // append to document
        document.body.appendChild(container);
        // ==========================
        //  DOT COLOR & SIZE MODAL (Auto-Apply)
        // ==========================
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'bf-dot-modal';
        // !!! UPDATED HTML STRUCTURE: Added ID to modal-card and added drag-handle-modal !!!
        modalOverlay.innerHTML = `
<div class="modal-card" role="dialog" aria-modal="true" id="bf-dot-modal-card">
  <button class="close-btn" id="bf-modal-close-x" aria-label="Close settings modal">X</button>
  <div class="drag-handle-modal" id="bf-modal-drag-handle">DOT SETTINGS</div>

  <div style="text-align:center;">
    <div class="preview-dot" id="bf-preview-dot"></div>
  </div>

  <div class="setting-row">
    <label for="bf-dot-size-range">DOT SIZE</label>
    <div class="range-row" style="margin-top:6px;">
      <input id="bf-dot-size-range" type="range" min="4" max="48" value="${savedDotSize}">
      <div id="bf-dot-size-value" style="width:30px; text-align:right; font-weight:700; color:#2befff;">${savedDotSize}</div>
    </div>
  </div>

  <div class="setting-row">
    <label for="bf-dot-offset-range">VERTICAL OFFSET</label>

    <div class="range-row" style="margin-top:6px;">
      <input id="bf-dot-offset-range" type="range" min="-100" max="100" value="${savedDotOffset}">
      <div id="bf-dot-offset-value" style="width:30px;
text-align:right; font-weight:700; color:#2befff;">${savedDotOffset}</div>
    </div>
  </div>

  <div style="margin-bottom: 5px;">
    <label style="display:block;">COLOR SWATCHES</label>
    <div class="color-grid" id="bf-color-list"></div>
  </div>

  <div class="modal-actions">
    <button class="btn ghost" id="bf-dot-reset" style="flex-grow:0;
min-width: 100px;">RESET</button>
  </div>
</div>
`;
        document.body.appendChild(modalOverlay);

        // populate color list (LOGIC CHANGED FOR SWATCH GRID)
        const colorListEl = modalOverlay.querySelector('#bf-color-list');
        COLORS.forEach(c => {
            const item = document.createElement('div');
            item.className = 'swatch-item'; // New class name for swatch
            item.dataset.hex = c.hex;

            item.title = c.name; // Tooltip on hover
            item.style.background = c.hex;
            item.style.borderColor = c.hex + '60'; // Subtle border based on color

            item.addEventListener('click', () => {
                // set preview color

                previewHex = c.hex;
                // highlight selection visually
                // remove existing highlight and add new one
                modalOverlay.querySelectorAll('.swatch-item').forEach(ci => ci.classList.remove('selected'));
                item.classList.add('selected');
                updatePreview(true); // AUTO-APPLY: Apply and save immediately
            });

            colorListEl.appendChild(item);
        });

        // modal controls and state
        let previewHex = savedDotColor;
        let previewSize = savedDotSize;
        let previewOffset = DOT_OFFSET; // Use the globally loaded DOT_OFFSET value

        const previewDot = modalOverlay.querySelector('#bf-preview-dot');
        const sizeRange = modalOverlay.querySelector('#bf-dot-size-range');
        const sizeValueLabel = modalOverlay.querySelector('#bf-dot-size-value');

        // New elements
        const offsetRange = modalOverlay.querySelector('#bf-dot-offset-range');
        const offsetValueLabel = modalOverlay.querySelector('#bf-dot-offset-value');
        const btnReset = modalOverlay.querySelector('#bf-dot-reset');
        const btnCloseX = modalOverlay.querySelector('#bf-modal-close-x');
        // Get the new X button
        const modalCard = modalOverlay.querySelector('#bf-dot-modal-card');
        // Get the modal card
        const modalDragHandle = modalOverlay.querySelector('#bf-modal-drag-handle');
        // Get the new drag handle


        function updatePreview(applyToCrosshair = false) {
            previewDot.style.background = previewHex;
            previewDot.style.width = previewSize + 'px';
            previewDot.style.height = previewSize + 'px';
            // Apply offset to preview dot (only visually inside modal)
            previewDot.style.transform = `translateY(${previewOffset}px)`;
            // Dynamic shadow for preview (makes it pop and reflect color)
            previewDot.style.boxShadow = `0 0 25px rgba(255,255,255,0.1), 0 0 10px ${previewHex}a0`;
            // update small icon in menu
            colorIconDot.style.background = previewHex;
            if (applyToCrosshair) {
                // Save new settings to global state and localStorage
                savedDotColor = previewHex;
                savedDotSize = previewSize;
                DOT_OFFSET = previewOffset;

                writeLS(LS_DOT_COLOR, savedDotColor);
                writeLS(LS_DOT_SIZE, String(savedDotSize));
                writeLS(LS_DOT_OFFSET, String(DOT_OFFSET));
                // Save new offset

                // Apply to the actual crosshair element
                const dotEl = getDotElement();
                if (dotEl) applyCrosshairStyle(dotEl, savedDotColor, savedDotSize);
            }
        }

        // initialize preview
        updatePreview();
        // size range handler: AUTO-APPLY on input
        sizeRange.addEventListener('input', (e) => {
            previewSize = parseInt(e.target.value, 10);
            sizeValueLabel.textContent = previewSize;
            updatePreview(true); // AUTO-APPLY
        });
        // offset range handler: AUTO-APPLY on input
        offsetRange.addEventListener('input', (e) => {
            previewOffset = parseInt(e.target.value, 10);
            offsetValueLabel.textContent = previewOffset;
            updatePreview(true); // AUTO-APPLY
        });
        // open modal handler
        function openModal() {
            // set preview values to current saved
            previewHex = savedDotColor;
            previewSize = savedDotSize;
            previewOffset = DOT_OFFSET; // Use currently active global offset

            sizeRange.value = previewSize;
            sizeValueLabel.textContent = previewSize;

            offsetRange.value = previewOffset;
            offsetValueLabel.textContent = previewOffset;

            // Load saved position or use the CSS default (centered by transform)
            let modalLeft = parseFloat(readLS(LS_MODAL_LEFT, '50'));
            let modalTop = parseFloat(readLS(LS_MODAL_TOP, '50'));

            if (modalLeft !== 50 || modalTop !== 50) {
                // Only apply if it has been saved before (to override CSS initial centering)
                modalCard.style.left = modalLeft + 'px';
                modalCard.style.top = modalTop + 'px';
                modalCard.style.transform = 'none'; // Disable initial centering transform
            } else {
                 // Use initial centering style if no saved position exists
                modalCard.style.left = '50%';
                modalCard.style.top = '50%';
                modalCard.style.transform = 'translate(-50%, -50%)';
            }


            // clear highlight then highlight current color if present (Updated for swatch grid)
            modalOverlay.querySelectorAll('.swatch-item').forEach(ci => {
                ci.classList.remove('selected');
                if (ci.dataset.hex.toLowerCase() === previewHex.toLowerCase()) ci.classList.add('selected');
            });
            updatePreview();
            modalOverlay.style.display = 'flex';
        }

        // closeModal now ALWAYS saves because changes were auto-applied during interaction
        function closeModal(saveChanges = true) {
            if (saveChanges) {
                 updatePreview(true);
            // If called via outer click/close, ensure final state is saved
            }
            modalOverlay.style.display = 'none';
        }

        // reset to default handler: AUTO-APPLY on click
        btnReset.addEventListener('click', () => {
            previewHex = DEFAULT_COLOR;
            previewSize = DEFAULT_SIZE;
            previewOffset = DEFAULT_OFFSET;

            sizeRange.value = previewSize;
            sizeValueLabel.textContent = previewSize;

            offsetRange.value = previewOffset;
            offsetValueLabel.textContent = previewOffset;

            // highlight default color
            modalOverlay.querySelectorAll('.swatch-item').forEach(ci => {
                ci.classList.remove('selected');
                if (ci.dataset.hex.toLowerCase() === DEFAULT_COLOR.toLowerCase()) ci.classList.add('selected');

            });

            updatePreview(true); // AUTO-APPLY: Apply and save immediately
        });
        // colorIconBtn opens modal
        colorIconBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });
        // Close modal using the 'X' button
        btnCloseX.addEventListener('click', () => {
            closeModal(true);
        });
        // close modal by clicking overlay (Now saves and closes)
        modalOverlay.addEventListener('click', (e) => {
            // Clicks on the transparent background will close the modal.
            if (e.target === modalOverlay) {
                closeModal(true); // Save current preview state to LS and close
            }

        });

        // ===========================
        //  MODAL DRAG LOGIC
        // ===========================
        let isModalDragging = false;
        let startXModal, startYModal, initialXModal, initialYModal;
        let hasMovedModal = false;

        modalDragHandle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isModalDragging = true;
            hasMovedModal = false;
            startXModal = e.clientX;
            startYModal = e.clientY;
            // Get position relative
            initialXModal = modalCard.offsetLeft;
            initialYModal = modalCard.offsetTop;

            // If the modal was in its initial centered state, we remove the transform before dragging
            modalCard.style.transform = 'none';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isModalDragging) return;

            const dx = e.clientX - startXModal;
            const dy = e.clientY - startYModal;

            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                hasMovedModal = true;

            }

            let newLeft = initialXModal + dx;
            let newTop = initialYModal + dy;

            // Basic boundary checks
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modalCard.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - modalCard.offsetHeight));

            modalCard.style.left =
            newLeft + 'px';
            modalCard.style.top = newTop + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (isModalDragging) {
                isModalDragging = false;

                // Save new position
                writeLS(LS_MODAL_LEFT, modalCard.offsetLeft);
                writeLS(LS_MODAL_TOP, modalCard.offsetTop);


            // Reset flag
                hasMovedModal = false;
            }
        });
        // ===========================
        //  END MODAL DRAG LOGIC
        // ===========================


        // ensure crosshair element uses saved settings if present
        if (crosshairOn) {
            const el = createCrosshairIfNeeded();
            applyCrosshairStyle(el, savedDotColor, savedDotSize);
        }

    }); // ready()

})();