// ==UserScript==
// @name         超星改卷快捷按键脚本
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  为超星阅雅(xueya.chaoxing.com)和阅卷(mooc2-ans.chaoxing.com)页面提供键盘快捷操作：1-9键点击对应评分按钮，q/w/e/r/s分别绑定撤销/左旋转/右旋转/水平线/提交等操作，同时为图片添加过渡动画提升体验
// @author       周利斌
// @license      MIT
// @match        https://xueya.chaoxing.com/epub-h5/?objectIds=*
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/exam/test/markquestion?clazzid=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562760/%E8%B6%85%E6%98%9F%E6%94%B9%E5%8D%B7%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%94%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562760/%E8%B6%85%E6%98%9F%E6%94%B9%E5%8D%B7%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%94%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// https://scriptcat.org/zh-CN/script-show-page/5188

(function () {
    function getValue(key, value) { const gmGetValueExists = window.GM_getValue && typeof GM_getValue !== "undefined"; return gmGetValueExists ? GM_getValue(key, value) : (localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key))); }
    function setValue(key, value) { const gmSetValueExists = window.GM_setValue && typeof GM_setValue !== "undefined"; return gmSetValueExists ? GM_setValue(key, value) : localStorage.setItem(key, JSON.stringify(value)); }

    'use strict';

    /**
     * 通用元素点击函数
     * 功能：模拟真实鼠标点击指定DOM元素，统一日志输出，避免重复代码
     * @param {HTMLElement|null} targetEl - 要点击的DOM元素（不存在则为null）
     * @param {string} elName - 元素名称/描述（用于控制台日志提示）
     */
    function clickElement(targetEl, elName) {
        // 元素存在时执行点击操作
        if (targetEl) {
            // 模拟真实鼠标点击（包含冒泡、可取消等特性，比直接click()更贴近用户操作）
            targetEl.dispatchEvent(new MouseEvent('click', {
                bubbles: true,        // 事件冒泡
                cancelable: true,     // 事件可取消
                view: window          // 关联当前窗口
            }));
            // 控制台输出成功日志
            console.log(elName ? `已自动点击 ${elName} 元素` : targetEl);
        } else {
            // 元素不存在时输出提示日志（不报错，避免脚本中断）
            console.log(elName ? `未找到 ${elName} 元素` : targetEl);
        }
    }

    /**
     * 图片过渡效果设置函数
     * 功能：为.img_rows下的所有img元素添加0.5秒过渡动画，监听DOM变化确保动态加载的图片也生效
     */
    function addImageTransition() {
        // 1. 初始化：获取所有.img_rows下的img元素
        const imgElements = document.querySelectorAll('.img_rows img');
        // 遍历图片元素，设置过渡样式
        imgElements.forEach(img => {
            // all：所有属性变化都应用过渡；0.5s：过渡时长；ease：过渡曲线（先慢后快再慢）
            img.style.transition = 'all 0.5s ease';
            console.log('已为.img_rows img添加0.5s过渡效果');
        });

        // 2. 监听DOM变化：防止动态加载的图片（如翻页后）未应用过渡样式
        const observer = new MutationObserver((mutations) => {
            // 遍历所有DOM变化记录
            mutations.forEach(mutation => {
                // 有新增节点时处理
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        // 仅处理元素节点（排除文本/注释节点）
                        if (node.nodeType === 1) {
                            // 查找新增节点内的.img_rows img元素
                            const newImgs = node.querySelectorAll('.img_rows img');
                            newImgs.forEach(img => {
                                img.style.transition = 'all 0.5s ease';
                            });
                        }
                    });
                }
            });
        });

        // 启动监听：监听body下所有子节点的添加/删除（包含子树）
        observer.observe(document.body, {
            childList: true,  // 监听直接子节点变化
            subtree: true     // 监听所有后代节点变化
        });
    }

    // 页面加载完成后立即执行：为图片添加过渡效果
    addImageTransition();

    function findScoreBtn(keyCode) {
        const scoreButtons = document.querySelectorAll('.scoreItemBtn');

        // 遍历按钮，找到文本内容等于当前数字的按钮
        for (const btn of scoreButtons) {
            // 去除文本两端空格（避免按钮文本有空格导致匹配失败）
            const btnText = btn.textContent.trim();
            if (btnText === keyCode) {
                return btn
            }
        }

    }
    const href = location.href;
    if (href.includes("xueya.chaoxing.com/epub-h5")) {
        setTimeout(() => clickElement(findScoreBtn(getValue("chaoxing:score","2"))), 1000)

    }
    /**
     * 按键绑定核心函数
     * 功能：根据当前页面URL和按下的按键，执行对应的元素点击操作
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    function bindKey(e) {
        // 获取按下的按键值（如'q'/'1'/'s'等）
        const keyCode = e.key;
        // 注释：取消默认行为会影响输入框输入，故保留默认行为
        // e.preventDefault(); 
        // 获取当前页面URL，用于区分不同业务页面


        // 核心判断：如果焦点在INPUT输入框内，不执行任何按键操作（避免干扰输入）
        if (e.target.tagName == "INPUT")
            return;

        // ========== 分支1：超星阅雅页面（xueya.chaoxing.com/epub-h5） ==========
        if (href.includes("xueya.chaoxing.com/epub-h5")) {
            // 1. 数字1-9按键：点击对应文本的.scoreItemBtn评分按钮
            if (/^[1-9]$/.test(keyCode)) {
                // 获取所有评分按钮 
                let targetBtn = findScoreBtn(keyCode);
                setValue("chaoxing:score",keyCode)
                // 执行点击操作
                clickElement(targetBtn, `数字${keyCode}对应的.scoreItemBtn`);
            }
            // 2. q键：点击撤销按钮（#withdraw a）
            else if (keyCode === 'q') {
                clickElement(document.querySelector('#withdraw a'), '撤销');
            }
            // 3. w键：点击左旋转按钮（#rotateLeft a）
            else if (keyCode === 'w') {
                clickElement(document.querySelector('#rotateLeft a'), '#rotateLeft');
            }
            // 4. e键：点击右旋转按钮（#rotateRight a）
            else if (keyCode === 'e') {
                clickElement(document.querySelector('#rotateRight a'), '#rotateRight');
            }
            // 5. r键：点击水平线按钮（#horizontalLine）
            else if (keyCode === 'r') {
                clickElement(document.getElementById('horizontalLine'), '#horizontalLine');
            }
            // 6. s键：分数输入框值>0时，点击完成评分按钮（#completeClass）
            else if (keyCode === 's') {
                // 获取分数输入框值，>>>0 转为数字（空/非数字转为0）
                const scoreValue = document.querySelector("#score input")?.value >>> 0;
                // 分数大于0时执行提交
                if (scoreValue > 0) {
                    clickElement(document.getElementById('completeClass'), '#completeClass');
                }
            }
        }

        // ========== 分支2：超星阅卷页面（mooc2-ans.chaoxing.com/mooc2-ans/exam/test/markquestion） ==========
        if (href.includes("mooc2-ans.chaoxing.com/mooc2-ans/exam/test/markquestion")) {
            // 1. s键：分数输入框值>0时，点击保存并进入下一题按钮
            if (keyCode === 's') {
                // 获取分数输入框值，>>>0 转为数字（空/非数字转为0）
                const scoreValue = document.querySelector(".commentTextarea input.wid60")?.value >>> 0;
                if (scoreValue > 0) {
                    const targetEl = document.querySelector('.fanyaMarkingBootm .mar30btn a.jb_btn');
                    clickElement(targetEl, '保存进入下一题');
                } else {
                    clickElement(document.querySelector(".student_answer img,.ans-ued-img,.stuAnswerWords img,.ans-tpupload"));

                }
            }
            // 2. q键：点击返回上一题按钮
            else if (keyCode === 'q') {
                const targetEl = document.querySelector('.fanyaMarkingBootm .mar30btn a.btnBlue');
                clickElement(targetEl, '返回上一题');
            }
        }
    }

    /**
     * 定时检测并绑定按键事件
     * 功能：每100ms检查一次，确保按键事件绑定成功（避免页面动态加载导致绑定失效）
     */
    setInterval(() => {
        // 仅当onkeydown未绑定函数时执行绑定
        if (!document.onkeydown) {
            document.onkeydown = bindKey;
            console.log("绑定按键成功");
        }
    }, 100);

    // 脚本加载完成提示
    console.log('超星学习快捷按键脚本已加载完成');
})();