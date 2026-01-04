// ==UserScript==
// @name         BetterAzureDevOps
// @namespace    https://github.com/lavonzux/BetterAzureDevOps
// @version      1.0.0-beta
// @description  在Azure Dev Ops 工項頁面增加工具箱，改善頁面整體 UX。
// @author       Anthony.Mai
// @match        https://dev.azure.com/*/_workitems/edit*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/558405/BetterAzureDevOps.user.js
// @updateURL https://update.greasyfork.org/scripts/558405/BetterAzureDevOps.meta.js
// ==/UserScript==

// 工具盤預設打開
const TRAY_OPEN_BY_DEFAULT = true;

const THEME = Object.freeze({
    CORNER: { // 圓角效果為 calc(ROUND_CORNER * CORNER_RADIUS)
        ENABLE: 1,// 圓角(0:關 | 1:開)
        RADIUS: '1rem'// 圓角半徑
    },
    TRAY: {
        BG_COLOR: '#adfe', // 工具盤背景顏色
        TOGGLE_COLOR: '#f9a', // 工具箱開關按鈕顏色

        // 圓角效果為 calc(ROUND_CORNER * CORNER_RADIUS)
        ROUND_CORNER: 1, // 圓角(0:關 | 1:開)
        CORNER_RADIUS: '1rem' // 圓角半徑
    },
    TOOL_BUTTON: {
        TEXT_COLOR: 'white', // 工具箱按鈕文字顏色
        BG_COLOR: '#0078d4', // 工具箱按鈕背景顏色
        BG_HOVER_COLOR: '#005a9e', // 工具箱按鈕背景:hover顏色

        // 圓角效果為 calc(ROUND_CORNER * CORNER_RADIUS)
        ROUND_CORNER: 1, // 圓角(0:關 | 1:開)
        CORNER_RADIUS: '1rem' // 圓角半徑
    },
    COLLAPSE_BUTTON: {
        NOT_REACTED_GLYPH: '🔥', // 未回應評論的摺疊按鈕
        REACTED_GLYPH: '↕️', // 已回應評論的摺疊按鈕
    },
    SWITCH: {
        TRANSITION_DURATION: '0.2s', // 切換速度
        ON_BACKGROUND_COLOR: '#0078d4', // 開啟時背景顏色
        OFF_BACKGROUND_COLOR: '#aaaa', // 關閉時背景顏色
        LABEL_TEXT_COLOR: '#000', // Switch文字顏色
        LABEL_TEXT_SIZE: '1.1rem', // 標籤文字大小
    }
});

function createStyle () {
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --tray-width: 28rem;
            --tray-height: 18rem;
            --corner-size: 2rem;

            /* CSS variables for the toggle switch */
            --switch-width: 4rem;
            --switch-height: 2rem;
            --switch-transition: ${THEME.SWITCH.TRANSITION_DURATION};
            --knob-gap: 4px;
        }

        /* CSS classes for my tool tray */
        .my-tray {
            background-color: ${THEME.TRAY.BG_COLOR};
            position: absolute;
            bottom: 1rem;
            right: 1rem;

            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 3rem;
            gap: 0.25rem;

            border-radius: 0 1rem 1rem 1rem;
            padding: 0.5rem;
            transition: transform ease-in-out 0.4s;
            cursor: auto;
            width: var(--tray-width);
            height: var(--tray-height);

            border: 0px solid #333;
            overflow: hidden;
            transform-origin: bottom right;
            z-index: 1;
            box-sizing: border-box;
        }

        /* Tray collapsed state */
        .my-tray.my-tray-shrunk {
            overflow: hidden;
            width: var(--corner-size);
            height: var(--corner-size);
            animation: collapse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Tray expanded state */
        .my-tray.my-tray-expand {
            overflow: visible;
            border-radius: calc(${THEME.CORNER.ENABLE} * ${THEME.CORNER.RADIUS}) calc(${THEME.CORNER.ENABLE} * ${THEME.CORNER.RADIUS}) 0 calc(${THEME.CORNER.ENABLE} * ${THEME.CORNER.RADIUS});
            width: var(--tray-width);
            height: var(--tray-height);
            animation: expand 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Expand animation: Y-axis first, then X-axis */
        @keyframes expand {
          0% {
            width: var(--corner-size);
            height: var(--corner-size);
          }
          50% {
            width: var(--corner-size);
            height: var(--tray-height);
          }
          100% {
            width: var(--tray-width);
            height: var(--tray-height);
          }
        }

        /* Collapse animation: X-axis first, then Y-axis */
        @keyframes collapse {
          0% {
            width: var(--tray-width);
            height: var(--tray-height);
          }
          50% {
            width: var(--corner-size);
            height: var(--tray-height);
          }
          100% {
            width: var(--corner-size);
            height: var(--corner-size);
          }
        }


        /* CSS class for General tray item */
        .my-tray .tray-item {
          transition: transform 0.2s ease-in-out 0.4s;
          transform-origin: top left;
        }
        .my-tray.my-tray-shrunk .tray-item {
          transform: scale(0);
        }

        /* CSS class for different elements in the tray */
        .my-tray .tray-item.refresh-div {
          grid-column-start: 1;
          grid-column-end: 3;
        }
        .my-tray .tray-item.search-div {
          grid-column-start: 1;
          grid-column-end: 3;
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 0.25rem;
          transition: 0.3s;
        }
        .my-tray .tray-item.search-div:has(input.my-search-input:focus) {
          grid-template-columns: 4fr 0fr;
        }
        .my-tray .tray-item.search-div button {
          max-width: 9999px;
          transition: 300ms;
        }
        .my-tray .tray-item.search-div .my-tooltip:has(input.my-search-input:focus) + button {
          max-width: 0;
          padding: 0;
        }
        .my-tray .tray-item.switch-div {
          grid-column-start: 1;
          grid-column-end: 3;
          display: grid;
          grid-template-columns: repeat(3, 2fr 1fr);
          gap: 0.25rem;
          align-items: center;
          padding-right: 2rem;
        }



        .my-tool-button{
          width: 100%;
          height: 100%;
          padding: 6px 12px;
          font-size: 1rem;
          border: 0;
          border-radius: calc(${THEME.CORNER.ENABLE} * ${THEME.CORNER.RADIUS});
          color: ${THEME.TOOL_BUTTON.TEXT_COLOR};
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out 0.4s;
          transform-origin: top left;
          background-color: ${THEME.TOOL_BUTTON.BG_COLOR};
          white-space: nowrap;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .my-tool-button:hover {
          background-color: ${THEME.TOOL_BUTTON.BG_HOVER_COLOR};
        }

        .my-tray-shrunk .my-tool-button {
          transform: scale(0);
        }

        .my-tooltip{
          display: flex;
          align-items: center;
          justify-content: end;
          height: 100%;
        }
        .my-tooltip .my-tooltiptext {
          opacity: 0;
          visibility: hidden;
          width: calc(var(--tray-width) * 0.5);
          background-color: #000c;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: calc(var(--tray-height) + 1rem);
          left: 0;
          transform: translateX(calc(var(--tray-width) * 0.25));
          transition: opacity ease-in-out 0.1s;
        }
        .my-tooltip:not(:has(input.my-search-input:focus)):hover .my-tooltiptext {
          opacity: 1;
          visibility: visible;
        }

        /* CSS for the shrinking btn */
        .my-expand-button-div {
          position: sticky;
          top: 0.5rem;
          display: flex;
          justify-content: center;
        }
        .my-expand-button {
          border: none;
          background: none;
          font-size: 1.25rem;
          cursor: pointer;
        }

        /* CSS for shrinking */
        .my-shrinkable {
          transition: max-height 0.8s ease-in-out;
          max-height: 9999px;
          overflow: hidden;
        }
        .my-shrunk {
          max-height: 0px;
        }

        /* CSS for my searching tool */
        input.my-search-input {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 1rem;
          font-size: clamp(12px, 1.25rem, 24px);
          padding: 0;
          text-align: center;
        }

        .my-tray .my-tray-toggle {
            background-color: ${THEME.TRAY.TOGGLE_COLOR};
            position: absolute;
            width: var(--corner-size);
            height: var(--corner-size);
            bottom: 0;
            right: 0;
            border-radius: 0 1rem 1rem 1rem;
            cursor: pointer;
            z-index: 100;
            transition: border-radius ease-in-out 0.2s;
        }
        .my-tray-expand .my-tray-toggle {
            border-radius: 1rem 1rem 0 1rem;
        }
        .my-tray-shrunk .my-tooltip {
            transform: scale(0);
        }
        .my-tray div {
            transition: transform 0.4s ease-in-out 0.3s;
            transform-origin: top left;
        }

        .my-last-clicked {
          box-shadow: 0 0 1rem 0.5rem #009fffb0;
        }


        /* CSS for toggle switches */
        .my-switch {
          position: relative;
          display: inline-block;
          width: var(--switch-width);
          height: var(--switch-height);
        }

        .my-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .my-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: var(--switch-transition);
          border-radius: var(--switch-height);
        }

        .my-slider:before {
          position: absolute;
          content: "";
          height: calc(var(--switch-height) - 2* var(--knob-gap));
          width: calc(var(--switch-height) - 2* var(--knob-gap));
          left: var(--knob-gap);
          bottom: var(--knob-gap);
          background-color: white;
          transition: var(--switch-transition);
          border-radius: 50%;
        }

        input:checked + .my-slider {
          background-color: ${THEME.SWITCH.ON_BACKGROUND_COLOR};
        }
        input:not(:checked) + .my-slider {
          background-color: ${THEME.SWITCH.OFF_BACKGROUND_COLOR};
        }

        input:checked + .my-slider:before {
          transform: translateX(calc(var(--switch-width) - var(--switch-height)));
        }

        .my-sw-label {
          font-size: ${THEME.SWITCH.LABEL_TEXT_SIZE};
          color: ${THEME.SWITCH.LABEL_TEXT_COLOR};
          white-space: nowrap;
        }
    `;
    document.head.appendChild(style);
}

class InitConfig {
    /**
     * Create a config for initializers
     * @param {number} maxTry Max count before giving up
     * @param {number} tryInterval Retry interval in ms
     */
    constructor(maxTry = 6, tryInterval = 500) {
        this.maxTry = maxTry;
        this.tryInterval = tryInterval;
    }
}

class InitializableTool {
    constructor(
      element = null,
      eventListener = () => false,
      initState = false,
      initSuccessCallback = null,
      initFailCallback = null,
      initConfig = new InitConfig(),
    ) {
        this.element = element;
        this.eventListener = eventListener;
        this.initState = initState;
        this.initSuccessCallback = initSuccessCallback;
        this.initFailCallback = initFailCallback;
        this.initConfig = initConfig;
    }

    whenSuccess(res) {
        if (this.initSuccessCallback) {
            this.initSuccessCallback(this.element, res);
        } else {
            this.element.checked = res;
        }
    }
    whenFail(error) {
        console.warn(`Initialization failed`, this.element);
        console.warn(`Error message`, error);
        if (this.initFailCallback) {
            this.initFailCallback(this.element, error);
        } else {
            this.element.checked = false;
        }
    }
}

const Actions = {
    toggleTray(tray) {
        if (tray.classList.contains('my-tray-shrunk')) {
            tray.classList.remove('my-tray-shrunk');
            tray.classList.add('my-tray-expand');
            GM_setValue('SETTINGS', { ...SETTINGS, trayOpened: true });
            SETTINGS['trayOpened'] = true;
        } else {
            tray.classList.remove('my-tray-expand');
            tray.classList.add('my-tray-shrunk');
            GM_setValue('SETTINGS', { ...SETTINGS, trayOpened: false });
            SETTINGS['trayOpened'] = false;
        }
    },

    shrinkByCondition(commentCardsByTrueFalse) {
        for (const truthyCard of commentCardsByTrueFalse['true'] ?? []) {
            const shrinkableDivs = truthyCard.querySelectorAll('.my-shrinkable');
            shrinkableDivs.forEach(d => d.classList.add('my-shrunk'));
        }
        for (const falsyCard of commentCardsByTrueFalse['false'] ?? []) {
            const shrinkableDivs = falsyCard.querySelectorAll('.my-shrinkable');
            shrinkableDivs.forEach(d => d.classList.remove('my-shrunk'));
        }
    },

    /**
     * Find comment cards and group them into two groups by given predicate
     */
    findCommentCardsByPredicate(groupingPredicate = (_card) => true) {
        // If discussion section or comment cards are null, early return
        const discussionSection = document.querySelector('div.work-item-form-discussion div.work-item-form-collapsible-section-content');
        if (!discussionSection) return { 'true': [], 'false': [] };
        const commentCards = discussionSection.querySelectorAll('div.comment-item.displayed-comment');
        if (commentCards.length <= 0) return { 'true': [], 'false': [] };

        return {
            // Default empty arrays
            'true': [],
            'false': [],
            // Since Boolean is not a valid object key, converting to string
            ...Object.groupBy(commentCards, (card) => groupingPredicate(card).toString())
        };
    },

    refreshCommentCards(commentCards = [], reacted = true){
        commentCards.forEach(node=> {
            node.querySelector('div.my-expand-button-div')?.remove(); // Remove existing button if found

            let contentDivs = node.querySelector('div.comment-content').childNodes;

            // DevOps' editor sometimes wrap the description in another div
            if (contentDivs.length === 1 && contentDivs[0].localName === 'DIV') {
                contentDivs = contentDivs[0].childNodes;
            }

            const shrinkableDivs = [];
            let noFirstPureTextNode = true;
            for (const contentDiv of contentDivs) {
                if (noFirstPureTextNode && this.isPureTextElement(contentDiv)) {
                    noFirstPureTextNode = false;
                    continue;
                }
                contentDiv.classList.add('my-shrinkable');
                shrinkableDivs.push(contentDiv);
            }

            // Remove the first one if really no any pure text div
            if (noFirstPureTextNode) {
                const theFirst = shrinkableDivs.shift();
                theFirst.classList.remove('my-shrunk', 'my-shrinkable');
            }

            // Append the fold button
            const toggleButton = ElementCreator.createCommentCardFoldButton(reacted).cloneNode(true);
            toggleButton.addEventListener('click', (event) => this.toggleButtonCallback(shrinkableDivs, event));
            node.querySelector('div.comment-item-left').appendChild(toggleButton);
        });
    },

    // Functions for finding the first pure text div
    isPureTextElement(node) {
        return node.nodeType === Node.TEXT_NODE
          || node.nodeType === Node.ELEMENT_NODE
          && !node.querySelector('img')
          && node.innerHTML !== '<br>';
    },

    toggleButtonCallback(controlledDivs, event) {
        lastClickedComment?.classList.remove('my-last-clicked');
        lastClickedComment = event.target.parentElement.parentElement.parentElement;
        lastClickedComment?.classList.add('my-last-clicked');

        controlledDivs.forEach(div => {
            div.classList.toggle('my-shrunk');
        });

        const card = event.target.parentElement.parentElement.parentElement;
        this.scrollToCommentCard(card);
    },

    scrollToCommentCard(card) {
        const workItemContainer = document.querySelector('div.work-item-form-page-content.page-content.page-content-top');
        const offset = card.offsetTop - workItemContainer.offsetTop - 12;
        workItemContainer.scroll({top: offset, behavior: 'smooth'});
    }
};

const ElementCreator = {


    createTray() {
        const tray = document.createElement('div');
        tray.classList.add('my-tray', 'my-tray-shrunk');
        return tray;
    },

    createTrayToggle() {
        const trayToggle = document.createElement('div');
        trayToggle.classList.add('my-tray-toggle');
        trayToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            Actions.toggleTray(event.target.parentNode);
        });
        return trayToggle;
    },

    createRefreshButton() {
        const refreshButton = this.createToolButton(
            '🔃 更新摺疊按鈕狀態',
            function () {
                const groupByReacted = Actions.findCommentCardsByPredicate(CONSTANTS.GROUPING_PREDICATES.BY_REACTION_EXIST);
                Actions.refreshCommentCards(groupByReacted.true, true);
                Actions.refreshCommentCards(groupByReacted.false, false);
                Actions.shrinkByCondition(groupByReacted);
            }
        );
        const inTooltip = this.wrapIntoTooltip(
          refreshButton,
          '更新評論卡片中摺疊按鈕的狀態，初次載入頁面時建議等完全載入後再按'
        );
        return this.wrapIntoTrayItem(inTooltip, CONSTANTS.TRAY_ITEM_TYPE.REFRESH_DIV);
    },

    createExpandAllButton() {
        const expandAllBtn = this.createToolButton('📂 全部展開', () => {
            Actions.shrinkByCondition(
              Actions.findCommentCardsByPredicate(() => false)
            )
        });
        const inTooltip = this.wrapIntoTooltip(expandAllBtn, '展開全部評論卡片');
        return this.wrapIntoTrayItem(inTooltip);
    },

    createShrinkAllButton() {
        const shrinkAllBtn = this.createToolButton('📁 全部摺疊', () => {
            Actions.shrinkByCondition(Actions.findCommentCardsByPredicate())
        });
        const inTooltip = this.wrapIntoTooltip(shrinkAllBtn, '摺疊全部評論卡片');
        return this.wrapIntoTrayItem(inTooltip);
    },

    createExpandReactedButton() {
        const expandReactedBtn = this.createToolButton(
            '⏬ 開已回應',
            () => {
                const predicate = (card) => !(CONSTANTS.GROUPING_PREDICATES.BY_REACTION_EXIST(card));
                Actions.shrinkByCondition(
                  Actions.findCommentCardsByPredicate(predicate)
                );
            }
        );
        const inTooltip = this.wrapIntoTooltip(expandReactedBtn, '打開已反應的評論卡');
        return this.wrapIntoTrayItem(inTooltip);
    },

    createShrinkReactedButton() {
        const shrinkReactedBtn = this.createToolButton(
          '⏫ 關已回應',
          () => {
              const predicate = CONSTANTS.GROUPING_PREDICATES.BY_REACTION_EXIST;
              Actions.shrinkByCondition(Actions.findCommentCardsByPredicate(predicate));
          }
        );
        const inTooltip = this.wrapIntoTooltip(shrinkReactedBtn, '摺疊已反應的評論卡');
        return this.wrapIntoTrayItem(inTooltip);
    },

    createSearchTool() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '輸入欲搜尋的文字';
        searchInput.classList.add('my-search-input');
        const searchInputInTooltip = this.wrapIntoTooltip(
          searchInput,
          '輸入欲搜尋的文字，會展開所有包含該文字的評論，並摺疊不包含該字串的評論。'
        );

        const searchBtn = this.createToolButton(
          '🔍 搜尋',
          () => {
              const targetString = document.querySelector('div.my-tray .tray-item.search-div input.my-search-input').value;
              const predicate = CONSTANTS.GROUPING_PREDICATES.BY_STRING_IGNORE_CASE(targetString);
              const groupedCommentCards = Actions.findCommentCardsByPredicate(predicate);
              Actions.shrinkByCondition(groupedCommentCards);
          }
        );

        return this.wrapIntoTrayItem([searchInputInTooltip, searchBtn], CONSTANTS.TRAY_ITEM_TYPE.SEARCH_DIV);
    },

    /**
     * Create a Promise that tries to call the initialize function of an InitializableTool object
     * @param {InitializableTool} initializableTool
     * @return {Promise<void>} A promise resolves to initState when initialize function executed successfully
     */
    createInitializer(initializableTool = new InitializableTool()) {
        return new Promise((resolve, reject) => {
            let tryCount = 1;
            const intervalId = setInterval(() => {
                const success = initializableTool.eventListener(initializableTool.initState);
                if (success) {
                    clearInterval(intervalId);
                    resolve(initializableTool.initState);
                } else if (tryCount >= initializableTool.initConfig.maxTry) {
                    clearInterval(intervalId);
                    reject();
                } else {
                    tryCount++;
                }
            }, initializableTool.initConfig.tryInterval);
        }).then((res) => {
            initializableTool.whenSuccess(res);
        }).catch(e => {
            initializableTool.whenFail(e);
        });
    },


    // Function for create the fold/expand button in comment cards
    createCommentCardFoldButton(reacted = true) {
        const btnDiv = document.createElement('div');
        btnDiv.classList.add('my-expand-button-div');

        const btn = document.createElement('button');
        btn.innerText = reacted ? THEME.COLLAPSE_BUTTON.REACTED_GLYPH : THEME.COLLAPSE_BUTTON.NOT_REACTED_GLYPH;
        btn.classList.add('my-expand-button');
        btnDiv.appendChild(btn);

        return btnDiv;
    },

    /**
     * Create an HTMLLabelElement that looks like a toggle
     * <ul>
     *     <li>`checked` property of the inner checkbox element is exposed for easy access</li>
     * </ul>
     * @param switchId DOM element ID
     * @param {function(boolean): boolean} switchEventCallback EventListener bound to checkbox's state, return true when successful
     * @return {HTMLLabelElement} An HTMLLabel containing a checkbox input
     */
    createSwitchElement(switchId, switchEventCallback) {
        const label = document.createElement('label');
        label.classList.add('my-switch');

        const checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener('change', (event) => switchEventCallback(event.target.checked));
        checkbox.setAttribute('id', switchId);

        const slider = document.createElement('div');
        slider.classList.add('my-slider');

        label.appendChild(checkbox);
        label.appendChild(slider);

        // expose checkbox's checked prop to parent node
        Object.defineProperty(label, 'checked', {
            set(value) {
                checkbox.checked = value;
            }
        });

        return label;
    },

    createSwitchLabel(switchId, labelText, labelTooltip) {
        const label = document.createElement('label');
        label.innerText = labelText;
        label.classList.add('my-sw-label');
        label.setAttribute('for', switchId);
        return this.wrapIntoTooltip(label, labelTooltip);
    },

    createToolButton(text, callback) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.type = 'button';
        btn.addEventListener('click', callback);
        btn.classList.add('my-tool-button');
        return btn;
    },

    wrapIntoTooltip(node, tooltipText) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.classList.add('my-tooltip');
        tooltipDiv.appendChild(node);

        const tooltipSpan = document.createElement('span');
        tooltipSpan.innerText = tooltipText;
        tooltipSpan.classList.add('my-tooltiptext');

        tooltipDiv.appendChild(tooltipSpan);
        return tooltipDiv;
    },

    wrapIntoTrayItem(node, type) {
        const trayItem = document.createElement('div');
        trayItem.classList.add('tray-item');
        if (type) trayItem.classList.add(type);

        if (Array.isArray(node)) {
            trayItem.append(...node);
        } else {
            trayItem.appendChild(node);
        }
        return trayItem;
    }
};

const toolsCallbacks = {
    switchWideLayout(setToWide = true) {
        const gridContainer = document.querySelector('div.work-item-grid.first-column-wide');
        const rightSection = document.querySelector('div.work-item-form-right');
        if (!gridContainer || !rightSection) return false;

        if (setToWide) {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = '5fr 2fr';
            document.querySelector('div.work-item-form-right').style.gridArea = '1/2/2/3';
        } else {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = null;
            document.querySelector('div.work-item-form-right').style.gridArea = null;
        }
        GM_setValue('SETTINGS', { ...SETTINGS, layoutSwitched: setToWide });
        SETTINGS['layoutSwitched'] = setToWide;
        return true;
    },

    switchTaskBar(foldTaskBar = true) {
        const workItemFormHeader = document.querySelector('div.work-item-form-header');
        if (!workItemFormHeader) return false;

        if (foldTaskBar) {
            // 1. add paddin-top-4 to the bar for symmetric padding
            workItemFormHeader.classList.add('padding-top-4');

            // 2. change flex-direction to 'row'
            workItemFormHeader.classList.remove('flex-column');
            workItemFormHeader.classList.add('flex-row');

            // 3. add flex-grow to the second child
            workItemFormHeader.children[1].classList.add('flex-grow');

            // 4. hide useless elements in the third child
            workItemFormHeader.childNodes[2].childNodes[1].classList.add('hidden');
            workItemFormHeader.childNodes[2].childNodes[2].classList.add('hidden');
            workItemFormHeader.childNodes[2].childNodes[3].classList.add('hidden');
        } else {
            // undo everything
            workItemFormHeader.classList.remove('padding-top-4');
            workItemFormHeader.classList.add('flex-column');
            workItemFormHeader.classList.remove('flex-row');
            workItemFormHeader.children[1].classList.remove('flex-grow');
            workItemFormHeader.childNodes[2].childNodes[1].classList.remove('hidden');
            workItemFormHeader.childNodes[2].childNodes[2].classList.remove('hidden');
            workItemFormHeader.childNodes[2].childNodes[3].classList.remove('hidden');
        }
        GM_setValue('SETTINGS', { ...SETTINGS, taskBarSwitched: foldTaskBar });
        SETTINGS['taskBarSwitched'] = foldTaskBar;
        return true;
    },

    locked(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
    },

    toggleDescLock(lock = true) {
        const editor = document.querySelector('div[id^="__bolt-Description"]');
        if (!editor) return false;
        if (lock) {
            //alert(`Editor is now locked........`);
            //editor.contentEditable = 'false';
            editor.addEventListener('mousedown', toolsCallbacks.locked, true); // Cannot use this, will be re-bound
            editor.addEventListener('mouseup', toolsCallbacks.locked, true);
            editor.style.cursor = 'not-allowed';
            editor.title = '編輯功能已鎖定，關閉工具盤右下的描述鎖定以解除。';
        } else {
            //alert(`Editor is UNLOCKED!!!`);
            //editor.contentEditable = 'true';
            editor.removeEventListener('mousedown', toolsCallbacks.locked, true);
            editor.removeEventListener('mouseup', toolsCallbacks.locked, true);
            editor.style.cursor = null;
            editor.removeAttribute('title');
        }
        return true;
    }

};

/**
 * Application constants
 * @namespace CONSTANTS
 * @readonly
 */
const CONSTANTS = Object.freeze({
    /**
     * Predicates for asserting if a comment card should be folded
     * @namespace CONSTANTS.GROUPING_PREDICATES
     * @memberOf CONSTANTS
     */
    GROUPING_PREDICATES: {
        /**
         * Return a comment cards filtering function that search for certain string, ignoring case
         * @memberOf CONSTANTS.GROUPING_PREDICATES
         * @param stringToFind
         * @return {function(*): boolean}
         */
        BY_STRING_IGNORE_CASE: (stringToFind) => (commentCard) => (!commentCard.textContent.toLowerCase().includes(stringToFind?.trim() || '')),
        /**
         * Tell if there is a reaction in a comment card by looking for `reaction-statusbar-placeholder`
         * @param {HTMLElement} commentCard
         * @return {boolean}
         */
        BY_REACTION_EXIST: (commentCard) => commentCard.querySelector('.reaction-statusbar-placeholder') !== null
    },
    TRAY_ITEM_TYPE: {
        REFRESH_DIV: 'refresh-div',
        SEARCH_DIV: 'search-div',
        SWITCH_DIV: 'switch-div'
    }
});

const SETTINGS = {
    trayOpened: TRAY_OPEN_BY_DEFAULT,
    layoutSwitched: false,
    taskBarSwitched: false,
    ...GM_getValue('SETTINGS')
};


function createObservingTrayCreator() {
    return new MutationObserver((_record, observer) => {

        // Disconnect the observer and early return if the tray was already there
        if (document.body.querySelector('div.my-tray')) {
            observer.disconnect();
            return;
        }

        const tray = ElementCreator.createTray();
        document.body.appendChild(tray);
        if (SETTINGS.trayOpened) Actions.toggleTray(tray);

        tray.appendChild(ElementCreator.createTrayToggle());
        tray.appendChild(ElementCreator.createRefreshButton());
        tray.appendChild(ElementCreator.createExpandAllButton());
        tray.appendChild(ElementCreator.createShrinkAllButton());
        tray.appendChild(ElementCreator.createExpandReactedButton());
        tray.appendChild(ElementCreator.createShrinkReactedButton());
        tray.appendChild(ElementCreator.createSearchTool());


        // Switch tools, wrap into IIFE just for easy folding
        const layout = (() => {
            const element = ElementCreator.createSwitchElement(
                'layoutSwitch',
                toolsCallbacks.switchWideLayout
            );
            const label = ElementCreator.createSwitchLabel(
                'layoutSwitch',
                '調整排版',
                '調整排版，將左側常用的Description及Discussion放大。'
            );
            const initializable = new InitializableTool(
                element,
                toolsCallbacks.switchWideLayout,
                SETTINGS.layoutSwitched,
            )
            const initializer = ElementCreator.createInitializer(initializable);
            return {element, label, initializer};
        })();
        const taskBar = (() => {
            const element = ElementCreator.createSwitchElement(
                'taskBarSwitch',
                toolsCallbacks.switchTaskBar
            );
            const label = ElementCreator.createSwitchLabel(
                'taskBarSwitch',
                '縮小標題',
                '調整task bar，將不常用的元素隱藏並縮成一行。'
            );
            const initializable = new InitializableTool(
                element,
                toolsCallbacks.switchTaskBar,
                SETTINGS.taskBarSwitched,
            )
            const initializer = ElementCreator.createInitializer(initializable);
            return {element, label, initializer};
        })();
        const desc = (() => {
            const element = ElementCreator.createSwitchElement('descLock', toolsCallbacks.toggleDescLock);
            const label = ElementCreator.createSwitchLabel(
                'descLock',
                '描述鎖定',
                '鎖定 description 的編輯器，避免不小心改動。'
            );
            const descIt = new InitializableTool(
                element,
                toolsCallbacks.toggleDescLock,
                true,
                function (element, res) {
                    element.checked = res;
                },
                function (element, _error) {
                    element.checked = false;
                },
            )
            const initializer = ElementCreator.createInitializer(descIt);
            return {element, label, initializer};
        })();

        tray.appendChild(ElementCreator.wrapIntoTrayItem(
            [layout.label, layout.element, taskBar.label, taskBar.element, desc.label, desc.element],
            CONSTANTS.TRAY_ITEM_TYPE.SWITCH_DIV
        ));


        // Automatically refresh comment cards
        const autoRefresh = new InitializableTool(
            // No need to reflect init result to any element
            null,
            // Directly defines the callback for now, refer to `createRefreshButton` (line 537) for original codes
            () => {
                const groupByReacted = Actions.findCommentCardsByPredicate(CONSTANTS.GROUPING_PREDICATES.BY_REACTION_EXIST);
                if (groupByReacted.true.length + groupByReacted.false.length === 0) {
                    return false;
                }

                Actions.refreshCommentCards(groupByReacted.true, true);
                Actions.refreshCommentCards(groupByReacted.false, false);
                Actions.shrinkByCondition(groupByReacted);

                return true;
            },
            // No initial state for now
            true,
            (_ele, _res) => {},
            (_ele, _err) => {},
            new InitConfig(5, 800)
        );
        ElementCreator.createInitializer(autoRefresh).then(r => r);
        // Finally disconnect
        observer.disconnect();
    });
}

function createBodyObserver() {
    return new MutationObserver((_record, _observer) => {
        const editor = document.querySelector('[id^=__bolt-Description] .work-item-form-control-wrapper .work-item-form-control-content .html-editor .focus-out-shell');
        if (!editor) return;

        editor.style.clipPath = 'border-box';
        // observer.disconnect(); // Not disconnecting, for page re-render
    });
}

let lastClickedComment = null;
(function() {
    'use strict';
    createStyle();

    const observer = createObservingTrayCreator();
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const bodyObserver = createBodyObserver();
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();