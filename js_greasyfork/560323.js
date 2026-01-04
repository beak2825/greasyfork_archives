// ==UserScript==
// @name         Discuz论坛帖子预览
// @namespace    http://www.discuz.net/
// @version      0.1.0
// @description  轮椅懒人专用,论坛帖子列表页,转化完成后鼠标悬停在帖子标题时，悬浮显示帖子内容
// @author       sexjpg
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560323/Discuz%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560323/Discuz%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==



async function http(url){
    options = {
    "method": "GET",
    "credentials": "include",
    "headers": {
        "Content-Type": "text/html"
    }
}
    return await fetch(url, options).then(res => res.text())
    .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc;
    })
}

function context2doc(context) {
    const doc = new DOMParser().parseFromString(context, 'text/html');
    return doc;
}

function convertImgTag(imgElement) {
    // 如果传入的是字符串，则先转换为DOM元素
    if (typeof imgElement === 'string') {
        const doc = context2doc(imgElement)
        imgElement = doc.querySelector('img');
    }
    
    // 获取file属性的值
    const fileValue = imgElement.getAttribute('file');
    
    // 如果存在file属性，将其值设置给src属性
    if (fileValue) {
        imgElement.setAttribute('src', fileValue);
    }
    
    // 删除指定的属性
    const attributesToRemove = ['onclick', 'onmouseover', 'zoomfile'];
    attributesToRemove.forEach(attr => {
        if (imgElement.hasAttribute(attr)) {
            imgElement.removeAttribute(attr);
        }
    });
    
    // 返回修改后的HTML字符串
    return imgElement.outerHTML;
}

function HoverTip(context, element, content, id = "") {
// 判断上下文类型并获取相应的document和window对象
let contextDocument, contextWindow;

if (context === window || context === document) {
    // 主窗口环境
    contextDocument = document;
    contextWindow = window;
} else if (context.contentDocument || context.contentWindow) {
    // iframe环境
    contextDocument = context.contentDocument || context.contentWindow.document;
    contextWindow = context.contentWindow;
} else {
    // 其他情况，默认使用传入的context作为document
    contextDocument = context;
    contextWindow = context.defaultView || context.parentWindow || window;
}

let hoverDiv = null;

// 创建悬浮提示框
/**
 * 初始化悬浮框DOM元素
 * 设置基础样式和内容
 * @returns {HTMLDivElement} 创建的悬浮框元素
 */
const createHoverDiv = () => {
    hoverDiv = contextDocument.createElement("div");
    hoverDiv.style.cssText = `
            display:none;
            position:absolute;
            background:#f9f9f9;
            border:1px solid #ddd;
            padding:5px;
            z-index:1000;
            box-shadow:0 0 3px rgba(0,0,0,0.5);
            pointer-events: auto;
            background-color: #ffffae;
        `;
    hoverDiv.innerHTML = content;
    if (id) hoverDiv.id = id;
    contextDocument.body.appendChild(hoverDiv);
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
    if (context === window || context === document) {
    // 主窗口环境定位
    hoverDiv.style.left = `${event.clientX + 15}px`;
    hoverDiv.style.top = `${event.clientY}px`;
    } else {
    // iframe环境定位
    const rect = context.getBoundingClientRect();
    const scrollX = contextWindow.scrollX;
    const scrollY = contextWindow.scrollY;
    hoverDiv.style.left = `${event.clientX + scrollX - rect.left + 15}px`;
    hoverDiv.style.top = `${event.clientY + scrollY - rect.top}px`;
    }
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
contextWindow.addEventListener("resize", () => {
    hoverDiv.style.display = "none";
});

return hoverDiv;
}

// 单页面列表获取帖子的列表信息,包含帖子id,标题,url
function getThreads(context=document) {

    const tbodys = context.querySelectorAll('tbody[id^=normalthread]')
    const threadset = new Set()
    tbodys.forEach(tbody => {
        const atag = tbody.querySelector('tr th a[href^=thread-],tr th a[href^="forum.php?mod=viewthread&tid"]')
        if (atag) {
            const href = atag.href
            const tid = gettid(href)
            const title = atag.textContent.trim()
            threadset.add({ tid: tid, title: title, url: href ,element:tbody})
        }

    })

    const threadsArray = [...threadset]
    // Allthreads.push(threadsArray)
    return threadsArray
}

function gettid(url) {
    let tid = null;
    const regex = /thread-(\d+)/;
    const match = url.match(regex);
    if (match) {
        tid = match[1];
    }
    const regex2 = /tid=(\d+)/;
    const match2 = url.match(regex2);
    if (match2) {
        tid = match2[1];
    }

    return tid;
}

// 获取帖子的顶楼内容
async function get1PostContent(thread) {
    if(!thread.url) {
        console.error('没有url',thread)
        return
    }
    if(thread.content) {
        console.warn('已经获取过内容了',thread)
        return
    }
    const response = await http(thread.url);
    let content = response.querySelector('[id^=postmessage_]')
    
    if(content){
        // 获取所有图片元素并转换
        const imgElements = content.querySelectorAll('img[file]');
        imgElements.forEach(img => {
            // 使用你已有的 convertImgTag 函数处理每个图片
            const convertedImgHTML = convertImgTag(img);
            // 将原始img元素替换为转换后的img元素
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = convertedImgHTML;
            img.parentNode.replaceChild(tempDiv.firstElementChild, img);
        });
        
        thread.content = content;
        return content.outerHTML;
    }
    console.error('获取帖子内容失败',thread)
}

async function getallpost(threadsArray, maxConcurrency = 5) {
    //queue是threadsArray里面的元素,如果元素的content属性不为空,则跳过
    threadsArray = threadsArray.filter(thread => !thread.content);
    const queue = [...threadsArray];
    const executing = [];
    // console.log('开始获取帖子内容,并发数:', maxConcurrency);
    // console.log('剩余任务数:', queue.length);
    while (queue.length > 0) {
        // 当并发数未达到上限时，继续添加任务
        while (executing.length < maxConcurrency && queue.length > 0) {
            const thread = queue.shift();
            const promise = get1PostContent(thread)
                .then(content => {
                    thread.content = content;
                    // 从执行队列中移除已完成的任务
                    const index = executing.indexOf(promise);
                    if (index > -1) executing.splice(index, 1);
                });
            
            executing.push(promise);
        }
        
        // 等待至少一个任务完成
        if (executing.length > 0) {
            await Promise.race(executing);
        }
    }
    
    // 等待所有剩余任务完成
    await Promise.all(executing);
    return threadsArray;
}


async function main(){
    Threads = getThreads()

    await getallpost(Threads)


    Threads.forEach((thread)=>{
        HoverTip(document,thread.element,thread.content)

    })
    console.log('转化预览完成,帖子信息', Threads)
}
main()


