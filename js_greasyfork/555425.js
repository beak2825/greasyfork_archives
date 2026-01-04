// ==UserScript==
// @name         遊戲物品上架助手 - MAX按鈕
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  模擬真實用戶操作來設置數量，確保觸發所有網頁事件
// @author       You
// @match        https://sorceryntax3.onrender.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555425/%E9%81%8A%E6%88%B2%E7%89%A9%E5%93%81%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B%20-%20MAX%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/555425/%E9%81%8A%E6%88%B2%E7%89%A9%E5%93%81%E4%B8%8A%E6%9E%B6%E5%8A%A9%E6%89%8B%20-%20MAX%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;
    let currentDialog = null;
    let processing = false;

    function initialize() {
        //console.log('MAX按鈕插件初始化...');

        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(function(mutations) {
            if (processing) return;

            let hasDialogChange = false;

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && isListingDialog(node)) {
                            hasDialogChange = true;
                            break;
                        }
                    }
                }

                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'data-state' &&
                    mutation.target.getAttribute('data-state') === 'open') {
                    hasDialogChange = true;
                }
            });

            if (hasDialogChange) {
                clearTimeout(window.addMaxButtonTimeout);
                window.addMaxButtonTimeout = setTimeout(() => {
                    processDialogSafely();
                }, 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-state']
        });

        // 初始檢查
        setTimeout(processDialogSafely, 1500);
    }

    function isListingDialog(node) {
        return node.querySelector && (
            node.querySelector('.css-pcqfzb') !== null ||
            node.querySelector('input[type="number"][min][max]') !== null ||
            node.textContent && (node.textContent.includes('上架數量') || node.textContent.includes('單價'))
        );
    }

    function processDialogSafely() {
        if (processing) return;

        processing = true;
        try {
            processCurrentDialog();
        } catch (error) {
            console.error('處理對話框時出錯:', error);
        } finally {
            processing = false;
        }
    }

    function processCurrentDialog() {
        const openDialogs = document.querySelectorAll('[data-scope="dialog"][data-state="open"]');

        if (openDialogs.length === 0) {
            currentDialog = null;
            return;
        }

        const dialog = openDialogs[0];

        if (currentDialog === dialog) {
            if (!dialog.querySelector('.max-quantity-btn')) {
                addSingleMaxButton();
            }
            return;
        }

        currentDialog = dialog;
        //console.log('檢測到新上架對話框');

        removeAllMaxButtons();
        setTimeout(addSingleMaxButton, 100);
    }

    function addSingleMaxButton() {
        try {
            const quantityContainer = document.querySelector('.css-pcqfzb');
            if (!quantityContainer) return false;

            const existingButton = quantityContainer.parentNode.querySelector('.max-quantity-btn');
            if (existingButton) return true;

            const maxTextElement = quantityContainer.querySelector('p.css-5bpip0');
            if (!maxTextElement || !maxTextElement.textContent.includes('最多')) {
                return false;
            }

            const maxText = maxTextElement.textContent;
            const maxMatch = maxText.match(/最多\s*(\d+)\s*個/);
            if (!maxMatch || !maxMatch[1]) return false;

            const maxQuantity = parseInt(maxMatch[1]);
            if (isNaN(maxQuantity) || maxQuantity <= 0) return false;

            const inputContainer = quantityContainer.closest('.css-0');
            if (!inputContainer) return false;

            const input = inputContainer.querySelector('input[type="number"]');
            if (!input) return false;

            const maxButton = createMaxButton(input, maxQuantity);
            const inputWrapper = input.parentNode;
            if (inputWrapper) {
                inputWrapper.appendChild(maxButton);
                //console.log('MAX按鈕添加成功');
                return true;
            }

            return false;

        } catch (error) {
            console.error('添加MAX按鈕時出錯:', error);
            return false;
        }
    }

    function createMaxButton(input, maxQuantity) {
        const maxButton = document.createElement('button');
        maxButton.textContent = 'MAX';
        maxButton.className = 'max-quantity-btn';
        maxButton.type = 'button';

        Object.assign(maxButton.style, {
            marginLeft: '10px',
            padding: '6px 12px',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            outline: 'none',
            height: '32px',
            lineHeight: '1',
            minWidth: '50px'
        });

        maxButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#2c5282';
        });

        maxButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#3182ce';
        });

        // 修復點擊事件 - 模擬真實用戶操作
        maxButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                if (!document.body.contains(input)) {
                    removeAllMaxButtons();
                    addSingleMaxButton();
                    return;
                }

               // console.log('開始模擬用戶設置數量操作...');

                // 方法1: 完整的用戶操作模擬（推薦）
                simulateUserInput(input, maxQuantity);

                // 視覺反饋
                this.style.backgroundColor = '#38a169';
                setTimeout(() => {
                    this.style.backgroundColor = '#3182ce';
                }, 300);

            } catch (error) {
                console.error('MAX按鈕點擊錯誤:', error);
            }
        });

        return maxButton;
    }

    // 模擬真實用戶輸入操作
    function simulateUserInput(input, value) {
        // 確保輸入框獲得焦點
        input.focus();

        // 先清空當前值（模擬用戶刪除）
        input.select();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);

        // 觸發輸入事件
        triggerAllEvents(input, 'keydown', { key: 'Delete', code: 'Delete', keyCode: 46 });
        triggerAllEvents(input, 'input', { inputType: 'deleteContentBackward' });
        triggerAllEvents(input, 'keyup', { key: 'Delete', code: 'Delete', keyCode: 46 });

        // 短暫延遲模擬用戶輸入
        setTimeout(() => {
            // 設置新值
            input.value = value;

            // 觸發所有可能的輸入事件
            triggerAllEvents(input, 'keydown', { key: value.toString(), code: 'Digit' + value });
            triggerAllEvents(input, 'input', { inputType: 'insertText', data: value.toString() });
            triggerAllEvents(input, 'keyup', { key: value.toString(), code: 'Digit' + value });
            triggerAllEvents(input, 'change', {});

            // 觸發React可能監聽的事件
            triggerAllEvents(input, 'blur', {});
            triggerAllEvents(input, 'focus', {});

            // 特殊處理：觸發可能被監聽的自定義事件
            triggerCustomEvents(input);

            //console.log('數量設置完成:', value);

        }, 50);
    }

    // 觸發所有類型的輸入事件
    function triggerAllEvents(element, eventType, eventInit = {}) {
        try {
            // 觸發標準事件
            const event = new Event(eventType, {
                bubbles: true,
                cancelable: true
            });

            // 添加額外的屬性
            Object.assign(event, eventInit);

            element.dispatchEvent(event);

            // 對於input事件，也觸發React的合成事件
            if (eventType === 'input') {
                triggerReactSyntheticEvent(element, 'onInput', event);
                triggerReactSyntheticEvent(element, 'onChange', event);
            }

        } catch (error) {
            console.log('觸發事件時出錯:', eventType, error);
        }
    }

    // 嘗試觸發React合成事件
    function triggerReactSyntheticEvent(element, handlerName, originalEvent) {
        try {
            // 獲取React內部屬性
            const reactKey = Object.keys(element).find(key =>
                key.startsWith('__reactInternalInstance') ||
                key.startsWith('__reactFiber')
            );

            if (reactKey && element[reactKey]) {
                const reactInstance = element[reactKey];

                // 查找事件處理器
                const props = reactInstance.memoizedProps || {};
                if (props[handlerName]) {
                    // 創建合成事件對象
                    const syntheticEvent = {
                        ...originalEvent,
                        target: element,
                        currentTarget: element,
                        nativeEvent: originalEvent,
                        persist: () => {}
                    };

                    // 調用處理器
                    props[handlerName](syntheticEvent);
                }
            }
        } catch (error) {
            // 靜默失敗，這只是備用方法
        }
    }

    // 觸發可能被監聽的自定義事件
    function triggerCustomEvents(element) {
        const customEvents = [
            'valueChange',
            'quantityChange',
            'inputChange',
            'modelChange',
            'update:value'
        ];

        customEvents.forEach(eventName => {
            try {
                const event = new CustomEvent(eventName, {
                    bubbles: true,
                    detail: { value: element.value }
                });
                element.dispatchEvent(event);
            } catch (error) {
                // 忽略錯誤
            }
        });
    }

    // 備用方法：如果上述方法無效，使用更激進的事件觸發
    function triggerAggressiveEvents(input, value) {
        console.log('使用備用事件觸發方法...');

        // 方法2: 直接設置值並觸發所有可能的事件
        input.value = value;

        // 觸發事件列表
        const eventsToTrigger = [
            'input', 'change', 'keyup', 'keydown', 'blur', 'focus',
            'propertychange', 'DOMAttrModified', 'DOMCharacterDataModified'
        ];

        eventsToTrigger.forEach(eventType => {
            try {
                input.dispatchEvent(new Event(eventType, { bubbles: true }));
            } catch (error) {
                // 忽略錯誤
            }
        });

        // 方法3: 嘗試觸發jQuery事件（如果頁面使用jQuery）
        if (window.jQuery) {
            try {
                const $input = jQuery(input);
                $input.trigger('input');
                $input.trigger('change');
                $input.trigger('keyup');
            } catch (error) {
                console.log('jQuery事件觸發失敗:', error);
            }
        }

        // 方法4: 強制觸發所有屬性變化
        setTimeout(() => {
            if (input.oninput) input.oninput(new Event('input'));
            if (input.onchange) input.onchange(new Event('change'));
            if (input.onkeyup) input.onkeyup(new Event('keyup'));
        }, 100);
    }

    function removeAllMaxButtons() {
        const existingButtons = document.querySelectorAll('.max-quantity-btn');
        existingButtons.forEach(button => button.remove());
    }

    // 頁面加載
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

    if (window.maxButtonPluginUserSimulation) return;
    window.maxButtonPluginUserSimulation = true;

})();