// ==UserScript==
// @name         COGS 美化
// @name:zh-CN   COGS 浅紫毛玻璃主题
// @namespace    http://tampermonkey.net/
// @version      13.4
// @description  全站浅色毛细玻璃。仅在比赛列表页强制不换行，其他页面保持自然换行。
// @description:zh-CN 全站浅色毛细玻璃。仅在比赛列表页强制不换行，其他页面保持自然换行。
// @author       To_Carpe_Diem
// @match        http://cogs.pro:8081/*
// @match        http://172.30.1.3/cogs/*
// @match        http://218.28.19.228:8081/cogs/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563869/COGS%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563869/COGS%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- 1. 基础样式 --- */
        html { font-size: 15px !important; }
        body { 
            margin: 0 !important; 
            padding: 0 !important; 
            min-width: 1100px !important; 
            /* 修正了 htt:// 为 https:// */
            background: url('https://cdn.luogu.com.cn/upload/image_hosting/v07rs7x3.png') no-repeat center center fixed !important; 
            background-size: cover !important; 
            font-family: 'Inter', -apple-system, system-ui, sans-serif !important; 
            color: #475569 !important; 
        }

        /* --- 2. 导航栏 --- */
        body > center > table:first-of-type { display: flex !important; justify-content: center !important; align-items: center !important; height: 50px !important; width: auto !important; min-width: 800px !important; margin: 15px auto !important; background: rgba(255, 255, 255, 0.7) !important; backdrop-filter: blur(12px) !important; border: 1px solid rgba(255, 255, 255, 0.5) !important; border-radius: 25px !important; box-shadow: 0 8px 24px rgba(147, 130, 255, 0.15) !important; position: sticky; top: 15px; z-index: 9999; }
        body > center > table:first-of-type td { display: flex !important; padding: 0 20px !important; white-space: nowrap !important; }
        body > center > table:first-of-type a { color: #5b21b6 !important; font-weight: 700 !important; text-decoration: none !important; font-size: 14px !important; transition: all 0.3s ease; }
        body > center > table:first-of-type a:hover { color: #8b5cf6 !important; transform: scale(1.05); }

        /* --- 3. 容器与表格 --- */
        .problem, .page, .form-horizontal, .bs-docs-example, body > center > table:not(:first-of-type) { background: rgba(255, 255, 255, 0.5) !important; backdrop-filter: blur(10px) !important; border-radius: 20px !important; border: 1px solid rgba(255, 255, 255, 0.6) !important; box-shadow: 0 10px 30px rgba(100, 100, 255, 0.05) !important; margin: 25px auto !important; width: 94% !important; max-width: 1080px !important; box-sizing: border-box !important; }
        .table:not(.problem table) { width: 100% !important; border-collapse: separate !important; border-spacing: 0 5px !important; }
        .table:not(.problem table) tr td { background: rgba(255, 255, 255, 0.05) !important; border-top: 1px solid rgba(255, 255, 255, 0.1) !important; border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important; padding: 8px 12px !important; vertical-align: middle !important; }
        
        /* 智能换行逻辑 */
        body.is-contest-page .table:not(.problem table) tr td { white-space: nowrap !important; }
        
        .table:not(.problem table) tr:hover td { background: rgba(255, 255, 255, 0.8) !important; backdrop-filter: blur(5px); transform: scale(1.005); transition: all 0.2s ease; }

        /* --- 4. 状态标签 --- */
        [class^="j"] { display: inline-block !important; height: 1.4em !important; line-height: 1.4em !important; padding: 0 5px !important; font-size: 11px !important; font-weight: 800 !important; border-radius: 3px !important; text-shadow: none !important; vertical-align: middle !important; margin: 0 2px !important; min-width: unset !important; border: 1px solid rgba(0,0,0,0.05) !important; }
        .jM, .jA { background: #10b981 !important; color: #fff !important; }
        .jC, .jW { background: #f43f5e !important; color: #fff !important; }
        .jT { background: #f59e0b !important; color: #fff !important; }
        .jE { background: #8b5cf6 !important; color: #fff !important; }
        .jR { background: #d946ef !important; color: #fff !important; }

        /* --- 5. 题目详情 --- */
        .problem h1 { font-size: 2.2rem !important; font-weight: 800; color: #1e1b4b; margin-bottom: 1.5rem; }
        .problem h2, .problem h3 { font-size: 1.2rem !important; background: rgba(243, 232, 255, 0.6) !important; border-left: 5px solid #8b5cf6 !important; padding: 8px 16px !important; margin: 2rem 0 1rem 0 !important; color: #5b21b6 !important; border-radius: 4px; }
        .problem p { font-size: 20px !important; }
        .problem pre { background: rgba(248, 250, 255, 0.8) !important; backdrop-filter: blur(5px); color: #334155 !important; padding: 20px !important; border-radius: 12px !important; font-family: 'Fira Code', 'Consolas', monospace !important; font-size: 20px !important; line-height: 1.6 !important; border: 1px solid rgba(200, 200, 255, 0.3) !important; margin: 15px 0 !important; }

        /* --- 6. 交互组件 --- */
        input[type="submit"], .btn { background: #8b5cf6 !important; color: white !important; padding: 5px 15px !important; border-radius: 6px !important; font-size: 13px !important; font-weight: 600 !important; border: none !important; cursor: pointer; box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2) !important; transition: all 0.2s ease; }
        input[type="submit"]:hover, .btn:hover { background: #7c3aed !important; box-shadow: 0 3px 8px rgba(139, 92, 246, 0.3) !important; transform: translateY(-1px); }
        textarea, input[type="text"] { background: rgba(255, 255, 255, 0.7) !important; border: 1px solid rgba(139, 92, 246, 0.2) !important; border-radius: 8px !important; padding: 8px !important; font-size: 13.5px !important; }
        center { width: 100% !important; }
    `;
    document.head.appendChild(style);

    const cleanup = () => {
        document.querySelectorAll('table').forEach(t => { 
            t.removeAttribute('bgcolor'); 
            t.removeAttribute('border'); 
            t.removeAttribute('cellspacing'); 
            t.removeAttribute('cellpadding'); 
        });
        const nav = document.querySelector('body > center > table:first-of-type');
        if (nav) { 
            nav.querySelectorAll('td').forEach(td => { 
                td.innerHTML = td.innerHTML.replace(/&nbsp;/g, ''); 
            }); 
        }
    };

    const replaceAvatar = () => {
        const avatars = document.querySelectorAll('img[src*="gravatar"]');
        const myNewAvatar = "https://cdn.luogu.com.cn/upload/image_hosting/292g8txe.png";
        avatars.forEach(img => { 
            if (img.src !== myNewAvatar) { 
                img.src = myNewAvatar; 
                img.style.borderRadius = "50%"; 
                img.style.objectFit = "cover"; 
            } 
        });
    };

    const checkPage = () => {
        if (window.location.href.includes('/cogs/contest/index.php')) { 
            document.body.classList.add('is-contest-page'); 
        } else { 
            document.body.classList.remove('is-contest-page'); 
        }
    };

    const runAll = () => { checkPage(); cleanup(); replaceAvatar(); };
    window.addEventListener('DOMContentLoaded', runAll);
    setInterval(runAll, 1500);
})();