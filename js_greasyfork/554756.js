// ==UserScript==
// @name         AppGrowing category check
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  AppGrowing category checker
// @author       sheire
// @match        https://appgrowing-cn.youcloud.com/leaflet/list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youcloud.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554756/AppGrowing%20category%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/554756/AppGrowing%20category%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 品类列表
    const CATEGORIES = [
        '游戏', '社交婚恋', '阅读', '短剧', '文化娱乐', '工具应用', '网赚应用', '医疗健康',
        '教育培训', '金融', '生活服务', '综合电商', '新闻资讯', '招商加盟', '旅游住宿',
        '商旅出行', '商务', '健康与健身', '拍照与剪辑', '其他应用', '汽车', '房地产',
        '结婚服务', '服饰内衣', '彩妆护肤', '个护家清', '数码家电', '日用百货', '母婴儿童',
        '钟表配饰', '食品饮料', '安全安保', '运动户外', '鲜花园艺', '艺术收藏', '宠物生活',
        '工农业', '法律咨询', 'AI工具', '智能家居', '玩具乐器', '礼品文创', '酒类', '鞋靴箱包'
    ];

    // 飞书多维表格配置（请替换为实际值）
    const FEISHU_BASE_CONFIG = {
        app_token: 'ErD5b3VSZau58FsCRAbcTINZntg',     // 多维表格的app_token
        table_id: 'tbl6iU43Jv4lZDEE',       // 数据表的table_id
        app_id: 'cli_a982a1b1bf2b100d',           // 应用的App ID
        app_secret: 'u3aC8oc9A0g25Yw827y7ubyFS4aNc2lH'    // 应用的App Secret
    };

    // 访问令牌和过期时间
    let tenantAccessToken = null;
    let tokenExpireTime = 0;

    // 当前选择的链接、品类和文案
    let currentUrl = '';
    let currentCategory = '';
    let currentCopywriting = ''; // 文案
    // 新增：当前页面网址
    let currentWebUrl = window.location.href; // 当前网址

    // 等待页面加载完成
    window.addEventListener('load', function() {
        addReportButtons();
    });

    // 由于页面可能是动态加载内容，我们定期检查是否有新的容器出现
    setInterval(function() {
        addReportButtons();
    }, 1000); // 每秒检查一次

    // 添加报告按钮的函数
    function addReportButtons() {
        // 查找目标容器
        const targetContainers = document.querySelectorAll('div.agd-preview-drawer__btn-group');

        // 遍历所有找到的容器
        targetContainers.forEach(container => {
            // 检查是否已经添加过按钮，避免重复添加
            const existingButton = container.querySelector('a[href="javascript:void(0);"]');
            if (!existingButton) {
                // 查找具有.btn-link.detail类的<a>标签
                const detailLink = container.querySelector('a.btn-link.detail');

                if (detailLink) {
                    // 获取href属性
                    const href = detailLink.getAttribute('href');

                    // 获取文案内容
                    let copywriting = '';
                    try {
                        // 根据提供的HTML结构获取文案
                        const drawerContent = container.closest('.agd-preview-drawer__content');
                        if (drawerContent) {
                            // 查找 .agd-preview-drawer__slogan-name 下的 p 标签
                            const sloganContainer = drawerContent.querySelector('.agd-preview-drawer__slogan-name p');
                            if (sloganContainer) {
                                copywriting = sloganContainer.textContent.trim();
                            }
                        }

                        // 如果上面的方法失败，尝试另一种查找方式
                        if (!copywriting) {
                            const parentItem = container.closest('.agd-table-list-item');
                            if (parentItem) {
                                const sloganElement = parentItem.querySelector('.agd-preview-drawer__slogan-name p');
                                if (sloganElement) {
                                    copywriting = sloganElement.textContent.trim();
                                }
                            }
                        }

                        // 如果仍然没有获取到文案，尝试直接在同级元素中查找
                        if (!copywriting) {
                            const sloganElement = container.parentNode?.querySelector('.agd-preview-drawer__slogan-name p');
                            if (sloganElement) {
                                copywriting = sloganElement.textContent.trim();
                            }
                        }
                    } catch (e) {
                        console.log('获取文案内容失败:', e);
                    }

                    // 创建新的按钮元素
                    const reportButton = document.createElement('a');
                    reportButton.innerHTML = '<span>⚠️品类错误</span>';
                    reportButton.href = 'javascript:void(0);'; // 防止页面跳转

                    // 设置按钮样式 - 根据项目规范
                    reportButton.style.backgroundColor = 'orange';
                    reportButton.style.color = 'white';
                    reportButton.style.padding = '5px 10px';
                    reportButton.style.borderRadius = '3px';
                    reportButton.style.textDecoration = 'none';
                    reportButton.style.display = 'inline-block';
                    reportButton.style.marginLeft = '5px';

                    // 添加点击事件监听器
                    reportButton.addEventListener('click', function(e) {
                        e.preventDefault(); // 阻止默认行为
                        console.log('品类错误链接:', href);
                        console.log('文案:', copywriting);
                        // 显示品类选择弹窗
                        showCategorySelection(href, copywriting);
                    });

                    // 将按钮添加到容器中
                    container.appendChild(reportButton);
                }
            }
        });
    }

    // 获取tenant_access_token
    function getTenantAccessToken() {
        return new Promise((resolve, reject) => {
            // 检查现有token是否仍然有效
            if (tenantAccessToken && Date.now() < tokenExpireTime) {
                resolve(tenantAccessToken);
                return;
            }

            // 获取新的tenant_access_token
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    app_id: FEISHU_BASE_CONFIG.app_id,
                    app_secret: FEISHU_BASE_CONFIG.app_secret
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            tenantAccessToken = result.tenant_access_token;
                            // 设置过期时间（提前5分钟过期以确保安全）
                            tokenExpireTime = Date.now() + (result.expire - 300) * 1000;
                            resolve(tenantAccessToken);
                        } else {
                            reject(new Error('获取tenant_access_token失败: ' + result.msg));
                        }
                    } catch (e) {
                        reject(new Error('解析tenant_access_token响应失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络错误: ' + error));
                }
            });
        });
    }

    // 显示品类选择弹窗
    function showCategorySelection(url, copywriting) {
        currentUrl = url;
        currentCategory = '';
        currentCopywriting = copywriting;
        // 更新当前网址（可能在用户点击时页面已经跳转）
        currentWebUrl = window.location.href;

        // 创建弹窗遮罩
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '请选择品类';
        title.style.cssText = `
            margin-top: 0;
            text-align: center;
        `;

        // 创建品类按钮容器
        const categoryContainer = document.createElement('div');
        categoryContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 10px;
            margin: 20px 0;
        `;

        // 创建品类按钮
        CATEGORIES.forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.textContent = category;
            categoryButton.style.cssText = `
                padding: 8px;
                border: 1px solid #ddd;
                background-color: #f5f5f5;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;

            categoryButton.addEventListener('click', function() {
                // 清除之前选中的按钮样式
                const buttons = categoryContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.style.backgroundColor = '#f5f5f5';
                    btn.style.borderColor = '#ddd';
                });

                // 设置当前选中按钮样式
                this.style.backgroundColor = '#1890ff';
                this.style.borderColor = '#1890ff';
                this.style.color = 'white';

                currentCategory = category;
            });

            categoryContainer.appendChild(categoryButton);
        });

        // 创建操作按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
        `;

        // 创建上报按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '上报错误';
        submitButton.style.cssText = `
            padding: 10px 20px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        submitButton.addEventListener('click', function() {
            if (!currentCategory) {
                alert('请选择一个品类');
                return;
            }

            // 关闭弹窗
            document.body.removeChild(modalOverlay);

            // 发送数据到飞书多维表格
            sendToFeishuBitable(currentUrl, currentCategory, currentCopywriting, currentWebUrl);
        });

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 10px 20px;
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        `;

        cancelButton.addEventListener('click', function() {
            // 关闭弹窗
            document.body.removeChild(modalOverlay);
        });

        // 组装弹窗
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        modalContent.appendChild(title);
        modalContent.appendChild(categoryContainer);
        modalContent.appendChild(buttonContainer);

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // 发送数据到飞书多维表格的函数
    function sendToFeishuBitable(url, category, copywriting, webUrl) {
        // 先获取访问令牌
        getTenantAccessToken()
            .then(accessToken => {
                // 构造发送到飞书多维表格的数据 - 发送链接、文案和品类字段
                const fullUrl = window.location.origin + url; // 构造完整URL
                const requestData = {
                    "records": [
                        {
                            "fields": {
                                "链接": fullUrl,
                                "文案": copywriting,
                                "品类": category,
                                "当前网址": webUrl // 新增字段
                            }
                        }
                    ]
                };

                console.log('发送到飞书的数据:', JSON.stringify(requestData, null, 2));

                // 使用GM_xmlhttpRequest发送请求到飞书多维表格
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BASE_CONFIG.app_token}/tables/${FEISHU_BASE_CONFIG.table_id}/records/batch_create`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(requestData),
                    onload: function(response) {
                        console.log('飞书API响应状态:', response.status);
                        console.log('飞书API响应头:', response.responseHeaders);
                        console.log('飞书API响应内容:', response.responseText);

                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                console.log('已成功上报链接、文案和品类到多维表格！');
                            } else {
                                console.error('飞书API返回错误:', result);
                                alert('上报失败: ' + result.msg);
                            }
                        } catch (e) {
                            console.error('解析飞书响应失败:', e);
                            console.error('响应内容:', response.responseText);
                            alert('上报完成，但解析响应时出错');
                        }
                    },
                    onerror: function(error) {
                        console.error('发送到飞书多维表格失败:', error);
                        alert('上报失败，请查看控制台了解详情。');
                    }
                });
            })
            .catch(error => {
                console.error('获取访问令牌失败:', error);
                alert('获取访问令牌失败: ' + error.message);
            });
    }
})();