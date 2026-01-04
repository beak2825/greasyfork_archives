// ==UserScript==
// @name         Univ Datasw 提取问答并发送
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  提取问答并调用接口，并带提示
// @license MIT
// @match        *://univ.datasw.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/548933/Univ%20Datasw%20%E6%8F%90%E5%8F%96%E9%97%AE%E7%AD%94%E5%B9%B6%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/548933/Univ%20Datasw%20%E6%8F%90%E5%8F%96%E9%97%AE%E7%AD%94%E5%B9%B6%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const API_URL = 'http://172.18.0.40/ai_app/dify_api/v1/chat-messages';
    const AUTH_TOKEN = 'app-LCmkQLvXMlDkJjkwIZ51Ez1P';

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '开始';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#4CAF50',
        color: '#fff',
        fontSize: '14px',
        border: 'none',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    });
    document.body.appendChild(btn);

    // 简单 toast 提示
    function showToast(msg, success = true) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '120px',
            right: '20px',
            background: success ? 'rgba(0,128,0,0.85)' : 'rgba(200,0,0,0.85)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            zIndex: 10000,
            transition: 'opacity 0.3s'
        });
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    btn.addEventListener('click', () => {
        const kb_question = document.querySelector('.qtext > p')?.textContent || document.querySelector('.qtext')?.textContent
        const kb_answer = Array.from(document.querySelectorAll('.answer > div')).map(node => {
        let res = ''
        node.childNodes.forEach(n => {res+=n.textContent})
            return res
        })
        const payload = { kb_question, kb_answer };

        // 设置按钮状态
        btn.textContent = '大模型处理中...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        console.log(payload)
        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Authorization": `Bearer ${AUTH_TOKEN}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                inputs: {},
                query: JSON.stringify(payload),
                response_mode: "blocking",
                conversation_id: "",
                user: "abc-123"
            }),
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const answers = JSON.parse(data.answer);
                    let ansuersNodes = document.querySelectorAll('.answer > div input[type="checkbox"]')
                    if(ansuersNodes.length === 0 ){
                       ansuersNodes = document.querySelectorAll('.answer > div input')
                    }
                    console.log('匹配的索引',answers)
                    answers.forEach(item => {
                        ansuersNodes[Number(item)].click()
                    });

                    console.log('接口返回结果:', data);
                    showToast('处理成功', true);
                } catch (e) {
                    console.error('解析失败:', response.responseText);
                    showToast('解析失败', false);
                } finally {
                    btn.textContent = '开始';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            },
            onerror: function (err) {
                console.error('请求失败:', err);
                showToast('请求失败', false);
                btn.textContent = '开始';
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    });
})();
