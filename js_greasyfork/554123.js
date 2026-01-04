// ==UserScript==
// @name         B站表情展示器
// @namespace    https://github.com/anjiemo
// @version      1.0.5
// @description  在阳光沙滩网站上显示B站表情图片和名称
// @author       anjiemo
// @match        *://*.sunofbeach.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      Apache-2.0
// @connect      gitee.com
// @downloadURL https://update.greasyfork.org/scripts/554123/B%E7%AB%99%E8%A1%A8%E6%83%85%E5%B1%95%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554123/B%E7%AB%99%E8%A1%A8%E6%83%85%E5%B1%95%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 添加样式
    GM_addStyle(`
        .bemoji-floating-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            overflow: hidden;
            resize: both;
            max-width: 90vw;
            max-height: 80vh;
        }
 
        .bemoji-panel-header {
            background: linear-gradient(135deg, #FB7299 0%, #FFB6C1 100%);
            color: white;
            padding: 15px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
 
        .bemoji-panel-title {
            font-size: 18px;
            font-weight: bold;
        }
 
        .bemoji-panel-controls {
            display: flex;
            gap: 10px;
        }
 
        .bemoji-panel-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }
 
        .bemoji-panel-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
 
        .bemoji-panel-content {
            padding: 15px;
            max-height: 500px;
            overflow-y: auto;
        }
 
        .bemoji-search-container {
            margin-bottom: 15px;
        }
 
        .bemoji-search-input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }
 
        .bemoji-search-input:focus {
            border-color: #FB7299;
            box-shadow: 0 0 0 2px rgba(251, 114, 153, 0.2);
        }
 
        .bemoji-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
        }
 
        .bemoji-item {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 10px 5px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 90px;
        }
 
        .bemoji-item:hover {
            background: #e9ecef;
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
 
        .bemoji-img {
            width: 32px;
            height: 32px;
            object-fit: contain;
            margin-bottom: 8px;
        }
 
        .bemoji-text {
            font-size: 12px;
            color: #555;
            word-break: break-word;
            line-height: 1.2;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
 
        .bemoji-count {
            text-align: center;
            margin: 15px 0;
            color: #6c757d;
            font-size: 14px;
        }
 
        .bemoji-loading {
            text-align: center;
            padding: 20px;
            color: #6c757d;
        }
 
        .bemoji-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s;
        }
 
        .bemoji-notification.show {
            opacity: 1;
        }
 
        .bemoji-item.copied {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
        }
 
        .bemoji-toggle-btn {
            position: fixed;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FB7299 0%, #FFB6C1 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: move;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            user-select: none;
        }
 
        .bemoji-toggle-btn:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #FFB6C1 0%, #FB7299 100%);
        }
 
        @media (max-width: 700px) {
            .bemoji-floating-panel {
                width: 90vw;
                right: 5vw;
            }
            .bemoji-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
 
        @media (max-width: 480px) {
            .bemoji-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    `);
 
    // 表情数据 - 名称和图片URL映射
    const bilibiliEmojis = [
        { name: "微笑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default001.png" },
        { name: "呲牙", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f601.png" },
        { name: "OK", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f44c.png" },
        { name: "星星眼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f929.png" },
        { name: "哦呼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default005.png" },
        { name: "歪嘴", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f60f.png" },
        { name: "嫌弃", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f612.png" },
        { name: "喜欢", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f60d.png" },
        { name: "酸了", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f34b.png" },
        { name: "大哭", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f62d.png" },
        { name: "害羞", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f60a.png" },
        { name: "疑惑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default012.png" },
        { name: "辣眼睛", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default013.png" },
        { name: "调皮", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f61b.png" },
        { name: "喜极而泣", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f602.png" },
        { name: "奸笑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default016.png" },
        { name: "笑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f642.png" },
        { name: "偷笑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f92d.png" },
        { name: "大笑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f604.png" },
        { name: "阴险", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default020.png" },
        { name: "捂脸", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f926.png" },
        { name: "囧", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default022.png" },
        { name: "呆", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f633.png" },
        { name: "抠鼻", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default024.png" },
        { name: "惊喜", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f61d.png" },
        { name: "惊讶", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f632.png" },
        { name: "笑哭", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default027.png" },
        { name: "妙啊", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default028.png" },
        { name: "doge", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f436.png" },
        { name: "滑稽", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default030.png" },
        { name: "吃瓜", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f349.png" },
        { name: "打call", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f64c.png" },
        { name: "点赞", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default033.png" },
        { name: "鼓掌", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f44f.png" },
        { name: "无语", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f611.png" },
        { name: "尴尬", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default036.png" },
        { name: "冷", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f976.png" },
        { name: "灵魂出窍", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f47b.png" },
        { name: "委屈", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f622.png" },
        { name: "傲娇", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default040.png" },
        { name: "疼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default041.png" },
        { name: "吓", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f631.png" },
        { name: "生病", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f912.png" },
        { name: "吐", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f92e.png" },
        { name: "嘘声", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f92b.png" },
        { name: "捂眼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f648.png" },
        { name: "思考", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f914.png" },
        { name: "再见", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f44b.png" },
        { name: "翻白眼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f644.png" },
        { name: "哈欠", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f971.png" },
        { name: "奋斗", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default051.png" },
        { name: "墨镜", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f60e.png" },
        { name: "难过", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f641.png" },
        { name: "撇嘴", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f61f.png" },
        { name: "抓狂", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f62b.png" },
        { name: "生气", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f621.png" },
        { name: "口罩", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f637.png" },
        { name: "月饼", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f96e.png" },
        { name: "视频卫星", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f6f0.png" },
        { name: "11周年", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f4fa.png" },
        { name: "鸡腿", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f357.png" },
        { name: "干杯", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f37b.png" },
        { name: "爱心", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/2764.png" },
        { name: "锦鲤", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default064.png" },
        { name: "胜利", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/270c.png" },
        { name: "加油", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f4aa.png" },
        { name: "保佑", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f64f.png" },
        { name: "抱拳", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default068.png" },
        { name: "响指", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default069.png" },
        { name: "支持", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f44d.png" },
        { name: "拥抱", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1fac2.png" },
        { name: "怪我咯", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f937-200d-2640-fe0f.png" },
        { name: "跪了", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f9ce.png" },
        { name: "黑洞", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default074.png" },
        { name: "老鼠", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/1f439.png" },
        { name: "2020", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default076.png" },
        { name: "福到了", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default077.png" },
        { name: "高兴", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default078.png" },
        { name: "气愤", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default079.png" },
        { name: "耍帅", url: "https://gitee.com/anjiemo/figure-bed/raw/master/emoji/bilibili/default080.png" }
    ];
 
    // 创建浮动面板
    function createFloatingPanel() {
        // 检查是否已存在面板
        if (document.getElementById('bemoji-floating-panel')) {
            return;
        }
 
        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'bemoji-floating-panel';
        panel.className = 'bemoji-floating-panel';
 
        // 从存储中获取位置
        const savedPosition = GM_getValue('bemojiPanelPosition', {
            top: '100px',
            right: '20px'
        });
        if (savedPosition.top) panel.style.top = savedPosition.top;
        if (savedPosition.left) panel.style.left = savedPosition.left;
        if (savedPosition.right) panel.style.right = savedPosition.right;
 
        // 面板头部
        const header = document.createElement('div');
        header.className = 'bemoji-panel-header';
 
        const title = document.createElement('div');
        title.className = 'bemoji-panel-title';
        title.textContent = 'B站表情包';
 
        const controls = document.createElement('div');
        controls.className = 'bemoji-panel-controls';
 
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'bemoji-panel-btn';
        minimizeBtn.innerHTML = '−';
        minimizeBtn.title = '最小化';
 
        const closeBtn = document.createElement('button');
        closeBtn.className = 'bemoji-panel-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = '关闭';
 
        controls.appendChild(minimizeBtn);
        controls.appendChild(closeBtn);
 
        header.appendChild(title);
        header.appendChild(controls);
 
        // 面板内容
        const content = document.createElement('div');
        content.className = 'bemoji-panel-content';
 
        // 搜索框
        const searchContainer = document.createElement('div');
        searchContainer.className = 'bemoji-search-container';
 
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'bemoji-search-input';
        searchInput.placeholder = '搜索表情...';
 
        searchContainer.appendChild(searchInput);
        content.appendChild(searchContainer);
 
        // 表情数量
        const countElement = document.createElement('div');
        countElement.className = 'bemoji-count';
        content.appendChild(countElement);
 
        // 表情网格
        const emojiGrid = document.createElement('div');
        emojiGrid.className = 'bemoji-grid';
        content.appendChild(emojiGrid);
 
        // 组装面板
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);
 
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'bemoji-notification';
        notification.textContent = '表情已复制到剪贴板！';
        document.body.appendChild(notification);
 
        // 显示表情
        displayEmojis(bilibiliEmojis, emojiGrid, countElement);
 
        // 搜索功能
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredEmojis = bilibiliEmojis.filter(emoji => 
                emoji.name.toLowerCase().includes(searchTerm)
            );
            displayEmojis(filteredEmojis, emojiGrid, countElement);
        });
 
        // 关闭按钮事件
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(panel);
            document.body.removeChild(notification);
            toggleBtn.style.display = 'flex';
        });
 
        // 最小化按钮事件
        minimizeBtn.addEventListener('click', function() {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
 
        // 拖拽功能（带边界限制）
        makeElementDraggableWithBoundary(panel, header, 'bemojiPanelPosition');
 
        return panel;
    }
 
    // 显示表情函数
    // 在 displayEmojis 函数中修改图片创建部分
    function displayEmojis(emojisToShow, container, countElement) {
        container.innerHTML = '';
        countElement.textContent = `共${emojisToShow.length}个表情`;
    
        if (emojisToShow.length === 0) {
            container.innerHTML = '<div class="bemoji-loading">未找到匹配的表情</div>';
            return;
        }
    
        emojisToShow.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'bemoji-item';
            emojiItem.title = `点击复制: [${emoji.name}]`;
    
            const emojiImg = document.createElement('img');
            emojiImg.className = 'bemoji-img';
            emojiImg.alt = emoji.name;
            
            // 使用 GM_xmlhttpRequest 加载图片
            loadImageWithGM(emoji.url, emojiImg);
    
            const emojiText = document.createElement('div');
            emojiText.className = 'bemoji-text';
            emojiText.textContent = emoji.name;
    
            emojiItem.appendChild(emojiImg);
            emojiItem.appendChild(emojiText);
    
            // 点击复制功能
            emojiItem.addEventListener('click', function() {
                copyToClipboard(`[${emoji.name}]`);
                emojiItem.classList.add('copied');
                setTimeout(() => {
                    emojiItem.classList.remove('copied');
                }, 500);
                showNotification();
            });
    
            container.appendChild(emojiItem);
        });
    }
 
    // 复制到剪贴板函数
    function copyToClipboard(text) {
        // 优先使用GM_setClipboard，如果不可用则回退到传统方法
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
 
    // 显示通知函数
    function showNotification() {
        const notification = document.querySelector('.bemoji-notification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }
 
 // 添加新的图片加载函数
 function loadImageWithGM(imageUrl, imgElement) {
     if (typeof GM_xmlhttpRequest !== 'undefined') {
         GM_xmlhttpRequest({
             method: 'GET',
             url: imageUrl,
             responseType: 'blob',
             onload: function(response) {
                 const blob = response.response;
                 const blobUrl = URL.createObjectURL(blob);
                 imgElement.src = blobUrl;
                 
                 // 添加加载完成的回调处理
                 imgElement.onload = function() {
                     // 图片加载完成后释放 blob URL
                     URL.revokeObjectURL(blobUrl);
                 };
             },
             onerror: function(error) {
                 console.error('图片加载失败:', error);
                 // 失败时回退到原始URL
                 imgElement.src = imageUrl;
             }
         });
     } else {
         // 如果 GM_xmlhttpRequest 不可用，直接使用原始URL
         imgElement.src = imageUrl;
     }
 }
 
    // 使元素可拖拽（带边界限制）
    function makeElementDraggableWithBoundary(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
 
        handle.onmousedown = dragMouseDown;
 
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
 
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
 
            // 计算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
 
            // 边界限制
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
 
            // 设置元素新位置
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = "auto";
 
            // 保存位置到存储
            if (storageKey) {
                GM_setValue(storageKey, {
                    top: element.style.top,
                    left: element.style.left,
                    right: element.style.right
                });
            }
        }
 
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
 
    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'bemoji-toggle-btn';
    toggleBtn.innerHTML = '😊';
    toggleBtn.title = '显示/隐藏B站表情面板';
    document.body.appendChild(toggleBtn);
 
    // 添加初始位置和显示样式
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '100px';
    toggleBtn.style.right = '20px';
    toggleBtn.style.display = 'flex';
 
    // 拖拽逻辑（仅限切换按钮）
    function makeButtonDraggable(button) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let animationFrameId = null;
 
        button.addEventListener('mousedown', startDrag);
 
        function startDrag(e) {
            // 阻止默认行为，避免文本选中
            e.preventDefault();
            e.stopPropagation();
 
            isDragging = false;
            button.isDragging = true;
 
            // 获取初始位置
            startX = e.clientX;
            startY = e.clientY;
            initialX = button.offsetLeft;
            initialY = button.offsetTop;
 
            // 添加拖动样式
            button.style.opacity = '0.9';
            button.style.cursor = 'grabbing';
            button.style.transition = 'none';
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
 
            // 阻止鼠标事件冒泡
            document.addEventListener('click', preventClickDuringDrag, true);
        }
 
        function onDrag(e) {
            if (!isDragging) {
                isDragging = true;
            }
 
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
 
            animationFrameId = requestAnimationFrame(() => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
 
                let newLeft = initialX + dx;
                let newTop = initialY + dy;
 
                const margin = 5;
                newTop = Math.max(margin, Math.min(newTop, window.innerHeight - button.offsetHeight - margin));
                newLeft = Math.max(margin, Math.min(newLeft, window.innerWidth - button.offsetWidth - margin));
 
                button.style.left = newLeft + 'px';
                button.style.top = newTop + 'px';
                button.style.right = 'auto';
            });
        }
 
        function stopDrag(e) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
 
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('click', preventClickDuringDrag, true);
 
            button.style.opacity = '1';
            button.style.cursor = 'move';
            button.style.transition = 'all 0.2s ease';
            button.isDragging = false;
 
            saveButtonPosition();
 
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                setTimeout(() => {
                    isDragging = false;
                }, 50);
            }
        }
 
        function preventClickDuringDrag(e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
 
        function saveButtonPosition() {
            const position = {
                left: button.style.left,
                top: button.style.top
            };
            localStorage.setItem('bemojiToggleBtnPosition', JSON.stringify(position));
        }
 
        function loadButtonPosition() {
            const saved = localStorage.getItem('bemojiToggleBtnPosition');
            if (saved) {
                try {
                    const position = JSON.parse(saved);
                    if (position.left) button.style.left = position.left;
                    if (position.top) button.style.top = position.top;
                    button.style.right = 'auto';
                } catch(e) {
                    console.log('加载按钮位置失败:', e);
                }
            }
        }
 
        setTimeout(loadButtonPosition, 100);
 
        button.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
 
            if (!panel || !document.body.contains(panel)) {
                panel = createFloatingPanel();
                button.style.display = 'none';
            } else {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
 
    // 应用优化的拖拽功能到切换按钮
    makeButtonDraggable(toggleBtn);
 
    let panel = null;
})();