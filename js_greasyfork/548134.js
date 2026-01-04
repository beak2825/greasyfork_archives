// ==UserScript==
// @name         TWINS Campus Portal - Auto Set Search Results to 200
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-select 200 items per page on TWINS campus portal
// @author       You
// @match        https://twins.tsukuba.ac.jp/campusweb/campusportal.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548134/TWINS%20Campus%20Portal%20-%20Auto%20Set%20Search%20Results%20to%20200.user.js
// @updateURL https://update.greasyfork.org/scripts/548134/TWINS%20Campus%20Portal%20-%20Auto%20Set%20Search%20Results%20to%20200.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('TWINS DEBUG: Script loaded and executing');
    console.log('TWINS DEBUG: Current URL:', window.location.href);
    console.log('TWINS DEBUG: Document ready state:', document.readyState);

    // ページ読み込み完了後に実行
    window.addEventListener('load', function() {
        console.log('TWINS DEBUG: Window load event fired');
        // 少し遅延を入れてDOM要素が確実に読み込まれるようにする
        setTimeout(function() {
            console.log('TWINS DEBUG: Timeout completed, calling setSearchResultsTo200');
            setSearchResultsTo200();
        }, 1000);
    });

    // DOMContentLoadedでも試す
    document.addEventListener('DOMContentLoaded', function() {
        console.log('TWINS DEBUG: DOMContentLoaded event fired');
        setTimeout(function() {
            console.log('TWINS DEBUG: DOMContentLoaded timeout completed');
            setSearchResultsTo200();
        }, 2000);
    });

    // MutationObserverでDOM変更を監視（動的にコンテンツが変更される場合に対応）
    const observer = new MutationObserver(function(mutations) {
        console.log('TWINS DEBUG: MutationObserver triggered');
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                setSearchResultsTo200();
            }
        });
    });

    // body全体を監視開始
    if (document.body) {
        console.log('TWINS DEBUG: Setting up MutationObserver');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        console.log('TWINS DEBUG: document.body not ready, waiting...');
        setTimeout(function() {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500);
    }

    function setSearchResultsTo200() {
        console.log('TWINS DEBUG: setSearchResultsTo200() called');
        
        // 具体的なselect要素を探す（HTMLから判明したname属性）
        let targetSelect = document.querySelector('select[name="_displayCount"]');
        console.log('TWINS DEBUG: Found select[name="_displayCount"]:', targetSelect);
        
        // フォールバック：他の可能性も探す
        if (!targetSelect) {
            console.log('TWINS DEBUG: Primary selector failed, trying fallback selectors');
            const selectSelectors = [
                'select[name*="displayCount"]',
                'select[name*="pageSize"]',
                'select[name*="itemsPerPage"]'
            ];
            
            for (let selector of selectSelectors) {
                console.log('TWINS DEBUG: Trying selector:', selector);
                const elements = document.querySelectorAll(selector);
                console.log('TWINS DEBUG: Found elements:', elements.length);
                
                for (let element of elements) {
                    const options = element.querySelectorAll('option');
                    console.log('TWINS DEBUG: Element options:', Array.from(options).map(opt => ({value: opt.value, text: opt.textContent})));
                    
                    for (let option of options) {
                        if (option.value === '200' || option.textContent.includes('200')) {
                            targetSelect = element;
                            console.log('TWINS DEBUG: Found target select with 200 option');
                            break;
                        }
                    }
                    if (targetSelect) break;
                }
                if (targetSelect) break;
            }
        }

        // 全てのselect要素を調べてデバッグ情報を出力
        if (!targetSelect) {
            console.log('TWINS DEBUG: No target found, listing all select elements:');
            const allSelects = document.querySelectorAll('select');
            allSelects.forEach((select, index) => {
                console.log(`TWINS DEBUG: Select ${index}:`, {
                    name: select.name,
                    id: select.id,
                    className: select.className,
                    currentValue: select.value,
                    options: Array.from(select.options).map(opt => ({value: opt.value, text: opt.textContent}))
                });
            });
        }

        if (targetSelect) {
            console.log('TWINS DEBUG: Target select found:', {
                name: targetSelect.name,
                currentValue: targetSelect.value,
                options: Array.from(targetSelect.options).map(opt => ({value: opt.value, text: opt.textContent, selected: opt.selected}))
            });

            if (targetSelect.value !== '200') {
                console.log('TWINS DEBUG: Current value is not 200, attempting to change');
                
                // 200の値を持つoptionを探して選択
                const options = targetSelect.options;
                let found200 = false;
                
                for (let i = 0; i < options.length; i++) {
                    console.log(`TWINS DEBUG: Checking option ${i}:`, {value: options[i].value, text: options[i].textContent});
                    
                    if (options[i].value === '200') {
                        console.log('TWINS DEBUG: Found option with value 200, selecting it');
                        targetSelect.selectedIndex = i;
                        targetSelect.value = '200';
                        found200 = true;
                        
                        // changeイベントを発火
                        const changeEvent = new Event('change', { bubbles: true });
                        targetSelect.dispatchEvent(changeEvent);
                        
                        console.log('TWINS DEBUG: Change event dispatched');
                        console.log('TWINS DEBUG: New value:', targetSelect.value);
                        console.log('TWINS: Search results set to 200 items per page');
                        break;
                    }
                }
                
                if (!found200) {
                    console.log('TWINS DEBUG: No option with value "200" found');
                }
            } else {
                console.log('TWINS DEBUG: Value is already 200, no change needed');
            }
        } else {
            console.log('TWINS DEBUG: No target select element found');
        }
    }
})();