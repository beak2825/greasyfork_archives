// ==UserScript==
// @name            SteamPy Plus
// @name:zh-CN      SteamPy Plus
// @name:en         SteamPy Plus
// @namespace       http://github.com/blue-bird1/tampermonkey-script
// @version         5.4
// @description     增强购买Steampy密钥的体验，增加筛选功能，支持鼠标中键打开Steam页面。
// @description:en  Enhance the experience of purchasing Steampy keys, add filter functionality, and support opening Steam pages with the middle mouse button.
// @match           https://steampy.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @icon            https://steampy.com/logo.ico
// @require         https://scriptcat.org/lib/637/1.4.8/ajaxHooker.js#sha256=dTF50feumqJW36kBpbf6+LguSLAtLr7CEs3oPmyfbiM=
// @require         https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @require         https://scriptcat.org/lib/532/1.0.2/ajax.js#sha384-oDDglpYUiMPlZ/QOkx2727Nl9Pw5b5BEX7IZ/5sEgbiboYYMDfwqHbMAk7X7bo/k
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @connect         steampy.com
// @connect         store.steampowered.com
// @run-at          document-start
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/549676/SteamPy%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/549676/SteamPy%20Plus.meta.js
// ==/UserScript==

/*global elmGetter,ajaxHooker,$*/

(function () {
    'use strict';

    // add vue updated hook
    function addUpdatedHook(el, callback) {
        const options = el.__vue__.$options;
        if (!options.updated) {
            options.updated = [];
        } else if (!Array.isArray(options.updated)) {
            options.updated = [options.updated];
        }

        options.updated.push(function (...args) {
            callback.apply(this, args);
        });
    }

    const GameManager = {
        saveState(state) {
            GM_setValue('steamGameList', JSON.stringify(state));
        },
        loadState() {
            const saved = JSON.parse(GM_getValue('steamGameList', null));
            if (!saved) {
                return {
                    own: [],
                    wish: [],
                    sub: []
                };
            }
            return saved
        }
    }

    async function syncSteamOwnGameData() {
        const data = await ajax('https://store.steampowered.com/dynamicstore/userdata/', {
            method: 'GET',
            responseType: 'json',
            _nocatch: true
        })

        if (data) {
            var own = data.rgOwnedApps;
            var wish = data.rgWishlist;
            var sub = data.rgOwnedPackages;
            if (own || wish || sub) {
                if (own.length + wish.length + sub.length == 0) {
                    return;
                }

                GameManager.saveState({
                    own: own,
                    wish: wish,
                    sub: sub
                });


                GM_notification({
                    title: "SteamPy Plus",
                    text: "同步Steam数据成功",
                    timeout: 3000
                });
            }
        }

    }

    GM_registerMenuCommand('同步Steam数据', syncSteamOwnGameData);

    const steamGameList = GameManager.loadState();

    // 状态管理
    const StateManager = {
        saveState(state) {
            GM_setValue('steamPriceFilterState', JSON.stringify(state));
        },
        loadState() {
            const saved = GM_getValue('steamPriceFilterState', null);
            return saved ? JSON.parse(saved) : {
                minPrice: 0,
                maxPrice: 9999,
                isActive: false
            };
        }
    };

    let filterState = StateManager.loadState();

    function getAccessToken() {
        return window.localStorage.getItem('accessToken');
    }

    const listSaleUrl = "xboot/steamKeySale/listSale"

    const steampyUrl = "https://steampy.com/";

    function requestApi(url, method, data) {

        return ajax(url, {
            method: method,
            data: data,
            responseType: 'json',
            headers: {
                Accesstoken: getAccessToken()
            },
            _nocatch: true
        })
    }

    const cacheKey = `${listSaleUrl}_listSaleCache`;
    function getSaleList(gameId) {
        const cached = GM_getValue(cacheKey, {});
        const cachedData = cached[gameId];
        if (cachedData && cachedData.expireTime > Date.now()) {
            return Promise.resolve(cachedData.data);
        }
        return requestApi(`${steampyUrl}${listSaleUrl}`, 'GET', { gameId: gameId, pageNumber: 1, pageSize: 20, sort: "keyPrice", order: "asc", startDate: '', endDate: '' })
            .then(data => {
                const expireTime = Date.now() + 12 * 60 * 60 * 1000; // 12h
                const newCache = Object.assign({}, cached, { [gameId]: { data, expireTime } });
                GM_setValue(cacheKey, newCache);
                return data;
            });
    }

    
    function getSteamAppId(gameBlock) {
        const iconImg = gameBlock.querySelector('.cdkGameIcon');
        if (!iconImg) return null;

        // 优先读取真实图片地址（data-src），再兼容src
        const imgUrl = iconImg.dataset.src || iconImg.src;
        // 从图片地址中匹配游戏ID（例如从steam/apps/1651560/中提取1651560）
        const match = imgUrl.match(/steam\/apps\/(\d+)\/header/);
        // to int
        return match ? parseInt(match[1]) : null;
    }

    // 游戏数据存储
    const TempDataStore = {
        steamGameData: null,
        saleGameData: null, // /xboot/steamGame/getOne?
        setGameData(data) {
            this.steamGameData = data;
        },
        getGameData() {
            return this.steamGameData || {
                result: {
                    content: []
                }
            };
        },
        getRatingByAppId(appId) {
            const gameList = this.getGameData().result.content;
            const targetGame = gameList.find(game => game.appId === appId);
            return targetGame?.rating || 0;
        },
    };

    // 接口拦截
    ajaxHooker.hook(request => {
        // 处理原有接口
        if (request.url.includes('/xboot/steamGame/keyHot')) {
            request.response = (res) => {
                try {
                    const originalData = JSON.parse(res.responseText);
                    TempDataStore.setGameData(originalData);
                    res.responseText = JSON.stringify(originalData);
                } catch (e) {
                    console.error('keyHot接口数据处理失败：', e);
                }
            };
        }
        else if (request.url.includes('/xboot/steamGame/getOne')) {
            request.response = (res) => {
                try {
                    const originalData = JSON.parse(res.responseText);
                    if (originalData.code === 200 && originalData.success === true) {
                        const data = originalData.result;
                        const showArea = $(".market-content > .market-detail > div:nth-child(3)")
                        showArea.append(`<div data-v-3911ff65="" class="ht100 mt-50" style="flex-wrap: wrap;"><span class="f20-rem mt-20-rem ml-20-rem">历史销售数量 ${data.keyTx}</span></div> `)
                    } else {
                        console.log('getOne接口数据处理失败：', originalData);
                    }

                } catch (e) {
                    console.error('getOne接口数据处理失败：', e);
                }
            };
        }
        return request;
    });

    // 单个游戏评分更新（使用Steam风格文本描述）
    function updateGameRating(gameBlock) {
        if (!gameBlock) return;

        const appId = getSteamAppId(gameBlock);
        if (steamGameList.wish.includes(appId)) {
            // add blue borader class
            const gameName = gameBlock.querySelector('.gameName')
            console.log(gameName);

            gameName.classList.add('bg-blue');
        }
        const gameHead = gameBlock.querySelector('.gameHead');

        // 只有存在有效ID时才处理评分
        if (appId && gameHead) {
            const rating = TempDataStore.getRatingByAppId(appId);
            const ratingEl = gameHead.querySelector('.gameRating');

            // 有评分数据
            if (rating > 0) {
                // 计算百分比并映射到Steam评分等级
                const ratingPercent = Math.round(rating * 100);
                let ratingText, ratingClass;

                // Steam风格评分标准
                if (ratingPercent >= 90) {
                    ratingText = "好评如潮";
                    ratingClass = "overwhelmingly-positive";
                } else if (ratingPercent >= 80) {
                    ratingText = "特别好评";
                    ratingClass = "very-positive";
                } else if (ratingPercent >= 70) {
                    ratingText = "多半好评";
                    ratingClass = "positive";
                } else if (ratingPercent >= 40) {
                    ratingText = "褒贬不一";
                    ratingClass = "mixed";
                } else if (ratingPercent >= 20) {
                    ratingText = "多半差评";
                    ratingClass = "negative";
                } else {
                    ratingText = "特别差评";
                    ratingClass = "very-negative";
                }

                if (ratingEl) {
                    // 只在内容变化时更新
                    if (ratingEl.textContent !== ratingText) {
                        ratingEl.textContent = ratingText;
                    }

                    // 更新评分等级类名
                    if (!ratingEl.classList.contains(ratingClass)) {
                        ratingEl.classList.remove(
                            'overwhelmingly-positive',
                            'very-positive',
                            'positive',
                            'mixed',
                            'negative',
                            'very-negative'
                        );
                        ratingEl.classList.add(ratingClass);
                    }
                } else {
                    // 创建新评分标签
                    const newRatingEl = document.createElement('div');
                    newRatingEl.className = `gameRating ${ratingClass}`;
                    newRatingEl.textContent = ratingText;
                    gameHead.appendChild(newRatingEl);
                }
            }
            // 无评分数据则移除标签
            else if (ratingEl) {
                ratingEl.remove();
            }
        }
    }

    // 同步更新评分样式
    function injectRatingStyle() {
        const existingStyle = document.getElementById('ratingStyle');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'ratingStyle';
        style.textContent = `
        .gameHead .gameRating {
            padding: 0 8px !important;
            height: .3rem !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            color: #fff !important;
            text-align: center !important;
            line-height: .3rem !important;
            border-radius: .09rem 0 0 0 !important;
            font-size: .12rem !important;
            font-weight: bold !important;
            z-index: 10 !important;
            white-space: nowrap !important;
        }
        /* Steam风格评分颜色 */
        .gameRating.overwhelmingly-positive { background: #4CAF50 !important; } /* 好评如潮 - 深绿 */
        .gameRating.very-positive { background: #8BC34A !important; } /* 特别好评 - 中绿 */
        .gameRating.positive { background: #CDDC39 !important; color: #333 !important; } /* 多半好评 - 浅绿 */
        .gameRating.mixed { background: #FFC107 !important; color: #333 !important; } /* 褒贬不一 - 黄色 */
        .gameRating.negative { background: #FF9800 !important; } /* 多半差评 - 橙色 */
        .gameRating.very-negative { background: #F44336 !important; } /* 特别差评 - 红色 */
    `;
        document.head.appendChild(style);
    }


    // 筛选UI
    function createFilterUI() {
        const ui = document.createElement('div');
        ui.id = 'priceFilterContainer';
        ui.className = 'ml-5-rem flex-row align-items-center'; // 复用网站现有类
        ui.style.cssText = `
            font-family:Arial,sans-serif;
            font-size:.13rem; /* 13px → 0.13rem */
            gap:.08rem; /* 8px → 0.08rem */
            padding:.08rem; /* 8px → 0.08rem */
            border-radius:.04rem; /* 4px → 0.04rem，与网站按钮一致 */
            height:.25rem; /* 与网站.tagBtn系列高度一致 */
            box-sizing:border-box; /* 确保padding不影响高度 */
        `;

        // 标题（复用网站标签样式）
        const title = document.createElement('span');
        title.className = 'tag-titleOne ml-3-rem'; // 复用网站标题类
        title.textContent = '价格筛选';
        title.style.fontWeight = 'bold';
        ui.appendChild(title);

        // 预设按钮容器
        const presetContainer = document.createElement('div');
        presetContainer.className = 'flex-row jc-space-flex-start align-items-center pr5-rem'; // 复用网站布局类
        presetContainer.style.gap = '.08rem'; // 8px → 0.08rem

        // 预设按钮配置
        const presets = [{
            text: '0-20元',
            min: 0,
            max: 20
        },
        {
            text: '20元以上',
            min: 20,
            max: 9999
        }
        ];

        presets.forEach(p => {
            const btn = document.createElement('div');
            btn.className = 'tagBtn'; // 复用网站按钮类
            btn.dataset.min = p.min;
            btn.dataset.max = p.max;
            btn.textContent = p.text;

            // 基础样式（与网站.tagBtn保持一致）
            const baseStyle = `
                padding:.04rem .1rem; /* 4px 10px → 0.04rem 0.1rem */
                border-radius:.04rem; /* 与网站一致 */
                cursor:pointer;
                font-size:.13rem; /* 13px → 0.13rem */
                border:1px solid #ddd;
                color:#666;
                background:transparent;
                transition:all 0.2s;
                box-sizing:border-box;
                height:.25rem; /* 与网站按钮高度一致 */
                line-height:.17rem; /* 高度 - 2*padding = 0.25-0.08=0.17rem */
            `;

            btn.style.cssText = baseStyle;

            // 激活状态样式（匹配网站高亮风格）
            if (filterState.isActive && filterState.minPrice === p.min && filterState.maxPrice === p.max) {
                btn.style.cssText = `
                    ${baseStyle}
                    border:1px solid #409EFF;
                    color:#fff;
                    background:#409EFF;
                `;
            }

            btn.onclick = () => {
                filterState.minPrice = p.min;
                filterState.maxPrice = p.max;
                filterState.isActive = true;
                StateManager.saveState(filterState);
                syncInputValues();
                applyFilterGameList();
                updatePresetHighlights();
            };
            presetContainer.appendChild(btn);
        });
        ui.appendChild(presetContainer);

        // 输入框容器
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex-row align-items-center'; // 复用网站布局类
        inputContainer.style.gap = '.08rem'; // 8px → 0.08rem

        // 最低价格输入框
        const minInp = document.createElement('input');
        minInp.id = 'priceFilterMin';
        minInp.type = 'number';
        minInp.placeholder = '最低价';
        minInp.min = 0;
        minInp.style.cssText = `
            width:.7rem; /* 70px → 0.7rem */
            height:.28rem; /* 28px → 0.28rem */
            padding:0 .08rem; /* 0 8px → 0 0.08rem */
            border:1px solid #ccc;
            border-radius:.04rem; /* 与网站一致 */
            box-sizing:border-box;
            font-size:.13rem; /* 13px → 0.13rem */
            line-height:.12rem; /* 确保文本垂直居中 */
        `;
        minInp.addEventListener('input', (e) => {
            filterState.minPrice = parseFloat(e.target.value) || 0;
            filterState.isActive = true;
            StateManager.saveState(filterState);
        });

        // 分隔符
        const separator = document.createTextNode('-');
        separator.nodeValue = '-';

        // 最高价格输入框
        const maxInp = document.createElement('input');
        maxInp.id = 'priceFilterMax';
        maxInp.type = 'number';
        maxInp.placeholder = '最高价';
        maxInp.min = 0;
        maxInp.style.cssText = minInp.style.cssText; // 与最低价输入框样式一致
        maxInp.addEventListener('input', (e) => {
            filterState.maxPrice = parseFloat(e.target.value) || 9999;
            filterState.isActive = true;
            StateManager.saveState(filterState);
        });

        // 筛选按钮（匹配网站按钮风格）
        const filterBtn = document.createElement('button');
        filterBtn.className = 'ivu-btn ivu-btn-default ivu-btn-sm'; // 复用网站IVUE按钮类
        filterBtn.textContent = '筛选';
        filterBtn.style.cssText = `
            margin-left:.04rem; /* 4px → 0.04rem */
            padding:.04rem .12rem; /* 4px 12px → 0.04rem 0.12rem */
            cursor:pointer;
            background:#409EFF;
            color:white;
            border:1px solid #409EFF;
            border-radius:.04rem; /* 与网站一致 */
            font-size:.13rem; /* 13px → 0.13rem */
            height:.28rem; /* 与输入框高度一致 */
            line-height:.2rem; /* 高度 - 2*padding = 0.28-0.08=0.2rem */
            box-sizing:border-box;
            border:none; /* 清除IVUE默认边框 */
        `;
        filterBtn.onclick = () => {
            applyFilterGameList();
            updatePresetHighlights(false);
        };

        inputContainer.append(minInp, separator, maxInp, filterBtn);
        ui.appendChild(inputContainer);

        return ui;
    }

    function insertFilterUI() {
        if (document.getElementById('priceFilterContainer')) return;
        const ui = createFilterUI();
        const targetContainer = document.querySelector('.tag.flex-row.align-items-center');
        if (targetContainer) {
            targetContainer.appendChild(ui);
            syncInputValues();
        }
        if (filterState.isActive) {
            applyFilterGameList();
        }
    }

    // 更新预设按钮高亮状态
    function updatePresetHighlights(shouldHighlight = true) {
        const baseStyle = `
            padding:.04rem .1rem;
            border-radius:.04rem;
            cursor:pointer;
            font-size:.13rem;
            border:1px solid #ddd;
            color:#666;
            background:transparent;
            transition:all 0.2s;
            box-sizing:border-box;
            height:.25rem;
            line-height:.17rem;
        `;

        document.querySelectorAll('.tagBtn[data-min]').forEach(btn => {
            const btnMin = parseFloat(btn.dataset.min);
            const btnMax = parseFloat(btn.dataset.max);
            const isMatch = filterState.isActive && filterState.minPrice === btnMin && filterState.maxPrice === btnMax;

            btn.style.cssText = shouldHighlight && isMatch ?
                `
                    ${baseStyle}
                    border:1px solid #409EFF;
                    color:#fff;
                    background:#409EFF;
                ` :
                baseStyle;
        });
    }

    // 价格筛选核心逻辑
    function syncInputValues() {
        const minInp = document.getElementById('priceFilterMin');
        const maxInp = document.getElementById('priceFilterMax');
        if (minInp && filterState.isActive) minInp.value = filterState.minPrice;
        if (maxInp && filterState.isActive) maxInp.value = filterState.maxPrice;
    }


    function processGameOpen(gameBlock) {
        if (gameBlock.dataset.filterProcessed) return;
        gameBlock.dataset.filterProcessed = 'true';

        gameBlock.addEventListener('mousedown', e => {
            if (e.button === 1 && !e.ctrlKey && !e.shiftKey) {
                const appId = getSteamAppId(gameBlock);
                if (appId) {
                    e.preventDefault();
                    window.open(`https://store.steampowered.com/app/${appId}/`, '_blank');
                }
            }
        });
    }


    function $dom(selector) {
        return $(selector).get(0);
    }

    function $vue(selector) {
        return $dom(selector).__vue__;
    }


    function applyFilterGameList() {
        const vueData = $dom(".game_layout .game_layout").__vue__
        const gameList = vueData.gameList

        const filterGameList = gameList.filter(game => {
            const price = game.keyPrice;

            const shouldShow = !filterState.isActive ||
                (price >= filterState.minPrice && price <= filterState.maxPrice);
            const appId = game.appId;
            const appIdInt = parseInt(appId);

            if (steamGameList && steamGameList.own && steamGameList.own.includes(appIdInt)) {
                return false
            }
            return shouldShow
        })

        if (filterGameList.length !== gameList.length) {
            vueData.gameList = filterGameList
        }
    }

    async function startContentMonitor() {
        await elmGetter.get('div.ivu-tabs-content  div.flex-row.jc-space-flex-start.flex-wrap.w-auto');

        addUpdatedHook($dom(".ivu-tabs-tabpane"), function () {
            applyFilterGameList();

            const gameBlocks = this.$el.querySelectorAll('.gameblock');
            // 遍历每个.gameblock执行处理
            gameBlocks.forEach(gameBlock => {
                // 应用筛选和评分更新
                updateGameRating(gameBlock);
                // 处理游戏块核心逻辑
                processGameOpen(gameBlock);
            });
        })

        // 初始加载后执行一次
        setTimeout(() => {
            applyFilterGameList();
            // 初始加载时对所有可见游戏更新评分
            document.querySelectorAll('.gameblock')
                .forEach(gameBlock => updateGameRating(gameBlock));
        }, 600);
    }


    async function startSellListListener() {
        d("startSellListListener");

        const el = await elmGetter.get("#main > div.main > div.single-page-con > div.single-page > div:has(.cdkTrade-layout)")
        d("found sell list div",el)
        const vm = el[0].__vue__
        vm.$watch('sellList',  function (newVal) {
            console.debug('sellList 已更新');
            if(newVal === undefined && vm.sellList === undefined){
                d('newVal === undefined && vm.sellList === undefined')
                return
            }
            this.$nextTick(async () => {
                console.log(await elmGetter.get('.orderOne.bg-white .list-item'));
                $('.orderOne.bg-white .list-item').each(async function (index, item) {
                    const minPriceElement = item.querySelector('div:nth-child(7)');
                    
                    const data = vm.sellList[index];
                    const selfPrice = data.keyPrice;
                    minPriceElement.innerText = `${selfPrice}`;
                    minPriceElement.classList.remove('color-red');
                    if (data.stock === 0) return
                    
                    const gameId = data.gameId;
                    const sellerData = await getSaleList(gameId);
                    const combinedData = {
                        gameName: data.steamGame.gameName,
                        sellerData: sellerData,
                        keyData: data
                    };
                    d(combinedData);

                    if (sellerData.code !== 200) {
                        console.error(sellerData.msg);
                        return
                    }
                    
                    const sellerList = sellerData.result?.content || [];
                    let order = 1
                    let minPrice = sellerList[0].keyPrice

                    if(minPrice >= selfPrice) {
                        d(`minPrice >= selfPrice ${minPrice} >= ${selfPrice}`)

                        return
                    }
                    for (const seller of sellerList) {
                        if (seller.saleId === data.sellerId) {
                            break
                        }
                        if (seller.keyPrice < selfPrice) {
                            order += seller.stock
                        }
                    }
                    d("order", order)
                    if (order !== 1) {
                        
                        if (minPriceElement) {
                            minPriceElement.classList.add('color-red');
                            const rawText = minPriceElement.innerText;
                            
                            minPriceElement.innerText = `${selfPrice} 最低价${minPrice}`;
                            minPriceElement.setAttribute('data-rawtext', rawText);
                            
                        };
                    }else{

                        d("already min price")
                    }
                })

            })}, { immediate: true })
    }

    async function startModalListener() {
        const vm = $dom("#main > div.main > div.single-page-con > div > div").__vue__
        const originalGoToChoose = vm.goToChoose;

        vm.goToChoose = function (e) {
            originalGoToChoose.call(this, e);
            this.$nextTick(() => {
                console.debug('DOM 已更新，当前选择的游戏ID：', this.gameId);
                const $modal = $('.ivu-modal').filter(':visible');
                addHisPriceToModal($modal, this.modalGamList[e], this); // 此时 modal 已完成渲染
            });
        };

        console.log('seller 弹窗监听器已启动');
    }

    function addHisPriceToModal(modal, gameData, vm) {
        console.debug(gameData);

        // 1. 从传入的modal中获取当前最低价格标签（使用jQuery选择器）
        const $currentMinPriceLabel = modal.find('.mt-15.f15.fw500 .color-red.f12-rem');
        if (!$currentMinPriceLabel.length) {
            console.log('弹窗内未找到当前最低价格标签');
            return;
        }
        // 3. 从已就绪的数据中获取历史最低价
        const hisPrice = gameData.hisPrice
        if (hisPrice === null) {
            console.log(`【${currentGameName}】无历史价格数据`);
            return;
        }

        // 4. 防重复：检查当前弹窗内是否已添加过历史价格标签（仅在当前modal内查找）
        if (modal.find('.his-price-tag').length) {
            return;
        }

        // 5. 创建并插入历史价格标签（样式优化：与原价格区分）
        const hisPriceSpan = document.createElement('span');
        hisPriceSpan.className = 'his-price-tag color-blue f12-rem ml-10'; // 蓝色+左间距
        hisPriceSpan.textContent = ` 历史最低价格: ￥${hisPrice.toFixed(2)}`; // 保留2位小数，格式统一

        $currentMinPriceLabel.after(hisPriceSpan);

        // 价格是 xx.x 格式（1位小数），放大10倍转为整数（如 12.3 → 123）
        const keyPriceInt = Math.round(Number(gameData.keyPrice) * 10);
        // 减去 0.1（即 1/10，对应整数减 1）
        const cdkPriceInt = keyPriceInt - 1;
        // 转回一位小数
        vm.cdkPrice = cdkPriceInt / 10;
    }

    async function addQuantitySort() {
        try {
            // 1. 等待并获取父容器（用jQuery选择器，兼容动态加载元素）
            // 若elmGetter是自定义元素等待工具，可保留await；若无需等待，直接用 $(selector) 即可
            const $parent = await elmGetter.get('.flex-row > .c-point.flex-row.align-items-center');

            if (!$parent.length) {
                console.warn('未找到按钮父容器，无法添加"数量"排序按钮');
                return;
            }

            // 2. 查找所有目标按钮（jQuery find 简化选择器）
            const $targetBtns = $parent.find('.ml-5-rem.c-point.tagBtn');
            if (!$targetBtns.length) {
                console.warn('未找到目标按钮（.ml-5-rem.c-point.tagBtn），无法添加"数量"排序按钮');
                return;
            }

            // 3. 关键：从现有目标按钮提取Vue scoped CSS的data-v属性（支持多个data-v属性）
            const $sampleBtn = $targetBtns.first(); // 取任意一个现有按钮当"样本"
            const vueDataAttrs = {}; // 存储提取的data-v属性（键：data-v-xxx，值：属性值）
            // 遍历样本按钮的所有属性，筛选出data-v-开头的属性
            $.each($sampleBtn[0].attributes, (i, attr) => {
                if (attr.name.startsWith('data-v-')) {
                    vueDataAttrs[attr.name] = attr.value; // 保存属性名和值（如data-v-e7c25b08: ""）
                }
            });

            // 3. 取最后一个目标按钮（jQuery last() 直接获取，无需计算索引）
            const $lastTargetBtn = $targetBtns.last();

            // 4. jQuery链式创建按钮（避免多次createElement，语法更简洁）
            const $quantityBtn = $('<div>')
                .addClass('ml-5-rem c-point tagBtn') // 批量添加类名
                .attr(vueDataAttrs)
                .append(
                    $('<span>')
                        .addClass('tag-title')
                        .text('数量').attr(vueDataAttrs) // 设置文本
                );

            const form = await elmGetter.get("#main > div.main > div.single-page-con > div > div")
            const formVue = form[0].__vue__

            const handleSortClick = function () {
                // 找到**所有排序按钮**（包括原有和新添加的"数量"按钮）
                const $allSortBtns = $parent.find('.ml-5-rem.c-point.tagBtn');
                // 移除所有按钮的active状态
                $allSortBtns.removeClass('active');
                // 给当前点击的按钮添加active
                $(this).addClass('active');
                formVue.sellForm.sort = "stock"
                formVue.sellForm.pageNumber = 1
                formVue.getSellData()
            };

            // 6. 给新按钮绑定通用点击事件
            $quantityBtn.on('click', handleSortClick);
            $targetBtns.on('click', handleSortClick);

            // 6. 插入新按钮（jQuery after() 直接插入，支持jQuery对象）
            $lastTargetBtn.after($quantityBtn);

            console.log('成功添加"数量"排序按钮');
        } catch (error) {
            console.error('添加"数量"排序按钮失败：', error);
        }
    }

    // 路径处理
    const TARGET_PATH = '/cdKey/cdKey';
    const SELLER_CDKEY_PATH = '/pyUserInfo/sellerCDKey'; // 新增路径
    const CdkDeatil_PATH = '/cdkDetail';
    let isInitialized = false;
    let isSellerInitialized = false; // 新增状态标识

    function isTargetPath() {
        return window.location.pathname.startsWith(TARGET_PATH);
    }

    // 新增：检查是否为卖家CDKey路径
    function isSellerCDKeyPath() {
        return window.location.pathname.startsWith(SELLER_CDKEY_PATH);
    }

    function cleanUp() {
        if (!isInitialized) return;
        isInitialized = false;
    }

    function sellerCleanUp() {
        if (!isSellerInitialized) return;
        isSellerInitialized = false;
        d('sellerCleanUp')
    }

    function handlePathChange() {
        // 处理原有路径逻辑
        if (isTargetPath() && !isInitialized) {
            console.log("run script in cdKey path");
            buyInit();
        } else if (!isTargetPath() && isInitialized) {
            cleanUp();
        }

        // 新增：处理卖家CDKey路径逻辑
        if (isSellerCDKeyPath() && !isSellerInitialized) {
            console.log("run script in sellerCDKey path");
            sellerInit(); // 调用新增的初始化函数
        } else if (!isSellerCDKeyPath() && isSellerInitialized) {
            sellerCleanUp();
        }
        // https://steampy.com/cdkDetail?name=cn&gameId=815763235650146304
        if (window.location.pathname.startsWith(CdkDeatil_PATH)) {
            console.log("run script in cdkDetail path");
            buyKeyInit();
        }
    }

    async function buyKeyInit() {

    }

    async function buyInit() {
        if (isInitialized) return;
        injectRatingStyle();
        await elmGetter.get('.tag.flex-row.align-items-center')
        insertFilterUI()
        await startContentMonitor();
        isInitialized = true;
    }

    function d(...args) {
        console.debug(...args);
    }

    async function sellerInit() {
        if (isSellerInitialized) { d("seller already initialized"); return};
        await elmGetter.get("div.main > div.single-page-con > div > div",$dom("#main"))
        d('sellerInit')
        startModalListener()
        addQuantitySort()
        startSellListListener()
        isSellerInitialized = true;
    }

    // 监听历史变化
    let lastPath = location.pathname + location.search;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        const newPath = location.pathname + location.search;
        if (newPath !== lastPath) {
            lastPath = newPath;
            handlePathChange();
        }
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        const newPath = location.pathname + location.search;
        if (newPath !== lastPath) {
            lastPath = newPath;
            handlePathChange();
        }
    };

    window.addEventListener('popstate', handlePathChange);
    window.addEventListener('hashchange', handlePathChange);

    elmGetter.selector($)
    console.log(elmGetter.selector($));

    handlePathChange();
})();