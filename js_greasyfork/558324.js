// ==UserScript==
// @name         FD2PPV 增強版
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  FD2PPV 完整功能 - BT4G搜索 + MissAV搜索 + Magnet複製 + FC2PPVDB跳轉 + Grid預覽圖(預加載優化)
// @author       Duckee
// @match        *://fd2ppv.cc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      bt4gprx.com
// @connect      fc2ppvdb.com
// @connect      hdblog.me
// @connect      pixhost.to
// @connect      paipancon.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558324/FD2PPV%20%E5%A2%9E%E5%BC%B7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558324/FD2PPV%20%E5%A2%9E%E5%BC%B7%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("=== FD2PPV 增強版啟動 ===");

    // 🚀 配置常量
    const CONFIG = {
        DEBUG: false,
        CACHE_EXPIRATION: 12 * 60 * 60 * 1000, // 12小時
    };

    // 🎯 預加載狀態管理
    const preloadState = {
        fc2Number: null,
        primaryImage: null,
        fallbackImage: null,
        primaryLoaded: false,
        fallbackLoaded: false
    };

    function log(...args) {
        if (CONFIG.DEBUG) console.log(...args);
    }

    // ==================== 工具函數 ====================

    function getFC2Number() {
        // 從 URL 提取 FC2 番號
        const urlMatch = window.location.href.match(/\/articles\/(\d+)/);
        if (urlMatch) return urlMatch[1];

        // 從頁面標題提取
        const titleMatch = document.title.match(/(\d{7,})/);
        if (titleMatch) return titleMatch[1];

        // 從 breadcrumb 提取
        const breadcrumb = document.querySelector('.breadcrumbs .current');
        if (breadcrumb) {
            const numMatch = breadcrumb.textContent.match(/(\d{7,})/);
            if (numMatch) return numMatch[1];
        }

        return null;
    }

    function getCachedBT4G(fc2Id) {
        try {
            const cached = localStorage.getItem('fd2_bt4g_cache');
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            if (!cacheData[fc2Id]) return null;

            const { timestamp, result, magnetLink } = cacheData[fc2Id];
            const now = Date.now();

            if (now - timestamp > CONFIG.CACHE_EXPIRATION) {
                return null;
            }

            return { result, magnetLink };
        } catch (err) {
            console.error('讀取緩存錯誤:', err);
            return null;
        }
    }

    function saveBT4GCache(fc2Id, result, magnetLink = null) {
        try {
            const cached = JSON.parse(localStorage.getItem('fd2_bt4g_cache') || '{}');
            cached[fc2Id] = {
                result,
                magnetLink,
                timestamp: Date.now()
            };
            localStorage.setItem('fd2_bt4g_cache', JSON.stringify(cached));
        } catch (err) {
            console.error('保存緩存錯誤:', err);
        }
    }

    // ==================== 圖片預加載函數 ====================

    function preloadImage(url, timeout = 3000) {
        return new Promise((resolve) => {
            const img = new Image();
            let settled = false;

            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    img.src = '';
                    log(`⏱️ 圖片預加載超時: ${url.substring(0, 50)}...`);
                    resolve({ success: false, image: null });
                }
            }, timeout);

            img.onload = () => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    log(`✅ 圖片預加載成功: ${url.substring(0, 50)}...`);
                    resolve({ success: true, image: img });
                }
            };

            img.onerror = () => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    log(`❌ 圖片預加載失敗: ${url.substring(0, 50)}...`);
                    resolve({ success: false, image: null });
                }
            };

            img.src = url;
        });
    }

    function startPreloadingImages(fc2Number) {
        console.log(`🚀 開始預加載圖片: FC2-${fc2Number}`);
        
        preloadState.fc2Number = fc2Number;
        const primaryUrl = `https://paipancon.com/fc2daily/data/FC2-PPV-${fc2Number}/grid.jpg`;

        // 預加載主圖
        preloadImage(primaryUrl, 5000).then(result => {
            if (result.success) {
                preloadState.primaryImage = result.image;
                preloadState.primaryLoaded = true;
                console.log('✅ Grid 主圖預加載完成');
            } else {
                console.log('⚠️ Grid 主圖不可用，嘗試備用源...');
                // 主圖失敗時立即預加載備用圖
                fetchAndPreloadFallbackImage(fc2Number);
            }
        });

        // 同時檢查緩存的備用圖
        const cacheKey = `fd2_grid_${fc2Number}`;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { url, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CONFIG.CACHE_EXPIRATION) {
                    log(`📦 找到緩存的備用圖`);
                    preloadImage(url, 5000).then(result => {
                        if (result.success) {
                            preloadState.fallbackImage = result.image;
                            preloadState.fallbackLoaded = true;
                        }
                    });
                }
            }
        } catch (e) {
            log('緩存讀取錯誤:', e);
        }
    }

    function fetchAndPreloadFallbackImage(fc2Number) {
        const cacheKey = `fd2_grid_${fc2Number}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://hdblog.me/?s=fc2+${fc2Number}`,
            onload: function (response) {
                if (response.status === 200) {
                    if (response.responseText.includes('no content matched your criteria')) {
                        log(`❌ FC2-${fc2Number}: hdblog.me 無搜索結果`);
                        return;
                    }

                    const match = response.responseText.match(/<a href="(https:\/\/hdblog\.me\/\d+\/[^"]+)"/);
                    if (match?.[1]) {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: match[1],
                            onload: function (articleResponse) {
                                if (articleResponse.status === 200) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(articleResponse.responseText, 'text/html');
                                    const paragraphs = doc.querySelectorAll('p');

                                    for (let p of paragraphs) {
                                        if (p.textContent.includes('Preview:')) {
                                            const img = p.querySelector('img');
                                            let thumbUrl = img?.getAttribute('src') || img?.getAttribute('data-src');
                                            if (thumbUrl) {
                                                const imgUrl = thumbUrl.replace(/t(\d+)\.pixhost\.to\/thumbs\//, 'img$1.pixhost.to/images/');
                                                
                                                // 保存到緩存
                                                try {
                                                    localStorage.setItem(cacheKey, JSON.stringify({
                                                        url: imgUrl,
                                                        timestamp: Date.now()
                                                    }));
                                                } catch (e) {
                                                    log('緩存保存錯誤:', e);
                                                }

                                                // 預加載備用圖
                                                preloadImage(imgUrl, 5000).then(result => {
                                                    if (result.success) {
                                                        preloadState.fallbackImage = result.image;
                                                        preloadState.fallbackLoaded = true;
                                                        console.log('✅ 備用圖預加載完成');
                                                    }
                                                });
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    // ==================== BT4G 功能 ====================

    function checkBT4GAvailability(fc2Id) {
        const cached = getCachedBT4G(fc2Id);
        if (cached) {
            log(`BT4G 緩存命中: ${fc2Id}`);
            return Promise.resolve({
                status: cached.result ? "SUCCESS" : "NOT_FOUND",
                magnetLink: cached.magnetLink || null,
            });
        }

        const searchUrl = `https://bt4gprx.com/search/${encodeURIComponent(fc2Id)}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            if (doc.querySelector(".list-group")) {
                                fetchFirstMagnetLink(fc2Id).then(magnetLink => {
                                    resolve({ status: "SUCCESS", magnetLink: magnetLink });
                                });
                            } else {
                                resolve({ status: "NOT_FOUND", magnetLink: null });
                            }
                        } catch (e) {
                            console.error(`BT4G 響應解析錯誤: ${fc2Id}`, e);
                            resolve({ status: "FAILED", magnetLink: null });
                        }
                    } else {
                        resolve({ status: response.status === 404 ? "NOT_FOUND" : "FAILED", magnetLink: null });
                    }
                },
                onerror: () => resolve({ status: "FAILED", magnetLink: null })
            });
        });
    }

    function fetchFirstMagnetLink(fc2Id) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://bt4gprx.com/search?q=${encodeURIComponent(fc2Id)}&page=rss`,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/xml");
                            const linkElement = doc.querySelector('item link');
                            if (linkElement) {
                                const magnetLink = linkElement.textContent.trim();
                                console.log(`✅ 獲取到 magnet: ${magnetLink.substring(0, 50)}...`);
                                resolve(magnetLink);
                                return;
                            }
                        } catch (e) {
                            console.error(`RSS 解析錯誤:`, e);
                        }
                    }
                    resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    // ==================== 主要功能 ====================

    function addEnhancedButtons(fc2Number) {
        const toolsStats = document.querySelector('.tools-stats');
        if (!toolsStats) {
            console.warn('找不到 .tools-stats 元素');
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'fd2ppv-enhanced-buttons';
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            flex-wrap: wrap;
        `;

        const statusSpan = document.createElement('span');
        statusSpan.style.cssText = `
            font-size: 14px;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            color: #fbbf24;
            background: rgba(251, 191, 36, 0.15);
            border: 1px solid rgba(251, 191, 36, 0.3);
        `;
        statusSpan.textContent = '🔍 檢查中...';

        const createButton = (text, color, url, icon = '') => {
            const btn = document.createElement('button');
            btn.innerHTML = `${icon} ${text}`;
            btn.className = 'btn btn-primary';
            btn.style.cssText = `
                padding: 10px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: white;
                font-size: 15px;
                font-weight: 600;
                background: ${color};
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            `;
            btn.onmouseover = () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            };
            btn.onclick = (e) => {
                e.preventDefault();
                GM_openInTab(url, { active: true });
            };
            return btn;
        };

        const bt4gButton = createButton('BT4G 搜索', 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', `https://bt4gprx.com/search/${fc2Number}`, '🔍');
        const missavButton = createButton('MissAV 搜索', 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', `https://missav.ai/cn/search/${fc2Number}`, '🎬');
        const fc2ppvdbButton = createButton('FC2PPVDB 查看', 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', `https://fc2ppvdb.com/articles/${fc2Number}`, '📚');

        const magnetButton = document.createElement('button');
        magnetButton.innerHTML = '📋 複製 Magnet';
        magnetButton.className = 'btn btn-primary';
        magnetButton.style.cssText = `
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            color: white;
            font-size: 15px;
            font-weight: 600;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            display: none;
        `;
        magnetButton.onmouseover = () => {
            magnetButton.style.transform = 'translateY(-2px)';
            magnetButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        };
        magnetButton.onmouseout = () => {
            magnetButton.style.transform = 'translateY(0)';
            magnetButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        };

        let currentMagnetLink = null;
        magnetButton.onclick = (e) => {
            e.preventDefault();
            if (currentMagnetLink && !magnetButton.dataset.copying) {
                magnetButton.dataset.copying = 'true';
                navigator.clipboard.writeText(currentMagnetLink).then(() => {
                    magnetButton.innerHTML = '✅ 已複製!';
                    magnetButton.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    setTimeout(() => {
                        magnetButton.innerHTML = '📋 複製 Magnet';
                        magnetButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        delete magnetButton.dataset.copying;
                    }, 2000);
                }).catch(err => {
                    console.error('複製失敗:', err);
                    alert('複製失敗,請手動複製');
                });
            }
        };

        buttonContainer.append(statusSpan, bt4gButton, missavButton, fc2ppvdbButton, magnetButton);
        toolsStats.parentNode.insertBefore(buttonContainer, toolsStats);

        checkBT4GAvailability(fc2Number).then((result) => {
            if (result.status === "SUCCESS") {
                saveBT4GCache(fc2Number, true, result.magnetLink);
                statusSpan.style.cssText = `
                    font-size: 14px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                `;
                statusSpan.textContent = '✅ 有資源';
                if (result.magnetLink) {
                    currentMagnetLink = result.magnetLink;
                    magnetButton.style.display = 'block';
                }
            } else if (result.status === "NOT_FOUND") {
                saveBT4GCache(fc2Number, false);
                statusSpan.style.cssText = `
                    font-size: 14px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                `;
                statusSpan.textContent = '❌ 無資源';
            } else {
                statusSpan.style.cssText = `
                    font-size: 14px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #6b7280;
                    background: rgba(107, 114, 128, 0.15);
                    border: 1px solid rgba(107, 114, 128, 0.3);
                `;
                statusSpan.textContent = '⚠️ 檢查失敗';
            }
        });
    }

    function addPreviewImages(fc2Number) {
        const isMobile = window.innerWidth < 768;
        const otherWorksSection = document.querySelector('.other-works-section');
        if (!otherWorksSection) {
            log('找不到 .other-works-section 元素');
            return;
        }

        const imageContainer = document.createElement('div');
        imageContainer.id = 'fd2ppv-preview-images';
        imageContainer.style.cssText = `
            display: flex;
            flex-direction: ${isMobile ? 'column' : 'row'};
            justify-content: center;
            margin: 20px 0;
            gap: ${isMobile ? '5px' : '0'};
            background: #0f0f0f;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        `;

        // 使用預加載的圖片
        if (preloadState.primaryLoaded && preloadState.primaryImage) {
            console.log('✅ 使用預加載的主圖');
            const preloadedSrc = preloadState.primaryImage.src;
            
            if (isMobile) {
                // 手機版: 創建兩個使用相同圖片但不同 object-position 的元素
                const createImgFromPreload = (position) => {
                    const img = document.createElement('img');
                    img.src = preloadedSrc; // 使用預加載圖片的 URL (已在瀏覽器緩存)
                    img.loading = 'lazy';
                    img.style.cssText = `
                        width: 100%;
                        height: auto;
                        display: block;
                        object-fit: cover;
                        object-position: ${position} center;
                        aspect-ratio: 1/1;
                        border-radius: 8px;
                    `;
                    return img;
                };
                imageContainer.append(createImgFromPreload('left'), createImgFromPreload('right'));
            } else {
                // 桌面版: 直接使用完整圖片
                const img = document.createElement('img');
                img.src = preloadedSrc;
                img.loading = 'lazy';
                img.style.cssText = `
                    width: 100%;
                    max-width: 1200px;
                    height: auto;
                    border-radius: 8px;
                `;
                imageContainer.appendChild(img);
            }
        } else if (preloadState.fallbackLoaded && preloadState.fallbackImage) {
            console.log('✅ 使用預加載的備用圖');
            const img = document.createElement('img');
            img.src = preloadState.fallbackImage.src;
            img.loading = 'lazy';
            img.style.cssText = `
                width: 100%;
                max-width: 1200px;
                height: auto;
                border-radius: 8px;
                object-fit: contain;
            `;
            imageContainer.appendChild(img);
        } else {
            // 預加載未完成,使用傳統方式
            console.log('⚠️ 預加載未完成,使用即時加載');
            const previewImageUrl = `https://paipancon.com/fc2daily/data/FC2-PPV-${fc2Number}/grid.jpg`;
            
            if (isMobile) {
                const createImg = (position) => {
                    const img = document.createElement('img');
                    img.src = previewImageUrl;
                    img.loading = 'lazy';
                    img.style.cssText = `
                        width: 100%;
                        height: auto;
                        display: block;
                        object-fit: cover;
                        object-position: ${position} center;
                        aspect-ratio: 1/1;
                        border-radius: 8px;
                    `;
                    return img;
                };
                imageContainer.append(createImg('left'), createImg('right'));
            } else {
                const img = document.createElement('img');
                img.src = previewImageUrl;
                img.loading = 'lazy';
                img.style.cssText = `
                    width: 100%;
                    max-width: 1200px;
                    height: auto;
                    border-radius: 8px;
                `;
                imageContainer.appendChild(img);
            }
        }

        otherWorksSection.parentNode.insertBefore(imageContainer, otherWorksSection);
        console.log('✅ Grid 預覽圖已添加');
    }

    // ==================== 初始化 ====================

    function init() {
        const isDetailPage = /\/articles\/\d+/.test(window.location.pathname);
        if (!isDetailPage) {
            log('不是詳情頁,跳過');
            return;
        }

        const fc2Number = getFC2Number();
        if (!fc2Number) {
            console.warn('無法提取 FC2 番號');
            return;
        }

        console.log(`✅ 檢測到 FC2 番號: ${fc2Number}`);

        // 🚀 立即開始預加載圖片(在頁面完全加載前)
        startPreloadingImages(fc2Number);

        // 等待頁面加載完成後插入元素
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    addEnhancedButtons(fc2Number);
                    addPreviewImages(fc2Number);
                }, 500);
            });
        } else {
            setTimeout(() => {
                addEnhancedButtons(fc2Number);
                addPreviewImages(fc2Number);
            }, 500);
        }
    }

    init();

})();