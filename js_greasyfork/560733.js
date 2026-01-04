// ==UserScript==
// @name         退货单据上传
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面右上角生成可拖动窗口，支持图片拖放并输出信息到控制台
// @author       ming
// @match        https://www.erp321.com/app/scm/purchaseout/purchaseout.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560733/%E9%80%80%E8%B4%A7%E5%8D%95%E6%8D%AE%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/560733/%E9%80%80%E8%B4%A7%E5%8D%95%E6%8D%AE%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建可拖动的悬浮窗口
    function createDragWindow() {
        const dragWindow = document.createElement('div');
        dragWindow.id = 'image-drag-window';
        dragWindow.innerHTML = `
            <div class="drag-header">
                <span>退货单据上传</span>
            </div>
            <div class="drag-content">
                <div class="drop-area">
                    <p>将图片拖放到此处</p>
                    <p class="hint">支持 PNG、JPG、GIF 格式</p>
                </div>
            </div>
        `;

        // 添加 CSS 样式
        const style = document.createElement('style');
        style.textContent = `
            #image-drag-window {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 250px;
                border: 2px solid #4A90E2;
                border-radius: 8px;
                background-color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            
            .drag-header {
                padding: 10px 15px;
                background-color: #4A90E2;
                color: white;
                cursor: move;
                border-radius: 6px 6px 0 0;
                font-weight: bold;
            }
            
            .drag-content {
                padding: 15px;
            }
            
            .drop-area {
                border: 2px dashed #CCCCCC;
                border-radius: 4px;
                padding: 30px 15px;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .drop-area:hover,
            .drop-area.dragover {
                border-color: #4A90E2;
                background-color: #F0F8FF;
            }
            
            .drop-area p {
                margin: 5px 0;
                color: #666;
            }
            
            .drop-area .hint {
                font-size: 12px;
                color: #999;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(dragWindow);

        return dragWindow;
    }

    // 实现窗口拖动功能
    function makeDraggable(element) {
        let isDragging = false;
        let isCollapsed = false;
        let originalWidth = '250px';
        let originalPosition = { left: '20px', top: '20px' };
        let openStatePosition = originalPosition;
        let collapseStatePosition = originalPosition;
        let startX, startY;
        let collapseTimeout = null;
        
        const header = element.querySelector('.drag-header');
        const content = element.querySelector('.drag-content');
        
        // 添加过渡效果
        element.style.transition = 'width 0.3s ease, left 0.3s ease';
        
        if (header) {
            header.onmousedown = dragMouseDown;
        }
        
        function dragMouseDown(e) {
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            element.style.zIndex = '10000'; // 拖动时提高层级
            
            // 如果窗口处于折叠状态，先展开
            if (isCollapsed) {
                expandWindow();
            }
        }
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - startX;
                const y = e.clientY - startY;
                
                // 限制在窗口范围内
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                const finalX = Math.max(0, Math.min(maxX, x));
                const finalY = Math.max(0, Math.min(maxY, y));
                
                element.style.left = finalX + 'px';
                element.style.top = finalY + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.zIndex = '9999';
                
                // 保存当前位置到本地存储
                const position = {
                    left: element.style.left,
                    top: element.style.top
                };
                localStorage.setItem('imageDragWindowPosition', JSON.stringify(position));
                
                // 记忆当前状态的位置
                if (isCollapsed) {
                    collapseStatePosition = position;
                } else {
                    openStatePosition = position;
                }
                
                // 检查是否需要吸附到边缘
                checkEdgeSnap();
            }
        });
        
        // 检查是否需要吸附到边缘的函数
        function checkEdgeSnap() {
            const threshold = 10; // 距离边缘的阈值
            const currentLeft = parseInt(element.style.left) || 20;
            const currentTop = parseInt(element.style.top) || 20;
            
            // 保存原始位置
            originalPosition = { left: element.style.left, top: element.style.top };
            openStatePosition = { left: element.style.left, top: element.style.top };
            
            // 检查是否靠近左侧边缘
            if (currentLeft <= threshold) {
                collapseWindow('left');
            }
            // 检查是否靠近右侧边缘
            else if (currentLeft >= window.innerWidth - element.offsetWidth - threshold) {
                collapseWindow('right');
            }
        }
        
        // 折叠窗口函数
        function collapseWindow(edge) {
            isCollapsed = true;
            
            // 隐藏内部内容
            if (content) {
                content.style.display = 'none';
            }
            
            // 改变窗口宽度
            element.style.width = '30px';
            
            // 保存当前打开状态的位置
            openStatePosition = { left: element.style.left, top: element.style.top };
            
            // 设置位置
            if (edge === 'left') {
                element.style.left = '0px';
            } else {
                element.style.left = (window.innerWidth - 30) + 'px';
            }
            
            // 保存折叠状态的位置
            collapseStatePosition = { left: element.style.left, top: element.style.top };
            
            // 改变标题栏内容
            if (header) {
                header.textContent = '📷';
                header.style.padding = '10px 5px';
                header.style.textAlign = 'center';
            }
            
            // 保存折叠状态
            const collapseState = {
                isCollapsed: true,
                side: edge,
                position: collapseStatePosition
            };
            localStorage.setItem('imageDragCollapseState', JSON.stringify(collapseState));
        }
        
        // 展开窗口函数
        function expandWindow() {
            isCollapsed = false;
            
            // 显示内部内容
            if (content) {
                content.style.display = 'block';
            }
            
            // 恢复原始宽度和位置
            element.style.width = originalWidth;
            element.style.left = openStatePosition.left;
            element.style.top = openStatePosition.top;
            
            // 恢复标题栏内容
            if (header) {
                header.textContent = '图片拖放窗口';
                header.style.padding = '10px 15px';
                header.style.textAlign = 'left';
            }
            
            // 清除折叠状态
            localStorage.removeItem('imageDragCollapseState');
        }
        
        // 添加鼠标进入事件，当鼠标靠近折叠的窗口时展开
        element.addEventListener('mouseenter', () => {
            if (isCollapsed) {
                expandWindow();
            }
            
            // 清除自动折叠定时器
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
                collapseTimeout = null;
            }
        });
        
        // 鼠标离开事件监听器，0.5秒后自动收起
        element.addEventListener('mouseleave', () => {
            if (!isDragging && !isCollapsed) {
                collapseTimeout = setTimeout(() => {
                    // 直接检查当前位置是否靠近边缘
                    const threshold = 10;
                    const currentLeft = parseInt(element.style.left) || 20;
                    const isNearLeftEdge = currentLeft <= threshold;
                    const isNearRightEdge = currentLeft >= window.innerWidth - element.offsetWidth - threshold;
                    
                    if (isNearLeftEdge) {
                        collapseWindow('left');
                    } else if (isNearRightEdge) {
                        collapseWindow('right');
                    }
                }, 100);
            }
        });
        
        // 从本地存储加载位置和折叠状态
        const savedPosition = localStorage.getItem('imageDragWindowPosition');
        const savedCollapseState = localStorage.getItem('imageDragCollapseState');
        
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            element.style.left = position.left;
            element.style.top = position.top;
            originalPosition = { left: position.left, top: position.top };
            openStatePosition = { left: position.left, top: position.top };
            collapseStatePosition = { left: position.left, top: position.top };
        }
        
        // 如果有保存的折叠状态，恢复折叠
        if (savedCollapseState) {
            const collapseState = JSON.parse(savedCollapseState);
            if (collapseState.isCollapsed) {
                if (collapseState.position) {
                    collapseStatePosition = collapseState.position;
                }
                // 延迟执行，确保DOM元素已创建
                setTimeout(() => {
                    collapseWindow(collapseState.side);
                }, 100);
            }
        }
    }

    // 添加图片拖放功能
    function addDragDropFunctionality(windowElement) {
        const dropArea = windowElement.querySelector('.drop-area');
        
        // 阻止默认拖放行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 添加拖放视觉反馈
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('dragover');
        }
        
        function unhighlight() {
            dropArea.classList.remove('dragover');
        }
        
        // 处理文件拖放
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            processFiles(files);
        }
        
        // 自动输入退货单号并点击搜索按钮
        async function autoInputAndSearch(ioId) {
            try {
                // 查找io_id输入框
                const ioIdInput = document.getElementById('io_id');
                if (ioIdInput) {
                    ioIdInput.value = ioId;
                    // 触发必要的事件
                    ioIdInput.dispatchEvent(new Event('input'));
                    ioIdInput.dispatchEvent(new Event('change'));
                    
                    // 点击搜索按钮
                    clickSearchButton();
                } else {
                    // 尝试使用XPath查找
                    const xpathResult = document.evaluate('//*[@id="io_id"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const targetInput = xpathResult.singleNodeValue;
                    if (targetInput) {
                        targetInput.value = ioId;
                        targetInput.dispatchEvent(new Event('input'));
                        targetInput.dispatchEvent(new Event('change'));
                        
                        // 点击搜索按钮
                        clickSearchButton();
                    } else {
                        console.error('未找到io_id输入框');
                    }
                }
            } catch (error) {
                console.error('自动输入和搜索失败:', error);
            }
        }
        
        // 点击搜索按钮
        function clickSearchButton() {
            try {
                // 使用XPath查找搜索按钮
                const xpath = '//*[@id="form1"]/table[7]/tbody/tr[1]/td/div[2]/ul/li[25]/a[1]';
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const searchButton = result.singleNodeValue;
                
                if (searchButton) {
                    // 模拟点击搜索按钮
                    searchButton.click();
                    // 搜索按钮已点击
                } else {
                    console.error('未找到搜索按钮');
                    alert('未找到搜索按钮');
                }
            } catch (error) {
                console.error('点击搜索按钮时出错:', error);
                alert('点击搜索按钮失败');
            }
        }
        
        // 从Cookie中获取指定名称的值
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
        
        // 统一处理响应文本，移除可能的"0|"前缀并解析为JSON
        function parseResponse(responseText) {

            try {
                // 如果responseText已经是对象，直接返回
                if (typeof responseText === 'object' && responseText !== null) {
                    return responseText;
                }
                
                // 如果responseText是null或undefined，返回null
                if (responseText == null) {
                    return null;
                }
                
                // 确保responseText是字符串
                let processedText = responseText;
                if (typeof processedText !== 'string') {
                    // 尝试将其转换为字符串
                    processedText = String(processedText);
                }
                
                // 移除可能的"0|"前缀
                if (typeof processedText === 'string' && processedText.startsWith('0|')) {
                    processedText = processedText.substring(2);
                }
                
                // 解析为JSON
                // 先检查是否为空字符串
                if (processedText.trim() === '') {
                    return null;
                }
                return JSON.parse(processedText);
            } catch (error) {
                return null;
            }
        }
        
        // 从图片名称中提取退货单号和开单单号
        function extractOrderIds(fileName) {
            // 格式：{货主名称}{退货单号}.{开单单号}.{格式}
            // 货主名称可以包含中文字符
            // 使用正则表达式提取各部分
            const regex = /^(.+?)(\d+)\.(\d+)\.(png|jpg|jpeg|gif)$/i;
            const match = fileName.match(regex);
            if (match) {
                return {
                    shipperName: match[1],    // 货主名称
                    returnOrderId: match[2],  // 退货单号
                    orderId: match[3]         // 开单单号
                };
            }
            return null;
        }
        
        // 发送HTTP请求获取SKU数据
        async function fetchSkuData(returnOrderId, orderId) {
            try {
                const u_co_id = getCookie('u_co_id');
                if (!u_co_id) {
                    // console.error('无法获取cookie中的u_co_id');
                    return null;
                }
                
                // 动态获取页面上的__VIEWSTATE和__VIEWSTATEGENERATOR值
                let viewState = '';
                let viewStateGenerator = '';
                
                const viewStateElement = document.getElementById('__VIEWSTATE');
                const viewStateGeneratorElement = document.getElementById('__VIEWSTATEGENERATOR');
                
                if (viewStateElement) {
                    viewState = viewStateElement.value;
                }
                
                if (viewStateGeneratorElement) {
                    viewStateGenerator = viewStateGeneratorElement.value;
                }
                
                const timestamp = Date.now();
                const url = `https://www.erp321.com/app/scm/purchaseout/purchaseout_Item.aspx?io_id=${returnOrderId}&lwh_id=null&IsArchive=false&owner_co_id=${u_co_id}&authorize_co_id=${u_co_id}&ts___=${timestamp}&am___=LoadDataToJSON`;
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('owner_co_id', u_co_id);
                formData.append('authorize_co_id', u_co_id);
                formData.append('io_id', returnOrderId);
                formData.append('lwh_id', 'null');
                formData.append('IsArchive', 'false');
                
                // 发送请求获取SKU数据
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                if (!response.ok) {
                    return null;
                }
                
                const htmlResponse = await response.text();
                
                // 使用DOMParser解析HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlResponse, 'text/html');
                
                // 查找id为_jt_data的元素
                const dataDiv = doc.getElementById('_jt_data');
                if (!dataDiv) {
                    return null;
                }
                // 使用统一的解析函数处理响应内容
                const responseJson = parseResponse(dataDiv.textContent);
               
                if (!responseJson) {
                    return null;
                }
                
                // 生成备注字符串
                let remark = null;
                // 如果开单单号是001，备注信息固定为:"商家在群里确认无误"
                if (orderId === '001') {
                    remark = '商家在群里确认无误';
                } else {
                    // 直接使用sku前缀+开单单号生成备注
                    // 从第一个商品中获取sku_id
                    if (responseJson.datas && responseJson.datas.length > 0) {
                        const firstItem = responseJson.datas[0];
                        if (firstItem.sku_id !== undefined && firstItem.sku_id !== null) {
                            const skuIdStr = String(firstItem.sku_id);
                            const skuPrefix = skuIdStr.substring(0, 5);
                            remark = `${skuPrefix}${orderId}`;
                        }
                    }
                    
                    // 如果没有从datas中获取到sku_id，使用默认值
                    if (!remark) {
                        // 尝试从其他地方获取sku_id或使用默认前缀
                        remark = `DEFAULT${orderId}`;
                    }
                }
                
                // 提取所有需要的数据
                const extractedData = {
                    remark: remark,
                    io_id: responseJson.io_id || returnOrderId,
                    creator_name: responseJson.creator_name || "",
                    __KeyData: responseJson.__KeyData || "",
                    f_status: responseJson.f_status || "",
                    pa: responseJson.pa || "",
                    out_io_id: responseJson.out_io_id || "",
                    io_date: responseJson.io_date || "",
                    type: responseJson.type || "",
                    status: responseJson.status || "",
                    presend_status: responseJson.presend_status || "",
                    seller_flag: responseJson.seller_flag || "",
                    is_print: responseJson.is_print || false,
                    pa_status: responseJson.pa_status || "",
                    print_count: responseJson.print_count || "",
                    is_print_express: responseJson.is_print_express || false,
                    warehouse: responseJson.warehouse || "",
                    created: responseJson.created || "",
                    receiver_name_en: responseJson.receiver_name_en || "",
                    total_qty: responseJson.total_qty || "",
                    total_sku_ids: responseJson.total_sku_ids || "",
                    total_amount: responseJson.total_amount || "",
                    total_sale_base_amount: responseJson.total_sale_base_amount || "",
                    free_amount: responseJson.free_amount || "",
                    wms_co_name: responseJson.wms_co_name || "",
                    link_io_id: responseJson.link_io_id || "",
                    lwh_id: responseJson.lwh_id || "",
                    lwh_name: responseJson.lwh_name || "",
                    multiexpress_count: responseJson.multiexpress_count || "",
                    labels: responseJson.labels || "",
                    receiver_mobile_en: responseJson.receiver_mobile_en || "",
                    receiver_name: responseJson.receiver_name || "",
                    receiver_state: responseJson.receiver_state || "",
                    receiver_city: responseJson.receiver_city || "",
                    receiver_district: responseJson.receiver_district || "",
                    receiver_address: responseJson.receiver_address || "",
                    archiver: responseJson.archiver || "",
                    o_id: responseJson.o_id || "",
                    archived: responseJson.archived || "",
                    wave_id: responseJson.wave_id || "",
                    logistics_company: responseJson.logistics_company || "",
                    l_id: responseJson.l_id || "",
                    modified: responseJson.modified || "",
                    so_id: responseJson.so_id || "",
                    total_weight: responseJson.total_weight || "",
                    outerSyncStatus: responseJson.outerSyncStatus || "",
                    associated_io_ids: responseJson.associated_io_ids || "",
                    lc_id: responseJson.lc_id || "",
                    wh_id: responseJson.wh_id || "",
                    seller_id: responseJson.seller_id || "",
                    creator: responseJson.creator || "",
                    wms_co_id: responseJson.wms_co_id || "",
                    link_co_id: responseJson.link_co_id || "",
                    l_id_type: responseJson.l_id_type || ""
                };
                
                return extractedData;
            } catch (error) {
                // console.error('fetchSkuData出错:', error);
                return null;
            }
        }
        
        // 发送请求获取构建__CALLBACKPARAM所需的数据
        async function fetchCallbackData(io_id) {
            try {
                const u_co_id = getCookie('u_co_id');
                if (!u_co_id) {
                    console.error('无法获取cookie中的u_co_id');
                    return null;
                }
                
                const timestamp = Date.now();
                const url = `https://www.erp321.com/app/scm/purchaseout/purchaseout.aspx?_c=jst-epaas&ts___=${timestamp}&am___=LoadDataToJSON`;
                
                // 动态获取页面上的__VIEWSTATE和__VIEWSTATEGENERATOR值
                let viewState = '';
                let viewStateGenerator = '';
                
                const viewStateElement = document.getElementById('__VIEWSTATE');
                const viewStateGeneratorElement = document.getElementById('__VIEWSTATEGENERATOR');
                
                if (viewStateElement) {
                    viewState = viewStateElement.value;
                }
                
                if (viewStateGeneratorElement) {
                    viewStateGenerator = viewStateGeneratorElement.value;
                }
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('owner_co_id', u_co_id);
                formData.append('authorize_co_id', u_co_id);
                formData.append('io_id', io_id);
                formData.append('_jt_page_size', '100');
                formData.append('__CALLBACKID', 'JTable1');
                
                // 构建__CALLBACKPARAM
                const callbackParam = {
                    "Method": "LoadDataToJSON",
                    "Args": [
                        "1", 
                        `[{\"k\":\"io_id\",\"v\":\"${io_id}\",\"c\":\"=\"}]`, 
                        "{}"
                    ]
                };
                
                formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));
                
                // 发送请求
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) {
                    return null;
                }
                
                const responseText = await response.text();
                
                // 使用统一的响应解析函数处理响应
                const responseJson = parseResponse(responseText);
                
                if (!responseJson) {
                    return null;
                }
                
                // 从ReturnValue字段中提取数据
                if (responseJson.ReturnValue !== undefined && responseJson.ReturnValue !== null) {
                    const returnValueJson = parseResponse(responseJson.ReturnValue);
                    
                    if (returnValueJson) {
                        // 从datas字段中提取具体的记录
                        if (returnValueJson.datas && returnValueJson.datas.length > 0) {
                            return returnValueJson.datas[0];
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
                
            } catch (error) {
                console.error('获取回调数据失败:', error);
                return null;
            }
        }
        
        // 创建质检报告
        async function createQcReport(io_id, u_co_id) {
            try {
                const timestamp = Date.now();
                // 获取当前日期时间，格式：YYYY-MM-DD
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
                
                const qc_date = `${year}-${month}-${day}`;
                const created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
                
                // 从cookie中获取用户信息
                const creator = getCookie('u_id') || '';
                let qc_user = getCookie('u_name') || '';
                
                // URL解码qc_user
                if (qc_user) {
                    try {
                        qc_user = decodeURIComponent(qc_user);
                    } catch (error) {
                        console.error('解码u_name失败:', error);
                    }
                }
                
                // 动态获取qc.aspx页面的__VIEWSTATE和__VIEWSTATEGENERATOR
                const qcPageUrl = `https://www.erp321.com/app/scm/qc/qc.aspx?module=purchaseOut&io_id=${io_id}&owner_co_id=${u_co_id}&authorize_co_id=${u_co_id}&_t=${timestamp}&_h=800px&_float=true`;
                
                const pageResponse = await fetch(qcPageUrl, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!pageResponse.ok) {
                    return false;
                }
                
                const pageHtml = await pageResponse.text();
                
                // 使用正则表达式提取__VIEWSTATE和__VIEWSTATEGENERATOR值
                const viewStateMatch = pageHtml.match(/id="__VIEWSTATE"\s+value="([^"]+)"/i);
                const viewStateGeneratorMatch = pageHtml.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/i);
                
                const viewState = viewStateMatch ? viewStateMatch[1] : '';
                const viewStateGenerator = viewStateGeneratorMatch ? viewStateGeneratorMatch[1] : '';
                
                if (!viewState || !viewStateGenerator) {
                    return false;
                }
                
                const url = `https://www.erp321.com/app/scm/qc/qc.aspx?module=purchaseOut&io_id=${io_id}&owner_co_id=${u_co_id}&authorize_co_id=${u_co_id}&_t=${timestamp}&_h=800px&_float=true&ts___=${timestamp}&am___=Save`;
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('__CALLBACKID', 'JTable1');
                
                // 构建__CALLBACKPARAM
                const callbackObject = {
                    "qc_id": "",
                    "result": "退货",
                    "qc_date": qc_date,
                    "qc_user": qc_user,
                    "qc_rate": "",
                    "type": "",
                    "status": "待审核",
                    "remark": "",
                    "created": created,
                    "co_id": u_co_id,
                    "creator": creator,
                    "po_id": "",
                    "io_id": io_id,
                    "enclosure": "",
                    "__KeyData": ""
                };
                
                const callbackParam = {
                    "Method": "Save",
                    "Args": [JSON.stringify(callbackObject)]
                };
                
                formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));
                
                // 发送请求
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) {
                    return false;
                }
                
                const responseText = await response.text();
                
                // 使用统一的响应解析函数处理响应
                const responseJson = parseResponse(responseText);
                if (!responseJson) {
                    // console.error('无法解析响应');
                    return false;
                }
                
                if (responseJson.IsSuccess) {
                    // 质检报告创建成功
                    if (responseJson.ReturnValue !== undefined && responseJson.ReturnValue !== null) {
                        const returnData = parseResponse(responseJson.ReturnValue);
                        if (returnData && returnData.data) {
                            const qc_id = returnData.data.qc_id;
                            // console.log('质检报告创建成功，qc_id:', qc_id);
                            return qc_id; // 返回qc_id
                        } else {
                            // console.error('质检报告创建失败: 无法解析ReturnValue或缺少data字段');
                            return false;
                        }
                    } else {
                        // console.error('质检报告创建失败: ReturnValue为null或undefined');
                        return false;
                    }
                } else {
                    // console.error('质检报告创建失败:', responseJson.ExceptionMessage || responseJson.Message);
                    return false;
                }
            } catch (error) {
                // console.error('创建质检报告时出错:', error);
                return false;
            }
        }
        
        // 发送请求修改备注
        async function saveRemark(extractedData, file) {
            try {
                const u_co_id = getCookie('u_co_id');
                if (!u_co_id) {
                    // console.error('无法获取cookie中的u_co_id');
                    return false;
                }
                
                // 动态获取页面上的__VIEWSTATE和__VIEWSTATEGENERATOR值
                let viewState = '/wEPDwULLTEzODU3Mzg5MDJkZDgxdzVuHrsAVaXjc7brzQqTBsGq';
                let viewStateGenerator = '86E98060';
                
                const viewStateElement = document.getElementById('__VIEWSTATE');
                const viewStateGeneratorElement = document.getElementById('__VIEWSTATEGENERATOR');
                
                if (viewStateElement) {
                    viewState = viewStateElement.value;
                }
                
                if (viewStateGeneratorElement) {
                    viewStateGenerator = viewStateGeneratorElement.value;
                }
                
                const timestamp = Date.now();
                const url = `https://www.erp321.com/app/scm/purchaseout/purchaseout.aspx?_c=jst-epaas&ts___=${timestamp}&am___=Save`;
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('owner_co_id', u_co_id);
                formData.append('authorize_co_id', u_co_id);
                formData.append('io_id', extractedData.io_id);
                formData.append('_jt_page_size', '25');
                formData.append('__CALLBACKID', 'JTable1');
                
                // 构建__CALLBACKPARAM，Args应该是字符串数组
                const callbackObject = {
                    "f_status": extractedData.f_status,
                    "pa": extractedData.pa,
                    "out_io_id": extractedData.out_io_id,
                    "io_date": extractedData.io_date,
                    "io": extractedData.io_id, // 使用io_id作为io字段的值
                    "io_id": extractedData.io_id,
                    "type": extractedData.type,
                    "status": extractedData.status,
                    "presend_status": extractedData.presend_status,
                    "seller_flag": extractedData.seller_flag,
                    "is_print": extractedData.is_print,
                    "pa_status": extractedData.pa_status,
                    "print_count": extractedData.print_count,
                    "is_print_express": extractedData.is_print_express,
                    "creator_name": extractedData.creator_name,
                    "warehouse": extractedData.warehouse,
                    "created": extractedData.created,
                    "receiver_name_en": extractedData.receiver_name_en,
                    "total_qty": extractedData.total_qty,
                    "total_sku_ids": extractedData.total_sku_ids,
                    "total_amount": extractedData.total_amount,
                    "remark": extractedData.remark,
                    "total_sale_base_amount": extractedData.total_sale_base_amount,
                    "free_amount": extractedData.free_amount,
                    "wms_co_name": extractedData.wms_co_name,
                    "link_io_id": extractedData.link_io_id,
                    "lwh_id": extractedData.lwh_id,
                    "lwh_name": extractedData.lwh_name,
                    "multiexpress_count": extractedData.multiexpress_count,
                    "labels": extractedData.labels,
                    "receiver_mobile_en": extractedData.receiver_mobile_en,
                    "receiver_name": extractedData.receiver_name,
                    "receiver_state": extractedData.receiver_state,
                    "receiver_city": extractedData.receiver_city,
                    "receiver_district": extractedData.receiver_district,
                    "receiver_address": extractedData.receiver_address,
                    "archiver": extractedData.archiver,
                    "o_id": extractedData.o_id,
                    "archived": extractedData.archived,
                    "wave_id": extractedData.wave_id,
                    "logistics_company": extractedData.logistics_company,
                    "l_id": extractedData.l_id,
                    "modified": extractedData.modified,
                    "so_id": extractedData.so_id,
                    "total_weight": extractedData.total_weight,
                    "outerSyncStatus": extractedData.outerSyncStatus,
                    "associated_io_ids": extractedData.associated_io_ids,
                    "lc_id": extractedData.lc_id,
                    "wh_id": extractedData.wh_id,
                    "seller_id": extractedData.seller_id,
                    "creator": extractedData.creator,
                    "wms_co_id": extractedData.wms_co_id,
                    "link_co_id": extractedData.link_co_id,
                    "l_id_type": extractedData.l_id_type,
                    "__KeyData": extractedData.__KeyData
                };
                
                const callbackParam = {
                    "Method": "Save",
                    "Args": [JSON.stringify(callbackObject)]
                };
                
                const callbackParamStr = JSON.stringify(callbackParam);
                formData.append('__CALLBACKPARAM', callbackParamStr);
                
                // 发送请求
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) {
                    return false;
                }
                
                const responseText = await response.text();
                
                // 使用统一的响应解析函数处理响应
                const responseJson = parseResponse(responseText);
                if (!responseJson) {
                    // console.error('无法解析响应');
                    return true;
                }
                
                if (responseJson.IsSuccess) {
                    if (responseJson.ReturnValue !== undefined && responseJson.ReturnValue !== null) {
                        const returnData = parseResponse(responseJson.ReturnValue);
                        if (returnData && returnData.data) {
                            // console.log(returnData.data.remark); // 只输出最终的备注
                            
                            // 备注修改成功后，创建质检报告
                            const qc_id = await createQcReport(extractedData.io_id, u_co_id);
                    
                            // 如果创建质检报告成功且有qc_id，上传图片
                            if (qc_id && file) {
                                // console.log('质检报告创建成功，qc_id:', qc_id, '开始获取上传URL');
                                // 获取上传URL
                                const uploadData = await getUploadUrl(file.name);
                                if (uploadData && uploadData.uploadUrl) {
                                    // console.log('上传URL获取成功:', uploadData.uploadUrl);
                                    // console.log('上传数据详情:', uploadData);
                                    // 上传图片
                                    const uploadSuccess = await uploadImage(uploadData.uploadUrl, file);
                                    if (uploadSuccess) {
                                        // console.log('图片上传成功，开始保存图片信息');
                                        // 保存图片信息
                                        const saveSuccess = await saveImage(qc_id, uploadData, file.name);
                                        // console.log('图片信息保存结果:', saveSuccess);
                                    } else {
                                        // console.error('图片上传失败');
                                    }
                                } else {
                                    // console.error('获取上传URL失败或上传URL为空');
                                    // console.error('上传数据:', uploadData);
                                }
                            } else {
                                // console.error('qc_id不存在或文件对象为空，无法上传图片');
                            }
                        
                        // 自动输入退货单号并点击搜索按钮
                        autoInputAndSearch(extractedData.io_id);
                        } else {
                            // console.error('备注修改成功但无法解析ReturnValue');
                        }
                    } else {
                        // console.error('备注修改成功但ReturnValue为null或undefined');
                    }
                } else {
                    // console.error('备注修改失败:', responseJson.ExceptionMessage || responseJson.Message);
                }
                
                return true;
            } catch (error) {
                // console.error('保存备注时出错:', error);
                return false;
            }
        }
        
        // 获取图片上传URL
        async function getUploadUrl(fileName) {
            try {
                const timestamp = Date.now();
                const ajaxPageUrl = `https://www.erp321.com/app/FMS/fmscommon/oss/ajaxpage.aspx`;
                
                // 1. 首先获取ajaxpage.aspx页面，从中提取正确的__VIEWSTATE和__VIEWSTATEGENERATOR
                // console.log('正在获取ajaxpage.aspx页面...');
                const pageResponse = await fetch(ajaxPageUrl, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!pageResponse.ok) {
                    // console.error('获取ajaxpage.aspx页面失败:', pageResponse.status, pageResponse.statusText);
                    return null;
                }
                
                const pageHtml = await pageResponse.text();
                
                // 使用正则表达式提取__VIEWSTATE和__VIEWSTATEGENERATOR值
                const viewStateMatch = pageHtml.match(/id="__VIEWSTATE"\s+value="([^"]+)"/i);
                const viewStateGeneratorMatch = pageHtml.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/i);
                
                const viewState = viewStateMatch ? viewStateMatch[1] : '';
                const viewStateGenerator = viewStateGeneratorMatch ? viewStateGeneratorMatch[1] : '';
                
                // console.log('从页面提取的__VIEWSTATE:', viewState);
                // console.log('从页面提取的__VIEWSTATEGENERATOR:', viewStateGenerator);
                
                if (!viewState || !viewStateGenerator) {
                    // console.error('未能从页面提取到有效的__VIEWSTATE或__VIEWSTATEGENERATOR');
                    return null;
                }
                
                // 2. 使用提取到的令牌发送POST请求获取上传URL
                const url = `https://www.erp321.com/app/FMS/fmscommon/oss/ajaxpage.aspx?ts___=${timestamp}&am___=GetUploadUrlWithLimit`;
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('__CALLBACKID', 'ACall1');
                formData.append('methodHidden', 'GetUploadUrlWithLimit');
                
                // 构建__CALLBACKPARAM
                const callbackParam = {
                    "Method": "GetUploadUrlWithLimit",
                    "Args": [fileName, "3650", "-1"],
                    "CallControl": "{page}"
                };
                
                formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));
                
                // 发送请求
                // console.log('正在请求上传URL:', url);
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) {
                    // console.error('获取上传URL响应失败:', response.status, response.statusText);
                    return null;
                }
                
                const responseText = await response.text();
                // console.log('获取上传URL响应:', responseText);
                
                // 使用统一的响应解析函数处理响应
                const responseJson = parseResponse(responseText);
                if (!responseJson) {
                    // console.error('无法解析响应');
                    return null;
                }
                
                // console.log('解析后的响应JSON:', responseJson);
                if (responseJson.IsSuccess) {
                    if (responseJson.ReturnValue !== undefined && responseJson.ReturnValue !== null) {
                        const returnValueJson = parseResponse(responseJson.ReturnValue);
                        if (returnValueJson) {
                            // console.log('ReturnValue JSON:', returnValueJson);
                            // 确保返回的对象包含docid和docurl字段
                            return {
                                ...returnValueJson,
                                docid: returnValueJson.docid || returnValueJson.docId || '',
                                docurl: returnValueJson.docurl || returnValueJson.docUrl || ''
                            };
                        } else {
                            // console.error('无法解析ReturnValue');
                        }
                    } else {
                        // console.error('ReturnValue为null或undefined');
                    }
                } else {
                    // console.error('获取上传URL失败:', responseJson.ExceptionMessage || responseJson.Message);
                }
                
                return null;
            } catch (error) {
                console.error('获取上传URL时出错:', error);
                return null;
            }
        }
        
        // 上传图片
        async function uploadImage(uploadUrl, file) {
            try {
                // 正在上传图片
                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });
                
                // 图片上传完成
                return response.ok;
            } catch (error) {
                console.error('上传图片时出错:', error);
                return false;
            }
        }
        
        // 保存图片信息
        async function saveImage(qc_id, returnValueJson, fileName) {
            try {
                const timestamp = Date.now();
                
                // 1. 首先获取UpLoadFile.aspx页面，从中提取正确的__VIEWSTATE和__VIEWSTATEGENERATOR
                const uploadPageUrl = `https://www.erp321.com/app/scm/purchase/UpLoadFile.aspx?model=purchaseOut&po_id=&qc_id=${qc_id}&_t=${timestamp}&_h=400px&_float=true`;
                // 正在获取UpLoadFile.aspx页面
                
                const pageResponse = await fetch(uploadPageUrl, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!pageResponse.ok) {
                    console.error('获取UpLoadFile.aspx页面失败:', pageResponse.status, pageResponse.statusText);
                    return false;
                }
                
                const pageHtml = await pageResponse.text();
                
                // 使用正则表达式提取__VIEWSTATE和__VIEWSTATEGENERATOR值
                const viewStateMatch = pageHtml.match(/id="__VIEWSTATE"\s+value="([^"]+)"/i);
                const viewStateGeneratorMatch = pageHtml.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/i);
                
                const viewState = viewStateMatch ? viewStateMatch[1] : '';
                const viewStateGenerator = viewStateGeneratorMatch ? viewStateGeneratorMatch[1] : '';
                
                // 已获取页面状态参数
                
                if (!viewState || !viewStateGenerator) {
                    console.error('未能从页面提取到有效的__VIEWSTATE或__VIEWSTATEGENERATOR');
                    return false;
                }
                
                // 2. 提取docid和docurl
                const docid = returnValueJson.docid;
                let docurl = returnValueJson.docurl;
                
                // 已提取docid和docurl
                
                // 从docurl中剔除末尾的docid
                if (docurl && docid && typeof docurl.endsWith === 'function') {
                    if (docurl.endsWith(docid)) {
                        docurl = docurl.slice(0, -docid.length);
                        // 已处理docurl
                    }
                }
                
                // 3. 发送保存图片信息的请求
                const url = `https://www.erp321.com/app/scm/purchase/UpLoadFile.aspx?model=purchaseOut&po_id=&qc_id=${qc_id}&_t=${timestamp}&_h=400px&_float=true&ts___=${timestamp}&am___=Save`;
                // 正在保存图片信息
                
                // 构建FormData
                const formData = new FormData();
                formData.append('__VIEWSTATE', viewState);
                formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
                formData.append('__CALLBACKID', 'ACall1');
                formData.append('methodHidden', 'Save'); // 添加methodHidden字段
                
                // 构建__CALLBACKPARAM
                const callbackObject = {
                    "key": docid || '',
                    "domain": docurl || '',
                    "name": fileName
                };
                
                const callbackParam = {
                    "Method": "Save",
                    "Args": [JSON.stringify([callbackObject])],
                    "CallControl": "{page}"
                };
                
                formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));
                
                // 发送请求
                // 已准备保存图片信息的请求参数
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) {
                    console.error('保存图片信息响应失败:', response.status, response.statusText);
                    return false;
                }
                
                const responseText = await response.text();
                // 保存图片信息响应已收到
                
                // 使用统一的响应解析函数处理响应
                const responseJson = parseResponse(responseText);
                if (!responseJson) {
                    console.error('无法解析响应');
                    return false;
                }
                
                // 已解析保存图片信息响应
                return responseJson.IsSuccess;
            } catch (error) {
                console.error('保存图片信息时出错:', error);
                return false;
            }
        }
        
        // 处理文件
        async function processFiles(files) {
            // 使用Array.from转换为数组，然后使用for...of循环确保异步操作按顺序执行
            for (let file of Array.from(files)) {
                await processFile(file);
            }
        }
        
        async function processFile(file) {
            // 检查是否为图片文件
            if (file.type.startsWith('image/')) {
                // 提取退货单号和开单单号
                const orderInfo = extractOrderIds(file.name);
                if (orderInfo) {
                    // 发送请求获取SKU数据和生成备注
                    const basicData = await fetchSkuData(orderInfo.returnOrderId, orderInfo.orderId);
                    if (basicData && basicData.remark && basicData.io_id) {
                        console.log('基础数据获取成功，开始获取回调数据');
                        // 使用io_id发送请求获取构建__CALLBACKPARAM所需的数据
                        const callbackData = await fetchCallbackData(basicData.io_id);
                        if (callbackData) {
                            console.log('回调数据获取成功，开始合并数据');
                            // 合并数据，优先使用callbackData中的数据，但保持remark为生成的备注
                            const combinedData = {
                                ...callbackData,  // 来自fetchCallbackData的数据
                                remark: basicData.remark,  // 保持生成的备注
                                io_id: basicData.io_id  // 确保io_id正确
                            };
                            
                            // 发送请求修改备注，同时传递文件对象
                            console.log('数据合并完成，开始保存备注并上传图片');
                            await saveRemark(combinedData, file);
                        } else {
                            console.error('未能获取所需数据');
                        }
                    } else {
                        console.error('基础数据获取失败或不完整');
                    }
                } else {
                    console.error('未能从文件名提取订单信息');
                }
            }
        }
    }

    // 初始化函数
    function init() {
        const dragWindow = createDragWindow();
        makeDraggable(dragWindow);
        addDragDropFunctionality(dragWindow);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
