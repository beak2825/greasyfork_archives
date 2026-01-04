// ==UserScript==
// @name        SubtiTleCat字幕搜索
// @namespace    https://subtitlecat.com/
// @icon         https://subtitlecat.com/favicon.ico
// @version      0.3.2
// @description  获取subtitlecat字幕结果
// @author       sexjpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow

// @connect      subtitlecat.com
// @match        *://*/*



// @connect      subtitlecat.com
// @noframes
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/549281/SubtiTleCat%E5%AD%97%E5%B9%95%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/549281/SubtiTleCat%E5%AD%97%E5%B9%95%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);

const homeurl = "https://subtitlecat.com";


// 创建悬浮窗
class Modal {
    constructor(options = {}) {
        // 合并配置
        this.config = {
            miniIcon_text: '🎛️',
            title: '悬浮窗',
            x: 100,
            y: 100,
            bx: 1,
            by: 100,
            content: null,
            element: null,
            iframe: document,
            isdblclick: true,
            ...options
        };

        // 初始化状态
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.initialX = 0;
        this.initialY = 0;

        // 初始化 DOM 元素
        this.iframe = this.config.iframe || document;
        this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow?.document || document;

        this._createElements();
        this._bindEvents();
    }

    _createElements() {
        // 创建主容器
        this.floatDiv = this.iframeDocument.createElement('div');
        this.floatDiv.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        min-width: 200px;
        min-height: 100px;
        max-width: 60vw;
        max-height: 60vh;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: auto;
        z-index: 9999;
      `;

        // 创建标题栏
        this.titleBar = this.iframeDocument.createElement('div');
        this.titleBar.style.cssText = `
        background:rgba(1, 158, 248, 0.26);
        padding: 1px;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      `;

        // 标题文字
        this.titleText = this.iframeDocument.createElement('span');
        this.titleText.textContent = this.config.title;

        // 关闭按钮
        this.closeBtn = this.iframeDocument.createElement('button');
        this.closeBtn.textContent = '×';
        this.closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 15px;
        cursor: pointer;
        padding: 0 6px;
        background: rgba(241, 34, 19, 0.72);
        border-radius: 50%;
      `;


        // 内容容器外围
        this.contentContainerout = this.iframeDocument.createElement('div');
        this.contentContainerout.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 8px;
      `;
        // 内容容器
        this.contentContainer = this.iframeDocument.createElement('div');
        this.contentContainer.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 8px;
      `;

        // 组装元素
        this.titleBar.appendChild(this.titleText);
        this.titleBar.appendChild(this.closeBtn);
        this.floatDiv.appendChild(this.titleBar);
        this.contentContainerout.appendChild(this.contentContainer);
        this.floatDiv.appendChild(this.contentContainerout);
        this.iframeDocument.body.appendChild(this.floatDiv);

        // 初始位置
        this.floatDiv.style.left = `${this.config.x}px`;
        this.floatDiv.style.top = `${this.config.y}px`;

        // 创建迷你图标（无 element 时）
        if (!this.config.element) {
            this.miniIcon = this.iframeDocument.createElement('div');
            this.miniIcon.style.cssText = `
          position: fixed;
          left: ${this.config.bx}px;
          top: ${this.config.by}px;
          width: 20px;
          height: 20px;
          font-size: 15px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
            this.miniIcon.textContent = `${this.config.miniIcon_text}`;
            this.iframeDocument.body.appendChild(this.miniIcon);
        }

        // 初始化显示状态
        this.floatDiv.style.display = 'none';
        if (this.miniIcon) this.miniIcon.style.display = 'block';

        // 绑定元素交互
        if (this.config.element) {
            this.config.element.style.cssText = `
          cursor: pointer;
          user-select: none;
        `;
            const isdblclick = this.config.isdblclick ? 'dblclick' : 'click';
            this.config.element.addEventListener(isdblclick, () => this.show());
        }

        // 初始化内容
        if (this.config.content) {
            this.contentContainer.appendChild(this.config.content);
        }
    }

    _bindEvents() {
        // 拖动事件
        this.titleBar.addEventListener('mousedown', (e) => this._startDrag(e));
        this.iframeDocument.addEventListener('mousemove', (e) => this._drag(e));
        this.iframeDocument.addEventListener('mouseup', () => this._endDrag());

        // 关闭按钮
        this.closeBtn.addEventListener('click', () => this.hide());

        // 迷你图标切换
        if (this.miniIcon) {
            this.miniIcon.addEventListener('click', () => this.toggleVisibility());
        }
    }

    // 拖动方法
    _startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.initialX = parseFloat(this.floatDiv.style.left);
        this.initialY = parseFloat(this.floatDiv.style.top);
    }

    _drag(e) {
        if (!this.isDragging) return;
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        this.floatDiv.style.left = `${this.initialX + dx}px`;
        this.floatDiv.style.top = `${this.initialY + dy}px`;
    }

    _endDrag() {
        this.isDragging = false;
    }

    // 公共方法
    toggleVisibility() {
        const shouldShow = this.floatDiv.style.display === 'none';
        this.floatDiv.style.display = shouldShow ? 'block' : 'none';
        if (this.miniIcon) this.miniIcon.style.display = shouldShow ? 'none' : 'block';
    }

    setContent(element) {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(element);
    }

    show() {
        this.floatDiv.style.display = 'block';
        if (this.miniIcon) this.miniIcon.style.display = 'none';
    }

    hide() {
        this.floatDiv.style.display = 'none';
        if (this.miniIcon) this.miniIcon.style.display = 'block';
    }

    close() {
        this.floatDiv.remove();
        if (this.miniIcon) this.miniIcon.remove();
        if (this.config.element) {
            this.config.element.style.cssText = '';
            this.config.element.removeEventListener('dblclick', () => this.show());
        }
    }
}

/**
 * 基于GM_xmlhttpRequest封装的异步请求函数
 * @param {string} url 请求地址
 * @param {Object|string} [data=""] 表单数据对象或字符串
 * @param {Object} [json=""] JSON数据对象
 * @param {Object} [headers={}] 请求头配置对象
 * @returns {Promise} 返回标准化的响应对象Promise
 * 标准化响应对象包含：
 * - ok: 响应状态是否成功
 * - status: HTTP状态码
 * - statusText: 状态文本
 * - url: 最终响应URL
 * - json(): 解析JSON响应的方法
 * - text(): 获取纯文本响应的方法
 * - blob(): 获取Blob对象的方法
 * - html(): 解析HTML响应的方法
 */
async function gmfetch(url, data = "", json = "", headers = {}) {
    // 构建请求配置对象
    const options = {
        method: data || json ? "POST" : "GET",
        headers: {
            ...headers,
            "Content-Type": data
                ? "application/x-www-form-urlencoded"
                : json
                    ? "application/json;charset=UTF-8"
                    : "text/plain"
        },
        data: data ? new URLSearchParams(data).toString() : null,
        json: json ? JSON.stringify(json) : null,
        timeout: 10000
    };

    // 创建并返回Promise封装的GM_xmlhttpRequest请求
    return new Promise((resolve, reject) => {
        // 配置并发起原生GM_xmlhttpRequest请求
        GM_xmlhttpRequest({
            method: options.method,
            url,
            headers: options.headers,
            data: options.data || options.json,
            // 处理成功响应
            onload: async (response) => {
                try {
                    // 解析响应头中的Content-Type
                    const contentType = response.responseHeaders
                        .split('\n')
                        .find(header => header.toLowerCase().startsWith('content-type'));

                    // 构建标准化的响应对象
                    const mockResponse = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.finalUrl,
                        json: () => JSON.parse(response.responseText),
                        text: () => response.responseText,
                        blob: () => new Blob([response.response]),
                        html: () => new DOMParser().parseFromString(response.responseText, "text/html")
                    };
                    resolve(mockResponse);
                } catch (error) {
                    reject(new Error(`Response parsing failed: ${error.message}`));
                }
            },
            // 处理网络请求错误
            onerror: (error) => {
                reject(new Error(`GM_xmlhttpRequest failed: ${error.statusText}`));
            },
            // 处理请求超时
            ontimeout: () => {
                reject(new Error('Request timed out'));
            },
            timeout: options.timeout
        });
    });
}


/**
 * 基于GM_xmlhttpRequest封装的异步请求函数
 * @param {string} url 请求地址
 * @param {Object|string} [data=""] 表单数据对象或字符串
 * @param {Object} [json=""] JSON数据对象
 * @param {Object} [headers={}] 请求头配置对象
 * @param {number} [cacheTTL=0] 缓存生存时间(毫秒)，0=不缓存
 * @returns {Promise} 返回标准化的响应对象Promise
 * 标准化响应对象包含：
 * - ok: 响应状态是否成功
 * - status: HTTP状态码
 * - statusText: 状态文本
 * - url: 最终响应URL
 * - json(): 解析JSON响应的方法
 * - text(): 获取纯文本响应的方法
 * - blob(): 获取Blob对象的方法
 * - html(): 解析HTML响应的方法
 */
async function gmfetch2(url, data = "", json = "", headers = {}, cacheTTL = 0) {
    // 请求缓存管理
    const cacheKey = `gmfetch_cache_${url}${data ? `_${data}` : ''}${json ? `_${JSON.stringify(json)}` : ''}`;
    
    // 仅对GET请求启用缓存
    if (method === 'GET' && cacheTTL > 0) {
        const cached = localStorage.getItem(cacheKey);
        const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        if (cached && timestamp && (Date.now() - parseInt(timestamp)) < cacheTTL) {
            try {
                const mockResponse = JSON.parse(cached);
                // 增强缓存响应对象
                mockResponse.fromCache = true;
                mockResponse.json = () => Promise.resolve(JSON.parse(mockResponse.responseText));
                mockResponse.text = () => Promise.resolve(mockResponse.responseText);
                return Promise.resolve(mockResponse);
            } catch (e) {
                // 缓存解析失败时继续发起请求
                console.warn('Cache parse failed:', e);
            }
        }
    }

    // 构建请求配置对象
    const options = {
        method: data || json ? "POST" : "GET",
        headers: {
            ...headers,
            "Content-Type": data
                ? "application/x-www-form-urlencoded"
                : json
                    ? "application/json;charset=UTF-8"
                    : "text/plain"
        },
        data: data ? new URLSearchParams(data).toString() : null,
        json: json ? JSON.stringify(json) : null,
        timeout: 10000
    };

    // 创建并返回Promise封装的GM_xmlhttpRequest请求
    return new Promise((resolve, reject) => {
        // 配置并发起原生GM_xmlhttpRequest请求
        GM_xmlhttpRequest({
            method: options.method,
            url,
            headers: options.headers,
            data: options.data || options.json,
            // 处理成功响应
            onload: async (response) => {
                try {
                    // 解析响应头中的Content-Type
                    const contentType = response.responseHeaders
                        .split('\n')
                        .find(header => header.toLowerCase().startsWith('content-type'));

                    // 构建标准化的响应对象
                    const mockResponse = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.finalUrl,
                        responseText: response.responseText,
                        response: response.response,
                        fromCache: false,
                        json: () => JSON.parse(response.responseText),
                        text: () => response.responseText,
                        blob: () => new Blob([response.response]),
                        html: () => new DOMParser().parseFromString(response.responseText, "text/html")
                    };

                    // 缓存处理
                    if (method === 'GET' && cacheTTL > 0 && mockResponse.ok) {
                        try {
                            const cacheData = {
                                ...mockResponse,
                                // 替换函数为可序列化的标记
                                json: 'cached',
                                text: 'cached'
                            };
                            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
                        } catch (e) {
                            console.warn('Cache save failed:', e);
                        }
                    }

                    resolve(mockResponse);
                } catch (error) {
                    reject(new Error(`Response parsing failed: ${error.message}`));
                }
            },
            // ...其他回调保持不变...
            onerror: (error) => {
                reject(new Error(`GM_xmlhttpRequest failed: ${error.statusText}`));
            },
            ontimeout: () => {
                reject(new Error('Request timed out'));
            },
            timeout: options.timeout
        });
    });
}


async function _querykw(keyword) {
    const url = `${homeurl}/index.php?search=${keyword}`;
    const result = []
    if(!keyword) return result
    const response = await gmfetch(url);
    if (!response.ok) {
        return result
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const doc = await response.html();
    const items = $$(".table.sub-table tr", doc)
    items.forEach(item => {
        if (item.textContent.includes(keyword)) {
            // const link = $("a",item).getAttribute('href');
            const link = new URL($("a",item).getAttribute('href'), url).href;
            const titleText = $("a",item).textContent.trim();
            result.push([link,titleText])
        }
    })
    return result
}

async function _querysrts(item) {
    const url = item[0];
    const result = []
    const response = await gmfetch(url);
    if (!response.ok) {
        return []
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const doc = await response.html();
    const items = $$("div.all-sub .col-md-6.col-lg-4",doc)
    items.forEach(item => {
        const atag = $("a",item)
        if(!atag) return
        link = new URL(atag.getAttribute('href'), url).href;
        lang = $$("span",item)[1].textContent
        img = new URL($("img",item).getAttribute('src'), url).href;
        result.push({lang:lang,link:link,img:img})
    })
    return {title:item[1],subtitles:result}

}

async function _queryAllsrts(result) {
    const Allsrts = []
    // 并行处理所有查询请求
    const promises = result.map(async (link) => {
        const srtList = await _querysrts(link)
        // Allsrts.push(...srtList)
        Allsrts.push(srtList)
    })
    // 等待所有请求完成
    await Promise.all(promises)

    return Allsrts
}



/**
 * 生成字幕展示表格
 * @param {Array} subs - 字幕数据数组，每个元素包含title和subtitles
 * @returns {HTMLElement} 生成的表格容器
 */
function createSubtitlesTable2(subs) {
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // 为每个字幕组创建容器
    subs.forEach(({title, subtitles}) => {
        const group = document.createElement('div');
        group.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        `;
        
        // 创建标题
        const titleElem = document.createElement('h3');
        titleElem.textContent = title;
        titleElem.style.cssText = `
            margin: 0;
            color: #2c3e50;
            font-size: 1.2rem;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.5rem;
        `;
        group.appendChild(titleElem);
        
        // 创建字幕项容器
        const itemsContainer = document.createElement('div');
        itemsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.8rem;
        `;
        
        // 添加字幕项
        subtitles.forEach(sub => {
            const item = document.createElement('div');
            item.style.cssText = `
                box-sizing: border-box;
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                text-align: center;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            `;
            
            // 鼠标悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px)';
                item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            });
            
            const aTag = document.createElement('a');
            aTag.href = sub.link;
            aTag.textContent = sub.lang;
            aTag.title = sub.lang;
            aTag.style.cssText = `
                text-decoration: none;
                color: #3498db;
                font-weight: 500;
                display: block;
            `;
            
            // 下载链接悬停效果
            aTag.addEventListener('mouseenter', () => {
                aTag.style.color = '#2980b9';
                aTag.style.textDecoration = 'underline';
            });
            
            aTag.addEventListener('mouseleave', () => {
                aTag.style.color = '#3498db';
                aTag.style.textDecoration = 'none';
            });
            
            item.appendChild(aTag);
            itemsContainer.appendChild(item);
        });
        
        group.appendChild(itemsContainer);
        container.appendChild(group);
    });
    
    return container;
}



/**
 * 生成字幕展示表格
 * @param {Array} subs - 字幕数据数组，每个元素包含title和subtitles
 * @returns {HTMLElement} 生成的表格容器
 */
function createSubtitlesTable(subs) {
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 600px;
        overflow: auto;
    `;
    
    // 当没有字幕时显示提示信息
    if (!subs || subs.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = '未找到字幕';
        noResults.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: #7f8c8d;
            font-size: 1.1rem;
        `;
        container.appendChild(noResults);
        return container;
    }
    
    // 为每个字幕组创建容器
    subs.forEach(({title, subtitles}) => {
        const group = document.createElement('div');
        group.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        `;
        
        // 创建标题
        const titleElem = document.createElement('h3');
        titleElem.textContent = title;
        titleElem.style.cssText = `
            margin: 0;
            color: #2c3e50;
            font-size: 1.2rem;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.5rem;
        `;
        group.appendChild(titleElem);
        
        // 创建字幕项容器，每行最多显示3个
        const itemsContainer = document.createElement('div');
        itemsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.8rem;
        `;
        
        // 添加字幕项
        subtitles.forEach(sub => {
            const item = document.createElement('div');
            item.style.cssText = `
                box-sizing: border-box;
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                text-align: center;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            `;
            
            // 鼠标悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px)';
                item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            });
            
            const aTag = document.createElement('a');
            aTag.href = sub.link;
            aTag.textContent = sub.lang;
            aTag.title = sub.lang;
            aTag.style.cssText = `
                text-decoration: none;
                color: #3498db;
                font-weight: 500;
                display: block;
            `;
            
            // 下载链接悬停效果
            aTag.addEventListener('mouseenter', () => {
                aTag.style.color = '#2980b9';
                aTag.style.textDecoration = 'underline';
            });
            
            aTag.addEventListener('mouseleave', () => {
                aTag.style.color = '#3498db';
                aTag.style.textDecoration = 'none';
            });
            
            item.appendChild(aTag);
            itemsContainer.appendChild(item);
        });
        
        group.appendChild(itemsContainer);
        container.appendChild(group);
    });
    
    return container;
}



function createsearchbox(kw="") {
    const searchbox = document.createElement('div');
    searchbox.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 600px;
        overflow: auto;
    `;

    const inputGroup = document.createElement('div');
    inputGroup.style.cssText = `
        display: flex;
        gap: 0.5rem;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '输入关键字搜索字幕...';
    searchInput.style.cssText = `
        flex: 1;
        padding: 0.7rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s;
        outline: none;
    `;
    
    // 输入框焦点效果
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#3498db';
        searchInput.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#ddd';
        searchInput.style.boxShadow = 'none';
    });

    const searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.style.cssText = `
        padding: 0.7rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    `;
    
    // 按钮悬停效果
    searchButton.addEventListener('mouseenter', () => {
        searchButton.style.background = '#2980b9';
    });
    
    searchButton.addEventListener('mouseleave', () => {
        searchButton.style.background = '#3498db';
    });

    const resultContainer = document.createElement('div');
    resultContainer.id = 'result-container';
    resultContainer.style.cssText = `
        min-height: 100px;
    `;

    searchButton.addEventListener('click', async () => {
        if (!searchInput.value.trim()) return;
        
        resultContainer.innerHTML = "搜索中...";
        resultContainer.style.color = '#7f8c8d';
        resultContainer.style.textAlign = 'center';
        resultContainer.style.padding = '2rem';
        
        try {
            const resultable = await dosearch(searchInput.value);
            resultContainer.innerHTML = '';
            resultContainer.style.color = 'inherit';
            resultContainer.style.textAlign = 'inherit';
            resultContainer.style.padding = '0';
            resultContainer.appendChild(resultable);
        } catch (error) {
            resultContainer.innerHTML = '搜索出错，请重试';
            resultContainer.style.color = '#e74c3c';
            resultContainer.style.textAlign = 'center';
            resultContainer.style.padding = '2rem';
        }
    });

    searchInput.addEventListener('keypress', async (event) => {
        if (event.keyCode === 13) { // 回车键
            searchButton.click();
        }
    });

    inputGroup.appendChild(searchInput);
    inputGroup.appendChild(searchButton);
    searchbox.appendChild(inputGroup);
    searchbox.appendChild(resultContainer);

    return searchbox;
}




async function dosearch(kw){
    result = await _querykw(kw)
    allsubs= await _queryAllsrts(result)
    return createSubtitlesTable(allsubs)
}






function addHoverTip(iframe, element, content, id = "") {
    const iframeDocument = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
    let hoverDiv = null;

    // 创建悬浮提示框
    /**
     * 初始化悬浮框DOM元素
     * 设置基础样式和内容
     * @returns {HTMLDivElement} 创建的悬浮框元素
     */
    const createHoverDiv = () => {
        hoverDiv = iframeDocument.createElement("div");
        hoverDiv.style.cssText = `
				display:none;
				position:absolute;
				background:#f9f9f9;
				border:1px solid #ddd;
				padding:10px;
				z-index:1000;
				box-shadow:0 0 3px rgba(0,0,0,0.5);
				pointer-events: auto;
				backgroundColor = '#ffffae'
			`;
        hoverDiv.innerHTML = content;
        if (id) hoverDiv.id = id;
        iframeDocument.body.appendChild(hoverDiv);
        return hoverDiv;
    };

    hoverDiv = createHoverDiv();

    // 统一事件处理器
    /**
     * 鼠标进入基准元素时的处理逻辑
     * 显示悬浮框并计算定位位置
     */
    const handleElementEnter = (event) => {
        // 显示提示框
        hoverDiv.style.display = "block";

        // 定位逻辑

        hoverDiv.style.left = `${event.clientX + scrollX  + 15}px`;
        hoverDiv.style.top = `${event.clientY + scrollY }px`;
    };

    /**
     * 鼠标离开悬浮框时的处理逻辑
     * 隐藏悬浮框
     */
    const handleHoverDivLeave = () => {
        hoverDiv.style.display = "none";
    };

    // 事件监听优化
    // 使用状态标志位解决鼠标在元素与悬浮框之间的过渡闪烁问题
    let isHoveringDiv = false;

    // 元素鼠标事件绑定
    element.addEventListener("mouseenter", handleElementEnter);
    element.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!isHoveringDiv) {
                handleHoverDivLeave();
            }
        }, 100);
    });

    // 悬浮框自身鼠标事件绑定
    hoverDiv.addEventListener("mouseenter", () => {
        isHoveringDiv = true;
        hoverDiv.style.display = "block";
    });
    hoverDiv.addEventListener("mouseleave", () => {
        isHoveringDiv = false;
        handleHoverDivLeave();
    });

    // 窗口尺寸变化处理
    // 隐藏悬浮框避免定位错误
    window.addEventListener("resize", () => {
        hoverDiv.style.display = "none";
    });
}

function javdbon(){
    
    const kwE = $("a.button.is-white.copy-to-clipboard")
    console.log("javdbon",kwE)
    if (!kwE) return ''
    const keyword = kwE.dataset.clipboardText
    const container=createsearchbox(keyword)
    addHoverTip(window,kwE,container.outerHTML)
}

function getkwjavdb() {
    const kwE = $("a.button.is-white.copy-to-clipboard")
    if (!kwE) return ''
    const keyword = kwE.dataset.clipboardText
    return keyword
}


unsafeWindow.gmfetch=gmfetch;
unsafeWindow._querykw=_querykw;
unsafeWindow._querysrts=_querysrts;
unsafeWindow._queryAllsrts=_queryAllsrts;


// javdbon()
unsafeWindow.myModal = new Modal()
unsafeWindow.myModal.setContent(createsearchbox())