// ==UserScript==
// @name         B站视频缩放/移动
// @namespace    https://www.bilitools.top/
// @version      1.0
// @description  针对B站的浏览器脚本，能够自由调节播放器中的画面
// @author       DBsan
// @license      MIT
// @supportURL   https://github.com/dbsan2333/bilibili-drag
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @require      https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @downloadURL https://update.greasyfork.org/scripts/549406/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE%E7%A7%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549406/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE%E7%A7%BB%E5%8A%A8.meta.js
// ==/UserScript==

GM_addStyle(`
    .bilidrag-restore-button{
        color: #fff;
        font-size: 1.4em;
        position: absolute;
        bottom: 120px;
        left: 20px;
        border: none;
        border-radius: 5px;
        background-color: #6669;
        padding: 0.6em 0.8em;
        cursor: pointer;
        transition: all 0.2s
    }
    .bilidrag-restore-button:hover{
        background-color: #666c;
    }
    .bpx-player-container[data-ctrl-hidden='true'] .bilidrag-restore-button{
        opacity: 0;
    }
`);

const transform = {
    // 画面变形参数
    scale: 1, // 缩放系数，1为100%
    translateX: 0, // 水平位移，以px为单位
    translateY: 0, // 垂直位移，以px为单位

    getValue() {
        // 生成style.transform的值
        return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`
    },
    update(element) {
        // 更新画面
        element.style.transform = this.getValue()
    },
    restore(element) {
        // 还原画面
        this.scale = 1
        this.translateX = 0
        this.translateY = 0
        this.update(element)
    },
    isOriginal() {
        return this.scale === 1 && this.translateX === 0 && this.translateY === 0
    }
};


main()
async function main() {
    /** @type {[HTMLElement,HTMLVideoElement]} */
    const [playerElement, videoWrapElement, videoElement] = await elmGetter.get(['#bilibili-player .bpx-player-video-area', '#bilibili-player .bpx-player-video-wrap', '#bilibili-player video'])
    videoElement.style.transition = 'all 0.3s'

    // “还原画面”按钮
    const restoreButtonElement = document.createElement('button')
    restoreButtonElement.innerText = '还原画面'
    restoreButtonElement.style.display = 'none'
    restoreButtonElement.className = 'bilidrag-restore-button'
    restoreButtonElement.onclick = function () {
        transform.restore(videoElement)
        this.style.display = 'none'
    }
    playerElement.appendChild(restoreButtonElement)

    // 鼠标滚轮缩放
    videoWrapElement.addEventListener('wheel', (ev) => {
        if (ev.shiftKey) {
            ev.preventDefault()
            ev.stopPropagation()

            // 缩放比例
            if (ev.deltaY < 0) {
                // 放大
                if (transform.scale >= 2) {
                    transform.scale += 0.1
                } else if (transform.scale < 1) {
                    transform.scale += 0.025
                } else {
                    transform.scale += 0.05
                }
            } else if (ev.deltaY > 0) {
                // 缩小
                if (transform.scale <= 1) {
                    transform.scale = Math.max(transform.scale - 0.025, 0.1)
                } else if (transform.scale > 2) {
                    transform.scale -= 0.1
                } else {
                    transform.scale -= 0.05
                }
            }

            // 如果调整到原始大小，隐藏“还原画面”按钮
            if (transform.isOriginal()) {
                restoreButtonElement.style.display = 'none'
            } else {
                restoreButtonElement.style.display = 'block'
            }
            transform.update(videoElement)
        }
    });

    // 鼠标拖拽
    let isMouseDown = false // 鼠标是否按下
    videoWrapElement.addEventListener('mousedown', (ev) => {
        if (ev.button === 0 && ev.shiftKey) {
            videoElement.style.transition = 'none'
            videoWrapElement.style.cursor = 'grab'
            isMouseDown = true
            // 鼠标按下时阻止点击事件，防止与B站播放/暂停事件冲突
            videoWrapElement.addEventListener('click', stopPropagation)
        }
    })
    videoWrapElement.addEventListener('mouseup', (ev) => {
        isMouseDown = false
        videoElement.style.transition = 'all 0.3s'
        videoWrapElement.style.cursor = 'default'
        setTimeout(() => {
            // 鼠标松开时移除阻止点击事件的Listener（我没招了）
            videoWrapElement.removeEventListener('click', stopPropagation)
        }, 0);
    })
    videoWrapElement.addEventListener('mousemove', (ev) => {
        if (ev.shiftKey && isMouseDown) {
            transform.translateX += ev.movementX
            transform.translateY += ev.movementY

            transform.update(videoElement)
            restoreButtonElement.style.display = 'block'
        }
    })
}
function stopPropagation(ev) {
    ev.preventDefault()
    ev.stopPropagation()
}