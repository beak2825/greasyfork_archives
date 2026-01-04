// ==UserScript==
// @name         swagger添加复制url和名称按钮
// @namespace    http://jarvisdong.cc/
// @version      0.7
// @description  复制 Swagger UI 页面的 API 路径和名称
// @author       sslf (由Gemini适配更新)
// @match        */swagger-ui.html
// @match        */swagger/index.html
// @match        http://miwms.app.polarwin.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554607/swagger%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6url%E5%92%8C%E5%90%8D%E7%A7%B0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/554607/swagger%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6url%E5%92%8C%E5%90%8D%E7%A7%B0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showSuccessFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.backgroundColor = '#d4edda';
        button.style.borderColor = '#c3e6cb';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '#f5f5f5';
            button.style.borderColor = '#ccc';
        }, 1500);
    }

    function tryCopyExecCommand(textToCopy, button) {
        try {
            const tempInput = document.createElement("textarea");
            tempInput.style.position = "absolute";
            tempInput.style.left = "-9999px";
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            
            const success = document.execCommand("copy");
            
            document.body.removeChild(tempInput);

            if (!success) {
                console.error('降级复制 (execCommand) 失败。');
                alert('复制失败，请手动复制: ' + textToCopy);
                return;
            }

            showSuccessFeedback(button);

        } catch (e) {
            console.error('降级复制方法也失败了 (Exception): ', e);
            alert('复制失败，请手动复制: ' + textToCopy);
        }
    }

    const buttonStyle = {
        cursor: 'pointer',
        marginLeft: '0',
        padding: '1px 6px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        backgroundColor: '#f5f5f5',
        fontSize: '11px',
        color: '#333',
        lineHeight: '1.3'
    };

    function onButtonEnter(e) {
        e.target.style.backgroundColor = '#e0e0e0';
    }

    function onButtonLeave(e) {
        e.target.style.backgroundColor = '#f5f5f5';
    }

    function onCopyClick(e, textToCopy, button) {
        e.stopPropagation();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showSuccessFeedback(button);
            }).catch(err => {
                console.error('自动复制失败 (navigator.clipboard): ', err);
                tryCopyExecCommand(textToCopy, button);
            });
        } else {
            tryCopyExecCommand(textToCopy, button);
        }
    }

function addHelperButtons() {
        const pathElements = document.querySelectorAll('.opblock-summary-path');

        if (pathElements.length === 0) {
            return;
        }

        pathElements.forEach(pathElement => {
            if (pathElement.dataset.helperButtonsAdded === 'true') {
                return;
            }
            pathElement.dataset.helperButtonsAdded = 'true';

            const buttonContainer = document.createElement('div');
            Object.assign(buttonContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: '10px',
                alignSelf: 'center'
            });

            const buttonPath = document.createElement('button');
            buttonPath.textContent = '复制路径';
            Object.assign(buttonPath.style, buttonStyle);
            buttonPath.addEventListener('mouseenter', onButtonEnter);
            buttonPath.addEventListener('mouseleave', onButtonLeave);
            
            const pathOnly = pathElement.textContent.trim();
            buttonPath.addEventListener('click', (e) => onCopyClick(e, pathOnly, buttonPath));

            buttonContainer.appendChild(buttonPath);

            const descriptionElement = pathElement.parentElement.querySelector('.opblock-summary-description');
            const nameToCopy = descriptionElement ? descriptionElement.textContent.trim() : null;
            
            if (nameToCopy && nameToCopy.length > 0) {
                const buttonName = document.createElement('button');
                buttonName.textContent = '复制名称';
                Object.assign(buttonName.style, buttonStyle);
                buttonName.style.marginTop = '2px';
                buttonName.addEventListener('mouseenter', onButtonEnter);
                buttonName.addEventListener('mouseleave', onButtonLeave);

                buttonName.addEventListener('click', (e) => onCopyClick(e, nameToCopy, buttonName));

                buttonContainer.appendChild(buttonName);
            }

            pathElement.insertAdjacentElement('afterend', buttonContainer);
        });
    }

    setInterval(addHelperButtons, 1000);

})();