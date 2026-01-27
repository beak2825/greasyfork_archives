// ==UserScript==
// @name        mai-notes++
// @namespace   Violentmonkey Scripts
// @match       https://mai-notes.com/player.html*
// @version     1.0
// @author      Dylan Dang
// @description 1/26/2026, 8:58:23 PM
// @require     https://unpkg.com/lighterhtml
// @require     https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564236/mai-notes%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/564236/mai-notes%2B%2B.meta.js
// ==/UserScript==

function afterHook(target, methodName, after) {
    const originalMethod = target[methodName];
    target[methodName] = function (...args) {
        const returnValue = originalMethod.apply(this, args);
        after.apply(this, [args, returnValue]);
        return returnValue;
    }
}

const scriptTagObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(async node => {
            if (node.tagName === "SCRIPT") {
                if (node.src.includes("/assets/player")) {
                    // Remove the module tag to make variables global
                    node.type = "";
                }
            }
        });
    });
});
scriptTagObserver.observe(document.documentElement, { childList: true, subtree: true });


async function ready() {
    return new Promise((resolve) => {
        let interval;
        function check() {
            if (!Wi || !Gi) return false;
            resolve({ player: Wi, audioManager: Gi });
            clearInterval(interval);
            return true;
        }
        if (check()) return;
        interval = setInterval(check, 30);
    });
}

const { html: { node: html } } = lighterhtml;

async function loadMaterialSymbolsFont() {
    return new Promise((resolve) => {
        document.head.appendChild(html`
        <link rel="stylesheet"
              onload=${resolve} 
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
        `);
    });
}

/**
 * Wait for an element to appear in the DOM.
 * @param {string} selector - The CSS selector to watch for.
 * @param {Node} parent - The container to watch (defaults to document).
 */
async function getElement(selector, parent = document) {
    return new Promise((resolve) => {
        const existingElement = parent.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }
        const observer = new MutationObserver((mutations) => {
            const target = parent.querySelector(selector);
            if (target) {
                resolve(target);
                observer.disconnect();
            }
        });
        observer.observe(parent === document ? document.documentElement : parent, {
            childList: true,
            subtree: true,
        });
    });
}

function handleFullscreenChange() {
    const canvas = document.getElementById("chartCanvas");
    if (document.fullscreenElement === canvas) {
        canvas.parentElement.style.maxWidth = "100%";
    } else {
        canvas.parentElement.removeAttribute("style");
    }
    window.dispatchEvent(new Event('resize'));
}

const fullScreenChangeEvents = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange'
];

fullScreenChangeEvents.forEach(eventType => {
    document.addEventListener(eventType, handleFullscreenChange);
});

function fullscreen() {
    const canvas = document.getElementById("chartCanvas");
    canvas.parentElement.style.maxWidth = "100%";
    if (canvas.requestFullScreen) {
        canvas.requestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    }
}
document.addEventListener('keydown', function (e) {
    const active = document.activeElement;
    const notEditing = !(active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable
    ));
    if (e.code === 'Space' && notEditing) {
        e.preventDefault();
        document.getElementById('playPauseButton')?.click();
    }

    if ((e.code === 'ArrowRight' || e.key === 'ArrowRight') && notEditing) {
        if (e.shiftKey) {
            e.preventDefault();
            document.getElementById('measure5ForwardButton')?.click();
        } else if (e.ctrlKey) {
            e.preventDefault();
            document.getElementById('measureForwardButton')?.click();
        } else {
            e.preventDefault();
            document.getElementById('positionForwardButton')?.click();
        }
    }

    if ((e.code === 'ArrowLeft' || e.key === 'ArrowLeft') && notEditing) {
        if (e.shiftKey) {
            e.preventDefault();
            document.getElementById('measure5BackButton')?.click();
        } else if (e.ctrlKey) {
            e.preventDefault();
            document.getElementById('measureBackButton')?.click();
        } else {
            e.preventDefault();
            document.getElementById('positionBackButton')?.click();
        }
    }

    if ((e.code === 'KeyF' || e.key === 'f' || e.key === 'F') && notEditing) {
        e.preventDefault();
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        } else {
            fullscreen();
        }
    }

    if ((e.code === 'KeyR' || e.key === 'r' || e.key === 'R') && notEditing) {
        e.preventDefault();
        document.getElementById('restartButton')?.click();
    }
});

document.addEventListener("wheel", function (e) {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
    ) {
        if (e.deltaY < 0) {
            if (e.shiftKey) {
                document.getElementById('measure5BackButton')?.click();
            } else if (e.ctrlKey) {
                document.getElementById('measureBackButton')?.click();
            } else {
                document.getElementById('positionBackButton')?.click();
            }
        } else if (e.deltaY > 0) {
            if (e.shiftKey) {
                document.getElementById('measure5ForwardButton')?.click();
            } else if (e.ctrlKey) {
                document.getElementById('measureForwardButton')?.click();
            } else {
                document.getElementById('positionForwardButton')?.click();
            }
        }
    }
}, { passive: true });

async function reInitializeAudioManager() {
    const { audioManager } = await ready();
    audioManager.audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();
    const response = await fetch("https://sdez.zip/voices/system/jp/circle/fx/SE_GAME_ANSWER.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioManager.answerBuffer = await audioManager.audioContext.decodeAudioData(arrayBuffer);
    audioManager.initialized = true;
}

async function injectAudioUploadUI() {
    const preview = html`<audio class="w-full mt-3 rounded" controls style="display:none"
    onseeking=${() => {
            if (!Wi) return;
            const trueTime = Wi.Gt(Wi.timeline.te()) / 1000;
            if (Wi.playing && Math.abs(preview.currentTime - trueTime) > 0.01) {
                preview.currentTime = trueTime;
            }
        }}/>`;

    const info = html`<div class="mt-3 text-gray-500 text-sm" />`;


    function handleFile(file) {
        if (!file.type.startsWith('audio/')) {
            info.textContent = 'Please select an audio file.';
            preview.style.display = 'none';
            preview.src = '';
            return;
        }
        info.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.style.display = '';
    }

    let dragCounter = 0;
    (await getElement(".controls-section")).after(html`
        <h2 style="font-size: 1.3rem;">Sync Local Audio</h2>
        <div 
            id="mai-notes-upload-area"
            class="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg !p-8 !mt-4 bg-opacity-80 shadow transition-colors duration-200 hover:border-blue-500 select-none cursor-pointer transition-background-color"
            style="min-width:280px; max-width:800px; margin:auto;"
            onclick=${e => {
            const input = e.currentTarget.querySelector('input[type="file"]');
            if (e.target !== input) input.click();
        }}
            ondragenter=${e => {
            e.preventDefault();
            dragCounter++;
            e.currentTarget.classList.add('bg-blue-100');
        }}
            ondragover=${e => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-blue-100');
        }}
            ondragleave=${e => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter <= 0) {
                e.currentTarget.classList.remove('bg-blue-100');
                dragCounter = 0;
            }
        }}
            ondrop=${e => {
            e.preventDefault();
            dragCounter = 0;
            e.currentTarget.classList.remove('bg-blue-100');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFile(files[0]);
        }}
        >
            <div style="width:100%" class="flex flex-col items-center text-center">
                <span class="material-symbols-outlined text-5xl text-blue-400 mb-2">upload_file</span>
                <span class="font-semibold text-gray-700 mb-2">Drag & drop your audio file or <span class="text-blue-500">browse file</span></span>
                
                <input 
                    type="file" 
                    id="audio-upload-input" 
                    accept="audio/*"
                    class="hidden"
                    onchange=${e => {
            const files = e.target.files;
            if (files.length > 0) handleFile(files[0]);
        }}
                >
            </div>
            ${info}
            ${preview}
        </div>
    `);

    return preview;
}


async function loadSettings() {
    const { audioManager } = await ready();
    const answerSoundEnabledElement = document.getElementById("answerSoundEnabled");
    answerSoundEnabledElement.addEventListener("change", (e) => {
        e.preventDefault();
        GM_setValue("answerSoundEnabled", e.target.checked);
    });
    const answerSoundEnabled = GM_getValue("answerSoundEnabled", true);
    answerSoundEnabledElement.checked = answerSoundEnabled;
    audioManager.be(answerSoundEnabled);
}

async function main() {
    await loadMaterialSymbolsFont();
    const playButton = await getElement("#playPauseButton");
    playButton.after(html`<button id="restartButton" class="control-button material-symbols-outlined !leading-normal" onclick=${fullscreen}>crop_free</button>`);

    await loadSettings();
    const audio = await injectAudioUploadUI();
    await reInitializeAudioManager();
    const { player } = await ready();

    document.querySelector("#playbackSpeedSlider").addEventListener("input", (e) => {
        audio.playbackRate = e.target.value;
    });

    function setAudioCurrentTime() {
        audio.currentTime = Wi.playbackStartPositionMs / 1000;
    }

    const playerPrototype = Object.getPrototypeOf(player);

    afterHook(playerPrototype, "re", () => {
        setAudioCurrentTime();
        audio.play();
    });
    afterHook(playerPrototype, "oe", setAudioCurrentTime);


    afterHook(playerPrototype, "ae", () => {
        audio.pause();
    });

}

main();