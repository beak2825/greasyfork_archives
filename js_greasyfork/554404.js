// ==UserScript==
// @name         叔叔不约只匹女2025年11月可用（自动离开男生聊天）
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  自动检测聊天对象性别，若为男生则自动点击“离开”，并自动处理弹窗确认；若为女生则随机问候。
// @author       blackBai_
// @match        https://www.shushubuyue.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554404/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E5%8C%B9%E5%A5%B32025%E5%B9%B411%E6%9C%88%E5%8F%AF%E7%94%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E7%A6%BB%E5%BC%80%E7%94%B7%E7%94%9F%E8%81%8A%E5%A4%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554404/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E5%8C%B9%E5%A5%B32025%E5%B9%B411%E6%9C%88%E5%8F%AF%E7%94%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E7%A6%BB%E5%BC%80%E7%94%B7%E7%94%9F%E8%81%8A%E5%A4%A9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isPaused = false; //全局暂停标志
    let isThrottled = false; //节流标志

    // 🔍 获取对方信息
    function getPartnerInfo(type) {
        const el = document.getElementById('partnerInfoText');
        if (!el) return null;
        const text = (el.textContent || el.innerText).replace('对方信息：', '').trim();
        const parts = text.split(/\s+/);
        const gender = parts[0] || '未知';
        const age = parts[1] || '未知';
        const location = parts[2] || '未知';
        const map = { gender, age, location };
        return map[type] || null;
    }

    // ⏸️ 暂停函数
    function pause(ms) {
        console.log(`⏸️ 暂停 ${ms / 1000} 秒...`);
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, ms);
    }

    // 🚪 点击主“离开”按钮（轮询检测）
    function clickLeaveButton() {
        console.log('🔎 尝试点击主离开按钮...');
        const interval = setInterval(() => {
            const buttons = document.querySelectorAll('a.button-link.chat-control');
            for (const button of buttons) {
                if (button.textContent.trim() === '离开') {
                    console.log('✅ 找到主离开按钮，点击中...');
                    button.click();
                    clearInterval(interval); // 找到后停止轮询
                    return;
                }
            }
        }, 300); // 每 300ms 检测一次
    }

    // 🔢 统计页面上有多少个 partnerInfoText 元素
    function countPartnerInfoText() {
        const elements = document.querySelectorAll('#partnerInfoText'); // 选中所有 id="partnerInfoText" 的元素
        const count = elements.length;
        console.log(`🧾 当前页面共有 ${count} 个 partnerInfoText 元素`);
        return count;
    }

    // 💬 自动发送随机问候语
    function autoSendRandomHello() {
        const total = document.querySelectorAll('#partnerInfoText').length;
        console.log(`🧾 当前页面共有 ${total} 个 partnerInfoText 元素`);

        if (total === 3) {
            const inputBox = document.querySelector('#msgInput');
            if (!inputBox) {
                console.log('❌ 未找到聊天输入框 #msgInput');
                return;
            }

            // 候选问候语列表
            const greetings = [
                '你好',
                '嗨~',
                '您好呀',
                '很高兴认识你',
                '你好呀',
                '哈喽'
            ];

            // 随机选择一个问候语
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            inputBox.value = randomGreeting;
            console.log(`✏️ 已自动输入：${randomGreeting}`);

            // 触发 input 事件
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));

            // 点击发送按钮
            const sendBtn = document.querySelector('a.button-link.msg-send');
            if (sendBtn) {
                sendBtn.click();
                console.log('📤 已点击发送按钮');
            } else {
                console.log('❌ 未找到发送按钮');
            }
        }
    }

    // 🚨 检测对方信息并决定是否离开
    function checkPartnerInfo() {
        if (isPaused || isThrottled) return; // 🔹【修改】现在支持全局暂停 + 节流
        const gender = getPartnerInfo('gender');
        if (!gender) return;

        console.log(`🧾 检测到性别: ${gender}`);

        if (gender === '男生') {
            console.log('⚠️ 检测到男生，执行自动离开逻辑...');
            clickLeaveButton();
        } else if (gender === '女生') {
            console.log('💗 检测到女生，保持聊天');
            autoSendRandomHello();
        }

        // debug
        // if (gender === '女生') {
        //     console.log('⚠️ 检测到女生，执行自动离开逻辑...');
        //     clickLeaveButton();
        // } else if (gender === '男生') {
        //     console.log('💗 检测到男生，保持聊天');
        //     autoSendRandomHello();
        // }
    }


    // 🕵️‍♀️ 全局检测“离开”“重新开始”按钮 + 弹窗确认
function checkGlobalButtons() {
    if (isPaused || isThrottled) return; // 🔹 支持全局暂停 + 节流

    if (isMatching()) {
        console.log('🔄 匹配中...');
        return;
    }

    // 1️⃣ 检测普通聊天控制按钮
    const spans = document.querySelectorAll('span.chat-control');
    for (const span of spans) {
        const text = span.textContent.trim();
        if (['离开', '重新开始'].includes(text)) {
            console.log(`🚨 检测到 [${text}] 按钮，点击中...`);
            span.click();
            return;
        }
    }
}

    // 🕵️‍♀️ 检测“确定离开？”弹窗并点击“离开”
function clickConfirmLeaveModal() {
    if (isPaused || isThrottled) return; // 支持全局暂停 + 节流

    // 找到所有 actions-modal-group 元素
    const modal = Array.from(document.querySelectorAll('.actions-modal-group'))
        .find(el => el.innerText && el.innerText.includes('确定离开？'));
    if (!modal) return; // 没有弹窗就直接返回

    // 在弹窗里找到“离开”按钮
    const leaveBtn = Array.from(modal.querySelectorAll('span'))
        .find(el => el.innerText.trim() === '离开');
    if (!leaveBtn) return;

    // 点击按钮
    leaveBtn.click();
    console.log('⚠️ 检测到“确定离开？”弹窗，已点击“离开”按钮');
}

    // 判断是否处于匹配中状态
    function isMatching() {
        const keywords = ['正在匹配中', '正在连接服务器...'];
        const el = Array.from(document.querySelectorAll('div'))
            .find(d => d.innerText && keywords.some(k => d.innerText.includes(k)));
        if (!el) return false;
        const st = window.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
    }

    // 🟢 创建浮动暂停按钮
    function createPauseButton() {
        const btn = document.createElement('button');
        btn.id = 'pauseToggleBtn';
        btn.textContent = '⏸️ 暂停';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'background-color 0.3s'
        });
        btn.onmouseenter = () => (btn.style.backgroundColor = '#0056b3');
        btn.onmouseleave = () => (btn.style.backgroundColor = '#007BFF');

        // 🔸【新增】点击切换暂停状态
        btn.onclick = () => {
            isPaused = !isPaused;
            btn.textContent = isPaused ? '▶️ 恢复' : '⏸️ 暂停';
            btn.style.backgroundColor = isPaused ? '#6c757d' : '#007BFF';
            console.log(isPaused ? '🛑 已暂停所有自动检测' : '✅ 已恢复自动检测');
        };

        document.body.appendChild(btn);
    }



    createPauseButton(); // 🔸【新增】
    console.log('✅ 脚本已启动，带暂停按钮。');

    // 定时检测
    setInterval(checkPartnerInfo, 2000);//检测对方性别来判断是否离开
    setInterval(checkGlobalButtons, 500);//自动点击离开/重新开始来自动匹配
    setInterval(clickConfirmLeaveModal, 500);

})();
