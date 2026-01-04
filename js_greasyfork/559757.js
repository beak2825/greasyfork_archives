// ==UserScript==
// @name            雪球 · 第三方资源扩展
// @namespace       https://github.com/garinasset/XueqiuResourceLinks
// @version         14.0.0
//
// @description     在雪球股票详情页侧边栏，添加相应“个股”的“第三方资源”，例如上证 e 互动、深交所互动易、SEC: EDGAR、港交所披露易等，点击即可跳转到对应个股的第三方资源站点，便利研究，提升生产力。
//
// @author          garinasset
// @license         MIT
//
// @homepageURL     https://github.com/garinasset/XueqiuResourceLinks
// @supportURL      https://github.com/garinasset/XueqiuResourceLinks/issues
//
// @match           https://xueqiu.com/S/*
// @run-at          document-end
//
// @grant           GM_xmlhttpRequest
//
// @connect         www.sec.gov
// @connect         www1.hkexnews.hk
// @connect         sns.sseinfo.com
// @connect         irm.cninfo.com.cn
//
// @downloadURL https://update.greasyfork.org/scripts/559757/%E9%9B%AA%E7%90%83%20%C2%B7%20%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B5%84%E6%BA%90%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/559757/%E9%9B%AA%E7%90%83%20%C2%B7%20%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B5%84%E6%BA%90%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /**
     * 通用缓存封装
     * - 使用 localStorage
     * - 仅缓存非 null 的成功结果
     * - 失败统一返回 null，不抛异常，避免中断整体流程
     */
    function fetchWithCache(key, fetcher) {
        console.log('[Cache] Check key:', key);

        return new Promise(resolve => {
            const cached = localStorage.getItem(key);
            if (cached) {
                console.log('[Cache] Hit:', key);
                return resolve(cached);
            }

            console.log('[Cache] Miss, fetching:', key);

            fetcher()
                .then(result => {
                    if (result != null) {
                        console.log('[Cache] Save:', key);
                        localStorage.setItem(key, result);
                    }
                    resolve(result);
                })
                .catch(err => {
                    console.log('[Cache] Fetch error:', key, err);
                    resolve(null);
                });
        });
    }

    /**
     * 从雪球页面解析当前股票的交易所与代码
     *
     * 失败场景：
     * - 页面结构变化
     * - 非标准雪球股票页面
     *
     * @returns {{exchange: string, code: string} | null}
     */
    function parseStockInfo() {
        const el = document.querySelector('h1.stock-name');
        if (!el) {
            console.log('[Stock] stock-name element not found');
            return null;
        }

        const match = el.textContent.match(
            /\((SH|SZ|HK|NASDAQ|NYSE|PINK|AMEX|ARCA):([\w\d\.-]+)\)/i
        );

        if (!match) {
            console.log('[Stock] Failed to parse exchange/code');
            return null;
        }

        const info = {
            exchange: match[1].toUpperCase(),
            code: match[2].toUpperCase()
        };

        console.log('[Stock] Parsed:', info);
        return info;
    }

    const stock = parseStockInfo();
    if (!stock) return;

    /**
     * 查询上交所 e互动 UID
     *
     * 说明：
     * - UID 是后续构造URL 的唯一标识
     * - 接口可能变动或者偶发空返回，需容错
     */
    function fetchSseUid(stockCode) {
        const SSEINFO_URL = 'https://sns.sseinfo.com/ajax/getCompany.do';

        console.log('[Fetch] SSE UID use Stock code:', stockCode);

        return fetchWithCache('sse_uid_' + stockCode, () =>
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: SSEINFO_URL,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'data=' + stockCode,
                    onload: res => {
                        try {
                            const uid = res.responseText.trim();
                            console.log('[Fetch] SSE UID result:', uid);
                            resolve(uid);
                        } catch (e) {
                            console.log('[Parse] SSE UID failed:', e);
                            resolve(null);
                        }
                    },
                    onerror: err => {
                        console.log('[Fetch] SSE UID error:', err);
                        resolve(null);
                    }
                });
            })
        );
    }

    /**
     * 深交所：查询 orgId（互动易）
     *
     * 说明：
     * - orgId 是后续构造URL 的唯一标识
     * - 接口可能变动或者偶发空返回，需容错
     */
    function fetchSzOrgId(stockCode) {
        const CNINFO_URL = 'https://irm.cninfo.com.cn/newircs/index/queryKeyboardInfo';

        console.log('[Fetch] SZ orgId use Stock code:', stockCode);

        return fetchWithCache('sz_orgid_' + stockCode, () =>
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: CNINFO_URL,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'keyWord=' + stockCode,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText);
                            const orgId = json?.data?.[0]?.secid || null;
                            console.log('[Fetch] SZ orgId result:', orgId);
                            resolve(orgId);
                        } catch (e) {
                            console.log('[Parse] SZ orgId failed:', e);
                            resolve(null);
                        }
                    },
                    onerror: err => {
                        console.log('[Fetch] SZ orgId error:', err);
                        resolve(null);
                    }
                });
            })
        );
    }


    /**
     * 美股：通过 ticker 查询 SEC CIK
     * 注意：SEC 使用 "-" 而非 "."
     *
     * 说明：
     * - CIK 是后续构造URL 的唯一标识
     * - 接口可能变动或者偶发空返回，需容错
     */
    function fetchUsCik(ticker) {
        const SEC_JSON_URL = 'https://www.sec.gov/files/company_tickers.json';

        ticker = ticker.replace('.', '-');
        console.log('[Fetch] SEC CIK use Stock code:', ticker);

        return fetchWithCache('us_cik_' + ticker, () =>
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: SEC_JSON_URL,
                    onload: res => {
                        try {
                            const data = JSON.parse(res.responseText);
                            const entry = Object.values(data).find(
                                item => item.ticker.toUpperCase() === ticker.toUpperCase()
                            );
                            const cik = entry?.cik_str != null
                                ? String(entry.cik_str).padStart(10, '0')
                                : null;

                            console.log('[Fetch] SEC CIK result:', cik);
                            resolve(cik);
                        } catch (e) {
                            console.log('[Parse] SEC CIK failed:', e);
                            resolve(null);
                        }
                    },
                    onerror: err => {
                        console.log('[Fetch] SEC CIK error:', err);
                        resolve(null);
                    }
                });
            })
        );
    }

    /**
     * 港股：查询 stockId（披露易）
     *
     * 说明：
     * - stockId 是后续构造URL 的唯一标识
     * - 接口可能变动或者偶发空返回，需容错
     */
    function fetchHkStockId(code) {
        const HKEXNEWS_URL = `https://www1.hkexnews.hk/search/prefix.do?callback=callback&lang=ZH&type=A&name=${encodeURIComponent(code)}`;

        console.log('[Fetch] HK stockId use Stock code:', code);

        return fetchWithCache('hk_stockid_' + code, () =>
            new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: HKEXNEWS_URL,
                    onload: res => {
                        try {
                            const text = res.responseText.trim();
                            const jsonText = text
                                .replace(/^callback\(/, '')
                                .replace(/\);$/, '');
                            const json = JSON.parse(jsonText);
                            const stockId = json?.stockInfo?.[0]?.stockId || null;

                            console.log('[Fetch] HK stockId result:', stockId);
                            resolve(stockId);
                        } catch (e) {
                            console.log('[Parse] HK stockId failed:', e);
                            resolve(null);
                        }
                    },
                    onerror: err => {
                        console.log('[Fetch] HK stockId error:', err);
                        resolve(null);
                    }
                });
            })
        );
    }

    /**
     * 不同交易所的查询与链接构建规则
     */
    const EXCHANGE_MAP = {
        SH: {
            fetcher: fetchSseUid,
            buildLink: uid =>
                uid && {
                    text: '上证 e 互动',
                    url: `https://sns.sseinfo.com/company.do?uid=${uid}`,
                    favicon: 'https://sns.sseinfo.com/favicon.ico'
                }
        },
        SZ: {
            fetcher: fetchSzOrgId,
            buildLink: orgId =>
                orgId && {
                    text: '深交所互动易',
                    url: `https://irm.cninfo.com.cn/ircs/company/companyDetail?stockcode=${stock.code}&orgId=${orgId}`,
                    favicon: 'https://irm.cninfo.com.cn/favicon.ico'
                }
        },
        HK: {
            fetcher: fetchHkStockId,
            buildLink: stockId =>
                stockId && {
                    text: '披露易',
                    url: `https://www1.hkexnews.hk/search/titlesearch.xhtml?lang=zh&stockId=${stockId}&category=0&market=SEHK`,
                    favicon: 'https://www.hkexnews.hk/ncms/images/favicon.ico'
                }
        },
        NASDAQ: { fetcher: fetchUsCik, buildLink: buildSecLink },
        NYSE: { fetcher: fetchUsCik, buildLink: buildSecLink },
        PINK: { fetcher: fetchUsCik, buildLink: buildSecLink },
        AMEX: { fetcher: fetchUsCik, buildLink: buildSecLink },
        ARCA: { fetcher: fetchUsCik, buildLink: buildSecLink },
    };

    function buildSecLink(cik) {
        return (
            cik && {
                text: 'SEC：EDGAR',
                url: `https://www.sec.gov/edgar/browse/?CIK=${cik}`,
                favicon: 'https://www.sec.gov/favicon.ico'
            }
        );
    }

    const config = EXCHANGE_MAP[stock.exchange];
    if (!config) {
        console.log('[Exchange] Unsupported:', stock.exchange);
        return;
    }

    /**
     * 第三方资源定义列表
     * 重要设计：
     * - 每一个元素都代表一个“资源位”
     * - 即使加载失败（返回 null），前端也会保留占位
     */
    const thirdPartyResources = [
        {
            exchange: stock.exchange,
            urlFetcher: () =>
                config
                    .fetcher(stock.code)
                    .then(config.buildLink)
                    .catch(err => {
                        console.log('[Fetch] Primary resource failed:', err);
                        return null;
                    })
        }
    ];
    // 港股｜美股 | A 股
    if (['SH', 'SZ', 'HK', 'NASDAQ', 'NYSE', 'PINK', 'AMEX', 'ARCA'].includes(stock.exchange)) {
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: '电报',
                url: `https://www.cls.cn/searchPage?keyword=${stock.code}&type=telegram`,
                favicon: 'https://cdnjs.cls.cn/www/20200601/image/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => {
                // 富途后缀逻辑：
                // - 美股（NASDAQ/NYSE/PINK/AMEX/ARCA）统一使用 "US" 作为后缀
                // - 其他则使用交易所本身（如 SH、SZ、HK）
                // 构造形式："<code>-<suffix>"，示例：600519-SH、0700-HK、AAPL-US
                const suffix = ['NASDAQ', 'NYSE', 'PINK', 'AMEX', 'ARCA'].includes(stock.exchange)
                    ? 'US'
                    : stock.exchange;

                // 对整体进行 URL 编码，确保特殊字符（如果有）安全传输
                const code = encodeURIComponent(`${stock.code}-${suffix}`);

                return {
                    text: '富途牛牛',
                    url: `https://www.futunn.com/stock/${code}`,
                    favicon: 'https://www.futunn.com/favicon.ico'
                };
            }
        });
    }
    //美股｜港股
    if (['HK', 'NASDAQ', 'NYSE', 'PINK', 'AMEX', 'ARCA'].includes(stock.exchange)) {
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: '老虎证券',
                url: `https://www.laohu8.com/stock/${stock.code}`,
                favicon: 'https://www.laohu8.com/favicon.ico'
            })
        });
    }
    //美股
    if (['NASDAQ', 'NYSE', 'PINK', 'AMEX', 'ARCA'].includes(stock.exchange)) {
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: 'Bloomberg News',
                url: `https://www.bloomberg.com/search?query=${stock.code}&sort=relevance`,
                favicon: 'https://www.bloomberg.com/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: 'CNBC',
                url: `https://www.cnbc.com/quotes/${stock.code}`,
                favicon: 'https://www.cnbc.com/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: 'Seeking Alpha',
                url: `https://seekingalpha.com/symbol/${encodeURIComponent(stock.code)}`,
                favicon: 'https://seekingalpha.com/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: 'Stocktwits',
                url: `https://stocktwits.com/symbol/${encodeURIComponent(stock.code)}`,
                favicon: 'https://stocktwits.com/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: 'finviz',
                url: `https://finviz.com/quote.ashx?t=${encodeURIComponent((stock.code).replace(/\./g, '-'))}`,
                favicon: 'https://finviz.com/favicon.ico'
            })
        });

    }
    //A 股
    if (['SH', 'SZ'].includes(stock.exchange)) {
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: '研报中心',
                url: `https://data.eastmoney.com/report/${encodeURIComponent(stock.code)}.html`,
                favicon: 'https://data.eastmoney.com/favicon.ico'
            })
        });
        thirdPartyResources.push({
            exchange: stock.exchange,
            urlFetcher: async () => ({
                text: '股吧',
                url: `https://guba.eastmoney.com/list,${encodeURIComponent(stock.code)}.html`,
                favicon: 'https://guba.eastmoney.com/favicon.ico'
            })
        });
    }

    const side = document.querySelector('.container-side-sm');
    if (!side) return;

    let widget = side.querySelector('.stock-widget[data-thirdparty]');
    if (!widget) {
        widget = document.createElement('div');
        widget.className = 'stock-widget';
        widget.setAttribute('data-thirdparty', 'true');
        widget.innerHTML =
            '<div class="widget-header"><div class="title">第三方资源扩展</div></div>' +
            '<div class="widget-content third-party-links"></div>';

        const firstWidget = side.querySelector('.stock-widget');
        side.insertBefore(widget, firstWidget?.nextSibling || side.firstChild);
    }

    const container = widget.querySelector('.third-party-links');

    if (!document.getElementById('third-party-links-style')) {
        const style = document.createElement('style');
        style.id = 'third-party-links-style';
        style.textContent = `
            .third-party-links { display:flex; flex-wrap:wrap; align-items:center; gap:4px; }
            .third-party-links__item { display:inline-flex; align-items:center; }
            .third-party-links__item a { display:inline-flex; align-items:center; text-decoration:none; color:#333; padding:4px 0; }
            .third-party-links__item a:hover { text-decoration:underline; }
            .third-party-links__icon { width:16px; height:16px; margin-right:4px; }
            .third-party-links__separator { margin:0 4px; color:#888; }
        `;
        document.head.appendChild(style);
    }

    /**
     * 拉取并渲染第三方资源入口
     *
     * 设计目标：
     * 1. 所有资源并行请求，但前端渲染顺序必须稳定
     * 2. 单个资源失败不影响整体渲染（失败资源保留占位）
     * 3. 明确区分「尚无资源定义」与「资源加载失败」
     */
    async function fetchLinks() {

        /**
     * 创建一个“状态占位节点”
     *
     * 该函数统一生成以下几类 UI 状态：
     * - 加载中（带动画）
     * - 加载失败
     * - 尚无资源
     * - 未知内部错误
     *
     * 统一封装的目的：
     * - 避免重复创建 DOM 结构
     * - 保证不同状态在布局和尺寸上的一致性
     */
        function createStatusItem({ text, color = 'red', animate = false }) {
            const span = document.createElement('span');
            span.className = 'third-party-links__item';

            span.innerHTML = `
            <div class="third-party-links__item">
                <div class="third-party-links__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                        <!-- 圆环主体：加载中时用于动画，失败状态仅作为图形容器 -->
                        <circle cx="25" cy="25" r="20" stroke="${color}" stroke-width="4" fill="none">
                            ${
                // animate=true 时，显示循环颜色动画，表示“正在处理”
                animate
                    ? '<animate attributeName="stroke" values="blue;yellow;red;blue" dur="2s" repeatCount="indefinite"/>'
                    : ''
                }
                        </circle>
                        ${
                // animate=false 时，绘制一个“叉号”，表示终态（失败 / 空资源 / 错误）
                animate
                    ? ''
                    : `
                                    <line x1="15" y1="15" x2="35" y2="35" stroke="${color}" stroke-width="4"/>
                                    <line x1="35" y1="15" x2="15" y2="35" stroke="${color}" stroke-width="4"/>
                                  `
                }
                    </svg>
                </div>
                <span class="third-party-links__text">${text}</span>
            </div>
        `;
            return span;
        }

        // 预先构建所有“状态节点模板”，后续通过 cloneNode 使用
        const loadingItem = createStatusItem({ text: '正在加载···', color: 'blue', animate: true });
        const loadFailItem = createStatusItem({ text: '加载失败' });
        const emptyItem = createStatusItem({ text: '尚无资源' });
        const unknownError = createStatusItem({ text: '内部错误' });

        try {
            console.log('[Fetch] Start');

            // 首次进入时，先注入“加载中”占位，明确告知用户正在处理
            container.appendChild(loadingItem);

            /**
             * 并行执行所有资源请求
             *
             * 约定：
             * - 每个 urlFetcher 返回：
             *   - 有效资源对象 → 表示该资源可用
             *   - null / undefined → 表示该资源加载失败
             *
             * Promise.all 不抛弃失败资源，确保结果数组长度与资源定义一一对应
             */
            const results = await Promise.all(
                thirdPartyResources.map(r => r.urlFetcher())
            );

            // 统计维度：
            // total  → 定义了多少个资源位
            // valid  → 实际成功加载的资源数量
            const total = results.length;
            const valid = results.filter(Boolean).length;

            console.log('[Fetch] Completed', { total, valid });

            // 所有请求完成后，移除“加载中”状态
            container.removeChild(loadingItem);

            /**
             * total === 0 说明：
             * - 当前股票在逻辑层面没有任何可用的第三方资源定义
             * - 与“定义了资源但加载失败”是两种不同语义
             */
            if (total === 0) {
                container.appendChild(emptyItem.cloneNode(true));
                return;
            }

            /**
             * 逐个渲染资源位
             *
             * 关键设计点：
             * - 使用 results 的原始顺序
             * - 无论成功或失败，都渲染一个节点
             * - 分隔符基于“资源位顺序”，而不是“成功资源数量”
             */
            results.forEach((data, index) => {

                // 除第一个资源位外，其余资源位前统一插入分隔符
                if (index > 0) {
                    const sep = document.createElement('span');
                    sep.className = 'third-party-links__separator';
                    sep.textContent = '·';
                    container.appendChild(sep);
                }

                if (data) {
                    // 成功加载的资源：渲染为可点击链接
                    const span = document.createElement('span');
                    span.className = 'third-party-links__item';
                    span.innerHTML = `
                    <a href="${data.url}" target="_blank">
                        <img class="third-party-links__icon" src="${data.favicon}" alt="">
                        <span class="third-party-links__text">${data.text}</span>
                    </a>
                `;
                    container.appendChild(span);
                } else {
                    // 单个资源加载失败：使用失败占位，保持布局与顺序不变
                    container.appendChild(loadFailItem.cloneNode(true));
                }
            });

        } catch (error) {
            /**
             * 兜底异常分支：
             * - 理论上 Promise.all 内部已吞掉单资源错误
             * - 此处仅处理真正的“流程级异常”
             */
            console.log('[Fetch] Fatal error:', error);

            // 防御性移除：避免 loading 状态残留
            if (container.contains(loadingItem)) {
                container.removeChild(loadingItem);
            }

            // 渲染“未知错误”状态，提示用户异常非资源本身导致
            container.appendChild(unknownError.cloneNode(true));
        }
    }


    fetchLinks();

})();
