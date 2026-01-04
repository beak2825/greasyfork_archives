// ==UserScript==
// @name         豆瓣小组轻量版（集成预览功能）
// @namespace    https://greasyfork.org/zh-CN/scripts/517464
// @version      1.1
// @description  集成卡片优化样式：点击列表项时以紧凑弹窗形式展示帖子内容和评论。优化“关闭弹窗”按钮的悬停样式。
// @author       Google Gemini
// @match        https://www.douban.com/group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557381/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%BD%BB%E9%87%8F%E7%89%88%EF%BC%88%E9%9B%86%E6%88%90%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557381/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%BD%BB%E9%87%8F%E7%89%88%EF%BC%88%E9%9B%86%E6%88%90%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ================= 样式优化区域：应用卡片样式到弹窗 =================
    
    const style = document.createElement('style');
    style.innerHTML = `
        /* 弹窗容器（viewBox）样式：应用紧凑和字体优化 */
        .dbp-view-box {
            background-color: #fff;
            padding: 20px; /* 适当的内边距 */
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            font-size: 14px; /* 字体调小 */
            color: #333;
            line-height: 1.7;
            
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 650px; 
            max-height: 80%;
            overflow-y: auto;
            z-index: 1001;
            box-sizing: border-box;
        }

        /* 正文内容样式 */
        .dbp-view-box .topic-richtext {
            font-size: 14px; 
            line-height: 1.7;
            margin-bottom: 20px;
        }
        
        /* 确保正文的第一个/最后一个元素不与弹窗 padding 叠加 */
        .dbp-view-box .topic-richtext > :first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
        .dbp-view-box .topic-richtext > :last-child {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
        }

        /* 评论区样式 */
        .dbp-reply-box {
            color: #7e7e7e;
            margin: 10px auto;
            padding: 10px 0 0 0;
            border-top: 1px solid #dedede;
            font-size: 13px; 
        }
        
        /* 标题样式 */
        .dbp-view-box h2 {
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #eee;
        }

        /* 图片缩放样式 */
        .dbp-view-box .topic-richtext img {
            max-width: 20%;
            height: auto;
            margin: 10px auto; 
            display: block;
            cursor: pointer;
            transition: max-width 0.3s;
        }
        
        /* === V2.4 优化：关闭按钮样式 === */
        
        /* 弹窗底部操作区 */
        .dbp-view-box-footer {
            display: flex;
            justify-content: flex-end; /* 右对齐 */
            margin-top: 15px;
            padding-top: 5px;
            border-top: 1px dashed #eee; /* 添加分隔线 */
        }
        
        /* 关闭按钮样式 */
        .dbp-close-btn-pop {
            font-size: 13px;
            color: #999 !important;
            text-decoration: none;
            padding: 2px 5px; /* 增加点击区域 */
            transition: color 0.2s;
            background-color: transparent !important; /* 确保没有背景色 */
            cursor: pointer;
        }

        /* 关闭按钮 hover 效果：只改变文字颜色 */
        .dbp-close-btn-pop:hover {
            color: #333 !important;
            text-decoration: underline;
            background-color: transparent !important;
        }

        /* 遮罩层样式 (不变) */
        .dbp-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);

    // ================= 页面精简逻辑 (保留用户原有) =================

    document.title = document.title[0];
    document.querySelector("#wrapper").style.width = "100%";
    document.querySelector(".aside")?.remove();
    document.body.style.width = "100%";
    document.querySelector(".article").style.width = "100%";
    document.querySelector(".article").style.boxSizing = "border-box";
    document.querySelector(".article").style.padding = "10px";
    document.getElementById("db-nav-group")?.remove();
    document.getElementById("content")?.querySelector("h1")?.remove();
    document.querySelector(".group-board")?.remove();
    document.getElementById("db-global-nav")?.remove();
    document.getElementById("footer")?.remove();
    document.getElementById("group-info")?.remove();
    document.getElementById("group-new-topic-bar")?.remove();

    const doumail = document.createElement("div");
    doumail.id = "top-nav-doumail-link";
    doumail.innerHTML = "<em></em>";
    doumail.style.display = "none";
    document.body.appendChild(doumail);

    document.querySelectorAll(".article table.olt>tbody>tr>td[nowrap='nowrap']").forEach(item => {
        item.remove();
    })
    document.querySelector(".article table.olt>tbody>tr.th")?.querySelectorAll("td").forEach((item, index) => {
        if(index > 0) {
            item.remove();
        }
    })

    // ================= 弹窗逻辑（基于用户原有，但集成样式） =================

    document.querySelectorAll(".td-subject>a.title, .article td.title>a").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            
            if (document.querySelector('.dbp-view-box')) return;
            
            // 1. 创建加载中的弹窗
            const viewBox = document.createElement("div");
            viewBox.className = "dbp-view-box";
            viewBox.innerHTML = "<h2>加载中...</h2>";
            
            // 2. 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = "dbp-overlay";

            // 3. 弹窗和遮罩层插入 DOM
            document.body.dataset.saveScrollTop = document.documentElement.scrollTop;
            document.body.style.overflowY = "hidden";
            document.body.appendChild(viewBox);
            document.body.appendChild(overlay);
            
            // 4. 绑定点击遮罩层关闭事件
            overlay.addEventListener("click", () => {
                viewBox.remove();
                overlay.remove();
                document.body.style.overflowY = "auto";
                window.scrollTo({
                    top: Number(document.body.dataset.saveScrollTop),
                    behavior: "smooth"
                });
            });


            fetch(item.href)
                .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.text();
            })
                .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                
                const title = doc.title.replace(' - 豆瓣', ''); 
                let content = doc.querySelector(".topic-richtext");
                
                if (!content) {
                     viewBox.innerHTML = "<h2>加载失败</h2><p>无法解析正文内容，可能需要登录或加入小组。</p>";
                     return;
                }

                // 5. 图片处理：应用缩放逻辑
                content.querySelectorAll('img').forEach(img => {
                    img.removeAttribute('style');
                    
                    img.addEventListener("click", () => {
                       if(img.style.maxWidth === "100%") {
                           img.style.maxWidth = "20%";
                       } else {
                           img.style.maxWidth = "100%";
                       }
                    })
                });

                // 6. 渲染内容
                const titleEl = document.createElement("h2");
                titleEl.innerHTML = title;
                
                viewBox.innerHTML = ''; 
                viewBox.appendChild(titleEl);
                viewBox.appendChild(content);

                // 7. 评论处理
                doc.querySelectorAll(".reply-doc").forEach(item => {
                    item.querySelector(".operation-div")?.remove();
                    
                    const replyAuthEl = item.querySelector(".bg-img-green>h4>a");
                    const replyContentEl = item.querySelector(".markdown") || item.querySelector('.reply-content') || item;
                    
                    const replyAuth = replyAuthEl ? replyAuthEl.innerText : '未知用户';
                    const replyContent = replyContentEl ? replyContentEl.innerText.trim() : '内容缺失';

                    item.querySelector(".bg-img-green")?.remove();
                    
                    const replyBox = document.createElement("div");
                    replyBox.className = "dbp-reply-box";
                    replyBox.innerHTML = `<b>${replyAuth}：</b>${replyContent}`;
                    
                    viewBox.appendChild(replyBox);
                });
                
                // 8. 添加底部操作栏和关闭按钮 (V2.4 优化)
                const footer = document.createElement('div');
                footer.className = 'dbp-view-box-footer';

                const closeBtn = document.createElement('a');
                closeBtn.href = "javascript:;";
                closeBtn.innerHTML = '关闭弹窗';
                closeBtn.className = 'dbp-close-btn-pop';
                closeBtn.addEventListener('click', () => overlay.click());

                footer.appendChild(closeBtn);
                viewBox.appendChild(footer);

            })
                .catch(error => {
                console.error("Fetch error:", error);
                viewBox.innerHTML = "<h2>网络错误</h2><p>加载内容失败，请检查网络或重试。</p>";
            });

        })
    })

})();