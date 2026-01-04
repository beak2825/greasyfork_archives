// ==UserScript==
// @name         Instantly beat I'm Not a Robot game Neal.fun (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds buttons to skip to the end of the game with level selector and tracking. Discord: discord.gg/arVdGh76wj
// @author        01 dev
// @match        https://neal.fun/not-a-robot/*
// @grant        unsafeWindow
// @icon         https://neal.fun/favicons/not-a-robot.png
// @license      MIT
// @supportURL   https://discord.gg/arVdGh76wj
// @downloadURL https://update.greasyfork.org/scripts/558771/Instantly%20beat%20I%27m%20Not%20a%20Robot%20game%20Nealfun%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558771/Instantly%20beat%20I%27m%20Not%20a%20Robot%20game%20Nealfun%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper to set level and reload ---
    function setLevel(val) {
        try {
            unsafeWindow['not-a-robot-level'] = val;
            window['not-a-robot-level'] = val;
            localStorage.setItem('not-a-robot-level', String(val));
            console.log('not-a-robot-level ->', val);
        } catch (e) {
            console.warn('Failed to set level:', e);
        }
        location.reload();
    }

    // --- Container for all controls ---
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        cursor: move;
        user-select: none;
    `;
    document.body.appendChild(container);

    // --- Title Bar with Minimize Button ---
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(255,255,255,0.2);
    `;

    const title = document.createElement('div');
    title.textContent = '🤖 Robot Game Controls';
    title.style.cssText = `
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        flex: 1;
        text-align: center;
    `;

    const minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '−';
    minimizeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        color: #fff;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    minimizeBtn.addEventListener('mouseenter', () => {
        minimizeBtn.style.background = 'rgba(255,255,255,0.3)';
    });
    minimizeBtn.addEventListener('mouseleave', () => {
        minimizeBtn.style.background = 'rgba(255,255,255,0.2)';
    });

    titleBar.appendChild(title);
    titleBar.appendChild(minimizeBtn);
    container.appendChild(titleBar);

    // --- Credits Footer ---
    const credits = document.createElement('div');
    credits.innerHTML = `
        <div style="text-align: center; margin-top: 10px; padding-top: 10px; border-top: 2px solid rgba(255,255,255,0.2);">
            <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">by <strong style="color: #fff;">01 dev</strong></div>
            <a href="https://discord.gg/arVdGh76wj" target="_blank" style="
                color: #5865F2;
                text-decoration: none;
                font-size: 13px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s ease;
            " onmouseover="this.style.color='#7289DA'" onmouseout="this.style.color='#5865F2'">
                <svg width="16" height="16" viewBox="0 0 71 55" fill="currentColor">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                </svg>
                Discord Support
            </a>
        </div>
    `;
    container.appendChild(credits);

    // --- Level Display ---
    const levelDisplay = document.createElement('div');
    levelDisplay.style.cssText = `
        padding: 12px;
        font-size: 18px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 8px;
        text-align: center;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    `;

    function updateLevelDisplay() {
        const currentLevel = localStorage.getItem('not-a-robot-level') || '0';
        levelDisplay.textContent = `Current Level: ${currentLevel} / 47`;
    }
    updateLevelDisplay();
    container.appendChild(levelDisplay);

    // --- Button Row Container ---
    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 10px;
    `;
    container.appendChild(buttonRow);

    // --- Reset Button ---
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = `
        padding: 12px 20px;
        font-size: 16px;
        background: #dc3545;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        flex: 1;
        font-weight: bold;
    `;
    resetBtn.addEventListener('mouseenter', () => {
        resetBtn.style.background = '#c82333';
        resetBtn.style.transform = 'scale(1.05)';
    });
    resetBtn.addEventListener('mouseleave', () => {
        resetBtn.style.background = '#dc3545';
        resetBtn.style.transform = 'scale(1)';
    });
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset to level 0?')) {
            setLevel(0);
        }
    });
    buttonRow.appendChild(resetBtn);

    // --- End Game Button ---
    const endBtn = document.createElement('button');
    endBtn.textContent = 'End Game';
    endBtn.style.cssText = `
        padding: 12px 20px;
        font-size: 16px;
        background: #28a745;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        flex: 1;
        font-weight: bold;
    `;
    endBtn.addEventListener('mouseenter', () => {
        endBtn.style.background = '#218838';
        endBtn.style.transform = 'scale(1.05)';
    });
    endBtn.addEventListener('mouseleave', () => {
        endBtn.style.background = '#28a745';
        endBtn.style.transform = 'scale(1)';
    });
    endBtn.addEventListener('click', () => {
        setLevel(47);
    });
    buttonRow.appendChild(endBtn);

    // --- Custom Level Selector Row ---
    const selectorRow = document.createElement('div');
    selectorRow.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    `;
    container.appendChild(selectorRow);

    // Level Input
    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.min = '0';
    levelInput.max = '47';
    levelInput.placeholder = 'Level';
    levelInput.value = localStorage.getItem('not-a-robot-level') || '0';
    levelInput.style.cssText = `
        padding: 12px;
        font-size: 16px;
        width: 80px;
        border-radius: 8px;
        border: 2px solid #667eea;
        background: rgba(255,255,255,0.9);
        text-align: center;
        font-weight: bold;
    `;
    selectorRow.appendChild(levelInput);

    // Go Button
    const goBtn = document.createElement('button');
    goBtn.textContent = 'Go to Level';
    goBtn.style.cssText = `
        padding: 12px 20px;
        font-size: 16px;
        background: #17a2b8;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        flex: 1;
        font-weight: bold;
    `;
    goBtn.addEventListener('mouseenter', () => {
        goBtn.style.background = '#138496';
        goBtn.style.transform = 'scale(1.05)';
    });
    goBtn.addEventListener('mouseleave', () => {
        goBtn.style.background = '#17a2b8';
        goBtn.style.transform = 'scale(1)';
    });
    goBtn.addEventListener('click', () => {
        const val = parseInt(levelInput.value);
        if (!isNaN(val) && val >= 0 && val <= 47) {
            setLevel(val);
        } else {
            alert('Please enter a valid level between 0 and 47');
        }
    });
    selectorRow.appendChild(goBtn);

    // Allow Enter key in input
    levelInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goBtn.click();
        }
    });

    // --- Quick Level Buttons ---
    const quickLevelsRow = document.createElement('div');
    quickLevelsRow.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 8px;
        flex-wrap: wrap;
    `;
    container.appendChild(quickLevelsRow);

    const quickLevels = [0, 10, 20, 30, 40, 47];
    quickLevels.forEach(level => {
        const btn = document.createElement('button');
        btn.textContent = `L${level}`;
        btn.style.cssText = `
            padding: 8px 12px;
            font-size: 14px;
            background: #6c757d;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: bold;
            flex: 1;
            min-width: 50px;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#5a6268';
            btn.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#6c757d';
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', () => setLevel(level));
        quickLevelsRow.appendChild(btn);
    });

    // --- Draggable functionality ---
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    title.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - container.offsetLeft;
        initialY = e.clientY - container.offsetTop;
        isDragging = true;
        container.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = currentX + 'px';
            container.style.bottom = 'auto';
            container.style.top = currentY + 'px';
        }
    }

    function dragEnd() {
        isDragging = false;
        container.style.cursor = 'move';
    }

    // --- Skip all videos to their end ---
    const processedVideos = new WeakSet();

    function skipVideosToEnd() {
        document.querySelectorAll('video').forEach(v => {
            if (processedVideos.has(v)) return;
            processedVideos.add(v);

            if (v.readyState >= 1) {
                v.currentTime = v.duration;
                console.log('Skipped video to end:', v.src);
            } else {
                v.addEventListener('loadedmetadata', () => {
                    v.currentTime = v.duration;
                    console.log('Skipped video to end after metadata:', v.src);
                }, { once: true });
            }
        });
    }

    // Run once at start
    skipVideosToEnd();

    // Observe DOM for new videos
    const observer = new MutationObserver(() => skipVideosToEnd());
    observer.observe(document.body, { childList: true, subtree: true });

    // Update level display when storage changes
    window.addEventListener('storage', updateLevelDisplay);
})();