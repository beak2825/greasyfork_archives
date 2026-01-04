// ==UserScript==
// @name         日期調節與員工選擇
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  日期輸入數字微調、員工ID選單；自動確認window.alert
// @match        https://hris.cht.com.tw/Wams/Statistic/StatisticQuery*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553188/%E6%97%A5%E6%9C%9F%E8%AA%BF%E7%AF%80%E8%88%87%E5%93%A1%E5%B7%A5%E9%81%B8%E6%93%87.user.js
// @updateURL https://update.greasyfork.org/scripts/553188/%E6%97%A5%E6%9C%9F%E8%AA%BF%E7%AF%80%E8%88%87%E5%93%A1%E5%B7%A5%E9%81%B8%E6%93%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const options = [
        { value: "883256", text: "劉冠岐" },
        { value: "304144", text: "張竣傑" },
        { value: "837794", text: "杜致恩" },
        { value: "837750", text: "鍾昱賦" },
        { value: "893282", text: "劉信男" },
        { value: "911841", text: "卓冠融" },
        { value: "916879", text: "蘇欣宏" },
        { value: "917021", text: "葉哲銘" },
        { value: "077503", text: "陳俊榮" },
    ];

    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    function autoConfirmAlert() {
        const originalAlert = window.alert;
        window.alert = function(message) {
            const alertWindow = window.open('', '_blank', 'width=1,height=1,left=-1000,top=-1000');
            if (alertWindow) {
                alertWindow.document.write(`
                    <html><head><title></title></head><body style="display:none;">
                        <script>
                            window.alert = function() {};
                            setTimeout(() => {
                                window.close();
                            }, 50);
                        </script>
                    </body></html>
                `);
                alertWindow.document.close();
            }

            setTimeout(() => {
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                const escEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                });

                window.dispatchEvent(enterEvent);
                window.dispatchEvent(escEvent);

                if (originalAlert) {
                    originalAlert.call(window, message);
                }
            }, 0);
        };

        window.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === 'Escape') {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'DIALOG' ||
                    activeElement.closest('.modal') ||
                    activeElement.id.includes('alert'))) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);
    }

    function autoConfirmModal() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && (node.id === 'AlertModal' || node.classList?.contains('modal'))) {
                            setTimeout(() => {
                                const modal = document.getElementById('AlertModal') || document.querySelector('.modal.fade.in');
                                if (modal) {
                                    modal.style.display = 'none';
                                    modal.style.visibility = 'hidden';
                                    modal.classList.remove('in', 'show');
                                    modal.setAttribute('aria-hidden', 'true');
                                }

                                const confirmBtn = document.querySelector('.bs-ok, .btn-primary[data-dismiss="modal"], .modal-footer .btn, .modal-footer button');
                                if (confirmBtn) {
                                    confirmBtn.click();
                                }
                            }, 10);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const styleObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    if (target.id === 'AlertModal' || target.classList?.contains('modal')) {
                        if (target.style.display === 'block' || target.classList.contains('in') || target.classList.contains('show')) {
                            setTimeout(() => {
                                target.style.display = 'none';
                                target.style.visibility = 'hidden';
                                target.classList.remove('in', 'show');
                                target.setAttribute('aria-hidden', 'true');

                                const confirmBtn = document.querySelector('.bs-ok, .btn-primary[data-dismiss="modal"], .modal-footer .btn, .modal-footer button');
                                if (confirmBtn) {
                                    confirmBtn.click();
                                }
                            }, 10);
                        }
                    }
                }
            });
        });

        const alertModal = document.getElementById('AlertModal');
        if (alertModal) {
            styleObserver.observe(alertModal, {
                attributes: true,
                attributeFilter: ['style', 'class', 'aria-hidden']
            });
        } else {
            styleObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        setTimeout(() => {
            const existingModal = document.getElementById('AlertModal');
            if (existingModal) {
                existingModal.style.display = 'none';
                existingModal.style.visibility = 'hidden';
                existingModal.classList.remove('in', 'show');
                existingModal.setAttribute('aria-hidden', 'true');
            }

            const allModals = document.querySelectorAll('.modal');
            allModals.forEach(modal => {
                if (modal.style.display === 'block' || modal.classList.contains('in')) {
                    modal.style.display = 'none';
                    modal.style.visibility = 'hidden';
                    modal.classList.remove('in', 'show');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        }, 0);
    }

    function replaceToNumberInput() {
        const inputs = [
            'Content_Main_TextBoxDateTime1_txtSYear',
            'Content_Main_TextBoxDateTime1_txtSMonth',
            'Content_Main_TextBoxDateTime1_txtSDay',
            'Content_Main_TextBoxDateTime1_txtEYear',
            'Content_Main_TextBoxDateTime1_txtEMonth',
            'Content_Main_TextBoxDateTime1_txtEDay'
        ];

        inputs.forEach(id => {
            const targetInput = document.getElementById(id);
            if (!targetInput || targetInput.type === 'number') return;

            const newInput = document.createElement('input');
            newInput.type = 'number';
            newInput.id = targetInput.id;
            newInput.name = targetInput.name;
            newInput.value = targetInput.value || '1';
            newInput.className = targetInput.className;
            newInput.maxLength = targetInput.maxLength;

            if (id.includes('Year')) {
                newInput.min = '1';
                newInput.max = '999';
            } else if (id.includes('Month')) {
                newInput.min = '1';
                newInput.max = '12';
            } else {
                newInput.min = '1';
                newInput.max = '31';
                newInput.step = '1';
            }

            targetInput.parentNode.replaceChild(newInput, targetInput);
        });
    }

    function replaceInputWithSelect() {
        const input = document.getElementById('Content_Main_txtEmpID');
        if (!input) return;

        const select = document.createElement('select');
        select.id = input.id;
        select.name = input.name;
        select.className = input.className;
        if (input.style.width) {
            select.style.width = input.style.width;
        }

        const emptyOption = document.createElement('option');
        emptyOption.textContent = "請選擇";
        select.appendChild(emptyOption);

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });

        input.parentNode.replaceChild(select, input);

        select.addEventListener('change', function() {
            if (this.value) {
                const event = new Event('change', { bubbles: true });
                this.dispatchEvent(event);
            }
        });
    }

    function preventButtonReload() {
        const buttons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const form = this.closest('form');
                if (form && !form.checkValidity()) {
                    e.preventDefault();
                    return false;
                }

                const empSelect = document.getElementById('Content_Main_txtEmpID');
                if (empSelect && !empSelect.value) {
                    e.preventDefault();
                    return false;
                }

                return true;
            });
        });
    }

    function init() {
        autoConfirmAlert();
        autoConfirmModal();

        replaceInputWithSelect();
        waitForElement('#Content_Main_TextBoxDateTime1_txtSYear', replaceToNumberInput);
        setTimeout(preventButtonReload, 500);

        const observer = new MutationObserver(function(mutations) {
            let shouldReinit = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.id === 'Content_Main_txtEmpID' ||
                                node.id === 'Content_Main_TextBoxDateTime1_txtSYear' ||
                                node.querySelector('input[type="submit"], button[type="submit"]')) {
                                shouldReinit = true;
                            }
                        }
                    });
                }
            });
            if (shouldReinit) {
                setTimeout(() => {
                    replaceInputWithSelect();
                    replaceToNumberInput();
                    preventButtonReload();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();