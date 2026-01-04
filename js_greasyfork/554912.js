// ==UserScript==
// @name         店小蜜5倍价格筛选
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  5倍价格筛选
// @author       Rayu
// @match        https://www.dianxiaomi.com/web/shopeeSite/*
// @exclude      https://www.dianxiaomi.com/web/shopeeSite/edit*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554912/%E5%BA%97%E5%B0%8F%E8%9C%9C5%E5%80%8D%E4%BB%B7%E6%A0%BC%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554912/%E5%BA%97%E5%B0%8F%E8%9C%9C5%E5%80%8D%E4%BB%B7%E6%A0%BC%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback, maxWait = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(interval);
                console.log('等待元素超时');
            }
        }, 500);
    }

    // ================== 数据持久化缓存模块 ==================
    const CACHE_KEY = 'dianxiaomi_product_cache';
    const CACHE_EXPIRE_DAYS = 7; // 缓存过期天数

    // 缓存管理器
    const CacheManager = {
        // 保存数据到localStorage
        save(data) {
            try {
                const cacheData = {
                    data: data,
                    timestamp: Date.now(),
                    version: '1.0.0'
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                console.log('💾 数据已保存到localStorage，当前数量:', data.length);
            } catch (e) {
                console.error('❌ 保存缓存失败:', e);
            }
        },

        // 从localStorage加载数据
        load() {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (!cached) {
                    console.log('📂 未找到缓存数据，初始化为空数组');
                    return [];
                }

                const cacheData = JSON.parse(cached);
                const age = Date.now() - cacheData.timestamp;
                const ageDays = Math.floor(age / (1000 * 60 * 60 * 24));

                console.log(`📂 加载缓存数据: ${cacheData.data.length} 条记录`);
                console.log(`⏰ 缓存时间: ${ageDays} 天前`);

                return cacheData.data || [];
            } catch (e) {
                console.error('❌ 加载缓存失败:', e);
                return [];
            }
        },

        // 清除所有缓存
        clear() {
            try {
                localStorage.removeItem(CACHE_KEY);
                console.log('🗑️ 已清除localStorage中的所有缓存');
            } catch (e) {
                console.error('❌ 清除缓存失败:', e);
            }
        },

        // 清理过期缓存（超过7天）
        cleanExpired() {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (!cached) return;

                const cacheData = JSON.parse(cached);
                const age = Date.now() - cacheData.timestamp;
                const ageDays = age / (1000 * 60 * 60 * 24);

                if (ageDays > CACHE_EXPIRE_DAYS) {
                    this.clear();
                    console.log(`🧹 自动清理 ${Math.floor(ageDays)} 天前的过期缓存`);
                    return true;
                }
                return false;
            } catch (e) {
                console.error('❌ 清理过期缓存失败:', e);
                return false;
            }
        },

        // 获取缓存信息
        getInfo() {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (!cached) {
                    return { exists: false, count: 0, ageDays: 0 };
                }

                const cacheData = JSON.parse(cached);
                const age = Date.now() - cacheData.timestamp;
                const ageDays = Math.floor(age / (1000 * 60 * 60 * 24));

                return {
                    exists: true,
                    count: cacheData.data?.length || 0,
                    ageDays: ageDays,
                    timestamp: cacheData.timestamp
                };
            } catch (e) {
                console.error('❌ 获取缓存信息失败:', e);
                return { exists: false, count: 0, ageDays: 0 };
            }
        }
    };

    // 页面加载时自动清理过期缓存
    CacheManager.cleanExpired();

    // 从localStorage加载已缓存的数据
    let capturedApiData = CacheManager.load();

    // 将capturedApiData和缓存管理器暴露到全局作用域
    window.capturedApiData = capturedApiData;
    window.CacheManager = CacheManager;

    console.log('🚀 API拦截器已启动');
    console.log('💡 提示: 可以在控制台使用 window.capturedApiData 或 capturedApiData 访问捕获的数据');

    // 公共函数：添加悬停效果
    function addHoverEffect(element, hoverColor, normalColor) {
        element.addEventListener('mouseenter', function() {
            this.style.backgroundColor = hoverColor;
        });
        element.addEventListener('mouseleave', function() {
            this.style.backgroundColor = normalColor;
        });
    }

    // 拦截XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const requestBody = body;

        this.addEventListener('load', function() {
            try {
                if (this._url && this.responseText) {
                    // 检查是否是目标API
                    const isTargetApi = this._url.includes('shopeeProduct') ||
                                       this._url.includes('getProductById');


                    if (isTargetApi) {
                        console.log('🎯 捕获到目标API (XHR):', this._url);
                    }


                    // 尝试解析JSON响应
                    const data = JSON.parse(this.responseText);
                    console.log('🔍 XHR请求:', this._url);
                    console.log('📦 响应数据:', data);


                    capturedApiData.push({
                        url: this._url,
                        method: 'XHR',
                        data: data,
                        timestamp: new Date().toISOString()
                    });

                    // 自动保存到localStorage
                    CacheManager.save(capturedApiData);

                    if (isTargetApi) {
                        console.log('✅ 已保存到 capturedApiData，当前总数:', capturedApiData.length);
                    }


                }
            } catch (e) {
                // 忽略非JSON响应
                if (this._url && (this._url.includes('shopeeProduct') || this._url.includes('getProductById'))) {
                    console.error('❌ 解析目标API响应失败:', this._url, e);
                }
            }
        });

        this.addEventListener('error', function() {
            console.error('❌ XHR请求失败:', this._url);
        });

        return originalXHRSend.apply(this, arguments);
    };

    // 拦截fetch
    const originalFetch = window.fetch;
    window.fetch = function() {
        const url = arguments[0];
        const isTargetApi = typeof url === 'string' &&
                           (url.includes('shopeeProduct') || url.includes('getProductById'));


        if (isTargetApi) {
            console.log('🎯 准备发起目标API请求 (Fetch):', url);
        }


        return originalFetch.apply(this, arguments).then(response => {
            // 克隆响应以便读取
            const clonedResponse = response.clone();

            clonedResponse.json().then(data => {
                console.log('🔍 Fetch请求:', url);
                console.log('📦 响应数据:', data);


                capturedApiData.push({
                    url: url,
                    method: 'Fetch',
                    data: data,
                    timestamp: new Date().toISOString()
                });

                // 自动保存到localStorage
                CacheManager.save(capturedApiData);

                if (isTargetApi) {
                    console.log('✅ 已保存到 capturedApiData，当前总数:', capturedApiData.length);
                }
            }).catch((e) => {
                // 忽略非JSON响应
                if (isTargetApi) {
                    console.error('❌ 解析目标API响应失败:', url, e);
                }
            });

            return response;
        }).catch(error => {
            console.error('❌ Fetch请求失败:', url, error);
            throw error;
        });
    };

    // 从API数据中提取商品信息（新格式）
    function extractProductInfo() {
        const products = [];
        console.log('开始从API数据中提取商品信息...');
        console.log(`已捕获 ${capturedApiData.length} 个API请求`);

        // 遍历所有捕获的API数据
        capturedApiData.forEach((apiCall, index) => {
            console.log(`\n处理API请求 ${index + 1}:`, apiCall.url);

            // 判断API类型
            const isGetProductById = apiCall.url.includes('getProductById');
            console.log(`🔖 API类型: ${isGetProductById ? 'getProductById (规格列表)' : 'pageList (商品列表)'}`);

            // 如果是getProductById API，直接提取variations数组
            if (isGetProductById && apiCall.data && apiCall.data.data && Array.isArray(apiCall.data.data)) {
                console.log(`📦 发现 getProductById 数据，包含 ${apiCall.data.data.length} 个规格`);

                // 从第一个variation中获取商品基本信息
                const firstVariation = apiCall.data.data[0];
                if (firstVariation) {
                    const product = {
                        name: firstVariation.dxmProductName || '（从规格数据获取）',
                        id: firstVariation.dxmProductId || firstVariation.id, // 保留原始ID用于数据合并
                        idStr: firstVariation.idStr || firstVariation.id, // 用于UI显示
                        dxmProductId: firstVariation.dxmProductId || firstVariation.id,
                        specifications: []
                    };

                    // 提取所有规格
                    apiCall.data.data.forEach((variation, vIndex) => {
                        // 组合 option1 和 option2
                        const optionText = [variation.option1, variation.option2].filter(Boolean).join(' - ');
                        console.log(`  [${vIndex + 1}] ${optionText}: ¥${variation.price} (idStr: ${variation.idStr || '无'})`);
                        if ((variation.option1 !== undefined || variation.option2 !== undefined) && variation.price !== undefined) {
                            product.specifications.push({
                                option: optionText,
                                price: variation.price,
                                idStr: variation.idStr || variation.id
                            });
                        }
                    });

                    if (product.specifications.length > 0) {
                        console.log(`✅ 从 getProductById 提取商品: ${product.name} (DXM ID: ${product.dxmProductId})`);
                        console.log(`   └─ 规格数量: ${product.specifications.length}`);
                        products.push(product);
                    }
                }

                // getProductById API处理完毕，跳过递归查找
                return;
            }

            // 对于pageList API，使用递归查找
            // 递归查找数据中的商品信息
            function findProducts(obj, path = '') {
                if (!obj || typeof obj !== 'object') return;

                // 检查当前对象是否包含商品信息（必须有name和id）
                if (obj.name && obj.id) {
                    console.log(`\n🔍 发现潜在商品对象: ${obj.name} (ID: ${obj.id})`);
                    console.log(`  ├─ 路径: ${path}`);
                    console.log(`  ├─ idStr: ${obj.idStr || '无'}`);
                    console.log(`  ├─ dxmProductId: ${obj.dxmProductId || '无'}`);
                    console.log(`  ├─ variations 类型: ${Array.isArray(obj.variations) ? '数组' : typeof obj.variations}`);
                    console.log(`  └─ variations 长度: ${Array.isArray(obj.variations) ? obj.variations.length : 'N/A'}`);

                    const product = {
                        name: obj.name,
                        id: obj.id, // 保留原始ID用于数据合并
                        idStr: obj.idStr || obj.id, // 用于UI显示
                        dxmProductId: obj.idStr || obj.dxmProductId || obj.id, // 优先使用idStr
                        specifications: []
                    };

                    // 提取variations数组
                    if (Array.isArray(obj.variations)) {
                        console.log(`  📦 开始处理 ${obj.variations.length} 个 variations...`);
                        obj.variations.forEach((variation, vIndex) => {
                            // 组合 option1 和 option2
                            const optionText = [variation.option1, variation.option2].filter(Boolean).join(' - ');
                            console.log(`    [${vIndex + 1}] option1=${variation.option1}, option2=${variation.option2 || '无'}, price=${variation.price}, dxmProductId=${variation.dxmProductId || '无'}`);
                            if ((variation.option1 !== undefined || variation.option2 !== undefined) && variation.price !== undefined) {
                                product.specifications.push({
                                    option: optionText,
                                    price: variation.price
                                });
                            }
                        });
                        console.log(`  ✅ 成功提取 ${product.specifications.length} 个规格`);
                    } else {
                        console.log(`  ⚠️ variations 不是数组或不存在`);
                        // 输出整个对象的键，帮助调试
                        console.log(`  📋 对象的所有键:`, Object.keys(obj).join(', '));
                    }

                    // dxmProductId已在创建product时设置（优先级：idStr > dxmProductId > id）
                    console.log(`  ✓ 使用的 dxmProductId: ${product.dxmProductId}`);

                    // 只有当有规格数据时才添加商品
                    if (product.specifications.length > 0) {
                        console.log(`✓ 找到商品: ${product.name} (ID: ${product.id}, DXM ID: ${product.dxmProductId || '无'})`);
                        console.log(`  └─ 规格数量: ${product.specifications.length}`);
                        console.log(`  └─ 路径: ${path}`);
                        products.push(product);
                        console.log(`  ⚙️ 调试模式: 继续递归查找所有嵌套对象`);
                    } else {
                        console.log(`  ❌ 该商品没有有效的规格数据，跳过`);
                    }
                }

                // 递归遍历对象和数组
                if (Array.isArray(obj)) {
                    obj.forEach((item, idx) => findProducts(item, `${path}[${idx}]`));
                } else {
                    // 遍历对象的所有属性
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            findProducts(obj[key], path ? `${path}.${key}` : key);
                        }
                    }
                }
            }

            findProducts(apiCall.data);
        });

        console.log(`\n共找到 ${products.length} 个商品（去重前）`);

        // 去重：合并相同ID的商品数据
        const productMap = new Map();
        products.forEach(product => {
            const key = product.id; // 使用原始ID作为唯一标识符

            if (productMap.has(key)) {
                // 如果已存在该商品，合并规格数据
                const existing = productMap.get(key);
                console.log(`🔄 发现重复商品: ${product.name} (ID: ${key})`);
                console.log(`   合并前规格数量: ${existing.specifications.length}`);
                console.log(`   待合并规格数量: ${product.specifications.length}`);

                // 合并规格数组（去重相同option的规格）
                const specMap = new Map();
                existing.specifications.forEach(spec => {
                    specMap.set(spec.option, spec);
                });
                product.specifications.forEach(spec => {
                    if (!specMap.has(spec.option)) {
                        specMap.set(spec.option, spec);
                    }
                });

                existing.specifications = Array.from(specMap.values());
                console.log(`   合并后规格数量: ${existing.specifications.length}`);
            } else {
                // 首次出现该商品，直接添加
                productMap.set(key, product);
            }
        });

        const mergedProducts = Array.from(productMap.values());
        console.log(`\n✅ 去重后共 ${mergedProducts.length} 个商品`);

        return mergedProducts;
    }

    // 显示商品数据
    function displayProductData(products) {
        console.log('\n=== 商品信息数据 ===');
        console.log(`共找到 ${products.length} 个商品`);

        console.log('\n详细列表：');
        products.forEach((product, index) => {
            console.log(`${index + 1}. 商品: ${product.name}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   DXM ID: ${product.dxmProductId}`);
            console.log(`   规格数量: ${product.specifications.length} 个`);

            product.specifications.forEach((spec, sIndex) => {
                console.log(`   [${sIndex + 1}] ${spec.option}: ${spec.price}`);
            });
            console.log('---');
        });

        return products;
    }

    // ⭐ [新增] 自动滚动并勾选高价差商品的函数
    async function selectHighPriceProducts() {
        console.log('🔘 一键勾选按钮被点击');
        const btn = document.getElementById('dianxiaomi-select-high-price-btn');
        if (!btn) {
            console.error('❌ 未找到一键勾选按钮元素');
            return;
        }

        // 检查是否存在商品数据
        if (!window.dianxiaomiProductData || window.dianxiaomiProductData.length === 0) {
            console.warn('⚠️ 商品数据不存在');
            alert('请先点击"手动获取"按钮加载商品数据！');
            return;
        }

        console.log(`📊 当前商品数据数量: ${window.dianxiaomiProductData.length}`);
        btn.disabled = true;
        btn.textContent = '🔄 正在勾选...';

        // 筛选出所有高价差商品
        const highPriceProducts = window.dianxiaomiProductData.filter(product => {
            if (!product.specifications || product.specifications.length <= 1) return false;
            const prices = product.specifications.map(s => parseFloat(s.price)).filter(p => p > 0);
            if (prices.length <= 1) return false;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return (maxPrice / minPrice) > 5;
        });

        if (highPriceProducts.length === 0) {
            alert('未在当前列表中找到高价差商品。');
            btn.disabled = false;
            btn.textContent = `✔️ 一键勾选 (0)`;
            return;
        }

        console.log(`准备勾选 ${highPriceProducts.length} 个高价差商品...`);

        // 寻找页面上的表格容器
        const tableWrapper = document.querySelector('.vxe-table--body-wrapper');
        if (!tableWrapper) {
            alert('错误：无法在页面上找到商品表格，无法执行勾选操作。');
            btn.disabled = false;
            btn.textContent = `✔️ 一键勾选 (${highPriceProducts.length})`;
            return;
        }

        // 滚动回页面顶部
        window.scrollTo({ top: 0, behavior: 'auto' });
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('🔝 已滚动回页面顶部，开始一次性滚动查找所有商品...');

        // 创建商品名称集合用于快速查找
        const productNames = new Set(highPriceProducts.map(p => p.name));
        const foundRows = new Map(); // 存储找到的商品行：商品名称 -> 行元素

        // 滚动参数配置
        const scrollSpeed = 200; // 每次滚动像素数
        const scrollInterval = 5; // 每次滚动间隔（毫秒）
        const maxScrolls = 500; // 最大滚动次数

        let scrollCount = 0;
        btn.textContent = `🔄 滚动查找中...`;

        // 一次性从头到尾滚动页面，收集所有目标商品行
        while (scrollCount < maxScrolls && foundRows.size < highPriceProducts.length) {
            // 获取当前页面中所有的商品行
            const allRows = document.querySelectorAll('.vxe-table--body-wrapper table tbody tr');

            // 在当前可视区域查找包含目标商品名称的行
            for (const row of allRows) {
                const rect = row.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // 判断行是否在浏览器窗口可视区域内
                const isVisible = rect.top >= 0 && rect.top <= windowHeight && rect.bottom >= 0 && rect.bottom <= windowHeight;

                if (isVisible) {
                    const rowText = row.textContent;
                    // 检查是否包含任何目标商品名称
                    for (const productName of productNames) {
                        if (rowText.includes(productName) && !foundRows.has(productName)) {
                            foundRows.set(productName, row);
                            console.log(`✅ 找到目标商品（第 ${scrollCount + 1} 次滚动）: ${productName}`);
                            btn.textContent = `🔄 已找到 ${foundRows.size}/${highPriceProducts.length}`;
                            break;
                        }
                    }
                }
            }

            // 如果已找到所有商品，停止滚动
            if (foundRows.size >= highPriceProducts.length) {
                console.log('✅ 已找到所有目标商品，停止滚动');
                break;
            }

            // 使用 window.scrollBy 进行真实页面滚动
            window.scrollBy({
                top: scrollSpeed,
                behavior: 'auto'
            });

            await new Promise(resolve => setTimeout(resolve, scrollInterval));
            scrollCount++;

            // 检查是否已滚动到页面底部
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                console.log('⚠️ 已滚动到页面底部');
                break;
            }
        }

        console.log(`\n📋 滚动完成，共找到 ${foundRows.size}/${highPriceProducts.length} 个商品，开始勾选...`);

        // 统一勾选所有找到的商品
        let successCount = 0;
        let notFoundCount = highPriceProducts.length - foundRows.size;

        for (let i = 0; i < highPriceProducts.length; i++) {
            const product = highPriceProducts[i];
            const targetRow = foundRows.get(product.name);

            btn.textContent = `🔄 勾选中(${i + 1}/${highPriceProducts.length})`;

            if (targetRow) {
                try {
                    // 查找并点击复选框
                    const checkbox = targetRow.querySelector('.ant-checkbox-input');
                    if (checkbox) {
                        checkbox.click();
                        successCount++;
                        console.log(`✅ 已勾选 (${successCount}/${foundRows.size}): ${product.name}`);
                        await new Promise(resolve => setTimeout(resolve, 50));
                    } else {
                        console.warn(`❌ 在行内未找到复选框: ${product.name}`);
                        notFoundCount++;
                        successCount--;
                    }
                } catch (e) {
                    console.error(`❌ 勾选商品时发生错误: ${product.name}`, e);
                    notFoundCount++;
                }
            } else {
                console.warn(`⚠️ 未找到商品: ${product.name}`);
            }
        }

        alert(`勾选完成！\n\n成功勾选: ${successCount} 个\n未找到或失败: ${notFoundCount} 个`);
        console.log(`勾选操作完成。成功: ${successCount}, 失败/未找到: ${notFoundCount}`);

        btn.disabled = false;
        btn.textContent = `✅ 已完成`;
        setTimeout(() => {
            btn.textContent = `✔️ 一键勾选 (${highPriceProducts.length})`;
        }, 5000);
    }

    // 创建浮动窗口UI
    function createFloatingPanel() {
        // 创建容器
        const panel = document.createElement('div');
        panel.id = 'dianxiaomi-price-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 600px;
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 15px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        header.innerHTML = `
            <span>📊 商品价格数据</span>
            <button id="dianxiaomi-close-btn" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 18px;
                line-height: 1;
            ">×</button>
        `;

        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            padding: 10px 15px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            align-items: center;
        `;
        toolbar.innerHTML = `
            <button id="dianxiaomi-refresh-btn" style="
                background: #1890ff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            ">🔄 手动获取</button>
            <button id="dianxiaomi-clear-btn" style="
                background: #ff4d4f;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            ">🗑️ 清除缓存</button>
            <button id="dianxiaomi-select-high-price-btn" style="
                background: #52c41a;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
                display: none; /* 默认隐藏 */
            ">✔️ 一键勾选</button>
            <span id="dianxiaomi-status" style="
                flex-grow: 1;
                text-align: right;
                color: #666;
                font-size: 14px;
            ">准备就绪</span>
        `;

        // 创建内容区域
        const content = document.createElement('div');
        content.id = 'dianxiaomi-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            max-height: 500px;
        `;
        content.innerHTML = '<div style="color: #999; text-align: center; padding: 40px 20px;">点击"手动获取"按钮开始获取数据</div>';

        // 组装面板
        panel.appendChild(header);
        panel.appendChild(toolbar);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 添加拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'dianxiaomi-close-btn') return;
            isDragging = true;
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 关闭按钮事件
        document.getElementById('dianxiaomi-close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 刷新按钮事件
        document.getElementById('dianxiaomi-refresh-btn').addEventListener('click', () => {
            updatePanelData(true); // 自动展开
        });

        // 清除缓存按钮事件
        document.getElementById('dianxiaomi-clear-btn').addEventListener('click', () => {
            // 清空内存中的数组
            capturedApiData.length = 0;

            // 清除localStorage中的缓存
            CacheManager.clear();

            console.log('🗑️ 已清除所有缓存数据（内存 + localStorage）');
            console.log('💡 当前 capturedApiData.length =', window.capturedApiData.length);

            const contentEl = document.getElementById('dianxiaomi-content');
            const statusEl = document.getElementById('dianxiaomi-status');

            contentEl.innerHTML = '<div style="color: #52c41a; text-align: center; padding: 40px 20px;">✓ 缓存已清除<br/><small style="color: #999;">内存和localStorage数据已全部清空</small><br/><small style="color: #999;">点击"手动获取"重新加载数据</small></div>';
            statusEl.textContent = '缓存已清除';
            statusEl.style.color = '#52c41a';

            // 隐藏勾选按钮
            document.getElementById('dianxiaomi-select-high-price-btn').style.display = 'none';
        });

        // ⭐ [新增] 一键勾选按钮事件
        const selectHighPriceBtn = document.getElementById('dianxiaomi-select-high-price-btn');
        if (selectHighPriceBtn) {
            selectHighPriceBtn.addEventListener('click', selectHighPriceProducts);
            console.log('✅ 一键勾选按钮事件已绑定');
        } else {
            console.error('❌ 一键勾选按钮元素不存在，无法绑定事件');
        }

        // 鼠标悬停效果
        addHoverEffect(document.getElementById('dianxiaomi-refresh-btn'), '#40a9ff', '#1890ff');
        addHoverEffect(document.getElementById('dianxiaomi-clear-btn'), '#ff7875', '#ff4d4f');
        addHoverEffect(document.getElementById('dianxiaomi-select-high-price-btn'), '#73d13d', '#52c41a');

        return panel;
    }

    // 自动收起所有商品
    async function collapseAllProducts() {
        console.log('🔽 开始收起所有商品...');

        // 定义所有可能的选择器（与展开相同）
        const selectors = [
            'td.col_10 span.link',
            'td[class*="col_10"] span.link',
            '.vxe-body--column.col_10 span.link',
            'span.link'
        ];

        // 循环尝试所有选择器，找到第一个有结果的
        let collapseButtons = [];
        for (const selector of selectors) {
            collapseButtons = document.querySelectorAll(selector);
            if (collapseButtons.length > 0) break;
        }

        console.log(`✓ 找到 ${collapseButtons.length} 个潜在收起按钮`);

        if (collapseButtons.length === 0) {
            console.log('⚠️ 未找到收起按钮');
            return 0;
        }

        let collapsedCount = 0;

        // 批量点击所有收起按钮（使用真实的鼠标事件模拟）
        const clickPromises = [];
        for (let i = 0; i < collapseButtons.length; i++) {
            const button = collapseButtons[i];

            // 检查按钮是否可见且可点击
            if (button && button.offsetParent !== null) {
                try {
                    // 模拟真实的鼠标事件序列
                    const eventConfig = {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        button: 0
                    };
                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        button.dispatchEvent(new MouseEvent(eventType, eventConfig));
                    });

                    collapsedCount++;

                    if (i < 3) {
                        console.log(`✓ 已触发第 ${i + 1} 个收起按钮`);
                    }

                    // 每10个按钮后稍微延迟一下，给浏览器处理时间
                    if (collapsedCount % 10 === 0) {
                        clickPromises.push(new Promise(resolve => setTimeout(resolve, 100)));
                    }
                } catch (e) {
                    console.error(`❌ 收起第 ${i + 1} 个商品失败:`, e);
                }
            }
        }

        console.log(`✓ 已触发 ${collapsedCount} 个收起按钮（模拟点击事件）`);

        // 等待所有点击延迟完成
        await Promise.all(clickPromises);

        // 等待收起动画完成
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log(`✅ 成功收起 ${collapsedCount} 个商品`);

        return collapsedCount;
    }

    // 自动展开所有商品
    async function expandAllProducts() {
        console.log('🔍 开始查找展开按钮...');

        // 定义所有可能的选择器
        const selectors = [
            'td.col_10 span.link',
            'td[class*="col_10"] span.link',
            '.vxe-body--column.col_10 span.link',
            'span.link'
        ];

        // 循环尝试所有选择器，找到第一个有结果的
        let expandButtons = [];
        for (const selector of selectors) {
            expandButtons = document.querySelectorAll(selector);
            if (expandButtons.length > 0) break;
        }

        console.log(`✓ 找到 ${expandButtons.length} 个潜在展开按钮`);

        if (expandButtons.length === 0) {
            console.log('⚠️ 未找到展开按钮');
            return 0;
        }

        // 输出第一个按钮的详细信息用于调试
        if (expandButtons.length > 0) {
            const firstButton = expandButtons[0];
            console.log('📋 第一个按钮详情:');
            console.log('  - 标签:', firstButton.tagName);
            console.log('  - 类名:', firstButton.className);
            console.log('  - 内容:', firstButton.textContent?.trim() || '无文本');
            console.log('  - 父元素:', firstButton.parentElement?.tagName);
            console.log('  - HTML:', firstButton.outerHTML.substring(0, 200));
        }

        // 记录展开前的API数据数量
        const beforeApiCount = capturedApiData.length;
        console.log(`📊 展开前已捕获 ${beforeApiCount} 个API请求`);

        let expandedCount = 0;

        // 批量点击所有展开按钮（使用真实的鼠标事件模拟）
        const clickPromises = [];
        for (let i = 0; i < expandButtons.length; i++) {
            const button = expandButtons[i];

            // 检查按钮是否可见且可点击
            if (button && button.offsetParent !== null) {
                try {
                    // 模拟真实的鼠标事件序列
                    const eventConfig = {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        button: 0
                    };
                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        button.dispatchEvent(new MouseEvent(eventType, eventConfig));
                    });

                    expandedCount++;

                    if (i < 3) {
                        console.log(`✓ 已触发第 ${i + 1} 个展开按钮`);
                    }

                    // 每10个按钮后稍微延迟一下，给浏览器处理时间
                    if (expandedCount % 10 === 0) {
                        clickPromises.push(new Promise(resolve => setTimeout(resolve, 200)));
                    }
                } catch (e) {
                    console.error(`❌ 展开第 ${i + 1} 个商品失败:`, e);
                }
            }
        }

        console.log(`✓ 已触发 ${expandedCount} 个展开按钮（模拟点击事件）`);

        // 等待所有点击延迟完成
        await Promise.all(clickPromises);

        // 等待API请求完成（优化为更短的等待时间）
        const waitTime = Math.max(1000, expandedCount * 80); // 最少1秒，每个商品80ms
        console.log(`⏳ 等待 ${waitTime}ms 让API请求完成...`);

        // 分段检查API请求数量（减少检查次数，更快响应）
        for (let i = 0; i < 2; i++) {
            await new Promise(resolve => setTimeout(resolve, waitTime / 2));
            const currentApiCount = capturedApiData.length;
            const newCount = currentApiCount - beforeApiCount;
            if (newCount > 0) {
                console.log(`  ✓ 已捕获 ${newCount} 个新API请求...`);
            }
        }

        // 检查是否捕获到新的API数据
        const afterApiCount = capturedApiData.length;
        const newApiCount = afterApiCount - beforeApiCount;
        console.log(`📊 展开后共捕获 ${afterApiCount} 个API请求（新增 ${newApiCount} 个）`);

        if (newApiCount === 0) {
            console.log('⚠️ 警告：展开后未捕获到新的API请求！');
        } else {
            console.log(`✓ 成功捕获到 ${newApiCount} 个新的API请求`);
        }

        return expandedCount;
    }

    // ⭐ [新增] 展开并获取数据后自动收起
    async function expandAndCollapse() {
        console.log('🔄 开始展开获取数据流程...');

        // 先展开所有商品
        const expandedCount = await expandAllProducts();

        if (expandedCount > 0) {
            console.log(`✅ 已展开 ${expandedCount} 个商品，等待数据获取完成...`);

            // 等待一段时间确保数据获取完成
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 收起所有商品
            const collapsedCount = await collapseAllProducts();
            console.log(`✅ 已收起 ${collapsedCount} 个商品，恢复到未展开状态`);

            return { expandedCount, collapsedCount };
        } else {
            console.log('⚠️ 未能展开商品，跳过收起操作');
            return { expandedCount: 0, collapsedCount: 0 };
        }
    }

    // 更新面板数据
    async function updatePanelData(autoExpand = true) {
        const statusEl = document.getElementById('dianxiaomi-status');
        const contentEl = document.getElementById('dianxiaomi-content');

        // 如果启用自动展开
        if (autoExpand) {
            statusEl.textContent = '正在处理...';
            statusEl.style.color = '#ff9800';

            // 使用新的展开并收起功能
            const result = await expandAndCollapse();

            if (result.expandedCount === 0) {
                statusEl.textContent = '未找到可展开的商品';
                statusEl.style.color = '#ff4d4f';
                return;
            }
        }

        statusEl.textContent = '正在获取数据...';
        statusEl.style.color = '#1890ff';

        setTimeout(() => {
            const productData = extractProductInfo();
            displayProductData(productData);
            window.dianxiaomiProductData = productData;

            // 更新UI显示
            if (productData.length === 0) {
                contentEl.innerHTML = '<div style="color: #ff4d4f; text-align: center; padding: 40px 20px;">⚠️ 未找到商品数据<br/><small style="color: #999;">请确保页面已加载完成</small></div>';
                statusEl.textContent = '未找到数据';
                statusEl.style.color = '#ff4d4f';
            } else {
                const totalSpecs = productData.reduce((sum, p) => sum + p.specifications.length, 0);
                // 统计高价差商品数量
                let highPriceRatioCount = 0;

                let html = `
                    <div style="margin-bottom: 10px; padding: 10px; background: #e6f7ff; border-radius: 4px; border-left: 3px solid #1890ff;">
                        <strong style="color: #1890ff;">✓ 成功获取 ${productData.length} 个商品，共 ${totalSpecs} 个规格</strong>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 10px; display: flex; align-items: center; gap: 12px;">
                        <span>最新更新: ${new Date().toLocaleTimeString()}</span>
                    </div>
                `;

                productData.forEach((item, index) => {
                    // 计算最低价和最高价
                    let minPrice = Infinity;
                    let maxPrice = -Infinity;
                    item.specifications.forEach(spec => {
                        const price = parseFloat(spec.price);
                        if (!isNaN(price) && price > 0) { // 确保价格大于0
                            minPrice = Math.min(minPrice, price);
                            maxPrice = Math.max(maxPrice, price);
                        }
                    });

                    // 判断价格差是否超过5倍
                    const priceRatio = (minPrice !== Infinity && minPrice > 0) ? (maxPrice / minPrice) : 1;
                    const hasHighPriceRatio = priceRatio > 5;
                    if (hasHighPriceRatio) highPriceRatioCount++;
                    const warningStyle = hasHighPriceRatio ? 'border: 2px solid #ff4d4f; background: #fff1f0;' : '';
                    const warningBadge = hasHighPriceRatio ? `<span style="background: #ff4d4f; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px;">⚠️ 价差${priceRatio.toFixed(1)}倍</span>` : '';

                    html += `
                        <div style="
                            margin-bottom: 10px;
                            padding: 12px;
                            background: #fafafa;
                            border-radius: 6px;
                            border: 1px solid #e0e0e0;
                            ${warningStyle}
                            transition: all 0.3s;
                            position: relative;
                        " onmouseover="this.style.borderColor='#1890ff';" onmouseout="this.style.borderColor='${hasHighPriceRatio ? '#ff4d4f' : '#e0e0e0'}';">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <div style="display: flex; align-items: center; flex: 1; min-width: 0;">
                                    <div style="font-weight: 600; color: #333; font-size: 14px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        ${index + 1}. ${item.name || '未知商品'}
                                        ${warningBadge}
                                    </div>
                                </div>
                                <div style="display: flex; gap: 8px; margin-left: 8px;">
                                    <button onclick="window.editProduct(${index})" style="
                                        background: #1890ff;
                                        color: white;
                                        border: none;
                                        padding: 4px 12px;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                        transition: all 0.2s;
                                    " onmouseover="this.style.background='#40a9ff'" onmouseout="this.style.background='#1890ff'">✏️ 编辑</button>
                                </div>
                            </div>
                            <div style="color: #666; font-size: 12px; margin-bottom: 8px;">
                                📦 共 ${item.specifications.length} 个规格 | ID: ${item.idStr}
                            </div>
                        </div>
                    `;
                });

                // 获取缓存信息
                const cacheInfo = CacheManager.getInfo();

                // 添加统计信息
                html += `
                    <div style="
                        margin-top: 15px;
                        padding: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 6px;
                        color: white;
                    ">
                        <div style="font-weight: bold; margin-bottom: 8px;">📈 统计信息</div>
                        <div style="font-size: 13px; line-height: 1.8;">
                            商品数量: ${productData.length} 件<br/>
                            高价差商品: ${highPriceRatioCount} 件<br/>
                            规格数量: ${totalSpecs} 个<br/>
                            API记录: ${capturedApiData.length} 条<br/>
                            ${cacheInfo.exists ? `💾 缓存: ${cacheInfo.ageDays}天前 (${cacheInfo.count}条)` : '💾 缓存: 无'}
                        </div>
                    </div>
                `;



                 contentEl.innerHTML = html;
                statusEl.textContent = `已加载 ${productData.length} 个商品`;
                statusEl.style.color = '#52c41a';

                // ⭐ [修改] 控制一键勾选按钮的显示
                const selectBtn = document.getElementById('dianxiaomi-select-high-price-btn');
                console.log(`🔍 检查一键勾选按钮: 找到=${!!selectBtn}, 高价差商品数=${highPriceRatioCount}`);
                if (selectBtn) {
                    if (highPriceRatioCount > 0) {
                        selectBtn.style.display = 'block';
                        selectBtn.textContent = `✔️ 一键勾选 (${highPriceRatioCount})`;
                        console.log(`✅ 一键勾选按钮已显示，数量: ${highPriceRatioCount}`);
                    } else {
                        selectBtn.style.display = 'none';
                        console.log('ℹ️ 一键勾选按钮已隐藏（无高价差商品）');
                    }
                } else {
                    console.error('❌ 未找到一键勾选按钮元素！');
                }

            }
        }, 500);
    }

    // 编辑商品函数 - 打开店小秘编辑页面
    window.editProduct = function(index) {
        const product = window.dianxiaomiProductData[index];
        if (!product) {
            alert('商品数据不存在');
            return;
        }

        // 使用 idStr 构建编辑链接
        const editUrl = `https://www.dianxiaomi.com/web/shopeeSite/edit?id=${product.idStr}`;
        console.log('🔗 打开编辑页面:', editUrl);

        // 在新标签页打开编辑链接
        window.open(editUrl, '_blank');
    };



    // 主函数
    function main() {
        console.log('店小蜜价格助手已启动');

        // 创建浮动面板
        setTimeout(() => {
            createFloatingPanel();
            console.log('✓ UI面板已创建');

            // 不再自动执行数据获取，只保留手动获取功能
        }, 1000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();