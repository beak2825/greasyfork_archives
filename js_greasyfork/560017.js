// ==UserScript==
// @name        Youtube seek buttons
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.1
// @author      Duki
// @description Add backward/forward buttons to the player bar
// @license     Unlicense
// @namespace   https://greasyfork.org/users/1412820
// @downloadURL https://update.greasyfork.org/scripts/560017/Youtube%20seek%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/560017/Youtube%20seek%20buttons.meta.js
// ==/UserScript==

const skips = [0, 1, 5, 10];

const style = document.createElement('style');
style.innerHTML = `
    #seek-button {
        margin-right: 10px;
        font-size: 30px;
        text-align: center;

        span {
            position: relative;
            top: -11px;
        }
    }

    #seek-button:hover {
        /* nested trick to select parent, see https://youtu.be/hiwvjsmD2iY?t=375 */
        :has(&) #seek-container {
            display: flex;
        }
    }

    #seek-container:hover {
        display: flex;
    }

    #seek-container {
        position: absolute;
        transform: translate(-26%, -100%);
        z-index : 9999;
        display: none;
        flex-flow: column-reverse nowrap;
        padding: 3px;
        background-color: #000b;
        border-radius: 20px;

        button {
            width: 40px;
            aspect-ratio: 1;
            margin: 3px;
            font-weight: bold;
            color: white;
            background-color: #fff2;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 0px 2px inset #fff3;

            &:hover {
                background-color: #fff4;
            }
        }

    }
`;
document.head.appendChild(style);

const insertAfter = ".ytp-time-display";


(function () {
    tryIni('.ytp-left-controls', '#seek-container', initialize, positionContainer);
})();


function tryIni(mustExist, shouldExist, iniCallback, repeatCallback) {
    setInterval(() => {
        if (document.querySelector(mustExist)) {
            if (!document.querySelector(shouldExist)) {
                iniCallback();
            } else {
                repeatCallback();
            }
        }
    }, 2000);
}


function initialize() {
    addContainer();
    skips.forEach(skipAmount => {
        addSkipBtn(skipAmount);
    });

    window.addEventListener('resize', positionContainer);
}


function seekVideo(skipAmount) {
    const video = document.querySelector("video");
    if (skipAmount == 0) {
        const isBackward = Object.is(skipAmount, -0); // "0 === -0" is true, "Object.is(0, -0)" isn't
        skipAmount = isBackward ? -1 * getFrameSkipAmount() : getFrameSkipAmount();
    }
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime) + skipAmount);
}


function getFrameSkipAmount() {
    const videoOptionItems = document.querySelectorAll('.ytp-menuitem-content');

    let framerate = 30;
    for (const item of videoOptionItems) {
        const match = item.textContent.match(/p(\d+)/);
        if (match) {
            framerate = parseInt(match[ 1 ]);
        }
    }

    return 1000 / framerate / 1000;
}


function addSkipBtn(skipAmount) {
    const container = document.getElementById('seek-container');
    const skipContainer = document.createElement('div');

    const backward = document.createElement('button');
    backward.classList.add("backward");
    backward.textContent = `-${skipAmount}`
    backward.addEventListener('click', () => {
        seekVideo(-skipAmount);
    })
    skipContainer.appendChild(backward);

    const forward = document.createElement('button');
    forward.classList.add("forward");
    forward.textContent = `+${skipAmount}`
    forward.addEventListener('click', () => {
        seekVideo(skipAmount);
    })
    skipContainer.appendChild(forward);

    container.appendChild(skipContainer);
}


function addContainer() {
    const button = document.createElement('div');
    button.id = 'seek-button';
    button.classList.add("ytp-play-button", "ytp-button");

    const span = document.createElement('span');
    span.textContent = "⤺";
    button.appendChild(span);

    document.querySelector(insertAfter).after(button);

    const container = document.createElement('div');
    container.id = 'seek-container';

    document.getElementById('movie_player').appendChild(container);

    positionContainer();
}


function positionContainer() {
    const button = document.getElementById('seek-button');
    const container = document.getElementById('seek-container');

    const isFullscreen = document.querySelector('ytd-app').hasAttribute('fullscreen');
    const isTheater = document.querySelector('.ytp-size-button').dataset.tooltipTitle.includes('Default');

    const topBarOffset = isFullscreen ? 0 : document.getElementById('container').offsetHeight;
    const sideBarOffset = isTheater || isFullscreen ? 0 : 16;

    const hoverFix = !isTheater && !isFullscreen ? -5 : 5;
    container.style.top = getAbsolutePosition(button).top - topBarOffset + hoverFix + 'px';
    container.style.left = getAbsolutePosition(button).left - sideBarOffset + 'px';
}


function getAbsolutePosition(element) {
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        right: rect.right + window.scrollX
    };
}