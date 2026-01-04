// ==UserScript==
// @name         NovelAI Toggle Quick Start Gallery
// @name:ja      NovelAI Toggle Quick Start Gallery
// @namespace    https://github.com/NeviumX/NovelAI-Toggle-Quick-Start-Gallery
// @version      1.0.2
// @description 　Script to toggle the display of the Quick Start Gallery in NovelAI
// @description:ja NovelAIのクイックスタートギャラリーの表示/非表示を切り替えるスクリプト
// @author       Nevium7
// @copyright    Nevium7
// @license      MIT
// @match        https://novelai.net/*
// @icon         https://novelai.net/icons/novelai-round.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554499/NovelAI%20Toggle%20Quick%20Start%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/554499/NovelAI%20Toggle%20Quick%20Start%20Gallery.meta.js
// ==/UserScript==

GM_addStyle(`
    #nai-quickstart-gallery-switcher {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 10px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #22253f;
    }
    #nai-quickstart-gallery-switcher span.qsg-label {
        margin-right: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #C5C5C5;
        user-select: none;
    }
    .qsg-switch {
        position: relative;
        display: inline-block;
        width: 47px;
        height: 20px;
        flex-shrink: 0;
    }
    .qsg-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .qsg-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0e0f21;
        transition: .4s;
        border-radius: 3px;
    }
    .qsg-slider:before {
        position: absolute;
        content: '×';
        height: 16px;
        width: 26px;
        left: 2px;
        bottom: 2px;
        background-color: #22253f;
        transition: .4s;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: #91929f;
    }
    input:checked + .qsg-slider {
        background-color: #f5f3c2;
    }
    input:checked + .qsg-slider:before {
        background-color: #0e0f21;
        transform: translateX(17px);
        content: '✓';
        color: #f5f3c2;
        font-size: 10px;
    }
`);

const QUICK_START_GALLERY_VISIBILITY_TRG = 'naiQuickStartGalleryVisibility';

class UIManager {
    constructor(root) {
        this.switch = this.injectUI(root);
        this.isHidden = GM_getValue(QUICK_START_GALLERY_VISIBILITY_TRG, false);
        if (this.switch) {
            this.switch.querySelector('input[type="checkbox"]').checked = this.isHidden;
        }
        this.toggleVisibility(this.isHidden);
    }
    injectUI(root) {
        const switcherID = 'nai-quickstart-gallery-switcher';
        if (root.querySelector(`#${switcherID}`)) return;
        if (root) {
            const switcher = this.createSwitcher();
            switcher.id = switcherID;
            //root.insertAdjacentElement('afterend', switcher);
            root.prepend(switcher);
            return switcher;
        }
    }
    destroy() {
        if (!this.switch) return;
        this.toggleVisibility(false);
        if (this.switch.isConnected) this.switch.remove();
        this.switch = null;
    }
    createSwitcher() {
        const container = document.createElement('div');

        const labelSpan = document.createElement('span');
        labelSpan.textContent = 'Hide Quick Start Gallery';
        labelSpan.className = 'qsg-label';
        container.appendChild(labelSpan);

        const switchLabel = document.createElement('label');
        switchLabel.className = 'qsg-switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        
        const slider = document.createElement('span');
        slider.className = 'qsg-slider';

        input.addEventListener('change', (e) => {
            this.isHidden = e.target.checked;
            this.toggleVisibility(this.isHidden);
            GM_setValue(QUICK_START_GALLERY_VISIBILITY_TRG, this.isHidden);
        });

        switchLabel.appendChild(input);
        switchLabel.appendChild(slider);
        container.appendChild(switchLabel);

        return container;
    }
    toggleVisibility(isHidden) {
        if (!this.switch || !this.switch.parentElement) {
            return;
        }
        const rootElement = this.switch.parentElement;
        const displayStyle = isHidden ? 'none' : '';
        rootElement.querySelectorAll(':scope > div').forEach(childDiv => {
            if (childDiv.id !== 'nai-quickstart-gallery-switcher') {
                childDiv.style.display = displayStyle;
                //console.log(`Quick Start Gallery visibility set to: ${isHidden ? 'hidden' : 'visible'}`);
            }
        });
    }
}

class QuickStartGalleryObserver {
    constructor() {
        this.map = new Map();
        this.mo = new MutationObserver((muts) => this.handle(muts));
    }
    start() {
        this.mo.observe(document.documentElement,{childList:true,subtree:true});
    }
    attach(root) {
        const prev = this.map.get(root);
        if (prev && !prev.switch?.isConnected) {
            prev.destroy();
            this.map.delete(root);
        }
        if (!this.map.has(root)) {
            const ui = new UIManager(root);
            this.map.set(root, ui);
        }
        //console.log('Attached Quick Start Gallery switcher.');
    }
    detach(root) {
        const switcher = this.map.get(root);
        if (!switcher) return;
        switcher.destroy();
        this.map.delete(root);
        //console.log('Detached Quick Start Gallery switcher.');
    }
    handle(muts) {
        muts.forEach(m=> {
            m.addedNodes.forEach(n=> {
                if (n.nodeType !== 1) return;
                n.querySelectorAll?.('.quickstart-gallery').forEach(el=> this.attach(el));
                if(n.classList?.contains('quickstart-gallery')) this.attach(n);
            });
            m.removedNodes.forEach(n=> {
                if (n.nodeType !== 1) return;
                n.querySelectorAll?.('.quickstart-gallery').forEach(el=> this.detach(el));
                if(n.classList?.contains('quickstart-gallery')) this.detach(n);
            });
        });
    }
}

(function() {
    'use strict';
    const observer = new QuickStartGalleryObserver();
    observer.start();
})();