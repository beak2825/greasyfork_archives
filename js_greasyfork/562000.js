// ==UserScript==
// @name         NNNu 教务系统自动评教
// @namespace    https://tampermonkey.net/
// @version      2.1.0
// @description  南宁师范大学教务系统自动完成所有课程评价
// @author       mwl
// @license      MIT
// @match        http://jw.nnnu.edu.cn/jsxsd/framework/xsMain.html*
// @match        https://jw.nnnu.edu.cn/jsxsd/framework/xsMain.html*
// @match        http://jw.nnnu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @match        https://jw.nnnu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nnnu.edu.cn
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562000/NNNu%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/562000/NNNu%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let isRunning = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function log(message) {
        console.log(`[自动评教] ${message}`);
    }

    function createStartButton() {
        if (document.getElementById('auto-evaluate-start-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'auto-evaluate-start-btn';
        btn.textContent = '🎯 一键完成评教';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            display: block;
        `;

        btn.onmouseenter = () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 6px 25px rgba(0,0,0,0.5)';
        };

        btn.onmouseleave = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        };

        btn.onclick = async () => {
            if (isRunning) return;

            isRunning = true;
            btn.textContent = '⏳ 评教中...';
            btn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

            log('开始自动评教...');
            await autoEvaluate();

            isRunning = false;
            btn.textContent = '✅ 评教完成！';
            btn.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

            await sleep(2000);
            btn.textContent = '🎯 一键完成评教';
            btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        };

        document.body.appendChild(btn);
    }

    async function autoEvaluate() {
        log('开始自动评分...');

        await sleep(1500);

        const radioButtons = document.querySelectorAll('input[type="radio"][name^="pj0601id_"]');
        log(`找到 ${radioButtons.length} 个单选按钮`);

        if (radioButtons.length === 0) {
            log('未找到评分选项');
            return;
        }

        const radioGroups = {};
        radioButtons.forEach(radio => {
            if (radio.name) {
                if (!radioGroups[radio.name]) {
                    radioGroups[radio.name] = [];
                }
                radioGroups[radio.name].push(radio);
            }
        });

        const groupNames = Object.keys(radioGroups);
        log(`找到 ${groupNames.length} 个评分组: ${groupNames.join(', ')}`);

        if (groupNames.length === 0) { log('未找到评分选项'); return; }

        // 遍历所有组，确保每个组都有选中项
        groupNames.forEach((groupName, index) => {
            const radios = radioGroups[groupName];
            log(`处理第 ${index + 1}/${groupNames.length} 组: ${groupName}, 共有 ${radios.length} 个选项`);

            let selected = false;
            let aFound = false;
            let bFound = false;

            for (let i = 0; i < radios.length; i++) {
                const radio = radios[i];
                const label = radio.closest('label');
                if (!label) continue;

                const text = label.textContent;

                if (text.includes('A') && text.includes('很好地做到')) {
                    aFound = true;
                }
                if (text.includes('B') && text.includes('较好地做到')) {
                    bFound = true;
                }

                // 如果已经选中，跳过
                if (radio.checked) {
                    selected = true;
                    log(`  选项已选中: ${text.substring(0, 20)}...`);
                    break;
                }
            }

            // 如果没有选中任何项，选A
            if (!selected && aFound) {
                for (const radio of radios) {
                    const label = radio.closest('label');
                    if (label && label.textContent.includes('A') && label.textContent.includes('很好地做到')) {
                        radio.click();
                        radio.checked = true;
                        log(`  选中A: ${label.textContent.substring(0, 30)}...`);
                        break;
                    }
                }
            } else if (!selected) {
                log(`  警告: 该组没有找到A选项或已选中项`);
            }

            if (!aFound) log(`  警告: 该组没有找到A选项`);
            if (!bFound) log(`  警告: 该组没有找到B选项`);
        });

        // 随机选一项改选B（避免全部都一样）
        const randomIndex = Math.floor(Math.random() * groupNames.length);
        const randomGroupName = groupNames[randomIndex];
        const randomGroup = radioGroups[randomGroupName];

        log(`将把第 ${randomIndex + 1} 组改为B选项`);

        const randomRadio = randomGroup.find(r => {
            const label = r.closest('label');
            return label && label.textContent.includes('B') && label.textContent.includes('较好地做到');
        });

        if (randomRadio) {
            randomRadio.click();
            randomRadio.checked = true;
            const label = randomRadio.closest('label');
            log(`已改为B: ${label.textContent.substring(0, 30)}...`);
        } else {
            log(`未找到B选项，保持原选择`);
        }

        // 再次检查确保所有组都有选中项
        let emptyCount = 0;
        groupNames.forEach((groupName, index) => {
            const radios = radioGroups[groupName];
            const anyChecked = radios.some(r => r.checked);
            if (!anyChecked) {
                emptyCount++;
                log(`警告: 第 ${index + 1} 组没有选中任何项!`);
                // 尝试选A
                for (const radio of radios) {
                    const label = radio.closest('label');
                    if (label && label.textContent.includes('A')) {
                        radio.click();
                        radio.checked = true;
                        log(`  补选: ${label.textContent.substring(0, 20)}...`);
                        break;
                    }
                }
            }
        });

        if (emptyCount > 0) {
            log(`补选了 ${emptyCount} 个空项`);
        }

        await sleep(500);

        const textareas = document.querySelectorAll('textarea');
        let filledComment = false;
        textareas.forEach(textarea => {
            if (!filledComment && (textarea.name?.includes('pj0602') ||
                textarea.id?.includes('pj0602') ||
                textarea.parentElement?.textContent?.includes('课堂教学'))) {
                textarea.value = '老师很好';
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                log('已填写评语');
                filledComment = true;
            }
        });

        if (!filledComment) {
            const allTextareas = document.querySelectorAll('textarea');
            allTextareas.forEach((textarea, index) => {
                if (!filledComment && textarea.rows > 2) {
                    textarea.value = '老师很好';
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                    log(`已填写评语 (第${index + 1}个textarea)`);
                    filledComment = true;
                }
            });
        }

        await sleep(500);

        const buttons = document.querySelectorAll('input[type="button"]');
        let submitButton = null;
        buttons.forEach(btn => {
            const onclick = btn.getAttribute('onclick') || '';
            const value = btn.value || '';
            if (onclick.includes('save') || value.includes('提交') || value.includes('保存')) {
                submitButton = btn;
            }
        });

        if (!submitButton) {
            const allButtons = document.querySelectorAll('button, input[type="button"]');
            allButtons.forEach(btn => {
                const text = btn.textContent || btn.value || '';
                if (!submitButton && (text.includes('提交') || text.includes('保存'))) {
                    submitButton = btn;
                }
            });
        }

        if (submitButton) {
            submitButton.click();
            log('已点击提交按钮');

            await sleep(2000);

            const confirmDialogs = document.querySelectorAll('.layui-layer-btn0, .layui-layer-btn1, button, input[type="button"]');
            confirmDialogs.forEach(btn => {
                const text = btn.textContent || btn.value || '';
                if (text.includes('确') || text.includes('好') || text.includes('是')) {
                    btn.click();
                }
            });
        }
    }

    function checkAndRun() {
        const url = window.location.href.split('#')[0];

        if (url.includes('xspj_edit.do')) {
            createStartButton();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndRun);
    } else {
        checkAndRun();
    }

    window.addEventListener('load', checkAndRun);

    setTimeout(checkAndRun, 2000);

})();
